import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import adminApi from '@/lib/adminAxios';
import { Order, PaginatedResponse, ApiResponse } from '@/types';
import toast from 'react-hot-toast';

interface OrderFilters { page?: number; limit?: number; status?: string; }

export function useAdminOrders(filters: OrderFilters = {}) {
  return useQuery({
    queryKey: ['admin', 'orders', filters],
    queryFn: async () => {
      const params = new URLSearchParams({ limit: '20', ...Object.fromEntries(
        Object.entries(filters).filter(([, v]) => v !== undefined && v !== '').map(([k, v]) => [k, String(v)])
      )});
      const { data } = await adminApi.get<PaginatedResponse<Order>>(`/orders?${params}`);
      return data;
    },
  });
}

export function useUpdateOrderStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { data } = await adminApi.patch<ApiResponse<Order>>(`/orders/${id}/status`, { status });
      return data.data!;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'orders'] });
      toast.success('Order status updated!');
    },
    onError: (e: Error) => toast.error(e.message),
  });
}

export function useMarkOrderPaid() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, paymentProof }: { id: string; paymentProof?: string }) => {
      const { data } = await adminApi.patch<ApiResponse<Order>>(`/orders/${id}/payment`, { paymentProof });
      return data.data!;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'orders'] });
      toast.success('Payment confirmed! Order set to Confirmed.');
    },
    onError: (e: Error) => toast.error(e.message),
  });
}
