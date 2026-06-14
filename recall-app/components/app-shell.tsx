import Link from "next/link";
import { Brain, Layers3, PlusCircle } from "lucide-react";
import { NavLinks } from "./nav-links";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-6 sm:px-6 lg:px-8">
      <header className="mb-8 flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-4 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="rounded-2xl bg-emerald-400/15 p-2.5 text-emerald-300">
            <Brain className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Recall</p>
            <p className="text-xs text-slate-500">Small, calm, and local.</p>
          </div>
        </Link>
        <NavLinks />
      </header>
      <main className="flex-1">{children}</main>
      <footer className="mt-8 flex items-center justify-between border-t border-white/10 py-4 text-xs text-slate-600">
        <span>One thing at a time.</span>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1"><Layers3 className="h-3.5 w-3.5" /> Deck-based</span>
          <span className="inline-flex items-center gap-1"><PlusCircle className="h-3.5 w-3.5" /> AI-assisted capture</span>
        </div>
      </footer>
    </div>
  );
}
