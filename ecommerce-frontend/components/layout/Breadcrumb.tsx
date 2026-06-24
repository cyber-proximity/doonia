"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Home, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";

interface Crumb { label: string; href?: string; }

function formatLabel(seg: string) {
  return seg.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

const ROUTE_LABELS: Record<string, string> = {
  products: "All Products",
  cart:     "Cart",
  account:  "Account",
  orders:   "My Orders",
  login:    "Login",
  register: "Register",
  deals:    "Deals",
  checkout: "Checkout",
  wishlist: "Wishlist",
  settings: "Settings",
};

export default function Breadcrumb() {
  const pathname     = usePathname();
  const searchParams = useSearchParams();
  const [catName, setCatName] = useState("");

  const category = searchParams.get("category") ?? "";

  useEffect(() => {
    if (!category) { setCatName(""); return; }
    fetch("/api/categories")
      .then((r) => r.json())
      .then((list: { slug: string; name: string }[]) => {
        const match = list.find((c) => c.slug === category);
        setCatName(match?.name ?? formatLabel(category));
      })
      .catch(() => setCatName(formatLabel(category)));
  }, [category]);

  // Hide on homepage
  if (pathname === "/") return null;

  const segments = pathname.split("/").filter(Boolean);
  const crumbs: Crumb[] = [{ label: "Home", href: "/" }];

  let built = "";
  for (let i = 0; i < segments.length; i++) {
    const seg    = segments[i];
    built       += `/${seg}`;
    const isLast = i === segments.length - 1;
    const label  = ROUTE_LABELS[seg] ?? formatLabel(seg);
    crumbs.push({ label, href: isLast ? undefined : built });
  }

  // On /products with category filter: make "All Products" clickable and add category as last crumb
  if (pathname === "/products" && category) {
    const last   = crumbs[crumbs.length - 1];
    last.href    = "/products";
    last.label   = "All Products";
    crumbs.push({ label: catName || formatLabel(category) });
  }

  return (
    <div className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-2.5">
        <nav className="flex items-center gap-1 text-sm text-gray-500 flex-wrap">
          {crumbs.map((crumb, i) => (
            <span key={i} className="flex items-center gap-1">
              {i > 0 && <ChevronRight size={12} className="text-gray-300 shrink-0" />}
              {crumb.href ? (
                <Link
                  href={crumb.href}
                  className="flex items-center gap-1 hover:text-primary-600 transition-colors"
                >
                  {i === 0 && <Home size={13} className="text-primary-500" />}
                  <span className={i === 0 ? "text-primary-500" : ""}>{crumb.label}</span>
                </Link>
              ) : (
                <span className="text-gray-800 font-semibold">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>
      </div>
    </div>
  );
}
