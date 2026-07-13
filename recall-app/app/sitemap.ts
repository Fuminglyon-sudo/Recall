import type { MetadataRoute } from "next";
import { POSTS } from "./blog/data";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sorosoke.ai";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE,              lastModified: new Date(), changeFrequency: "weekly",  priority: 1.0 },
    { url: `${BASE}/about`,   lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/features`,lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/pricing`, lastModified: new Date(), changeFrequency: "weekly",  priority: 0.9 },
    { url: `${BASE}/blog`,    lastModified: new Date(), changeFrequency: "weekly",  priority: 0.9 },
    { url: `${BASE}/faq`,     lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/contact`, lastModified: new Date(), changeFrequency: "yearly",  priority: 0.5 },
  ];

  const blogPages: MetadataRoute.Sitemap = POSTS.map((post) => ({
    url: `${BASE}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "yearly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...blogPages];
}
