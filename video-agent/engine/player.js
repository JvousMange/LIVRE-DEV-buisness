// Lecteur déterministe : setFrame(t) positionne tous les éléments pour l'instant t (secondes).
(function () {
  const D = window.DATA;
  const ID = { x: 0, y: 0, s: 1, sx: 1, sy: 1, r: 0, o: 1 };
  const ease = {
    lin: (t) => t,
    outCubic: (t) => 1 - Math.pow(1 - t, 3),
    inCubic: (t) => t * t * t,
    inOut: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
    outBack: (t) => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); },
  };
  const lerp = (a, b, p) => a + (b - a) * p;
  const clamp01 = (v) => Math.min(1, Math.max(0, v));
  const rnd = (n) => { const x = Math.sin(n * 12.9898) * 43758.5453; return x - Math.floor(x); };
  const hash = (s) => { let h = 0; for (const c of s) h = (h * 31 + c.charCodeAt(0)) | 0; return h; };
  const $ = (id) => document.getElementById(id);
  const STOP = 12; // cadence « stop-motion » des éléments animés

  function applyCam(el, cam, p) {
    const c = cam || { from: { s: 1, x: 0, y: 0 }, to: { s: 1, x: 0, y: 0 } };
    const e = ease[c.ease || "inOut"](p);
    const g = (k, d) => lerp(c.from[k] ?? d, c.to[k] ?? d, e);
    el.setAttribute("transform", `translate(${g("x", 0)} ${g("y", 0)}) translate(540 960) scale(${g("s", 1)}) translate(-540 -960)`);
  }

  window.setFrame = function (t) {
    let bi = D.beats.findIndex((b) => t >= b.t0 && t < b.t1);
    if (bi < 0) bi = D.beats.length - 1;
    D.beats.forEach((_, i) => { $("scene-" + i).style.display = i === bi ? "inline" : "none"; });
    const b = D.beats[bi];
    const lt = Math.max(0, t - b.t0), fi = Math.floor(lt * STOP + 1e-6), q = fi / STOP;
    const st = {}, org = {};
    const S = (id) => (st[id] ||= { ...ID });
    for (const a of b.anims) {
      org[a.id] = a.origin || org[a.id] || [0, 0];
      const e = ease[a.ease || "outCubic"](clamp01((q - a.t0) / a.dur));
      const s = S(a.id);
      for (const k of new Set([...Object.keys(a.from || {}), ...Object.keys(a.to || {})])) s[k] = lerp(a.from?.[k] ?? ID[k], a.to?.[k] ?? ID[k], e);
    }
    for (const l of b.loops || []) {
      org[l.id] = org[l.id] || l.origin || [0, 0];
      const k = clamp01((q - (l.start || 0)) / 0.3);
      S(l.id)[l.prop] += k * l.amp * Math.sin(2 * Math.PI * l.freq * q);
    }
    for (const id in st) {
      const s = st[id], h = hash(id);
      const jx = (rnd(fi * 3 + h) - 0.5) * 1.4, jy = (rnd(fi * 5 + h) - 0.5) * 1.4, jr = (rnd(fi * 7 + h) - 0.5) * 0.5; // tremblement de papier
      const [ox, oy] = org[id];
      const el = $(id);
      el.setAttribute("transform", `translate(${s.x + jx} ${s.y + jy}) translate(${ox} ${oy}) rotate(${s.r + jr}) scale(${s.sx * s.s} ${s.sy * s.s}) translate(${-ox} ${-oy})`);
      el.setAttribute("opacity", s.o);
    }
    applyCam($("cam-" + bi), b.cam, clamp01(lt / (b.t1 - b.t0)));

    // sous-titres
    const sub = D.subs.find((u) => t >= u.t0 && t < u.t1);
    const g = $("subs"), tx = $("subtxt");
    if (sub) {
      g.style.display = "inline";
      tx.textContent = sub.text;
      tx.setAttribute("font-size", 104);
      const bw = tx.getBBox().width;
      if (bw > 860) tx.setAttribute("font-size", Math.floor((104 * 860) / bw));
      tx.setAttribute("fill", sub.em ? D.accent : "#FFFFFF");
      const p = clamp01((t - sub.t0) / 0.09), sc = 0.82 + 0.18 * ease.outBack(p);
      g.setAttribute("transform", `translate(540 1480) scale(${sc}) translate(-540 -1480)`);
    } else g.style.display = "none";
  };

  window.measureSubs = () => D.subs.map((u) => {
    const tx = $("subtxt"); tx.textContent = u.text; tx.setAttribute("font-size", 104);
    let bb = tx.getBBox(); if (bb.width > 860) { tx.setAttribute("font-size", Math.floor((104 * 860) / bb.width)); bb = tx.getBBox(); }
    return { text: u.text, w: bb.width, y0: bb.y, y1: bb.y + bb.height };
  });
  window.missingIds = () => D.beats.flatMap((b) => [...b.anims, ...(b.loops || [])].map((a) => a.id)).filter((id) => !$(id));
})();
