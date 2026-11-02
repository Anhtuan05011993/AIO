# AIO English — Kế hoạch hoàn thiện clone giao diện

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task. Theo dõi tiến độ bằng các checkbox.

**Goal:** Hoàn thiện giao diện AIO English trên nền dự án hiện tại, ưu tiên bố cục và tương tác frontend giống nguồn, bỏ qua việc bổ sung khóa học.

**Architecture:** Giữ Next.js App Router, React và hệ thống CSS/asset hiện có. Sửa từng khu vực trong component hiện tại; bổ sung fixture giao diện độc lập với tình trạng có dữ liệu bài học. Chỉ dùng state local cho các trạng thái cần trình diễn; không bổ sung backend trong đợt này.

**Tech Stack:** Next.js 15, React 19, TypeScript 5, CSS nguồn trong `src/styles/source`, CSS bổ sung trong `src/styles/custom`.

**Spec:** Phạm vi người dùng ngày 01/11/2026 và phần khảo sát/tiêu chí trong tài liệu này. Đây là kế hoạch đề xuất, chưa triển khai thay đổi sản phẩm.

## Phạm vi và nguyên tắc

- Clone giao diện hiện tại, không thiết kế lại phong cách.
- Bao gồm trang công khai, khung app, dashboard, các hub tính năng, cài đặt, bạn bè và các hộp thoại liên quan.
- Các trang học sâu đã có chỉ kiểm tra khung giao diện và khả năng điều hướng; không hoàn thiện nội dung hoặc thuật toán học trong đợt này.
- Bỏ qua thu thập khóa học, câu mẫu, bộ từ, transcript, âm thanh, chấm điểm, SRS, TTS và tích hợp dịch.
- Giữ thẻ/tên nhóm học cần thiết để tái hiện bố cục; thiếu khóa học không được chặn dựng giao diện. Dùng fixture tối thiểu và trạng thái chưa có nội dung khi cần.
- Không sửa CSS nguồn; ưu tiên sửa cấu trúc JSX, class, thuộc tính scoped và CSS custom. Không thêm thư viện UI hoặc thay framework.
- Không lấy tên/người dùng đang đăng nhập trên nguồn làm dữ liệu tài khoản mặc định của clone.
- Không gọi thao tác ghi dữ liệu lên website nguồn trong quá trình khảo sát.

## Khảo sát và mức độ chắc chắn

Đã đọc package, route tree, shell, dashboard, hub Ngữ pháp/Lộ trình/Video, các chỗ placeholder và tài liệu nghiên cứu. Đã xem trực tiếp dashboard và trang Ngữ pháp của nguồn ngày 01/11/2026. Những trang khác dựa trên mã hiện tại và tài liệu ngày 31/10; phải xác nhận lại trước khi sửa, không coi ghi chú cũ là snapshot mới.

