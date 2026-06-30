import { AppShell } from "@/components/app-shell";
import { SocialSkillsClient } from "@/components/social-skills-client";

export default function ConversationLabPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-4xl space-y-6">
        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur sm:p-8">
          <p className="text-sm font-medium text-emerald-300">Conversation Lab</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white">
            Talk to anyone, in any room.
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
            Pick a scenario — a flight, a gym, a dinner party where you know nobody, a coffee shop queue.
            Choose the kind of person you're talking to and the difficulty. Start the conversation yourself,
            keep it going, then get honest coaching on what worked and one move to try next time.
          </p>
        </section>

        <SocialSkillsClient />
      </div>
    </AppShell>
  );
}
