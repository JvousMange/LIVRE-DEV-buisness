/* Corps v3 « 5 raisons » : plans réutilisés (re-calés sur la nouvelle voix) + plans nouveaux. Ancrage : at = [phrase, mot] */
const _bi = P.badgeIn; P.badgeIn = (b, p, a) => { if (b._off) H.set(b, { o: 0 }); else _bi(b, p, a); };
const byId = id => SHOTS.find(s => s.id === id) || [].concat(...Object.values(HOOKSHOTS)).find(s => s.id === id);
const nb = base => ({ ...base, init(L) { base.init.call(this, L); if (this.b) this.b._off = true; } });                       // sans pastille de numéro
const wb = (base, n) => ({ ...base, init(L) { base.init.call(this, L); this.bd = P.badge(L.fg, n); }, update(t, p, d, L) { base.update.call(this, t, p, d, L); P.badgeIn(this.bd, p); } });
const V = []; const v = (at, o) => V.push(Object.assign(o, { at })); const use = (at, s, id) => { s.id = id || s.id; v(at, s); };
const AT = (s, w) => ALLWORDS[s][w].start;                                                                                   // temps absolu d'un mot
const loc = (self, s, w) => AT(s, w) - self._start;                                                                           // temps local
const SK = P.spots(8, 21, 540, 880, 250, 160, 18, 34);

use([0, 0], byId("fan"));
/* 1 · tu traites la surface */
v([1, 0], { id: "surfaceRub", sfx: [[.05, "paper"], [.2, "rub"], [.5, "rub"], [.8, "rub"]],
  init(L) { BG.cream(L.bg); this.bd = P.badge(L.fg, 1); this.pa = P.patch(L.mid, 540, 900, 360); this.mk = P.spotGroup(this.pa, SK.map(s => ({ ...s, x: s.x - 540, y: s.y - 900 }))); this.hand = P.scrubHand(L.fg); },
  update(t, p, d, L) { H.look(L, 0, 0, lerp(1.0, 1.1, p)); P.badgeIn(this.bd, p); P.popAll(this.mk, p, .02, .18); const r = seg(p, .15, .97); H.set(this.hand, { x: 540 + Math.sin(r * Math.PI * 9) * 230, y: 900 + Math.cos(r * Math.PI * 6) * 90, r: Math.sin(r * Math.PI * 9) * 12, s: 1.7, o: r > 0 ? 1 : 0 }); } });
v([1, 15], { id: "under", sfx: [[.05, "paper"], [.3, "slide"], [.6, "pop"]],
  init(L) { BG.terra(L.bg); this.sec = P.section(L.mid, 760); this.ar = P.arrow(L.fg, 300, C.cream, 70); this.top = H.grp(L.fg, 540, 560, { j: .6 }); H.rrect(this.top, -300, -50, 600, 100, "#F6EDD0", { r: 30, seed: 3 }); H.txt(this.top, "SURFACE", 0, 24, 62, C.terra, { font: "Anton, sans-serif", w: 400, ls: 4 }); this.und = H.grp(L.fg, 540, 1500, { j: .6 }); H.rrect(this.und, -310, -50, 620, 100, C.cream, { r: 30, seed: 5 }); H.txt(this.und, "SOUS LA PEAU", 0, 24, 58, C.terraD, { font: "Anton, sans-serif", w: 400, ls: 4 }); },
  update(t, p, d, L) { H.look(L, 0, lerp(0, 60, p), lerp(1.0, 1.08, p)); this.sec.cells.forEach((c, i) => H.set(c, { s: 1 + .09 * Math.sin(t * 8 + i) })); H.set(this.top, { s: E.pop(seg(p, .02, .2)) }); H.set(this.ar, { x: 540, y: 1030 + Math.sin(t * 5) * 18, o: seg(p, .2, .3) }); H.set(this.und, { s: E.pop(seg(p, .4, .6)), o: p > .4 ? 1 : 0 }); } });
