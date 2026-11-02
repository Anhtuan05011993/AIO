# Khung Ngữ pháp — 02/11/2026

Goal vẫn active. Đây là checkpoint, không phải nghiệm thu toàn website.

## Phạm vi đã sửa

- GrammarTopicFrame dùng markup/scoped CSS nguồn: header, outline, overview, ví dụ EN/VI, CTA, fullscreen và speech hiện hữu. Enter dẫn vào player đang có, không tạo thuật toán học.
- LessonNavigationDrawer thay menu hai link: đủ11 liên kết, logo/icon/ảnh đại diện có sẵn, tài khoản local và fixture XP tháng riêng. CSS có scope, không đổi AppShell/API/store.
- Mục lục mẫu Thì hiện tại đơn đúng nhóm/chặng/trạng thái nguồn. Hàng chưa học inert đúng nguồn. Các chủ đề khác dùng metadata hiện có, chưa nghiệm thu chặng/nội dung.
- Tách GrammarTopicDocument khỏi learner; Xem lại tài liệu mở dialog dùng chung renderer. Header/TOC/bốn section đầu có specimen UI, không import kho bài lớn.
- **Thân tài liệu chưa hoàn tất:**17 section còn lại dùng tóm tắt có sẵn, thiếu kiểu bảng/công thức/ví dụ/callout. Body-height delta -2760..-6399px chưa đạt; không coi chỉ là dữ liệu. Cấu trúc đã khảo sát: source/grammar/document-block-structure.json.

## Ma trận bằng chứng

| Trạng thái | Khảo sát | Local | Production | 1440×900 / 768×1024 / 390×844 / 360×844 |
|---|---|---|---|---|
| Overview mẫu | Có | Có | Có | Bar/grid/card/title/CTA/aside bbox0, không overflow |
| Drawer learner | Có | Có | Có | Panel/sheet/header/list/account bbox0 |
| Dialog mục lục mẫu | Có | Có | Có | Panel/title/list bbox0 |
| Dialog tài liệu, đầu trang | Có | Có | Có | Panel/title/scroll/section đầu bbox0 |
| Trang tài liệu, đầu trang | Có | Có | Có | Header/TOC/section đầu bbox0; thân dưới chưa đạt |
| Player kế tiếp | Khung hiện hữu | Route | HTTP | Chưa nghiệm thu ảnh/tương tác toàn bộ |

Ảnh JPEG cùng viewport và số đo tại ../shots/goal-grammar-topic/:

- overview-final-metrics.json, document-dialog-final-metrics.json, document-page-final-metrics.json.
- navigation-final-metrics.json, toc-final-metrics.json, production-keyboard.json.
- Các bản overview-metrics/dialog-metrics cũ có lỗi đã được thay thế bởi bản final.
- Bbox0 không thay thế so ảnh. Tên/cấp/avatar/streak tài khoản local khác nguồn được giữ; không dùng danh tính nguồn làm mặc định.

## Kiểm tra và vận hành

- Typecheck/build qua: typecheck-grammar-navigation.log, build-grammar-navigation.log.
- 43/43 test qua: test-grammar-navigation.log. Test chủ đề/tài liệu kiểm102 URL và marker learner/document khác nhau; unknown-topic404 giữ nguyên.
- invariant-grammar-navigation.json:23 CSS nguồn/13 API/2 store không đổi/thêm/xoá.
- Keyboard production: Shift+Tab logo→Cài đặt, Tab cuối→logo; Escape trả Menu điều hướng; đóng TOC trả Chương1/3; đóng tài liệu trả Xem lại tài liệu.
- Production kiểm với SW/cache bypass tắt. Chuyển dev→production từng có bundle cũ; hard reload mới xác minh JSX/CSS hiện tại. Không dùng ảnh bundle cũ để nghiệm thu.
- Dev từng ghi hydration/key warning; chưa tuyên bố giải quyết toàn bộ cảnh báo toàn app.
- Server production port3001/session8368. Dừng server cũ trước khi build; npm.cmd run build, sau đó npm.cmd run start -- --port 3001. Không chạy dev/build chung .next.

## AGY

CLI gemini-3.8-flash-high effort high chỉ nhận code local qua prompt, không đọc web hoặc sửa file.

- agy-grammar-topic-review.txt: áp dụng aria-expanded/haspopup/current-step, highlight exact-token, speech cleanup, fullscreen trạng thái/lỗi và Enter guards. UiDialog đã có focus-return; outline inert đúng nguồn; bỏ prop reference khi tách document.
- agy-lesson-navigation-review.txt được kiểm chứng lại. useDemoUserSync là utility subscribe có sẵn, không gọi React hook. Dialog CSS thực tế240px nên suy luận overlay100vw sai. Vòng focus với danh sách link hiện tại đã được thử. Nhận xét showModal/lifecycle chưa tái hiện. Đề xuất đóng cho screen reader còn cần rà riêng; không coi nhãn WCAG của reviewer là kết luận chuẩn.

## Còn bắt buộc

1. Bổ sung kiểu trình bày bảng/công thức/ví dụ/callout bằng dữ liệu có sẵn/fixture tối thiểu; không bổ sung kho học. Chưa nghiệm thu reader từ bốn section đầu.
2. Chủ đề khác, word lookup, fullscreen đang bật và player đại diện. Desktop TOC mới chốt mẫu cao844px; dialog thấp hơn cần đối chiếu căn giữa nguồn.
3. Drawer backdrop click đã đóng và trả focus; navigation tới /ngu-phap không giữ focus trong drawer. Fullscreen đổi label/pressed khi vào/thoát. Bằng chứng production-interactions.json. Touch screen reader và icon fullscreen active chưa đối chiếu ảnh nguồn; shell paint trống ngẫu nhiên vẫn ở backlog.
4. Giữ nguyên backlog toàn goal: Dashboard, trạng thái hub, trang phụ/công khai/onboarding và học sâu còn thiếu.
