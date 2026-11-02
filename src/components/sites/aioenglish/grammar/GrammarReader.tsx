/**
 * GrammarReader — trang đọc bài ngữ pháp /ngu-phap/[node] (Agent E3).
 *
 * Server component (không có tương tác): nhận GrammarLesson đã dựng từ
 * buildGrammarLesson() (catalog + khóa gõ câu liên quan + nội dung demo).
 *
 * Cấu trúc:
 *   1. Hàng quay về (.lp-backrow → "Về Luyện ngữ pháp").
 *   2. Card tiêu đề .nbx-blk + palette cấp (nbx-lv-a1/nbx-lv-b1) + nbx-dots —
 *      tile ngữ pháp + tiêu đề node + chip cấp (nbx-chip.nbx-lvl.nbx-lv-*);
 *      dòng .nbx-lvd mô tả (titleEn · chủ đề · nhóm · phút đọc).
 *   3. Card "Tóm tắt." — .nbx-sense intro + ul bullet (nội dung demo, gắn nhãn
 *      chip "Nội dung demo").
 *   4. Card "Ví dụ minh hoạ." — .nbx-rows câu EN/VN: thật từ khóa gõ câu khi có
 *      (kèm nguồn), hoặc soạn sẵn cho demo.
 *   5. Card "Luyện tập theo 4 chế độ." — .nbx-stat4 (biến đổi / sửa lỗi / điền
 *      chỗ trống / trắc nghiệm) + tổng.
 *   6. Card khóa liên quan (nếu map được): .nbx-row "Vào học" cho từng khóa +
 *      CTA .nbx-btn.nbx-wide "Luyện gõ câu liên quan".
 *   7. Hàng quay về cuối trang.
 *
 * Class gốc entry.css: nbx-hc/nbx-hb, nbx-blk (+nbx-r-info/nbx-r-goal/nbx-dots),
 * nbx-row-flex, nbx-tile/nbx-f-gram/nbx-f-go, nbx-disp, nbx-sp, nbx-chip
 * (nbx-plain + nbx-lv-*), nbx-lvd, nbx-sense, nbx-exm, nbx-stat4, nbx-btn
 * (nbx-wide), nbx-row, nbx-bh. Bổ sung lp-* ở grammar.css.
 */
import Link from "next/link";
import type { ReactElement } from "react";
import type { GrammarLesson } from "@/lib/demo-data/grammar/lesson";
import {
  IconArrowRight,
  IconBookOpen,
  IconClipboardList,
  IconKeyboard,
  IconNotebook,
  IconPencil,
} from "../app/icons";
import "../../../../styles/custom/grammar.css";

function QuoteIcon({ className }: { className?: string }): ReactElement {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="none"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path d="M10 7H6.5A3.5 3.5 0 0 0 3 10.5v.5A3.5 3.5 0 0 0 6.5 14H8a4 4 0 0 1-4 3v1c3.6 0 6-2.4 6-6V7z" />
      <path d="M21 7h-3.5A3.5 3.5 0 0 0 14 10.5v.5a3.5 3.5 0 0 0 3.5 3H19a4 4 0 0 1-4 3v1c3.6 0 6-2.4 6-6V7z" />
    </svg>
  );
}

function BackIcon(): ReactElement {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M19 12H5" />
      <path d="m12 19-7-7 7-7" />
    </svg>
  );
}

function BackRow(): ReactElement {
  return (
    <div className="lp-backrow">
      <Link href="/ngu-phap" className="lp-back">
        <span className="lp-back-ic" aria-hidden="true">
          <BackIcon />
        </span>
        Về Luyện ngữ pháp
      </Link>
    </div>
  );
}

const LV_CHIP: Record<string, string> = {
  A1: "nbx-lv-a1",
  A2: "nbx-lv-a2",
  B1: "nbx-lv-b1",
  B2: "nbx-lv-b2",
  C1: "nbx-lv-c1",
  C2: "nbx-lv-c2",
};

