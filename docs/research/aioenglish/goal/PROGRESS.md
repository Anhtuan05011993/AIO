# Goal triển khai toàn bộ UI

Trạng thái: active; browser đã khôi phục, chưa hoàn tất. Kế hoạch người dùng duyệt ngày 01/11/2026 là tiêu chuẩn nghiệm thu.

Mốc hiện hành02/11: [Cài đặt Giao diện/Quyền riêng tư/Tài khoản](SETTINGS-APPEARANCE-PRIVACY-2026-11-02.md). Production3001/session84033, build/typecheck45test qua; AGY22721 hoàn tất. Tám section/footer bbox delta0 cả4viewport sau sửa margin; revoke dialog delta0 cả4; preference persist/Escape/focus/export local đã kiểm tra. Chưa nghiệm thu avatar/GoalDialog, các trạng thái và toàn bộ ảnh. Browser khôi phục sau timeout download, tab mới hoạt động. Toàn goal active.

| Đợt | Trạng thái hiện tại |
|---|---|
| 1 AppShell/Gõ câu | Main cuộn riêng/menu mobile/palette đã QA production; còn tiện ích, logo/chuyển cảnh và các trạng thái còn lại |
| 2 Từ vựng/IPA | Browse/IPA UK/cá nhân cơ bản đã QA production 4 viewport; badge/dialog/US còn việc |
| 3 Video | Hub/mode/lucky/filter có QA production4 viewport; còn trạng thái bổ sung và nghiệm thu toàn bộ ảnh phần dưới |
| 4 Đọc & dịch/Từ điển | Hub/3 dialog/catalog A1,3 thư viện báo và Từ điển có QA production4 viewport; còn dialog lưu từ, autocomplete và ảnh phần dưới |
| 5 Dashboard/Ngữ pháp/Lộ trình | Map/panel và hai tab Ngữ pháp có QA production4 viewport; Ngữ pháp cốt lõi đã dựng12 thì/14 nhóm/51 chủ đề; còn trạng thái/ảnh phần dưới/Dashboard |
| 6 Trang phụ | Chờ đối chiếu và hoàn thiện |
| 7 Công khai/học sâu | Chờ hồi quy và đối chiếu |

Baseline: Node26.13.0, npm/npx11.20.0; typecheck pass. Lần HTTP đầu không có server nên ECONNREFUSED, không phải lỗi route. Khởi động lại production3001 để chạy baseline đúng.

Browser baseline trước khởi động lại: inventory bị feature gate từ chối. Ghi chú này đã được thay thế: ngày 01/11 kết nối Chrome browser 4 thành công sau người dùng khởi động lại máy; không còn coi browser là blocker.

Giữ CSS nguồn/API/store, không nội dung học/backend. AGY chỉ review code local bằng prompt, model gemini-3.8-flash-high effort high.

## Mốc hiện hành 02/11 — Hai tab Ngữ pháp

- Nguồn hiện hành tab cốt lõi có12 ô thì và14 nhóm/51 chủ đề, không có ô tìm kiếm riêng như UI local cũ. Đã thay lưới node/search chèn thêm bằng GrammarCore đúng cấu trúc nguồn. Metadata/vector tại ui-fixtures/grammar-core.json; không thay catalog/khóa học/API/store. Bằng chứng goal/source/grammar/core.html/core-columns.json.
- Đã khảo sát phân nhóm cột1/2/3/5; grammar-core-columns.json giữ nhóm liên tiếp đúng những bố cục đã quan sát, không chia đều theo số nhóm. Bốn viewport yêu cầu là3/1/1/1 cột. Các ngưỡng rộng trung gian vẫn cần kiểm chứng thêm trước nghiệm thu mọi breakpoint.
- Sửa CTA Tiếp tục/icon SVG/nền trắng, palette camdao ở root, cỡ chữ/padding/gap header mobile, line-height và spacing cuối chương. Nguồn selected row rgb(251,199,154), local đã khớp sau thêm accent. CSS nguồn giữ nguyên.
- shots/goal-grammar-core/production-final-metrics.json: header/bảng12 thì/nhóm đầu chênh0px ở1440×900,768×1024,390×844,360×844. path-final-metrics.json: header/A1 chênh0/1.125/0/0px. Không overflow. Các metrics trước sửa header mobile5px, lộ trìnhmobile6px và bảngthì0.14px đã bị thay thế. Bbox không chứng minh mọi chi tiết/ảnh phần dưới đã nghiệm thu.
- keyboard.json: ArrowLeft chọn Theo lộ trình, ArrowRight chọn cốt lõi; focus link chủ đề vẫn giữ khi đổi1440→768 (3→1 cột). Tab dùng roving tabindex. Còn QA cấp mở rộng, mọi trạng thái/ảnh phần dưới và các breakpoint rộng.
- Đã thêm /ngu-phap/chu-de/[topic]/hoc và /ngu-phap/tai-lieu/[topic] để102 link từ hub không404. GrammarTopicFrame là triển khai ban đầu của khung đã khảo sát, dùng metadata và tóm tắt có sẵn; Tiếp tục/chương đi tới player node hiện hữu, không viết lại thuật toán. **Chưa nghiệm thu khung học/tài liệu**: ảnh topic-frame-in-progress-1440.jpg đã xem, còn sai typography/padding/sidebar/meter và reader tài liệu cần khảo sát riêng. Test200/header không chứng minh giao diện khớp. Đây là việc bắt buộc tiếp tục, không chấp nhận frame chung như trạng thái hoàn thành cuối goal.
- AGY agy-grammar-core-review.txt hoàn tất. Không áp dụng claim4 cột ở1440/2 cột ở768: observer đo content1160/644, browser thực tế3/1. Parent cóh1, labels/state dựa fixture nguồn, các claim thiếuh1/ARIA đều cần ngữ cảnh trước khi coi lỗi. Đã bỏ wrapper display:contents để selector:first-child đúng và giữ focus sau reparent bằng lookup href/class. Chưa coi các suy đoán về throttle/SSR là lỗi đã xác nhận.
- Typecheck/build và43/43 route qua, gồm102 URL học/tài liệu chủ đề và unknown404 (test-grammar-core.log/build-grammar-core.log). invariant-grammar-core.json:23 CSS nguồn/13 API/2 store không thay. Backup .ui-goal-backup/grammar-core. Production3001/session40525 tại mốc này; chỉ một server.
- Tiếp theo: hoàn thiện đúng source khung học/tài liệu mới, QA các trạng thái Ngữ pháp còn thiếu, rồi tiếp tục Dashboard và đầy đủ đợt6–7/backlog các đợt trước. Goal active; không hoàn tất/không blocked.

## Mốc hiện hành 02/11 — Bản đồ chuyên đề

### Bổ sung sáu bản đồ cấp

#### Mốc panel và mobile hiện hành

