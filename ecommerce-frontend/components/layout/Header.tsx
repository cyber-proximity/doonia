"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  ShoppingCart, User, Package, LogOut,
  Menu, X, ChevronRight, LayoutGrid,
} from "lucide-react";
import { useCartStore, selectItemCount } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import InlineSearchBar from "@/components/search/InlineSearchBar";


interface NavCategory { id: number; name: string; slug: string; }

export default function Header() {
  const [menuOpen, setMenuOpen]           = useState(false);
  const [dropdownOpen, setDropdownOpen]   = useState(false);
  const [catOpen, setCatOpen]             = useState(false);
  const [navCategories, setNavCategories] = useState<NavCategory[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const catRef      = useRef<HTMLDivElement>(null);

  const pathname  = usePathname();
  const isHome    = pathname === "/";

  const itemCount = useCartStore(selectItemCount);
  const { user, isAuthenticated } = useAuthStore();
  const { logout } = useAuth();

  // Fetch categories for hamburger dropdown
  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((list) => setNavCategories(Array.isArray(list) ? list : []))
      .catch(() => {});
  }, []);

  // Close categories dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (catRef.current && !catRef.current.contains(e.target as Node)) {
        setCatOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Close account dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);


  const firstName = user?.name?.split(" ")[0] ?? "Account";

  return (
    <header className="sticky top-0 z-50 shadow-md">
      {/* ── Primary bar ── teal background ── */}
      <div className="bg-primary-500">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-3 md:gap-4">

          {/* Categories hamburger — desktop, hidden on home page */}
          <div ref={catRef} className={`relative shrink-0 ${isHome ? "hidden" : "hidden md:block"}`}>
            <button
              onClick={() => setCatOpen((o) => !o)}
              className="flex items-center gap-1.5 px-2.5 py-2 text-white hover:bg-white/10 rounded-lg transition-colors"
              aria-label="All Categories"
            >
              <LayoutGrid size={20} />
            </button>

            {catOpen && (
              <div className="absolute left-0 top-full mt-1 z-50 w-60 bg-white shadow-2xl border border-gray-100 rounded-xl overflow-hidden">
                <div className="bg-secondary-500 px-4 py-2.5">
                  <p className="text-sm font-bold text-white">All Categories</p>
                </div>
                <Link
                  href="/products"
                  onClick={() => setCatOpen(false)}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-secondary-700 bg-secondary-50 hover:bg-secondary-100 border-b border-gray-100 transition-colors"
                >
                  <LayoutGrid size={13} /> All Products
                </Link>
                <ul className="max-h-72 overflow-y-auto py-1">
                  {navCategories.map((cat) => (
                    <li key={cat.id}>
                      <Link
                        href={`/products?category=${cat.slug}`}
                        onClick={() => setCatOpen(false)}
                        className="flex items-center justify-between px-4 py-2.5 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors group"
                      >
                        <span className="truncate">{cat.name}</span>
                        <ChevronRight size={12} className="text-gray-300 group-hover:text-primary-400 shrink-0" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Logo */}
          <Link href="/" className="shrink-0">
            <span className="text-2xl font-extrabold text-white tracking-tight">Doonia</span>
          </Link>

          {/* Inline search — takes all remaining space */}
          <InlineSearchBar />

          {/* Account */}
          {isAuthenticated ? (
            <div className="relative hidden sm:block shrink-0" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex flex-col items-center gap-0.5 px-2 py-1 text-white/90 hover:text-white transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-white/25 flex items-center justify-center text-xs font-bold text-white">
                  {firstName[0].toUpperCase()}
                </div>
                <span className="text-[10px] leading-none hidden lg:block font-medium">{firstName}</span>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100 mb-1">
                    <p className="text-sm font-semibold text-gray-800 truncate">{user?.name}</p>
                    <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                  </div>
                  <Link
                    href="/account"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                  >
                    <User size={15} /> My Profile
                  </Link>
                  <Link
                    href="/account/orders"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                  >
                    <Package size={15} /> My Orders
                  </Link>
                  <div className="border-t border-gray-100 mt-1 pt-1">
                    <button
                      onClick={() => { setDropdownOpen(false); logout(); }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={15} /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="hidden sm:flex flex-col items-center gap-0.5 px-2 py-1 text-white/90 hover:text-white transition-colors shrink-0"
            >
              <User size={22} />
              <span className="text-[10px] leading-none font-medium hidden lg:block">Sign In</span>
            </Link>
          )}

          {/* Cart */}
          <Link
            href="/cart"
            className="relative flex flex-col items-center gap-0.5 px-2 py-1 text-white/90 hover:text-white transition-colors shrink-0"
            aria-label="Cart"
          >
            <div className="relative">
              <ShoppingCart size={22} />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 min-w-4.5 h-4.5 px-1 text-[10px] font-bold text-primary-700 bg-yellow-400 rounded-full flex items-center justify-center leading-none">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </div>
            <span className="text-[10px] leading-none font-medium hidden lg:block">Cart</span>
          </Link>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors shrink-0"
            aria-label="Menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>


      {/* ── Mobile slide-down menu ── */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="px-4 py-3 space-y-1">
            {[
              { label: "Home",         href: "/" },
              { label: "Shop",         href: "/products" },
              { label: "Deals",        href: "/deals" },
              { label: "New Arrivals", href: "/products?sort=newest" },
            ].map((l) => (
              <Link
                key={l.label}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="block py-2.5 px-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors"
              >
                {l.label}
              </Link>
            ))}

            <div className="border-t border-gray-100 pt-2 mt-2">
              {isAuthenticated ? (
                <>
                  <Link href="/account" onClick={() => setMenuOpen(false)}
                    className="block py-2.5 px-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-primary-50 hover:text-primary-600">
                    My Profile
                  </Link>
                  <Link href="/account/orders" onClick={() => setMenuOpen(false)}
                    className="block py-2.5 px-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-primary-50 hover:text-primary-600">
                    My Orders
                  </Link>
                  <button
                    onClick={() => { setMenuOpen(false); logout(); }}
                    className="w-full text-left py-2.5 px-3 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link href="/login" onClick={() => setMenuOpen(false)}
                  className="block py-2.5 px-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-primary-50 hover:text-primary-600">
                  Login / Register
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
