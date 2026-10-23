/* Moteur papier découpé : primitives SVG, easing, jitter stop-motion, caméra. */
const NS = "http://www.w3.org/2000/svg";
const C = {
  kraft: "#C89E70", dark: "#301509", terra: "#8C4A32", terraD: "#6E3624", cream: "#FFF7C9", sage: "#6B8F71", sageD: "#4F7156",
  skin: "#9A6340", skinD: "#7E4D31", skinL: "#B0764B", mark: "#3A1F10", red: "#C8402A", hair: "#1D130E",
  paper: "#EBD7B0", paperD: "#D8BE8E", cardboard: "#B98A5C", grey: "#A8A08F", greyD: "#7C7466", blue: "#4F6F8C", plum: "#4A2535", ink: "#17100F"
};
const H = {};
H.clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
H.lerp = (a, b, t) => a + (b - a) * t;
H.seg = (p, a, b) => H.clamp((p - a) / (b - a));
H.E = {
  lin: t => t,
  out: t => 1 - Math.pow(1 - t, 3),
  in: t => t * t * t,
  io: t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
  back: t => { const c1 = 1.9, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); },
  pop: t => t <= 0 ? 0 : t >= 1 ? 1 : (1 + 2.6 * Math.pow(t - 1, 3) + 1.6 * Math.pow(t - 1, 2)),
  bounce: t => { const n = 7.5625, d = 2.75; if (t < 1 / d) return n * t * t; if (t < 2 / d) return n * (t -= 1.5 / d) * t + .75; if (t < 2.5 / d) return n * (t -= 2.25 / d) * t + .9375; return n * (t -= 2.625 / d) * t + .984375; }
};
H.rng = seed => { let a = seed >>> 0; return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; };
const fr = n => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };

H.STEP = 0;
H.reg = null; // groupes de la scène active
H.el = (tag, attrs, parent) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (parent) parent.appendChild(e); return e; };

/* groupe animé : x,y,r (deg),sx,sy,o, j = amplitude du tremblement stop-motion */
H.grp = (parent, x = 0, y = 0, o = {}) => {
  const g = H.el("g", {}, parent);
  g._b = { x, y, r: 0, sx: 1, sy: 1, o: 1, j: o.j === undefined ? .7 : o.j, id: (H._id = (H._id || 0) + 1) };
  if (H.cur) H.cur.push(g);
  return g;
};
H.set = (g, p) => { Object.assign(g._b, p); if (p.s !== undefined) { g._b.sx = p.s; g._b.sy = p.s; } return g; };
H.cam = (g, s, cx, cy) => H.set(g, { x: cx * (1 - s), y: cy * (1 - s), sx: s, sy: s });
H.applyAll = list => {
  for (const g of list) {
    const b = g._b, j = b.j;
    const jx = j ? (fr(H.STEP * 3 + b.id) - .5) * 3.0 * j : 0, jy = j ? (fr(H.STEP * 5 + b.id * 2) - .5) * 3.0 * j : 0, jr = j ? (fr(H.STEP * 7 + b.id * 3) - .5) * .7 * j : 0;
    g.setAttribute("transform", `translate(${(b.x + jx).toFixed(2)},${(b.y + jy).toFixed(2)}) rotate(${(b.r + jr).toFixed(3)}) scale(${b.sx.toFixed(4)},${b.sy.toFixed(4)})`);
    const o = H.clamp(b.o); g.setAttribute("opacity", o.toFixed(3));
    g.style.display = o <= 0.001 ? "none" : "";
  }
};

