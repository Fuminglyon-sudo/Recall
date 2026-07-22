export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { DocLabClient } from "@/components/doc-lab-client";
import { getCurrentUserId } from "@/lib/session";

export const metadata = { title: "Doc Lab — Soro Soke" };

export default async function DocLabPage() {
  const userId = await getCurrentUserId();
  if (!userId) redirect("/login");

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl space-y-6">
        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur sm:p-8">
          <p className="text-sm font-medium text-emerald-300">Doc Lab</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white">
            Read like someone who is going to say something.
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
            Most people read a document and absorb it. The people who get listened to read the same document and arrive
            with two questions nobody else asked. That is a habit, not a personality — you can practise it. Read a
            document, write what you would raise, then see what you caught, what you missed, and exactly how to put it
            so it lands without sounding like an attack.
          </p>
        </section>

        <DocLabClient />
      </div>
    </AppShell>
  );
}
