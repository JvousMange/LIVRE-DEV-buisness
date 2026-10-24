// Bibliothèque de composants, suite : objets, instruments et pictogrammes pour les plans « mécanisme / actifs / offre ».
// Convention : coordonnées absolues (cx, cy = centre), échelle s ; les groupes animables portent un id.
import { layer, band, blob, poly, star, rng, arrowPts } from "../engine/paper.mjs";

const F = "Inter, 'DejaVu Sans', sans-serif";
const f1 = (n) => Math.round(n * 10) / 10;
const G = (cx, cy, s, inner, id) => `<g id="${id}"><g transform="translate(${cx} ${cy}) scale(${s})">${inner}</g></g>`;
const txt = (x, y, size, fill, t, w = 900, extra = "") => `<g filter="url(#paper1)"><text x="${x}" y="${y}" text-anchor="middle" font-family="${F}" font-weight="${w}" font-size="${size}" fill="${fill}" ${extra}>${t}</text></g>`;

export function check(C, cx, cy, size = 170, id = "check", color) {
  const k = size / 190;
  return G(cx, cy, k, layer(poly([[-86, 5], [-52, -28], [-18, 8], [62, -86], [96, -52], [-18, 76]], { round: false }), color || C.solution, 6), id);
}

export function tube(C, cx, cy, { s = 1, body, label = "", id = "tube", labelSize = 30 } = {}) {
  const col = body || C.cream;
  return G(cx, cy, s,
    layer("M-50 -190 L50 -190 L50 -168 L-50 -168Z", "#B5724B", 3) +
    layer("M-50 -168 L50 -168 L42 152 L-42 152Z", col, 3) +
    layer("M-42 152 L42 152 L36 208 L-36 208Z", C.dark, 3) +
    layer("M-47 -50 L47 -50 L43 50 L-43 50Z", "#E8D0A8", 4) +
    txt(0, 14, labelSize, C.dark, label), id);
}

export function jar(C, cx, cy, { s = 1, body, label = "", id = "jar", labelSize = 28 } = {}) {
  return G(cx, cy, s,
    layer("M-96 -90 L96 -90 L96 -40 L-96 -40Z", C.dark, 4) +
    layer("M-90 -40 L90 -40 L84 112 Q84 130 66 130 L-66 130 Q-84 130 -84 112Z", body || C.cream, 3) +
    layer("M-80 -10 L80 -10 L76 80 L-76 80Z", "#E8D0A8", 4) + txt(0, 52, labelSize, C.dark, label), id);
}

export function flame(C, cx, cy, s = 1, id = "flame") {
  return G(cx, cy, s,
    layer("M0 -130 Q70 -40 46 34 Q26 90 0 90 Q-34 90 -46 34 Q-70 -34 0 -130Z", C.alert, 5) +
    layer("M0 -50 Q36 -4 24 40 Q14 66 0 66 Q-20 66 -26 38 Q-34 -2 0 -50Z", C.accent, 6), id);
}

export function sparkle(C, cx, cy, s = 1, id = "sparkle") {
  return G(cx, cy, s, layer(star(0, 0, 70, 14, 4, { jitter: 0 }), C.accent, 6) + layer(star(60, -50, 28, 6, 4, { jitter: 0 }), "#F2C56A", 6), id);
}

export function razor(C, cx, cy, s = 1, id = "razor") {
  return G(cx, cy, s,
    layer("M-24 20 L24 20 L18 300 L-18 300Z", C.dark, 3) +
    layer("M-100 -70 L100 -70 L100 20 L-100 20Z", C.cream, 4) +
    layer("M-86 -52 L86 -52 L86 -34 L-86 -34Z", C.kraftDark, 5) + layer("M-86 -26 L86 -26 L86 -10 L-86 -10Z", C.kraftDark, 5), id);
}

