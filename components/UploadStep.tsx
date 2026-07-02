'use client';

import type { Modality, RetrievalDirection, RetrievalType } from '@/lib/types';
import { Dropzone } from './Dropzone';

/* ── Direction configuration ─────────────────────────────────────────── */

type DirConfig = { id: RetrievalDirection; query: Modality; gallery: Modality };

const SAME_DIRS: DirConfig[] = [
  { id: 'optical-optical', query: 'optical',       gallery: 'optical' },
  { id: 'sar-sar',         query: 'sar',           gallery: 'sar' },
  { id: 'ms-ms',           query: 'multispectral', gallery: 'multispectral' },
];

const CROSS_DIRS: DirConfig[] = [
  { id: 'optical-sar',  query: 'optical',       gallery: 'sar' },
  { id: 'sar-optical',  query: 'sar',           gallery: 'optical' },
  { id: 'optical-ms',   query: 'optical',       gallery: 'multispectral' },
  { id: 'ms-optical',   query: 'multispectral', gallery: 'optical' },
  { id: 'ms-sar',       query: 'multispectral', gallery: 'sar' },
  { id: 'sar-ms',       query: 'sar',           gallery: 'multispectral' },
];

/* ── Style maps (full class names so Tailwind picks them up) ──────────── */

const DOT: Record<Modality, string> = {
  optical:       'bg-optical',
  multispectral: 'bg-multispectral',
  sar:           'bg-sar',
};

const ACTIVE: Record<Modality, string> = {
  optical:       'border-optical bg-optical-dim text-optical',
  multispectral: 'border-multispectral bg-multispectral-dim text-multispectral',
  sar:           'border-sar bg-sar-dim text-sar',
};

const LABEL: Record<Modality, string> = {
  optical:       'Optical',
  multispectral: 'MS',
  sar:           'SAR',
};

/* ── Component ────────────────────────────────────────────────────────── */

interface UploadStepProps {
  previewSrc: string | null;
  onFileSelect: (dataUrl: string) => void;
  retrievalType: RetrievalType;
  onRetrievalTypeChange: (type: RetrievalType) => void;
  direction: RetrievalDirection;
  onDirectionChange: (dir: RetrievalDirection) => void;
  onRetrieve: () => void;
}

export function UploadStep({
  previewSrc,
  onFileSelect,
  retrievalType,
  onRetrievalTypeChange,
  direction,
  onDirectionChange,
  onRetrieve,
}: UploadStepProps) {
  const dirs = retrievalType === 'same' ? SAME_DIRS : CROSS_DIRS;

  return (
    <section id="upload" className="mx-auto w-full max-w-3xl scroll-mt-10 px-4 py-20 sm:px-6">
      <p className="text-xs font-medium uppercase tracking-widest text-text-muted">Step 1</p>
      <h2 className="mt-2 font-display text-2xl font-semibold text-text-primary sm:text-3xl">
        Submit a retrieval query
      </h2>
      <p className="mt-2 max-w-prose text-sm text-text-muted">
        Select a retrieval mode and direction, then submit a query image to search the gallery
        using the PT-JEPA five-stage pipeline.
      </p>

      {/* Retrieval mode toggle */}
      <div className="mt-8">
        <p className="mb-2 text-xs uppercase tracking-wide text-text-muted">Retrieval mode</p>
        <div
          className="inline-flex items-center gap-1 rounded-lg border border-border p-1"
          role="radiogroup"
          aria-label="Retrieval mode"
        >
          {(['same', 'cross'] as RetrievalType[]).map((type) => (
            <button
              key={type}
              type="button"
              role="radio"
              aria-checked={retrievalType === type}
              onClick={() => onRetrievalTypeChange(type)}
              className={`h-9 rounded px-5 text-sm font-medium transition-colors ${
                retrievalType === type
                  ? 'bg-optical-dim text-optical'
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              {type === 'same' ? 'Same-Modal' : 'Cross-Modal'}
            </button>
          ))}
        </div>
      </div>

      {/* Direction selector */}
      <div className="mt-5">
        <p className="mb-2 text-xs uppercase tracking-wide text-text-muted">Direction</p>
        <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Retrieval direction">
          {dirs.map((cfg) => {
            const active = direction === cfg.id;
            return (
              <button
                key={cfg.id}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => onDirectionChange(cfg.id)}
                className={`inline-flex items-center gap-1.5 rounded-lg border px-3.5 py-2 text-xs font-medium transition-colors ${
                  active
                    ? ACTIVE[cfg.query]
                    : 'border-border text-text-muted hover:border-text-muted hover:text-text-primary'
                }`}
              >
                <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${DOT[cfg.query]}`} />
                <span>{LABEL[cfg.query]}</span>
                <svg viewBox="0 0 22 8" className="w-4 h-1.5 shrink-0 opacity-60" fill="none" aria-hidden="true">
                  <path d="M0 4h19M14 1l5 3-5 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${DOT[cfg.gallery]}`} />
                <span>{LABEL[cfg.gallery]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Dropzone */}
      <div className="mt-8">
        <Dropzone previewSrc={previewSrc} onFileSelect={onFileSelect} />
      </div>

      {/* Retrieve button */}
      <div className="mt-6 flex justify-end">
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
