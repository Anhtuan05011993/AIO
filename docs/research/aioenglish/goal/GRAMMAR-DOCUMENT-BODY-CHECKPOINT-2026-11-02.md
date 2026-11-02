# Thân tài liệu và cảnh báo React — 02/11/2026

Goal active. Mốc trước là tiến triển thực: đã bổ sung renderer và bằng chứng production; mốc này tiếp tục đủ21 section của specimen Present Simple, không thu hẹp goal toàn website.

## Triển khai

-14 section trước dùng intro xoay vòng đã được thay bằng đúng kiểu khối theo spec nguồn. `_agent-scripts/build-grammar-document-fixture.mjs` trích phần trình bày từ dữ liệu local có sẵn; fixture23.6KB, không import pool lớn vào client.
- Giữ section IDs/thứ tự, số paragraph, công thức, ví dụ, bảng/card, callout và link luyện. Owner node lấy từ spec và mapping kiểm tra với catalog; bỏ phép modulo xoay vòng intro. Không bổ sung course/pool/thuật toán.
- Văn bản fixture lấy từ intro/points/start/gap/choice/fix đã có. Ví dụ gap/choice dùng target+sourceVi của cùng câu; mistake table dùng source/target/explain. Công thức ngắn là nhãn trình bày quan sát trên nguồn.
- Có provenance để truy nguồn local, không đem ID bài tập vào state học. Ví dụ tổng hợp6 dòng có nhãn node. Footer “Đọc xong” có Về danh sách/Bắt đầu học đúng route.
-21 section đã có đầy đủ kiểu trình bày, **chưa nghiệm thu reader hoàn chỉnh**: word lookup chưa triển khai; nội dung mẫu khác nguồn và cần kiểm ảnh các phần giữa/trạng thái còn lại. Các chủ đề khác chưa có cùng mức khảo sát.

## Bằng chứng production trước chỉnh icon cuối

Ảnh/JSON: `../shots/goal-grammar-document-body/`.

- production-structure.json:21 section, thứ tự/kiểu class/số item và số row khớp spec; issues/classDifferences rỗng.
- block-style-metrics.json:13 selector đại diện, font/màu/line-height/padding/gap/radius được so ở4 viewport, không có khác biệt thuộc tính đã đo.
- top-final-metrics.json: section đầu bbox0 ở1440×900,768×1024,390×844,360×844; không overflow ngang.
- footer-final-metrics.json: footer delta tối đa0.875px ở4 viewport, link đúng.
- specimen-final-metrics.json:12 case của3 mẫu có cùng text nguồn, delta tối đa1.125px, không overflow. Local nay có đủ thân nên không cần ngoại lệ scroll-end của checkpoint trước.
- Body-height vẫn khác -195.859375/-325.296875/-702.765625/-700.125px theo4 viewport do văn bản fixture khác. Đây không phải chứng minh toàn trang khớp4px. Kiểu khối khớp không thay thế ảnh toàn reader.
- Bbox ghi ngay sau screenshot, kèm viewport DOM thật, như quy tắc capture đã xác minh ở checkpoint trước. Không sửa DOM nguồn để so ảnh.

## Cảnh báo key và bundle

- Phát hiện thực tế key sau spread scoped attribute làm SWC chuyển JSX sang createElement có mảng con tĩnh; React dev báo thiếu key. Chuyển key trước spread (chỉ các object data-v hằng, không có key) khắc phục cảnh báo mà không suppress.
- Đã sửa renderer/body và15 vị trí ở DictionaryHub, GrammarTopicFrame, LessonNavigationDrawer, PressLibrary, ReadingCatalog. Backup file nguyên trạng tại .ui-goal-backup/scoped-jsx-keys; hash/số vị trí trong jsx-key-order-fix.json.
- grammar-document-dev-console.json và grammar-document-dev-server-after-key-fix.log: lượt tải mới không cảnh báo key của reader.
- scoped-jsx-keys-dev-console-clean.json: không key warning ở4 route đã thử. Một diff hydration có data-sharkid không nằm trong repo; một diff learner có aria-haspopup/expanded giữa SSR/client cũ, chưa tái hiện trên production. Không coi mọi hydration đều do extension.
- scoped-jsx-keys-production-network.json:4 route, console không error/warn sau reload cache bình thường, có menu/TOC interaction. Bundle URLs đều tồn tại trong build theo scoped-jsx-keys-production-build-assets.json. Một số response từ SW; không yêu cầu tắt SW để qua kiểm tra.

