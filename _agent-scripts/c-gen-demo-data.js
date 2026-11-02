// Agent C scratch: generate typed demo-data TS modules from research API JSONs.
const fs = require("fs");
const path = require("path");
const dir = "docs/research/aioenglish/data/";
const outDir = "src/lib/demo-data";
fs.mkdirSync(outDir, { recursive: true });

const read = (f) => JSON.parse(fs.readFileSync(dir + f, "utf8"));
const write = (name, content) => {
  fs.writeFileSync(path.join(outDir, name), content);
  console.log("written", name, content.length, "bytes");
};
const json = (v) => JSON.stringify(v, null, 2);

/* ---------------------------------------------------------------- goCauCourse */
const course = read("api-course-crs_b60adbaa933635b8d0.json");
const UNITS_PER_STATEMENT = 4;
const statements = course.statements.map((s) => ({
  ...s,
  learningUnits: s.learningUnits.slice(0, UNITS_PER_STATEMENT),
}));

write(
  "goCauCourse.ts",
  `/**
 * Dữ liệu demo "Gõ câu" — 1 khóa gõ câu B1 thật của aioenglish.com.
 *
 * Nguồn: GET /api/go-cau/course/crs_b60adbaa933635b8d0 (đã extract vào
 * docs/research/aioenglish/data/api-course-crs_b60adbaa933635b8d0.json).
 * Khóa: "Đã làm việc bao lâu rồi" (unit-1-part-1, pack lo-trinh-b1 "Tiếng Anh trung cấp (B1)")
 * — 30 câu tiếng Anh kèm dịch tiếng Việt, IPA UK/US và learningUnits (phân tách từ/cụm
 * kèm giải thích ngữ pháp tiếng Việt).
 *
 * LƯU Ý CẮT GIẢM (trim): learningUnits của mỗi statement chỉ giữ 4 đơn vị đầu
 * (nguồn gốc có 6–14 đơn vị/câu — unitTypes "word" | "phrase" vẫn đủ cả hai).
 * Các trường luôn null trong dataset này (pinyin, zhWords, audioUrl, guessable,
 * pronunciationPlain — dành cho tiếng Trung/tiếp phát audio) được giữ nguyên
 * với giá trị null để đúng shape API.
 */
export type GoCauTier = "word" | "chunk" | "combinedChunk" | "sentence";

export interface GoCauCourseMeta {
  id: string;
  slug: string;
  /** Tiêu đề khóa (tiếng Việt) — "Đã làm việc bao lâu rồi" */
  title: string;
  packSlug: string;
  packTitle: string;
  targetLanguage: string;
  nextCourseId: string;
  statementCount: number;
  /** Các chế độ chơi: word → chunk → combinedChunk → sentence */
  availableTiers: GoCauTier[];
  ownerUserId: string | null;
  /** Số "từ vựng" thu được khi hoàn thành khóa */
  vocabCount: number;
}

export interface GoCauLearningUnit {
  /** id đơn vị trong câu: w0, w1, ... (word) / c0, ... (chunk) */
  id: string;
  unitText: string;
  unitType: "word" | "phrase";
  /** Nhãn ngữ pháp: subject, auxiliary, verb, preposition, ... */
  grammarTags: string[];
  partOfSpeech: string;
  /**
   * Giải thích ngữ pháp tiếng Việt hiển thị khi gõ đúng đơn vị.
   * Optional: API chỉ giải thích từ nội dung — từ chức năng (in, this, for, ...)
   * không có trường này (158/307 unit của khóa demo).
   */
  explanationVi?: string;
}

export interface GoCauStatement {
  id: string;
  /** Câu tiếng Anh không dấu chấm — dùng làm target khi chơi */
  text: string;
  pinyin: string | null;
  /** Bản dịch tiếng Việt hiển thị cho người học */
  translation: string;
  /** Các đáp án được chấp nhận (I have... / I've...) */
  acceptedAnswers: string[];
  audioUrl: string | null;
  /** IPA theo Anh-Anh (UK), mỗi từ một khối /.../ */
  ipa: string;
  targetLanguage: string;
  targetText: string;
  /** Câu hiển thị có dấu chấm cuối */
  displayText: string;
  pronunciationGuide: string;
  pronunciationGuideUs: string;
  pronunciationPlain: string | null;
  learningUnits: GoCauLearningUnit[];
  /** Tier mặc định khi vào khóa: "sentence" */
  tier: GoCauTier;
  guessable: string | null;
  zhWords: string[] | null;
}

export interface GoCauCourse {
  course: GoCauCourseMeta;
  statements: GoCauStatement[];
  /** id các statement đã thuộc (state user) */
  mastered: string[];
  /** Index statement đang học dở */
  lastIndex: number;
  completed: boolean;
  completedModes: string[];
  doneSteps: string[];
}

export const goCauCourse: GoCauCourse = {
  course: ${json(course.course)},
  statements: ${json(statements)},
  mastered: ${json(course.mastered)},
  lastIndex: ${course.lastIndex},
  completed: ${course.completed},
  completedModes: ${json(course.completedModes)},
  doneSteps: ${json(course.doneSteps)},
};
`,
);

