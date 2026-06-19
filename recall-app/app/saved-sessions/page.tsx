import { AppShell } from "@/components/app-shell";
import { SavedSessionsClient } from "@/components/saved-sessions-client";

export default function SavedSessionsPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-3xl space-y-6">
        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur sm:p-8">
          <p className="text-sm font-medium text-emerald-300">Saved sessions</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white">
            Your conversation archive.
          </h1>
          <p className="mt-3 text-sm leading-7 text-slate-300">
            Review past social skills sessions — what worked, what to sharpen, and how the conversation could have gone. A quiet record of your progress.
          </p>
        </section>
        <SavedSessionsClient />
      </div>
    </AppShell>
  );
}
