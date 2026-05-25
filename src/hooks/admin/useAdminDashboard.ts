import { useQuery } from '@tanstack/react-query';
import adminApi from '@/lib/adminAxios';
import { ApiResponse } from '@/types';

export interface DashboardStats {
  orders: {
    total: number; pending: number; confirmed: number;
    processing: number; shipped: number; delivered: number; cancelled: number;
  };
  revenue: {
    today: number; thisMonth: number; lastMonth: number; total: number; monthGrowth: number;
  };
  lowStock: { _id: string; name: string; stock: number; images: string[]; slug: string }[];
  recentOrders: {
    _id: string; orderNumber: string; customerName: string;
    total: number; status: string; createdAt: string;
  }[];
  subscriberCount: number;
  totalProducts: number;
}

export function useAdminDashboard() {
  return useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: async () => {
      const { data } = await adminApi.get<ApiResponse<DashboardStats>>('/admin/dashboard');
      return data.data!;
    },
    refetchInterval: 60_000,
  });
}
