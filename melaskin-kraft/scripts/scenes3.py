import math
from kraft import *
from kraft import textimg_stroke
from props import (sun, razor, pimple, pill, brush, sponge, flame, nosign, gear, ball, balls_flow, pipe, hand, star,
                   heart, calendar, giftbox, stamp, bill, enzyme, arrow, bottle, section)
from scenes2 import RS, RS_D, SHIRT, PANT, SKIN2, TILE, pastille, JS, flute_band

GOLD = (222, 170, 60)
BOUND = [0, 3.5, 8.6, 13.6, 20.8, 26.2, 31.6, 37.2, 42.0, 49.0, 55.0, 59.2, 68.6, 71.7, 79.0, 81.6, 85.5, 90.2,
         94.9, 102.0, 109.0, 114.3, 118.4, 122.2, 129.0, 132.8, 136.7]
TONES = [(176, 122, 86), (146, 94, 62), (112, 70, 44), (92, 56, 36), (130, 84, 56)]


# ------------------------------------------------------------ blocs communs
def cheek_bg(c, top=SAGE, hair_shift=0.0):
    cx, cy, rx, ry = 480, 560, 640, 900
    for x, y, r in [(985, 260, 150), (1020, 500, 140), (970, 740, 155), (1010, 980, 150), (960, 1210, 145),
                    (1020, 1440, 150), (-20, 1300, 120), (10, 1520, 130)]:
        c.circ(x + hair_shift, y, r, HAIR, sh=10)
    c.poly([(250, 1200), (700, 1200), (780, 1960), (180, 1960)], SKIN2, sh=10)
    c.poly([(-80, 1560), (180, 1560), (240, 1700), (520, 1790), (860, 1680), (1160, 1520), (1160, 2000), (-80, 2000)],
           top, sh=12)
    for i in range(9):
        a = math.radians(30 + i * 15)
        c.circ(480 + 190 * math.cos(a) * 1.2, 1560 + 190 * math.sin(a) * .65 + 130, 11, GOLD, sh=2)
    c.ell(cx, cy, rx, ry, SKIN, sh=12)
    c.arc(800, 640, 54, 0, 360, 11, GOLD, sh=3)
    return cx, cy, rx, ry


def jaw(c, t, t0=.25, gap=.075, k=1.0, only=None, col=RS, vis=1.0):
    cx, cy, rx, ry = 480, 560, 640, 900
    for i, (a, rad, r) in enumerate(JS):
        if only is not None and i not in only:
            continue
        p = clamp(pop(t, t0 + i * gap, .3), 0, 1.15) * vis
        if p > 0:
            pastille(c, cx + rx * rad * math.cos(a), cy + ry * rad * math.sin(a), r * p * k, col)


def jaw_pos(i):
    a, rad, r = JS[i]
    return 480 + 640 * rad * math.cos(a), 560 + 900 * rad * math.sin(a)


def neck_spots(c, t, t0=1.4):
    for i, (px, py) in enumerate([(430, 1330), (560, 1380), (500, 1470), (640, 1450), (380, 1440)]):
        pastille(c, px, py, 20 * clamp(pop(t, t0 + i * .18, .3), 0, 1.15))


def cardboard_hand(c, x, y, s=520, rot=-18):
    hand(c, x, y, s, rot=rot, sk=(176, 122, 86))


