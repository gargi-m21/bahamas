'use client';

import { useCallback, useState } from 'react';
import type { Modality, TopK } from '@/lib/types';
import { MOCK_RESULTS } from '@/lib/mockResults';
import { Hero } from '@/components/Hero';
import { UploadStep } from '@/components/UploadStep';
import { LoadingStep } from '@/components/LoadingStep';
import { ResultsView } from '@/components/ResultsView';

type Phase = 'idle' | 'loading' | 'results';

export default function Page() {
  const [phase, setPhase] = useState<Phase>('idle');
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [modality, setModality] = useState<Modality>('optical');
  const [topK, setTopK] = useState<TopK>(10);

  const handleRetrieve = useCallback(() => {
    if (!previewSrc) return;
    setPhase('loading');
  }, [previewSrc]);

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
        queryModality={modality}
        topK={topK}
        onTopKChange={setTopK}
        results={MOCK_RESULTS[modality]}
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
        modality={modality}
        onModalityChange={setModality}
        topK={topK}
        onTopKChange={setTopK}
        onRetrieve={handleRetrieve}
      />
    </main>
  );
}
