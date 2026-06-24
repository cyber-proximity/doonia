import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronRight, Truck, ShieldCheck, RefreshCw, HeadphonesIcon } from "lucide-react";
import ProductCard from "@/components/products/ProductCard";
import HeroBannerSlider from "@/components/home/HeroBannerSlider";
import FlashSaleSection from "@/components/home/FlashSaleSection";
import CategorySidebar from "@/components/home/CategorySidebar";
import { getFeaturedProducts, getCategories, getProducts } from "@/lib/services/products";

export const metadata: Metadata = {
  title: "Doonia — Ghana's Online Marketplace",
  description: "Shop quality electronics, fashion, home goods and more. Fast delivery across Ghana.",
  alternates: { canonical: "/" },
};

/* ─── tiny trust bar ──────────────────────────────────────────────────── */
const trust = [
  { icon: Truck,           label: "Free Delivery",  note: "Orders above GH₵200" },
  { icon: ShieldCheck,     label: "Secure Payment", note: "100% protected" },
  { icon: RefreshCw,       label: "Easy Returns",   note: "7-day policy" },
  { icon: HeadphonesIcon,  label: "24/7 Support",   note: "Always here" },
];

/* ─── small side banners ─────────────────────────────────────────────── */
function SmallBannerA() {
  return (
    <Link
      href="/register"
      className="flex-1 block rounded-lg overflow-hidden relative group"
      style={{ background: "linear-gradient(135deg,#005f69 0%,#00B5C8 100%)" }}
    >
      <div className="p-4 flex flex-col justify-between h-full min-h-[120px]">
        <div>
          <span className="text-[10px] font-bold text-white/70 uppercase tracking-widest">New user?</span>
          <p className="text-white font-extrabold text-base leading-tight mt-1">
            Get GH₵20 Off<br />Your First Order
          </p>
        </div>
        <span className="inline-flex items-center gap-1 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1.5 rounded-full w-fit mt-3 group-hover:bg-yellow-300 transition-colors">
          Sign Up <ArrowRight size={11} />
        </span>
      </div>
    </Link>
  );
}

function SmallBannerB() {
  return (
    <Link
      href="/deals"
      className="flex-1 block rounded-lg overflow-hidden relative group"
      style={{ background: "linear-gradient(135deg,#48296c 0%,#6B3FA0 100%)" }}
    >
      <div className="p-4 flex flex-col justify-between h-full min-h-[120px]">
        <div>
          <span className="text-[10px] font-bold text-white/70 uppercase tracking-widest">Flash Deals</span>
          <p className="text-white font-extrabold text-base leading-tight mt-1">
            Up to 80% Off<br />Selected Items
          </p>
        </div>
        <span className="inline-flex items-center gap-1 bg-white text-secondary-700 text-xs font-bold px-3 py-1.5 rounded-full w-fit mt-3 group-hover:bg-primary-50 transition-colors">
          Shop Deals <ArrowRight size={11} />
        </span>
      </div>
    </Link>
  );
}

