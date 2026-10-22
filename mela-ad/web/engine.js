/* Moteur papier découpé : primitives SVG, easing, jitter stop-motion, caméra. */
const NS = "http://www.w3.org/2000/svg";
const C = {
  kraft: "#C89E70", dark: "#301509", terra: "#8C4A32", terraD: "#6E3624", cream: "#FFF7C9", sage: "#6B8F71", sageD: "#4F7156",
  skin: "#9A6340", skinD: "#7E4D31", skinL: "#B0764B", mark: "#3A1F10", red: "#C8402A", hair: "#1D130E",
  paper: "#EBD7B0", paperD: "#D8BE8E", cardboard: "#B98A5C", grey: "#A8A08F", greyD: "#7C7466", blue: "#4F6F8C", plum: "#4A2535"
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
H.poly = (parent, pts, fill, o = {}) => H.el("path", Object.assign({ d: H.d(H.pts(pts, o.seed || 3, o.jit === undefined ? 2.2 : o.jit)), fill, filter: o.sh === false ? "none" : `url(#${o.sh || "sh"})` }, edge, o.attr || {}), parent);
H.blob = (parent, cx, cy, rx, ry, fill, o = {}) => {
  const n = o.n || 24, r = H.rng(o.seed || 5), pts = [];
  for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2, k = 1 + (r() - .5) * (o.jit === undefined ? .035 : o.jit); pts.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]); }
  return H.el("path", Object.assign({ d: H.d(pts), fill, filter: o.sh === false ? "none" : `url(#${o.sh || "sh"})` }, edge, o.attr || {}), parent);
};
H.rrect = (parent, x, y, w, h, fill, o = {}) => {
  const rr = o.r === undefined ? 14 : o.r, k = rr * .55, pts = [[x + rr, y], [x + w - rr, y], [x + w - k, y + k], [x + w, y + rr], [x + w, y + h - rr], [x + w - k, y + h - k], [x + w - rr, y + h], [x + rr, y + h], [x + k, y + h - k], [x, y + h - rr], [x, y + rr], [x + k, y + k]];
  return H.poly(parent, pts, fill, o);
};
H.circ = (parent, cx, cy, r, fill, o = {}) => H.el("circle", Object.assign({ cx, cy, r, fill, filter: o.sh === false ? "none" : `url(#${o.sh || "sh1"})` }, edge, o.attr || {}), parent);
H.txt = (parent, str, x, y, size, fill, o = {}) => {
  const t = H.el("text", { x, y, "font-size": size, fill, "font-weight": o.w || 800, "text-anchor": o.anchor || "middle", "letter-spacing": o.ls || 0 }, parent);
  const lines = String(str).split("\n");
  lines.forEach((ln, i) => { const ts = H.el("tspan", { x, dy: i === 0 ? 0 : size * (o.lh || 1.1) }, t); ts.textContent = ln; });
  if (o.stroke) { t.setAttribute("stroke", o.stroke); t.setAttribute("stroke-width", o.sw || 6); t.setAttribute("paint-order", "stroke"); t.setAttribute("stroke-linejoin", "round"); }
  return t;
};
H.gear = (cx, cy, rIn, rOut, teeth) => { const pts = []; for (let i = 0; i < teeth; i++) { const a = i / teeth * Math.PI * 2, w = Math.PI * 2 / teeth; for (const [da, rr] of [[0, rIn], [w * .18, rOut], [w * .5, rOut], [w * .68, rIn]]) pts.push([cx + Math.cos(a + da) * rr, cy + Math.sin(a + da) * rr]); } return pts; };
H.star = (cx, cy, r1, r2, n) => { const pts = []; for (let i = 0; i < n * 2; i++) { const a = i / (n * 2) * Math.PI * 2 - Math.PI / 2, rr = i % 2 ? r1 : r2; pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]); } return pts; };

/* ---------- pancarte (tag étiquette) ---------- */
H.tag = (parent, text, w = 420, h = 190, o = {}) => {
  const g = H.grp(parent);
  H.el("path", { d: `M0,0 L0,-150`, stroke: "#3b2412", "stroke-width": 4, fill: "none" }, g);
  const body = H.grp(g, 0, 0, { j: .5 });
  H.poly(body, [[-w / 2, 0], [w / 2, 4], [w / 2 - 6, h], [-w / 2 + 4, h - 4]], o.fill || C.cream, { seed: o.seed || 9, jit: 4, attr: { stroke: "#fff", "stroke-opacity": ".4" } });
  H.circ(body, 0, 22, 9, C.kraft, { sh: false });
  H.txt(body, text, 0, h * .5 + (o.dy || 0), o.size || 44, C.dark, { lh: 1.15, ls: .5 });
  g._body = body; return g;
};

/* ---------- flacon MELA SKIN (compte-gouttes) ---------- */
H.bottle = (parent, sc = 1) => {
  const g = H.grp(parent, 0, 0, { j: .5 });
  const s = H.grp(g); s._b.sx = s._b.sy = sc;
  H.rrect(s, -88, -170, 176, 330, C.dark, { r: 34, seed: 2, jit: 1.6 });          // corps
  H.rrect(s, -52, -215, 104, 60, "#4a2a18", { r: 12, seed: 4, jit: 1.2 });         // épaule/cou
  H.rrect(s, -64, -250, 128, 46, C.cream, { r: 10, seed: 5, jit: 1.2, sh: "sh1" }); // collerette
  H.blob(s, 0, -300, 40, 66, C.terra, { seed: 6, jit: .02, n: 22 });           // pipette
  H.rrect(s, -118 + 30, -80, 176, 150, C.cream, { r: 6, seed: 7, jit: 1.2, sh: "sh1" });
  H.circ(s, 0, -28, 34, "none", { sh: false, attr: { stroke: C.dark, "stroke-width": 4.5, "stroke-opacity": 1 } });
  H.txt(s, "M", 0, -14, 44, C.dark, { w: 800 });
  H.txt(s, "MELA SKIN", 0, 36, 20, C.dark, { ls: 2.5 });
  H.txt(s, "SÉRUM ANTI-TACHES", 0, 62, 12.5, C.terra, { ls: 1.2, w: 700 });
  return g;
};
