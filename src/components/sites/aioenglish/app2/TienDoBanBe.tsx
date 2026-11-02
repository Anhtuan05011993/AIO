"use client";
import NavArt from "../app/NavArt";
import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { loadProgress, onProgressChange } from "@/lib/store/progress";
import { getDemoUser } from "@/lib/store/auth";
import NewsFeedCard from "../app/dashboard/NewsFeedCard";
import GoalDialog from "../app/GoalDialog";
import ContentNotice from "../app/ContentNotice";
export default function TienDoBanBe() {
  const tabsId = useId();
  const [tab, setTab] = useState("plan");
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState("");
  const [lessons, setLessons] = useState(0);
  const [vocab, setVocab] = useState(0);
  const [goal, setGoal] = useState("Hoàn thành B1");
  const [editing, setEditing] = useState(false);
  useEffect(() => {
    const sync = () => {
      const p = loadProgress();
      setLessons(p.lessons.length);
      setVocab(p.vocabSeen);
      setGoal(getDemoUser()?.goal ?? "Hoàn thành B1");
    };
    sync();
    return onProgressChange(sync);
  }, []);
  async function copy() {
    try {
      await navigator.clipboard.writeText(
        location.origin +
          "/@" +
          (localStorage.getItem("aio-ui-handle") ?? "hocvien"),
      );
      setNotice("Đã sao chép link mời");
    } catch {
      setNotice("Bạn có thể sao chép link mời trong Cài đặt.");
    }
  }
  return (
    <div className="ui-stack">
      <header className="ui-page-head" style={{ background: "#ecd7dccc" }}>
        <NavArt route="/ban-be" />
        <h1>Tiến độ &amp; Bạn bè.</h1>
        <span className="ui-spacer" />
        <button className="nbc-btn" onClick={copy}>
          Sao chép link mời
        </button>
        <ContentNotice>Mời bạn</ContentNotice>
        <div className="ui-head-break" />
        <div className="ui-tabs" role="tablist" aria-label="Tiến độ và bạn bè">
          {[
            ["plan", "Kế hoạch hôm nay"],
            ["friends", "Bạn bè"],
            ["feed", "Bảng tin"],
          ].map(([id, label]) => (
            <button
              type="button"
              role="tab"
              id={`${tabsId}-${id}`}
              aria-controls={`${tabsId}-panel`}
              aria-selected={tab === id}
              tabIndex={tab === id ? 0 : -1}
              key={id}
              onClick={() => setTab(id)}
              onKeyDown={(event) => {
                if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
                const order = ["plan", "friends", "feed"];
                const index = order.indexOf(id);
                const step = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
                if (!step && event.key !== "Home" && event.key !== "End") return;
                event.preventDefault();
                const next = event.key === "Home" ? 0 : event.key === "End" ? order.length - 1
                  : (index + step + order.length) % order.length;
                setTab(order[next]);
                event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next]?.focus();
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </header>
      {notice && (
        <p role="status" className="ui-notice-line">
          {notice}
        </p>
      )}
      {tab === "plan" ? (
        <div className="ui-two-cards" role="tabpanel" id={`${tabsId}-panel`} aria-labelledby={`${tabsId}-plan`} tabIndex={0}>
          <section className="ui-sheet">
            <div className="nbx-row-flex">
              <h2>Kế hoạch hôm nay.</h2>
              <span className="ui-spacer" />
              <span className="nbx-chip">0/5 bài</span>
            </div>
            {[
              [
                "Ngữ pháp · Bài hướng dẫn",
                "Động từ to be: am, is, are",
                "/ngu-phap/a1-to-be",
              ],
              ["Gõ câu", "Giới thiệu bản thân · Bài 1", "/go-cau/lo-trinh-a1"],
              [
                "Ngữ pháp · Bài hướng dẫn",
                "Danh từ số nhiều",
                "/ngu-phap/a1-plural-nouns",
              ],
              [
                "Từ mới · Oxford 3000 · A1",
                "20 từ mới",
                "/tu-vung/oxford-3000-a1",
              ],
            ].map(([label, title, href], i) => (
              <Link
                className={"ui-list-row" + (i === 0 ? " is-current" : "")}
                key={title}
                href={href}
              >
                <span className="ui-status-dot" />
                <span className="ui-title">
                  <small>{label}</small>
                  <b>{title}</b>
                </span>
                ›
              </Link>
            ))}
          </section>
          <section className="ui-sheet" style={{ background: "#ded2edcc" }}>
            <h2>Hoàn thành A1 · Lộ trình học</h2>
            <p>
              <b className="ui-path-percent">
                {Math.min(100, Math.round((lessons / 126) * 100))}%
              </b>{" "}
              chặng đường hoàn thành A1
            </p>
            <div className="ui-path-stats">
              <div>
                <small>Bài đã học</small>
                <b>{lessons}/126</b>
              </div>
              <div>
                <small>Từ đã học</small>
                <b>{vocab}/898</b>
              </div>
            </div>
            <Link href="/lo-trinh" className="nbc-btn">
              Mở Lộ trình →
            </Link>
            <div className="ui-setting-row">
              <b>Mục tiêu: {goal}</b>
              <button className="nbc-btn" onClick={() => setEditing(true)}>
                Sửa
              </button>
            </div>
          </section>
        </div>
      ) : tab === "friends" ? (
        <section className="ui-sheet" role="tabpanel" id={`${tabsId}-panel`} aria-labelledby={`${tabsId}-friends`} tabIndex={0}>
          <h2>Bạn bè.</h2>
          <form
            className="ui-filterbar"
            onSubmit={(e) => {
              e.preventDefault();
              setNotice(
                query.trim()
                  ? "Không tìm thấy @" +
                      query.replace(/^@/, "") +
                      ". Danh sách bạn bè hiện chỉ hoạt động trên máy này."
                  : "Nhập ID để tìm bạn.",
              );
            }}
          >
            <input
              className="ui-search"
              aria-label="ID bạn bè"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="@ID của bạn bè"
            />
            <button className="nbc-btn" type="submit">
              Tìm
            </button>
          </form>
          <p className="ui-empty">
            Chưa có bạn bè. Chia sẻ link mời để cùng học mỗi ngày.
          </p>
          <div className="ui-filterbar">
            <button className="nbc-btn" onClick={copy}>
              Sao chép link mời
            </button>
            <Link href="/cai-dat#friends" className="nbc-btn">
              Cài đặt Bạn bè
            </Link>
          </div>
        </section>
      ) : (
        <div role="tabpanel" id={`${tabsId}-panel`} aria-labelledby={`${tabsId}-feed`} tabIndex={0}><NewsFeedCard /></div>
      )}
      {editing && (
        <GoalDialog
          kind="goal"
          onClose={() => {
            setEditing(false);
            setGoal(getDemoUser()?.goal ?? goal);
          }}
        />
      )}
    </div>
  );
}
