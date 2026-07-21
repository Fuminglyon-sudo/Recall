// Welcome-email HTML. Inline styles throughout — most email clients strip
// <style> blocks, and Georgia/system-ui are used because they're the only
// faces reliably available without an embedded font (no @font-face support
// in most inboxes). The logo is a hosted <img>, not inline SVG — Outlook
// desktop's rendering engine doesn't support inline SVG reliably.

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sorosokeai.com";
const LOGO_URL = `${SITE_URL}/brand/app-icon-192.png`;

type WelcomeEmailInput = { name: string | null };
type Email = { subject: string; html: string; text: string };

// Priscilla's own story — why the three practice modes exist, in her words.
// Shared by both templates: the reason doesn't change based on which plan
// someone lands on.
const FOUNDER_NOTE_HTML = `
    <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%; margin:4px 0 22px; background:#f7faf8; border-radius:14px; border-left:3px solid #059669;">
      <tr>
        <td style="padding:16px 20px; font-size:14px; line-height:1.7; color:#334155;">
          A quick word from me — I'm Priscilla, and I built Sọrọ Sọkẹ AI out of a habit I couldn't shake. I'd rehearse the big moments entirely in my head — the interview answer, the pitch, the hard conversation — run it until I felt completely ready, then walk into the actual room and watch it fall apart anyway. Thinking it through and saying it out loud turned out to be two different skills, and I only ever found that out too late to fix in the moment. Speak Up, Small Talk Lab, and Debate Lab exist so you find that gap here, in private, instead of there.
        </td>
      </tr>
    </table>`;

const FOUNDER_NOTE_TEXT = `A quick word from me — I'm Priscilla, and I built Sọrọ Sọkẹ AI out of a habit I couldn't shake. I'd rehearse the big moments entirely in my head — the interview answer, the pitch, the hard conversation — run it until I felt completely ready, then walk into the actual room and watch it fall apart anyway. Thinking it through and saying it out loud turned out to be two different skills, and I only ever found that out too late to fix in the moment. Speak Up, Small Talk Lab, and Debate Lab exist so you find that gap here, in private, instead of there.`;

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
              <td style="padding:28px 36px 8px;">
                <table role="presentation" cellpadding="0" cellspacing="0"><tr>
                  <td style="padding-right:14px; vertical-align:middle;">
                    <img src="${LOGO_URL}" width="48" height="48" alt="Sọrọ Sọkẹ" style="display:block; border-radius:11px;">
                  </td>
                  <td style="vertical-align:middle;">
                    <span style="font-family:Georgia,'Times New Roman',serif; font-style:italic; font-size:23px; color:#0a1512;">Sọ́rọ́ Sọ́kẹ́</span>
                  </td>
                </tr></table>
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

