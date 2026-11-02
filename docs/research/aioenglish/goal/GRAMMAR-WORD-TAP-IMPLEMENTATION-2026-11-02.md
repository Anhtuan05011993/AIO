# Tra từ trong tài liệu — đang kiểm chứng

Goal active. Browser được kiểm lại bằng CUA inventory: apps có phản hồi, browsers bị gate từ chối. Không suy ra lỗi do setting người dùng và không dùng đường khác vượt gate.

## Phạm vi code

- GrammarWordTap nối vào câu ví dụ của GrammarDocumentBlocks; giữ nguyên văn bản/khoảng trắng và highlight.
- Mỗi câu có roving tabindex, Left/Right/Home/End, Enter/Space mở popover. Escape capture đóng popover trước modal cha và trả focus về từ; pointer ngoài đóng không kéo focus.
- Tra bằng dynamic import engine searchDictionary hiện hữu, chỉ giữ entry khớp chính xác. Có loading/error/empty, bỏ kết quả bất đồng bộ đã hết hiệu lực; không thêm dịch tự động hoặc thuật toán tra mới.
- Popover ở cùng DOM với câu để không bị native dialog top layer che. Mobile bottom20px width min(92vw,26rem); desktop anchor min(92vw,24rem), tính lại khi resize/scroll/đổi nội dung.
- Phát âm dùng speak hiện hữu; link mở /tu-dien?q=...; nút lưu chỉ báo rõ chưa kết nối, không ghi store/backend. Dialog lưu nguồn chưa được khảo sát nên không giả vờ lưu thành công.
- Asset icon SVG, CSS custom có scope, CSS nguồn/API/store không chỉnh. Backup renderer trước nối tại .ui-goal-backup/grammar-word-tap.

## Chưa được nghiệm thu

Chưa có ảnh/bbox hoặc thực thi bàn phím/browser cho component mới vì gate. Nội dung từ điển local có thể khác nguồn; chưa frozen specimen I. Chiều cao desktop và mũi tên neo của nguồn còn chưa khớp đầy đủ. Learner overview chưa nối word-tap; chỉ tài liệu dùng renderer chung. Không tuyên bố toàn tương tác tra từ hoặc cả reader đã hoàn thành.

Spec nguồn đã có: source/grammar/word-lookup*.html/json và shots/goal-word-lookup/source-I-{width}.jpg. Không bấm lưu nguồn, không đổi tài khoản nguồn.

AGY nhận code local qua prompt bằng gemini-3.8-flash-high effort high; review tại agy-grammar-word-tap-review.txt. Mọi nhận xét phải kiểm chứng trước áp dụng.

Ruling: triển khai local độc lập bằng spec đã quan sát, giữ QA ảnh pending khi browser gate chặn — theo kế hoạch người dùng. Không coi typecheck/SSR là bằng chứng vị trí, focus hoặc Escape đã hoạt động trên browser.

## Kiểm tra local

Typecheck/build qua: typecheck-grammar-word-tap.log, build-grammar-word-tap.log.44/44 ca route/SSR qua trong test-grammar-word-tap.log; không phủ client interaction mới. invariant-grammar-word-tap.json:23 CSS nguồn/13 API/2 store không đổi/thêm/xoá. Production3001/session74740. AGY session9091 còn chạy ở lần poll cuối, chưa coi review hoàn tất.

## AGY đã hoàn tất, phản hồi đã đối chiếu

Session9091 exit0. Đã sửa aria-controls chỉ gắn trigger, fallback roving index khi text đổi và reset popup theo text; thay hr bằng separator span để giữ phrasing content; ngoài popup/trigger đóng, focus ra ngoài đóng; Tab trigger vào action đầu, Shift+Tab action đầu trở lại trigger. Resize/scroll gom theo requestAnimationFrame và cleanup frame/listener/observer.

Không áp dụng yêu cầu modal trap/aria-modal vì popup không modal và nằm trong dialog tài liệu khi nhúng. Không áp dụng nhận xét không có max-height: CSS đã có max-height/overflow. Text không có token không render key handler nên nhận xét modulo0 chưa có đường chạy. useLayoutEffect SSR warning chưa thấy trên build, không suy từ React phiên bản cũ. Transform ancestor/neo cần browser QA vẫn pending. Dynamic import dùng module cache của runtime, không tải lại toàn module mỗi token; loading UI giữ tới khi có kết quả exact-match.

Đây là sửa code có bằng chứng tĩnh; Tab/Escape/focus/resize mới chưa được kiểm trên browser. Typecheck sau sửa qua, build đang chạy session nêu trong lượt hiện hành. Không báo đã nghiệm thu interaction.

Build sau review đã exit0;44/44 ca kiểm tra qua trên production3001/session86134. Invariant CSS nguồn/API/store không đổi. Đây thay ghi chú build đang chạy. Browser QA vẫn pending.

## Nối learner overview

GrammarTopicFrame nay dùng chung GrammarWordTap cho các ví dụ Tổng quan, giữ highlightClass=text-primary thay vì underline gdr-focus của tài liệu. Không đổi text/VI, data-testid en-vi-en hay line-height nguồn. Guard Enter cấp trang đã bỏ qua role=button và defaultPrevented trước tích hợp, nên không sửa router/thuật toán học. Backup tại .ui-goal-backup/grammar-word-tap/GrammarTopicFrame-before-overview.tsx. Typecheck qua. Browser bốn viewport, focus/Enter thực và vị trí fixed trong các ancestor transform vẫn pending.

Nối overview: typecheck/build exit0 và44/44 test qua; invariant-grammar-overview-word-tap.json không đổi23 CSS nguồn/13 API/2 store. Production3001/session72121. Chưa có browser QA sau nối.
