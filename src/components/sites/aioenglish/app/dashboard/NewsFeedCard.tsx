"use client";

/**
 * NewsFeedCard — card "Bảng tin." hoạt động demo:
 *   - dữ liệu thật: GET /api/bang-tin → {items:[{id,actorName,actorHandle?,kind,text,at}]}
 *     (`at` = epoch ms; fetch 1 lần trong useEffect). Dòng hiển thị dùng nguyên
 *     `text`, thời gian format tương đối đúng style seed ("Vừa xong", "2 phút", "1 giờ");
 *   - seed FEED bên dưới giữ nguyên làm fallback khi fetch lỗi/offline và làm
 *     khung hiển thị lúc tải (không làm layout nhảy);
 *   - tin có @handle → nút "Kết bạn", tin còn lại → avatar 🦉 + nút Thích
 *     (toggle `.lp-like`);
 *   - footer: "Bảng tin hiện tối đa 100 tin gần nhất."
 */
import { useEffect, useState, type ReactElement } from "react";
import { IconHeart, IconUserPlus } from "../icons";
import Link from "next/link";
import DashboardArt, { CritterAvatar } from "./DashboardArt";
import ContentNotice from "../ContentNotice";

type FeedItem = {
  who: string;
  text: string;
  time: string;
  handle?: string;
};

/** Seed fallback — không xoá, dùng khi /api/bang-tin chưa trả lời hoặc lỗi. */
const FEED: FeedItem[] = [
  { who: "Cú ẩn danh", text: "đã hoàn thành một bài học", time: "Vừa xong" },
  {
    who: "Cú ẩn danh",
    text: "đã học 20 từ mới trong Oxford 3000 · B1",
    time: "2 phút",
  },
  {
    who: "Cú ẩn danh",
    text: "đã giữ chuỗi 5 ngày học liên tục",
    time: "6 phút",
  },
  {
    who: "Minh Khôi",
    handle: "@minhkhoi",
    text: "vượt qua bạn với 2.058 XP tuần này",
    time: "12 phút",
  },
  {
    who: "Cú ẩn danh",
    text: "đã hoàn thành bài gõ câu · Bài 1 · Bản đồ thì",
    time: "18 phút",
  },
  {
    who: "Cú ẩn danh",
    text: "đã luyện 36 câu kiểm tra lên cấp",
    time: "26 phút",
  },
  {
    who: "Hạ Linh",
    handle: "@halinh",
    text: "đã mở chương 2 của lộ trình B1",
    time: "34 phút",
  },
  { who: "Cú ẩn danh", text: "đã hoàn thành một bài học", time: "41 phút" },
  {
    who: "Cú ẩn danh",
    text: "đã shadowing một video · Dictation",
    time: "1 giờ",
  },
];

/** Thời gian tương đối theo đúng style seed ("Vừa xong" / "N phút" / "N giờ"). */
function relTime(at: number, now: number): string {
  const minutes = Math.floor(Math.max(0, now - at) / 60000);
  if (minutes < 1) return "Vừa xong";
  if (minutes < 60) return `${minutes} phút`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} giờ`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} ngày`;
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
  }).format(new Date(at));
}

/** Chuẩn hoá items từ /api/bang-tin; sai shape/rỗng → null (giữ seed). */
function parseItems(value: unknown): FeedItem[] | null {
  if (!Array.isArray(value) || value.length === 0) return null;
  const items: FeedItem[] = [];
  for (const entry of value) {
    if (typeof entry !== "object" || entry === null) return null;
    const r = entry as Record<string, unknown>;
    if (
      typeof r.actorName !== "string" ||
      typeof r.text !== "string" ||
      typeof r.at !== "number" ||
      !Number.isFinite(r.at)
    )
      return null;
    items.push({
      who: r.actorName,
      text: r.text,
      time: relTime(r.at, Date.now()),
      handle:
        typeof r.actorHandle === "string" && r.actorHandle
          ? r.actorHandle
          : undefined,
    });
  }
  return items;
}

