"use client";
import Link from "next/link";
import {
  useEffect,
  useState,
  type MouseEvent,
  type CSSProperties,
} from "react";
import fixture from "@/lib/ui-fixtures/vocab-hub.json";
import ipa from "@/lib/ui-fixtures/ipa-chart.json";
import { getDemoUser, hasServerSession } from "@/lib/store/auth";
import { loadProgress, onProgressChange } from "@/lib/store/progress";
import { FeatureGate } from "../gate/FeatureGate";
import UiDialog from "../app/UiDialog";
import { IconArrowRight } from "../app/icons";
import VocabCreateDialog from "./VocabCreateDialog";
import VocabPersonal from "./VocabPersonal";
import "@/styles/custom/vocab-reference.css";
import "@/styles/custom/vocab-parity.css";
const rootScope = { "data-v-a590b89b": "" },
  cardScope = { "data-v-33ecd40a": "" },
  dueScope = { "data-v-b3d743e7": "" },
  ipaScope = { "data-v-128409b8": "" };
export default function VocabHub() {
  const [authed, setAuthed] = useState<boolean | null>(null),
    [tab, setTab] = useState<"de-xuat" | "cua-toi">("de-xuat"),
    [create, setCreate] = useState(false),
    [notice, setNotice] = useState<string | null>(null),
    [stats, setStats] = useState({ total: 0, due: 0 });
  useEffect(() => {
    let alive = true;
    void (async () => {
      const ok = !!getDemoUser() || (await hasServerSession());
      if (alive) setAuthed(ok);
    })();
    const syncTab = () =>
      setTab(
        new URLSearchParams(location.search).get("tab") === "cua-toi"
          ? "cua-toi"
          : "de-xuat",
      );
    syncTab();
    window.addEventListener("popstate", syncTab);
    const syncProgress = () => {
      const cards = Object.values(loadProgress().srs);
      setStats({
        total: cards.length,
        due: cards.filter((c) => (c.fsrs?.due ?? c.dueAt) <= Date.now()).length,
      });
    };
    syncProgress();
    const off = onProgressChange(syncProgress);
    return () => {
      alive = false;
      window.removeEventListener("popstate", syncTab);
      off();
    };
  }, []);
  function selectTab(e: MouseEvent<HTMLAnchorElement>, value: typeof tab) {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    history.pushState(null, "", `/tu-vung?tab=${value}`);
    setTab(value);
  }
  if (authed === null)
    return (
      <div className="ui-vocab-loading" role="status">
        Đang tải giao diện…
      </div>
    );
  if (!authed)
    return (
      <FeatureGate
        feature={{
          key: "tu-vung",
          name: "Từ vựng",
          chip: "10.929 thẻ",
          blurb: "Học từ mới, ôn khi sắp quên",
        }}
      />
    );
  const heading = (id: keyof typeof fixture.art, title: string) => (
    <div className="nbx-bh">
      <span
        className="ui-vocab-art"
        aria-hidden="true"
        dangerouslySetInnerHTML={{ __html: fixture.art[id] }}
      />
      <h2 id={id}>{title}</h2>
    </div>
  );
  const deck = (d: (typeof fixture.cards)[number], i: number) => {
    const inside = (
      <>
        <i className="vhs-sheen" {...cardScope} aria-hidden="true" />
        <span className="vhs-top" {...cardScope}>
          <span className="vhs-tx" {...cardScope}>
            <b className={i < 3 ? "vhs-name" : "vhs-tn"} {...cardScope}>
              {d.title}
            </b>
            <small className="vhs-desc" {...cardScope}>
              {d.description}
            </small>
          </span>
          <span
            className="ui-vocab-art"
            aria-hidden="true"
            dangerouslySetInnerHTML={{ __html: d.art }}
          />
        </span>
        <span className="nbx-dk" {...cardScope}>
          {i === 0 ? (
            <span className="nbx-btn nbx-sm nbx-b-mine vhs-go" {...cardScope}>
              ＋ Tạo từ vựng
            </span>
          ) : (
            <>
              <span className={d.levelClass} {...cardScope}>
                {d.level}
              </span>
              <span className="nbx-num" {...cardScope}>
                {d.count}
              </span>
            </>
          )}
        </span>
        {i > 0 && (
          <span
            className="nbx-bar"
            role="progressbar"
            aria-label={`${d.title}: 0% đã học`}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={0}
          >
            <i style={{ "--nb-x-p": "0%" } as CSSProperties} />
          </span>
        )}
      </>
    );
    return i === 0 ? (
      <button
        className={d.className}
        key={d.title}
        {...cardScope}
        onClick={() => setCreate(true)}
      >
        {inside}
      </button>
    ) : (
      <Link
        href={d.href}
        key={d.href}
        className={d.className}
        {...cardScope}
        style={{ "--vhs-i": i } as CSSProperties}
      >
        {inside}
      </Link>
    );
  };
  return (
    <div
      className="nb-skin nbx-hb tvh ui-vocab"
      data-nb-accent="oaihuong"
      {...rootScope}
    >
      <div className="nbc-page nbx-main" {...rootScope}>
        <header
          className="nbc-hd nbx-f-voc"
          data-nb-feature="voc"
          data-nb-header=""
          data-nb-accent="oaihuong"
          {...rootScope}
        >
          <span
            className="ui-vocab-art"
            aria-hidden="true"
            dangerouslySetInnerHTML={{ __html: ipa.deco }}
          />
          <div className="nbc-hd-row is-top">
            <div className="nbc-hd-head">
              <div className="nbc-hd-tt">
                <span
                  className="ta-tile is-hd ta-plate nbx-r-goal nbc-hd-ic nbc-hd-art"
                  aria-hidden="true"
                  dangerouslySetInnerHTML={{ __html: fixture.headerArt }}
                />
                <h1>Từ vựng &amp; Phát âm.</h1>
              </div>
            </div>
          </div>
          <div className="nbc-hd-tools">
            {fixture.tabs.map((t, i) => (
              <Link
                key={t.label}
                href={
                  i === 2
                    ? "/tu-vung/phat-am"
                    : `/tu-vung?tab=${i === 0 ? "cua-toi" : "de-xuat"}`
                }
                onClick={
                  i < 2
                    ? (e) => selectTab(e, i === 0 ? "cua-toi" : "de-xuat")
                    : undefined
                }
                className={`nbx-btn nbx-sm tvh-tab${i < 2 && tab === (i === 0 ? "cua-toi" : "de-xuat") ? " nbx-on" : ""}`}
                aria-current={
                  i < 2 && tab === (i === 0 ? "cua-toi" : "de-xuat")
                    ? "page"
                    : undefined
                }
                aria-label={t.label}
                {...rootScope}
              >
                <span
                  className="ui-vocab-tab-icon"
                  aria-hidden="true"
                  dangerouslySetInnerHTML={{ __html: t.icon }}
                />
                <span className="nbc-hd-wide">{t.label}</span>
                <span className="nbc-hd-narrow">
                  {["Của tôi", "Từ vựng", "IPA"][i]}
                </span>
              </Link>
            ))}
          </div>
        </header>
        {tab === "cua-toi" ? (
          <VocabPersonal
            onCreate={() => setCreate(true)}
            onBrowse={() => {
              history.pushState(null, "", "/tu-vung?tab=de-xuat");
              setTab("de-xuat");
            }}
          />
        ) : (
          <div className="tvh-browse" {...rootScope}>
            <div className="nbx-g nbx-pair tvh-pair" {...rootScope}>
              <section
                className="nbx-blk nbx-r-info nbx-grid nbx-pile vhd"
                aria-labelledby="vocab-due-h"
                {...dueScope}
                {...rootScope}
              >
                <i className="nbx-tape" aria-hidden="true" />
                {heading("vocab-due-h", "Hôm nay cần ôn.")}
                <div className="nbx-kv2 nbx-kv-voc">
                  {["Trong kho", "Đã thuộc", "Chưa thuộc"].map((label, i) => (
                    <span key={label}>
                      <small>{label}</small>
                      <b className="nbx-num">{i === 1 ? 0 : stats.total}</b>
                    </span>
                  ))}
                </div>
                <div className="nbx-row-flex nbx-empty vhd-st" {...dueScope}>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="12" r="9" />
                    <path d="m8 12 3 3 5-6" />
                  </svg>
                  <span className="nbx-sp" {...dueScope}>
                    <b>
                      {stats.due
                        ? `${stats.due} từ đến hạn hôm nay.`
                        : "Không có từ đến hạn hôm nay."}
                    </b>
                    <br />
                    <span className="nbx-mut nbx-sm">
                      Từ đã học sẽ quay lại đúng lúc sắp quên.
                    </span>
                  </span>
                  <Link
                    href="/tu-vung/oxford-3000"
                    className="nbx-btn nbx-b-pri nbx-sm"
                  >
                    Học từ mới
                  </Link>
                </div>
                <div className="vhd-acts" {...dueScope}>
                  <button
                    className="nbx-btn nbx-sm nbx-b-pri"
                    {...dueScope}
                    onClick={() => setCreate(true)}
                  >
                    ＋ Tạo từ vựng
                  </button>
                </div>
              </section>
              <section
                className="nbx-blk nbx-r-ok vhi"
                aria-labelledby="vocab-ipa-h"
                {...ipaScope}
                {...rootScope}
              >
                <div className="nbx-bh">
                  <span
                    className="ui-vocab-art"
                    aria-hidden="true"
                    dangerouslySetInnerHTML={{
                      __html: fixture.art["vocab-ipa-h"],
                    }}
                  />
                  <div className="nbx-sp vhi-tt" {...ipaScope}>
                    <h2 id="vocab-ipa-h">Phát âm IPA.</h2>
                    <span className="nbx-bt">
                      <span className="nbx-num">0/50</span> âm
                    </span>
                  </div>
                  <div className="nbx-act">
                    <Link href="/tu-vung/phat-am" className="nbx-lnk">
                      Bảng âm <IconArrowRight size={16} />
                    </Link>
                  </div>
                </div>
                <div className="nbx-ipa">
                  {ipa.groups.map((g, i) => (
                    <Link
                      key={g.slug}
                      href="/tu-vung/phat-am"
                      className={`nbx-row${i === 0 ? " nbx-on" : ""}`}
                      aria-current={i === 0 ? "step" : undefined}
                      {...ipaScope}
                    >
                      <span
                        className={`nbx-chip nbx-lvl vhi-lv is-s${i + 1}`}
                        {...ipaScope}
                      >
                        {g.difficulty}
                      </span>
                      <span className="nbx-tt">
                        <b>{g.title}</b>
                        <small {...ipaScope}>
                          0/{g.symbols.length} âm ·{" "}
                          {i === 0
                            ? "tiếp: /iː/ sheep"
                            : i === 1
                              ? "/e/ /ɒ/"
                              : "/ɪ/ /æ/"}
                        </small>
                      </span>
                      {i === 0 && (
                        <span
                          className="nbx-chip nbx-mark vhi-here"
                          {...ipaScope}
                        >
                          Bạn ở đây
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              </section>
            </div>
            <div
              className="tvh-cat"
              role="region"
              aria-label="Danh mục bài học"
              {...rootScope}
            >
              <div className="vhs" {...cardScope}>
                <section
                  className="nbx-blk nbx-r-ref nbx-ruled nbx-pile"
                  aria-labelledby="vocab-decks-h"
                  {...cardScope}
                >
                  <i className="nbx-tape nbx-k nbx-r" aria-hidden="true" />
                  <div className="nbx-bh">
                    <span
                      className="ui-vocab-art"
                      aria-hidden="true"
                      dangerouslySetInnerHTML={{
                        __html: fixture.art["vocab-decks-h"],
                      }}
                    />
                    <h2 id="vocab-decks-h">Bộ từ vựng đề xuất.</h2>
                    <div className="nbx-act">
                      <span className="nbx-bt">11 bộ</span>
                    </div>
                  </div>
                  <div className="vhs-feat" {...cardScope}>
                    {fixture.cards.slice(0, 3).map(deck)}
                  </div>
                  <div className="vhs-topics" {...cardScope}>
                    {fixture.cards.slice(3).map((d, i) => deck(d, i + 3))}
                  </div>
                </section>
                <section
                  className="nbx-blk nbx-r-info nbx-dots nbx-pile nbx-alt"
                  aria-labelledby="vocab-goals-h"
                  {...cardScope}
                >
                  {heading("vocab-goals-h", "Theo mục tiêu thi và mở rộng.")}
                  <div className="nbx-g nbx-trio">
                    {fixture.goals.map((g) => (
                      <div className="nbx-col" key={g.title}>
                        <h3 className="nbx-sub vhs-colh" {...cardScope}>
                          <span
                            className="ui-vocab-art"
                            aria-hidden="true"
                            dangerouslySetInnerHTML={{ __html: g.art }}
                          />
                          {g.title}
                        </h3>
                        <div className="nbx-ladder">
                          {g.cards.map((d) => (
                            <Link
                              href={d.href}
                              className="nbx-row"
                              key={d.href}
                            >
                              {d.level && (
                                <span className={d.levelClass}>{d.level}</span>
                              )}
                              <span className="nbx-tt">
                                <b>{d.title}</b>
                                {d.subtitle && <small>{d.subtitle}</small>}
                              </span>
                              <span className="nbx-num nbx-sm">{d.count}</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </div>
          </div>
        )}
      </div>
      {create && (
        <VocabCreateDialog
          onClose={() => setCreate(false)}
          onNotice={setNotice}
        />
      )}
      {notice && (
        <UiDialog title="Thông báo" onClose={() => setNotice(null)}>
          <p>{notice}</p>
        </UiDialog>
      )}
    </div>
  );
}
