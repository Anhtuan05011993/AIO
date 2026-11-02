"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getDemoUser } from "@/lib/store/auth";
import { IconBookOpen, IconKeyboard, IconLayers, IconMore } from "../icons";
import GoalDialog from "../GoalDialog";
import DashboardArt from "./DashboardArt";
export type PlanItem = {
  kind: string;
  kicker: string;
  title: string;
  minutes: number | null;
  href: string;
  courseId: string;
  isNext?: boolean;
};
export type PlanCardProps = {
  items: PlanItem[];
  doneToday: number;
  doneCourseIds: Set<string>;
};
export default function PlanCard({
  items,
  doneToday,
  doneCourseIds,
}: PlanCardProps) {
  const [deferred, setDeferred] = useState<Set<string>>(new Set());
  const [editing, setEditing] = useState(false);
  const [minutes, setMinutes] = useState(45);
  useEffect(() => {
    setMinutes(getDemoUser()?.minutesPerDay ?? 45);
  }, [editing]);
  const visible = items.filter((i) => !deferred.has(i.courseId));
  return (
    <section
      className="nbx-blk nbx-r-ref nbx-dots nbx-pile htp"
      aria-labelledby="plan-h"
    >
      <i className="nbx-tape" aria-hidden="true" />
      <div className="nbx-bh htp-head">
        <DashboardArt kind="plan" />
        <h2 id="plan-h">Kế hoạch hôm nay.</h2>
        <div className="nbx-act">
          <p className="nbx-stamp htp-stamp">
            <b className="nbx-num">
              {Math.min(doneToday, visible.length)}/{visible.length}
            </b>
            <small>bài</small>
          </p>
        </div>
      </div>
      <ol className="nbx-plan htp-list">
        {visible.map((item) => (
          <li className="htp-li" key={item.courseId}>
            <div
              className={
                "nbx-row htp-row is-go" +
                (item.isNext ? " nbx-on" : "") +
                (doneCourseIds.has(item.courseId) ? " nbx-done" : "")
              }
            >
              <span
                className={
                  "nbx-tile nbx-s30 htp-tile " +
                  (item.kind === "go-cau"
                    ? "nbx-f-go"
                    : item.kind === "tu-vung"
                      ? "nbx-f-voc"
                      : "nbx-f-gram")
                }
                aria-hidden="true"
              >
                {item.kind === "go-cau" ? (
                  <IconKeyboard size={15} />
                ) : item.kind === "tu-vung" ? (
                  <IconLayers size={15} />
                ) : (
                  <IconBookOpen size={15} />
                )}
              </span>
              <span className="nbx-tt htp-txt">
                <small className="htp-kick">{item.kicker}</small>
                <Link
                  className="htp-go"
                  href={item.href}
                  aria-label={"Vào học: " + item.title}
                >
                  <b>{item.title}</b>
                </Link>
              </span>
              {item.isNext ? (
                <span className="nbx-chip nbx-mark nbx-nx htp-st">
                  Tiếp theo
                </span>
              ) : (
                <span className="nbx-tm htp-st">~{item.minutes} phút</span>
              )}
              <details
                className="ui-plan-menu htp-more-wrap"
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    e.currentTarget.open = false;
                    e.currentTarget.querySelector("summary")?.focus();
                  }
                }}
              >
                <summary
                  className="htp-more"
                  aria-label={"Tuỳ chọn cho bài " + item.title}
                >
                  <IconMore size={18} />
                </summary>
                <div className="ui-menu-options">
                  <button
                    onClick={() =>
                      setDeferred((old) => new Set([...old, item.courseId]))
                    }
                  >
                    Để hôm khác
                  </button>
                </div>
              </details>
            </div>
          </li>
        ))}
      </ol>
      {deferred.size > 0 && (
        <button className="nbx-lnk" onClick={() => setDeferred(new Set())}>
          Thêm lại {deferred.size} bài đã để hôm khác
        </button>
      )}
      <div className="nbx-dayline htp-day">
        <span className="nbx-b nbx-nw">
          Hôm nay <span className="nbx-num">0</span>/{minutes} phút
        </span>
        <div
          className="nbx-bar nbx-hatch nbx-sp"
          role="progressbar"
          aria-valuenow={0}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Thời gian học hôm nay"
        >
          <i style={{ width: 0 }} />
        </div>
        <button
          className="nbx-lnk nbx-sm htp-pace"
          aria-label={"Mục tiêu " + minutes + " phút mỗi ngày, bấm để sửa"}
          onClick={() => setEditing(true)}
        >
          {minutes} phút/ngày ⌄
        </button>
      </div>
      {editing && (
        <GoalDialog kind="minutes" onClose={() => setEditing(false)} />
      )}
    </section>
  );
}