// Leads with the three differentiators — the point of the product, not the
// mechanics of it. Capturing words comes last, reframed as what you bring
// back FROM those sessions rather than a prerequisite before you can use
// them — closes the loop instead of gating it.
function stepsList(): string {
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%; margin:20px 0;">
      <tr>
        <td style="padding:10px 0; border-top:1px solid #eef2f0;">
          <strong style="color:#0f172a;">Speak Up</strong><br>
          <span style="color:#64748b; font-size:14px;">Rehearse the room before you're in it — the interview, the raise, the pitch. Say it out loud, get honest feedback, try again.</span>
        </td>
      </tr>
      <tr>
        <td style="padding:10px 0; border-top:1px solid #eef2f0;">
          <strong style="color:#0f172a;">Small Talk Lab</strong><br>
          <span style="color:#64748b; font-size:14px;">Practice the awkward part first — ten real social scenarios, no script, just coaching on what to try next time.</span>
        </td>
      </tr>
      <tr>
        <td style="padding:10px 0; border-top:1px solid #eef2f0;">
          <strong style="color:#0f172a;">Debate Lab</strong><br>
          <span style="color:#64748b; font-size:14px;">Hold your ground before you need to — argue it out against an AI that actually pushes back.</span>
        </td>
      </tr>
      <tr>
        <td style="padding:10px 0; border-top:1px solid #eef2f0; border-bottom:1px solid #eef2f0;">
          <strong style="color:#0f172a;">Keep what you learn</strong><br>
          <span style="color:#64748b; font-size:14px;">A word from Speak Up, an opener from Small Talk Lab, an argument from Debate Lab — turn it into a card, and spaced repetition keeps it coming back.</span>
        </td>
      </tr>
    </table>`;
}

const STEPS_TEXT = [
  "Speak Up — rehearse the room before you're in it. Say it out loud, get honest feedback, try again.",
  "Small Talk Lab — practice the awkward part first, with coaching on what to try next time.",
  "Debate Lab — hold your ground before you need to, against an AI that actually pushes back.",
  "Keep what you learn — a word from Speak Up, an opener from Small Talk Lab, an argument from Debate Lab. Turn it into a card, and spaced repetition keeps it coming back.",
].map((s, i) => `${i + 1}. ${s}`).join("\n");

function firstName(name: string | null): string {
  return name?.trim() ? name.trim().split(" ")[0] : "there";
}

export function welcomeEmail({ name }: WelcomeEmailInput): Email {
  const subject = "Welcome to Sọrọ Sọkẹ AI — here's where to start";
  const body = `
    <p style="margin:0 0 14px; font-size:17px; font-weight:600;">Hi ${firstName(name)},</p>
    <p style="margin:0 0 18px;">You're in.</p>
    ${FOUNDER_NOTE_HTML}
    <p style="margin:0;">Here's the fastest way in:</p>
    ${stepsList()}
    <p style="margin:0 0 4px;">You've got full access with a 14-day free trial — no card required.</p>
    ${button("Open your dashboard", SITE_URL)}
    <p style="margin:24px 0 0; font-size:13px; color:#94a3ab;">— Priscilla, founder<br>Questions? Just reply — I read these myself.</p>
  `;
  const text = `Hi ${firstName(name)},

You're in.

${FOUNDER_NOTE_TEXT}

Here's the fastest way in:
${STEPS_TEXT}

You've got full access with a 14-day free trial — no card required.

Open your dashboard: ${SITE_URL}

— Priscilla, founder
Questions? Just reply — I read these myself.`;
  return { subject, html: shell(subject, body), text };
}

export function founderWelcomeEmail({ name }: WelcomeEmailInput): Email {
  const subject = "🎉 You're one of the first 50 — welcome to Sọrọ Sọkẹ AI";
  const body = `
    <p style="margin:0 0 14px; font-size:17px; font-weight:600;">Hi ${firstName(name)},</p>
    <p style="margin:0 0 18px;">You just claimed one of the first 50 founder spots — full access to Sọrọ Sọkẹ AI, <strong>free, forever</strong>. No trial countdown, no card on file, nothing to remember to cancel.</p>
    ${FOUNDER_NOTE_HTML}
    <p style="margin:0;">Here's the fastest way in:</p>
    ${stepsList()}
    ${button("Open your dashboard", SITE_URL)}
    <p style="margin:24px 0 0; font-size:13px; color:#94a3ab;">— Priscilla, founder<br>Welcome aboard — you're one of the first fifty. Questions? Just reply — I read these myself.</p>
  `;
  const text = `Hi ${firstName(name)},

You just claimed one of the first 50 founder spots — full access to Sọrọ Sọkẹ AI, free, forever. No trial countdown, no card on file, nothing to remember to cancel.

${FOUNDER_NOTE_TEXT}

Here's the fastest way in:
${STEPS_TEXT}

Open your dashboard: ${SITE_URL}

— Priscilla, founder
Welcome aboard — you're one of the first fifty. Questions? Just reply — I read these myself.`;
  return { subject, html: shell(subject, body), text };
}
