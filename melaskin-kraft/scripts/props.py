import math
from kraft import *

SP = [(-.24, .02, .055), (.26, -.04, .065), (-.06, .28, .05), (.14, .16, .045), (-.32, .2, .04), (.05, -.2, .04)]


def face(c, cx, cy, s, spots=(), sk=SKIN, mood='n', look=0, brow=0, k=1.0):
    c.ell(cx, cy + .98 * s, .78 * s, .4 * s, TERRA)
    c.rect(cx, cy + .66 * s, .22 * s, .34 * s, dark(sk, .85), sh=2)
    for ox, oy, r in [(-.46, -.05, .26), (-.5, .2, .22), (.46, -.05, .26), (.5, .2, .22), (-.3, -.42, .28),
                      (.3, -.42, .28), (0, -.55, .3), (-.45, -.25, .25), (.45, -.25, .25)]:
        c.circ(cx + ox * s, cy + oy * s, r * s, HAIR, sh=3)
    c.ell(cx, cy, .5 * s, .62 * s, sk)
    c.ell(cx, cy - .52 * s, .5 * s, .16 * s, HAIR, sh=0)
    for dx, dy, r in spots:
        c.circ(cx + dx * s, cy + dy * s, r * s * k, SPOT, sh=1, edge=SPOT)
    # eyes
    for sx in (-1, 1):
        ex, ey = cx + sx * .2 * s, cy - .06 * s
        c.ell(ex, ey, .085 * s, .055 * s, CREAM, sh=0)
        c.circ(ex + look * .03 * s, ey, .033 * s, BROWN, sh=0, edge=BROWN)
        by = ey - .1 * s
        tilt = {'n': 0, 'sad': -sx * 10, 'skep': -sx * 6, 'smile': 0}.get(mood, 0)
        raise_ = brow * .06 * s if (mood == 'skep' and sx == 1) else 0
        c.strip((ex - .08 * s, by + tilt * .004 * s - raise_), (ex + .08 * s, by - tilt * .004 * s - raise_),
                .03 * s, HAIR, sh=0)
    # nose
    c.poly([(cx, cy + .02 * s), (cx - .05 * s, cy + .13 * s), (cx + .05 * s, cy + .13 * s)], dark(sk, .88), sh=0)
    # mouth
    my = cy + .3 * s
    if mood in ('n', 'skep'):
        c.strip((cx - .09 * s, my), (cx + .09 * s, my + (.01 * s if mood == 'skep' else 0)), .03 * s, RED, sh=0)
    elif mood == 'smile':
        c.arc(cx, my - .08 * s, .14 * s, 25, 155, .035 * s, RED)
    elif mood == 'sad':
        c.arc(cx, my + .1 * s, .13 * s, 205, 335, .035 * s, RED)
    elif mood == 'wow':
        c.ell(cx, my, .05 * s, .06 * s, RED, sh=0)


def bottle(c, cx, cy, s, rot=0, body=BROWN, lab=CREAM, brand=True, bulb=TERRA):
    a = math.radians(rot)
    ca, sa = math.cos(a), math.sin(a)

    def P(x, y):
        return cx + x * ca - y * sa, cy + x * sa + y * ca

    px, py = P(0, -.12 * s)
    c.rect(px, py, .52 * s, .74 * s, body, rot=rot, r=.1 * s)
    px, py = P(0, -.58 * s)
    c.rect(px, py, .2 * s, .16 * s, dark(body, 1.2) if body != BROWN else (70, 40, 22), rot=rot, sh=2)
    px, py = P(0, -.74 * s)
    c.rect(px, py, .26 * s, .2 * s, (60, 36, 20) if body == BROWN else dark(body), rot=rot, r=.04 * s, sh=2)
    px, py = P(0, -.9 * s)
    c.ell(px, py, .11 * s, .13 * s, bulb, rot=rot, sh=2)
    px, py = P(0, -.05 * s)
    c.rect(px, py, .4 * s, .4 * s, lab, rot=rot, r=.04 * s, sh=0)
    if brand:
        c.ell(px, py, .13 * s, .13 * s, lab, rot=rot, sh=0, edge=BROWN)
        c.text('M', px, py, size=max(14, int(.17 * s)), fill=BROWN, rot=-rot)
    else:
        c.strip(P(-.12 * s, -.03 * s), P(.12 * s, -.03 * s), .03 * s, dark(lab, .8), sh=0)


