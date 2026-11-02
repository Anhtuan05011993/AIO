"use client";
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { getDemoUser, setDemoUser } from "@/lib/store/auth";
import { targetDate, targetDateLabel, targetToeic, normalizeTargetGoal } from "@/lib/ui/goalTarget";
import equivalents from "@/lib/ui-fixtures/settings-goal-equivalents.json";
import art from "@/lib/ui-fixtures/settings-target-art.json";
import "@/styles/custom/settings-target-reference.css";
import "@/styles/custom/settings-target-parity.css";
const s = { "data-v-35c605d2": "" };
const LEVELS = ["A1", "A2", "B1", "B2", "C1"];
const BANDS = [{ level: "B1", scores: ["4.0", "4.5", "5.0"] }, { level: "B2", scores: ["5.5", "6.0", "6.5"] }, { level: "C1", scores: ["7.0", "7.5", "8.0"] }, { level: "C2", scores: ["8.5", "9.0"] }];
const MARKS = [120, 225, 550, 785, 945];
type Exam = "cefr" | "ielts" | "toeic";
function Art({ kind }: { kind: keyof typeof art }) { return <span aria-hidden="true" style={{ display: "contents" }} dangerouslySetInnerHTML={{ __html: art[kind] }}/>; }
function radioKeys(event: KeyboardEvent<HTMLButtonElement>, values: string[], current: string, change: (value: string) => void) {
  if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
  const step = ["ArrowRight", "ArrowDown"].includes(event.key) ? 1 : ["ArrowLeft", "ArrowUp"].includes(event.key) ? -1 : 0;
  if (!step && event.key !== "Home" && event.key !== "End") return;
  event.preventDefault();
  const index = Math.max(0, values.indexOf(current));
  const next = event.key === "Home" ? 0 : event.key === "End" ? values.length - 1 : (index + step + values.length) % values.length;
  change(values[next]);
  event.currentTarget.closest('[role="radiogroup"]')?.querySelectorAll<HTMLButtonElement>('[role="radio"]')[next]?.focus();
}
function readDate(goal: string) {
  try { const saved = JSON.parse(localStorage.getItem("aio-ui-goal-date") || "null"); return saved?.goal === goal && typeof saved.date === "string" ? saved.date : ""; } catch { return ""; }
}
export default function TargetGoalDialog({ onClose }: { onClose: () => void }) {
  const id = useId(), dialog = useRef<HTMLDialogElement>(null), nativeDate = useRef<HTMLInputElement>(null), dateText = useRef<HTMLInputElement>(null);
  const [initial] = useState(() => { const goal = getDemoUser()?.goal || "Hoàn thành B1"; return { goal, date: readDate(goal) }; });
  const [exam, setExam] = useState<Exam>(initial.goal.startsWith("IELTS") ? "ielts" : initial.goal.startsWith("TOEIC") ? "toeic" : "cefr");
  const [goalTouched, setGoalTouched] = useState(false);
  const [cefr, setCefr] = useState(initial.goal.match(/([ABC][12])$/)?.[1] || "B1");
  const [ielts, setIelts] = useState(initial.goal.startsWith("IELTS") ? Number(initial.goal.match(/\d+(?:\.\d+)?/)?.[0] || "5.5").toFixed(1) : "5.5");
  const [toeic, setToeic] = useState(initial.goal.startsWith("TOEIC") ? initial.goal.match(/\d+/)?.[0] || "785" : "785");
  const [date, setDate] = useState(targetDateLabel(initial.date)), [notice, setNotice] = useState("");
  const [today] = useState(() => { const now = new Date(); return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`; });
  useEffect(() => { const previous = document.activeElement as HTMLElement | null; const node = dialog.current; node?.showModal(); node?.focus(); return () => { node?.close(); previous?.focus(); }; }, []);
  const score = targetToeic(toeic), checkedDate = exam === "cefr" ? { iso: "", error: "" } : targetDate(date, today);
  const nextGoal = exam === "cefr" ? `Hoàn thành ${cefr}` : exam === "ielts" ? `IELTS Band ${ielts}` : `TOEIC ${score ?? toeic}`;
  const preview = goalTouched ? nextGoal : normalizeTargetGoal(initial.goal);
  const dirty = preview !== normalizeTargetGoal(initial.goal) || checkedDate.iso !== initial.date;
  const remainingDays = checkedDate.iso ? Math.round((Date.parse(`${checkedDate.iso}T00:00:00Z`) - Date.parse(`${today}T00:00:00Z`)) / 86400000) : 0;
  const invalidScore = exam === "toeic" && score === null;
  const levelIndex = score === null ? 0 : Math.max(0, MARKS.findLastIndex(mark => score >= mark));
  const toeicLevel = LEVELS[levelIndex];
  const ieltsLevel = BANDS.find(group => group.scores.includes(ielts))?.level || "B2";
  const eq = equivalents.find(item => item.level === cefr)?.text.split("\n").slice(1) || [];
  const maxDate = new Date(Date.parse(`${today}T00:00:00Z`) + 730 * 86400000).toISOString().slice(0, 10);
  function save() {
    if (!dirty || invalidScore || checkedDate.error) return;
    const user = getDemoUser();
    if (!user) { setNotice("Đăng nhập local để lưu mục tiêu."); return; }
    try { localStorage.setItem("aio-ui-goal-date", JSON.stringify({ goal: preview, date: checkedDate.iso })); } catch { setNotice("Không thể lưu mục tiêu trên máy này. Hãy thử lại."); return; }
    setDemoUser({ ...user, goal: preview });
    if (getDemoUser()?.goal !== preview) { setNotice("Không thể lưu mục tiêu trên máy này. Hãy thử lại."); return; }
    onClose();
  }
  return <dialog ref={dialog} className="ui-target-goal nb-skin" data-ui-dlg="" data-nb-accent="xanhtroi" aria-labelledby={`${id}-title`} onCancel={event => { event.preventDefault(); onClose(); }} onClick={event => { if (event.target !== event.currentTarget) return; const r = event.currentTarget.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) onClose(); }}>
    <div className="ui-target-grabber" aria-hidden="true"/>
    <header className="ui-target-head"><div {...s} className="ptd-dh" data-nb-accent="xanhtroi"><span {...s} className="nbc-sk is-a" aria-hidden="true" style={{ "--nb-sk-size": "44px" } as React.CSSProperties}><Art kind="target"/></span><h2 {...s} className="dlg-title ptd-h" id={`${id}-title`}>Sửa mục tiêu</h2></div><button type="button" className="ui-target-close" aria-label="Đóng" onClick={onClose}><Art kind="x"/></button></header>
    <div className="ui-target-body"><div {...s} className="nb-dlg nb-pop ptd" data-nb-accent="xanhtroi" data-testid="path-target-dialog" data-exam={exam}>
      <p {...s} id={`${id}-exam`} className="ptd-q">Bạn đo mục tiêu bằng gì?</p>
      <div {...s} className="nbc-seg ptd-seg" role="radiogroup" aria-labelledby={`${id}-exam`}>{(["cefr", "ielts", "toeic"] as const).map(mode => <button key={mode} {...s} type="button" role="radio" data-exam={mode} data-testid="goal-exam" className={mode === exam ? "is-on" : ""} aria-checked={mode === exam} tabIndex={mode === exam ? 0 : -1} onClick={() => {setExam(mode);setGoalTouched(true);}} onKeyDown={event => radioKeys(event, ["cefr", "ielts", "toeic"], mode, value => {setExam(value as Exam);setGoalTouched(true);})}>{mode === "cefr" ? "Trình độ CEFR" : mode.toUpperCase()}</button>)}</div>
      <div {...s} className="ptd-stack">
        <section {...s} className={`ptd-pane${exam === "cefr" ? " is-on" : ""}`} aria-hidden={exam !== "cefr"} inert={exam !== "cefr"} data-pane="cefr"><p {...s} id={`${id}-cefr`} className="ptd-q">Trình độ muốn hoàn thành</p><div {...s} className="nbc-seg ptd-seg" role="radiogroup" aria-labelledby={`${id}-cefr`}>{LEVELS.map(level => <button key={level} {...s} type="button" role="radio" data-testid="goal-cefr" data-v={level} className={cefr === level ? "is-on" : ""} aria-checked={cefr === level} tabIndex={cefr === level || !LEVELS.includes(cefr) && level === LEVELS[0] ? 0 : -1} onClick={() => {setCefr(level);setGoalTouched(true);}} onKeyDown={event => radioKeys(event, LEVELS, level, value=>{setCefr(value);setGoalTouched(true);})}>{level}</button>)}</div><p {...s} className="ptd-same" data-testid="goal-cefr-equiv"><span {...s} className="ptd-same-k">Tương đương</span>{eq.map(text => <span key={text} {...s} className="nbc-chip is-sm">{text}</span>)}</p></section>
        <section {...s} className={`ptd-pane${exam === "ielts" ? " is-on" : ""}`} aria-hidden={exam !== "ielts"} inert={exam !== "ielts"} data-pane="ielts"><p {...s} id={`${id}-ielts`} className="ptd-q">Band IELTS muốn đạt</p><div {...s} className="ptd-bands" role="radiogroup" aria-labelledby={`${id}-ielts`}>{BANDS.map(group => <div key={group.level} {...s} className={`ptd-band is-${group.level.toLowerCase()}`}><span {...s} className="ptd-lvb" aria-hidden="true">{group.level}</span>{group.scores.map(band => <button key={band} {...s} type="button" role="radio" data-testid="goal-ielts" data-v={band} className={`nbc-pill ptd-sc${band === ielts ? " is-on" : ""}`} aria-checked={band === ielts} aria-label={`${band}, khoảng ${group.level}`} tabIndex={band === ielts || !BANDS.some(row=>row.scores.includes(ielts)) && band === "4.0" ? 0 : -1} onClick={() => {setIelts(band);setGoalTouched(true);}} onKeyDown={event => radioKeys(event, BANDS.flatMap(row => row.scores), band, value=>{setIelts(value);setGoalTouched(true);})}>{band}</button>)}</div>)}</div></section>
        <section {...s} className={`ptd-pane${exam === "toeic" ? " is-on" : ""}`} aria-hidden={exam !== "toeic"} inert={exam !== "toeic"} data-pane="toeic"><div {...s} className="nbc-fld"><label {...s} className="ptd-q" htmlFor={`${id}-toeic`}>Tổng điểm Listening + Reading <small {...s} className="ptd-small">(10 đến 990)</small></label><div {...s} className="ptd-toeic-row"><div {...s} className="nbc-inp ptd-toeic"><input {...s} id={`${id}-toeic`} inputMode="numeric" autoComplete="off" spellCheck={false} aria-label="Tổng điểm TOEIC muốn đạt" aria-invalid={invalidScore || undefined} data-testid="goal-toeic" value={toeic} onChange={event => {setToeic(event.target.value);setGoalTouched(true);}}/></div><div {...s} className="ptd-ticks" role="group" aria-label="Mốc tròn theo chặng">{MARKS.map((mark, index) => <button key={mark} {...s} type="button" className={`nbc-pill ptd-tick${String(mark) === toeic ? " is-on" : ""}`} aria-pressed={String(mark) === toeic} data-testid="goal-toeic-mark" onClick={() => {setToeic(String(mark));setGoalTouched(true);}}>{mark}<small {...s}>{LEVELS[index]}</small></button>)}</div></div></div></section>
      </div>
      <p {...s} className={`nbc-eta ptd-eq${invalidScore ? " is-err" : ""}`} data-testid="goal-equiv" aria-live="polite"><Art kind="map"/><span {...s}>{invalidScore ? "Nhập tổng điểm TOEIC từ 10 đến 990." : exam === "cefr" ? <>Mục tiêu <b {...s}>{preview}</b>, đúng chặng {cefr} của Lộ trình</> : exam === "ielts" ? <>IELTS {ielts} tương đương khoảng {ieltsLevel} trên Lộ trình học</> : <>{score !== null && score < 120 ? `TOEIC ${score} chưa tới mức A1 (từ 120)` : `TOEIC ${score} tương đương khoảng ${toeicLevel} (từ ${MARKS[levelIndex]})`}</>}</span></p>
      <div {...s} className="nbc-fld ptd-date"><label {...s} className="nbc-lb" htmlFor={exam === "cefr" ? undefined : `${id}-date`}>Ngày thi <small {...s}>(tuỳ chọn)</small></label>{exam === "cefr" ? <p {...s} className="ptd-note" data-testid="goal-date-note">Chỉ IELTS và TOEIC có ngày thi.</p> : <div {...s} className="ptd-drow"><div {...s} className="nbc-inp"><input {...s} ref={dateText} id={`${id}-date`} inputMode="numeric" autoComplete="off" spellCheck={false} placeholder="ngày/tháng/năm" aria-describedby={`${id}-date-error`} aria-invalid={!!checkedDate.error || undefined} data-testid="goal-date" value={date} onChange={event => setDate(event.target.value)}/><button {...s} type="button" className="nbc-eye" aria-label="Chọn ngày trên lịch" data-testid="goal-date-cal" onClick={() => { try { if(typeof nativeDate.current?.showPicker === "function") nativeDate.current.showPicker(); else dateText.current?.focus(); } catch { dateText.current?.focus(); } }}><Art kind="calendar"/></button><input {...s} ref={nativeDate} type="date" className="ptd-native" tabIndex={-1} aria-hidden="true" min={today} max={maxDate} value={checkedDate.iso} onChange={event => setDate(targetDateLabel(event.target.value))}/></div><button {...s} type="button" className={`nbc-btn is-soft is-sm${date ? "" : " is-gone"}`} tabIndex={date ? 0 : -1} aria-hidden={!date} aria-label="Bỏ ngày thi" data-testid="goal-date-clear" onClick={() => {setDate("");dateText.current?.focus();}}><Art kind="x"/><span {...s} className="ptd-clr-t">Bỏ ngày thi</span></button></div>}<p {...s} id={`${id}-date-error`} className="nbc-ferr ptd-err" data-testid="goal-date-err" aria-live="polite">{checkedDate.error}</p></div>
      <div {...s} className="ptd-prev"><div {...s} className="ptd-prev-p"><small {...s}>Hồ sơ hiện</small><span {...s} className="nbc-chip is-st is-sm" data-testid="goal-prev-profile"><Art kind="target"/>{preview}</span></div><div {...s} className="ptd-prev-p"><small {...s}>Trang chủ hiện</small>{checkedDate.iso ? <span {...s} className="nbc-chip is-st is-sm" data-testid="goal-prev-home"><Art kind="target"/>Thi {exam.toUpperCase()} {targetDateLabel(checkedDate.iso).slice(0,5)} · còn {remainingDays} ngày</span> : <span {...s} className="ptd-none" data-testid="goal-prev-home-none">Không đếm ngược</span>}</div></div>
      {notice && <p {...s} role="status" className="nbc-ferr">{notice}</p>}
      <div {...s} className="ptd-acts nbc-dash-top"><button {...s} type="button" className="nbc-btn is-soft" data-testid="path-target-cancel" onClick={onClose}>Huỷ</button><button {...s} type="button" className="nbc-btn is-ink" data-testid="path-target-save" disabled={!dirty || invalidScore || !!checkedDate.error} onClick={save}><Art kind="check"/>Lưu mục tiêu</button></div>
    </div></div><span {...s} className="nbc-tape is-cor ptd-tape" aria-hidden="true" style={{ "--nb-tape-c": "var(--nb-paper-xanhtroi-under)" } as React.CSSProperties}/>
  </dialog>;
}
