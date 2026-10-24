"""Acte III · la solution (S28–S39). Voir DIRECTION.md."""
import math
from paper import *
from parts import *
from scenes import cloth, badge, star, shelf, spiral, drop, bubble, leaf, spotlight, podium
from act1 import numstamp, rays
from act2 import cave, ceiling, beads_heap, UNDER, SKINC

SCENES = {}


def scene(n):
    def deco(fn):
        SCENES[n] = fn
        return fn
    return deco


def hang_sign(c, name, t, lines, cx=800, cy=470, w=640, h=300, size=92, seed=1):
    """Pancarte qui descend du haut en se balançant."""
    with c.g(name, (cx, cy - h / 2 - 300)):
        sign(c, cx, cy, lines, w, h, size, seed)
    c.act(name, "in", t, how="top", dist=700, d=0.4)
    c.act(name, "shake", t + 0.3, d=1.6, amp=0, rotAmp=9, hz=1.1)


def flow(c, prefix, x0, y, dx, t0, t1, gap, speed=1.0, r=26, color=SK_E, slow_from=None, slow_to=None):
    """Billes sur un tapis : nouvelle bille toutes les `gap` s ; ralentit entre slow_from et slow_to."""
    k, t = 0, t0
    while t < t1:
        with c.g(f"{prefix}{k}"):
            c.add(ell(x0, y, r), color, elev=5)
        d = 1.2 / speed
        if slow_from is not None and t > slow_from:
            d *= 1.0 + 3.0 * min(1.0, (t - slow_from) / max(0.3, (slow_to - slow_from)))
        c.act(f"{prefix}{k}", "in", t, how="scale", d=0.1)
        c.act(f"{prefix}{k}", "move", t, d=d, dx=dx, ease="smooth")
        c.act(f"{prefix}{k}", "out", t + d * 0.95, d=0.2, how="scale")
        g = gap
        if slow_from is not None and t > slow_from:
            g = gap * (1.0 + 3.0 * min(1.0, (t - slow_from) / max(0.3, (slow_to - slow_from))))
        t += g
        k += 1


def machine(c, spin=True, gear_stop=None, rps=0.35, to=None, d=1.0):
    """Machine à pigments : deux engrenages, un entonnoir et un tapis roulant."""
    with c.g("g1", (280, 560)):
        gear(c, 280, 560, 190, 12, (176, 98, 62))
    with c.g("g2", (540, 700)):
        gear(c, 540, 700, 110, 8, (150, 84, 54))
    with c.g("g3", (150, 880)):
        gear(c, 150, 880, 90, 8, (150, 84, 54))
    if spin:
        c.act("g1", "spin", 0.0, rps=rps, to=to, d=d)
        c.act("g2", "spin", 0.0, rps=-rps * 1.7, to=None if to is None else -to * 1.7, d=d)
        c.act("g3", "spin", 0.0, rps=-rps * 1.9, to=None if to is None else -to * 1.9, d=d)
    with c.g("belt"):
        c.add(rr(60, 1040, 1020, 1120, 40), (58, 52, 52), elev=14)
        for i in range(9):
            c.add(ell(110 + i * 105, 1080, 28), (88, 80, 78), elev=0, edge=False)
    with c.g("funnel"):
        c.add(poly([(80, 820), (320, 820), (250, 960), (150, 960)]), (90, 130, 124), elev=12)
        c.add(rr(180, 955, 220, 1030, 6), (70, 108, 100), elev=8)


