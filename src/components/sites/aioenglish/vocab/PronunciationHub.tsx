"use client";
import Link from "next/link";
import { useEffect, useState, type CSSProperties } from "react";
import chart from "@/lib/ui-fixtures/ipa-chart.json";
import { getDemoUser, setDemoUser, useDemoUserSync } from "@/lib/store/auth";
import UiDialog from "../app/UiDialog";
import { IconArrowRight } from "../app/icons";
import "@/styles/custom/ipa-reference.css";
import "@/styles/custom/ipa-parity.css";
const ps = { "data-v-d6e7df04": "" },
  ts = { "data-v-b3d94bf7": "" },
  acs = { "data-v-ace335d9": "" };
function gridPosition(style: string | null): CSSProperties {
  return Object.fromEntries(
    (style ?? "")
      .split(";")
      .filter(Boolean)
      .map((part) => part.split(":").map((s) => s.trim())),
  ) as CSSProperties;
}
function Speaker() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z" />
      <path d="M16 9a5 5 0 0 1 0 6M19.364 18.364a9 9 0 0 0 0-12.728" />
    </svg>
  );
}
export default function PronunciationHub() {
  const [accent, setAccent] = useState<"uk" | "us">("uk"),
    [notice, setNotice] = useState<string | null>(null);
  useEffect(() => {
    const sync = () => setAccent(getDemoUser()?.accent ?? "uk");
    sync();
    return useDemoUserSync(sync);
  }, []);
  function changeAccent(value: "uk" | "us") {
    setAccent(value);
    const user = getDemoUser();
    if (user) setDemoUser({ ...user, accent: value });
  }
  // US presentation is pending source verification; no learning records are created.
  const omitted =
    accent === "us"
      ? new Set(["o-short", "ia", "ea", "ua"])
      : new Set<string>();
  const total = accent === "uk" ? 50 : 46,
    panels = chart.panels.map((p) => ({
      ...p,
      tiles: p.tiles.filter((t) => !omitted.has(t.slug)),
    }));
  const symbols = new Set(panels.flatMap((p) => p.tiles.map((t) => t.symbol)));
  return (
    <div
      className="nb-skin pc ui-ipa"
      data-nb-accent="oaihuong"
      data-feature="tu-vung"
      {...ps}
    >
      <div className="nbc-page pc-page" {...ps}>
        <header
          className="nbc-hd nbx-f-voc"
          data-nb-feature="voc"
          data-nb-header=""
          data-nb-accent="oaihuong"
          {...ps}
        >
          <span
            className="ui-ipa-deco"
            aria-hidden="true"
            dangerouslySetInnerHTML={{ __html: chart.deco }}
          />
          <div className="nbc-hd-row is-top">
            <div className="nbc-hd-head">
              <div className="nbc-hd-tt">
                <Link
                  href="/tu-vung"
                  className="nbc-back"
                  aria-label="Quay lại Từ vựng"
                >
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
                    <path d="m12 19-7-7 7-7" />
                    <path d="M19 12H5" />
                  </svg>
                  <span>Từ vựng</span>
                </Link>
                <span
                  className="ta-tile is-hd ta-plate nbx-r-info nbc-hd-ic nbc-hd-art"
                  aria-hidden="true"
                  dangerouslySetInnerHTML={{ __html: chart.headerArt }}
                />
                <h1>Bảng âm IPA.</h1>
                <div className="nbc-hd-chips">
                  <span className="nbc-chip is-ink">0/{total} âm đã luyện</span>
                  <span className="nbc-chip">0%</span>
                </div>
              </div>
            </div>
            <div className="nbc-hd-cta">
              <button
                className="nbc-btn is-ink pc-cont"
                onClick={() => setNotice("Luyện âm /iː/ sheep")}
              >
                <span className="nbc-hd-wide">
                  Luyện tiếp{" "}
                  <span className="font-ipa pc-cont-sym" {...ps}>
                    /iː/
                  </span>{" "}
                  sheep
                </span>
                <span className="nbc-hd-narrow">
                  Luyện{" "}
                  <span className="font-ipa pc-cont-sym" {...ps}>
                    /iː/
                  </span>
                </span>
                <IconArrowRight size={18} />
              </button>
            </div>
          </div>
          <div className="nbc-hd-tools">
            <div
              className="nbc-seg pas pc-accent"
              role="group"
              aria-label="Giọng"
              {...ps}
              {...acs}
            >
              {(["uk", "us"] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  className={`pas-opt${accent === value ? " is-on" : ""}`}
                  aria-pressed={accent === value}
                  onClick={() => changeAccent(value)}
                  {...acs}
                >
                  <span className="pas-l" {...acs}>
                    {value === "uk" ? "Anh-Anh" : "Anh-Mỹ"}
                    <span className="pas-cnt" {...acs}>
                      {" "}
                      · {value === "uk" ? 50 : 46} âm
                    </span>
                  </span>
                  <span className="pas-s" {...acs}>
                    {value.toUpperCase()}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </header>
        <div className="pc-body" {...ps}>
          <section
            className="nbc-pile pc-route"
            aria-labelledby="pc-route-h"
            {...ps}
          >
            <span
              className="nbc-under"
              aria-hidden="true"
              style={
                {
                  "--nb-ur": "0.7deg",
                  "--nb-uc": "var(--nb-paper-kraft-bg)",
                } as CSSProperties
              }
            />
            <div className="nbc-lv1 nbc-blk pc-route-blk" {...ps}>
              <div className="nbc-bh">
                <div className="nbc-bh-t">
                  <span
                    className="nbc-sk is-a pc-route-ic"
                    {...ps}
                    aria-hidden="true"
                    style={{ "--nb-sk-size": "44px" } as CSSProperties}
                    dangerouslySetInnerHTML={{ __html: chart.routeArt }}
                  />
                  <h2 id="pc-route-h">Lộ trình luyện, từ dễ tới khó</h2>
                </div>
              </div>
              <ol className="pc-stations" {...ps}>
                {chart.groups.map((g, i) => (
                  <li className="pc-st-li" key={g.slug} {...ps}>
                    <button
                      type="button"
                      className={`nbc-lv3 pc-st${i ? " is-w" : ""}`}
                      data-here={i === 0 ? "1" : undefined}
                      onClick={() => setNotice(g.title)}
                      {...ps}
                    >
                      <span className="pc-st-top" {...ps}>
                        {i === 0 && (
                          <span className="pc-pin" {...ps}>
                            <svg
                              width="13"
                              height="13"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              aria-hidden="true"
                            >
                              <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
                              <circle cx="12" cy="10" r="3" />
                            </svg>
                            Đang ở đây
                          </span>
                        )}
                        <span className="nbc-tag pc-lv">{g.difficulty}</span>
                        <span className="pc-st-cnt" {...ps}>
                          0/{g.symbols.filter((s) => symbols.has(s)).length} âm
                        </span>
                      </span>
                      <b className="pc-st-name" {...ps}>
                        {g.title}
                      </b>
                      <span className="pc-toks" {...ps}>
                        {g.symbols
                          .filter((s) => symbols.has(s))
                          .map((s, n) => (
                            <span
                              key={s}
                              className="pc-tok pron-state font-ipa"
                              data-state={i === 0 && n === 0 ? "cur" : "none"}
                              {...ps}
                            >
                              {s}
                            </span>
                          ))}
                      </span>
                    </button>
                    {i < 2 && (
                      <span className="pc-join" aria-hidden="true" {...ps}>
                        <IconArrowRight size={24} />
                      </span>
                    )}
                  </li>
                ))}
              </ol>
            </div>
          </section>
          <section className="pc-all" aria-labelledby="pc-all-h" {...ps}>
            <h2 id="pc-all-h" className="sr-only" {...ps}>
              Cả {total} âm, giọng {accent === "uk" ? "Anh-Anh" : "Anh-Mỹ"}
            </h2>
            <div className="pc-board" {...ps}>
              {[panels.slice(0, 2), panels.slice(2)].map((row, i) => (
                <div className={`pc-brow is-r${i + 1}`} key={i} {...ps}>
                  {row.map((p) => (
                    <section
                      className={p.className}
                      key={p.title}
                      aria-label={p.title}
                      {...ps}
                    >
                      {p.caption ? (
                        <div className="pc-ph" {...ps}>
                          <h3 className="pc-h3" {...ps}>
                            {p.title}
                          </h3>
                          <span className="pc-cap" {...ps}>
                            {p.tiles.length} âm
                          </span>
                        </div>
                      ) : (
                        <h3 className="pc-h3" {...ps}>
                          {p.title}
                        </h3>
                      )}
                      <div className={p.gridClass} {...ps}>
                        {p.labels.map((l) => (
                          <span
                            className="pc-rl"
                            key={l.text}
                            style={gridPosition(l.style)}
                            {...ps}
                          >
                            {l.text}
                          </span>
                        ))}
                        {p.tiles.map((t) => (
                          <div
                            className="pc-cell"
                            key={t.slug}
                            style={gridPosition(t.style)}
                            {...ps}
                          >
                            <div
                              className="pt-tile pron-state"
                              data-state={t.slug === "i-long" ? "cur" : "none"}
                              {...ps}
                              {...ts}
                            >
                              <button
                                className="cover-link pt-link"
                                aria-label={t.label}
                                onClick={() => setNotice(t.label)}
                                {...ts}
                              />
                              <button
                                className="pt-speak tap-40-box"
                                aria-label={`Nghe âm /${t.symbol}/`}
                                onClick={() =>
                                  setNotice(
                                    `Âm thanh /${t.symbol}/ chưa được bổ sung.`,
                                  )
                                }
                                {...ts}
                              >
                                <Speaker />
                              </button>
                              <span className="pt-diff" {...ts}>
                                {t.difficulty}
                              </span>
                              <span className="pt-sym font-ipa" {...ts}>
                                {t.symbol}
                              </span>
                              <span
                                className="pt-kw"
                                {...ts}
                                dangerouslySetInnerHTML={{ __html: t.keyword }}
                              />
                              <span
                                className="pt-bar pron-bar"
                                role="progressbar"
                                aria-label={`Số mục đã đạt cho /${t.symbol}/`}
                                aria-valuemin={0}
                                aria-valuemax={100}
                                aria-valuenow={0}
                                {...ts}
                              >
                                <i style={{ width: 0 }} />
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  ))}
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
      {notice && (
        <UiDialog
          title="Nội dung chưa được bổ sung"
          onClose={() => setNotice(null)}
        >
          <p>{notice}</p>
          <p>Bạn có thể tiếp tục khám phá bảng âm và các mục khác.</p>
          <button className="nbc-btn is-ink" onClick={() => setNotice(null)}>
            Đã hiểu
          </button>
        </UiDialog>
      )}
    </div>
  );
}
