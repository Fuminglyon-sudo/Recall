import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Cormorant_Garamond } from "next/font/google";
import { SwRegister } from "@/components/sw-register";
import { AuthProvider } from "@/components/auth-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const displayFont = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Recall — Vocabulary, Speaking & Conversation Practice",
    template: "%s | Recall",
  },
  description:
    "Recall helps you build vocabulary with SM-2 spaced repetition, practice high-stakes speaking with Speak Up, and develop social fluency with Conversation Lab. Free forever — no credit card needed.",
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
  authors: [{ name: "Recall" }],
  creator: "Recall",
  openGraph: {
    siteName: "Recall",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Recall — Vocabulary, Speaking & Conversation Practice",
    description:
      "Build vocabulary with spaced repetition. Practice speaking and social conversations with AI feedback. Free forever.",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Recall",
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

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${displayFont.variable} dark h-full`}>
      <body className="min-h-full bg-slate-950 text-slate-100 antialiased">
        <AuthProvider>{children}</AuthProvider>
        <SwRegister />
      </body>
    </html>
  );
}
