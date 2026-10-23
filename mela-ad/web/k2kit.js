/* Kit kraft v2 : tous les éléments redessinés. Texte toujours mesuré, jamais posé à l'œil. */
const { E, lerp, seg, clamp } = H;
const K = {};
K.C = { brown: "#3B2216", terra: "#C0603E", terraD: "#8E3F26", cream: "#FBF1D3", sage: "#7FA283", sageD: "#587A5E", sun: "#EFB93F", red: "#D2452F", blue: "#5C86A8", rose: "#E9B8A0", skin: "#9C6243", skinL: "#B57A55", ink: "#2A1810", cell: "#4A2A18" };
const CC = K.C;
K.TONES = { cream: ["#D9B886", "#F4E4C0"], sage: ["#CDB07F", "#BCD3B4"], terra: ["#CFA070", "#E6A987"], blue: ["#D2B07E", "#BFD3D8"], rose: ["#D6B283", "#F0CDB8"], dark: ["#BE9565", "#8A5A3E"] };
K.panel = (g, tone = "cream") => { const [bg, pn] = K.TONES[tone]; H.rrect(g, -60, -60, 1200, 2040, bg, { r: 0, sh: false, jit: 0 }); H.rrect(g, 70, 130, 940, 1160, pn, { r: 48, sh: "sh2", th: 14, seed: 3, jit: 1.2 }); };
K.full = (g, c) => H.rrect(g, -60, -60, 1200, 2040, c, { r: 0, sh: false, jit: 0 });
/* étiquette de papier : la taille du papier est calculée sur le texte mesuré (centrage exact) */
K.label = (p, txt, cx, cy, o = {}) => {
  const g = H.grp(p, cx, cy, { j: o.j === undefined ? .5 : o.j }); g._b.r = o.rot || 0;
  let size = o.size || 60; const font = o.font || "Anton, sans-serif", lines = String(txt).split("\n").length;
  const t = H.txt(g, txt, 0, 0, size, o.ink || CC.brown, { font, ls: o.ls === undefined ? 2 : o.ls, w: o.w || 400, lh: 1.12 });
  const fit = () => { t.setAttribute("y", size * .36 - (lines - 1) * size * 1.12 / 2); t.setAttribute("font-size", size); t.querySelectorAll("tspan").forEach(s => s.setAttribute("dy", s === t.firstChild ? 0 : size * 1.12)); };
  fit(); let bb = t.getBBox(); if (o.maxw && bb.width > o.maxw) { size *= o.maxw / bb.width; fit(); bb = t.getBBox(); }
  const pad = o.pad || [36, 22], rg = H.grp(g, 0, 0, { j: 0 });
  H.rrect(rg, bb.x - pad[0], bb.y - pad[1], bb.width + 2 * pad[0], bb.height + 2 * pad[1], o.fill || CC.cream, { r: o.r === undefined ? 20 : o.r, seed: o.seed || 3, jit: .6, th: 8 });
  g.insertBefore(rg, t); g._w = bb.width + 2 * pad[0]; g._h = bb.height + 2 * pad[1]; return g;
};
K.badge = (p, n, x, y, col) => { const g = H.grp(p, x, y, { j: .8 }); H.poly(g, H.star(0, 0, 92, 106, 22), col || CC.terra, { seed: 2, jit: .8, th: 7 }); H.circ(g, 0, 0, 72, "none", { sh: false, attr: { stroke: CC.cream, "stroke-width": 4, "stroke-dasharray": "9 8", "stroke-opacity": .9 } }); H.txt(g, String(n), 0, 36, 104, CC.cream, { font: "Anton, sans-serif", w: 400 }); return g; };
K.spot = (p, x, y, r, seed = 1, col = CC.cell) => { const g = H.grp(p, x, y, { j: .6 }); H.blob(g, 0, 0, r, r * .9, col, { n: 11, jit: .22, seed, th: 3 }); H.blob(g, -r * .25, -r * .28, r * .32, r * .26, "#7A4A2A", { n: 8, jit: .1, seed: seed + 1, sh: false, th: 0 }); return g; };
K.PSP = [[-95, -60, 30], [75, -95, 24], [115, 50, 36], [-60, 95, 26], [10, 5, 30], [-135, 25, 20]];
K.patch = (p, cx, cy, R, o = {}) => { const g = H.grp(p, cx, cy, { j: .5 }); const s = R / 250; H.blob(g, 0, 0, R, R, CC.skin, { seed: 4, jit: .03, sh: "sh2", th: 10 }); H.blob(g, -R * .08, -R * .1, R * .78, R * .74, CC.skinL, { seed: 5, jit: .03, sh: false, th: 0, attr: { opacity: .5 } }); g.sp = K.PSP.map((q, i) => K.spot(g, q[0] * s, q[1] * s, q[2] * s, i + 2)); return g; };
K.cell = (p, x, y, s = 1) => {
  const g = H.grp(p, x, y, { j: .6 }), q = H.grp(g, 0, 0, { j: 0 }); H.set(q, { s }); g.q = q;
  [[-155, 70], [-122, 86], [-90, 98], [-58, 86], [-25, 70]].forEach(([a, L], i) => { const r = a * Math.PI / 180, dx = Math.cos(r), dy = Math.sin(r), px = -dy, py = dx, b = 34, w = 10; H.poly(q, [[dx * b + px * w, dy * b + py * w], [dx * (b + L) + px * 2, dy * (b + L) + py * 2], [dx * (b + L) - px * 2, dy * (b + L) - py * 2], [dx * b - px * w, dy * b - py * w]], CC.cell, { seed: i + 2, jit: .6, th: 2 }); H.circ(q, dx * (b + L), dy * (b + L), 6, CC.cell, { sh: false, th: 0 }); });
  H.blob(q, 0, 0, 42, 36, CC.cell, { n: 14, jit: .08, seed: 3, th: 4 }); H.circ(q, 6, -3, 15, "#7A4A2A", { sh: false, th: 0 }); H.circ(q, 9, -6, 5, "#B07A52", { sh: false, th: 0 }); return g;
};
/* coupe de peau : couches de papier empilées, mélanocytes à la base de l'épiderme */
K.skin = (p, y0) => {
  const o = { cells: [], y0 }; const band = (y, h, c, seed, corr) => H.rrect(p, -60, y, 1200, h, c, { r: 0, sh: "sh1", jit: 1.4, seed, th: 4, corr });
  band(y0, 110, "#F7E3C3", 3); band(y0 + 110, 300, "#E7B58B", 4); band(y0 + 410, 420, "#B87850", 5, true); band(y0 + 830, 700, "#8B5738", 6, true);
  for (let r = 0; r < 3; r++) for (let i = 0; i < 13; i++) H.rrect(p, -30 + i * 88 + (r % 2) * 44, y0 + 126 + r * 80, 76, 62, "#F2CBA4", { r: 22, sh: false, th: 0, jit: .8, seed: i + r * 20 });
  for (let i = 0; i < 4; i++) H.el("path", { d: `M-40,${y0 + 520 + i * 72} q130,-42 260,0 t260,0 t260,0 t260,0`, stroke: "#7A4630", "stroke-width": 8, fill: "none", "stroke-linecap": "round", opacity: .55 }, p);
  for (let i = 0; i < 5; i++) o.cells.push(K.cell(p, 130 + i * 205, y0 + 392, 1)); return o;
};
K.arrow = (p, x1, y1, x2, y2, col = CC.cream, w = 56) => { const len = Math.hypot(x2 - x1, y2 - y1), g = H.grp(p, x1, y1, { j: .6 }); g._b.r = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI; g.len = len; const h = w * 1.1; H.poly(g, [[0, -w / 2], [len - h, -w / 2], [len - h, -w], [len, 0], [len - h, w], [len - h, w / 2], [0, w / 2]], col, { seed: 4, jit: 1 }); return g; };
K.cross = (p, cx, cy, r, col = CC.red) => { const g = H.grp(p, cx, cy, { j: .7 }); [45, -45].forEach((a, i) => { const s = H.grp(g, 0, 0, { j: 0 }); s._b.r = a; H.rrect(s, -r, -r * .15, r * 2, r * .3, col, { r: r * .1, jit: .5, seed: i + 3, sh: i ? false : "sh1" }); }); return g; };
K.ring = (p, cx, cy, r, col = CC.red, w = 12) => { const g = H.grp(p, cx, cy, { j: .8 }); H.circ(g, 0, 0, r, "none", { sh: false, attr: { stroke: col, "stroke-width": w, "stroke-dasharray": "26 16", "stroke-opacity": 1 } }); return g; };
K.burst = (p, r1, r2, n, col) => { const g = H.grp(p, 0, 0, { j: 1.1 }); H.poly(g, H.star(0, 0, r1, r2, n), col, { seed: 6, jit: 1.5, th: 6 }); return g; };
K.sun = (p, r = 90) => { const g = H.grp(p, 0, 0, { j: .9 }); for (let i = 0; i < 12; i++) { const a = i / 12 * 6.283; H.poly(g, [[Math.cos(a - .12) * (r + 24), Math.sin(a - .12) * (r + 24)], [Math.cos(a) * (r + 86), Math.sin(a) * (r + 86)], [Math.cos(a + .12) * (r + 24), Math.sin(a + .12) * (r + 24)]], "#E0A32B", { seed: i, jit: 1, sh: "sh1", th: 3 }); } H.circ(g, 0, 0, r, CC.sun, { sh: "sh", th: 7 }); H.circ(g, -r * .2, -r * .2, r * .5, "#F7D774", { sh: false, th: 0 }); return g; };
K.razor = (p, sc = 1) => { const g = H.grp(p, 0, 0, { j: .6 }), s = H.grp(g, 0, 0, { j: 0 }); H.set(s, { s: sc }); H.rrect(s, 10, -16, 230, 32, CC.blue, { r: 14, jit: 0 }); H.rrect(s, -130, -52, 150, 104, "#B9B4A6", { r: 16, jit: 0 }); for (let i = 0; i < 4; i++) H.rrect(s, -110 + i * 34, -26, 22, 52, "#8D887B", { r: 8, sh: false, th: 0, jit: 0 }); return g; };
K.pimple = (p, r = 38) => { const g = H.grp(p, 0, 0, { j: .8 }); H.circ(g, 0, 0, r + 12, "#E9A58E", { sh: false, th: 0, attr: { opacity: .7 } }); H.circ(g, 0, 0, r, CC.red); H.circ(g, -r * .3, -r * .32, r * .3, "#F7C3AE", { sh: false, th: 0 }); return g; };
K.jar = (p, col = CC.sage, sc = 1) => { const g = H.grp(p, 0, 0, { j: .6 }), s = H.grp(g, 0, 0, { j: 0 }); H.set(s, { s: sc }); H.rrect(s, -92, -48, 184, 140, col, { r: 24, jit: 0 }); H.rrect(s, -100, -90, 200, 52, CC.cream, { r: 14, jit: 0, sh: "sh1" }); H.rrect(s, -56, -12, 112, 62, CC.cream, { r: 10, sh: false, th: 0, jit: 0 }); return g; };
K.tube = (p, col = CC.blue, sc = 1) => { const g = H.grp(p, 0, 0, { j: .6 }), s = H.grp(g, 0, 0, { j: 0 }); H.set(s, { s: sc }); H.poly(s, [[-58, -150], [58, -150], [66, 120], [-66, 120]], col, { jit: 0 }); H.rrect(s, -72, 120, 144, 34, "#D8C79E", { r: 8, jit: 0, sh: "sh1" }); H.rrect(s, -40, -200, 80, 56, CC.cream, { r: 10, jit: 0, sh: "sh1" }); H.rrect(s, -38, -60, 76, 120, CC.cream, { r: 8, sh: false, th: 0, jit: 0 }); return g; };
K.bottle = (p, sc = 1) => {
  const g = H.grp(p, 0, 0, { j: .4 }), s = H.grp(g, 0, 0, { j: 0 }); H.set(s, { y: 128 * sc, s: sc }); const R = (x, y, w, h, f, o) => H.rrect(s, x, y, w, h, f, Object.assign({ jit: 0, r: 10 }, o));
  R(-88, -170, 176, 330, "#8B4A20", { r: 36, th: 8, sh: "sh" }); R(-72, -150, 14, 90, "#B5733A", { r: 7, sh: false, th: 0 }); R(-52, -215, 104, 60, "#7A3F1C"); R(-74, -268, 148, 78, "#4F2F22", { sh: "sh1", th: 4 });
  for (let i = 0; i < 9; i++) H.el("path", { d: `M${-60 + i * 15},-258V-200`, stroke: "#3A2118", "stroke-width": 4, "stroke-linecap": "round" }, s);
  H.blob(s, 0, -338, 42, 78, "#5C3F33", { n: 24, jit: 0, th: 6 }); R(-78, -60, 156, 180, "#4B2E26", { r: 8, sh: "sh1", th: 2 });
  [["MELA SKIN", -6, 26, "#E8A08A", 800, 1], ["L'expertise pensée pour vous", 16, 9.5, "#E9CDBE", 400, 0], ["SÉRUM CORRECTEUR DE TEINT", 52, 8.8, "#E8A08A", 700, .4], ["ANTI-TÂCHES", 65, 8.8, "#E8A08A", 700, .4], ["30 ml", 104, 8, "#E9CDBE", 400, 0]].forEach(([t, y, fs, c, w, ls]) => H.txt(s, t, 0, y, fs, c, { w, ls }));
  return g;
};
K.sponge = (p) => { const g = H.grp(p, 0, 0, { j: .7 }); H.blob(g, 0, 0, 74, 60, "#F0CFA8", { seed: 7, jit: .05, th: 7 }); for (let i = 0; i < 10; i++) H.circ(g, Math.cos(i * 2.2) * 38, Math.sin(i * 2.9) * 30, 4, "#D7AE82", { sh: false, th: 0 }); return g; };
K.pump = (p) => { const g = H.grp(p, 0, 0, { j: .6 }); H.rrect(g, -62, -80, 124, 230, "#E6B88C", { r: 26, jit: 0 }); H.rrect(g, -22, -128, 44, 54, CC.brown, { r: 8, jit: 0, sh: "sh1" }); H.rrect(g, -50, -146, 84, 26, CC.brown, { r: 10, jit: 0, sh: "sh1" }); H.rrect(g, -42, 0, 84, 90, CC.cream, { r: 8, sh: false, th: 0, jit: 0 }); return g; };
K.compact = (p, r = 120) => { const g = H.grp(p, 0, 0, { j: .5 }); H.circ(g, 0, 0, r, "#D9A441", { sh: "sh2", th: 12 }); H.circ(g, 0, 0, r * .84, "#E8C79A", { sh: false, th: 0 }); H.circ(g, 0, 0, r * .5, "#D9A877", { sh: false, th: 0 }); return g; };
K.card = (p, href, cx, cy, w, h, rot = 0) => { const g = H.grp(p, cx, cy, { j: .6 }); g._b.r = rot; H.rrect(g, -w / 2 - 18, -h / 2 - 18, w + 36, h + 36, "#FFFDF6", { r: 12, jit: .6, th: 10, sh: "sh" }); H.el("image", { href, x: -w / 2, y: -h / 2, width: w, height: h, preserveAspectRatio: "xMidYMid slice" }, g); H.rrect(g, -74, -h / 2 - 40, 148, 42, "rgba(236,208,150,.85)", { r: 5, sh: false, th: 0, jit: .5 }); return g; };
K.calendar = (p) => {
  const c = H.grp(p, 0, 0, { j: .6 }); c.pages = []; const M = ["JANVIER", "FÉVRIER", "MARS", "AVRIL", "MAI", "JUIN", "JUILLET", "AOÛT", "SEPTEMBRE", "OCTOBRE", "NOVEMBRE", "DÉCEMBRE"];
  const draw = (g, m, sh) => { H.rrect(g, -180, -190, 360, 400, m % 2 ? "#F2E7BA" : CC.cream, { r: 18, jit: .6, seed: m + 8, sh }); H.rrect(g, -180, -190, 360, 96, m % 2 ? CC.terraD : CC.terra, { r: 18, jit: .6, seed: m + 20, sh: false, th: 0 }); for (let r = 0; r < 4; r++) for (let q = 0; q < 5; q++) H.rrect(g, -136 + q * 66, -66 + r * 60, 44, 40, "#E2CFA0", { r: 8, sh: false, th: 0, jit: .5 }); H.txt(g, M[m], 0, -126, M[m].length <= 5 ? 50 : M[m].length <= 7 ? 42 : 34, CC.cream, { font: "Anton, sans-serif", w: 400, ls: 3 }); };
  draw(H.grp(c, 0, 0, { j: 0 }), 11, "sh"); for (let m = 10; m >= 0; m--) { const g = H.grp(c, 0, 0, { j: 0 }); draw(g, m, "sh1"); c.pages[m] = g; } return c;
};
K.dude = (p, x, y, col, sc = 1) => { const g = H.grp(p, x, y, { j: .5 }), s = H.grp(g, 0, 0, { j: 0 }); H.set(s, { s: sc }); H.circ(s, 0, -26, 20, col, { sh: "sh1", th: 2 }); H.rrect(s, -26, 0, 52, 44, col, { r: 20, jit: 0, sh: "sh1", th: 2 }); return g; };
K.q = (p, sc = 1, col = CC.cream) => { const g = H.grp(p, 0, 0, { j: .8 }), s = H.grp(g, 0, 0, { j: 0 }); H.set(s, { s: sc }); const gg = H.el("g", { filter: "url(#sh)" }, s); H.el("path", { d: "M-130,-170 C-130,-330 150,-330 150,-170 C150,-70 20,-60 20,60", stroke: col, "stroke-width": 110, fill: "none", "stroke-linecap": "round" }, gg); H.circ(s, 20, 190, 58, col, { sh: "sh" }); return g; };
K.pop = (g, p, a, b = a + .14) => H.set(g, { s: E.pop(seg(p, a, b)), o: p > a ? 1 : 0 });
K.bust = (p, x, y, sc = 1, skin = CC.skin, top = CC.sage) => { const g = H.grp(p, x, y, { j: .5 }), s = H.grp(g, 0, 0, { j: 0 }); H.set(s, { s: sc }); H.rrect(s, -190, 40, 380, 360, top, { r: 120, jit: 0 }); H.rrect(s, -44, -20, 88, 90, H.shade(skin, .85), { r: 22, jit: 0, sh: "sh1" }); g.head = H.grp(s, 0, -130, { j: 0 }); H.blob(g.head, 0, -14, 150, 160, "#1D130E", { seed: 5, jit: .03 }); H.blob(g.head, 0, 8, 112, 140, skin, { seed: 8, jit: .02, sh: "sh1" }); H.poly(g.head, [[-112, -20], [-86, -96], [0, -134], [86, -96], [112, -20], [60, -76], [0, -94], [-60, -76]], "#1D130E", { seed: 9, jit: 0, sh: false }); return g; };