H.pts = (pts, seed = 1, jit = 3) => { const r = H.rng(seed); return pts.map(([x, y]) => [x + (r() - .5) * 2 * jit, y + (r() - .5) * 2 * jit]); };
H.d = pts => "M" + pts.map(p => p[0].toFixed(1) + "," + p[1].toFixed(1)).join("L") + "Z";
const edge = { stroke: "#fff", "stroke-opacity": ".22", "stroke-width": "2.2", "stroke-linejoin": "round" };
H.shade = (hex, k) => { const m = /^#([0-9a-f]{6})$/i.exec(hex); if (!m) return null; const n = parseInt(m[1], 16); const f = v => Math.max(0, Math.min(255, Math.round(v * k))); return "#" + [(n >> 16) & 255, (n >> 8) & 255, n & 255].map(f).map(v => v.toString(16).padStart(2, "0")).join(""); };
/* pièce de papier : ombre portée + tranche de carton (épaisseur) + face supérieure */
H.paper = (parent, d, fill, o = {}) => {
  const sh = o.sh === false ? null : (o.sh || "sh"); const th = o.th !== undefined ? o.th : (sh === "sh2" ? 9 : sh === "sh1" ? 3 : sh ? 6 : 0);
  const g = H.el("g", sh ? { filter: `url(#${sh})` } : {}, parent);
  const dk = H.shade(fill, .66);
  if (th && dk) H.el("path", { d, fill: dk, transform: `translate(0,${th})`, "stroke-linejoin": "round", stroke: dk, "stroke-width": 2 }, g);
  const top = H.el("path", Object.assign({ d, fill }, edge, o.attr || {}), g);
  if (o.corr) H.el("path", { d, fill: "url(#corr)", "pointer-events": "none" }, g);
  return top;
};
H.poly = (parent, pts, fill, o = {}) => H.paper(parent, H.d(H.pts(pts, o.seed || 3, o.jit === undefined ? 2.2 : o.jit)), fill, o);
H.blob = (parent, cx, cy, rx, ry, fill, o = {}) => {
  const n = o.n || 24, r = H.rng(o.seed || 5), pts = [];
  for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2, k = 1 + (r() - .5) * (o.jit === undefined ? .035 : o.jit); pts.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]); }
  return H.paper(parent, H.d(pts), fill, o);
};
H.rrect = (parent, x, y, w, h, fill, o = {}) => {
  const rr = o.r === undefined ? 14 : o.r, k = rr * .55, pts = [[x + rr, y], [x + w - rr, y], [x + w - k, y + k], [x + w, y + rr], [x + w, y + h - rr], [x + w - k, y + h - k], [x + w - rr, y + h], [x + rr, y + h], [x + k, y + h - k], [x, y + h - rr], [x, y + rr], [x + k, y + k]];
  return H.poly(parent, pts, fill, o);
};
H.circ = (parent, cx, cy, r, fill, o = {}) => {
  const sh = o.sh === false ? null : (o.sh || "sh1"); const th = o.th !== undefined ? o.th : (sh === "sh2" ? 9 : sh === "sh1" ? 3 : sh ? 6 : 0);
  const g = H.el("g", sh ? { filter: `url(#${sh})` } : {}, parent); const dk = H.shade(fill, .66);
  if (th && dk) H.el("circle", { cx, cy: cy + th, r, fill: dk }, g);
  return H.el("circle", Object.assign({ cx, cy, r, fill }, edge, o.attr || {}), g);
};
H.txt = (parent, str, x, y, size, fill, o = {}) => {
  const t = H.el("text", { x, y, "font-size": size, fill, "font-weight": o.w || 800, "text-anchor": o.anchor || "middle", "letter-spacing": o.ls || 0 }, parent);
  if (o.font) t.style.fontFamily = o.font;
  const lines = String(str).split("\n");
  lines.forEach((ln, i) => { const ts = H.el("tspan", { x, dy: i === 0 ? 0 : size * (o.lh || 1.1) }, t); ts.textContent = ln; });
  if (o.stroke) { t.setAttribute("stroke", o.stroke); t.setAttribute("stroke-width", o.sw || 6); t.setAttribute("paint-order", "stroke"); t.setAttribute("stroke-linejoin", "round"); }
  return t;
};
H.gear = (cx, cy, rIn, rOut, teeth) => { const pts = []; for (let i = 0; i < teeth; i++) { const a = i / teeth * Math.PI * 2, w = Math.PI * 2 / teeth; for (const [da, rr] of [[0, rIn], [w * .18, rOut], [w * .5, rOut], [w * .68, rIn]]) pts.push([cx + Math.cos(a + da) * rr, cy + Math.sin(a + da) * rr]); } return pts; };
H.torn = (parent, x, y, w, h, fill, o = {}) => {
  const r = H.rng(o.seed || 3), pts = [], n = Math.max(8, Math.round(w / 34));
  for (let i = 0; i <= n; i++) pts.push([x + w * i / n, y + (r() - .5) * 15]);
  pts.push([x + w + (r() - .5) * 8, y + h / 2]);
  for (let i = n; i >= 0; i--) pts.push([x + w * i / n, y + h + (r() - .5) * 15]);
  pts.push([x + (r() - .5) * 8, y + h / 2]);
  return H.paper(parent, H.d(pts), fill, o);
};
H.star = (cx, cy, r1, r2, n) => { const pts = []; for (let i = 0; i < n * 2; i++) { const a = i / (n * 2) * Math.PI * 2 - Math.PI / 2, rr = i % 2 ? r1 : r2; pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]); } return pts; };

