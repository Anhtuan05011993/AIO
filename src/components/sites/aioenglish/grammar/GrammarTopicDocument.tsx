"use client";
import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { nguPhapCatalog as catalog } from "@/lib/demo-data/nguPhapCatalog";
import summaries from "@/lib/ui-fixtures/path-node-summaries.json";
import GrammarDocumentBlocks, { type DocumentBlock } from "./GrammarDocumentBlocks";
import presentationSamples from "@/lib/ui-fixtures/grammar-document-presentation.json";
import localBlocks from "@/lib/ui-fixtures/grammar-document-local-blocks.json";
import blockSamples from "@/lib/ui-fixtures/grammar-document-block-samples.json";
import samples from "@/lib/ui-fixtures/grammar-document-sample.json";
import art from "@/lib/ui-fixtures/grammar-art.json";
import "@/styles/custom/grammar-document-reference.css";
import "@/styles/custom/grammar-document-parity.css";
const rootScope = { "data-v-e8b2529d": "" },
  bodyScope = { "data-v-9d9dcbb8": "" },
  tocScope = { "data-v-92681091": "" };
type Section = {
  id: string;
  title: string;
  tone: boolean;
  paragraphs?: string[];
  bullets?: string[];
};
type EmbeddedPresentation = { current: string[]; focus: string; tones: Record<string, boolean> };
type Sample = { outline: Section[]; preview: Section[] };
export function GrammarDocumentBody({
  slug,
  embedded = false,
}: {
  slug: string;
  embedded?: boolean;
}) {
  const topic = catalog.topics.find((t) => t.slug === slug)!;
  const nodes = topic.nodeIds.flatMap(
    (id) => catalog.nodes.find((n) => n.id === id) ?? [],
  );
  const sample = (samples as Record<string, Sample>)[slug];
  const sections: Section[] = sample?.outline ?? [
    { id: "sec-tldr", title: "Tổng quan", tone: false },
    ...nodes.map((n) => ({
      id: `sec-${n.id}`,
      title: `Dùng khi nào: ${n.title}`,
      tone: true,
    })),
    { id: "sec-recap", title: "Tổng kết", tone: false },
  ];
  const root = useRef<HTMLDivElement>(null), toc = useRef<HTMLElement>(null);
  const [active, setActive] = useState("sec-tldr");
  const presentation = embedded ? (presentationSamples as Record<string, EmbeddedPresentation>)[slug] : undefined;
  useEffect(() => {
    if (!embedded) return;
    const element = root.current, scroller = element?.closest<HTMLElement>(".gr-doc-scroll");
    if (!element || !scroller) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const line = scroller.getBoundingClientRect().top + (toc.current?.offsetHeight ?? 52) + 9; // 8px anchor margin + 1px scroll rounding
      const list = Array.from(element.querySelectorAll<HTMLElement>(".gdr-sec"));
      const current = list.filter(section => section.getBoundingClientRect().top <= line).at(-1) ?? list[0];
      if (current) setActive(current.id);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const observer = new ResizeObserver(schedule); observer.observe(scroller);
    scroller.addEventListener("scroll", schedule, {passive:true}); schedule();
    return () => { scroller.removeEventListener("scroll", schedule); observer.disconnect(); if(frame) cancelAnimationFrame(frame); };
  }, [embedded, slug]);
  useEffect(() => {
    if (!embedded || !toc.current) return;
    const nav = toc.current, link = nav.querySelector<HTMLElement>("[aria-current='location']");
    if (!link) return;
    const r = link.getBoundingClientRect(), nr = nav.getBoundingClientRect();
    if(r.left < nr.left || r.right > nr.right) nav.scrollTo({left:nav.scrollLeft+r.left-nr.left-(nav.clientWidth-r.width)/2,behavior:"auto"});
  }, [active, embedded]);
  return (
    <div
      ref={root}
      {...bodyScope}
      {...rootScope}
      className={`doc-root gdr nb-frame${embedded ? "" : " is-cols"}`}
      data-testid="grammar-document-body"
      data-nb-accent="camdao"
      style={embedded ? {"--toc-h":"52px"} as CSSProperties : undefined}
    >
      {embedded && <nav ref={toc} {...tocScope} {...bodyScope} className="doc-toc gdt sticky top-0 z-10 py-2 is-ov" aria-label="Mục lục" data-testid="doc-toc">
        {sections.map(section => <a key={section.id} {...tocScope} href={`#${section.id}`}
          className={`doc-chip nbc-btn is-soft is-sm tap-40 shrink-0${active === section.id ? " is-on" : ""}${presentation?.current.includes(section.id) ? " is-mine" : ""}`}
          aria-current={active === section.id ? "location" : undefined} title={section.title}
          onClick={event => {
            const target = root.current?.querySelector<HTMLElement>(`#${section.id}`), scroller = root.current?.closest<HTMLElement>(".gr-doc-scroll");
            if(!target || !scroller) return;
            event.preventDefault();
            scroller.scrollTo({top:scroller.scrollTop+target.getBoundingClientRect().top-scroller.getBoundingClientRect().top-(toc.current?.offsetHeight ?? 52)-8,behavior:"auto"});
            setActive(section.id);
          }}><span {...tocScope} className="gdt-t">{section.title}</span></a>)}
      </nav>}

      <div {...bodyScope} className="gdr-flow">
        {sections.map((section) => {
          const preview = sample?.preview.find((x) => x.id === section.id);
          const blocks = (blockSamples as Record<string, Record<string, DocumentBlock[]>>)[slug]?.[section.id]
            ?? (localBlocks.topics as Record<string, Record<string, DocumentBlock[]>>)[slug]?.[section.id];
          const nodeId = (localBlocks.sectionNodes as Record<string, Record<string, string>>)[slug]?.[section.id]
            ?? section.id.replace(/^sec-/, "");
          const node = nodes.find(node => node.id === nodeId) ?? nodes[0];
          const text =
            (summaries as Record<string, { intro: string }>)[node?.id]?.intro ??
            topic.titleEn;
          const mine = presentation?.current.includes(section.id) ?? false;
          const focused = presentation?.focus === section.id;
          const tone = presentation?.tones[section.id] ?? section.tone;
          return (
            <section key={section.id} {...bodyScope}
              id={section.id}
              className={`doc-sec gdr-sec${mine ? " doc-sec-mine" : ""}`}
              data-mine={mine}
              data-testid={`doc-${section.id}`}
            >
              {focused && <div {...bodyScope} className="nbc-under gdr-under" aria-hidden="true"/>}
              <div
                {...bodyScope}
                className={`nbc-lv1 gdr-sheet${mine ? " is-acard" : ""}${tone ? " is-s-kraft" : ""}`}
              >
                {focused && <span {...bodyScope} className="nbc-tape gdr-tape" aria-hidden="true"/>}
                <div {...bodyScope} className="gdr-hrow">
                  <h2 {...bodyScope} className="doc-h2 gdr-h2">
                    {section.title}
                  </h2>
                  {focused && <span {...bodyScope} className="nbc-pill gdr-now">Điểm bạn đang học</span>}
                </div>
                <GrammarDocumentBlocks key={`${slug}:${section.id}`} label={section.title} blocks={blocks ?? [
                  ...(preview?.paragraphs ?? [text]).map(text => ({type:"paragraph" as const,text})),
                  ...(preview?.bullets?.length ? [{type:"bullets" as const,lines:preview.bullets}] : [])
                ]}/>

              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
export default function GrammarTopicDocument({ slug }: { slug: string }) {
  const topic = catalog.topics.find((t) => t.slug === slug)!;
  const sample = (samples as Record<string, Sample>)[slug];
  const sections = sample?.outline ?? [
    { id: "sec-tldr", title: "Tổng quan" },
    ...topic.nodeIds.map((id) => ({
      id: `sec-${id}`,
      title: `Dùng khi nào: ${catalog.nodes.find((n) => n.id === id)?.title ?? id}`,
    })),
    { id: "sec-recap", title: "Tổng kết" },
  ];
  const [active, setActive] = useState("sec-tldr");
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { root: document.querySelector("main"), rootMargin: "-10% 0px -65% 0px" },
    );
    document
      .querySelectorAll(".ui-grammar-document .doc-sec")
      .forEach((e) => observer.observe(e));
    return () => observer.disconnect();
  }, [slug]);
  return (
    <div
      {...rootScope}
      className="nb-skin npt ui-grammar-document"
      data-nb-accent="camdao"
    >
      <div {...rootScope} className="nbc-page">
        <header
          {...rootScope}
          className="nbc-hd nbx-f-gram"
          data-nb-feature="gram"
          data-nb-header=""
          data-testid="page-head"
        >
          <span
            style={{display:"contents"}}
            aria-hidden="true"
            dangerouslySetInnerHTML={{ __html: art.decoration }}
          />
          <div className="nbc-hd-row is-top">
            <div className="nbc-hd-head">
              <div className="nbc-hd-tt">
                <Link
                  href="/ngu-phap"
                  className="nbc-back"
                  aria-label="Quay lại Luyện ngữ pháp"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    aria-hidden="true"
                  >
                    <path d="m12 19-7-7 7-7M19 12H5" />
                  </svg>
                  <span>Luyện ngữ pháp</span>
                </Link>
                <h1 data-testid="runner-title">{topic.title}</h1>
                <div className="nbc-hd-chips" data-nb-clip-ok="chips that do not fit leave whole">
                  <span {...rootScope} className="nbc-chip">{topic.titleEn}</span>
                  <span {...rootScope} className="nbc-chip"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>{topic.readMinutes} phút đọc</span>
                </div>
              </div>
            </div>
            <div className="nbc-hd-cta">
              <Link
                href={`/ngu-phap/${topic.nodeIds[0]}`}
                className="nbc-btn is-ink"
              >
                Bắt đầu học
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
              </Link>
            </div>
          </div>
          <div className="nbc-hd-tools">
            <nav
              {...tocScope}
              {...rootScope}
              className="doc-toc gdt is-hd"
              aria-label="Mục lục"
              data-testid="doc-toc"
            >
              {sections.map((section) => (
                <a key={section.id} {...tocScope}
                  href={`#${section.id}`}
                  className={`doc-chip nbc-btn is-soft is-sm tap-40 shrink-0${active === section.id ? " is-on" : ""}`}
                  aria-current={active === section.id ? "true" : undefined}
                  onClick={() => setActive(section.id)}
                >
                  <span {...tocScope} className="gdt-t">
                    {section.title}
                  </span>
                </a>
              ))}
            </nav>
          </div>
        </header>
        <div className="min-w-0">
          <div {...rootScope} className="npt-body">
            <GrammarDocumentBody slug={slug} />
            <section {...rootScope} className="nbc-lv1 is-kraft npt-end" aria-label="Đọc xong" data-testid="doc-foot">
              <p {...rootScope}>Đọc xong thì luyện liền cho nhớ.</p>
              <Link {...rootScope} href="/ngu-phap" className="nbc-btn is-soft" data-testid="doc-back">Về danh sách</Link>
              <Link {...rootScope} href={`/ngu-phap/${topic.nodeIds[0]}`} className="nbc-btn is-act" data-testid="doc-start">
                Bắt đầu học<svg {...rootScope} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
              </Link>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
