/* Bibliothèque de hooks : chaque variante = plans d'ouverture (calés sur les mots du hook) ; le corps de la pub reste identique. */
const mkShot = o => o;
const reuse = (id, at, tag) => {   // réutilise un plan existant, sans son badge numéroté
  const o = SHOTS.find(s => s.id === id);
  return Object.assign({}, o, { id: id + "_" + tag, at, update(t, p, d, L) { o.update.call(this, t, p, d, L); if (this.b) H.set(this.b, { o: 0 }); } });
};
const FOUND = "#C08A5E";

/* B1 · « Depuis ta grossesse, » : buste avec ventre rond, taches symétriques sur les joues */
const shotPreg = mkShot({ id: "preg", at: ["hook", 0, 0], sfx: [[.5, "pop", 1], [.72, "pop", 3]],
  init(L) { BG.wall(L.bg, "#F0DAB8", null, 1250); this.w = P.woman(L.mid, 540, 960, 1.45, { top: "#E8A87C" });
    this.belly = H.grp(this.w.s, 0, 230, { j: .4 }); H.blob(this.belly, 0, 0, 190, 150, "#EDB48C", { seed: 4, th: 8 }); H.blob(this.belly, -50, -40, 90, 60, "#F7D0AE", { seed: 5, sh: false, th: 0, attr: { opacity: .55 } });
    this.mk = P.spotGroup(this.w.head, [[-58, 24, 17], [-74, 44, 12], [-42, 50, 12], [-62, 62, 9], [58, 24, 17], [74, 44, 12], [42, 50, 12], [62, 62, 9]].map((q, i) => ({ x: q[0], y: q[1], r: q[2], s: i + 2 })));
    this.cf = P.confetti(L.fg, 0, 1, [C.cream]); },
  update(t, p, d, L) { H.look(L, 0, lerp(0, 50, p), lerp(1.0, 1.1, E.io(p))); H.set(this.w, { y: 960 + Math.sin(t * 2.6) * 6 }); H.set(this.belly, { s: 1 + .015 * Math.sin(t * 3) });
    const h = E.io(seg(p, .05, .4)); H.set(this.w.armL, { r: lerp(0, 20, h) }); H.set(this.w.armL.fore, { r: lerp(0, -60, h) }); H.set(this.w.armR, { r: lerp(0, -20, h) }); H.set(this.w.armR.fore, { r: lerp(0, 60, h) });
    H.set(this.w.head, { r: Math.sin(t * 2) * 2 }); P.popAll(this.mk, p, .35, .75); } });

/* B2 · « ce masque foncé sur tes joues » : gros plan, deux taches symétriques en ailes de papillon */
const shotMask = mkShot({ id: "mask", at: ["hook", 0, 3], sfx: [[.22, "stamp"], [.5, "tap"]],
  init(L) { BG.dark(L.bg); this.f = P.face(L.mid); const mk = (x, y, r, rot, id) => { const g = H.grp(this.f, x, y, { j: .5 }); g._b.r = rot; H.blob(g, 0, 0, 135, 82, "#5A3524", { n: 20, jit: .1, seed: id, th: 3, attr: { opacity: .92 } }); return g; };
    this.pl = mk(P.CHEEK_L[0] - 10, P.CHEEK_L[1] + 120, 1, -22, 3); this.pr = mk(P.CHEEK_R[0] + 10, P.CHEEK_R[1] + 120, 1, 22, 5);
    this.br = H.grp(this.f, 540, 1010, { j: .5 }); H.blob(this.br, 0, 0, 38, 20, "#5A3524", { n: 14, jit: .1, seed: 8, th: 2, attr: { opacity: .0 } });
    this.sp = P.spotGroup(this.f, P.spots(10, 41, 540, 860, 330, 190, 7, 13).filter(s => Math.hypot(s.x - 540, (s.y - 860) * 1.4) > 200), "#5A3524"); },
  update(t, p, d, L) { H.look(L, 0, 40, lerp(1.0, 1.26, E.io(p))); H.set(this.pl, { s: E.pop(seg(p, .12, .42)), o: p > .12 ? 1 : 0 }); H.set(this.pr, { s: E.pop(seg(p, .2, .5)), o: p > .2 ? 1 : 0 }); H.set(this.br, { s: E.pop(seg(p, .34, .56)), o: p > .34 ? 1 : 0 }); P.popAll(this.sp, p, .5, .9); } });

