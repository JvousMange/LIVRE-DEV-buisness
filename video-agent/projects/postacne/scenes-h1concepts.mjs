// Hook 1 — « Ton mec te dit que tes taches ne se voient pas, mais toi tu ne vois que ça sur tes joues ? »
// Cinq CONCEPTS visuels différents (pas le même portrait de face décliné) : FaceTime, dîner aux chandelles, éclipse, carte, reflets.
import { layer, blob, poly } from "../../engine/paper.mjs";
import { woman, SPOTS, FACE } from "../../library/components.mjs";
import { check } from "../../library/components2.mjs";
import { A, POP, FADEIN, FADEOUT, DROP, SLOW } from "../full/kit.mjs";
import { scenes as base } from "./scenes-h1var.mjs";

export function scenes(C, X) {
  const R = (n, p, o) => { try { return X.rel(n, p, o); } catch { return 0.5; } };
  const D = (n) => { try { return X.dur(n); } catch { return 4.8; } };
  const F = "Inter, 'DejaVu Sans', sans-serif";
  const BG = (fill) => `<rect x="-600" y="-600" width="2280" height="3200" fill="${fill}"/>`;
  const txt = (x, y, s, size, fill, anchor = "middle", w = 900) => `<g filter="url(#paper1)"><text x="${x}" y="${y}" text-anchor="${anchor}" font-family="${F}" font-weight="${w}" font-size="${size}" fill="${fill}">${s}</text></g>`;
  const spotsAt = (cx, cy, sc, idp) => `<g transform="translate(${cx} ${cy}) scale(${sc})">` + SPOTS.map((s, i) => `<g id="${idp}${i}">` + layer(blob(s.x, s.y, s.rx, s.ry, { jitter: 0.22, n: 10, seed: 500 + i }), C.dark, 6, { edge: "rgba(255,225,190,.3)" }) + `</g>`).join("") + `</g>`;
  const spotPops = (t, idp, step = 0.06) => SPOTS.map((s, i) => POP(`${idp}${i}`, t + i * step, [s.x, s.y], { sfx: false }));
  const wp = (cx, cy, sc) => SPOTS.map((s) => [cx + s.x * sc, cy + s.y * sc]);
  const ring = (id, x, y, r, w = 6) => `<g id="${id}"><g filter="url(#paper3)"><circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="${C.alert}" stroke-width="${w}"/></g></g>`;
  const heart = (x, y, s, id, fill = C.alert) => `<g id="${id}"><g transform="translate(${x} ${y}) scale(${s})">` + layer("M0 34 C-70 -14 -42 -78 0 -42 C42 -78 70 -14 0 34Z", fill, 6) + `</g></g>`;
  const bubble = (x, y, w, h, id, text, size = 40, tail = 1) => `<g id="${id}">` + layer(poly([[x - w / 2, y - h / 2], [x + w / 2, y - h / 2], [x + w / 2, y + h / 2], [x - w / 2, y + h / 2]]), C.cream, 6) +
    layer(poly([[x + tail * 30 - 28, y + h / 2 - 6], [x + tail * 30 + 28, y + h / 2 - 6], [x + tail * 90, y + h / 2 + 62]], { round: false }), C.cream, 6) + txt(x, y + size * 0.35, text, size, C.dark) + `</g>`;
  const man = (x, y, s, id) => `<g id="${id}"><g transform="translate(${x} ${y}) scale(${s})">` +
    layer("M-190 360 L-185 70 Q-170 -20 -80 -50 L80 -50 Q170 -20 185 70 L190 360Z", C.solution, 3) + layer("M-34 -110 L34 -110 L38 -40 Q0 -10 -38 -40Z", "#7C4C33", 4) +
    layer(blob(0, -190, 92, 112, { jitter: 0.02, n: 14, seed: 4301 }), C.skinDeep, 5) + layer(blob(0, -268, 100, 44, { jitter: 0.05, n: 10, seed: 4302 }), C.dark, 6, { edge: "rgba(0,0,0,0)" }) + `</g></g>`;
  // silhouette en pied (petite échelle) : pour les plans larges
  const person = (x, yF, s, id, { skin, top, puff }) => {
    const hair = puff ? [0, 1, 2, 3, 4, 5, 6].map((i) => { const a = Math.PI * (0.85 + i * 0.22); return layer(blob(Math.cos(a) * 62, -446 + Math.sin(a) * 60, 34, 34, { jitter: 0.1, n: 8, seed: 6100 + i }), C.dark, 4); }).join("") : layer(blob(0, -488, 50, 24, { jitter: 0.05, n: 8, seed: 6120 }), C.dark, 6);
    return `<g id="${id}"><g transform="translate(${x} ${yF}) scale(${s})">` +
      layer(poly([[-42, -170], [-6, -170], [-10, 0], [-40, 0]], { round: false }), C.dark, 3) + layer(poly([[6, -170], [42, -170], [40, 0], [10, 0]], { round: false }), C.dark, 3) +
      hair + layer("M-74 -160 L-64 -340 Q-54 -388 0 -392 Q54 -388 64 -340 L74 -160Z", top, 4) + layer(blob(0, -450, 46, 56, { jitter: 0.02, n: 12, seed: 6130 }), skin, 5) + `</g></g>`;
  };

  return {
    ...base(C, X),

    // ── W1 · FACETIME : lui en grand à l'écran… mais elle ne regarde que sa petite vignette, qui envahit tout
    hookW1: (() => {
      const tMec = R("hookW1", "mec"), tNo = R("hookW1", "voient pas"), tToi = R("hookW1", "mais toi"), tQue = R("hookW1", "vois que ça");
      const SX = 760, SY = 525, SS = 0.42;            // visage dans la vignette
      return {
        svg: BG(C.problem) +
          `<g id="phone"><g filter="url(#paper3)"><rect x="110" y="120" width="860" height="1680" rx="96" fill="${C.dark}"/></g>` +
          `<defs><radialGradient id="lmp" cx="300" cy="760" r="380" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="${C.accent}" stop-opacity=".55"/><stop offset="1" stop-color="${C.accent}" stop-opacity="0"/></radialGradient></defs>` +
          `<clipPath id="scr"><rect x="150" y="160" width="780" height="1600" rx="70"/></clipPath><g clip-path="url(#scr)">` +
          `<rect x="150" y="160" width="780" height="1600" fill="${C.kraft}"/><rect x="150" y="160" width="780" height="1600" fill="url(#lmp)"/>` +
          layer(poly([[150, 1180], [930, 1180], [930, 1760], [150, 1760]], { round: false }), C.kraftDark, 2) +
          layer(poly([[262, 560], [338, 560], [372, 680], [228, 680]], { round: false }), C.cream, 4) + layer(poly([[294, 680], [306, 680], [306, 1180], [294, 1180]], { round: false }), C.dark, 3) +
          `<g id="him">${man(540, 1330, 1.55, "manv")}</g>` +
          `<g id="ui">${txt(540, 250, "Mon chéri", 48, C.cream)}${txt(540, 300, "02:14", 30, C.cream, "middle", 600)}` +
          `<g filter="url(#paper3)"><circle cx="360" cy="1640" r="60" fill="${C.kraftDark}"/><circle cx="540" cy="1640" r="66" fill="${C.alert}"/><circle cx="720" cy="1640" r="60" fill="${C.kraftDark}"/></g>` +
          `<g filter="url(#paper1)"><rect x="505" y="1628" width="70" height="24" rx="12" fill="${C.cream}"/></g></g>` +
          // bulle juste au-dessus de sa tête, la pointe vers sa bouche
          bubble(420, 720, 470, 150, "bub", "Ça se voit pas !", 48, 1) +
          // vignette « moi » : elle ne regarde que ça
          `<g id="self"><clipPath id="selfc"><rect x="640" y="360" width="240" height="300" rx="26"/></clipPath><g clip-path="url(#selfc)"><rect x="640" y="360" width="240" height="300" fill="${C.cream}"/>` +
          woman(C, { cx: SX, cy: SY, scale: SS, spotsOn: false, mirrorOn: false }) + spotsAt(SX, SY, SS, "sp") + `</g>` +
          `<g filter="url(#paper3)"><rect x="640" y="360" width="240" height="300" rx="26" fill="none" stroke="${C.cream}" stroke-width="7"/></g>` +
          `<g id="selfhi"><g filter="url(#paper3)"><rect x="634" y="354" width="252" height="312" rx="30" fill="none" stroke="${C.accent}" stroke-width="10"/></g></g></g>` +
          `</g></g>`,
        anims: [
          A("phone", 0, 0.5, { y: 900 }, { y: 0 }, { ease: "outBack", sfx: "whoosh" }),
          POP("him", Math.max(0.15, tMec - 0.05), [540, 1100]),
          POP("self", 0.35, [760, 510], { sfx: false }), ...spotPops(0.45, "sp", 0.01),
          POP("bub", tNo - 0.1, [440, 790]),
          POP("selfhi", tToi - 0.05, [760, 510]),
          FADEOUT("bub", tQue - 0.25, 0.2), FADEOUT("selfhi", tQue - 0.2, 0.15),
          A("self", tQue - 0.2, 0.6, { s: 1 }, { s: 3.3 }, { origin: [880, 360], ease: "outBack", late: true, sfx: "whoosh" }),
          A("self", tQue + 0.5, 1.6, { s: 3.3 }, { s: 3.55 }, { origin: [880, 360], ease: "lin", late: true, sfx: false }),
        ],
        loops: [], cam: SLOW(1.0, 1.03, 0, 0), punches: [{ t: tQue + 0.3, amp: 0.035 }],
      };
    })(),

    // ── W2 · DÎNER AUX CHANDELLES : lui la regarde avec des cœurs, elle cache sa joue avec sa main
    hookW2: (() => {
      const tMec = R("hookW2", "mec"), tNo = R("hookW2", "voient pas"), tToi = R("hookW2", "mais toi"), tQue = R("hookW2", "vois que ça");
      const WX = 290, WY = 900, WS = 0.55, HX = WX - 104 * WS, HY = WY + 100 * WS;
      const hand = `<g id="hand">` + layer(poly([[HX - 30, HY + 40], [HX + 30, HY + 40], [HX + 60, HY + 520], [HX - 10, HY + 520]], { round: false }), C.dark, 6) +
        layer(blob(HX, HY + 20, 48, 52, { jitter: 0.04, n: 12, seed: 6201 }), FACE.skin, 7) +
        [-30, -10, 10, 30].map((dx, i) => layer(poly([[HX + dx - 9, HY - 60 + (i === 0 || i === 3 ? 18 : 0)], [HX + dx + 9, HY - 60 + (i === 0 || i === 3 ? 18 : 0)], [HX + dx + 9, HY + 10], [HX + dx - 9, HY + 10]]), FACE.skin, 7)).join("") + `</g>`;
      return {
        svg: BG(C.problem) +
          [0, 1, 2, 3, 4, 5].map((i) => `<rect x="${-40 + i * 200}" y="-600" width="80" height="2400" fill="${C.dark}" fill-opacity=".18"/>`).join("") +
          `<defs><radialGradient id="cg" cx="540" cy="960" r="330" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="${C.accent}" stop-opacity=".42"/><stop offset=".45" stop-color="${C.accent}" stop-opacity=".14"/><stop offset="1" stop-color="${C.accent}" stop-opacity="0"/></radialGradient></defs>` +
          // tableau (lune) à gauche, en hauteur : laisse la place à la bulle au-dessus de lui
          layer(poly([[110, 250], [370, 250], [370, 520], [110, 520]], { round: false }), C.dark, 3) + `<g filter="url(#paper3)"><circle cx="290" cy="340" r="40" fill="${C.cream}"/></g>` +
          `<g id="glow"><rect x="160" y="580" width="760" height="760" fill="url(#cg)"/></g>` +
          woman(C, { cx: WX, cy: WY, scale: WS, spotsOn: false, mirrorOn: false }) + spotsAt(WX, WY, WS, "sp") +
          man(800, 1130, 0.85, "man") + hand +
          layer(poly([[-200, 1170], [1280, 1170], [1280, 2400], [-200, 2400]], { round: false }), C.cream, 3) +
          layer(poly([[-200, 1170], [1280, 1170], [1280, 1205], [-200, 1205]], { round: false }), C.kraft, 4) +
          `<g id="cdl">${layer(poly([[522, 990], [558, 990], [558, 1180], [522, 1180]], { round: false }), C.cream, 5)}${layer(poly([[500, 1170], [580, 1170], [580, 1200], [500, 1200]], { round: false }), C.kraftDark, 5)}</g>` +
          `<g id="flame">${layer(blob(540, 955, 22, 38, { jitter: 0.06, n: 10, seed: 6202 }), C.accent, 6)}${layer(blob(540, 965, 10, 18, { jitter: 0.06, n: 8, seed: 6203 }), C.alert, 7)}</g>` +
          layer(blob(250, 1250, 120, 34, { jitter: 0.03, n: 14, seed: 6204 }), "#FFFFFF", 4) + layer(blob(830, 1250, 120, 34, { jitter: 0.03, n: 14, seed: 6205 }), "#FFFFFF", 4) +
          // cœurs au-dessus de sa tête, puis la bulle prend leur place (pointe vers lui)
          heart(800, 800, 0.75, "h1") + heart(900, 740, 0.55, "h2") + heart(705, 735, 0.5, "h3") +
          bubble(760, 690, 500, 150, "bub", "Ça se voit pas !", 48, 0.4),
        anims: [
          ...spotPops(0.25, "sp", 0.02),
          A("man", Math.max(0, tMec - 0.25), 0.5, { x: 600 }, { x: 0 }, { ease: "outBack", sfx: "whoosh" }),
          POP("h1", tMec + 0.25, [800, 800]), POP("h2", tMec + 0.4, [900, 740], { sfx: false }), POP("h3", tMec + 0.55, [705, 735], { sfx: false }),
          FADEOUT("h1", tNo - 0.15, 0.15), FADEOUT("h2", tNo - 0.15, 0.15), FADEOUT("h3", tNo - 0.15, 0.15),
          POP("bub", tNo - 0.1, [800, 760]),
          A("hand", tToi - 0.1, 0.45, { y: 460 }, { y: 0 }, { ease: "outBack", sfx: "swish" }),
          FADEOUT("bub", tQue, 0.25),
        ],
        loops: [{ id: "flame", prop: "s", amp: 0.07, freq: 5.5, start: 0, origin: [540, 990] }, { id: "glow", prop: "s", amp: 0.04, freq: 3.1, start: 0, origin: [540, 960] }],
        cam: [{ t0: tQue - 0.1, t1: tQue + 0.8, from: { s: 1, x: 0, y: 0 }, to: { s: 1.75, x: 1.75 * (540 - 300), y: 1.75 * (960 - 930) }, ease: "inOut" }],
        punches: [{ t: tToi + 0.3, amp: 0.03 }],
      };
    })(),

    // ── W3 · ÉCLIPSE : plan large, une petite tache s'envole de sa joue et finit par cacher le soleil
    hookW3: (() => {
      const tMec = R("hookW3", "mec"), tNo = R("hookW3", "voient pas"), tToi = R("hookW3", "mais toi"), tQue = R("hookW3", "vois que ça");
      const SX = 410, SY = 975;                               // tache de départ, sur sa joue
      return {
        svg: BG(C.cream) +
          `<g id="sun"><g filter="url(#paper4)"><circle cx="540" cy="560" r="150" fill="${C.accent}"/></g></g>` +
          layer(blob(250, 420, 140, 46, { jitter: 0.05, n: 12, seed: 6301 }), "#FFFFFF", 3) + layer(blob(860, 330, 120, 40, { jitter: 0.05, n: 12, seed: 6302 }), "#FFFFFF", 3) +
          layer("M-300 1260 Q200 1150 560 1220 Q900 1280 1400 1180 L1400 2600 L-300 2600Z", C.kraftDark, 3) + layer("M-300 1500 Q300 1430 700 1490 Q1000 1530 1400 1460 L1400 2600 L-300 2600Z", C.kraft, 4) +
          person(430, 1300, 0.75, "her", { skin: FACE.skin, top: C.alert, puff: true }) + person(650, 1300, 0.8, "man", { skin: C.skinDeep, top: C.solution, puff: false }) +
          bubble(720, 860, 400, 120, "bub", "Ça se voit pas !", 36, -1) +
          `<g id="dark"><rect x="-600" y="-600" width="2280" height="3200" fill="${C.dark}" fill-opacity=".62"/></g>` +
          `<g id="cor"><g filter="url(#paper4)"><circle cx="540" cy="560" r="190" fill="none" stroke="${C.accent}" stroke-width="20"/><circle cx="540" cy="560" r="232" fill="none" stroke="${C.accent}" stroke-width="7" stroke-opacity=".6"/></g></g>` +
          `<g id="stm"><g id="stg">${layer(blob(SX, SY, 11, 9, { jitter: 0.2, n: 10, seed: 6303 }), C.dark, 7, { edge: "rgba(255,225,190,.35)" })}</g></g>`,
        anims: [
          A("man", Math.max(0, tMec - 0.25), 0.5, { x: 600 }, { x: 0 }, { ease: "outBack", sfx: "whoosh" }),
          POP("bub", tNo, [720, 860]), FADEOUT("bub", tToi + 0.3, 0.25),
          POP("stm", tToi - 0.05, [SX, SY]),
          A("stm", tToi + 0.25, Math.max(0.4, tQue - tToi - 0.15), { x: 0, y: 0 }, { x: 540 - SX, y: 560 - SY }, { ease: "inOut", late: true, sfx: "swish" }),
          A("stg", tQue + 0.05, 0.75, { s: 1 }, { s: 15 }, { origin: [SX, SY], ease: "outCubic", sfx: [{ type: "e_drop", gain: 1 }] }),
          A("dark", tQue + 0.15, 0.6, { o: 0 }, { o: 1 }, { ease: "lin", sfx: false }),
          POP("cor", tQue + 0.55, [540, 560]),
        ],
        loops: [{ id: "cor", prop: "s", amp: 0.03, freq: 2, start: tQue + 1.1, origin: [540, 560] }],
        cam: SLOW(1.0, 1.06, 0, 30), punches: [{ t: tQue + 0.4, amp: 0.05 }],
      };
    })(),

    // ── W4 · CARTE : on plonge dans sa joue comme sur une carte, une épingle rouge sur chaque tache
    hookW4: (() => {
      const tMec = R("hookW4", "mec"), tNo = R("hookW4", "voient pas"), tToi = R("hookW4", "mais toi"), tQue = R("hookW4", "vois que ça");
      const WX = 540, WY = 980, Z = 2.7, TX = 450, TY = 1060;          // cible du zoom : la joue gauche
      const P = wp(WX, WY, 1).filter(([x, y]) => Math.abs((x - TX) * Z) < 470 && Math.abs((y - TY) * Z) < 520);
      const pin = (id, x, y) => `<g id="${id}"><g transform="translate(${x} ${y}) scale(${1 / Z})">` + layer("M0 0 C-14 -26 -40 -44 -40 -74 A40 40 0 1 1 40 -74 C40 -44 14 -26 0 0Z", C.alert, 7) + layer(blob(0, -76, 15, 15, { n: 8, seed: 6401 }), C.cream, 8) + `</g></g>`;
      const grid = `<g id="grid"><g stroke="${C.dark}" stroke-opacity=".28" stroke-width="1.6">` +
        Array.from({ length: 12 }, (_, i) => `<line x1="${TX - 220 + i * 40}" y1="${TY - 260}" x2="${TX - 220 + i * 40}" y2="${TY + 260}"/>`).join("") +
        Array.from({ length: 14 }, (_, i) => `<line x1="${TX - 220}" y1="${TY - 260 + i * 40}" x2="${TX + 220}" y2="${TY - 260 + i * 40}"/>`).join("") + `</g>` +
        `<g fill="none" stroke="${C.kraftDark}" stroke-width="1.8" stroke-dasharray="5 4">` + P.map(([x, y], i) => `<ellipse cx="${x}" cy="${y}" rx="${30 + (i % 3) * 6}" ry="${22 + (i % 2) * 6}"/><ellipse cx="${x}" cy="${y}" rx="${46 + (i % 3) * 6}" ry="${34 + (i % 2) * 6}"/>`).join("") + `</g></g>`;
      return {
        svg: BG(C.kraft) + woman(C, { cx: WX, cy: WY, scale: 1, spotsOn: false, mirrorOn: false }) + spotsAt(WX, WY, 1, "sp") + grid +
          bubble(540, 420, 520, 150, "bub", "Ça se voit pas !", 46, 1) +
          P.map(([x, y], i) => pin(`pn${i}`, x, y)).join(""),
        overlay:
          `<g id="leg">${layer(poly([[60, 110], [560, 110], [560, 290], [60, 290]], { round: false }), C.cream, 6)}${txt(310, 185, "TA JOUE", 50, C.dark)}${txt(310, 250, `${P.length} TACHES REPÉRÉES`, 34, C.alert)}</g>` +
          `<g id="cmp"><g filter="url(#paper4)"><circle cx="940" cy="200" r="78" fill="${C.cream}" stroke="${C.dark}" stroke-width="6"/></g>${layer("M940 135 L962 200 L940 190 L918 200Z", C.alert, 7)}${layer("M940 265 L962 200 L940 210 L918 200Z", C.dark, 7)}${txt(940, 112, "N", 30, C.dark)}</g>`,
        anims: [
          ...spotPops(0.2, "sp", 0.02),
          POP("bub", Math.max(0.2, tNo - 0.35), [540, 420]),
          A("grid", tToi + 0.2, 0.5, { o: 0 }, { o: 1 }, { ease: "lin", sfx: false }),
          POP("cmp", tToi + 0.35, [940, 200]), POP("leg", tQue + 0.7, [310, 200]),
          ...P.map(([x, y], i) => A(`pn${i}`, tQue + 0.15 + i * 0.1, 0.35, { y: -260 / Z * 2, o: 0 }, { y: 0, o: 1 }, { ease: "outBack", sfx: i % 2 ? false : "pop" })),
        ],
        loops: [],
        cam: [{ t0: tToi - 0.1, t1: tToi + 0.75, from: { s: 1, x: 0, y: 0 }, to: { s: Z, x: -Z * (TX - 540), y: -Z * (TY - 960) }, ease: "inOut" }],
        punches: [{ t: tQue + 0.15, amp: 0.03 }],
      };
    })(),

    // ── W5 · REFLETS : rétroviseur, cuillère, vitrine, écran éteint… partout où elle se voit, elle ne voit que ses taches
    hookW5: (() => {
      const tMec = R("hookW5", "mec"), tNo = R("hookW5", "voient pas"), tToi = R("hookW5", "mais toi"), tQue = R("hookW5", "vois que ça");
      const S = 0.3;
      const face = (cx, cy, idp, s = S) => woman(C, { cx, cy, scale: s, spotsOn: false, mirrorOn: false }) + spotsAt(cx, cy, s, idp);
      const panels = [
        // rétroviseur
        { id: "p0", c: [285, 435], bg: C.solution, body: (cx, cy) => layer(poly([[cx - 50, cy - 260], [cx + 50, cy - 260], [cx + 30, cy - 160], [cx - 30, cy - 160]], { round: false }), C.dark, 5) + `<g filter="url(#paper4)"><rect x="${cx - 200}" y="${cy - 170}" width="400" height="230" rx="80" fill="${C.dark}"/></g><clipPath id="m0"><rect x="${cx - 182}" y="${cy - 152}" width="364" height="194" rx="66"/></clipPath><g clip-path="url(#m0)"><rect x="${cx - 200}" y="${cy - 170}" width="400" height="230" fill="#B7D0E0"/>${face(cx, cy - 20, "a", 0.36)}</g>`, f: [285, 415, 0.36], idp: "a" },
        // cuillère (reflet à l'envers)
        { id: "p1", c: [795, 435], bg: C.accent, body: (cx, cy) => layer(poly([[cx - 16, cy + 60], [cx + 16, cy + 60], [cx + 22, cy + 270], [cx - 22, cy + 270]]), "#D8C2A0", 5) + `<g filter="url(#paper4)"><ellipse cx="${cx}" cy="${cy - 40}" rx="140" ry="175" fill="#D8C2A0"/></g><clipPath id="m1"><ellipse cx="${cx}" cy="${cy - 40}" rx="124" ry="158"/></clipPath><g clip-path="url(#m1)"><rect x="${cx - 150}" y="${cy - 220}" width="300" height="360" fill="#E8D0A8"/><g transform="rotate(180 ${cx} ${cy - 40})">${face(cx, cy - 40, "b", 0.32)}</g></g>`, f: null, idp: "b" },
        // vitrine
        { id: "p2", c: [285, 1010], bg: C.kraftDark, body: (cx, cy) => `<g filter="url(#paper4)"><rect x="${cx - 215}" y="${cy - 250}" width="430" height="80" fill="${C.alert}"/></g>` + [0, 1, 2, 3, 4].map((i) => `<rect x="${cx - 215 + i * 86 + 43}" y="${cy - 250}" width="43" height="80" fill="${C.cream}"/>`).join("") + `<clipPath id="m2"><rect x="${cx - 200}" y="${cy - 165}" width="400" height="390"/></clipPath><g clip-path="url(#m2)"><rect x="${cx - 200}" y="${cy - 165}" width="400" height="390" fill="#8FB0C8"/><g opacity=".85">${face(cx, cy + 10, "c", 0.38)}</g></g><g filter="url(#paper3)"><rect x="${cx - 200}" y="${cy - 165}" width="400" height="390" fill="none" stroke="${C.dark}" stroke-width="12"/></g>`, idp: "c" },
        // écran de téléphone éteint
        { id: "p3", c: [795, 1010], bg: C.skinLight, body: (cx, cy) => `<g filter="url(#paper4)"><rect x="${cx - 140}" y="${cy - 260}" width="280" height="520" rx="40" fill="${C.dark}"/></g><clipPath id="m3"><rect x="${cx - 122}" y="${cy - 236}" width="244" height="472" rx="28"/></clipPath><g clip-path="url(#m3)"><rect x="${cx - 140}" y="${cy - 260}" width="280" height="520" fill="#3A2214"/><g opacity=".7">${face(cx, cy - 10, "d", 0.34)}</g></g>`, idp: "d" },
      ];
      const pv = panels.map((p) => `<g id="${p.id}">` + layer(poly([[p.c[0] - 245, p.c[1] - 285], [p.c[0] + 245, p.c[1] - 285], [p.c[0] + 245, p.c[1] + 285], [p.c[0] - 245, p.c[1] + 285]], { round: false }), p.bg, 3) + p.body(p.c[0], p.c[1]) + `</g>`).join("");
      return {
        svg: BG(C.cream) + layer("M-300 1250 L1400 1250 L1400 2600 L-300 2600Z", C.kraft, 2) +
          person(440, 1290, 0.85, "her", { skin: FACE.skin, top: C.alert, puff: true }) + person(660, 1290, 0.9, "man", { skin: C.skinDeep, top: C.solution, puff: false }) +
          bubble(720, 720, 420, 130, "bub", "Ça se voit pas !", 38, -1) + pv +
          [[285, 420, 92], [795, 400, 84], [285, 1030, 96], [795, 1000, 90]].map(([x, y, r], k) => ring(`fr${k}`, x, y, r, 9)).join(""),
        anims: [
          A("man", Math.max(0, tMec - 0.25), 0.5, { x: 600 }, { x: 0 }, { ease: "outBack", sfx: "whoosh" }),
          POP("bub", tNo, [720, 720]),
          ...panels.map((p, k) => A(p.id, tToi - 0.1 + k * 0.17, 0.4, { s: 0, r: k % 2 ? 8 : -8 }, { s: 1, r: 0 }, { origin: p.c, ease: "outBack", sfx: k === 0 ? "whoosh" : "pop" })),
          ...panels.flatMap((p, k) => spotPops(tQue + 0.15 + k * 0.08, p.idp, 0.03)),
          ...[[285, 420], [795, 400], [285, 1030], [795, 1000]].map((c, k) => POP(`fr${k}`, tQue + 0.5 + k * 0.1, c, { sfx: k ? false : "pop" })),
        ],
        loops: [], cam: SLOW(1.0, 1.04, 0, 0), punches: [{ t: tQue + 0.2, amp: 0.04 }],
      };
    })(),
  };
}
