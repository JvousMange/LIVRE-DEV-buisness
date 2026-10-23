/* k4 · B : le mécanisme (mélanine), le but (réguler), imagine, les 4 actifs */
const tiles = (L, n = 4) => null;
const wheat = (p) => { const g = H.grp(p, 0, 0, { j: .6 }); H.rrect(g, -5, -10, 10, 150, "#A98A2E", { r: 4, jit: 0, sh: false, th: 0 }); for (let i = 0; i < 6; i++) { [-1, 1].forEach(s => { const e = H.grp(g, s * 22, -90 + i * 24, { j: .3 }); e._b.r = s * 28; H.blob(e, 0, 0, 14, 26, "#E2B13C", { n: 10, jit: .05, seed: i + (s > 0 ? 3 : 9), th: 3 }); }); } H.blob(g, 0, -138, 14, 28, "#E2B13C", { n: 10, jit: .05, th: 3 }); return g; };
const berry = (p) => { const g = H.grp(p, 0, 0, { j: .6 }); [[-50, -20, -50], [50, -20, 50], [0, -60, 0]].forEach(([x, y, r], i) => { const l = H.grp(g, x, y, { j: .3 }); l._b.r = r; H.blob(l, 0, -30, 26, 56, i % 2 ? Q.green : Q.greenD, { n: 14, jit: .05, seed: i + 2, th: 4 }); }); [[-16, 30], [18, 28], [0, 60]].forEach(([x, y], i) => H.circ(g, x, y, 24, RED, { th: 5 })); return g; };
const capsule = (p) => { const g = H.grp(p, 0, 0, { j: .6 }); g._b.r = -30; H.rrect(g, -60, -26, 120, 52, "#F3E6C8", { r: 26, jit: 0, th: 6 }); H.rrect(g, 0, -26, 60, 52, Q.red, { r: 26, jit: 0, sh: false, th: 0 }); H.rrect(g, 0, -26, 28, 52, Q.red, { r: 0, jit: 0, sh: false, th: 0 }); return g; };
const hexa = (p) => { const g = H.grp(p, 0, 0, { j: .6 }); const pts = []; for (let i = 0; i < 6; i++) { const a = i / 6 * 6.283 + .5; pts.push([Math.cos(a) * 70, Math.sin(a) * 70]); } H.poly(g, pts, "#E8BE9B", { jit: 0, th: 7 }); const p2 = pts.map(q => [q[0] * .6, q[1] * .6]); H.poly(g, p2, "#CF9A72", { jit: 0, sh: false, th: 0 }); return g; };
const flame = (p) => { const g = H.grp(p, 0, 0, { j: .9 }); H.poly(g, [[0, -160], [50, -70], [70, 10], [30, 60], [-30, 60], [-70, 10], [-40, -80]], "#E0782B", { jit: 2, seed: 4, th: 6 }); H.poly(g, [[0, -70], [26, 0], [10, 40], [-10, 40], [-26, 0]], "#F5C65A", { jit: 1, sh: false, th: 0 }); return g; };
const star4 = (p, r = 40) => { const g = H.grp(p, 0, 0, { j: 1 }); H.poly(g, H.star(0, 0, r * .4, r, 4), Q.yellow, { jit: 0, th: 4 }); return g; };
const lock = (p, s = 1) => { const g = H.grp(p, 0, 0, { j: .5 }), q = H.grp(g, 0, 0, { j: 0 }); H.set(q, { s }); H.el("path", { d: "M-40,-44 V-90 A40,40 0 0 1 40,-90 V-44", stroke: Q.blk, "stroke-width": 20, fill: "none", "stroke-linecap": "round" }, q); H.rrect(q, -64, -44, 128, 108, Q.yellow, { r: 22, jit: 0 }); H.circ(q, 0, 8, 12, Q.blk, { sh: false, th: 0 }); return g; };
const strike = (L, S, kind, x) => { const g = H.grp(L.fg, 0, 0, { j: .6 }); const ic = kind === 0 ? K.pimple(g, 44) : kind === 1 ? K.razor(g, .7) : kind === 2 ? K.sun(g, 56) : null; let ic2 = ic; if (kind === 3) { ic2 = H.grp(g, 0, 0, { j: .5 }); const f = K4.fem(ic2, 34), m = K4.mal(ic2, 34); H.set(f, { x: -50 }); H.set(m, { x: 50 }); } g.ic = ic2; g.x = x; return g; };
const calCard = (p, m, x, y, ring) => { const MN = ["JAN", "FÉV", "MARS", "AVR", "MAI", "JUIN", "JUIL", "AOÛT", "SEPT", "OCT", "NOV", "DÉC"], g = H.grp(p, x, y, { j: .6 }); H.rrect(g, -100, -120, 200, 240, "#F7EFD6", { r: 12, jit: 0, th: 7 }); H.rrect(g, -100, -120, 200, 60, "#A9482F", { r: 12, jit: 0, sh: false, th: 0 }); H.txt(g, MN[m], 0, -76, 38, Q.cream, { font: "Anton, sans-serif", w: 400, ls: 3 }); for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) H.rrect(g, -78 + c * 40, -36 + r * 48, 30, 36, "#E2CFA0", { r: 6, sh: false, th: 0, jit: 0 }); if (ring) { g.rg = K.ring(g, -78 + 40 * 1 + 15, -36 + 48 + 18, 30, RED, 7); g.dt = K3.dot(g, -78 + 40 * 1 + 15, -36 + 48 + 18, 11, m + 3); } return g; };

