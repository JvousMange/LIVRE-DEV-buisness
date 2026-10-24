/* Rig v7 : gros plan joue (3/4), points qui éclosent, bras articulé (IK 2 os), mains qui tiennent les objets, tube qui se presse, filet de crème, éponge qui tamponne */
const R = {};
R.SK = "#A06A44"; R.SKD = "#8A5A3A"; R.SKL = "#B98258"; R.HAIR = "#2E2926"; R.CLOTH = "#3E3834"; R.DOT = "#1B110C";
const V2 = { add: (a, b) => [a[0] + b[0], a[1] + b[1]], sub: (a, b) => [a[0] - b[0], a[1] - b[1]], mul: (a, k) => [a[0] * k, a[1] * k], len: a => Math.hypot(a[0], a[1]), lerp: (a, b, k) => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k] };
const P2 = pts => "M" + pts.map(p => p[0].toFixed(1) + "," + p[1].toFixed(1)).join("L") + "Z";
R.paper = (g, pts, fill, o = {}) => H.paper(g, P2(pts), fill, Object.assign({ sh: "sh1", th: 5 }, o));
/* segment effilé entre deux points (membre) */
R.limb = (g, a, b, wa, wb, fill, o = {}) => { const d = V2.sub(b, a), L = V2.len(d) || 1, n = [-d[1] / L, d[0] / L]; const pts = [V2.add(a, V2.mul(n, wa / 2)), V2.add(b, V2.mul(n, wb / 2)), V2.sub(b, V2.mul(n, wb / 2)), V2.sub(a, V2.mul(n, wa / 2))]; const grp = H.el("g", { filter: "url(#sh1)" }, g); const dk = H.shade(fill, .7); H.el("path", { d: P2(pts), fill: dk, transform: "translate(0,5)" }, grp); H.el("circle", { cx: b[0], cy: b[1] + 5, r: wb / 2, fill: dk }, grp); H.el("path", { d: P2(pts), fill }, grp); H.el("circle", { cx: a[0], cy: a[1], r: wa / 2, fill }, grp); H.el("circle", { cx: b[0], cy: b[1], r: wb / 2, fill }, grp); return grp; };
/* IK 2 os : renvoie le coude */
R.ik = (sh, tg, L1, L2, bend = 1) => { const d = V2.sub(tg, sh); let D = V2.len(d); D = Math.min(D, L1 + L2 - 1); const th = Math.atan2(d[1], d[0]), a = Math.acos(H.clamp((L1 * L1 + D * D - L2 * L2) / (2 * L1 * D), -1, 1)); return [sh[0] + Math.cos(th + bend * a) * L1, sh[1] + Math.sin(th + bend * a) * L1]; };
/* main : repère local, doigts vers -y. pose: pinch | grip | open. hold(q) dessine l'objet tenu (entre paume et doigts). press 0..1 = serrer */
R.hand = (g, x, y, ang, s = 1, pose = "open", hold = null, press = 0, o = {}) => { const h = H.el("g", { transform: `translate(${x.toFixed(1)},${y.toFixed(1)}) rotate(${(ang).toFixed(2)}) scale(${o.flip ? -s : s},${s})` }, g); const sk = o.skin || R.SK, sd = H.shade(sk, .82);
  const palm = () => { R.paper(h, [[-62, 10], [-70, -60], [-58, -128], [58, -132], [70, -64], [60, 8]], sk, { th: 4 }); };
  const fing = (x0, y0, ang2, len, w, col = sk) => { const a = (ang2 - 90) * Math.PI / 180, b = [x0 + Math.cos(a) * len, y0 + Math.sin(a) * len]; R.limb(h, [x0, y0], b, w, w * .86, col); H.el("path", { d: `M${(x0 + b[0]) / 2 - 6},${(y0 + b[1]) / 2} l12,0`, stroke: sd, "stroke-width": 3, opacity: .5 }, h); };
  if (pose === "grip") { palm(); if (hold) hold(h); const sq = press * 10; [[-48, -118], [-16, -126], [16, -126], [46, -118]].forEach(([fx, fy], i) => { R.limb(h, [fx * (1 - press * .08), fy], [fx * (1 - press * .08) + (i < 2 ? -1 : 1) * 4, fy - 46 + sq], 30, 28, sk); }); [[-50, -150], [-18, -158], [14, -158], [44, -150]].forEach(([fx, fy]) => R.limb(h, [fx - 40 + press * 8, fy], [fx + 40 - press * 8, fy], 30, 30, sk)); R.limb(h, [62, -30], [74 - press * 10, -140], 34, 30, sk); }
  else if (pose === "pinch") { palm(); fing(-46, -120, -14, 70, 30); fing(-16, -128, -4, 66, 30); fing(14, -128, 6, 62, 30); R.limb(h, [64, -40], [30, -206 + press * 14], 36, 30, sk); if (hold) hold(h); R.limb(h, [40, -128], [14, -214 + press * 14], 32, 28, sk); }
  else { palm(); fing(-46, -120, -10, 104, 30); fing(-16, -128, -3, 118, 31); fing(14, -128, 4, 112, 31); fing(44, -118, 12, 92, 28); R.limb(h, [64, -40], [118, -120], 34, 30, sk); if (hold) hold(h); }
  return h; };
