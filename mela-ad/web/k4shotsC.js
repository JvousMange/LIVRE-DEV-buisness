/* k4 · C : le produit, la preuve, l'offre, la garantie, le CTA */
const bottle = (p, s = 1.2) => K.bottle(p, s);
v([24, 2], { id: "pr1", sfx: [[.1, "thud"], [.35, "thud"], [.6, "thud"]],
  init(L) { const cols = ["#F2C9C0", "#CFE0E8", "#F6E3A6", "#E9D8C8", "#CDE3D0"]; this.it = Array.from({ length: 12 }, (_, i) => { const it = i % 3 === 0 ? K.jar(L.mid, cols[i % 5], .9) : i % 3 === 1 ? K.tube(L.mid, cols[i % 5], .75) : K.pump(L.mid); H.set(it, { x: 220 + (i % 4) * 210 + (Math.floor(i / 4) % 2) * 60, y: 1100 - Math.floor(i / 4) * 230 - (i % 2) * 20, r: (i * 37) % 40 - 20 }); return it; }); },
  update(t, p, d, L) { zoom(L, p); this.it.forEach((g, i) => { const k = E.out(seg(p, .04 + i * .05, .2 + i * .05)); H.set(g, { y: g._b.y0 === undefined ? (g._b.y0 = g._b.y) : g._b.y0, o: p > .04 + i * .05 ? 1 : 0 }); H.set(g, { y: g._b.y0 - 700 * (1 - k) }); }); } });
v([25, 5], { id: "pr2", sfx: [[.1, "thud"], [.4, "thud"], [.7, "thud"]],
  init(L) { this.bt = Array.from({ length: 10 }, (_, i) => { const b = K3.bottle2(L.mid, [Q.green, Q.blue, "#D8C79E", Q.pink, "#C8A060"][i % 5], "", .85); H.set(b, { x: 170 + (i % 5) * 185, y: 640 + Math.floor(i / 5) * 330 }); return b; }); },
  update(t, p, d, L) { zoom(L, p, 1, 1.05); this.bt.forEach((b, i) => { if (b._y0 === undefined) b._y0 = b._b.y; const k = E.out(seg(p, .04 + i * .07, .2 + i * .07)); H.set(b, { y: b._y0 - 900 * (1 - k), o: p > .04 + i * .07 ? 1 : 0 }); }); } });
v([25, 9], { id: "pr3", sfx: [[.1, "pop"], [.4, "stamp"], [.7, "ding", 0]],
  init(L) { this.sg = K3.sign(L.fg, "€ € €", 540, 420, { size: 220, maxw: 760, fill: "#F3E6C8", ink: Q.red }); this.w = K3.wallet(L.mid); H.set(this.w, { x: 540, y: 1000, s: 1.1 }); this.cn = Array.from({ length: 6 }, (_, i) => K3.coin(L.fg, 56)); },
  update(t, p, d, L) { zoom(L, p); ent(this.sg, p, .02, .2, 0, -800); swing(this.sg, t); this.cn.forEach((c, i) => { const k = seg(p, .25 + i * .07, .6 + i * .07); H.set(c, { x: 540 + (i - 2.5) * 70, y: lerp(900, 1500, E.in(k)) - 260 * Math.sin(k * 3.14), o: k > 0 && k < 1 ? 1 : 0, r: k * 360 }); }); } });
v([26, 0], { id: "pr4", sfx: [[.1, "tear"], [.3, "whoosh"], [.55, "stamp"], [.75, "ding", 2]],
  init(L) { this.lf = K3.leafBurst(L.bg, 12, 330); this.bt = bottle(L.mid, 1.45); this.sg = K3.sign(L.fg, "SÉRUM ANTI-TACHES", 540, 340, { size: 82, maxw: 860 }); this.sp = [0, 1, 2, 3, 4, 5, 6, 7].map(i => { const g = H.grp(L.fg, 0, 0, { j: .3 }); H.poly(g, [[-30, -400], [30, -400], [90, 400], [-90, 400]], i % 2 ? "#2A211D" : "#EFE6D2", { jit: 3, seed: i + 2, th: 5 }); return g; }); },
  update(t, p, d, L) { zoom(L, p, 1, 1.05); const k = E.out(seg(p, .12, .5)); this.sp.forEach((g, i) => H.set(g, { x: 540 + (i < 4 ? -1 : 1) * (40 + (i % 4) * 130) * (0.3 + 2.2 * k), y: 960, r: (i < 4 ? -1 : 1) * (14 + (i % 4) * 14) * k, o: 1 - seg(p, .6, .8) })); H.set(this.lf, { x: 540, y: 960, r: t * 5, s: E.pop(seg(p, .3, .6)), o: p > .3 ? 1 : 0 }); H.set(this.bt, { x: 540, y: 960 + Math.sin(t * 2.6) * 8, s: E.pop(seg(p, .1, .4)) * 1.45 }); ent(this.sg, p, .45, .6, 0, -500); swing(this.sg, t); } });
