// POST /api/progress/checkin — điểm danh hằng ngày (streak logic như progress.ts).
// Đã điểm danh hôm nay → trả state hiện tại, không cộng gì.

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { COOKIE_NAME, getProgressOf, getUserByToken, recordCheckIn } from "@/server/db";

export const runtime = "nodejs";

export async function POST(): Promise<NextResponse> {
  const cookieStore = await cookies();
  const user = getUserByToken(cookieStore.get(COOKIE_NAME)?.value);
  if (!user) {
    return NextResponse.json({ error: "Chưa đăng nhập." }, { status: 401 });
  }
  recordCheckIn(user.id);
  return NextResponse.json({ progress: getProgressOf(user.id) });
}
