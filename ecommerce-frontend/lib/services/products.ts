import { Product, Category } from "@/types";

const BASE = (process.env.BACKEND_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://ecommerce.test/api") + "/v1";

// --- Transformers (API snake_case → frontend camelCase) ---

type RawCategory = {
  id: number;
  name: string;
  slug: string;
  image: string | null;
  product_count?: number;
  status?: string;
  sort_order?: number;
};

type RawImage = {
  id: number;
  url: string;
  alt_text: string;
  is_primary: boolean;
  sort_order: number;
};

type RawProduct = {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: string | number;
  compare_at_price: string | number | null;
  sku: string;
  stock_quantity: number;
  low_stock_threshold: number;
  status: "active" | "inactive";
  featured: boolean;
  category: RawCategory;
  images: RawImage[];
  avg_rating: number | null;
  review_count: number;
  related?: RawProduct[];
  created_at: string;
};

function toCategory(raw: RawCategory): Category {
  return {
    id: raw.id,
    name: raw.name,
    slug: raw.slug,
    image: raw.image ?? "",
    productCount: raw.product_count ?? 0,
  };
}

// Route backend-hosted images through the Next.js proxy (/api/img).
// External images (Unsplash, Cloudinary, etc.) are left as-is.
function proxyBackendImage(url: string): string {
  if (!url) return "";
  try {
    const { hostname } = new URL(url);
    if (hostname === "ecommerce.test") {
      return `/api/img?src=${encodeURIComponent(url)}`;
    }
  } catch {
    // relative or malformed — return unchanged
  }
  return url;
}

export function toProductFromRaw(raw: RawProduct): Product {
  return {
    id: raw.id,
    name: raw.name,
    slug: raw.slug,
    description: raw.description ?? "",
    price: Number(raw.price),
    compareAtPrice: raw.compare_at_price ? Number(raw.compare_at_price) : null,
    sku: raw.sku,
    stockQuantity: raw.stock_quantity,
    status: raw.status,
    featured: raw.featured,
    category: toCategory(raw.category),
    images: (raw.images ?? []).map((img) => ({
      id: img.id,
      url: proxyBackendImage(img.url),
      altText: img.alt_text ?? "",
      isPrimary: img.is_primary,
    })),
    avgRating: raw.avg_rating ?? null,
    reviewCount: raw.review_count ?? 0,
  };
}

// --- Public API ---

export async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${BASE}/products/featured`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    const { data } = await res.json();
    return (data as RawProduct[]).map(toProductFromRaw);
  } catch {
    return [];
  }
}

export async function getCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${BASE}/categories`, { cache: "no-store" });
    if (!res.ok) return [];
    const { data } = await res.json();
    return (data as RawCategory[]).map(toCategory);
  } catch {
    return [];
  }
}

export interface ProductsResult {
  products: Product[];
  meta: {
    total: number;
    currentPage: number;
    lastPage: number;
    perPage: number;
  };
}

export async function getProducts(params: {
  search?: string;
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  sort?: string;
  page?: number;
  onSale?: boolean;
}): Promise<ProductsResult> {
  const empty: ProductsResult = {
    products: [],
    meta: { total: 0, currentPage: 1, lastPage: 1, perPage: 20 },
  };

  try {
    const q = new URLSearchParams();
    if (params.search) q.set("search", params.search);
    if (params.category) q.set("category", params.category);
    if (params.minPrice) q.set("min_price", params.minPrice);
    if (params.maxPrice) q.set("max_price", params.maxPrice);
    if (params.sort) q.set("sort", params.sort);
    if (params.onSale) q.set("on_sale", "1");
    if (params.page && params.page > 1) q.set("page", String(params.page));

    const res = await fetch(`${BASE}/products?${q}`, { cache: "no-store" });
    if (!res.ok) return empty;

    const { data, meta } = await res.json();
    return {
      products: (data as RawProduct[]).map(toProductFromRaw),
      meta: {
        total: meta.total,
        currentPage: meta.current_page,
        lastPage: meta.last_page,
        perPage: meta.per_page,
      },
    };
  } catch {
    return empty;
  }
}

export async function getProductBySlug(
  slug: string
): Promise<{ product: Product; related: Product[] } | null> {
  try {
    const res = await fetch(`${BASE}/products/${slug}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const { data } = (await res.json()) as { data: RawProduct };
    return {
      product: toProductFromRaw(data),
      related: (data.related ?? []).map(toProductFromRaw),
    };
  } catch {
    return null;
  }
}
