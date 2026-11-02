import { test } from 'node:test';
import assert from 'node:assert/strict';

const base = process.env.AIO_TEST_URL ?? 'http://127.0.0.1:3000';

test('dictionary direct queries render source-style entries, existing local data and empty state', async () => {
  for (const [query, expected] of [['apple', 'apple'], ['benefit', 'benefit'], ['apple&q=benefit', 'apple']]) {
    const response = await fetch(new URL(`/tu-dien?q=${query}`, base));
    assert.equal(response.status, 200);
    const html = (await response.text()).replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
    assert.match(html, /data-dict-headword/);
    assert.match(html, new RegExp(`class="den-word-t">${expected}<`));
    assert.match(html, /data-ipa-speak="uk"/);
    assert.match(html, /data-ipa-speak="us"/);
    if(query==='apple')assert.match(html, /data-dict-section="wordFamily"/);
  }
  const empty = await fetch(new URL('/tu-dien?q=zzzz-no-word', base));
  assert.equal(empty.status, 200);
  assert.match(await empty.text(), /aria-label="Bản dịch"/);
});

test('all three newspaper hubs have real library routes and original local thumbnails', async () => {
  for (const paper of ['the-guardian', 'the-conversation', 'the-atlantic']) {
    const response = await fetch(new URL(`/luyen-dich-thuat/bao/${paper}`, base));
    assert.equal(response.status, 200);
    const html = (await response.text()).replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
    assert.match(html, /data-testid="press-hero"/);
    assert.equal((html.match(/data-testid="press-card"/g) ?? []).length, 12);
    assert.match(html, /src="\/assets\/aioenglish\/press\//);
  }
});

test('direct newspaper search can render empty results and page eight stays selected', async () => {
  const empty = await fetch(new URL('/luyen-dich-thuat/bao/the-guardian?q=zzzz-no-result', base));
  assert.equal(empty.status, 200);
  assert.match(await empty.text(), /Không tìm thấy bài báo/);
  const page = await fetch(new URL('/luyen-dich-thuat/bao/the-guardian?page=8', base));
  assert.match(await page.text(), /aria-current="page"[^>]*href="[^">]*page=8/);
});

test('newspaper article links have missing-content frames rather than 404s', async () => {
  const response = await fetch(new URL('/luyen-dich-thuat/bao/the-guardian/tex_aceea89499b373dea8', base));
  assert.equal(response.status, 200);
  assert.match(await response.text(), /Nội dung chưa được bổ sung/);
});