export default function GrammarReader({ lesson }: { lesson: GrammarLesson }): ReactElement {
  const { node, topic, group, intro, points, examples, examplesFromCourse, related, totalExercises, isReal, worked } =
    lesson;
  const lvChip = LV_CHIP[node.level] ?? "";

  return (
    <div className="nbx-hc nbx-hb lp-gram-r">
      <BackRow />

      <section className={`nbx-blk ${lvChip} nbx-dots`} aria-labelledby="gram-r-h">
        <div className="nbx-row-flex">
          <span className="nbx-tile nbx-f-gram" aria-hidden="true">
            <IconBookOpen size={17} />
          </span>
          <h1 id="gram-r-h" className="nbx-disp">
            {node.title}
          </h1>
          <span className="nbx-sp" />
          <span className={`nbx-chip nbx-lvl ${lvChip}`}>{node.level}</span>
        </div>
        <p className="nbx-lvd lp-lede">
          {node.titleEn}
          {topic ? ` · Chủ đề: ${topic.title}` : ""}
          {group ? ` · Nhóm: ${group.label}` : ""}
          {topic ? ` · ~${topic.readMinutes} phút đọc` : ""}
        </p>
      </section>

      <section className="nbx-blk nbx-r-ivory" aria-labelledby="gram-sum-h">
        <div className="nbx-sense">
          <div className="nbx-bh lp-sec-h">
            <h2 id="gram-sum-h" className="nbx-disp">
              Tóm tắt.
            </h2>
            {isReal ? (
              <span className="nbx-chip nbx-plain" title="Nội dung trích từ bài học gốc của aioenglish.com">
                Nội dung thật
              </span>
            ) : (
              <span className="nbx-chip nbx-plain lp-demo-chip" title="Phần giải thích do bản demo biên soạn">
                Nội dung demo
              </span>
            )}
          </div>
          {intro.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
          {points.length > 0 ? (
            <ul className="lp-points">
              {points.map((pt, i) => (
                <li key={i}>{pt}</li>
              ))}
            </ul>
          ) : null}
        </div>
      </section>

      <section className="nbx-blk nbx-r-ivory" aria-labelledby="gram-ex-h">
        <div className="nbx-sense">
          <div className="nbx-bh lp-sec-h">
            <h2 id="gram-ex-h" className="nbx-disp">
              Ví dụ minh hoạ.
            </h2>
            {isReal ? (
              <span className="nbx-bh-sub">Câu thật từ bài học gốc của aioenglish.com</span>
            ) : examplesFromCourse ? (
              <span className="nbx-bh-sub">Câu thật từ các khóa gõ câu liên quan</span>
            ) : (
              <span className="nbx-chip nbx-plain lp-demo-chip" title="Câu ví dụ do bản demo biên soạn">
                Nội dung demo
              </span>
            )}
          </div>
          <div className="lp-examples">
            {examples.map((ex, i) => (
              <div key={i} className="nbx-row nbx-exm lp-exm">
                <QuoteIcon className="nbx-ic lp-quote" />
                <span className="nbx-tt">
                  <b>{ex.en}</b>
                  <small>
                    {ex.vi}
                    {ex.source ? ` — từ khóa “${ex.source}”` : ""}
                  </small>
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {worked.length > 0 ? (
        <section className="nbx-blk nbx-r-ivory" aria-labelledby="gram-worked-h">
          <div className="nbx-sense">
            <div className="nbx-bh lp-sec-h">
              <h2 id="gram-worked-h" className="nbx-disp">
                Ví dụ từng bước.
              </h2>
              <span className="nbx-bh-sub">{worked.length} ví dụ có hướng dẫn</span>
            </div>
            <div className="lp-worked">
              {worked.map((w, i) => (
                <div key={i} className="nbx-row nbx-exm lp-exm lp-worked-item">
                  <QuoteIcon className="nbx-ic lp-quote" />
                  <span className="nbx-tt">
                    <b>{w.source}</b>
                    <small>{w.sourceVi}</small>
                    <ol className="lp-worked-steps">
                      {w.steps.map((s, j) => (
                        <li key={j}>
                          {s.do}
                          <b className="lp-worked-res">{s.result ? ` → ${s.result}` : ""}</b>
                        </li>
                      ))}
                    </ol>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="nbx-blk nbx-r-ivory" aria-labelledby="gram-prac-h">
        <div className="nbx-bh lp-sec-h">
          <h2 id="gram-prac-h" className="nbx-disp">
            Luyện tập theo 4 chế độ.
          </h2>
          <span className="nbx-bh-sub">{totalExercises} bài tập</span>
        </div>
        <div className="nbx-stat4">
          <span>
            <IconPencil size={16} className="nbx-ic" aria-hidden="true" />
            <small>{node.counts.transform}</small>
            <b>Biến đổi câu</b>
          </span>
          <span>
            <IconNotebook size={16} className="nbx-ic" aria-hidden="true" />
            <small>{node.counts.fix}</small>
            <b>Sửa lỗi</b>
          </span>
          <span>
            <IconClipboardList size={16} className="nbx-ic" aria-hidden="true" />
            <small>{node.counts.gap}</small>
            <b>Điền chỗ trống</b>
          </span>
          <span>
            <IconBookOpen size={16} className="nbx-ic" aria-hidden="true" />
            <small>{node.counts.choice}</small>
            <b>Trắc nghiệm</b>
          </span>
        </div>
        <div className="lp-gp-cta">
          <Link href={`/ngu-phap/${node.id}/luyen-tap`} className="nbx-btn nbx-b-pri">
            Vào phòng luyện tập
            <IconArrowRight size={15} />
          </Link>
          <small>Bài giảng có hướng dẫn + 4 chế độ trên bài tập thật, có giải thích từng câu.</small>
        </div>
      </section>

      {related.length > 0 ? (
        <section className="nbx-blk nbx-r-goal nbx-dots" aria-labelledby="gram-rel-h">
          <div className="nbx-bh lp-sec-h">
            <h2 id="gram-rel-h" className="nbx-disp">
              Luyện gõ câu liên quan.
            </h2>
            <span className="nbx-bh-sub">{related.length} khóa có dữ liệu</span>
          </div>
          <ul className="lp-rel">
            {related.map((c) => (
              <li key={c.id}>
                <Link href={c.href} className="nbx-row lp-rel-row">
                  <span className="nbx-tile nbx-f-go" aria-hidden="true">
                    <IconKeyboard size={15} />
                  </span>
                  <span className="nbx-tt">
                    <b>{c.title}</b>
                    <small>{c.statementCount} câu · Lộ trình B1</small>
                  </span>
                  <span className="nbx-chip nbx-plain lp-go-chip">
                    Vào học
                    <IconArrowRight size={13} className="nbx-ic" aria-hidden="true" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <Link href={related[0].href} className="nbx-btn nbx-wide">
            <IconKeyboard size={18} className="nbx-ic" aria-hidden="true" />
            Luyện gõ câu liên quan
            <span className="nbx-mut">{related[0].title}</span>
          </Link>
        </section>
      ) : null}

      <BackRow />
    </div>
  );
}
