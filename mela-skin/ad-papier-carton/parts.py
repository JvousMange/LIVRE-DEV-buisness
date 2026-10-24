"""Éléments réutilisables des scènes (tout en papier)."""
import math, random
from paper import *


def dots(c, cx, cy, rx, ry, n=22, rmin=9, rmax=20, seed=1, color=OR, clip=None, elev=3):
    r = random.Random(seed)
    placed = []
    tries = 0
    while len(placed) < n and tries < n * 60:
        tries += 1
        a, d = r.uniform(0, 6.28), math.sqrt(r.random())
        x, y = cx + rx * d * math.cos(a), cy + ry * d * math.sin(a)
        rad = r.uniform(rmin, rmax)
        if all((x - px) ** 2 + (y - py) ** 2 > (rad + pr + 4) ** 2 for px, py, pr in placed):
            placed.append((x, y, rad))
    for x, y, rad in placed:
        m = ell(x, y, rad)
        if clip is not None:
            m = I(m, clip)
        c.add(m, color, elev=elev)
    return placed


def xmark(c, cx, cy, s=90, w=34, color=OR):
    c.add(U(line([(cx - s, cy - s), (cx + s, cy + s)], w), line([(cx - s, cy + s), (cx + s, cy - s)], w)), color, elev=9)


def arrow(c, x0, y0, x1, y1, w=46, head=95, color=OR):
    a = math.atan2(y1 - y0, x1 - x0)
    bx, by = x1 - head * math.cos(a), y1 - head * math.sin(a)
    px, py = -math.sin(a), math.cos(a)
    c.add(U(line([(x0, y0), (bx, by)], w),
            poly([(x1, y1), (bx + px * head * 0.62, by + py * head * 0.62), (bx - px * head * 0.62, by - py * head * 0.62)])),
          color, elev=9)


def hand(c, x, y, ang=0, s=1.0, skin=SK_D, point=False, sleeve=None, arm=420):
    """Main « mitaine » en papier. (x,y)=poignet, ang en degrés (0 = pointe vers la droite)."""
    a = math.radians(ang)
    ca, sa = math.cos(a), math.sin(a)

    def P(u, v):
        return (x + (u * ca - v * sa) * s, y + (u * sa + v * ca) * s)
    bx, by = P(-arm, 0)
    if sleeve:
        c.add(line([(bx, by), P(-20, 0)], 120 * s), sleeve, elev=8)
    c.add(line([P(-arm * 0.45, 0), P(0, 0)], 78 * s), skin, elev=8)
    c.add(ell(*P(70, 0), 82 * s, 64 * s, rot=a), skin, elev=9)
    if point:
        c.add(line([P(110, -6), P(215, -6)], 30 * s), skin, elev=9)
        c.add(line([P(95, 24), P(150, 34)], 22 * s), skin, elev=9)
    else:
        for i, v in enumerate((-36, -12, 12, 36)):
            c.add(line([P(110, v * 0.9), P(160 - abs(v) * 0.3, v * 1.2)], 26 * s), skin, elev=8)
        c.add(line([P(40, -52), P(90, -92)], 28 * s), skin, elev=8)


def head(c, cx, cy, rx, ry, skin, hair=DARK, seed=3, bun=False, longhair=False, ears=True):
    if longhair:
        c.add(ell(cx, cy + ry * 0.45, rx * 1.18, ry * 1.25, wob=0.02, seed=seed), hair, elev=7)
    c.add(rr(cx - rx * 0.32, cy + ry * 0.55, cx + rx * 0.32, cy + ry * 1.7, 30), tuple(int(v * 0.9) for v in skin), elev=5)
    if ears:
        c.add(U(ell(cx - rx * 0.98, cy + ry * 0.05, rx * 0.12, ry * 0.2), ell(cx + rx * 0.98, cy + ry * 0.05, rx * 0.12, ry * 0.2)), skin, elev=4)
    c.add(ell(cx, cy, rx, ry, wob=0.012, seed=seed), skin, elev=8)
    # coiffure : masse de cheveux avec ligne d'implantation courbe
    cap = S(I(ell(cx, cy - ry * 0.1, rx * 1.1, ry * 1.1, wob=0.02, seed=seed + 1), rr(cx - rx * 1.4, cy - ry * 1.5, cx + rx * 1.4, cy + ry * 0.02, 0)),
            ell(cx + rx * 0.12, cy + ry * 0.2, rx * 0.9, ry * 0.72))
    c.add(cap, hair, elev=6)
    if bun:
        c.add(ell(cx, cy - ry * 1.12, rx * 0.34, rx * 0.34, wob=0.03), hair, elev=6)


