"use client";
import { useId, useRef, useState, type KeyboardEvent } from "react";
import UiDialog from "../app/UiDialog";
export default function VocabCreateDialog({
  onClose,
  onNotice,
}: {
  onClose: () => void;
  onNotice: (message: string) => void;
}) {
  const [tab, setTab] = useState(0),
    [aiText, setAiText] = useState(""),
    [pasteText, setPasteText] = useState(""),
    [term, setTerm] = useState(""),
    [meaning, setMeaning] = useState(""),
    [list, setList] = useState(false),
    [imageFile, setImageFile] = useState<File | null>(null),
    [sheetFile, setSheetFile] = useState<File | null>(null),
    [error, setError] = useState(""),
    [preview, setPreview] = useState(false);
  const id = useId(),
    input = useRef<HTMLInputElement>(null),
    tabs = useRef<HTMLDivElement>(null);
  const names = ["AI soạn giúp", "Tự thêm từng từ", "Nhập từ tệp"];
  const text = tab === 0 ? aiText : pasteText;
  const file = tab === 0 ? imageFile : sheetFile;
  function setText(value: string) {
    (tab === 0 ? setAiText : setPasteText)(value);
    setError("");
    setPreview(false);
  }
  function setFile(value: File | null) {
    setError("");
    setPreview(false);
    if (
      value &&
      tab === 2 &&
      (!/\.(xlsx|csv)$/i.test(value.name) || value.size > 2 * 1024 * 1024)
    ) {
      setError("Chọn tệp .xlsx hoặc .csv, tối đa 2 MB.");
      if (input.current) input.current.value = "";
      return;
    }
    (tab === 0 ? setImageFile : setSheetFile)(value);
    if (!value && input.current) input.current.value = "";
  }

  function change(value: number) {
    setTab(value);
    setError("");
    setPreview(false);
  }
  function keyboard(e: KeyboardEvent<HTMLButtonElement>, i: number) {
    const next =
      e.key === "ArrowRight"
        ? (i + 1) % names.length
        : e.key === "ArrowLeft"
          ? (i - 1 + names.length) % names.length
          : e.key === "Home"
            ? 0
            : e.key === "End"
              ? names.length - 1
              : null;
    if (next === null) return;
    e.preventDefault();
    change(next);
    tabs.current?.querySelectorAll<HTMLButtonElement>("button")[next].focus();
  }
  function finish(message: string) {
    onClose();
    onNotice(message);
  }
  return (
    <UiDialog
      title={tab === 1 ? "Thêm từ" : tab === 2 ? "Nhập từ vựng" : "Tạo từ vựng"}
      onClose={onClose}
    >
      <div className="ui-vocab-create">
        <div
          role="tablist"
          aria-label="Cách tạo từ vựng"
          className="nbc-seg"
          ref={tabs}
        >
          {names.map((name, i) => (
            <button
              key={name}
              type="button"
              role="tab"
              id={`${id}-tab-${i}`}
              aria-controls={`${id}-panel`}
              aria-selected={tab === i}
              tabIndex={tab === i ? 0 : -1}
              className={tab === i ? "is-on" : ""}
              onClick={() => change(i)}
              onKeyDown={(e) => keyboard(e, i)}
            >
              {name}
            </button>
          ))}
        </div>
        <div
          role="tabpanel"
          id={`${id}-panel`}
          aria-labelledby={`${id}-tab-${tab}`}
        >
          {tab === 0 ? (
            <>
              <label htmlFor={`${id}-topic`}>Nội dung để AI soạn bộ từ</label>
              <textarea
                id={`${id}-topic`}
                maxLength={3000}
                placeholder="Gõ chủ đề, dán một đoạn văn, hoặc dán / thả một ảnh vào đây"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <div className="ui-vocab-form-row">
                <button
                  className="nbc-btn is-soft is-sm"
                  onClick={() => input.current?.click()}
                >
                  ＋ Thêm ảnh
                </button>
                <span>{text.length.toLocaleString("vi-VN")} / 3.000</span>
              </div>
              <input
                ref={input}
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
              {file && (
                <p>
                  {file.name}{" "}
                  <button onClick={() => setFile(null)}>Bỏ ảnh</button>
                </p>
              )}
              <div className="ui-vocab-form-row">
                {["Từ vựng du lịch", "Dán một đoạn báo", "Dán một ảnh"].map(
                  (s, i) => (
                    <button
                      className="nbc-btn is-soft is-sm"
                      key={s}
                      onClick={() =>
                        i === 0
                          ? setText(s)
                          : i === 2
                            ? input.current?.click()
                            : document.getElementById(`${id}-topic`)?.focus()
                      }
                    >
                      {s}
                    </button>
                  ),
                )}
              </div>
              <p className="ui-muted">hoặc dán ảnh bằng Ctrl+V</p>
              <label htmlFor={`${id}-level`}>Trình độ</label>
              <select id={`${id}-level`} defaultValue="auto">
                <option value="auto">Tự động</option>
                {["A1", "A2", "B1", "B2", "C1", "C2"].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
              <button
                className="nbc-btn is-ink"
                disabled={!text.trim() && !file}
                onClick={() =>
                  finish(
                    "Tính năng AI chưa được kết nối trong bản local. Chưa có bộ từ nào được tạo.",
                  )
                }
              >
                Soạn bộ từ
              </button>
            </>
          ) : tab === 1 ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!term.trim() || !meaning.trim()) {
                  setError("Điền từ vựng và nghĩa trước khi thêm.");
                  return;
                }
                finish(
                  "Đây là bản xem thử giao diện. Nội dung từ vựng chưa được lưu vào kho học.",
                );
              }}
            >
              <label htmlFor={`${id}-term`}>Từ vựng *</label>
              <div className="ui-vocab-form-row">
                <input
                  id={`${id}-term`}
                  required
                  placeholder="Nhập từ cần thêm…"
                  value={term}
                  onChange={(e) => {
                    setTerm(e.target.value);
                    setError("");
                  }}
                />
                <button
                  type="button"
                  className="nbc-btn is-soft"
                  onClick={() =>
                    setError("Tự điền chưa được kết nối trong bản local.")
                  }
                >
                  Tự điền
                </button>
              </div>
              <div className="ui-vocab-form-row">
                <label>
                  Phiên âm
                  <input name="ipa" />
                </label>
                <label>
                  Loại từ
                  <select defaultValue="">
                    <option value="">- không chọn -</option>
                    {[
                      "Danh từ",
                      "Động từ",
                      "Tính từ",
                      "Trạng từ",
                      "Giới từ",
                      "Cụm từ",
                    ].map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </label>
              </div>
              <label htmlFor={`${id}-meaning`}>Nghĩa *</label>
              <input
                id={`${id}-meaning`}
                required
                placeholder="Nghĩa tiếng Việt…"
                value={meaning}
                onChange={(e) => {
                  setMeaning(e.target.value);
                  setError("");
                }}
              />
              <label>
                Ví dụ
                <input />
              </label>
              <label>
                Bản dịch ví dụ
                <input />
              </label>
              <label>
                Danh sách đích
                <select>
                  <option>Đã lưu</option>
                </select>
              </label>
              <button
                type="button"
                className="nbc-btn is-soft is-sm"
                aria-expanded={list}
                aria-controls={`${id}-list-name`}
                onClick={() => setList(!list)}
              >
                ＋ Tạo danh sách mới
              </button>
              {list && (
                <label id={`${id}-list-name`}>
                  Tên danh sách mới
                  <input placeholder="Tên danh sách…" />
                </label>
              )}
              <div className="ui-vocab-form-row">
                <button
                  type="button"
                  className="nbc-btn is-soft"
                  onClick={onClose}
                >
                  Đóng
                </button>
                <button type="submit" className="nbc-btn is-ink">
                  Thêm từ
                </button>
              </div>
            </form>
          ) : (
            <>
              <button
                className="ui-vocab-file"
                onClick={() => input.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const f = e.dataTransfer.files[0];
                  if (f) setFile(f);
                }}
              >
                Kéo thả tệp vào đây
                <br />
                <b>Chọn tệp</b>
                <br />
                <small>.xlsx hoặc .csv, tối đa 2 MB</small>
              </button>
              <input
                ref={input}
                hidden
                type="file"
                accept=".xlsx,.csv"
                onChange={(e) => {
                  setFile(e.target.files?.[0] ?? null);
                }}
              />
              {file && (
                <p>
                  {file.name}{" "}
                  <button type="button" onClick={() => setFile(null)}>
                    Bỏ tệp
                  </button>
                </p>
              )}
              <label htmlFor={`${id}-paste`}>
                Hoặc dán từ Excel / Google Sheets
              </label>
              <textarea
                id={`${id}-paste`}
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <button
                className="nbc-btn is-ink"
                disabled={!text.trim() && !file}
                onClick={() => {
                  if (file && file.size > 2 * 1024 * 1024) {
                    setError("Tệp tối đa 2 MB.");
                    return;
                  }
                  if (file && !text.trim()) {
                    setError(
                      "Đọc tệp chưa được kết nối trong bản local. Bạn có thể dán nội dung để xem trước giao diện.",
                    );
                    return;
                  }
                  setPreview(true);
                }}
              >
                Xem trước
              </button>
              {preview && (
                <div className="ui-vocab-preview">
                  <h3>Xem trước nội dung đã dán</h3>
                  <table>
                    <thead>
                      <tr>
                        <th>Từ tiếng Anh</th>
                        <th>Nghĩa tiếng Việt</th>
                      </tr>
                    </thead>
                    <tbody>
                      {text
                        .trim()
                        .split(/\r?\n/)
                        .filter(Boolean)
                        .slice(0, 5)
                        .map((row, i) => (
                          <tr key={i}>
                            {[0, 1].map((j) => (
                              <td key={j}>{row.split("\t")[j] ?? ""}</td>
                            ))}
                          </tr>
                        ))}
                    </tbody>
                  </table>
                  <p className="ui-muted">
                    Bản xem thử chưa nhập từ vào kho học.
                  </p>
                </div>
              )}
              <h3>Thứ tự cột trong tệp</h3>
              <p>
                Tệp của bạn cần đúng thứ tự cột như bảng mẫu. Hàng 1 là tiêu đề
                và được bỏ qua.
              </p>
              <div className="ui-vocab-preview">
                <table>
                  <thead>
                    <tr>
                      {[
                        "A Bắt buộc",
                        "B Bắt buộc",
                        "C Nên có",
                        "D Nên có",
                        "E Nên có",
                        "F Nên có",
                        "G Nên có",
                      ].map((s) => (
                        <th key={s}>{s}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      {[
                        "Từ tiếng Anh*",
                        "Nghĩa tiếng Việt*",
                        "Ví dụ tiếng Anh",
                        "Ví dụ tiếng Việt",
                        "Từ loại",
                        "Định nghĩa tiếng Anh",
                        "Định nghĩa tiếng Việt",
                      ].map((s) => (
                        <td key={s}>{s}</td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="ui-muted">
                Tối đa 1.000 từ mỗi lần, tệp tối đa 2 MB. Từ cột H trở đi không
                đọc.
              </p>
            </>
          )}
        </div>
        {error && (
          <p role="alert" id={`${id}-error`} className="ui-vocab-error">
            {error}
          </p>
        )}
      </div>
    </UiDialog>
  );
}