/* bras complet : épaule (hors champ) -> poignet (cible) ; main orientée dans l'axe de l'avant-bras + rot */
R.arm = (g, sh, wrist, o = {}) => { const s = o.s || 1, L1 = 620 * s, L2 = 560 * s, el = R.ik(sh, wrist, L1, L2, o.bend || 1); const cloth = o.cloth || R.CLOTH;
  R.limb(g, sh, el, 150 * s, 118 * s, cloth); R.limb(g, el, wrist, 96 * s, 78 * s, R.SK); R.limb(g, V2.lerp(el, wrist, .05), V2.lerp(el, wrist, .32), 128 * s, 112 * s, cloth);
  const fa = Math.atan2(wrist[1] - el[1], wrist[0] - el[0]) * 180 / Math.PI + 90 + (o.rot || 0); return R.hand(g, wrist[0], wrist[1], fa, s * (o.hs || 1), o.pose || "open", o.hold || null, o.press || 0, { flip: o.flip }); };
/* gros plan joue 3/4 (visage tourné vers la gauche) */
R.CHEEK = { face: [[180, -80], [150, 240], [182, 318], [158, 400], [72, 520], [124, 566], [150, 616], [118, 660], [160, 700], [126, 736], [168, 800], [150, 900], [232, 1010], [420, 1112], [600, 1080], [710, 1000], [790, 820], [830, 600], [780, 330], [680, 120], [640, -80]],
  neck: [[300, 960], [760, 900], [840, 1960], [250, 1960]], hair: [[470, -80], [1160, -80], [1160, 1120], [1000, 1060], [900, 900], [870, 640], [820, 420], [720, 250], [600, 70]], ear: [[780, 500], [850, 486], [890, 590], [880, 710], [830, 780], [784, 750]] };
