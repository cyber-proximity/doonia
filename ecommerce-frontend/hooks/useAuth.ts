import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { AxiosError } from "axios";

interface ApiError {
  status: string;
  message: string;
  errors?: Record<string, string[]>;
}

export function useAuth() {
  const router = useRouter();
  const { user, token, isAuthenticated, setAuth, clearAuth } = useAuthStore();
  const { syncGuestWishlist, clearItems } = useWishlistStore();

  async function register(data: {
    name: string;
    email: string;
    phone: string;
    country?: string;
    password: string;
    password_confirmation: string;
  }) {
    const res = await api.post("/v1/auth/register", data);
    setAuth(res.data.data.user, res.data.data.token);
    await syncGuestWishlist().catch(() => {});
    router.push("/");
  }

  async function login(data: { email: string; password: string }, redirectTo?: string) {
    const res = await api.post("/v1/auth/login", data);
    setAuth(res.data.data.user, res.data.data.token);
    await syncGuestWishlist().catch(() => {});
    router.push(redirectTo ?? "/");
  }

  async function logout() {
    try {
      await api.post("/v1/auth/logout");
    } finally {
      clearAuth();
      clearItems();
      router.push("/login");
    }
  }

  async function forgotPassword(email: string) {
    await api.post("/v1/auth/forgot-password", { email });
  }

  async function resetPassword(data: {
    email: string;
    token: string;
    password: string;
    password_confirmation: string;
  }) {
    await api.post("/v1/auth/reset-password", data);
  }

  function getApiError(err: unknown): string {
    const axiosErr = err as AxiosError<ApiError>;
    return axiosErr.response?.data?.message ?? "Something went wrong. Please try again.";
  }

  return { user, token, isAuthenticated, register, login, logout, forgotPassword, resetPassword, getApiError };
}
