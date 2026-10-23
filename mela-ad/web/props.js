/* Bibliothèque d'accessoires en papier découpé (V2) */
const { E, lerp, seg, clamp } = H;
const P = {}, BG = {};

/* ---------- fonds (kraft clair, feuilles superposées façon carton) ---------- */
const TONES = { kraft: "#DDBD92", cream: "#F0E0BC", terra: "#D58F68", sage: "#A9C4A4", peach: "#EBC3A8", blue: "#AEC5CF" };
BG.decor = (g, seed = 1) => { const r = H.rng(seed); for (let i = 0; i < 6; i++) { const left = r() < .5, x = left ? -10 + r() * 90 : 1000 + r() * 90, y = 120 + r() * 1000, k = Math.floor(r() * 3), d = H.grp(g, x, y, { j: .5 }); d._b.r = (r() - .5) * 60;
  if (k === 0) H.rrect(d, -46, -16, 92, 32, "rgba(245,232,190,.85)", { r: 4, sh: "sh1", th: 1 }); else if (k === 1) H.circ(d, 0, 0, 16 + r() * 14, H.shade("#DDBD92", .85), { sh: "sh1" }); else H.poly(d, [[-30, -20], [30, -26], [34, 22], [-26, 24]], H.shade("#DDBD92", .78), { sh: "sh1", jit: 4, seed: i }); } };
BG.kraft = (g, tone = "kraft", o = {}) => { const c = TONES[tone] || tone, y = o.y || 1190, r = H.rng(7), pts = [];
  H.rrect(g, -60, -60, 1200, 2040, c, { r: 0, sh: false, jit: 0 });
  for (let i = 0; i <= 14; i++) pts.push([-60 + i * 86, y + (r() - .5) * 24]); pts.push([1140, 1980], [-60, 1980]);
  H.paper(g, H.d(pts), H.shade(c, .93), { sh: "sh", th: 12 });
  H.rrect(g, -60, y + 40, 1200, 60, H.shade(c, .84), { r: 0, sh: "sh1", corr: true, jit: 1, th: 4 });
  BG.decor(g, o.seed || 3); };
BG.terra = g => BG.kraft(g, "terra", { seed: 5 });
BG.sage = g => BG.kraft(g, "sage", { seed: 6 });
BG.cream = g => BG.kraft(g, "cream", { seed: 7 });
BG.dark = g => { BG.kraft(g, "kraft", { seed: 8 }); H.blob(g, 540, 780, 560, 660, "#F5E9C9", { seed: 4, sh: "sh2", th: 12 }); };
BG.wall = (g, col = "#E8D3AD", floor, fy = 1000) => { H.rrect(g, -60, -60, 1200, fy + 60, col, { r: 0, sh: false, jit: 0 }); H.rrect(g, -60, fy, 1200, 1000, H.shade(col, .84), { r: 0, sh: "sh2", jit: 1, th: 10, corr: true }); };
BG.tiles = (g, col = "#B3CCAE", line = "#9DB898") => { H.rrect(g, -60, -60, 1200, 2040, col, { r: 0, sh: false, jit: 0 }); for (let i = 0; i < 14; i++) H.el("path", { d: `M${i * 100 - 40},0 V1920`, stroke: line, "stroke-width": 3 }, g); for (let j = 0; j < 20; j++) H.el("path", { d: `M0,${j * 100} H1080`, stroke: line, "stroke-width": 3 }, g); };

