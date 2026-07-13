import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Geist, Geist_Mono, Cormorant_Garamond } from "next/font/google";
import { SwRegister } from "@/components/sw-register";
import { AuthProvider } from "@/components/auth-provider";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const displayFont = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sorosoke.ai";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Sọrọ Sọkẹ AI — Vocabulary, Speaking & Conversation Practice",
    template: "%s | Sọrọ Sọkẹ AI",
  },
  description:
    "Sọrọ Sọkẹ AI helps you build vocabulary with SM-2 spaced repetition, practice high-stakes speaking with Speak Up, and develop social fluency with Conversation Lab. Free for the first 100 users.",
  keywords: [
    "spaced repetition",
    "vocabulary builder",
    "conversation practice",
    "speaking confidence",
    "flashcard app",
    "SM-2 algorithm",
    "social skills",
    "communication skills",
    "speak up practice",
    "conversation lab",
    "Soro Soke",
    "language learning app",
  ],
  authors: [{ name: "Sọrọ Sọkẹ AI", url: SITE_URL }],
  creator: "Sọrọ Sọkẹ AI",
  publisher: "Sọrọ Sọkẹ AI",
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    apple: "/apple-icon.png",
  },
  openGraph: {
    siteName: "Sọrọ Sọkẹ AI",
    type: "website",
    url: SITE_URL,
    images: [{ url: "/dashboard.png", width: 1200, height: 630, alt: "Sọrọ Sọkẹ AI dashboard" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sọrọ Sọkẹ AI — Vocabulary, Speaking & Conversation Practice",
    description:
      "Build vocabulary with spaced repetition. Practice speaking and social conversations with AI. Free for the first 100 users.",
    images: ["/dashboard.png"],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Sọrọ Sọkẹ AI",
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#0f172a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Sọrọ Sọkẹ AI",
  url: SITE_URL,
  description:
    "SM-2 spaced repetition, AI-drafted flashcards, Speak Up high-stakes practice, and Conversation Lab social coaching — all in one app.",
  applicationCategory: "EducationApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD", availability: "https://schema.org/LimitedAvailability" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${displayFont.variable} dark h-full`}>
      <body className="min-h-full bg-slate-950 text-slate-100 antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        {/*
          No-flash theme script: reads saved preference before React hydrates
          so there is no visible flash of the wrong theme on load.
          beforeInteractive places it in <head> before any other scripts.
        */}
        <Script
          id="theme-no-flash"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');var d=t==='light'?false:t==='dark'?true:window.matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.classList.toggle('dark',d);}catch(e){document.documentElement.classList.add('dark');}})();`,
          }}
        />
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
        <SwRegister />
      </body>
    </html>
  );
}
