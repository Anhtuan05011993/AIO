// Vocab demo data — assembled from public GitHub datasets (see docs/research/aioenglish/DATA-SOURCES.md):
// - TOEIC 600: repo tranngocminhhieu/toeic-600-words-dataset (wordlist công khai của tienganhtflat.com)
// - Oxford 3000 (A1/A2/B1/B2): repo tyypgzl/Oxford-5000-words (Oxford 3000/5000 wordlist)
import toeicJson from "./toeic-600.json";
import oxfordB1 from "./oxford-3000-b1.json";
import oxfordA1 from "./oxford-3000-a1.json";
import oxfordA2 from "./oxford-3000-a2.json";
import oxfordB2 from "./oxford-3000-b2.json";

export type VocabCard = {
  word: string;
  pos: string;
  vi: string;
  ipa?: string;
  explain?: string;
  example?: string;
  exampleVi?: string;
  topic?: string;
  audio?: string; // absolute mp3 url (TOEIC set only)
  level?: string;
};

export type VocabCourseKey =
  | "toeic-600"
  | "oxford-3000-a1"
  | "oxford-3000-a2"
  | "oxford-3000-b1"
  | "oxford-3000-b2";

export const VOCAB_COURSES: Record<
  VocabCourseKey,
  { title: string; subtitle: string; cards: VocabCard[] }
> = {
  "toeic-600": {
    title: "TOEIC 600 essential words",
    subtitle: "600 từ cốt lõi TOEIC theo chủ đề · có nghĩa tiếng Việt + ví dụ + audio",
    cards: toeicJson as VocabCard[],
  },
  "oxford-3000-a1": {
    title: "Oxford 3000 · A1",
    subtitle: "Từ cốt lõi Oxford trình độ A1 · 898 từ",
    cards: oxfordA1 as VocabCard[],
  },
  "oxford-3000-a2": {
    title: "Oxford 3000 · A2",
    subtitle: "Từ cốt lõi Oxford trình độ A2 · 867 từ",
    cards: oxfordA2 as VocabCard[],
  },
  "oxford-3000-b1": {
    title: "Oxford 3000 · B1",
    subtitle: "Từ cốt lõi Oxford xếp theo CEFR · 902 từ trình độ B1",
    cards: oxfordB1 as VocabCard[],
  },
  "oxford-3000-b2": {
    title: "Oxford 3000 · B2",
    subtitle: "Từ cốt lõi Oxford trình độ B2 · 1.428 từ",
    cards: oxfordB2 as VocabCard[],
  },
};

export function getVocabCourse(key: string): { key: VocabCourseKey; title: string; subtitle: string; cards: VocabCard[] } | undefined {
  const k = key as VocabCourseKey;
  const c = VOCAB_COURSES[k];
  return c ? { key: k, ...c } : undefined;
}
