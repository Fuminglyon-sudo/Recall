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
        <div className="mb-8 text-center">
          <p className="text-4xl mb-3">🧠</p>
          <p className="text-sm font-medium text-emerald-300">Recall</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white">Welcome</h1>
          <p className="mt-1 text-sm text-slate-400">Sign in to access your cards.</p>
        </div>

        <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur space-y-4">
          {/* Google OAuth — primary path for all users */}
          <GoogleSignInButton from={from} />

          {/* Admin divider */}
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-white/8" />
            <span className="text-[10px] uppercase tracking-widest text-slate-600">or admin</span>
            <div className="h-px flex-1 bg-white/8" />
          </div>

          {/* Admin env-var login — unchanged */}
          <LoginForm error={error} from={from} />
        </div>
      </div>
    </div>
  );
}
