// Hooks 2 et 3 — concepts « à la FaceTime » :
//   H2 · « Tu retouches tes photos parce que les taches qu'ont laissées tes boutons gâchent tout. Alors regarde ça. » → l'appli de retouche, puis le miroir
//   H3 · « T'as la peau mate ou noire, tes boutons sont partis mais… les taches sont toujours là. Alors écoute ça. »  → le calendrier qui défile
import { layer, blob, poly } from "../../engine/paper.mjs";
import { woman, SPOTS, FACE } from "../../library/components.mjs";
import { pimple } from "../../library/components2.mjs";
import { A, POP, FADEOUT } from "../full/kit.mjs";
import { scenes as base } from "./scenes-h1concepts.mjs";

export function scenes(C, X) {
  const R = (n, p, o) => { try { return X.rel(n, p, o); } catch { return 0.5; } };
  const F = "Inter, 'DejaVu Sans', sans-serif";
  const BG = (fill) => `<rect x="-600" y="-600" width="2280" height="3200" fill="${fill}"/>`;
  const txt = (x, y, s, size, fill, anchor = "middle", w = 900) => `<g filter="url(#paper1)"><text x="${x}" y="${y}" text-anchor="${anchor}" font-family="${F}" font-weight="${w}" font-size="${size}" fill="${fill}">${s}</text></g>`;
  const spotsAt = (cx, cy, sc, idp) => `<g transform="translate(${cx} ${cy}) scale(${sc})">` + SPOTS.map((s, i) => `<g id="${idp}${i}">` + layer(blob(s.x, s.y, s.rx, s.ry, { jitter: 0.22, n: 10, seed: 500 + i }), C.dark, 6, { edge: "rgba(255,225,190,.3)" }) + `</g>`).join("") + `</g>`;
  const wp = (cx, cy, sc) => SPOTS.map((s) => [cx + s.x * sc, cy + s.y * sc]);
  const grow = (t, idp, k, idx) => idx.map((i, n) => A(`${idp}${i}`, t + n * 0.04, 0.5, { s: 1 }, { s: k }, { origin: [SPOTS[i].x, SPOTS[i].y], ease: "outBack", late: true, sfx: n === 0 ? [{ type: "e_drop", gain: 0.8 }] : false }));
  const pulse = (t, idp, idx) => idx.map((i) => ({ id: `${idp}${i}`, prop: "s", amp: 0.07, freq: 1.7, phase: i * 0.13, start: t, origin: [SPOTS[i].x, SPOTS[i].y] }));
  const ALL = SPOTS.map((_, i) => i);
  const vignette = (id, cx, cy, r) => `<defs><radialGradient id="${id}g" cx="${cx}" cy="${cy}" r="${r}" gradientUnits="userSpaceOnUse"><stop offset=".4" stop-color="${C.dark}" stop-opacity="0"/><stop offset="1" stop-color="${C.dark}" stop-opacity=".85"/></radialGradient></defs>` +
    `<g id="${id}"><rect x="-600" y="-600" width="2280" height="3200" fill="url(#${id}g)"/></g>`;

  return {
    ...base(C, X),

    // ── H2 · APPLI DE RETOUCHE : son doigt efface les taches une à une sur la photo… puis elle pose le téléphone : dans le miroir, elles sont toujours là
    hookRetouche2: (() => {
      const tRet = R("hookRetouche2", "retouches"), tGa = R("hookRetouche2", "gâchent"), tReg = R("hookRetouche2", "regarde");
      const PX = 540, PY = 820, PS = 0.85;              // visage sur la photo (dans l'appli)
      const MX = 540, MY = 930, MS = 0.95;              // reflet dans le miroir (la réalité)
      const P = wp(PX, PY, PS), ORDER = [3, 0, 1, 2, 8, 10, 9, 6, 4, 5, 7];
      const t0 = tRet + 0.15, t1 = Math.max(t0 + 1.2, tGa - 0.55), hop = (t1 - t0) / ORDER.length;
      // main : index tendu (le bout touche la tache, entouré du curseur de l'outil), paume et pouce en dessous, légèrement de biais
      const finger = `<g id="fing"><g transform="rotate(-18)">` +
        layer(blob(30, 420, 118, 150, { jitter: 0.03, n: 14, seed: 7102 }), FACE.skin, 7) +
        layer(poly([[-108, 330], [-70, 300], [-30, 380], [-62, 420]]), FACE.skin, 7) +
        [[42, 300, 250], [86, 320, 230], [118, 350, 215]].map(([x, y0, y1], k) => layer(poly([[x - 20, y1], [x + 20, y1], [x + 20, y0 + 40], [x - 20, y0 + 40]]), FACE.skin, 7)).join("") +
        layer(poly([[-28, 46], [28, 46], [32, 330], [-32, 330]]), FACE.skin, 8) + layer(blob(0, 70, 17, 21, { n: 10, seed: 7101 }), C.cream, 9) +
        `</g><g filter="url(#paper3)"><circle cx="0" cy="0" r="44" fill="${C.cream}" fill-opacity=".18" stroke="${C.cream}" stroke-width="5"/></g></g>`;
      const hops = [];
      let prev = [760, 2300];
      ORDER.forEach((i, n) => {
        const t = t0 + n * hop;
        hops.push(A("fing", t, hop * 0.6, { x: prev[0], y: prev[1] }, { x: P[i][0], y: P[i][1] }, { ease: "inOut", late: true, sfx: false }));
        hops.push(A(`sp${i}`, t + hop * 0.6, 0.12, { o: 1 }, { o: 0 }, { ease: "lin", late: true, sfx: n % 2 ? false : "tick" }));
        prev = P[i];
      });
      hops.push(A("fing", t1, 0.25, { x: prev[0], y: prev[1] }, { x: 860, y: 262 }, { ease: "inOut", late: true, sfx: false }));
      return {
        svg: BG(C.cream) +
          [0, 1, 2, 3, 4, 5, 6].map((i) => `<line x1="-600" y1="${i * 300}" x2="1680" y2="${i * 300}" stroke="${C.kraft}" stroke-opacity=".5" stroke-width="5"/><line x1="${i * 180}" y1="-600" x2="${i * 180}" y2="2600" stroke="${C.kraft}" stroke-opacity=".35" stroke-width="5"/>`).join("") +
          layer(blob(540, 900, 470, 610, { jitter: 0.01, n: 20, seed: 7103 }), C.kraftDark, 3) +
          `<clipPath id="mir"><ellipse cx="540" cy="900" rx="440" ry="580"/></clipPath><g clip-path="url(#mir)"><rect x="80" y="300" width="920" height="1200" fill="#E8D0A8"/>` +
          woman(C, { cx: MX, cy: MY, scale: MS, spotsOn: false, mirrorOn: false }) + spotsAt(MX, MY, MS, "rs") + `</g>` +
          vignette("vig", MX, MY + 90, 470) +
          `<g id="phone"><g filter="url(#paper3)"><rect x="110" y="120" width="860" height="1680" rx="96" fill="${C.dark}"/></g>` +
          `<clipPath id="scr"><rect x="150" y="160" width="780" height="1600" rx="70"/></clipPath><g clip-path="url(#scr)"><rect x="150" y="160" width="780" height="1600" fill="#3A2214"/>` +
          txt(230, 275, "Annuler", 34, C.cream, "middle", 600) + txt(540, 275, "Retouche", 40, C.cream) + `<g id="okb">${txt(860, 275, "OK", 40, C.accent)}</g>` +
          `<clipPath id="pho"><rect x="170" y="330" width="740" height="930" rx="10"/></clipPath><g clip-path="url(#pho)"><rect x="170" y="330" width="740" height="930" fill="${C.kraft}"/>` +
          woman(C, { cx: PX, cy: PY, scale: PS, spotsOn: false, mirrorOn: false }) + spotsAt(PX, PY, PS, "sp") + `</g>` +
          `<g filter="url(#paper3)">` + [270, 405, 540, 675, 810].map((x) => `<circle cx="${x}" cy="1370" r="46" fill="${x === 540 ? C.accent : C.kraftDark}"/>`).join("") + `</g>` +
          `<g filter="url(#paper1)"><rect x="512" y="1356" width="56" height="28" rx="12" fill="${C.cream}" transform="rotate(-35 540 1370)"/></g>` +
          `<g filter="url(#paper1)"><line x1="250" y1="1680" x2="830" y2="1680" stroke="${C.kraft}" stroke-width="8" stroke-linecap="round"/><circle cx="660" cy="1680" r="22" fill="${C.cream}"/></g>` +
          finger + `</g></g>`,
        anims: [
          A("phone", 0, 0.5, { y: 900 }, { y: 0 }, { ease: "outBack", sfx: "whoosh" }),
          A("vig", 0, 0.01, { o: 0 }, { o: 0 }, { ease: "lin", sfx: false }),
          A("fing", 0, 0.01, { x: 760, y: 2300 }, { x: 760, y: 2300 }, { ease: "lin", sfx: false }),
          ...hops,
          POP("okb", t1 + 0.25, [860, 262], { sfx: "tick" }),
          // elle pose le téléphone : le miroir montre la réalité
          A("phone", tGa - 0.05, 0.5, { y: 0, r: 0 }, { y: 1900, r: 8 }, { origin: [540, 960], ease: "inCubic", late: true, sfx: "whoosh" }),
          A("vig", tGa + 0.5, 0.7, { o: 0 }, { o: 1 }, { ease: "lin", late: true, sfx: false }),
          ...grow(tGa + 0.6, "rs", 1.5, ALL),
        ],
        loops: pulse(tGa + 1.2, "rs", ALL),
        cam: [{ t0: tGa + 0.3, t1: tGa + 1.3, from: { s: 1, x: 0, y: 0 }, to: { s: 1.3, x: 0, y: -1.3 * (MY + 30 - 960) }, ease: "inOut" }],
        punches: [{ t: tGa + 0.45, amp: 0.04 }],
      };
    })(),

    // ── H3 · CALENDRIER : les semaines passent, les boutons partent un à un… mais les taches restent
    hookPeau2: (() => {
      const tPeau = R("hookPeau2", "peau mate"), tBou = R("hookPeau2", "boutons"), tPar = R("hookPeau2", "partis"), tMais = R("hookPeau2", "mais"), tTa = R("hookPeau2", "taches");
      const WX = 540, WY = 1060, WS = 0.95, IDX = [0, 1, 3, 4, 5, 7, 8, 9], P = wp(WX, WY, WS);
      const PAGES = ["1", "2", "4", "8", "12"];
      const page = (i, n) => `<g id="pg${i}">` + layer(poly([[370, 250], [710, 250], [710, 540], [370, 540]], { round: false }), C.cream, 4) +
        txt(540, 320, "SEMAINE", 40, C.kraftDark) + txt(540, 490, n, 160, i === PAGES.length - 1 ? C.alert : C.dark) + `</g>`;
      const spots = `<g transform="translate(${WX} ${WY}) scale(${WS})">` + IDX.map((i) => { const s = SPOTS[i]; return `<g id="sp${i}">` + layer(blob(s.x, s.y, s.rx, s.ry, { jitter: 0.22, n: 10, seed: 500 + i }), C.dark, 6, { edge: "rgba(255,225,190,.3)" }) + `</g>`; }).join("") + `</g>`;
      const pimples = IDX.map((i) => pimple(C, P[i][0], P[i][1], ((SPOTS[i].rx + 9) / 62) * WS, `pm${i}`)).join("");
      const tEnd = Math.max(tBou + 0.9, tPar + 0.25), step = (tEnd - tBou) / (PAGES.length - 1);
      return {
        svg: woman(C, { cx: WX, cy: WY, scale: WS, spotsOn: false, mirrorOn: false }) + spots + pimples +
          vignette("vig", WX, WY + 90, 430) +
          `<g id="cal">` + layer(poly([[355, 215], [725, 215], [725, 262], [355, 262]], { round: false }), C.alert, 5) +
          PAGES.map((n, i) => page(i, n)).reverse().join("") +
          `<g filter="url(#paper3)">${[430, 500, 580, 650].map((x) => `<circle cx="${x}" cy="238" r="11" fill="${C.dark}"/>`).join("")}</g></g>`,
        anims: [
          POP("woman", 0.05, [WX, WY], { sfx: false }),
          ...IDX.map((i) => A(`sp${i}`, 0, 0.01, { o: 0 }, { o: 0 }, { ease: "lin", sfx: false })),
          ...IDX.map((i, n) => POP(`pm${i}`, Math.max(0.3, tPeau) + n * 0.07, P[i], { sfx: n === 0 ? "pop" : false })),
          A("cal", Math.max(0.2, tPeau - 0.1), 0.45, { y: -500 }, { y: 0 }, { ease: "outBack", sfx: "whoosh" }),
          // les semaines défilent ; à chaque page, des boutons partent… et laissent une tache
          ...PAGES.slice(0, -1).map((_, i) => A(`pg${i}`, tBou + i * step, 0.3, { y: 0, r: 0, o: 1 }, { y: -240, r: -22, o: 0 }, { origin: [540, 250], ease: "inCubic", late: true, sfx: "flip" })),
          ...IDX.map((i, n) => { const t = tBou + 0.1 + (n * (tEnd - tBou)) / IDX.length; return A(`pm${i}`, t, 0.18, { s: 1 }, { s: 0 }, { origin: P[i], ease: "inCubic", late: true, sfx: n % 2 ? false : [{ type: "e_pop", gain: 0.8 }] }); }),
          ...IDX.map((i, n) => { const t = tBou + 0.18 + (n * (tEnd - tBou)) / IDX.length; return A(`sp${i}`, t, 0.25, { o: 0 }, { o: 1 }, { ease: "lin", late: true, sfx: false }); }),
          A("vig", 0, 0.01, { o: 0 }, { o: 0 }, { ease: "lin", sfx: false }), A("vig", tTa - 0.1, 0.6, { o: 0 }, { o: 1 }, { ease: "lin", late: true, sfx: false }),
          ...grow(tTa, "sp", 1.5, IDX),
        ],
        loops: pulse(tTa + 0.7, "sp", IDX),
        cam: [{ t0: tMais - 0.1, t1: tTa + 0.6, from: { s: 1, x: 0, y: 0 }, to: { s: 1.35, x: 0, y: -1.35 * (WY + 20 - 960) }, ease: "inOut" }],
        punches: [{ t: tTa, amp: 0.04 }],
      };
    })(),
  };
}
