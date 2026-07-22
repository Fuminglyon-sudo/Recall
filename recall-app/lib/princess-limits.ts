// Shared limits for the Princess homepage chat.
//
// These live together because they are coupled, and the coupling is easy to
// break: the API validates every message in the history it receives — including
// Princess's OWN previous replies — so the assistant cap must always exceed the
// longest reply `chatWithPrincess`'s max_tokens can produce. When those two
// drifted apart, a single long answer permanently broke the conversation: the
// reply was stored client-side, sent back as history on the next turn, rejected
// with a 400, and kept failing until it scrolled out of the window.
//
// If you raise max_tokens in chatWithPrincess, check MAX_ASSISTANT_CHARS here.

/** Visitor input. Untrusted and public, so kept tight. */
export const MAX_USER_CHARS = 1000;

/**
 * Princess's own replies echoed back as context. Must comfortably exceed her
 * max_tokens (560 ≈ 1,700–2,200 characters) — 3,000 leaves real headroom.
 */
export const MAX_ASSISTANT_CHARS = 3000;

/** Messages the client keeps and sends as context. */
export const HISTORY_WINDOW = 12;

/** Hard ceiling on the array the API accepts. Slack above HISTORY_WINDOW. */
export const MAX_TURNS = 14;

/**
 * Clamps a message to whatever the API will accept for that role, so the client
 * can never send a payload the server rejects. Belt-and-braces: with the caps
 * above it should never actually trim, but it means a future max_tokens bump
 * degrades context gracefully instead of breaking the chat outright.
 */
export function clampMessage(role: "user" | "assistant", content: string): string {
  const max = role === "assistant" ? MAX_ASSISTANT_CHARS : MAX_USER_CHARS;
  return content.length > max ? content.slice(0, max) : content;
}
