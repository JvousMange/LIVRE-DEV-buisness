/* Scènes 9 à 16 + carton final : mécanisme, actifs, preuve, offre */

function termBg(g) {
  H.rrect(g, -30, -30, 1140, 1980, C.terra, { r: 0, sh: false, jit: 0 });
  H.rrect(g, -30, 1160, 1140, 800, C.terraD, { r: 0, sh: false, jit: 1 });
}
function skinStrip(g, y0) {
  H.rrect(g, -30, y0, 1140, 78, C.skinL, { r: 0, sh: "sh1", jit: 1 });
  H.rrect(g, -30, y0 + 70, 1140, 380, C.skin, { r: 0, sh: false, jit: 1 });
}
function ease(v) { return E.io(clamp(v)); }
function spinAngle(t, t0, tStop) {
  if (t < t0) return 0; const k = 70, x = t - t0;
  if (tStop == null || t < tStop - .4) return k * x;
  const ts = tStop - .4 - t0, w = .4, u = clamp((t - (tStop - .4)) / w);
  return k * (ts + w * (u - u * u / 2));
}

/* mécanisme : engrenages + enzyme + cellule + pigment qui monte */
function mech(g, y0 = 1060) {
  const m = H.grp(g, 0, 0, { j: 0 }); m.gears = [];
  skinStrip(m, y0);
  m.cell = H.grp(m, 540, y0 + 160, { j: .8 }); H.el("path", { d: "M-20,-20 L-90,-80 M20,-20 L90,-70 M-30,10 L-110,30 M30,10 L110,40", stroke: C.mark, "stroke-width": 10, "stroke-linecap": "round", fill: "none" }, m.cell); H.blob(m.cell, 0, 0, 62, 54, C.mark, { n: 13, jit: .08, seed: 3, sh: "sh1" });
  m.g1 = H.grp(m, 400, 560, { j: .3 }); H.poly(m.g1, H.gear(0, 0, 150, 190, 12), C.paper, { seed: 2, jit: 1, sh: "sh" }); H.circ(m.g1, 0, 0, 56, C.dark, { sh: false }); H.circ(m.g1, 0, 0, 22, C.paper, { sh: false });
  m.g2 = H.grp(m, 690, 470, { j: .3 }); H.poly(m.g2, H.gear(0, 0, 96, 130, 9), C.cardboard, { seed: 4, jit: 1 }); H.circ(m.g2, 0, 0, 36, C.dark, { sh: false });
  m.enz = H.grp(m, 800, 700, { j: .8 }); { const pts = []; for (let i = 0; i <= 26; i++) { const a = (.28 + i / 26 * (Math.PI * 2 - .56)); pts.push([Math.cos(a) * 96, Math.sin(a) * 96]); } pts.push([0, 0]); H.poly(m.enz, pts, C.cream, { seed: 5, jit: 1.5 }); H.circ(m.enz, 20, -44, 11, C.dark, { sh: false }); }
  m.lock = H.grp(m.enz, 0, 0, { j: .5 }); H.rrect(m.lock, -4, -30, 120, 60, C.sage, { r: 18, seed: 5 }); H.txt(m.lock, "✕", 56, 14, 44, C.cream, {});
  m.dots = []; for (let i = 0; i < 16; i++) { const d = H.grp(m, 540, 1000, { j: .5 }); H.blob(d, 0, 0, 14 + (i % 3) * 4, 13, C.mark, { n: 9, jit: .2, seed: i, sh: "sh1" }); m.dots.push(d); }
  m.patch = H.grp(m, 540, y0 - 6, { j: .5 }); H.blob(m.patch, 0, 0, 150, 34, C.mark, { n: 16, jit: .1, seed: 7, sh: "sh1" });
  m.render = (t, o) => { // o: ang, emit (0..1), emitT, patch(0..1), gears(0..1), enz(0..1), lock(0..1)
    const gp = E.pop(o.gears === undefined ? 1 : o.gears); H.set(m.g1, { r: o.ang, s: gp, o: gp > 0 ? 1 : 0 }); H.set(m.g2, { r: -o.ang * 190 / 130 + 14, s: gp, o: gp > 0 ? 1 : 0 });
    const ep = E.pop(o.enz === undefined ? 1 : o.enz); H.set(m.enz, { s: ep, r: Math.sin(t * 4) * 6, o: ep > 0 ? 1 : 0 }); H.set(m.lock, { s: E.pop(o.lock || 0), o: o.lock > 0 ? 1 : 0 });
    m.dots.forEach((d, i) => { const ph = ((o.emitT || 0) * .55 + i / 16) % 1, e = o.emit || 0; const vis = e * (ph < .92 ? 1 : 0); H.set(d, { x: 540 + Math.sin(i * 2.1) * 90 * ph, y: lerp(y0 + 140, y0 - 6, E.out(ph)), s: .5 + .5 * ph, o: vis }); });
    H.set(m.patch, { s: lerp(.15, 1, o.patch || 0), o: (o.patch || 0) > 0 ? 1 : 0 });
    H.set(m.cell, { s: 1 + .06 * Math.sin(t * 8) });
  };
  return m;
}
function flame(parent, x, y, sc, col) { const f = H.grp(parent, x, y, { j: 1.2 }); H.poly(f, [[0, -150], [46, -60], [64, 0], [30, 36], [-30, 36], [-64, 0], [-40, -70], [-8, -50]], col, { seed: Math.floor(x), jit: 3 }); f._b.sx = f._b.sy = sc; return f; }

