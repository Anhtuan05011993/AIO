# Từ điển — checkpoint production 02/11

Trạng thái: đã kiểm tra production cho các trạng thái ghi dưới đây; chưa nghiệm thu toàn bộ hub hoặc toàn goal.

## Triển khai

- DictionaryHub thay grid cũ bằng header/search, phiên âm UK/US, nghĩa chính, nhóm nghĩa mở/đóng, cụm từ, họ từ và đồng/trái nghĩa. Route nhận q từ server; giữ engine searchDictionary và speak hiện hữu.
- Hai fixture trình bày apple/adrenaline và SVG trang trí tách riêng khỏi dữ liệu tài khoản/nội dung học. Initial local cố định adrenaline vì từ ban đầu nguồn thay đổi.
- Autocomplete có debounce, điều hướng mũi tên/Escape, chống kết quả stale, dedupe trình bày và guard IME. Pick/history đóng dialog và đồng bộ URL. Chưa kiểm bằng bộ gõ IME thật.
- Không tìm thấy mục từ mở khung dịch theo nguồn, qua POST /api/translate hiện hữu; có abort, timeout, loading, lỗi, retry và focus sau thành công. Không thay schema/backend. Footer ghi Dịch tự động vì API không cung cấp provider; không gán Google cho phản hồi có thể đi qua fallback.
- Dialog lưu từ hiện là bản local tạm thời, chưa quan sát nguồn do chưa rõ nút bookmark có ghi tài khoản ngay hay chỉ mở UI. Chưa đạt nghiệm thu phần này. Không thay store hoặc gửi tài khoản nguồn.

## Bằng chứng

Nguồn: goal/source/dictionary/{initial,apple,suggestions,translation}.html, hub.css và entry.css. Ảnh/số đo: shots/goal-dictionary.

- production-final-metrics.json và production-comparison.json: initial header, apple header/left/col/family, adrenaline thêm syn ở 1440×900,768×1024,390×844,360×844; các bbox đã đo chênh 0px, không overflow. Initial body không so vì từ nguồn ngẫu nhiên. Bbox không thay kiểm ảnh hoặc nghiệm thu phần dưới.
- translation-metrics.json: nguồn/production bốn viewport, header/khung dịch chênh 0px. Truy vấn zzzz-no-word trả bản dịch thực tế giống nguồn ở lần thử.
- production-translation-loading-360.jpg và production-translation-error-360.jpg: thử latency/chặn API local, đã khôi phục mạng. Retry giữ focus khi loading, thành công chuyển focus kết quả. api-offline-check.json: chặn API vẫn hiển thị apple, không overflow.
- Production Back đóng dialog; accordion đổi aria-expanded; ArrowUp từ chưa chọn tới cuối danh sách đã được kiểm trên bản dev trước build. Các test này không chứng minh mọi trạng thái bàn phím/viewport.
- Các ảnh/số đo dev trước sửa h1 margin và syn placement đã bị thay thế bởi production-final-metrics.json. Không dùng ảnh sidebar/topbar bị compositor bỏ paint làm bằng chứng shell đạt.

## Build, review và invariants

- Typecheck/build qua; test-dictionary.log:40/40 route qua, giữ39 ca cũ và thêm kiểm direct query/duplicate q/khung dịch SSR. build-dictionary.log là log build hiện hành. Server production cổng3001, session72503 tại mốc này.
- invariant-dictionary.json:23 CSS nguồn,13 API,2 store không thêm/đổi/xóa. engine-invariant-dictionary.json: engine/entries dictionary và helper speech không đổi. Không đổi dependency/lockfile.
- AGY dictionary review: đã xác minh/sửa ArrowUp, stale list, popstate đóng modal, URL duplicate, IME guard, dedupe và focus input. Không áp dụng suy đoán initial phải trống hoặc back phải history.back: nguồn hiển thị từ ngẫu nhiên và link về /tu-dien.
- AGY translation review: bổ sung defensive response null, live status và retry focus. Không chỉnh backend.
- Cảnh báo dev thiếu key ở Entry/LinkComponent còn điều tra; không suppress hoặc quy cho extension. Production không phát dev warning không chứng minh đã hết lỗi.

## Còn bắt buộc

Đối chiếu source save dialog, autocomplete đủ viewport và ảnh phần dưới; thử IME thật/âm thanh nếu khả dụng; điều tra key warning, shell paint/capture. Sau đó tiếp tục đầy đủ Dashboard/Ngữ pháp/Lộ trình, trang phụ/công khai và học sâu theo goal; checkpoint này không thu hẹp phạm vi.

## Kiểm tra bổ sung dropdown

- Đã kiểm source/production dropdown bốn viewport. Phát hiện mobile input/dropdown hẹp26px do SVG CTA thiếu class/scope nguồn td-cta-arr; đã thêm đúng class/scope, không sửa CSS nguồn. production-suggestions-final.json: desktop chênh1px, tablet/mobile0px. Tám lựa chọn hiển thị; ArrowUp từ chưa chọn tới option7, Escape đóng listbox trên production.
- Ảnh source cho thấy nền dropdown trắng; đã xác minh computed rgb(255,255,255) và sửa custom từ nền giấy sang trắng. Ảnh trước sửa nền đã bị thay thế khi chụp lại production. Nhãn/nghĩa gợi ý khác do giữ engine/dataset local; không đổi thuật toán hoặc nạp thêm kho học.
- Log build/test hiện hành: build-dictionary-suggestions.log và test-dictionary-suggestions.log,40/40 test qua ở bản sửa class CTA. Cần kiểm lại ảnh bản cuối sau màu nền.
- Tiếp tục khảo sát Lộ trình: đã mở tab Kiến thức/Tenses bằng UI nguồn, lưu map-world trực quan tại goal/source/path-maps/tenses.html. Bản đồ Tenses có nhánh/leaves khác trail, xác nhận phải dựng UI chuyên đề thay notice. Không gửi form/thay đổi tài khoản nguồn.

### Production cuối của checkpoint

Build màu nền cuối qua; production3001/session14113. Reload khi SW bypass đã tắt xác nhận dropdown rgb(255,255,255), x27/y163.5/w258.328125/h420 ở390×844,8 option. Đã cập nhật production-suggestions-390.jpg; các ảnh suggestion kích thước khác vẫn là mốc trước sửa nền, không dùng làm bằng chứng màu cuối. Đã reset viewport overrides. Backlog source-save, ảnh phần dưới và toàn goal vẫn giữ nguyên.