def woman(c, fx, t, up=0.0, dress=TERRA, mood='n', spots=True, hand_side=1, flip=1):
    """Femme en pied (base ≈ y 1610). up = bras levé vers le cou (0..1)."""
    sway = math.sin(t * 2.2) * 4
    fx = fx + sway
    # cheveux longs (derrière)
    for ox, oy, r in [(-95, 600, 70), (95, 600, 70), (-110, 690, 70), (110, 690, 70), (-115, 790, 66), (115, 790, 66),
                      (-100, 880, 58), (100, 880, 58), (-82, 540, 78), (82, 540, 78), (0, 505, 88)]:
        c.circ(fx + ox, oy, r, HAIR, sh=3)
    # jambes + chaussures
    c.poly([(fx - 75, 1180), (fx - 14, 1180), (fx - 20, 1590), (fx - 70, 1590)], SKIN2, sh=6)
    c.poly([(fx + 14, 1180), (fx + 75, 1180), (fx + 70, 1590), (fx + 20, 1590)], SKIN2, sh=6)
    c.ell(fx - 48, 1612, 46, 17, CREAM, sh=3)
    c.ell(fx + 48, 1612, 46, 17, CREAM, sh=3)
    # bras
    c.poly([(fx - 112, 780), (fx - 142, 790), (fx - 165, 1010), (fx - 125, 1018)], SKIN2, sh=5)
    # robe
    c.poly([(fx - 105, 770), (fx + 105, 770), (fx + 175, 1210), (fx - 175, 1210)], dress, sh=10)
    c.poly([(fx - 105, 770), (fx - 8, 800), (fx + 8, 800), (fx + 105, 770), (fx + 30, 830), (fx - 30, 830)],
           dark(dress, .8), sh=0)
    # bras levé
    ax = fx + 175 - up * 120
    ay = 1000 - up * 290
    c.poly([(fx + 112, 790), (fx + 142, 800), (ax + 30, ay), (ax - 8, ay + 8)], SKIN2, sh=5)
    c.ell(ax + 12, ay - 6, 32, 38, SKIN2, sh=3)
    # cou + tête
    c.rect(fx, 735, 54, 90, SKIN2, sh=3)
    c.ell(fx, 650, 74, 96, SKIN2, sh=8)
    c.poly([(fx - 80, 650), (fx - 72, 560), (fx, 540), (fx + 72, 560), (fx + 80, 650), (fx + 58, 595), (fx, 580),
            (fx - 58, 595)], HAIR, sh=3)
    for sx in (-1, 1):
        c.circ(fx + sx * 28, 650, 6, BROWN, sh=0, edge=BROWN)
    if mood == 'smile':
        c.arc(fx, 690, 26, 20, 160, 7, RS, sh=0)
    elif mood == 'sad':
        c.arc(fx, 712, 24, 205, 335, 7, RS, sh=0)
    else:
        c.strip((fx - 18, 700), (fx + 18, 700), 7, RS, sh=0)
    if spots:
        for i, (px, py) in enumerate([(fx - 18, 748), (fx + 6, 762), (fx - 34, 776), (fx + 26, 740), (fx - 4, 790),
                                      (fx + 36, 770), (fx - 48, 742)]):
            pastille(c, px, py, 11 * clamp(pop(t, 1.2 + i * .2, .3), 0, 1.15))


def bath_bg(c, blur=5):
    for k in range(0, 8):
        c.rect(70, 150 + k * 170, 140, 160, TILE if k % 2 else dark(TILE, .88), r=6, sh=3)
    c.rect(610, 760, 900, 1180, (236, 222, 190), r=6, sh=8)
    c.rect(600, 650, 520, 640, GREY, r=10, sh=10)
    c.rect(600, 650, 470, 590, (238, 236, 226), r=6, sh=0)
    c.rect(540, 640, 90, 520, (250, 250, 242), rot=8, sh=0)
    c.rect(600, 1330, 880, 320, KR, r=8, sh=10)
    for dx in (-215, 215):
        c.rect(600 + dx, 1330, 380, 260, KR_L, r=6, sh=0, edge=KR_D)
    c.rect(930, 1060, 90, 330, KR_L, r=6, sh=4)
    c.rect(300, 1190, 60, 90, PINK, r=6, sh=4)
    c.rect(400, 1190, 40, 80, SAGE, r=6, sh=4)
    c.circ(850, 1170, 40, SAGE, sh=3)
    c.rect(560, 1620, 700, 160, (236, 226, 210), r=14, sh=8)
    c.blur(blur)


def slab(c, t, sx=0.0, nb=0, spread=380, x0=70, x1=1010, y_off=0, tone=SKIN, shake=0.0, cov=1.0):
    """Coupe de carton : sx = décalage de la peau, nb = nombre de pastilles dessous."""
    c.rect(540, 1090 + y_off, x1 - x0, 330, KR, sh=14, jit=False)
    for k, yy in enumerate([940, 1030, 1120]):
        flute_band(c, x0, x1, yy + y_off, 70, dark(KR_D, .9 + .03 * k), phase=k * .8)
        c.rect(540, yy - 2 + y_off, x1 - x0, 14, KR_L, sh=0, jit=False)
    c.rect(540, 1210 + y_off, x1 - x0, 14, KR_L, sh=0, jit=False)
    c.poly([(x0, 940 + y_off), (x1, 940 + y_off), (x1 - 40, 800 + y_off), (x0 + 40, 800 + y_off)], (212, 176, 128), sh=6,
           jit=False)
    for i in range(nb):
        a = i * 2.39
        r = 11 * math.sqrt(i) * 3.1
        bx = 540 + clamp(r * math.cos(a), -spread, spread)
        by = 868 + y_off + r * math.sin(a) * .22 + math.sin(t * 6 + i) * (2 + shake)
        pastille(c, bx, by, 17, SPOT)
    if cov > 0:
        yy = y_off - 18 * min(1, sx / 400)
        c.poly([(x0 + sx, 940 + yy), (x1 + sx, 940 + yy), (x1 - 40 + sx, 800 + yy), (x0 + 40 + sx, 800 + yy)], tone,
               sh=12)
        c.poly([(x0 + sx, 940 + yy), (x1 + sx, 940 + yy), (x1 + sx, 962 + yy), (x0 + sx, 962 + yy)], dark(tone, .8),
               sh=0)


