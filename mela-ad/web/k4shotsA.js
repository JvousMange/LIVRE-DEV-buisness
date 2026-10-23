/* k4 · A : intro + 5 raisons + « le problème est en dessous ». at = [phrase, mot] */
const V = [], v = (at, o) => V.push(Object.assign(o, { at }));
const AT = (s, w) => ALLWORDS[s][w].start, loc = (self, s, w) => AT(s, w) - self._start;
const pp = K.pop;
const ent = (g, p, a, b, dx = 0, dy = 0) => { if (g._hx === undefined) { g._hx = g._b.x; g._hy = g._b.y; } const k = E.out(seg(p, a, b)); H.set(g, { x: g._hx + dx * (1 - k), y: g._hy + dy * (1 - k), o: p > a ? 1 : 0 }); };
const swing = (g, t, a = 1.2) => H.set(g, { r: Math.sin(t * 2.1) * a });
const zoom = (L, p, a = 1, b = 1.05) => H.look(L, 0, 0, lerp(a, b, p));
const num = (L, n) => K3.sign(L.fg, String(n), 190, 300, { size: 120, maxw: 140 });
const FC = (L, x, y, s, o) => K4.face(L.mid, x, y, s, o);
const dotsAppear = (b, p, a, step = .05) => b.sp.forEach((d, i) => pp(d, p, a + i * step, a + i * step + .12));
const SKINC = "#A06A44";

/* ---- intro ---- */
v([0, 0], { id: "t1", sfx: [[.05, "paper"], [.25, "stamp"], [.55, "pop"]],
  init(L) { this.sg = K3.sign(L.fg, "5 RAISONS", 540, 340, { size: 150, maxw: 860 }); this.f = FC(L, 540, 860, 1.6, { spots: 8, turn: .5, tilt: 3 }); },
  update(t, p, d, L) { zoom(L, p); ent(this.sg, p, .02, .24, 0, -900); swing(this.sg, t); ent(this.f, p, .05, .3, 0, 600); dotsAppear(this.f, p, .3, .05); } });
v([0, 6], { id: "t3", sfx: [[.05, "paper"], [.15, "rub"], [.45, "rub"], [.72, "stamp"]],
  init(L) { this.f = FC(L, 540, 900, 2.5, { spots: 8, turn: -.4 }); this.pd = K3.pad(L.fg, 0, 0, 80); this.cr = K.cross(L.fg, 540, 560, 150); },
  update(t, p, d, L) { zoom(L, p); const r = seg(p, .1, .85), c = this.f.pt(88, 40); H.set(this.pd, { x: c[0] + Math.sin(r * 22) * 80, y: c[1] + Math.cos(r * 15) * 40 }); pp(this.cr, p, .62, .76); } });

/* ---- 1 · la surface (iceberg) ---- */
v([1, 0], { id: "r1", sfx: [[.05, "paper"], [.2, "rub"], [.5, "rub"], [.8, "rub"]],
  init(L) { this.I = K4.iceberg(L.mid, 500); this.pd = K3.pad(L.fg, 0, 0, 90); this.nm = num(L, 1); },
  update(t, p, d, L) { zoom(L, p, 1, 1.04); H.set(this.I.g, { y: 420 }); ent(this.nm, p, .02, .2, 0, -700); swing(this.nm, t); const r = seg(p, .2, .97); H.set(this.pd, { x: 540 + Math.sin(r * 18) * 220, y: 770, o: r > 0 ? 1 : 0 }); this.I.f.spin(t, .5); } });
v([1, 13], { id: "r1c", sfx: [[.05, "paper"], [.35, "whoosh"], [.6, "ding", 1]],
  init(L) { this.I = K4.iceberg(L.mid, 500); this.ar = K.arrow(L.fg, 700, 760, 700, 1000, Q.red, 56); },
  update(t, p, d, L) { zoom(L, p, 1, 1.05); H.set(this.I.g, { y: lerp(420, -120, E.out(seg(p, .05, .6))) }); this.I.f.spin(t, 2); this.I.f.out(t, 1.4, seg(p, .3, .5)); H.set(this.ar, { y: 560 + Math.sin(t * 6) * 10, o: seg(p, .55, .7) }); } });

