/* Kit k4 : mécanismes « à la Cloudless » (coupe de peau à couvercle, usine à mélanine, cadran, torse ouvert, symboles d'agression) */
const K4 = {};
const RED = "#C8392B", REDL = "#E0705A", MEL = "#4A2A18";
K3.dot = (p, x, y, r, seed = 1, col = RED) => { const g = H.grp(p, x, y, { j: .5 }); H.blob(g, 0, 0, r, r * .92, col, { n: 10, jit: .12, seed, th: 3, sh: "sh1" }); H.blob(g, -r * .25, -r * .3, r * .35, r * .28, col === RED ? REDL : "#8A5A3C", { n: 8, jit: .1, seed: seed + 1, sh: false, th: 0 }); return g; };

/* coupe de peau : K4.skin(p, y0) -> { lid (stratum + épiderme), base (derme, graisse), cells[], y0, cy } */
K4.skin = (p, y0 = 600, o = {}) => {
  const S = { y0, cells: [], cy: y0 + 322 }, W = 1300, X0 = -110;
  const bandIn = (g, y, h, c, seed, corr) => H.rrect(g, X0, y, W, h, c, { r: 0, sh: "sh1", jit: 1.4, seed, th: 5, corr });
  S.base = H.grp(p, 0, 0, { j: 0 }); S.lid = H.grp(p, 0, 0, { j: 0 });
  bandIn(S.base, y0 + 340, 430, "#E08A7A", 5, true); bandIn(S.base, y0 + 770, 760, "#E3B33F", 6);
  for (let i = 0; i < 3; i++) H.el("path", { d: `M${X0},${y0 + 470 + i * 90} q130,-50 260,0 t260,0 t260,0 t260,0 t260,0`, stroke: i % 2 ? Q.blue : Q.red, "stroke-width": 12, fill: "none", "stroke-linecap": "round", opacity: .9 }, S.base);
  for (let i = 0; i < 18; i++) H.circ(S.base, 20 + (i % 9) * 130 + (Math.floor(i / 9) % 2) * 65, y0 + 890 + Math.floor(i / 9) * 140, 56, "#F0C455", { sh: "sh1", th: 4 });
  bandIn(S.lid, y0, 90, "#F4E8C9", 3); bandIn(S.lid, y0 + 90, 250, "#EEC79B", 4);
  for (let r = 0; r < 3; r++) for (let i = 0; i < 15; i++) H.rrect(S.lid, X0 + 10 + i * 86 + (r % 2) * 43, y0 + 108 + r * 76, 76, 62, "#F7DDBA", { r: 24, sh: false, th: 0, jit: .8, seed: i + r * 20, attr: { stroke: "#D9A875", "stroke-width": 3, "stroke-opacity": .9 } });
  S.cg = H.grp(p, 0, 0, { j: 0 });
  for (let i = 0; i < (o.n || 5); i++) S.cells.push(K.cell(S.cg, 120 + i * 210, S.cy, 1));
  return S;
};
/* grains de mélanine : montent depuis les cellules vers la surface. k = nombre par cellule */
K4.grains = (S, p, k = 3, r = 11) => { const G = []; S.cells.forEach((c, ci) => { for (let j = 0; j < k; j++) { const d = K3.dot(p, c._b.x, S.cy, r, ci * 7 + j, MEL); d._cx = c._b.x + (j - (k - 1) / 2) * 34; G.push(d); } }); return G; };
K4.rise = (S, G, t, speed = .8, top = null, show = 1) => { top = top === null ? S.y0 + 150 : top; G.forEach((d, i) => { const ph = (t * speed + i * .37) % 1; H.set(d, { x: d._cx + Math.sin(t * 3 + i) * 5, y: lerp(S.cy - 10, top - (i % 3) * 20, ph), o: show * (ph < .12 ? ph / .12 : 1), s: 1 }); }); };