/* 2 · tu les caches */
use([2, 0], wb(HOOKSHOTS.D[0], 2), "found2");
use([2, 8], HOOKSHOTS.D[1]);
/* 3 · soins pensés pour peaux claires */
use([3, 0], byId("pale"));
v([4, 0], { id: "irritate", sfx: [[.05, "paper"], [.2, "slide"], [.35, "stamp"], [.55, "pop"], [.7, "stamp"]],
  init(L) { BG.cream(L.bg); this.pa = P.patch(L.mid, 540, 800, 360); this.fl = P.flush(this.pa, 330); this.mk = P.spotGroup(this.pa, SK.map(s => ({ ...s, x: (s.x - 540) * .9, y: (s.y - 900) * .9 }))); this.tb = P.tube(L.fg, C.blue, 220, 1500); this.cr = P.cross(L.fg, 170); H.set(this.cr, { x: 540, y: 1420, o: 0 }); this.ok = H.grp(L.fg, 540, 1420, { j: .5 }); },
  update(t, p, d, L) { H.look(L, 0, 0, lerp(1.0, 1.08, p)); const a = E.io(seg(p, .08, .35)); H.set(this.tb, { x: lerp(220, 480, a), y: lerp(1500, 940, a), r: lerp(0, -28, a) }); H.set(this.fl, { o: seg(p, .3, .5) * (.6 + .3 * Math.sin(t * 9)) });
    const b = E.io(seg(p, .5, .7)); H.set(this.tb, { x: lerp(480, 880, b), y: lerp(940, 1500, b), r: lerp(-28, 20, b) }); H.set(this.cr, { x: 880, y: 1500, s: E.pop(seg(p, .72, .88)), o: p > .72 ? 1 : 0 }); } });
/* 4 · gommages, produits au hasard, c'est pire */
use([5, 0], byId("scrub"));
use([5, 10], byId("random"));
use([5, 15], byId("worse"));
/* 5 · soleil, rasage, frottements */
v([6, 0], { id: "triggers", sfx: [[.05, "paper"], [.15, "pop"], [.3, "pop"], [.45, "pop"], [.7, "stamp"]],
  init(L) { BG.cream(L.bg); this.bd = P.badge(L.fg, 5); this.pa = P.patch(L.mid, 540, 1470, 230); this.mk = P.spotGroup(this.pa, [[-90, -40], [60, -70], [100, 40], [-30, 70], [0, -10]].map((q, i) => ({ x: q[0], y: q[1], r: 22 + (i % 2) * 8, s: i + 3 })));
    this.c = [0, 1, 2].map(i => { const g = H.grp(L.mid, 540, 470 + i * 250, { j: .7 }); H.rrect(g, -330, -105, 660, 210, i % 2 ? "#F2E7BA" : C.cream, { r: 28, seed: i + 3 }); return g; });
    const sun = P.sun(this.c[0], 52); H.set(sun, { x: -220 }); const rz = P.razor(this.c[1], .8); H.set(rz, { x: -200 }); const jn = H.grp(this.c[2], -220, 0, { j: .4 }); H.rrect(jn, -70, -60, 140, 120, C.blue, { r: 18, seed: 5 });
    ["SOLEIL", "RASAGE", "FROTTEMENTS"].forEach((n, i) => H.txt(this.c[i], n, 70, 24, 66, C.terraD, { font: "Anton, sans-serif", w: 400, ls: 3 })); },
  update(t, p, d, L) { H.look(L, 0, 0, lerp(1.0, 1.06, p)); P.badgeIn(this.bd, p); [[2, 0], [3, 1], [4, 2]].forEach(([w, i]) => { const a = E.back(H.clamp((t - loc(this, 6, w)) / .3)); H.set(this.c[i], { x: lerp(1300, 540, a), o: a > 0 ? 1 : 0 }); }); const m = loc(this, 6, 8); P.popAll(this.mk, H.clamp((t - m) / 1.4), 0, 1); H.set(this.pa, { y: 1470 + Math.sin(t * 3) * 4 }); } });
/* bascule : en dessous */
use([7, 0], byId("peel"));
use([8, 0], byId("act"));
/* mélanine : l'usine à couleur */
use([10, 0], byId("factory"));
use([11, 0], byId("inflam"));
use([12, 0], byId("pigment"));
use([13, 0], HOOKSHOTS.E[0]);
use([14, 0], nb(byId("months")), "months");
use([14, 10], nb(byId("xtubes")), "xtubes");
use([15, 0], byId("notlight"));
v([16, 0], { id: "dial", sfx: [[.05, "paper"], [.3, "slide"], [.6, "tick"], [.7, "tick"], [.85, "ding", 1]],
  init(L) { BG.sage(L.bg); this.pa = P.patch(L.mid, 540, 1400, 250); this.mk = P.spotGroup(this.pa, [[-90, -30], [60, -60], [90, 40], [-30, 60]].map((q, i) => ({ x: q[0], y: q[1], r: 30, s: i + 2 }))); this.dial = H.grp(L.mid, 540, 700, { j: .4 }); H.circ(this.dial, 0, 0, 330, C.cream, { sh: "sh2", th: 12 });
    [["#C8402A", -180, -120], ["#E0A93C", -120, -60], ["#6B8F71", -60, 0]].forEach(([c, a0, a1], i) => { const r1 = 280, r2 = 200, pt = (a, r) => [Math.cos(a * Math.PI / 180) * r, Math.sin(a * Math.PI / 180) * r]; const pts = []; for (let k = 0; k <= 8; k++) pts.push(pt(a0 + (a1 - a0) * k / 8, r1)); for (let k = 8; k >= 0; k--) pts.push(pt(a0 + (a1 - a0) * k / 8, r2)); H.poly(this.dial, pts, c, { seed: i, jit: .6, sh: false, th: 3 }); });
    this.nd = H.grp(this.dial, 0, 0, { j: .3 }); H.poly(this.nd, [[-14, 0], [0, -250], [14, 0]], C.dark, { seed: 2, jit: .4 }); H.circ(this.dial, 0, 0, 34, C.dark, { sh: false, th: 0 }); H.txt(this.dial, "MÉLANINE", 0, 120, 70, C.terraD, { font: "Anton, sans-serif", w: 400, ls: 4 }); },
  update(t, p, d, L) { H.look(L, 0, 0, lerp(1.0, 1.06, p)); const a = E.io(seg(p, .2, .8)); H.set(this.nd, { r: lerp(-62, 48, a) + Math.sin(t * 20) * (1 - a) * 3 }); this.mk.forEach((m, i) => H.set(m, { s: lerp(1, .45, a), o: 1 })); } });