def avatar(c, x, y, s, tone, hair_style=0, mood='smile'):
    for ox, oy, r in [(-.5, -.1, .34), (.5, -.1, .34), (-.55, .3, .3), (.55, .3, .3), (-.3, -.5, .36), (.3, -.5, .36),
                      (0, -.62, .4)] if hair_style == 0 else [(-.46, 0, .3), (.46, 0, .3), (-.38, .55, .26),
                                                              (.38, .55, .26), (0, -.58, .4), (-.3, -.42, .34),
                                                              (.3, -.42, .34)]:
        c.circ(x + ox * s, y + oy * s, r * s, HAIR, sh=3)
    c.ell(x, y + .95 * s, .8 * s, .35 * s, [TERRA, SAGE, CREAM, SUN, PINK][hair_style % 5], sh=5)
    c.ell(x, y, .5 * s, .6 * s, tone, sh=6)
    c.ell(x, y - .5 * s, .5 * s, .16 * s, HAIR, sh=0)
    for sx in (-1, 1):
        c.circ(x + sx * .19 * s, y - .04 * s, .04 * s, BROWN, sh=0, edge=BROWN)
    if mood == 'smile':
        c.arc(x, y + .15 * s, .15 * s, 25, 155, .045 * s, RS, sh=0)
    else:
        c.strip((x - .1 * s, y + .28 * s), (x + .1 * s, y + .28 * s), .04 * s, RS, sh=0)


def pastille_burst(c, x, y, p, n=10, r0=40, r1=260):
    for i in range(n):
        a = i * 2 * math.pi / n + .3
        rr = r0 + (r1 - r0) * ease(p)
        if 0 < p < 1:
            pastille(c, x + rr * math.cos(a), y + rr * math.sin(a), 18 * (1 - p * .6))


# ------------------------------------------------------------ scènes
def S1(c, t, d):
    cheek_bg(c)
    jaw(c, t, .25, .06)
    neck_spots(c, t, 1.1)
    cardboard_hand(c, 190 + math.sin(t * 6) * 8, 1450 + math.sin(t * 6) * 12)
    y = 380 - 800 * (1 - back(t / .8))
    c.blit(textimg_stroke('5', 640, CREAM, TERRA, 12, 'x'), 250, y, shadow=True)
    c.zoomto(1.0 + .08 * ease(t / d), 480, 1000)


def S2(c, t, d):
    c.rect(540, 300, 1100, 600, KR_L, sh=0, jit=False)
    c.blur(8)
    n = int(clamp((t - 1.0) / 3.5) * 28)
    slab(c, t, sx=0, nb=n, tone=SKIN)
    hx = 540 + math.sin((t - .3) * 6) * 230
    if t > .3:
        cardboard_hand(c, hx, 640, 320, rot=170)
        for k in range(3):
            c.strip((hx - 100 + k * 100, 740), (hx - 60 + k * 100, 740), 6, KR_D, sh=0)
    c.zoomto(1.0 + .1 * ease(t / d), 540, 1000)


def S3(c, t, d):
    u = t / d
    cheek_bg(c)
    cover = clamp((u - .1) / .22) - clamp((u - .62) / .14)
    jaw(c, 99, vis=1.0)
    neck_spots(c, 99)
    if cover > .02:
        for i, (a, rad, r) in enumerate(JS):
            px, py = jaw_pos(i)
            c.circ(px, py, (r + 6) * (1 + .5 * cover), (186, 138, 98), sh=1, edge=(186, 138, 98))
    bottle(c, 900, 360, 260, rot=8, body=PINK, lab=CREAM, brand=False, bulb=dark(PINK, .85))
    if u < .18:
        p = ease(u / .18)
        sponge(c, 900 - 380 * p, 1000 + 120 * (1 - p), 330, rot=-25)
    elif u < .6:
        q = (u - .18) / .42
        sponge(c, 500 + 120 * math.sin(q * 16), 1100 + 40 * math.cos(q * 11), 330, rot=-15 + 10 * math.sin(q * 14))
    else:
        p = ease((u - .6) / .25)
        sponge(c, 500 + 500 * p, 1100 - 300 * p, 330, rot=-25 - 50 * p)
    if cover > .4 and u > .5:
        c.label('', 540, 300, size=10, sc=0)