/* ---- 2 · tu les caches ---- */
v([2, 0], { id: "r2", sfx: [[.1, "tap"], [.22, "tap"], [.34, "tap"], [.46, "tap"], [.6, "rub"], [.8, "rub"]],
  init(L) { this.f = FC(L, 540, 830, 1.9, { spots: 8, hair: "afro" }); this.cv = this.f.sp.map(dd => { const g = H.grp(this.f.hd, dd._b.x, dd._b.y, { j: .3 }); H.blob(g, 0, 0, 38, 32, "#D8A67B", { n: 12, jit: .1, seed: 7, th: 3, sh: "sh1" }); return g; }); this.ar = K3.arm(L.fg, [[1060, 1950], [900, 1500], [800, 1200]], 110); this.sp = K.sponge(this.ar); this.nm = num(L, 2); },
  update(t, p, d, L) { zoom(L, p); ent(this.nm, p, .02, .2, 0, -700); swing(this.nm, t); this.f.sp.forEach(q => H.set(q, { o: 1 })); const r = seg(p, .15, .92), n = this.cv.length; this.cv.forEach((g, i) => H.set(g, { s: E.pop(seg(r * n, i, i + .6)), o: r * n > i ? 1 : 0 })); const idx = Math.min(n - 1, Math.floor(r * n)), tg = this.f.pt(this.f.sp[idx]._b.x, this.f.sp[idx]._b.y), hx = tg[0] + 20 + Math.sin(t * 22) * 8, hy = tg[1] + 30 + Math.cos(t * 17) * 8; this.ar.set([[1100, 1950], [950, 1500], [hx + 40, hy + 140], [hx, hy]]); H.set(this.sp, { x: hx, y: hy, s: .8, r: -20 }); } });
v([2, 12], { id: "r2c", sfx: [[.2, "tear"], [.5, "pop"], [.7, "pop"]],
  init(L) { this.f = FC(L, 540, 830, 1.9, { spots: 8, hair: "afro" }); this.sh = H.grp(this.f.q, 0, 40, { j: .3 }); H.blob(this.sh, 0, 0, 158, 198, "#D8A67B", { n: 30, jit: .015, th: 6 }); this.cr = K.cross(L.fg, 880, 420, 130); },
  update(t, p, d, L) { zoom(L, p); const k = E.out(seg(p, .15, .6)); H.set(this.sh, { y: 40 - 700 * k, r: -18 * k, x: 120 * k, o: 1 - seg(p, .55, .7) }); pp(this.cr, p, .62, .76); } });

/* ---- 3 · soins pour peaux claires ---- */
v([3, 0], { id: "r3", sfx: [[.05, "paper"], [.25, "slide"], [.5, "slide"], [.75, "stamp"]],
  init(L) { this.ch = K3.chips.map((c, i) => { const g = H.grp(L.bg, 130 + i * 164, 420, { j: .4 }); H.rrect(g, -50, -90, 100, 180, c, { r: 12, jit: 0, th: 6 }); return g; }); this.ok = [0, 1].map(i => { const g = K3.checkMark(L.mid, 40); H.set(g, { x: 130 + i * 164, y: 600 }); return g; }); this.no = [3, 4, 5].map(i => K.cross(L.mid, 130 + i * 164, 430, 60)); this.bl = H.grp(L.mid, 540, 1130, { j: 0 }); H.rrect(this.bl, -700, 0, 1400, 70, Q.blk, { r: 8, jit: 0, sh: "sh2", th: 10 }); for (let i = 0; i < 10; i++) H.circ(this.bl, -600 + i * 140, 35, 16, "#3A2F29", { sh: false, th: 0 }); this.bx = Array.from({ length: 5 }, () => K3.paleBox(L.mid, .55)); this.nm = num(L, 3); },
  update(t, p, d, L) { zoom(L, p, 1, 1.04); ent(this.nm, p, .02, .2, 0, -700); swing(this.nm, t); this.ch.forEach((c, i) => pp(c, p, .05 + i * .05, .17 + i * .05)); this.ok.forEach((c, i) => pp(c, p, .5 + i * .05, .62 + i * .05)); this.no.forEach((c, i) => pp(c, p, .65 + i * .05, .77 + i * .05)); this.bx.forEach((b, i) => { H.set(b, { x: ((t * 230 + i * 340) % 1700) - 300, y: 1130 - 128 + Math.sin(t * 9 + i) * 2, o: 1 }); }); } });