export function pimple(C, cx, cy, s = 1, id = "pimple") {
  return G(cx, cy, s, layer(blob(0, 0, 62, 62, { jitter: 0.06, n: 12, seed: 33 }), C.alert, 5) + layer(blob(-10, -14, 18, 18, { jitter: 0.1, n: 8, seed: 34 }), C.cream, 6), id);
}

export function padlock(C, cx, cy, s = 1, id = "padlock") {
  return G(cx, cy, s,
    `<g filter="url(#paper3)"><path d="M-46 -20 L-46 -70 Q-46 -120 0 -120 Q46 -120 46 -70 L46 -20" fill="none" stroke="${C.kraftDark}" stroke-width="22" stroke-linecap="round"/></g>` +
    layer("M-76 -30 L76 -30 L76 90 L-76 90Z", C.dark, 5) + layer(blob(0, 28, 14, 14, { n: 8, seed: 35 }), C.accent, 6), id);
}

// Bouclier. noCheck : sans coche ; crack : fissure (rien ne protège).
export function shield2(C, cx, cy, s = 1, id = "shield", { check = true, crack = false } = {}) {
  const d = "M0 -190 L160 -140 L160 20 Q160 150 0 210 Q-160 150 -160 20 L-160 -140Z";
  return G(cx, cy, s,
    layer(d, C.kraftDark, 3) + `<g transform="scale(.86)">` + layer(d, C.cream, 4) + `</g>` +
    (check ? layer(poly([[-86, 5], [-52, -28], [-18, 8], [62, -86], [96, -52], [-18, 76]], { round: false }), C.solution, 6) : "") +
    (crack ? layer(poly([[-10, -150], [26, -80], [-18, -30], [30, 40], [-8, 100], [4, 150], [-24, 100], [18, 30], [-30, -30], [10, -90]], { round: false }), C.alert, 6) : ""), id);
}

export function calendar(C, cx, cy, s = 1, id = "cal", { mark = 9, month = "", stain = false } = {}) {
  let grid = "";
  for (let r = 0; r < 4; r++) for (let c = 0; c < 5; c++) grid += `<rect x="${-140 + c * 58}" y="${-70 + r * 66}" width="50" height="52" fill="none" stroke="${C.kraftDark}" stroke-width="4" opacity=".7"/>`;
  const mc = mark % 5, mr = Math.floor(mark / 5);
  return G(cx, cy, s,
    layer("M-170 -170 L170 -170 L170 190 L-170 190Z", C.cream, 4) + layer("M-170 -170 L170 -170 L170 -90 L-170 -90Z", C.alert, 5) +
    layer(blob(-100, -170, 16, 16, { n: 8, seed: 36 }), C.dark, 6) + layer(blob(100, -170, 16, 16, { n: 8, seed: 37 }), C.dark, 6) +
    txt(0, -112, 44, C.cream, month) + `<g filter="url(#paper1)">${grid}</g>` +
    `<g filter="url(#paper3)"><circle cx="${-117 + mc * 58}" cy="${-44 + mr * 66}" r="34" fill="none" stroke="${C.alert}" stroke-width="8"/></g>` +
    (stain ? layer(blob(-60, 70, 62, 42, { jitter: 0.25, n: 12, seed: 77 }), C.problem, 6) + layer(blob(-70, 62, 34, 22, { jitter: 0.25, n: 10, seed: 78 }), "#5E3A27", 7) : ""), id);
}

export function coin(C, cx, cy, r = 44, id = "coin") {
  return `<g id="${id}">` + layer(blob(cx, cy, r, r, { jitter: 0.02, n: 14, seed: 38 }), C.accent, 5) + layer(blob(cx, cy, r * 0.62, r * 0.62, { jitter: 0.02, n: 12, seed: 39 }), "#F2C56A", 6) + `</g>`;
}

export function wallet(C, cx, cy, s = 1, id = "wallet") {
  return G(cx, cy, s,
    layer("M-200 -110 L200 -110 L200 120 L-200 120Z", "#7A4E32", 4) + layer("M-200 -110 L200 -110 L200 -30 L-200 -30Z", "#3A2214", 5) +
    layer(blob(170, 40, 30, 30, { n: 10, seed: 40 }), C.accent, 6), id);
}

