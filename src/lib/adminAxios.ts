import axios from 'axios';
import { useAdminStore } from '@/store/adminStore';

const adminApi = axios.create({
  baseURL: '/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT from store to every request
adminApi.interceptors.request.use((config) => {
  const token = useAdminStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// On 401, log out and redirect to login
adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAdminStore.getState().logout();
      window.location.href = '/admin/login';
    }
    const message =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      'Something went wrong.';
    return Promise.reject(new Error(message));
  }
);

export default adminApi;
