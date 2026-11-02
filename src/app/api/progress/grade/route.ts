// POST /api/progress/grade — {course, word, grade} — SM-2-lite như progress.ts.

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { COOKIE_NAME, getProgressOf, getUserByToken, recordGrade } from "@/server/db";

export const runtime = "nodejs";

const GRADES = ["again", "hard", "good", "easy"] as const;
type GradeValue = (typeof GRADES)[number];

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
  const course = typeof body.course === "string" ? body.course : "";
  const word = typeof body.word === "string" ? body.word : "";
  const grade = typeof body.grade === "string" && (GRADES as readonly string[]).includes(body.grade) ? (body.grade as GradeValue) : null;

  if (!course || !word || !grade) {
    return NextResponse.json({ error: "Dữ liệu ôn tập không hợp lệ." }, { status: 400 });
  }

  recordGrade(user.id, { course, word, grade });
  return NextResponse.json({ progress: getProgressOf(user.id) });
}
