/* Scènes 1 à 8 : douleur, signes, bascule */
const {E, lerp, seg, clamp} = H;
const SCN = {};

/* ---------- composants communs ---------- */
function faceCrop(g, o = {}) {
  const f = H.grp(g, 0, 0, { j: .35 });
  H.blob(f, 540, 540, 520, 560, C.hair, { seed: 2 });
  H.blob(f, 540, 1760, 700, 360, C.sage, { seed: 3 });
  H.poly(f, [[380, 1000], [700, 1000], [770, 1560], [310, 1560]], C.skinD, { seed: 4 });
  H.blob(f, 128, 760, 52, 86, C.skinD, { seed: 5 }); H.blob(f, 952, 760, 52, 86, C.skinD, { seed: 6 });
  H.blob(f, 540, 700, 410, 530, C.skin, { seed: 7, jit: .025, sh: "sh" });
  H.poly(f, [[120, 650], [160, 420], [300, 255], [540, 205], [780, 255], [920, 420], [960, 650], [880, 520], [720, 410], [540, 378], [360, 410], [200, 520]], C.hair, { seed: 8, jit: 4 });
  return f;
}
const CHEEK_L = [360, 840], CHEEK_R = [725, 840];
function markSpots(n, seed = 11) {
  const r = H.rng(seed), out = [];
  const zones = [[CHEEK_L[0], CHEEK_L[1], 120, 130, .42], [CHEEK_R[0], CHEEK_R[1], 120, 130, .38], [540, 1090, 95, 55, .12], [540, 560, 150, 40, .08]];
  while (out.length < n) {
    let a = r(), z = zones[0], acc = 0; for (const zz of zones) { acc += zz[4]; if (a <= acc) { z = zz; break; } }
    const ang = r() * 6.283, rad = Math.sqrt(r());
    out.push({ x: z[0] + Math.cos(ang) * z[2] * rad, y: z[1] + Math.sin(ang) * z[3] * rad, r: 9 + r() * 15, s: r() * 99 });
  }
  return out;
}
function markGroup(parent, spots, col = C.mark) {
  return spots.map(s => { const m = H.grp(parent, s.x, s.y, { j: .6 }); H.blob(m, 0, 0, s.r, s.r * (.82 + (s.s % 3) / 12), col, { n: 11, jit: .22, seed: Math.floor(s.s), sh: "sh1" }); return m; });
}
function popMarks(ms, p, a = 0, b = 1) {
  const n = ms.length;
  ms.forEach((m, i) => { const t = H.clamp((p - (a + (b - a) * (i / n))) / .06); H.set(m, { s: E.pop(t), o: t > 0 ? 1 : 0 }); });
}
function badge(g, n) {
  const b = H.grp(g, 140, 250, { j: .8 });
  H.el("path", { d: H.d(H.star(0, 0, 100, 112, 18)), fill: C.terra, filter: "url(#sh)", stroke: "#fff", "stroke-opacity": ".25", "stroke-width": 2 }, b);
  H.txt(b, String(n), 0, 38, 118, C.cream, { w: 800 });
  return b;
}
function slideIn(b, p, a = 0, dur = .12, from = [-400, 0]) { const t = E.back(H.seg(p, a, a + dur)); H.set(b, { x: lerp(b._home[0] + from[0], b._home[0], t), y: lerp(b._home[1] + from[1], b._home[1], t), o: t > 0 ? 1 : 0 }); }
function mkBadge(g, n) { const b = badge(g, n); b._home = [b._b.x, b._b.y]; return b; }

/* petite personne (bureau) */
function person(parent, x, y, sc, skin, hair, top) {
  const g = H.grp(parent, x, y, { j: .6 }); const s = H.grp(g); H.set(s, { s: sc });
  H.rrect(s, -150, 60, 300, 330, top, { r: 90, seed: 3 });
  H.rrect(s, -38, 10, 76, 90, skin, { r: 20, seed: 4, sh: "sh1" });
  H.blob(s, 0, -80, 118, 140, hair, { seed: 5 });
  H.blob(s, 0, -62, 100, 124, skin, { seed: 6, sh: "sh1" });
  H.poly(s, [[-110, -80], [-88, -170], [0, -218], [88, -170], [110, -80], [64, -128], [0, -146], [-64, -128]], hair, { seed: 7, jit: 2, sh: false });
  return g;
}

