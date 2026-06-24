import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const CURRENCY_SYMBOLS: Record<string, string> = {
  GHS: "GH₵",
  USD: "$",
  EUR: "€",
  GBP: "£",
  NGN: "₦",
};

export function formatPrice(amount: number, currency = "GHS"): string {
  const symbol = CURRENCY_SYMBOLS[currency] ?? currency + " ";
  const formatted = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
  return `${symbol}${formatted}`;
}

export function getDiscountPercent(price: number, compareAt: number): number {
  return Math.round(((compareAt - price) / compareAt) * 100);
}

export function slugify(text: string): string {
  return text.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, "");
}

export function getProductImageUrl(url: string, width = 600, height = 600): string {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!cloudName || !url.startsWith("http")) return url;
  return `https://res.cloudinary.com/${cloudName}/image/fetch/w_${width},h_${height},c_fill,q_auto,f_auto/${encodeURIComponent(url)}`;
}