/* ---------- peau, marques ---------- */
P.mark = (parent, x, y, r, col = C.mark, seed = 1) => { const m = H.grp(parent, x, y, { j: .6 }); H.blob(m, 0, 0, r, r * (.82 + (seed % 3) / 12), col, { n: 11, jit: .22, seed, sh: "sh1" }); return m; };
P.pimple = (parent, x, y, r = 34) => { const g = H.grp(parent, x, y, { j: .8 }); H.circ(g, 0, 0, r, C.red); H.circ(g, -r * .25, -r * .3, r * .3, "#F5B9A0", { sh: false }); H.circ(g, 0, 0, r + 10, "none", { sh: false, attr: { stroke: "#B5533A", "stroke-opacity": .5, "stroke-width": 8 } }); return g; };
P.patch = (parent, x, y, R = 215, id = 4) => { const g = H.grp(parent, x, y, { j: .6 }); H.blob(g, 0, 0, R, R, C.skin, { seed: id, sh: "sh2" }); H.blob(g, 0, 0, R * .8, R * .8, C.skinL, { seed: id + 1, sh: false, attr: { opacity: .45 } }); return g; };
P.spots = (n, seed, cx, cy, rx, ry, rmin = 9, rmax = 22) => { const r = H.rng(seed), o = []; for (let i = 0; i < n; i++) { const a = r() * 6.283, d = Math.sqrt(r()); o.push({ x: cx + Math.cos(a) * rx * d, y: cy + Math.sin(a) * ry * d, r: rmin + r() * (rmax - rmin), s: Math.floor(r() * 99) }); } return o; };
P.spotGroup = (parent, sp, col = C.mark) => sp.map(s => P.mark(parent, s.x, s.y, s.r, col, s.s));
P.popAll = (ms, p, a = 0, b = 1) => { const n = ms.length; ms.forEach((m, i) => { const t = clamp((p - (a + (b - a) * i / n)) / .07); H.set(m, { s: E.pop(t), o: t > 0 ? 1 : 0 }); }); };

/* ---------- visage en gros plan (sans traits, comme la réf.) ---------- */
P.face = (parent, o = {}) => {
  const f = H.grp(parent, o.x || 0, o.y || 0, { j: .3 });
  H.blob(f, 540, 520, 540, 580, C.hair, { seed: 2 });
  for (let i = 0; i < 12; i++) { const a = Math.PI + i / 11 * Math.PI; H.circ(f, 540 + Math.cos(a) * 470, 560 + Math.sin(a) * 520, 78, C.hair, { sh: false, th: 0 }); }
  H.blob(f, 540, 1780, 720, 380, C.sage, { seed: 3 });
  H.poly(f, [[390, 1000], [690, 1000], [770, 1580], [310, 1580]], C.skinD, { seed: 4 });
  H.blob(f, 128, 760, 52, 86, C.skinD, { seed: 5, sh: "sh1" }); H.blob(f, 952, 760, 52, 86, C.skinD, { seed: 6, sh: "sh1" });
  H.circ(f, 100, 830, 18, "#D9A441", { sh: "sh1" }); H.circ(f, 980, 830, 18, "#D9A441", { sh: "sh1" });
  H.blob(f, 540, 700, 410, 530, C.skin, { seed: 7, jit: .025 });
  H.blob(f, 540, 760, 330, 400, C.skinL, { seed: 9, jit: .02, sh: false, attr: { opacity: .28 } });
  H.poly(f, [[120, 650], [160, 420], [300, 255], [540, 205], [780, 255], [920, 420], [960, 650], [880, 520], [720, 410], [540, 378], [360, 410], [200, 520]], C.hair, { seed: 8, jit: 4 });
  H.blob(f, 540, 880, 34, 46, C.skinD, { seed: 11, sh: false, attr: { opacity: .35 } }); // nez
  return f;
};
P.CHEEK_L = [360, 840]; P.CHEEK_R = [725, 840];

