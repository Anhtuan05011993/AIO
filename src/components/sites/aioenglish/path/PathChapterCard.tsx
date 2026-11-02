"use client";

/**
 * PathChapterCard — một chương của bản đồ lộ trình /lo-trinh (Agent E1).
 *
 * Card = `.nbx-blk.nbx-chap` (bề mặt + padding của .nbx-chap trong entry.css)
 * + 1 class accent pastel theo chương (`lp-acz-1..6` / `lp-acl-1..5` tái dùng
 * biến --zone-N / --land-N của source). Header là nút accordion
 * `.nbx-ch-h` (ô số `.nbx-num` + `.nbx-tt`), thân là `ul.lp-units` — mỗi `li`
 * giữ chấm tròn gốc của `.nbx-chap li:before`, trạng thái unit:
 *   - is-done  : đã học (courseId nằm trong progress.lessons)
 *   - is-now   : unit kế tiếp (learningPath.here / hàng đầu tiên chưa xong)
 *   - is-open  : tới lượt học, có "Vào học" nếu khóa có data
 *   - is-nodata: khóa chưa có data demo → mờ + tooltip "Chưa có data (demo)"
 *   - is-locked: nằm ở chương sau chương hiện tại → mờ + ổ khóa
 */
import Link from "next/link";
import type { ReactElement } from "react";
import { IconBookOpen, IconCheck, IconKeyboard } from "../app/icons";
import type { PathRow } from "@/lib/demo-data/learningPath";

export type UnitState = "done" | "now" | "open" | "nodata" | "locked";

export type UnitView = {
  row: PathRow;
  state: UnitState;
  /** Link "Vào học" — null với unit không data / đã xong / đang khóa */
  href: string | null;
  /** Tiêu đề hiển thị: typing → partTitle, ngữ pháp → title */
  display: string;
  /** Kicker theo nguồn: "Gõ câu · Bài 1" / "Ngữ pháp · Bài hướng dẫn" */
  kicker: string;
};

export type ChapterState = "current" | "done" | "locked" | "open";

export type ChapterView = {
  index: number;
  label: string;
  total: number;
  doneCount: number;
  demoMinutes: number;
  state: ChapterState;
  units: UnitView[];
};

type PathChapterCardProps = {
  view: ChapterView;
  open: boolean;
  onToggle: (index: number) => void;
};

function ChevronIcon(): ReactElement {
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
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function LockIcon(): ReactElement {
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
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

export default function PathChapterCard({ view, open, onToggle }: PathChapterCardProps): ReactElement {
  const panelId = `lp-ch-panel-${view.index}`;
  const accent = view.index <= 6 ? `lp-acz-${view.index}` : `lp-acl-${view.index - 6}`;

  return (
    <article className={`nbx-blk nbx-chap ${accent}`}>
      <button
        type="button"
        className="nbx-ch-h lp-chh"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => onToggle(view.index)}
      >
        <span className="nbx-num" aria-hidden="true">
          {view.index}
        </span>
        <span className="nbx-tt">
          <b>{view.label}</b>
          <small>
            {view.doneCount}/{view.total} bài · ~{view.demoMinutes} phút
          </small>
        </span>
        <span className="lp-chright">
          {view.state === "current" ? <span className="nbx-chip nbx-plain">Đang học</span> : null}
          {view.state === "done" ? (
            <span className="nbx-chip nbx-plain" aria-label="Đã xong">
              <IconCheck size={14} className="nbx-ic" />
            </span>
          ) : null}
          {view.state === "locked" ? (
            <span className="lp-lock" role="img" aria-label="Đã khóa">
              <LockIcon />
            </span>
          ) : null}
          <span className="lp-chev" aria-hidden="true">
            <ChevronIcon />
          </span>
        </span>
      </button>

      {open ? (
        <ul id={panelId} className="lp-units">
          {view.units.map((u) => {
            const isTyping = u.row.feature === "go-cau";
            return (
              <li
                key={u.row.key}
                className={`lp-unit is-${u.state}`}
                title={u.state === "nodata" ? "Chưa có data (demo)" : undefined}
              >
                <span
                  className={`nbx-tile nbx-s30 ${isTyping ? "nbx-f-go" : "nbx-f-gram"}`}
                  aria-hidden="true"
                >
                  {u.state === "done" ? (
                    <IconCheck size={15} className="nbx-ic" />
                  ) : isTyping ? (
                    <IconKeyboard size={15} className="nbx-ic" />
                  ) : (
                    <IconBookOpen size={15} className="nbx-ic" />
                  )}
                </span>
                <span className="lp-utx">
                  <small className="lp-kick">{u.kicker}</small>
                  {u.href ? (
                    <Link
                      href={u.href}
                      className="lp-ut"
                      title={u.row.title}
                      aria-label={`Vào học: ${u.row.title}`}
                    >
                      {u.display}
                    </Link>
                  ) : (
                    <b className="lp-ut">{u.display}</b>
                  )}
                </span>
                <span className="lp-um">
                  {u.state === "now" ? (
                    <span className="nbx-chip nbx-mark">Tiếp theo</span>
                  ) : (
                    <span>~{u.row.minutes} phút</span>
                  )}
                  {u.state === "locked" ? (
                    <span className="lp-lock">
                      <LockIcon />
                    </span>
                  ) : null}
                </span>
              </li>
            );
          })}
        </ul>
      ) : null}
    </article>
  );
}
