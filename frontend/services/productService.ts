import { api, isApiActive } from './axios';
import { Product, ProductDetails, ProductFilters } from '@/types';
import { getLocalProducts, getLocalProductDetails } from '@/utils/db';

export const productService = {
  getProducts: async (filters: ProductFilters, page = 1, limit = 6): Promise<{ products: Product[]; total: number }> => {
    if (isApiActive()) {
      try {
        const response = await api.get('/products', {
          params: {
            search: filters.search || undefined,
            rating: filters.rating !== null ? filters.rating : undefined,
            sort_by: filters.sortBy,
            page,
            limit,
          },
        });

        // Backend wraps in {success, message, data: {products, total, page, limit}}
        const payload = response.data?.data || response.data;

        // Map backend snake_case fields to frontend camelCase
        const products: Product[] = (payload.products || []).map((p: any) => ({
          id: p.id,
          title: p.title,
          description: p.description,
          shortDescription: p.short_description || p.shortDescription || '',
          rating: p.rating || 0,
          reviewsCount: p.reviews_count ?? p.reviewsCount ?? 0,
          imageUrl: p.image_url || p.imageUrl || '',
          category: p.category || '',
          price: p.price || 0,
        }));

        return { products, total: payload.total || 0 };
      } catch (error) {
        console.warn('FastAPI backend request failed, falling back to local database mock.', error);
      }
    }

    // Local Storage fallback implementation
    let list = [...getLocalProducts()];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower) ||
          p.shortDescription.toLowerCase().includes(searchLower)
      );
    }

    if (filters.rating !== null) {
      list = list.filter((p) => Math.floor(p.rating) === filters.rating);
    }

    if (filters.sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    } else if (filters.sortBy === 'reviews') {
      list.sort((a, b) => b.reviewsCount - a.reviewsCount);
    } else if (filters.sortBy === 'name') {
      list.sort((a, b) => a.title.localeCompare(b.title));
    } else if (filters.sortBy === 'newest') {
      list.sort((a, b) => b.id.localeCompare(a.id));
    }

    const total = list.length;
    const startIndex = (page - 1) * limit;
    const products = list.slice(startIndex, startIndex + limit);

    return { products, total };
  },

  getProductById: async (id: string): Promise<ProductDetails> => {
    if (isApiActive()) {
      try {
        const response = await api.get(`/products/${id}`);

        // Backend wraps in {success, message, data: ProductDetailResponse}
        const p = response.data?.data || response.data;

        // Map reviews
        const reviews = (p.reviews || []).map((r: any) => ({
          id: r.id,
          productId: r.product_id || p.id,
          userName: r.user_name || r.userName || 'Anonymous',
          rating: r.rating,
          comment: r.comment,
          createdAt: r.created_at || r.createdAt,
        }));

        // Map breakdown (backend sends {1: count, 2: count, ...})
        const breakdown = p.breakdown || { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

        return {
          id: p.id,
          title: p.title,
          description: p.description,
          shortDescription: p.short_description || p.shortDescription || '',
          rating: p.rating || 0,
          reviewsCount: p.reviews_count ?? p.reviewsCount ?? 0,
          imageUrl: p.image_url || p.imageUrl || '',
          category: p.category || '',
          price: p.price || 0,
          reviews,
          breakdown,
        };
      } catch (error) {
        console.warn(`FastAPI backend request for product ${id} failed, falling back to local database mock.`, error);
      }
    }

    const details = getLocalProductDetails(id);
    if (!details) {
      throw new Error(`Product not found with id: ${id}`);
    }
    return details;
  },
};
