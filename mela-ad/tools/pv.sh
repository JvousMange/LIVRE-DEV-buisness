#!/usr/bin/env bash
# usage: tools/pv.sh page out [sheetcols] -> mid-shot sheets
cd "$(dirname "$0")/.."
PAGE=$1; OUT=$2
node tools/render.mjs --page=$PAGE --fps=24 --sfx=tmp/pvsfx.json --sfxonly=1 --out=tmp/none >/dev/null 2>&1
python3 - <<P
import json
d=json.load(open('tmp/pvsfx.json'))
print(type(d), list(d.keys())[:5] if isinstance(d,dict) else d[:2])
P
