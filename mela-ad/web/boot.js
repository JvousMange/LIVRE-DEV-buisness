/* Planning des scènes, sous-titres mot par mot, rendu déterministe renderAt(t) */
const ORDER = ["hook", "intro", "s1", "s2", "s3", "s4", "s5", "bascule", "meca", "a1", "a2", "a3", "conso", "preuve", "garantie", "offre"];
const FPS_LOGIC = 12, LEAD = 0.1, END_DUR = 2.4;
const layer = document.getElementById("scenes"), settle = document.getElementById("settle");
const plan = [], reg = {};
ORDER.forEach((id, k) => {
  const b = TL.beats[k], nx = TL.beats[k + 1];
  const start = k === 0 ? 0 : b.start - LEAD, end = nx ? nx.start - LEAD : TL.duration + 0.3;
  plan.push({ id, start, end });
});
plan.push({ id: "endcard", start: plan[plan.length - 1].end, end: plan[plan.length - 1].end + END_DUR });
window.TOTAL = plan[plan.length - 1].end;
plan.forEach(sc => {
  H.cur = []; reg[sc.id] = H.cur;
  const root = H.grp(layer, 0, 0, { j: 0 }); sc.root = root; sc.def = SCN[sc.id];
  sc.def.init(root); H.cur = null; root.style.display = "none";
});
/* sous-titres */
const caps = document.getElementById("caps");
const capG = H.el("g", {}, caps);
const capT = H.txt(capG, "", 540, 1300, 108, C.cream, { stroke: C.dark, sw: 26 });
capT.setAttribute("filter", "url(#sh1)");
const words = []; TL.beats.forEach(b => b.sentences.forEach(s => s.words.forEach((w, i) => words.push({ w: w.w.replace(/,$/, ""), start: w.start, end: i === s.words.length - 1 ? s.end + .22 : s.words[i + 1].start }))));
let shown = -1;
function renderAt(t) {
  const step = Math.floor(t * FPS_LOGIC + 1e-4); H.STEP = step; const ts = step / FPS_LOGIC;
  let k = plan.findIndex(sc => ts >= sc.start && ts < sc.end); if (k < 0) k = plan.length - 1;
  plan.forEach((sc, i) => sc.root.style.display = i === k ? "" : "none");
  const sc = plan[k], local = ts - sc.start, d = sc.end - sc.start, p = local / d;
  sc.def.update(local, p, d, sc.root);
  H.applyAll(reg[sc.id]);
  const s = 1 + .045 * (1 - H.E.out(H.clamp(local / .35)));
  settle.setAttribute("transform", `translate(${(540 * (1 - s)).toFixed(2)},${(960 * (1 - s)).toFixed(2)}) scale(${s.toFixed(4)})`);
  // sous-titre
  const wi = words.findIndex(w => ts >= w.start - .02 && ts < w.end);
  if (wi < 0 || sc.id === "endcard") { capG.style.display = "none"; } else {
    capG.style.display = ""; const w = words[wi];
    capT.firstChild.textContent = w.w;
    const bb = capT.getBBox(); const fit = Math.min(1, 940 / bb.width); const pop = .82 + .18 * H.E.out(H.clamp((ts - w.start) / .1));
    const sc2 = fit * pop; capG.setAttribute("transform", `translate(${540 * (1 - sc2)},${1300 * (1 - sc2)}) scale(${sc2})`);
  }
  return ts;
}
window.renderAt = renderAt;
window.sfxList = () => { const out = []; plan.forEach(sc => (sc.def.sfx || []).forEach(([f, ty]) => out.push({ t: +(sc.start + f * (sc.end - sc.start)).toFixed(3), type: ty }))); return out; };
window.PLAN = plan.map(({ id, start, end }) => ({ id, start, end }));
window.READY = document.fonts.ready.then(() => true);
