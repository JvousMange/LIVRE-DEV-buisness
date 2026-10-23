/* Planning des plans (calés sur les mots), transitions papier, sous-titres, rendu déterministe */
const FPS_LOGIC = 12, LEAD = 0.06, END_DUR = 2.4;
const layer = document.getElementById("scenes"), settle = document.getElementById("settle"), stage = document.getElementById("stage");
const wordsOf = {}; TL.beats.forEach(b => wordsOf[b.id] = b.sentences.map(s => s.words));
const anchor = a => wordsOf[a[0]][a[1]][a[2]].start;
const HOOK = new URLSearchParams(location.search).get('hook') || 'A';
const ALLSHOTS = HOOKSHOTS[HOOK].concat(SHOTS.filter(s => !['pop', 'stay', 'mirror'].includes(s.id)));
const plan = ALLSHOTS.map(s => ({ def: s, id: s.id, start: s.at ? anchor(s.at) - LEAD : null, swipe: !!(s.at && s.at[1] === 0 && s.at[2] === 0) }));
plan[0].start = 0;
const speechEnd = TL.duration + 0.3;
plan.forEach((sc, i) => { const nx = plan[i + 1]; sc.end = nx ? (nx.start === null ? speechEnd : nx.start) : speechEnd + END_DUR; });
plan[plan.length - 1].start = speechEnd; plan[plan.length - 2].end = speechEnd;
window.TOTAL = plan[plan.length - 1].end;
const reg = {};
plan.forEach((sc, i) => { H.cur = []; reg[sc.id] = H.cur; const root = H.grp(layer, 0, 0, { j: 0 }); sc.root = root; sc.L = H.layers(root); sc.def.init(sc.L); H.cur = null; root.style.display = "none"; });
/* feuille de papier qui balaie l'écran entre deux séquences */
const trans = H.el("g", {}, stage); stage.insertBefore(trans, document.getElementById("caps"));
const sheet = H.el("g", {}, trans); { const r = H.rrect(sheet, -1100, -1700, 2200, 3400, "#EBD7B0", { r: 0, sh: "sh2", th: 16, jit: 0 }); }
/* sous-titres */
const caps = document.getElementById("caps"), capG = H.el("g", {}, caps);
const capT = H.txt(capG, "", 540, 1300, 108, "#FFFFFF", { stroke: "#5a3418", sw: 20 }); capT.setAttribute("filter", "url(#sh1)");
const words = []; TL.beats.forEach(b => b.sentences.forEach(s => s.words.forEach((w, i) => words.push({ w: w.w.replace(/,$/, ""), start: w.start, end: i === s.words.length - 1 ? s.end + .22 : s.words[i + 1].start }))));
function renderAt(t) {
  const step = Math.floor(t * FPS_LOGIC + 1e-4); H.STEP = step; const ts = step / FPS_LOGIC;
  let k = plan.findIndex(sc => ts >= sc.start && ts < sc.end); if (k < 0) k = plan.length - 1;
  plan.forEach((sc, i) => sc.root.style.display = i === k ? "" : "none");
  const sc = plan[k], local = ts - sc.start, d = sc.end - sc.start, p = local / d;
  sc.def.update(local, p, d, sc.L);
  H.applyAll(reg[sc.id]);
  // punch d'entrée : léger zoom + rotation alternée, plus fort sur les coupes à l'intérieur d'une phrase
  const e = 1 - H.E.out(H.clamp(local / .32)), amp = sc.swipe ? .05 : .085, rot = (k % 2 ? 1 : -1) * 1.1 * e;
  const s = 1 + amp * e; settle.setAttribute("transform", `translate(${(540 * (1 - s)).toFixed(2)},${(960 * (1 - s)).toFixed(2)}) rotate(${rot.toFixed(3)} 540 960) scale(${s.toFixed(4)})`);
  // balayage papier
  let tq = -1; const nx = plan[k + 1];
  if (sc.swipe && local < .16) tq = (local + .12) / .28; else if (nx && nx.swipe && sc.end - ts <= .12) tq = (.12 - (sc.end - ts)) / .28;
  if (tq >= 0 && tq <= 1) { const x = H.lerp(-1900, 1900, H.E.io(tq)); trans.style.display = ""; sheet.setAttribute("transform", `translate(${x.toFixed(1)},960) rotate(-14)`); } else trans.style.display = "none";
  // sous-titre
  const wi = words.findIndex(w => ts >= w.start - .02 && ts < w.end);
  if (wi < 0 || sc.id === "end") capG.style.display = "none"; else {
    capG.style.display = ""; const w = words[wi]; capT.firstChild.textContent = w.w;
    const bb = capT.getBBox(), fit = Math.min(1, 940 / bb.width), pop = .82 + .18 * H.E.out(H.clamp((ts - w.start) / .1)), s2 = fit * pop;
    capG.setAttribute("transform", `translate(${540 * (1 - s2)},${1300 * (1 - s2)}) scale(${s2})`);
  }
  return ts;
}
window.renderAt = renderAt;
window.sfxList = () => { const out = []; plan.forEach((sc, i) => { (sc.def.sfx || []).forEach(([f, ty, o]) => out.push({ t: +(sc.start + f * (sc.end - sc.start)).toFixed(3), type: ty, opt: o === undefined ? null : o })); if (sc.swipe && i > 0) out.push({ t: +(sc.start).toFixed(3), type: "whoosh", opt: "soft" }); }); return out; };
window.PLAN = plan.map(({ id, start, end }) => ({ id, start, end }));
window.READY = document.fonts.ready.then(() => true);
