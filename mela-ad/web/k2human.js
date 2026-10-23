/* Personnage en papier découpé : buste de face, visage expressif, bras articulés (cinématique inverse) qui tiennent des accessoires */
K.SKIN = "#9C6243"; K.SKIND = "#835236";
K.woman = (p, x, y, sc = 1, o = {}) => {
  const skin = o.skin || K.SKIN, skinD = H.shade(skin, .86), hair = o.hair || "#1D130E", top = o.top || "#8DB6D6", g = H.grp(p, x, y, { j: .4 }), s = H.grp(g, 0, 0, { j: 0 }); H.set(s, { s: sc }); g.s = s; g.skin = skin;
  /* cheveux derrière (plusieurs coiffures) */
  const hs = o.hairStyle || "bun", hb = H.grp(s, 0, -230, { j: 0 }), wrapc = o.wrap || "#E0A93C";
  const ring = (n, r, rr, a0 = Math.PI, a1 = Math.PI * 2) => { for (let i = 0; i < n; i++) { const a = a0 + (a1 - a0) * i / (n - 1); H.circ(hb, Math.cos(a) * r, -22 + Math.sin(a) * (r + 6), rr, hair, { sh: false, th: 0 }); } };
  if (hs === "bun") { H.blob(hb, 0, -16, 176, 196, hair, { seed: 5, jit: .03 }); ring(9, 156, 50); H.circ(hb, 0, -190, 92, hair, { sh: "sh1", th: 4 }); for (let i = 0; i < 7; i++) H.circ(hb, Math.cos(i * .9) * 66, -190 + Math.sin(i * .9) * 50, 36, hair, { sh: false, th: 0 }); }
  else if (hs === "curly") { H.blob(hb, 0, -20, 196, 206, hair, { seed: 5, jit: .03 }); ring(13, 176, 58, Math.PI * .85, Math.PI * 2.15); for (let i = 0; i < 6; i++) H.circ(hb, -120 + i * 48, -176 - (i % 2) * 22, 50, hair, { sh: false, th: 0 }); }
  else if (hs === "long") { H.rrect(hb, -196, -60, 120, 560, hair, { r: 60, jit: 0, sh: "sh1" }); H.rrect(hb, 76, -60, 120, 560, hair, { r: 60, jit: 0, sh: "sh1" }); H.blob(hb, 0, -10, 178, 196, hair, { seed: 5, jit: .03 }); }
  else if (hs === "braids") { H.blob(hb, 0, -16, 172, 190, hair, { seed: 5, jit: .03 }); [-170, -128, -86, 86, 128, 170].forEach((bx, i) => { for (let k = 0; k < 8; k++) H.circ(hb, bx + (i % 2 ? 6 : -6), 40 + k * 52, 26 - k * .8, k % 2 ? H.shade(hair, 1.5) : hair, { sh: "sh1", th: 2 }); }); }
  else if (hs === "wrap") { H.blob(hb, 0, -10, 168, 180, hair, { seed: 5, jit: .03 }); H.blob(hb, 0, -170, 150, 110, wrapc, { seed: 11, jit: .03, sh: "sh1", th: 5 }); for (let i = 0; i < 5; i++) H.rrect(hb, -100 + i * 50, -230, 22, 120, H.shade(wrapc, .82), { r: 11, sh: false, th: 0, jit: 0 }); }
  else { H.blob(hb, 0, 0, 176, 190, hair, { seed: 5, jit: .03 }); H.rrect(hb, -176, 0, 90, 190, hair, { r: 44, jit: 0, sh: "sh1" }); H.rrect(hb, 86, 0, 90, 190, hair, { r: 44, jit: 0, sh: "sh1" }); }
  /* torse + cou */
  H.rrect(s, -214, 40, 428, 340, top, { r: 120, seed: 3, jit: 0 }); for (let i = 0; i < 4; i++) H.rrect(s, -120 + i * 80, 170, 26, 140, H.shade(top, .9), { r: 10, sh: false, th: 0, jit: 0 });
  H.rrect(s, -50, -110, 100, 170, skinD, { r: 26, jit: 0, sh: "sh1" }); H.blob(s, 0, 44, 96, 44, skin, { n: 20, jit: 0, sh: "sh1", th: 2 });
  /* tête */
  const hd = H.grp(s, 0, -230, { j: 0 }); g.head = hd;
  [[-122, 4], [122, 4]].forEach(([ex, ey]) => { H.blob(hd, ex, ey, 24, 40, skinD, { seed: 6, jit: 0, sh: "sh1" }); H.circ(hd, ex * 1.03, ey + 46, 10, "#D9A441", { sh: "sh1", th: 2 }); });
  H.blob(hd, 0, 12, 120, 152, skin, { seed: 8, jit: .015, sh: "sh1", th: 5 });
  H.blob(hd, -66, 56, 32, 22, "#C2735A", { n: 14, jit: 0, sh: false, th: 0, attr: { opacity: .32 } }); H.blob(hd, 66, 56, 32, 22, "#C2735A", { n: 14, jit: 0, sh: false, th: 0, attr: { opacity: .32 } });
  if (hs === "wrap") H.poly(hd, [[-124, -16], [-104, -104], [0, -152], [104, -104], [124, -16], [72, -62], [0, -74], [-72, -62]], wrapc, { seed: 9, jit: 0, sh: "sh1", th: 3 }); else if (hs === "long") H.poly(hd, [[-120, 10], [-110, -100], [0, -146], [110, -100], [120, 10], [76, -70], [0, -96], [-76, -70]], hair, { seed: 9, jit: 0, sh: false }); else H.poly(hd, [[-120, -20], [-96, -102], [0, -144], [96, -102], [120, -20], [68, -84], [0, -100], [-68, -84]], hair, { seed: 9, jit: 0, sh: false });
  H.blob(hd, 0, 34, 14, 20, H.shade(skin, .82), { n: 12, jit: 0, sh: false, th: 0, attr: { opacity: .6 } });
  /* yeux (3 états) */
  g.eyes = { open: H.grp(hd, 0, 0, { j: 0 }), squint: H.grp(hd, 0, 0, { j: 0 }), closed: H.grp(hd, 0, 0, { j: 0 }) };
  [-50, 50].forEach(ex => { const eo = g.eyes.open; H.blob(eo, ex, -8, 24, 15, "#FFFDF6", { n: 14, jit: 0, sh: false, th: 0 }); H.circ(eo, ex, -8, 10, "#2A1810", { sh: false, th: 0 }); H.circ(eo, ex + 3, -11, 3.4, "#fff", { sh: false, th: 0 }); H.el("path", { d: `M${ex - 26},-12 Q${ex},-32 ${ex + 26},-12`, stroke: "#1d1d1b", "stroke-width": 5, fill: "none", "stroke-linecap": "round" }, eo);
    H.el("path", { d: `M${ex - 24},-6 Q${ex},-20 ${ex + 24},-6`, stroke: "#1d1d1b", "stroke-width": 7, fill: "none", "stroke-linecap": "round" }, g.eyes.squint); H.el("path", { d: `M${ex - 24},-8 Q${ex},4 ${ex + 24},-8`, stroke: "#1d1d1b", "stroke-width": 7, fill: "none", "stroke-linecap": "round" }, g.eyes.closed); });
  /* sourcils */
  g.brow = [-50, 50].map(ex => { const b = H.grp(hd, ex, -48, { j: 0 }); H.rrect(b, -30, -5, 60, 11, hair, { r: 5, sh: false, th: 0, jit: 0 }); return b; });
  /* bouches */
  const M = g.mouths = {}; const mk = (k, f) => { const m = H.grp(hd, 0, 86, { j: 0 }); f(m); M[k] = m; };
  const mp = (m, d, w = 8) => H.el("path", { d, stroke: "#5A2A1C", "stroke-width": w, fill: "none", "stroke-linecap": "round", "stroke-linejoin": "round" }, m);
  mk("smile", m => mp(m, "M-34,-6 Q0,26 34,-6")); mk("flat", m => mp(m, "M-26,4 L26,4")); mk("sad", m => mp(m, "M-30,14 Q0,-14 30,14")); mk("wince", m => mp(m, "M-34,8 l10,-8 l12,10 l12,-10 l12,10 l10,-8")); mk("o", m => { H.blob(m, 0, 6, 15, 19, "#5A2A1C", { n: 14, jit: 0, sh: false, th: 0 }); });
  mk("grin", m => { H.el("path", { d: "M-38,-8 Q0,44 38,-8 Z", fill: "#5A2A1C", stroke: "#5A2A1C", "stroke-width": 6, "stroke-linejoin": "round" }, m); H.el("path", { d: "M-28,-3 Q0,6 28,-3 L26,0 Q0,12 -26,0Z", fill: "#FFFDF6" }, m); }); mk("smirk", m => mp(m, "M-28,8 Q8,10 30,-6"));
  /* taches (optionnelles) */
  g.sp = []; if (o.spots) [[-72, 40, 11], [-90, 70, 8], [-54, 76, 9], [72, 44, 12], [92, 74, 8], [56, 80, 9], [-30, 100, 7], [34, 106, 8], [8, -44, 9], [-34, -66, 7]].slice(0, o.spots).forEach(([sx, sy, sr], i) => g.sp.push(K.spot(hd, sx, sy, sr, i + 2, "#4A2A18")));
  /* bras : épaule → coude → main */
  const L1 = 172, L2 = 158;
  const arm = (sx, dir) => { const a = H.grp(s, sx, 56, { j: .3 }); a.dir = dir; H.rrect(a, -34, -26, 68, L1 + 34, top, { r: 34, seed: 7, jit: 0 }); const f = H.grp(a, 0, L1, { j: .2 }); H.rrect(f, -30, -16, 60, L2 + 22, top, { r: 30, seed: 8, jit: 0 }); const h = H.grp(f, 0, L2, { j: 0 }); H.blob(h, 0, 8, 40, 46, skin, { seed: 9, jit: .02, sh: "sh1", th: 3 }); a.fore = f; a.hand = h; return a; };
  g.armL = arm(-150, -1); g.armR = arm(150, 1);
  /* cinématique inverse : main en (tx,ty) dans le repère du buste ; bend 1 = coude vers l'extérieur, -1 = vers l'intérieur */
  g.reach = (side, tx, ty, bend = 1) => {
    const a = side === "L" ? g.armL : g.armR, S = [a._b.x, a._b.y]; let dx = tx - S[0], dy = ty - S[1], d = Math.hypot(dx, dy); const dm = L1 + L2 - 1; if (d > dm) { dx *= dm / d; dy *= dm / d; d = dm; } d = Math.max(d, 70);
    const al = Math.acos(clamp((L1 * L1 + d * d - L2 * L2) / (2 * L1 * d), -1, 1)), base = Math.atan2(dy, dx), c = [base + al, base - al].map(th => [S[0] + Math.cos(th) * L1, S[1] + Math.sin(th) * L1, th]);
    const sc = q => q[0] * a.dir * bend, pick = sc(c[0]) >= sc(c[1]) ? c[0] : c[1], ex = pick[0], ey = pick[1];
    const t1 = Math.atan2(-(ex - S[0]), ey - S[1]) * 180 / Math.PI, t2 = Math.atan2(-(S[0] + dx - ex), S[1] + dy - ey) * 180 / Math.PI; H.set(a, { r: t1 }); H.set(a.fore, { r: t2 - t1 });
  };
  /* expression : brow (−1 à 1 inquiet), yeux, bouche */
  g.exp = (k = {}) => { const br = k.brow || 0; H.set(g.brow[0], { r: -br * 14 + (k.arch || 0) * 0, y: -48 - (k.raise || 0) * 12 }); H.set(g.brow[1], { r: br * 14 + (k.skew || 0), y: -48 - (k.raise2 !== undefined ? k.raise2 : (k.raise || 0)) * 12 }); ["open", "squint", "closed"].forEach(e => H.set(g.eyes[e], { o: (k.eyes || "open") === e ? 1 : 0 })); Object.keys(M).forEach(m => H.set(M[m], { o: (k.mouth || "flat") === m ? 1 : 0 })); };
  g.exp({}); g.idle = () => { g.reach("L", -178, 340); g.reach("R", 178, 340); }; g.idle(); return g;
};
/* accessoires tenus en main (dessinés autour de l'origine de la main) */
K.hold = {
  pad: h => { const g = H.grp(h, 0, 20, { j: .5 }); H.circ(g, 0, 0, 44, "#F6EEDB", { sh: "sh1", th: 4 }); H.circ(g, 0, 0, 30, "#EADDBF", { sh: false, th: 0 }); return g; },
  sponge: h => { const g = H.grp(h, 0, 14, { j: .5 }); H.blob(g, 0, 0, 46, 38, "#F0CFA8", { seed: 7, jit: .05, th: 5 }); return g; },
  box: h => { const g = H.grp(h, 0, 0, { j: .3 }); g._b.r = -12; H.rrect(g, -62, -110, 124, 190, "#FBF3E0", { r: 8, jit: 0, th: 8 }); H.circ(g, 0, -40, 28, "#F3D9C2", { sh: false, th: 0 }); H.rrect(g, -34, -4, 68, 26, "#9EC1DB", { r: 8, sh: false, th: 0, jit: 0 }); H.circ(g, 0, -46, 6, "#C2735A", { sh: false, th: 0 }); return g; },
  tube: h => { const g = H.grp(h, 0, 0, { j: .4 }); g._b.r = 15; H.poly(g, [[-30, -100], [30, -100], [36, 70], [-36, 70]], "#5C86A8", { jit: 0 }); H.rrect(g, -22, -140, 44, 42, "#FBF1D3", { r: 8, jit: 0, sh: "sh1" }); return g; },
  jar: h => { const g = H.grp(h, 0, 0, { j: .4 }); H.rrect(g, -52, -10, 104, 80, "#F2C9C0", { r: 16, jit: 0 }); H.rrect(g, -58, -40, 116, 34, "#FBF1D3", { r: 10, jit: 0, sh: "sh1" }); return g; },
  scrub: h => { const g = H.grp(h, 0, 20, { j: .5 }); H.blob(g, 0, 0, 50, 40, "#F6EBD6", { seed: 5, jit: .09, th: 4 }); for (let i = 0; i < 14; i++) H.circ(g, Math.cos(i * 2.4) * 30, Math.sin(i * 3.1) * 24, 3.4, ["#C9A06A", "#8A5A3C", "#E2C48E"][i % 3], { sh: false, th: 0 }); return g; },
  razor: h => { const g = H.grp(h, 0, 0, { j: .4 }); g._b.r = 40; H.rrect(g, -12, -20, 24, 160, "#5C86A8", { r: 10, jit: 0 }); H.rrect(g, -50, -70, 100, 60, "#B9B4A6", { r: 12, jit: 0 }); for (let i = 0; i < 3; i++) H.rrect(g, -36 + i * 28, -56, 18, 32, "#8D887B", { r: 6, sh: false, th: 0, jit: 0 }); return g; },
  bottle: h => { const g = H.grp(h, 0, -20, { j: .4 }); H.rrect(g, -40, -60, 80, 130, "#8B4A20", { r: 22, jit: 0 }); H.rrect(g, -52, -86, 104, 34, "#4F2F22", { r: 10, jit: 0, sh: "sh1" }); H.rrect(g, -34, -4, 68, 62, "#4B2E26", { r: 6, sh: false, th: 0, jit: 0 }); return g; },
  dropper: h => { const g = H.grp(h, 0, 0, { j: .4 }); g._b.r = 28; H.rrect(g, -9, -10, 18, 150, "#E8DDC6", { r: 8, jit: 0, sh: "sh1" }); H.blob(g, 0, -34, 20, 38, "#5C3F33", { n: 14, jit: 0, th: 3 }); return g; },
  mirror: h => { const g = H.grp(h, 0, 0, { j: .4 }); g._b.r = 12; H.rrect(g, -10, 20, 20, 120, "#D9A441", { r: 9, jit: 0 }); H.blob(g, 0, -40, 58, 78, "#D9A441", { n: 22, jit: 0, th: 6 }); H.blob(g, 0, -40, 46, 66, "#CDE0E7", { n: 22, jit: 0, sh: false, th: 0 }); H.el("path", { d: "M-24,-76 L-6,-92", stroke: "#fff", "stroke-opacity": .7, "stroke-width": 8, "stroke-linecap": "round" }, g); return g; },
  phone: h => { const g = H.grp(h, 0, 0, { j: .3 }); H.rrect(g, -42, -86, 84, 168, "#2B2B2B", { r: 16, jit: 0 }); H.rrect(g, -34, -72, 68, 138, "#E6F0E3", { r: 8, sh: false, th: 0, jit: 0 }); H.circ(g, 0, -10, 18, "#7FA283", { sh: false, th: 0 }); return g; },
  pen: h => { const g = H.grp(h, 0, 0, { j: .4 }); g._b.r = 35; H.rrect(g, -7, -30, 14, 140, "#D2452F", { r: 6, jit: 0 }); return g; },
  card: h => { const g = H.grp(h, 0, 0, { j: .3 }); g._b.r = -10; H.rrect(g, -70, -44, 140, 90, "#5C86A8", { r: 12, jit: 0 }); H.rrect(g, -60, -22, 120, 14, "#E9D9AA", { r: 4, sh: false, th: 0, jit: 0 }); return g; },
  pills: h => { const g = H.grp(h, 0, 0, { j: .4 }); H.rrect(g, -54, -64, 108, 128, "#F6EDD0", { r: 10, jit: 0 }); for (let i = 0; i < 6; i++) H.circ(g, -28 + (i % 2) * 56, -40 + Math.floor(i / 2) * 40, 12, ["#E9B8A0", "#7FA283"][i % 2], { sh: false, th: 0 }); return g; }
};
