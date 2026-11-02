// articles.ts — bài đọc song ngữ cho tính năng "Đọc & dịch" (/luyen-dich-thuat).
//
// Nguồn dữ liệu:
// - 266 bài THẬT của site (12 chủ đề thực dụng: Du lịch / Văn phòng / Hội
//   thuyết trình / ...) — trích qua engine tung-cau, sinh bởi
//   _agent-scripts/build-reading-real.mjs → articles-real.json (realArticles.ts).
//   Đang trích dở: có bao nhiêu dùng bấy nhiêu, đặt ĐẦU mảng.
// - 258 bài sinh từ corpus Tatoeba (CC-BY 2.0 FR, qua tienhapt/generalcorpus)
//   + 8 bài tự soạn — làm phần lấp cho đến khi trích đủ 266 bài thật.
// Dùng cho 2 chế độ: Đọc (hiện nghĩa từng câu) và Dịch có chấm điểm.
//
// ⚠️ Bài sinh là ghép câu theo chủ đề (sentence bank) — không phải bài liền mạch.

import articlesGenerated from "./articles-generated.json";
import { REAL_ARTICLES, REAL_TOPIC_ORDER } from "./realArticles";

export type ArticleTopic =
  // 12 chủ đề thật của site
  | "Du lịch"
  | "Văn phòng"
  | "Hội thuyết trình"
  | "Email công việc"
  | "Giao thông"
  | "Mua sắm"
  | "Nhà cửa gia đình"
  | "Phỏng vấn"
  | "Nhà hàng ẩm thực"
  | "Sự kiện lễ hội"
  | "Y tế sức khỏe"
  | "Thời tiết"
  // 8 chủ đề cũ của phần sinh/tự soạn (fallback khi chưa trích đủ)
  | "Tin tức"
  | "Kinh doanh"
  | "Khoa học"
  | "Đời sống"
  | "Văn hóa"
  | "Thể thao"
  | "Công nghệ";

export type ArticleLevel = "A1" | "A2" | "B1" | "B2";

export type ArticleSentence = {
  en: string;
  vi: string;
  /** Chú thích ngữ pháp VI của site gốc (chỉ bài thật có) */
  noteVi?: string | null;
  /** Số đoạn (0 = đoạn đầu) — chỉ bài thật dùng để ngắt đoạn */
  paragraph?: number;
};

export type DemoArticle = {
  id: string;
  slug: string;
  title: string;
  /** Tiêu đề tiếng Việt của site gốc (chỉ bài thật có) */
  titleVi?: string | null;
  topic: ArticleTopic;
  level: ArticleLevel;
  /** Thời gian ước tính cho 1 lượt đọc/dịch (phút). */
  minutes: number;
  /** Câu mở đầu ngắn (viết tắt trên card chủ đề). */
  intro: string;
  /** Số từ của bài (bài thật có từ metadata site). */
  wordCount?: number;
  sentences: ArticleSentence[];
};

