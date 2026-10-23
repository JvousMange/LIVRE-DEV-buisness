import sys
from kraft import *
from portrait import *

BG = make_bg(KR)
GR = make_grain()
c = Cv(BG, 3)
c.rect(540, 960, 1100, 2000, (226, 194, 144), sh=0, jit=False)
portrait(c, 300, 560, 300, tone=CHEEK_T[1], turn=.55, hair=0, expr='n', spots=spots_cheeks(1.2))
portrait(c, 780, 560, 300, tone=CHEEK_T[2], turn=-.4, hair=1, expr='smile', top=TERRA)
portrait(c, 300, 1250, 300, tone=CHEEK_T[0], turn=0, hair=2, expr='wince', spots=spots_cheeks(1.3), top=CREAM)
portrait(c, 780, 1250, 300, tone=CHEEK_T[3], turn=.3, hair=0, expr='skep', brow_up=1, spots=spots_cheeks(1.0), top=SUN)
finish(c.im, GR).save(sys.argv[1], quality=92)
