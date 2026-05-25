import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import adminApi from '@/lib/adminAxios';
import { Product, PaginatedResponse, ApiResponse } from '@/types';
import toast from 'react-hot-toast';

interface ProductFilters {
  page?: number; limit?: number; category?: string; search?: string; sort?: string;
}

export function useAdminProducts(filters: ProductFilters = {}) {
  return useQuery({
    queryKey: ['admin', 'products', filters],
    queryFn: async () => {
      const params = new URLSearchParams({ limit: '20', ...Object.fromEntries(
        Object.entries(filters).filter(([, v]) => v !== undefined).map(([k, v]) => [k, String(v)])
      )});
      const { data } = await adminApi.get<PaginatedResponse<Product>>(`/products?${params}`);
      return data;
    },
  });
}

export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<Product> & { category: string }) => {
      const { data } = await adminApi.post<ApiResponse<Product>>('/products', payload);
      return data.data!;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'products'] });
      qc.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product created successfully!');
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useUpdateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: Partial<Product> & { id: string; category?: string }) => {
      const { data } = await adminApi.put<ApiResponse<Product>>(`/products/${id}`, payload);
      return data.data!;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'products'] });
      qc.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product updated!');
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await adminApi.delete(`/products/${id}`);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'products'] });
      qc.invalidateQueries({ queryKey: ['products'] });
      toast.success('Product deleted.');
    },
    onError: (e: Error) => toast.error(e.message),
  });
}
