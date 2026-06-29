'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ProductFilters } from '@/types';

interface AppContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  filters: ProductFilters;
  setFilters: React.Dispatch<React.SetStateAction<ProductFilters>>;
  resetFilters: () => void;
  page: number;
  setPage: (page: number) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const initialFilters: ProductFilters = {
  search: '',
  rating: null,
  sortBy: 'rating',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [filters, setFilters] = useState<ProductFilters>(initialFilters);
  const [page, setPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Initialize theme from localStorage or system preferences
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
      document.documentElement.classList.toggle('dark', prefersDark);
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
    document.documentElement.classList.toggle('dark', nextTheme === 'dark');
  };

  const resetFilters = () => {
    setFilters(initialFilters);
    setPage(1);
  };

  // Reset page when filters change (except sorting)
  useEffect(() => {
    setPage(1);
  }, [filters.search, filters.rating]);

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        filters,
        setFilters,
        resetFilters,
        page,
        setPage,
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
