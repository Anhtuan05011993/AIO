// videos.ts — 4 bài học video demo cho "Dictation & Shadowing" (/video).
//
// Trang thật của aioenglish.com có 1.166 video luyện nghe; bản demo giữ 4 bài
// đại diện. Người dùng dán link YouTube của riêng họ vào workspace — transcript
// bên dưới chỉ là nội dung demo để tập gõ chính tả và nói theo (luyện nhịp).
//
// ⚠️ Transcript là "Nội dung demo" tự soạn — KHÔNG hardcode video ID thật
//    (URL YouTube do người dùng nhập là tính năng chính của trang).

export type VideoLevel = "A2" | "B1" | "B2";

export type DemoVideoLesson = {
  id: string;
  slug: string;
  title: string;
  level: VideoLevel;
  minutes: number;
  /** Gợi ý loại video phù hợp để người dùng tự tìm trên YouTube. */
  hint: string;
  /** Transcript demo 4–5 câu để tập dictation / shadowing. */
  transcript: { en: string; vi: string }[];
};

export const VIDEO_LESSONS: DemoVideoLesson[] = [
  {
    id: "vid_daily_food",
    slug: "chao-buoi-sang-do-an",
    title: "Morning routines and breakfast around the world",
    level: "A2",
    minutes: 10,
    hint: "Tìm video ngắn 2–4 phút về bữa sáng ở các nước.",
    transcript: [
      {
        en: "Breakfast looks different in every country.",
        vi: "Bữa sáng trông khác nhau ở mỗi quốc gia.",
      },
      {
        en: "In Japan, many people eat rice and soup in the morning.",
        vi: "Ở Nhật Bản, nhiều người ăn cơm và súp vào buổi sáng.",
      },
      {
        en: "In Brazil, a small piece of cake with coffee is enough.",
        vi: "Ở Brazil, một miếng bánh nhỏ với cà phê là đủ.",
      },
      {
        en: "Some people are too busy, so they skip breakfast completely.",
        vi: "Một số người quá bận rộn nên bỏ hẳn bữa sáng.",
      },
      {
        en: "Experts say a simple meal is better than no meal at all.",
        vi: "Chuyên gia nói rằng một bữa ăn đơn giản vẫn tốt hơn là không ăn gì.",
      },
    ],
  },
  {
    id: "vid_small_talk",
    slug: "hoi-thoai-ngan-voi-nguoi-la",
    title: "Small talk: how to start a friendly conversation",
    level: "B1",
    minutes: 12,
    hint: "Tìm video luyện small talk cho người học tiếng Anh.",
    transcript: [
      {
        en: "Small talk is a short, friendly conversation about everyday things.",
        vi: "Small talk là một cuộc trò chuyện ngắn, thân thiện về những việc thường ngày.",
      },
      {
        en: "The weather is the safest topic in almost every country.",
        vi: "Thời tiết là chủ đề an toàn nhất ở hầu hết mọi quốc gia.",
      },
      {
        en: "Try to ask open questions instead of yes or no questions.",
        vi: "Hãy thử hỏi những câu mở thay vì các câu hỏi có hoặc không.",
      },
      {
        en: "When someone answers, react to their words before you change the topic.",
        vi: "Khi ai đó trả lời, hãy phản hồi lời họ trước khi bạn đổi chủ đề.",
      },
      {
        en: "Ending politely is easy: say it was nice talking to them.",
        vi: "Kết thúc lịch sự thì dễ: hãy nói rằng bạn rất vui được trò chuyện với họ.",
      },
    ],
  },
  {
    id: "vid_city_transport",
    slug: "di-lai-o-thanh-pho-lon",
    title: "Getting around a big city without a car",
    level: "B1",
    minutes: 15,
    hint: "Tìm vlog đi lại bằng tàu điện hoặc xe đạp công cộng.",
    transcript: [
      {
        en: "Big cities are built for people who do not own a car.",
        vi: "Các thành phố lớn được xây dựng cho những người không có ô tô.",
      },
      {
        en: "The metro is fast, but it is crowded between eight and nine in the morning.",
        vi: "Tàu điện nhanh, nhưng rất đông giữa tám và chín giờ sáng.",
      },
      {
        en: "City bikes are cheap if you keep every ride under thirty minutes.",
        vi: "Xe đạp công cộng rẻ nếu bạn giữ mỗi chuyến dưới ba mươi phút.",
      },
      {
        en: "Most transport apps now show the cheapest route, not just the fastest one.",
        vi: "Hầu hết ứng dụng giao thông giờ hiển thị tuyến rẻ nhất, chứ không chỉ tuyến nhanh nhất.",
      },
      {
        en: "Walking the last kilometer is often quicker than waiting for a bus.",
        vi: "Đi bộ cây số cuối thường nhanh hơn là chờ xe bus.",
      },
    ],
  },
  {
    id: "vid_work_email",
    slug: "viet-email-cong-viec",
    title: "Writing short, clear emails at work",
    level: "B2",
    minutes: 18,
    hint: "Tìm video business English về email ngắn gọn.",
    transcript: [
      {
        en: "A good work email answers one question in the first two lines.",
        vi: "Một email công việc tốt trả lời một câu hỏi ngay trong hai dòng đầu tiên.",
      },
      {
        en: "Long introductions make busy readers search for your point.",
        vi: "Những đoạn mở đầu dài khiến người đọc bận rộn phải tìm ý chính của bạn.",
      },
      {
        en: "Put your request in a separate line with a clear deadline.",
        vi: "Đặt yêu cầu của bạn trên một dòng riêng với thời hạn rõ ràng.",
      },
      {
        en: "If the thread grows past five replies, pick up the phone instead.",
        vi: "Nếu chuỗi thư dài quá năm lượt trả lời, hãy nhấc máy gọi điện thay thế.",
      },
      {
        en: "Short emails are a sign of respect for other people's time.",
        vi: "Email ngắn gọn là biểu hiện của sự tôn trọng thời gian của người khác.",
      },
    ],
  },
];

export const SITE_VIDEO_COUNT = 1166;

export function videoBySlug(slug: string): DemoVideoLesson | undefined {
  return VIDEO_LESSONS.find((v) => v.slug === slug);
}
