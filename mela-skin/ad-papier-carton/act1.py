"""Acte I · la frustration (S01–S12). Voir DIRECTION.md."""
import math
from paper import *
from parts import *
from scenes import cloth, badge, star, shelf, podium, spiral, drop, bubble, leaf, spotlight

SCENES = {}


def scene(n):
    def deco(fn):
        SCENES[n] = fn
        return fn
    return deco


def numstamp(c, n, t, color=OR, anim=True):
    """Pastille de raison « 1 »–« 5 » : claque en haut à gauche."""
    with c.g("num", origin="bottom"):
        c.add(ell(150, 170, 92), CREAM, elev=14)
        c.add(S(ell(150, 170, 92), ell(150, 170, 80)), color, elev=0, edge=False)
        c.add(text(str(n), 150, 176, 112), color, elev=0, edge=False)
    if anim:
        c.act("num", "fall", t, h=520, d=0.34, squash=0.28)
        c.cam("shake", t + 0.34, amp=10, d=0.35)


def fx_lines(c, name, pts_list, color=CREAM, w=10):
    """Petits traits de mouvement (arcs de vitesse)."""
    with c.g(name):
        for pts in pts_list:
            c.add(line(pts, w), color, elev=0, edge=False)


@scene(1)
def s01(T, D):
    c = Canvas()
    face_macro(c, cx=520, cy=780, n=44, seed=5)
    c.act("dots", "in", -0.12, stag=0.045, f0=0.0, soft=True)
    c.act("dots", "pulse", T("hyperpigmentation") + 0.1, d=0.5, amp=0.12, n=2)
    with c.g("five", origin="bottom"):
        numeral(c, 5, 860, 330, size=640, color=KRL, elev=16)
    t5 = -0.22
    c.act("five", "fall", t5, h=900, d=0.3, squash=0.22)
    c.cam("shake", t5 + 0.3, amp=18, d=0.45)
    with c.g("hand", origin="right"):
        hand(c, 560, 1060, ang=200, sleeve=CHAR)
    th = T("part")
    c.act("hand", "in", th - 0.55, how="right", dist=700)
    c.act("hand", "wipe", th, d=1.05, amp=95, cycles=3, dy=18, tilt=3)
    c.act("dots", "shake", th + 0.05, d=0.9, amp=7, hz=15, rotAmp=1.5)
    c.act("hand", "out", D - 0.35, how="right", dist=700, d=0.3)
    c.cam("push", 0, d=D, f0=1.0, to=1.1, cx=480, cy=1000)
    return c


@scene(2)
def s02(T, D):
    c = Canvas()
    face_macro(c, cx=520, cy=760, n=40, seed=6)
    numstamp(c, 1, 0.12)
    with c.g("cloth"):
        cloth(c, 560, 1060, 0.95, -15)
    with c.g("hand", origin="right"):
        hand(c, 625, 1060, ang=195, sleeve=CHAR)
    t0, t1 = T("essaies"), T("alors")
    for g in ("cloth", "hand"):
        c.act(g, "in", 0.25, how="right", dist=650)
        c.act(g, "move", t0 - 0.25, d=0.25, dx=70, ease="smooth")           # anticipation : recul
        c.act(g, "wipe", t0, d=t1 - t0 + 0.9, amp=135, cycles=5, dy=22, tilt=4, ramp=True)
    fx_lines(c, "fx", [[(250, 960), (170, 985)], [(250, 1020), (150, 1050)], [(260, 1085), (180, 1118)]])
    c.act("fx", "in", t0 + 0.2, how="scale", d=0.2)
    c.act("fx", "bob", t0 + 0.2, amp=6, hz=3.0)
    c.act("dots", "shake", t0 + 0.3, d=1.8, amp=4, hz=11)
    c.cam("push", 0, d=D, f0=1.0, to=1.07, cx=500, cy=1000)
    return c


