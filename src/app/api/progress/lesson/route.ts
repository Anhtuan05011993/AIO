// POST /api/progress/lesson — {courseId, mode, difficulty, seconds, accuracy, xp}
// → push lesson record + cộng XP/phút, trả progress mới.

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { COOKIE_NAME, getProgressOf, getUserByToken, recordLesson } from "@/server/db";

export const runtime = "nodejs";

function num(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export async function POST(request: Request): Promise<NextResponse> {
  const cookieStore = await cookies();
  const user = getUserByToken(cookieStore.get(COOKIE_NAME)?.value);
  if (!user) {
    return NextResponse.json({ error: "Chưa đăng nhập." }, { status: 401 });
  }

  let body: Record<string, unknown> = {};
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    body = {};
  }
  const courseId = typeof body.courseId === "string" ? body.courseId : "";

  recordLesson(user.id, {
    courseId,
    mode: typeof body.mode === "string" ? body.mode : "default",
    difficulty: typeof body.difficulty === "string" ? body.difficulty : "basic",
    seconds: num(body.seconds),
    accuracy: num(body.accuracy),
    xp: num(body.xp),
  });

  return NextResponse.json({ progress: getProgressOf(user.id) });
}
