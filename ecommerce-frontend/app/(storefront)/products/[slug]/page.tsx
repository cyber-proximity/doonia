import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/services/products";
import ProductDetails from "./ProductDetails";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const result = await getProductBySlug(slug);

  if (!result) return { title: "Product Not Found" };

  const { product } = result;
  const primaryImage =
    product.images.find((img) => img.isPrimary) ?? product.images[0];
  const desc = product.description
    ? product.description.replace(/<[^>]*>/g, "").slice(0, 155)
    : `Buy ${product.name} at Doonia. Fast delivery across Ghana.`;

  return {
    title: product.name,
    description: desc,
    openGraph: {
      title: product.name,
      description: desc,
      type: "website",
      images: primaryImage
        ? [{ url: primaryImage.url, alt: product.name, width: 800, height: 800 }]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: desc,
      images: primaryImage ? [primaryImage.url] : [],
    },
    alternates: {
      canonical: `/products/${slug}`,
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const result = await getProductBySlug(slug);

  if (!result) return notFound();

  return <ProductDetails product={result.product} related={result.related} />;
}
