import { cookies } from "next/headers";

export {
  SESSION_COOKIE,
  SESSION_TTL,
  createSessionToken,
  credentialsValid,
  safeEqual,
  verifySessionToken,
} from "./session";

import { SESSION_COOKIE, verifySessionToken } from "./session";

/** Reads the current admin session from cookies (server components / route handlers). */
export async function isAuthenticated(): Promise<boolean> {
  const store = await cookies();
  return verifySessionToken(store.get(SESSION_COOKIE)?.value);
}

export async function requireAdmin(): Promise<void> {
  if (!(await isAuthenticated())) {
    throw new Error("Unauthorized");
  }
}

