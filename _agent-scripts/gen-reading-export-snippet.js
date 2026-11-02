// gen-reading-export-snippet.js — sinh aio-reading-export-snippet.js:
// trích 266 bài "Đọc & dịch" thật từ aioenglish.com qua engine tung-cau:
//   GET  /api/translation/tung-cau/{exerciseId}            → bài + câu VI
//   POST /api/translation/tung-cau/{id}/reveal {key}       → câu EN (reference)
// Đặc điểm: pacing thích ứng (bắt đầu 1.3s, gặp 429 tăng ×2 tới 15s, rồi hạ dần),
// resume theo localStorage từng BÀI, part file mỗi 10 bài, dừng sớm 6 bài fail liên tiếp.
const fs = require("fs");
const path = require("path");
const ROOT = path.resolve(__dirname, "..");
const probe = JSON.parse(fs.readFileSync(path.join(ROOT, "aio-translation-probe3.json"), "utf8"));
const ids = [];
for (const [, v] of Object.entries(probe.topics)) {
  for (const it of v.json?.items ?? []) {
    ids.push({ id: it.exerciseId, topic: it.topics?.[0] ?? "", title: it.title ?? "" });
  }
}
if (ids.length < 260) throw new Error("ids thiếu: " + ids.length);
// Delay giữa các call (ms) — truyền arg để đổi: node gen-reading-export-snippet.js 30000
const BASE_DELAY = Number(process.argv[2] || 1300);
// SKIP-LIST: gộp mọi aio-reading-articles*.json ở root (các bài ĐÃ trích ở các
// phiên trước) — nhúng vào snippet để chạy ở browser KHÁC cũng bỏ qua đúng.
const doneSet = new Set();
for (const f of fs.readdirSync(ROOT).filter((x) => /^aio-reading-articles.*\.json$/.test(x)).sort()) {
  const data = JSON.parse(fs.readFileSync(path.join(ROOT, f), "utf8"));
  for (const [k, v] of Object.entries(data)) {
    if (!v._error && v.sentences?.length) doneSet.add(k);
  }
}
const remaining = ids.filter((x) => !doneSet.has(x.id));
const hoursEst = ((remaining.length * 13 * BASE_DELAY) / 3600000).toFixed(1);
console.log(`Đã trích: ${doneSet.size} bài (skip-list) | cần trích: ${remaining.length} | delay: ${BASE_DELAY}ms | ước tính ~${hoursEst}h`);
if (remaining.length === 0) { console.log("Đủ 266 — không cần snippet."); process.exit(0); }

