export const dynamic = "force-dynamic";

import { AppShell } from "@/components/app-shell";
import { DebateLabClient } from "@/components/debate-lab-client";

export const metadata = { title: "Debate Lab — Soro Soke" };

export default function DebateLabPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-2xl space-y-6">
        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur sm:p-8">
          <p className="text-sm font-medium text-amber-400">Debate Lab</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white">
            Argue your point. Defend it. Win it.
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
            Pick a motion, choose your position, and go head-to-head with an AI opponent.
            Up to five exchanges — then get scored on argument strength, logic, and delivery.
            Build the skill of holding your ground under pressure.
          </p>
        </section>

        <DebateLabClient />
      </div>
    </AppShell>
  );
}
