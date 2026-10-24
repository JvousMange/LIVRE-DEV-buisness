// Les actifs, le produit, l'offre, la garantie et l'appel à l'action.
import { hangingSign, layer, band, blob, star, poly, arrowPts } from "../../engine/paper.mjs";
import { skin, stain, melanocyte, badge, cross, tag, woman, questionMark, bottle, HAND_SKIN, SPOTS, MEL } from "../../library/components.mjs";
import { razor, pimple, tube, jar, shield2, calendar, wallet, coin, gear, button, dotsGrid, shelf, check, sparkle } from "../../library/components2.mjs";
import { A, POP, FADEIN, FADEOUT, DROP, SLOW } from "./kit.mjs";
import { sourceScene } from "./scenes-b.mjs";

export function scenesC(C, X) {
  const R = (n, p, o) => X.rel(n, p, o);
  const sign = (cx, top, w, h, lines, fs, seed = 4, id = "sign") => `<g id="${id}">${hangingSign(cx, top, w, h, lines, { palette: C, fontSize: fs, seed })}</g>`;
  const plus = (cx, cy, id) => `<g id="${id}">` + layer(poly([[cx - 60, cy - 14], [cx + 60, cy - 14], [cx + 60, cy + 14], [cx - 60, cy + 14]], { round: false }), C.alert, 5) + layer(poly([[cx - 14, cy - 60], [cx + 14, cy - 60], [cx + 14, cy + 60], [cx - 14, cy + 60]], { round: false }), C.alert, 5) + `</g>`;

  return {
    // « Pour ça, il y a quatre actifs dont tu as besoin. »
    fourActives: {
      svg: sign(540, 520, 660, 220, ["4 ACTIFS"], 120) + [1, 2, 3, 4].map((n) => badge(C, 190 + (n - 1) * 233, 1010, n, `nb${n}`, C.solution)).join(""),
      anims: [DROP("sign", 0.1, [540, 0], -700), ...[1, 2, 3, 4].map((n) => POP(`nb${n}`, R("fourActives", "quatre") + (n - 1) * 0.16, [190 + (n - 1) * 233, 1010]))],
      loops: [{ id: "sign", prop: "r", amp: 1.2, freq: 0.6, start: 0.8, origin: [540, 0] }],
      cam: SLOW(1.15, 1.0, 0, 0),
    },

    // « L'acide azélaïque, à dix pour cent, freine la production de mélanine. » — le frein à la source.
    azelaic: sourceScene(C, R, "azelaic", {
      cue: "freine", ring: "production",
      extra: sign(540, 530, 640, 200, ["ACIDE", "AZÉLAÏQUE"], 66) + tag(C, 700, 800, 280, 100, "10 %", { id: "dose", fontSize: 58, color: C.solution, seed: 14 }),
      extraAnims: [DROP("sign", R("azelaic", "azélaïque", -0.1), [540, 0]), POP("dose", R("azelaic", "dix"), [700, 800])],
      cam: { from: { s: 1.5, y: -190 }, to: { s: 1.45, y: -160 }, ease: "lin" },
    }),

    // « L'alpha-arbutine bloque la tyrosinase, l'enzyme qui lance cette fabrication. » — une cale dans l'engrenage.
    arbutin: (() => {
      const tb = R("arbutin", "bloque"), w = 130;
      return {
        svg: sign(540, 300, 660, 200, ["ALPHA-ARBUTINE"], 62) + gear(C, 540, 1000, 250, 14, "gear") + gear(C, 250, 1310, 130, 8, "gear2", "#A9845A") +
          `<g id="wedge">${layer(poly([[740, 700], [880, 700], [810, 860]], { round: false }), C.alert, 7)}</g>`,
        anims: [
          DROP("sign", 0.1, [540, 0], -700),
          POP("gear", 0.2, [540, 1000]), POP("gear2", 0.35, [250, 1310]),
          A("gear", 0.2, tb - 0.2, { r: 0 }, { r: Math.round((tb - 0.2) * w) }, { ease: "lin", origin: [540, 1000] }),
          A("gear2", 0.35, tb - 0.35, { r: 0 }, { r: -Math.round((tb - 0.35) * w * 1.75) }, { ease: "lin", origin: [250, 1310] }),
          
          A("wedge", tb, 0.4, { x: 160, y: -300 }, { x: -170, y: -10 }, { ease: "outBack", origin: [810, 780] }),
        ],
        loops: [],
        cam: SLOW(1.0, 1.08, 0, 0),
      };
    })(),

    // « L'acide tranexamique agit sur les taches tenaces, celles qui ne partent jamais vraiment. »
    tranexamic: (() => {
      const tAct = R("tranexamic", "agit");
      const roots = [[430, 40], [540, 66], [650, 40]].map(([x, w]) => layer(poly([[x - w / 2, 925], [x + w / 2, 925], [x + 8, 1230]], { round: false }), C.problem, 4)).join("");
      const drops = [420, 480, 540, 600, 660];
      return {
        svg: skin(C) + `<g id="roots">${roots}</g>` + stain(C) + sign(540, 330, 640, 200, ["ACIDE", "TRANEXAMIQUE"], 56) +
          drops.map((x, i) => `<g id="dr${i}">` + layer(blob(x, 620, 20, 26, { jitter: 0.06, n: 8, seed: 1400 + i }), C.solution, 6) + `</g>`).join(""),
        anims: [
          DROP("sign", R("tranexamic", "tranexamique", -0.1), [540, 0], -700),
          POP("roots", R("tranexamic", "tenaces", -0.6), [540, 925]),
          ...drops.flatMap((x, i) => [A(`dr${i}`, tAct + i * 0.18, 0.7, { y: -120, o: 0 }, { y: 255, o: 1 }, { ease: "inCubic" }), FADEOUT(`dr${i}`, tAct + i * 0.18 + 0.7, 0.2)]),
          A("stain", tAct + 0.6, 1.6, { s: 1 }, { s: 0.55 }, { origin: [540, 905], ease: "inOut" }),
          A("roots", tAct + 0.9, 1.4, { o: 1 }, { o: 0.25 }, { ease: "lin", late: true }),
        ],
        loops: [],
        cam: SLOW(1.3, 1.35, 60, 40),
      };
    })(),

    // « Et la niacinamide, à cinq pour cent, renforce ta barrière cutanée, pour que ta peau réagisse moins,
    //   et que les taches reviennent moins. »
    niacin: (() => {
      const bricks = [];
      for (let row = 0; row < 2; row++) for (let c = 0; c < 8; c++) bricks.push({ id: `br${row * 8 + c}`, x: 70 + c * 130 + (row ? 65 : 0), y: 880 - row * 64 });
      const tBar = R("niacin", "barrière"), tReact = R("niacin", "réagisse"), tBack = R("niacin", "reviennent");
      const atk = [250, 540, 830];
      return {
        svg: skin(C) + stain(C) + sign(540, 330, 640, 220, ["NIACINAMIDE"], 60) + tag(C, 800, 700, 280, 100, "5 %", { id: "dose", fontSize: 58, color: C.solution, seed: 16 }) +
          bricks.map((b) => `<g id="${b.id}">` + layer(poly([[b.x - 62, b.y - 28], [b.x + 62, b.y - 28], [b.x + 62, b.y + 28], [b.x - 62, b.y + 28]], { round: false }), "#E8D0A8", 5) + `</g>`).join("") +
          atk.map((x, i) => `<g id="at${i}">${layer(poly(arrowPts(x, 420, x, 760, 40, 110, 100), { round: false }), C.alert, 6)}</g>`).join("") +
          `<g id="ok">${check(C, 540, 1150, 220, "okc")}</g>`,
        anims: [
          DROP("sign", R("niacin", "niacinamide", -0.1), [540, 0], -700), POP("dose", R("niacin", "cinq"), [800, 700]),
          ...bricks.map((b, i) => A(b.id, tBar + i * 0.1, 0.35, { s: 0, y: -60 }, { s: 1, y: 0 }, { origin: [b.x, b.y], ease: "outBack" })),
          ...atk.flatMap((x, i) => [A(`at${i}`, tReact + i * 0.2, 0.35, { y: -120, o: 0 }, { y: 0, o: 1 }, { ease: "outCubic" }), A(`at${i}`, tReact + i * 0.2 + 0.5, 0.5, { y: 0, o: 1 }, { y: -90, o: 0 }, { ease: "outCubic", late: true })]),
          A("stain", tBack, 1.2, { s: 1 }, { s: 0.4 }, { origin: [540, 905], ease: "inOut" }),
          POP("okc", tBack + 0.5, [540, 1150]),
        ],
        loops: [],
        cam: SLOW(1.1, 1.18, 40, 20),
      };
    })(),

    // « Il existe plusieurs produits capables de faire partir tes taches. Mais tu n'as pas besoin de dix flacons
    //   différents, ni d'un produit hors de prix. »
    products2: (() => {
      const labels = ["SOIN", "BAUME", "SÉRUM", "HUILE", "CRÈME", "MASQUE", "TONIQUE", "LAIT", "GEL", "EAU"];
      const xs = [140, 340, 540, 740, 940];
      const items = labels.map((lb, i) => {
        const row = i < 5 ? 0 : 1, base = row ? 1030 : 560, isTube = i % 2 === 0;
        const cy = isTube ? base - 208 * 0.62 : base - 130 * 0.78;
        return { id: `p${i}`, x: xs[i % 5], cy, base, isTube, lb };
      });
      const tMany = R("products2", "plusieurs"), tTen = R("products2", "dix"), tPrice = R("products2", "prix", -0.4);
      return {
        svg: shelf(C, 540, 560, 1040, "sh1") + shelf(C, 540, 1030, 1040, "sh2") +
          items.map((it) => (it.isTube ? tube(C, it.x, it.cy, { s: 0.62, label: it.lb, id: it.id, labelSize: 28 }) : jar(C, it.x, it.cy, { s: 0.78, label: it.lb, id: it.id, labelSize: 26 }))).join("") +
          tag(C, 540, 1240, 460, 130, "€€€", { id: "price", fontSize: 84, color: C.alert, seed: 17 }) + cross(C, 540, 1240, 220, "xp"),
        anims: [
          ...items.map((it, i) => DROP(it.id, i < 3 ? tMany + i * 0.4 : tTen + (i - 3) * 0.16, [it.x, it.cy], -520)),
          POP("price", tPrice, [540, 1240]), POP("xp", tPrice + 0.5, [540, 1240]),
        ],
        loops: [],
        cam: SLOW(1.0, 1.06, 0, 0),
      };
    })(),

    // « Le Sérum Anti-Taches, Mela Skin, réunit tous les actifs dont tu as besoin en un seul flacon. »
    meet: (() => {
      const chips = [
        { id: "c0", x: 190, y: 560, t: "AZÉLAÏQUE", from: -700 }, { id: "c1", x: 890, y: 700, t: "ARBUTINE", from: 700 },
        { id: "c2", x: 190, y: 840, t: "TRANEXAMIQUE", from: -700 }, { id: "c3", x: 890, y: 980, t: "NIACINAMIDE", from: 700 },
      ];
      const tU = R("meet", "réunit");
      return {
        svg: sign(540, 150, 760, 180, ["SÉRUM ANTI-TACHES"], 56) + bottle(C, 540, 940, 1.2, "bottle") +
          chips.map((c) => tag(C, c.x, c.y, 340, 90, c.t, { id: c.id, fontSize: 30, color: C.solution, seed: 20 })).join(""),
        anims: [
          DROP("sign", R("meet", "sérum", -0.1), [540, 0], -700),
          POP("bottle", R("meet", "mela", -0.1), [540, 940]),
          ...chips.flatMap((c, i) => [
            A(c.id, 0.3 + i * 0.12, 0.45, { x: c.from, o: 0 }, { x: 0, o: 1 }, { ease: "outCubic" }),
            A(c.id, tU + i * 0.22, 0.6, { x: 0, y: 0, s: 1 }, { x: 540 - c.x, y: 940 - c.y, s: 0.2 }, { ease: "inCubic", origin: [c.x, c.y], late: true }),
            FADEOUT(c.id, tU + i * 0.22 + 0.5, 0.2),
          ]),
          
        ],
        loops: [{ id: "bottle", prop: "s", amp: 0.025, freq: 1.5, start: tU + 1.2, origin: [540, 940] }],
        cam: SLOW(1.0, 1.1, 0, 0),
      };
    })(),

    // « Quatre-vingt-quatorze pour cent de celles qui l'ont testé le recommandent à leur entourage. »
    ninetyFour: (() => {
      const t = R("ninetyFour", "quatre-vingt-quatorze");
      return {
        svg: sign(540, 200, 560, 220, ["94 %"], 130) + dotsGrid(C, 540, 990, { id: "dots" }),
        anims: [
          DROP("sign", t - 0.2, [540, 0], -700),
          ...Array.from({ length: 10 }, (_, r) => A(`dots-r${r}`, t + 0.2 + r * 0.11, 0.35, { s: 0, y: 30 }, { s: 1, y: 0 }, { origin: [540, 990 - 351 + r * 78], ease: "outBack" })),
        ],
        loops: [{ id: "dots", prop: "s", amp: 0.015, freq: 1.2, start: R("ninetyFour", "recommandent"), origin: [540, 990] }],
        cam: SLOW(1.0, 1.06, 0, 0),
      };
    })(),

    // « Et cette semaine, pour deux flacons achetés, tu en reçois un offert. »
    offer: {
      svg: sign(540, 260, 720, 180, ["CETTE SEMAINE"], 60) + bottle(C, 230, 1010, 0.95, "b1") + bottle(C, 540, 1010, 0.95, "b2") + plus(385, 1010, "plus") +
        bottle(C, 850, 1010, 0.95, "b3") + tag(C, 850, 640, 300, 100, "OFFERT", { id: "off", fontSize: 54, color: C.alert, seed: 22 }),
      anims: [
        DROP("sign", R("offer", "semaine", -0.2), [540, 0], -700),
        POP("b1", R("offer", "deux"), [230, 1010]), POP("b2", R("offer", "deux", 0.4), [540, 1010]), POP("plus", R("offer", "reçois", -0.2), [385, 1010]),
        DROP("b3", R("offer", "offert", -0.4), [850, 1010], -700), POP("off", R("offer", "offert"), [850, 640]),
      ],
      loops: [],
      cam: SLOW(1.0, 1.08, 0, 0),
    },

    // « Toujours sceptique ? Très bien, c'est pour ça que Mela Skin a mis en place »
    skeptic: {
      svg: woman(C) + questionMark(C, 770, 640, 320, "q1"),
      anims: [POP("q1", R("skeptic", "sceptique"), [770, 540], { from: { s: 0, r: -22 }, to: { s: 1, r: 0 } })],
      loops: [{ id: "q1", prop: "r", amp: 4, freq: 0.7, start: 1.0, origin: [770, 540] }],
      cam: SLOW(1.35, 1.2, 130, 110),
    },

    // « une garantie satisfait ou remboursé de quatre-vingt-dix jours. »
    guarantee: {
      svg: sign(540, 150, 760, 250, ["SATISFAIT OU", "REMBOURSÉ"], 70) + shield2(C, 540, 840, 1.5, "shield") + tag(C, 540, 1230, 580, 170, "90 JOURS", { id: "d90", fontSize: 100, color: C.solution, seed: 23 }),
      anims: [
        DROP("sign", R("guarantee", "satisfait", -0.15), [540, 0], -700),
        POP("shield", R("guarantee", "garantie"), [540, 840]),
        POP("d90", R("guarantee", "quatre-vingt-dix"), [540, 1230]),
      ],
      loops: [{ id: "sign", prop: "r", amp: 1.2, freq: 0.6, start: 1.0, origin: [540, 0] }],
      cam: SLOW(1.0, 1.08, 0, 0),
    },

    // « Si tu as encore des taches au bout de trois mois, on te rembourse la totalité. »
    refund: (() => {
      const tM = R("refund", "mois"), tR = R("refund", "rembourse"), tT = R("refund", "totalité");
      const coins = [[300, 380], [420, 330], [540, 300], [660, 330], [780, 380], [540, 420]];
      return {
        svg: [1, 2, 3].map((n) => calendar(C, 540, 520, 0.95, `cal${n}`, { mark: 5 + n * 3, month: `MOIS ${n}` })).join("") + wallet(C, 540, 1160, 1.2, "wallet") +
          coins.map((c, i) => coin(C, c[0], c[1], 46, `co${i}`)).join(""),
        anims: [
          POP("cal1", tM - 0.8, [540, 520]), POP("cal2", tM - 0.3, [540, 520]), POP("cal3", tM + 0.1, [540, 520]),
          DROP("wallet", tR, [540, 1160], -700),
          ...coins.flatMap((c, i) => [
            A(`co${i}`, tT + i * 0.14, 0.3, { s: 0 }, { s: 1 }, { origin: [c[0], c[1]], ease: "outBack" }),
            A(`co${i}`, tT + 0.3 + i * 0.14, 0.6, { x: 0, y: 0 }, { x: 540 - c[0], y: 1080 - c[1] }, { ease: "inCubic", late: true }),
            FADEOUT(`co${i}`, tT + 0.75 + i * 0.14, 0.15),
          ]),
        ],
        loops: [],
        cam: SLOW(1.0, 1.06, 0, 0),
      };
    })(),

    // « Clique sur le bouton ci-dessous et fais enfin partir ces taches. »
    cta: (() => {
      const tB = R("cta", "bouton");
      return {
        svg: bottle(C, 540, 760, 1.5, "bottle") + button(C, 540, 1260, 720, 170, "COMMANDER", "btn") +
          `<g id="ar1">${layer(poly(arrowPts(150, 1010, 260, 1160, 46, 120, 110), { round: false }), C.alert, 6)}</g>` +
          `<g id="ar2">${layer(poly(arrowPts(930, 1010, 820, 1160, 46, 120, 110), { round: false }), C.alert, 6)}</g>`,
        anims: [DROP("bottle", 0.1, [540, 760], -800), POP("btn", tB, [540, 1260]), POP("ar1", tB + 0.2, [150, 1010]), POP("ar2", tB + 0.3, [930, 1010])],
        loops: [{ id: "btn", prop: "s", amp: 0.03, freq: 1.4, start: tB + 0.6, origin: [540, 1260] }],
        cam: SLOW(1.0, 1.1, 0, 0),
      };
    })(),
  };
}