def sun(c, cx, cy, r, rot=0):
    for i in range(12):
        a = math.radians(rot + i * 30)
        tip = (cx + (r * 1.75) * math.cos(a), cy + (r * 1.75) * math.sin(a))
        b1 = (cx + r * 1.15 * math.cos(a - .18), cy + r * 1.15 * math.sin(a - .18))
        b2 = (cx + r * 1.15 * math.cos(a + .18), cy + r * 1.15 * math.sin(a + .18))
        c.poly([b1, tip, b2], (240, 160, 40), sh=3)
    c.circ(cx, cy, r, SUN)


def razor(c, cx, cy, s, rot=0):
    c.rect(cx, cy, .22 * s, 1.0 * s, (70, 110, 150), rot=rot, r=.08 * s)
    a = math.radians(rot)
    hx, hy = cx + math.sin(a) * -.55 * s, cy - math.cos(a) * .55 * s
    c.rect(hx, hy, .62 * s, .22 * s, GREY, rot=rot, r=.05 * s)
    c.rect(hx, hy, .5 * s, .05 * s, (220, 225, 230), rot=rot, sh=0)


def pimple(c, cx, cy, r):
    c.circ(cx, cy, r, (176, 110, 80))
    c.circ(cx, cy, r * .5, RED, sh=0)
    c.circ(cx - r * .15, cy - r * .15, r * .18, CREAM, sh=0, edge=CREAM)


def pill(c, cx, cy, s, rot=0):
    a = math.radians(rot)
    dx, dy = math.cos(a) * .25 * s, math.sin(a) * .25 * s
    c.rect(cx, cy, .5 * s, .22 * s, CREAM, rot=rot, r=.11 * s)
    c.rect(cx + dx * 1.0, cy + dy * 1.0, .25 * s, .22 * s, TERRA, rot=rot, r=.11 * s, sh=0)
    c.ell(cx, cy, .035 * s, .035 * s, dark(CREAM), sh=0)


def brush(c, cx, cy, s, rot=0):
    a = math.radians(rot)
    c.rect(cx, cy, .9 * s, .26 * s, KR_D, rot=rot, r=.1 * s)
    bx, by = cx - math.cos(a) * .55 * s, cy - math.sin(a) * .55 * s
    c.rect(bx, by, .22 * s, .36 * s, SAGE, rot=rot, r=.04 * s)
    for i in range(-3, 4):
        ox, oy = -math.sin(a) * i * .05 * s, math.cos(a) * i * .05 * s
        c.strip((bx + ox - math.cos(a) * .12 * s, by + oy - math.sin(a) * .12 * s),
                (bx + ox - math.cos(a) * .3 * s, by + oy - math.sin(a) * .3 * s), .03 * s, CREAM, sh=0)


def sponge(c, cx, cy, s, rot=0):
    c.rect(cx, cy, .9 * s, .6 * s, (232, 196, 140), rot=rot, r=.25 * s)
    for dx, dy in [(-.2, -.1), (.15, -.15), (0, .12), (.25, .1), (-.28, .14)]:
        c.circ(cx + dx * s, cy + dy * s, .035 * s, (190, 150, 100), sh=0, edge=(190, 150, 100))


def flame(c, cx, cy, s):
    c.poly([(cx, cy - s), (cx + .45 * s, cy - .1 * s), (cx + .38 * s, cy + .6 * s), (cx, cy + .8 * s),
            (cx - .38 * s, cy + .6 * s), (cx - .45 * s, cy - .1 * s), (cx - .15 * s, cy - .3 * s)], (232, 90, 40))
    c.poly([(cx, cy), (cx + .22 * s, cy + .3 * s), (cx, cy + .65 * s), (cx - .22 * s, cy + .3 * s)], SUN, sh=0)


def nosign(c, cx, cy, r):
    c.circ(cx, cy, r, CREAM, sh=8)
    c.arc(cx, cy, r * .9, 0, 360, r * .16, RED, sh=0)
    a = math.radians(-45)
    c.strip((cx - r * .8 * math.cos(a), cy - r * .8 * math.sin(a)), (cx + r * .8 * math.cos(a), cy + r * .8 * math.sin(a)),
            r * .16, RED, sh=0)


def gear(c, cx, cy, r, rot=0, col=TERRA):
    pts = []
    n = 16
    for i in range(n * 2):
        a = math.radians(rot + i * 180 / n)
        rr = r if i % 2 == 0 else r * .84
        pts.append((cx + rr * math.cos(a), cy + rr * math.sin(a)))
    c.poly(pts, col)
    c.circ(cx, cy, r * .6, dark(col, 1.15) if max(col) < 200 else col, sh=0)
    a = math.radians(rot - 90)
    c.strip((cx, cy), (cx + r * .55 * math.cos(a), cy + r * .55 * math.sin(a)), r * .12, CREAM, sh=0)
    c.circ(cx, cy, r * .13, CREAM, sh=0)


