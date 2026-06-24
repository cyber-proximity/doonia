import { NextResponse } from "next/server";

const BACKEND = process.env.BACKEND_URL ?? "http://ecommerce.test/api";

export async function GET() {
  try {
    const res = await fetch(`${BACKEND}/v1/categories`, {
      cache: "no-store",
    });
    const json = await res.json();
    // Backend returns { status, data: [...] }
    const data = Array.isArray(json) ? json : (json?.data ?? []);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}
