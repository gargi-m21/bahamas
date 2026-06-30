# PT-JEPA Demo — Project Context

This file contains the full context needed to work on this project. Read it before touching
any code. No other document is needed to understand what we are building or why.

---

## Problem Statement (ISRO Bhartiya Antariksh Hackathon 2026 — PS-11)

**Title:** Cross-Modal Satellite Image Retrieval Using Multi-Sensor Remote Sensing Data

### What the problem is asking

Satellite Earth observation data is acquired by sensors of fundamentally different types:

- **Optical** — captures surface reflectance in visible bands (RGB). Looks like a natural photograph. Blocked by cloud cover and unusable at night.
- **Multispectral** — captures reflectance across many spectral bands beyond visible (e.g., near-infrared, SWIR). Rich spectral signatures for land cover classification. Also cloud-limited.
- **SAR (Synthetic Aperture Radar)** — active microwave sensor that emits and receives its own signal. Captures structural/dielectric properties of surfaces, not reflectance. Works through clouds and at night. Looks nothing like an optical image — grainy, high-contrast, with speckle noise.

As satellite image archives grow into the billions, traditional metadata-based search (search by date, location, satellite name) is no longer sufficient. Users need **content-based retrieval**: given a query image, find semantically similar images regardless of when, how, or with which sensor they were acquired.

The core challenge: a forest canopy captured by optical and by SAR looks visually and numerically completely different, but they describe the same physical reality. A retrieval system must learn that these two images are semantically equivalent despite having no pixel-level similarity.

### Objectives (verbatim from PS)

1. **Same-modal retrieval**: optical→optical, SAR→SAR, multispectral→multispectral.
2. **Cross-modal retrieval**: optical→SAR, SAR→optical, optical→multispectral, multispectral→optical (and SAR↔multispectral).
3. Return ranked **top-5 and top-10** results per query.
4. **Low average retrieval latency** per query.

### Evaluation Metrics

- F1@5 and F1@10 for same-modal retrieval
- F1@5 and F1@10 for cross-modal retrieval (given **extra weight** — harder, more impactful)
- Average retrieval time per query in milliseconds

Final ranking weights both retrieval accuracy (F1) and computational efficiency (latency).
Lower latency and higher F1 are both preferred. Cross-modal performance is the differentiator.

---

## Our Solution: PT-JEPA

**PT-JEPA** = Physics-guided Token-level Joint Embedding Predictive Architecture.
It is a corrected and extended implementation of the JEPA self-supervised learning paradigm
applied to multi-modal satellite imagery, built on top of RemoteCLIP (a ViT-L backbone
pre-trained on remote sensing data via CLIP).

The solution was developed as a critique and correction of an original flawed implementation.
Eight bugs were identified and fixed before finalizing the architecture.

### Dataset: SEN12MS

Paired Sentinel-1 (SAR) and Sentinel-2 (multispectral) image patches from TU Munich.
~180K globally distributed patch pairs, four seasonal ROIs.

- **SAR input**: Sentinel-1 GRD, VV and VH polarization channels, 5m/px GSD
- **Optical input**: Sentinel-2 bands 2, 1, 0 (RGB), extracted from the 13-band file, 10m/px GSD
- **Multispectral input**: all 13 Sentinel-2 bands from the same file — zero extra data collection needed
- **Geographic splits by ROI season** (not by patch) to prevent spatial autocorrelation leakage:
  - Train: ROIs1158_spring + ROIs1868_summer
  - Val: ROIs1970_fall
  - Test: ROIs2017_winter

### Architecture (at inference)

**Context encoder (shared across modalities):**
- RemoteCLIP ViT-L backbone (pre-trained, layers 0–9 frozen)
- LoRA adapters on layers 10–23 (r=16, applied to Q and V projections)
- All LayerNorm layers unfrozen across the full depth

**Modality-specific preprocessors** (learned, lightweight):
- *Optical*: per-band learnable affine normalization (~100 params)
- *Multispectral*: per-band affine + 13→3 band projection conv (~26 params + conv)
- *SAR*: log-ratio (log(VV/VH)) + DT-CWT wavelet decomposition → 7-channel → 3-channel via 1×1 conv (~1K params)

