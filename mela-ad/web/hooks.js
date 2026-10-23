/* Bibliothèque de hooks : chaque variante = animation d'ouverture dédiée (calée sur les mots du hook) ; le corps de la pub reste identique et démarre à « Cinq signes que… ». */
const mkShot = o => o;
const FOUND = "#C08A5E";
const LEG = "M-150,-620 C-210,-300 -150,60 -85,520 C-70,600 -80,660 -60,710 L95,710 C125,660 92,570 100,500 C150,100 215,-330 150,-620 Z";

/* ---------- accessoires propres aux hooks ---------- */
P.lemon = (parent, r = 100) => { const g = H.grp(parent, 0, 0, { j: .6 }); H.circ(g, 0, 0, r, "#E3BE2F", { sh: "sh", th: 7 }); H.circ(g, 0, 0, r * .86, "#F8E783", { sh: false, th: 0 }); for (let i = 0; i < 9; i++) { const a = i / 9 * 6.283; H.el("path", { d: `M0,0 L${Math.cos(a) * r * .82},${Math.sin(a) * r * .82}`, stroke: "#E3BE2F", "stroke-width": 4.5, "stroke-linecap": "round" }, g); } H.circ(g, 0, 0, r * .1, "#F8E783", { sh: false, th: 0 }); return g; };
P.serum = (parent, col = "#E58A2B", sc = 1) => { const g = H.grp(parent, 0, 0, { j: .6 }); const s = H.grp(g, 0, 0, { j: 0 }); H.set(s, { s: sc }); H.rrect(s, -70, -90, 140, 250, col, { r: 30, seed: 2 }); H.rrect(s, -40, -140, 80, 56, "#F6EDD0", { r: 10, sh: "sh1" }); H.blob(s, 0, -200, 34, 62, "#C26A45", { seed: 6, jit: .02 }); H.rrect(s, -52, 0, 104, 110, "#F6EDD0", { r: 6, sh: false, th: 0 }); H.txt(s, "C", 0, 88, 72, "#C26A45", { font: "Anton, sans-serif", w: 400 }); return g; };
P.compact = (parent, r = 240) => { const g = H.grp(parent, 0, 0, { j: .5 }); H.rrect(g, -r * .5, r * .7, r, 70, "#D9A441", { r: 18, seed: 3 }); H.circ(g, 0, 0, r, "#D9A441", { sh: "sh2", th: 12 }); H.circ(g, 0, 0, r * .88, "#CDE0E7", { sh: false, th: 0 }); H.el("path", { d: `M${-r * .6},${-r * .3} A${r * .66},${r * .66} 0 0 1 ${-r * .1},${-r * .65}`, stroke: "#fff", "stroke-opacity": .55, "stroke-width": 16, fill: "none", "stroke-linecap": "round" }, g); return g; };
P.magnifier = (parent, r = 120) => { const g = H.grp(parent, 0, 0, { j: .5 }); const h = H.grp(g, r * .72, r * .72, { j: 0 }); h._b.r = 45; H.rrect(h, -16, 0, 32, r * 1.1, "#5a3418", { r: 14, seed: 3 }); H.circ(g, 0, 0, r, "rgba(255,255,255,.28)", { sh: "sh", th: 5, attr: { stroke: "#3a2415", "stroke-width": 18, "stroke-opacity": 1 } }); return g; };
P.shelfBoard = (parent, y) => { H.rrect(parent, -60, y, 1200, 46, "#8A5A3C", { r: 0, sh: "sh", jit: 1, th: 10 }); };
P.flush = (parent, r) => { const g = H.grp(parent, 0, 0, { j: .4 }); H.blob(g, 0, 0, r, r * .85, C.red, { n: 20, jit: .1, seed: 4, sh: false, th: 0, attr: { opacity: .34 } }); return g; };
const poster = (parent, x, y, hair, i) => { const g = H.grp(parent, x, y, { j: .6 }); H.rrect(g, -150, -200, 300, 400, "#FBEFE2", { r: 12, seed: i, th: 8 }); H.blob(g, 0, 20, 84, 104, "#F1C9A4", { seed: i, sh: false, th: 0 }); H.blob(g, 0, -64, 98, 66, hair, { seed: i + 4, sh: false, th: 0 }); H.rrect(g, -104, 112, 208, 64, "#F6DCC4", { r: 22, sh: false, th: 0 }); return g; };