/* ---- le mécanisme ---- */
v([10, 0], { id: "m1", sfx: [[.1, "paper"], [.3, "pop"], [.6, "pop"]],
  init(L) { this.S = K4.skin(L.mid, 640); this.G = K4.grains(this.S, L.mid, 4); },
  update(t, p, d, L) { zoom(L, p, 1, 1.06); K4.rise(this.S, this.G, t, 1, this.S.y0 + 150, seg(p, .05, .2)); this.S.cells.forEach((c, i) => H.set(c, { s: 1 + .05 * Math.sin(t * 8 + i) })); } });
v([10, 6], { id: "m1b", sfx: [[.15, "pop"], [.3, "pop"], [.45, "pop"], [.6, "pop"], [.75, "pop"]],
  init(L) { this.ch = K3.chips.map((c, i) => { const g = H.grp(L.mid, 160 + i * 150, 900, { j: .4 }); H.rrect(g, -60, -200, 120, 400, c, { r: 14, jit: 0, th: 8 }); return g; }); this.b = K3.bust(L.mid, 700, 1700, .5, { spots: 0 }); },
  update(t, p, d, L) { zoom(L, p); this.ch.forEach((g, i) => { pp(g, p, .08 + i * .12, .22 + i * .12); H.set(g, { y: 900 + 18 * Math.sin(t * 2 + i), r: Math.sin(t * 1.4 + i) * 1.5 }); }); H.set(this.b, { o: 0 }); } });
v([11, 0], { id: "m2", sfx: [[.1, "paper"], [.35, "stamp"], [.55, "ding", 1], [.7, "ding", 1]],
  init(L) { this.c = K4.chest(L.mid, 540, 420); },
  update(t, p, d, L) { zoom(L, p, 1, 1.05); const k = E.out(seg(p, .1, .35)), a = seg(p, .3, 1); H.set(this.c.dial.nd, { r: lerp(-80, 60, k) + Math.sin(t * 22) * 4 * a }); this.c.rays.forEach((r, i) => H.set(r, { o: Math.sin(t * 18 + i * 1.2) > -.2 ? 1 : .2 })); H.set(this.c.si, { r: Math.sin(t * 16) * 6 }); } });
