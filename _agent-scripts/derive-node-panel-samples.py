"""Two observed panel UI samples, plus summaries of already present lessons."""
from html.parser import HTMLParser
from pathlib import Path
import json
import re

root = Path(__file__).resolve().parents[1]
out = {}
existing = json.loads((root/'src/lib/demo-data/grammar/real-lessons.json').read_text(encoding='utf-8'))
for key, lesson in existing.items():
    start = lesson.get('start') or {}
    rules = lesson.get('rules') or []
    out[key] = dict(intro=start.get('body',''), formula=rules[0].get('formula',[]) if rules else [], examples=start.get('examples',[])[:2], mistake='')

class Node:
    def __init__(self, tag='', attrs=()):
        self.tag, self.attrs, self.children = tag, dict(attrs), []
    def text(self):
        return ''.join(c if isinstance(c,str) else c.text() for c in self.children)
    def find(self, cls):
        found = [self] if cls in self.attrs.get('class','').split() else []
        for child in self.children:
            if isinstance(child,Node): found.extend(child.find(cls))
        return found
class Tree(HTMLParser):
    def __init__(self):
        super().__init__(); self.root=Node(); self.stack=[self.root]
    def handle_starttag(self, tag, attrs):
        node=Node(tag,attrs);self.stack[-1].children.append(node)
        if tag not in ('br','hr','img','input','meta','link','path','circle'): self.stack.append(node)
    def handle_endtag(self, tag):
        for i in range(len(self.stack)-1,0,-1):
            if self.stack[i].tag==tag:
                self.stack=self.stack[:i];break
    def handle_data(self,data): self.stack[-1].children.append(data)

for name in ('a1','c2'):
    html=(root/f'docs/research/aioenglish/goal/source/path-maps/node-panel-{name}.html').read_text(encoding='utf-8')
    key=re.search(r'href="/ngu-phap/([^"]+)"',html)[1]
    t=Tree();t.feed(html)
    out[key]=dict(intro=t.root.find('mp-p')[0].text(),formula=[n.text() for n in t.root.find('mp-fml-l')],examples=[dict(en=n.find('mp-ex-en')[0].text(),vi=n.find('mp-ex-vi')[0].text()) for n in t.root.find('mp-ex')],mistake=t.root.find('mp-mis')[0].text())
(root/'src/lib/ui-fixtures/path-node-summaries.json').write_text(json.dumps(out,ensure_ascii=False,separators=(',',':')),encoding='utf-8')
print(f'Wrote {len(out)} presentation summaries; existing lessons unchanged')
