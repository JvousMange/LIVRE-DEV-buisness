/* Kit storyboard v3 : plaques d'hyperpigmentation, gros plans recadrés, corps entier, natures mortes, coupe soulevée, étiquettes au feutre */
const DK = "#1E120C", DK2 = "#3B2418";
/* fond carton ondulé */
S.board = (g, col = "#C49A68") => { H.rrect(g, -60, -60, 1200, 2040, col, { r: 0, sh: false, jit: 0 }); for (let i = 0; i < 40; i++) H.rrect(g, -60 + i * 30, -60, 3, 2040, "#2a1305", { r: 0, sh: false, th: 0, jit: 0, attr: { opacity: .07 } }); H.torn(g, -80, 1640, 1240, 400, H.shade(col, .9), { seed: 3, th: 10 }); };
S.plain = (g, col = "#D2AE80") => H.rrect(g, -60, -60, 1200, 2040, col, { r: 0, sh: false, jit: 0 });
/* plaques de taches irrégulières sur un visage K4.face (dans f.hd). level 0..1 */
S.PATCH = [[-92, 34, 46, 1], [86, 44, 52, 2], [-46, 104, 30, 3], [60, 116, 34, 4], [-112, -20, 26, 5], [24, -86, 22, 6], [0, 150, 22, 7], [118, 0, 24, 8], [-70, 150, 18, 9], [104, 96, 20, 10]];
S.patches = (f, level = 1, o = {}) => { const n = Math.round(S.PATCH.length * level), out = [], op = o.op === undefined ? .92 : o.op; S.PATCH.slice(0, n).forEach(([x, y, r, sd]) => { const k = (o.scale || 1) * (.6 + .3 * level); const g = H.grp(f.hd, x, y, { j: .3 }); H.blob(g, 0, 0, r * k, r * .68 * k, "#2E1A10", { n: 16, jit: .22, seed: sd, sh: false, th: 0, attr: { opacity: op } }); H.blob(g, r * .7 * k, r * .3 * k, r * .3 * k, r * .22 * k, "#2E1A10", { n: 10, jit: .2, seed: sd + 30, sh: false, th: 0, attr: { opacity: op } }); out.push(g); }); return out; };
S.freckles = (g, x, y, w, h, n, seed = 3, r0 = 5) => { const r = H.rng(seed); for (let i = 0; i < n; i++) H.blob(g, x + r() * w, y + r() * h, r0 + r() * 5, r0 * .8 + r() * 4, DK, { n: 9, jit: .2, seed: i + seed, sh: false, th: 0 }); };
/* gros plan joue / mâchoire, décentré */
S.jaw = (g, o = {}) => { const f = K4.face(g, o.x || 400, o.y || 300, o.s || 2.7, { hair: o.hair || "bob", turn: o.turn === undefined ? .5 : o.turn, cloth: o.cloth }); return f; };
/* corps entier de face. y = pieds. bras : listes de points locaux (épaule -> coude -> main) */
S.body = (g, x, y, s = .8, o = {}) => { const b = H.grp(g, x, y, { j: .3 }), q = H.grp(b, 0, 0, { j: 0 }); H.set(q, { s }); b.q = q; const top = o.top || K3.CLOTH, pants = o.pants || "#3F5A78", sk = o.skin || S.SK;
  [-1, 1].forEach(sg => { H.rrect(q, sg * 66 - 58, -900, 116, 880, pants, { r: 40, jit: 0, th: 6 }); H.rrect(q, sg * 66 - 64 + sg * 10, -40, 128, 52, "#2B2522", { r: 22, jit: 0, th: 5 }); });
  H.poly(q, [[-196, -1470], [196, -1470], [226, -1300], [176, -1100], [186, -870], [-186, -870], [-176, -1100], [-226, -1300]], top, { jit: 0, th: 8 });
  const armL = o.armL || [[-214, -1420], [-260, -1150], [-250, -900]], armR = o.armR || [[214, -1420], [260, -1150], [250, -900]];
  const arm = pts => { K3.sil(q, [{ d: K3.line(pts.slice(0, 2)), line: 1, w: 104, fill: top }], { j: 0 }); K3.sil(q, [{ d: K3.line(pts.slice(1)), line: 1, w: 80, fill: sk }], { j: 0 }); const h = pts[pts.length - 1]; H.blob(q, h[0], h[1], 52, 60, sk, { n: 14, jit: .03, th: 4 }); };
  b.head = K4.face(q, 0, -1690, .56, { hair: o.hair || "bob", turn: o.turn || 0, tilt: o.tilt || 0, cloth: top, skin: sk });
  if (o.behind !== true) { arm(armL); arm(armR); }
  b.pt = (lx, ly) => [x + lx * s, y + ly * s]; return b; };
