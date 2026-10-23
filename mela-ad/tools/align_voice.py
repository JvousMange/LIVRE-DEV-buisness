"""Aligne une voix off externe (ElevenLabs, enregistrement…) sur script.json.
Entrée : un fichier audio (toute la voix off) OU un dossier de fichiers (un par bloc, triés par nom).
Sortie : <out>/voice.wav (48 kHz mono, départ à 0,18 s) + <out>/timeline.json (même format que voice2.py).
Principe : découpe aux silences -> transcription de chaque morceau (Whisper local) -> programmation dynamique pour
rattacher les morceaux aux phrases du script -> durée des mots répartie à l'intérieur de la phrase.
Variables : ASR_MODEL = dossier sherpa-onnx-whisper-small."""
import sys, os, re, json, glob, subprocess, difflib, wave
import numpy as np
import sherpa_onnx

inp, out = sys.argv[1], sys.argv[2]
script_path = next((a.split("=", 1)[1] for a in sys.argv[3:] if a.startswith("--script=")), "script.json")
SR = 48000
os.makedirs(out, exist_ok=True)

TEMPO = float(os.environ.get("VOICE_TEMPO", "1.0"))  # < 1 : voix plus lente (hauteur conservée)
def load(path):
    af = [] if abs(TEMPO - 1) < 1e-3 else ["-af", f"rubberband=tempo={TEMPO}:formant=preserved"]
    r = subprocess.run(["ffmpeg", "-v", "error", "-i", path] + af + ["-ac", "1", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True, check=True)
    return np.frombuffer(r.stdout, np.float32).copy()

if os.path.isdir(inp):
    files = sorted(f for f in glob.glob(inp + "/*") if f.lower().endswith((".mp3", ".wav", ".m4a", ".ogg", ".flac")))
    parts = []
    for f in files: parts += [load(f), np.zeros(int(.45 * SR), np.float32)]
    x = np.concatenate(parts)
else:
    x = load(inp)

# --- silences ---
hop = int(.01 * SR); n = len(x) // hop
rms = np.sqrt(np.convolve(x[: n * hop] ** 2, np.ones(hop) / hop, "valid")[::hop][:n] + 1e-12)
db = 20 * np.log10(rms + 1e-9); thr = np.percentile(db, 92) - 34
voiced = db > thr
def runs(mask):
    r, s = [], None
    for i, v in enumerate(mask):
        if v and s is None: s = i
        if not v and s is not None: r.append((s, i)); s = None
    if s is not None: r.append((s, len(mask)))
    return r
def chunks_for(min_pause):
    sp = runs(voiced); merged = []
    for a, b in sp:
        if merged and (a - merged[-1][1]) * .01 < min_pause: merged[-1] = (merged[-1][0], b)
        else: merged.append((a, b))
    return [(a * .01, b * .01) for a, b in merged if (b - a) * .01 > .12]

script = json.load(open(script_path))
sents = [(b["id"], s) for b in script["beats"] for s in b["sentences"]]
S = len(sents)

def norm(t):
    t = t.lower().replace("%", " pour cent ")
    for k, v in {"94": "quatre vingt quatorze", "90": "quatre vingt dix", "10": "dix", "5": "cinq", "2": "deux", "1": "un"}.items(): t = re.sub(rf"\b{k}\b", v, t)
    t = re.sub(r"[-’']", " ", t); t = re.sub(r"[^a-zàâäéèêëîïôöùûüç ]", " ", t); return re.sub(r"\s+", " ", t).strip()

NUM = {"10 %": "dix pour cent", "5 %": "cinq pour cent", "94 %": "quatre-vingt-quatorze pour cent", "2": "deux", "1": "un", "MELA": "méla", "SKIN": "skine"}
def weight(tok):
    t = NUM.get(tok, tok); syl = len(re.findall(r"[aeiouyàâéèêëîïôûùœ]+", t.lower())) or 1; w = syl + len(t) * .18
    if tok.endswith((",", ":")): w += .9
    if tok.endswith((".", "?")): w += .4
    return w
def tokens(cap):
    cap = cap.replace(" %", " %"); o = []
    for r in cap.split(" "):
        if r in (":", "?") and o: o[-1] += " " + r
        else: o.append(r)
    return [t.replace(" ", " ") for t in o]

EXACT = None
if os.path.isfile(inp + ".alignment.json"):   # horodatage caractère par caractère fourni par ElevenLabs : exact, sans ASR
    al = json.load(open(inp + ".alignment.json")); AC = al["characters"]; AS = al["character_start_times_seconds"]; AE = al["character_end_times_seconds"]
    clean, idx, intag = [], [], False
    for k, c in enumerate(AC):
        if c == "[": intag = True
        if intag:
            if c == "]": intag = False
            continue
        c2 = " " if c.isspace() else c
        if c2 == " " and (not clean or clean[-1] == " "): continue
        clean.append(c2); idx.append(k)
    clean = "".join(clean); EXACT = []; cur = 0
    for (bid, sn) in sents:
        say = re.sub(r"\s+", " ", sn["say"]).strip(); pos = clean.find(say, cur)
        if pos < 0: sys.exit("Phrase introuvable dans le texte envoyé à ElevenLabs : " + say[:60])
        EXACT.append((pos, len(say))); cur = pos + len(say)
    print("alignement exact ElevenLabs :", len(EXACT), "phrases")
rec = None
if EXACT is None:
    d = os.environ["ASR_MODEL"]
    rec = sherpa_onnx.OfflineRecognizer.from_whisper(encoder=d + "/small-encoder.int8.onnx", decoder=d + "/small-decoder.int8.onnx", tokens=d + "/small-tokens.txt", language="fr", task="transcribe", num_threads=4)
def asr(a, b):
    seg = x[int(max(a - .08, 0) * SR): int((b + .12) * SR)]
    st = rec.create_stream(); st.accept_waveform(SR, seg); rec.decode_stream(st); return st.result.text.strip()

if EXACT is not None:
    sc_t = 1.0 / TEMPO
    t0 = AS[idx[EXACT[0][0]]] * sc_t - .02; shift = .18 - t0
    timeline = {}; order = []
    for (bid, sn), (pos, ln) in zip(sents, EXACT):
        a, b = AS[idx[pos]] * sc_t + shift, AE[idx[pos + ln - 1]] * sc_t + shift
        toks = tokens(sn["cap"]); ws = np.array([weight(t) for t in toks]); cum = np.concatenate([[0], np.cumsum(ws) / ws.sum()]) * ln
        spaces = [i for i, c in enumerate(clean[pos: pos + ln]) if c == " "]
        def snap(v):
            if v <= 0: return 0
            if v >= ln: return ln
            c = min(spaces, key=lambda q: abs(q - v), default=None)
            return c + 1 if c is not None and abs(c - v) <= 4 else int(round(v))
        bnd = [snap(v) for v in cum]; bnd[0] = 0; bnd[-1] = ln
        def tm(ci, end=False):
            ci = max(0, min(ln - 1, ci - (1 if end else 0))); k = idx[pos + ci]
            return (AE[k] if end else AS[k]) * sc_t + shift
        words = []
        for i, tk in enumerate(toks):
            st_, en_ = tm(bnd[i]), tm(bnd[i + 1], True)
            if en_ <= st_: en_ = st_ + .05
            words.append({"w": tk.replace(" %", "\u00a0%"), "start": round(st_, 3), "end": round(en_, 3)})
        sen = {"start": round(a, 3), "end": round(b, 3), "words": words}
        if bid not in timeline: timeline[bid] = {"id": bid, "sentences": []}; order.append(bid)
        timeline[bid]["sentences"].append(sen)
    beats = []
    for bid in order: b = timeline[bid]; b["start"] = b["sentences"][0]["start"]; b["end"] = b["sentences"][-1]["end"]; beats.append(b)
    y = np.concatenate([np.zeros(int(.18 * SR), np.float32), x[int(max(t0, 0) * SR):], np.zeros(int(.3 * SR), np.float32)])
    y = y / max(np.abs(y).max(), 1e-6) * .89
    with wave.open(f"{out}/voice.wav", "wb") as w: w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((y * 32767).astype("<i2").tobytes())
    json.dump({"duration": round(len(y) / SR, 3), "beats": beats}, open(f"{out}/timeline.json", "w"), ensure_ascii=False, indent=1)
    print("voix alignée (exact) :", round(len(y) / SR, 1), "s,", len(beats), "blocs"); sys.exit(0)
best = None
for mp in (.30, .22, .16, .12):
    ch = chunks_for(mp)
    if len(ch) >= S: best = ch; break
    best = ch
ch = best; C = len(ch); print(f"{C} morceaux pour {S} phrases")
txt = [norm(asr(a, b)) for a, b in ch]
ref = [norm(s["say"]) for _, s in sents]
G = 7; NEG = -1e9
dp = np.full((S + 1, C + 1), NEG); back = np.zeros((S + 1, C + 1), int); dp[0, 0] = 0
for i in range(1, S + 1):
    for j in range(i, C + 1):
        for g in range(1, min(G, j) + 1):
            if dp[i - 1, j - g] <= NEG / 2: continue
            sc = difflib.SequenceMatcher(None, " ".join(txt[j - g: j]), ref[i - 1]).ratio()
            if dp[i - 1, j - g] + sc > dp[i, j]: dp[i, j] = dp[i - 1, j - g] + sc; back[i, j] = g
if dp[S, C] <= NEG / 2: sys.exit("Alignement impossible : moins de morceaux que de phrases. Vérifie que les pauses entre phrases sont audibles.")
groups = []; j = C
for i in range(S, 0, -1): g = back[i, j]; groups.append(list(range(j - g, j))); j -= g
groups.reverse()
print("score moyen de correspondance :", round(dp[S, C] / S, 2))

t0 = ch[groups[0][0]][0] - .02; shift = .18 - t0
timeline = {}; order = []
for (bid, s), gr in zip(sents, groups):
    spans = [ch[k] for k in gr]; tot = sum(b - a for a, b in spans)
    toks = tokens(s["cap"]); ws = np.array([weight(t) for t in toks]); cum = np.concatenate([[0], np.cumsum(ws) / ws.sum()]) * tot
    def at(off):
        for a, b in spans:
            if off <= b - a + 1e-9: return a + off
            off -= b - a
        return spans[-1][1]
    words = [{"w": tk.replace(" %", " %"), "start": round(at(cum[i]) + shift, 3), "end": round(at(cum[i + 1]) + shift, 3)} for i, tk in enumerate(toks)]
    sen = {"start": round(spans[0][0] + shift, 3), "end": round(spans[-1][1] + shift, 3), "words": words}
    if bid not in timeline: timeline[bid] = {"id": bid, "sentences": []}; order.append(bid)
    timeline[bid]["sentences"].append(sen)
beats = []
for bid in order: b = timeline[bid]; b["start"] = b["sentences"][0]["start"]; b["end"] = b["sentences"][-1]["end"]; beats.append(b)
y = np.concatenate([np.zeros(int(.18 * SR), np.float32), x[int(max(t0, 0) * SR):], np.zeros(int(.3 * SR), np.float32)])
y = y / max(np.abs(y).max(), 1e-6) * .89
with wave.open(f"{out}/voice.wav", "wb") as w: w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((y * 32767).astype("<i2").tobytes())
json.dump({"duration": round(len(y) / SR, 3), "beats": beats}, open(f"{out}/timeline.json", "w"), ensure_ascii=False, indent=1)
print("voix alignée :", round(len(y) / SR, 1), "s,", len(beats), "blocs")