/* ================= 9 · MÉCANISME ================= */
SCN.meca = {
  sfx: [[.02, "paper"], [.06, "whoosh"], [.2, "pop"], [.3, "tick"], [.4, "tick"], [.5, "pop"], [.62, "pop"], [.74, "pop"], [.86, "pop"]],
  init(g) { this.w = H.grp(g, 0, 0, { j: 0 }); termBg(this.w); this.m = mech(this.w); this.fl = [flame(this.w, 380, 960, 1, C.red), flame(this.w, 540, 940, 1.35, "#E07A3A"), flame(this.w, 700, 960, 1, C.red)]; },
  update(t, p, d, g) {
    H.cam(this.w, lerp(1, 1.12, p), 540, 760);
    const fo = 1 - ease(H.seg(p, .24, .34));
    this.fl.forEach((f, i) => H.set(f, { sy: E.pop(H.seg(p, .02 + i * .03, .14 + i * .03)) * (1 + .12 * Math.sin(t * 11 + i)), sx: (1 + .06 * Math.cos(t * 9 + i)) * (i == 1 ? 1.35 : 1), o: fo }));
    const t0 = .2 * d; this.m.render(t, { ang: spinAngle(t, t0, null), gears: H.seg(p, .2, .34), enz: H.seg(p, .3, .42), emit: H.seg(p, .4, .5), emitT: Math.max(0, t - .4 * d), patch: E.out(H.seg(p, .48, 1)), lock: 0 });
  }
};

/* tag qui tombe */
function dropTag(parent, text, x, y, w, h, size) { const tg = H.tag(parent, text, w, h, { size }); tg._x = x; tg._y = y; return tg; }
function tagDrop(tg, p, a, b, y0 = -340) { const q = E.bounce(H.seg(p, a, b)); H.set(tg, { x: tg._x, y: lerp(y0, tg._y, q), o: p >= a ? 1 : 0 }); H.set(tg._body, { r: Math.sin((p - a) * 30) * 4 * (1 - H.seg(p, a, a + .18)) }); }

/* ================= 10 · ACTIFS 1 : azélaïque + arbutine ================= */
SCN.a1 = {
  sfx: [[.03, "paper"], [.1, "slide"], [.3, "stamp"], [.42, "stamp"], [.55, "slide"], [.7, "stamp"], [.8, "pop"]],
  init(g) { this.w = H.grp(g, 0, 0, { j: 0 }); termBg(this.w); this.m = mech(this.w);
    this.brake = H.grp(this.w, 400, 380, { j: .5 }); H.rrect(this.brake, -90, -70, 180, 100, C.dark, { r: 18, seed: 3 }); H.rrect(this.brake, -20, 20, 40, 60, C.dark, { r: 6, sh: "sh1" });
    this.t1 = dropTag(this.w, "ACIDE\nAZÉLAÏQUE\n10 %", 290, 360, 460, 250, 46); this.t2 = dropTag(this.w, "ALPHA-\nARBUTINE\n2 %", 790, 220, 400, 230, 44); },
  update(t, p, d, g) {
    H.cam(this.w, 1.04, 540, 800);
    tagDrop(this.t1, p, .08, .24); tagDrop(this.t2, p, .52, .68);
    const stop = .38 * d; const br = E.back(H.seg(p, .26, .36)); H.set(this.brake, { y: lerp(-200, 330, br), x: 400, o: p > .26 ? 1 : 0, r: -4 });
    this.m.render(t, { ang: spinAngle(t, 0, stop), emit: p < .42 ? 1 : 1 - H.seg(p, .42, .5), emitT: Math.min(t, stop), patch: p < .38 ? lerp(.2, .45, p / .38) : .45 - .0, lock: H.seg(p, .66, .76) });
  }
};

