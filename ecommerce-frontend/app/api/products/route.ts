import { NextRequest, NextResponse } from "next/server";

const BACKEND = (process.env.BACKEND_URL ?? "http://ecommerce.test/api") + "/v1";

export async function GET(request: NextRequest) {
  const params = new URL(request.url).searchParams.toString();
  try {
    const res  = await fetch(`${BACKEND}/products${params ? `?${params}` : ""}`, {
      cache: "no-store",
    });
    const json = await res.json();
    return NextResponse.json(json);
  } catch {
    return NextResponse.json({ data: [], meta: { total: 0, current_page: 1, last_page: 1, per_page: 20 } });
  }
}
