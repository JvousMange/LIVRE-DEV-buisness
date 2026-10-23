"""Fond musical léger et entraînant, synthétisé : ukulélé (Karplus-Strong) + basse douce + shaker + petit claquement + marimba.
Sol majeur, 104 bpm, grille G - D - Em - C. Retourne un tableau stéréo normalisé (RMS ~ 1) ; le niveau est réglé par le mixeur."""
import numpy as np
BPM = 104
def make(total, SR, reverb, style="ambient", plan=None):
    if style == "acoustic": return make_acoustic(total, SR, reverb, plan)
    if style == "ambient": return make_ambient(total, SR, reverb)
    if style == "pulse": return make_pulse(total, SR, reverb)
    if style == "rythme": return make_pulse(total, SR, reverb, pad_on=False)
    if style == "padclean": return highpass(make_ambient(total, SR, reverb, clean=True), SR, 150)
    return make_groove(total, SR, reverb)

def make_groove(total, SR, reverb):
    rng = np.random.default_rng(21); beat = 60 / BPM; eighth = beat / 2; bar = 4 * beat
    nbars = int(np.ceil((total + 1) / bar)) + 1; N = int((nbars * bar + 4) * SR)
    L = np.zeros(N, np.float32); R = np.zeros(N, np.float32)
    def put(x, t, pan=0.0, g=1.0):
        i = int(t * SR); m = min(len(x), N - i)
        if m <= 0: return
        gl, gr = np.sqrt((1 - pan) / 2), np.sqrt((1 + pan) / 2); L[i:i + m] += x[:m] * g * gl; R[i:i + m] += x[:m] * g * gr
    def noise(n): return rng.normal(0, 1, n).astype(np.float32)
    def bp(x, lo, hi):
        X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR); m = np.clip((f - lo) / (lo * .35 + 1), 0, 1) * np.clip((hi - f) / (hi * .35 + 1), 0, 1); return np.fft.irfft(X * m, len(x)).astype(np.float32)
    def env(n, a, d): t = np.arange(n) / SR; return np.minimum(t / a, 1) * np.exp(-t / d)
    cache = {}
    def pluck(f, dur=1.1, damp=.9965):                      # corde pincée (Karplus-Strong par blocs)
        key = (round(f, 2), dur)
        if key in cache: return cache[key]
        n = int(dur * SR); p = int(SR / f); buf = noise(p) * np.hanning(p) ** .3
        buf = (buf + np.roll(buf, 1) + np.roll(buf, 2)) / 3; out = np.empty(n + p, np.float32)
        for k in range(0, n, p):
            out[k:k + p] = buf; buf = damp * .5 * (buf + np.roll(buf, -1))
        o = out[:n] * np.exp(-np.arange(n) / SR / .55); cache[key] = o / (np.abs(o).max() + 1e-9); return cache[key]
    mf = lambda m: 440 * 2 ** ((m - 69) / 12)
    # ukulele (accordage G C E A) : cordes à vide = sol4 do4 mi4 la4 ; frettes pour G, D, Em, C
    G4, C4, E4, A4 = 67, 60, 64, 69
    voicings = [(0, 2, 3, 2), (2, 2, 2, 0), (0, 4, 3, 2), (0, 0, 0, 3)]   # G, D, Em, C
    roots = [mf(55), mf(50), mf(52), mf(48)]                             # sol2, ré2, mi2, do2
    bass_oct = [2, 2, 2, 2]
    penta = [67, 69, 71, 74, 76, 79, 81]                                 # sol la si ré mi sol la
    motifs = [[(0, 79), (1.5, 76), (3, 74), (4, 76), (6, 74)], [(0, 74), (1.5, 71), (3, 74), (4, 79), (6, 76)]]
    def strum(t, chord, down=True, vel=1.0, pan=-.25):
        strings = [G4, C4, E4, A4]; frets = voicings[chord]
        order = range(4) if down else range(3, -1, -1)
        for k, si in enumerate(order):
            put(pluck(mf(strings[si] + frets[si])), t + k * .011, pan, vel * (.9 if down else .6) * rng.uniform(.85, 1.0))
    def bass(t, f, vel=1.0):
        n = int(.45 * SR); tt = np.arange(n) / SR; x = (np.sin(2 * np.pi * f * tt) + .3 * np.sin(4 * np.pi * f * tt) + .1 * np.sin(6 * np.pi * f * tt)) * env(n, .006, .2)
        put(x.astype(np.float32), t, 0, .8 * vel)
    def shaker(t, vel):
        n = int(.07 * SR); put(bp(noise(n), 4500, 8500) * env(n, .004, .022), t, .3, .16 * vel)
    def snap(t):
        n = int(.12 * SR); tt = np.arange(n) / SR; put(bp(noise(n), 1100, 3600) * env(n, .001, .012) * .8 + np.sin(2 * np.pi * 210 * tt) * np.exp(-tt / .03) * .25, t, .1, .22)
    def marimba(t, m, vel=1.0):
        f = mf(m); n = int(.9 * SR); tt = np.arange(n) / SR
        x = (np.sin(2 * np.pi * f * tt) * np.exp(-tt / .26) + .45 * np.sin(2 * np.pi * 4 * f * tt) * np.exp(-tt / .07) + .15 * np.sin(2 * np.pi * 10 * f * tt) * np.exp(-tt / .03)) * np.minimum(tt / .002, 1)
        put(x.astype(np.float32), t, .3, .55 * vel)
    t0 = .25
    strums = [(0, 1.0, True), (2, .85, True), (3, .65, False), (5, .6, False), (6, .85, True), (7, .6, False)]
    for b in range(nbars):
        tb = t0 + b * bar; c = b % 4; intro = b < 2; last = b == nbars - 1
        for e in range(8):
            shaker(tb + e * eighth, [1, .45, .8, .45, 1, .45, .8, .55][e] * (.7 if intro else 1))
            if e in (2, 6) and not intro: snap(tb + e * eighth)
        for e, v, dn in strums:
            if intro and e not in (0, 3): continue
            strum(tb + e * eighth, c, dn, v * (.7 if intro else 1))
        bass(tb, roots[c] * 2, 1.0); bass(tb + 3 * eighth, roots[c] * 3, .7); bass(tb + 4 * eighth, roots[c] * 2, .85)
        if b >= 4 and (b % 8) in (4, 5, 6, 7) and not last:
            for pos, m in motifs[(b // 2) % 2]: marimba(tb + pos * eighth, m + (0 if c % 2 == 0 else -2 if m > 70 else 0), .85)
    # fondu d'entrée / sortie
    n = int((total + 1.2) * SR); L, R = L[:n], R[:n]
    fade = np.minimum(np.arange(n) / (SR * 1.2), 1) * np.minimum((n - np.arange(n)) / (SR * 2.6), 1)
    st = np.stack([L, R], 1) * fade[:, None]
    wet = reverb(st[:, 0].copy(), .1) [:n]; wet2 = reverb(st[:, 1].copy(), .1)[:n]; st = np.stack([wet, wet2], 1)
    st = st / (np.sqrt((st ** 2).mean()) + 1e-9)                      # RMS normalisé : le niveau est réglé par MUSIC_DB
    return st.astype(np.float32)


def make_ambient(total, SR, reverb, clean=False):
    """Nappe ambiante chaude et lente en mi bémol (comme la piste de la pub de référence) : accords tenus, drone grave, quelques notes de cloche."""
    rng = np.random.default_rng(33); N = int((total + 4) * SR); L = np.zeros(N, np.float32); R = np.zeros(N, np.float32)
    mf = lambda m: 440 * 2 ** ((m - 69) / 12)
    chords = [([51, 55, 58, 62], 39), ([46, 53, 58, 62], 34), ([48, 51, 55, 58], 36), ([44, 51, 55, 60], 32)]   # Ebmaj7, Bb(add9), Cm7, Abmaj7 + basse
    def put(x, t, gl, gr):
        i = int(t * SR); m = min(len(x), N - i)
        if m > 0: L[i:i + m] += x[:m] * gl; R[i:i + m] += x[:m] * gr
    def pad(f, dur, fade):                                   # oscillateurs détunés, harmoniques douces
        n = int(dur * SR); t = np.arange(n) / SR; out = {}
        for cents, pan in (((-2, -1), (2, 1)) if clean else ((-7, -1), (0, 0), (7, 1))):
            ff = f * 2 ** (cents / 1200); x = np.zeros(n, np.float32)
            for h in range(1, 7): x += (np.sin(2 * np.pi * ff * h * t + rng.uniform(0, 6.28)) / h ** 1.7).astype(np.float32)
            out[pan] = x * (1 + .08 * np.sin(2 * np.pi * rng.uniform(.1, .22) * t + rng.uniform(0, 6.28)))
        env = np.minimum(t / fade, 1) * np.minimum((dur - t) / fade, 1); env = env ** 1.5
        return out, env
    cd = 8.0; fade = 2.6; k = 0; t = 0.0
    while t < total + 2:
        notes, root = chords[k % 4]
        for m in notes:
            o, env = pad(mf(m), cd + 2 * fade, fade); st = t - fade
            for pan, x in o.items(): put(x * env, max(st, 0), np.sqrt((1 - pan * .6) / 2) * .22, np.sqrt((1 + pan * .6) / 2) * .22)
        n = int((cd + 2 * fade) * SR); tt = np.arange(n) / SR                     # drone grave
        sub = np.sin(2 * np.pi * mf(root) * tt) + .35 * np.sin(2 * np.pi * mf(root + 12) * tt); e2 = np.minimum(tt / fade, 1) * np.minimum((cd + 2 * fade - tt) / fade, 1)
        if not clean: put((sub * e2).astype(np.float32), max(t - fade, 0), .5, .5)
        # quelques notes de cloche, espacées
        for _ in range(rng.integers(1, 3)):
            bt = t + rng.uniform(.5, cd - 1.5); m = int(rng.choice(notes)) + 24; f0 = mf(m); nn = int(1.6 * SR); u = np.arange(nn) / SR
            bell = (np.sin(2 * np.pi * f0 * u) * np.exp(-u / .55) + .3 * np.sin(2 * np.pi * f0 * 2.76 * u) * np.exp(-u / .22)) * np.minimum(u / .004, 1)
            pan = rng.uniform(-.5, .5); put(bell.astype(np.float32), bt, np.sqrt((1 - pan) / 2) * .16, np.sqrt((1 + pan) / 2) * .16)
        t += cd; k += 1
    n = int((total + 1.2) * SR); L, R = L[:n], R[:n]
    fadein = np.minimum(np.arange(n) / (SR * 2.0), 1) * np.minimum((n - np.arange(n)) / (SR * 3.0), 1)
    st = np.stack([L, R], 1) * fadein[:, None]
    st = np.stack([reverb(st[:, 0].copy(), .12 if clean else .22, .6 if clean else .9)[:n], reverb(st[:, 1].copy(), .12 if clean else .22, .6 if clean else .9)[:n]], 1)
    st = st / (np.sqrt((st ** 2).mean()) + 1e-9)
    return st.astype(np.float32)


def highpass(st, SR, fc):
    out = np.empty_like(st)
    for c in range(st.shape[1]):
        X = np.fft.rfft(st[:, c]); f = np.fft.rfftfreq(len(st), 1 / SR); out[:, c] = np.fft.irfft(X * np.clip((f - fc * .6) / (fc * .8), 0, 1), len(st))
    return (out / (np.sqrt((out ** 2).mean()) + 1e-9)).astype(np.float32)

def make_pulse(total, SR, reverb, pad_on=True):
    """Nappe ambiante (mi bémol) + pulsation discrète : kick feutré, charleys swingués, petit claquement sur 2 et 4, arpège pincé doux."""
    pad = make_ambient(total, SR, reverb, clean=True) if pad_on else None
    n = int((total + 1.2) * SR); rng = np.random.default_rng(44)
    L = np.zeros(n + SR * 4, np.float32); R = np.zeros(n + SR * 4, np.float32)
    bpm = 92; beat = 60 / bpm; eighth = beat / 2; bar = 4 * beat; t0 = 2.2          # la pulsation entre après la première phrase
    def put(x, t, pan=0.0, g=1.0):
        i = int(t * SR); m = min(len(x), len(L) - i)
        if m > 0: L[i:i + m] += x[:m] * g * np.sqrt((1 - pan) / 2); R[i:i + m] += x[:m] * g * np.sqrt((1 + pan) / 2)
    noise = lambda k: rng.normal(0, 1, k).astype(np.float32)
    def bp(x, lo, hi):
        X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR); m = np.clip((f - lo) / (lo * .35 + 1), 0, 1) * np.clip((hi - f) / (hi * .35 + 1), 0, 1); return np.fft.irfft(X * m, len(x)).astype(np.float32)
    def env(k, a, d): t = np.arange(k) / SR; return np.minimum(t / a, 1) * np.exp(-t / d)
    def kick(t, v):
        k = int(.3 * SR); tt = np.arange(k) / SR; f = 46 + 70 * np.exp(-tt / .035); x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt / .1); put(x.astype(np.float32), t, 0, .9 * v)
    def rim(t, v):
        k = int(.11 * SR); tt = np.arange(k) / SR; x = np.sin(2 * np.pi * 1750 * tt) * np.exp(-tt / .012) * .6 + bp(noise(k), 1400, 4800) * env(k, .001, .01) * .5; put(x.astype(np.float32), t, .15, .55 * v)
    def hat(t, v):
        k = int(.07 * SR); put(bp(noise(k), 6500, 11500) * env(k, .001, .014), t, -.2, .5 * v)
    cache = {}
    def pluck(fr, dur=.7, damp=.994):
        key = round(fr, 2)
        if key in cache: return cache[key]
        k = int(dur * SR); p = int(SR / fr); buf = noise(p) * np.hanning(p) ** .3; buf = (buf + np.roll(buf, 1) + np.roll(buf, 2)) / 3; out = np.empty(k + p, np.float32)
        for q in range(0, k, p): out[q:q + p] = buf; buf = damp * .5 * (buf + np.roll(buf, -1))
        o = out[:k] * np.exp(-np.arange(k) / SR / .3); cache[key] = o / (np.abs(o).max() + 1e-9); return cache[key]
    mf = lambda m: 440 * 2 ** ((m - 69) / 12)
    chords = [[51, 55, 58, 62], [46, 53, 58, 62], [48, 51, 55, 58], [44, 51, 55, 60]]
    arp_pos = [0, 2, 3, 5, 7]; arp_idx = [0, 1, 2, 1, 3]
    nb = int((total - t0) / bar) + 1
    for b in range(nb):
        tb = t0 + b * bar
        if tb > total - 3.5: break
        ch = chords[int(tb / 8.0) % 4]
        for e in range(8):
            sw = eighth * .12 if e % 2 else 0; te = tb + e * eighth + sw
            hat(te, [.9, .45, .7, .4, .85, .4, .7, .5][e] * (.6 if b < 2 else 1))
            if b >= 1 and e in (2, 6): rim(te, .8)
        if b >= 1: kick(tb, 1.0); kick(tb + 3 * eighth, .55)
        if not pad_on and b >= 1:
            for bt, bv in ((0, 1.0), (4, .7)):
                f0 = mf(ch[0] - 12); k2 = int(.4 * SR); tt2 = np.arange(k2) / SR; put(((np.sin(2 * np.pi * f0 * tt2) + .25 * np.sin(4 * np.pi * f0 * tt2)) * env(k2, .005, .16)).astype(np.float32), tb + bt * eighth, 0, .6 * bv)
        if b >= 3 and b % 4 == 3: kick(tb + 6 * eighth, .5)
        if b >= 2:
            for pos, ai in zip(arp_pos, arp_idx): put(pluck(mf(ch[ai] + 12)), tb + pos * eighth + (eighth * .12 if pos % 2 else 0), -.3 + .15 * ai, [.8, .5, .6, .45, .5][arp_pos.index(pos)] * .9)
    rh = np.stack([L[:n], R[:n]], 1)
    rh = reverb(rh[:, 0].copy(), .08)[:n], reverb(rh[:, 1].copy(), .08)[:n]; rh = np.stack(rh, 1)
    rms = lambda a: np.sqrt((a ** 2).mean()) + 1e-9
    if pad_on:
        rh = rh / rms(rh) * rms(pad) * 0.55                       # rythme ~5 dB sous la nappe (en RMS), mais les attaques ressortent
        out = highpass(pad, SR, 150) + rh
    else:
        out = highpass(rh, SR, 110)                               # rythme seul : aucun son tenu, aucun grondement
    out = np.tanh(out / (3 * rms(out))) * 3 * rms(out)             # écrête les attaques (kick) pour qu'elles restent discrètes
    fade = np.minimum(np.arange(len(out)) / (SR * 1.5), 1) * np.minimum((len(out) - np.arange(len(out))) / (SR * 2.5), 1)
    out = out * fade[:, None]; return (out / rms(out)).astype(np.float32)


