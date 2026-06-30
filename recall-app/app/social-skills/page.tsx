import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/session";
import { AppShell } from "@/components/app-shell";
import { SocialSkillsClient } from "@/components/social-skills-client";

export default async function SocialSkillsPage() {
  if (!(await isAdmin())) redirect("/");
  return (
    <AppShell>
      <div className="mx-auto max-w-4xl space-y-6">
        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur sm:p-8">
          <p className="text-sm font-medium text-emerald-300">Social Skills Lab</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white">
            Talk to anyone, in any room.
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
            Pick a real-world scenario — a flight, a networking event, a wedding where you know nobody.
            Choose the type of person you want to practice with. Open the conversation yourself, keep it going,
            then get honest coaching on what worked and one move to try next time.
          </p>
        </section>

        <SocialSkillsClient />
      </div>
    </AppShell>
  );
}
