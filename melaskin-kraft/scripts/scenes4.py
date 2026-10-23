import math, random
from kraft import *
from kraft import textimg_stroke
from props import (sun, razor, pimple, pill, brush, sponge, flame, nosign, gear, ball, balls_flow, pipe, hand, star,
                   heart, calendar, giftbox, stamp, bill, enzyme, arrow, bottle)
from scenes2 import RS, SHIRT, PANT, SKIN2, TILE, pastille, JS, flute_band
from scenes3 import (cheek_bg, jaw, jaw_pos, neck_spots, cardboard_hand, woman, bath_bg, slab, avatar, GOLD, TONES)

LB = (226, 194, 144)


def flat(c, col=LB, blur=0):
    c.rect(540, 960, 1100, 2000, col, sh=0, jit=False)
    if blur:
        c.blur(blur)


def burst(c, x, y, t, t0=0.0, n=16, speed=800, size=22):
    tt = t - t0
    if tt < 0 or tt > 1.1:
        return
    cols = [KR_D, TERRA, CREAM, KR_L, SAGE]
    for i in range(n):
        a = i * 2 * math.pi / n + (i % 3) * .25
        v = speed * (.45 + (i % 5) / 6)
        px = x + v * math.cos(a) * tt
        py = y + v * math.sin(a) * tt + 700 * tt * tt
        s_ = size + (i % 4) * 8
        r = tt * 9 + i
        pts = [(px + s_ * math.cos(r + k * 2.1), py + s_ * math.sin(r + k * 2.1)) for k in range(3)]
        c.poly(pts, cols[i % 5], sh=3)


def slam(t, t0, dur=.22, s0=2.4):
    if t < t0:
        return 0.0
    q = clamp((t - t0) / dur)
    if q < 1:
        return s0 - (s0 - 1) * ease(q)
    return 1.0 + .07 * math.exp(-(t - t0 - dur) * 6) * math.sin((t - t0 - dur) * 28)


# ---------------------------------------------------------------- plans
def A1(c, t, d):
    cheek_bg(c)
    jaw(c, t, .15, .04)
    neck_spots(c, t, .8)
    s_ = slam(t, .25)
    if s_:
        c.blit(textimg_stroke('5', 700, CREAM, TERRA, 14, 'x'), 300, 400, sc=s_, shadow=True)
    burst(c, 300, 400, t, .45)


def A2(c, t, d):
    bath_bg(c)
    woman(c, 560, t, up=ease((t - .4) / .9), mood='sad')


def B1(c, t, d):
    cheek_bg(c)
    jaw(c, 99)
    neck_spots(c, 99)
    px = 480 + math.sin(t * 9) * 260
    py = 1150 + math.cos(t * 5) * 40
    c.circ(px, py, 150, CREAM, sh=8)
    c.circ(px, py, 110, (236, 226, 190), sh=0, edge=(236, 226, 190))
    for k in range(4):
        arrow(c, (180 + k * 20, 620 + k * 60), (330 + k * 20, 620 + k * 60), 16, TERRA) if t > .3 else None


def B2(c, t, d):
    flat(c, LB, 8)
    n = int(6 + clamp(t / (d * .8)) * 26)
    slab(c, t, sx=0, nb=n, tone=SKIN)
    hx = 540 + math.sin(t * 7) * 250
    cardboard_hand(c, hx, 640, 330, rot=170)


def C1(c, t, d):
    flat(c, KR)
    items = [('b', 250, 520, 7), ('s', 770, 620, -20), ('br', 300, 1000, 30), ('lip', 800, 1050, -35),
             ('b2', 540, 1300, 0), ('cmp', 800, 360, 0)]
    for i, (k, x, y, r) in enumerate(items):
        p = pop(t, .15 + i * .22, .35)
        if p <= 0:
            continue
        dy = (1 - clamp(p, 0, 1)) * -700
        if k == 'b':
            bottle(c, x, y + dy, 330, rot=r, body=PINK, lab=CREAM, brand=False, bulb=dark(PINK, .85))
        elif k == 'b2':
            bottle(c, x, y + dy, 280, rot=r, body=BEIGE, lab=CREAM, brand=False, bulb=TERRA)
        elif k == 's':
            sponge(c, x, y + dy, 280, rot=r)
        elif k == 'br':
            brush(c, x, y + dy, 380, rot=r)
        elif k == 'lip':
            c.rect(x, y + dy, 80, 220, GOLD, rot=r, r=10)
            c.rect(x + 28 * math.sin(math.radians(-r)), y + dy - 140, 66, 100, RED, rot=r, r=14)
        elif k == 'cmp':
            c.circ(x, y + dy, 130, CREAM, sh=8)
            c.circ(x, y + dy, 90, (200, 150, 110), sh=0, edge=(200, 150, 110))


