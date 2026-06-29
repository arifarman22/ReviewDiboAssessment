'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Edit2, Trash2 } from 'lucide-react';
import { Review } from '@/types';
import { RatingStars } from '@/components/RatingStars';
import { formatDate } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

interface ReviewCardProps {
  review: Review;
  onEdit: (review: Review) => void;
  onDelete: (reviewId: string) => void;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ review, onEdit, onDelete }) => {
  const { user } = useAuth();

  // Only show edit/delete if this review belongs to the logged-in user
  const isOwner = user && user.name.toLowerCase() === review.userName.toLowerCase();

  const getInitials = (name: string) =>
    name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase() || 'U';

  const gradients = [
    'from-indigo-500 to-purple-500',
    'from-pink-500 to-rose-500',
    'from-emerald-500 to-teal-500',
    'from-amber-500 to-orange-500',
    'from-cyan-500 to-blue-500',
  ];

  const gradient = gradients[review.userName.length % gradients.length];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.25 }}
      className="group rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-premium hover:shadow-premium-hover transition-all duration-200"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${gradient} text-white text-xs font-bold shadow-sm`}>
            {getInitials(review.userName)}
          </div>
          <div>
            <h4 className="text-sm font-semibold text-[var(--foreground)]">
              {review.userName}
              {isOwner && <span className="ml-1.5 text-[10px] text-indigo-500 font-medium">(You)</span>}
            </h4>
            <div className="flex items-center gap-2 mt-0.5">
              <RatingStars rating={review.rating} size="sm" />
              <span className="text-[10px] font-medium text-[var(--muted)]">{review.rating}/5</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1">
          <span className="text-[11px] text-[var(--muted)]">{formatDate(review.createdAt)}</span>
          {isOwner && (
            <div className="flex items-center gap-0.5 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-150">
              <button
                onClick={() => onEdit(review)}
                className="p-1.5 rounded-md text-[var(--muted)] hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 transition-colors cursor-pointer"
                aria-label="Edit review"
              >
                <Edit2 className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => onDelete(review.id)}
                className="p-1.5 rounded-md text-[var(--muted)] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors cursor-pointer"
                aria-label="Delete review"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-3 pl-12">
        <p className="text-sm leading-relaxed text-[var(--muted)]">{review.comment}</p>
      </div>
    </motion.div>
  );
};
