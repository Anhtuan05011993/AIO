"use client";

// Public profile — /@handle (rewritten by middleware to /profile?handle=...).
// Demo: shows the local demo user's stats; a foreign handle renders the not-found note.

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { getDemoUser, useDemoUserSync, type DemoUser } from "@/lib/store/auth";
import {
  loadProgress,
  onProgressChange,
  type ProgressState,
} from "@/lib/store/progress";
import { getCourseAsync } from "@/lib/demo-data/go-cau";

type RecentRow = { title: string; xp: number; accuracy: number; at: number };

// useSearchParams bắt buộc Suspense khi prerender tĩnh (Next 15) — bọc thân page.
export default function ProfilePage() {
  return (
    <Suspense
      fallback={
        <div
          className="lp-root nb-lesson relative isolate flex min-h-dscreen flex-col"
          data-feature="ban-be"
        >
          <main
            id="main-content"
            className="relative z-10 mx-auto w-full max-w-xl flex-1 px-4 py-8"
          >
            <p className="text-sm font-semibold text-fg-muted">
              Đang mở hồ sơ…
            </p>
          </main>
        </div>
      }
    >
      <ProfileInner />
    </Suspense>
  );
}

function ProfileInner() {
  const params = useSearchParams();
  const handle = params.get("handle") || "";
  const [user, setUser] = useState<DemoUser | null>(null);
  const [progress, setProgress] = useState<ProgressState | null>(null);
  const [recent, setRecent] = useState<RecentRow[]>([]);
  const [ready, setReady] = useState(false);
  const [ownHandle, setOwnHandle] = useState("");

  const refresh = () => {
    setUser(getDemoUser());
    try {
      setOwnHandle(localStorage.getItem("aio-ui-handle") ?? "hocvien");
    } catch {}
    setProgress(loadProgress());
  };

  useEffect(() => {
    refresh();
    setReady(true);
    const offU = useDemoUserSync(refresh);
    const offP = onProgressChange(refresh);
    return () => {
      offU();
      offP();
    };
  }, []);

  useEffect(() => {
    if (!progress) return;
    let alive = true;
    (async () => {
      const rows = await Promise.all(
        progress.lessons
          .slice(-5)
          .reverse()
          .map(async (l) => {
            const c = await getCourseAsync(l.courseId);
            return {
              title: c?.course.title ?? l.courseId,
              xp: l.xp,
              accuracy: l.accuracy,
              at: l.completedAt,
            };
          }),
      );
      if (alive) setRecent(rows);
    })();
    return () => {
      alive = false;
    };
  }, [progress]);

  const isSelf =
    Boolean(user) &&
    (!handle ||
      handle.toLowerCase() === ownHandle.toLowerCase() ||
      (user?.name || "").toLowerCase().replace(/\s+/g, "") ===
        handle.toLowerCase());
  const initials = (user?.name || handle || "A")
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div
      className="lp-root nb-lesson relative isolate flex min-h-dscreen flex-col"
      data-feature="ban-be"
    >
      <main
        id="main-content"
        className="relative z-10 mx-auto w-full max-w-xl flex-1 px-4 py-8"
      >
        {ready && (isSelf || (!handle && user)) ? (
          <>
            <div className="flex items-center gap-4">
              <div className="lp-feat-soft grid h-16 w-16 shrink-0 place-items-center rounded-full font-hero text-xl font-extrabold text-primary">
                {initials}
              </div>
              <div className="min-w-0">
                <h1 className="font-hero truncate text-xl font-extrabold text-fg">
                  {user?.name || "Học viên demo"}
                </h1>
                <p className="truncate text-xs font-semibold text-fg-muted">
                  @{handle || "demo"} · Trình độ{" "}
                  {user?.level || "TOEIC 550–784"}
                </p>
              </div>
            </div>

            <dl className="mt-5 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-card border-bw border-border bg-surface px-2 py-3 shadow-sh-1">
                <dt className="text-2xs font-bold uppercase tracking-wide text-fg-muted">
                  XP tổng
                </dt>
                <dd className="font-hero mt-1 text-lg font-extrabold tabular-nums text-fg">
                  {progress?.xp ?? 0}
                </dd>
              </div>
              <div className="rounded-card border-bw border-border bg-surface px-2 py-3 shadow-sh-1">
                <dt className="text-2xs font-bold uppercase tracking-wide text-fg-muted">
                  Chuỗi
                </dt>
                <dd className="font-hero mt-1 text-lg font-extrabold tabular-nums text-fg">
                  🔥 {progress?.streakDays ?? 0}
                </dd>
              </div>
              <div className="rounded-card border-bw border-border bg-surface px-2 py-3 shadow-sh-1">
                <dt className="text-2xs font-bold uppercase tracking-wide text-fg-muted">
                  Bài đã học
                </dt>
                <dd className="font-hero mt-1 text-lg font-extrabold tabular-nums text-fg">
                  {progress?.lessons.length ?? 0}
                </dd>
              </div>
            </dl>

            <section className="nbx-r-info isle mt-5 rounded-card-lg border-bw border-border-strong bg-surface p-5 shadow-sh-2">
              <h2 className="font-hero text-md font-extrabold text-fg">
                Hoạt động gần đây.
              </h2>
              {recent.length === 0 ? (
                <p className="mt-3 text-sm text-fg-muted">
                  Chưa có bài học nào — vào Kế hoạch hôm nay để bắt đầu.
                </p>
              ) : (
                <ul className="mt-3 grid gap-2">
                  {recent.map((l, i) => (
                    <li
                      key={i}
                      className="flex items-center justify-between gap-2 rounded-card border-bw border-border bg-surface-2/60 px-3 py-2 lp-surface-60"
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-semibold text-fg">
                          {l.title}
                        </span>
                        <span className="block text-2xs font-semibold text-fg-muted">
                          Chính xác {l.accuracy}%
                        </span>
                      </span>
                      <span className="shrink-0 text-2xs font-bold text-fg-muted">
                        +{l.xp} XP
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <div className="mt-5 flex justify-center">
              <Link
                href="/tong-quan"
                className="tap-40 flex h-10 items-center rounded-[var(--r-pill)] px-5 text-sm font-bold text-fg-muted hover:bg-surface-2 hover:text-fg"
              >
                Về trang chủ
              </Link>
            </div>
          </>
        ) : (
          <>
            <h1 className="font-hero text-xl font-extrabold text-fg">
              Không tìm thấy hồ sơ.
            </h1>
            <p className="mt-2 text-sm text-fg-muted">
              {handle
                ? `@${handle} chưa có hồ sơ trên máy này.`
                : "Chưa có hồ sơ — hoàn thành onboarding để tạo."}
            </p>
            <div className="mt-5 flex gap-2">
              <Link
                href="/tong-quan"
                className="btn-ink flex h-10 items-center rounded-[var(--r-pill)] px-5 text-sm font-bold"
              >
                Về trang chủ
              </Link>
              <Link
                href="/ban-be"
                className="tap-40 flex h-10 items-center rounded-[var(--r-pill)] px-5 text-sm font-bold text-fg-muted hover:bg-surface-2 hover:text-fg"
              >
                Tiến độ & Bạn bè
              </Link>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
