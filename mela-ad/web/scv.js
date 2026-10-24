/* Moteur scènes v6 : une scène par idée, temps calés sur les mots, caméra par scène, sous-titres discrets */
const FPS_LOGIC = 12, END_DUR = 2.2;
const WORDS = []; TL.beats[0].sentences.forEach((s, si) => s.words.forEach((w, i) => WORDS.push({ si, wi: i, w: w.w, start: w.start, end: i === s.words.length - 1 ? s.end + .22 : s.words[i + 1].start })));
const wordT = (s, w) => TL.beats[0].sentences[s].words[w].start;
const plan = SC.map(s => ({ id: s.id, draw: s.draw, start: wordT(s.at[0], s.at[1]) - .05 }));
plan[0].start = 0;
const speechEnd = TL.duration + .3;
plan.forEach((sc, i) => { sc.end = i + 1 < plan.length ? plan[i + 1].start : (window.PILOT_END || speechEnd + END_DUR); });
window.TOTAL = plan[plan.length - 1].end;
const scenes = document.getElementById("scenes"), caps = document.getElementById("caps"), capG = H.el("g", {}, caps);
const CAPY = 1600; const capT = H.txt(capG, "", 540, CAPY, 80, "#FFFFFF", { stroke: "#24160E", sw: 9 }); capT.setAttribute("filter", "url(#sh1)");
const view = H.el("g", {}, scenes), over = H.el("g", {}, scenes);
function renderAt(t) {
  const step = Math.floor(t * FPS_LOGIC + 1e-4); H.STEP = step; const ts = step / FPS_LOGIC;
  let i = plan.findIndex(sc => ts >= sc.start && ts < sc.end); if (i < 0) i = plan.length - 1;
  const sc = plan[i], local = ts - sc.start, W = (s, w) => wordT(s, w) - sc.start;
  view.innerHTML = ""; over.innerHTML = ""; document.querySelectorAll("clipPath[id^=sbc]").forEach(n => n.remove());
  S.T = local; S.RUBNOW = 0; H.cur = []; const reg = H.cur, g = H.grp(view, 0, 0, { j: 0 }); const O = H.grp(over, 0, 0, { j: 0 }); const c = sc.draw(g, local, W, O) || {}; H.applyAll(reg); H.cur = null;
  const z = c.z || 1, fx = c.fx ?? 540, fy = c.fy ?? 960; view.setAttribute("transform", `translate(${(540 - fx * z).toFixed(2)},${(960 - fy * z).toFixed(2)}) scale(${z.toFixed(4)})`);
  const wi = WORDS.findIndex(w => ts >= w.start - .02 && ts < w.end);
  if (wi < 0) capG.style.display = "none"; else { capG.style.display = ""; const w = WORDS[wi]; capT.firstChild.textContent = w.w.replace(/,$/, ""); const bb = capT.getBBox(), fit = Math.min(1, 900 / bb.width), pop = .88 + .12 * H.E.out(H.clamp((ts - w.start) / .1)), s2 = fit * pop; capG.setAttribute("transform", `translate(${540 * (1 - s2)},${CAPY * (1 - s2)}) scale(${s2})`); }
  return ts;
}
window.renderAt = renderAt;
window.sfxList = () => [];
window.PLAN = plan.map(({ id, start, end }) => ({ id, start, end }));
window._res(true);
