"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, X, ArrowRight } from "lucide-react";

interface Suggestion {
  id: number;
  name: string;
  slug: string;
  price: number;
  image: string | null;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://ecommerce.test/api";

export default function SearchBar() {
  const [open, setOpen]               = useState(false);
  const [query, setQuery]             = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading]         = useState(false);
  const [focused, setFocused]         = useState(false);

  const inputRef    = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef    = useRef<ReturnType<typeof setTimeout> | null>(null);
  const router      = useRouter();

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Focus input when search bar opens
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      setSuggestions([]);
      setFocused(false);
    }
  }, [open]);

  const fetchSuggestions = useCallback(async (q: string) => {
    if (q.length < 2) {
      setSuggestions([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/v1/products/suggestions?q=${encodeURIComponent(q)}`, {
        cache: "no-store",
      });
      if (!res.ok) return;
      const { data } = await res.json();
      setSuggestions(data ?? []);
    } catch {
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounce fetch
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }
    timerRef.current = setTimeout(() => fetchSuggestions(query.trim()), 250);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [query, fetchSuggestions]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    setOpen(false);
    router.push(`/products?q=${encodeURIComponent(q)}`);
  }

  function handleSuggestionClick() {
    setOpen(false);
    setQuery("");
    setSuggestions([]);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") setOpen(false);
  }

  const showDropdown = focused && (suggestions.length > 0 || (query.length >= 2 && !loading));

  return (
    <div ref={containerRef} className="relative">
      {/* Toggle button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="p-2 rounded-full text-gray-500 hover:text-primary-500 hover:bg-primary-50 transition-colors"
          aria-label="Search"
        >
          <Search size={20} />
        </button>
      )}

      {/* Search input + dropdown */}
      {open && (
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-72 sm:w-80 z-50">
          <form onSubmit={handleSubmit}>
            <div className="relative">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setFocused(true)}
                onKeyDown={handleKeyDown}
                placeholder="Search products…"
                className="w-full pl-9 pr-8 py-2 text-sm bg-white border border-gray-200 rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label="Close search"
              >
                <X size={14} />
              </button>
            </div>
          </form>

          {/* Dropdown */}
          {showDropdown && (
            <div className="absolute left-0 right-0 mt-1.5 bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden">
              {suggestions.length === 0 && query.length >= 2 && !loading ? (
                <div className="px-4 py-3 text-sm text-gray-400 text-center">
                  No results for &ldquo;{query}&rdquo;
                </div>
              ) : (
                <>
                  <ul>
                    {suggestions.map((s) => (
                      <li key={s.id}>
                        <Link
                          href={`/products/${s.slug}`}
                          onClick={handleSuggestionClick}
                          className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 transition-colors"
                        >
                          <div className="w-9 h-9 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                            {s.image
                              ? <img src={s.image} alt={s.name} className="w-full h-full object-cover" />
                              : <div className="w-full h-full" />
                            }
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-800 truncate">{s.name}</p>
                            <p className="text-xs text-primary-600 font-semibold">
                              GH₵{s.price.toFixed(2)}
                            </p>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>

                  {query.trim() && (
                    <div className="border-t border-gray-100">
                      <Link
                        href={`/products?q=${encodeURIComponent(query.trim())}`}
                        onClick={handleSuggestionClick}
                        className="flex items-center justify-between px-4 py-2.5 text-sm font-semibold text-primary-600 hover:bg-primary-50 transition-colors"
                      >
                        <span>See all results for &ldquo;{query}&rdquo;</span>
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