def S4(c, t, d):
    u = t / d
    cheek_bg(c)
    jaw(c, 99)
    c.rect(540, 170, 1100, 24, KR_D, sh=6)
    pale = [(240, 214, 200), CREAM, (236, 226, 222), (232, 205, 180)]
    for i, col in enumerate(pale):
        if i == 1 and .12 < u < .5:
            continue
        bottle(c, 160 + i * 250, 70, 150, body=col, lab=dark(col, .92), brand=False, bulb=dark(col, .85))
    for i, col in enumerate(pale):
        c.rect(110 + i * 90, 300, 70, 70, col, r=8, sh=3)
    if .12 < u < .5:
        p = ease((u - .12) / .3)
        bottle(c, 400 + 180 * p, 100 + 700 * p, 220, rot=-10 + 150 * p, body=CREAM, lab=dark(CREAM, .92), brand=False,
               bulb=PINK)
    if .45 < u < .8:
        for k in range(11):
            x = 330 + k * 36
            y = 950 + (30 if k % 2 else -30) + math.sin(t * 22) * 4
            if k:
                c.strip((330 + (k - 1) * 36, 950 + (30 if (k - 1) % 2 else -30)), (x, y), 12, RED, sh=0)
        flame(c, 560, 1120, 70)
    if u >= .8:
        for i in range(3):
            c.circ(430 + i * 90, 1000, 22 * clamp(pop(t, d * .8 + i * .15, .2), 0, 1.1), (96, 64, 46), sh=3)


def S5(c, t, d):
    u = t / d
    cheek_bg(c)
    jaw(c, 99, k=1 + .7 * u)
    neck_spots(c, 99)
    cols = [PINK, SAGE, KR_L, TERRA, CREAM, SUN, BEIGE]
    for i in range(7):
        p = pop(t, .3 + i * .55, .45)
        if p > 0:
            ox = [140, 920, 90, 970, 220, 860, 540][i]
            oy = [330, 360, 640, 700, 960, 1020, 220][i]
            bottle(c, ox, oy - (1 - clamp(p, 0, 1)) * 500, 190, rot=(-1) ** i * 16, body=cols[i], lab=CREAM, brand=False,
                   bulb=cols[(i + 2) % 7])
    brush(c, 480 + math.sin(t * 9) * 160, 1130 + math.cos(t * 7) * 70, 420, rot=-25)
    c.zoomto(1.0 + .06 * u, 480, 1000)


def S6(c, t, d):
    u = t / d
    c.rect(540, 960, 1100, 2000, KR_L, sh=0, jit=False)
    c.blur(3)
    panels = [(300, 'sun'), (800, 'razor'), (1300, 'rub')]
    for i, (py, kind) in enumerate(panels):
        sl = ease((t - i * .6) / .5)
        px = 540 + (1 - sl) * (1200 if i % 2 else -1200)
        c.rect(px, py, 900, 400, CREAM, r=20, sh=10)
        c.ell(px - 160, py + 110, 250, 160, SKIN, sh=0, edge=SKIN)
        if kind == 'sun':
            sun(c, px + 250, py - 90, 70, rot=t * 40)
        elif kind == 'razor':
            razor(c, px + 120 + 70 * math.sin(t * 4), py - 20, 190, rot=70)
        else:
            for k in range(3):
                arrow(c, (px + 120 + 20 * math.sin(t * 5), py - 60 + k * 60), (px + 280 + 20 * math.sin(t * 5), py - 60 + k * 60), 14)
        for k, (dx, dy) in enumerate([(-250, 60), (-170, 150), (-90, 80), (-200, 20)]):
            pastille(c, px + dx, py + dy, 22 * clamp(pop(t, i * .6 + 1.0 + k * .25 + (1.0 if u > 0 else 0), .3), 0, 1.15))
    c.label('Protection solaire quotidienne recommandée', 540, 1170, size=40, w='b', bg=SAGE, fg=CREAM, padx=28, pady=16,
            sc=pop(t, 2.2, .35), maxw=960)


def S7(c, t, d):
    c.rect(540, 300, 1100, 600, KR_L, sh=0, jit=False)
    c.blur(8)
    lift = ease((t - .5) / 1.3)
    slab(c, t, sx=lift * 800, nb=18, shake=1)
    # loupe
    mx = 540 + 100 * math.sin(t * 1.5)
    c.circ(mx, 860, 190, (250, 244, 225, 120), sh=10, edge=GREY)
    c.arc(mx, 860, 190, 0, 360, 24, GREY, sh=0)
    c.strip((mx + 130, 990), (mx + 260, 1130), 36, GREY, sh=5)
    arrow(c, (540, 380), (540, 640), 30, RS)
    c.zoomto(1.0 + .08 * ease(t / d), 540, 950)


