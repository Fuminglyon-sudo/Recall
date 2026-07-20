import type { Metadata } from "next";
import { LoginForm } from "./login-form";
import { GoogleSignInButton } from "./google-button";
import { SoroSokeLogo } from "@/components/soro-soke-logo";
import { SoroSokeMark } from "@/components/soro-soke-mark";
import { ThemeToggle } from "@/components/theme-toggle";

export const metadata: Metadata = {
  title: { absolute: "Sign In — Sọrọ Sọkẹ AI" },
  description: "Sign in to your Soro Soke account to continue your vocabulary practice and speaking sessions.",
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const params = await searchParams;
  const errorCode = params.error;
  const banned = params.banned === "1";
  const from = params.from ?? "/";

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <ThemeToggle className="absolute top-4 right-4 rounded-xl p-2 text-slate-500 transition hover:text-slate-300" />
      <div className="w-full max-w-sm">
        {/* Back link */}
        <div className="mb-6 text-center">
          <a href="/landing" className="text-xs text-slate-600 transition hover:text-slate-400">
            ← Back to Soro Soke
          </a>
        </div>
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <SoroSokeMark size={34} className="shrink-0" />
            <SoroSokeLogo fontSize="2.2rem" />
          </div>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white">Welcome</h1>
          <p className="mt-1 text-sm text-slate-400">Sign in to continue your practice.</p>
        </div>

        <div className="space-y-4">
          {banned && (
            <div className="rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
              This account can&apos;t sign in. Contact support if you think that&apos;s a mistake.
            </div>
          )}

          {/* Primary: Google OAuth */}
          <GoogleSignInButton from={from} />

          <p className="text-center text-xs text-slate-500">
            Your progress stays yours — each account is completely separate.
          </p>

          {/* Secondary: Admin login (collapsed) */}
          <details className="group">
            <summary className="flex cursor-pointer items-center justify-center gap-1.5 text-xs text-slate-600 hover:text-slate-400 transition list-none">
              <span>Admin login</span>
              <svg className="h-3 w-3 transition group-open:rotate-180" viewBox="0 0 12 12" fill="none">
                <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </summary>

            <div className="mt-3 overflow-hidden rounded-3xl border border-white/8 bg-white/[0.03] p-5 backdrop-blur">
              {errorCode === "1" && (
                <div className="mb-4 rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
                  Incorrect username or password.
                </div>
              )}
              {errorCode === "rate" && (
                <div className="mb-4 rounded-2xl border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-sm text-amber-200">
                  Too many attempts. Please wait 15 minutes before trying again.
                </div>
              )}
              <LoginForm from={from} />
            </div>
          </details>
        </div>
      </div>
    </div>
  );
}
