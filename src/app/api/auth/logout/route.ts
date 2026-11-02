// POST /api/auth/logout — xoá session + hết hạn cookie aio_session.

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { COOKIE_NAME, deleteSession } from "@/server/db";

export const runtime = "nodejs";

export async function POST(): Promise<NextResponse> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (token) deleteSession(token);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, "", { httpOnly: true, path: "/", sameSite: "lax", maxAge: 0 });
  return res;
}