def torso(c, cx, top, w, h, color=CHAR, r=60):
    c.add(rr(cx - w / 2, top, cx + w / 2, top + h, r), color, elev=9)


def woman(c, cx, top, s=1.0, skin=SK_D, shirt=CHAR, hair=DARK, longhair=False, bun=False, seed=2, body=True, arms="down", spots=False):
    hr = 130 * s
    hy = top + hr * 1.18
    if body:
        torso(c, cx, hy + hr * 1.55, 400 * s, 620 * s, shirt, 90 * s)
        # bras
        if arms == "down":
            c.add(line([(cx - 175 * s, hy + hr * 1.9), (cx - 205 * s, hy + hr * 1.9 + 480 * s)], 82 * s), shirt, elev=8)
            c.add(line([(cx + 175 * s, hy + hr * 1.9), (cx + 205 * s, hy + hr * 1.9 + 480 * s)], 82 * s), shirt, elev=8)
    head(c, cx, hy, hr, hr * 1.22, skin, hair, seed=seed, bun=bun, longhair=longhair)
    if spots:
        dots(c, cx, hy + hr * 0.55, hr * 0.62, hr * 0.46, n=14, rmin=4 * s + 2, rmax=9 * s + 3, seed=seed)
    return cx, hy, hr


def face_macro(c, cx=520, cy=900, rx=580, ry=740, skin=SK_D, hair=DARK, n=34, seed=5, dotcolor=OR, bigger=1.0, ndots=True, extra=None):
    """Joue en gros plan (visage tourné à gauche, oreille et cheveux à droite)."""
    c.add(ell(cx + 140, cy - 60, rx + 110, ry + 70, wob=0.02, seed=seed + 7), hair, elev=7)
    c.add(rr(cx + 60, cy + ry * 0.55, cx + 480, cy + ry * 1.7, 60), tuple(int(v * 0.88) for v in skin), elev=6)  # cou
    c.add(ell(cx + rx * 0.88, cy + ry * 0.04, 80, 170, wob=0.02), tuple(int(v * 0.9) for v in skin), elev=5)  # oreille
    face = ell(cx, cy, rx, ry, wob=0.012, seed=seed)
    c.add(face, skin, elev=9)
    front = S(I(ell(cx + 40, cy - ry * 0.22, rx * 1.04, ry * 0.95, wob=0.015, seed=seed + 2), rr(0, 0, W, cy - ry * 0.3, 0)),
              ell(cx + rx * 0.25, cy - ry * 0.02, rx * 0.95, ry * 0.62))
    c.add(front, hair, elev=7)
    if ndots:
        dots(c, cx - rx * 0.28, cy + ry * 0.36, rx * 0.5, ry * 0.26, n=n, rmin=11 * bigger, rmax=22 * bigger, seed=seed, color=dotcolor, clip=I(face, ell(cx, cy, rx - 4, ry - 4)))
    return face


def bottle(c, cx, cy, s=1.0, label="MELA\nSKIN"):
    """Flacon compte-gouttes ambré, étiquette brune, lettrage crème."""
    w, h = 230 * s, 460 * s
    c.add(rr(cx - w / 2, cy - h / 2 + 60 * s, cx + w / 2, cy + h / 2, 56 * s), AMBER, elev=12, shade=0.10)
    c.add(rr(cx - w / 2 + 22 * s, cy - h / 2 + 90 * s, cx - w / 2 + 52 * s, cy + h / 2 - 40 * s, 16 * s), (222, 156, 78), elev=0, edge=False)
    c.add(rr(cx - w / 2 - 2, cy - 20 * s, cx + w / 2 + 2, cy + h / 2 - 50 * s, 12 * s), BRN, elev=4)
    lines = label.split("\n")
    for i, t in enumerate(lines):
        c.add(text(t, cx, cy + (35 + i * 58) * s, int(48 * s)), CREAM, elev=0, edge=False)
    c.add(rr(cx - 55 * s, cy - h / 2 + 8 * s, cx + 55 * s, cy - h / 2 + 90 * s, 12 * s), CHOC, elev=8)
    c.add(U(ell(cx, cy - h / 2 - 22 * s, 42 * s, 62 * s), rr(cx - 40 * s, cy - h / 2 - 20 * s, cx + 40 * s, cy - h / 2 + 20 * s, 8)), (58, 40, 34), elev=8)


