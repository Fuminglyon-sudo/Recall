"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SoroSokeLogo } from "./soro-soke-logo";
import { ThemeToggle } from "./theme-toggle";

const NAV_LINKS = [
  { label: "About",    href: "/about" },
  { label: "Features", href: "/features" },
  { label: "Pricing",  href: "/pricing" },
  { label: "Blog",     href: "/blog" },
  { label: "FAQ",      href: "/faq" },
];

export function MarketingNav() {
  const pathname = usePathname();

  return (
    <header
      className="sticky top-0 z-40 backdrop-blur-xl"
      style={{
        borderBottom: "1px solid var(--stroke-s)",
        background: "color-mix(in oklab, var(--background) 88%, transparent)",
      }}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 sm:px-10">
        {/* Logo */}
        <Link href="/landing">
          <SoroSokeLogo fontSize="1.9rem" duration={1.0} />
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-1.5">
          {/* Pill nav — matching the landing page style, themed via CSS vars */}
          {NAV_LINKS.map(({ label, href }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={label}
                href={href}
                className="hidden sm:inline-flex items-center rounded-xl px-4 py-1.5 transition"
                style={{
                  fontFamily: "var(--font-display)",
                  fontStyle: "italic",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  letterSpacing: "0.01em",
                  border: active
                    ? "1px solid var(--stroke-l)"
                    : "1px solid var(--stroke-s)",
                  background: active ? "var(--surface-3)" : "var(--surface-1)",
                  color: active
                    ? "var(--foreground)"
                    : "color-mix(in oklab, var(--foreground) 55%, transparent)",
                }}
              >
                {label}
              </Link>
            );
          })}

          <Link
            href="/login"
            className="rounded-xl bg-emerald-400 px-4 py-1.5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
          >
            Sign in
          </Link>
          <ThemeToggle className="rounded-xl p-2.5 text-slate-400 transition hover:text-slate-200 hover:bg-white/6" />
        </div>
      </div>
    </header>
  );
}