v([4, 0], { id: "r3b", sfx: [[.05, "paper"], [.3, "slide"], [.55, "tap"]],
  init(L) { this.f = FC(L, 540, 840, 1.9, { spots: 5, hair: "bun", turn: .4 }); this.ash = H.grp(this.f.hd, 70, 62, { j: .3 }); H.blob(this.ash, 0, 0, 74, 62, "#CFC4BA", { n: 14, jit: .05, th: 0, sh: false, attr: { opacity: .0 } }); this.jr = K.jar(L.fg, "#F2C9C0", 1.3); },
  update(t, p, d, L) { zoom(L, p); const k = E.out(seg(p, .1, .55)), tg = this.f.pt(70, 62); H.set(this.jr, { x: lerp(1150, tg[0] + 120, k), y: lerp(1500, tg[1] + 20, k), r: lerp(40, -8, k) }); H.set(this.ash, { s: 1 + .1 * Math.sin(t * 3) }); const a = seg(p, .5, .8); this.ash.querySelectorAll("path").forEach(pa => pa.setAttribute("opacity", (.88 * a).toFixed(2))); this.ash.querySelectorAll("path").forEach(pa => pa.setAttribute("fill", "#D7CCC2")); } });
v([4, 7], { id: "r3c", sfx: [[.1, "tap"], [.25, "pop"], [.45, "pop"], [.65, "pop"]],
  init(L) { this.pt = K4.patch(L.mid, 540, 900, 300, 3); this.jr = K.jar(L.fg, "#F2C9C0", 1.4); this.rd = H.blob(this.pt, 0, 0, 230, 230, RED, { n: 20, jit: .05, sh: false, th: 0, attr: { opacity: 0 } }); this.sk = Array.from({ length: 10 }, (_, i) => { const g = H.grp(L.fg, 0, 0, { j: 1 }); H.poly(g, [[0, -34], [16, 16], [-16, 16]], i % 2 ? RED : REDL, { jit: 0, th: 3 }); return g; }); },
  update(t, p, d, L) { zoom(L, p, 1, 1.05); H.set(this.jr, { x: 640 + Math.sin(t * 20) * 4, y: 840, r: -8 }); this.rd.setAttribute("opacity", (.5 * seg(p, .2, .5)).toFixed(2)); this.sk.forEach((g, i) => { const a = i / 10 * 6.283 + t * 1.2, k = seg(p, .15 + i * .04, .5 + i * .04); H.set(g, { x: 540 + Math.cos(a) * (300 + 90 * k), y: 900 + Math.sin(a) * (300 + 90 * k), r: a * 57, o: k > 0 ? 1 - seg(p, .85, 1) : 0, s: E.pop(k) }); }); } });
v([4, 10], { id: "r3d", sfx: [[.2, "slide"], [.55, "pop"], [.75, "ding", 0]],
  init(L) { this.pt = K4.patch(L.mid, 540, 900, 300, 4); this.jr = K.jar(L.fg, "#CDE3D0", 1.4); this.q = K.q(L.fg, .55); },
  update(t, p, d, L) { zoom(L, p); const k = E.out(seg(p, .08, .6)); H.set(this.jr, { x: lerp(-100, 1180, k), y: 900, r: lerp(-20, 20, k) }); pp(this.q, p, .55, .7); H.set(this.q, { x: 860, y: 520 + Math.sin(t * 4) * 12, r: 12 }); } });

/* ---- 4 · gommages et produits au hasard ---- */
v([5, 0], { id: "r4", sfx: [[.05, "paper"], [.2, "rub"], [.4, "rub"], [.7, "rub"]],
  init(L) { this.pt = K4.patch(L.mid, 540, 900, 320, 4); this.sp = K.sponge(L.fg); this.gr = Array.from({ length: 14 }, () => { const g = H.grp(L.fg, 0, 0, { j: 1 }); H.circ(g, 0, 0, 8, "#F2E2C0", { sh: "sh1", th: 2 }); return g; }); this.nm = num(L, 4); },
  update(t, p, d, L) { zoom(L, p); ent(this.nm, p, .02, .2, 0, -700); swing(this.nm, t); const x = 540 + Math.sin(t * 26) * 140, y = 900 + Math.cos(t * 19) * 90; H.set(this.sp, { x, y, s: 1, r: -20, o: p > .1 ? 1 : 0 }); this.gr.forEach((g, i) => { const ph = (t * 1.4 + i / 14) % 1; H.set(g, { x: 540 + Math.sin(i * 3.3) * 220, y: 760 + ph * 330, o: p > .1 ? 1 - ph : 0 }); }); this.pt.sp.forEach((q, i) => H.set(q, { s: 1 + .5 * seg(p, .2, .9) })); } });
