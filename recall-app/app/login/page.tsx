import { LoginForm } from "./login-form";
import { GoogleSignInButton } from "./google-button";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const params = await searchParams;
  const error = params.error === "1";
  const from = params.from ?? "/";

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="mb-8 text-center">
          <p className="text-4xl mb-3">🧠</p>
          <p className="text-sm font-medium text-emerald-300">Recall</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white">Welcome</h1>
          <p className="mt-1 text-sm text-slate-400">Sign in to access your cards.</p>
        </div>

        <div className="space-y-4">
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
              {error && (
                <div className="mb-4 rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
                  Incorrect username or password.
                </div>
              )}
              <LoginForm error={error} from={from} />
            </div>
          </details>
        </div>
      </div>
    </div>
  );
}
