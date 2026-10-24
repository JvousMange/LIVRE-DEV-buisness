/* Animation du storyboard : chaque plan passe de son image de départ (k=0) à son image d'arrivée (k=1), calé sur la voix.
   + vie : entrées en rebond, flottement continu, boucles (S.T), gestes, mouvements de caméra par plan */
const FPS_LOGIC = 12, END_DUR = 2.2;
/* 1. convertit draw(g, e) en draw(g, KK) : valeurs numériques interpolées, éléments discrets basculés à mi-course */
const toAnim = f => { let src = f.toString().replace(/^\(g, e\) =>/, "(g, KK) =>");
  src = src.replace(/\be \? (-?\d*\.?\d+) : (-?\d*\.?\d+)/g, "H.lerp($2, $1, KK)");
  src = src.replace(/\be\b/g, "(KK > .5)");
  return new Function("return " + src)(); };
SB.forEach(s => { s.fa = toAnim(s.f); });
/* 2. calage sur la voix */
const norm = w => w.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9']/g, "");
const WORDS = []; TL.beats[0].sentences.forEach(s => s.words.forEach((w, i) => WORDS.push({ w: w.w, n: norm(w.w), start: w.start, end: i === s.words.length - 1 ? s.end + .22 : s.words[i + 1].start })));
let ptr = 0;
const plan = SB.map(s => { const vw = s.vo.replace(/…/g, " ").split(/\s+/).map(norm).filter(Boolean); let at = ptr; for (let i = ptr; i < WORDS.length; i++) { if (WORDS[i].n === vw[0] && (!vw[1] || (WORDS[i + 1] && WORDS[i + 1].n === vw[1]))) { at = i; break; } } ptr = at + 1; return { id: s.id, fa: s.fa, start: WORDS[at].start - .05 }; });
plan[0].start = 0;
const speechEnd = TL.duration + .3;
plan.forEach((sc, i) => { sc.end = i + 1 < plan.length ? plan[i + 1].start : speechEnd + END_DUR; });
window.TOTAL = plan[plan.length - 1].end;
/* 3. réglages par plan : gestes (amplitude de frottement) et caméra */
const RUB = { "1c": 34, "2a": 16, "3a": 22, "3c": 40, "5a": 16, "6a": 46, "30a": 8 };
const PAN = ["6b", "19a", "24a", "24b", "29a", "10c", "26a", "4a"];
const DIVE = ["2b", "8b", "10a"];
const cam = (id, k, p) => { if (PAN.includes(id)) return { x: H.lerp(70, -70, p), y: 0, z: 1.04 }; if (id === "2b") return { x: 0, y: H.lerp(560, 0, k), z: H.lerp(1.7, 1, k) }; return { x: 0, y: 0, z: 1 + .05 * p }; };
/* 4. sous-titres mot à mot (plus discrets) */
const stage = document.getElementById("stage"), scenes = document.getElementById("scenes"), caps = document.getElementById("caps"), capG = H.el("g", {}, caps);
const CAPY = 1590; const capT = H.txt(capG, "", 540, CAPY, 80, "#FFFFFF", { stroke: "#24160E", sw: 9 }); capT.setAttribute("filter", "url(#sh1)");
const view = H.el("g", {}, scenes);
/* signature d'un élément = géométrie de son premier tracé : sert à repérer les éléments qui apparaissent en cours de plan */
const sig = el => { const pth = el.querySelector("path,circle"); return el.tagName + ":" + (pth ? (pth.getAttribute("d") || pth.getAttribute("r") || "").slice(0, 50) : ""); };
const BASE = {};
const draw = (sc, k) => { view.innerHTML = ""; document.querySelectorAll("clipPath[id^=sbc]").forEach(n => n.remove()); H.cur = []; const reg = H.cur, g = H.grp(view, 0, 0, { j: 0 }); sc.fa(g, k); H.applyAll(reg); H.cur = null; return g; };
function renderAt(t) {
  const step = Math.floor(t * FPS_LOGIC + 1e-4); H.STEP = step; const ts = step / FPS_LOGIC;
  let i = plan.findIndex(sc => ts >= sc.start && ts < sc.end); if (i < 0) i = plan.length - 1;
  const sc = plan[i], d = sc.end - sc.start, local = ts - sc.start, p = H.clamp(local / d);
  const act = Math.min(.9, Math.max(.35, 1.4 / d)), k = H.E.io(H.seg(p, .1, .1 + act * .75)), tSw = d * (.1 + act * .375);
  S.RUBNOW = RUB[sc.id] || 0;
  if (!BASE[sc.id]) { S.T = 0; const g0 = draw(sc, 0); BASE[sc.id] = new Set([...g0.children].map(sig)); }
  S.T = local; const g = draw(sc, k);
  /* entrées + flottement : chaque élément de premier niveau (hors décor plein cadre) */
  let n = 0; [...g.children].forEach(el => { const bb = el.getBBox(); if (bb.width > 1000 || bb.height > 1300) return; n++; const isNew = !BASE[sc.id].has(sig(el)); const t0 = isNew ? tSw : Math.min(.45, .03 + n * .05); const a = H.clamp((local - t0) / .38); const big = bb.width * bb.height > 380000; const cx = bb.x + bb.width / 2, cy = bb.y + bb.height / 2; const w = H.el("g", {}, g); g.insertBefore(w, el); w.appendChild(el); const fl = Math.sin(local * 1.7 + n * 1.3) * 3, rt = Math.sin(local * 1.2 + n * 2.1) * .5;
    if (a < 1) { if (big && !isNew) w.setAttribute("transform", `translate(0,${((1 - H.E.out(a)) * 60 + fl).toFixed(1)})`); else { const s2 = Math.max(.001, H.E.pop(a)); w.setAttribute("transform", `translate(${cx},${cy + fl}) rotate(${rt}) scale(${s2.toFixed(3)}) translate(${-cx},${-cy})`); } if (a <= 0) w.setAttribute("opacity", 0); }
    else w.setAttribute("transform", `translate(${cx},${cy + fl}) rotate(${rt}) translate(${-cx},${-cy})`); });
  /* caméra */
  const c = cam(sc.id, k, p), z = c.z; view.setAttribute("transform", `translate(${(540 * (1 - z) + c.x).toFixed(2)},${(960 * (1 - z) + c.y * z).toFixed(2)}) scale(${z.toFixed(4)})`);
  const wi = WORDS.findIndex(w => ts >= w.start - .02 && ts < w.end);
  if (wi < 0) capG.style.display = "none"; else { capG.style.display = ""; const w = WORDS[wi]; capT.firstChild.textContent = w.w.replace(/,$/, ""); const bb = capT.getBBox(), fit = Math.min(1, 900 / bb.width), pop = .88 + .12 * H.E.out(H.clamp((ts - w.start) / .1)), s2 = fit * pop; capG.setAttribute("transform", `translate(${540 * (1 - s2)},${CAPY * (1 - s2)}) scale(${s2})`); }
  return ts;
}
window.renderAt = renderAt;
window.sfxList = () => { const out = []; plan.forEach((sc, i) => { const d = sc.end - sc.start, act = Math.min(.9, Math.max(.35, 1.4 / d)); out.push({ t: +sc.start.toFixed(3), type: i ? "paper" : "stamp", opt: null }); out.push({ t: +(sc.start + d * (.1 + act * .375)).toFixed(3), type: i % 3 ? "pop" : "slide", opt: i % 5 }); if (RUB[sc.id]) out.push({ t: +(sc.start + .3).toFixed(3), type: "rub", opt: null }); }); return out; };
window.PLAN = plan.map(({ id, start, end }) => ({ id, start, end }));
window._res(true);
