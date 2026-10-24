/* Scènes v8 : visage 3/4 lisible en gros plan, mains qui viennent du bas, gestes calés sur les mots */
const SC = [], scene = (id, at, draw) => SC.push({ id, at, draw });
const ap = (t, t0, d = .35) => H.clamp((t - t0) / d);
const inOut = (t, tIn, tOut, d = .35) => H.E.out(ap(t, tIn, d)) * (1 - H.E.io(ap(t, tOut, d)));
const num = (g, n) => S.tag(g, String(n), 150, 200, 110, { string: false, r: -4 });
const FD = R.FACEDOTS;

/* 1 · accroche : gros plan joue, les points éclosent un à un pendant la phrase */
scene("hook", [0, 0], (g, t, W) => {
  const f = R.face(g, { hair: "afro" }); const t0 = .3, t1 = W(0, 9);
  FD.forEach(([x, y, r], i) => R.fdot(f, x, y, r, (t - (t0 + (t1 - t0) * i / FD.length)) / .2));
  const k = H.E.io(H.clamp(t / 3.6)); return { z: H.lerp(1.15, 1.35, k), fx: H.lerp(600, 640, k), fy: 830 };
});

/* 2 · R1 : sa main tient un tube, le presse, la crème coule sur la joue… puis on passe sous la peau */
scene("r1", [1, 0], (g, t, W, O) => {
  const f = R.face(g, { hair: "bun", turn: .3 }); FD.forEach(([x, y, r]) => R.fdot(f, x, y, r, 1));
  const land = f.pt(95, 70), s = 1.25, dir = 62, tip = [0, -330];
  const kIn = H.E.out(ap(t, W(1, 1) - .2, .6)), kOut = H.E.io(ap(t, W(1, 11) - .55, .5));
  const wr0 = V2.sub(land, V2.sub(R.hp([0, 0], dir, s, tip), [0, 0])).map((v, i) => v + [-20, -60][i]);
  const off = [Math.cos(dir * Math.PI / 180) * 900, Math.sin(dir * Math.PI / 180) * 900];
  const wr = V2.add(wr0, V2.mul(off, (1 - kIn) + kOut));
  const press = H.E.io(ap(t, W(1, 4), .5)) * (1 - ap(t, W(1, 10), .4)), flow = H.clamp((t - W(1, 4) - .2) / Math.max(.6, W(1, 9) - W(1, 4)));
  const tipW = R.hp(wr, dir, s, tip);
  R.ribbon(g, tipW, land, flow * (1 - kOut), H.clamp((t - W(1, 7)) / 1.2));
  if (kIn > 0 && kOut < 1) R.arm2(g, wr, dir, { s, pose: "grip", press, hold: q => { const tq = H.el("g", { transform: "translate(0,-70)" }, q); R.tube(tq, 190, 92, press); } });
  num(O, 1);
  const tB = W(1, 11) - .05, kB = H.E.in(ap(t, tB, .55));
  if (kB > 0) { const B = H.grp(g, 0, 0, { j: 0 }), rr = 2600 * kB; S.clip(B, `M${land[0] - rr},${land[1]} a${rr},${rr} 0 1,0 ${2 * rr},0 a${rr},${rr} 0 1,0 ${-2 * rr},0Z`); const dive = H.E.io(ap(t, tB + .4, 1.4)), z = H.lerp(1.5, 1, dive), fy = H.lerp(740, 1060, dive); const In = H.el("g", { transform: `translate(${540 - 540 * z},${960 - fy * z}) scale(${z})` }, B); S.inside(In, { spot: 1.2, y: 700 }); H.blob(In, 540, 676, 150, 18, "#F6F1E8", { n: 14, jit: .06, sh: false, th: 0 }); S.factory(In, { x: 540, y: 1470, s: .78, min: true, smoke: dive > .15 ? 9 : 0, reach: 520, idle: dive < .15 }); }
  return kB > 0 ? { z: 1 } : { z: 1.25, fx: 620, fy: 860 };
});

/* 3 · R2 : elle tamponne ses points à l'éponge… le soir, le coton démaquille et les points reviennent */
scene("r2", [2, 0], (g, t, W, O) => {
  const f = R.face(g, { hair: "braids", turn: -.3 }); const tA = W(2, 2), tE = W(2, 8) - .15, tR = W(2, 9), tR2 = W(2, 15) + .1;
  const dabs = [[110, 40], [80, 100], [130, 110], [60, 30], [-80, 50], [-110, 110], [-60, 120], [100, 150], [-90, 160]], nD = dabs.length, per = (tE - tA - .5) / nD;
  const cov = FD.map(([x, y]) => { let b = Infinity; dabs.forEach((d, i) => { if (Math.hypot(d[0] - x, d[1] - y) < 42) b = Math.min(b, tA + .45 + i * per + per * .5); }); return b; });
  const sweep = H.clamp((t - tR - .2) / Math.max(.6, tR2 - tR - .3)), sx = H.lerp(160, -160, sweep);
  FD.forEach(([x, y, r], i) => { R.fdot(f, x, y, r, 1); if (t > cov[i] && !(t > tR && x > sx)) H.blob(f.hd, x, y, r * 1.6, r * 1.45, "#A56F4A", { n: 10, jit: .12, seed: i, sh: false, th: 0 }); });
  const s = 1.2, dir = 110, tool = [-8, -250];
  const kS = inOut(t, tA - .1, tE, .45);
  if (kS > 0) { const idx = H.clamp(Math.floor((t - tA - .45) / per), 0, nD - 1), ph = ((t - tA - .45) / per) % 1, near = t < tA + .45 ? 0 : Math.sin(Math.PI * H.clamp(ph)); const tg0 = f.pt(dabs[idx][0], dabs[idx][1]), tg = [tg0[0] + 24 * (1 - near), tg0[1] + 40 * (1 - near)];
    const wr = V2.add(V2.sub(tg, V2.sub(R.hp([0, 0], dir, s, tool), [0, 0])), V2.mul([Math.cos(dir * Math.PI / 180), Math.sin(dir * Math.PI / 180)], 900 * (1 - kS)));
    R.arm2(g, wr, dir, { s, pose: "pinch", press: near, hold: q => R.sponge(q, near > .8 ? (near - .8) * 5 : 0, -250) }); }
  const night = H.E.io(ap(t, tR - .3, .6)); if (night > 0) H.rrect(g, -100, -100, 1300, 2200, "#1C1828", { r: 0, sh: false, jit: 0, attr: { opacity: (.28 * night).toFixed(2) } });
  const kC = inOut(t, tR - .1, tR2, .4);
  if (kC > 0) { const tg = f.pt(sx, 90 + Math.sin(sweep * 12) * 40); const wr = V2.add(V2.sub(tg, R.hp([0, 0], dir, s, tool)), V2.mul([Math.cos(dir * Math.PI / 180), Math.sin(dir * Math.PI / 180)], 900 * (1 - kC))); R.arm2(g, wr, dir, { s, pose: "pinch", press: .6, hold: q => R.cotton(q, -250) }); }
  num(O, 2);
  return { z: 1.25, fx: 540, fy: 860 };
});
