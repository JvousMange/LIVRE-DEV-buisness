// Annonce « anti-tache post-acné » : 3 hooks interchangeables (hookMec / hookRetouche / hookPeau) + un corps identique.
import { layer, blob, poly, arrowPts } from "../../engine/paper.mjs";
import { skin, stain, melanocyte, granuleSpecs, granule, cross, tag, woman, bottle, skinHand, SPOTS, MEL, HAND_SKIN } from "../../library/components.mjs";
import { check, jar, gauge, shield2, button, loupe, bolt, stopSign, padlock, pimple, flame } from "../../library/components2.mjs";
import { A, POP, FADEIN, FADEOUT, DROP, SLOW } from "../full/kit.mjs";

export function scenes(C, X) {
  // un plan absent du script courant ne doit pas faire échouer la construction
  const R = (n, p, o) => { try { return X.rel(n, p, o); } catch { return 0.5; } };
  const D = (n) => { try { return X.dur(n); } catch { return 4; } };
  const ringAt = (cx, cy, rx, ry, id, w = 14) => `<g id="${id}"><g filter="url(#paper4)"><ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="none" stroke="${C.alert}" stroke-width="${w}"/></g></g>`;
  const spotsLocal = (idp) => SPOTS.map((s, i) => `<g id="${idp}${i}">` + layer(blob(s.x, s.y, s.rx, s.ry, { jitter: 0.22, n: 10, seed: 500 + i }), C.dark, 6, { edge: "rgba(255,225,190,.3)" }) + `</g>`).join("");
  const TONES = ["#C28E69", "#9C6544", "#5E3A27"];

  return {
    // ───────── HOOK 1 : « Ton mec te dit que tes taches ne se voient pas, mais toi tu ne vois que ça sur tes joues ? »
    hookMec: (() => {
      const tMec = R("hookMec", "mec"), tNo = R("hookMec", "voient pas"), tToi = R("hookMec", "mais toi"), tQue = R("hookMec", "vois que ça");
      const WX = 400, WY = 900, WS = 0.95, LX = 520, LY = 965, LR = 150;
      const man = `<g id="man"><g transform="translate(850 1180)">` +
        layer("M-190 360 L-185 70 Q-170 -20 -80 -50 L80 -50 Q170 -20 185 70 L190 360Z", C.solution, 3) + layer("M-34 -110 L34 -110 L38 -40 Q0 -10 -38 -40Z", "#7C4C33", 4) +
        layer(blob(0, -190, 92, 112, { jitter: 0.02, n: 14, seed: 4301 }), "#8A5A3C", 5) + layer(blob(0, -268, 100, 44, { jitter: 0.05, n: 10, seed: 4302 }), C.dark, 6, { edge: "rgba(0,0,0,0)" }) + `</g></g>`;
      const bub = `<g id="bub">` + layer(poly([[650, 700], [1020, 700], [1020, 900], [650, 900]]), C.cream, 5) + layer(poly([[780, 890], [840, 890], [830, 960]], { round: false }), C.cream, 5) + check(C, 835, 800, 140, "okm") + `</g>`;
      const lens = `<clipPath id="lensc"><circle cx="${LX}" cy="${LY}" r="${LR - 6}"/></clipPath><g id="lens"><g clip-path="url(#lensc)"><rect x="${LX - LR}" y="${LY - LR}" width="${LR * 2}" height="${LR * 2}" fill="#9C6544"/>` +
        `<g transform="translate(${LX} ${LY}) scale(2.2) translate(${-LX} ${-LY})">${woman(C, { cx: WX, cy: WY, scale: WS, spotsOn: false, mirrorOn: false })}<g transform="translate(${WX} ${WY}) scale(${WS})">${spotsLocal("ls")}</g></g></g>${loupe(C, LX, LY, LR, "lp")}</g>`;
      return {
        svg: woman(C, { cx: WX, cy: WY, scale: WS, spotsOn: false, mirrorOn: false }) + `<g transform="translate(${WX} ${WY}) scale(${WS})">${spotsLocal("sp")}</g>` + man + bub + lens,
        anims: [
          DROP("man", Math.max(0, tMec - 0.2), [850, 1180], -900), POP("bub", tNo, [830, 800]),
          POP("lens", tToi, [LX, LY]),
          ...SPOTS.flatMap((s, i) => [POP(`sp${i}`, tQue + i * 0.07, [s.x, s.y], { sfx: false }), POP(`ls${i}`, tQue + i * 0.07, [s.x, s.y], { sfx: false })]),
          A("lens", tQue + 0.2, 0.6, { s: 1 }, { s: 1.12 }, { origin: [LX, LY], ease: "outCubic", late: true, sfx: false }),
        ],
        loops: [{ id: "lens", prop: "s", amp: 0.03, freq: 2.2, start: tQue + 0.9, origin: [LX, LY] }],
        cam: SLOW(1.0, 1.1, 0, 60), punches: [{ t: tQue, amp: 0.04 }],
      };
    })(),

    // ───────── HOOK 2 : « Tu retouches tes photos parce que les taches qu'ont laissées tes boutons gâchent tout ? Regarde ça. »
    hookRetouche: (() => {
      const tRet = R("hookRetouche", "retouches"), tGache = R("hookRetouche", "gâchent"), tReg = R("hookRetouche", "regarde", -0.1), dur = D("hookRetouche");
      const phone = layer(poly([[250, 300], [830, 300], [830, 1420], [250, 1420]]), C.dark, 4) + layer(poly([[285, 360], [795, 360], [795, 1360], [285, 1360]]), "#E8D0A8", 5);
      const slider = `<g id="sld"><g filter="url(#paper1)"><line x1="360" y1="1300" x2="720" y2="1300" stroke="${C.dark}" stroke-width="10" stroke-linecap="round" opacity=".5"/></g><g id="knob">${layer(blob(375, 1300, 28, 28, { jitter: 0.02, n: 10, seed: 4310 }), C.alert, 7)}</g></g>`;
      return {
        svg: phone + `<clipPath id="scr"><rect x="285" y="360" width="510" height="1000"/></clipPath><g clip-path="url(#scr)">${woman(C, { cx: 540, cy: 800, scale: 0.7, mirrorOn: false })}</g>` + slider,
        anims: [
          A("knob", tRet, 0.7, { x: 0 }, { x: 330 }, { ease: "inOut", sfx: false }),
          ...SPOTS.map((s, i) => A(`sp${i}`, tRet + 0.1 + i * 0.07, 0.3, { o: 1 }, { o: 0 }, { ease: "lin", sfx: false })),
          A("knob", tGache - 0.1, 0.3, { x: 330 }, { x: 0 }, { ease: "outCubic", late: true, sfx: false }),
          ...SPOTS.map((s, i) => A(`sp${i}`, tGache + i * 0.04, 0.25, { o: 0, s: 0 }, { o: 1, s: 1 }, { origin: [s.x, s.y], ease: "outBack", late: true, sfx: false })),
        ],
        loops: [],
        cam: [
          { t0: 0, t1: Math.max(0.3, tReg), from: { s: 1.0, y: 0 }, to: { s: 1.0, y: 0 }, ease: "lin" },
          { t0: Math.max(0.3, tReg), t1: Math.max(tReg + 0.4, dur), from: { s: 1.0, y: 0 }, to: { s: 1.5, y: 150 }, ease: "inOut" },
        ],
        sfx: [{ t: tGache + 0.05, type: "thud", gain: 0.6 }], punches: [{ t: tGache, amp: 0.04 }],
      };
    })(),

    // ───────── HOOK 3 : « T'as la peau mate ou noire : tes boutons sont partis, mais les taches sont toujours là ? Écoute ça. »
    hookPeau: (() => {
      const tPeau = R("hookPeau", "mate"), tPartis = R("hookPeau", "partis"), tLa = R("hookPeau", "toujours");
      const WX = 540, WY = 1120, WS = 0.85;
      const cards = TONES.map((c, i) => `<g id="cd${i}">` + layer(blob(250 + i * 290, 430, 118, 168, { jitter: 0.02, n: 16, seed: 4320 + i }), C.cream, 3) + layer(blob(250 + i * 290, 430, 96, 146, { jitter: 0.03, n: 16, seed: 4330 + i }), c, 4) + `</g>`).join("");
      const pims = SPOTS.slice(0, 8).map((s, i) => `<g id="pm${i}">` + layer(blob(s.x * 1.0, s.y * 1.0 - 4, 17, 17, { jitter: 0.08, n: 9, seed: 4340 + i }), C.alert, 7) + layer(blob(s.x - 4, s.y - 9, 5, 4, { n: 6, seed: 4350 + i }), "#F2C56A", 8) + `</g>`).join("");
      return {
        svg: cards + woman(C, { cx: WX, cy: WY, scale: WS, spotsOn: false, mirrorOn: false }) + `<g transform="translate(${WX} ${WY}) scale(${WS})">${pims}${spotsLocal("sp")}</g>`,
        anims: [
          ...TONES.map((_, i) => POP(`cd${i}`, tPeau + i * 0.2, [250 + i * 290, 430])),
          ...SPOTS.slice(0, 8).map((s, i) => A(`pm${i}`, tPartis + i * 0.05, 0.3, { o: 1, s: 1 }, { o: 0, s: 0 }, { origin: [s.x, s.y], ease: "inCubic", sfx: false })),
          ...SPOTS.map((s, i) => POP(`sp${i}`, tLa + i * 0.07, [s.x, s.y], { sfx: false })),
        ],
        loops: [],
        cam: SLOW(1.0, 1.1, 0, 40), punches: [{ t: tLa, amp: 0.04 }],
      };
    })(),

    // ───────── CORPS 1 : « Voilà ce qui se passe. Quand ta peau est agressée, elle fabrique trop de mélanine, à cet endroit précis. Elle reste coincée sous la surface, et plus fort sur une peau mate. »
    mecanisme: (() => {
      const gr = granuleSpecs(), tAgr = R("mecanisme", "agressée"), tTrop = R("mecanisme", "trop"), tPre = R("mecanisme", "précis"), tCo = R("mecanisme", "coincée"), tMate = R("mecanisme", "mate");
      return {
        svg: skin(C) + stain(C) + melanocyte(C) + gr.map((g) => granule(C, g)).join("") + ringAt(540, 905, 300, 70, "ring", 12) + padlock(C, 540, 1040, 0.9, "lock") +
          bolt(C, 500, 560, 540, 905, "bl1", 56),
        anims: [
          A("bl1", tAgr - 0.1, 0.12, { s: 0 }, { s: 1 }, { origin: [500, 560], ease: "outCubic", sfx: "zap" }), FADEOUT("bl1", tAgr + 0.5, 0.25),
          A("stain", tAgr, 0.5, { o: 0, s: 0.2 }, { o: 1, s: 1 }, { origin: [540, 905], ease: "outBack", sfx: false }),
          ...gr.map((g, i) => {
            const off = { x: g.from[0] - g.to[0], y: g.from[1] - g.to[1] };
            return A(g.id, tTrop + i * 0.05, 0.45, { ...off, s: 0 }, { x: 0, y: 0, s: 1 }, { origin: g.to, ease: "outCubic", sfx: false });
          }),
          POP("ring", tPre, [540, 905], { sfx: "stamp" }),
          DROP("lock", Math.max(0, tCo - 0.1), [540, 1040], -900),
          A("mel", tMate, 0.5, { s: 1 }, { s: 1.3 }, { origin: MEL, ease: "outBack", late: true, sfx: false }), A("stain", tMate, 0.6, { s: 1 }, { s: 1.45 }, { origin: [540, 905], ease: "outBack", late: true, sfx: false }),
        ],
        loops: [{ id: "mel", prop: "s", amp: 0.035, freq: 2.4, start: tTrop, origin: MEL }],
        cam: { from: { s: 1.6, y: -215 }, to: { s: 1.55, y: -190 }, ease: "lin" }, punches: [{ t: tAgr, amp: 0.05 }],
      };
    })(),

    // ───────── CORPS 2 : « Gommer, couvrir, frotter : ça ne touche que la surface. Ce n'est pas ta peau qui est en cause. »
    surface: (() => {
      const tGom = R("surface", "gommer"), tCou = R("surface", "couvrir"), tFro = R("surface", "frotter"), tSur = R("surface", "surface"), tPeau = R("surface", "peau");
      return {
        svg: skin(C) + stain(C) + jar(C, 250, 730, { s: 1.1, label: "", id: "jarg" }) + `<g id="brs"><g transform="translate(830 700) rotate(35)">${brushShape()}</g></g>` + skinHand(C) + cross(C, 540, 900, 330, "x1") + check(C, 540, 1150, 240, "okc"),
        anims: [
          DROP("jarg", Math.max(0, tGom), [250, 730], -900),
          A("brs", Math.max(0, tCou), 0.4, { x: 400, y: -200, o: 0 }, { x: 0, y: 0, o: 1 }, { ease: "outBack", sfx: "whoosh" }),
          A("hand", Math.max(0, tFro), 0.45, { x: 520, y: -430 }, { x: 0, y: 0 }, { ease: "outCubic", origin: HAND_SKIN, sfx: "whoosh" }),
          POP("x1", tSur, [540, 900]), FADEOUT("hand", tSur + 0.1, 0.3, { sfx: false }),
          POP("okc", tPeau, [540, 1150]),
        ],
        loops: [{ id: "hand", prop: "x", amp: 95, freq: 1.9, start: tFro + 0.5, origin: HAND_SKIN }, { id: "brs", prop: "y", amp: 18, freq: 2.2, start: tCou + 0.5, origin: [830, 700] }],
        cam: { from: { s: 1.6, y: -215 }, to: { s: 1.55, y: -190 }, ease: "lin" }, punches: [{ t: tSur, amp: 0.05 }],
      };
    })(),

    // ───────── CORPS 3 : « Mela Skin freine la fabrication du pigment à la source. »  (vrai STOP)
    stop: (() => {
      const tg = R("stop", "freine"), tSrc = R("stop", "source"), X0 = 540;
      const gran = []; for (let k = 0; k < 10; k++) { const t = 0.1 + k * 0.26; if (t < tg - 0.2) gran.push({ id: `fl${k}`, t }); }
      return {
        svg: skin(C) + melanocyte(C) +
          gran.map((g) => `<g id="${g.id}">` + layer(blob(X0 + ((g.t * 37) % 60) - 30, 1190, 24, 24, { jitter: 0.1, n: 8, seed: 1300 }), C.problem, 5) + `</g>`).join("") +
          stopSign(C, 540, 1010, 0.95, "stop", false) + ringAt(MEL[0], MEL[1], 245, 210, "ring", 14),
        anims: [
          ...gran.flatMap((g) => [A(g.id, g.t, 0.25, { s: 0 }, { s: 1 }, { origin: [X0, 1190], ease: "outBack", sfx: false }), A(g.id, g.t, 1.3, { y: 0 }, { y: -330 }, { ease: "lin", origin: [X0, 1190], late: true, sfx: false }), FADEOUT(g.id, tg + 0.05, 0.2, { sfx: false })]),
          A("stop", tg - 0.15, 0.4, { y: -1500, r: -10 }, { y: 0, r: 0 }, { ease: "outBack", origin: [540, 1010], sfx: [{ type: "whoosh", gain: 0.6 }, { type: "stamp", dt: 0.32, gain: 1 }] }),
          POP("ring", tSrc, MEL),
        ],
        loops: [{ id: "mel", prop: "s", amp: 0.04, freq: 2.4, start: 0.2, origin: MEL }, { id: "stop", prop: "r", amp: 2.2, freq: 7, start: tg + 0.5, origin: [540, 1010] }],
        punches: [{ t: tg + 0.2, amp: 0.07 }], cam: { from: { s: 1.6, y: -215 }, to: { s: 1.55, y: -190 }, ease: "lin" },
      };
    })(),

    // ───────── CORPS 4 : « Quatre actifs, un seul flacon. »
    actifs: (() => {
      const chips = [
        { id: "c0", x: 190, y: 560, t: "AZÉLAÏQUE", from: -700 }, { id: "c1", x: 890, y: 700, t: "ARBUTINE", from: 700 },
        { id: "c2", x: 190, y: 840, t: "TRANEXAMIQUE", from: -700 }, { id: "c3", x: 890, y: 980, t: "NIACINAMIDE", from: 700 },
      ];
      const tQ = R("actifs", "quatre"), tU = R("actifs", "un seul");
      return {
        svg: bottle(C, 540, 940, 1.2, "bottle") + chips.map((c) => tag(C, c.x, c.y, 340, 90, c.t, { id: c.id, fontSize: 30, color: C.solution, seed: 20 })).join(""),
        anims: [
          POP("bottle", Math.max(0, tQ - 0.3), [540, 940]),
          ...chips.flatMap((c, i) => [
            A(c.id, tQ + i * 0.18, 0.45, { x: c.from, o: 0 }, { x: 0, o: 1 }, { ease: "outCubic", sfx: i === 0 ? "whoosh" : false }),
            A(c.id, tU + i * 0.18, 0.6, { x: 0, y: 0, s: 1 }, { x: 540 - c.x, y: 940 - c.y, s: 0.2 }, { ease: "inCubic", origin: [c.x, c.y], late: true, sfx: false }),
            FADEOUT(c.id, tU + i * 0.18 + 0.5, 0.2),
          ]),
        ],
        loops: [{ id: "bottle", prop: "s", amp: 0.025, freq: 1.5, start: tU + 1.0, origin: [540, 940] }],
        cam: SLOW(1.0, 1.1, 0, 0),
      };
    })(),

    // ───────── CORPS 5 : « Pensé pour les peaux mates et noires. Pas pour éclaircir : pour réguler. »
    identite: (() => {
      const tM = R("identite", "mates"), tE = R("identite", "éclaircir"), tR = R("identite", "réguler");
      const WX = [200, 540, 880], TONE = ["mixed", "deep", "dark"];
      const women = WX.map((x, i) => `<g id="w${i}">${woman(C, { cx: x, cy: 500, scale: 0.4, spotsOn: false, mirrorOn: false, tone: TONE[i] })}</g>`).join("");
      return {
        svg: `<clipPath id="wclip"><rect x="30" y="250" width="1020" height="520"/></clipPath>` + layer(poly([[30, 250], [1050, 250], [1050, 770], [30, 770]], { round: false }), "#E8D0A8", 2) + `<g clip-path="url(#wclip)">${women}</g>` +
          `<g id="arrL">${layer(poly(arrowPts(300, 900, 780, 900, 40, 110, 100), { round: false }), C.dark, 5)}</g>` + cross(C, 540, 900, 300, "xl") + gauge(C, 540, 1230, 0.8, "gA"),
        anims: [
          ...[0, 1, 2].map((i) => A(`w${i}`, Math.max(0, tM) + i * 0.22, 0.45, { y: 460 }, { y: 0 }, { ease: "outBack", sfx: "pop" })),
          A("arrL", Math.max(0, tE - 0.2), 0.5, { s: 0 }, { s: 1 }, { origin: [300, 900], ease: "outCubic", sfx: false }), POP("xl", tE + 0.3, [540, 900]),
          POP("gA", tR - 0.1, [540, 1230], { sfx: false }), A("gA-needle", tR + 0.1, 0.7, { r: -85 }, { r: 0 }, { ease: "outBack", origin: [0, 0], sfx: false }),
        ],
        loops: [{ id: "gA-needle", prop: "r", amp: 5, freq: 3, start: tR + 0.9, origin: [0, 0] }],
        cam: { from: { s: 1.0, y: 0 }, to: { s: 1.04, y: 0 }, ease: "lin" },
      };
    })(),

    // ───────── CORPS 6 : « Cette semaine, pour deux flacons achetés, un offert. »
    offre: (() => {
      const plus = (cx, cy, id) => `<g id="${id}">` + layer(poly([[cx - 60, cy - 14], [cx + 60, cy - 14], [cx + 60, cy + 14], [cx - 60, cy + 14]], { round: false }), C.alert, 5) + layer(poly([[cx - 14, cy - 60], [cx + 14, cy - 60], [cx + 14, cy + 60], [cx - 14, cy + 60]], { round: false }), C.alert, 5) + `</g>`;
      const eq = (cx, cy, id) => `<g id="${id}">` + [-28, 28].map((dy) => layer(poly([[cx - 62, cy + dy - 13], [cx + 62, cy + dy - 13], [cx + 62, cy + dy + 13], [cx - 62, cy + dy + 13]], { round: false }), C.alert, 5)).join("") + `</g>`;
      const t1 = R("offre", "deux"), tp = t1 + 0.4, t2 = Math.max(tp + 0.4, R("offre", "flacons")), te = Math.max(t2 + 0.5, R("offre", "achetés")), t3 = Math.max(te + 0.4, R("offre", "offert", -0.4)), to = Math.max(t3 + 0.35, R("offre", "offert"));
      return {
        svg: bottle(C, 150, 1010, 0.8, "b1") + plus(305, 1010, "plus") + bottle(C, 460, 1010, 0.8, "b2") + eq(615, 1010, "eq") + bottle(C, 880, 1010, 0.95, "b3") + tag(C, 880, 640, 300, 100, "OFFERT", { id: "off", fontSize: 54, color: C.alert, seed: 22 }),
        anims: [
          POP("b1", t1, [150, 1010]), POP("plus", tp, [305, 1010]), POP("b2", t2, [460, 1010]), POP("eq", te, [615, 1010]),
          DROP("b3", t3 - 0.1, [880, 1010], -700), POP("off", to, [880, 640]),
        ],
        loops: [{ id: "b3", prop: "s", amp: 0.03, freq: 2, start: to + 0.5, origin: [880, 1010] }],
        cam: SLOW(1.0, 1.08, 0, 0), punches: [{ t: to, amp: 0.05 }],
      };
    })(),

    // ───────── CORPS 7 : « Et si tes taches sont toujours là au bout de quatre-vingt-dix jours, on te rembourse. »
    garantie: (() => {
      const tJ = R("garantie", "quatre-vingt-dix"), tR = R("garantie", "rembourse");
      return {
        svg: shield2(C, 540, 760, 1.5, "shield") + tag(C, 540, 1230, 580, 170, "90 JOURS", { id: "d90", fontSize: 100, color: C.solution, seed: 23 }),
        anims: [POP("d90", Math.max(0, tJ), [540, 1230]), POP("shield", Math.max(tJ + 0.5, tR), [540, 760])],
        loops: [], cam: SLOW(1.0, 1.08, 0, 0),
      };
    })(),

    // ───────── CORPS 8 : « Touche le bouton. »
    cta: (() => {
      const tB = R("cta", "bouton");
      return {
        svg: bottle(C, 540, 760, 1.5, "bottle") + button(C, 540, 1260, 720, 170, "COMMANDER", "btn") +
          `<g id="ar1">${layer(poly(arrowPts(150, 1010, 260, 1160, 46, 120, 110), { round: false }), C.alert, 6)}</g><g id="ar2">${layer(poly(arrowPts(930, 1010, 820, 1160, 46, 120, 110), { round: false }), C.alert, 6)}</g>`,
        anims: [DROP("bottle", 0.05, [540, 760], -800), POP("btn", Math.max(0.2, tB), [540, 1260]), POP("ar1", Math.max(0.3, tB + 0.15), [150, 1010]), POP("ar2", Math.max(0.35, tB + 0.25), [930, 1010])],
        loops: [{ id: "btn", prop: "s", amp: 0.03, freq: 1.4, start: Math.max(0.2, tB) + 0.6, origin: [540, 1260] }],
        cam: SLOW(1.0, 1.1, 0, 0),
      };
    })(),
  };

  // pinceau de maquillage (forme seule), repère local
  function brushShape() {
    return layer("M-15 0 L15 0 L9 300 L-9 300Z", C.dark, 3) + layer("M-24 -44 L24 -44 L24 6 L-24 6Z", C.cream, 4) + layer(blob(0, -120, 50, 82, { jitter: 0.08, n: 12, seed: 84 }), "#BE8861", 4);
  }
}
