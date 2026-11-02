"use client";

/**
 * DashboardHome — nội dung trang /tong-quan, 6 section theo spec BRIEFS-2:
 *   1-2. Top bar + hero: HomeHeader (ngày vi-VN, streak pill + 7 ô T2→CN,
 *        nút "Điểm danh" → checkIn(); h1 chào + banner ngữ pháp + "Học tiếp"
 *        deep-link tới bài kế tiếp chưa học theo progress.local).
 *   3.   "Hôm nay học gì?" — TodayDeck (7 card tính năng).
 *   4.   "Kế hoạch hôm nay." — PlanCard (5 mục, dữ liệu thật learningPath +
 *        Oxford 3000; đối chiếu hoàn thành qua progress.lessons).
 *   5.   Hàng 2 cột `.nbx-home-a`: RoadmapCard (Lộ trình) | XpRankCard (XP tuần).
 *   6.   "Bảng tin." — NewsFeedCard.
 *
 * Toàn bộ số liệu sống đọc từ 2 store demo (auth + progress), cập nhật qua
 * `aio:user-changed` / `aio:progress-changed`. Trước khi mount thì render
 * trạng thái 0 (giống SSR) để tránh lệch hydration.
 */
import { useEffect, useMemo, useRef, useState, type ReactElement } from "react";
import { getDemoUser, useDemoUserSync, type DemoUser } from "@/lib/store/auth";
import {
  checkIn,
  loadProgress,
  onProgressChange,
  type ProgressState,
} from "@/lib/store/progress";
import HomeHeader from "./HomeHeader";
import TodayDeck from "./TodayDeck";
import PlanCard, { type PlanItem } from "./PlanCard";
import RoadmapCard from "./RoadmapCard";
import XpRankCard from "./XpRankCard";
import NewsFeedCard from "./NewsFeedCard";

const FALLBACK_USER: DemoUser = {
  name: "Học viên demo",
  email: "demo@aioenglish.local",
  level: "A1",
  goal: "Hoàn thành B1",
  accent: "uk",
  minutesPerDay: 45,
  createdAt: 0,
};

