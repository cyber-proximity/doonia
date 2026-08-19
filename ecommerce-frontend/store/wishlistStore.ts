import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "@/lib/api";

export interface WishlistItem {
  id: number;
  name: string;
  slug: string;
  price: number;
  compareAtPrice: number | null;
  imageUrl: string | null;
}

interface WishlistStore {
  items: WishlistItem[];
  isLoaded: boolean;
  addItem: (item: WishlistItem, isAuthenticated: boolean) => Promise<void>;
  removeItem: (productId: number, isAuthenticated: boolean) => Promise<void>;
  isInWishlist: (productId: number) => boolean;
  fetchWishlist: () => Promise<void>;
  syncGuestWishlist: () => Promise<void>;
  clearItems: () => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      isLoaded: false,

      addItem: async (item, isAuthenticated) => {
        if (isAuthenticated) {
          await api.post(`/v1/wishlist/${item.id}`);
        }
        set((state) => {
          if (state.items.some((i) => i.id === item.id)) return state;
          return { items: [...state.items, item] };
        });
      },

      removeItem: async (productId, isAuthenticated) => {
        if (isAuthenticated) {
          await api.delete(`/v1/wishlist/${productId}`);
        }
        set((state) => ({ items: state.items.filter((i) => i.id !== productId) }));
      },

      isInWishlist: (productId) => get().items.some((i) => i.id === productId),

      fetchWishlist: async () => {
        const res = await api.get("/v1/wishlist");
        set({ items: res.data.data, isLoaded: true });
      },

      syncGuestWishlist: async () => {
        const guestItems = get().items;
        const res = await api.post("/v1/wishlist/sync", {
          product_ids: guestItems.map((i) => i.id),
        });
        set({ items: res.data.data, isLoaded: true });
      },

      clearItems: () => set({ items: [], isLoaded: false }),
    }),
    {
      name: "doonia_wishlist",
    }
  )
);
