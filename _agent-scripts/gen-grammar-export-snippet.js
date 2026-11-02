// gen-grammar-export-snippet.js — sinh aio-grammar-export-snippet.js với
// danh sách 167 node id nhúng sẵn (từ catalog nguồn) + fetch /api/ngu-phap/nodes/{id}
// delay 10s, retry khi 429. Node portable path an toàn.
const fs = require("fs");
const path = require("path");
const ROOT = path.resolve(__dirname, "..");
const cat = JSON.parse(fs.readFileSync(path.join(ROOT, "docs/research/aioenglish/data/api-ngu-phap-catalog.json"), "utf8"));
const ids = cat.nodes.map((n) => n.id);
if (ids.length < 160) throw new Error("catalog nodes thiếu: " + ids.length);

const snippet = `// TRÍCH NỘI DUNG NODE NGỮ PHÁP THẬT — ${ids.length} node × /api/ngu-phap/nodes/{id}
// Cách chạy: mở https://aioenglish.com (đã đăng nhập) → F12 → Console → dán toàn bộ → Enter.
// (Nếu Chrome yêu cầu "allow pasting" → gõ allow pasting rồi Enter, dán lại.)
// Log in TỪNG node ngay khi xong — mỗi node cách 10 giây, tổng ~${Math.ceil((ids.length * 10) / 60)} phút.
(async () => {
  const IDS = ${JSON.stringify(ids)};
  console.log("BẮT ĐẦU trích " + IDS.length + " node — log sẽ hiện từng node, đừng chuyển tab.");
  const out = {};
  let ok = 0, fail = [];
  for (let i = 0; i < IDS.length; i++) {
    const id = IDS[i];
    let done = false;
    for (let attempt = 0; attempt < 3 && !done; attempt++) {
      try {
        const r = await fetch("/api/ngu-phap/nodes/" + id, { credentials: "include" });
        const t = await r.text();
        if (r.status === 429) {
          console.warn("[" + (i + 1) + "/" + IDS.length + "] 429 — chờ 30s rồi thử lại:", id);
          await new Promise((s) => setTimeout(s, 30000));
          continue;
        }
        if (r.ok && t.trim().startsWith("{")) {
          out[id] = JSON.parse(t);
          ok++;
          console.log("[" + (i + 1) + "/" + IDS.length + "] OK", id);
        } else {
          out[id] = { _error: "HTTP " + r.status, _snippet: t.slice(0, 120) };
          fail.push(id);
          console.warn("[" + (i + 1) + "/" + IDS.length + "] LỖI", id, "HTTP", r.status);
        }
        done = true;
      } catch (e) {
        out[id] = { _error: String(e) };
        fail.push(id);
        console.warn("[" + (i + 1) + "/" + IDS.length + "] LỖI mạng", id, String(e));
        done = true;
      }
    }
    await new Promise((s) => setTimeout(s, 10000));
  }
  console.log("XONG — ok:", ok, "lỗi:", fail.length, fail.slice(0, 10));
  const blob = new Blob([JSON.stringify(out)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "aio-grammar-nodes.json";
  a.click();
  console.log("File aio-grammar-nodes.json đã tải về — gửi lại cho ZCode.");
})();`;

fs.writeFileSync(path.join(ROOT, "aio-grammar-export-snippet.js"), snippet);
console.log("Đã sinh aio-grammar-export-snippet.js với", ids.length, "node id");
