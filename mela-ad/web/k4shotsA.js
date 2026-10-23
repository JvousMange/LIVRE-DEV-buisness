/* k4 · A : intro + 5 raisons + « le problème est en dessous ». at = [phrase, mot] */
const V = [], v = (at, o) => V.push(Object.assign(o, { at }));
const AT = (s, w) => ALLWORDS[s][w].start, loc = (self, s, w) => AT(s, w) - self._start;
const pp = K.pop;
const ent = (g, p, a, b, dx = 0, dy = 0) => { if (g._hx === undefined) { g._hx = g._b.x; g._hy = g._b.y; } const k = E.out(seg(p, a, b)); H.set(g, { x: g._hx + dx * (1 - k), y: g._hy + dy * (1 - k), o: p > a ? 1 : 0 }); };
const swing = (g, t, a = 1.2) => H.set(g, { r: Math.sin(t * 2.1) * a });
const zoom = (L, p, a = 1, b = 1.05) => H.look(L, 0, 0, lerp(a, b, p));
const bath = (L, o = {}) => { K3.towel(L.bg, 140, 140); K3.plant(L.bg, 950, 1560, 1.0); K3.sink(L.bg, 760, 1500, .95); K3.mirror(L.bg, 760, 800, 300, 420); };
const dotsAppear = (b, p, a, step = .05) => b.sp.forEach((d, i) => pp(d, p, a + i * step, a + i * step + .12));
const pressed = (g, t, f = 8, a = 8) => H.set(g, { y: g._b.y0 + Math.sin(t * f) * a });
const setHero = (L, spots = 8) => K3.bust(L.mid, 676, 885, 1.7, { spots });

/* ---- intro ---- */
v([0, 0], { id: "t1", sfx: [[.05, "paper"], [.25, "stamp"], [.55, "pop"]],
  init(L) { this.sg = K3.sign(L.fg, "5 RAISONS", 540, 380, { size: 150, maxw: 860 }); this.b = K3.bust(L.mid, 690, 1240, 1.15, { spots: 8 }); K3.towel(L.bg, 140, 140); },
  update(t, p, d, L) { zoom(L, p); ent(this.sg, p, .02, .24, 0, -900); swing(this.sg, t); ent(this.b, p, .05, .3, 0, 500); dotsAppear(this.b, p, .3, .06); } });
v([0, 6], { id: "t3", sfx: [[.05, "paper"], [.15, "rub"], [.45, "rub"], [.72, "stamp"]],
  init(L) { this.b = setHero(L); this.ar = K3.arm(L.fg, [[1000, 1900], [900, 1500], [700, 1000]], 96); this.pd = K3.pad(this.ar, 0, 0, 74); this.cr = K.cross(L.fg, 820, 560, 150); },
  update(t, p, d, L) { zoom(L, p); const r = seg(p, .1, .85), c = K3.bpt(this.b, -80, -20), hx = c[0] + Math.sin(r * 22) * 60, hy = c[1] + Math.cos(r * 15) * 28; this.ar.set([[1050, 1950], [930, 1500], [hx, hy]]); H.set(this.pd, { x: hx, y: hy }); pp(this.cr, p, .62, .76); } });

/* ---- 1 · la surface ---- */
v([1, 0], { id: "r1", sfx: [[.05, "paper"], [.2, "pop"], [.4, "rub"], [.7, "rub"]],
  init(L) { bath(L); this.sg = K3.sign(L.fg, "1", 220, 380, { size: 190, maxw: 230 }); this.pe = K3.person(L.mid, 400, 1700, 1.45, { pose: { armF: [[-70, -560], [-76, -690]], armB: [[36, -490], [40, -400]] } }); this.pd = K3.pad(L.mid, 0, 0, 44); },
  update(t, p, d, L) { zoom(L, p); ent(this.sg, p, .02, .2, 0, -800); swing(this.sg, t); ent(this.pe, p, .05, .25, -400, 0); const r = seg(p, .3, .95), hx = 400 - 76 * 1.45 - 6 + Math.sin(r * 24) * 16, hy = 1700 - 690 * 1.45 + Math.cos(r * 17) * 10; H.set(this.pd, { x: hx - 16, y: hy, o: p > .2 ? 1 : 0 }); } });
