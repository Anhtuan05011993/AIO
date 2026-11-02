# BRIEFS-3 — Phase 3: Lộ trình học + Từ điển + Ngữ pháp

Đọc `BRIEFS-2.md` (constraint CSS precompiled + AppShell + stores) và `BRIEFS.md` (golden rules) trước. Tóm tắt quan trọng nhất:

## ⚠️ CSS PRECOMPILED

CSS site nằm trong `src/styles/source/entry.css` đã compile — class mà site không dùng KHÔNG tồn tại (arbitrary values `z-[90]`, `bg-x/50`, `h-13`...). Audit mọi class: grep vào entry.css + custom css của bạn (chú ý escaped `md\:px-6`, `rounded-\[...\]`). Mọi class thiếu → rule `lp-*` trong custom css của MÌNH. Script tham khảo: `_agent-scripts/audit-classes2.js`.

## AppShell

`import AppShell from "@/components/sites/aioenglish/app/AppShell"` — `<AppShell active="/lo-trinh">{children}</AppShell>`. AppRoute union đã có đủ routes. `useDemoUser`/progress stores có sẵn (`src/lib/store/`).

## Data có sẵn (đọc file để hiểu shape)

- `src/lib/demo-data/learningPath.ts` + `src/lib/demo-data/go-cau/...` (path.json: 11 chương, chapters 1-2 full 15+9 rows, 3-11 mỗi chương 3 rows, level/goal/etaText)
- `src/lib/demo-data/nguPhapCatalog.ts` (catalog ngữ pháp: groups/topics/nodes — nodes A1+B1 65/167)
- `src/components/sites/aioenglish/lesson/LessonExperience.tsx` — type + buildSteps nếu cần

## OWNERSHIP

| File | Owner |
|---|---|
| `src/app/lo-trinh/**`, `src/components/sites/aioenglish/path/**`, `src/styles/custom/path.css` | **Agent E1** |
| `src/app/tu-dien/**`, `src/components/sites/aioenglish/dictionary/**`, `src/styles/custom/dictionary.css`, `src/lib/demo-data/dictionary/**` | **Agent E2** |
| `src/app/ngu-phap/**` (thay gate), `src/components/sites/aioenglish/grammar/**`, `src/styles/custom/grammar.css`, `src/lib/demo-data/grammar/**` | **Agent E3** |
| Landing, lesson, vocab, stores, go-cau, AppShell | Session — KHÔNG đụng |

Lưu ý: `/lo-trinh`, `/tu-dien`, `/ngu-phap` hiện là **login-gate page** (Agent C) — bạn THAY page.tsx bằng trang thật (gate mất đi là chủ đích — app demo coi như đã đăng nhập).

## Agent E1 — `/lo-trinh` Lộ trình học

Trang bản đồ lộ trình TOEIC 785 từ learningPath.ts: header lộ trình (% chặng đường, progressbar, mục tiêu + ETA "Với X phút mỗi ngày: dự kiến khoảng 3 tháng"); danh sách **11 chương** dạng accordion/card: mỗi chương = card "Chương n · {title}" + hàng unit (unit title + số bài + trạng thái done/current/locked từ progress.lessons nếu có — khóa crs_* có thể map qua getCourseAsync để link "Vào học" cho khóa có data; khóa không data → mờ + tooltip "Chưa có data (demo)"); mục "Kiểm tra lên cấp 36 câu, 40 phút" (nút demo disabled). Màu/vibe theo design system (card nbx-r-info isle, pastel accent per chương từ mảng màu zone/land nếu có trong learningPath). Responsive: chương thu gọn thành hàng unit cuộn ngang trên mobile.

## Agent E2 — `/tu-dien` Từ điển chuyên sâu

1. **Chuẩn bị data**: tải `https://raw.githubusercontent.com/samuraitruong/open-vn-en-dict/master/goodWords.json` (1.9MB) vào `_agent-scripts/tmp-dict/`, inspect schema bằng script, rồi viết script chuyển → `src/lib/demo-data/dictionary/entries.json` (subset tối đa ~15k entries, giữ trường: word, phonetic/ipa, wordType(s), nghĩa VN, ví dụ nếu có — tuỳ schema thật). Ghi chú nguồn vào đầu file. Nếu schema xấu/thiếu → thử `words.json`; nếu vẫn không dùng được → fallback: build từ điển demo từ Oxford full-word.json (`docs/research/aioenglish/data/datasets/oxford-5000-full-word.json`: word + type + level) + nghĩa VN từ TOEIC 600 dataset — disclose rõ.
2. **Trang /tu-dien**: search box lớn (client, filter theo prefix + includes, debounce 150ms), kết quả = card từ (word + IPA + loại từ + nghĩa VN + ví dụ), max 30 kết quả, trạng thái rỗng ("Không tìm thấy…"), gợi ý từ phổ biến khi chưa gõ (một số từ ngẫu nhiên). AppShell active="/tu-vung"? KHÔNG — active="/tu-dien".
3. Route `/tu-dien/[word]`? Không cần — chỉ trang search 1 trang là đủ scope demo.

## Agent E3 — `/ngu-phap` Luyện ngữ pháp

1. **Hub page** từ nguPhapCatalog.ts: lọc theo cấp (A1→C2 tabs — node data chỉ có A1+B1 đầy đủ; C2+ hiển thị "Sắp có" mờ), grid topic cards (topics 51 + groups 14), mỗi node = card bài học (title, cấp, số câu nếu có, link vào lesson reader).
2. **Lesson reader** `/ngu-phap/[node]`: trang đọc bài ngữ pháp — từ node catalog lấy title + mô tả; nội dung bài: sinh demo từ dữ liệu có sẵn (ví dụ câu từ go-cau statements liên quan chủ đề nếu map được — ví dụ present perfect → 3 khóa crs_*; nếu không map được → soạn 3-5 đoạn giải thích tiếng Việt mẫu theo chủ điểm + câu ví dụ, đánh dấu "Nội dung demo"). Cuối trang: CTA "Luyện gõ câu liên quan" (link khóa tương ứng nếu có) + "Về Luyện ngữ pháp". Đây là reader tĩnh, không có engine luyện tập (source giữ dạng guide).
3. Route động `src/app/ngu-phap/[node]/page.tsx` + `generateStaticParams` từ nodes (tránh build lỗi), node lạ → notFound.

## Hoàn thành (cả 3)

- `npx tsc --noEmit` 0 lỗi; audit class 0 missing (script tự viết cho file của mình); KHÔNG npm build/dev; KHÔNG browser; không đụng file ngoài ownership.
- Báo cáo: files tạo, data đã convert (schema + số entries), class fallbacks, deviations.