/* ------------------------------------------------------------ tuVungOxford3000 */
const tv = read("api-tu-vung-oxford-3000.json");

write(
  "tuVungCourse.ts",
  `/**
 * Dữ liệu demo "Từ vựng" — cấu trúc bộ Oxford 3000 của aioenglish.com.
 *
 * Nguồn: GET /api/tu-vung/course/oxford-3000 (đã extract vào
 * docs/research/aioenglish/data/api-tu-vung-oxford-3000.json).
 * Cấu trúc: khóa học → 4 nhóm cấp độ CEFR (A1/A2/B1/B2) → 79 bộ thẻ (sets).
 * Bộ thẻ chỉ chứa metadata (wordCount) — nguyên văn 2.979 từ nằm trong dataset
 * oxford-5000-full-word.json (xem DATA-SOURCES.md), không nhúng vào đây để tránh
 * phình to module.
 *
 * Không cắt giảm — giữ nguyên toàn bộ 4 nhóm × 79 bộ thẻ.
 */
export interface TuVungCourseMeta {
  id: string;
  slug: string;
  title: string;
  description: string;
  coverImageUrl: string;
  /** "de-xuat" — nhóm gợi ý trên trang Từ vựng */
  category: string;
  /** Trục cấp độ: "cefr" */
  levelAxis: string;
  levelMin: string;
  levelMax: string;
  /** Tên icon lucide dùng cho card khóa */
  iconName: string;
  targetLanguage: string;
  isPremium: boolean;
  setCount: number;
  wordTotal: number;
  sourceNote: string;
  mastered: number;
  learning: number;
  studied: number;
}

export interface TuVungSet {
  id: string;
  /** Slug unit: a1-con-nguoi-part-1, ... */
  unit: string;
  /** Tiêu đề hiển thị: "A1 · Con người & Quan hệ" */
  title: string;
  wordCount: number;
  isPremium: boolean;
  topicKey: string;
  topicLabel: string;
  mastered: number;
  learning: number;
  /** Số từ mới (chưa học) trong bộ */
  new: number;
}

export interface TuVungGroup {
  /** CEFR level: A1 | A2 | B1 | B2 */
  key: string;
  label: string;
  setCount: number;
  wordCount: number;
  mastered: number;
  learning: number;
  sets: TuVungSet[];
}

export interface TuVungCourse {
  course: TuVungCourseMeta;
  groups: TuVungGroup[];
}

export const tuVungOxford3000: TuVungCourse = ${json(tv)};
`,
);

/* ------------------------------------------------------------ nguPhapCatalog */
const np = read("api-ngu-phap-catalog.json");
const KEEP_LEVELS = new Set(["A1", "B1"]);
const nodes = np.nodes.filter((n) => KEEP_LEVELS.has(n.level));
const catalog = {
  v: np.v,
  app: np.app,
  groups: np.groups,
  nodes,
  topics: np.topics,
  curriculum: np.curriculum,
};