// Jauge : zone verte au centre, rouge à droite. Aiguille id "${id}-needle" (0° = vers le haut, sens horaire), origine locale (0,0).
export function gauge(C, cx, cy, s = 1, id = "gauge") {
  const arc = (r0, r1, a0, a1, fill) => {
    const pts = [];
    for (let a = a0; a <= a1; a += 8) pts.push([Math.sin((a * Math.PI) / 180) * r1, -Math.cos((a * Math.PI) / 180) * r1]);
    for (let a = a1; a >= a0; a -= 8) pts.push([Math.sin((a * Math.PI) / 180) * r0, -Math.cos((a * Math.PI) / 180) * r0]);
    return layer(poly(pts, { round: false }), fill, 5);
  };
  let ticks = "";
  for (let a = -120; a <= 120; a += 20) ticks += `<line x1="${f1(Math.sin((a * Math.PI) / 180) * 280)}" y1="${f1(-Math.cos((a * Math.PI) / 180) * 280)}" x2="${f1(Math.sin((a * Math.PI) / 180) * 250)}" y2="${f1(-Math.cos((a * Math.PI) / 180) * 250)}" stroke="${C.dark}" stroke-width="6" stroke-linecap="round"/>`;
  return G(cx, cy, s,
    layer(blob(0, 0, 330, 330, { jitter: 0.01, n: 20, seed: 41 }), C.kraftDark, 3) + layer(blob(0, 0, 298, 298, { jitter: 0.01, n: 20, seed: 42 }), C.cream, 4) +
    arc(170, 240, -120, -45, "#D8C2A0") + arc(170, 240, -40, 40, C.solution) + arc(170, 240, 45, 120, C.alert) + `<g filter="url(#paper1)">${ticks}</g>` +
    `<g id="${id}-needle">` + layer(poly([[-16, 20], [0, -250], [16, 20], [0, 56]], { round: false }), C.dark, 6) + `</g>` + layer(blob(0, 0, 40, 40, { n: 10, seed: 43 }), C.dark, 7), id);
}

// Engrenage.
export function gear(C, cx, cy, r = 150, teeth = 12, id = "gear", fill = "#B5724B") {
  return `<g id="${id}">` + layer(star(cx, cy, r, r * 0.84, teeth, { jitter: 0 }), fill, 4) + layer(blob(cx, cy, r * 0.5, r * 0.5, { jitter: 0.02, n: 14, seed: 44 }), "#7A4E32", 5) + layer(blob(cx, cy, r * 0.2, r * 0.2, { n: 10, seed: 45 }), C.cream, 6) + `</g>`;
}

// Vanne sur un tuyau vertical, repère local (échelle k). Ids : "${id}-wheel" (volant, origine locale [130,0]) et "${id}-gate" (clapet, glisse en x local).
export function valve(C, cx, cy, id = "valve", k = 1.35) {
  return `<g id="${id}"><g transform="translate(${cx} ${cy}) scale(${k})">` +
    layer("M-50 -90 L50 -90 L50 95 L-50 95Z", "#E8D0A8", 3) +
    layer("M-80 -46 L80 -46 L80 46 L-80 46Z", C.dark, 4) + layer("M80 -10 L130 -10 L130 10 L80 10Z", C.dark, 4) +
    `<g id="${id}-wheel">` + layer(blob(130, 0, 70, 70, { jitter: 0.02, n: 14, seed: 46 }), C.alert, 5) + layer(blob(130, 0, 44, 44, { jitter: 0.02, n: 12, seed: 47 }), C.cream, 6) +
    layer("M124 -70 L136 -70 L136 70 L124 70Z", C.dark, 7) + layer("M60 -6 L200 -6 L200 6 L60 6Z", C.dark, 7) + `</g>` +
    `<g id="${id}-gate">` + layer("M-66 -14 L66 -14 L66 14 L-66 14Z", C.solution, 6) + `</g></g></g>`;
}

