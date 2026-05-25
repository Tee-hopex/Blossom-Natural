import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AdminState {
  token: string | null;
  admin: { username: string } | null;
  login: (token: string, admin: { username: string }) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set, get) => ({
      token: null,
      admin: null,
      login: (token, admin) => set({ token, admin }),
      logout: () => set({ token: null, admin: null }),
      isAuthenticated: () => !!get().token,
    }),
    { name: 'blossom-admin-auth' }
  )
);
