from pathlib import Path
css=Path('docs/research/aioenglish/goal/source/video/video.css').read_text(encoding='utf-8') + Path('docs/research/aioenglish/goal/source/video/state.css').read_text(encoding='utf-8')
css += Path('docs/research/aioenglish/goal/source/video/mode.css').read_text(encoding='utf-8')
css += Path('docs/research/aioenglish/goal/source/video/search.css').read_text(encoding='utf-8')
scopes=['965404b0','c7d6c05b','ec44a65f','86ebee26','e340b985','ecd6b480','9eb47d27','074f1064','eba74cda','af8e00a6','af0bc721','fe628554','2d2c0bf8','373ef635','97f2d612','7fc47ef9']

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
Path('src/styles/custom/video-reference.css').write_text('/* Scoped video presentation derived from observed source CSS. */\n'+filtered(css),encoding='utf-8')
