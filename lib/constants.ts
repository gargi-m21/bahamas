import type { Modality, PipelineStage } from './types';

export const LOADING_DURATION_MS = 5000;

export const PIPELINE_STAGES: PipelineStage[] = [
  { id: 'encode',    label: 'Encoding query through frozen PT-JEPA encoder' },
  { id: 'ann',       label: 'Stage 1 — FAISS IVF-PQ approximate search' },
  { id: 'expand',    label: 'Stage 1.5a — Query expansion over top-k shortlist' },
  { id: 'diffusion', label: 'Stage 1.5b — Manifold diffusion re-ranking (gallery affinity graph)' },
  { id: 'prototype', label: 'Stage 1.5c — Prototype consistency filtering (IGBP anchoring)' },
  { id: 'rerank',    label: 'Stage 2 — Cross-encoder re-ranking final candidates' },
];

export const BENCHMARK_LATENCY_MS = 94;

interface ModalityMeta {
  label: string;
  short: string;
  description: string;
}

export const MODALITY_META: Record<Modality, ModalityMeta> = {
  optical: {
    label: 'Optical',
    short: 'OPT',
    description: 'Sentinel-2 RGB surface reflectance',
  },
  multispectral: {
    label: 'Multispectral',
    short: 'MS',
    description: 'Sentinel-2, 13 spectral bands',
  },
  sar: {
    label: 'SAR',
    short: 'SAR',
    description: 'Sentinel-1 GRD, VV + VH polarization',
  },
};

export const MODALITIES: Modality[] = ['optical', 'multispectral', 'sar'];
