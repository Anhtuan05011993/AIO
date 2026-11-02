/**
 * demoLessons — nội dung đọc (guide) cho từng node ngữ pháp của catalog.
 *
 * Nguồn dữ liệu gốc chỉ có tiêu đề + số bài tập theo 4 chế độ (transform / fix /
 * gap / choice) — KHÔNG có phần giải thích. Do đó:
 *  - `intro` + `points`: giải thích tiếng Việt do dự án biên soạn cho bản demo
 *    (hiển thị kèm nhãn "Nội dung demo" trên trang đọc).
 *  - `examples`: cặp câu EN/VN soạn sẵn, CHỈ dùng cho node KHÔNG map được khóa
 *    gõ câu nào (xem nodeCourses.ts). Node có khóa liên quan sẽ lấy câu ví dụ
 *    thật từ statements của khóa qua getCourseAsync.
 * Biên soạn demo cho ĐỦ catalog A1→C2: 65 entry gốc (A1 + B1) và 102 entry
 * thêm cho A2 / B2 / C1 / C2 (mỗi node mới đều có examples vì không map khóa).
 * Văn phong bám giáo trình theo cấp: cơ bản (A1-A2), trung cấp (B1-B2),
 * nâng cao học thuật (C1-C2).
 */

export type DemoExample = {
  en: string;
  vi: string;
};

export type DemoLesson = {
  /** 1-2 đoạn mở đầu giải thích chủ điểm */
  intro: string[];
  /** 3-5 gạch đầu dòng: công thức / lưu ý */
  points: string[];
  /** Câu ví dụ demo (chỉ node không có khóa gõ câu liên quan) */
  examples?: DemoExample[];
};

