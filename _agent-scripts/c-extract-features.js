// Agent C scratch: extract per-feature card attributes from home.html (v2).
const fs = require("fs");
const html = fs.readFileSync("docs/research/aioenglish/home.html", "utf8");
const keys = ["go-cau", "tu-vung", "ngu-phap", "luyen-dich-thuat", "video", "tu-dien", "lo-trinh"];
for (const k of keys) {
  const i = html.indexOf(`href="/${k}"`);
  if (i < 0) { console.log(k + " NOT FOUND"); continue; }
  const seg = html.slice(i, i + 3000);
  const cls = (seg.match(/class="(nbx-fcard[^"]*)"/) || [])[1] || "?";
  const feat = (seg.match(/data-feature="([^"]*)"/) || [])[1] || "?";
  const chip = (seg.match(/nbx-chip nbx-lvl[^>]*>([^<]*)/) || [])[1] || "?";
  const title = (seg.match(/data-deck-title[^>]*>([^<]*)/) || [])[1] || "?";
  const blurb = (seg.match(/data-deck-blurb[^>]*>([^<]*)/) || [])[1] || "?";
  console.log(`${k}\n  class=${cls}\n  data-feature=${feat}\n  chip=${chip}\n  title=${title}\n  blurb=${blurb}`);
}
// Where does the card list end (what cards exist)?
const deck = html.indexOf('data-home-deck');
const deckSeg = html.slice(deck, deck + 200);
console.log("deck open tag:", deckSeg.match(/<section[^>]*data-home-deck[^>]*>/)?.[0]);