/* ================= 11 · ACTIFS 2 : tranexamique ================= */
SCN.a2 = {
  sfx: [[.03, "paper"], [.12, "pop"], [.3, "pop"], [.5, "pop"], [.58, "stamp"], [.74, "ding"]],
  init(g) { this.w = H.grp(g, 0, 0, { j: 0 }); termBg(this.w); skinStrip(this.w, 980);
    this.sp = H.grp(this.w, 540, 975, { j: .7 }); H.blob(this.sp, 0, -40, 90, 80, C.mark, { n: 13, jit: .12, seed: 3, sh: "sh1" });
    this.t = dropTag(this.w, "ACIDE\nTRANEXAMIQUE\n2 %", 540, 250, 560, 260, 50);
    this.ck = H.grp(this.w, 540, 760, { j: .8 }); H.circ(this.ck, 0, 0, 120, C.sage); H.el("path", { d: "M-52,6 L-14,46 L58,-38", stroke: C.cream, "stroke-width": 24, fill: "none", "stroke-linecap": "round", "stroke-linejoin": "round" }, this.ck);
    this.arr = H.grp(this.w, 540, 740, { j: .6 }); H.el("path", { d: "M-150,60 C-170,-120 170,-120 150,60", stroke: C.cream, "stroke-width": 16, fill: "none", "stroke-linecap": "round", "stroke-dasharray": "2 28" }, this.arr); },
  update(t, p, d, g) {
    H.cam(this.w, 1, 540, 760);
    const up = (a, b) => E.back(H.seg(p, a, b));
    let s = 0; if (p < .2) s = up(.06, .18); else if (p < .3) s = 1 - E.in(H.seg(p, .2, .26)); else if (p < .46) s = up(.3, .4); else if (p < .54) s = 1 - E.in(H.seg(p, .46, .52)); else if (p < .62) s = up(.5, .6); else s = 1;
    const squash = E.in(H.seg(p, .6, .7));
    H.set(this.sp, { sx: s * (1 + .5 * squash), sy: s * (1 - .92 * squash), o: p > .06 && squash < .98 ? 1 : 0 });
    tagDrop(this.t, p, .52, .64, -400); H.set(this.t, { y: this.t._b.y + (p > .64 ? -H.seg(p, .66, .86) * 650 : 0) });
    H.set(this.ck, { s: E.pop(H.seg(p, .72, .86)), o: p > .72 ? 1 : 0 }); H.set(this.arr, { o: p > .2 && p < .7 ? 1 : 0, r: Math.sin(t * 4) * 5 });
  }
};

