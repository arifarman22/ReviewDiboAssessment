'use client';

import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import { useAppContext } from '@/hooks/useAppContext';

export const SearchBar: React.FC = () => {
  const { filters, setFilters } = useAppContext();
  const [searchTerm, setSearchTerm] = useState(filters.search);
  const debouncedSearch = useDebounce(searchTerm, 350);

  useEffect(() => {
    setFilters((prev) => ({ ...prev, search: debouncedSearch }));
  }, [debouncedSearch, setFilters]);

  useEffect(() => {
    setSearchTerm(filters.search);
  }, [filters.search]);

  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--muted)]">
        <Search className="h-4 w-4" />
      </div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search products..."
        className="block w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] py-2 pl-9 pr-9 text-sm text-[var(--foreground)] transition-all duration-150 placeholder:text-[var(--muted)] focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none"
        aria-label="Search products"
      />
      {searchTerm && (
        <button
          type="button"
          onClick={() => setSearchTerm('')}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-[var(--muted)] hover:text-[var(--foreground)] cursor-pointer"
          aria-label="Clear search"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
};
