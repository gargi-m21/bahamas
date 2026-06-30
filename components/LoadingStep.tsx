'use client';

import { useEffect, useRef, useState } from 'react';
import { LOADING_DURATION_MS, PIPELINE_STAGES } from '@/lib/constants';
import { EmbeddingScatter } from './EmbeddingScatter';
import { StageProgress } from './StageProgress';

interface LoadingStepProps {
  onComplete: () => void;
}

export function LoadingStep({ onComplete }: LoadingStepProps) {
  const [elapsed, setElapsed] = useState(0);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    const start = performance.now();
    let frame: number;

    const tick = () => {
      const now = performance.now() - start;
      if (now >= LOADING_DURATION_MS) {
        setElapsed(LOADING_DURATION_MS);
        onCompleteRef.current();
        return;
      }
      setElapsed(now);
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  const progress = elapsed / LOADING_DURATION_MS;
  const stageWindow = LOADING_DURATION_MS / PIPELINE_STAGES.length;
  const currentIndex = Math.min(PIPELINE_STAGES.length - 1, Math.floor(elapsed / stageWindow));

  return (
    <section className="mx-auto flex min-h-[70vh] w-full max-w-3xl flex-col items-center justify-center px-4 py-20 sm:px-6">
      <div className="h-48 w-full max-w-md sm:h-56">
        <EmbeddingScatter />
      </div>
      <div className="mt-4 w-full max-w-sm">
        <StageProgress stages={PIPELINE_STAGES} currentIndex={currentIndex} progress={progress} />
      </div>
    </section>
  );
}
