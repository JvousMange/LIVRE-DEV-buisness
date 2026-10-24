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
export function badge(C, cx, cy, n, id = "badge", color) {
  return `<g id="${id}">` + layer(blob(cx, cy, 88, 88, { jitter: 0.05, n: 14, seed: 90 + n }), color || C.alert, 5) +
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

// ---------- Personnage : femme sans visage, peau mate à foncée, cheveux naturels ----------
// Coordonnées LOCALES : (0,0) = centre du visage. Les ids internes sont animés en repère local.
export const FACE = { skin: "#9C6544", neck: "#7C4C33", hair: "#2E2019", hair2: "#3D2B22", top: "#2E2019", mirror: "#E8D0A8" };
export const SPOTS = [
  { x: -104, y: 104, rx: 23, ry: 17 }, { x: -130, y: 140, rx: 13, ry: 10 }, { x: -80, y: 132, rx: 12, ry: 9 }, { x: -122, y: 76, rx: 11, ry: 9 },
  { x: 108, y: 98, rx: 25, ry: 18 }, { x: 132, y: 136, rx: 14, ry: 10 }, { x: 84, y: 128, rx: 12, ry: 9 }, { x: 126, y: 72, rx: 11, ry: 9 },
  { x: -22, y: 122, rx: 20, ry: 12 }, { x: 22, y: 118, rx: 18, ry: 11 }, { x: 6, y: 180, rx: 20, ry: 13 },
];

function limb(x1, y1, x2, y2, w) {
  const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy), nx = -dy / len, ny = dx / len;
  return poly([[x1 + nx * w / 2, y1 + ny * w / 2], [x2 + nx * w / 2, y2 + ny * w / 2], [x2 - nx * w / 2, y2 - ny * w / 2], [x1 - nx * w / 2, y1 - ny * w / 2]], { round: false });
}

// Miroir de salle de bain derrière elle.
export function mirror(C, id = "mirror") {
  return `<g id="${id}">` + layer(blob(0, -30, 385, 470, { jitter: 0.015, n: 20, seed: 31 }), C.kraftDark, 2) +
    layer(blob(0, -30, 350, 435, { jitter: 0.015, n: 20, seed: 32 }), FACE.mirror, 3) + `</g>`;
}

// Bras + main + outil entrant par la droite (repère local). tool : "cloth" (gant crème pour frotter) | "brush" (pinceau de maquillage).
export const HAND_CLOTH = [122, 104], HAND_BRUSH = [225, 220];
export function arm(C, { id = "arm", tool = "cloth" } = {}) {
  if (tool === "brush") {
    return `<g id="${id}">` +
      layer(limb(470, 500, 240, 240, 88), FACE.skin, 7) +
      layer(limb(236, 230, 138, 136, 26), C.dark, 8) +
      layer(limb(146, 144, 108, 104, 46), C.cream, 8) +
      layer(blob(82, 84, 70, 60, { jitter: 0.08, n: 12, seed: 66 }), "#BE8861", 9) +
      layer(blob(62, 66, 30, 18, { jitter: 0.1, n: 8, seed: 67 }), "#D9A47D", 10) +
      layer(blob(232, 228, 58, 64, { jitter: 0.1, n: 10, seed: 63 }), FACE.skin, 10) + `</g>`;
  }
  return `<g id="${id}">` +
    layer(limb(640, 700, 470, 500, 120), FACE.top, 6) +
    layer(limb(470, 500, 150, 120, 84), FACE.skin, 7) +
    layer(blob(122, 104, 56, 64, { jitter: 0.1, n: 10, seed: 63 }), FACE.skin, 8) +
    layer(blob(98, 86, 80, 56, { jitter: 0.12, n: 12, seed: 64 }), C.cream, 9) +
    layer(blob(78, 76, 38, 8, { jitter: 0.2, n: 8, seed: 65 }), "#D8C2A0", 10) +
    layer(blob(118, 98, 32, 7, { jitter: 0.2, n: 8, seed: 68 }), "#D8C2A0", 10) + `</g>`;
}

// Taches pour chaque SPOTS[i], id "sp{i}".
export function spots(C, show = true) {
  return SPOTS.map((s, i) => `<g id="sp${i}"${show ? "" : ' opacity="0"'}>` + layer(blob(s.x, s.y, s.rx, s.ry, { jitter: 0.22, n: 10, seed: 500 + i }), C.dark, 6, { edge: "rgba(255,225,190,.3)" }) + `</g>`).join("");
}

// Fond de teint qui recouvre chaque tache, id "pt{i}".
export function foundation(C) {
  return SPOTS.map((s, i) => `<g id="pt${i}">` + layer(blob(s.x, s.y, s.rx * 1.55, s.ry * 1.6, { jitter: 0.1, n: 10, seed: 600 + i }), "#BE8861", 7) + `</g>`).join("");
}

