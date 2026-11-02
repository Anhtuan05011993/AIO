// f2-scorer-test.js — sanity test scorer.ts (chạy bằng node --experimental-strip-types).
import { scoreTranslation, normalizeTokens, wordCountHint } from "../src/components/sites/aioenglish/reading/scorer.ts";

const ref = "The city council will review the results before deciding to repeat the event.";
const cases = [
  ["exact-copy", scoreTranslation(ref, "The city council will review the results before deciding to repeat the event!")],
  ["no-articles", scoreTranslation(ref, "City council will review results before deciding to repeat event")],
  ["paraphrase", scoreTranslation(ref, "The council reviews the results before repeating the event")],
  ["wrong", scoreTranslation(ref, "I like coffee and tea in the morning with bread")],
  ["empty", scoreTranslation(ref, "")],
  ["extra-words", scoreTranslation(ref, "The city council will review the results before they decide to repeat the event again")],
];
for (const [name, r] of cases) {
  console.log(name.padEnd(14), "ratio=" + r.ratio.toFixed(3), r.verdict, "extra=" + r.extraCount);
}
console.log("tokens:", normalizeTokens(ref).join("|"));
console.log("wordCountHint:", wordCountHint(ref));

const ref2 = "You don't need a gym to feel better in the morning.";
console.log("contraction:", scoreTranslation(ref2, "You do not need a gym to feel better in the morning.").ratio.toFixed(3));
console.log("vi-diacritics-tolerant:", normalizeTokens("Trẻ em vẽ lên vỉa hè").join("|"));
