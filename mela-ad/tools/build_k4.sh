#!/usr/bin/env bash
# Film « Cloudless » (corps v3, voix Marion) : alignement -> sfx -> rendu 24 fps -> mix -> out/MELA_cloudless_k4_<JJMM>_v1.mp4
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p v3k4
python3 -I tools/v3_timeline.py >/dev/null
node tools/render.mjs --page=k4.html --fps=24 --sfx=v3k4/sfx.json --sfxonly=1 --out=tmp/none >/dev/null 2>&1
python3 -I tools/audio.py v3k4/sfx.json v3/voice.wav v3k4/mix.wav
FR=v3k4/frames; python3 -c "import shutil;shutil.rmtree('$FR',True)"; mkdir -p $FR
node tools/render.mjs --page=k4.html --fps=24 --out=$FR --workers=4 2>&1 | tail -1
ffmpeg -v error -y -framerate 24 -i $FR/%05d.jpg -vf "format=yuv420p" -c:v libx264 -preset slow -crf 17 -profile:v high -pix_fmt yuv420p -color_primaries bt709 -color_trc bt709 -colorspace bt709 v3k4/video.mp4
OUT=out/MELA_cloudless_k4_$(date +%d%m)_v1.mp4
tools/mux2.sh v3k4/video.mp4 v3k4/mix.wav $OUT
echo "OK -> $OUT"