export default function NewsFeedCard(): ReactElement {
  // Seed FEED làm trạng thái đầu + fallback: fetch chưa xong/lỗi vẫn render như cũ
  const [feed, setFeed] = useState<FeedItem[]>(FEED);
  const [invite, setInvite] = useState(true);
  const [identified, setIdentified] = useState(false);
  useEffect(() => {
    try {
      setInvite(localStorage.getItem("aio-ui-feed-invite-dismissed") !== "1");
      setIdentified(localStorage.getItem("aio-ui-feed") === "Hiện @ID");
    } catch {}
  }, []);
  function chooseIdentity(show: boolean) {
    setInvite(false);
    setIdentified(show);
    try {
      localStorage.setItem("aio-ui-feed-invite-dismissed", "1");
      if (show) localStorage.setItem("aio-ui-feed", "Hiện @ID");
    } catch {}
  }

  useEffect(() => {
    let alive = true;
    fetch("/api/bang-tin", { cache: "no-store" })
      .then((res) =>
        res.ok ? (res.json() as Promise<{ items?: unknown }>) : null,
      )
      .then((data) => {
        if (!alive) return;
        const items = parseItems(data?.items);
        if (items) setFeed(items); // sai shape → giữ seed
      })
      .catch(() => undefined); // offline / lỗi mạng → giữ seed
    return () => {
      alive = false;
    };
  }, []);

  return (
    <section
      id="bang-tin"
      className="ft nbc-lv1 nbc-blk is-lined"
      aria-labelledby="feed-h"
    >
      <span className="nbc-tape is-msk ft-tape" aria-hidden="true" />
      <div className="nbc-bh ft-head">
        <div className="nbc-bh-t">
          <DashboardArt kind="feed" />
          <div className="ft-titles">
            <h2 id="feed-h" className="ft-h2">
              Bảng tin.
            </h2>
            <small className="ft-mode">
              {identified ? "Đang hiện @ID" : "Đang ẩn danh"}
            </small>
          </div>
        </div>
        <Link href="/cai-dat#friends" className="nbc-lnk ft-mode-link">
          Đổi ↗
        </Link>
      </div>
      <div className="ft-scroll">
        {invite && (
          <section className="fpi ft-invite-h">
            <div className="fpi-body">
              <h3 className="fpi-title">
                Hiện @ID của bạn trên Bảng tin để bạn mới tìm thấy bạn?
              </h3>
              <div className="fpi-cmp">
                <span className="fpi-ex">
                  <b>Gấu mèo ẩn danh</b> đã hoàn thành một bài học
                </span>
                <span aria-hidden="true">↓</span>
                <span className="fpi-ex">
                  <b className="fpi-h">@hocvien</b> đã hoàn thành một bài học
                </span>
              </div>
              <div className="fpi-act">
                <button
                  className="nbc-btn is-ink"
                  onClick={() => chooseIdentity(true)}
                >
                  Hiện @ID
                </button>
                <button
                  className="nbc-btn"
                  onClick={() => chooseIdentity(false)}
                >
                  Để sau
                </button>
              </div>
            </div>
          </section>
        )}
        <ul className="ft-list ft-face">
          {feed.map((f, i) => (
            <li className="fi nbc-lv3" key={f.who + "-" + i}>
              <span className="fi-ava">
                <span className="fi-face">
                  <CritterAvatar index={i} />
                </span>
                <span className="fi-badge" aria-hidden="true">
                  ▤
                </span>
              </span>
              <div className="fi-main">
                <p className="fi-text">
                  <span className="fi-who">{f.who}</span> {f.text}
                </p>
                <span className="fi-when">{f.time}</span>
              </div>
              {f.handle && (
                <ContentNotice className="nbc-lnk">Kết bạn</ContentNotice>
              )}
            </li>
          ))}
        </ul>
        <p className="nbx-bt">Bảng tin hiện tối đa 100 tin gần nhất.</p>
      </div>
      <Link className="nbc-lnk ft-open" href="/ban-be">
        Mở Tiến độ &amp; Bạn bè →
      </Link>
    </section>
  );
}
