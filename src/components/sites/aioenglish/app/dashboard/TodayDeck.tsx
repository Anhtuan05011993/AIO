/**
 * TodayDeck — mục "Hôm nay học gì?": tiêu đề + ghi chú tay `.nbx-mnote`
 * và lưới 7 card `.nbx-fcard` (`.nbx-deck`, 7 cột) với chip số liệu, minh hoạ
 * `.hda` (deckArt.tsx — markup nguyên văn từ home.html) và linh vật
 * `.nbx-fcrit` (gate/critters.tsx).
 * Text thẻ lấy nguyên văn từ home.html (card tính năng landing).
 */
import Link from "next/link";
import type { CSSProperties, ReactElement } from "react";
import { critters } from "../../gate/critters";
import { DeckArt } from "./deckArt";

type DeckCard = {
  key: string;
  href: string;
  chip: string;
  title: string;
  blurb: string;
  accent: string;
};

const CARDS: DeckCard[] = [
  { key: "go-cau", href: "/go-cau", chip: "30.519 câu", title: "Gõ câu", blurb: "Gõ lại câu mẫu, sai đâu sửa đó", accent: "nbx-f-go" },
  { key: "tu-vung", href: "/tu-vung", chip: "10.929 thẻ", title: "Từ vựng", blurb: "Học từ mới, ôn khi sắp quên", accent: "nbx-f-voc" },
  { key: "ngu-phap", href: "/ngu-phap", chip: "A1 đến C2", title: "Ngữ pháp", blurb: "Học từng bước, đủ mọi cấp", accent: "nbx-f-gram" },
  { key: "doc-dich", href: "/luyen-dich-thuat", chip: "266 bài", title: "Đọc & dịch", blurb: "Báo song ngữ, dịch có chấm điểm", accent: "nbx-f-read" },
  { key: "video", href: "/video", chip: "1.166 video", title: "Video", blurb: "Một video, bốn cách học", accent: "nbx-f-vid" },
  { key: "tu-dien", href: "/tu-dien", chip: "Tra mọi trang", title: "Từ điển", blurb: "Nghĩa, cách đọc và ví dụ", accent: "nbx-f-dict" },
  { key: "lo-trinh", href: "/lo-trinh", chip: "167 trạm", title: "Lộ trình", blurb: "A1 đến C1, theo từng chương", accent: "nbx-f-path" },
];

export default function TodayDeck(): ReactElement {
  return (
    <section className="nbx-today hnb" data-home-deck aria-labelledby="today-deck-h">
      <div className="nbx-today-h">
        <h2 id="today-deck-h">Hôm nay học gì?</h2>
        <span className="nbx-mnote" aria-hidden="true">
          Mỗi ngày một chút, đều đặn là được.
        </span>
      </div>
      <ul className="nbx-deck hnb-row">
        {CARDS.map((c) => {
          const Critter = critters[c.key];
          return (
            <li className="hnb-li" key={c.key}>
              <Link
                href={c.href}
                className={`nbx-fcard hnc ${c.accent}`}
                data-feature={c.key}
                data-deck-key={c.key}
                style={{ "--fc": `var(--feat-${c.key})` } as CSSProperties}
              >
                <span className="nbx-chip nbx-lvl" data-deck-badge>
                  {c.chip}
                </span>
                <b data-deck-title>{c.title}</b>
                <small data-deck-blurb data-deck-short>
                  {c.blurb}
                </small>
                <span className="nbx-froom" aria-hidden="true" />
                <span className="nbx-fart nbx-pp" aria-hidden="true" data-deck-art>
                  <DeckArt k={c.key} />
                </span>
                <span className="nbx-fcrit" aria-hidden="true">
                  <div data-critter data-feature={c.key} className="fc-wrap fc-peek" style={{ "--fc": `var(--feat-${c.key})` } as CSSProperties}>
                    <Critter />
                  </div>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