R.jawY = x => 1010 + 100 * Math.sin(Math.PI * H.clamp((x - 232) / 478));
R.cheekDots = (() => { const rg = H.rng(21), out = []; let tries = 0; while (out.length < 62 && tries < 8000) { tries++; const x = 250 + rg() * 470, y = 470 + rg() * 640; if (y > R.jawY(x) - 34) continue; if (x < 320 && y < 820) continue; if (x > 700 && y < 600) continue; const near = (R.jawY(x) - y) / 600; if (rg() < near * .75) continue; if (out.some(p => Math.hypot(p[0] - x, p[1] - y) < 46)) continue; out.push([x, y, 12 + rg() * 4]); } return out.sort((a, b) => (b[1] - a[1]) + (a[0] - b[0]) * .25); })();
R.cheek = (g, o = {}) => { H.rrect(g, -100, -100, 1300, 2200, o.bg || "#C49A6C", { r: 0, sh: false, jit: 0 }); H.rrect(g, -100, 1500, 1300, 700, R.CLOTH, { r: 0, sh: "sh1", jit: 0 });
  R.paper(g, R.CHEEK.neck, R.SKD, { th: 6 }); R.paper(g, R.CHEEK.face, o.skin || R.SK, { th: 8 }); H.el("path", { d: "M330,600 Q480,660 640,560", stroke: R.SKD, "stroke-width": 30, fill: "none", opacity: .22, "stroke-linecap": "round" }, g);
  R.paper(g, R.CHEEK.hair, R.HAIR, { th: 8 }); R.paper(g, R.CHEEK.ear, R.SK, { th: 5 }); H.blob(g, 830, 640, 26, 70, R.SKD, { n: 12, jit: .05, sh: false, th: 0, attr: { opacity: .7 } }); };
