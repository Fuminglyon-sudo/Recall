import { Resend } from "resend";

// No-ops (with a console warning) when RESEND_API_KEY isn't set, so local
// dev and any environment without email configured never breaks — same
// "never throw, log and move on" contract as awardStreakAchievements.
let client: Resend | null = null;
function getClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  if (!client) client = new Resend(apiKey);
  return client;
}

const FROM = process.env.EMAIL_FROM ?? "Sọrọ Sọkẹ AI <onboarding@resend.dev>";

export async function sendEmail({ to, subject, html, text }: { to: string; subject: string; html: string; text: string }): Promise<void> {
  const resend = getClient();
  if (!resend) {
    console.warn(`RESEND_API_KEY not set — skipped email "${subject}" to ${to}`);
    return;
  }
  try {
    await resend.emails.send({ from: FROM, to, subject, html, text });
  } catch (err) {
    console.error("EMAIL_SEND_FAILED", { to, subject, err });
  }
}
