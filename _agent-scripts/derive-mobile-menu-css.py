from pathlib import Path
css=Path('docs/research/aioenglish/goal/source/shell/default.css').read_text(encoding='utf-8')
scopes=['a71354be']

def filtered(s):
 out=[];i=0
 while i<len(s):
  a=s.find('{',i)
  if a<0:break
  n=1;j=a+1;q=None
  while j<len(s) and n:
   c=s[j]
   if q:
    if c==q and s[j-1]!='\\':q=None
   elif c in ['"',"'"]:q=c
   elif c=='{':n+=1
   elif c=='}':n-=1
   j+=1
  head=s[i:a];body=s[a+1:j-1]
  if head.lstrip().startswith(('@media','@container','@supports')):
   inner=filtered(body)
   if inner:out.append(head+'{'+inner+'}')
  elif any(x in head for x in scopes):out.append(head+'{'+body+'}')
  i=j
 return ''.join(out)
Path('src/styles/custom/mobile-menu-reference.css').write_text('/* Scoped mobile menu presentation derived from observed source CSS. */\n'+filtered(css),encoding='utf-8')