def S8(c, t, d):
    c.rect(540, 960, 1100, 2000, KR_L, sh=0, jit=False)
    c.blur(2)
    tones = [(176, 122, 86), (130, 84, 56), (100, 62, 40)]
    for i, tone in enumerate(tones):
        p = clamp(pop(t, .2 + i * .5, .5), 0, 1.1)
        if p > 0:
            avatar(c, 190 + i * 350, 560 + 60 * (1 - p), 130 * p, tone, hair_style=i)
    c.circ(540, 1100, 280, KR_L, sh=9)
    c.arc(540, 1100, 262, 0, 360, 8, KR_D, sh=0)
    for i in range(16):
        a = t * (.7 + (i % 3) * .3) + i * 0.4
        r = 50 + (i % 5) * 42
        ball(c, 540 + r * math.cos(a), 1100 + r * math.sin(a), 15)


def S9(c, t, d):
    u = t / d
    cheek_bg(c)
    c.circ(480, 1000, 260, SKIN_D if False else (126, 80, 52), sh=0, edge=(126, 80, 52))
    icons = [(150, 620), (880, 640), (130, 1380), (900, 1360)]
    for i, (ix, iy) in enumerate(icons):
        ph = (t * .85 + i * .25) % 1.0
        hit = ease(1 - abs(ph - .5) * 2)
        px = ix + (480 - ix) * .38 * hit
        py = iy + (1000 - iy) * .38 * hit
        if i == 0:
            pimple(c, px, py, 80)
        elif i == 1:
            sun(c, px, py, 62, rot=t * 40)
        elif i == 2:
            razor(c, px, py, 190, rot=35)
        else:
            pill(c, px, py, 250, rot=-20 + 10 * hit)
        if hit > .6:
            for k in range(5):
                a = math.atan2(1000 - iy, 480 - ix) + (k - 2) * .35
                c.strip((px + 70 * math.cos(a), py + 70 * math.sin(a)), (px + 130 * math.cos(a), py + 130 * math.sin(a)), 8,
                        SUN, sh=0)
    n = int(2 + u * 26)
    for i in range(n):
        a = i * 2.4
        r = 14 + 11 * math.sqrt(i) * 1.2
        pastille(c, 480 + r * math.cos(a) + math.sin(t * 8 + i) * 2, 1000 + r * math.sin(a), 20, RS)


def S10(c, t, d):
    c.rect(540, 300, 1100, 600, KR_L, sh=0, jit=False)
    c.blur(8)
    press = math.sin(t * 7) * 6
    n = 10 + int(ease(t / (d * .7)) * 22)
    slab(c, t, sx=0, nb=0, y_off=0)
    # pastilles coincées sous la couche : on re-dessine dessous la peau avec chocs
    slab_inner = [(540 + clamp(14 * math.sqrt(i) * 3.2 * math.cos(i * 2.39), -400, 400),
                   1020 + (14 * math.sqrt(i) * 2.0 * math.sin(i * 2.39)) * .5 + math.sin(t * 9 + i) * 3) for i in range(n)]
    for (x, y) in slab_inner:
        pastille(c, x, y, 16, SPOT)
    for i in range(4):
        arrow(c, (260 + i * 180, 600 + press), (260 + i * 180, 760 + press), 18, RS)
    c.label('+ fort', 800, 520, size=64, bg=TERRA, fg=CREAM, sc=pop(t, 1.6, .35), rot=4)


def S11(c, t, d):
    c.rect(540, 960, 1100, 2000, KR, sh=0, jit=False)
    sc = t * 140
    for i in range(7):
        x = 150 + i * 460 - sc % 460 * 1 - 0
        x = (150 + i * 460 - sc) % (7 * 460) - 460
        c.rect(x, 800, 360, 520, CREAM, r=16, sh=10)
        c.rect(x, 600, 360, 100, dark(CREAM, .9), r=10, sh=0)
        for gx in range(4):
            for gy in range(4):
                c.rect(x - 130 + gx * 87, 760 + gy * 80, 62, 56, dark(CREAM, .84), r=4, sh=0)
        c.arc(x + 60 - (i % 3) * 60, 880, 38, 0, 360, 12, RS, sh=0)
    c.ell(540, 1180, 220, 80, SKIN, sh=6)
    pastille(c, 540, 1175, 34)
    bx = 540 + 330 * math.sin(t * 2.2 + 3)
    bottle(c, bx, 1040, 170, rot=80)


