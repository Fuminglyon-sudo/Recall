// Welcome-email HTML. Inline styles throughout — most email clients strip
// <style> blocks, and Georgia/system-ui are used because they're the only
// faces reliably available without an embedded font (no @font-face support
// in most inboxes).

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sorosokeai.com";

type WelcomeEmailInput = { name: string | null };
type Email = { subject: string; html: string };

function shell(preheader: string, bodyHtml: string): string {
  return `<!doctype html>
<html>
  <body style="margin:0; padding:0; background:#f3f6f4; font-family:-apple-system,'Segoe UI',sans-serif;">
    <span style="display:none; font-size:1px; color:#f3f6f4; line-height:1px; max-height:0; max-width:0; opacity:0; overflow:hidden;">${preheader}</span>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3f6f4; padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px; background:#ffffff; border-radius:20px; overflow:hidden; border:1px solid #e4ebe6;">
            <tr>
              <td style="padding:32px 36px 8px;">
                <span style="font-family:Georgia,'Times New Roman',serif; font-style:italic; font-size:20px; color:#0a1512;">🥁 Sọ́rọ́ Sọ́kẹ́</span>
              </td>
            </tr>
            <tr>
              <td style="padding:8px 36px 36px; color:#0f172a; font-size:15px; line-height:1.65;">
                ${bodyHtml}
              </td>
            </tr>
          </table>
          <p style="margin:20px 0 0; font-size:12px; color:#8a9a92;">Sọrọ Sọkẹ AI · <a href="${SITE_URL}" style="color:#8a9a92;">${SITE_URL.replace(/^https?:\/\//, "")}</a></p>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function button(label: string, href: string): string {
  return `<a href="${href}" style="display:inline-block; margin:20px 0 4px; padding:13px 26px; background:#059669; color:#ffffff; font-weight:600; font-size:14px; text-decoration:none; border-radius:12px;">${label}</a>`;
}

function stepsList(): string {
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%; margin:20px 0;">
      <tr>
        <td style="padding:10px 0; border-top:1px solid #eef2f0;">
          <strong style="color:#0f172a;">1. Add your first word</strong><br>
          <span style="color:#64748b; font-size:14px;">Type any word — AI drafts the definition, hook, and example. You edit and save.</span>
        </td>
      </tr>
      <tr>
        <td style="padding:10px 0; border-top:1px solid #eef2f0;">
          <strong style="color:#0f172a;">2. Review it</strong><br>
          <span style="color:#64748b; font-size:14px;">Spaced repetition brings it back right before you'd forget it. Under a minute a day.</span>
        </td>
      </tr>
      <tr>
        <td style="padding:10px 0; border-top:1px solid #eef2f0; border-bottom:1px solid #eef2f0;">
          <strong style="color:#0f172a;">3. Try a practice mode</strong><br>
          <span style="color:#64748b; font-size:14px;">Speak Up, Small Talk Lab, or Debate Lab — say it out loud, get honest feedback.</span>
        </td>
      </tr>
    </table>`;
}

function firstName(name: string | null): string {
  return name?.trim() ? name.trim().split(" ")[0] : "there";
}

export function welcomeEmail({ name }: WelcomeEmailInput): Email {
  const subject = "Welcome to Sọrọ Sọkẹ AI — here's where to start";
  const body = `
    <p style="margin:0 0 14px; font-size:17px; font-weight:600;">Hi ${firstName(name)},</p>
    <p style="margin:0 0 14px;">You're in. Sọrọ Sọkẹ AI pairs spaced-repetition vocabulary with three ways to actually use it out loud — Speak Up, Small Talk Lab, and Debate Lab.</p>
    <p style="margin:0;">Here's the fastest way in:</p>
    ${stepsList()}
    <p style="margin:0 0 4px;">You've got full access with a 14-day free trial — no card required.</p>
    ${button("Open your dashboard", SITE_URL)}
    <p style="margin:24px 0 0; font-size:13px; color:#94a3ab;">Questions? Just reply to this email.</p>
  `;
  return { subject, html: shell(subject, body) };
}

export function founderWelcomeEmail({ name }: WelcomeEmailInput): Email {
  const subject = "🎉 You're one of the first 50 — welcome to Sọrọ Sọkẹ AI";
  const body = `
    <p style="margin:0 0 14px; font-size:17px; font-weight:600;">Hi ${firstName(name)},</p>
    <p style="margin:0 0 14px;">You just claimed one of the first 50 founder spots — full access to Sọrọ Sọkẹ AI, <strong>free, forever</strong>. No trial countdown, no card on file, nothing to remember to cancel.</p>
    <p style="margin:0;">Here's the fastest way in:</p>
    ${stepsList()}
    ${button("Open your dashboard", SITE_URL)}
    <p style="margin:24px 0 0; font-size:13px; color:#94a3ab;">Welcome aboard — you're one of the first fifty. Questions? Just reply to this email.</p>
  `;
  return { subject, html: shell(subject, body) };
}