## AGY và quyết định

agy-grammar-document-body-review.txt: model gemini-3.8-flash-high effort high, prompt chỉ code local; không đọc web/sửa file.

- Áp dụng mapping node tường minh có guard, focus token từ lựa chọn nếu cần, provenance start.examples, nhãn node, footer và kiểm trùng paragraph.
- Không áp dụng suy luận preview bị mất: JSX fallback vẫn render preview; topic-level blocks đã resolve nên không dùng fallback intro. Spec rule có node đã khảo sát; generator đã chạy thành công. TOC target được query và kiểm null, không phải event.target. Các assertion số lượng là gate cho specimen cố định, chủ ý fail khi spec đổi.
- Đã kiểm: fixture không có paragraph trùng hoặc example thiếu focus. Các nhận xét giả định cấu trúc tương lai chưa coi là lỗi hiện hành.

## Build cuối và giới hạn browser mới

- Sửa cuối chỉ chuẩn hóa mũi tên CTA đầu trang (path đầu mũi tên cách shaft7px đúng SVG nguồn). Typecheck/build và43/43 test route đã qua sau sửa cuối; test-grammar-document-body.log, typecheck/build-grammar-document-body.log.
- invariant-grammar-document-body.json:23 CSS nguồn/13 API/2 store không đổi/thêm/xoá. Không đổi dependency/lockfile.
- Production hiện port3001/session20728. Dừng server trước build; npm.cmd run build rồi npm.cmd run start -- --port 3001. Không chạy dev/build chung .next.
- Lượt browser kiểm lại sau sửa icon cuối bị từ chối: “Local browser use is disabled in Work settings”. Không tự kết luận nguyên nhân nằm ở setting của người dùng. **Ảnh build cuối sau icon chưa xác minh**, dùng ảnh trước đó chỉ trong đúng phạm vi và giữ gate pending.
- Browser bị chặn trước khi reset viewport/bypass ở các tab nghiên cứu. Khi khôi phục cần kiểm trạng thái, reset overrides/bypass và giữ tab local phù hợp. Không báo đã reset khi chưa thực hiện.

## Tiếp theo

1. Khôi phục browser và kiểm lại build cuối/viewport/cache; chưa được coi mất quyền browser là hoàn thành.
2. Word lookup nguồn đã khảo sát4 viewport, mũi tên/Enter/Escape: source/grammar/word-lookup*.html/json và shots/goal-word-lookup. Không bấm lưu từ nguồn. Local chưa triển khai popover này; dùng engine hiện hữu khi làm, không tự thêm thuật toán tra.
3. Tiếp tục Dashboard, các trạng thái hub, trang phụ/công khai/onboarding và khung học sâu theo ma trận toàn goal; không coi21 section mẫu đóng toàn bộ Ngữ pháp.

Ruling: tiếp tục dự án hiện hữu không Git bằng backup đã kiểm thay vì tạo worktree Git — theo chỉ dẫn người dùng. Ruling: dùng CUA/browser phiên hiện hữu thay fallback Playwright ngoài công cụ; browser hoạt động trong lượt rồi bị gate chặn, không tìm cách vượt gate.

## Kiểm tra bổ sung

Bộ kiểm hiện44/44 qua (test-grammar-document-structure.log). Ca mới đối chiếu21 section/thứ tự với spec nguồn, số example/formula/table/card mobile,6 nhãn node, route link luyện và footer. Test ban đầu thất bại do giả định thứ tự thuộc tính HTML, đã sửa parser regex theo từng thẻ; không đổi app để chiều test. Đây là kiểm SSR cấu trúc, không chứng minh tương tác/hình ảnh. Browser kiểm build cuối vẫn pending.
