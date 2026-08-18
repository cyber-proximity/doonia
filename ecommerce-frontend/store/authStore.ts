import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthUser {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  country: string | null;
  email_verified_at: string | null;
  created_at: string;
}

interface AuthStore {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: AuthUser, token: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setAuth: (user, token) => {
        if (typeof window !== "undefined") {
          localStorage.setItem("doonia_auth_token", token);
        }
        set({ user, token, isAuthenticated: true });
      },

      clearAuth: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("doonia_auth_token");
        }
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    {
      name: "doonia_auth",
      partialize: (state) => ({ user: state.user, token: state.token, isAuthenticated: state.isAuthenticated }),
    }
  )
);
