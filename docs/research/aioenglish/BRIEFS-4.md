# BRIEFS-4 — Phase 4: Nhóm 2 (Đọc&dịch, Video, Nạp sâu, Kiểm tra lên cấp, Profile) + Nhóm 3 (Backend thật + PWA)

Đọc `BRIEFS-3.md` + `BRIEFS-2.md` + `BRIEFS.md` trước. Quy ước cốt lõi lặp lại:
- **CSS PRECOMPILED**: class không tồn tại trong entry.css → tự viết lp-* vào custom css của MÌNH. Audit mỗi class (escaped forms `md\:px-6`!). Script mẫu: `_agent-scripts/audit-classes2.js`.
- **AppShell**: `import AppShell from "@/components/sites/aioenglish/app/AppShell"` — `<AppShell active="...">{children}</AppShell>`.
- **Stores client**: `src/lib/store/auth.ts` + `progress.ts` (xem file để biết exports — KHÔNG đổi signature của hàm có sẵn).
- Node: `C:\Users\anhtu\.zcode\tools\node-v22.23.4-win-x64\node.exe`. Không browser, không npm install/dev/build. tsc 0 lỗi + audit 0 missing trước khi bàn giao.

## OWNERSHIP

| File | Owner |
|---|---|
| `src/server/**`, `src/app/api/**`, `public/manifest.webmanifest`, `public/sw.js`, `src/components/sites/aioenglish/pwa/**`, `src/lib/store/auth.ts` + `progress.ts` (chỉ thêm sync, giữ exports), submit handlers của `src/components/sites/aioenglish/auth/{LoginForm,RegisterForm,ForgotForm}.tsx`, `src/middleware.ts` (nếu cần) | **Agent F1** |
| `src/app/luyen-dich-thuat/**`, `src/app/video/**`, `src/components/sites/aioenglish/reading/**`, `src/components/sites/aioenglish/video/**`, `src/lib/demo-data/reading/**`, `src/styles/custom/{reading,video}.css` | **Agent F2** |
| `src/app/tu-vung/[course]/hoc-sau/**`, `src/components/sites/aioenglish/vocab/DeepSession.tsx`, `src/app/lo-trinh/kiem-tra/**`, `src/components/sites/aioenglish/leveltest/**`, `src/app/profile/**`, `src/middleware.ts` (profile rewrite — phối hợp F1), `src/styles/custom/{deepsession,leveltest,profile}.css` | **Session** |
| Landing, lesson go-cau, vocab flashcard, dashboard, gates | Session — không đụng |

## AGENT F1 — Backend thật + PWA

### 1. Server store `src/server/db.ts`
JSON file store: `data/server/db.json` (thư mục `data/server/` — thêm vào .gitignore). Shape:
```ts
{ users: [{ id, email, passwordHash, name, level, goal, accent: "uk"|"us", minutesPerDay, createdAt, handle }], sessions: [{ token, userId, createdAt, expiresAt }], progress: { [userId]: ProgressState }, leaderboard: [ {name, weeklyXp, level, streakDays} x8 seed ], feed: [ {id, actorName, actorHandle?, kind: "lesson"|"streak", text, at} ] }
```
- passwordHash = `node:crypto` scrypt (salt + hash hex). Token = randomUUID 2 lần nối. Expires 30 ngày. In-memory cache + fs write qua mỗi mutation (atomic write: write tmp rồi rename). Module-level singleton, khởi tạo lazy (tạo file + seed leaderboard/feed nếu chưa có).

### 2. API routes (`src/app/api/**/route.ts`, runtime nodejs)
- `POST /api/auth/login` {email, password} → 200 {user} + `Set-Cookie: aio_session=<token>; HttpOnly; Path=/; SameSite=Lax; Max-Age=2592000`; sai → 401 {error:"Email hoặc mật khẩu không đúng."}
- `POST /api/auth/register` {email, password, name} → validate (email format, password ≥8) → tạo user (handle = name slug + số ngẫu nhiên) + progress mặc định + cookie → 201 {user}. Trùng email → 409.
- `GET /api/auth/session` → {user} từ cookie hoặc {user:null}
- `POST /api/auth/logout` → xóa session + Set-Cookie hết hạn
- `GET /api/progress` → ProgressState của session user (mặc định zero-state nếu chưa có)
- `POST /api/progress/lesson` {courseId, mode, difficulty, seconds, accuracy, xp} → push lesson + cộng XP/phút → trả state
- `POST /api/progress/checkin` → streak logic như progress.ts
- `POST /api/progress/grade` {course, word, grade} → SM-2-lite như progress.ts
- `GET /api/xep-hang` → leaderboard: seed + real users sort theo weeklyXp, đánh dấu "Bạn"
- `GET /api/bang-tin` → feed items (mới nhất trước, tối đa 100)
- Lưu ý Next 15: `cookies()` từ `next/headers` là async — `await cookies()`.