| Khu vực | Bằng chứng hiện tại | Việc cần làm |
|---|---|---|
| Landing/auth/pháp lý | Đã có component, HTML/CSS và ảnh tham chiếu | Kiểm tra hồi quy, mobile và liên kết; không viết lại từ đầu |
| Trang chủ đăng nhập | Nguồn ở `/`; local `/` luôn render LandingStatic, dashboard ở `/tong-quan` | Đồng bộ cách vào trang chủ theo phiên local; giữ alias `/tong-quan` |
| Shell | Có AppShell, logo bằng chữ, icon nét; mobile đổi sidebar thành khối thường | Đối chiếu logo, icon pastel, sidebar, vùng cuộn và điều hướng mobile thực tế |
| Dashboard | Có đủ nhóm widget; source là XP tháng, local XP tuần | Sửa bố cục, thẻ và ngữ nghĩa bảng hạng theo tháng ở mức fixture UI |
| Ngữ pháp | Source có Theo lộ trình / Ngữ pháp cốt lõi 51, A1 8 chương và các cấp mở rộng; local grid mặc định B1 | Tái dựng hub theo cấu trúc đang hiển thị thật |
| Gõ câu | Đã có hub; CTA mặc định vào B1; một số thẻ gắn Chưa trích | Kiểm tra nguồn, giữ hub đầy đủ, tách trạng thái nội dung khỏi hình thức thẻ |
| Từ vựng/IPA | Hub có nhóm nhưng lộ thông báo Chưa trích; không tìm thấy route `/tu-vung/phat-am` trong src/app | Hoàn thiện hub và trang tổng quan IPA, không làm nội dung luyện âm |
| Lộ trình | PathJourney dựa dữ liệu B1, cấp khác disabled | Xác nhận source, dựng tab Hành trình/Kiến thức và bộ chọn cấp bằng fixture |
| Video | Local 4 bài demo, yêu cầu dán YouTube; ghi chú source có Tôi/Khám phá | Dựng hub thư viện và trạng thái giao diện; không lấy toàn bộ kho video |
| Bạn bè/cài đặt/yêu cầu | Đã có UI, còn nhiều dòng demo và thông báo kỹ thuật | Đối chiếu từng section, modal, tab, trạng thái rỗng |
| Tài liệu | README nói chưa có app đăng nhập/backend, trái mã hiện tại | Cập nhật mô tả và phạm vi sau khi hoàn thiện |

Giới hạn kiểm tra: thư mục hiện không có `.git`; không có dev server lắng nghe ở 3000/3001 tại lúc khảo sát. `npx tsc --noEmit` chưa chạy được vì `npx` không có trong PATH. Chưa kết luận build/typecheck hoặc độ khớp ảnh local hiện tại.

## Cách triển khai đề xuất

Hoàn thiện từng trang trên nền hiện có là lựa chọn đề xuất: tận dụng tài nguyên đã chuyển đổi và sửa đúng những phần lệch. Viết lại toàn bộ làm mất lợi thế CSS/asset đã có; tiếp tục lấy dữ liệu khóa học kéo dài việc ngoài phạm vi người dùng. Không cần tạo concept hình ảnh mới vì nguồn chính là chuẩn tham chiếu.

## Review Focus

1. Khách và người có phiên local vào `/` phải thấy đúng landing hoặc dashboard, không nháy sai trang hay lặp redirect.
2. Mobile không xuất hiện sidebar dài chiếm hết màn hình, tràn ngang hoặc mất nút điều hướng.
3. Tab, accordion và dialog dùng được bằng bàn phím, đóng bằng Escape và trả focus hợp lý.
4. Không có dữ liệu khóa học hoặc API local thất bại vẫn xem được hub, không thành trang trắng/404.
5. CSS custom không làm hỏng landing/auth/pháp lý; kiểm tra lại sau khi sửa shell và token/theme.

## Task 1 — Chốt bản đối chiếu và chạy được bản local

**Files:** tạo `docs/research/aioenglish/UI-AUDIT-2026-11-01.md`; ảnh trong `docs/research/aioenglish/shots/ui-completion/`.

**Interfaces:** đầu vào là route/component hiện có; đầu ra là bảng route → screenshot nguồn/local → sai lệch → ưu tiên, dùng chung cho các task sau.

- [ ] Xác định Node/npm đã cài hoặc cấu hình môi trường chạy; không tự nâng dependencies.
- [ ] Chạy dev server, ghi cổng thực tế; chạy typecheck và build lấy baseline lỗi.
- [ ] Chụp nguồn/local cùng kích thước: desktop 1440×900, tablet 768×1024, mobile 390×844. Xác minh thêm không tràn ở 360px.
- [ ] Khảo sát các route sidebar; mở tab/accordion/dialog bằng thao tác đọc/xem, tránh submit hoặc thay cài đặt thật.
- [ ] Ghi rõ trạng thái đăng nhập, cấp A1, theme sáng và ngày/số liệu động để so sánh không nhầm.

