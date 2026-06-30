interface Stat {
  value: string;
  label: string;
}

const STATS: Stat[] = [
  { value: '9', label: 'Same- & cross-modal retrieval directions' },
  { value: '≈90ms', label: 'Average retrieval latency, two-stage pipeline' },
  { value: 'F1@5 / F1@10', label: 'Cross-modal scored with extra weight' },
];

export function StatsStrip() {
  return (
    <dl className="grid grid-cols-1 divide-y divide-border border-y border-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
      {STATS.map((stat) => (
        <div key={stat.label} className="px-1 py-5 sm:px-6">
          <dt className="font-mono font-tabular text-xl font-semibold leading-snug text-text-primary sm:text-2xl">
            {stat.value}
          </dt>
          <dd className="mt-1 max-w-[26ch] text-xs text-text-muted">{stat.label}</dd>
        </div>
      ))}
    </dl>
  );
}
