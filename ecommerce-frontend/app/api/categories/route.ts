import { NextResponse } from "next/server";

const BACKEND = (process.env.BACKEND_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://ecommerce.test/api").replace(/\/v1$/, "");

export async function GET() {
  try {
    const res = await fetch(`${BACKEND}/v1/categories`, {
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return NextResponse.json([]);
    const json = await res.json();
    const data = Array.isArray(json) ? json : (json?.data ?? []);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json([]);
  }
}
