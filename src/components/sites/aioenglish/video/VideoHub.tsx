"use client";
import VideoHeader from "./VideoHeader";
import { useEffect, useState } from "react";
import catalog from "@/lib/ui-fixtures/video-catalog.json";
import VideoLibrary from "./VideoLibrary";
import VideoSearchToolbar from "./VideoSearchToolbar";
import VideoFilters from "./VideoFilters";
import VideoAddPanel from "./VideoAddPanel";
import VideoModePicker, { type VideoPreview } from "./VideoModePicker";
import "@/styles/custom/video-reference.css";
import "@/styles/custom/video-parity.css";
export default function VideoHub({
  initialMine = false,
  initialLucky = false,
}: {
  initialMine?: boolean;
  initialLucky?: boolean;
}) {
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState("");
  const [mine, setMine] = useState(initialMine);
  const [filters, setFilters] = useState<HTMLElement | null>(null);
  const [topics, setTopics] = useState<string[]>([]);
  const [preview, setPreview] = useState<VideoPreview | null>(
    initialLucky ? catalog.intro : null,
  );
  useEffect(() => {
    const sync = () => {
      const url = new URL(location.href);
      const lucky = url.searchParams.get("lucky") === "1";
      setMine(url.searchParams.get("tab") === "cua-toi" && !lucky);
      setFilters(null);
      setPreview(lucky ? catalog.intro : null);
      if (lucky) {
        url.searchParams.delete("lucky");
        url.searchParams.delete("tab");
        history.replaceState(
          null,
          "",
          `${url.pathname}${url.search}${url.hash}`,
        );
      }
    };
    if (new URLSearchParams(location.search).get("lucky") === "1") sync();
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);
  function selectMine(value: boolean) {
    const next = new URL(location.href);
    if (value) next.searchParams.set("tab", "cua-toi");
    else next.searchParams.delete("tab");
    history.pushState(null, "", `${next.pathname}${next.search}${next.hash}`);
    setFilters(null);
    setPreview(null);
    setMine(value);
  }
  function addVideo() {
    selectMine(true);
  }

  const featured = catalog.intro;
  const [all, setAll] = useState(false);
  return (
    <div
      className="nb-skin nbx-hb vdh ui-video-hub"
      data-nb-accent="hong"
      data-v-ec44a65f=""
    >
      <div className="nbc-page nbx-main">
        <VideoHeader
          mine={mine}
          onMine={selectMine}
          onAdd={() => {
            selectMine(false);
            setPreview(featured);
          }}
        >
          <VideoSearchToolbar
            query={query}
            onQuery={setQuery}
            expanded={!!filters}
            count={topics.length + (level ? 1 : 0)}
            onFilter={(el) => setFilters(filters ? null : el)}
          />
        </VideoHeader>
        {filters && (
          <VideoFilters
            anchor={filters}
            level={level}
            selected={topics}
            onLevel={setLevel}
            onSelected={setTopics}
            onClose={() => setFilters(null)}
          />
        )}
        {mine ? (
          <div id="video-add-panel">
            <VideoAddPanel />
          </div>
        ) : (
          <VideoLibrary
            query={query}
            topics={topics}
            level={level}
            onSelect={setPreview}
            onAdd={addVideo}
            onChannel={(channel) => {
              setQuery(channel);
              setAll(true);
            }}
            onAll={() => setAll(true)}
            all={all}
            onBack={() => {
              setAll(false);
              setQuery("");
              setLevel("");
              setTopics([]);
            }}
          />
        )}
        {preview && (
          <VideoModePicker video={preview} onClose={() => setPreview(null)} />
        )}
      </div>
    </div>
  );
}
