"use client";

import { useState, type CSSProperties, type ReactNode } from "react";

/* Table of contents card for the legal doc pages. On mobile the list collapses
   behind the header button (.pld-toc.is-open toggles it in legal.css); on
   desktop the list is always visible and the button is inert-looking. */
export default function LegalToc({
  reading,
  chip,
  children,
}: {
  reading: string;
  chip: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <nav aria-label="Mục lục" data-nb-accent="xanhtroi" className={open ? "nbc-lv1 is-acard pld-toc is-open" : "nbc-lv1 is-acard pld-toc"} data-testid="legal-toc" data-bm="toc" data-v-2188c3e5="">
      <button type="button" className="pld-toc-h" aria-expanded={open} onClick={() => setOpen((v) => !v)} data-v-2188c3e5="">
        <span className="nbc-sk is-a" style={{ "--nb-sk-size": "32px" } as CSSProperties} aria-hidden="true" data-v-2188c3e5="">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-list-icon" aria-hidden="true" focusable="false">
            <path d="M3 12h.01"></path>
            <path d="M3 18h.01"></path>
            <path d="M3 6h.01"></path>
            <path d="M8 12h13"></path>
            <path d="M8 18h13"></path>
            <path d="M8 6h13"></path>
          </svg>
        </span>
        <span className="pld-toc-t" data-v-2188c3e5="">
          <b data-v-2188c3e5>Mục lục</b>
          <small data-v-2188c3e5>{reading}</small>
        </span>
        <span className="nbc-chip is-sm" data-v-2188c3e5>{chip}</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down-icon pld-toc-chev" aria-hidden="true" focusable="false" data-v-2188c3e5="">
          <path d="m6 9 6 6 6-6"></path>
        </svg>
      </button>
      {children}
    </nav>
  );
}
