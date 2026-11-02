// realLessons — nội dung node ngữ pháp THẬT trích từ /api/ngu-phap/nodes/{id}
// (site chính chủ, qua console snippet — 39 node đầu tiên; sinh bởi
// _agent-scripts/build-real-lessons.mjs, nguồn: aio-grammar-nodes.json).
// buildGrammarLesson() ưu tiên nội dung này đè lên DEMO_LESSONS; node chưa
// trích được vẫn dùng demo như trước.
import realJson from "./real-lessons.json";

export type RealExample = { en: string; vi: string; focus?: string | null };

export type RealRule = {
  /** id thẻ gốc (vd a1-imperative-r1) — guided[] tham chiếu qua đây */
  id: string;
  title: string;
  body: string;
  formula: string[];
  examples: { en: string; vi: string }[];
};

export type RealWorkedStep = { do: string; result: string };

export type RealWorked = {
  sub: string;
  source: string;
  sourceVi: string;
  target: string;
  steps: RealWorkedStep[];
};

/** Bước trong trình tự bài giảng có hướng dẫn: thẻ dạy hoặc bài tập. */
export type RealGuidedStep = { t: "teach" | "item"; cardId: string | null; itemId: string | null };

/** 1 bài tập thật (4 chế độ transform/fix/gap/choice) — sẵn cho player tương lai. */
export type RealPoolItem = {
  id: string;
  kind?: string;
  teachId?: string;
  sub?: string;
  source: string;
  sourceVi: string;
  target: string;
  accepted?: string[];
  hint?: string;
  explain?: string;
  gaps?: { word: string; occurrence: number }[];
  /** riêng choice: 4 phương án + key đáp án đúng */
  options?: { key: string; text: string }[];
  answer?: string;
};

export type RealLesson = {
  nodeId: string;
  level: string;
  title: string;
  start: { title: string; body: string; examples: RealExample[] } | null;
  rules: RealRule[];
  worked: RealWorked[];
  guided: RealGuidedStep[];
  sets: Record<string, string[]>;
  exercises: {
    transform: RealPoolItem[];
    fix: RealPoolItem[];
    gap: RealPoolItem[];
    choice: RealPoolItem[];
  };
};

export const REAL_LESSONS = realJson as unknown as Record<string, RealLesson>;

export function getRealLesson(nodeId: string): RealLesson | undefined {
  return REAL_LESSONS[nodeId];
}

export const REAL_LESSON_COUNT = Object.keys(REAL_LESSONS).length;