/* point noir qui éclot (pop avec rebond) */
R.dot = (g, x, y, r, k) => { if (k <= 0) return; const s = H.E.pop(H.clamp(k)); const d = H.el("g", { transform: `translate(${x},${y}) scale(${s.toFixed(3)})` }, g); H.el("circle", { cx: 0, cy: 3, r, fill: "#000", opacity: .25 }, d); H.el("circle", { cx: 0, cy: 0, r, fill: R.DOT }, d); H.el("circle", { cx: -r * .3, cy: -r * .32, r: r * .28, fill: "#4A3226" }, d); };
/* tube : repère local, bout pincé en y=0, embout vers -y. squeeze 0..1 */
R.tube = (q, len = 300, w = 110, sq = 0, col = "#F2C9C0") => { const L = [], Rr = []; for (let i = 0; i <= 10; i++) { const y = -i / 10 * len, bump = Math.sin(i / 10 * Math.PI), ww = w / 2 * (1 - .38 * sq * bump) * (i === 0 ? 1.06 : 1); L.push([-ww, y]); Rr.unshift([ww, y]); } R.paper(q, [...L, [-w * .2, -len - 30], [-w * .12, -len - 66], [w * .12, -len - 66], [w * .2, -len - 30], ...Rr], col, { th: 6 }); R.paper(q, [[-w * .58, 18], [w * .58, 18], [w * .56, -8], [-w * .56, -8]], "#D8C79E", { th: 3 }); H.rrect(q, -w * .32 * (1 - .3 * sq), -len * .66, w * .64 * (1 - .3 * sq), len * .3, "#FBF6EA", { r: 8, jit: 0, sh: false, th: 0 }); for (let i = 0; i < 4; i++) H.el("path", { d: `M${-w * .52},${12 - i * 6} h${w * 1.04}`, stroke: "#B9A57E", "stroke-width": 2 }, q); return [0, -len - 66]; };
/* filet de crème entre deux points, prog 0..1, + noisette qui grossit à l'arrivée */
R.ribbon = (g, a, b, prog, land = 0) => { if (prog <= 0) return; const c = [(a[0] + b[0]) / 2 + 30, Math.max(a[1], b[1]) - 10]; const d = `M${a[0]},${a[1]} Q${c[0]},${c[1]} ${b[0]},${b[1]}`; const p0 = H.el("path", { d, fill: "none", stroke: "#D6CCBC", "stroke-width": 30, "stroke-linecap": "round" }, g); const L = p0.getTotalLength(); const p1 = H.el("path", { d, fill: "none", stroke: "#F6F1E8", "stroke-width": 22, "stroke-linecap": "round" }, g); [p0, p1].forEach(p => { p.setAttribute("stroke-dasharray", `${(L * prog).toFixed(1)} ${L + 10}`); }); if (land > 0) { H.blob(g, b[0], b[1] + 4, 40 + 70 * land, 18 + 20 * land, "#D6CCBC", { n: 16, jit: .08, seed: 4, sh: false, th: 0 }); H.blob(g, b[0], b[1], 34 + 64 * land, 14 + 18 * land, "#F6F1E8", { n: 16, jit: .08, seed: 5, sh: false, th: 0 }); } };
/* éponge (blender) et coton */
R.sponge = (q, squash = 0, y = -214) => { const e = H.el("g", { transform: `translate(0,${y}) scale(${1 + squash * .18},${1 - squash * .22})` }, q); H.paper(e, "M0,-70 C44,-70 58,-20 54,20 C50,60 26,78 0,78 C-26,78 -50,60 -54,20 C-58,-20 -44,-70 0,-70Z", "#E7B28C", { sh: "sh1", th: 4 }); H.blob(e, -12, -20, 16, 22, "#F2CBA9", { n: 10, jit: 0, sh: false, th: 0 }); return e; };
R.cotton = (q, y = -214) => { const c = H.el("g", { transform: `translate(0,${y})` }, q); H.circ(c, 0, 0, 66, "#F7F2EA", { sh: "sh1", th: 4 }); for (let i = 0; i < 4; i++) H.el("path", { d: `M-50,${-30 + i * 20} h100`, stroke: "#E4DCCD", "stroke-width": 4 }, c); return c; };
/* ===== v8 : main lisible + avant-bras venant du bas ===== */
/* main gauche/droite dessinée doigts vers le haut (-y), poignet en (0,0). pose: "grip" (enserre un objet vertical), "pinch" (tient un petit objet entre pouce et index au bout) */
R.hand2 = (g, x, y, ang, s = 1, pose = "pinch", hold = null, press = 0, o = {}) => { const h = H.el("g", { transform: `translate(${x.toFixed(1)},${y.toFixed(1)}) rotate(${ang.toFixed(2)}) scale(${(o.flip ? -1 : 1) * s},${s})` }, g); const sk = o.skin || R.SK, ln = H.shade(sk, .72);
  const crease = (d) => H.el("path", { d, stroke: ln, "stroke-width": 4, fill: "none", "stroke-linecap": "round", opacity: .8 }, h);
  if (pose === "grip") { // poing fermé autour d'un objet vertical tenu au-dessus
    if (hold) hold(h); const sq = press * 6;
    H.paper(h, `M-58,0 C-66,-40 -64,-90 -54,-120 L56,-124 C64,-90 64,-40 56,0 Z`, sk, { sh: "sh1", th: 5 });
    H.paper(h, `M-60,-118 C-60,-150 -40,-${170 - sq} 0,-${172 - sq} C40,-${170 - sq} 64,-150 62,-118 C40,-110 -40,-110 -60,-118 Z`, sk, { sh: "sh1", th: 4 });
    crease(`M-30,-120 L-28,-${160 - sq}`); crease(`M0,-118 L0,-${166 - sq}`); crease(`M30,-120 L28,-${160 - sq}`);
    H.paper(h, `M-58,-70 C-96,-84 -104,-130 -80,-150 C-66,-160 -50,-146 -48,-128 Z`, sk, { sh: "sh1", th: 4 }); // pouce
  } else { // pince : paume, doigts repliés, pouce et index qui pincent en haut
    H.paper(h, `M-54,0 C-64,-40 -62,-92 -46,-118 L50,-120 C64,-92 64,-40 54,0 Z`, sk, { sh: "sh1", th: 5 });
    H.paper(h, `M-48,-112 C-58,-140 -50,-166 -30,-168 L44,-150 C58,-140 58,-120 50,-110 Z`, sk, { sh: "sh1", th: 4 }); // doigts repliés
    crease("M-24,-150 L-20,-118"); crease("M2,-152 L6,-118"); crease("M26,-146 L28,-116");
    H.paper(h, `M-30,-160 C-36,-200 -26,-236 -6,-${244 - press * 8} C10,-${246 - press * 8} 16,-226 10,-196 L-4,-158 Z`, sk, { sh: "sh1", th: 4 }); // index
    if (hold) hold(h);
    H.paper(h, `M-50,-70 C-90,-100 -90,-170 -56,-${214 - press * 10} C-40,-${226 - press * 10} -24,-210 -30,-186 C-36,-150 -30,-110 -40,-84 Z`, sk, { sh: "sh1", th: 4 }); // pouce
  }
  return h; };
