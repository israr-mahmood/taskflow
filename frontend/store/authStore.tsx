import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  setToken: (token: string | null) => void;
  isAuthenticated: boolean;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      isAuthenticated: false,
      setToken: (token: string | null) => 
        set({ token, isAuthenticated: !!token }),
      logout: () => 
        set({ token: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage', // name of the item in storage
      partialize: (state) => ({ token: state.token }), // only store the token
    }
  )
);