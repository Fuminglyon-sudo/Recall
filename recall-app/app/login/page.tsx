import { LoginForm } from "./login-form";

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
        <LoginForm error={error} from={from} />
      </div>
    </div>
  );
}