def vial(c, cx, cy, n="1", s=1.0, color=AMBER):
    w, h = 130 * s, 270 * s
    c.add(rr(cx - w / 2, cy - h / 2 + 40 * s, cx + w / 2, cy + h / 2, 34 * s), color, elev=10, shade=0.08)
    c.add(rr(cx - w / 2 - 1, cy - 4 * s, cx + w / 2 + 1, cy + h / 2 - 34 * s, 8 * s), BRN, elev=3)
    c.add(text(n, cx, cy + 62 * s, int(70 * s)), CREAM, elev=0, edge=False)
    c.add(rr(cx - 34 * s, cy - h / 2 + 6 * s, cx + 34 * s, cy - h / 2 + 54 * s, 8 * s), CHOC, elev=7)
    c.add(ell(cx, cy - h / 2 - 12 * s, 26 * s, 38 * s), (58, 40, 34), elev=7)


def jar(c, cx, cy, s=1.0, body=CREAM, lid=BRN, label_color=None, **_):
    c.add(rr(cx - 120 * s, cy - 60 * s, cx + 120 * s, cy + 110 * s, 30 * s), body, elev=10)
    c.add(rr(cx - 132 * s, cy - 120 * s, cx + 132 * s, cy - 54 * s, 18 * s), lid, elev=8)
    if label_color:
        c.add(rr(cx - 70 * s, cy - 10 * s, cx + 70 * s, cy + 60 * s, 12 * s), label_color, elev=0, edge=False)


def tube(c, cx, cy, s=1.0, body=CREAM, cap=BRN, rot=0, **_):
    h = 420 * s
    m = U(poly([(cx - 90 * s, cy - h / 2), (cx + 90 * s, cy - h / 2), (cx + 70 * s, cy + h / 2), (cx - 70 * s, cy + h / 2)]))
    c.add(m, body, elev=9)
    c.add(rr(cx - 78 * s, cy + h / 2 - 8, cx + 78 * s, cy + h / 2 + 34 * s, 8), tuple(int(v * 0.85) for v in body), elev=4)
    c.add(rr(cx - 56 * s, cy - h / 2 - 74 * s, cx + 56 * s, cy - h / 2 + 4, 12 * s), cap, elev=8)


def sun(c, cx, cy, r=110, color=YEL):
    for i in range(12):
        a = i * math.pi / 6
        p = lambda rad, off: (cx + rad * math.cos(a + off), cy + rad * math.sin(a + off))
        c.add(poly([p(r * 1.75, 0), p(r * 1.2, 0.17), p(r * 1.2, -0.17)]), color, elev=6)
    c.add(ell(cx, cy, r), color, elev=9)


def razor(c, cx, cy, s=1.0):
    c.add(line([(cx - 20 * s, cy + 40 * s), (cx - 20 * s, cy + 260 * s)], 52 * s), (88, 120, 140), elev=8)
    c.add(rr(cx - 100 * s, cy - 50 * s, cx + 90 * s, cy + 50 * s, 22 * s), (170, 176, 178), elev=9)
    c.add(rr(cx - 88 * s, cy - 14 * s, cx + 78 * s, cy + 12 * s, 6), (216, 220, 222), elev=0, edge=False)


def towel(c, cx, cy, s=1.0):
    pts = []
    for i in range(0, 21):
        pts.append((cx - 160 * s + i * 16 * s, cy - 110 * s + math.sin(i * 0.9) * 16 * s))
    for i in range(20, -1, -1):
        pts.append((cx - 160 * s + i * 16 * s, cy + 110 * s + math.sin(i * 0.9 + 1.4) * 16 * s))
    c.add(poly(pts), CREAM, elev=9)
    for k in range(-1, 2):
        c.add(rr(cx - 140 * s, cy + k * 50 * s - 8, cx + 140 * s, cy + k * 50 * s + 8, 4), TEAL, elev=0, edge=False)


def card(c, cx, cy, w=360, h=360, color=KRL, r=40):
    c.add(rr(cx - w / 2, cy - h / 2, cx + w / 2, cy + h / 2, r), color, elev=10)


def calendar_page(c, cx, cy, w=330, h=360, rings=(), seed=1):
    c.add(rr(cx - w / 2, cy - h / 2, cx + w / 2, cy + h / 2, 22), CREAM, elev=10)
    c.add(rr(cx - w / 2, cy - h / 2, cx + w / 2, cy - h / 2 + 62, 22), TEAL, elev=0, edge=False)
    cols, rows = 5, 4
    cw, ch = (w - 50) / cols, (h - 130) / rows
    for r_ in range(rows):
        for k in range(cols):
            x = cx - w / 2 + 25 + k * cw + cw / 2
            y = cy - h / 2 + 90 + r_ * ch + ch / 2
            c.add(rr(x - cw * 0.34, y - ch * 0.3, x + cw * 0.34, y + ch * 0.3, 6), BEIGE, elev=0, edge=False)
    for (r_, k) in rings:
        x = cx - w / 2 + 25 + k * cw + cw / 2
        y = cy - h / 2 + 90 + r_ * ch + ch / 2
        c.add(S(ell(x, y, cw * 0.46), ell(x, y, cw * 0.32)), OR, elev=3)