/* ================= A · post-acné (boutons qui partent, marques qui restent) : plans existants pop / stay / mirror ================= */

/* ================= B · grossesse / mélasma ================= */
const shotPreg = mkShot({ id: "preg", at: ["hook", 0, 0], sfx: [[.5, "pop", 1], [.72, "pop", 3]],
  init(L) { BG.wall(L.bg, "#F0DAB8", null, 1250); this.w = P.woman(L.mid, 540, 960, 1.45, { top: "#E8A87C" });
    this.belly = H.grp(this.w.s, 0, 230, { j: .4 }); H.blob(this.belly, 0, 0, 190, 150, "#EDB48C", { seed: 4, th: 8 }); H.blob(this.belly, -50, -40, 90, 60, "#F7D0AE", { seed: 5, sh: false, th: 0, attr: { opacity: .55 } });
    this.mk = P.spotGroup(this.w.head, [[-58, 24, 17], [-74, 44, 12], [-42, 50, 12], [-62, 62, 9], [58, 24, 17], [74, 44, 12], [42, 50, 12], [62, 62, 9]].map((q, i) => ({ x: q[0], y: q[1], r: q[2], s: i + 2 }))); },
  update(t, p, d, L) { H.look(L, 0, lerp(0, 50, p), lerp(1.0, 1.1, E.io(p))); H.set(this.w, { y: 960 + Math.sin(t * 2.6) * 6 }); H.set(this.belly, { s: 1 + .015 * Math.sin(t * 3) });
    const h = E.io(seg(p, .05, .4)); H.set(this.w.armL, { r: lerp(0, 20, h) }); H.set(this.w.armL.fore, { r: lerp(0, -60, h) }); H.set(this.w.armR, { r: lerp(0, -20, h) }); H.set(this.w.armR.fore, { r: lerp(0, 60, h) });
    H.set(this.w.head, { r: Math.sin(t * 2) * 2 }); P.popAll(this.mk, p, .35, .75); } });
const shotMask = mkShot({ id: "mask", at: ["hook", 0, 3], sfx: [[.22, "stamp"], [.5, "tap"]],
  init(L) { BG.dark(L.bg); this.f = P.face(L.mid); const mk = (x, y, rot, id) => { const g = H.grp(this.f, x, y, { j: .5 }); g._b.r = rot; H.blob(g, 0, 0, 135, 82, "#5A3524", { n: 20, jit: .1, seed: id, th: 3, attr: { opacity: .92 } }); return g; };
    this.pl = mk(P.CHEEK_L[0] - 10, P.CHEEK_L[1] + 120, -22, 3); this.pr = mk(P.CHEEK_R[0] + 10, P.CHEEK_R[1] + 120, 22, 5);
    this.fh = H.grp(this.f, 540, 500, { j: .5 }); H.blob(this.fh, 0, 0, 190, 56, "#5A3524", { n: 20, jit: .1, seed: 9, th: 3, attr: { opacity: .88 } });
    this.lp = H.grp(this.f, 540, 1040, { j: .5 }); H.blob(this.lp, 0, 0, 95, 26, "#5A3524", { n: 14, jit: .1, seed: 10, th: 2, attr: { opacity: .88 } });
    this.sp = P.spotGroup(this.f, P.spots(10, 41, 540, 960, 330, 160, 7, 13).filter(s => Math.hypot(s.x - 540, (s.y - 960) * 1.4) > 200), "#5A3524"); },
  update(t, p, d, L) { H.look(L, 0, 40, lerp(1.0, 1.26, E.io(p))); H.set(this.pl, { s: E.pop(seg(p, .12, .42)), o: p > .12 ? 1 : 0 }); H.set(this.pr, { s: E.pop(seg(p, .2, .5)), o: p > .2 ? 1 : 0 }); H.set(this.fh, { s: E.pop(seg(p, .4, .62)), o: p > .4 ? 1 : 0 }); H.set(this.lp, { s: E.pop(seg(p, .5, .7)), o: p > .5 ? 1 : 0 }); P.popAll(this.sp, p, .55, .92); } });
