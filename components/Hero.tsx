import { StatsStrip } from './StatsStrip';

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(139,147,167,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(139,147,167,0.08) 1px, transparent 1px)',
          backgroundSize: '38px 38px',
          maskImage: 'radial-gradient(ellipse 70% 60% at 50% 30%, black 0%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 30%, black 0%, transparent 75%)',
        }}
      />

      <div className="relative mx-auto w-full max-w-5xl px-4 pb-16 pt-20 sm:px-6 sm:pt-28">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-text-muted">
          ISRO Bhartiya Antariksh Hackathon 2026 · PS-11
        </p>

        <h1 className="mt-5 font-display text-5xl font-semibold tracking-tight text-text-primary sm:text-7xl">
          PT-JEPA
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-text-muted sm:text-xl">
          Optical, multispectral, and SAR sensors capture the same patch of Earth in incompatible
          ways. PT-JEPA aligns all three into one shared embedding space, so a query in any modality
          retrieves relevant images from every modality, not just its own.
        </p>

        <div className="mt-9 flex flex-wrap items-center gap-4">
          <a
            href="#upload"
            className="inline-flex h-12 items-center rounded-lg bg-optical px-7 font-display text-sm font-semibold text-bg transition-opacity hover:opacity-90"
          >
            Start a query
          </a>
        </div>

        <div className="mt-16">
          <StatsStrip />
        </div>
      </div>
    </section>
  );
}
