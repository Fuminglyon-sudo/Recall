import type { MetadataRoute } from "next";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sorosoke.ai";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/about", "/features", "/pricing", "/blog", "/faq", "/contact", "/privacy", "/terms", "/guide"],
        disallow: [
          "/api/",
          "/admin/",
          "/today",
          "/decks",
          "/cards",
          "/settings",
          "/speak-up",
          "/conversation-lab",
          "/countries",
          "/free-recall",
          "/saved-sessions",
          "/search",
          "/voice",
        ],
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
  };
}