@scene(3)
def s03(T, D):
    c = Canvas()
    with c.g("block", origin="bottom"):
        skin_block(c, 90, 520, 990, 1280)
    with c.g("seeds"):
        dots(c, 540, 1060, 360, 150, n=26, rmin=12, rmax=22, seed=8)
    c.act("block", "in", 0.0, how="none")
    ts = max(0.1, T("fabriquent") - 0.25)
    c.act("seeds", "in", ts, stag=0.045, f0=0.0, soft=True)
    c.act("seeds", "pulse", ts + 1.0, d=D - ts - 1.0, amp=0.07, n=3)
    with c.g("cloth"):
        cloth(c, 700, 420, 1.0, 5)
    with c.g("hand", origin="right"):
        hand(c, 760, 420, ang=190, sleeve=CHAR, arm=300)
    for g in ("cloth", "hand"):
        c.act(g, "wipe", 0.0, d=D - 0.1, amp=120, cycles=4, dy=10)
    with c.g("arrow", origin="top"):
        arrow(c, 190, 560, 190, 930, w=44, head=90)
    ta = T("sous")
    c.act("arrow", "in", ta, how="top", dist=160)
    c.act("arrow", "bob", ta + 0.5, amp=14, hz=1.6)
    c.cam("push", 0, d=D, f0=1.0, to=1.1, cx=540, cy=1000)
    return c


def dab_patch(c, cx, cy, rx, ry, seed=3):
    with c.g("foundation", "left"):
        c.add(ell(cx, cy, rx, ry, wob=0.03, seed=seed), (190, 138, 102), elev=4)
        c.add(ell(cx + 60, cy - 30, rx * 0.7, ry * 0.6, wob=0.05, seed=seed + 1), (198, 148, 112), elev=2)


@scene(4)
def s04(T, D):
    c = Canvas()
    face_macro(c, cx=520, cy=760, n=40, seed=5)
    numstamp(c, 2, 0.1)
    dab_patch(c, 400, 1030, 280, 150)
    t0 = T("fond")
    c.act("foundation", "wipein", t0 - 0.2, d=T("maquillage") - t0 + 1.2, dir="right")
    with c.g("sponge"):
        c.add(ell(560, 1020, 95, 70, wob=0.05, seed=2), BEIGE, elev=12)
        c.add(ell(545, 1010, 60, 40, wob=0.08, seed=4), (236, 210, 172), elev=0, edge=False)
    with c.g("hand", origin="right"):
        hand(c, 760, 1010, ang=195, sleeve=CHAR)
    for g in ("sponge", "hand"):
        c.act(g, "in", 0.2, how="right", dist=650)
        c.act(g, "wipe", t0 - 0.2, d=T("maquillage") - t0 + 1.3, amp=160, cycles=2.5, dy=60, tilt=5)
        c.act(g, "wipe", t0 - 0.2, d=T("maquillage") - t0 + 1.3, amp=26, cycles=7, axis="y")
    c.cam("push", 0, d=D, f0=1.0, to=1.08, cx=500, cy=1000)
    return c


@scene(5)
def s05(T, D):
    c = Canvas()
    face_macro(c, cx=520, cy=760, n=40, seed=5)
    numstamp(c, 2, 0, anim=False)
    dab_patch(c, 400, 1030, 280, 150)
    with c.g("ghost"):
        dots(c, 400, 1040, 220, 100, n=22, rmin=11, rmax=19, seed=9, alpha=0.8)
    tg = T("fais")
    c.act("ghost", "in", tg, stag=0.05, f0=0.3, soft=True)
    c.act("ghost", "pulse", tg + 0.8, d=D - tg - 0.8, amp=0.09, n=4)
    with c.g("corner", origin=(250, 1170)):
        c.add(poly([(250, 1170), (330, 1080), (420, 1175)]), (230, 186, 146), elev=14)
    c.act("corner", "rot", T("vraiment"), d=0.5, deg=-48)
    with c.g("sponge"):
        c.add(ell(560, 1020, 95, 70, wob=0.05, seed=2), BEIGE, elev=12)
    with c.g("hand", origin="right"):
        hand(c, 760, 1010, ang=195, sleeve=CHAR)
    for g in ("sponge", "hand"):
        c.act(g, "out", tg, how="right", dist=700, d=0.5)
    c.cam("push", 0, d=D, f0=1.04, to=1.12, cx=420, cy=1040)
    return c


