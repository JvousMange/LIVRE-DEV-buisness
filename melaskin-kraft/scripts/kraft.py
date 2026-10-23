import math, random
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter

W, H = 1080, 1920
FPS = 12

KR = (201, 160, 107)
KR_D = (170, 126, 78)
KR_L = (226, 194, 144)
CREAM = (255, 247, 201)
TERRA = (140, 74, 50)
SAGE = (107, 143, 113)
BROWN = (48, 21, 9)
SKIN = (146, 94, 62)
SKIN_D = (118, 73, 46)
SPOT = (70, 36, 19)
HAIR = (44, 22, 12)
RED = (192, 62, 46)
SUN = (243, 192, 62)
GREY = (150, 156, 162)
BEIGE = (222, 190, 150)
PINK = (232, 205, 196)

_fc = {}


def F(sz, w='b'):
    sz = max(8, int(sz))
    k = (sz, w)
    if k not in _fc:
        p = '/usr/share/fonts/opentype/inter/Inter-%s.otf' % ('ExtraBold' if w == 'x' else 'Bold')
        _fc[k] = ImageFont.truetype(p, sz)
    return _fc[k]


def clamp(x, a=0.0, b=1.0):
    return max(a, min(b, x))


def ease(x):
    x = clamp(x)
    return x * x * (3 - 2 * x)


def back(x):
    x = clamp(x)
    c1 = 1.70158
    c3 = c1 + 1
    return 1 + c3 * (x - 1) ** 3 + c1 * (x - 1) ** 2


def pop(t, t0=0.0, dur=0.35):
    return back((t - t0) / dur) if t >= t0 else 0.0


def dark(c, k=0.74):
    return tuple(int(v * k) for v in c[:3])


def textimg(txt, size, fill, w='x', spacing=8, align='center'):
    f = F(size, w)
    d = ImageDraw.Draw(Image.new('RGBA', (1, 1)))
    bb = d.multiline_textbbox((0, 0), txt, font=f, spacing=spacing, align=align)
    im = Image.new('RGBA', (int(math.ceil(bb[2] - bb[0])) + 6, int(math.ceil(bb[3] - bb[1])) + 6), (0, 0, 0, 0))
    ImageDraw.Draw(im).multiline_text((3 - bb[0], 3 - bb[1]), txt, font=f, fill=tuple(fill) + (255,),
                                      spacing=spacing, align=align)
    return im


def textimg_stroke(txt, size, fill, stroke, sw, w='x'):
    f = F(size, w)
    d = ImageDraw.Draw(Image.new('RGBA', (1, 1)))
    bb = d.textbbox((0, 0), txt, font=f, stroke_width=sw)
    im = Image.new('RGBA', (int(math.ceil(bb[2] - bb[0])) + 10, int(math.ceil(bb[3] - bb[1])) + 10), (0, 0, 0, 0))
    ImageDraw.Draw(im).text((5 - bb[0], 5 - bb[1]), txt, font=f, fill=tuple(fill) + (255,), stroke_width=sw,
                            stroke_fill=tuple(stroke) + (255,))
    return im


def wrap(txt, size, maxw, w='b'):
    f = F(size, w)
    words = txt.split(' ')
    lines, cur = [], ''
    for wd in words:
        test = (cur + ' ' + wd).strip()
        if f.getlength(test) <= maxw:
            cur = test
        else:
            lines.append(cur)
            cur = wd
    lines.append(cur)
    return '\n'.join(lines)


