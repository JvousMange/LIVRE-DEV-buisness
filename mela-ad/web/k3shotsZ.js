/* carton final */
v(null, { id: "end", sfx: [[.05, "stamp"], [.25, "ding", 2]],
  init(L) { this.bt = K.bottle(L.mid, 1.2); this.sg = K3.sign(L.fg, "MELA SKIN", 540, 1180, { size: 110, maxw: 800 }); K3.sparks(L.bg, 12, 21); },
  update(t, p, d, L) { H.look(L, 0, 0, lerp(1, 1.04, p)); H.set(this.bt, { x: 540, y: 700, s: E.pop(seg(p, .05, .3)) }); ent(this.sg, p, .1, .3, 0, -900); swing(this.sg, t); } });
