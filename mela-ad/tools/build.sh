#!/usr/bin/env bash
# Usage: tools/build.sh <dossier-modèle-voix> [vitesse]   — voix -> timeline -> sfx/musique -> rendu -> mp4
set -euo pipefail
cd "$(dirname "$0")/.."
MODEL="$1"; SPEED="${2:-1.0}"
mkdir -p tmp out
python3 -I tools/voice.py "$MODEL" tmp "$SPEED"
python3 -c "import json;print('const TL='+json.dumps(json.load(open('tmp/timeline.json')),ensure_ascii=False)+';')" > web/timeline.js
node tools/render.mjs --sfx=tmp/sfx.json --sfxonly=1 --out=tmp/none >/dev/null
ffmpeg -v error -y -i tmp/voice.wav -ar 48000 -af "highpass=f=70,acompressor=threshold=-20dB:ratio=3:attack=5:release=80" tmp/voice48.wav
python3 -I tools/audio.py tmp/sfx.json tmp/voice48.wav tmp/mix.wav
FR=tmp/frames_$(date +%s); node tools/render.mjs --out=$FR --workers=4
ffmpeg -v error -y -framerate 12 -i $FR/%05d.jpg -i tmp/mix.wav -vf "fps=24,format=yuv420p,colorspace=all=bt709:iall=bt709:fast=1" \
  -c:v libx264 -preset slow -crf 17 -profile:v high -pix_fmt yuv420p -color_primaries bt709 -color_trc bt709 -colorspace bt709 \
  -af "loudnorm=I=-16:TP=-2.5:LRA=11,alimiter=limit=0.89" -c:a aac -b:a 192k -ar 48000 -shortest -movflags +faststart out/mela-skin-ad.mp4
echo "OK -> out/mela-skin-ad.mp4"
