// Décors alternatifs pour les plans de l'usine. Chacun fournit les ids "surf" (bande de peau) et "surfTint" (sa teinte) ;
// le sol est brun foncé pour que l'usine terracotta et le tuyau crème ressortent.
import { layer, band, blob, poly, rng } from "../engine/paper.mjs";

const top = () => band(-80, 1160, 900, 985, { amp: 7, step: 54, seed: 13 });
const surface = (C) => `<g id="surf">${layer(top(), C.cream, 3)}</g><g id="surfTint">${layer(top(), "#9C6544", 4)}</g>`;
const P = (pts) => poly(pts, { round: false });

// B. Plan technique : papier foncé quadrillé, cotes et tampon.
export function decorB(C) {
  let grid = "";
  for (let x = 0; x <= 1080; x += 90) grid += `<line x1="${x}" y1="990" x2="${x}" y2="2400" stroke="#F1E6D2" stroke-width="2" opacity=".13"/>`;
  for (let y = 1080; y <= 2400; y += 90) grid += `<line x1="0" y1="${y}" x2="1080" y2="${y}" stroke="#F1E6D2" stroke-width="2" opacity=".13"/>`;
  const dim = (x1, x2, y, label) => `<line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" stroke="#F1E6D2" stroke-width="3" opacity=".5" stroke-dasharray="14 10"/>` +
    `<line x1="${x1}" y1="${y - 16}" x2="${x1}" y2="${y + 16}" stroke="#F1E6D2" stroke-width="3" opacity=".5"/><line x1="${x2}" y1="${y - 16}" x2="${x2}" y2="${y + 16}" stroke="#F1E6D2" stroke-width="3" opacity=".5"/>` +
    `<text x="${(x1 + x2) / 2}" y="${y + 44}" text-anchor="middle" font-family="Inter, 'DejaVu Sans', sans-serif" font-weight="700" font-size="30" fill="#F1E6D2" opacity=".55" letter-spacing="3">${label}</text>`;
  return layer(band(-80, 1160, 960, 3000, { amp: 6, seed: 21 }), "#2E2019", 1) + `<g>${grid}${dim(215, 645, 1470, "USINE À PIGMENT")}${dim(742, 742, 1100, "")}</g>` +
    `<g filter="url(#paper1)"><rect x="700" y="1560" width="320" height="86" fill="none" stroke="#F1E6D2" stroke-width="4" opacity=".55"/><text x="860" y="1616" text-anchor="middle" font-family="Inter, 'DejaVu Sans', sans-serif" font-weight="900" font-size="34" fill="#F1E6D2" opacity=".6" letter-spacing="2">PLAN N° 1</text></g>` + surface(C);
}

// C. Diorama : l'usine dans une boîte en carton ouverte, en perspective, éclairée par une lampe.
export function decorC(C) {
  return layer(P([[0, 985], [1080, 985], [1080, 2400], [0, 2400]]), "#3A2214", 1) +
    layer(P([[0, 985], [1080, 985], [950, 1050], [130, 1050]]), "#8A5A3C", 2) +
    layer(P([[0, 985], [130, 1050], [130, 1400], [0, 1980]]), "#7A4E32", 2) + layer(P([[1080, 985], [950, 1050], [950, 1400], [1080, 1980]]), "#7A4E32", 2) +
    layer(P([[130, 1050], [950, 1050], [950, 1400], [130, 1400]]), "#6b4a2a", 2) +
    layer(P([[130, 1400], [950, 1400], [1080, 1980], [0, 1980]]), "#5E3A27", 3) +
    `<g filter="url(#paperS2)"><path d="M540 1050 L360 1400 L720 1400Z" fill="rgba(240,176,82,.2)"/></g>` +
    `<line x1="540" y1="1050" x2="540" y2="1130" stroke="#E8D0A8" stroke-width="5"/>` + layer(blob(540, 1150, 46, 38, { jitter: 0.03, n: 12, seed: 1800 }), C.accent, 5) + surface(C);
}

// D. Caverne : parois rocheuses, stalactites, lanternes ambre et halo derrière l'usine.
export function decorD(C) {
  const r = rng(7);
  const rocks = [];
  for (let i = 0; i < 10; i++) rocks.push(layer(blob(-30 + r() * 120, 1040 + i * 130, 110 + r() * 60, 90 + r() * 40, { jitter: 0.25, n: 12, seed: 1850 + i }), i % 2 ? "#4A2C1C" : "#5E3A27", 3));
  for (let i = 0; i < 10; i++) rocks.push(layer(blob(1110 - r() * 120, 1040 + i * 130, 110 + r() * 60, 90 + r() * 40, { jitter: 0.25, n: 12, seed: 1870 + i }), i % 2 ? "#4A2C1C" : "#5E3A27", 3));
  const stal = [150, 330, 500, 620, 800, 940].map((x, i) => layer(P([[x - 36, 985], [x + 36, 985], [x + (i % 2 ? 6 : -6), 985 + 80 + (i * 47) % 90]]), "#5E3A27", 3)).join("");
  const lamp = (x, y, i) => `<line x1="${x}" y1="985" x2="${x}" y2="${y}" stroke="#E8D0A8" stroke-width="4"/>` + `<g filter="url(#paperS2)"><circle cx="${x}" cy="${y}" r="110" fill="rgba(240,176,82,.18)"/></g>` + layer(blob(x, y + 14, 28, 34, { jitter: 0.04, n: 10, seed: 1900 + i }), C.accent, 6);
  return layer(band(-80, 1160, 960, 3000, { amp: 6, seed: 21 }), "#2B1A10", 1) + `<g filter="url(#paperS2)"><circle cx="470" cy="1260" r="330" fill="rgba(240,176,82,.1)"/></g>` +
    rocks.join("") + stal + lamp(150, 1130, 1) + lamp(560, 1100, 2) + lamp(930, 1150, 3) +
    layer(blob(540, 1960, 700, 120, { jitter: 0.08, n: 14, seed: 1990 }), "#4A2C1C", 2) + surface(C);
}
