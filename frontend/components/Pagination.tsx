'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between pt-8 mt-8 border-t border-[var(--border-subtle)]">
      <p className="text-xs text-[var(--muted)]">
        {(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}
      </p>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-1.5 rounded-lg border border-[var(--border)] text-[var(--muted)] hover:bg-[var(--surface-hover)] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {Array.from({ length: totalPages }).map((_, i) => {
          const pageNum = i + 1;
          return (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={cn(
                'h-8 w-8 rounded-lg text-xs font-medium transition-all cursor-pointer',
                pageNum === currentPage
                  ? 'bg-[var(--foreground)] text-[var(--background)]'
                  : 'text-[var(--muted)] hover:bg-[var(--surface-hover)]'
              )}
              aria-current={pageNum === currentPage ? 'page' : undefined}
            >
              {pageNum}
            </button>
          );
        })}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-1.5 rounded-lg border border-[var(--border)] text-[var(--muted)] hover:bg-[var(--surface-hover)] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
