"""Voix off FR : plusieurs moteurs + humanisation. Écrit <out>/voice.wav (48 kHz mono) et <out>/timeline.json (mots alignés).
Usage : voice2.py <engine> <out_dir> [--human] [--speed=1.0] [--only=beat1,beat2] [--script=script.json]
engine : piper:siwis | piper:upmc0 | piper:upmc1 | piper:tom | kokoro:30
Variables : MODELS = dossier contenant les modèles (sous-dossiers vits-piper-fr_FR-*, kokoro-multi-lang-v1_0)."""
import json, sys, os, re, subprocess, wave
import numpy as np
sys.path.insert(0, os.path.dirname(__file__))
import tts_engines as T

eng, out = sys.argv[1], sys.argv[2]
opt = dict(a.lstrip("-").split("=", 1) if "=" in a else (a.lstrip("-"), "1") for a in sys.argv[3:])
human = "human" in opt; speed = float(opt.get("speed", 1.0)); only = opt.get("only", ""); script_path = opt.get("script", "script.json")
M = os.environ["MODELS"]; os.makedirs(out, exist_ok=True)
kind, arg = eng.split(":")
if kind == "piper":
    name = {"siwis": ("vits-piper-fr_FR-siwis-medium", "fr_FR-siwis-medium", 0), "upmc0": ("vits-piper-fr_FR-upmc-medium", "fr_FR-upmc-medium", 0),
            "upmc1": ("vits-piper-fr_FR-upmc-medium", "fr_FR-upmc-medium", 1), "tom": ("vits-piper-fr_FR-tom-medium", "fr_FR-tom-medium", 0)}[arg]
    synth = T.piper(f"{M}/{name[0]}", name[1], name[2], speed)
else:
    synth = T.kokoro(f"{M}/kokoro-multi-lang-v1_0", int(arg), speed, "fr")
SR = 24000
rng = np.random.default_rng(11)

def resample(x, sr, to, factor=1.0):
    n = int(len(x) * to / sr / factor); idx = np.linspace(0, len(x) - 1, n); return np.interp(idx, np.arange(len(x)), x).astype(np.float32)
def trim(x, sr, thr=0.010):
    i = np.where(np.abs(x) > thr)[0]; return x[max(i[0] - int(.02 * sr), 0): i[-1] + int(.05 * sr)]
def breath(sr, dur=.22, lvl=.018):
    n = int(dur * sr); z = rng.normal(0, 1, n).astype(np.float32); k = np.cumsum(z); k = z - np.convolve(z, np.ones(40) / 40, "same")  # passe-haut grossier
    t = np.linspace(0, 1, n); e = np.sin(np.pi * t) ** 2 * (1 - .35 * t); return k * e * lvl / max(np.abs(k).max(), 1e-6) * 6

NUM = {"10 %": "dix pour cent", "5 %": "cinq pour cent", "94 %": "quatre-vingt-quatorze pour cent", "2": "deux", "1": "un", "MELA": "méla", "SKIN": "skine"}
def weight(tok):
    t = NUM.get(tok, tok); syl = len(re.findall(r"[aeiouyàâéèêëîïôûùœ]+", t.lower())) or 1
    w = syl + len(t) * .18
    if tok.endswith((",", ":")): w += .9
    if tok.endswith((".", "?")): w += .4
    return w
def tokens(cap):
    cap = cap.replace(" %", " %"); o = []
    for r in cap.split(" "):
        if r in (":", "?") and o: o[-1] += " " + r
        else: o.append(r)
    return [t.replace(" ", " ") for t in o]

script = json.load(open(script_path)); beats_in = [b for b in script["beats"] if not only or b["id"] in only.split(",")]
cursor = int(.18 * SR); chunks = [np.zeros(cursor, np.float32)]; timeline = []
for bi, b in enumerate(beats_in):
    beat = {"id": b["id"], "sentences": []}
    for si, s in enumerate(b["sentences"]):
        sp = 1.0
        if human: sp = 1 + rng.uniform(-.035, .035) + (.02 if s["cap"].endswith("?") else 0)
        x, sr = synth(s["say"]); x = trim(x, sr); x = resample(x, sr, SR, sp)
        if human:  # micro-variation de gain en fin de phrase (souffle qui retombe)
            n = len(x); x = x * np.concatenate([np.ones(int(n * .8), np.float32), np.linspace(1, .82, n - int(n * .8)).astype(np.float32)])
        gap_before = chunks[-1]
        if human and si == 0 and bi > 0 and len(gap_before) > int(.22 * SR):  # respiration dans le silence précédent
            br = breath(SR); st = len(gap_before) - len(br) - int(.04 * SR); gap_before[max(st, 0): max(st, 0) + len(br)] += br[: len(gap_before) - max(st, 0)]
        st_t = cursor / SR; chunks.append(x); cursor += len(x); en_t = cursor / SR
        toks = tokens(s["cap"]); ws = np.array([weight(t) for t in toks]); ws /= ws.sum(); t = st_t; words = []
        for tk, w in zip(toks, ws):
            d = (en_t - st_t) * w; words.append({"w": tk.replace(" %", " %"), "start": round(t, 3), "end": round(t + d, 3)}); t += d
        gap = (.30 if s["cap"].endswith("?") else .24 if s["cap"].endswith(".") else .1) * (1 + (rng.uniform(-.2, .25) if human else 0))
        chunks.append(np.zeros(int(gap * SR), np.float32)); cursor += int(gap * SR)
        beat["sentences"].append({"start": round(st_t, 3), "end": round(en_t, 3), "words": words})
    beat["start"] = beat["sentences"][0]["start"]; beat["end"] = beat["sentences"][-1]["end"]
    chunks.append(np.zeros(int(.12 * SR), np.float32)); cursor += int(.12 * SR); timeline.append(beat)
y = np.concatenate(chunks); y = y / max(np.abs(y).max(), 1e-6) * .89
raw = f"{out}/voice_raw.wav"
with wave.open(raw, "wb") as w: w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((y * 32767).astype("<i2").tobytes())
chain = "highpass=f=70,"
if human: chain += "equalizer=f=170:t=q:w=1:g=2.2,equalizer=f=3200:t=q:w=1.2:g=2.5,equalizer=f=9500:t=h:w=1:g=-3,aecho=0.85:0.9:28|55:0.10|0.05,"
chain += "acompressor=threshold=-21dB:ratio=3:attack=6:release=90,alimiter=limit=0.9"
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", raw, "-af", chain, "-ar", "48000", f"{out}/voice.wav"], check=True)
if human:  # bruit de pièce très léger sous la voix
    w = wave.open(f"{out}/voice.wav"); v = np.frombuffer(w.readframes(w.getnframes()), "<i2").astype(np.float32) / 32768; w.close()
    nz = np.convolve(rng.normal(0, 1, len(v)), np.ones(30) / 30, "same").astype(np.float32) * .0022; v = v + nz
    with wave.open(f"{out}/voice.wav", "wb") as o: o.setnchannels(1); o.setsampwidth(2); o.setframerate(48000); o.writeframes((np.clip(v, -1, 1) * 32767).astype("<i2").tobytes())
json.dump({"duration": round(len(y) / SR, 3), "beats": timeline}, open(f"{out}/timeline.json", "w"), ensure_ascii=False, indent=1)
print(eng, "human" if human else "plain", "durée", round(len(y) / SR, 1), "s")