/* ================= 12 · ACTIFS 3 : niacinamide + peu d'actifs ================= */
SCN.a3 = {
  sfx: [[.03, "paper"], [.1, "slide"], [.3, "stamp"], [.36, "tick"], [.44, "tick"], [.54, "paper"], [.62, "pop"], [.7, "pop"], [.8, "tick"]],
  init(g) { this.w = H.grp(g, 0, 0, { j: 0 }); termBg(this.w); this.A = H.grp(this.w, 0, 0, { j: 0 }); this.B = H.grp(this.w, 0, 0, { j: 0 });
    skinStrip(this.A, 1000); this.shield = H.grp(this.A, 540, 700, { j: .5 }); H.poly(this.shield, [[-230, -120], [230, -120], [230, 60], [140, 140], [0, 180], [-140, 140], [-230, 60]], C.sage, { seed: 3, jit: 3, sh: "sh2" }); H.poly(this.shield, [[-180, -80], [180, -80], [180, 40], [110, 100], [0, 130], [-110, 100], [-180, 40]], C.sageD, { seed: 4, jit: 2, sh: false }); H.el("path", { d: "M-70,0 L-20,48 L72,-48", stroke: C.cream, "stroke-width": 24, fill: "none", "stroke-linecap": "round", "stroke-linejoin": "round" }, this.shield);
    this.t = dropTag(this.A, "NIACINAMIDE\n5 %", 540, 230, 560, 220, 52);
    this.bd = []; for (let i = 0; i < 7; i++) { const b = H.grp(this.A, 0, 0, { j: .5 }); H.blob(b, 0, 0, 16, 15, C.mark, { n: 9, jit: .2, seed: i, sh: "sh1" }); this.bd.push(b); }
    this.slots = []; for (let i = 0; i < 5; i++) { const s = H.grp(this.B, 140 + i * 200, 640, { j: .6 }); if (i < 2) { H.rrect(s, -80, -100, 160, 200, C.grey, { r: 12, seed: i }); H.circ(s, 0, 0, 30, C.greyD, { sh: false }); H.rrect(s, -50, 50, 100, 12, C.greyD, { r: 4, sh: false }); } else H.rrect(s, -80, -100, 160, 200, "none", { r: 12, sh: false, attr: { stroke: C.cream, "stroke-width": 6, "stroke-dasharray": "16 14", "stroke-opacity": .75 } }); this.slots.push(s); } },
  update(t, p, d, g) {
    H.cam(this.w, 1, 540, 760); H.set(this.A, { o: p < .5 ? 1 : 0 }); H.set(this.B, { o: p < .5 ? 0 : 1 });
    tagDrop(this.t, p, .06, .2); H.set(this.t, { y: this.t._b.y - H.seg(p, .24, .32) * 560, o: p < .32 ? 1 : 0 });
    const sd = E.back(H.seg(p, .26, .38)); H.set(this.shield, { y: lerp(-300, 860, sd), o: p > .26 ? 1 : 0, s: .75 });
    this.bd.forEach((b, i) => { const ph = ((t * .9 + i / 7) % 1); const hit = ph > .62; H.set(b, { x: lerp(120, 380 + i * 12, E.out(clamp(ph / .62))) + (hit ? -(ph - .62) * 600 : 0), y: lerp(1000, 960, Math.min(ph / .62, 1)) - (hit ? Math.sin((ph - .62) * 8) * 280 : 0), o: p > .38 && p < .5 ? 1 : 0 }); });
    this.slots.forEach((s, i) => { const a = E.pop(H.seg(p, .52 + i * .035, .62 + i * .035)); H.set(s, { s: a, o: a > 0 ? 1 : 0 }); });
  }
};

/* ================= 13 · CONSOLIDATION : un seul flacon ================= */
const NAMES = ["ACIDE\nAZÉLAÏQUE", "ALPHA-\nARBUTINE", "ACIDE\nTRANEXAMIQUE", "NIACINAMIDE", "VITAMINE C\nSTABLE"];
SCN.conso = {
  sfx: [[.03, "paper"], [.06, "pop"], [.12, "pop"], [.18, "pop"], [.24, "pop"], [.3, "pop"], [.44, "pop"], [.58, "whoosh"], [.66, "stamp"], [.78, "slide"], [.84, "slide"], [.9, "ding"]],
  init(g) { this.w = H.grp(g, 0, 0, { j: 0 }); termBg(this.w);
    this.tags = NAMES.map((n, i) => { const tg = H.tag(this.w, n, 340, 150, { size: 29, seed: i + 3 }); const a = -Math.PI / 2 + (i - 2) * .62; tg._hx = 540 + Math.sin((i - 2) * .62) * 380; tg._hy = 560 + (1 - Math.cos((i - 2) * .62)) * 380 + 120; return tg; });
    this.gh = []; for (let i = 0; i < 10; i++) { const b = H.grp(this.w, 130 + (i % 5) * 205, 430 + Math.floor(i / 5) * 330, { j: .7 }); b._y0 = 430 + Math.floor(i / 5) * 330; H.rrect(b, -50, -90, 100, 180, C.grey, { r: 22, seed: i }); H.rrect(b, -26, -128, 52, 48, C.greyD, { r: 10, sh: "sh1" }); this.gh.push(b); }
    this.glow = H.grp(this.w, 540, 700, { j: 0 }); H.blob(this.glow, 0, 0, 330, 330, "#F1D9A8", { sh: false, attr: { opacity: .35 } });
    this.bt = H.bottle(this.w, 1.45); },
  update(t, p, d, g) {
    H.cam(this.w, 1, 540, 760);
    this.tags.forEach((tg, i) => { const a = E.pop(H.seg(p, .03 + i * .06, .14 + i * .06)), ab = E.in(H.seg(p, .74 + i * .03, .92 + i * .01)); H.set(tg, { x: lerp(tg._hx, 540, ab), y: lerp(tg._hy - 120 * (1 - a), 760, ab), s: a * (1 - ab * .8), o: a > 0 && ab < .98 ? 1 : 0, r: (i - 2) * 5 * (1 - ab) }); });
    this.gh.forEach((b, i) => { const a = E.pop(H.seg(p, .42 + i * .012, .5 + i * .012)), out = E.in(H.seg(p, .58 + (i % 5) * .012, .72)); H.set(b, { s: a, y: b._y0 + out * 1600, o: a > 0 && out < .99 ? 1 : 0, r: out * (i - 4.5) * 4 }); });
    const bi = E.back(H.seg(p, .62, .76)); H.set(this.bt, { x: 540, y: lerp(1700, 780, bi), o: p > .62 ? 1 : 0, r: Math.sin(t * 5) * 1.5 }); H.set(this.glow, { s: E.pop(H.seg(p, .78, .95)), o: p > .78 ? 1 : 0 });
  }
};

