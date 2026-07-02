'use client';

import { useCallback, useState } from 'react';
import type { RetrievalDirection, RetrievalType, ResultItem } from '@/lib/types';
import {
  DIRECTION_QUERY_MODALITY,
  getResultsForDirection,
} from '@/lib/hardcodedResults';
import { Hero } from '@/components/Hero';
import { UploadStep } from '@/components/UploadStep';
import { LoadingStep } from '@/components/LoadingStep';
import { ResultsView } from '@/components/ResultsView';

type Phase = 'idle' | 'loading' | 'results';

const DEFAULT_DIRECTION: RetrievalDirection = 'sar-sar';

export default function Page() {
  const [phase, setPhase] = useState<Phase>('idle');
  const [retrievalType, setRetrievalType] = useState<RetrievalType>('same');
  const [direction, setDirection] = useState<RetrievalDirection>(DEFAULT_DIRECTION);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [results, setResults] = useState<ResultItem[]>([]);

  const handleRetrievalTypeChange = useCallback((type: RetrievalType) => {
    setRetrievalType(type);
    setDirection(type === 'same' ? 'sar-sar' : 'ms-sar');
    setPreviewSrc(null);
  }, []);

  const handleDirectionChange = useCallback((dir: RetrievalDirection) => {
    setDirection(dir);
    setPreviewSrc(null);
  }, []);

  const handleRetrieve = useCallback(() => {
    if (!previewSrc) return;
    setResults(getResultsForDirection(direction));
    setPhase('loading');
  }, [previewSrc, direction]);

  const handleLoadingComplete = useCallback(() => {
    setPhase('results');
  }, []);

  const handleReset = useCallback(() => {
    setPreviewSrc(null);
    setPhase('idle');
  }, []);

  if (phase === 'loading') {
    return <LoadingStep onComplete={handleLoadingComplete} />;
  }

  if (phase === 'results' && previewSrc) {
    return (
      <ResultsView
        queryImage={previewSrc}
        queryModality={DIRECTION_QUERY_MODALITY[direction]}
        results={results}
        onReset={handleReset}
      />
    );
  }

  return (
    <main>
      <Hero />
      <UploadStep
        previewSrc={previewSrc}
        onFileSelect={setPreviewSrc}
        retrievalType={retrievalType}
        onRetrievalTypeChange={handleRetrievalTypeChange}
        direction={direction}
        onDirectionChange={handleDirectionChange}
        onRetrieve={handleRetrieve}
      />
    </main>
  );
}
