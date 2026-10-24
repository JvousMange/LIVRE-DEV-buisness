"""43 scènes en papier découpé, une par plan de la voix. Usage : python3 scenes.py [numéros...]"""
import math, os, random, sys
from paper import *
from parts import *

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "images")
SKIN_FLAT = (190, 138, 100)


def star(c, cx, cy, r, n=10, color=OR, rot=0.0):
    pts = []
    for i in range(n * 2):
        a = rot + math.pi * i / n
        rad = r if i % 2 == 0 else r * 0.45
        pts.append((cx + rad * math.cos(a), cy + rad * math.sin(a)))
    c.add(poly(pts), color, elev=9)


def spiral(c, cx, cy, r, color=PINK, w=22):
    pts = [(cx + (r * t / 60) * math.cos(t / 6), cy + (r * t / 60) * math.sin(t / 6)) for t in range(4, 60)]
    c.add(line(pts, w), color, elev=6)


def drop(c, cx, cy, s=1.0, color=(240, 214, 150)):
    c.add(U(poly([(cx, cy - 70 * s), (cx + 40 * s, cy + 10 * s), (cx - 40 * s, cy + 10 * s)]), ell(cx, cy + 20 * s, 42 * s)), color, elev=7)


def badge(c, cx, cy, label, r=130, color=OR, size=84):
    c.add(ell(cx, cy, r), color, elev=11)
    c.add(text(label, cx, cy, size), CREAM, elev=0, edge=False)


def bubble(c, cx, cy, r, skin=SK_D, n=18, seed=2, bigger=1.0):
    m = ell(cx, cy, r, r, wob=0.015, seed=seed)
    c.add(m, skin, elev=12)
    dots(c, cx, cy, r * 0.7, r * 0.7, n=n, rmin=12 * bigger, rmax=24 * bigger, seed=seed, clip=m)


def cloth(c, cx, cy, s=1.0, ang=0):
    a = math.radians(ang)
    base = [(-170, -90), (60, -130), (190, -40), (170, 100), (-30, 130), (-190, 60)]
    c.add(poly([(cx + (x * math.cos(a) - y * math.sin(a)) * s, cy + (x * math.sin(a) + y * math.cos(a)) * s) for x, y in base]), CREAM, elev=9)


def shelf(c, y, x0=-20, x1=W + 20):
    c.add(rr(x0, y, x1, y + 46, 8), KRD, elev=12)


def podium(c, cx, cy, w=640, h=170):
    c.add(rr(cx - w / 2, cy, cx + w / 2, cy + h, 14), KRL, elev=14)
    c.add(ell(cx, cy, w / 2, 56), tuple(min(255, v + 18) for v in KRL), elev=0, edge=False)


def leaf(c, cx, cy, ang, s=1.0, color=GRN):
    a = math.radians(ang)
    pts = []
    for t in range(0, 21):
        u = t / 20
        pts.append((u * 300 * s, math.sin(u * math.pi) * 70 * s))
    for t in range(20, -1, -1):
        u = t / 20
        pts.append((u * 300 * s, -math.sin(u * math.pi) * 70 * s))
    c.add(poly([(cx + x * math.cos(a) - y * math.sin(a), cy + x * math.sin(a) + y * math.cos(a)) for x, y in pts]), color, elev=8)


def spotlight(c, x_top, w_top, x_bot, w_bot, y_bot, alpha=0.16):
    c.add(poly([(x_top - w_top / 2, 0), (x_top + w_top / 2, 0), (x_bot + w_bot / 2, y_bot), (x_bot - w_bot / 2, y_bot)]), WHITE, elev=0, edge=False, grainy=False, alpha=alpha)


# ------------------------------------------------------------------ scènes
def s01():
    c = Canvas(); face_macro(c, cy=760, n=40, seed=5); numeral(c, 5, 860, 330, size=620); return c


def s02():
    c = Canvas(); face_macro(c, cy=720, n=36, seed=6)
    cloth(c, 540, 1040, 1.2, -15); hand(c, 600, 1040, ang=195, sleeve=CHAR); return c