/* ================= 1 · HOOK ================= */
SCN.hook = {
  sfx: [[.02, "paper"], [.18, "pop"], [.3, "pop"], [.42, "pop"], [.52, "whoosh"], [.6, "pop"], [.68, "pop"], [.74, "pop"], [.8, "pop"], [.86, "pop"], [.92, "pop"]],
  init(g) {
    // plan A : bureau
    const A = this.A = H.grp(g, 0, 0, { j: 0 });
    H.rrect(A, -30, -30, 1140, 1060, "#DCBE92", { r: 0, sh: false, jit: 0 });
    H.rrect(A, 70, 260, 250, 340, "#BDD0C6", { r: 6, sh: "sh1" }); H.rrect(A, 90, 280, 210, 300, "#E9F1EC", { r: 4, sh: false });      // fenêtre
    H.poly(A, [[740, 330], [1010, 330], [1010, 340], [740, 340]], "#8a6a4d", { sh: "sh1" });
    this.col = [person(A, 160, 640, .5, "#8A5A3C", "#2a1b14", "#7A6A8F"), person(A, 930, 600, .5, "#B07A52", "#1d130e", "#C47A58"), person(A, 770, 650, .42, "#6E4630", "#251912", "#5F7A6A")];
    // plante
    const pl = H.grp(A, 960, 960, { j: .8 }); H.rrect(pl, -50, 0, 100, 110, C.terra, { r: 10 }); [-60, -30, 0, 30, 60].forEach((dx, i) => H.poly(pl, [[dx, 0], [dx + 26 * (i % 2 ? 1 : -1), -140 - (i % 3) * 30], [dx + 40, -10]], C.sageD, { seed: i + 2 }));
    // bureau + ordinateur
    H.rrect(A, -30, 1000, 1140, 960, "#6A4228", { r: 0, sh: "sh2", jit: 1 });
    this.she = person(A, 540, 700, 1.0, C.skin, C.hair, C.sage);
    this.marksA = markGroup(this.she, [[-52, -30], [-66, 4], [-40, 12], [-70, -22], [52, -22], [60, 8], [40, 14]].map((q, i) => ({ x: q[0], y: q[1] - 38, r: 7 + (i % 3) * 2, s: i })));
    this.arm = H.grp(this.she, 120, 120, { j: .5 }); H.rrect(this.arm, -40, 0, 82, 250, C.sage, { r: 30, seed: 8 });
    this.fore = H.grp(this.arm, 0, 245, { j: .5 }); H.rrect(this.fore, -38, -400, 76, 400, C.sage, { r: 30, seed: 9 }); H.circ(this.fore, 0, -412, 50, C.skin, { sh: "sh1" });
    const lap = H.grp(A, 250, 1015, { j: .3 }); H.rrect(lap, -230, -30, 460, 30, "#B9B6AC", { r: 5, sh: "sh1" }); H.rrect(lap, -190, -250, 380, 224, "#8E8B83", { r: 10 }); H.circ(lap, 0, -140, 22, "#d9d4c6", { sh: false });
    const mug = H.grp(A, 910, 1000, { j: .6 }); H.rrect(mug, -40, -70, 80, 74, C.cream, { r: 10 }); H.el("path", { d: "M40,-52 q34,10 0,36", stroke: C.cream, "stroke-width": 9, fill: "none" }, mug);
    // plan B : gros plan
    const B = this.B = H.grp(g, 0, 0, { j: 0 });
    this.faceB = faceCrop(B);
    this.spots = markSpots(46); this.marksB = markGroup(this.faceB, this.spots);
    this.camB = B;
  },
  update(t, p, d, g) {
    const cut = .52;
    H.set(this.A, { o: p < cut ? 1 : 0 }); H.set(this.B, { o: p < cut ? 0 : 1 });
    if (p < cut) {
      const q = p / cut;
      H.cam(g, lerp(1, 1.1, E.io(q)), 540, 700);
      const up = E.io(H.seg(q, .08, .42)); H.set(this.fore, { r: lerp(60, -17, up) });
      popMarks(this.marksA, q, .25, .75);
      this.col.forEach((c, i) => H.set(c, { r: Math.sin(t * 3 + i) * 1.2 }));
    } else {
      const q = (p - cut) / (1 - cut);
      H.cam(g, lerp(1.0, 1.22, E.io(q)), 540, 850);
      popMarks(this.marksB, q, .06, .95);
    }
  }
};

