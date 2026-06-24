"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, LayoutGrid } from "lucide-react";
import Link from "next/link";

interface ProductSuggestion {
  id: number;
  name: string;
  slug: string;
  price: number;
  image: string | null;
}

interface CategorySuggestion {
  id: number;
  name: string;
  slug: string;
}

interface SuggestionsData {
  products: ProductSuggestion[];
  categories: CategorySuggestion[];
}

interface RawCategory {
  slug: string;
  name: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://ecommerce.test/api";

const EMPTY: SuggestionsData = { products: [], categories: [] };

export default function InlineSearchBar() {
  const [query, setQuery]               = useState("");
  const [data, setData]                 = useState<SuggestionsData>(EMPTY);
  const [loading, setLoading]           = useState(false);
  const [focused, setFocused]           = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories]     = useState<RawCategory[]>([]);

  const inputRef     = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef     = useRef<ReturnType<typeof setTimeout> | null>(null);
  const router       = useRouter();

  useEffect(() => {
    fetch(`${API_BASE}/v1/categories`)
      .then((r) => r.json())
      .then(({ data: d }) =>
        setCategories((Array.isArray(d) ? d : []).map((c: RawCategory) => ({ slug: c.slug, name: c.name })))
      )
      .catch(() => {});
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const fetchSuggestions = useCallback(async (q: string) => {
    if (q.length < 2) { setData(EMPTY); return; }
    setLoading(true);
    try {
      const res = await fetch(
        `${API_BASE}/v1/products/suggestions?q=${encodeURIComponent(q)}`,
        { cache: "no-store" }
      );
      if (!res.ok) { setData(EMPTY); return; }
      const json = await res.json();
      const raw = json.data ?? {};
      setData({
        products:   Array.isArray(raw.products)   ? raw.products   : [],
        categories: Array.isArray(raw.categories) ? raw.categories : [],
      });
    } catch {
      setData(EMPTY);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (!query.trim()) { setData(EMPTY); return; }
    timerRef.current = setTimeout(() => fetchSuggestions(query.trim()), 250);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [query, fetchSuggestions]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    setFocused(false);
    const params = new URLSearchParams({ q });
    if (selectedCategory) params.set("category", selectedCategory);
    router.push(`/products?${params}`);
  }

  function closeDropdown() {
    setFocused(false);
    setQuery("");
    setData(EMPTY);
  }

  const showDropdown = focused && query.length >= 2;
  const hasResults = data.products.length > 0 || data.categories.length > 0;

  return (
    <div ref={containerRef} className="relative flex-1 min-w-0">
      <form onSubmit={handleSubmit} className="flex h-10 bg-white rounded-md overflow-hidden shadow-sm">
        {categories.length > 0 && (
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="hidden lg:block border-r border-gray-200 pl-3 pr-2 text-xs bg-white text-gray-700 focus:outline-none shrink-0 w-32 cursor-pointer"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>{c.name}</option>
            ))}
          </select>
        )}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          placeholder="Search products, brands and categories"
          className="flex-1 min-w-0 px-4 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none bg-white"
        />
        <button
          type="submit"
          className="shrink-0 bg-secondary-500 hover:bg-secondary-600 text-white px-5 flex items-center justify-center transition-colors"
          aria-label="Search"
        >
          <Search size={18} />
        </button>
      </form>

      {showDropdown && (
        <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-100 rounded-xl shadow-2xl overflow-hidden z-[200]">
          {loading ? (
            <div className="px-4 py-3 text-sm text-gray-400 text-center">Searching…</div>
          ) : !hasResults ? (
            <div className="px-4 py-3 text-sm text-gray-400 text-center">
              No results for &ldquo;{query}&rdquo;
            </div>
          ) : (
            <>
              {/* Categories section */}
              {data.categories.length > 0 && (
                <div>
                  <p className="px-3 pt-2.5 pb-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    Categories
                  </p>
                  <ul>
                    {data.categories.map((c) => (
                      <li key={c.id}>
                        <Link
                          href={`/products?category=${c.slug}`}
                          onClick={closeDropdown}
                          className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 transition-colors"
                        >
                          <div className="w-7 h-7 rounded-md bg-primary-50 flex items-center justify-center shrink-0">
                            <LayoutGrid size={14} className="text-primary-500" />
                          </div>
                          <span className="text-sm font-medium text-gray-800">{c.name}</span>
                          <span className="ml-auto text-xs text-gray-400">Browse</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Products section */}
              {data.products.length > 0 && (
                <div className={data.categories.length > 0 ? "border-t border-gray-100" : ""}>
                  {(data.categories.length > 0 || true) && (
                    <p className="px-3 pt-2.5 pb-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                      Products
                    </p>
                  )}
                  <ul>
                    {data.products.map((s) => (
                      <li key={s.id}>
                        <Link
                          href={`/products/${s.slug}`}
                          onClick={closeDropdown}
                          className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 transition-colors"
                        >
                          <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                            {s.image && (
                              <img src={s.image} alt={s.name} className="w-full h-full object-cover" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-800 truncate">{s.name}</p>
                            <p className="text-xs text-primary-600 font-semibold">GH₵{s.price.toFixed(2)}</p>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* See all results */}
              <div className="border-t border-gray-100">
                <Link
                  href={`/products?q=${encodeURIComponent(query.trim())}`}
                  onClick={closeDropdown}
                  className="flex items-center justify-between px-4 py-2.5 text-sm font-semibold text-primary-600 hover:bg-primary-50 transition-colors"
                >
                  <span>See all results for &ldquo;{query}&rdquo;</span>
                  <Search size={14} />
                </Link>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