/* D1 · « Tu mets du fond de teint » : une éponge tamponne, le fond de teint recouvre les marques */
const SPOTS_D = [[320, 800], [420, 900], [300, 930], [380, 840], [450, 820], [720, 830], [800, 900], [690, 940], [760, 800], [540, 1040]];
const shotFound = mkShot({ id: "foundation", at: ["hook", 0, 0], sfx: [[.3, "tap"], [.5, "tap"], [.7, "tap"]],
  init(L) { BG.dark(L.bg); this.f = P.face(L.mid); this.ms = SPOTS_D.map((c, i) => P.mark(this.f, c[0], c[1], 20 + (i % 3) * 6, C.mark, i + 3)); this.fd = SPOTS_D.map((c, i) => { const g = H.grp(this.f, c[0], c[1], { j: .4 }); H.blob(g, 0, 0, 48 + (i % 3) * 8, 42 + (i % 2) * 8, FOUND, { seed: i + 20, jit: .1, sh: false, th: 0 }); return g; });
    this.sp = H.grp(this.f, 0, 0, { j: .6 }); H.blob(this.sp, 0, 0, 72, 64, "#E9C9A0", { seed: 7, jit: .05, th: 7 }); for (let i = 0; i < 12; i++) H.circ(this.sp, Math.cos(i * 2.1) * 40, Math.sin(i * 2.7) * 36, 4, "#CFA97C", { sh: false, th: 0 });
    this.bt = H.grp(L.mid, 870, 1230, { j: .6 }); H.rrect(this.bt, -52, -90, 104, 180, "#E9C9A0", { r: 22, seed: 5 }); H.rrect(this.bt, -26, -126, 52, 44, C.dark, { r: 10, sh: "sh1" }); },
  update(t, p, d, L) { H.look(L, 0, 40, lerp(1.2, 1.32, p)); P.popAll(this.ms, p, .02, .3); const r = seg(p, .2, .92), n = this.ms.length;
    const idx = Math.min(n - 1, Math.floor(r * n)), tgt = SPOTS_D[idx], dab = Math.abs(Math.sin(r * n * Math.PI)); H.set(this.sp, { x: tgt[0] + 36, y: tgt[1] + 40 - dab * 30, r: dab * 14 - 7, s: 1 + .12 * (1 - dab), o: r > 0 && r < 1 ? 1 : 0 });
    this.fd.forEach((g, i) => { const a = E.pop(seg(r, i / n, i / n + .09)); H.set(g, { s: a, o: a > 0 ? .96 : 0 }); }); H.set(this.bt, { y: 1230 + Math.sin(t * 2) * 4 }); } });

/* D2 · « juste pour cacher tes taches ? » : les taches transparaissent sous le fond de teint */
const shotCover = mkShot({ id: "cover", at: ["hook", 0, 6], sfx: [[.45, "pop", 1], [.65, "pop", 3]],
  init(L) { BG.dark(L.bg); this.f = P.face(L.mid); this.layer = H.grp(this.f, 0, 0, { j: .3 }); [[P.CHEEK_L[0], P.CHEEK_L[1], 190, 160], [P.CHEEK_R[0], P.CHEEK_R[1], 190, 160], [540, 1020, 150, 90]].forEach((c, i) => H.blob(this.layer, c[0], c[1], c[2], c[3], FOUND, { seed: i + 30, jit: .06, sh: "sh1", th: 4 }));
    this.ms = SPOTS_D.map((c, i) => P.mark(this.f, c[0], c[1], 20 + (i % 3) * 6, C.mark, i + 3)); this.ms.forEach(m => H.set(m, { s: 1, o: 0 }));
    this.q = [[220, 560], [860, 520], [180, 1100]].map((q, i) => { const g = P.question(L.fg, .28, C.cream); H.set(g, { x: q[0], y: q[1] }); return g; }); },
  update(t, p, d, L) { H.look(L, 0, 40, lerp(1.25, 1.12, E.io(p))); H.set(this.layer, { o: 1 }); this.ms.forEach((m, i) => { const a = E.pop(seg(p, .15 + i * .05, .3 + i * .05)); H.set(m, { s: a, o: a > 0 ? .78 : 0 }); }); this.q.forEach((g, i) => H.set(g, { s: E.pop(seg(p, .5 + i * .12, .66 + i * .12)) * .28, r: Math.sin(t * 6 + i) * 8 })); } });

const HOOKSHOTS = {
  A: ["pop", "stay", "mirror"].map(id => SHOTS.find(s => s.id === id)),
  B: [shotPreg, shotMask],
  C: [reuse("razor", ["hook", 0, 0], "C"), reuse("wax", ["hook", 0, 3], "C"), reuse("darker", ["hook", 0, 5], "C")],
  D: [shotFound, shotCover],
  E: [reuse("pale", ["hook", 0, 0], "E"), reuse("xtubes", ["hook", 0, 4], "E")],
  F: [reuse("random", ["hook", 0, 0], "F"), reuse("xtubes", ["hook", 0, 4], "F"), reuse("worse", ["hook", 0, 9], "F")]
};
