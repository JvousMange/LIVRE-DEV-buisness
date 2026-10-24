// Le mécanisme : mélanine, agression, « trop », coincée, peau claire/foncée, des mois, réguler, imaginer, source.
import { hangingSign, layer, band, blob, star, poly, arrowPts } from "../../engine/paper.mjs";
import { skin, stain, melanocyte, granuleSpecs, granule, badge, cross, tag, woman, sun, skinHand, questionMark, SPOTS, MEL, HAND_SKIN } from "../../library/components.mjs";
import { razor, pimple, padlock, calendar, gauge, flame, sparkle, tube, jar, valve, check, shelf } from "../../library/components2.mjs";
import { A, POP, FADEIN, FADEOUT, DROP, SLOW } from "./kit.mjs";

export function scenesB(C, X) {
  const R = (n, p, o) => X.rel(n, p, o);
  const ringAt = (cx, cy, rx, ry, id, w = 14) => `<g id="${id}"><g filter="url(#paper4)"><ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="none" stroke="${C.alert}" stroke-width="${w}"/></g></g>`;

  return {
    // « Le but n'est donc pas d'éclaircir ta peau. »
    whiten: (() => {
      const sw = [[300, "#7C4C33"], [540, "#9C6544"], [780, "#EBC1A0"]];
      return {
        svg:
          sw.map(([x, c], i) => `<g id="sw${i}">` + layer(poly([[x - 100, 430], [x + 100, 430], [x + 100, 630], [x - 100, 630]], { round: false }), c, 4) + `</g>`).join("") +
          `<g id="arr">${layer(poly(arrowPts(180, 700, 900, 700, 36, 100, 90), { round: false }), C.dark, 5)}</g>` + cross(C, 540, 540, 520, "bigx") +
          woman(C, { cy: 1200, scale: 0.85, mirrorOn: false }),
        anims: [
          POP("sw0", 0.05, [300, 530]), POP("sw1", 0.2, [540, 530]), POP("sw2", 0.35, [780, 530]),
          
          A("arr", R("whiten", "d'éclaircir"), 0.6, { s: 0 }, { s: 1 }, { origin: [180, 700], ease: "outCubic" }),
          POP("bigx", R("whiten", "ta peau"), [540, 540]),
        ],
        loops: [],
        cam: SLOW(1.0, 1.06, 0, 0),
      };
    })(),

    // « C'est de réguler ta production de mélanine, pour qu'à chaque agression, ta peau n'en fabrique plus trop
    //   et ne te gâche plus le teint tous les jours. »
    regulate: (() => {
      const tReg = R("regulate", "réguler"), tAgr = R("regulate", "agression"), tDays = R("regulate", "tous les jours");
      return {
        svg: gauge(C, 540, 800, 1.2, "gauge") +
          pimple(C, 160, 460, 1.0, "pim") + razor(C, 930, 440, 0.55, "rz") + check(C, 860, 1100, 200, "ok") +
          Array.from({ length: 7 }, (_, i) => `<g id="d${i}">` + layer(blob(150 + i * 130, 1330, 42, 42, { jitter: 0.04, n: 10, seed: 1200 + i }), C.solution, 5) + `</g>`).join(""),
        anims: [
          
          A("gauge-needle", tReg + 0.15, 1.2, { r: 100 }, { r: 0 }, { ease: "outBack", origin: [0, 0] }),
          POP("pim", tAgr, [160, 460]), POP("rz", tAgr + 0.25, [930, 440]),
          POP("ok", R("regulate", "plus trop"), [860, 1100]),
          ...Array.from({ length: 7 }, (_, i) => POP(`d${i}`, tDays + i * 0.17, [150 + i * 130, 1330])),
        ],
        loops: [{ id: "gauge-needle", prop: "r", amp: 7, freq: 4, start: tAgr, origin: [0, 0] }],
        cam: SLOW(1.0, 1.1, 0, 0),
      };
    })(),

    // « Imagine que tu puisses enfin faire partir ces taches. »
    imagine: {
      svg: woman(C) + sparkle(C, 330, 690, 1.0, "sp_a") + sparkle(C, 770, 720, 0.8, "sp_b"),
      anims: [
        ...SPOTS.map((sp, i) => A(`sp${i}`, R("imagine", "faire partir") + i * 0.07, 0.4, { o: 1 }, { o: 0 }, { ease: "lin", late: true })),
        POP("sp_a", R("imagine", "taches", 0.1), [330, 690]), POP("sp_b", R("imagine", "taches", 0.3), [770, 720]),
      ],
      loops: [],
      cam: SLOW(1.35, 1.65, 130, 190),
    },

    // « Pas avec un produit qui brûle, pas avec un gommage magique, »
    noBurn: {
      svg: tube(C, 280, 840, { s: 1.15, label: "SOIN", id: "tube" }) + flame(C, 280, 440, 1.0, "flame") + cross(C, 280, 840, 220, "x1") +
        jar(C, 780, 920, { s: 1.25, label: "GOMMAGE", id: "jar" }) + sparkle(C, 780, 620, 1.1, "spk1") + sparkle(C, 930, 740, 0.8, "spk2") + cross(C, 780, 920, 230, "x2"),
      anims: [
        DROP("tube", 0.1, [280, 840], -500), POP("flame", R("noBurn", "brûle"), [280, 520]), POP("x1", R("noBurn", "brûle", 0.55), [280, 840]),
        DROP("jar", R("noBurn", "gommage"), [780, 920], -500), POP("spk1", R("noBurn", "magique"), [780, 620]), POP("spk2", R("noBurn", "magique", 0.2), [930, 740]), POP("x2", R("noBurn", "magique", 0.6), [780, 920]),
      ],
      loops: [{ id: "flame", prop: "r", amp: 4, freq: 2.5, start: 0.4, origin: [280, 520] }],
      cam: SLOW(1.0, 1.1, 0, 0),
    },

    // « mais avec une solution qui freine la fabrication de pigment à la source. »
    source: sourceScene(C, R, "source", { cue: "freine", ring: "source" }),
  };
}

