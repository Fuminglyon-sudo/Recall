import { cookies } from "next/headers";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";
import { assignFounderPlanIfAvailable } from "./founder";
import { sendEmail } from "./email";
import { welcomeEmail, founderWelcomeEmail } from "./email-templates";
import { AUTH_INTENT_COOKIE } from "./auth-intent";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  // Trust the host header from Vercel's reverse proxy so NextAuth can
  // construct the correct callback URL without requiring NEXTAUTH_URL.
  trustHost: true,
  session: { strategy: "jwt" },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      // Without this, a browser with an active Google session silently
      // re-authenticates with zero prompt — so deleting your account and
      // immediately clicking "Continue with Google" just recreates a fresh
      // one with no visible friction. Forcing the account chooser every
      // time makes that a deliberate choice instead of an invisible one.
      authorization: { params: { prompt: "select_account" } },
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return true;
      const email = user.email.toLowerCase();

      const banned = await prisma.bannedEmail.findUnique({ where: { email } });
      if (banned) return "/login?banned=1";

      // Google OAuth has no built-in "sign up" vs "sign in" — this cookie
      // (set by whichever button was actually clicked, see
      // app/login/google-button.tsx) is what lets us catch someone using
      // the wrong one, instead of silently doing what Google's flow always
      // does: log them in either way.
      const jar = await cookies();
      const intent = jar.get(AUTH_INTENT_COOKIE)?.value;
      jar.delete(AUTH_INTENT_COOKIE);

      if (intent === "signup" || intent === "signin") {
        const existing = await prisma.user.findUnique({ where: { email }, select: { id: true } });
        if (intent === "signup" && existing) return "/login?exists=1";
        if (intent === "signin" && !existing) return "/login?notfound=1";
      }

      return true;
    },
    jwt({ token, user }) {
      // Persist the user's DB id into the JWT on first sign-in
      if (user?.id) token.userId = user.id;
      return token;
    },
    session({ session, token }) {
      // Make the DB user id available to server components and actions
      if (token.userId) session.user.id = token.userId as string;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  events: {
    // Fires exactly once, right after the Prisma adapter creates a brand-new
    // User row — never on subsequent logins. Grants a founder spot if one's
    // still open, then sends the matching welcome email. Wrapped so a
    // failure here (bad API key, email provider outage) can never break
    // sign-in itself.
    async createUser({ user }) {
      if (!user.id) return;
      try {
        const plan = await assignFounderPlanIfAvailable(user.id);
        const template = plan === "founder"
          ? founderWelcomeEmail({ name: user.name ?? null })
          : welcomeEmail({ name: user.name ?? null });
        if (user.email) {
          await sendEmail({ to: user.email, subject: template.subject, html: template.html, text: template.text });
        }
      } catch (err) {
        console.error("NEW_USER_ONBOARDING_FAILED", { userId: user.id, err });
      }
    },
  },
  logger: {
    error(error) {
      console.error(
        "AUTH_ERROR_DETAIL",
        JSON.stringify(
          {
            name: error.name,
            message: error.message,
            cause: error.cause instanceof Error
              ? { name: error.cause.name, message: error.cause.message }
              : error.cause,
            stack: error.stack,
          },
          null,
          2,
        ),
      );
    },
  },
});
