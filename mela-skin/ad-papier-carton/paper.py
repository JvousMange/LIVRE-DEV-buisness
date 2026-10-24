"""Mini moteur « papier découpé » : chaque forme est une feuille avec ombre portée,
grain de papier et léger liseré de lumière. Tout est dessiné en code (Pillow + numpy)."""
import math, random, contextlib
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageChops

W, H = 1080, 1920
FONT = "/usr/share/fonts/opentype/inter/Inter-Black.otf"

KR = (196, 152, 104); KRL = (216, 180, 132); KRD = (168, 124, 82)
CREAM = (242, 230, 208); BEIGE = (224, 192, 152); DARK = (64, 58, 58); CHAR = (92, 84, 82)
OR = (226, 86, 52); ORD = (190, 62, 38)
SK_E = (88, 56, 40); SK_D = (116, 74, 50); SK_M = (152, 104, 70); SK_L = (236, 206, 176)
AMBER = (186, 112, 42); BRN = (122, 84, 58); CHOC = (74, 48, 38)
GRN = (82, 112, 92); TEAL = (66, 98, 94); YEL = (234, 178, 66); BLUE = (92, 122, 150)
PINK = (214, 120, 100); WHITE = (250, 244, 232)

REC = [False]   # mettre REC[0] = True pour enregistrer les couches
_rng = np.random.default_rng(7)
_grain = None


def grain():
    global _grain
    if _grain is None:
        n = _rng.normal(0, 1, (H, W)).astype(np.float32)
        big = np.array(Image.fromarray(((n * 40) + 128).clip(0, 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.2)), dtype=np.float32)
        fib = np.zeros((H, W), np.float32)
        im = Image.new("L", (W, H), 128)
        d = ImageDraw.Draw(im)
        r = random.Random(3)
        for _ in range(2600):
            x, y = r.randint(0, W), r.randint(0, H)
            a = r.uniform(0, math.pi); l = r.randint(8, 40)
            d.line([(x, y), (x + l * math.cos(a), y + l * math.sin(a))], fill=r.choice([112, 146]), width=1)
        fib = np.array(im.filter(ImageFilter.GaussianBlur(0.6)), dtype=np.float32)
        _grain = ((big - 128) * 0.05 + (fib - 128) * 0.18) / 128.0  # ~ ±6 %
    return _grain


def font(size):
    return ImageFont.truetype(FONT, size)


# ---------- masques ----------
def M():
    return Image.new("L", (W, H), 0)


def _d(m):
    return ImageDraw.Draw(m)


def ell(cx, cy, rx, ry=None, wob=0.0, seed=1, rot=0):
    ry = rx if ry is None else ry
    m = M()
    if wob:
        r = random.Random(seed)
        n = 56
        ph = [r.uniform(0, 6.28) for _ in range(4)]
        pts = []
        for i in range(n):
            a = 2 * math.pi * i / n
            k = 1 + wob * (math.sin(2 * a + ph[0]) + 0.6 * math.sin(3 * a + ph[1]) + 0.4 * math.sin(5 * a + ph[2]))
            x, y = rx * k * math.cos(a), ry * k * math.sin(a)
            ca, sa = math.cos(rot), math.sin(rot)
            pts.append((cx + x * ca - y * sa, cy + x * sa + y * ca))
        _d(m).polygon(pts, fill=255)
    else:
        _d(m).ellipse([cx - rx, cy - ry, cx + rx, cy + ry], fill=255)
    return m


def rr(x0, y0, x1, y1, r=20):
    m = M()
    _d(m).rounded_rectangle([x0, y0, x1, y1], radius=r, fill=255)
    return m


def poly(pts):
    m = M()
    _d(m).polygon(pts, fill=255)
    return m


def line(pts, w=30):
    """Trait épais à bouts ronds."""
    m = M()
    d = _d(m)
    d.line(pts, fill=255, width=int(w), joint="curve")
    for p in (pts[0], pts[-1]):
        d.ellipse([p[0] - w / 2, p[1] - w / 2, p[0] + w / 2, p[1] + w / 2], fill=255)
    return m


def text(s, x, y, size, anchor="mm"):
    m = M()
    _d(m).text((x, y), s, font=font(size), fill=255, anchor=anchor)
    return m


def U(*ms):
    out = ms[0]
    for m in ms[1:]:
        out = ImageChops.lighter(out, m)
    return out


def S(a, b):
    return ImageChops.subtract(a, b)


def I(a, b):
    return ImageChops.darker(a, b)


def arc_ring(cx, cy, r, w, a0=180, a1=360):
    m = M()
    _d(m).arc([cx - r, cy - r, cx + r, cy + r], a0, a1, fill=255, width=int(w))
    return m


