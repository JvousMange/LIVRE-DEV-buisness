/* Tableau blanc : traits qui se dessinent, main qui suit la pointe, sous-titres en groupes de mots. Rendu déterministe renderAt(t). */
const NS = "http://www.w3.org/2000/svg", svg = document.getElementById("stage"), defs = document.getElementById("defs"), ink = document.getElementById("ink");
const WORDS = TL.beats[0].sentences.map(s => s.words), SENT = TL.beats[0].sentences;
const T0 = (s, w) => WORDS[s][w].start, T1 = (s, w) => WORDS[s][w].end;
const INK = "#1d1d1b", RED = "#D9432E", BLU = "#2D6FB5", GRN = "#2E8B57", ORG = "#E8892B", YEL = "#FFE66B";
const el = (t, a, p) => { const e = document.createElementNS(NS, t); for (const k in a) e.setAttribute(k, a[k]); if (p) p.appendChild(e); return e; };
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x)), lerp = (a, b, t) => a + (b - a) * t, ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2, eo = t => 1 - Math.pow(1 - t, 3);
const END = +(new URLSearchParams(location.search).get("end") || 26.6);
const REST = [1010, 2160], SC = [];            // scènes
const DR = [];                                  // dessins qui pilotent la main
const ANIM = [];                                // animations sans main
const SFX = [];
let cid = 0;
function scene(id, t0, t1) { const g = el("g", {}, ink); const cp = el("clipPath", { id: "sc" + id }, defs); const r = el("rect", { x: -100, y: 0, width: 1400, height: 1920 }, cp); g.setAttribute("clip-path", `url(#sc${id})`); const s = { id, t0, t1, g, r }; SC.push(s); SFX.push({ t: t1 + .02, type: "whoosh", opt: "soft" }); return s; }
function clipFor(g, x, y, w, h) { const id = "c" + (cid++); const cp = el("clipPath", { id }, defs); const r = el("rect", { x, y, width: w, height: h }, cp); g.setAttribute("clip-path", `url(#${id})`); return r; }
/* texte manuscrit révélé de gauche à droite */
function text(sc, str, cx, y, size, col, t0, t1, o = {}) {
  const g = el("g", {}, sc.g);
  if (o.hl) { const hw = o.hl; const hr = el("rect", { x: cx - hw / 2 - 14, y: y - size * .78, width: hw + 28, height: size * .86, fill: YEL, opacity: .85, transform: `rotate(-1 ${cx} ${y})` }, g); const hc = clipFor(hr, cx - hw / 2 - 14, y - size, 0, size * 1.2); ANIM.push(t => hc.setAttribute("width", (hw + 28) * clamp((t - t0 + .15) / (t1 - t0 + .1)))); }
  const tg = el("g", {}, g); const tx = el("text", { x: 0, y, "font-size": size, fill: col, "font-family": "Marker", "text-anchor": "start" }, tg); tx.textContent = str;
  const w = tx.getBBox().width; const x0 = cx - w / 2; tx.setAttribute("x", x0);
  const r = clipFor(tg, x0 - 10, y - size * 1.1, 0, size * 1.5);
  const d = { t0, t1: t1 + .12, tip: p => [x0 + w * p + Math.sin(p * 40) * 3, y - size * .32 + Math.sin(p * 31) * size * .1] };
  DR.push(d); ANIM.push(t => r.setAttribute("width", (w + 20) * clamp((t - d.t0) / (d.t1 - d.t0)))); SFX.push({ t: t0, type: "tick", opt: null });
  return { w, x0, d };
}
/* trait (soulignement, flèche, cercle, croix) tracé progressivement */
function stroke(sc, dpath, col, t0, t1, wd = 11) {
  const p = el("path", { d: dpath, stroke: col, "stroke-width": wd, fill: "none", "stroke-linecap": "round", "stroke-linejoin": "round" }, sc.g); const L = p.getTotalLength(); p.setAttribute("stroke-dasharray", L); p.setAttribute("stroke-dashoffset", L);
  const d = { t0, t1, tip: q => { const pt = p.getPointAtLength(L * q); return [pt.x, pt.y]; } }; DR.push(d); ANIM.push(t => p.setAttribute("stroke-dashoffset", L * (1 - clamp((t - t0) / (t1 - t0))))); SFX.push({ t: t0, type: "tick", opt: null }); return p;
}
/* illustration (fond blanc, fusionnée au tableau) révélée de haut en bas, la pointe zigzague sur le front */
function picture(sc, href, x, y, w, h, t0, t1) {
  const g = el("g", {}, sc.g); const im = el("image", { href, x, y, width: w, height: h }, g); const r = clipFor(g, x, y, w, 0);
  const d = { t0, t1, tip: p => { const fy = y + h * eo(p); return [x + w * (.5 + .46 * Math.sin(p * 46)), clamp(fy, y, y + h) - 20]; } };
  DR.push(d); ANIM.push(t => r.setAttribute("height", (h + 4) * eo(clamp((t - t0) / (t1 - t0))))); SFX.push({ t: t0, type: "rub", opt: null }); return d;
}
const circlePath = (cx, cy, rx, ry) => `M${cx - rx},${cy} a${rx},${ry} 0 1,1 ${2 * rx},0 a${rx},${ry} 0 1,1 ${-2 * rx},0`;
const wob = (x1, y1, x2, y2) => { let s = `M${x1},${y1}`; for (let i = 1; i <= 8; i++) { const t = i / 8; s += `L${x1 + (x2 - x1) * t + (i % 2 ? 4 : -4)},${y1 + (y2 - y1) * t + (i % 3 ? -3 : 3)}`; } return s; };
const arrow = (x1, y1, x2, y2) => { const a = Math.atan2(y2 - y1, x2 - x1); return wob(x1, y1, x2, y2) + `M${x2},${y2} l${-46 * Math.cos(a - .5)},${-46 * Math.sin(a - .5)} M${x2},${y2} l${-46 * Math.cos(a + .5)},${-46 * Math.sin(a + .5)}`; };
function pop(sc, node, t0) { ANIM.push(t => { const k = clamp((t - t0) / .22); const s = k <= 0 ? 0 : 1 + .25 * Math.sin(k * Math.PI) * (1 - k * .3) * (k < 1 ? 1 : 0); node.setAttribute("transform", `translate(${node._cx},${node._cy}) scale(${k > 0 ? Math.min(1, k * 1.4) * (k < 1 ? s : 1) : 0}) translate(${-node._cx},${-node._cy})`); }); }
function spot(sc, cx, cy, r, t0, col = INK, op = 1) { const n = 9, pts = []; for (let i = 0; i < n; i++) { const a = i / n * 6.283, k = 1 + (((i * 37 + cx) % 7) - 3) * .06; pts.push([cx + Math.cos(a) * r * k, cy + Math.sin(a) * r * .9 * k]); } const p = el("path", { d: "M" + pts.map(q => q.join(",")).join("L") + "Z", fill: col, opacity: op }, sc.g); p._cx = cx; p._cy = cy; pop(sc, p, t0); SFX.push({ t: t0, type: "pop", opt: 0 }); return p; }
function patch(sc, cx, cy, r, t0, t1) {
  const fill = el("path", { d: circlePath(cx, cy, r, r), fill: "#C98C63", opacity: 0 }, sc.g); const o = stroke(sc, circlePath(cx, cy, r, r), INK, t0, t1, 9);
  ANIM.push(t => fill.setAttribute("opacity", clamp((t - t1 + .1) / .3)));
  return fill;
}
function num(sc, n, col, t0, t1) { return text(sc, String(n), 150, 340, 230, col, t0, t1); }

