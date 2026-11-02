# AIO English — clone giao diện Next.js

Dự án tái hiện aioenglish.com bằng Next.js 15, React 19 và TypeScript. Đợt 01/11/2026 hoàn thiện hub và tương tác frontend; không bổ sung kho khóa học/backend.

## Chạy trên Windows

Đã cài Node **26.13.0 LTS**, npm/npx **11.20.0** theo tài khoản tại `%LOCALAPPDATA%/Programs/nodejs/node-v26.13.0-win-x64`. Mở terminal mới để nhận User PATH; runtime Codex giữ nguyên.

```powershell
node --version
npm.cmd --version
npx.cmd --version
npm.cmd ci
npm.cmd run dev -- --hostname 127.0.0.1
```

Mở `http://127.0.0.1:3000`. Với terminal cũ, thêm đường dẫn trên vào PATH phiên hoặc gọi npm.cmd bằng đường dẫn đầy đủ.

```powershell
npm.cmd run typecheck
npm.cmd run build
npm.cmd run start -- --hostname 127.0.0.1
npm.cmd run test:ui
```

`test:ui` cần server đang chạy; đặt `AIO_TEST_URL` để đổi địa chỉ.

## Các màn hình

- `/`: landing khi chưa có hồ sơ local, dashboard khi có hồ sơ. `/tong-quan` giữ làm alias.
- `/chao-mung`: onboarding năm bước; sửa hồ sơ tại `/cai-dat`.
- Hub: `/go-cau`, `/tu-vung`, `/ngu-phap`, `/lo-trinh`, `/video`, `/luyen-dich-thuat`, `/tu-dien`.
- `/tu-vung/phat-am`: ba nhóm và 50 âm IPA; chưa có phiên luyện âm.
- Trang phụ: `/ban-be`, `/profile`, `/@handle`, `/cai-dat`, `/yeu-cau-tinh-nang`, `/luyen-thi`.
- Công khai: `/auth/login`, `/auth/register`, `/auth/forgot`, `/phap-ly/**`.
- Phiên học sâu có sẵn được giữ. Mục thiếu dữ liệu mở **Nội dung chưa được bổ sung** thay vì 404.

## Dữ liệu và cấu trúc

API backend/schema store hiện hữu giữ nguyên; login/register/progress vẫn dùng cơ chế cũ. `src/lib/ui-fixtures` chứa bảng hạng tháng riêng, metadata 12 video, IPA, SVG điều hướng/trang trí. Không đổi nhãn dữ liệu XP tuần thành tháng. Ý tưởng/tùy chọn mới lưu trên máy, không gửi tới aioenglish.com. Thao tác cần nội dung/backend ngoài phạm vi có thông báo giới hạn.

- `src/components/sites/aioenglish`: component theo khu vực.
- `src/styles/source`: CSS nguồn giữ nguyên.
- `src/styles/custom/fidelity.css`: sửa giao diện/responsive.
- `src/lib/store`: hợp đồng auth/progress cũ.
- `public/sites/aioenglish`: asset local, đầu linh vật vector tái sử dụng từ nguồn.
- `_agent-scripts/ui-routes.test.mjs`: 43 ca HTTP/route ở mốc Ngữ pháp.
- `docs/research/aioenglish/shots/ui-completion`: ảnh nguồn/local và ma trận viewport.

Backup trước sửa: `.ui-backup-2026-11-01/`. Dự án không có Git, không tạo commit/branch.

## Kiểm chứng và giới hạn

Xem [audit](docs/research/aioenglish/UI-AUDIT-2026-11-01.md). Đã kiểm tra 13 trang chính ở 1440/768/390/360px và 7 trang công khai ở 1440/390px. Menu/dialog có quản lý focus và Escape; tìm/lọc có trạng thái rỗng/phục hồi. Chưa đạt hoặc tuyên bố pixel-perfect/≤4px toàn website. Kho học, mạng bạn bè thật và xử lý AI ngoài phạm vi. Chrome hiện có tiện ích chèn `data-sharkid`/hook DevTools gây cảnh báo hydration/Fast Refresh, đã ghi trong audit.


Đợt đối chiếu thứ hai đã cập nhật Dashboard, Ngữ pháp và header Lộ trình; ảnh/số đo tại `docs/research/aioenglish/shots/fidelity-pass-2`. Để tránh cache PWA cũ ở cổng3000, bản xem hiện tại chạy `npm.cmd run start -- --hostname 127.0.0.1 --port 3001`, mở `/tong-quan` để xem dashboard khi chưa có hồ sơ trên origin này. Xem audit để biết sai lệch còn lại; chưa đạt pixel-perfect toàn website.


