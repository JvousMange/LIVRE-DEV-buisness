"""v3/align.json (ElevenLabs forced alignment) -> v3/timeline.json + web/timeline_v3.js + v3/voice.wav"""
import json, subprocess, wave, numpy as np
al = json.load(open("v3/align.json"))
toks = []
for w in al["words"]:
    t = w["text"].strip()
    if not t: continue
    if t in (":", "?", "!") and toks: toks[-1]["w"] += " " + t; toks[-1]["end"] = w["end"]; continue
    toks.append({"w": t, "start": w["start"], "end": w["end"]})
sents, cur = [], []
for k in toks:
    cur.append(k)
    if k["w"].rstrip().endswith((".", "?")): sents.append(cur); cur = []
if cur: sents.append(cur)
beats = [{"id": "all", "sentences": [{"start": round(s[0]["start"], 3), "end": round(s[-1]["end"], 3),
    "words": [{"w": k["w"].replace(" ?", " ?").replace(" :", " :"), "start": round(k["start"], 3), "end": round(k["end"], 3)} for k in s]} for s in sents]}]
SR = 48000
x = np.frombuffer(subprocess.run(["ffmpeg", "-v", "error", "-i", "v3/voix.mp3", "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True, check=True).stdout, np.float32).copy()
y = np.concatenate([x, np.zeros(int(.3 * SR), np.float32)]); y = y / max(np.abs(y).max(), 1e-6) * .89
with wave.open("v3/voice.wav", "wb") as w: w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((y * 32767).astype("<i2").tobytes())
tl = {"duration": round(len(y) / SR, 3), "beats": beats}
json.dump(tl, open("v3/timeline.json", "w"), ensure_ascii=False, indent=1)
open("web/timeline_v3.js", "w").write("const TL=" + json.dumps(tl, ensure_ascii=False) + ";")
for i, s in enumerate(beats[0]["sentences"]):
    print(i, s["start"], " ".join(f"{j}:{w['w']}" for j, w in enumerate(s["words"])) if i in (1,2,5,6,11,14,16,18,21,28,30) else "")
