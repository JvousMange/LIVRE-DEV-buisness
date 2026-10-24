/* Scènes v7 : 1 idée = 1 scène, gestes naturels (bras IK, mains qui tiennent), temps forts calés sur les mots.
   draw(g, t, W, O) : t = secondes depuis le début de la scène, W(s, w) = instant local du mot, O = calque fixe (hors caméra). Renvoie {z, fx, fy}. */
const SC = [], scene = (id, at, draw) => SC.push({ id, at, draw });
const ap = (t, t0, d = .35) => H.clamp((t - t0) / d);
const inOut = (t, tIn, tOut, d = .35) => H.E.out(ap(t, tIn, d)) * (1 - H.E.io(ap(t, tOut, d)));
const num = (g, n) => S.tag(g, String(n), 150, 200, 110, { string: false, r: -4 });
const rot = (v, a) => { const c = Math.cos(a), s = Math.sin(a); return [v[0] * c - v[1] * s, v[0] * s + v[1] * c]; };
/* point du repère de la main -> monde (main au poignet w, orientée selon l'avant-bras) */
const handPt = (w, el, s, lp) => { const a = Math.atan2(w[1] - el[1], w[0] - el[0]) + Math.PI / 2; const r = rot([lp[0] * s, lp[1] * s], a); return [w[0] + r[0], w[1] + r[1]]; };
/* poignet tel que l'outil (point local lp de la main) touche la cible, l'avant-bras venant de l'épaule */
const wristFor = (sh, target, s, lp) => { const d = V2.sub(target, sh), L = V2.len(d), u = [d[0] / L, d[1] / L]; return V2.sub(target, V2.mul(u, -lp[1] * s)); };
const dotsAll = (g, k = 1) => R.cheekDots.forEach(([x, y, r]) => R.dot(g, x, y, r, k));

/* 1 · accroche : gros plan joue, les points éclosent un à un pendant toute la phrase */
scene("hook", [0, 0], (g, t, W) => {
  R.cheek(g); const n = R.cheekDots.length, t0 = .2, t1 = W(0, 9) + .1;
  R.cheekDots.forEach(([x, y, r], i) => R.dot(g, x, y, r, (t - (t0 + (t1 - t0) * Math.pow(i / n, .8))) / .22));
  return { z: 1 + .1 * H.E.io(H.clamp(t / 3.7)), fx: H.lerp(540, 470, H.clamp(t / 3.7)), fy: H.lerp(900, 820, H.clamp(t / 3.7)) };
});

/* 2 · R1 : la main tient un tube, le presse, la crème coule sur la tache… puis on passe sous la peau */
scene("r1", [1, 0], (g, t, W, O) => {
  R.cheek(g); dotsAll(g);
  const sh = [700, -820], land = [480, 820], s = 1.15, tip = [0, -290];
  const kIn = H.E.out(ap(t, W(1, 1) - .2, .55)), kOut = H.E.io(ap(t, W(1, 11) - .5, .5)), wr0 = wristFor(sh, V2.sub(land, [0, 110]), s, tip);
  const wr = V2.lerp(V2.lerp([760, -420], wr0, kIn), [780, -520], kOut); const press = H.E.io(ap(t, W(1, 4), .5)) * (1 - ap(t, W(1, 10), .4));
  const flow = H.clamp((t - W(1, 4) - .2) / Math.max(.6, W(1, 9) - W(1, 4)));
  const el = R.ik(sh, wr, 620 * s, 560 * s, 1); const tipW = handPt(wr, el, s, tip);
  R.ribbon(g, tipW, land, flow * (1 - kOut), H.clamp((t - W(1, 7)) / 1.2));
  if (kIn > 0) R.arm(g, sh, wr, { s, pose: "grip", press, hold: q => { const tq = H.el("g", { transform: "translate(0,76)" }, q); R.tube(tq, 300, 104, press); } });
  num(O, 1);
  /* passage sous la peau : ouverture circulaire depuis la crème */
  const tB = W(1, 11) - .05, kB = H.E.in(ap(t, tB, .55));
  if (kB > 0) { const B = H.grp(g, 0, 0, { j: 0 }); S.clip(B, `M${land[0] - 2400 * kB},${land[1]} a${2400 * kB},${2400 * kB} 0 1,0 ${4800 * kB},0 a${2400 * kB},${2400 * kB} 0 1,0 ${-4800 * kB},0Z`); const dive = H.E.io(ap(t, tB + .4, 1.4)), z = H.lerp(1.5, 1, dive), fy = H.lerp(740, 1060, dive); const In = H.el("g", { transform: `translate(${540 - 540 * z},${960 - fy * z}) scale(${z})` }, B); S.inside(In, { spot: 1.2, y: 700 }); H.blob(In, 540, 676, 150, 18, "#F6F1E8", { n: 14, jit: .06, sh: false, th: 0 }); S.factory(In, { x: 540, y: 1470, s: .78, min: true, smoke: dive > .15 ? 9 : 0, reach: 520, idle: dive < .15 }); }
  return { z: kB > 0 ? 1 : 1 + .04 * t / 5, fx: 500, fy: 860 };
});

