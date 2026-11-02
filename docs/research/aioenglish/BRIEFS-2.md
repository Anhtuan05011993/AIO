# BRIEFS-2 — Phase 2: Dashboard, App shell, Trang phụ (clone logged-in app)

Đọc thêm `BRIEFS.md` (golden rules) trước. Nguyên tắc bổ sung cực kỳ quan trọng:

## ⚠️ CSS PRECOMPILED — không có Tailwind JIT

Toàn bộ CSS của site nằm trong `src/styles/source/entry.css` **đã compile sẵn**. Class mà site gốc không dùng thì **KHÔNG tồn tại** (`z-[90]`, `bg-x/50`, `h-13`, `backdrop-blur-*`, giá trị fractional lạ...). Trước khi bàn giao PHẢI chạy audit:
```
"C:\Users\anhtu\.zcode\tools\node-v22.23.4-win-x64\node.exe" _agent-scripts\audit-classes2.js
```
Script audit hardcode danh sách file của lesson — nếu bạn tạo file mới, copy script sửa mảng `files` (hoặc tự scan). Mọi class missing → thêm rule `lp-*` vào `src/styles/custom/<tên-của-bạn>.css` hoặc đổi sang class đã tồn tại (xem markup trong `docs/research/aioenglish/shots/dashboard-logged-in.png` + dashboard DOM spec dưới đây dùng toàn bộ class có thật).

Kiểm tra class có tồn tại: grep vào `src/styles/source/entry.css` (chú ý form escaped `md\:px-6`, `rounded-\[...\]`).

## Stores có sẵn (KHÔNG sửa, chỉ import)

- `src/lib/store/auth.ts` — `getDemoUser()`, `setDemoUser(DemoUser)`, `clearDemoUser()`, type `DemoUser { name, email, level, goal, accent: "uk"|"us", minutesPerDay, createdAt }`. Event `aio:user-changed`.
- `src/lib/store/progress.ts` — `loadProgress()`, `checkIn()`, `addLessonRecord()`, `gradeCard()`, `dueCards()`, `onProgressChange()`, types `ProgressState`, `SrsCard`, `Grade`. Event `aio:progress-changed`.

## Data có sẵn

- `src/lib/demo-data/go-cau/` — `PACK_B1.courses` (80 khóa), `getCourse(id)`, `COURSE_IDS` (3 khóa có data đầy đủ).
- `src/lib/demo-data/go-cau/pack-lo-trinh-b1.json`, `course-*.json` (xem `index.ts`).
- `src/lib/demo-data/learningPath.ts`, `nguPhapCatalog.ts`, `tuVungCourse.ts` (Agent C cũ) — dùng được cho widgets.
- `src/components/sites/aioenglish/lesson/LessonExperience.tsx` — có type `LessonMode`, `LessonDifficulty`, `buildSteps()`.

## OWNERSHIP MAP

| File | Owner |
|---|---|
| `src/lib/store/auth.ts`, `progress.ts` | Session (không sửa) |
| `src/components/sites/aioenglish/app/AppShell.tsx`, `src/styles/custom/app.css`, `src/app/tong-quan/**`, `src/components/sites/aioenglish/app/**` | **Agent D1** |
| `src/app/ban-be/**`, `src/app/cai-dat/**`, `src/app/luyen-thi/**`, `src/app/yeu-cau-tinh-nang/**`, `src/app/chao-mung/**`, `src/styles/custom/pages2.css` | **Agent D2** |
| `src/app/tu-vung/oxford-3000/**`, `src/components/sites/aioenglish/vocab/**`, `src/lib/demo-data/vocab/**` | **Session (vocab player)** |
| `src/app/page.tsx`, landing, lesson, gates, layout.tsx, source styles | Session (không đụng) |

D2 IMPORT AppShell từ `@/components/sites/aioenglish/app/AppShell` (D1 build). Nếu D1 chưa xong khi D2 cần, cứ viết theo interface dưới đây — tích hợp cuối session sẽ xử lý:
```tsx
<AppShell active="/tong-quan">{children}</AppShell>
// active: "/tong-quan" | "/go-cau" | "/tu-vung" | "/ngu-phap" | "/luyen-dich-thuat" | "/video" | "/tu-dien" | "/lo-trinh" | "/ban-be" | "/yeu-cau-tinh-nang" | "/cai-dat"
```

