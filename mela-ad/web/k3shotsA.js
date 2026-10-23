/* Corps v3 — rendu « Cloudless » : une illustration littérale par idée de la voix. at = [phrase, mot] */
const V = [], v = (at, o) => V.push(Object.assign(o, { at }));
const AT = (s, w) => ALLWORDS[s][w].start, loc = (self, s, w) => AT(s, w) - self._start;
const pp = K.pop, TONE = K3.chips;
const ent = (g, p, a, b, dx = 0, dy = 0) => { if (g._hx === undefined) { g._hx = g._b.x; g._hy = g._b.y; } const k = E.out(seg(p, a, b)); H.set(g, { x: g._hx + dx * (1 - k), y: g._hy + dy * (1 - k), o: p > a ? 1 : 0 }); };
const swing = (g, t, a = 1.2) => H.set(g, { r: Math.sin(t * 2.1) * a });
const sps = (b, p, a, step = .06) => b.sp.forEach((d, i) => pp(d, p, a + i * step, a + i * step + .12));
/* décor de salle de bains réutilisable (fond) */
const bathBG = (L, o = {}) => { K3.towel(L.bg, o.tx || 130, 120); K3.plant(L.bg, o.px || 940, 1560, 1.0); const sh = K3.shelf(L.bg, 800, 300, 340); const items = [K3.bottle2(L.bg, Q.green, "", .42), K3.bottle2(L.bg, Q.blue, "", .38), K3.bottle2(L.bg, "#D8C79E", "", .4)]; items.forEach((b, i) => H.set(b, { x: 700 + i * 100, y: 250 })); };
const ptSil = (L, x, y, s, pose, flip) => K3.person(L.mid, x, y, s, { flip, pose });

/* ---- intro ---- */
v([0, 0], { id: "five", sfx: [[.05, "paper"], [.2, "stamp"], [.55, "pop"]],
  init(L) { bathBG(L); this.mr = K3.mirror(L.bg, 250, 640, 240, 320, { round: true }); this.sg = K3.sign(L.fg, "5\nRAISONS", 470, 520, { size: 140 }); this.b = K3.bust(L.mid, 720, 1080, .82, { spots: 8 }); },
  update(t, p, d, L) { H.look(L, 0, 0, lerp(1, 1.06, p)); ent(this.sg, p, .02, .24, 0, -900); swing(this.sg, t); ent(this.b, p, .05, .3, 0, 500); this.b.sp.forEach(q => H.set(q, { s: 1 })); } });
v([0, 2], { id: "patch", sfx: [[.05, "paper"], [.3, "pop"], [.4, "pop"], [.5, "pop"], [.6, "pop"], [.75, "stamp"]],
  init(L) { this.b = K3.bust(L.mid, 676, 885, 1.7, { spots: 8 }); this.sg = K3.sign(L.fg, "HYPERPIGMENTATION", 540, 330, { size: 68, maxw: 820 }); K3.sparks(L.bg, 8, 3); },
  update(t, p, d, L) { H.look(L, 0, 0, lerp(1, 1.05, p)); this.b.sp.forEach((q, i) => pp(q, p, .1 + i * .06, .22 + i * .06)); const k = H.clamp((t - loc(this, 0, 6) + .1) / .35); H.set(this.sg, { y: lerp(-500, 330, E.out(k)), o: t > loc(this, 0, 6) - .15 ? 1 : 0 }); swing(this.sg, t); } });
v([0, 7], { id: "notgo", sfx: [[.05, "paper"], [.15, "rub"], [.45, "rub"], [.72, "stamp"]],
  init(L) { this.b = K3.bust(L.mid, 676, 885, 1.7, { spots: 8 }); this.ar = K3.arm(L.fg, [[1000, 1900], [900, 1500], [700, 1000]], 96); this.pd = K3.pad(this.ar, 0, 0, 74); this.cr = K.cross(L.fg, 800, 520, 150); this.sg = K3.sign(L.fg, "NE PART PAS", 540, 330, { size: 86, maxw: 800 }); },
  update(t, p, d, L) { H.look(L, 0, 0, lerp(1, 1.04, p)); const r = seg(p, .1, .85), c = K3.bpt(this.b, -80, -20), ox = Math.sin(r * 22) * 60, oy = Math.cos(r * 15) * 28, hx = c[0] + ox, hy = c[1] + oy; this.ar.set([[1050, 1950], [930, 1500], [hx, hy]]); H.set(this.pd, { x: hx - 20, y: hy - 4 }); pp(this.cr, p, .55, .7); ent(this.sg, p, .02, .2, 0, -500); swing(this.sg, t); } });

