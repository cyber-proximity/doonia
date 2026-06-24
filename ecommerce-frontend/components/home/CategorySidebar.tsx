"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight, ArrowRight } from "lucide-react";

interface Cat { id: number; name: string; slug: string; }

export default function CategorySidebar() {
  const [categories, setCategories] = useState<Cat[]>([]);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((list) => setCategories(Array.isArray(list) ? list : []))
      .catch(() => {});
  }, []);

  return (
    <aside className="hidden lg:flex flex-col w-[220px] shrink-0 bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm self-stretch">
      {/* header */}
      <div className="bg-secondary-500 px-4 py-2.5">
        <p className="text-sm font-bold text-white">All Categories</p>
      </div>

      {/* list */}
      <ul className="flex-1 py-1 overflow-y-auto">
        {categories.length > 0 ? (
          categories.map((cat) => (
            <li key={cat.id}>
              <Link
                href={`/products?category=${cat.slug}`}
                className="flex items-center justify-between px-4 py-2 text-[13px] text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors group"
              >
                <span className="truncate">{cat.name}</span>
                <ChevronRight size={12} className="text-gray-300 group-hover:text-primary-400 shrink-0" />
              </Link>
            </li>
          ))
        ) : (
          /* skeleton while loading */
          [1, 2, 3, 4, 5].map((n) => (
            <li key={n} className="px-4 py-2.5">
              <div className="h-3 bg-gray-100 rounded animate-pulse w-3/4" />
            </li>
          ))
        )}
      </ul>

      <div className="border-t border-gray-100">
        <Link
          href="/products"
          className="flex items-center justify-between px-4 py-2.5 text-[13px] font-semibold text-primary-600 hover:bg-primary-50 transition-colors"
        >
          Browse All <ArrowRight size={13} />
        </Link>
      </div>
    </aside>
  );
}
