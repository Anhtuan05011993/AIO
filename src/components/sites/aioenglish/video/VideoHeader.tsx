import art from "@/lib/ui-fixtures/video-art.json";
export default function VideoHeader({
  mine,
  onMine,
  onAdd,
  children,
}: {
  mine: boolean;
  onMine: (value: boolean) => void;
  onAdd: () => void;
  children: React.ReactNode;
}) {
  return (
    <header
      className="nbc-hd nbx-f-vid"
      data-nb-feature="vid"
      data-nb-header=""
      data-v-ec44a65f=""
    >
      <span
        aria-hidden="true"
        style={{ display: "contents" }}
        dangerouslySetInnerHTML={{ __html: art.decoration ?? "" }}
      />
      <div className="nbc-hd-row is-top">
        <div className="nbc-hd-head">
          <div className="nbc-hd-tt">
            <span
              aria-hidden="true"
              style={{ display: "contents" }}
              dangerouslySetInnerHTML={{ __html: art.header ?? "" }}
            />
            <h1>
              <span className="nbc-hd-wide">Dictation &amp; Shadowing.</span>
              <span className="nbc-hd-narrow">Video.</span>
            </h1>
            <div className="nbc-hd-chips">
              <span className="nbx-chip nbx-plain nbx-hide-m">
                1.215&nbsp; video
              </span>
            </div>
          </div>
        </div>
        <div className="nbc-hd-cta">
          <button
            className={`nbx-btn nbx-b-mine${mine ? " nbx-on" : ""}`}
            aria-pressed={mine}
            onClick={() => onMine(!mine)}
          >
            <svg
              className="nbx-ic"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
            <span className="nbc-hd-wide">Video của tôi</span>
            <span className="nbc-hd-narrow">Của tôi</span>
            <span className="nbx-cnt">0</span>
          </button>
          <a
            href="/video?lucky=1"
            className="nbx-btn nbx-b-pri nbx-hide-m"
            onClick={(e) => {
              if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
              e.preventDefault();
              onAdd();
            }}
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
              <path d="m18 2 4 4-4 4M2 18h1.4c1.3 0 2.5-.6 3.3-1.7l6.1-8.6c.7-1.1 2-1.7 3.3-1.7H22M2 6h1.9c1.5 0 2.9.9 3.6 2.2M22 18h-5.9c-1.3 0-2.6-.7-3.3-1.8l-.5-.8m6.4-.2 4 4-4 4" />
            </svg>
            Video ngẫu nhiên
          </a>
        </div>
      </div>
      <div className="nbc-hd-tools">
        {mine ? (
          <>
            <button
              className="nbx-btn nbx-b-sec nbx-sm"
              onClick={() => onMine(false)}
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
                <path d="m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z" />
                <circle cx="12" cy="12" r="10" />
              </svg>
              Khám phá
            </button>
            <button
              className="nbx-btn nbx-b-sec nbx-sm"
              onClick={() =>
                document
                  .getElementById("video-add-panel")
                  ?.scrollIntoView({ block: "start" })
              }
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
                <path d="M5 12h14M12 5v14" />
              </svg>
              Thêm video
            </button>
          </>
        ) : (
          children
        )}
      </div>
    </header>
  );
}
