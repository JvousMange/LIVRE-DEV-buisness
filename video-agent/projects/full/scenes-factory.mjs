// Le processus de création des taches, illustré par une usine sous la surface de la peau.
import { hangingSign, layer, band, blob, poly } from "../../engine/paper.mjs";
import { stain, tag, sun, cross } from "../../library/components.mjs";
import { razor, pimple, padlock, factory as factoryRaw, siren, pipeLine, underground } from "../../library/components2.mjs";
import { A, POP, FADEIN, FADEOUT, DROP, SLOW } from "./kit.mjs";

export function scenesF(C, X) {
  const R = (n, p, o) => X.rel(n, p, o);
  const FX = 430, FY = 1245, FS = 0.85, PX = 740, OUT = [FX + 250 * FS, 1305];
  const FCOL = { body: "#CF9068", roof: "#B5724B", chimney: "#E8D0A8", cap: "#7A4E32", base: "#7A4E32", gear: "#E3B08C" };
  const factory = (C2, cx, cy, s, id) => factoryRaw(C2, cx, cy, s, id, FCOL);
  const ringAt = (cx, cy, rx, ry, id, w = 14) => `<g id="${id}"><g filter="url(#paper4)"><ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="none" stroke="${C.alert}" stroke-width="${w}"/></g></g>`;
  const stainW = `<g id="stainW"><g transform="translate(${PX} 905) scale(.78) translate(-540 -905)">${stain(C, "stainIn")}</g></g>`;
  const smoke = (id, t0, n, step) => Array.from({ length: n }, (_, k) => A(`${id}-sm${k % 8}`, t0 + k * step, 1.5, { y: 0, s: 0.5, o: 0.95 }, { y: -230, s: 1.5, o: 0 }, { ease: "outCubic", origin: [200, -338] }));
  const spin = (id, dur, speed) => A(`${id}-gear`, 0, dur, { r: 0 }, { r: Math.round(dur * speed) }, { ease: "lin", origin: [190, 62] });
  // Granules de pigment : sortie de l'usine → tapis → tuyau → surface.
  const flowSvg = (prefix, n) => Array.from({ length: n }, (_, i) => `<g id="${prefix}${i}">` + layer(blob(OUT[0], OUT[1], 17, 17, { jitter: 0.1, n: 8, seed: 1600 + i }), C.problem, 6) + `</g>`).join("");
  const flowAnims = (prefix, n, t0, step) => Array.from({ length: n }, (_, i) => {
    const t = t0 + i * step, id = `${prefix}${i}`;
    return [
      POP(id, t, OUT, { from: { s: 0 }, to: { s: 1 } }),
      A(id, t + 0.35, 0.6, { x: 0, y: 0 }, { x: PX - OUT[0], y: 0 }, { ease: "lin", late: true }),
      A(id, t + 0.95, 1.0, { x: PX - OUT[0], y: 0 }, { x: PX - OUT[0], y: -360 }, { ease: "lin", late: true }),
      A(id, t + 1.9, 0.25, { o: 1 }, { o: 0 }, { ease: "lin", late: true }),
    ];
  }).flat();
  const plant = () => underground(C) + pipeLine(C, PX, 940, 1300, OUT[0] - 5, "pipe");

  return {
    // « Voilà ce qui se passe. Ta peau fabrique de la mélanine : c'est ce qui lui donne sa couleur. »
    melanin: (() => {
      const dur = X.dur("melanin");
      return {
        svg: underground(C) + pipeLine(C, PX, 940, 1300, OUT[0] - 5, "pipe") +
          factory(C, FX, FY, FS, "fac") + flowSvg("pg", 6) + `<g id="sign">${hangingSign(540, 640, 600, 180, ["MÉLANINE"], { palette: C, fontSize: 88, seed: 4 })}</g>` +
          `<g id="veil"><rect x="-300" y="-400" width="1700" height="2800" fill="rgb(255,247,230)"/></g>`,
        anims: [
          A("veil", 0, 0.45, { o: 1 }, { o: 0 }, { ease: "lin" }), POP("fac", 0.35, [FX, FY]),
          ...smoke("fac", R("melanin", "fabrique"), 7, 0.5), spin("fac", dur, 60),
          DROP("sign", R("melanin", "mélanine", -0.2), [540, 0]),
          ...flowAnims("pg", 6, R("melanin", "fabrique", 0.2), 0.6),
          FADEIN("surfTint", R("melanin", "couleur", -0.3), 1.0),
        ],
        loops: [{ id: "sign", prop: "r", amp: 1.2, freq: 0.6, start: 1, origin: [540, 0] }],
        cam: SLOW(1.3, 1.36, -150, -175),
      };
    })(),

    // « Quand elle est agressée, par un bouton, un rasage, le soleil ou les hormones, »
    aggressed: (() => {
      const dur = X.dur("aggressed"), tB = R("aggressed", "bouton");
      return {
        svg: plant() + factory(C, FX, FY, FS, "fac") + siren(C, FX - 40, FY - 215 * FS - 18, 0.55, "siren") +
          pimple(C, 260, 830, 1.2, "pim") + razor(C, 560, 540, 0.85, "razor") + sun(C, 820, 450) + tag(C, 300, 390, 420, 100, "HORMONES", { id: "hor", fontSize: 46, color: C.alert, seed: 8 }),
        anims: [
          POP("siren", R("aggressed", "agressée"), [FX - 40, FY - 215 * FS - 18]), A("fac-red", tB, 0.4, { o: 0 }, { o: 1 }, { ease: "lin" }),
          POP("pim", tB, [260, 830]), DROP("razor", R("aggressed", "rasage"), [560, 540]),
          POP("sun", R("aggressed", "soleil"), [820, 450]), POP("sun-rays", R("aggressed", "soleil"), [820, 450]), POP("hor", R("aggressed", "hormones"), [300, 390]),
          ...smoke("fac", tB, 8, 0.28), spin("fac", dur, 360),
        ],
        loops: [{ id: "siren", prop: "s", amp: 0.14, freq: 4, start: R("aggressed", "agressée"), origin: [FX - 40, FY - 215 * FS - 18] }],
        cam: SLOW(1.0, 1.06, -60, -95),
      };
    })(),

    // « elle en fabrique trop, à cet endroit précis. »
    toomuch: (() => {
      const dur = X.dur("toomuch");
      return {
        svg: plant() + stainW + factory(C, FX, FY, FS, "fac") + flowSvg("pg", 12) + ringAt(PX, 905, 300, 70, "ring", 12) + tag(C, PX, 690, 300, 100, "ICI", { id: "ici", fontSize: 60, color: C.alert, seed: 9 }),
        anims: [
          A("fac-red", 0, 0.01, { o: 1 }, { o: 1 }), ...smoke("fac", 0.1, 8, 0.2), spin("fac", dur, 420),
          ...flowAnims("pg", 12, 0.1, 0.12),
          POP("stainW", R("toomuch", "endroit", -0.4), [PX, 905]), POP("ring", R("toomuch", "endroit"), [PX, 905]), POP("ici", R("toomuch", "précis", -0.2), [PX, 690]),
        ],
        loops: [], cam: { from: { s: 1.3, y: -120 }, to: { s: 1.34, y: -135 }, ease: "lin" },
      };
    })(),

    // « Cette mélanine reste coincée sous la peau. »
    trapped: (() => {
      const dur = X.dur("trapped"), N = 8;
      return {
        svg: plant() + stainW + factory(C, FX, FY, FS, "fac") +
          Array.from({ length: N }, (_, i) => `<g id="tr${i}">` + layer(blob(PX, 1270 - i * 38, 18, 18, { jitter: 0.1, n: 8, seed: 1700 + i }), C.problem, 6) + `</g>`).join("") + padlock(C, PX, 1010, 0.8, "lock"),
        anims: [A("fac-red", 0, 0.01, { o: 1 }, { o: 1 }), ...smoke("fac", 0.0, 4, 0.5), spin("fac", dur, 200), DROP("lock", R("trapped", "coincée", -0.2), [PX, 1010])],
        loops: Array.from({ length: N }, (_, i) => ({ id: `tr${i}`, prop: "y", amp: 4, freq: 2.5, phase: i * 0.13, start: 0.2, origin: [PX, 1270 - i * 38] })),
        cam: { from: { s: 1.25, x: -130, y: -170 }, to: { s: 1.3, x: -140, y: -185 }, ease: "lin" },
      };
    })(),

    // « Et sur une peau mate ou noire, elle réagit souvent plus fort. » — petite usine / grosse usine.
    compare: (() => {
      const dur = X.dur("compare"), tStrong = R("compare", "plus fort");
      return {
        svg: underground(C) + factory(C, 250, 1285, 0.42, "fs") + factory(C, 715, 1235, 0.95, "fb") + siren(C, 655, 1235 - 212 * 0.95 - 20, 0.7, "siren") +
          tag(C, 250, 800, 380, 90, "PEAU CLAIRE", { id: "tL", fontSize: 38, color: C.solution, seed: 10 }) + tag(C, 715, 790, 470, 90, "MATE OU NOIRE", { id: "tD", fontSize: 38, color: C.alert, seed: 11 }),
        anims: [
          POP("fs", 0.1, [250, 1285]), POP("tL", 0.2, [250, 800]), ...smoke("fs", 0.5, 3, 1.0), spin("fs", dur, 40),
          POP("fb", R("compare", "mate"), [715, 1235]), POP("tD", R("compare", "mate", 0.15), [715, 790]),
          ...smoke("fb", R("compare", "mate", 0.3), 8, 0.3), A("fb-red", tStrong - 0.2, 0.4, { o: 0 }, { o: 1 }, { ease: "lin" }),
          POP("siren", tStrong - 0.1, [655, 1235 - 212 * 0.95 - 20]), spin("fb", dur, 300),
        ],
        loops: [{ id: "siren", prop: "s", amp: 0.14, freq: 4, start: tStrong, origin: [655, 1235 - 212 * 0.95 - 20] }],
        cam: SLOW(1.1, 1.15, -70, -95),
      };
    })(),
  };
}
