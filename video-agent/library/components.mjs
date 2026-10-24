// Bibliothèque de composants papier. Chaque composant renvoie du SVG ; les groupes animables portent un id.
import { layer, band, blob, star, poly, arrowPts, rng } from "../engine/paper.mjs";

export const W = 1080, H = 1920;
export const SURFACE = 920;           // haut de la couche cornée
export const MEL = [540, 1265];       // position du mélanocyte

const f1 = (n) => Math.round(n * 10) / 10;

// Coupe de peau complète (statique) : derme, épiderme, cellules, couche cornée.
export function skin(C) {
  const r = rng(42);
  const p = [];
  p.push(layer(band(-60, W + 60, 1330, H + 80, { amp: 14, seed: 11 }), C.skinDeep, 1));
  for (let i = 0; i < 6; i++) {
    const y = 1450 + i * 72, x = -40 + r() * 420;
    p.push(layer(band(x, x + 420 + r() * 380, y, y + 20, { amp: 16, step: 36, seed: 20 + i }), "#C79A74", 2));
  }
  for (let i = 0; i < 5; i++) {
    const x = 120 + i * 210 + r() * 50, y = 1560 + r() * 240;
    p.push(layer(blob(x, y, 30, 30, { jitter: 0.1, n: 9, seed: 300 + i }), C.alert, 3));
    p.push(layer(blob(x, y, 13, 13, { jitter: 0.1, n: 8, seed: 320 + i }), "#7A2E1A", 4));
  }
  p.push(layer(band(-60, W + 60, 1010, 1380, { amp: 16, seed: 12 }), C.skinLight, 2));
  for (let x = 10; x < W + 60; x += 96) p.push(layer(blob(x + 46, 1330, 42, 38, { jitter: 0.1, n: 9, seed: x }), "#B5724B", 3));
  for (let row = 0; row < 2; row++)
    for (let x = row ? 70 : 20; x < W; x += 104)
      p.push(layer(blob(x + 40, 1100 + row * 78, 40, 30, { jitter: 0.1, n: 9, seed: x * 7 + row }), "#CF9068", 2));
  p.push(layer(band(-60, W + 60, SURFACE, 1030, { amp: 9, step: 54, seed: 13 }), C.cream, 3));
  for (let i = 0; i < 9; i++) p.push(layer(blob(70 + i * 120 + r() * 30, SURFACE - 8, 36, 11, { seed: 60 + i }), C.cream, 2));
  return `<g id="skin">${p.join("")}</g>`;
}

export function melanocyte(C, id = "mel") {
  const [x, y] = MEL;
  return `<g id="${id}">` +
    layer(star(x, y, 170, 74, 8, { seed: 7 }), C.problem, 4, { edge: "rgba(255,230,200,.35)" }) +
    layer(blob(x, y, 58, 58, { seed: 9 }), C.cream, 5) +
    layer(blob(x, y, 20, 20, { seed: 10 }), C.alert, 6) + `</g>`;
}

// 16 granules : position de départ (autour du mélanocyte) et position finale (flux en S).
export function granuleSpecs(n = 16) {
  const r = rng(42 + 7);
  const specs = [];
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    const to = [540 + Math.sin(t * 6.0) * 120 * (1 - t * 0.25) + (r() - 0.5) * 22, 1150 - t * 215 + (r() - 0.5) * 10];
    const a = (i / n) * Math.PI * 2 + 0.4;
    const from = [MEL[0] + Math.cos(a) * 205, MEL[1] + Math.sin(a) * 118];
    specs.push({ id: `gr${i}`, from, to, rad: 16 + r() * 10, seed: 100 + i });
  }
  return specs;
}

// Le granule est dessiné à sa position finale ; l'animation le décale.
export function granule(C, g) {
  return `<g id="${g.id}">` + layer(blob(g.to[0], g.to[1], g.rad, g.rad * 0.92, { jitter: 0.12, n: 8, seed: g.seed }), C.problem, 5) + `</g>`;
}

