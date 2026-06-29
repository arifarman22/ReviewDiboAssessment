export interface Product {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  rating: number;
  reviewsCount: number;
  imageUrl: string;
  category: string;
  price: number;
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  rating: number; // 1-5
  comment: string;
  createdAt: string; // ISO String
}

export interface RatingBreakdown {
  [key: number]: number; // 1 to 5 -> count
}

export interface ProductDetails extends Product {
  reviews: Review[];
  breakdown: RatingBreakdown;
}

export interface ProductFilters {
  search: string;
  rating: number | null; // null means all
  sortBy: 'rating' | 'reviews' | 'name' | 'newest';
}

export interface CreateReviewInput {
  userName: string;
  rating: number;
  comment: string;
}
