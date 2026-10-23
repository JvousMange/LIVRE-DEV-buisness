"""Bruitages papier synthétisés (numpy) + mixage avec la voix -> mix.wav (48 kHz stéréo).
Usage : audio.py <sfx.json> <voice.wav 48k mono> <mix.wav>      (pas de musique de fond)
Chaque son est généré à partir de grains de bruit filtrés, de résonances et d'enveloppes, avec variation de hauteur,
panoramique et petite réverbération de pièce. Les événements viennent de web/sfx_map.js (calés sur les gestes à l'image)."""
import json, sys, wave, os
import numpy as np

SR = 48000
sfxj = json.load(open(sys.argv[1])); voice_path = sys.argv[2]; out = sys.argv[3]
total = sfxj["total"]; N = int(total * SR) + SR
rng = np.random.default_rng(5)

# ---------- outils ----------
def t_(n): return np.arange(n) / SR
def bp(x, lo, hi):
    """passe-bande par FFT avec flancs doux"""
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR)
    m = np.clip((f - lo) / (lo * .35 + 1), 0, 1) * np.clip((hi - f) / (hi * .35 + 1), 0, 1)
    return np.fft.irfft(X * m, len(x)).astype(np.float32)
def noise(n): return rng.normal(0, 1, n).astype(np.float32)
def env_ad(n, a, d): t = t_(n); return np.minimum(t / max(a, 1e-4), 1) * np.exp(-t / d)
def gauss(n, c, w): t = np.linspace(0, 1, n); return np.exp(-((t - c) / w) ** 2)
IR = None
def reverb(x, wet=.14, t60=.45):
    global IR
    if IR is None:
        n = int(t60 * SR); ir = noise(n) * np.exp(-t_(n) * 6.9 / t60); ir = bp(ir, 250, 6500); IR = ir / np.sqrt((ir ** 2).sum())
    L = len(x) + len(IR); n2 = 1 << (L - 1).bit_length()
    y = np.fft.irfft(np.fft.rfft(x, n2) * np.fft.rfft(IR, n2), n2)[:L].astype(np.float32)
    return np.concatenate([x, np.zeros(len(IR), np.float32)]) * (1 - wet * .4) + y * wet * 2.2
def norm(x, peak): return x / (np.abs(x).max() + 1e-9) * peak
PENTA = [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5]   # do ré mi sol la do : les « pop » forment une petite mélodie

# ---------- sons ----------
def s_paper(r):  # froissement : grains de bruit aigus, de moins en moins denses
    n = int(.26 * SR); x = np.zeros(n, np.float32); k = r.integers(9, 15)
    for i in range(k):
        st = int(abs(r.normal(0, .07)) * SR); g = int(r.uniform(.003, .009) * SR)
        if st + g >= n: continue
        x[st:st + g] += noise(g) * np.hanning(g) * r.uniform(.4, 1)
    return norm(bp(x, 2200, 9500), .6), .16
def s_flip(r):   # page qui claque
    n = int(.16 * SR); x = bp(noise(n), 1800, 8000) * env_ad(n, .002, .03); y = np.sin(2 * np.pi * 380 * t_(n)) * np.exp(-t_(n) / .018) * .5
    return norm(x + y, .7), .2
def s_pop(r, o=None):  # « bloup » de bulle, hauteur sur une gamme pentatonique
    f0 = PENTA[(o if o is not None else r.integers(0, 5)) % 6] * .5; n = int(.2 * SR); t = t_(n)
    f = f0 * (1 + 1.1 * (1 - np.exp(-t / .016))); ph = 2 * np.pi * np.cumsum(f) / SR
    x = (np.sin(ph) + .25 * np.sin(2 * ph)) * env_ad(n, .003, .05) + bp(noise(n), 1500, 5000) * np.exp(-t / .004) * .15
    return norm(x, .8), .2
def s_tap(r):    # tampon léger sur le carton
    n = int(.14 * SR); t = t_(n); x = np.sin(2 * np.pi * (150 - 40 * (1 - np.exp(-t / .02))) * t) * np.exp(-t / .045) + bp(noise(n), 1200, 4200) * np.exp(-t / .006) * .5
    return norm(x, .8), .28
def s_thud(r):   # objet qui retombe
    n = int(.3 * SR); t = t_(n); f = 110 - 45 * (1 - np.exp(-t / .03)); x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / .09) + bp(noise(n), 500, 2400) * np.exp(-t / .012) * .55 + np.sin(2 * np.pi * 310 * t) * np.exp(-t / .05) * .25
    return norm(x, .85), .34
def s_stamp(r):  # gros tampon : choc grave + claque papier
    n = int(.42 * SR); t = t_(n); f = 88 - 38 * (1 - np.exp(-t / .04)); x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / .14) * 1.0 + bp(noise(n), 700, 3000) * np.exp(-t / .016) * .7 + np.sin(2 * np.pi * 220 * t) * np.exp(-t / .07) * .3
    return norm(x, .9), .42
def s_tick(r):   # claquette bois
    n = int(.09 * SR); t = t_(n); x = (np.sin(2 * np.pi * 1180 * t) * np.exp(-t / .022) + .7 * np.sin(2 * np.pi * 1760 * t) * np.exp(-t / .014)) + bp(noise(n), 3000, 9000) * np.exp(-t / .002) * .4
    return norm(x, .6), .22
def s_whoosh(r):  # souffle de papier qui passe, balayage d'aigus
    n = int(.6 * SR); x = np.zeros(n, np.float32)
    for lo, hi, c in ((250, 900, .3), (800, 2400, .5), (2200, 6500, .7)): x += bp(noise(n), lo, hi) * gauss(n, c, .2)
    return norm(x, .6), .22
