import type { Modality, ResultItem } from './types';
import { thumbnailForModality } from './svgThumbnails';

const SCORES = [0.94, 0.91, 0.89, 0.87, 0.84, 0.81, 0.78, 0.74, 0.69, 0.61];

const CAPTIONS = [
  'Coastal wetland canopy',
  'Agricultural mosaic, fall',
  'Urban-rural transition zone',
  'Coniferous forest stand',
  'River floodplain',
  'Grassland steppe',
  'Mixed deciduous canopy',
  'Peri-urban settlement edge',
  'Irrigated cropland block',
  'Alpine foothill terrain',
  'Reservoir shoreline',
  'Shrubland transition',
];

// Per query modality, the gallery modality returned at each rank — hand-curated so
// cross-modal hits surface early and often, since that's the system's core proof point.
const MODALITY_SEQUENCE: Record<Modality, Modality[]> = {
  optical: ['optical', 'sar', 'multispectral', 'sar', 'optical', 'multispectral', 'sar', 'optical', 'multispectral', 'sar'],
  multispectral: ['multispectral', 'optical', 'sar', 'optical', 'multispectral', 'sar', 'optical', 'sar', 'multispectral', 'optical'],
  sar: ['sar', 'optical', 'multispectral', 'optical', 'sar', 'optical', 'multispectral', 'sar', 'optical', 'multispectral'],
};

const CAPTION_OFFSET: Record<Modality, number> = {
  optical: 0,
  multispectral: 4,
  sar: 8,
};

function buildResults(queryModality: Modality): ResultItem[] {
  const sequence = MODALITY_SEQUENCE[queryModality];
  const offset = CAPTION_OFFSET[queryModality];
  return sequence.map((modality, idx) => {
    const rank = idx + 1;
    const seed = `${queryModality}-${rank}-${modality}`;
    return {
      id: `${queryModality}-r${rank}`,
      rank,
      modality,
      similarityScore: SCORES[idx],
      thumbnail: thumbnailForModality(modality, seed),
      relevant: rank <= 7,
      caption: CAPTIONS[(idx + offset) % CAPTIONS.length],
    };
  });
}

export const MOCK_RESULTS: Record<Modality, ResultItem[]> = {
  optical: buildResults('optical'),
  multispectral: buildResults('multispectral'),
  sar: buildResults('sar'),
};

export function getMockResults(queryModality: Modality, topK: 5 | 10): ResultItem[] {
  return MOCK_RESULTS[queryModality].slice(0, topK);
}
