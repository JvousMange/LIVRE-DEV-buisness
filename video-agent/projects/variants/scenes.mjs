// Variantes proposées (2e série) : raison 3 (v3d/e/f) et « elle réagit souvent plus fort » (cmpA/B/C).
import { layer, band, blob, poly } from "../../engine/paper.mjs";
import { skin, badge, cross, tag, woman, flush } from "../../library/components.mjs";
import { tube, check, flame, gauge, factory as factoryRaw, siren, pimple } from "../../library/components2.mjs";
import { decorB } from "../../library/decors.mjs";
import { A, POP, FADEIN, FADEOUT, DROP, SLOW } from "../full/kit.mjs";

export function scenes(C, X) {
  const R = (n, p, o) => X.rel(n, p, o);
  const FCOL = { body: "#CF9068", roof: "#B5724B", chimney: "#E8D0A8", cap: "#7A4E32", base: "#7A4E32", gear: "#E3B08C" };
  const factory = (C2, cx, cy, s, id) => factoryRaw(C2, cx, cy, s, id, FCOL);
  const puff = (id, t, k) => A(`${id}-sm${k % 8}`, t, 1.5, { y: 0, s: 0.5, o: 0.95 }, { y: -230, s: 1.5, o: 0 }, { ease: "outCubic", origin: [200, -338], late: k >= 8, sfx: false });
  const flushBlobs = (pts, seed) => pts.map((p, i) => `<g id="fl${i}">${layer(blob(p[0], p[1], p[2], p[3], { jitter: 0.12, n: 10, seed: seed + i }), "rgba(196,85,47,.72)", 6, { edge: "rgba(0,0,0,0)" })}</g>`).join("");

  return {
    // ───── Raison 3 ─────
    // D. Une seule peau coupée en deux : claire à gauche, mate/noire à droite, le même soin tombe des deux côtés (tout est dans le haut de l'image).
    v3d: {
      svg: `<g transform="translate(0 -314) scale(.95)"><g clip-path="url(#cl)">${skin(C, { tone: "light" })}</g><g clip-path="url(#cr)">${skin(C, { tone: "deep" })}</g></g>` +
        `<clipPath id="cl"><rect x="-100" y="0" width="${540 / 0.95}" height="3000"/></clipPath><clipPath id="cr"><rect x="${540 / 0.95}" y="0" width="1400" height="3000"/></clipPath>` +
        layer(poly([[532, 560], [548, 560], [548, 1560], [532, 1560]]), C.dark, 5) +
        tag(C, 270, 400, 440, 90, "PEAU CLAIRE", { id: "tgA", fontSize: 40, color: C.solution, seed: 3 }) + tag(C, 810, 400, 480, 90, "MATE OU NOIRE", { id: "tgB", fontSize: 40, color: C.alert, seed: 4 }) +
        tube(C, 540, 230, { s: 0.9, label: "SOIN", id: "tb" }) +
        `<g id="dA">${layer(blob(270, 520, 28, 36, { jitter: 0.06, n: 8, seed: 70 }), C.cream, 6)}</g><g id="dB">${layer(blob(810, 520, 28, 36, { jitter: 0.06, n: 8, seed: 71 }), C.cream, 6)}</g>` +
        flushBlobs([[650, 650, 110, 46], [810, 625, 120, 50], [960, 650, 110, 46]], 920) + flame(C, 810, 540, 0.75, "fire") + check(C, 270, 720, 190, "chk") + cross(C, 810, 740, 210, "xB") + badge(C, 130, 120, 3),
      anims: [
        POP("badge", 0.05, [130, 120]), DROP("tb", 0.1, [540, 230]), POP("tgA", 0.2, [270, 400]), POP("tgB", R("v3d", "mate", -0.2), [810, 400]),
        A("dA", R("v3d", "soins"), 0.5, { y: -40, o: 0 }, { y: 70, o: 1 }, { ease: "inCubic" }), FADEOUT("dA", R("v3d", "soins", 0.5), 0.15), POP("chk", R("v3d", "claires"), [270, 720]),
        A("dB", R("v3d", "mate", 0.1), 0.5, { y: -40, o: 0 }, { y: 70, o: 1 }, { ease: "inCubic" }), FADEOUT("dB", R("v3d", "mate", 0.6), 0.15),
        ...[0, 1, 2].map((i) => FADEIN(`fl${i}`, R("v3d", "agressent") + i * 0.1, 0.3)), POP("fire", R("v3d", "agressent"), [810, 540]), POP("xB", R("v3d", "rien"), [810, 740]),
      ],
      loops: [], cam: SLOW(1.0, 1.03, 0, 0),
    },

    // E. Nuancier : huit teintes de peau ; le soin n'est « pensé » que pour les premières, les autres rougissent ou ne réagissent pas.
    v3e: (() => {
      const cols = ["#F3D5BC", "#E8BFA0", "#D9A783", "#C28E69", "#9C6544", "#7C4C33", "#5E3A27", "#3D2B22"];
      const xs = cols.map((_, i) => 100 + i * 125);
      const sw = cols.map((c, i) => `<g id="sw${i}">` + layer(blob(xs[i], 980, 54, 54, { jitter: 0.03, n: 14, seed: 3400 + i }), c, 4) + `</g>`).join("");
      return {
        svg: tag(C, 540, 250, 560, 100, "SOIN « UNIVERSEL »", { id: "tgU", fontSize: 44, color: C.alert, seed: 5 }) + tube(C, 540, 520, { s: 0.7, label: "SOIN", id: "tb" }) + sw +
          `<g id="brk">${layer(poly([[60, 860], [440, 860], [440, 880], [80, 880], [80, 920], [60, 920]]), C.solution, 5)}</g>` +
          [0, 1, 2].map((i) => check(C, xs[i], 1100, 100, `ck${i}`)).join("") + [3, 4, 5, 6, 7].map((i) => cross(C, xs[i], 1100, 90, `xx${i}`)).join("") +
          flushBlobs([[xs[4], 980, 60, 60], [xs[5], 980, 60, 60], [xs[6], 980, 60, 60]], 940) + badge(C, 130, 130, 3),
        anims: [
          POP("badge", 0.05, [130, 130]), POP("tgU", 0.15, [540, 250]), DROP("tb", 0.2, [540, 520]),
          ...cols.map((_, i) => POP(`sw${i}`, 0.3 + i * 0.07, [xs[i], 980])), POP("brk", R("v3e", "claires", -0.3), [60, 890]),
          ...[0, 1, 2].map((i) => POP(`ck${i}`, R("v3e", "claires") + i * 0.1, [xs[i], 1100])),
          ...[0, 1, 2].map((i) => FADEIN(`fl${i}`, R("v3e", "agressent") + i * 0.12, 0.3)),
          ...[3, 4, 5, 6, 7].map((i) => POP(`xx${i}`, R("v3e", "rien", -0.2) + (i - 3) * 0.08, [xs[i], 1100])),
        ],
        loops: [], cam: SLOW(1.0, 1.04, 0, 0),
      };
    })(),

    // F. Panel de testeuses : quatre femmes à peau claire valident le soin ; la femme à peau mate ou noire, elle, réagit.
    v3f: {
      svg: tag(C, 540, 170, 520, 90, "PANEL DE TEST", { id: "tgP", fontSize: 42, color: C.solution, seed: 6 }) +
        [150, 390, 630, 870].map((x, i) => `<g id="tf${i}">${woman(C, { tone: "light", hair: "bob", spotsOn: false, mirrorOn: false, cx: x, cy: 520, scale: 0.34 })}</g>`).join("") +
        [150, 390, 630, 870].map((x, i) => check(C, x, 760, 90, `ck${i}`)).join("") +
        `<g id="tfd">${woman(C, { cx: 540, cy: 1250, scale: 0.62, extras: flush() })}</g>` + tube(C, 860, 1210, { s: 0.5, label: "SOIN", id: "tb" }) + cross(C, 860, 1210, 120, "xB") + badge(C, 130, 120, 3),
      anims: [
        POP("badge", 0.05, [130, 120]), POP("tgP", 0.15, [540, 170]),
        ...[0, 1, 2, 3].flatMap((i) => [POP(`tf${i}`, 0.25 + i * 0.12, [150 + i * 240, 520]), POP(`ck${i}`, R("v3f", "claires") + i * 0.1, [150 + i * 240, 760])]),
        DROP("tfd", R("v3f", "sur", -0.1), [540, 1250]), DROP("tb", R("v3f", "mate"), [860, 1210]),
        ...[0, 1, 2].map((i) => FADEIN(`fl${i}`, R("v3f", "agressent") + i * 0.1, 0.3)), ...[0, 1, 2].map((i) => FADEOUT(`fl${i}`, R("v3f", "rien") - 0.1, 0.4)), POP("xB", R("v3f", "rien"), [860, 1210]),
      ],
      loops: [], cam: SLOW(1.0, 1.03, 0, 0),
    },

    // ───── « Et sur une peau mate ou noire, elle réagit souvent plus fort. » ─────
    // A. Deux éprouvettes : le pigment monte à peine à gauche, déborde à droite.
    cmpA: (() => {
      const tubeSvg = (x, id, label, col) => `<g id="${id}">` + layer(poly([[x - 85, 700], [x + 85, 700], [x + 85, 1260], [x - 85, 1260]]), "rgba(241,230,210,.35)", 3) + layer(poly([[x - 85, 700], [x + 85, 700], [x + 85, 730], [x - 85, 730]]), C.kraftDark, 4) +
        [0, 1, 2, 3, 4].map((k) => `<line x1="${x + 30}" y1="${760 + k * 100}" x2="${x + 85}" y2="${760 + k * 100}" stroke="${C.dark}" stroke-width="4" opacity=".6"/>`).join("") + `</g>`;
      const fill = (x, id, h, col) => `<g id="${id}">` + layer(poly([[x - 78, 1254 - h], [x + 78, 1254 - h], [x + 78, 1254], [x - 78, 1254]]), col, 5) + `</g>`;
      return {
        svg: tag(C, 270, 560, 400, 90, "PEAU CLAIRE", { id: "tgA", fontSize: 38, color: C.solution, seed: 3 }) + tag(C, 810, 560, 480, 90, "MATE OU NOIRE", { id: "tgB", fontSize: 38, color: C.alert, seed: 4 }) +
          fill(270, "fA", 130, "#B5724B") + fill(810, "fB", 520, C.problem) + tubeSvg(270, "tA") + tubeSvg(810, "tB") + flame(C, 810, 640, 0.7, "fire") + badge(C, 130, 130, 3),
        anims: [
          POP("tgA", 0.1, [270, 560]), POP("tA", 0.15, [270, 980]), POP("tgB", R("cmpA", "mate", -0.2), [810, 560]), POP("tB", R("cmpA", "mate"), [810, 980]),
          A("fA", 0.4, 1.2, { sy: 0.02 }, { sy: 1 }, { ease: "outCubic", origin: [270, 1254] }),
          A("fB", R("cmpA", "plus fort", -0.8), 1.4, { sy: 0.02 }, { sy: 1 }, { ease: "inOut", origin: [810, 1254] }), POP("fire", R("cmpA", "plus fort"), [810, 640]),
        ],
        loops: [{ id: "tB", prop: "x", amp: 4, freq: 6, start: R("cmpA", "plus fort"), origin: [810, 980] }], cam: SLOW(1.0, 1.04, 0, 0),
      };
    })(),

    // B. Deux jauges de production : aiguille basse à gauche, dans le rouge (et qui tremble) à droite.
    cmpB: {
      svg: gauge(C, 290, 960, 0.78, "gA") + gauge(C, 790, 960, 0.78, "gB") + tag(C, 290, 640, 400, 90, "PEAU CLAIRE", { id: "tgA", fontSize: 38, color: C.solution, seed: 3 }) + tag(C, 790, 640, 480, 90, "MATE OU NOIRE", { id: "tgB", fontSize: 38, color: C.alert, seed: 4 }) + flame(C, 790, 1340, 0.6, "fire") + badge(C, 130, 130, 3),
      anims: [
        POP("gA", 0.1, [290, 960]), POP("tgA", 0.2, [290, 640]), A("gA-needle", 0.4, 0.9, { r: -90 }, { r: -35 }, { ease: "outBack", origin: [0, 0] }),
        POP("gB", R("cmpB", "mate", -0.1), [790, 960]), POP("tgB", R("cmpB", "mate", 0.1), [790, 640]), A("gB-needle", R("cmpB", "plus fort", -0.6), 0.9, { r: -90 }, { r: 95 }, { ease: "outBack", origin: [0, 0] }),
        POP("fire", R("cmpB", "plus fort"), [790, 1340]),
      ],
      loops: [{ id: "gB-needle", prop: "r", amp: 6, freq: 5, start: R("cmpB", "plus fort"), origin: [0, 0] }], cam: SLOW(1.0, 1.04, 0, 0),
    },

    // C. Même usine, deux régimes : calme en haut, emballée en bas (même taille, dans le décor « plan technique »).
    cmpC: {
      svg: decorB(C) + factory(C, 470, 1230, 0.62, "fa") + factory(C, 470, 1640, 0.62, "fb") + siren(C, 430, 1640 - 215 * 0.62 - 16, 0.45, "siren") +
        tag(C, 250, 800, 420, 90, "PEAU CLAIRE", { id: "tgA", fontSize: 38, color: C.solution, seed: 3 }) + tag(C, 760, 1060, 500, 90, "MATE OU NOIRE", { id: "tgB", fontSize: 38, color: C.alert, seed: 4 }) + badge(C, 130, 130, 3),
      anims: [
        POP("fa", 0.1, [470, 1230]), POP("tgA", 0.2, [250, 800]), A("fa-gear", 0, 4, { r: 0 }, { r: 160 }, { ease: "lin", origin: [190, 62], sfx: false }),
        ...[0, 1, 2].map((k) => puff("fa", 0.5 + k * 1.1, k)),
        POP("fb", R("cmpC", "mate"), [470, 1640]), POP("tgB", R("cmpC", "mate", 0.1), [760, 1060]), A("fb-gear", 0, 4, { r: 0 }, { r: 1400 }, { ease: "lin", origin: [190, 62], sfx: false }),
        A("fb-red", R("cmpC", "plus fort"), 0.3, { o: 0 }, { o: 1 }, { ease: "lin", sfx: false }), POP("siren", R("cmpC", "plus fort"), [430, 1640 - 215 * 0.62 - 16], { sfx: "beep" }),
        ...Array.from({ length: 8 }, (_, k) => puff("fb", R("cmpC", "mate", 0.3) + k * 0.25, k)),
      ],
      loops: [{ id: "siren", prop: "s", amp: 0.14, freq: 4, start: R("cmpC", "plus fort"), origin: [430, 1640 - 215 * 0.62 - 16] }], cam: SLOW(1.0, 1.0, 0, 0),
    },
  };
}
