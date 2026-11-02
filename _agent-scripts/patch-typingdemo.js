const fs = require("fs");
const p = "D:/Clone web/src/components/sites/aioenglish/landing/TypingDemo.tsx";
let s = fs.readFileSync(p, "utf8");
let n = 0;
function rep(from, to) {
  const parts = s.split(from);
  n += parts.length - 1;
  s = parts.join(to);
}

// 1) outer hero-demo wrappers (idle/playing/done)
rep('<div id="go-thu" data-hero-demo className="hero-demo min-w-0 scroll-mt-24">',
    '<div id="go-thu" data-hero-demo data-v-899ba7f3="" className="hero-demo min-w-0 scroll-mt-24">');

// 2) dmf-win section
rep('className="dmf-win nbx-r-info lpa-blk relative overflow-hidden rounded-card-lg border-bw border-border-strong bg-surface shadow-sh-4 lift press"',
    'data-v-a4dd9983="" data-v-d8aa9686="" className="dmf-win nbx-r-info lpa-blk relative overflow-hidden rounded-card-lg border-bw border-border-strong bg-surface shadow-sh-4 lift press"');

// 3) header row
rep('<div className="dmf-grid flex items-center gap-4 border-b-bw border-border-strong px-4 py-2.5 md:px-6">',
    '<div data-v-d8aa9686="" className="dmf-grid flex items-center gap-4 border-b-bw border-border-strong px-4 py-2.5 md:px-6">');

// 4) demo body grid div (min-height one)
rep('<div className="dmf-grid relative" style={{ minHeight: "var(--landing-demo-h)" }}>',
    '<div data-v-a4dd9983="" className="dmf-grid relative" style={{ minHeight: "var(--landing-demo-h)" }}>');

// 5) idle rv-bar: drop inline width, add scoped attr
rep('<span className="rv-bar block h-full rounded-pill bg-[hsl(var(--feat))]" style={{ width: "0%" }} />',
    '<span data-v-a4dd9983="" className="rv-bar block h-full rounded-pill bg-[hsl(var(--feat))]" />');

// 6) progress container + animated bar (idle)
rep('<span className="mt-3 block h-3 w-full shrink-0 overflow-hidden rounded-pill border-bw border-border-strong bg-surface">',
    '<span data-v-a4dd9983="" className="mt-3 block h-3 w-full shrink-0 overflow-hidden rounded-pill border-bw border-border-strong bg-surface">');

// 7) rv anchor chain (idle)
rep('<span className="rv-anchor grid w-full">', '<span data-v-a4dd9983="" className="rv-anchor grid w-full">');
rep('<span className="rv-mid w-full">', '<span data-v-a4dd9983="" className="rv-mid w-full">');
rep('<span className="rv-scope block w-full" data-annot>', '<span data-v-a4dd9983="" className="rv-scope block w-full" data-annot>');

// 8) rv-bot + vi + cta
rep('<span className="rv-bot flex w-full flex-col items-center gap-3">', '<span data-v-a4dd9983="" className="rv-bot flex w-full flex-col items-center gap-3">');
rep('<span className="rv-vi block break-words leading-snug text-fg-muted">', '<span data-v-a4dd9983="" className="rv-vi block break-words leading-snug text-fg-muted">');
rep('<span className="demo-cta block text-md font-semibold text-primary sm:text-lg">', '<span data-v-a4dd9983="" className="demo-cta block text-md font-semibold text-primary sm:text-lg">');

// 9) placeholder button
rep('data-testid="landing-demo-placeholder"\n                  data-fx-cover\n                  onClick={start}\n                  className="group demo-ph flex w-full flex-col bg-surface px-4 pb-6 text-center md:px-6"',
    'data-testid="landing-demo-placeholder"\n                  data-fx-cover\n                  onClick={start}\n                  data-v-a4dd9983=""\n                  className="group demo-ph flex w-full flex-col bg-surface px-4 pb-6 text-center md:px-6"');

// 10) TokenGroup token spans → data-v-3f6e36d4
rep('<span className="relative flex max-w-full flex-col items-center">', '<span data-v-3f6e36d4="" className="relative flex max-w-full flex-col items-center">');
rep('<span className="grid max-w-full justify-center gap-y-1" style={{ gridTemplateColumns: `repeat(${tokens.length}, max-content)` }}>',
    '<span data-v-3f6e36d4="" className="grid max-w-full justify-center gap-y-1" style={{ gridTemplateColumns: `repeat(${tokens.length}, max-content)` }}>');
rep('className="font-ipa ipa-tone rv-ipa justify-self-center whitespace-nowrap px-1.5 py-0.5 text-center leading-none"',
    'data-v-3f6e36d4="" className="font-ipa ipa-tone rv-ipa justify-self-center whitespace-nowrap px-1.5 py-0.5 text-center leading-none"');
rep('className="rounded-lg shadow-sh-1 transition-[filter] duration-150 group-hover:brightness-110"',
    'data-v-3f6e36d4="" className="rounded-lg shadow-sh-1 transition-[filter] duration-150 group-hover:brightness-110"');
rep('className="rv-word relative z-10 flex items-center justify-center whitespace-nowrap px-1.5 font-bold leading-tight transition-opacity',
    'data-v-3f6e36d4="" className="rv-word relative z-10 flex items-center justify-center whitespace-nowrap px-1.5 font-bold leading-tight transition-opacity');

// 11) tooltip span
rep('<span className="pointer-events-none absolute bottom-[calc(100%+1.25rem)] left-1/2 hidden w-[min(24rem,80vw)] -translate-x-1/2 rounded-card border-bw border-border-strong bg-surface px-4 py-3 text-left text-sm text-fg shadow-sh-2 md:block">',
    '<span data-v-3f6e36d4="" className="pointer-events-none absolute bottom-[calc(100%+1.25rem)] left-1/2 hidden w-[min(24rem,80vw)] -translate-x-1/2 rounded-card border-bw border-border-strong bg-surface px-4 py-3 text-left text-sm text-fg shadow-sh-2 md:block">');

// 12) playing progress bar transition bar span
rep('className="rv-bar block h-full rounded-pill bg-[hsl(var(--feat))] transition-[width] duration-200"',
    'data-v-a4dd9983="" className="rv-bar block h-full rounded-pill bg-[hsl(var(--feat))] transition-[width] duration-200"');

fs.writeFileSync(p, s);
console.log("replacements:", n);
