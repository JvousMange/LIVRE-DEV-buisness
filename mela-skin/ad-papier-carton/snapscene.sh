#!/usr/bin/env bash
# snapscene.sh OUT.jpg N K [Nmax] : K images réparties dans le(s) plan(s) N..Nmax
PROJ=/home/user/LIVRE-DEV-buisness/mela-skin/ad-remotion/episodes/01-mela/papercut
FR=$(python3 - "$PROJ/src/plan.json" "$2" "$3" "${4:-$2}" <<'PY'
import json,sys
p=json.load(open(sys.argv[1])); n,k,m=int(sys.argv[2]),int(sys.argv[3]),int(sys.argv[4]); out=[]
for s in p["scenes"][n-1:m]:
    a,d=s["from"],s["durationInFrames"]
    out+= [str(a+int(d*(j+0.5)/k)) for j in range(k)]
print(" ".join(out))
PY
)
$(dirname "$0")/snap.sh "$1" $FR
