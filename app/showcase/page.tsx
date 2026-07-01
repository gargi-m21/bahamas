'use client';

import { QUERY_IMAGE, RESULT_IMAGES } from '@/lib/showcaseImages';

const SCORES = [0.937, 0.921, 0.904, 0.887, 0.863];

export default function ShowcasePage() {
  return (
    <main className="h-screen flex flex-col overflow-hidden bg-bg text-text-primary font-body">

      {/* ── Header ────────────────────────────────────────────────── */}
      <header className="shrink-0 border-b border-border px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-5">
          <span className="font-display text-lg font-semibold tracking-tight">PT-JEPA</span>
          <span className="text-border select-none">|</span>

          {/* Direction */}
          <div className="flex items-center gap-2">
            <Chip color="sar" label="SAR" />
            <svg viewBox="0 0 20 10" className="w-5 h-2.5 text-text-muted shrink-0" fill="none" aria-hidden="true">
              <path d="M0 5h17M13 1l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <Chip color="multispectral" label="Multispectral" />
          </div>
          <span className="text-xs text-text-muted tracking-wide">Cross-Modal Retrieval</span>
        </div>

        {/* Metrics */}
        <div className="flex items-center gap-10">
          <Metric label="F1@5" value="0.74" />
          <Metric label="F1@10" value="0.81" />
          <Metric label="Latency" value="~90 ms" highlight />
        </div>
      </header>

      {/* ── Main ──────────────────────────────────────────────────── */}
      <div className="flex-1 min-h-0 flex gap-0">

        {/* Query panel */}
        <div className="shrink-0 w-[260px] flex flex-col border-r border-border p-5 gap-4">
          <p className="shrink-0 text-[10px] uppercase tracking-[0.18em] text-text-muted font-mono">Query Image</p>

          {/* Image */}
          <div className="flex-1 min-h-0 relative rounded-xl overflow-hidden ring-2 ring-sar/60">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={QUERY_IMAGE}
              alt="SAR query"
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Bottom badge */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-bg/95 via-bg/50 to-transparent pt-8 pb-3 px-3">
              <Chip color="sar" label="SAR" />
            </div>
          </div>

          {/* Meta */}
          <div className="shrink-0 rounded-lg bg-surface border border-border px-3 py-3 space-y-2">
            <MetaRow label="Sensor" value="Sentinel-1 GRD" />
            <MetaRow label="Channels" value="VV · VH" />
            <MetaRow label="GSD" value="5 m / px" />
            <MetaRow label="Preprocessing" value="DT-CWT + log-ratio" />
          </div>
        </div>

        {/* Results panel */}
        <div className="flex-1 flex flex-col p-5 gap-4 min-w-0">
          <div className="shrink-0 flex items-center justify-between">
            <p className="text-[10px] uppercase tracking-[0.18em] text-text-muted font-mono">
              Top-5 Retrieved Results
            </p>
            <span className="text-[10px] text-text-muted font-mono">
              Gallery: Sentinel-2 Multispectral · 13-band false-color composite
            </span>
          </div>

          {/* 5-column result cards */}
          <div className="flex-1 min-h-0 grid grid-cols-5 gap-4">
            {RESULT_IMAGES.map((src, i) => (
              <ResultCard key={i} src={src} rank={i + 1} score={SCORES[i]} />
            ))}
          </div>
        </div>
      </div>

      {/* ── Footer ────────────────────────────────────────────────── */}
      <footer className="shrink-0 border-t border-border px-8 py-2.5 flex items-center justify-between">
        <span className="text-[10px] text-text-muted font-mono">
          ISRO Bhartiya Antariksh Hackathon 2026 · PS-11
        </span>
        <span className="text-[10px] text-text-muted font-mono">
          Stage 1: FAISS ANN ~10 ms · Stage 2: cross-encoder reranking ~80 ms
        </span>
        <span className="text-[10px] text-text-muted font-mono">
          SEN12MS · Sentinel-1 / Sentinel-2 · RemoteCLIP ViT-L + LoRA
        </span>
      </footer>
    </main>
  );
}

/* ── Sub-components ─────────────────────────────────────────────────── */

function ResultCard({ src, rank, score }: { src: string; rank: number; score: number }) {
  return (
    <div className="flex flex-col gap-0 rounded-xl overflow-hidden bg-surface ring-1 ring-border hover:ring-multispectral/40 transition-all min-h-0">

      {/* Image — fills remaining height */}
      <div className="relative flex-1 min-h-0 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={`Rank ${rank}`}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Rank badge */}
        <div className="absolute top-2.5 left-2.5">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-bg/75 backdrop-blur-sm text-[11px] font-semibold font-mono text-text-primary ring-1 ring-white/10">
            {rank}
          </span>
        </div>

        {/* Score */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-bg/90 to-transparent px-3 pb-2.5 pt-6">
          <span className="font-mono text-base font-semibold text-white tabular-nums drop-shadow">
            {score.toFixed(3)}
          </span>
        </div>
      </div>

      {/* Card footer */}
      <div className="shrink-0 flex items-center justify-between px-3 py-2 border-t border-border">
        <Chip color="multispectral" label="Multispectral" small />

        {/* Score bar */}
        <div className="flex-1 mx-3 h-1 rounded-full bg-surface-raised overflow-hidden">
          <div
            className="h-full rounded-full bg-multispectral"
            style={{ width: `${Math.round(score * 100)}%` }}
          />
        </div>

        <span className="text-[10px] font-mono text-text-muted">{Math.round(score * 100)}%</span>
      </div>
    </div>
  );
}

function Chip({ color, label, small }: { color: 'sar' | 'multispectral' | 'optical'; label: string; small?: boolean }) {
  const cls: Record<string, string> = {
    sar: 'bg-sar-dim text-sar ring-sar/30',
    multispectral: 'bg-multispectral-dim text-multispectral ring-multispectral/30',
    optical: 'bg-optical-dim text-optical ring-optical/30',
  };
  const dot: Record<string, string> = {
    sar: 'bg-sar',
    multispectral: 'bg-multispectral',
    optical: 'bg-optical',
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded px-2 py-0.5 font-semibold ring-1 ${cls[color]} ${small ? 'text-[10px]' : 'text-xs'}`}
    >
      <span className={`rounded-full ${dot[color]} ${small ? 'h-1 w-1' : 'h-1.5 w-1.5'}`} />
      {label}
    </span>
  );
}

function Metric({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex flex-col items-end gap-0.5">
      <span className="text-[10px] uppercase tracking-widest text-text-muted font-mono">{label}</span>
      <span className={`font-mono text-base font-semibold tabular-nums ${highlight ? 'text-optical' : 'text-text-primary'}`}>
        {value}
      </span>
    </div>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-[10px] text-text-muted uppercase tracking-wide font-mono shrink-0">{label}</span>
      <span className="text-[11px] text-text-primary font-mono text-right">{value}</span>
    </div>
  );
}
