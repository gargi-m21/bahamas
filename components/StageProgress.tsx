import type { PipelineStage } from '@/lib/types';

interface StageProgressProps {
  stages: PipelineStage[];
  currentIndex: number;
  progress: number;
}

export function StageProgress({ stages, currentIndex, progress }: StageProgressProps) {
  return (
    <div className="w-full">
      <ol className="space-y-2.5">
        {stages.map((stage, i) => {
          const status = i < currentIndex ? 'done' : i === currentIndex ? 'active' : 'pending';
          return (
            <li key={stage.id} className="flex items-center gap-3">
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border font-mono text-[10px] ${
                  status === 'pending'
                    ? 'border-border text-text-muted'
                    : status === 'active'
                      ? 'border-optical text-optical'
                      : 'border-optical bg-optical-dim text-optical'
                }`}
                aria-hidden="true"
              >
                {status === 'done' ? (
                  <svg viewBox="0 0 16 16" fill="none" className="h-2.5 w-2.5">
                    <path d="M3 8.5L6.2 11.5L13 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  i + 1
                )}
              </span>
              <span
                className={`text-sm transition-colors ${
                  status === 'pending' ? 'text-text-muted' : 'text-text-primary'
                } ${status === 'active' ? 'font-medium' : ''}`}
              >
                {stage.label}
              </span>
            </li>
          );
        })}
      </ol>

      <div className="mt-6 h-1 w-full overflow-hidden rounded-full bg-surface-raised">
        <div
          className="h-full rounded-full bg-gradient-to-r from-optical via-multispectral to-sar transition-[width] duration-150 ease-linear"
          style={{ width: `${Math.min(100, progress * 100)}%` }}
        />
      </div>
    </div>
  );
}
