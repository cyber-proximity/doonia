"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { User, Package, MapPin, LogOut } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/account",           label: "My Profile",  icon: User    },
  { href: "/account/orders",    label: "My Orders",   icon: Package },
  { href: "/account/addresses", label: "Addresses",   icon: MapPin  },
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuthStore();
  const { logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login?redirect=/account");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {/* User info */}
              <div className="p-5 bg-linear-to-br from-primary-500 to-secondary-600 text-white">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-lg font-bold mb-3">
                  {user?.name?.[0]?.toUpperCase() ?? "U"}
                </div>
                <p className="font-semibold text-sm truncate">{user?.name}</p>
                <p className="text-xs text-white/70 truncate">{user?.email}</p>
              </div>

              {/* Nav */}
              <nav className="p-2">
                {navItems.map(({ href, label, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors",
                      pathname === href
                        ? "bg-primary-50 text-primary-600"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    )}
                  >
                    <Icon size={16} />
                    {label}
                  </Link>
                ))}
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors mt-1"
                >
                  <LogOut size={16} />
                  Sign Out
                </button>
              </nav>
            </div>
          </aside>

          {/* Main content */}
          <main className="lg:col-span-3">{children}</main>
        </div>
      </div>
    </div>
  );
}