/* ================= 2 · INTRO (cinq signes) ================= */
SCN.intro = {
  sfx: [[.02, "paper"], [.1, "stamp"], [.45, "tick"], [.62, "tick"], [.78, "tick"]],
  init(g) {
    this.f = faceCrop(g); this.spots = markSpots(46); this.ms = markGroup(this.f, this.spots); this.ms.forEach(m => H.set(m, { s: 1 }));
    this.tis = H.grp(g, 0, 0, { j: .6 });
    H.poly(this.tis, [[-120, -90], [30, -130], [150, -70], [140, 70], [10, 120], [-130, 60]], "#F6EEDC", { seed: 5, jit: 6, attr: { stroke: "#E0D4B8", "stroke-opacity": 1 } });
    [[-70, -30, 40, 20], [20, 10, 80, 30], [-40, 50, 70, -20]].forEach((l, i) => H.el("path", { d: `M${l[0]},${l[1]} q${l[2]},${l[3]} ${l[2] * 1.2},${-l[3]}`, stroke: "#D9CCAF", "stroke-width": 3, fill: "none" }, this.tis));
    this.b = mkBadge(g, 5);
  },
  update(t, p, d, g) {
    H.cam(g, lerp(1.05, 1.3, E.io(p)), 560, 860);
    slideIn(this.b, p, .02, .16, [-300, -100]);
    const a = E.io(H.seg(p, .12, .3)), dab = p > .3 && p < .78 ? Math.abs(Math.sin((p - .3) * 20)) : 0, away = E.in(H.seg(p, .78, 1));
    const baseX = lerp(1000, CHEEK_R[0] - 90, a) + away * 520, baseY = lerp(560, CHEEK_R[1] - 20 + 20 * dab * 0, a) - away * 200;
    H.set(this.tis, { x: baseX, y: baseY + dab * 28, r: lerp(-30, 12, a) + dab * 4, o: 1 });
  }
};

/* ================= 3 · SIGNE 1 : elles restent des mois ================= */
SCN.s1 = {
  sfx: [[.02, "paper"], [.1, "pop"], [.38, "whoosh"], [.42, "pop"], [.55, "tick"], [.64, "tick"], [.73, "tick"], [.82, "tick"]],
  init(g) {
    this.world = H.grp(g, 0, 0, { j: 0 });
    this.f = faceCrop(this.world);
    this.pim = H.grp(this.f, 640, 860, { j: .8 }); H.circ(this.pim, 0, 0, 34, C.red); H.circ(this.pim, -9, -10, 10, "#F0B098", { sh: false });
    this.mk = H.grp(this.f, 640, 860, { j: .5 }); H.blob(this.mk, 0, 0, 26, 22, C.mark, { n: 11, jit: .2, seed: 3, sh: "sh1" });
    this.cal = H.grp(g, 800, 260, { j: .8 }); this.calp = [];
    H.rrect(this.cal, -150, -30, 300, 330, C.cream, { r: 14, seed: 4 }); H.rrect(this.cal, -150, -30, 300, 82, C.terra, { r: 14, seed: 5, sh: false });
    for (let r = 0; r < 4; r++) for (let c = 0; c < 5; c++) H.rrect(this.cal, -118 + c * 56, 78 + r * 52, 38, 34, "#E4D3A8", { r: 6, sh: false, jit: .6 });
    for (let i = 0; i < 5; i++) { const pg = H.grp(this.cal, 0, -30, { j: 0 }); H.rrect(pg, -150, 0, 300, 330, i % 2 ? "#F2E7BA" : C.cream, { r: 14, seed: 8 + i, sh: "sh1" }); H.rrect(pg, -150, 0, 300, 82, i % 2 ? C.terraD : C.terra, { r: 14, seed: 20 + i, sh: false }); for (let r = 0; r < 4; r++) for (let c = 0; c < 5; c++) H.rrect(pg, -118 + c * 56, 108 + r * 52, 38, 34, "#E4D3A8", { r: 6, sh: false, jit: .6 }); H.txt(pg, String(i + 1) + " mois", 0, 56, 38, C.cream, { w: 700 }); this.calp.push(pg); }
    this.b = mkBadge(g, 1);
  },
  update(t, p, d, g) {
    H.cam(this.world, lerp(1.25, 1.4, E.io(p)), 640, 860); slideIn(this.b, p, .02, .16, [-300, -100]);
    const grow = E.pop(H.seg(p, .1, .22)), fly = E.in(H.seg(p, .36, .62));
    H.set(this.pim, { s: grow * (1 + .08 * Math.sin(t * 12)) * (1 + fly * 2.6), y: 860 - fly * 900, x: 640 + fly * 120, r: fly * 160, o: p < .1 ? 0 : 1 - H.seg(fly, .85, 1) });
    H.set(this.mk, { s: E.pop(H.seg(p, .42, .52)) * (1 + .12 * H.seg(p, .6, 1)), o: p > .42 ? 1 : 0 });
    H.set(this.cal, { o: 1 }); const nP = this.calp.length;
    this.calp.forEach((pg, i) => { const a = E.io(H.seg(p, .38 + i * .105, .38 + i * .105 + .1)); H.set(pg, { sy: 1 - a, o: a >= 1 ? 0 : 1 }); });
  }
};

