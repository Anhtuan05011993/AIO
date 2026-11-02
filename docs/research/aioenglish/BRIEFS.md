# BRIEFS — Clone aioenglish.com → Next.js (App Router)

## Bối cảnh dự án

- **Mục đích**: tái tạo aioenglish.com (Nuxt/Vue) thành app Next.js chạy local, pixel-accurate.
- **Next.js App Router, TypeScript strict, React 19, framer-motion đã cài** (nếu cần animation).
- **Không chạy `npm install`** — deps đã cài xong. Không chạy `npm run build` (sẽ xung đột .next giữa các agent).
- **Kiểm tra**: `set "PATH=C:\Users\anhtu\.zcode\tools\node-v22.23.4-win-x64;%PATH%"` rồi `npx tsc --noEmit`. Node full path: `C:\Users\anhtu\.zcode\tools\node-v22.23.4-win-x64\node.exe`.
- **KHÔNG dùng trình duyệt** (phiên đăng nhập shared — tránh xung đột). Mọi dữ liệu đã có sẵn trong `docs/research/aioenglish/`.

## Nguyên tắc vàng — "CSS gốc là của bạn"

Toàn bộ CSS gốc của site đã được import global trong `src/app/layout.tsx` (entry.css, pages.css, AuthPanel.css, legal.css, v.v. — xem `src/styles/source/`). **Giữ nguyên tên class + data-attributes của HTML gốc** → styles tự áp dụng đúng, không cần viết CSS mới trừ khi thiếu.

- HTML gốc SSR: `docs/research/aioenglish/home.html`, `docs/research/aioenglish/pages/*.html`
- CSS gốc (tham khảo selectors): `docs/research/aioenglish/css/*.css`
- Screenshots tham chiếu: `docs/research/aioenglish/shots/` (home-desktop-hero.png, dashboard-logged-in.png, home-faq-expanded.png)
- Assets local đã tải: `public/sites/aioenglish/` (fonts/, badges/, brand/, assets/ — paper textures)
- Fonts CSS: `src/styles/fonts.css` (đã có @font-face trỏ tới /sites/aioenglish/fonts/)

## Quy tắc chuyển HTML → React