def ball(c, x, y, r=13):
    c.circ(x, y, r, SPOT, sh=3, edge=(40, 18, 8))


def balls_flow(c, t, x0, y0, x1, y1, rate, n=14, speed=0.5, r=13):
    for i in range(n):
        if i >= n * rate:
            continue
        p = (t * speed + i / n) % 1.0
        ball(c, x0 + (x1 - x0) * p, y0 + (y1 - y0) * p + (6 if i % 2 else -6), r)


def pipe(c, x0, y0, x1, y1, wd=60):
    c.strip((x0, y0), (x1, y1), wd, (150, 150, 156), sh=5)
    c.strip((x0, y0 - wd * .18), (x1, y1 - wd * .18), wd * .18, (200, 204, 208), sh=0, jit=False)


def hand(c, cx, cy, s, rot=0, sk=SKIN):
    a = math.radians(rot)
    ca, sa = math.cos(a), math.sin(a)

    def P(x, y):
        return cx + x * ca - y * sa, cy + x * sa + y * ca

    for i, (fx, fl) in enumerate([(-.17, .5), (-.055, .62), (.055, .58), (.17, .46)]):
        px, py = P(fx * s, -.38 * s)
        c.rect(px, py, .1 * s, fl * s, sk, rot=rot, r=.05 * s, sh=3)
    px, py = P(0, 0)
    c.rect(px, py, .48 * s, .5 * s, sk, rot=rot, r=.14 * s)
    px, py = P(-.3 * s, .02 * s)
    c.rect(px, py, .1 * s, .32 * s, sk, rot=rot - 35, r=.05 * s, sh=3)


def star(c, cx, cy, r, rot=0, col=CREAM):
    pts = []
    for i in range(8):
        a = math.radians(rot + i * 45)
        rr = r if i % 2 == 0 else r * .36
        pts.append((cx + rr * math.cos(a), cy + rr * math.sin(a)))
    c.poly(pts, col, sh=3)


def heart(c, cx, cy, s, col=RED, rot=0):
    pts = []
    for i in range(30):
        t = 2 * math.pi * i / 30
        x = 16 * math.sin(t) ** 3
        y = -(13 * math.cos(t) - 5 * math.cos(2 * t) - 2 * math.cos(3 * t) - math.cos(4 * t))
        pts.append((x, y))
    a = math.radians(rot)
    pts = [(cx + (x * math.cos(a) - y * math.sin(a)) * s / 16, cy + (x * math.sin(a) + y * math.cos(a)) * s / 16)
           for x, y in pts]
    c.poly(pts, col, sh=3)


def section(c, cx, cy, w, h, lift=0.0, sk=SKIN, tilt=0.0):
    top = cy - h / 2
    c.rect(cx, top + h * .78, w, h * .44, KR_D, sh=6)
    for x in range(int(cx - w / 2) + 10, int(cx + w / 2) - 5, 24):
        c.d.line((x, top + h * .58, x, top + h * .99), fill=dark(KR_D, .78) + (255,), width=5)
    c.rect(cx, top + h * .44, w, h * .26, KR_L, sh=0)
    for x in range(int(cx - w / 2) + 10, int(cx + w / 2) - 5, 18):
        c.d.line((x, top + h * .32, x, top + h * .56), fill=dark(KR_L, .86) + (255,), width=3)
    # epidermis
    ox, oy = 0, -lift
    pts = [(cx - w / 2 + ox, top + h * .31 + oy), (cx - w / 2 + ox, top + h * .06 + oy)]
    for i in range(0, 13):
        pts.append((cx - w / 2 + ox + w * i / 12, top + h * (.06 + .02 * math.sin(i * 1.7)) + oy))
    pts += [(cx + w / 2 + ox, top + h * .31 + oy)]
    if tilt:
        a = math.radians(tilt)
        pts = [(cx + (x - cx) * math.cos(a) - (y - cy) * math.sin(a), cy + (x - cx) * math.sin(a) + (y - cy) * math.cos(a))
               for x, y in pts]
    c.poly(pts, sk, sh=7)
    return top


