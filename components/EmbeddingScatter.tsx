'use client';

import { useEffect, useState } from 'react';

interface Dot {
  id: number;
  colorVar: string;
  sx: number;
  sy: number;
  cx: number;
  cy: number;
  r: number;
}

const VIEW_W = 420;
const VIEW_H = 220;
const DOTS_PER_MODALITY = 20;
const COLOR_VARS = ['var(--color-optical)', 'var(--color-multispectral)', 'var(--color-sar)'];
const CLUSTER_CENTERS = [
  { x: VIEW_W / 2 - 14, y: VIEW_H / 2 },
  { x: VIEW_W / 2, y: VIEW_H / 2 - 10 },
  { x: VIEW_W / 2 + 14, y: VIEW_H / 2 + 8 },
];

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildDots(): Dot[] {
  const rng = mulberry32(42);
  const dots: Dot[] = [];
  let id = 0;
  for (let group = 0; group < 3; group++) {
    const center = CLUSTER_CENTERS[group];
    for (let i = 0; i < DOTS_PER_MODALITY; i++) {
      dots.push({
        id: id++,
        colorVar: COLOR_VARS[group],
        sx: rng() * VIEW_W,
        sy: rng() * VIEW_H,
        cx: center.x + (rng() - 0.5) * 46,
        cy: center.y + (rng() - 0.5) * 46,
        r: 2 + rng() * 1.6,
      });
    }
  }
  return dots;
}

const DOTS = buildDots();

export function EmbeddingScatter() {
  const [resolved, setResolved] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => setResolved(true), 80);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <svg
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      className="h-full w-full"
      role="img"
      aria-label="Animated visualization of query and gallery embeddings converging into a shared representation space"
    >
      {DOTS.map((dot) => (
        <circle
          key={dot.id}
          cx={resolved ? dot.cx : dot.sx}
          cy={resolved ? dot.cy : dot.sy}
          r={dot.r}
          fill={dot.colorVar}
          opacity={0.85}
          style={{
            transition: 'cx 4200ms cubic-bezier(0.16, 1, 0.3, 1), cy 4200ms cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        />
      ))}
    </svg>
  );
}
