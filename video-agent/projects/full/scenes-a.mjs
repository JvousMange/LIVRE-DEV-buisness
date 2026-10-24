// Raisons 3 à 5 et transition « le problème vient d'en dessous ».
import { layer, band, blob, poly, arrowPts } from "../../engine/paper.mjs";
import { skin, melanocyte, badge, cross, tag, woman, flush, sun, SPOTS } from "../../library/components.mjs";
import { tube, jar, razor, shield2, shelf, check, flame, loupe } from "../../library/components2.mjs";
import { A, POP, FADEIN, FADEOUT, DROP, SLOW } from "./kit.mjs";
import { flood } from "./flood.mjs";

export function scenesA(C, X) {
  const R = (n, p, o) => X.rel(n, p, o);
  const dy = (inner, d) => `<g transform="translate(0 ${d})">${inner}</g>`;
  const sec = (tone, y0) => `<g transform="translate(0 ${y0}) scale(.5)">${skin(C, { tone })}</g><g transform="translate(600 ${y0}) scale(.5)">${skin(C, { tone })}</g>`;

  return {
    // « Trois, la plupart des soins sont pensés pour des peaux claires. Sur une peau mate ou noire, ils agressent, ou ils ne font rien. »
    // Coupe de peau comparée : le même soin sur peau claire (il pénètre) et sur peau mate ou noire (il agresse).
    soinPeau: {
      svg: sec("light", 80) + sec("deep", 930) +
        tag(C, 270, 470, 360, 80, "PEAU CLAIRE", { id: "tgA", fontSize: 36, color: C.solution, seed: 3 }) + tag(C, 330, 1290, 520, 80, "MATE OU NOIRE", { id: "tgB", fontSize: 36, color: C.alert, seed: 4 }) +
        tube(C, 700, 330, { s: 0.6, label: "SOIN", id: "tubeA" }) + `<g id="dropA">${layer(blob(700, 470, 26, 34, { jitter: 0.06, n: 8, seed: 70 }), C.cream, 6)}</g>` +
        `<g id="spreadA">${layer(blob(700, 548, 190, 18, { jitter: 0.1, n: 10, seed: 71 }), C.cream, 6)}</g>` + check(C, 880, 700, 150, "chk") +
        tube(C, 700, 1180, { s: 0.6, label: "SOIN", id: "tubeB" }) + `<g id="dropB">${layer(blob(700, 1320, 26, 34, { jitter: 0.06, n: 8, seed: 72 }), C.cream, 6)}</g>` +
        [[330, 1510, 120, 52], [560, 1480, 130, 56], [790, 1510, 120, 52]].map((p, i) => `<g id="fl${i}">${layer(blob(p[0], p[1], p[2], p[3], { jitter: 0.12, n: 10, seed: 920 + i }), "rgba(196,85,47,.72)", 6, { edge: "rgba(0,0,0,0)" })}</g>`).join("") +
        flame(C, 700, 1380, 0.6, "fire") + cross(C, 560, 1560, 170, "xB") + badge(C, 140, 130, 3),
      anims: [
        POP("badge", 0.1, [140, 130]), POP("tgA", 0.2, [270, 470]), DROP("tubeA", R("soinPeau", "soins", -0.5), [700, 330]),
        A("dropA", R("soinPeau", "soins"), 0.5, { y: -20, o: 0 }, { y: 70, o: 1 }, { ease: "inCubic" }), FADEOUT("dropA", R("soinPeau", "soins", 0.55), 0.15),
        POP("spreadA", R("soinPeau", "soins", 0.55), [700, 548]), POP("chk", R("soinPeau", "claires"), [880, 700]),
        POP("tgB", R("soinPeau", "sur"), [330, 1290]), DROP("tubeB", R("soinPeau", "mate", -0.2), [700, 1180]),
        A("dropB", R("soinPeau", "mate", 0.2), 0.5, { y: -20, o: 0 }, { y: 70, o: 1 }, { ease: "inCubic" }), FADEOUT("dropB", R("soinPeau", "mate", 0.75), 0.15),
        ...[0, 1, 2].map((i) => FADEIN(`fl${i}`, R("soinPeau", "agressent") + i * 0.12, 0.35)), POP("fire", R("soinPeau", "agressent"), [700, 1380]),
        POP("xB", R("soinPeau", "rien"), [560, 1560]),
      ],
      loops: [], cam: SLOW(1.0, 1.04, 0, 0),
    },

    // « Quatre, depuis que tu fais des gommages ou que tu testes des produits au hasard, c'est encore pire. »
    // Deux étagères : celle du haut se remplit d'abord, puis celle du bas ; le visage empire à la fin.
    products: (() => {
      const labels = ["GOMMAGE", "SOIN", "SÉRUM", "MASQUE", "CRÈME", "SCRUB", "GEL", "LAIT", "TONIQUE", "PEELING"];
      const xs = [150, 340, 540, 740, 930], bases = [480, 830];
      const items = labels.map((lb, i) => {
        const row = i < 5 ? 0 : 1, isTube = (i + row) % 2 === 1, base = bases[row];
        return { id: `it${i}`, x: xs[i % 5], base, tube: isTube, lb, cy: isTube ? base - 208 * 0.62 : base - 130 * 0.78, at: 0.1 + i * 0.34 };
      });
      const worse = R("products", "encore pire");
      return {
        svg: shelf(C, 540, bases[0], 1040, "sh1") + shelf(C, 540, bases[1], 1040, "sh2") +
          items.map((it) => (it.tube ? tube(C, it.x, it.cy, { s: 0.62, label: it.lb, id: it.id, labelSize: 28 }) : jar(C, it.x, it.cy, { s: 0.78, label: it.lb, id: it.id, labelSize: 26 }))).join("") +
          items.map((it) => cross(C, it.x + 38, it.cy - 62, 64, `x_${it.id}`)).join("") +
          woman(C, { cy: 1170, scale: 0.78, mirrorOn: false, extras: flush() }) + badge(C, 110, 110, 4),
        anims: [
          POP("badge", 0.1, [110, 110]),
          ...items.flatMap((it) => [DROP(it.id, it.at, [it.x, it.cy]), POP(`x_${it.id}`, it.at + 0.5, [it.x + 38, it.cy - 62])]),
          ...[0, 1, 2].map((i) => FADEIN(`fl${i}`, worse, 0.5)),
          ...SPOTS.map((sp, i) => A(`sp${i}`, worse, 0.8, { s: 1 }, { s: 1.8 }, { origin: [sp.x, sp.y], ease: "outCubic" })),
        ],
        loops: [],
        cam: SLOW(1.0, 1.06, 0, 0),
      };
    })(),

    // « Et cinq, soleil, rasage, frottements, rien ne protège du retour des taches. »
    // À la fin, les taches recouvrent tout l'écran ; le plan suivant commence par ce même rideau de taches qui se retire.
    triggers5: (() => {
      const fl = flood(C);
      const rub = `<g id="rub">` + layer(blob(300, 1230, 150, 52, { jitter: 0.08, n: 12, seed: 61 }), C.cream, 5) +
        layer(poly(arrowPts(150, 1150, 300, 1150, 30, 76, 64), { round: false }), C.alert, 5) + layer(poly(arrowPts(450, 1310, 300, 1310, 30, 76, 64), { round: false }), C.alert, 5) + `</g>`;
      const tNo = R("triggers5", "rien ne protège"), tBack = R("triggers5", "retour des taches"), dur = X.dur("triggers5");
      const start = Math.max(tNo + 0.6, tBack - 0.5), step = Math.min(0.03, (dur - 0.45 - start) / fl.cells.length);
      return {
        svg: badge(C, 150, 200, 5) + sun(C, 290, 600) + razor(C, 790, 880, 1.0, "razor") + rub +
          shield2(C, 540, 960, 1.45, "shield", { check: false, crack: true }) + fl.svg,
        anims: [
          POP("badge", 0.1, [150, 200]),
          POP("sun", R("triggers5", "soleil"), [290, 600]), POP("sun-rays", R("triggers5", "soleil"), [290, 600]),
          DROP("razor", R("triggers5", "rasage"), [790, 880]),
          POP("rub", R("triggers5", "frottements"), [300, 1230]),
          ...["sun", "sun-rays", "razor", "rub"].map((id) => A(id, tNo, 0.4, { o: 1 }, { o: 0.3 }, { ease: "lin", late: true })),
          POP("shield", tNo, [540, 960]),
          ...fl.order.map((idx, k) => POP(`fd${idx}`, start + k * step, [fl.cells[idx].x, fl.cells[idx].y], { from: { s: 0 }, to: { s: 1 } })),
        ],
        loops: [],
        cam: SLOW(1.0, 1.07, 0, 0),
      };
    })(),

    // « Le problème ne vient pas de toi, ni de ta peau, mais d'en dessous. Et c'est là que tu peux agir. »
    // Le rideau de taches se retire, une loupe cherche la cause sur elle, puis la caméra descend sous la peau et zoome dans la loupe.
    notYou: (() => {
      const D = 1100, melY = 1265 + D, fl = flood(C);
      const tPan = R("notYou", "mais", -0.15), tZoom = Math.max(tPan + 2.0, R("notYou", "agir", -0.3)), dur = X.dur("notYou");
      const arrow = `<g id="down">${layer(poly(arrowPts(540, 1560, 540, 1960, 60, 150, 130), { round: false }), C.alert, 6)}</g>`;
      return {
        bgH: 3500,
        svg: woman(C) + cross(C, 540, 1110, 250, "x1") + cross(C, 640, 780, 220, "x2") + dy(skin(C), D) + dy(melanocyte(C), D) + arrow + loupe(C, 700, 800, 150, "lp") + fl.svg,
        anims: [
          // rideau de taches : reste plein écran un instant puis se retire
          ...fl.order.slice().reverse().map((idx, k) => A(`fd${idx}`, 0.12 + k * 0.016, 0.35, { s: 1 }, { s: 0 }, { origin: [fl.cells[idx].x, fl.cells[idx].y], ease: "inCubic" })),
          POP("lp", 1.0, [700, 800]),
          A("lp", R("notYou", "toi", -0.2), 0.9, { x: 0 }, { x: -230 }, { ease: "inOut" }), POP("x1", R("notYou", "toi", 0.5), [540, 1110]),
          A("lp", R("notYou", "ta peau", -0.2), 0.9, { x: -230 }, { x: 0 }, { ease: "inOut", late: true }), POP("x2", R("notYou", "ta peau", 0.5), [640, 780]),
          A("lp", tPan + 0.1, 1.7, { x: 0, y: 0 }, { x: -160, y: 1565 }, { ease: "inOut", late: true }),
          POP("down", R("notYou", "dessous", -0.2), [540, 1760]),
        ],
        loops: [],
        cam: [
          { t0: 0, t1: tPan, from: { s: 1.3, y: 100 }, to: { s: 1.3, y: 100 }, ease: "lin" },
          { t0: tPan, t1: tPan + 1.7, from: { s: 1.3, y: 100 }, to: { s: 1.35, y: -1897 }, ease: "inOut" },
          { t0: tPan + 1.7, t1: tZoom, from: { s: 1.35, y: -1897 }, to: { s: 1.35, y: -1897 }, ease: "lin" },
          { t0: tZoom, t1: dur, from: { s: 1.35, y: -1897 }, to: { s: 6.5, y: -9132 }, ease: "inOut" },
        ],
      };
    })(),
  };
}