Lộ trình đã được bổ sung khung Hành trình, metadata tám chương A1 và tab bản đồ Kiến thức. Hỗ trợ tab/radio/chương bằng bàn phím, mục tiêu local, kéo/zoom map và popup node. Ảnh và số đo: `docs/research/aioenglish/shots/path-completion`. Các bản đồ chuyên đề và nội dung học thiếu dữ liệu có thông báo; không mở rộng khóa học/backend. Xem audit để biết giới hạn của các cấp ngoài A1 và bản đồ riêng.


Hub `/go-cau` đã được đối chiếu lại: hero, năm thẻ A1–C1, thư viện12+10 bộ và sidebar tablet. CTA/thẻ gợi ý theo cấp trong hồ sơ; các bộ thiếu nội dung mở thông báo local. Bằng chứng: `docs/research/aioenglish/shots/go-cau-completion`, gồm số đo bốn viewport và kiểm tra27 URL bộ học. Nội dung khóa học không được bổ sung trong đợt này.


### Tiến độ UI AIO English — lịch sử từ 01/11/2026

**Mốc mới nhất02/11:** tài liệu mẫu có đủ21 section theo kiểu khối nguồn và footer bằng dữ liệu local. Đã xử lý cảnh báo key/spread; typecheck/build43 test qua. [Checkpoint](docs/research/aioenglish/goal/GRAMMAR-DOCUMENT-BODY-CHECKPOINT-2026-11-02.md) ghi ảnh4 viewport, chênh do fixture và browser gate đang chặn kiểm lại icon cuối. Goal chưa hoàn tất; production http://127.0.0.1:3001.


**Mốc renderer tài liệu02/11:** đã dựng bảng/card mobile, công thức, ví dụ, callout và mục lục nhúng;3 mẫu có QA production4 viewport,43/43 ca route/typecheck/build qua.14 section và các hạng mục toàn goal còn chưa hoàn tất. Xem [checkpoint mới](docs/research/aioenglish/goal/GRAMMAR-DOCUMENT-BLOCKS-CHECKPOINT-2026-11-02.md), gồm giới hạn capture/scroll. Production http://127.0.0.1:3001.


**Mốc mới nhất02/11:** khung học Ngữ pháp có drawer đầy đủ, mục lục và dialog tài liệu. Overview/drawer/TOC mẫu cùng đầu tài liệu đã kiểm production bốn viewport;43/43 ca route, typecheck/build qua. Thân tài liệu và các trạng thái khác chưa hoàn tất. Xem [checkpoint](docs/research/aioenglish/goal/GRAMMAR-TOPIC-CHECKPOINT-2026-11-02.md). Production http://127.0.0.1:3001; dừng server trước khi build. Các mốc phía dưới là lịch sử.


Mốc Ngữ pháp02/11: hai tab đã có QA production bốn viewport; cốt lõi có12 thì/14 nhóm/51 chủ đề, các khối đo0px; lộ trình tối đa1.125px. Build/typecheck và43/43 test qua, gồm102 link chủ đề/tài liệu. Khung học/tài liệu mới **còn đang hoàn thiện và chưa khớp nguồn**, không suy ra từHTTP200. Bằng chứng `shots/goal-grammar-core`, trạng thái đầy đủ ở PROGRESS.md. Dashboard/trang phụ/công khai/học sâu và các trạng thái còn lại vẫn bắt buộc trước khi hoàn tất goal.

Mốc panel/mobile bản đồ02/11: đã sửa pose/card hẹp và dựng panel node trong map. Khối đo6 cấp và2 mẫu panel khớp ở4 viewport; Enter/Escape/focus-return đã thử production,42/42 ca route qua. Nút Đã nắm mô phỏng UI tạm thời, không lưu tiến độ backend. Xem PROGRESS.md và `shots/goal-path-panel`; các đoạn mô tả popup UiDialog/pose mobile chưa sửa phía dưới là lịch sử đã được thay thế. Toàn goal vẫn chưa hoàn tất.

Mốc sáu cấp02/11: A1–C2 có bản đồ riêng đúng số node, tổng43 asset trình bày. Typecheck/build và42/42 ca kiểm tra qua. Desktop/tablet đã đo; mobile còn sai pose/zoom và popup cần thay bằng panel nguồn. Bằng chứng `shots/goal-path-levels`; chưa nghiệm thu toàn Lộ trình/toàn goal.

Mốc bổ sung bản đồ02/11:37 chuyên đề đã có giao diện local thay notice; Tenses có ảnh production bốn viewport,41/41 ca HTTP/route qua. Bằng chứng `shots/goal-path-maps`, log và giới hạn tại PROGRESS.md. Bản đồ trình độ riêng/popup cùng các phần còn lại của goal vẫn cần hoàn thiện.