const shotMaskTime = mkShot({ id: "masktime", at: ["hook", 0, 8], sfx: [[.2, "flip"], [.55, "flip"], [.8, "pop", 2]],
  init(L) { BG.cream(L.bg); this.cal = P.calendar(L.mid); H.set(this.cal, { x: 300, y: 560, s: 1.25 }); this.w = P.woman(L.mid, 740, 1010, 1.15, { top: "#E8A87C" });
    this.mk = P.spotGroup(this.w.head, [[-58, 24, 17], [-74, 44, 12], [-42, 50, 12], [58, 24, 17], [74, 44, 12], [42, 50, 12]].map((q, i) => ({ x: q[0], y: q[1], r: q[2], s: i + 2 }))); this.mk.forEach(m => H.set(m, { s: 1 }));
    this.q = P.question(L.fg, .3, C.terra); H.set(this.q, { x: 930, y: 400 }); },
  update(t, p, d, L) { H.look(L, 0, 0, lerp(1, 1.08, p)); this.cal.pages.forEach((pg, i) => { const a = E.io(seg(p, .04 + i * .075, .04 + i * .075 + .09)); H.set(pg, { sy: 1 - a * .9, y: -40 - a * 120, o: a >= 1 ? 0 : 1 }); }); H.set(this.w, { y: 1010 + Math.sin(t * 2.4) * 5 }); H.set(this.q, { s: E.pop(seg(p, .65, .85)) * .3, r: Math.sin(t * 6) * 8 }); } });

/* ================= C · rasage / épilation ================= */
const shotShave = mkShot({ id: "shave", at: ["hook", 0, 0], sfx: [[.12, "slide"], [.6, "pop", 1]],
  init(L) { BG.tiles(L.bg); this.leg = H.grp(L.mid, 540, 960, { j: .3 }); H.el("path", { d: LEG, fill: C.skin, filter: "url(#sh2)", stroke: "#fff", "stroke-opacity": ".22", "stroke-width": 2.2 }, this.leg);
    this.mk = P.spotGroup(this.leg, Array.from({ length: 12 }, (_, i) => ({ x: -70 + (i * 37) % 160, y: -420 + i * 70, r: 10 + (i % 4) * 3, s: i + 2 })), C.ink);
    this.foam = H.grp(L.mid, 540, 700, { j: .8 }); H.blob(this.foam, 0, 0, 130, 700, "#F4F0E4", { seed: 3, jit: .06 }); this.rz = P.razor(L.mid, 1.4); },
  update(t, p, d, L) { H.look(L, 0, 0, lerp(1.0, 1.14, p)); const y = lerp(300, 1250, E.io(seg(p, .05, .75))); H.set(this.rz, { x: 610, y, r: -8 }); H.set(this.foam, { y: lerp(900, 1130, p), o: 1 - seg(p, .35, .75) * .95 }); P.popAll(this.mk, p, .3, .9); } });
const shotWax = mkShot({ id: "waxC", at: ["hook", 0, 3], sfx: [[.22, "tear"], [.6, "pop", 2]],
  init(L) { BG.wall(L.bg, "#EBD7B5", null, 1350); this.pa = P.patch(L.mid, 540, 860, 380); this.fl = P.flush(this.pa, 330);
    this.mk = P.spotGroup(this.pa, Array.from({ length: 16 }, (_, i) => ({ x: Math.cos(i * 2.4) * (60 + i * 11), y: Math.sin(i * 2.4) * (60 + i * 9), r: 10 + (i % 3) * 4, s: i + 1 })), C.ink);
    this.hair = H.grp(this.pa, 0, 0, { j: .3 }); for (let i = 0; i < 18; i++) H.el("path", { d: `M${-150 + (i % 6) * 60},${-100 + Math.floor(i / 6) * 90} q12,-26 4,-52`, stroke: C.hair, "stroke-width": 5, fill: "none", "stroke-linecap": "round" }, this.hair);
    this.strip = H.grp(L.mid, 540, 860, { j: .5 }); H.rrect(this.strip, -250, -95, 500, 190, "#F4E6B8", { r: 18, seed: 3 }); },
  update(t, p, d, L) { H.look(L, 0, 0, lerp(1.0, 1.08, p)); const rip = E.in(seg(p, .12, .45)); H.set(this.strip, { x: 540 + rip * 60, y: lerp(860, -350, rip), r: -rip * 34, o: p > .46 ? 0 : 1 }); H.set(this.hair, { o: 1 - seg(p, .35, .45) }); H.set(this.fl, { o: seg(p, .42, .6) * (1 - seg(p, .85, 1) * .4) }); P.popAll(this.mk, p, .5, .92); } });
