"use client";
import art from "@/lib/ui-fixtures/grammar-art.json";
import "@/styles/custom/grammar-reference.css";
import "@/styles/custom/grammar-parity.css";
import Link from "next/link";
import { useState } from "react";
import {
  nguPhapCatalog as catalog,
  GRAMMAR_LEVELS,
  type GrammarLevel,
} from "@/lib/demo-data/nguPhapCatalog";
import "@/styles/custom/grammar.css";
import GrammarCore from "./GrammarCore";

const levelNames: Record<GrammarLevel, string> = {
  A1: "Khởi đầu.",
  A2: "Sơ cấp",
  B1: "Trung cấp",
  B2: "Trung cao cấp",
  C1: "Cao cấp",
  C2: "Thành thạo",
};
export default function GrammarHub() {
  const [tab, setTab] = useState<"path" | "core">("path");
  const [expanded, setExpanded] = useState<GrammarLevel[]>(["A1"]);
  const toggle = (level: GrammarLevel) =>
    setExpanded((old) =>
      old.includes(level) ? old.filter((x) => x !== level) : [...old, level],
    );
  return (
    <div className="nb-skin nbx-hb npg ui-grammar-hub" data-nb-accent="camdao">
      <header
        className="nbc-hd nbx-f-gram"
        data-nb-feature="gram"
        data-nb-header
      >
        <span
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
                <span className="nbc-hd-wide">Luyện ngữ pháp.</span>
                <span className="nbc-hd-narrow">Ngữ pháp.</span>
              </h1>
              <div className="nbc-hd-chips">
                <span className="nbx-chip nbx-plain nbx-hide-s">
                  <span className="nbx-num">0/167</span> điểm đã nắm
                </span>
              </div>
            </div>
          </div>
          <div className="nbc-hd-cta">
            <Link href="/ngu-phap/a1-to-be" className="nbx-btn nbx-b-pri">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polygon points="6 3 20 12 6 21 6 3" />
              </svg>
              Tiếp tục
            </Link>
          </div>
        </div>
        <div className="nbc-hd-tools">
          <div
            role="tablist"
            aria-label="Danh sách ngữ pháp"
            className="nbc-seg"
          >
            {(
              [
                ["path", "Theo lộ trình"],
                ["core", "Ngữ pháp cốt lõi"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                role="tab"
                className={tab === id ? "is-on" : ""}
                aria-selected={tab === id}
                tabIndex={tab === id ? 0 : -1}
                aria-controls={"grammar-" + id}
                id={"grammar-tab-" + id}
                onClick={() => setTab(id)}
                onKeyDown={(e) => {
                  if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
                    e.preventDefault();
                    setTab(id === "path" ? "core" : "path");
                    (
                      e.currentTarget.parentElement?.querySelectorAll("button")[
                        id === "path" ? 1 : 0
                      ] as HTMLButtonElement
                    )?.focus();
                  }
                }}
              >
                {label}
                {id === "core" && <span className="nbc-seg-n">51</span>}
              </button>
            ))}
          </div>
        </div>
      </header>
      {tab === "path" ? (
        <div
          role="tabpanel"
          id="grammar-path"
          aria-labelledby="grammar-tab-path"
          className="ghl"
        >
          {GRAMMAR_LEVELS.filter((level) => expanded.includes(level)).map(
            (level) => {
              const modules =
                catalog.curriculum.levels
                  .find((l) => l.level === level)
                  ?.stages.flatMap((s) => s.modules) ?? [];
              const count = catalog.nodes.filter(
                (n) => n.level === level,
              ).length;
              return (
                <section
                  className="nbx-blk nbx-r-ref nbx-ruled nbx-pile nbx-alt ghl-open"
                  key={level}
                >
                  <i className="nbx-tape nbx-k nbx-r" aria-hidden="true" />
                  <div className="nbx-bh">
                    <span
                      className={"nbx-lvg nbx-sm nbx-lv-" + level.toLowerCase()}
                    >
                      {level}
                    </span>
                    <div className="nbx-sp ghl-tt">
                      <h2>{levelNames[level]}</h2>
                      <span className="nbx-bt">
                        {modules.length} chương ·{" "}
                        <span className="nbx-num">0/{count} đã nắm</span>
                      </span>
                    </div>
                    {level !== "A1" && (
                      <button
                        className="nbx-chip"
                        onClick={() => toggle(level)}
                      >
                        Thu gọn
                      </button>
                    )}
                  </div>
                  <div className="ghl-cols">
                    {modules.map((module, i) => (
                      <article
                        key={module.id}
                        className="nbx-card nbx-r-ivory nbx-chap"
                      >
                        <div className="nbx-ch-h">
                          <b className="nbx-num">{i + 1}</b>
                          <span className="nbx-tt">
                            <b>{module.label}</b>
                            <small>0/{module.nodeIds.length} đã nắm</small>
                          </span>
                        </div>
                        <ul className="ghl-rows">
                          {module.nodeIds.map((id, j) => {
                            const node = catalog.nodes.find((n) => n.id === id);
                            const current =
                              level === "A1" && i === 0 && j === 0;
                            return node ? (
                              <li
                                key={id}
                                className={
                                  "ghl-row" + (current ? " is-cur" : "")
                                }
                              >
                                <span
                                  className="ghk is-none"
                                  aria-hidden="true"
                                />
                                <Link
                                  href={"/ngu-phap/" + id}
                                  title={node.titleEn}
                                  className="ghl-pt"
                                  aria-current={current ? "step" : undefined}
                                >
                                  <span className="ghl-t">{node.title}</span>
                                </Link>
                                {current && (
                                  <span className="ght-tag is-current ghl-tag">
                                    Đang học
                                  </span>
                                )}
                                <span
                                  className="ghm ghl-meter"
                                  role="img"
                                  aria-label="Chưa học"
                                >
                                  <i />
                                  <i />
                                  <i />
                                </span>
                              </li>
                            ) : null;
                          })}
                        </ul>
                      </article>
                    ))}
                  </div>
                </section>
              );
            },
          )}
          <section className="nbx-blk nbx-r-info nbx-dots ghl-next">
            <div className="nbx-bh">
              <h2>Các cấp tiếp theo.</h2>
            </div>
            <div className="nbx-lvls">
              {GRAMMAR_LEVELS.filter((l) => !expanded.includes(l)).map(
                (level) => {
                  const modules =
                    catalog.curriculum.levels
                      .find((l) => l.level === level)
                      ?.stages.flatMap((s) => s.modules) ?? [];
                  return (
                    <button
                      className="nbx-row ghl-lvrow"
                      key={level}
                      onClick={() => toggle(level)}
                      aria-expanded={false}
                      aria-label={"Mở cấp " + level + ": " + levelNames[level]}
                    >
                      <span
                        className={
                          "nbx-lvg nbx-sm nbx-lv-" + level.toLowerCase()
                        }
                      >
                        {level}
                      </span>
                      <span className="nbx-tt">
                        <b>{levelNames[level]}</b>
                        <small>
                          {modules.length} chương · 0/
                          {
                            catalog.nodes.filter((n) => n.level === level)
                              .length
                          }{" "}
                          đã nắm
                        </small>
                      </span>
                      <span className="nbx-chaplist nbx-hide-s">
                        {modules.map((m) => m.label).join(" · ")}
                      </span>
                    </button>
                  );
                },
              )}
            </div>
          </section>
        </div>
      ) : (
        <section
          role="tabpanel"
          id="grammar-core"
          aria-labelledby="grammar-tab-core"
        >
          <GrammarCore />
        </section>
      )}
    </div>
  );
}