v([1, 8], { id: "r1b", sfx: [[.05, "paper"], [.3, "slide"], [.5, "slide"]],
  init(L) { this.S = K4.skin(L.mid, 560); this.G = K4.grains(this.S, L.mid, 3); this.pd = K3.pad(L.fg, 0, 0, 78); this.ar = K.arrow(L.fg, 540, 250, 540, 480, Q.red, 56); },
  update(t, p, d, L) { zoom(L, p, 1, 1.05); K4.rise(this.S, this.G, t * .4, 1, this.S.y0 + 240); const r = seg(p, .12, .95); H.set(this.pd, { x: 540 + Math.sin(r * 18) * 360, y: this.S.y0 - 30, o: r > 0 ? 1 : 0 }); } });
v([1, 13], { id: "r1c", sfx: [[.05, "paper"], [.35, "tear"], [.55, "stamp"]],
  init(L) { this.S = K4.skin(L.mid, 760); this.G = K4.grains(this.S, L.mid, 4); this.F = null; this.ar = K.arrow(L.fg, 540, 280, 540, 700, Q.red, 62); },
  update(t, p, d, L) { zoom(L, p, 1, 1.06); const k = E.out(seg(p, .12, .45)); H.set(this.S.lid, { y: -300 * k, r: -4 * k, x: 80 * k }); K4.rise(this.S, this.G, t, .9, this.S.y0 + 120 - 300 * k, seg(p, .2, .4)); H.set(this.ar, { y: 280 + Math.sin(t * 6) * 10, o: seg(p, .4, .55) }); } });

/* ---- 2 · tu les caches ---- */
v([2, 0], { id: "r2", sfx: [[.05, "paper"], [.2, "pop"], [.4, "pop"]],
  init(L) { bath(L); this.sg = K3.sign(L.fg, "2", 220, 380, { size: 190, maxw: 230 }); this.pe = K3.person(L.mid, 400, 1700, 1.45, { pose: { armF: [[-50, -540], [-52, -664]], armB: [[36, -490], [40, -400]] } }); this.sp = K.sponge(L.mid); },
  update(t, p, d, L) { zoom(L, p); ent(this.sg, p, .02, .2, 0, -800); swing(this.sg, t); ent(this.pe, p, .05, .25, -400, 0); const r = seg(p, .3, .95); H.set(this.sp, { x: 400 - 52 * 1.45 - 6 + Math.sin(r * 20) * 12, y: 1700 - 664 * 1.45 + Math.cos(r * 14) * 8, s: .8, o: p > .2 ? 1 : 0 }); } });
v([2, 3], { id: "r2b", sfx: [[.1, "tap"], [.22, "tap"], [.34, "tap"], [.46, "tap"], [.6, "rub"], [.8, "rub"]],
  init(L) { this.b = setHero(L); this.cv = this.b.sp.map(d => { const g = H.grp(this.b.sc, d._b.x, d._b.y, { j: .3 }); H.blob(g, 0, 0, 40, 34, "#D8A67B", { n: 12, jit: .1, seed: 7, th: 3, sh: "sh1" }); return g; }); this.pm = K.sponge(L.fg); },
  update(t, p, d, L) { zoom(L, p); this.b.sp.forEach(q => H.set(q, { o: 1 })); const r = seg(p, .12, .9), n = this.cv.length; this.cv.forEach((g, i) => H.set(g, { s: E.pop(seg(r * n, i, i + .6)), o: r * n > i ? 1 : 0 })); const idx = Math.min(n - 1, Math.floor(r * n)), tg = K3.bpt(this.b, this.b.sp[idx]._b.x, this.b.sp[idx]._b.y); H.set(this.pm, { x: tg[0] + 30 + Math.sin(t * 22) * 8, y: tg[1] + 70 + Math.cos(t * 17) * 8, s: .5, r: -20, o: 1 }); } });
v([2, 12], { id: "r2c", sfx: [[.2, "tear"], [.5, "pop"], [.7, "pop"]],
  init(L) { this.b = setHero(L); this.cv = this.b.sp.map(d => { const g = H.grp(this.b.sc, d._b.x, d._b.y, { j: .3 }); H.blob(g, 0, 0, 40, 34, "#D8A67B", { n: 12, jit: .1, seed: 7, th: 3, sh: "sh1" }); return g; }); this.cr = K.cross(L.fg, 820, 560, 150); },
  update(t, p, d, L) { zoom(L, p); this.b.sp.forEach((q, i) => H.set(q, { s: 1 + .25 * E.out(seg(p, .15 + i * .04, .4 + i * .04)) })); this.cv.forEach((g, i) => H.set(g, { s: 1 - .55 * E.out(seg(p, .1 + i * .04, .35 + i * .04)), x: this.b.sp[i]._b.x - 14 * seg(p, .1, .5), o: 1 })); pp(this.cr, p, .6, .74); } });

