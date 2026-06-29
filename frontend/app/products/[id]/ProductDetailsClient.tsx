'use client';

import React, { useEffect, useState, useMemo, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, MessageSquare, Star, Sparkles, FilterX } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Review, ProductDetails, RatingBreakdown } from '@/types';
import { productService } from '@/services/productService';
import { reviewService } from '@/services/reviewService';
import { RatingStars } from '@/components/RatingStars';
import { ProductImage } from '@/components/ProductImage';
import { Button } from '@/components/Button';
import { Modal } from '@/components/Modal';
import { ProductDetailsSkeleton } from '@/components/Skeletons';
import { ErrorState } from '@/components/ErrorState';
import { ReviewCard } from '@/features/ReviewCard';
import { ReviewForm } from '@/features/ReviewForm';

interface ProductDetailsClientProps {
  productId: string;
}

export default function ProductDetailsClient({ productId }: ProductDetailsClientProps) {
  const [productDetails, setProductDetails] = useState<ProductDetails | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [imgError, setImgError] = useState(false);

  // Filter reviews by rating locally
  const [selectedRatingFilter, setSelectedRatingFilter] = useState<number | null>(null);

  // Review being edited
  const [editReview, setEditReview] = useState<Review | null>(null);

  // Review delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [reviewIdToDelete, setReviewIdToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const formRef = useRef<HTMLDivElement>(null);

  const fetchProductDetails = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await productService.getProductById(productId);
      setProductDetails(data);
      setReviews(data.reviews);
    } catch (err: any) {
      console.error('Error fetching product details:', err);
      setError(err.message || 'Failed to load product details.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProductDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  // Recalculate average rating and breakdown dynamically on client reviews list change
  const stats = useMemo(() => {
    const totalReviews = reviews.length;
    const breakdown: RatingBreakdown = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let sumRating = 0;

    reviews.forEach((r) => {
      if (r.rating >= 1 && r.rating <= 5) {
        breakdown[r.rating]++;
        sumRating += r.rating;
      }
    });

    const averageRating = totalReviews > 0 ? parseFloat((sumRating / totalReviews).toFixed(1)) : 0;

    return {
      averageRating,
      totalReviews,
      breakdown,
    };
  }, [reviews]);

  // Filter reviews based on rating click
  const filteredReviews = useMemo(() => {
    if (selectedRatingFilter === null) return reviews;
    return reviews.filter((r) => r.rating === selectedRatingFilter);
  }, [reviews, selectedRatingFilter]);

  // Handle new or edited review submissions (Optimistic Update)
  const handleFormSubmitSuccess = (submittedReview: Review, isEdit: boolean) => {
    if (isEdit) {
      // For updates, the service does not run in background since form handles it, 
      // but we update the UI reviews array.
      setReviews((prev) =>
        prev.map((r) => (r.id === submittedReview.id ? submittedReview : r))
      );
      setEditReview(null);
    } else {
      // Prepend newly created review to UI reviews
      setReviews((prev) => [submittedReview, ...prev]);
    }
  };

  // Scroll to form and set edit state
  const handleEditClick = (review: Review) => {
    setEditReview(review);
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  // Open confirmation modal for deletion
  const handleDeleteClick = (reviewId: string) => {
    setReviewIdToDelete(reviewId);
    setDeleteModalOpen(true);
  };

  // Execute deletion (Optimistic Update)
  const handleConfirmDelete = async () => {
    if (!reviewIdToDelete) return;

    setIsDeleting(true);
    const backupReviews = [...reviews];
    
    // Optimistically update reviews list
    setReviews((prev) => prev.filter((r) => r.id !== reviewIdToDelete));
    setDeleteModalOpen(false);

    try {
      await reviewService.deleteReview(reviewIdToDelete);
      toast.success('Review deleted successfully.');
    } catch (err) {
      console.error('Delete failed:', err);
      toast.error('Failed to delete review. Reverting changes.');
      // Revert reviews list on failure
      setReviews(backupReviews);
    } finally {
      setIsDeleting(false);
      setReviewIdToDelete(null);
    }
  };

  const handleRatingRowClick = (rating: number) => {
    if (selectedRatingFilter === rating) {
      setSelectedRatingFilter(null); // Toggle off
    } else {
      setSelectedRatingFilter(rating);
    }
  };

  if (error) {
    return <ErrorState message={error} onRetry={fetchProductDetails} />;
  }

  if (isLoading || !productDetails) {
    return <ProductDetailsSkeleton />;
  }

  return (
    <div className="space-y-10 animate-fadeIn">
      {/* Back button */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-indigo-650 dark:hover:text-indigo-400 group cursor-pointer transition-colors"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to Products
        </Link>
      </div>

      {/* Main product specs section */}
      <section className="grid grid-cols-1 gap-8 lg:grid-cols-12 bg-white border border-slate-205/65 rounded-2xl p-6 md:p-8 shadow-xs dark:border-slate-850 dark:bg-slate-950/20">
        {/* Image */}
        <div className="lg:col-span-5 relative aspect-square rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-100 dark:border-slate-850">
          {!imgError ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={productDetails.imageUrl}
              alt={productDetails.title}
              onError={() => setImgError(true)}
              className="h-full w-full object-cover"
            />
          ) : (
            <ProductImage productId={productDetails.id} title={productDetails.title} className="h-full w-full" isLarge />
          )}
        </div>

        {/* Product Info & Rating Details */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <span className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40">
              {productDetails.category}
            </span>
            
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-slate-100 leading-tight">
              {productDetails.title}
            </h1>

            <p className="text-2xl font-bold text-slate-800 dark:text-slate-200">
              ${productDetails.price.toFixed(2)}
            </p>
          </div>

          <p className="text-sm leading-relaxed text-slate-650 dark:text-slate-400">
            {productDetails.description}
          </p>

          {/* Rating summary grid */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-850 grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
            {/* Left box: Big average score */}
            <div className="sm:col-span-4 flex flex-col items-center justify-center text-center p-4 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850">
              <span className="text-4xl md:text-5xl font-black text-slate-900 dark:text-slate-100">
                {stats.averageRating.toFixed(1)}
              </span>
              <RatingStars rating={stats.averageRating} size="md" className="mt-2" />
              <span className="text-[11px] text-slate-405 dark:text-slate-500 font-medium mt-1">
                Based on {stats.totalReviews} {stats.totalReviews === 1 ? 'review' : 'reviews'}
              </span>
            </div>

            {/* Right box: Star breakdown bar list */}
            <div className="sm:col-span-8 space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                Rating Breakdown
              </h3>
              
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = stats.breakdown[rating] || 0;
                const percentage = stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;
                const isSelected = selectedRatingFilter === rating;

                return (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => handleRatingRowClick(rating)}
                    className={`flex items-center gap-3 w-full text-left rounded-md px-2 py-0.5 transition-colors cursor-pointer group/row ${
                      isSelected
                        ? 'bg-indigo-50/50 dark:bg-indigo-950/20'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-900/40'
                    }`}
                    aria-label={`Show only ${rating} star reviews (${count} reviews)`}
                  >
                    <span className="text-xs font-semibold text-slate-650 dark:text-slate-400 w-12 flex items-center gap-1 shrink-0">
                      {rating} <Star className="h-3 w-3 fill-slate-400 text-slate-400 group-hover/row:text-amber-400 group-hover/row:fill-amber-400 transition-colors" />
                    </span>
                    
                    {/* Progress Bar Container */}
                    <div className="h-2 flex-1 rounded-full bg-slate-100 dark:bg-slate-850 overflow-hidden relative">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isSelected
                            ? 'bg-linear-to-r from-indigo-500 to-purple-500'
                            : 'bg-slate-400 dark:bg-slate-600 group-hover/row:bg-indigo-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>

                    <span className="text-xs font-medium text-slate-405 dark:text-slate-505 w-8 text-right shrink-0">
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Review details listing & Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left pane: Review cards */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-4">
            <div className="flex items-center gap-2.5">
              <MessageSquare className="h-5 w-5 text-indigo-500" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Customer Reviews
              </h2>
            </div>
            
            {/* Filter Badge Display */}
            {selectedRatingFilter !== null && (
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-305 border border-indigo-100 dark:border-indigo-900/60 animate-scaleIn">
                  Showing {selectedRatingFilter}-star reviews
                  <button
                    onClick={() => setSelectedRatingFilter(null)}
                    className="ml-1 cursor-pointer rounded-full p-0.5 hover:bg-indigo-200 dark:hover:bg-indigo-900"
                    aria-label="Clear rating filter"
                  >
                    <FilterX className="h-3 w-3" />
                  </button>
                </span>
              </div>
            )}
          </div>

          {/* List of Reviews */}
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {filteredReviews.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center p-12 text-center rounded-xl border border-dashed border-slate-200 dark:border-slate-800 bg-white/30 dark:bg-slate-950/5"
                >
                  <Sparkles className="h-8 w-8 text-slate-300 dark:text-slate-700 mb-3" />
                  <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    No reviews matching this criteria
                  </h3>
                  <p className="text-xs text-slate-405 dark:text-slate-500 mt-1">
                    {selectedRatingFilter !== null
                      ? `There are no ${selectedRatingFilter}-star reviews yet for this product.`
                      : 'Be the first to share your experience by submitting a review!'}
                  </p>
                  {selectedRatingFilter !== null && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedRatingFilter(null)}
                      className="mt-4 text-xs font-bold text-indigo-555 cursor-pointer"
                    >
                      Show All Reviews
                    </Button>
                  )}
                </motion.div>
              ) : (
                filteredReviews.map((review) => (
                  <ReviewCard
                    key={review.id}
                    review={review}
                    onEdit={handleEditClick}
                    onDelete={handleDeleteClick}
                  />
                ))
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right pane: Review submission form */}
        <div ref={formRef} className="lg:col-span-4 lg:sticky lg:top-24">
          <ReviewForm
            productId={productId}
            onSubmitSuccess={handleFormSubmitSuccess}
            editReview={editReview}
            onCancelEdit={() => setEditReview(null)}
            existingReviews={reviews}
          />
        </div>
      </div>

      {/* Confirmation Modal for Delete Review */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Review"
        footerButtons={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeleteModalOpen(false)}
              disabled={isDeleting}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleConfirmDelete}
              isLoading={isDeleting}
              className="cursor-pointer"
            >
              Delete Review
            </Button>
          </>
        }
      >
        <p className="text-sm text-slate-650 dark:text-slate-400">
          Are you sure you want to delete this review? This action is permanent and cannot be undone.
        </p>
      </Modal>
    </div>
  );
}
