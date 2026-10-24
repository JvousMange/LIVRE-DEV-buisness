// Raison 3 : un nuancier de cartes de couleur ; le soin n'est « pensé » que pour les teintes claires.
import { layer, poly, blob } from "../../engine/paper.mjs";
import { badge, cross, tag } from "../../library/components.mjs";
import { check, flame } from "../../library/components2.mjs";
import { A, POP, FADEIN, FADEOUT, DROP, SLOW } from "./kit.mjs";

export function scenesA(C, X) {
  const R = (n, p, o) => X.rel(n, p, o);
  return {
    // « Trois, la plupart des soins sont pensés pour des peaux claires. Sur une peau mate ou noire, ils agressent, ou ils ne font rien. »
    soinPeau: (() => {
      const cols = ["#F3D5BC", "#E8BFA0", "#D9A783", "#C28E69", "#9C6544", "#7C4C33", "#5E3A27", "#3D2B22"];
      const XS = [135, 405, 675, 945], YS = [590, 1110];
      const P = cols.map((_, i) => ({ x: XS[i % 4], y: YS[i < 4 ? 0 : 1] }));
      const card = (c, i) => {
        const { x, y } = P[i];
        return `<g id="cd${i}">` + layer(poly([[x - 120, y - 220], [x + 120, y - 220], [x + 120, y + 220], [x - 120, y + 220]]), "#F1E6D2", 4) +
          layer(poly([[x - 102, y - 202], [x + 102, y - 202], [x + 102, y + 104], [x - 102, y + 104]]), c, 5) +
          `<g filter="url(#paper1)"><text x="${x}" y="${y + 172}" text-anchor="middle" font-family="Inter, 'DejaVu Sans', sans-serif" font-weight="900" font-size="46" fill="${C.dark}" opacity=".7">0${i + 1}</text></g></g>`;
      };
      const t1 = R("soinPeau", "soins"), tCl = R("soinPeau", "claires"), tSur = R("soinPeau", "sur"), tMate = R("soinPeau", "mate"), tAg = R("soinPeau", "agressent"), tRien = R("soinPeau", "rien");
      return {
        svg: cols.map(card).join("") + tag(C, 540, 300, 600, 84, "PEAUX CLAIRES", { id: "tgA", fontSize: 44, color: C.solution, seed: 3 }) + tag(C, 540, 850, 720, 84, "PEAU MATE OU NOIRE", { id: "tgB", fontSize: 44, color: C.alert, seed: 4 }) +
          [0, 1, 2, 3].map((i) => check(C, P[i].x, P[i].y - 40, 170, `ck${i}`)).join("") +
          [4, 5].map((i) => `<g id="fl${i}">${layer(blob(P[i].x, P[i].y - 50, 86, 120, { jitter: 0.12, n: 10, seed: 960 + i }), "rgba(196,85,47,.72)", 6, { edge: "rgba(0,0,0,0)" })}</g>`).join("") +
          [4, 5].map((i) => flame(C, P[i].x, P[i].y - 90, 0.7, `fire${i}`)).join("") +
          [6, 7].map((i) => cross(C, P[i].x, P[i].y - 40, 150, `xx${i}`)).join("") + badge(C, 130, 120, 3),
        anims: [
          POP("badge", 0.05, [130, 120]),
          ...[0, 1, 2, 3].map((i) => DROP(`cd${i}`, t1 + i * 0.09, [P[i].x, P[i].y])), POP("tgA", t1 - 0.05, [540, 300]),
          ...[0, 1, 2, 3].map((i) => POP(`ck${i}`, tCl + i * 0.09, [P[i].x, P[i].y - 40])),
          ...[4, 5, 6, 7].map((i) => A(`cd${i}`, tSur + (i - 4) * 0.1, 0.45, { x: i % 2 ? 1300 : -1300, r: i % 2 ? 18 : -18 }, { x: 0, r: 0 }, { ease: "outBack", origin: [P[i].x, P[i].y], sfx: "whoosh" })),
          POP("tgB", tMate, [540, 850]),
          ...[4, 5].map((i) => FADEIN(`fl${i}`, tAg + (i - 4) * 0.12, 0.3)), ...[4, 5].map((i) => POP(`fire${i}`, tAg + (i - 4) * 0.12, [P[i].x, P[i].y - 90])),
          ...[6, 7].map((i) => POP(`xx${i}`, tRien + (i - 6) * 0.1, [P[i].x, P[i].y - 40])),
        ],
        loops: [],
        cam: SLOW(1.0, 1.03, 0, 0),
        punches: [{ t: tRien, amp: 0.04 }, { t: tAg, amp: 0.03 }],
      };
    })(),
  };
}
