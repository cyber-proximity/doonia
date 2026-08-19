"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { useWishlistStore } from "@/store/wishlistStore";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import { useCurrency } from "@/lib/context/CurrencyContext";
import { getDiscountPercent } from "@/lib/utils";

export default function WishlistPage() {
  const { isAuthenticated } = useAuthStore();
  const { items, fetchWishlist, removeItem } = useWishlistStore();
  const addCartItem = useCartStore((s) => s.addItem);
  const { format }  = useCurrency();

  // Refresh from server each time the page mounts if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlist().catch(() => {});
    }
  }, [isAuthenticated, fetchWishlist]);

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4 text-center">
        <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center">
          <Heart size={36} className="text-red-300" />
        </div>
        <h1 className="text-xl font-bold text-gray-800">Your wishlist is empty</h1>
        <p className="text-sm text-gray-500 max-w-xs">
          Save items you love by tapping the heart icon on any product.
        </p>
        <Link
          href="/products"
          className="mt-2 bg-primary-500 hover:bg-primary-600 text-white font-semibold text-sm px-6 py-3 rounded-xl transition-colors"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 pb-24">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-lg font-bold text-gray-900">
          My Wishlist <span className="text-gray-400 font-normal text-base">({items.length})</span>
        </h1>
        {!isAuthenticated && (
          <p className="text-xs text-gray-500">
            <Link href="/login" className="text-primary-600 font-semibold hover:underline">Sign in</Link>
            {" "}to save your wishlist permanently.
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {items.map((item) => {
          const discount = item.compareAtPrice
            ? getDiscountPercent(item.price, item.compareAtPrice)
            : null;

          return (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group"
            >
              <Link href={`/products/${item.slug}`} className="block">
                <div className="relative aspect-square bg-gray-50">
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
                      No image
                    </div>
                  )}
                  {discount && (
                    <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm leading-tight">
                      -{discount}%
                    </span>
                  )}
                </div>
                <div className="p-2.5">
                  <p className="text-[12px] text-gray-700 leading-snug line-clamp-2 mb-2 min-h-[2.5rem]">
                    {item.name}
                  </p>
                  <div className="flex items-end justify-between gap-1 mb-2">
                    <div>
                      <p className="text-sm font-extrabold text-gray-900 leading-tight">
                        {format(item.price)}
                      </p>
                      {item.compareAtPrice && (
                        <p className="text-[11px] text-gray-400 line-through leading-tight">
                          {format(item.compareAtPrice)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </Link>

              {/* Action buttons */}
              <div className="px-2.5 pb-2.5 flex gap-1.5">
                <button
                  onClick={() => {
                    // Add a minimal product proxy to cart — cart needs the full Product shape
                    // so we navigate to the product page instead of adding directly
                    addCartItem({
                      id: item.id,
                      name: item.name,
                      slug: item.slug,
                      price: item.price,
                      compareAtPrice: item.compareAtPrice,
                      description: "",
                      sku: "",
                      stockQuantity: 999,
                      status: "active",
                      featured: false,
                      category: { id: 0, name: "", slug: "", image: "", productCount: 0 },
                      images: item.imageUrl ? [{ id: 0, url: item.imageUrl, altText: item.name, isPrimary: true }] : [],
                      avgRating: null,
                      reviewCount: 0,
                    });
                  }}
                  className="flex-1 flex items-center justify-center gap-1 bg-primary-500 hover:bg-primary-600 text-white text-[10px] font-bold px-2 py-1.5 rounded-lg transition-colors"
                >
                  <ShoppingCart size={11} /> Add to Cart
                </button>
                <button
                  onClick={() => removeItem(item.id, isAuthenticated)}
                  aria-label="Remove from wishlist"
                  className="p-1.5 rounded-lg border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 transition-colors"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