class Cv:
    def __init__(self, bg, fi):
        self.im = bg.copy()
        self.d = ImageDraw.Draw(self.im)
        self.fi = fi
        self.n = 0

    def jit(self, amp=1.7):
        self.n += 1
        r = random.Random(self.fi * 7919 + self.n * 104729)
        return r.uniform(-amp, amp), r.uniform(-amp, amp)

    def _comp(self, layer, x, y):
        x0 = max(0, x)
        y0 = max(0, y)
        x1 = min(W, x + layer.width)
        y1 = min(H, y + layer.height)
        if x1 <= x0 or y1 <= y0:
            return
        lay = layer.crop((x0 - x, y0 - y, x1 - x, y1 - y))
        crop = self.im.crop((x0, y0, x1, y1))
        crop.alpha_composite(lay)
        self.im.paste(crop, (x0, y0))

    # ---------- primitives
    def poly(self, pts, fill, sh=7, edge=None, jit=True):
        if jit:
            dx, dy = self.jit()
            pts = [(x + dx, y + dy) for x, y in pts]
        xs = [p[0] for p in pts]
        ys = [p[1] for p in pts]
        pad = sh + 6
        x0 = int(min(xs)) - pad
        y0 = int(min(ys)) - pad
        x1 = int(max(xs)) + pad
        y1 = int(max(ys)) + pad
        cx0, cy0 = max(0, x0), max(0, y0)
        cx1, cy1 = min(W, x1), min(H, y1)
        if cx1 <= cx0 or cy1 <= cy0:
            return
        x0, y0 = cx0, cy0
        size = (cx1 - cx0, cy1 - cy0)
        loc = [(x - x0, y - y0) for x, y in pts]
        lay = Image.new('RGBA', size, (0, 0, 0, 0))
        if sh:
            sl = Image.new('RGBA', size, (0, 0, 0, 0))
            ImageDraw.Draw(sl).polygon([(x + sh, y + sh * 1.3) for x, y in loc], fill=(35, 18, 8, 120))
            lay = sl.filter(ImageFilter.GaussianBlur(max(1.5, sh * .55)))
        d = ImageDraw.Draw(lay)
        f = tuple(fill) if len(fill) == 4 else tuple(fill) + (255,)
        if sh >= 4:
            th = min(5, sh * .6)
            d.polygon([(x + th * .7, y + th) for x, y in loc], fill=dark(fill, .58) + (255,))
        d.polygon(loc, fill=f)
        ec = edge or dark(fill)
        d.line(loc + [loc[0]], fill=tuple(ec) + (255,), width=2, joint='curve')
        self._comp(lay, x0, y0)

    def circ(self, cx, cy, r, fill, sh=6, **k):
        n = int(clamp(r / 3, 14, 48))
        pts = [(cx + r * math.cos(2 * math.pi * i / n), cy + r * math.sin(2 * math.pi * i / n)) for i in range(n)]
        self.poly(pts, fill, sh=sh, **k)

    def ell(self, cx, cy, rx, ry, fill, rot=0, sh=6, **k):
        n = int(clamp(max(rx, ry) / 3, 14, 48))
        a = math.radians(rot)
        ca, sa = math.cos(a), math.sin(a)
        pts = []
        for i in range(n):
            t = 2 * math.pi * i / n
            x, y = rx * math.cos(t), ry * math.sin(t)
            pts.append((cx + x * ca - y * sa, cy + x * sa + y * ca))
        self.poly(pts, fill, sh=sh, **k)

    def rect(self, cx, cy, w, h, fill, rot=0, r=0, sh=6, **k):
        a = math.radians(rot)
        ca, sa = math.cos(a), math.sin(a)
        r = min(r, w / 2, h / 2)
        loc = []
        if r > 1:
            for (ox, oy, a0) in [(w / 2 - r, h / 2 - r, 0), (-w / 2 + r, h / 2 - r, 90),
                                 (-w / 2 + r, -h / 2 + r, 180), (w / 2 - r, -h / 2 + r, 270)]:
                for i in range(5):
                    t = math.radians(a0 + i * 22.5)
                    loc.append((ox + r * math.cos(t), oy + r * math.sin(t)))
        else:
            loc = [(w / 2, h / 2), (-w / 2, h / 2), (-w / 2, -h / 2), (w / 2, -h / 2)]
        pts = [(cx + x * ca - y * sa, cy + x * sa + y * ca) for x, y in loc]
        self.poly(pts, fill, sh=sh, **k)

    def strip(self, p0, p1, wd, fill, sh=4, **k):
        dx, dy = p1[0] - p0[0], p1[1] - p0[1]
        L = math.hypot(dx, dy) or 1
        nx, ny = -dy / L * wd / 2, dx / L * wd / 2
        self.poly([(p0[0] + nx, p0[1] + ny), (p1[0] + nx, p1[1] + ny), (p1[0] - nx, p1[1] - ny),
                   (p0[0] - nx, p0[1] - ny)], fill, sh=sh, **k)

    def arc(self, cx, cy, r, a0, a1, wd, fill, sh=3):
        n = 12
        outer, inner = [], []
        for i in range(n + 1):
            t = math.radians(a0 + (a1 - a0) * i / n)
            outer.append((cx + (r + wd / 2) * math.cos(t), cy + (r + wd / 2) * math.sin(t)))
            inner.append((cx + (r - wd / 2) * math.cos(t), cy + (r - wd / 2) * math.sin(t)))
        self.poly(outer + inner[::-1], fill, sh=sh, edge=fill)

    # ---------- images / text
    def blit(self, img, cx, cy, rot=0, sc=1.0, shadow=True, shd=8):
        if sc <= 0.03:
            return
        if abs(sc - 1) > 1e-3:
            img = img.resize((max(1, int(img.width * sc)), max(1, int(img.height * sc))), Image.BILINEAR)
        if rot:
            img = img.rotate(rot, expand=True, resample=Image.BICUBIC)
        dx, dy = self.jit()
        x = int(cx - img.width / 2 + dx)
        y = int(cy - img.height / 2 + dy)
        if shadow:
            a = img.split()[3].point(lambda v: int(v * 0.36))
            sh = Image.new('RGBA', img.size, (40, 20, 8, 0))
            sh.putalpha(a)
            self._comp(sh, x + shd, y + int(shd * 1.25))
        self._comp(img, x, y)

    def text(self, txt, cx, cy, size=60, fill=BROWN, rot=0, sc=1.0, w='x', shadow=False):
        if size < 10:
            return
        self.blit(textimg(txt, size, fill, w), cx, cy, rot, sc, shadow=shadow)

    def label(self, txt, cx, cy, size=64, fg=BROWN, bg=CREAM, rot=0, sc=1.0, padx=40, pady=24, w='x', maxw=None):
        if maxw:
            while size > 30:
                t = textimg(txt, size, fg, w)
                if t.width + 2 * padx <= maxw:
                    break
                size -= 3
        t = textimg(txt, size, fg, w)
        Wd, Ht = t.width + 2 * padx, t.height + 2 * pady
        im = Image.new('RGBA', (Wd, Ht), (0, 0, 0, 0))
        d = ImageDraw.Draw(im)
        d.rounded_rectangle((0, 0, Wd - 1, Ht - 1), radius=16, fill=tuple(bg) + (255,),
                            outline=dark(bg, .72) + (255,), width=4)
        im.alpha_composite(t, (padx, pady))
        self.blit(im, cx, cy, rot, sc)

    def title(self, txt, t, y=300):
        self.label(txt, 540, y, size=74, sc=pop(t, 0.12, 0.38), rot=-1.2, maxw=980, padx=44, pady=26)

    def word(self, wd, sc=1.0):
        im = textimg_stroke(wd, 92, (255, 255, 255), (52, 30, 18), 8, 'x')
        sh = im.split()[3].point(lambda v: int(v * .45))
        shd = Image.new('RGBA', im.size, (20, 10, 4, 0))
        shd.putalpha(sh)
        if abs(sc - 1) > 1e-3:
            im = im.resize((int(im.width * sc), int(im.height * sc)), Image.BILINEAR)
            shd = shd.resize(im.size, Image.BILINEAR)
        x = 540 - im.width // 2
        y = 1380 - im.height // 2
        self._comp(shd, x + 5, y + 7)
        self._comp(im, x, y)

    def zoomto(self, z, fx=540, fy=960):
        if z <= 1.001:
            return
        cw, ch = W / z, H / z
        x0 = clamp(fx - cw / 2, 0, W - cw)
        y0 = clamp(fy - ch / 2, 0, H - ch)
        self.im = self.im.crop((int(x0), int(y0), int(x0 + cw), int(y0 + ch))).resize((W, H), Image.BICUBIC)
        self.d = ImageDraw.Draw(self.im)

    def camera(self, z, fx, fy, rot=0.0, sx=0.0, sy=0.0):
        if z <= 1.001 and abs(rot) < .01 and not sx and not sy:
            return
        a = math.radians(rot)
        ca, sa = math.cos(a) / z, math.sin(a) / z
        # sortie (x,y) -> source : centre (fx+sx, fy+sy) + R * (out - centre_ecran)
        cx, cy = fx + sx, fy + sy
        c_ = ca
        s_ = sa
        e = cx - (W / 2) * c_ + (H / 2) * s_
        f = cy - (W / 2) * s_ - (H / 2) * c_
        self.im = self.im.transform((W, H), Image.AFFINE, (c_, -s_, e, s_, c_, f), resample=Image.BICUBIC,
                                    fillcolor=(190, 148, 98, 255))
        self.d = ImageDraw.Draw(self.im)

    def blur(self, r):
        self.im = self.im.filter(ImageFilter.GaussianBlur(r))
        self.d = ImageDraw.Draw(self.im)

    def caption(self, txt):
        txt = wrap(txt, 44, 880)
        t = textimg(txt, 44, BROWN, 'b', spacing=10)
        Wd, Ht = t.width + 80, t.height + 44
        im = Image.new('RGBA', (Wd, Ht), (0, 0, 0, 0))
        d = ImageDraw.Draw(im)
        d.rounded_rectangle((0, 0, Wd - 1, Ht - 1), radius=18, fill=KR_L + (245,), outline=dark(KR_L, .7) + (255,),
                            width=4)
        im.alpha_composite(t, (40, 22))
        self.blit(im, 540, 1560, shadow=True, shd=6)