/* 3 · R2 : elle tamponne ses points à l'éponge… le soir, le coton démaquille et les points reviennent */
scene("r2", [2, 0], (g, t, W, O) => {
  R.cheek(g); const tA = W(2, 2), tE = W(2, 8) - .15, tR = W(2, 9), tR2 = W(2, 15) + .1;
  const dabs = [[420, 640], [560, 620], [660, 720], [380, 820], [520, 820], [640, 880], [330, 960], [470, 1000], [600, 990]], nD = dabs.length, per = (tE - tA - .5) / nD;
  const coverTime = R.cheekDots.map(([x, y]) => { let best = Infinity; dabs.forEach((d, i) => { if (Math.hypot(d[0] - x, d[1] - y) < 110) best = Math.min(best, tA + .45 + i * per + per * .5); }); return best; });
  const sweep = H.clamp((t - tR - .2) / Math.max(.6, tR2 - tR - .3)), sx = H.lerp(240, 760, sweep);
  R.cheekDots.forEach(([x, y, r], i) => { R.dot(g, x, y, r, 1); const covered = t > coverTime[i] && !(t > tR && x < sx); if (covered) H.blob(g, x, y, r * 2.3, r * 2.1, "#A56F4A", { n: 10, jit: .12, seed: i, sh: false, th: 0 }); });
  const s = 1.15, sh = [1250, 2350], tool = [0, -214];
  /* éponge : entrée, tamponnages successifs (approche / contact / écrasement), sortie */
  const kS = inOut(t, tA - .1, tE, .45);
  if (kS > 0) { const idx = H.clamp(Math.floor((t - tA - .45) / per), 0, nD - 1), ph = ((t - tA - .45) / per) % 1, near = t < tA + .45 ? 0 : Math.sin(Math.PI * H.clamp(ph)), tg = V2.add(dabs[idx], [26 * (1 - near), 34 * (1 - near)]);
    const wr = V2.lerp([1200, 2100], wristFor(sh, tg, s, tool), kS); R.arm(g, sh, wr, { s, pose: "pinch", press: near * .6, hold: q => R.sponge(q, near > .8 ? (near - .8) * 5 : 0) }); }
  /* le soir : lumière qui baisse, le coton balaie la joue */
  const night = H.E.io(ap(t, tR - .3, .6)); if (night > 0) H.rrect(g, -100, -100, 1300, 2200, "#1C1828", { r: 0, sh: false, jit: 0, attr: { opacity: (.28 * night).toFixed(2) } });
  const kC = inOut(t, tR - .1, tR2, .4);
  if (kC > 0) { const tg = [sx, 860 + Math.sin(sweep * 14) * 90]; const wr = V2.lerp([1200, 2100], wristFor(sh, tg, s, tool), kC); R.arm(g, sh, wr, { s, pose: "pinch", press: .5, hold: q => R.cotton(q) }); }
  num(O, 2);
  return { z: 1 + .04 * t / 5, fx: 520, fy: 880 };
});