const shotCompare = mkShot({ id: "compare", at: ["hook", 0, 5], sfx: [[.25, "pop", 1], [.55, "pop", 3], [.75, "ding", 0]],
  init(L) { BG.cream(L.bg); this.pa = P.patch(L.mid, 540, 620, 280); this.mk = [[-80, -30, 62], [90, 40, 50], [10, 100, 36]].map((q, i) => P.mark(this.pa, q[0], q[1], q[2], C.ink, i + 3));
    this.c1 = H.grp(L.mid, 330, 1130, { j: .6 }); H.rrect(this.c1, -130, -90, 260, 180, C.skin, { r: 22, seed: 2 }); this.c2 = H.grp(L.mid, 750, 1130, { j: .6 }); H.rrect(this.c2, -130, -90, 260, 180, C.ink, { r: 22, seed: 5 });
    this.ar = P.arrow(L.mid, 160, C.terra, 40); H.set(this.ar, { x: 540, y: 1130, r: 90 }); this.mg = P.magnifier(L.fg, 130); },
  update(t, p, d, L) { H.look(L, 0, 0, lerp(1.0, 1.07, p)); this.mk.forEach((m, i) => { const a = E.pop(seg(p, .08 + i * .08, .22 + i * .08)); H.set(m, { s: a, o: a > 0 ? 1 : 0 }); });
    const m = E.io(seg(p, .25, .6)); H.set(this.mg, { x: lerp(860, 540 - 80 + 40, m), y: lerp(420, 620 - 30 + 40, m), s: 1 + .06 * Math.sin(t * 6), o: p > .22 ? 1 : 0 });
    H.set(this.c1, { s: E.pop(seg(p, .5, .65)), o: p > .5 ? 1 : 0 }); H.set(this.c2, { s: E.pop(seg(p, .6, .75)), o: p > .6 ? 1 : 0 }); H.set(this.ar, { o: p > .72 ? 1 : 0, s: 1 + .1 * Math.sin(t * 8) }); } });

/* ================= D · fond de teint ================= */
const SPOTS_D = [[320, 800], [420, 900], [300, 930], [380, 840], [450, 820], [720, 830], [800, 900], [690, 940], [760, 800], [540, 1040]];
const shotFound = mkShot({ id: "foundation", at: ["hook", 0, 0], sfx: [[.3, "tap"], [.6, "tap"]],
  init(L) { BG.dark(L.bg); this.f = P.face(L.mid); this.ms = SPOTS_D.map((c, i) => P.mark(this.f, c[0], c[1], 20 + (i % 3) * 6, C.mark, i + 3)); this.fd = SPOTS_D.map((c, i) => { const g = H.grp(this.f, c[0], c[1], { j: .4 }); H.blob(g, 0, 0, 48 + (i % 3) * 8, 42 + (i % 2) * 8, FOUND, { seed: i + 20, jit: .1, sh: false, th: 0 }); return g; });
    this.sp = H.grp(this.f, 0, 0, { j: .6 }); H.blob(this.sp, 0, 0, 72, 64, "#E9C9A0", { seed: 7, jit: .05, th: 7 }); for (let i = 0; i < 12; i++) H.circ(this.sp, Math.cos(i * 2.1) * 40, Math.sin(i * 2.7) * 36, 4, "#CFA97C", { sh: false, th: 0 });
    this.bt = H.grp(L.mid, 870, 1230, { j: .6 }); H.rrect(this.bt, -52, -90, 104, 180, "#E9C9A0", { r: 22, seed: 5 }); H.rrect(this.bt, -26, -126, 52, 44, C.dark, { r: 10, sh: "sh1" }); },
  update(t, p, d, L) { H.look(L, 0, 40, lerp(1.2, 1.32, p)); P.popAll(this.ms, p, .02, .3); const r = seg(p, .2, .92), n = this.ms.length;
    const idx = Math.min(n - 1, Math.floor(r * n)), tgt = SPOTS_D[idx], dab = Math.abs(Math.sin(r * n * Math.PI)); H.set(this.sp, { x: tgt[0] + 36, y: tgt[1] + 40 - dab * 30, r: dab * 14 - 7, s: 1 + .12 * (1 - dab), o: r > 0 && r < 1 ? 1 : 0 });
    this.fd.forEach((g, i) => { const a = E.pop(seg(r, i / n, i / n + .09)); H.set(g, { s: a, o: a > 0 ? .96 : 0 }); }); H.set(this.bt, { y: 1230 + Math.sin(t * 2) * 4 }); } });
