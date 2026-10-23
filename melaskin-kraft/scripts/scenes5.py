import math, random
from kraft import *
from kraft import textimg_stroke
from props import (sun, razor, pimple, pill, brush, sponge, flame, nosign, gear, ball, balls_flow, pipe, hand, star,
                   heart, calendar, giftbox, stamp, bill, enzyme, arrow, bottle)
from scenes2 import RS, TILE
from scenes3 import cardboard_hand, GOLD
from scenes4 import (flat, burst, slam, cam, E1 as _E1_old, N1, N2, O1, P1, T1, U1, U2, V1, W1, W2, X2, X3, Y1, Y2, Z1,
                     LB)
from portrait import portrait, tache, spots_cheeks, CHEEK_T, SPOT_K

T0, T1_, T2_, T3_ = CHEEK_T            # tons de peau mate -> foncée
SK = (118, 76, 50)                      # derme
SK_D = (92, 58, 38)
SK_DD = (70, 42, 28)


def spot_w(cx, cy, s, turn, dx, dy):
    return cx + dx * s + turn * .11 * s * .35, cy + dy * s


def pops(t, t0, gap, items, k=1.0):
    out = []
    for i, (dx, dy, r) in enumerate(items):
        p = clamp(pop(t, t0 + i * gap, .28), 0, 1.15)
        out.append((dx, dy, r * p * k))
    return out


def badge(c, n, t, x=140, y=170):
    p = clamp(pop(t, .05, .35), 0, 1.15)
    if p <= 0:
        return
    c.circ(x, y, 86 * p, TERRA, sh=8)
    c.arc(x, y, 72 * p, 0, 360, 6, CREAM, sh=0)
    c.text(str(n), x, y, size=int(96 * p), fill=CREAM)


def tile(c, cx, cy, w, h, tone=SK, r=36):
    c.rect(cx, cy, w, h, tone, r=r, sh=12)
    rr = random.Random(11)
    for _ in range(26):
        x = cx + rr.uniform(-w / 2 + 40, w / 2 - 40)
        y = cy + rr.uniform(-h / 2 + 40, h / 2 - 40)
        c.d.line((x, y, x + rr.uniform(16, 44), y + rr.uniform(-4, 4)), fill=dark(tone, .88) + (255,), width=3)


def face_cu(c, tone=T1_, turn=.4, expr='n', spots=(), s=560, cy=900, cx=540, hair=0, top=SAGE, **k):
    portrait(c, cx, cy, s, tone=tone, turn=turn, hair=hair, expr=expr, spots=spots, top=top, **k)


# ====================================================================== plans
def A1(c, t, d):
    flat(c, LB)
    face_cu(c, T1_, .45, 'n', pops(t, .2, .07, spots_cheeks(1.9), 1.0), s=600, cy=950)
    s_ = slam(t, .3)
    if s_:
        c.blit(textimg_stroke('5', 520, CREAM, TERRA, 12, 'x'), 880, 300, sc=s_, shadow=True)
    burst(c, 880, 300, t, .5)


def A2(c, t, d):
    flat(c, KR_L, 4)
    cardboard_hand(c, 600, 1500, 380, rot=0)
    c.rect(540, 1180, 120, 520, GOLD, r=40, sh=10)
    c.circ(540, 760, 400, GREY, sh=14)
    c.circ(540, 760, 366, (238, 236, 226), sh=0, edge=(238, 236, 226))
    portrait(c, 540, 780, 250, tone=T1_, turn=-.4, hair=1, expr='sad', spots=spots_cheeks(1.8), top=TERRA)
    c.arc(540, 760, 388, 0, 360, 22, KR_D, sh=0)


def B1(c, t, d):
    flat(c, KR_L, 4)
    tile(c, 540, 900, 900, 700, SK)
    tache(c, 540, 900, 150)
    for i, (dx, dy, r) in enumerate([(-250, -180, 40), (230, 200, 46), (-190, 230, 30)]):
        tache(c, 540 + dx, 900 + dy, r)
    ex = 540 + math.sin(t * 9) * 250
    ey = 900 + math.cos(t * 6) * 60
    c.rect(ex, ey, 420, 240, PINK, rot=-18 + 6 * math.sin(t * 9), r=26, sh=12)
    c.rect(ex, ey - 8, 420, 90, (70, 110, 150), rot=-18 + 6 * math.sin(t * 9), r=18, sh=0)
    rr = random.Random(int(t * 12))
    for i in range(7):
        c.rect(ex + rr.uniform(-210, 210), ey + 160 + rr.uniform(-20, 80), 24, 14, PINK, rot=rr.uniform(0, 90), sh=2)
    badge(c, 1, t)


def B2(c, t, d):
    flat(c, (96, 66, 44))
    top = 520
    c.rect(540, top + 80, 1120, 160, T1_, sh=0, jit=False)          # épiderme
    c.rect(540, top + 360, 1120, 400, SK, sh=0, jit=False)           # derme
    c.rect(540, top + 800, 1120, 500, SK_D, sh=0, jit=False)         # hypoderme
    c.ell(540, top, 160, 56, SPOT_K, sh=0, edge=(30, 15, 8))         # tache en surface
    rr = random.Random(4)
    g = ease(t / d)
    for k in range(7):
        x = 540 + (k - 3) * 110
        pts = [(x, top + 20)]
        for j in range(1, 8):
            pts.append((pts[-1][0] + rr.uniform(-60, 60), pts[-1][1] + 140 * j * .5 * 1.0))
        L = max(2, int(g * len(pts)))
        for a, b in zip(pts[:L], pts[1:L]):
            c.strip(a, b, 26 - k % 3 * 4, SPOT_K, sh=0)
        for j, (px, py) in enumerate(pts[:L]):
            if j and j % 2 == 0:
                c.circ(px, py, 22, (30, 15, 8), sh=2)
    c.rect(540, top - 140, 1120, 280, (226, 194, 144), sh=0, jit=False)
    c.text('surface', 200, top - 60, size=64, fill=BROWN, w='b')
    c.strip((60, top + 6), (1020, top + 6), 8, BROWN, sh=0)


