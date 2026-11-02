"use client";
import { useRef, useState } from "react";
import UiDialog from "../app/UiDialog";
import icons from "@/lib/ui-fixtures/video-modes.json";
const s = { "data-v-e340b985": "" };
const modes = [
  ["Dictation", "Nghe và chép lại"],
  ["Shadowing", "Nghe và nói lại"],
  ["Quiz", "Nghe và làm trắc nghiệm"],
  ["Subtitles", "Xem phụ đề song ngữ"],
];
export type VideoPreview = {
  title: string;
  level: string;
  channel: string;
  duration: string;
  thumbnail: string;
};
export default function VideoModePicker({
  video,
  onClose,
}: {
  video: VideoPreview;
  onClose: () => void;
}) {
  const [mode, setMode] = useState(0),
    [notice, setNotice] = useState(false);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const firstButton = useRef<HTMLButtonElement>(null);
  return (
    <UiDialog
      title="Chọn cách học"
      onClose={onClose}
      className="ui-video-mode"
      sourceStyle
      initialFocusRef={firstButton}
    >
      <div className="ui-video-mode-body">
        <div className="vmp nb-dlg nb-pop nbx-f-vid" data-nb-picker="" {...s}>
          <div className="vmp-lesson" {...s}>
            <span className="vmp-thumb" aria-hidden="true" {...s}>
              <img
                src={video.thumbnail}
                alt=""
                style={{
                  width: "100%",
                  aspectRatio: "16/9",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            </span>
            <span className="vmp-title" {...s}>
              {video.title}
            </span>
            <span className="vmp-level" {...s}>
              {video.level}
            </span>
            <span className="vmp-sub" {...s}>
              {video.channel} · {video.duration}
            </span>
          </div>
          <div
            className="vmp-grid"
            role="radiogroup"
            aria-label="Chế độ học"
            {...s}
          >
            {modes.map(([name, desc], i) => (
              <button
                type="button"
                role="radio"
                key={name}
                ref={(el) => {
                  buttons.current[i] = el;
                  if (i === 0) firstButton.current = el;
                }}
                className={`vmp-opt nbp-opt${mode === i ? " vmp-on nbp-on" : ""}`}
                aria-checked={mode === i}
                tabIndex={mode === i ? 0 : -1}
                onClick={() => {
                  setMode(i);
                  setNotice(false);
                }}
                onKeyDown={(e) => {
                  let next = i;
                  if (e.key === "ArrowRight" || e.key === "ArrowDown")
                    next = (i + 1) % 4;
                  else if (e.key === "ArrowLeft" || e.key === "ArrowUp")
                    next = (i + 3) % 4;
                  else if (e.key === "Home") next = 0;
                  else if (e.key === "End") next = 3;
                  else return;
                  e.preventDefault();
                  setMode(next);
                  setNotice(false);
                  buttons.current[next]?.focus();
                }}
                {...s}
              >
                <span
                  className="vmp-ico nbp-ico"
                  aria-hidden="true"
                  dangerouslySetInnerHTML={{ __html: icons[i] ?? "" }}
                  {...s}
                />
                <span className="vmp-txt" {...s}>
                  <span className="vmp-name" {...s}>
                    {name}
                  </span>
                  <span className="vmp-desc nbp-desc" {...s}>
                    {desc}
                  </span>
                </span>
              </button>
            ))}
          </div>
          <p role="status" className="ui-video-mode-status" hidden={!notice}>
            {notice ? "Nội dung chưa được bổ sung." : ""}
          </p>
        </div>
      </div>
      <div className="ui-video-mode-actions">
        <button className="nb-btn nb-btn-soft nb-btn-sm" onClick={onClose}>
          Huỷ
        </button>
        <button
          className="nb-btn nb-btn-ink nb-btn-sm"
          onClick={() => setNotice(true)}
        >
          Bắt đầu học
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path d="M5 12h14m-6-6 6 6-6 6" />
          </svg>
        </button>
      </div>
    </UiDialog>
  );
}
