import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import adminApi from '@/lib/adminAxios';
import { Category, ApiResponse } from '@/types';
import toast from 'react-hot-toast';

export function useAdminCategories() {
  return useQuery({
    queryKey: ['admin', 'categories'],
    queryFn: async () => {
      const { data } = await adminApi.get<ApiResponse<Category[]>>('/categories');
      return data.data ?? [];
    },
  });
}

export function useCreateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<Category>) => {
      const { data } = await adminApi.post<ApiResponse<Category>>('/categories', payload);
      return data.data!;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'categories'] });
      qc.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category created!');
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useUpdateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: Partial<Category> & { id: string }) => {
      const { data } = await adminApi.put<ApiResponse<Category>>(`/categories/${id}`, payload);
      return data.data!;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'categories'] });
      qc.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category updated!');
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useDeleteCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => adminApi.delete(`/categories/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'categories'] });
      qc.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Category deleted.');
    },
    onError: (e: Error) => toast.error(e.message),
  });
}
