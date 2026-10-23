import math
from kraft import *
from props import *

BOUND = [0, 3.5, 8.6, 13.6, 20.8, 26.2, 31.6, 37.2, 42.0, 49.0, 55.0, 59.2, 68.6, 71.7, 79.0, 81.6, 85.5, 90.2,
         94.9, 102.0, 109.0, 114.3, 118.4, 122.2, 129.0, 132.8, 136.7]


def spots_for(k=1.0, n=6, t=None, t0=0.0, gap=0.15):
    out = []
    for i, (dx, dy, r) in enumerate(SP[:n]):
        p = 1.0 if t is None else pop(t, t0 + i * gap, .3)
        out.append((dx, dy, r * k * p / max(k, 1e-6) * k if False else r * k * (p if t is not None else 1)))
    return out


def sp(k=1.0, t=None, t0=0.0, gap=0.15, n=6):
    res = []
    for i, (dx, dy, r) in enumerate(SP[:n]):
        p = 1.0 if t is None else clamp(pop(t, t0 + i * gap, .3), 0, 1.15)
        res.append((dx, dy, r * p * k))
    return res


# ------------------------------------------------------------------ scenes
def S1(c, t, d):
    y = 520 - 760 * (1 - back(t / 0.8))
    c.circ(540, y, 215, CREAM, sh=10)
    c.arc(540, y, 190, 0, 360, 10, TERRA, sh=0)
    c.text('5', 540, y + 8, size=380, fill=TERRA)
    c.label('raisons', 540, 790, size=84, sc=pop(t, .9, .35), rot=1.5, bg=SAGE, fg=CREAM)
    face(c, 540, 1130, 280, spots=sp(1.0, t, 1.2, .18), mood='sad')


def S2(c, t, d):
    c.title('1 · Elles naissent\nsous la peau', t)
    u = t / d
    sl = ease(t / .5)
    top = section(c, 540, 1010 + (1 - sl) * 500, 800, 540)
    n = int(clamp((t - .8) / 3.8) * 6.5)
    for i in range(n):
        bx = 250 + i * 115 + (i % 2) * 20
        by = 1010 - 270 + 330 + (i % 3) * 22
        ball(c, bx, by, 15 + 5 * (i % 2))
    if t > .5:
        hx = 540 + math.sin((t - .5) * 7) * 200
        hand(c, hx, 790, 250, rot=180)


def S3(c, t, d):
    c.title('2 · Cacher n\'est\npas agir', t)
    u = t / d
    cover = clamp((u - .12) / .22) - clamp((u - .66) / .14)
    face(c, 540, 1040, 290, spots=sp(1.0), mood='n')
    for dx, dy, r in SP:
        if cover > .02:
            c.circ(540 + dx * 290, 1040 + dy * 290, r * 290 * (1 + .9 * cover) * .95, (178, 128, 88), sh=1,
                   edge=(178, 128, 88))
    if u < .2:
        p = ease(u / .2)
        sponge(c, 540 + 480 * (1 - p), 760 - 140 * (1 - p), 200, rot=-20)
    elif u < .6:
        q = (u - .2) / .4
        sponge(c, 540 + 150 * math.sin(q * 14) * .6 + 40, 1000 + 40 * math.cos(q * 9), 200, rot=-10 + 8 * math.sin(q * 12))
    else:
        p = ease((u - .6) / .2)
        sponge(c, 560 + 460 * p, 960 - 300 * p, 200, rot=-20 - 40 * p)