export function stain(C, id = "stain") {
  return `<g id="${id}">` +
    layer(blob(540, 905, 230, 34, { jitter: 0.2, n: 14, seed: 77 }), C.problem, 4) +
    layer(blob(520, 890, 150, 22, { jitter: 0.22, n: 12, seed: 78 }), "#5E3A27", 5) +
    layer(blob(820, 902, 50, 15, { jitter: 0.2, n: 9, seed: 79 }), C.problem, 4) +
    layer(blob(250, 904, 36, 12, { jitter: 0.2, n: 9, seed: 80 }), C.problem, 4) + `</g>`;
}

export function sun(C, cx = 830, cy = 330) {
  return `<g id="sun-rays">` + layer(star(cx, cy, 190, 138, 14, { seed: 5, jitter: 0.04 }), C.alert, 2, { edge: "rgba(255,230,190,.4)" }) + `</g>` +
    `<g id="sun">` + layer(blob(cx, cy, 108, 108, { jitter: 0.03, n: 16, seed: 6 }), C.accent, 4) +
    layer(blob(cx - 26, cy - 28, 40, 40, { jitter: 0.1, n: 10, seed: 8 }), "#F2C56A", 5) + `</g>`;
}

export function arrow(C, x1, y1, x2, y2, id = "arrow", color) {
  return `<g id="${id}">` + layer(poly(arrowPts(x1, y1, x2, y2, 44, 118, 120), { round: false }), color || C.alert, 5) + `</g>`;
}

export function questionMark(C, cx, cy, size = 460, id = "qmark") {
  return `<g id="${id}"><g filter="url(#paper5)"><text x="${cx}" y="${cy}" text-anchor="middle" font-family="Inter, 'DejaVu Sans', sans-serif" font-weight="900" font-size="${size}" fill="${C.alert}">?</text></g></g>`;
}

// Étiquette en carton déchiré (sans ficelle).
export function tag(C, cx, cy, w, h, text, { id, seed = 3, fontSize = 40, z = 4, color } = {}) {
  const r = rng(seed), j = () => (r() - 0.5) * 9;
  const x0 = cx - w / 2, y0 = cy - h / 2, pts = [];
  for (let i = 0; i <= 5; i++) pts.push([x0 + (w * i) / 5 + j(), y0 + j()]);
  for (let i = 1; i <= 2; i++) pts.push([x0 + w + j(), y0 + (h * i) / 3 + j()]);
  for (let i = 5; i >= 0; i--) pts.push([x0 + (w * i) / 5 + j(), y0 + h + j()]);
  for (let i = 2; i >= 1; i--) pts.push([x0 + j(), y0 + (h * i) / 3 + j()]);
  const d = "M" + pts.map((p) => `${f1(p[0])} ${f1(p[1])}`).join("L") + "Z";
  return `<g id="${id}">` + layer(d, C.cream, z) +
    layer(blob(x0 + 34, cy, 11, 11, { jitter: 0.1, n: 8, seed: seed + 1 }), color || C.solution, z + 1) +
    `<g filter="url(#paper1)"><text x="${x0 + 66}" y="${f1(cy + fontSize * 0.35)}" font-family="Inter, 'DejaVu Sans', sans-serif" font-weight="900" font-size="${fontSize}" letter-spacing="-0.5" fill="${C.dark}">${text}</text></g></g>`;
}