@scene(28)
def s28(T, D):
    c = Canvas()
    with c.g("four", "bottom"):
        numeral(c, 4, 540, 800, size=1100, color=KRL, elev=12)
    c.act("four", "fall", 0.0, h=700, d=0.4, squash=0.2)
    tiles = [(300, 560, "drop"), (780, 560, "lock"), (300, 1020, "eraser"), (780, 1020, "wall")]
    t0 = T("quatre")
    for k, (x, y, kind) in enumerate(tiles):
        with c.g(f"t{k}", "bottom"):
            tile(c, x, y, 400, 400)
            if kind == "drop":
                drop_shape(c, x, y, 1.9)
            elif kind == "lock":
                padlock(c, x, y - 20, 1.5)
            elif kind == "eraser":
                eraser(c, x, y, 0.95)
            else:
                for r_ in range(3):
                    for q in range(3):
                        brick(c, x - 120 + q * 120 + (r_ % 2) * 50 - 25, y + 100 - r_ * 72, 112, 60, [KRL, BEIGE, (200, 160, 118)][(q + r_) % 3])
        c.act(f"t{k}", "fall", t0 + 0.2 + k * 0.28, h=900, d=0.34, squash=0.22)
        c.cam("shake", t0 + 0.54 + k * 0.28, amp=8, d=0.22)
    c.cam("push", 0, d=D, f0=1.0, to=1.07)
    return c


@scene(29)
def s29(T, D):
    c = cave()
    ceiling(c, 200)
    tb = T("freine")
    machine(c, rps=0.5, to=0.06, d=0.9)
    c.act("g1", "spin", tb, rps=0.5, to=0.04, d=0.9)
    flow(c, "b", 120, 1010, 800, 0.15, D, 0.34, slow_from=tb, slow_to=tb + 1.2)
    hang_sign(c, "sign", T("azélaïque") - 0.2, ["ACIDE", "AZÉLAÏQUE"], cx=760, cy=560, w=660, h=320, size=84, seed=3)
    with c.g("lever", (880, 1000)):
        c.add(rr(760, 1180, 1000, 1240, 20), CHAR, elev=12)
        c.add(line([(880, 1210), (880, 880)], 40), OR, elev=10)
        c.add(ell(880, 860, 56), OR, elev=12)
    c.act("lever", "in", tb - 0.9, how="right", dist=500)
    c.act("lever", "rot", tb - 0.1, d=0.4, deg=48)
    with c.g("pct", "bottom"):
        badge(c, 220, 1500, "10%", 150, TEAL, 92)
    c.act("pct", "fall", T("10") if True else 0, h=700, d=0.3, squash=0.3)
    c.cam("shake", T("10") + 0.3, amp=9, d=0.3)
    c.cam("push", 0, d=D, f0=1.0, to=1.1, cx=600, cy=900)
    return c


@scene(30)
def s30(T, D):
    c = cave()
    ceiling(c, 200)
    tb = T("bloque")
    machine(c, rps=0.5, to=0.0, d=0.3)
    c.act("g1", "spin", tb + 0.45, rps=0.0, to=0.0, d=0.1)
    hang_sign(c, "sign", T("alpha") - 0.2 if False else 0.15, ["ALPHA-", "ARBUTINE"], cx=760, cy=560, w=600, h=320, size=96, seed=5)
    flow(c, "b", 120, 1010, 800, 0.15, tb + 0.2, 0.3)
    with c.g("sw", (540, 1330)):
        c.add(ell(540, 1330, 130), (96, 150, 120), elev=14)
        c.add(S(ell(540, 1330, 130), ell(540, 1330, 100)), (60, 100, 80), elev=0, edge=False)
        c.add(line([(540, 1330), (540, 1230)], 26), (230, 236, 224), elev=4)
    with c.g("tag"):
        torn_card(c, 540, 1560, 480, 120, CREAM, 8)
        c.add(text("TYROSINASE", 540, 1560, 56), (58, 46, 40), elev=0, edge=False)
    c.act("sw", "in", T("enzyme") - 0.1 if False else 0.5, how="scale", soft=True)
    c.act("tag", "in", 0.7, how="bottom", dist=300)
    c.act("sw", "pulse", 0.9, d=tb - 0.9, amp=0.08, n=3)
    with c.g("lock", "bottom"):
        padlock(c, 540, 1240, 1.5)
    c.act("lock", "fall", tb, h=900, d=0.28, squash=0.28)
    c.cam("shake", tb + 0.28, amp=14, d=0.35)
    with c.g("clack"):
        star(c, 540, 1300, 190, 10, YEL, 0.1)
    c.act("clack", "in", tb + 0.28, how="scale", d=0.15)
    c.act("clack", "out", tb + 0.6, d=0.2, how="scale")
    c.cam("push", 0, d=D, f0=1.0, to=1.12, cx=540, cy=1200)
    return c