/* ================= 4 · SIGNE 2 : brunes ou violacées ================= */
SCN.s2 = {
  sfx: [[.02, "paper"], [.12, "pop"], [.2, "pop"], [.45, "whoosh"], [.75, "tick"]],
  init(g) {
    this.world = H.grp(g, 0, 0, { j: 0 });
    const mk = (cx, col, id) => { const d = H.grp(this.world, cx, 800, { j: .6 }); H.blob(d, 0, 0, 215, 215, C.skin, { seed: id, sh: "sh2" }); H.blob(d, 0, 0, 215, 215, "none", { sh: false, attr: { stroke: C.skinD, "stroke-width": 8, "stroke-opacity": .5 } }); const m = H.grp(d, 10, 0, { j: .5 }); H.blob(m, 0, 0, 84, 78, col, { n: 13, jit: .12, seed: id + 3, sh: "sh1" }); return { d, m }; };
    this.L = mk(290, C.red, 4); this.R = mk(790, C.plum, 6);
    H.rrect(this.world, 150, 1090, 280, 18, C.terraD, { sh: false, r: 8 }); H.rrect(this.world, 650, 1090, 280, 18, C.plum, { sh: false, r: 8 });
    this.b = mkBadge(g, 2);
  },
  update(t, p, d, g) {
    H.cam(this.world, lerp(1.0, 1.06, p), 540, 800); slideIn(this.b, p, .02, .16, [-300, -100]);
    const a = E.pop(H.seg(p, .06, .22)); H.set(this.L.d, { s: a, o: a > 0 ? 1 : 0 }); H.set(this.R.d, { s: E.pop(H.seg(p, .12, .28)), o: p > .12 ? 1 : 0 });
    const fade = E.io(H.seg(p, .42, .7)); H.set(this.L.m, { s: lerp(1, .15, fade), o: 1 - fade * .95 }); H.set(this.R.m, { s: 1 + .06 * Math.sin(t * 5) });
  }
};

