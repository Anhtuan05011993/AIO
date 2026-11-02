"use client";
import { useId, useRef, useState, type FormEvent } from "react";
import art from "@/lib/ui-fixtures/video-art.json";
import { VocabIcon } from "../vocab/VocabLibraryToolbar";
const s = { "data-v-965404b0": "" };

export default function VideoAddPanel() {
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState(false);
  function submit(event: FormEvent) {
    event.preventDefault();
    let valid = false;
    try {
      const value = new URL(
        /^https?:\/\//i.test(url.trim()) ? url.trim() : `https://${url.trim()}`,
      );
      const host = value.hostname.toLowerCase();
      valid =
        host === "youtu.be"
          ? /^\/[\w-]{11}\/?$/.test(value.pathname)
          : ["youtube.com", "www.youtube.com", "m.youtube.com"].includes(
              host,
            ) &&
            (/^\/watch\/?$/.test(value.pathname)
              ? /^[\w-]{11}$/.test(value.searchParams.get("v") ?? "")
              : /^\/(shorts|embed|live)\/[\w-]{11}\/?$/.test(value.pathname));
    } catch {
      /* Inline validation below. */
    }
    if (!valid) {
      setNotice(false);
      setError("Nhập liên kết video YouTube hợp lệ.");
      requestAnimationFrame(() => input.current?.focus());
      return;
    }
    setError("");
    setNotice(true);
  }
  return (
    <section
      className="nbx-blk nbx-r-ivory vdh-mine"
      aria-label="Video của tôi"
      data-v-ec44a65f=""
    >
      <div className="vmv" data-v-c7d6c05b="">
        <section className="vah" aria-labelledby={`${id}-title`} {...s}>
          <div className="vah-in" {...s}>
            <div className="vah-intro" {...s}>
              <h2 className="vah-h" id={`${id}-title`} {...s}>
                Thêm video YouTube
              </h2>
              <p className="vah-lead" {...s}>
                Dán link video YouTube. Vài phút sau bạn có bài học từ video đó.
              </p>
              <ol className="vah-steps" {...s}>
                {[
                  ["Dán link", "Video YouTube có phụ đề"],
                  ["AI chia câu & dịch", "Tự tách từng câu, dịch nghĩa"],
                  [
                    "Luyện 4 chế độ",
                    "Dictation · Shadowing · Quiz · Subtitles",
                  ],
                ].map(([title, description], i) => (
                  <li className="vah-step" key={title} {...s}>
                    <span className="vah-step-ic" {...s}>
                      {i === 1 ? (
                        <VocabIcon kind="sparkles" size={17} />
                      ) : (
                        <svg
                          width="17"
                          height="17"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          aria-hidden="true"
                        >
                          {i === 0 ? (
                            <>
                              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                            </>
                          ) : (
                            <>
                              <rect x="2" y="4" width="20" height="16" rx="2" />
                              <path d="M7 16h10M6 8h.01M10 8h.01M14 8h.01M18 8h.01M8 12h.01M12 12h.01M16 12h.01" />
                            </>
                          )}
                        </svg>
                      )}
                    </span>
                    <span className="vah-step-b" {...s}>
                      <span className="vah-step-l" {...s}>
                        {title}
                      </span>
                      <span className="vah-step-d" {...s}>
                        {description}
                      </span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>
            <form className="vah-form" noValidate onSubmit={submit} {...s}>
              <div className="vah-lrow" {...s}>
                <label className="vah-label" htmlFor={id} {...s}>
                  Liên kết YouTube
                </label>
                <span className="vah-quota" id={`${id}-quota`} {...s}>
                  Còn 3/3 lượt hôm nay
                </span>
              </div>
              <div className="vah-field" {...s}>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="vah-field-ic"
                  aria-hidden="true"
                  {...s}
                >
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
                <input
                  ref={input}
                  id={id}
                  className="vah-input"
                  type="url"
                  inputMode="url"
                  enterKeyHint="go"
                  autoComplete="off"
                  spellCheck={false}
                  placeholder="youtube.com/watch?v=…"
                  value={url}
                  aria-invalid={!!error}
                  aria-describedby={`${id}-quota ${id}-status`}
                  onChange={(e) => {
                    setUrl(e.target.value);
                    setError("");
                    setNotice(false);
                  }}
                  {...s}
                />
                <button
                  type="submit"
                  className="nb-btn nb-btn-ink nb-btn-sm vah-submit"
                  disabled={!url.trim()}
                  data-v-6aa247ab=""
                  {...s}
                >
                  <VocabIcon kind="plus" size={16} />
                  Thêm
                </button>
              </div>
              <div
                className="vah-status"
                id={`${id}-status`}
                aria-live="polite"
                aria-atomic="true"
                {...s}
              >
                {error ? (
                  <p className="vah-msg" role="alert" {...s}>
                    {error}
                  </p>
                ) : notice ? (
                  <p className="vah-msg" role="status" {...s}>
                    Nội dung chưa được bổ sung. Bản local chưa xử lý phụ đề hoặc
                    gửi video.
                  </p>
                ) : (
                  <p className="vah-msg" {...s}>
                    Video dài tối đa 30 phút. Phát âm không rõ ràng (như ca
                    nhạc, quá ồn ào, …) có thể ảnh hưởng đến độ chính xác của
                    phụ đề.
                  </p>
                )}
              </div>
            </form>
          </div>
        </section>
        <div data-v-57f87889="" aria-hidden="true" />
        <div className="hnst" data-v-86ebee26="">
          <span
            className="ta-tile is-scene hnst-art"
            aria-hidden="true"
            data-v-86ebee26=""
          >
            <span
              style={{ display: "contents" }}
              dangerouslySetInnerHTML={{ __html: art.empty ?? "" }}
            />
          </span>
          <p className="hnst-t" data-v-86ebee26="">
            Chưa có video nào
          </p>
          <p className="hnst-p" data-v-86ebee26="">
            Dán link YouTube ở trên, bài học đầu tiên sẽ hiện ở đây.
          </p>
        </div>
      </div>
    </section>
  );
}
