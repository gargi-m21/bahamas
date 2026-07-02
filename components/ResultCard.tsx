import type { ResultItem } from '@/lib/types';
import { ModalityChip } from './ModalityChip';

const BORDER_COLOR: Record<ResultItem['modality'], string> = {
  optical: 'border-l-optical',
  multispectral: 'border-l-multispectral',
  sar: 'border-l-sar',
};

interface ResultCardProps {
  item: ResultItem;
}

export function ResultCard({ item }: ResultCardProps) {
  return (
    <div
      className={`group overflow-hidden rounded-lg border border-border border-l-2 bg-surface-raised transition-transform duration-200 hover:-translate-y-0.5 hover:border-border ${BORDER_COLOR[item.modality]}`}
    >
      <div className="relative aspect-square w-full overflow-hidden bg-surface">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.thumbnail}
          alt={`Gallery result, rank ${item.rank}: ${item.caption}, ${item.modality} modality`}
          className="h-full w-full object-cover"
          loading="lazy"
        />
        <span className="absolute left-2 top-2 rounded-md bg-bg/80 px-1.5 py-0.5 font-mono text-xs font-medium text-text-primary backdrop-blur-sm">
          #{item.rank}
        </span>
        <span className="absolute right-2 top-2">
          <ModalityChip modality={item.modality} size="sm" />
        </span>
      </div>

      <div className="flex items-center justify-between gap-2 px-3 py-2.5">
        <p className="font-mono font-tabular text-sm font-semibold text-text-primary">
          {item.similarityScore.toFixed(2)}
        </p>
        <RelevanceIndicator relevant={item.relevant} />
      </div>
    </div>
  );
}

function RelevanceIndicator({ relevant }: { relevant: boolean }) {
  if (relevant) {
    return (
      <span
        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-optical-dim text-optical"
        aria-label="Relevant match"
        title="Relevant match"
      >
        <svg viewBox="0 0 16 16" fill="none" className="h-3 w-3" aria-hidden="true">
          <path d="M3 8.5L6.2 11.5L13 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    );
  }
  return (
    <span
      className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-border text-text-muted"
      aria-label="Lower-confidence match"
      title="Lower-confidence match"
    >
      <svg viewBox="0 0 16 16" fill="none" className="h-2.5 w-2.5" aria-hidden="true">
        <circle cx="8" cy="8" r="2.5" fill="currentColor" />
      </svg>
    </span>
  );
}
