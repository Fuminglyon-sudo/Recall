import type { MetadataRoute } from "next";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sorosokeai.com";

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
          "/debate-lab",
          "/social-skills",
          "/streak",
          "/pitch-practice",
          "/sentence-challenge",
          "/corporate-jargon",
          "/founder-words",
        ],
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
  };
}