const shotCover = mkShot({ id: "cover", at: ["hook", 0, 6], sfx: [[.45, "pop", 1]],
  init(L) { BG.dark(L.bg); this.f = P.face(L.mid); this.layer = H.grp(this.f, 0, 0, { j: .3 }); [[P.CHEEK_L[0], P.CHEEK_L[1], 190, 160], [P.CHEEK_R[0], P.CHEEK_R[1], 190, 160], [540, 1020, 150, 90]].forEach((c, i) => H.blob(this.layer, c[0], c[1], c[2], c[3], FOUND, { seed: i + 30, jit: .06, sh: "sh1", th: 4 }));
    this.ms = SPOTS_D.map((c, i) => P.mark(this.f, c[0], c[1], 20 + (i % 3) * 6, C.mark, i + 3)); this.ms.forEach(m => H.set(m, { s: 1, o: 0 })); },
  update(t, p, d, L) { H.look(L, 0, 40, lerp(1.25, 1.12, E.io(p))); H.set(this.layer, { o: 1 }); this.ms.forEach((m, i) => { const a = E.pop(seg(p, .15 + i * .05, .3 + i * .05)); H.set(m, { s: a, o: a > 0 ? .78 : 0 }); }); } });
const shotMirrorD = mkShot({ id: "mirrorD", at: ["hook", 0, 9], sfx: [[.3, "pop", 2], [.6, "pop", 4]],
  init(L) { BG.wall(L.bg, "#EFD8BB", null, 1300); this.cp = P.compact(L.mid, 330); H.set(this.cp, { x: 540, y: 800 });
    const r = H.grp(this.cp, 0, 0, { j: 0 }); H.blob(r, 0, 20, 220, 200, C.skin, { seed: 4, sh: false, th: 0 }); H.blob(r, 0, 90, 190, 110, FOUND, { seed: 6, jit: .05, sh: "sh1", th: 3 });
    this.ms = [[-90, 40, 22], [60, 70, 26], [-20, 120, 18], [110, 10, 16]].map((q, i) => { const m = P.mark(r, q[0], q[1], q[2], C.mark, i + 3); H.set(m, { s: 0 }); return m; });
    this.q = [[200, 520], [880, 560]].map(q => { const g = P.question(L.fg, .3, C.terra); H.set(g, { x: q[0], y: q[1] }); return g; });
    this.sp = H.grp(L.mid, 880, 1180, { j: .6 }); H.blob(this.sp, 0, 0, 90, 80, "#E9C9A0", { seed: 7, jit: .05, th: 7 }); this.bt = H.grp(L.mid, 190, 1190, { j: .6 }); H.rrect(this.bt, -52, -90, 104, 180, "#E9C9A0", { r: 22, seed: 5 }); H.rrect(this.bt, -26, -126, 52, 44, C.dark, { r: 10, sh: "sh1" }); },
  update(t, p, d, L) { H.look(L, 0, 0, lerp(1.0, 1.1, p)); H.set(this.cp, { r: Math.sin(t * 2.2) * 3, s: E.pop(seg(p, 0, .2)) }); this.ms.forEach((m, i) => H.set(m, { s: E.pop(seg(p, .25 + i * .1, .4 + i * .1)) })); this.q.forEach((g, i) => H.set(g, { s: E.pop(seg(p, .6 + i * .12, .78 + i * .12)) * .3, r: Math.sin(t * 6 + i) * 8 })); } });

