"use client";
import art from "@/lib/ui-fixtures/path-art.json";
import fixture from "@/lib/ui-fixtures/path-journey.json";
import "@/styles/custom/path-reference.css";
import "@/styles/custom/path-parity.css";
import Link from "next/link";
import { useEffect, useState, type KeyboardEvent } from "react";
import { nguPhapCatalog as catalog } from "@/lib/demo-data/nguPhapCatalog";
import { getDemoUser, setDemoUser, useDemoUserSync } from "@/lib/store/auth";
import ContentNotice from "../app/ContentNotice";
import UiDialog from "../app/UiDialog";
import PathKnowledge from "./PathKnowledge";
const LEVELS = ["A1", "A2", "B1", "B2", "C1"];
const PACES = [30, 45, 60, 180];
const PREF_KEY = "aio-path-ui-preferences";
function moveSelection(
  e: KeyboardEvent<HTMLButtonElement>,
  index: number,
  count: number,
  select: (n: number) => void,
) {
  const offset =
    e.key === "ArrowRight" || e.key === "ArrowDown"
      ? 1
      : e.key === "ArrowLeft" || e.key === "ArrowUp"
        ? -1
        : 0;
  if (!offset && e.key !== "Home" && e.key !== "End") return;
  e.preventDefault();
  const next =
    e.key === "Home"
      ? 0
      : e.key === "End"
        ? count - 1
        : (index + offset + count) % count;
  select(next);
  (
    e.currentTarget.parentElement?.querySelectorAll("button")[
      next
    ] as HTMLButtonElement
  )?.focus();
}
function PathIcon({ kind }: { kind: keyof typeof fixture.icons }) {
  return (
    <span
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: fixture.icons[kind] ?? "" }}
    />
  );
}
export default function PathJourney() {
  const [level, setLevel] = useState("A1");
  const [currentLevel, setCurrentLevel] = useState("A1");
  const [tab, setTab] = useState("journey");
  const [chapter, setChapter] = useState(0);
  const [minutes, setMinutes] = useState(45);
  const [goal, setGoal] = useState("Hoàn thành B1");
  const [editing, setEditing] = useState(false);
  const [draftGoal, setDraftGoal] = useState(goal);
  const [choosingLevel, setChoosingLevel] = useState(false);
  useEffect(() => {
    const sync = () => {
      let prefs: { minutes?: number; goal?: string } = {};
      try {
        prefs = JSON.parse(localStorage.getItem(PREF_KEY) ?? "{}");
      } catch {}
      const u = getDemoUser();
      setMinutes(u?.minutesPerDay ?? prefs.minutes ?? 45);
      setGoal(u?.goal ?? prefs.goal ?? "Hoàn thành B1");
      const l = LEVELS.includes(u?.level ?? "") ? u!.level : "A1";
      setCurrentLevel(l);
    };
    sync();
    return useDemoUserSync(sync);
  }, []);
  const savePrefs = (nextMinutes: number, nextGoal: string) => {
    setMinutes(nextMinutes);
    setGoal(nextGoal);
    const u = getDemoUser();
    if (u) setDemoUser({ ...u, minutesPerDay: nextMinutes, goal: nextGoal });
    else
      try {
        localStorage.setItem(
          PREF_KEY,
          JSON.stringify({ minutes: nextMinutes, goal: nextGoal }),
        );
      } catch {}
  };
  const modules =
    catalog.curriculum.levels
      .find((l) => l.level === level)
      ?.stages.flatMap((s) => s.modules) ?? [];
  const activeChapter = Math.min(chapter, Math.max(0, modules.length - 1));
  const selected = modules[activeChapter];
  const nodes =
    selected?.nodeIds
      .map((id) => catalog.nodes.find((n) => n.id === id))
      .filter((n) => !!n) ?? [];
  const rows =
    level === "A1"
      ? (fixture.a1Rows[activeChapter] ?? [])
      : nodes.flatMap((node, i) => [
          {
            title: node.title,
            kicker: "Ngữ pháp · Bài hướng dẫn",
            href: "/ngu-phap/" + node.id,
            kind: "grammar",
          },
          {
            title: node.title,
            kicker: "Gõ câu · Bài " + (i + 1),
            href: "",
            kind: "typing",
          },
        ]);
  const totals: Record<string, number> = {
    A1: 126,
    A2: 144,
    B1: 115,
    B2: 128,
    C1: 110,
  };
  const resumeNode = catalog.nodes.find((n) => n.level === currentLevel);
  const chapterCount = (i: number) =>
    level === "A1"
      ? (fixture.chapters[i]?.total ?? 0)
      : (modules[i]?.nodeIds.length ?? 0) * 2;
  return (
    <div className="ui-path-page">
      <header
        className="nbc-hd nbx-f-path ui-path-header"
        data-nb-feature="path"
        data-nb-header
      >
        <span
          className="ui-path-deco"
          aria-hidden="true"
          dangerouslySetInnerHTML={{ __html: art.decoration }}
        />
        <div className="nbc-hd-row is-top">
          <div className="nbc-hd-head">
            <div className="nbc-hd-tt">
              <span
                aria-hidden="true"
                dangerouslySetInnerHTML={{ __html: art.art }}
              />
              <h1>
                <span className="nbc-hd-wide">Lộ trình học.</span>
                <span className="nbc-hd-narrow">Lộ trình.</span>
              </h1>
              <div className="nbc-hd-tabs">
                <div className="nbc-seg" role="tablist" aria-label="Chế độ xem">
                  {(
                    [
                      ["journey", "Hành trình"],
                      ["knowledge", "Kiến thức"],
                    ] as const
                  ).map(([id, label]) => (
                    <button
                      key={id}
                      role="tab"
                      aria-selected={tab === id}
                      id={"path-tab-" + id}
                      aria-controls={"path-view-" + id}
                      tabIndex={tab === id ? 0 : -1}
                      onKeyDown={(e) =>
                        moveSelection(e, tab === "journey" ? 0 : 1, 2, (i) =>
                          setTab(i === 0 ? "journey" : "knowledge"),
                        )
                      }
                      className={tab === id ? "is-on" : ""}
                      onClick={() => setTab(id)}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="nbc-hd-cta">
            <span className="nbc-nextc">
              <small>
                Tiếp theo · Ngữ pháp · Bài hướng dẫn · khoảng 6 phút
              </small>
              <b>{resumeNode?.title ?? "Động từ to be: am, is, are"}</b>
            </span>
            <Link
              className="nbc-btn is-ink"
              aria-label={`Học tiếp: ${resumeNode?.title ?? "Động từ to be: am, is, are"}`}
              href={"/ngu-phap/" + (resumeNode?.id ?? "a1-to-be")}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m3 17 2 2 4-4M3 7l2 2 4-4M13 6h8M13 12h8M13 18h8" /></svg>
              Học tiếp
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14m-6-7 7 7-7 7" /></svg>
            </Link>
          </div>
        </div>
        {tab === "journey" && (
          <div className="nbc-hd-tools">
            <div className="nbc-steps" aria-label="Các cấp">
              {LEVELS.map((l, i) => (
                <span className="ui-path-step" key={l}>
                  {i > 0 && <i aria-hidden="true" />}
                  <button
                    className={"nbc-stp" + (level === l ? " is-cur" : "")}
                    aria-current={currentLevel === l ? "step" : undefined}
                    aria-pressed={level === l}
                    aria-label={"Đổi sang cấp " + l}
                    onClick={() => {
                      setLevel(l);
                      setChapter(0);
                    }}
                  >
                    {l}
                    {currentLevel === l && (
                      <span className="nbc-hd-wide"> · Đang học</span>
                    )}
                  </button>
                </span>
              ))}
            </div>
            <button
              className="nbc-btn is-soft is-sm"
              onClick={() => setChoosingLevel(true)}
            >
              Đổi cấp
            </button>
            <span className="nbc-sp" />
            <span className="nbc-chip nbc-hd-wide">
              Chặng {level} · {modules.length} chương · bạn ở chương 1
            </span>
          </div>
        )}
      </header>

      <div
        role="tabpanel"
        id={"path-view-" + tab}
        aria-labelledby={"path-tab-" + tab}
        className="lt-body"
      >
        {tab === "knowledge" ? (
          <PathKnowledge />
        ) : (
          <div className="pj">
            <div className="pj-grid">
              <aside className="pj-side">
                <section
                  className="nbx-blk nbx-r-goal nbx-pile nbx-alt pjp pj-goal"
                  aria-label={"Hoàn thành " + level}
                >
                  <div className="nbc-bh pjp-bh">
                    <div className="nbc-bh-t">
                      <span className="nbc-sk pjp-ic">
                        <PathIcon kind="goal" />
                      </span>
                      <h2 className="pjp-k">Hoàn thành {level}</h2>
                    </div>
                  </div>
                  <p className="pjp-pct">
                    <b className="nbc-num">0%</b>
                    <span>chặng đường hoàn thành {level}</span>
                  </p>
                  <div
                    className="pjp-bar"
                    role="progressbar"
                    aria-valuenow={0}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={"Tiến độ chặng đường hoàn thành " + level}
                  >
                    <span className="nbc-bar is-ink pjp-track">
                      <i style={{ transform: "scaleX(0)" }} />
                    </span>
                    <span
                      className="pjp-mk"
                      aria-hidden="true"
                      style={{ left: "80%" }}
                    />
                    <i className="pjp-mk-l" style={{ left: "80%" }}>
                      Bài kiểm tra lên cấp
                    </i>
                  </div>
                  <div className="pjp-tiles">
                    <p className="nbc-lv3 pjp-tile">
                      <span>Bài đã học</span>
                      <b className="nbc-num">
                        0 <small>/ {totals[level]}</small>
                      </b>
                    </p>
                    <p className="nbc-lv3 pjp-tile">
                      <span>Từ đã học</span>
                      <b className="nbc-num">
                        0 <small>/ {level === "A1" ? 898 : 794}</small>
                      </b>
                    </p>
                  </div>
                  <div className="nbc-lv3 is-w pjp-box">
                    <div className="pace" data-nb="1">
                      <p className="pace-head">
                        <span className="pace-l">
                          Mục tiêu mỗi ngày
                          <span className="pace-l-n"> (phút)</span>
                        </span>
                        <span className="pace-saved pace-saved-n">
                          ✓ Đã lưu
                        </span>
                      </p>
                      <div
                        className="pace-seg"
                        role="radiogroup"
                        aria-label="Mục tiêu mỗi ngày (phút)"
                      >
                        {PACES.map((n, i) => (
                          <button
                            key={n}
                            type="button"
                            role="radio"
                            className={
                              "pace-opt font-display" +
                              (minutes === n ? " is-on" : "")
                            }
                            aria-checked={minutes === n}
                            aria-label={n + " phút mỗi ngày"}
                            tabIndex={minutes === n ? 0 : -1}
                            onClick={() => savePrefs(n, goal)}
                            onKeyDown={(e) =>
                              moveSelection(e, i, PACES.length, (j) =>
                                savePrefs(PACES[j], goal),
                              )
                            }
                          >
                            {n}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="pjp-eta">
                      <p>
                        Với mục tiêu {minutes} phút mỗi ngày, dự kiến khoảng{" "}
                        {Math.ceil(360 / minutes)} tuần để hoàn thành {level}
                      </p>
                    </div>
                  </div>
                  <div className="nbx-row pjp-tgt">
                    <span className="nbx-tile pjp-tgt-i">
                      <PathIcon kind="target" />
                    </span>
                    <span className="nbx-tt">
                      <b>Mục tiêu: {goal}</b>
                      <small>Dự kiến khoảng 7 tháng</small>
                    </span>
                    <button
                      className="nbc-btn is-soft is-sm pjp-tgt-b"
                      aria-label="Sửa mục tiêu"
                      onClick={() => {
                        setDraftGoal(goal);
                        setEditing(true);
                      }}
                    >
                      Sửa
                    </button>
                  </div>
                  <div className="ptf is-nb pjp-foot">
                    <p className="ptf-line">36 câu, 40 phút</p>
                    <Link
                      href="/lo-trinh/kiem-tra"
                      className="nb-btn nb-btn-ink nb-btn-md is-block ptf-btn"
                    >
                      Kiểm tra lên cấp →
                    </Link>
                  </div>
                </section>
                <section
                  className="nbx-blk nbx-r-ref nbx-ruled pci pj-index"
                  aria-label={"Mục lục " + level}
                >
                  <div className="nbx-bh pci-bh">
                    <PathIcon kind="index" />
                    <div className="pci-ht">
                      <h2>Mục lục {level}</h2>
                      <small>Đã xong 0/{modules.length} chương</small>
                    </div>
                  </div>
                  <div
                    className="pci-list"
                    role="tablist"
                    aria-label="Chương"
                    aria-orientation="vertical"
                  >
                    {modules.map((m, i) => (
                      <button
                        key={m.id}
                        role="tab"
                        className={
                          "nbx-row pci-it" +
                          (activeChapter === i ? " is-sel" : "") +
                          (currentLevel === level && i === 0 ? " is-here" : "")
                        }
                        id={"path-chapter-tab-" + i}
                        aria-controls="path-chapter"
                        aria-selected={activeChapter === i}
                        tabIndex={activeChapter === i ? 0 : -1}
                        onClick={() => setChapter(i)}
                        onKeyDown={(e) =>
                          moveSelection(e, i, modules.length, setChapter)
                        }
                      >
                        <span className="pci-n">{i + 1}</span>
                        <span className="pci-l" title={m.label}>
                          {m.label}
                        </span>
                        <span className="pci-c">0/{chapterCount(i)}</span>
                      </button>
                    ))}
                  </div>
                </section>
                <section
                  className="nbx-blk nbx-r-ivory psk pj-skip"
                  aria-label="Đã bỏ qua"
                >
                  <div className="nbc-bh psk-bh">
                    <div className="nbc-bh-t">
                      <h2 className="psk-t">Đã bỏ qua</h2>
                    </div>
                  </div>
                  <p className="nbc-lv3 is-w psk-empty">
                    Không có bài nào bị bỏ qua.
                  </p>
                </section>
              </aside>
              <section
                className="nbx-blk nbx-r-info nbx-dots nbx-pile pj-chap"
                aria-label="Các bài của chương"
              >
                <i className="nbx-tape" aria-hidden="true" />
                <div
                  id="path-chapter"
                  className="pj-panel"
                  role="tabpanel"
                  aria-labelledby={"path-chapter-tab-" + activeChapter}
                >
                  <div className="pcr">
                    <header className="pcr-head">
                      <PathIcon kind="chapter" />
                      <div className="pcr-hl">
                        <p className="pcr-k">
                          Chương {activeChapter + 1}/{modules.length}
                        </p>
                        <h2 className="pcr-t">
                          {selected?.label ?? "Chưa có chương"}
                        </h2>
                      </div>
                      <p className="pcr-n">
                        <span className="pcr-big">
                          <b>0</b>
                          <span className="pcr-of">/{rows.length}</span>
                        </span>
                        <small className="pcr-cap">bài đã học</small>
                      </p>
                    </header>
                    <ol className="pcr-rows">
                      {rows.map((row, i) => {
                        const current =
                          currentLevel === level &&
                          activeChapter === 0 &&
                          i === 0;
                        const inner = (
                          <>
                            <span
                              className={
                                "nbc-sk pcr-ic nbc-f-" +
                                (row.kind === "grammar" ? "gram" : "go")
                              }
                            >
                              <PathIcon
                                kind={
                                  row.kind === "grammar" ? "grammar" : "typing"
                                }
                              />
                            </span>
                            <span className="pcr-x">
                              <span className="pcr-kick">
                                <span className="pcr-kick-t">{row.kicker}</span>
                              </span>
                              <span className="pcr-title">{row.title}</span>
                            </span>
                            {current ? (
                              <span className="nbc-chip nbx-mark is-sm pcr-tag">
                                Tiếp theo
                              </span>
                            ) : (
                              <span className="pcr-go" aria-hidden="true">
                                →
                              </span>
                            )}
                          </>
                        );
                        const cls =
                          "nbc-lv3 pcr-row" +
                          (current ? " is-cur is-next" : " is-w");
                        return (
                          <li key={i} className="pcr-li">
                            {row.kind === "grammar" ? (
                              <Link href={row.href} className={cls}>
                                {inner}
                              </Link>
                            ) : (
                              <ContentNotice className={cls}>
                                {inner}
                              </ContentNotice>
                            )}
                          </li>
                        );
                      })}
                    </ol>
                  </div>
                </div>
              </section>
            </div>
          </div>
        )}
      </div>
      {editing && (
        <UiDialog title="Mục tiêu học tập" onClose={() => setEditing(false)}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              savePrefs(minutes, draftGoal);
              setEditing(false);
            }}
          >
            <fieldset className="ui-options">
              <legend>Bạn muốn đạt đến cấp nào?</legend>
              {LEVELS.map((l) => (
                <label
                  key={l}
                  className={
                    draftGoal === "Hoàn thành " + l ? "is-selected" : ""
                  }
                >
                  <input
                    type="radio"
                    name="path-goal"
                    value={l}
                    checked={draftGoal === "Hoàn thành " + l}
                    onChange={() => setDraftGoal("Hoàn thành " + l)}
                  />
                  Hoàn thành {l}
                </label>
              ))}
            </fieldset>
            <button className="nbc-btn is-ink" type="submit">
              Lưu mục tiêu
            </button>
          </form>
        </UiDialog>
      )}
      {choosingLevel && (
        <UiDialog
          title="Chọn cấp để xem"
          onClose={() => setChoosingLevel(false)}
        >
          <div className="ui-options">
            {LEVELS.map((l) => (
              <button
                key={l}
                className="nbc-btn"
                aria-pressed={level === l}
                onClick={() => {
                  setLevel(l);
                  setChapter(0);
                  setChoosingLevel(false);
                }}
              >
                {l}
              </button>
            ))}
          </div>
        </UiDialog>
      )}
    </div>
  );
}
