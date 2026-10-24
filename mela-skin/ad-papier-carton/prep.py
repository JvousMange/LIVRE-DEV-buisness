"""Prépare le projet Remotion : plan, sous-titres, liste des scènes, coupes, voix. Usage : python3 prep.py PROJET voix.mp3"""
import json, math, os, subprocess, sys
from data import DURATION
from timing import STARTS, ENDS, captions

proj, mp3 = sys.argv[1], sys.argv[2]
FPS = 30
CUTS = {"S03": {"kind": "zoomThrough"}, "S06": {"kind": "whip"}, "S11": {"kind": "tapePull"}, "S13": {"kind": "zoomThrough"},
        "S16": {"kind": "whip"}, "S19": {"kind": "whip"}, "S28": {"kind": "whip"}, "S37": {"kind": "pageTurn"},
        "S41": {"kind": "stampCut"}, "S43": {"kind": "whip"}}
total = math.ceil(DURATION * FPS)
scenes = []
for i in range(1, 44):
    a = round(STARTS[i - 1] * FPS)
    b = round(ENDS[i - 1] * FPS) if i < 43 else total
    scenes.append({"id": "S%02d" % i, "from": a, "durationInFrames": b - a, "words": []})
json.dump({"fps": FPS, "durationInFrames": total, "scenes": scenes}, open(os.path.join(proj, "src/plan.json"), "w"))
os.makedirs(os.path.join(proj, "public/vo"), exist_ok=True)
json.dump(captions(), open(os.path.join(proj, "public/vo/captions.json"), "w"), ensure_ascii=False)
subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", mp3, "-ar", "48000", "-ac", "2", os.path.join(proj, "public/vo/voiceover.wav")], check=True)
ep = json.load(open(os.path.join(proj, "episode.json")))
ep["cuts"] = CUTS
json.dump(ep, open(os.path.join(proj, "episode.json"), "w"), indent=1)
open(os.path.join(proj, "src/film/scenes.ts"), "w").write(
    "import React from 'react';\nimport {FilmScene} from './FilmScene';\n\nexport const SCENES = [\n" +
    "".join(f"  {{id: 'S{i:02d}', component: (() => React.createElement(FilmScene, {{id: 'S{i:02d}'}})) as React.FC}},\n" for i in range(1, 44)) + "];\n")
print("prep ok:", total, "frames")