v([11, 4], { id: "m2b", sfx: [[.1, "pop"], [.3, "pop"], [.5, "pop"], [.7, "pop"]],
  init(L) { this.S = K4.skin(L.mid, 800); this.st = [0, 1, 2, 3].map(k => strike(L, this.S, k, 180 + k * 240)); this.fl = H.grp(L.fg, 0, 0, { j: 1 }); },
  update(t, p, d, L) { zoom(L, p); const ws = [[11, 4], [11, 7], [11, 9], [11, 12]]; this.st.forEach((g, i) => { const tt = t - loc(this, ws[i][0], ws[i][1]), k = E.out(seg(tt, 0, .35)), hit = seg(tt, .35, .5); H.set(g, { x: g.x, y: lerp(260, 640, k) - 40 * Math.sin(hit * 6), o: tt > -.05 ? 1 : 0 }); H.set(g.ic, { s: tt > -.05 ? 1.15 : 0 }); const c = this.S.cells[i]; H.set(c, { s: 1 + .45 * Math.sin(hit * 3.14) * (tt > .3 ? 1 : 0) }); }); } });
v([11, 14], { id: "m2c", sfx: [[.1, "pop"], [.4, "ding", 1], [.7, "ding", 1]],
  init(L) { this.f = K4.factory(L.mid, 540, 620, 1.3); this.dl = K4.dial(L.fg, 540, 1580, 120); },
  update(t, p, d, L) { zoom(L, p, 1, 1.05); this.f.spin(t, 1 + 3 * p); this.f.out(t, 1 + 2 * p); H.set(this.dl.nd, { r: lerp(-60, 75, E.out(seg(p, .05, .5))) + Math.sin(t * 20) * 3 * p }); } });
v([11, 18], { id: "m2d", sfx: [[.1, "pop"], [.4, "stamp"]],
  init(L) { this.b = setHero(L, 8); this.rg = K.ring(L.fg, 0, 0, 160, Q.cream, 14); },
  update(t, p, d, L) { zoom(L, p, 1, 1.12); const c = K3.bpt(this.b, -80, -30); H.set(this.rg, { x: c[0], y: c[1], r: t * 18, s: lerp(2.2, 1, E.out(seg(p, .05, .45))), o: p > .05 ? 1 : 0 }); } });
v([12, 0], { id: "m3", sfx: [[.1, "paper"], [.4, "stamp"], [.6, "ding", 0]],
  init(L) { this.S = K4.skin(L.mid, 760); this.G = K4.grains(this.S, L.mid, 4); this.lk = lock(L.fg, 1.4); },
  update(t, p, d, L) { zoom(L, p); const k = E.back(seg(p, .15, .4)); H.set(this.lk, { x: 540, y: lerp(100, 700, k) }); K4.rise(this.S, this.G, t, 1, this.S.y0 + 230, 1); } });
v([13, 0], { id: "m3b", sfx: [[.1, "paper"], [.35, "pop"], [.6, "pop"]],
  init(L) { this.A = H.grp(L.mid, -20, 330, { j: 0 }); H.set(this.A, { s: .46, x: -20, y: 330 }); this.B = H.grp(L.mid, 560, 330, { j: 0 }); H.set(this.B, { s: .46 }); this.SA = K4.skin(this.A, 400); this.SB = K4.skin(this.B, 400); this.GA = K4.grains(this.SA, this.A, 1, 9); this.GB = K4.grains(this.SB, this.B, 6, 9); this.ch = [K3.chips[0], K3.chips[4]].map((c, i) => { const g = H.grp(L.fg, 270 + i * 520, 1500, { j: .4 }); H.rrect(g, -80, -80, 160, 160, c, { r: 14, jit: 0, th: 7 }); return g; }); },
  update(t, p, d, L) { zoom(L, p); K4.rise(this.SA, this.GA, t, .8, this.SA.y0 + 220, 1); K4.rise(this.SB, this.GB, t, 1.6, this.SB.y0 + 120, 1); this.ch.forEach((g, i) => pp(g, p, .1 + i * .15, .25 + i * .15)); } });
