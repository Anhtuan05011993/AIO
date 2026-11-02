"""Compare protected source CSS/API/store with the original UI backup."""
from pathlib import Path
import hashlib
import json
import sys

root = Path(__file__).resolve().parents[1]
baseline = root / '.ui-backup-2026-11-01'
report = []
for scope in ['src/styles/source', 'src/app/api', 'src/lib/store']:
    def digest_tree(base):
        return {str(p.relative_to(base / scope)).replace('\\', '/'): hashlib.sha256(p.read_bytes()).hexdigest() for p in (base / scope).rglob('*') if p.is_file()}
    before, after = digest_tree(baseline), digest_tree(root)
    assert before, f'Missing baseline for {scope}'
    changed = [name for name in sorted(before.keys() | after.keys()) if before.get(name) != after.get(name)]
    report.append(dict(scope=scope, compared=len(after), changed=changed))
text = json.dumps(report, indent=2)
if len(sys.argv) > 1:
    (root / sys.argv[1]).write_text(text, encoding='utf-8')
print(text)
sys.exit(any(row['changed'] for row in report))
