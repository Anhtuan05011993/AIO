# Browser khôi phục — QA word-tap

Goal active, đầy đủ phạm vi kế hoạch. Blocker kết nối trong BROWSER-BLOCKER-2026-11-02.md đã được thay thế: CUA Chrome4 đọc được nguồn và local sau người dùng mở lại web. Không coi các hạng mục khác đã hoàn tất.

## Runtime

Khi kết nối lại, cổng3001 không có server; local vẫn hiển thị bundle/HTML cũ qua cache. Đã xác minh listener, khởi động production rồi dùng hard reload để lấy code hiện tại. Trong chuyển dev/prod đã có hydration khác bundle; không dùng log/ảnh trạng thái đó làm nghiệm thu app.

Bản cuối: typecheck/build qua,45/45 test qua. Log *-resumed-browser.log; invariant-resumed-browser.json:23 CSS nguồn/13 API/2 store không đổi. Server production3001/session70624. Không nâng dependency.

## Sửa từ bằng chứng browser

- Popup desktop nguồn cao227px, vùng nghĩa tối thiểu123px; mobile đơn giản175px. Sửa line-height primary22px/content20px/meta20px, badge và margin cuối để khớp source.
- Thêm mũi tên neo desktop. Khoảng anchor đúng12px sau chờ wp-enter-active detached. Phép đo giữa chuyển cảnh trước đó6px đã được sửa, không dùng làm chuẩn.
- Hai specimen UI My/I được cố định trong grammar-word-tap-samples.json để so ảnh và tránh nghĩa local I là chữ số La Mã. Không thêm course/bộ từ hoặc thay engine từ điển; các từ khác tiếp tục tra bằng engine hiện hữu.
- Backup trước chỉnh: .ui-goal-backup/word-tap-browser-qa.

## Bằng chứng cuối

shots/goal-resumed-browser/:

- overview-popup-final-metrics.json: source/local popup My cùng1440×900,768×1024,390×844,360×844; delta x/y/w/h0 cả4, không overflow. Ảnh source/production-overview-popup-{width}.jpg, source đã hết transition, bbox sau ảnh. Các metric trước bản final có lệch đã superseded.
- word-keyboard.json: Tab trigger→Phát âm, Shift+Tab→My, Escape đóng/focusMy, ArrowRight→mum; URL giữ learner, không tự vào bài.
- nested-escape-final.json: Escape popup I giữ dialog tài liệu mở, trả focusI. Ảnh production-document-popup-360.jpg. Chưa đo popup nhúng bốn viewport.
- secondary-keyboard.json: ArrowRight chọn/focus Bạn bè, quan hệ tab/panel đúng; Tab vào panel; radio Bảng tin Right→Hiện@ID checked/focus. Đã Left khôi phụcẨn danh trên localhost. Không đổi tài khoản nguồn.
- production-cache-console.json: reload với bypass/cache disable tắt, popup My cao175px và không error/warn trong cửa sổ thời gian ghi. Chưa suy rộng console toàn app.
- source-settings-1440.jpg và source/settings-current.html xác nhận lại Cài đặt hiện tại, chưa chốt layout local Cài đặt. Source chỉ đọc/navigate, không đổi preference/progress hay bấm lưu từ.

## Còn bắt buộc

- Tra từ: states loading/error/empty/save notice, nhiều từ/popup, resize và arrow placement cạnh viewport; dữ liệu khác My/I; document popup4viewport và ảnh typography chi tiết. Không nghiệm thu toàn word-tap từ bbox My.
- Cài đặt/Bạn bè: toàn bộ layout4viewport và state/dialog; keyboard modifier và các radio khác. Spec Cài đặt có ID section tiếng Việt/khác local, còn phải thống nhất giữ alias route hiện hữu.
- Toàn bộ backlog Dashboard, hub states, trang phụ/public/onboarding/deep frame trong PROGRESS vẫn giữ. Goal chưa complete.
