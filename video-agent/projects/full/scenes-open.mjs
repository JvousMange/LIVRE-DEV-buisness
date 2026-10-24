// Ouverture : visage qui se marque → main qui frotte puis plongée sur la racine → miroir. Timings calés sur la voix (avec anticipation).
import { layer, poly } from "../../engine/paper.mjs";
import { skin, stain, melanocyte, granuleSpecs, granule, badge, cross, tag, woman, arm, foundation, skinHand, SPOTS, MEL, HAND_BRUSH, HAND_SKIN } from "../../library/components.mjs";
import { A, POP, FADEIN, FADEOUT, DROP, SLOW } from "./kit.mjs";

export function scenesOpen(C, X) {
  const R = (n, p, o) => X.rel(n, p, o);
  const tiles = (x0, x1) => {
    let lines = "";
    for (let y = 0; y <= 1920; y += 120) lines += `<line x1="${x0}" y1="${y}" x2="${x1}" y2="${y}" stroke="${C.kraftDark}" stroke-width="5" opacity=".55"/>`;
    for (let x = x0 + 90; x < x1; x += 90) lines += `<line x1="${x}" y1="0" x2="${x}" y2="1920" stroke="${C.kraftDark}" stroke-width="5" opacity=".55"/>`;
    return layer(poly([[x0, -20], [x1, -20], [x1, 1940], [x0, 1940]], { round: false }), "#D8C2A0", 2) + `<g filter="url(#paper1)">${lines}</g>`;
  };

  return {
    // « Cinq raisons qui font que ton hyperpigmentation ne part pas » — son visage se marque de taches noires.
    hookFace: {
      svg: woman(C),
      anims: SPOTS.map((sp, i) => POP(`sp${i}`, 0.2 + i * 0.2, [sp.x, sp.y])),
      loops: [],
      cam: { from: { s: 1.5, y: 140 }, to: { s: 1.8, y: 200 }, ease: "lin" },
      punches: [{ t: 0.2, amp: 0.03 }],
    },

    // « Un, tu essaies de faire partir tes taches à la surface, alors qu'elles se fabriquent sous ta peau »
    // Un seul plan : la main frotte la tache en surface, puis la caméra plonge jusqu'à sa racine.
    skinRub: (() => {
      const gr = granuleSpecs();
      const tDive = R("skinRub", "alors"), tCross = R("skinRub", "taches"), tTag = R("skinRub", "surface"), tFab = R("skinRub", "fabriquent");
      return {
        svg: skin(C) + stain(C) + melanocyte(C) + gr.map((g) => granule(C, g)).join("") + badge(C, 300, 420, 1) + cross(C, 730, 640, 170) +
          tag(C, 540, 500, 440, 100, "EN SURFACE", { id: "tag1", fontSize: 44, color: C.alert, seed: 5 }) + skinHand(C),
        anims: [
          POP("badge", 0.05, [300, 420]),
          A("hand", 0.1, 0.5, { x: 520, y: -430 }, { x: 0, y: 0 }, { ease: "outCubic", origin: HAND_SKIN }),
          POP("cross", tCross, [730, 640]), POP("tag1", tTag, [540, 500]),
          A("hand", tDive - 0.15, 0.45, { x: 0, y: 0 }, { x: 560, y: -430 }, { ease: "inCubic", origin: HAND_SKIN, late: true }),
          A("mel", tDive, 0.5, { o: 0 }, { o: 1 }, { ease: "lin", origin: MEL }),
          ...gr.flatMap((g, i) => {
            const off = { x: g.from[0] - g.to[0], y: g.from[1] - g.to[1] };
            return [
              A(g.id, tFab + i * 0.06, 0.3, { ...off, s: 0 }, { ...off, s: 1 }, { origin: g.to, ease: "outBack" }),
              A(g.id, tFab + 1.0 + i * 0.025, 0.6, { ...off }, { x: 0, y: 0 }, { origin: g.to, ease: "inOut", late: true }),
            ];
          }),
        ],
        loops: [{ id: "hand", prop: "x", amp: 95, freq: 1.9, start: 0.6, origin: HAND_SKIN }, { id: "mel", prop: "s", amp: 0.035, freq: 1.6, start: tDive + 0.2, origin: MEL }],
        cam: [
          { t0: 0, t1: tDive - 0.2, from: { s: 1.65, y: 110 }, to: { s: 1.55, y: 104 }, ease: "lin" },
          { t0: tDive - 0.2, t1: tDive + 1.0, from: { s: 1.55, y: 104 }, to: { s: 1.5, y: -450 }, ease: "inOut" },
          { t0: tDive + 1.0, t1: X.dur("skinRub"), from: { s: 1.5, y: -450 }, to: { s: 1.6, y: -470 }, ease: "lin" },
        ],
        punches: [{ t: tCross, amp: 0.04 }],
      };
    })(),

    // « Deux, tu les caches, fond de teint, maquillage, mais tu ne les fais pas vraiment partir »
    // On reste sur le miroir : le pinceau couvre, puis le maquillage s'efface et les taches sont toujours là.
    mirror: (() => {
      const tCover = R("mirror", "caches"), tEnd = R("mirror", "mais"), tX = R("mirror", "pas vraiment", -0.1);
      return {
        svg:
          tiles(-10, 160) + tiles(920, 1090) +
          layer(poly([[130, 330], [950, 330], [950, 1500], [130, 1500]], { round: false }), C.kraftDark, 3) +
          `<clipPath id="mclip"><rect x="170" y="370" width="740" height="1090"/></clipPath>` +
          layer(poly([[170, 370], [910, 370], [910, 1460], [170, 1460]], { round: false }), "#E8D0A8", 4) +
          `<g clip-path="url(#mclip)">${woman(C, { cx: 540, cy: 900, scale: 0.95, mirrorOn: false, extras: foundation(C) + arm(C, { tool: "brush" }) })}` +
          `<g opacity=".28" filter="url(#paperS1)"><path d="M170 800 L420 370 L520 370 L170 960Z" fill="#FFFFFF"/></g></g>` +
          badge(C, 205, 275, 2) + cross(C, 790, 650, 190),
        anims: [
          POP("badge", 0.05, [205, 275]),
          A("arm", 0.1, 0.55, { x: 520, y: 320 }, { x: 0, y: 0 }, { ease: "outCubic", origin: HAND_BRUSH }),
          ...SPOTS.map((sp, i) => POP(`pt${i}`, tCover + i * 0.1, [sp.x, sp.y])),
          A("arm", tEnd, 0.6, { x: 0, y: 0 }, { x: 560, y: 320 }, { ease: "inCubic", origin: HAND_BRUSH, late: true }),
          ...SPOTS.map((sp, i) => A(`pt${i}`, tEnd + 0.1 + i * 0.05, 0.45, { o: 1 }, { o: 0 }, { ease: "lin", late: true })),
          POP("cross", tX, [790, 650]),
        ],
        loops: [
          { id: "arm", prop: "x", amp: 14, freq: 1.3, start: 0.7, origin: HAND_BRUSH },
          { id: "arm", prop: "y", amp: 10, freq: 1.3, phase: 0.25, start: 0.7, origin: HAND_BRUSH },
        ],
        cam: { from: { s: 1.12, y: 0 }, to: { s: 1.34, y: 0 }, ease: "lin" },
        punches: [{ t: tX, amp: 0.05 }],
      };
    })(),
  };
}
