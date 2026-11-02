/**
 * Linh vật (critter) của từng tính năng — SVG inline lấy NGUYÊN VĂN từ markup SSR
 * của aioenglish.com (trang chủ, khối tính năng, component data-critter).
 * Chỉ đổi thuộc tính sang cú pháp JSX (strokeWidth, strokeLinecap, strokeLinejoin).
 * CSS: src/styles/source/FeatureCritter.css (.fc-wrap / .fc-peek), biến --feat-* trong entry.css.
 */
import type { ReactElement } from "react";

export function GoCauCritter(): ReactElement {
  return (
    <svg width="150" height="148" viewBox="0 0 150 148" aria-hidden="true" style={{ overflow: "visible" }}><g><path d="M18 174 C 18 128 44 112 75 112 C 106 112 132 128 132 174 Z" fill="#c9cef7" stroke="#201f1b" strokeWidth="3" strokeLinejoin="round"></path><path d="M18 174 C 18 142 28 124 42 118 C 45 140 41 160 37 174 Z" fill="#2b2f5e" stroke="#201f1b" strokeWidth="3" strokeLinejoin="round"></path><path d="M132 174 C 132 142 122 124 108 118 C 105 140 109 160 113 174 Z" fill="#2b2f5e" stroke="#201f1b" strokeWidth="3" strokeLinejoin="round"></path><path d="M58 38 C 56 16 78 4 95 14 C 86 17 84 26 90 34 C 80 30 68 31 58 38 Z" fill="#ef7a5d" stroke="#201f1b" strokeWidth="3" strokeLinejoin="round"></path><circle cx="75" cy="76" r="44" fill="#fbf8f1"></circle><path d="M31.4 70 A 44 44 0 0 1 118.6 70 C 100 60 50 60 31.4 70 Z" fill="#2b2f5e"></path><circle cx="75" cy="76" r="44" fill="none" stroke="#201f1b" strokeWidth="3"></circle><g className="blink"><ellipse cx="58" cy="86" rx="7" ry="8.5" fill="#201f1b"></ellipse><circle cx="60.6" cy="82.5" r="2.6" fill="#ffffff"></circle><ellipse cx="90" cy="86" rx="7" ry="8.5" fill="#201f1b"></ellipse><circle cx="92.6" cy="82.5" r="2.6" fill="#ffffff"></circle></g><ellipse cx="46" cy="100" rx="8" ry="5" fill="#f7a8a0"></ellipse><ellipse cx="99" cy="103" rx="7" ry="4.5" fill="#f7a8a0"></ellipse><path d="M108 84 L 142 90 L 108 97 Z" fill="#eeb030" stroke="#201f1b" strokeWidth="3" strokeLinejoin="round"></path></g></svg>
  );
}

export function TuVungCritter(): ReactElement {
  return (
    <svg width="150" height="148" viewBox="0 0 150 148" aria-hidden="true" style={{ overflow: "visible" }}><g><path d="M18 174 C 18 128 44 112 75 112 C 106 112 132 128 132 174 Z" fill="#d98a4e" stroke="#201f1b" strokeWidth="3" strokeLinejoin="round"></path><path d="M40 60 C 34 42 36 24 46 18 C 54 26 62 40 62 54 Z" fill="#d98a4e" stroke="#201f1b" strokeWidth="3" strokeLinejoin="round"></path><path d="M45 52 C 42 42 44 32 48 29 C 52 35 56 43 56 49 Z" fill="#f6c79e"></path><path d="M110 60 C 116 42 114 24 104 18 C 96 26 88 40 88 54 Z" fill="#d98a4e" stroke="#201f1b" strokeWidth="3" strokeLinejoin="round"></path><path d="M105 52 C 108 42 106 32 102 29 C 98 35 94 43 94 49 Z" fill="#f6c79e"></path><ellipse cx="75" cy="82" rx="45" ry="40" fill="#de9458" stroke="#201f1b" strokeWidth="3"></ellipse><ellipse cx="75" cy="97" rx="19" ry="12" fill="#fbe6cb"></ellipse><ellipse cx="75" cy="91" rx="5" ry="3.6" fill="#201f1b"></ellipse><path d="M69 99 q3 4 6 0 q3 4 6 0" fill="none" stroke="#201f1b" strokeWidth="2.5" strokeLinecap="round"></path><g className="blink"><ellipse cx="57" cy="80" rx="7" ry="8.5" fill="#201f1b"></ellipse><circle cx="59.6" cy="76.5" r="2.6" fill="#ffffff"></circle><ellipse cx="93" cy="80" rx="7" ry="8.5" fill="#201f1b"></ellipse><circle cx="95.6" cy="76.5" r="2.6" fill="#ffffff"></circle></g><ellipse cx="42" cy="96" rx="8" ry="5" fill="#f7a8a0"></ellipse><ellipse cx="108" cy="96" rx="8" ry="5" fill="#f7a8a0"></ellipse></g></svg>
  );
}

