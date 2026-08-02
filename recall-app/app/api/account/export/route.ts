import { NextResponse } from "next/server";
import { getCurrentUserId, ADMIN_USER_ID } from "@/lib/session";
import { checkRateLimit } from "@/lib/rate-limit";
import { exportUserData } from "@/lib/user-data-export";

// GDPR Art. 15/20 — authenticated, self-serve export of everything Soro
// Soke holds about the signed-in account. Admin is excluded: the env-var
// admin login isn't a personal account tied to an identifiable person in
// the data-subject-rights sense, matching how account deletion already
// blocks admin in app/settings/actions.ts.
export async function GET() {
  const userId = await getCurrentUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  if (userId === ADMIN_USER_ID) {
    return NextResponse.json({ error: "Data export isn't available for the admin account." }, { status: 403 });
  }
  if (!checkRateLimit("account-export", userId, 5)) {
    return NextResponse.json({ error: "Too many requests. Slow down and try again." }, { status: 429 });
  }

  try {
    const data = await exportUserData(userId);
    return new NextResponse(JSON.stringify(data, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="soro-soke-data-export-${new Date().toISOString().slice(0, 10)}.json"`,
      },
    });
  } catch (err) {
    console.error("[account-export]", err);
    return NextResponse.json({ error: "Failed to generate export. Try again." }, { status: 500 });
  }
}