/* ================= E · peau mate / foncée ================= */
const SKINTONES = ["#F6D7B8", "#EDBE96", "#DCA277", "#C88A5E", "#A96A44", "#8A4F32", "#6B3A25", "#4C2918", "#331A10"];
const shotTones = mkShot({ id: "tones", at: ["hook", 0, 0], sfx: [[.3, "pop", 0], [.55, "pop", 2], [.8, "ding", 1]],
  init(L) { BG.cream(L.bg); this.c = SKINTONES.map((col, i) => { const a = Math.PI * (1.12 + i * .095); const g = H.grp(L.mid, 540 + Math.cos(a) * 380, 960 + Math.sin(a) * 380 * 1.1, { j: .5 }); H.circ(g, 0, 0, 92, col, { sh: "sh", th: 8 }); return g; });
    this.ring = [4, 5, 6, 7, 8].map(i => { const g = H.grp(L.fg, this.c[i]._b.x, this.c[i]._b.y, { j: .6 }); H.circ(g, 0, 0, 112, "none", { sh: false, th: 0, attr: { stroke: C.terra, "stroke-width": 12, "stroke-opacity": 1 } }); return g; });
    this.w = P.woman(L.mid, 540, 1260, .8, { top: C.sage }); },
  update(t, p, d, L) { H.look(L, 0, 0, lerp(1.0, 1.08, p)); this.c.forEach((g, i) => { const a = E.pop(seg(p, .02 + i * .05, .14 + i * .05)); H.set(g, { s: a, o: a > 0 ? 1 : 0 }); }); this.ring.forEach((g, i) => { const a = E.pop(seg(p, .4 + i * .08, .52 + i * .08)); H.set(g, { s: a * (1 + .05 * Math.sin(t * 7 + i)), o: a > 0 ? 1 : 0 }); }); H.set(this.w, { y: 1260 + Math.sin(t * 2.4) * 5 }); } });
const shotShelf = mkShot({ id: "shelf", at: ["hook", 0, 4], sfx: [[.2, "stamp"], [.5, "stamp"], [.8, "stamp"]],
  init(L) { BG.wall(L.bg, "#EBCDBE", null, 1500); this.po = [[190, 360, "#E8C56A"], [540, 340, "#B5683A"], [890, 360, "#3a2a22"]].map((q, i) => poster(L.bg, q[0], q[1], q[2], i)); P.shelfBoard(L.mid, 1020);
    this.it = [P.tube(L.mid, C.blue, 150, 800), P.jar(L.mid, C.terra, 330, 940), P.serum(L.mid, "#9CBF9A", .8), P.tube(L.mid, C.plum, 700, 800), P.jar(L.mid, C.cardboard, 880, 940)]; H.set(this.it[2], { x: 520, y: 880 });
    this.x = [0, 1, 2, 3, 4].map(i => { const g = P.cross(L.fg, 100, C.red); H.set(g, { x: this.it[i]._b.x, y: this.it[i]._b.y - (i === 0 || i === 3 ? 0 : 20) }); return g; }); },
  update(t, p, d, L) { H.look(L, 0, 0, lerp(1.0, 1.07, p)); this.it.forEach((g, i) => { const a = E.back(seg(p, .02 + i * .05, .14 + i * .05)); H.set(g, { y: lerp(-300, g._b.y0 === undefined ? (g._b.y0 = g._b.y) : g._b.y0, a), o: a > 0 ? 1 : 0 }); });
    this.x.forEach((g, i) => { const a = E.back(seg(p, .3 + i * .13, .4 + i * .13)); H.set(g, { s: lerp(2.6, 1, a), o: a > 0 ? 1 : 0 }); }); } });