def s03():
    c = Canvas(); skin_block(c, 90, 420, 990, 1220)
    dots(c, 540, 980, 360, 150, n=26, rmin=12, rmax=22, seed=8)
    cloth(c, 700, 330, 1.0, 5); hand(c, 760, 330, ang=190, sleeve=CHAR, arm=300)
    arrow(c, 190, 1180, 190, 860, w=40, head=80); return c


def s04():
    c = Canvas(); face_macro(c, cy=720, n=40, seed=5)
    c.add(ell(430, 1060, 250, 140, wob=0.03, seed=3), (188, 136, 100), elev=4)
    c.add(ell(620, 1020, 150, 100, wob=0.05, seed=9), BEIGE, elev=10)
    hand(c, 760, 1000, ang=195, sleeve=CHAR); return c


def s05():
    c = Canvas(); face_macro(c, cy=720, n=44, seed=5)
    c.add(ell(560, 1040, 230, 130, wob=0.03, seed=3), (188, 136, 100), elev=5)
    c.add(poly([(380, 1010), (300, 1110), (440, 1120)]), (222, 178, 140), elev=12)
    hand(c, 760, 1060, ang=200, point=True, sleeve=CHAR); return c


def s06():
    c = Canvas(); shelf(c, 960)
    for i, (x, col) in enumerate([(160, CREAM), (360, WHITE), (560, BEIGE), (760, CREAM)]):
        (jar if i % 2 == 0 else tube)(c, x, 860 if i % 2 == 0 else 780, 0.8, body=col, lid=BEIGE, cap=BEIGE)
    card(c, 290, 330, 440, 340, KRL, 30)
    for k, col in enumerate([(244, 224, 200), (238, 210, 180), (232, 200, 166), (226, 192, 156)]):
        c.add(rr(120 + k * 90, 250, 190 + k * 90, 410, 10), col, elev=3)
    hand(c, 830, 1130, ang=-100, skin=SK_L, sleeve=KRL, arm=520)
    jar(c, 860, 760, 0.7, body=CREAM, lid=BEIGE); return c


def s07():
    c = Canvas(); cx, hy, hr = woman(c, 400, 280, s=1.5, skin=SK_E, shirt=CHAR)
    c.add(ell(cx - 90, hy + 110, 70, 55, wob=0.1), (200, 70, 60), elev=0, alpha=0.75)
    c.add(line([(cx + 240, hy + 640), (cx + 330, hy + 380), (cx + 90, hy + 140)], 86), CHAR, elev=8)
    c.add(ell(cx + 70, hy + 120, 62, 50), SK_E, elev=9)
    jar(c, 840, 860, 0.9); xmark(c, 840, 860, 130, 44); return c


