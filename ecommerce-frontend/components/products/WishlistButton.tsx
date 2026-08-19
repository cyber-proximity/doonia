"use client";

import { Heart } from "lucide-react";
import { useWishlistStore, WishlistItem } from "@/store/wishlistStore";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/lib/utils";

interface Props {
  item: WishlistItem;
  size?: number;
  className?: string;
}

export default function WishlistButton({ item, size = 16, className }: Props) {
  const { isAuthenticated } = useAuthStore();
  const { isInWishlist, addItem, removeItem } = useWishlistStore();

  const inWishlist = isInWishlist(item.id);

  async function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    try {
      if (inWishlist) {
        await removeItem(item.id, isAuthenticated);
      } else {
        await addItem(item, isAuthenticated);
      }
    } catch {
      // silently ignore — local state was already updated optimistically
    }
  }

  return (
    <button
      onClick={handleClick}
      aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
      className={cn(
        "p-2 rounded-lg border transition-colors",
        inWishlist
          ? "border-red-300 bg-red-50 text-red-500 hover:bg-red-100"
          : "border-gray-300 bg-white text-gray-400 hover:text-red-500 hover:border-red-300",
        className
      )}
    >
      <Heart
        size={size}
        className={inWishlist ? "fill-red-500" : ""}
      />
    </button>
  );
}
