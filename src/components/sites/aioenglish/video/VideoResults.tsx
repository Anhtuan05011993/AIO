import { type VideoPreview } from "./VideoModePicker";
import { useRef, useState } from "react";
const s = { "data-v-af8e00a6": "" },
  c = { "data-v-af0bc721": "" },
  t = { "data-v-fe628554": "" };
export default function VideoResults({
  videos,
  title,
  onBack,
  onSelect,
}: {
  videos: (VideoPreview & { translation: string })[];
  title: string;
  onBack: () => void;
  onSelect: (v: VideoPreview) => void;
}) {
  const [page, setPage] = useState(1);
  const pages = Math.max(1, Math.ceil(videos.length / 24));
  const current = Math.min(page, pages);
  const heading = useRef<HTMLHeadingElement>(null);
  function navigate(next: number) {
    setPage(next);
    requestAnimationFrame(() => {
      heading.current?.focus();
      heading.current?.scrollIntoView({ block: "start" });
    });
  }
  return (
    <section
      className="vdh-kho nbx-blk nbx-r-info"
      aria-label="Kho video"
      data-v-ec44a65f=""
    >
      <div className="vb" {...s}>
        <div className="vb-grid" {...s}>
          <div className="vb-grid-head" {...s}>
            <button
              type="button"
              className="nb-btn nb-btn-soft nb-btn-sm vb-back"
              onClick={onBack}
              {...s}
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
              Khám phá
            </button>
            <h2 className="vb-grid-h" ref={heading} tabIndex={-1} {...s}>
              {title}
            </h2>
          </div>
          {videos.length ? (
            <div className="vb-cards" {...s}>
              {videos.slice((current - 1) * 24, current * 24).map((v) => (
                <button
                  type="button"
                  className="vnc"
                  key={v.title}
                  onClick={() => onSelect(v)}
                  aria-label={`${v.title} · ${v.translation} · ${v.channel} · ${v.level} · ${v.duration}`}
                  {...s}
                  {...c}
                >
                  <span className="vnc-p nbc-lv2" {...c}>
                    <span className="vht" {...c} {...t}>
                      <img
                        className="vht-img"
                        src={v.thumbnail}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        {...t}
                      />
                      <span className="vht-d" {...t}>
                        {v.duration}
                      </span>
                    </span>
                    <span className="vnc-body" {...c}>
                      <span className="vnc-t" {...c}>
                        {v.title}
                      </span>
                      <span className="vnc-vi" lang="vi" {...c}>
                        {v.translation}
                      </span>
                      <span className="vnc-meta" {...c}>
                        <span className="vnc-ch" {...c}>
                          {v.channel}
                        </span>
                        <span className="vnc-lv" {...c}>
                          {v.level}
                        </span>
                      </span>
                    </span>
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <p role="status">Không tìm thấy video phù hợp.</p>
          )}
          {!!videos.length && (
            <nav
              aria-label="Phân trang"
              className="vpg vb-pager"
              data-v-2d2c0bf8=""
            >
              <button
                className="nbc-btn is-soft is-sm vpg-b vpg-step"
                data-v-2d2c0bf8=""
                disabled={current === 1}
                onClick={() => navigate(current - 1)}
              >
                Trước
              </button>
              <span className="vpg-of" aria-live="polite" data-v-2d2c0bf8="">
                Trang {current}/{pages}
              </span>
              {Array.from({ length: pages }, (_, i) => (
                <button
                  key={i}
                  className={`nbc-btn is-soft is-sm vpg-b vpg-n${current === i + 1 ? " is-on" : ""}`}
                  data-v-2d2c0bf8=""
                  aria-current={current === i + 1 ? "page" : undefined}
                  aria-label={`Trang ${i + 1}`}
                  onClick={() => navigate(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
              <button
                className="nbc-btn is-soft is-sm vpg-b vpg-step"
                data-v-2d2c0bf8=""
                disabled={current === pages}
                onClick={() => navigate(current + 1)}
              >
                Tiếp
              </button>
            </nav>
          )}
        </div>
      </div>
    </section>
  );
}
