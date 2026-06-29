'use client';

import React from 'react';
import { Star } from 'lucide-react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface)] transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
            <Star className="h-3 w-3 fill-white" />
          </div>
          <span className="text-sm font-medium text-[var(--foreground)]">ReviewSphere</span>
        </div>

        <p className="text-xs text-[var(--muted)]">
          &copy; {new Date().getFullYear()} ReviewSphere. Built with Next.js &amp; FastAPI.
        </p>

        <div className="flex items-center gap-4 text-xs text-[var(--muted)]">
          <Link href="/" className="hover:text-[var(--foreground)] transition-colors">
            Products
          </Link>
          <Link href="/login" className="hover:text-[var(--foreground)] transition-colors">
            Login
          </Link>
        </div>
      </div>
    </footer>
  );
};
