'use client';

import type { Modality, TopK } from '@/lib/types';
import { Dropzone } from './Dropzone';
import { ModalitySelector } from './ModalitySelector';

interface UploadStepProps {
  previewSrc: string | null;
  onFileSelect: (dataUrl: string) => void;
  modality: Modality;
  onModalityChange: (modality: Modality) => void;
  topK: TopK;
  onTopKChange: (k: TopK) => void;
  onRetrieve: () => void;
}

export function UploadStep({
  previewSrc,
  onFileSelect,
  modality,
  onModalityChange,
  topK,
  onTopKChange,
  onRetrieve,
}: UploadStepProps) {
  return (
    <section id="upload" className="mx-auto w-full max-w-3xl scroll-mt-10 px-4 py-20 sm:px-6">
      <p className="text-xs font-medium uppercase tracking-widest text-text-muted">Step 1</p>
      <h2 className="mt-2 font-display text-2xl font-semibold text-text-primary sm:text-3xl">
        Submit a query image
      </h2>
      <p className="mt-2 max-w-prose text-sm text-text-muted">
        Choose the sensor modality the query was acquired with. The gallery will be searched across
        all three modalities, same-modal and cross-modal results are ranked together.
      </p>

      <div className="mt-8">
        <Dropzone previewSrc={previewSrc} onFileSelect={onFileSelect} />
      </div>

      <div className="mt-6">
        <p className="mb-2 text-xs uppercase tracking-wide text-text-muted">Query modality</p>
        <ModalitySelector value={modality} onChange={onModalityChange} />
      </div>

      <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="mb-2 text-xs uppercase tracking-wide text-text-muted">Results to render</p>
          <div className="flex items-center gap-1 rounded-md border border-border p-1" role="group" aria-label="Top-K results">
            {([5, 10] as TopK[]).map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => onTopKChange(k)}
                className={`h-9 min-w-[64px] rounded px-3 font-mono text-sm font-medium transition-colors ${
                  topK === k ? 'bg-optical-dim text-optical' : 'text-text-muted hover:text-text-primary'
                }`}
                aria-pressed={topK === k}
              >
                Top-{k}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          disabled={!previewSrc}
          onClick={onRetrieve}
          className="h-12 rounded-lg bg-optical px-8 font-display text-sm font-semibold text-bg transition-opacity disabled:cursor-not-allowed disabled:opacity-40 enabled:hover:opacity-90"
        >
          Retrieve
        </button>
      </div>
    </section>
  );
}