def S4(c, t, d):
    c.title('3 · Pensés pour\npeaux claires', t)
    u = t / d
    c.rect(540, 640, 900, 22, KR_D)
    cols = [PINK, CREAM, (236, 226, 222), BEIGE]
    for i, col in enumerate(cols):
        if i == 1 and .15 < u < .55:
            continue
        bottle(c, 200 + i * 227, 560, 150, body=col, lab=dark(col, .9), brand=False, bulb=dark(col, .85))
    c.ell(540, 1130, 400, 270, SKIN)
    for dx, dy, r in [(-.3, -.1, .03), (.2, .15, .035), (.05, -.2, .03)]:
        c.circ(540 + dx * 800, 1130 + dy * 540, r * 800, SPOT, sh=1, edge=SPOT)
    if .1 < u < .55:
        p = ease((u - .1) / .25)
        bottle(c, 340 + 130 * p, 560 + 340 * p, 190, rot=-10 + 160 * p * 0 + 160 * p, body=CREAM, lab=dark(CREAM, .9),
               brand=False, bulb=PINK)
    if .5 < u < .78:
        zig = [(540 + (i - 5) * 50, 1130 + (28 if i % 2 else -28) + math.sin(t * 20) * 4) for i in range(11)]
        for a, b in zip(zig, zig[1:]):
            c.strip(a, b, 14, RED, sh=0)
    if u >= .78:
        for i in range(3):
            c.circ(470 + i * 70, 1130, 16 * pop(t, d * .78 + i * .12, .2), (90, 60, 40), sh=2)


