"use client";
import Link from "next/link";
import { useRef, type CSSProperties, type PointerEvent } from "react";
import fixture from "@/lib/ui-fixtures/mobile-menu.json";
import type { AppRoute } from "./AppShell";
import { CritterAvatar } from "./dashboard/DashboardArt";
import "@/styles/custom/mobile-menu-reference.css";
import "@/styles/custom/mobile-menu-parity.css";
const s = { "data-v-a71354be": "" };
const artwork = Object.fromEntries(
  fixture.items.map((item) => [item.href, item]),
);
type Item = { to: AppRoute; label: string; soon?: boolean };
export default function MobileNavSheet({
  primary,
  secondary,
  active,
  name,
  level,
  streak,
  xp,
  onNavigate,
  onDismiss,
  onDrag,
}: {
  primary: Item[];
  secondary: Item[];
  active: AppRoute;
  name: string;
  level: string;
  streak: number;
  xp: number;
  onNavigate: () => void;
  onDismiss: () => void;
  onDrag: (pixels: number) => void;
}) {
  const drag = useRef<{ y: number; time: number } | null>(null);
  function end(event: PointerEvent<HTMLDivElement>, cancel = false) {
    const start = drag.current;
    drag.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId))
      event.currentTarget.releasePointerCapture(event.pointerId);
    if (!start) return;
    const distance = Math.max(0, event.clientY - start.y);
    const speed = distance / Math.max(1, event.timeStamp - start.time);
    onDrag(0);
    if (!cancel && (distance > 80 || (distance > 32 && speed > 0.6)))
      onDismiss();
  }
  const item = (entry: Item) => {
    const asset = artwork[entry.to];
    const styles = {
      "--nb-sk-size": "32px",
      "--nb-fc": asset?.background,
    } as CSSProperties;
    const colors = Object.entries(asset?.tint ?? {})
      .map(([k, v]) => `--nb-x-${k}:${v}`)
      .join(";");
    const art = (asset?.art ?? "").replace("<svg", `<svg style="${colors}"`);
    return (
      <Link
        key={entry.to}
        href={entry.to}
        onClick={onNavigate}
        className={`ms-item${active === entry.to ? " is-on" : ""}`}
        aria-current={active === entry.to ? "page" : undefined}
        {...s}
      >
        <span
          className="nbc-sk nbt ms-tile"
          data-tone={asset?.tone}
          style={styles}
          aria-hidden="true"
          dangerouslySetInnerHTML={{ __html: art }}
          {...s}
        />
        <span className="ms-label" {...s}>
          {entry.label}
        </span>
        {entry.soon && (
          <span className="ms-tag" {...s}>
            Sắp có
          </span>
        )}
      </Link>
    );
  };
  return (
    <>
      <div
        className="ms-handle"
        onPointerDown={(event) => {
          if (event.button !== 0) return;
          drag.current = { y: event.clientY, time: event.timeStamp };
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={(event) => {
          if (drag.current) onDrag(Math.max(0, event.clientY - drag.current.y));
        }}
        onPointerUp={(event) => end(event)}
        onPointerCancel={(event) => end(event, true)}
        {...s}
      >
        <div className="ms-grip" aria-hidden="true" {...s} />
      </div>
      <div className="ms-list scrollbar-thin" {...s}>
        {primary.map(item)}
        {secondary.length > 0 && (
          <div className="ms-sep" aria-hidden="true" {...s}>
            <div className="ms-divider" {...s} />
          </div>
        )}
        {secondary.map(item)}
        <div className="ms-account" {...s}>
          <div className="nbu nbx-me">
            <div className="nbu-row nbx-who">
              <Link
                href="/cai-dat"
                className="nbu-av"
                aria-label="Cài đặt tài khoản"
                tabIndex={-1}
                onClick={onNavigate}
              >
                <CritterAvatar index={-1} />
              </Link>
              <div className="nbu-text">
                <p className="nbu-name">{name}</p>
                <p className="nbu-sub">Trình độ {level}</p>
              </div>
              <Link
                href="/cai-dat"
                className="nb-btn nb-btn-soft nb-btn-sm nbu-settings"
                onClick={onNavigate}
              >
                <span
                  aria-hidden="true"
                  style={{ display: "contents" }}
                  dangerouslySetInnerHTML={{ __html: fixture.settings }}
                />
                Cài đặt
              </Link>
            </div>
            <div className="nbu-stats nbx-st">
              <span
                className="nbu-st is-streak"
                role="group"
                aria-label={`Chuỗi điểm danh ${streak} ngày`}
              >
                <b>
                  <span
                    aria-hidden="true"
                    style={{ display: "contents" }}
                    dangerouslySetInnerHTML={{ __html: fixture.flame }}
                  />
                  {streak.toLocaleString("vi-VN")}
                </b>
                <small>ngày liền</small>
              </span>
              <span className="nbu-st" role="group" aria-label={`XP tháng ${xp}`}>
                <b>{xp.toLocaleString("vi-VN")}</b>
                <small>XP tháng</small>
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