**Mốc hiện hành 02/11:** Từ điển đã có UI nguồn, autocomplete, accordion, UK/US và khung dịch qua API hiện hữu (loading/lỗi/thử lại). Typecheck, production build và 40/40 ca route qua. Production: http://127.0.0.1:3001/. Dừng server trước khi build, không chạy dev/build chung `.next`. Ảnh/số đo: `docs/research/aioenglish/shots/goal-dictionary`. Theo dõi trạng thái hiện hành tại [PROGRESS](docs/research/aioenglish/goal/PROGRESS.md); các đoạn bên dưới là lịch sử. Goal toàn website chưa hoàn tất: còn dialog lưu từ chưa đối chiếu nguồn, chi tiết trạng thái, shell, Dashboard/Ngữ pháp/bản đồ, trang phụ/công khai và khung học sâu.

Hub Từ vựng và IPA UK đã có fixture trình bày nguồn, tương tác local và ảnh production bốn viewport. Các dialog/cá nhân/giọngUS chưa được nghiệm thu đầy đủ. Theo dõi tiến độ hiện tại tại `docs/research/aioenglish/goal/PROGRESS.md`; ảnh/số đo ở `docs/research/aioenglish/shots/goal-vocab-ipa`. Production local đang dùng cổng3001: `npm.cmd run build`, sau đó `npm.cmd run start -- -p 3001`. Không build cùng devserver dùng chung `.next`.

Tiến độ 02/11: Từ vựng cá nhân đã sửa toolbar/bảng/empty state, có ảnh production bốn viewport và QA các thao tác chính. Badge bộ lọc/dialog/US vẫn chưa nghiệm thu. Video đang khảo sát lại theo nguồn; xem docs/research/aioenglish/goal/PROGRESS.md. Chưa hoàn tất goal toàn website.

Tiến độ Video 02/11: đã dựng header, thư viện/carousel/kênh, tìm/lọc, danh mục/phân trang, form cá nhân và chọn bốn chế độ bằng fixture. 33 ca route qua; ảnh/số đo ở docs/research/aioenglish/shots/goal-video. Popup/dialog và các trạng thái còn QA; chưa nghiệm thu toàn bộ Video hay toàn goal. Xem PROGRESS.md để phân biệt bằng chứng hiện hành và các mốc cũ.

Tiến độ AppShell/Video 02/11: main cuộn riêng, menu mobile dạng bảng trượt và dialog chọn chế độ đã có ảnh production; 34/34 ca route qua. Bằng chứng tại shots/goal-shell-scroll, shots/goal-video-dialog và PROGRESS.md. Đọc & dịch đang khảo sát/triển khai; toàn goal chưa hoàn thành. Production local: http://127.0.0.1:3001/ (chỉ một server; dừng trước khi build).

Tiến độ Đọc & dịch 02/11: hub, ba dialog và thư viện chủ đề A1 đã có ảnh production4 viewport (shots/goal-reading);36/36 ca route qua. Metadata nhóm khác dùng mẫu; thư viện từng tờ báo và Từ điển còn triển khai, các link /bao/ hiện chưa có route. Xem PROGRESS.md để biết phạm vi chưa nghiệm thu. Goal vẫn active.

Tiến độ thư viện báo 02/11: đã thêm3 hub Guardian/Conversation/Atlantic, thumbnail gốc và các control local;39/39 ca route qua. Ảnh/số đo production4 viewport tại shots/goal-press. Từ điển đang chuẩn bị thay UI theo source, toàn goal chưa hoàn tất. Theo dõi PROGRESS.md để biết trạng thái chưa nghiệm thu và giới hạn fixture.


Mốc browser khôi phục02/11: [QA popup và giới hạn](docs/research/aioenglish/goal/BROWSER-RESUMED-2026-11-02.md). Popup My đã so4viewport, keyboard thực đã thử; toàn goal chưa xong. Production3001; dừng server trước build, npm.cmd run build rồi npm.cmd run start -- --port 3001.


Cập nhật02/11 — Cài đặt Bạn bè: xem [checkpoint](docs/research/aioenglish/goal/SETTINGS-FRIENDS-2026-11-02.md). Production3001,45/45 route, build/typecheck qua; còn khác màu surface và các section Cài đặt chưa hoàn thiện. Goal tiếp tục active.

Cập nhật tiếp02/11 — [Trình độ/Giọng](docs/research/aioenglish/goal/SETTINGS-LEVEL-ACCENT-2026-11-02.md): đã sửa surface/selected ring, marker Cài đặt và mobile gap. Production3001/session30081;5section bbox max2px cả4viewport,45/45 route, build/typecheck qua. Giao diện/Quyền riêng tư/Tài khoản và toàn goal vẫn chưa nghiệm thu.

Cập nhật tiếp02/11 — [Giao diện/Quyền riêng tư/Tài khoản](docs/research/aioenglish/goal/SETTINGS-APPEARANCE-PRIVACY-2026-11-02.md): cấu trúc card/footer, dialog và preference persist đã kiểm tra; download local tạo JSON hợp lệ. Production3001/session84033,45/45 route, build/typecheck qua; tám section/footer bbox delta0 bốn viewport. Avatar/GoalDialog, matrix trạng thái và toàn goal chưa nghiệm thu.
