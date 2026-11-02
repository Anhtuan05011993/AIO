"use client";
import art from "@/lib/ui-fixtures/settings-accent-art.json";
import { speak } from "../lesson/speech";
import "@/styles/custom/settings-accent-reference.css";
const s = { "data-v-e138966a": "" };
export default function SettingsAccent({ value, onChange }: { value: "uk" | "us"; onChange: (value: "uk" | "us") => void }) {
  return <div {...s} className="ap-wrap"><div {...s} role="radiogroup" aria-label="Giọng tiếng Anh" className="apc-grid" data-testid="accent-picker">
    {(["uk", "us"] as const).map(accent => <div key={accent} {...s} className="relative">
      <button {...s} type="button" role="radio" data-testid="accent-option" data-accent={accent} aria-checked={value === accent} tabIndex={value === accent ? 0 : -1} className={`${value === accent ? "is-on " : ""}nbc-opt is-soft apc-card`} onClick={() => onChange(accent)} onKeyDown={event => {
        if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
        if (!["ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) return;
        event.preventDefault();
        const next = event.key === "Home" ? "uk" : event.key === "End" ? "us" : accent === "uk" ? "us" : "uk";
        onChange(next);
        event.currentTarget.closest('[role="radiogroup"]')?.querySelector<HTMLButtonElement>(`[data-accent="${next}"]`)?.focus();
      }}>
        <span {...s} className="nbc-rd" aria-hidden="true"/><span {...s} className="ap-text"><span {...s} className="apc-l"><b {...s}>{accent === "uk" ? "Anh-Anh" : "Anh-Mỹ"}</b><small {...s}>{accent === "uk" ? "Mặc định" : "Giọng Mỹ"}</small></span><span {...s} className="apc-ipa"><span {...s} lang="en">tomato</span><span {...s} className="font-ipa ipa-tone ap-ipa" data-ipa=""><span className="ipa-slash">/</span>{accent === "uk" ? "təˈmɑːtəʊ" : "təˈmeɪtoʊ"}<span className="ipa-slash">/</span></span></span></span>
        <span aria-hidden="true" style={{ display: "contents" }} dangerouslySetInnerHTML={{ __html: art[accent] }}/>
      </button>
      <button {...s} type="button" className="nbc-eye ap-play" aria-label={`Nghe giọng ${accent === "uk" ? "Anh-Anh" : "Anh-Mỹ"}`} data-testid="accent-play" onClick={() => speak("tomato", accent === "uk" ? "en-GB" : "en-US")}><span aria-hidden="true" style={{ display: "contents" }} dangerouslySetInnerHTML={{ __html: art.speaker }}/></button>
    </div>)}
  </div></div>;
}