- Thay thế UiDialog tối giản bằng PathNodePanel: region không modal trong khung map, desktop bên phải360px/mobile bottom max70%, header cấp/tiêu đề, body cuộn4 section và footer2 control. Không thay API/store. Nút Đã nắm chỉ mô phỏng trạng thái UI trong panel đang mở, không ghi tiến độ học hoặc giả vờ lưu máy chủ; cần rà toàn trạng thái tiến độ trước nghiệm thu toàn goal.
- path-node-summaries.json ~95KB chỉ trích phần trình bày từ167 lesson đã có, không import file exercise lớn vào hub. Hai mẫu A1/C2 lấy từ panel đã quan sát để so ảnh. Các mẫu khác tái dùng tóm tắt có sẵn; phần thiếu công thức/lưu ý dẫn sang bài học, không tạo thuật toán hoặc kho bài mới. Chưa nghiệm thu nội dung/chi tiết mọi node.
- shots/goal-path-panel/production-final-metrics.json: hai mẫu A1/C2×4viewport, panel/head/body/foot chênh0px. Đã sửa font18.7008px và letter-spacing normal để hết lệch xuống dòng390px. a1-metrics.json/a1-final-metrics.json cũ trước sửa spacing không dùng làm bằng chứng hiện hành. production-a1-1440.jpg đã xem trực tiếp.
- Đã hiệu chỉnh pose reset mobile theo hai số đo nguồn (client366/336) và thêm card264×96 ở viewport360, translateY(-10px) trong hệ tọa độ world. shots/goal-path-levels/production-final-metrics.json:24 trạng thái6 cấp×4viewport, frame/zone chênh0px, không overflow. comparison.json cũ ghi sai lệch38–46px đã bị thay thế. Chỉ kiểm chứng bốn viewport yêu cầu; không suy ra mọi chiều rộng trung gian đã được đo.
- production-interactions.json: Enter mở panel và focus region; toggle aria-pressed false→true; Escape đóng và focus trả đúng trail-part. Lần thử trước focusReturn=false đã được sửa bằng tìm lại node DOM sau khi đóng. Nguồn Escape đóng về BODY; local trả focus theo yêu cầu bàn phím của goal.
- AGY agy-path-panel-review.txt hoàn tất. Đã sửa tránh phục hồi focus về node cũ khi chuyển node và tôn trọng defaultPrevented của Escape; sửa thêm re-query nút trigger sau render từ lỗi browser thực tế. Không áp dụng claim done leak (parent key=node.id remount), nhãn responsive bị đọc đôi (display:none), hoặc autofocus sai (nguồn thực tế focus region). Không coi suy đoán AGY là lỗi đã xác nhận.
- Typecheck/build và42/42 route qua; build-path-panel.log/test-path-panel.log. Production3001/session86538 tại mốc này. invariant-path-panel.json:23 CSS nguồn/13 API/2 store không đổi. Chưa hoàn tất mọi trạng thái map/menu/kéo/zoom/offline, hồi quy dùng chung và Dashboard/Ngữ pháp/trang phụ/công khai/học sâu; goal active.

- Đã khảo sát A1–C2 và đợi đúng nội dung thay vì dùng snapshot lúc chuyển cảnh. Mỗi bản đồ chỉ có cấp được chọn:30/36/35/30/24/12 node. Bằng chứng goal/source/path-maps/levels-observed.json. Trước khi foreground/chờ nội dung, DOM vẫn chứa cấp cũ; các snapshot chuyển cảnh không dùng làm fixture.
- Asset local nay43 bản đồ (37 chuyên đề+6 cấp), giữ bản tổng A1→C2 cũ. PathKnowledge chọn cấp tải đúng geometry/nodes của cấp, không còn cuộn trong trail chung. Chỉ metadata/UI SVG, không bổ sung bài học/backend.
- shots/goal-path-levels/level-metrics.json:48 bản ghi nguồn/local×6cấp×4viewport, đúng số node và không overflow. comparison.json:desktop/tablet frame/zone trong4px; mobile còn sai scale/pose, khoảng38–46px ở zone. Không tuyên bố đạt pixel mobile hoặc hoàn tất đợt5. Ảnh current là bằng chứng sai lệch cần sửa, không là nghiệm thu.
- Đã đọc popup A1/C2 và lưu node-panel-a1.html/node-panel-c2.html. Nguồn dùng panel trong map (desktop bên phải/mobile phía dưới) với Giải thích/Công thức/Ví dụ/Lỗi hay gặp, Học bài này/Đã nắm. Local vẫn UiDialog tối giản: cần thay khung này, không coi thiếu content là lý do bỏ UI panel. Chưa bấm Đã nắm trên nguồn.
- Typecheck/build qua; log build-path-levels.log, test-path-levels.log; thêm test asset cấp chỉ chứa đúng cấp/số node. Production3001/session25875 tại mốc này. Backup PathKnowledge.before-level-assets.tsx. Các ghi chú cấp riêng còn dùng trail chung phía dưới đã bị thay thế; backlog mới là pose mobile/panel và mọi trạng thái chưa QA.

- Đã đọc trực tiếp37 bản đồ thì/ngữ pháp/cấu tạo từ qua UI nguồn. Bằng chứng goal/source/path-maps/observed.json và từng HTML map-world chỉ chứa hình học/nhãn trình bày. Không tải khóa học/transcript, không thay tài khoản nguồn.
- Thay notice khi chọn chuyên đề bằng asset JSON local tải riêng từng bản đồ. Cache/abort chống race; loading/lỗi/thử lại trung thực, không đổi API/store. Các bản đồ trình độ riêng vẫn cần đối chiếu thêm: hiện chọn cấp còn cuộn trong trail chung, chưa coi đạt yêu cầu.
- Tenses: tenses-final-metrics.json trong shots/goal-path-maps, source/production1440×900,768×1024,390×844,360×844; frame/root chênh0px, không overflow. Đã sửa header30px desktop/cỡ chữ mobile theo nguồn, CTA trắng/icon SVG, chiều cao tablet và row-gap mobile. tenses-metrics.json cũ trước patch đã bị thay thế.
- production-37-maps.json: mở37 chuyên đề qua control production, mọi bản đồ có leaves, không dialog thay thế. HTTP test mới kiểm37 asset/schema/no script, tổng41/41 qua. Không coi test HTTP là bằng chứng bàn phím hoặc pixel mọi bản đồ.
- AGY agy-path-maps-review.txt hoàn tất. Đã xác minh/sửa reset stale khi từ chuyên đề về trail, DOM timing chọn cấp sau render, resize chiều cao, role region, focus node ngoài khung, pointer-cancel/keyboard suppression, focus search/menu mobile và live status. Bác bỏ claim thiếu transform-origin/world dimensions (CSS đã có), hidden rail còn tabbable (display:none), race cache do unbatched React (abort guard đã có), thiếu focus return UiDialog (wrapper đã quản lý). Các nhận xét chưa kiểm chứng không được coi lỗi đã xác nhận.
- Typecheck/build qua; build-path-maps.log/test-path-maps.log. Production3001/session82819 tại mốc này. invariant-path-maps.json xác nhận23 CSS nguồn/13 API/2 store không đổi, không dependency mới. Backup .ui-goal-backup/path-maps.
- Còn bắt buộc: QA ảnh/chi tiết/kéo/zoom/focus/loading/error của các chuyên đề khác, menu mobile theo nguồn và bản đồ trình độ riêng/popup; hồi quy Dashboard/Gõ câu/một hub sau CSS dùng chung; toàn backlog các đợt1–7. Goal active, chưa nghiệm thu toàn website.