**Nghiệm thu:** mỗi trang trong phạm vi có tham chiếu hoặc được đánh dấu chưa xác minh; baseline lỗi có cách tái hiện. Không sửa UI theo trí nhớ.

## Task 2 — Khung app và đường vào trang chủ

**Files:** sửa `src/app/page.tsx`, `src/components/sites/aioenglish/app/AppShell.tsx`, `src/styles/custom/app.css`; kiểm tra `src/lib/store/auth.ts`, `src/app/tong-quan/page.tsx`, `src/components/sites/aioenglish/NbArtDefs.tsx`. Tạo component điều hướng mobile trong thư mục app nếu cấu trúc nguồn yêu cầu.

**Interfaces:** giữ `AppShell({active, children})` và alias `/tong-quan`; mọi hub tiếp tục dùng cùng shell. Trạng thái phiên theo cơ chế local hiện hữu, không tạo hệ auth mới.

- [ ] Ghi kiểm tra điều hướng: khách `/` → landing; có phiên `/` → dashboard; logout → trạng thái khách; refresh không sai trang.
- [ ] Sửa logo bằng asset brand sẵn có, sidebar, icon, card người dùng, vùng cuộn, khoảng cách và nền giấy theo audit.
- [ ] Dựng điều hướng mobile đúng nguồn, active state và skip link; không suy đoán kiểu menu trước khảo sát.
- [ ] Kiểm tra ba kích thước tham chiếu, focus và mọi liên kết sidebar.

**Nghiệm thu:** khung app nhất quán trên mọi hub, không tràn 360px, logo và điều hướng không dẫn người có phiên về landing ngoài ý muốn.

## Task 3 — Dashboard

**Files:** sửa `src/components/sites/aioenglish/app/dashboard/{DashboardHome,HomeHeader,TodayDeck,PlanCard,RoadmapCard,XpRankCard,NewsFeedCard}.tsx`, `src/styles/custom/app.css`; tạo `src/lib/ui-fixtures/dashboard.ts` nếu cần.

**Interfaces:** fixture chỉ mô tả nội dung hiển thị; không thay hợp đồng `/api/xep-hang` để giả làm dữ liệu tháng. Giữ các callback hiện có hoạt động hoặc dùng state trình diễn độc lập.

- [ ] Đối chiếu và sửa banner chào, điểm danh, bảy thẻ, vị trí Kế hoạch/Lộ trình, bảng hạng và bảng tin.
- [ ] Chuyển phần trình bày bảng hạng sang XP tháng, top 3, danh sách còn lại, dòng Bạn và tab Bạn bè theo source; không dán nhãn tháng lên số XP tuần.
- [ ] Dựng menu từng bài, sửa mục tiêu/ngày và mục tiêu lộ trình bằng UI local nếu source có.
- [ ] Bổ sung footer và tiện ích chung đúng vị trí sau xác minh source.
- [ ] Kiểm tra trạng thái mới học, có tiến độ, bảng hạng/bảng tin rỗng hoặc lỗi, modal mở/đóng; chụp đối chiếu.

**Nghiệm thu:** đủ section và đúng thứ tự/độ rộng; không mất bố cục khi API lỗi; dữ liệu cá nhân fixture không sao chép tài khoản nguồn.

## Task 4 — Hub Ngữ pháp và Lộ trình

**Files:** sửa `src/components/sites/aioenglish/grammar/GrammarHub.tsx`, `src/components/sites/aioenglish/path/{PathJourney,PathChapterCard}.tsx`, `src/styles/custom/{grammar,path}.css`; tạo `src/lib/ui-fixtures/learning-hubs.ts` khi cần.

**Interfaces:** tái sử dụng catalog và metadata có sẵn; fixture bổ sung cấu trúc trình bày, không yêu cầu có statements của khóa học.

