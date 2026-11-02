# BRIEFS-5 — Fidelity pass: app đã đăng nhập (31/10/2026, buổi tối)

Khảo sát bản thật đã login (IAB, session user). So với clone, các hub tính năng
KHÁC NHAU CẤU TRÚC đáng kể. Ghi lại để sửa dần — mục nào chưa có data local thì
đánh dấu "Chưa trích" (kho dữ liệu nằm sau API bị rate-limit; trích bằng console
snippet như grammar/reading).

## Nguồn → clone (route map đã chụp)

| Route thật | Cấu trúc thật (đã chụp DOM) | Local hiện tại | Xử lý |
|---|---|---|---|
| /go-cau | Hero "Bắt đầu A1" + 3 bullets; **Lộ trình đề xuất** 5 bộ (A1 2.787 / A2 2.480 / B1 2.422 / B2 2.719 / C1 1.765 câu, progress từng cấp); **Thư viện bộ câu** 2 nhóm: Tình huống đời sống (12 bộ, /go-cau/{slug}) + Môi trường công việc (10 bộ) | FeatureGate → redirect lo-trinh-b1 | ✅ REBUILD GoCauHub |
| /tu-vung | Tabs Tôi/Từ vựng; **Hôm nay cần ôn** (SRS); **Phát âm IPA** 3 nhóm (Dễ 15 / Vừa 13 / Khó 22 âm → /tu-vung/phat-am); **Bộ từ vựng đề xuất** (oxford-3000, oxford-5000-nang-cao); **Theo mục tiêu thi**: 8 chủ đề + 5 band IELTS + 4 band TOEIC + phrasal/collocations/idioms/AWL | VocabHub 5 deck (đoán) | ✅ REBUILD theo thật |
| /ngu-phap | "Khởi đầu." (hành trình A1 tuần tự, node đầu "Học tiếp") + "Các cấp tiếp theo." + chip "0/167 điểm đã nắm" | GrammarHub tab cấp + grid topic | ⏳ round sau |
| /video | Tabs Tôi/Khám phá; **thư viện 1.215 video thật** (kho + kênh, duration, ?lucky=1 ngẫu nhiên); "Gợi ý bắt đầu" ~10 video; "Bốn cách học" | 4 bài demo + paste workspace | ⏳ cần trích kho video |
| /lo-trinh | Tabs Hành trình/Kiến thức; tabs cấp A1..C1 "Đang học"; mục tiêu ngày 30/45/60/180; **Mục lục A1 trộn Ngữ pháp + Gõ câu** (crs A1 pack!); "Đã bỏ qua" | E1 hub | ⏳ cần pack lo-trinh-a1/a2/b2/c1 |
| /ban-be | "Kế hoạch hôm nay" (deep-link ?ke-hoach=...), "Hoàn thành A1 · Lộ trình học", Bạn bè + gợi ý kết bạn, link mời | TienDoBanBe | gần, ⏳ polish |
| /cai-dat | 8 section: Hồ sơ / Bạn bè / Trình độ (IELTS/TOEIC/Chưa rõ + A1..C1) / Mục tiêu hằng ngày / Giọng / Giao diện / Quyền riêng tư / Tài khoản | CaiDat | gần, ⏳ polish |
| /tu-vung/phat-am | 3 nhóm âm (Dễ 0/15 · Vừa 0/13 · Khó 0/22) + slot từng âm | chưa có | ✅ stub + "Chưa trích" |

## Data còn cần trích (console snippet, sau này)

1. Pack lộ trình: `/api/go-cau/pack/lo-trinh-a1|a2|b2|c1` (B1 đã có — 80 khóa).
2. 22 bộ câu: `/api/go-cau/pack/{slug}`? (đoán — xác nhận bằng probe) — 22 bộ × ~810 câu.
3. Kho video: ~1.215 mục (endpoint unknown — probe).
4. Decks từ vựng thật: oxford-3000 (3000 từ), oxford-5000-nang-cao, 8 chu-de, 5 ielts-band, 4 toeic-band, phrasal-verbs, collocations, idioms, awl (endpoint `/api/tu-vung/...` chưa probe).
5. Phát âm IPA: 50 âm + ví dụ.