test('reading catalog renders level-specific metadata on direct refresh', async () => {
  for (const [path, count] of [['/luyen-dich-thuat/chu-de', 7], ['/luyen-dich-thuat/chu-de/du-lich?cap=all', 28]]) {
    const response = await fetch(new URL(path, base));
    assert.equal(response.status, 200);
    const html = (await response.text()).replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
    assert.match(html, /data-testid="doc-dich-topic"/);
    assert.equal((html.match(/data-lesson="/g) ?? []).length, count);
  }
});

test('reading sentence entry points render an honest missing-content frame', async () => {
  for (const id of ['ngau-nhien', 'theo-bai', 'tex_cat_tienganh_du-lich_a1_1']) {
    const response = await fetch(new URL(`/luyen-dich-thuat/tung-cau/${id}`, base));
    assert.equal(response.status, 200);
    assert.match(await response.text(), /Nội dung chưa được bổ sung/);
  }
});
const routes = ['/', '/tong-quan', '/go-cau', '/go-cau/lo-trinh-a1', '/go-cau/lo-trinh-a2',
  '/go-cau/lo-trinh-a1/crs_c9ac3ba0d8ae726835', '/tu-vung', '/tu-vung/phat-am',
  '/tu-vung/oxford-5000-nang-cao', '/ngu-phap', '/ngu-phap/a1-to-be', '/lo-trinh',
  '/lo-trinh/kiem-tra', '/video', '/luyen-dich-thuat', '/tu-dien', '/ban-be',
  '/cai-dat', '/yeu-cau-tinh-nang', '/luyen-thi', '/profile', '/@hocvien',
  '/chao-mung', '/auth/login', '/auth/register', '/auth/forgot',
  '/phap-ly', '/phap-ly/dieu-khoan', '/phap-ly/quyen-rieng-tu'];

for (const route of routes) {
  test(`direct navigation ${route} renders without a server error`, async () => {
    const response = await fetch(new URL(route, base));
    assert.equal(response.status, 200);
    const html = await response.text();
    assert.match(html, /<html[^>]*lang="vi"/);
    const documentHtml = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
    assert.equal(/<title>500:|<h1[^>]*>500<|<h2[^>]*>This page could not be found/.test(documentHtml), false, 'rendered document must not be an error page');
  });
}

test('missing course has an explicit content state rather than a 404', async () => {
  for (const route of ['/go-cau/lo-trinh-a2', '/tu-vung/oxford-5000-nang-cao']) {
    const response = await fetch(new URL(route, base));
    assert.equal(response.status, 200);
    assert.match(await response.text(), /Nội dung chưa được bổ sung/);
  }
});

test('IPA overview takes precedence over the dynamic vocabulary course route', async () => {
  const response = await fetch(new URL('/tu-vung/phat-am', base));
  const html = await response.text();
  const renderedHtml = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "").replace(/<!--[\s\S]*?-->/g, "");
  assert.match(renderedHtml, /Cả 50 âm/);
  assert.match(html, /Nguyên âm đôi/);
});

test('source vocabulary aliases retain access to existing local lessons', async () => {
  for (const route of ['/tu-vung/oxford-3000', '/tu-vung/toeic-band-550-784']) {
    const response = await fetch(new URL(route, base));
    assert.equal(response.status, 200);
    const documentHtml = (await response.text()).replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
    assert.match(documentHtml, /Nạp sâu ghi nhớ/);
    assert.match(documentHtml, /Flashcard/);
    assert.doesNotMatch(documentHtml, /<h1[^>]*>Nội dung chưa được bổ sung/);
  }
});

test('direct personal video URL renders the add form before hydration', async () => {
  const response = await fetch(new URL('/video?tab=cua-toi', base));
  assert.equal(response.status, 200);
  const html = (await response.text()).replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
  assert.match(html, /Thêm video YouTube/);
  assert.match(html, /Liên kết YouTube/);
  assert.doesNotMatch(html, /class="nbx-vcard nbx-polaroid vhk-card"/);
});

test('direct lucky video URL includes the mode picker while normal browse does not', async () => {
  for (const [route, expected] of [['/video?lucky=1', true], ['/video', false]]) {
    const response = await fetch(new URL(route, base));
    assert.equal(response.status, 200);
    const html = (await response.text()).replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
    assert.equal(/<dialog\b[^>]*class="[^"]*\bui-video-mode\b/.test(html), expected);
    if (expected) assert.match(html, /Chọn cách học/);
  }
});

test('specialty maps load their own presentation assets without missing routes', async () => {
  const { readFile } = await import('node:fs/promises');
  const catalog = JSON.parse(await readFile(new URL('../src/lib/ui-fixtures/path-map.json', import.meta.url), 'utf8'));
  const topics = catalog.rail.filter(entry => !entry.id.startsWith('level-'));
  assert.equal(topics.length, 37);
  for (const topic of topics) {
    const response = await fetch(new URL(`/assets/aioenglish/maps/${topic.id}.json`, base));
    assert.equal(response.status, 200, topic.id);
    const data = await response.json();
    assert.ok(data.width > 0 && data.height > 0, topic.id);
    assert.match(data.html, /data-testid="mindmap-root"/);
    assert.match(data.html, /data-testid="mindmap-leaf"/);
    assert.doesNotMatch(data.html, /<script\b|<iframe\b|\sonclick=/i);
  }
});

test('level map assets contain only the selected level and its observed node count', async () => {
  for (const [level, count] of Object.entries({ a1: 30, a2: 36, b1: 35, b2: 30, c1: 24, c2: 12 })) {
    const response = await fetch(new URL(`/assets/aioenglish/maps/level-${level}.json`, base));
    assert.equal(response.status, 200, level);
    const data = await response.json();
    const levels = [...data.html.matchAll(/data-zone-level="([^"]+)"/g)].map(match => match[1]);
    assert.deepEqual([...new Set(levels)], [level.toUpperCase()]);
    assert.equal([...data.html.matchAll(/data-testid="trail-part"/g)].length, count);
    assert.equal(data.width, 760);
  }
});

test('core grammar topic and document links render a topic frame directly', async () => {
  const { readFile } = await import('node:fs/promises');
  const data = JSON.parse(await readFile(new URL('../src/lib/ui-fixtures/grammar-core.json', import.meta.url), 'utf8'));
  const paths = [...new Set(data.groups.flatMap(group => group.topics.flatMap(topic => [topic.href, topic.doc])))];
  assert.equal(paths.length, 102);
  for (const path of paths) {
    const response = await fetch(new URL(path, base));
    assert.equal(response.status, 200, path);
    const html = (await response.text()).replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
    assert.match(html, /data-testid="runner-title"/);
    if (path.includes('/tai-lieu/')) {
      assert.match(html, /data-testid="grammar-document-body"/);
      assert.match(html, /aria-label="Mục lục"/);
      assert.doesNotMatch(html, /data-testid="grammar-runner"/);
    } else {
      assert.match(html, /data-testid="grammar-runner"/);
      assert.match(html, /data-testid="runner-card"/);
    }
  }
  const invalid = await fetch(new URL('/ngu-phap/chu-de/not-a-topic/hoc', base));
  assert.equal(invalid.status, 404);
});

test('Present Simple document renders all observed sections and responsive block families', async () => {
  const { readFile } = await import('node:fs/promises');
  const spec = JSON.parse(await readFile(new URL('../docs/research/aioenglish/goal/source/grammar/document-body-spec.json', import.meta.url), 'utf8'));
  const response = await fetch(new URL('/ngu-phap/tai-lieu/thi-hien-tai-don', base));
  assert.equal(response.status, 200);
  const html = (await response.text()).replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
  const sections = [...html.matchAll(/<section\b[^>]*\bid="(sec-[^"]+)"[^>]*>([\s\S]*?)<\/section>/g)];
  assert.equal(sections.length, 21);
  assert.deepEqual(sections.map(match => match[1]), spec.map(section => section.id));
  for (const [index, section] of spec.entries()) {
    const rendered = sections[index][2];
    const expectedExamples = section.blocks.filter(block => block.class.includes('gdr-exs')).reduce((sum, block) => sum + block.items, 0);
    const expectedFormulas = section.blocks.filter(block => block.class.includes('gdr-fml')).length;
    const tables = section.blocks.filter(block => block.class.includes('gdr-tbl'));
    assert.equal([...rendered.matchAll(/data-testid="doc-example"/g)].length, expectedExamples, section.id);
    assert.equal([...rendered.matchAll(/data-testid="doc-formula"/g)].length, expectedFormulas, section.id);
    assert.equal([...rendered.matchAll(/<table\b/g)].length, tables.length, section.id);
    assert.equal([...rendered.matchAll(/data-testid="doc-table-card"/g)].length, tables.reduce((sum, block) => sum + block.rows, 0), section.id);
    for (const link of rendered.matchAll(/<a\b[^>]*>/g)) {
      if (/class="doc-node-chip/.test(link[0])) {
        assert.match(link[0].match(/href="([^"]+)"/)?.[1] ?? '', /^\/ngu-phap\/[a-z0-9-]+$/);
      }
    }
  }
  assert.equal([...sections.find(match => match[1] === 'sec-examples')[2].matchAll(/class="gdr-note"/g)].length, 6);
  assert.match(html, /data-testid="doc-foot"/);
  const start = html.match(/<a\b[^>]*data-testid="doc-start"[^>]*>/)?.[0] ?? '';
  assert.match(start, /href="\/ngu-phap\/a1-present-simple"/);
});

test('friends tabs identify their active panel and expose one keyboard entry point', async () => {
  const response = await fetch(new URL('/ban-be', base));
  assert.equal(response.status, 200);
  const html = (await response.text()).replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
  const tabs = [...html.matchAll(/<button\b[^>]*role="tab"[^>]*>/g)].map(match => match[0]);
  assert.equal(tabs.length, 3);
  const active = tabs.filter(tab => /aria-selected="true"/.test(tab));
  assert.equal(active.length, 1);
  assert.equal(tabs.filter(tab => /tabindex="0"/.test(tab)).length, 1);
  assert.match(active[0], /tabindex="0"/);
  const panel = html.match(/<(?:div|section)\b[^>]*role="tabpanel"[^>]*>/)?.[0] ?? '';
  const attr = (tag, name) => tag.match(new RegExp(`(?:^|\\s)${name}="([^"]+)"`))?.[1];
  assert.ok(attr(panel, 'id'));
  assert.equal(attr(active[0], 'aria-controls'), attr(panel, 'id'));
  assert.equal(attr(panel, 'aria-labelledby'), attr(active[0], 'id'));
});