- [ ] Ngữ pháp: header tiến độ, Học tiếp, hai tab, A1 theo chương, Đang học/Chưa học và phần mở các cấp tiếp theo.
- [ ] Lộ trình: xác minh rồi dựng Hành trình/Kiến thức, cấp A1–C1, mục tiêu phút, mục lục và nhóm đã bỏ qua.
- [ ] Liên kết bài có nội dung giữ nguyên; mục chưa có nội dung mở trạng thái giải thích local rõ ràng, không 404.
- [ ] Kiểm tra đổi tab/cấp, mở chương, không có tiến độ và nội dung dài trên mobile; chụp từng tab chính.

**Nghiệm thu:** hub không bị ép về B1; xem các cấp không phụ thuộc tải thêm khóa học.

## Task 5 — Gõ câu, Từ vựng và tổng quan IPA

**Files:** sửa `src/components/sites/aioenglish/go-cau/GoCauHub.tsx`, `src/components/sites/aioenglish/vocab/VocabHub.tsx`, `src/styles/custom/vocab.css`; tạo `src/app/tu-vung/phat-am/page.tsx`, `src/components/sites/aioenglish/vocab/PronunciationHub.tsx`; cập nhật CSS custom liên quan sau audit.

**Interfaces:** route IPA render trong AppShell active `/tu-vung`; chưa dựng phiên luyện âm. Thẻ hub dùng metadata hiện hữu, không phụ thuộc file khóa học đầy đủ.

- [ ] Đối chiếu hero/CTA, năm cấp và nhóm bộ câu; không hardcode B1 cho CTA bắt đầu nếu UI đang là A1.
- [ ] Hoàn thiện hai tab từ vựng, ôn hôm nay, nhóm IPA, nhóm đề xuất và nhóm mục tiêu thi.
- [ ] Dựng tổng quan IPA ba nhóm và trạng thái tiến độ bằng fixture tối thiểu; chỉ lấy tên/nhãn cần để dựng UI sau khi xác minh.
- [ ] Đưa thông báo kỹ thuật như Chưa trích/API rate-limit ra khỏi thẻ chính; dùng trạng thái chưa có nội dung trong tương tác đích khi cần.
- [ ] Kiểm tra mọi CTA: route tồn tại hoặc có trạng thái local rõ ràng; thử không có kho dữ liệu.

**Nghiệm thu:** xem được toàn bộ bố cục hub và IPA, không phải crawl khóa học để hoàn thành giao diện.

## Task 6 — Video, Đọc & dịch, Từ điển

**Files:** sửa `src/components/sites/aioenglish/video/VideoHub.tsx`, `src/components/sites/aioenglish/reading/ReadingHub.tsx`, `src/components/sites/aioenglish/dictionary/DictionarySearch.tsx`, `src/styles/custom/{video,reading,dictionary}.css`; tạo `src/lib/ui-fixtures/video-library.ts` nếu cần.

**Interfaces:** fixture thư viện chỉ chứa metadata đủ hiển thị; giữ workspace hiện có và API học tập nguyên phạm vi.

- [ ] Video: xác nhận rồi dựng Tôi/Khám phá, tìm kiếm/bộ lọc nếu có, gợi ý bắt đầu, thumbnail/duration và thư viện theo nguồn.
- [ ] Bỏ cách trình bày hub như danh sách bốn bài demo cần dán YouTube nếu source không có; giữ tính năng cũ trong workspace nếu còn phù hợp.
- [ ] Đọc & dịch/Từ điển: đối chiếu header, ô tìm, nhóm nội dung, bộ lọc, phân trang và trạng thái rỗng theo thực tế, chỉ sửa phần lệch.
- [ ] Kiểm tra tìm/lọc bằng fixture local, reset bộ lọc, không có kết quả, loading/error và bố cục mobile.

**Nghiệm thu:** hình thức thư viện giống nguồn với tập mẫu nhỏ; không cần transcript/kho bài đầy đủ hoặc dịch thật.

