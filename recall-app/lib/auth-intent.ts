// Google OAuth has no native "sign up" vs "sign in" distinction — it's the
// same flow either way. This cookie is how the button someone actually
// clicked survives the redirect out to Google and back, so the signIn
// callback in lib/next-auth.ts can tell "new account, as expected" apart
// from "this email already exists, they meant to sign in" (and the reverse).
export const AUTH_INTENT_COOKIE = "soro_auth_intent";
export const AUTH_INTENT_MAX_AGE_SECONDS = 300; // just needs to survive one OAuth round trip

export type AuthIntent = "signup" | "signin";