/* usine : corps noir, trémie, 3 engrenages, goulotte avec grains. -> { g, gears[], out(t) } */
K4.factory = (p, x, y, s = 1) => {
  const F = { g: H.grp(p, x, y, { j: .3 }) }, q = H.grp(F.g, 0, 0, { j: 0 }); H.set(q, { s }); F.q = q;
  H.rrect(q, -250, -170, 500, 340, Q.blk, { r: 22, jit: 0, sh: "sh2", th: 12 }); H.rrect(q, -210, -130, 420, 170, "#3A2F29", { r: 14, jit: 0, sh: false, th: 0 });
  H.poly(q, [[-130, -250], [130, -250], [90, -170], [-90, -170]], "#EFE6D2", { jit: 0, th: 6 });
  F.gears = []; [[-110, -50, 60, 84, 10, Q.blue, 1], [40, -48, 48, 68, 9, Q.red, -1], [150, 40, 38, 54, 8, "#E2B13C", 1]].forEach(([gx, gy, ri, ro, n, c, dir]) => { const gg = H.grp(q, gx, gy, { j: 0 }); H.poly(gg, H.gear(0, 0, ri, ro, n), c, { jit: 0, th: 6 }); H.circ(gg, 0, 0, ri * .35, Q.blk, { sh: false, th: 0 }); gg._dir = dir; F.gears.push(gg); });
  H.poly(q, [[-60, 170], [60, 170], [90, 250], [-90, 250]], "#8A5A3C", { jit: 0, th: 6 });
  F.drops = []; for (let i = 0; i < 6; i++) F.drops.push(K3.dot(q, 0, 250, 12, i + 2, MEL));
  F.spin = (t, k = 1) => F.gears.forEach((gg, i) => H.set(gg, { r: t * 70 * k * gg._dir * (1 + i * .15) }));
  F.out = (t, rate = 1, vis = 1) => F.drops.forEach((d, i) => { const ph = (t * rate + i / 6) % 1; H.set(d, { x: Math.sin(i * 2.1) * 24, y: 250 + ph * 380, o: vis * (ph < .1 ? ph / .1 : 1) }); });
  return F;
};
/* cadran : face crème, arc vert/jaune/rouge, aiguille. dial.nd._b.r en degrés (0 = haut ; -80 vert gauche ; +80 rouge droite) */
K4.dial = (p, x, y, r = 170) => {
  const g = H.grp(p, x, y, { j: .3 }); H.circ(g, 0, 0, r + 26, "#6b543a", { sh: "sh2", th: 12 }); H.circ(g, 0, 0, r, "#F3EBD6", { sh: false, th: 0 });
  const arc = (a0, a1, c) => { const pts = []; for (let k = 0; k <= 10; k++) { const a = (a0 + (a1 - a0) * k / 10 - 90) * Math.PI / 180; pts.push([Math.cos(a) * r * .84, Math.sin(a) * r * .84]); } for (let k = 10; k >= 0; k--) { const a = (a0 + (a1 - a0) * k / 10 - 90) * Math.PI / 180; pts.push([Math.cos(a) * r * .64, Math.sin(a) * r * .64]); } H.poly(g, pts, c, { jit: 0, sh: false, th: 0 }); };
  arc(-100, -35, Q.green); arc(-35, 35, Q.yellow); arc(35, 100, RED);
  for (let i = 0; i <= 10; i++) { const a = (-100 + i * 20 - 90) * Math.PI / 180; H.el("path", { d: `M${Math.cos(a) * r * .9},${Math.sin(a) * r * .9} L${Math.cos(a) * r * .97},${Math.sin(a) * r * .97}`, stroke: Q.blk, "stroke-width": 5 }, g); }
  g.nd = H.grp(g, 0, 0, { j: .4 }); H.poly(g.nd, [[-8, 0], [0, -r * .78], [8, 0]], Q.blk, { jit: 0, sh: "sh1", th: 3 }); H.circ(g.nd, 0, 0, 14, Q.blk, { sh: false, th: 0 }); g.nd._b.r = -80; return g;
};
/* symboles d'agression */
K4.fem = (p, r = 46, col = Q.red) => { const g = H.grp(p, 0, 0, { j: .8 }); H.circ(g, 0, -10, r, "none", { sh: "sh1", th: 0, attr: { stroke: col, "stroke-width": 20 } }); H.rrect(g, -9, r - 6, 18, r * 1.1, col, { r: 4, jit: 0, sh: false, th: 0 }); H.rrect(g, -r * .5, r + r * .35, r, 16, col, { r: 4, jit: 0, sh: false, th: 0 }); return g; };
K4.mal = (p, r = 46, col = Q.blue) => { const g = H.grp(p, 0, 0, { j: .8 }); H.circ(g, -8, 8, r, "none", { sh: "sh1", th: 0, attr: { stroke: col, "stroke-width": 20 } }); H.poly(g, [[r * .5, -r * .3], [r * 1.5, -r * 1.3], [r * .7, -r * 1.3], [r * .7, -r * 1.6], [r * 1.8, -r * 1.6], [r * 1.8, -r * .5], [r * 1.5, -r * .5], [r * 1.5, -r * 1.3]], col, { jit: 0, sh: false, th: 0 }); return g; };
/* torse ouvert : buste + trou déchiré + cadran + gyrophare */
K4.chest = (p, cx, y) => {
  const g = H.grp(p, 0, 0, { j: 0 });
  H.rrect(g, -60, y + 1000, 1200, 700, K3.CLOTH, { r: 0, sh: false, jit: 0 }); g.b = K3.bust(g, cx, y, 1.05, { spots: 8 }); const hy = y + 560;
  const tear = []; for (let i = 0; i < 18; i++) { const a = i / 18 * 6.283, rr = 215 + (i % 2 ? 34 : -6); tear.push([cx + Math.cos(a) * rr, hy + Math.sin(a) * rr * .92]); }
  H.poly(g, tear, "#2A211D", { jit: 3, seed: 5, th: 7 }); H.circ(g, cx, hy, 192, "#EFE6D2", { sh: "sh1", th: 4 });
  g.dial = K4.dial(g, cx, hy, 150);
  g.si = H.grp(g, cx, hy - 205, { j: .6 }); H.rrect(g.si, -36, -4, 72, 30, "#6b543a", { r: 6, jit: 0 }); H.blob(g.si, 0, -22, 32, 40, RED, { n: 14, jit: .03, th: 4 });
  g.rays = []; for (let i = 0; i < 6; i++) { const a = (-150 + i * 24) * Math.PI / 180, r = H.grp(g.si, 0, -22, { j: 1 }); H.poly(r, [[Math.cos(a) * 60, Math.sin(a) * 60], [Math.cos(a) * 110, Math.sin(a) * 110], [Math.cos(a + .1) * 60, Math.sin(a + .1) * 60]], REDL, { jit: 0, sh: false, th: 0 }); g.rays.push(r); }
  return g;
};
/* rangée de produits barrés d'une croix */
K4.xrow = (p, y, n = 5) => { const cols = ["#F2C9C0", "#CFE0E8", "#F6E3A6", "#E9D8C8", "#CDE3D0"], g = H.grp(p, 0, 0, { j: 0 }); g.it = []; g.xs = []; for (let i = 0; i < n; i++) { const x = 130 + i * (820 / (n - 1)); const it = i % 2 ? K.tube(g, cols[i % 5], .62) : K.jar(g, cols[i % 5], .72); H.set(it, { x, y }); g.it.push(it); const c = K.cross(g, x, y - 10, 70); g.xs.push(c); } return g; };
/* panneau d'actif : feuille déchirée avec nom + dosage (grande lisibilité) */
K4.tag = (p, txt, x, y, o = {}) => K3.sign(p, txt, x, y, Object.assign({ size: 84, maxw: 800 }, o));
