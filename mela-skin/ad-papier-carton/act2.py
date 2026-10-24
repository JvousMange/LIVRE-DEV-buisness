"""Acte II · le mécanisme (S13–S27) : sous la peau, avec Mela. Voir DIRECTION.md."""
import math
from paper import *
from parts import *
from scenes import cloth, badge, star, shelf, spiral, drop, bubble, leaf, spotlight
from act1 import numstamp, rays

SCENES = {}
UNDER = (122, 82, 58)
SKINC = (206, 150, 112)


def scene(n):
    def deco(fn):
        SCENES[n] = fn
        return fn
    return deco


def cave(base=UNDER):
    c = Canvas(base)
    c.add(poly([(-20, 1500), (260, 1450), (620, 1520), (1100, 1440), (1100, 1960), (-20, 1960)]), tuple(int(v * 0.8) for v in base), elev=10)
    return c


def ceiling(c, bottom=420, name="ceil", tone=SKINC, wave=14):
    """Couche de peau en haut du cadre."""
    import random
    r = random.Random(3)
    pts = [(-20, -20)] + [(x, bottom + r.uniform(-wave, wave)) for x in range(-20, 1120, 90)] + [(1100, -20)]
    with c.g(name, "top"):
        c.add(poly(pts), tone, elev=14)
        c.add(poly([(x, y - 70) for x, y in pts[1:-1]] + [(1100, -20), (-20, -20)][::-1] if False else [(-20, -20), (1100, -20), (1100, bottom - 90), (-20, bottom - 90)]), (226, 172, 134), elev=0, edge=False)


def beads_heap(c, name, cx, cy, rx, ry, n, seed, color=SK_E, rmin=13, rmax=20):
    with c.g(name, "bottom"):
        return dots(c, cx, cy, rx, ry, n=n, rmin=rmin, rmax=rmax, seed=seed, color=color, elev=3)


@scene(13)
def s13(T, D):
    c = cave((110, 72, 52))
    with c.g("stage"):
        skin_block(c, 90, 520, 990, 1240, tones=[(206, 150, 112), (182, 124, 88), (156, 100, 70), (130, 82, 56), (108, 68, 48)])
    c.act("stage", "in", 0, how="none")
    with c.g("beam"):
        spotlight(c, 540, 220, 540, 880, 1000, 0.22)
    c.act("beam", "in", 0.2, how="scale", d=0.2)
    for nm, x0, x1 in (("cl", -40, 330), ("cr", 750, 1120)):
        with c.g(nm, "right" if nm == "cl" else "left"):
            for k in range(5):
                xx = x0 + k * (x1 - x0) / 5
                c.add(rr(xx, 460, xx + (x1 - x0) / 5 + 8, 1260, 18), TEAL if k % 2 else (56, 86, 82), elev=12)
    c.act("cl", "move", 0.1, d=0.45, dx=-360, ease="smooth", antic=0.12)
    c.act("cr", "move", 0.1, d=0.45, dx=360, ease="smooth", antic=0.12)
    mela(c, 540, 1000, 1.25, "happy", "mela")
    for g in ("mela", "mela_eyes", "mela_face"):
        c.act(g, "in", 0.35, how="bottom", dist=500)
    c.act("mela_eyes", "blink", 1.0)
    c.cam("push", 0, d=D, f0=1.0, to=1.12, cx=540, cy=900)
    return c