# ---------------- background
def make_tex():
    rng = np.random.RandomState(7)
    low = rng.normal(0, 1, (30, 54)).astype(np.float32)
    low = np.array(Image.fromarray(low).resize((W, H), Image.BICUBIC))
    fine = rng.normal(0, 1, (H, W)).astype(np.float32)
    streak = Image.new('L', (W, H), 128)
    d = ImageDraw.Draw(streak)
    for _ in range(2600):
        x = rng.randint(0, W)
        y = rng.randint(0, H)
        L = rng.randint(30, 160)
        v = rng.randint(100, 156)
        d.line((x, y, x + L, y + rng.randint(-2, 3)), fill=v, width=1)
    st = (np.array(streak, dtype=np.float32) - 128) / 28
    return low * 4.0 + fine * 2.6 + st * 6


TEX = None


def make_bg(color):
    global TEX
    if TEX is None:
        TEX = make_tex()
    arr = np.array(color, dtype=np.float32)[None, None, :] + TEX[:, :, None]
    arr = np.clip(arr, 0, 255).astype(np.uint8)
    im = Image.fromarray(arr, 'RGB').convert('RGBA')
    d = ImageDraw.Draw(im)
    # corrugated band bottom + top edges
    dk = dark(color, .93)
    for x in range(0, W, 22):
        d.line((x, 0, x, 26), fill=dk + (255,), width=6)
        d.line((x, H - 26, x, H), fill=dk + (255,), width=6)
    return im


def finish(im, grain):
    a = np.array(im.convert('RGB'), dtype=np.float32)
    a = a + grain
    return Image.fromarray(np.clip(a, 0, 255).astype(np.uint8), 'RGB')


def make_grain():
    rng = np.random.RandomState(3)
    g = rng.normal(0, 3.2, (H, W, 1)).astype(np.float32)
    yy, xx = np.mgrid[0:H, 0:W]
    vig = ((xx - W / 2) ** 2 / (W / 2) ** 2 + (yy - H / 2) ** 2 / (H / 2) ** 2)
    vig = -10 * np.clip(vig - 0.45, 0, 1)[:, :, None]
    global TEX
    if TEX is None:
        TEX = make_tex()
    return (g * 1.3 + vig + TEX[:, :, None] * 0.55).astype(np.float32)