const snippet = `// TRÍCH BÀI ĐỌC & DỊCH THẬT — CÒN ${remaining.length}/${ids.length} BÀI (đã có ${doneSet.size} bài lưu file, skip-list nhúng sẵn)
// Chạy: https://aioenglish.com (đã đăng nhập) → F12 → Console → dán → Enter.
//  - Mỗi bài: 1 GET + ~10 reveal (lấy câu EN). Delay cố định ${BASE_DELAY}ms/call.
//  - RESUME 2 LỚP: localStorage của chính tab này + skip-list ${doneSet.size} bài đã trích các phiên trước (nhúng cứng).
//  - Lưu localStorage NGAY khi xong 1 bài; CHỈ tải file khi gặp 429 hoặc khi hoàn tất
//    (aio-reading-articles.json luôn chứa mọi bài đã có trong localStorage).
//  - Chạy lại TỰ RESUME (bỏ qua bài đã có). Ước tính tổng ~${hoursEst} giờ — chạy nhiều phiên, đóng tab thì mở lại dán tiếp.
(async () => {
  const IDS = ${JSON.stringify(remaining)};
  const KEY = (id) => "aio-tr:" + id;
  const store = (id, obj) => { try { localStorage.setItem(KEY(id), JSON.stringify(obj)); } catch (e) {} };
  const load = (id) => { try { const s = localStorage.getItem(KEY(id)); return s ? JSON.parse(s) : null; } catch (e) { return null; } };
  const download = (name, obj) => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([JSON.stringify(obj)], { type: "application/json" }));
    a.download = name;
    a.click();
  };
  const delay = ${BASE_DELAY}; // ms — cố định mỗi call
  let doneCount = 0, failStreak = 0, stoppedEarly = false, blocked = false;
  const sleep = (ms) => new Promise((s) => setTimeout(s, ms));

  const cached = IDS.filter((x) => load(x.id) && !load(x.id)._error).length;
  console.log("BẮT ĐẦU — cache có sẵn: " + cached + "/" + IDS.length + " bài. Còn cần trích: " + (IDS.length - cached));

  for (let i = 0; i < IDS.length; i++) {
    const meta = IDS[i];
    if (load(meta.id) && !load(meta.id)._error) continue;
    let article = null;
    let hardFail = false;

    // 1. GET bài (câu VI + tiêu đề)
    for (let att = 0; att < 3 && !article; att++) {
      const r = await fetch("/api/translation/tung-cau/" + meta.id, { credentials: "include" });
      const t = await r.text();
      if (r.status === 429) { console.warn("429 GET — IP có khả năng bị BLOCK. DỪNG NGAY để bảo toàn dữ liệu (đổi VPN rồi dán lại để resume)."); blocked = true; break; }
      if (r.ok && t.trim().startsWith("{")) { article = JSON.parse(t); }
      else { hardFail = true; break; }
      await sleep(delay);
    }
    if (blocked) break;
    if (!article) {
      console.warn("[" + (i + 1) + "/" + IDS.length + "] LỖI GET", meta.id);
      store(meta.id, { _error: "get-failed" });
      failStreak++;
      if (failStreak >= 6) { stoppedEarly = true; break; }
      continue;
    }

    // 2. reveal từng câu → EN
    const sentences = [];
    let senFail = 0;
    for (const sen of article.sentences || []) {
      let got = null;
      for (let att = 0; att < 4 && !got; att++) {
        const r = await fetch("/api/translation/tung-cau/" + meta.id + "/reveal", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ key: sen.key }),
        });
        const t = await r.text();
        if (r.status === 429) { console.warn("429 reveal — IP có khả năng bị BLOCK. DỪNG NGAY."); blocked = true; break; }
        if (r.ok && t.trim().startsWith("{")) {
          const j = JSON.parse(t);
          got = { key: sen.key, en: j.reveal?.reference ?? "", vi: sen.vi ?? j.reveal?.vi ?? "", noteVi: j.reveal?.noteVi ?? null, paragraph: sen.paragraph ?? 0 };
        } else { await sleep(delay); }
      }
      if (blocked) break;
      if (got) sentences.push(got); else senFail++;
      await sleep(delay);
    }
    if (blocked) break;
    if (senFail === 0) {
      store(meta.id, { exerciseId: meta.id, title: article.title, titleVi: article.titleVi, level: article.level, topic: article.topic, sentences });
      doneCount++;
      failStreak = 0;
      console.log("[" + (i + 1) + "/" + IDS.length + "] OK", meta.id, "(" + sentences.length + " câu, delay " + Math.round(delay) + "ms)");
    } else {
      console.warn("[" + (i + 1) + "/" + IDS.length + "] THIẾU " + senFail + " câu:", meta.id, "— sẽ chạy lại ở phiên sau");
      failStreak++;
    }
    if (failStreak >= 6) { console.warn("DỪNG SỚM: 6 bài liên tiếp thất bại (không phải 429). Dữ liệu vẫn trong localStorage — dán lại để tiếp tục."); stoppedEarly = true; break; }
  }
  const all = {};
  let nOk = 0;
  for (const x of IDS) { const v = load(x.id); if (v && !v._error) { all[x.id] = v; nOk++; } }
  download("aio-reading-articles.json", all);
  const reason = blocked ? "DỪNG VÌ 429 (IP bị block — đổi server VPN rồi dán lại snippet, tự resume)"
    : stoppedEarly ? "DỪNG SỚM (6 bài liên tiếp thất bại)"
    : "XONG TOÀN BỘ PHẦN CÒN LẠI";
  console.log(reason + " — bài trích được phiên này: " + nOk + "/" + IDS.length +
    ". File aio-reading-articles.json chứa TẤT CẢ bài trong localStorage — gửi cho ZCode để gộp + sinh skip-list mới.");
})();`;

fs.writeFileSync(path.join(ROOT, "aio-reading-export-snippet.js"), snippet);
console.log("Đã sinh aio-reading-export-snippet.js");