/* avant-bras : du poignet w vers l'extérieur du cadre (direction dir en degrés, 90 = vers le bas), manche à partir de 260 px */
R.forearm = (g, w, dir, s = 1, o = {}) => { const a = dir * Math.PI / 180, u = [Math.cos(a), Math.sin(a)], far = V2.add(w, V2.mul(u, 1400 * s)), cuff = V2.add(w, V2.mul(u, 300 * s)); R.limb(g, w, cuff, 96 * s, 112 * s, o.skin || R.SK); R.limb(g, cuff, far, 150 * s, 170 * s, o.cloth || R.CLOTH); H.el("path", { d: `M${(cuff[0] - u[1] * 75 * s).toFixed(1)},${(cuff[1] + u[0] * 75 * s).toFixed(1)} L${(cuff[0] + u[1] * 75 * s).toFixed(1)},${(cuff[1] - u[0] * 75 * s).toFixed(1)}`, stroke: H.shade(o.cloth || R.CLOTH, 1.3), "stroke-width": 10, "stroke-linecap": "round" }, g); };
/* bras complet v8 : la main est au poignet w, orientée vers l'opposé de dir (doigts vers la cible) */
R.arm2 = (g, w, dir, o = {}) => { const s = o.s || 1; R.forearm(g, w, dir, s, o); return R.hand2(g, w[0], w[1], dir - 90 + (o.tilt || 0), s, o.pose || "pinch", o.hold || null, o.press || 0, o); };
/* point local de la main (lp, repère doigts vers -y) vers le monde */
R.hp = (w, dir, s, lp, tilt = 0) => { const a = (dir - 90 + tilt) * Math.PI / 180, c = Math.cos(a), sn = Math.sin(a); return [w[0] + (lp[0] * c - lp[1] * sn) * s, w[1] + (lp[0] * sn + lp[1] * c) * s]; };
/* gros plan visage 3/4 lisible (K4.face) + points sur les joues */
R.FACEDOTS = (() => { const rg = H.rng(31), out = []; let n = 0; while (out.length < 48 && n++ < 6000) { const side = rg() < .62 ? 1 : -1, x = side * (40 + rg() * 105), y = 10 + rg() * 150; if (Math.pow(x / 150, 2) + Math.pow(y / 190, 2) > .82) continue; if (out.some(p => Math.hypot(p[0] - x, p[1] - y) < 17)) continue; out.push([x, y, 6.5 + rg() * 1.8]); } return out.sort((a, b) => b[1] - a[1]); })();
R.face = (g, o = {}) => { H.rrect(g, -100, -100, 1300, 2200, o.bg || "#C9A271", { r: 0, sh: false, jit: 0 }); return K4.face(g, o.x || 540, o.y || 700, o.s || 2.6, { hair: o.hair || "afro", turn: o.turn ?? .35, cloth: R.CLOTH }); };
R.fdot = (f, x, y, r, k) => { if (k <= 0) return; const s = H.E.pop(H.clamp(k)); const d = H.el("g", { transform: `translate(${x},${y}) scale(${s.toFixed(3)})` }, f.hd); H.el("circle", { cx: 0, cy: 1.2, r, fill: "#000", opacity: .25 }, d); H.el("circle", { cx: 0, cy: 0, r, fill: R.DOT }, d); H.el("circle", { cx: -r * .3, cy: -r * .32, r: r * .3, fill: "#4A3226" }, d); };
