"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";
import VideoResults from "./VideoResults";
import catalog from "@/lib/ui-fixtures/video-catalog.json";
import { type VideoPreview } from "./VideoModePicker";
const s = { "data-v-ecd6b480": "" },
  thumbScope = { "data-v-eba74cda": "" },
  nowScope = { "data-v-9eb47d27": "" },
  modesScope = { "data-v-074f1064": "" };
const modes = [
  ["Dictation", "Nghe và chép lại"],
  ["Shadowing", "Nghe và nói lại"],
  ["Quiz", "Nghe và làm trắc nghiệm"],
  ["Subtitles", "Xem phụ đề song ngữ"],
];
function Art({ name }: { name: keyof typeof catalog.art }) {
  return (
    <span
      aria-hidden="true"
      className={`ta-tile is-head ta-plate nbx-r-${{ vhn: "do", vhm: "info", "vhk-ex": "ref", "vhk-ch": "goal" }[name]} nbx-bh-art`}
      {...(name === "vhn" ? nowScope : name === "vhm" ? modesScope : s)}
      dangerouslySetInnerHTML={{
        __html: catalog.art[name]
          .replace(/^<span[^>]*>/, "")
          .replace(/<\/span>$/, ""),
      }}
    />
  );
}
function Thumb({
  video,
  small = false,
  play = false,
}: {
  video: VideoPreview;
  small?: boolean;
  play?: boolean;
}) {
  return (
    <span
      className={`nbx-thumb vxt nbx-lv-${video.level.toLowerCase()}${small ? " nbx-sm" : ""}`}
      aria-hidden="true"
      {...s}
      {...thumbScope}
    >
      <img
        className="vxt-img"
        src={video.thumbnail}
        alt=""
        loading="lazy"
        decoding="async"
        {...thumbScope}
      />
      {play && (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="nbx-ic vxt-play"
          {...thumbScope}
        >
          <polygon points="6 3 20 12 6 21 6 3" />
        </svg>
      )}
      <small className="nbx-dur" {...thumbScope}>
        {video.duration}
      </small>
    </span>
  );
}
function Carousel({
  label,
  className,
  children,
  heading,
  actions,
  channel = false,
}: {
  label: string;
  className: string;
  children: ReactNode;
  heading: ReactNode;
  actions?: ReactNode;
  channel?: boolean;
}) {
  const lane = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });
  const update = () => {
    const el = lane.current;
    if (el)
      setEdges({
        start: el.scrollLeft <= 1,
        end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 1,
      });
  };
  useEffect(() => {
    const el = lane.current;
    if (!el) return;
    const observer = new ResizeObserver(update);
    observer.observe(el);
    update();
    return () => observer.disconnect();
  }, []);
  return (
    <>
      <div className="nbx-bh" {...s}>
        {heading}
        <div className={`nbx-act${channel ? " vhk-ch-act" : ""}`} {...s}>
          {actions}
          <div className="vhk-nav" aria-label={label} {...s}>
            <button
              type="button"
              className="nb-btn nb-btn-soft nb-btn-icon"
              aria-label={channel ? "Các kênh trước" : "Xem các video trước"}
              disabled={edges.start}
              onClick={() =>
                lane.current?.scrollBy({
                  left: -lane.current.clientWidth * 0.85,
                  behavior: "smooth",
                })
              }
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>
            <button
              type="button"
              className="nb-btn nb-btn-soft nb-btn-icon"
              aria-label={channel ? "Thêm kênh" : "Xem thêm video"}
              disabled={edges.end}
              onClick={() =>
                lane.current?.scrollBy({
                  left: lane.current.clientWidth * 0.85,
                  behavior: "smooth",
                })
              }
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div
        ref={lane}
        className={`vhk-lane ${className}`}
        onScroll={update}
        {...s}
      >
        {children}
      </div>
    </>
  );
}
export default function VideoLibrary({
  query,
  level,
  topics,
  onSelect,
  onAdd,
  onChannel,
  onAll,
  all: showAll,
  onBack,
}: {
  query: string;
  level: string;
  topics: string[];
  onSelect: (video: VideoPreview) => void;
  onAdd: () => void;
  onChannel: (channel: string) => void;
  onAll: () => void;
  all: boolean;
  onBack: () => void;
}) {
  const all = [
    ...catalog.all,
    ...catalog.recommended,
    ...catalog.featured,
    ...catalog.latest,
  ];
  const results = all.filter(
    (v, i) =>
      all.findIndex((p) => p.title === v.title) === i &&
      (!level || v.level.startsWith(level)) &&
      (!topics.length || topics.some((t) => v.topics.includes(t))) &&
      `${v.title} ${v.translation} ${v.channel}`
        .toLocaleLowerCase("vi")
        .includes(query.trim().toLocaleLowerCase("vi")),
  );
  const chip = (v: VideoPreview) => (
    <span className={`nbx-chip nbx-lvl nbx-lv-${v.level.toLowerCase()}`} {...s}>
      {v.level}
    </span>
  );
  const row = (v: VideoPreview) => (
    <button
      type="button"
      className="nbx-row vhk-nr"
      key={v.title}
      onClick={() => onSelect(v)}
      aria-label={`${v.title} · ${v.channel} · ${v.level}`}
      {...s}
    >
      <Thumb video={v} small />
      <span className="nbx-tt" {...s}>
        <b {...s}>{v.title}</b>
        <small {...s}>{v.channel}</small>
      </span>
      {chip(v)}
    </button>
  );
  const card = (v: (typeof catalog.recommended)[number]) => (
    <button
      type="button"
      className="nbx-vcard nbx-polaroid vhk-card"
      key={v.title}
      onClick={() => onSelect(v)}
      aria-label={`${v.title} · ${v.translation} · ${v.channel} · ${v.level}`}
      {...s}
    >
      <Thumb video={v} play />
      <b className="vhk-ct" {...s}>
        {v.title}
      </b>
      <small className="vhk-cv" {...s}>
        {v.translation}
      </small>
      <span className="nbx-row-flex" {...s}>
        <span className="nbx-mut nbx-sm nbx-sp nbx-ell" {...s}>
          {v.channel}
        </span>
        {chip(v)}
      </span>
    </button>
  );
  if (showAll || query || level || topics.length)
    return (
      <VideoResults
        key={`${query}:${level}:${topics.join(",")}`}
        videos={results}
        title={
          query || level || topics.length
            ? "Kết quả tìm kiếm."
            : "Tất cả kho video"
        }
        onBack={onBack}
        onSelect={onSelect}
      />
    );
  return (
    <section className="vdh-kho" aria-label="Kho video" data-v-ec44a65f="">
      <div className="vhk" {...s}>
        {query || level ? (
          <section className="nbx-blk nbx-r-info nbx-grid" {...s}>
            <div className="nbx-bh">
              <h2>Kết quả tìm kiếm.</h2>
            </div>
            {results.length ? (
              <div className="nbx-vlist nbx-g3">{results.map(row)}</div>
            ) : (
              <p role="status">Không tìm thấy video phù hợp.</p>
            )}
          </section>
        ) : (
          <>
            <div className="nbx-g nbx-pair vhk-pair" {...s}>
              <section
                className="nbx-blk nbx-r-ivory nbx-dots nbx-pile vhn"
                aria-labelledby="vhn-h"
                {...s}
                {...nowScope}
              >
                <i className="nbx-tape" aria-hidden="true" {...nowScope} />
                <div className="nbx-bh" {...nowScope}>
                  <Art name="vhn" />
                  <h2 id="vhn-h" {...nowScope}>
                    Gợi ý bắt đầu.
                  </h2>
                </div>
                <div className="nbx-vnow" {...nowScope}>
                  <button
                    type="button"
                    className="vhn-th"
                    aria-label={`Bắt đầu: ${catalog.intro.title}`}
                    onClick={() => onSelect(catalog.intro)}
                    {...nowScope}
                  >
                    <Thumb video={catalog.intro} play />
                  </button>
                  <div className="nbx-vmeta" {...nowScope}>
                    <b className="nbx-vt vhn-t" {...nowScope}>
                      {catalog.intro.title}
                    </b>
                    <p className="nbx-mut nbx-sm" {...nowScope}>
                      TED-Ed · 72 câu
                    </p>
                    <div className="nbx-row-flex" {...nowScope}>
                      <span
                        className="nbx-bar nbx-sp"
                        role="progressbar"
                        aria-label="Đã học 0%"
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={0}
                      >
                        <i style={{ width: 0 }} />
                      </span>
                      <span className="nbx-b nbx-num nbx-sm" {...nowScope}>
                        0%
                      </span>
                    </div>
                    <div className="nbx-row-flex vhn-acts" {...nowScope}>
                      <button
                        type="button"
                        className="nbx-btn nbx-b-pri nbx-sm"
                        onClick={() => onSelect(catalog.intro)}
                        {...nowScope}
                      >
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          aria-hidden="true"
                          className="nbx-ic"
                        >
                          <polygon points="6 3 20 12 6 21 6 3" />
                        </svg>
                        Bắt đầu
                      </button>
                      <button
                        type="button"
                        className="nbx-lnk nbx-sm vhn-add"
                        onClick={onAdd}
                        {...nowScope}
                      >
                        Dán link YouTube
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          aria-hidden="true"
                          className="nbx-ic"
                        >
                          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </section>
              <section
                className="nbx-blk nbx-r-ref vhm"
                aria-labelledby="vhm-h"
                {...s}
                {...modesScope}
              >
                <div className="nbx-bh" {...modesScope}>
                  <Art name="vhm" />
                  <h2 id="vhm-h" {...modesScope}>
                    Bốn cách học.
                  </h2>
                </div>
                <div className="nbx-modes" {...modesScope}>
                  {modes.map(([name, desc], i) => (
                    <p className="nbx-row vhm-mode" key={name} {...modesScope}>
                      <span
                        className="nbx-tile nbx-s30"
                        aria-hidden="true"
                        dangerouslySetInnerHTML={{
                          __html: catalog.modeIcons[i],
                        }}
                        {...modesScope}
                      />
                      <span className="nbx-tt" {...modesScope}>
                        <b {...modesScope}>{name}</b>
                        <small {...modesScope}>{desc}</small>
                      </span>
                    </p>
                  ))}
                </div>
              </section>
            </div>
            <section
              className="nbx-blk nbx-r-info nbx-grid vhk-ex"
              aria-labelledby="vhk-ex-h"
              {...s}
            >
              <i className="nbx-tape nbx-k nbx-r" aria-hidden="true" {...s} />
              <Carousel
                label="Video"
                className="vhk-lk is-fade-r"
                heading={
                  <>
                    <Art name="vhk-ex" />
                    <h2 id="vhk-ex-h" {...s}>
                      Khám phá.
                    </h2>
                    <h3 className="nbx-bh-sub" {...s}>
                      Có lẽ bạn sẽ thích
                    </h3>
                  </>
                }
                actions={
                  <>
                    <button
                      type="button"
                      className="nbx-lnk vhk-all"
                      onClick={onAll}
                      {...s}
                    >
                      Xem tất cả kho (1.215)
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        aria-hidden="true"
                      >
                        <path d="M5 12h14m-6-6 6 6-6 6" />
                      </svg>
                    </button>
                  </>
                }
              >
                {catalog.recommended.map(card)}
              </Carousel>
              <h3 className="nbx-sub" {...s}>
                Video nổi bật
              </h3>
              <div className="nbx-vlist nbx-g3" {...s}>
                {catalog.featured.map(row)}
              </div>
              <h3 className="nbx-sub" {...s}>
                Bài học mới
              </h3>
              <div className="nbx-vlist nbx-g3" {...s}>
                {catalog.latest.map(row)}
              </div>
            </section>
            <section
              className="nbx-blk nbx-r-ref nbx-ruled nbx-pile vhk-ch"
              aria-labelledby="vhk-ch-h"
              {...s}
            >
              <Carousel
                channel
                label="Kênh video"
                className="vhk-chl is-fade-r"
                heading={
                  <>
                    <Art name="vhk-ch" />
                    <h2 id="vhk-ch-h" {...s}>
                      Theo kênh.
                    </h2>
                  </>
                }
                actions={
                  <span className="nbx-bt" {...s}>
                    26 kênh
                  </span>
                }
              >
                {catalog.channels.map((c) => (
                  <button
                    type="button"
                    key={c.key}
                    className="nbx-vcard vhk-chc"
                    aria-label={`${c.title} · ${c.meta} · chủ yếu ${c.level}`}
                    onClick={() => onChannel(c.title)}
                    {...s}
                  >
                    <span className="vhk-art" aria-hidden="true" {...s}>
                      {c.images.map((src, i) => (
                        <span
                          className={`vhk-ath nbx-lv-${c.level.toLowerCase()}`}
                          key={i}
                          {...s}
                        >
                          <img
                            src={src}
                            alt=""
                            loading="lazy"
                            decoding="async"
                            {...s}
                          />
                        </span>
                      ))}
                    </span>
                    <span className="vhk-chh" {...s}>
                      <span className="nbx-av" aria-hidden="true" {...s}>
                        {c.initials}
                      </span>
                      <span className="nbx-tt" {...s}>
                        <b {...s}>{c.title}</b>
                        <small {...s}>{c.meta}</small>
                      </span>
                      <span
                        className={`nbx-chip nbx-lvl nbx-lv-${c.level.toLowerCase()}`}
                        {...s}
                      >
                        {c.level}
                      </span>
                    </span>
                  </button>
                ))}
              </Carousel>
            </section>
          </>
        )}
      </div>
    </section>
  );
}
