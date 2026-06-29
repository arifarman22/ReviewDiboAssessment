'use client';

import React from 'react';
import { Inbox, RefreshCw } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  title?: string;
  description?: string;
  onReset?: () => void;
  actionLabel?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No results found',
  description = 'Try adjusting your search or filters.',
  onReset,
  actionLabel = 'Reset Filters',
}) => {
  return (
    <div className="flex min-h-[360px] flex-col items-center justify-center text-center p-10 rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface)] animate-fadeIn">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 dark:bg-zinc-800/60 text-[var(--muted)] mb-5 animate-float">
        <Inbox className="h-7 w-7" />
      </div>
      <h3 className="text-base font-semibold text-[var(--foreground)]">{title}</h3>
      <p className="mt-1.5 text-sm text-[var(--muted)] max-w-xs">{description}</p>
      {onReset && (
        <Button
          variant="secondary"
          size="sm"
          onClick={onReset}
          className="mt-5 cursor-pointer"
          leftIcon={<RefreshCw className="h-3.5 w-3.5" />}
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
