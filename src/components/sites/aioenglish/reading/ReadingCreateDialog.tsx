"use client";
import {
  useLayoutEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import UiDialog from "../app/UiDialog";

const levels = [
  "A1 - Mới bắt đầu",
  "A2 - Sơ cấp",
  "B1 - Trung cấp",
  "B2 - Trung cao",
  "C1 - Cao cấp",
  "C2 - Thành thạo",
];
const lengths = ["Ngắn (~150 từ)", "Vừa (~250 từ)", "Dài (~350 từ)"];
const buttonClass =
  "relative inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium disabled:cursor-not-allowed oc-fixed ctl-md h-10 px-4";
function Choice({
  label,
  options,
  value,
  onChange,
  width,
}: {
  label: string;
  options: string[];
  value: number;
  onChange: (index: number) => void;
  width: number;
}) {
  const [open, setOpen] = useState(false),
    [active, setActive] = useState(value);
  const trigger = useRef<HTMLButtonElement>(null),
    menu = useRef<HTMLUListElement>(null);
  const [position, setPosition] = useState({
    left: 0,
    top: 0,
    width,
    maxHeight: 300,
  });
  const id = useId();
  const close = (restore = true) => {
    setOpen(false);
    if (restore) trigger.current?.focus();
  };
  useLayoutEffect(() => {
    if (!open) return;
    const rect = trigger.current!.getBoundingClientRect();
    const height = options.length * 40 + 12;
    const below = window.innerHeight - rect.bottom - 12;
    const above = rect.top - 12;
    const up = below < Math.min(height, 180) && above > below;
    const maxHeight = Math.min(height, up ? above : below);
    setPosition({
      left: Math.max(
        8,
        Math.min(rect.left, window.innerWidth - rect.width - 8),
      ),
      top: up ? rect.top - maxHeight - 4 : rect.bottom + 4,
      width: rect.width,
      maxHeight,
    });
    const dismiss = (e: PointerEvent) => {
      if (
        !menu.current?.contains(e.target as Node) &&
        !trigger.current?.contains(e.target as Node)
      )
        close(false);
    };
    const resize = () => close(false);
    const scroll = (e: Event) => {
      if (!menu.current?.contains(e.target as Node)) close(false);
    };
    document.addEventListener("pointerdown", dismiss);
    document.addEventListener("scroll", scroll, true);
    window.addEventListener("resize", resize);
    return () => {
      document.removeEventListener("pointerdown", dismiss);
      document.removeEventListener("scroll", scroll, true);
      window.removeEventListener("resize", resize);
    };
  }, [open, options.length]);
  function keys(e: KeyboardEvent) {
    if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      close();
      return;
    }
    if (e.key === "Tab") {
      close(false);
      return;
    }
    let next = active;
    if (e.key === "ArrowDown") next = (active + 1) % options.length;
    else if (e.key === "ArrowUp")
      next = (active + options.length - 1) % options.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = options.length - 1;
    else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onChange(active);
      close();
      return;
    } else return;
    e.preventDefault();
    setActive(next);
    menu.current?.children[next]?.scrollIntoView({ block: "nearest" });
  }
  return (
    <div className="flex min-w-0 max-w-full flex-col gap-1 text-sm text-fg-muted">
      <span className="lab-ink">{label}</span>
      <button
        ref={trigger}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? id : undefined}
        aria-activedescendant={open ? `${id}-${active}` : undefined}
        aria-label={label}
        data-ui-sel-btn=""
        className="btn-ink inline-flex h-11 items-center justify-between gap-2 rounded-btn bg-surface px-3 text-sm text-fg focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 h-9 max-w-full max-md:h-11"
        style={{ minWidth: width }}
        onClick={() => {
          setActive(value);
          setOpen(!open);
        }}
        onKeyDown={(e) => {
          if (open) {
            keys(e);
            return;
          }
          if (["ArrowDown", "ArrowUp", "Home", "End"].includes(e.key)) {
            e.preventDefault();
            setActive(
              e.key === "End"
                ? options.length - 1
                : e.key === "Home"
                  ? 0
                  : value,
            );
            setOpen(true);
          }
        }}
      >
        <span className="min-w-0 truncate">{options[value]}</span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      {open && (
        <ul
          ref={menu}
          id={id}
          tabIndex={-1}
          role="listbox"
          aria-label={label}
          data-ui-sel-menu=""
          className="ui-reading-choices fixed z-[230] overflow-y-auto overscroll-contain rounded-card border-bw border-border-strong bg-surface py-1 text-fg shadow-sh-3 scrollbar-thin focus:outline-none"
          style={position}
          onKeyDown={keys}
        >
          {options.map((option, index) => (
            <li
              key={option}
              id={`${id}-${index}`}
              role="option"
              aria-selected={value === index}
              className={`flex min-h-10 items-center gap-2 px-3 py-1.5 text-sm cursor-pointer ${active === index ? "bg-surface-2" : ""} ${value === index ? "font-semibold text-primary" : "text-fg"}`}
              onPointerMove={() => setActive(index)}
              onClick={() => {
                onChange(index);
                close();
              }}
            >
              <span className="w-[15px] shrink-0" aria-hidden="true">
                {value === index ? "✓" : ""}
              </span>
              <span className="min-w-0 flex-1 truncate">{option}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function ReadingCreateDialog({
  kind,
  onClose,
}: {
  kind: "ai" | "paste" | "press";
  onClose: () => void;
}) {
  const focus = useRef<HTMLFormElement>(null);
  const [text, setText] = useState(""),
    [topic, setTopic] = useState(""),
    [topics, setTopics] = useState<string[]>([]);
  const [level, setLevel] = useState(1),
    [length, setLength] = useState(0),
    [rows, setRows] = useState(kind === "paste" ? 7 : 3);
  const [message, setMessage] = useState(""),
    [error, setError] = useState("");
  const drag = useRef<{ y: number; rows: number } | null>(null);
  const title =
    kind === "ai"
      ? "Tạo bài dịch bằng AI"
      : kind === "paste"
        ? "Tạo bài dịch tuỳ chọn"
        : "Thêm bài báo từ link";
  function submit() {
    setError("");
    if (!text.trim()) {
      setError(
        kind === "ai"
          ? "Hãy mô tả bài bạn muốn luyện dịch."
          : "Vui lòng nhập nội dung.",
      );
      return;
    }
    if (kind === "press") {
      try {
        const url = new URL(text.trim());
        if (
          url.protocol !== "https:" ||
          url.pathname === "/" ||
          ![
            "theguardian.com",
            "www.theguardian.com",
            "theconversation.com",
            "www.theconversation.com",
            "theatlantic.com",
            "www.theatlantic.com",
          ].includes(url.hostname)
        )
          throw new Error();
      } catch {
        setError(
          "Nhập link hợp lệ từ The Guardian, The Conversation hoặc The Atlantic.",
        );
        return;
      }
    }
    setMessage("Chưa kết nối dịch vụ tạo bài. Nội dung chưa được bổ sung.");
  }
  function resize(next: number) {
    setRows(Math.max(kind === "paste" ? 7 : 3, Math.min(20, next)));
  }
  const textField = (
    <div className="relative">
      <textarea
        id="reading-create-input"
        rows={rows}
        maxLength={kind === "ai" ? 400 : 3000}
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck={false}
        className="field-ink block w-full px-3 py-2.5 text-sm"
        placeholder={
          kind === "ai"
            ? "ví dụ: một đoạn tin tức ngắn về du lịch bền vững"
            : "Dán đoạn văn bạn muốn luyện dịch…"
        }
        aria-label={kind === "paste" ? "Đoạn văn cần dịch" : undefined}
        aria-invalid={!!error}
        aria-describedby={error ? "reading-create-error" : undefined}
        style={{ resize: "none", paddingBottom: 36 }}
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          setError("");
          setMessage("");
        }}
      />
      <button
        type="button"
        aria-label="Kéo rộng - dùng mũi tên lên xuống để chỉnh"
        className="absolute bottom-2 right-2 inline-flex h-7 cursor-ns-resize select-none items-center gap-1 rounded-pill border-bw px-2.5 text-2xs font-semibold shadow-sh-1 lift press max-md:h-10 max-md:px-3 border-border-strong bg-rail text-fg-muted"
        style={{ touchAction: "none" }}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown" || e.key === "ArrowUp") {
            e.preventDefault();
            resize(rows + (e.key === "ArrowDown" ? 1 : -1));
          }
        }}
        onPointerDown={(e) => {
          if (!e.isPrimary || e.button !== 0) return;
          e.currentTarget.setPointerCapture(e.pointerId);
          drag.current = { y: e.clientY, rows };
        }}
        onPointerMove={(e) => {
          if (drag.current)
            resize(
              drag.current.rows + Math.round((e.clientY - drag.current.y) / 21),
            );
        }}
        onPointerUp={(e) => {
          drag.current = null;
          if (e.currentTarget.hasPointerCapture(e.pointerId))
            e.currentTarget.releasePointerCapture(e.pointerId);
        }}
        onPointerCancel={() => {
          drag.current = null;
        }}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path d="m8 8 4-4 4 4M12 4v16m-4-4 4 4 4-4" />
        </svg>
        Kéo rộng
      </button>
    </div>
  );
  return (
    <UiDialog
      sourceStyle
      className={`ui-reading-dialog ${kind === "press" ? "is-press" : ""}`}
      title={title}
      onClose={onClose}
      initialFocusRef={focus}
    >
      <form
        ref={focus}
        tabIndex={-1}
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
        className="ui-reading-form"
        noValidate
      >
        <div className="ui-reading-dialog-body">
          {kind === "press" ? (
            <>
              <label
                htmlFor="reading-create-url"
                className="lab-ink mb-2 block"
              >
                Link bài báo
              </label>
              <input
                id="reading-create-url"
                type="url"
                inputMode="url"
                enterKeyHint="go"
                autoComplete="off"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
                placeholder="https://www.theguardian.com/..."
                className="field-ink block h-11 w-full px-3 text-sm"
                value={text}
                onChange={(e) => {
                  setText(e.target.value);
                  setError("");
                  setMessage("");
                }}
                aria-invalid={!!error}
                aria-describedby={`reading-press-hint${error ? " reading-create-error" : ""}`}
              />
              <p id="reading-press-hint" className="mt-2 text-xs text-fg-muted">
                Hỗ trợ{" "}
                <b className="font-semibold text-fg">
                  The Guardian, The Conversation, The Atlantic
                </b>
                . Bài chỉ mình bạn thấy, mất khoảng một phút để dịch.
              </p>
            </>
          ) : (
            <>
              {kind === "ai" ? (
                <label
                  htmlFor="reading-create-input"
                  className="lab-ink mb-2 block"
                >
                  Bạn muốn luyện dịch bài về gì?
                </label>
              ) : (
                <p className="mb-2 text-xs text-fg-muted">
                  Dán đoạn tiếng Anh hoặc tiếng Việt (tối đa 3.000 ký tự) - hệ
                  thống tự dịch phía còn lại (~30 giây).
                </p>
              )}
              {textField}
              {kind === "paste" ? (
                <div className="mt-1 text-right text-2xs tabular-nums text-fg-subtle">
                  {text.length.toLocaleString("vi-VN")}/3.000
                </div>
              ) : (
                <>
                  <div className="mt-3">
                    <label
                      htmlFor="reading-topic"
                      className="lab-ink mb-2 block"
                    >
                      Chủ đề (tuỳ chọn)
                    </label>
                    <div className="flex flex-wrap items-center gap-2">
                      {topics.map((t) => (
                        <button
                          type="button"
                          key={t}
                          className="nbx-chip"
                          aria-label={`Bỏ chủ đề ${t}`}
                          onClick={() =>
                            setTopics(topics.filter((x) => x !== t))
                          }
                        >
                          {t} ×
                        </button>
                      ))}
                      <input
                        id="reading-topic"
                        type="text"
                        maxLength={40}
                        autoCapitalize="off"
                        autoCorrect="off"
                        spellCheck={false}
                        className="field-ink min-w-[8rem] flex-1 px-2.5 py-1.5 text-xs"
                        placeholder="Thêm chủ đề rồi Enter"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.nativeEvent.isComposing) {
                            e.preventDefault();
                            if (topic.trim() && !topics.includes(topic.trim()))
                              setTopics([...topics, topic.trim()]);
                            setTopic("");
                          }
                        }}
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap items-end gap-3">
                    <Choice
                      label="Trình độ"
                      options={levels}
                      value={level}
                      onChange={setLevel}
                      width={192}
                    />
                    <Choice
                      label="Độ dài"
                      options={lengths}
                      value={length}
                      onChange={setLength}
                      width={176}
                    />
                  </div>
                </>
              )}
            </>
          )}
          {error && (
            <p
              id="reading-create-error"
              role="alert"
              className="ui-reading-error"
            >
              {error}
            </p>
          )}
          {message && (
            <p role="status" className="ui-reading-status">
              {message}
            </p>
          )}
        </div>
        <div className="ui-reading-dialog-actions">
          <button
            type="button"
            onClick={onClose}
            className={`${buttonClass} btn-flat text-fg-muted hover:text-fg`}
          >
            Huỷ
          </button>
          <button
            type="submit"
            disabled={kind !== "ai" && !text.trim()}
            className={`${buttonClass} btn-ink btn-ink-cta`}
          >
            {kind === "ai"
              ? "Tạo bài"
              : kind === "paste"
                ? "Xử lý văn bản"
                : "Lấy bài"}
          </button>
        </div>
      </form>
    </UiDialog>
  );
}