@scene(31)
def s31(T, D):
    c = Canvas()
    hang_sign(c, "sign", 0.1, ["ACIDE", "TRANEXAMIQUE"], cx=540, cy=470, w=860, h=330, size=84, seed=7)
    cx, cy = 540, 1000
    rings = [(330, SK_E), (262, (140, 54, 38)), (196, ORD), (130, OR)]
    for k, (r_, col) in enumerate(rings):
        with c.g(f"r{k}"):
            c.add(ell(cx, cy, r_, r_ * 0.96, wob=0.04, seed=r_), col, elev=10)
    with c.g("eraser", "right"):
        eraser(c, 820, 1000, 1.0)
    t0 = T("agit")
    c.act("eraser", "in", t0 - 0.5, how="right", dist=700)
    c.act("eraser", "wipe", t0, d=D - t0 - 0.2, amp=210, cycles=3.2, dy=24, tilt=4)
    for k in range(4):
        c.act(f"r{k}", "out", t0 + 0.5 + k * 0.42, d=0.35, how="top" if k % 2 else "left", dist=500)
    c.cam("push", 0, d=D, f0=1.0, to=1.12, cx=540, cy=1000)
    return c


@scene(32)
def s32(T, D):
    c = Canvas()
    with c.g("halo"):
        c.add(ell(540, 900, 250, 240, wob=0.05, seed=4), (214, 150, 112), elev=8)
    with c.g("core"):
        c.add(ell(540, 900, 130, 124, wob=0.05, seed=5), OR, elev=9)
    c.act("core", "pulse", 0.1, d=1.1, amp=0.12, n=4)
    c.act("core", "scale", 0.2, d=T("jamais"), f0=1.0, to=0.45)
    c.act("halo", "scale", 0.2, d=T("jamais"), f0=1.0, to=0.55)
    with c.g("spark"):
        sparkle(c, 540, 900, 110, CREAM)
    c.act("spark", "in", T("vraiment") - 0.1, how="scale")
    c.act("core", "out", T("vraiment") - 0.1, d=0.15, how="scale")
    for k, (x, y, r_) in enumerate([(300, 640, 44), (800, 700, 36), (380, 1180, 36), (760, 1160, 44)]):
        with c.g(f"sp{k}"):
            sparkle(c, x, y, r_)
        c.act(f"sp{k}", "in", T("vraiment") + 0.05 + k * 0.1, how="scale")
    c.cam("push", 0, d=D, f0=1.0, to=1.1)
    return c


@scene(33)
def s33(T, D):
    c = Canvas()
    with c.g("skin"):
        skin_block(c, 60, 1000, 1020, 1380, tones=[SKINC, (176, 118, 84), (146, 92, 64)])
    c.act("skin", "in", 0, how="none")
    hang_sign(c, "sign", T("niacinamide") - 0.3, ["NIACINAMIDE"], cx=540, cy=430, w=800, h=240, size=104, seed=9)
    t0 = T("renforce")
    n = 0
    for row in range(3):
        for k in range(7 if row % 2 == 0 else 6):
            x = 150 + k * 130 + (0 if row % 2 == 0 else 65)
            y = 940 - row * 78
            with c.g(f"bk{n}", "bottom"):
                brick(c, x, y, 120, 66, [KRL, BEIGE, (200, 160, 118)][(k + row) % 3])
            c.act(f"bk{n}", "fall", t0 - 0.2 + n * 0.1, h=1100, d=0.3, squash=0.18)
            n += 1
    with c.g("pct", "bottom"):
        badge(c, 880, 640, "5%", 130, TEAL, 84)
    c.act("pct", "fall", T("5"), h=600, d=0.3, squash=0.3)
    with c.g("shine"):
        c.add(poly([(80, 740), (200, 740), (420, 1000), (300, 1000)]), WHITE, elev=0, edge=False, grainy=False, alpha=0.35)
    c.act("shine", "in", t0 + n * 0.1 + 0.2, how="left", dist=0, d=0.2)
    c.act("shine", "move", t0 + n * 0.1 + 0.2, d=0.8, dx=800, ease="smooth")
    c.act("shine", "fade", t0 + n * 0.1 + 1.0, d=0.2, to=0.0)
    c.cam("push", 0, d=D, f0=1.0, to=1.1, cx=540, cy=900)
    return c


