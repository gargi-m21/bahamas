import type { ResultItem } from '@/lib/types';
import { ResultCard } from './ResultCard';

interface ResultsGridProps {
  items: ResultItem[];
}

export function ResultsGrid({ items }: ResultsGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {items.map((item) => (
        <ResultCard key={item.id} item={item} />
      ))}
    </div>
  );
}
