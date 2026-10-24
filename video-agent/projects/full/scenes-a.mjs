// Raisons 3 à 5 et transition « le problème vient d'en dessous ».
import { layer, band, blob, poly, arrowPts } from "../../engine/paper.mjs";
import { skin, melanocyte, badge, cross, tag, woman, flush, sun, SPOTS } from "../../library/components.mjs";
import { tube, jar, razor, shield2, shelf, check, flame, loupe } from "../../library/components2.mjs";
import { A, POP, FADEIN, FADEOUT, DROP, SLOW } from "./kit.mjs";
import { flood } from "./flood.mjs";

export function scenesA(C, X) {
  const R = (n, p, o) => X.rel(n, p, o);
  const dy = (inner, d) => `<g transform="translate(0 ${d})">${inner}</g>`;
  const sec = (tone, y0) => `<g transform="translate(0 ${y0}) scale(.5)">${skin(C, { tone })}</g><g transform="translate(600 ${y0}) scale(.5)">${skin(C, { tone })}</g>`;

  return {
    // « Trois, la plupart des soins sont pensés pour des peaux claires. Sur une peau mate ou noire, ils agressent, ou ils ne font rien. »
    // Coupe de peau comparée : le même soin sur peau claire (il pénètre) et sur peau mate ou noire (il agresse).
    soinPeau: {
      svg: sec("light", 80) + sec("deep", 930) +
        tag(C, 270, 470, 360, 80, "PEAU CLAIRE", { id: "tgA", fontSize: 36, color: C.solution, seed: 3 }) + tag(C, 330, 1290, 520, 80, "MATE OU NOIRE", { id: "tgB", fontSize: 36, color: C.alert, seed: 4 }) +
        tube(C, 700, 330, { s: 0.6, label: "SOIN", id: "tubeA" }) + `<g id="dropA">${layer(blob(700, 470, 26, 34, { jitter: 0.06, n: 8, seed: 70 }), C.cream, 6)}</g>` +
        `<g id="spreadA">${layer(blob(700, 548, 190, 18, { jitter: 0.1, n: 10, seed: 71 }), C.cream, 6)}</g>` + check(C, 880, 700, 150, "chk") +
        tube(C, 700, 1180, { s: 0.6, label: "SOIN", id: "tubeB" }) + `<g id="dropB">${layer(blob(700, 1320, 26, 34, { jitter: 0.06, n: 8, seed: 72 }), C.cream, 6)}</g>` +
        [[330, 1510, 120, 52], [560, 1480, 130, 56], [790, 1510, 120, 52]].map((p, i) => `<g id="fl${i}">${layer(blob(p[0], p[1], p[2], p[3], { jitter: 0.12, n: 10, seed: 920 + i }), "rgba(196,85,47,.72)", 6, { edge: "rgba(0,0,0,0)" })}</g>`).join("") +
        flame(C, 700, 1380, 0.6, "fire") + cross(C, 560, 1560, 170, "xB") + badge(C, 140, 130, 3),
      anims: [
        POP("badge", 0.1, [140, 130]), POP("tgA", 0.2, [270, 470]), DROP("tubeA", R("soinPeau", "soins", -0.5), [700, 330]),
        A("dropA", R("soinPeau", "soins"), 0.5, { y: -20, o: 0 }, { y: 70, o: 1 }, { ease: "inCubic" }), FADEOUT("dropA", R("soinPeau", "soins", 0.55), 0.15),
        POP("spreadA", R("soinPeau", "soins", 0.55), [700, 548]), POP("chk", R("soinPeau", "claires"), [880, 700]),
        POP("tgB", R("soinPeau", "sur"), [330, 1290]), DROP("tubeB", R("soinPeau", "mate", -0.2), [700, 1180]),
        A("dropB", R("soinPeau", "mate", 0.2), 0.5, { y: -20, o: 0 }, { y: 70, o: 1 }, { ease: "inCubic" }), FADEOUT("dropB", R("soinPeau", "mate", 0.75), 0.15),
        ...[0, 1, 2].map((i) => FADEIN(`fl${i}`, R("soinPeau", "agressent") + i * 0.12, 0.35)), POP("fire", R("soinPeau", "agressent"), [700, 1380]),
        POP("xB", R("soinPeau", "rien"), [560, 1560]),
      ],
      loops: [], cam: SLOW(1.0, 1.04, 0, 0),
    },

  };
}
