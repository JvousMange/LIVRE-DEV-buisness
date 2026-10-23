#!/usr/bin/env bash
# Test tableau blanc (0 -> 26,6 s) : voix v3 + bruitages + rendu 24 fps
set -euo pipefail
cd "$(dirname "$0")/.."
END=${END:-26.6}; mkdir -p v3wb
ffmpeg -v error -y -i v3/voice.wav -t $(python3 -c "print($END+.4)") v3wb/voice.wav
node tools/render.mjs --page=wb.html --fps=24 --sfx=v3wb/sfx.json --sfxonly=1 --out=tmp/none >/dev/null 2>&1
python3 -I tools/audio.py v3wb/sfx.json v3wb/voice.wav v3wb/mix.wav
FR=v3wb/frames; rm -rf $FR 2>/dev/null || python3 -c "import shutil;shutil.rmtree('$FR',True)"; mkdir -p $FR
node tools/render.mjs --page=wb.html --fps=24 --out=$FR --workers=4 2>&1 | tail -1
ffmpeg -v error -y -framerate 24 -i $FR/%05d.jpg -vf "format=yuv420p" -c:v libx264 -preset slow -crf 17 -profile:v high -pix_fmt yuv420p -color_primaries bt709 -color_trc bt709 -colorspace bt709 v3wb/video.mp4
OUT=out/MELA_tableau-blanc_TEST_$(date +%d%m)_v1.mp4
tools/mux2.sh v3wb/video.mp4 v3wb/mix.wav $OUT
echo "OK -> $OUT"