const shotStainE = mkShot({ id: "stainE", at: ["hook", 0, 9], sfx: [[.3, "thud"], [.55, "thud"], [.8, "pop", 2]],
  init(L) { BG.cream(L.bg); this.pa = P.patch(L.mid, 540, 800, 300); this.mk = P.mark(this.pa, 20, 10, 80, C.ink, 4);
    this.it = [P.tube(L.mid, C.blue, 0, 0), P.jar(L.mid, C.terra, 0, 0), P.serum(L.mid, "#9CBF9A", .8), P.tube(L.mid, C.plum, 0, 0)]; this.st = [[-200, 300], [1280, 380], [-200, 1250], [1280, 1230]];
    this.q = [[170, 560], [900, 520]].map(q => { const g = P.question(L.fg, .3, C.terra); H.set(g, { x: q[0], y: q[1] }); return g; }); },
  update(t, p, d, L) { H.look(L, 0, 0, lerp(1.0, 1.06, p)); this.it.forEach((g, i) => { const a = seg(p, .05 + i * .1, .55 + i * .08), k = a < .5 ? E.in(a * 2) : 1 - E.out((a - .5) * 2); const s = this.st[i]; H.set(g, { x: lerp(s[0], 540 + (s[0] < 0 ? -380 : 380), k), y: lerp(s[1], 800 + (s[1] < 800 ? -240 : 240), k), r: (i % 2 ? 1 : -1) * 220 * a, o: a > 0 && a < 1 ? 1 : 0 }); }); H.set(this.mk, { s: 1 + .06 * Math.sin(t * 5) }); this.q.forEach((g, i) => H.set(g, { s: E.pop(seg(p, .6 + i * .12, .78 + i * .12)) * .3, r: Math.sin(t * 6 + i) * 8 })); } });

/* ================= F · « j'ai tout essayé » ================= */
const patchF = (L, self) => { self.pa = P.patch(L.mid, 540, 860, 300); self.mk = P.mark(self.pa, 20, 10, 78, C.ink, 4); };
const shotLemon = mkShot({ id: "lemon", at: ["hook", 0, 0], sfx: [[.4, "pop", 3]],
  init(L) { BG.cream(L.bg); patchF(L, this); this.lm = P.lemon(L.fg, 130); this.jc = Array.from({ length: 6 }, (_, i) => { const q = H.grp(L.fg, 0, 0, { j: .4 }); H.blob(q, 0, 0, 10, 15, "#F5E36A", { seed: i, jit: .1, sh: "sh1", th: 2 }); return q; }); },
  update(t, p, d, L) { H.look(L, 0, 0, lerp(1.0, 1.08, p)); const a = E.back(seg(p, .0, .45)); H.set(this.lm, { x: lerp(980, 560, a), y: lerp(240, 800, a), r: lerp(40, -10, a), s: 1 + .1 * Math.sin(t * 9), o: 1 }); this.jc.forEach((q, i) => { const k = seg(p, .4 + i * .04, 1); H.set(q, { x: 540 + (i - 2.5) * 50, y: 840 + k * 360 + (i % 2) * 40, o: k > 0 ? 1 - k * .5 : 0 }); }); H.set(this.mk, { s: 1 + .05 * Math.sin(t * 6) }); } });
const shotScrubF = mkShot({ id: "scrubF", at: ["hook", 0, 1], sfx: [[.2, "rub"]],
  init(L) { BG.cream(L.bg); patchF(L, this); this.gl = P.scrubHand(L.fg); this.jar = P.scrubJar(L.mid); H.set(this.jar, { x: 880, y: 1230 }); },
  update(t, p, d, L) { H.look(L, 0, 0, lerp(1.0, 1.08, p)); const th = seg(p, .05, 1) * Math.PI * 2 * 3; H.set(this.gl, { x: 560 + Math.cos(th) * 90, y: 840 + Math.sin(th) * 70, r: Math.sin(th) * 10, s: 1.5, o: p > .02 ? 1 : 0 }); H.set(this.mk, { s: 1 + .04 * Math.sin(t * 6) }); } });