def C2(c, t, d):
    u = t / d
    cheek_bg(c)
    cover = clamp((u - .05) / .25) - clamp((u - .62) / .2)
    jaw(c, 99)
    neck_spots(c, 99)
    if cover > .02:
        for i, (a, rad, r) in enumerate(JS):
            px, py = jaw_pos(i)
            c.circ(px, py, (r + 7) * (1 + .5 * cover), (186, 138, 98), sh=1, edge=(186, 138, 98))
    q = u * 20
    sponge(c, 480 + 220 * math.sin(q), 1120 + 60 * math.cos(q * .7), 380, rot=-20 + 12 * math.sin(q * 1.3))


def D1(c, t, d):
    flat(c, LB, 4)
    pan = t * 260
    c.rect(1100 - pan * .0, 520, 3200, 26, KR_D, sh=6)
    cols = [(240, 214, 200), CREAM, (236, 226, 222), (232, 205, 180), PINK, (245, 238, 226), (240, 214, 200)]
    for i in range(14):
        x = 140 + i * 330 - pan
        col = cols[i % 7]
        bottle(c, x, 420, 260, body=col, lab=dark(col, .92), brand=False, bulb=dark(col, .85), rot=(-1) ** i * 2)
    for i in range(14):
        x = 200 + i * 330 - pan * 1.2
        c.rect(x, 960, 220, 220, [(244, 224, 210), (236, 210, 190), (250, 232, 216)][i % 3], r=16, sh=8)
    c.label('peaux claires', 540, 1180, size=84, bg=CREAM, sc=pop(t, .5, .35), rot=-2)


def D2(c, t, d):
    u = t / d
    cheek_bg(c)
    jaw(c, 99)
    p = ease(u / .4)
    bottle(c, 240 + 320 * p, 240 + 780 * p, 380, rot=-20 + 190 * p, body=CREAM, lab=dark(CREAM, .92), brand=False,
           bulb=PINK)
    if u > .4:
        for k in range(11):
            x = 280 + k * 40
            y = 980 + (36 if k % 2 else -36) + math.sin(t * 24) * 5
            if k:
                c.strip((280 + (k - 1) * 40, 980 + (36 if (k - 1) % 2 else -36)), (x, y), 14, RED, sh=0)
        flame(c, 500, 1180, 90)
        burst(c, 500, 1100, t, d * .4, n=10, speed=500)


def D3(c, t, d):
    flat(c, LB, 3)
    avatar(c, 540, 840, 360, TONES[1], hair_style=0, mood='n')
    for i in range(3):
        c.circ(420 + i * 120, 1280, 26 * clamp(pop(t, .4 + i * .2, .2), 0, 1.1), (96, 64, 46), sh=3)
    c.arc(540, 1070, 190, 200, 340, 20, RED, sh=0) if False else None


def E1(c, t, d):
    flat(c, KR)
    cols = [PINK, SAGE, KR_L, TERRA, CREAM, SUN, BEIGE, PINK, SAGE, CREAM]
    rnd = random.Random(5)
    for i in range(10):
        st = .1 + i * .2
        p = clamp((t - st) / .5)
        if p <= 0:
            continue
        x = 140 + rnd.randint(0, 800)
        y = 260 + rnd.randint(0, 1200)
        r = rnd.randint(-70, 70)
        bottle(c, x, y - (1 - back(p)) * 900, 260, rot=r, body=cols[i], lab=CREAM, brand=False, bulb=cols[(i + 3) % 10])


def E2(c, t, d):
    cheek_bg(c)
    jaw(c, 99, k=1 + .8 * t / d)
    neck_spots(c, 99)
    brush(c, 480 + math.sin(t * 13) * 200, 1100 + math.cos(t * 10) * 80, 460, rot=-25)


def F1(c, t, d):
    flat(c, (232, 190, 120))
    sun(c, 540, 560, 230 * clamp(pop(t, .05, .5), 0, 1.1), rot=t * 50)
    c.ell(540, 1380, 460, 200, SKIN, sh=10)
    for i, (dx, dy) in enumerate([(-160, 0), (40, -60), (170, 40), (-40, 70)]):
        pastille(c, 540 + dx, 1380 + dy, 30 * clamp(pop(t, .6 + i * .22, .3), 0, 1.15))
    for k in range(5):
        c.strip((540 - 200 + k * 100, 880), (540 - 200 + k * 100, 1040 + 20 * math.sin(t * 8 + k)), 10, SUN, sh=0)


def F2(c, t, d):
    flat(c, LB, 3)
    c.poly([(240, 300), (480, 300), (520, 1500), (260, 1500)], SKIN, sh=12)
    c.ell(390, 1520, 150, 60, SKIN, sh=6)
    yy = 450 + ((t * 600) % 800)
    razor(c, 400, yy, 330, rot=90 if False else 0)
    for i in range(7):
        py = 380 + i * 160
        if yy > py:
            pastille(c, 330 + (i % 2) * 120, py, 18)
    c.rect(780, 900, 250, 700, KR_D, r=14, sh=6)


