// Raison 4 dynamique, raison 5 en trois plans rapides + rideau de taches, transition à la loupe, calendrier des mois.
import { layer, band, blob, poly, arrowPts } from "../../engine/paper.mjs";
import { skin, stain, melanocyte, badge, cross, tag, woman, flush, sun, skinHand, SPOTS, MEL, HAND_SKIN } from "../../library/components.mjs";
import { tube, jar, razor, shield2, shelf, calendar, loupe } from "../../library/components2.mjs";
import { A, POP, FADEIN, FADEOUT, DROP, SLOW } from "./kit.mjs";
import { flood } from "./flood.mjs";

const SKIN = "#9C6544", SKINL = "#B07B58";

export function scenesG(C, X) {
  const R = (n, p, o) => X.rel(n, p, o);

  return {
    // « Quatre, depuis que tu fais des gommages ou que tu testes des produits au hasard, c'est encore pire. »
    // Rythme irrégulier (rafales qui s'accélèrent), entrées variées ; le visage réagit au fur et à mesure puis la caméra s'en approche.
    products: (() => {
      const labels = ["GOMMAGE", "SOIN", "SÉRUM", "MASQUE", "CRÈME", "SCRUB", "GEL", "LAIT", "TONIQUE", "PEELING"];
      const xs = [150, 340, 540, 740, 930], bases = [480, 830];
      const at = [0.1, 0.42, 0.55, 1.05, 1.32, 1.7, 1.82, 2.15, 2.24, 2.3];            // irrégulier, de plus en plus serré
      const mode = ["drop", "slide", "pop", "drop", "slide", "pop", "drop", "slide", "drop", "pop"];
      const items = labels.map((lb, i) => {
        const row = i < 5 ? 0 : 1, isTube = (i + row) % 2 === 1, base = bases[row];
        return { id: `it${i}`, x: xs[i % 5], lb, tube: isTube, cy: isTube ? base - 208 * 0.62 : base - 130 * 0.78, at: at[i], mode: mode[i] };
      });
      const tWorse = R("products", "encore pire"), dur = X.dur("products");
      const enter = (it) => (it.mode === "drop" ? DROP(it.id, it.at, [it.x, it.cy])
        : it.mode === "slide" ? A(it.id, it.at, 0.45, { x: it.x < 540 ? -1000 : 1000, r: it.x < 540 ? -22 : 22 }, { x: 0, r: 0 }, { ease: "outBack", origin: [it.x, it.cy], sfx: "whoosh" })
        : POP(it.id, it.at, [it.x, it.cy]));
      return {
        svg: shelf(C, 540, bases[0], 1040, "sh1") + shelf(C, 540, bases[1], 1040, "sh2") +
          items.map((it) => (it.tube ? tube(C, it.x, it.cy, { s: 0.62, label: it.lb, id: it.id, labelSize: 28 }) : jar(C, it.x, it.cy, { s: 0.78, label: it.lb, id: it.id, labelSize: 26 }))).join("") +
          items.map((it) => cross(C, it.x + 38, it.cy - 62, 64, `x_${it.id}`)).join("") +
          woman(C, { cy: 1170, scale: 0.78, mirrorOn: false, extras: flush() }) + badge(C, 110, 110, 4),
        anims: [
          POP("badge", 0.05, [110, 110]),
          ...items.flatMap((it) => [enter(it), POP(`x_${it.id}`, it.at + 0.35, [it.x + 38, it.cy - 62])]),
          // la peau réagit au fil des produits : rougeurs par paliers, taches qui grossissent
          ...[0, 1, 2].flatMap((i) => [
            A(`fl${i}`, 0.9 + i * 0.1, 0.5, { o: 0 }, { o: 0.35 }, { ease: "lin" }),
            A(`fl${i}`, 1.9 + i * 0.05, 0.5, { o: 0.35 }, { o: 0.7 }, { ease: "lin", late: true }),
            A(`fl${i}`, tWorse, 0.5, { o: 0.7 }, { o: 1 }, { ease: "lin", late: true }),
          ]),
          ...SPOTS.flatMap((sp, i) => [
            A(`sp${i}`, 1.2 + i * 0.03, 0.8, { s: 1 }, { s: 1.35 }, { origin: [sp.x, sp.y], ease: "outCubic" }),
            A(`sp${i}`, tWorse, 0.7, { s: 1.35 }, { s: 2.0 }, { origin: [sp.x, sp.y], ease: "outCubic", late: true }),
          ]),
        ],
        loops: [{ id: "fl0", prop: "s", amp: 0.05, freq: 3, start: tWorse, origin: [-98, 78] }, { id: "fl1", prop: "s", amp: 0.05, freq: 3, start: tWorse, origin: [98, 74] }],
        cam: [
          { t0: 0, t1: Math.max(0.2, tWorse - 0.5), from: { s: 1.0, y: 0 }, to: { s: 1.03, y: 0 }, ease: "lin" },
          { t0: Math.max(0.2, tWorse - 0.5), t1: dur, from: { s: 1.03, y: 0 }, to: { s: 1.9, y: -399 }, ease: "inOut" },
        ],
        punches: [{ t: tWorse, amp: 0.05 }],
      };
    })(),

    // ───── Raison 5 : un plan rapide par déclencheur ─────
    // Soleil qui tape sur la peau.
    fiveSun: {
      svg: woman(C) + `<g id="beam">${[[590, 830, 650, 900], [640, 800, 700, 880], [700, 790, 760, 860]].map(([x1, y1, x2, y2]) => layer(poly([[800, 430], [x1, y1], [x2, y2]]), "rgba(240,176,82,.6)", 4)).join("")}</g>` + sun(C, 800, 400) + badge(C, 150, 200, 5),
      anims: [
        POP("badge", 0.0, [150, 200]), POP("sun", 0.38, [800, 400]), POP("sun-rays", 0.38, [800, 400], { sfx: false }),
        A("beam", 0.55, 0.3, { s: 0 }, { s: 1 }, { origin: [800, 430], ease: "outCubic", sfx: "whoosh" }),
        ...[4, 5, 6, 7].map((i) => A(`sp${i}`, 0.8, 0.4, { s: 1 }, { s: 1.6 }, { origin: [SPOTS[i].x, SPOTS[i].y], ease: "outBack", sfx: i === 4 ? "pop" : false })),
      ],
      loops: [{ id: "sun-rays", prop: "r", amp: 6, freq: 2, start: 0.4, origin: [800, 400] }],
      cam: SLOW(1.4, 1.45, 120, 120), punches: [{ t: 0.55, amp: 0.05 }],
    },

    // Rasage sur une aisselle.
    fiveRazor: (() => {
      const patch = `<g id="pat">${layer(blob(560, 980, 120, 70, { jitter: 0.25, n: 12, seed: 3100 }), C.dark, 6)}${layer(blob(640, 940, 60, 40, { jitter: 0.25, n: 10, seed: 3101 }), C.dark, 6)}</g>`;
      return {
        svg: layer(poly([[-60, 1950], [-60, 800], [330, 760], [470, 960], [580, 1060], [700, 1950]]), "#2E2019", 3) +
          `<g id="armp">${layer(poly([[480, 1000], [560, 880], [780, 520], [900, 330], [1010, 420], [960, 560], [790, 760], [700, 960]]), SKIN, 4)}${layer(blob(420, 880, 150, 110, { jitter: 0.1, n: 12, seed: 3102 }), SKIN, 4)}</g>` +
          patch + razor(C, 640, 900, 0.9, "rz") + badge(C, 150, 200, 5),
        anims: [
          A("armp", 0.0, 0.25, { x: 300, y: -200 }, { x: 0, y: 0 }, { ease: "outCubic", sfx: "whoosh" }), DROP("rz", 0.12, [640, 900]),
          POP("pat", 0.55, [590, 960], { sfx: "pop" }),
        ],
        loops: [{ id: "rz", prop: "x", amp: 60, freq: 3.5, start: 0.45, origin: [640, 900] }, { id: "rz", prop: "r", amp: 8, freq: 3.5, start: 0.45, origin: [640, 900] }],
        cam: SLOW(1.1, 1.18, 0, 0), punches: [{ t: 0.55, amp: 0.05 }],
      };
    })(),

    // Frottement des coudes sur une table.
    fiveElbows: (() => {
      const elbow = (x, id) => `<g id="${id}">${layer(poly([[x - 85, 280], [x + 85, 280], [x + 80, 1010], [x - 80, 1010]]), SKIN, 4)}${layer(blob(x, 1050, 105, 80, { jitter: 0.06, n: 12, seed: 3200 + x }), SKIN, 5)}${layer(blob(x, 1060, 62, 44, { jitter: 0.25, n: 10, seed: 3300 + x }), C.problem, 6)}</g>`;
      return {
        svg: layer(poly([[-60, 1090], [1140, 1090], [1140, 2000], [-60, 2000]]), "#A9845A", 3) + elbow(340, "elL") + elbow(740, "elR") +
          [0, 1].map((i) => `<g id="fr${i}">${layer(poly(arrowPts(180 + i * 640, 1170, 100 + i * 640, 1170, 26, 70, 56), { round: false }), C.alert, 6)}</g>`).join(""),
        anims: [A("elL", 0.0, 0.25, { y: -300 }, { y: 0 }, { ease: "outBack", sfx: "whoosh" }), A("elR", 0.1, 0.25, { y: -300 }, { y: 0 }, { ease: "outBack" }), POP("fr0", 0.35, [140, 1170]), POP("fr1", 0.4, [780, 1170])],
        loops: [{ id: "elL", prop: "x", amp: 28, freq: 3.5, start: 0.3, origin: [340, 1050] }, { id: "elR", prop: "x", amp: 28, freq: 3.5, phase: 0.5, start: 0.3, origin: [740, 1050] }],
        cam: SLOW(1.15, 1.2, 40, 40), punches: [{ t: 0.3, amp: 0.04 }],
      };
    })(),

    // « …rien ne protège du retour des taches. » — bouclier fissuré, puis les taches recouvrent tout l'écran (rideau en espace écran).
    triggers5: (() => {
      const fl = flood(C), dur = X.dur("triggers5"), tBack = R("triggers5", "retour");
      const start = Math.min(tBack, dur - 1.5), step = Math.min(0.03, (dur - 0.3 - start) / fl.cells.length);
      return {
        svg: shield2(C, 540, 900, 1.5, "shield", { check: false, crack: true }),
        overlay: fl.svg,
        anims: [
          POP("shield", 0.05, [540, 900]),
          ...fl.order.map((idx, k) => POP(`fd${idx}`, start + k * step, [fl.cells[idx].x, fl.cells[idx].y], { from: { s: 0 }, to: { s: 1 } })),
        ],
        loops: [], cam: SLOW(1.0, 1.04, 0, 0), punches: [{ t: 0.05, amp: 0.04 }],
      };
    })(),

    // « Le problème ne vient pas de toi, ni de ta peau, mais d'en dessous. Et c'est là que tu peux agir. »
    // Le rideau de taches se retire (même motif, en espace écran), une loupe cherche la cause, puis on zoome DANS la loupe.
    notYou: (() => {
      const fl = flood(C), dur = X.dur("notYou"), tZoom = R("notYou", "mais", -0.1);
      const LX = 700, LY = 800, rLens = 150;
      const view = `<clipPath id="lensclip"><circle cx="${LX}" cy="${LY}" r="${rLens - 4}"/></clipPath><g id="lv" clip-path="url(#lensclip)"><g transform="translate(${LX} ${LY}) scale(.48) translate(-540 -1170)">${skin(C)}${melanocyte(C)}</g></g>`;
      const both = (t0, d, from, to, o = {}) => ["lp", "lv"].map((id) => A(id, t0, d, from, to, o));
      return {
        svg: woman(C) + cross(C, 540, 1110, 250, "x1") + cross(C, 640, 780, 220, "x2") + view + loupe(C, LX, LY, rLens, "lp"),
        overlay: fl.svg,
        anims: [
          ...fl.order.slice().reverse().map((idx, k) => A(`fd${idx}`, 0.08 + k * 0.014, 0.3, { s: 1 }, { s: 0 }, { origin: [fl.cells[idx].x, fl.cells[idx].y], ease: "inCubic", sfx: k % 6 === 0 ? "whoosh" : false })),
          POP("lp", 0.7, [LX, LY]), POP("lv", 0.7, [LX, LY], { sfx: false }),
          ...both(R("notYou", "toi", -0.1), 0.8, { x: 0 }, { x: -230 }, { ease: "inOut" }), POP("x1", R("notYou", "toi", 0.35), [540, 1110]),
          ...both(R("notYou", "ta peau", -0.1), 0.8, { x: -230 }, { x: 0 }, { ease: "inOut", late: true }), POP("x2", R("notYou", "ta peau", 0.35), [640, 780]),
        ],
        loops: [],
        // pas de descente : la caméra reste sur elle puis entre dans le verre de la loupe
        cam: [
          { t0: 0, t1: tZoom, from: { s: 1.3, x: 0, y: 100 }, to: { s: 1.3, x: 0, y: 100 }, ease: "lin" },
          { t0: tZoom, t1: dur, from: { s: 1.3, x: 0, y: 100 }, to: { s: 6.5, x: -1040, y: 1040 }, ease: "inCubic" },
        ],
        sfx: [{ t: tZoom + 0.2, type: "rise" }], punches: [{ t: R("notYou", "toi", 0.35), amp: 0.04 }, { t: R("notYou", "ta peau", 0.35), amp: 0.04 }],
      };
    })(),

    // « C'est pour ça que la tache reste des mois, et qu'un produit de surface n'y change rien. »
    // Un calendrier qui défile de janvier à décembre au-dessus de la tache, puis la main qui frotte en vain.
    months: (() => {
      const names = ["JANVIER", "FÉVRIER", "MARS", "AVRIL", "MAI", "JUIN", "JUILLET", "AOÛT", "SEPTEMBRE", "OCTOBRE", "NOVEMBRE", "DÉCEMBRE"];
      const t0 = R("months", "reste", -0.1), gap = 0.13, tR = R("months", "produit");
      const pages = `<g id="cal">` + names.map((m, i) => calendar(C, 330, 520, 0.9, `pg${i}`, { mark: (i * 7 + 3) % 18, month: m })).reverse().join("") + `</g>`;   // janvier au-dessus
      return {
        svg: skin(C) + stain(C) + pages + cross(C, 760, 640, 170) + skinHand(C),
        anims: [
          POP("cal", 0.0, [330, 520]),
          ...names.slice(0, 11).map((_, i) => A(`pg${i}`, t0 + 0.2 + i * gap, 0.16, { y: 0, r: 0, o: 1 }, { y: -300, r: -16, o: 0 }, { ease: "inCubic", late: i > 0, sfx: "flip", origin: [330, 330] })),
          A("hand", tR, 0.5, { x: 520, y: -430 }, { x: 0, y: 0 }, { ease: "outCubic", origin: HAND_SKIN }),
          POP("cross", R("months", "rien", -0.2), [760, 640]),
        ],
        loops: [{ id: "hand", prop: "x", amp: 95, freq: 1.9, start: tR + 0.5, origin: HAND_SKIN }],
        cam: SLOW(1.15, 1.1, 40, 30), punches: [{ t: R("months", "rien", -0.2), amp: 0.04 }],
      };
    })(),
  };
}
