'use client';

import React from 'react';
import Link from 'next/link';
import { Sun, Moon, Star, LogIn, LogOut, UserCircle } from 'lucide-react';
import { useAppContext } from '@/hooks/useAppContext';
import { useAuth } from '@/hooks/useAuth';
import { Button } from './Button';

export const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useAppContext();
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--border)] glass animate-slideDown">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/20 transition-transform group-hover:scale-110 duration-200">
            <Star className="h-4 w-4 fill-white" />
          </div>
          <span className="text-lg font-semibold tracking-tight text-[var(--foreground)]">
            Review<span className="text-indigo-500">Sphere</span>
          </span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <nav className="hidden md:flex items-center mr-2">
            <Link
              href="/"
              className="px-3 py-1.5 text-sm font-medium text-[var(--muted)] hover:text-[var(--foreground)] rounded-lg hover:bg-[var(--surface-hover)] transition-all duration-150"
            >
              Products
            </Link>
          </nav>

          {/* Auth */}
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--surface-hover)] border border-[var(--border-subtle)]">
                <div className="h-5 w-5 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
                  <span className="text-[10px] font-bold text-white">{user?.name?.charAt(0).toUpperCase()}</span>
                </div>
                <span className="text-xs font-medium text-[var(--foreground)]">{user?.name}</span>
              </div>
              <button
                onClick={logout}
                className="p-2 rounded-lg text-[var(--muted)] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all duration-150 cursor-pointer"
                aria-label="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <Link href="/login">
                <Button variant="ghost" size="sm" className="cursor-pointer text-xs gap-1.5">
                  <LogIn className="h-3.5 w-3.5" />
                  Login
                </Button>
              </Link>
              <Link href="/register" className="hidden sm:block">
                <Button variant="primary" size="sm" className="cursor-pointer text-xs">
                  Get Started
                </Button>
              </Link>
            </div>
          )}

          {/* Theme */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-hover)] border border-transparent hover:border-[var(--border)] transition-all duration-150 cursor-pointer"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
          >
            {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4 text-amber-400" />}
          </button>
        </div>
      </div>
    </header>
  );
};
