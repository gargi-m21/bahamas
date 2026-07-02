import type { Modality, ResultItem } from './types';
import { QUERY_IMAGE, RESULT_IMAGES } from './showcaseImages';
import { SAME_QUERY_IMAGE, SAME_RESULT_IMAGES } from './showcaseSameImages';

const CROSS_SCORES = [0.937, 0.921, 0.904, 0.887, 0.863];
const SAME_SCORES  = [1.000, 0.963, 0.951, 0.938, 0.922];

const CAPTIONS = [
  'Agricultural mosaic, mixed crops',
  'Urban settlement fringe',
  'Coniferous forest stand',
  'River delta floodplain',
  'Irrigated cropland block',
];

export const CROSS_RESULTS: ResultItem[] = RESULT_IMAGES.map((src, i) => ({
  id: `cross-r${i + 1}`,
  rank: i + 1,
  modality: 'sar' as Modality,
  similarityScore: CROSS_SCORES[i],
  thumbnail: src,
  relevant: true,
  caption: CAPTIONS[i],
}));

export const SAME_RESULTS: ResultItem[] = SAME_RESULT_IMAGES.map((src, i) => ({
  id: `same-r${i + 1}`,
  rank: i + 1,
  modality: 'sar' as Modality,
  similarityScore: SAME_SCORES[i],
  thumbnail: src,
  relevant: true,
  caption: CAPTIONS[i],
}));

// Fingerprint: take 100 chars of base64 payload after the comma separator.
// Robust to any MIME type in the data URI header.
function fingerprint(dataUri: string): string {
  const comma = dataUri.indexOf(',');
  if (comma === -1) return '';
  return dataUri.slice(comma + 1, comma + 101);
}

const CROSS_FINGER = fingerprint(QUERY_IMAGE);
const SAME_FINGER  = fingerprint(SAME_QUERY_IMAGE);

export interface HardcodedDetection {
  results: ResultItem[];
  queryModality: Modality;
}

export function detectHardcoded(dataUri: string): HardcodedDetection | null {
  const fp = fingerprint(dataUri);
  if (fp === CROSS_FINGER) return { results: CROSS_RESULTS, queryModality: 'multispectral' };
  if (fp === SAME_FINGER)  return { results: SAME_RESULTS,  queryModality: 'sar' };
  return null;
}
