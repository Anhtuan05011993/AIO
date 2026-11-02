"use client";
import NavArt from "../app/NavArt";
import Link from "next/link";
import { useState } from "react";
import ContentNotice from "../app/ContentNotice";
import UiDialog from "../app/UiDialog";
type Article = {
  slug: string;
  title: string;
  titleVi: string;
  topic: string;
  level: string;
  minutes: number;
  intro: string;
};
export default function ReadingLibrary({ articles }: { articles: Article[] }) {
  const [all, setAll] = useState(false);
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState("");
  const [create, setCreate] = useState("");
  const [text, setText] = useState("");
  const [message, setMessage] = useState("");
  const topics = [...new Set(articles.map((a) => a.topic))];
  const filtered = articles.filter(
    (a) =>
      (!topic || a.topic === topic) &&
      (a.title + " " + a.titleVi)
        .toLocaleLowerCase("vi")
        .includes(query.toLocaleLowerCase("vi")),
  );
  return (
    <div className="ui-stack">
      <header className="ui-page-head" style={{ background: "#cee8d6cc" }}>
        <NavArt route="/luyen-dich-thuat" />
        <h1>Luyện đọc &amp; dịch.</h1>
        <span className="nbx-chip">266 bài · 12 chủ đề</span>
      </header>
      <section className="ui-sheet">
        <div className="nbx-row-flex">
          <h2>Luyện dịch từng câu.</h2>
          <span className="ui-spacer" />
          <span className="nbx-chip">A1</span>
        </div>
        <div className="ui-two-cards">
          <article className="ui-sheet" style={{ background: "#e8dcef99" }}>
            <h3>Dịch từng câu ngẫu nhiên</h3>
            <p className="ui-muted">
              Câu độc lập ở trình độ của bạn. Câu sai sẽ quay lại.
            </p>
            <ContentNotice>Bắt đầu →</ContentNotice>
          </article>
          <article className="ui-sheet" style={{ background: "#d8e5ed99" }}>
            <h3>Dịch từng câu theo bài</h3>
            <p className="ui-muted">
              Dịch lần lượt từng câu của một bài, xong bài sang bài mới.
            </p>
            <ContentNotice>Bắt đầu →</ContentNotice>
          </article>
        </div>
      </section>
      <section className="ui-sheet">
        <div className="nbx-row-flex">
          <h2>Luyện dịch đoạn văn.</h2>
          <span className="ui-spacer" />
          <button
            className="nbc-btn"
            onClick={() => setAll(!all)}
            aria-expanded={all}
          >
            Tất cả bài
          </button>
        </div>
        {all ? (
          <>
            <div className="ui-filterbar" style={{ margin: "16px 0" }}>
              <input
                className="ui-search"
                type="search"
                aria-label="Tìm bài đọc"
                placeholder="Tìm bài đọc…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <select
                aria-label="Chủ đề bài đọc"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              >
                <option value="">Tất cả chủ đề</option>
                {topics.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="ui-reading-grid">
              {filtered.map((a) => (
                <Link
                  href={"/luyen-dich-thuat/" + a.slug}
                  key={a.slug}
                  className="ui-sheet"
                >
                  <span className="nbx-chip">{a.level}</span>
                  <h3>{a.title}</h3>
                  <p className="ui-muted">{a.titleVi || a.intro}</p>
                  <small>
                    {a.topic} · {a.minutes} phút
                  </small>
                </Link>
              ))}
            </div>
            {!filtered.length && (
              <p className="ui-empty">Không tìm thấy bài phù hợp.</p>
            )}
          </>
        ) : (
          <>
            <h3 style={{ marginTop: 16 }}>Bài mới cho bạn</h3>
            <div className="ui-reading-grid" style={{ marginTop: 12 }}>
              {articles.slice(0, 3).map((a) => (
                <Link
                  href={"/luyen-dich-thuat/" + a.slug}
                  key={a.slug}
                  className="ui-sheet"
                  style={{ background: "#fff6" }}
                >
                  <span className="nbx-chip">{a.level}</span>
                  <h3>{a.title}</h3>
                  <p className="ui-muted">{a.titleVi || a.intro}</p>
                </Link>
              ))}
            </div>
            <h3 style={{ marginTop: 20 }}>Bài đã chấm.</h3>
            <p className="ui-muted">Chưa có bài đã chấm</p>
            <div className="ui-filterbar" style={{ marginTop: 16 }}>
              {["Tạo bài bằng AI", "Nhập bài báo", "Dán văn bản"].map((s) => (
                <button
                  key={s}
                  className="nbc-btn"
                  onClick={() => {
                    setCreate(s);
                    setMessage("");
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </>
        )}
      </section>
      <section className="ui-sheet">
        <div className="nbx-row-flex">
          <h2>Đọc &amp; dịch báo song ngữ.</h2>
          <span className="ui-spacer" />
          <button
            className="nbc-btn"
            onClick={() => setCreate("Dán link bài báo")}
          >
            Dán link bài báo
          </button>
        </div>
        <div className="ui-reading-grid" style={{ marginTop: 16 }}>
          {[
            [
              "The Guardian",
              "Báo Anh",
              "Báo Anh, tin thế giới, khoa học, đời sống.",
              "318",
            ],
            [
              "The Conversation",
              "Học thuật",
              "Học giả viết cho công chúng: khoa học, xã hội, công nghệ.",
              "314",
            ],
            [
              "The Atlantic",
              "Tạp chí",
              "Tạp chí Mỹ, bài luận dài về chính trị, văn hoá, kinh tế, ý tưởng.",
              "220",
            ],
          ].map(([name, kind, desc, count]) => (
            <article
              key={name}
              className="ui-sheet"
              style={{ background: "#fff6" }}
            >
              <h3>{name}</h3>
              <span className="nbx-chip">{kind}</span>
              <p className="ui-muted">{desc}</p>
              <small>{count} bài</small>
              <ContentNotice>Đọc tờ này →</ContentNotice>
            </article>
          ))}
        </div>
      </section>
      <section className="ui-sheet">
        <h2>Bài học của tôi.</h2>
        <p className="ui-muted">0 bài đã tạo</p>
        <div className="ui-reading-grid">
          {[
            "Tạo bài báo song ngữ",
            "Tạo bài luyện dịch bằng AI",
            "Tạo bài luyện dịch tuỳ chọn",
          ].map((s) => (
            <button
              className="ui-skill-card"
              key={s}
              onClick={() => setCreate(s)}
            >
              {s} +
            </button>
          ))}
        </div>
        <h3 style={{ marginTop: 20 }}>Bài đã làm gần đây.</h3>
        <p className="ui-muted">
          Chưa làm bài nào. Chọn một bài ở trang Tất cả bài để bắt đầu.
        </p>
      </section>
      {create && (
        <UiDialog
          title={create}
          onClose={() => {
            setCreate("");
            setMessage("");
          }}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setMessage("Nội dung chưa được bổ sung.");
            }}
          >
            <label htmlFor="reading-input">
              {create.includes("link") || create.includes("báo")
                ? "Link bài báo hoặc văn bản"
                : "Nội dung"}
            </label>
            <textarea
              required
              className="ui-search"
              id="reading-input"
              rows={5}
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <button className="nbc-btn is-ink" type="submit">
              Tiếp tục
            </button>
            {message && <p role="status">{message}</p>}
          </form>
        </UiDialog>
      )}
    </div>
  );
}
