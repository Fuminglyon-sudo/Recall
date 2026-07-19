import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Geist, Geist_Mono, Cormorant_Garamond } from "next/font/google";
import { SwRegister } from "@/components/sw-register";
import { PwaInstallBanner } from "@/components/pwa-install-banner";
import { AuthProvider } from "@/components/auth-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { GA_MEASUREMENT_ID } from "@/lib/analytics";
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
    default: "Sọrọ Sọkẹ AI — Speaking, Conversation, Debate & Vocabulary Practice",
    template: "%s | Sọrọ Sọkẹ AI",
  },
  description:
    "Sọrọ Sọkẹ AI helps you practice high-stakes speaking with Speak Up, ease social anxiety with Conversation Lab, and build reasoning confidence with Debate Lab — backed by SM-2 spaced repetition so the vocabulary sticks. Practice the moment before the anxiety does. Free for the first 50 users.",
  keywords: [
    "speaking confidence",
    "conversation practice",
    "debate lab",
    "social skills",
    "communication skills",
    "speak up practice",
    "conversation lab",
    "social anxiety app",
    "confidence building app",
    "overcome social anxiety",
    "social confidence training",
    "spaced repetition",
    "vocabulary builder",
    "flashcard app",
    "SM-2 algorithm",
    "Soro Soke",
    "language learning app",
  ],
  authors: [{ name: "Sọrọ Sọkẹ AI", url: SITE_URL }],
  creator: "Sọrọ Sọkẹ AI",
  publisher: "Sọrọ Sọkẹ AI",
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/brand/app-icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/brand/apple-touch-icon-180.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    siteName: "Sọrọ Sọkẹ AI",
    type: "website",
    url: SITE_URL,
    // Share image comes from app/opengraph-image.tsx (a purpose-built
    // card, not a screenshot) — Next wires up og:image automatically.
  },
  twitter: {
    card: "summary_large_image",
    title: "Sọrọ Sọkẹ AI — Speaking, Conversation, Debate & Vocabulary Practice",
    description:
      "Ease social anxiety and build confidence with AI-coached speaking, conversation, and debate practice — vocabulary sticks because of spaced repetition underneath. Free for the first 50 users.",
    // Share image comes from app/twitter-image.tsx.
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
    "SM-2 spaced repetition, AI-drafted flashcards, Speak Up high-stakes practice, Conversation Lab social-anxiety coaching, and Debate Lab reasoning practice — all in one app.",
  applicationCategory: "EducationApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD", availability: "https://schema.org/LimitedAvailability" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${displayFont.variable} dark h-full`}>
      <body className="min-h-full bg-slate-950 text-slate-100 antialiased">
        {/* Google tag (gtag.js) — skipped outside production so local dev
            and preview traffic doesn't pollute analytics. */}
        {process.env.NODE_ENV === "production" ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());

                gtag('config', '${GA_MEASUREMENT_ID}');
              `}
            </Script>
          </>
        ) : null}
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
        <PwaInstallBanner />
      </body>
    </html>
  );
}
