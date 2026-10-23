import math, random
from kraft import *

SPOT_K = (50, 27, 16)
LIP = (150, 62, 60)
CHEEK_T = [(176, 122, 86), (150, 98, 64), (124, 80, 52), (100, 62, 40)]


def tache(c, x, y, r, p=1.0, seed=0, halo=True, hc=(88, 52, 32)):
    """Tache pigmentaire : tache noire irrégulière (pas un bouton)."""
    if p <= 0.02 or r <= 1:
        return
    rr = random.Random(int(x * 7 + y * 13 + seed))
    n = 11
    pts = []
    for i in range(n):
        a = 2 * math.pi * i / n
        k = rr.uniform(.72, 1.18)
        pts.append((x + r * p * k * math.cos(a), y + r * p * k * .88 * math.sin(a)))
    if halo:
        hp = []
        for i in range(n):
            a = 2 * math.pi * i / n
            k = rr.uniform(.95, 1.35)
            hp.append((x + r * p * 1.3 * k * math.cos(a), y + r * p * 1.2 * k * math.sin(a)))
        c.poly(hp, hc, sh=0, edge=hc, jit=False)
    c.poly(pts, SPOT_K, sh=1, edge=(30, 15, 8), jit=False)


def portrait(c, cx, cy, s, tone=CHEEK_T[1], turn=0.0, hair=0, expr='n', spots=(), top=SAGE, t=0.0, earring=True,
             brow_up=0.0, look=0.0, blush=True):
    """Visage de face / 3/4 (turn -1..1). Renvoie rien. s = taille (largeur visage ~0.92 s)."""
    sk_d = dark(tone, .84)
    fx = turn * .11 * s
    # ---- cheveux (arrière)
    if hair == 0:       # afro / curly volume
        ring = [(-.62, -.15, .3), (.62, -.15, .3), (-.7, .2, .28), (.7, .2, .28), (-.5, -.52, .32), (.5, -.52, .32),
                (0, -.72, .36), (-.78, .55, .26), (.78, .55, .26), (-.3, -.7, .3), (.3, -.7, .3)]
    elif hair == 1:     # longs cheveux ondulés
        ring = [(-.6, -.2, .3), (.6, -.2, .3), (-.66, .2, .3), (.66, .2, .3), (-.68, .6, .3), (.68, .6, .3),
                (-.62, 1.0, .28), (.62, 1.0, .28), (-.4, -.6, .32), (.4, -.6, .32), (0, -.68, .34)]
    else:               # chignon haut + côtés
        ring = [(-.56, -.1, .26), (.56, -.1, .26), (-.6, .3, .24), (.6, .3, .24), (-.4, -.55, .28), (.4, -.55, .28),
                (0, -.95, .3), (0, -.72, .3), (-.2, -.9, .22), (.2, -.9, .22)]
    for ox, oy, r in ring:
        c.circ(cx + ox * s - fx * .4, cy + oy * s, r * s, HAIR, sh=4)
    # ---- épaules + haut
    c.ell(cx, cy + 1.2 * s, .95 * s, .5 * s, top, sh=8)
    c.rect(cx + fx * .6, cy + .72 * s, .36 * s, .34 * s, dark(tone, .86), sh=2)
    # ---- visage
    pts = []
    for i in range(48):
        a = 2 * math.pi * i / 48
        sa = math.sin(a)
        px = .47 * math.cos(a) * (1 - .36 * max(0.0, sa) ** 3)
        py = (.6 * sa if sa < 0 else .66 * sa)
        pts.append((cx + px * s + fx * .35, cy + py * s))
    c.poly(pts, tone, sh=8)
    # oreille(s)
    c.ell(cx - .47 * s + fx * .35, cy + .02 * s, .06 * s, .11 * s, dark(tone, .9), sh=1)
    c.ell(cx + .47 * s + fx * .35, cy + .02 * s, .06 * s, .11 * s, dark(tone, .9), sh=1)
    if earring:
        c.arc(cx + (.47 if turn <= 0 else -.47) * s + fx * .35, cy + .2 * s, .07 * s, 0, 360, .022 * s, GOLD_, sh=0)
    # joues (reflet léger)
    if blush:
        for sx in (-1, 1):
            c.ell(cx + sx * .27 * s + fx, cy + .22 * s, .1 * s, .06 * s, tuple(min(255, v + 10) for v in tone), sh=0,
                  edge=tuple(min(255, v + 10) for v in tone), jit=False)
    # ---- taches (sous les traits)
    for dx, dy, r in spots:
        hc_ = tuple(int(tone[i] * .62 + SPOT_K[i] * .38) for i in range(3))
        tache(c, cx + dx * s + fx * .35, cy + dy * s, r * s, hc=hc_)
    # ---- nez
    nx = cx + fx * 1.15
    c.poly([(nx + .01 * s, cy - .06 * s), (nx - .05 * s + turn * .02 * s, cy + .17 * s),
            (nx + .07 * s + turn * .02 * s, cy + .17 * s)], dark(tone, .88), sh=0, jit=False, edge=dark(tone, .88))
    c.ell(nx + .01 * s, cy + .17 * s, .075 * s, .035 * s, dark(tone, .8), sh=0, jit=False)
    # ---- yeux
    for sx in (-1, 1):
        far = (sx == (1 if turn > 0 else -1)) and abs(turn) > .2
        k = .82 if far else 1.0
        ex = cx + sx * .2 * s + fx * (.7 if far else 1.0) * 1.0
        ey = cy - .08 * s
        closed = expr == 'wince'
        if closed:
            c.arc(ex, ey + .02 * s, .07 * s, 200, 340, .02 * s, BROWN, sh=0)
        else:
            c.ell(ex, ey, .09 * s * k, .056 * s, CREAM, sh=0, jit=False)
            c.circ(ex + look * .025 * s, ey, .042 * s * k, (60, 34, 20), sh=0, edge=BROWN, jit=False)
            c.circ(ex + look * .025 * s - .01 * s, ey - .012 * s, .01 * s, CREAM, sh=0, edge=CREAM, jit=False)
            c.strip((ex - .095 * s * k, ey - .035 * s), (ex + .095 * s * k, ey - .04 * s), .012 * s, BROWN, sh=0)
        raise_ = (brow_up * .05 * s) if (sx == 1) else 0
        yo, yi = ey - .115 * s, ey - .115 * s
        if expr == 'wince':
            yo, yi = ey - .13 * s, ey - .075 * s
        elif expr == 'sad':
            yo, yi = ey - .09 * s, ey - .135 * s
        elif expr == 'skep':
            yo, yi = ey - .115 * s, ey - .105 * s
        xo, xi = ex - sx * .1 * s * k, ex + sx * .1 * s * k
        c.strip((xo, yo - raise_), (xi, yi - raise_), .024 * s, HAIR, sh=0)
    # ---- bouche
    mx = cx + fx * 1.0
    my = cy + .36 * s
    if expr in ('smile', 'happy'):
        c.poly([(mx - .13 * s, my - .02 * s), (mx, my + .07 * s), (mx + .13 * s, my - .02 * s), (mx, my + .015 * s)],
               LIP, sh=0, jit=False)
        if expr == 'happy':
            c.poly([(mx - .11 * s, my - .01 * s), (mx + .11 * s, my - .01 * s), (mx, my + .09 * s)], CREAM, sh=0,
                   jit=False)
            c.arc(mx, my - .03 * s, .12 * s, 20, 160, .03 * s, LIP, sh=0)
    elif expr == 'wince':
        c.arc(mx, my + .08 * s, .1 * s, 200, 340, .03 * s, LIP, sh=0)
    elif expr == 'sad':
        c.arc(mx, my + .09 * s, .1 * s, 205, 335, .03 * s, LIP, sh=0)
    else:
        c.ell(mx - .045 * s, my, .06 * s, .028 * s, LIP, sh=0, jit=False)
        c.ell(mx + .045 * s, my, .06 * s, .028 * s, LIP, sh=0, jit=False)
        c.ell(mx, my + .03 * s, .095 * s, .03 * s, dark(LIP, 1.1), sh=0, jit=False)
    if hair == 1:
        for ox, oy, r in [(-.62, .62, .26), (.62, .62, .26), (-.64, .9, .25), (.64, .9, .25), (-.6, 1.18, .23), (.6, 1.18, .23)]:
            c.circ(cx + ox * s, cy + oy * s, r * s, HAIR, sh=3)
    # ---- frange
    for ang in range(-150, -29, 22):
        a = math.radians(ang)
        c.circ(cx + (.47 * math.cos(a)) * s + fx * .35, cy + (.6 * math.sin(a) + .02) * s, .13 * s, HAIR, sh=2)


GOLD_ = (222, 170, 60)


def spots_cheeks(k=1.0):
    return [(-.3, .12, .024 * k), (-.2, .22, .018 * k), (.27, .1, .027 * k), (.33, .22, .019 * k), (.12, .3, .017 * k),
            (-.12, -.22, .02 * k), (.2, -.28, .023 * k), (-.38, -.03, .017 * k), (0, .25, .014 * k), (-.28, .27, .015 * k)]
