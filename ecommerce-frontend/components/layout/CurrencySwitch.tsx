"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { useCurrency, Currency } from "@/lib/context/CurrencyContext";

const OPTIONS: { code: Currency; label: string; flag: string }[] = [
  { code: "USD", label: "USD", flag: "🇺🇸" },
  { code: "GHS", label: "GH₵", flag: "🇬🇭" },
  { code: "NGN", label: "NGN", flag: "🇳🇬" },
  { code: "CNY", label: "CNY", flag: "🇨🇳" },
];

const SYMBOLS: Record<Currency, string> = {
  USD: "$",
  GHS: "GH₵",
  NGN: "₦",
  CNY: "¥",
};

export default function CurrencySwitch() {
  const { currency, setCurrency } = useCurrency();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const current = OPTIONS.find((o) => o.code === currency) ?? OPTIONS[0];

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1 px-2 py-1 text-white/90 hover:text-white text-xs font-semibold transition-colors"
        aria-label="Switch currency"
      >
        <span>{current.flag}</span>
        <span className="hidden sm:inline">{SYMBOLS[currency]}</span>
        <ChevronDown size={12} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50">
          {OPTIONS.map((opt) => (
            <button
              key={opt.code}
              onClick={() => { setCurrency(opt.code); setOpen(false); }}
              className={`w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors hover:bg-primary-50 hover:text-primary-600 ${
                currency === opt.code ? "text-primary-600 font-semibold bg-primary-50" : "text-gray-700"
              }`}
            >
              <span>{opt.flag}</span>
              <span>{opt.label}</span>
              <span className="ml-auto text-xs text-gray-400">{SYMBOLS[opt.code]}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
