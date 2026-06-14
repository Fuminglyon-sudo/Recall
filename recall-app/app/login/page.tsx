import { loginAction } from "./actions";

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
          <p className="text-sm font-medium text-emerald-300">Recall</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white">Welcome back</h1>
          <p className="mt-1 text-sm text-slate-400">Sign in to access your cards.</p>
        </div>

        <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
          {error && (
            <div className="mb-4 rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
              Incorrect username or password.
            </div>
          )}
          <form action={loginAction} className="space-y-4">
            <input type="hidden" name="from" value={from} />
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-200">Username</span>
              <input
                name="username"
                type="text"
                autoComplete="username"
                required
                className="input-base"
                placeholder="Enter username"
              />
            </label>
            <label className="block space-y-2">
              <span className="text-sm font-medium text-slate-200">Password</span>
              <input
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="input-base"
                placeholder="Enter password"
              />
            </label>
            <button
              type="submit"
              className="w-full rounded-2xl bg-emerald-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300 active:scale-95"
            >
              Sign in
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
