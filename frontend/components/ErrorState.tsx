'use client';

import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import { Button } from './Button';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message = 'We encountered an error. Please try again.',
  onRetry,
}) => {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center text-center p-10 rounded-2xl border border-red-100 dark:border-red-900/30 bg-red-50/50 dark:bg-red-950/10 animate-fadeIn">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 mb-5">
        <AlertTriangle className="h-7 w-7" />
      </div>
      <h3 className="text-base font-semibold text-[var(--foreground)]">{title}</h3>
      <p className="mt-1.5 text-sm text-[var(--muted)] max-w-xs">{message}</p>
      {onRetry && (
        <Button
          variant="danger"
          size="sm"
          onClick={onRetry}
          className="mt-5 cursor-pointer"
          leftIcon={<RotateCcw className="h-3.5 w-3.5" />}
        >
          Try Again
        </Button>
      )}
    </div>
  );
};
