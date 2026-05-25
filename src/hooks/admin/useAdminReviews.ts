import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import adminApi from '@/lib/adminAxios';
import { ApiResponse } from '@/types';
import toast from 'react-hot-toast';

export interface AdminReview {
  _id: string;
  product: { _id: string; name: string; slug: string; images: string[] };
  author: string;
  email: string;
  rating: number;
  title?: string;
  body: string;
  isApproved: boolean;
  createdAt: string;
}

export function useAdminReviews(isApproved?: boolean) {
  return useQuery({
    queryKey: ['admin', 'reviews', isApproved],
    queryFn: async () => {
      const params = isApproved !== undefined ? `?isApproved=${isApproved}` : '';
      const { data } = await adminApi.get<ApiResponse<AdminReview[]>>(`/admin/reviews${params}`);
      return data.data ?? [];
    },
  });
}

export function useUpdateReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, isApproved }: { id: string; isApproved: boolean }) => {
      await adminApi.patch(`/admin/reviews/${id}`, { isApproved });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'reviews'] });
      toast.success('Review updated!');
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useDeleteReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => adminApi.delete(`/admin/reviews/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'reviews'] });
      toast.success('Review deleted.');
    },
    onError: (e: Error) => toast.error(e.message),
  });
}