/* étiquette au feutre : papier crème déchiré + ficelle */
S.tag = (g, txt, x, y, size = 80, o = {}) => { const t = H.grp(g, x, y, { j: .4 }); t._b.r = o.r || 0; const lines = String(txt).split("\n"); const tx = H.txt(t, txt, 0, 0, size, o.ink || "#1E1A17", { font: "Marker, sans-serif", w: 400, lh: 1.05 }); tx.setAttribute("y", size * .35 - (lines.length - 1) * size * .52); let bb = tx.getBBox(); const w = Math.max(bb.width + 70, 160), hh = bb.height + 50; if (o.string !== false) { H.el("path", { d: `M${-w * .3},${-hh / 2} L${-w * .12},${-hh / 2 - 1400} M${w * .3},${-hh / 2} L${w * .12},${-hh / 2 - 1400}`, stroke: "#6b543a", "stroke-width": 4, fill: "none" }, t); } const p = H.grp(t, 0, 0, { j: 0 }); H.torn(p, -w / 2, -hh / 2, w, hh, o.paper || "#F1E6CC", { seed: o.seed || 5, th: 5 }); t.insertBefore(p, tx); return t; };
/* éclats (moment fort) */
S.burst = (g, x, y, n = 14, r0 = 160, r1 = 420, cols = [DK, DK2, "#C8392B"]) => { const rg = H.rng(9); for (let i = 0; i < n; i++) { const a = i / n * 6.283 + rg() * .3, rr = r0 + rg() * (r1 - r0), k = 16 + rg() * 26; H.poly(g, [[0, -k], [k * .6, k], [-k * .6, k]].map(([px, py]) => [x + Math.cos(a) * rr + px, y + Math.sin(a) * rr + py]), cols[i % cols.length], { jit: 0, th: 3 }); } };
/* coupe de peau soulevée : surface (avec tache) + couches + mélanocytes + grains. flap 0..1 */
S.cut = (g, y0 = 640, o = {}) => { const C = { y0, cells: [], cy: y0 + 360 }, flap = o.flap || 0, wave = (y, a = 14, ph = 0) => { const pts = []; for (let x = -100; x <= 1180; x += 40) pts.push([x, y + Math.sin(x / 90 + ph) * a]); return pts; };
  const band = (yA, yB, col, ph, seed) => H.poly(g, [...wave(yA, 12, ph), [1180, yB], [-100, yB]], col, { jit: 0, th: 6, seed });
  band(y0 + 900, 2100, "#E3B33F", 2, 6); for (let i = 0; i < 16; i++) H.circ(g, 30 + (i % 8) * 140 + (Math.floor(i / 8) % 2) * 70, y0 + 1000 + Math.floor(i / 8) * 150, 62, "#F0C455", { sh: "sh1", th: 4 });
  band(y0 + 400, y0 + 920, "#C46F62", 1, 5); for (let i = 0; i < 4; i++) H.el("path", { d: `M-100,${y0 + 520 + i * 90} q130,-40 260,0 t260,0 t260,0 t260,0 t260,0`, stroke: ["#D9897A", Q.red, "#3F6FA0", "#D9897A"][i], "stroke-width": i % 3 ? 12 : 6, fill: "none", "stroke-linecap": "round", opacity: .9 }, g);
  band(y0 + 60, y0 + 420, "#8C5634", 0, 4); for (let r = 0; r < 3; r++) for (let i = 0; i < 14; i++) H.blob(g, -40 + i * 92 + (r % 2) * 46, y0 + 140 + r * 86 + Math.sin(i) * 6, 40, 30, "#A36B45", { n: 12, jit: .05, seed: i + r * 20, sh: false, th: 0, attr: { stroke: "#6E4228", "stroke-width": 3 } });
  const nc = o.cells || 4; for (let i = 0; i < nc; i++) { const c = K.cell(g, 160 + i * (760 / (nc - 1)), C.cy, 1.45); C.cells.push(c); }
  const G = o.grains || 0, rg = H.rng(o.seed || 4); for (let i = 0; i < nc; i++) for (let k = 0; k < G; k++) K3.dot(g, 160 + i * (760 / (nc - 1)) + (rg() - .5) * 150, C.cy - 70 - rg() * (o.high ? 230 : 150), o.r || 15, i * 9 + k, MEL);
  if (o.extra) for (let k = 0; k < o.extra; k++) K3.dot(g, (o.ex || 540) + (rg() - .5) * 240, C.cy - 60 - rg() * 260, o.r || 15, k + 80, MEL);
  const sf = H.grp(g, 0, 0, { j: 0 }); H.poly(sf, [...wave(y0, 8), ...wave(y0 + 70, 8).reverse()], S.SK, { jit: 0, th: 8 });
  if (o.spot !== false) H.blob(sf, 540, y0 + 20, 150, 30, DK, { n: 16, jit: .12, sh: false, th: 0, attr: { opacity: .9 } });
  if (flap > 0) { const fl = H.grp(g, 1180, y0, { j: 0 }); fl._b.r = 38 * flap; H.poly(fl, [[-700, -4], [0, -4], [0, 70], [-700, 70]], "#C9925F", { jit: 1, th: 8 }); H.poly(fl, [[-700, -4], [0, -4], [0, 22], [-700, 22]], S.SK, { jit: 0, th: 0, sh: false }); }
  return C; };
