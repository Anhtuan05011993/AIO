"use client";
import "@/styles/custom/dialog-source.css";

import {
  useEffect,
  useId,
  useRef,
  type ReactNode,
  type RefObject,
} from "react";

export default function UiDialog({
  title,
  children,
  onClose,
  className = "",
  sourceStyle = false,
  initialFocusRef,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
  className?: string;
  sourceStyle?: boolean;
  initialFocusRef?: RefObject<HTMLElement | null>;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const id = useId();
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const dialog = ref.current;
    dialog?.showModal();
    initialFocusRef?.current?.focus();
    return () => {
      dialog?.close();
      previous?.focus();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className={`ui-dialog ${className}`.trim()}
      data-ui-dlg={sourceStyle ? "" : undefined}
      aria-labelledby={id}
      onCancel={onClose}
      onClick={(e) => {
        if (e.target !== e.currentTarget) return;
        const r = e.currentTarget.getBoundingClientRect();
        if (
          e.clientX < r.left ||
          e.clientX > r.right ||
          e.clientY < r.top ||
          e.clientY > r.bottom
        )
          onClose();
      }}
    >
      <div className="ui-dialog-head">
        <h2 id={id} className={sourceStyle ? "dlg-title" : undefined}>
          {title}
        </h2>
        <button
          autoFocus={!initialFocusRef}
          className="ui-icon-button"
          onClick={onClose}
          aria-label="Đóng"
          data-dlg-close={sourceStyle ? "" : undefined}
        >
          {sourceStyle ? (
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          ) : (
            "×"
          )}
        </button>
      </div>
      {children}
    </dialog>
  );
}
