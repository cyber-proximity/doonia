import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

const inter = localFont({
  src: "../node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2",
  variable: "--font-inter",
  display: "swap",
  fallback: ["system-ui", "sans-serif"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3001";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    template: "%s | Doonia",
    default: "Doonia — Ghana's Online Marketplace",
  },
  description:
    "Shop quality electronics, fashion, home goods, beauty and more. Fast delivery across Ghana. Secure checkout with Paystack.",
  keywords: [
    "online shopping ghana",
    "ecommerce ghana",
    "buy online ghana",
    "electronics ghana",
    "fashion ghana",
    "doonia",
  ],
  authors: [{ name: "Doonia" }],
  creator: "Doonia",
  publisher: "Doonia",
  openGraph: {
    type: "website",
    locale: "en_GH",
    siteName: "Doonia",
    title: "Doonia — Ghana's Online Marketplace",
    description:
      "Shop quality electronics, fashion, home goods and more. Fast delivery across Ghana.",
  },
  twitter: {
    card: "summary_large_image",
    site: "@dooniagh",
    creator: "@dooniagh",
    title: "Doonia — Ghana's Online Marketplace",
    description:
      "Shop quality electronics, fashion, home goods and more. Fast delivery across Ghana.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: SITE_URL,
  },
};

export const viewport: Viewport = {
  themeColor: "#00B5C8",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GH" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
