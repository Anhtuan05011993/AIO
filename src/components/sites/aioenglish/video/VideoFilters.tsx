import topics from "@/lib/ui-fixtures/video-topics.json";
import VocabPopover from "../vocab/VocabPopover";
import { useRef } from "react";
const s = { "data-v-97f2d612": "" };
export default function VideoFilters({
  anchor,
  level,
  selected,
  onLevel,
  onSelected,
  onClose,
}: {
  anchor: HTMLElement;
  level: string;
  selected: string[];
  onLevel: (v: string) => void;
  onSelected: (v: string[]) => void;
  onClose: () => void;
}) {
  const count = selected.length + (level ? 1 : 0);
  const allButton = useRef<HTMLButtonElement>(null);
  return (
    <VocabPopover
      anchor={anchor}
      title="Chọn chủ đề và độ khó"
      width={480}
      gap={12}
      mobileBottomInset={70}
      onClose={onClose}
    >
      <div className="space-y-3 video-filter-content" {...s}>
        <div
          className="flex items-center justify-between gap-2 border-b border-border pb-2"
          {...s}
        >
          <p className="text-2xs font-semibold uppercase leading-5 tracking-[0.08em] text-fg-muted">
            Bộ lọc
          </p>
          <button
            type="button"
            className="relative inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium disabled:cursor-not-allowed btn-ink bg-surface text-fg oc-fixed ctl-md h-10 px-4"
            disabled={!count}
            onClick={() => {
              onLevel("");
              onSelected([]);
              requestAnimationFrame(() => allButton.current?.focus());
            }}
          >
            Xoá hết bộ lọc
          </button>
        </div>
        <section className="space-y-1.5">
          <p className="text-2xs font-semibold uppercase leading-5 tracking-[0.08em] text-fg-subtle">
            Độ khó
          </p>
          <div
            role="group"
            aria-label="Lọc theo cấp độ"
            className="no-scrollbar relative inline-flex max-w-full shrink-0 items-center overflow-x-auto rounded-full border border-border bg-surface-3 p-1 seg-narrow-grid"
            style={{ "--seg-cols": 4 } as React.CSSProperties}
            data-v-7fc47ef9=""
            {...s}
          >
            {[
              ["", "Tất cả"],
              ["A", "A1–A2"],
              ["B", "B1–B2"],
              ["C", "C1–C2"],
            ].map(([value, label]) => (
              <button
                type="button"
                ref={value === "" ? allButton : undefined}
                key={value}
                aria-pressed={value === level}
                className={`relative z-[1] min-h-[40px] shrink-0 rounded-full px-4 text-sm font-semibold transition-colors max-md:px-3 ${value === level ? "bg-primary text-primary-fg shadow-sh-1" : "text-fg-muted hover:text-fg"}`}
                data-v-7fc47ef9=""
                onClick={() => onLevel(value)}
              >
                {label}
              </button>
            ))}
          </div>
        </section>
        {topics.map((g) => (
          <section key={g.title} className="space-y-1.5" {...s}>
            <p
              className="text-2xs font-semibold uppercase leading-5 tracking-[0.08em] text-fg-subtle"
              {...s}
            >
              {g.title}
            </p>
            <div className="flex flex-wrap gap-1.5" {...s}>
              {g.topics.map((t) => (
                <button
                  type="button"
                  key={t.label}
                  aria-pressed={selected.includes(t.label)}
                  className="pt-chip dis-ink lift press inline-flex min-h-10 items-center gap-1.5 rounded-full px-3 text-sm"
                  onClick={() =>
                    onSelected(
                      selected.includes(t.label)
                        ? selected.filter((x) => x !== t.label)
                        : [...selected, t.label],
                    )
                  }
                  {...s}
                >
                  <span
                    aria-hidden="true"
                    style={{ display: "contents" }}
                    dangerouslySetInnerHTML={{ __html: t.icon }}
                  />
                  <span {...s}>{t.label}</span>
                  <span className="text-xs tabular-nums text-fg-subtle" {...s}>
                    {t.count}
                  </span>
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>
    </VocabPopover>
  );
}
