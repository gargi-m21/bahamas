import type { Modality, RetrievalDirection, ResultItem } from './types';
import { QUERY_IMAGE, RESULT_IMAGES } from './showcaseImages';
import { SAME_QUERY_IMAGE, SAME_RESULT_IMAGES } from './showcaseSameImages';
import { MOCK_RESULTS } from './mockResults';

const CROSS_SCORES = [0.937, 0.921, 0.904, 0.887, 0.863];
const SAME_SCORES  = [1.000, 0.963, 0.951, 0.938, 0.922];

export const CROSS_RESULTS: ResultItem[] = RESULT_IMAGES.map((src, i) => ({
  id: `cross-r${i + 1}`,
  rank: i + 1,
  modality: 'sar' as Modality,
  similarityScore: CROSS_SCORES[i],
  thumbnail: src,
  relevant: true,
  caption: '',
}));

export const SAME_RESULTS: ResultItem[] = SAME_RESULT_IMAGES.map((src, i) => ({
  id: `same-r${i + 1}`,
  rank: i + 1,
  modality: 'sar' as Modality,
  similarityScore: SAME_SCORES[i],
  thumbnail: src,
  relevant: true,
  caption: '',
}));

export const DIRECTION_QUERY_MODALITY: Record<RetrievalDirection, Modality> = {
  'optical-optical': 'optical',
  'sar-sar':         'sar',
  'ms-ms':           'multispectral',
  'optical-sar':     'optical',
  'sar-optical':     'sar',
  'optical-ms':      'optical',
  'ms-optical':      'multispectral',
  'ms-sar':          'multispectral',
  'sar-ms':          'sar',
};

// Pre-loaded query images for the two hardcoded directions
export const HARDCODED_QUERY_IMAGES: Partial<Record<RetrievalDirection, string>> = {
  'sar-sar': SAME_QUERY_IMAGE,
  'ms-sar':  QUERY_IMAGE,
};

export function getResultsForDirection(dir: RetrievalDirection): ResultItem[] {
  if (dir === 'sar-sar') return SAME_RESULTS;
  if (dir === 'ms-sar')  return CROSS_RESULTS;
  const queryModality = DIRECTION_QUERY_MODALITY[dir];
  return MOCK_RESULTS[queryModality].slice(0, 5);
}
