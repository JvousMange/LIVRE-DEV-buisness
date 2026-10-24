// Moteur « look papier » : primitives vectorielles + filtres SVG déterministes.

export function rng(seed) {
  let s = seed >>> 0;
  return () => (s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296;
}

const f = (n) => Math.round(n * 10) / 10;
const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
const P = (p) => `${f(p[0])} ${f(p[1])}`;

// Courbe fermée lissée passant près des points (quadratiques via milieux).
export function smoothClosed(pts) {
  const n = pts.length;
  let d = `M${P(mid(pts[n - 1], pts[0]))}`;
  for (let i = 0; i < n; i++) d += ` Q${P(pts[i])} ${P(mid(pts[i], pts[(i + 1) % n]))}`;
  return d + "Z";
}

// Bande ondulée pleine largeur (haut et bas irréguliers).
export function band(x0, x1, yTop, yBot, { amp = 10, step = 60, seed = 1 } = {}) {
  const r = rng(seed);
  const top = [], bot = [];
  for (let x = x0; x <= x1; x += step) top.push([x, yTop + (r() - 0.5) * 2 * amp]);
  for (let x = x1; x >= x0; x -= step) bot.push([x, yBot + (r() - 0.5) * 2 * amp]);
  let d = `M${P(top[0])}`;
  for (let i = 1; i < top.length; i++) d += ` Q${P(top[i - 1])} ${P(mid(top[i - 1], top[i]))}`;
  d += ` L${P(bot[0])}`;
  for (let i = 1; i < bot.length; i++) d += ` Q${P(bot[i - 1])} ${P(mid(bot[i - 1], bot[i]))}`;
  return d + "Z";
}

export function blob(cx, cy, rx, ry, { jitter = 0.18, n = 12, seed = 1 } = {}) {
  const r = rng(seed);
  const pts = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const k = 1 + (r() - 0.5) * 2 * jitter;
    pts.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]);
  }
  return smoothClosed(pts);
}

// Étoile à pointes arrondies (cellule pigmentaire, soleil, rayons).
export function star(cx, cy, rOut, rIn, spikes, { seed = 1, jitter = 0.12 } = {}) {
  const r = rng(seed);
  const pts = [];
  for (let i = 0; i < spikes * 2; i++) {
    const a = (i / (spikes * 2)) * Math.PI * 2 - Math.PI / 2;
    const base = i % 2 ? rIn : rOut;
    const k = 1 + (r() - 0.5) * 2 * jitter;
    pts.push([cx + Math.cos(a) * base * k, cy + Math.sin(a) * base * k]);
  }
  return smoothClosed(pts);
}

export function poly(pts, { round = true } = {}) {
  return round ? smoothClosed(pts) : "M" + pts.map(P).join("L") + "Z";
}

// Une couche de papier : forme + lumière de tranche + ombre selon la hauteur z (1..6).
function minSize(d) {
  const n = (d.match(/-?\d+(\.\d+)?/g) || []).map(Number);
  const xs = n.filter((_, i) => i % 2 === 0), ys = n.filter((_, i) => i % 2 === 1);
  return Math.min(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys));
}

export function layer(d, fill, z = 2, { edge = "rgba(255,248,232,.55)", id = "" } = {}) {
  const small = minSize(d) < 160 ? "S" : "";
  return (
    `<g ${id ? `id="${id}" ` : ""}filter="url(#paper${small}${z})">` +
    `<path d="${d}" fill="${fill}"/>` +
    `<path d="${d}" fill="none" stroke="${edge}" stroke-width="2" transform="translate(-1.2,-1.2)"/>` +
    `</g>`
  );
}

// Définitions : un filtre papier par hauteur (rugosité du bord + grain + ombre portée).
export function defs() {
  const out = [];
  for (const small of ["", "S"]) for (let z = 1; z <= 6; z++) {
    const region = small ? 'x="-100%" y="-100%" width="300%" height="300%"' : 'x="-20%" y="-20%" width="140%" height="140%"';
    const dx = z * 1.6, dy = z * 3.2, blur = z * 2.2, op = Math.min(0.2 + z * 0.045, 0.5);
    out.push(`
<filter id="paper${small}${z}" ${region} color-interpolation-filters="sRGB">
  <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="${z + 2}" result="n1"/>
  <feDisplacementMap in="SourceGraphic" in2="n1" scale="7" xChannelSelector="R" yChannelSelector="G" result="d1"/>
  <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="${z + 11}" result="n2"/>
  <feDisplacementMap in="d1" in2="n2" scale="2.6" xChannelSelector="R" yChannelSelector="G" result="d2"/>
  <feTurbulence type="fractalNoise" baseFrequency="0.22 0.7" numOctaves="3" seed="${z + 21}" result="n3"/>
  <feColorMatrix in="n3" type="matrix" values="0 0 0 0 0.30  0 0 0 0 0.18  0 0 0 0 0.08  0 0 0 -1.5 0.62" result="grain"/>
  <feComposite in="grain" in2="d2" operator="in" result="grainIn"/>
  <feMerge result="paper"><feMergeNode in="d2"/><feMergeNode in="grainIn"/></feMerge>
  <feColorMatrix in="d2" type="matrix" values="0 0 0 0 0.12  0 0 0 0 0.06  0 0 0 0 0.02  0 0 0 ${op} 0" result="sh0"/>
  <feGaussianBlur in="sh0" stdDeviation="${blur}" result="sh1"/>
  <feOffset in="sh1" dx="${dx}" dy="${dy}" result="sh"/>
  <feMerge><feMergeNode in="sh"/><feMergeNode in="paper"/></feMerge>
</filter>`);
  }
  out.push(`
<filter id="kraft" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">
  <feTurbulence type="fractalNoise" baseFrequency="0.012 0.02" numOctaves="3" seed="4" result="low"/>
  <feColorMatrix in="low" type="matrix" values="0 0 0 0 0.45  0 0 0 0 0.3  0 0 0 0 0.15  0 0 0 0.35 -0.1" result="blotch"/>
  <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="3" seed="9" result="fine"/>
  <feColorMatrix in="fine" type="matrix" values="0 0 0 0 0.28  0 0 0 0 0.18  0 0 0 0 0.08  0 0 0 1.1 -0.5" result="speck"/>
  <feMerge><feMergeNode in="SourceGraphic"/><feMergeNode in="blotch"/><feMergeNode in="speck"/></feMerge>
</filter>
<radialGradient id="vignette" cx="50%" cy="48%" r="75%">
  <stop offset="60%" stop-color="#2a1608" stop-opacity="0"/>
  <stop offset="100%" stop-color="#2a1608" stop-opacity=".38"/>
</radialGradient>
<linearGradient id="light" x1="0" y1="0" x2="1" y2="1">
  <stop offset="0" stop-color="#fff3d6" stop-opacity=".22"/>
  <stop offset=".55" stop-color="#fff3d6" stop-opacity="0"/>
  <stop offset="1" stop-color="#1a0c04" stop-opacity=".18"/>
</linearGradient>`);
  return `<defs>${out.join("")}</defs>`;
}

