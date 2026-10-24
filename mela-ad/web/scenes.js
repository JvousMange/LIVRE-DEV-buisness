/* Scènes v6 : 1 idée = 1 scène, 1 sujet, fond kraft uni, temps forts calés sur les mots.
   draw(g, t, W) : t = secondes depuis le début de la scène, W(s, w) = instant local du mot w de la phrase s. Renvoie une caméra {z, fx, fy} optionnelle. */
const SC = [], scene = (id, at, draw) => SC.push({ id, at, draw });
const ap = (t, t0, d = .35) => H.clamp((t - t0) / d);
const inOut = (t, tIn, tOut, d = .35) => H.E.out(ap(t, tIn, d)) * (1 - H.E.io(ap(t, tOut, d)));
const num = (g, n) => S.tag(g, String(n), 150, 200, 110, { string: false, r: -4 });

/* 1 · accroche : un gros plan, les points éclosent, le coton frotte et repart, les points restent */
scene("hook", [0, 0], (g, t, W, O) => {
  S.plain(g); const f = S.jaw(g, { hair: "afro", x: 430, y: 330, s: 2.6 });
  S.patches(f, H.clamp((t - W(0, 5)) / .9));
  const c = f.pt(-92, 52), tIn = W(0, 7) - .15, tOut = W(0, 9) + .25, k = inOut(t, tIn, tOut);
  if (k > 0) { const h = S.hand(g, H.lerp(1150, c[0] + 60, k), H.lerp(2000, c[1] + 170, k), 1.5, -15, { rub: t > tIn + .3 && t < tOut ? 30 : 0 }); K3.pad(h.q, 0, -150, 64); }
  return { z: 1 + .05 * t / 3.7, fx: 540, fy: 900 };
});

/* 2 · R1 : on frotte la surface… puis la caméra descend : la tache se fabrique dessous */
scene("r1", [1, 0], (g, t, W, O) => {
  const ys = 700; S.inside(g, { spot: 1.2, y: ys });
  const dive = H.E.io(ap(t, W(1, 11), 1.4));
  S.factory(g, { x: 540, y: 1470, s: .78, min: true, smoke: dive > .2 ? 9 : 0, reach: 520, idle: dive < .2 });
  const kH = inOut(t, W(1, 2), W(1, 11), .4);
  if (kH > 0) S.hand(g, H.lerp(1150, 600, kH), H.lerp(-300, ys - 250, kH), 1.3, 180, { point: true, rub: t > W(1, 4) ? 22 : 0 });
  if (t > W(1, 8)) H.blob(g, 540, ys - 24, 140 * H.E.out(ap(t, W(1, 8), .4)) + 1, 18, "#F3EEE2", { n: 14, jit: .06, sh: false, th: 0, attr: { opacity: .9 } });
  num(O, 1);
  return { z: H.lerp(1.5, 1, dive), fx: 540, fy: H.lerp(ys + 40, 1060, dive) };
});

/* 3 · R2 : elle couvre ses points au fond de teint… le soir, le coton les révèle */
scene("r2", [2, 0], (g, t, W, O) => {
  S.plain(g); const f = S.jaw(g, { hair: "bun", turn: -.4, x: 620, y: 330, s: 2.6 }); S.patches(f, 1);
  const n = S.DOTS.length, cov = H.clamp((t - W(2, 3)) / Math.max(.5, W(2, 8) - W(2, 3) - .2)), off = H.clamp((t - W(2, 9)) / Math.max(.5, W(2, 15) - W(2, 9)));
  S.DOTS.slice(0, Math.round(n * cov)).forEach(([x, y, r], i) => { if (i / n < off) return; H.blob(f.hd, x, y, r * 2.4, r * 2.1, "#A87250", { n: 10, jit: .1, seed: i, sh: false, th: 0 }); });
  const c = f.pt(-92, 52), kS = inOut(t, W(2, 2), W(2, 8) - .1, .35);
  if (kS > 0) { const h = S.hand(g, H.lerp(-200, c[0] - 70, kS), H.lerp(2000, c[1] + 180, kS), 1.4, 18, { rub: 14 }); K.sponge(h.q); }
  const kC = inOut(t, W(2, 9) - .1, W(2, 15) + .2, .35);
  if (kC > 0) { const h = S.hand(g, H.lerp(-200, c[0] - 40 + Math.sin(t * 8) * 60, kC), H.lerp(2000, c[1] + 160, kC), 1.4, 18); K3.pad(h.q, 0, -150, 66); }
  num(O, 2);
  return { z: 1 + .04 * t / 5, fx: 560, fy: 900 };
});