def C1(c, t, d):
    flat(c, LB)
    u = t / d
    sp_ = spots_cheeks(2.0)
    face_cu(c, T1_, .4, 'smile', sp_, s=600, cy=940, hair=1, top=TERRA)
    cover = clamp((u - .1) / .5)
    for i, (dx, dy, r) in enumerate(sp_):
        x, y = spot_w(540, 940, 600, .4, dx, dy)
        if cover > i / len(sp_) * .9:
            c.circ(x, y, r * 600 * 2.4, (184, 134, 96), sh=1, edge=(184, 134, 96))
    q = u * 18
    sponge(c, 700 + 90 * math.sin(q), 1020 + 60 * math.cos(q * .8), 360, rot=-20 + 10 * math.sin(q))
    bottle(c, 160, 360, 300, rot=-10, body=BEIGE, lab=CREAM, brand=False, bulb=TERRA)
    badge(c, 2, t)


def C2(c, t, d):
    flat(c, KR_L, 4)
    tile(c, 540, 860, 900, 760, SK)
    tache(c, 540, 860, 190)
    u = t / d
    lift = ease((u - .35) / .35)
    c.circ(540 + lift * 520, 860 - lift * 560, 250 * (1 - .1 * lift), (186, 140, 100), sh=12)
    c.circ(540 + lift * 520, 860 - lift * 560, 210 * (1 - .1 * lift), (196, 150, 110), sh=0, edge=(196, 150, 110))
    for i, (x, y, k) in enumerate([(210, 1330, 'br'), (760, 1380, 'c')]):
        if k == 'br':
            brush(c, x, y, 360, rot=20)
        else:
            c.circ(x, y, 130, CREAM, sh=8)
            c.circ(x, y, 90, (200, 150, 110), sh=0, edge=(200, 150, 110))
    if u > .55:
        burst(c, 540, 860, t, d * .55, n=12, speed=500)