/* macro : un mélanocyte géant */
S.melano = (g, x, y, s = 3.2, n = 6, o = {}) => { H.rrect(g, -60, y - 700, 1200, 980, "#8C5634", { r: 0, sh: false, jit: 0 }); for (let r = 0; r < 4; r++) for (let i = 0; i < 6; i++) H.blob(g, 60 + i * 190 + (r % 2) * 95, y - 600 + r * 160, 84, 64, "#A36B45", { n: 14, jit: .05, seed: i + r * 7, sh: false, th: 0, attr: { stroke: "#6E4228", "stroke-width": 4 } }); H.rrect(g, -60, y + 200, 1200, 900, "#C46F62", { r: 0, sh: "sh1", jit: 0, th: 0 }); const c = K.cell(g, x, y, s); const rg = H.rng(o.seed || 7); for (let i = 0; i < n; i++) K3.dot(g, x + (rg() - .5) * 700, y - 140 - rg() * (o.high || 380), 22 + rg() * 8, i + 3, MEL); return c; };
S.loupe = (g, x, y, r, inner) => { const lp = H.grp(g, x, y, { j: 0 }); const cont = H.grp(lp, 0, 0, { j: 0 }); S.clip(cont, `M${-r},0 a${r},${r} 0 1,0 ${2 * r},0 a${r},${r} 0 1,0 ${-2 * r},0Z`); inner(cont); H.circ(lp, 0, 0, r, "none", { sh: "sh2", th: 0, attr: { stroke: "#2A211D", "stroke-width": 34 } }); const hd = H.grp(lp, r * .74, r * .74, { j: 0 }); hd._b.r = -45; H.rrect(hd, -26, 20, 52, 300, "#2A211D", { r: 20, jit: 0, th: 6 }); return lp; };
