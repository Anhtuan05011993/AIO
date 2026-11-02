// GET /api/xep-hang — bảng xếp hạng XP tuần: 8 học viên demo (seed) + user thật,
// sắp theo weeklyXp giảm dần; hàng của user đăng nhập được đánh dấu isYou.

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { COOKIE_NAME, getLeaderboardRows, getUserByToken, type LeaderboardRow } from "@/server/db";

export const runtime = "nodejs";

export async function GET(): Promise<NextResponse> {
  const rows = getLeaderboardRows().map((row: LeaderboardRow) => ({ ...row, isYou: false }));
  const cookieStore = await cookies();
  const user = getUserByToken(cookieStore.get(COOKIE_NAME)?.value);

  let you: { rank: number; weeklyXp: number; level: string; streakDays: number } | null = null;
  if (user) {
    const idx = rows.findIndex((r) => r.userId === user.id);
    if (idx >= 0) {
      rows[idx].isYou = true;
      you = {
        rank: idx + 1,
        weeklyXp: rows[idx].weeklyXp,
        level: rows[idx].level,
        streakDays: rows[idx].streakDays,
      };
    }
  }

  return NextResponse.json({ rows, you });
}
