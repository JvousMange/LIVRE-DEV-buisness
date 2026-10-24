"""Calage des mots sur la voix (transcription Descript à 0,25 s) : sert aux sous-titres ET aux actions d'animation."""
import os, re
from data import SHOTS, DURATION

HERE = os.path.dirname(os.path.abspath(__file__))
STARTS = [s[0] for s in SHOTS]
STARTS[0] = 0.0
ENDS = STARTS[1:] + [DURATION]


def norm(w):
    return re.sub(r"[^a-z0-9àâäéèêëîïôöùûüç]", "", w.lower())


def _parse():
    raw = open(os.path.join(HERE, "transcript_quarter.txt"), encoding="utf-8").read()
    toks = re.findall(r"\[(\d\d):(\d\d):(\d\d)\]|([^\s\[\]]+)", raw)
    cnt, marks, cur = {}, [], None      # marks : (t, [mots])
    for hh, mm, ss, w in toks:
        if w == "":
            s = int(hh) * 3600 + int(mm) * 60 + int(ss)
            k = cnt.get(s, 0); cnt[s] = k + 1
            cur = (s + 0.25 * k, [])
            marks.append(cur)
        elif cur is not None:
            cur[1].append(w)
    words = []
    for j, (t, ws) in enumerate(marks):
        if not ws:
            continue
        nxt = next((m[0] for m in marks[j + 1:] if m[1]), t + 0.5)
        span = min(max(nxt - t, 0.25), 0.9)
        tot = sum(len(w) + 1 for w in ws); c = 0
        for w in ws:
            a = t + span * c / tot
            c += len(w) + 1
            words.append([w, a])
    out = []
    for w, a in words:
        if w in ("%", "?", ":") and out:           # ponctuation isolée : collée au mot précédent
            out[-1][0] += (" " if w == "%" else "") + w
            continue
        out.append([w, a])
    res = []
    for k, (w, a) in enumerate(out):
        nxt = out[k + 1][1] if k + 1 < len(out) else DURATION
        res.append((w, a, min(nxt, a + 0.6)))
    return res


WORDS = _parse()


def shot_words(i):
    a, b = STARTS[i - 1] - 0.3, ENDS[i - 1] + 0.3
    return [(w, s, e) for w, s, e in WORDS if a <= s < b]


def cue(i, word, n=0):
    """Instant (s) relatif au début du plan i où le n-ième mot commençant par `word` est prononcé."""
    want, k = norm(word), 0
    for w, s, e in shot_words(i):
        if norm(w).startswith(want) or (len(want) >= 4 and want in norm(w)):
            if k == n:
                return max(0.0, s - STARTS[i - 1])
            k += 1
    raise KeyError(f"S{i:02d}: mot '{word}' introuvable ({[w for w, _, _ in shot_words(i)]})")


def scene_dur(i):
    return ENDS[i - 1] - STARTS[i - 1]


def captions():
    return [{"text": (" " if k else "") + w, "startMs": round(s * 1000), "endMs": round(e * 1000),
             "timestampMs": round((s + e) / 2 * 1000), "confidence": 1} for k, (w, s, e) in enumerate(WORDS)]