/* ---------- personnage (buste, sans visage) ---------- */
P.woman = (parent, x, y, sc = 1, o = {}) => {
  const g = H.grp(parent, x, y, { j: .5 }); const s = H.grp(g, 0, 0, { j: 0 }); H.set(s, { s: sc }); g.s = s;
  const top = o.top || C.sage, skin = o.skin || C.skin, hair = o.hair || C.hair;
  H.rrect(s, -200, -70, 400, 380, top, { r: 110, seed: 3 });
  if (o.pattern !== false) for (let i = 0; i < 5; i++) H.rrect(s, -120 + i * 60, 30 + (i % 2) * 40, 22, 80, H.shade(top, .88), { r: 8, sh: false, th: 0 });
  H.rrect(s, -50, -135, 100, 130, H.shade(skin, .85), { r: 22, seed: 4, sh: "sh1" });
  g.head = H.grp(s, 0, -250, { j: 0 });
  H.blob(g.head, 0, -16, 160, 175, hair, { seed: 5 });
  for (let i = 0; i < 9; i++) { const a = Math.PI + i / 8 * Math.PI; H.circ(g.head, Math.cos(a) * 150, -20 + Math.sin(a) * 150, 46, hair, { sh: false, th: 0 }); }
  H.blob(g.head, -124, 6, 24, 40, H.shade(skin, .85), { seed: 6, sh: "sh1" }); H.blob(g.head, 124, 6, 24, 40, H.shade(skin, .85), { seed: 7, sh: "sh1" });
  H.circ(g.head, -128, 52, 9, "#D9A441", { sh: "sh1" }); H.circ(g.head, 128, 52, 9, "#D9A441", { sh: "sh1" });
  H.blob(g.head, 0, 8, 118, 148, skin, { seed: 8, sh: "sh1", jit: .025 });
  H.poly(g.head, [[-118, -30], [-92, -108], [0, -146], [92, -108], [118, -30], [66, -86], [0, -104], [-66, -86]], hair, { seed: 9, jit: 2, sh: false });
  g.armL = H.grp(s, -165, -10, { j: .4 }); g.armR = H.grp(s, 165, -10, { j: .4 });
  [[g.armL, 1], [g.armR, -1]].forEach(([a, d]) => { H.rrect(a, -36, -20, 72, 225, top, { r: 34, seed: 7 }); a.fore = H.grp(a, 0, 190, { j: .4 }); H.rrect(a.fore, -33, -10, 66, 190, top, { r: 32, seed: 8 }); H.circ(a.fore, 0, 196, 40, skin); });
  g.cheekL = [-58, 24]; g.cheekR = [58, 24]; return g;
};

