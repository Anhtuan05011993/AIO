# Nguồn data khóa học aioenglish.com — kết quả nghiên cứu GitHub (31/10/2026)

## Kết luận nhanh

| Phần nội dung | Nguồn công khai? | Repo/dataset | Khả năng dùng cho clone |
|---|---|---|---|
| Từ vựng Oxford 3000 (2.979 từ, A1–B2) | ✅ CÓ | `tyypgzl/Oxford-5000-words` → `full-word.json` (5.948 từ, có `level` CEFR A1–C2, audio UK/US, loại từ) | **Cao** — khớp cấu trúc cấp độ của site |
| Oxford 3000 (bản txt đơn giản) | ✅ CÓ | `sapbmw/The-Oxford-3000` → `The_Oxford_3000.txt` | Trung bình (thiếu level) |
| TOEIC 600 essential words | ✅ CÓ | `tranngocminhhieu/toeic-600-words-dataset` — CSV 619 từ: EN, loại từ, **nghĩa VN, IPA, ví dụ EN+VN, audio mp3 theo chủ đề** (nguồn gốc từ wordlist công khai của tienganhtflat.com) | **Cao** — có audio + nghĩa VN sẵn |
| CEFR vocab theo cấp (A1–C1) | ✅ CÓ | `Talhakasikci/cefr-vocabulary-dataset` — `vocab_json/en-{A1..C1}.json` (~60k từ, lemma + IPA + định nghĩa, nguồn oxford_3000_5000) | Cao |
| VN–EN dictionary JSON | ✅ CÓ | `samuraitruong/open-vn-en-dict` | Trung bình |
| Câu Gõ câu B1 (present perfect...) | ❌ KHÔNG | Tìm exact phrase không thấy repo nào | Tự soạn bởi đội ngũ site → dùng data đã extract từ API |
| Catalog Ngữ pháp A1–C2 | ❌ KHÔNG | — | Tự soạn → dùng data đã extract |
| Corpus song song EN-VN 270k (tienhapt/generalcorpus) | ⚠️ Có nhưng KHÔNG phù hợp | Encoding hỏng (mất dấu), văn phong báo chí/thuyết trình ≠ câu giảng dạy | Loại |

## Đã tải về local

- `docs/research/aioenglish/data/datasets/oxford-5000-full-word.json` — 5.948 từ, schema: `{value:{word, type, level(A1–C2), us/uk audio mp3+ogg, href}}`
- `docs/research/aioenglish/data/datasets/oxford-3000.txt` — danh sách từ đơn thuần
- `docs/research/aioenglish/data/datasets/toeic-600/` — CSV 619 từ (EN/type/VN/IPA/ví dụ/audio) + thư mục audio mp3 theo chủ đề
- `docs/research/aioenglish/data/datasets/cefr-vocab/` — JSON theo cấp en-A1→C1
- `docs/research/aioenglish/data/datasets/corpus270vn.zip` — corpus 270k (không dùng)
- `docs/research/aioenglish/data/api-course-crs_b60adbaa933635b8d0.json` — data 1 bài Gõ câu B1 (30 statements: EN, VN, IPA, acceptedAnswers, learningUnits word/phrase + partOfSpeech + explanationVi)
- `docs/research/aioenglish/data/api-course-crs_d5d9f4cb9dcf760b9e.json` — bài 2 (30 câu)
- `docs/research/aioenglish/data/api-course-crs_0008c8bbf528537cfd.json` — bài 3 (25 câu)
- `docs/research/aioenglish/data/api-pack-lo-trinh-b1.json` — **80 khóa** trong pack B1 (id/slug/title/số câu/tiers)
- `docs/research/aioenglish/data/api-tu-vung-oxford-3000.json` — cấu trúc 4 cấp × chủ đề của Oxford 3000
- `docs/research/aioenglish/data/api-ngu-phap-catalog.json` — catalog ngữ pháp (63KB)
- `docs/research/aioenglish/data/api-path.json` — cấu trúc lộ trình TOEIC 785 (43KB)

Data lesson player nằm trong app tại `src/lib/demo-data/go-cau/` (3 khóa + pack manifest, typed).

## API endpoints phát hiện được (cần cookie session)

- `GET /api/go-cau/course/{courseId}` — data 1 khóa gõ câu (statements + learningUnits + IPA)
- `GET /api/go-cau/pack/{packSlug}` — danh sách khóa trong pack
- `GET /api/tu-vung/course/{courseSlug}` — cấu trúc bộ từ vựng (groups → sets)
- `GET /api/ngu-phap/catalog` — catalog ngữ pháp
- `GET /api/path` — lộ trình học của user
- `GET /api/auth/session`, `/api/xep-hang`, `/api/promos`, `/api/ui-prefs`, `/api/online`, `/api/tts`

⚠️ **Rate-limit**: probe API nhanh → HTTP 429 block tạm thời. Pacing ≥3s giữa các call, fetch qua session đăng nhập trong browser.

## Kết quả trích data Gõ câu (31/10/2026)

- **40/80 khóa có data đầy đủ** (1.145 câu) — 3 khóa đầu trích tay + 37 khóa qua chain fetch pacing 3.5s trong page session.
- **40 khóa còn lại bị 429 block** khi trích (site chặn "hoạt động bất thường" theo IP; retry sau cooldown 60s/100s đều thất bại). File manifest `data/bulk/_manifest-ok.json`; khối lượng trong app: `src/lib/demo-data/go-cau/courses/` + `bulk-manifest.json`, load qua `getCourseAsync()` (dynamic import).
- Retry được trong phiên khác / khoảng thời gian khác khi block nhả.

## Quyết định cho clone

- **Giao diện**: clone trực tiếp từ HTML/CSS đã tải.
- **Lesson player Gõ câu**: dùng 3 khóa data thật từ API (85 câu) + pack manifest 80 khóa. Player tự triển khai tier word→phrase→sentence từ `learningUnits`, TTS = Web Speech API (offline), không gọi API nguồn.
- **Từ vựng (tương lai)**: Oxford 3000 dùng dataset GitHub ghép TOEIC-600 (có audio) + CEFR vocab JSON.
- **Không copy** nội dung sách/bản quyền bên ngoài vào clone.

