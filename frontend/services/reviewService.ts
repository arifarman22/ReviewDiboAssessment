import { api, isApiActive } from './axios';
import { Review, CreateReviewInput } from '@/types';
import { addLocalReview, updateLocalReview, deleteLocalReview } from '@/utils/db';

const mapReview = (r: any, fallbackProductId?: string): Review => ({
  id: r.id,
  productId: r.product_id || r.productId || fallbackProductId || '',
  userName: r.user_name || r.userName || 'Anonymous',
  rating: r.rating,
  comment: r.comment,
  createdAt: r.created_at || r.createdAt,
});

export const reviewService = {
  createReview: async (productId: string, input: CreateReviewInput): Promise<Review> => {
    if (isApiActive()) {
      try {
        // Token is auto-attached by axios interceptor — backend identifies user from JWT
        const response = await api.post(`/products/${productId}/reviews`, {
          rating: input.rating,
          comment: input.comment,
        });
        const data = response.data?.data || response.data;
        return mapReview(data, productId);
      } catch (error: any) {
        // If it's a 400/401/403, don't fallback — throw to show proper error
        if (error?.response?.status && error.response.status < 500) {
          const msg = error.response.data?.detail || error.response.data?.message || 'Failed to submit review';
          throw new Error(msg);
        }
        console.warn('FastAPI backend request failed, falling back to local mock.', error);
      }
    }

    return addLocalReview(productId, input.userName, input.rating, input.comment);
  },

  updateReview: async (reviewId: string, input: { rating: number; comment: string }): Promise<Review> => {
    if (isApiActive()) {
      try {
        const response = await api.put(`/reviews/${reviewId}`, {
          rating: input.rating,
          comment: input.comment,
        });
        const data = response.data?.data || response.data;
        return mapReview(data);
      } catch (error: any) {
        if (error?.response?.status && error.response.status < 500) {
          const msg = error.response.data?.detail || error.response.data?.message || 'Failed to update review';
          throw new Error(msg);
        }
        console.warn('FastAPI backend request failed, falling back to local mock.', error);
      }
    }

    const review = updateLocalReview(reviewId, input.rating, input.comment);
    if (!review) throw new Error('Review not found');
    return review;
  },

  deleteReview: async (reviewId: string): Promise<void> => {
    if (isApiActive()) {
      try {
        await api.delete(`/reviews/${reviewId}`);
        return;
      } catch (error: any) {
        if (error?.response?.status && error.response.status < 500) {
          const msg = error.response.data?.detail || error.response.data?.message || 'Failed to delete review';
          throw new Error(msg);
        }
        console.warn('FastAPI backend request failed, falling back to local mock.', error);
      }
    }

    const success = deleteLocalReview(reviewId);
    if (!success) throw new Error('Review not found');
  },
};
