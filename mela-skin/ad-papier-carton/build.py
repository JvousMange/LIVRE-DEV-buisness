"""Monte la pub : images S01..S43 (images/) + voix mp3 -> pub.mp4 (720x1280, 30 fps).
Usage : python3 build.py chemin/voix.mp3 [sortie.mp4]
Une image manquante est remplacée par un fond kraft numéroté (test de timing)."""
import os, re, subprocess, sys, tempfile
from PIL import Image, ImageDraw, ImageFont
from data import SHOTS, DURATION

HERE = os.path.dirname(os.path.abspath(__file__))
IMG = os.path.join(HERE, "images")
W, H, FPS = 720, 1280, 30
audio = sys.argv[1]
out = sys.argv[2] if len(sys.argv) > 2 else os.path.join(HERE, "pub.mp4")
tmp = tempfile.mkdtemp()

def find_image(i):
    for ext in ("png", "jpg", "jpeg", "webp"):
        p = os.path.join(IMG, f"S{i:02d}.{ext}")
        if os.path.exists(p):
            return p
    p = os.path.join(tmp, f"ph{i}.png")
    im = Image.new("RGB", (1440, 2560), (190, 150, 105))
    d = ImageDraw.Draw(im)
    f = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 360)
    d.text((720, 1280), f"S{i:02d}", font=f, fill=(150, 110, 70), anchor="mm")
    im.save(p)
    return p

starts = [s[0] for s in SHOTS] + [DURATION]
starts[0] = 0.0
clips, ass_events = [], []

def t(x):
    h, m, s = int(x // 3600), int(x % 3600 // 60), x % 60
    return f"{h}:{m:02d}:{s:05.2f}"

for i, (st, text, _) in enumerate(SHOTS, 1):
    a, b = starts[i - 1], starts[i]
    dur = b - a
    n = max(1, round(dur * FPS))
    z = "min(zoom+0.0007,1.18)" if i % 2 else "if(eq(on,1),1.18,max(zoom-0.0007,1.0))"
    clip = os.path.join(tmp, f"c{i}.mp4")
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", find_image(i), "-vf",
        f"scale={W*2}:{H*2}:force_original_aspect_ratio=increase,crop={W*2}:{H*2},"
        f"zoompan=z='{z}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d={n}:s={W}x{H}:fps={FPS},format=yuv420p",
        "-frames:v", str(n), "-c:v", "libx264", "-preset", "veryfast", "-crf", "20", clip], check=True)
    clips.append(clip)
    # mot par mot, durée proportionnelle à la longueur, fin du dernier mot avant le plan suivant
    words = text.replace("...", "").split()
    speak_end = b - 0.12 if i < len(SHOTS) else b - 0.3
    weights = [len(re.sub(r"\W", "", w)) + 2 for w in words]
    tot, cur = sum(weights), a + (0.03 if i == 1 else 0)
    for w, wt in zip(words, weights):
        d = (speak_end - cur) * 0 + (speak_end - a) * wt / tot
        ass_events.append(f"Dialogue: 0,{t(cur)},{t(cur + d)},W,,0,0,0,,{w}")
        cur += d

lst = os.path.join(tmp, "list.txt")
open(lst, "w").write("".join(f"file '{c}'\n" for c in clips))
ass = os.path.join(tmp, "sub.ass")
open(ass, "w", encoding="utf-8").write(f"""[Script Info]
ScriptType: v4.00+
PlayResX: {W}
PlayResY: {H}

[V4+ Styles]
Format: Name,Fontname,Fontsize,PrimaryColour,OutlineColour,BackColour,Bold,Italic,BorderStyle,Outline,Shadow,Alignment,MarginL,MarginR,MarginV
Style: W,Inter,74,&H00FFFFFF,&H00202020,&H80000000,1,0,1,6,2,2,40,40,330

[Events]
Format: Layer,Start,End,Style,Name,MarginL,MarginR,MarginV,Effect,Text
""" + "\n".join(ass_events) + "\n")

silent = os.path.join(tmp, "v.mp4")
subprocess.run(["ffmpeg", "-y", "-v", "error", "-f", "concat", "-safe", "0", "-i", lst, "-c", "copy", silent], check=True)
subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", silent, "-i", audio, "-vf", f"ass={ass}",
    "-map", "0:v", "-map", "1:a", "-c:v", "libx264", "-preset", "medium", "-crf", "20",
    "-c:a", "aac", "-b:a", "192k", "-t", str(DURATION), "-pix_fmt", "yuv420p", "-movflags", "+faststart", out], check=True)
print("OK ->", out)
