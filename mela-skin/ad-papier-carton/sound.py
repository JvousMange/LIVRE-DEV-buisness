"""Repères sonores calés sur les animations : bruitages du kit papercut + musique. Usage : python3 sound.py PROJET"""
import json, os, sys

proj = sys.argv[1]
man = json.load(open(os.path.join(proj, "public/layers/manifest.json")))
plan = json.load(open(os.path.join(proj, "src/plan.json")))
ep = json.load(open(os.path.join(proj, "episode.json")))
FPS = plan["fps"]
CUTSFX = {"zoomThrough": "zoom", "whip": "whip", "tapePull": "tape-peel", "pageTurn": "page-flip", "stampCut": "stamp"}
cues = []
for s in plan["scenes"]:
    sid, t0 = s["id"], s["from"] / FPS
    cut = ep.get("cuts", {}).get(sid)
    if cut:
        cues.append((t0, CUTSFX.get(cut["kind"], "whoosh")))
    seen = set()
    for a in man[sid]["acts"]:
        g, k, t = a["g"], a["k"], t0 + a["t"]
        big = g in ("num", "shield", "pct", "five", "x", "x1", "x2", "ninety", "lock", "tag") or g.startswith("x")
        if k == "fall":
            cues.append((t + a.get("d", 0.4), "stamp" if big else "thud"))
        elif k == "in" and a.get("how") == "none":
            pass
        elif k == "in" and a.get("stag"):
            if (g, "stag") not in seen:
                cues.append((t, "pop3")); seen.add((g, "stag"))
        elif k == "in" and a.get("how") in ("left", "right", "top", "bottom") and a.get("dist", 140) >= 600:
            cues.append((t, "slide"))
        elif k == "in" and g.startswith("sp"):
            if "sp" not in seen:
                cues.append((t, "sparkle")); seen.add("sp")
        elif k == "in":
            cues.append((t, "pop"))
        elif k == "wipe" and g in ("hand", "cloth", "eraser", "sponge", "scrub"):
            cues.append((t, "scribble"))
        elif k == "rot" and g == "lid":
            cues.append((t, "rip"))
        elif k == "spin" and g == "g1" and a.get("to") is not None:
            cues.append((t, "squash"))
cues.append((plan["durationInFrames"] / FPS - 1.3, "outro"))
cues.sort()
keep, last = [], {}
for t, ty in cues:                                   # pas deux fois le même son à moins de 0,13 s ; pas plus de 3 sons en 0,3 s
    if t - last.get(ty, -9) < 0.13:
        continue
    if sum(1 for x, _ in keep if t - x < 0.3) >= 3:
        continue
    keep.append((t, ty)); last[ty] = t
os.makedirs(os.path.join(proj, "tools"), exist_ok=True)
json.dump({"dur": plan["durationInFrames"] / FPS, "cues": [{"t": round(t, 3), "type": ty} for t, ty in keep]}, open(os.path.join(proj, "tools/cues.json"), "w"))
from collections import Counter
print(len(keep), "sons", dict(Counter(ty for _, ty in keep)))
