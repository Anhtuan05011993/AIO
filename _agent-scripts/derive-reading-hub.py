"""Convert observed hub markup into explicit React presentation, excluding shell/user data."""
from pathlib import Path
from html.parser import HTMLParser
import json, re

base=Path('docs/research/aioenglish/goal/source/reading')
raw=base.joinpath('hub.html').read_text(encoding='utf-8')
svg=[]
def svg_token(m):
    index=len(svg); svg.append(m.group())
    return f'<source-art data-index="{index}"></source-art>'
raw=re.sub(r'<svg\b.*?</svg>',svg_token,raw,flags=re.S)
class Node:
    def __init__(self,tag='',attrs=None): self.tag=tag; self.attrs=dict(attrs or []); self.children=[]
class Parser(HTMLParser):
    def __init__(self): super().__init__(convert_charrefs=True);self.root=Node();self.stack=[self.root]
    def handle_starttag(self,t,a):
        n=Node(t,a);self.stack[-1].children.append(n)
        if t not in ['img','input','br','hr','meta','link']:self.stack.append(n)
    def handle_endtag(self,t):
        if len(self.stack)>1 and self.stack[-1].tag==t:self.stack.pop()
    def handle_data(self,d):self.stack[-1].children.append(d)
p=Parser();p.feed(raw)
def find(n):
    if isinstance(n,str):return None
    if n.attrs.get('data-testid')=='doc-dich-hub':return n
    return next((v for c in n.children if (v:=find(c)) is not None),None)
art=[]
names={'class':'className','tabindex':'tabIndex','viewbox':'viewBox','focusable':'focusable','stroke-width':'strokeWidth','stroke-linecap':'strokeLinecap','stroke-linejoin':'strokeLinejoin','fill-rule':'fillRule','clip-rule':'clipRule'}
actions={'tx-create-ai-hero':'ai','tx-create-ai':'ai','tx-tool-press':'press','tx-create-press':'press','press-import-open':'press','tx-tool-paste':'paste','tx-create-paste':'paste'}
def attrs(a):
    out=[]
    for k,v in a.items():
        if k.startswith('data-shark') or k.startswith('on'):continue
        if k=='style':
            style={}
            for pair in v.split(';'):
                if ':' in pair:
                    key,val=pair.split(':',1);key=key.strip()
                    if not key.startswith('--'):key=re.sub(r'-([a-z])',lambda m:m[1].upper(),key)
                    style[key]=val.strip()
            out.append('style={'+json.dumps(style,ensure_ascii=False)+' as CSSProperties}')
        else:out.append(names.get(k,k)+'='+json.dumps(v or '',ensure_ascii=False))
    return ' '.join(out)
def render(n):
    if isinstance(n,str):return '{'+json.dumps(n,ensure_ascii=False)+'}' if n else ''
    if n.tag=='source-art':
        s=svg[int(n.attrs['data-index'])]; open_tag=s[:s.index('>')+1];inner=s[len(open_tag):-6]
        sp=Parser();sp.feed(open_tag+'</svg>');a=sp.root.children[0].attrs
        a['aria-hidden']='true';a['focusable']='false'
        i=len(art);art.append(inner)
        return '<svg '+attrs(a)+' dangerouslySetInnerHTML={{__html:art['+str(i)+']}} />'
    a=attrs(n.attrs);test=n.attrs.get('data-testid');tag='Link' if n.tag=='a' else n.tag
    if test in actions:a+=' onClick={() => setCreate('+json.dumps(actions[test])+')}'
    if test=='tx-now-go':a+=' onClick={() => setNotice(true)}'
    inside='\n'.join(render(c) for c in n.children)
    return '<'+tag+' '+a+(' />' if tag in ['img','input','br','hr'] else '>\n'+inside+'\n</'+tag+'>')
jsx=render(find(p.root))
Path('src/lib/ui-fixtures/reading-art.json').write_text(json.dumps(art,ensure_ascii=False,indent=2),encoding='utf-8')
prefix='''"use client";
import Link from "next/link";
import { useState, type CSSProperties } from "react";
import art from "@/lib/ui-fixtures/reading-art.json";
import UiDialog from "../app/UiDialog";
import ReadingCreateDialog from "./ReadingCreateDialog";
import "@/styles/custom/reading-reference.css";
import "@/styles/custom/reading-parity.css";
export default function ReadingHubView(){
 const [create,setCreate]=useState<"ai"|"paste"|"press"|null>(null);
 const [notice,setNotice]=useState(false);
 return <>
'''
suffix='''
 {create && <ReadingCreateDialog kind={create} onClose={()=>setCreate(null)} />}
 {notice && <UiDialog title="Luyện dịch đoạn văn" onClose={()=>setNotice(false)}><p>Nội dung chưa được bổ sung.</p></UiDialog>}
 </>;
}
'''
Path('src/components/sites/aioenglish/reading/ReadingHubView.tsx').write_text(prefix+jsx+suffix,encoding='utf-8')
Path('src/styles/custom/reading-reference.css').write_text('/* Scoped presentation from observed source hub CSS; original source files remain untouched. */\n'+base.joinpath('hub.css').read_text(encoding='utf-8')+base.joinpath('empty-state.css').read_text(encoding='utf-8'),encoding='utf-8')
