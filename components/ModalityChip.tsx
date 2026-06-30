import type { Modality } from '@/lib/types';
import { MODALITY_META } from '@/lib/constants';

const COLOR_CLASSES: Record<Modality, { text: string; bg: string; border: string }> = {
  optical: { text: 'text-optical', bg: 'bg-optical-dim', border: 'border-optical' },
  multispectral: { text: 'text-multispectral', bg: 'bg-multispectral-dim', border: 'border-multispectral' },
  sar: { text: 'text-sar', bg: 'bg-sar-dim', border: 'border-sar' },
};

interface ModalityChipProps {
  modality: Modality;
  size?: 'sm' | 'md';
  variant?: 'solid' | 'outline';
}

export function ModalityChip({ modality, size = 'sm', variant = 'solid' }: ModalityChipProps) {
  const meta = MODALITY_META[modality];
  const colors = COLOR_CLASSES[modality];
  const sizeClasses = size === 'sm' ? 'text-xs px-2 py-0.5 gap-1' : 'text-sm px-3 py-1 gap-1.5';

  return (
    <span
      className={`inline-flex items-center rounded-full border font-mono font-medium tracking-wide uppercase ${sizeClasses} ${colors.text} ${colors.border} ${
        variant === 'solid' ? colors.bg : 'bg-transparent'
      }`}
    >
      <span className={`inline-block h-1.5 w-1.5 rounded-full ${colors.text} bg-current`} aria-hidden="true" />
      {meta.short}
    </span>
  );
}
