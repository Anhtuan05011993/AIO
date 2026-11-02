from pathlib import Path
css=Path('docs/research/aioenglish/goal/source/css/2741bf76e6c7447d.css').read_text(encoding='utf-8')
scopes=['33ecd40a','b3d743e7','128409b8','a590b89b','eb0c0c9c','3a982818','66a7447b','91d4bd9d','05767118','61a7f904','5f4a1792','08e54c6d']
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
  elif any(x in head for x in scopes) or head.lstrip().startswith('@keyframes vhs-sheen'):out.append(head+'{'+body+'}')
  i=j
 return ''.join(out)
Path('src/styles/custom/vocab-reference.css').write_text('/* Scoped vocabulary presentation derived from observed source CSS. */\n'+filtered(css),encoding='utf-8')
