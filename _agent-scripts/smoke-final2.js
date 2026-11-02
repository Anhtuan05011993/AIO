// smoke-final2.js — smoke sau đợt luyện nói + ngữ pháp 167 node + dịch VI.
const BASE = "http://localhost:3000";
const pages = [
  "/", "/tong-quan", "/go-cau/lo-trinh-b1/crs_d88d5ac22b47dda563",
  "/tu-vung/toeic-600/hoc-sau", "/video/chao-buoi-sang-do-an",
  "/tu-dien", "/lo-trinh/kiem-tra", "/luyen-dich-thuat/doc-tin-tuc-1",
  "/profile", "/~offline",
  // ngữ pháp: hub + 4 cấp mới + 1 node cũ
  "/ngu-phap", "/ngu-phap/a2-past-simple", "/ngu-phap/b2-passive-perfect",
  "/ngu-phap/c1-modality-possibility", "/ngu-phap/c2-adjective-order", "/ngu-phap/b1-present-perfect",
];
(async () => {
  await new Promise((r) => setTimeout(r, 9000)); // chờ dev up
  let fail = 0;
  for (const r of pages) {
    try {
      const res = await fetch(BASE + r);
      if (res.status !== 200) { fail++; console.log("FAIL", res.status, r); }
    } catch (e) { fail++; console.log("ERR", r, String(e.cause?.code || e.message)); }
  }
  console.log(`pages: ${pages.length - fail}/${pages.length} OK`);
  // translate API
  try {
    const res = await fetch(BASE + "/api/translate", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ texts: ["The rain stopped before noon."] }),
    });
    const j = await res.json();
    console.log("api/translate:", res.status, JSON.stringify(j.translations));
  } catch (e) { fail++; console.log("ERR api/translate", String(e.cause?.code || e.message)); }
  process.exit(fail > 0 ? 1 : 0);
})();
