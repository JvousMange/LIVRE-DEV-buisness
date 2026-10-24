"""Export film : chaque plan devient des couches PNG + un manifest (groupes, actions, caméra) joué par Remotion.
Usage : python3 film.py OUTDIR [numéros...]"""
import importlib, json, os, sys
import numpy as np
from PIL import Image
import paper
from paper import W, H
from timing import cue, scene_dur

ACTS = ["act1", "act2", "act3", "act4"]


def registry():
    reg = {}
    for m in ACTS:
        try:
            mod = importlib.import_module(m)
        except ModuleNotFoundError:
            continue
        reg.update(mod.SCENES)
    return reg


def export_scene(i, outdir, reg):
    D = scene_dur(i)
    T = lambda w, n=0: cue(i, w, n)
    paper.REC[0] = True
    try:
        if i in reg:
            c = reg[i](T, D)
            dy = 0
        else:                                   # plan pas encore chorégraphié : version statique
            import scenes
            c = scenes.SCENES[i]()
            dy = scenes.SHIFT.get(i, 0)
            if dy:
                c.a = np.roll(c.a, dy, axis=0); c.a[:dy] = c.a[dy:dy + 1]
            if i not in scenes.NO_GROUND:
                import parts
                parts.ground(c, 1660)
    finally:
        paper.REC[0] = False
    bg = c.bg
    if dy:
        bg = np.roll(bg, dy, axis=0); bg[:dy] = bg[dy:dy + 1]
    d = os.path.join(outdir, "S%02d" % i)
    os.makedirs(d, exist_ok=True)
    for f in os.listdir(d):
        os.remove(os.path.join(d, f))
    Image.fromarray(np.clip(bg, 0, 255).astype(np.uint8)).save(os.path.join(d, "bg.jpg"), quality=90)
    layers, gb = [], {}
    for k, L in enumerate(c.rec):
        y = L["y"] + dy
        if y >= H:
            continue
        im = Image.fromarray(L["img"], "RGBA")
        fn = "L%03d.png" % k
        im.save(os.path.join(d, fn))
        w, h = im.size
        layers.append({"f": fn, "x": L["x"], "y": y, "w": w, "h": h, "tag": L["tag"], "g": L["g"], "area": round(L["area"] / (W * H), 4)})
        if L["g"]:
            b = gb.setdefault(L["g"], [1e9, 1e9, -1e9, -1e9])
            b[0], b[1], b[2], b[3] = min(b[0], L["x"]), min(b[1], y), max(b[2], L["x"] + w), max(b[3], y + h)
    groups = {g: {"origin": v.get("origin"), "bbox": gb.get(g)} for g, v in c.groups.items() if g in gb}
    return {"layers": layers, "groups": groups, "acts": c.acts, "cams": c.cams, "dur": round(D, 3)}


if __name__ == "__main__":
    outdir = sys.argv[1]
    os.makedirs(outdir, exist_ok=True)
    reg = registry()
    mp = os.path.join(outdir, "manifest.json")
    man = json.load(open(mp)) if os.path.exists(mp) else {}
    ids = [int(a) for a in sys.argv[2:]] or list(range(1, 44))
    for i in ids:
        man["S%02d" % i] = export_scene(i, outdir, reg)
        print("S%02d" % i, len(man["S%02d" % i]["layers"]), "couches,", len(man["S%02d" % i]["acts"]), "actions", flush=True)
        json.dump(man, open(mp, "w"))
