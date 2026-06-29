'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className }) => {
  return (
    <div
      className={cn(
        'rounded-lg bg-slate-100 dark:bg-zinc-800/60 animate-shimmer',
        className
      )}
    />
  );
};

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      <div className="p-5 space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
        <div className="flex items-center gap-2 pt-3 border-t border-[var(--border-subtle)]">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-8 ml-auto" />
        </div>
      </div>
    </div>
  );
};

export const ReviewCardSkeleton: React.FC = () => {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-1.5">
            <Skeleton className="h-3.5 w-28" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
        <Skeleton className="h-3 w-16" />
      </div>
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-11/12" />
    </div>
  );
};

export const ProductDetailsSkeleton: React.FC = () => {
  return (
    <div className="space-y-8 animate-fadeIn">
      <Skeleton className="h-4 w-32" />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 md:p-8">
        <div className="lg:col-span-5">
          <Skeleton className="aspect-square w-full rounded-xl" />
        </div>
        <div className="lg:col-span-7 space-y-5">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-6 w-24" />
          <div className="space-y-2 pt-4">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-2/3" />
          </div>
          <div className="grid grid-cols-12 gap-4 pt-6">
            <Skeleton className="col-span-4 h-28 rounded-xl" />
            <div className="col-span-8 space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-4 w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
