// Scènes de la phase 1 : 8 plans, un cadrage et une idée différents par phrase.
// Chaque scène : { svg, anims, loops, cam }. Les ids sont préfixés par plan au build.
import { hangingSign, layer, blob, poly } from "../../engine/paper.mjs";
import {
  skin, stain, melanocyte, granuleSpecs, granule, questionMark, tag, badge, cross,
  woman, arm, foundation, SPOTS, MEL, HAND_CLOTH, HAND_BRUSH,
} from "../../library/components.mjs";

const A = (id, t0, dur, from, to, o = {}) => ({ id, t0, dur, from, to, ...o });
const POP = (id, t0, origin, o = {}) => A(id, t0, 0.5, { s: 0 }, { s: 1 }, { origin, ease: "outBack", ...o });
const HAND = HAND_CLOTH;                       // origine locale de la main (gant)
const BADGE = [250, 470];

export function scenes(C) {
  const popSpots = (t0, step) => SPOTS.map((sp, i) => POP(`sp${i}`, t0 + i * step, [sp.x, sp.y]));
  const armIn = (t0) => A("arm", t0, 0.5, { x: 520, y: 320 }, { x: 0, y: 0 }, { ease: "outCubic", origin: HAND });
  const rub = (start, ax = 22, ay = 16, f = 1.7) => [
    { id: "arm", prop: "x", amp: ax, freq: f, start, origin: HAND },
    { id: "arm", prop: "y", amp: ay, freq: f, phase: 0.25, start, origin: HAND },
  ];

  // Carrelage de salle de bain : deux bandes de chaque côté du miroir.
  const tiles = (x0, x1) => {
    let lines = "";
    for (let y = 0; y <= 1920; y += 120) lines += `<line x1="${x0}" y1="${y}" x2="${x1}" y2="${y}" stroke="${C.kraftDark}" stroke-width="5" opacity=".55"/>`;
    for (let x = x0 + 90; x < x1; x += 90) lines += `<line x1="${x}" y1="0" x2="${x}" y2="1920" stroke="${C.kraftDark}" stroke-width="5" opacity=".55"/>`;
    return layer(poly([[x0, -20], [x1, -20], [x1, 1940], [x0, 1940]], { round: false }), "#D8C2A0", 2) + `<g filter="url(#paper1)">${lines}</g>`;
  };

  return {
    // 1. « Cinq raisons qui font que ton hyperpigmentation ne part pas » — on démarre directement sur la peau.
    skinHook: {
      svg: skin(C) + stain(C) + questionMark(C, 540, 740, 400),
      anims: [
        POP("stain", 0.2, [540, 905]),
        POP("qmark", 1.1, [540, 600], { from: { s: 0, r: -22 }, to: { s: 1, r: 0 } }),
      ],
      loops: [{ id: "qmark", prop: "r", amp: 3, freq: 0.5, start: 1.8, origin: [540, 600] }],
      cam: { from: { s: 1.6, y: 108 }, to: { s: 1.4, y: 100 } },
    },

    // 2. « Un, tu essaies de faire partir tes taches à la surface » — elle frotte sa joue avec un gant.
    scrub: {
      svg: woman(C, { extras: arm(C, { tool: "cloth" }) }) + badge(C, BADGE[0], BADGE[1], 1) + cross(C, 820, 520, 190) +
        tag(C, 600, 330, 440, 100, "EN SURFACE", { id: "tag1", fontSize: 44, color: C.alert, seed: 5 }),
      anims: [POP("badge", 0.1, BADGE), armIn(0.4), POP("cross", 2.2, [820, 520]), POP("tag1", 2.45, [600, 330])],
      loops: rub(1.0),
      cam: { from: { s: 1.45, y: 110 }, to: { s: 1.3, y: 100 } },
    },

    // 3. « …se fabriquent sous ta peau » — plongée sur le mélanocyte, les granules sortent.
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

    // 4. « Deux, tu les caches, fond de teint, maquillage » — gros plan sur son reflet : le pinceau couvre les taches.
    mirror: {
      svg:
        tiles(-10, 160) + tiles(920, 1090) +
        layer(poly([[130, 330], [950, 330], [950, 1500], [130, 1500]], { round: false }), C.kraftDark, 3) +
        `<clipPath id="mclip"><rect x="170" y="370" width="740" height="1090"/></clipPath>` +
        layer(poly([[170, 370], [910, 370], [910, 1460], [170, 1460]], { round: false }), "#E8D0A8", 4) +
        `<g clip-path="url(#mclip)">${woman(C, { cx: 540, cy: 900, scale: 0.95, mirrorOn: false, extras: foundation(C) + arm(C, { tool: "brush" }) })}` +
        `<g opacity=".28" filter="url(#paperS1)"><path d="M170 800 L420 370 L520 370 L170 960Z" fill="#FFFFFF"/></g></g>` +
        badge(C, 205, 275, 2),
      anims: [
        POP("badge", 0.1, [205, 275]),
        A("arm", 0.4, 0.55, { x: 520, y: 320 }, { x: 0, y: 0 }, { ease: "outCubic", origin: HAND_BRUSH }),
        ...SPOTS.map((sp, i) => POP(`pt${i}`, 1.0 + i * 0.12, [sp.x, sp.y])),
      ],
      loops: [
        { id: "arm", prop: "x", amp: 14, freq: 1.3, start: 1.0, origin: HAND_BRUSH },
        { id: "arm", prop: "y", amp: 10, freq: 1.3, phase: 0.25, start: 1.0, origin: HAND_BRUSH },
      ],
      cam: { from: { s: 1.12, y: 0 }, to: { s: 1.28, y: 0 } },
    },

    // 5. « …mais tu ne les fais pas vraiment partir » — le maquillage s'efface, les taches sont toujours là.
    reveal: {
      svg: woman(C, { extras: foundation(C) + arm(C, { tool: "brush" }) }) + badge(C, BADGE[0], BADGE[1], 2) + cross(C, 820, 520, 190),
      anims: [
        A("arm", 0.45, 0.6, { x: 0, y: 0 }, { x: 560, y: 320 }, { ease: "inCubic", origin: HAND_BRUSH }),
        ...SPOTS.map((sp, i) => A(`pt${i}`, 0.5 + i * 0.06, 0.5, { o: 1 }, { o: 0 }, { ease: "lin" })),
        POP("cross", 1.55, [820, 520]),
      ],
      loops: [],
      cam: { from: { s: 1.4, y: 110 }, to: { s: 1.3, y: 100 } },
    },
  };
}
