import sys, glob
from PIL import Image
fs = sorted(glob.glob(sys.argv[1] + "/at_*.jpg")); n = int(sys.argv[3]) if len(sys.argv) > 3 else 6
w, h = 360, 640; rows = (len(fs) + n - 1) // n
s = Image.new("RGB", (w * n, h * rows), "white")
for i, f in enumerate(fs): s.paste(Image.open(f).resize((w, h)), ((i % n) * w, (i // n) * h))
s.save(sys.argv[2])