/* ---- 1 · surface ---- */
v([1, 0], { id: "r1", sfx: [[.05, "paper"], [.2, "pop"], [.4, "rub"], [.7, "rub"]],
  init(L) { bathBG(L); K3.sink(L.bg, 740, 1480, .95); this.mr = K3.mirror(L.bg, 760, 760, 300, 420); this.sg = K3.sign(L.fg, "1", 200, 380, { size: 170, maxw: 220 }); this.pe = K3.person(L.mid, 380, 1520, .98, { pose: { armF: [[-70, -560], [-76, -690]], armB: [[36, -490], [40, -400]] } }); this.pd = K3.pad(L.mid, 0, 0, 30); this.zm = K3.mirror(L.fg, 880, 1250, 190, 190, { round: true, frame: Q.blueD }); this.zb = K3.bust(this.zm, 20, 120, .26, { spots: 8 }); },
  update(t, p, d, L) { H.look(L, 0, 0, lerp(1, 1.05, p)); ent(this.sg, p, .02, .2, 0, -800); swing(this.sg, t); ent(this.pe, p, .05, .25, -400, 0); const r = seg(p, .3, .95), hx = 380 - 76 * .98 - 6 + Math.sin(r * 24) * 14, hy = 1520 - 690 * .98 + Math.cos(r * 17) * 8; H.set(this.pd, { x: hx - 14, y: hy, o: p > .2 ? 1 : 0 }); } });
v([1, 8], { id: "r1b", sfx: [[.05, "paper"], [.3, "slide"], [.5, "slide"]],
  init(L) { K3.sparks(L.bg, 6, 4); this.mc = K3.macro(L.mid, 720); this.pd = K3.pad(L.fg, 0, 0, 60); this.sg = K3.sign(L.fg, "LA SURFACE", 540, 360, { size: 90, maxw: 760 }); this.ar = K.arrow(L.fg, 540, 450, 540, 700, Q.red, 56); },
  update(t, p, d, L) { H.look(L, 0, 0, lerp(1, 1.05, p)); ent(this.sg, p, .02, .2, 0, -700); swing(this.sg, t); const r = seg(p, .15, .95); H.set(this.pd, { x: 540 + Math.sin(r * 20) * 360, y: 690, o: r > 0 ? 1 : 0 }); H.set(this.ar, { sy: E.out(seg(p, .15, .3)), o: p > .15 ? 1 : 0 }); this.mc.cells.forEach((c, i) => H.set(c.q, { s: 1 + .05 * Math.sin(t * 6 + i) })); } });
v([1, 11], { id: "r1c", sfx: [[.05, "paper"], [.25, "pop"], [.45, "pop"], [.7, "ding", 1]],
  init(L) { this.mc = K3.macro(L.mid, 700); this.dots = Array.from({ length: 14 }, (_, i) => K3.dot(L.mid, 0, 0, 16, i + 3)); this.sg = K3.sign(L.fg, "SOUS TA PEAU", 540, 330, { size: 96, maxw: 780 }); this.ar = K.arrow(L.fg, 540, 450, 540, 960, Q.red, 62); this.sp = K3.dot(L.mid, 540, 740, 6, 5); },
  update(t, p, d, L) { H.look(L, 0, 0, lerp(1.0, 1.1, p)); ent(this.sg, p, .02, .18, 0, -700); swing(this.sg, t); H.set(this.ar, { sx: E.out(seg(p, .15, .35)), o: p > .15 ? 1 : 0 }); this.mc.cells.forEach((c, i) => H.set(c.q, { s: 1 + .1 * Math.sin(t * 12 + i) })); this.dots.forEach((q, i) => { const ph = (t * .55 + i / 14) % 1, on = i / 14 < seg(p, .1, .5); H.set(q, { x: 120 + (i % 5) * 210 + Math.sin(i + t * 2) * 30, y: lerp(1010, 760, E.out(ph)), s: on ? .4 + .6 * Math.min(1, ph * 3) : 0, o: on && ph < .96 ? 1 : 0 }); }); H.set(this.sp, { s: lerp(.4, 6, E.out(seg(p, .4, 1))), o: p > .4 ? 1 : 0 }); } });

/* ---- 2 · tu les caches ---- */
v([2, 0], { id: "r2", sfx: [[.05, "paper"], [.2, "pop"], [.4, "pop"]],
  init(L) { bathBG(L); K3.sink(L.bg, 740, 1480, .95); this.mr = K3.mirror(L.bg, 760, 760, 300, 420); this.sg = K3.sign(L.fg, "2", 200, 380, { size: 170, maxw: 220 }); this.pe = K3.person(L.mid, 380, 1520, .98, { pose: { armF: [[-50, -540], [-50, -660]], armB: [[36, -490], [40, -400]] } }); },
  update(t, p, d, L) { H.look(L, 0, 0, lerp(1, 1.05, p)); ent(this.sg, p, .02, .2, 0, -800); swing(this.sg, t); ent(this.pe, p, .05, .25, -400, 0); } });