/* ================= 14 · PREUVE : la pile de pots s'écroule ================= */
SCN.preuve = {
  sfx: [[.02, "paper"], [.1, "stamp"], [.18, "stamp"], [.26, "stamp"], [.5, "whoosh"], [.7, "pop"], [.8, "ding"]],
  init(g) { this.w = H.grp(g, 0, 0, { j: 0 }); termBg(this.w);
    this.jars = []; const cols = [C.cardboard, C.paperD, C.sage, C.plum, C.blue, C.grey, C.cream, C.skinL];
    const spots = [[330, 1020], [540, 1030], [750, 1020], [440, 880], [650, 880], [540, 740], [380, 760], [700, 760]];
    spots.forEach((s, i) => { const j = H.grp(this.w, s[0], s[1], { j: .8 }); j._tx = s[0]; j._ty = s[1]; H.rrect(j, -98, -50, 196, 150, cols[i], { r: 22, seed: i }); H.rrect(j, -106, -90, 212, 52, C.cream, { r: 14, seed: i + 5, sh: "sh1" }); H.rrect(j, -60, -10, 120, 70, C.cream, { r: 8, sh: false }); j._d = i % 2 ? 1 : -1; this.jars.push(j); });
    this.glow = H.grp(this.w, 540, 760, { j: 0 }); H.blob(this.glow, 0, 0, 360, 360, "#F1D9A8", { sh: false, attr: { opacity: .35 } }); this.bt = H.bottle(this.w, 1.5); },
  update(t, p, d, g) {
    H.cam(this.w, 1, 540, 760);
    this.jars.forEach((j, i) => { const a = E.bounce(H.seg(p, .03 + i * .045, .24 + i * .045)), out = E.in(H.seg(p, .46 + i * .01, .68)); H.set(j, { x: j._tx + out * j._d * 1100, y: lerp(-300, j._ty, a) + out * 500, r: (1 - a) * j._d * 30 + out * j._d * 90, o: p > .03 + i * .045 && out < .99 ? 1 : 0 }); });
    const bi = E.back(H.seg(p, .62, .78)); H.set(this.bt, { x: 540, y: lerp(1600, 860, bi), o: p > .62 ? 1 : 0 }); H.set(this.glow, { s: E.pop(H.seg(p, .72, .9)), o: p > .72 ? 1 : 0 });
  }
};