v([5, 10], { id: "r4b", sfx: [[.15, "stamp"], [.32, "stamp"], [.5, "stamp"], [.68, "stamp"], [.85, "stamp"]],
  init(L) { const cols = ["#F2C9C0", "#CFE0E8", "#F6E3A6", "#E9D8C8", "#CDE3D0"]; this.it = cols.map((c, i) => { const it = i % 2 ? K.tube(L.mid, c, .85) : K.jar(L.mid, c, 1.0); H.set(it, { x: 170 + i * 185, y: 950 }); return it; }); this.xs = cols.map((c, i) => K.cross(L.fg, 170 + i * 185, 940, 80)); },
  update(t, p, d, L) { zoom(L, p); this.it.forEach((g, i) => pp(g, p, .02 + i * .03, .12 + i * .03)); this.xs.forEach((g, i) => { const a = .15 + i * .17, k = E.out(seg(p, a, a + .08)); H.set(g, { s: lerp(2.2, 1, k), o: p > a ? 1 : 0, y: 940 }); }); } });
v([5, 15], { id: "r4d", sfx: [[.2, "pop"], [.45, "pop"], [.65, "pop"]],
  init(L) { this.f = FC(L, 540, 840, 1.9, { spots: 10, hair: "bob", turn: -.3 }); },
  update(t, p, d, L) { zoom(L, p, 1, 1.07); this.f.sp.forEach((q, i) => H.set(q, { s: lerp(1, 1.7, E.out(seg(p, .1 + i * .02, .5 + i * .02))) })); } });

/* ---- 5 · soleil, rasage, frottements ---- */
v([6, 0], { id: "r5", sfx: [[.1, "pop"], [.4, "pop"], [.7, "pop"]],
  init(L) { this.su = K3.sunBig(L.mid, 100); this.rz = K.razor(L.mid, 1.1); this.tw = K3.towel(L.mid, 0, 0, Q.blue); this.nm = num(L, 5); },
  update(t, p, d, L) { zoom(L, p); ent(this.nm, p, .02, .2, 0, -700); swing(this.nm, t); H.set(this.su, { x: 300, y: 700, s: E.pop(seg(p, .1, .3)) }); H.set(this.rz, { x: 780, y: 760, s: E.pop(seg(p, .3, .5)) * 1.1, r: -20 }); H.set(this.tw, { x: 540, y: 1100, s: E.pop(seg(p, .5, .7)) * 1.3, r: 10 }); } });
v([6, 2], { id: "r5a", sfx: [[.1, "whoosh"], [.5, "pop"]],
  init(L) { this.pt = K4.patch(L.mid, 540, 960, 300, 0); this.su = K3.sunBig(L.fg, 120); this.dt = K3.dot(this.pt, 0, 0, 36, 4); },
  update(t, p, d, L) { zoom(L, p); const k = E.out(seg(p, .05, .4)); H.set(this.su, { x: lerp(1000, 760, k), y: lerp(100, 400, k), r: t * 20 }); pp(this.dt, p, .35, .55); } });
v([6, 3], { id: "r5b", sfx: [[.1, "slide"], [.5, "pop"]],
  init(L) { this.lb = H.grp(L.mid, 540, 960, { j: .3 }); H.rrect(this.lb, -460, -130, 920, 260, SKINC, { r: 120, jit: 0, th: 10 }); H.blob(this.lb, -80, -60, 280, 40, "#B98258", { n: 14, jit: 0, sh: false, th: 0, attr: { opacity: .35 } }); this.dts = Array.from({ length: 6 }, (_, i) => K3.dot(this.lb, -280 + i * 110, -20 + (i % 2) * 40, 14, i + 3)); this.rz = K.razor(L.fg, 1.2); },
  update(t, p, d, L) { zoom(L, p); const k = seg(p, .1, .8); H.set(this.rz, { x: lerp(180, 900, E.out(k)), y: 960 - 40 + Math.sin(k * 20) * 5, r: -8 }); this.dts.forEach((q, i) => pp(q, p, .2 + i * .1, .3 + i * .1)); } });