## Tiến độ review AppShell

AGY review đã kết thúc exit0. Đã xác minh và sửa: lọc disabled/tabIndex âm/control ẩn trong focus trap; xử lý Tab khi focus ở ngoài drawer; không trả focus về nút mở khi chọn nav; đóng drawer khi active thay đổi; main có tabIndex -1; khôi phục dataset.nbPage/feature kể cả khi trước đó không tồn tại. Backup .ui-goal-backup/AppShell.tsx. Typecheck pass. Chưa browser QA/build production cho patch này.

Không áp dụng suy đoán của review: useDemoUserSync là hàm subscribe không dùng hook primitives; ký hiệu tiện ích không đủ bằng chứng để tự thêm shortcut toàn cục. Các phần cần giao diện nguồn tiếp tục chờ browser. Lượt này có thay đổi code thực tế, goal vẫn active.

## 01/11 — khôi phục browser, tích hợp shell responsive

- Kết nối tab nguồn mới thành công. Đã quan sát lại Dashboard, Gõ câu, Từ vựng, dialog tạo từ và IPA; chỉ điều hướng/mở UI, không gửi form nguồn.
- Tách rail tablet 640–1023 từ go-cau-parity.css sang shell-responsive.css được AppShell import. Không còn phụ thuộc mở Gõ câu. Giữ interface/API/store/CSS nguồn.
- Sửa topbar mobile: icon lửa 16px thay vì bị selector logo kéo thành 136px; avatar và tên/cấp bố trí đúng hàng. Avatar dùng cùng fixture với sidebar. Logo tablet dùng viewBox gốc thu gọn 68 80 398 200; account tablet hiển thị avatar/chuỗi.
- Backup tại .ui-goal-backup/shell-20261101-214655 và BrandLockup.tsx. Typecheck pass, production build pass374 pages. Server production hiện3001. 31/31 route pass, log build-shell.log/test-shell.log.
- Đăng nhập tài khoản kiểm thử local qua UI thành công, chuyển /tong-quan; refresh duy trì phiên. Không lưu mật khẩu vào bằng chứng.
- Browser QA tablet: Gõ câu/Dashboard/Từ vựng rail x12,y14,w76,h996, bottom nav ẩn, không overflow. Drawer360: Shift+Tab vòng đến Cài đặt, Escape đóng và focus trả Mở điều hướng.
- Ảnh/metrics tại shots/goal-shell. Một số ảnh chụp ban đầu bị cắt/scale bởi capture surface, đã thay bằng explicit clip/fullPage sau đưa tab ra trước. Không dùng ảnh lỗi để chứng minh pixel. go-cau-metrics.json có viewport xác nhận; sai khác khối chính <2.2px nhưng KHÔNG coi toàn trang khớp: còn tiện ích, icon Ý tưởng, kiểu mũi tên/nút, 2px tablet và QA nhiều trạng thái.
- AGY CLI lần1 bị headless command permission từ chối; không bật skip permissions. Lần2 review snippet bằng prompt hoàn thành; nhận xét về fieldset/form/empty controls là tình huống không có trong drawer hiện tại, không áp dụng patch suy đoán. Kiểm chứng keyboard thực tế đã qua.
- Nguồn Từ vựng hiện có 3 link tab (Của tôi/Từ vựng/IPA), 11 thẻ gồm Của bạn+10 bộ; các chủ đề thuộc section đề xuất, không thuộc mục tiêu thi. Ghi chú cũ “hai tab” là thiếu link IPA. Dialog tạo có AI/tự thêm/nhập tệp; tự thêm chuyển tab cá nhân. Evidence DOM/CSS lưu goal/source; đây là markup nghiên cứu, chưa dùng làm fixture runtime nguyên khối.
- Tiếp theo: hoàn thiện Từ vựng/IPA theo evidence mới; cần đủ bốn viewport và production QA cho mỗi hub. Goal vẫn active, chưa nghiệm thu toàn bộ AppShell/Gõ câu.

## 01/11 — Từ vựng và IPA: triển khai và production QA

- Hub dùng đúng cấu trúc nguồn: ba link tab; ôn hôm nay với ba số; lane IPA; 11 thẻ đề xuất; nhóm IELTS/TOEIC/mở rộng. Fixture metadata và artwork tách riêng, không import kho khóa học lớn.
- IPA UK có 50 ô âm, bảng theo cặp/hàng, ba chặng, CTA và nút nghe độc lập. Thiếu nội dung/audio mở dialog. Giọng dùng hợp đồng store hiện tại. US có 46 ô và đã thử refresh local, nhưng metadata/biến thể US chưa đối chiếu nguồn, chưa nghiệm thu.
- Tab cá nhân có ba card, vòng tiến độ, bậc thang, thư viện rỗng, tìm/lọc/help và danh sách xem thử trong phiên. Ba card desktop khớp x/y/w/h nguồn. Toolbar/table còn lệch khoảng 29px chiều cao tổng, một số icon/màu chưa khớp. Chưa QA cá nhân ở cả bốn viewport.
- Dialog AI/thủ công/nhập tệp có state riêng, Tab/Home/End/mũi tên, validation, preview TSV và thông báo giới hạn local. Không gọi AI, import kho học hoặc backend mới. Dialog còn thiếu đối chiếu pixel và chi tiết tệp mẫu.
- Alias `/tu-vung/oxford-3000` và `/tu-vung/toeic-band-550-784` giữ truy cập bài hiện có. Thêm một test alias. 32/32 ca route qua. Test IPA bỏ React comment và script trước khi kiểm tra heading SSR.
- Typecheck và production build 374 trang qua. Log: `build-vocab-ipa.log`, `test-vocab-ipa.log`. Server production cổng 3001, session49683 tại thời điểm ghi. Prettier3.6.2 chạy tạm qua npm exec, không đổi dependency/lockfile.
- Bằng chứng `shots/goal-vocab-ipa`: nguồn/production 1440×900, 768×1024, 390×844, 360×844, kích thước ảnh đã kiểm tra. `comparison-summary.json`: browse/UK chart lệch khối chính 0px desktop/mobile, 2px tablet, không tràn ngang. Đây không chứng minh toàn trang khớp; tiện ích/nav/icon, dữ liệu tài khoản và trạng thái khác còn việc. Một số ảnh nguồn có logo đang chuyển cảnh, phải chụp lại khi nghiệm thu cuối.
- Đã sửa CTA IPA trắng viền tím, icon quay lại, selected nav Từ vựng #cdbff3 và icon tab tím. Hồi quy Dashboard/Gõ câu/Từ vựng360 không tràn ngang. Màu nav Trang chủ và widget chung vẫn cần đối chiếu ở đợt sau.
- QA tương tác production: End chuyển tab; AI text không lọt sang paste; validation khoảng trắng; sửa trường xóa lỗi; Escape đóng và trả focus. Nút nghe IPA mở notice và trả focus; US giữ sau refresh, đã khôi phục UK. Kết quả tại `interaction-checks.json`. Không lưu mật khẩu trong bằng chứng.
- AGY CLI gemini-3.8-flash-high/effort high rà dialog bằng source prompt và hoàn thành. Đã xác minh/sửa state AI/import dùng chung, reset input khi bỏ file, thiếu nút bỏ sheet, kiểm tra loại/kích thước tệp, lỗi cũ, CRLF/cột thiếu và keyboard tab. Không áp dụng suy đoán về form cha không tồn tại.
- Hash: 23 CSS nguồn, 13 API, 2 store so với backup không đổi. Bypass service worker tạm đã trả false; reload vẫn có CTA trắng/nav tím mới. Console quan sát chỉ có warning React DevTools shim từ phiên dev cũ; không suppress.
- Tiếp theo: đóng sai khác cá nhân/dialog, QA bốn viewport cho chúng; đối chiếu US mà không thay tài khoản nguồn. Sau đó Video/Đọc & dịch/Từ điển và các đợt còn lại. Goal active, chưa hoàn thành toàn đợt2.

