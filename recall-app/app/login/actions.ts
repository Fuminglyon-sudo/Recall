"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { checkCredentials, signToken, COOKIE_NAME } from "@/lib/auth";

export async function loginAction(formData: FormData) {
  const username = (formData.get("username") as string | null) ?? "";
  const password = (formData.get("password") as string | null) ?? "";
  const from = (formData.get("from") as string | null) ?? "/";

  if (!checkCredentials(username, password)) {
    redirect(`/login?error=1&from=${encodeURIComponent(from)}`);
  }

  const token = signToken("authenticated");
  const jar = await cookies();
  jar.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });

  redirect(from || "/");
}

export async function logoutAction() {
  const jar = await cookies();
  jar.delete(COOKIE_NAME);
  redirect("/login");
}
