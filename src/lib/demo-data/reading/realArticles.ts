// realArticles — BÀI ĐỌC THẬT của aioenglish.com trích qua engine tung-cau
// (GET /api/translation/tung-cau/{id} + POST reveal từng câu — sinh bởi
// _agent-scripts/build-reading-real.mjs từ các file aio-reading-articles*.json).
// Trong quá trình trích dở: REAL_ARTICLES có bao nhiêu bài dùng bấy nhiêu,
// phần còn lại của ARTICLES là corpus Tatoeba (xem articles.ts).
import realJson from "./articles-real.json";

export type RealArticleSentence = {
  en: string;
  vi: string;
  /** Chú thích ngữ pháp tiếng Việt của site gốc (có thể null) */
  noteVi: string | null;
  /** Số đoạn (0 = đoạn đầu) */
  paragraph: number;
};

export type RealArticle = {
  id: string;
  slug: string;
  title: string;
  titleVi: string | null;
  topic: string;
  level: string;
  minutes: number;
  intro: string;
  wordCount: number;
  sentences: RealArticleSentence[];
};

export const REAL_ARTICLES = realJson as unknown as RealArticle[];

export const REAL_ARTICLE_COUNT = REAL_ARTICLES.length;

/** 12 chủ đề thật theo thứ tự catalog của site. */
export const REAL_TOPIC_ORDER = [
  "Du lịch",
  "Văn phòng",
  "Hội thuyết trình",
  "Email công việc",
  "Giao thông",
  "Mua sắm",
  "Nhà cửa gia đình",
  "Phỏng vấn",
  "Nhà hàng ẩm thực",
  "Sự kiện lễ hội",
  "Y tế sức khỏe",
  "Thời tiết",
] as const;
