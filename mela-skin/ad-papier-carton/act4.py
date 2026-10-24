"""Acte IV · preuve et appel (S40–S43). Voir DIRECTION.md."""
import math
from paper import *
from parts import *
from scenes import cloth, badge, star, shelf, spiral, drop, bubble, leaf, spotlight, podium
from act1 import numstamp, rays

SCENES = {}


def scene(n):
    def deco(fn):
        SCENES[n] = fn
        return fn
    return deco


@scene(40)
def s40(T, D):
    c = Canvas()
    cx, hy, hr = woman(c, 540, 520, s=1.25, skin=SK_D, shirt=CHAR, arms="none", gb="body", gh="head")
    with c.g("arms", "bottom"):
        c.add(line([(330, 1080), (540, 1110), (770, 1030)], 98), (112, 104, 100), elev=9)
        c.add(line([(770, 1090), (540, 1030), (340, 1030)], 98), (100, 92, 88), elev=9)
        c.add(ell(770, 1050, 58, 50), SK_D, elev=8); c.add(ell(340, 1050, 58, 50), SK_D, elev=8)
    c.act("head", "rot", 0.0, d=0.01, deg=-5)
    c.act("head", "rot", T("très") - 0.1, d=0.3, deg=5)
    c.act("head", "bob", T("bien") - 0.1, d=0.5, amp=18, hz=1.0)
    with c.g("q", "bottom"):
        qmark(c, 540, 270, 560)
    c.act("q", "fall", T("sceptique") - 0.2, h=700, d=0.35, squash=0.25)
    c.cam("shake", T("sceptique") + 0.15, amp=12, d=0.35)
    c.act("q", "sway", T("sceptique") + 0.6, amp=6, hz=1.2)
    c.act("q", "scale", T("très") - 0.1, d=0.35, f0=1.0, to=0.2)
    c.act("q", "out", T("très") + 0.2, d=0.15, how="scale")
    with c.g("tap"):
        c.add(line([(260, 1500), (320, 1480)], 24), SK_D, elev=0)
    c.cam("tilt", 0, d=0.8, deg=2.0)
    c.cam("push", 0, d=D, f0=1.0, to=1.08, cx=540, cy=700)
    return c


@scene(41)
def s41(T, D):
    c = Canvas()
    t0 = T("garantie")
    pages = 6
    for k in range(pages):
        with c.g(f"pg{k}", "top"):
            calendar_page(c, 540, 700, 760, 760, rings=[])
        if k < pages - 1:
            c.act(f"pg{k}", "rot", t0 - 0.2 + k * 0.2, d=0.22, deg=-100, ease="smooth")
            c.act(f"pg{k}", "fade", t0 - 0.2 + k * 0.2 + 0.16, d=0.08, to=0.0)
            c.act(f"pg{k}", "move", t0 - 0.2 + k * 0.2, d=0.22, dy=-120, ease="smooth")
    with c.g("ninety", "bottom"):
        c.add(text("90", 540, 780, 380), OR, elev=0, edge=False)
        c.add(text("JOURS", 540, 1010, 110), CHOC, elev=0, edge=False)
    c.act("ninety", "in", t0 + pages * 0.2 - 0.4, how="scale", soft=False)
    with c.g("shield", "bottom"):
        c.add(poly([(540, 1060), (800, 1140), (780, 1380), (540, 1560), (300, 1380), (280, 1140)]), TEAL, elev=18)
        c.add(poly([(540, 1110), (750, 1176), (734, 1368), (540, 1508), (346, 1368), (330, 1176)]), (88, 128, 118), elev=0, edge=False)
        c.add(line([(430, 1320), (520, 1410), (680, 1230)], 56), CREAM, elev=0, edge=False)
    ts = T("remboursé")
    c.act("shield", "fall", ts, h=1300, d=0.32, squash=0.3)
    c.cam("shake", ts + 0.32, amp=22, d=0.55)
    with c.g("burst"):
        star(c, 540, 1320, 330, 14, YEL, 0.0)
    c.act("burst", "in", ts + 0.32, how="scale", d=0.15)
    c.act("burst", "out", ts + 0.62, d=0.2, how="scale")
    c.cam("push", 0, d=D, f0=1.0, to=1.1, cx=540, cy=1000)
    return c


