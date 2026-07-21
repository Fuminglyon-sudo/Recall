import { Sidebar } from "./sidebar";
import { TzSync } from "./tz-sync";
import { isAdmin } from "@/lib/session";
import { auth } from "@/lib/next-auth";

export async function AppShell({ children }: { children: React.ReactNode }) {
  const admin = await isAdmin();
  const session = await auth();

  // For admin login (HMAC cookie) there is no NextAuth session, so fall back to "Admin".
  // For Google OAuth users, show their display name or email.
  const userLabel = admin
    ? "Admin"
    : (session?.user?.name ?? session?.user?.email ?? null);

  return (
    <div className="min-h-screen bg-slate-950">
      <TzSync />
      <Sidebar isAdmin={admin} userLabel={userLabel} />
      {/* Offset for desktop sidebar width; offset for mobile top bar height */}
      <main className="pt-14 lg:pl-60 lg:pt-0">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}
