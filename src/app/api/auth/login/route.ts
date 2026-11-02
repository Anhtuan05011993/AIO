// POST /api/auth/login — {email, password} → 200 {user} + cookie aio_session.
// Sai thông tin → 401 {error}. (BRIEFS-4, Agent F1)

import { NextResponse } from "next/server";
import {
  COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
  createSession,
  findUserByEmail,
  toPublicUser,
  verifyPassword,
} from "@/server/db";

export const runtime = "nodejs";

export async function POST(request: Request): Promise<NextResponse> {
  let body: { email?: unknown; password?: unknown } = {};
  try {
    body = (await request.json()) as { email?: unknown; password?: unknown };
  } catch {
    body = {};
  }
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!email || !password) {
    return NextResponse.json({ error: "Vui lòng nhập email và mật khẩu." }, { status: 400 });
  }

  const user = findUserByEmail(email);
  if (!user || !verifyPassword(user.passwordHash, password)) {
    return NextResponse.json({ error: "Email hoặc mật khẩu không đúng." }, { status: 401 });
  }

  const session = createSession(user.id);
  const res = NextResponse.json({ user: toPublicUser(user) });
  res.cookies.set(COOKIE_NAME, session.token, {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
  return res;
}
