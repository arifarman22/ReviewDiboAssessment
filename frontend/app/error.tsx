'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { RefreshCw, Home, ServerCrash } from 'lucide-react';
import { Button } from '@/components/Button';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Unhandled application runtime error:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-4">
      <div className="max-w-md w-full bg-white border border-red-100 dark:border-red-950/20 dark:bg-red-950/5 rounded-2xl p-8 shadow-xl flex flex-col items-center">
        {/* Error icon circle */}
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 dark:bg-red-950/40 text-red-650 dark:text-red-400 mb-6">
          <ServerCrash className="h-8 w-8" />
        </div>

        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">
          Something went wrong
        </h1>
        
        <p className="text-sm text-slate-455 dark:text-slate-400 mt-2">
          An unexpected error occurred in the application. We have logged the error details.
        </p>

        {error.message && (
          <div className="mt-4 p-3 rounded-lg bg-red-50/50 dark:bg-red-950/10 border border-red-100 dark:border-red-900/10 text-xs font-mono text-red-750 dark:text-red-305 max-w-full overflow-auto text-left">
            {error.message}
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3 w-full">
          <Button
            variant="primary"
            className="flex-1 cursor-pointer"
            onClick={reset}
            leftIcon={<RefreshCw className="h-4 w-4" />}
          >
            Try Again
          </Button>
          
          <Link href="/" className="flex-1">
            <Button
              variant="outline"
              className="w-full cursor-pointer"
              leftIcon={<Home className="h-4 w-4" />}
            >
              Go Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
