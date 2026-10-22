#!/usr/bin/env bash
# Usage: MODELS=<dossier modèles> tools/build.sh <nom> <moteur> [options voix…]
#   ex : tools/build.sh v4 kokoro:30 --human
#   voix externe (ElevenLabs) : ASR_MODEL=<whisper-small> tools/build.sh el1 external:/chemin/voix.mp3   (fichier ou dossier)        (moteurs : piper:siwis | piper:upmc0 | kokoro:30)
set -euo pipefail
cd "$(dirname "$0")/.."
NAME="$1"; ENGINE="$2"; shift 2
W=tmp/$NAME; mkdir -p $W out
if [[ "$ENGINE" == external:* ]]; then python3 -I tools/align_voice.py "${ENGINE#external:}" $W; else python3 -I tools/voice2.py "$ENGINE" $W "$@"; fi
python3 -c "import json,sys;print('const TL='+json.dumps(json.load(open('$W/timeline.json')),ensure_ascii=False)+';')" > web/timeline.js
node tools/render.mjs --sfx=$W/sfx.json --sfxonly=1 --out=tmp/none >/dev/null 2>&1
python3 -I tools/audio.py $W/sfx.json $W/voice.wav $W/mix.wav
FR=$W/frames; mkdir -p $FR; node tools/render.mjs --out=$FR --workers=4 2>&1 | tail -1
ffmpeg -v error -y -framerate 12 -i $FR/%05d.jpg -i $W/mix.wav -vf "fps=24,format=yuv420p" \
  -c:v libx264 -preset slow -crf 17 -profile:v high -pix_fmt yuv420p -color_primaries bt709 -color_trc bt709 -colorspace bt709 \
  -af "loudnorm=I=-16:TP=-3.5:LRA=11" -c:a aac -b:a 256k -ar 48000 -shortest -movflags +faststart out/mela-skin-ad-v2-$NAME.mp4
echo "OK -> out/mela-skin-ad-v2-$NAME.mp4"
