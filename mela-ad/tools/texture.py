"""Génère le fond carton kraft et le grain papier (PNG) — déterministe."""
import numpy as np
from PIL import Image, ImageFilter
rng = np.random.default_rng(7)
W, H = 1080, 1920
def blur(a, r):
    im = Image.fromarray(np.clip(a, 0, 255).astype("uint8"))
    return np.asarray(im.filter(ImageFilter.GaussianBlur(r)), dtype=np.float32)
# kraft : base + nuages larges + fibres + grain
base = np.zeros((H, W), np.float32)
for r, amp in ((120, 14), (40, 9), (12, 6)):
    n = rng.normal(128, 40, (H, W)).astype(np.float32); base += (blur(n, r) - 128) * amp / 10
fib = rng.normal(128, 60, (H // 3, W)).astype(np.float32)
fib = np.asarray(Image.fromarray(np.clip(fib, 0, 255).astype("uint8")).resize((W, H), Image.BICUBIC).filter(ImageFilter.GaussianBlur(0.8)), dtype=np.float32)
base += (fib - 128) * 0.20
grain = rng.normal(0, 5, (H, W)).astype(np.float32)
tone = base + grain
col = np.array([200, 158, 112], np.float32)  # kraft chaud
img = np.stack([col[i] + tone * (0.95 if i == 0 else 0.9 if i == 1 else 0.85) for i in range(3)], -1)
# vignette légère
yy, xx = np.mgrid[0:H, 0:W]
v = 1 - 0.20 * (((xx - W / 2) / (W / 2)) ** 2 + ((yy - H / 2) / (H / 2)) ** 2) / 2
img = img * v[..., None]
Image.fromarray(np.clip(img, 0, 255).astype("uint8")).save("web/kraft.jpg", quality=92)
# grain overlay (RGBA, multiply-like via alpha) : fines fibres sombres/claires
g = rng.normal(0, 1, (H, W)).astype(np.float32)
g = blur(g * 40 + 128, 0.7) - 128
alpha = np.clip(np.abs(g) * 1.6, 0, 40)
rgb = np.where(g[..., None] > 0, 255, 40) * np.ones((H, W, 3))
Image.fromarray(np.dstack([rgb, alpha]).astype("uint8"), "RGBA").save("web/grain.png")
print("ok")
