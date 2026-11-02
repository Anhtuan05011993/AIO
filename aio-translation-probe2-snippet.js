// PROBE 2 — ĐỌC & DỊCH: catalog + 8 topic + dò endpoint chi tiết 1 bài
// Chạy: https://aioenglish.com (đã đăng nhập) → F12 → Console → dán → Enter → chờ ~20s
// → gửi file aio-translation-probe2.json về cho ZCode.
(async () => {
  const out = {};
  const get = async (p) => {
    const r = await fetch(p, { credentials: "include" });
    const t = await r.text();
    let j = null;
    try { j = JSON.parse(t); } catch (e) {}
    console.log(r.status, p, j ? "JSON " + Math.round(t.length / 1024) + "KB" : "not-json");
    return { status: r.status, json: j, raw: j ? null : t.slice(0, 120) };
  };

  // 1. catalog tổng
  out.catalog = await get("/api/translation/catalog");

  // 2. 8 topic (slug khớp 8 chủ đề trên hub)
  const topics = ["tin-tuc", "kinh-doanh", "khoa-hoc", "doi-song", "van-hoa", "the-thao", "du-lich", "cong-nghe"];
  out.topics = {};
  for (const t of topics) {
    out.topics[t] = await get("/api/translation/topic/" + t);
    await new Promise((s) => setTimeout(s, 2500));
  }

  // 3. tìm id/slug của 1 bài từ topic đầu có dữ liệu → dò endpoint chi tiết
  function findIds(obj, acc) {
    if (!obj || typeof obj !== "object") return;
    if (Array.isArray(obj)) { obj.forEach((x) => findIds(x, acc)); return; }
    for (const [k, v] of Object.entries(obj)) {
      if ((k === "id" || k === "slug") && typeof v === "string" && v.length >= 4) acc.add(k + ":" + v);
      else findIds(v, acc);
    }
  }
  const acc = new Set();
  for (const t of topics) findIds(out.topics[t]?.json, acc);
  const idList = [...acc].slice(0, 8);
  out.idsFound = idList;
  console.log("ids/slugs tìm được:", idList);

  const firstId = (idList.find((x) => x.startsWith("id:")) || idList[0] || "").split(":")[1] || "";
  const firstSlug = (idList.find((x) => x.startsWith("slug:")) || "").split(":")[1] || "";
  out.detail = {};
  const cands = [];
  if (firstId) cands.push("/api/translation/paper/" + firstId, "/api/translation/article/" + firstId, "/api/translation/" + firstId, "/api/press/paper/" + firstId);
  if (firstSlug) cands.push("/api/translation/paper/" + firstSlug, "/api/translation/article/" + firstSlug);
  for (const p of cands) {
    out.detail[p] = await get(p);
    await new Promise((s) => setTimeout(s, 2500));
  }

  console.log("XONG — gửi file aio-translation-probe2.json cho ZCode.");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([JSON.stringify(out)], { type: "application/json" }));
  a.download = "aio-translation-probe2.json";
  a.click();
})();
