import sys, os, math
from multiprocessing import Pool
from kraft import *
from scenes3 import *

SRT = [
(0.27, 3.03, "Cinq raisons qui font que ton hyperpigmentation ne part pas."),
(3.65, 6.77, "Un : tu essaies de faire partir tes taches à la surface alors"),
(6.789, 8.15, "qu'elles se fabriquent sous ta peau."),
(8.73, 12.049, "Deux : tu les caches, fond de teint, maquillage, mais tu ne"),
(12.07, 13.29, "les fais pas vraiment partir."),
(13.75, 16.81, "Trois : la plupart des soins sont pensés pour des peaux claires."),
(17.19, 20.53, "Sur une peau mate ou noire, ils agressent ou ils ne font rien."),
(20.99, 23.849, "Quatre : depuis que tu fais des gommages ou que tu testes des"),
(23.89, 25.95, "produits au hasard, c'est encore pire."),
(26.39, 31.25, "Et cinq : soleil, rasage, frottement, rien ne protège du retour des taches."),
(31.79, 35.15, "Le problème ne vient pas de toi, ni de ta peau, mais d'en dessous."),
(35.51, 36.97, "Et c'est là que tu peux agir."),
(37.39, 38.21, "Voilà ce qui se passe."),
(38.63, 40.23, "Ta peau fabrique de la mélanine."),
(40.51, 41.63, "C'est ce qui lui donne sa couleur."),
(42.01, 46.63, "Quand elle est agressée par un bouton, un rasage, le soleil ou les hormones, elle"),
(46.67, 48.75, "en fabrique trop à cet endroit précis."),
(49.15, 52.77, "Cette mélanine reste coincée sous la peau et sur une peau mate ou"),
(52.85, 54.75, "noire, elle réagit souvent plus fort."),
(55.11, 57.67, "C'est pour ça que la tache reste des mois et qu'un produit"),
(57.73, 58.95, "de surface n'y change rien."),
(59.31, 63.13, "Le but n'est donc pas d'éclaircir ta peau, c'est de réguler ta production"),
(63.17, 66.89, "de mélanine pour qu'à chaque agression, ta peau n'en fabrique plus trop et ne"),
(66.95, 68.429, "te gâche plus le teint tous les jours."),
(68.83, 71.61, "Imagine que tu puisses enfin faire partir ces taches."),
(71.89, 75.11, "Pas avec un produit qui brûle, pas avec un gommage magique, mais"),
(75.149, 78.729, "avec une solution qui freine la fabrication de pigments à la source."),
(79.11, 81.39, "Pour ça, il y a quatre actifs dont tu as besoin."),
(81.77, 85.33, "L'acide azélaïque à 10 % freine la production de mélanine."),
(85.71, 90.009, "L'alpha-arbutine bloque la tyrosinase, l'enzyme qui lance cette fabrication."),
(90.41, 93.53, "L'acide tranexamique agit sur les taches tenaces, celles qui"),
(93.55, 94.69, "ne partent jamais vraiment."),
(94.97, 99.83, "Et la niacinamide à 5 % renforce ta barrière cutanée pour que ta peau réagisse"),
(99.89, 101.649, "moins et que les taches reviennent moins."),
(101.99, 105.35, "Il existe plusieurs produits capables de faire partir tes taches, mais"),
(105.39, 108.89, "tu n'as pas besoin de dix flacons différents ni d'un produit hors de prix."),
(109.19, 112.509, "Le sérum anti-taches MélaSkin réunit tous les actifs dont tu"),
(112.55, 114.229, "as besoin en un seul flacon."),
(114.53, 118.19, "94 % de celles qui l'ont testé le recommandent à leur entourage."),
(118.47, 121.929, "Et cette semaine, pour deux flacons achetés, tu en reçois un offert."),
(122.31, 123.71, "Toujours sceptique ? Très bien."),
(124.009, 127.07, "C'est pour ça que MélaSkin a mis en place une garantie satisfait ou"),
(127.13, 128.749, "remboursé de quatre-vingt-dix jours."),
(129.029, 132.69, "Si tu as encore des taches au bout de trois mois, on te rembourse la totalité."),
(132.91, 136.47, "Clique sur le bouton ci-dessous et fais enfin partir ces taches."),
]


def build_caps():
    caps = []
    i = 0
    while i < len(SRT):
        s, e, t = SRT[i]
        j = i + 1
        while j < len(SRT) and t[-1] not in '.?!' and len(t) + len(SRT[j][2]) <= 95:
            t = t + ' ' + SRT[j][2]
            e = SRT[j][1]
            j += 1
        caps.append([s, e, t])
        i = j
    for k in range(len(caps) - 1):
        if caps[k + 1][0] - caps[k][1] < 0.9:
            caps[k][1] = caps[k + 1][0] - 0.02
        else:
            caps[k][1] += 0.25
    caps[-1][1] += 0.2
    return caps


WORDS = []
for _s, _e, _tx in SRT:
    _ws = _tx.split(' ')
    _tot = sum(len(w) + 1 for w in _ws)
    _cur = _s
    for _w in _ws:
        _dd = (_e - _s) * (len(_w) + 1) / _tot
        WORDS.append((_cur, _cur + _dd, _w))
        _cur += _dd
CAPS = build_caps()
BGS = {}
GRAIN = None
CURT = None


def init():
    global BGS, GRAIN
    BGS = {'kr': make_bg(KR), 'terra': make_bg(TERRA), 'sage': make_bg((120, 150, 118))}
    GRAIN = make_grain()


def scene_at(ts):
    for i in range(len(SCENES)):
        if BOUND[i] <= ts < BOUND[i + 1]:
            return i
    return len(SCENES) - 1


def render_frame(fi):
    ts = fi / FPS
    i = scene_at(ts)
    t = ts - BOUND[i]
    d = BOUND[i + 1] - BOUND[i]
    c = Cv(BGS[BGKEY[i]], fi)
    SCENES[i](c, t, d)
    # paper curtain transition
    if i > 0 and t < 0.3:
        p = ease(t / 0.3)
        x = -60 + (W + 160) * p
        # kraft sheet sliding left->right, torn zigzag edge on its right side
        pts = [(-100, -10)]
        for k in range(0, 21):
            y = k * H / 20
            pts.append((x + (22 if k % 2 else -22), y))
        pts.append((-100, H + 10))
        c.poly(pts, KR_D if BGKEY[i] != 'terra' else (110, 55, 38), sh=14, jit=False)
    for s_, e_, w_ in WORDS:
        if s_ <= ts < e_ + 0.04:
            c.word(w_, sc=1.0 + .12 * math.exp(-(ts - s_) * 14))
            break
    return finish(c.im, GRAIN)


def work(fi):
    im = render_frame(fi)
    im.save('%s/%05d.jpg' % (OUT, fi), quality=90)
    return fi


OUT = None

if __name__ == '__main__':
    mode = sys.argv[1]
    OUT = sys.argv[2]
    os.makedirs(OUT, exist_ok=True)
    init()
    if mode == 'test':
        frames = [int((BOUND[i] + (BOUND[i + 1] - BOUND[i]) * float(sys.argv[3])) * FPS) for i in range(26)]
    else:
        total = int(math.ceil(BOUND[-1] * FPS))
        frames = list(range(total))
    with Pool(4) as p:
        for k, _ in enumerate(p.imap_unordered(work, frames, chunksize=8)):
            if k % 100 == 0:
                print(k, len(frames), flush=True)
    print('done')
