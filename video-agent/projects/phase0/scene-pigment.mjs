// Phase 0 — scène « le trajet d'une tache » : UV → mélanocyte → granules → tache en surface.
import { readFileSync } from "node:fs";
import { defs, kraftBackground, finish, layer, band, blob, star, poly, arrowPts, hangingSign, rng } from "../../engine/paper.mjs";

const brand = JSON.parse(readFileSync(new URL("../../brands/mela-skin/brand.json", import.meta.url)));
const C = brand.palette;
const W = 1080, H = 1920;

export function scene() {
  const r = rng(42);
  const parts = [];

  // --- Coupe de peau, du plus profond au plus proche ---
  parts.push(layer(band(-60, W + 60, 1330, H + 80, { amp: 14, seed: 11 }), C.skinDeep, 1, { id: "dermis" }));

  // fibres de collagène ondulées + capillaires dans le derme
  for (let i = 0; i < 6; i++) {
    const y = 1450 + i * 72, x = -40 + r() * 420;
    parts.push(layer(band(x, x + 420 + r() * 380, y, y + 20, { amp: 16, step: 36, seed: 20 + i }), "#C79A74", 2, { id: `fiber${i}` }));
  }
  for (let i = 0; i < 5; i++) {
    const x = 120 + i * 210 + r() * 50, y = 1560 + r() * 240;
    parts.push(layer(blob(x, y, 30, 30, { jitter: 0.1, n: 9, seed: 300 + i }), C.alert, 3));
    parts.push(layer(blob(x, y, 13, 13, { jitter: 0.1, n: 8, seed: 320 + i }), "#7A2E1A", 4));
  }

  parts.push(layer(band(-60, W + 60, 1010, 1380, { amp: 16, seed: 12 }), C.skinLight, 2, { id: "epidermis" }));

  // couche basale : rangée de cellules
  for (let x = 10; x < W + 60; x += 96) {
    parts.push(layer(blob(x + 46, 1330, 42, 38, { jitter: 0.1, n: 9, seed: x }), "#B5724B", 3));
  }

  // cellules de l'épiderme (briques décalées)
  for (let row = 0; row < 2; row++) {
    for (let x = row ? 70 : 20; x < W; x += 104) {
      parts.push(layer(blob(x + 40, 1100 + row * 78, 40, 30, { jitter: 0.1, n: 9, seed: x * 7 + row }), "#CF9068", 2));
    }
  }

  // couche cornée en surface
  parts.push(layer(band(-60, W + 60, 920, 1030, { amp: 9, step: 54, seed: 13 }), C.cream, 3, { id: "corneum" }));
  for (let i = 0; i < 9; i++) {
    const x = 70 + i * 120 + r() * 30;
    parts.push(layer(blob(x, 912, 36, 11, { seed: 60 + i }), C.cream, 2));
  }

  // --- Mélanocyte (gros plan lisible) ---
  parts.push(layer(star(540, 1265, 170, 74, 8, { seed: 7 }), C.problem, 4, { id: "melanocyte", edge: "rgba(255,230,200,.35)" }));
  parts.push(layer(blob(540, 1265, 58, 58, { seed: 9 }), C.cream, 5, { id: "nucleus" }));
  parts.push(layer(blob(540, 1265, 20, 20, { seed: 10 }), C.alert, 6));

  // --- Granules : un vrai flux en S vers la surface ---
  for (let i = 0; i < 16; i++) {
    const t = i / 15;
    const x = 540 + Math.sin(t * 6.0) * 120 * (1 - t * 0.25) + (r() - 0.5) * 22;
    const y = 1150 - t * 215 + (r() - 0.5) * 10;
    const rad = 16 + r() * 10;
    parts.push(layer(blob(x, y, rad, rad * 0.92, { jitter: 0.12, n: 8, seed: 100 + i }), C.problem, 5, { id: `granule${i}` }));
  }

  // --- La tache en surface (empilement de couches) ---
  parts.push(layer(blob(540, 905, 230, 34, { jitter: 0.2, n: 14, seed: 77 }), C.problem, 4, { id: "stain" }));
  parts.push(layer(blob(520, 890, 150, 22, { jitter: 0.22, n: 12, seed: 78 }), "#5E3A27", 5));
  parts.push(layer(blob(820, 902, 50, 15, { jitter: 0.2, n: 9, seed: 79 }), C.problem, 4));
  parts.push(layer(blob(250, 904, 36, 12, { jitter: 0.2, n: 9, seed: 80 }), C.problem, 4));

  // --- Soleil et rayons UV ---
  const sunX = 830, sunY = 330;
  parts.push(layer(star(sunX, sunY, 190, 138, 14, { seed: 5, jitter: 0.04 }), C.alert, 2, { id: "rays", edge: "rgba(255,230,190,.4)" }));
  parts.push(layer(blob(sunX, sunY, 108, 108, { jitter: 0.03, n: 16, seed: 6 }), C.accent, 4, { id: "sun" }));
  parts.push(layer(blob(sunX - 26, sunY - 28, 40, 40, { jitter: 0.1, n: 10, seed: 8 }), "#F2C56A", 5));

  // flèche UV : du soleil vers la tache
  parts.push(layer(poly(arrowPts(770, 560, 620, 800, 44, 118, 120), { round: false }), C.alert, 5, { id: "arrow" }));

  // --- Panneau suspendu ---
  parts.push(hangingSign(300, 250, 470, 190, ["MÉLANINE"], { palette: C, fontSize: 84, seed: 4 }));

  const bg = kraftBackground(W, H, C, 5);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">${defs()}${bg}${parts.join("")}${finish(W, H)}</svg>`;
}