/* ---------- objets ---------- */
P.jar = (parent, col, x = 0, y = 0) => { const j = H.grp(parent, x, y, { j: .8 }); H.rrect(j, -98, -50, 196, 150, col, { r: 22, seed: 3 }); H.rrect(j, -106, -90, 212, 52, C.cream, { r: 14, seed: 5, sh: "sh1" }); H.rrect(j, -60, -10, 120, 70, C.cream, { r: 8, sh: false, th: 0 }); return j; };
P.tube = (parent, col, x = 0, y = 0, face = false) => {
  const g = H.grp(parent, x, y, { j: .7 }); H.poly(g, [[-62, -210], [62, -210], [72, 200], [-72, 200]], col, { seed: 3, corr: false }); H.poly(g, [[-70, 200], [70, 200], [78, 236], [-78, 236]], C.paperD, { sh: false, seed: 2 }); H.rrect(g, -50, -255, 100, 46, C.cream, { r: 8, sh: "sh1" });
  H.rrect(g, -42, -70, 84, 150, C.cream, { r: 6, sh: false, th: 0 }); if (face) { H.blob(g, 0, -12, 26, 30, "#F1C9A4", { sh: false, th: 0 }); H.blob(g, 0, -38, 28, 18, "#7a5a3a", { sh: false, th: 0 }); }
  return g;
};
P.bottle = (parent, col, x = 0, y = 0, sc = 1) => { const b = H.grp(parent, x, y, { j: .7 }); const s = H.grp(b, 0, 0, { j: 0 }); H.set(s, { s: sc }); H.rrect(s, -42, -70, 84, 140, col, { r: 18 }); H.rrect(s, -20, -108, 40, 42, C.cream, { r: 8, sh: "sh1" }); return b; };
P.glove = parent => { const g = H.grp(parent, 0, 0, { j: .6 }); H.rrect(g, -110, -90, 220, 190, C.cream, { r: 70, seed: 7 }); H.rrect(g, -130, 60, 260, 56, C.terra, { r: 16, seed: 8, sh: "sh1" }); H.blob(g, 70, -105, 34, 52, C.cream, { seed: 9, sh: "sh1" }); for (let i = 0; i < 8; i++) H.circ(g, -70 + i * 20, -30 + (i % 3) * 30, 6, "#D9C894", { sh: false, th: 0 }); return g; };
P.razor = (parent, sc = 1) => { const g = H.grp(parent, 0, 0, { j: .5 }); const s = H.grp(g, 0, 0, { j: 0 }); H.set(s, { s: sc }); H.rrect(s, -60, -26, 120, 52, C.greyD, { r: 10 }); H.rrect(s, 56, -14, 160, 28, C.blue, { r: 10, sh: false }); H.rrect(s, -54, 20, 108, 8, "#d9d4c6", { r: 3, sh: false, th: 0 }); return g; };
P.sun = (parent, r = 120) => { const g = H.grp(parent, 0, 0, { j: 1 }); for (let i = 0; i < 12; i++) { const a = i / 12 * 6.283; H.poly(g, [[Math.cos(a - .1) * (r + 30), Math.sin(a - .1) * (r + 30)], [Math.cos(a) * (r + 90), Math.sin(a) * (r + 90)], [Math.cos(a + .1) * (r + 30), Math.sin(a + .1) * (r + 30)]], "#E0A93C", { sh: "sh1", jit: 1 }); } H.circ(g, 0, 0, r, "#EFC356", { sh: "sh" }); return g; };
P.MONTHS = ["JANVIER", "FÉVRIER", "MARS", "AVRIL", "MAI", "JUIN", "JUILLET", "AOÛT", "SEPTEMBRE", "OCTOBRE", "NOVEMBRE", "DÉCEMBRE"];
/* calendrier : janvier au premier plan, les pages se tournent dans l'ordre jusqu'à décembre (page du dessous) */
P.calendar = (parent) => {
  const c = H.grp(parent, 0, 0, { j: .6 }); c.pages = [];
  const draw = (g, m, tone, sh) => {
    H.rrect(g, -170, 0, 340, 380, tone, { r: 16, seed: 8 + m, sh });
    H.rrect(g, -170, 0, 340, 92, m % 2 ? C.terraD : C.terra, { r: 16, seed: 20 + m, sh: false, th: 0 });
    for (let r = 0; r < 4; r++) for (let q = 0; q < 5; q++) H.rrect(g, -134 + q * 64, 120 + r * 58, 42, 38, "#E4D3A8", { r: 7, sh: false, th: 0, jit: .6 });
    const name = P.MONTHS[m]; H.txt(g, name, 0, 62, name.length <= 5 ? 46 : name.length <= 7 ? 40 : 33, C.cream, { ls: 2.5 });
  };
  const base = H.grp(c, 0, -40, { j: 0 }); draw(base, 11, C.cream, "sh");           // décembre, en dessous de tout
  for (let m = 10; m >= 0; m--) { const pg = H.grp(c, 0, -40, { j: 0 }); draw(pg, m, m % 2 ? "#F2E7BA" : C.cream, "sh1"); c.pages[m] = pg; }   // janvier ajouté en dernier = au-dessus
  return c;
};
P.check = (parent, r = 120, col = C.sage, ink = C.cream) => { const g = H.grp(parent, 0, 0, { j: .8 }); H.circ(g, 0, 0, r, col, { sh: "sh" }); H.el("path", { d: `M${-r * .43},${r * .03} L${-r * .12},${r * .36} L${r * .48},${-r * .32}`, stroke: ink, "stroke-width": r * .2, fill: "none", "stroke-linecap": "round", "stroke-linejoin": "round" }, g); return g; };
P.cross = (parent, r = 120, col = C.red) => { const g = H.grp(parent, 0, 0, { j: .8 }); H.poly(g, [[-r, -r * .55], [-r * .75, -r * .8], [r, r * .55], [r * .75, r * .8]], col, { seed: 3, jit: 1.5 }); H.poly(g, [[r, -r * .55], [r * .75, -r * .8], [-r, r * .55], [-r * .75, r * .8]], col, { seed: 9, jit: 1.5, sh: false }); return g; };
P.shield = (parent, sc = 1) => { const g = H.grp(parent, 0, 0, { j: .5 }); const s = H.grp(g, 0, 0, { j: 0 }); H.set(s, { s: sc }); H.poly(s, [[-230, -120], [230, -120], [230, 60], [140, 140], [0, 180], [-140, 140], [-230, 60]], C.sage, { seed: 3, jit: 3, sh: "sh2" }); H.poly(s, [[-180, -80], [180, -80], [180, 40], [110, 100], [0, 130], [-110, 100], [-180, 40]], C.sageD, { seed: 4, jit: 2, sh: false, th: 0 }); H.el("path", { d: "M-70,0 L-20,48 L72,-48", stroke: C.cream, "stroke-width": 24, fill: "none", "stroke-linecap": "round", "stroke-linejoin": "round" }, s); return g; };
P.question = (parent, sc = 1, col = C.dark) => { const g = H.grp(parent, 0, 0, { j: .9 }); const s = H.grp(g, 0, 0, { j: 0 }); H.set(s, { s: sc }); const gg = H.el("g", { filter: "url(#sh)" }, s); H.el("path", { d: "M-130,-170 C-130,-330 150,-330 150,-170 C150,-70 20,-60 20,60", stroke: col, "stroke-width": 120, fill: "none" }, gg); H.circ(s, 20, 190, 62, col, { sh: "sh" }); return g; };
P.burst = (parent, r1, r2, n, col) => { const g = H.grp(parent, 0, 0, { j: 1.2 }); H.el("path", { d: H.d(H.star(0, 0, r1, r2, n)), fill: col, filter: "url(#sh)", stroke: "#fff", "stroke-opacity": .3, "stroke-width": 3 }, g); return g; };
P.arrow = (parent, len = 300, col = C.cream, w = 60) => { const g = H.grp(parent, 0, 0, { j: .8 }); H.poly(g, [[-w / 2, -len / 2], [w / 2, -len / 2], [w / 2, len / 2 - w], [w * 1.1, len / 2 - w], [0, len / 2 + w * .4], [-w * 1.1, len / 2 - w], [-w / 2, len / 2 - w]], col, { seed: 4, jit: 1.5 }); return g; };
P.person = (parent, x, y, sc, skin, hair, top) => { const g = H.grp(parent, x, y, { j: .7 }); const s = H.grp(g, 0, 0, { j: 0 }); H.set(s, { s: sc }); H.rrect(s, -110, 40, 220, 250, top, { r: 70, seed: 3 }); H.rrect(s, -28, 6, 56, 60, skin, { r: 14, sh: "sh1", th: 2 }); H.blob(s, 0, -70, 86, 100, hair, { seed: 5 }); H.blob(s, 0, -52, 72, 90, skin, { seed: 6, sh: "sh1" }); return g; };
P.icon = (parent, x, y, col, sc = 1) => { const g = H.grp(parent, x, y, { j: .6 }); const s = H.grp(g, 0, 0, { j: 0 }); H.set(s, { s: sc }); H.circ(s, 0, -26, 21, col, { sh: "sh1", th: 2 }); H.rrect(s, -27, 0, 54, 44, col, { r: 20, sh: "sh1", th: 2 }); return g; };