v([17, 0], { id: "imagine", sfx: [[.05, "paper"], [.25, "pop"], [.55, "pop"], [.8, "ding", 0]],
  init(L) { BG.sage(L.bg); this.w = P.woman(L.mid, 460, 1130, 1.4, { top: C.cream }); this.cl = H.grp(L.fg, 730, 560, { j: .6 }); H.blob(this.cl, 0, 0, 280, 210, "#F6EDD0", { seed: 4, sh: "sh2" }); [[-150, 190, 24], [-210, 260, 14]].forEach(([x, y, r]) => H.circ(this.cl, x + 70, y, r, "#F6EDD0", { sh: "sh1" })); this.pa = P.patch(this.cl, 0, 0, 120, 6); this.sp = H.grp(this.cl, 0, -10, { j: 0 }); P.mark(this.sp, 30, 10, 14, "#B0764B", 4); },
  update(t, p, d, L) { H.look(L, 0, 0, lerp(1.0, 1.08, p)); H.set(this.w.head, { r: lerp(0, -7, E.io(p)) }); H.set(this.cl, { s: E.pop(seg(p, .15, .4)) * (1 + .02 * Math.sin(t * 4)), o: p > .15 ? 1 : 0 }); H.set(this.w, { y: 1130 + Math.sin(t * 2.4) * 5 }); } });
v([18, 0], { id: "notburn", sfx: [[.05, "paper"], [.2, "pop"], [.45, "stamp"], [.65, "pop"], [.85, "stamp"]],
  init(L) { BG.cream(L.bg); this.a = H.grp(L.mid, 290, 760, { j: .5 }); this.pa = P.patch(this.a, 0, 0, 170); this.fl = P.flush(this.pa, 160);
    const fl = H.grp(this.a, 0, -10, { j: .8 }); H.poly(fl, [[0, -200], [70, -90], [60, 30], [0, 70], [-60, 30], [-80, -80], [-30, -60]], "#E8742E", { seed: 7, jit: 2 }); H.poly(fl, [[0, -90], [34, -20], [0, 36], [-34, -20]], "#FFD58A", { seed: 8, jit: 1, sh: false });
    this.b = H.grp(L.mid, 760, 760, { j: .5 }); const sj = P.scrubJar(this.b); H.set(sj, { s: .85 }); this.c1 = P.cross(L.fg, 150); H.set(this.c1, { x: 290, y: 760 }); this.c2 = P.cross(L.fg, 150); H.set(this.c2, { x: 760, y: 760 });
    H.txt(this.a, "BRÛLE", 0, 260, 70, C.terraD, { font: "Anton, sans-serif", w: 400, ls: 4 }); H.txt(this.b, "GOMMAGE\nMAGIQUE", 0, 250, 52, C.terraD, { font: "Anton, sans-serif", w: 400, ls: 2 }); },
  update(t, p, d, L) { H.look(L, 0, 0, lerp(1.0, 1.06, p)); H.set(this.a, { s: E.pop(seg(p, .05, .22)), o: p > .05 ? 1 : 0 }); H.set(this.b, { s: E.pop(seg(p, .3, .46)), o: p > .3 ? 1 : 0 }); H.set(this.c1, { s: E.pop(seg(p, .2, .34)), o: p > .2 ? 1 : 0 }); H.set(this.c2, { s: E.pop(seg(p, .52, .66)), o: p > .52 ? 1 : 0 }); } });
