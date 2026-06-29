'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpDown } from 'lucide-react';
import { useAppContext } from '@/hooks/useAppContext';
import { productService } from '@/services/productService';
import { Product } from '@/types';
import { ProductCard } from '@/components/ProductCard';
import { SearchBar } from '@/components/SearchBar';
import { RatingFilter } from '@/components/RatingFilter';
import { Pagination } from '@/components/Pagination';
import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { ProductCardSkeleton } from '@/components/Skeletons';
import { Button } from '@/components/Button';

export default function Home() {
  const { filters, setFilters, resetFilters, page, setPage } = useAppContext();
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const ITEMS_PER_PAGE = 6;

  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await productService.getProducts(filters, page, ITEMS_PER_PAGE);
      setProducts(data.products);
      setTotal(data.total);
    } catch (err) {
      setError('Could not fetch products. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [filters, page]);

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters((prev) => ({ ...prev, sortBy: e.target.value as any }));
  };

  const hasActiveFilters = filters.search !== '' || filters.rating !== null;

  return (
    <div className="space-y-10">
      {/* Hero */}
      <section className="text-center py-8 md:py-14 max-w-2xl mx-auto space-y-4">
        <motion.h1
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight gradient-text"
        >
          Discover & Review Products
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-base text-[var(--muted)] max-w-md mx-auto"
        >
          Real reviews from real people. Find your next favorite product.
        </motion.p>
      </section>

      {/* Controls */}
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-premium space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          <div className="md:col-span-8">
            <SearchBar />
          </div>
          <div className="md:col-span-4 flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4 text-[var(--muted)] shrink-0" />
            <select
              value={filters.sortBy}
              onChange={handleSortChange}
              className="block w-full appearance-none rounded-lg border border-[var(--border)] bg-[var(--surface)] py-2 px-3 text-sm text-[var(--foreground)] focus:border-indigo-500 focus:outline-none cursor-pointer"
              aria-label="Sort products"
            >
              <option value="rating">Highest Rated</option>
              <option value="reviews">Most Reviewed</option>
              <option value="name">Alphabetical</option>
              <option value="newest">Newest</option>
            </select>
          </div>
        </div>

        <div className="pt-3 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <RatingFilter />
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={resetFilters} className="text-indigo-500 cursor-pointer self-start">
              Clear Filters
            </Button>
          )}
        </div>
      </section>

      {/* Products Grid */}
      <section>
        {error ? (
          <ErrorState message={error} onRetry={fetchProducts} />
        ) : isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <EmptyState
            title={hasActiveFilters ? 'No matches found' : 'No products available'}
            description={hasActiveFilters ? 'Try a different search or filter.' : 'Check back later.'}
            onReset={hasActiveFilters ? resetFilters : undefined}
          />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <Pagination
              currentPage={page}
              totalItems={total}
              itemsPerPage={ITEMS_PER_PAGE}
              onPageChange={setPage}
            />
          </>
        )}
      </section>
    </div>
  );
}