## Metadata /go-cau (chụp 31/10) — dùng cho GoCauHub

Lộ trình: A1 "Tiếng Anh cho người mới" (Chào hỏi, giới thiệu bản thân; chip "Gợi ý bắt đầu", nút Bắt đầu) · A2 "Tiếng Anh cơ bản" (Mua sắm, đi lại, việc hằng ngày) · B1 "Tiếng Anh trung cấp" (Kể chuyện đã qua, nói kế hoạch) · B2 "Tiếng Anh trung cao" (Nêu ý kiến và giải thích lý do) · C1 "Tiếng Anh nâng cao" (Bàn chủ đề khó, nói tinh tế hơn). Progressbar + "Chưa bắt đầu".

Bộ câu — Tình huống đời sống (12): Du lịch 1.078 / Nhà hàng - Ẩm thực 725 / Mua sắm 758 / Y tế & Sức khoẻ 815 / Nhà cửa & Gia đình 806 / Thời tiết 809 / Giao thông 805 / Ngân hàng & Tài chính cá nhân 790 / Hẹn hò & Các mối quan hệ 802 / Cảm xúc & tính cách 794 / Sự kiện & lễ hội 832 / Mua nhà & Thuê nhà 845.
Bộ câu — Môi trường công việc (10): Văn phòng 1.096 / Email công việc 829 / Họp hành & Thuyết trình 833 / Phỏng vấn xin việc 831 / Đàm phán 804 / Networking 780 / Marketing & Sales 835 / IT & Công nghệ 817 / Tài chính & Kế toán 817 / Giáo dục 845.
Chú thích cuối: "Chọn bộ gần với việc bạn đang làm nhất." Hero bullets: "Nghe trước, gõ sau" / "Chấm từng từ khi gõ" / "Ba chế độ tuỳ chọn".

## Metadata /tu-vung (chụp 31/10)

Tabs: ?tab=cua-toi "Từ vựng của tôi" / ?tab=de-xuat "Từ vựng" (mặc định). Sections:
"Hôm nay cần ôn." · "Phát âm IPA." (Dễ "Âm quen với người Việt" 0/15 · tiếp /iː/ sheep; Vừa "Âm hay đọc lệch" 0/13 · /e/ /ɒ/; Khó "Âm khó và âm cuối" 0/22 · /ɪ/ /æ/) · "Bộ từ vựng đề xuất." (Oxford 3000 "3000 từ tiếng Anh cốt lõi quan trọng nhất, xếp theo cấp độ"; Oxford 5000 nâng cao "2000 từ mở rộng ngoài Oxford 3000") · "Theo mục tiêu thi và mở rộng.":
- Chủ đề: chu-de-travel Du lịch 146 / business Kinh doanh 203 / daily-life Đời sống hằng ngày 174 / technology Công nghệ 107 / health Sức khỏe 169 / food Ẩm thực 151 / education Giáo dục 112 / environment Môi trường 127 (đều A1-C1)
- IELTS: band-1-25 A1 898 / band-3-35 A2 803 / band-4-5 B1 768 / band-55-65 B2 1.570 / band-7-plus C1 1.414
- TOEIC: 120-224 A1 898 / 225-549 A2 794 / 550-784 B1 695 / 785+ B2-C1 2.584
- Mở rộng: phrasal-verbs-thong-dung Cụm động từ thông dụng A1-C2 1.330 / collocations-hoc-thuat Cụm từ cố định học thuật A2-C1 2.836 / idioms-thong-dung Thành ngữ thông dụng A2-C2 1.543 / awl-sublist Academic Word List (count chưa chụp)

## Đã xử lý đợt này

- /go-cau → GoCauHub (gate khi khách; hub 5 lộ trình + 22 bộ câu khi login; lộ trình thiếu data → trang stub "Chưa trích").
- /tu-vung → VocabHub v2 theo cấu trúc thật (tabs + Hôm nay cần ôn + IPA + nhóm deck; deck có data → local, chưa → "Chưa trích").
- /tu-vung/phat-am → stub trang 3 nhóm âm.
- /ngu-phap, /lo-trinh, /video, /ban-be, /cai-dat: ⏳ round sau (cần data hoặc polish riêng).
