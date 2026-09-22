import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://sedotvidio.vercel.app";

  return {
    rules: [
      {
        // Default: allow everything except API routes
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
      {
        // Google — full access
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/api/"],
      },
      {
        // Google Images — allow images
        userAgent: "Googlebot-Image",
        allow: "/",
      },
      {
        // Bing — full access
        userAgent: "Bingbot",
        allow: "/",
        disallow: ["/api/"],
      },
      {
        // AI: OpenAI GPTBot (ChatGPT browsing, SearchGPT)
        userAgent: "GPTBot",
        allow: "/",
        disallow: ["/api/"],
      },
      {
        // AI: ChatGPT user browsing
        userAgent: "ChatGPT-User",
        allow: "/",
        disallow: ["/api/"],
      },
      {
        // AI: Google Gemini / Google Extended
        userAgent: "Google-Extended",
        allow: "/",
        disallow: ["/api/"],
      },
      {
        // AI: Anthropic Claude
        userAgent: "anthropic-ai",
        allow: "/",
        disallow: ["/api/"],
      },
      {
        // AI: Anthropic ClaudeBot
        userAgent: "ClaudeBot",
        allow: "/",
        disallow: ["/api/"],
      },
      {
        // AI: Perplexity
        userAgent: "PerplexityBot",
        allow: "/",
        disallow: ["/api/"],
      },
      {
        // AI: Cohere
        userAgent: "cohere-ai",
        allow: "/",
        disallow: ["/api/"],
      },
      {
        // AI: Meta
        userAgent: "Meta-ExternalAgent",
        allow: "/",
        disallow: ["/api/"],
      },
      {
        // AI: Apple (Applebot-Extended)
        userAgent: "Applebot-Extended",
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    host: baseUrl,
    ...(baseUrl ? { sitemap: `${baseUrl}/sitemap.xml` } : {}),
  };
}