/* ---- 3 · soins pour peaux claires ---- */
v([3, 0], { id: "r3", sfx: [[.05, "paper"], [.25, "pop"], [.5, "stamp"]],
  init(L) { this.sg = K3.sign(L.fg, "3", 220, 380, { size: 190, maxw: 230 }); K3.shelf(L.mid, 540, 980, 960); this.bx = [0, 1, 2].map(i => { const b = K3.paleBox(L.mid, .52); H.set(b, { x: 220 + i * 320, y: 840 }); return b; }); this.ch = K3.chips.map((c, i) => { const g = H.grp(L.mid, 130 + i * 164, 1260, { j: .4 }); H.rrect(g, -50, -90, 100, 180, c, { r: 12, jit: 0, th: 6 }); return g; }); this.ok = [0, 1].map(i => { const g = K3.checkMark(L.fg, 38); H.set(g, { x: 130 + i * 164, y: 1090 }); return g; }); this.no = [3, 4, 5].map(i => K.cross(L.fg, 130 + i * 164, 1260, 60)); },
  update(t, p, d, L) { zoom(L, p); ent(this.sg, p, .02, .2, 0, -800); swing(this.sg, t); this.bx.forEach((b, i) => pp(b, p, .1 + i * .1, .26 + i * .1)); this.ch.forEach((c, i) => pp(c, p, .3 + i * .05, .42 + i * .05)); this.ok.forEach((c, i) => pp(c, p, .55 + i * .06, .68 + i * .06)); this.no.forEach((c, i) => pp(c, p, .7 + i * .06, .82 + i * .06)); } });
v([4, 0], { id: "r3b", sfx: [[.05, "paper"], [.3, "slide"], [.55, "tap"]],
  init(L) { this.b = setHero(L, 3); this.jr = K.jar(L.fg, "#F2C9C0", 1.1); },
  update(t, p, d, L) { zoom(L, p); const k = E.out(seg(p, .1, .6)), tg = K3.bpt(this.b, -90, -30); H.set(this.jr, { x: lerp(1100, tg[0] + 130, k), y: lerp(1500, tg[1] + 30, k), r: lerp(40, -8, k) }); } });
v([4, 7], { id: "r3c", sfx: [[.1, "tap"], [.25, "pop"], [.45, "pop"], [.65, "pop"]],
  init(L) { this.b = setHero(L, 0); this.jr = K.jar(L.fg, "#F2C9C0", 1.1); this.sk = Array.from({ length: 8 }, (_, i) => { const g = H.grp(L.fg, 0, 0, { j: 1 }); H.poly(g, [[0, -30], [14, 14], [-14, 14]], i % 2 ? RED : REDL, { jit: 0, th: 3 }); return g; }); this.rd = H.blob(this.b.sc, -96, -40, 88, 72, RED, { n: 16, jit: .06, sh: false, th: 0, attr: { opacity: 0 } }); },
  update(t, p, d, L) { zoom(L, p, 1, 1.06); const tg = K3.bpt(this.b, -90, -30); H.set(this.jr, { x: tg[0] + 130 + Math.sin(t * 20) * 4, y: tg[1] + 30, r: -8 }); this.rd.setAttribute("opacity", (.55 * seg(p, .2, .5)).toFixed(2)); this.sk.forEach((g, i) => { const a = i / 8 * 6.283 + t * 1.2, k = seg(p, .15 + i * .04, .5 + i * .04); H.set(g, { x: tg[0] - 20 + Math.cos(a) * (60 + 70 * k), y: tg[1] + Math.sin(a) * (60 + 70 * k), r: a * 57, o: k > 0 ? 1 - seg(p, .85, 1) : 0, s: E.pop(k) }); }); } });
v([4, 10], { id: "r3d", sfx: [[.2, "tap"], [.55, "pop"], [.75, "ding", 0]],
  init(L) { this.b = setHero(L, 8); this.jr = K.jar(L.fg, "#CDE3D0", 1.1); this.q = K.q(L.fg, .5); },
  update(t, p, d, L) { zoom(L, p); const tg = K3.bpt(this.b, -90, -30); H.set(this.jr, { x: tg[0] + 130, y: tg[1] + 30, r: -8 }); pp(this.q, p, .45, .6); H.set(this.q, { x: 860, y: 520 + Math.sin(t * 4) * 12, r: 12 }); } });