/* ================= 15 · GARANTIE ================= */
SCN.garantie = {
  sfx: [[.02, "paper"], [.06, "tick"], [.15, "pop"], [.22, "stamp"], [.28, "ding"], [.64, "pop"], [.7, "tick"], [.88, "ding"]],
  init(g) { this.w = H.grp(g, 0, 0, { j: 0 }); termBg(this.w);
    this.q = H.grp(this.w, 540, 690, { j: .9 }); H.el("path", { d: "M-130,-170 C-130,-330 150,-330 150,-170 C150,-70 20,-60 20,60", stroke: C.dark, "stroke-width": 120, fill: "none", "stroke-linecap": "butt", filter: "url(#sh)" }, this.q); H.circ(this.q, 20, 190, 62, C.dark, { sh: "sh" });
    this.ck = H.grp(this.w, 540, 690, { j: .8 }); H.circ(this.ck, 0, 0, 230, C.sage, { sh: "sh" }); H.el("path", { d: "M-100,10 L-30,86 L112,-76", stroke: C.cream, "stroke-width": 46, fill: "none", "stroke-linecap": "round", "stroke-linejoin": "round" }, this.ck);
    this.seal = H.grp(this.w, 540, 680, { j: .6 }); H.el("path", { d: H.d(H.star(0, 0, 232, 262, 26)), fill: C.cream, filter: "url(#sh2)", stroke: "#fff", "stroke-opacity": .4, "stroke-width": 3 }, this.seal); H.circ(this.seal, 0, 0, 205, C.terra, { sh: false, attr: { stroke: C.cream, "stroke-width": 8, "stroke-opacity": 1 } });
    H.txt(this.seal, "90", 0, 40, 220, C.cream, { w: 800 }); H.txt(this.seal, "JOURS", 0, 118, 62, C.cream, { ls: 8 });
    this.rib = H.grp(this.w, 540, 980, { j: .6 }); H.poly(this.rib, [[-380, -52], [380, -52], [340, 0], [380, 52], [-380, 52], [-340, 0]], C.cream, { seed: 3, jit: 2 }); H.txt(this.rib, "SATISFAIT OU REMBOURSÉ", 0, 15, 44, C.terraD, { ls: 1.5 });
    this.coin = H.grp(this.w, 250, 1150, { j: .8 }); H.circ(this.coin, 0, 0, 110, C.cream, { sh: "sh" }); H.circ(this.coin, 0, 0, 88, "none", { sh: false, attr: { stroke: C.terra, "stroke-width": 7, "stroke-opacity": 1 } }); H.txt(this.coin, "0 €", 0, 24, 72, C.terraD, {});
    this.ck2 = H.grp(this.w, 830, 1150, { j: .8 }); H.circ(this.ck2, 0, 0, 105, C.sage, { sh: "sh" }); H.el("path", { d: "M-42,6 L-10,40 L50,-34", stroke: C.cream, "stroke-width": 20, fill: "none", "stroke-linecap": "round", "stroke-linejoin": "round" }, this.ck2); },
  update(t, p, d, g) {
    H.cam(this.w, 1, 540, 800);
    const qa = E.pop(H.seg(p, .0, .06)), qf = E.in(H.seg(p, .12, .16));
    H.set(this.q, { s: qa * (1 - qf) * (1 + .06 * Math.sin(t * 9)), r: Math.sin(t * 6) * 5, o: qa > 0 && qf < .98 ? 1 : 0 });
    const ca = E.pop(H.seg(p, .14, .2)), cs = E.in(H.seg(p, .22, .27));
    H.set(this.ck, { s: ca * (1 - cs), o: ca > 0 && cs < .98 ? 1 : 0 });
    const sa = E.pop(H.seg(p, .24, .34)); H.set(this.seal, { s: sa * (1.35 - .35 * E.out(H.seg(p, .24, .34))), r: lerp(-30, 0, E.out(H.seg(p, .24, .36))), o: sa > 0 ? 1 : 0 }); H.set(this.rib, { s: E.pop(H.seg(p, .34, .44)), o: p > .34 ? 1 : 0, r: -4 });
    const co = E.pop(H.seg(p, .62, .74)); H.set(this.coin, { s: co, o: co > 0 ? 1 : 0, r: lerp(180, 0, E.out(H.seg(p, .62, .76))) });
    const c2 = E.pop(H.seg(p, .86, .96)); H.set(this.ck2, { s: c2, o: c2 > 0 ? 1 : 0 });
  }
};