export function NguPhapCritter(): ReactElement {
  return (
    <svg width="150" height="148" viewBox="0 0 150 148" aria-hidden="true" style={{ overflow: "visible" }}><g><path d="M18 174 C 18 128 44 112 75 112 C 106 112 132 128 132 174 Z" fill="#c98b5e" stroke="#201f1b" strokeWidth="3" strokeLinejoin="round"></path><circle cx="36" cy="58" r="10" fill="#d49a6a" stroke="#201f1b" strokeWidth="3"></circle><circle cx="114" cy="58" r="10" fill="#d49a6a" stroke="#201f1b" strokeWidth="3"></circle><ellipse cx="75" cy="84" rx="47" ry="42" fill="#d49a6a" stroke="#201f1b" strokeWidth="3"></ellipse><path d="M40 58 C 40 24 110 24 110 58 Z" fill="#eeb030" stroke="#201f1b" strokeWidth="3" strokeLinejoin="round"></path><rect x="30" y="54" width="90" height="9" rx="4.5" fill="#eeb030" stroke="#201f1b" strokeWidth="3"></rect><path d="M75 30 L 75 52" stroke="#c98a12" strokeWidth="4" strokeLinecap="round"></path><g className="blink"><ellipse cx="56" cy="84" rx="7" ry="8.5" fill="#201f1b"></ellipse><circle cx="58.6" cy="80.5" r="2.6" fill="#ffffff"></circle><ellipse cx="94" cy="84" rx="7" ry="8.5" fill="#201f1b"></ellipse><circle cx="96.6" cy="80.5" r="2.6" fill="#ffffff"></circle></g><ellipse cx="75" cy="101" rx="22" ry="14" fill="#f1d6b8"></ellipse><ellipse cx="75" cy="94" rx="8" ry="5" fill="#201f1b"></ellipse><rect x="68.5" y="104" width="13" height="13" rx="2.5" fill="#ffffff" stroke="#201f1b" strokeWidth="2.5"></rect><path d="M75 104 L 75 117" stroke="#201f1b" strokeWidth="2"></path><ellipse cx="40" cy="102" rx="8" ry="5" fill="#f7a8a0"></ellipse><ellipse cx="110" cy="102" rx="8" ry="5" fill="#f7a8a0"></ellipse></g></svg>
  );
}