v([6, 4], { id: "r5c", sfx: [[.1, "rub"], [.4, "rub"], [.7, "pop"]],
  init(L) { this.lb = H.grp(L.mid, 540, 960, { j: .3 }); H.rrect(this.lb, -460, -130, 920, 260, SKINC, { r: 120, jit: 0, th: 10 }); this.dts = Array.from({ length: 5 }, (_, i) => K3.dot(this.lb, -80 + i * 70, -10 + (i % 2) * 30, 16, i + 8)); this.st = H.grp(L.fg, 540, 960, { j: .3 }); H.rrect(this.st, -50, -230, 100, 460, Q.blk2, { r: 10, jit: 0, th: 8 }); },
  update(t, p, d, L) { zoom(L, p); H.set(this.st, { x: 540 + Math.sin(t * 16) * 70, r: 14 }); this.dts.forEach((q, i) => pp(q, p, .2 + i * .1, .3 + i * .1)); } });
v([6, 5], { id: "r5d", sfx: [[.15, "rub"], [.4, "whoosh"], [.7, "pop"], [.8, "ding", 0]],
  init(L) { this.pt = K4.patch(L.mid, 540, 1000, 280, 0); this.dt = K3.dot(this.pt, 0, 0, 44, 4); this.pd = K3.pad(L.fg, 0, 0, 80); this.bm = H.grp(L.fg, 0, 0, { j: .6 }); H.poly(this.bm, [[-90, 0], [-20, -50], [90, -40], [30, -8], [90, 40], [-20, 50]], Q.blue, { jit: 0, th: 7 }); },
  update(t, p, d, L) { zoom(L, p); const w = seg(p, .08, .3); H.set(this.pd, { x: 540 + Math.sin(w * 14) * 120, y: 1000, o: w > 0 && w < 1 ? 1 : 0 }); H.set(this.dt, { o: p < .25 ? 1 - seg(p, .12, .25) : seg(p, .75, .85), s: p < .25 ? 1 : lerp(.8, 1.5, seg(p, .75, .9)) }); const k = seg(p, .35, .8), a = k * 6.283; H.set(this.bm, { x: 540 + Math.sin(a) * 340, y: 480 + (1 - Math.cos(a)) * 130, r: a * 57, o: k > 0 && k < 1 ? 1 : 0, s: 1.5 }); } });

/* ---- le problème est en dessous ---- */
v([7, 0], { id: "p1", sfx: [[.05, "paper"], [.3, "pop"]],
  init(L) { this.f = FC(L, 540, 820, 1.6, { spots: 4, hair: "braids", turn: .3 }); this.a = [-1, 1].map(sg => K3.arm(this.f.q, [[sg * 300, 420], [sg * 520, 560], [sg * 640, 420]], 100)); this.ck = K3.checkMark(L.fg, 110); },
  update(t, p, d, L) { zoom(L, p, 1, 1.04); ent(this.f, p, .05, .3, 0, 500); swing(this.f, t, 1.2); H.set(this.ck, { x: 200, y: 500, s: E.pop(seg(p, .4, .6)), o: p > .4 ? 1 : 0 }); } });
v([7, 11], { id: "p2", sfx: [[.1, "whoosh"], [.45, "stamp"]],
  init(L) { this.I = K4.iceberg(L.mid, 500); this.ar = K.arrow(L.fg, 880, 640, 880, 940, Q.red, 62); },
  update(t, p, d, L) { zoom(L, p, 1, 1.05); H.set(this.I.g, { y: -120 }); this.I.f.spin(t, 2); this.I.f.out(t, 1.4); H.set(this.ar, { y: 500 + Math.sin(t * 6) * 10, o: seg(p, .2, .4) }); } });
v([8, 0], { id: "p3", sfx: [[.1, "ding", 1], [.5, "pop"]],
  init(L) { this.I = K4.iceberg(L.mid, 500); this.rg = K.ring(L.fg, 540, 850, 230, Q.green, 16); this.ck = K3.checkMark(L.fg, 100); },
  update(t, p, d, L) { zoom(L, p, 1, 1.06); H.set(this.I.g, { y: -120 }); this.I.f.spin(t, 2); pp(this.rg, p, .1, .3); H.set(this.rg, { r: t * 12 }); H.set(this.ck, { x: 880, y: 560, s: E.pop(seg(p, .5, .7)), o: p > .5 ? 1 : 0 }); } });
