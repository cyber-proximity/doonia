"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import ProductCard from "@/components/products/ProductCard";
import { Product, Category } from "@/types";
import { toProductFromRaw } from "@/lib/services/products";

function SectionSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
        <div className="h-3 w-16 bg-gray-100 rounded animate-pulse" />
      </div>
      <div className="p-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-gray-50 rounded-lg overflow-hidden border border-gray-100 animate-pulse">
            <div className="aspect-square bg-gray-200" />
            <div className="p-2 space-y-1.5">
              <div className="h-2.5 bg-gray-200 rounded w-4/5" />
              <div className="h-3 bg-gray-200 rounded w-2/5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface CategorySectionProps {
  category: Category;
}

function CategorySection({ category }: CategorySectionProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    fetch(`/api/products?category=${category.slug}&sort=newest`)
      .then((r) => r.json())
      .then((json) => {
        const raw = Array.isArray(json?.data) ? json.data : [];
        setProducts(raw.slice(0, 6).map(toProductFromRaw));
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [category.slug]);

  if (!loading && products.length === 0) return null;

  return (
    <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Section header */}
      <div className="flex items-center justify-between px-4 py-3 border-b-2 border-primary-500">
        <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
          {category.name}
        </h2>
        <Link
          href={`/products?category=${category.slug}`}
          className="flex items-center gap-0.5 text-xs font-semibold text-primary-600 hover:text-primary-700 transition-colors"
        >
          See All <ChevronRight size={13} />
        </Link>
      </div>

      {/* Products grid */}
      <div className="p-3">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-gray-50 rounded-lg overflow-hidden border border-gray-100 animate-pulse">
                <div className="aspect-square bg-gray-200" />
                <div className="p-2 space-y-1.5">
                  <div className="h-2.5 bg-gray-200 rounded w-4/5" />
                  <div className="h-3 bg-gray-200 rounded w-2/5" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

interface Props {
  categories: Category[];
}

export default function ProductsByCategoryView({ categories }: Props) {
  if (categories.length === 0) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((n) => <SectionSkeleton key={n} />)}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {categories.map((cat) => (
        <CategorySection key={cat.slug} category={cat} />
      ))}
    </div>
  );
}
