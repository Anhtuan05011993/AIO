"use client";
import Link from "next/link";
import { useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import type { NguPhapNode } from "@/lib/demo-data/nguPhapCatalog";
import summaries from "@/lib/ui-fixtures/path-node-summaries.json";
import "@/styles/custom/path-node-panel-reference.css";
import "@/styles/custom/path-node-panel.css";

type Summary = { intro: string; formula: string[]; examples: { en: string; vi: string }[]; mistake: string };

export default function PathNodePanel({ node, onClose }: { node: NguPhapNode; onClose: () => void }) {
  const panel = useRef<HTMLElement>(null);
  const close = useRef(onClose);
  close.current = onClose;
  const [done, setDone] = useState(false);
  const data = (summaries as Record<string, Summary>)[node.id];
  const zone = ["A1", "A2", "B1", "B2", "C1", "C2"].indexOf(node.level) + 1;
  useLayoutEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const element = panel.current;
    element?.focus({ preventScroll: true });
    const escape = (event: KeyboardEvent) => {
      if (!event.defaultPrevented && event.key === "Escape") { event.preventDefault(); close.current(); }
    };
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("keydown", escape);
      if (previous?.isConnected && (document.activeElement === document.body || element?.contains(document.activeElement))) previous.focus({ preventScroll: true });
    };
  }, [node.id]);
  const colors = { "--panel-zone": `var(--zone-${zone})`, "--panel-ink": `var(--zone-${zone}-ink)` } as CSSProperties;
  return <aside ref={panel} style={colors} className="ui-map-panel mp-shell" data-testid="node-panel" data-map-panel="" data-no-pan="" tabIndex={-1} role="region" aria-label={`Chi tiết: ${node.title}`}>
    <span className="ui-map-panel-grip" aria-hidden="true" />
    <header className="mp-head">
      <span className="ndp-lv">{node.level}</span>
      <span className="ui-map-panel-heading"><h2>{node.title}</h2><p>{node.titleEn}</p></span>
      <button type="button" className="nb-btn nb-btn-soft nb-btn-icon ui-map-panel-close" aria-label="Đóng" data-testid="node-panel-close" onClick={onClose}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12" /></svg></button>
    </header>
    <div className="mp-body" data-testid="node-panel-body">
      <section><h3 className="mp-h3">Giải thích</h3><p className="mp-p">{data?.intro || node.titleEn}</p></section>
      <section><h3 className="mp-h3">Công thức</h3><div className="mp-fml">{data?.formula.length ? data.formula.map((line, i) => <p key={i} className="mp-fml-l font-mono">{line}</p>) : <p className="mp-fml-l">Xem công thức trong bài học.</p>}</div></section>
      <section><h3 className="mp-h3">Ví dụ</h3><ul className="mp-exl" style={{ "--mp-ex": "hsl(var(--panel-ink))" } as CSSProperties}>{data?.examples.map((example, i) => <li key={i} className="mp-ex"><b className="mp-ex-en">{example.en}</b><span className="mp-ex-vi">{example.vi}</span></li>)}</ul></section>
      <section><h3 className="mp-h3">Lỗi hay gặp</h3><p className="mp-mis">{data?.mistake || "Xem lưu ý trong bài học."}</p></section>
    </div>
    <footer className="mp-foot">
      <Link href={`/ngu-phap/${node.id}`} className="nb-btn nb-btn-ink nb-btn-md is-block" data-testid="node-panel-learn">Học bài này</Link>
      <button type="button" className={`nb-btn nb-btn-soft nb-btn-md is-block ndp-done${done ? " is-done" : ""}`} data-testid="node-panel-done" data-done={done} aria-pressed={done} onClick={() => setDone(value => !value)}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg><span className="ui-map-done-mobile">{done ? "Đã nắm" : "Đánh dấu đã nắm"}</span><span className="ui-map-done-desktop">{done ? "Đã nắm" : "Đã nắm?"}</span></button>
    </footer>
  </aside>;
}