def S12(c, t, d):
    u = t / d
    c.rect(540, 300, 1100, 600, KR_L, sh=0, jit=False)
    c.blur(8)
    ang = -ease(clamp(u * 1.3 - .1)) * 150
    rate = 1 - .88 * ease(clamp(u * 1.3 - .1))
    pipe(c, 540, 220, 540, 480, 90)
    gear(c, 540, 560, 210, rot=ang, col=KR_D)
    balls_flow(c, t, 540, 480, 540, 1000, rate, n=16, speed=.5, r=17)
    c.rect(540, 1090, 840, 250, SKIN, r=24, sh=10)
    c.circ(920, 1090, 56, SAGE, sh=4)
    c.strip((900, 1092), (916, 1110), 14, CREAM, sh=0)
    c.strip((916, 1110), (946, 1068), 14, CREAM, sh=0)


def S13(c, t, d):
    cheek_bg(c)
    for i, (a, rad, r) in enumerate(JS):
        st = .45 + i * .08
        p = clamp((t - st) / .9)
        px, py = jaw_pos(i)
        if p <= 0:
            pastille(c, px, py, r)
        elif p < 1:
            e = ease(p)
            pastille(c, px + e * 260 * (1 if i % 2 else -1), py - e * 700, r * (1 - .4 * e))
    c.arc(480, 1180, 120, 25, 155, 20, RS, sh=0) if t > d * .6 else None
    c.zoomto(1.0 + .06 * ease(t / d), 480, 1000)


