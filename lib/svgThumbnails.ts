// Deterministic, seeded SVG generators for mock gallery/query thumbnails.
// No external assets — every thumbnail is an inline data URI built at module load.

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

function seedFromString(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  }
  return h;
}

function toDataUri(svg: string): string {
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

const SIZE = 240;

/** Optical: soft layered green/tan terrain bands, like agricultural/vegetated land cover. */
export function opticalThumbnail(seed: string): string {
  const rng = mulberry32(seedFromString(seed));
  const hues = [
    ['#3D5A3A', '#5B7A4F'],
    ['#6B7F4A', '#8A9B5E'],
    ['#9C8B5A', '#B5A576'],
    ['#4A6B52', '#6D8A6A'],
  ];
  const bandCount = 5 + Math.floor(rng() * 3);
  let defs = '';
  let paths = '';
  let y = 0;
  for (let i = 0; i < bandCount; i++) {
    const h = SIZE / bandCount + (rng() - 0.5) * 14;
    const [c1, c2] = hues[Math.floor(rng() * hues.length)];
    const wobble = 6 + rng() * 10;
    const gid = `og${seed}_${i}`;
    defs += `<linearGradient id="${gid}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient>`;
    paths += `<path d="M0,${y} Q${SIZE / 2},${y - wobble} ${SIZE},${y} L${SIZE},${y + h} Q${SIZE / 2},${y + h + wobble} 0,${y + h} Z" fill="url(#${gid})"/>`;
    y += h;
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}">
    <defs>${defs}</defs>
    <rect width="${SIZE}" height="${SIZE}" fill="#3D5A3A"/>
    ${paths}
    <rect width="${SIZE}" height="${SIZE}" fill="#000000" opacity="0.06"/>
  </svg>`;
  return toDataUri(svg);
}

/** Multispectral: false-color band composite — violet/orange/green block gradient. */
export function multispectralThumbnail(seed: string): string {
  const rng = mulberry32(seedFromString(seed) + 1);
  const palette = ['#6D28D9', '#9333EA', '#EA580C', '#F59E0B', '#16A34A', '#65A30D'];
  const cols = 4;
  const rows = 4;
  const cw = SIZE / cols;
  const ch = SIZE / rows;
  let blocks = '';
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const color = palette[Math.floor(rng() * palette.length)];
      const opacity = 0.55 + rng() * 0.4;
      blocks += `<rect x="${c * cw}" y="${r * ch}" width="${cw + 1}" height="${ch + 1}" fill="${color}" opacity="${opacity.toFixed(2)}"/>`;
    }
  }
  const gid = `mg${seed}`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}">
    <defs>
      <linearGradient id="${gid}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#3B0764"/>
        <stop offset="1" stop-color="#7C2D12"/>
      </linearGradient>
      <filter id="blur${gid}"><feGaussianBlur stdDeviation="9"/></filter>
    </defs>
    <rect width="${SIZE}" height="${SIZE}" fill="url(#${gid})"/>
    <g filter="url(#blur${gid})">${blocks}</g>
  </svg>`;
  return toDataUri(svg);
}

/** SAR: high-contrast monochrome with speckle/noise texture, like radar backscatter. */
export function sarThumbnail(seed: string): string {
  const rng = mulberry32(seedFromString(seed) + 2);
  const baseFreq = (0.55 + rng() * 0.35).toFixed(2);
  const seedNum = Math.floor(rng() * 1000);
  const blobCount = 4 + Math.floor(rng() * 3);
  let blobs = '';
  for (let i = 0; i < blobCount; i++) {
    const cx = rng() * SIZE;
    const cy = rng() * SIZE;
    const r = 20 + rng() * 50;
    const shade = 30 + Math.floor(rng() * 60);
    blobs += `<circle cx="${cx.toFixed(0)}" cy="${cy.toFixed(0)}" r="${r.toFixed(0)}" fill="rgb(${shade},${shade},${shade})" opacity="0.5"/>`;
  }
  const fid = `sf${seed}`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}">
    <defs>
      <filter id="${fid}">
        <feTurbulence type="fractalNoise" baseFrequency="${baseFreq}" numOctaves="2" seed="${seedNum}" result="noise"/>
        <feColorMatrix in="noise" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0.9 0.9 0.9 0 0"/>
      </filter>
    </defs>
    <rect width="${SIZE}" height="${SIZE}" fill="#1C1C1C"/>
    ${blobs}
    <rect width="${SIZE}" height="${SIZE}" filter="url(#${fid})" opacity="0.5"/>
    <rect width="${SIZE}" height="${SIZE}" fill="#000000" opacity="0.15"/>
  </svg>`;
  return toDataUri(svg);
}

export function thumbnailForModality(modality: 'optical' | 'multispectral' | 'sar', seed: string): string {
  if (modality === 'optical') return opticalThumbnail(seed);
  if (modality === 'multispectral') return multispectralThumbnail(seed);
  return sarThumbnail(seed);
}
