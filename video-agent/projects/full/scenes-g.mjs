// Raison 4 dynamique, raison 5 en trois plans rapides + rideau de taches, transition à la loupe, calendrier des mois.
import { layer, band, blob, poly, star, arrowPts } from "../../engine/paper.mjs";
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
          { t0: 0, t1: Math.max(0.2, tWorse - 0.9), from: { s: 1.0, y: 0 }, to: { s: 1.03, y: 0 }, ease: "lin" },
          { t0: Math.max(0.2, tWorse - 0.9), t1: tWorse + 0.7, from: { s: 1.03, y: 0 }, to: { s: 1.9, y: -399 }, ease: "inOut" },
          { t0: tWorse + 0.7, t1: Math.max(tWorse + 0.8, dur), from: { s: 1.9, y: -399 }, to: { s: 1.95, y: -405 }, ease: "lin" },
        ],
        punches: [{ t: tWorse, amp: 0.05 }],
      };
    })(),

    // ───── Raison 5 : un plan rapide par déclencheur, chacun dans un décor différent ─────
    // Soleil qui tape sur la peau : EXTÉRIEUR (colline, arbre, nuages), sans le personnage.
    fiveSun: {
      svg: layer(blob(760, 330, 330, 330, { jitter: 0.02, n: 18, seed: 3500 }), "rgba(255,243,214,.5)", 1, { edge: "rgba(0,0,0,0)" }) +
        [[560, 240, 90, 50], [700, 215, 120, 60], [840, 250, 85, 48]].map((p, i) => layer(blob(p[0], p[1], p[2], p[3], { jitter: 0.12, n: 10, seed: 3510 + i }), "#F1E6D2", 2)).join("") +
        sun(C, 760, 430) +
        layer(band(-80, 1160, 1020, 1500, { amp: 70, step: 180, seed: 31 }), "#A8B58F", 2) + layer(band(-80, 1160, 1230, 1800, { amp: 60, step: 160, seed: 32 }), "#8E9F78", 3) +
        layer(poly([[150, 940], [215, 940], [225, 1280], [140, 1280]]), "#7A4E32", 4) + [[185, 860, 150], [100, 930, 105], [275, 930, 110], [185, 780, 105]].map((p, i) => layer(blob(p[0], p[1], p[2], p[2] * 0.9, { jitter: 0.1, n: 10, seed: 3520 + i }), C.solution, 5)).join("") +
        layer(band(-80, 1160, 1560, 2300, { amp: 18, seed: 33 }), "#7E9A6B", 4) +
        `<g id="beam">${[[640, 1130, 720, 1210], [720, 1120, 800, 1200], [800, 1130, 880, 1215]].map(([x1, y1, x2, y2]) => layer(poly([[760, 450], [x1, y1], [x2, y2]]), "rgba(240,176,82,.62)", 5)).join("")}</g>` +
        `<g id="armS">${layer(poly([[1200, 1560], [1200, 1320], [560, 1090], [470, 1190], [1000, 1560]]), "#9C6544", 6)}${layer(blob(500, 1130, 110, 80, { jitter: 0.1, n: 10, seed: 3530 }), "#9C6544", 6)}</g>` +
        [[700, 1235], [820, 1290], [610, 1160], [930, 1340], [760, 1345]].map((p, i) => `<g id="as${i}">${layer(blob(p[0], p[1], 34 + (i % 2) * 12, 26, { jitter: 0.25, n: 10, seed: 3540 + i }), C.dark, 7)}</g>`).join("") + badge(C, 150, 200, 5),
      anims: [
        POP("badge", 0.0, [150, 200]), A("armS", 0.1, 0.3, { x: 700, y: 200 }, { x: 0, y: 0 }, { ease: "outCubic", sfx: "whoosh" }),
        POP("sun", 0.35, [760, 430]), POP("sun-rays", 0.35, [760, 430], { sfx: false }),
        A("beam", 0.62, 0.3, { s: 0 }, { s: 1 }, { origin: [760, 450], ease: "outCubic", sfx: "whoosh" }),
        ...[0, 1, 2, 3, 4].map((i) => POP(`as${i}`, 0.85 + i * 0.07, [[700, 1235], [820, 1290], [610, 1160], [930, 1340], [760, 1345]][i], { sfx: i === 0 ? "pop" : false })),
      ],
      loops: [{ id: "sun-rays", prop: "r", amp: 6, freq: 2, start: 0.3, origin: [760, 430] }],
      cam: SLOW(1.0, 1.06, 0, 0), punches: [{ t: 0.62, amp: 0.05 }],
    },

    // Rasage : gros plan sur la mousse et le rasoir qui balaie deux bandes de peau lisse, puis la peau irritée.
    fiveRazor: (() => {
      const SK = "#9C6544";
      const foam = [[300, 700, 130], [470, 640, 150], [650, 700, 140], [810, 770, 120], [380, 830, 140], [560, 830, 150], [730, 890, 130], [300, 930, 120], [480, 970, 130], [660, 990, 120]];
      return {
        svg: layer(poly([[-80, -80], [1160, -80], [1160, 2000], [-80, 2000]]), SK, 1) +
          `<g filter="url(#paper2)"><path d="M-60 1500 Q330 1000 130 250" fill="none" stroke="#7C4C33" stroke-width="46" opacity=".5" stroke-linecap="round"/></g>` +
          `<g id="foam">${foam.map((f, i) => layer(blob(f[0], f[1], f[2], f[2] * 0.8, { jitter: 0.12, n: 12, seed: 3600 + i }), "rgb(250,245,235)", 4, { edge: "rgba(255,255,255,.8)" })).join("")}</g>` +
          `<g id="sw1">${layer(poly([[140, 600], [940, 600], [940, 770], [140, 770]]), SK, 5, { edge: "rgba(0,0,0,0)" })}</g><g id="sw2">${layer(poly([[140, 800], [940, 800], [940, 970], [140, 970]]), SK, 5, { edge: "rgba(0,0,0,0)" })}</g>` +
          [[260, 690], [420, 880], [600, 700], [760, 900], [330, 900], [680, 820]].map((p, i) => `<g id="ir${i}">${layer(blob(p[0], p[1], 26, 22, { jitter: 0.2, n: 8, seed: 3620 + i }), C.alert, 7)}</g>`).join("") +
          `<g id="rz"><g transform="translate(540 700) rotate(-90) scale(1.7)">${razor(C, 0, 0, 1, "rzi")}</g></g>`,
        anims: [
          POP("foam", 0.0, [540, 820], { sfx: "pop" }),
          A("rz", 0.05, 0.16, { x: -330, y: -1500 }, { x: -330, y: 0 }, { ease: "outCubic", sfx: "whoosh" }),
          A("rz", 0.22, 0.25, { x: -330, y: 0 }, { x: 330, y: 0 }, { ease: "inOut", late: true, sfx: "flip" }),
          A("rz", 0.5, 0.1, { x: 330, y: 0 }, { x: 330, y: 190 }, { ease: "inOut", late: true, sfx: false }),
          A("rz", 0.6, 0.25, { x: 330, y: 190 }, { x: -330, y: 190 }, { ease: "inOut", late: true, sfx: "flip" }),
          A("sw1", 0.22, 0.25, { sx: 0 }, { sx: 1 }, { origin: [140, 685], ease: "inOut", sfx: false }), A("sw2", 0.6, 0.25, { sx: 0 }, { sx: 1 }, { origin: [940, 885], ease: "inOut", sfx: false }),
          ...[0, 1, 2, 3, 4, 5].map((i) => POP(`ir${i}`, 0.82 + i * 0.03, [[260, 690], [420, 880], [600, 700], [760, 900], [330, 900], [680, 820]][i], { sfx: i === 0 ? "pop" : false })),
        ],
        loops: [], cam: SLOW(1.0, 1.08, 0, 0), punches: [{ t: 0.22, amp: 0.03 }, { t: 0.6, amp: 0.03 }],
      };
    })(),

    // Frottement : le coude qui frotte sur un bureau, lignes de vitesse, étincelles et peau qui s'assombrit.
    fiveElbows: (() => {
      const SK = "#9C6544";
      const lines = [0, 1, 2].map((i) => layer(poly([[40 + i * 30, 1120 + i * 28], [200 + i * 30, 1120 + i * 28], [200 + i * 30, 1136 + i * 28], [40 + i * 30, 1136 + i * 28]]), C.alert, 6)).join("") +
        [0, 1, 2].map((i) => layer(poly([[760 - i * 30, 1120 + i * 28], [920 - i * 30, 1120 + i * 28], [920 - i * 30, 1136 + i * 28], [760 - i * 30, 1136 + i * 28]]), C.alert, 6)).join("");
      return {
        svg: layer(poly([[-80, 1215], [1160, 1215], [1160, 2000], [-80, 2000]]), "#A9845A", 2) +
          [0, 1, 2, 3, 4].map((i) => `<line x1="-80" y1="${1290 + i * 110}" x2="1160" y2="${1290 + i * 110}" stroke="#8A6A3C" stroke-width="5" opacity=".45"/>`).join("") +
          `<g id="armE">${layer(poly([[-150, 491], [30, 349], [590, 1059], [410, 1201]], { round: false }), SK, 4)}${layer(poly([[453, 1080], [627, 1180], [1087, 380], [913, 280]], { round: false }), SK, 4)}${layer(blob(1000, 300, 125, 110, { jitter: 0.08, n: 12, seed: 3701 }), SK, 4)}${layer(blob(515, 1115, 150, 105, { jitter: 0.05, n: 12, seed: 3700 }), SK, 4)}` +
          `<g id="elp">${layer(blob(515, 1170, 105, 55, { jitter: 0.25, n: 12, seed: 3702 }), C.problem, 6)}</g></g>` +
          `<g id="ml">${lines}</g><g id="spk">${layer(star(520, 1218, 70, 26, 6, { jitter: 0 }), C.accent, 7)}</g>`,
        anims: [
          A("armE", 0.0, 0.22, { x: -500, y: 0 }, { x: 0, y: 0 }, { ease: "outCubic", sfx: "whoosh" }),
          POP("ml", 0.25, [480, 1180], { sfx: false }), POP("spk", 0.28, [520, 1218], { sfx: "pop" }),
          A("elp", 0.3, 0.7, { s: 0.15 }, { s: 1.25 }, { origin: [515, 1170], ease: "outCubic", sfx: false }),
        ],
        loops: [{ id: "armE", prop: "x", amp: 38, freq: 4.5, start: 0.2, origin: [515, 1000] }, { id: "ml", prop: "o", amp: 0.4, freq: 7, start: 0.3, origin: [0, 0] }, { id: "spk", prop: "r", amp: 25, freq: 5, start: 0.3, origin: [520, 1218] }],
        cam: SLOW(1.1, 1.18, 0, 0), punches: [{ t: 0.28, amp: 0.04 }],
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
      const LX = 700, LY = 800, rLens = 150, M = 1.9, DX = 230;
      // Le verre montre CE QU'IL SURVOLE, agrandi (la peau de la femme, qui défile quand la loupe bouge), puis la coupe sous la peau.
      const section = `<g transform="translate(${LX} ${LY}) scale(.48) translate(-540 -1170)">${skin(C)}${melanocyte(C)}</g>`;
      const view = `<clipPath id="lensclip"><circle cx="${LX}" cy="${LY}" r="${rLens - 4}"/></clipPath><g id="lv" clip-path="url(#lensclip)">` +
        `<g id="lvin"><g transform="translate(${LX} ${LY}) scale(${M}) translate(${-LX} ${-LY})">${woman(C)}</g></g><g id="lvc">${section}</g></g>`;
      const tToi = R("notYou", "toi", -0.1), tPeau = R("notYou", "ta peau", -0.1);
      const xs = (id, t, to) => [A(id, t, 0.5, { s: 2.3, o: 0 }, { s: 1, o: 1 }, { origin: to, ease: "outCubic", sfx: "stamp" })];
      const move = (t0, d, a, b, o = {}) => [
        A("lp", t0, d, { x: a }, { x: b }, { ease: "inOut", ...o }), A("lv", t0, d, { x: a }, { x: b }, { ease: "inOut", sfx: false, ...o }),
        A("lvin", t0, d, { x: -M * a }, { x: -M * b }, { ease: "inOut", sfx: false, ...o }),
      ];
      return {
        svg: woman(C) + view + loupe(C, LX, LY, rLens, "lp") + cross(C, LX - DX, LY, 340, "x1") + cross(C, LX, LY, 340, "x2"),
        overlay: fl.svg,
        anims: [
          ...fl.order.slice().reverse().map((idx, k) => A(`fd${idx}`, 0.08 + k * 0.014, 0.3, { s: 1 }, { s: 0 }, { origin: [fl.cells[idx].x, fl.cells[idx].y], ease: "inCubic", sfx: k % 6 === 0 ? "whoosh" : false })),
          POP("lp", 0.7, [LX, LY]), POP("lv", 0.7, [LX, LY], { sfx: false }),
          ...move(tToi, 0.8, 0, -DX), ...xs("x1", tToi + 0.8, [LX - DX, LY]),
          FADEOUT("x1", tPeau - 0.05, 0.2),
          ...move(tPeau, 0.8, -DX, 0, { late: true }), ...xs("x2", tPeau + 0.8, [LX, LY]),
          FADEOUT("lvin", tZoom, 0.5), FADEIN("lvc", tZoom, 0.5), FADEOUT("x2", tZoom - 0.1, 0.25),
        ],
        loops: [{ id: "x1", prop: "r", amp: 5, freq: 5, start: tToi + 1.0, origin: [LX - DX, LY] }, { id: "x2", prop: "r", amp: 5, freq: 5, start: tPeau + 1.0, origin: [LX, LY] }],
        // pas de descente : la caméra reste sur elle puis entre dans le verre de la loupe
        cam: [
          { t0: 0, t1: tZoom, from: { s: 1.3, x: 0, y: 100 }, to: { s: 1.3, x: 0, y: 100 }, ease: "lin" },
          { t0: tZoom, t1: dur, from: { s: 1.3, x: 0, y: 100 }, to: { s: 6.5, x: -1040, y: 1040 }, ease: "inCubic" },
        ],
        sfx: [{ t: tZoom + 0.2, type: "rise" }], punches: [{ t: tToi + 0.8, amp: 0.05 }, { t: tPeau + 0.8, amp: 0.05 }],
      };
    })(),

    // « C'est pour ça que la tache reste des mois, et qu'un produit de surface n'y change rien. »
    // Le calendrier EST l'image : il défile de janvier à décembre, la tache reste sur chaque page ; un produit n'y change rien.
    months: (() => {
      const names = ["JANVIER", "FÉVRIER", "MARS", "AVRIL", "MAI", "JUIN", "JUILLET", "AOÛT", "SEPTEMBRE", "OCTOBRE", "NOVEMBRE", "DÉCEMBRE"];
      const tRien = R("months", "rien", 0.2), gap = 0.27, t0 = Math.max(0.35, tRien - 0.3 - gap * 11);
      const pages = `<g id="cal">` + names.map((m, i) => calendar(C, 540, 760, 2.55, `pg${i}`, { mark: (i * 7 + 3) % 18, month: m })).reverse().join("") + `</g>`;
      return {
        svg: pages + cross(C, 540, 800, 900, "x1"),
        anims: [
          POP("cal", 0.0, [540, 760]),
          // un mois toutes les ~0,27 s : chaque nom reste lisible, la feuille s'envole puis la suivante apparaît
          ...names.slice(0, 11).map((_, i) => A(`pg${i}`, t0 + i * gap, 0.16, { y: 0, r: 0, o: 1 }, { y: -950, r: i % 2 ? 12 : -12, o: 0 }, { ease: "inCubic", late: i > 0, sfx: "flip", origin: [540, 330] })),
          A("x1", tRien, 0.3, { s: 2.2, o: 0 }, { s: 1, o: 1 }, { origin: [540, 800], ease: "outCubic", sfx: "stamp" }),
        ],
        loops: [{ id: "x1", prop: "r", amp: 3, freq: 4, start: tRien + 0.5, origin: [540, 800] }],
        cam: SLOW(1.0, 1.04, 0, 0), punches: [{ t: tRien + 0.3, amp: 0.06 }],
      };
    })(),
  };
}
