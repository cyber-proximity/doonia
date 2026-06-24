"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Tag, SlidersHorizontal, X, ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "@/components/products/ProductCard";
import { getProducts, getCategories } from "@/lib/services/products";
import { Product, Category } from "@/types";
import { cn } from "@/lib/utils";

const sortOptions = [
  { label: "Best Discount", value: "discount" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Newest", value: "newest" },
];

function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 animate-pulse">
      <div className="aspect-square bg-gray-200" />
      <div className="p-4 space-y-2">
        <div className="h-3 bg-gray-200 rounded w-1/3" />
        <div className="h-4 bg-gray-200 rounded w-4/5" />
        <div className="h-4 bg-gray-200 rounded w-2/3" />
        <div className="flex justify-between items-center pt-1">
          <div className="h-5 bg-gray-200 rounded w-1/4" />
          <div className="h-8 bg-gray-200 rounded-xl w-16" />
        </div>
      </div>
    </div>
  );
}

export default function DealsPage() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sort, setSort] = useState("discount");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [page, setPage] = useState(1);

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [meta, setMeta] = useState({ total: 0, currentPage: 1, lastPage: 1, perPage: 20 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const hasFilters = !!(selectedCategory || minPrice || maxPrice);

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const result = await getProducts({
        onSale: true,
        category: selectedCategory,
        minPrice,
        maxPrice,
        sort,
        page,
      });
      setProducts(result.products);
      setMeta(result.meta);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, minPrice, maxPrice, sort, page]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    setPage(1);
  }, [selectedCategory, minPrice, maxPrice, sort]);

  function clearFilters() {
    setSelectedCategory("");
    setMinPrice("");
    setMaxPrice("");
    setPage(1);
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero banner */}
      <div className="bg-linear-to-r from-red-500 via-orange-500 to-yellow-400 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
              <Tag size={28} />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Today&apos;s Deals</h1>
              <p className="text-white/80 mt-1 text-sm">
                {loading
                  ? "Finding the best prices…"
                  : `${meta.total} discounted product${meta.total !== 1 ? "s" : ""} — limited time offers`}
              </p>
            </div>
          </div>
          <div className="shrink-0 bg-white/20 border border-white/30 rounded-2xl px-5 py-3 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-white/70">Save up to</p>
            <p className="text-3xl font-extrabold">80%</p>
            <p className="text-xs text-white/70">on selected items</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controls bar */}
        <div className="flex gap-3 mb-4">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="py-2.5 px-3 text-sm text-gray-800 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300"
          >
            {sortOptions.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>

          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl border transition-colors",
              filtersOpen || hasFilters
                ? "bg-primary-500 text-white border-primary-500"
                : "bg-white text-gray-600 border-gray-200 hover:border-primary-300"
            )}
          >
            <SlidersHorizontal size={16} />
            <span>Filters</span>
            {hasFilters && (
              <span className="bg-white text-primary-600 text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center">!</span>
            )}
          </button>
        </div>

        {/* Category pills */}
        {categories.length > 0 && (
          <div className="flex gap-2 mb-6 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => { setSelectedCategory(""); setPage(1); }}
              className={cn(
                "shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition-colors",
                !selectedCategory
                  ? "bg-primary-500 text-white border-primary-500"
                  : "bg-white text-gray-600 border-gray-200 hover:border-primary-300 hover:text-primary-600"
              )}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => { setSelectedCategory(cat.slug); setPage(1); }}
                className={cn(
                  "shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition-colors",
                  selectedCategory === cat.slug
                    ? "bg-primary-500 text-white border-primary-500"
                    : "bg-white text-gray-600 border-gray-200 hover:border-primary-300 hover:text-primary-600"
                )}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}

        <div className="flex gap-6">
          {/* Filters sidebar */}
          {filtersOpen && (
            <aside className="w-56 shrink-0">
              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-800 text-sm">Filters</h3>
                  {hasFilters && (
                    <button
                      onClick={clearFilters}
                      className="text-xs text-primary-500 hover:text-primary-700 flex items-center gap-1"
                    >
                      <X size={12} /> Clear all
                    </button>
                  )}
                </div>

                {/* Category */}
                <div className="mb-5">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Category</p>
                  <div className="space-y-1">
                    <button
                      onClick={() => { setSelectedCategory(""); setPage(1); }}
                      className={cn(
                        "w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors",
                        !selectedCategory ? "bg-primary-50 text-primary-600 font-medium" : "text-gray-600 hover:bg-gray-50"
                      )}
                    >
                      All Categories
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat.slug}
                        onClick={() => { setSelectedCategory(cat.slug); setPage(1); }}
                        className={cn(
                          "w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors",
                          selectedCategory === cat.slug ? "bg-primary-50 text-primary-600 font-medium" : "text-gray-600 hover:bg-gray-50"
                        )}
                      >
                        {cat.name}
                        <span className="float-right text-xs text-gray-400">{cat.productCount}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price */}
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Price (GH₵)</p>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="w-full px-2 py-1.5 text-xs text-gray-800 placeholder:text-gray-400 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-300"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="w-full px-2 py-1.5 text-xs text-gray-800 placeholder:text-gray-400 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-300"
                    />
                  </div>
                </div>
              </div>
            </aside>
          )}

          {/* Product grid */}
          <div className="flex-1">
            {error ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <p className="text-gray-600 font-medium">Failed to load deals</p>
                <button
                  onClick={fetchProducts}
                  className="mt-3 text-sm text-primary-500 hover:text-primary-700 font-medium"
                >
                  Try again
                </button>
              </div>
            ) : loading ? (
              <div className={cn(
                "grid gap-4",
                filtersOpen ? "grid-cols-2 md:grid-cols-3" : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4"
              )}>
                {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
              </div>
            ) : products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                  <Tag size={24} className="text-orange-400" />
                </div>
                <p className="text-gray-700 font-semibold">No deals found</p>
                <p className="text-gray-400 text-sm mt-1">
                  {hasFilters ? "Try adjusting your filters" : "Check back soon — new deals are added regularly"}
                </p>
                {hasFilters && (
                  <button
                    onClick={clearFilters}
                    className="mt-4 text-sm text-primary-500 hover:text-primary-700 font-medium"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className={cn(
                  "grid gap-4",
                  filtersOpen ? "grid-cols-2 md:grid-cols-3" : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4"
                )}>
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {meta.lastPage > 1 && (
                  <div className="flex items-center justify-center gap-3 mt-10">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-white border border-gray-200 rounded-xl hover:border-primary-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft size={16} /> Prev
                    </button>
                    <span className="text-sm text-gray-600">
                      Page {meta.currentPage} of {meta.lastPage}
                    </span>
                    <button
                      onClick={() => setPage((p) => Math.min(meta.lastPage, p + 1))}
                      disabled={page === meta.lastPage}
                      className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-white border border-gray-200 rounded-xl hover:border-primary-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      Next <ChevronRight size={16} />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
