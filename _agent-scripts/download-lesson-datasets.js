const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const dir = "D:/Clone web/docs/research/aioenglish/data/datasets";
fs.mkdirSync(dir, { recursive: true });

function dl(url, out) {
  try {
    execFileSync("curl", ["-sfL", "--max-time", "120", "-o", out, url]);
    console.log("OK  ", path.basename(out), fs.statSync(out).size, "bytes");
    return true;
  } catch (e) { console.log("FAIL", url); return false; }
}

// 1) CEFR vocabulary dataset (~60k words)
dl("https://github.com/Talhakasikci/cefr-vocabulary-dataset/archive/refs/heads/main.zip", path.join(dir, "cefr-vocab-dataset.zip"));

// 2) open-vn-en-dict raw JSON (Vietnamese-English dictionary)
dl("https://raw.githubusercontent.com/samuraitruong/open-vn-en-dict/master/README.md", path.join(dir, "vn-en-dict-readme.md"));

// 3) carryword/english-vocabulary file listing via API
try {
  execFileSync("curl", ["-sf", "--max-time", "30", "-o", path.join(dir, "carryword-en-vocab.json"),
    "https://api.github.com/repos/carryword/english-vocabulary/contents/"]);
  const j = JSON.parse(fs.readFileSync(path.join(dir, "carryword-en-vocab.json"), "utf8"));
  console.log("\ncarryword/english-vocabulary contents:");
  (Array.isArray(j) ? j : []).forEach(f => console.log(" ", f.type, f.name, f.size));
} catch (e) { console.log("carryword listing FAIL"); }

// unzip toeic-600
const toeicZip = path.join(dir, "toeic-600-dataset.zip");
if (fs.existsSync(toeicZip)) {
  try {
    execFileSync("powershell", ["-NoProfile", "-Command",
      `Expand-Archive -Path '${toeicZip}' -DestinationPath '${path.join(dir, "toeic-600")}' -Force`]);
    console.log("\nTOEIC-600 unzipped:");
    list(path.join(dir, "toeic-600"));
  } catch (e) { console.log("toeic unzip FAIL", e.message); }
}
function list(d) {
  if (!fs.existsSync(d)) return;
  for (const f of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, f.name);
    if (f.isDirectory()) { console.log("  [dir]", f.name); list(p); }
    else console.log("  ", f.name, fs.statSync(p).size);
  }
}
list(path.join(dir, "cefr-vocab-dataset"));
