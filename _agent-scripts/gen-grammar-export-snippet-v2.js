// gen-grammar-export-snippet-v2.js — sinh aio-grammar-export-snippet-v2.js
// Cải tiến so v1: (1) cache từng node vào localStorage ngay khi fetch xong;
// (2) tự tải file từng phần mỗi 20 node mới; (3) nghỉ 3 node liên tiếp toàn
// 429 → DỪNG SỚM + tải phần đã có (không chạy vô ích 3 giờ);
// (4) chạy lại sẽ TỰ BỎ QUA node đã có (resume) — đổi VPN/chờ rồi chạy tiếp.
const fs = require("fs");
const path = require("path");
const ROOT = path.resolve(__dirname, "..");
const cat = JSON.parse(fs.readFileSync(path.join(ROOT, "docs/research/aioenglish/data/api-ngu-phap-catalog.json"), "utf8"));
const ids = cat.nodes.map((n) => n.id);
if (ids.length < 160) throw new Error("catalog nodes thiếu: " + ids.length);

const snippet = `// TRÍCH NODE NGỮ PHÁP — v2 CHỐNG MẤT DỮ LIỆU (${ids.length} node, endpoint /api/ngu-phap/nodes/{id})
// Chạy: https://aioenglish.com (đã đăng nhập) → F12 → Console → dán → Enter.
//  - Mỗi node fetched xong là lưu vào localStorage ngay (mất mạng/429 cũng không mất phần đã lấy).
//  - Tự tải file aio-grammar-nodes-partN.json mỗi 20 node mới (Chrome hỏi "cho tải nhiều file" → Allow).
//  - 3 node liên tiếp toàn 429 → DỪNG SỚM + tải phần đã có. Đổi server VPN / chờ 15-30 phút rồi
//    dán lại đúng snippet này — nó TỰ BỎ QUA node đã có và chạy tiếp phần còn lại.
//  - Cuối phiên (xong hoặc dừng sớm) luôn tải aio-grammar-nodes.json = toàn bộ dữ liệu hiện có.
(async () => {
  const IDS = ${JSON.stringify(ids)};
  const KEY = (id) => "aio-gn:" + id;
  const store = (id, obj) => { try { localStorage.setItem(KEY(id), JSON.stringify(obj)); } catch (e) {} };
  const load = (id) => { try { const s = localStorage.getItem(KEY(id)); return s ? JSON.parse(s) : null; } catch (e) { return null; } };
  const download = (name, obj) => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([JSON.stringify(obj)], { type: "application/json" }));
    a.download = name;
    a.click();
  };
  const cached = IDS.filter((id) => load(id) && !load(id)._error);
  console.log("BẮT ĐẦU v2 — cache có sẵn: " + cached.length + "/" + IDS.length + " node (sẽ bỏ qua). Còn cần fetch: " + (IDS.length - cached.length));
  let fresh = 0, consecutiveFail = 0, stoppedEarly = false;
  const partBucket = {};
  const flushPart = () => {
    const n = Object.keys(partBucket).length;
    if (!n) return;
    download("aio-grammar-nodes-part" + Math.ceil(fresh / 20) + ".json", partBucket);
    console.log("Đã tải phần lẻ: aio-grammar-nodes-part" + Math.ceil(fresh / 20) + ".json (" + n + " node)");
  };
  for (let i = 0; i < IDS.length; i++) {
    const id = IDS[i];
    if (load(id) && !load(id)._error) continue;
    let done = false;
    let nodeOk = false;
    for (let attempt = 0; attempt < 3 && !done; attempt++) {
      try {
        const r = await fetch("/api/ngu-phap/nodes/" + id, { credentials: "include" });
        const t = await r.text();
        if (r.status === 429) {
          console.warn("[" + (i + 1) + "/" + IDS.length + "] 429 — chờ 30s, thử lại lần " + (attempt + 1) + ":", id);
          await new Promise((s) => setTimeout(s, 30000));
          continue;
        }
        if (r.ok && t.trim().startsWith("{")) {
          const j = JSON.parse(t);
          store(id, j);
          partBucket[id] = j;
          fresh++;
          nodeOk = true;
          console.log("[" + (i + 1) + "/" + IDS.length + "] OK", id);
        } else {
          console.warn("[" + (i + 1) + "/" + IDS.length + "] LỖI HTTP " + r.status, id);
          store(id, { _error: "HTTP " + r.status });
        }
        done = true;
      } catch (e) {
        console.warn("[" + (i + 1) + "/" + IDS.length + "] LỖI mạng:", id, String(e));
        done = true;
      }
    }
    consecutiveFail = nodeOk ? 0 : consecutiveFail + 1;
    if (fresh > 0 && fresh % 20 === 0) flushPart();
    if (consecutiveFail >= 3) {
      console.warn("DỪNG SỚM: 3 node liên tiếp thất bại — khả năng bị block IP. Phần đã lấy sẽ được tải ngay.");
      stoppedEarly = true;
      break;
    }
    await new Promise((s) => setTimeout(s, 10000));
  }
  flushPart();
  const all = {};
  let nOk = 0;
  for (const id of IDS) { const v = load(id); if (v && !v._error) { all[id] = v; nOk++; } }
  download("aio-grammar-nodes.json", all);
  console.log((stoppedEarly ? "DỪNG SỚM" : "XONG") + " — tổng node thật trong cache: " + nOk + "/" + IDS.length +
    ". File aio-grammar-nodes.json đã tải về. " +
    (nOk < IDS.length ? "Đổi server VPN hoặc chờ 15-30 phút rồi dán lại snippet này để lấy phần còn thiếu." : "Gửi file lại cho ZCode."));
})();`;

fs.writeFileSync(path.join(ROOT, "aio-grammar-export-snippet-v2.js"), snippet);
console.log("Đã sinh aio-grammar-export-snippet-v2.js với", ids.length, "node id");
