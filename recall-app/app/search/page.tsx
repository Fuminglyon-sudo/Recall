import { AppShell } from "@/components/app-shell";
import { SearchClient } from "@/components/search-client";

export default function SearchPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-3xl space-y-6">
        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur sm:p-8">
          <p className="text-sm font-medium text-emerald-300">Search</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white">Find any card.</h1>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            Search across all decks by word, definition, example, or synonym. Click any result to expand the full card.
          </p>
        </section>
        <SearchClient />
      </div>
    </AppShell>
  );
}
