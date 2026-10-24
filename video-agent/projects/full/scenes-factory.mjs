// Le processus de création des taches : UNE usine sous la peau, dans un plan à cadrage fixe.
// Ce qui dynamise : les éléments qui interviennent (déclencheurs, sirène, fumée) et le rythme de production de mélanine,
// qui passe de calme à agité puis déborde, jusqu'à ce que la tache sorte et que le tuyau se bloque.
import { hangingSign, layer, blob, poly } from "../../engine/paper.mjs";
import { stain, tag, sun } from "../../library/components.mjs";
import { razor, pimple, padlock, factory as factoryRaw, siren, pipeLine } from "../../library/components2.mjs";
import { decorB } from "../../library/decors.mjs";
import { A, POP, FADEIN, FADEOUT, DROP } from "./kit.mjs";

export function scenesF(C, X, opts = {}) {
  const decor = opts.decor || decorB;
  const R = (n, p, o) => X.rel(n, p, o);
  const FX = 430, FY = 1560, FS = 0.85, PX = 740, OUT = [FX + 250 * FS, FY + 60];
  const FCOL = { body: "#CF9068", roof: "#B5724B", chimney: "#E8D0A8", cap: "#7A4E32", base: "#7A4E32", gear: "#E3B08C" };
  const factory = (C2, cx, cy, s, id) => factoryRaw(C2, cx, cy, s, id, FCOL);
  const FIXED = { from: { s: 0.95, y: -310 }, to: { s: 0.95, y: -310 }, ease: "lin" };      // cadrage fixe
  const ringAt = (cx, cy, rx, ry, id, w = 14) => `<g id="${id}"><g filter="url(#paper4)"><ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="none" stroke="${C.alert}" stroke-width="${w}"/></g></g>`;
  const stainW = `<g id="stainW"><g transform="translate(${PX} 905) scale(.78) translate(-540 -905)">${stain(C, "stainIn")}</g></g>`;
  const grain = (id, seed) => `<g id="${id}">` + layer(blob(OUT[0], OUT[1], 17, 17, { jitter: 0.1, n: 8, seed }), C.problem, 6) + `</g>`;
  // Un granule : pop à la sortie, tapis, remonte le tuyau jusqu'à y = yEnd ; fondu en haut si fade.
  const grainAnims = (id, t, yEnd, fade) => {
    const dist = OUT[1] - yEnd, dTravel = dist / 470;
    return [
      POP(id, t, OUT, { from: { s: 0 }, to: { s: 1 }, sfx: false }),
      A(id, t + 0.3, 0.45, { x: 0, y: 0 }, { x: PX - OUT[0], y: 0 }, { ease: "lin", late: true }),
      A(id, t + 0.75, dTravel, { x: PX - OUT[0], y: 0 }, { x: PX - OUT[0], y: -dist }, { ease: "lin", late: true }),
      ...(fade ? [A(id, t + 0.75 + dTravel, 0.25, { o: 1 }, { o: 0 }, { ease: "lin", late: true })] : []),
    ];
  };
  const puff = (id, t, k) => A(`${id}-sm${k % 8}`, t, 1.5, { y: 0, s: 0.5, o: 0.95 }, { y: -230, s: 1.5, o: 0 }, { ease: "outCubic", origin: [200, -338], late: k >= 8, sfx: false });

  return {
    // « Voilà ce qui se passe. Ta peau fabrique de la mélanine : c'est ce qui lui donne sa couleur. Quand elle est agressée,
    //   par un bouton, un rasage, le soleil ou les hormones, elle en fabrique trop, à cet endroit précis.
    //   Cette mélanine reste coincée sous la peau. »
    usine: (() => {
      const dur = X.dur("usine");
      const tFab = R("usine", "peau fabrique"), tMel = R("usine", "mélanine"), tCol = R("usine", "couleur"), tAgr = R("usine", "agressée"),
        tBou = R("usine", "bouton"), tRas = R("usine", "rasage"), tSol = R("usine", "soleil"), tHor = R("usine", "hormones"),
        tTrop = R("usine", "en fabrique trop"), tEnd = R("usine", "endroit"), tPre = R("usine", "précis"), tCoin = R("usine", "coincée");
      // — rythme de production : calme → agité → débordement —
      const slow = [tFab + 0.2, tFab + 1.3, tFab + 2.4].filter((t) => t < tAgr - 0.3);
      const busy = []; for (let t = tAgr + 0.2; t < tTrop - 0.4; t += 0.5) busy.push(t);
      const over = []; for (let t = tTrop; t < tCoin - 0.7; t += 0.15) over.push(t);
      const STACK0 = 1075, STEP = 40;
      const ids = { s: slow.map((_, i) => `ps${i}`), b: busy.map((_, i) => `pb${i}`), o: over.map((_, i) => `po${i}`) };
      const allIds = [...ids.s, ...ids.b, ...ids.o];
      // fumée : de plus en plus dense
      const puffs = []; for (let t = tFab; t < tAgr; t += 0.8) puffs.push(t); for (let t = tAgr; t < tTrop; t += 0.28) puffs.push(t); for (let t = tTrop; t < dur - 0.2; t += 0.18) puffs.push(t);
      // rotation de l'engrenage : trois régimes
      const rot = (t0, t1, from, speed) => A("fac-gear", t0, Math.max(0.1, t1 - t0), { r: from }, { r: from + (t1 - t0) * speed }, { ease: "lin", origin: [190, 62], late: t0 > 0, sfx: false });
      const r1 = tAgr * 40, r2 = r1 + (tTrop - tAgr) * 220, r3 = r2 + (dur - tTrop) * 480;
      return {
        svg: decor(C) + pipeLine(C, PX, 940, OUT[1], OUT[0] - 5, "pipe") + stainW + factory(C, FX, FY, FS, "fac") +
          allIds.map((id, i) => grain(id, 1600 + i)).join("") +
          over.map((_, i) => "").join("") +
          siren(C, FX - 40, FY - 215 * FS - 18, 0.55, "siren") +
          pimple(C, 260, 850, 1.2, "pim") + razor(C, 560, 620, 0.85, "razor") + sun(C, 820, 520) + tag(C, 300, 470, 420, 100, "HORMONES", { id: "hor", fontSize: 46, color: C.alert, seed: 8 }) +
          `<g id="sign">${hangingSign(540, 640, 600, 180, ["MÉLANINE"], { palette: C, fontSize: 88, seed: 4 })}</g>` +
          ringAt(PX, 905, 300, 70, "ring", 12) + tag(C, PX, 690, 300, 100, "ICI", { id: "ici", fontSize: 60, color: C.alert, seed: 9 }) + padlock(C, PX, 1010, 0.8, "lock") +
          `<g id="veil"><rect x="-300" y="-400" width="1700" height="2800" fill="rgb(255,247,230)"/></g>`,
        anims: [
          A("veil", 0, 0.4, { o: 1 }, { o: 0 }, { ease: "lin", sfx: false }), POP("fac", 0.1, [FX, FY]),
          ...puffs.map((t, k) => puff("fac", t, k)),
          rot(0, tAgr, 0, 40), rot(tAgr, tTrop, r1, 220), rot(tTrop, dur, r2, 480),
          DROP("sign", tMel, [540, 0]), FADEOUT("sign", tAgr - 0.1, 0.35), FADEIN("surfTint", tCol, 0.9),
          // production
          ...slow.flatMap((t, i) => grainAnims(ids.s[i], t, 955, true)),
          ...busy.flatMap((t, i) => grainAnims(ids.b[i], t, 955, true)),
          ...over.flatMap((t, i) => grainAnims(ids.o[i], t, STACK0 + i * STEP, false)),
          // agression : alerte, déclencheurs, usine qui s'emballe
          POP("siren", tAgr, [FX - 40, FY - 215 * FS - 18], { sfx: "beep" }), A("fac-red", tAgr, 0.3, { o: 0 }, { o: 1 }, { ease: "lin", sfx: false }),
          POP("pim", tBou, [260, 850]), DROP("razor", tRas, [560, 620]), POP("sun", tSol, [820, 520]), POP("sun-rays", tSol, [820, 520], { sfx: false }), POP("hor", tHor, [300, 470]),
          ...["pim", "razor", "sun", "sun-rays", "hor"].map((id) => FADEOUT(id, tTrop - 0.1, 0.35)),
          // débordement puis blocage
          POP("stainW", tEnd - 0.3, [PX, 905]), POP("ring", tEnd, [PX, 905]), POP("ici", tPre, [PX, 690]),
          DROP("lock", tCoin, [PX, 1010]),
        ],
        loops: [{ id: "siren", prop: "s", amp: 0.14, freq: 4, start: tAgr, origin: [FX - 40, FY - 215 * FS - 18] }],
        cam: FIXED,
        sfx: [tAgr, tAgr + 0.5, tAgr + 1.0, tTrop, tTrop + 0.35].map((t) => ({ t, type: "beep", gain: 0.7 })).concat([{ t: tEnd - 0.3, type: "stamp" }]),
        punches: [{ t: tAgr, amp: 0.03 }, { t: tTrop, amp: 0.04 }, { t: tCoin + 0.4, amp: 0.04 }],
      };
    })(),

    // « Et sur une peau mate ou noire, elle réagit souvent plus fort. » — (variantes proposées, version provisoire)
    compare: (() => {
      const dur = X.dur("compare"), tStrong = R("compare", "plus fort");
      const rot = (id, speed) => A(`${id}-gear`, 0, dur, { r: 0 }, { r: Math.round(dur * speed) }, { ease: "lin", origin: [190, 62], sfx: false });
      return {
        svg: decor(C) + factory(C, 250, 1610, 0.42, "fs") + factory(C, 715, 1560, 0.95, "fb") + siren(C, 655, 1560 - 212 * 0.95 - 20, 0.7, "siren") +
          tag(C, 250, 800, 380, 90, "PEAU CLAIRE", { id: "tL", fontSize: 38, color: C.solution, seed: 10 }) + tag(C, 715, 790, 470, 90, "MATE OU NOIRE", { id: "tD", fontSize: 38, color: C.alert, seed: 11 }),
        anims: [
          POP("fs", 0.05, [250, 1610]), POP("tL", 0.1, [250, 800]), rot("fs", 40),
          POP("fb", R("compare", "mate"), [715, 1560]), POP("tD", R("compare", "mate", 0.1), [715, 790]), rot("fb", 300),
          ...Array.from({ length: 8 }, (_, k) => puff("fb", R("compare", "mate", 0.3) + k * 0.28, k)),
          A("fb-red", tStrong, 0.4, { o: 0 }, { o: 1 }, { ease: "lin", sfx: false }), POP("siren", tStrong, [655, 1560 - 212 * 0.95 - 20], { sfx: "beep" }),
        ],
        loops: [{ id: "siren", prop: "s", amp: 0.14, freq: 4, start: tStrong, origin: [655, 1560 - 212 * 0.95 - 20] }],
        cam: FIXED, punches: [{ t: tStrong, amp: 0.04 }],
      };
    })(),
  };
}