## 02/11 — Từ vựng cá nhân: bảng thư viện và tương tác production

- Thay thế ghi chú cá nhân còn lệch 29px ở mốc trước: toolbar, bảng, empty state và ba card đã được chỉnh theo DOM/CSS nguồn; ảnh/số đo production tại `shots/goal-vocab-personal`. `production-metrics.json`/`comparison-summary.json` là bằng chứng hiện hành; `metrics.json` là baseline dev cũ, không dùng nghiệm thu hiện tại.
- Khối chính chênh 0px desktop/mobile, 2px theo trục y tablet; không overflow bốn viewport. Đây chỉ là kết quả khối được đo, chưa khẳng định toàn trang khớp.
- Thêm VocabLibraryToolbar, VocabPopover; tìm kiếm mở/đóng và Escape, inline tạo danh sách trong phiên local, bộ lọc ba nhóm và năm cấp. Help hiển thị nội dung giải thích nguồn trong UiDialog. Không thêm nội dung học/backend/store schema.
- AGY review code popover bằng prompt: `goal/agy-vocab-popover-review.txt`; đã xác minh và áp dụng giới hạn chiều cao popup theo viewport, ResizeObserver, primary pointer và xử lý Escape/focus. Không áp dụng suy đoán không có bằng chứng.
- Production browser QA đã qua: nhập tìm kiếm/Escape; tạo danh sách bằng Enter và status local; bỏ chọn nhóm/đóng Escape; chọn Cấp 2 aria-pressed=true, Escape trả focus Lọc theo cấp độ; help/Escape trả focus nút mở. Tab kiểm thử cũ không nhận thao tác; tab mới trên cùng production phản hồi đúng. Không kết luận nguyên nhân là code app. Cache/SW bypass tạm thời đã tắt lại.
- Typecheck pass; production build 374 trang pass; 32/32 route pass. Log `goal/build-vocab-personal.log`, `goal/test-vocab-personal.log`. Invariant `goal/invariant-vocab-personal.json`: 23 CSS nguồn/13 API/2 store không thay đổi. Backup `.ui-goal-backup/vocab-personal-2`.
- Còn bắt buộc: badge bộ lọc đang chọn, pixel dialog tạo/help, giọng US đối chiếu nguồn, trạng thái khác và phần shell chung. Không coi toàn bộ đợt Từ vựng hoàn tất.
- Video đã bắt đầu khảo sát trực tiếp; bằng chứng `goal/source/video/desktop.html`, `desktop.jpg`, `mine.html`. Phát hiện nguồn: Dán link YouTube chuyển sang `?tab=cua-toi` với form Thêm video, không mở dialog đơn giản như local hiện tại. Chưa gửi form nguồn. Cần sửa theo cấu trúc vừa quan sát, khảo sát filter/mode picker và bốn viewport.
- Production hiện cổng3001 (session54167 tại mốc này); goal active, các đợt tiếp theo vẫn còn việc.

## 02/11 — Video: triển khai thư viện, cá nhân và trạng thái

Trạng thái hiện tại: đã triển khai và đã QA production nhiều trạng thái; CHƯA hoàn tất toàn bộ đợt Video.

- Đọc trực tiếp nguồn: header, tìm kiếm, popup độ khó/30 chủ đề chia bốn nhóm, Khám phá, carousel19 gợi ý, sáu video nổi bật/sáu bài mới, 26 kênh, danh mục trang24 thẻ, form cá nhân và hộp chọn bốn chế độ. Chỉ mở UI/điều hướng/tìm lọc, không gửi form nguồn hay học bài.
- Tạo VideoHeader, VideoSearchToolbar, VideoLibrary, VideoResults, VideoFilters, VideoAddPanel, VideoModePicker. Fixture `video-catalog.json`, `video-art.json`, `video-modes.json`, `video-topics.json` chỉ metadata/artwork. Tags lọc trong catalog là fixture local minh hoạ, không khẳng định phân loại nguồn; số lượng/trang mẫu khác kho trực tiếp.
- Luồng Dán link chuyển `?tab=cua-toi` đúng nguồn; form URL kiểm tra host/videoID, lỗi inline và thông báo rõ chưa có xử lý phụ đề/backend. Không tải transcript/khóa học. Danh mục có tìm/lọc, trang24 thẻ và điều hướng trang; kênh mở kết quả theo kênh. Bắt đầu/thẻ/ngẫu nhiên mở chọn Dictation/Shadowing/Quiz/Subtitles; chỉ sau Bắt đầu học mới báo thiếu nội dung.
- `/video?tab=cua-toi` render form ngay từ server bằng searchParams; có ca regression cho lỗi nháy sai tab trước hydration. Giữ tham số query không thuộc tab khi đổi tab; đóng popup khi đổi tab hoặc popstate.
- Keyboard production đã thử: lọc C1–C2 ra rỗng; reset trả focus Tất cả; chọn chủ đề Thiếu nhi ra ba thẻ mẫu; Escape trả nút lọc. Phân trang đến cuối trả focus heading và disable Tiếp; tìm Volka sau đổi trang về trang1. Mode End chọn Subtitles, Bắt đầu học hiện notice, Escape trả Bắt đầu. Carousel video và kênh cuộn được. URL sai host ra lỗi; youtu.be hợp lệ ra thông báo local, không gửi API mới.
- AGY: `agy-video-add-review.txt`, `agy-video-state-review.txt`. Áp dụng góp ý đã xác minh về URL /watch/ và /live/, focus sau lỗi/reset/pagination, live region/quota, đóng popup theo tab. Nhận xét stale page đã được chặn bằng key theo bộ lọc; claim hydration mismatch không đúng cơ chế React, nhưng flash tab được sửa SSR. Không tự áp dụng các suy đoán về tools/focus trap; wrapper sẵn có đã quản lý Escape/focus.
- Evidence nguồn `goal/source/video`; ảnh `shots/goal-video`. So sánh mới nhất trước patch khoảng cách popup: `browse-comparison.json` khối chính desktop0px, tablet2px, mobile0.7031px, không overflow. Đã bỏ wrapper artwork thừa (nguyên nhân header carousel cao6px), đúng cấu trúc nhúng nav vào header (trước thiếu40px kênh mobile).
- Video cá nhân `mine-metrics.json` trong `goal/source/video`: khối chính desktop/mobile0px, tablet2px ở mốc đã kiểm tra. Các ảnh mine trước khi sửa icon/disabled style cần chụp lại nếu dùng làm nghiệm thu bản cuối.
- Popup lọc360 trước patch: nguồn x8/y171.5/w344/h595; local x8/y167.5/w344/h668.5. Đã thêm tuỳ chọn gap/mobileBottomInset vào VocabPopover (default giữ8/0), Video dùng12/70 để chừa bottom navigation; bỏ padding thừa. Typecheck qua; build mới đang chạy, cần xác minh số đo/focus và regression popup Từ vựng sau build.
- Build/typecheck gần nhất trước patch popup qua; 33/33 route qua (`test-video-library.log`). Log build hiện hành `build-video-library.log`. Invariant `invariant-video.json`: 23 CSS nguồn/13 API/2 store không thay. Không đổi lockfile/dependency. Backup ` .ui-goal-backup/video` có VideoHub, page baseline và VocabPopover trước tuỳ chọn.
- Còn bắt buộc: QA pixel popup/mode picker/danh mục ở đủ bốn viewport, ảnh phần dưới nguồn bằng cuộn UI (nguồn có vùng cuộn riêng; fullPage nguồn chỉ ra viewport), trạng thái loading/error, direct lucky query, đối chiếu footer/tiện ích/nav thuộc shell. Không dùng ảnh source viewport đặt tên full làm bằng chứng full page. Các nhóm sau Video vẫn chưa triển khai; goal active.

