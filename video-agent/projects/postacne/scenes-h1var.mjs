// 5 variantes visuelles du hook 1 (« Ton mec te dit que tes taches ne se voient pas, mais toi tu ne vois que ça sur tes joues ? »).
// Même voix, mêmes mots-ancres (mec / voient pas / mais toi / vois que ça), cinq mises en scène différentes.
import { layer, blob, poly } from "../../engine/paper.mjs";
import { woman, SPOTS } from "../../library/components.mjs";
import { check, loupe } from "../../library/components2.mjs";
import { A, POP, FADEIN, FADEOUT, DROP, SLOW } from "../full/kit.mjs";
import { scenes as base } from "./scenes-shared.mjs";

export function scenes(C, X) {
  const R = (n, p, o) => { try { return X.rel(n, p, o); } catch { return 0.5; } };
  const spotsLocal = (idp) => SPOTS.map((s, i) => `<g id="${idp}${i}">` + layer(blob(s.x, s.y, s.rx, s.ry, { jitter: 0.22, n: 10, seed: 500 + i }), C.dark, 6, { edge: "rgba(255,225,190,.3)" }) + `</g>`).join("");
  const F = "Inter, 'DejaVu Sans', sans-serif";
  const txt = (x, y, s, size, fill, id, anchor = "middle") => `<g id="${id}"><g filter="url(#paper1)"><text x="${x}" y="${y}" text-anchor="${anchor}" font-family="${F}" font-weight="900" font-size="${size}" fill="${fill}" letter-spacing="1">${s}</text></g></g>`;
  const bubble = (x, y, w, h, id, tail = [-1, 1]) => `<g id="${id}">` + layer(poly([[x - w / 2, y - h / 2], [x + w / 2, y - h / 2], [x + w / 2, y + h / 2], [x - w / 2, y + h / 2]]), C.cream, 5) +
    layer(poly([[x + tail[0] * 40, y + h / 2 - 4], [x + tail[0] * 40 + 56, y + h / 2 - 4], [x + tail[0] * 40 + (tail[1] > 0 ? 70 : -10), y + h / 2 + 70]], { round: false }), C.cream, 5) + `</g>`;
  const man = (x, y, s, id) => `<g id="${id}"><g transform="translate(${x} ${y}) scale(${s})">` +
    layer("M-190 360 L-185 70 Q-170 -20 -80 -50 L80 -50 Q170 -20 185 70 L190 360Z", C.solution, 3) + layer("M-34 -110 L34 -110 L38 -40 Q0 -10 -38 -40Z", "#7C4C33", 4) +
    layer(blob(0, -190, 92, 112, { jitter: 0.02, n: 14, seed: 4301 }), "#8A5A3C", 5) + layer(blob(0, -268, 100, 44, { jitter: 0.05, n: 10, seed: 4302 }), C.dark, 6, { edge: "rgba(0,0,0,0)" }) + `</g></g>`;
  const ring = (id, x, y, r) => `<g id="${id}"><g filter="url(#paper4)"><circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="${C.alert}" stroke-width="7"/></g></g>`;
  const wp = (cx, cy, sc) => SPOTS.map((s) => [cx + s.x * sc, cy + s.y * sc]);
  const spots = (cx, cy, sc, idp) => `<g transform="translate(${cx} ${cy}) scale(${sc})">${spotsLocal(idp)}</g>`;
  const spotPops = (t, idp) => SPOTS.map((s, i) => POP(`${idp}${i}`, t + i * 0.07, [s.x, s.y], { sfx: false }));

  return {
    ...base(C, X),

    // ── V1 · ÉCRAN DIVISÉ : « ce qu'il voit » / « ce que tu vois »
    hookV1: (() => {
      const tMec = R("hookV1", "mec"), tNo = R("hookV1", "voient pas"), tToi = R("hookV1", "mais toi"), tQue = R("hookV1", "vois que ça");
      return {
        svg:
          layer(poly([[-80, -80], [1160, -80], [1160, 960], [-80, 960]], { round: false }), C.cream, 2) + layer(poly([[-80, 960], [1160, 960], [1160, 2000], [-80, 2000]], { round: false }), C.dark, 2) +
          `<clipPath id="v1t"><rect x="0" y="0" width="1080" height="950"/></clipPath><clipPath id="v1b"><rect x="0" y="970" width="1080" height="950"/></clipPath>` +
          `<g id="v1top"><g clip-path="url(#v1t)">${woman(C, { cx: 540, cy: 640, scale: 0.62, spotsOn: false, mirrorOn: false })}</g>${txt(540, 110, "CE QU'IL VOIT", 64, C.dark, "lbl1")}</g>` +
          check(C, 880, 330, 170, "okm") +
          `<g id="v1bot"><g clip-path="url(#v1b)">${woman(C, { cx: 540, cy: 1640, scale: 0.9, spotsOn: false, mirrorOn: false })}${spots(540, 1640, 0.9, "sp")}</g>${txt(540, 1040, "CE QUE TU VOIS", 64, C.cream, "lbl2")}</g>` +
          wp(540, 1640, 0.9).map(([x, y], i) => ring(`rg${i}`, x, y, 27)).join(""),
        anims: [
          A("v1top", Math.max(0, tMec - 0.25), 0.5, { y: -700 }, { y: 0 }, { ease: "outBack", sfx: "whoosh" }), POP("okm", tNo, [880, 330]),
          A("v1bot", Math.max(0.2, tToi - 0.15), 0.5, { y: 900 }, { y: 0 }, { ease: "outBack", sfx: "whoosh" }),
          ...spotPops(tQue, "sp"), ...wp(540, 1640, 0.9).map(([x, y], i) => POP(`rg${i}`, tQue + 0.2 + i * 0.07, [x, y], { sfx: false })),
        ],
        loops: [], cam: SLOW(1.0, 1.04, 0, 20), punches: [{ t: tQue, amp: 0.04 }],
      };
    })(),

    // ── V2 · MIROIR DE SALLE DE BAIN : lui derrière elle dans le reflet, zoom sur la joue
    hookV2: (() => {
      const tMec = R("hookV2", "mec"), tNo = R("hookV2", "voient pas"), tToi = R("hookV2", "mais toi"), tQue = R("hookV2", "vois que ça");
      const CX = 540, CY = 960, SC = 0.95;
      return {
        svg:
          layer(poly([[-80, -80], [1160, -80], [1160, 2000], [-80, 2000]], { round: false }), C.cream, 1) +
          [0, 1, 2, 3, 4, 5].map((i) => `<g filter="url(#paper3)"><line x1="-80" y1="${150 + i * 300}" x2="1160" y2="${150 + i * 300}" stroke="rgba(120,95,70,.25)" stroke-width="6"/></g>`).join("") +
          layer(poly([[-80, 1720], [1160, 1720], [1160, 2000], [-80, 2000]], { round: false }), C.kraftDark, 3) +
          `<g id="mir">${layer(blob(540, 920, 470, 600, { jitter: 0.01, n: 20, seed: 5101 }), C.kraftDark, 3)}${layer(blob(540, 920, 440, 570, { jitter: 0.01, n: 20, seed: 5102 }), C.cream, 4)}` +
          `<clipPath id="mirc"><ellipse cx="540" cy="920" rx="430" ry="560"/></clipPath><g clip-path="url(#mirc)">${man(220, 1250, 0.7, "man")}${woman(C, { cx: CX, cy: CY, scale: SC, spotsOn: false, mirrorOn: false })}${spots(CX, CY, SC, "sp")}</g></g>` +
          bubble(300, 380, 420, 190, "bub", [1, 1]) + check(C, 300, 380, 130, "okm"),
        anims: [
          A("mir", 0, 0.5, { s: 0.7, o: 0 }, { s: 1, o: 1 }, { origin: [540, 920], ease: "outBack", sfx: false }),
          POP("man", Math.max(0.1, tMec - 0.1), [220, 1250]), POP("bub", tNo, [300, 380]), POP("okm", tNo + 0.15, [300, 380]),
          ...spotPops(tQue, "sp"),
        ],
        loops: [], cam: [{ t0: Math.max(0.5, tToi - 0.2), t1: tQue + 1.2, from: { s: 1.0 }, to: { s: 1.28 }, ease: "inOut" }], punches: [{ t: tQue, amp: 0.04 }],
      };
    })(),

    // ── V3 · PROJECTEUR : tout s'assombrit, seules les taches restent éclairées
    hookV3: (() => {
      const tMec = R("hookV3", "mec"), tNo = R("hookV3", "voient pas"), tToi = R("hookV3", "mais toi"), tQue = R("hookV3", "vois que ça");
      const CX = 540, CY = 980, SC = 1.05, P = wp(CX, CY, SC);
      return {
        svg:
          layer(poly([[-80, -80], [1160, -80], [1160, 2000], [-80, 2000]], { round: false }), C.kraft, 1) +
          layer(poly([[-80, 1500], [1160, 1500], [1160, 2000], [-80, 2000]], { round: false }), C.kraftDark, 2) +
          woman(C, { cx: CX, cy: CY, scale: SC, spotsOn: false, mirrorOn: false }) + spots(CX, CY, SC, "sp") +
          `<defs><radialGradient id="v3g" cx="540" cy="${CY + 120}" r="560" gradientUnits="userSpaceOnUse"><stop offset="0.3" stop-color="${C.dark}" stop-opacity="0"/><stop offset="1" stop-color="${C.dark}" stop-opacity=".9"/></radialGradient></defs>` +
          `<g id="dark"><rect x="-80" y="-80" width="1240" height="2080" fill="url(#v3g)"/></g>` +
          P.map(([x, y], i) => ring(`rg${i}`, x, y, 28)).join("") +
          bubble(780, 330, 560, 200, "bub", [-1, 1]) + check(C, 780, 330, 140, "okm") + man(960, 1560, 0.55, "man"),
        anims: [
          DROP("man", Math.max(0, tMec - 0.2), [960, 1560], -900), POP("bub", tNo, [780, 330]), POP("okm", tNo + 0.15, [780, 330]),
          FADEOUT("bub", tToi, 0.3), FADEOUT("okm", tToi, 0.3), FADEOUT("man", tToi, 0.3),
          A("dark", tToi, 0.8, { o: 0 }, { o: 1 }, { ease: "lin", sfx: [{ type: "rise", gain: 0.6 }] }),
          ...spotPops(tQue, "sp"), ...P.map(([x, y], i) => POP(`rg${i}`, tQue + 0.15 + i * 0.07, [x, y], { sfx: false })),
        ],
        loops: [], cam: SLOW(1.0, 1.12, 0, 30), punches: [{ t: tQue, amp: 0.045 }],
      };
    })(),

    // ── V4 · BULLE DE PENSÉE : ce qu'il dit / ce qu'elle pense (les taches grossissent)
    hookV4: (() => {
      const tMec = R("hookV4", "mec"), tNo = R("hookV4", "voient pas"), tToi = R("hookV4", "mais toi"), tQue = R("hookV4", "vois que ça");
      const big = [[-110, -60, 62, 46], [60, -100, 74, 54], [120, 40, 54, 40], [-40, 70, 80, 58], [-150, 90, 40, 30]].map((b, i) => `<g id="bs${i}">` + layer(blob(b[0], b[1], b[2], b[3], { jitter: 0.22, n: 10, seed: 5200 + i }), C.dark, 7, { edge: "rgba(255,225,190,.3)" }) + `</g>`).join("");
      return {
        svg:
          layer(poly([[-80, -80], [1160, -80], [1160, 2000], [-80, 2000]], { round: false }), C.kraft, 1) + layer(poly([[-80, 1620], [1160, 1620], [1160, 2000], [-80, 2000]], { round: false }), C.kraftDark, 2) +
          woman(C, { cx: 420, cy: 1250, scale: 0.82, spotsOn: false, mirrorOn: false }) + spots(420, 1250, 0.82, "sp") +
          man(900, 1500, 0.62, "man") + bubble(700, 880, 420, 170, "bub", [1, 1]) + check(C, 700, 880, 120, "okm") +
          `<g id="th">${layer(blob(500, 520, 380, 300, { jitter: 0.04, n: 16, seed: 5201 }), C.cream, 5)}${layer(blob(360, 860, 38, 38, { n: 10, seed: 5202 }), C.cream, 5)}${layer(blob(400, 760, 26, 26, { n: 10, seed: 5203 }), C.cream, 5)}` +
          `<g transform="translate(500 520)">${big}</g></g>`,
        anims: [
          DROP("man", Math.max(0, tMec - 0.2), [900, 1500], -900), POP("bub", tNo, [700, 880]), POP("okm", tNo + 0.15, [700, 880]),
          POP("th", tToi, [500, 520]),
          ...[0, 1, 2, 3, 4].map((i) => POP(`bs${i}`, tQue + i * 0.09, [0, 0], { sfx: false })),
          ...[0, 1, 2, 3, 4].map((i) => A(`bs${i}`, tQue + 0.6 + i * 0.05, 0.9, { s: 1 }, { s: 1.35 }, { origin: [0, 0], ease: "inOut", late: true, sfx: false })),
          ...spotPops(tQue, "sp"),
        ],
        loops: [], cam: SLOW(1.0, 1.08, 0, 40), punches: [{ t: tQue, amp: 0.04 }],
      };
    })(),

    // ── V5 · SCANNER : une barre balaie le visage, des réticules rouges verrouillent chaque tache
    hookV5: (() => {
      const tMec = R("hookV5", "mec"), tNo = R("hookV5", "voient pas"), tToi = R("hookV5", "mais toi"), tQue = R("hookV5", "vois que ça"), dur = X.dur ? (() => { try { return X.dur("hookV5"); } catch { return 4.5; } })() : 4.5;
      const CX = 540, CY = 930, SC = 1.0, P = wp(CX, CY, SC);
      const ret = (id, x, y) => `<g id="${id}"><g filter="url(#paper4)"><circle cx="${x}" cy="${y}" r="27" fill="none" stroke="${C.alert}" stroke-width="6"/>` +
        [[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([a, b]) => `<path d="M${x + a * 44} ${y + b * 24} L${x + a * 44} ${y + b * 44} L${x + a * 24} ${y + b * 44}" fill="none" stroke="${C.alert}" stroke-width="7" stroke-linecap="round"/>`).join("") + `</g></g>`;
      return {
        svg:
          layer(poly([[-80, -80], [1160, -80], [1160, 2000], [-80, 2000]], { round: false }), C.dark, 1) +
          [0, 1, 2, 3, 4, 5, 6].map((i) => `<g filter="url(#paper3)"><line x1="${i * 180 - 60}" y1="-80" x2="${i * 180 - 60}" y2="2000" stroke="rgba(255,225,190,.07)" stroke-width="4"/></g>`).join("") +
          woman(C, { cx: CX, cy: CY, scale: SC, spotsOn: false, mirrorOn: false }) + spots(CX, CY, SC, "sp") +
          `<g id="scan"><rect x="-80" y="0" width="1240" height="16" fill="${C.solution}"/><rect x="-80" y="-170" width="1240" height="170" fill="${C.solution}" fill-opacity=".18"/></g>` +
          P.map(([x, y], i) => ret(`rg${i}`, x, y)).join("") +
          txt(540, 1560, "TACHES DÉTECTÉES : 11", 56, C.alert, "lbl") +
          bubble(300, 330, 460, 180, "bub", [1, 1]) + check(C, 300, 330, 120, "okm") + man(900, 1560, 0.5, "man"),
        anims: [
          DROP("man", Math.max(0, tMec - 0.2), [900, 1560], -900), POP("bub", tNo, [300, 330]), POP("okm", tNo + 0.15, [300, 330]),
          FADEOUT("bub", tToi, 0.3), FADEOUT("okm", tToi, 0.3), FADEOUT("man", tToi, 0.3),
          A("scan", tToi, Math.max(0.6, tQue - tToi + 0.5), { y: 560 }, { y: 1380 }, { ease: "lin", sfx: [{ type: "rise", gain: 0.7 }] }),
          ...spotPops(tQue, "sp"), ...P.map(([x, y], i) => POP(`rg${i}`, tQue + 0.1 + i * 0.09, [x, y], { sfx: false })),
          POP("lbl", tQue + 0.6, [540, 1560]),
        ],
        loops: [], cam: SLOW(1.0, 1.06, 0, 20), punches: [{ t: tQue, amp: 0.045 }],
      };
    })(),
  };
}
