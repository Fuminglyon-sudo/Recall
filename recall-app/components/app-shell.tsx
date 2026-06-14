import Link from "next/link";
import { Brain, Layers3, PlusCircle, SunMoon } from "lucide-react";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-6 sm:px-6 lg:px-8">
      <header className="mb-8 flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="rounded-2xl bg-emerald-400/15 p-2 text-emerald-300">
            <Brain className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Recall</p>
            <p className="text-xs text-slate-400">Small, calm, and local.</p>
          </div>
        </Link>
        <nav className="flex flex-wrap items-center gap-2 text-sm text-slate-300">
          <Link href="/" className="rounded-2xl px-3 py-2 transition hover:bg-white/10 hover:text-white">Dashboard</Link>
          <Link href="/today" className="rounded-2xl px-3 py-2 transition hover:bg-white/10 hover:text-white">Today</Link>
          <Link href="/cards/new" className="rounded-2xl px-3 py-2 transition hover:bg-white/10 hover:text-white">Add card</Link>
          <Link href="/decks" className="rounded-2xl px-3 py-2 transition hover:bg-white/10 hover:text-white">Decks</Link>
          <span className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-slate-400">
            <SunMoon className="h-4 w-4" />
            Dark
          </span>
        </nav>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="mt-8 flex items-center justify-between border-t border-white/10 py-4 text-xs text-slate-500">
        <span>One thing at a time.</span>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1"><Layers3 className="h-3.5 w-3.5" /> Deck-based</span>
          <span className="inline-flex items-center gap-1"><PlusCircle className="h-3.5 w-3.5" /> AI-assisted capture</span>
        </div>
      </footer>
    </div>
  );
}
