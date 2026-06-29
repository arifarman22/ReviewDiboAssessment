import { Product, Review, ProductDetails, RatingBreakdown } from '@/types';
import { INITIAL_PRODUCTS, INITIAL_REVIEWS } from '@/constants/mockData';

const PRODUCTS_KEY = 'review_platform_products';
const REVIEWS_KEY = 'review_platform_reviews';
const DB_VERSION_KEY = 'review_platform_db_version';
const CURRENT_DB_VERSION = '3'; // Bump to force re-seed with relevant Unsplash images

export const initDb = () => {
  if (typeof window === 'undefined') return;

  const storedVersion = localStorage.getItem(DB_VERSION_KEY);
  if (storedVersion !== CURRENT_DB_VERSION) {
    // Force re-seed to pick up updated data (e.g. fixed image URLs)
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(INITIAL_PRODUCTS));
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(INITIAL_REVIEWS));
    localStorage.setItem(DB_VERSION_KEY, CURRENT_DB_VERSION);
    return;
  }

  if (!localStorage.getItem(PRODUCTS_KEY)) {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(INITIAL_PRODUCTS));
  }
  if (!localStorage.getItem(REVIEWS_KEY)) {
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(INITIAL_REVIEWS));
  }
};

export const getLocalProducts = (): Product[] => {
  if (typeof window === 'undefined') return INITIAL_PRODUCTS;
  initDb();
  const data = localStorage.getItem(PRODUCTS_KEY);
  return data ? JSON.parse(data) : INITIAL_PRODUCTS;
};

export const getLocalReviews = (): Review[] => {
  if (typeof window === 'undefined') return INITIAL_REVIEWS;
  initDb();
  const data = localStorage.getItem(REVIEWS_KEY);
  return data ? JSON.parse(data) : INITIAL_REVIEWS;
};

export const getLocalProductDetails = (id: string): ProductDetails | null => {
  const products = getLocalProducts();
  const product = products.find((p) => p.id === id);
  if (!product) return null;

  const allReviews = getLocalReviews();
  const reviews = allReviews.filter((r) => r.productId === id);

  // Sort reviews by date descending
  reviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Calculate rating breakdown
  const breakdown: RatingBreakdown = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let totalRating = 0;

  reviews.forEach((r) => {
    if (r.rating >= 1 && r.rating <= 5) {
      breakdown[r.rating]++;
      totalRating += r.rating;
    }
  });

  const averageRating = reviews.length > 0 ? parseFloat((totalRating / reviews.length).toFixed(1)) : 0;

  // Sync back product rating and reviews count if changed
  let updated = false;
  if (product.rating !== averageRating) {
    product.rating = averageRating;
    updated = true;
  }
  if (product.reviewsCount !== reviews.length) {
    product.reviewsCount = reviews.length;
    updated = true;
  }

  if (updated && typeof window !== 'undefined') {
    const updatedProducts = products.map((p) => (p.id === id ? product : p));
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(updatedProducts));
  }

  return {
    ...product,
    reviews,
    breakdown,
  };
};

export const addLocalReview = (productId: string, userName: string, rating: number, comment: string): Review => {
  const allReviews = getLocalReviews();
  const newReview: Review = {
    id: `rev-${Date.now()}`,
    productId,
    userName,
    rating,
    comment,
    createdAt: new Date().toISOString(),
  };

  const updatedReviews = [newReview, ...allReviews];
  localStorage.setItem(REVIEWS_KEY, JSON.stringify(updatedReviews));

  // Trigger recalculation of product details to sync rating / reviewsCount
  getLocalProductDetails(productId);

  return newReview;
};

export const updateLocalReview = (reviewId: string, rating: number, comment: string): Review | null => {
  const allReviews = getLocalReviews();
  const index = allReviews.findIndex((r) => r.id === reviewId);
  if (index === -1) return null;

  const oldReview = allReviews[index];
  const updatedReview: Review = {
    ...oldReview,
    rating,
    comment,
    createdAt: new Date().toISOString(), // Update date on edit
  };

  allReviews[index] = updatedReview;
  localStorage.setItem(REVIEWS_KEY, JSON.stringify(allReviews));

  // Trigger recalculation of product details
  getLocalProductDetails(oldReview.productId);

  return updatedReview;
};

export const deleteLocalReview = (reviewId: string): boolean => {
  const allReviews = getLocalReviews();
  const reviewToDelete = allReviews.find((r) => r.id === reviewId);
  if (!reviewToDelete) return false;

  const filteredReviews = allReviews.filter((r) => r.id !== reviewId);
  localStorage.setItem(REVIEWS_KEY, JSON.stringify(filteredReviews));

  // Trigger recalculation of product details
  getLocalProductDetails(reviewToDelete.productId);

  return true;
};
