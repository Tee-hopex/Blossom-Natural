import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import { Product, PaginatedResponse, ApiResponse } from '@/types';

interface ProductFilters {
  page?: number;
  limit?: number;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  search?: string;
  sort?: 'newest' | 'price_asc' | 'price_desc' | 'rating';
}

export function useProducts(filters: ProductFilters = {}) {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, val]) => {
        if (val !== undefined && val !== '') params.set(key, String(val));
      });
      const { data } = await api.get<PaginatedResponse<Product>>(`/products?${params}`);
      return data;
    },
  });
}

export function useFeaturedProducts() {
  return useQuery({
    queryKey: ['products', 'featured'],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Product[]>>('/products/featured');
      return data.data ?? [];
    },
  });
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: ['products', slug],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Product>>(`/products/${slug}`);
      return data.data!;
    },
    enabled: !!slug,
  });
}
