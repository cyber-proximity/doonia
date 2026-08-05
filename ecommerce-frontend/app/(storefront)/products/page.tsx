"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal, X, ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "@/components/products/ProductCard";
import ProductsByCategoryView from "@/components/products/ProductsByCategoryView";
import { toProductFromRaw } from "@/lib/services/products";
import { Product, Category } from "@/types"; // Category still used for useState type
import { cn } from "@/lib/utils";

const sortOptions = [
  { label: "Newest First",      value: "newest" },
  { label: "Price: Low → High", value: "price_asc" },
  { label: "Price: High → Low", value: "price_desc" },
  { label: "Best Discount",     value: "discount" },
];

function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-lg overflow-hidden border border-gray-200 animate-pulse">
      <div className="aspect-square bg-gray-200" />
      <div className="p-3 space-y-2">
        <div className="h-3 bg-gray-200 rounded w-4/5" />
        <div className="h-3 bg-gray-200 rounded w-3/5" />
        <div className="flex justify-between items-center pt-1">
          <div className="h-4 bg-gray-200 rounded w-1/3" />
          <div className="h-6 bg-gray-200 rounded w-12" />
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  const searchParams = useSearchParams();

  const initialSearch = searchParams.get("q") ?? "";
  const [search,           setSearch]           = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") ?? "");
  const [sort,             setSort]             = useState(searchParams.get("sort") ?? "newest");
  const [minPrice,         setMinPrice]         = useState("");
  const [maxPrice,         setMaxPrice]         = useState("");
  const [filtersOpen,      setFiltersOpen]      = useState(false);
  const [page,             setPage]             = useState(1);

  // Sync state when URL search params change (e.g. clicking a category link from the header dropdown)
  useEffect(() => {
    setSelectedCategory(searchParams.get("category") ?? "");
    setSort(searchParams.get("sort") ?? "newest");
    setSearch(searchParams.get("q") ?? "");
    setPage(1);
  }, [searchParams]);

  const [products,   setProducts]   = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [meta,       setMeta]       = useState({ total: 0, currentPage: 1, lastPage: 1, perPage: 20 });
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(false);

  const searchTimer           = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);

  // Fetch categories via proxy (avoids CORS issues with direct backend calls)
  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((list) => {
        if (!Array.isArray(list)) return;
        setCategories(list.map((c: { id: number; name: string; slug: string; image?: string | null; product_count?: number }) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          image: c.image ?? "",
          productCount: c.product_count ?? 0,
        })));
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => { setDebouncedSearch(search); setPage(1); }, 400);
    return () => { if (searchTimer.current) clearTimeout(searchTimer.current); };
  }, [search]);

  const fetchProducts = useCallback(async () => {
    setLoading(true); setError(false);
    try {
      const q = new URLSearchParams();
      if (debouncedSearch) q.set("search", debouncedSearch);
      if (selectedCategory) q.set("category", selectedCategory);
      if (minPrice) q.set("min_price", minPrice);
      if (maxPrice) q.set("max_price", maxPrice);
      if (sort) q.set("sort", sort);
      if (page > 1) q.set("page", String(page));

      const res  = await fetch(`/api/products?${q}`);
      const json = await res.json();
      const raw  = Array.isArray(json?.data) ? json.data : [];
      const m    = json?.meta ?? {};
      setProducts(raw.map(toProductFromRaw));
      setMeta({
        total: m.total ?? 0,
        currentPage: m.current_page ?? 1,
        lastPage: m.last_page ?? 1,
        perPage: m.per_page ?? 20,
      });
    } catch { setError(true); }
    finally  { setLoading(false); }
  }, [debouncedSearch, selectedCategory, minPrice, maxPrice, sort, page]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);
  useEffect(() => { setPage(1); }, [selectedCategory, minPrice, maxPrice, sort]);

  const hasFilters = !!(selectedCategory || minPrice || maxPrice);
  function clearFilters() { setSelectedCategory(""); setMinPrice(""); setMaxPrice(""); setPage(1); }

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-4">


        {/* Category pills */}
        {categories.length > 0 && (
          <div className="flex gap-2 mb-4 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => { setSelectedCategory(""); setPage(1); }}
              className={cn(
                "shrink-0 px-4 py-1.5 rounded-full text-sm font-medium border transition-colors",
                !selectedCategory
                  ? "bg-primary-500 text-white border-primary-500"
                  : "bg-white text-gray-600 border-gray-300 hover:border-primary-400 hover:text-primary-600"
              )}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => { setSelectedCategory(cat.slug); setPage(1); }}
                className={cn(
                  "shrink-0 px-4 py-1.5 rounded-full text-sm font-medium border transition-colors",
                  selectedCategory === cat.slug
                    ? "bg-primary-500 text-white border-primary-500"
                    : "bg-white text-gray-600 border-gray-300 hover:border-primary-400 hover:text-primary-600"
                )}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}

        {/* ── No filter active: show products grouped by category ── */}
        {!selectedCategory && !debouncedSearch && !minPrice && !maxPrice ? (
          <ProductsByCategoryView categories={categories} />
        ) : (

        <div className="flex gap-4">
          {/* Sidebar */}
          {filtersOpen && (
            <aside className="w-52 shrink-0">
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden sticky top-28">
                <div className="bg-secondary-500 px-4 py-2.5 flex items-center justify-between">
                  <h3 className="font-bold text-white text-sm">Filters</h3>
                  {hasFilters && (
                    <button onClick={clearFilters} className="text-[10px] text-white/80 hover:text-white flex items-center gap-0.5">
                      <X size={11} /> Clear
                    </button>
                  )}
                </div>

                {/* Category */}
                <div className="p-3 border-b border-gray-100">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Category</p>
                  <div className="space-y-0.5 max-h-52 overflow-y-auto scrollbar-none">
                    <button
                      onClick={() => { setSelectedCategory(""); setPage(1); }}
                      className={cn("w-full text-left px-2.5 py-1.5 rounded-lg text-sm transition-colors",
                        !selectedCategory ? "bg-primary-50 text-primary-700 font-semibold" : "text-gray-600 hover:bg-gray-50")}
                    >
                      All Categories
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat.slug}
                        onClick={() => { setSelectedCategory(cat.slug); setPage(1); }}
                        className={cn("w-full text-left px-2.5 py-1.5 rounded-lg text-sm transition-colors flex items-center justify-between",
                          selectedCategory === cat.slug ? "bg-primary-50 text-primary-700 font-semibold" : "text-gray-600 hover:bg-gray-50")}
                      >
                        <span className="truncate">{cat.name}</span>
                        <span className="text-[10px] text-gray-400 shrink-0">{cat.productCount}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price */}
                <div className="p-3">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Price Range (GH₵)</p>
                  <div className="flex gap-2">
                    <input
                      type="number" placeholder="Min" value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="w-full px-2 py-1.5 text-xs text-gray-800 placeholder:text-gray-400 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-300"
                    />
                    <input
                      type="number" placeholder="Max" value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="w-full px-2 py-1.5 text-xs text-gray-800 placeholder:text-gray-400 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-300"
                    />
                  </div>
                </div>
              </div>
            </aside>
          )}

          {/* Product grid */}
          <div className="flex-1 min-w-0">
            {error ? (
              <div className="bg-white rounded-xl border border-gray-200 flex flex-col items-center justify-center py-20 text-center">
                <p className="text-gray-600 font-medium">Failed to load products</p>
                <button onClick={fetchProducts} className="mt-3 text-sm text-primary-500 hover:text-primary-700 font-medium">Try again</button>
              </div>
            ) : loading ? (
              <div className={cn("grid gap-3", filtersOpen ? "grid-cols-2 md:grid-cols-3" : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5")}>
                {Array.from({ length: 10 }).map((_, i) => <ProductCardSkeleton key={i} />)}
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <SlidersHorizontal size={24} className="text-gray-400" />
                </div>
                <p className="text-gray-700 font-semibold">No products found</p>
                <p className="text-gray-400 text-sm mt-1">Try adjusting your filters or search</p>
                {hasFilters && (
                  <button onClick={clearFilters} className="mt-4 text-sm text-primary-500 hover:text-primary-700 font-medium">Clear filters</button>
                )}
              </div>
            ) : (
              <>
                <div className={cn("grid gap-3", filtersOpen ? "grid-cols-2 md:grid-cols-3" : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5")}>
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {meta.lastPage > 1 && (
                  <div className="flex items-center justify-center gap-3 mt-8">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-white border border-gray-200 rounded-lg hover:border-primary-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft size={16} /> Prev
                    </button>
                    <span className="text-sm text-gray-600 font-medium">
                      Page {meta.currentPage} of {meta.lastPage}
                    </span>
                    <button
                      onClick={() => setPage((p) => Math.min(meta.lastPage, p + 1))}
                      disabled={page === meta.lastPage}
                      className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-white border border-gray-200 rounded-lg hover:border-primary-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      Next <ChevronRight size={16} />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        )} {/* end filtered view */}
      </div>
    </div>
  );
}