@scene(34)
def s34(T, D):
    c = cave()
    with c.g("skin"):
        skin_block(c, 60, 1080, 1020, 1420, tones=[SKINC, (176, 118, 84), (146, 92, 64)])
    c.act("skin", "in", 0, how="none")
    with c.g("wall"):
        for row in range(2):
            for k in range(7 if row % 2 == 0 else 6):
                x = 150 + k * 130 + (0 if row % 2 == 0 else 65)
                brick(c, x, 1030 - row * 78, 120, 66, [KRL, BEIGE, (200, 160, 118)][(k + row) % 3])
    c.act("wall", "in", 0, how="none")
    mela(c, 540, 1280, 0.8, "calm", "mela")
    c.act("mela", "sway", 0.5, amp=4, hz=0.8)
    for k, (kind, w, x) in enumerate([("sun", "moins", 300), ("razor", "reviennent", 780)]):
        t = T(w)
        with c.g(f"e{k}"):
            if kind == "sun":
                sun(c, x, 330, 74)
            else:
                razor(c, x, 280, 0.9)
        c.act(f"e{k}", "in", t - 0.5, how="top", dist=400)
        c.act(f"e{k}", "move", t - 0.1, d=0.25, dy=540, ease="smooth")
        c.act(f"e{k}", "move", t + 0.15, d=0.4, dy=-380, dx=-120 if x < 540 else 120, antic=0.0, ease="smooth")
        c.act(f"e{k}", "spin", t + 0.15, rps=0.8, d=0.5)
        c.act(f"e{k}", "out", t + 0.45, d=0.25, how="scale")
        c.act("wall", "pulse", t + 0.15, d=0.3, amp=0.025, n=2)
        c.cam("shake", t + 0.15, amp=7, d=0.25)
    c.cam("push", 0, d=D, f0=1.0, to=1.06)
    return c


@scene(35)
def s35(T, D):
    c = Canvas()
    shelf(c, 700)
    kinds = [lambda x: vial(c, x, 580, "", 0.9, color=AMBER), lambda x: tube(c, x, 540, 0.62, body=CREAM, cap=BRN),
             lambda x: vial(c, x, 580, "", 0.9, color=TEAL), lambda x: jar(c, x, 640, 0.7), lambda x: vial(c, x, 580, "", 0.9, color=BLUE)]
    t0 = T("plusieurs")
    for k, x in enumerate((170, 360, 540, 720, 910)):
        with c.g(f"p{k}", "bottom"):
            kinds[k](x)
        c.act(f"p{k}", "fall", t0 + k * 0.18, h=500, d=0.3, squash=0.22)
    with c.g("body", "bottom"):
        pass
    woman(c, 540, 860, s=1.15, skin=SK_M, shirt=TEAL, longhair=True, gb="body", gh="head")
    with c.g("armhand", (700, 1300)):
        c.add(line([(700, 1380), (760, 1300), (630, 1180)], 80), TEAL, elev=8)
        c.add(ell(625, 1170, 52), SK_M, elev=9)
    c.act("armhand", "in", 0.3, how="bottom", dist=300)
    c.act("head", "sway", 0.6, amp=3, hz=0.5)
    c.cam("pan", 0, d=D, dx=-60)
    return c


