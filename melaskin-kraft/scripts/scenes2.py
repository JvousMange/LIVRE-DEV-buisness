import math, random
from PIL import ImageFilter
from kraft import *
from props import hand

RS = (186, 66, 46)     # pastille terracotta-rouge
RS_D = (150, 48, 34)
SHIRT = (66, 64, 74)
PANT = (160, 124, 86)
SKIN2 = (160, 106, 70)
TILE = (88, 138, 124)


def pastille(c, x, y, r, col=RS):
    c.circ(x, y, r, col, sh=5, edge=dark(col, .8))
    c.circ(x - r * .22, y - r * .25, r * .35, tuple(min(255, v + 28) for v in col), sh=0, edge=tuple(min(255, v + 28) for v in col))


def jaw_spots():
    out = []
    for row, (rad, a0, a1, n) in enumerate([(.93, 40, 140, 13), (.80, 52, 128, 9), (.67, 62, 118, 6)]):
        for i in range(n):
            a = math.radians(a0 + (a1 - a0) * i / (n - 1))
            out.append((a, rad, 22 + 7 * ((i * 7 + row * 3) % 4) / 3.0))
    return out


JS = jaw_spots()


# ------------------------------------------------------------------ T1 : gros plan menton
def T1(c, t, d):
    cx, cy, rx, ry = 480, 560, 640, 900
    # hair + ear (back)
    c.poly([(640, -40), (1140, -40), (1140, 620), (940, 540), (800, 330), (700, 160)], HAIR, sh=10)
    c.ell(800, 470, 70, 120, SKIN2, rot=10, sh=8)
    # neck + shirt
    c.poly([(250, 1200), (700, 1200), (780, 1960), (180, 1960)], SKIN2, sh=10)
    c.poly([(-80, 1560), (180, 1560), (240, 1700), (520, 1760), (860, 1660), (1160, 1520), (1160, 2000), (-80, 2000)],
           SHIRT, sh=12)
    # face
    c.ell(cx, cy, rx, ry, SKIN, sh=12)
    # pastilles on jaw (pop in)
    for i, (a, rad, r) in enumerate(JS):
        p = clamp(pop(t, .25 + i * .075, .3), 0, 1.15)
        if p > 0:
            pastille(c, cx + rx * rad * math.cos(a), cy + ry * rad * math.sin(a), r * p)
    for i, (px, py) in enumerate([(430, 1330), (560, 1380), (500, 1470), (640, 1450), (380, 1440)]):
        p = clamp(pop(t, 1.4 + i * .18, .3), 0, 1.15)
        pastille(c, px, py, 20 * p)
    # hand tapping the cheek
    tap = math.sin(t * 6) * 18
    hand(c, 180 + tap * .5, 1460 + tap, 560, rot=-18, sk=(176, 122, 86))


# ------------------------------------------------------------------ T2 : salle de bain
def T2(c, t, d):
    # --- décor (flou)
    for k in range(0, 8):
        c.rect(70, 150 + k * 170, 140, 160, TILE if k % 2 else dark(TILE, .88), r=6, sh=3)
    c.rect(610, 760, 900, 1180, (236, 222, 190), r=6, sh=8)
    c.rect(600, 650, 520, 640, GREY, r=10, sh=10)
    c.rect(600, 650, 470, 590, (238, 236, 226), r=6, sh=0)
    c.rect(540, 640, 90, 520, (250, 250, 242), rot=8, sh=0)
    c.rect(600, 1330, 880, 320, KR, r=8, sh=10)
    c.rect(600, 1330, 4, 300, KR_D, sh=0)
    for dx in (-215, 215):
        c.rect(600 + dx, 1330, 380, 260, KR_L, r=6, sh=0, edge=KR_D)
    c.rect(930, 1060, 90, 330, KR_L, r=6, sh=4)
    c.rect(930, 1030, 70, 190, BEIGE, r=10, sh=2)
    c.rect(300, 1190, 60, 90, CREAM, r=6, sh=4)
    c.rect(400, 1190, 40, 80, SAGE, r=6, sh=4)
    c.rect(560, 1620, 700, 160, (236, 226, 210), r=14, sh=8)
    c.blur(5)
    # --- personnage (net)
    sway = math.sin(t * 2.2) * 4
    fx = 560 + sway
    # jambes
    c.poly([(fx - 130, 1100), (fx + 130, 1100), (fx + 110, 1590), (fx + 10, 1590), (fx + 0, 1260), (fx - 10, 1590),
            (fx - 110, 1590)], PANT, sh=10)
    c.ell(fx - 62, 1612, 56, 20, SKIN2, sh=3)
    c.ell(fx + 62, 1612, 56, 20, SKIN2, sh=3)
    # bras gauche (lève la main vers le cou)
    up = ease(clamp((t - .6) / 1.2))
    c.poly([(fx - 125, 790), (fx - 160, 800), (fx - 190, 1010), (fx - 140, 1020)], SKIN2, sh=6)
    # torse
    c.poly([(fx - 135, 760), (fx + 135, 760), (fx + 150, 1130), (fx - 150, 1130)], SHIRT, sh=10)
    c.poly([(fx - 135, 760), (fx - 195, 830), (fx - 170, 900), (fx - 130, 850)], SHIRT, sh=4)
    c.poly([(fx + 135, 760), (fx + 195, 830), (fx + 170, 900), (fx + 130, 850)], SHIRT, sh=4)
    # bras droit levé vers le cou
    ax = fx + 190 - up * 130
    ay = 1000 - up * 260
    c.poly([(fx + 160, 840), (fx + 195, 850), (ax + 36, ay), (ax - 10, ay + 10)], SKIN2, sh=6)
    c.ell(ax + 14, ay - 6, 36, 42, SKIN2, sh=4)
    # cou + tête
    c.rect(fx, 735, 62, 90, SKIN2, sh=3)
    c.ell(fx, 650, 78, 98, SKIN2, sh=8)
    c.poly([(fx - 80, 650), (fx - 70, 560), (fx, 535), (fx + 70, 560), (fx + 80, 650), (fx + 60, 600), (fx, 585),
            (fx - 60, 600)], HAIR, sh=3)
    for i, (px, py) in enumerate([(fx - 18, 748), (fx + 6, 762), (fx - 34, 776), (fx + 26, 740), (fx - 4, 790),
                                  (fx + 36, 770), (fx - 50, 740)]):
        p = clamp(pop(t, 1.2 + i * .2, .3), 0, 1.15)
        pastille(c, px, py, 11 * p)
    c.zoomto(1.0 + .22 * ease(t / d), 560, 1000 - 280 * ease(t / d))


