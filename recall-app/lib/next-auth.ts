import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";

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
    }),
  ],
  callbacks: {
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
