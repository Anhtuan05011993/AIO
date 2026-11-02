"use client";
import { useEffect, useRef, useState, type PointerEvent } from "react";
import map from "@/lib/ui-fixtures/path-map.json";
import { nguPhapCatalog as catalog } from "@/lib/demo-data/nguPhapCatalog";
import PathNodePanel from "./PathNodePanel";

type TopicMap = { html: string; width: number; height: number };
const topicCache = new Map<string, TopicMap>();

// Observed reset poses at client widths 366/336 (390/360px viewports).
function trailPose(width: number) {
  if (width >= 600) return { x: (width - 760) / 2, y: 40, scale: 1 };
  const narrow = Math.max(0, Math.min(1, (366 - width) / 30));
  return { x: (width - 760 * 0.7) / 2 + 4.5 * narrow, y: 49.3 + 2.1 * narrow, scale: 0.7 };
}

// Static vector/geometry fixture from the reference; no course content or remote HTML.
export default function PathKnowledge() {
  const viewer = useRef<HTMLDivElement>(null);
  const railToggle = useRef<HTMLButtonElement>(null);
  const railSearch = useRef<HTMLInputElement>(null);
  const world = useRef<HTMLDivElement>(null);
  const drag = useRef<{
    x: number;
    y: number;
    px: number;
    py: number;
    moved: boolean;
  } | null>(null);
  const suppressClick = useRef(false);
  const [pose, setPose] = useState({ x: 0, y: 40, scale: 1 });
  const [query, setQuery] = useState("");
  const [selectedMap, setSelectedMap] = useState("level-map");
  const [railOpen, setRailOpen] = useState(false);
  useEffect(() => { if (railOpen) railSearch.current?.focus(); }, [railOpen]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [topic, setTopic] = useState<TopicMap | null>(null);
  const [topicState, setTopicState] = useState<"loading" | "ready" | "error">("ready");
  const [retry, setRetry] = useState(0);
  const isTopic = !selectedMap.startsWith("level-");
  const isAsset = selectedMap !== "level-map";
  const fitTopic = (data: TopicMap) => {
    const w = viewer.current?.clientWidth ?? 760;
    const h = viewer.current?.clientHeight ?? 600;
    const scale = Math.max(0.4, Math.min(1, (w - 80) / data.width, (h - 80) / data.height));
    setPose({ x: (w - data.width * scale) / 2, y: (h - data.height * scale) / 2, scale });
  };
  useEffect(() => {
    if (!isAsset) { setTopic(null); setTopicState("ready"); return; }
    const abort = new AbortController();
    setTopic(null);
    setTopicState("loading");
    const cached = topicCache.get(selectedMap);
    const load = cached ? Promise.resolve(cached) : fetch(`/assets/aioenglish/maps/${selectedMap}.json`, { signal: abort.signal }).then(async response => {
      if (!response.ok) throw new Error("map asset unavailable");
      const data = await response.json() as TopicMap;
      if (typeof data.html !== "string" || !Number.isFinite(data.width) || !Number.isFinite(data.height) || data.width <= 0 || data.height <= 0) throw new Error("invalid map asset");
      return data;
    });
    load.then(data => {
      if (abort.signal.aborted) return;
      topicCache.set(selectedMap, data);
      setTopic(data); setTopicState("ready");
      if (isTopic) fitTopic(data);
      else {
        const w = viewer.current?.clientWidth ?? 760;
        setPose(trailPose(w));
      }
    }).catch(() => { if (!abort.signal.aborted) setTopicState("error"); });
    return () => abort.abort();
  }, [selectedMap, isTopic, isAsset, retry]);
  useEffect(() => {
    if (isAsset) return;
    const w = viewer.current?.clientWidth ?? 760;
    setPose(trailPose(w));
  }, [selectedMap, isAsset]);
  const reset = () => {
    if (isTopic && topic) { fitTopic(topic); return; }
    const w = viewer.current?.clientWidth ?? 760;
    setPose(trailPose(w));
  };
  useEffect(() => {
    reset();
    const element = viewer.current;
    if (!element) return;
    let width = element.clientWidth;
    let height = element.clientHeight;
    const observer = new ResizeObserver(() => {
      const next = element.clientWidth;
      const delta = (next - width) / 2;
      const nextHeight = element.clientHeight;
      const deltaY = (nextHeight - height) / 2;
      width = next;
      height = nextHeight;
      if (delta || deltaY) setPose((p) => ({ ...p, x: p.x + delta, y: p.y + deltaY }));
    });
    observer.observe(element);
    const wheel = (e: WheelEvent) => {
      e.preventDefault();
      zoom(e.deltaY < 0 ? 0.1 : -0.1);
    };
    element.addEventListener("wheel", wheel, { passive: false });
    return () => {
      observer.disconnect();
      element.removeEventListener("wheel", wheel);
    };
  }, []);
  const zoom = (amount: number) =>
    setPose((p) => {
      const scale = Math.max(0.35, Math.min(1.8, p.scale + amount));
      const cx = (viewer.current?.clientWidth ?? 760) / 2;
      const cy = (viewer.current?.clientHeight ?? 600) / 2;
      return {
        x: cx - ((cx - p.x) * scale) / p.scale,
        y: cy - ((cy - p.y) * scale) / p.scale,
        scale,
      };
    });
  const goMap = (id: string) => {
    setSelectedNode(null);
    if (id === selectedMap) { reset(); setRailOpen(false); if (railOpen) railToggle.current?.focus(); return; }
    if (id === "level-map") {
      setSelectedMap(id);
      const w = viewer.current?.clientWidth ?? 760;
      setPose(trailPose(w));
    } else if (id.startsWith("level-")) {
      setSelectedMap(id);
    } else {
      setSelectedMap(id);
      setSelectedNode(null);
    }
    setRailOpen(false);
    if (railOpen) railToggle.current?.focus();
  };
  const pointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 || !e.isPrimary) return;
    suppressClick.current = false;
    drag.current = {
      x: e.clientX,
      y: e.clientY,
      px: pose.x,
      py: pose.y,
      moved: false,
    };
  };
  const node = catalog.nodes.find((n) => n.id === selectedNode);
  const closeNode = () => {
    const id = selectedNode;
    setSelectedNode(null);
    if (id) requestAnimationFrame(() => {
      world.current?.querySelector<HTMLButtonElement>(`[data-key="${id}"] button[data-testid="trail-part"]`)?.focus({ preventScroll: true });
    });
  };
  const entries = map.rail.filter((e) =>
    (e.title + " " + e.subtitle)
      .toLocaleLowerCase("vi")
      .includes(query.toLocaleLowerCase("vi")),
  );
  return (
    <div className="ui-path-knowledge lt-know">
      <p className="sr-only" role="status" aria-live="polite">{isAsset && topicState === "loading" ? "Đang tải bản đồ" : isAsset && topicState === "error" ? "Không thể tải bản đồ" : ""}</p>
      <button
        ref={railToggle}
        className="ui-map-mobile-toggle nbc-btn"
        aria-expanded={railOpen}
        aria-controls="path-map-rail"
        onClick={() => setRailOpen(!railOpen)}
      >
        ☷ {map.rail.find((e) => e.id === selectedMap)?.title ?? "Tìm bản đồ"} ⌄
      </button>
      <section className="ui-map-frame mv-frame" aria-label="Bản đồ kiến thức">
        <div
          ref={viewer}
          className="ui-map-viewer"
          role="region"
          tabIndex={0}
          aria-label="Bản đồ, dùng phím mũi tên để di chuyển"
          onPointerDown={pointerDown}
          onPointerMove={(e) => {
            const d = drag.current;
            if (!d) return;
            d.moved =
              d.moved ||
              Math.abs(e.clientX - d.x) + Math.abs(e.clientY - d.y) > 5;
            if (d.moved) e.currentTarget.setPointerCapture(e.pointerId);
            setPose((p) => ({
              ...p,
              x: d.px + e.clientX - d.x,
              y: d.py + e.clientY - d.y,
            }));
          }}
          onPointerUp={() => {
            suppressClick.current = drag.current?.moved ?? false;
            drag.current = null;
          }}
          onPointerCancel={() => {
            drag.current = null;
            suppressClick.current = false;
          }}
          onKeyDown={(e) => {
            if ((e.target as Element).matches("input,textarea,select")) return;
            const steps: Record<string, [number, number]> = {
              ArrowDown: [0, -80],
              ArrowUp: [0, 80],
              ArrowLeft: [80, 0],
              ArrowRight: [-80, 0],
            };
            if (steps[e.key]) {
              e.preventDefault();
              const [x, y] = steps[e.key];
              setPose((p) => ({ ...p, x: p.x + x, y: p.y + y }));
            }
            if (e.key === "+" || e.key === "=") {
              e.preventDefault();
              zoom(0.1);
            }
            if (e.key === "-") {
              e.preventDefault();
              zoom(-0.1);
            }
            if (e.key === "Home") {
              e.preventDefault();
              reset();
            }
          }}
        >
          <div className="lb-grid" aria-hidden="true" />
          {!isTopic && <div className="ui-map-wash" aria-hidden="true" />}
          {isAsset && topicState !== "ready" && <div className="ui-map-load">
            <p>{topicState === "loading" ? "Đang tải bản đồ…" : "Không thể tải bản đồ lúc này."}</p>
            {topicState === "error" && <button className="nbc-btn" onClick={() => setRetry(n => n + 1)}>Thử lại</button>}
          </div>}
          <div
            ref={world}
            className="ui-map-world"
            style={{
              width: isAsset ? topic?.width : undefined,
              height: isAsset ? topic?.height : undefined,
              transform: `translate(${pose.x}px,${pose.y}px) scale(${pose.scale})`,
            }}
            onClick={(e) => {
              if (suppressClick.current && e.detail !== 0) {
                suppressClick.current = false;
                return;
              }
              const b = (e.target as Element).closest<HTMLButtonElement>(
                'button[data-testid="trail-part"]',
              );
              if (!b) return;
              const key = b.closest("[data-key]")?.getAttribute("data-key");
              if (key) setSelectedNode(key);
            }}
            onFocusCapture={(e) => {
              const target = (e.target as Element).closest("button");
              const frame = viewer.current?.getBoundingClientRect();
              if (!target || !frame) return;
              const rect = target.getBoundingClientRect();
              if (rect.left < frame.left || rect.right > frame.right || rect.top < frame.top || rect.bottom > frame.bottom) {
                setPose(p => ({ ...p, x: p.x + frame.left + frame.width / 2 - rect.left - rect.width / 2, y: p.y + frame.top + frame.height / 2 - rect.top - rect.height / 2 }));
              }
            }}
            dangerouslySetInnerHTML={{ __html: isAsset ? topic?.html ?? "" : map.world }}
          />
        </div>
        <div className="ui-map-controls">
          <button aria-label="Thu nhỏ" onClick={() => zoom(-0.1)}>
            −
          </button>
          <output aria-label="Mức thu phóng">
            {Math.round(pose.scale * 100)}%
          </output>
          <button aria-label="Phóng to" onClick={() => zoom(0.1)}>
            +
          </button>
          <button aria-label="Vừa màn hình" onClick={reset}>
            ⛶
          </button>
        </div>
        <span className="ui-map-hint">
          Kéo để di chuyển · Lăn chuột để thu phóng
        </span>
        {node && <PathNodePanel key={node.id} node={node} onClose={closeNode} />}
      </section>
      <aside
        id="path-map-rail"
        className={"ui-map-rail" + (railOpen ? " is-open" : "")}
        aria-label="Danh mục bản đồ"
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            e.preventDefault();
            setRailOpen(false);
            railToggle.current?.focus();
          }
        }}
      >
        <label htmlFor="path-map-search">Tìm bản đồ</label>
        <input
          ref={railSearch}
          id="path-map-search"
          type="search"
          className="ui-search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Tìm bản đồ"
        />
        {!isTopic && <button className="nbc-btn is-soft" onClick={() => goMap("level-map")}>
          ◎ Về vị trí của tôi
        </button>}
        <div className="ui-map-rail-list">
          {entries.map((entry, i) => (
            <div key={entry.id}>
              {(entry.id === "level-map" ||
                entry.id === "tenses" ||
                entry.id === "noun" ||
                entry.id === "prefixes") && (
                <h3>
                  {entry.id === "level-map"
                    ? "Lộ trình"
                    : entry.id === "tenses"
                      ? "Thì động từ"
                      : entry.id === "noun"
                        ? "Ngữ pháp cốt lõi"
                        : "Cấu tạo từ"}
                </h3>
              )}
              <button
                className={
                  "mrl-item ui-map-rail-item" +
                  (selectedMap === entry.id ? " is-active" : "")
                }
                aria-pressed={selectedMap === entry.id}
                onClick={() => goMap(entry.id)}
              >
                <span
                  className="mrl-ic"
                  aria-hidden="true"
                  dangerouslySetInnerHTML={{ __html: entry.icon ?? "" }}
                />
                <span>
                  <b className="mrl-t">{entry.title}</b>
                  <small className="mrl-s">{entry.subtitle}</small>
                </span>
              </button>
            </div>
          ))}
          {!entries.length && (
            <p className="ui-empty">Không tìm thấy bản đồ.</p>
          )}
        </div>
      </aside>
    </div>
  );
}