/* ================= 16 · OFFRE ================= */
SCN.offre = {
  sfx: [[.02, "paper"], [.08, "pop"], [.22, "pop"], [.44, "stamp"], [.64, "pop"], [.78, "pop"], [.88, "pop"]],
  init(g) { this.w = H.grp(g, 0, 0, { j: 0 }); termBg(this.w);
    this.b = [0, 1, 2].map(i => H.bottle(this.w, 1.1)); this.b.forEach((b, i) => { b._x = 270 + i * 270; });
    this.tg = H.tag(this.w, "1\nOFFERT", 300, 200, { size: 62, fill: C.cream }); this.tg._x = 810 + 20; this.tg._y = 520;
    this.pch = H.grp(this.w, 230, 1080, { j: .7 }); H.rrect(this.pch, -140, -80, 280, 170, C.cardboard, { r: 30, seed: 3 }); H.el("path", { d: "M-120,-40 H120", stroke: C.cream, "stroke-width": 8, "stroke-dasharray": "4 12", "stroke-linecap": "round" }, this.pch); H.circ(this.pch, 0, 20, 36, "none", { sh: false, attr: { stroke: C.cream, "stroke-width": 5, "stroke-opacity": 1 } }); H.txt(this.pch, "M", 0, 34, 44, C.cream, {});
    this.bk = H.grp(this.w, 860, 1080, { j: .7 }); H.rrect(this.bk, -105, -140, 210, 280, C.cream, { r: 10, seed: 4 }); H.rrect(this.bk, -105, -140, 26, 280, C.terra, { r: 6, sh: false }); H.circ(this.bk, 10, -30, 38, "none", { sh: false, attr: { stroke: C.dark, "stroke-width": 5, "stroke-opacity": 1 } }); H.txt(this.bk, "M", 10, -16, 46, C.dark, {}); H.txt(this.bk, "PROTOCOLE", 10, 72, 20, C.terra, { ls: 2 }); H.txt(this.bk, "ANTI-TACHES", 10, 98, 20, C.terra, { ls: 2 }); },
  update(t, p, d, g) {
    H.cam(this.w, 1, 540, 760);
    [0, 1].forEach(i => { const a = E.pop(H.seg(p, .04 + i * .12, .16 + i * .12)); H.set(this.b[i], { x: this.b[i]._x, y: 800, s: a, o: a > 0 ? 1 : 0 }); });
    const dr = E.bounce(H.seg(p, .4, .56)); H.set(this.b[2], { x: this.b[2]._x, y: lerp(-300, 800, dr), o: p > .4 ? 1 : 0 });
    const ta = E.back(H.seg(p, .58, .7)); H.set(this.tg, { x: 810, y: lerp(-100, 380, ta), r: lerp(14, -6, ta), o: p > .58 ? 1 : 0 });
    const pa = E.pop(H.seg(p, .72, .84)); H.set(this.pch, { s: pa, o: pa > 0 ? 1 : 0, r: -6 }); const ba = E.pop(H.seg(p, .8, .92)); H.set(this.bk, { s: ba, o: ba > 0 ? 1 : 0, r: 5 });
  }
};

/* ================= carton final ================= */
SCN.endcard = {
  sfx: [[.05, "stamp"], [.2, "ding"]],
  init(g) { this.w = H.grp(g, 0, 0, { j: 0 }); H.rrect(this.w, -30, -30, 1140, 1980, C.terra, { r: 0, sh: false, jit: 0 });
    this.m = H.grp(this.w, 540, 760, { j: .6 }); H.circ(this.m, 0, 0, 230, C.cream, { sh: "sh2" }); H.circ(this.m, 0, 0, 196, "none", { sh: false, attr: { stroke: C.terra, "stroke-width": 10, "stroke-opacity": 1 } }); H.txt(this.m, "M", 0, 90, 290, C.dark, {});
    this.n = H.grp(this.w, 540, 1090, { j: .6 }); H.txt(this.n, "MELA SKIN", 0, 0, 120, C.cream, { ls: 8 }); H.txt(this.n, "Sérum Anti-Taches", 0, 90, 62, C.cream, { w: 400 }); H.txt(this.n, "L'expertise pensée pour vous", 0, 170, 40, "#F1D9A8", { w: 400 }); },
  update(t, p, d, g) { const a = E.pop(H.seg(p, .04, .3)); H.set(this.m, { s: a, o: a > 0 ? 1 : 0 }); H.set(this.n, { y: lerp(1200, 1090, E.out(H.seg(p, .2, .45))), o: H.seg(p, .2, .4) }); }
};