export const ARTICLES: DemoArticle[] = [
  // Bài THẬT (đang trích dở — có bao nhiêu dùng bấy nhiêu) đầu mảng,
  // sau đó 258 bài corpus Tatoeba + 8 bài tự soạn làm phần lấp.
  ...(REAL_ARTICLES as DemoArticle[]),
  ...(articlesGenerated as DemoArticle[]),
  {
    id: "art_news_carfree",
    slug: "chu-nhat-khong-o-to",
    title: "The city tries a car-free Sunday",
    topic: "Tin tức",
    level: "B1",
    minutes: 6,
    intro:
      "Chủ nhật vừa qua, trung tâm thành phố cấm xe máy và ô tô trong 6 giờ để người dân đi bộ và đạp xe.",
    sentences: [
      {
        en: "Last Sunday, the city closed five central streets to cars for six hours.",
        vi: "Chủ nhật vừa qua, thành phố cấm ô tô trên năm con phố trung tâm trong sáu giờ.",
      },
      {
        en: "Families walked in the middle of the road while children painted on the pavement.",
        vi: "Các gia đình đi bộ giữa đường trong khi trẻ em vẽ lên vỉa hè.",
      },
      {
        en: "Small shops along the streets said they sold twice as much as a normal Sunday.",
        vi: "Các cửa hàng nhỏ dọc phố cho biết họ bán được gấp đôi một chủ nhật bình thường.",
      },
      {
        en: "Some drivers complained about long detours in the morning.",
        vi: "Một số tài xế phàn nàn về việc phải đi vòng dài vào buổi sáng.",
      },
      {
        en: "The city council will review the results before deciding to repeat the event.",
        vi: "Hội đồng thành phố sẽ xem xét kết quả trước khi quyết định tổ chức lại sự kiện này.",
      },
    ],
  },
  {
    id: "art_biz_coffee",
    slug: "quan-ca-phe-nho-giu-khach",
    title: "Small coffee shops win loyal customers",
    topic: "Kinh doanh",
    level: "B2",
    minutes: 8,
    intro:
      "Khi các chuỗi lớn mọc lên khắp nơi, những quán nhỏ sống sót nhờ ghi nhớ tên khách và một chút lòng tin.",
    sentences: [
      {
        en: "Big chains can sell coffee cheaper, but small shops know every regular by name.",
        vi: "Các chuỗi lớn có thể bán cà phê rẻ hơn, nhưng quán nhỏ thì nhớ tên từng khách quen.",
      },
      {
        en: "Many owners now let customers pay after their drink instead of before it.",
        vi: "Nhiều chủ quán hiện cho khách trả tiền sau khi uống thay vì trả trước.",
      },
      {
        en: "That small act of trust brings people back three or four times a week.",
        vi: "Hành động tin tưởng nhỏ bé đó khiến khách quay lại ba đến bốn lần mỗi tuần.",
      },
      {
        en: "Owners also share their costs openly on a board behind the counter.",
        vi: "Chủ quán còn công khai chi phí của mình trên một tấm bảng sau quầy.",
      },
      {
        en: "When customers understand the price of rent and milk, they stop asking for discounts.",
        vi: "Khi khách hiểu giá tiền thuê mặt bằng và sữa, họ không còn đòi giảm giá nữa.",
      },
    ],
  },
  {
    id: "art_sci_robots",
    slug: "robot-phan-loai-rac",
    title: "Scientists teach robots to sort recycling",
    topic: "Khoa học",
    level: "B1",
    minutes: 7,
    intro:
      "Một nhóm nghiên cứu huấn luyện robot dùng camera thường để nhặt rác tái chế khỏi băng chuyền.",
    sentences: [
      {
        en: "A research team trained a robot arm to pick recycling from a moving belt.",
        vi: "Một nhóm nghiên cứu đã huấn luyện cánh tay robot nhặt rác tái chế từ băng chuyền đang chạy.",
      },
      {
        en: "The robot uses two normal cameras instead of an expensive special sensor.",
        vi: "Robot dùng hai camera thường thay cho một cảm biến đặc biệt đắt tiền.",
      },
      {
        en: "It learned the job from twenty thousand photos of crushed bottles and cans.",
        vi: "Nó học công việc này từ hai mươi nghìn bức ảnh về chai lọ và lon bị nghiền.",
      },
      {
        en: "In factory tests, the robot matched the speed of a trained worker.",
        vi: "Trong các buổi thử nghiệm tại nhà máy, robot đạt tốc độ của một công nhân lành nghề.",
      },
      {
        en: "The team hopes cheaper robots will bring sorting machines to smaller towns.",
        vi: "Nhóm nghiên cứu hy vọng robot giá rẻ sẽ đưa máy phân loại về các thị trấn nhỏ hơn.",
      },
    ],
  },
  {
    id: "art_life_walk",
    slug: "buoc-chan-buoi-sang",
    title: "A ten-minute morning walk can change your day",
    topic: "Đời sống",
    level: "A2",
    minutes: 5,
    intro:
      "Không cần phòng gym: mười phút đi bộ sớm giúp tinh thần sáng suốt hơn cả một ly cà phê, theo khảo sát nhỏ.",
    sentences: [
      {
        en: "You do not need a gym to feel better in the morning.",
        vi: "Bạn không cần phòng gym để thấy dễ chịu hơn vào buổi sáng.",
      },
      {
        en: "A ten-minute walk outside wakes up your body better than a second cup of coffee.",
        vi: "Mười phút đi bộ ngoài trời đánh thức cơ thể tốt hơn tách cà phê thứ hai.",
      },
      {
        en: "Morning light tells your brain that the day has started.",
        vi: "Ánh sáng buổi sáng báo cho não bộ biết ngày mới đã bắt đầu.",
      },
      {
        en: "People who walk early also sleep faster at night.",
        vi: "Những người đi bộ sớm cũng ngủ nhanh hơn vào buổi tối.",
      },
      {
        en: "Try it tomorrow: leave your phone at home and just look around.",
        vi: "Hãy thử vào ngày mai: để điện thoại ở nhà và chỉ đơn giản là nhìn quanh.",
      },
    ],
  },
  {
    id: "art_culture_lantern",
    slug: "dem-den-long-pho-co",
    title: "Lantern night returns to the old quarter",
    topic: "Văn hóa",
    level: "B1",
    minutes: 7,
    intro:
      "Lễ hội đèn lồng trở lại sau ba năm, với nghề thủ công truyền thống và đêm phố đi bộ không bán đồ nhựa.",
    sentences: [
      {
        en: "After three quiet years, the lantern festival returned to the old quarter.",
        vi: "Sau ba năm im ắng, lễ hội đèn lồng đã trở lại khu phố cổ.",
      },
      {
        en: "Local craftsmen showed visitors how to bend bamboo into thin frames.",
        vi: "Nghệ nhân địa phương hướng dẫn du khách uốn tre thành những khung mảnh.",
      },
      {
        en: "This year the organizers banned plastic decorations completely.",
        vi: "Năm nay ban tổ chức cấm hoàn toàn đồ trang trí bằng nhựa.",
      },
      {
        en: "At eight o'clock, thousands of lanterns lit up the narrow streets at once.",
        vi: "Tám giờ tối, hàng nghìn chiếc đèn lồng cùng lúc thắp sáng những con phố hẹp.",
      },
      {
        en: "Elderly residents say the night looked exactly like their childhood.",
        vi: "Những người dân lớn tuổi nói rằng đêm nay nhìn hệt như tuổi thơ của họ.",
      },
    ],
  },
  {
    id: "art_sport_swimmer",
    slug: "duong-dai-cua-co-be-boi",
    title: "A swimmer's slow road to the finals",
    topic: "Thể thao",
    level: "B2",
    minutes: 8,
    intro:
      "Mười hai năm tập, ba lần bỏ lỡ vòng chung kết — và một chiến thuật lạ: bơi chậm hơn ở chặng đầu.",
    sentences: [
      {
        en: "Mai trained for twelve years before reaching her first national final.",
        vi: "Mai tập luyện mười hai năm trước khi vào chung kết quốc gia đầu tiên.",
      },
      {
        en: "Twice she went too fast at the start and lost power in the last length.",
        vi: "Hai lần cô bơi quá nhanh ở đoạn đầu và mất lực ở cự ly cuối.",
      },
      {
        en: "Her new coach made a strange request: swim the first half slower.",
        vi: "Huấn luyện viên mới đưa ra yêu cầu lạ: hãy bơi nửa đầu chậm hơn.",
      },
      {
        en: "Mai felt embarrassed, but her final time improved by more than a second.",
        vi: "Mai thấy ngại, nhưng thành tích chung kết của cô cải thiện hơn một giây.",
      },
      {
        en: "She now tells young swimmers that patience is also a technique.",
        vi: "Giờ cô kể với các vận động viên trẻ rằng kiên nhẫn cũng là một kỹ thuật.",
      },
    ],
  },
  {
    id: "art_travel_mountains",
    slug: "ba-cach-re-di-vung-cao",
    title: "Three cheap ways to see the mountains",
    topic: "Du lịch",
    level: "A2",
    minutes: 5,
    intro:
      "Không cần tour đắt đỏ: xe bus địa phương, homestay nấu cơm chung và đi bộ với bản đồ giấy.",
    sentences: [
      {
        en: "You don't need an expensive tour to enjoy the mountains.",
        vi: "Bạn không cần một tour đắt tiền để tận hưởng vùng núi.",
      },
      {
        en: "First, take the local bus instead of a private car; it costs less than a sandwich.",
        vi: "Thứ nhất, đi xe bus địa phương thay vì ô tô riêng; nó rẻ hơn một cái bánh mì kẹp.",
      },
      {
        en: "Second, stay in a family homestay and help cook dinner.",
        vi: "Thứ hai, ở nhà dân và giúp nấu bữa tối.",
      },
      {
        en: "Third, borrow a paper map and walk to the next village yourself.",
        vi: "Thứ ba, mượn một tấm bản đồ giấy và tự đi bộ đến ngôi làng bên cạnh.",
      },
      {
        en: "Locals usually point out the best viewpoint that no website mentions.",
        vi: "Người địa phương thường chỉ cho bạn điểm ngắm cảnh đẹp nhất mà không website nào nhắc đến.",
      },
    ],
  },
  {
    id: "art_tech_sleep",
    slug: "ung-dung-ngu-ngon",
    title: "Sleep apps promise better nights",
    topic: "Công nghệ",
    level: "B1",
    minutes: 6,
    intro:
      "Ứng dụng giấc ngủ bùng nổ: đo tiếng ngáy, vẽ đồ thị đêm — nhưng chuyên gia nói thói quen quan trọng hơn số liệu.",
    sentences: [
      {
        en: "Sleep apps have become one of the fastest-growing categories in the app store.",
        vi: "Ứng dụng giấc ngủ đã trở thành một trong những nhóm phát triển nhanh nhất trên cửa hàng ứng dụng.",
      },
      {
        en: "They record snoring, draw charts of your night, and ring a gentle alarm.",
        vi: "Chúng ghi âm tiếng ngáy, vẽ đồ thị đêm ngủ của bạn và reo chuông báo thức nhẹ nhàng.",
      },
      {
        en: "Doctors warn that the numbers are estimates, not medical measurements.",
        vi: "Các bác sĩ cảnh báo rằng những con số này chỉ là ước lượng, không phải đo lường y khoa.",
      },
      {
        en: "Worrying too much about sleep scores can keep people awake.",
        vi: "Lo lắng quá nhiều về điểm ngủ có thể khiến người ta mất ngủ.",
      },
      {
        en: "The best feature, experts say, is a reminder to put the phone away at night.",
        vi: "Tính năng tốt nhất, theo chuyên gia, là lời nhắc cất điện thoại vào ban đêm.",
      },
    ],
  },
];

export const READING_TOPICS: ArticleTopic[] = [
  // 12 chủ đề thật của site (theo catalog) trước — chỉ giữ topic có bài,
  // sau đó các topic cũ của phần sinh/tự soạn.
  ...REAL_TOPIC_ORDER.filter((t) => ARTICLES.some((a) => a.topic === t)),
  ...[...new Set(ARTICLES.map((a) => a.topic))].filter((t) => !(REAL_TOPIC_ORDER as readonly string[]).includes(t)),
] as ArticleTopic[];

/** Tổng số bài trên site thật (chip trên hub + dashboard). */
export const SITE_ARTICLE_COUNT = 266;

export function articleBySlug(slug: string): DemoArticle | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}

/** Bài đọc là bài THẬT (có titleVi/paragraph — phân biệt bài corpus fallback). */
export function isRealArticle(a: DemoArticle): boolean {
  return Boolean(a.titleVi) && a.sentences.some((s) => "paragraph" in s);
}
