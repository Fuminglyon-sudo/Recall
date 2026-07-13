import type { Metadata, Viewport } from "next";
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

export const metadata: Metadata = {
  title: {
    default: "Sọrọ Sọkẹ AI — Vocabulary, Speaking & Conversation Practice",
    template: "%s | Sọrọ Sọkẹ AI",
  },
  description:
    "Sọrọ Sọkẹ AI helps you build vocabulary with SM-2 spaced repetition, practice high-stakes speaking with Speak Up, and develop social fluency with Conversation Lab. Free forever — no credit card needed.",
  keywords: [
    "spaced repetition",
    "vocabulary builder",
    "conversation practice",
    "speaking confidence",
    "flashcard app",
    "SM-2 algorithm",
    "social skills",
    "communication skills",
    "speak up",
    "conversation lab",
  ],
  authors: [{ name: "Sọrọ Sọkẹ AI" }],
  creator: "Sọrọ Sọkẹ AI",
  openGraph: {
    siteName: "Sọrọ Sọkẹ AI",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Sọrọ Sọkẹ AI — Vocabulary, Speaking & Conversation Practice",
    description:
      "Build vocabulary with spaced repetition. Practice speaking and social conversations with AI feedback. Free forever.",
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

// Runs before React hydrates — reads saved preference and applies dark/light
// class to <html> immediately so there's no flash of wrong theme.
const noFlashScript = `(function(){try{var t=localStorage.getItem('theme');var d=t==='light'?false:t==='dark'?true:window.matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.classList.toggle('dark',d);}catch(e){document.documentElement.classList.add('dark');}})();`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${displayFont.variable} dark h-full`}>
      <head>
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: intentional no-flash theme script */}
        <script dangerouslySetInnerHTML={{ __html: noFlashScript }} />
      </head>
      <body className="min-h-full bg-slate-950 text-slate-100 antialiased">
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
        <SwRegister />
      </body>
    </html>
  );
}
