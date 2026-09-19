import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    // Only include sitemap if baseUrl is defined
    ...(baseUrl ? { sitemap: `${baseUrl}/sitemap.xml` } : {}),
  };
}
