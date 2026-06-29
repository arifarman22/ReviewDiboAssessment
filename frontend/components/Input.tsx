'use client';

import React, { useId } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, leftIcon, type = 'text', id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-medium text-[var(--foreground)]"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--muted)]">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            type={type}
            className={cn(
              'block w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] text-sm text-[var(--foreground)] transition-all duration-150 placeholder:text-[var(--muted)] focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none',
              {
                'pl-9': !!leftIcon,
                'border-red-500 focus:border-red-500 focus:ring-red-500/20': !!error,
              },
              'py-2 px-3',
              className
            )}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : undefined}
            {...props}
          />
        </div>
        {error && (
          <p id={`${inputId}-error`} className="text-[11px] text-red-500 font-medium animate-fadeIn">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
