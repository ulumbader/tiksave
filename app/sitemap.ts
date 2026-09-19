import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "";

  // If baseUrl is not set, we can return an empty sitemap or relative (which might not be strictly valid standard XML, but Next.js usually handles it or it will just wait until baseUrl is provided).
  if (!baseUrl) {
    return [];
  }

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
  ];
}
