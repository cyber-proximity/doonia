"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { useAuthStore } from "@/store/authStore";

export type Currency = "USD" | "GHS" | "NGN" | "CNY";

// Currency used when charging via Paystack (CNY displays ¥ but pays in USD)
export type PaymentCurrency = "USD" | "GHS" | "NGN";

interface Rates {
  ghs_to_usd: number;
  ghs_to_ngn: number;
  ghs_to_cny: number;
}

interface CurrencyContextValue {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  format: (ghsAmount: number) => string;
  paymentCurrency: PaymentCurrency;
  paymentAmount: (ghsAmount: number) => number;
  rates: Rates | null;
}

const SYMBOLS: Record<Currency, string> = {
  USD: "$",
  GHS: "GH₵",
  NGN: "₦",
  CNY: "¥",
};

const COUNTRY_CURRENCY: Record<string, Currency> = {
  Ghana: "GHS",
  Nigeria: "NGN",
  China: "CNY",
};

const PAYMENT_CURRENCY: Record<Currency, PaymentCurrency> = {
  GHS: "GHS",
  NGN: "NGN",
  CNY: "USD", // Paystack doesn't support CNY — charge USD
  USD: "USD",
};

const DEFAULT_RATES: Rates = {
  ghs_to_usd: 0.063,
  ghs_to_ngn: 15.38,
  ghs_to_cny: 0.45,
};

const STORAGE_KEY = "doonia_currency";

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

function convertGhs(amount: number, currency: Currency, rates: Rates): number {
  switch (currency) {
    case "USD": return amount * rates.ghs_to_usd;
    case "NGN": return amount * rates.ghs_to_ngn;
    case "CNY": return amount * rates.ghs_to_cny;
    case "GHS": return amount;
  }
}

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated } = useAuthStore();
  const [currency, setCurrencyState] = useState<Currency>("USD");
  const [rates, setRates] = useState<Rates>(DEFAULT_RATES);

  // Fetch live rates from backend (via Next.js proxy)
  useEffect(() => {
    fetch("/api/currencies")
      .then((r) => r.json())
      .then((data) => {
        if (data?.ghs_to_usd) setRates(data as Rates);
      })
      .catch(() => {});
  }, []);

  // On mount: restore from localStorage OR derive from user's country
  useEffect(() => {
    if (isAuthenticated && user?.country) {
      const mapped = COUNTRY_CURRENCY[user.country];
      if (mapped) {
        setCurrencyState(mapped);
        return;
      }
    }
    const stored = localStorage.getItem(STORAGE_KEY) as Currency | null;
    if (stored && SYMBOLS[stored]) {
      setCurrencyState(stored);
    }
    // If neither applies, default (USD) stands
  }, [isAuthenticated, user?.country]);

  const setCurrency = useCallback((c: Currency) => {
    setCurrencyState(c);
    localStorage.setItem(STORAGE_KEY, c);
  }, []);

  const format = useCallback(
    (ghsAmount: number): string => {
      const converted = convertGhs(ghsAmount, currency, rates);
      return `${SYMBOLS[currency]}${converted.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    },
    [currency, rates]
  );

  const paymentCurrency = PAYMENT_CURRENCY[currency];

  const paymentAmount = useCallback(
    (ghsAmount: number): number => {
      return convertGhs(ghsAmount, paymentCurrency as Currency, rates);
    },
    [paymentCurrency, rates]
  );

  return (
    <CurrencyContext.Provider
      value={{ currency, setCurrency, format, paymentCurrency, paymentAmount, rates }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency(): CurrencyContextValue {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used inside CurrencyProvider");
  return ctx;
}
