"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Brain,
  LayoutDashboard,
  CalendarCheck2,
  Layers3,
  PlusCircle,
  Menu,
  X,
  LogOut,
  Sparkles,
  Mic2,
  Mic,
  Users,
  MessageCircle,
  Search,
  PenLine,
  BookmarkCheck,
  BrainCircuit,
  Globe,
  BookOpen,
  Settings,
  Briefcase,
} from "lucide-react";

const CORE_LINKS = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/today", label: "Today", icon: CalendarCheck2, exact: false },
  { href: "/speak-up", label: "Speak Up", icon: Mic, exact: false },
  { href: "/conversation-lab", label: "Conversation Lab", icon: MessageCircle, exact: false },
];

const TOOLS_LINKS = [
  { href: "/decks", label: "Decks", icon: Layers3, exact: false },
  { href: "/cards/new", label: "Add card", icon: PlusCircle, exact: false },
  { href: "/search", label: "Search", icon: Search, exact: false },
  { href: "/guide", label: "Guide", icon: BookOpen, exact: false },
  { href: "/settings", label: "Settings", icon: Settings, exact: false },
];

const MORE_LINKS = [
  { href: "/countries", label: "Countries", icon: Globe, exact: false },
  { href: "/free-recall", label: "Free recall", icon: BrainCircuit, exact: false },
  { href: "/sentence-challenge", label: "Sentence challenge", icon: PenLine, exact: false },
  { href: "/corporate-jargon", label: "Corporate jargon", icon: Briefcase, exact: false },
];

const ADMIN_LINKS = [
  { href: "/pitch-practice", label: "Pitch practice", icon: Mic2, exact: false },
  { href: "/social-skills", label: "Social skills", icon: Users, exact: false },
  { href: "/saved-sessions", label: "Saved sessions", icon: BookmarkCheck, exact: false },
  { href: "/founder-words", label: "Founder words", icon: Sparkles, exact: false },
];

function NavLink({
  href,
  label,
  icon: Icon,
  exact,
  onClose,
}: {
  href: string;
  label: string;
  icon: React.ElementType;
  exact: boolean;
  onClose?: () => void;
}) {
  const pathname = usePathname();
  const active = exact ? pathname === href : pathname.startsWith(href);
  return (
    <Link
      href={href}
      onClick={onClose}
      className={`group flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm transition-colors ${
        active
          ? "bg-white/10 font-medium text-white"
          : "text-slate-400 hover:bg-white/8 hover:text-slate-200"
      }`}
    >
      <Icon
        className={`h-4 w-4 shrink-0 transition-colors ${
          active ? "text-emerald-300" : "group-hover:text-slate-300"
        }`}
      />
      {label}
      {active ? <span className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-400" /> : null}
    </Link>
  );
}

function NavSection({ label, children }: { label?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-0.5">
      {label ? (
        <p className="px-3 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-600">
          {label}
        </p>
      ) : null}
      {children}
    </div>
  );
}

function NavItems({ onClose, isAdmin }: { onClose?: () => void; isAdmin: boolean }) {
  return (
    <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-4">
      <NavSection>
        {CORE_LINKS.map((link) => (
          <NavLink key={link.href} {...link} onClose={onClose} />
        ))}
      </NavSection>

      <NavSection label="Tools">
        {TOOLS_LINKS.map((link) => (
          <NavLink key={link.href} {...link} onClose={onClose} />
        ))}
      </NavSection>

      <NavSection label="More">
        {MORE_LINKS.map((link) => (
          <NavLink key={link.href} {...link} onClose={onClose} />
        ))}
      </NavSection>

      {isAdmin && (
        <NavSection label="Admin">
          <div className="mb-1 border-t border-white/8" />
          {ADMIN_LINKS.map((link) => (
            <NavLink key={link.href} {...link} onClose={onClose} />
          ))}
        </NavSection>
      )}
    </nav>
  );
}

function SidebarContent({
  onClose,
  userLabel,
  isAdmin,
}: {
  onClose?: () => void;
  userLabel?: string | null;
  isAdmin: boolean;
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex shrink-0 items-center justify-between p-5 pb-2">
        <Link href="/landing" className="flex items-center gap-3" onClick={onClose}>
          <div className="rounded-2xl bg-emerald-400/15 p-2.5 text-emerald-300">
            <Brain className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Recall</p>
            <p className="text-xs text-slate-500">Small, calm, local.</p>
          </div>
        </Link>
        {onClose ? (
          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-500 transition hover:bg-white/8 hover:text-slate-300 lg:hidden"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        ) : null}
      </div>

      <div className="flex-1 overflow-y-auto">
        <NavItems onClose={onClose} isAdmin={isAdmin} />
      </div>

      <div className="shrink-0 border-t border-white/8 px-5 py-4 space-y-2">
        {userLabel ? (
          <div className="flex items-center gap-2 min-w-0">
            <div className="h-5 w-5 shrink-0 rounded-full bg-emerald-400/20 flex items-center justify-center">
              <span className="text-[10px] font-semibold text-emerald-300 uppercase">
                {userLabel[0]}
              </span>
            </div>
            <p className="truncate text-xs font-medium text-slate-300">{userLabel}</p>
            {isAdmin && (
              <span className="shrink-0 rounded-full bg-emerald-400/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-400">
                admin
              </span>
            )}
          </div>
        ) : null}
        <p className="text-xs text-slate-600">One thing at a time.</p>
        <a
          href="/api/logout"
          className="flex items-center gap-2 text-xs text-slate-500 transition hover:text-slate-300"
        >
          <LogOut className="h-3.5 w-3.5" />
          Sign out
        </a>
      </div>
    </div>
  );
}

export function Sidebar({
  isAdmin,
  userLabel,
}: {
  isAdmin: boolean;
  userLabel?: string | null;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Desktop sidebar — fixed left */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:flex lg:w-60 lg:flex-col lg:border-r lg:border-white/8 lg:bg-slate-950/90 lg:backdrop-blur-xl">
        <SidebarContent isAdmin={isAdmin} userLabel={userLabel} />
      </aside>

      {/* Mobile top bar */}
      <div className="fixed inset-x-0 top-0 z-30 flex h-14 items-center justify-between border-b border-white/8 bg-slate-950/90 px-4 backdrop-blur-xl lg:hidden">
        <Link href="/landing" className="flex items-center gap-2.5">
          <div className="rounded-xl bg-emerald-400/15 p-2 text-emerald-300">
            <Brain className="h-4 w-4" />
          </div>
          <p className="text-sm font-semibold text-white">Recall</p>
        </Link>
        <button
          onClick={() => setOpen(true)}
          className="rounded-xl p-2 text-slate-400 transition hover:bg-white/8 hover:text-white"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Mobile drawer */}
      {open ? (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 z-50 w-72 border-r border-white/10 bg-slate-950 lg:hidden">
            <SidebarContent isAdmin={isAdmin} userLabel={userLabel} onClose={() => setOpen(false)} />
          </aside>
        </>
      ) : null}
    </>
  );
}
