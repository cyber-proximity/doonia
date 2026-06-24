import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Doonia",
    short_name: "Doonia",
    description: "Ghana's Online Marketplace",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#00B5C8",
    orientation: "portrait",
    categories: ["shopping", "ecommerce"],
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
        purpose: "any",
      },
    ],
  };
}
