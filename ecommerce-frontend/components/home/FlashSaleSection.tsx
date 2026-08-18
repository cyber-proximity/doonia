"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Zap, ArrowRight, ShoppingCart } from "lucide-react";
import { Product } from "@/types";
import { getDiscountPercent } from "@/lib/utils";
import { useCurrency } from "@/lib/context/CurrencyContext";
import { useCartStore } from "@/store/cartStore";
import StarRating from "@/components/ui/StarRating";

interface Props {
  products: Product[];
}

function useCountdown() {
  const [timeLeft, setTimeLeft] = useState({ h: 0, m: 0, s: 0 });

  useEffect(() => {
    function calcTimeLeft() {
      const now   = new Date();
      const end   = new Date();
      end.setHours(23, 59, 59, 999);
      const diff  = Math.max(0, end.getTime() - now.getTime());
      const h     = Math.floor(diff / 3_600_000);
      const m     = Math.floor((diff % 3_600_000) / 60_000);
      const s     = Math.floor((diff % 60_000) / 1_000);
      return { h, m, s };
    }
    setTimeLeft(calcTimeLeft());
    const id = setInterval(() => setTimeLeft(calcTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  return timeLeft;
}

function Digit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="bg-white text-secondary-600 font-extrabold text-lg leading-none w-9 h-9 flex items-center justify-center rounded-lg tabular-nums shadow-sm">
        {String(value).padStart(2, "0")}
      </span>
      <span className="text-[9px] text-white/70 mt-0.5 uppercase tracking-wide">{label}</span>
    </div>
  );
}

function FlashCard({ product }: { product: Product }) {
  const addItem  = useCartStore((s) => s.addItem);
  const { format } = useCurrency();
  const [added, setAdded] = useState(false);
  const image    = product.images.find((i) => i.isPrimary) ?? product.images[0];
  const discount = product.compareAtPrice
    ? getDiscountPercent(product.price, product.compareAtPrice)
    : null;

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault();
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <Link href={`/products/${product.slug}`} className="group shrink-0 w-40 sm:w-44">
      <div className="bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-md transition-shadow">
        <div className="relative aspect-square bg-gray-50 overflow-hidden">
          <Image
            src={image?.url ?? "/placeholder.png"}
            alt={image?.altText ?? product.name}
            fill
            sizes="176px"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {discount && (
            <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              -{discount}%
            </span>
          )}
        </div>
        <div className="p-2.5">
          <p className="text-xs text-gray-700 font-medium leading-snug line-clamp-2 mb-1.5 group-hover:text-primary-600 transition-colors">
            {product.name}
          </p>
          {product.reviewCount > 0 && (
            <div className="flex items-center gap-1 mb-1.5">
              <StarRating rating={product.avgRating ?? 0} size={9} />
              <span className="text-[10px] text-gray-400">({product.reviewCount})</span>
            </div>
          )}
          <div className="flex items-center justify-between gap-1">
            <div>
              <p className="text-sm font-extrabold text-gray-900">{format(product.price)}</p>
              {product.compareAtPrice && (
                <p className="text-[10px] text-gray-400 line-through">{format(product.compareAtPrice)}</p>
              )}
            </div>
            <button
              onClick={handleAdd}
              className="shrink-0 bg-primary-500 hover:bg-primary-600 text-white p-1.5 rounded-lg transition-colors"
              title="Add to cart"
            >
              <ShoppingCart size={13} />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function FlashSaleSection({ products }: Props) {
  const { h, m, s } = useCountdown();
  const scrollRef    = useRef<HTMLDivElement>(null);

  if (!products.length) return null;

  return (
    <section className="mb-5 rounded-xl overflow-hidden">
      {/* Header bar */}
      <div className="bg-secondary-600 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-white font-extrabold text-lg">
            <Zap size={20} className="text-yellow-300 fill-yellow-300" />
            Flash Sale
          </div>
          <div className="hidden sm:flex items-center gap-1.5">
            <span className="text-white/70 text-xs mr-1">Ends in</span>
            <Digit value={h} label="hrs" />
            <span className="text-white font-bold text-lg pb-4">:</span>
            <Digit value={m} label="min" />
            <span className="text-white font-bold text-lg pb-4">:</span>
            <Digit value={s} label="sec" />
          </div>
        </div>
        <Link
          href="/deals"
          className="flex items-center gap-1 text-xs font-semibold text-white/90 hover:text-white transition-colors"
        >
          See All <ArrowRight size={13} />
        </Link>
      </div>

      {/* Product strip */}
      <div className="bg-secondary-50 border-x border-b border-secondary-100">
        <div
          ref={scrollRef}
          className="flex gap-3 p-3 overflow-x-auto scrollbar-none"
        >
          {products.map((p) => (
            <FlashCard key={p.id} product={p} />
          ))}
          {/* See all card */}
          <Link
            href="/deals"
            className="shrink-0 w-40 sm:w-44 bg-white rounded-xl border border-gray-100 flex flex-col items-center justify-center gap-2 text-secondary-600 hover:bg-secondary-50 transition-colors aspect-square"
          >
            <ArrowRight size={28} className="text-secondary-400" />
            <span className="text-xs font-semibold">See all deals</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
