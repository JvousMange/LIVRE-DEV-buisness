/* Kit v5 « vie » : boucles temporelles (S.T = secondes dans le plan), gestes, flammes, gouttes, soleil */
S.T = 0; S.RUBNOW = 0;
{ const hand0 = S.hand; S.hand = (g, x, y, s = 1, r = 0, o = {}) => { const rub = o.rub ?? S.RUBNOW, T = S.T; return hand0(g, x + Math.sin(T * 13) * rub, y + Math.abs(Math.cos(T * 9)) * rub * .35, s, r + Math.sin(T * 13) * rub * .08, o); }; }
{ const fl0 = S.flame; S.flame = (g, x, y, s = 1) => { const f = fl0(g, x, y, s * (1 + .07 * Math.sin(S.T * 15))); f._b.r = Math.sin(S.T * 9) * 4; return f; }; }
{ const dr0 = S.dropper; S.dropper = (g, x, y, s = 1, r = 0, drops = 1) => { const d = dr0(g, x, y, s, r, 0); const ph = (S.T * 1.1) % 1; const q = S.serumDrop(g, x, y + (70 + ph * 260) * s, .9 * s); H.set(q, { o: ph < .85 ? 1 : (1 - ph) / .15 }); return d; }; }
{ const su0 = K3.sunBig; K3.sunBig = (p, r) => { const g = su0(p, r); g._b.r = S.T * 12; return g; }; }
