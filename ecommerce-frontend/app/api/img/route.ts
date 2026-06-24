import { NextRequest, NextResponse } from "next/server";

const ALLOWED_HOST = "ecommerce.test";

export async function GET(request: NextRequest) {
  const src = new URL(request.url).searchParams.get("src") ?? "";

  // Only proxy images from the known backend host
  let parsed: URL;
  try {
    parsed = new URL(src);
  } catch {
    return new NextResponse("Invalid URL", { status: 400 });
  }

  if (parsed.hostname !== ALLOWED_HOST) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  try {
    const res = await fetch(src, { cache: "force-cache" });
    if (!res.ok) {
      return new NextResponse("Image not found", { status: 404 });
    }

    const buffer = await res.arrayBuffer();
    const contentType = res.headers.get("content-type") ?? "image/jpeg";

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=3600",
      },
    });
  } catch {
    return new NextResponse("Failed to fetch image", { status: 502 });
  }
}
