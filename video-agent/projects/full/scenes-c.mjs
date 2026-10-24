// Les actifs, le produit, l'offre, la garantie et l'appel à l'action.
import { hangingSign, layer, band, blob, star, poly, arrowPts } from "../../engine/paper.mjs";
import { skin, stain, melanocyte, badge, cross, tag, woman, questionMark, bottle, HAND_SKIN, SPOTS, MEL } from "../../library/components.mjs";
import { razor, pimple, tube, jar, shield2, calendar, wallet, coin, gear, button, dotsGrid, shelf, check, sparkle, faucet, scissors, enzyme, basketBack, basketFront, receipt, equals } from "../../library/components2.mjs";
import { A, POP, FADEIN, FADEOUT, DROP, SLOW } from "./kit.mjs";

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

    // « L'acide azélaïque, à dix pour cent, freine la production de mélanine. » — un robinet remplit un bécher de pigment ; on le ferme, le niveau s'arrête.
    azelaic: (() => {
      const tg = R("azelaic", "freine"), tDix = R("azelaic", "dix"), BX = 540, BY0 = 1000, BY1 = 1440;
      const drops = Array.from({ length: 12 }, (_, i) => i).filter((i) => 0.5 + i * 0.22 < tg - 0.1);
      return {
        svg: sign(540, 60, 640, 190, ["ACIDE", "AZÉLAÏQUE"], 60) + faucet(C, 540, 700, 1.0, "faucet") +
          `<g id="stream">${layer(poly([[522, 722], [558, 722], [558, 1200], [522, 1200]], { round: false }), C.problem, 4)}</g>` +
          `<clipPath id="bclip"><rect x="${BX - 170}" y="${BY0}" width="340" height="${BY1 - BY0}"/></clipPath>` +
          `<g clip-path="url(#bclip)"><g id="liq">${layer(poly([[BX - 200, BY0 - 20], [BX + 200, BY0 - 20], [BX + 200, BY1 + 20], [BX - 200, BY1 + 20]], { round: false }), C.problem, 2, { edge: "rgba(0,0,0,0)" })}</g></g>` +
          `<g id="beaker"><g filter="url(#paper3)"><path d="M${BX - 190} ${BY0 - 30} L${BX - 170} ${BY1} Q${BX - 168} ${BY1 + 30} ${BX - 138} ${BY1 + 30} L${BX + 138} ${BY1 + 30} Q${BX + 168} ${BY1 + 30} ${BX + 170} ${BY1} L${BX + 190} ${BY0 - 30}" fill="rgba(241,230,210,.22)" stroke="${C.cream}" stroke-width="16" stroke-linejoin="round" stroke-linecap="round"/></g></g>` +
          tag(C, 880, 1160, 280, 100, "10 %", { id: "dose", fontSize: 58, color: C.solution, seed: 14 }) + check(C, 860, 1340, 190, "okc"),
        anims: [
          DROP("sign", 0.1, [540, 0], -700), A("faucet", 0.1, 0.5, { y: -500, o: 0 }, { y: 0, o: 1 }, { ease: "outBack", sfx: "whoosh" }), POP("beaker", 0.3, [BX, 1300], { sfx: "pop" }),
          A("stream", 0.55, 0.25, { sy: 0 }, { sy: 1 }, { origin: [540, 722], ease: "outCubic", sfx: [{ type: "blop", gain: 0.6 }] }), FADEOUT("stream", tg + 0.1, 0.25),
          A("liq", 0.55, Math.max(0.5, tg - 0.55), { sy: 0.03 }, { sy: 0.7 }, { origin: [BX, BY1], ease: "lin", sfx: false }),
          POP("dose", tDix, [880, 1160]),
          A("faucet-h", tg - 0.05, 0.4, { r: 0 }, { r: 90 }, { origin: [0, -351], ease: "outBack", sfx: [{ type: "stamp", dt: 0.3, gain: 0.7 }] }),
          POP("okc", tg + 0.55, [860, 1340]),
        ],
        loops: [{ id: "liq", prop: "y", amp: 3, freq: 6, start: 0.6, origin: [0, 0] }],
        cam: SLOW(1.0, 1.05, 0, 0), punches: [{ t: tg + 0.2, amp: 0.05 }],
      };
    })(),

    // « L'alpha-arbutine bloque la tyrosinase, l'enzyme qui lance cette fabrication. » — une enzyme gobe du pigment ; un bouchon vert se loge dans son encoche.
    arbutin: (() => {
      const tb = R("arbutin", "bloque"), EX = 470, EY = 1060, ES = 1.15;
      const feed = []; for (let t = 0.55; t < tb - 0.25; t += 0.5) feed.push(t);
      const bounce = [0, 1, 2].map((i) => tb + 0.55 + i * 0.5);
      const sb = (id, y) => `<g id="${id}">` + layer(blob(1010, y, 34, 30, { jitter: 0.2, n: 9, seed: 1500 + id.length }), C.problem, 6) + `</g>`;
      return {
        svg: sign(540, 120, 660, 200, ["ALPHA-ARBUTINE"], 62) + enzyme(C, EX, EY, ES, "enz") +
          feed.map((_, i) => sb(`sf${i}`, EY)).join("") + feed.map((_, i) => `<g id="gp${i}">` + layer(blob(EX - 60, EY - 250, 26, 26, { jitter: 0.1, n: 8, seed: 1520 + i }), C.problem, 7) + `</g>`).join("") +
          bounce.map((_, i) => sb(`sbb${i}`, EY)).join(""),
        anims: [
          DROP("sign", 0.1, [540, 0], -700), A("enz", 0.15, 0.5, { s: 0.2, o: 0 }, { s: 1, o: 1 }, { origin: [EX, EY], ease: "outBack" }),
          A("enz-plug", 0, 0.01, { x: 520 }, { x: 520 }, { sfx: false }),
          ...feed.flatMap((t, i) => [
            A(`sf${i}`, t, 0.4, { x: 0, o: 1 }, { x: -480, o: 1 }, { ease: "inOut", sfx: "tick" }),
            A(`sf${i}`, t + 0.4, 0.05, { s: 1 }, { s: 0 }, { origin: [530, EY], ease: "lin", late: true, sfx: false }),
            POP(`gp${i}`, t + 0.42, [EX - 60, EY - 250], { sfx: "pop" }), A(`gp${i}`, t + 0.9, 0.6, { y: 0, o: 1 }, { y: -260, o: 0 }, { ease: "outCubic", late: true, sfx: false }),
          ]),
          A("enz-plug", tb, 0.35, { x: 520 }, { x: 0 }, { ease: "outBack", sfx: [{ type: "stamp", dt: 0.3, gain: 1 }], late: false }),
          ...bounce.flatMap((t, i) => [
            A(`sbb${i}`, t, 0.3, { x: 0, r: 0 }, { x: -150, r: 0 }, { ease: "inCubic", sfx: false }),
            A(`sbb${i}`, t + 0.3, 0.5, { x: -150, y: 0, r: 0, o: 1 }, { x: 260, y: -120 - i * 60, r: 300, o: 0 }, { ease: "outCubic", late: true, sfx: "tick" }),
          ]),
        ],
        loops: [{ id: "enz", prop: "s", amp: 0.03, freq: 2.6, start: 0.7, origin: [EX, EY] }],
        cam: SLOW(1.0, 1.05, 0, 0), punches: [{ t: tb + 0.3, amp: 0.06 }],
      };
    })(),

    // « L'acide tranexamique agit sur les taches tenaces, celles qui ne partent jamais vraiment. » — des ciseaux coupent les racines de la tache.
    tranexamic: (() => {
      const tAct = R("tranexamic", "agit"), RX = [430, 540, 650], SC = 0.8, SY = 1150;
      const roots = RX.map((x, i) => `<g id="rt${i}">` + layer(poly([[x - 24, 925], [x + 24, 925], [x + 6, 1230]], { round: false }), C.problem, 4) + `</g>`).join("");
      const tc = [tAct + 0.35, tAct + 0.85, tAct + 1.35];
      return {
        svg: skin(C) + roots + stain(C) + sign(540, 330, 640, 200, ["ACIDE", "TRANEXAMIQUE"], 56) + `<g id="sc">${scissors(C, 430, SY, SC, "scs")}</g>`,
        anims: [
          DROP("sign", R("tranexamic", "tranexamique", -0.1), [540, 0], -700),
          A("sc", tAct - 0.3, 0.45, { y: 500, x: 0 }, { y: 0, x: 0 }, { ease: "outBack", sfx: "whoosh" }),
          A("scs-a", tAct - 0.3, 0.3, { r: 0 }, { r: 18 }, { origin: [0, 0], ease: "outCubic", sfx: false }), A("scs-b", tAct - 0.3, 0.3, { r: 0 }, { r: -18 }, { origin: [0, 0], ease: "outCubic", sfx: false }),
          A("sc", tc[1] - 0.3, 0.3, { x: 0 }, { x: 110 }, { ease: "inOut", sfx: false, late: true }), A("sc", tc[2] - 0.3, 0.3, { x: 110 }, { x: 220 }, { ease: "inOut", sfx: false, late: true }),
          ...tc.flatMap((t, i) => [A(`rt${i}`, t, 0.35, { y: 0, o: 1 }, { y: 140, o: 0 }, { ease: "inCubic", late: true, sfx: [{ type: "tick", gain: 1.2 }, { type: "thud", gain: 0.5 }] })]),
          A("stain", tc[2] + 0.1, 1.2, { s: 1, o: 1 }, { s: 0.35, o: 0.5 }, { origin: [540, 905], ease: "inOut", sfx: false }),
          A("sc", tc[2] + 0.9, 0.4, { y: 0 }, { y: 600 }, { ease: "inCubic", late: true, sfx: false }),
        ],
        loops: [
          { id: "scs-a", prop: "r", amp: 13, freq: 3.4, start: tAct + 0.1, origin: [0, 0] }, { id: "scs-b", prop: "r", amp: 13, freq: 3.4, phase: 0.5, start: tAct + 0.1, origin: [0, 0] },
          { id: "stain", prop: "x", amp: 5, freq: 9, start: tAct + 0.2, origin: [540, 905] },
        ],
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
          ...atk.flatMap((x, i) => [A(`at${i}`, tReact + i * 0.2, 0.35, { y: -120, o: 0 }, { y: 0, o: 1 }, { ease: "outCubic" }), A(`at${i}`, tReact + i * 0.2 + 0.35, 0.55, { x: 0, y: 0, r: 0, o: 1 }, { x: (i - 1) * 260 + (i === 1 ? 180 : 0), y: -260, r: (i - 1) * 90 + 60, o: 0 }, { ease: "outCubic", origin: [atk[i], 640], late: true, sfx: "tick" })]),
          A("stain", tBack, 1.2, { s: 1 }, { s: 0.4 }, { origin: [540, 905], ease: "inOut" }),
          POP("okc", tBack + 0.5, [540, 1150]),
        ],
        loops: [],
        cam: SLOW(1.1, 1.18, 40, 20),
      };
    })(),

    // « Il existe plusieurs produits capables de faire partir tes taches. Mais tu n'as pas besoin de dix flacons différents, ni d'un produit hors de prix. »
    // Un panier qui se remplit de dix produits, puis il glisse hors champ et un ticket de caisse tombe : 120 euros.
    products2: (() => {
      const labels = ["SOIN", "BAUME", "SÉRUM", "HUILE", "CRÈME", "MASQUE", "TONIQUE", "LAIT", "GEL", "EAU"];
      const pos = [[260, 1040], [540, 1040], [820, 1040], [400, 1040], [680, 1040], [190, 1110], [330, 1110], [470, 1110], [610, 1110], [750, 1110]];
      const items = labels.map((lb, i) => { const [x, base] = pos[i], isTube = i % 2 === 0; return { id: `p${i}`, x, cy: isTube ? base - 129 : base - 101, isTube, lb }; });
      const tMany = R("products2", "plusieurs"), tTen = R("products2", "dix"), tPrice = R("products2", "hors");
      const at = [tMany, tMany + 0.45, tMany + 0.9, tTen, tTen + 0.22, tTen + 0.4, tTen + 0.52, tTen + 0.7, tTen + 0.8, tTen + 0.88];
      return {
        svg: `<g id="bkw">` + basketBack(C, 540, 1000, 1.0, "bkb") +
          items.map((it) => (it.isTube ? tube(C, it.x, it.cy, { s: 0.62, label: it.lb, id: it.id, labelSize: 28 }) : jar(C, it.x, it.cy, { s: 0.78, label: it.lb, id: it.id, labelSize: 26 }))).join("") +
          basketFront(C, 540, 1000, 1.0, "bkf") + `</g>` +
          receipt(C, 540, 250, 640, 1050, "rc") + `<g id="rcring"><g filter="url(#paper4)"><ellipse cx="540" cy="1135" rx="318" ry="84" fill="none" stroke="${C.alert}" stroke-width="14"/></g></g>`,
        anims: [
          A("bkw", Math.max(0, tMany - 0.35), 0.45, { y: 700, o: 0 }, { y: 0, o: 1 }, { ease: "outBack", sfx: "whoosh" }),
          ...items.map((it, i) => DROP(it.id, at[i], [it.x, it.cy], -520)),
          A("bkw", tPrice - 0.1, 0.5, { x: 0 }, { x: -1300 }, { ease: "inCubic", late: true, sfx: "whoosh" }),
          A("rc", tPrice + 0.1, 0.55, { y: -1500, r: -3 }, { y: 0, r: 0 }, { ease: "outBack", sfx: [{ type: "whoosh", gain: 0.6 }, { type: "thud", dt: 0.4, gain: 0.7 }] }),
          POP("rcring", tPrice + 0.8, [540, 1135], { sfx: "stamp" }),
        ],
        loops: [{ id: "rc", prop: "r", amp: 0.8, freq: 0.8, start: tPrice + 0.9, origin: [540, 250] }],
        cam: SLOW(1.0, 1.05, 0, 0), punches: [{ t: tPrice + 0.8, amp: 0.05 }],
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

    // « Et cette semaine, pour deux flacons achetés, tu en reçois un offert. » — flacon 1, +, flacon 2, =, flacon 3 (OFFERT), dans cet ordre.
    offer: (() => {
      const t1 = R("offer", "deux"), tp = t1 + 0.4, t2 = Math.max(tp + 0.4, R("offer", "flacons")), te = Math.max(t2 + 0.5, R("offer", "achetés")), t3 = Math.max(te + 0.4, R("offer", "reçois")), to = Math.max(t3 + 0.35, R("offer", "offert"));
      return {
        svg: sign(540, 260, 720, 180, ["CETTE SEMAINE"], 60) + bottle(C, 150, 1010, 0.8, "b1") + plus(305, 1010, "plus") + bottle(C, 460, 1010, 0.8, "b2") + equals(C, 615, 1010, "eq") +
          bottle(C, 880, 1010, 0.95, "b3") + tag(C, 880, 640, 300, 100, "OFFERT", { id: "off", fontSize: 54, color: C.alert, seed: 22 }),
        anims: [
          DROP("sign", R("offer", "semaine", -0.2), [540, 0], -700),
          POP("b1", t1, [150, 1010]), POP("plus", tp, [305, 1010]), POP("b2", t2, [460, 1010]), POP("eq", te, [615, 1010]),
          DROP("b3", t3 - 0.1, [880, 1010], -700), POP("off", to, [880, 640]),
        ],
        loops: [{ id: "b3", prop: "s", amp: 0.03, freq: 2, start: to + 0.5, origin: [880, 1010] }],
        cam: SLOW(1.0, 1.08, 0, 0), punches: [{ t: to, amp: 0.05 }],
      };
    })(),

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
      const dur = X.dur("refund"), tM = R("refund", "mois"), tR = R("refund", "rembourse");
      const tS = Math.max(0.4, Math.min(R("refund", "totalité", -0.3), dur - 2.0));   // les pièces ont le temps d'arriver dans le portefeuille avant la fin du plan
      const coins = [[300, 380], [420, 330], [540, 300], [660, 330], [780, 380], [540, 420]];
      return {
        svg: [1, 2, 3].map((n) => calendar(C, 540, 520, 0.95, `cal${n}`, { mark: 5 + n * 3, month: `MOIS ${n}` })).join("") + wallet(C, 540, 1160, 1.2, "wallet") +
          coins.map((c, i) => coin(C, c[0], c[1], 46, `co${i}`)).join(""),
        anims: [
          POP("cal1", Math.max(0.05, tM - 0.8), [540, 520]), POP("cal2", Math.max(0.2, tM - 0.3), [540, 520]), POP("cal3", Math.max(0.35, tM + 0.1), [540, 520]),
          DROP("wallet", Math.max(0.1, Math.min(tR, tS - 0.5)), [540, 1160], -700),
          ...coins.flatMap((c, i) => [
            A(`co${i}`, tS + i * 0.1, 0.25, { s: 0 }, { s: 1 }, { origin: [c[0], c[1]], ease: "outBack" }),
            A(`co${i}`, tS + 0.3 + i * 0.1, 0.5, { x: 0, y: 0 }, { x: 540 - c[0], y: 1080 - c[1] }, { ease: "inCubic", late: true }),
            FADEOUT(`co${i}`, tS + 0.7 + i * 0.1, 0.12),
          ]),
          A("wallet", tS + 0.9, 0.2, { s: 1 }, { s: 1.07 }, { origin: [540, 1160], ease: "outCubic", late: true, sfx: false }), A("wallet", tS + 1.1, 0.25, { s: 1.07 }, { s: 1 }, { origin: [540, 1160], ease: "inOut", late: true, sfx: false }),
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
