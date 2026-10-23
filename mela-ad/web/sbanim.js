/* Animation du storyboard : chaque plan passe de son image de départ (k=0) à son image d'arrivée (k=1), calé sur la voix */
const FPS_LOGIC = 12, END_DUR = 2.2;
/* 1. convertit draw(g, e) en draw(g, k) : valeurs numériques interpolées, éléments discrets basculés à mi-course */
const toAnim = f => { let src = f.toString().replace(/^\(g, e\) =>/, "(g, KK) =>");
  src = src.replace(/\be \? (-?\d*\.?\d+) : (-?\d*\.?\d+)/g, "H.lerp($2, $1, KK)");
  src = src.replace(/\be\b/g, "(KK > .5)");
  return new Function("return " + src)(); };
SB.forEach(s => { s.fa = toAnim(s.f); });
/* 2. calage sur la voix : premier mot de chaque plan retrouvé dans l'alignement */
const norm = w => w.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9']/g, "");
const WORDS = []; TL.beats[0].sentences.forEach(s => s.words.forEach((w, i) => WORDS.push({ w: w.w, n: norm(w.w), start: w.start, end: i === s.words.length - 1 ? s.end + .22 : s.words[i + 1].start })));
let ptr = 0;
const plan = SB.map(s => { const vw = s.vo.replace(/…/g, " ").split(/\s+/).map(norm).filter(Boolean); let at = ptr; for (let i = ptr; i < WORDS.length; i++) { if (WORDS[i].n === vw[0] && (!vw[1] || (WORDS[i + 1] && WORDS[i + 1].n === vw[1]))) { at = i; break; } } ptr = at + 1; return { id: s.id, fa: s.fa, start: WORDS[at].start - .05 }; });
plan[0].start = 0;
const speechEnd = TL.duration + .3;
plan.forEach((sc, i) => { sc.end = i + 1 < plan.length ? plan[i + 1].start : speechEnd + END_DUR; });
window.TOTAL = plan[plan.length - 1].end;
/* 3. sous-titres mot à mot */
const stage = document.getElementById("stage"), scenes = document.getElementById("scenes"), caps = document.getElementById("caps"), capG = H.el("g", {}, caps);
const capT = H.txt(capG, "", 540, 1475, 108, "#FFFFFF", { stroke: "#5a3418", sw: 20 }); capT.setAttribute("filter", "url(#sh1)");
const view = H.el("g", {}, scenes);
function renderAt(t) {
  const step = Math.floor(t * FPS_LOGIC + 1e-4); H.STEP = step; const ts = step / FPS_LOGIC;
  let i = plan.findIndex(sc => ts >= sc.start && ts < sc.end); if (i < 0) i = plan.length - 1;
  const sc = plan[i], d = sc.end - sc.start, local = ts - sc.start, p = H.clamp(local / d);
  const act = Math.min(.9, Math.max(.35, 1.4 / d)), k = H.E.io(H.seg(p, .1, .1 + act * .75));
  view.innerHTML = ""; document.querySelectorAll("clipPath[id^=sbc]").forEach(n => n.remove()); H.cur = []; const reg = H.cur, g = H.grp(view, 0, 0, { j: 0 }); sc.fa(g, k); H.applyAll(reg); H.cur = null;
  const bump = 1 - H.E.out(H.clamp(local / .3)), z = 1 + .03 * p + .06 * bump, rot = (i % 2 ? 1 : -1) * .9 * bump;
  view.setAttribute("transform", `translate(${(540 * (1 - z)).toFixed(2)},${(960 * (1 - z)).toFixed(2)}) rotate(${rot.toFixed(3)} 540 960) scale(${z.toFixed(4)})`);
  const wi = WORDS.findIndex(w => ts >= w.start - .02 && ts < w.end);
  if (wi < 0) capG.style.display = "none"; else { capG.style.display = ""; const w = WORDS[wi]; capT.firstChild.textContent = w.w.replace(/,$/, ""); const bb = capT.getBBox(), fit = Math.min(1, 940 / bb.width), pop = .82 + .18 * H.E.out(H.clamp((ts - w.start) / .1)), s2 = fit * pop; capG.setAttribute("transform", `translate(${540 * (1 - s2)},${1475 * (1 - s2)}) scale(${s2})`); }
  return ts;
}
window.renderAt = renderAt;
window.sfxList = () => { const out = []; plan.forEach((sc, i) => { const d = sc.end - sc.start, act = Math.min(.9, Math.max(.35, 1.4 / d)); out.push({ t: +sc.start.toFixed(3), type: i ? "paper" : "stamp", opt: null }); out.push({ t: +(sc.start + d * (.1 + act * .35)).toFixed(3), type: i % 3 ? "pop" : "slide", opt: i % 5 }); }); return out; };
window.PLAN = plan.map(({ id, start, end }) => ({ id, start, end }));
window._res(true);