export function button(C, cx, cy, w, h, text, id = "button", color) {
  return `<g id="${id}">` + layer(blob(cx, cy, w / 2, h / 2, { jitter: 0.025, n: 16, seed: 48 }), color || C.solution, 5) + txt(cx, f1(cy + h * 0.17), Math.round(h * 0.46), C.cream, text) + `</g>`;
}

// Grille de points (ex. 100 personnes dont 94 en vert). Ids de lignes : "${id}-r0".."${id}-r{rows-1}".
export function dotsGrid(C, cx, cy, { cols = 10, rows = 10, gap = 78, r = 28, on = 94, id = "dots" } = {}) {
  let out = "";
  for (let rw = 0; rw < rows; rw++) {
    let row = "";
    for (let c = 0; c < cols; c++) {
      const i = rw * cols + c;
      row += layer(blob(cx + (c - (cols - 1) / 2) * gap, cy + (rw - (rows - 1) / 2) * gap, r, r, { jitter: 0.05, n: 10, seed: 1000 + i }), i < on ? C.solution : "#D8C2A0", 4);
    }
    out += `<g id="${id}-r${rw}">${row}</g>`;
  }
  return `<g id="${id}">${out}</g>`;
}

// Étagère en carton (support de produits).
export function shelf(C, cx, y, w = 960, id = "shelf") {
  return `<g id="${id}">` + layer(`M${cx - w / 2} ${y} L${cx + w / 2} ${y} L${cx + w / 2} ${y + 40} L${cx - w / 2} ${y + 40}Z`, "#A9845A", 3) + `</g>`;
}

function limb2(x1, y1, x2, y2, w) {
  const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy), nx = -dy / len, ny = dx / len;
  return poly([[x1 + nx * w / 2, y1 + ny * w / 2], [x2 + nx * w / 2, y2 + ny * w / 2], [x2 - nx * w / 2, y2 - ny * w / 2], [x1 - nx * w / 2, y1 - ny * w / 2]], { round: false });
}

// Loupe : verre translucide, anneau et manche (repère local centré sur le verre).
export function loupe(C, cx, cy, r = 150, id = "loupe") {
  return G(cx, cy, 1,
    layer(limb2(r * 0.7, r * 0.7, r * 1.7, r * 1.7, r * 0.22), C.dark, 5) +
    `<g filter="url(#paper5)"><circle cx="0" cy="0" r="${r + 11}" fill="none" stroke="${C.kraftDark}" stroke-width="22"/></g>` +
    `<circle cx="0" cy="0" r="${r}" fill="rgba(255,247,230,.22)"/>` +
    `<path d="M${-r * 0.62} ${-r * 0.3} Q${-r * 0.35} ${-r * 0.7} ${r * 0.05} ${-r * 0.72}" fill="none" stroke="rgba(255,255,255,.55)" stroke-width="${r * 0.09}" stroke-linecap="round"/>`, id);
}

// Clé en carton (tête ronde + dents), repère local centré sur la tête.
export function keyItem(C, cx, cy, s = 1, id = "key", label = "") {
  return G(cx, cy, s,
    layer(limb2(40, 0, 330, 0, 36), C.accent, 5) + layer(blob(0, 0, 66, 66, { jitter: 0.02, n: 14, seed: 54 }), C.accent, 5) + layer(blob(0, 0, 26, 26, { jitter: 0.02, n: 10, seed: 55 }), "#7A4E32", 6) +
    layer("M250 18 L290 18 L290 70 L250 70Z", C.accent, 5) + layer("M300 18 L330 18 L330 56 L300 56Z", C.accent, 5) + (label ? txt(190, -34, 30, C.dark, label) : ""), id);
}

