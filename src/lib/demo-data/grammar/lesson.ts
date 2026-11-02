/**
 * lesson.ts — dựng nội dung trang đọc ngữ pháp /ngu-phap/[node] từ catalog +
 * khóa gõ câu liên quan (go-cau) + nội dung demo biên soạn (demoLessons.ts).
 *
 * - Câu ví dụ "thật": lấy từ statements (EN/VN) của khóa gõ câu map được qua
 *   getCourseAsync — bám đúng dữ liệu nguồn của site.
 * - Node không map được khóa nào → dùng cặp câu demo trong demoLessons.ts và
 *   trang đọc gắn nhãn "Nội dung demo".
 */
import { nguPhapCatalog, type NguPhapGroup, type NguPhapNode, type NguPhapTopic } from "../nguPhapCatalog";
import { getCourseAsync, type Statement } from "../go-cau";
import { NODE_COURSE_IDS } from "./nodeCourses";
import { DEMO_LESSONS } from "./demoLessons";
import { getRealLesson, type RealWorked } from "./realLessons";

export type LessonExample = {
  en: string;
  vi: string;
  /** Tên khóa gõ câu câu ví dụ được lấy từ (nếu có) */
  source?: string;
};

export type RelatedCourse = {
  id: string;
  title: string;
  statementCount: number;
  href: string;
};

export type GrammarLesson = {
  node: NguPhapNode;
  topic: NguPhapTopic | undefined;
  group: NguPhapGroup | undefined;
  intro: string[];
  points: string[];
  examples: LessonExample[];
  /** true khi câu ví dụ lấy từ khóa gõ câu thật (không phải demo) */
  examplesFromCourse: boolean;
  related: RelatedCourse[];
  /** Tổng số bài tập 4 chế độ của node (transform + fix + gap + choice) */
  totalExercises: number;
  /** true khi node có nội dung THẬT trích từ /api/ngu-phap/nodes/{id} (đè demo) */
  isReal: boolean;
  /** Ví dụ worked từng bước của node thật (rỗng với node demo) */
  worked: RealWorked[];
};

// GRAMMAR_LEVELS sống ở nguPhapCatalog (module nhẹ) — re-export ở đây để giữ
// tương thích; KHÔNG định nghĩa ở file này vì lesson.ts kéo real-lessons.json
// (7.8MB) vào bundle nếu client component import từ đây.
export { GRAMMAR_LEVELS, type GrammarLevel } from "../nguPhapCatalog";

/** Tất cả node có trong catalog (đủ 6 cấp A1→C2, 167 node) — cho generateStaticParams. */
export function grammarNodeIds(): string[] {
  return nguPhapCatalog.nodes.map((n) => n.id);
}

export function findGrammarNode(nodeId: string): NguPhapNode | undefined {
  return nguPhapCatalog.nodes.find((n) => n.id === nodeId);
}

export function totalExercisesOf(node: NguPhapNode): number {
  return node.counts.transform + node.counts.fix + node.counts.gap + node.counts.choice;
}

/** Lấy 1-2 câu ví dụ tiêu biểu từ statement list (đầu + giữa list). */
function sampleStatements(statements: Statement[], want: number): Statement[] {
  if (statements.length === 0) return [];
  const picks: Statement[] = [];
  const idx = [0, Math.floor(statements.length / 2), statements.length - 1];
  for (const i of idx) {
    const s = statements[i];
    if (s && !picks.some((p) => p.id === s.id)) picks.push(s);
    if (picks.length >= want) break;
  }
  return picks;
}

/**
 * Dựng nội dung bài đọc cho một node. Trả về null khi node không tồn tại
 * (route lạ → notFound).
 */
export async function buildGrammarLesson(nodeId: string): Promise<GrammarLesson | null> {
  const node = findGrammarNode(nodeId);
  if (!node) return null;

  const topic = nguPhapCatalog.topics.find((t) => t.slug === node.topic);
  const group = topic ? nguPhapCatalog.groups.find((g) => g.id === topic.group) : undefined;
  const demo = DEMO_LESSONS[node.id];

  // Khóa gõ câu liên quan (load qua getCourseAsync — 3 khóa tay + 37 bulk).
  const related: RelatedCourse[] = [];
  const examples: LessonExample[] = [];
  const courseIds = NODE_COURSE_IDS[node.id] ?? [];
  for (const cid of courseIds) {
    const course = await getCourseAsync(cid);
    if (!course) continue;
    related.push({
      id: course.course.id,
      title: course.course.title,
      statementCount: course.course.statementCount ?? course.statements.length,
      href: `/go-cau/lo-trinh-b1/${course.course.id}`,
    });
    if (examples.length < 6) {
      for (const st of sampleStatements(course.statements, 2)) {
        examples.push({ en: st.text, vi: st.translation, source: course.course.title });
      }
    }
  }

  const examplesFromCourse = examples.length > 0;
  if (!examplesFromCourse && demo?.examples) {
    examples.push(...demo.examples.map((e) => ({ en: e.en, vi: e.vi })));
  }

  // Node THẬT (trích từ API chính chủ) đè nội dung demo: start card → intro,
  // rule cards → points, examples gốc → ví dụ, worked → mục ví dụ từng bước.
  const real = getRealLesson(nodeId);
  if (real) {
    const realExamples: LessonExample[] = [];
    if (real.start) {
      for (const e of real.start.examples) realExamples.push({ en: e.en, vi: e.vi });
    }
    for (const r of real.rules) {
      for (const e of r.examples) {
        if (realExamples.length < 6) realExamples.push({ en: e.en, vi: e.vi });
      }
    }
    return {
      node,
      topic,
      group,
      intro: real.start ? [real.start.body] : (demo?.intro ?? []),
      points: real.rules.map((r) =>
        `${r.title} — ${r.body.replace(/\n+/g, " ")}` +
        (r.formula.length ? ` (Công thức: ${r.formula.join(" · ")})` : ""),
      ),
      examples: realExamples,
      examplesFromCourse,
      related,
      totalExercises: totalExercisesOf(node),
      isReal: true,
      worked: real.worked,
    };
  }

  return {
    node,
    topic,
    group,
    intro: demo?.intro ?? [`Bài hướng dẫn "${node.title}" (${node.titleEn}) thuộc chủ đề ${topic?.title ?? node.topic}.`],
    points: demo?.points ?? [],
    examples,
    examplesFromCourse,
    related,
    totalExercises: totalExercisesOf(node),
    isReal: false,
    worked: [],
  };
}
