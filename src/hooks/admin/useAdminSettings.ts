import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import adminApi from '@/lib/adminAxios';
import { ApiResponse } from '@/types';
import toast from 'react-hot-toast';

export interface SiteSettings {
  bankName: string;
  bankAccountName: string;
  bankAccountNumber: string;
  whatsappNumber: string;
  deliveryFee: number;
  freeDeliveryThreshold: number;
}

export function useAdminSettings() {
  return useQuery({
    queryKey: ['admin', 'settings'],
    queryFn: async () => {
      const { data } = await adminApi.get<ApiResponse<SiteSettings>>('/admin/settings');
      return data.data!;
    },
  });
}

export function useUpdateSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<SiteSettings>) => {
      const { data } = await adminApi.put<ApiResponse<SiteSettings>>('/admin/settings', payload);
      return data.data!;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'settings'] });
      qc.invalidateQueries({ queryKey: ['settings'] });
      toast.success('Settings saved!');
    },
    onError: (e: Error) => toast.error(e.message),
  });
}