def heart(c, cx, cy, s=1.0, color=OR):
    c.add(U(ell(cx - 30 * s, cy - 18 * s, 38 * s), ell(cx + 30 * s, cy - 18 * s, 38 * s),
            poly([(cx - 66 * s, cy - 5 * s), (cx + 66 * s, cy - 5 * s), (cx, cy + 75 * s)])), color, elev=6)


def sparkle(c, cx, cy, r=60, color=CREAM):
    k = 0.28
    c.add(poly([(cx, cy - r), (cx + r * k, cy - r * k), (cx + r, cy), (cx + r * k, cy + r * k), (cx, cy + r), (cx - r * k, cy + r * k), (cx - r, cy), (cx - r * k, cy - r * k)]), color, elev=5)


def flame(c, cx, cy, s=1.0):
    c.add(poly([(cx, cy - 150 * s), (cx + 70 * s, cy - 30 * s), (cx + 90 * s, cy + 40 * s), (cx + 50 * s, cy + 110 * s), (cx - 50 * s, cy + 110 * s), (cx - 90 * s, cy + 40 * s), (cx - 60 * s, cy - 30 * s), (cx - 25 * s, cy - 60 * s)]), OR, elev=8)
    c.add(ell(cx, cy + 50 * s, 40 * s, 55 * s), YEL, elev=3)


def qmark(c, cx, cy, size=420, color=OR):
    c.add(text("?", cx, cy, size), color, elev=14)


def numeral(c, n, cx, cy, size=700, color=KRL, elev=14):
    c.add(text(str(n), cx, cy, size), color, elev=elev)


def bead_cloud(c, cx, cy, rx, ry, n=30, seed=1, color=SK_E, rmin=10, rmax=16):
    return dots(c, cx, cy, rx, ry, n=n, rmin=rmin, rmax=rmax, seed=seed, color=color, elev=3)


def cell(c, cx, cy, s=1.0, color=(150, 92, 60), calm=False):
    """Mélanocyte : corps + prolongements + noyau."""
    for a in (20, 95, 160, 235, 300):
        r = math.radians(a)
        c.add(line([(cx, cy), (cx + math.cos(r) * 190 * s, cy + math.sin(r) * 150 * s)], 44 * s), color, elev=7)
    c.add(ell(cx, cy, 120 * s, 100 * s, wob=0.04, seed=4), color, elev=9)
    c.add(ell(cx - 12 * s, cy - 6 * s, 44 * s), (96, 58, 42), elev=3)


def skin_block(c, x0, y0, x1, y1, tones=None, wave=14, seed=1):
    """Coupe de peau : bandes superposées découpées à la main."""
    tones = tones or [(206, 150, 112), (176, 118, 84), (146, 92, 64), (120, 76, 52)]
    n = len(tones)
    hs = (y1 - y0) / n
    r = random.Random(seed)
    for i, t in enumerate(tones):
        top = y0 + i * hs
        pts = [(x0, top + r.uniform(-wave, wave))]
        steps = 12
        for k in range(1, steps):
            pts.append((x0 + (x1 - x0) * k / steps, top + r.uniform(-wave, wave)))
        pts.append((x1, top + r.uniform(-wave, wave)))
        pts += [(x1, y1), (x0, y1)]
        c.add(poly(pts), t, elev=8 if i else 10)
    return hs


def bathroom_bg(c, mirror=True):
    c.add(rr(-40, 1180, W + 40, 1960, 0), KRD, elev=10)               # meuble
    c.add(rr(-40, 1150, W + 40, 1200, 0), CREAM, elev=10)             # plan
    if mirror:
        c.add(rr(250, 160, 830, 900, 30), CREAM, elev=14)
        c.add(rr(280, 190, 800, 870, 18), (206, 210, 204), elev=0, edge=False)
    c.add(rr(120, 1010, 210, 1150, 18), BEIGE, elev=7)
    c.add(rr(880, 1040, 960, 1150, 14), TEAL, elev=7)
    c.add(rr(60, 1250, 520, 1300, 8), KRL, elev=6)


def ground(c, y=1640):
    """Pile de cartons ondulés en bas de cadre, comme dans la vidéo de référence."""
    tones = [KRD, (180, 136, 92), (158, 114, 74), (190, 146, 100)]
    for i, t in enumerate(tones):
        top = y + i * 70
        c.add(rr(-30, top, W + 30, top + 80, 6), t, elev=10)
        for x in range(0, W, 26):
            c.add(rr(x, top + 14, x + 8, top + 60, 3), tuple(int(v * 0.88) for v in t), elev=0, edge=False, grainy=False, alpha=0.7)