@scene(6)
def s06(T, D):
    c = Canvas()
    numstamp(c, 3, 0.1)
    with c.g("shelf"):
        shelf(c, 960)
    c.act("shelf", "in", 0.0, how="none")
    names = ["p0", "p1", "p2", "p3"]
    xs = [200, 420, 640, 860]
    ts = [T("plupart"), T("soins"), T("pensés"), T("peaux")]
    for k, (n, x) in enumerate(zip(names, xs)):
        with c.g(n, "bottom"):
            if k % 2 == 0:
                jar(c, x, 860, 0.8, body=CREAM, lid=BEIGE)
            else:
                tube(c, x, 770, 0.8, body=WHITE, cap=BEIGE)
        c.act(n, "in", ts[k] - 0.5, how="right", dist=900, d=0.4)
        with c.g(f"st{k}"):
            c.add(ell(x, 700 if k % 2 == 0 else 640, 48), SK_L, elev=10)
            c.add(S(ell(x, 700 if k % 2 == 0 else 640, 48), ell(x, 700 if k % 2 == 0 else 640, 38)), KRD, elev=0, edge=False)
        c.act(f"st{k}", "fall", ts[k], h=420, d=0.28, squash=0.3)
        c.cam("shake", ts[k] + 0.28, amp=7, d=0.25)
    with c.g("swatch"):
        card(c, 540, 380, 760, 300, KRL, 30)
        for k, col in enumerate([(246, 228, 206), (240, 218, 190), (236, 208, 176), (230, 198, 162), (224, 190, 152)]):
            c.add(rr(210 + k * 130, 290, 320 + k * 130, 470, 12), col, elev=3)
    c.act("swatch", "in", T("claires") - 0.55, how="top", dist=400)
    with c.g("pale_hand", origin="bottom"):
        hand(c, 560, 1250, ang=-90, skin=SK_L, sleeve=KRL, arm=420)
    c.act("pale_hand", "in", T("claires") - 0.3, how="bottom", dist=400)
    c.cam("pan", 0, d=D, dx=-60)
    return c


@scene(7)
def s07(T, D):
    c = Canvas()
    cx, hy, hr = woman(c, 400, 280, s=1.5, skin=SK_E, shirt=CHAR, gb="body", gh="head")
    with c.g("flare"):
        c.add(ell(cx - 90, hy + 110, 78, 60, wob=0.1), (206, 66, 56), elev=0, alpha=0.8)
        star(c, cx - 90, hy + 110, 120, 9, OR, 0.2)
    with c.g("jar", origin="left"):
        jar(c, 850, 880, 0.9)
    with c.g("hand", origin="right"):
        hand(c, 960, 940, ang=-170, sleeve=CHAR, arm=300)
    ta, tn = T("agressent"), T("rien")
    for g in ("jar", "hand"):
        c.act(g, "in", 0.3, how="right", dist=500)
        c.act(g, "move", ta - 0.55, d=0.4, dx=-340, dy=-260, antic=0.3)
        c.act(g, "move", T("ou", 1), d=0.35, dx=380, dy=240, ease="smooth")
    c.act("flare", "in", ta, how="scale", soft=False)
    c.act("flare", "pulse", ta + 0.3, d=0.9, amp=0.16, n=3)
    c.act("flare", "fade", T("ou", 1) + 0.1, d=0.5, to=0.0)
    c.act("head", "shake", ta, d=0.5, amp=14, hz=15, rotAmp=2.5)
    c.cam("shake", ta, amp=14, d=0.4)
    with c.g("cloud", origin="bottom"):
        thought(c, 800, 420, 200, 120, tail=(-150, 0))
        for dx in (-70, 0, 70):
            c.add(ell(800 + dx, 420, 17), CHAR, elev=0, edge=False)
    c.act("cloud", "in", tn - 0.1, how="scale")
    c.act("body", "bob", tn, d=0.55, amp=24, hz=0.9)
    c.act("head", "bob", tn, d=0.55, amp=30, hz=0.9)
    return c