/* ================= 5 · SIGNE 3 : rasage, épilation ================= */
SCN.s3 = {
  sfx: [[.02, "paper"], [.12, "slide"], [.3, "pop"], [.38, "pop"], [.5, "whoosh"], [.58, "slide"], [.68, "pop"], [.76, "pop"], [.84, "pop"]],
  init(g) {
    const A = this.A = H.grp(g, 0, 0, { j: 0 });                       // salle de bain
    H.rrect(A, -20, -20, 1120, 1300, "#8FA58A", { r: 0, sh: false, jit: 0 });
    for (let i = 0; i < 12; i++) H.el("path", { d: `M${i * 100},0 V1300`, stroke: "#7A9276", "stroke-width": 3 }, A); for (let j = 0; j < 14; j++) H.el("path", { d: `M0,${j * 100} H1100`, stroke: "#7A9276", "stroke-width": 3 }, A);
    H.rrect(A, 190, 240, 700, 860, C.cream, { r: 60, seed: 3 }); H.rrect(A, 225, 275, 630, 790, "#C9D9D2", { r: 44, seed: 4, sh: false });
    const hd = H.grp(A, 540, 760, { j: .4 }); H.blob(hd, 0, 0, 230, 290, C.skin, { sh: "sh1" }); H.blob(hd, 0, -150, 250, 170, C.hair, { sh: false });
    H.poly(hd, [[-250, -80], [-170, -230], [0, -300], [170, -230], [250, -80], [140, -190], [0, -215], [-140, -190]], C.hair, { sh: false });
    this.chinMarks = markGroup(hd, [[-60, 170], [0, 195], [60, 170], [-100, 130], [100, 130], [0, 150]].map((q, i) => ({ x: q[0], y: q[1], r: 10 + (i % 3) * 3, s: i + 5 })));
    this.razor = H.grp(hd, 0, 190, { j: .5 }); H.rrect(this.razor, -60, -26, 120, 52, C.greyD, { r: 10 }); H.rrect(this.razor, 56, -14, 150, 28, C.blue, { r: 10, sh: false }); H.rrect(this.razor, -54, 20, 108, 8, "#d9d4c6", { r: 3, sh: false });
    const Bg = this.B = H.grp(g, 0, 0, { j: 0 });                       // jambe
    H.rrect(Bg, -20, -20, 1120, 1300, C.paper, { r: 0, sh: false, jit: 0 });
    this.leg = H.grp(Bg, 540, 760, { j: .3 }); H.el("path", { d: "M-150,-520 C-210,-220 -150,60 -85,420 C-70,500 -80,560 -60,610 L95,610 C125,560 92,470 100,400 C150,100 215,-230 150,-520 Z", fill: C.skin, filter: "url(#sh2)", stroke: "#fff", "stroke-opacity": ".22", "stroke-width": 2.2 }, this.leg);
    this.legMarks = markGroup(this.leg, Array.from({ length: 12 }, (_, i) => ({ x: -70 + (i * 37) % 160, y: -300 + i * 62, r: 9 + (i % 4) * 3, s: i + 2 })));
    this.razor2 = H.grp(Bg, 540, 400, { j: .5 }); H.rrect(this.razor2, -60, -26, 120, 52, C.greyD, { r: 10 }); H.rrect(this.razor2, 56, -14, 150, 28, C.blue, { r: 10, sh: false });
    this.b = mkBadge(g, 3);
  },
  update(t, p, d, g) {
    H.set(this.A, { o: p < .5 ? 1 : 0 }); H.set(this.B, { o: p < .5 ? 0 : 1 }); slideIn(this.b, p, .02, .16, [-300, -100]);
    H.cam(g, lerp(1, 1.08, p % .5 * 2), 540, 760);
    if (p < .5) { const q = p / .5; H.set(this.razor, { x: lerp(-170, 170, (E.io((q * 2.6) % 1))) * (Math.floor(q * 2.6) % 2 ? -1 : 1), y: 190 }); popMarks(this.chinMarks, q, .3, .9); }
    else { const q = (p - .5) / .5; H.set(this.razor2, { y: lerp(280, 1040, E.io(H.seg(q, 0, .7))), x: 600 }); popMarks(this.legMarks, q, .25, .95); }
  }
};

