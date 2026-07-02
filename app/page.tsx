'use client';

import { useCallback, useState } from 'react';
import type { Modality, ResultItem } from '@/lib/types';
import { MOCK_RESULTS } from '@/lib/mockResults';
import { detectHardcoded } from '@/lib/hardcodedResults';
import { Hero } from '@/components/Hero';
import { UploadStep } from '@/components/UploadStep';
import { LoadingStep } from '@/components/LoadingStep';
import { ResultsView } from '@/components/ResultsView';

type Phase = 'idle' | 'loading' | 'results';

export default function Page() {
  const [phase, setPhase] = useState<Phase>('idle');
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [modality, setModality] = useState<Modality>('optical');
  const [results, setResults] = useState<ResultItem[]>([]);
  const [displayModality, setDisplayModality] = useState<Modality>('optical');

  const handleRetrieve = useCallback(() => {
    if (!previewSrc) return;
    const detected = detectHardcoded(previewSrc);
    if (detected) {
      setResults(detected.results);
      setDisplayModality(detected.queryModality);
    } else {
      setResults(MOCK_RESULTS[modality]);
      setDisplayModality(modality);
    }
    setPhase('loading');
  }, [previewSrc, modality]);

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
        queryModality={displayModality}
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
        modality={modality}
        onModalityChange={setModality}
        onRetrieve={handleRetrieve}
      />
    </main>
  );
}