// Plan « frein à la source » : granules qui montent dans un tuyau, une vanne se ferme et le flux s'arrête.
export function sourceScene(C, R, name, { cue, ring, extra = "", extraAnims = [], cam }) {
  const X0 = 540, tg = R(name, cue);
  const gran = [];
  for (let k = 0; k < 9; k++) {
    const t = 0.15 + k * 0.38;
    if (t < tg - 0.5) gran.push({ id: `fl${k}`, t });
  }
  const ringAt = (cx, cy, rx, ry, id, w = 14) => `<g id="${id}"><g filter="url(#paper4)"><ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="none" stroke="${C.alert}" stroke-width="${w}"/></g></g>`;
  return {
    svg: skin(C) + valve(C, X0, 1015, "valve", 1.35) + melanocyte(C) +
      gran.map((g) => `<g id="${g.id}">` + layer(blob(X0, 1190, 22, 22, { jitter: 0.1, n: 8, seed: 1300 }), C.problem, 5) + `</g>`).join("") +
      ringAt(MEL[0], MEL[1], 245, 210, "ring", 14) + extra,
    anims: [
      POP("ring", R(name, ring), MEL),
      ...gran.flatMap((g) => [A(g.id, g.t, 0.3, { s: 0 }, { s: 1 }, { origin: [X0, 1190], ease: "outBack" }), A(g.id, g.t, 1.6, { y: 0 }, { y: -290 }, { ease: "lin", origin: [X0, 1190], late: true })]),
      A("valve-gate", tg, 0.45, { x: 230, o: 0 }, { x: 0, o: 1 }, { ease: "outCubic" }),
      A("valve-wheel", tg - 0.1, 0.8, { r: 0 }, { r: 300 }, { ease: "outCubic", origin: [130, 0] }),
      ...extraAnims,
    ],
    loops: [{ id: "mel", prop: "s", amp: 0.04, freq: 2.4, start: 0.2, origin: MEL }],
    cam: cam || { from: { s: 1.6, y: -215 }, to: { s: 1.55, y: -190 }, ease: "lin" },
  };
}
