import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Sọrọ Sọkẹ AI",
    short_name: "Soro Soke",
    description: "Build vocabulary with spaced repetition. Practice speaking and social confidence with AI.",
    start_url: "/",
    display: "standalone",
    background_color: "#0f172a",
    theme_color: "#0f172a",
    orientation: "portrait-primary",
    scope: "/",
    icons: [
      // Standard icons — any purpose
      {
        src: "/brand/app-icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/brand/app-icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      // Maskable icon — the drum mark sits within the inner 80% safe area
      {
        src: "/brand/app-icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      // Apple touch icon
      {
        src: "/brand/apple-touch-icon-180.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    categories: ["education", "productivity"],
    shortcuts: [
      {
        name: "Today's cards",
        url: "/today",
        description: "Open today's review queue",
        icons: [{ src: "/brand/app-icon-192.png", sizes: "192x192", type: "image/png" }],
      },
      {
        name: "Countries",
        url: "/countries",
        description: "Learn a new country",
        icons: [{ src: "/brand/app-icon-192.png", sizes: "192x192", type: "image/png" }],
      },
      {
        name: "Free recall",
        url: "/free-recall",
        description: "Start a free recall session",
        icons: [{ src: "/brand/app-icon-192.png", sizes: "192x192", type: "image/png" }],
      },
    ],
  };
}
