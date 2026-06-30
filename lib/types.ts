export type Modality = 'optical' | 'multispectral' | 'sar';

export type TopK = 5 | 10;

export interface ResultItem {
  id: string;
  rank: number;
  modality: Modality;
  similarityScore: number;
  thumbnail: string;
  relevant: boolean;
  /** Short label evoking a plausible scene type, e.g. "Coastal wetland, ROI2017" */
  caption: string;
}

export interface PipelineStage {
  id: string;
  label: string;
}
