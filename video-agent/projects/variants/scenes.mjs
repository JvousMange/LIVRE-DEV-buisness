// Variantes proposées : raison 3 (v3a/b/c) et début de la transition « le problème vient d'en dessous » (v8a/b/c).
import { layer, band, blob, poly, arrowPts } from "../../engine/paper.mjs";
import { skin, stain, melanocyte, badge, cross, tag, woman, flush } from "../../library/components.mjs";
import { tube, check, flame, loupe, keyItem, lockPlate, pointer } from "../../library/components2.mjs";
import { A, POP, FADEIN, FADEOUT, DROP, SLOW } from "../full/kit.mjs";

export function scenes(C, X) {
  const R = (n, p, o) => X.rel(n, p, o);
  const dy = (inner, d) => `<g transform="translate(0 ${d})">${inner}</g>`;
  const D = 1100, melY = 1265 + D;
  const sec = (tone, y0) => `<g transform="translate(0 ${y0}) scale(.5)">${skin(C, { tone })}</g><g transform="translate(600 ${y0}) scale(.5)">${skin(C, { tone })}</g>`;

  // Début commun de la transition (descente vers le mélanocyte) : on garde la caméra, on change ce qui précède.
  const descent = (name, tPan) => [
    { t0: 0, t1: tPan, from: { s: 1.3, y: 100 }, to: { s: 1.3, y: 100 }, ease: "lin" },
    { t0: tPan, t1: tPan + 1.7, from: { s: 1.3, y: 100 }, to: { s: 1.35, y: -1897 }, ease: "inOut" },
  ];
  const tail = (name) => ({
    arrow: `<g id="down">${layer(poly(arrowPts(540, 1560, 540, 1960, 60, 150, 130), { round: false }), C.alert, 6)}</g>`,
    arrowAnim: POP("down", R(name, "dessous", -0.2), [540, 1760]),
    agir: tag(C, 540, 2140, 780, 120, "TU PEUX AGIR ICI", { id: "tg3", fontSize: 56, color: C.solution, seed: 7 }),
    agirAnim: POP("tg3", R(name, "agir", -0.1), [540, 2140]),
  });

  return {
    // ───── Raison 3 ─────
    // A. Écran partagé : peau claire en haut (ça marche), peau mate ou noire en bas (ça agresse / rien).
    v3a: {
      svg: woman(C, { tone: "light", hair: "bob", spotsOn: false, cx: 540, cy: 500, scale: 0.62 }) + tube(C, 880, 640, { s: 0.55, label: "SOIN", id: "tubeA" }) + check(C, 780, 330, 150, "chk") +
        layer(band(-60, 1140, 945, 1000, { amp: 8, seed: 3 }), C.kraftDark, 4) +
        woman(C, { cx: 540, cy: 1420, scale: 0.62, extras: flush() }) + tube(C, 880, 1330, { s: 0.55, label: "SOIN", id: "tubeB" }) + cross(C, 880, 1330, 130, "xB") + badge(C, 140, 130, 3),
      anims: [
        POP("badge", 0.1, [140, 130]), DROP("tubeA", R("v3a", "soins"), [880, 640]), POP("chk", R("v3a", "claires"), [780, 330]),
        DROP("tubeB", R("v3a", "sur"), [880, 1330]),
        ...[0, 1, 2].map((i) => FADEIN(`fl${i}`, R("v3a", "agressent") + i * 0.1, 0.35)), ...[0, 1, 2].map((i) => FADEOUT(`fl${i}`, R("v3a", "rien") - 0.1, 0.4)),
        POP("xB", R("v3a", "rien") + 0.1, [880, 1330]),
      ],
      loops: [], cam: SLOW(1.0, 1.05, 0, 0),
    },

    // B. Coupe de peau comparée : le même soin sur peau claire (il pénètre) et sur peau mate ou noire (il agresse).
    v3b: {
      svg: sec("light", 80) + sec("deep", 930) +
        tag(C, 270, 470, 360, 80, "PEAU CLAIRE", { id: "tgA", fontSize: 36, color: C.solution, seed: 3 }) + tag(C, 330, 1290, 520, 80, "MATE OU NOIRE", { id: "tgB", fontSize: 36, color: C.alert, seed: 4 }) +
        tube(C, 700, 330, { s: 0.6, label: "SOIN", id: "tubeA" }) + `<g id="dropA">${layer(blob(700, 470, 26, 34, { jitter: 0.06, n: 8, seed: 70 }), C.cream, 6)}</g>` +
        `<g id="spreadA">${layer(blob(700, 548, 190, 18, { jitter: 0.1, n: 10, seed: 71 }), C.cream, 6)}</g>` + check(C, 880, 700, 150, "chk") +
        tube(C, 700, 1180, { s: 0.6, label: "SOIN", id: "tubeB" }) + `<g id="dropB">${layer(blob(700, 1320, 26, 34, { jitter: 0.06, n: 8, seed: 72 }), C.cream, 6)}</g>` +
        [[330, 1510, 120, 52], [560, 1480, 130, 56], [790, 1510, 120, 52]].map((p, i) => `<g id="fl${i}">${layer(blob(p[0], p[1], p[2], p[3], { jitter: 0.12, n: 10, seed: 920 + i }), "rgba(196,85,47,.72)", 6, { edge: "rgba(0,0,0,0)" })}</g>`).join("") +
        flame(C, 700, 1380, 0.6, "fire") + cross(C, 560, 1560, 170, "xB") + badge(C, 140, 130, 3),
      anims: [
        POP("badge", 0.1, [140, 130]), POP("tgA", 0.2, [270, 470]), DROP("tubeA", R("v3b", "soins", -0.5), [700, 330]),
        A("dropA", R("v3b", "soins"), 0.5, { y: -20, o: 0 }, { y: 70, o: 1 }, { ease: "inCubic" }), FADEOUT("dropA", R("v3b", "soins", 0.55), 0.15),
        POP("spreadA", R("v3b", "soins", 0.55), [700, 548]), POP("chk", R("v3b", "claires"), [880, 700]),
        POP("tgB", R("v3b", "sur"), [330, 1290]), DROP("tubeB", R("v3b", "mate", -0.2), [700, 1180]),
        A("dropB", R("v3b", "mate", 0.2), 0.5, { y: -20, o: 0 }, { y: 70, o: 1 }, { ease: "inCubic" }), FADEOUT("dropB", R("v3b", "mate", 0.75), 0.15),
        ...[0, 1, 2].map((i) => FADEIN(`fl${i}`, R("v3b", "agressent") + i * 0.12, 0.35)), POP("fire", R("v3b", "agressent"), [700, 1380]),
        POP("xB", R("v3b", "rien"), [560, 1560]),
      ],
      loops: [], cam: SLOW(1.0, 1.04, 0, 0),
    },

    // C. Clé et serrure : le soin est une clé taillée pour les peaux claires ; sur une peau mate ou noire elle ne tourne pas.
    v3c: {
      svg: tag(C, 540, 230, 520, 90, "PEAUX CLAIRES", { id: "tgA", fontSize: 42, color: C.solution, seed: 3 }) + lockPlate(C, 540, 470, 800, 360, "#EBC1A0", "plA") + check(C, 324, 470, 160, "chk") + keyItem(C, 716, 441, 1, "keyA", "SOIN") +
        tag(C, 540, 790, 640, 90, "MATE OU NOIRE", { id: "tgB", fontSize: 42, color: C.alert, seed: 4 }) + lockPlate(C, 540, 1050, 800, 360, "#7C4C33", "plB") + keyItem(C, 716, 1021, 1, "keyB", "SOIN") + flame(C, 716, 940, 0.55, "fire") + cross(C, 324, 1050, 180, "xB") + badge(C, 140, 130, 3),
      anims: [
        POP("badge", 0.1, [140, 130]), POP("tgA", 0.15, [540, 230]), POP("plA", 0.25, [540, 470]),
        A("keyA", R("v3c", "soins"), 0.6, { x: 520 }, { x: 0 }, { ease: "outCubic" }), A("keyA", R("v3c", "claires", -0.3), 0.5, { r: 0 }, { r: 90 }, { ease: "outBack", origin: [716, 441] }), POP("chk", R("v3c", "claires"), [324, 470]),
        POP("tgB", R("v3c", "sur"), [540, 790]), POP("plB", R("v3c", "sur", 0.15), [540, 1050]),
        A("keyB", R("v3c", "mate"), 0.6, { x: 520 }, { x: 70 }, { ease: "outCubic" }), POP("fire", R("v3c", "agressent"), [716, 940]), POP("xB", R("v3c", "rien"), [324, 1050]),
      ],
      loops: [{ id: "keyB", prop: "r", amp: 7, freq: 4, start: R("v3c", "mate", 0.7), origin: [716, 1021] }], cam: SLOW(1.0, 1.05, 0, 0),
    },

    // ───── Transition : début du plan (la descente vers les mélanocytes est conservée) ─────
    // A. Une loupe cherche la cause sur elle, ne trouve rien, puis descend sous la peau.
    v8a: (() => {
      const tPan = R("v8a", "mais", -0.15), t = tail("v8a");
      return {
        bgH: 3500,
        svg: woman(C) + cross(C, 540, 1110, 250, "x1") + cross(C, 640, 780, 220, "x2") + dy(skin(C), D) + dy(melanocyte(C), D) + t.arrow + t.agir + loupe(C, 700, 800, 150, "lp"),
        anims: [
          POP("lp", 0.3, [700, 800]),
          A("lp", R("v8a", "toi", -0.2), 0.9, { x: 0 }, { x: -230 }, { ease: "inOut" }), POP("x1", R("v8a", "toi", 0.5), [540, 1110]),
          A("lp", R("v8a", "ta peau", -0.2), 0.9, { x: -230 }, { x: 0 }, { ease: "inOut", late: true }), POP("x2", R("v8a", "ta peau", 0.5), [640, 780]),
          A("lp", tPan + 0.1, 1.7, { x: 0, y: 0 }, { x: -160, y: 1565 }, { ease: "inOut", late: true }),
          t.arrowAnim, t.agirAnim,
        ],
        loops: [], cam: descent("v8a", tPan),
      };
    })(),

    // B. Deux doigts accusateurs la désignent : « pas de toi », « pas de ta peau » ; puis on descend.
    v8b: (() => {
      const tPan = R("v8b", "mais", -0.15), t = tail("v8b");
      return {
        bgH: 3500,
        svg: woman(C) + pointer(C, 300, 980, -1, "pL") + pointer(C, 780, 980, 1, "pR") + cross(C, 200, 560, 160, "xL") + cross(C, 880, 560, 160, "xR") + dy(skin(C), D) + dy(melanocyte(C), D) + t.arrow + t.agir,
        anims: [
          A("pL", R("v8b", "toi", -0.35), 0.5, { x: -520 }, { x: 0 }, { ease: "outBack" }), POP("xL", R("v8b", "toi", 0.35), [200, 560]),
          A("pR", R("v8b", "ta peau", -0.35), 0.5, { x: 520 }, { x: 0 }, { ease: "outBack" }), POP("xR", R("v8b", "ta peau", 0.35), [880, 560]),
          A("pL", tPan - 0.2, 0.5, { x: 0 }, { x: -520 }, { ease: "inCubic", late: true }), A("pR", tPan - 0.2, 0.5, { x: 0 }, { x: 520 }, { ease: "inCubic", late: true }),
          t.arrowAnim, t.agirAnim,
        ],
        loops: [], cam: descent("v8b", tPan),
      };
    })(),

    // C. Mauvaise herbe : on ne voit que les feuilles en surface ; la racine est dessous (plus de femme ni de panneaux).
    v8c: (() => {
      const tPan = R("v8c", "mais", -0.15), t = tail("v8c");
      const leaf = (x, y, rot, id, s = 1) => `<g id="${id}"><g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">${layer("M0 0 Q-70 -80 -26 -200 Q40 -130 0 0Z", C.problem, 5)}</g></g>`;
      const roots = [[430, 52], [540, 74], [650, 52], [490, 38], [600, 38]].map(([x, w], i) => layer(poly([[x - w / 2, 925], [x + w / 2, 925], [x + (i % 2 ? 22 : -22), 1230]], { round: false }), C.problem, 4)).join("");
      return {
        svg: skin(C) + `<g id="roots">${roots}</g>` + stain(C) + leaf(450, 880, -25, "l1", 1) + leaf(540, 870, 0, "l2", 1.25) + leaf(640, 880, 25, "l3", 1) +
          tag(C, 420, 560, 380, 90, "SURFACE", { id: "tgS", fontSize: 44, color: C.alert, seed: 5 }) + tag(C, 400, 1080, 340, 90, "RACINE", { id: "tgR", fontSize: 44, color: C.alert, seed: 6 }) + melanocyte(C),
        anims: [
          POP("stain", 0.15, [540, 905]), POP("l1", 0.45, [450, 880]), POP("l2", 0.6, [540, 870]), POP("l3", 0.75, [640, 880]),
          POP("tgS", R("v8c", "toi"), [420, 560]), FADEIN("mel", tPan + 0.1, 0.6),
          POP("roots", tPan + 0.2, [540, 925]), POP("tgR", tPan + 0.6, [400, 1080]),
        ],
        loops: [],
        cam: [
          { t0: 0, t1: tPan, from: { s: 1.65, y: 110 }, to: { s: 1.5, y: 104 }, ease: "lin" },
          { t0: tPan, t1: tPan + 1.7, from: { s: 1.5, y: 104 }, to: { s: 1.5, y: -450 }, ease: "inOut" },
        ],
      };
    })(),
  };
}
