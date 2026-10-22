"""Bruitages papier + nappe pizz synthétisés (numpy) mixés avec la voix -> mix.wav (48 kHz stéréo)."""
import json, sys, wave, os
import numpy as np
SR = 48000
sfxj = json.load(open(sys.argv[1])); voice_path = sys.argv[2]; out = sys.argv[3]
total = sfxj["total"]; N = int(total * SR) + SR
rng = np.random.default_rng(3)
def env(n, a=.005, d=.2):
    t = np.arange(n) / SR; e = np.minimum(t / a, 1) * np.exp(-t / d); return e
def lp(x, k):  # lowpass 1 pôle
    y = np.zeros_like(x); s = 0.0
    for i in range(len(x)): s += k * (x[i] - s); y[i] = s
    return y
def bp_noise(n, lo, hi):
    x = rng.normal(0, 1, n); return x - lp(x, lo) if False else lp(x, hi) - lp(x, lo)
def paper(): n = int(.28 * SR); x = bp_noise(n, .03, .5) * env(n, .004, .07) * (1 + 0.8 * (rng.random(n) > .985)); return x * 1.5
def pop(): n = int(.12 * SR); t = np.arange(n) / SR; f = 700 * np.exp(-t * 18) + 180; return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, .002, .03) * .9
def whoosh(): n = int(.45 * SR); x = bp_noise(n, .01, .25); t = np.linspace(0, 1, n); return x * np.sin(np.pi * t) ** 2 * .9
def stamp(): n = int(.25 * SR); t = np.arange(n) / SR; return (np.sin(2 * np.pi * 85 * t) * np.exp(-t / .07) * 1.1 + bp_noise(n, .05, .6) * np.exp(-t / .015) * .8)
def tick(): n = int(.04 * SR); t = np.arange(n) / SR; return np.sin(2 * np.pi * 1900 * t) * np.exp(-t / .006) * .7
def tear(): n = int(.5 * SR); x = bp_noise(n, .02, .6) * (rng.random(n) > .5); return lp(x, .6) * env(n, .01, .25) * 2
def slide(): n = int(.3 * SR); x = bp_noise(n, .01, .12); t = np.linspace(0, 1, n); return x * np.sin(np.pi * t) * 1.2
def rub(): n = int(.5 * SR); x = bp_noise(n, .02, .35); t = np.linspace(0, 1, n); return x * (.6 + .4 * np.sin(t * 40)) * np.sin(np.pi * t) * 1.3
def ding(): n = int(.8 * SR); t = np.arange(n) / SR; return (np.sin(2 * np.pi * 1320 * t) + .5 * np.sin(2 * np.pi * 1980 * t) + .3 * np.sin(2 * np.pi * 2640 * t)) * np.exp(-t / .25) * .5 * np.minimum(t / .003, 1)
GEN = dict(paper=paper, pop=pop, whoosh=whoosh, stamp=stamp, tick=tick, tear=tear, slide=slide, rub=rub, ding=ding)
GAIN = dict(paper=.16, pop=.16, whoosh=.12, stamp=.30, tick=.12, tear=.14, slide=.12, rub=.12, ding=.14)
sfx = np.zeros(N, np.float32)
for ev in sfxj["sfx"]:
    x = GEN[ev["type"]]().astype(np.float32) * GAIN[ev["type"]]; i = int(ev["t"] * SR); sfx[i:i + len(x)] += x[:max(0, N - i)]
# nappe : pizz (Karplus-Strong) Am-F-C-G, 100 bpm
def pluck(f, n):
    p = int(SR / f); buf = rng.uniform(-1, 1, p).astype(np.float32); out = np.zeros(n, np.float32)
    for i in range(n):
        out[i] = buf[i % p]; buf[i % p] = .5 * (buf[i % p] + buf[(i + 1) % p]) * .996
    return out
bpm = 100; beat = 60 / bpm; chords = [[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]]
mf = lambda m: 440 * 2 ** ((m - 69) / 12)
music = np.zeros(N, np.float32); r2 = np.random.default_rng(9); bar = 0
t = .3
while t < total:
    ch = chords[bar % 4]
    for k in range(8):
        tt = t + k * beat / 2
        if tt >= total: break
        if r2.random() < .22: continue
        note = ch[[0, 1, 2, 1, 2, 1, 0, 2][k]] + (12 if k in (2, 5) else 0)
        x = pluck(mf(note), int(.5 * SR)) * (.55 if k % 2 else .8); i = int(tt * SR); music[i:i + len(x)] += x[:N - i]
    bass = np.sin(2 * np.pi * mf(ch[0] - 12) * np.arange(int(2 * beat * 2 * SR)) / SR) * np.exp(-np.arange(int(2 * beat * 2 * SR)) / SR / 1.2) * .5
    i = int(t * SR); music[i:i + len(bass)] += bass[:max(0, N - i)].astype(np.float32)
    t += 4 * beat; bar += 1
fade = np.minimum(np.arange(N) / (SR * 1.5), 1) * np.minimum((N - np.arange(N)) / (SR * 2.2), 1)
music *= fade * .17
w = wave.open(voice_path); v = np.frombuffer(w.readframes(w.getnframes()), "<i2").astype(np.float32) / 32768; assert w.getframerate() == SR
voice = np.zeros(N, np.float32); voice[:len(v)] = v[:N]
def ma(x, k):
    c = np.cumsum(np.insert(x, 0, 0)); y = (c[k:] - c[:-k]) / k; return np.concatenate([np.full(k // 2, y[0]), y, np.full(k - k // 2 - 1, y[-1])])[:len(x)]
m = np.clip((ma(np.abs(voice), int(.03 * SR)) - .008) / .03, 0, 1); m = ma(m, int(.18 * SR)); m = np.clip(m * 1.6, 0, 1)
MUSIC = os.environ.get('MUSIC', 'off') == 'on'
mix = voice * .92 + sfx * (1 - .45 * m) + (music * (1 - .65 * m) if MUSIC else 0)
mix = np.tanh(mix * 1.1) / np.tanh(1.1)
mix = mix / max(np.abs(mix).max(), 1e-6) * .93
st = np.stack([mix, mix], 1)
with wave.open(out, "wb") as o: o.setnchannels(2); o.setsampwidth(2); o.setframerate(SR); o.writeframes((st * 32767).astype("<i2").tobytes())
print("mix ok", round(N / SR, 1), "s")
