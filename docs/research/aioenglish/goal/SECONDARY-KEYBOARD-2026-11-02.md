# Cài đặt/Bạn bè — keyboard local

Phạm vi đang sửa: radiogroup trong CaiDat và tablist trong TienDoBanBe. Không nghiệm thu toàn trang phụ hoặc thiết kế dựa trên logic local.

Lỗi xác nhận từ mã trước: mọi radio/tab cùng nằm trong thứ tự Tab; không có xử lý mũi tên. Kế hoạch yêu cầu keyboard phù hợp cho control.

- Radio: chỉ value hiện tại (fallback phần tử đầu nếu chưa có lựa chọn) tabindex0; Right/Down kế tiếp, Left/Up trước, Home/End đầu/cuối; chọn qua callback hiện hữu và focus nút tương ứng.
- Tab Bạn bè: selected tabindex0, Left/Right/Home/End chọn và focus. Không đổi state query/form hoặc tiến độ.
- Không sửa class/layout/API/store. Backup hai file ở .ui-goal-backup/secondary-keyboard.
- Typecheck qua, log typecheck-secondary-keyboard.log. Build đang kiểm, kết quả phải đọc trước chốt.
- AGY model gemini-3.8-flash-high effort high chỉ prompt local, session33264; review tại agy-secondary-keyboard-review.txt. Chưa coi review hoàn tất khi handle còn chạy.
- Browser gate chưa khôi phục, không tuyên bố bàn phím thực hoặc ảnh đã qua. Còn thiếu tabpanel/aria-controls đầy đủ và kiểm focus trên các trạng thái; cần khảo sát nguồn khi browser có lại, không thay UI nguồn theo suy đoán.

Tìm thấy evidence cũ tại shots/ui-completion/source-cai-dat.html và source-cai-dat/source-ban-be JPG1440/768/390. Chúng là lịch sử01/11, không chứng minh UI nguồn hiện tại hoặc toàn bộ trạng thái. Chưa thực hiện mutation nguồn.

Toàn goal active. Việc này không thay các phần Dashboard/hub/secondary/public/deep-frame còn bắt buộc.

Build exit0,44/44 ca route qua trên production3001/session90913. Invariant23 CSS nguồn/13 API/2 store không đổi. SSR/route không phủ hành vi key mới, vẫn cần browser. AGY33264 còn chạy ở lần poll cuối.

## Liên kết panel

Tab Bạn bè có id ổn định useId và aria-controls tới panel đang render. Panel tương ứng có role=tabpanel, aria-labelledby tới tab và tabindex0. Plan/friends gắn thuộc tính ngay container hiện hữu, feed có wrapper đơn một child. Chưa đo layout feed mới khi browser gate chặn; không tuyên bố không sai khác pixel. Typecheck qua; build đang chờ. Đã bổ sung ca SSR xác minh1 tab selected/1 entry Tab và quan hệ id panel, không thay kiểm Arrow/Tab thực.

Chốt build panel exit0;45/45 test qua, invariant nguồn/API/store không đổi. Production3001/session17747. Ca mới kiểm tab/panel SSR thực, chưa chứng minh Arrow/Tab browser. AGY33264 vẫn live ở lần poll cuối, output0 byte; không restart do chậm. Browser gate xác nhận lại, chưa reset viewport/bypass cũ khi chưa truy cập được.

## AGY hoàn tất

AGY33264 exit0. Đã kiểm: handler bắt Alt+Arrow nên có thể chặn Back/Forward; thêm guard Alt/Ctrl/Meta/Shift. Nút radio/tab khai báo type=button để rõ hành vi (hiện không ở form, không khẳng định đã có submit lỗi). Nhận xét duplicate option là giả định vì các option hiện duy nhất. Panel semantics đã bổ sung ở lượt trước. Không tự đổi auto-activation thành manual khi chưa có nguồn xác nhận; source locale Việt, RTL ngoài phạm vi hiện tại. Đề xuất hardcoded order được ghi để gom cấu hình khi chỉnh trang theo nguồn.

Build/typecheck sau modifier guard qua;45/45 ca kiểm tra qua trên production3001/session31722. CSS nguồn/API/store hash không đổi. AGY review đã hoàn tất, thay các ghi chú pending trước. Browser interaction/ảnh vẫn pending.