### Xác minh cuối mốc Video 02/11

- Thay thế các ghi chú trước patch popup: build/typecheck cuối đã qua; production hiện cổng3001, session62577. `test-video-library.log`: 33/33 pass. `invariant-video.json` đã kiểm cả tập file hiện hành: 23 CSS nguồn/13 API/2 store, không file thêm/đổi/xoá trong các phạm vi đó.
- Popup lọc360 sau patch: x8/y171.5/w344/h594.5; nguồn x8/y171.5/w344/h595. Ảnh `source-filters-360.jpg`/`production-filters-360.jpg`, metrics `filter-360-metrics.json`. Đã xem hai ảnh; còn chênh chi tiết nhỏ, chưa coi đủ QA popup bốn viewport. Popup Từ vựng default vẫn320×249.296875, được thử lại production.
- `shots/goal-video/browse-comparison.json`: desktop0px, tablet2px, mobile0.7031px cho khối chính, không tràn ngang. Các mốc mobile lệch6/40px trước đó đã bị thay thế. Đã xem ảnh desktop/mobile; vẫn còn khác biệt shell/nav/tài khoản/tiện ích và chưa QA toàn bộ dialog/trạng thái.
- Đã chụp lại Video cá nhân bốn viewport trên bản cuối ở `shots/goal-video/production-mine-*.jpg`, metrics tại `mine-metrics.json`. Hai ảnh mobile ban đầu của lần chụp lại bị focus input cuộn86px, đã bỏ và chụp lại từ vị trí đầu trang bằng link logo; không dùng số đo lệch cuộn để kết luận layout.
- FullPage nguồn chỉ trả viewport do vùng cuộn riêng; ảnh đổi tên `source-browse-viewport-360.jpg`, không dùng làm bằng chứng toàn trang. Ảnh toàn tài liệu local chỉ tham khảo cấu trúc; cần thêm ảnh nguồn/local phần dưới bằng cuộn UI trước khi nghiệm thu toàn trang.
- Goal vẫn active. Tiếp theo: đóng QA dialog/popup/danh mục Video, trạng thái loading/error và lucky query, rồi sang Đọc & dịch/Từ điển; giữ backlog Từ vựng/US và shell trong ma trận đầu tài liệu.

## 02/11 — AppShell cuộn riêng, menu mobile và dialog Video

- Thay thế các ghi chú lệch2px tablet ở mốc trước: AppShell nay dùng main làm vùng cuộn, document không còn scrollbar riêng. Padding desktop16/10/40/22, tablet14/6/36/18, mobile0/12/93; topbar mobile nằm trong main và cuộn theo nguồn. Footer chỉ Dashboard sau khi khảo sát11 hub/trang phụ. Fourth quick link là module đang xem; Menu chứa7 mục còn lại.
- Menu mobile bảng trượt đáy555px tại390/360×844; account126px,7 hàng52px. Escape trả focus Menu; Shift+Tab từ link đầu đến Cài đặt; resize1024 đóng và focus main; kéo handle xuống đóng. Đã sửa trap khi container được focus và inert các control ngoài sheet. Palette nav lấy từ nguồn, tách fixture khỏi tài khoản.
- UiDialog bổ sung sourceStyle/className/initialFocusRef dạng optional, giữ default. Click padding dialog không đóng nhầm. Picker Video có data-nb-picker, focus radio đầu, footer và vị trí45vh nguồn. Dialog production bốn viewport có bbox khớp0px:1440(464,217.75,512,374.5),768(128,273.546875,512,374.5),390(16,107.609375,358,544.375),360(16,107.609375,328,544.375). Ảnh và số đo tại shots/goal-video-dialog.
- Lucky query SSR mở picker, mount tiêu thụ lucky/tab và giữ hash/query khác. Link ngẫu nhiên có href thật. Thêm ca route thứ34. Typecheck/build cuối qua;34/34 route qua. Production cổng3001/session46450 tại mốc này. Log build-shell-video.log/test-shell-video.log.
- Bộ lọc Video đo sau khi source pop-enter kết thúc: desktop/tablet0px; mobile h594.5 so nguồn595, x/y/w khớp. stable-filter-metrics.json cùng ảnh source/production ở shots/goal-video. Đo cũ trong transition .94 không dùng nghiệm thu. Ảnh filter có background catalog nguồn/browse local khác state; chỉ dùng so popup, không chứng minh cả trang.
- Hồi quy Dashboard/Gõ câu/Video cả4 viewport: main khớp nguồn, document đúngviewport và không tràn ngang; production-metrics.json/12 ảnh tại shots/goal-shell-scroll. Menu production390/360 bbox0px. Chưa kết luận toàn shell khớp: logo chuyển cảnh nguồn, tiện ích/topbar chi tiết, palette tất cả selected route và trạng thái khác còn QA.
- AGY video-dialog review đã xác minh các ý liên quan backdrop/hash/StrictMode; không áp dụng suy đoán focus default vì browser Vocab help Escape trả focus đúng. Shell-scroll review cũ được đưa code trước survey đầy đủ, nhận xét footer/quick-slot bị thay thế bởi khảo sát7 trang sau đó. Review sheet mới đang chạy, chưa coi là kết quả hoàn tất.
- Hash invariant-shell-video.json kiểm union file hiện hành/backup:23 CSS nguồn,13 API,2 store không thêm/đổi/xoá. SW/cache bypass đã tắt lại; reload vẫn hiện menu/palette mới. Console log còn lỗi hydration từ dev cũ có diff data-sharkid do extension; chưa thấy bằng chứng lỗi production mới, cần theo dõi theo timestamp thay vì suppress.
- Đọc & dịch đã khảo sát hub và ba dialog AI/paste/press, lưu DOM/CSS/ảnh source trong goal/source/reading và shots/goal-reading. Chưa thay code hub này tại checkpoint. Tiếp tục triển khai Đọc & dịch/Từ điển, giữ toàn bộ backlog của ma trận. Goal active, chưa hoàn tất.