## APP SHELL spec (Agent D1) — theo dashboard-logged-in.png

Sidebar trái cố định (~240px, `bg-rail`), nền giấy `[data-nb-page="landing:home"]`-style: logo AIO | ENGLISH đầu sidebar; nav items với icon vuông bo góc màu pastel + label: Trang chủ (/tong-quan), Học qua gõ câu (/go-cau), Từ vựng & Phát âm (/tu-vung), Luyện ngữ pháp (/ngu-phap), Luyện đọc & dịch (/luyen-dich-thuat), Dictation & Shadowing (/video), Từ điển chuyên sâu (/tu-dien), Lộ trình học (/lo-trinh), Luyện thi + chip "Sắp có" (/luyen-thi); separator; Tiến độ & Bạn bè (/ban-be), Yêu cầu tính năng (/yeu-cau-tinh-nang), Cài đặt (/cai-dat). Item active: nền sáng + viền. Cuối sidebar: card user (avatar gấu mèo placeholder → initials, tên từ getDemoUser() || "Học viên demo", dòng "Trình độ ..."), hàng 2 số: 🔥 streak từ progress.streakDays "ngày liền", XP tuần progress.weeklyXp "XP tuần · #2843". Icon SVG: dùng lucide path có sẵn trong markup source (svg stroke=currentColor) — tự vẽ đơn giản tương đương là được (icon 16-20px).

Main content: max-w-5xl margin auto, padding, các widget卡片 `rounded-card border-bw border-border-strong bg-surface shadow-sh-2` (class có thật — kiểm tra entry.css).

## DASHBOARD /tong-quan spec (Agent D1) — thứ tự section