/* ---------- coupe de peau + cellules ---------- */
P.section = (parent, y0 = 700) => {
  const s = H.grp(parent, 0, 0, { j: 0 });
  H.rrect(s, -60, y0 - 40, 1200, 100, "#C9946A", { r: 0, sh: "sh1", jit: 1.2 });
  H.rrect(s, -60, y0 + 20, 1200, 280, C.skinL, { r: 0, sh: false, jit: 1.5 });
  H.rrect(s, -60, y0 + 300, 1200, 520, "#8A5A3C", { r: 0, sh: false, jit: 1.5 }); H.rrect(s, -60, y0 + 820, 1200, 700, C.cardboard, { r: 0, sh: false, jit: 1.5, corr: true });
  for (let i = 0; i < 18; i++) H.el("path", { d: `M${-40 + i * 66},${y0 + 330 + (i % 3) * 90} q30,-26 60,0`, stroke: H.shade("#8A5A3C", .78), "stroke-width": 6, fill: "none", "stroke-linecap": "round" }, s);
  s.cells = []; for (let i = 0; i < 7; i++) { const c = H.grp(s, 60 + i * 160, y0 + 140 + (i % 2) * 40, { j: .8 }); H.el("path", { d: "M-20,-20 L-70,-70 M20,-20 L70,-60 M0,30 L0,90 M-24,12 L-80,40", stroke: C.mark, "stroke-width": 9, "stroke-linecap": "round", fill: "none" }, c); H.blob(c, 0, 0, 46, 40, C.mark, { n: 12, jit: .1, seed: i + 2, sh: "sh1" }); H.blob(c, 6, -4, 16, 14, "#6b3d24", { sh: false, th: 0 }); s.cells.push(c); }
  return s;
};