**GSD-aware cropping**: patches are cropped so each output represents the same physical footprint (2240m) regardless of sensor GSD. Optical at 10m/px → 224px. SAR at 5m/px → 448px cropped then resized to 224px.

**Physics prompt tokens**: text embeddings from CLIP's text encoder, computed once offline from modality-describing text prompts ("Sentinel-2 optical RGB bands surface reflectance land cover", etc.). These tokens are prepended to the patch sequence before each forward pass, conditioning the shared encoder on which sensor type it's processing. Zero parameters at inference, computed once and stored.

**SAR physics indices**: three physically meaningful scalars computed from raw linear-scale VV/VH:
- CR (Cross-polarization Ratio) = VV/VH — surface vs. volumetric scattering
- RVI (Radar Vegetation Index) = 4VH/(VV+VH) — vegetation density
- NDS (Normalized Difference SAR) = (VV−VH)/(VV+VH)
These are projected to d=256 and added as a residual to SAR embeddings.

**Projection heads (two):**
- *Euclidean head*: MLP → d=256, L2-normalized. Used for FAISS indexing and retrieval.
- *Hyperbolic/Poincaré head*: MLP → Poincaré ball (d=256, c=1.0). Used during training only for geometric consistency regularization. Captures hierarchical land-cover relationships.

**Cross-encoder reranker**: takes query patch tokens (d=512 from ViT) and candidate Euclidean embeddings (d=256), projects candidates to d=512 via a linear layer, then runs cross-attention. Produces refined relevance scores for the top-100 FAISS candidates.

### Training (three phases, 50 epochs total)

**Phase 1 (epochs 1–10): JEPA only**
Bidirectional patch-level prediction across modalities. The context encoder sees only *visible* patch tokens (75% of patches removed from sequence, not zeroed) and must predict the representations of *masked* patches in the paired modality. The target representations come from a full EMA copy of the context encoder (not frozen vanilla RemoteCLIP — a critical fix). Eight cross-modal directions trained: optical↔SAR, optical↔MS, SAR↔MS. Cloud fraction α weights forward (optical→SAR) vs reverse (SAR→optical) loss contribution.

**Phase 2 (epochs 11–25): JEPA + geography-aware contrastive**
InfoNCE contrastive loss added. Positives: in-batch optical-SAR pairs (same geographic location). Negatives: MoCo queue (4096 embeddings from past batches). Geographic soft-weighting suppresses nearby samples from acting as hard negatives (they may be true semantic matches, just different acquisitions). Bandwidth schedule starts wide (500km) and narrows (10km) as training progresses.

**Phase 3 (epochs 26–50): all losses + spectral unmixing regularizer**
Spectral unmixing decoder added as regularizer. Forces the MS embedding to be decodable as a weighted sum of endmember spectra (abundance × endmember matrix), with non-negativity enforced via softplus on endmembers.

**Geometric consistency loss**: active from Phase 2. Forces Euclidean pairwise distances to match Poincaré pairwise distances, transferring hierarchical structure learned by the hyperbolic head into the Euclidean retrieval head.

### Retrieval Pipeline (two-stage)

**Offline (done once):**
- Encode entire gallery through context encoder + Euclidean head
- Build FAISS IVF-PQ index (d=256, IVF with nlist≈√N centroids, PQ with m=16 subspaces)
- Store full embeddings for exact reranking

**Online (per query):**
1. **Stage 1 — FAISS ANN search** (~10ms): query is encoded and compared against IVF-PQ index. Top-100 candidates retrieved by approximate inner product.
2. **Stage 2 — Cross-encoder reranking** (~80ms): cross-attention between query patch tokens and the 100 candidate Euclidean embeddings produces refined scores. Top-10 (or top-5) returned.
3. **Total latency: ~90ms per query.**

### Retrieval Directions Supported

| Query modality | Gallery modality | Type |
|---|---|---|
| Optical | Optical | Same-modal |
| SAR | SAR | Same-modal |
| Multispectral | Multispectral | Same-modal |
| Optical | SAR | Cross-modal |
| SAR | Optical | Cross-modal |
| Optical | Multispectral | Cross-modal |
| Multispectral | Optical | Cross-modal |
| SAR | Multispectral | Cross-modal |
| Multispectral | SAR | Cross-modal |

