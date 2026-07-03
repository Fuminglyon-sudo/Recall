import { AppShell } from "@/components/app-shell";
import { getCurrentUserId, ADMIN_USER_ID, scopedUserId } from "@/lib/session";
import { auth } from "@/lib/next-auth";
import { prisma } from "@/lib/prisma";
import { DeleteAccountForm } from "./delete-form";
import { SubmitButton } from "@/components/forms";
import { updateDailyCardLimit } from "./actions";
import { Settings } from "lucide-react";

export const metadata = {
  title: "Settings — Summon",
};

export default async function SettingsPage() {
  const userId = await getCurrentUserId();
  const isAdminUser = userId === ADMIN_USER_ID;

  const session = isAdminUser ? null : await auth();
  const email = session?.user?.email ?? "";
  const name = session?.user?.name ?? email;

  const uid = userId && !isAdminUser ? scopedUserId(userId) : null;
  const userSettings = uid ? await prisma.userSettings.findFirst({ where: { userId: uid } }) : null;
  const currentDailyNewCards = userSettings?.dailyNewCards ?? 3;

  return (
    <AppShell>
      <section className="max-w-xl space-y-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-slate-400" />
            <h1 className="text-2xl font-semibold text-white">Settings</h1>
          </div>
          <p className="text-sm text-slate-400">Your account, your data.</p>
        </div>

        {/* Account info */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 space-y-4">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Account</p>
          {isAdminUser ? (
            <div className="space-y-2">
              <p className="text-sm font-medium text-white">Admin</p>
              <p className="text-xs leading-5 text-slate-400">
                Admin credentials are managed through environment variables. There is no password to change here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="space-y-0.5">
                <p className="text-xs text-slate-500">Name</p>
                <p className="text-sm font-medium text-white">{name || "—"}</p>
              </div>
              <div className="space-y-0.5">
                <p className="text-xs text-slate-500">Email</p>
                <p className="text-sm font-medium text-white">{email || "—"}</p>
              </div>
              <div className="rounded-2xl border border-white/8 bg-white/5 px-4 py-3">
                <p className="text-xs leading-5 text-slate-400">
                  You signed in with Google. Passwords are managed by Google — visit your{" "}
                  <a
                    href="https://myaccount.google.com/security"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-300 underline underline-offset-2 hover:text-emerald-200"
                  >
                    Google account security settings
                  </a>{" "}
                  to change your password.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Review settings — non-admin only */}
        {!isAdminUser ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 space-y-4">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Daily review</p>
            <div>
              <p className="text-sm font-medium text-white">New cards per day</p>
              <p className="mt-1 text-xs leading-5 text-slate-400">
                Summon introduces this many brand-new cards each day. Reviews of cards you already know are always shown in full. Default is 3.
              </p>
            </div>
            <form action={updateDailyCardLimit} className="flex items-end gap-4">
              <label className="block space-y-2 flex-1 max-w-[8rem]">
                <span className="text-xs font-medium text-slate-300">Cards per day</span>
                <input
                  name="dailyNewCards"
                  type="number"
                  min={1}
                  max={50}
                  defaultValue={currentDailyNewCards}
                  className="input-base"
                  required
                />
              </label>
              <SubmitButton label="Save" pendingLabel="Saving…" />
            </form>
          </div>
        ) : null}

        {/* Danger zone — Google users only */}
        {!isAdminUser && email ? (
          <DeleteAccountForm email={email} />
        ) : null}
      </section>
    </AppShell>
  );
}