def calendar(c, cx, cy, s, tear, pages=4):
    i = int(tear)
    p = tear - i
    n_left = max(0, pages - i)
    for k in range(min(3, n_left)):
        c.rect(cx + k * 6, cy + k * 6, .9 * s, 1.0 * s, CREAM if k == 0 else dark(CREAM, .9), r=.04 * s, sh=4)
    if n_left > 0:
        fx = ease(p) * .9 * s
        fy = -ease(p) * .3 * s
        rot = ease(p) * 28
        a = math.radians(rot)
        ccx, ccy = cx + fx, cy + fy
        c.rect(ccx, ccy, .9 * s, 1.0 * s, CREAM, rot=rot, r=.04 * s, sh=6)
        c.rect(ccx, ccy - .38 * s, .9 * s, .24 * s, TERRA, rot=rot, r=.03 * s, sh=0)
        for gx in range(3):
            for gy in range(3):
                c.rect(ccx - .27 * s + gx * .27 * s, ccy + .02 * s + gy * .2 * s, .16 * s, .12 * s,
                       dark(CREAM, .88), rot=rot, sh=0)
    else:
        pass


def brick_wall(c, cx, base_y, w, rows, n):
    bw, bh = 92, 44
    cols = int(w / bw)
    k = 0
    for r in range(rows):
        for q in range(cols):
            if k >= n:
                return
            xoff = (bw / 2) if r % 2 else 0
            x = cx - w / 2 + bw / 2 + q * bw + xoff - (bw / 2 if r % 2 else 0) * 0
            if r % 2 and q == cols - 1:
                continue
            y = base_y - r * bh
            c.rect(x + (bw / 2 if r % 2 else 0), y, bw - 4, bh - 4, KR_D if (q + r) % 2 else TERRA, sh=2, r=4)
            k += 1


def giftbox(c, cx, cy, s, lid=0.0):
    c.rect(cx, cy, s, .7 * s, SAGE, r=.03 * s)
    c.rect(cx, cy, .16 * s, .7 * s, CREAM, sh=0)
    c.rect(cx, cy - .45 * s - lid, 1.1 * s, .22 * s, dark(SAGE, .9), r=.03 * s)
    c.rect(cx, cy - .45 * s - lid, .16 * s, .22 * s, CREAM, sh=0)
    c.ell(cx - .14 * s, cy - .62 * s - lid, .14 * s, .09 * s, CREAM, rot=-25)
    c.ell(cx + .14 * s, cy - .62 * s - lid, .14 * s, .09 * s, CREAM, rot=25)


def stamp(c, cx, cy, r, txt, col=TERRA, rot=-8, sc=1.0, size=60, fg=CREAM):
    if sc <= 0.03:
        return
    R = r * sc
    c.circ(cx, cy, R, col, sh=9)
    c.arc(cx, cy, R * .86, 0, 360, R * .06, fg, sh=0)
    c.text(txt, cx, cy, size=max(10, int(size * sc)), fill=fg, rot=rot)


def bill(c, cx, cy, s=1.0, rot=0):
    c.rect(cx, cy, 190 * s, 100 * s, SAGE, rot=rot, r=8)
    c.circ(cx, cy, 30 * s, CREAM, sh=0)
    c.text('€', cx, cy, size=int(40 * s), fill=SAGE, rot=-rot)


def enzyme(c, cx, cy, s, stop=0.0):
    c.ell(cx, cy, .45 * s, .55 * s, SAGE)
    for sx in (-1, 1):
        c.circ(cx + sx * .16 * s, cy - .15 * s, .08 * s, CREAM, sh=0)
        c.circ(cx + sx * .16 * s, cy - .15 * s, .035 * s, BROWN, sh=0, edge=BROWN)
    c.arc(cx, cy + .05 * s, .15 * s, 20, 160, .03 * s, BROWN, sh=0)
    c.ell(cx - .5 * s, cy + .15 * s, .09 * s, .18 * s, dark(SAGE, .9), rot=20)
    ax, ay = cx + .52 * s, cy - .1 * s - stop * .35 * s
    c.strip((cx + .35 * s, cy + .05 * s), (ax, ay), .12 * s, dark(SAGE, .9))
    c.circ(ax, ay - .08 * s, .17 * s, CREAM)
    c.text('STOP', ax, ay - .08 * s, size=int(.1 * s), fill=RED)


def arrow(c, p0, p1, wd, fill=TERRA):
    dx, dy = p1[0] - p0[0], p1[1] - p0[1]
    L = math.hypot(dx, dy) or 1
    ux, uy = dx / L, dy / L
    b = (p1[0] - ux * wd * 1.6, p1[1] - uy * wd * 1.6)
    c.strip(p0, b, wd, fill, sh=3)
    nx, ny = -uy, ux
    c.poly([(b[0] + nx * wd, b[1] + ny * wd), p1, (b[0] - nx * wd, b[1] - ny * wd)], fill, sh=3)