// Plaque de serrure : fond carton, pastille de teint, trou de serrure.
export function lockPlate(C, cx, cy, w, h, swatch, id = "plate") {
  return G(cx, cy, 1,
    layer(`M${-w / 2} ${-h / 2} L${w / 2} ${-h / 2} L${w / 2} ${h / 2} L${-w / 2} ${h / 2}Z`, "#E8D0A8", 3) +
    layer(blob(-w * 0.27, 0, h * 0.34, h * 0.34, { jitter: 0.02, n: 16, seed: 56 }), swatch, 4) +
    layer(blob(w * 0.22, -h * 0.08, 46, 46, { jitter: 0.02, n: 12, seed: 57 }), C.dark, 5) + layer("M" + (w * 0.22 - 22) + " " + (-h * 0.08 + 10) + " L" + (w * 0.22 + 22) + " " + (-h * 0.08 + 10) + " L" + (w * 0.22 + 34) + " " + (h * 0.22) + " L" + (w * 0.22 - 34) + " " + (h * 0.22) + "Z", C.dark, 5), id);
}

// Main qui pointe un doigt (vers la gauche ; dir = -1 pour la retourner). Repère local : bout du doigt vers x négatif.
export function pointer(C, cx, cy, dir = 1, id = "pointer", skin = "#9C6544", sleeve = "#2E2019") {
  return `<g id="${id}"><g transform="translate(${cx} ${cy}) scale(${dir} 1)">` +
    layer(limb2(560, 120, 380, 40, 150), sleeve, 6) + layer(limb2(380, 40, 120, 10, 96), skin, 7) +
    layer(blob(90, 10, 70, 62, { jitter: 0.08, n: 12, seed: 58 }), skin, 8) + layer(limb2(70, -6, -150, -10, 36), skin, 9) + layer(blob(-156, -10, 24, 22, { jitter: 0.05, n: 8, seed: 59 }), skin, 9) +
    layer(blob(70, 54, 34, 26, { jitter: 0.1, n: 8, seed: 60 }), skin, 9) + `</g></g>`;
}

export { arrowPts };

// ---------- Usine à pigment (le mélanocyte vu comme une usine sous la peau) ----------
// Repère local centré sur la façade. Ids internes : "${id}-gear", "${id}-win" (fenêtres allumées), "${id}-red" (fenêtres d'alerte), "${id}-sm0".."${id}-sm7" (fumée).
export function factory(C, cx, cy, s = 1, id = "fac", K = {}) {
  const k = { body: "#8A5A3C", roof: C.problem, chimney: "#6b4a2a", cap: C.dark, base: C.dark, gear: "#B5724B", ...K };
  const teeth = [-270, -130, 10].map((x) => layer(poly([[x, -108], [x, -212], [x + 140, -108]], { round: false }), k.roof, 4)).join("");
  const win = (x, fill, z) => layer(poly([[x - 32, -64], [x + 32, -64], [x + 32, 2], [x - 32, 2]], { round: false }), fill, z);
  const smoke = Array.from({ length: 24 }, (_, i) => `<g id="${id}-sm${i}" opacity="0">` + layer(blob(200 + (i % 3) * 10, -340, 64, 52, { jitter: 0.22, n: 10, seed: 1500 + i }), i < 8 ? "rgb(241,230,210)" : "rgb(64,54,50)", 5, { edge: "rgba(0,0,0,0)" }) + `</g>`).join("");
  return G(cx, cy, s,
    layer(poly([[-250, -110], [250, -110], [250, 150], [-250, 150]], { round: false }), k.body, 3) + teeth +
    layer(poly([[170, -300], [230, -300], [230, -110], [170, -110]], { round: false }), k.chimney, 3) + layer(poly([[158, -322], [242, -322], [242, -296], [158, -296]], { round: false }), k.cap, 4) +
    layer(poly([[170, -270], [230, -270], [230, -246], [170, -246]], { round: false }), C.alert, 4) +
    `<g id="${id}-win">${[-180, -70, 40].map((x) => win(x, C.accent, 5)).join("")}</g><g id="${id}-red" opacity="0">${[-180, -70, 40].map((x) => win(x, C.alert, 6)).join("")}</g>` +
    layer(poly([[-240, 30], [-150, 30], [-150, 150], [-240, 150]], { round: false }), C.cream, 4) +
    layer(poly([[-250, 140], [250, 140], [250, 170], [-250, 170]], { round: false }), k.base, 4) +
    `<g id="${id}-gear">` + layer(star(190, 62, 56, 46, 10, { jitter: 0 }), k.gear, 5) + layer(blob(190, 62, 20, 20, { n: 10, seed: 1490 }), C.cream, 6) + `</g>` + smoke, id);
}