// Fond carton kraft : couleur + marbrure + fibres + éclairage global.
export function kraftBackground(W, H, palette, seed = 5) {
  const r = rng(seed);
  let fibers = "";
  for (let i = 0; i < 260; i++) {
    const x = r() * W, y = r() * H, len = 14 + r() * 38, a = (r() - 0.5) * 1.2;
    const dark = r() > 0.45;
    fibers += `<line x1="${f(x)}" y1="${f(y)}" x2="${f(x + Math.cos(a) * len)}" y2="${f(y + Math.sin(a) * len)}" stroke="${dark ? palette.kraftDark : "#E8D0A8"}" stroke-width="${f(0.8 + r() * 1.2)}" opacity="${f(0.25 + r() * 0.3)}" stroke-linecap="round"/>`;
  }
  return `<rect width="${W}" height="${H}" fill="${palette.kraft}" filter="url(#kraft)"/><g>${fibers}</g>`;
}

export function finish(W, H) {
  return `<rect width="${W}" height="${H}" fill="url(#light)"/><rect width="${W}" height="${H}" fill="url(#vignette)"/>`;
}

// Étiquette en carton déchiré, suspendue par une ficelle.
export function hangingSign(cx, top, w, h, lines, { palette, seed = 3, fontSize = 92, z = 4 } = {}) {
  const r = rng(seed);
  const x0 = cx - w / 2, y0 = top;
  const j = () => (r() - 0.5) * 12;
  const pts = [];
  for (let i = 0; i <= 6; i++) pts.push([x0 + (w * i) / 6 + j(), y0 + j()]);
  for (let i = 1; i <= 4; i++) pts.push([x0 + w + j(), y0 + (h * i) / 4 + j()]);
  for (let i = 6; i >= 0; i--) pts.push([x0 + (w * i) / 6 + j(), y0 + h + j()]);
  for (let i = 3; i >= 1; i--) pts.push([x0 + j(), y0 + (h * i) / 4 + j()]);
  const d = "M" + pts.map(P).join("L") + "Z";
  const lh = fontSize * 1.05;
  const startY = y0 + h / 2 - ((lines.length - 1) * lh) / 2 + fontSize * 0.34;
  const text = lines
    .map(
      (t, i) =>
        `<text x="${cx}" y="${f(startY + i * lh)}" text-anchor="middle" font-family="Inter, 'DejaVu Sans', sans-serif" font-weight="900" font-size="${fontSize}" letter-spacing="-1" fill="${palette.dark}" transform="rotate(-1.2 ${cx} ${startY})">${t}</text>`
    )
    .join("");
  const string =
    `<path d="M${cx - w * 0.28} ${y0 + 6} L${cx} ${y0 - 260} L${cx + w * 0.28} ${y0 + 6}" fill="none" stroke="#6b4a2a" stroke-width="5" stroke-linecap="round" filter="url(#paper1)"/>`;
  return string + layer(d, palette.cream, z) + `<g filter="url(#paper1)">${text}</g>`;
}

// Flèche en papier épais de (x1,y1) vers (x2,y2).
export function arrowPts(x1, y1, x2, y2, w = 46, headW = 120, headL = 110) {
  const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy);
  const ux = dx / len, uy = dy / len, nx = -uy, ny = ux;
  const bx = x2 - ux * headL, by = y2 - uy * headL;
  return [
    [x1 + nx * w / 2, y1 + ny * w / 2], [bx + nx * w / 2, by + ny * w / 2], [bx + nx * headW / 2, by + ny * headW / 2],
    [x2, y2],
    [bx - nx * headW / 2, by - ny * headW / 2], [bx - nx * w / 2, by - ny * w / 2], [x1 - nx * w / 2, y1 - ny * w / 2],
  ];
}
