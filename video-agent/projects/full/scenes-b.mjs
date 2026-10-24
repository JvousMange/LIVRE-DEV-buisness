// Le mécanisme : mélanine, agression, « trop », coincée, peau claire/foncée, des mois, réguler, imaginer, source.
import { hangingSign, layer, band, blob, star, poly, arrowPts } from "../../engine/paper.mjs";
import { skin, stain, melanocyte, granuleSpecs, granule, badge, cross, tag, woman, sun, skinHand, questionMark, SPOTS, MEL, HAND_SKIN } from "../../library/components.mjs";
import { razor, pimple, padlock, calendar, gauge, flame, sparkle, tube, jar, valve, check, shelf } from "../../library/components2.mjs";
import { A, POP, FADEIN, FADEOUT, DROP, SLOW } from "./kit.mjs";

export function scenesB(C, X) {
  const R = (n, p, o) => X.rel(n, p, o);
  const ringAt = (cx, cy, rx, ry, id, w = 14) => `<g id="${id}"><g filter="url(#paper4)"><ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="none" stroke="${C.alert}" stroke-width="${w}"/></g></g>`;

  return {
    // « Voilà ce qui se passe. Ta peau fabrique de la mélanine : c'est ce qui lui donne sa couleur. »
    melanin: (() => {
      const gr = granuleSpecs(10);
      return {
        svg: skin(C) + `<g id="tint">${layer(band(-60, 1140, 1010, 1380, { amp: 16, seed: 12 }), "rgba(124,76,51,.62)", 2)}</g>` + melanocyte(C) +
          gr.map((g) => granule(C, g)).join("") + `<g id="sign">${hangingSign(540, 650, 600, 180, ["MÉLANINE"], { palette: C, fontSize: 88, seed: 4 })}</g>`,
        anims: [
          DROP("sign", R("melanin", "mélanine", -0.2), [540, 0], -700),
          ...gr.flatMap((g, i) => {
            const off = { x: g.from[0] - g.to[0], y: g.from[1] - g.to[1] };
            return [A(g.id, R("melanin", "fabrique") + i * 0.12, 0.35, { ...off, s: 0 }, { ...off, s: 1 }, { origin: g.to, ease: "outBack" })];
          }),
          FADEIN("tint", R("melanin", "couleur", -0.3), 1.0),
        ],
        loops: [{ id: "mel", prop: "s", amp: 0.03, freq: 1.4, start: 0.3, origin: MEL }, { id: "sign", prop: "r", amp: 1.2, freq: 0.6, start: 1, origin: [540, 0] }],
        cam: SLOW(1.3, 1.4, -330, -370),
      };
    })(),

    // « Quand elle est agressée, par un bouton, un rasage, le soleil ou les hormones, »
    aggressed: {
      svg: skin(C) + melanocyte(C) + pimple(C, 260, 830, 1.2, "pim") + razor(C, 560, 540, 0.85, "razor") + sun(C, 820, 450) +
        tag(C, 300, 390, 420, 100, "HORMONES", { id: "hor", fontSize: 46, color: C.alert, seed: 8 }) + ringAt(MEL[0], MEL[1], 250, 215, "ring", 16),
      anims: [
        POP("ring", R("aggressed", "agressée"), MEL),
        POP("pim", R("aggressed", "bouton"), [260, 830]),
        DROP("razor", R("aggressed", "rasage"), [560, 540]),
        POP("sun", R("aggressed", "soleil"), [820, 450]), POP("sun-rays", R("aggressed", "soleil"), [820, 450]),
        POP("hor", R("aggressed", "hormones"), [300, 390]),
      ],
      loops: [{ id: "mel", prop: "s", amp: 0.06, freq: 3.2, start: R("aggressed", "bouton"), origin: MEL }, { id: "ring", prop: "s", amp: 0.04, freq: 3.2, start: R("aggressed", "agressée"), origin: MEL }],
      cam: SLOW(1.05, 1.1, -60, -100),
    },

    // « elle en fabrique trop, à cet endroit précis. »
    toomuch: (() => {
      const gr = granuleSpecs(24);
      const t0 = R("toomuch", "fabrique");
      return {
        svg: skin(C) + melanocyte(C) + gr.map((g) => granule(C, g)).join("") + stain(C) + ringAt(540, 905, 300, 66, "ring", 12) +
          tag(C, 540, 690, 300, 100, "ICI", { id: "ici", fontSize: 60, color: C.alert, seed: 9 }),
        anims: [
          ...gr.flatMap((g, i) => {
            const off = { x: g.from[0] - g.to[0], y: g.from[1] - g.to[1] };
            return [
              A(g.id, t0 + i * 0.06, 0.25, { ...off, s: 0 }, { ...off, s: 1 }, { origin: g.to, ease: "outBack" }),
              A(g.id, t0 + 0.3 + i * 0.06, 0.5, { ...off }, { x: 0, y: 0 }, { origin: g.to, ease: "inOut", late: true }),
            ];
          }),
          POP("stain", R("toomuch", "endroit", -0.4), [540, 905]),
          POP("ring", R("toomuch", "endroit"), [540, 905]), POP("ici", R("toomuch", "précis", -0.2), [540, 690]),
        ],
        loops: [{ id: "mel", prop: "s", amp: 0.07, freq: 3.5, start: t0, origin: MEL }],
        cam: SLOW(1.45, 1.4, -180, -150),
      };
    })(),

    // « Cette mélanine reste coincée sous la peau. »
    trapped: (() => {
      const gr = granuleSpecs(16);
      return {
        svg: skin(C) + stain(C) + melanocyte(C) + gr.map((g) => granule(C, g)).join("") + padlock(C, 540, 1030, 0.85, "lock"),
        anims: [DROP("lock", R("trapped", "coincée", -0.2), [540, 1030])],
        loops: gr.map((g, i) => ({ id: g.id, prop: "y", amp: 5, freq: 2.5, phase: i * 0.13, start: 0.2, origin: g.to })),
        cam: SLOW(1.6, 1.55, -60, -70),
      };
    })(),

    // « Et sur une peau mate ou noire, elle réagit souvent plus fort. »
    compare: (() => {
      const mel = (x, y, r, fill, id) => `<g id="${id}">` + layer(star(x, y, r, r * 0.43, 8, { seed: 7 }), fill, 4) + layer(blob(x, y, r * 0.34, r * 0.34, { seed: 9 }), C.cream, 5) + layer(blob(x, y, r * 0.12, r * 0.12, { seed: 10 }), C.alert, 6) + `</g>`;
      const grs = (x, y, n, rad, prefix, fill) => Array.from({ length: n }, (_, i) => {
        const a = (i / n) * Math.PI * 2 + 0.3, rr = rad * (1.15 + (i % 3) * 0.1);
        return `<g id="${prefix}${i}">` + layer(blob(x + Math.cos(a) * rr, y - 40 + Math.sin(a) * rr * 0.7, 13 + (i % 2) * 4, 12, { jitter: 0.12, n: 8, seed: 1100 + i }), fill, 5) + `</g>`;
      }).join("");
      const tStrong = R("compare", "plus fort");
      return {
        svg: skin(C) + mel(270, 1265, 80, "#B5724B", "mL") + grs(270, 1265, 3, 80, "gl", "#B5724B") + mel(790, 1265, 170, C.problem, "mD") + grs(790, 1265, 12, 170, "gd", C.problem) +
          tag(C, 270, 1100, 340, 90, "PEAU CLAIRE", { id: "tL", fontSize: 38, color: C.solution, seed: 10 }) + tag(C, 780, 1100, 470, 90, "MATE OU NOIRE", { id: "tD", fontSize: 38, color: C.alert, seed: 11 }),
        anims: [
          POP("mL", 0.1, [270, 1265]), POP("tL", 0.2, [270, 1100]),
          POP("mD", R("compare", "mate"), [790, 1265]), POP("tD", R("compare", "mate", 0.15), [780, 1100]),
          ...Array.from({ length: 3 }, (_, i) => POP(`gl${i}`, 0.4 + i * 0.1, [270, 1265])),
          ...Array.from({ length: 12 }, (_, i) => POP(`gd${i}`, tStrong - 0.4 + i * 0.07, [790, 1265])),
        ],
        loops: [{ id: "mD", prop: "s", amp: 0.07, freq: 3.5, start: tStrong - 0.3, origin: [790, 1265] }, { id: "mL", prop: "s", amp: 0.015, freq: 1.2, start: 0.5, origin: [270, 1265] }],
        cam: SLOW(1.1, 1.15, -300, -330),
      };
    })(),

    // « C'est pour ça que la tache reste des mois, et qu'un produit de surface n'y change rien. »
    months: (() => {
      const tR = R("months", "produit");
      return {
        svg: skin(C) + stain(C) + [1, 2, 3].map((n) => calendar(C, 300, 520, 0.85, `cal${n}`, { mark: 4 + n * 3, month: `MOIS ${n}` })).join("") + cross(C, 740, 640, 170) + skinHand(C),
        anims: [
          POP("cal1", R("months", "reste"), [300, 520]), POP("cal2", R("months", "reste", 0.55), [300, 520]), POP("cal3", R("months", "mois", 0.1), [300, 520]),
          A("hand", tR, 0.55, { x: 520, y: -430 }, { x: 0, y: 0 }, { ease: "outCubic", origin: HAND_SKIN }),
          POP("cross", R("months", "rien", -0.1), [740, 640]),
        ],
        loops: [{ id: "hand", prop: "x", amp: 95, freq: 1.9, start: tR + 0.6, origin: HAND_SKIN }],
        cam: SLOW(1.15, 1.1, 40, 30),
      };
    })(),

    // « Le but n'est donc pas d'éclaircir ta peau. »
    whiten: (() => {
      const sw = [[300, "#7C4C33"], [540, "#9C6544"], [780, "#EBC1A0"]];
      return {
        svg: tag(C, 540, 330, 520, 100, "ÉCLAIRCIR", { id: "tgE", fontSize: 54, color: C.alert, seed: 12 }) +
          sw.map(([x, c], i) => `<g id="sw${i}">` + layer(poly([[x - 100, 430], [x + 100, 430], [x + 100, 630], [x - 100, 630]], { round: false }), c, 4) + `</g>`).join("") +
          `<g id="arr">${layer(poly(arrowPts(180, 700, 900, 700, 36, 100, 90), { round: false }), C.dark, 5)}</g>` + cross(C, 540, 540, 520, "bigx") +
          woman(C, { cy: 1200, scale: 0.85, mirrorOn: false }),
        anims: [
          POP("sw0", 0.05, [300, 530]), POP("sw1", 0.2, [540, 530]), POP("sw2", 0.35, [780, 530]),
          POP("tgE", R("whiten", "d'éclaircir", -0.1), [540, 330]),
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
        svg: gauge(C, 540, 800, 1.2, "gauge") + tag(C, 540, 1210, 520, 100, "MÉLANINE", { id: "tgM", fontSize: 56, color: C.solution, seed: 13 }) +
          pimple(C, 160, 460, 1.0, "pim") + razor(C, 930, 440, 0.55, "rz") + check(C, 860, 1100, 200, "ok") +
          Array.from({ length: 7 }, (_, i) => `<g id="d${i}">` + layer(blob(150 + i * 130, 1330, 42, 42, { jitter: 0.04, n: 10, seed: 1200 + i }), C.solution, 5) + `</g>`).join(""),
        anims: [
          POP("tgM", tReg + 0.3, [540, 1210]),
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
