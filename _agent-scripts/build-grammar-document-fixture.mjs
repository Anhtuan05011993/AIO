/**
 * Presentation fixture only: fill the observed Present Simple document shell
 * with content already present locally. Never emits pools, sets, or scoring data.
 * Run with the installed Node LTS (native TypeScript stripping).
 */
import fs from 'node:fs';
import { nguPhapCatalog as catalog } from '../src/lib/demo-data/nguPhapCatalog.ts';
import { DEMO_LESSONS as demo } from '../src/lib/demo-data/grammar/demoLessons.ts';

const read = (path) => JSON.parse(fs.readFileSync(new URL(path, import.meta.url), 'utf8'));
const real = read('../src/lib/demo-data/grammar/real-lessons.json');
const spec = read('../docs/research/aioenglish/goal/source/grammar/document-body-spec.json');
const samples = read('../src/lib/ui-fixtures/grammar-document-sample.json');
const exact = read('../src/lib/ui-fixtures/grammar-document-block-samples.json');
const slug = 'thi-hien-tai-don';
const topic = catalog.topics.find(t => t.slug === slug);
if (!topic) throw Error('Observed document topic is missing');
const prefixes = { ps: 'a1-present-simple', '3p': 'a1-present-third-person', c1: 'c1-present-advanced' };
if (Object.values(prefixes).some(id => !topic.nodeIds.includes(id))) throw Error('Observed document node mapping changed');
const ordinal = { affirm: 1, negative: 2, question: 3, use: 4, reporting: 1, summary: 2, perfect: 3 };
const unique = values => [...new Set(values.filter(v => typeof v === 'string' && v.trim()))];
const sections = {}, sectionNodes = {}, provenance = {};

function owner(section) {
  if (section.node) return section.node;
  return prefixes[section.id.match(/^sec-(?:use|mistakes)-(ps|3p|c1)$/)?.[1]];
}
function example(item) {
  const selected = item.options?.find(option => option.key === item.answer)?.text;
  return { en: item.target, vi: item.sourceVi, focus: unique((item.gaps ?? []).map(g => g.word).concat(selected ? selected.split(/\s+/) : [])) };
}
function ruleData(section, node) {
  const number = ordinal[section.id.split('-').at(-1)];
  const lesson = real[node];
  const items = [...lesson.exercises.gap, ...lesson.exercises.choice]
    .filter(item => item.teachId === `${node}-rule-${number}`);
  return { items, paragraphs: unique(items.map(item => item.explain)), hints: unique(items.map(item => item.hint)) };
}

for (const section of spec) {
  const node = owner(section);
  if (node) {
    if (!topic.nodeIds.includes(node) || !real[node]) throw Error(`Unknown document node: ${section.id}/${node}`);
    sectionNodes[section.id] = node;
  }
  if (exact[slug]?.[section.id] || samples[slug].preview.some(p => p.id === section.id)) continue;
  const data = node && section.id.startsWith('sec-rule-') ? ruleData(section, node) : undefined;
  let paragraph = 0;
  const used = [], existingDataPaths = [];
  const blocks = section.blocks.map(block => {
    if (block.class.includes('gdr-p')) {
      const text = data?.paragraphs[paragraph++] ?? demo[node]?.intro[0] ?? real[node]?.start.body;
      if (!text) throw Error(`Missing existing paragraph: ${section.id}`);
      return { type: 'paragraph', text };
    }
    if (block.class.includes('gdr-fml')) {
      // Short formulas are observed UI labels, not exercise/curriculum records.
      if (!block.formula?.length) throw Error(`Missing formula spec: ${section.id}`);
      return { type: 'formula', lines: block.formula };
    }
    if (block.class.includes('gdr-exs')) {
      let items;
      if (section.id === 'sec-examples') {
        items = topic.nodeIds.flatMap(id => {
          existingDataPaths.push(`real-lessons.json:${id}.start.examples`);
          return real[id].start.examples.map(item => ({
            en: item.en, vi: item.vi, focus: item.focus ? item.focus.split(/\s+/) : [],
            note: catalog.nodes.find(node => node.id === id).title,
          }));
        }).slice(0, block.items);
      } else {
        const seen = new Set();
        const selected = data.items.filter(item => {
          if (!item.target || !item.sourceVi || seen.has(item.target)) return false;
          seen.add(item.target); return true;
        }).slice(0, block.items);
        used.push(...selected.map(item => item.id));
        items = selected.map(example);
      }
      if (items.length !== block.items) throw Error(`Not enough existing examples: ${section.id}`);
      return { type: 'examples', items };
    }
    if (block.class.includes('gdr-call')) {
      const text = data?.hints[0] ?? demo[node]?.intro.at(-1);
      if (!text) throw Error(`Missing existing callout: ${section.id}`);
      return { type: 'callout', tone: block.tone ?? 'note', text };
    }
    if (block.class.includes('gdr-chips')) {
      const entry = catalog.nodes.find(n => n.id === node);
      return { type: 'practice', items: [{href: `/ngu-phap/${node}`, label: `Luyện: ${entry.title}`}] };
    }
    if (block.class.includes('gdr-tbl')) {
      const fixes = real[node].exercises.fix.slice(0, block.rows);
      if (fixes.length !== block.rows || block.headers.length !== 3) throw Error(`Missing existing mistake rows: ${section.id}`);
      used.push(...fixes.map(item => item.id));
      return { type: 'table', headers: block.headers, rows: fixes.map(item => [item.source, item.target, item.explain]) };
    }
    if (block.class.includes('gdr-dot')) {
      let lines;
      if (section.id === 'sec-recap') lines = topic.nodeIds.map(id => demo[id].intro[0]);
      else if (section.id === 'sec-signals') {
        const candidates = [...real[topic.nodeIds[0]].exercises.gap, ...real[topic.nodeIds[0]].exercises.choice];
        const selected = candidates.filter(item => /\b(every|always|usually|often|never|on (Mondays|Sundays|Saturdays))\b/i.test(item.target));
        lines = unique(selected.map(item => item.target)).slice(0, block.items);
        used.push(...selected.filter(item => lines.includes(item.target)).map(item => item.id));
      }
      if (lines?.length !== block.items) throw Error(`Missing existing bullet examples: ${section.id}`);
      return { type: 'bullets', lines };
    }
    throw Error(`Unsupported observed block: ${section.id}/${block.class}`);
  });
  sections[section.id] = blocks;
  provenance[section.id] = { node: node ?? null, existingExerciseIds: unique(used), existingDataPaths };
}
const fixture = { topics: { [slug]: sections }, sectionNodes: { [slug]: sectionNodes }, provenance };
if (Object.keys(sections).length !== 14) throw Error('Expected exactly the 14 remaining presentation sections');
const destination = new URL('../src/lib/ui-fixtures/grammar-document-local-blocks.json', import.meta.url);
fs.writeFileSync(destination, JSON.stringify(fixture, null, 2) + '\n');
console.log(JSON.stringify({ sections: Object.keys(sections).length, bytes: fs.statSync(destination).size, source: 'Existing local text/examples only; observed UI formulas and block metadata' }));