/** Cùng chuẩn ISO với src/lib/store/progress.ts (toISOString().slice(0,10)). */
function isoOfDay(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function isoToday(): string {
  return isoOfDay(new Date());
}

function planItems(): PlanItem[] {
  return [
    {
      kind: "ngu-phap",
      kicker: "Ngữ pháp · Bài hướng dẫn",
      title: "Động từ to be: am, is, are",
      minutes: 6,
      href: "/ngu-phap/a1-to-be",
      courseId: "a1-to-be",
      isNext: true,
    },
    {
      kind: "go-cau",
      kicker: "Gõ câu",
      title: "Giới thiệu bản thân · Bài 1",
      minutes: 14,
      href: "/go-cau/lo-trinh-a1",
      courseId: "a1-intro",
    },
    {
      kind: "ngu-phap",
      kicker: "Ngữ pháp · Bài hướng dẫn",
      title: "Danh từ số nhiều",
      minutes: 6,
      href: "/ngu-phap/a1-plural-nouns",
      courseId: "a1-plural-nouns",
    },
    {
      kind: "go-cau",
      kicker: "Gõ câu",
      title: "Giới thiệu bản thân · Bài 1",
      minutes: 17,
      href: "/go-cau/lo-trinh-a1",
      courseId: "a1-greetings",
    },
    {
      kind: "tu-vung",
      kicker: "Từ mới · Oxford 3000 · A1",
      title: "20 từ mới",
      minutes: 10,
      href: "/tu-vung/oxford-3000-a1",
      courseId: "oxford-3000-a1",
    },
  ];
}

export default function DashboardHome(): ReactElement {
  const dashboardRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = dashboardRef.current;
    const rank = root?.querySelector<HTMLElement>(".rb");
    if (!root || !rank) return;
    const observer = new ResizeObserver(() =>
      root.style.setProperty(
        "--dashboard-rank-height",
        rank.getBoundingClientRect().height + "px",
      ),
    );
    observer.observe(rank);
    return () => observer.disconnect();
  }, []);
  const [user, setUser] = useState<DemoUser | null>(null);
  const [prog, setProg] = useState<ProgressState | null>(null);
  const [today, setToday] = useState<string>("");
  const [dateLabel, setDateLabel] = useState<string>("");

  useEffect(() => {
    const sync = (): void => {
      setUser(getDemoUser());
      setProg(loadProgress());
    };
    sync();
    // Ngày hiện tại chỉ set sau mount (client) để khớp hydration
    setToday(isoToday());
    setDateLabel(
      new Intl.DateTimeFormat("vi-VN", {
        weekday: "long",
        day: "2-digit",
        month: "2-digit",
      })
        .format(new Date())
        .replace(/^./, (c) => c.toUpperCase()),
    );
    const offUser = useDemoUserSync(sync);
    const offProg = onProgressChange(sync);
    return () => {
      offUser();
      offProg();
    };
  }, []);

  const p: ProgressState = prog ?? {
    xp: 0,
    weeklyXp: 0,
    streakDays: 0,
    lastCheckIn: null,
    checkInDays: [],
    minutesToday: { date: "", minutes: 0 },
    lessons: [],
    srs: {},
    vocabSeen: 0,
  };
  const goal = user?.goal ?? FALLBACK_USER.goal;

  const firstName =
    (user?.name ?? FALLBACK_USER.name).trim().split(/\s+/)[0] || "bạn";
  const checkedIn = today !== "" && p.lastCheckIn === today;

  const handleCheckIn = (): void => {
    // checkIn() tự chặn điểm 2 lần/ngày và phát sự kiện aio:progress-changed
    setProg(checkIn());
  };

  // Bài đã học hôm nay + set khóa đã hoàn thành (toàn bộ lịch sử lesson)
  const { doneToday, doneCourseIds, studiedDays, weekMinutes, weekDaysDone } =
    useMemo(() => {
      const todayIso = today || isoToday();
      const now = new Date();
      const dow = (now.getDay() + 6) % 7; // 0 = T2
      const monday = new Date(now);
      monday.setDate(now.getDate() - dow);
      monday.setHours(0, 0, 0, 0);
      const weekStart = monday.getTime();

      let minutes = 0;
      let todayCount = 0;
      const days = new Set<string>();
      const courses = new Set<string>();
      for (const l of p.lessons) {
        const d = isoOfDay(new Date(l.completedAt));
        days.add(d);
        if (d === todayIso) todayCount += 1;
        if (l.courseId) courses.add(l.courseId);
        if (l.completedAt >= weekStart)
          minutes += Math.max(1, Math.round(l.seconds / 60));
      }
      for (const d of p.checkInDays) days.add(d);
      let weekDays = 0;
      for (const d of days) {
        if (new Date(`${d}T00:00:00`).getTime() >= weekStart) weekDays += 1;
      }
      return {
        doneToday: todayCount,
        doneCourseIds: courses,
        studiedDays: [...days],
        weekMinutes: minutes,
        weekDaysDone: weekDays,
      };
    }, [p, today]);

  // Kế hoạch hôm nay
  const items = useMemo(planItems, []);

  // Nút "Học tiếp" (hero): deep-link tới bài kế tiếp chưa học; chưa xác định
  // được (trước mount / học hết pack / thiếu data) → giữ link cũ /ngu-phap.
  const continueHref = useMemo(() => "/ngu-phap/a1-to-be", [p.lessons]);

  // Lộ trình: % theo bài đã học (nguồn: path progress), chương hiện tại
  const lessonsDone = p.lessons.length;
  const percent = Math.min(100, Math.round((lessonsDone / 126) * 100));
  const chapter = 1;
  const chapterDone = 0;
  const chapterTotal = 26;

  return (
    <div ref={dashboardRef} className="ui-dashboard" data-dashboard>
      <HomeHeader
        date={dateLabel}
        firstName={firstName}
        streak={p.streakDays}
        checkInDays={p.checkInDays}
        studiedDays={studiedDays}
        /* Trước mount để rỗng: pill ẩn text, dot tuần renders key tĩnh —
           server và client render giống hệt nhau (an toàn hydration). */
        today={today}
        checkedIn={checkedIn}
        onCheckIn={handleCheckIn}
        continueHref={continueHref}
      />

      <TodayDeck />

      <div className="ui-dashboard-pair">
        <PlanCard
          items={items}
          doneToday={doneToday}
          doneCourseIds={doneCourseIds}
        />
        <RoadmapCard
          goal={goal}
          toward="chặng đường hoàn thành A1"
          percent={percent}
          lessonsDone={lessonsDone}
          vocabSeen={p.vocabSeen}
          chapter={chapter}
          chapterDone={chapterDone}
          chapterTotal={chapterTotal}
          etaText="Dự kiến khoảng 7 tháng"
          weekMinutes={weekMinutes}
          weekDaysDone={weekDaysDone}
        />
      </div>
      <div className="ui-home-bottom" data-home-rank>
        <XpRankCard />
        <NewsFeedCard />
      </div>
    </div>
  );
}
