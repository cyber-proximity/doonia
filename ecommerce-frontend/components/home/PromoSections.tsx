"use client";

import Link from "next/link";
import { ArrowRight, Truck, ShieldCheck, RefreshCw, HeadphonesIcon } from "lucide-react";
import { useCurrency } from "@/lib/context/CurrencyContext";

const FREE_SHIPPING_THRESHOLD_GHS = 200;

export function TrustBar() {
  const { format } = useCurrency();

  const trust = [
    { icon: Truck,           label: "Free Delivery",  note: `Orders above ${format(FREE_SHIPPING_THRESHOLD_GHS)}` },
    { icon: ShieldCheck,     label: "Secure Payment", note: "100% protected" },
    { icon: RefreshCw,       label: "Easy Returns",   note: "7-day policy" },
    { icon: HeadphonesIcon,  label: "24/7 Support",   note: "Always here" },
  ];

  return (
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
  );
}

// The welcome discount is 20 GHS — converted to display currency
const DISCOUNT_GHS = 20;

export function SmallBannerA() {
  const { format } = useCurrency();

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
            Get {format(DISCOUNT_GHS)} Off<br />Your First Order
          </p>
        </div>
        <span className="inline-flex items-center gap-1 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1.5 rounded-full w-fit mt-3 group-hover:bg-yellow-300 transition-colors">
          Sign Up <ArrowRight size={11} />
        </span>
      </div>
    </Link>
  );
}

export function NewsletterBanner() {
  const { format } = useCurrency();

  return (
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
            Get {format(DISCOUNT_GHS)} Off Your First Order
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
  );
}
