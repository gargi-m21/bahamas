# PT-JEPA — Cross-Modal Satellite Image Retrieval Demo

A hardcoded frontend wireframe for the PT-JEPA cross-modal satellite image retrieval system
(ISRO Bhartiya Antariksh Hackathon 2026, PS-11). There is no backend, no model, and no real
inference — every result, score, and delay is mocked. See [CLAUDE.md](./CLAUDE.md) for the
full problem statement and solution context this demo illustrates.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy

Zero-config static export — no environment variables, no server-side code, no database.

**Vercel:** push this repo to GitHub and import it at [vercel.com/new](https://vercel.com/new) — Vercel auto-detects the Next.js static export, no configuration needed.

To build the static export locally instead:

```bash
npm run build
```

Output is written to `out/`, deployable to any static host.

## Stack

Next.js (App Router) + TypeScript + Tailwind CSS. Client-side state only — no database, no auth, no API routes.
