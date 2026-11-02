// GET /api/progress — ProgressState của user đang đăng nhập
// (zero-state nếu chưa có). Chưa đăng nhập → 401.

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { COOKIE_NAME, getProgressOf, getUserByToken } from "@/server/db";

export const runtime = "nodejs";

export async function GET(): Promise<NextResponse> {
  const cookieStore = await cookies();
  const user = getUserByToken(cookieStore.get(COOKIE_NAME)?.value);
  if (!user) {
    return NextResponse.json({ error: "Chưa đăng nhập." }, { status: 401 });
  }
  return NextResponse.json({ progress: getProgressOf(user.id) });
}
