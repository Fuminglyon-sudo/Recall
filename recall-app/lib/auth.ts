import { createHmac } from "crypto";

const COOKIE_NAME = "recall_session";

export function createSessionToken(): string {
  const secret = process.env.AUTH_SECRET ?? "fallback-dev-secret";
  return createHmac("sha256", secret).update("authenticated").digest("hex");
}

export function checkCredentials(username: string, password: string): boolean {
  const validUser = process.env.AUTH_USERNAME ?? "";
  const validPass = process.env.AUTH_PASSWORD ?? "";
  return username === validUser && password === validPass;
}

export { COOKIE_NAME };
