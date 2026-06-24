import type { MetadataRoute } from "next";

export const revalidate = 3600; // regenerate every hour

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3001";
const API  = (process.env.NEXT_PUBLIC_API_URL ?? "http://ecommerce.test/api") + "/v1";

async function getProductSlugs(): Promise<string[]> {
  try {
    // Fetch all pages of products to collect slugs
    const res = await fetch(`${API}/products?per_page=200`, { cache: "no-store" });
    if (!res.ok) return [];
    const { data } = await res.json();
    return (data as { slug: string }[]).map((p) => p.slug);
  } catch {
    return [];
  }
}

async function getCategorySlugs(): Promise<string[]> {
  try {
    const res = await fetch(`${API}/categories`, { cache: "no-store" });
    if (!res.ok) return [];
    const { data } = await res.json();
    return (data as { slug: string }[]).map((c) => c.slug);
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [productSlugs, categorySlugs] = await Promise.all([
    getProductSlugs(),
    getCategorySlugs(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${BASE}/products`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: `${BASE}/register`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${BASE}/login`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];

  const productRoutes: MetadataRoute.Sitemap = productSlugs.map((slug) => ({
    url: `${BASE}/products/${slug}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.8,
  }));

  const categoryRoutes: MetadataRoute.Sitemap = categorySlugs.map((slug) => ({
    url: `${BASE}/products?category=${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...productRoutes, ...categoryRoutes];
}
