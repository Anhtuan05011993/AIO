// smoke-final.js — smoke test sau tích hợp cuối (31/10/2026 đợt 4 mục).
const BASE = "http://localhost:3000";
const pages = [
  "/", "/tong-quan", "/go-cau", "/go-cau/lo-trinh-b1",
  "/go-cau/lo-trinh-b1/crs_d88d5ac22b47dda563",
  "/tu-vung", "/tu-vung/toeic-600", "/tu-vung/toeic-600/hoc", "/tu-vung/oxford-3000-b1/hoc-sau",
  "/video", "/video/chao-buoi-sang-do-an",
  "/ngu-phap", "/ngu-phap/a1-to-be", "/tu-dien", "/lo-trinh", "/lo-trinh/kiem-tra",
  "/luyen-dich-thuat", "/luyen-dich-thuat/doc-tin-tuc-1", "/luyen-thi",
  "/ban-be", "/cai-dat", "/chao-mung", "/auth/login", "/auth/register", "/auth/forgot",
  "/phap-ly", "/phap-ly/dieu-khoan", "/phap-ly/quyen-rieng-tu",
  "/profile", "/@demo", "/~offline", "/manifest.webmanifest",
];
const apis = [
  ["GET", "/api/xep-hang"], ["GET", "/api/bang-tin"], ["GET", "/api/progress"],
  ["POST", "/api/tts", { text: "Hello world", voice: "en-US-GuyNeural" }],
  ["GET", "/api/video/transcript?id=kqtD5dpn9C8"],
];
(async () => {
  let fail = 0;
  for (const r of pages) {
    try {
      const res = await fetch(BASE + r);
      if (res.status !== 200) { fail++; console.log("FAIL", res.status, r); }
    } catch (e) { fail++; console.log("ERR", r, String(e.cause?.code || e.message)); }
  }
  console.log(`pages: ${pages.length - fail}/${pages.length} OK (200)`);
  let aFail = 0;
  for (const [m, r, body] of apis) {
    try {
      const res = await fetch(BASE + r, m === "POST" ? {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
      } : undefined);
      const len = m === "POST" ? (await res.arrayBuffer()).byteLength : 0;
      const extra = m === "POST" ? ` bytes=${len}` : "";
      const ok = res.status === 200 && (m !== "POST" || len > 1000);
      if (!ok) { aFail++; console.log("API FAIL", res.status, r, extra); }
      else console.log("API OK", res.status, r, extra);
    } catch (e) { aFail++; console.log("API ERR", r, String(e.cause?.code || e.message)); }
  }
  console.log(`apis: ${apis.length - aFail}/${apis.length} OK`);
  process.exit(fail + aFail > 0 ? 1 : 0);
})();