/* ---------- engrenages, enzyme, usine à pigment ---------- */
P.gear = (parent, x, y, rIn, rOut, teeth, fill) => { const g = H.grp(parent, x, y, { j: .3 }); H.poly(g, H.gear(0, 0, rIn, rOut, teeth), fill, { seed: 2, jit: 1 }); H.circ(g, 0, 0, rIn * .38, C.dark, { sh: false, th: 0 }); H.circ(g, 0, 0, rIn * .15, fill, { sh: false, th: 0 }); return g; };
P.enzyme = (parent, x, y, r = 96) => { const e = H.grp(parent, x, y, { j: .8 }); const pts = []; for (let i = 0; i <= 26; i++) { const a = .28 + i / 26 * (Math.PI * 2 - .56); pts.push([Math.cos(a) * r, Math.sin(a) * r]); } pts.push([0, 0]); H.poly(e, pts, C.cream, { seed: 5, jit: 1.5 }); H.circ(e, r * .2, -r * .46, r * .11, C.dark, { sh: false, th: 0 }); return e; };
P.factory = (parent) => {
  const f = H.grp(parent, 0, 0, { j: .4 }); f.wheel = H.grp(f, 760, 520, { j: 0 });
  H.rrect(f, 170, 360, 560, 520, C.cardboard, { r: 24, seed: 3, corr: true });
  H.poly(f, [[120, 360], [780, 360], [690, 260], [210, 260]], C.paperD, { seed: 4 });             // toit / trémie
  H.rrect(f, 620, 80, 90, 190, C.greyD, { r: 14, seed: 2 });                                        // cheminée
  H.rrect(f, 250, 450, 220, 170, "#2c1a0e", { r: 14, sh: "sh1" }); H.rrect(f, 262, 462, 196, 146, "#4a2a18", { r: 10, sh: false, th: 0 });
  f.window = H.grp(f, 360, 535, { j: 0 }); for (let i = 0; i < 5; i++) H.circ(f.window, -70 + i * 35, 20 * Math.sin(i * 2), 11, C.mark, { sh: false, th: 0 });
  H.rrect(f, 170, 700, 560, 40, C.terra, { r: 8, sh: "sh1" });
  H.circ(f.wheel, 0, 0, 110, C.paper, { sh: "sh" }); for (let i = 0; i < 8; i++) { const a = i / 8 * 6.283; H.rrect(f.wheel, Math.cos(a) * 66 - 12, Math.sin(a) * 66 - 12, 24, 24, C.terraD, { r: 6, sh: false, th: 0 }); } H.circ(f.wheel, 0, 0, 26, C.dark, { sh: false, th: 0 });
  f.belt = H.rrect(f, 140, 900, 800, 54, C.dark, { r: 26, sh: "sh" });
  f.pellets = []; for (let i = 0; i < 14; i++) { const q = H.grp(f, 0, 0, { j: .4 }); H.blob(q, 0, 0, 26, 24, C.mark, { n: 10, jit: .15, seed: i, sh: "sh1" }); f.pellets.push(q); }
  return f;
};
P.pelletsRender = (f, t, speed, amount, ox = 160, oy = 885) => { f.pellets.forEach((q, i) => { const ph = (t * speed * .35 + i / f.pellets.length) % 1; H.set(q, { x: ox + ph * 760, y: oy - (1 - ph) * 4, s: amount > i / f.pellets.length ? 1 : 0, o: amount > i / f.pellets.length ? 1 : 0 }); }); };

