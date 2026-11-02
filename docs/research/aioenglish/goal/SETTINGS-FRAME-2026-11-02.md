# Cài đặt — khung, Hồ sơ và Mục tiêu

Goal active. Đây là mốc triển khai một phần Cài đặt, không nghiệm thu toàn trang phụ.

## Nguồn và thay đổi

Đã đọc Cài đặt nguồn trực tiếp, readonly, không submit form hay đổi preference tài khoản. Source có nb-skin/cd-wrap, hai cd-col với container breakpoint880px. Bên trái Hồ sơ/Bạn bè/Trình độ; bên phải Mục tiêu/Giọng/Giao diện/Quyền riêng tư/Tài khoản.

- CaiDat dùng khung/header/scoped attribute và palette nguồn, section icon/tape gốc. CSS quan sát nằm custom/settings-reference.css, sửa riêng settings-parity.css; không sửa src/styles/source.
- Root source IDs hoso/ban-be/trinhdo/muctieu/giong/giaodien/riengtu/taikhoan. Các ID tiếng Anh cũ giữ bằng anchor alias trong từng section để /cai-dat#friends và link tương thích tiếp tục có đích.
- Hồ sơ có avatar local74px, label/input và actions theo nguồn, maxLength40; save disabled khi trống/không đổi. Lưu vẫn gọi update/setDemoUser hiện hữu. Đổi ảnh vẫn dùng ContentNotice tạm, chưa dựng picker/dialog nguồn.
- Mục tiêu có nhãn Mỗi ngày,4 nút pressed và Cấp muốn đạt/Sửa. Chuyển target từ thẻ Trình độ về Mục tiêu theo nguồn; update/GoalDialog hiện hữu giữ nguyên. Nút ngày dùng group/aria-pressed như source, không tự gán radio.
- Các thẻ còn lại mới có surface/header/icon; **form chi tiết còn khác nguồn**. Chưa thay dropdown trình độ bằng picker, chưa dựng card giọng/phát âm, hàng appearance, friends ID/link/token/hidden-online hay privacy/account dialog.
- Fixture settings-header-art/settings-icons chỉ chứa SVG trình bày quan sát, không danh tính nguồn. Tài khoản/ảnh nguồn và local khác được giữ.
- Backup: .ui-goal-backup/settings-source-frame/CaiDat.tsx. API/store/dependency không đổi.

## QA production

Ảnh/source/local4 viewport tại shots/goal-settings-frame/; production-final-metrics.json ghi viewport thật và bbox sau capture.

| Khối | 1440×900 | 768×1024 | 390×844 | 360×844 |
|---|---|---|---|---|
| Header x/y/w/h |0|0|0|0|
| Hồ sơ x/y/w/h |0|0|0|0|
| Mục tiêu w/h |0|0|0|0|
| Mục tiêu y |0|-235.515625|-320.71875|-339.5625|

Không overflow ngang ở4viewport. Sai lệch y của Mục tiêu là do chiều cao Bạn bè/Trình độ chưa khớp trên layout1cột; không bù bằng spacer. Chưa chốt toàn trang hoặc toàn bố cục từ bbox của vài khối. Ảnh có avatar/tên/goal local khác nguồn.

production-interactions.json: sửa tên chưa submit→save enabled; trở lại tên gốc→disabled. Mở dialog mục tiêu rồi đóng, không lưu. Chưa test upload/save thành công/lỗi và mọi validation.

Typecheck/build qua;45/45 ca test-settings-frame.log qua, không suy ra45 test phủ đủ settings interactions. Invariant-settings-frame.json:23 CSS nguồn/13 API/2 store không đổi. Production3001/session50095. Dừng server trước build, npm.cmd run build rồi npm.cmd run start -- --port 3001.

Chuyển dev/prod có bundle cũ do SW; đã dùng bypass/cache-disabled và hard reload trong dev để xác nhận JSX hiện tại trước đo. Cần kiểm lại reload với cache bình thường sau checkpoint; không coi bypass là nghiệm thu SW.

AGY model gemini-3.8-flash-high effort high nhận code local, không đọc web/sửa file. Review job74078 còn live ở lần poll cuối, chưa có output; cần lấy kết quả và xác minh trước chốt review. Không restart job chỉ vì chậm.

## Tiếp theo

1. Hoàn thiện Bạn bè và Trình độ đúng nguồn để đóng sai lệch y tablet/mobile, giữ schema/store và link alias.
2. Giọng/Giao diện/Quyền riêng tư/Tài khoản: form/source-dialog/states, không gửi dữ liệu lên source hoặc thực hiện xoá thật.
3. Profile change-image dialog và save validation/keyboard/feedback; target dialog đầy đủ theo nguồn.
4. QA cache bình thường/console/ảnh4viewport sau sửa, review AGY. Toàn bộ backlog7đợt vẫn bắt buộc.

Cache kiểm bổ sung: production-cache-console.json ghi hard reload với bypass/cache-disable tắt, target mới còn hiển thị, console không error/warn trong cửa sổ thời gian ghi. Đã reset viewport overrides nguồn/local. Đây thay phần cache còn chờ ở trên.

## AGY review đã hoàn tất

Job74078 exit0. Áp dụng name khởi tạo DEFAULT.name tránh data-on flash trước effect, wrapper blank không báo changed-ready, sync name đã trim sau submit, hashchange/initial hash sync nav theo ID nguồn hoặc alias, aria-hidden cho icon header. CritterAvatar(-1) là nhánh được component hỗ trợ; ContentNotice có type=button; fixture header art có html tĩnh và typecheck, không phải nội dung người dùng. Giữ daily pressed group như source; aria-current=location hợp lệ cho vị trí trong trang. Alias target/focus sâu còn QA, không coi phần giả định của reviewer là lỗi đã tái hiện.

Đang build lại sau review; ảnh/metric trước vẫn chứng minh layout, nhưng cần QA hash/name/bản cuối khi build xong.

Chốt review: typecheck/build45 test qua, invariant nguồn/API/store không đổi. Production3001/session11882. production-final-hash.json kiểm direct#muctieu và#friends alias đều chọn nav location đúng sau refresh. Ảnh390 đã cập nhật trên build cuối. Review AGY đã xử lý, thay các ghi chú đang chạy; các form/phần còn lại vẫn pending.
