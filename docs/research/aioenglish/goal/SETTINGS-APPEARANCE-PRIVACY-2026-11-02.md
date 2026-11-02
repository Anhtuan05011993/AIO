# Cài đặt — Giao diện / Quyền riêng tư / Tài khoản

Ngày02/11/2026. Goal active. Lượt trước là progress: có thay đổi code và kiểm chứng production. Lượt này tiếp tục scope gốc; không coi toàn goal hoàn tất.

## Thay đổi và bằng chứng nguồn

Đọc DOM nguồn ba section và footer; mở/đóng dialog đăng xuất thiết bị và xóa tài khoản, không xác nhận hoặc sửa tài khoản nguồn. Asset icon gốc trong settings-misc-art.json; CSS privacy quan sát được trong settings-privacy-source-rules.json/settings-privacy-reference.css. Không lấy danh tính nguồn làm fixture.

SettingsAppearance: bốn hàng full-width segment, icon chế độ/kiểu, hint âm đúng/sai; giữ các callback/key local hiện có. Group/button pressed theo nguồn, bổ sung Arrow/Home/End và một entry Tab mỗi nhóm. SettingsPrivacy: ba hàng, switch, download, nút mở revoke. Tài khoản: cd-out, danger panel, dialog riêng và footer pháp lý ngoài card. SettingsActionDialog dùng UiDialog native hiện có; confirm chỉ báo rõ giới hạn local, không xóa dữ liệu hoặc revoke phiên thật.

Hai sai khác CSS tìm bằng computed styles và sửa scoped: margin-right SVG6px do wrapper display:contents không khớp selector direct child nguồn; margin-top2px ở nbc-srow p bị override cũ về0. Margin này cũng đóng sai số Bạn bè từ checkpoint trước. Không sửa CSS nguồn/API/store.

## Kết quả kiểm tra

- Production3001/session84033; http://127.0.0.1:3001/cai-dat. Build/typecheck logs build-settings-appearance.log và typecheck-settings-appearance.log qua; test-settings-appearance.log45/45. invariant-settings-appearance.json: source23/API13/store2 không đổi.
- `../shots/goal-settings-appearance/production-final-metrics.json`: tám section + footer x/y/width/height delta0 ở1440×900,768×1024,390×844,360×844; không overflow. Đây là geometry, không thay nghiệm thu ảnh/trạng thái.
- Ảnh source/production-top, appearance và privacy có cả4viewport. Một số ảnh production chứa toast Đã lưu do bước đổi tùy chọn: không dùng các ảnh này làm chuẩn trạng thái không-toast. production-clean-appearance-360.jpg là ảnh cuối không toast, đã xem và so với nguồn. Đã xem privacy360 và revoke360. Chưa xem hết mọi ảnh desktop/tablet/lower-state.
- production-revoke-metrics.json: dialog revoke bbox delta0 cả4viewport, có ảnh nguồn/production. Escape trả focus về privacy-revoke-open. Số đo dialog có trước patch margin/ARIA cuối; patch không đổi CSS modal, cần hồi quy cuối toàn trạng thái.
- production-preferences.json: light→dark, sotay→neo, motion→Giảm, sound→off, hidden→true; refresh giữ đúng; sau đó trả sáng/sổ tay/system/sound on/hidden false. Chỉ local, không đổi nguồn. Chưa đối chiếu ảnh nguồn dark/classic.
- production-keyboard.json: End chọn Hệ thống, đúng1tab entry; Home trả Sáng. production-actions.json: dialog xóa mở, Escape trả settings-delete-open; confirm giả lập hiện thông báo không có dữ liệu bị xóa; revoke hiện thông báo chưa kết nối quản lý phiên.
- production-console-final.json: tab production mới không error/warn. Timeout waitForEvent(download) đã reset runtime; không coi đó là lỗi app. Xác nhận chưa có file Downloads trước khi click riêng lại. Sau click, Downloads/aio-ho-so.json533bytes parse được profile/progress và7profilekeys; production-export.json ghi schema/size, không chép nội dung tài khoản vào audit. Download đã xác minh.

## AGY

agy-settings-appearance-review.txt, gemini-3.8-flash-high/high session22721 hoàn tất. Đã thêm roving tabindex, accessible name export, liên kết mô tả confirm và scope privacy paragraph. Không nhận các giả định: motion full/reduce là hợp đồng store (mã thực tế dùng system/Đầy đủ/Giảm); switch cần is-on (CSS thật dùng aria-checked); motion data attribute bắt buộc (nguồn không có); DOM query focus sẽ lỗi vì tương lai icon có button (hiện icon staticSVG, thứ tự stable); thiếu khoảng cách confirm (nbc-btn có gap). Source scoped paragraph vốn có fallback CSS modal đúng, vẫn bổ sung owner attribute rõ ràng.

## Việc tiếp theo / giới hạn

Chưa nghiệm thu toàn Cài đặt: avatar/đổi ảnh còn ContentNotice, GoalDialog chưa đối chiếu source selector đầy đủ; help popover/ID validation/copy/new-link cần đóng matrix; chứng chỉ TOEIC/Chưa rõ và audio thiếu khảo sát/QA; system theme/motion theo đổi OS chưa kiểm chứng. Dialog xóa cần ảnh nguồn/local4viewport và Tab-loop/backdrop kiểm tra cuối; source/local email khác có thể đổi wrap body, không dùng identity nguồn.

Browser runtime đã khôi phục sau timeout, Chrome4 còn dùng được; tab cũ không còn trong registry sau reset. Tab bàn giao mới trả viewport mặc định. Các tab nghiên cứu cũ từng ở1440×900 khi mất binding; không tuyên bố đã reset chúng bằng lệnh mới.

Tiếp tục Cài đặt còn lại rồi Bạn bè/hồ sơ/Yêu cầu tính năng/Luyện thi/Onboarding, các hub/công khai/học sâu và final matrix theo PROGRESS. Không thu nhỏ goal thành Cài đặt.