SECTION = {  # plan (id de plan) -> section musicale
    **{k: "intro" for k in ("pop", "stay", "mirror", "pigment", "fan")},
    **{k: "signs" for k in ("months", "colors", "darker", "body", "razor", "wax", "scrub", "random", "worse", "xtubes", "pale")},
    **{k: "calm" for k in ("talk", "peel", "act", "notlight", "factory", "inflam", "enzyme")},
    **{k: "full" for k in ("brake", "lock", "tranex", "wall", "slots", "target", "ten", "hero", "crowd", "jars", "okstamp", "seal", "refund", "nowor")},
    **{k: "lift" for k in ("two", "free")}, "end": "outro"}
LAYERS = {   # gain par couche selon la section
    "intro": dict(kal=.9, hat=.35, bass=0, snap=0, stab=0, kick=0, bell=0),
    "signs": dict(kal=.85, hat=.5, bass=.55, snap=.45, stab=.35, kick=0, bell=0),
    "calm":  dict(kal=.9, hat=.22, bass=.5, snap=0, stab=0, kick=0, bell=0),
    "full":  dict(kal=.8, hat=.55, bass=.7, snap=.6, stab=.55, kick=.8, bell=0),
    "lift":  dict(kal=.95, hat=.6, bass=.75, snap=.65, stab=.65, kick=.85, bell=.9),
    "outro": dict(kal=.9, hat=0, bass=.5, snap=0, stab=0, kick=0, bell=.9)}