/* ================= 6 · SIGNE 4 : gommages, produits au hasard ================= */
SCN.s4 = {
  sfx: [[.02, "paper"], [.12, "pop"], [.2, "pop"], [.28, "pop"], [.4, "rub"], [.7, "rub"]],
  init(g) {
    this.world = H.grp(g, 0, 0, { j: 0 });
    this.f = faceCrop(this.world); this.mk = H.grp(this.f, 640, 860, { j: .5 }); H.blob(this.mk, 0, 0, 34, 30, C.mark, { n: 11, jit: .2, seed: 4, sh: "sh1" });
    this.glove = H.grp(this.f, 640, 860, { j: .6 }); H.rrect(this.glove, -110, -90, 220, 190, C.cream, { r: 70, seed: 7 }); H.rrect(this.glove, -130, 60, 260, 56, C.terra, { r: 16, seed: 8, sh: "sh1" }); H.blob(this.glove, 70, -105, 34, 52, C.cream, { seed: 9, sh: "sh1" });
    for (let i = 0; i < 6; i++) H.circ(this.glove, -60 + i * 24, -20 + (i % 3) * 28, 6, "#D9C894", { sh: false });
    this.prod = [];
    [[110, "bottle", C.blue], [960, "jar", C.sage], [260, "tube", C.terra], [850, "bottle", C.plum], [540, "jar", C.cardboard]].forEach((q, i) => {
      const pr = H.grp(g, q[0], -200, { j: .7 }); pr._tx = q[0]; pr._ty = 160 + (i % 2) * 90 + (i > 2 ? 110 : 0);
      if (q[1] === "bottle") { H.rrect(pr, -42, -70, 84, 140, q[2], { r: 18 }); H.rrect(pr, -20, -105, 40, 40, C.cream, { r: 8, sh: "sh1" }); }
      else if (q[1] === "jar") { H.rrect(pr, -62, -34, 124, 96, q[2], { r: 16 }); H.rrect(pr, -68, -62, 136, 34, C.cream, { r: 10, sh: "sh1" }); }
      else { H.poly(pr, [[-40, -80], [40, -80], [48, 70], [-48, 70]], q[2]); H.rrect(pr, -34, -112, 68, 38, C.cream, { r: 8, sh: "sh1" }); }
      this.prod.push(pr);
    });
    this.b = mkBadge(g, 4);
  },
  update(t, p, d, g) {
    H.cam(this.world, lerp(1.3, 1.45, p), 640, 860); slideIn(this.b, p, .02, .16, [-300, -100]);
    this.prod.forEach((pr, i) => { const a = E.bounce(H.seg(p, .08 + i * .06, .26 + i * .06)); H.set(pr, { x: pr._tx, y: lerp(-200, pr._ty, a), r: (i % 2 ? 1 : -1) * 14 * (1 - a) }); });
    const rub = H.seg(p, .3, .85), gx = 640 + Math.sin(rub * 34) * 85 * (rub > 0 && rub < 1 ? 1 : 0);
    H.set(this.glove, { x: gx, y: 860 + Math.sin(rub * 17) * 20, r: Math.sin(rub * 34) * 8, o: rub > 0 && rub < 1 ? 1 : 0 });
    H.set(this.mk, { s: lerp(1, 1.9, E.io(H.seg(p, .35, .9))) });
  }
};

/* ================= 7 · SIGNE 5 : rien n'y change / routines pour peaux claires ================= */
function tube(parent, col, x) {
  const g = H.grp(parent, x, 760, { j: .7 }); H.poly(g, [[-62, -210], [62, -210], [72, 200], [-72, 200]], col, { seed: x }); H.poly(g, [[-70, 200], [70, 200], [78, 236], [-78, 236]], C.paperD, { sh: false, seed: 2 }); H.rrect(g, -50, -255, 100, 46, C.cream, { r: 8, sh: "sh1" });
  H.rrect(g, -40, -60, 80, 140, C.cream, { r: 6, sh: false }); H.blob(g, 0, -10, 24, 28, "#F1C9A4", { sh: false }); H.blob(g, 0, -34, 26, 18, "#7a5a3a", { sh: false });
  return g;
}
SCN.s5 = {
  sfx: [[.02, "paper"], [.1, "stamp"], [.2, "stamp"], [.3, "stamp"], [.4, "stamp"], [.5, "stamp"], [.6, "paper"], [.62, "whoosh"], [.82, "pop"]],
  init(g) {
    this.world = H.grp(g, 0, 0, { j: 0 });
    this.tubes = [C.blue, C.terra, C.sage, C.plum, C.cardboard].map((c, i) => tube(this.world, c, 120 + i * 210));
    this.xs = this.tubes.map((t, i) => { const x = H.grp(this.world, 120 + i * 210, 760, { j: .6 }); H.poly(x, [[-80, -50], [-60, -76], [80, 50], [60, 76]], C.red, { seed: i + 3, jit: 1.5 }); H.poly(x, [[80, -50], [60, -76], [-80, 50], [-60, 76]], C.red, { seed: i + 9, jit: 1.5, sh: false }); return x; });
    this.disc = H.grp(this.world, 540, 760, { j: .6 }); H.blob(this.disc, 0, 0, 280, 280, C.skin, { seed: 4, sh: "sh2" });
    this.dm = markGroup(this.disc, markSpots(20, 21).map(s => ({ x: (s.x - 540) * .7, y: (s.y - 840) * .9, r: s.r * .8, s: s.s })));
    this.b = mkBadge(g, 5);
  },
  update(t, p, d, g) {
    H.cam(this.world, 1, 540, 760); slideIn(this.b, p, .02, .12, [-300, -100]);
    this.tubes.forEach((tb, i) => { const a = E.back(H.seg(p, .02 + i * .03, .12 + i * .03)); const out = E.in(H.seg(p, .6 + i * .015, .84)); H.set(tb, { y: lerp(-300, 760, a) + out * 1400, o: a > 0 ? 1 : 0, r: out * (i - 2) * 15 }); });
    this.xs.forEach((x, i) => { const a = E.back(H.seg(p, .1 + i * .1, .17 + i * .1)); const out = E.in(H.seg(p, .6 + i * .015, .84)); H.set(x, { s: lerp(2.4, 1, a), o: a > 0 ? 1 : 0, y: 760 + out * 1400, r: out * (i - 2) * 15 }); });
    const a = E.pop(H.seg(p, .72, .9)); H.set(this.disc, { s: a, o: a > 0 ? 1 : 0 }); popMarks(this.dm, p, .76, .95);
  }
};

