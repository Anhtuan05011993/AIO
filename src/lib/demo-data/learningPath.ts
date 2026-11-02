/**
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

export const learningPath: LearningPath = {
  "level": "B1",
  "minutesPerDay": 45,
  "startedAt": "2026-10-30T17:12:43.750Z",
  "progress": {
    "items": {
      "done": 0,
      "total": 115
    },
    "itemsFrac": 0,
    "vocab": {
      "done": 0,
      "total": 690
    },
    "vocabFrac": 0,
    "percent": 0,
    "ready": false,
    "currentChapter": 1
  },
  "eta": {
    "state": "plan",
    "weeksLo": 14,
    "weeksHi": 19,
    "minutesPerDay": 45
  },
  "levels": [
    {
      "level": "A1",
      "chapters": 8
    },
    {
      "level": "A2",
      "chapters": 11
    },
    {
      "level": "B1",
      "chapters": 11
    },
    {
      "level": "B2",
      "chapters": 9
    },
    {
      "level": "C1",
      "chapters": 8
    }
  ],
  "goal": {
    "system": "toeic",
    "name": "TOEIC 785",
    "verb": "đạt TOEIC 785",
    "next": "TOEIC 945",
    "toward": "chặng đường tới TOEIC 785"
  },
  "etaText": "Dự kiến khoảng 3 tháng để đạt TOEIC 785",
  "goalNames": {
    "A1": "TOEIC 225",
    "A2": "TOEIC 550",
    "B1": "TOEIC 785",
    "B2": "TOEIC 945",
    "C1": "TOEIC 990"
  },
  "here": {
    "chapter": 1,
    "key": "grammar:b1-present-perfect"
  },
  "chapters": [
    {
      "index": 1,
      "label": "Bản đồ thì: hoàn thành và tiếp diễn",
      "done": 0,
      "total": 15,
      "rows": [
        {
          "key": "grammar:b1-present-perfect",
          "feature": "ngu-phap",
          "minutes": 6,
          "to": "/ngu-phap/b1-present-perfect",
          "skippable": true,
          "hint": null,
          "kind": "grammar-guide",
          "kicker": "Ngữ pháp · Bài hướng dẫn",
          "title": "Hiện tại hoàn thành: for, since",
          "titleLead": null,
          "titleTail": null,
          "partTitle": null,
          "done": false,
          "skipped": false,
          "next": true
        },
        {
          "key": "typing:lo-trinh-b1/unit-1-part-1",
          "feature": "go-cau",
          "minutes": 15,
          "to": "/go-cau/lo-trinh-b1/crs_b60adbaa933635b8d0?setup=1",
          "skippable": true,
          "hint": null,
          "kind": "typing",
          "kicker": "Gõ câu",
          "title": "Bản đồ thì: hoàn thành và tiếp diễn · Bài 1",
          "titleLead": "Bản đồ thì: hoàn thành và tiếp diễn",
          "titleTail": " · Bài 1",
          "partTitle": "Đã làm việc bao lâu rồi",
          "done": false,
          "skipped": false,
          "next": false
        },
        {
          "key": "typing:lo-trinh-b1/unit-1-part-2",
          "feature": "go-cau",
          "minutes": 15,
          "to": "/go-cau/lo-trinh-b1/crs_d5d9f4cb9dcf760b9e?setup=1",
          "skippable": true,
          "hint": null,
          "kind": "typing",
          "kicker": "Gõ câu",
          "title": "Bản đồ thì: hoàn thành và tiếp diễn · Bài 2",
          "titleLead": "Bản đồ thì: hoàn thành và tiếp diễn",
          "titleTail": " · Bài 2",
          "partTitle": "Chưa gọi từ hôm đó",
          "done": false,
          "skipped": false,
          "next": false
        },
        {
          "key": "typing:lo-trinh-b1/unit-1-part-3",
          "feature": "go-cau",
          "minutes": 12,
          "to": "/go-cau/lo-trinh-b1/crs_0008c8bbf528537cfd?setup=1",
          "skippable": true,
          "hint": null,
          "kind": "typing",
          "kicker": "Gõ câu",
          "title": "Bản đồ thì: hoàn thành và tiếp diễn · Bài 3",
          "titleLead": "Bản đồ thì: hoàn thành và tiếp diễn",
          "titleTail": " · Bài 3",
          "partTitle": "Đã đi hay đang ở đó",
          "done": false,
          "skipped": false,
          "next": false
        },
        {
          "key": "typing:lo-trinh-b1/unit-2-part-2",
          "feature": "go-cau",
          "minutes": 14,
          "to": "/go-cau/lo-trinh-b1/crs_854f922c7ae581c8c7?setup=1",
          "skippable": true,
          "hint": null,
          "kind": "typing",
          "kicker": "Gõ câu",
          "title": "Bản đồ thì: hoàn thành và tiếp diễn · Bài 2",
          "titleLead": "Bản đồ thì: hoàn thành và tiếp diễn",
          "titleTail": " · Bài 2",
          "partTitle": "Chuyện học ngày trước",
          "done": false,
          "skipped": false,
          "next": false
        },
        {
          "key": "grammar:b1-present-perfect-continuous",
          "feature": "ngu-phap",
          "minutes": 6,
          "to": "/ngu-phap/b1-present-perfect-continuous",
          "skippable": true,
          "hint": null,
          "kind": "grammar-guide",
          "kicker": "Ngữ pháp · Bài hướng dẫn",
          "title": "Hiện tại hoàn thành tiếp diễn",
          "titleLead": null,
          "titleTail": null,
          "partTitle": null,
          "done": false,
          "skipped": false,
          "next": false
        },
        {
          "key": "typing:lo-trinh-b1/unit-1-part-4",
          "feature": "go-cau",
          "minutes": 14,
          "to": "/go-cau/lo-trinh-b1/crs_6af8d95af4cf480c2c?setup=1",
          "skippable": true,
          "hint": null,
          "kind": "typing",
          "kicker": "Gõ câu",
          "title": "Bản đồ thì: hoàn thành và tiếp diễn · Bài 4",
          "titleLead": "Bản đồ thì: hoàn thành và tiếp diễn",
          "titleTail": " · Bài 4",
          "partTitle": "Vẫn đang chờ từ sáng",
          "done": false,
          "skipped": false,
          "next": false
        },
        {
          "key": "typing:lo-trinh-b1/unit-1-part-5",
          "feature": "go-cau",
          "minutes": 15,
          "to": "/go-cau/lo-trinh-b1/crs_ae1ed2cfc00e37d174?setup=1",
          "skippable": true,
          "hint": null,
          "kind": "typing",
          "kicker": "Gõ câu",
          "title": "Bản đồ thì: hoàn thành và tiếp diễn · Bài 5",
          "titleLead": "Bản đồ thì: hoàn thành và tiếp diễn",
          "titleTail": " · Bài 5",
          "partTitle": "Bao lâu rồi và chưa xong",
          "done": false,
          "skipped": false,
          "next": false
        },
        {
          "key": "grammar:b1-past-perfect",
          "feature": "ngu-phap",
          "minutes": 6,
          "to": "/ngu-phap/b1-past-perfect",
          "skippable": true,
          "hint": null,
          "kind": "grammar-guide",
          "kicker": "Ngữ pháp · Bài hướng dẫn",
          "title": "Quá khứ hoàn thành",
          "titleLead": null,
          "titleTail": null,
          "partTitle": null,
          "done": false,
          "skipped": false,
          "next": false
        },
        {
          "key": "typing:lo-trinh-b1/unit-2-part-3",
          "feature": "go-cau",
          "minutes": 15,
          "to": "/go-cau/lo-trinh-b1/crs_2d19a63f05e546bf60?setup=1",
          "skippable": true,
          "hint": null,
          "kind": "typing",
          "kicker": "Gõ câu",
          "title": "Bản đồ thì: hoàn thành và tiếp diễn · Bài 3",
          "titleLead": "Bản đồ thì: hoàn thành và tiếp diễn",
          "titleTail": " · Bài 3",
          "partTitle": "Việc đã xong trước đó",
          "done": false,
          "skipped": false,
          "next": false
        },
        {
          "key": "typing:lo-trinh-b1/unit-2-part-4",
          "feature": "go-cau",
          "minutes": 15,
          "to": "/go-cau/lo-trinh-b1/crs_2f0f90e0bd1c47ea38?setup=1",
          "skippable": true,
          "hint": null,
          "kind": "typing",
          "kicker": "Gõ câu",
          "title": "Bản đồ thì: hoàn thành và tiếp diễn · Bài 4",
          "titleLead": "Bản đồ thì: hoàn thành và tiếp diễn",
          "titleTail": " · Bài 4",
          "partTitle": "Trước và sau trong quá khứ",
          "done": false,
          "skipped": false,
          "next": false
        },
        {
          "key": "grammar:b1-future-continuous",
          "feature": "ngu-phap",
          "minutes": 6,
          "to": "/ngu-phap/b1-future-continuous",
          "skippable": true,
          "hint": null,
          "kind": "grammar-guide",
          "kicker": "Ngữ pháp · Bài hướng dẫn",
          "title": "Tương lai tiếp diễn",
          "titleLead": null,
          "titleTail": null,
          "partTitle": null,
          "done": false,
          "skipped": false,
          "next": false
        },
        {
          "key": "typing:lo-trinh-b1/unit-2-part-5",
          "feature": "go-cau",
          "minutes": 15,
          "to": "/go-cau/lo-trinh-b1/crs_7110d98abf46c7e602?setup=1",
          "skippable": true,
          "hint": null,
          "kind": "typing",
          "kicker": "Gõ câu",
          "title": "Bản đồ thì: hoàn thành và tiếp diễn · Bài 5",
          "titleLead": "Bản đồ thì: hoàn thành và tiếp diễn",
          "titleTail": " · Bài 5",
          "partTitle": "Tương lai đang diễn ra",
          "done": false,
          "skipped": false,
          "next": false
        },
        {
          "key": "typing:lo-trinh-b1/unit-2-part-6",
          "feature": "go-cau",
          "minutes": 15,
          "to": "/go-cau/lo-trinh-b1/crs_30ce0ee017780f165d?setup=1",
          "skippable": true,
          "hint": null,
          "kind": "typing",
          "kicker": "Gõ câu",
          "title": "Bản đồ thì: hoàn thành và tiếp diễn · Bài 6",
          "titleLead": "Bản đồ thì: hoàn thành và tiếp diễn",
          "titleTail": " · Bài 6",
          "partTitle": "Bão lũ và việc đã xong",
          "done": false,
          "skipped": false,
          "next": false
        },
        {
          "key": "typing:lo-trinh-b1/unit-1-part-6",
          "feature": "go-cau",
          "minutes": 15,
          "to": "/go-cau/lo-trinh-b1/crs_4fb3d0ed5685677471?setup=1",
          "skippable": true,
          "hint": null,
          "kind": "typing",
          "kicker": "Gõ câu",
          "title": "Bản đồ thì: hoàn thành và tiếp diễn · Bài 6",
          "titleLead": "Bản đồ thì: hoàn thành và tiếp diễn",
          "titleTail": " · Bài 6",
          "partTitle": "Ôn tập hiện tại hoàn thành",
          "done": false,
          "skipped": false,
          "next": false
        }
      ]
    },
    {
      "index": 2,
      "label": "Làm được, phải làm, nên làm",
      "done": 0,
      "total": 9,
      "rows": [
        {
          "key": "grammar:b1-modal-ability-permission",
          "feature": "ngu-phap",
          "minutes": 6,
          "to": "/ngu-phap/b1-modal-ability-permission",
          "skippable": true,
          "hint": null,
          "kind": "grammar-guide",
          "kicker": "Ngữ pháp · Bài hướng dẫn",
          "title": "Khả năng: could, be able to",
          "titleLead": null,
          "titleTail": null,
          "partTitle": null,
          "done": false,
          "skipped": false,
          "next": false
        },
        {
          "key": "typing:lo-trinh-b1/unit-3-part-1",
          "feature": "go-cau",
          "minutes": 16,
          "to": "/go-cau/lo-trinh-b1/crs_70fe166265e51810d3?setup=1",
          "skippable": true,
          "hint": null,
          "kind": "typing",
          "kicker": "Gõ câu",
          "title": "Làm được, phải làm, nên làm · Bài 1",
          "titleLead": "Làm được, phải làm, nên làm",
          "titleTail": " · Bài 1",
          "partTitle": "Có thể làm được gì",
          "done": false,
          "skipped": false,
          "next": false
        },
        {
          "key": "typing:lo-trinh-b1/unit-3-part-4",
          "feature": "go-cau",
          "minutes": 16,
          "to": "/go-cau/lo-trinh-b1/crs_991247355be6da5a8a?setup=1",
          "skippable": true,
          "hint": null,
          "kind": "typing",
          "kicker": "Gõ câu",
          "title": "Làm được, phải làm, nên làm · Bài 4",
          "titleLead": "Làm được, phải làm, nên làm",
          "titleTail": " · Bài 4",
          "partTitle": "Vừa có thể vừa phải làm",
          "done": false,
          "skipped": false,
          "next": false
        },
        {
          "key": "grammar:b1-modal-obligation",
          "feature": "ngu-phap",
          "minutes": 6,
          "to": "/ngu-phap/b1-modal-obligation",
          "skippable": true,
          "hint": null,
          "kind": "grammar-guide",
          "kicker": "Ngữ pháp · Bài hướng dẫn",
          "title": "must hay have to; needn't",
          "titleLead": null,
          "titleTail": null,
          "partTitle": null,
          "done": false,
          "skipped": false,
          "next": false
        },
        {
          "key": "typing:lo-trinh-b1/unit-3-part-2",
          "feature": "go-cau",
          "minutes": 16,
          "to": "/go-cau/lo-trinh-b1/crs_d934f4746f93b75967?setup=1",
          "skippable": true,
          "hint": null,
          "kind": "typing",
          "kicker": "Gõ câu",
          "title": "Làm được, phải làm, nên làm · Bài 2",
          "titleLead": "Làm được, phải làm, nên làm",
          "titleTail": " · Bài 2",
          "partTitle": "Bắt buộc và không cần",
          "done": false,
          "skipped": false,
          "next": false
        },
        {
          "key": "grammar:b1-modal-ought-should",
          "feature": "ngu-phap",
          "minutes": 6,
          "to": "/ngu-phap/b1-modal-ought-should",
          "skippable": true,
          "hint": null,
          "kind": "grammar-guide",
          "kicker": "Ngữ pháp · Bài hướng dẫn",
          "title": "ought to và had better",
          "titleLead": null,
          "titleTail": null,
          "partTitle": null,
          "done": false,
          "skipped": false,
          "next": false
        },
        {
          "key": "typing:lo-trinh-b1/unit-3-part-3",
          "feature": "go-cau",
          "minutes": 14,
          "to": "/go-cau/lo-trinh-b1/crs_7105a1fa420a801faa?setup=1",
          "skippable": true,
          "hint": null,
          "kind": "typing",
          "kicker": "Gõ câu",
          "title": "Làm được, phải làm, nên làm · Bài 3",
          "titleLead": "Làm được, phải làm, nên làm",
          "titleTail": " · Bài 3",
          "partTitle": "Lời khuyên nên làm",
          "done": false,
          "skipped": false,
          "next": false
        },
        {
          "key": "typing:lo-trinh-b1/unit-3-part-5",
          "feature": "go-cau",
          "minutes": 15,
          "to": "/go-cau/lo-trinh-b1/crs_e43c881a99a80d0f53?setup=1",
          "skippable": true,
          "hint": null,
          "kind": "typing",
          "kicker": "Gõ câu",
          "title": "Làm được, phải làm, nên làm · Bài 5",
          "titleLead": "Làm được, phải làm, nên làm",
          "titleTail": " · Bài 5",
          "partTitle": "Khả năng bổn phận lời khuyên",
          "done": false,
          "skipped": false,
          "next": false
        },
        {
          "key": "typing:lo-trinh-b1/unit-3-part-6",
          "feature": "go-cau",
          "minutes": 15,
          "to": "/go-cau/lo-trinh-b1/crs_694680703b6c19a0b7?setup=1",
          "skippable": true,
          "hint": null,
          "kind": "typing",
          "kicker": "Gõ câu",
          "title": "Làm được, phải làm, nên làm · Bài 6",
          "titleLead": "Làm được, phải làm, nên làm",
          "titleTail": " · Bài 6",
          "partTitle": "Ôn tập chương khuyết thiếu",
          "done": false,
          "skipped": false,
          "next": false
        }
      ]
    },
    {
      "index": 3,
      "label": "Suy đoán và giả định",
      "done": 0,
      "total": 10,
      "rows": [
        {
          "key": "grammar:b1-conditionals-1-2",
          "feature": "ngu-phap",
          "minutes": 6,
          "to": "/ngu-phap/b1-conditionals-1-2",
          "skippable": true,
          "hint": null,
          "kind": "grammar-guide",
          "kicker": "Ngữ pháp · Bài hướng dẫn",
          "title": "Câu điều kiện loại 2",
          "titleLead": null,
          "titleTail": null,
          "partTitle": null,
          "done": false,
          "skipped": false,
          "next": false
        },
        {
          "key": "typing:lo-trinh-b1/unit-4-part-1",
          "feature": "go-cau",
          "minutes": 15,
          "to": "/go-cau/lo-trinh-b1/crs_fb618388d2fbd5eba6?setup=1",
          "skippable": true,
          "hint": null,
          "kind": "typing",
          "kicker": "Gõ câu",
          "title": "Suy đoán và giả định · Bài 1",
          "titleLead": "Suy đoán và giả định",
          "titleTail": " · Bài 1",
          "partTitle": "Điều kiện loại 1 khẳng định",
          "done": false,
          "skipped": false,
          "next": false
        },
        {
          "key": "typing:lo-trinh-b1/unit-4-part-2",
          "feature": "go-cau",
          "minutes": 16,
          "to": "/go-cau/lo-trinh-b1/crs_335a70fc5dff9ecd75?setup=1",
          "skippable": true,
          "hint": null,
          "kind": "typing",
          "kicker": "Gõ câu",
          "title": "Suy đoán và giả định · Bài 2",
          "titleLead": "Suy đoán và giả định",
          "titleTail": " · Bài 2",
          "partTitle": "Điều kiện loại 1 phủ định",
          "done": false,
          "skipped": false,
          "next": false
        }
      ]
    },
    {
      "index": 4,
      "label": "Tường thuật và mệnh đề thời gian",
      "done": 0,
      "total": 13,
      "rows": [
        {
          "key": "grammar:a2-reported-speech-intro",
          "feature": "ngu-phap",
          "minutes": 6,
          "to": "/ngu-phap/a2-reported-speech-intro",
          "skippable": true,
          "hint": null,
          "kind": "grammar-guide",
          "kicker": "Ngữ pháp · Bài hướng dẫn",
          "title": "Tường thuật và câu hỏi gián tiếp",
          "titleLead": null,
          "titleTail": null,
          "partTitle": null,
          "done": false,
          "skipped": false,
          "next": false
        },
        {
          "key": "typing:lo-trinh-b1/a2-unit-11-part-4",
          "feature": "go-cau",
          "minutes": 15,
          "to": "/go-cau/lo-trinh-b1/crs_d88d5ac22b47dda563?setup=1",
          "skippable": true,
          "hint": null,
          "kind": "typing",
          "kicker": "Gõ câu",
          "title": "Tường thuật và mệnh đề thời gian · Bài 4",
          "titleLead": "Tường thuật và mệnh đề thời gian",
          "titleTail": " · Bài 4",
          "partTitle": "Kể lại lời đã nói",
          "done": false,
          "skipped": false,
          "next": false
        },
        {
          "key": "typing:lo-trinh-b1/a2-unit-11-part-5",
          "feature": "go-cau",
          "minutes": 14,
          "to": "/go-cau/lo-trinh-b1/crs_d361cb571301a511d7?setup=1",
          "skippable": true,
          "hint": null,
          "kind": "typing",
          "kicker": "Gõ câu",
          "title": "Tường thuật và mệnh đề thời gian · Bài 5",
          "titleLead": "Tường thuật và mệnh đề thời gian",
          "titleTail": " · Bài 5",
          "partTitle": "Kể lại lời phủ định",
          "done": false,
          "skipped": false,
          "next": false
        }
      ]
    },
    {
      "index": 5,
      "label": "Tin tức và quy trình",
      "done": 0,
      "total": 13,
      "rows": [
        {
          "key": "grammar:a2-passive-basic",
          "feature": "ngu-phap",
          "minutes": 6,
          "to": "/ngu-phap/a2-passive-basic",
          "skippable": true,
          "hint": null,
          "kind": "grammar-guide",
          "kicker": "Ngữ pháp · Bài hướng dẫn",
          "title": "Bị động hiện tại và quá khứ",
          "titleLead": null,
          "titleTail": null,
          "partTitle": null,
          "done": false,
          "skipped": false,
          "next": false
        },
        {
          "key": "typing:lo-trinh-b1/a2-unit-9-part-1",
          "feature": "go-cau",
          "minutes": 15,
          "to": "/go-cau/lo-trinh-b1/crs_31f958bf1136c6e787?setup=1",
          "skippable": true,
          "hint": null,
          "kind": "typing",
          "kicker": "Gõ câu",
          "title": "Tin tức và quy trình · Bài 1",
          "titleLead": "Tin tức và quy trình",
          "titleTail": " · Bài 1",
          "partTitle": "Việc được làm hằng ngày",
          "done": false,
          "skipped": false,
          "next": false
        },
        {
          "key": "typing:lo-trinh-b1/a2-unit-9-part-2",
          "feature": "go-cau",
          "minutes": 15,
          "to": "/go-cau/lo-trinh-b1/crs_a9c8c9e57e644c6e71?setup=1",
          "skippable": true,
          "hint": null,
          "kind": "typing",
          "kicker": "Gõ câu",
          "title": "Tin tức và quy trình · Bài 2",
          "titleLead": "Tin tức và quy trình",
          "titleTail": " · Bài 2",
          "partTitle": "Việc đã được làm trong quá khứ",
          "done": false,
          "skipped": false,
          "next": false
        }
      ]
    },
    {
      "index": 6,
      "label": "Mô tả người và vật chi tiết",
      "done": 0,
      "total": 11,
      "rows": [
        {
          "key": "grammar:a2-relative-what-where",
          "feature": "ngu-phap",
          "minutes": 6,
          "to": "/ngu-phap/a2-relative-what-where",
          "skippable": true,
          "hint": null,
          "kind": "grammar-guide",
          "kicker": "Ngữ pháp · Bài hướng dẫn",
          "title": "what và where, when, why",
          "titleLead": null,
          "titleTail": null,
          "partTitle": null,
          "done": false,
          "skipped": false,
          "next": false
        },
        {
          "key": "typing:lo-trinh-b1/a2-unit-12-part-4",
          "feature": "go-cau",
          "minutes": 15,
          "to": "/go-cau/lo-trinh-b1/crs_4f2806bfd37b2d4077?setup=1",
          "skippable": true,
          "hint": null,
          "kind": "typing",
          "kicker": "Gõ câu",
          "title": "Mô tả người và vật chi tiết · Bài 4",
          "titleLead": "Mô tả người và vật chi tiết",
          "titleTail": " · Bài 4",
          "partTitle": "Điều mà tôi cần",
          "done": false,
          "skipped": false,
          "next": false
        },
        {
          "key": "typing:lo-trinh-b1/a2-unit-12-part-5",
          "feature": "go-cau",
          "minutes": 16,
          "to": "/go-cau/lo-trinh-b1/crs_825e8ffc58924550a1?setup=1",
          "skippable": true,
          "hint": null,
          "kind": "typing",
          "kicker": "Gõ câu",
          "title": "Mô tả người và vật chi tiết · Bài 5",
          "titleLead": "Mô tả người và vật chi tiết",
          "titleTail": " · Bài 5",
          "partTitle": "Nơi mà tôi lớn lên",
          "done": false,
          "skipped": false,
          "next": false
        }
      ]
    },
    {
      "index": 7,
      "label": "Hỏi đáp, phủ định, nhấn mạnh",
      "done": 0,
      "total": 15,
      "rows": [
        {
          "key": "grammar:b1-tag-questions",
          "feature": "ngu-phap",
          "minutes": 6,
          "to": "/ngu-phap/b1-tag-questions",
          "skippable": true,
          "hint": null,
          "kind": "grammar-guide",
          "kicker": "Ngữ pháp · Bài hướng dẫn",
          "title": "Câu hỏi đuôi",
          "titleLead": null,
          "titleTail": null,
          "partTitle": null,
          "done": false,
          "skipped": false,
          "next": false
        },
        {
          "key": "typing:lo-trinh-b1/unit-7-part-4",
          "feature": "go-cau",
          "minutes": 15,
          "to": "/go-cau/lo-trinh-b1/crs_51994a9b1565cb6222?setup=1",
          "skippable": true,
          "hint": null,
          "kind": "typing",
          "kicker": "Gõ câu",
          "title": "Hỏi đáp, phủ định, nhấn mạnh · Bài 4",
          "titleLead": "Hỏi đáp, phủ định, nhấn mạnh",
          "titleTail": " · Bài 4",
          "partTitle": "Câu hỏi đuôi với lời khẳng định",
          "done": false,
          "skipped": false,
          "next": false
        },
        {
          "key": "typing:lo-trinh-b1/unit-7-part-5",
          "feature": "go-cau",
          "minutes": 16,
          "to": "/go-cau/lo-trinh-b1/crs_78dc0a38fe9d4d41ab?setup=1",
          "skippable": true,
          "hint": null,
          "kind": "typing",
          "kicker": "Gõ câu",
          "title": "Hỏi đáp, phủ định, nhấn mạnh · Bài 5",
          "titleLead": "Hỏi đáp, phủ định, nhấn mạnh",
          "titleTail": " · Bài 5",
          "partTitle": "Câu hỏi đuôi với lời phủ định",
          "done": false,
          "skipped": false,
          "next": false
        }
      ]
    },
    {
      "index": 8,
      "label": "Đại từ, mạo từ, lượng từ",
      "done": 0,
      "total": 5,
      "rows": [
        {
          "key": "grammar:b1-pronouns-advanced",
          "feature": "ngu-phap",
          "minutes": 6,
          "to": "/ngu-phap/b1-pronouns-advanced",
          "skippable": true,
          "hint": null,
          "kind": "grammar-guide",
          "kicker": "Ngữ pháp · Bài hướng dẫn",
          "title": "Đại từ phản thân và tương hỗ",
          "titleLead": null,
          "titleTail": null,
          "partTitle": null,
          "done": false,
          "skipped": false,
          "next": false
        },
        {
          "key": "typing:lo-trinh-b1/unit-9-part-1",
          "feature": "go-cau",
          "minutes": 15,
          "to": "/go-cau/lo-trinh-b1/crs_9e6be663f4f90513e0?setup=1",
          "skippable": true,
          "hint": null,
          "kind": "typing",
          "kicker": "Gõ câu",
          "title": "Đại từ, mạo từ, lượng từ · Bài 1",
          "titleLead": "Đại từ, mạo từ, lượng từ",
          "titleTail": " · Bài 1",
          "partTitle": "Đồ của tôi hay của bạn",
          "done": false,
          "skipped": false,
          "next": false
        },
        {
          "key": "typing:lo-trinh-b1/unit-9-part-2",
          "feature": "go-cau",
          "minutes": 15,
          "to": "/go-cau/lo-trinh-b1/crs_fd43c864364a9483fc?setup=1",
          "skippable": true,
          "hint": null,
          "kind": "typing",
          "kicker": "Gõ câu",
          "title": "Đại từ, mạo từ, lượng từ · Bài 2",
          "titleLead": "Đại từ, mạo từ, lượng từ",
          "titleTail": " · Bài 2",
          "partTitle": "Tự mình làm lấy",
          "done": false,
          "skipped": false,
          "next": false
        }
      ]
    },
    {
      "index": 9,
      "label": "Trạng từ bình luận và nối câu",
      "done": 0,
      "total": 6,
      "rows": [
        {
          "key": "grammar:b1-adverbs-attitude",
          "feature": "ngu-phap",
          "minutes": 6,
          "to": "/ngu-phap/b1-adverbs-attitude",
          "skippable": true,
          "hint": null,
          "kind": "grammar-guide",
          "kicker": "Ngữ pháp · Bài hướng dẫn",
          "title": "Trạng từ bình luận",
          "titleLead": null,
          "titleTail": null,
          "partTitle": null,
          "done": false,
          "skipped": false,
          "next": false
        },
        {
          "key": "typing:lo-trinh-b1/unit-9-part-3",
          "feature": "go-cau",
          "minutes": 14,
          "to": "/go-cau/lo-trinh-b1/crs_ebb4f9781611b589ee?setup=1",
          "skippable": true,
          "hint": null,
          "kind": "typing",
          "kicker": "Gõ câu",
          "title": "Trạng từ bình luận và nối câu · Bài 3",
          "titleLead": "Trạng từ bình luận và nối câu",
          "titleTail": " · Bài 3",
          "partTitle": "Thật không may",
          "done": false,
          "skipped": false,
          "next": false
        },
        {
          "key": "typing:lo-trinh-b1/unit-9-part-4",
          "feature": "go-cau",
          "minutes": 15,
          "to": "/go-cau/lo-trinh-b1/crs_a27a94d9b0d02359a8?setup=1",
          "skippable": true,
          "hint": null,
          "kind": "typing",
          "kicker": "Gõ câu",
          "title": "Trạng từ bình luận và nối câu · Bài 4",
          "titleLead": "Trạng từ bình luận và nối câu",
          "titleTail": " · Bài 4",
          "partTitle": "Nói thật lòng",
          "done": false,
          "skipped": false,
          "next": false
        }
      ]
    },
    {
      "index": 10,
      "label": "Mức độ và so sánh",
      "done": 0,
      "total": 8,
      "rows": [
        {
          "key": "grammar:b1-degree-too-so-how",
          "feature": "ngu-phap",
          "minutes": 6,
          "to": "/ngu-phap/b1-degree-too-so-how",
          "skippable": true,
          "hint": null,
          "kind": "grammar-guide",
          "kicker": "Ngữ pháp · Bài hướng dẫn",
          "title": "Mức độ: too, so … that",
          "titleLead": null,
          "titleTail": null,
          "partTitle": null,
          "done": false,
          "skipped": false,
          "next": false
        },
        {
          "key": "typing:lo-trinh-b1/unit-6-part-4",
          "feature": "go-cau",
          "minutes": 13,
          "to": "/go-cau/lo-trinh-b1/crs_9d962d666272786d97?setup=1",
          "skippable": true,
          "hint": null,
          "kind": "typing",
          "kicker": "Gõ câu",
          "title": "Mức độ và so sánh · Bài 4",
          "titleLead": "Mức độ và so sánh",
          "titleTail": " · Bài 4",
          "partTitle": "Quá cay để ăn",
          "done": false,
          "skipped": false,
          "next": false
        },
        {
          "key": "grammar:b1-comparatives-advanced",
          "feature": "ngu-phap",
          "minutes": 6,
          "to": "/ngu-phap/b1-comparatives-advanced",
          "skippable": true,
          "hint": null,
          "kind": "grammar-guide",
          "kicker": "Ngữ pháp · Bài hướng dẫn",
          "title": "So sánh tăng tiến và nhấn mạnh",
          "titleLead": null,
          "titleTail": null,
          "partTitle": null,
          "done": false,
          "skipped": false,
          "next": false
        }
      ]
    },
    {
      "index": 11,
      "label": "Tổng hợp B1",
      "done": 0,
      "total": 10,
      "rows": [
        {
          "key": "typing:lo-trinh-b1/unit-12-part-1",
          "feature": "go-cau",
          "minutes": 15,
          "to": "/go-cau/lo-trinh-b1/crs_9dc1fabbeb6cd0508f?setup=1",
          "skippable": true,
          "hint": null,
          "kind": "typing",
          "kicker": "Gõ câu",
          "title": "Tổng hợp B1 · Bài 1",
          "titleLead": "Tổng hợp B1",
          "titleTail": " · Bài 1",
          "partTitle": "Chuyến leo núi hụt",
          "done": false,
          "skipped": false,
          "next": false
        },
        {
          "key": "typing:lo-trinh-b1/unit-12-part-2",
          "feature": "go-cau",
          "minutes": 14,
          "to": "/go-cau/lo-trinh-b1/crs_bc9c7f4c106aa57831?setup=1",
          "skippable": true,
          "hint": null,
          "kind": "typing",
          "kicker": "Gõ câu",
          "title": "Tổng hợp B1 · Bài 2",
          "titleLead": "Tổng hợp B1",
          "titleTail": " · Bài 2",
          "partTitle": "Đáng lẽ và chắc hẳn",
          "done": false,
          "skipped": false,
          "next": false
        },
        {
          "key": "typing:lo-trinh-b1/unit-12-part-4",
          "feature": "go-cau",
          "minutes": 16,
          "to": "/go-cau/lo-trinh-b1/crs_ada2ed44bb784b7b56?setup=1",
          "skippable": true,
          "hint": null,
          "kind": "typing",
          "kicker": "Gõ câu",
          "title": "Tổng hợp B1 · Bài 4",
          "titleLead": "Tổng hợp B1",
          "titleTail": " · Bài 4",
          "partTitle": "Cuộc sống dạo này",
          "done": false,
          "skipped": false,
          "next": false
        }
      ]
    }
  ],
  "skipped": [],
  "levelTest": {
    "open": true,
    "inProgress": false,
    "retryAt": null,
    "completed": false
  },
  "target": {
    "level": "B1",
    "name": "TOEIC 785",
    "isDefault": true,
    "reached": false,
    "eta": {
      "state": "plan",
      "weeksLo": 14,
      "weeksHi": 19,
      "minutesPerDay": 45
    },
    "etaText": "Dự kiến khoảng 3 tháng để đạt TOEIC 785"
  }
};
