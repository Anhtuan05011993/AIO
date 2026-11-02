"use client";
import Link from "next/link";
import { useState, type CSSProperties } from "react";
import GoalDialog from "../GoalDialog";
import {
  IconArrowRight,
  IconFlag,
  IconGraduationCap,
  IconPencil,
} from "../icons";
import DashboardArt from "./DashboardArt";
export type RoadmapCardProps = {
  goal: string;
  toward: string;
  percent: number;
  lessonsDone: number;
  vocabSeen: number;
  chapter: number;
  chapterDone: number;
  chapterTotal: number;
  etaText: string;
  weekMinutes: number;
  weekDaysDone: number;
};

export default function RoadmapCard({
  goal,
  toward,
  percent,
  lessonsDone,
  vocabSeen,
  chapter,
  chapterDone,
  chapterTotal,
  etaText,
  weekMinutes,
  weekDaysDone,
}: RoadmapCardProps) {
  const [editing, setEditing] = useState(false);
  return (
    <section
      className="nbx-blk nbx-r-goal nbx-pile nbx-alt hp"
      aria-labelledby="roadmap-h"
    >
      <div className="nbx-bh">
        <DashboardArt kind="path" />
        <h2 id="roadmap-h">Lộ trình.</h2>
        <div className="nbx-act">
          <Link
            className="nbx-lnk hp-open"
            href="/lo-trinh"
            aria-label="Mở Lộ trình"
          >
            Mở
            <IconArrowRight size={16} />
          </Link>
        </div>
      </div>
      <p className="nbx-pct">
        <b className="nbx-num">{percent}%</b>
        <span className="nbx-b">{toward}</span>
      </p>
      <div
        className="nbx-lvbar"
        role="progressbar"
        aria-label={"Tiến độ " + toward}
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className="nbx-bar">
          <i style={{ "--nb-x-p": percent + "%" } as CSSProperties} />
        </div>
        <span
          className="nbx-mark"
          style={{ "--nb-x-m": "80%" } as CSSProperties}
        >
          <i />
          <small>Kiểm tra lên cấp</small>
        </span>
      </div>
      <div className="nbx-kv2">
        <span>
          <small>Bài đã học</small>
          <b className="nbx-num">{lessonsDone}/126</b>
        </span>
        <span>
          <small>Từ đã học</small>
          <b className="nbx-num">{vocabSeen}/898</b>
        </span>
        <span title="Giới thiệu bản thân">
          <small>Chương {chapter}/8</small>
          <b className="nbx-num">
            {chapterDone}/{chapterTotal}
          </b>
        </span>
      </div>
      <button
        className="nbx-row hp-tgt"
        onClick={() => setEditing(true)}
        aria-label={"Mục tiêu: " + goal + ". Sửa mục tiêu"}
      >
        <IconFlag size={17} />
        <span className="nbx-tt">
          <b>Mục tiêu: {goal}</b>
          <small>{etaText}</small>
        </span>
        <IconPencil size={15} />
      </button>
      <Link
        className="nbx-btn nbx-b-sec nbx-wide hp-test"
        href="/lo-trinh/kiem-tra"
      >
        <IconGraduationCap size={18} />
        Kiểm tra lên cấp<span className="nbx-mut nbx-sm">36 câu, 40 phút</span>
      </Link>
      <div className="nbx-wk hp-wk" aria-label="Thời gian học tuần này">
        <div className="nbx-wk-h">
          <span>
            <b className="nbx-num">{weekMinutes}</b> phút tuần này
          </span>
          <span className="nbx-mut nbx-sm">
            Đạt mục tiêu {weekDaysDone}/7 ngày
          </span>
        </div>
        <div className="nbx-wk-b">
          {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((day, i) => (
            <span
              key={day}
              className={i === 6 ? "nbx-on" : ""}
              role="img"
              aria-label={day + ": 0 phút"}
            >
              <i style={{ "--nb-x-h": "0%" } as CSSProperties} />
              {day}
            </span>
          ))}
        </div>
      </div>
      {editing && <GoalDialog kind="goal" onClose={() => setEditing(false)} />}
    </section>
  );
}