1. Đọc HTML SSR gốc, tái tạo DOM structure tương đương: cùng thẻ, cùng class, cùng data-* / aria-*.
2. Bỏ: `<script>`, attributes Vue hydration (`data-v-*`), comment thừa.
3. **Link routing**: route trong scope (bảng dưới) → link nội bộ Next (`<Link>` hoặc href tương đương). Route ngoài scope → giữ URL gốc đầy đủ.
4. Text giữ nguyên tiếng Việt/Anh — tuyệt đối không dịch lại, không rút gọn.
5. Responsive/layout nằm trong CSS gốc theo class → chỉ cần DOM đúng là auto đúng.
6. Client interactivity → component `'use client'` riêng, không biến cả trang thành client trừ khi cần.
7. CSS mới nếu thiếu: tạo file riêng `src/styles/custom/<ten>.css` + import trực tiếp trong component/page của MÌNH. **Không sửa layout.tsx, globals.css, fonts.css, src/styles/source/**.
8. Không đụng file của agent khác. Route map:

| Route | File | Owner |
|---|---|---|
| `/` (landing) | `src/app/page.tsx` + `src/components/sites/aioenglish/landing/**` | **Agent A** |
| `/auth/login` `/auth/register` `/auth/forgot` | `src/app/auth/**` + `src/components/sites/aioenglish/auth/**` | **Agent B** |
| `/phap-ly` `/phap-ly/dieu-khoan` `/phap-ly/quyen-rieng-tu` | `src/app/phap-ly/**` + `src/components/sites/aioenglish/legal/**` | **Agent B** |
| `/go-cau` `/tu-vung` `/ngu-phap` `/luyen-dich-thuat` `/video` `/tu-dien` `/lo-trinh` (login-gate) | `src/app/<route>/page.tsx` + `src/components/sites/aioenglish/gate/**` | **Agent C** |
| Demo data JSON exports | `src/lib/demo-data/**` + `README.md` | **Agent C** |

In-scope routes cho link: `/`, `/auth/login`, `/auth/register`, `/auth/forgot`, `/go-cau`, `/tu-vung`, `/ngu-phap`, `/luyen-dich-thuat`, `/video`, `/tu-dien`, `/lo-trinh`, `/phap-ly`, `/phap-ly/dieu-khoan`, `/phap-ly/quyen-rieng-tu`.

## Agent A — Landing page

Nhiệm vụ: chuyển `home.html` (186KB SSR markup, đã có toàn bộ text + SVG inline) thành React.

Sections theo thứ tự (id trên HTML gốc): header nav (logo AIO svg, "Tính năng" → `#tinh-nang`, "Câu hỏi thường gặp" → `#cau-hoi`, Đăng nhập/Đăng ký) → hero (badge "MỌI THỨ...", h1 "Học tiếng Anh cùng [logo AIO ENGLISH]", đoạn giới thiệu với `<em>` highlights, CTA "Bắt đầu học miễn phí" → /auth/register, "Chơi thử ngay" → #go-thu, 2 badge App Store/Google Play → dùng ảnh local `/sites/aioenglish/badges/...`, dòng "Ra mắt vào 01.11.2026") → **Bài chơi thử** (region #go-thu — interactive typing demo: 6 câu mẫu, từ có IPA + loại từ + nghĩa tooltip; trạng thái chơi: gõ từ → đúng thì currentTarget tự advance; progress bar; dữ liệu 6 câu nằm trong home.html markup — "I like the blue sky." là câu 1) → "Không chỉ có mỗi gõ câu." (7 card tính năng: 30.519 câu / 10.929 thẻ / A1-C2 / 266 bài / 1.166 video / từ điển / 167 trạm — icon SVG inline trong HTML, link tới 7 route gate) → "Vì sao gõ lại từng câu thì nhớ lâu." (SVG chart đường cong quên Ebbinghaus — SVG markup có sẵn trong HTML, giữ nguyên path; chú giải Đọc lướt / Gõ lại từng câu / Gõ rồi ôn giãn cách + 3 mục 01/02/03) → "Câu thật từ kho, mỗi câu là một bài." (marquee 3 hàng × 14 câu unit, animation loop — tìm animation keyframes trong pages.css/entry.css theo class gốc và reuse) → FAQ "Câu hỏi thường gặp." (accordion 6 câu hỏi — nội dung ẩn trong home.html; implement expand/collapse 1 item mở tại 1 thời điểm) → CTA "Sẵn sàng bắt đầu?" (Tạo tài khoản miễn phí → /auth/register, 2 badge store, "Ra mắt vào 01.11.2026") → footer (dòng "Công cụ luyện tập độc lập...", nav Pháp lý 3 link, disclaimers TOEIC/IELTS, © 2026 AIO English).

Interactions phải hoạt động: FAQ accordion, typing demo (play state, gõ + Enter, advance câu), marquee chạy, header mobile (nếu HTML gốc có menu mobile). Root `<main>` + `data-nb-page="landing:home"` đã ở layout — page.tsx chỉ render inner content theo HTML gốc (body > div wrapper tương đương).

Finish line: `src/app/page.tsx` render đầy đủ các section trên; `npx tsc --noEmit` pass; báo cáo files đã tạo + interactive features đã implement.

## Agent B — Auth (3 trang) + Pháp lý (3 trang)

Auth: đọc `pages/auth__login.html`, `auth__register.html`, `auth__forgot.html`. Layout 2 cột (panel form + complementary aside). Form Đăng nhập: textbox Email (placeholder "Nhập email của bạn"), textbox Mật khẩu, nút hiện/ẩn mật khẩu (button trống trong markup — icon eye SVG), Google/Apple buttons (href giữ URL gốc — ngoài scope), link Quên mật khẩu → /auth/forgot. **Form submit: chặn mặc định, KHÔNG gọi API thật** — validate rỗng + hiển thị toast/note local là đủ. Register/Forgot tương tự theo markup.

Pháp lý: `pages/phap-ly.html` (index), `phap-ly__dieu-khoan.html`, `phap-ly__quyen-rieng-tu.html` — nội dung dài, chuyển hết text; NbPageHeader + legal.css đã global. Breadcrumb links trong scope.

Finish line: 6 route render đúng markup; tsc pass; report files.

## Agent C — Login-gates (7) + demo data + README

1. Đọc `pages/go-cau.html` (20KB — shell gate khi chưa đăng nhập; tu-vung/ngu-phap/luyen-dich-thuat/video/lo-trinh giống hệt nhau) → tái tạo gate page chung `src/components/sites/aioenglish/gate/FeatureGate.tsx` (client component nhận tên tính năng) — markup theo HTML gốc; nó có thể chứa CTA → /auth/login. `/tu-dien` gốc là meta-refresh redirect `/?dang-nhap&next=/tu-dien` → clone gate tương tự (không meta-refresh).
2. `src/lib/demo-data/`: export JSON hợp lý từ `docs/research/aioenglish/data/api-course-crs_b60adbaa933635b8d0.json` (statements EN/VN/IPA), `api-tu-vung-oxford-3000.json` (groups/sets), `api-path.json` (chapters) — viết lại thành TS modules có type.
3. `README.md` ở root: hướng dẫn chạy (npm install, npm run dev, port 3000), route map nguồn → local, cấu trúc thư mục, ghi chú assets.

Finish line: 7 route render gate; demo-data typed exports; README hoàn chỉnh; tsc pass.
