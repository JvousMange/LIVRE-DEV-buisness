import sys, os
from kraft import *
from scenes2 import *
from render import SRT

BG = make_bg(KR)
GR = make_grain()

# mot par mot
WORDS = []
for s, e, tx in SRT:
    ws = tx.split(' ')
    tot = sum(len(w) + 1 for w in ws)
    cur = s
    for w in ws:
        dd = (e - s) * (len(w) + 1) / tot
        WORDS.append((cur, cur + dd, w))
        cur += dd

def word_at(ts):
    for s, e, w in WORDS:
        if s <= ts < e:
            return w, (ts - s)
    return None, 0

out = sys.argv[1]
os.makedirs(out, exist_ok=True)
tests = [(T1, 0.3, 3.4), (T2, 13.6, 7.2), (T3, 37.2, 4.8)]
for name, (fn, start, dur) in zip(['T1', 'T2', 'T3'], tests):
    for k, f in enumerate([0.15, 0.5, 0.9]):
        t = dur * f
        fi = int((start + t) * 12)
        c = Cv(BG, fi)
        fn(c, t, dur)
        w, tw = word_at(start + t)
        if w:
            c.word(w, sc=1.0 + .12 * math.exp(-tw * 14))
        finish(c.im, GR).save('%s/%s_%d.jpg' % (out, name, k), quality=90)
print('ok')
