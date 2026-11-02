# Cài đặt — Trình độ và Giọng, 02/11/2026

Trạng thái: đã kiểm tra local/production cho IELTS đầu tiên, hai giọng và tương tác local; chưa nghiệm thu toàn Cài đặt. Lượt trước là progress, có sửa code và bằng chứng production.

- SettingsLevel: chứng chỉ và sáu hàng IELTS theo DOM nguồn; TOEIC metadata đã có trong onboarding. Chưa quan sát chọn TOEIC/Chưa rõ trên nguồn vì có thể sửa hồ sơ nguồn. Tab chỉ đổi nhóm xem; chọn band ghi DemoUser.level sẵn có, bỏ view tạm. A1 fixture chỉ chọn hàng đầu IELTS. Không thêm schema/store key.
- SettingsAccent: thẻ, IPA, cờ SVG gốc, badge, nút nghe riêng dùng speak hiện hữu; radio hỗ trợ Arrow/Home/End. Chưa nghiệm thu âm thanh thực tế hoặc đủ lỗi TTS.
- Hint Trình độ trong source heading; tape Giọng theo nguồn. Mobile gap giữa hai cột22px (trước14px). AppShell giữ interface, chỉ Cài đặt đổi marker thành settings:page. Nền card và selected dùng biến nguồn, CSS custom có scope; nền trắng .92/inset ring2px.

## Kiểm tra

`../shots/goal-settings-level-accent/production-final-metrics.json`: x/y/width/height Hồ sơ, Bạn bè, Trình độ, Mục tiêu, Giọng max1.140625px ở1440/768/390,2px ở360; không tràn ngang. Ảnh top nguồn/production cả4. Đã xem ảnh source/production-accent-360.jpg, nền/viền selected khớp; Giao diện phía dưới vẫn sai. Ảnh source-level-360 chụp lúc cuộn chuyển cảnh không dùng chứng minh pixel. Chưa có đủ ảnh anchored mọi section cả4, không coi toàn trang hoàn tất.

`production-interactions.json`: ArrowRight US true/Home UK true; TOEIC không chọn nhầm band, Chưa rõ0row; IELTS3.0–3.5 chọn true và refresh true; trả fixture hàng đầu IELTS. Source chỉ đọc.

`production-shell-regression.json`: Dashboard/Gõ câu/Từ vựng ×4viewport, marker đúng, có nội dung, không overflow/overlay; ảnh kèm, đã xem đại diện Gõ câu768/Dashboard390. Không thay nghiệm thu đầy đủ hub.

Build/typecheck/test: build-settings-level-accent.log/typecheck-settings-level-accent.log/test-settings-level-accent.log;45/45. invariant-settings-level-accent.json source23/API13/store2 không đổi. production-console.json không error/warn trong cửa sổ kiểm tra cuối. Số đo dev đầu bị loại do SSR mới ghép client cũ; production normal cache xác minh marker/CSS mới, không suppress warning.

Production3001/session30081, http://127.0.0.1:3001/cai-dat. Dừng server trước build, npm.cmd run start -- -p 3001 sau build. Node/npm giữ baseline.

## AGY và phần còn lại

AGY gemini-3.8-flash-high/high session98454 hoàn tất; agy-settings-level-accent-review.txt. Hai lỗi state xác minh/sửa: A1 lan sang TOEIC và view không reset sau chọn band. Giữ button pressed/group theo nguồn thay vì đổi role theo gợi ý review. Nút nghe là sibling riêng, vẫn cần truy cập bàn phím; giữ tên gồm IPA như nguồn.

Tiếp theo: Giao diện full-width segmented controls, icon, spacing/hints, âm gõ phím; Quyền riêng tư/Tài khoản/footer và avatar dialog. Các trạng thái chứng chỉ khác và QA ảnh còn thiếu. Toàn goal7đợt active.
