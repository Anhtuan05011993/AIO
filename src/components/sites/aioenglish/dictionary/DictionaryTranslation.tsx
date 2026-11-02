"use client";
import { useEffect, useRef, useState } from "react";
type State = {
  term: string;
  status: "loading" | "ready" | "error";
  text: string;
};
export default function DictionaryTranslation({ term }: { term: string }) {
  const [state, setState] = useState<State>({
    term,
    status: "loading",
    text: "",
  });
  const [retry, setRetry] = useState(0);
  const retryButton = useRef<HTMLButtonElement>(null);
  const output = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    setState({ term, status: "loading", text: "" });
    const timer = setTimeout(() => controller.abort(), 30000);
    (async () => {
      try {
        const response = await fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ texts: [term] }),
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("translation-unavailable");
        const data = (await response.json()) as {
          translations?: unknown;
        } | null;
        const text =
          data &&
          Array.isArray(data.translations) &&
          typeof data.translations[0] === "string"
            ? data.translations[0].trim()
            : "";
        if (!text) throw new Error("translation-empty");
        if (active) {
          const restore = document.activeElement === retryButton.current;
          setState({ term, status: "ready", text });
          if (restore)
            requestAnimationFrame(() =>
              output.current?.focus({ preventScroll: true }),
            );
        }
      } catch {
        if (active) setState({ term, status: "error", text: "" });
      } finally {
        clearTimeout(timer);
      }
    })();
    return () => {
      active = false;
      clearTimeout(timer);
      controller.abort();
    };
  }, [term, retry]);
  const current =
    state.term === term
      ? state
      : { term, status: "loading" as const, text: "" };
  return (
    <div
      className="bg-surface border-bw border-border-strong rounded-card shadow-sh-2 card-pad mt-6"
      data-dict-gtx=""
    >
      <div>
        <div className="skel-in" data-dict-gtx-origin="local">
          <div className="flex items-baseline gap-x-2">
            <p
              className="min-w-0 whitespace-pre-wrap break-words text-base leading-6 text-fg-muted"
              data-dict-gtx-term=""
            >
              {term}
            </p>
          </div>
          <div
            className="mt-2 border-t border-border/60 pt-2 max-h-[50vh] overflow-y-auto"
            aria-busy={current.status === "loading"}
            role="status"
            aria-live="polite"
          >
            <p
              ref={output}
              tabIndex={-1}
              className="whitespace-pre-wrap break-words min-h-12 text-base leading-6 text-fg"
              data-dict-gtx-text={current.status === "ready" ? "" : undefined}
            >
              {current.status === "ready"
                ? current.text
                : current.status === "loading"
                  ? "Đang dịch…"
                  : "Không thể dịch lúc này. Vui lòng thử lại."}
            </p>
            {current.status !== "ready" &&
              (current.status === "error" || retry > 0) && (
                <button
                  ref={retryButton}
                  type="button"
                  className="nbc-btn is-soft is-sm mt-3"
                  aria-disabled={current.status === "loading"}
                  onClick={() => {
                    if (current.status === "loading") return;
                    setState({ term, status: "loading", text: "" });
                    setRetry((v) => v + 1);
                  }}
                >
                  Thử lại
                </button>
              )}
          </div>
          <p
            className="mt-3 text-right text-2xs leading-4 text-fg-subtle"
            data-dict-gtx-attr=""
          >
            Dịch tự động
          </p>
        </div>
      </div>
    </div>
  );
}
