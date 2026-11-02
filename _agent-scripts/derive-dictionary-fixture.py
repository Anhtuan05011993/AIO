from pathlib import Path
from html.parser import HTMLParser
from html import escape
import re,json
base=Path('docs/research/aioenglish/goal/source/dictionary')
class N:
 def __init__(self,tag='',attrs=None):self.tag=tag;self.attrs=dict(attrs or []);self.children=[]
 def has(self,cls):return cls in self.attrs.get('class','').split()
 def all(self,match):return [self] if match(self) else [v for c in self.children if isinstance(c,N) for v in c.all(match)]
 def one(self,cls):return next(iter(self.all(lambda n:n.has(cls))),None)
 def text(self):return ''.join(c if isinstance(c,str) else c.text() for c in self.children)
class P(HTMLParser):
 def __init__(self):super().__init__(convert_charrefs=True);self.root=N();self.stack=[self.root]
 def handle_starttag(self,t,a):
  n=N(t,a);self.stack[-1].children.append(n)
  if t not in ['input','img','br','hr','meta','link']:self.stack.append(n)
 def handle_endtag(self,t):
  if len(self.stack)>1 and self.stack[-1].tag==t:self.stack.pop()
 def handle_data(self,d):self.stack[-1].children.append(d)
fixtures={};art={}
for file in ['apple','initial']:
 raw=(base/(file+'.html')).read_text(encoding='utf8');svgs=[]
 def replace(m):i=len(svgs);svgs.append(m[0]);return f'<source-art index="{i}"></source-art>'
 p=P();p.feed(re.sub(r'<svg\b.*?</svg>',replace,raw,flags=re.S))
 root=next(iter(p.root.all(lambda n:n.attrs.get('data-testid')=='tu-dien-hub')))
 def html(n):
  if n is None:return ''
  if isinstance(n,str):return escape(n)
  if n.tag=='source-art':return svgs[int(n.attrs['index'])]
  attrs=' '.join(k+'="'+escape(v or '',quote=True)+'"' for k,v in n.attrs.items())
  return '<'+n.tag+' '+attrs+'>'+''.join(html(c) for c in n.children)+'</'+n.tag+'>'
 def tx(cls,node=root):n=node.one(cls);return n.text().strip() if n else ''
 word=tx('den-word-t')
 groups=[]
 for g in root.all(lambda n:n.has('den-grp')):
  senses=[]
  for sense in g.all(lambda n:n.has('den-sense')):
   senses.append({'meaning':tx('den-sense-t',sense),'definition':tx('den-gloss',sense),'example':tx('den-ex-en',sense),'exampleVi':tx('den-ex-vi',sense)})
  groups.append({'pos':tx('nbc-chip',g),'gist':tx('den-grp-pv',g),'senses':senses})
 sections={}
 for sec in root.all(lambda n:'data-dict-section' in n.attrs):
  sections[sec.attrs['data-dict-section']]=[{'word':tx('den-col-t',n).strip() if n.has('den-col') else tx('den-fam-pos',n)} for n in []]
  rows=[]
  for link in sec.all(lambda n:n.tag=='a'):
   bold=next(iter(link.all(lambda n:n.tag=='b')),None);small=next(iter(link.all(lambda n:n.tag=='small')),None)
   rows.append({'word':bold.text().strip() if bold else link.text().strip(),'meaning':small.text().strip() if small else '', 'pos':tx('den-fam-pos',link)})
  sections[sec.attrs['data-dict-section']]=rows
  if sec.one('nbx-bh-art'):art[sec.attrs['data-dict-section']]=html(sec.one('nbx-bh-art'))
 fixtures[word]={'word':word,'level':tx('nbx-lvl'),'meaning':tx('den-main-t'),'synopsis':tx('den-main-o'),'example':tx('den-ex-en'),'exampleVi':tx('den-ex-vi'),'note':tx('den-usage').removeprefix('Ghi chú').strip(),'groups':groups,'sections':sections,'ipa':tx('font-ipa')}
 art['decoration']=html(root.one('nbx-hdeco'));art['header']=html(root.one('nbc-hd-art'))
Path('src/lib/ui-fixtures/dictionary-samples.json').write_text(json.dumps(fixtures,ensure_ascii=False,indent=2),encoding='utf8')
Path('src/lib/ui-fixtures/dictionary-art.json').write_text(json.dumps(art,ensure_ascii=False,indent=2),encoding='utf8')
Path('src/styles/custom/dictionary-reference.css').write_text('/* Observed dictionary presentation; original source CSS stays untouched. */\n'+(base/'hub.css').read_text(encoding='utf8')+(base/'entry.css').read_text(encoding='utf8'),encoding='utf8')
print(list(fixtures))
