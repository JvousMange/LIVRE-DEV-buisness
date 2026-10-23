#!/usr/bin/env bash
# Usage: tools/mux2.sh <video-source.mp4> <mix.wav> <sortie.mp4>  — loudnorm en 2 passes (linéaire : pas de gain qui bouge dans le temps)
set -euo pipefail
V="$1"; A="$2"; O="$3"
J=$(ffmpeg -hide_banner -nostats -i "$A" -af "loudnorm=I=-15:TP=-3:LRA=11:print_format=json" -f null - 2>&1 | sed -n '/^{/,/^}/p')
g() { echo "$J" | python3 -c "import sys,json;print(json.load(sys.stdin)['$1'])"; }
ffmpeg -v error -y -i "$V" -i "$A" -map 0:v:0 -map 1:a:0 -c:v copy -af "loudnorm=I=-15:TP=-3:LRA=11:measured_I=$(g input_i):measured_TP=$(g input_tp):measured_LRA=$(g input_lra):measured_thresh=$(g input_thresh):offset=$(g target_offset):linear=true" -c:a aac -b:a 256k -ar 48000 -shortest -movflags +faststart "$O"
