'use client';

import React from 'react';
import { Star } from 'lucide-react';
import { useAppContext } from '@/hooks/useAppContext';
import { cn } from '@/lib/utils';

export const RatingFilter: React.FC = () => {
  const { filters, setFilters } = useAppContext();

  const handleRatingSelect = (rating: number | null) => {
    setFilters((prev) => ({ ...prev, rating }));
  };

  const ratings: (number | null)[] = [null, 5, 4, 3, 2, 1];

  return (
    <div className="flex flex-wrap gap-1.5">
      {ratings.map((rating) => {
        const isActive = filters.rating === rating;
        return (
          <button
            key={rating === null ? 'all' : rating}
            type="button"
            onClick={() => handleRatingSelect(rating)}
            className={cn(
              'inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium border transition-all duration-150 cursor-pointer',
              isActive
                ? 'bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-950/40 dark:border-indigo-800 dark:text-indigo-300'
                : 'bg-transparent border-[var(--border)] text-[var(--muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]'
            )}
            aria-label={rating === null ? 'Show all' : `Filter ${rating} stars`}
          >
            {rating === null ? (
              'All'
            ) : (
              <>
                {rating}
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              </>
            )}
          </button>
        );
      })}
    </div>
  );
};