## Task 7 — Trang phụ, hộp thoại và hồi quy công khai

**Files:** sửa `src/components/sites/aioenglish/app2/{TienDoBanBe,CaiDat,YeuCauTinhNang,LuyenThi,OnboardingWizard}.tsx`, `src/styles/custom/pages2.css`; kiểm tra `src/app/profile/page.tsx`, auth, legal và landing.

**Interfaces:** các thao tác settings giữ cơ chế lưu local hiện hữu; yêu cầu tính năng không gửi lên source. Không mở rộng hệ kết bạn/backend.

- [ ] Đối chiếu Bạn bè, hồ sơ, yêu cầu tính năng và Luyện thi; dựng đủ tab/card/form/trạng thái rỗng trong phạm vi giao diện.
- [ ] Cài đặt: xác minh tám nhóm đã ghi trong BRIEFS-5, sửa vị trí control, selected state, nhãn, toast và dialog.
- [ ] Kiểm tra theme/skin nếu tiếp tục cung cấp: áp dụng nhất quán, refresh không sai trạng thái; source chưa xác minh thì ghi rõ giới hạn.
- [ ] Hồi quy landing, login/register/forgot, pháp lý: typography, FAQ, demo có sẵn, menu mobile, lỗi form và liên kết.
- [ ] Mỗi dialog có nhãn, Escape, quản lý focus và thao tác bàn phím.

**Nghiệm thu:** không còn button/tab giả không phản hồi; các thao tác cần backend hiển thị giới hạn local rõ ràng, không giả thành công thao tác thật.

## Task 8 — Nghiệm thu và bàn giao

**Files:** cập nhật `README.md`, `docs/research/aioenglish/UI-AUDIT-2026-11-01.md`, ảnh trong `shots/ui-completion/`. Nếu cần tự động hóa, tạo test điều hướng/tương tác sau khi chọn runner phù hợp; không thêm test chỉ lặp markup/CSS.

- [ ] Chạy `npx tsc --noEmit` và `npm run build` trong môi trường Node/npm đã cấu hình; lưu kết quả hiện tại, không dùng log build cũ làm bằng chứng.
- [ ] Smoke test tất cả route thuộc phạm vi, refresh trực tiếp, khách/có phiên, không có dữ liệu và API lỗi.
- [ ] So ảnh source/local cùng viewport: nền, font, sidebar, chiều rộng, khoảng cách, thứ tự section, icon, viền/bóng và modal. Ghi sai lệch còn lại cụ thể; không tuyên bố pixel-perfect nếu chưa có ảnh đối chiếu.
- [ ] Kiểm tra không tràn ngang, focus nhìn thấy, tab keyboard, Escape, ảnh thiếu và lỗi console/hydration.
- [ ] Cập nhật README phản ánh đúng route/backend hiện có, cách chạy và phần khóa học cố ý chưa hoàn thiện.

**Hoàn tất khi:** mọi trang trong audit được nghiệm thu hoặc nêu rõ giới hạn có bằng chứng; không có 404 từ điều hướng thuộc phạm vi; typecheck/build pass hoặc lỗi tồn tại được báo chính xác; giao diện hoạt động độc lập với việc bổ sung khóa học.

## Thứ tự và cách chia đợt

1. Task 1 → 2 → 3: khóa chuẩn tham chiếu, sửa khung và dashboard trước vì ảnh hưởng rộng.
2. Task 4 → 5 → 6: hoàn thiện các hub, dùng lại khung đã ổn định.
3. Task 7 → 8: trang phụ, responsive và bàn giao.

Chỉ bắt đầu code khi người dùng chuyển từ yêu cầu lập kế hoạch sang triển khai. Đề xuất thực hiện trực tiếp theo từng đợt; không cần viết lại dự án hoặc lấy thêm khóa học. Chưa ước lượng số giờ khi chưa chạy được local và hoàn thành audit ảnh.
