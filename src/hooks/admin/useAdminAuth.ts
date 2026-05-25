import { useMutation } from '@tanstack/react-query';
import adminApi from '@/lib/adminAxios';
import { useAdminStore } from '@/store/adminStore';
import { ApiResponse } from '@/types';

interface LoginResponse {
  token: string;
  admin: { username: string };
}

export function useAdminLogin() {
  const login = useAdminStore((s) => s.login);
  return useMutation({
    mutationFn: async (credentials: { username: string; password: string }) => {
      const { data } = await adminApi.post<ApiResponse<LoginResponse>>('/auth/login', credentials);
      return data.data!;
    },
    onSuccess: ({ token, admin }) => {
      login(token, admin);
    },
  });
}