def F3(c, t, d):
    flat(c, LB, 3)
    c.ell(540, 1250, 520, 380, SKIN, sh=12)
    c.poly([(300, 700), (360, 700), (700, 1400), (630, 1420)], SAGE, sh=6)
    x = 520 + math.sin(t * 12) * 60
    c.strip((x - 120, 920), (x + 40, 1060), 100, SAGE, sh=6)
    for k in range(3):
        arrow(c, (x - 180, 780 + k * 70 + 90), (x - 40, 780 + k * 70 + 90), 14, TERRA)
    for i, (dx, dy) in enumerate([(-150, -30), (120, 40), (-60, 110), (190, -80)]):
        pastille(c, 540 + dx, 1100 + dy, 28 * clamp(pop(t, .5 + i * .2, .3), 0, 1.15))
    c.label('Protection solaire quotidienne recommandée', 540, 1620, size=40, w='b', bg=SAGE, fg=CREAM, padx=26,
            pady=14, sc=pop(t, .6, .3), maxw=980)


def G1(c, t, d):
    bath_bg(c, 6)
    woman(c, 540, t, up=0.0, mood='smile' if t > d * .55 else 'n', spots=True)
    c.label('', 0, 0, sc=0)


def G2(c, t, d):
    flat(c, LB, 8)
    lift = ease((t - .3) / 1.3)
    slab(c, t, sx=lift * 800, nb=20, shake=1)
    mx = 540 + 100 * math.sin(t * 1.5)
    c.circ(mx, 860, 200, (250, 244, 225, 120), sh=10, edge=GREY)
    c.arc(mx, 860, 200, 0, 360, 26, GREY, sh=0)
    c.strip((mx + 140, 1000), (mx + 280, 1150), 38, GREY, sh=5)
    arrow(c, (540, 330), (540, 620), 32, RS)


def H1(c, t, d):
    flat(c, LB, 2)
    tones = [(176, 122, 86), (130, 84, 56), (100, 62, 40)]
    for i, tone in enumerate(tones):
        p = clamp(pop(t, .2 + i * .45, .5), 0, 1.1)
        avatar(c, 540, 380 + i * 480 + 80 * (1 - p), 160 * p, tone, hair_style=i)
        for k in range(3):
            pastille(c, 540 + 170 + k * 30, 380 + i * 480 + k * 20, 14 * clamp(p, 0, 1), SPOT) if False else None


def H2(c, t, d):
    flat(c, (205, 165, 112), 2)
    c.circ(540, 900, 420, KR_L, sh=12)
    c.arc(540, 900, 396, 0, 360, 12, KR_D, sh=0)
    c.circ(540, 900, 130, (150, 100, 66), sh=6)
    for i in range(28):
        a = t * (.9 + (i % 3) * .35) + i * 0.4
        r = 60 + (i % 7) * 48
        ball(c, 540 + r * math.cos(a), 900 + r * math.sin(a), 17)


def I1(c, t, d):
    cheek_bg(c)
    c.circ(480, 1000, 260, (126, 80, 52), sh=0, edge=(126, 80, 52))
    icons = [(150, 620), (880, 640), (130, 1380), (900, 1360)]
    for i, (ix, iy) in enumerate(icons):
        ph = (t * 1.5 + i * .25) % 1.0
        hit = ease(1 - abs(ph - .5) * 2)
        px = ix + (480 - ix) * .42 * hit
        py = iy + (1000 - iy) * .42 * hit
        if i == 0:
            pimple(c, px, py, 90)
        elif i == 1:
            sun(c, px, py, 70, rot=t * 40)
        elif i == 2:
            razor(c, px, py, 210, rot=35)
        else:
            pill(c, px, py, 280, rot=-20 + 10 * hit)
    for i in range(int(3 + t * 6)):
        a = i * 2.4
        pastille(c, 480 + (14 + 10 * math.sqrt(i)) * math.cos(a), 1000 + (14 + 10 * math.sqrt(i)) * math.sin(a), 20)


def I2(c, t, d):
    flat(c, (150, 100, 66), 0)
    c.circ(540, 960, 500, SKIN, sh=14)
    n = int(clamp(t / d) * 40) + 4
    for i in range(n):
        a = i * 2.4
        r = 16 + 13 * math.sqrt(i) * 1.5
        pastille(c, 540 + r * math.cos(a), 960 + r * math.sin(a), 24 + 6 * math.sin(i), RS)
    burst(c, 540, 960, t, 0.0, n=18, speed=700)


def J1(c, t, d):
    flat(c, LB, 8)
    n = 14 + int(ease(t / d) * 20)
    slab(c, t, sx=0, nb=0)
    for i in range(n):
        a = i * 2.39
        r = 14 * math.sqrt(i) * 3.2
        pastille(c, 540 + clamp(r * math.cos(a), -400, 400), 1015 + r * math.sin(a) * .25 + math.sin(t * 11 + i) * 4, 17, SPOT)
    for i in range(5):
        arrow(c, (190 + i * 170, 520 + 14 * math.sin(t * 8)), (190 + i * 170, 740 + 14 * math.sin(t * 8)), 20, RS)


