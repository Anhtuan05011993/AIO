"use client";
import { useState } from "react";
import art from "@/lib/ui-fixtures/vocab-personal-art.json";
import help from "@/lib/ui-fixtures/vocab-help.json";
import UiDialog from "../app/UiDialog";
import VocabPopover from "./VocabPopover";
import VocabLibraryToolbar, { VocabIcon } from "./VocabLibraryToolbar";
const s = { "data-v-91d4bd9d": "" },
  lib = { "data-v-66a7447b": "" };
export default function VocabPersonal({
  onCreate,
  onBrowse,
}: {
  onCreate: () => void;
  onBrowse: () => void;
}) {
  const [popover, setPopover] = useState<{
    kind: "bank" | "level";
    anchor: HTMLElement;
  } | null>(null);
  const [listNotice, setListNotice] = useState<string | null>(null);
  const [termOrder, setTermOrder] = useState<-1 | 0 | 1>(0);
  const [levelOrder, setLevelOrder] = useState<-1 | 0 | 1>(1);
  const [groups, setGroups] = useState([true, true, true]);
  const [levels, setLevels] = useState<number[]>([]);
  const [bank, setBank] = useState(true),
    [search, setSearch] = useState(false),
    [query, setQuery] = useState(""),
    [dialog, setDialog] = useState<string | null>(null),
    [lists, setLists] = useState<string[]>([]),
    [level, setLevel] = useState("Tất cả");
  return (
    <div
      className="ui-vocab-personal nbc-lv1 nbc-blk vhm"
      data-v-eb0c0c9c=""
      role="region"
      aria-label="Từ vựng của tôi"
    >
      <section
        className="mvo"
        aria-label="Tổng quan từ vựng của tôi"
        data-v-3a982818=""
        {...lib}
      >
        <div className="ovb" {...s}>
          <div className="ovb-ov" {...s}>
            <section
              className="nbc-lv1 is-kraft ovb-stg ovb-today"
              aria-labelledby="ovb-h-today"
              {...s}
            >
              <div className="ovb-sh" {...s}>
                <h2 className="ovb-nm" id="ovb-h-today" {...s}>
                  <span
                    className="ui-vocab-art"
                    aria-hidden="true"
                    dangerouslySetInnerHTML={{ __html: art.today }}
                  />
                  Hôm nay cần ôn
                </h2>
                <p className="ovb-big" {...s}>
                  <b {...s} className="nbc-num is-off">
                    0
                  </b>
                  <span {...s}>từ</span>
                </p>
              </div>
              <div className="ovb-acts" {...s}>
                <button className="nbc-btn is-ink is-sm ovb-go" disabled {...s}>
                  <span
                    className="ui-vocab-art"
                    aria-hidden="true"
                    dangerouslySetInnerHTML={{ __html: art.reviewIcons[0] }}
                  />
                  Chưa có từ để ôn
                </button>
                <button className="nbc-btn is-soft is-sm" disabled>
                  <span
                    className="ui-vocab-art"
                    aria-hidden="true"
                    dangerouslySetInnerHTML={{ __html: art.reviewIcons[1] }}
                  />
                  Ôn từ vừa nạp
                </button>
              </div>
              <div className="nbc-lv2 ovb-qr" {...s}>
                <div className="ui-vocab-quick-empty">
                  <span
                    aria-hidden="true"
                    dangerouslySetInnerHTML={{ __html: art.empty }}
                  />
                  <p>Chưa có từ nào đến hạn</p>
                </div>
              </div>
            </section>
            <section
              className="nbc-lv1 ovb-stg ovb-s1"
              aria-labelledby="ovb-h-store"
              {...s}
            >
              <div className="ovb-sh" {...s}>
                <h2 className="ovb-nm" id="ovb-h-store" {...s}>
                  Bộ từ của bản thân
                  <button
                    className="ovb-q"
                    aria-label="Bộ từ của bản thân là gì?"
                    onClick={() => setDialog("Bộ từ của bản thân")}
                    {...s}
                  >
                    ?
                  </button>
                </h2>
                <button
                  className="ovb-tot is-btn"
                  aria-label="0 Tổng từ đã thêm - xem danh sách"
                  onClick={() => setBank(false)}
                  {...s}
                >
                  <b {...s} className="nbc-hl">
                    0
                  </b>
                  <span {...s}>từ</span>
                </button>
              </div>
              <div className="ovb-store" {...s}>
                <span className="ovb-ring" {...s}>
                  <span
                    className="ui-vocab-art"
                    aria-hidden="true"
                    dangerouslySetInnerHTML={{ __html: art.ring }}
                  />
                  <b {...s} className="ovb-ring-c" {...s}>
                    0%<small {...s}>đã thuộc</small>
                  </b>
                </span>
                <div className="ovb-tiles" {...s}>
                  {["Chưa thuộc", "Đã thuộc"].map((text, i) => (
                    <button
                      key={text}
                      className={`nbc-lv3 ovb-tile ${i ? "is-ok" : "is-w"}`}
                      aria-label={`0 Từ ${text.toLowerCase()} - xem danh sách`}
                      onClick={() => {
                        setBank(false);
                        setLevel(text);
                      }}
                      {...s}
                    >
                      <b {...s} className="nbc-num">
                        0
                      </b>
                      <span {...s}>{text}</span>
                    </button>
                  ))}
                </div>
              </div>
              <button
                className="nbc-btn is-act is-sm ovb-practice"
                onClick={onCreate}
                {...s}
              >
                ＋ Tạo từ vựng
              </button>
            </section>
            <span
              className={art.links[0].cls}
              aria-hidden="true"
              {...s}
              dangerouslySetInnerHTML={{ __html: art.links[0].html }}
            />
            <section
              className="nbc-lv1 is-s-kraft ovb-stg ovb-s2"
              aria-labelledby="ovb-h-bank"
              {...s}
            >
              <div className="ovb-sh" {...s}>
                <h2 className="ovb-nm" id="ovb-h-bank" {...s}>
                  Kho từ vựng lặp lại ngắt quãng
                  <button
                    className="ovb-q"
                    aria-label="Kho từ vựng lặp lại ngắt quãng là gì?"
                    onClick={() => setDialog("Kho từ vựng lặp lại ngắt quãng")}
                    {...s}
                  >
                    ?
                  </button>
                </h2>
                <span className="ovb-tot" {...s}>
                  <b {...s} className="nbc-hl">
                    0
                  </b>
                  <span {...s}>từ</span>
                </span>
              </div>
              <ol className="ovb-stairs" aria-label="Số từ theo cấp nhớ" {...s}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <li key={n} className="ovb-st" {...s}>
                    <b {...s} className="ovb-st-n is-zero" {...s}>
                      {n === 5 && (
                        <span
                          className="ui-vocab-art"
                          aria-hidden="true"
                          dangerouslySetInnerHTML={{ __html: art.flag }}
                        />
                      )}
                      0
                    </b>
                    <span className="ovb-step" {...s}>
                      Cấp {n}
                    </span>
                  </li>
                ))}
              </ol>
            </section>
            <span
              className={art.links[1].cls}
              aria-hidden="true"
              {...s}
              dangerouslySetInnerHTML={{ __html: art.links[1].html }}
            />
          </div>
        </div>
      </section>
      <section
        className="nbc-lv1 nbc-blk is-grid20 mwl-lib"
        aria-label="Thư viện từ vựng"
        {...lib}
      >
        <div className="mwl-anchor" aria-hidden="true" {...lib} />
        <VocabLibraryToolbar
          filterOpen={popover?.kind === "bank"}
          bank={bank}
          search={search}
          query={query}
          onBank={setBank}
          onFilter={(anchor) => setPopover({ kind: "bank", anchor })}
          onCreateList={(name) => {
            setLists([...lists, name]);
            setListNotice(
              `Đã tạo danh sách “${name}” trong phiên xem thử local.`,
            );
          }}
          onCreate={onCreate}
          onSearch={setSearch}
          onQuery={setQuery}
        />
        {listNotice && (
          <p role="status" className="ui-muted">
            {listNotice}
          </p>
        )}
        <div className="lt min-w-0" data-v-05767118="">
          <div
            className="ui-vocab-library-table ui-vocab-reference-table lt-card overflow-clip"
            data-v-05767118=""
          >
            <table
              className="lt-table w-full table-auto text-left"
              data-v-05767118=""
            >
              <thead className="lt-head" data-v-05767118="">
                <tr>
                  <th
                    data-v-05767118=""
                    className="w-[14%] px-4 py-2.5 xl:w-[17%]"
                  >
                    <button
                      type="button"
                      className="lt-sort inline-flex min-h-10 items-center gap-1 whitespace-nowrap uppercase"
                      data-v-05767118=""
                      onClick={() => {
                        setTermOrder(termOrder === 1 ? -1 : 1);
                        setLevelOrder(0);
                      }}
                    >
                      Từ vựng{" "}
                      <VocabIcon
                        kind={termOrder === 0 ? "sort" : "chevron"}
                        size={13}
                        style={{ rotate: termOrder === 1 ? "180deg" : "0deg" }}
                      />
                    </button>
                  </th>
                  <th
                    data-v-05767118=""
                    className="w-[11%] px-4 py-2.5 xl:w-[16%]"
                  >
                    Nghĩa
                  </th>
                  <th data-v-05767118="" className="px-4 py-2.5">
                    Ví dụ
                  </th>
                  <th
                    data-v-05767118=""
                    className="px-2 py-2.5 w-px whitespace-nowrap"
                  >
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        className="lt-sort inline-flex min-h-10 items-center gap-1 uppercase"
                        data-v-05767118=""
                        onClick={() => {
                          setLevelOrder(levelOrder === 1 ? -1 : 1);
                          setTermOrder(0);
                        }}
                      >
                        Cấp độ{" "}
                        <VocabIcon
                          kind="chevron"
                          size={13}
                          style={{
                            rotate: levelOrder === 1 ? "180deg" : "0deg",
                          }}
                        />
                      </button>
                      <button
                        type="button"
                        className="lt-lvf relative grid h-8 w-8 place-items-center"
                        data-v-05767118=""
                        aria-label="Lọc theo cấp độ"
                        aria-expanded={popover?.kind === "level"}
                        onClick={(e) =>
                          setPopover({ kind: "level", anchor: e.currentTarget })
                        }
                      >
                        <VocabIcon kind="filter" size={14} />
                      </button>
                    </div>
                  </th>
                  <th
                    data-v-05767118=""
                    className="px-2 py-2.5 w-px whitespace-nowrap"
                  >
                    Nguồn học
                  </th>
                  <th
                    data-v-05767118=""
                    className="w-40 px-1 py-2.5 text-right xl:w-48 xl:px-2"
                  >
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody />
            </table>
          </div>
          <div className="ui-vocab-library-empty">
            <span
              className="ta-tile is-scene ui-vocab-empty-art"
              aria-hidden="true"
              dangerouslySetInnerHTML={{ __html: art.libraryEmpty }}
            />
            <h3>
              {query
                ? "Không tìm thấy từ phù hợp"
                : bank
                  ? "Kho từ vựng lặp lại ngắt quãng còn trống"
                  : "Bộ từ của bản thân còn trống"}
            </h3>
            <p>
              Học từ mới ở Bộ từ vựng đề xuất, hoặc học thuộc từ trong Bộ từ của
              bản thân.
            </p>
            <div className="ui-vocab-form-row">
              <button
                className="nbc-btn is-soft"
                onClick={() => setBank(false)}
              >
                Bộ từ của bản thân
              </button>
              <button className="nbc-btn is-act" onClick={onBrowse}>
                Bộ từ vựng đề xuất
              </button>
            </div>
            {level !== "Tất cả" && (
              <button
                className="nbc-btn is-soft is-sm"
                onClick={() => setLevel("Tất cả")}
              >
                Bỏ lọc: {level} ×
              </button>
            )}
          </div>
        </div>
      </section>
      {popover && (
        <VocabPopover
          key={popover.kind}
          anchor={popover.anchor}
          title={
            popover.kind === "bank"
              ? "Kho từ vựng lặp lại ngắt quãng"
              : "Lọc theo cấp độ"
          }
          width={popover.kind === "bank" ? 320 : 224}
          onClose={() => setPopover(null)}
        >
          {popover.kind === "bank" ? (
            <>
              <p className="bank-pop-h" data-v-5f4a1792="">
                Kho từ vựng lặp lại ngắt quãng
              </p>
              <p className="llf-hint" data-v-08e54c6d="">
                Đang hiển thị {groups.filter(Boolean).length} / 3 nhóm
              </p>
              <div role="group" aria-label="Chọn nhóm từ muốn xem">
                {["Học từ bộ từ vựng", "Học qua gõ câu", "Đã lưu"].map(
                  (name, i) => (
                    <div className="llf-li" key={name} data-v-08e54c6d="">
                      <label className="llf-row min-h-10" data-v-08e54c6d="">
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={groups[i]}
                          onChange={() =>
                            setGroups(groups.map((v, n) => (n === i ? !v : v)))
                          }
                        />
                        <span
                          className={`llf-box${groups[i] ? " is-on" : ""}`}
                          aria-hidden="true"
                          data-v-08e54c6d=""
                        >
                          {groups[i] && (
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M20 6 9 17l-5-5" />
                            </svg>
                          )}
                        </span>
                        <span className="llf-name" data-v-08e54c6d="">
                          {name}
                        </span>
                        <span className="llf-n" data-v-08e54c6d="">
                          0
                        </span>
                      </label>
                    </div>
                  ),
                )}
              </div>
              <div className="llf-foot" data-v-08e54c6d="">
                <button
                  className="nb-btn nb-btn-soft nb-btn-sm"
                  disabled={groups.every(Boolean)}
                  onClick={() => setGroups([true, true, true])}
                >
                  Hiện tất cả
                </button>
                <button
                  className="nb-btn nb-btn-ink nb-btn-sm"
                  onClick={() => setPopover(null)}
                >
                  Xong
                </button>
              </div>
            </>
          ) : (
            <>
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  type="button"
                  key={n}
                  className="lt-lvo flex min-h-10 w-full items-center gap-2 text-left normal-case tracking-normal"
                  aria-pressed={levels.includes(n)}
                  data-v-05767118=""
                  onClick={() =>
                    setLevels(
                      levels.includes(n)
                        ? levels.filter((x) => x !== n)
                        : [...levels, n],
                    )
                  }
                >
                  <span
                    aria-hidden="true"
                    className={`lt-ck-box is-sm${levels.includes(n) ? " is-on" : ""}`}
                    data-v-05767118=""
                  >
                    {levels.includes(n) && "✓"}
                  </span>
                  Cấp {n}
                </button>
              ))}
            </>
          )}
        </VocabPopover>
      )}
      {dialog && (
        <UiDialog title={dialog} onClose={() => setDialog(null)}>
          <div
            className="ui-vocab-help-body"
            dangerouslySetInnerHTML={{
              __html: dialog === "Bộ từ của bản thân" ? help.store : help.bank,
            }}
          />
          <div className="flex justify-end mt-4">
            <button
              className="nb-btn nb-btn-ink nb-btn-sm"
              onClick={() => setDialog(null)}
            >
              Đã hiểu
            </button>
          </div>
        </UiDialog>
      )}
    </div>
  );
}
