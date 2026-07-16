import type { NextConfig } from "next";

// Next.js requires 'unsafe-inline' for its inline hydration scripts (no nonce yet).
// We still get meaningful protection from frame-ancestors, form-action, base-uri,
// and the tight connect-src / img-src allowlists.
// 'unsafe-eval' is only needed by Next.js dev (Turbopack/webpack HMR eval) —
// keeping it out of the production CSP closes off a real XSS-escalation path.
const scriptSrc = process.env.NODE_ENV === "production"
  ? "script-src 'self' 'unsafe-inline'"
  : "script-src 'self' 'unsafe-inline' 'unsafe-eval'";

const ContentSecurityPolicy = [
  "default-src 'self'",
  scriptSrc,
  "style-src 'self' 'unsafe-inline'",                // Tailwind inline styles
  "img-src 'self' data: https://lh3.googleusercontent.com https://lh4.googleusercontent.com",
  "font-src 'self'",
  "connect-src 'self' https://accounts.google.com https://oauth2.googleapis.com https://www.google.com",
  "frame-src https://accounts.google.com",
  "frame-ancestors 'none'",   // prevents clickjacking (stronger than X-Frame-Options)
  "form-action 'self'",       // blocks form submissions to foreign origins
  "base-uri 'self'",          // prevents <base> tag hijacking
  "worker-src 'self'",        // service worker
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: ContentSecurityPolicy },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(self), geolocation=(), interest-cohort=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