v([26, 8], { id: "pr5", sfx: [[.15, "slide"], [.3, "slide"], [.45, "slide"], [.6, "slide"], [.8, "ding", 2]],
  init(L) { this.bt = bottle(L.mid, 1.45); H.set(this.bt, { x: 540, y: 1000 }); this.tg = ["AZÉLAÏQUE", "ARBUTINE", "TRANÉXAMIQUE", "NIACINAMIDE"].map((tx, i) => K3.sign(L.fg, tx, 540, 600 + i * 150, { size: 44, maxw: 340 })); },
  update(t, p, d, L) { zoom(L, p); this.tg.forEach((g, i) => { if (g._sx === undefined) { g._sx = [300, 780, 300, 780][i]; g._sy = [420, 520, 1040, 1120][i]; } const k = E.in(seg(p, .15 + i * .15, .35 + i * .15)); H.set(g, { x: lerp(g._sx, 540, k), y: lerp(g._sy, 1000, k), s: 1 - .5 * k, o: k < .98 ? 1 : 0, r: 0 }); }); } });
v([27, 0], { id: "q1", sfx: [[.1, "paper"], [.3, "tick"], [.5, "tick"], [.7, "tick"], [.9, "ding", 2]],
  init(L) { this.sg = K3.sign(L.fg, "94 %", 540, 330, { size: 200, maxw: 560 }); this.dd = Array.from({ length: 100 }, (_, i) => K.dude(L.mid, 200 + (i % 10) * 76, 520 + Math.floor(i / 10) * 76, i < 94 ? "#4E7F55" : "#A9A08A", .95)); },
  update(t, p, d, L) { zoom(L, p); ent(this.sg, p, .02, .2, 0, -700); swing(this.sg, t); this.dd.forEach((g, i) => pp(g, p, .06 + i * .007, .14 + i * .007)); } });
v([28, 4], { id: "o1", sfx: [[.1, "pop"], [.35, "thud"], [.6, "thud"]],
  init(L) { this.b = [0, 1].map(i => bottle(L.mid, 1.15)); },
  update(t, p, d, L) { zoom(L, p); this.b.forEach((g, i) => { const a = E.back(seg(p, .1 + i * .25, .3 + i * .25)); H.set(g, { x: 340 + i * 400, y: lerp(2200, 1000, a), r: (i ? 1 : -1) * 2 }); }); } });
v([28, 9], { id: "o2", sfx: [[.1, "whoosh"], [.35, "stamp"], [.6, "ding", 2]],
  init(L) { this.b = [0, 1, 2].map(i => bottle(L.mid, .95)); this.tg = K3.sign(L.fg, "OFFERT", 810, 560, { size: 64, maxw: 300, fill: Q.red }); this.pl = [0, 1].map(i => { const g = H.grp(L.fg, 440 + i * 410 - 200 + 80, 1000, { j: .5 }); H.rrect(g, -30, -8, 60, 16, Q.red, { r: 5, jit: 0, sh: false, th: 0 }); H.rrect(g, -8, -30, 16, 60, Q.red, { r: 5, jit: 0, sh: false, th: 0 }); return g; }); },
  update(t, p, d, L) { zoom(L, p); this.b.forEach((g, i) => { const a = E.back(seg(p, .05 + (i === 2 ? .3 : 0), .25 + (i === 2 ? .3 : 0))); H.set(g, { x: 220 + i * 320, y: lerp(2200, 1000, a), r: (i - 1) * 2 }); }); ent(this.tg, p, .5, .65, 0, -500); swing(this.tg, t); } });
v([29, 0], { id: "s1", sfx: [[.1, "pop"], [.4, "ding", 1]],
  init(L) { this.sh = K3.shield(L.mid, 1.4, "#D8B77A"); H.set(this.sh, { x: 540, y: 900 }); this.ck = K3.checkMark(L.fg, 120); this.q = K.q(L.fg, .55); },
  update(t, p, d, L) { zoom(L, p); H.set(this.sh, { s: E.pop(seg(p, .05, .3)) }); H.set(this.ck, { x: 400, y: 900, s: E.pop(seg(p, .3, .5)), o: p > .3 ? 1 : 0 }); H.set(this.q, { x: 700, y: 880 + Math.sin(t * 4) * 8, s: E.pop(seg(p, .45, .65)) * .55, o: p > .45 ? 1 : 0, r: 8 }); } });
v([30, 0], { id: "s2", sfx: [[.1, "stamp"], [.4, "ding", 2]],
  init(L) { this.ck = K3.checkMark(L.mid, 260); },
  update(t, p, d, L) { zoom(L, p, 1, 1.08); H.set(this.ck, { x: 540, y: 880, s: E.pop(seg(p, .08, .35)) }); } });
