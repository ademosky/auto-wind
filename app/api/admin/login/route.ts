import { NextResponse } from "next/server";
import { SESSION_COOKIE, SESSION_TTL, createSessionToken, credentialsValid } from "@/lib/auth";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as
    | { email?: unknown; password?: unknown }
    | null;

  const email = typeof body?.email === "string" ? body.email : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (!credentialsValid(email, password)) {
    return NextResponse.json({ error: "Погрешна е-пошта или лозинка." }, { status: 401 });
  }

  const token = await createSessionToken(email.trim().toLowerCase());
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL,
  });
  return response;
}