export function DocDichCritter(): ReactElement {
  return (
    <svg width="150" height="148" viewBox="0 0 150 148" aria-hidden="true" style={{ overflow: "visible" }}><g><path d="M18 174 C 18 128 44 112 75 112 C 106 112 132 128 132 174 Z" fill="#9fdcc4" stroke="#201f1b" strokeWidth="3" strokeLinejoin="round"></path><path d="M56 52 C 64 22 98 16 114 40 C 100 36 84 38 76 50 Z" fill="#7cc7ad" stroke="#201f1b" strokeWidth="3" strokeLinejoin="round"></path><path d="M28 98 C 28 64 52 42 80 42 C 110 42 126 64 124 90 C 122 112 100 124 76 124 C 50 124 28 116 28 98 Z" fill="#b5e8d2" stroke="#201f1b" strokeWidth="3" strokeLinejoin="round"></path><circle cx="56" cy="84" r="17" fill="#d4f3e5" stroke="#201f1b" strokeWidth="3"></circle><circle cx="98" cy="80" r="17" fill="#d4f3e5" stroke="#201f1b" strokeWidth="3"></circle><g className="blink"><ellipse cx="57" cy="85" rx="7" ry="8.5" fill="#201f1b"></ellipse><circle cx="59.6" cy="81.5" r="2.6" fill="#ffffff"></circle><ellipse cx="99" cy="81" rx="7" ry="8.5" fill="#201f1b"></ellipse><circle cx="101.6" cy="77.5" r="2.6" fill="#ffffff"></circle></g><path d="M54 106 Q 78 120 104 102" fill="none" stroke="#201f1b" strokeWidth="3" strokeLinecap="round"></path><circle cx="113" cy="104" r="5" fill="#ffd66b"></circle><circle cx="38" cy="106" r="4.5" fill="#f28a6a"></circle><circle cx="86" cy="54" r="4" fill="#b9a3ec"></circle></g></svg>
  );
}

export function VideoCritter(): ReactElement {
  return (
    <svg width="150" height="148" viewBox="0 0 150 148" aria-hidden="true" style={{ overflow: "visible" }}><g><path d="M18 174 C 18 128 44 112 75 112 C 106 112 132 128 132 174 Z" fill="#f0a24a" stroke="#201f1b" strokeWidth="3" strokeLinejoin="round"></path><path d="M64 38 C 58 18 68 6 80 8 C 75 16 78 24 86 30 C 78 30 70 32 64 38 Z" fill="#f7c85a" stroke="#201f1b" strokeWidth="3" strokeLinejoin="round"></path><path d="M78 34 C 80 20 92 12 102 16 C 94 20 92 28 94 36 Z" fill="#ffe08a" stroke="#201f1b" strokeWidth="3" strokeLinejoin="round"></path><circle cx="75" cy="78" r="44" fill="#f7c05a" stroke="#201f1b" strokeWidth="3"></circle><ellipse cx="75" cy="86" rx="31" ry="26" fill="#fff3d6"></ellipse><g className="blink"><ellipse cx="58" cy="80" rx="7" ry="8.5" fill="#201f1b"></ellipse><circle cx="60.6" cy="76.5" r="2.6" fill="#ffffff"></circle><ellipse cx="92" cy="80" rx="7" ry="8.5" fill="#201f1b"></ellipse><circle cx="94.6" cy="76.5" r="2.6" fill="#ffffff"></circle></g><path d="M64 90 C 64 79 86 79 86 90 C 86 99 80 106 73 109 C 76 101 73 95 64 94 Z" fill="#3d3a47" stroke="#201f1b" strokeWidth="2.5" strokeLinejoin="round"></path><ellipse cx="41" cy="94" rx="8" ry="5" fill="#f28a6a"></ellipse><ellipse cx="109" cy="94" rx="8" ry="5" fill="#f28a6a"></ellipse></g></svg>
  );
}

