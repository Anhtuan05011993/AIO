"use client";

import Link from "next/link";
import { useEffect, useId } from "react";
import { speak, stopSpeaking } from "../lesson/speech";

import GrammarWordTap from "./GrammarWordTap";

const s = { "data-v-9d9dcbb8": "" };
export type DocumentBlock =
  | { type: "paragraph" | "heading"; text: string }
  | { type: "bullets" | "formula"; lines: string[] }
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "examples"; items: { en: string; vi: string; focus?: string[]; note?: string }[] }
  | { type: "callout"; tone: string; text: string }
  | { type: "practice"; items: { href: string; label: string }[] };

function DocumentIcon({ kind }: { kind: "speaker" | "arrow" | "tip" | "warn" | "note" }) {
  return (
    <svg {...s} width={kind === "speaker" ? 17 : 16} height={kind === "speaker" ? 17 : 16}
      viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"
      className={kind === "tip" || kind === "warn" || kind === "note" ? "gdr-call-ic" : undefined}>
      {kind === "speaker" ? <><path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z"/><path d="M16 9a5 5 0 0 1 0 6"/><path d="M19.364 18.364a9 9 0 0 0 0-12.728"/></>
        : kind === "arrow" ? <><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></>
        : kind === "note" ? <><circle cx="12" cy="12" r="10"/><path d="M12 16v-4m0-4h.01"/></>
        : kind === "warn" ? <><path d="m10.3 3.9-8.5 14.7a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4m0 4h.01"/></>
        : <><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6M10 22h4"/></>}
    </svg>
  );
}

/** Presentation-only blocks. No exercises, learning state or new course data. */
export default function GrammarDocumentBlocks({ blocks, label }: { blocks: DocumentBlock[]; label: string }) {
  const id = useId();
  useEffect(() => () => stopSpeaking(), []);
  return blocks.map((block, index) => {
    switch (block.type) {
      case "paragraph": return <p key={index} {...s} className="doc-p gdr-p whitespace-pre-line" data-testid="doc-p">{block.text}</p>;
      case "heading": return <h3 key={index} {...s} className="gdr-h3">{block.text}</h3>;
      case "bullets": return <ul key={index} {...s} className="gdr-dot">{block.lines.map((line, i) => <li key={i} {...s} className="whitespace-pre-line">{line}</li>)}</ul>;
      case "formula": return <div key={index} {...s} className="doc-fml nbc-lv3 is-w gdr-fml" data-testid="doc-formula">{block.lines.map((line, i) => <p key={i} {...s} className="whitespace-pre-wrap">{line}</p>)}</div>;
      case "table": return <div key={index} {...s} className="gdr-tbl">
        <div {...s} className="nbc-lv3 is-w gdr-tblw hidden md:block"><table {...s} className="doc-table hidden w-full md:table" aria-label={label}>
          <thead {...s}><tr {...s}>{block.headers.map((header, i) => <th key={i} {...s} scope="col">{header}</th>)}</tr></thead>
          <tbody {...s}>{block.rows.map((row, i) => <tr key={i} {...s}>{row.map((cell, j) => <td key={j} {...s} className="whitespace-pre-line">{cell}</td>)}</tr>)}</tbody>
        </table></div>
        <div {...s} className="grid gap-1.5 md:hidden" data-testid="doc-table-cards" role="table" aria-label={label} aria-colcount={block.headers.length} aria-rowcount={block.rows.length+1}><div role="row" aria-rowindex={1} className="sr-only">{block.headers.map((header,j)=><span role="columnheader" aria-colindex={j+1} key={j}>{header}</span>)}</div>{block.rows.map((row, i) => <div key={i} {...s} className="nbc-lv3 is-w gdr-tcard" data-testid="doc-table-card" role="row" aria-rowindex={i+2}>{row.map((cell, j) => <p key={j} {...s} role="cell" aria-colindex={j+1}><span {...s} className="gdr-tl">{block.headers[j]}: </span><span {...s} className="gdr-tv whitespace-pre-line">{cell}</span></p>)}</div>)}</div>
      </div>;
      case "examples": return <ul key={index} {...s} className="gdr-exs">{block.items.map((example, i) => {
        const description = `${id}-${index}-${i}`;
        return <li key={i} {...s} className="doc-exr gdr-ex">
          <button {...s} type="button" className="doc-spk nbc-lv3 gdr-spk" aria-label={`Nghe: ${example.en}`} aria-describedby={description} data-testid="doc-example" onClick={() => speak(example.en)}><DocumentIcon kind="speaker"/></button>
          <span {...s} className="gdr-ext"><span {...s} className="doc-en gdr-en" data-testid="doc-en"><GrammarWordTap text={example.en} focus={example.focus}/></span><span {...s} id={description} className="gdr-exm"><small {...s}>{example.vi}</small>{example.note && <small {...s} className="gdr-note">{example.note}</small>}</span></span>
        </li>;
      })}</ul>;
      case "callout": return <div key={index} {...s} className={`doc-call nbc-lv3 gdr-call${block.tone === "warn" ? " is-cur" : ""}`} data-testid="doc-callout" data-tone={block.tone} role="note" aria-label={block.tone === "warn" ? "Lưu ý quan trọng" : "Ghi chú"}><DocumentIcon kind={block.tone === "warn" ? "warn" : block.tone === "note" ? "note" : "tip"}/><span {...s} className="whitespace-pre-line" data-testid="doc-callout-text">{block.text}</span></div>;
      case "practice": return <div key={index} {...s} className="gdr-chips">{block.items.map(item => <Link key={item.href} {...s} href={item.href} className="doc-node-chip nbc-btn is-soft is-sm" data-wrap-ok=""><DocumentIcon kind="arrow"/><span {...s}>{item.label}</span></Link>)}</div>;
    }
  });
}