# ------------------------------------------------------------------ T3 : coupe carton + mélanine
def flute_band(c, x0, x1, y, h, col, phase=0.0):
    pts = []
    n = int((x1 - x0) / 10)
    for i in range(n + 1):
        x = x0 + i * 10
        pts.append((x, y + h / 2 + math.sin((x - x0) / 22 * math.pi + phase) * h * .42))
    for i in range(n, -1, -1):
        x = x0 + i * 10
        pts.append((x, y + h / 2 + math.sin((x - x0) / 22 * math.pi + phase) * h * .42 + 7))
    c.poly(pts, col, sh=0, jit=False)


def T3(c, t, d):
    x0, x1 = 70, 1010
    top_y = 920
    # tranche de carton (couches)
    ys = [940, 1030, 1120]
    c.rect(540, 1090, x1 - x0, 330, KR, sh=14, jit=False)
    for k, yy in enumerate(ys):
        flute_band(c, x0, x1, yy, 70, dark(KR_D, .9 + .03 * k), phase=k * .8)
        c.rect(540, yy - 2, x1 - x0, 14, KR_L, sh=0, jit=False)
    c.rect(540, 1210, x1 - x0, 14, KR_L, sh=0, jit=False)
    # face supérieure du 2e plan (où naissent les pastilles)
    c.poly([(x0, 940), (x1, 940), (x1 - 40, 800), (x0 + 40, 800)], (212, 176, 128), sh=6, jit=False)
    # pastilles qui s'accumulent
    n = int(4 + clamp(t / (d * .75)) * 26)
    for i in range(n):
        a = i * 2.39
        r = 11 * math.sqrt(i) * 3.1
        bx = 540 + clamp(r * math.cos(a), -380, 380) * 1.0
        by = 868 + r * math.sin(a) * .22 + math.sin(t * 6 + i) * 2
        pastille(c, bx, by, 17, SPOT)
    # couche du dessus qui glisse sur le côté et révèle les pastilles
    lift = ease((t - .7) / 1.5)
    sx = lift * 760
    c.poly([(x0 + sx, 940 - 18 * lift), (x1 + sx, 940 - 18 * lift), (x1 - 40 + sx, 800 - 24 * lift), (x0 + 40 + sx, 800 - 24 * lift)],
           SKIN, sh=12, jit=True)
    c.poly([(x0 + sx, 940 - 18 * lift), (x1 + sx, 940 - 18 * lift), (x1 + sx, 962 - 18 * lift), (x0 + sx, 962 - 18 * lift)],
           dark(SKIN, .8), sh=0)
    hand(c, x0 + 80 + sx, 720 - 30 * lift, 300, rot=95, sk=(176, 122, 86))
    c.zoomto(1.0 + .12 * ease(t / d), 560, 930)


SCENES2 = [T1, T2, T3]