export function TuDienCritter(): ReactElement {
  return (
    <svg width="150" height="148" viewBox="0 0 150 148" aria-hidden="true" style={{ overflow: "visible" }}><g><path d="M18 174 C 18 128 44 112 75 112 C 106 112 132 128 132 174 Z" fill="#a9bccf" stroke="#201f1b" strokeWidth="3" strokeLinejoin="round"></path><ellipse cx="28" cy="82" rx="24" ry="30" fill="#a9bccf" stroke="#201f1b" strokeWidth="3"></ellipse><ellipse cx="28" cy="82" rx="13" ry="18" fill="#f6c3c8"></ellipse><ellipse cx="122" cy="82" rx="24" ry="30" fill="#a9bccf" stroke="#201f1b" strokeWidth="3"></ellipse><ellipse cx="122" cy="82" rx="13" ry="18" fill="#f6c3c8"></ellipse><ellipse cx="75" cy="78" rx="42" ry="40" fill="#b8c9da" stroke="#201f1b" strokeWidth="3"></ellipse><path d="M70 40 q3 -8 5 0 q3 -8 5 0" fill="none" stroke="#201f1b" strokeWidth="2.5" strokeLinecap="round"></path><path d="M66 94 C 64 112 74 124 92 122 C 106 120 112 108 106 100 C 101 95 95 99 97 104 C 98 110 88 113 84 108 C 80 104 82 98 84 94 Z" fill="#b8c9da" stroke="#201f1b" strokeWidth="3" strokeLinejoin="round"></path><g className="blink"><ellipse cx="58" cy="76" rx="7" ry="8.5" fill="#201f1b"></ellipse><circle cx="60.6" cy="72.5" r="2.6" fill="#ffffff"></circle><ellipse cx="92" cy="76" rx="7" ry="8.5" fill="#201f1b"></ellipse><circle cx="94.6" cy="72.5" r="2.6" fill="#ffffff"></circle></g><ellipse cx="47" cy="92" rx="8" ry="5" fill="#f6b3b8"></ellipse><ellipse cx="103" cy="90" rx="7" ry="4.5" fill="#f6b3b8"></ellipse></g></svg>
  );
}

export function LoTrinhCritter(): ReactElement {
  return (
    <svg width="150" height="148" viewBox="0 0 150 148" aria-hidden="true" style={{ overflow: "visible" }}><g><path d="M55 100 L 55 124 L 95 124 L 95 100 Z" fill="#c6e8b0" stroke="#201f1b" strokeWidth="3" strokeLinejoin="round"></path><path d="M6 176 C 6 124 38 108 75 108 C 112 108 144 124 144 176 Z" fill="#c7b3f2" stroke="#201f1b" strokeWidth="3" strokeLinejoin="round"></path><path d="M40 176 L 48 142 L 75 130 L 102 142 L 110 176 M48 142 L 22 134 M102 142 L 128 134 M75 130 L 75 110" stroke="#9a7fe0" strokeWidth="3" fill="none" strokeLinejoin="round"></path><path d="M122 132 L 122 96" stroke="#201f1b" strokeWidth="3" strokeLinecap="round"></path><path d="M122 96 L 142 103 L 122 110 Z" fill="#eeb030" stroke="#201f1b" strokeWidth="2.5" strokeLinejoin="round"></path><ellipse cx="75" cy="74" rx="40" ry="36" fill="#c6e8b0" stroke="#201f1b" strokeWidth="3"></ellipse><g className="blink"><ellipse cx="60" cy="74" rx="7" ry="8.5" fill="#201f1b"></ellipse><circle cx="62.6" cy="70.5" r="2.6" fill="#ffffff"></circle><ellipse cx="90" cy="74" rx="7" ry="8.5" fill="#201f1b"></ellipse><circle cx="92.6" cy="70.5" r="2.6" fill="#ffffff"></circle></g><path d="M69 88 q3 4 6 0 q3 4 6 0" fill="none" stroke="#201f1b" strokeWidth="2.5" strokeLinecap="round"></path><ellipse cx="47" cy="87" rx="7" ry="4.5" fill="#f7a8a0"></ellipse><ellipse cx="103" cy="87" rx="7" ry="4.5" fill="#f7a8a0"></ellipse></g></svg>
  );
}

export const critters: Record<string, () => ReactElement> = {
  "go-cau": GoCauCritter,
  "tu-vung": TuVungCritter,
  "ngu-phap": NguPhapCritter,
  "doc-dich": DocDichCritter,
  "video": VideoCritter,
  "tu-dien": TuDienCritter,
  "lo-trinh": LoTrinhCritter,
};
