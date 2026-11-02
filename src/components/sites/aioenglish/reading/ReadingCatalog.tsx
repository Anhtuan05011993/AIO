"use client";
import Link from "next/link";
import { useState } from "react";
import fixture from "@/lib/ui-fixtures/reading-catalog.json";
import artwork from "@/lib/ui-fixtures/reading-catalog-art.json";
import UiDialog from "../app/UiDialog";
import "@/styles/custom/reading-reference.css";
import "@/styles/custom/reading-catalog-reference.css";
import "@/styles/custom/reading-parity.css";
const s = { "data-v-e97b430e": "" };
const levels = ["all", "A1", "A2", "B1", "B2", "C1"];
const art = (html: string | undefined) => html?.startsWith("<svg") ? (
  <svg className={html.match(/class="([^"]*)"/)?.[1]} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false" dangerouslySetInnerHTML={{__html:html.slice(html.indexOf('>')+1,html.lastIndexOf('</svg>'))}} />
) : (
  <span
    aria-hidden="true"
    style={{ display: "contents" }}
    dangerouslySetInnerHTML={{ __html: html ?? "" }}
  />
);
export default function ReadingCatalog({
  topicSlug = "du-lich",
  initialLevel = "A1",
}: {
  topicSlug?: string;
  initialLevel?: string;
}) {
  const [level, setLevel] = useState(
    levels.includes(initialLevel) ? initialLevel : "A1",
  );
  const [notice, setNotice] = useState(false);
  const selected =
    fixture.topics.find((t) => t.slug === topicSlug) ?? fixture.topics[0];
  const topics = fixture.topics.filter(
    (t) => level === "all" || t.levels?.includes(level),
  );
  const groups = [...new Set(topics.map((t) => t.group))];
  // Metadata-only examples stand in for omitted course contents outside the observed travel set.
  const lessons = fixture.lessons.filter(
    (l) => level === "all" || l.level === level,
  );
  const suffix =
    level === "A1"
      ? ""
      : `?cap=${level === "all" ? "all" : level.toLowerCase()}`;
  function select(next: string) {
    setLevel(next);
    const u = new URL(window.location.href);
    if (next === "A1") u.searchParams.delete("cap");
    else u.searchParams.set("cap", next === "all" ? "all" : next.toLowerCase());
    window.history.replaceState(null, "", u.pathname + u.search + u.hash);
  }
  return (
    <>
      <div
        {...s}
        className="nb-skin nbx-hb nbx-dc ldt"
        data-testid="doc-dich-topic"
        data-nb-accent="bacha"
      >
        <div {...s} className="nbc-page nbx-main ldt-page">
          <header
            {...s}
            className="nbc-hd nbx-f-read ldt-hd is-bk-ico"
            data-nb-feature="read"
            data-nb-header=""
            data-bm="hdr"
          >
            {art(artwork.decoration)}
            <div className="nbc-hd-row is-top">
              <div className="nbc-hd-head">
                <div className="nbc-hd-tt">
                  <Link
                    href="/luyen-dich-thuat"
                    className="nbc-back"
                    aria-label="Quay lại Đọc & dịch"
                    data-nb-back=""
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      aria-hidden="true"
                    >
                      <path d="m12 19-7-7 7-7m-7 7h14" />
                    </svg>
                    <span>Đọc &amp; dịch</span>
                  </Link>
                  {art(artwork.header)}
                  <h1>Tất cả bài.</h1>
                  <div className="nbc-hd-chips">
                    <span className="nbx-chip nbx-plain nbx-hide-s">
                      <span className="nbx-num">266</span>&nbsp;bài · 12 chủ đề
                    </span>
                  </div>
                </div>
              </div>
              <div className="nbc-hd-cta">
                <span
                  {...s}
                  className="nbx-d-stamp ldt-stamp"
                  data-topic-chip="done"
                >
                  {art(artwork.stamp)}Đã xong 0/266
                </span>
              </div>
            </div>
            <div className="nbc-hd-tools">
              <div
                {...s}
                className="nbc-seg"
                role="group"
                aria-label="Cấp độ"
                data-testid="level-filter"
              >
                {levels.map((l, i) => (
                  <button
                    key={l}
                    type="button"
                    className={level === l ? "is-on" : ""}
                    aria-pressed={level === l}
                    onClick={() => select(l)}
                    onKeyDown={(e) => {
                      let n = i;
                      if (e.key === "ArrowRight") n = (i + 1) % levels.length;
                      else if (e.key === "ArrowLeft")
                        n = (i + levels.length - 1) % levels.length;
                      else if (e.key === "Home") n = 0;
                      else if (e.key === "End") n = levels.length - 1;
                      else return;
                      e.preventDefault();
                      select(levels[n]);
                      (
                        e.currentTarget.parentElement?.children[
                          n
                        ] as HTMLElement
                      )?.focus();
                    }}
                  >
                    <span>{l === "all" ? "Tất cả" : l}</span>
                  </button>
                ))}
              </div>
            </div>
          </header>
          <div {...s} className="nbx-d-cat">
            <section
              {...s}
              className="nbx-blk nbx-r-info nbx-grid ldt-topics"
              aria-labelledby="ldt-topics-h"
              data-bm="topics"
            >
              <div {...s} className="nbx-bh">
                {art(artwork.topics)}
                <h2 {...s} id="ldt-topics-h">
                  Chủ đề.
                </h2>
              </div>
              {groups.map((group) => (
                <div key={group} className="ui-reading-topic-group">
                  <h3 {...s} className="nbx-sub">
                    {group}
                  </h3>
                  <nav
                    {...s}
                    className="nbx-topics nbx-d-tops"
                    aria-label={group ?? "Chủ đề"}
                  >
                    {topics
                      .filter((t) => t.group === group)
                      .map((t) => (
                        <Link key={t.slug} {...s}
                          
                          href={`/luyen-dich-thuat/chu-de/${t.slug}${suffix}`}
                          aria-current={
                            selected.slug === t.slug ? "page" : undefined
                          }
                          className={`nbx-row${selected.slug === t.slug ? " nbx-sel" : ""}`}
                          data-topic-row={t.slug}
                        >
                          <span
                            {...s}
                            className={t.tone ?? ""}
                            aria-hidden="true"
                            dangerouslySetInnerHTML={{ __html: t.art ?? "" }}
                          />
                          <span {...s} className="nbx-tt">
                            <b {...s}>{t.title}</b>
                            <small {...s}>{t.levels?.join(" · ")}</small>
                          </span>
                          <span {...s} className="nbx-d-fr">
                            0/{t.count}
                          </span>
                        </Link>
                      ))}
                  </nav>
                </div>
              ))}
            </section>
            <section
              {...s}
              className="nbx-blk nbx-r-ok nbx-dots ldt-lessons"
              aria-labelledby="ldt-lessons-h"
              data-bm="lessons"
            >
              <div {...s} className="nbx-bh">
                {art(artwork.lessons)}
                <div {...s} className="nbx-sp ldt-tt">
                  <h2 {...s} id="ldt-lessons-h">
                    {selected.title}
                    {level === "all" ? "" : ` · ${level}`}.
                  </h2>
                  <span {...s} className="nbx-bt">
                    {lessons.length} bài · xong 0
                  </span>
                </div>
              </div>
              <div className="min-w-0">
                <div {...s} className="nbx-d-lrows" data-testid="ldt-rows">
                  {lessons.map((l) => (
                    <article key={l.id} {...s}
                      
                      className="nbx-card nbx-r-ivory nbx-d-lrow"
                      data-lesson={l.id}
                    >
                      <div {...s} className="nbx-d-lt">
                        <div {...s} className="nbx-tt">
                          <b {...s} className="nbx-disp">
                            {l.title}
                          </b>
                          <small {...s}>
                            <span lang="en">{l.english}</span> · {l.sentences}{" "}
                            câu{level === "all" ? ` · ${l.level}` : ""}
                          </small>
                        </div>
                      </div>
                      {["sentence", "paragraph"].map((mode, i) => (
                        <a key={mode} {...s}
                          
                          href={`/luyen-dich-thuat/tung-cau/${l.id}`}
                          className="nbx-d-mode"
                          data-entry={mode}
                          aria-label={`${i ? "Đoạn văn" : "Từng câu"}: ${l.title}`}
                          onClick={(e) => {
                            if (
                              !e.ctrlKey &&
                              !e.metaKey &&
                              !e.shiftKey &&
                              !e.altKey
                            ) {
                              e.preventDefault();
                              setNotice(true);
                            }
                          }}
                        >
                          {art(i ? artwork.paragraph : artwork.sentence)}
                          <span {...s} className="nbx-nm">
                            {i ? "Đoạn văn" : "Từng câu"}
                          </span>
                          <span {...s} className="nbx-st nbx-mut">
                            Chưa làm
                          </span>
                          {art(artwork.arrow)}
                        </a>
                      ))}
                    </article>
                  ))}
                </div>
                {!lessons.length && (
                  <div className="hnst" data-hub-state="empty">
                    <p className="hnst-t">Chưa có bài ở cấp này</p>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
      {notice && (
        <UiDialog title="Luyện đọc & dịch" onClose={() => setNotice(false)}>
          <p>Nội dung chưa được bổ sung.</p>
        </UiDialog>
      )}
    </>
  );
}