// Sirène d'alerte (dôme rouge sur socle). Ids : "${id}" (le tout).
export function siren(C, cx, cy, s = 1, id = "siren") {
  return G(cx, cy, s, layer(poly([[-46, 0], [46, 0], [46, 30], [-46, 30]], { round: false }), C.dark, 5) + layer(blob(0, -2, 44, 44, { jitter: 0.02, n: 12, seed: 1495 }), C.alert, 6) + layer(blob(-12, -16, 12, 12, { n: 8, seed: 1496 }), "#F2C56A", 7), id);
}

// Tuyau vertical + tapis roulant horizontal de la sortie de l'usine vers la surface.
export function pipeLine(C, x, yTop, yBelt, beltX0, id = "pipe") {
  return `<g id="${id}">` +
    layer(poly([[x - 32, yTop], [x + 32, yTop], [x + 32, yBelt + 16], [x - 32, yBelt + 16]], { round: false }), "#E8D0A8", 3) +
    layer(poly([[beltX0, yBelt - 14], [x + 32, yBelt - 14], [x + 32, yBelt + 16], [beltX0, yBelt + 16]], { round: false }), "#B5724B", 4) +
    [0, 1, 2].map((i) => layer(blob(beltX0 + 28 + i * 44, yBelt + 20, 12, 12, { n: 8, seed: 1480 + i }), "#E8D0A8", 5)).join("") + `</g>`;
}

// Décor sous la peau, volontairement épuré : sol brun très foncé, fine bande de peau en surface (ids : "surf", "surfTint").
export function underground(C) {
  const top = band(-80, 1160, 900, 985, { amp: 7, step: 54, seed: 13 });
  return layer(band(-80, 1160, 960, 3000, { amp: 6, seed: 21 }), "#3A2214", 1) + `<g id="surf">${layer(top, C.cream, 3)}</g>` + `<g id="surfTint">${layer(top, "#9C6544", 4)}</g>`;
}

// Éclair en zigzag de (x1,y1) à (x2,y2) (cause qui frappe l'usine).
export function bolt(C, x1, y1, x2, y2, id = "bolt", w = 34) {
  const n = 7, pts = [], dx = (x2 - x1) / n, dy = (y2 - y1) / n;
  for (let i = 0; i <= n; i++) pts.push([x1 + dx * i + (i % 2 ? w : -w) * (i === 0 || i === n ? 0 : 1), y1 + dy * i]);
  const back = pts.slice().reverse().map((p, i, a) => [p[0] + (i === 0 || i === a.length - 1 ? 0 : 16), p[1] + 6]);
  return `<g id="${id}">` + layer(poly(pts.concat(back), { round: false }), C.alert, 7) + layer(poly(pts.slice(1, -1).concat(back.slice(1, -1)), { round: false }), C.accent, 8) + `</g>`;
}

// ───── Nouveaux accessoires (illustrations d'actifs, STOP, ticket de caisse, panier) ─────

