#!/usr/bin/env bash
# Usage : ELEVENLABS_API_KEY=… tools/build_hook.sh <A..F>  — voix du hook + corps figé -> rendu -> out/MELA_explicatif_hook<ID>_<nom>_<JJMM>_v1.mp4
set -euo pipefail
cd "$(dirname "$0")/.."
H="$1"; W=tmp/h$H; mkdir -p $W out
NOM=$(python3 -c "import json;print(next(h['nom'] for h in json.load(open('hooks.json'))['hooks'] if h['id']=='$H'))")
python3 -I tools/make_variant_voice.py $H $W
python3 -c "import json;print('const TL='+json.dumps(json.load(open('$W/timeline.json')),ensure_ascii=False)+';')" > web/timeline.js
node tools/render.mjs --hook=$H --sfx=$W/sfx.json --sfxonly=1 --out=tmp/none >/dev/null 2>&1
python3 -I tools/audio.py $W/sfx.json $W/voice.wav $W/mix.wav
FR=$W/frames; mkdir -p $FR; node tools/render.mjs --hook=$H --out=$FR --workers=4 2>&1 | tail -1
ffmpeg -v error -y -framerate 12 -i $FR/%05d.jpg -vf "fps=24,format=yuv420p" -c:v libx264 -preset slow -crf 17 -profile:v high -pix_fmt yuv420p -color_primaries bt709 -color_trc bt709 -colorspace bt709 $W/video.mp4
OUT=out/MELA_explicatif_hook${H}_${NOM}_$(date +%d%m)_v1.mp4
tools/mux2.sh $W/video.mp4 $W/mix.wav $OUT
echo "OK -> $OUT"
