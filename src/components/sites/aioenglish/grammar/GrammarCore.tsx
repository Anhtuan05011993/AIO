"use client";
import Link from "next/link";
import { Fragment, useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import data from "@/lib/ui-fixtures/grammar-core.json";
import layouts from "@/lib/ui-fixtures/grammar-core-columns.json";
import "@/styles/custom/grammar-core-reference.css";
const groupScope = { "data-v-750aaa3d": "" };
const tenseScope = { "data-v-b9fac914": "" };
const rowScope = { "data-v-97b69011": "" };
const meterScope = { "data-v-b53d2b2b": "" };
function Meter({ current = false }: { current?: boolean }) {
  return (
    <span
      {...meterScope}
      className="ghm"
      aria-hidden="true"
      data-np-meter=""
      data-steps="0"
    >
      <i {...meterScope} className={current ? "is-open" : ""} />
      <i {...meterScope} />
      <i {...meterScope} />
    </span>
  );
}
export default function GrammarCore() {
  const root = useRef<HTMLDivElement>(null);
  const [columns, setColumns] = useState(1);
  const columnRef = useRef(1);
  const pendingFocus = useRef<{ element: HTMLAnchorElement; href: string | null; className: string } | null>(null);
  useLayoutEffect(() => {
    const pending = pendingFocus.current;
    pendingFocus.current = null;
    if (pending && !pending.element.isConnected) {
      Array.from(root.current?.querySelectorAll('a') ?? []).find(a => a.getAttribute('href') === pending.href && a.className === pending.className)?.focus({preventScroll:true});
    }
  }, [columns]);
  useEffect(() => {
    if (!root.current) return;
    const observer = new ResizeObserver(([entry]) => {
      const width = entry.contentRect.width;
      const next = width >= 1800 ? 5 : width >= 960 ? 3 : width >= 720 ? 2 : 1;
      if (next === columnRef.current) return;
      const active = document.activeElement;
      if (active instanceof HTMLAnchorElement && root.current?.contains(active)) pendingFocus.current = { element: active, href: active.getAttribute('href'), className: active.className };
      columnRef.current = next;
      setColumns(next);
    });
    observer.observe(root.current);
    return () => observer.disconnect();
  }, []);
  const groups = data.groups;
  const columnIds = (layouts as Record<string, string[][]>)[columns];
  const chunks = columnIds.map(ids => ids.flatMap(id => groups.find(g => g.id === id) ?? []));
  return (
    <div ref={root} {...groupScope} className="ghtw">
      <section
        {...tenseScope}
        {...groupScope}
        className="nbc-lv1 is-grid20 gtt"
        aria-labelledby="grammar-twelve-title"
        data-testid="twelve-tenses"
      >
        <div {...tenseScope} className="nbc-bh gtt-bh">
          <div {...tenseScope} className="nbc-bh-t">
            <span
              {...tenseScope}
              className="ta-tile is-head ta-plate nbx-r-info"
              aria-hidden="true"
              dangerouslySetInnerHTML={{ __html: data.tensesArt ?? "" }}
            />
            <h2 {...tenseScope} id="grammar-twelve-title">
              12 thì tiếng Anh.
            </h2>
          </div>
        </div>
        <div {...tenseScope} className="gtt-grid">
          {[0, 1, 2].map((time) => (
            <Fragment key={time}>
              <p {...tenseScope} className="gtt-time">
                <b {...tenseScope} className="gtt-tvi">
                  {["Hiện tại", "Quá khứ", "Tương lai"][time]}
                </b>
                <small {...tenseScope} className="gtt-ten" lang="en">
                  {["Present", "Past", "Future"][time]}
                </small>
              </p>
              {data.tenses.slice(time * 4, time * 4 + 4).map((t) => (
                <Link
                  key={t.href}
                  {...tenseScope}
                  href={t.href!}
                  className="nbc-lv3 gtt-tile is-w"
                  title={t.title!}
                  aria-label={`${t.title}, cấp ${t.level}, Chưa học`}
                >
                  <b {...tenseScope} className="gtt-name">
                    {t.label}
                  </b>
                  <span {...tenseScope} className="gtt-sub">
                    <span {...tenseScope} className="gtt-lv">
                      {t.level}
                    </span>
                    <span {...tenseScope} className="gtt-en" lang="en">
                      {t.en}
                    </span>
                    <Meter />
                  </span>
                </Link>
              ))}
            </Fragment>
          ))}
        </div>
      </section>
      <div
        {...groupScope}
        className="ght"
        style={{ "--ght-cols": columns } as CSSProperties}
      >
        {chunks.map((chunk, i) => (
          <div key={i} {...groupScope} className="ght-col">
            {chunk.map((g) => (
              <section
                key={g.id}
                {...groupScope}
                className="nbc-lv1 ght-grp"
                aria-labelledby={g.id!}
                data-testid={`topic-group-${g.id!.replace("np-grp-", "")}`}
              >
                <div {...groupScope} className="nbc-bh ght-bh">
                  <div {...groupScope} className="nbc-bh-t">
                    <span
                      {...groupScope}
                      className="ta-tile is-head ta-plate nbx-r-goal ght-art"
                      aria-hidden="true"
                      dangerouslySetInnerHTML={{ __html: g.art ?? "" }}
                    />
                    <div {...groupScope} className="ght-tx">
                      <h2 {...groupScope} id={g.id!}>
                        {g.title}
                      </h2>
                      <small {...groupScope} className="ght-cnt">
                          <b {...groupScope} className="nbc-num">0</b>{g.count?.slice(1)}
                      </small>
                    </div>
                  </div>
                </div>
                <ul {...groupScope} className="ght-rows" role="list">
                  {g.topics.map((t) => (
                    <li key={t.href} {...groupScope}>
                      <div {...rowScope} className="ghr">
                        <Link
                          {...rowScope}
                          href={t.href!}
                          className={`nbc-lv3 ghr-row ${t.current ? "is-cur" : "is-w"}`}
                          aria-current={t.current ? "step" : undefined}
                          aria-label={`${t.title}. ${t.current ? "Đang làm bài hướng dẫn" : "Chưa học"}`}
                          data-rung="0"
                          data-np-mark={t.current ? "started" : "none"}
                        >
                          <b {...rowScope} className="ghr-t" title={t.title!}>
                            {t.title}
                          </b>
                          <span {...rowScope} className="ghr-l2">
                            {t.current && (
                              <span
                                data-v-e48f7f10=""
                                className="ght-tag is-current"
                              >
                                Đang học
                              </span>
                            )}
                            <small {...rowScope} className="ghr-m">
                              {t.meta}
                            </small>
                          </span>
                          <Meter current={t.current} />
                        </Link>
                        <Link
                          {...rowScope}
                          href={t.doc!}
                          className="ghr-doc"
                          title="Đọc tài liệu"
                          aria-label={`Đọc tài liệu: ${t.title}`}
                        >
                          <svg
                            width="17"
                            height="17"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                          >
                            <path d="M12 7v14M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />
                          </svg>
                        </Link>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