/* ---- 4 · gommages et produits au hasard ---- */
v([5, 0], { id: "r4", sfx: [[.05, "paper"], [.2, "pop"], [.4, "rub"], [.7, "rub"]],
  init(L) { bath(L); this.sg = K3.sign(L.fg, "4", 220, 380, { size: 190, maxw: 230 }); this.pe = K3.person(L.mid, 400, 1700, 1.45, { pose: { armF: [[-70, -560], [-76, -690]], armB: [[36, -490], [40, -400]] } }); this.sp = K.sponge(L.mid); },
  update(t, p, d, L) { zoom(L, p); ent(this.sg, p, .02, .2, 0, -800); swing(this.sg, t); ent(this.pe, p, .05, .25, -400, 0); const r = seg(p, .3, .95); H.set(this.sp, { x: 400 - 76 * 1.45 - 10 + Math.sin(r * 30) * 20, y: 1700 - 690 * 1.45 + Math.cos(r * 20) * 12, s: .8, o: p > .2 ? 1 : 0 }); } });
v([5, 6], { id: "r4b", sfx: [[.1, "rub"], [.3, "rub"], [.5, "rub"], [.7, "pop"]],
  init(L) { this.b = setHero(L, 8); this.sp = K.sponge(L.fg); this.gr = Array.from({ length: 12 }, (_, i) => { const g = H.grp(L.fg, 0, 0, { j: 1 }); H.circ(g, 0, 0, 7, "#F2E2C0", { sh: "sh1", th: 2 }); return g; }); },
  update(t, p, d, L) { zoom(L, p, 1, 1.07); const tg = K3.bpt(this.b, -80, -20); H.set(this.sp, { x: tg[0] + Math.sin(t * 24) * 90, y: tg[1] + Math.cos(t * 17) * 40, s: .6, r: -20 }); this.gr.forEach((g, i) => { const ph = (t * 1.4 + i / 12) % 1; H.set(g, { x: tg[0] + Math.sin(i * 3.3) * 120, y: tg[1] + ph * 200 - 20, o: 1 - ph }); }); this.b.sp.forEach((q, i) => H.set(q, { s: 1 + .4 * E.out(seg(p, .1 + i * .03, .8)) })); } });
v([5, 10], { id: "r4c", sfx: [[.1, "slide"], [.3, "stamp"], [.45, "stamp"], [.6, "stamp"], [.75, "stamp"]],
  init(L) { this.rw = K4.xrow(L.mid, 960, 5); this.arm = H.grp(L.fg, 0, 0, { j: .3 }); H.poly(this.arm, [[60, -700], [980, 180], [940, 240], [20, -640]], "#8A5A3C", { jit: 0, th: 8 }); H.circ(this.arm, 60, -670, 40, "#6b543a", { th: 4 }); H.rrect(this.arm, 880, 170, 130, 100, "#6b543a", { r: 14, jit: 0 }); },
  update(t, p, d, L) { zoom(L, p); this.rw.it.forEach((g, i) => pp(g, p, .05 + i * .05, .18 + i * .05)); this.rw.xs.forEach((g, i) => pp(g, p, .35 + i * .12, .46 + i * .12)); H.set(this.arm, { x: lerp(-150, 0, E.out(seg(p, .0, .3))), y: lerp(-300, 0, E.out(seg(p, 0, .3))) + 110 * Math.sin(p * 6) }); } });
v([5, 15], { id: "r4d", sfx: [[.2, "pop"], [.45, "pop"], [.65, "pop"]],
  init(L) { this.b = setHero(L, 8); this.ex = Array.from({ length: 8 }, (_, i) => { const q = K3.dot(this.b.sc, -170 + (i % 4) * 78 + (i * 13) % 20, -90 + Math.floor(i / 4) * 80 + (i * 7) % 30, 9 + (i % 3) * 2, i + 30); return q; }); },
  update(t, p, d, L) { zoom(L, p, 1, 1.08); this.b.sp.forEach((q, i) => H.set(q, { s: 1.3 })); this.ex.forEach((q, i) => pp(q, p, .15 + i * .07, .3 + i * .07)); } });

/* ---- 5 · soleil, rasage, frottements ---- */
v([6, 0], { id: "r5", sfx: [[.05, "paper"], [.25, "pop"], [.5, "pop"]],
  init(L) { bath(L); this.sg = K3.sign(L.fg, "5", 220, 380, { size: 190, maxw: 230 }); this.pe = K3.person(L.mid, 400, 1700, 1.45, { pose: { armF: [[-70, -560], [-76, -690]], armB: [[36, -490], [40, -400]] } }); },
  update(t, p, d, L) { zoom(L, p); ent(this.sg, p, .02, .2, 0, -800); swing(this.sg, t); ent(this.pe, p, .05, .25, -400, 0); } });
