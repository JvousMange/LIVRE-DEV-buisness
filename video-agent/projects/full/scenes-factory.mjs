// Le processus de création des taches : UNE usine sous la peau, dans un plan à cadrage fixe, volontairement hyperbolique.
// Ce qui dynamise : chaque cause (bouton, rasage, soleil, hormones) frappe l'usine d'un éclair et la fait GROSSIR ; elle tremble,
// crache une fumée énorme et sombre, ses fenêtres clignotent ; le rythme de production passe de calme à fou, puis le tuyau se bloque.
import { hangingSign, layer, blob, poly, arrowPts } from "../../engine/paper.mjs";
import { stain, tag, sun, cross, woman } from "../../library/components.mjs";
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
        tBou = R("usine", "bouton", 0.38), tRas = R("usine", "rasage", 0.38), tSol = R("usine", "soleil", 0.38), tHor = R("usine", "hormones", 0.38),   // l'éclair tombe SUR le mot
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
      const hit = (id, x1, y1, x2, t) => [
        A(id, t - 0.12, 0.12, { s: 0 }, { s: 1 }, { origin: [x1, y1], ease: "outCubic", sfx: "zap" }), FADEOUT(id, t + 0.55, 0.25),
        A("flash", t - 0.1, 0.05, { o: 0 }, { o: 0.6 }, { ease: "lin", late: true, sfx: false }), A("flash", t - 0.05, 0.3, { o: 0.6 }, { o: 0 }, { ease: "lin", late: true, sfx: false }),
      ];
      return {
        svg: decor(C) + pipeLine(C, PX, 940, OUT[1], 565, "pipe") + stainW +
          `<g id="facw">${factory(C, FX, FY, FS, "fac")}${siren(C, FX - 40, FY - 215 * FS - 18, 0.55, "siren")}</g>` +
          allIds.map((id, i) => grain(id, 1600 + i)).join("") +
          bolt(C, 230, 330, FX - 70, roof, "bl1", 64) + bolt(C, 520, 300, FX - 10, roof, "bl2", 64) + bolt(C, 800, 340, FX + 60, roof, "bl3", 64) + bolt(C, 130, 380, FX + 20, roof, "bl4", 64) +
          ringAt(PX, 905, 300, 70, "ring", 12) + padlock(C, PX, 1010, 0.8, "lock") +
          `<g id="flash" opacity="0"><rect x="-300" y="-600" width="1700" height="3200" fill="rgb(255,247,230)"/></g>` +
          `<g id="veil"><rect x="-300" y="-400" width="1700" height="2800" fill="rgb(255,247,230)"/></g>`,
        anims: [
          A("veil", 0, 0.4, { o: 1 }, { o: 0 }, { ease: "lin", sfx: false }), POP("fac", 0.1, [FX, FY]),
          ...puffs, ...grow,
          rot(0, tAgr, 0, 40), rot(tAgr, tTrop, r1, 360), rot(tTrop, dur, r2, 700),
          FADEIN("surfTint", tCol, 0.9),
          ...slow.flatMap((t, i) => grainAnims(ids.s[i], t, 955, true)),
          ...busy.flatMap((t, i) => grainAnims(ids.b[i], t, 955, true)),
          ...over.flatMap((t, i) => grainAnims(ids.o[i], t, STACK0 + i * STEP, false)),
          // chaque cause : le déclencheur arrive, un éclair frappe l'usine, qui grossit
          POP("siren", tAgr, [FX - 40, FY - 215 * FS - 18], { sfx: "beep" }), A("fac-red", tAgr, 0.3, { o: 0 }, { o: 1 }, { ease: "lin", sfx: false }),
          ...hit("bl1", 230, 330, FX - 70, tBou), ...hit("bl2", 520, 300, FX - 10, tRas), ...hit("bl3", 800, 340, FX + 60, tSol), ...hit("bl4", 130, 380, FX + 20, tHor),
          POP("stainW", tEnd - 0.3, [PX, 905]), POP("ring", tEnd, [PX, 905]),
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

    // « Et sur une peau mate ou noire, elle réagit souvent plus fort. » — trois femmes (de métisse à noire), puis un régulateur qui s'emballe.
    compare: (() => {
      const tP = R("compare", "peau"), tR = R("compare", "réagit"), tF = R("compare", "plus fort");
      const WX = [200, 540, 880], TONE = ["mixed", "deep", "dark"];
      const women = WX.map((x, i) => `<g id="w${i}">${woman(C, { cx: x, cy: 500, scale: 0.4, spotsOn: false, mirrorOn: false, tone: TONE[i] })}</g>`).join("");
      return {
        svg: `<clipPath id="wclip"><rect x="30" y="250" width="1020" height="520"/></clipPath>` +
          layer(poly([[30, 250], [1050, 250], [1050, 770], [30, 770]], { round: false }), "#E8D0A8", 2) + `<g clip-path="url(#wclip)">${women}</g>` +
          `<g id="arr">${layer(poly(arrowPts(540, 800, 540, 940, 46, 130, 80), { round: false }), C.dark, 5)}</g>` +
          gauge(C, 540, 1230, 0.8, "gA") + flame(C, 790, 1020, 2.7, "fire") + flame(C, 940, 1130, 1.7, "fire2"),
        anims: [
          ...[0, 1, 2].map((i) => A(`w${i}`, tP + i * 0.28, 0.45, { y: 460 }, { y: 0 }, { ease: "outBack", sfx: "pop" })),
          POP("arr", tR - 0.1, [540, 800], { sfx: "pop" }), POP("gA", tR, [540, 1230]),
          A("gA-needle", tR + 0.2, 0.5, { r: -90 }, { r: -20 }, { ease: "outBack", origin: [0, 0], sfx: false }),
          A("gA-needle", Math.max(tR + 0.9, tF - 0.15), 0.45, { r: -20 }, { r: 105 }, { ease: "outBack", origin: [0, 0], late: true, sfx: "rise" }),
          POP("fire", tF + 0.1, [790, 1170], { sfx: "whoosh" }), POP("fire2", tF + 0.3, [940, 1210], { sfx: false }),
        ],
        loops: [
          { id: "gA-needle", prop: "r", amp: 6, freq: 6, start: tF + 0.6, origin: [0, 0] },
          { id: "fire", prop: "s", amp: 0.1, freq: 3.2, start: tF + 0.6, origin: [790, 1170] }, { id: "fire", prop: "r", amp: 3, freq: 2.4, start: tF + 0.6, origin: [790, 1170] },
          { id: "fire2", prop: "s", amp: 0.12, freq: 4.1, start: tF + 0.6, origin: [940, 1210] },
        ],
        cam: { from: { s: 1.0, y: 0 }, to: { s: 1.04, y: 0 }, ease: "lin" }, punches: [{ t: tF + 0.1, amp: 0.06 }],
      };
    })(),
  };
}
