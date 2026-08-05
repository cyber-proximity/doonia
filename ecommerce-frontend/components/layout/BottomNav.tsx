"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutGrid, ShoppingCart, Heart, User } from "lucide-react";
import { useCartStore, selectItemCount } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";

const tabs = [
  { label: "Home",       href: "/",        icon: Home },
  { label: "Categories", href: "/products", icon: LayoutGrid },
  { label: "Cart",       href: "/cart",     icon: ShoppingCart, showBadge: true },
  { label: "Wishlist",   href: "/wishlist", icon: Heart },
  { label: "Account",   href: "/account",  icon: User, authHref: "/login" },
];

export default function BottomNav() {
  const pathname  = usePathname();
  const itemCount = useCartStore(selectItemCount);
  const { isAuthenticated } = useAuthStore();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-[0_-2px_8px_rgba(0,0,0,0.08)]">
      <div className="flex h-16">
        {tabs.map(({ label, href, icon: Icon, showBadge, authHref }) => {
          const dest   = authHref && !isAuthenticated ? authHref : href;
          const active = pathname === dest || (dest !== "/" && pathname.startsWith(dest));
          const badge  = showBadge ? itemCount : 0;

          return (
            <Link
              key={label}
              href={dest}
              className={`flex-1 flex flex-col items-center justify-center gap-1 transition-colors ${
                active ? "text-primary-600" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <div className="relative">
                <Icon size={21} strokeWidth={active ? 2.2 : 1.8} />
                {badge > 0 && (
                  <span className="absolute -top-2 -right-2.5 min-w-4 h-4 px-0.5 text-[9px] font-bold text-white bg-primary-500 rounded-full flex items-center justify-center leading-none">
                    {badge > 99 ? "99+" : badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] leading-none font-medium ${active ? "text-primary-600" : ""}`}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
