// Demo course data for the Gõ câu lesson player.
// Extracted from the site's own APIs (see docs/research/aioenglish/DATA-SOURCES.md).
import packJson from "./pack-lo-trinh-b1.json";
import packA1Json from "./pack-lo-trinh-a1.json";
import course1 from "./course-crs_b60adbaa933635b8d0.json";
import course2 from "./course-crs_d5d9f4cb9dcf760b9e.json";
import course3 from "./course-crs_0008c8bbf528537cfd.json";

export type LearningUnit = {
  id: string;
  unitText: string;
  unitType: "word" | "phrase" | "sentence" | string;
  grammarTags?: string[];
  partOfSpeech?: string | null;
  explanationVi?: string | null;
};

export type Statement = {
  id: string;
  text: string;
  translation: string;
  acceptedAnswers: string[];
  ipa: string;
  displayText: string;
  pronunciationGuide: string;
  pronunciationGuideUs?: string | null;
  learningUnits: LearningUnit[];
  tier?: string | null;
};

export type Course = {
  course: {
    id: string;
    slug: string;
    title: string;
    packSlug: string;
    packTitle: string;
    statementCount: number;
  };
  statements: Statement[];
  mastered?: string[];
  completed?: boolean;
};

export type PackEntry = {
  id: string;
  slug: string;
  title: string;
  total: number;
  availableTiers: string[];
  completed?: boolean;
  unit?: string;
  chapter?: string;
};

export const PACK_B1 = {
  pack: (packJson as { pack: unknown }).pack,
  courses: (packJson as { courses: PackEntry[] }).courses,
};

/** Pack A1 (96 khóa, 8 chương) — chỉ mới trích CẤU TRÚC (chưa có nội dung statements). */
export const PACK_A1 = {
  pack: (packA1Json as { pack: unknown }).pack,
  courses: (packA1Json as { courses: PackEntry[] }).courses,
};

export const COURSE_IDS = [
  course1.course.id,
  course2.course.id,
  course3.course.id,
] as const;

const COURSES: Record<string, Course> = {
  [course1.course.id]: course1 as unknown as Course,
  [course2.course.id]: course2 as unknown as Course,
  [course3.course.id]: course3 as unknown as Course,
};

export function getCourse(courseId: string): Course | undefined {
  return COURSES[courseId];
}

// Bulk-extracted courses (37/80 — the rest hit the site's rate limiter; see DATA-SOURCES.md).
import bulkManifest from "./bulk-manifest.json";

export const AVAILABLE_COURSE_IDS = [...COURSE_IDS, ...bulkManifest.map((m) => m.id)] as string[];

export type BulkMeta = { id: string; title: string; slug: string; statements: number };
export const BULK_MANIFEST = bulkManifest as BulkMeta[];

/** Async loader covering the 3 hand-picked + 37 bulk-extracted courses. */
export async function getCourseAsync(courseId: string): Promise<Course | undefined> {
  const direct = COURSES[courseId];
  if (direct) return direct;
  if (!bulkManifest.some((m) => m.id === courseId)) return undefined;
  try {
    const mod = (await import(`./courses/course-${courseId}.json`)) as { default: Course };
    return mod.default;
  } catch {
    return undefined;
  }
}

export function courseSummaries(): Array<{ id: string; title: string; slug: string; total: number }> {
  return Object.values(COURSES).map((c) => ({
    id: c.course.id,
    title: c.course.title,
    slug: c.course.slug,
    total: c.course.statementCount ?? c.statements.length,
  }));
}