def S14(c, t, d):
    u = t / d
    c.rect(540, 960, 1100, 2000, KR_L, sh=0, jit=False)
    c.blur(3)
    p1 = clamp(pop(t, .4, .4), 0, 1.1)
    p2 = clamp(pop(t, 1.2, .4), 0, 1.1)
    nosign(c, 300, 420, 190 * p1)
    flame(c, 300, 420, 140 * p1)
    nosign(c, 780, 420, 190 * p2)
    brush(c, 780, 420, 190 * p2, rot=-30)
    if u > .38:
        rate = 1 - ease((u - .62) / .12)
        c.rect(250, 1230, 400, 330, (150, 150, 156), r=26)
        for i in range(12):
            pastille(c, 130 + (i % 4) * 56, 1130 + (i // 4) * 62, 18, SPOT)
        pipe(c, 450, 1230, 840, 1230, 84)
        balls_flow(c, t, 450, 1230, 840, 1230, rate, n=8, speed=.7, r=17)
        gear(c, 640, 1230, 110, rot=-ease((u - .6) / .2) * 150, col=TERRA)
        c.label('à la source', 540, 1560, size=66, bg=SAGE, fg=CREAM, sc=pop(t, d * .4 + .2, .4))


def S15(c, t, d):
    c.rect(540, 960, 1100, 2000, KR_L, sh=0, jit=False)
    c.blur(3)
    c.rect(540, 1300, 640, 400, KR_D, r=12)
    cols = [TERRA, SAGE, CREAM, BROWN]
    for i in range(4):
        p = pop(t, .35 + i * .4, .45)
        if p > 0:
            x = 220 + i * 213
            y = 1260 - 640 * clamp(p, 0, 1.08)
            rot = (-1) ** i * 6 + (i - 1.5) * 4
            c.rect(x, y, 170, 320, cols[i], rot=rot, r=14)
            c.text(str(i + 1), x, y, size=130, fill=CREAM if i != 2 else BROWN, rot=rot)
    c.rect(540, 1340, 640, 300, KR_D, r=12)


def S16(c, t, d):
    c.rect(540, 300, 1100, 600, KR_L, sh=0, jit=False)
    c.blur(8)
    u = t / d
    ang = -ease(clamp(u * 1.4 - .1)) * 140
    rate = 1 - .88 * ease(clamp(u * 1.4 - .1))
    pipe(c, 540, 240, 540, 520, 90)
    gear(c, 540, 600, 220, rot=ang)
    balls_flow(c, t, 540, 520, 540, 1160, rate, n=16, speed=.5, r=17)
    c.label('10 %', 540, 1180, size=170, bg=TERRA, fg=CREAM, sc=pop(t, .7, .4), rot=-3, padx=60, pady=30)


def S17(c, t, d):
    u = t / d
    c.rect(540, 960, 1100, 2000, KR_L, sh=0, jit=False)
    c.blur(3)
    c.rect(250, 820, 400, 400, KR_D, r=20)
    c.poly([(110, 620), (390, 620), (330, 440), (170, 440)], dark(KR_D, 1.1))
    stop = ease((u - .3) / .12)
    pipe(c, 450, 1000, 1040, 1000, 64)
    balls_flow(c, t, 440, 1000, 1000, 1000, 1 - stop, n=9, speed=.6, r=18)
    ep = ease((u - .15) / .15)
    enzyme(c, 790 + (1 - ep) * 400, 780, 430, stop=ease((u - .3) / .12))
    c.label('tyrosinase', 540, 1250, size=84, bg=SAGE, fg=CREAM, sc=pop(t, 1.4, .4), rot=2)


def S18(c, t, d):
    c.rect(540, 300, 1100, 600, KR_L, sh=0, jit=False)
    c.blur(8)
    slab(c, t, sx=0, nb=0)
    cyc = (t * .55) % 1.0
    n_c = int(t * .55)
    r = 84 * (1 - .14 * n_c)
    up = math.sin(clamp(cyc * 1.2) * math.pi) * 70
    pastille(c, 540, 840 - up * .4, r, SPOT)
    c.strip((410, 330), (505, 800 - up), 42, GREY)
    c.strip((670, 330), (575, 800 - up), 42, GREY)
    c.label('tenaces', 540, 1360, size=74, bg=SAGE, fg=CREAM, sc=pop(t, .9, .4), rot=1)


def S19(c, t, d):
    c.rect(540, 960, 1100, 2000, KR_L, sh=0, jit=False)
    c.blur(3)
    c.ell(540, 1280, 400, 100, SKIN_D if False else (118, 73, 46), sh=4)
    c.ell(540, 1010, 320, 360, SKIN)
    n = int(clamp(t / 3.4) * 48)
    bw, bh = 100, 50
    k = 0
    for r_ in range(7):
        for q in range(8):
            if k >= n:
                break
            if r_ % 2 and q == 7:
                continue
            x = 150 + q * bw + (bw / 2 if r_ % 2 else 0)
            c.rect(x, 1260 - r_ * bh, bw - 4, bh - 4, KR_D if (q + r_) % 2 else TERRA, r=4, sh=2)
            k += 1
    if t > 3.8:
        s_ = (t - 3.8) * 4
        sun(c, 190 + 80 * abs(math.sin(s_)), 560 + 30 * math.sin(s_ * 2), 62, rot=t * 40)
        razor(c, 900 - 70 * abs(math.sin(s_ + 1)), 660, 170, rot=45)


def S20(c, t, d):
    u = t / d
    c.rect(540, 960, 1100, 2000, KR_L, sh=0, jit=False)
    c.blur(3)
    cols = [PINK, SAGE, CREAM, TERRA, KR_D, BEIGE, SAGE, PINK, TERRA, CREAM]
    for i in range(10):
        gx = 140 + (i % 5) * 200
        gy = 500 + (i // 5) * 340
        go = ease((u - .4 - (i % 5) * .045 - (i // 5) * .1) / .2)
        bottle(c, gx - go * 1200, gy, 170, body=cols[i], lab=dark(cols[i], .9), brand=False, bulb=cols[(i + 3) % 10],
               rot=(-1) ** i * 4)
    pt = pop(t, 1.5, .4)
    if pt > 0 and u < .78:
        c.label('€€€', 540, 1180, size=150, bg=SUN, fg=BROWN, sc=pt, rot=4, padx=60)
        if u > .58:
            c.strip((310, 1290), (770, 1050), 20, RED, sh=3)


def S21(c, t, d):
    p = clamp(pop(t, 0, .8), 0, 1.08)
    for i in range(14):
        a = i * math.pi / 7 + t * .15
        c.strip((540, 960), (540 + 1200 * math.cos(a), 960 + 1200 * math.sin(a)), 80, (140, 168, 130) if i % 2 else (126, 156, 118), sh=0, edge=(126, 156, 118), jit=False)
    bottle(c, 540, 1200, 600 * p)
    cols = [TERRA, SAGE, CREAM, BROWN]
    for i in range(4):
        q = ease((t - (.9 + i * .5)) / .6)
        if q < 1:
            sx = [140, 940, 140, 940][i]
            sy = [450, 450, 1500, 1500][i]
            c.rect(sx + (540 - sx) * q, sy + (1000 - sy) * q, 150 * (1 - .5 * q), 270 * (1 - .5 * q), cols[i], rot=q * 200, r=10)
    for i in range(6):
        a = t * 1.1 + i * 1.047
        star(c, 540 + 420 * math.cos(a), 940 + 400 * math.sin(a), 34 + 10 * math.sin(t * 6 + i), rot=t * 120)


def S22(c, t, d):
    c.rect(540, 960, 1100, 2000, KR_L, sh=0, jit=False)
    c.blur(3)
    for i, tone in enumerate([TONES[0], TONES[1], TONES[3]]):
        avatar(c, 190 + i * 350, 470, 120, tone, hair_style=i)
    s_ = 2.2 - 1.2 * ease(t / .5) if t < .5 else 1.0 + .06 * math.exp(-(t - .5) * 5) * math.sin((t - .5) * 25)
    stamp(c, 540, 1000, 280, '94 %', sc=s_, size=170, rot=-6)
    for i in range(5):
        heart(c, 120 + i * 210 + math.sin(t * 3 + i) * 20, 1400 - ((t * 140 + i * 130) % 800), 70, TERRA if i % 2 else RED)
    c.label('test consommateur, 4 semaines', 540, 1260, size=42, w='b', bg=CREAM, padx=26, pady=14, maxw=960,
            sc=pop(t, .8, .3))


def S23(c, t, d):
    c.rect(540, 960, 1100, 2000, KR_L, sh=0, jit=False)
    c.blur(3)
    p1 = pop(t, .3, .45)
    p2 = pop(t, .9, .45)
    bottle(c, 250, 960, 460 * clamp(p1, 0, 1.1))
    bottle(c, 570, 960, 460 * clamp(p2, 0, 1.1))
    c.circ(410, 900, 50 * clamp(pop(t, .8, .3), 0, 1.1), TERRA)
    if t > .8:
        c.text('+', 410, 898, size=84, fill=CREAM)
    gx = 960 - (1 - ease((t - 1.6) / .6)) * 700
    giftbox(c, gx, 1220, 320, lid=20 * abs(math.sin(t * 6)) * (1 if t > 2.4 else 0))
    c.label('offert', 880, 800, size=80, bg=SAGE, fg=CREAM, sc=pop(t, 2.2, .35), rot=5)


def S24(c, t, d):
    u = t / d
    c.rect(540, 960, 1100, 2000, KR_L, sh=0, jit=False)
    c.blur(3)
    if u < .45:
        avatar(c, 540, 900, 330, TONES[1], hair_style=1, mood='n')
        c.strip((420, 730), (520, 710 - (30 if (t % 1.5) > .4 else 0)), 22, HAIR, sh=0)
        c.label('?', 880, 600, size=200, bg=KR_L, sc=pop(t, .7, .3), rot=8)
    else:
        c.rect(540, 1050, 760, 420, KR_D, r=14)
        c.poly([(160, 840), (920, 840), (890, 800), (190, 800)], dark(KR_D, 1.12))
        s_ = 1 if t > d * .45 + .3 else 2.3 - 1.3 * ease((t - d * .45) / .3)
        stamp(c, 540, 1000, 250, '90\njours', col=SAGE, sc=s_, size=96, rot=-8)


def S25(c, t, d):
    c.rect(540, 960, 1100, 2000, KR_L, sh=0, jit=False)
    c.blur(3)
    tear = clamp(t / 2.4) * 3.0
    calendar(c, 340, 760, 520, tear, pages=4)
    c.rect(780, 1250, 420, 280, KR_D, r=12)
    for i in range(5):
        q = clamp((t - (1.0 + i * .45)) / .8)
        if 0 < q < 1:
            bill(c, 480 + 300 * ease(q), 840 + 400 * ease(q) - 200 * math.sin(q * math.pi), 1.0, rot=-30 + 60 * q)
    c.rect(780, 1160, 420, 200, KR_D, r=12)
    c.text('remboursé', 780, 1230, size=52, fill=CREAM)


def S26(c, t, d):
    p = clamp(pop(t, .1, .5), 0, 1.1)
    c.circ(540, 620, 220 * p, CREAM, sh=10)
    c.arc(540, 620, 188 * p, 0, 360, 12, TERRA, sh=0)
    c.text('M', 540, 620, size=int(250 * p), fill=BROWN)
    c.label('MELA SKIN', 540, 960, size=110, bg=CREAM, sc=pop(t, .5, .4), rot=-2)
    c.text('L\'expertise pensée pour vous', 540, 1080, size=48, fill=CREAM, w='b', sc=pop(t, .9, .4))
    bs = 1.0 + .06 * abs(math.sin(t * 5))
    c.label('Sérum Anti-Taches', 540, 1240, size=76, bg=SAGE, fg=CREAM, sc=pop(t, 1.2, .4) * bs, rot=1.5)
    if t > 1.8:
        hand(c, 700, 1480 + 14 * math.sin(t * 6), 230, rot=-15, sk=(176, 122, 86))


SCENES = [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10, S11, S12, S13, S14, S15, S16, S17, S18, S19, S20, S21, S22, S23,
          S24, S25, S26]
BGKEY = ['kr'] * 26
for _i in (11, 15, 20, 25):
    BGKEY[_i] = 'terra'
BGKEY[20] = 'sage'