/* ---------- pancarte (tag étiquette) ---------- */
H.tag = (parent, text, w = 420, h = 190, o = {}) => {
  const g = H.grp(parent);
  H.el("path", { d: `M0,0 L0,-150`, stroke: "#5a3a1e", "stroke-width": 4, fill: "none" }, g);
  const body = H.grp(g, 0, 0, { j: .5 });
  H.torn(body, -w / 2, 0, w, h, o.fill || "#F6EDD0", { seed: o.seed || 9, th: 9 });
  H.circ(body, 0, 24, 10, C.kraft, { sh: false });
  const size = (o.size || 44) * 1.22, lines = String(text).split("\n").length;
  H.txt(body, text, 0, h * .5 + size * .36 - (lines - 1) * size * 1.02 / 2 + 6 + (o.dy || 0), size, "#3a2010", { font: "Anton, sans-serif", lh: 1.02, ls: 1.2, w: 400 });
  g._body = body; return g;
};

/* ---------- flacon MELA SKIN (compte-gouttes) ---------- */
H.bottle = (parent, sc = 1) => {
  const g = H.grp(parent, 0, 0, { j: .5 });
  const s = H.grp(g); s._b.sx = s._b.sy = sc;
  H.rrect(s, -88, -170, 176, 330, "#8B4A20", { r: 34, seed: 2, jit: 1.6 });                         // verre ambré
  H.rrect(s, -74, -150, 14, 90, "#B5733A", { r: 11, sh: false, th: 0, jit: .8, attr: { opacity: .55 } });  // reflet
  H.rrect(s, -52, -215, 104, 60, "#7A3F1C", { r: 12, seed: 4, jit: 1.2 });                          // col
  H.rrect(s, -74, -268, 148, 78, "#4F2F22", { r: 12, seed: 5, jit: 1.2, sh: "sh1" });               // collerette cannelée
  for (let i = 0; i < 9; i++) H.el("path", { d: `M${-60 + i * 15},-258 V-200`, stroke: "#3A2118", "stroke-width": 4, "stroke-linecap": "round" }, s);
  H.blob(s, 0, -338, 42, 78, "#5C3F33", { seed: 6, jit: .02, n: 22 });                              // pipette caoutchouc
  H.rrect(s, -78, -52, 156, 186, "#4B2E26", { r: 8, seed: 7, jit: .6, sh: "sh1", th: 2 });        // étiquette brun foncé
  H.txt(s, "MELA SKIN", 0, 4, 26, "#E8A08A", { w: 800, ls: 1.2 });
  H.txt(s, "L'expertise pensée pour vous", 0, 24, 9.5, "#E9CDBE", { w: 400 });
  H.txt(s, "SÉRUM CORRECTEUR DE TEINT", 0, 62, 8.8, "#E8A08A", { w: 700, ls: .4 });
  H.txt(s, "ANTI-TÂCHES", 0, 75, 8.8, "#E8A08A", { w: 700, ls: .4 });
  H.txt(s, "VEGAN · CRUELTY FREE · COMPOSITION CLEAN", 0, 110, 5.6, "#C98F7C", { w: 400 });
  H.txt(s, "30 ml", 0, 124, 8, "#E9CDBE", { w: 400 });
  return g;
};

/* parallaxe : 3 plans (fond / milieu / avant) qui bougent à des vitesses différentes */
H.layers = (g) => { const L = { bg: H.grp(g, 0, 0, { j: 0 }), mid: H.grp(g, 0, 0, { j: 0 }), fg: H.grp(g, 0, 0, { j: 0 }) }; L.bg._par = .45; L.mid._par = 1; L.fg._par = 1.7; return L; };
H.look = (L, x, y, z) => { for (const k of ["bg", "mid", "fg"]) { const l = L[k], f = l._par, sz = 1 + (z - 1) * f; H.set(l, { x: 540 * (1 - sz) - x * f * sz, y: 960 * (1 - sz) - y * f * sz, sx: sz, sy: sz }); } };