v([14, 0], { id: "m3c", sfx: [[.1, "flip"], [.3, "flip"], [.5, "flip"], [.7, "flip"], [.85, "ding", 0]],
  init(L) { this.cs = Array.from({ length: 12 }, (_, i) => calCard(L.mid, i, 215 + (i % 4) * 215, 420 + Math.floor(i / 4) * 300, true)); },
  update(t, p, d, L) { zoom(L, p, 1, 1.05); this.cs.forEach((g, i) => pp(g, p, .04 + i * .06, .14 + i * .06)); } });
v([14, 9], { id: "m3d", sfx: [[.1, "rub"], [.35, "rub"], [.6, "rub"]],
  init(L) { this.S = K4.skin(L.mid, 760); this.G = K4.grains(this.S, L.mid, 4); this.pd = K3.pad(L.fg, 0, 0, 80); },
  update(t, p, d, L) { zoom(L, p); K4.rise(this.S, this.G, t, 1, this.S.y0 + 230, 1); const r = seg(p, .08, .95); H.set(this.pd, { x: 540 + Math.sin(r * 20) * 380, y: this.S.y0 - 40, o: r > 0 ? 1 : 0 }); } });

/* ---- le but : réguler ---- */
v([15, 0], { id: "g1", sfx: [[.1, "paper"], [.4, "stamp"], [.6, "pop"]],
  init(L) { this.ch = K3.chips.map((c, i) => { const g = H.grp(L.mid, 150 + i * 156, 900, { j: .4 }); H.rrect(g, -60, -190, 120, 380, c, { r: 14, jit: 0, th: 8 }); return g; }); this.ar = K.arrow(L.fg, 880, 450, 200, 450, Q.red, 56); this.cr = K.cross(L.fg, 540, 700, 220); },
  update(t, p, d, L) { zoom(L, p); this.ch.forEach((g, i) => pp(g, p, .05 + i * .06, .17 + i * .06)); H.set(this.ar, { sx: E.out(seg(p, .3, .5)), o: p > .3 ? 1 : 0 }); pp(this.cr, p, .6, .74); } });
v([16, 0], { id: "g2", sfx: [[.15, "stamp"], [.45, "ding", 1], [.7, "ding", 2]],
  init(L) { this.dl = K4.dial(L.mid, 540, 640, 300); this.kn = H.grp(L.fg, 540, 1170, { j: .3 }); H.circ(this.kn, 0, 0, 90, Q.blk2, { sh: "sh2", th: 10 }); H.circ(this.kn, 0, 0, 62, "#4A3C34", { sh: false, th: 0 }); H.rrect(this.kn, -9, -86, 18, 70, Q.cream, { r: 6, jit: 0, sh: false, th: 0 }); },
  update(t, p, d, L) { zoom(L, p, 1, 1.04); const k = E.io(seg(p, .15, .8)); H.set(this.dl.nd, { r: lerp(75, -70, k) + Math.sin(t * 20) * 3 * (1 - k) }); H.set(this.kn, { r: lerp(60, -120, k) }); } });
v([16, 7], { id: "g3", sfx: [[.15, "thud"], [.4, "thud"], [.65, "thud"]],
  init(L) { this.dl = K4.dial(L.mid, 400, 800, 230); this.st = [0, 1, 2].map(k => strike(L, null, k, 0)); },
  update(t, p, d, L) { zoom(L, p); const ph = [.12, .38, .64]; this.st.forEach((g, i) => { const tt = (p - ph[i]) * d, k = E.out(seg(tt, 0, .35)); H.set(g, { x: lerp(1100, 600, k), y: 800, o: tt > -.05 && tt < .6 ? 1 : 0 }); H.set(g.ic, { s: 1 }); }); const hit = ph.reduce((a, q) => a + Math.max(0, 1 - Math.abs((p - q - .08) * d) * 4), 0); H.set(this.dl.nd, { r: -62 + 12 * hit + Math.sin(t * 22) * 1.5 }); } });
v([16, 22], { id: "g4", sfx: [[.15, "pop"], [.5, "ding", 2]],
  init(L) { this.b = K3.bust(L.mid, 680, 920, 1.45, { spots: 0 }); this.ck = K3.checkMark(L.fg, 130); },
  update(t, p, d, L) { zoom(L, p, 1, 1.06); H.set(this.ck, { x: 190, y: 380, s: E.pop(seg(p, .3, .5)), o: p > .3 ? 1 : 0 }); } });

