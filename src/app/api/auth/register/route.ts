// POST /api/auth/register — {email, password, name?} → 201 {user} + cookie.
// Validate email + mật khẩu ≥ 8 ký tự; trùng email → 409.

import { NextResponse } from "next/server";
import {
  COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
  createSession,
  createUser,
  findUserByEmail,
  toPublicUser,
} from "@/server/db";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request): Promise<NextResponse> {
  let body: { email?: unknown; password?: unknown; name?: unknown } = {};
  try {
    body = (await request.json()) as { email?: unknown; password?: unknown; name?: unknown };
  } catch {
    body = {};
  }
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";
  const name = typeof body.name === "string" ? body.name : "";

  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Email không hợp lệ." }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: "Mật khẩu phải có ít nhất 8 ký tự." }, { status: 400 });
  }
  if (findUserByEmail(email)) {
    return NextResponse.json({ error: "Email này đã được sử dụng. Bạn thử đăng nhập nhé." }, { status: 409 });
  }

  const user = createUser({ email, password, name });
  const session = createSession(user.id);
  const res = NextResponse.json({ user: toPublicUser(user) }, { status: 201 });
  res.cookies.set(COOKIE_NAME, session.token, {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
  return res;
}
