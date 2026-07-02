'use client';

import type { Modality } from '@/lib/types';
import { Dropzone } from './Dropzone';
import { ModalitySelector } from './ModalitySelector';

interface UploadStepProps {
  previewSrc: string | null;
  onFileSelect: (dataUrl: string) => void;
  modality: Modality;
  onModalityChange: (modality: Modality) => void;
  onRetrieve: () => void;
}

export function UploadStep({
  previewSrc,
  onFileSelect,
  modality,
  onModalityChange,
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

      <div className="mt-8 flex justify-end">
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
