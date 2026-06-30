import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Recall",
    short_name: "Recall",
    description: "Spaced repetition for vocabulary, countries, and founder articulation.",
    start_url: "/",
    display: "standalone",
    background_color: "#0f172a",
    theme_color: "#0f172a",
    orientation: "portrait-primary",
    scope: "/",
    icons: [
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/apple-icon.png",
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
      },
      {
        name: "Countries",
        url: "/countries",
        description: "Learn a new country",
      },
      {
        name: "Free recall",
        url: "/free-recall",
        description: "Start a free recall session",
      },
    ],
  };
}