def D1(c, t, d):
    flat(c, LB, 3)
    shades = [(250, 230, 214), (246, 222, 200), (240, 212, 186), (232, 200, 170), (224, 188, 154), (214, 176, 140),
              (204, 164, 126), (194, 152, 112), (182, 138, 98), (170, 124, 86)]
    for i, col in enumerate(shades):
        p = clamp(pop(t, .15 + i * .14, .3), 0, 1.1)
        x = 130 + (i % 5) * 200
        y = 380 + (i // 5) * 260
        c.rect(x, y, 170 * p, 230 * p, col, r=18, sh=8, rot=(-1) ** i * 2)
    c.rect(540, 640, 940, 14, KR_D, sh=0)
    # emplacement vide pour les peaux foncées
    c.rect(540, 1010, 880, 200, KR, r=14, sh=0, edge=BROWN)
    c.text('?', 540, 1010, size=150, fill=BROWN)
    u = t / d
    sw = ease((u - .35) / .3)
    if u > .3:
        x = 940 - 400 * sw + (60 * math.sin(t * 20) if u > .62 else 0)
        c.rect(x, 1340 - 330 * sw, 190, 240, (122, 78, 50), r=18, sh=12)
        if u > .62:
            c.strip((x - 70, 1180 - 330 * sw * 0), (x + 70, 1330), 26, RED, sh=0)
            c.strip((x + 70, 1180), (x - 70, 1330), 26, RED, sh=0)
    badge(c, 3, t)


def D2(c, t, d):
    flat(c, LB)
    u = t / d
    face_cu(c, T1_, .3, 'wince', spots_cheeks(2.0), s=600, cy=950, hair=2, top=CREAM)
    p = ease(u / .35)
    bottle(c, 800, 150 + 600 * p, 360, rot=160 * p - 20, body=CREAM, lab=dark(CREAM, .92), brand=False, bulb=PINK)
    if u > .35:
        for k in range(10):
            x = 300 + k * 52
            y = 1020 + (34 if k % 2 else -34) + math.sin(t * 24) * 5
            if k:
                c.strip((300 + (k - 1) * 52, 1020 + (34 if (k - 1) % 2 else -34)), (x, y), 14, RED, sh=0)
        flame(c, 330, 1180, 120)
        burst(c, 700, 1000, t, d * .35, n=12, speed=500)


def D3(c, t, d):
    flat(c, KR_L, 4)
    tile(c, 540, 1000, 900, 640, SK)
    tache(c, 540, 1000, 170)
    u = t / d
    bottle(c, 780, 330, 380, rot=140 + 10 * math.sin(t * 5), body=CREAM, lab=dark(CREAM, .92), brand=False, bulb=PINK)
    for k in range(6):
        ph = (t * 1.3 + k * .17) % 1.0
        x = 640 - ph * 20 - 120 * ph * (1 if k % 2 else -1)
        y = 520 + ph * 420
        if ph < .85:
            c.ell(x, y, 16, 24, (250, 244, 225), sh=2)
        else:
            c.ell(x + (150 if k % 2 else -150) * (ph - .85) / .15, 940 + 40 * (ph - .85) / .15, 24, 12, (250, 244, 225), sh=0)
    c.circ(180, 1480, 100 * clamp(pop(t, .5, .3), 0, 1.1), CREAM, sh=8)
    c.text('0', 180, 1480, size=120, fill=RED)


def E1(c, t, d):
    flat(c, KR)
    rnd = random.Random(9)
    kinds = ['bottle', 'jar', 'tube', 'bottle', 'jar', 'tube', 'bottle', 'jar', 'tube', 'bottle', 'jar']
    cols = [PINK, SAGE, TERRA, CREAM, SUN, BEIGE, KR_D, PINK, SAGE, CREAM, TERRA]
    for i in range(11):
        p = clamp((t - (.05 + i * .2)) / .45)
        if p <= 0:
            continue
        x = 130 + rnd.randint(0, 820)
        y = 300 + rnd.randint(0, 1100)
        r = rnd.randint(-60, 60)
        yy = y - (1 - back(p)) * 900
        if kinds[i] == 'bottle':
            bottle(c, x, yy, 280, rot=r, body=cols[i], lab=CREAM, brand=False, bulb=cols[(i + 3) % 11])
        elif kinds[i] == 'jar':
            c.rect(x, yy, 220, 150, cols[i], r=24, sh=8, rot=r)
            c.rect(x, yy - 85, 236, 50, dark(cols[i], .8), r=14, sh=3, rot=r)
        else:
            c.rect(x, yy, 120, 300, cols[i], r=20, sh=8, rot=r)
            c.rect(x, yy + 170, 80, 50, dark(cols[i], .7), r=8, sh=2, rot=r)
    badge(c, 4, t)


def E2(c, t, d):
    flat(c, LB)
    u = t / d
    sp_ = [(dx, dy, r * (1 + .9 * u)) for dx, dy, r in spots_cheeks(2.0)]
    face_cu(c, T1_, -.35, 'wince', sp_, s=600, cy=950, hair=0, top=SUN)
    gx = 440 + math.sin(t * 12) * 160
    gy = 1010 + math.cos(t * 9) * 80
    c.ell(gx, gy, 200, 150, SAGE, rot=15 * math.sin(t * 5), sh=12)
    for k in range(9):
        c.circ(gx - 100 + (k % 3) * 100, gy - 70 + (k // 3) * 70, 12, dark(SAGE, .75), sh=0)
    for k in range(4):
        c.strip((200 + k * 30, 780), (260 + k * 30, 830), 10, RED, sh=0)


def F1(c, t, d):
    flat(c, (234, 196, 128))
    u = t / d
    sp_ = [(dx, dy, r * (1 + .8 * u)) for dx, dy, r in spots_cheeks(2.0)]
    face_cu(c, T1_, -.5, 'wince', sp_, s=560, cy=1000, hair=1, top=TERRA)
    sun(c, 190, 280, 150 * clamp(pop(t, .05, .5), 0, 1.1), rot=t * 50)
    for k in range(7):
        a = math.radians(20 + k * 9)
        p = (t * 1.4 + k * .13) % 1.0
        c.strip((190 + 240 * math.cos(a) * (.4 + p * .8), 280 + 240 * math.sin(a) * (.4 + p * .8)),
                (190 + 240 * math.cos(a) * (.55 + p * .8), 280 + 240 * math.sin(a) * (.55 + p * .8)), 10, SUN, sh=0)
    badge(c, 5, t, 920, 170)


def F2(c, t, d):
    flat(c, KR_L, 4)
    c.poly([(380, 160), (700, 160), (720, 760), (640, 1560), (340, 1560), (400, 760)], T1_, sh=14)
    c.ell(490, 1600, 190, 70, T1_, rot=-6, sh=8)
    y = 1400 - ((t * 700) % 1100)
    for i in range(8):
        py = 1380 - i * 150
        c.circ(470 + math.sin(i) * 40, py, 40 + (i % 2) * 14, CREAM, sh=0, edge=CREAM)
    razor(c, 520 + 30 * math.sin(t * 5), y, 360, rot=0)
    for i in range(8):
        py = 1380 - i * 150
        if py > y + 120:
            tache(c, 440 + (i % 3) * 70, py + 30, 22 + (i % 2) * 8)


def F3(c, t, d):
    flat(c, KR_L, 4)
    c.ell(540, 1100, 620, 480, T1_, sh=14)
    c.poly([(80, 760), (240, 700), (560, 1260), (400, 1360)], SK_D, sh=8)
    x = 380 + math.sin(t * 12) * 110
    c.strip((x - 160, 820), (x + 120, 1250), 130, SAGE, sh=10)
    for k in range(3):
        arrow(c, (x + 140, 960 + k * 80), (x + 310, 960 + k * 80), 16, TERRA)
    for i, (dx, dy) in enumerate([(-60, 90), (60, 160), (150, 40), (-120, 190), (200, 210)]):
        tache(c, 400 + dx + 120, 980 + dy, 32, clamp(pop(t, .5 + i * .2, .3), 0, 1.1))
    c.label('Protection solaire quotidienne recommandée', 540, 1600, size=40, w='b', bg=SAGE, fg=CREAM, padx=26,
            pady=14, sc=pop(t, .6, .3), maxw=980)


def G1(c, t, d):
    flat(c, LB)
    u = t / d
    portrait(c, 540, 700, 460, tone=T2_, turn=.35, hair=0, expr='smile', spots=spots_cheeks(1.9), top=SAGE)
    p = clamp(pop(t, .6, .4), 0, 1.1)
    arrow(c, (540, 1360 - 100 * p), (540, 1500 + 20 * math.sin(t * 7)), 50 * p, RS)


def G2(c, t, d):
    flat(c, (86, 56, 38))
    c.rect(540, 120, 1120, 260, T1_, sh=0, jit=False)
    op = ease(t / .8)
    c.poly([(0, 250), (540 - 20, 250), (540 - 20 - 220 * op * 0.0, 250 + 260 * op), (0, 250 + 260 * op)], SK_D, sh=6) if False else None
    c.rect(270 - 250 * op, 250, 540, 36, dark(T1_, .8), sh=6)
    c.rect(810 + 250 * op, 250, 540, 36, dark(T1_, .8), sh=6)
    # usine sous la peau
    c.rect(540, 1050, 1000, 100, (60, 40, 30), r=40, sh=8)
    for k in range(10):
        c.circ(100 + k * 90, 1100, 22, (90, 70, 56), sh=0)
    for i in range(14):
        x = (i * 110 + t * 190) % 1100
        tache(c, x, 990, 22, halo=False)
    for k, (x, y) in enumerate([(220, 760), (560, 820), (880, 740)]):
        bob = math.sin(t * 5 + k) * 14
        c.circ(x, y + bob, 130, SAGE, sh=10)
        for sx in (-1, 1):
            c.circ(x + sx * 44, y - 20 + bob, 26, CREAM, sh=0)
            c.circ(x + sx * 44, y - 20 + bob, 11, BROWN, sh=0, edge=BROWN)
        c.arc(x, y + 24 + bob, 40, 20, 160, 10, BROWN, sh=0)
        tache(c, x + 130, y + 40 + bob, 34, halo=False)
    gear(c, 940, 560, 120, rot=t * 90, col=TERRA)
    gear(c, 800, 640, 80, rot=-t * 130, col=KR_D)


def H1(c, t, d):
    flat(c, LB, 2)
    cfg = [(190, T0, 0, SAGE, .3), (540, T2_, 1, TERRA, -.2), (890, T3_, 2, SUN, .35)]
    for i, (x, tone, hs, top, tr) in enumerate(cfg):
        p = clamp(pop(t, .15 + i * .35, .5), 0, 1.1)
        c.circ(x, 820, 250 * p, [CREAM, KR_L, (240, 226, 190)][i], sh=8)
        portrait(c, x, 840 + 100 * (1 - clamp(p, 0, 1)), 215 * p, tone=tone, turn=tr, hair=hs, expr='smile', top=top)


def H2(c, t, d):
    flat(c, LB, 2)
    u = t / d
    tone = tuple(int(KR_L[i] + (T2_[i] - KR_L[i]) * ease(u * 1.1)) for i in range(3))
    portrait(c, 540, 900, 520, tone=tone, turn=.3, hair=0, expr='smile', top=SAGE, blush=False)
    c.rect(540, 170, 260, 220, BROWN, r=30, sh=10)
    c.rect(540, 80, 300, 56, dark(BROWN, 1.3), r=14, sh=4)
    for k in range(18):
        ph = (t * .9 + k * .19) % 1.0
        x = 540 + (k % 5 - 2) * 40 + 80 * math.sin(k + t)
        y = 260 + ph * 620
        ball(c, x, y, 17)


def I1(c, t, d):
    flat(c, LB, 3)
    quads = [(290, 520, 'pimple'), (790, 520, 'sun'), (290, 1380, 'razor'), (790, 1380, 'pill')]
    for i, (qx, qy, kind) in enumerate(quads):
        st = .15 + i * .55
        c.rect(qx, qy, 470, 800, SK, r=30, sh=12)
        q = clamp((t - st) / .22)
        hit = q >= 1
        ix = qx + (1 - ease(q)) * (-700 if i % 2 == 0 else 700)
        iy = qy - 180
        if kind == 'pimple':
            pimple(c, ix, iy, 100)
        elif kind == 'sun':
            sun(c, ix, iy, 80, rot=t * 40)
        elif kind == 'razor':
            razor(c, ix, iy + 80, 260, rot=30)
        else:
            pill(c, ix, iy, 330, rot=-20)
        if hit:
            g = clamp((t - st - .22) / .6)
            tache(c, qx, qy + 150, 120 * ease(g) + 8)
            burst(c, qx, qy + 150, t, st + .22, n=8, speed=300, size=14)


def I2(c, t, d):
    flat(c, T1_)
    u = t / d
    p = ease(u)
    tache(c, 540, 960, 80 + 520 * p)
    rr = random.Random(2)
    for k in range(10):
        a = k * .63 + rr.random()
        r = 120 + 700 * p * (.4 + rr.random() * .6)
        tache(c, 540 + r * math.cos(a), 960 + r * math.sin(a), 24 + 18 * rr.random(), p, halo=False)
    burst(c, 540, 960, t, 0.0, n=18, speed=700)


def J1(c, t, d):
    flat(c, KR_L, 4)
    u = t / d
    jar = [(240, 560), (840, 560), (880, 1500), (200, 1500)]
    c.poly(jar, (236, 244, 238, 110), sh=10, edge=GREY)
    for i in range(18):
        x = 300 + (i % 6) * 100 + math.sin(t * 7 + i) * 24
        y = 700 + (i // 6) * 190 + abs(math.sin(t * 9 + i * 1.3)) * -90 + 120
        tache(c, x, y + 400, 38, halo=False)
    c.rect(540, 520 + 8 * math.sin(t * 14), 700, 100, SAGE, r=22, sh=12)
    for i in range(4):
        arrow(c, (320 + i * 130, 760 + 40 * math.sin(t * 8)), (320 + i * 130, 590 + 40 * math.sin(t * 8)), 18, RS)


def J2(c, t, d):
    flat(c, LB, 3)
    for i, (x, tone, k, tr) in enumerate([(290, T0, .8, .3), (790, T3_, 2.4, -.3)]):
        portrait(c, x, 560, 250, tone=tone, turn=tr, hair=i, expr='n', spots=spots_cheeks(k * 1.6), top=[SAGE, TERRA][i])
        gx, gy = x, 1180
        c.circ(gx, gy, 230, CREAM, sh=10)
        c.arc(gx, gy, 200, 180, 360, 38, SAGE, sh=0)
        c.arc(gx, gy, 200, 290, 360, 38, RED, sh=0)
        target = [-60, 50][i]
        ang = -90 + (-90 + (target + 90) * ease((t - .3) / 1.2)) * 0 + (target * ease((t - .3) / 1.2)) + (-80) * (1 - ease((t - .3) / 1.2))
        a = math.radians(ang)
        c.strip((gx, gy), (gx + 180 * math.cos(a), gy + 180 * math.sin(a)), 16, BROWN, sh=3)
        c.circ(gx, gy, 24, BROWN, sh=0)
    c.label('+ fort', 790, 840, size=96, bg=TERRA, fg=CREAM, sc=pop(t, 1.4, .35), rot=4)


def leaf(c, x, y, s, rot=0, col=(214, 120, 40)):
    a = math.radians(rot)
    pts = [(0, -s), (s * .5, -s * .3), (s * .45, s * .4), (0, s), (-s * .45, s * .4), (-s * .5, -s * .3)]
    c.poly([(x + px * math.cos(a) - py * math.sin(a), y + px * math.sin(a) + py * math.cos(a)) for px, py in pts], col, sh=4)


def K1(c, t, d):
    flat(c, KR_L, 2)
    sc_ = t * 480
    icons = ['sun', 'leaf', 'snow', 'flower']
    for k in range(10):
        x = (k * 380 - sc_) % 3800 - 300
        y = 360 + (k % 3) * 520
        kind = icons[k % 4]
        if kind == 'sun':
            sun(c, x, y, 70, rot=t * 40)
        elif kind == 'leaf':
            leaf(c, x, y, 90, rot=t * 60)
        elif kind == 'snow':
            for a in range(6):
                aa = math.radians(a * 60 + t * 30)
                c.strip((x, y), (x + 100 * math.cos(aa), y + 100 * math.sin(aa)), 14, (236, 244, 250), sh=2)
        else:
            for a in range(6):
                aa = math.radians(a * 60)
                c.circ(x + 50 * math.cos(aa), y + 50 * math.sin(aa), 34, PINK, sh=2)
            c.circ(x, y, 26, SUN, sh=2)
    portrait(c, 380, 1000, 360, tone=T1_, turn=.45, hair=0, expr='sad', spots=[(.27, .1, .06)], top=SAGE)
    c.label('des mois', 760, 400, size=84, bg=CREAM, sc=pop(t, .3, .35), rot=3)


def K2(c, t, d):
    flat(c, KR_L, 4)
    tile(c, 540, 1100, 900, 560, SK)
    tache(c, 540, 1100, 150)
    c.rect(540, 930, 760, 40, (230, 240, 236, 150), r=10, sh=8, edge=GREY)
    bottle(c, 540 + 80 * math.sin(t * 3), 360, 380, rot=140)
    for k in range(7):
        ph = (t * 1.2 + k * .15) % 1.0
        if ph < .55:
            c.ell(540 + (k - 3) * 40, 560 + ph * 600, 18, 26, (250, 244, 225), sh=2)
        else:
            q = (ph - .55) / .45
            c.ell(540 + (k - 3) * 40 + (1 if k % 2 else -1) * 330 * q, 905 + 30 * q, 26, 14, (250, 244, 225), sh=0)


def L1(c, t, d):
    flat(c, (205, 165, 112), 3)
    u = t / d
    q = ease(clamp(u * 1.3 - .05))
    for k in range(9):
        h = (420 - 280 * q) * (.6 + .4 * abs(math.sin(t * 4 + k)))
        c.rect(110 + k * 107, 760 - h / 2, 70, h, TERRA, r=10, sh=6)
    cx, cy = 540, 1250
    c.circ(cx, cy, 330, CREAM, sh=14)
    for k in range(13):
        a = math.radians(150 + k * 20)
        c.strip((cx + 260 * math.cos(a), cy + 260 * math.sin(a)), (cx + 300 * math.cos(a), cy + 300 * math.sin(a)), 12,
                RED if k > 9 else SAGE, sh=0)
    a = math.radians(150 + 240 * (1 - q) * .9 + 20)
    c.strip((cx, cy), (cx + 250 * math.cos(a), cy + 250 * math.sin(a)), 28, BROWN, sh=3)
    c.circ(cx, cy, 44, BROWN, sh=0)


def L2(c, t, d):
    flat(c, LB, 2)
    for i, (tone, hs, top) in enumerate([(T0, 0, SAGE), (T2_, 1, TERRA), (T3_, 2, SUN)]):
        x = 190 + i * 350
        c.rect(x, 860, 320, 940, [CREAM, KR_L, (240, 226, 190)][i], r=28, sh=12)
        portrait(c, x, 700, 160, tone=tone, turn=(.3, -.2, .3)[i], hair=hs, expr='smile',
                 spots=[(dx, dy, r * max(0.0, 1 - ease((t - .5) / 2.2) * .85)) for dx, dy, r in spots_cheeks(1.5)], top=top)
        p = clamp(pop(t, 1.0 + i * .4, .35), 0, 1.1)
        c.circ(x, 1180, 74 * p, SAGE, sh=4)
        c.strip((x - 30 * p, 1180), (x - 8 * p, 1206), 18 * p, CREAM, sh=0)
        c.strip((x - 8 * p, 1206), (x + 36 * p, 1150), 18 * p, CREAM, sh=0)


def L3(c, t, d):
    flat(c, (236, 208, 150))
    portrait(c, 540, 860, 560, tone=T2_, turn=.3, hair=1, expr='happy', spots=[(.3, .12, .012)], top=SAGE)
    for i in range(8):
        star(c, 540 + 420 * math.cos(t * 1.2 + i * .78), 760 + 360 * math.sin(t * 1.2 + i * .78), 30, rot=t * 100)


def M1(c, t, d):
    flat(c, LB)
    sp_ = spots_cheeks(2.0)
    portrait(c, 540, 950, 600, tone=T1_, turn=.4, hair=1, expr='smile' if t > d * .5 else 'n', spots=[], top=TERRA)
    for i, (dx, dy, r) in enumerate(sp_):
        x, y = spot_w(540, 950, 600, .4, dx, dy)
        st = .2 + i * .17
        p = clamp((t - st) / .5)
        if p < 1:
            e = ease(p)
            tache(c, x + e * 400 * (1 if i % 2 else -1), y - e * 800 - e * 40, r * 600, 1 - .4 * e)
    if t < d * .6:
        cardboard_hand(c, 800, 1350 - 40 * math.sin(t * 8), 360, rot=-10)


def N3(c, t, d):
    flat(c, (205, 165, 112), 3)
    u = t / d
    off = ease((u - .5) / .12)
    c.rect(540, 1050, 1000, 90, (60, 40, 30), r=40, sh=8)
    for i in range(14):
        x = (i * 110 + t * 220 * (1 - off)) % 1100
        tache(c, x, 990, 24, halo=False)
    c.rect(540, 560, 340, 420, GREY, r=24, sh=12)
    ang = -35 + 70 * off
    a = math.radians(ang - 90)
    c.strip((540, 640), (540 + 240 * math.cos(a), 640 + 240 * math.sin(a)), 40, RED, sh=6)
    c.circ(540 + 240 * math.cos(a), 640 + 240 * math.sin(a), 56, RED, sh=6)
    c.circ(540, 640, 48, BROWN, sh=2)
    c.label('OFF' if off > .5 else 'ON', 540, 450, size=90, bg=SAGE if off > .5 else RED, fg=CREAM, rot=-3)
    c.label('à la source', 540, 1560, size=82, bg=SAGE, fg=CREAM, sc=pop(t, .6, .4))


def P2(c, t, d):
    flat(c, (205, 165, 112), 3)
    u = t / d
    q = ease(clamp(u * 1.2))
    cx, cy = 540, 760
    c.circ(cx, cy, 400, CREAM, sh=14)
    c.arc(cx, cy, 360, 160, 380, 54, SAGE, sh=0)
    c.arc(cx, cy, 360, 320, 380, 54, RED, sh=0)
    a = math.radians(160 + 220 * (1 - q) + 10)
    c.strip((cx, cy), (cx + 330 * math.cos(a), cy + 330 * math.sin(a)), 30, BROWN, sh=4)
    c.circ(cx, cy, 50, BROWN, sh=0)
    c.rect(540, 1250, 1000, 90, (60, 40, 30), r=40, sh=8)
    for i in range(12):
        x = (i * 120 + t * 300 * (1 - .85 * q)) % 1100
        tache(c, x, 1190, 24, halo=False)
    c.label('10 %', 840, 360, size=130, bg=TERRA, fg=CREAM, rot=4)


def Q1(c, t, d):
    flat(c, LB, 3)
    c.rect(300, 960, 500, 640, KR_D, r=24, sh=12)
    c.poly([(80, 660), (520, 660), (440, 400), (160, 400)], dark(KR_D, 1.1), sh=8)
    pipe(c, 540, 1100, 1100, 1100, 90)
    balls_flow(c, t, 540, 1100, 1100, 1100, 1.0, n=10, speed=.8, r=22)
    enzyme(c, 790, 640, 420, stop=0.0)
    ang = math.radians(t * 380)
    c.strip((560, 900), (560 + 100 * math.cos(ang), 900 + 100 * math.sin(ang)), 22, GREY, sh=3)
    c.circ(560 + 100 * math.cos(ang), 900 + 100 * math.sin(ang), 30, RED, sh=3)


def Q2(c, t, d):
    flat(c, LB, 3)
    u = t / d
    c.rect(300, 960, 500, 640, KR_D, r=24, sh=12)
    c.poly([(80, 660), (520, 660), (440, 400), (160, 400)], dark(KR_D, 1.1), sh=8)
    pipe(c, 540, 1100, 1100, 1100, 90)
    stop = ease((u - .3) / .1)
    balls_flow(c, t, 540, 1100, 1100, 1100, 1 - stop, n=7, speed=.7, r=22)
    c.strip((560, 900), (660, 900), 22, GREY, sh=3)
    c.circ(660, 900, 30, RED, sh=3)
    p = slam(t, d * .3, .18, 2.6)
    if t > d * .3:
        c.rect(660, 940, 150 * p, 130 * p, GOLD, r=18, sh=10)
        c.arc(660, 860, 56 * p, 180, 360, 20 * p, GREY, sh=0)
        burst(c, 660, 940, t, d * .3 + .2, n=12, speed=500)
    enzyme(c, 800, 600, 420, stop=0.0)
    c.label('tyrosinase', 540, 1570, size=96, bg=SAGE, fg=CREAM, sc=pop(t, .5, .4), rot=2)


def R1(c, t, d):
    flat(c, KR_L, 4)
    tile(c, 540, 960, 900, 700, SK_D)
    u = t / d
    up = math.sin(clamp(u * 3) * math.pi) * 80
    tache(c, 540, 960, 160)
    c.strip((410, 280), (500, 910 - up), 52, GREY, sh=6)
    c.strip((670, 280), (580, 910 - up), 52, GREY, sh=6)
    c.label('tenaces', 540, 1570, size=86, bg=SAGE, fg=CREAM, sc=pop(t, .6, .4), rot=1)


def R2(c, t, d):
    flat(c, KR_L, 4)
    tile(c, 540, 960, 900, 700, SK_D)
    tache(c, 540, 960, 170 * (1 - .6 * ease(t / d)))
    for i in range(6):
        star(c, 540 + 330 * math.cos(t * 2 + i), 960 + 260 * math.sin(t * 2 + i), 26, rot=t * 100)


def S1(c, t, d):
    flat(c, LB, 3)
    portrait(c, 540, 640, 330, tone=T1_, turn=.3, hair=0, expr='smile', top=SAGE)
    n = int(clamp(t / (d * .85)) * 44)
    k = 0
    for r_ in range(7):
        for q in range(9):
            if k >= n:
                break
            if r_ % 2 and q == 8:
                continue
            x = 100 + q * 110 + (55 if r_ % 2 else 0)
            c.rect(x, 1500 - r_ * 56, 106, 52, KR_D if (q + r_) % 2 else TERRA, r=4, sh=2)
            k += 1


def S2(c, t, d):
    flat(c, LB, 3)
    portrait(c, 540, 640, 330, tone=T1_, turn=.3, hair=0, expr='happy', top=SAGE)
    for r_ in range(7):
        for q in range(9):
            if r_ % 2 and q == 8:
                continue
            x = 100 + q * 110 + (55 if r_ % 2 else 0)
            c.rect(x, 1500 - r_ * 56, 106, 52, KR_D if (q + r_) % 2 else TERRA, r=4, sh=2)
    atk = [(sun, 80), (razor, 200), (pimple, 90), (pill, 300)]
    for i, (fn, sz) in enumerate(atk):
        ph = (t * .9 + i * .25) % 1.0
        hit = abs(math.sin(ph * math.pi))
        x = [120, 940, 220, 860][i]
        y = 250 + (1050 - 250) * hit * .95
        xx = x + (540 - x) * .15 * hit
        if fn is sun:
            sun(c, xx, y, sz, rot=t * 40)
        elif fn is razor:
            razor(c, xx, y, sz, rot=40)
        elif fn is pimple:
            pimple(c, xx, y, sz)
        else:
            pill(c, xx, y, sz, rot=-20)
        if ph > .48 and ph < .62:
            star(c, xx, 1180, 50, rot=ph * 400, col=SUN)


def T2(c, t, d):
    flat(c, LB, 3)
    u = t / d
    cols = [PINK, SAGE, CREAM, TERRA, KR_D]
    for i in range(5):
        go = ease((u - .3 - i * .06) / .25)
        bottle(c, 160 + i * 200 - go * 1200, 360, 250, body=cols[i], lab=dark(cols[i], .9), brand=False, bulb=cols[i],
               rot=(-1) ** i * 5)
    pt = pop(t, .15, .35)
    if pt > 0 and u < .75:
        c.label('€€€', 540, 760, size=210, bg=SUN, fg=BROWN, sc=pt, rot=4, padx=70)
        if u > .5:
            c.strip((260, 930), (820, 590), 26, RED, sh=3)
    p = clamp(pop(t, d * .55, .4), 0, 1.1)
    if p > 0:
        portrait(c, 540, 1200 + 40 * (1 - clamp(p, 0, 1)), 330 * p, tone=T2_, turn=-.25, hair=1, expr='happy', top=TERRA)


def V2(c, t, d):
    flat(c, LB, 3)
    for i, (x, tone, hs, top, tr) in enumerate([(190, T0, 0, SAGE, .3), (540, T2_, 1, TERRA, -.2), (890, T3_, 2, SUN, .3)]):
        p = clamp(pop(t, .15 + i * .3, .4), 0, 1.1)
        portrait(c, x, 760, 200 * p, tone=tone, turn=tr, hair=hs, expr='happy', top=top)
    for i in range(7):
        heart(c, 110 + i * 140 + math.sin(t * 4 + i) * 20, 1500 - ((t * 330 + i * 190) % 1300), 90,
              TERRA if i % 2 else RED)


def X1(c, t, d):
    flat(c, LB, 3)
    portrait(c, 540, 860, 560, tone=T1_, turn=.35, hair=2, expr='skep', brow_up=1.0 if (t % 1.4) > .3 else 0.0,
             look=-1, spots=spots_cheeks(1.2), top=SAGE)
    c.label('?', 900, 420, size=240, bg=KR_L, sc=pop(t, .4, .3), rot=8)


E1_new = E1

# ---------------------------------------------------------------- liste des plans
SHOTS = [
    (0.0, 1.7, A1, cam(1.3, 1.0, (540, 900), (540, 960)), 'cut'),
    (1.7, 3.5, A2, cam(1.0, 1.15, (540, 900), (540, 800), r0=-3, r1=3), 'punch'),
    (3.5, 5.6, B1, cam(1.0, 1.15, (540, 960), (540, 900), sh=3), 'whip'),
    (5.6, 8.6, B2, cam(1.0, 1.0, (540, 960), (540, 1250)), 'cut'),
    (8.6, 10.8, C1, cam(1.0, 1.25, (540, 950), (660, 1050), sh=3), 'whip'),
    (10.8, 13.6, C2, cam(1.0, 1.2, (540, 900), (700, 800), sh=5), 'punch'),
    (13.6, 16.8, D1, cam(1.0, 1.0), 'flash'),
    (16.8, 18.9, D2, cam(1.15, 1.0, (540, 1000), (540, 960), sh=8), 'cut'),
    (18.9, 20.8, D3, cam(1.0, 1.25, (540, 900), (540, 1000)), 'whip'),
    (20.8, 23.3, E1, cam(1.1, 1.0, (540, 900), (540, 960), sh=6), 'punch'),
    (23.3, 26.2, E2, cam(1.0, 1.2, (540, 950), (440, 1000), sh=7), 'cut'),
    (26.2, 28.1, F1, cam(1.0, 1.2, (540, 800), (400, 900)), 'flash'),
    (28.1, 29.9, F2, cam(1.1, 1.0, (540, 700), (540, 960), r0=3), 'whip'),
    (29.9, 31.6, F3, cam(1.0, 1.2, (540, 1000), (500, 1150)), 'cut'),
    (31.6, 34.0, G1, cam(1.0, 1.3, (540, 760), (540, 1050)), 'punch'),
    (34.0, 37.2, G2, cam(1.0, 1.4, (540, 700), (540, 1000)), 'cut'),
    (37.2, 39.6, H1, cam(1.15, 1.0, (540, 800), (540, 900)), 'whip'),
    (39.6, 42.0, H2, cam(1.0, 1.25, (540, 900), (540, 820)), 'flash'),
    (42.0, 45.5, I1, cam(1.0, 1.0, sh=4), 'cut'),
    (45.5, 49.0, I2, cam(1.0, 1.6, (540, 960), (540, 960), sh=8), 'punch'),
    (49.0, 52.0, J1, cam(1.15, 1.0, (540, 1000), (540, 960)), 'whip'),
    (52.0, 55.0, J2, cam(1.0, 1.15, (540, 800), (700, 1000)), 'cut'),
    (55.0, 57.2, K1, cam(1.0, 1.0), 'flash'),
    (57.2, 59.2, K2, cam(1.2, 1.0, (540, 1000), (540, 960), sh=5), 'punch'),
    (59.2, 62.6, L1, cam(1.0, 1.2, (540, 960), (540, 1200)), 'whip'),
    (62.6, 65.6, L2, cam(1.0, 1.15, (540, 800), (540, 900)), 'cut'),
    (65.6, 68.6, L3, cam(1.0, 1.35, (540, 900), (540, 800)), 'flash'),
    (68.6, 71.7, M1, cam(1.0, 1.25, (540, 950), (540, 900), r0=-2, r1=2), 'punch'),
    (71.7, 73.7, N1, cam(1.0, 1.0, sh=10), 'cut'),
    (73.7, 75.7, N2, cam(1.0, 1.0, sh=10), 'cut'),
    (75.7, 79.0, N3, cam(1.0, 1.2, (540, 800), (540, 1000)), 'whip'),
    (79.0, 81.6, O1, cam(1.15, 1.0, (540, 1000), (540, 960)), 'punch'),
    (81.6, 83.6, P1, cam(1.0, 1.2, (540, 800), (520, 800), sh=8), 'flash'),
    (83.6, 85.5, P2, cam(1.0, 1.25, (540, 760), (540, 900)), 'whip'),
    (85.5, 87.9, Q1, cam(1.2, 1.0, (400, 800), (540, 960)), 'cut'),
    (87.9, 90.2, Q2, cam(1.0, 1.15, (540, 960), (620, 900), sh=5), 'punch'),
    (90.2, 92.6, R1, cam(1.4, 1.1, (540, 950), (540, 960)), 'whip'),
    (92.6, 94.9, R2, cam(1.1, 1.3, (540, 960), (540, 960)), 'cut'),
    (94.9, 98.3, S1, cam(1.0, 1.2, (540, 1000), (540, 1050)), 'flash'),
    (98.3, 102.0, S2, cam(1.0, 1.0, sh=5), 'punch'),
    (102.0, 105.6, T1, cam(1.15, 1.0, (540, 700), (540, 960), sh=4), 'whip'),
    (105.6, 109.0, T2, cam(1.0, 1.15, (540, 800), (540, 1000)), 'cut'),
    (109.0, 111.9, U1, cam(1.3, 1.0, (540, 1100), (540, 960)), 'flash'),
    (111.9, 114.3, U2, cam(1.0, 1.35, (540, 1000), (540, 1000)), 'whip'),
    (114.3, 116.4, V1, cam(1.0, 1.0, sh=10), 'punch'),
    (116.4, 118.4, V2, cam(1.0, 1.15, (540, 1000), (540, 900)), 'cut'),
    (118.4, 120.3, W1, cam(1.2, 1.0, (540, 900), (540, 960)), 'flash'),
    (120.3, 122.2, W2, cam(1.0, 1.15, (600, 1000), (600, 1000), sh=3), 'whip'),
    (122.2, 124.6, X1, cam(1.0, 1.3, (540, 900), (540, 860), r0=2, r1=-2), 'punch'),
    (124.6, 126.9, X2, cam(1.0, 1.0, sh=10), 'cut'),
    (126.9, 129.0, X3, cam(1.2, 1.0, (540, 900), (540, 960)), 'whip'),
    (129.0, 131.0, Y1, cam(1.0, 1.15, (540, 900), (540, 900)), 'flash'),
    (131.0, 132.8, Y2, cam(1.0, 1.0), 'punch'),
    (132.8, 136.7, Z1, cam(1.0, 1.1, (540, 960), (540, 1000)), 'flash'),
]