def s08():
    c = Canvas(KRD); r = random.Random(4)
    cols = [CREAM, TEAL, BRN, YEL, BEIGE, BLUE]
    for i in range(9):
        x, y = 140 + (i % 3) * 400 + r.randint(-40, 40), 380 + (i // 3) * 340 + r.randint(-30, 30)
        (jar if i % 2 == 0 else tube)(c, x, y, r.uniform(0.55, 0.75), body=r.choice(cols), lid=r.choice(cols), cap=r.choice(cols))
    c.add(ell(540, 1130, 200, 120, wob=0.04, seed=2), BEIGE, elev=10)
    dots(c, 540, 1130, 140, 70, n=14, rmin=5, rmax=8, seed=3, color=CHAR)
    hand(c, 760, 1180, ang=190, sleeve=CHAR); return c


def s09():
    c = Canvas(); face_macro(c, cy=720, n=70, seed=11, bigger=1.45)
    for x, y, rx, ry in [(330, 1010, 110, 80), (520, 1120, 130, 90), (650, 960, 90, 70)]:
        c.add(ell(x, y, rx, ry, wob=0.1, seed=x), (214, 70, 58), elev=0, alpha=0.5)
    return c


def s10():
    c = Canvas()
    for x in (200, 540, 880):
        card(c, x, 330, 290, 290, KRL, 36)
    sun(c, 200, 330, 50); razor(c, 540, 270, 0.5); towel(c, 880, 330, 0.55)
    bubble(c, 540, 960, 270, n=22, seed=4)
    for x in (200, 540, 880):
        arrow(c, x, 500, 540 + (x - 540) * 0.5, 650, w=30, head=60)
    return c


def s11():
    c = Canvas(); bathroom_bg(c)
    cx, hy, hr = woman(c, 540, 330, s=1.25, skin=SK_D, shirt=CHAR, spots=True)
    arrow(c, 900, 250, 700, 600, w=50, head=100); return c


def s12():
    c = Canvas(); skin_block(c, 120, 800, 960, 1240); dots(c, 540, 1060, 330, 110, n=20, rmin=12, rmax=20, seed=2)
    c.glow(540, 820, 520, (255, 214, 140), 0.55)
    c.add(poly([(120, 800), (960, 800), (1030, 540), (210, 470)]), (214, 156, 118), elev=20)
    hand(c, 860, 880, ang=195, sleeve=CHAR, arm=380); return c


def s13():
    c = Canvas(); skin_block(c, 80, 560, 1000, 1220, tones=[(206, 150, 112), (182, 124, 88), (156, 100, 70), (130, 82, 56), (108, 68, 48)])
    dots(c, 540, 1050, 380, 120, n=22, rmin=11, rmax=19, seed=3)
    for x in (-20, 1000):
        for k in range(4):
            c.add(rr(x + k * 26, 0, x + k * 26 + 30, 1100, 14), TEAL if k % 2 else (56, 86, 82), elev=10)
    spotlight(c, 540, 260, 540, 820, 960, 0.2); return c


def s14():
    c = Canvas((150, 100, 70)); bead_cloud(c, 540, 820, 440, 380, n=46, seed=3, color=SK_E)
    cell(c, 540, 820, 2.3, color=(184, 118, 80)); return c


def s15():
    c = Canvas(); c.glow(540, 800, 760, (255, 196, 120), 0.5)
    woman(c, 540, 330, s=2.0, skin=SK_D, shirt=CHAR, longhair=True)
    bead_cloud(c, 540, 840, 250, 150, n=20, seed=6, color=(136, 86, 56), rmin=7, rmax=12); return c


def s16():
    c = Canvas()
    for x, y in [(270, 340), (810, 340), (270, 700), (810, 700)]:
        card(c, x, y, 440, 290, KRL, 36)
    c.add(ell(270, 340, 70), SK_L, elev=6); c.add(S(ell(270, 340, 70), ell(270, 340, 48)), OR, elev=0); c.add(ell(270, 340, 24), WHITE, elev=3)
    razor(c, 800, 290, 0.7); sun(c, 270, 700, 54); spiral(c, 810, 700, 120)
    bubble(c, 540, 1080, 190, n=12, seed=7)
    for x in (270, 810):
        arrow(c, x, 880, 540 + (x - 540) * 0.45, 960, w=26, head=50)
    return c


def s17():
    c = Canvas((140, 92, 64)); c.add(rr(-20, 80, W + 20, 420, 0), (206, 150, 112), elev=12)
    cell(c, 540, 1000, 1.8, color=(176, 112, 76)); bead_cloud(c, 540, 680, 250, 130, n=46, seed=2, color=SK_E, rmin=13, rmax=20)
    c.add(S(ell(540, 680, 320, 190), ell(540, 680, 296, 166)), OR, elev=4); return c


def s18():
    c = Canvas((120, 80, 56)); c.add(rr(-20, 520, W + 20, 1180, 0), (140, 90, 62), elev=0)
    c.add(poly([(-20, 300), (W + 20, 300), (W + 20, 560), (-20, 560)]), (214, 158, 120), elev=18)
    bead_cloud(c, 540, 810, 380, 150, n=60, seed=5, color=SK_E, rmin=12, rmax=19)
    for x in (260, 540, 820):
        arrow(c, x, 760, x, 600, w=30, head=60)
    return c


def s19():
    c = Canvas((100, 64, 46)); c.glow(540, 800, 700, (255, 150, 80), 0.35)
    c.add(rr(-20, 80, W + 20, 380, 0), (170, 110, 78), elev=12)
    cell(c, 540, 1050, 1.6, color=(170, 104, 70)); bead_cloud(c, 540, 700, 380, 190, n=80, seed=9, color=(66, 40, 30), rmin=13, rmax=21); return c


def s20():
    c = Canvas(); r = random.Random(2)
    for i, (x, y) in enumerate([(300, 290), (780, 290), (300, 720), (780, 720), (300, 1150), (780, 1150)]):
        calendar_page(c, x, y, 390, 380, rings=[(r.randint(0, 3), r.randint(0, 4)) for _ in range(3 + i)])
    return c


def s21():
    c = Canvas(); skin_block(c, 90, 520, 990, 1180); bead_cloud(c, 540, 960, 380, 130, n=44, seed=4, color=SK_E, rmin=12, rmax=19)
    cloth(c, 620, 450, 1.0, 5); hand(c, 680, 440, ang=190, sleeve=CHAR, arm=300); xmark(c, 220, 330, 50, 22); return c


def s22():
    c = Canvas(); tube(c, 250, 380, 0.6, body=(230, 220, 200)); xmark(c, 250, 380, 100, 36)
    c.add(ell(620, 880, 340), CREAM, elev=16)
    for i in range(11):
        a = math.radians(150 + i * 24)
        c.add(line([(620 + 285 * math.cos(a), 880 + 285 * math.sin(a)), (620 + 320 * math.cos(a), 880 + 320 * math.sin(a))], 14), CHAR, elev=0, edge=False)
    a = math.radians(205)
    c.add(poly([(620 + 250 * math.cos(a), 880 + 250 * math.sin(a)), (620 + 30 * math.cos(a + 1.6), 880 + 30 * math.sin(a + 1.6)), (620 + 30 * math.cos(a - 1.6), 880 + 30 * math.sin(a - 1.6))]), OR, elev=7)
    c.add(ell(620, 880, 44), CHAR, elev=8)
    hand(c, 930, 1170, ang=-150, sleeve=CHAR, arm=300); return c


def s23():
    c = Canvas(); skin_block(c, 60, 780, 1020, 1240, tones=[(206, 150, 112), (176, 118, 84), (146, 92, 64)])
    cell(c, 540, 1060, 1.1, color=(170, 108, 72)); bead_cloud(c, 540, 1060, 120, 50, n=5, seed=2, color=SK_E, rmin=8, rmax=11)
    for x, y, r_, rot in [(240, 560, 110, 0.2), (560, 440, 140, 0), (840, 600, 100, 0.5)]:
        star(c, x, y, r_, 10, OR, rot)
    return c


def s24():
    c = Canvas(); bathroom_bg(c); c.glow(540, 560, 650, (255, 220, 150), 0.45)
    woman(c, 540, 330, s=1.25, skin=SK_D, shirt=CHAR)
    for x, y, r_ in [(250, 380, 60), (850, 460, 50), (780, 250, 40), (300, 700, 36)]:
        sparkle(c, x, y, r_)
    return c


def s25():
    c = Canvas(); c.add(rr(130, 190, 950, 1130, 40), CREAM, elev=16); c.add(rr(170, 230, 910, 1090, 22), (204, 212, 206), elev=0, edge=False)
    c.add(rr(330, 800, 750, 1060, 60), CHAR, elev=4)
    head(c, 540, 600, 138, 168, SK_D, DARK, longhair=True)
    for x, y, r_ in [(230, 1220, 70), (900, 300, 50), (860, 1180, 54)]:
        sparkle(c, x, y, r_)
    return c


def s26():
    c = Canvas(); flame(c, 540, 300, 1.0); jar(c, 540, 560, 1.0, body=CREAM)
    xmark(c, 780, 560, 90, 36)
    jar(c, 540, 1000, 1.0, body=BEIGE, lid=TEAL)
    dots(c, 540, 1010, 90, 40, n=10, rmin=5, rmax=8, seed=3, color=KRD)
    sparkle(c, 330, 880, 46, YEL); sparkle(c, 760, 900, 60, YEL); xmark(c, 800, 1010, 90, 36); return c


def s27():
    c = Canvas(); c.add(rr(200, 640, 960, 800, 40), TEAL, elev=14)
    cell(c, 220, 720, 1.1, color=(176, 112, 76))
    bead_cloud(c, 420, 720, 90, 30, n=6, seed=3, color=SK_E, rmin=9, rmax=12)
    c.add(rr(590, 480, 640, 650, 8), CHAR, elev=7); c.add(ell(615, 470, 120, 30), OR, elev=8)
    c.add(line([(615, 400), (615, 540)], 22), OR, elev=0, edge=False)
    hand(c, 840, 380, ang=-160, sleeve=CHAR, arm=240); return c


def s28():
    c = Canvas(); numeral(c, 4, 540, 800, size=1100, color=KRL, elev=12)
    for i, x in enumerate((170, 390, 610, 830)):
        vial(c, x, 900, str(i + 1), 1.0)
    return c


def s29():
    c = Canvas(); vial(c, 860, 360, "1", 1.0); drop(c, 700, 640, 1.2)
    cell(c, 460, 950, 1.5, color=(176, 112, 76)); bead_cloud(c, 460, 760, 90, 30, n=4, seed=2, color=SK_E, rmin=9, rmax=11)
    badge(c, 230, 400, "10%", 140)
    c.add(rr(780, 900, 810, 1030, 8), CHAR, elev=6); c.add(rr(850, 900, 880, 1030, 8), CHAR, elev=6); return c


def s30():
    c = Canvas(); vial(c, 180, 360, "2", 0.95)
    c.add(S(ell(540, 960, 300, 220, wob=0.05, seed=4), ell(780, 840, 90, 80)), TEAL, elev=14)
    bead_cloud(c, 880, 780, 60, 30, n=4, seed=3, color=SK_E, rmin=9, rmax=11)
    c.add(arc_ring(540, 520, 100, 40, 180, 360), CHAR, elev=8); c.add(rr(430, 520, 650, 700, 28), YEL, elev=12)
    c.add(ell(540, 600, 20, 28), CHAR, elev=0, edge=False); return c


def s31():
    c = Canvas()
    for r_, col in [(340, SK_E), (270, (140, 54, 38)), (200, ORD), (130, OR)]:
        c.add(ell(540, 830, r_, r_ * 0.96, wob=0.04, seed=int(r_)), col, elev=10)
    c.add(poly([(700, 520), (900, 560), (860, 700), (760, 640)]), SK_E, elev=14)
    vial(c, 900, 1100, "3", 0.9); return c


def s32():
    c = Canvas()
    for r_, col in [(240, KRD), (160, (214, 150, 110)), (90, (226, 120, 80))]:
        c.add(ell(540, 830, r_, r_ * 0.96, wob=0.05, seed=int(r_)), col, elev=8)
    for i, (x, y, col) in enumerate([(300, 560, PINK), (790, 600, (226, 180, 150)), (260, 1000, BEIGE), (820, 1040, (232, 200, 170)), (540, 540, (232, 150, 120))]):
        c.add(ell(x, y, 22 - i * 2), col, elev=3)
    vial(c, 190, 360, "3", 0.8); return c


def s33():
    c = Canvas(); skin_block(c, 80, 900, 1000, 1240, tones=[(206, 150, 112), (176, 118, 84), (146, 92, 64)])
    for row in range(3):
        for k in range(7 if row % 2 == 0 else 6):
            x = 150 + k * 130 + (0 if row % 2 == 0 else 65)
            c.add(rr(x - 58, 640 + row * 78, x + 58, 640 + row * 78 + 66, 8), [KRL, BEIGE, (200, 160, 118)][(k + row) % 3], elev=7)
    vial(c, 190, 340, "4", 1.0); badge(c, 880, 330, "5%", 130, TEAL); return c


def s34():
    c = Canvas(); skin_block(c, 80, 900, 1000, 1240, tones=[(206, 150, 112), (176, 118, 84), (146, 92, 64)])
    for row in range(2):
        for k in range(7 if row % 2 == 0 else 6):
            x = 150 + k * 130 + (0 if row % 2 == 0 else 65)
            c.add(rr(x - 58, 740 + row * 78, x + 58, 740 + row * 78 + 66, 8), [KRL, BEIGE, (200, 160, 118)][(k + row) % 3], elev=7)
    sun(c, 300, 330, 70); razor(c, 790, 300, 0.7)
    arrow(c, 300, 480, 300, 700, w=34, head=70); arrow(c, 790, 480, 790, 700, w=34, head=70); return c


def s35():
    c = Canvas(); shelf(c, 640)
    for i, x in enumerate((180, 360, 540, 720, 900)):
        if i % 2:
            vial(c, x, 520, str(i + 1), 0.8, color=[AMBER, TEAL, BLUE][i % 3])
        else:
            tube(c, x, 480, 0.55, body=[CREAM, BEIGE, WHITE][i % 3], cap=BRN)
    woman(c, 540, 820, s=1.0, skin=SK_M, shirt=TEAL, longhair=True); return c


def s36():
    c = Canvas(); r = random.Random(8)
    cols = [CREAM, TEAL, BRN, YEL, BEIGE, BLUE, AMBER]
    for i in range(10):
        x, y = 160 + (i % 5) * 190, 330 + (i // 5) * 290
        (vial if i % 2 else tube)(c, x, y, **({"n": "", "s": 0.7, "color": r.choice(cols)} if i % 2 else {"s": 0.55, "body": r.choice(cols), "cap": r.choice(cols)}))
    xmark(c, 540, 480, 330, 70)
    c.add(poly([(250, 1000), (650, 1000), (760, 1090), (650, 1180), (250, 1180)]), CREAM, elev=14)
    c.add(ell(300, 1090, 22), KRD, elev=0); c.add(text("€€€", 500, 1090, 100), ORD, elev=0, edge=False)
    xmark(c, 870, 1090, 80, 34); return c


def s37():
    c = Canvas(); c.glow(540, 700, 800, (255, 226, 170), 0.5)
    for ang, x, y, col in [(200, 400, 1000, GRN), (-20, 680, 1000, (96, 130, 104)), (230, 330, 1100, TEAL), (-50, 760, 1090, GRN)]:
        leaf(c, x, y, ang, 1.0, col)
    podium(c, 540, 1010); bottle(c, 540, 640, 1.65); spotlight(c, 540, 200, 540, 760, 1100, 0.15)
    sparkle(c, 220, 400, 54); sparkle(c, 880, 520, 44); return c


def s38():
    c = Canvas(); tones = [SK_E, SK_M, SK_D, (176, 124, 88), (110, 70, 48)]
    for i, x in enumerate((140, 960, 340, 760, 540)):
        woman(c, x, 380 + (i % 2) * 40, s=0.78, skin=tones[i], shirt=[CHAR, TEAL, BRN, GRN, BLUE][i], hair=DARK, longhair=i in (1, 3), bun=i == 0)
    bottle(c, 540, 1010, 0.8)
    for x, y, s_ in [(250, 250, 0.8), (810, 230, 1.0), (540, 170, 0.7)]:
        heart(c, x, y, s_)
    return c


def s39():
    c = Canvas(); c.glow(540, 700, 800, (255, 226, 170), 0.35)
    for x in (220, 540, 860):
        bottle(c, x, 800, 0.9)
    c.add(rr(842, 560, 878, 1020, 8), OR, elev=6); c.add(rr(660, 790, 1060, 830, 8), OR, elev=0, edge=False)
    c.add(U(ell(810, 560, 64, 40), ell(910, 560, 64, 40)), OR, elev=8); c.add(ell(860, 570, 30), ORD, elev=6)
    sparkle(c, 330, 380, 50); sparkle(c, 760, 330, 42); return c


def s40():
    c = Canvas(); cx, hy, hr = woman(c, 540, 460, s=1.2, skin=SK_D, shirt=CHAR, arms="none")
    c.add(line([(330, 1010), (540, 1040), (750, 960)], 96), (112, 104, 100), elev=9)
    c.add(line([(750, 1020), (540, 960), (340, 960)], 96), (100, 92, 88), elev=9)
    c.add(ell(750, 980, 54, 48), SK_D, elev=8); c.add(ell(340, 980, 54, 48), SK_D, elev=8)
    qmark(c, 540, 230, 520); return c


def s41():
    c = Canvas()
    for i, (x, y) in enumerate([(380, 640), (460, 680), (540, 720)]):
        calendar_page(c, x, y, 560, 600, rings=[])
    c.add(text("90", 540, 790, 360), OR, elev=0, edge=False)
    c.add(poly([(880, 300), (1010, 340), (990, 500), (880, 590), (770, 500), (750, 340)]), TEAL, elev=14)
    c.add(line([(810, 440), (865, 500), (950, 390)], 34), CREAM, elev=0, edge=False)
    bottle(c, 200, 1090, 0.8); return c


def s42():
    c = Canvas(); woman(c, 280, 180, s=0.85, skin=SK_D, shirt=CHAR, body=False)
    c.add(rr(160, 700, 920, 1180, 30), CREAM, elev=16)
    c.add(poly([(160, 700), (920, 700), (540, 960)]), (224, 206, 176), elev=8)
    c.add(rr(380, 560, 700, 760, 14), GRN, elev=8); c.add(ell(540, 660, 50), CREAM, elev=0, edge=False)
    hand(c, 980, 1000, ang=180, sleeve=CHAR, arm=200); return c


def s43():
    c = Canvas(); c.glow(540, 640, 800, (255, 226, 170), 0.5); bottle(c, 540, 640, 1.9)
    for x, y, r_ in [(220, 380, 56), (860, 460, 44), (780, 260, 36)]:
        sparkle(c, x, y, r_)
    c.add(rr(140, 1500, 940, 1700, 100), OR, elev=18)
    c.add(poly([(480, 1560), (600, 1600), (480, 1640)]), CREAM, elev=0, edge=False)
    hand(c, 790, 1900, ang=-100, point=True, sleeve=CHAR, arm=300, s=1.0); return c


SCENES = {i: f for i, f in enumerate([s01, s02, s03, s04, s05, s06, s07, s08, s09, s10, s11, s12, s13, s14, s15, s16, s17, s18, s19, s20, s21, s22,
                                      s23, s24, s25, s26, s27, s28, s29, s30, s31, s32, s33, s34, s35, s36, s37, s38, s39, s40, s41, s42, s43], 1)}

SHIFT = {26: 60, 27: 250, 28: 120, 29: 120, 30: 100, 32: 130, 37: 40, 39: 120}
NO_GROUND = {1, 2, 4, 5, 7, 9, 11, 14, 15, 17, 18, 19, 24, 35, 38, 40, 43, 25, 3, 12, 13, 21, 6, 8}


def render(i):
    c = SCENES[i]()
    dy = SHIFT.get(i, 0)
    if dy:
        c.a = np.roll(c.a, dy, axis=0)
        c.a[:dy] = c.a[dy:dy + 1]
    if i not in NO_GROUND:
        ground(c, 1660)
    return c


if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    ids = [int(a) for a in sys.argv[1:]] or list(SCENES)
    for i in ids:
        render(i).save(os.path.join(OUT, f"S{i:02d}.png"))
        print("S%02d" % i, flush=True)