def s_slide(r):   # glissement de feuille
    n = int(.34 * SR); x = bp(noise(n), 500, 3800) * gauss(n, .5, .3) + bp(noise(n), 3500, 9000) * gauss(n, .55, .2) * .3
    return norm(x, .55), .2
def s_tear(r):    # déchirure : craquements de fibres
    n = int(.55 * SR); x = np.zeros(n, np.float32); t = np.linspace(0, 1, n)
    for i in range(int(90 + 60 * r.random())):
        st = int(r.random() ** 1.3 * n); g = int(r.uniform(.0008, .004) * SR)
        if st + g < n: x[st:st + g] += noise(g) * r.uniform(.3, 1)
    x = bp(x, 1800, 9000) * .7 + bp(noise(n), 700, 2600) * gauss(n, .5, .35) * .35
    return norm(x * np.sin(np.pi * np.clip(t, 0, 1)) ** .5, .65), .2
def s_rub(r):     # frottement répétitif
    n = int(.55 * SR); t = t_(n); x = bp(noise(n), 1200, 7000) * (.55 + .45 * np.abs(np.sin(2 * np.pi * 5.5 * t))) * np.sin(np.pi * np.linspace(0, 1, n)) ** .6
    return norm(x, .5), .16
def s_ding(r, o=None):   # petit glockenspiel
    f = PENTA[(o if o is not None else r.integers(0, 5)) % 6] * 2; n = int(1.1 * SR); t = t_(n)
    x = sum(a * np.sin(2 * np.pi * f * m * t) * np.exp(-t / d) for m, a, d in ((1, 1, .45), (2.76, .35, .2), (5.4, .12, .09))) * np.minimum(t / .002, 1)
    return norm(x, .6), .17
GEN = dict(paper=s_paper, flip=s_flip, pop=s_pop, tap=s_tap, thud=s_thud, stamp=s_stamp, tick=s_tick, whoosh=s_whoosh, slide=s_slide, tear=s_tear, rub=s_rub, ding=s_ding)
GAINS = dict(paper=.6, flip=.5, pop=.5, tap=.55, thud=.5, stamp=.5, tick=.5, whoosh=.45, slide=.45, tear=.5, rub=.45, ding=.5)   # sons plus discrets
WET = dict(pop=.16, ding=.22, stamp=.12, thud=.1, whoosh=.12, slide=.08, flip=.06, tap=.08, tick=.05, paper=.05, tear=.05, rub=.04)

sfx = np.zeros((N, 2), np.float32)
for k, ev in enumerate(sfxj["sfx"]):
    r = np.random.default_rng(100 + k); ty = ev["type"]; f = GEN[ty]
    x, gain = (f(r, ev.get("opt")) if ty in ("pop", "ding") else f(r))
    x = reverb(x.astype(np.float32), WET.get(ty, .08)) * gain * GAINS.get(ty, .5) * (.55 if ev.get('opt') == 'soft' else 1) * r.uniform(.85, 1.0)
    pan = r.uniform(-.35, .35) if ty not in ("whoosh", "slide") else 0
    if ty in ("whoosh", "slide"):
        w = np.linspace(-.7, .7, len(x)) * (1 if r.random() < .5 else -1); gl, gr = np.sqrt((1 - w) / 2), np.sqrt((1 + w) / 2)
    else: gl, gr = np.sqrt((1 - pan) / 2), np.sqrt((1 + pan) / 2)
    i = int(max(ev["t"] - .01, 0) * SR); m = min(len(x), N - i)
    sfx[i:i + m, 0] += x[:m] * gl; sfx[i:i + m, 1] += x[:m] * gr

# ---------- voix + ducking ----------
w = wave.open(voice_path); v = np.frombuffer(w.readframes(w.getnframes()), "<i2").astype(np.float32) / 32768; assert w.getframerate() == SR
voice = np.zeros(N, np.float32); voice[:len(v)] = v[:N]
def ma(x, k):
    c = np.cumsum(np.insert(x, 0, 0)); y = (c[k:] - c[:-k]) / k; return np.concatenate([np.full(k // 2, y[0]), y, np.full(k - k // 2 - 1, y[-1])])[:len(x)]
m = np.clip((ma(np.abs(voice), int(.03 * SR)) - .008) / .03, 0, 1); m = np.clip(ma(m, int(.15 * SR)) * 1.6, 0, 1)
MUSIC_DB = float(os.environ.get("MUSIC_DB", "-33"))
bed = 0
if MUSIC_DB > -90:
    sys.path.insert(0, os.path.dirname(__file__)); import music
    mus = music.make(total, SR, reverb, os.environ.get('MUSIC_STYLE', 'ambient'))                         # stéréo (N0,2), niveau RMS normalisé à 0 dBFS
    g = 10 ** (MUSIC_DB / 20); bed = np.zeros((N, 2), np.float32); n0 = min(N, len(mus))
    bed[:n0] = mus[:n0] * g * (1 - .6 * m[:n0])[:, None]     # la musique s'efface quand la voix parle
mix = np.stack([voice * .92, voice * .92], 1) + sfx * (1 - .5 * m)[:, None] + bed
mix = np.tanh(mix * 1.05) / np.tanh(1.05); mix = mix / max(np.abs(mix).max(), 1e-6) * .93
with wave.open(out, "wb") as o: o.setnchannels(2); o.setsampwidth(2); o.setframerate(SR); o.writeframes((mix * 32767).astype("<i2").tobytes())
print("mix ok", round(N / SR, 1), "s,", len(sfxj["sfx"]), "bruitages")
