#!/usr/bin/env bash
# Planche-contact de frames Remotion : snap.sh OUT.jpg frame1 frame2 ...
set -e
PROJ=/home/user/LIVRE-DEV-buisness/mela-skin/ad-remotion/episodes/01-mela/papercut
BR=/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell
OUT=$1; shift
D=$(mktemp -d); cd $PROJ
for f in "$@"; do
  npx remotion still src/index.ts MelaAd $D/f$(printf %05d $f).png --frame=$f --scale=0.3 --browser-executable=$BR >/dev/null 2>&1 &
  while [ $(jobs -r | wc -l) -ge 4 ]; do sleep 0.2; done
done
wait
python3 - "$D" "$OUT" <<'PY'
import sys,glob
from PIL import Image, ImageDraw
fs=sorted(glob.glob(sys.argv[1]+"/f*.png")); ims=[Image.open(f) for f in fs]
w,h=ims[0].size; cols=min(len(ims),8); rows=(len(ims)+cols-1)//cols
s=Image.new("RGB",(cols*w,rows*h))
for k,(im,f) in enumerate(zip(ims,fs)):
    s.paste(im,((k%cols)*w,(k//cols)*h)); ImageDraw.Draw(s).text(((k%cols)*w+4,(k//cols)*h+4),str(int(f[-9:-4])),fill=(255,255,255))
s.save(sys.argv[2],quality=85)
PY
rm -rf $D
