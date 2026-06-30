'use client';

import type { Modality } from '@/lib/types';
import { MODALITIES, MODALITY_META } from '@/lib/constants';

const ACTIVE_CLASSES: Record<Modality, string> = {
  optical: 'border-optical bg-optical-dim text-optical',
  multispectral: 'border-multispectral bg-multispectral-dim text-multispectral',
  sar: 'border-sar bg-sar-dim text-sar',
};

interface ModalitySelectorProps {
  value: Modality;
  onChange: (modality: Modality) => void;
}

export function ModalitySelector({ value, onChange }: ModalitySelectorProps) {
  return (
    <div role="radiogroup" aria-label="Query image modality" className="flex flex-wrap gap-2">
      {MODALITIES.map((modality) => {
        const meta = MODALITY_META[modality];
        const isActive = value === modality;
        return (
          <button
            key={modality}
            type="button"
            role="radio"
            aria-checked={isActive}
            onClick={() => onChange(modality)}
            className={`flex h-11 flex-col justify-center rounded-lg border px-4 text-left transition-colors ${
              isActive ? ACTIVE_CLASSES[modality] : 'border-border text-text-muted hover:text-text-primary'
            }`}
          >
            <span className="text-sm font-medium leading-tight">{meta.label}</span>
            <span className="text-[11px] leading-tight opacity-80">{meta.description}</span>
          </button>
        );
      })}
    </div>
  );
}
