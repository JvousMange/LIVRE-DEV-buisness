// Scènes de la phase 1 : 8 plans, un cadrage et une idée différents par phrase.
// Chaque scène : { svg, anims, loops, cam }. Les ids sont préfixés par plan au build.
import { hangingSign, layer, blob, poly } from "../../engine/paper.mjs";
import {
  skin, stain, melanocyte, granuleSpecs, granule, questionMark, tag, badge, cross, sponge,
  woman, arm, foundation, SPOTS, MEL, foundationBottle, compact, brush,
} from "../../library/components.mjs";

const A = (id, t0, dur, from, to, o = {}) => ({ id, t0, dur, from, to, ...o });
const POP = (id, t0, origin, o = {}) => A(id, t0, 0.5, { s: 0 }, { s: 1 }, { origin, ease: "outBack", ...o });
const HAND = [122, 104];                       // origine locale de la main
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
    // 1. « Cinq raisons qui font » — le panneau et cinq pastilles numérotées qui se posent.
    hookDots: {
      svg: `<g id="sign">${hangingSign(540, 430, 780, 230, ["5 RAISONS"], { palette: C, fontSize: 108, seed: 4 })}</g>` +
        [1, 2, 3, 4, 5].map((n) => badge(C, 140 + (n - 1) * 200, 960, n, `nb${n}`, C.problem)).join(""),
      anims: [
        A("sign", 0.05, 0.6, { y: -700 }, { y: 0 }, { ease: "outBack", origin: [540, 0] }),
        ...[1, 2, 3, 4, 5].map((n) => POP(`nb${n}`, 0.28 + (n - 1) * 0.1, [140 + (n - 1) * 200, 960])),
      ],
      loops: [{ id: "sign", prop: "r", amp: 1.2, freq: 0.7, start: 0.7, origin: [540, 0] }],
      cam: { from: { s: 1.25, y: 0 }, to: { s: 1.0, y: 0 } },
    },

    // 2. « …ton hyperpigmentation ne part pas » — gros plan serré, les taches apparaissent.
    hookWoman: {
      svg: woman(C) + questionMark(C, 770, 640, 260),
      anims: [...popSpots(0.1, 0.09), POP("qmark", 1.2, [770, 550], { from: { s: 0, r: -25 }, to: { s: 1, r: 0 } })],
      loops: [],
      cam: { from: { s: 1.85, y: 215 }, to: { s: 1.6, y: 170 } },
    },

    // 3. « Un, tu essaies de faire partir tes taches » — elle frotte sa joue.
    scrub: {
      svg: woman(C, { extras: arm(C) }) + badge(C, BADGE[0], BADGE[1], 1) + cross(C, 820, 520, 190),
      anims: [POP("badge", 0.1, BADGE), armIn(0.3), POP("cross", 1.85, [820, 520])],
      loops: rub(0.8),
      cam: { from: { s: 1.45, y: 110 }, to: { s: 1.3, y: 100 } },
    },

    // 4. « …à la surface » — coupe de peau : l'éponge frotte la tache en surface, ça ne change rien.
    surface: {
      svg: skin(C) + stain(C) + sponge(C, 540, 835) + cross(C, 730, 640, 170),
      anims: [
        A("sponge", 0.05, 0.35, { y: -330 }, { y: 0 }, { ease: "outCubic", origin: [540, 835] }),
        POP("cross", 0.6, [730, 640]),
      ],
      loops: [{ id: "sponge", prop: "x", amp: 120, freq: 2.2, start: 0.35, origin: [540, 835] }],
      cam: { from: { s: 1.7, y: 108 }, to: { s: 1.5, y: 100 } },
    },

    // 5. « …se fabriquent sous ta peau » — plongée sur le mélanocyte, les granules sortent.
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

    // 6. « Deux, tu les caches » — son reflet dans le miroir : le fond de teint recouvre les taches.
    mirror: {
      svg:
        tiles(-10, 190) + tiles(890, 1090) +
        layer(poly([[190, 380], [890, 380], [890, 1370], [190, 1370]], { round: false }), C.kraftDark, 3) +
        `<clipPath id="mclip"><rect x="225" y="415" width="630" height="920"/></clipPath>` +
        layer(poly([[225, 415], [855, 415], [855, 1335], [225, 1335]], { round: false }), "#E8D0A8", 4) +
        `<g clip-path="url(#mclip)">${woman(C, { cx: 540, cy: 860, scale: 0.84, mirrorOn: false, extras: foundation(C) + arm(C) })}` +
        `<g opacity=".28" filter="url(#paperS1)"><path d="M225 760 L430 415 L520 415 L225 900Z" fill="#FFFFFF"/></g></g>` +
        badge(C, 150, 260, 2),
      anims: [
        POP("badge", 0.1, [150, 260]),
        armIn(0.15),
        ...SPOTS.map((sp, i) => POP(`pt${i}`, 0.5 + i * 0.07, [sp.x, sp.y])),
      ],
      loops: rub(0.7, 18, 12, 2),
      cam: { from: { s: 1.0, y: 0 }, to: { s: 1.12, y: 0 } },
    },

    // 7. « fond de teint, maquillage » — nature morte vue de dessus, les objets se posent sur les mots.
    props: {
      svg:
        brush(C, 790, 470, 38, 1.3) + foundationBottle(C, 300, 830, 1.5) + compact(C, 740, 1010, 1.3) +
        tag(C, 300, 1130, 470, 100, "FOND DE TEINT", { id: "tag1", fontSize: 40, color: C.alert, seed: 5 }) +
        tag(C, 740, 1255, 420, 100, "MAQUILLAGE", { id: "tag2", fontSize: 40, color: C.alert, seed: 6 }),
      anims: [
        A("fbottle", 0.05, 0.5, { y: -500, r: -12 }, { y: 0, r: 0 }, { ease: "outBack", origin: [300, 830] }),
        POP("tag1", 0.3, [300, 1130]),
        A("compact", 0.85, 0.5, { y: -500, r: 20 }, { y: 0, r: 0 }, { ease: "outBack", origin: [740, 1010] }),
        A("brush", 1.05, 0.5, { x: 400, y: -300 }, { x: 0, y: 0 }, { ease: "outBack", origin: [790, 470] }),
        POP("tag2", 1.15, [740, 1255]),
      ],
      loops: [],
      cam: { from: { s: 1.0, y: 0 }, to: { s: 1.1, y: 0 } },
    },

    // 8. « …mais tu ne les fais pas vraiment partir » — le maquillage s'efface, les taches sont toujours là.
    reveal: {
      svg: woman(C, { extras: foundation(C) + arm(C) }) + badge(C, BADGE[0], BADGE[1], 2) + cross(C, 820, 520, 190),
      anims: [
        A("arm", 0.45, 0.6, { x: 0, y: 0 }, { x: 560, y: 320 }, { ease: "inCubic", origin: HAND }),
        ...SPOTS.map((sp, i) => A(`pt${i}`, 0.5 + i * 0.06, 0.5, { o: 1 }, { o: 0 }, { ease: "lin" })),
        POP("cross", 1.55, [820, 520]),
      ],
      loops: [],
      cam: { from: { s: 1.4, y: 110 }, to: { s: 1.3, y: 100 } },
    },
  };
}