@scene(42)
def s42(T, D):
    c = Canvas()
    woman(c, 280, 140, s=0.9, skin=SK_D, shirt=CHAR, body=False, gh="head")
    t0 = T("encore")
    pages = [(200, 1)]
    for k in range(3):
        with c.g(f"mo{k}", "top"):
            calendar_page(c, 280 + k * 260, 740, 340, 380, rings=[(1, 2)])
        c.act(f"mo{k}", "in", t0 + k * 0.28, how="scale", soft=False)
    with c.g("env", "bottom"):
        c.add(rr(160, 1000, 920, 1480, 30), CREAM, elev=16)
        c.add(poly([(160, 1000), (920, 1000), (540, 1260)]), (224, 206, 176), elev=8)
    c.act("env", "in", T("rembourse") - 1.0, how="bottom", dist=700)
    with c.g("bill", "bottom"):
        c.add(rr(380, 880, 700, 1080, 14), GRN, elev=10)
        c.add(ell(540, 980, 56), CREAM, elev=0, edge=False)
        c.add(text("€", 540, 980, 90), GRN, elev=0, edge=False)
    c.act("bill", "in", T("rembourse") - 0.3, how="scale")
    c.act("bill", "move", T("rembourse") - 0.1, d=0.8, dx=300, dy=-720, ease="smooth", antic=0.3)
    c.act("bill", "rot", T("rembourse") - 0.1, d=0.8, deg=-18, ease="smooth")
    with c.g("hand", "right"):
        hand(c, 960, 380, ang=190, sleeve=CHAR, arm=300)
    c.act("hand", "in", T("rembourse") - 0.4, how="right", dist=600)
    for k, (x, y, r_) in enumerate([(760, 220, 52), (900, 480, 42), (480, 260, 36)]):
        with c.g(f"sp{k}"):
            sparkle(c, x, y, r_)
        c.act(f"sp{k}", "in", T("totalité") + k * 0.1, how="scale")
    c.cam("push", 0, d=D, f0=1.0, to=1.1, cx=540, cy=800)
    return c


@scene(43)
def s43(T, D):
    c = Canvas()
    c.glow(540, 640, 800, (255, 226, 170), 0.55)
    with c.g("bottle", "bottom"):
        bottle(c, 540, 700, 1.9)
    c.act("bottle", "in", 0.0, how="bottom", dist=700)
    c.act("bottle", "bob", 0.8, amp=10, hz=0.5)
    for k, (x, y, r_) in enumerate([(220, 380, 56), (860, 460, 44), (780, 260, 36), (300, 760, 40)]):
        with c.g(f"sp{k}"):
            sparkle(c, x, y, r_)
        c.act(f"sp{k}", "in", 0.4 + k * 0.15, how="scale")
    with c.g("btn", "bottom"):
        c.add(rr(140, 1500, 940, 1700, 100), OR, elev=18)
        c.add(poly([(480, 1560), (610, 1600), (480, 1640)]), CREAM, elev=0, edge=False)
    tc = T("Clique")
    c.act("btn", "in", tc - 0.2, how="bottom", dist=600)
    c.act("btn", "pulse", tc + 0.8, d=D - tc - 0.8, amp=0.07, n=5, decay=0.0)
    with c.g("fing", "bottom"):
        hand(c, 790, 1900, ang=-100, point=True, sleeve=CHAR, arm=300)
    c.act("fing", "in", tc + 0.4, how="bottom", dist=500)
    c.act("fing", "move", tc + 1.2, d=0.18, dy=-90, ease="smooth", antic=0.0)
    c.act("fing", "move", tc + 1.4, d=0.18, dy=90, ease="smooth")
    c.act("btn", "scale", tc + 1.3, d=0.12, f0=1.0, to=0.94)
    c.act("btn", "scale", tc + 1.42, d=0.2, f0=1.0, to=1.0)
    with c.g("ripple"):
        c.add(S(ell(700, 1600, 150), ell(700, 1600, 130)), CREAM, elev=0, edge=False, alpha=0.6)
    c.act("ripple", "in", tc + 1.42, how="scale", d=0.3)
    c.act("ripple", "fade", tc + 1.7, d=0.4, to=0.0)
    c.cam("push", 0, d=D, f0=1.0, to=1.08, cx=540, cy=900)
    return c