/* ---------- icônes d'origine des actifs (illustratif, façon Cloudless) ---------- */
P.ico = {
  wheat: parent => { const g = H.grp(parent, 0, 0, { j: .6 }); H.el("path", { d: "M0,70 C6,20 -6,-30 0,-80", stroke: "#8A6A2A", "stroke-width": 7, fill: "none", "stroke-linecap": "round" }, g); for (let i = 0; i < 5; i++) for (const d of [-1, 1]) { const q = H.grp(g, d * 17, 40 - i * 29, { j: .3 }); q._b.r = d * 32; H.blob(q, 0, 0, 10, 22, "#E0A93C", { seed: i * 3 + (d > 0 ? 1 : 0), jit: .05, sh: "sh1", th: 2 }); } const t = H.grp(g, 0, -92, { j: .3 }); H.blob(t, 0, 0, 10, 24, "#E0A93C", { seed: 4, sh: "sh1", th: 2 }); return g; },
  berry: parent => { const g = H.grp(parent, 0, 0, { j: .6 }); for (const [x, y, r] of [[-30, 10, -50], [32, 4, 52], [0, -26, 0]]) { const l = H.grp(g, x, y, { j: .3 }); l._b.r = r; H.blob(l, 0, -22, 22, 50, "#6B9A5C", { seed: x + 5, jit: .04, sh: "sh1", th: 2 }); } for (const [x, y] of [[-14, 38], [14, 44], [0, 18]]) H.circ(g, x, y, 17, "#D9432E", { sh: "sh1", th: 3 }); return g; },
  capsule: parent => { const g = H.grp(parent, 0, 0, { j: .6 }); g._b.r = -32; H.rrect(g, -62, -28, 62, 56, "#F6EDD0", { r: 28, seed: 3, th: 5 }); H.rrect(g, 0, -28, 62, 56, "#C26A45", { r: 28, seed: 4, th: 5 }); return g; },
  b3: parent => { const g = H.grp(parent, 0, 0, { j: .6 }); H.poly(g, Array.from({ length: 6 }, (_, i) => [Math.cos(i / 6 * 6.283 + .52) * 62, Math.sin(i / 6 * 6.283 + .52) * 62]), "#6B8F71", { seed: 3, jit: 1, th: 6 }); H.txt(g, "B3", 0, 22, 62, "#F6EDD0", { font: "Anton, sans-serif", w: 400 }); return g; },
  orange: parent => { const g = H.grp(parent, 0, 0, { j: .6 }); H.circ(g, 0, 0, 56, "#EE9A2E", { sh: "sh1", th: 6 }); H.circ(g, 0, 0, 44, "#FFD58A", { sh: false, th: 0 }); for (let i = 0; i < 8; i++) { const a = i / 8 * 6.283; H.el("path", { d: `M0,0 L${Math.cos(a) * 44},${Math.sin(a) * 44}`, stroke: "#EE9A2E", "stroke-width": 4 }, g); } return g; }
};

/* ---------- gommage skincare : main qui masse une pâte à grains + pot ouvert ---------- */
P.grains = (parent, n, R, seed) => { const r = H.rng(seed); for (let i = 0; i < n; i++) { const a = r() * 6.283, d = Math.sqrt(r()) * R; H.circ(parent, Math.cos(a) * d, Math.sin(a) * d * .85, 3 + r() * 3.5, ["#C9A06A", "#A87A48", "#E2C48E", "#8A5A3C"][i % 4], { sh: false, th: 0 }); } };
P.scrubHand = parent => {
  const g = H.grp(parent, 0, 0, { j: .6 });
  H.blob(g, 0, 12, 86, 80, "#C28A5B", { seed: 3, jit: .03, th: 6 });                              // paume
  [[-52, -62, -14, 76], [-18, -86, -4, 88], [18, -86, 4, 88], [52, -62, 14, 76]].forEach(([x, y, r, h], i) => { const f = H.grp(g, x, y, { j: .3 }); f._b.r = r; H.rrect(f, -17, -h + 20, 34, h, "#C28A5B", { r: 17, seed: i + 4, th: 5 }); });
  const th = H.grp(g, -80, 20, { j: .3 }); th._b.r = -58; H.rrect(th, -18, -64, 36, 72, "#C28A5B", { r: 18, seed: 9, th: 5 });
  const paste = H.grp(g, 0, 26, { j: .4 }); H.blob(paste, 0, 0, 74, 62, "#F6EBD6", { seed: 5, jit: .09, th: 5 }); P.grains(paste, 26, 56, 3);   // pâte crème avec grains
  return g;
};
P.scrubJar = parent => {
  const g = H.grp(parent, 0, 0, { j: .6 });
  H.rrect(g, -120, -30, 240, 150, C.sage, { r: 26, seed: 3 }); H.rrect(g, -100, 20, 200, 60, "#F6EBD6", { r: 12, sh: false, th: 0 });
  H.blob(g, 0, -34, 112, 32, "#F6EBD6", { seed: 4, jit: .05, th: 4 }); P.grains(g, 30, 90, 7);       // pâte visible, pot ouvert
  const lid = H.grp(g, 150, 90, { j: .5 }); lid._b.r = 24; H.rrect(lid, -62, -22, 124, 44, C.terra, { r: 12, seed: 6 });
  return g;
};