/* ─── page ────────────────────────────────────────────────────────────── */
export default async function HomePage() {
  const [featured, categories, dealsResult] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
    getProducts({ onSale: true, sort: "discount" }),
  ]);

  const flashDeals = dealsResult.products.slice(0, 12);

  return (
    <div className="bg-[#f5f5f5] min-h-screen">

      {/* ── Trust bar ── */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100">
            {trust.map(({ icon: Icon, label, note }) => (
              <div key={label} className="flex items-center gap-2.5 px-3 py-2.5">
                <Icon size={18} className="text-primary-500 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-gray-800 leading-none">{label}</p>
                  <p className="text-[10px] text-gray-500 mt-0.5 leading-none">{note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 space-y-3">

        {/* ═══════════════════════════════════════════════════════════════
            SECTION 1 — Category sidebar + Hero slider + Small banners
        ═══════════════════════════════════════════════════════════════ */}
        <div className="flex gap-2 items-stretch">

          {/* Left — category sidebar (desktop only, client-fetched) */}
          <CategorySidebar />

          {/* Right — slider + small banners */}
          <div className="flex-1 min-w-0 flex gap-2">
            {/* Hero slider */}
            <HeroBannerSlider />

            {/* Small promo banners — stacked, desktop only */}
            <div className="hidden md:flex flex-col gap-2 w-[175px] shrink-0">
              <SmallBannerA />
              <SmallBannerB />
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            SECTION 2 — Flash Sale (countdown + horizontal products)
        ═══════════════════════════════════════════════════════════════ */}
        {flashDeals.length > 0 && <FlashSaleSection products={flashDeals} />}

        {/* ═══════════════════════════════════════════════════════════════
            SECTION 3 — Category circles
        ═══════════════════════════════════════════════════════════════ */}
        {categories.length > 0 && (
          <section className="bg-white rounded-lg border border-gray-200 shadow-sm">
            {/* section header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                Shop by Category
              </h2>
              <Link
                href="/products"
                className="text-xs text-primary-600 font-semibold hover:underline flex items-center gap-0.5"
              >
                See All <ChevronRight size={12} />
              </Link>
            </div>

            {/* circles */}
            <div className="flex overflow-x-auto gap-1 px-4 py-4 scrollbar-none">
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/products?category=${cat.slug}`}
                  className="flex flex-col items-center gap-2 group shrink-0 w-20"
                >
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-100 group-hover:border-primary-400 transition-all bg-primary-50 shadow-sm">
                    {cat.image ? (
                      <Image
                        src={cat.image}
                        alt={cat.name}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-2xl font-extrabold text-primary-300">
                          {cat.name[0]}
                        </span>
                      </div>
                    )}
                  </div>
                  <span className="text-[11px] font-medium text-gray-700 group-hover:text-primary-600 text-center leading-tight line-clamp-2">
                    {cat.name}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            SECTION 4 — Featured Products ("Top Picks For You")
        ═══════════════════════════════════════════════════════════════ */}
        {featured.length > 0 && (
          <section className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            {/* section header bar */}
            <div className="flex items-center justify-between px-4 py-3 border-b-2 border-primary-500">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                Top Picks For You
              </h2>
              <Link
                href="/products"
                className="text-xs text-primary-600 font-semibold hover:underline flex items-center gap-0.5"
              >
                See All <ChevronRight size={12} />
              </Link>
            </div>

            <div className="p-3">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
                {featured.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            SECTION 5 — Deals / Discounted Products
        ═══════════════════════════════════════════════════════════════ */}
        {dealsResult.products.length > 0 && (
          <section className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b-2 border-secondary-500">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                Best Deals Right Now
              </h2>
              <Link
                href="/deals"
                className="text-xs text-secondary-600 font-semibold hover:underline flex items-center gap-0.5"
              >
                See All <ChevronRight size={12} />
              </Link>
            </div>

            <div className="p-3">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
                {dealsResult.products.slice(0, 10).map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            SECTION 6 — App / Newsletter promo banner
        ═══════════════════════════════════════════════════════════════ */}
        <div
          className="rounded-lg overflow-hidden"
          style={{ background: "linear-gradient(135deg,#005f69 0%,#00B5C8 60%,#6B3FA0 100%)" }}
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-5 px-6 py-7">
            <div>
              <p className="text-white/70 text-xs font-semibold uppercase tracking-widest mb-1">
                Exclusive Offer
              </p>
              <h3 className="text-white font-extrabold text-xl md:text-2xl mb-1">
                Get GH₵20 Off Your First Order
              </h3>
              <p className="text-white/70 text-sm">
                Create an account and use code{" "}
                <strong className="text-yellow-300">WELCOME20</strong> at checkout.
              </p>
            </div>
            <div className="flex gap-3 shrink-0">
              <Link
                href="/register"
                className="bg-yellow-400 hover:bg-yellow-300 text-yellow-900 font-bold text-sm px-6 py-3 rounded-full transition-colors shadow-lg whitespace-nowrap"
              >
                Create Free Account
              </Link>
              <Link
                href="/products"
                className="bg-white/15 hover:bg-white/25 text-white font-semibold text-sm px-6 py-3 rounded-full transition-colors whitespace-nowrap border border-white/30"
              >
                Browse Shop
              </Link>
            </div>
          </div>
        </div>

      </div>

      {/* bottom spacer */}
      <div className="h-6" />
    </div>
  );
}
