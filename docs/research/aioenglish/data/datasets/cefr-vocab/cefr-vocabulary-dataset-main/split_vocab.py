#!/usr/bin/env python3
"""vocabulary_words_rows.sql -> dil-seviye (orn. en-A1) bazinda JSON ve CSV dosyalari."""
import re, os, sys, json, csv
from collections import defaultdict

SRC = "vocabulary_words_rows.sql"
OUT_JSON = "vocab_json"
OUT_CSV = "vocab_csv"

COLS = ["id", "lemma", "language", "cefr_level", "pos", "ipa",
        "definition_target", "audio_url", "source", "created_at", "updated_at"]

def parse_tuples(text):
    """VALUES (...), (...) kismindan her tuple'i tam metin olarak dondurur."""
    tuples, depth, in_str, start, i, n = [], 0, False, None, 0, len(text)
    while i < n:
        c = text[i]
        if in_str:
            if c == "'":
                if i + 1 < n and text[i+1] == "'":
                    i += 2; continue
                in_str = False
        else:
            if c == "'":
                in_str = True
            elif c == '(':
                if depth == 0: start = i
                depth += 1
            elif c == ')':
                depth -= 1
                if depth == 0: tuples.append(text[start:i+1])
        i += 1
    return tuples

def split_fields(tup):
    """(...) tuple'ini (deger, tirnakli_miydi) listesine ayirir. Tirnaksiz 'null' -> None."""
    inner = tup[1:-1]
    fields, cur, in_str, quoted, i, n = [], [], False, False, 0, len(inner)
    while i < n:
        c = inner[i]
        if in_str:
            if c == "'":
                if i + 1 < n and inner[i+1] == "'":
                    cur.append("'"); i += 2; continue
                in_str = False
            else:
                cur.append(c)
        else:
            if c == "'":
                in_str = True; quoted = True
            elif c == ',':
                raw = ''.join(cur).strip()
                fields.append(None if (not quoted and raw.lower() == "null") else raw if quoted or raw else raw)
                cur, quoted = [], False
            else:
                cur.append(c)
        i += 1
    raw = ''.join(cur).strip()
    fields.append(None if (not quoted and raw.lower() == "null") else raw)
    return fields

def main():
    if not os.path.exists(SRC):
        sys.exit(f"Bulunamadi: {SRC}")
    with open(SRC, encoding="utf-8") as f:
        text = f.read()

    groups = defaultdict(list)
    for tup in parse_tuples(text):
        vals = split_fields(tup)
        if len(vals) < len(COLS):
            continue
        row = dict(zip(COLS, vals))
        if str(row["id"]).strip('"') == "id":   # INSERT kolon listesini atla
            continue
        groups[(row["language"], row["cefr_level"])].append(row)

    os.makedirs(OUT_JSON, exist_ok=True)
    os.makedirs(OUT_CSV, exist_ok=True)
    total = 0
    for (lang, level), rows in sorted(groups.items()):
        base = f"{lang}-{level}"
        with open(f"{OUT_JSON}/{base}.json", "w", encoding="utf-8") as f:
            json.dump(rows, f, ensure_ascii=False, indent=2)
        with open(f"{OUT_CSV}/{base}.csv", "w", encoding="utf-8", newline="") as f:
            w = csv.DictWriter(f, fieldnames=COLS)
            w.writeheader()
            w.writerows(rows)
        total += len(rows)
        print(f"  {base:8}  {len(rows):5} kelime")
    print(f"\n{total} kelime, {len(groups)} dosya  ->  {OUT_JSON}/  ve  {OUT_CSV}/")

if __name__ == "__main__":
    main()
