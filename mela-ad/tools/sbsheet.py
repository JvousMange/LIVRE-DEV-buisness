import sys, json, os, re
from PIL import Image, ImageDraw, ImageFont
d = sys.argv[1]; out = sys.argv[2]
J = json.load(open(f'{d}/vo.json')); ids = J['list']; vo = J['vo']
F = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'; FB = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
f1 = ImageFont.truetype(FB, 26); f2 = ImageFont.truetype(F, 22); f3 = ImageFont.truetype(FB, 20)
w, h = 300, 533
groups = {}
for i in ids: groups.setdefault(re.match(r'\d+', i).group(), []).append(i)
keys = list(groups)
per = int(sys.argv[3]) if len(sys.argv) > 3 else 4
os.makedirs(out, exist_ok=True)
for k in range(0, len(keys), per):
    plans = [p for g in keys[k:k+per] for p in groups[g]]
    cols = 3; rows = (len(plans) + cols - 1) // cols
    cw = w * 2 + 30; ch = h + 90
    S = Image.new('RGB', (cw * cols + 20, ch * rows + 20), '#f4efe4'); dr = ImageDraw.Draw(S)
    for n, p in enumerate(plans):
        x0 = 10 + (n % cols) * cw; y0 = 10 + (n // cols) * ch
        dr.text((x0 + 4, y0 + 2), f'{p}', fill='#a9482f', font=f1)
        t = vo[p]; dr.text((x0 + 60, y0 + 6), t[:52] + ('…' if len(t) > 52 else ''), fill='#222', font=f2)
        for e in (0, 1):
            fp = f'{d}/{p}_{e}.jpg'
            if os.path.exists(fp): S.paste(Image.open(fp).resize((w, h)), (x0 + e * (w + 10), y0 + 40))
            dr.text((x0 + e * (w + 10) + 6, y0 + 44 + h - 28), 'DÉPART' if e == 0 else 'ARRIVÉE', fill='#fff', font=f3, stroke_width=3, stroke_fill='#000')
    S.save(f'{out}/planche_{k // per + 1:02d}.jpg', quality=85)
print('ok')
