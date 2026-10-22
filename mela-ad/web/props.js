/* Bibliothèque d'accessoires en papier découpé (V2) */
const { E, lerp, seg, clamp } = H;
const P = {}, BG = {};

/* ---------- fonds ---------- */
BG.terra = g => { H.rrect(g, -60, -60, 1200, 2040, C.terra, { r: 0, sh: false, jit: 0 }); H.rrect(g, -60, 1180, 1200, 800, C.terraD, { r: 0, sh: false, jit: 1 }); };
BG.wall = (g, col = "#DCBE92", floor = "#6A4228", fy = 1000) => { H.rrect(g, -60, -60, 1200, fy + 60, col, { r: 0, sh: false, jit: 0 }); H.rrect(g, -60, fy, 1200, 1000, floor, { r: 0, sh: "sh2", jit: 1 }); };
BG.tiles = (g, col = "#8FA58A", line = "#7A9276") => { H.rrect(g, -60, -60, 1200, 2040, col, { r: 0, sh: false, jit: 0 }); for (let i = 0; i < 14; i++) H.el("path", { d: `M${i * 100 - 40},0 V1920`, stroke: line, "stroke-width": 3 }, g); for (let j = 0; j < 20; j++) H.el("path", { d: `M0,${j * 100} H1080`, stroke: line, "stroke-width": 3 }, g); };
BG.sage = g => H.rrect(g, -60, -60, 1200, 2040, "#6B8F71", { r: 0, sh: false, jit: 0 });
BG.cream = g => H.rrect(g, -60, -60, 1200, 2040, "#EBD7B0", { r: 0, sh: false, jit: 0 });
BG.dark = g => H.rrect(g, -60, -60, 1200, 2040, "#3A2415", { r: 0, sh: false, jit: 0 });

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
P.calendar = (parent) => { const c = H.grp(parent, 0, 0, { j: .6 }); c.pages = []; H.rrect(c, -170, -40, 340, 380, C.cream, { r: 16, seed: 4 }); H.rrect(c, -170, -40, 340, 92, C.terra, { r: 16, seed: 5, sh: false });
  for (let i = 0; i < 6; i++) { const pg = H.grp(c, 0, -40, { j: 0 }); H.rrect(pg, -170, 0, 340, 380, i % 2 ? "#F2E7BA" : C.cream, { r: 16, seed: 8 + i, sh: "sh1" }); H.rrect(pg, -170, 0, 340, 92, i % 2 ? C.terraD : C.terra, { r: 16, seed: 20 + i, sh: false, th: 0 }); for (let r = 0; r < 4; r++) for (let q = 0; q < 5; q++) H.rrect(pg, -134 + q * 64, 120 + r * 58, 42, 38, "#E4D3A8", { r: 7, sh: false, th: 0, jit: .6 }); H.txt(pg, ["JAN", "FÉV", "MARS", "AVR", "MAI", "JUIN"][i], 0, 66, 44, C.cream, { ls: 3 }); c.pages.push(pg); } return c; };
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
