"""Synthèse voix off FR (sherpa-onnx + Piper siwis) -> voice.wav + timeline.json (mots alignés)."""
import json, sys, glob, re, wave
import numpy as np
import sherpa_onnx

MODEL_DIR = sys.argv[1]
OUT = sys.argv[2]
SPEED = float(sys.argv[3]) if len(sys.argv) > 3 else 1.0
SR_OUT = 22050

cfg = sherpa_onnx.OfflineTtsConfig(model=sherpa_onnx.OfflineTtsModelConfig(
    vits=sherpa_onnx.OfflineTtsVitsModelConfig(
        model=f"{MODEL_DIR}/fr_FR-siwis-medium.onnx", tokens=f"{MODEL_DIR}/tokens.txt",
        data_dir=f"{MODEL_DIR}/espeak-ng-data"), num_threads=4))
tts = sherpa_onnx.OfflineTts(cfg)

def synth(text):
    a = tts.generate(text, sid=0, speed=SPEED)
    x = np.array(a.samples, dtype=np.float32)
    assert a.sample_rate == SR_OUT
    thr = 0.012
    idx = np.where(np.abs(x) > thr)[0]
    x = x[max(idx[0] - int(0.02 * SR_OUT), 0): idx[-1] + int(0.04 * SR_OUT)]
    return x

# durée parlée approx. d'un mot de sous-titre (pour répartir le temps)
NUM = {"10 %": "dix pour cent", "5 %": "cinq pour cent", "94 %": "quatre-vingt-quatorze pour cent",
       "2": "deux", "1": "un", "MELA": "méla", "SKIN": "skine"}
def weight(tok):
    t = NUM.get(tok, tok)
    syl = len(re.findall(r"[aeiouyàâéèêëîïôûùœ]+", t.lower())) or 1
    w = syl * 1.0 + len(t) * 0.18
    if tok.endswith((",", ":")): w += 0.9
    if tok.endswith((".", "?")): w += 0.4
    return w

def tokens(cap):
    cap = cap.replace(" %", " %")
    raw = cap.split(" ")
    out = []
    for r in raw:
        if r == ":" and out: out[-1] += " :"
        elif r == "?" and out: out[-1] += " ?"
        else: out.append(r)
    return [t.replace(" ", " ") for t in out]

script = json.load(open("script.json"))
T0 = 0.18
cursor = int(T0 * SR_OUT)
chunks = [np.zeros(cursor, dtype=np.float32)]
timeline = []
for b in script["beats"]:
    beat = {"id": b["id"], "sentences": []}
    for s in b["sentences"]:
        x = synth(s["say"])
        st = cursor / SR_OUT
        chunks.append(x); cursor += len(x)
        en = cursor / SR_OUT
        toks = tokens(s["cap"])
        ws = np.array([weight(t) for t in toks]); ws = ws / ws.sum()
        t = st; words = []
        for tk, w in zip(toks, ws):
            d = (en - st) * w
            words.append({"w": tk.replace(" %", " %"), "start": round(t, 3), "end": round(t + d, 3)}); t += d
        gap = 0.30 if s["cap"].endswith("?") else (0.24 if s["cap"].endswith(".") else 0.1)
        chunks.append(np.zeros(int(gap * SR_OUT), dtype=np.float32)); cursor += int(gap * SR_OUT)
        beat["sentences"].append({"start": round(st, 3), "end": round(en, 3), "words": words})
    beat["start"] = beat["sentences"][0]["start"]; beat["end"] = beat["sentences"][-1]["end"]
    chunks.append(np.zeros(int(0.12 * SR_OUT), dtype=np.float32)); cursor += int(0.12 * SR_OUT)
    timeline.append(beat)

y = np.concatenate(chunks)
y = y / max(np.abs(y).max(), 1e-6) * 0.89
with wave.open(f"{OUT}/voice.wav", "wb") as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR_OUT); w.writeframes((y * 32767).astype("<i2").tobytes())
json.dump({"duration": round(len(y) / SR_OUT, 3), "beats": timeline}, open(f"{OUT}/timeline.json", "w"), ensure_ascii=False, indent=1)
print("durée voix", round(len(y) / SR_OUT, 1), "s")
for bt in timeline: print(bt["id"], bt["start"], bt["end"])