def J2(c, t, d):
    flat(c, LB, 3)
    for i, (x, sc_, tone) in enumerate([(270, .6, (176, 122, 86)), (770, 1.0, (100, 62, 40))]):
        c.rect(x, 1000, 440, 320, KR, r=12, sh=8)
        c.ell(x, 840, 220, 80, tone, sh=6)
        for k in range(int(8 * sc_ * 2)):
            a = k * 2.4
            pastille(c, x + 70 * sc_ * math.sqrt(k) * .9 * math.cos(a), 960 + 30 * math.sin(a), 14 * (.7 + .5 * sc_), SPOT)
    c.label('+ fort', 770, 600, size=96, bg=TERRA, fg=CREAM, sc=pop(t, .7, .35), rot=4)


def K1(c, t, d):
    flat(c, KR)
    sc_ = t * 520
    for i in range(8):
        x = (150 + i * 440 - sc_) % (8 * 440) - 440
        c.rect(x, 850, 360, 560, CREAM, r=16, sh=10)
        c.rect(x, 640, 360, 110, dark(CREAM, .9), r=10, sh=0)
        for gx in range(4):
            for gy in range(5):
                c.rect(x - 130 + gx * 87, 780 + gy * 80, 62, 56, dark(CREAM, .84), r=4, sh=0)
        c.arc(x + 60 - (i % 3) * 60, 930, 40, 0, 360, 14, RS, sh=0)


def K2(c, t, d):
    flat(c, LB, 8)
    slab(c, t, sx=0, nb=0)
    pastille(c, 540, 840, 54, SPOT)
    bx = 540 + 300 * math.sin(t * 4)
    p = abs(math.sin(t * 4))
    bottle(c, bx, 560 + 150 * p * 0, 360, rot=70 + 20 * math.sin(t * 4))


def L1(c, t, d):
    flat(c, (205, 165, 112), 3)
    u = t / d
    ang = -ease(clamp(u * 1.2)) * 180
    rate = 1 - .9 * ease(clamp(u * 1.2))
    pipe(c, 540, 100, 540, 520, 130)
    gear(c, 540, 700, 330, rot=ang, col=TERRA)
    balls_flow(c, t, 540, 520, 540, 1500, rate, n=20, speed=.55, r=22)


def L2(c, t, d):
    flat(c, LB, 2)
    tones = [(176, 122, 86), (130, 84, 56), (100, 62, 40)]
    for i, tone in enumerate(tones):
        x = 190 + i * 350
        c.rect(x, 800, 300, 700, tone, r=20, sh=8)
        avatar(c, x, 560, 120, tone, hair_style=i)
        p = clamp(pop(t, .8 + i * .4, .35), 0, 1.1)
        c.circ(x, 1100, 70 * p, SAGE, sh=4)
        c.strip((x - 28 * p, 1100), (x - 8 * p, 1124 * 1.0 if p else 1100), 16 * p, CREAM, sh=0)
        c.strip((x - 8 * p, 1124), (x + 34 * p, 1070), 16 * p, CREAM, sh=0)


def L3(c, t, d):
    bath_bg(c, 6)
    woman(c, 560, t + 3, up=0.0, mood='smile', spots=False)


def M1(c, t, d):
    cheek_bg(c)
    for i, (a, rad, r) in enumerate(JS):
        st = .25 + i * .07
        p = clamp((t - st) / .8)
        px, py = jaw_pos(i)
        if p <= 0:
            pastille(c, px, py, r)
        elif p < 1:
            e = ease(p)
            pastille(c, px + e * 300 * (1 if i % 2 else -1), py - e * 800, r * (1 - .4 * e))
    for i in range(5):
        star(c, 200 + i * 170, 1000 - ((t * 200 + i * 90) % 400), 28, rot=t * 90) if t > d * .6 else None


def N1(c, t, d):
    flat(c, LB, 3)
    s_ = slam(t, .1, .2, 2.6)
    nosign(c, 540, 860, 330 * s_)
    flame(c, 540, 860, 240 * s_)
    burst(c, 540, 860, t, .3, n=14)


def N2(c, t, d):
    flat(c, LB, 3)
    s_ = slam(t, .1, .2, 2.6)
    nosign(c, 540, 860, 330 * s_)
    brush(c, 540, 860, 330 * s_, rot=-30)
    burst(c, 540, 860, t, .3, n=14)