1. **Top bar**: ngày hiện tại tiếng Việt ("Thứ Bảy, 31/10" — Intl.DateTimeFormat vi-VN), streak pill (🔥 {streakDays} ngày) + 7 ô T2→CN (điểm từ checkInDays), nút "Điểm danh" (gọi checkIn(), disable nếu đã điểm danh hôm nay, cập nhật UI qua onProgressChange).
2. **Hero row**: h1 "Chào {firstName}, học tiếp nhé." + bên phải: banner "Ngữ pháp: Hiện tại hoàn thành: for, since · Bài hướng dẫn, khoảng 6 phút" + nút vàng "Học tiếp" (link /ngu-phap).
3. **"Hôm nay học gì?"**: 7 card tính năng (30.519 CÂU/Gõ câu, 10.929 THẺ/Từ vựng, A1 ĐẾN C2/Ngữ pháp, 266 BÀI/Đọc & dịch, 1.166 VIDEO/Video, TRA MỌI TRANG/Từ điển, 167 TRẠM/Lộ trình) — icon + chấm màu pastel riêng từng card, link tới routes tương ứng.
4. **"Kế hoạch hôm nay."** (card vàng nhạt): counter "{done}/5 bài" — đọc số bài đã học hôm nay từ progress.lessons (completedAt trong hôm nay); list 5 items: 1) Ngữ pháp · Bài hướng dẫn — "Hiện tại hoàn thành: for, since" — nút "Tiếp theo"; 2-4) Gõ câu — 3 khóa đầu của PACK_B1 có data (title + "~15 phút" + link /go-cau/lo-trinh-b1/{id}); 5) Từ mới · Oxford 3000 · B1 — "20 từ mới" — link /tu-vung/oxford-3000. Mỗi item icon + trạng thái ✓ nếu khóa tương ứng đã hoàn thành (progress.lessons).
5. **Hàng 2 cột**: trái "Lộ trình." card (0% chặng đường tới {goal}, progressbar, 3 ô: Bài đã học {lessonsCount}/115, Từ đã học {vocabSeen}/690, Chương 1/11 0/15; chip "Mục tiêu: {goal} · Dự kiến khoảng 3 tháng"; nút "Kiểm tra lên cấp 36 câu, 40 phút"; "Thời gian học tuần này: {minutesToday.minutes} phút · Đạt mục tiêu n/7 ngày"). Phải: card XP tuần ("Xếp hạng XP tuần." — tabs Tất cả/Bạn bè — bảng top 5 tĩnh demo: Hien Tran 2.462, Duy Tong 2.382, vencian영영 2.153, phan nhung 1.678, BLUE 1.581 + hàng "Bạn" với {weeklyXp} XP hạng #2843).
6. **"Bảng tin."** (card): list 8-10 tin demo "🦉 Cú ẩn danh đã hoàn thành một bài học · Vừa xong / 2 phút" + nút Thích (toggle), 2 tin có @handle + nút "Kết bạn". Footer nhỏ "Bảng tin hiện tối đa 100 tin gần nhất."

Dùng data thật khi có (streak, XP, plan) — số 115/690/36 cứng theo source. 

## AGENT D2 — Trang phụ (mỗi trang = AppShell + nội dung)

1. **/cai-dat** — Settings thật sự hoạt động: card nhóm (Tài khoản: tên/email từ DemoUser + nút Đăng xuất clearDemoUser → redirect /auth/login), **Giao diện: Dark mode toggle** (set `document.documentElement.dataset.theme = 'dark'|'light'` + lưu localStorage `aio-demo-theme`; MỚI: thêm inline script đọc key này trong AppShell mount), Skin (sotay/neo — data-skin trên html, demo), Giọng đọc (Anh-Anh/Anh-Mỹ radio → update DemoUser.accent), Mục tiêu + Mỗi ngày (radio 30/45/60/180 phút → DemoUser), Bảng tin ẩn danh (toggle demo), Về (link /phap-ly).
2. **/ban-be** — "Tiến độ & Bạn bè": tổng hợp từ progress (XP tổng, chuỗi, bài đã học — list lesson records gần nhất với tên khóa từ getCourse), phần "Bạn bè": 3 gợi ý kết bạn tĩnh + input @ID + nút "Tìm" → notice demo "Không tìm thấy @id (demo)".
3. **/luyen-thi** — Empty state "Sắp có." minh họa + mô tả + nút quay về /tong-quan.
4. **/yeu-cau-tinh-nang** — Form (tiêu đề, mô tả, loại) + submit chặn client → notice thành công local + reset.
5. **/chao-mung** — **Onboarding wizard 5 bước** (full-width, 2 cột: trái intro card "Chào mừng bạn đến với AIO English." + 3 phương pháp; phải steps): Steps indicator 1-5 (Trình độ, Mục tiêu, Giọng tiếng Anh, Mỗi ngày, Sẵn sàng).
   - B1 Trình độ: "Bạn quan tâm đến chứng chỉ nào?" IELTS / TOEIC / Chưa rõ → TOEIC hiện "Trình độ hiện tại của bạn?" (Mới bắt đầu (≤220) / TOEIC 225–549 / TOEIC 550–784 / TOEIC 785–944 / TOEIC 945–990); IELTS hiện dải tương đương; Chưa rõ bỏ qua.
   - B2 Mục tiêu: "Bạn muốn đạt tới đâu?" radio (TOEIC 785 Hết chặng B1 / 945 B2 / 990 C1) + dòng "Với {minutes} phút mỗi ngày: dự kiến khoảng 3 tháng để đạt TOEIC 785".
   - B3 Giọng: Anh-Anh (Mặc định, tomato /təˈmɑːtəʊ/) / Anh-Mỹ (Giọng Mỹ, tomato /təˈmeɪtoʊ/) + nút "Nghe" (speech.ts speak 'tomato' theo accent — import từ lesson/speech.ts).
   - B4 Mỗi ngày: 30 phút / 45 phút / 1 giờ / 3 giờ.
   - B5 Sẵn sàng: summary list + nút **"Bắt đầu"** → setDemoUser({name: "Học viên demo", email: "demo@aioenglish.local", level, goal, accent, minutesPerDay, createdAt}) → router.push("/tong-quan").
   - Nút Tiếp tục disabled đến khi chọn xong bước; "Quay lại {tên bước trước}".
   - Wizard là 1 client component duy nhất, steps trong state.

## Hoàn thành

- `npx tsc --noEmit` 0 lỗi trên file của mình; audit class 0 missing; KHÔNG chạy npm build/dev; KHÔNG dùng browser.
- Báo cáo: files tạo, class đã audit, điểm chưa khớp source.
