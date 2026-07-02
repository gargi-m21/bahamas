'use client';

import type { Modality, ResultItem } from '@/lib/types';
import { BENCHMARK_LATENCY_MS } from '@/lib/constants';
import { ModalityChip } from './ModalityChip';
import { ResultsGrid } from './ResultsGrid';

interface ResultsViewProps {
  queryImage: string;
  queryModality: Modality;
  results: ResultItem[];
  onReset: () => void;
}

const F1_AT_5 = 0.74;
const F1_AT_10 = 0.81;

export function ResultsView({ queryImage, queryModality, results, onReset }: ResultsViewProps) {
  const visibleResults = results.slice(0, 5);

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={queryImage}
            alt="Query image preview"
            className="h-14 w-14 shrink-0 rounded-md border border-border object-cover"
          />
          <div>
            <p className="text-xs uppercase tracking-wide text-text-muted">Query</p>
            <div className="mt-1">
              <ModalityChip modality={queryModality} size="md" />
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onReset}
          className="inline-flex h-11 items-center gap-2 self-start rounded-md border border-border px-4 text-sm font-medium text-text-primary transition-colors hover:border-optical hover:text-optical sm:self-auto"
        >
          <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5" aria-hidden="true">
            <path
              d="M2 8a6 6 0 1 1 1.8 4.3M2 8V4M2 8h4"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Search again
        </button>
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-6 border-y border-border py-4">
        <dl className="flex flex-wrap gap-x-8 gap-y-3">
          <Metric label="F1@5" value={F1_AT_5.toFixed(2)} />
          <Metric label="F1@10" value={F1_AT_10.toFixed(2)} />
          <div>
            <dt className="text-xs uppercase tracking-wide text-text-muted">Retrieved in</dt>
            <dd className="font-mono font-tabular text-lg font-semibold text-text-primary">
              ≈ {BENCHMARK_LATENCY_MS} ms
            </dd>
            <p className="mt-0.5 max-w-[220px] text-[11px] leading-snug text-text-muted">
              Stage 1: FAISS ANN ~10 ms · Stage 2: cross-encoder reranking ~80 ms
            </p>
          </div>
        </dl>
      </div>

      <div className="mt-6">
        <ResultsGrid items={visibleResults} />
      </div>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-text-muted">{label}</dt>
      <dd className="font-mono font-tabular text-lg font-semibold text-text-primary">{value}</dd>
    </div>
  );
}
