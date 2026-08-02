"use client";

import Link from "next/link";
import { SoroSokeLogo } from "./soro-soke-logo";
import { SoroSokeMark } from "./soro-soke-mark";
import { openCookieSettings } from "@/lib/cookie-consent";

const SIBLING_PRODUCTS = [
  {
    label: "My Next Hop",
    tagline: "Interview coaching & career prep for engineers",
    href: "https://getnexthop.com",
  },
  {
    label: "Japa Reality",
    tagline: "Emigration planning",
    href: "https://japareality.com",
  },
];

export function MarketingFooter() {
  return (
    <footer className="border-t border-white/8 bg-slate-950">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <div className="mb-10">
          <Link href="/landing" className="inline-flex items-center gap-2">
            <SoroSokeMark size={26} className="shrink-0" />
            <SoroSokeLogo fontSize="1.5rem" duration={0.8} />
          </Link>
        </div>
        <div className="grid gap-10 sm:grid-cols-4 mb-10">
          <div className="space-y-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-600">Product</p>
            <ul className="space-y-2.5">
              {[
                { label: "Features", href: "/features" },
                { label: "Pricing", href: "/pricing" },
                { label: "FAQ", href: "/faq" },
                { label: "Blog", href: "/blog" },
                { label: "Guide", href: "/guide" },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-xs text-slate-600 transition hover:text-slate-300">{label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-600">Company</p>
            <ul className="space-y-2.5">
              {[
                { label: "About", href: "/about" },
                { label: "Contact", href: "/contact" },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-xs text-slate-600 transition hover:text-slate-300">{label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-600">Legal</p>
            <ul className="space-y-2.5">
              {[
                { label: "Privacy Policy", href: "/privacy" },
                { label: "Terms of Service", href: "/terms" },
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="text-xs text-slate-600 transition hover:text-slate-300">{label}</Link>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  onClick={openCookieSettings}
                  className="text-xs text-slate-600 transition hover:text-slate-300"
                >
                  Cookie settings
                </button>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-600">
              Also from Japa Reality Technologies Inc.
            </p>
            <ul className="space-y-2.5">
              {SIBLING_PRODUCTS.map(({ label, tagline, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block text-xs text-slate-600 transition hover:text-slate-300"
                  >
                    <span className="font-medium">{label}</span>
                    <span className="block text-slate-700 transition group-hover:text-slate-500">{tagline}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-white/5 pt-6 flex flex-col items-center gap-2 text-center text-xs text-slate-700">
          <p>© {new Date().getFullYear()} Japa Reality Technologies Inc.</p>
          <a
            href="https://japareality.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-600 transition hover:text-slate-300"
          >
            Soro Soke is a product of Japa Reality Technologies Inc.
          </a>
          <a
            href="https://fuminglyonnetwork.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-700 transition hover:text-slate-400"
          >
            Part of the FumingLyon Network family
          </a>
        </div>
      </div>
    </footer>
  );
}
