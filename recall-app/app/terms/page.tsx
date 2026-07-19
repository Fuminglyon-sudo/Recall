import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SoroSokeLogo } from "@/components/soro-soke-logo";
import { SoroSokeMark } from "@/components/soro-soke-mark";
import { MarketingFooter } from "@/components/marketing-footer";

export const metadata: Metadata = {
  title: { absolute: "Terms of Service — Sọrọ Sọkẹ AI" },
  description: "The terms that govern your use of Soro Soke.",
  robots: { index: true, follow: true },
};

const LAST_UPDATED = "July 2026";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white antialiased flex flex-col">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-white/8 bg-slate-950/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <Link href="/landing" className="flex items-center gap-2">
            <SoroSokeMark size={30} className="shrink-0" />
            <SoroSokeLogo fontSize="1.9rem" />
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
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl">Terms of Service</h1>
          <p className="text-sm text-slate-500">Last updated: {LAST_UPDATED}</p>
        </div>

        <div className="space-y-12 text-sm leading-7 text-slate-400">

          <section className="space-y-4">
            <h2 className="text-base font-semibold text-white">Acceptance</h2>
            <p>
              By creating an account or using Soro Soke (&quot;the Service&quot;), you agree to these Terms of
              Service. If you do not agree, do not use the Service. These terms form a binding agreement
              between you and Soro Soke.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-base font-semibold text-white">What Soro Soke is</h2>
            <p>
              Soro Soke is a vocabulary and communication-practice tool that uses spaced repetition
              (SM-2 algorithm), AI-assisted card drafting, and speaking/conversation practice features
              including Speak Up and Small Talk Lab. The Service is provided &quot;as is&quot; and is free
              to use during its current beta period.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-base font-semibold text-white">Eligibility</h2>
            <p>
              You must be at least 13 years old to use Soro Soke. By using the Service, you confirm that
              you meet this requirement. If you are under 18, you confirm that you have permission from
              a parent or guardian.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-base font-semibold text-white">Your account</h2>
            <div className="space-y-3">
              <p>
                You are responsible for keeping your account credentials secure. Do not share your
                account with others. You are responsible for all activity that occurs under your account.
              </p>
              <p>
                You may delete your account at any time from Settings. Deletion permanently removes all
                your data and cannot be undone.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-base font-semibold text-white">Your content</h2>
            <p>
              You own the content you create in Soro Soke — your cards, decks, and session data. By using
              the Service, you grant us a limited licence to store and process your content solely to
              provide the Service to you. We do not claim ownership of your content and do not use it
              for any purpose beyond operating the Service.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-base font-semibold text-white">Acceptable use</h2>
            <p>You agree not to:</p>
            <ul className="space-y-2 list-disc list-inside marker:text-slate-600">
              <li>Use the Service for any unlawful purpose</li>
              <li>Attempt to access other users&apos; accounts or data</li>
              <li>Reverse-engineer, scrape, or copy the Service in a way that violates these terms</li>
              <li>Submit content that is abusive, illegal, or violates the rights of others</li>
              <li>Use automated tools to generate excessive load on the Service</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-base font-semibold text-white">AI-generated content</h2>
            <p>
              Soro Soke uses AI to draft card definitions, memory hooks, and session feedback. AI-generated
              content is provided as a starting point and may contain errors. You are responsible for
              reviewing and editing content before relying on it. We make no guarantees about the
              accuracy or completeness of AI-generated output.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-base font-semibold text-white">Service availability</h2>
            <p>
              We aim to keep Soro Soke available at all times but cannot guarantee uninterrupted access.
              We may pause or modify the Service for maintenance, security reasons, or operational
              changes without prior notice. We are not liable for any loss resulting from downtime.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-base font-semibold text-white">Pricing and billing</h2>
            <p>
              Soro Soke is currently free to use. We may introduce a paid Pro tier in the future. If we do,
              we will give reasonable advance notice and existing users will have the opportunity to
              continue using a free tier or subscribe to the paid plan. We will never charge you without
              explicit consent.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-base font-semibold text-white">Disclaimer of warranties</h2>
            <p>
              The Service is provided &quot;as is&quot; without any warranties, express or implied, including but
              not limited to warranties of merchantability, fitness for a particular purpose, or
              non-infringement. We do not warrant that the Service will be error-free or that
              AI-generated content will be accurate.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-base font-semibold text-white">Limitation of liability</h2>
            <p>
              To the maximum extent permitted by law, Soro Soke shall not be liable for any indirect,
              incidental, special, consequential, or punitive damages arising from your use of the
              Service, even if we have been advised of the possibility of such damages. Our total
              liability to you for any claim shall not exceed the amount you paid to use the Service
              in the 12 months preceding the claim, or £50, whichever is greater.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-base font-semibold text-white">Privacy</h2>
            <p>
              Your use of the Service is also governed by our{" "}
              <Link href="/privacy" className="text-emerald-400 hover:text-emerald-300 transition">
                Privacy Policy
              </Link>
              , which is incorporated into these terms by reference.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-base font-semibold text-white">Changes to these terms</h2>
            <p>
              We may update these terms from time to time. We will notify you of material changes by
              updating the &quot;last updated&quot; date and, where appropriate, by sending an email. Continued
              use of the Service after changes take effect constitutes acceptance of the updated terms.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-base font-semibold text-white">Termination</h2>
            <p>
              You may stop using the Service and delete your account at any time. We may suspend or
              terminate your access if you violate these terms, with or without notice. Upon
              termination, your right to use the Service ceases immediately.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-base font-semibold text-white">Contact</h2>
            <p>
              Questions about these terms?{" "}
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
