import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SoroSokeLogo } from "@/components/soro-soke-logo";
import { SoroSokeMark } from "@/components/soro-soke-mark";
import { MarketingFooter } from "@/components/marketing-footer";
import { CookieSettingsButton } from "@/components/cookie-settings-button";

export const metadata: Metadata = {
  title: { absolute: "Privacy Policy — Sọrọ Sọkẹ AI" },
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
          <h1 className="text-3xl font-extrabold text-white sm:text-4xl">Privacy Policy</h1>
          <p className="text-sm text-slate-500">Last updated: {LAST_UPDATED}</p>
        </div>

        <div className="space-y-12 text-sm leading-7 text-slate-400">

          <section className="space-y-4">
            <h2 className="text-base font-semibold text-white">Who we are</h2>
            <p>
              Soro Soke is built and operated by{" "}
              <span className="text-slate-300 font-medium">Japa Reality Technologies Inc.</span>{" "}
              (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;), a Canadian company and part of the{" "}
              <a href="https://fuminglyonnetwork.com" target="_blank" rel="noopener noreferrer" className="text-emerald-300 hover:underline">
                FumingLyon Network
              </a>{" "}
              group. For the purposes of data protection law, including the EU and UK General Data
              Protection Regulation (GDPR), Japa Reality Technologies Inc. is the data controller for
              personal data processed through Soro Soke.
            </p>
            <p>
              You can reach us about privacy at{" "}
              <a href="mailto:japareality@fuminglyonnetwork.com" className="text-emerald-300 hover:underline">
                japareality@fuminglyonnetwork.com
              </a>. We do not sell your data — ever.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-base font-semibold text-white">What we collect</h2>
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
              <p><span className="text-slate-300 font-medium">Speak Up, Small Talk Lab, and Debate Lab sessions.</span>{" "}
                Session content is processed to generate feedback but is not stored permanently beyond
                the session unless you choose to save a summary (score, key feedback, transcript).
              </p>
              <p><span className="text-slate-300 font-medium">Doc Lab documents.</span>{" "}
                Documents you paste into Doc Lab are <span className="text-slate-300 font-medium">never stored</span>.
                The text is sent to our AI provider to generate the analysis and is then discarded — it is not written
                to our database and we keep no copy of it. What we do save is the resulting feedback, the notes you
                write yourself, and the document&apos;s title, so that your session history and progress over time
                still work. This means you can paste confidential work material — board papers, specs, internal
                strategy memos — without it being retained by us.
              </p>
              <p><span className="text-slate-300 font-medium">Usage data.</span>{" "}
                Where you&apos;ve consented (see &quot;Cookies&quot; below), we collect anonymised usage information
                (pages visited, feature usage) via Google Analytics to understand how the product is used.
              </p>
              <p><span className="text-slate-300 font-medium">Approximate location.</span>{" "}
                On each visit, we record a coarse location (country, region, and city) resolved by our
                hosting provider from the request — never the IP address itself. This is used only in
                aggregate, to understand which regions visitors come from, and is not linked to your
                identity or account.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-base font-semibold text-white">Legal basis for processing (GDPR Art. 6)</h2>
            <p>Where GDPR applies, we rely on the following legal bases:</p>
            <ul className="space-y-2 list-disc list-inside marker:text-slate-600">
              <li><span className="text-slate-300 font-medium">Performance of a contract (Art. 6(1)(b))</span> — creating your account, storing your cards and sessions, and running the core spaced-repetition and practice features you sign up for.</li>
              <li><span className="text-slate-300 font-medium">Consent (Art. 6(1)(a))</span> — Google Analytics cookies, and push notifications if you opt in. You can withdraw consent at any time (see &quot;Cookies&quot; below).</li>
              <li><span className="text-slate-300 font-medium">Legitimate interests (Art. 6(1)(f))</span> — securing the service against abuse (rate limiting, blocking banned accounts) and understanding aggregate, privacy-preserving usage patterns like approximate visitor location, balanced against your right to privacy.</li>
              <li><span className="text-slate-300 font-medium">Legal obligation (Art. 6(1)(c))</span> — where we&apos;re required to retain or disclose information to comply with applicable law.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-base font-semibold text-white">How we use your information</h2>
            <ul className="space-y-2 list-disc list-inside marker:text-slate-600">
              <li>To provide and operate the Soro Soke service</li>
              <li>To personalise your review schedule using the SM-2 algorithm</li>
              <li>To generate AI-drafted card content and practice feedback when you request it</li>
              <li>To send optional review reminder notifications (only if you opt in)</li>
              <li>To improve the product based on aggregated, anonymised usage patterns</li>
              <li>To contact you with important service updates (infrequently)</li>
              <li>To secure the service and prevent abuse</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-base font-semibold text-white">Cookies</h2>
            <p>
              We use session cookies to keep you signed in — these are strictly necessary and can&apos;t be
              switched off, since the service can&apos;t function without them. Everything else — currently
              just Google Analytics — only runs if you consent. We use{" "}
              <a href="https://developers.google.com/tag-platform/security/guides/consent" target="_blank" rel="noopener noreferrer" className="text-emerald-300 hover:underline">
                Google Consent Mode
              </a>, which defaults every visitor&apos;s analytics storage to <em>denied</em> until you actively
              choose otherwise in the banner, and keeps ad-related signals denied permanently — Soro Soke
              doesn&apos;t run ads.
            </p>
            <p>
              You can change your choice at any time — this isn&apos;t a one-time decision:
            </p>
            <CookieSettingsButton />
          </section>

          <section className="space-y-4">
            <h2 className="text-base font-semibold text-white">Third parties and sub-processors</h2>
            <div className="space-y-3">
              <p><span className="text-slate-300 font-medium">Google.</span>{" "}
                Used for OAuth sign-in and, where consented, Google Analytics. Google&apos;s privacy policy
                governs their handling of the data shared with them.
              </p>
              <p><span className="text-slate-300 font-medium">Anthropic.</span>{" "}
                Powers AI card drafting, and Speak Up, Small Talk Lab, Debate Lab, and Doc Lab feedback.
                Text you submit for these features is sent to Anthropic for processing. We do not
                authorise Anthropic to use your content to train their models.
              </p>
              <p><span className="text-slate-300 font-medium">Groq.</span>{" "}
                Powers optional voice transcription in Doc Lab, if you use the microphone input.
              </p>
              <p><span className="text-slate-300 font-medium">Supabase.</span>{" "}
                Hosts our primary database, where your account and content data is stored.
              </p>
              <p><span className="text-slate-300 font-medium">Vercel.</span>{" "}
                Hosts and runs the Soro Soke application itself.
              </p>
              <p><span className="text-slate-300 font-medium">Resend.</span>{" "}
                Sends transactional emails (welcome emails, service notices) on our behalf.
              </p>
              <p>
                Each of these providers processes data only as needed to deliver their part of the
                service, under contractual terms consistent with this policy.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-base font-semibold text-white">International data transfers</h2>
            <p>
              Japa Reality Technologies Inc. is based in Canada, and the sub-processors listed above run
              infrastructure in the European Union, the United Kingdom, the United States, and Canada.
              Where personal data is transferred out of the EEA or UK to a country not covered by an
              adequacy decision — such as the United States — we rely on the European Commission&apos;s
              Standard Contractual Clauses (SCCs) and, for transfers from the UK, the UK International
              Data Transfer Addendum to the SCCs, as implemented through our agreements with each
              sub-processor.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-base font-semibold text-white">Data retention</h2>
            <div className="space-y-3">
              <p><span className="text-slate-300 font-medium">Account and content data.</span>{" "}
                Retained for as long as your account is active. You can delete your account at any time
                from <Link href="/settings" className="text-emerald-300 hover:underline">Settings → Delete account</Link>,
                which permanently removes all decks, cards, review history, session records, and profile
                data. This action cannot be undone.
              </p>
              <p><span className="text-slate-300 font-medium">Doc Lab document text.</span>{" "}
                Not retained at all — discarded immediately after analysis, as described above.
              </p>
              <p><span className="text-slate-300 font-medium">Approximate location data.</span>{" "}
                Retained only in aggregate form and never linked to your identity or account.
              </p>
              <p><span className="text-slate-300 font-medium">Support correspondence.</span>{" "}
                Retained for as long as needed to resolve your enquiry, and for a reasonable period
                afterward for our own record-keeping.
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-base font-semibold text-white">Your rights</h2>
            <p>Depending on where you live, data protection law gives you the right to:</p>
            <ul className="space-y-2 list-disc list-inside marker:text-slate-600">
              <li><span className="text-slate-300 font-medium">Access</span> the personal data we hold about you</li>
              <li><span className="text-slate-300 font-medium">Rectify</span> inaccurate or incomplete data</li>
              <li><span className="text-slate-300 font-medium">Erasure</span> — delete your data (self-serve from Settings, or by contacting us)</li>
              <li><span className="text-slate-300 font-medium">Portability</span> — receive your data in a portable format</li>
              <li><span className="text-slate-300 font-medium">Restriction</span> of how we process your data in certain circumstances</li>
              <li><span className="text-slate-300 font-medium">Object</span> to processing based on legitimate interests</li>
              <li><span className="text-slate-300 font-medium">Withdraw consent</span> at any time, without affecting processing before the withdrawal (see &quot;Cookies&quot; above)</li>
              <li><span className="text-slate-300 font-medium">Lodge a complaint</span> with your local data protection supervisory authority — for example, the ICO in the UK, your national authority in the EU, or the Office of the Privacy Commissioner of Canada</li>
            </ul>
            <p>
              You can access and export your account data at any time from{" "}
              <Link href="/settings" className="text-emerald-300 hover:underline">Settings → Download my data</Link>.
              For anything else, contact us at{" "}
              <a href="mailto:japareality@fuminglyonnetwork.com" className="text-emerald-300 hover:underline">
                japareality@fuminglyonnetwork.com
              </a>. We will respond within 30 days.
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
              Questions about this policy or your data? Email{" "}
              <a href="mailto:japareality@fuminglyonnetwork.com" className="text-emerald-400 hover:text-emerald-300 transition">
                japareality@fuminglyonnetwork.com
              </a>{" "}
              or{" "}
              <Link href="/contact" className="text-emerald-400 hover:text-emerald-300 transition">
                use our contact form
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
