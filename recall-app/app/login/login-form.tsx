"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { loginAction } from "./actions";

export function LoginForm({ error, from }: { error: boolean; from: string }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
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
          <div className="relative">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              className="input-base pr-10"
              placeholder="Enter password"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute inset-y-0 right-3 flex items-center text-slate-500 transition hover:text-slate-300"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </label>
        <button
          type="submit"
          className="w-full rounded-2xl bg-emerald-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300 active:scale-95"
        >
          Sign in
        </button>
      </form>
    </div>
  );
}
