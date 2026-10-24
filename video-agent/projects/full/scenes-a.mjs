// Raisons 3 à 5 et « le problème vient d'en dessous ».
import { layer, blob, poly, arrowPts } from "../../engine/paper.mjs";
import { skin, melanocyte, badge, cross, tag, woman, flush, sun, SPOTS, MEL } from "../../library/components.mjs";
import { tube, jar, razor, shield2, shelf, check } from "../../library/components2.mjs";
import { A, POP, FADEIN, FADEOUT, DROP, SLOW } from "./kit.mjs";

export function scenesA(C, X) {
  const R = (n, p, o) => X.rel(n, p, o);
  const dy = (inner, d) => `<g transform="translate(0 ${d})">${inner}</g>`;

  return {
    // « Trois, la plupart des soins sont pensés pour des peaux claires. »
    lightSoin: {
      svg: woman(C, { tone: "light", hair: "bob", spotsOn: false }) + badge(C, 170, 250, 3) + tube(C, 880, 1010, { s: 0.85, label: "SOIN", id: "tube" }) + check2(C),
      anims: [POP("badge", 0.1, [170, 250]), DROP("tube", R("lightSoin", "soins"), [880, 1010]), POP("check", R("lightSoin", "claires"), [800, 620])],
      loops: [],
      cam: SLOW(1.25, 1.15, 70, 60),
    },

    // « Sur une peau mate ou noire, ils agressent, ou ils ne font rien. »
    darkSoin: {
      svg: woman(C, { extras: flush() }) + badge(C, 170, 250, 3) + tube(C, 880, 1010, { s: 0.85, label: "SOIN", id: "tube" }) + cross(C, 880, 1010, 200),
      anims: [
        ...[0, 1, 2].map((i) => FADEIN(`fl${i}`, R("darkSoin", "agressent") + i * 0.12, 0.35)),
        ...[0, 1, 2].map((i) => FADEOUT(`fl${i}`, R("darkSoin", "rien") - 0.1, 0.4)),
        POP("cross", R("darkSoin", "rien") + 0.1, [880, 1010]),
      ],
      loops: [{ id: "fl0", prop: "s", amp: 0.06, freq: 3, start: R("darkSoin", "agressent"), origin: [-98, 78] }, { id: "fl1", prop: "s", amp: 0.06, freq: 3, start: R("darkSoin", "agressent"), origin: [98, 74] }],
      cam: SLOW(1.25, 1.15, 70, 60),
    },

    // « Quatre, depuis que tu fais des gommages ou que tu testes des produits au hasard, c'est encore pire. »
    products: (() => {
      const items = [
        { id: "it0", kind: "jar", x: 340, label: "GOMMAGE", at: R("products", "gommages") },
        { id: "it1", kind: "tube", x: 150, label: "SOIN", at: R("products", "testes") },
        { id: "it2", kind: "jar", x: 770, label: "MASQUE", at: R("products", "produits") },
        { id: "it3", kind: "tube", x: 560, label: "SÉRUM", at: R("products", "hasard") },
        { id: "it4", kind: "tube", x: 950, label: "CRÈME", at: R("products", "hasard") + 0.35 },
      ];
      const base = 690;
      const draw = (it) => (it.kind === "tube" ? tube(C, it.x, base - 208 * 0.8, { s: 0.8, label: it.label, id: it.id, labelSize: 26 }) : jar(C, it.x, base - 130, { s: 1, label: it.label, id: it.id, labelSize: 26 }));
      const cy = (it) => (it.kind === "tube" ? base - 208 * 0.8 : base - 130);
      const worse = R("products", "encore pire");
      return {
        svg: shelf(C, 540, base, 1040) + items.map(draw).join("") + items.map((it) => cross(C, it.x, cy(it), 120, `x_${it.id}`)).join("") +
          woman(C, { cy: 1200, scale: 0.85, mirrorOn: false, extras: flush() }) + badge(C, 150, 200, 4),
        anims: [
          POP("badge", 0.1, [150, 200]),
          ...items.flatMap((it) => [DROP(it.id, it.at, [it.x, cy(it)], -420), POP(`x_${it.id}`, it.at + 0.5, [it.x, cy(it)])]),
          ...[0, 1, 2].map((i) => FADEIN(`fl${i}`, worse, 0.5)),
          ...SPOTS.map((sp, i) => A(`sp${i}`, worse, 0.8, { s: 1 }, { s: 1.7 }, { origin: [sp.x, sp.y], ease: "outCubic" })),
        ],
        loops: [],
        cam: SLOW(1.0, 1.08, 0, 0),
      };
    })(),

    // « Et cinq, soleil, rasage, frottements, rien ne protège du retour des taches. »
    triggers5: (() => {
      const rub = `<g id="rub">` + layer(blob(300, 1230, 150, 52, { jitter: 0.08, n: 12, seed: 61 }), C.cream, 5) +
        layer(poly(arrowPts(150, 1150, 300, 1150, 30, 76, 64), { round: false }), C.alert, 5) + layer(poly(arrowPts(450, 1310, 300, 1310, 30, 76, 64), { round: false }), C.alert, 5) + `</g>`;
      const back = [[180, 760], [920, 740], [150, 1000], [930, 1010], [740, 1290], [860, 1230]];
      const tNo = R("triggers5", "rien ne protège"), tBack = R("triggers5", "retour des taches");
      return {
        svg: badge(C, 150, 200, 5) + sun(C, 290, 600) + razor(C, 790, 880, 1.0, "razor") + rub +
          shield2(C, 540, 960, 1.45, "shield", { check: false, crack: true }) +
          back.map((p, i) => `<g id="bk${i}">` + layer(blob(p[0], p[1], 40 + (i % 2) * 14, 30, { jitter: 0.2, n: 10, seed: 970 + i }), C.dark, 5) + `</g>`).join(""),
        anims: [
          POP("badge", 0.1, [150, 200]),
          POP("sun", R("triggers5", "soleil"), [290, 600]), POP("sun-rays", R("triggers5", "soleil"), [290, 600]),
          DROP("razor", R("triggers5", "rasage"), [790, 880]),
          POP("rub", R("triggers5", "frottements"), [300, 1230]),
          ...["sun", "sun-rays", "razor", "rub"].map((id) => A(id, tNo, 0.4, { o: 1 }, { o: 0.3 }, { ease: "lin", late: true })),
          POP("shield", tNo, [540, 960]),
          ...back.map((p, i) => POP(`bk${i}`, tBack + i * 0.12, p)),
        ],
        loops: [],
        cam: SLOW(1.0, 1.07, 0, 0),
      };
    })(),

    // « Le problème ne vient pas de toi, ni de ta peau, mais d'en dessous. Et c'est là que tu peux agir. »
    notYou: (() => {
      const D = 1100, melY = MEL[1] + D;
      const tPan = R("notYou", "mais", -0.15);
      const ring = `<g id="ring"><g filter="url(#paper4)"><circle cx="540" cy="${melY}" r="235" fill="none" stroke="${C.alert}" stroke-width="16"/></g></g>`;
      return {
        bgH: 3500,
        svg: woman(C) + tag(C, 300, 330, 300, 100, "TOI", { id: "tg1", fontSize: 52, color: C.alert, seed: 5 }) + tag(C, 790, 330, 380, 100, "TA PEAU", { id: "tg2", fontSize: 52, color: C.alert, seed: 6 }) +
          cross(C, 300, 330, 110, "x1") + cross(C, 790, 330, 110, "x2") +
          dy(skin(C), D) + dy(melanocyte(C), D) +
          `<g id="down">${layer(poly(arrowPts(540, 1560, 540, 1960, 60, 150, 130), { round: false }), C.alert, 6)}</g>` + ring +
          tag(C, 540, 2140, 780, 120, "TU PEUX AGIR ICI", { id: "tg3", fontSize: 56, color: C.solution, seed: 7 }),
        anims: [
          POP("tg1", R("notYou", "toi"), [300, 330]), POP("x1", R("notYou", "toi") + 0.35, [300, 330]),
          POP("tg2", R("notYou", "ta peau"), [790, 330]), POP("x2", R("notYou", "ta peau") + 0.35, [790, 330]),
          POP("down", R("notYou", "dessous", -0.2), [540, 1760]),
          POP("ring", R("notYou", "agir", -0.3), [540, melY]),
          POP("tg3", R("notYou", "agir", -0.1), [540, 2140]),
        ],
        loops: [{ id: "ring", prop: "s", amp: 0.05, freq: 1.6, start: R("notYou", "agir"), origin: [540, melY] }],
        cam: [
          { t0: 0, t1: tPan, from: { s: 1.3, y: 100 }, to: { s: 1.3, y: 100 }, ease: "lin" },
          { t0: tPan, t1: tPan + 1.7, from: { s: 1.3, y: 100 }, to: { s: 1.35, y: -1897 }, ease: "inOut" },
        ],
      };
    })(),
  };
}

function check2(C) { return check(C, 800, 620, 190, "check"); }
