# Renderer tài liệu Ngữ pháp — 02/11/2026

Goal active. Mốc này bổ sung checkpoint khung Ngữ pháp trước, không nghiệm thu toàn reader hay toàn website.

## Thay đổi

- GrammarDocumentBlocks render paragraph, heading, bullets, formula, table/card mobile, examples/speech, callout và practice link; giữ class/scoped attribute nguồn.
- Ba specimen UI tối thiểu: sec-formula, sec-rule-ps-negative, sec-mistakes-ps trong grammar-document-block-samples.json. Không thêm course pool, bài tập, backend hoặc thuật toán học.
- GrammarTopicDocument dùng renderer chung cho trang độc lập và dialog. Bốn section đầu giữ specimen trước; ba section mới có kiểu trình bày đúng. **14/21 section còn lại vẫn dùng tóm tắt có sẵn, chưa hoàn tất UI chi tiết.**
- grammar-document-presentation.json tách màu dialog nhúng, nhóm initial-current và điểm nhấn khỏi dữ liệu tài khoản. Trang độc lập giữ màu của trang; dialog dùng metadata mẫu lúc bắt đầu chủ đề. Không lưu hay đổi tiến độ.
- Mục lục nhúng có anchor, active state theo cuộn và tự đưa chip đang chọn vào vùng nhìn thấy. Ngưỡng gồm margin8px và dung sai cuộn1px; không thay thuật toán học.
- Speaker gọi speak/stopSpeaking hiện hữu. Key theo slug/section làm cleanup khi chuyển chủ đề; không sửa speech.ts. Chưa kiểm âm thanh thực nghe hay race của request TTS đang chờ.
- Bảng mobile có role table/row/columnheader/cell và nhãn, desktop dùng th scope=col. Callout có role note. Không thêm thư viện hoặc sửa CSS nguồn/API/store.

## Bằng chứng và phạm vi

Ảnh và JSON tại ../shots/goal-grammar-document-blocks/.

| Mẫu | Viewport | Production | Giới hạn |
|---|---|---|---|
| Công thức: bảng/card, đoạn ký hiệu, công thức nét đứt | 1440×900,768×1024,390×844,360×844 | Có ảnh/bbox/màu, không overflow | Chỉ mẫu này |
| Phủ định: đoạn, công thức, ví dụ EN/VI, tip, link luyện | Cả4 | Có ảnh/bbox/màu, không overflow | Word lookup chưa dựng |
| Lỗi hay mắc: bảng3 cột/card, note | Cả4 | Có ảnh/bbox/màu, không overflow | Desktop căn nguồn theo y local có thể cuộn tới |
| Trang tài liệu độc lập | 1440×900,360×844 | Section đầu bbox0, không overflow | Hồi quy route; không phải QA thân dưới |

- production-final-metrics.json:12 case, delta lớn nhất1.421875px cho section/các block con, màu thẻ bằng nguồn. Có kích thước DOM viewport thật trong từng case.
- Trường hợp mistakes desktop: local thiếu thân dưới nên chạm cuối vùng cuộn ở y275.40625. Nguồn được cuộn tới cùng y để so riêng block. alignmentNote được giữ trong JSON. Không dùng phép so này chứng minh luồng/chiều cao toàn tài liệu đã khớp.
- production-interactions.json: Enter chọn mục Phủ định, aria-current cập nhật; bảng mobile4 cột/3 hàng và3 cột/4 hàng; mô tả speaker trỏ đúng bản dịch; Escape trả focus Xem lại tài liệu.
- Cuộn tại mẫu cuối: nguồn/local cùng chọn sec-signals khi section kế tiếp chưa chạm ngưỡng. Cách chọn chip ở mọi trạng thái khác chưa nghiệm thu đầy đủ.
- page-regression.json kiểm section đầu của route tài liệu độc lập. Toàn thân dưới vẫn chưa đạt.

### Lưu ý cơ chế chụp ảnh

Quan sát xác minh: vùng nội dung có thể đổi12px trước/sau tab.screenshot trên cả nguồn và local, dù DOM viewport vẫn đúng. Ví dụ tablet: clientWidth724 trước chụp và736 sau chụp. Không kết luận đây là lỗi thiết kế app hoặc setting người dùng.

- Bản cuối đo bbox ngay sau ảnh, dùng cùng chế độ chụp và wheel input, ghi viewport thật. Không trộn bbox trước chụp với ảnh sau chụp.
- Giữ overflow:auto như nguồn; đã bỏ thử nghiệm ép scrollbar-gutter của dialog. Không chỉnh CSS hay nội dung website nguồn để đạt số đo.
- production-block-metrics.json, production-before-capture-alignment.json và tablet-post-paint-metrics.json là chẩn đoán cũ, không phải bộ nghiệm thu cuối.
- Khi kiểm toàn goal, cần rà lại bằng chứng cũ nếu bbox và ảnh được ghi ở hai trạng thái capture khác nhau. Bbox0 không tự chứng minh ảnh khớp.

## Kiểm tra và AGY

- typecheck-grammar-document-blocks.log và build-grammar-document-blocks.log qua.
- test-grammar-document-blocks.log:43/43 ca route qua, gồm102 URL chủ đề/tài liệu. Không suy ra43 test phủ mọi trạng thái UI.
- invariant-grammar-document-blocks.json:23 CSS nguồn/13 API/2 store không đổi/thêm/xoá.
- AGY CLI đúng gemini-3.8-flash-high effort high, chỉ nhận code local qua prompt: agy-grammar-document-blocks-review.txt. Đã kiểm chứng và áp dụng ngữ nghĩa bảng mobile/callout, key theo chủ đề để cleanup và trim dấu nháy ngoài token.
- Không áp dụng các kết luận thiếu căn cứ: h3 đang nằm dưới h2 đúng cấu trúc; aria-describedby trỏ bản dịch đúng nguồn; speak đã có cơ chế thay audio; keys của fixture tĩnh không phải lỗi được tái hiện; tên bảng giống nhau không tự động vi phạm WCAG4.1.2. Nhận xét multi-word focus là ngoài fixture hiện tại, chưa coi là bằng chứng lỗi đã phát sinh.
- Source chỉ điều hướng/mở UI/cuộn; không bấm Tiếp tục hoặc đổi tài khoản nguồn.

## Vận hành và bước tiếp

Production port3001, session42056. Dừng server trước build; npm.cmd run build rồi npm.cmd run start -- --port 3001. Không build cùng dev dùng chung .next. Backup: .ui-goal-backup/grammar-document-blocks/GrammarTopicDocument.tsx.

1. Dựng14 section còn thiếu bằng dữ liệu học đã có và fixture tối thiểu; không nhập kho nội dung mới. Có thể trích mỏng intro/points/examples/mistake từ dữ liệu local, giữ tách khỏi pool lớn. Không xoay vòng intro sai node để coi là đầy đủ.
2. Bổ sung tương tác word lookup theo UI nguồn, kiểm anchor/scroll/focus ở các trạng thái còn lại, âm thanh và các chủ đề đại diện khác.
3. Hoàn thiện/kiểm chứng các hạng mục còn lại của toàn goal: Dashboard, hub states, trang phụ/công khai/onboarding và khung học sâu. Không thu hẹp goal vào ba mẫu tài liệu.
