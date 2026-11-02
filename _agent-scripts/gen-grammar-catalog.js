/**
 * gen-grammar-catalog.js — regenerate mảng `nodes` trong
 * src/lib/demo-data/nguPhapCatalog.ts từ catalog nguồn đầy đủ
 * docs/research/aioenglish/data/api-ngu-phap-catalog.json (167 node, A1→C2).
 *
 * - `groups`, `topics`, `curriculum` GIỮ NGUYÊN như file TS hiện tại.
 * - Chỉ thay: (1) comment đầu file, (2) mảng nodes bên trong object literal.
 * - Format node giống JSON.stringify(nodes, null, 2) + thụt thêm 2 space.
 *
 * Chạy: node _agent-scripts/gen-grammar-catalog.js
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const SRC_JSON = path.join(ROOT, "docs/research/aioenglish/data/api-ngu-phap-catalog.json");
const SRC_TS = path.join(ROOT, "src/lib/demo-data/nguPhapCatalog.ts");

const catalog = JSON.parse(fs.readFileSync(SRC_JSON, "utf8"));
const nodes = catalog.nodes;
if (!Array.isArray(nodes) || nodes.length !== 167) {
  throw new Error(`Nguồn JSON phải có 167 node, hiện: ${nodes.length}`);
}
// Đảm bảo thứ tự theo `order` và không trùng id.
const sorted = [...nodes].sort((a, b) => a.order - b.order);
if (nodes.some((n, i) => n !== sorted[i])) {
  throw new Error("Nguồn JSON chưa sắp theo `order` — sắp lại trước khi sinh.");
}
const ids = new Set(nodes.map((n) => n.id));
if (ids.size !== nodes.length) throw new Error("Trùng id trong nguồn JSON.");
const byLevel = {};
for (const n of nodes) byLevel[n.level] = (byLevel[n.level] || 0) + 1;

let ts = fs.readFileSync(SRC_TS, "utf8");

// --- (1) Thay comment đầu file (từ /** đến */ đầu tiên) ---
const HEAD_END = ts.indexOf("*/");
if (HEAD_END < 0) throw new Error("Không tìm thấy comment đầu file.");
const levelLine = Object.keys(byLevel)
  .map((l) => `${l}:${byLevel[l]}`)
  .join(", ");
const newHead = `/**
 * Dữ liệu demo "Ngữ pháp" — catalog ngữ pháp A1→C2 của aioenglish.com.
 *
 * Nguồn: GET /api/ngu-phap/catalog (đã extract vào
 * docs/research/aioenglish/data/api-ngu-phap-catalog.json) — dùng NGUYÊN VI,
 * đủ 167 node (${levelLine}), 14 nhóm chủ đề → 51 topic, mỗi node có số bài
 * tập theo 4 chế độ: transform / fix / gap / choice; kèm curriculum lộ trình
 * 6 cấp độ (A1→C2, stage thường và stage "+").
 *
 * Hai bản đồ alias chuyển hướng của API (nodeAliases, topicAliases —
 * redirect id cũ → id mới) không đưa vào dữ liệu demo; interface vẫn khai
 * báo optional để đúng shape API.
 */`;
ts = newHead + ts.slice(HEAD_END + 2);

// --- (2) Thay mảng nodes trong object literal ---
const marker = '"nodes": [';
const start = ts.indexOf(marker);
const end = ts.indexOf('"topics": [');
if (start < 0 || end < 0 || start > end) {
  throw new Error("Không tách được khối nodes trong file TS.");
}
const nodesJson = JSON.stringify(nodes, null, 2)
  .split("\n")
  .map((line, i) => (i === 0 ? line : "  " + line))
  .join("\n");
ts = ts.slice(0, start) + '"nodes": ' + nodesJson + ",\n  " + ts.slice(end);

fs.writeFileSync(SRC_TS, ts, "utf8");

// --- Báo cáo + sanity: parse lại khối nodes vừa ghi ---
const written = fs.readFileSync(SRC_TS, "utf8");
const s2 = written.indexOf('"nodes": [');
const e2 = written.indexOf('"topics": [');
if (s2 < 0 || e2 < 0) throw new Error("File ghi ra thiếu khối nodes/topics.");
const inner = written.slice(s2 + '"nodes": ['.length, e2);
// inner bắt đầu SAU dấu "[" mở → nối lại để parse được.
const parseInput = "[" + inner.slice(0, inner.lastIndexOf("]") + 1);
const parsed = JSON.parse(parseInput);
const ok =
  parsed.length === 167 &&
  parsed.every((n, i) => JSON.stringify(n) === JSON.stringify(nodes[i]));
console.log(`Đã ghi ${SRC_TS}`);
console.log(`nodes: ${nodes.length} (${levelLine})`);
console.log(`Parse lại khối nodes: ${parsed.length} node, khớp nguồn: ${ok}`);