@scene(14)
def s14(T, D):
    c = cave()
    ceiling(c, 300)
    mela(c, 400, 900, 1.55, "happy", "mela")
    c.act("mela_eyes", "blink", 0.8)
    t0 = T("fabrique")
    c.act("mela", "pulse", t0 - 0.1, d=D - t0, amp=0.1, n=7, decay=0.0)
    with c.g("hose"):
        c.add(line([(600, 960), (760, 1020), (860, 1120)], 40), CHAR, elev=8)
    with c.g("jar"):
        c.add(rr(720, 1100, 1000, 1500, 50), (214, 220, 214), elev=12, alpha=0.9)
        c.add(rr(700, 1060, 1020, 1120, 18), BRN, elev=8)
    c.act("jar", "in", 0.2, how="right", dist=500)
    for k in range(9):
        with c.g(f"b{k}"):
            c.add(ell(860 + (k % 3 - 1) * 60, 1450 - (k // 3) * 55, 28), SK_E, elev=4)
        c.act(f"b{k}", "fall", t0 + 0.1 + k * 0.2, h=420, d=0.32, squash=0.25)
    c.cam("push", 0, d=D, f0=1.0, to=1.1, cx=600, cy=1100)
    return c


@scene(15)
def s15(T, D):
    c = Canvas()
    c.glow(540, 800, 760, (255, 196, 120), 0.45)
    pale = (176, 128, 92)
    cx, hy, hr = woman(c, 540, 380, s=2.0, skin=pale, shirt=CHAR, longhair=True, gb="w0b", gh="w0h")
    with c.g("w1", "top"):
        rx, ry = hr, hr * 1.22
        cap = S(I(ell(cx, hy - ry * 0.1, rx * 1.1, ry * 1.1, wob=0.02, seed=3), rr(cx - rx * 1.4, hy - ry * 1.5, cx + rx * 1.4, hy + ry * 0.02, 0)),
                ell(cx + rx * 0.12, hy + ry * 0.2, rx * 0.9, ry * 0.72))
        c.add(S(U(ell(cx, hy, rx, ry, wob=0.012, seed=2), rr(cx - rx * 0.32, hy + ry * 0.55, cx + rx * 0.32, hy + ry * 1.7, 30)), cap), SK_D, elev=3)
    c.act("w1", "wipein", T("donne"), d=0.9, dir="down")
    for k in range(14):
        with c.g(f"bd{k}"):
            c.add(ell(300 + (k * 53) % 480, 1400 - (k % 4) * 30, 18), SK_E, elev=4)
        c.act(f"bd{k}", "in", 0.15 + k * 0.09, how="scale")
        c.act(f"bd{k}", "move", 0.25 + k * 0.09, d=1.1, dy=-(520 + (k % 3) * 80), dx=(540 - (300 + (k * 53) % 480)) * 0.5, ease="smooth")
        c.act(f"bd{k}", "out", 1.1 + k * 0.05, d=0.3, how="scale")
    for k, (x, y, r_) in enumerate([(220, 520, 60), (880, 660, 48), (700, 330, 40), (330, 330, 36)]):
        with c.g(f"sp{k}"):
            sparkle(c, x, y, r_)
        c.act(f"sp{k}", "in", T("couleur") + k * 0.1, how="scale")
    c.cam("push", 0, d=D, f0=1.0, to=1.1, cx=540, cy=900)
    return c


@scene(16)
def s16(T, D):
    c = cave()
    ceiling(c, 280)
    mela(c, 540, 1050, 1.5, "happy", "mela")
    mela(c, 540, 1050, 1.5, "worried", "mw")
    c.act("mela_eyes", "blink", 0.6)
    names = [("bouton", (190, 640), (-1, 0)), ("rasage", (890, 700), (1, 0)), ("soleil", (270, 380), (0, -1)), ("hormones", (820, 430), (0, -1))]
    first = T("bouton")
    for g in ("mw", "mw_eyes", "mw_face"):
        c.act(g, "in", first + 0.15, how="none")
    for g in ("mela", "mela_eyes", "mela_face"):
        c.act(g, "fade", first + 0.15, d=0.01, to=0.0)
    for k, (w, (x, y), _) in enumerate(names):
        t = T(w)
        with c.g(f"ag{k}"):
            if k == 0:
                c.add(ell(x, y, 80), (230, 150, 130), elev=10); c.add(S(ell(x, y, 80), ell(x, y, 56)), OR, elev=0, edge=False); c.add(ell(x, y, 26), WHITE, elev=3)
            elif k == 1:
                razor(c, x, y - 50, 0.9)
            elif k == 2:
                sun(c, x, y, 76)
            else:
                spiral(c, x, y, 150, PINK, 26)
        c.act(f"ag{k}", "in", t - 0.4, how="scale", soft=True)
        tx, ty = 540 - x, 980 - y
        c.act(f"ag{k}", "move", t - 0.05, d=0.2, dx=tx * 0.62, dy=ty * 0.62, ease="smooth", antic=0.2)
        c.act(f"ag{k}", "move", t + 0.3, d=0.3, dx=-tx * 0.3, dy=-ty * 0.3, ease="smooth")
        c.act("mw", "shake", t + 0.1, d=0.35, amp=10, hz=16)
        c.cam("shake", t + 0.1, amp=8, d=0.25)
    c.cam("push", 0, d=D, f0=1.0, to=1.1, cx=540, cy=1000)
    return c


@scene(17)
def s17(T, D):
    c = cave()
    ceiling(c, 330)
    mela(c, 540, 1230, 1.45, "panic", "mela")
    c.act("mela", "pulse", 0.1, d=D, amp=0.12, n=11, decay=0.0)
    c.act("mela_eyes", "blink", 0.8)
    beads_heap(c, "heap", 540, 760, 260, 130, 54, 4)
    c.act("heap", "in", 0.2, stag=0.032, f0=0.0, how="scale")
    c.act("heap", "pulse", 1.5, d=D - 1.5, amp=0.06, n=5)
    with c.g("ring", "left"):
        c.add(S(ell(540, 760, 360, 215, wob=0.04, seed=3), ell(540, 760, 336, 192, wob=0.04, seed=4)), OR, elev=5)
    c.act("ring", "wipein", T("précis") - 0.3, d=0.7, dir="left")
    c.cam("push", 0, d=D, f0=1.0, to=1.18, cx=540, cy=900)
    return c


@scene(18)
def s18(T, D):
    c = cave()
    mela(c, 540, 1280, 1.35, "panic", "mela")
    c.act("mela", "pulse", 0.1, d=D, amp=0.1, n=10, decay=0.0)
    beads_heap(c, "heap", 540, 840, 280, 120, 60, 5)
    with c.g("lid", "top"):
        c.add(poly([(-20, 260), (1100, 260), (1100, 520), (-20, 520)]), SKINC, elev=16)
        c.add(rr(-20, 260, 1100, 340, 0), (226, 172, 134), elev=0, edge=False)
    ts = [T("coincée") - 0.2, T("coincée") + 0.5, T("peau") + 0.2]
    for k, t in enumerate(ts):
        c.act("lid", "move", t, d=0.35, dy=-30, ease="smooth", antic=0.0)
        c.act("lid", "move", t + 0.35, d=0.3, dy=30, ease="smooth")
        c.act("heap", "move", t, d=0.35, dy=-40, ease="smooth")
        c.act("heap", "move", t + 0.35, d=0.3, dy=40, ease="smooth")
        with c.g(f"bonk{k}"):
            star(c, 540 + (k - 1) * 260, 560, 80, 8, YEL, 0.3)
        c.act(f"bonk{k}", "in", t + 0.3, how="scale", d=0.2)
        c.act(f"bonk{k}", "out", t + 0.65, d=0.2, how="scale")
        c.cam("shake", t + 0.3, amp=10, d=0.3)
    c.cam("push", 0, d=D, f0=1.0, to=1.12, cx=540, cy=700)
    return c


@scene(19)
def s19(T, D):
    c = cave()
    for side, x0, tone, skin in (("L", 270, (236, 190, 152), (236, 206, 176)), ("R", 810, (150, 96, 66), SK_E)):
        with c.g("lid" + side, "top"):
            c.add(rr(x0 - 260, 180, x0 + 260, 400, 14), tone, elev=14)
        big = side == "R"
        beads_heap(c, "heap" + side, x0, 640 if not big else 600, 180 if not big else 230, 70 if not big else 130, 14 if not big else 46, 9 if big else 3)
        mela(c, x0, 1150, 1.0 if not big else 1.25, "worried" if not big else "panic", "m" + side, color=(186, 120, 82))
    c.add(rr(534, 160, 546, 1500, 4), KRD, elev=4)
    c.act("lidL", "in", 0, how="none")
    c.act("heapL", "in", 0.1, stag=0.05, f0=0.0)
    tn = T("noire")
    for g in ("lidR", "heapR", "mR", "mR_eyes", "mR_face"):
        c.act(g, "in", tn - 0.9, how="right", dist=600)
    c.act("heapR", "pulse", tn, d=D - tn, amp=0.1, n=6)
    c.act("lidR", "shake", T("fort") - 0.3, d=0.8, amp=14, axis="y", hz=7)
    c.cam("push", tn - 0.6, d=1.0, f0=1.0, to=1.22, cx=790, cy=900)
    c.cam("shake", T("fort"), amp=14, d=0.4)
    return c


@scene(20)
def s20(T, D):
    c = Canvas()
    t0 = T("mois") - 0.15
    pages = 7
    for k in range(pages):
        with c.g(f"pg{k}", "top"):
            calendar_page(c, 540, 700, 760, 760, rings=[(k % 4, (k * 2) % 5)])
        if k < pages - 1:
            c.act(f"pg{k}", "rot", t0 - 0.9 + k * 0.28, d=0.28, deg=-100, ease="smooth")
            c.act(f"pg{k}", "fade", t0 - 0.9 + k * 0.28 + 0.2, d=0.1, to=0.0)
            c.act(f"pg{k}", "move", t0 - 0.9 + k * 0.28, d=0.28, dy=-120, ease="smooth")
    with c.g("spot"):
        c.add(ell(300, 1120, 70), OR, elev=10)
        c.add(S(ell(300, 1120, 100), ell(300, 1120, 84)), ORD, elev=0, edge=False)
    c.act("spot", "pulse", 0.2, d=D, amp=0.12, n=10, decay=0.0)
    c.act("spot", "shake", t0 + 0.8, d=0.5, amp=8, hz=14)
    c.cam("push", 0, d=D, f0=1.0, to=1.08)
    return c


@scene(21)
def s21(T, D):
    c = cave()
    with c.g("block"):
        skin_block(c, 90, 360, 990, 1160, tones=[SKINC, (182, 124, 88), (150, 96, 68), (118, 76, 54)])
    c.act("block", "in", 0, how="none")
    beads_heap(c, "heap", 540, 900, 320, 110, 40, 6)
    mela(c, 540, 1000, 1.0, "flat", "mela")
    with c.g("cloth"):
        cloth(c, 560, 280, 0.95, 5)
    with c.g("hand", origin="right"):
        hand(c, 640, 280, ang=190, sleeve=CHAR, arm=300)
    for g in ("cloth", "hand"):
        c.act(g, "in", 0.1, how="right", dist=500)
        c.act(g, "wipe", 0.4, d=D - 0.5, amp=150, cycles=6, dy=12)
    tr = T("rien")
    for g in ("mela", "mela_eyes", "mela_face"):
        c.act(g, "bob", tr, d=0.6, amp=34, hz=0.85)
    c.act("mela_eyes", "blink", 0.5)
    with c.g("eq", "bottom"):
        c.add(line([(690, 660), (860, 660)], 24), CREAM, elev=4); c.add(line([(690, 730), (860, 730)], 24), CREAM, elev=4)
    c.act("eq", "fall", tr, h=300, d=0.28)
    c.cam("push", 0, d=D, f0=1.0, to=1.08, cx=540, cy=800)
    return c


@scene(22)
def s22(T, D):
    c = Canvas()
    with c.g("tube", "bottom"):
        tube(c, 270, 420, 0.7, body=(230, 220, 200))
    with c.g("x", "bottom"):
        xmark(c, 270, 400, 120, 40)
    c.act("tube", "in", 0.15, how="left", dist=500)
    c.act("x", "fall", T("éclaircir") - 0.1, h=500, d=0.26, squash=0.3)
    c.cam("shake", T("éclaircir") + 0.2, amp=12, d=0.35)
    c.act("tube", "out", T("réguler") - 0.5, d=0.3, how="left")
    c.act("x", "out", T("réguler") - 0.5, d=0.3, how="left")
    cx, cy, R = 540, 1000, 320
    with c.g("dial"):
        c.add(ell(cx, cy, R + 40), CREAM, elev=18)
        c.add(arc_ring(cx, cy, R - 10, 40, 200, 290), OR, elev=0, edge=False)
        c.add(arc_ring(cx, cy, R - 10, 40, 290, 335), YEL, elev=0, edge=False)
        c.add(arc_ring(cx, cy, R - 10, 40, 335, 380), GRN, elev=0, edge=False)
        for i in range(13):
            a = math.radians(180 + i * 15)
            c.add(line([(cx + (R - 70) * math.cos(a), cy + (R - 70) * math.sin(a)), (cx + (R - 100) * math.cos(a), cy + (R - 100) * math.sin(a))], 10), CHAR, elev=0, edge=False)
    c.act("dial", "in", T("réguler") - 0.55, how="bottom", dist=700)
    with c.g("ptr", (cx, cy)):
        c.add(poly([(cx, cy - 250), (cx + 26, cy), (cx - 26, cy)]), CHAR, elev=8)
        c.add(ell(cx, cy, 46), CHAR, elev=10)
    c.act("ptr", "in", T("réguler") - 0.55, how="bottom", dist=700)
    c.act("ptr", "rot", 0.0, d=0.01, deg=48)
    c.act("ptr", "rot", T("production") - 0.2, d=0.9, deg=-94, ease="smooth")
    with c.g("hand", (cx, cy)):
        hand(c, cx + 20, cy + 420, ang=-95, sleeve=CHAR, arm=300)
    c.act("hand", "in", T("réguler") - 0.4, how="bottom", dist=700)
    c.act("hand", "rot", T("production") - 0.2, d=0.9, deg=-30, ease="smooth")
    c.cam("push", T("réguler") - 0.5, d=1.8, f0=1.0, to=1.14, cx=540, cy=1000)
    return c


@scene(23)
def s23(T, D):
    c = cave()
    ceiling(c, 300)
    with c.g("dome"):
        c.add(ell(540, 1080, 400, 360), (150, 210, 200), elev=0, alpha=0.28, edge=False, grainy=False)
        c.add(S(ell(540, 1080, 410, 370), ell(540, 1080, 396, 356)), (190, 240, 230), elev=0, edge=False, alpha=0.8)
    c.act("dome", "in", 0.2, how="scale", soft=True)
    mela(c, 540, 1130, 1.3, "calm", "mela")
    c.act("mela_eyes", "blink", 1.2)
    ts = [T("agression") - 0.1, T("agression") + 0.75, T("agression") + 1.45]
    for k, (t, (sx, sy)) in enumerate(zip(ts, [(180, 500), (880, 520), (540, 380)])):
        with c.g(f"sp{k}"):
            star(c, sx, sy, 100, 10, OR, 0.2 * k)
        c.act(f"sp{k}", "in", t - 0.35, how="scale")
        tx, ty = 540 - sx, 800 - sy
        c.act(f"sp{k}", "move", t, d=0.22, dx=tx * 0.55, dy=ty * 0.55, ease="smooth")
        c.act(f"sp{k}", "move", t + 0.22, d=0.4, dx=-tx * 0.9, dy=-ty * 0.9 - 200, ease="smooth")
        c.act(f"sp{k}", "spin", t + 0.22, rps=1.4, d=0.5)
        c.act(f"sp{k}", "out", t + 0.5, d=0.25, how="scale")
        c.act("dome", "pulse", t + 0.2, d=0.4, amp=0.06, n=2)
        c.cam("shake", t + 0.22, amp=5, d=0.25)
    c.cam("push", 0, d=D, f0=1.0, to=1.08, cx=540, cy=1000)
    return c


@scene(24)
def s24(T, D):
    c = Canvas((214, 168, 118))
    c.glow(540, 760, 900, (255, 222, 160), 0.6)
    with c.g("sun", "bottom"):
        sun(c, 540, 700, 190, YEL)
    c.act("sun", "move", 0.0, d=D * 0.9, dy=-80, ease="smooth")
    c.act("sun", "in", 0.0, how="bottom", dist=500)
    c.act("sun", "spin", 0.0, rps=0.03)
    woman(c, 540, 520, s=1.45, skin=SK_D, shirt=CHAR, longhair=True, gb="body", gh="head")
    c.act("head", "rot", 0.1, d=0.6, deg=4)
    c.act("head", "bob", 0.4, amp=8, hz=0.5)
    for k, (x, y, r_) in enumerate([(240, 520, 60), (860, 580, 50), (760, 330, 44), (300, 300, 38), (540, 220, 46)]):
        with c.g(f"sp{k}"):
            sparkle(c, x, y, r_)
        c.act(f"sp{k}", "in", T("teint") - 0.4 + k * 0.14, how="scale")
    c.cam("push", 0, d=D, f0=1.0, to=1.1, cx=540, cy=800)
    return c


@scene(25)
def s25(T, D):
    c = Canvas()
    woman(c, 540, 1000, s=1.2, skin=SK_D, shirt=CHAR, longhair=True, gb="body", gh="head")
    for k, (x, y, r_) in enumerate([(640, 960, 18), (700, 880, 28), (760, 780, 40)]):
        with c.g(f"tr{k}"):
            c.add(ell(x, y, r_), CREAM, elev=7)
        c.act(f"tr{k}", "in", 0.15 + k * 0.18, how="scale")
    with c.g("cloud", "bottom"):
        thought(c, 540, 460, 420, 300, tail=(150, 0))
    with c.g("mini", "bottom"):
        c.add(rr(340, 270, 740, 650, 30), (204, 212, 206), elev=6)
        head(c, 540, 450, 100, 122, SK_D, DARK, longhair=True)
    c.act("cloud", "in", 0.7, how="scale", soft=True)
    c.act("mini", "in", 1.0, how="scale", soft=True)
    c.act("cloud", "bob", 1.3, amp=12, hz=0.5)
    c.act("mini", "bob", 1.3, amp=12, hz=0.5)
    for k, (x, y, r_) in enumerate([(300, 300, 50), (800, 360, 40), (760, 620, 36)]):
        with c.g(f"sp{k}"):
            sparkle(c, x, y, r_)
        c.act(f"sp{k}", "in", 1.3 + k * 0.2, how="scale")
    c.cam("push", 0, d=D, f0=1.0, to=1.1, cx=540, cy=600)
    return c


@scene(26)
def s26(T, D):
    c = Canvas()
    with c.g("fj", "bottom"):
        jar(c, 300, 760, 1.0)
    with c.g("flame", "bottom"):
        flame(c, 300, 490, 1.2)
    c.act("fj", "in", 0.1, how="left", dist=700)
    c.act("flame", "in", 0.2, how="scale", soft=True)
    c.act("flame", "sway", 0.3, amp=5, hz=2.6)
    c.act("flame", "pulse", 0.3, d=D, amp=0.12, n=8, decay=0.0)
    with c.g("x1", "bottom"):
        xmark(c, 300, 700, 150, 46)
    c.act("x1", "fall", T("brûle") + 0.1, h=500, d=0.26, squash=0.3)
    c.cam("shake", T("brûle") + 0.36, amp=12, d=0.3)
    with c.g("sj", "bottom"):
        jar(c, 760, 1020, 1.0, body=BEIGE, lid=TEAL)
        dots(c, 760, 1030, 90, 40, n=10, rmin=5, rmax=8, seed=3, color=KRD)
    c.act("sj", "in", T("gommage") - 0.3, how="right", dist=700)
    with c.g("wand", (900, 760)):
        c.add(line([(900, 780), (700, 620)], 20), CHAR, elev=6)
        star(c, 690, 610, 56, 8, YEL)
    c.act("wand", "in", T("magique") - 0.55, how="scale")
    c.act("wand", "wipe", T("magique") - 0.3, d=0.6, amp=40, cycles=2, dy=30, tilt=14)
    with c.g("fizz"):
        for k in range(5):
            c.add(ell(620 + k * 14, 560 - k * 40, 10 - k), CREAM, elev=3)
    c.act("fizz", "in", T("magique") + 0.1, stag=0.06, f0=0.0)
    c.act("fizz", "fade", T("magique") + 0.9, d=0.3, to=0.0)
    with c.g("x2", "bottom"):
        xmark(c, 760, 1000, 150, 46)
    c.act("x2", "fall", T("magique") + 0.5, h=500, d=0.26, squash=0.3)
    c.cam("shake", T("magique") + 0.76, amp=12, d=0.3)
    for g in ("fj", "flame", "x1"):
        c.act(g, "out", T("mais") - 0.15, d=0.35, how="left")
    for g in ("sj", "wand", "fizz", "x2"):
        c.act(g, "out", T("mais") - 0.15, d=0.35, how="right")
    with c.g("lever", (330, 1000)):
        c.add(rr(180, 1060, 480, 1140, 24), CHAR, elev=12)
        c.add(line([(330, 1100), (330, 640)], 46), OR, elev=10)
        c.add(ell(330, 620, 70), OR, elev=12)
    c.act("lever", "in", T("solution") - 0.1, how="bottom", dist=500)
    c.act("lever", "rot", T("freine") + 0.3, d=0.45, deg=-35)
    return c


@scene(27)
def s27(T, D):
    c = Canvas()
    mela(c, 220, 800, 1.1, "worried", "mw")
    mela(c, 220, 800, 1.1, "calm", "mc")
    ts = T("source")
    for g in ("mc", "mc_eyes", "mc_face"):
        c.act(g, "in", ts + 0.7, how="none")
    for g in ("mw", "mw_eyes", "mw_face"):
        c.act(g, "fade", ts + 0.7, d=0.01, to=0.0)
    c.act("mw_eyes", "blink", 0.6)
    with c.g("pipe"):
        c.add(rr(330, 740, 1000, 860, 40), TEAL, elev=14)
        c.add(rr(330, 750, 1000, 770, 8), (110, 150, 140), elev=0, edge=False)
    c.act("pipe", "in", 0.0, how="none")
    tcut = ts - 0.1
    k = 0
    t = 0.1
    while t < tcut:
        with c.g(f"fl{k}"):
            c.add(ell(380, 800, 30), SK_E, elev=5)
        c.act(f"fl{k}", "in", t, how="scale", d=0.1)
        c.act(f"fl{k}", "move", t, d=0.9, dx=560, ease="smooth")
        c.act(f"fl{k}", "out", t + 0.9, d=0.2, how="scale")
        t += max(0.14, 0.4 - k * 0.03) if False else 0.2 + k * 0.03
        k += 1
    with c.g("valve", (640, 640)):
        c.add(rr(615, 640, 665, 760, 8), CHAR, elev=8)
        c.add(S(ell(640, 600, 110), ell(640, 600, 82)), OR, elev=10)
        for a in range(0, 180, 45):
            r_ = math.radians(a)
            c.add(line([(640 - 110 * math.cos(r_), 600 - 110 * math.sin(r_)), (640 + 110 * math.cos(r_), 600 + 110 * math.sin(r_))], 18), OR, elev=0, edge=False)
    c.act("valve", "in", ts - 1.0, how="top", dist=400)
    c.act("valve", "rot", ts - 0.3, d=0.9, deg=540, ease="smooth")
    with c.g("hand", (640, 600)):
        hand(c, 760, 420, ang=-150, sleeve=CHAR, arm=300)
    c.act("hand", "in", ts - 1.0, how="top", dist=400)
    c.act("hand", "rot", ts - 0.3, d=0.9, deg=30, ease="smooth")
    for j in range(3):
        with c.g(f"dr{j}"):
            c.add(ell(920 - j * 20, 880, 14), SK_E, elev=4)
        c.act(f"dr{j}", "fall", ts + 0.8 + j * 0.5, h=240, d=0.3)
    c.cam("push", ts - 1.0, d=1.6, f0=1.0, to=1.15, cx=640, cy=760)
    return c