write(
  "nguPhapCatalog.ts",
  `/**
 * Dữ liệu demo "Ngữ pháp" — catalog ngữ pháp A1→C2 của aioenglish.com.
 *
 * Nguồn: GET /api/ngu-phap/catalog (đã extract vào
 * docs/research/aioenglish/data/api-ngu-phap-catalog.json).
 * Cấu trúc: 14 nhóm chủ đề → 51 topic → 167 node bài học (mỗi node có số bài
 * tập theo 4 chế độ: transform / fix / gap / choice) + curriculum lộ trình
 * 6 cấp độ (A1→C2, stage thường và stage "+").
 *
 * LƯU Ý CẮT GIẢM (trim):
 * - \`nodes\`: nguồn có 167 node (A1:30, A2:36, B1:35, B2:30, C1:24, C2:12) —
 *   demo chỉ giữ 65 node cấp A1 + B1 (trọng tâm demo: khóa B1 + lộ trình B1).
 *   \`topics\` và \`curriculum\` giữ NGUYÊN nên vẫn mô tả đủ mọi cấp; một số
 *   topic.nodeIds sẽ trỏ tới node đã lược bỏ.
 * - Hai bản đồ alias chuyển hướng của API (nodeAliases, topicAliases —
 *   redirect id cũ → id mới) không đưa vào dữ liệu demo; interface vẫn khai
 *   báo optional để đúng shape API.
 */
export interface NguPhapGroup {
  /** id nhóm: thi-the, khuyet-thieu, cau-hoi, ... */
  id: string;
  label: string;
}

export interface NguPhapNodeCounts {
  /** Số bài tập chế độ "biến đổi câu" */
  transform: number;
  /** Sửa lỗi */
  fix: number;
  /** Điền vào chỗ trống */
  gap: number;
  /** Trắc nghiệm */
  choice: number;
}

export interface NguPhapNode {
  /** id bài học: a1-to-be, b2-passive-perfect, ... */
  id: string;
  /** Thứ tự trong catalog */
  order: number;
  /** CEFR: A1 | A2 | B1 | B2 | C1 | C2 */
  level: string;
  title: string;
  titleEn: string;
  /** topic slug liên quan */
  topic: string;
  counts: NguPhapNodeCounts;
  /** Revision hash của nội dung node */
  rev: string;
}

export interface NguPhapTopic {
  slug: string;
  title: string;
  titleEn: string;
  /** Nhóm chủ đề cha (NguPhapGroup.id) */
  group: string;
  levels: string[];
  readMinutes: number;
  /** Các node bài học thuộc topic, theo thứ tự học */
  nodeIds: string[];
}

export interface NguPhapTypingRef {
  /** Pack gõ câu nối với module: lo-trinh-a1, ... */
  pack: string;
  course: string;
}

export interface NguPhapCurriculumModule {
  id: string;
  /** Số thứ tự module trong stage */
  no: number;
  label: string;
  nodeIds: string[];
  /** Khóa gõ câu thực hành tương ứng (nếu có) */
  typing?: NguPhapTypingRef;
}

export interface NguPhapCurriculumStage {
  /** id stage: A1, A2, A2+, B1, B1+, ... */
  id: string;
  modules: NguPhapCurriculumModule[];
}

export interface NguPhapCurriculumLevel {
  /** CEFR: A1 ... C2 */
  level: string;
  stages: NguPhapCurriculumStage[];
}

export interface NguPhapCatalog {
  v: number;
  /** app: "tienganh" */
  app: string;
  groups: NguPhapGroup[];
  nodes: NguPhapNode[];
  topics: NguPhapTopic[];
  curriculum: { levels: NguPhapCurriculumLevel[] };
  nodeAliases?: Record<string, string>;
  topicAliases?: Record<string, string>;
}

export const nguPhapCatalog: NguPhapCatalog = ${json(catalog)};
`,
);

/* --------------------------------------------------------------- learningPath */
const lp = read("api-path.json");
const FULL_ROW_CHAPTERS = 2;
const TRIMMED_ROWS = 3;
const chapters = lp.chapters.map((ch) =>
  ch.index <= FULL_ROW_CHAPTERS
    ? ch
    : { ...ch, rows: ch.rows.slice(0, TRIMMED_ROWS) },
);
const pathData = { ...lp, chapters };