v([2, 3], { id: "r2b", sfx: [[.08, "tap"], [.2, "tap"], [.32, "tap"], [.44, "tap"], [.6, "rub"], [.8, "rub"]],
  init(L) { this.b = K3.bust(L.mid, 676, 885, 1.7, { spots: 8 }); this.cv = this.b.sp.map(d => { const g = H.grp(this.b.sc, d._b.x, d._b.y, { j: .3 }); H.blob(g, 0, 0, 38, 32, "#D8A67B", { n: 12, jit: .1, seed: 7, th: 3, sh: "sh1" }); return g; }); this.ar = K3.arm(L.fg, [[1000, 1900], [900, 1500], [700, 1000]], 96); this.sp = K.sponge(this.ar); this.pm = K.pump(L.fg); this.sg = K3.sign(L.fg, "FOND DE TEINT", 540, 330, { size: 80, maxw: 800 }); },
  update(t, p, d, L) { H.look(L, 0, 0, lerp(1, 1.05, p)); ent(this.sg, p, .02, .16, 0, -500); swing(this.sg, t); H.set(this.pm, { x: 170, y: 1480, r: -14, s: 1.5 }); const r = seg(p, .15, .9), n = this.cv.length, idx = Math.min(n - 1, Math.floor(r * n)), tgt = K3.bpt(this.b, this.b.sp[idx]._b.x, this.b.sp[idx]._b.y), dab = Math.abs(Math.sin(r * n * Math.PI)); this.ar.set([[1050, 1950], [930, 1500], [tgt[0] + 20, tgt[1] + 20 - dab * 30]]); H.set(this.sp, { x: tgt[0] - 10, y: tgt[1] + 30 - dab * 30, s: 1.4 }); this.cv.forEach((g, i) => pp(g, r, i / n, i / n + .1)); } });
v([2, 7], { id: "r2c", sfx: [[.1, "pop"], [.25, "pop"], [.4, "pop"], [.55, "pop"], [.7, "pop"]],
  init(L) { K3.sparks(L.bg, 10, 6); this.sg = K3.sign(L.fg, "MAQUILLAGE", 540, 330, { size: 92, maxw: 800 }); this.it = [K.compact(L.mid, 150), K.sponge(L.mid), K.pump(L.mid), (() => { const g = H.grp(L.mid, 0, 0, { j: .5 }); H.rrect(g, -160, -30, 320, 60, "#7A4A2A", { r: 28, jit: 0 }); H.blob(g, 150, 0, 40, 34, "#E0B785", { th: 4 }); return g; })(), (() => { const g = H.grp(L.mid, 0, 0, { j: .5 }); H.rrect(g, -30, -150, 60, 220, Q.red, { r: 22, jit: 0 }); H.rrect(g, -38, 60, 76, 70, Q.blk2, { r: 8, jit: 0 }); return g; })(), K3.pad(L.mid, 0, 0, 70)]; this.it.forEach((g, i) => { g._p = [[360, 760, 8], [700, 640, -10], [220, 1160, -16], [760, 1010, 24], [880, 1300, 12], [470, 1380, 0]][i]; }); },
  update(t, p, d, L) { H.look(L, 0, 0, lerp(1, 1.05, p)); ent(this.sg, p, .02, .16, 0, -500); swing(this.sg, t); this.it.forEach((g, i) => { const a = E.back(seg(p, .1 + i * .1, .25 + i * .1)); H.set(g, { x: g._p[0], y: lerp(g._p[1] - 500, g._p[1], a), r: g._p[2], o: a > 0 ? 1 : 0 }); }); } });
v([2, 9], { id: "r2d", sfx: [[.1, "tear"], [.3, "pop"], [.5, "stamp"]],
  init(L) { this.b = K3.bust(L.mid, 676, 885, 1.7, { spots: 8 }); this.fl = H.grp(L.fg, 0, 0, { j: .4 }); H.torn(this.fl, -150, -110, 300, 220, "#D8A67B", { seed: 6, th: 7 }); this.sg = K3.sign(L.fg, "ELLES RESTENT", 540, 330, { size: 86, maxw: 800, fill: Q.red }); },
  update(t, p, d, L) { H.look(L, 0, 0, lerp(1, 1.04, p)); const c = K3.bpt(this.b, -70, -40), a = E.io(seg(p, .15, .6)); H.set(this.fl, { x: c[0] + a * 320, y: c[1] - a * 420, r: a * 40, o: a < 1 ? 1 : 0 }); this.b.sp.forEach((q, i) => H.set(q, { s: 1 + .08 * Math.sin(t * 6 + i) })); ent(this.sg, p, .35, .5, 0, -500); swing(this.sg, t); } });
