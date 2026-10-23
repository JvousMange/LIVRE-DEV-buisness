#!/usr/bin/env bash
# Corps v3 : voix ElevenLabs (v3/voix.mp3) -> alignement -> rendu -> mix -> out/MELA_explicatif_v3_<JJMM>.mp4
set -euo pipefail
cd "$(dirname "$0")/.."
python3 -I tools/v3_timeline.py >/dev/null
node tools/render.mjs --page=v3.html --sfx=v3/sfx.json --sfxonly=1 --out=tmp/none >/dev/null 2>&1
python3 -I tools/audio.py v3/sfx.json v3/voice.wav v3/mix.wav
FR=v3/frames; mkdir -p $FR; node tools/render.mjs --page=v3.html --out=$FR --workers=4 2>&1 | tail -1
ffmpeg -v error -y -framerate 12 -i $FR/%05d.jpg -vf "fps=24,format=yuv420p" -c:v libx264 -preset slow -crf 17 -profile:v high -pix_fmt yuv420p -color_primaries bt709 -color_trc bt709 -colorspace bt709 v3/video.mp4
OUT=out/MELA_explicatif_v3_$(date +%d%m)_v1.mp4
tools/mux2.sh v3/video.mp4 v3/mix.wav $OUT
echo "OK -> $OUT"
