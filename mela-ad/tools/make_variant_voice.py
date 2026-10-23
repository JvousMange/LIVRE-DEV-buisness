"""Voix d'une variante : hook généré dans ElevenLabs (voix Marion) + corps de pub figé (body/corps_voix.flac) -> voice.wav + timeline.json.
Usage : make_variant_voice.py <id_hook> <dossier_sortie> [--model=eleven_v4]   (ELEVENLABS_API_KEY dans l'environnement)"""
import os, sys, re, json, base64, subprocess, wave, urllib.request, urllib.error
import numpy as np
hid, out = sys.argv[1], sys.argv[2]; opt = dict(a.lstrip("-").split("=", 1) for a in sys.argv[3:])
os.makedirs(out, exist_ok=True); SR = 48000
H = json.load(open("hooks.json")); hook = next(h for h in H["hooks"] if h["id"] == hid)
sents = hook["sentences"]            # le hook enchaîne directement sur le corps (« Cinq signes que… »)
text = " ".join(((s.get("tag", "") + " ") if s.get("tag") else "") + s["say"] for s in sents)
cache = f"{out}/hook.mp3"; txtf = f"{out}/hook.txt"
if not os.path.exists(cache) or opt.get("regen") or not os.path.exists(txtf) or open(txtf).read() != text:
    body = {"text": text, "model_id": opt.get("model", "eleven_v4"), "voice_settings": {"stability": .3, "similarity_boost": .75, "style": 0, "use_speaker_boost": True}}
    req = urllib.request.Request("https://api.elevenlabs.io/v1/text-to-speech/Pipj99NMS7t8dQEzyxgB/with-timestamps?output_format=mp3_44100_128", json.dumps(body).encode(), {"xi-api-key": os.environ["ELEVENLABS_API_KEY"], "Content-Type": "application/json"})
    try: r = json.load(urllib.request.urlopen(req, timeout=240))
    except urllib.error.HTTPError as e: sys.exit(f"HTTP {e.code}: {e.read().decode()[:300]}")
    open(cache, "wb").write(base64.b64decode(r["audio_base64"])); json.dump(r["alignment"], open(cache + ".alignment.json", "w")); open(txtf, "w").write(text)
al = json.load(open(cache + ".alignment.json")); AC, AS, AE = al["characters"], al["character_start_times_seconds"], al["character_end_times_seconds"]
def load(path):
    r = subprocess.run(["ffmpeg", "-v", "error", "-i", path, "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True, check=True); return np.frombuffer(r.stdout, np.float32).copy()
hx = load(cache); bx = load("body/corps_voix.flac")
# --- temps exacts des phrases / mots du hook (même méthode que align_voice) ---
NUM = {"10 %": "dix pour cent", "5 %": "cinq pour cent", "94 %": "quatre-vingt-quatorze pour cent", "2": "deux", "1": "un", "MELA": "méla", "SKIN": "skine"}
def weight(tok):
    t = NUM.get(tok, tok); syl = len(re.findall(r"[aeiouyàâéèêëîïôûùœ]+", t.lower())) or 1; w = syl + len(t) * .18
    if tok.endswith((",", ":")): w += .9
    if tok.endswith((".", "?")): w += .4
    return w
def tokens(cap):
    o = []
    for r in cap.split(" "):
        if r in (":", "?") and o: o[-1] += " " + r
        else: o.append(r)
    return o
clean, idx, intag = [], [], False
for k, c in enumerate(AC):
    if c == "[": intag = True
    if intag:
        if c == "]": intag = False
        continue
    c2 = " " if c.isspace() else c
    if c2 == " " and (not clean or clean[-1] == " "): continue
    clean.append(c2); idx.append(k)
clean = "".join(clean); cur = 0; hs = []
for sn in sents:
    say = re.sub(r"\s+", " ", sn["say"]).strip(); pos = clean.find(say, cur)
    if pos < 0: sys.exit("Phrase introuvable dans l'alignement : " + say[:50])
    hs.append((pos, len(say))); cur = pos + len(say)
t_first = AS[idx[hs[0][0]]]; t_last = AE[idx[hs[-1][0] + hs[-1][1] - 1]]
LEAD = .18; cut0 = max(t_first - .03, 0); shift = LEAD - cut0
timeline_hook = {"id": "hook", "sentences": []}
for sn, (pos, ln) in zip(sents, hs):
    toks = tokens(sn["cap"]); ws = np.array([weight(t) for t in toks]); cum = np.concatenate([[0], np.cumsum(ws) / ws.sum()]) * ln
    spaces = [i for i, c in enumerate(clean[pos: pos + ln]) if c == " "]
    def snap(v):
        if v <= 0: return 0
        if v >= ln: return ln
        c = min(spaces, key=lambda q: abs(q - v), default=None); return c + 1 if c is not None and abs(c - v) <= 4 else int(round(v))
    bnd = [snap(v) for v in cum]; bnd[0] = 0; bnd[-1] = ln
    tm = lambda ci, end=False: (AE if end else AS)[idx[pos + max(0, min(ln - 1, ci - (1 if end else 0)))]] + shift
    words = []
    for i, tk in enumerate(toks):
        a, b = tm(bnd[i]), tm(bnd[i + 1], True)
        if b <= a: b = a + .05
        words.append({"w": tk, "start": round(a, 3), "end": round(b, 3)})
    timeline_hook["sentences"].append({"start": round(AS[idx[pos]] + shift, 3), "end": round(AE[idx[pos + ln - 1]] + shift, 3), "words": words})
timeline_hook["start"] = timeline_hook["sentences"][0]["start"]; timeline_hook["end"] = timeline_hook["sentences"][-1]["end"]
# --- audio : hook (niveau ajusté sur le corps) + silence + corps ---
seg = hx[int(cut0 * SR): int((t_last + .06) * SR)].copy()
rms = lambda a: float(np.sqrt((a[np.abs(a) > .01] ** 2).mean()))
seg *= rms(bx) / rms(seg)
fo = int(.02 * SR); seg[-fo:] *= np.linspace(1, 0, fo, dtype=np.float32); bx = bx.copy(); bx[:fo] *= np.linspace(0, 1, fo, dtype=np.float32)
GAP = .16; hook_end_in_out = LEAD + len(seg) / SR; body_off = hook_end_in_out + GAP
voice = np.concatenate([np.zeros(int(LEAD * SR), np.float32), seg, np.zeros(int(GAP * SR), np.float32), bx])
voice = voice / max(np.abs(voice).max(), 1e-6) * .89
body = json.load(open("body/corps_timeline.json")); beats = [timeline_hook]
for b in body["beats"]:
    nb = json.loads(json.dumps(b))
    for s in nb["sentences"]:
        s["start"] = round(s["start"] + body_off, 3); s["end"] = round(s["end"] + body_off, 3)
        for w in s["words"]: w["start"] = round(w["start"] + body_off, 3); w["end"] = round(w["end"] + body_off, 3)
    nb["start"] = nb["sentences"][0]["start"]; nb["end"] = nb["sentences"][-1]["end"]; beats.append(nb)
with wave.open(f"{out}/voice.wav", "wb") as w: w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((voice * 32767).astype("<i2").tobytes())
json.dump({"duration": round(len(voice) / SR, 3), "beats": beats}, open(f"{out}/timeline.json", "w"), ensure_ascii=False, indent=1)
print(f"hook {hid} : {round(hook_end_in_out - LEAD, 1)} s de hook, voix totale {round(len(voice) / SR, 1)} s")
