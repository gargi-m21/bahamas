import type { Modality, PipelineStage } from './types';

export const LOADING_DURATION_MS = 5000;

export const PIPELINE_STAGES: PipelineStage[] = [
  { id: 'encode', label: 'Encoding query into shared embedding space' },
  { id: 'search', label: 'Searching gallery index (FAISS ANN)' },
  { id: 'rerank', label: 'Cross-encoder re-ranking candidates' },
  { id: 'finalize', label: 'Finalizing ranked results' },
];

export const BENCHMARK_LATENCY_MS = 90;

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