def make_acoustic(total, SR, reverb, plan):
    """Musique acoustique légère en sol majeur, 100 bpm (kalimba, ukulélé feutré, basse pincée, claquements, charleys, kick feutré),
    structurée comme l'ad : minimal -> pulsation -> respiration -> groupe complet -> lift sur l'offre -> résolution."""
    rng = np.random.default_rng(55); N = int((total + 5) * SR); L = np.zeros(N, np.float32); R = np.zeros(N, np.float32)
    bpm = 100; beat = 60 / bpm; eighth = beat / 2; bar = 4 * beat; t0 = .2
    secs = [((p["start"], p["end"]), SECTION.get(p["id"], "full")) for p in (plan or [])] or [((0, total), "full")]
    def section(t):
        for (a, b), s_ in secs:
            if a <= t < b: return s_
        return secs[-1][1]
    def put(x, t, pan=0.0, g=1.0):
        i = int(t * SR); m = min(len(x), N - i)
        if m > 0: L[i:i + m] += x[:m] * g * np.sqrt((1 - pan) / 2); R[i:i + m] += x[:m] * g * np.sqrt((1 + pan) / 2)
    noise = lambda k: rng.normal(0, 1, k).astype(np.float32)
    def bp(x, lo, hi):
        X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR); m = np.clip((f - lo) / (lo * .35 + 1), 0, 1) * np.clip((hi - f) / (hi * .35 + 1), 0, 1); return np.fft.irfft(X * m, len(x)).astype(np.float32)
    def env(k, a, d): t = np.arange(k) / SR; return np.minimum(t / a, 1) * np.exp(-t / d)
    mf = lambda m: 440 * 2 ** ((m - 69) / 12)
    cache = {}
    def pluck(fr, dur=.8, damp=.995, tau=.35):
        key = (round(fr, 2), dur, tau)
        if key in cache: return cache[key]
        k = int(dur * SR); p = int(SR / fr); buf = noise(p) * np.hanning(p) ** .3; buf = (buf + np.roll(buf, 1) + np.roll(buf, 2)) / 3; out = np.empty(k + p, np.float32)
        for q in range(0, k, p): out[q:q + p] = buf; buf = damp * .5 * (buf + np.roll(buf, -1))
        o = out[:k] * np.exp(-np.arange(k) / SR / tau); cache[key] = o / (np.abs(o).max() + 1e-9); return cache[key]
    def kalimba(t, m, v, pan):
        f = mf(m); k = int(.9 * SR); u = np.arange(k) / SR
        x = (np.sin(2 * np.pi * f * u) * np.exp(-u / .3) + .35 * np.sin(2 * np.pi * f * 5.4 * u) * np.exp(-u / .05) + .12 * np.sin(2 * np.pi * f * 9.2 * u) * np.exp(-u / .03)) * np.minimum(u / .0025, 1)
        put(x.astype(np.float32), t, pan, .5 * v)
    def bell(t, m, v, pan):
        f = mf(m); k = int(1.6 * SR); u = np.arange(k) / SR; x = (np.sin(2 * np.pi * f * u) * np.exp(-u / .6) + .3 * np.sin(2 * np.pi * f * 2.76 * u) * np.exp(-u / .25)) * np.minimum(u / .003, 1); put(x.astype(np.float32), t, pan, .35 * v)
    def bass(t, m, v):
        f = mf(m); k = int(.42 * SR); u = np.arange(k) / SR; put(((np.sin(2 * np.pi * f * u) + .28 * np.sin(4 * np.pi * f * u)) * env(k, .005, .15)).astype(np.float32), t, 0, .7 * v)
    def kick(t, v):
        k = int(.28 * SR); u = np.arange(k) / SR; f = 48 + 62 * np.exp(-u / .035); put((np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-u / .09)).astype(np.float32), t, 0, .8 * v)
    def snap(t, v):
        k = int(.11 * SR); u = np.arange(k) / SR; put((bp(noise(k), 1300, 4200) * env(k, .001, .01) * .8 + np.sin(2 * np.pi * 1800 * u) * np.exp(-u / .011) * .35).astype(np.float32), t, .15, .5 * v)
    def hat(t, v):
        k = int(.06 * SR); put(bp(noise(k), 6500, 11000) * env(k, .001, .013), t, -.2, .38 * v)
    def stab(t, chord, v):   # ukulélé feutré : court coup de médiator
        for i, m in enumerate(chord): put(pluck(mf(m), .35, .99, .12), t + i * .008, -.3, .45 * v * rng.uniform(.85, 1))
    chords = [([67, 71, 74], [55], [62, 67, 71, 74]), ([62, 66, 69], [50], [57, 62, 66, 69]), ([64, 67, 71], [52], [59, 64, 67, 71]), ([60, 64, 67], [48], [55, 60, 64, 67])]  # G, D, Em, C
    nb = int((total - t0) / bar) + 2; pat = [0, 1, 2, 1, 2, 1, 0, 2]
    for b in range(nb):
        tb = t0 + b * bar; sec = section(tb); g = LAYERS[sec]; kal_tones, bassm, uke = chords[b % 4]
        if sec == "outro": g = LAYERS["outro"]
        if tb > total + 2: break
        for e in range(8):
            te = tb + e * eighth + (eighth * .1 if e % 2 else 0)
            if g["hat"]: hat(te, g["hat"] * [.9, .5, .75, .45, .85, .5, .75, .55][e])
            if g["snap"] and e in (2, 6): snap(te, g["snap"])
            if g["stab"] and e in (3, 7): stab(te, uke, g["stab"])
            if g["kal"] and e in (0, 2, 3, 5, 6) and not (sec == "calm" and e == 5):
                tone = kal_tones[pat[(e + b) % 8] % 3] + (24 if sec in ("lift", "outro") and e in (3, 6) else 12)
                kalimba(te, tone, g["kal"] * rng.uniform(.75, 1), (-.2 + .1 * (e % 3)))
        if g["bass"]: bass(tb, bassm[0] + 0, g["bass"]); bass(tb + 4 * eighth, bassm[0], g["bass"] * .7)
        if g["kick"]: kick(tb, g["kick"]); kick(tb + 3 * eighth, g["kick"] * .5) if b % 2 else None
        if g["bell"] and (b % 2 == 0): bell(tb + 2 * eighth, kal_tones[2] + 24, g["bell"], .3); bell(tb + 5 * eighth, kal_tones[0] + 24, g["bell"] * .8, -.3)
    # accord final qui résonne, puis fondu
    last = t0 + (nb - 1) * bar
    for i, m in enumerate([55, 59, 62, 67, 71, 74]): put(pluck(mf(m), 2.4, .9985, 1.0), total - .9 + i * .02, 0, .7)
    n = int((total + 1.2) * SR); L, R = L[:n], R[:n]
    fade = np.minimum(np.arange(n) / (SR * 1.2), 1) * np.minimum((n - np.arange(n)) / (SR * 1.6), 1)
    st = np.stack([L, R], 1) * fade[:, None]
    st = np.stack([reverb(st[:, 0].copy(), .1, .5)[:n], reverb(st[:, 1].copy(), .1, .5)[:n]], 1)
    rms = np.sqrt((st ** 2).mean()) + 1e-9; st = np.tanh(st / (3 * rms)) * 3 * rms
    return highpass(st / (np.sqrt((st ** 2).mean()) + 1e-9), SR, 110).astype(np.float32)