### Performance Targets

Based on architecture design and ablation expectations:
- F1@5 cross-modal: target ~0.72+
- F1@10 cross-modal: target ~0.78+
- Average retrieval latency: ~90ms (well under the competitive threshold)

---

## Demo Scope & Constraints

### What this demo is

A **fully hardcoded frontend wireframe** built for hackathon judges. It simulates the
end-to-end user experience of the PT-JEPA retrieval system — a user uploads or selects a
query image, the system "processes" it, and returns ranked results — using fake loading
delays and pre-set mocked result data. There is no model, no backend, no GPU, no FAISS
index, no real inference of any kind.

### What this demo is NOT

- Not a live system. Nothing is computed at runtime.
- Not connected to any API or server.
- Not running the PT-JEPA model in any form.

**If any requested feature would require real inference, flag it explicitly rather than quietly faking deeper functionality.**

### Purpose

Make the retrieval concept tangible and credible to hackathon judges in under 30 seconds
of interaction. The demo is a supporting artifact — the ML solution (the PT-JEPA
implementation) is the primary submission. The demo's job is to show what the system does,
not to prove it works (that's the evaluation metrics' job).

### Audience

ISRO Bhartiya Antariksh Hackathon 2026 judges. They understand satellite imagery and remote
sensing. Technical terminology should be used correctly and confidently — do not dumb it
down. "SAR" should appear as "SAR", not "radar image". Evaluation metrics (F1@5, F1@10)
should be visible. Latency (~90ms) should be displayed as the realistic figure from the
two-stage pipeline spec, not rounded or inflated.

### Demo interaction flow

1. User selects or uploads a **query image** and its **source modality** (optical / multispectral / SAR)
2. User selects the **target gallery modality** (same or different from query)
3. System shows a fake ~90ms loading state
4. System displays **top-10 ranked results** with similarity scores and modality badges
5. User can toggle between top-5 and top-10 views
6. Key metrics (F1@5, F1@10, retrieval latency) shown alongside results

### Retrieval directions to demo (minimum)

- optical → SAR (primary cross-modal showcase)
- SAR → optical (reverse cross-modal)
- optical → multispectral
- optical → optical (same-modal, for comparison contrast)

---

## Visual Identity

Modality color coding is **non-negotiable and must be consistent everywhere** — every badge,
chip, tag, label, or indicator that identifies a modality uses the color for that modality.
Never swap them.

| Modality | Color | Hex (approximate) | Used for |
|---|---|---|---|
| Optical | Teal | `#0D9488` / `#14B8A6` (Tailwind teal-600/500) | Query badges, result tags, mode selectors |
| Multispectral | Violet / Purple | `#7C3AED` / `#8B5CF6` (Tailwind violet-600/500) | Same as above |
| SAR | Amber / Orange | `#D97706` / `#F59E0B` (Tailwind amber-600/500) | Same as above |

The color system should also inform:
- The active state of modality selector buttons
- The border or highlight on result cards when a result is from a specific modality
- Any legend or key in the UI

Use dark backgrounds (dark slate / near-black) for the overall UI. The modality colors are
saturated and pop well against dark surfaces. Do not use light/white backgrounds as the
primary surface.

---

## Terminology Reference

Use these terms consistently. Do not substitute casual synonyms.

| Correct | Do not use |
|---|---|
| SAR | radar image, microwave image |
| Optical | photograph, camera image, RGB image |
| Multispectral | multi-band image (ok as clarifier, not as replacement) |
| Query image | search image, input image |
| Gallery | database, image pool |
| Retrieval | search (ok as UI verb, but "retrieval" in technical labels) |
| Embedding | feature vector, representation (ok in explanatory text) |
| F1@5 / F1@10 | accuracy, precision alone |
| Similarity score | confidence score, match score |
| Stage 1 / Stage 2 | first pass / second pass |
| FAISS ANN | approximate search |
| Cross-encoder reranker | reranker (ok abbreviated) |
| RemoteCLIP | CLIP (RemoteCLIP is the domain-specific variant) |
| LoRA | fine-tuning alone (LoRA is the specific method) |
| SEN12MS | the dataset |
| Sentinel-1 | S1, SAR sensor |
| Sentinel-2 | S2, optical/MS sensor |
