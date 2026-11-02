"use client";

/**
 * HomeHeader — card đầu trang /tong-quan (`.nbc-hd.is-home` trong `[data-home-flow]`):
 *   hàng 1: pill ngày (`.hm-date`) + widget điểm danh `.hck` (lửa streak +
 *           7 ô T2→CN + nút "Điểm danh");
 *   hàng 2: h1 "Chào {tên}, học tiếp nhé." + banner `.hm-exam`
 *           "Ngữ pháp: Động từ to be: am, is, are · Bài hướng dẫn,
 *           khoảng 6 phút" + nút vàng "Học tiếp" → deep-link bài kế tiếp chưa
 *           học (/go-cau/lo-trinh-b1/{courseId}); không xác định được → /ngu-phap.
 * Nguồn: shots/dashboard-logged-in.png + rules [data-home-flow] .nbc-hd.is-home
 * (entry.css/pages.css). Class .hck / .hm-exam / .hm-date của nguồn bị Vue-scoped
 * nên rule gốc được copy vào src/styles/custom/app.css.
 */
import Link from "next/link";
import decoration from "@/lib/ui-fixtures/home-decoration.json";
import { IconArrowRight, IconCheck, IconPlayCircle, FlameFill } from "../icons";

export type HomeHeaderProps = {
  /** "Thứ Bảy, 31/10" — Intl.DateTimeFormat vi-VN */
  date: string;
  firstName: string;
  streak: number;
  /** ISO dates (yyyy-mm-dd) đã điểm danh — 7 ô của tuần hiện tại */
  checkInDays: string[];
  /** ISO dates (yyyy-mm-dd) đã học (lesson records) — cũng tính vào ô ngày */
  studiedDays: string[];
  /** ISO ngày hôm nay (cùng chuẩn với store: toISOString().slice(0,10)) */
  today: string;
  checkedIn: boolean;
  onCheckIn: () => void;
  /** Link nút "Học tiếp": deep-link tới bài kế tiếp chưa học (bỏ trống → /ngu-phap) */
  continueHref?: string;
};

const WD = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"] as const;

/**
 * 7 ISO date của tuần hiện tại (Thứ Hai → Chủ nhật), suy ra từ `today` để
 * render tuần tự tương đương giữa server và client (trước mount `today` rỗng
 * → trả về key tĩnh, dot chưa tô).
 */
function weekDays(today: string): string[] {
  if (!today) return WD.map((_, i) => `wd-${i}`);
  const base = new Date(`${today}T00:00:00Z`);
  const dow = (base.getUTCDay() + 6) % 7; // 0 = T2
  const days: string[] = [];
  for (let i = 0; i < 7; i += 1) {
    const d = new Date(base);
    d.setUTCDate(base.getUTCDate() - dow + i);
    days.push(d.toISOString().slice(0, 10));
  }
  return days;
}

export default function HomeHeader({
  date,
  firstName,
  streak,
  checkInDays,
  studiedDays,
  today,
  checkedIn,
  onCheckIn,
  continueHref,
}: HomeHeaderProps) {
  const days = weekDays(today);
  const hot = streak > 0;
  return (
    <header className="nbc-hd nbx-f-home is-home nbx-home-hd">
      <span
        className="ui-source-decoration"
        aria-hidden="true"
        dangerouslySetInnerHTML={{ __html: decoration }}
      />
      <div className="nbc-hd-lead">
        <span className="nbc-chip is-ink hm-date">{date}</span>
        <button
          className={"hck nbx-r-heat" + (checkedIn ? "" : " is-go")}
          type="button"
          onClick={onCheckIn}
          disabled={checkedIn}
          aria-label={
            checkedIn
              ? "Đã điểm danh hôm nay"
              : "Điểm danh để giữ chuỗi ngày học"
          }
        >
          <span className={"hck-flame" + (hot ? "" : " is-cold")}>
            <span className="hck-fb" aria-hidden="true">
              <FlameFill />
            </span>
            <span className="hck-num">
              {hot ? (
                <>
                  <b className="hck-n">{streak}</b>
                  <small className="hck-nu">ngày</small>
                </>
              ) : (
                <small className="hck-nu">Chuỗi mới</small>
              )}
            </span>
          </span>
          <span className="hck-days" aria-hidden="true">
            {days.map((day, i) => {
              const on = checkInDays.includes(day) || studiedDays.includes(day);
              return (
                <span
                  key={day}
                  className={"hck-dc" + (day === today ? " is-today" : "")}
                >
                  <i
                    className={
                      "hck-d" + (on ? " is-on" : day < today ? " is-miss" : "")
                    }
                  />
                  <small className="hck-wd">{WD[i]}</small>
                </span>
              );
            })}
          </span>
          <span className="hck-end">
            <span className="hck-cta">
              {checkedIn ? (
                <IconCheck size={15} />
              ) : (
                <span aria-hidden="true">♧</span>
              )}
              {checkedIn ? "Đã điểm danh" : "Điểm danh"}
            </span>
          </span>
        </button>
      </div>
      <div className="nbc-hd-row is-top">
        <div className="nbc-hd-head">
          <div className="nbc-hd-tt">
            <h1>
              Chào {firstName}
              <span className="hm-tt-tail">, học tiếp nhé</span>.
            </h1>
          </div>
        </div>
        <div className="nbc-hd-cta">
          <img
            className="ui-home-mascot"
            src="/sites/aioenglish/brand/raccoon-head.svg"
            alt=""
          />
          <span className="nbx-nextl">
            <b>Ngữ pháp: Động từ to be: am, is, are</b>
            <small>Bài hướng dẫn, khoảng 6 phút</small>
          </span>
          <Link
            href={continueHref ?? "/ngu-phap/a1-to-be"}
            className="nbc-btn is-ink"
          >
            <IconPlayCircle size={18} />
            Học tiếp
            <IconArrowRight size={18} />
          </Link>
        </div>
      </div>
    </header>
  );
}
