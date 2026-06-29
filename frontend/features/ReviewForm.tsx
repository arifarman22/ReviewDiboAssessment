'use client';

import React, { useEffect, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { Send, Check, X, LogIn, CheckCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { CreateReviewInput, Review } from '@/types';
import { reviewService } from '@/services/reviewService';
import { RatingStars } from '@/components/RatingStars';
import { Button } from '@/components/Button';
import { useAuth } from '@/hooks/useAuth';

const reviewSchema = zod.object({
  rating: zod.number().min(1, 'Rating must be at least 1 star').max(5),
  comment: zod.string().min(5, 'Comment must be at least 5 characters').max(1000),
});

type ReviewFormValues = zod.infer<typeof reviewSchema>;

interface ReviewFormProps {
  productId: string;
  onSubmitSuccess: (review: Review, isEdit: boolean) => void;
  editReview?: Review | null;
  onCancelEdit?: () => void;
  existingReviews?: Review[];
}

export const ReviewForm: React.FC<ReviewFormProps> = ({
  productId,
  onSubmitSuccess,
  editReview = null,
  onCancelEdit,
  existingReviews = [],
}) => {
  const { user, isAuthenticated } = useAuth();
  const isEditing = !!editReview;

  // Check if current user already has a review on this product
  const userExistingReview = useMemo(() => {
    if (!user) return null;
    return existingReviews.find(
      (r) => r.userName.toLowerCase() === user.name.toLowerCase()
    ) || null;
  }, [user, existingReviews]);

  const {
    handleSubmit,
    control,
    reset,
    register,
    formState: { errors, isSubmitting },
  } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 5, comment: '' },
  });

  useEffect(() => {
    if (editReview) {
      reset({ rating: editReview.rating, comment: editReview.comment });
    } else {
      reset({ rating: 5, comment: '' });
    }
  }, [editReview, reset]);

  const onSubmit = async (values: ReviewFormValues) => {
    if (!user) return;

    try {
      if (isEditing && editReview) {
        const updated = await reviewService.updateReview(editReview.id, {
          rating: values.rating,
          comment: values.comment,
        });
        toast.success('Review updated!');
        onSubmitSuccess(updated, true);
      } else {
        const created = await reviewService.createReview(productId, {
          userName: user.name,
          rating: values.rating,
          comment: values.comment,
        });
        toast.success('Review submitted!');
        onSubmitSuccess(created, false);
      }
      reset({ rating: 5, comment: '' });
    } catch (error) {
      toast.error(isEditing ? 'Failed to update review.' : 'Failed to submit review.');
    }
  };

  // Not logged in — show login prompt
  if (!isAuthenticated) {
    return (
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 text-center space-y-4">
        <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500">
          <LogIn className="h-6 w-6" />
        </div>
        <h3 className="text-base font-semibold text-[var(--foreground)]">Login to Review</h3>
        <p className="text-sm text-[var(--muted)]">
          You need to be signed in to submit a review for this product.
        </p>
        <Link href="/login">
          <Button variant="primary" className="w-full cursor-pointer">
            Sign In
          </Button>
        </Link>
        <p className="text-xs text-[var(--muted)]">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-indigo-500 font-medium hover:underline">Register</Link>
        </p>
      </div>
    );
  }

  // Already reviewed — show message with edit option
  if (userExistingReview && !isEditing) {
    return (
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 text-center space-y-4">
        <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500">
          <CheckCircle className="h-6 w-6" />
        </div>
        <h3 className="text-base font-semibold text-[var(--foreground)]">You&apos;ve Already Reviewed</h3>
        <p className="text-sm text-[var(--muted)]">
          You submitted a {userExistingReview.rating}-star review for this product.
        </p>
        <Button
          variant="secondary"
          className="w-full cursor-pointer"
          onClick={() => onCancelEdit ? undefined : undefined}
        >
          Your review is visible below
        </Button>
      </div>
    );
  }

  // Logged in — show review form
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-premium space-y-5"
    >
      <h3 className="text-base font-semibold text-[var(--foreground)]">
        {isEditing ? 'Edit Your Review' : 'Write a Review'}
      </h3>

      {/* Show logged-in user name */}
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--surface-hover)] border border-[var(--border-subtle)]">
        <div className="h-6 w-6 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
          <span className="text-[9px] font-bold text-white">{user.name.charAt(0).toUpperCase()}</span>
        </div>
        <span className="text-sm font-medium text-[var(--foreground)]">{user.name}</span>
      </div>

      {/* Rating */}
      <div className="space-y-1.5">
        <label className="block text-xs font-medium text-[var(--foreground)]">Rating</label>
        <Controller
          name="rating"
          control={control}
          render={({ field }) => (
            <RatingStars rating={field.value} interactive onChange={field.onChange} size="lg" />
          )}
        />
        {errors.rating?.message && (
          <p className="text-[11px] text-red-500 font-medium">{errors.rating.message}</p>
        )}
      </div>

      {/* Comment */}
      <div className="space-y-1.5">
        <label htmlFor="comment" className="block text-xs font-medium text-[var(--foreground)]">
          Comment
        </label>
        <textarea
          id="comment"
          rows={4}
          placeholder="Share your experience with this product..."
          disabled={isSubmitting}
          className={`block w-full rounded-lg border border-[var(--border)] bg-[var(--surface)] py-2 px-3 text-sm text-[var(--foreground)] transition-all placeholder:text-[var(--muted)] focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none ${
            errors.comment ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''
          }`}
          {...register('comment')}
        />
        {errors.comment?.message && (
          <p className="text-[11px] text-red-500 font-medium">{errors.comment.message}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-1">
        <Button
          type="submit"
          isLoading={isSubmitting}
          className="flex-1 cursor-pointer"
          leftIcon={isEditing ? <Check className="h-4 w-4" /> : <Send className="h-4 w-4" />}
        >
          {isEditing ? 'Update' : 'Submit Review'}
        </Button>
        {isEditing && onCancelEdit && (
          <Button type="button" variant="outline" onClick={onCancelEdit} disabled={isSubmitting} className="cursor-pointer">
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </form>
  );
};
