// Scènes de la phase 1. Chaque scène : { svg, anims, loops, cam }. Les ids sont préfixés par beat au build.
import { hangingSign } from "../../engine/paper.mjs";
import { skin, stain, melanocyte, granuleSpecs, granule, sun, questionMark, tag, badge, cross, sponge, coverPatch, MEL } from "../../library/components.mjs";

const A = (id, t0, dur, from, to, o = {}) => ({ id, t0, dur, from, to, ...o });
const POP = (id, t0, origin, o = {}) => A(id, t0, 0.5, { s: 0 }, { s: 1 }, { origin, ease: "outBack", ...o });

export function scenes(C) {
  const tagFond = () => tag(C, 540, 760, 540, 110, "FOND DE TEINT", { id: "tag1", fontSize: 46, color: C.alert, seed: 5 });
  const tagMaq = () => tag(C, 540, 630, 540, 110, "MAQUILLAGE", { id: "tag2", fontSize: 46, color: C.alert, seed: 6 });

  return {
    // Hook : « Cinq raisons… »
    hook: {
      svg: skin(C) + stain(C) + `<g id="sign">${hangingSign(470, 300, 520, 190, ["5 RAISONS"], { palette: C, fontSize: 72, seed: 4 })}</g>` + questionMark(C, 730, 880, 380),
      anims: [
        POP("stain", 0.1, [540, 905]),
        A("sign", 0.3, 0.8, { y: -520 }, { y: 0 }, { ease: "outBack", origin: [470, 0] }),
        POP("qmark", 1.1, [730, 735], { from: { s: 0, r: -25 }, to: { s: 1, r: 0 } }),
      ],
      loops: [{ id: "sign", prop: "r", amp: 1.6, freq: 0.6, start: 1.0, origin: [470, 0] }],
      cam: { from: { s: 1.8, y: 112 }, to: { s: 1.5, y: 100 } },
    },

    // Raison 1 : on frotte la surface.
    scrub: {
      svg: skin(C) + stain(C) + badge(C, 290, 380, 1) + sponge(C, 540, 835) + cross(C, 730, 640, 170),
      anims: [
        POP("badge", 0.1, [290, 380]),
        A("sponge", 0.35, 0.5, { y: -330 }, { y: 0 }, { ease: "outCubic", origin: [540, 840] }),
        POP("cross", 2.0, [730, 640]),
      ],
      loops: [{ id: "sponge", prop: "x", amp: 120, freq: 1.4, start: 0.85, origin: [540, 840] }],
      cam: { from: { s: 1.7, y: 108 }, to: { s: 1.5, y: 100 } },
    },

    // « … elles se fabriquent sous ta peau » : plongée sur le mélanocyte, les granules sortent.
    make: (() => {
      const gr = granuleSpecs();
      return {
        svg: skin(C) + stain(C) + melanocyte(C) + gr.map((g) => granule(C, g)).join(""),
        anims: gr.map((g, i) => {
          const off = { x: g.from[0] - g.to[0], y: g.from[1] - g.to[1] };
          return A(g.id, 0.3 + i * 0.065, 0.3, { ...off, s: 0 }, { ...off, s: 1 }, { origin: g.to, ease: "outBack" });
        }),
        loops: [{ id: "mel", prop: "s", amp: 0.035, freq: 1.6, start: 0, origin: MEL }],
        cam: { from: { s: 1.0, y: 0 }, to: { s: 1.3, y: -390 }, ease: "inOut" },
      };
    })(),

    // Raison 2 : on cache la tache.
    cover: {
      svg: skin(C) + stain(C) + badge(C, 290, 380, 2) + coverPatch(C) + tagFond() + tagMaq(),
      anims: [
        POP("badge", 0.1, [290, 380]),
        A("patch", 0.9, 0.75, { x: -900 }, { x: 0 }, { ease: "outCubic", origin: [540, 893] }),
        POP("tag1", 1.85, [540, 760]),
        POP("tag2", 2.65, [540, 630]),
      ],
      loops: [],
      cam: { from: { s: 1.5, y: 100 }, to: { s: 1.6, y: 104 } },
    },

    // « … mais tu ne les fais pas vraiment partir » : le fond de teint glisse, la tache est toujours là.
    reveal: {
      svg: skin(C) + stain(C) + badge(C, 290, 380, 2) + tagFond() + tagMaq() + coverPatch(C) + cross(C, 730, 440, 170),
      anims: [
        A("patch", 0.7, 0.7, { x: 0, r: 0 }, { x: 900, r: 8 }, { ease: "inCubic", origin: [540, 893] }),
        POP("cross", 1.55, [730, 440]),
      ],
      loops: [],
      cam: { from: { s: 1.6, y: 104 }, to: { s: 1.5, y: 100 } },
    },
  };
}