/* ---- imagine ---- */
v([17, 0], { id: "i1", sfx: [[.05, "paper"], [.4, "pop"]],
  init(L) { bath(L); this.pe = K3.person(L.mid, 380, 1520, .98, { pose: { armF: [[-30, -480], [-20, -400]], armB: [[34, -490], [40, -400]] } }); this.mb = K3.bust(L.fg, 760, 800, .22, { spots: 0 }); },
  update(t, p, d, L) { zoom(L, p, 1, 1.06); ent(this.pe, p, .05, .3, -400, 0); } });
v([18, 0], { id: "i2", sfx: [[.1, "pop"], [.35, "stamp"]],
  init(L) { this.jr = K.jar(L.mid, "#F2C9C0", 1.6); H.set(this.jr, { x: 540, y: 1000 }); this.fl = flame(L.mid); this.cr = K.cross(L.fg, 540, 800, 280); },
  update(t, p, d, L) { zoom(L, p); H.set(this.fl, { x: 540, y: 600, s: 1.6 + .12 * Math.sin(t * 14), r: Math.sin(t * 9) * 4, o: p > .08 ? 1 : 0 }); pp(this.cr, p, .5, .64); } });
v([18, 6], { id: "i2b", sfx: [[.1, "pop"], [.35, "stamp"]],
  init(L) { this.jr = K.jar(L.mid, "#CDE3D0", 1.6); H.set(this.jr, { x: 540, y: 1000 }); this.st = Array.from({ length: 6 }, (_, i) => star4(L.mid, 46)); this.cr = K.cross(L.fg, 540, 800, 280); },
  update(t, p, d, L) { zoom(L, p); this.st.forEach((g, i) => { const a = i / 6 * 6.283 + t; H.set(g, { x: 540 + Math.cos(a) * 280, y: 760 + Math.sin(a) * 200, s: .8 + .3 * Math.sin(t * 6 + i), o: p > .1 ? 1 : 0, r: t * 40 }); }); pp(this.cr, p, .5, .64); } });
v([18, 11], { id: "i3", sfx: [[.15, "stamp"], [.4, "stamp"], [.65, "ding", 1]],
  init(L) { this.f = K4.factory(L.mid, 540, 740, 1.3); this.lv = H.grp(L.fg, 880, 1260, { j: .3 }); H.rrect(this.lv, -18, -240, 36, 260, "#6b543a", { r: 12, jit: 0 }); H.circ(this.lv, 0, -250, 40, RED, { th: 6 }); H.rrect(this.lv, -80, -10, 160, 60, Q.blk, { r: 14, jit: 0 }); this.ok = K3.checkMark(L.fg, 90); },
  update(t, p, d, L) { zoom(L, p, 1, 1.05); const k = E.out(seg(p, .2, .45)); H.set(this.lv, { r: lerp(-32, 34, k), x: 880, y: 1260 }); this.f.spin(t, 3 * (1 - k) + .05); this.f.out(t, 2 * (1 - k), 1 - k); H.set(this.ok, { x: 150, y: 1180, s: E.pop(seg(p, .55, .7)), o: p > .55 ? 1 : 0 }); } });
v([18, 21], { id: "i3b", sfx: [[.1, "whoosh"], [.5, "ding", 2]],
  init(L) { this.S = K4.skin(L.mid, 640); this.G = K4.grains(this.S, L.mid, 3); this.ar = K.arrow(L.fg, 540, 250, 540, 620, Q.red, 62); this.rg = K.ring(L.fg, 540, 962, 200, Q.green, 14); },
  update(t, p, d, L) { zoom(L, p, 1, 1.06); K4.rise(this.S, this.G, t, .8, this.S.y0 + 150, 1 - seg(p, .4, .6)); H.set(this.ar, { y: 250 + Math.sin(t * 6) * 10 }); pp(this.rg, p, .4, .55); H.set(this.rg, { r: t * 12 }); } });

