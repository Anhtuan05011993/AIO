"use client";
import NavArt from "../app/NavArt";
import { useEffect, useState } from "react";
type Idea = {
  id: string;
  title: string;
  description: string;
  votes: number;
  status: string;
  created: number;
};
export default function YeuCauTinhNang() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [sort, setSort] = useState("votes");
  const [filter, setFilter] = useState("");
  const [mine, setMine] = useState(false);
  const [message, setMessage] = useState("");
  useEffect(() => {
    try {
      const parsed: unknown = JSON.parse(
        localStorage.getItem("aio-ui-ideas") ?? "[]",
      );
      if (Array.isArray(parsed))
        setIdeas(
          parsed.filter(
            (i): i is Idea =>
              !!i &&
              typeof i === "object" &&
              typeof i.id === "string" &&
              typeof i.title === "string" &&
              typeof i.description === "string" &&
              typeof i.votes === "number" &&
              typeof i.status === "string" &&
              typeof i.created === "number",
          ),
        );
    } catch {}
  }, []);
  function persist(next: Idea[]) {
    setIdeas(next);
    try {
      localStorage.setItem("aio-ui-ideas", JSON.stringify(next));
    } catch {
      setMessage("Ý tưởng chỉ được giữ trong phiên này.");
    }
  }
  const shown = ideas
    .filter((i) => !filter || i.status === filter)
    .sort((a, b) =>
      sort === "votes" ? b.votes - a.votes : b.created - a.created,
    );
  return (
    <div className="ui-stack">
      <header className="ui-page-head">
        <NavArt route="/yeu-cau-tinh-nang" />
        <h1>Yêu cầu tính năng.</h1>
        <span className="ui-spacer" />
        <button
          className="nbc-btn"
          aria-pressed={mine}
          onClick={() => setMine(!mine)}
        >
          Của tôi {ideas.length}
        </button>
        <select
          className="nbc-btn"
          aria-label="Sắp xếp ý tưởng"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="votes">Nhiều bình chọn</option>
          <option value="new">Mới nhất</option>
        </select>
      </header>
      <div className="ui-ideas-layout">
        <section className="ui-sheet" style={{ background: "#f1dfc9cc" }}>
          <h2>Gửi ý tưởng.</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!title.trim() || !description.trim()) return;
              persist([
                ...ideas,
                {
                  id: crypto.randomUUID(),
                  title: title.trim(),
                  description: description.trim(),
                  votes: 0,
                  status: "Đang xem xét",
                  created: Date.now(),
                },
              ]);
              setTitle("");
              setDescription("");
              setMessage("Đã lưu ý tưởng trên máy này.");
            }}
          >
            <label htmlFor="idea-title">
              Tên ý tưởng <small>{title.length}/120</small>
            </label>
            <input
              id="idea-title"
              required
              maxLength={120}
              className="ui-search"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <label htmlFor="idea-description">
              Mô tả ngắn <small>{description.length}/2000</small>
            </label>
            <textarea
              id="idea-description"
              required
              maxLength={2000}
              className="ui-search"
              rows={6}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <button className="nbc-btn is-ink" type="submit">
              Gửi ý tưởng
            </button>
            <p className="ui-notice-line">Ý tưởng được lưu trên máy này.</p>
            {message && <p role="status">{message}</p>}
          </form>
        </section>
        <section className="ui-sheet">
          <h2>Bảng ý tưởng.</h2>
          <div
            className="ui-tabs"
            role="tablist"
            aria-label="Trạng thái ý tưởng"
          >
            {["", "Đang xem xét", "Đã lên kế hoạch", "Đang làm", "Đã xong"].map(
              (s) => (
                <button
                  role="tab"
                  aria-selected={filter === s}
                  key={s}
                  onClick={() => setFilter(s)}
                >
                  {s || "Tất cả"}{" "}
                  {ideas.filter((i) => !s || i.status === s).length}
                </button>
              ),
            )}
          </div>
          {shown.length ? (
            shown.map((idea) => (
              <article className="ui-idea" key={idea.id}>
                <button
                  className="nbc-btn"
                  aria-label={"Bình chọn " + idea.title}
                  onClick={() =>
                    persist(
                      ideas.map((i) =>
                        i.id === idea.id ? { ...i, votes: i.votes + 1 } : i,
                      ),
                    )
                  }
                >
                  ↑ {idea.votes}
                </button>
                <div>
                  <h3>{idea.title}</h3>
                  <p>{idea.description}</p>
                  <small>{idea.status}</small>
                </div>
              </article>
            ))
          ) : (
            <p className="ui-empty">
              Chưa có ý tưởng nào{filter ? " ở trạng thái này" : ""}.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
