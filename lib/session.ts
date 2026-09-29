export const SESSION_COOKIE = "aw_admin";
const SESSION_TTL_SECONDS = 60 * 60 * 12; // 12 hours

const encoder = new TextEncoder();

function b64url(bytes: Uint8Array): string {
  let str = "";
  for (const b of bytes) str += String.fromCharCode(b);
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function b64urlDecode(value: string): Uint8Array {
  const pad = value.length % 4 === 0 ? "" : "=".repeat(4 - (value.length % 4));
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/") + pad;
  const raw = atob(normalized);
  const out = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i += 1) out[i] = raw.charCodeAt(i);
  return out;
}

async function hmacSha256(data: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(data));
  return b64url(new Uint8Array(signature));
}

function sessionSecret(): string {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || "auto-wind-dev-secret";
}

/** Constant-time-ish comparison that does not short-circuit on the first byte. */
export function safeEqual(a: string, b: string): boolean {
  const maxLen = Math.max(a.length, b.length);
  let diff = a.length ^ b.length;
  for (let i = 0; i < maxLen; i += 1) {
    diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  }
  return diff === 0;
}

export function credentialsValid(email: string, password: string): boolean {
  const expectedEmail = process.env.ADMIN_EMAIL || "";
  const expectedPassword = process.env.ADMIN_PASSWORD || "";
  if (!expectedEmail || !expectedPassword) return false;
  const okEmail = safeEqual(email.trim().toLowerCase(), expectedEmail.trim().toLowerCase());
  const okPass = safeEqual(password, expectedPassword);
  return okEmail && okPass;
}

export async function createSessionToken(email: string): Promise<string> {
  const payload = b64url(
    encoder.encode(JSON.stringify({ email, exp: Date.now() + SESSION_TTL_SECONDS * 1000 })),
  );
  const signature = await hmacSha256(payload, sessionSecret());
  return `${payload}.${signature}`;
}

export async function verifySessionToken(token: string | undefined | null): Promise<boolean> {
  if (!token || !token.includes(".")) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;
  const expected = await hmacSha256(payload, sessionSecret());
  if (!safeEqual(signature, expected)) return false;
  try {
    const decoded = JSON.parse(new TextDecoder().decode(b64urlDecode(payload))) as {
      email?: string;
      exp?: number;
    };
    return typeof decoded.exp === "number" && decoded.exp > Date.now();
  } catch {
    return false;
  }
}

export const SESSION_TTL = SESSION_TTL_SECONDS;