// Panneau STOP octogonal sur son poteau. Repère local : centre du panneau (0,0), poteau vers le bas.
export function stopSign(C, cx, cy, s = 1, id = "stop", post = true) {
  const oct = (r) => Array.from({ length: 8 }, (_, k) => { const a = ((22.5 + k * 45) * Math.PI) / 180; return [Math.cos(a) * r, Math.sin(a) * r]; });
  return G(cx, cy, s,
    (post ? layer(poly([[-24, 120], [24, 120], [24, 980], [-24, 980]], { round: false }), "#3D2B22", 3) : "") +
    layer(poly(oct(200), { round: false }), C.cream, 5) + layer(poly(oct(172), { round: false }), C.alert, 6) +
    txt(0, 34, 104, C.cream, "STOP", 900), id);
}

// Robinet : tuyau venant de la gauche, bec au-dessus du point (0,0)=bec. Poignée "${id}-h" (origine locale [0,-150]).
export function faucet(C, cx, cy, s = 1, id = "faucet") {
  return G(cx, cy, s,
    layer(poly([[-900, -190], [-30, -190], [-30, -100], [-900, -100]], { round: false }), "#E8D0A8", 3) +
    layer(poly([[-90, -230], [90, -230], [90, -60], [-90, -60]], { round: false }), "#D8C2A0", 4) +
    layer(poly([[-34, -60], [34, -60], [34, 20], [-34, 20]], { round: false }), "#B5724B", 5) +
    `<g id="${id}-h">` + layer(poly([[-12, -330], [12, -330], [12, -230], [-12, -230]], { round: false }), C.dark, 5) +
    layer(poly([[-110, -372], [110, -372], [110, -330], [-110, -330]], { round: false }), C.alert, 6) + `</g>`, id);
}

// Ciseaux ouverts, pivot en (0,0), pointes vers le haut. Lames "${id}-a" / "${id}-b" (origine locale [0,0]).
export function scissors(C, cx, cy, s = 1, id = "scissors") {
  const blade = (sign, nm) => `<g id="${id}-${nm}"><g transform="scale(${sign} 1)">` +
    layer(poly([[-8, 10], [22, 10], [16, -420], [-2, -440]], { round: false }), "#E8D0A8", 6) +
    layer(poly([[-8, 10], [-40, 120], [-12, 190], [32, 120], [22, 10]], { round: false }), C.dark, 5) +
    layer(blob(-14, 230, 66, 66, { jitter: 0.03, n: 12, seed: 4100 + (sign > 0 ? 0 : 1) }), C.solution, 6) +
    layer(blob(-14, 230, 34, 34, { jitter: 0.03, n: 10, seed: 4102 }), C.cream, 7) + `</g></g>`;
  return G(cx, cy, s, blade(1, "a") + blade(-1, "b") + layer(blob(0, 0, 22, 22, { n: 8, seed: 4103 }), C.alert, 8), id);
}

// Enzyme (grosse cellule croquée côté droit) + « bouchon » vert qui se loge dans l'encoche. Ids : id, "${id}-plug" (glisse en x local).
export function enzyme(C, cx, cy, s = 1, id = "enzyme") {
  const pts = [];
  for (let a = 32; a <= 328; a += 16) pts.push([Math.cos((a * Math.PI) / 180) * 200, Math.sin((a * Math.PI) / 180) * 200]);
  pts.push([40, 20], [40, -20]);
  return G(cx, cy, s,
    layer(poly(pts), "#CF9068", 4) + layer(blob(-60, -10, 110, 100, { jitter: 0.1, n: 10, seed: 4110 }), "#B5724B", 5) + layer(blob(-70, -30, 36, 30, { jitter: 0.1, n: 8, seed: 4111 }), "#E3B08C", 6) +
    `<g id="${id}-plug">` + layer(poly([[48, 0], [190, -96], [350, -96], [350, 96], [190, 96]], { round: false }), C.solution, 7) + layer(poly([[200, -50], [330, -50], [330, 50], [200, 50]], { round: false }), "#A8B58F", 8) + `</g>`, id);
}

