"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { Product } from "@/types";
import { formatPrice, getDiscountPercent } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem   = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);

  const image    = product.images.find((i) => i.isPrimary) ?? product.images[0];
  const discount = product.compareAtPrice
    ? getDiscountPercent(product.price, product.compareAtPrice)
    : null;

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">

        {/* Image */}
        <div className="relative aspect-square bg-gray-50 overflow-hidden">
          {image?.url ? (
            <Image
              src={image.url}
              alt={image.altText ?? product.name}
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

        {/* Info */}
        <div className="p-2.5">
          <h3 className="text-[12px] text-gray-700 leading-snug line-clamp-2 mb-2 min-h-[2.5rem]">
            {product.name}
          </h3>

          <div className="flex items-end justify-between gap-1">
            <div>
              <p className="text-sm font-extrabold text-gray-900 leading-tight">
                {formatPrice(product.price)}
              </p>
              {product.compareAtPrice && (
                <p className="text-[11px] text-gray-400 line-through leading-tight">
                  {formatPrice(product.compareAtPrice)}
                </p>
              )}
            </div>

            <button
              onClick={handleAddToCart}
              aria-label="Add to cart"
              className="shrink-0 flex items-center gap-1 bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-md transition-colors"
            >
              <ShoppingCart size={11} />
              {added ? "Added!" : "Add"}
            </button>
          </div>
        </div>

      </div>
    </Link>
  );
}