v([30, 12], { id: "s3", sfx: [[.1, "paper"], [.35, "stamp"], [.6, "ding", 2]],
  init(L) { this.sg = K3.sign(L.fg, "90 JOURS", 540, 340, { size: 160, maxw: 760 }); this.sc = H.grp(L.mid, 540, 1000, { j: .4 }); H.circ(this.sc, 0, 0, 330, "#A9482F", { sh: "sh2", th: 14 }); H.circ(this.sc, 0, 0, 290, "#C9633F", { sh: false, th: 0 }); H.circ(this.sc, 0, 0, 200, "#F3E6C8", { sh: "sh1", th: 8 }); H.circ(this.sc, 0, 0, 160, "#8B5A35", { sh: false, th: 0 }); H.circ(this.sc, -40, -40, 70, "#A9754A", { sh: false, th: 0, attr: { opacity: .6 } }); this.hd = H.grp(this.sc, 260, 0, { j: .4 }); H.rrect(this.hd, 0, -60, 150, 120, "#F3E6C8", { r: 40, jit: 0, th: 8 }); },
  update(t, p, d, L) { zoom(L, p); ent(this.sg, p, .02, .22, 0, -800); swing(this.sg, t); H.set(this.sc, { s: E.pop(seg(p, .1, .4)) }); } });
v([31, 0], { id: "s4", sfx: [[.1, "pop"], [.4, "stamp"]],
  init(L) { this.b = setHero(L, 0); this.dt = K3.dot(this.b.sc, -100, -50, 16, 4); },
  update(t, p, d, L) { zoom(L, p, 1, 1.07); pp(this.dt, p, .3, .45); } });
v([31, 7], { id: "s5", sfx: [[.15, "flip"], [.4, "flip"], [.65, "flip"], [.85, "ding", 1]],
  init(L) { this.cs = [0, 1, 2].map(i => { const g = calCard(L.mid, 3 + i, 230 + i * 310, 900, i === 0); H.set(g, { s: 1.35 }); return g; }); this.ar = [0, 1].map(i => K.arrow(L.fg, 330 + i * 310, 900, 400 + i * 310, 900, Q.red, 36)); },
  update(t, p, d, L) { zoom(L, p); this.cs.forEach((g, i) => pp(g, p, .05 + i * .25, .2 + i * .25)); this.cs.forEach(g => { H.set(g, { s: g._b.sx }); }); } });
v([31, 11], { id: "s6", sfx: [[.1, "pop"], [.3, "ding", 0], [.6, "ding", 1]],
  init(L) { this.w = K3.wallet(L.mid); H.set(this.w, { x: 540, y: 1100, s: 1.2 }); this.cn = Array.from({ length: 7 }, (_, i) => K3.coin(L.fg, 56)); this.bl = [0, 1].map(i => { const g = H.grp(L.fg, 0, 0, { j: .6 }); H.rrect(g, -110, -55, 220, 110, "#CFE3C0", { r: 12, jit: 0, th: 6 }); H.circ(g, 0, 0, 30, Q.green, { sh: false, th: 0 }); return g; }); },
  update(t, p, d, L) { zoom(L, p); this.cn.forEach((c, i) => { const k = seg(p, .1 + i * .08, .5 + i * .08); H.set(c, { x: 540 + (i - 3) * 90, y: lerp(1050, 300, E.out(k)) + 120 * Math.sin(k * 3.14), o: k > 0 ? 1 : 0, r: k * 540 }); }); this.bl.forEach((g, i) => { const k = E.out(seg(p, .2 + i * .15, .6 + i * .15)); H.set(g, { x: 540 + (i ? 150 : -150), y: lerp(1050, 720, k), r: (i ? 12 : -12), o: p > .2 + i * .15 ? 1 : 0 }); }); } });
v([32, 0], { id: "cta", sfx: [[.05, "whoosh"], [.3, "stamp"], [.5, "pop"], [.8, "ding", 2]],
  init(L) { this.lf = K3.leafBurst(L.bg, 12, 330); this.bt = bottle(L.mid, 1.3); this.bn = K3.sign(L.fg, "COMMANDER", 540, 1560, { size: 110, maxw: 800, fill: Q.cream, ink: Q.red }); this.ar = K.arrow(L.fg, 540, 1640, 540, 1740, Q.red, 50); },
  update(t, p, d, L) { zoom(L, p); H.set(this.lf, { x: 540, y: 880, r: t * 5, s: E.pop(seg(p, .05, .3)) }); H.set(this.bt, { x: 540, y: 880 + Math.sin(t * 2.6) * 10, r: Math.sin(t * 2) * 2.5, s: E.pop(seg(p, .05, .3)) * 1.3 }); ent(this.bn, p, .3, .5, 0, 700); swing(this.bn, t); H.set(this.ar, { x: 540, y: 1640 + Math.sin(t * 7) * 12, o: seg(p, .45, .6) }); } });
v(null, { id: "end", sfx: [[.05, "stamp"], [.25, "ding", 2]],
  init(L) { this.bt = bottle(L.mid, 1.2); this.sg = K3.sign(L.fg, "MELA SKIN", 540, 1180, { size: 110, maxw: 800 }); },
  update(t, p, d, L) { zoom(L, p); H.set(this.bt, { x: 540, y: 700, s: E.pop(seg(p, .05, .3)) }); ent(this.sg, p, .1, .3, 0, -900); swing(this.sg, t); } });