// Panier : arrière (poignée) et avant (corps tressé). Repère local : bord supérieur en y=0, fond en y=300.
export function basketBack(C, cx, cy, s = 1, id = "bkb") {
  return G(cx, cy, s, `<g filter="url(#paper2)"><path d="M-300 0 Q0 -520 300 0" fill="none" stroke="#7A4E32" stroke-width="30" stroke-linecap="round"/></g>` + layer(poly([[-370, -10], [370, -10], [350, 40], [-350, 40]], { round: false }), "#5E3A27", 3), id);
}
export function basketFront(C, cx, cy, s = 1, id = "bkf") {
  let weave = "";
  for (let i = 1; i < 6; i++) weave += `<line x1="${-340 + i * 40}" y1="${30 + i * 0}" x2="${-270 + i * 28}" y2="300" stroke="#7A4E32" stroke-width="6" opacity=".6"/>`;
  for (let r = 0; r < 4; r++) weave += `<line x1="-340" y1="${70 + r * 60}" x2="340" y2="${70 + r * 60}" stroke="#7A4E32" stroke-width="6" opacity=".55"/>`;
  return G(cx, cy, s, layer(poly([[-370, 20], [370, 20], [290, 300], [-290, 300]], { round: false }), "#B5724B", 4) + `<g filter="url(#paper1)">${weave}</g>` + layer(poly([[-384, 0], [384, 0], [372, 46], [-372, 46]], { round: false }), "#7A4E32", 5), id);
}

// Ticket de caisse, bord inférieur en dents de scie. (cx, top) = milieu du haut ; w × h.
export function receipt(C, cx, top, w, h, id = "receipt", total = "120,00 €") {
  const x0 = cx - w / 2, pts = [[x0, top], [x0 + w, top]];
  const n = 14; for (let i = 0; i <= n; i++) pts.push([x0 + w - (w * i) / n, top + h + (i % 2 ? 0 : 26)]);
  const rows = [[250, 70], [190, 70], [300, 70], [150, 70], [230, 70], [280, 70], [170, 70]];
  let body = txt(cx, top + 92, 52, C.dark, "CAISSE", 900) + `<g filter="url(#paper1)"><line x1="${x0 + 40}" y1="${top + 130}" x2="${x0 + w - 40}" y2="${top + 130}" stroke="${C.dark}" stroke-width="5" stroke-dasharray="16 12"/></g>`;
  rows.forEach(([bw], i) => {
    const y = top + 190 + i * 78;
    body += layer(poly([[x0 + 48, y], [x0 + 48 + bw, y], [x0 + 48 + bw, y + 28], [x0 + 48, y + 28]], { round: false }), C.dark, 2, { edge: "rgba(0,0,0,0)" }) +
      layer(poly([[x0 + w - 48 - 90, y], [x0 + w - 48, y], [x0 + w - 48, y + 28], [x0 + w - 48 - 90, y + 28]], { round: false }), C.dark, 2, { edge: "rgba(0,0,0,0)" });
  });
  const yt = top + 190 + rows.length * 78 + 20;
  body += `<g filter="url(#paper1)"><line x1="${x0 + 40}" y1="${yt - 30}" x2="${x0 + w - 40}" y2="${yt - 30}" stroke="${C.dark}" stroke-width="5" stroke-dasharray="16 12"/></g>` +
    `<g filter="url(#paper1)"><text x="${x0 + 48}" y="${yt + 50}" font-family="${F}" font-weight="900" font-size="54" fill="${C.dark}">TOTAL</text></g>` + txt(cx, yt + 175, 112, C.alert, total, 900);
  return `<g id="${id}">` + layer(poly(pts, { round: false }), C.cream, 5) + body + `</g>`;
}

export function equals(C, cx, cy, id = "equals") {
  return `<g id="${id}">` + [-28, 28].map((dy) => layer(poly([[cx - 62, cy + dy - 13], [cx + 62, cy + dy - 13], [cx + 62, cy + dy + 13], [cx - 62, cy + dy + 13]], { round: false }), C.alert, 5)).join("") + `</g>`;
}
