"use client";
import { SettingsArt } from "./SettingsMisc";
const s = { "data-v-45fbf440": "" };
type Option = { value: string; label: string; icon?: "light" | "dark" | "system" | "sotay" | "neo" };
function Segment({ label, value, options, change, attribute }: { label: string; value: string; options: Option[]; change: (value: string) => void; attribute?: string }) {
  return <div {...s} className="nbc-seg is-full" role="group" aria-label={label}>{options.map((option, index) => <button key={option.value} {...s} {...(attribute ? { [attribute]: option.value } : {})} type="button" className={value === option.value ? "is-on" : ""} aria-pressed={value === option.value} tabIndex={index === Math.max(0, options.findIndex(item => item.value === value)) ? 0 : -1} onClick={() => change(option.value)} onKeyDown={event => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    const step = ["ArrowRight", "ArrowDown"].includes(event.key) ? 1 : ["ArrowLeft", "ArrowUp"].includes(event.key) ? -1 : 0;
    if (!step && event.key !== "Home" && event.key !== "End") return;
    event.preventDefault();
    const next = event.key === "Home" ? 0 : event.key === "End" ? options.length - 1 : (index + step + options.length) % options.length;
    change(options[next].value);
    event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>("button")[next]?.focus();
  }}>{option.icon && <SettingsArt kind={option.icon}/>} {option.label}</button>)}</div>;
}
export default function SettingsAppearance({ theme, skin, motion, sound, onTheme, onSkin, onMotion, onSound }: {
  theme: string; skin: string; motion: string; sound: boolean;
  onTheme: (value: string) => void; onSkin: (value: string) => void; onMotion: (value: string) => void; onSound: (value: boolean) => void;
}) {
  return <>
    <div {...s} className="cd-row"><b {...s} className="cd-row-l">Chế độ</b><Segment label="Chế độ giao diện" value={theme} change={onTheme} attribute="data-theme-opt" options={[{ value: "light", label: "Sáng", icon: "light" }, { value: "dark", label: "Tối", icon: "dark" }, { value: "system", label: "Hệ thống", icon: "system" }]}/></div>
    <div {...s} className="cd-row" data-testid="settings-skin"><b {...s} className="cd-row-l">Kiểu giao diện</b><Segment label="Kiểu giao diện" value={skin} change={onSkin} attribute="data-skin-opt" options={[{ value: "sotay", label: "Tươi mới", icon: "sotay" }, { value: "neo", label: "Cổ điển", icon: "neo" }]}/></div>
    <div {...s} className="cd-row"><b {...s} className="cd-row-l">Chuyển động</b><Segment label="Chuyển động" value={motion} change={onMotion} options={[{ value: "system", label: "Theo hệ thống" }, { value: "Đầy đủ", label: "Đầy đủ" }, { value: "Giảm", label: "Giảm" }]}/></div>
    <div {...s} className="cd-row" data-testid="settings-key-sound"><span {...s} className="cd-row-l"><b {...s}>Âm gõ phím</b><small {...s}>Âm đúng/sai vẫn phát.</small></span><Segment label="Âm thanh gõ phím" value={sound ? "on" : "off"} change={v => onSound(v === "on")} attribute="data-key-sound-opt" options={[{ value: "on", label: "Bật" }, { value: "off", label: "Tắt" }]}/></div>
  </>;
}