@scene(36)
def s36(T, D):
    import random as _r
    r = _r.Random(8)
    c = Canvas()
    cols = [CREAM, TEAL, BRN, YEL, BEIGE, BLUE, AMBER]
    t0 = 0.2
    for i in range(10):
        x, y = 160 + (i % 5) * 190, 360 + (i // 5) * 300
        with c.g(f"bt{i}", "bottom"):
            (vial if i % 2 else tube)(c, x, y, **({"n": "", "s": 0.75, "color": r.choice(cols)} if i % 2 else {"s": 0.58, "body": r.choice(cols), "cap": r.choice(cols)}))
        c.act(f"bt{i}", "in", t0 + i * 0.1, how="scale", soft=False)
        c.act(f"bt{i}", "out", T("flacons") + 0.5, d=0.35, how="left" if i % 2 else "right", dist=1300)
    with c.g("x1", "bottom"):
        xmark(c, 540, 500, 340, 74)
    c.act("x1", "fall", T("flacons") + 0.05, h=900, d=0.3, squash=0.25)
    c.cam("shake", T("flacons") + 0.35, amp=16, d=0.4)
    c.act("x1", "out", T("flacons") + 0.55, d=0.3, how="scale")
    with c.g("tag", (540, 780)):
        c.add(poly([(250, 1000), (650, 1000), (760, 1090), (650, 1180), (250, 1180)]), CREAM, elev=14)
        c.add(ell(310, 1090, 22), KRD, elev=0)
        c.add(text("€€€", 500, 1090, 100), ORD, elev=0, edge=False)
    c.act("tag", "in", T("hors") - 0.25, how="top", dist=800, d=0.35)
    c.act("tag", "shake", T("hors") + 0.2, d=1.4, amp=0, rotAmp=10, hz=1.3)
    with c.g("x2", "bottom"):
        xmark(c, 870, 1090, 110, 40)
    c.act("x2", "fall", T("prix") + 0.05, h=500, d=0.25, squash=0.3)
    c.cam("shake", T("prix") + 0.3, amp=12, d=0.3)
    return c


@scene(37)
def s37(T, D):
    c = Canvas()
    c.glow(540, 700, 800, (255, 226, 170), 0.5)
    with c.g("lv"):
        for ang, x, y, col in [(200, 400, 1130, GRN), (-20, 680, 1130, (96, 130, 104)), (230, 330, 1230, TEAL), (-50, 760, 1210, GRN)]:
            leaf(c, x, y, ang, 1.0, col)
    with c.g("pod", "bottom"):
        podium(c, 540, 1110)
    c.act("pod", "in", 0.0, how="bottom", dist=500)
    with c.g("beam"):
        spotlight(c, 540, 200, 540, 800, 1200, 0.16)
    with c.g("bottle", "bottom"):
        bottle(c, 540, 740, 1.6)
    tr = T("réunit")
    c.act("bottle", "in", tr + 0.9, how="bottom", dist=600, soft=False)
    cols = [AMBER, TEAL, (200, 120, 130), BLUE]
    for k, col in enumerate(cols):
        sx = 160 + k * 250
        with c.g(f"v{k}"):
            vial(c, sx, 420 + (k % 2) * 80, str(k + 1), 0.9, color=col)
        c.act(f"v{k}", "in", 0.1 + k * 0.12, how="top", dist=500)
        c.act(f"v{k}", "move", tr - 0.1 + k * 0.2, d=0.5, dx=540 - sx, dy=240, ease="smooth", antic=0.2)
        c.act(f"v{k}", "scale", tr + 0.35 + k * 0.2, d=0.2, f0=1.0, to=0.0)
        c.act(f"v{k}", "out", tr + 0.5 + k * 0.2, d=0.05, how="scale")
    for k in range(4):
        c.act("bottle", "pulse", tr + 0.55 + k * 0.2, d=0.25, amp=0.05, n=1)
    for k, (x, y, r_) in enumerate([(240, 740, 60), (860, 560, 48), (780, 900, 54), (300, 520, 40)]):
        with c.g(f"sp{k}"):
            sparkle(c, x, y, r_)
        c.act(f"sp{k}", "in", T("flacon") + k * 0.1, how="scale")
    c.cam("shake", T("flacon"), amp=10, d=0.4)
    c.cam("push", 0, d=D, f0=1.0, to=1.12, cx=540, cy=800)
    return c


@scene(38)
def s38(T, D):
    c = Canvas()
    tones = [SK_E, SK_M, SK_D, (176, 124, 88), (110, 70, 48)]
    xs = [140, 340, 540, 740, 940]
    for i in range(5):
        woman(c, xs[i], 360 + (i % 2) * 40, s=0.78, skin=tones[i], shirt=[CHAR, TEAL, BRN, GRN, BLUE][i], longhair=i in (1, 3), bun=i == 0, gb=f"w{i}", gh=f"h{i}")
        c.act(f"w{i}", "in", 0.05 + i * 0.07, how="bottom", dist=500)
        c.act(f"h{i}", "in", 0.05 + i * 0.07, how="bottom", dist=500)
    with c.g("bottle", "bottom"):
        bottle(c, 140, 980, 0.62)
    t0 = T("recommandent")
    for k in range(4):
        c.act("bottle", "move", t0 + k * 0.32 - 0.3, d=0.3, dx=200, dy=0, ease="smooth", antic=0.0)
    c.act("bottle", "bob", t0 - 0.3, d=1.4, amp=40, hz=1.2)
    for k in range(5):
        with c.g(f"hr{k}"):
            heart(c, xs[k], 300, 0.9)
        c.act(f"hr{k}", "in", t0 + k * 0.28 - 0.1, how="scale")
        c.act(f"hr{k}", "move", t0 + k * 0.28 - 0.1, d=1.0, dy=-90, ease="smooth")
    cx, cy, R = 540, 1240, 200
    with c.g("ring"):
        n = 48
        for k in range(int(n * 0.94)):
            a0 = -90 + k * 360 / n
            c.add(arc_ring(cx, cy, R, 44, a0, a0 + 360 / n + 1.2), TEAL, elev=2, edge=False)
    c.act("ring", "in", T("94") - 0.1, stag=0.018, f0=0.0, how="scale")
    with c.g("pct94"):
        c.add(text("94%", cx, cy, 118), CHOC, elev=0, edge=False)
    c.act("pct94", "in", T("94") + 0.2, how="scale")
    c.cam("push", 0, d=D, f0=1.0, to=1.08, cx=540, cy=900)
    return c


@scene(39)
def s39(T, D):
    c = Canvas()
    c.glow(540, 760, 800, (255, 226, 170), 0.35)
    hang_sign(c, "week", 0.1, ["CETTE", "SEMAINE"], cx=540, cy=360, w=640, h=320, size=96, seed=11)
    c.act("week", "out", T("deux") + 0.6, d=0.35, how="top", dist=800)
    for k, x in enumerate((220, 540)):
        with c.g(f"bt{k}", "bottom"):
            bottle(c, x, 840, 1.0)
        c.act(f"bt{k}", "in", T("deux") + k * 0.35 - 0.1, how="bottom", dist=700)
    with c.g("gift", "bottom"):
        bottle(c, 860, 840, 1.0)
        c.add(rr(842, 580, 878, 1070, 8), OR, elev=6)
        c.add(rr(650, 830, 1070, 870, 8), OR, elev=0, edge=False)
    c.act("gift", "fall", T("offert") - 0.6, h=1300, d=0.45, squash=0.22)
    c.cam("shake", T("offert") - 0.15, amp=16, d=0.45)
    with c.g("bow", "bottom"):
        c.add(U(ell(790, 570, 78, 46), ell(930, 570, 78, 46)), OR, elev=10)
        c.add(ell(860, 585, 34), ORD, elev=8)
    c.act("bow", "fall", T("offert") - 0.1, h=500, d=0.3, squash=0.3)
    with c.g("pl", "bottom"):
        c.add(text("+", 380, 840, 220), OR, elev=8)
    c.act("pl", "in", T("achetés") + 0.2, how="scale")
    for k, (x, y, r_) in enumerate([(400, 400, 56), (760, 330, 46), (1000, 480, 40)]):
        with c.g(f"sp{k}"):
            sparkle(c, x, y, r_)
        c.act(f"sp{k}", "in", T("offert") + k * 0.12, how="scale")
    c.cam("push", 0, d=D, f0=1.0, to=1.1, cx=600, cy=800)
    return c
