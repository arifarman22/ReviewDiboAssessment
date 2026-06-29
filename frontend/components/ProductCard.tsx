'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MessageSquare, ArrowRight } from 'lucide-react';
import { Product } from '@/types';
import { RatingStars } from './RatingStars';
import { ProductImage } from './ProductImage';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [imgError, setImgError] = useState(false);

  return (
    <Link href={`/products/${product.id}`}>
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -6, transition: { duration: 0.2 } }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="group relative flex flex-col overflow-hidden rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-premium hover:shadow-premium-hover transition-all duration-300 cursor-pointer"
      >
        {/* Image */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-50 dark:bg-zinc-900">
          {!imgError ? (
            <img
              src={product.imageUrl}
              alt={product.title}
              loading="lazy"
              onError={() => setImgError(true)}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            />
          ) : (
            <ProductImage productId={product.id} title={product.title} className="h-full w-full" />
          )}
          {/* Category pill */}
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center rounded-full bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 shadow-sm">
              {product.category}
            </span>
          </div>
          {/* Price */}
          <div className="absolute bottom-3 right-3">
            <span className="inline-flex items-center rounded-full bg-[var(--foreground)] px-2.5 py-1 text-[11px] font-bold text-[var(--background)] shadow-lg">
              ${product.price.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col p-5 gap-3">
          <h3 className="text-[15px] font-semibold leading-tight text-[var(--foreground)] group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
            {product.title}
          </h3>

          <p className="text-xs leading-relaxed text-[var(--muted)] line-clamp-2">
            {product.shortDescription}
          </p>

          {/* Rating + Reviews */}
          <div className="flex items-center gap-2 mt-auto pt-3 border-t border-[var(--border-subtle)]">
            <RatingStars rating={product.rating} size="sm" />
            <span className="text-xs font-semibold text-[var(--foreground)]">
              {product.rating.toFixed(1)}
            </span>
            <span className="text-[11px] text-[var(--muted)] flex items-center gap-1 ml-auto">
              <MessageSquare className="h-3 w-3" />
              {product.reviewsCount}
            </span>
          </div>

          {/* CTA hint */}
          <div className="flex items-center justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-indigo-500">
              View Details
              <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </div>
        </div>
      </motion.article>
    </Link>
  );
};