def N3(c, t, d):
    flat(c, (205, 165, 112), 3)
    u = t / d
    rate = 1 - ease((u - .55) / .12)
    c.rect(220, 900, 380, 560, (150, 150, 156), r=26)
    for i in range(18):
        pastille(c, 110 + (i % 4) * 66, 720 + (i // 4) * 70, 20, SPOT)
    pipe(c, 420, 1050, 960, 1050, 100)
    balls_flow(c, t, 420, 1050, 960, 1050, rate, n=9, speed=.8, r=20)
    gear(c, 640, 1050, 150, rot=-ease((u - .5) / .2) * 160, col=TERRA)
    c.label('à la source', 540, 1570, size=82, bg=SAGE, fg=CREAM, sc=pop(t, .6, .4))


def O1(c, t, d):
    flat(c, LB, 3)
    c.rect(540, 1300, 700, 440, KR_D, r=12)
    cols = [TERRA, SAGE, CREAM, BROWN]
    for i in range(4):
        p = pop(t, .15 + i * .3, .4)
        if p > 0:
            x = 200 + i * 227
            y = 1260 - 700 * clamp(p, 0, 1.08)
            rot = (-1) ** i * 6 + (i - 1.5) * 5
            c.rect(x, y, 190, 380, cols[i], rot=rot, r=14)
            c.text(str(i + 1), x, y, size=150, fill=CREAM if i != 2 else BROWN, rot=rot)
    c.rect(540, 1350, 700, 340, KR_D, r=12)


def P1(c, t, d):
    flat(c, LB, 3)
    bottle(c, 800, 900, 560, rot=10, body=(70, 40, 22), lab=CREAM, brand=False)
    s_ = slam(t, .15)
    c.label('10 %', 440, 700, size=220, bg=TERRA, fg=CREAM, sc=s_, rot=-4, padx=60, pady=30)
    burst(c, 440, 700, t, .35)


def P2(c, t, d):
    flat(c, (205, 165, 112), 3)
    u = t / d
    ang = -ease(clamp(u * 1.3)) * 150
    rate = 1 - .9 * ease(clamp(u * 1.3))
    pipe(c, 540, 100, 540, 520, 130)
    gear(c, 540, 700, 300, rot=ang, col=TERRA)
    balls_flow(c, t, 540, 520, 540, 1400, rate, n=18, speed=.55, r=22)


def Q1(c, t, d):
    flat(c, LB, 3)
    c.rect(300, 860, 480, 560, KR_D, r=22)
    c.poly([(110, 580), (500, 580), (430, 330), (180, 330)], dark(KR_D, 1.1))
    pipe(c, 540, 1000, 1100, 1000, 80)
    balls_flow(c, t, 540, 1000, 1100, 1000, 1.0, n=10, speed=.8, r=22)


def Q2(c, t, d):
    flat(c, LB, 3)
    u = t / d
    stop = ease((u - .2) / .15)
    pipe(c, 100, 1250, 1000, 1250, 80)
    balls_flow(c, t, 100, 1250, 600, 1250, 1 - stop, n=7, speed=.7, r=22)
    enzyme(c, 620 + (1 - ease(u / .2)) * 600, 760, 640, stop=stop)
    c.label('tyrosinase', 540, 1570, size=96, bg=SAGE, fg=CREAM, sc=pop(t, .7, .4), rot=2)


def R1(c, t, d):
    flat(c, LB, 8)
    slab(c, t, sx=0, nb=0)
    up = math.sin(clamp(t / d * 3) * math.pi) * 90
    pastille(c, 540, 840, 100, SPOT)
    c.strip((410, 300), (505, 800 - up), 48, GREY)
    c.strip((670, 300), (575, 800 - up), 48, GREY)


def R2(c, t, d):
    flat(c, LB, 8)
    slab(c, t, sx=0, nb=0)
    r = 100 * (1 - .55 * ease(t / d))
    pastille(c, 540, 850, r, SPOT)
    for i in range(6):
        star(c, 540 + 250 * math.cos(t * 2 + i), 850 + 200 * math.sin(t * 2 + i), 22, rot=t * 100)
    c.label('tenaces', 540, 1570, size=86, bg=SAGE, fg=CREAM, sc=pop(t, .4, .4), rot=1)


def S1(c, t, d):
    flat(c, LB, 3)
    c.ell(540, 1280, 460, 120, (118, 73, 46), sh=4)
    c.ell(540, 1000, 360, 400, SKIN)
    n = int(clamp(t / (d * .9)) * 56)
    bw, bh = 110, 56
    k = 0
    for r_ in range(8):
        for q in range(7):
            if k >= n:
                break
            if r_ % 2 and q == 6:
                continue
            x = 130 + q * bw + (bw / 2 if r_ % 2 else 0) + 30
            c.rect(x, 1290 - r_ * bh, bw - 4, bh - 4, KR_D if (q + r_) % 2 else TERRA, r=4, sh=2)
            k += 1


def S2(c, t, d):
    flat(c, LB, 3)
    c.ell(540, 1280, 460, 120, (118, 73, 46), sh=4)
    c.ell(540, 1000, 360, 400, SKIN)
    k = 0
    for r_ in range(8):
        for q in range(7):
            if r_ % 2 and q == 6:
                continue
            x = 130 + q * 110 + (55 if r_ % 2 else 0) + 30
            c.rect(x, 1290 - r_ * 56, 106, 52, KR_D if (q + r_) % 2 else TERRA, r=4, sh=2)
    s_ = t * 5
    sun(c, 160 + 120 * abs(math.sin(s_)), 420 + 60 * math.sin(s_ * 2), 80, rot=t * 40)
    razor(c, 920 - 100 * abs(math.sin(s_ + 1)), 520, 220, rot=45)


def T1(c, t, d):
    flat(c, KR)
    cols = [PINK, SAGE, CREAM, TERRA, KR_D, BEIGE, SAGE, PINK, TERRA, CREAM]
    for i in range(10):
        p = pop(t, .1 + i * .2, .35)
        if p > 0:
            gx = 150 + (i % 5) * 195
            gy = 380 + (i // 5) * 560
            bottle(c, gx, gy - (1 - clamp(p, 0, 1)) * 800, 240, body=cols[i], lab=dark(cols[i], .9), brand=False,
                   bulb=cols[(i + 3) % 10], rot=(-1) ** i * 4)


def T2(c, t, d):
    flat(c, LB, 3)
    u = t / d
    cols = [PINK, SAGE, CREAM, TERRA, KR_D]
    for i in range(5):
        go = ease((u - .3 - i * .06) / .25)
        bottle(c, 160 + i * 200 - go * 1200, 420, 240, body=cols[i], lab=dark(cols[i], .9), brand=False, bulb=cols[i],
               rot=(-1) ** i * 5)
    pt = pop(t, .15, .35)
    if pt > 0 and u < .75:
        c.label('€€€', 540, 960, size=210, bg=SUN, fg=BROWN, sc=pt, rot=4, padx=70)
        if u > .5:
            c.strip((260, 1130), (820, 790), 26, RED, sh=3)
    if u > .6:
        avatar(c, 540, 1300, 220 * clamp(pop(t, d * .6, .4), 0, 1.1), TONES[0], hair_style=2)


def U1(c, t, d):
    for i in range(14):
        a = i * math.pi / 7 + t * .35
        c.strip((540, 960), (540 + 1300 * math.cos(a), 960 + 1300 * math.sin(a)), 90,
                (140, 168, 130) if i % 2 else (126, 156, 118), sh=0, edge=(126, 156, 118), jit=False)
    p = clamp(pop(t, 0, .7), 0, 1.08)
    bottle(c, 540, 1250 - 140 * (1 - p), 760 * p)
    for i in range(6):
        a = t * 1.5 + i * 1.047
        star(c, 540 + 440 * math.cos(a), 900 + 420 * math.sin(a), 36 + 10 * math.sin(t * 6 + i), rot=t * 120)


def U2(c, t, d):
    flat(c, (140, 168, 130), 0)
    bottle(c, 540, 1150, 860)
    cols = [TERRA, SAGE, CREAM, BROWN]
    for i in range(4):
        q = ease((t - (.1 + i * .4)) / .55)
        if q < 1:
            sx = [100, 980, 100, 980][i]
            sy = [300, 300, 1650, 1650][i]
            c.rect(sx + (540 - sx) * q, sy + (1000 - sy) * q, 170 * (1 - .5 * q), 300 * (1 - .5 * q), cols[i],
                   rot=q * 220, r=10)


def V1(c, t, d):
    flat(c, LB, 3)
    s_ = slam(t, .1, .25, 2.6)
    stamp(c, 540, 960, 400, '94 %', sc=s_, size=240, rot=-6)
    burst(c, 540, 960, t, .35, n=20, speed=950)
    c.label('test consommateur, 4 semaines', 540, 1500, size=44, w='b', bg=CREAM, padx=26, pady=14, maxw=980,
            sc=pop(t, .8, .3))


def V2(c, t, d):
    flat(c, LB, 3)
    for i, tone in enumerate([TONES[0], TONES[1], TONES[3]]):
        p = clamp(pop(t, .15 + i * .3, .4), 0, 1.1)
        avatar(c, 190 + i * 350, 760, 150 * p, tone, hair_style=i)
    for i in range(7):
        heart(c, 110 + i * 140 + math.sin(t * 4 + i) * 20, 1500 - ((t * 330 + i * 190) % 1300), 90,
              TERRA if i % 2 else RED)


def W1(c, t, d):
    flat(c, LB, 3)
    p1 = pop(t, .1, .45)
    p2 = pop(t, .6, .45)
    bottle(c, 270, 960, 540 * clamp(p1, 0, 1.1))
    bottle(c, 800, 960, 540 * clamp(p2, 0, 1.1))
    c.circ(540, 900, 70 * clamp(pop(t, .5, .3), 0, 1.1), TERRA)
    if t > .5:
        c.text('+', 540, 896, size=110, fill=CREAM)


def W2(c, t, d):
    flat(c, LB, 3)
    bottle(c, 190, 1000, 420)
    bottle(c, 440, 1000, 420)
    gx = 820
    gy = 1100 + (1 - ease(t / .5)) * -900
    giftbox(c, gx, gy, 380, lid=26 * abs(math.sin(t * 6)) * (1 if t > .8 else 0))
    c.label('offert', 780, 640, size=100, bg=SAGE, fg=CREAM, sc=pop(t, .9, .35), rot=5)
    burst(c, gx, 1100, t, .45, n=14)


def X1(c, t, d):
    flat(c, LB, 3)
    avatar(c, 540, 900, 380, TONES[1], hair_style=1, mood='n')
    c.strip((390, 700), (520, 676 - (36 if (t % 1.2) > .35 else 0)), 26, HAIR, sh=0)
    c.label('?', 900, 560, size=240, bg=KR_L, sc=pop(t, .4, .3), rot=8)


def X2(c, t, d):
    flat(c, LB, 3)
    s_ = slam(t, .15, .22, 2.6)
    stamp(c, 540, 960, 400, '90\njours', col=SAGE, sc=s_, size=170, rot=-8)
    burst(c, 540, 960, t, .37, n=18, speed=900)


def X3(c, t, d):
    flat(c, LB, 3)
    c.rect(540, 1050, 800, 460, KR_D, r=14)
    c.poly([(140, 820), (940, 820), (900, 780), (180, 780)], dark(KR_D, 1.12))
    c.rect(540, 1050, 120, 460, CREAM, sh=0)
    p = pop(t, .2, .4)
    c.circ(540, 800, 90 * clamp(p, 0, 1.1), SAGE, sh=5)
    c.label('satisfait ou remboursé', 540, 1580, size=64, bg=CREAM, sc=pop(t, .6, .35), rot=-2, maxw=980)


def Y1(c, t, d):
    flat(c, LB, 3)
    tear = clamp(t / (d * .8)) * 3.0
    calendar(c, 540, 840, 760, tear, pages=4)
    c.label('3 mois', 540, 1590, size=110, bg=SAGE, fg=CREAM, sc=pop(t, .5, .35), rot=-2)


def Y2(c, t, d):
    flat(c, LB, 3)
    c.rect(540, 1350, 640, 380, KR_D, r=12)
    for i in range(7):
        q = clamp((t - (.1 + i * .22)) / .8)
        if 0 < q < 1:
            bill(c, 140 + 400 * ease(q), 300 + 1000 * ease(q) - 250 * math.sin(q * math.pi), 1.2, rot=-30 + 60 * q)
    c.rect(540, 1230, 640, 220, KR_D, r=12)
    c.text('remboursé', 540, 1150, size=84, fill=CREAM)


def Z1(c, t, d):
    c.rect(540, 960, 1100, 2000, TERRA, sh=0, jit=False)
    p = clamp(pop(t, .1, .5), 0, 1.1)
    c.circ(540, 600, 250 * p, CREAM, sh=10)
    c.arc(540, 600, 214 * p, 0, 360, 12, TERRA, sh=0)
    c.text('M', 540, 600, size=int(280 * p), fill=BROWN)
    c.label('MELA SKIN', 540, 960, size=120, bg=CREAM, sc=pop(t, .5, .4), rot=-2)
    c.text('L\'expertise pensée pour vous', 540, 1080, size=50, fill=CREAM, w='b', sc=pop(t, .9, .4))
    bs = 1.0 + .06 * abs(math.sin(t * 5))
    c.label('Sérum Anti-Taches', 540, 1250, size=82, bg=SAGE, fg=CREAM, sc=pop(t, 1.2, .4) * bs, rot=1.5)
    if t > 1.8:
        hand(c, 700, 1500 + 14 * math.sin(t * 6), 240, rot=-15, sk=(176, 122, 86))


# ---------------------------------------------------------------- liste des plans
# (début, fin, fonction, caméra, transition)
# caméra = (z0, z1, fx0, fy0, fx1, fy1, rot0, rot1, secousse)
def cam(z0=1.0, z1=1.0, f0=(540, 960), f1=None, r0=0.0, r1=0.0, sh=0.0):
    f1 = f1 or f0
    return (z0, z1, f0[0], f0[1], f1[0], f1[1], r0, r1, sh)


SHOTS = [
    (0.0, 1.7, A1, cam(1.35, 1.0, (480, 1000), (540, 960)), 'cut'),
    (1.7, 3.5, A2, cam(1.0, 1.3, (540, 960), (560, 760)), 'slideR'),
    (3.5, 5.6, B1, cam(1.0, 1.18, (480, 1100), (420, 1180), r0=-2, r1=2), 'slide'),
    (5.6, 8.6, B2, cam(1.45, 1.0, (560, 880), (540, 960)), 'up'),
    (8.6, 10.5, C1, cam(1.0, 1.2, (540, 800), (540, 1000), r0=4, r1=-4), 'flash'),
    (10.5, 13.6, C2, cam(1.0, 1.35, (480, 900), (480, 1150), sh=4), 'slideR'),
    (13.6, 16.8, D1, cam(1.0, 1.0), 'slide'),
    (16.8, 18.9, D2, cam(1.2, 1.0, (480, 900), (540, 960), r0=-3), 'cut'),
    (18.9, 20.8, D3, cam(1.0, 1.25, (540, 900), (540, 860)), 'up'),
    (20.8, 23.3, E1, cam(1.1, 1.0, (540, 900), (540, 960), sh=6), 'burst'),
    (23.3, 26.2, E2, cam(1.0, 1.25, (480, 1000), (480, 1100), sh=6), 'slide'),
    (26.2, 28.1, F1, cam(1.0, 1.2, (540, 800), (540, 900)), 'flash'),
    (28.1, 29.9, F2, cam(1.15, 1.0, (400, 700), (540, 960), r0=3), 'slideR'),
    (29.9, 31.6, F3, cam(1.0, 1.2, (540, 1000), (540, 1150)), 'up'),
    (31.6, 34.0, G1, cam(1.0, 1.35, (540, 960), (540, 760)), 'slide'),
    (34.0, 37.2, G2, cam(1.0, 1.4, (540, 900), (540, 900)), 'cut'),
    (37.2, 39.6, H1, cam(1.0, 1.1), 'slideR'),
    (39.6, 42.0, H2, cam(1.4, 1.0, (540, 900), (540, 960), r0=0, r1=0), 'flash'),
    (42.0, 45.5, I1, cam(1.0, 1.25, (480, 1000), (480, 1000), sh=3), 'slide'),
    (45.5, 49.0, I2, cam(1.0, 1.5, (540, 960), (540, 960), sh=8), 'burst'),
    (49.0, 52.0, J1, cam(1.5, 1.2, (540, 1000), (540, 900)), 'up'),
    (52.0, 55.0, J2, cam(1.0, 1.2, (540, 900), (700, 900)), 'slideR'),
    (55.0, 57.2, K1, cam(1.0, 1.0), 'cut'),
    (57.2, 59.2, K2, cam(1.3, 1.0, (540, 900), (540, 960), sh=5), 'slide'),
    (59.2, 62.6, L1, cam(1.3, 1.0, (540, 700), (540, 960)), 'flash'),
    (62.6, 65.6, L2, cam(1.0, 1.15, (540, 800), (540, 900)), 'slideR'),
    (65.6, 68.6, L3, cam(1.0, 1.4, (540, 960), (540, 700)), 'up'),
    (68.6, 71.7, M1, cam(1.0, 1.3, (480, 1000), (480, 900), r0=-2, r1=2), 'slide'),
    (71.7, 73.7, N1, cam(1.0, 1.0, sh=10), 'cut'),
    (73.7, 75.7, N2, cam(1.0, 1.0, sh=10), 'cut'),
    (75.7, 79.0, N3, cam(1.0, 1.25, (540, 1000), (640, 1050)), 'slide'),
    (79.0, 81.6, O1, cam(1.15, 1.0, (540, 1000), (540, 960)), 'up'),
    (81.6, 83.6, P1, cam(1.0, 1.2, (540, 800), (520, 800), sh=8), 'flash'),
    (83.6, 85.5, P2, cam(1.0, 1.3, (540, 700), (540, 800)), 'slideR'),
    (85.5, 87.9, Q1, cam(1.2, 1.0, (400, 800), (540, 960)), 'slide'),
    (87.9, 90.2, Q2, cam(1.0, 1.15, (540, 960), (620, 900), sh=4), 'cut'),
    (90.2, 92.6, R1, cam(1.4, 1.1, (540, 850), (540, 900)), 'up'),
    (92.6, 94.9, R2, cam(1.1, 1.3, (540, 900), (540, 850)), 'slideR'),
    (94.9, 98.3, S1, cam(1.0, 1.25, (540, 1100), (540, 1000)), 'slide'),
    (98.3, 102.0, S2, cam(1.0, 1.0, sh=5), 'flash'),
    (102.0, 105.6, T1, cam(1.15, 1.0, (540, 700), (540, 960), sh=4), 'burst'),
    (105.6, 109.0, T2, cam(1.0, 1.15, (540, 800), (540, 1000)), 'slideR'),
    (109.0, 111.9, U1, cam(1.3, 1.0, (540, 1100), (540, 960)), 'up'),
    (111.9, 114.3, U2, cam(1.0, 1.35, (540, 1000), (540, 1000)), 'slide'),
    (114.3, 116.4, V1, cam(1.0, 1.0, sh=10), 'cut'),
    (116.4, 118.4, V2, cam(1.0, 1.15, (540, 1000), (540, 900)), 'slideR'),
    (118.4, 120.3, W1, cam(1.2, 1.0, (540, 900), (540, 960)), 'flash'),
    (120.3, 122.2, W2, cam(1.0, 1.15, (600, 1000), (600, 1000), sh=3), 'slide'),
    (122.2, 124.6, X1, cam(1.0, 1.3, (540, 900), (540, 860), r0=2, r1=-2), 'up'),
    (124.6, 126.9, X2, cam(1.0, 1.0, sh=10), 'cut'),
    (126.9, 129.0, X3, cam(1.2, 1.0, (540, 900), (540, 960)), 'slideR'),
    (129.0, 131.0, Y1, cam(1.0, 1.15, (540, 900), (540, 900)), 'slide'),
    (131.0, 132.8, Y2, cam(1.0, 1.0), 'up'),
    (132.8, 136.7, Z1, cam(1.0, 1.1, (540, 960), (540, 1000)), 'flash'),
]