def S5(c, t, d):
    c.title('4 · Gommages et essais\nau hasard', t, y=310)
    u = t / d
    k = 1.0 + .8 * u
    face(c, 540, 1040, 280, spots=sp(k), mood='sad')
    bx = 540 + math.sin(t * 9) * 150
    brush(c, bx, 1080 + math.sin(t * 4.5) * 40, 220, rot=-25)
    for i in range(5):
        p = pop(t, .4 + i * .7, .35)
        if p > 0:
            ox = 150 + (i % 2) * 780
            oy = 600 + (i // 2) * 250
            colz = [PINK, SAGE, KR_L, TERRA, CREAM]
            bottle(c, ox, oy + (1 - p) * -200, 130, rot=(-1) ** i * 15, body=colz[i], lab=CREAM, brand=False,
                   bulb=colz[(i + 2) % 5])


def S6(c, t, d):
    c.title('5 · Le retour\ndes taches', t)
    u = t / d
    face(c, 540, 1060, 270, spots=[(dx, dy, r * 270 / 270 * (1 if u > .45 else 0) * clamp(pop(t, d * .45 + i * .2, .3), 0, 1.15)) for i, (dx, dy, r) in enumerate(SP)], mood='sad')
    sun(c, 200, 760, 70, rot=t * 40)
    razor(c, 880 - 60 * math.sin(t * 3), 790, 150, rot=40 + 20 * math.sin(t * 3))
    for i in range(3):
        a = math.sin(t * 6 + i)
        arrow(c, (330 + a * 20, 1340 + i * 0), (460 + a * 20, 1340), 14)
    c.label('Protection solaire\nquotidienne recommandée', 540, 1385, size=38, w='b', bg=SAGE, fg=CREAM, padx=28, pady=16,
            sc=pop(t, 1.2, .3), maxw=900)


def S7(c, t, d):
    c.title('Ça vient\nd\'en dessous', t)
    u = t / d
    lift = ease((t - .6) / 1.2) * 110
    top = section(c, 540, 1050, 820, 560, lift=lift, tilt=-1.5 * ease((t - .6) / 1.2))
    for i in range(7):
        ball(c, 220 + i * 105, 1080 + (i % 3) * 22, 16)
    by = 740 + math.sin(t * 5) * 18
    arrow(c, (540, by - 170), (540, by + 30), 36, RED)
    hand(c, 850, 760 - lift * .4, 190, rot=160)


def S8(c, t, d):
    c.title('La mélanine =\nta couleur', t)
    c.circ(540, 860, 250, KR_L, sh=9)
    c.arc(540, 860, 232, 0, 360, 8, KR_D, sh=0)
    for i in range(12):
        a = t * (.8 + (i % 3) * .3) + i * 0.52
        r = 60 + (i % 4) * 42
        ball(c, 540 + r * math.cos(a), 860 + r * math.sin(a), 15)
    tones = [(214, 170, 130), (176, 126, 88), (146, 94, 62), (112, 70, 44), (82, 48, 30)]
    for i, col in enumerate(tones):
        s_ = pop(t, 1.0 + i * .35, .3)
        c.rect(150 + i * 195, 1280, 160, 200, col, rot=(-1) ** i * 2, r=14, sc=1) if False else None
        if s_ > 0:
            c.rect(150 + i * 195, 1280 - (1 - clamp(s_, 0, 1)) * 100, 160 * clamp(s_, 0, 1.1), 210 * clamp(s_, 0, 1.1),
                   col, rot=(-1) ** i * 2, r=14)


def S9(c, t, d):
    c.title('Trop de mélanine,\nun seul endroit', t)
    u = t / d
    c.circ(540, 1000, 300, SKIN, sh=9)
    c.arc(540, 1000, 280, 0, 360, 8, SKIN_D, sh=0)
    tx = 540
    ty = 1000
    icons = [(190, 700), (890, 700), (190, 1300), (890, 1300)]
    for i, (ix, iy) in enumerate(icons):
        ph = (t * .9 + i * .25) % 1.0
        hit = ease(1 - abs(ph - .5) * 2)
        px = ix + (tx - ix) * .35 * hit
        py = iy + (ty - iy) * .35 * hit
        if i == 0:
            pimple(c, px, py, 60)
        elif i == 1:
            sun(c, px, py, 50, rot=t * 40)
        elif i == 2:
            razor(c, px, py, 140, rot=30)
        else:
            pill(c, px, py, 200, rot=-20 + 10 * hit)
    n = int(2 + u * 24)
    for i in range(n):
        a = i * 2.4
        r = 12 + 9 * math.sqrt(i) * 1.15
        ball(c, tx + r * math.cos(a) + math.sin(t * 8 + i) * 2, ty + r * math.sin(a), 15)


def S10(c, t, d):
    c.title('Coincée\nsous la peau', t)
    sl = ease(t / .4)
    press = 18 * math.sin(t * 7)
    section(c, 540, 1050, 820, 560, lift=-14 + press * .3)
    n = 9 + int(ease(t / (d * .7)) * 16)
    for i in range(n):
        a = i * 2.39
        r = 14 * math.sqrt(i) * 1.6
        bx = 540 + clamp(r * math.cos(a), -330, 330) + math.sin(t * 9 + i * 1.3) * 3
        by = 1160 + r * math.sin(a) * .5 + 0
        ball(c, bx, by - 20, 15)
    c.label('+ fort', 800, 800, size=60, bg=TERRA, fg=CREAM, sc=pop(t, 1.5, .35), rot=4)
    arrow(c, (720, 840), (600, 980), 20, TERRA)


def S11(c, t, d):
    c.title('Des mois', t)
    tear = clamp(t / d) * 4.3
    calendar(c, 540, 860, 520, tear, pages=5)
    for i in range(int(tear)):
        pass
    section(c, 540, 1300, 760, 200)
    c.circ(540, 1262, 30, SPOT, sh=1, edge=SPOT)
    bx = 540 + 330 * math.sin(t * 2.2 + 3)
    bottle(c, bx, 1150, 110, rot=80)


def S12(c, t, d):
    c.title('Unifier,\npas éclaircir', t)
    u = t / d
    ang = -ease(clamp(u * 1.3 - .1)) * 140
    gear(c, 540, 800, 190, rot=ang, col=TERRA if False else KR_D)
    rate = 1.0 - .85 * ease(clamp(u * 1.3 - .1))
    pipe(c, 540, 520, 540, 640, 64)
    balls_flow(c, t, 540, 520, 540, 1020, rate, n=14, speed=.5)
    c.rect(540, 1180, 640, 150, SKIN_D if False else (112, 70, 44), r=16)
    c.label('même teint', 540, 1180, size=50, bg=SKIN_D, fg=CREAM, padx=26, pady=14) if False else None
    c.circ(540 + 230, 1180, 44, SAGE, sh=3)
    c.strip((540 + 210, 1182), (540 + 228, 1200), 12, CREAM, sh=0)
    c.strip((540 + 228, 1200), (540 + 258, 1160), 12, CREAM, sh=0)


def S13(c, t, d):
    c.title('Imagine', t)
    u = t / d
    items = []
    for i, (dx, dy, r) in enumerate(SP):
        st = .5 + i * .35
        p = clamp((t - st) / 1.0)
        if p <= 0:
            items.append((dx, dy, r, 0, 0, 1))
        else:
            items.append((dx, dy, r, p, 0, 1))
    face(c, 540, 1040, 290, spots=[(dx, dy, r * (1 - ease(p)) if p < .35 else 0) for dx, dy, r, p, _, _ in items],
         mood='smile' if u > .5 else 'n')
    for dx, dy, r, p, _, _ in items:
        if p > 0:
            e = ease(p)
            x = 540 + dx * 290 + e * (500 - dx * 290 + 60) * (1 if dx > 0 else .0) + (-1 if dx <= 0 else 0) * e * (0)
            y = 1040 + dy * 290 - e * 450 * (1 if p > 0 else 0)
            xx = 540 + dx * 290 + e * (60 if dx > 0 else -60) * 3
            if p < .98:
                c.circ(xx, y, r * 290 * (1 - .4 * e) * 1.15, SPOT, sh=6)


def S14(c, t, d):
    c.title('À la source', t)
    u = t / d
    if u < .5:
        nosign(c, 330, 760, 150 * clamp(pop(t, .5, .4), 0, 1.1))
        flame(c, 330, 755, 105 * clamp(pop(t, .5, .4), 0, 1.1))
        nosign(c, 750, 760, 150 * clamp(pop(t, 1.0, .4), 0, 1.1))
        brush(c, 750, 760, 150 * clamp(pop(t, 1.0, .4), 0, 1.1), rot=-30)
    else:
        rate = 1 - ease((u - .65) / .15)
        c.rect(250, 880, 340, 280, (150, 150, 156), r=24)
        pipe(c, 400, 900, 760, 900, 70)
        for i in range(10):
            ball(c, 170 + (i % 5) * 52, 800 + (i // 5) * 60 + 80, 17)
        balls_flow(c, t, 400, 900, 760, 900, rate, n=7, speed=.7)
        gear(c, 560, 900, 90, rot=-ease((u - .6) / .2) * 150, col=TERRA)
        c.label('à la source', 540, 1180, size=64, bg=SAGE, fg=CREAM, sc=pop(t, d * .5 + .2, .4))


def S15(c, t, d):
    c.title('4 actifs', t)
    c.rect(540, 1260, 560, 330, KR_D, r=10)
    c.poly([(260, 1095), (820, 1095), (790, 1060), (290, 1060)], dark(KR_D, 1.12))
    cols = [TERRA, SAGE, CREAM, BROWN]
    for i in range(4):
        p = pop(t, .5 + i * .4, .45)
        if p > 0:
            x = 220 + i * 213
            y = 1230 - 480 * clamp(p, 0, 1.1)
            c.rect(x, y, 170, 300, cols[i], rot=(-1) ** i * 6 + (i - 1.5) * 4, r=14)
            c.text(str(i + 1), x, y, size=120, fill=CREAM if i != 2 else BROWN, rot=(-1) ** i * 6 + (i - 1.5) * 4)
    c.rect(540, 1290, 560, 250, KR_D, r=10)


def S16(c, t, d):
    c.title('Acide azélaïque 10 %', t)
    u = t / d
    ang = -ease(clamp(u * 1.4 - .1)) * 130
    gear(c, 540, 880, 200, rot=ang)
    rate = 1.0 - .85 * ease(clamp(u * 1.4 - .1))
    pipe(c, 540, 560, 540, 700, 66)
    balls_flow(c, t, 540, 560, 540, 1150, rate, n=14, speed=.5)
    c.label('10 %', 540, 1300, size=110, bg=TERRA, fg=CREAM, sc=pop(t, .7, .4), rot=-3)


def S17(c, t, d):
    c.title('Alpha-arbutine 2 %', t)
    u = t / d
    c.rect(270, 900, 360, 360, KR_D, r=18)
    c.poly([(150, 720), (390, 720), (330, 560), (210, 560)], dark(KR_D, 1.1))
    c.rect(270, 1090, 150, 90, dark(KR_D, .85), r=10)
    stop = ease((u - .3) / .12)
    rate = 1.0 - stop
    pipe(c, 450, 1085, 960, 1085, 54)
    balls_flow(c, t, 440, 1085, 920, 1085, rate, n=9, speed=.6)
    ep = ease((u - .15) / .15)
    enzyme(c, 1000 - 330 * ep, 1100 - 0, 330, stop=stop) if False else enzyme(c, 790 + (1 - ep) * 400, 920, 340, stop=ease((u - .3) / .12))
    c.label('tyrosinase', 540, 1330, size=60, bg=SAGE, fg=CREAM, sc=pop(t, 1.4, .4), rot=2)


def S18(c, t, d):
    c.title('Acide tranexamique', t)
    u = t / d
    section(c, 540, 1100, 820, 360)
    cyc = (t * .55) % 1.0
    n_c = int(t * .55)
    r = 74 * (1 - .13 * n_c)
    up = math.sin(clamp(cyc * 1.2) * math.pi) * 60
    c.circ(540, 1004 - up * .5, r, SPOT, sh=6)
    # tweezers
    c.strip((420, 560 + 80 * 0), (520, 930 - up * 1.2), 34, GREY)
    c.strip((660, 560), (560, 930 - up * 1.2), 34, GREY)
    c.label('tenaces', 540, 1380, size=64, bg=SAGE, fg=CREAM, sc=pop(t, .9, .4), rot=1)


def S19(c, t, d):
    c.title('Niacinamide 5 %', t)
    u = t / d
    c.ell(540, 1290, 330, 90, SKIN_D, sh=4)
    c.ell(540, 1050, 260, 300, SKIN)
    c.text('barrière', 540, 1050, size=70, fill=CREAM)
    n = int(clamp(t / 3.2) * 42)
    brick_wall(c, 540, 1250, 760, 6, n)
    if t > 3.6:
        ph = (t - 3.6)
        s_ = ph * 4
        sun(c, 220 + 70 * abs(math.sin(s_)), 640 + 30 * math.sin(s_ * 2), 52, rot=t * 40)
        razor(c, 860 - 60 * abs(math.sin(s_ + 1)), 700, 140, rot=45)


def S20(c, t, d):
    c.title('Pas dix flacons', t)
    u = t / d
    cols = [PINK, SAGE, CREAM, TERRA, KR_L, BEIGE, SAGE, PINK, KR_D, CREAM]
    for i in range(10):
        gx = 140 + (i % 5) * 200
        gy = 700 + (i // 5) * 280
        go = ease((u - .38 - (i % 5) * .045 - (i // 5) * .1) / .2)
        bottle(c, gx - go * 1100, gy, 150, body=cols[i], lab=dark(cols[i], .9), brand=False, bulb=cols[(i + 3) % 10],
               rot=(-1) ** i * 4)
    pt = pop(t, 1.4, .4)
    if pt > 0 and u < .75:
        c.label('€€€', 540, 1230, size=110, bg=SUN, fg=BROWN, sc=pt, rot=4)
        if u > .55:
            c.strip((350, 1330), (730, 1130), 16, RED, sh=3)


def S21(c, t, d):
    c.title('Sérum Anti-Taches', t)
    p = clamp(pop(t, 0, .8), 0, 1.08)
    bottle(c, 540, 1180 - 280 * p + 280 * (1 - p) * 0, 420 * p)
    cols = [TERRA, SAGE, CREAM, BROWN]
    for i in range(4):
        st = .9 + i * .5
        q = ease((t - st) / .6)
        if q < 1:
            sx = [140, 940, 140, 940][i]
            sy = [650, 650, 1350, 1350][i]
            c.rect(sx + (540 - sx) * q, sy + (1020 - sy) * q, 120 * (1 - .5 * q), 200 * (1 - .5 * q), cols[i], rot=q * 200,
                   r=10)
    for i in range(5):
        a = t * 1.1 + i * 1.256
        star(c, 540 + 330 * math.cos(a), 960 + 310 * math.sin(a), 24 + 8 * math.sin(t * 6 + i), rot=t * 120)


def S22(c, t, d):
    c.title('94 % le\nrecommandent', t)
    s_ = 2.2 - 1.2 * ease(t / .5)
    if t < .5:
        s_ = 2.2 - 1.2 * ease(t / .5)
    else:
        s_ = 1.0 + .06 * math.exp(-(t - .5) * 5) * math.sin((t - .5) * 25)
    c.rect(540, 1030, 800, 560, KR_L, r=26)
    stamp(c, 540, 1030, 230, '94 %', sc=s_, size=120, rot=-6)
    for i in range(5):
        y = 1330 - ((t * 120 + i * 90) % 520)
        heart(c, 160 + i * 190 + math.sin(t * 3 + i) * 20, 1300 - ((t * 140 + i * 110) % 700), 60, TERRA if i % 2 else RED)
    c.label('test consommateur, 4 semaines', 540, 1400, size=40, w='b', bg=CREAM, padx=26, pady=14, maxw=960,
            sc=pop(t, .8, .3))


def S23(c, t, d):
    c.title('Offre de la semaine', t)
    p1 = pop(t, .3, .45)
    p2 = pop(t, .9, .45)
    bottle(c, 270, 1050, 380 * clamp(p1, 0, 1.1))
    bottle(c, 520, 1050, 380 * clamp(p2, 0, 1.1))
    c.circ(395, 1000, 40 * clamp(pop(t, .8, .3), 0, 1.1), TERRA)
    c.text('+', 395, 998, size=70, fill=CREAM) if t > .8 else None
    gx = 900 - (1 - ease((t - 1.6) / .6)) * 700
    giftbox(c, gx, 1130, 260, lid=18 * abs(math.sin(t * 6)) * (1 if t > 2.4 else 0))
    c.label('offert', 880, 800, size=64, bg=SAGE, fg=CREAM, sc=pop(t, 2.2, .35), rot=5)


def S24(c, t, d):
    c.title('Satisfait ou remboursé\n90 jours', t)
    u = t / d
    if u < .45:
        face(c, 540, 1020, 280, mood='skep', brow=1.0 if (t % 1.5) > .4 else 0.0, look=-1 if t % 2 < 1 else 1)
        c.label('?', 840, 700, size=140, bg=KR_L, sc=pop(t, .7, .3), rot=8)
    else:
        c.rect(540, 1100, 700, 380, KR_D, r=14)
        c.poly([(190, 920), (890, 920), (860, 880), (220, 880)], dark(KR_D, 1.12))
        s_ = 1 if t > d * .45 + .3 else 2.3 - 1.3 * ease((t - d * .45) / .3)
        stamp(c, 540, 1060, 230, '90\njours', col=SAGE, sc=s_, size=76, rot=-8)


def S25(c, t, d):
    c.title('3 mois', t)
    tear = clamp(t / 2.4) * 3.0
    calendar(c, 300, 860, 380, tear, pages=4)
    c.rect(780, 1250, 380, 240, KR_D, r=10)
    for i in range(5):
        st = 1.0 + i * .45
        q = clamp((t - st) / .8)
        if 0 < q < 1:
            c.strip((0, 0), (0, 0), 0.1, KR, sh=0) if False else None
            bill(c, 400 + 380 * ease(q), 900 + 340 * ease(q) - 160 * math.sin(q * math.pi), .8, rot=-30 + 60 * q)
    c.rect(780, 1180, 380, 180, KR_D, r=10)
    c.text('remboursé', 780, 1240, size=44, fill=CREAM)


def S26(c, t, d):
    p = clamp(pop(t, .1, .5), 0, 1.1)
    c.circ(540, 620, 190 * p, CREAM, sh=10)
    c.arc(540, 620, 160 * p, 0, 360, 10, TERRA, sh=0)
    c.text('M', 540, 620, size=int(210 * p), fill=BROWN)
    c.label('MELA SKIN', 540, 900, size=96, bg=CREAM, sc=pop(t, .5, .4), rot=-2)
    c.text('L\'expertise pensée pour vous', 540, 1020, size=44, fill=CREAM, w='b', sc=pop(t, .9, .4))
    bs = 1.0 + .06 * abs(math.sin(t * 5))
    c.label('Sérum Anti-Taches', 540, 1200, size=70, bg=SAGE, fg=CREAM, sc=pop(t, 1.2, .4) * bs, rot=1.5)
    if t > 1.8:
        hand(c, 700, 1400 + 14 * math.sin(t * 6), 200, rot=-15)


SCENES = [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15, S16, S17, S18, S19, S20, S21, S22, S23,
          S24, S25, S26]
BGKEY = ['kr', 'kr', 'kr', 'kr', 'kr', 'kr', 'terra', 'kr', 'kr', 'kr', 'kr', 'terra', 'kr', 'kr', 'kr', 'kr', 'kr',
         'kr', 'kr', 'kr', 'sage', 'kr', 'kr', 'kr', 'kr', 'terra']
