"use client";

import { useActionState } from "react";
import { deleteAccount } from "./actions";

export function DeleteAccountForm({ email }: { email: string }) {
  const [state, formAction, pending] = useActionState(deleteAccount, null);

  return (
    <div className="rounded-3xl border border-red-400/20 bg-red-400/5 p-6 space-y-4">
      <div>
        <p className="text-sm font-semibold text-red-300">Delete account</p>
        <p className="mt-1 text-xs leading-5 text-slate-400">
          This permanently deletes your account, all decks, cards, and review history. There is no undo.
        </p>
      </div>
      <form action={formAction} className="space-y-3">
        <div className="space-y-1.5">
          <label className="block text-xs text-slate-400">
            Type your email address to confirm
          </label>
          <input
            name="email"
            type="email"
            placeholder={email}
            autoComplete="off"
            required
            className="input-base text-sm"
          />
        </div>
        {state?.error ? (
          <p className="text-xs text-red-400">{state.error}</p>
        ) : null}
        <button
          type="submit"
          disabled={pending}
          className="rounded-2xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Deleting…" : "Permanently delete my account"}
        </button>
      </form>
    </div>
  );
}
