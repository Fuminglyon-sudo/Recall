import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SummonLogo } from "@/components/summon-logo";
import { MarketingFooter } from "@/components/marketing-footer";

export const metadata: Metadata = {
  title: "Privacy Policy — Soro Soke",
  description: "How Soro Soke collects, uses, and protects your personal data.",
  robots: { index: true, follow: true },
};

const LAST_UPDATED = "July 2026";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white antialiased flex flex-col">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-white/8 bg-slate-950/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <Link href="/landing">
            <SummonLogo fontSize="1.9rem" />
          </Link>
          <Link href="/landing" className="flex items-center gap-2 text-sm text-slate-400 transition hover:text-white">
            <ArrowLeft className="h-4 w-4" />
            Home
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl flex-1 px-6 py-20">
        <div className="space-y-3 mb-14">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">Legal</p>
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl">Privacy Policy</h1>
          <p className="text-sm text-slate-500">Last updated: {LAST_UPDATED}</p>
        </div>

        <div className="space-y-12 text-sm leading-7 text-slate-400">

          <section className="space-y-4">
            <h2 className="text-base font-semibold text-white">Overview</h2>
            <p>
              Soro Soke (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is a vocabulary and communication-practice tool. We take your
              privacy seriously. This policy explains what data we collect, why we collect it, and how
              we protect it. We do not sell your data — ever.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-base font-semibold text-white">Information we collect</h2>
            <div className="space-y-3">
              <p><span className="text-slate-300 font-medium">Account information.</span>{" "}
                When you sign in with Google, we receive your name and email address from Google&apos;s
                OAuth service. We store these to identify your account.
              </p>
              <p><span className="text-slate-300 font-medium">Card and deck content.</span>{" "}
                Everything you type into Soro Soke — vocabulary cards, deck names, memory hooks, example
                sentences — is stored in our database and associated with your account.
              </p>
              <p><span className="text-slate-300 font-medium">Review history.</span>{" "}
                We store your review grades and scheduling data (intervals, ease factors, review dates)
                so the SM-2 algorithm can schedule future reviews correctly.
              </p>
              <p><span className="text-slate-300 font-medium">Speak Up and Conversation Lab sessions.</span>{" "}
                Session content is processed to generate feedback but is not stored permanently beyond
                the session. Saved session summaries (score, key feedback) are stored when you choose to save them.
              </p>
              <p><span className="text-slate-300 font-medium">Usage data.</span>{" "}
                We may collect anonymised usage information (pages visited, feature usage) to understand
                how the product is used and to improve it. This data is not linked to your identity.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-base font-semibold text-white">How we use your information</h2>
            <ul className="space-y-2 list-disc list-inside marker:text-slate-600">
              <li>To provide and operate the Soro Soke service</li>
              <li>To personalise your review schedule using the SM-2 algorithm</li>
              <li>To generate AI-drafted card content when you request it</li>
              <li>To send optional review reminder notifications (only if you opt in)</li>
              <li>To improve the product based on aggregated, anonymised usage patterns</li>
              <li>To contact you with important service updates (infrequently)</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-base font-semibold text-white">Third-party services</h2>
            <div className="space-y-3">
              <p><span className="text-slate-300 font-medium">Google OAuth.</span>{" "}
                We use Google Sign-In for authentication. When you sign in, Google shares your name
                and email address with us. Google&apos;s privacy policy governs their handling of your data.
              </p>
              <p><span className="text-slate-300 font-medium">AI providers.</span>{" "}
                Card drafting, Speak Up feedback, and Conversation Lab coaching are powered by AI. Text
                you submit for these features is sent to our AI provider for processing. We do not
                authorise providers to use your content to train their models.
              </p>
              <p><span className="text-slate-300 font-medium">Hosting and database.</span>{" "}
                Soro Soke is hosted on infrastructure that stores your data in secure, encrypted databases.
                Data is stored in the European Union or United States, depending on the provider region.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-base font-semibold text-white">Cookies and session data</h2>
            <p>
              We use session cookies to keep you signed in. These are essential for the service to
              function and are not used for tracking or advertising. No third-party tracking cookies
              are set on Soro Soke.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-base font-semibold text-white">Data retention</h2>
            <p>
              We retain your data for as long as your account is active. You can delete your account
              at any time from <strong className="text-slate-300">Settings → Delete account</strong>. Deleting your account permanently
              removes all decks, cards, review history, and profile data from our systems.
              This action cannot be undone.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-base font-semibold text-white">Your rights</h2>
            <p>
              Depending on where you are located, you may have the right to access, correct, export,
              or delete your personal data. To exercise any of these rights, contact us at the address
              below. We will respond within 30 days.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-base font-semibold text-white">Children</h2>
            <p>
              Soro Soke is not directed at children under 13. We do not knowingly collect personal
              information from anyone under 13. If you believe a child has provided us with personal
              information, please contact us and we will delete it promptly.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-base font-semibold text-white">Changes to this policy</h2>
            <p>
              We may update this policy from time to time. When we do, we will update the &quot;last
              updated&quot; date at the top of this page. Continued use of Soro Soke after changes are posted
              constitutes your acceptance of the updated policy.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-base font-semibold text-white">Contact</h2>
            <p>
              Questions about this policy or your data?{" "}
              <Link href="/contact" className="text-emerald-400 hover:text-emerald-300 transition">
                Contact us
              </Link>{" "}
              and we&apos;ll get back to you.
            </p>
          </section>

        </div>
      </main>

      <MarketingFooter />
    </div>
  );
}