/* ================= 8 · BASCULE : sous la peau ================= */
SCN.bascule = {
  sfx: [[.05, "paper"], [.28, "tear"], [.5, "tear"], [.72, "pop"], [.8, "pop"], [.88, "pop"]],
  init(g) {
    this.world = H.grp(g, 0, 0, { j: 0 });
    // coupe de peau
    const sec = this.sec = H.grp(this.world, 0, 0, { j: 0 });
    H.rrect(sec, -20, -20, 1120, 2000, "#6E4630", { r: 0, sh: false, jit: 0 });
    H.rrect(sec, -20, 420, 1120, 300, C.skinL, { r: 0, sh: false, jit: 1 });
    H.rrect(sec, -20, 720, 1120, 560, "#8A5A3C", { r: 0, sh: false, jit: 1 }); H.rrect(sec, -20, 1280, 1120, 700, C.cardboard, { r: 0, sh: false, jit: 1 });
    H.rrect(sec, -20, 380, 1120, 70, "#C9946A", { r: 0, sh: false, jit: 1 });
    this.cells = [];
    for (let i = 0; i < 7; i++) { const c = H.grp(sec, 100 + i * 150, 700 + (i % 2) * 30, { j: .8 }); H.el("path", { d: "M-20,-20 L-70,-70 M20,-20 L70,-60 M0,30 L0,90 M-24,12 L-80,40", stroke: C.mark, "stroke-width": 9, "stroke-linecap": "round", fill: "none" }, c); H.blob(c, 0, 0, 46, 40, C.mark, { n: 12, jit: .1, seed: i + 2, sh: "sh1" }); H.blob(c, 6, -4, 16, 14, "#6b3d24", { sh: false }); this.cells.push(c); }
    // couche visage qui se déchire
    const top = this.top = H.grp(this.world, 0, 0, { j: 0 }); top.setAttribute("clip-path", "url(#peelClip)");
    this.f = faceCrop(top); this.sp = markGroup(this.f, markSpots(46)); this.sp.forEach(m => H.set(m, { s: 1 }));
    this.edge = H.grp(this.world, 0, 0, { j: 0 }); this.edgeP = H.el("path", { d: "", fill: "#F1E4BE", filter: "url(#sh)" }, this.edge);
  },
  update(t, p, d, g) {
    // la déchirure balaie en diagonale : x+y*0.6 < s
    const s = lerp(-120, 1750, E.io(H.seg(p, .12, .62)));
    const poly = []; const N = 18, r = H.rng(5);
    for (let i = 0; i <= N; i++) { const y = -20 + i * (1960 / N), x = (s - y * .55) + (i % 2 ? 22 : -22) + (r() - .5) * 26; poly.push([x, y]); }
    const left = [[1100, -20]].concat(poly).concat([[1100, 1960]]);
    // zone visible du visage = à droite de la déchirure
    document.getElementById("peelPath").setAttribute("d", H.d(left));
    const band = poly.map(([x, y]) => [x - 34, y]).reverse(); this.edgeP.setAttribute("d", H.d(poly.concat(band)));
    H.set(this.edge, { o: p > .12 && p < .66 ? 1 : 0 });
    H.set(this.top, { o: p < .66 ? 1 : 0 });
    const push = E.io(H.seg(p, .5, 1)); H.cam(this.world, lerp(1, 1.5, push), 540, lerp(960, 740, push));
    this.cells.forEach((c, i) => { const a = E.pop(H.seg(p, .66 + i * .02, .78 + i * .02)); H.set(c, { s: a * (1 + .07 * Math.sin(t * 6 + i)), o: a > 0 ? 1 : 0 }); });
  }
};