### 3. Client sync (sửa `src/lib/store/auth.ts` + `progress.ts` — GIỮ NGUYÊN signatures/các hàm có sẵn)
- Thêm ở mỗi store: sau khi saveProgress/setDemoUser → fire-and-forget `fetch('/api/progress/...', {method:'POST', ...})` nếu có session (probe `GET /api/auth/session` một lần, cache kết quả). GET khi app load: server progress → ghi đè localStorage nếu server mới hơn (so updatedAt — thêm field `updatedAt` vào ProgressState). Không block UI, fail im lặng (catch rỗng).
- **Auth forms**: `LoginForm.tsx` submit → POST /api/auth/login → ok: setDemoUser(user) + router.push('/tong-quan'); lỗi: hiện notice lỗi thật. `RegisterForm` tương tự POST /api/auth/register. `ForgotForm`: giữ local notice + note "demo". Chỉ sửa submit logic + state thông báo, KHÔNG đổi markup/class.
- **Onboarding /chao-mung**: KHÔNG đụng (giữ local flow; nếu user đã đăng nhập server thì onboarding chỉ setDemoUser local — chấp nhận cho demo, ghi vào report).

### 4. PWA
- `public/manifest.webmanifest`: name "AIO English", short_name "AIO", theme_color "#f3f2eb", background_color "#f3f2eb", display "standalone", icons: `/sites/aioenglish/brand/favicon.svg` (any) + apple-touch-icon png 180 (có sẵn).
- `public/sw.js`: cache-first cho `/_next/static/` + `/sites/`, network-first cho navigation với offline fallback đơn giản; version query string để dễ invalidate.
- `src/components/sites/aioenglish/pwa/PwaRegister.tsx` (client, useEffect đăng ký `/sw.js` trong production only) — thêm vào `src/app/layout.tsx` (layout là của session — F1 ĐƯỢC PHÉP thêm đúng 1 dòng import + render PwaRegister, không sửa gì khác) + metadata manifest link.

## AGENT F2 — Đọc & dịch + Video

### 1. Đọc & dịch `/luyen-dich-thuat`
- **Hub**: header "Luyện đọc & dịch." + mô tả "Báo song ngữ, dịch có chấm điểm"; chip 266 BÀI (demo: 8 bài); grid chủ đề cards (Tin tức/Kinh doanh/Khoa học/Đời sống/Văn hóa/Thể thao/Du lịch/Công nghệ — mỗi chủ đề 1 bài demo).
- **Content** `src/lib/demo-data/reading/articles.ts`: 8 bài, mỗi bài {id, slug, title, topic, level, sentences: [{en, vi}] × 4-5 câu} — tự viết nội dung song ngữ chất lượng (đánh dấu "Nội dung demo" ở reader).
- **Reader** `/luyen-dich-thuat/[bai]`: server page + client player: (a) Chế độ Đọc: hiện EN từng câu + nút "Hiện nghĩa" từng câu; (b) Chế độ Dịch có chấm điểm: hiện câu VN → user gõ bản dịch EN → scorer: normalize (lowercase, bỏ punctuation) → token overlap ratio; ≥0.75 = "Chính xác" (+XP), 0.4-0.75 = "Gần đúng" (hiện bản mẫu), <0.4 = "Sai" (thử lại hoặc xem đáp án). Cuối bài: điểm tổng + XP (POST /api/progress/lesson nếu F1 kịp — gọi với try/catch fail im lặng). AppShell active="/luyen-dich-thuat".

### 2. Video Dictation & Shadowing `/video`
- **Hub**: "Dictation & Shadowing." + chip 1.166 VIDEO (demo 4 bài); giải thích "Một video, bốn cách học".
- **Bài học** `/video/[bai]`: client workspace: (1) ô nhập URL YouTube bất kỳ (parse videoId, render `https://www.youtube-nocookie.com/embed/<id>` iframe) — user dán link video tiếng Anh của họ; (2) Dictation: textarea theo câu — user nghe và gõ lại từng câu, nút "Xem transcript" (demo transcript 4-5 câu do bạn soạn, đánh dấu demo); (3) Shadowing: hướng dẫn + timer lặp câu. AppShell active="/video". KHÔNG hardcode video ID cụ thể (tránh embed chết) — để user dán link là tính năng thật của trang.

## SESSION tự làm (tham khảo, không đụng)
- Nạp sâu `/tu-vung/[course]/hoc-sau` — multi-stage per word: flashcard → trắc nghiệm EN→VN → trắc nghiệm VN→EN → gõ từ. 10 từ/phiên. Auto gradeCard.
- Kiểm tra lên cấp `/lo-trinh/kiem-tra` — 36 câu trộn typing + trắc nghiệm từ statements có sẵn, timer 40:00, kết quả → đề xuất lên cấp.
- Profile `/@handle` — middleware rewrite về /profile, trang hồ sơ công khai (stats từ store, avatar initials, badges).

## Hoàn thành
tsc 0 lỗi + audit 0 missing + report: files, API contracts, deviations. KHÔNG chạy build/dev/browser.