@scene(8)
def s08(T, D):
    import random as _r
    c = Canvas(KRD)
    r = _r.Random(4)
    cols = [CREAM, TEAL, BRN, YEL, BEIGE, BLUE]
    numstamp(c, 4, 0.1)
    ts = [0.45 + k * 0.3 for k in range(9)]
    for k in range(9):
        x, y = 160 + (k % 3) * 380 + r.randint(-30, 30), 430 + (k // 3) * 330 + r.randint(-20, 20)
        with c.g(f"it{k}", "bottom"):
            (jar if k % 2 == 0 else tube)(c, x, y, r.uniform(0.6, 0.75), body=r.choice(cols), lid=r.choice(cols), cap=r.choice(cols))
        c.act(f"it{k}", "fall", ts[k], h=1000, d=0.4, squash=0.2)
        c.cam("shake", ts[k] + 0.4, amp=6, d=0.2)
    with c.g("scrub"):
        c.add(ell(560, 1170, 190, 110, wob=0.04, seed=2), BEIGE, elev=10)
        dots(c, 560, 1170, 130, 60, n=14, rmin=5, rmax=8, seed=3, color=CHAR)
    with c.g("hand", origin="right"):
        hand(c, 780, 1210, ang=190, sleeve=CHAR)
    for g in ("scrub", "hand"):
        c.act(g, "in", 0.1, how="right", dist=700)
        c.act(g, "wipe", 0.5, d=D - 0.8, amp=70, cycles=5, dy=45, tilt=4)
    c.cam("push", 0, d=D, f0=1.0, to=1.06)
    return c


@scene(9)
def s09(T, D):
    c = Canvas()
    face_macro(c, cx=520, cy=760, n=34, seed=11, bigger=1.2)
    numstamp(c, 4, 0, anim=False)
    tp = T("pire")
    with c.g("dots2"):
        dots(c, 330, 1060, 330, 190, n=40, rmin=13, rmax=26, seed=21)
    c.act("dots2", "in", T("encore") - 0.2, stag=0.035, f0=0.0)
    with c.g("red"):
        for x, y, rx, ry in [(330, 1010, 130, 90), (520, 1120, 150, 100), (650, 980, 100, 80)]:
            c.add(ell(x, y, rx, ry, wob=0.1, seed=x), (212, 68, 56), elev=0, alpha=0.5)
    c.act("red", "in", tp - 0.3, how="scale", soft=True)
    c.act("red", "pulse", tp + 0.3, d=1.2, amp=0.1, n=3)
    with c.g("drop"):
        sweat(c, 780, 560, 1.5)
    c.act("drop", "fall", T("encore"), h=500, d=0.5)
    c.act("drop", "fade", T("encore") + 1.2, d=0.4, to=0)
    c.cam("push", 0, d=D, f0=1.0, to=1.14, cx=420, cy=1040)
    c.cam("shake", tp, amp=10, d=0.5)
    return c


@scene(10)
def s10(T, D):
    c = Canvas()
    face_macro(c, cx=520, cy=780, ndots=False, seed=5)
    numstamp(c, 5, 0.05)
    hits = [("sun", T("soleil"), (360, 1020), (150, 330)), ("razor", T("rasage"), (560, 1060), (900, 360)), ("towel", T("frottement"), (420, 1160), (180, 1200))]
    for n, t, (hx, hy), (sx, sy) in hits:
        with c.g(n):
            if n == "sun":
                sun(c, sx, sy, 70)
            elif n == "razor":
                razor(c, sx, sy, 0.8)
            else:
                towel(c, sx, sy, 0.75)
        c.act(n, "in", max(0.15, t - 1.1), how="scale", soft=True)
        c.act(n, "bob", max(0.15, t - 1.1), d=1.0, amp=16, hz=1.5)
        c.act(n, "move", t - 0.25, d=0.22, dx=hx - sx, dy=hy - sy, ease="smooth", antic=0.25)
        c.act(n, "move", t + 0.05, d=0.3, dx=-(hx - sx) * 0.55, dy=-(hy - sy) * 0.55, antic=0.0)
        c.act(n, "out", t + 0.9, d=0.3, how="scale")
        with c.g("h_" + n):
            dots(c, hx, hy, 90, 70, n=7, rmin=14, rmax=22, seed=hx)
        c.act("h_" + n, "in", t, stag=0.03, f0=0.0)
        c.cam("shake", t, amp=9, d=0.25)
    with c.g("back"):
        dots(c, 440, 1060, 330, 160, n=36, rmin=12, rmax=24, seed=77)
    tr = T("retour")
    c.act("back", "in", tr, stag=0.03, f0=0.0)
    c.act("back", "pulse", tr + 0.6, d=1.0, amp=0.1, n=3)
    c.cam("push", 0, d=D, f0=1.0, to=1.08, cx=440, cy=1050)
    return c


@scene(11)
def s11(T, D):
    c = Canvas()
    bathroom_bg(c)
    cx, hy, hr = woman(c, 540, 330, s=1.25, skin=SK_D, shirt=CHAR, spots=True, gb="body", gh="head")
    c.act("body", "rot", 0.0, d=0.3, deg=-3)
    c.act("head", "rot", 0.0, d=0.3, deg=-10)
    c.act("head", "rot", T("problème"), d=0.5, deg=10)
    c.act("body", "rot", T("problème"), d=0.5, deg=3)
    c.act("head", "bob", T("problème"), d=0.5, amp=16, hz=1.0)
    with c.g("x1", origin="bottom"):
        xmark(c, 870, 700, 70, 28)
    with c.g("x2", origin="bottom"):
        xmark(c, 220, 700, 70, 28)
    c.act("x1", "fall", T("toi"), h=400, d=0.25, squash=0.3)
    c.act("x2", "fall", T("peau"), h=400, d=0.25, squash=0.3)
    c.cam("shake", T("toi") + 0.25, amp=9, d=0.3)
    c.cam("shake", T("peau") + 0.25, amp=9, d=0.3)
    with c.g("arrow", origin="top"):
        arrow(c, 540, 1000, 540, 1420, w=56, head=110)
    c.act("arrow", "in", T("dessous") - 0.1, how="top", dist=300)
    c.act("arrow", "bob", T("dessous") + 0.5, amp=14, hz=1.4)
    c.cam("pan", T("dessous"), d=0.9, dy=-300)
    c.cam("push", 0, d=D, f0=1.0, to=1.06, cx=540, cy=700)
    return c


def rays(c, cx, cy, n=11, length=1500, alpha=0.4):
    for k in range(n):
        a = -math.pi / 2 + (k - (n - 1) / 2) * 0.17
        w = 0.05
        pts = [(cx, cy), (cx + length * math.cos(a - w), cy + length * math.sin(a - w)), (cx + length * math.cos(a + w), cy + length * math.sin(a + w))]
        c.add(poly(pts), (255, 228, 170), elev=0, edge=False, grainy=False, alpha=alpha)


@scene(12)
def s12(T, D):
    c = Canvas()
    with c.g("block", origin="bottom"):
        skin_block(c, 120, 640, 960, 1100)
    with c.g("under"):
        dots(c, 540, 880, 330, 110, n=22, rmin=12, rmax=20, seed=2)
    c.act("block", "in", 0, how="none")
    with c.g("glow"):
        c.glow(540, 640, 560, (255, 214, 140), 0.65)
    c.act("glow", "in", T("peux") - 0.05, how="scale", soft=True, d=0.2)
    with c.g("rays", origin=(540, 640)):
        rays(c, 540, 640)
    c.act("rays", "in", T("peux") - 0.05, how="scale", soft=True)
    c.act("rays", "spin", T("peux"), rps=0.01)
    with c.g("lid", origin=(120, 640)):
        c.add(poly([(120, 640), (960, 640), (960, 570), (120, 570)]), (214, 156, 118), elev=18)
    tv = T("c'est")
    c.act("lid", "shake", tv, d=0.7, amp=0, rotAmp=2.4, hz=9)
    c.act("lid", "rot", T("peux") - 0.05, d=0.55, deg=-62)
    c.cam("shake", T("peux") + 0.1, amp=14, d=0.5)
    c.cam("push", T("peux") - 0.1, d=1.0, f0=1.0, to=1.22, cx=540, cy=700)
    for k, (x, y, r_) in enumerate([(300, 440, 56), (780, 360, 46), (560, 270, 40)]):
        with c.g(f"sp{k}"):
            sparkle(c, x, y, r_)
        c.act(f"sp{k}", "in", T("peux") + 0.1 + k * 0.12, how="scale")
    return c