// Femme : miroir, cheveux, cou, haut sombre, visage, boucle d'oreille, taches. `extras` = SVG local (bras, fond de teint…).
export function woman(C, { cx = 540, cy = 760, scale = 1, spotsOn = true, extras = "", mirrorOn = true } = {}) {
  const hair = [];
  for (let i = 0; i < 15; i++) {
    const a = Math.PI * (0.78 + (i / 14) * 1.44);         // arc au-dessus et sur les côtés de la tête
    const r = 215 + (i % 3) * 12;
    hair.push(layer(blob(Math.cos(a) * r, Math.sin(a) * r * 0.98 - 20, 92 + (i % 2) * 14, 92 + (i % 2) * 14, { jitter: 0.1, n: 9, seed: 700 + i }), i % 2 ? FACE.hair : FACE.hair2, 3));
  }
  const parts = [
    mirrorOn ? mirror(C) : "",
    hair.join(""),
    layer("M-420 1000 L-410 470 Q-390 340 -250 305 Q-130 270 -64 250 L64 250 Q130 270 250 305 Q390 340 410 470 L420 1000Z", FACE.top, 3),
    layer("M-62 130 L62 130 L66 300 Q0 345 -66 300Z", FACE.neck, 4),
    layer("M-118 262 Q0 372 118 262 Q70 330 0 335 Q-70 330 -118 262Z", FACE.skin, 5),
    layer(blob(-176, 28, 27, 46, { n: 8, seed: 71 }), FACE.skin, 4) + layer(blob(176, 28, 27, 46, { n: 8, seed: 72 }), FACE.skin, 4),
    `<g filter="url(#paper3)"><circle cx="-180" cy="84" r="27" fill="none" stroke="${C.accent}" stroke-width="9"/><circle cx="180" cy="84" r="27" fill="none" stroke="${C.accent}" stroke-width="9"/></g>`,
    layer(blob(0, 0, 168, 212, { jitter: 0.015, n: 16, seed: 73 }), FACE.skin, 5),
    layer(blob(0, -172, 184, 74, { jitter: 0.05, n: 12, seed: 74 }), FACE.hair, 6, { edge: "rgba(0,0,0,0)" }),
    spotsOn ? spots(C) : "",
    extras,
  ];
  return `<g id="woman"><g transform="translate(${cx} ${cy}) scale(${scale})">${parts.join("")}</g></g>`;
}

// ---------- Objets de maquillage (vue de dessus) ----------
export function foundationBottle(C, cx, cy, s = 1, id = "fbottle") {
  const g = (d, fill, z) => layer(d, fill, z);
  return `<g id="${id}"><g transform="translate(${cx} ${cy}) scale(${s})">` +
    g("M-14 -190 L14 -190 L14 -150 L-14 -150Z", C.dark, 3) + g("M-14 -204 L62 -204 L62 -182 L-14 -182Z", C.dark, 3) +
    g("M-24 -152 L24 -152 L24 -108 L-24 -108Z", C.dark, 3) +
    g("M-55 130 Q-55 152 -33 152 L33 152 Q55 152 55 130 L55 -88 Q55 -108 35 -108 L-35 -108 Q-55 -108 -55 -88Z", FACE.mirror, 3) +
    g("M-45 134 L45 134 L45 -42 L-45 -42Z", "#BE8861", 4) + g("M-38 -30 L-28 -30 L-28 120 L-38 120Z", "#D9A47D", 5) + `</g></g>`;
}
export function compact(C, cx, cy, s = 1, id = "compact") {
  return `<g id="${id}"><g transform="translate(${cx} ${cy}) scale(${s})">` +
    layer(blob(0, 0, 132, 132, { jitter: 0.02, n: 18, seed: 81 }), C.kraftDark, 3) +
    layer(blob(0, 0, 102, 102, { jitter: 0.02, n: 18, seed: 82 }), "#BE8861", 4) +
    layer(blob(-34, -30, 36, 24, { jitter: 0.1, n: 10, seed: 83 }), "#D9A47D", 5) + `</g></g>`;
}
export function brush(C, cx, cy, rot = 35, s = 1, id = "brush") {
  return `<g id="${id}"><g transform="translate(${cx} ${cy}) rotate(${rot}) scale(${s})">` +
    layer("M-15 0 L15 0 L9 300 L-9 300Z", C.dark, 3) + layer("M-24 -44 L24 -44 L24 6 L-24 6Z", C.cream, 4) +
    layer(blob(0, -120, 50, 82, { jitter: 0.08, n: 12, seed: 84 }), "#BE8861", 4) + `</g></g>`;
}

// Main qui frotte la surface de la peau avec un gant crème (vue en coupe, coordonnées absolues autour de la tache).
export const HAND_SKIN = [540, 850];
export function skinHand(C, id = "hand") {
  const fingers = [468, 508, 548, 588].map((x, i) => layer(blob(x, 846, 24, 36, { jitter: 0.1, n: 8, seed: 800 + i }), FACE.skin, 8)).join("");
  return `<g id="${id}">` +
    layer(limb(1180, 380, 900, 560, 140), FACE.top, 6) +
    layer(limb(900, 560, 610, 790, 104), FACE.skin, 7) +
    layer(blob(540, 878, 175, 46, { jitter: 0.08, n: 14, seed: 801 }), C.cream, 9) +
    layer(blob(500, 872, 70, 9, { jitter: 0.2, n: 8, seed: 802 }), "#D8C2A0", 10) +
    layer(blob(590, 886, 60, 8, { jitter: 0.2, n: 8, seed: 803 }), "#D8C2A0", 10) +
    layer(blob(545, 808, 120, 64, { jitter: 0.08, n: 12, seed: 804 }), FACE.skin, 8) + fingers +
    layer(blob(430, 826, 34, 26, { jitter: 0.1, n: 8, seed: 805 }), FACE.skin, 8) + `</g>`;
}
