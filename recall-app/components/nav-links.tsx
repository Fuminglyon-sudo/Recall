"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/", label: "Dashboard", exact: true },
  { href: "/today", label: "Today", exact: false },
  { href: "/cards/new", label: "Add card", exact: false },
  { href: "/decks", label: "Decks", exact: false },
];

export function NavLinks() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap items-center gap-1 text-sm">
      {LINKS.map(({ href, label, exact }) => {
        const active = exact ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={
              active
                ? "rounded-2xl bg-white/10 px-3 py-2 font-medium text-white"
                : "rounded-2xl px-3 py-2 text-slate-400 transition hover:bg-white/8 hover:text-white"
            }
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