/* ---- les 4 actifs ---- */
v([19, 5], { id: "a0", sfx: [[.15, "pop"], [.35, "pop"], [.55, "pop"], [.75, "pop"]],
  init(L) { this.fr = [[270, 640], [810, 640], [270, 1130], [810, 1130]].map(([x, y]) => { const g = H.grp(L.mid, x, y, { j: .5 }); H.rrect(g, -220, -220, 440, 440, "#FBF3E0", { r: 20, jit: 0, sh: "sh2", th: 12 }); return g; }); this.ic = [wheat, berry, capsule, hexa].map((f, i) => { const g = f(this.fr[i]); H.set(g, { s: 1.9 }); return g; }); },
  update(t, p, d, L) { zoom(L, p); this.ic.forEach((g, i) => pp(g, p, .1 + i * .18, .22 + i * .18)); } });
v([20, 0], { id: "a1", sfx: [[.05, "paper"], [.3, "stamp"], [.6, "ding", 1]],
  init(L) { this.sg = K4.tag(L.fg, "ACIDE AZÉLAÏQUE\n10 %", 540, 360, { size: 90 }); this.f = K4.factory(L.mid, 640, 900, 1.15); this.wh = wheat(L.fg); H.set(this.wh, { x: 190, y: 1020, s: 1.6 }); },
  update(t, p, d, L) { zoom(L, p); ent(this.sg, p, .02, .2, 0, -800); swing(this.sg, t); const k = 1 - E.out(seg(p, .25, .75)) * .95; this.f.spin(t, k * 3); this.f.out(t, 1.5 * k, k); pp(this.wh, p, .1, .25); } });
v([21, 0], { id: "a2", sfx: [[.05, "paper"], [.35, "stamp"], [.6, "ding", 1]],
  init(L) { this.sg = K4.tag(L.fg, "ALPHA-ARBUTINE", 540, 340, { size: 94 }); this.br = berry(L.fg); H.set(this.br, { x: 190, y: 560, s: 1.6 }); this.en = H.grp(L.mid, 640, 940, { j: .6 }); const pts = []; for (let i = 0; i <= 26; i++) { const a = .5 + i / 26 * (Math.PI * 2 - 1); pts.push([Math.cos(a) * 190, Math.sin(a) * 190]); } pts.push([0, 0]); H.poly(this.en, pts, "#F5D6A1", { seed: 5, jit: 1.5, th: 10 }); H.circ(this.en, 40, -90, 20, Q.blk, { sh: false, th: 0 }); this.gr = K4.factory(L.bg, 300, 1180, .7); this.lk = lock(L.fg, 1.5); },
  update(t, p, d, L) { zoom(L, p); ent(this.sg, p, .02, .2, 0, -800); swing(this.sg, t); pp(this.br, p, .1, .25); const k = E.back(seg(p, .4, .6)); H.set(this.lk, { x: 640, y: lerp(100, 940, k), o: p > .4 ? 1 : 0 }); H.set(this.en, { x: 640 + (p < .4 ? 20 * Math.sin(t * 14) : 0), s: 1 - .15 * seg(p, .5, .7) }); this.gr.spin(t, 1 - seg(p, .5, .7)); } });
