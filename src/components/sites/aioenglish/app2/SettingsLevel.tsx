"use client";
import { useState } from "react";
import "@/styles/custom/settings-level-reference.css";

const s = { "data-v-5ae40bb1": "" };
const IELTS = ["Mới bắt đầu (≤2.5)", "IELTS 3.0–3.5", "IELTS 4.0–5.0", "IELTS 5.5–6.5", "IELTS 7.0–8.0", "IELTS 8.5–9.0"];
const TOEIC = ["Mới bắt đầu (≤220)", "TOEIC 225–549", "TOEIC 550–784", "TOEIC 785–944", "TOEIC 945–990"];
const CEFR = ["A1", "A2", "B1", "B2", "C1"];
const CEFR_LABELS = ["Người mới - gần như chưa biết gì", "Biết một số từ & câu đơn giản", "Đã có thể giao tiếp, trò chuyện cơ bản", "Khá tự tin, hiểu nội dung phức tạp hơn", "Thành thạo, trôi chảy và linh hoạt"];
// Display metadata already used by onboarding; no course content or new store fields.
export default function SettingsLevel({ level, onChange }: { level: string; onChange: (level: string) => void }) {
  const [view, setView] = useState<string | null>(null);
  const canonical = level.replaceAll("-", "–");
  const exam = view ?? (TOEIC.includes(canonical) || level.startsWith("TOEIC") ? "TOEIC" : IELTS.includes(canonical) || level.startsWith("IELTS") ? "IELTS" : "Chưa rõ / Chỉ muốn học");
  const bands = exam === "TOEIC" ? TOEIC : exam === "IELTS" ? IELTS : CEFR;
  const selected = bands.includes(canonical) ? canonical : "";
  return <div {...s} className="lvc" data-testid="level-survey">
    <p {...s} className="lvc-l" id="settings-cert-label">Chứng chỉ</p>
    <div {...s} className="nbc-pills lvc-certs" role="group" aria-labelledby="settings-cert-label">
      {["IELTS", "TOEIC", "Chưa rõ / Chỉ muốn học"].map(cert => <button key={cert} {...s} type="button" className={`nbc-pill${exam === cert ? " is-on" : ""}`} aria-pressed={exam === cert} onClick={() => setView(cert)}>{cert}</button>)}
    </div>
    <div {...s} className="lv-open-wrap"><div {...s} className="lv-open-inner">
      <p {...s} className="lvc-l lvc-l2" id="settings-current-level-label">Trình độ hiện tại</p>
      <div {...s} className="lvc-rows" role="group" aria-labelledby="settings-current-level-label">
        {bands.map((band, index) => <button key={band} {...s} type="button" className={`lv-row nbc-opt${selected === band ? " is-on" : ""}`} aria-pressed={selected === band} style={{ "--i": index } as React.CSSProperties} onClick={() => { onChange(band); setView(null); }}><span {...s} className="nbc-rd" aria-hidden="true"/><span {...s} className="nbc-nw">{exam === "Chưa rõ / Chỉ muốn học" ? CEFR_LABELS[index] : band}</span>{exam === "Chưa rõ / Chỉ muốn học" && <span {...s} aria-hidden="true" className={`nbc-tag is-a${selected === band ? " is-cur lvc-mk" : ""}`}>{band}</span>}</button>)}
      </div>
    </div></div>
  </div>;
}
