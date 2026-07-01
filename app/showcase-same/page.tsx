'use client';

import { SAME_QUERY_IMAGE, SAME_RESULT_IMAGES } from '@/lib/showcaseSameImages';

const SCORES = [1.000, 0.963, 0.951, 0.938, 0.922];

export default function ShowcaseSamePage() {
  return (
    <main className="h-screen flex flex-col overflow-hidden bg-bg text-text-primary font-body">

      <header className="shrink-0 border-b border-border px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="font-display font-semibold text-base tracking-tight">PT-JEPA</span>
          <span className="w-px h-4 bg-border" />
          <div className="flex items-center gap-2.5">
            <Pill color="sar" label="SAR" />
            <svg viewBox="0 0 22 8" className="w-5 h-2 text-text-muted" fill="none" aria-hidden="true">
              <path d="M0 4h19M14 1l5 3-5 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <Pill color="sar" label="SAR" />
          </div>
          <span className="text-xs text-text-muted">Same-Modal Retrieval</span>
        </div>
        <div className="flex items-center gap-8">
          <Stat label="F1@5"    value="0.76" />
          <Stat label="F1@10"   value="0.83" />
          <Stat label="Latency" value="~90 ms" accent />
        </div>
      </header>

      <div className="flex-1 min-h-0 flex flex-col px-8 py-6 gap-5">

        <div className="shrink-0 flex items-start gap-8">
          <div className="shrink-0 flex flex-col gap-3">
            <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-text-muted">Query Image</p>
            <div className="relative rounded-2xl overflow-hidden ring-2 ring-sar/70 bg-surface" style={{ width: 280, height: 280 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={SAME_QUERY_IMAGE} alt="SAR query" className="w-full h-full object-cover" />
              <div className="absolute bottom-2.5 left-2.5">
                <Pill color="sar" label="SAR" />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-5 pt-7">
            <div className="space-y-2">
              <p className="text-xs font-mono uppercase tracking-widest text-text-muted">Sensor</p>
              <p className="text-text-primary font-mono text-sm">Sentinel-1 GRD</p>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-mono uppercase tracking-widest text-text-muted">Channels</p>
              <p className="text-text-primary font-mono text-sm">VV · VH polarization</p>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-mono uppercase tracking-widest text-text-muted">GSD</p>
              <p className="text-text-primary font-mono text-sm">5 m / px</p>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-mono uppercase tracking-widest text-text-muted">Preprocessing</p>
              <p className="text-text-primary font-mono text-sm">Log-ratio + DT-CWT decomposition</p>
            </div>
          </div>
        </div>

        <div className="shrink-0 flex items-center gap-4">
          <div className="flex-1 h-px bg-border/50" />
          <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-text-muted whitespace-nowrap">
            Top-5 Retrieved Results · Sentinel-1 SAR · VV+VH · Same-Modal Gallery
          </p>
          <div className="flex-1 h-px bg-border/50" />
        </div>

        <div className="flex-1 min-h-0 flex gap-4">
          {SAME_RESULT_IMAGES.map((src, i) => (
            <div key={i} className="flex-1 min-w-0 flex flex-col gap-3">
              <div className="relative flex-1 min-h-0 rounded-2xl overflow-hidden ring-1 ring-sar/50 bg-surface">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={`Rank ${i + 1}`} className="absolute inset-0 w-full h-full object-cover" />
                <span className="absolute top-2.5 left-2.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-bg/80 text-[11px] font-mono font-semibold text-text-primary ring-1 ring-white/10">
                  {i + 1}
                </span>
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-bg/90 to-transparent pb-2.5 px-3 pt-6">
                  <span className="font-mono text-base font-semibold text-white drop-shadow tabular-nums">
                    {SCORES[i].toFixed(3)}
                  </span>
                </div>
              </div>
              <div className="shrink-0 flex items-center gap-2">
                <Pill color="sar" label="SAR" small />
                <div className="flex-1 h-1 rounded-full bg-surface-raised overflow-hidden">
                  <div className="h-full rounded-full bg-sar" style={{ width: `${Math.round(SCORES[i] * 100)}%` }} />
                </div>
                <span className="text-[10px] font-mono text-text-muted tabular-nums">{Math.round(SCORES[i] * 100)}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <footer className="shrink-0 border-t border-border px-8 py-2 flex items-center justify-between">
        <span className="text-[10px] font-mono text-text-muted">ISRO Bhartiya Antariksh Hackathon 2026 · PS-11</span>
        <span className="text-[10px] font-mono text-text-muted">Stage 1: FAISS ANN ~10 ms · Stage 2: cross-encoder reranking ~80 ms</span>
        <span className="text-[10px] font-mono text-text-muted">SEN12MS · RemoteCLIP ViT-L + LoRA (r=16)</span>
      </footer>
    </main>
  );
}

const PILL_BG  = { sar: 'bg-sar-dim text-sar ring-sar/30', multispectral: 'bg-multispectral-dim text-multispectral ring-multispectral/30', optical: 'bg-optical-dim text-optical ring-optical/30' };
const PILL_DOT = { sar: 'bg-sar', multispectral: 'bg-multispectral', optical: 'bg-optical' };

function Pill({ color, label, small }: { color: keyof typeof PILL_BG; label: string; small?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded px-2 py-0.5 font-semibold ring-1 ${PILL_BG[color]} ${small ? 'text-[10px]' : 'text-xs'}`}>
      <span className={`rounded-full ${PILL_DOT[color]} ${small ? 'h-1 w-1' : 'h-1.5 w-1.5'}`} />
      {label}
    </span>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex flex-col items-end gap-px">
      <span className="text-[10px] font-mono uppercase tracking-widest text-text-muted">{label}</span>
      <span className={`font-mono text-base font-semibold tabular-nums ${accent ? 'text-optical' : 'text-text-primary'}`}>{value}</span>
    </div>
  );
}