v([18, 11], { id: "source", sfx: [[.05, "paper"], [.25, "slide"], [.55, "stamp"], [.8, "ding", 2]],
  init(L) { BG.terra(L.bg); this.sec = P.section(L.mid, 1000); this.bt = H.bottle(L.fg, 1); this.ar = P.arrow(L.fg, 260, C.cream, 60); this.ring = H.grp(L.fg, 540, 1180, { j: .8 }); H.circ(this.ring, 0, 0, 330, "none", { sh: false, attr: { stroke: C.cream, "stroke-width": 12, "stroke-dasharray": "26 16" } }); },
  update(t, p, d, L) { H.look(L, 0, 120, lerp(1.0, 1.1, p)); this.sec.cells.forEach((c, i) => H.set(c, { s: 1 + .09 * Math.sin(t * (7 - 5 * p) + i) })); const a = E.out(seg(p, .08, .4)); H.set(this.bt, { x: 540, y: lerp(-300, 520, a) + Math.sin(t * 3) * 8, r: -6 }); H.set(this.ar, { x: 540, y: 880 + Math.sin(t * 6) * 16, o: seg(p, .35, .5) }); H.set(this.ring, { s: E.pop(seg(p, .6, .8)) * (1 + .05 * Math.sin(t * 8)), r: t * 20, o: p > .6 ? 1 : 0 }); } });
v([19, 0], { id: "four", sfx: [[.05, "paper"], [.2, "pop", 0], [.4, "pop", 2], [.6, "pop", 4], [.8, "pop", 5]],
  init(L) { BG.cream(L.bg); this.tg = H.tag(L.fg, "4 ACTIFS", 560, 190, { size: 62 }); H.set(this.tg, { x: 540, y: 330 }); const ics = [P.ico.wheat, P.ico.berry, P.ico.capsule, P.ico.b3]; this.cd = ics.map((f, i) => { const g = H.grp(L.mid, 330 + (i % 2) * 420, 850 + Math.floor(i / 2) * 420, { j: .7 }); H.rrect(g, -180, -180, 360, 360, i % 2 ? "#F2E7BA" : C.cream, { r: 40, seed: i + 3 }); const ic = f(g); H.set(ic, { s: 2.1 }); return g; }); },
  update(t, p, d, L) { H.look(L, 0, 0, lerp(1.0, 1.06, p)); H.set(this.tg, { s: E.pop(seg(p, .02, .18)), y: 330 }); this.cd.forEach((g, i) => { const a = E.back(seg(p, .15 + i * .18, .3 + i * .18)); H.set(g, { s: a, r: (i - 1.5) * 2, o: a > 0 ? 1 : 0 }); }); } });
use([20, 0], byId("brake"));
use([21, 0], byId("lock"));
use([22, 0], byId("tranex"));
use([23, 0], byId("wall"));
use([24, 0], byId("target"));
use([25, 0], byId("ten"));
use([26, 0], byId("hero"));
use([27, 0], byId("crowd"));
use([28, 0], byId("two"));
use([28, 10], byId("free"));
use([29, 0], byId("jars"));
use([30, 0], byId("okstamp"));
use([30, 13], byId("seal"));
use([31, 0], byId("refund"));
v([32, 0], { id: "cta", sfx: [[.05, "whoosh"], [.3, "stamp"], [.5, "pop"], [.8, "ding", 2]],
  init(L) { BG.terra(L.bg); this.bt = H.bottle(L.mid, 1.5); this.bn = H.grp(L.fg, 540, 1500, { j: .6 }); H.rrect(this.bn, -380, -90, 760, 180, C.cream, { r: 90, seed: 4, sh: "sh2", th: 12 }); H.txt(this.bn, "COMMANDER", 0, 30, 90, C.terraD, { font: "Anton, sans-serif", w: 400, ls: 5 }); this.ar = P.arrow(L.fg, 200, C.cream, 54); this.cf = P.confetti(L.fg, 14, 3, [C.cream, C.sage, "#E0A93C"]); },
  update(t, p, d, L) { H.look(L, 0, 0, lerp(1.0, 1.06, p)); H.set(this.bt, { x: 540, y: 780 + Math.sin(t * 2.6) * 12, r: Math.sin(t * 2) * 3, s: E.pop(seg(p, .05, .3)) }); H.set(this.bn, { s: E.pop(seg(p, .3, .5)) * (1 + .03 * Math.sin(t * 7)), o: p > .3 ? 1 : 0 }); H.set(this.ar, { x: 540, y: 1280 + Math.sin(t * 7) * 18, o: seg(p, .45, .6) }); P.confettiAt(this.cf, Math.max(0, t - .6), 1100); } });
use(null, byId("end"));