const shotVitC = mkShot({ id: "vitc", at: ["hook", 0, 2], sfx: [[.3, "pop", 1], [.55, "pop", 3]],
  init(L) { BG.cream(L.bg); patchF(L, this); this.sv = P.serum(L.fg, "#E58A2B", 1.1); this.or = P.ico.orange(L.mid); H.set(this.or, { x: 180, y: 1000, s: 1.6 });
    this.dr = Array.from({ length: 4 }, (_, i) => { const q = H.grp(L.fg, 0, 0, { j: .3 }); H.blob(q, 0, 0, 14, 20, "#F5A83A", { seed: i, jit: .06, sh: "sh1", th: 2 }); return q; }); },
  update(t, p, d, L) { H.look(L, 0, 0, lerp(1.0, 1.07, p)); const a = E.back(seg(p, 0, .3)); H.set(this.sv, { x: lerp(1200, 760, a), y: 360 + Math.sin(t * 3) * 6, r: lerp(40, 28, a), o: 1 }); H.set(this.or, { s: E.pop(seg(p, .1, .35)) * 1.6, o: p > .1 ? 1 : 0, r: Math.sin(t * 2) * 6 });
    this.dr.forEach((q, i) => { const k = seg(p, .3 + i * .14, .52 + i * .14); H.set(q, { x: 650 - i * 20, y: lerp(560, 840, E.in(k)), s: 1 - k * .3, o: k > 0 && k < 1 ? 1 : 0 }); }); H.set(this.mk, { s: 1 + .04 * Math.sin(t * 6) }); } });
const shotAllX = mkShot({ id: "allX", at: ["hook", 0, 4], sfx: [[.25, "stamp"], [.6, "stamp"]],
  init(L) { BG.wall(L.bg, "#EBD9B5", null, 1300); P.shelfBoard(L.mid, 1000); this.it = [P.lemon(L.mid, 90), P.scrubJar(L.mid), P.serum(L.mid, "#E58A2B", .8), P.tube(L.mid, C.blue, 0, 0), P.jar(L.mid, C.terra, 0, 0)];
    [[150, 900, .9], [390, 880, .55], [560, 860, .8], [770, 770, 1], [930, 920, .9]].forEach((q, i) => H.set(this.it[i], { x: q[0], y: q[1], s: q[2] })); this.x = this.it.map((g, i) => { const c = P.cross(L.fg, 90, C.red); H.set(c, { x: g._b.x, y: g._b.y }); return c; }); },
  update(t, p, d, L) { H.look(L, 0, 0, lerp(1.0, 1.06, p)); this.it.forEach((g, i) => { const a = E.back(seg(p, .0 + i * .05, .14 + i * .05)); H.set(g, { y: lerp(-300, g._b.y0 === undefined ? (g._b.y0 = g._b.y) : g._b.y0, a), o: a > 0 ? 1 : 0 }); }); this.x.forEach((g, i) => { const a = E.back(seg(p, .22 + i * .12, .32 + i * .12)); H.set(g, { s: lerp(2.6, 1, a), o: a > 0 ? 1 : 0 }); }); } });
const shotStillF = mkShot({ id: "stillF", at: ["hook", 0, 8], sfx: [[.15, "stamp"], [.5, "pop", 1]],
  init(L) { BG.cream(L.bg); this.bu = P.burst(L.bg, 340, 480, 14, C.red); H.set(this.bu, { x: 540, y: 800 }); patchF(L, this); this.q = [[220, 380], [860, 360], [190, 1150]].map(q => { const g = P.question(L.fg, .3, C.terra); H.set(g, { x: q[0], y: q[1] }); return g; }); },
  update(t, p, d, L) { const sk = p < .4 ? 1 : 0; H.look(L, Math.sin(t * 50) * 4 * sk, Math.cos(t * 43) * 3 * sk, lerp(1.0, 1.1, p)); H.set(this.bu, { r: t * 30, s: E.pop(seg(p, .05, .3)) * (1 + .05 * Math.sin(t * 10)), o: p > .05 ? 1 : 0 }); H.set(this.mk, { s: 1 + .25 * E.in(p) }); this.q.forEach((g, i) => H.set(g, { s: E.pop(seg(p, .4 + i * .12, .55 + i * .12)) * .3, r: Math.sin(t * 6 + i) * 8 })); } });

const HOOKSHOTS = {
  A: ["pop", "stay", "mirror"].map(id => SHOTS.find(s => s.id === id)),
  B: [shotPreg, shotMask, shotMaskTime],
  C: [shotShave, shotWax, shotCompare],
  D: [shotFound, shotCover, shotMirrorD],
  E: [shotTones, shotShelf, shotStainE],
  F: [shotLemon, shotScrubF, shotVitC, shotAllX, shotStillF]
};
