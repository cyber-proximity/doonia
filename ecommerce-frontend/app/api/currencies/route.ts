import { NextResponse } from "next/server";

const BACKEND = (process.env.BACKEND_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://ecommerce.test/api").replace(/\/v1$/, "");

export async function GET() {
  try {
    const res = await fetch(`${BACKEND}/v1/settings/currencies`, {
      next: { revalidate: 300 }, // cache 5 min — rates don't change often
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return NextResponse.json(defaultRates());
    const json = await res.json();
    return NextResponse.json(json?.data ?? defaultRates());
  } catch {
    return NextResponse.json(defaultRates());
  }
}

function defaultRates() {
  return { ghs_to_usd: 0.063, ghs_to_ngn: 15.38, ghs_to_cny: 0.45 };
}