## 02/11 — Đọc & dịch: hub, ba dialog và thư viện chủ đề

- ReadingHub không còn import ARTICLES để dựng hub. ReadingHubView dùng cấu trúc/asset đã quan sát: dịch câu, cặp gợi ý/bài đã chấm,3 tờ báo và bài cá nhân. Generator derive-reading-hub.py chuyển markup nghiên cứu thành JSX tường minh, SVG tĩnh tách reading-art.json; không nhúng danh tính/phiên nguồn hoặc dữ liệu khóa học.
- Các scope CSS mới từ nguồn nằm trong custom/reading-reference.css, original src/styles/source không sửa. Đã sửa empty-state CSS hiện hành để khối mine hết chênh4–8px; CTA gợi ý trắng theo nguồn. UiDialog sourceStyle có nền#fbf6e7 và backdrop45%/blur8px; default dialog giữ nguyên.
- Ba dialog AI/paste/press có layout, chọn cấp/độ dài, chủ đề Enter/xoá, tăng/giảm textarea bằng drag/phím, counter, disabled/validation và notice local trung thực. Không gọi AI/backend giả. Bản input/trường lỗi có ARIA; dropdown giữ focus combobox, Home/End/arrows/Enter/Escape/Tab; IME Enter không chốt chủ đề khi đang composition.
- Thêm /luyen-dich-thuat/chu-de/[[...topic]], level SSR/query cap=all/a1…c1 và12 topic. Metadata28 thẻ Du lịch từ UI nguồn, không nội dung học; nhóm khác hiện tái dùng metadata mẫu nên chưa nghiệm thu data presentation riêng từng chủ đề. Frame /tung-cau/[id] có quay lại/trạng thái thiếu nội dung, chưa đối chiếu khung học sâu hoàn chỉnh.
- QA production: hub6 khối/bốn viewport bbox0px; cả3 dialog/bốn viewport bbox0px. Catalog A1 header/topics/list bbox0px; không overflow. Ảnh/số đo tại shots/goal-reading, production-comparison.json, production-final-dialogs.json, production-catalog-metrics.json. Ảnh không thay thế nghiệm thu mọi trạng thái: control/dropdown details và metadata ngoài Du lịch còn QA. Ảnh catalog1440 ban đầu chụp ngay resize bị sidebar chưa paint đã chụp lại sau UI ổn định.
- Browser kiểm: C2 bằng End/Enter, Tab từ list tới Độ dài, validation AI trống, Escape trả focus Tạo bài bằng AI; All chuyển28 row và refresh giữ query/28 row. Chặn /api/* local vẫn hiện hub8 section và không overflow; đã bỏ chặn. Không submit form nguồn.
- AGY reading-dialog review hoàn tất: đã xác minh/sửa label wrapper,list focus,Home,layout-effect đo popup,scroll-dismiss,IME,describedby và URL trang chủ thiếu đường dẫn. Không coi initial focus container là lỗi: nguồn cũng focus container; disabled trống đúng nguồn. Review sheet: modal semantics nằm ở parent, drag setState batching không gây snap được quan sát; đã bổ sung tên link avatar và role group stats, không áp dụng giả định button trước link vốn không tồn tại.
- Typecheck/build qua;36/36 route qua gồm direct catalog A1/all và3 learning entry frame. Log build-reading-hub.log/test-reading-hub.log. Có một warning key trong log dev trước patch; cần theo dõi console hiện hành, không suppress. Phạm vi test36 ca không chứng minh mọi link đã hoàn tất.
- Bắt buộc tiếp theo: dựng /bao/[paper] theo press-guardian.html/press.css/press-card.css đã khảo sát (hiện các link tờ báo từ hub chưa có route tương ứng, còn404); tìm/filter/pagination/ảnh gốc và dialog nhập báo ở thư viện. Sau đó Từ điển, các trạng thái và toàn bộ đợt5–7. Không dùng notice thay thư viện báo. Goal active.

### Xác minh bản cuối của mốc Đọc & dịch

- Production hiện tại cổng3001/session54532; typecheck/build cuối và36/36 route qua. Invariant-reading-hub.json:23 CSS nguồn/13 API/2 store không thay đổi.
- Đã chụp lại catalog4 viewport sau sửa SVG trực tiếp (bỏ wrapper làm mất selector child) và chữ Chưa làm13px; bbox các khối không đổi0px. Dialog ảnh production cuối có nền#fbf6e7, select#fffaf0, scrim blur8px; các bbox vẫn0px so nguồn. production-final-dialogs.json và production-catalog-metrics.json là bằng chứng hiện hành.
- Cache/SW bypass đã tắt, reload vẫn có màu/blur mới. Viewport/CDP overrides đã reset; để tab local /luyen-dich-thuat cho người dùng xem. Không giữ tab nghiên cứu làm đầu ra.
- Console lịch sử còn hydration data-sharkid từ extension ở dev, RSC dev/prod mismatch khi đổi loại server trên tab đang mở, và key warning trước chỉnh catalog; không thấy log mới trong lần reload production cuối. Đây không phải chứng minh console mọi route đều sạch; tiếp tục phân loại theo thời điểm khi nghiệm thu cuối.
- Review sheet đã bổ sung role group cho stats và tên link avatar; geometry unchanged. Các thư viện báo /bao/[paper], dữ liệu trình bày từng topic, Từ điển và backlog toàn goal vẫn chưa hoàn tất.

- Cần điều tra thêm hiện tượng ảnh sidebar trắng sau một số điều hướng/resize dù DOM có13 link, display/opacity/rect và hit-test bình thường. Click lại link đang active làm ảnh sidebar hiện đầy đủ; ảnh production-hub-1440 cuối đã được xác minh đủ rail. Chưa kết luận là capture/compositor hay app; không dùng các ảnh trắng làm bằng chứng shell đạt. Hiện tượng này là backlog QA bắt buộc trước nghiệm thu toàn goal.


## 02/11 — Ba thư viện báo: triển khai và kiểm chứng production

- Thay thế ghi chú /bao/[paper] còn404 ở mốc trước: Guardian, Conversation, Atlantic có route thật. Thư viện dựng theo source UI với header/tìm kiếm/chủ đề, hero,12 card và phân trang. Các article href có frame thiếu nội dung và quay lại, không404; chưa nghiệm thu khung học báo sâu. Không tải nội dung bài báo.
- Fixture press-papers.json chỉ chứa metadata39 mẫu (hero+12 card mỗi báo), decoration; press-paper-topics.json chứa11 chủ đề/số đếm riêng từng báo. Đã tải39 thumbnail gốc vào public/assets/aioenglish/press và kiểm tra ảnh đọc được bằng PIL. Không tạo ảnh thay thế.
- Source CSS chỉ sao scope quan sát vào custom/press-reference.css, custom/press-parity.css. Đã sửa margin h1 bị reset (nguyên nhân desktop/tablet lệch7.921875px), font Newsreader của heading, placeholder short/long, CTA trắng viền xanh và icon nhập link. Các ảnh dev trước patch có CTA vàng/font Bricolage không là bằng chứng hiện hành.
- Production source/local cả3 báo×4viewport: header/hero/grid/pager chênh0px, không overflow. Bằng chứng shots/goal-press/production-metrics.json, comparison.json và ảnh source-/production-the-*.jpg. CTA đã xác minh rgba(255,255,255,.92) sau patch !important có scope; xem ảnh bản cuối. Khớp bbox không chứng minh mọi chi tiết/tất cả trạng thái.
- Popup chủ đề Guardian4viewport: root bbox0px sau chỉnh gap12/border2 transparent. production-filter-metrics.json và source-/production-filters-*.jpg. VocabPopover chỉ thêm optional accent/className, defaults cũ giữ nguyên; Press dùng bacha/ui-press-pop. Reset disabled được chỉnh màu/opacity theo nguồn; cần ảnh bản build cuối sau chỉnh nhỏ này.
- UI local/production đã thử: chọn chủ đề, Escape trả focus trigger; phân trang5→7→8 bằng Enter, Back về7; trang8 vẫn có aria-current; tìm không có kết quả và xoá bộ lọc; URL không thuộc3 báo ra lỗi, URL hợp lệ chỉ báo chưa kết nối dịch vụ; Escape dialog trả focus press-import-open. Chặn /api/* local vẫn có12 card, đã bỏ chặn. Không submit form nguồn.
- AGY review agy-press-review.txt hoàn tất. Áp dụng lỗi đã xác minh: chữ Đ slugify, whitespace, debounce history250ms, push pagination/filter, window trang quanh active, bỏ ellipsis liền kề, key theo query server và live region. Không áp dụng claim Next history API không đồng bộ hooks; wrapper VocabPopover đã có focus return, main thực sự là vùng cuộn. Các điều này đã được xác minh trong code/browser, không lấy review làm bằng chứng tự đủ.
- Typecheck/build và39/39 route qua (build-press.log/test-press.log). Ba test mới kiểm3 thư viện/thumbnails, empty/directpage8 và frame bài thiếu nội dung. Invariant-press.json:23 CSS nguồn/13 API/2 store không thêm/đổi/xoá. Không dependency mới/không đổi store/API/schema.
- Giới hạn fixture: các trang sau dùng lại metadata mẫu, không bổ sung kho bài. Gallery phần dưới, mọi filter ở2 báo còn lại, keyboard/focus các trạng thái còn lại và khung đọc sâu chưa nghiệm thu đầy đủ. Tiện ích/topbar/account động và hiện tượng sidebar trắng trong một số capture vẫn thuộc backlog shell.
- Từ điển đã đọc trực tiếp trạng thái ban đầu và /tu-dien?q=apple. Source có search combobox, nghĩa chính, UK/US IPA, nhóm nghĩa/accordion, cụm từ/họ từ/đồng-trái nghĩa; local hiện là grid đơn giản. Bằng chứng goal/source/dictionary/{initial,apple}.html và entry.css/hub.css. Mục từ ban đầu thay đổi (lest/adrenaline), dùng fixture cố định khi QA, không dùng dữ liệu live để kết luận lệch layout. Chưa sửa DictionarySearch. Tiếp theo triển khai Từ điển, giữ engine tra/speak hiện hữu; sau đó đóng backlog và các đợt5–7. Goal active.

- Bổ sung khảo sát Từ điển: initial.html đã chờ region Một từ trong kho ổn định (adrenaline ở lần này). suggestions.html ghi8 lựa chọn app/apple/apply/appear/approach/appearance/appointment/applaud cho prefix app. Không submit form nguồn, không nhấn bookmark vì chưa có bằng chứng hành động đó chỉ mở UI. Cần khảo sát save dialog theo cách bảo đảm không đổi tài khoản nguồn.

- History press được bổ sung flush URL tìm kiếm còn chờ trước khi push filter/page, tránh Back về state cũ khi thao tác nhanh trong250ms. Typecheck đã qua; build cuối đang được xác minh. Không thay thuật toán học/API/store.

### Chốt production thư viện báo

- Build cuối/typecheck qua;39/39 test qua. Server production cổng3001/session27233. Cache/SW bypass đã tắt, reload giữ CTA trắng; CDP viewport overrides đã reset. Tab local Guardian được giữ làm đầu ra.
- production-interactions.json/rapid-history.json ghi kiểm tra production: trang8/Back7, empty/reset, disabled reset opacity.5, topic pressed/Escape focus trigger; thao tác tìm memory rồi lọc ngay và Back giữ q=memory/inputmemory. Đây thay cho phần còn chờ kiểm ở ghi chú trước.
- Reset disabled đã kiểm trên build cuối, ảnh production-filters-360.jpg đã cập nhật. Bản cuối production-the-guardian-390.jpg là ảnh bàn giao. Các ảnh nguồn/local dùng tài khoản khác nhau và tiện ích khác nhau; chưa nghiệm thu toàn bộ shell hay khung bài sâu.
- Source khảo sát Từ điển đã đủ initial/apple/suggestions và CSS để bắt đầu; DictionarySearch chưa đổi. Các nhóm còn lại của kế hoạch vẫn bắt buộc. Goal active, không hoàn thành/không blocked.


## Checkpoint mới nhất02/11 — Khung học Ngữ pháp

Xem [checkpoint đầy đủ](GRAMMAR-TOPIC-CHECKPOINT-2026-11-02.md): khung overview/drawer/TOC mẫu và đầu tài liệu có QA4 viewport;43/43 route qua. Thân tài liệu còn thiếu kiểu bảng/công thức/ví dụ/callout; các trạng thái/chủ đề khác chưa nghiệm thu. Server production3001/session8368; hash CSS nguồn/API/store không đổi. Goal active.


## Mốc renderer tài liệu, mới nhất02/11

Xem [checkpoint](GRAMMAR-DOCUMENT-BLOCKS-CHECKPOINT-2026-11-02.md). Ba mẫu mới và4 section đầu dùng renderer chung.12 case ảnh production, bbox tối đa1.421875px sau khi căn cùng trạng thái capture; mistakes desktop có lưu giới hạn cuộn vì thân dưới chưa đủ.43 test qua, hash nguồn/API/store không đổi. Server3001/session42056.14 section còn thiếu, word lookup/audio và các đợt khác tiếp tục bắt buộc.


## Mốc thân tài liệu, mới nhất02/11

[Checkpoint đầy đủ](GRAMMAR-DOCUMENT-BODY-CHECKPOINT-2026-11-02.md):21 section/kiểu khối, footer, provenance; cảnh báo key xử lý không suppress. Production3001/session20728. Build/typecheck43 test qua, invariant nguồn/API/store không đổi. Ảnh kiểm4 viewport ở shots/goal-grammar-document-body; khác biệt chiều cao do fixture được ghi riêng, không tuyên bố cả reader khớp. Browser gate mới chặn kiểm sau icon cuối; word lookup và toàn backlog vẫn cần tiếp tục.

### Bổ sung kiểm tra cấu trúc tài liệu

44/44 ca qua trong test-grammar-document-structure.log. Ca mới kiểm21 section đúng thứ tự spec nguồn, số example/formula/table/mobile-card,6 nhãn node và link footer. Lỗi lần đầu là regex test giả định thứ tự thuộc tính href/data-testid; đã sửa test theo HTML hợp lệ, không đổi UI để chiều test. Không thay thế QA ảnh hoặc kiểm tương tác browser; gate browser từ checkpoint trước vẫn pending.

## Tra từ tài liệu — triển khai local, chưa nghiệm thu browser

[Chi tiết](GRAMMAR-WORD-TAP-IMPLEMENTATION-2026-11-02.md): đã nối word tap/roving keys/popover vào ví dụ tài liệu, engine dictionary và speech giữ nguyên, lưu từ chỉ notice rõ giới hạn local. Typecheck/build44 test qua; nguồn/API/store invariant không đổi. Production3001/session74740. Browser gate còn chặn; ảnh/bbox/focus/Escape mới chưa kiểm. AGY session9091 đang chạy; cần poll và xác minh review. Learner overview chưa nối, không coi toàn reader hoàn thành.

### Review word-tap đã xử lý

AGY session9091 đã exit0. Đã đối chiếu code, sửa aria-controls/roving text updates/phrasing separator và gom scroll measurements bằng rAF; Tab vào popup và focus-out dismissal đã triển khai nhưng chưa browser QA. Không ép popover thành modal hoặc bỏ max-height vốn đã có. Chi tiết trong GRAMMAR-WORD-TAP-IMPLEMENTATION-2026-11-02.md. Typecheck qua; production rebuild đang chạy, cần kiểm kết quả trước nghiệm thu.

Chốt build sau review word-tap: typecheck/build qua,44/44 test qua; production3001/session86134. Invariant nguồn/API/store không đổi. Không nghiệm thu UI mới khi chưa có browser QA.

### Learner overview dùng chung tra từ

Đã nối GrammarWordTap vào3 ví dụ Tổng quan, giữ màu text-primary và text/VI/line-height hiện hữu. Guard Enter cấp trang bỏ qua role=button đã có. Typecheck/build/44 test qua; nguồn/API/store hash không đổi. Production3001/session72121. Browser gate vẫn pending cho ảnh/focus/Enter/neo; không nghiệm thu tương tác chỉ từ SSR. Các đợt6–7 và backlog Dashboard/hub vẫn nguyên phạm vi.

## Cài đặt/Bạn bè keyboard local

Xem SECONDARY-KEYBOARD-2026-11-02.md. Đã thêm roving tabindex và Arrow/Home/End cho radiogroup/tablist, giữ class/layout/store. Typecheck/build44 test qua, nguồn/API/store invariant không đổi. Production3001/session90913. Browser QA và tabpanel semantics còn pending. AGY33264 đang chạy, cần poll/review trước chốt. Evidence nguồn lịch sử01/11 đã tìm thấy ở shots/ui-completion, không coi thay khảo sát hiện tại.

### Panel Bạn bè đã liên kết ngữ nghĩa

useId/aria-controls/aria-labelledby và role=tabpanel/tabindex0 đã bổ sung. Typecheck/build45/45 test qua; ca mới kiểm SSR quan hệ tab/panel, không kiểm keyboard browser. Invariant nguồn/API/store giữ nguyên. Production3001/session17747. AGY33264 được poll lại và vẫn live, file output chưa có; chưa kết luận review. Browser lần kiểm mới vẫn bị gate từ chối, ảnh/keyboard pending.


### Rà soát keyboard và evidence nguồn lịch sử

AGY33264 đã exit0; guard modifier bổ sung tránh chặn Alt+Arrow, type=button tường minh. Panel đã có từ lượt trước. Chỉ mục historical-source-evidence-index.json định vị15 nhóm nguồn cũ, phần lớn chỉ1440/768/390; thiếu360 và trạng thái khác. Không dùng chỉ mục để đánh dấu QA hoàn tất.

Chốt modifier guard: build/typecheck và45/45 test qua, invariant nguồn/API/store không đổi. Production3001/session31722. AGY33264 hoàn tất; chỉ browser interaction/ảnh chưa xác minh. Không thu hẹp goal hoặc nghiệm thu trang phụ từ SSR.


## Blocker kiểm chứng UI

Xem [audit blocker](BROWSER-BLOCKER-2026-11-02.md). Gate CUA Chrome4 còn từ chối ở lượt kiểm mới, cùng blocker lặp nhiều lượt. Review AGY đã hoàn tất, build/test/hash đã chốt; việc tiếp theo cần nguồn/local browser. Goal giữ đầy đủ phạm vi, không đánh dấu complete; cần khôi phục kết nối để làm QA và các đợt còn lại. Không lặp build/test khi code không đổi.


## Kết nối đã khôi phục

BROWSER-RESUMED-2026-11-02.md thay audit blocker trong phạm vi kết nối. Không reset tiến độ goal. Có bằng chứng source/local popup4viewport và keyboard thực; còn states/popups nhúng/layout phụ và các đợt khác.


## Cài đặt khung nguồn

Xem SETTINGS-FRAME-2026-11-02.md và shots/goal-settings-frame. Có ảnh4viewport và sai khác còn lại cụ thể. Giữ alias profile/friends/... cùng ID nguồn; store/API không đổi. AGY74078 pending; không nghiệm thu toàn Cài đặt.

Chốt Cài đặt frame sau review AGY: build/typecheck45 test qua; production3001/session11882. Hash nguồn và alias cũ đã kiểm browser, ảnh390 cập nhật, viewport reset. Các ghi chú AGY74078 đang chạy đã được thay bởi review hoàn tất trong SETTINGS-FRAME-2026-11-02.md. Bạn bè/Trình độ và các form khác vẫn chưa khớp, goal active.