/* ===================== SCÈNES ===================== */
const S0 = scene(0, 0, T0(1, 0) - .02), S1 = scene(1, T0(1, 0), T0(2, 0) - .02), S2 = scene(2, T0(2, 0), T0(3, 0) - .02), S3 = scene(3, T0(3, 0), T0(5, 0) - .02), S4 = scene(4, T0(5, 0), T1(5, 17) + .6);
/* intro */
text(S0, "5 RAISONS", 540, 340, 190, INK, Math.max(.25, T0(0, 0)), T1(0, 1));
stroke(S0, "M120,380 q420,26 840,-8", RED, T1(0, 1) + .05, T1(0, 1) + .35);
text(S0, "qui font que ton", 540, 520, 84, INK, T0(0, 2), T1(0, 5));
text(S0, "hyperpigmentation", 540, 670, 98, RED, T0(0, 6), T1(0, 6), { hl: 800 });
text(S0, "ne part pas", 540, 810, 86, INK, T0(0, 7), T1(0, 9));
{ const sp = patch(S0, 540, 1180, 230, T0(0, 8) + .2, T1(0, 9) + .1); [[-90, -50, 30], [60, -80, 24], [100, 50, 36], [-40, 80, 24], [10, 0, 28]].forEach(([a, b, r], i) => spot(S0, 540 + a, 1180 + b, r, T1(0, 9) + .15 + i * .09)); }
/* 1 */
num(S1, 1, RED, T0(1, 0), T1(1, 0));
text(S1, "Tu traites la surface", 620, 330, 72, INK, T0(1, 1), T1(1, 10));
stroke(S1, "M290,368 q330,18 660,-6", RED, T1(1, 10) + .02, T1(1, 10) + .35);
picture(S1, "wb/peau_a.png", 40, 480, 1000, 746, T0(1, 11), T1(1, 17) - .3);
stroke(S1, arrow(544, 1390, 544, 1090), RED, T1(1, 17) - .25, T1(1, 17) + .35);
/* 2 */
num(S2, 2, BLU, T0(2, 0), T1(2, 0));
text(S2, "Tu les caches", 620, 330, 86, INK, T0(2, 1), T1(2, 3));
{ const cx = 540, cy = 1000, r = 230; patch(S2, cx, cy, r, T0(2, 3) + .1, T1(2, 3) + .6); const sp = [[-90, -50, 30], [60, -80, 24], [100, 50, 36], [-40, 80, 24], [10, 0, 28]].map(([a, b, rr], i) => spot(S2, cx + a, cy + b, rr, T1(2, 3) + .65 + i * .08));
  /* fond de teint : hachures beiges par-dessus (la tache transparaît ensuite) */
  const hatch = el("path", { d: (() => { let s = ""; for (let i = 0; i < 16; i++) { const y = cy - r + 20 + i * 27, dx = Math.sqrt(Math.max(0, r * r - (y - cy) * (y - cy))) - 10; s += `M${cx - dx},${y} L${cx + dx},${y + 14}`; } return s; })(), stroke: "#E6B98E", "stroke-width": 24, "stroke-linecap": "round", fill: "none" }, S2.g); const L = hatch.getTotalLength(); hatch.setAttribute("stroke-dasharray", L); hatch.setAttribute("stroke-dashoffset", L); sp.forEach(s => s.parentNode.appendChild(s));
  const dd = { t0: T0(2, 4), t1: T1(2, 7), tip: p => { const pt = hatch.getPointAtLength(L * p); return [pt.x, pt.y]; } }; DR.push(dd); ANIM.push(t => hatch.setAttribute("stroke-dashoffset", L * (1 - clamp((t - dd.t0) / (dd.t1 - dd.t0))))); SFX.push({ t: dd.t0, type: "rub", opt: null });
  /* …mais les taches restent visibles dessous */
  const ghost = [[-90, -50, 30], [60, -80, 24], [100, 50, 36], [-40, 80, 24], [10, 0, 28]].map(([a, b, rr], i) => { const q = spot(S2, cx + a, cy + b, rr, T0(2, 11) + i * .12, "#5a3a22", .78); return q; });
}
text(S2, "mais elles restent", 540, 1500, 72, RED, T0(2, 12), T1(2, 15));
/* 3 */
num(S3, 3, GRN, T0(3, 0), T1(3, 0));
text(S3, "Pensés pour", 620, 330, 78, INK, T0(3, 4), T1(3, 6));
text(S3, "peaux claires", 620, 430, 90, INK, T0(3, 7), T1(3, 9), { hl: 520 });
picture(S3, "wb/soins_a.png", 90, 520, 900, 900, T0(3, 9) + .2, T0(4, 0) - .2);
stroke(S3, wob(235, 880, 425, 1120) + wob(425, 880, 235, 1120), RED, T0(4, 3), T0(4, 4) + .3, 14);
text(S3, "ils agressent, ou ne font rien", 540, 1520, 60, RED, T0(4, 5), T1(4, 11));
/* 4 */
num(S4, 4, ORG, T0(5, 0), T1(5, 0));
text(S4, "Gommages et", 640, 320, 74, INK, T0(5, 4), T1(5, 6));
text(S4, "produits au hasard", 600, 420, 74, INK, T0(5, 8), T1(5, 14));
picture(S4, "wb/gommage_a.png", 90, 520, 900, 900, T0(5, 6), T0(5, 15) - .15);
stroke(S4, circlePath(555, 905, 190, 170), RED, T0(5, 15), T1(5, 17), 12);
text(S4, "C'EST PIRE", 540, 1520, 100, RED, T0(5, 16), T1(5, 17));
/* ===================== MAIN ===================== */
const HJ = { w: 768, h: 1376, tip: [218, 409] }, HS = .92, hand = document.getElementById("hand"), handg = document.getElementById("handg");
DR.sort((a, b) => a.t0 - b.t0);
function tipAt(t) {
  let prev = null, next = null;
  for (const d of DR) { if (t >= d.t0 && t <= d.t1) return d.tip(clamp((t - d.t0) / (d.t1 - d.t0))); if (d.t1 < t) prev = d; else if (d.t0 > t && !next) next = d; }
  const A = prev ? prev.tip(1) : REST, B = next ? next.tip(0) : REST, ta = prev ? prev.t1 : -9, tb = next ? next.t0 : 1e9, gap = tb - ta, mix = (P, Q, k) => [lerp(P[0], Q[0], k), lerp(P[1], Q[1], k)];
  if (gap < 1.3) return mix(A, B, ease(clamp((t - ta) / gap)));
  if (t - ta < .45) return mix(A, REST, ease((t - ta) / .45));
  if (tb - t < .4) return mix(B, REST, ease((tb - t) / .4));
  return REST;
}
/* ===================== SOUS-TITRES (groupes de mots, style de la référence) ===================== */
const chunks = []; SENT.forEach(s => { let cur = []; s.words.forEach((w, i) => { cur.push(w); const last = i === s.words.length - 1; if (last || /[,:;.?!]$/.test(w.w.replace(/ /g, " ").trim()) || cur.length >= 4) { chunks.push({ t0: cur[0].start, t1: cur[cur.length - 1].end, txt: cur.map(q => q.w.replace(/,$/, "")).join(" ").replace(/ /g, " ") }); cur = []; } }); });
const capG = el("g", {}, document.getElementById("caps")), capR = el("rect", { rx: 14, fill: "rgba(60,60,60,.66)" }, capG), capT = el("text", { x: 540, y: 1612, "font-size": 50, "font-weight": 700, fill: "#fff", "text-anchor": "middle", "font-family": "DM Sans" }, capG);
function renderAt(t) {
  SC.forEach(s => { const on = t >= s.t0 - .02 && t < s.t1 + .5; s.g.style.display = on ? "" : "none"; const k = clamp((t - s.t1) / .42); s.r.setAttribute("x", String(-100 + 1300 * eo(k))); s.r.setAttribute("width", String(1400 - 1300 * eo(k))); });
  ANIM.forEach(f => f(t));
  const [tx, ty] = tipAt(t), wob = Math.sin(t * 17) * 1.2;
  hand.setAttribute("transform", `translate(${(tx - HJ.tip[0] * HS + wob).toFixed(1)},${(ty - HJ.tip[1] * HS).toFixed(1)}) scale(${HS})`);
  const c = chunks.find(q => t >= q.t0 - .03 && t < q.t1 + .22);
  if (!c) capG.style.display = "none"; else { capG.style.display = ""; capT.textContent = c.txt; const bb = capT.getBBox(); capR.setAttribute("x", bb.x - 22); capR.setAttribute("y", bb.y - 10); capR.setAttribute("width", bb.width + 44); capR.setAttribute("height", bb.height + 20); }
  return t;
}
window.renderAt = renderAt; window.TOTAL = END;
window.sfxList = () => SFX.filter(s => s.t < END).sort((a, b) => a.t - b.t);
window.PLAN = SC.map(s => ({ id: "s" + s.id, start: s.t0, end: s.t1 }));
window._res(true);
