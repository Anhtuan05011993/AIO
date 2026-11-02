# Blocker hiện hành — kiểm chứng UI

Goal chưa hoàn thành. Phạm vi giữ nguyên toàn bộ kế hoạch người dùng.

## Bằng chứng hiện tại

- CUA listTabs Chrome4 tiếp tục bị từ chối bởi gate “Local browser use is disabled in Work settings”. Lỗi cùng loại đã lặp qua nhiều lượt liên tiếp; chưa có bằng chứng kết nối được khôi phục. Không kết luận nguyên nhân do người dùng chỉnh setting.
-45/45 test trong test-secondary-keyboard.log; build-secondary-keyboard.log hoàn tất, typecheck đã qua. Invariant23 CSS nguồn/13 API/2 store không thay đổi.
- AGY word-tap và secondary-keyboard đều đã kết thúc và được đối chiếu. Không còn job review cần chờ trong hai hạng mục này.
- Server production cổng3001/session31722 là bản modifier guard cuối. Không cần build lại nếu chưa sửa code.

## Những bước tiếp theo đang cần browser

| Phạm vi | Việc chưa chứng minh | Bằng chứng cần |
|---|---|---|
| Word tap tài liệu/overview | Neo, overflow, focus, Enter/Escape, popup trong native dialog, dữ liệu mẫu I | Thao tác và ảnh production4 viewport so nguồn |
| Cài đặt/Bạn bè | Radio/tab keyboard, panel focus, layout feed wrapper | Browser local và đối chiếu nguồn |
| AppShell/Gõ câu | Trạng thái tiện ích, paint/logo, drawer/breakpoint và hồi quy hub | Ảnh nguồn/local và DOM boxes |
| Vocab/IPA/Video/Reading/Dictionary | Dialog/save/US và gallery/failure states còn thiếu | Quan sát readonly nguồn, fixture local và production |
| Dashboard/Grammar/Path | Feed/goals/states và các chủ đề/map còn chưa QA | Nguồn và production theo trạng thái |
| Trang phụ/công khai/onboarding/học sâu | Cấu trúc/thứ tự section và tương tác chưa nghiệm thu | Khảo sát hiện tại, triển khai và QA4 viewport |

HTML/ảnh lịch sử15 nhóm đã lập chỉ mục tại historical-source-evidence-index.json; phần lớn chỉ3 viewport. Có thể định vị việc cần khảo sát, không đủ thay thế bằng chứng nguồn hiện tại/trạng thái còn thiếu hoặc nghiệm thu pixel.

Các việc local độc lập gần đây đã làm: renderer21 section, fixture/provenance, word tap, sửa key warning, radio/tab/panel semantics, review AGY và build/test/hash. Tiếp tục sửa visual từ giả định hoặc tăng test SSR không giải quyết điều kiện nghiệm thu tiếp theo. Không dùng công cụ khác để vượt gate browser và không đánh dấu goal complete.

## Khi kết nối được khôi phục

1. Kiểm inventory/tab source và local, không mặc định handle cũ sống.
2. Reset viewport overrides/cache/SW bypass cũ nếu còn; đã ghi pending khi gate xuất hiện, chưa báo reset thành công.
3. Kiểm bản production31722 và word tap trước; ghi ảnh/bbox cùng trạng thái capture, xác nhận viewport DOM thật.
4. Tiếp tục toàn bộ backlog7 đợt. Không chạy lại build/test chỉ để xác nhận trạng thái không đổi.

Điều kiện cần từ bên ngoài: browser source và local có thể điều khiển lại qua kết nối được cấp quyền. Không yêu cầu nhập lại tài khoản local hoặc đổi cấu hình dự án để xử lý gate.