v([6, 2], { id: "r5a", sfx: [[.1, "whoosh"], [.5, "pop"]],
  init(L) { this.b = setHero(L, 2); this.su = K3.sunBig(L.fg, 120); },
  update(t, p, d, L) { zoom(L, p); H.set(this.su, { x: lerp(1000, 800, E.out(seg(p, .05, .4))), y: lerp(100, 330, E.out(seg(p, .05, .4))), r: t * 20 }); this.b.sp.forEach((q, i) => pp(q, p, .35 + i * .08, .5 + i * .08)); } });
v([6, 3], { id: "r5b", sfx: [[.1, "slide"], [.5, "pop"]],
  init(L) { this.b = setHero(L, 5); this.rz = K.razor(L.fg, 1.2); },
  update(t, p, d, L) { zoom(L, p); const tg = K3.bpt(this.b, -60, 0), k = seg(p, .1, .8); H.set(this.rz, { x: lerp(980, tg[0] - 30, E.out(k)), y: lerp(1300, tg[1] + 180, E.out(k)) - 120 * Math.sin(k * 3.14), r: lerp(40, -28, k) }); this.b.sp.forEach((q, i) => pp(q, p, .3 + i * .06, .45 + i * .06)); } });
v([6, 4], { id: "r5c", sfx: [[.1, "rub"], [.4, "rub"], [.7, "pop"]],
  init(L) { this.b = setHero(L, 7); this.tw = K3.towel(L.fg, 0, 0, Q.blue); },
  update(t, p, d, L) { zoom(L, p); const tg = K3.bpt(this.b, -80, -20); H.set(this.tw, { x: tg[0] + 40 + Math.sin(t * 20) * 60, y: tg[1] + 90 + Math.cos(t * 14) * 30, r: -30, s: 1.1 }); this.b.sp.forEach((q, i) => pp(q, p, .25 + i * .05, .4 + i * .05)); } });
v([6, 5], { id: "r5d", sfx: [[.15, "flip"], [.35, "flip"], [.55, "flip"], [.75, "pop"]],
  init(L) { this.cal = K.calendar(L.mid); H.set(this.cal, { x: 540, y: 820, s: 1.7 }); this.rg = K.ring(L.fg, 540, 880, 160); this.dt = K3.dot(L.fg, 600, 920, 28, 3); },
  update(t, p, d, L) { zoom(L, p); this.cal.pages.forEach((g, i) => { const k = E.out(seg(p, .08 + i * .06, .24 + i * .06)); H.set(g, { y: -900 * k, r: -12 * k, o: 1 - seg(p, .1 + i * .06, .32 + i * .06) }); }); pp(this.dt, p, .6, .74); pp(this.rg, p, .65, .8); } });

/* ---- le problème est en dessous ---- */
v([7, 0], { id: "p1", sfx: [[.05, "paper"], [.3, "pop"]],
  init(L) { this.pe = K3.person(L.mid, 540, 1700, 1.5, { pose: { armF: [[-110, -560], [-250, -600]], armB: [[110, -560], [250, -600]], hy: -705 } }); this.dt = K3.dot(L.mid, 436, 745, 12, 4); },
  update(t, p, d, L) { zoom(L, p, 1, 1.04); ent(this.pe, p, .05, .3, 0, 500); swing(this.pe, t, 1.6); pp(this.dt, p, .35, .5); } });
v([7, 11], { id: "p2", sfx: [[.1, "whoosh"], [.45, "stamp"]],
  init(L) { this.S = K4.skin(L.mid, 760); this.b = setHero(L, 5); this.ar = K.arrow(L.fg, 540, 260, 540, 640, Q.red, 62); },
  update(t, p, d, L) { zoom(L, p, 1, 1.05); const k = E.out(seg(p, .05, .45)); H.set(this.b, { y: lerp(885, -900, k) }); H.set(this.S.lid, { y: lerp(900, 0, E.out(seg(p, 0, .4))) }); this.S.cg.setAttribute("opacity", seg(p, .3, .5).toFixed(2)); H.set(this.ar, { y: 260 + Math.sin(t * 6) * 10, o: seg(p, .45, .6) }); } });
v([8, 0], { id: "p3", sfx: [[.1, "ding", 1], [.5, "pop"]],
  init(L) { this.S = K4.skin(L.mid, 640); this.rg = K.ring(L.fg, 540, 962, 220, Q.cream, 12); this.ar = K.arrow(L.fg, 540, 280, 540, 640, Q.red, 62); },
  update(t, p, d, L) { zoom(L, p, 1, 1.07); H.set(this.ar, { y: 280 + Math.sin(t * 6) * 12, o: seg(p, .05, .2) }); pp(this.rg, p, .25, .45); H.set(this.rg, { r: t * 12 }); } });
