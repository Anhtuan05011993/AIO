// GET /api/auth/session — {user} từ cookie aio_session, hoặc {user: null}.

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { COOKIE_NAME, getUserByToken, toPublicUser } from "@/server/db";

export const runtime = "nodejs";

export async function GET(): Promise<NextResponse> {
  const cookieStore = await cookies();
  const user = getUserByToken(cookieStore.get(COOKIE_NAME)?.value);
  return NextResponse.json({ user: user ? toPublicUser(user) : null });
}
