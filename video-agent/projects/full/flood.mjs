// « Déluge de taches » : grille de grosses taches noires qui finit par recouvrir tout l'écran (1080×1920).
// Le même ensemble sert à la fin de la raison 5 (il se remplit) et au début du plan suivant (il se retire).
import { layer, blob, rng } from "../../engine/paper.mjs";

export function flood(C, { cols = 6, rows = 9, r = 205 } = {}) {
  const rnd = rng(123), cw = 1080 / cols, ch = 1920 / rows, cells = [];
  for (let rw = 0; rw < rows; rw++) for (let c = 0; c < cols; c++) {
    const i = rw * cols + c;
    cells.push({ id: `fd${i}`, x: (c + 0.5) * cw + (rnd() - 0.5) * cw * 0.4, y: (rw + 0.5) * ch + (rnd() - 0.5) * ch * 0.4, r: r * (0.85 + rnd() * 0.3), seed: 2000 + i });
  }
  const svg = cells.map((p) => `<g id="${p.id}">` + layer(blob(p.x, p.y, p.r, p.r * 0.85, { jitter: 0.22, n: 14, seed: p.seed }), C.dark, 6) +
    layer(blob(p.x - p.r * 0.15, p.y - p.r * 0.1, p.r * 0.55, p.r * 0.38, { jitter: 0.25, n: 10, seed: p.seed + 500 }), "#5E3A27", 6) + `</g>`).join("");
  const order = cells.map((_, i) => i);
  const r2 = rng(9);
  for (let i = order.length - 1; i > 0; i--) { const j = Math.floor(r2() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; }
  return { svg, cells, order };
}
