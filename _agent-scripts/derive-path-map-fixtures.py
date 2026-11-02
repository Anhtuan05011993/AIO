"""Extract presentation-only map geometry observed through the source UI."""
import json
import re
from pathlib import Path

root = Path(__file__).resolve().parents[1]
observed = json.loads((root / 'docs/research/aioenglish/goal/source/path-maps/observed.json').read_text(encoding='utf-8'))
levels = root / 'docs/research/aioenglish/goal/source/path-maps/levels-observed.json'
if levels.exists():
    observed.update(json.loads(levels.read_text(encoding='utf-8')))
target = root / 'public/assets/aioenglish/maps'
target.mkdir(parents=True, exist_ok=True)
for key, item in observed.items():
    html = re.sub(r'\sdata-sharkid="[^"]*"', '', item['html'])
    html = re.sub(r'<!--.*?-->', '', html, flags=re.S)
    assert not re.search(r'<(?:script|iframe|input)\b|\son\w+=', html, re.I)
    payload = dict(html=html, width=float(item['width'].removesuffix('px')), height=float(item['height'].removesuffix('px')))
    (target / f'{key}.json').write_text(json.dumps(payload, ensure_ascii=False, separators=(',', ':')), encoding='utf-8')
print(f'Wrote {len(observed)} map presentation assets; no course/API/store changes')
