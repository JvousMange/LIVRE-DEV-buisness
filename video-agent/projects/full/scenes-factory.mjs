// Le processus de création des taches : UNE usine sous la peau, dans un plan à cadrage fixe, volontairement hyperbolique.
// Ce qui dynamise : chaque cause (bouton, rasage, soleil, hormones) frappe l'usine d'un éclair et la fait GROSSIR ; elle tremble,
// crache une fumée énorme et sombre, ses fenêtres clignotent ; le rythme de production passe de calme à fou, puis le tuyau se bloque.
import { hangingSign, layer, blob, poly } from "../../engine/paper.mjs";
import { stain, tag, sun, cross } from "../../library/components.mjs";
import { razor, pimple, padlock, factory as factoryRaw, siren, pipeLine, bolt, gauge, flame } from "../../library/components2.mjs";
import { decorB } from "../../library/decors.mjs";
import { A, POP, FADEIN, FADEOUT, DROP } from "./kit.mjs";

export function scenesF(C, X, opts = {}) {
  const decor = opts.decor || decorB;
  const R = (n, p, o) => X.rel(n, p, o);
  const FX = 360, FY = 1560, FS = 0.85, PX = 900, OUT = [620, FY + 60], BASE = [FX, FY + 170 * FS];
  const FCOL = { body: "#CF9068", roof: "#B5724B", chimney: "#E8D0A8", cap: "#7A4E32", base: "#7A4E32", gear: "#E3B08C" };
  const factory = (C2, cx, cy, s, id) => factoryRaw(C2, cx, cy, s, id, FCOL);
  const FIXED = { from: { s: 0.95, y: -310 }, to: { s: 0.95, y: -310 }, ease: "lin" };      // cadrage fixe
  const ringAt = (cx, cy, rx, ry, id, w = 14) => `<g id="${id}"><g filter="url(#paper4)"><ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="none" stroke="${C.alert}" stroke-width="${w}"/></g></g>`;
  const stainW = `<g id="stainW"><g transform="translate(${PX} 905) scale(.78) translate(-540 -905)">${stain(C, "stainIn")}</g></g>`;
  const grain = (id, seed) => `<g id="${id}">` + layer(blob(OUT[0], OUT[1], 17, 17, { jitter: 0.1, n: 8, seed }), C.problem, 6) + `</g>`;
  const grainAnims = (id, t, yEnd, fade) => {
    const dist = OUT[1] - yEnd, dTravel = dist / 470;
    return [
      POP(id, t, OUT, { from: { s: 0 }, to: { s: 1 }, sfx: false }),
      A(id, t + 0.3, 0.45, { x: 0, y: 0 }, { x: PX - OUT[0], y: 0 }, { ease: "lin", late: true }),
      A(id, t + 0.75, dTravel, { x: PX - OUT[0], y: 0 }, { x: PX - OUT[0], y: -dist }, { ease: "lin", late: true }),
      ...(fade ? [A(id, t + 0.75 + dTravel, 0.25, { o: 1 }, { o: 0 }, { ease: "lin", late: true })] : []),
    ];
  };
  // Panache de fumée énorme : 8 clairs (calme) puis 16 sombres (agitation) réutilisés en rotation.
  const smokeAnim = (idx, t, reuse) => A(`fac-sm${idx}`, t, 1.4, { y: 0, s: 0.5, o: 0.95 }, { y: -520, s: 3.2, o: 0 }, { ease: "outCubic", origin: [200, -340], late: reuse, sfx: false });

  return {
    // « Voilà ce qui se passe. Ta peau fabrique de la mélanine : c'est ce qui lui donne sa couleur. Quand elle est agressée,
    //   par un bouton, un rasage, le soleil ou les hormones, elle en fabrique trop, à cet endroit précis.
    //   Cette mélanine reste coincée sous la peau. »
    usine: (() => {
      const dur = X.dur("usine");
      const tFab = R("usine", "peau fabrique"), tMel = R("usine", "mélanine"), tCol = R("usine", "couleur"), tAgr = R("usine", "agressée"),
        tBou = R("usine", "bouton"), tRas = R("usine", "rasage"), tSol = R("usine", "soleil"), tHor = R("usine", "hormones"),
        tTrop = R("usine", "en fabrique trop"), tEnd = R("usine", "endroit"), tPre = R("usine", "précis"), tCoin = R("usine", "coincée");
      // — production : calme → agité → débordement fou —
      const slow = [tFab + 0.2, tFab + 1.3, tFab + 2.4].filter((t) => t < tAgr - 0.3);
      const busy = []; for (let t = tAgr + 0.2; t < tTrop - 0.4; t += 0.4) busy.push(t);
      const over = []; for (let t = tTrop; t < tCoin - 0.7; t += 0.13) over.push(t);
      const STACK0 = 1075, STEP = 40;
      const ids = { s: slow.map((_, i) => `ps${i}`), b: busy.map((_, i) => `pb${i}`), o: over.map((_, i) => `po${i}`) };
      const allIds = [...ids.s, ...ids.b, ...ids.o];
      // fumée : blanche et timide au début, puis noire, dense et énorme ; elle s'arrête quand le tuyau est bloqué
      const puffs = []; let used = {};
      const add = (t, idx) => { puffs.push(smokeAnim(idx, t, !!used[idx])); used[idx] = true; };
      let k = 0; for (let t = tFab; t < tAgr; t += 0.8) add(t, k++ % 8);
      k = 0; for (let t = tAgr; t < tTrop; t += 0.14) add(t, 8 + (k++ % 16));
      for (let t = tTrop; t < tCoin + 0.2; t += 0.09) add(t, 8 + (k++ % 16));
      // l'usine grossit à chaque cause (depuis sa base), avec rebond ; elle se dégonfle un peu quand le tuyau se bouche
      const stages = [[tBou, 1.15], [tRas, 1.32], [tSol, 1.5], [tHor, 1.66], [tTrop, 1.8], [tCoin + 0.3, 1.5]];
      let prev = 1;
      const grow = stages.map(([t, s2], i) => { const a = A("facw", t, 0.5, { s: prev }, { s: s2 }, { ease: "outBack", origin: BASE, late: true, sfx: [{ type: "thud", dt: 0.12, gain: 0.8 }] }); prev = s2; return a; });
      const rot = (t0, t1, from, speed) => A("fac-gear", t0, Math.max(0.1, t1 - t0), { r: from }, { r: from + (t1 - t0) * speed }, { ease: "lin", origin: [190, 62], late: t0 > 0, sfx: false });
      const r1 = tAgr * 40, r2 = r1 + (tTrop - tAgr) * 360, r3 = r2 + (dur - tTrop) * 700;
      const roof = FY - 200 * FS;
      const hit = (id, x1, y1, x2, t) => [POP(id, t - 0.05, [x2, roof], { from: { s: 0 }, to: { s: 1 }, sfx: "stamp", ease: "outBack" }), FADEOUT(id, t + 0.35, 0.25)];
      return {
        svg: decor(C) + pipeLine(C, PX, 940, OUT[1], 565, "pipe") + stainW +
          `<g id="facw">${factory(C, FX, FY, FS, "fac")}${siren(C, FX - 40, FY - 215 * FS - 18, 0.55, "siren")}</g>` +
          allIds.map((id, i) => grain(id, 1600 + i)).join("") +
          pimple(C, 260, 850, 1.2, "pim") + razor(C, 560, 620, 0.85, "razor") + sun(C, 820, 520) + tag(C, 300, 470, 420, 100, "HORMONES", { id: "hor", fontSize: 46, color: C.alert, seed: 8 }) +
          bolt(C, 260, 880, FX - 70, roof, "bl1") + bolt(C, 560, 760, FX - 10, roof, "bl2") + bolt(C, 820, 640, FX + 60, roof, "bl3") + bolt(C, 300, 540, FX + 20, roof, "bl4") +
          `<g id="sign">${hangingSign(540, 640, 600, 180, ["MÉLANINE"], { palette: C, fontSize: 88, seed: 4 })}</g>` +
          ringAt(PX, 905, 300, 70, "ring", 12) + tag(C, PX, 690, 300, 100, "ICI", { id: "ici", fontSize: 60, color: C.alert, seed: 9 }) + padlock(C, PX, 1010, 0.8, "lock") +
          `<g id="veil"><rect x="-300" y="-400" width="1700" height="2800" fill="rgb(255,247,230)"/></g>`,
        anims: [
          A("veil", 0, 0.4, { o: 1 }, { o: 0 }, { ease: "lin", sfx: false }), POP("fac", 0.1, [FX, FY]),
          ...puffs, ...grow,
          rot(0, tAgr, 0, 40), rot(tAgr, tTrop, r1, 360), rot(tTrop, dur, r2, 700),
          DROP("sign", tMel, [540, 0]), FADEOUT("sign", tAgr - 0.1, 0.35), FADEIN("surfTint", tCol, 0.9),
          ...slow.flatMap((t, i) => grainAnims(ids.s[i], t, 955, true)),
          ...busy.flatMap((t, i) => grainAnims(ids.b[i], t, 955, true)),
          ...over.flatMap((t, i) => grainAnims(ids.o[i], t, STACK0 + i * STEP, false)),
          // chaque cause : le déclencheur arrive, un éclair frappe l'usine, qui grossit
          POP("siren", tAgr, [FX - 40, FY - 215 * FS - 18], { sfx: "beep" }), A("fac-red", tAgr, 0.3, { o: 0 }, { o: 1 }, { ease: "lin", sfx: false }),
          POP("pim", tBou - 0.1, [260, 850]), ...hit("bl1", 260, 880, FX - 70, tBou),
          DROP("razor", tRas - 0.1, [560, 620]), ...hit("bl2", 560, 760, FX - 10, tRas),
          POP("sun", tSol - 0.1, [820, 520]), POP("sun-rays", tSol - 0.1, [820, 520], { sfx: false }), ...hit("bl3", 820, 640, FX + 60, tSol),
          POP("hor", tHor - 0.1, [300, 470]), ...hit("bl4", 300, 540, FX + 20, tHor),
          ...["pim", "razor", "sun", "sun-rays", "hor"].map((id) => FADEOUT(id, tTrop - 0.1, 0.35)),
          POP("stainW", tEnd - 0.3, [PX, 905]), POP("ring", tEnd, [PX, 905]), POP("ici", tPre, [PX, 690]),
          DROP("lock", tCoin, [PX, 1010]),
        ],
        loops: [
          { id: "facw", prop: "x", amp: 7, freq: 11, start: tAgr, origin: BASE }, { id: "facw", prop: "r", amp: 0.9, freq: 9, start: tAgr, origin: BASE },
          { id: "fac-red", prop: "o", amp: 0.45, freq: 4, start: tAgr + 0.3, origin: [0, 0] },
          { id: "siren", prop: "s", amp: 0.16, freq: 4, start: tAgr, origin: [FX - 40, FY - 215 * FS - 18] },
        ],
        cam: FIXED,
        sfx: [tAgr, tAgr + 0.5, tAgr + 1.0, tTrop, tTrop + 0.35].map((t) => ({ t, type: "beep", gain: 0.7 })).concat([{ t: tEnd - 0.3, type: "stamp" }]),
        punches: [tBou, tRas, tSol, tHor, tTrop].map((t) => ({ t, amp: 0.045 })).concat([{ t: tCoin + 0.4, amp: 0.05 }]),
      };
    })(),

    // « Et sur une peau mate ou noire, elle réagit souvent plus fort. » — deux jauges de production.
    compare: (() => {
      const tM = R("compare", "mate"), tS = R("compare", "plus fort");
      return {
        svg: gauge(C, 268, 960, 0.78, "gA") + gauge(C, 812, 960, 0.78, "gB") +
          tag(C, 268, 600, 440, 90, "PEAU CLAIRE", { id: "tgA", fontSize: 40, color: C.solution, seed: 3 }) + tag(C, 812, 600, 520, 90, "MATE OU NOIRE", { id: "tgB", fontSize: 40, color: C.alert, seed: 4 }) + flame(C, 812, 1340, 0.7, "fire"),
        anims: [
          POP("gA", 0.05, [268, 960]), POP("tgA", 0.1, [268, 600]), A("gA-needle", 0.3, 0.9, { r: -90 }, { r: -35 }, { ease: "outBack", origin: [0, 0] }),
          POP("gB", tM, [812, 960]), POP("tgB", tM + 0.1, [812, 600]), A("gB-needle", Math.max(tM + 0.3, tS - 0.5), 0.9, { r: -90 }, { r: 95 }, { ease: "outBack", origin: [0, 0] }),
          POP("fire", tS, [812, 1340]),
        ],
        loops: [{ id: "gB-needle", prop: "r", amp: 6, freq: 5, start: tS, origin: [0, 0] }],
        cam: { from: { s: 1.0, y: 0 }, to: { s: 1.05, y: 0 }, ease: "lin" }, punches: [{ t: tS, amp: 0.05 }],
      };
    })(),
  };
}