// Flacon MELA SKIN (version provisoire en attendant le vrai packshot vectorisé). Origine = centre du corps.
export function bottle(C, cx, cy, s = 1, id = "bottle") {
  const g = (d, fill, z) => layer(d, fill, z);
  const body = "M-100 200 Q-100 232 -68 232 L68 232 Q100 232 100 200 L100 -110 Q100 -135 82 -152 L38 -205 L-38 -205 L-82 -152 Q-100 -135 -100 -110Z";
  return `<g id="${id}"><g transform="translate(${cx} ${cy}) scale(${s})">` +
    g("M-34 -250 Q-34 -405 0 -405 Q34 -405 34 -250Z", "#3A2214", 4) +
    g("M-48 -252 L48 -252 L48 -200 L-48 -200Z", "#2E2019", 3) +
    g(body, "#D98E2B", 2) +
    g("M-78 -110 L-60 -110 L-60 160 L-78 160Z", "#F0B552", 3) +
    g("M-100 -70 L100 -70 L100 150 L-100 150Z", "#7A4E32", 3) +
    `<g filter="url(#paper1)"><text x="0" y="-8" text-anchor="middle" font-family="Inter, 'DejaVu Sans', sans-serif" font-weight="900" font-size="50" fill="${C.cream}" letter-spacing="2">MELA</text>` +
    `<text x="0" y="38" text-anchor="middle" font-family="Inter, 'DejaVu Sans', sans-serif" font-weight="900" font-size="50" fill="${C.cream}" letter-spacing="2">SKIN</text>` +
    `<text x="0" y="84" text-anchor="middle" font-family="Inter, 'DejaVu Sans', sans-serif" font-weight="700" font-size="15" fill="${C.cream}" letter-spacing="1.5">SÉRUM ANTI-TACHES</text>` +
    `<text x="0" y="122" text-anchor="middle" font-family="Inter, 'DejaVu Sans', sans-serif" font-weight="600" font-size="15" fill="${C.cream}">30 ml</text></g>` +
    `</g></g>`;
}

export function shield(C, cx, cy, s = 1, id = "shield") {
  const d = "M0 -190 L160 -140 L160 20 Q160 150 0 210 Q-160 150 -160 20 L-160 -140Z";
  return `<g id="${id}"><g transform="translate(${cx} ${cy}) scale(${s})">` +
    layer(d, C.kraftDark, 3) +
    `<g transform="scale(.86)">` + layer(d, C.cream, 4) + `</g></g></g>` +
    `<g id="${id}-check"><g transform="translate(${cx} ${cy}) scale(${s})">` +
    layer(poly([[-86, 5], [-52, -28], [-18, 8], [62, -86], [96, -52], [-18, 76]], { round: false }), C.solution, 6) + `</g></g>`;
}

// Pastille numérotée (« 1 », « 2 »…) : motif répété pour chaque raison.
export function badge(C, cx, cy, n, id = "badge") {
  return `<g id="${id}">` + layer(blob(cx, cy, 88, 88, { jitter: 0.05, n: 14, seed: 90 + n }), C.alert, 5) +
    `<g filter="url(#paper6)"><text x="${cx}" y="${cy + 40}" text-anchor="middle" font-family="Inter, 'DejaVu Sans', sans-serif" font-weight="900" font-size="118" fill="${C.cream}">${n}</text></g></g>`;
}

// Croix rouge (« ça ne marche pas »).
export function cross(C, cx, cy, size = 150, id = "cross") {
  const h = size / 2, t = size * 0.17;
  const bar = (a) => `<g transform="rotate(${a} ${cx} ${cy})">` + layer(poly([[cx - h, cy - t], [cx + h, cy - t], [cx + h, cy + t], [cx - h, cy + t]], { round: false }), C.alert, 5) + `</g>`;
  return `<g id="${id}">${bar(45)}${bar(-45)}</g>`;
}

// Éponge de gommage : bloc ambré troué.
export function sponge(C, cx, cy, id = "sponge") {
  const r = rng(8);
  let holes = "";
  for (let i = 0; i < 9; i++) holes += layer(blob(cx - 110 + r() * 220, cy - 28 + r() * 56, 8 + r() * 7, 7 + r() * 6, { jitter: 0.2, n: 7, seed: 400 + i }), C.kraftDark, 6);
  return `<g id="${id}">` + layer(blob(cx, cy, 150, 58, { jitter: 0.07, n: 12, seed: 41 }), C.accent, 5) + holes + `</g>`;
}

// Couche de fond de teint posée sur la tache.
export function coverPatch(C, id = "patch") {
  return `<g id="${id}">` + layer(blob(540, 893, 300, 44, { jitter: 0.06, n: 14, seed: 52 }), C.skinLight, 6) +
    layer(blob(500, 884, 170, 12, { jitter: 0.1, n: 10, seed: 53 }), "#E3B08C", 6) + `</g>`;
}