write(
  "learningPath.ts",
  `/**
 * Dữ liệu demo "Lộ trình" — lộ trình học TOEIC 785 (B1) của aioenglish.com.
 *
 * Nguồn: GET /api/path (đã extract vào docs/research/aioenglish/data/api-path.json).
 * Cấu trúc: mục tiêu (goal) + tiến độ tổng + ETA + 5 cấp độ (A1→C1) + 11 chương
 * của cấp hiện tại (B1), mỗi chương gồm các "row" — bước học nối sang tính năng
 * (kind: grammar-guide → /ngu-phap/..., typing → /go-cau/...).
 *
 * LƯU Ý CẮT GIẢM (trim): chương 1–2 giữ nguyên toàn bộ row (15 + 9); chương
 * 3–11 chỉ giữ 3 row đầu mỗi chương (nguồn gốc 5–15 row/chương). Trường "total"
 * vẫn là tổng row thật của chương theo API. Tổng: 115 row thật → 51 row demo.
 */
export interface PathProgressDone {
  done: number;
  total: number;
}

export interface PathProgress {
  /** Tiến độ theo bước học (items) */
  items: PathProgressDone;
  itemsFrac: number;
  /** Tiến độ từ vựng */
  vocab: PathProgressDone;
  vocabFrac: number;
  /** Phần trăm hoàn thành tổng */
  percent: number;
  ready: boolean;
  currentChapter: number;
}

export interface PathEta {
  /** "plan" — chưa có đủ dữ liệu để đo chính xác */
  state: string;
  weeksLo: number;
  weeksHi: number;
  minutesPerDay: number;
}

export interface PathLevel {
  level: string;
  chapters: number;
}

export interface PathGoal {
  /** Hệ mục tiêu: "toeic" */
  system: string;
  name: string;
  verb: string;
  next: string;
  toward: string;
}

export interface PathTarget {
  level: string;
  name: string;
  isDefault: boolean;
  reached: boolean;
  eta: PathEta;
  etaText: string;
}

export interface PathLevelTest {
  open: boolean;
  inProgress: boolean;
  retryAt: string | null;
  completed: boolean;
}

export interface PathRow {
  /** Khóa bước: "grammar:b1-present-perfect", "typing:lo-trinh-b1/unit-1-part-1" */
  key: string;
  /** Tính năng đảm nhận: "ngu-phap" | "go-cau" */
  feature: string;
  minutes: number;
  /** Đường dẫn trong app tới bước học */
  to: string;
  skippable: boolean;
  hint: string | null;
  /** "grammar-guide" | "typing" */
  kind: string;
  /** Nhãn nhỏ trên row: "Ngữ pháp · Bài hướng dẫn", "Gõ câu" */
  kicker: string;
  title: string;
  titleLead: string | null;
  titleTail: string | null;
  partTitle: string | null;
  done: boolean;
  skipped: boolean;
  /** Row kế tiếp cần học */
  next: boolean;
}

export interface PathChapter {
  index: number;
  label: string;
  done: number;
  /** Tổng số bước thật của chương (kể cả row đã bị cắt trong demo) */
  total: number;
  rows: PathRow[];
}

export interface LearningPath {
  /** Cấp hiện tại của user: "B1" */
  level: string;
  minutesPerDay: number;
  startedAt: string;
  progress: PathProgress;
  eta: PathEta;
  /** Số chương mỗi cấp: A1:8, A2:11, B1:11, B2:9, C1:8 */
  levels: PathLevel[];
  goal: PathGoal;
  /** "Dự kiến khoảng 3 tháng để đạt TOEIC 785" */
  etaText: string;
  /** Mục tiêu mốc theo cấp: A1 → "TOEIC 225", ... */
  goalNames: Record<string, string>;
  /** Vị trí hiện tại trong lộ trình */
  here: { chapter: number; key: string };
  chapters: PathChapter[];
  skipped: string[];
  levelTest: PathLevelTest;
  target: PathTarget;
}

export const learningPath: LearningPath = ${json(pathData)};
`,
);

/* ---------------------------------------------------------------- index.ts */
write(
  "index.ts",
  `/**
 * Barrel cho dữ liệu demo — extracted từ API thật của aioenglish.com
 * (xem docs/research/aioenglish/DATA-SOURCES.md và các header trong từng module).
 */
export { goCauCourse } from "./goCauCourse";
export type {
  GoCauCourse,
  GoCauCourseMeta,
  GoCauLearningUnit,
  GoCauStatement,
  GoCauTier,
} from "./goCauCourse";

export { tuVungOxford3000 } from "./tuVungCourse";
export type {
  TuVungCourse,
  TuVungCourseMeta,
  TuVungGroup,
  TuVungSet,
} from "./tuVungCourse";

export { nguPhapCatalog } from "./nguPhapCatalog";
export type {
  NguPhapCatalog,
  NguPhapCurriculumLevel,
  NguPhapCurriculumModule,
  NguPhapCurriculumStage,
  NguPhapGroup,
  NguPhapNode,
  NguPhapNodeCounts,
  NguPhapTopic,
  NguPhapTypingRef,
} from "./nguPhapCatalog";

export { learningPath } from "./learningPath";
export type {
  LearningPath,
  PathChapter,
  PathEta,
  PathGoal,
  PathLevel,
  PathLevelTest,
  PathProgress,
  PathProgressDone,
  PathRow,
  PathTarget,
} from "./learningPath";
`,
);

console.log("done");
