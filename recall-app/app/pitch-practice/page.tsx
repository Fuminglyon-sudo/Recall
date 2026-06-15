import { AppShell } from "@/components/app-shell";
import { PitchPracticeClient } from "@/components/pitch-practice-client";

export default function PitchPracticePage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-4xl space-y-6">
        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur sm:p-8">
          <p className="text-sm font-medium text-emerald-300">Pitch practice</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white">
            Practice your pitch in realistic scenarios, get graded, and see the model answer.
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
            Pick a scenario — a plane conversation, a demo day stage, a cold investor introduction — record or type your answer, and get honest feedback on clarity, specificity, and confidence. Repeat until it sounds like you.
          </p>
        </section>

        <PitchPracticeClient />
      </div>
    </AppShell>
  );
}
