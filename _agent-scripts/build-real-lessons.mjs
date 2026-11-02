// build-real-lessons.mjs — chuyển data node ngữ pháp thật (aio-grammar-nodes.json,
// trích từ /api/ngu-phap/nodes/{id}) thành src/lib/demo-data/grammar/real-lessons.json
// dùng cho buildGrammarLesson (real đè demo).
// Nguồn giữ nguyên hình thái: start card + rule cards + worked + pools đầy đủ
// (pools = bài tập thật 4 chế độ, sẵn cho player tương lai).
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
// Gộp TẤT CẢ file trích được: aio-grammar-nodes.json (v1) + các part/more file
// của v2/v3 đặt cùng thư mục root. Node trùng nhau: bản sau đè bản trước.
const OUT = path.join(ROOT, "src/lib/demo-data/grammar/real-lessons.json");

const raw = {};
for (const f of fs.readdirSync(ROOT).filter((x) => /^aio-grammar-nodes.*\.json$/.test(x)).sort()) {
  const data = JSON.parse(fs.readFileSync(path.join(ROOT, f), "utf8"));
  let added = 0;
  for (const [id, node] of Object.entries(data)) {
    if (node._error || !node.lesson) continue;
    raw[id] = node;
    added++;
  }
  console.log(`${f}: +${added} node hợp lệ`);
}
const out = {};
for (const [id, node] of Object.entries(raw)) {
  const L = node.lesson;
  const cards = node.cards?.cards ?? [];
  const start = cards.find((c) => c.id?.endsWith("-start")) ?? null;
  const rules = cards.filter((c) => c.id && /-r\d+$/.test(c.id));
  out[id] = {
    nodeId: L.nodeId ?? id,
    level: L.level,
    title: L.title,
    start: start
      ? {
          title: start.title ?? "",
          body: start.body ?? "",
          examples: (start.examples ?? []).map((e) => ({ en: e.en, vi: e.vi, focus: e.focus ?? null })),
        }
      : null,
    rules: rules.map((r) => ({
      id: r.id ?? "",
      title: r.title ?? "",
      body: r.body ?? "",
      formula: r.formula ?? [],
      examples: (r.examples ?? []).map((e) => ({ en: e.en, vi: e.vi })),
    })),
    worked: (L.worked ?? []).map((w) => ({
      sub: w.sub ?? "",
      source: w.source ?? "",
      sourceVi: w.sourceVi ?? "",
      target: w.target ?? "",
      steps: (w.steps ?? []).map((s) => ({ do: s.do ?? "", result: s.result ?? "" })),
    })),
    guided: (L.guided ?? []).map((g) => ({ t: g.t ?? "item", cardId: g.cardId ?? null, itemId: g.itemId ?? null })),
    sets: L.sets ?? {},
    exercises: {
      transform: L.pools?.transform ?? [],
      fix: L.pools?.fix ?? [],
      gap: L.pools?.gap ?? [],
      choice: L.pools?.choice ?? [],
    },
  };
}
fs.writeFileSync(OUT, JSON.stringify(out));
const bytes = fs.statSync(OUT).size;
console.log(`real-lessons.json: ${Object.keys(out).length} node, ${(bytes / 1024).toFixed(0)}KB`);
const exTotal = Object.values(out).reduce(
  (s, n) => s + n.exercises.transform.length + n.exercises.fix.length + n.exercises.gap.length + n.exercises.choice.length,
  0,
);
console.log("tổng bài tập thật:", exTotal);