# ---------- toile ----------
class Canvas:
    def __init__(self, base=KR, vignette=0.22, seed=0):
        g = grain()
        arr = np.zeros((H, W, 3), np.float32) + np.array(base, np.float32)
        yy, xx = np.mgrid[0:H, 0:W]
        v = 1 - vignette * (((xx - W / 2) / (W / 2)) ** 2 + ((yy - H / 2) / (H / 2)) ** 2) / 2
        low = np.array(Image.fromarray(((np.random.default_rng(11).normal(0, 1, (H // 40, W // 40)) * 28) + 128).clip(0, 255).astype(np.uint8)).resize((W, H), Image.BICUBIC).filter(ImageFilter.GaussianBlur(40)), np.float32)
        arr = arr * v[..., None] * (1 + g[..., None] * 1.1) * (1 + ((low - 128) / 128.0 * 0.16)[..., None])
        self.a = arr
        self.rnd = random.Random(seed)
        self.rec = [] if REC[0] else None      # liste de couches si l'export est actif
        self.tag = None
        self.grp = None
        self.groups = {}
        self.acts = []
        self.cams = []
        self.bg = arr.copy() if REC[0] else None

    def add(self, mask, color, elev=7, shade=0.0, edge=True, grainy=True, alpha=1.0, bevel=1.0):
        bb = mask.getbbox()
        if not bb:
            return self
        pad = int(elev * 3 + 8)
        x0, y0 = max(0, bb[0] - pad), max(0, bb[1] - pad)
        x1, y1 = min(W, bb[2] + pad), min(H, bb[3] + pad)
        m = np.array(mask.crop((x0, y0, x1, y1)).filter(ImageFilter.GaussianBlur(0.9)), np.float32) / 255.0 * alpha
        reg = self.a[y0:y1, x0:x1]
        s = None
        if elev > 0:
            sh = Image.fromarray((m * 255).astype(np.uint8))
            soft = np.array(ImageChops.offset(sh, int(elev * 0.55), int(elev * 0.95)).filter(ImageFilter.GaussianBlur(elev * 0.8)), np.float32) / 255.0 * 0.34
            tight = np.array(ImageChops.offset(sh, 1, 2).filter(ImageFilter.GaussianBlur(1.6)), np.float32) / 255.0 * 0.42   # ombre de contact
            s = 1 - (1 - soft) * (1 - tight)
            reg *= (1 - s[..., None])
        col = np.zeros(reg.shape, np.float32) + np.array(color, np.float32)
        if shade:
            gy = np.linspace(1 + shade, 1 - shade, reg.shape[0])[:, None, None]
            col = col * gy
        if grainy:
            col = col * (1 + grain()[y0:y1, x0:x1, None] * 1.4)
        if edge and elev > 0:
            # relief : la feuille est une plaque d'épaisseur finie, biseau éclairé en haut à gauche
            sig = max(1.6, min(elev * 0.45, 7.0))
            hmap = np.array(Image.fromarray((m * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(sig)), np.float32) / 255.0
            gy_, gx_ = np.gradient(hmap)
            k = sig * 2.2 * bevel
            nz = 1.0 / np.sqrt(1 + (gx_ * k) ** 2 + (gy_ * k) ** 2)
            lam = (-gx_ * k * -0.55 + -gy_ * k * -0.62) * nz + 0.56 * nz     # n . L  (L vers le haut-gauche)
            lam = lam - 0.56
            col = col * (1 + 1.5 * lam[..., None])
            sx = np.roll(np.roll(m, 2, 0), 2, 1)
            col = col * (1 + 0.16 * np.clip(m - sx, 0, 1)[..., None])
        mm = m[..., None]
        if self.rec is not None:
            tot = mm + (s[..., None] if s is not None else 0) * (1 - mm)
            if float(tot.max()) > 0.02:
                rgb = (col * mm) / np.maximum(tot, 1e-4)
                rgba = np.concatenate([np.clip(rgb, 0, 255), np.clip(tot, 0, 1) * 255], axis=2).astype(np.uint8)
                self.rec.append({"x": x0, "y": y0, "img": rgba, "tag": self.tag, "g": self.grp, "area": float(m.sum())})
        reg[:] = reg * (1 - mm) + col * mm
        return self

    # ---- chorégraphie -------------------------------------------------
    @contextlib.contextmanager
    def g(self, name, origin=None):
        """Les couches dessinées dans le bloc forment le groupe `name` (animé ensemble).
        origin : None (centre du groupe), 'bottom', 'top', 'left', 'right' ou (x, y) en px."""
        old = self.grp
        self.grp = name
        self.groups.setdefault(name, {"origin": origin})
        if origin is not None:
            self.groups[name]["origin"] = origin
        try:
            yield
        finally:
            self.grp = old

    def act(self, group, kind, t=0.0, **kw):
        """Action d'animation sur un groupe : in, out, move, shake, wipe, pulse, bob, spin, sway, fall, scale, rot, fade, blink, wipein."""
        self.acts.append({"g": group, "k": kind, "t": round(float(t), 3), **kw})
        return self

    def cam(self, kind, t=0.0, **kw):
        """Caméra : push (f0,to,cx,cy), pan (dx,dy), shake (amp), tilt (deg)."""
        self.cams.append({"k": kind, "t": round(float(t), 3), **kw})
        return self

    def img(self):
        return Image.fromarray(np.clip(self.a, 0, 255).astype(np.uint8))

    def glow(self, cx, cy, r, color=(255, 214, 140), strength=0.5):
        yy, xx = np.mgrid[0:H, 0:W]
        d = np.sqrt((xx - cx) ** 2 + (yy - cy) ** 2) / r
        g = np.clip(1 - d, 0, 1) ** 2 * strength
        if self.rec is not None:
            ys, xs = np.where(g > 0.004)
            if len(ys):
                y0, y1, x0, x1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
                gg = g[y0:y1, x0:x1]
                rgba = np.zeros((y1 - y0, x1 - x0, 4), np.uint8)
                rgba[..., :3] = np.array(color, np.uint8)
                rgba[..., 3] = (gg * 255).astype(np.uint8)
                self.rec.append({"x": int(x0), "y": int(y0), "img": rgba, "tag": "glow", "g": self.grp, "area": 0.0})
        self.a = self.a * (1 - g[..., None]) + np.array(color, np.float32) * g[..., None]
        return self

    def save(self, path):
        self.img().save(path)
