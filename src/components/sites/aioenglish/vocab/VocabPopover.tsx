"use client";
import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
export default function VocabPopover({
  anchor,
  title,
  width = 320,
  gap = 8,
  mobileBottomInset = 0,
  accent = "oaihuong",
  className = "",
  onClose,
  children,
}: {
  anchor: HTMLElement;
  title: string;
  width?: number;
  gap?: number;
  mobileBottomInset?: number;
  accent?: string;
  className?: string;
  onClose: () => void;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null),
    closeRef = useRef(onClose),
    restoreFocus = useRef(true);
  closeRef.current = onClose;
  const [position, setPosition] = useState({
    left: 12,
    top: 12,
    maxHeight: 400,
    tail: 22,
    above: false,
    ready: false,
  });
  useLayoutEffect(() => {
    function positionPopup() {
      const panel = ref.current;
      if (!panel) return;
      const a = anchor.getBoundingClientRect(),
        p = panel.getBoundingClientRect();
      const viewportWidth = document.documentElement.clientWidth,
        viewportHeight =
          document.documentElement.clientHeight -
          (viewportWidth < 640 ? mobileBottomInset : 0);
      const panelWidth = Math.min(width, viewportWidth - 16);
      const left = Math.max(
        8,
        Math.min(a.left, viewportWidth - panelWidth - 8),
      );
      const below = Math.max(0, viewportHeight - a.bottom - gap - 8),
        aboveSpace = Math.max(0, a.top - gap - 8);
      const above = p.height > below && aboveSpace > below;
      const maxHeight = Math.max(0, above ? aboveSpace : below);
      const visibleHeight = Math.min(p.height, maxHeight);
      const top = Math.max(
        8,
        Math.min(
          above ? a.top - visibleHeight - gap : a.bottom + gap,
          viewportHeight - visibleHeight - 8,
        ),
      );
      const tail = Math.max(
        12,
        Math.min(a.left + a.width / 2 - left, panelWidth - 12),
      );
      setPosition((old) =>
        old.left === left &&
        old.top === top &&
        old.maxHeight === maxHeight &&
        old.tail === tail &&
        old.above === above &&
        old.ready
          ? old
          : { left, top, maxHeight, tail, above, ready: true },
      );
    }
    function key(e: KeyboardEvent) {
      if (e.key !== "Escape") return;
      const inside =
        !!ref.current?.contains(document.activeElement) ||
        anchor.contains(document.activeElement);
      restoreFocus.current = inside;
      if (inside) {
        e.preventDefault();
        e.stopPropagation();
      }
      closeRef.current();
    }
    function outside(e: PointerEvent) {
      if (e.button !== 0) return;
      const target = e.target as Node;
      if (!ref.current?.contains(target) && !anchor.contains(target)) {
        restoreFocus.current = false;
        closeRef.current();
      }
    }
    positionPopup();
    const observer = new ResizeObserver(positionPopup);
    if (ref.current) observer.observe(ref.current);
    observer.observe(anchor);
    window.addEventListener("resize", positionPopup);
    window.addEventListener("scroll", positionPopup, true);
    document.addEventListener("keydown", key, true);
    document.addEventListener("pointerdown", outside, true);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", positionPopup);
      window.removeEventListener("scroll", positionPopup, true);
      document.removeEventListener("keydown", key, true);
      document.removeEventListener("pointerdown", outside, true);
      if (restoreFocus.current && anchor.isConnected) anchor.focus();
    };
  }, [anchor, width, gap, mobileBottomInset]);
  return createPortal(
    <div
      ref={ref}
      role="dialog"
      aria-label={title}
      className={`ui-vocab-pop nb-skin ${className}`.trim()}
      data-ui-popover=""
      data-nb-accent={accent}
      style={{
        position: "fixed",
        zIndex: 220,
        left: position.left,
        top: position.top,
        width,
        maxWidth: "calc(100vw - 16px)",
        visibility: position.ready ? "visible" : "hidden",
      }}
    >
      <div
        data-ui-pop-panel=""
        className={`overflow-y-auto overscroll-contain rounded-card border-bw border-border-strong bg-surface text-fg shadow-sh-3 scrollbar-thin nb-pop-panel ${width === 224 ? "p-2" : "p-3"}`}
        style={{ maxHeight: position.maxHeight }}
      >
        {children}
      </div>
      <span
        className="pop-tail"
        data-v-c4b16c4b=""
        aria-hidden="true"
        style={{
          left: position.tail,
          top: position.above ? "auto" : -5,
          bottom: position.above ? -5 : "auto",
          transform: position.above ? "rotate(225deg)" : "rotate(45deg)",
        }}
      />
    </div>,
    document.body,
  );
}
