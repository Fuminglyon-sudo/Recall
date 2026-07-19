// GA4 Measurement ID for the Google tag (gtag.js) installed in app/layout.tsx.
// Not a secret — Google's own install snippet embeds it directly in
// client-side script that ships to every visitor's browser. Hardcoded as
// the default so analytics work out of the box; override with
// NEXT_PUBLIC_GA_MEASUREMENT_ID (e.g. a Vercel env var) for a different
// property on a staging/preview deployment.
export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-C0D31SCV9Y";