export const DEMO_LESSONS: Record<string, DemoLesson> = {
  /* ------------------------------- A1 ------------------------------- */

  "a1-to-be": {
    intro: [
      "Động từ to be (am / is / are) mang nghĩa “là”, dùng để giới thiệu và mô tả người, vật, nơi chốn.",
      "Chọn dạng đúng theo chủ ngữ: I → am; he / she / it và danh từ số ít → is; you / we / they và danh từ số nhiều → are.",
    ],
    points: [
      "I am (I’m) — I am a student.",
      "He / She / It is (He’s) — She is my sister.",
      "You / We / They are (You’re) — They are teachers.",
      "Trong câu phủ định thêm not: is not = isn’t, are not = aren’t.",
    ],
    examples: [
      { en: "I am a new student.", vi: "Tôi là học viên mới." },
      { en: "This is my family photo.", vi: "Đây là ảnh gia đình của tôi." },
      { en: "We are in the same class.", vi: "Chúng tôi học cùng lớp." },
    ],
  },

  "a1-plural-nouns": {
    intro: [
      "Danh từ số nhiều chỉ từ hai vật trở lên. Hầu hết danh từ thêm -s ở số nhiều.",
      "Danh từ đuôi -s, -ss, -sh, -ch, -x, -o thêm -es; phụ âm + y đổi thành -ies; một số danh từ bất quy tắc phải học thuộc.",
    ],
    points: [
      "Quy tắc chung: book → books, pen → pens.",
      "Thêm -es: bus → buses, watch → watches, box → boxes.",
      "Phụ âm + y: city → cities, study → studies.",
      "Bất quy tắc: man → men, child → children, foot → feet, person → people.",
    ],
    examples: [
      { en: "I have two brothers and one sister.", vi: "Tôi có hai anh trai và một chị gái." },
      { en: "There are three buses every morning.", vi: "Sáng nào cũng có ba chuyến xe buýt." },
      { en: "The children play in the park.", vi: "Những đứa trẻ chơi ở công viên." },
    ],
  },

  "a1-articles": {
    intro: [
      "Mạo từ a / an đứng trước danh từ số ít đếm được khi nhắc lần đầu; the dùng khi người nghe đã biết rõ là cái nào.",
      "Dùng an trước nguyên âm (a, e, i, o, u) phát âm là nguyên âm.",
    ],
    points: [
      "a + phụ âm: a book, a car, a university (đọc /ju:/).",
      "an + nguyên âm: an apple, an egg, an hour (h câm).",
      "the: nhắc lại lần thứ hai hoặc đối tượng duy nhất — the sun, the door.",
      "Danh từ số nhiều nói chung không dùng mạo từ: I like dogs.",
    ],
    examples: [
      { en: "I have a car. The car is red.", vi: "Tôi có một chiếc ô tô. Chiếc ô tô màu đỏ." },
      { en: "She is an engineer.", vi: "Cô ấy là kỹ sư." },
      { en: "The sun is bright today.", vi: "Hôm nay nắng chói." },
    ],
  },

  "a1-adjectives": {
    intro: [
      "Tính từ mô tả người, vật: đứng trước danh từ hoặc sau động từ to be.",
      "Tính từ tiếng Anh không chia số nhiều: two red cars (không dùng reds).",
    ],
    points: [
      "Trước danh từ: a big house, a new phone.",
      "Sau to be: The house is big.",
      "Nhiều tính từ: ý kiến → kích thước → tuổi → màu sắc — a small old wooden box.",
      "Trạng từ thường đuôi -ly: slow → slowly.",
    ],
    examples: [
      { en: "She has a small white cat.", vi: "Cô ấy có một con mèo trắng nhỏ." },
      { en: "My office is big and bright.", vi: "Văn phòng của tôi rộng và sáng." },
      { en: "He drives an old blue truck.", vi: "Anh ấy lái một chiếc xe tải cũ màu xanh." },
    ],
  },

  "a1-to-be-negative": {
    intro: [
      "Phủ định với to be: thêm not sau am / is / are.",
      "Dạng tắt: isn’t, aren’t; I am not → I’m not.",
    ],
    points: [
      "I am not (I’m not) hungry.",
      "He / She / It isn’t … — It isn’t cold today.",
      "You / We / They aren’t … — We aren’t late.",
      "Hỏi ngắn: Is he? — Yes, he is. / No, he isn’t.",
    ],
    examples: [
      { en: "I am not tired.", vi: "Tôi không mệt." },
      { en: "She isn’t at home now.", vi: "Bây giờ cô ấy không ở nhà." },
      { en: "They aren’t from Hanoi.", vi: "Họ không đến từ Hà Nội." },
    ],
  },

  "a1-to-be-questions": {
    intro: [
      "Câu hỏi Yes/No với to be: đảo be lên trước chủ ngữ — Am I…? Is he…? Are you…?",
      "Trả lời ngắn dùng chính be: Yes, I am. / No, she isn’t.",
    ],
    points: [
      "Are you a doctor? — Yes, I am.",
      "Is this your bag? — No, it isn’t.",
      "Are they at work? — Yes, they are.",
      "Với từ để hỏi: Where is he from? What are these?",
    ],
    examples: [
      { en: "Are you from Vietnam?", vi: "Bạn đến từ Việt Nam phải không?" },
      { en: "Is your brother a teacher?", vi: "Anh trai bạn có phải giáo viên không?" },
      { en: "Are these your keys?", vi: "Đây có phải chìa khóa của bạn không?" },
    ],
  },

  "a1-demonstratives": {
    intro: [
      "this / these chỉ người vật ở gần; that / those chỉ ở xa.",
      "this, that dùng với danh từ số ít; these, those dùng với số nhiều.",
    ],
    points: [
      "this = này (gần, số ít) — This is my desk.",
      "these = những… này (gần, số nhiều) — These are my books.",
      "that = kia (xa, số ít) — That is our school.",
      "those = những… kia (xa, số nhiều) — Those are her shoes.",
    ],
    examples: [
      { en: "This is my phone.", vi: "Đây là điện thoại của tôi." },
      { en: "These are our new neighbours.", vi: "Đây là những người hàng xóm mới của chúng tôi." },
      { en: "Who is that man over there?", vi: "Người đàn ông đằng kia là ai vậy?" },
    ],
  },

  "a1-possessive-object-pronouns": {
    intro: [
      "Tính từ sở hữu (my, your, his, her, its, our, their) luôn đứng trước danh từ.",
      "Đại từ tân ngữ (me, you, him, her, it, us, them) đứng sau động từ hoặc giới từ.",
    ],
    points: [
      "I → my / me: This is my bag. Give it to me.",
      "he → his / him: That is his bike. Call him.",
      "she → her / her: her name; ask her.",
      "we → our / us; they → their / them.",
    ],
    examples: [
      { en: "My sister helps me every day.", vi: "Chị tôi giúp tôi mỗi ngày." },
      { en: "This is his car, not her car.", vi: "Đây là xe của anh ấy, không phải xe của cô ấy." },
      { en: "We invite them to our party.", vi: "Chúng tôi mời họ đến bữa tiệc của mình." },
    ],
  },

  "a1-have-got": {
    intro: [
      "have got / has got diễn tả sự sở hữu, phổ biến trong văn nói Anh-Anh.",
      "I / you / we / they dùng have got; he / she / it dùng has got. Phủ định: haven’t got / hasn’t got.",
    ],
    points: [
      "I have got two sisters.",
      "He has got a red bike.",
      "We haven’t got a car.",
      "Hỏi: Has your flat got a balcony?",
    ],
    examples: [
      { en: "I have got a big family.", vi: "Tôi có một gia đình đông người." },
      { en: "She has got long hair.", vi: "Cô ấy có mái tóc dài." },
      { en: "Have you got a pen I can borrow?", vi: "Bạn có cây bút cho tôi mượn không?" },
    ],
  },

  "a1-there-is-are": {
    intro: [
      "there is / there are nói về sự tồn tại của người vật: there is với danh từ số ít, there are với số nhiều.",
      "Phủ định: there isn’t / there aren’t; hỏi: Is there…? Are there…?",
    ],
    points: [
      "There is a bank near here.",
      "There are two parks in my street.",
      "There isn’t a lift in the building.",
      "Are there any shops open now?",
    ],
    examples: [
      { en: "There is a small cafe on this street.", vi: "Có một quán cà phê nhỏ trên phố này." },
      { en: "There are four chairs at the table.", vi: "Có bốn chiếc ghế ở bàn ăn." },
      { en: "Is there a supermarket nearby?", vi: "Gần đây có siêu thị không?" },
    ],
  },

  "a1-it-weather-time": {
    intro: [
      "it làm chủ ngữ giả trong câu nói về thời tiết, giờ, ngày tháng và khoảng cách — không dịch ra tiếng Việt.",
      "It’s + tính từ / mưa gió; It’s + giờ; It’s + khoảng cách.",
    ],
    points: [
      "Thời tiết: It’s sunny. It’s raining.",
      "Giờ: It’s half past seven.",
      "Ngày: It’s Monday today.",
      "Khoảng cách: It’s two kilometres from my house.",
    ],
    examples: [
      { en: "It is cold and windy today.", vi: "Hôm nay trời lạnh và có gió." },
      { en: "It is nine o’clock.", vi: "Bây giờ là chín giờ." },
      { en: "It is five minutes to the station.", vi: "Đi tới nhà ga mất năm phút." },
    ],
  },

  "a1-sentence-pattern": {
    intro: [
      "Câu tiếng Anh theo trật tự S-V (chủ ngữ - động từ) và S-V-O (chủ ngữ - động từ - tân ngữ).",
      "Trạng ngữ nơi chốn, thời gian thường đứng cuối câu: S-V-O-place-time.",
    ],
    points: [
      "S-V: The baby sleeps.",
      "S-V-O: I drink coffee every morning.",
      "S-V-O-place-time: She reads books in the library on Sundays.",
      "Không bỏ chủ ngữ như tiếng Việt: I went to the market yesterday.",
    ],
    examples: [
      { en: "My father watches the news every evening.", vi: "Bố tôi xem thời sự mỗi tối." },
      { en: "The children play football after school.", vi: "Bọn trẻ đá bóng sau giờ học." },
      { en: "I write emails at the office in the morning.", vi: "Tôi viết email ở văn phòng vào buổi sáng." },
    ],
  },

  "a1-present-simple": {
    intro: [
      "Hiện tại đơn với I / you / we / they dùng nguyên mẫu động từ, nói về thói quen, sự thật và lịch cố định.",
      "Phủ định dùng do not / don’t; câu hỏi bắt đầu bằng Do…?",
    ],
    points: [
      "I work in a bank.",
      "You / We / They live near the station.",
      "We don’t watch TV in the morning.",
      "Do you speak English?",
    ],
    examples: [
      { en: "We have breakfast at seven.", vi: "Chúng tôi ăn sáng lúc bảy giờ." },
      { en: "They don’t work on Sundays.", vi: "Chủ nhật họ không làm việc." },
      { en: "Do you live with your parents?", vi: "Bạn có sống với bố mẹ không?" },
    ],
  },

  "a1-wh-questions": {
    intro: [
      "Câu hỏi Wh- bắt đầu bằng what, where, when, who, why, how…",
      "Trật tự: Wh- + do/does + chủ ngữ + động từ (với to be: Wh- + be + chủ ngữ).",
    ],
    points: [
      "What do you do? — hỏi nghề nghiệp.",
      "Where does he work?",
      "When do they arrive?",
      "Why are you late? — câu với be không dùng do/does.",
    ],
    examples: [
      { en: "What do you do at the weekend?", vi: "Cuối tuần bạn làm gì?" },
      { en: "Where does your sister study?", vi: "Chị bạn học ở đâu?" },
      { en: "How do you go to work?", vi: "Bạn đi làm bằng gì?" },
    ],
  },

  "a1-v-ing": {
    intro: [
      "Sau một số động từ như like, love, enjoy, hate, stop, finish, start… động từ theo sau ở dạng V-ing.",
      "V-ing cũng dùng sau giới từ (good at swimming) và làm danh động từ (Swimming is fun).",
    ],
    points: [
      "I like reading before bed.",
      "She enjoys cooking for friends.",
      "He is good at drawing.",
      "Stop + V-ing: Please stop talking.",
    ],
    examples: [
      { en: "I love listening to music on the bus.", vi: "Tôi thích nghe nhạc trên xe buýt." },
      { en: "We enjoy walking in the park.", vi: "Chúng tôi thích đi dạo ở công viên." },
      { en: "Do you like playing chess?", vi: "Bạn có thích chơi cờ không?" },
    ],
  },

  "a1-present-third-person": {
    intro: [
      "Hiện tại đơn với he / she / it: thêm -s vào động từ; đuôi -o, -sh, -ch, -ss, -x thêm -es; phụ âm + y → -ies.",
      "Phủ định và câu hỏi dùng does + nguyên mẫu (đã bỏ -s): She doesn’t work. Does he play…?",
    ],
    points: [
      "He works in a hospital.",
      "She watches films online.",
      "My brother studies economics.",
      "Does she live here? — Yes, she does.",
    ],
    examples: [
      { en: "My mum cooks dinner every day.", vi: "Mẹ tôi nấu bữa tối mỗi ngày." },
      { en: "He goes to the gym on Fridays.", vi: "Anh ấy đi tập gym vào các thứ Sáu." },
      { en: "Does she speak French?", vi: "Cô ấy có nói tiếng Pháp không?" },
    ],
  },

  "a1-adverbs-frequency": {
    intro: [
      "Trạng từ tần suất (always, usually, often, sometimes, rarely, never) đứng sau động từ to be và trước động từ thường.",
      "Cụm tần suất (every day, once a week…) đứng đầu hoặc cuối câu.",
    ],
    points: [
      "She is always on time. (sau be)",
      "I usually walk to work. (trước động từ thường)",
      "We sometimes eat out on Friday.",
      "He plays tennis twice a week.",
    ],
    examples: [
      { en: "I always brush my teeth before bed.", vi: "Tôi luôn đánh răng trước khi ngủ." },
      { en: "She is never late for class.", vi: "Cô ấy không bao giờ đi học muộn." },
      { en: "We often visit our grandparents at the weekend.", vi: "Cuối tuần chúng tôi thường về thăm ông bà." },
    ],
  },

  "a1-can-ability": {
    intro: [
      "can nói về khả năng làm được việc gì; sau can luôn là động từ nguyên mẫu không to.",
      "can không chia theo chủ ngữ. Phủ định: cannot / can’t; hỏi: Can you…?",
    ],
    points: [
      "I can swim.",
      "She can speak three languages.",
      "He can’t drive yet.",
      "Can you ride a bike? — Yes, I can.",
    ],
    examples: [
      { en: "I can cook simple meals.", vi: "Tôi có thể nấu những món đơn giản." },
      { en: "My grandmother can still walk very fast.", vi: "Bà tôi vẫn có thể đi bộ rất nhanh." },
      { en: "They can’t come to the party.", vi: "Họ không thể đến bữa tiệc." },
    ],
  },

  "a1-can-request": {
    intro: [
      "can dùng để xin phép (Can I…?) và nhờ ai làm gì (Can you…?) — lịch sự và tự nhiên trong giao tiếp.",
      "Trả lời: Sure. / Of course. / No problem. / Sorry, I can’t.",
    ],
    points: [
      "Xin phép: Can I open the window?",
      "Nhờ vả: Can you help me, please?",
      "Từ chối lịch sự: Sorry, I’m busy now.",
      "Can I have…? — gọi món, mượn đồ.",
    ],
    examples: [
      { en: "Can I borrow your charger?", vi: "Tôi mượn sạc của bạn được không?" },
      { en: "Can you close the door, please?", vi: "Bạn đóng cửa giúp tôi nhé?" },
      { en: "Can we sit here?", vi: "Chúng tôi ngồi đây được không?" },
    ],
  },

  "a1-imperative": {
    intro: [
      "Câu mệnh lệnh dùng động từ nguyên mẫu, không chủ ngữ — dùng cho chỉ dẫn, đề nghị, hướng dẫn.",
      "Phủ định thêm Don’t; thêm please để lịch sự; Let’s + động từ để rủ rê.",
    ],
    points: [
      "Open your books, please.",
      "Don’t be late.",
      "Let’s start the lesson.",
      "Turn left at the corner.",
    ],
    examples: [
      { en: "Please sit down.", vi: "Xin mời ngồi xuống." },
      { en: "Don’t touch the wet paint.", vi: "Đừng chạm vào sơn chưa khô." },
      { en: "Let’s take a short break.", vi: "Chúng ta nghỉ ngắn nhé." },
    ],
  },

  "a1-prepositions": {
    intro: [
      "Giới từ thời gian: in (tháng, năm, buổi), on (ngày, thứ), at (giờ, mốc).",
      "Giới từ nơi chốn: in (trong), on (trên bề mặt), at (tại một điểm).",
    ],
    points: [
      "in May, in 2026, in the morning.",
      "on Monday, on 5th June, on the table.",
      "at 7 p.m., at night, at the bus stop.",
      "from … to …: from Monday to Friday.",
    ],
    examples: [
      { en: "We start work at eight in the morning.", vi: "Chúng tôi bắt đầu làm việc lúc tám giờ sáng." },
      { en: "My birthday is on 12th August.", vi: "Sinh nhật tôi vào ngày 12 tháng Tám." },
      { en: "The keys are in the drawer.", vi: "Chìa khóa ở trong ngăn kéo." },
    ],
  },

  "a1-present-continuous": {
    intro: [
      "Hiện tại tiếp diễn (am / is / are + V-ing) diễn tả việc đang xảy ra ngay lúc nói hoặc trong giai đoạn này.",
      "Dấu hiệu: now, right now, at the moment, Look!, Listen!",
    ],
    points: [
      "I am reading a novel now.",
      "He is cooking in the kitchen.",
      "They are studying for the exam.",
      "Phủ định: She isn’t sleeping.",
    ],
    examples: [
      { en: "I am typing an email right now.", vi: "Tôi đang gõ một email ngay bây giờ." },
      { en: "It is raining outside.", vi: "Bên ngoài trời đang mưa." },
      { en: "Are you listening to me?", vi: "Bạn có đang nghe tôi nói không?" },
    ],
  },

  "a1-some-any-no": {
    intro: [
      "some dùng trong câu khẳng định; any dùng trong câu phủ định và câu hỏi; no mang nghĩa phủ định ngay trong câu khẳng định.",
      "Đứng trước danh từ đếm được số nhiều hoặc danh từ không đếm được.",
    ],
    points: [
      "There are some apples on the table.",
      "We don’t have any milk.",
      "Do you have any questions?",
      "There is no butter left. = There isn’t any butter.",
    ],
    examples: [
      { en: "I want some water, please.", vi: "Cho tôi xin chút nước." },
      { en: "There aren’t any eggs in the fridge.", vi: "Trong tủ lạnh không còn quả trứng nào." },
      { en: "She has no money with her.", vi: "Cô ấy không mang theo tiền." },
    ],
  },

  "a1-how-adj-adv": {
    intro: [
      "How dùng để hỏi mức độ và cách thức: How old, How many (+ đếm được), How much (+ không đếm được), How often, How long.",
    ],
    points: [
      "How old are you?",
      "How many brothers do you have?",
      "How much is this shirt?",
      "How often do you swim? — Twice a week.",
    ],
    examples: [
      { en: "How many students are there in your class?", vi: "Lớp bạn có bao nhiêu học viên?" },
      { en: "How much does the ticket cost?", vi: "Vé giá bao nhiêu?" },
      { en: "How well does she sing?", vi: "Cô ấy hát hay cỡ nào?" },
    ],
  },

  "a1-past-was-were": {
    intro: [
      "was / were là quá khứ của am / is / are: I / he / she / it → was; you / we / they → were.",
      "Phủ định: wasn’t / weren’t; hỏi: Was he…? Were you…?",
    ],
    points: [
      "I was at home last night.",
      "They were very happy.",
      "She wasn’t at school yesterday.",
      "Were you tired this morning?",
    ],
    examples: [
      { en: "The weather was nice last weekend.", vi: "Cuối tuần trước thời tiết đẹp." },
      { en: "We were at the beach on Sunday.", vi: "Chủ nhật chúng tôi ở bãi biển." },
      { en: "Was your exam difficult?", vi: "Bài thi của bạn có khó không?" },
    ],
  },

  "a1-past-simple-verbs": {
    intro: [
      "Quá khứ đơn khẳng định: động từ thêm -ed (quy tắc) hoặc đổi mẫu (bất quy tắc); cả ba ngôi dùng một hình thức.",
      "Phủ định và câu hỏi dùng did + nguyên mẫu: I didn’t go. Did you see it?",
    ],
    points: [
      "Quy tắc: work → worked, study → studied, stop → stopped.",
      "Bất quy tắc: go → went, have → had, see → saw, buy → bought.",
      "I watched a film last night.",
      "He went to Da Nang in June.",
    ],
    examples: [
      { en: "I visited my aunt last Saturday.", vi: "Thứ Bảy tuần trước tôi đi thăm dì." },
      { en: "They moved to this city two years ago.", vi: "Họ chuyển đến thành phố này hai năm trước." },
      { en: "We had a great time at the party.", vi: "Bữa tiệc qua chúng tôi vui lắm." },
    ],
  },

  "a1-be-going-to": {
    intro: [
      "be going to + động từ nguyên mẫu diễn tả dự định đã nghĩ trước hoặc dự đoán dựa trên bằng chứng hiện tại.",
      "Chia theo to be: I am going to…, He is going to…, We are going to…",
    ],
    points: [
      "I am going to learn Japanese.",
      "She is going to buy a new laptop.",
      "It’s cloudy — it is going to rain.",
      "Phủ định: We aren’t going to travel this year.",
    ],
    examples: [
      { en: "I am going to cook noodles tonight.", vi: "Tối nay tôi định nấu mì." },
      { en: "They are going to open a small shop.", vi: "Họ định mở một cửa hàng nhỏ." },
      { en: "Look at those clouds — it is going to rain.", vi: "Nhìn những đám mây kìa — sắp mưa đấy." },
    ],
  },

  "a1-comparative-superlative": {
    intro: [
      "So sánh hơn: tính từ ngắn thêm -er + than; tính từ dài dùng more + tính từ + than.",
      "So sánh nhất: the + -est / the most + tính từ. Bất quy tắc: good → better → the best, bad → worse → the worst.",
    ],
    points: [
      "short → shorter; big → bigger (nhân đôi phụ âm).",
      "expensive → more expensive.",
      "She is taller than me.",
      "This is the cheapest cafe in town.",
    ],
    examples: [
      { en: "My flat is bigger than yours.", vi: "Căn hộ của tôi rộng hơn của bạn." },
      { en: "This book is more interesting than that one.", vi: "Quyển này thú vị hơn quyển kia." },
      { en: "He is the youngest in the family.", vi: "Anh ấy là người trẻ nhất trong nhà." },
    ],
  },

  "a1-conjunctions-clauses": {
    intro: [
      "Liên từ nối ý: and (và — thêm ý), but (nhưng — tương phản), so (nên — kết quả), because (vì — lý do).",
      "Một liên từ nối hai mệnh đề; tránh lặp cả and lẫn so trong một câu.",
    ],
    points: [
      "and: I bought bread and milk.",
      "but: The film was long, but it was good.",
      "so: It was late, so we took a taxi.",
      "because: We stayed home because it rained.",
    ],
    examples: [
      { en: "She likes tea, but she doesn’t like coffee.", vi: "Cô ấy thích trà nhưng không thích cà phê." },
      { en: "I was tired, so I went to bed early.", vi: "Tôi mệt nên đi ngủ sớm." },
      { en: "We took an umbrella because it was raining.", vi: "Chúng tôi mang theo ô vì trời đang mưa." },
    ],
  },

  "a1-past-participle": {
    intro: [
      "Phân từ hai (V3) như tính từ diễn tả trạng thái bị / được: be + V3 — dùng khi nói cảm xúc hoặc mô tả nguồn gốc vật.",
      "Cặp quen thuộc: interested / interesting, bored / boring, tired, closed, broken, made in…",
    ],
    points: [
      "I am interested in history.",
      "The film was boring.",
      "The shop is closed on Sundays.",
      "This table is made of wood.",
    ],
    examples: [
      { en: "I am tired after the trip.", vi: "Tôi mệt sau chuyến đi." },
      { en: "The window is broken.", vi: "Cái cửa sổ bị vỡ." },
      { en: "She is interested in photography.", vi: "Cô ấy thích nhiếp ảnh." },
    ],
  },

  /* ------------------------------- B1 ------------------------------- */

  "b1-present-perfect": {
    intro: [
      "Hiện tại hoàn thành (have / has + V3) nối quá khứ với hiện tại: nói kết quả, trải nghiệm hoặc khoảng thời gian chưa kết thúc.",
      "for + khoảng thời gian (for five years); since + mốc thời gian (since 2020).",
    ],
    points: [
      "I / you / we / they + have + V3; he / she / it + has + V3.",
      "for + khoảng: for ten years, for a week.",
      "since + mốc: since Monday, since I was a child.",
      "Phủ định: haven’t / hasn’t + V3 — chưa từng hoặc lâu chưa làm.",
    ],
  },

  "b1-present-perfect-continuous": {
    intro: [
      "Hiện tại hoàn thành tiếp diễn (have / has been + V-ing) nhấn mạnh việc đang diễn ra kéo dài và có thể chưa dừng.",
      "Thường đi với how long, for, since, all day, lately.",
    ],
    points: [
      "I have been waiting for an hour.",
      "How long have you been studying English?",
      "She has been working here since May.",
      "Khác hiện tại hoàn thành: nhấn mạnh quá trình liên tục hơn kết quả.",
    ],
  },

  "b1-past-perfect": {
    intro: [
      "Quá khứ hoàn thành (had + V3) diễn tả việc đã xong trước một việc khác trong quá khứ.",
      "Thường đi với after, before, when, by the time.",
    ],
    points: [
      "After I had finished my homework, I went out.",
      "The film had started when we arrived.",
      "before / after / when + mệnh đề quá khứ đơn.",
      "Phủ định: hadn’t + V3 — việc chưa xong trước mốc thời gian.",
    ],
  },

  "b1-future-continuous": {
    intro: [
      "Tương lai tiếp diễn (will be + V-ing) diễn tả việc sẽ đang xảy ra tại một thời điểm trong tương lai.",
      "Dấu hiệu: at 8 tomorrow, this time next week, all evening.",
    ],
    points: [
      "Tomorrow at nine I will be working.",
      "This time next week we will be flying to Hue.",
      "Phủ định: won’t be + V-ing.",
      "Hỏi lịch lịch sự: Will you be using the car tonight?",
    ],
  },

  "b1-modal-ability-permission": {
    intro: [
      "Khả năng ở hiện tại / quá khứ: can / could / be able to.",
      "could = từng làm được (quá khứ) hoặc giả định lịch sự; be able to trang trọng hơn can và dùng được ở nhiều thì.",
    ],
    points: [
      "I can swim. — khả năng hiện tại.",
      "She could read at four. — quá khứ.",
      "I am able to join the meeting. — trang trọng.",
      "Will you be able to come? — tương lai.",
    ],
  },

  "b1-modal-obligation": {
    intro: [
      "must nói nghĩa vụ xuất phát từ người nói; have to nói quy định bên ngoài.",
      "mustn’t = cấm; needn’t / don’t have to = không cần thiết; quá khứ dùng had to.",
    ],
    points: [
      "I must finish this today. — tự nhủ.",
      "You have to wear a helmet. — quy định.",
      "You mustn’t smoke here. — cấm.",
      "You needn’t bring anything. — không cần.",
    ],
  },

  "b1-modal-ought-should": {
    intro: [
      "should / ought to + động từ nguyên mẫu đưa lời khuyên, ý kiến về điều đúng đắn.",
      "had better + nguyên mẫu khuyên gấp, thường mang sắc thái cảnh báo; phủ định: shouldn’t / had better not.",
    ],
    points: [
      "You should drink more water.",
      "We ought to respect the rules.",
      "You’d better hurry — the bus is coming.",
      "should have + V3: hối tiếc việc đã / lỡ làm.",
    ],
  },

  "b1-conditionals-1-2": {
    intro: [
      "Câu điều kiện loại 2 nói điều không có thật ở hiện tại: If + quá khứ đơn, would + nguyên mẫu.",
      "Động từ be dùng were cho mọi ngôi trong văn viết chuẩn: If I were you…",
    ],
    points: [
      "If I had time, I would help you.",
      "If she were here, she would agree.",
      "Phủ định: If I didn’t work, I wouldn’t have money.",
      "could / might thay would: I could buy a house if I saved more.",
    ],
  },

  "b1-third-conditional": {
    intro: [
      "Câu điều kiện loại 3 nói về điều không có thật trong quá khứ và kết quả trái ngược đã xảy ra: If + had + V3, would have + V3.",
      "Câu loại 3 thường mang sắc thái tiếc nuối hoặc trách móc vì quá khứ không thể thay đổi.",
    ],
    points: [
      "If + S + had (not) + V3, S + would (not) have + V3.",
      "If I had known, I would have told you.",
      "would có thể thay bằng could have / might have.",
      "Đảo ngữ trang trọng: Had I known…",
    ],
    examples: [
      { en: "If we had left earlier, we would have caught the train.", vi: "Nếu lúc ấy chúng tôi đi sớm hơn, đã kịp chuyến tàu." },
      { en: "She would have passed if she had studied more.", vi: "Cô ấy đã đỗ nếu học chăm hơn." },
      { en: "I wouldn’t have bought it if I had checked the price.", vi: "Tôi đã không mua nếu mà xem giá trước." },
    ],
  },

  "b1-modal-perfect": {
    intro: [
      "Khuyết thiếu + have + V3 bàn về quá khứ: must have (chắc hẳn), might / could have (có lẽ), can’t have (chắc là không), should have (đáng lẽ).",
      "Dùng để suy đoán hoặc tiếc nuối về việc đã qua.",
    ],
    points: [
      "must have + V3: He must have missed the bus.",
      "might / could have + V3: She might have forgotten.",
      "can’t have + V3: They can’t have finished already.",
      "should(n’t) have + V3: Đáng lẽ đã / lỡ đã…",
    ],
  },

  "a2-reported-speech-intro": {
    intro: [
      "Tường thuật kể lại lời của người khác: lùi một thì, đổi đại từ và từ chỉ thời gian, nơi chốn.",
      "said (that)… với lời khẳng định; asked… với câu hỏi; told + người + to V với lời nhờ.",
    ],
    points: [
      "Hiện tại → quá khứ: am / is → was; like → liked.",
      "will → would; can → could; have → had.",
      "Đổi từ: today → that day, here → there, this → that.",
      "Câu hỏi yes/no: asked if / whether + trật tự câu khẳng định.",
    ],
  },

  "b1-to-infinitive-advanced": {
    intro: [
      "to V mở rộng: phủ định not to V; chỉ mục đích in order to / so as to; cụm for + danh từ + to V nói ai / cái gì sẽ làm.",
      "Sau từ để hỏi: know what to do, decide where to go.",
    ],
    points: [
      "He told me not to wait.",
      "I left early so as not to be late.",
      "It’s time for us to go.",
      "She doesn’t know how to answer.",
    ],
  },

  "b1-reported-speech": {
    intro: [
      "Tường thuật lời nhờ, câu hỏi và câu hỏi gián tiếp: told / asked + tân ngữ + to V; asked if / whether hoặc từ để hỏi + trật tự câu khẳng định.",
      "Câu hỏi gián tiếp không đảo trợ động từ và không dùng dấu hỏi trong mệnh đề được tường thuật.",
    ],
    points: [
      "“Send the report.” → She told me to send the report.",
      "“Are you tired?” → He asked me if I was tired.",
      "“Where do you live?” → She asked where I lived.",
      "wonder + whether / từ để hỏi: I wonder whether it’s true.",
    ],
  },

  "b1-clauses-wh-as-soon-as": {
    intro: [
      "Mệnh đề thời gian và lý do dùng liên từ when, while, as soon as, before, after, until, since và because, as, since (lý do).",
      "Sau liên từ thời gian dùng thì hiện tại cho tương lai: as soon as it stops (không dùng will).",
    ],
    points: [
      "when = khi; while = trong khi (hai việc song song).",
      "as soon as = ngay khi.",
      "until = cho đến khi; before / after = trước / sau khi.",
      "because / as / since + lý do: I called because I needed help.",
    ],
    examples: [
      { en: "As soon as I get home, I will call you.", vi: "Về tới nhà là tôi sẽ gọi cho bạn." },
      { en: "While she was cooking, he was setting the table.", vi: "Trong khi cô ấy nấu ăn, anh ấy dọn bàn." },
      { en: "We waited until the rain stopped.", vi: "Chúng tôi đợi cho đến khi tạnh mưa." },
    ],
  },

  "a2-passive-basic": {
    intro: [
      "Bị động nhấn việc việc hơn người làm: be + V3. Hiện tại: is / are + V3; quá khứ: was / were + V3.",
      "Người thực hiện thêm bằng by nếu cần: The kitchen is cleaned by my brother.",
    ],
    points: [
      "The floor is cleaned after dinner.",
      "The tower was built long ago.",
      "Phủ định: isn’t / aren’t + V3; wasn’t / weren’t + V3.",
      "Hỏi: Is it made in Vietnam?",
    ],
  },

  "b1-passive-voice": {
    intro: [
      "Bị động mở rộng: will be + V3 (tương lai), can / must / should be + V3 (khuyết thiếu), get + V3 (văn nói).",
      "Trạng thái đã xong dùng been: has been updated.",
    ],
    points: [
      "The bill will be paid online.",
      "Laptops must not be left here.",
      "He gets paid monthly. — get bị động văn nói.",
      "The app has been opened on my phone.",
    ],
  },

  "b1-it-clauses": {
    intro: [
      "Cấu trúc It is + tính từ + to V: it làm chủ ngữ giả, hành động thật là phần to V; thêm for + người: for me to…",
      "Dùng để bình luận mức độ, khả năng, tầm quan trọng của hành động.",
    ],
    points: [
      "It is hard to learn a new language.",
      "It is easy to book a ticket online.",
      "It’s important for us to arrive early.",
      "It was kind of you to help.",
    ],
  },

  "b1-there-here": {
    intro: [
      "there + khuyết thiếu + be: there will be, there can be, there must be — nói sự tồn tại trong tương lai hoặc khả năng.",
      "here is / are đưa đồ cho ai trong hội thoại.",
    ],
    points: [
      "There will be a festival next month.",
      "There must be another way.",
      "Here is your key. / Here are your bags.",
      "there will be + danh từ: sẽ có…",
    ],
  },

  "a2-relative-what-where": {
    intro: [
      "what làm đại từ quan hệ với nghĩa “cái mà / điều mà”; where, when, why nối mệnh đề chỉ nơi, thời gian, lý do.",
      "Mệnh đề quan hệ đứng sau danh từ nó bổ nghĩa và không lặp lại danh từ đó.",
    ],
    points: [
      "This is what I meant. (= the thing that)",
      "Show me what you bought.",
      "That’s the cafe where we first met.",
      "I remember the day when we moved in.",
    ],
    examples: [
      { en: "I don’t understand what you mean.", vi: "Tôi không hiểu ý bạn là gì." },
      { en: "This is the hotel where we stayed last year.", vi: "Đây là khách sạn chúng tôi ở năm ngoái." },
      { en: "Tell me when the train leaves.", vi: "Cho tôi biết tàu chạy lúc mấy giờ." },
    ],
  },

  "b1-participial": {
    intro: [
      "Cụm phân từ (hiện tại V-ing / quá khứ V3) rút gọn mệnh đề quan hệ hoặc mệnh đề trạng ngữ, giúp câu gọn hơn.",
      "Phân từ hiện tại chủ động (the man standing…), phân từ quá khứ bị động (a window broken by…).",
    ],
    points: [
      "Chủ động: The boy carrying a bag is my cousin. (= who is carrying)",
      "Bị động: The letters sent yesterday arrived today. (= which were sent)",
      "Having finished the report, she went home.",
      "Sau when / while có thể lược: While walking home, I saw an accident.",
    ],
    examples: [
      { en: "The man standing by the door is our manager.", vi: "Người đàn ông đứng cạnh cửa là quản lý của chúng tôi." },
      { en: "Cars made in this factory are exported.", vi: "Ô tô sản xuất tại nhà máy này được xuất khẩu." },
      { en: "Having locked the door, he left the office.", vi: "Khoá cửa xong, anh ấy rời văn phòng." },
    ],
  },

  "b1-adjectives-ing-ed": {
    intro: [
      "Tính từ đuôi -ing mô tả bản chất sự vật (gây ra cảm xúc); đuôi -ed mô tả cảm xúc của người (bị gây ra).",
      "Cặp phổ biến: boring / bored, interesting / interested, exciting / excited, tiring / tired, confusing / confused.",
    ],
    points: [
      "The lesson was boring. → bài học gây nhàm chán.",
      "The students were bored. → học viên cảm thấy chán.",
      "an amazing trip — chuyến đi đáng kinh ngạc.",
      "We were amazed by the view.",
    ],
    examples: [
      { en: "The film was so moving that everyone cried.", vi: "Bộ phim xúc động đến mức ai cũng khóc." },
      { en: "I am interested in learning Korean.", vi: "Tôi quan tâm đến việc học tiếng Hàn." },
      { en: "The news was surprising, but we were pleased.", vi: "Tin thật bất ngờ, nhưng chúng tôi rất vui." },
    ],
  },

  "c2-adjective-order": {
    intro: [
      "Khi xếp nhiều tính từ trước danh từ, thứ tự chuẩn: ý kiến → kích thước → tuổi / hình dáng → màu sắc → nguồn gốc → chất liệu → mục đích.",
      "Các nhóm thường không dùng and (trừ nhóm cùng loại); dấu phẩy ngăn các tính từ cùng mô tả.",
    ],
    points: [
      "a beautiful (ý kiến) big (kích thước) old (tuổi) house.",
      "a small round wooden table — size, shape, material.",
      "a lovely long black dress.",
      "a new Japanese sports car — age, origin, purpose.",
    ],
    examples: [
      { en: "She bought a beautiful small round wooden table.", vi: "Cô ấy mua một chiếc bàn gỗ tròn nhỏ thật đẹp." },
      { en: "He wears an old grey cotton shirt.", vi: "Anh ấy mặc một chiếc áo cotton xám cũ." },
      { en: "They live in a charming little white cottage.", vi: "Họ sống trong một ngôi nhà trắng nhỏ đáng yêu." },
    ],
  },

  "b1-tag-questions": {
    intro: [
      "Câu hỏi đuôi thêm một câu hỏi ngắn cuối câu để xác nhận: mệnh đề khẳng định → đuôi phủ định, và ngược lại.",
      "Đuôi lặp lại trợ động từ của mệnh đề: be, do / does / did, will, can, have…",
    ],
    points: [
      "You’re ready, aren’t you?",
      "She doesn’t smoke, does she?",
      "They arrived late, didn’t they?",
      "I’m next, aren’t I? (đặc biệt).",
    ],
    examples: [
      { en: "It’s a lovely day, isn’t it?", vi: "Hôm nay trời đẹp phải không?" },
      { en: "You haven’t seen my keys, have you?", vi: "Bạn chưa thấy chùm chìa khóa của tôi đúng không?" },
      { en: "He can drive, can’t he?", vi: "Anh ấy lái xe được, đúng không?" },
    ],
  },

  "b1-functional-questions": {
    intro: [
      "Câu hỏi phủ định dùng khi mong đợi câu trả lời Yes hoặc thể hiện ngạc nhiên, lời mời: Don’t you…? Isn’t it…?",
      "Câu hỏi phủ định với why mang sắc thái trách móc: Why didn’t you tell me?",
    ],
    points: [
      "Isn’t this your stop?",
      "Don’t you like it? — Yes, I do. / No, I don’t.",
      "Haven’t we met before?",
      "Why didn’t you call me?",
    ],
    examples: [
      { en: "Don’t you want to come with us?", vi: "Bạn không muốn đi cùng bọn tôi à?" },
      { en: "Isn’t she your classmate?", vi: "Cô ấy không phải bạn cùng lớp của bạn sao?" },
      { en: "Why haven’t you finished the report?", vi: "Sao bạn chưa xong bản báo cáo?" },
    ],
  },

  "b2-inversion-so-neither": {
    intro: [
      "Đáp ứng ngắn dùng so / neither + trợ động từ + chủ ngữ: so đồng ý khẳng định, neither / nor phủ định theo.",
      "Trật tự đảo: So do I (không dùng So I do); too / either cũng thay được ở cuối câu.",
    ],
    points: [
      "“I like jazz.” — “So do I.”",
      "“I can’t swim.” — “Neither can I.” / “Nor can I.”",
      "“I’m not tired.” — “Neither am I.”",
      "“I went.” — “So did I.”",
    ],
    examples: [
      { en: "“I really enjoy this song.” — “So do I.”", vi: "“Tôi rất thích bài này.” — “Tôi cũng vậy.”" },
      { en: "“I haven’t finished yet.” — “Neither have I.”", vi: "“Tôi chưa xong.” — “Tôi cũng chưa.”" },
      { en: "“She works at night.” — “So does her brother.”", vi: "“Cô ấy làm ca đêm.” — “Anh trai cô ấy cũng vậy.”" },
    ],
  },

  "b1-negatives-review": {
    intro: [
      "Ngoài not, tiếng Anh phủ định bằng các từ khác: never, hardly, rarely, seldom, no one, nothing, nowhere, neither… nor…",
      "Câu có từ phủ định mạnh (never, nothing…) không thêm not nữa: I never drink coffee.",
    ],
    points: [
      "never = không bao giờ: I never drink coffee.",
      "hardly ever = hầu như không: We hardly ever eat out.",
      "no one / nobody / nothing: Nobody called me.",
      "either ở câu phủ định: I don’t like it either.",
    ],
    examples: [
      { en: "Nobody answered the phone.", vi: "Không ai bắt máy." },
      { en: "She hardly ever watches TV.", vi: "Cô ấy hầu như không xem tivi." },
      { en: "I have nothing to declare.", vi: "Tôi không có gì phải khai báo." },
    ],
  },

  "b1-emphasis-do": {
    intro: [
      "do / does / did + động từ nguyên mẫu nhấn mạnh khẳng định trong câu nói hằng ngày.",
      "Cấu trúc này dùng khi đáp lời mời, xác nhận hoặc phản bác điều người khác vừa nói.",
    ],
    points: [
      "You do look tired.",
      "She does speak Japanese!",
      "I did lock the door.",
      "We do hope you can come.",
    ],
    examples: [
      { en: "I did send the email this morning.", vi: "Tôi có gửi email sáng nay đấy chứ." },
      { en: "You do sing beautifully.", vi: "Bạn hát hay thật đấy." },
      { en: "He does try his best.", vi: "Anh ấy có cố hết sức mà." },
    ],
  },

  "b1-pronouns-advanced": {
    intro: [
      "Đại từ phản thân (myself, yourself, himself…) dùng khi chủ ngữ và tân ngữ là một người, hoặc để nhấn mạnh “tự mình”.",
      "Đại từ tương hỗ each other / one another diễn tả hành động qua lại giữa hai hay nhiều người.",
    ],
    points: [
      "I made this cake myself.",
      "Be careful! You’ll hurt yourself.",
      "She introduced herself to the team.",
      "We help each other with homework.",
    ],
    examples: [
      { en: "He taught himself to play the guitar.", vi: "Anh ấy tự học chơi đàn ghi-ta." },
      { en: "The cat washed itself.", vi: "Con mèo tự liếm cho mình sạch." },
      { en: "They write to each other every month.", vi: "Họ viết thư cho nhau mỗi tháng." },
    ],
  },

  "b1-articles-names": {
    intro: [
      "Tên riêng, địa danh thường không dùng the; nhưng dãy núi, sông, biển, quần đảo, quốc gia số nhiều dùng the.",
      "Có the: the Alps, the Mekong, the Philippines, the Netherlands; không the: Mount Fuji, Lake Baikal, Vietnam.",
    ],
    points: [
      "Không the: tên phố (Le Loi Street), công viên, phần lớn thành phố và quốc gia.",
      "Có the: sông, biển, đại dương, dãy núi, quần đảo.",
      "Rạp phim, khách sạn, bảo tàng: the National Cinema, the Metropole.",
      "Họ nhà + số nhiều: the Smiths = gia đình Smith.",
    ],
    examples: [
      { en: "The Red River flows through Hanoi.", vi: "Sông Hồng chảy qua Hà Nội." },
      { en: "We spent summer in the Netherlands.", vi: "Mùa hè chúng tôi ở Hà Lan." },
      { en: "Have you been to Ha Long Bay?", vi: "Bạn đã đến Vịnh Hạ Long chưa?" },
    ],
  },

  "c1-determiners-quantity": {
    intro: [
      "both…(and) = cả hai; either…(or) = một trong hai; neither…(nor) = không cái nào trong hai.",
      "either / neither + danh từ số ít + động từ số ít; both + danh từ số nhiều + động từ số nhiều.",
    ],
    points: [
      "Both answers are correct.",
      "Either day works for me.",
      "Neither option is cheap.",
      "either of / neither of + the / these / my… + danh từ số nhiều.",
    ],
    examples: [
      { en: "Both of my parents are teachers.", vi: "Cả bố và mẹ tôi đều là giáo viên." },
      { en: "Neither restaurant opens on Monday.", vi: "Cả hai nhà hàng đều không mở cửa thứ Hai." },
      { en: "You can take either bus; both go downtown.", vi: "Bạn đi xe nào cũng được; cả hai đều vào trung tâm." },
    ],
  },

  "b1-adverbs-attitude": {
    intro: [
      "Trạng từ bình luận (luckily, honestly, apparently, clearly, obviously…) nhận định cả câu.",
      "Thường đứng đầu câu, theo sau là dấu phẩy; giúp nói rõ thái độ người nói mà không cần mệnh đề riêng.",
    ],
    points: [
      "Luckily, no one was hurt.",
      "Honestly, I don’t agree.",
      "Apparently, the flight is delayed.",
      "Surprisingly, he passed the test.",
    ],
    examples: [
      { en: "Fortunately, the meeting was short.", vi: "May thay, cuộc họp ngắn gọn." },
      { en: "Clearly, we need more time.", vi: "Rõ ràng là chúng ta cần thêm thời gian." },
      { en: "Apparently, she has moved to Da Nang.", vi: "Hình như cô ấy đã chuyển vào Đà Nẵng." },
    ],
  },

  "c2-adverb-position": {
    intro: [
      "Vị trí trạng từ: đầu câu (liên kết), giữa câu (trước động từ chính, sau be / trợ động từ), cuối câu (nơi chốn → thời gian).",
      "Trạng từ mức độ (just, only, even) đứng ngay trước từ nó giới hạn — đổi chỗ là đổi nghĩa.",
    ],
    points: [
      "Usually, I walk. / I usually walk.",
      "He has already finished. (giữa trợ động từ)",
      "She sang beautifully at the concert last night.",
      "Only I saw him ≠ I saw only him.",
    ],
    examples: [
      { en: "I have never been to Hue in autumn.", vi: "Tôi chưa từng đến Huế vào mùa thu." },
      { en: "Luckily, the train arrived on time.", vi: "May thay, tàu đến đúng giờ." },
      { en: "He only reads the headlines.", vi: "Anh ấy chỉ đọc tiêu đề thôi." },
    ],
  },

  "b1-comma-splice": {
    intro: [
      "Hai mệnh đề độc lập không nối bằng dấu phẩy. Phải dùng dấu chấm, dấu chấm phẩy, hoặc liên từ (and, but, so, because…).",
      "Lỗi comma splice: It was late, we went home. → đúng: It was late, so we went home.",
    ],
    points: [
      "Dùng dấu chấm: It was late. We went home.",
      "Dùng chấm phẩy: It was late; we went home.",
      "Thêm liên từ: It was late, so we went home.",
      "Lược mệnh đề: Being late, we took a taxi.",
    ],
    examples: [
      { en: "The bus was full, so we walked.", vi: "Xe buýt chật kín nên chúng tôi đi bộ." },
      { en: "I called twice; nobody picked up.", vi: "Tôi gọi hai lần; không ai bắt máy." },
      { en: "She opened the window. Fresh air came in.", vi: "Cô ấy mở cửa sổ. Gió mát tràn vào." },
    ],
  },

  "b1-degree-too-so-how": {
    intro: [
      "too + tính từ / trạng từ = quá mức (thường tiêu cực); so + tính từ + that = đến mức mà…",
      "enough đặt sau tính từ và trước danh từ; cấu trúc: too … to V, so … that + mệnh đề, Adj + enough + to V.",
    ],
    points: [
      "This bag is too heavy to carry.",
      "The box was so heavy that I dropped it.",
      "She is old enough to drive.",
      "It isn’t warm enough to swim.",
    ],
    examples: [
      { en: "The coffee is too hot to drink.", vi: "Cà phê nóng quá không uống được." },
      { en: "He speaks so fast that I can’t follow.", vi: "Anh ấy nói nhanh đến mức tôi không theo kịp." },
      { en: "The room is big enough for five people.", vi: "Phòng đủ rộng cho năm người." },
    ],
  },

  "b1-comparatives-advanced": {
    intro: [
      "So sánh tăng tiến: the more…, the more… (càng… càng…); so sánh tiến dần: more and more / bigger and bigger.",
      "Nhấn mạnh trước so sánh: much / far / a lot + comparative; slightly / a bit + comparative.",
    ],
    points: [
      "The sooner, the better.",
      "It’s getting warmer and warmer.",
      "This model is far better than the old one.",
      "twice as … as: This bag is twice as heavy as mine.",
    ],
    examples: [
      { en: "The more you practise, the faster you improve.", vi: "Càng luyện tập bạn càng tiến bộ nhanh." },
      { en: "Flights are getting more and more expensive.", vi: "Vé máy bay ngày càng đắt." },
      { en: "Her new flat is much smaller than the old one.", vi: "Căn hộ mới của cô ấy nhỏ hơn nhiều căn cũ." },
    ],
  },

  /* ------------------------------- A2 ------------------------------- */

  "a2-past-simple": {
    intro: [
      "Quá khứ đơn phủ định và câu hỏi dùng trợ động từ did: didn’t + động từ nguyên mẫu; Did + chủ ngữ + động từ nguyên mẫu?",
      "Khi did đã mang dấu hiệu quá khứ, động từ chính quay về nguyên mẫu — lỗi phổ biến của người Việt là chia lại -ed sau did.",
    ],
    points: [
      "Phủ định: I didn’t go to work yesterday. (không dùng didn’t went)",
      "Câu hỏi: Did you see that film? — Yes, I did. / No, I didn’t.",
      "To be riêng lẽ: wasn’t / weren’t và hỏi Was she at home? — không dùng did.",
      "Wh- + did: Where did you park? What did they say?",
    ],
    examples: [
      { en: "I didn’t sleep well last night.", vi: "Tối qua tôi ngủ không ngon." },
      { en: "Did you call your mother last weekend?", vi: "Cuối tuần trước bạn có gọi cho mẹ không?" },
      { en: "We didn’t have class on Friday.", vi: "Thứ Sáu bọn tôi không có tiết học." },
    ],
  },

  "a2-wh-which-whose": {
    intro: [
      "which hỏi lựa chọn trong nhóm rõ ràng (cái nào), whose hỏi về sở hữu (của ai).",
      "Cả hai đứng trước danh từ hoặc đứng một mình: Which one? Whose is this?",
    ],
    points: [
      "Which + danh từ: Which coat is yours?",
      "Which … do you prefer, A or B? — hỏi lựa chọn có phương án.",
      "Whose + danh từ: Whose bag is this? → It’s Lan’s.",
      "which chọn trong nhóm hẹp; what chọn trong phạm vi rộng hơn.",
    ],
    examples: [
      { en: "Which bus goes to the city centre?", vi: "Tuyến buýt nào đi vào trung tâm thành phố?" },
      { en: "Whose phone is ringing?", vi: "Điện thoại của ai đang reo vậy?" },
      { en: "Which do you prefer, tea or coffee?", vi: "Bạn thích loại nào hơn, trà hay cà phê?" },
    ],
  },

  "b2-wh-who": {
    intro: [
      "Hỏi về chủ ngữ: Who / What + động từ, không cần trợ động từ do, does, did.",
      "Hỏi về tân ngữ: Who(m) / What + trợ động từ + chủ ngữ + động từ. Đây là điểm người Việt hay nhầm.",
    ],
    points: [
      "Câu hỏi chủ ngữ: Who broke the window? Who wants ice cream?",
      "Câu hỏi tân ngữ: Who did you meet? What did he say?",
      "Quá khứ: chủ ngữ → Who called?; tân ngữ → Who did you call?",
      "Trong văn nói dùng who cho cả tân ngữ; whom trang trọng.",
    ],
    examples: [
      { en: "Who lives next door?", vi: "Ai sống ở căn bên cạnh?" },
      { en: "What happened at the station?", vi: "Chuyện gì đã xảy ra ở nhà ga?" },
      { en: "Who did you talk to this morning?", vi: "Sáng nay bạn đã nói chuyện với ai?" },
    ],
  },

  "a2-past-continuous": {
    intro: [
      "Quá khứ tiếp diễn (was / were + V-ing) diễn tả việc đang diễn ra tại một thời điểm hoặc một khoảng trong quá khứ.",
      "Thường ghép với quá khứ đơn: việc tiếp diễn là nền, việc quá khứ đơn chen vào ngang giữa.",
    ],
    points: [
      "I was cooking dinner when the phone rang.",
      "while + quá khứ tiếp diễn; when + quá khứ đơn.",
      "Hai việc song song: While I was reading, he was tidying up.",
      "Dấu hiệu: at 8 p.m. yesterday, all morning, this time last week.",
    ],
    examples: [
      { en: "I was cooking dinner when the phone rang.", vi: "Tôi đang nấu bữa tối thì điện thoại reo." },
      { en: "While we were walking home, it started to rain.", vi: "Trong lúc đi bộ về, trời bắt đầu mưa." },
      { en: "At eight last night, I was doing my homework.", vi: "Tám giờ tối qua tôi đang làm bài tập." },
    ],
  },

  "a2-used-to": {
    intro: [
      "used to + động từ nguyên mẫu kể thói quen hoặc trạng thái trong quá khứ mà nay không còn.",
      "Chỉ dùng cho quá khứ: phủ định là didn’t use to, câu hỏi Did you use to…?",
    ],
    points: [
      "I used to play in the street after school.",
      "Phủ định: She didn’t use to like coffee.",
      "Hỏi: Did you use to live in Da Nang?",
      "Đừng nhầm với be used to + V-ing = quen với việc (hiện tại).",
    ],
    examples: [
      { en: "I used to play marbles when I was small.", vi: "Hồi bé tôi hay chơi bắn bi." },
      { en: "She didn’t use to drink coffee, but now she loves it.", vi: "Trước đây cô ấy không uống cà phê, giờ lại nghiện." },
      { en: "Did you use to share a room with your sister?", vi: "Hồi xưa bạn có ngủ chung phòng với chị không?" },
    ],
  },

  "a2-present-perfect-intro": {
    intro: [
      "Hiện tại hoàn thành (have / has + V3) nói trải nghiệm, kết quả hoặc việc vừa xong mà không nói rõ thời gian.",
      "Có mốc thời gian rõ (yesterday, in 2020, last week) thì phải chuyển sang quá khứ đơn.",
    ],
    points: [
      "Trải nghiệm: Have you ever eaten sushi? — I’ve never tried it.",
      "Vừa xong: I’ve just finished my homework.",
      "already (trước khi mong đợi), yet (câu phủ định, câu hỏi).",
      "He has lost his keys = giờ vẫn chưa tìm thấy (khác He lost his keys yesterday).",
    ],
    examples: [
      { en: "I have just finished my homework.", vi: "Tôi vừa làm bài tập xong." },
      { en: "Have you ever eaten sushi?", vi: "Bạn đã từng ăn sushi chưa?" },
      { en: "She has never been to Europe.", vi: "Cô ấy chưa từng đến châu Âu." },
    ],
  },

  "a2-future-will": {
    intro: [
      "will + động từ nguyên mẫu nói về tương lai: quyết định đưa ra ngay lúc nói, lời hứa, lời đề nghị và dự đoán.",
      "Phủ định là won’t; câu hỏi Will you…? xin hứa hoặc mời.",
    ],
    points: [
      "Quyết định lúc nói: The phone’s ringing — I’ll answer it.",
      "Lời hứa: I’ll call you as soon as I arrive.",
      "Đề nghị: I’ll carry that bag for you.",
      "Dự đoán: It won’t be cold tomorrow.",
    ],
    examples: [
      { en: "I’ll help you with your bags.", vi: "Tôi sẽ giúp bạn xách đồ." },
      { en: "It won’t be cold tomorrow, I think.", vi: "Chắc ngày mai trời sẽ không lạnh." },
      { en: "Will you come to our party on Saturday?", vi: "Thứ Bảy bạn có đến dự tiệc của chúng tôi không?" },
    ],
  },

  "a2-be-going-to": {
    intro: [
      "be going to + động từ nguyên mẫu nói kế hoạch đã định trước hoặc dự đoán dựa trên dấu hiệu thấy rõ ngay.",
      "Chia theo chủ ngữ: am / is / are going to.",
    ],
    points: [
      "Kế hoạch: We’re going to visit Hue this summer.",
      "Dự đoán có dấu hiệu: Look at those clouds — it’s going to rain.",
      "Phủ định: He isn’t going to take the exam this year.",
      "Khác will: be going to định trước, will quyết lúc nói.",
    ],
    examples: [
      { en: "We’re going to repaint the kitchen next weekend.", vi: "Cuối tuần sau chúng tôi sẽ sơn lại bếp." },
      { en: "Careful! You’re going to drop the tray.", vi: "Cẩn thận! Sắp đánh rơi khay rồi." },
      { en: "She isn’t going to move house this year.", vi: "Năm nay cô ấy sẽ không chuyển nhà." },
    ],
  },

  "a2-present-continuous-future": {
    intro: [
      "Hiện tại tiếp diễn có thể nói về kế hoạch tương lai đã sắp xếp (có ngày giờ, có hẹn): I’m meeting Lan tomorrow.",
      "Hiện tại đơn nói lịch trình cố định của tàu xe, rạp phim, trường lớp: The train leaves at 6:15.",
    ],
    points: [
      "I’m seeing the dentist on Friday. — đã có hẹn.",
      "The train leaves at six tomorrow morning. — lịch trình.",
      "Cần từ chỉ tương lai đi kèm, nếu không câu bị hiểu là hiện tại.",
      "be going to = dự định; hiện tại tiếp diễn = đã chốt lịch.",
    ],
    examples: [
      { en: "I’m having lunch with Lan at noon.", vi: "Buổi trưa tôi ăn trưa với Lan." },
      { en: "The flight departs at 9:40 tomorrow.", vi: "Chuyến bay mai cất cánh lúc 9:40." },
      { en: "We’re flying to Bangkok next week.", vi: "Tuần sau chúng tôi bay đi Bangkok." },
    ],
  },

  "a1-to-infinitive": {
    intro: [
      "Nhiều động từ nối với to + động từ nguyên mẫu: want, need, decide, hope, plan, try, learn, promise.",
      "Phủ định đặt not trước to V; muốn ai làm gì dùng want / ask + người + to V.",
    ],
    points: [
      "I want to learn Japanese. / We decided to stay at home.",
      "She needs to sleep more. He hopes to pass the test.",
      "Phủ định: They promised not to be late.",
      "want / ask + người + to V: I asked him to wait.",
    ],
    examples: [
      { en: "I want to learn Japanese.", vi: "Tôi muốn học tiếng Nhật." },
      { en: "She decided to take the morning train.", vi: "Cô ấy quyết định đi chuyến tàu sáng." },
      { en: "We hope to see you again soon.", vi: "Chúng tôi mong sớm gặp lại bạn." },
    ],
  },

  "a2-modal-should-shall": {
    intro: [
      "should + động từ nguyên mẫu đưa lời khuyên, ý kiến về điều đúng đắn; không mạnh như must.",
      "Shall we…? gợi ý cùng nhau làm việc gì (Anh-Anh phổ biến).",
    ],
    points: [
      "You should drink more water.",
      "Phủ định: You shouldn’t stay up so late.",
      "Gợi ý: Shall we go by bus? — Good idea.",
      "should nói ý kiến của người nói; have to nói quy định bên ngoài.",
    ],
    examples: [
      { en: "You should book the tickets early.", vi: "Bạn nên đặt vé sớm." },
      { en: "We shouldn’t spend all our money on snacks.", vi: "Chúng ta không nên tiêu hết tiền vào đồ ăn vặt." },
      { en: "Shall I open the window?", vi: "Mình mở cửa sổ nhé?" },
    ],
  },

  "a2-modal-have-to": {
    intro: [
      "have to + động từ nguyên mẫu diễn tả sự bắt buộc đến từ quy định, hoàn cảnh bên ngoài.",
      "he / she / it dùng has to; quá khứ dùng had to; phủ định don’t / doesn’t have to = không cần thiết.",
    ],
    points: [
      "I have to get up early on Mondays.",
      "She has to wear a uniform at work.",
      "Quá khứ: We had to queue for an hour.",
      "don’t have to = không phải làm (khác mustn’t = cấm).",
    ],
    examples: [
      { en: "I have to get up early on Mondays.", vi: "Thứ Hai nào tôi cũng phải dậy sớm." },
      { en: "She has to wear a uniform at work.", vi: "Cô ấy phải mặc đồng phục khi làm việc." },
      { en: "We don’t have to pay for children under six.", vi: "Trẻ em dưới sáu tuổi không phải trả tiền." },
    ],
  },

  "a2-modal-may-must": {
    intro: [
      "must + động từ nguyên mẫu nói nghĩa vụ mạnh: luật lệ, quy định hoặc tự nhủ bản thân.",
      "may dùng để xin phép hoặc cho phép một cách lịch sự; may not = không được phép (trang trọng hơn mustn’t).",
    ],
    points: [
      "You must wear a seatbelt. — luật.",
      "I must finish this report today. — tự nhủ.",
      "mustn’t = cấm: You mustn’t smoke in here.",
      "May I come in? — May I…? lịch sự hơn Can I…?",
    ],
    examples: [
      { en: "You must wear a helmet when riding a motorbike.", vi: "Đi xe máy bạn phải đội mũ bảo hiểm." },
      { en: "You mustn’t use your phone during the exam.", vi: "Không được dùng điện thoại khi đang thi." },
      { en: "May I borrow your dictionary?", vi: "Tôi mượn từ điển của bạn được không?" },
    ],
  },

  "a2-modal-could": {
    intro: [
      "Could I…? và Could you…? là cách nhờ vả, xin phép lịch sự — mềm mại hơn can.",
      "Trả lời: Of course. / Certainly. / No problem. Hoặc từ chối khéo: I’m afraid…",
    ],
    points: [
      "Could you open the window, please? — nhờ người khác.",
      "Could I borrow your pen? — xin phép cho mình.",
      "could + lịch sự hơn can; thêm please càng mềm.",
      "Từ chối: I’m afraid I can’t. / Sorry, I’m using it.",
    ],
    examples: [
      { en: "Could you open the window, please?", vi: "Bạn mở cửa sổ giúp tôi nhé?" },
      { en: "Could I borrow your umbrella for a minute?", vi: "Tôi mượn ô của bạn một lát được không?" },
      { en: "Could you speak a little more slowly?", vi: "Bạn nói chậm lại chút được không?" },
    ],
  },

  "a2-comparatives": {
    intro: [
      "Tính từ dài (2 âm tiết trở lên) so sánh bằng more / the most: more expensive, the most expensive.",
      "So sánh bằng cấp dùng as … as (bằng nhau) và not as / so … as (không bằng).",
    ],
    points: [
      "more + tính từ dài: This book is more interesting.",
      "the most + tính từ dài: It’s the most useful app I know.",
      "as + adj + as: My bag is as heavy as yours.",
      "not as / so + adj + as: Today isn’t as hot as yesterday.",
    ],
    examples: [
      { en: "This exercise is more difficult than the last one.", vi: "Bài này khó hơn bài trước." },
      { en: "My room isn’t as big as my brother’s.", vi: "Phòng tôi không rộng bằng phòng anh trai." },
      { en: "That was the most boring film of the year.", vi: "Đó là bộ phim chán nhất năm." },
    ],
  },

  "a2-adverbs-manner": {
    intro: [
      "Trạng từ cách thức cho biết việc được làm thế nào, phần lớn thêm -ly vào tính từ: quick → quickly.",
      "Vị trí: sau động từ (hoặc sau tân ngữ nếu có).",
    ],
    points: [
      "She speaks English fluently. / He drove home quickly.",
      "Sau tân ngữ: He did the test carefully.",
      "Ngoại lệ không thêm -ly: fast, hard, late, early.",
      "Tốt: good → well (She sings well).",
    ],
    examples: [
      { en: "She speaks English fluently.", vi: "Cô ấy nói tiếng Anh trôi chảy." },
      { en: "Please write your name clearly here.", vi: "Vui lòng viết tên rõ ràng vào đây." },
      { en: "He drives very carefully in the rain.", vi: "Anh ấy lái xe rất cẩn thận khi trời mưa." },
    ],
  },

  "a2-word-classes": {
    intro: [
      "Hậu tố giúp nhận biết từ loại: -er / -or chỉ người làm nghề, -ful / -less tạo tính từ, -ly tạo trạng từ, -ness / -ment tạo danh từ trừu tượng.",
      "Một gốc từ có thể sinh cả họ: care → careful → carefully → carelessness.",
    ],
    points: [
      "Người: teach → teacher, act → actor, drive → driver.",
      "Tính từ: useful, beautiful, helpful; careless, useless.",
      "Trạng từ: slowly, easily, happily.",
      "Danh từ: happiness, development, movement.",
    ],
    examples: [
      { en: "She is a very careful driver.", vi: "Cô ấy là người lái xe rất cẩn thận." },
      { en: "The soup was tasty and healthy.", vi: "Món súp vừa ngon vừa tốt cho sức khỏe." },
      { en: "He finished the test easily.", vi: "Anh ấy làm bài kiểm tra một cách dễ dàng." },
    ],
  },

  "a2-quantifiers": {
    intro: [
      "many dùng với danh từ đếm được số nhiều, much dùng với danh từ không đếm được — cả hai thường xuất hiện trong câu hỏi và câu phủ định.",
      "a few + đếm được, a little + không đếm được mang nghĩa tích cực: vẫn có một ít.",
    ],
    points: [
      "How many students are there? / How much milk do we need?",
      "There isn’t much time left. — không đếm được.",
      "a few friends, a few ideas — đếm được.",
      "a little sugar, a little luck — không đếm được.",
    ],
    examples: [
      { en: "How many students are there in your class?", vi: "Lớp bạn có bao nhiêu học viên?" },
      { en: "There isn’t much milk in the fridge.", vi: "Trong tủ lạnh không còn bao nhiêu sữa." },
      { en: "I have a few close friends here.", vi: "Ở đây tôi có vài người bạn thân." },
    ],
  },

  "a2-articles-zero": {
    intro: [
      "Không dùng mạo từ với bữa ăn, môn học, thể thao, ngôn ngữ và danh từ số nhiều nói chung.",
      "the dùng khi đối tượng đã được xác định: đã nhắc trước đó, có bổ ngữ xác định hoặc duy nhất.",
    ],
    points: [
      "We have breakfast at seven. / She studies chemistry.",
      "I like books and music. — nói chung chung.",
      "The flowers in your garden are lovely. — xác định.",
      "Quốc gia thường không mạo từ (Vietnam), trừ the UK, the USA, the Philippines.",
    ],
    examples: [
      { en: "We have breakfast at seven every day.", vi: "Bọn tôi ăn sáng lúc bảy giờ mỗi ngày." },
      { en: "She studies chemistry at university.", vi: "Cô ấy học hóa ở trường đại học." },
      { en: "The flowers in your garden are lovely.", vi: "Hoa trong vườn nhà bạn đẹp lắm." },
    ],
  },

  "a2-compound-nouns": {
    intro: [
      "Danh từ ghép gồm hai danh từ đứng cạnh: danh từ thứ nhất bổ nghĩa cho danh từ thứ hai (bus stop, football match).",
      "Danh từ bổ nghĩa luôn ở số ít: shoe shop (không dùng shoes shop).",
    ],
    points: [
      "bus stop, car park, football match, railway station.",
      "Danh từ đầu làm bổ nghĩa: a shoe shop, a tooth brush → toothbrush.",
      "Có cụm viết liền (bedroom, football), có cụm viết rời (bus stop).",
      "Trọng âm rơi vào danh từ thứ nhất.",
    ],
    examples: [
      { en: "I waited at the bus stop for ten minutes.", vi: "Tôi đợi ở bến xe mười phút." },
      { en: "There are two bedrooms upstairs.", vi: "Lầu trên có hai phòng ngủ." },
      { en: "She bought a new watch battery.", vi: "Cô ấy mua một viên pin đồng hồ mới." },
    ],
  },

  "a2-determiners": {
    intro: [
      "another + danh từ số ít: thêm một cái nữa trong nhóm tương tự.",
      "other + danh từ số nhiều: những cái khác; the other chỉ cái còn lại khi chỉ còn đúng hai hoặc nhóm đã xác định.",
    ],
    points: [
      "Would you like another cup of tea?",
      "other + danh từ số nhiều: other students, other questions.",
      "the other + số ít: I have two pens. One is blue, the other is black.",
      "the other + số nhiều: the other students = những bạn còn lại.",
    ],
    examples: [
      { en: "Would you like another cup of tea?", vi: "Bạn muốn thêm một tách trà nữa không?" },
      { en: "Some students like maths; other students prefer music.", vi: "Vài bạn thích toán, những bạn khác thích nhạc hơn." },
      { en: "One of my brothers is a doctor, the other is an engineer.", vi: "Một anh trai tôi là bác sĩ, anh kia là kỹ sư." },
    ],
  },

  "a2-pronouns-ones-others": {
    intro: [
      "one thay cho danh từ đếm được số ít, ones thay cho số nhiều — giúp tránh lặp từ.",
      "one / ones luôn có từ bổ nghĩa: this one, the blue ones, a bigger one.",
    ],
    points: [
      "Which shirt? — This one, please.",
      "I don’t like these cups. Have we got bigger ones?",
      "a / the + tính từ + one: a small one, the red one.",
      "one không dùng ngay sau own hoặc danh từ sở hữu: my car, not my one.",
    ],
    examples: [
      { en: "Which drink would you like — this one or that one?", vi: "Bạn muốn loại nước nào — loại này hay loại kia?" },
      { en: "The red shoes are nicer than the white ones.", vi: "Đôi giày đỏ đẹp hơn đôi trắng." },
      { en: "My laptop is old; I need a faster one.", vi: "Laptop của tôi cũ rồi; tôi cần chiếc nhanh hơn." },
    ],
  },

  "c2-pronouns-possessive": {
    intro: [
      "Đại từ sở hữu (mine, yours, his, hers, ours, theirs) đứng một mình, không đi kèm danh từ.",
      "Sở hữu cách ’s dùng với người và vật nuôi; với vật hoặc cụm dài dùng of…",
    ],
    points: [
      "This bike is mine; that one is hers.",
      "Lan’s bag; my parents’ car (số nhiều: s’).",
      "the door of the room — vật vô tri dùng of.",
      "a friend of mine = một trong những bạn của tôi.",
    ],
    examples: [
      { en: "This bike is mine; that one is hers.", vi: "Xe này là của tôi, xe kia là của cô ấy." },
      { en: "That’s my parents’ house by the river.", vi: "Kia là nhà của bố mẹ tôi bên sông." },
      { en: "Is this laptop yours or his?", vi: "Chiếc laptop này của bạn hay của anh ấy?" },
    ],
  },

  "a2-would-rather": {
    intro: [
      "would like + to V hoặc danh từ diễn tả mong muốn lịch sự (nghĩa là muốn, sẽ).",
      "would rather + động từ nguyên mẫu nói điều mình thích hơn; would rather + chủ ngữ + quá khứ đơn mong người khác làm / đừng làm.",
    ],
    points: [
      "I’d like to book a table for two.",
      "Would you like something to drink?",
      "I’d rather walk than wait for the bus. (thích hơn, cùng chủ ngữ)",
      "I’d rather you didn’t smoke in here. (mong người khác)",
    ],
    examples: [
      { en: "I’d like to book a table for two, please.", vi: "Tôi muốn đặt bàn cho hai người." },
      { en: "I’d rather walk than wait for the bus.", vi: "Tôi thích đi bộ hơn là chờ xe buýt." },
      { en: "I’d rather you didn’t tell anyone about this.", vi: "Tôi mong bạn đừng kể chuyện này với ai." },
    ],
  },

  "a2-functional-questions": {
    intro: [
      "Đề nghị giúp đỡ dùng Shall I…? / Can I…?; mời ai làm gì dùng Would you like…?",
      "Gợi ý cùng làm dùng Let’s + động từ nguyên mẫu hoặc How about / What about + V-ing?",
    ],
    points: [
      "Shall I make some coffee? — đề nghị.",
      "Would you like something to eat? — mời.",
      "Let’s watch a film tonight.",
      "How about eating out? / What about trying the new cafe?",
    ],
    examples: [
      { en: "Shall I carry that box for you?", vi: "Tôi xách giúp bạn cái hộp nhé?" },
      { en: "Would you like some more rice?", vi: "Bạn dùng thêm chút cơm không?" },
      { en: "How about watching a film tonight?", vi: "Tối nay mình đi xem phim thì sao?" },
    ],
  },

  "a2-clauses-that-if-as": {
    intro: [
      "Sau các động từ suy nghĩ, nói, biết (think, say, know, believe, hope, remember) có thể thêm mệnh đề that.",
      "Trong văn nói, that thường được bỏ: I think (that) you’re right.",
    ],
    points: [
      "I think (that) the film was great.",
      "She said that she was tired.",
      "if = liệu rằng: Do you know if the shop is open?",
      "as = theo như: As you know, we start on Monday.",
    ],
    examples: [
      { en: "I think the test was quite easy.", vi: "Tôi nghĩ bài kiểm tra khá dễ." },
      { en: "She said that she would call me later.", vi: "Cô ấy nói sẽ gọi cho tôi sau." },
      { en: "Do you know if the bank opens on Saturday?", vi: "Bạn có biết ngân hàng thứ Bảy có mở không?" },
    ],
  },

  "a2-exclamation": {
    intro: [
      "Câu cảm thán nhấn mạnh cảm xúc: What + (a / an) + tính từ + danh từ! và How + tính từ / trạng từ!",
      "Có danh từ thì dùng What, chỉ có tính từ hoặc trạng từ thì dùng How.",
    ],
    points: [
      "What a beautiful day! (danh từ số ít, có a/an)",
      "What lovely flowers! (danh từ số nhiều, không a/an)",
      "What bad luck! (danh từ không đếm được)",
      "How kind of you! / How quickly he runs!",
    ],
    examples: [
      { en: "What a beautiful day!", vi: "Một ngày đẹp làm sao!" },
      { en: "What lovely flowers!", vi: "Hoa đẹp quá!" },
      { en: "How kind of you to help!", vi: "Bạn giúp đỡ thật tốt bụng!" },
    ],
  },

  "a2-conditional-zero": {
    intro: [
      "Câu điều kiện loại 0 nói chân lý, quy luật luôn đúng: If + hiện tại đơn, hiện tại đơn.",
      "Có thể thay if bằng when mà nghĩa gần như không đổi.",
    ],
    points: [
      "If you heat ice, it melts.",
      "If I drink coffee at night, I don’t sleep well.",
      "when + hiện tại đơn: Plants die when you don’t water them.",
      "Hai mệnh đề cùng một thì hiện tại đơn.",
    ],
    examples: [
      { en: "If you heat ice, it melts.", vi: "Nếu làm nóng đá, đá tan ra." },
      { en: "If I eat late, I don’t sleep well.", vi: "Nếu ăn khuya, tôi ngủ không ngon." },
      { en: "Plants die if you don’t water them.", vi: "Cây chết nếu không tưới nước." },
    ],
  },

  "a2-first-conditional": {
    intro: [
      "Câu điều kiện loại 1 nói khả năng có thật trong tương lai: If + hiện tại đơn, will + động từ nguyên mẫu.",
      "Mệnh đề if không bao giờ dùng will — lỗi rất phổ biến.",
    ],
    points: [
      "If it rains tomorrow, we will stay at home.",
      "You’ll pass the exam if you study hard.",
      "will có thể thay bằng can / might: If I see him, I might tell him.",
      "Mệnh đề if đứng sau cũng được: We’ll stay at home if it rains.",
    ],
    examples: [
      { en: "If it rains tomorrow, we will stay at home.", vi: "Nếu mai mưa, chúng tôi sẽ ở nhà." },
      { en: "You’ll pass the test if you study hard.", vi: "Bạn sẽ đỗ nếu học chăm chỉ." },
      { en: "If I finish early, I might join you for coffee.", vi: "Nếu làm xong sớm, có lẽ tôi sẽ đi cà phê với bạn." },
    ],
  },

  "a1-relative-who": {
    intro: [
      "Mệnh đề quan hệ bổ nghĩa cho danh từ đứng trước: who cho người, which cho vật, that dùng cho cả hai.",
      "Mệnh đề quan hệ xác định đứng ngay sau danh từ, không tách bằng dấu phẩy.",
    ],
    points: [
      "The woman who lives upstairs is a nurse.",
      "I like songs which tell a story.",
      "that thay được who / which trong mệnh đề xác định.",
      "Làm tân ngữ có thể bỏ đại từ: the film (that) we watched.",
    ],
    examples: [
      { en: "The woman who lives upstairs is a nurse.", vi: "Người phụ nữ ở trên lầu là y tá." },
      { en: "I like songs which tell a story.", vi: "Tôi thích những bài hát kể một câu chuyện." },
      { en: "This is the phone (that) I bought last week.", vi: "Đây là chiếc điện thoại tôi mua tuần trước." },
    ],
  },

  "a2-sentence-patterns": {
    intro: [
      "Mẫu S-V-C: chủ ngữ + động từ nối (be, become, seem, look, feel, sound) + bổ ngữ mô tả chủ ngữ.",
      "Mẫu S-V-O-C: make, call, name, consider, find, keep + tân ngữ + bổ ngữ mô tả tân ngữ.",
    ],
    points: [
      "The soup smells delicious. — bổ ngữ cho chủ ngữ.",
      "My brother became a doctor last year.",
      "They call their son Tung. — bổ ngữ cho tân ngữ.",
      "I find this exercise quite easy. (find + O + adj)",
    ],
    examples: [
      { en: "The soup smells delicious.", vi: "Món súp thơm phức." },
      { en: "They call their son Tung.", vi: "Họ gọi con trai là Tùng." },
      { en: "I find this exercise quite easy.", vi: "Tôi thấy bài tập này khá dễ." },
    ],
  },

  "a2-verb-ving": {
    intro: [
      "Động từ giác quan (see, hear, watch, feel) + tân ngữ + V-ing diễn tả việc đang chứng kiến hành động diễn ra.",
      "So sánh: see + tân ngữ + V nguyên mẫu nói thấy trọn vẹn hành động từ đầu đến cuối.",
    ],
    points: [
      "I saw her crossing the street. — đang băng qua.",
      "I saw her cross the street. — thấy trọn hành động.",
      "We heard someone singing next door.",
      "watch / notice / feel cũng dùng cấu trúc này.",
    ],
    examples: [
      { en: "I saw her crossing the street.", vi: "Tôi thấy cô ấy đang băng qua đường." },
      { en: "We heard someone singing next door.", vi: "Chúng tôi nghe thấy ai đó đang hát ở nhà bên." },
      { en: "She watched the children playing in the yard.", vi: "Cô ấy xem lũ trẻ chơi trong sân." },
    ],
  },

  "a2-causative": {
    intro: [
      "let + tân ngữ + động từ nguyên mẫu = cho phép làm gì; make + tân ngữ + động từ nguyên mẫu = bắt buộc làm gì.",
      "Ở thể bị động, make phải thêm to: be made to V; let thường thay bằng be allowed to.",
    ],
    points: [
      "My parents let me stay out late on Saturdays.",
      "The teacher made us rewrite the essay.",
      "Bị động: We were made to wait for an hour.",
      "Trang trọng: We were allowed to leave early.",
    ],
    examples: [
      { en: "My parents let me stay out late on Saturdays.", vi: "Thứ Bảy bố mẹ cho tôi chơi ngoài kia đến khuya." },
      { en: "The teacher made us rewrite the essay.", vi: "Cô giáo bắt chúng tôi viết lại bài luận." },
      { en: "We were made to wait for an hour.", vi: "Chúng tôi bị bắt chờ một tiếng đồng hồ." },
    ],
  },

  "a2-prepositions-movement": {
    intro: [
      "Giới từ chuyển động chỉ hướng đi: into (vào trong), out of (ra khỏi), onto (lên bề mặt), off (rời khỏi), through (xuyên qua), across (băng qua), along (dọc theo), towards (về phía).",
      "Khác giới từ tĩnh: in the room nhưng into the room.",
    ],
    points: [
      "She walked into the room quietly.",
      "He fell off his bike. / The cat jumped onto the table.",
      "through = xuyên qua không gian: walk through the tunnel.",
      "across = băng qua bề mặt: swim across the river.",
    ],
    examples: [
      { en: "She walked into the room quietly.", vi: "Cô ấy lặng lẽ bước vào phòng." },
      { en: "The cat jumped onto the table.", vi: "Con mèo nhảy lên bàn." },
      { en: "We cycled along the river and across the bridge.", vi: "Bọn tôi đạp xe dọc sông và băng qua cầu." },
    ],
  },

  "a2-phrasal-verbs": {
    intro: [
      "Cụm động từ = động từ + trạng từ hoặc giới từ, mang nghĩa riêng phải học như một từ mới: get up, turn on, look for, give up.",
      "Tân ngữ là danh từ có thể đặt giữa hoặc sau; tân ngữ là đại từ phải đặt giữa (turn it on).",
    ],
    points: [
      "I usually get up at six. — dậy.",
      "Could you turn the volume down? — vặn nhỏ.",
      "I’m looking for my glasses. — tìm kiếm.",
      "Đại từ tân ngữ đứng giữa: turn it on (không dùng turn on it).",
    ],
    examples: [
      { en: "I usually get up at six.", vi: "Tôi thường dậy lúc sáu giờ." },
      { en: "Could you turn the volume down?", vi: "Bạn vặn nhỏ âm lượng giúp tôi nhé?" },
      { en: "Don’t give up — try again.", vi: "Đừng bỏ cuộc — thử lại đi." },
    ],
  },

  "a2-dependent-prepositions": {
    intro: [
      "Nhiều tính từ, động từ yêu cầu giới từ cố định đi kèm: good at, afraid of, interested in, listen to, wait for, depend on.",
      "Phải học cả cụm, vì giới từ không dịch được từng tiếng một sang tiếng Việt.",
    ],
    points: [
      "Tính từ: good at, afraid of, angry with, interested in, different from.",
      "Động từ: listen to, wait for, look at, belong to, depend on.",
      "agree with a person; agree about / on a topic.",
      "Lỗi thường gặp: discuss about (sai) — discuss something (đúng).",
    ],
    examples: [
      { en: "She is very good at drawing.", vi: "Cô ấy rất giỏi vẽ." },
      { en: "I’m waiting for the doctor.", vi: "Tôi đang chờ bác sĩ." },
      { en: "It depends on the weather.", vi: "Cái đó tùy thời tiết." },
    ],
  },

  /* ------------------------------- B2 ------------------------------- */

  "b2-narrative-tenses": {
    intro: [
      "Quá khứ hoàn thành tiếp diễn (had been + V-ing) nhấn mạnh khoảng thời gian một việc đã kéo dài trước một mốc trong quá khứ.",
      "Trong văn kể, thì này đặt nền: giải thích tình trạng của hiện tại quá khứ (đường ướt vì trời đã mưa).",
    ],
    points: [
      "She had been studying for three hours when I called.",
      "Dấu hiệu: for, since, all day, when + quá khứ đơn.",
      "Kết quả còn thấy: The road was wet because it had been raining.",
      "Khác quá khứ hoàn thành: nhấn quá trình kéo dài hơn kết quả.",
    ],
    examples: [
      { en: "She had been studying for three hours when I called.", vi: "Khi tôi gọi thì cô ấy đã học được ba tiếng." },
      { en: "The road was wet because it had been raining all night.", vi: "Đường ướt vì trời đã mưa cả đêm." },
      { en: "They had been living there since 2010 before they moved to Hanoi.", vi: "Họ sống ở đó từ 2010 trước khi chuyển vào Hà Nội." },
    ],
  },

  "b2-present-perfect-continuous": {
    intro: [
      "Hiện tại hoàn thành đơn nhấn kết quả (I’ve painted the wall — tường giờ đã sơn xong); hoàn thành tiếp diễn nhấn quá trình (I’ve been painting all morning).",
      "Khi nói số lượng, việc đã hoàn tất hoặc trạng thái (know, have) thì dùng hoàn thành đơn.",
    ],
    points: [
      "Kết quả: I’ve written three emails this morning.",
      "Quá trình: I’ve been writing emails all morning.",
      "have been + V-ing với how long: How long have you been learning English?",
      "Dấu vết hiện tại: Someone has been using my computer.",
    ],
    examples: [
      { en: "I’ve read three chapters, but I’ve been reading all afternoon.", vi: "Tôi đã đọc xong ba chương, và tôi đã đọc suốt buổi chiều." },
      { en: "How long have you been learning English?", vi: "Bạn học tiếng Anh bao lâu rồi?" },
      { en: "Someone has been using my computer — the screen is different.", vi: "Có người đã dùng máy tính của tôi — màn hình bị đổi." },
    ],
  },

  "c2-future-in-the-past": {
    intro: [
      "Tương lai trong quá khứ kể về điều khi đó được coi là tương lai: would + V, was / were going to + V, was / were about to + V.",
      "was going to thường ngầm nói dự định không thành: We were going to travel, but the trip was cancelled.",
    ],
    points: [
      "Lời hứa được kể lại: She said she would call me later.",
      "Dự định không thành: I was going to write, but I forgot.",
      "Sắp sửa: I was about to leave when it started to rain.",
      "was to + V: kế hoạch chính thức (the train was to depart at noon).",
    ],
    examples: [
      { en: "She said she would call me later.", vi: "Cô ấy nói sẽ gọi cho tôi sau." },
      { en: "We were going to travel abroad, but the trip was cancelled.", vi: "Bọn tôi định đi nước ngoài nhưng chuyến đi bị hủy." },
      { en: "I was about to leave when it started to rain.", vi: "Tôi sắp đi thì trời đổ mưa." },
    ],
  },

  "b1-modal-past-habits": {
    intro: [
      "would + động từ nguyên mẫu kể thói quen lặp lại trong quá khứ (cần bối cảnh quá khứ rõ), khác used to ở chỗ would không dùng cho trạng thái.",
      "be used to + V-ing nghĩa là quen với việc gì (ở hiện tại hoặc quá khứ); be always + V-ing phàn nàn thói quen.",
    ],
    points: [
      "Every summer, we would go to my grandmother’s village.",
      "used to cho trạng thái: I used to have long hair (không dùng would).",
      "I’m used to getting up early now. — quen rồi.",
      "He is always losing his keys. — phàn nàn.",
    ],
    examples: [
      { en: "Every summer, we would go to my grandmother’s village.", vi: "Mỗi mùa hè bọn tôi lại về làng của bà." },
      { en: "I’m used to getting up early now.", vi: "Giờ tôi đã quen dậy sớm rồi." },
      { en: "He is always losing his keys.", vi: "Anh ta toàn làm mất chìa khóa." },
    ],
  },

  "b2-future-continuous": {
    intro: [
      "Tương lai tiếp diễn (will be + V-ing) nói việc sẽ đang diễn ra tại một mốc tương lai, hoặc kế hoạch đã nằm trong lộ trình.",
      "Cũng dùng để hỏi về kế hoạch của người khác một cách lịch sự, không gây áp lực.",
    ],
    points: [
      "This time tomorrow, we will be landing in Hanoi.",
      "Kế hoạch tự nhiên: I’ll be passing the post office anyway.",
      "Hỏi lịch sự: Will you be using the car this evening?",
      "Phủ định: won’t be + V-ing.",
    ],
    examples: [
      { en: "This time tomorrow, we will be landing in Hanoi.", vi: "Giờ này ngày mai chúng tôi sẽ đang hạ cánh xuống Hà Nội." },
      { en: "I’ll be passing the post office, so I can post your letter.", vi: "Đường tôi có ngang bưu điện nên sẽ gửi giùm lá thư của bạn." },
      { en: "Will you be using the car this evening?", vi: "Tối nay bạn có dùng xe không?" },
    ],
  },

  "b2-future-perfect": {
    intro: [
      "Tương lai hoàn thành (will have + V3) nói việc sẽ hoàn tất trước một mốc trong tương lai.",
      "Dấu hiệu điển hình: by + thời gian, by the time + mệnh đề hiện tại đơn.",
    ],
    points: [
      "By 2030, they will have finished the metro line.",
      "She will have graduated by the time you return.",
      "Phủ định: won’t have + V3 — chưa xong trước mốc.",
      "Câu hỏi: Will you have finished the report by Friday?",
    ],
    examples: [
      { en: "By 2030, they will have finished the metro line.", vi: "Đến năm 2030, họ sẽ hoàn thành tuyến metro." },
      { en: "She will have graduated by the time you return.", vi: "Khi bạn quay lại, cô ấy đã tốt nghiệp rồi." },
      { en: "We won’t have repaired the roof before the rainy season.", vi: "Trước mùa mưa chúng tôi sẽ chưa sửa xong mái nhà." },
    ],
  },

  "b2-future-perfect-continuous": {
    intro: [
      "Tương lai hoàn thành tiếp diễn (will have been + V-ing) nhấn mạnh độ dài thời gian một việc sẽ kéo đến mốc tương lai.",
      "Hầu như luôn đi với for + khoảng thời gian.",
    ],
    points: [
      "By June, I will have been working here for five years.",
      "She will have been driving for hours by noon.",
      "Nhấn thời lượng, không nhấn kết quả.",
      "Văn nói ít dùng, chủ yếu trong văn viết, báo cáo.",
    ],
    examples: [
      { en: "By June, I will have been working here for five years.", vi: "Đến tháng Sáu, tôi làm ở đây tròn năm năm." },
      { en: "By noon, she will have been driving for six hours.", vi: "Đến trưa, cô ấy sẽ lái xe được sáu tiếng." },
      { en: "In August, they will have been building the bridge for two years.", vi: "Đến tháng Tám, họ xây cây cầu được hai năm." },
    ],
  },

  "b2-passive-continuous": {
    intro: [
      "Bị động tiếp diễn: am / is / are being + V3 (hiện tại) và was / were being + V3 (quá khứ).",
      "Dùng khi việc đang được thực hiện lúc nói hoặc trong một khoảng thời gian quá khứ.",
    ],
    points: [
      "The bridge is being repaired, so the road is closed.",
      "The flats were being built when we visited.",
      "Câu hỏi: Is the hall being decorated at the moment?",
      "Chủ thể không quan trọng hoặc không biết.",
    ],
    examples: [
      { en: "The bridge is being repaired, so the road is closed.", vi: "Cây cầu đang được sửa nên đường tạm đóng." },
      { en: "The new flats were being built when we visited the area.", vi: "Khi chúng tôi đến khu đó, các căn hộ đang được xây." },
      { en: "Is the hall being decorated at the moment?", vi: "Hiện giờ hội trường có đang được trang trí không?" },
    ],
  },

  "b2-passive-perfect": {
    intro: [
      "Bị động hoàn thành: have / has been + V3 (hiện tại) và had been + V3 (quá khứ).",
      "Nhấn việc đã hoàn tất, thường khi chủ thể làm không quan trọng.",
    ],
    points: [
      "The report has just been sent to the board.",
      "Everything had been prepared before the guests arrived.",
      "Phủ định: haven’t been + V3 — chưa được làm.",
      "Dấu hiệu: just, already, yet, by the time.",
    ],
    examples: [
      { en: "The report has just been sent to the board.", vi: "Báo cáo vừa được gửi lên ban giám đốc." },
      { en: "Everything had been prepared before the guests arrived.", vi: "Mọi thứ đã được chuẩn bị trước khi khách đến." },
      { en: "The windows haven’t been cleaned for weeks.", vi: "Cửa sổ đã mấy tuần chưa được lau." },
    ],
  },

  "b2-passive-objects": {
    intro: [
      "Động từ cho hai tân ngữ (give, send, offer, show, award) có hai cách bị động: nhân hóa người (He was given…) hoặc giữ vật làm chủ ngữ (A book was given to him).",
      "Cách nhân hóa người phổ biến hơn trong văn nói.",
    ],
    points: [
      "She was offered a better position.",
      "The winners were awarded prizes.",
      "Chủ ngữ vật: A reminder was sent to all members.",
      "Chú ý giới từ giữ nguyên: to / for + tân ngữ.",
    ],
    examples: [
      { en: "She was offered a better position.", vi: "Cô ấy được đề nghị một vị trí tốt hơn." },
      { en: "The winners were awarded medals and prizes.", vi: "Những người chiến thắng được trao huy chương và giải thưởng." },
      { en: "A reminder was sent to all members.", vi: "Thông báo nhắc đã được gửi tới tất cả thành viên." },
    ],
  },

  "b2-passive-modal": {
    intro: [
      "Khuyết thiếu + have been + V3 bàn về quá khứ ở dạng bị động: must have been done (chắc hẳn đã được làm), can’t have been done, should have been done (đáng lẽ đã được làm).",
      "Cấu trúc này hay gặp trong báo cáo, đánh giá sự việc.",
    ],
    points: [
      "The parcel must have been delivered this morning.",
      "The email can’t have been read yet.",
      "should have been + V3: đáng lẽ đã được làm.",
      "might / could have been + V3: có thể đã được làm.",
    ],
    examples: [
      { en: "The parcel must have been delivered this morning.", vi: "Bưu kiện hẳn đã được giao sáng nay." },
      { en: "The email can’t have been read yet.", vi: "Chắc chắn email đó chưa được đọc." },
      { en: "The wall should have been painted before the rainy season.", vi: "Bức tường đáng lẽ phải được sơn trước mùa mưa." },
    ],
  },

  "b2-causative-have-get": {
    intro: [
      "have / get + tân ngữ + V3 diễn tả việc nhờ người khác làm (I had my hair cut — tôi đi cắt tóc, không tự cắt).",
      "get thân mật hơn have và còn mang nghĩa gặp chuyện không hay: She had her phone stolen.",
    ],
    points: [
      "I had my car serviced last week.",
      "You should get that tooth checked.",
      "She got her laptop repaired at the mall.",
      "Gặp chuyện xấu: We had our flight cancelled.",
    ],
    examples: [
      { en: "I had my car serviced last week.", vi: "Tuần trước tôi đưa xe đi bảo dưỡng." },
      { en: "You should get that tooth checked.", vi: "Bạn nên đi kiểm tra cái răng đó." },
      { en: "She got her laptop repaired at the mall.", vi: "Cô ấy mang laptop đi sửa ở trung tâm thương mại." },
    ],
  },

  "b2-verb-patterns": {
    intro: [
      "Một nhóm động từ theo sau bằng V-ing: admit, deny, suggest, avoid, keep, mind, risk.",
      "remember / forget / regret + V-ing nói việc đã làm, còn + to V nói việc cần làm hoặc sắp làm — đổi từ là đổi nghĩa.",
    ],
    points: [
      "He denied copying the answers.",
      "She suggested meeting at the library.",
      "I remember locking the door (đã khóa rồi).",
      "Remember to lock the door (nhớ phải khóa).",
    ],
    examples: [
      { en: "He denied copying the answers.", vi: "Anh ta chối là đã chép bài của người khác." },
      { en: "She suggested meeting at the library.", vi: "Cô ấy đề xuất gặp nhau ở thư viện." },
      { en: "I remember locking the door, but it was open.", vi: "Tôi nhớ là đã khóa cửa, vậy mà cửa vẫn mở." },
    ],
  },

  "b2-to-infinitive-advanced": {
    intro: [
      "to V mở rộng: bị động nguyên mẫu (is to be done), hoàn thành (to have + V3) và mục đích (in order to / so as to).",
      "to have + V3 nhìn về quá khứ: bùi ngui hoặc vui vì việc đã xảy ra.",
    ],
    points: [
      "The samples are to be stored in a cool place.",
      "I’m sorry to have kept you waiting.",
      "He left quietly so as not to wake the baby.",
      "in order to / so as to + V = mục đích; phủ định thêm not.",
    ],
    examples: [
      { en: "The samples are to be stored in a cool place.", vi: "Các mẫu phải được bảo quản ở nơi mát." },
      { en: "I’m sorry to have kept you waiting.", vi: "Xin lỗi đã để bạn chờ." },
      { en: "He left quietly so as not to wake the baby.", vi: "Anh ấy ra về lặng lẽ để khỏi đánh thức em bé." },
    ],
  },

  "b2-reporting-verbs": {
    intro: [
      "Động từ tường thuật theo ba mẫu: refuse / offer / promise / agree + to V; admit / deny / suggest + V-ing; warn / advise / remind / tell + tân ngữ + to V.",
      "Một số động từ có giới từ kèm: apologise for + V-ing, insist on + V-ing, accuse sb of + V-ing.",
    ],
    points: [
      "They offered to drive me home.",
      "He warned us not to touch the wire.",
      "She apologised for being late.",
      "invite / persuade / encourage + tân ngữ + to V.",
    ],
    examples: [
      { en: "They offered to drive me home.", vi: "Họ đề nghị chở tôi về nhà." },
      { en: "He warned us not to touch the wire.", vi: "Anh ta cảnh báo bọn tôi đừng chạm vào dây điện." },
      { en: "She apologised for being late.", vi: "Cô ấy xin lỗi vì đến muộn." },
    ],
  },

  "c2-passive-reporting": {
    intro: [
      "Bị động tường thuật đưa tin khách quan, phổ biến trong báo chí: It is said / believed / reported that…",
      "Cách hai: nhân hóa chủ thể — S + is said + to V (hiện tại) hoặc to have + V3 (quá khứ).",
    ],
    points: [
      "It is believed that the painting is over 400 years old.",
      "The minister is said to have resigned.",
      "to V cho cùng thời, to have + V3 cho thời trước.",
      "Thay said bằng thought, expected, rumoured…",
    ],
    examples: [
      { en: "It is believed that the painting is over 400 years old.", vi: "Người ta tin rằng bức tranh đã hơn 400 năm tuổi." },
      { en: "The minister is said to have resigned.", vi: "Được cho là vị bộ trưởng đã từ chức." },
      { en: "It is reported that prices will rise next quarter.", vi: "Có tin giá cả sẽ tăng trong quý tới." },
    ],
  },

  "b2-clauses-whether-so-that": {
    intro: [
      "Mệnh đề mục đích: so that + can / will (văn nói), in order that (trang trọng), in case (phòng khi).",
      "Mệnh đề nhượng bộ: although / even though + mệnh đề; despite / in spite of + danh từ hoặc V-ing — lỗi hay gặp là trộn lẫn hai nhóm này.",
    ],
    points: [
      "I’ll write the time down so that I won’t forget.",
      "Take an umbrella in case it rains.",
      "Although she was tired, she kept working.",
      "Despite being tired, she kept working. (không dùng Despite she was tired)",
    ],
    examples: [
      { en: "I’ll write the time down so that I won’t forget.", vi: "Tôi ghi thời gian lại để khỏi quên." },
      { en: "Take an umbrella in case it rains.", vi: "Mang theo dù phòng khi trời mưa." },
      { en: "Although she was exhausted, she kept working.", vi: "Tuy kiệt sức, cô ấy vẫn làm việc tiếp." },
    ],
  },

  "b2-it-clauses": {
    intro: [
      "It + be + tính từ + that + mệnh đề bình luận cả một sự việc: It’s strange that…, It’s likely that…",
      "Khác cấu trúc It is + tính từ + to V: câu that nêu một mệnh đề, câu to V nhấn hành động.",
    ],
    points: [
      "It’s surprising that nobody noticed the mistake.",
      "It’s likely that the meeting will be postponed.",
      "Tính từ hay dùng: clear, obvious, important, unfortunate.",
      "It is important that everyone arrives on time.",
    ],
    examples: [
      { en: "It’s surprising that nobody noticed the mistake.", vi: "Thật lạ là không ai phát hiện ra lỗi." },
      { en: "It’s likely that the meeting will be postponed.", vi: "Khả năng cao là cuộc họp sẽ bị dời lại." },
      { en: "It is important that everyone arrives on time.", vi: "Quan trọng là mọi người phải đến đúng giờ." },
    ],
  },

  "b2-quasi-negation": {
    intro: [
      "hardly, scarcely, barely mang nghĩa gần như phủ định: hầu như không, gần như không còn.",
      "none of / neither of + đại từ hoặc danh từ phủ định cả nhóm; đừng phủ định đôi (hardly didn’t là sai).",
    ],
    points: [
      "She hardly ever watches TV.",
      "There was hardly any food left.",
      "None of the trains were on time.",
      "hardly + động từ thường ở dạng khẳng định (không thêm not).",
    ],
    examples: [
      { en: "She hardly ever watches TV.", vi: "Cô ấy hầu như không xem tivi." },
      { en: "There was hardly any food left in the fridge.", vi: "Trong tủ lạnh gần như không còn thức ăn." },
      { en: "None of the trains were on time.", vi: "Không chuyến tàu nào đúng giờ." },
    ],
  },

  "b2-modal-progressive-perfect": {
    intro: [
      "Khuyết thiếu kết hợp dạng tiếp diễn: must / might / could + be + V-ing suy đoán việc đang xảy ra.",
      "must / might have been + V-ing suy đoán việc kéo dài trong quá khứ; should be + V-ing trách móc: lẽ ra đang phải làm.",
    ],
    points: [
      "He must be working late — his light is still on.",
      "They might have been waiting for us outside.",
      "You should be revising instead of watching videos.",
      "can’t be + V-ing: chắc là không đang làm.",
    ],
    examples: [
      { en: "He must be working late — his light is still on.", vi: "Chắc anh ấy đang làm thêm trễ — đèn phòng vẫn sáng." },
      { en: "They might have been waiting for us outside.", vi: "Có lẽ họ đã đang chờ chúng ta ở ngoài kia." },
      { en: "You should be revising instead of watching videos.", vi: "Lẽ ra bạn phải đang ôn bài chứ không phải xem video." },
    ],
  },

  "b2-modal-advanced": {
    intro: [
      "dare: dám (dare to V hoặc dare + V), dare sb to V thách ai làm; How dare you…? trách móc mạnh.",
      "needn’t have + V3 nói việc đã làm nhưng hóa ra không cần; wouldn’t nói sự từ chối hoặc từ chối hoạt động trong quá khứ.",
    ],
    points: [
      "How dare you speak to me like that?",
      "We needn’t have booked a table — the cafe was empty.",
      "didn’t need to + V = không cần và (thường) không làm.",
      "The old radio wouldn’t work this morning.",
    ],
    examples: [
      { en: "How dare you speak to me like that?", vi: "Sao bạn dám nói với tôi như thế?" },
      { en: "We needn’t have booked a table — the cafe was empty.", vi: "Lỡ đặt bàn rồi mà quán vắng tanh." },
      { en: "The old radio wouldn’t work this morning.", vi: "Sáng nay chiếc radio cũ không chịu chạy." },
    ],
  },

  "b2-third-conditional": {
    intro: [
      "wish / if only + quá khứ đơn ước điều trái với hiện tại; + had + V3 tiếc điều trái với quá khứ; + would mong người khác thay đổi hành vi.",
      "as if / as though + quá khứ mô tả điều không thực tế: He talks as if he knew everything.",
    ],
    points: [
      "I wish I had more free time.",
      "If only we had booked earlier!",
      "I wish he wouldn’t leave his shoes in the hall.",
      "wish + to V / danh từ thì bình thường: I wish to complain.",
    ],
    examples: [
      { en: "I wish I had more free time.", vi: "Ước gì tôi có nhiều thời gian rảnh hơn." },
      { en: "If only we had booked earlier!", vi: "Giá mà bọn tôi đặt sớm hơn!" },
      { en: "He talks as if he knew everything.", vi: "Anh ta nói chuyện như thể biết hết mọi thứ." },
    ],
  },

  "b1-relative-clauses": {
    intro: [
      "Mệnh đề quan hệ không hạn định thêm thông tin phụ, tách bằng dấu phẩy và không dùng that.",
      "which có thể chỉ toàn bộ câu đứng trước: He arrived late, which annoyed the teacher.",
    ],
    points: [
      "My uncle, who lives in Hue, is a chef.",
      "The bridge, which was built in 1900, is still in use.",
      "Trang trọng dùng whom (tân ngữ) và whose (sở hữu).",
      "Không bỏ đại từ quan hệ trong mệnh đề này.",
    ],
    examples: [
      { en: "My uncle, who lives in Hue, is a chef.", vi: "Chú tôi, người sống ở Huế, là đầu bếp." },
      { en: "The bridge, which was built in 1900, is still in use.", vi: "Cây cầu, được xây năm 1900, vẫn đang được sử dụng." },
      { en: "He arrived late, which annoyed the teacher.", vi: "Cậu ấy đến trễ, điều làm thầy khó chịu." },
    ],
  },

  "b2-relative-which-prep": {
    intro: [
      "Giới từ trong mệnh đề quan hệ: văn viết đặt giới từ trước đại từ — the person to whom…, the house in which…",
      "Văn nói giữ giới từ cuối câu và có thể bỏ đại từ: the person (who / that) I spoke to.",
    ],
    points: [
      "That’s the colleague with whom I share an office.",
      "The hotel in which we stayed was overbooked.",
      "Giới từ trước → buộc dùng whom / which, không dùng that, who.",
      "Văn nói: the hotel (that) we stayed in.",
    ],
    examples: [
      { en: "That’s the colleague with whom I share an office.", vi: "Kia là đồng nghiệp dùng chung phòng làm việc với tôi." },
      { en: "The hotel in which we stayed was overbooked.", vi: "Khách sạn mà bọn tôi ở đã bị đặt vượt công suất." },
      { en: "She’s the friend I told you about.", vi: "Cô ấy là người bạn mà tôi đã kể với bạn." },
    ],
  },

  "b2-relative-genitive-ever": {
    intro: [
      "Nhóm từ -ever vừa làm đại từ vừa mang nghĩa bất kể: whoever (ai cũng…), whatever (bất cứ cái gì), wherever, whenever, however.",
      "however + tính từ / trạng từ: However hard I try… (dù cố mấy…).",
    ],
    points: [
      "Whoever finishes first gets a prize.",
      "Take whatever you need from the fridge.",
      "Sit wherever you like.",
      "However hard I try, the answer doesn’t come.",
    ],
    examples: [
      { en: "Whoever finishes first gets a prize.", vi: "Ai xong trước sẽ nhận phần thưởng." },
      { en: "Take whatever you need from the fridge.", vi: "Cứ lấy trong tủ lạnh thứ gì bạn cần." },
      { en: "However hard I try, the answer doesn’t come.", vi: "Dù cố mấy cũng chẳng nghĩ ra câu trả lời." },
    ],
  },

  "c2-clauses-exclamations": {
    intro: [
      "Mệnh đề danh ngữ làm chủ ngữ, tân ngữ hoặc bổ ngữ: What he said surprised everyone.",
      "Mệnh đề cảm thán ghép vào câu giữ trật tự khẳng định: I can’t believe how fast he runs.",
    ],
    points: [
      "Chủ ngữ: Whether we go depends on the budget.",
      "Bổ ngữ: The problem is that we lack data.",
      "Tân ngữ: I don’t know why she left so early.",
      "Trang trọng: That he lied surprised us all.",
    ],
    examples: [
      { en: "What he said surprised everyone.", vi: "Những gì anh ta nói làm mọi người ngạc nhiên." },
      { en: "Whether we go depends on the budget.", vi: "Đi hay không là tùy ngân sách." },
      { en: "I can’t believe how fast he runs.", vi: "Tôi không thể tin nổi cậu ấy chạy nhanh thế." },
    ],
  },

  "b2-subject-verb-agreement": {
    intro: [
      "Động từ chia theo chủ ngữ thật, không theo danh từ đứng gần nhất: The quality of these shirts is excellent.",
      "Một số danh từ hình như số nhiều nhưng chia số ít: news, maths, physics.",
    ],
    points: [
      "The list of items is on the desk.",
      "Neither of the answers is correct.",
      "A number of + danh từ → số nhiều; the number of → số ít.",
      "Danh từ tập thể (team, family): số ít hoặc số nhiều tùy Anh-Mỹ và ngữ cảnh.",
    ],
    examples: [
      { en: "The quality of these shirts is excellent.", vi: "Chất lượng mấy chiếc áo này rất tốt." },
      { en: "Neither of the answers is correct.", vi: "Không câu trả lời nào đúng." },
      { en: "A number of students were absent today.", vi: "Hôm nay một số học viên vắng mặt." },
    ],
  },

  "b2-comparatives-advanced": {
    intro: [
      "So sánh kém dùng less … than và the least: This model is less expensive than that one.",
      "Cấu trúc càng… càng…: the + so sánh hơn + mệnh đề, the + so sánh hơn + mệnh đề.",
    ],
    points: [
      "This model is less expensive than that one.",
      "The earlier you book, the cheaper the ticket is.",
      "Nhấn mạnh: far, considerably, a great deal + so sánh hơn.",
      "The more, the merrier. — mẫu cố định bỏ động từ.",
    ],
    examples: [
      { en: "This model is less expensive than that one.", vi: "Mẫu này ít đắt hơn mẫu kia." },
      { en: "The earlier you book, the cheaper the ticket is.", vi: "Bạn đặt càng sớm thì vé càng rẻ." },
      { en: "The problem is far more serious than we thought.", vi: "Vấn đề nghiêm trọng hơn chúng ta nghĩ rất nhiều." },
    ],
  },

  "b2-degree-enough-such": {
    intro: [
      "enough đứng sau tính từ / trạng từ (old enough) nhưng trước danh từ (enough chairs).",
      "such + (a/an) + tính từ + danh từ nhấn mức độ; so + tính từ / trạng từ. such có danh từ, so không.",
    ],
    points: [
      "She isn’t old enough to drive alone.",
      "We haven’t got enough chairs for everyone.",
      "It was such a boring film that we left early.",
      "so + adj: The film was so boring (that) we left.",
    ],
    examples: [
      { en: "She isn’t old enough to drive alone.", vi: "Cô ấy chưa đủ tuổi tự lái xe." },
      { en: "It was such a boring film that we left early.", vi: "Bộ phim chán đến mức bọn tôi bỏ về sớm." },
      { en: "We haven’t got enough chairs for everyone.", vi: "Mình không đủ ghế cho mọi người." },
    ],
  },

  "b2-adjectives-special": {
    intro: [
      "Một số từ đuôi -ly là tính từ chứ không phải trạng từ: friendly, lovely, lonely, silly, likely.",
      "the + tính từ chỉ cả một nhóm người: the rich, the poor, the elderly — đi với động từ số nhiều.",
    ],
    points: [
      "My brother is very easy-going.",
      "The government should do more for the poor.",
      "Tính từ chỉ đứng sau động từ: afraid, asleep, awake, alone.",
      "The children were wide awake at midnight.",
    ],
    examples: [
      { en: "The government should do more for the poor.", vi: "Chính phủ nên làm nhiều hơn cho người nghèo." },
      { en: "My brother is very easy-going.", vi: "Anh trai tôi rất dễ tính." },
      { en: "The children were wide awake at midnight.", vi: "Lúc nửa đêm bọn trẻ tỉnh táo lắm." },
    ],
  },

  /* ------------------------------- C1 ------------------------------- */

  "c1-modality-possibility": {
    intro: [
      "may, might, could xếp khả năng theo dải: may (khả năng thực), might / could (mỏng hơn); may well / could well = rất có thể.",
      "might not = có thể không; could not (về khả năng) = chắc chắn không thể — hai nghĩa này phải phân biệt.",
    ],
    points: [
      "The delay could well be caused by the weather.",
      "She might not have received the invitation.",
      "That explanation can’t be right. — phủ định chắc chắn.",
      "may / might have + V3: khả năng trong quá khứ.",
    ],
    examples: [
      { en: "The delay could well be caused by the weather.", vi: "Sự chậm trễ rất có thể là do thời tiết." },
      { en: "She might not have received the invitation.", vi: "Có thể cô ấy chưa nhận được thư mời." },
      { en: "That explanation can’t be right.", vi: "Lời giải thích đó không thể đúng." },
    ],
  },

  "c1-modality-obligation": {
    intro: [
      "ought to trang trọng hơn should; ought to have + V3 chỉ điều đáng lẽ đã làm trong quá khứ.",
      "needn’t have + V3 = đã làm nhưng hóa ra không cần; didn’t need to + V = không cần nên (thường) không làm. Trong văn bản pháp lý, shall mang nghĩa bắt buộc.",
    ],
    points: [
      "The tenant ought to give two months’ notice.",
      "We needn’t have ordered more paper — the delivery had arrived.",
      "I didn’t need to hurry, so I walked slowly.",
      "The supplier shall deliver the goods by the 10th.",
    ],
    examples: [
      { en: "The tenant ought to give two months’ notice.", vi: "Người thuê nhà nên báo trước hai tháng." },
      { en: "We needn’t have ordered more paper — the delivery had arrived.", vi: "Lỡ gọi thêm giấy, vậy mà lô hàng đã tới rồi." },
      { en: "The supplier shall deliver the goods by the 10th.", vi: "Nhà cung cấp phải giao hàng trước ngày mười." },
    ],
  },

  "c1-modality-ability-emphasis": {
    intro: [
      "can / could ngoài khả năng còn mang nghĩa đôi khi có thể: Winters here can be quite mild.",
      "will / would nhấn thói quen khó bỏ hoặc sự từ chối: He will keep interrupting; The door wouldn’t open.",
    ],
    points: [
      "Winters here can be quite mild.",
      "He will keep leaving the door open. — cứ hoài.",
      "The door wouldn’t open, however hard I pushed.",
      "would luôn nhấn sắc thái khó chịu hoặc ái ngại.",
    ],
    examples: [
      { en: "Winters here can be quite mild.", vi: "Mùa đông ở đây có khi khá ôn hòa." },
      { en: "He will keep leaving the door open.", vi: "Nó cứ để cửa mở hoài." },
      { en: "The door wouldn’t open, however hard I pushed.", vi: "Cửa không chịu mở, dù tôi đẩy mạnh thế nào." },
    ],
  },

  "c1-hedging-modals": {
    intro: [
      "Hedging là nói giảm để nhận định thận trọng — kỹ năng bắt buộc trong văn học thuật: may / might / could, appear to, seem to, tend to.",
      "Tránh khẳng định tuyệt đối; dùng would seem / would appear để kéo khoảng cách.",
    ],
    points: [
      "The results suggest that demand may be slowing.",
      "Prices appear to have stabilised.",
      "This approach would seem to be more reliable.",
      "tend to + V: có xu hướng (tránh nói tất cả đều).",
    ],
    examples: [
      { en: "The results suggest that demand may be slowing.", vi: "Kết quả cho thấy nhu cầu có thể đang chậm lại." },
      { en: "Prices appear to have stabilised.", vi: "Giá cả có vẻ đã ổn định." },
      { en: "This approach would seem to be more reliable.", vi: "Cách tiếp cận này có vẻ đáng tin cậy hơn." },
    ],
  },

  "c1-negation-advanced": {
    intro: [
      "Phủ định nâng cao dùng các cấu trúc gián tiếp: fail to (không đạt được), fall short of (không đạt tới), by no means (chẳng hề), not a single (chẳng một cái nào).",
      "Trạng từ phủ định đầu câu kéo theo đảo ngữ: Hardly had the show begun when…",
    ],
    points: [
      "Hardly had the show begun when the power failed.",
      "The plan is by no means perfect.",
      "Not a single complaint has been filed.",
      "Tránh phủ định đôi trong văn chuẩn (hardly… not là sai).",
    ],
    examples: [
      { en: "Hardly had the show begun when the power failed.", vi: "Chương trình vừa bắt đầu thì cúp điện." },
      { en: "The plan is by no means perfect.", vi: "Kế hoạch này chẳng hề hoàn hảo." },
      { en: "Not a single complaint has been filed.", vi: "Chưa có một lời phàn nàn nào được ghi nhận." },
    ],
  },

  "c1-inversion": {
    intro: [
      "Đặt từ phủ định / hạn chế lên đầu câu buộc đảo trợ động từ: Never have I…, Rarely do we…, Not only did she…",
      "Cặp cố định: No sooner… than và Hardly… when, đều đảo had lên đầu.",
    ],
    points: [
      "Never have I seen such a performance.",
      "Not only did he apologise, but he also offered compensation.",
      "No sooner had we arrived than the storm hit.",
      "Seldom / Little / At no time cũng kích hoạt đảo ngữ.",
    ],
    examples: [
      { en: "Never have I seen such a performance.", vi: "Chưa bao giờ tôi xem một màn trình diễn như thế." },
      { en: "Not only did he apologise, but he also offered compensation.", vi: "Anh ta không chỉ xin lỗi mà còn đề nghị bồi thường." },
      { en: "No sooner had we arrived than the storm hit.", vi: "Vừa tới nơi thì cơn bão đổ bộ." },
    ],
  },

  "c1-cleft-sentences": {
    intro: [
      "Câu chẻ tách thông tin cần nhấn: It + be + phần nhấn mạnh + that / who…",
      "What-cleft nhấn tân ngữ hoặc hành động: What I need is…, What surprised me was…",
    ],
    points: [
      "It was the manager who made the final decision.",
      "What I need is a quiet week at home.",
      "What surprised me was the bill.",
      "Câu chẻ thường trả lời câu hỏiWho/What exactly?",
    ],
    examples: [
      { en: "It was the manager who made the final decision.", vi: "Chính quản lý là người đưa ra quyết định cuối cùng." },
      { en: "What I need is a quiet week at home.", vi: "Điều tôi cần là một tuần yên tĩnh ở nhà." },
      { en: "What surprised me was the bill.", vi: "Điều khiến tôi ngạc nhiên là hóa đơn." },
    ],
  },

  "c1-conditionals-advanced": {
    intro: [
      "Điều kiện hỗn hợp trộn thời gian: If + had + V3 (quá khứ) … would + V (kết quả hiện tại).",
      "Đảo if trong trang trọng: Were I…, Had we…, Should you…; but for + danh từ = nếu không có.",
    ],
    points: [
      "If I had taken that job, I would be living abroad now.",
      "Should you need help, do call us.",
      "Had we known, we would have acted differently.",
      "But for your support, we would have failed.",
    ],
    examples: [
      { en: "If I had taken that job, I would be living abroad now.", vi: "Nếu hôm đó nhận việc đó, giờ này tôi đang sống ở nước ngoài." },
      { en: "Should you need help, do call us.", vi: "Nếu bạn cần giúp đỡ, cứ gọi cho chúng tôi." },
      { en: "But for your support, we would have failed.", vi: "Nếu không có bạn ủng hộ, bọn tôi đã thất bại rồi." },
    ],
  },

  "c1-clauses-subordinated": {
    intro: [
      "Rút gọn mệnh đề trạng ngữ khi hai mệnh đề cùng chủ ngữ: While waiting…, Having finished…",
      "V-ing cho nghĩa chủ động, V3 cho nghĩa bị động; to V mở đầu nhấn mục đích.",
    ],
    points: [
      "While waiting for the bus, I read a chapter.",
      "Having completed the form, she handed it in.",
      "Although exhausted, the team kept going. (= Although they were exhausted)",
      "To reduce costs, the company relocated. — mục đích.",
    ],
    examples: [
      { en: "While waiting for the bus, I read a chapter.", vi: "Trong lúc chờ xe buýt, tôi đọc một chương sách." },
      { en: "Having completed the form, she handed it in.", vi: "Điền xong mẫu đơn, cô ấy nộp lại." },
      { en: "Although exhausted, the team kept going.", vi: "Dù kiệt sức, cả đội vẫn tiếp tục." },
    ],
  },

  "c1-noun-phrases": {
    intro: [
      "Danh hoá (nominalisation) biến động từ / tính từ thành danh từ giúp văn viết gọn và trang trọng: decide → decision, implement → implementation.",
      "Cụm danh từ phức xếp tầng bổ nghĩa: a recently published study on sleep.",
    ],
    points: [
      "The implementation of the policy was delayed.",
      "Their refusal to cooperate surprised us.",
      "A recently published study links sleep to memory.",
      "Tính từ đứng trước, cụm giới từ / V-ing đứng sau danh từ chính.",
    ],
    examples: [
      { en: "The implementation of the policy was delayed.", vi: "Việc triển khai chính sách đã bị hoãn lại." },
      { en: "Their refusal to cooperate surprised us.", vi: "Việc họ từ chối hợp tác khiến chúng tôi ngạc nhiên." },
      { en: "A recently published study links sleep to memory.", vi: "Một nghiên cứu mới công bố nối giấc ngủ với trí nhớ." },
    ],
  },

  "c1-present-advanced": {
    intro: [
      "Trong văn học thuật, hiện tại đơn trình bày kết luận và nội dung bảng biểu: The data show…, Table 2 presents…",
      "Hiện tại hoàn thành giới thiệu các nghiên cứu đã có: Studies have shown…",
    ],
    points: [
      "The data show a clear upward trend.",
      "Previous studies have linked sleep to memory.",
      "Table 2 presents the survey results.",
      "Quá khứ đơn chỉ dùng khi kể lịch sử nghiên cứu cụ thể.",
    ],
    examples: [
      { en: "The data show a clear upward trend.", vi: "Dữ liệu cho thấy xu hướng tăng rõ rệt." },
      { en: "Previous studies have linked sleep to memory.", vi: "Các nghiên cứu trước đây đã nối giấc ngủ với trí nhớ." },
      { en: "Table 2 presents the survey results.", vi: "Bảng hai trình bày kết quả khảo sát." },
    ],
  },

  "c1-adverbs-stance": {
    intro: [
      "Trạng từ lập trường bình luận cả câu: clearly, arguably, admittedly, ironically, understandably.",
      "Vị trí quen thuộc là đầu câu, theo sau bằng dấu phẩy; cũng đặt giữa câu để nhấn.",
    ],
    points: [
      "Arguably, this is the team’s best season.",
      "Admittedly, the sample size is small.",
      "Ironically, the safety feature caused the accident.",
      "clearly / obviously chắc chắn; arguably để mở tranh luận.",
    ],
    examples: [
      { en: "Arguably, this is the team’s best season.", vi: "Có thể nói đây là mùa giải hay nhất của đội." },
      { en: "Admittedly, the sample size is small.", vi: "Phải thừa nhận là mẫu khảo sát còn nhỏ." },
      { en: "Ironically, the safety feature caused the accident.", vi: "Trớ trêu thay, chính tính năng an toàn lại gây ra tai nạn." },
    ],
  },

  "c1-imperatives-advanced": {
    intro: [
      "Mệnh lệnh trong văn viết mang tính hướng dẫn, khuyến nghị: Consider the following example.",
      "Do + mệnh lệnh thêm nhấn lịch sự (Do come in); mệnh lệnh + and / or nối điều kiện - kết quả.",
    ],
    points: [
      "Consider the impact on local businesses.",
      "Do join us for lunch.",
      "Follow the steps, and the setup will finish in minutes.",
      "Miss the deadline, or you will lose the deposit.",
    ],
    examples: [
      { en: "Consider the impact on local businesses.", vi: "Hãy cân nhắc tác động tới doanh nghiệp địa phương." },
      { en: "Do join us for lunch.", vi: "Mời bạn dùng bữa trưa cùng chúng tôi." },
      { en: "Follow the steps, and the setup will finish in minutes.", vi: "Làm theo các bước, phần cài đặt sẽ xong trong vài phút." },
    ],
  },

  "c1-pronouns-quantity": {
    intro: [
      "Trong văn viết trang trọng, lượng thường diễn qua đại từ cụm: many of / much of / several of / none of + the, these, this…",
      "Nhóm học thuật: a substantial proportion of, a significant number of, little of.",
    ],
    points: [
      "Many of the respondents were unsure.",
      "A substantial proportion of the budget goes to training.",
      "Little of the evidence supports that claim.",
      "several of / one of / both of + đại từ: several of them.",
    ],
    examples: [
      { en: "Many of the respondents were unsure.", vi: "Nhiều người tham gia trả lời còn chưa chắc chắn." },
      { en: "A substantial proportion of the budget goes to training.", vi: "Một tỷ trọng lớn ngân sách dành cho đào tạo." },
      { en: "Little of the evidence supports that claim.", vi: "Hầu như không có bằng chứng nào ủng hộ nhận định đó." },
    ],
  },

  "c1-pronouns-other": {
    intro: [
      "Cặp thay thế trang trọng: the former (cái trước) / the latter (cái sau) thay cho việc lặp danh từ.",
      "those + who… chỉ nhóm người xác định bằng mệnh đề: those who register early; such dùng để trỏ lại nhóm vừa nêu.",
    ],
    points: [
      "Tea and coffee: the former is cheaper.",
      "Of the two options, I prefer the latter.",
      "Those who register early receive a discount.",
      "such + danh từ: such complaints, such practices.",
    ],
    examples: [
      { en: "Tea and coffee: the former is cheaper.", vi: "Trà và cà phê: cái trước rẻ hơn." },
      { en: "Those who register early receive a discount.", vi: "Những ai đăng ký sớm được giảm giá." },
      { en: "The report criticises pollution; such complaints are common.", vi: "Báo cáo chỉ trích ô nhiễm; những phàn nàn như thế rất phổ biến." },
    ],
  },

  "c1-adverb-phrases": {
    intro: [
      "Cụm trạng từ = trạng từ + thành phần mở rộng, bổ nghĩa độ chính xác cao: three weeks later, surprisingly quickly, in most cases.",
      "Trong văn học thuật, cụm trạng từ giới hạn phạm vi khẳng định — cách nói thận trọng.",
    ],
    points: [
      "The project finished three weeks ahead of schedule.",
      "In most cases, the symptoms disappear within a week.",
      "She answered surprisingly confidently.",
      "Đầu câu để khung cảnh, cuối câu để nhấn chi tiết.",
    ],
    examples: [
      { en: "The project finished three weeks ahead of schedule.", vi: "Dự án hoàn thành sớm hơn kế hoạch ba tuần." },
      { en: "In most cases, the symptoms disappear within a week.", vi: "Đa số các ca, triệu chứng mất trong vòng một tuần." },
      { en: "She answered surprisingly confidently.", vi: "Cô ấy trả lời tự tin đến mức bất ngờ." },
    ],
  },

  "c1-verb-patterns": {
    intro: [
      "Cụm động từ ba thành phần (động từ + trạng từ + giới từ) mang nghĩa thành ngữ: put up with, look forward to, get away with, come up with.",
      "Theo sau thường là danh từ hoặc V-ing; văn trang trọng thay bằng động từ đơn: tolerate, anticipate, devise.",
    ],
    points: [
      "I can’t put up with the noise any longer.",
      "We look forward to hearing from you.",
      "He got away with paying no fine.",
      "Trang trọng: We anticipate receiving your reply.",
    ],
    examples: [
      { en: "I can’t put up with the noise any longer.", vi: "Tôi không chịu nổi tiếng ồn thêm phút nào nữa." },
      { en: "We look forward to hearing from you.", vi: "Chúng tôi mong nhận được hồi âm của bạn." },
      { en: "He got away with paying no fine.", vi: "Anh ta thoát thân mà không phải nộp phạt." },
    ],
  },

  "c1-past-perfect-advanced": {
    intro: [
      "Trong văn kể, quá khứ hoàn thành tạo giật lùi: đặt nền hoặc mở bí mật trước tuyến thời gian chính.",
      "had been + V-ing nhấn hành động kéo dài trước mốc kể.",
    ],
    points: [
      "The thief had already fled by the time the police arrived.",
      "She had been rehearsing for months before the premiere.",
      "Everything had changed when I returned.",
      "Sau phần giật lùi, quay lại quá khứ đơn để chạy tiếp cốt truyện.",
    ],
    examples: [
      { en: "The thief had already fled by the time the police arrived.", vi: "Khi cảnh sát tới thì tên trộm đã bỏ chạy từ trước." },
      { en: "She had been rehearsing for months before the premiere.", vi: "Cô ấy đã diễn tập hàng tháng trời trước đêm công diễn." },
      { en: "Everything had changed when I returned.", vi: "Khi tôi quay trở lại thì mọi thứ đã đổi khác." },
    ],
  },

  "c1-future-perfect": {
    intro: [
      "Ngoài nghĩa hoàn tất, tương lai hoàn thành còn suy đoán lịch sự về việc chắc chắn đã xảy ra: You will have heard…",
      "will have been + V-ing đoán khoảng thời gian đã kéo đến mốc đó.",
    ],
    points: [
      "You will have heard by now that the office is moving.",
      "They will have completed the audit by Friday.",
      "By next month, we will have been collaborating for a decade.",
      "Cấu trúc này gặp nhiều trong thư từ, thông báo.",
    ],
    examples: [
      { en: "You will have heard by now that the office is moving.", vi: "Đến giờ này chắc bạn đã biết văn phòng sẽ chuyển." },
      { en: "They will have completed the audit by Friday.", vi: "Họ sẽ hoàn tất cuộc kiểm toán trước thứ Sáu." },
      { en: "By next month, we will have been collaborating for a decade.", vi: "Đến tháng sau, chúng ta hợp tác tròn mười năm." },
    ],
  },

  "c1-passive-modal": {
    intro: [
      "Bị động dạng không chia: being + V3 (Being asked…), having been + V3 (Having been warned…) mở đầu cụm trạng ngữ.",
      "Sau giới từ dùng being + V3: without being told; cụm to V bị động là to be + V3.",
    ],
    points: [
      "Having been delayed twice, the flight was finally cancelled.",
      "He left without being noticed.",
      "The equipment needs to be calibrated regularly.",
      "having been + V3 = đã bị / được làm trước hành động chính.",
    ],
    examples: [
      { en: "Having been delayed twice, the flight was finally cancelled.", vi: "Bị hoãn hai lần, chuyến bay cuối cùng bị hủy." },
      { en: "He left without being noticed.", vi: "Anh ấy rời đi mà không ai để ý." },
      { en: "The equipment needs to be calibrated regularly.", vi: "Thiết bị cần được hiệu chuẩn thường xuyên." },
    ],
  },

  "c1-future-alternatives": {
    intro: [
      "Cách nói tương lai trang trọng: be to + V (kế hoạch chính thức, mệnh lệnh), be due to + V (theo lịch trình), be on the point of + V-ing (sắp sửa).",
      "Trong văn bản, shall mang nghĩa nghĩa vụ chứ không phải dự đoán.",
    ],
    points: [
      "The committee is to release its findings next week.",
      "The train is due to arrive at platform two.",
      "The contract states that notice shall be given in writing.",
      "be on the point of leaving = vừa sắp ra đi.",
    ],
    examples: [
      { en: "The committee is to release its findings next week.", vi: "Ủy ban sẽ công bố kết quả vào tuần tới." },
      { en: "The train is due to arrive at platform two.", vi: "Chuyến tàu theo lịch sẽ đến sân số hai." },
      { en: "The contract states that notice shall be given in writing.", vi: "Hợp đồng quy định việc báo trước phải bằng văn bản." },
    ],
  },

  "c1-subjunctive": {
    intro: [
      "Giả định thức (subjunctive): sau các động từ yêu cầu - khuyến nghị (suggest, recommend, demand, insist, request), mệnh đề that dùng động từ nguyên mẫu cho mọi ngôi.",
      "Cấu trúc hình thức: It is essential / vital / important that + S + V nguyên mẫu; phủ định là not + V.",
    ],
    points: [
      "The board recommended that the plan be revised.",
      "It is essential that every member sign the form.",
      "She insisted that he not leave early.",
      "Văn nói thường thay bằng should: …that the plan should be revised.",
    ],
    examples: [
      { en: "The board recommended that the plan be revised.", vi: "Hội đồng quản trị đề nghị kế hoạch được sửa lại." },
      { en: "It is essential that every member sign the form.", vi: "Cần thiết là mọi thành viên đều ký vào biểu mẫu." },
      { en: "She insisted that he not leave early.", vi: "Cô ấy nhất định là anh ấy không được về sớm." },
    ],
  },

  "c1-questions-advanced": {
    intro: [
      "Câu hỏi trong lập luận không nhằm lấy thông tin mà dẫn dắt người đọc: câu hỏi tu từ, hỏi rồi tự trả lời.",
      "Câu hỏi giả định mở vấn đề: How can we explain…?; What, then, should be done first?",
    ],
    points: [
      "How can we ignore such clear evidence?",
      "Why do so many learners give up? The answer is motivation.",
      "What, then, should be done first?",
      "Câu hỏi tu từ giữ dấu chấm hỏi nhưng không cần trả lời.",
    ],
    examples: [
      { en: "How can we ignore such clear evidence?", vi: "Làm sao có thể lờ đi bằng chứng rõ ràng như thế?" },
      { en: "Why do so many learners give up? The answer is motivation.", vi: "Vì sao nhiều người học bỏ cuộc? Câu trả lời nằm ở động lực." },
      { en: "What, then, should be done first?", vi: "Vậy điều gì nên được làm trước tiên?" },
    ],
  },

  "c1-comparative-adjectives": {
    intro: [
      "So sánh nâng cao dùng tỷ lệ và lượng: twice as … as, three times more … than, half as … as.",
      "Các biến thể: no more than (chỉ đúng mức), not nearly as … as (không gần bằng), the more… the more… trong lập luận.",
    ],
    points: [
      "The new engine is twice as efficient as the old one.",
      "It’s not nearly as difficult as I expected.",
      "The more we analyse, the clearer the pattern becomes.",
      "as … as cũng nối trạng từ: She runs as fast as her brother.",
    ],
    examples: [
      { en: "The new engine is twice as efficient as the old one.", vi: "Động cơ mới hiệu quả gấp đôi cái cũ." },
      { en: "It’s not nearly as difficult as I expected.", vi: "Nó không khó đến thế như tôi tưởng." },
      { en: "The more we analyse, the clearer the pattern becomes.", vi: "Phân tích càng sâu, quy luật càng hiện rõ." },
    ],
  },

  /* ------------------------------- C2 ------------------------------- */

  "c2-conditionals-formal": {
    intro: [
      "Cách nói điều kiện trang trọng: Were it not for / Had it not been for + danh từ (nếu không có), but for, suppose / supposing that.",
      "Trong hợp đồng, quy trình dùng provided (that), on condition that = miễn là.",
    ],
    points: [
      "Had it not been for the delay, the launch would have succeeded.",
      "But for the funding cut, the project would continue.",
      "You may proceed provided that you follow the protocol.",
      "Suppose the data were incomplete — what then?",
    ],
    examples: [
      { en: "Had it not been for the delay, the launch would have succeeded.", vi: "Nếu không vì vụ chậm trễ, buổi ra mắt đã thành công." },
      { en: "You may proceed provided that you follow the protocol.", vi: "Bạn có thể tiếp tục, miễn là tuân thủ đúng quy trình." },
      { en: "Suppose the data were incomplete — what then?", vi: "Giả sử dữ liệu chưa đủ — lúc đó sao?" },
    ],
  },

  "c2-absolute-clauses": {
    intro: [
      "Cấu trúc tuyệt đối (absolute clause) có chủ ngữ riêng, tách khỏi câu chính, không liên từ: Weather permitting…, All things considered…",
      "Chủ ngữ + V-ing (chủ động) hoặc V3 (bị động); dùng để mô tả bối cảnh trong văn viết.",
    ],
    points: [
      "Weather permitting, the ceremony will be held outdoors.",
      "All things considered, the outcome is acceptable.",
      "Her voice trembling, she read the verdict.",
      "The work done, we headed home.",
    ],
    examples: [
      { en: "Weather permitting, the ceremony will be held outdoors.", vi: "Nếu thời tiết thuận lợi, lễ sẽ được tổ chức ngoài trời." },
      { en: "All things considered, the outcome is acceptable.", vi: "Tính hết mọi yếu tố, kết quả là chấp nhận được." },
      { en: "Her voice trembling, she read the verdict.", vi: "Giọng run run, cô ấy đọc bản án." },
    ],
  },

  "c2-fronting-ellipsis": {
    intro: [
      "Fronting đưa thành phần ít khi đứng đầu (bổ ngữ, trạng ngữ) lên trước để nhấn, thường kéo theo đảo ngữ: Such was the demand that…",
      "Ellipsis lược thành phần đã rõ khỏi câu sau, giúp văn viết gọn.",
    ],
    points: [
      "Such was the demand that tickets sold out in minutes.",
      "Barely a week goes by without a new report.",
      "She will present first, and her colleague will, too.",
      "Fronting thường gặp với negative / restrictive adverbs.",
    ],
    examples: [
      { en: "Such was the demand that tickets sold out in minutes.", vi: "Nhu cầu cao đến mức vé bán hết chỉ trong vài phút." },
      { en: "Barely a week goes by without a new report.", vi: "Chẳng tới một tuần lại có một báo cáo mới." },
      { en: "She will present first, and her colleague will, too.", vi: "Cô ấy sẽ thuyết trình đầu tiên, đồng nghiệp của cô ấy cũng vậy." },
    ],
  },

  "c2-negation-advanced": {
    intro: [
      "Phủ định trang trọng dùng nor + đảo ngữ để nối, và not a / not one để nhấn mức không.",
      "Cụm định lượng phủ định đầu câu buộc đảo ngữ: Under no circumstances should…, At no point did…",
    ],
    points: [
      "She didn’t apply, nor did she ask for an extension.",
      "Under no circumstances should the password be shared.",
      "Not a single error was found in the audit.",
      "nor nối với mệnh đề phủ định trước đó bằng dấu phẩy hoặc chấm phẩy.",
    ],
    examples: [
      { en: "She didn’t apply, nor did she ask for an extension.", vi: "Cô ấy không nộp đơn, cũng không xin gia hạn." },
      { en: "Under no circumstances should the password be shared.", vi: "Trong hoàn cảnh nào cũng tuyệt đối không được chia sẻ mật khẩu." },
      { en: "Not a single error was found in the audit.", vi: "Cuộc kiểm toán không tìm thấy một lỗi nào." },
    ],
  },

  "c2-modality-deduction": {
    intro: [
      "Suy đoán nâng cao về quá khứ: must have + V3 (chắc hẳn), couldn’t have + V3 (không thể, vì điều kiện không cho phép), would have + V3 (trong giả định).",
      "Câu hỏi dùng could: Could the leak have started in the basement?",
    ],
    points: [
      "The engineers must have tested the valve before shipping.",
      "She couldn’t have known the code — it changed yesterday.",
      "Could the leak have started in the basement?",
      "should have + V3 trong suy đoán: đáng lẽ (theo dự kiến) đã…",
    ],
    examples: [
      { en: "The engineers must have tested the valve before shipping.", vi: "Hẳn các kỹ sư đã thử van trước khi xuất xưởng." },
      { en: "She couldn’t have known the code — it changed yesterday.", vi: "Cô ấy không thể biết mã — hôm qua mã mới đổi." },
      { en: "Could the leak have started in the basement?", vi: "Rò rỉ có thể bắt đầu từ tầng hầm không?" },
    ],
  },

  "c2-modality-obligation": {
    intro: [
      "Các dạng hiếm của nghĩa vụ: need + V-ing = need to be done (The report needs checking); ought to have + V3 (đáng lẽ); be bound to (chắc chắn sẽ).",
      "have got to thuộc văn nói; be to mang nghĩa quy định.",
    ],
    points: [
      "The invoice needs correcting before payment.",
      "They ought to have consulted the legal team.",
      "We are bound to see more such regulations.",
      "need + V-ing chỉ dùng cho nghĩa bị động.",
    ],
    examples: [
      { en: "The invoice needs correcting before payment.", vi: "Hóa đơn cần được sửa lại trước khi thanh toán." },
      { en: "They ought to have consulted the legal team.", vi: "Đáng lẽ họ phải hỏi ý kiến nhóm pháp lý." },
      { en: "We are bound to see more such regulations.", vi: "Chắc chắn chúng ta sẽ thấy thêm những quy định kiểu này." },
    ],
  },

  "c2-modality-stance": {
    intro: [
      "Khuyết thiếu thể hiện lập trường: might have + V3 trách móc lịch sự (You might have told me), should / would như phép lịch sự của nhận định.",
      "will / won’t khẳng định lập trường cứng: He won’t accept any compromise.",
    ],
    points: [
      "You might have warned us about the change.",
      "I should imagine the deadline will be extended.",
      "He won’t accept any compromise on quality.",
      "should imagine / would think = cách nói giảm của tôi nghĩ.",
    ],
    examples: [
      { en: "You might have warned us about the change.", vi: "Lẽ ra bạn phải báo trước cho bọn tôi về thay đổi đó chứ." },
      { en: "I should imagine the deadline will be extended.", vi: "Tôi đoán hạn chót sẽ được gia hạn." },
      { en: "He won’t accept any compromise on quality.", vi: "Anh ấy không chấp nhận thỏa hiệp nào về chất lượng." },
    ],
  },

  "c2-determiners-demonstratives": {
    intro: [
      "Trong mạch văn, this / that + danh từ trừu tượng gói nội dung câu trước: this decision, that remark.",
      "this mở thông tin mới, that quay về cái đã nhắc; such thay lặp; the former / the latter sắp cặp.",
    ],
    points: [
      "The deadline was moved up. This change surprised the team.",
      "He called the plan risky. That remark stung.",
      "Two proposals emerged: the latter won majority support.",
      "such + danh từ: such a move, such claims.",
    ],
    examples: [
      { en: "The deadline was moved up. This change surprised the team.", vi: "Hạn chót bị đẩy lên sớm. Thay đổi này khiến cả nhóm bất ngờ." },
      { en: "He called the plan risky. That remark stung.", vi: "Anh ta bảo kế hoạch rủi ro. Lời nói đó thật xát." },
      { en: "Two proposals emerged: the latter won majority support.", vi: "Hai phương án xuất hiện: phương án sau chiếm đa số ủng hộ." },
    ],
  },

  "c2-information-structure": {
    intro: [
      "Mạch thông tin: thông tin đã biết đứng trước, thông tin mới đứng sau (end-focus); cụm dài nên đẩy về cuối câu (end-weight).",
      "Cấu trúc it-clause và what-cleft sắp xếp lại mạch này: It is worth noting that…, What matters most is…",
    ],
    points: [
      "The company cut costs. The savings funded research.",
      "It is worth noting that the sample is small.",
      "What matters most is consistency.",
      "Nối câu bằng đại từ trỏ nội dung trước: this approach, that decision.",
    ],
    examples: [
      { en: "The company cut costs. The savings funded research.", vi: "Công ty cắt giảm chi phí. Khoản tiết kiệm được chuyển sang nghiên cứu." },
      { en: "It is worth noting that the sample is small.", vi: "Đáng chú ý là mẫu khảo sát còn nhỏ." },
      { en: "What matters most is consistency.", vi: "Điều quan trọng nhất là sự nhất quán." },
    ],
  },

  "c2-register-rewrite": {
    intro: [
      "Viết lại theo ngữ vực: văn trang trọng thay cụm động từ bằng động từ gốc Latin (put off → postpone), danh hoá, bỏ dạng tắt.",
      "Mệnh đề quan hệ rút thành V-ing / V3; câu chủ động khách quan hoá bằng bị động.",
    ],
    points: [
      "We need to put off the meeting. → The meeting has been postponed.",
      "Applicants who lack documents → Applicants lacking documents.",
      "We decided to… → The decision was made to…",
      "Không dùng contractions trong văn viết trang trọng.",
    ],
    examples: [
      { en: "The committee decided to postpone the meeting.", vi: "Ủy ban quyết định hoãn cuộc họp." },
      { en: "Candidates lacking the required documents will be notified.", vi: "Các ứng viên thiếu giấy tờ yêu cầu sẽ được thông báo." },
      { en: "Please find attached the revised budget.", vi: "Kèm theo đây là ngân sách đã chỉnh sửa." },
    ],
  },

  "c2-prescriptive-rules": {
    intro: [
      "Một số quy tắc sách vở là quy ước, không phải luật: không tách to vô hạn, không kết câu bằng giới từ, phân biệt less / fewer.",
      "Người viết giỏi biết quy tắc để lựa chọn có chủ đích: tuân theo khi cần trang trọng, phá khi cần hiệu quả.",
    ],
    points: [
      "Ending a sentence with a preposition is often fine.",
      "There’s less data than we hoped for. (data số nhiều theo cổ điển)",
      "Split infinitives: to boldly go — chấp nhận khi giúp nhấn.",
      "Kiểm tra văn phong theo đối tượng đọc, không theo quy tắc rắn.",
    ],
    examples: [
      { en: "It’s a rule few writers actually follow.", vi: "Đây là quy tắc mà ít nhà văn thực sự tuân theo." },
      { en: "There’s less data than we hoped for.", vi: "Dữ liệu ít hơn chúng ta mong đợi." },
      { en: "Ending a sentence with a preposition is often fine.", vi: "Kết câu bằng giới từ thường vẫn ổn." },
    ],
  },

  "c2-uk-us": {
    intro: [
      "Anh-Anh và Anh-Mỹ khác nhau ở một số điểm ngữ pháp: have got / have, danh từ tập thể số nhiều hay số ít, gotten / got.",
      "Nguyên tắc quan trọng nhất là nhất quán: chọn một hệ thống và giữ suốt văn bản.",
    ],
    points: [
      "UK: Have you got a minute? — US: Do you have a minute?",
      "UK: The team are winning. — US: The team is winning.",
      "US dùng gotten: She has just gotten home; UK dùng got.",
      "Danh từ tập thể: family, government, team — hai hệ hai cách chia.",
    ],
    examples: [
      { en: "The committee have reached a decision.", vi: "Anh-Anh: hội đồng (số nhiều) đã ra quyết định; Anh-Mỹ dùng has." },
      { en: "She has just gotten home.", vi: "Anh-Mỹ dùng gotten; Anh-Anh viết She has just got home." },
      { en: "Have you got a minute?", vi: "Anh-Anh hỏi như thế; Anh-Mỹ: Do you have a minute?" },
    ],
  },
};
