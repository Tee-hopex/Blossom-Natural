import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import { Category, ApiResponse } from '@/types';

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Category[]>>('/categories');
      return data.data ?? [];
    },
    staleTime: 1000 * 60 * 10, // categories change rarely
  });
}
