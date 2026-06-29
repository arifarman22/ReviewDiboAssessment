'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, variant = 'primary', size = 'md', isLoading = false, leftIcon, rightIcon, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 outline-none focus-ring disabled:opacity-50 disabled:pointer-events-none cursor-pointer active:scale-[0.97]',
          {
            'bg-[var(--foreground)] text-[var(--background)] hover:opacity-90 shadow-sm': variant === 'primary',
            'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white hover:opacity-90 shadow-lg shadow-indigo-500/25': variant === 'gradient',
            'bg-[var(--surface-hover)] text-[var(--foreground)] hover:bg-[var(--border)] border border-[var(--border)]': variant === 'secondary',
            'border border-[var(--border)] bg-transparent hover:bg-[var(--surface-hover)] text-[var(--foreground)]': variant === 'outline',
            'bg-transparent hover:bg-[var(--surface-hover)] text-[var(--muted)] hover:text-[var(--foreground)]': variant === 'ghost',
            'bg-red-600 hover:bg-red-700 text-white shadow-sm shadow-red-500/20': variant === 'danger',
          },
          {
            'px-3 py-1.5 text-xs gap-1.5': size === 'sm',
            'px-4 py-2 text-sm gap-2': size === 'md',
            'px-6 py-2.5 text-base gap-2': size === 'lg',
          },
          className
        )}
        {...props}
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        {!isLoading && leftIcon && <span className="shrink-0">{leftIcon}</span>}
        {children}
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