v([22, 0], { id: "a3", sfx: [[.05, "paper"], [.4, "tear"], [.7, "ding", 1]],
  init(L) { this.sg = K4.tag(L.fg, "ACIDE TRANÉXAMIQUE", 540, 340, { size: 80, maxw: 880 }); this.cd = H.grp(L.mid, 540, 960, { j: .3 }); H.rrect(this.cd, -380, -300, 760, 600, "#C89E70", { r: 10, jit: 1.5, th: 10, corr: true }); this.ck = H.poly(this.cd, [[-40, -300], [20, -200], [-30, -120], [30, -20], [-10, 60], [50, 160], [0, 300], [-70, 300], [-30, 160], [-90, 60], [-40, -20], [-100, -120], [-50, -200], [-100, -300]], "#6b4a2c", { jit: 1, th: 0, sh: false }); this.st = Array.from({ length: 7 }, (_, i) => { const g = H.grp(this.cd, 0, -240 + i * 80, { j: .5 }); H.rrect(g, -86, -6, 172, 12, Q.green, { r: 6, jit: 0, sh: "sh1", th: 2 }); return g; }); this.dt = Array.from({ length: 5 }, (_, i) => K3.dot(this.cd, -20 + (i % 2) * 40, -150 + i * 80, 14, i + 4, MEL)); },
  update(t, p, d, L) { zoom(L, p); ent(this.sg, p, .02, .2, 0, -800); swing(this.sg, t); this.st.forEach((g, i) => pp(g, p, .3 + i * .08, .4 + i * .08)); this.dt.forEach((q, i) => H.set(q, { o: 1 - seg(p, .35 + i * .1, .5 + i * .1) })); } });
v([23, 0], { id: "a4", sfx: [[.05, "paper"], [.3, "stamp"], [.6, "pop"], [.8, "pop"]],
  init(L) { this.sg = K4.tag(L.fg, "NIACINAMIDE\n5 %", 540, 360, { size: 90 }); this.S = K4.skin(L.mid, 900); this.br = []; for (let r = 0; r < 2; r++) for (let i = 0; i < 6; i++) { const g = H.grp(L.fg, 130 + i * 164 + (r % 2) * 82 - 40, 850 - r * 56, { j: .3 }); H.rrect(g, -74, -26, 148, 52, "#D9A482", { r: 6, jit: 0, th: 6 }); this.br.push(g); } },
  update(t, p, d, L) { zoom(L, p); ent(this.sg, p, .02, .2, 0, -800); swing(this.sg, t); this.br.forEach((g, i) => { const k = E.out(seg(p, .15 + i * .04, .3 + i * .04)); H.set(g, { y: lerp(-300, 850 - Math.floor(i / 6) * 56, k), o: p > .1 + i * .04 ? 1 : 0 }); }); } });
v([23, 12], { id: "a4b", sfx: [[.15, "thud"], [.4, "thud"], [.65, "thud"]],
  init(L) { this.S = K4.skin(L.mid, 900); this.br = []; for (let r = 0; r < 2; r++) for (let i = 0; i < 6; i++) { const g = H.grp(L.mid, 130 + i * 164 + (r % 2) * 82 - 40, 850 - r * 56, { j: .3 }); H.rrect(g, -74, -26, 148, 52, "#D9A482", { r: 6, jit: 0, th: 6 }); this.br.push(g); } this.st = [0, 1, 2].map(k => strike(L, null, k, 0)); },
  update(t, p, d, L) { zoom(L, p); const ph = [.12, .4, .68]; this.st.forEach((g, i) => { const tt = (p - ph[i]) * d, k = tt < .3 ? E.out(seg(tt, 0, .3)) : 0, b = seg(tt, .3, .8); H.set(g, { x: 220 + i * 320 + (tt > .3 ? 90 * b * (i % 2 ? 1 : -1) : 0), y: tt < .3 ? lerp(150, 700, k) : lerp(700, 300, b), r: tt > .3 ? b * 200 : 0, o: tt > -.05 && tt < .95 ? 1 : 0 }); H.set(g.ic, { s: 1 }); }); } });
v([23, 19], { id: "a4c", sfx: [[.2, "flip"], [.5, "ding", 1]],
  init(L) { this.cal = K.calendar(L.mid); H.set(this.cal, { x: 540, y: 840, s: 1.7 }); this.dt = K3.dot(L.fg, 600, 900, 24, 5); },
  update(t, p, d, L) { zoom(L, p); this.cal.pages.forEach((g, i) => { const k = E.out(seg(p, .08 + i * .05, .24 + i * .05)); H.set(g, { y: -900 * k, r: -12 * k, o: 1 - seg(p, .1 + i * .05, .3 + i * .05) }); }); H.set(this.dt, { o: 0 }); } });
