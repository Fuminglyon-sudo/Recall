import Link from "next/link";
import Image from "next/image";
import { SoroSokeLogo } from "./soro-soke-logo";
import { SoroSokeMark } from "./soro-soke-mark";

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
        <div className="grid gap-10 sm:grid-cols-3 mb-10">
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
            </ul>
          </div>
        </div>
        <div className="border-t border-white/5 pt-6 flex flex-col items-center gap-3 text-center text-xs text-slate-700">
          <p>© {new Date().getFullYear()} Sọrọ Sọkẹ. All rights reserved.</p>
          <a
            href="https://japareality.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-slate-600 transition hover:text-slate-300"
          >
            <span>A product of</span>
            <Image src="/japa-reality-logo.png" alt="Japa Reality" width={16} height={16} className="rounded-sm" />
            <span className="font-medium">Japa Reality</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
