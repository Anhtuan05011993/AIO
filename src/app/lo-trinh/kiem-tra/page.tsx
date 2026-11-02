import type { Metadata } from "next";
import { AVAILABLE_COURSE_IDS, getCourseAsync } from "@/lib/demo-data/go-cau";
import LevelTest from "@/components/sites/aioenglish/leveltest/LevelTest";

// Kiểm tra lên cấp — 36 câu trộn từ các khóa có data, 40 phút.
export const metadata: Metadata = {
  title: "Kiểm tra lên cấp · Lộ trình · AIO English",
};

export type LevelQuestion =
  | { kind: "typing"; en: string; vi: string; courseId: string; courseTitle: string }
  | { kind: "mcq"; en: string; vi: string; courseId: string; courseTitle: string; options: string[] };

export default async function LevelTestPage() {
  // sample statements evenly across available courses
  const perCourse = 3;
  const picked: Array<{ en: string; vi: string; courseId: string; courseTitle: string }> = [];
  for (const id of AVAILABLE_COURSE_IDS) {
    const course = await getCourseAsync(id);
    if (!course) continue;
    const st = course.statements;
    const step = Math.max(1, Math.floor(st.length / perCourse));
    for (let i = 0; i < st.length && picked.filter((p) => p.courseId === id).length < perCourse; i += step) {
      const s = st[i];
      picked.push({ en: s.displayText || s.text, vi: s.translation, courseId: id, courseTitle: course.course.title });
    }
  }
  // shuffle + cap at 36
  for (let i = picked.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [picked[i], picked[j]] = [picked[j], picked[i]];
  }
  const selected = picked.slice(0, 36);

  // build questions: alternate typing / mcq (mcq options from other statements' vi)
  const questions: LevelQuestion[] = selected.map((s, i) => {
    if (i % 2 === 0) return { kind: "typing", ...s };
    const pool = selected.filter((x) => x.vi !== s.vi);
    const distractors: string[] = [];
    while (distractors.length < 3 && pool.length > 0) {
      const cand = pool[Math.floor(Math.random() * pool.length)];
      if (!distractors.includes(cand.vi)) distractors.push(cand.vi);
      pool.splice(pool.indexOf(cand), 1);
    }
    const options = [s.vi, ...distractors].sort(() => Math.random() - 0.5);
    return { kind: "mcq", ...s, options };
  });

  return <LevelTest questions={questions} />;
}
