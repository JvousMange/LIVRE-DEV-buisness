/* Storyboard : chaque plan = draw(g, end). end=false -> image de départ, end=true -> image d'arrivée */
const SB = [], P = (id, vo, f) => SB.push({ id, vo, f });
const sec = (g0, y0 = 700, o = {}) => { const z = o.z || 1.5, Y = y0 + 322, g = H.grp(g0, 540 - 540 * z, Y - Y * z, { j: 0 }); H.set(g, { s: z }); const s = K4.skin(g, y0); s.g = g; if (o.grains) { const G = K4.grains(s, g, o.grains, o.r || 12); K4.rise(s, G, o.t || .37, 1, o.top === undefined ? s.y0 + 150 : o.top, 1); s.G = G; } return s; };
const cream = (s, w = 300) => H.blob(s.g, 540, s.y0 - 18, w, 34, "#F3EEE2", { n: 20, jit: .04, th: 4 });

/* 1 · accroche */
P("1a", "Cinq raisons…", (g, e) => { S.bathWall(g); const m = S.mirror(g, 540, 560, 560, 720); S.woman(m.inner, 0, 40, 1.15, { spots: 8, turn: .5, hair: "afro" }); m.shine(); S.counter(g); if (e) K3.sign(g, "5 RAISONS", 540, 250, { size: 130, maxw: 820 }); });
P("1b", "…ton hyperpigmentation…", (g, e) => { const f = S.woman(g, 540, 860, 2.0, { spots: e ? 8 : 0, turn: .4, hair: "afro" }); });
P("1c", "…ne part pas.", (g, e) => { const f = S.woman(g, 540, 860, 2.0, { spots: 8, turn: .4, hair: "afro" }); const c = f.pt(80, 40); const h = S.hand(g, e ? c[0] + 260 : c[0] + 40, e ? c[1] + 320 : c[1] + 120, 1.3, -20); K3.pad(h.q, 0, -150, 60); if (e) S.cross(g, 860, 420, 110); });

/* 2 · R1 surface / dessous */
P("2a", "Un, tu essaies de faire partir tes taches à la surface…", (g, e) => { const f = S.woman(g, 540, 860, 2.2, { spots: 6, turn: -.3, hair: "bun" }); const c = f.pt(-88, 30); const h = S.hand(g, c[0] - 40, c[1] + 160, 1.2, 25, { point: true }); if (e) H.blob(f.hd, -88, 30, 30, 22, "#F3EEE2", { n: 12, jit: .05, sh: false, th: 0, attr: { opacity: .8 } }); S.tube(g, 860, 1220, "#F2C9C0", 1, 1.1, 18); });
P("2b", "…alors qu'elles se fabriquent sous ta peau.", (g, e) => { const s = sec(g, e ? 420 : 160, { grains: e ? 4 : 2 }); cream(s, 380); if (e) { K.arrow(g, 900, 300, 900, 700, Q.red, 50); } });

/* 3 · R2 cacher */
P("3a", "Deux, tu les caches…", (g, e) => { S.bathWall(g); const f = S.woman(g, 540, 860, 1.9, { spots: 8, hair: "afro" }); if (e) S.cover(f); const c = f.pt(e ? 72 : 88, e ? 62 : 30); const h = S.hand(g, c[0] + 60, c[1] + 180, 1.2, -20); K.sponge(h.q); S.found(g, 880, 1250, 2, 1.1); });
P("3b", "…fond de teint, maquillage…", (g, e) => { S.bathWall(g); S.counter(g, 1150); const f = S.woman(g, 540, 760, 1.7, { spots: 8, hair: "afro" }); S.cover(f); const c = f.pt(-80, 40); S.brush(g, c[0] - 20 + (e ? 80 : 0), c[1] + 120, 1.0, e ? 30 : -10); const k = K.compact(g, 100); H.set(k, { x: 220, y: 1260 }); S.found(g, 820, 1200, 0, .9); });
P("3c", "…mais tu ne les fais pas vraiment partir.", (g, e) => { S.bathWall(g, { wall: "#B9A585", tile: "#4F7F74" }); S.night(g, 880, 360); const f = S.woman(g, 540, 860, 1.9, { spots: 8, hair: "afro" }); const cv = S.cover(f); if (e) cv.slice(0, 5).forEach(c => c.parentNode.remove()); const cc = f.pt(80, 40); const h = S.hand(g, cc[0] + (e ? 140 : 40), cc[1] + 160, 1.2, -20); K3.pad(h.q, 0, -150, 64); });

/* 4 · R3 peaux claires */
P("4a", "Trois, la plupart des soins…", (g, e) => { S.store(g); K3.sign(g, "RAYON 3", 540, 200, { size: 80, maxw: 400, fill: Q.cream, ink: Q.blk }); if (e) { const f = S.woman(g, 300, 1250, 1.2, { spots: 4, hair: "braids", turn: .6 }); } });
P("4b", "…sont pensés pour des peaux claires.", (g, e) => { const bx = [0, 1, 2].map(i => { const b = K3.paleBox(g, 1.0); H.set(b, { x: 200 + i * 340, y: 800 }); return b; }); if (e) { [0, 1].forEach(i => { const c = K3.chips[i]; H.rrect(g, 120 + i * 120, 1150, 100, 160, c, { r: 10, jit: 0, th: 6 }); }); [3, 4, 5].forEach((i, k) => { H.rrect(g, 560 + k * 120, 1150, 100, 160, K3.chips[i], { r: 10, jit: 0, th: 6 }); S.cross(g, 610 + k * 120, 1230, 55); }); S.check(g, 230, 1100, 50); } });

/* 5 · R3 bis */
P("5a", "Sur une peau mate ou noire…", (g, e) => { S.bathWall(g); const f = S.woman(g, 540, 860, 1.9, { spots: 5, hair: "bun", turn: .4 }); const c = f.pt(70, 62); const h = S.hand(g, c[0] + 80, c[1] + 200, 1.2, -25, { point: true }); const j = K.jar(g, "#F2C9C0", 1.0); H.set(j, { x: 860, y: 1300 }); if (e) H.blob(f.hd, 70, 62, 60, 46, "#F3EEE2", { n: 14, jit: .05, sh: false, th: 0, attr: { opacity: .85 } }); });
P("5b", "…ils agressent…", (g, e) => { const f = S.woman(g, 540, 860, 1.9, { spots: 5, hair: "bun", turn: .4, tilt: e ? -8 : 0 }); if (e) { S.redness(f, 70, 62, 110, .55); S.redness(f, -60, 70, 80, .4); const h = S.hand(g, f.pt(130, 60)[0] + 40, f.pt(130, 60)[1] + 200, 1.2, -10); for (let i = 0; i < 6; i++) { const a = i / 6 * 6.28; H.poly(g, [[0, -30], [14, 14], [-14, 14]].map(([x, y]) => [x + f.pt(70, 62)[0] + Math.cos(a) * 200, y + f.pt(70, 62)[1] + Math.sin(a) * 200]), "#C8392B", { jit: 0, th: 3 }); } } });
P("5c", "…ou ils ne font rien.", (g, e) => { S.bathWall(g); S.cal(g, 870, 330, .6, e ? 3 : 0); const m = S.mirror(g, 480, 640, 560, 720); S.woman(m.inner, 0, 40, 1.15, { spots: 5, hair: "bun", turn: .4 }); m.shine(); S.counter(g); const j = K.jar(g, "#F2C9C0", .9); H.set(j, { x: 860, y: 1290 }); if (e) { const q = K.q(g, .5); H.set(q, { x: 880, y: 780 }); } });

/* 6 · R4 */
P("6a", "Quatre, depuis que tu fais des gommages…", (g, e) => { S.bathWall(g); const f = S.woman(g, 540, 860, 1.9, { spots: 6, hair: "braids", turn: -.3 }); if (e) f.sp.forEach(d => H.set(d, { s: 1.35 })); const c = f.pt(80, 40); const h = S.hand(g, c[0] + (e ? 0 : 60), c[1] + 140, 1.25, -20); H.blob(h.q, 0, -80, 50, 40, "#CDE3D0", { n: 12, jit: .05, th: 3 }); for (let i = 0; i < 10; i++) H.circ(g, c[0] - 60 + (i * 37) % 160, c[1] + 40 + (i * 53) % 120, 7, "#F2E2C0", { th: 2 }); S.scrub(g, 860, 1300, 4, 1.0); });
P("6b", "…ou que tu testes des produits au hasard…", (g, e) => { S.bathWall(g); K3.shelf(g, 540, 640, 980); K3.shelf(g, 540, 1000, 980); const n = e ? 10 : 3, cols = [Q.green, Q.blue, "#D8C79E", Q.pink, "#C8A060"]; for (let i = 0; i < n; i++) { const b = K3.bottle2(g, cols[i % 5], "", .62); H.set(b, { x: 140 + (i % 5) * 200, y: (i < 5 ? 640 : 1000) - 70 }); } const f = S.woman(g, 540, 1500, 1.1, { spots: 6, hair: "braids", turn: -.3 }); const h = S.hand(g, e ? 760 : 320, e ? 1140 : 1140, 1.0, 10); const t = K.tube(h.q, Q.pink, .5); H.set(t, { y: -170 }); });
P("6c", "…c'est encore pire.", (g, e) => { const f = S.woman(g, 540, 860, 2.0, { spots: e ? 10 : 6, hair: "braids", turn: -.3 }); if (e) { f.sp.forEach(d => H.set(d, { s: 1.6 })); K.arrow(g, 900, 700, 900, 360, Q.red, 56); } });

/* 7 · R5 */
P("7a", "Et cinq, soleil…", (g, e) => { S.street(g); const su = K3.sunBig(g, 110); H.set(su, { x: 820, y: 260 }); S.txt(su, "5", 0, 40, 120, Q.blk); const f = S.woman(g, 470, 1000, 1.6, { spots: e ? 3 : 1, hair: "afro", turn: .5, tilt: -6 }); if (e) f.sp.forEach(d => H.set(d, { s: 1.4 })); for (let i = 0; i < 4; i++) H.rrect(g, 640 - i * 30, 420 + i * 60, 220, 12, "#E2B13C", { r: 6, jit: 0, sh: false, th: 0, attr: { transform: `rotate(-35 ${640 - i * 30} ${420 + i * 60})` } }); });
P("7b", "…rasage…", (g, e) => { const f = S.woman(g, 470, 900, 1.5, { spots: 0, hair: "bun", turn: .5, cloth: "#6FA596" }); const a = S.armSkin(g, [[700, 1260], [860, 900], [900, 520]], 130); for (let i = 0; i < (e ? 9 : 0); i++) K3.dot(g, 730 + (i % 3) * 34, 1180 - Math.floor(i / 3) * 40, 8, i + 3); const rz = K.razor(g, 1.0); H.set(rz, { x: e ? 840 : 760, y: e ? 1050 : 1250, r: -60 }); });
P("7c", "…frottements…", (g, e) => { H.rrect(g, -60, -60, 1200, 2040, "#D8C29C", { r: 0, sh: false, jit: 0 }); H.rrect(g, 290, 520, 230, 1300, S.SK, { r: 100, jit: 0, th: 8 }); H.rrect(g, 560, 520, 230, 1300, S.SK, { r: 100, jit: 0, th: 8 }); H.poly(g, [[240, 300], [840, 300], [860, 760], [560, 780], [540, 640], [520, 780], [220, 760]], "#3F6FA0", { jit: 1, th: 8 }); if (e) { H.blob(g, 510, 900, 40, 140, "#3A2217", { n: 14, jit: .1, sh: false, th: 0, attr: { opacity: .75 } }); H.blob(g, 570, 900, 40, 140, "#3A2217", { n: 14, jit: .1, sh: false, th: 0, attr: { opacity: .75 } }); } [0, 1, 2].forEach(i => H.el("path", { d: `M${500 + (i - 1) * 10},${850 + i * 60} q40,-20 80,0`, stroke: "#6b543a", "stroke-width": 6, fill: "none", opacity: .8 }, g)); });
P("7d", "…rien ne protège du retour des taches.", (g, e) => { S.bathWall(g); S.cal(g, 870, 330, .6, e ? 2 : 0); const m = S.mirror(g, 480, 640, 560, 720); const f = S.woman(m.inner, 0, 40, 1.15, { spots: 1, hair: "afro", turn: .5 }); f.sp.forEach(d => H.set(d, { s: e ? 1.6 : .5, o: e ? 1 : .35 })); m.shine(); S.counter(g); });

/* 8 · pas toi, dessous */
P("8a", "Le problème ne vient pas de toi, ni de ta peau…", (g, e) => { const f = S.woman(g, 540, 860, 1.8, { spots: 4, hair: "bob", turn: .2 }); if (e) S.check(g, 200, 420, 110); });
P("8b", "…mais d'en dessous.", (g, e) => { if (!e) { S.woman(g, 540, 860, 3.2, { spots: 4, hair: "bob", turn: .2 }); K.arrow(g, 540, 300, 540, 700, Q.red, 60); } else { sec(g, 300, { grains: 3 }); K.arrow(g, 540, 120, 540, 560, Q.red, 60); } });

/* 9 · agir */
P("9a", "Et c'est là que tu peux agir.", (g, e) => { const s = sec(g, 520, { grains: 3 }); if (e) { K.ring(g, 540, s.cy, 260, Q.green, 16); S.check(g, 880, 400, 90); } });

/* 10 · mélanine */
P("10a", "Voilà ce qui se passe.", (g, e) => { if (!e) { S.woman(g, 540, 860, 2.0, { spots: 4, hair: "bob" }); const lp = H.grp(g, 680, 840, { j: 0 }); H.circ(lp, 0, 0, 150, "none", { sh: "sh1", attr: { stroke: "#2A211D", "stroke-width": 26 } }); H.rrect(lp, 90, 90, 40, 220, "#2A211D", { r: 16, jit: 0, attr: { transform: "rotate(-45 110 200)" } }); } else { sec(g, 520, { grains: 2 }); } });
P("10b", "Ta peau fabrique de la mélanine…", (g, e) => { const s = sec(g, 520, { grains: e ? 5 : 1, r: 12 }); });
P("10c", "…c'est ce qui lui donne sa couleur.", (g, e) => { const tones = e ? ["#D9A67E", "#B98258", "#A06A44", "#7C4A30", "#4B2B1E"] : ["#A06A44"]; tones.forEach((sk, i) => S.woman(g, e ? [270, 540, 810, 400, 680][i] : 540, e ? [640, 640, 640, 1100, 1100][i] : 860, e ? .62 : 1.9, { skin: sk, hair: ["afro", "bun", "bob", "braids", "afro"][i], spots: 0 })); });

/* aides coupe */
const cellX = (s, i, z = 1.5) => 540 + (120 + i * 210 - 540) * z;
const surfY = (s, z = 1.5) => s.cy - 322 * z;
const extra = (s, n, ci = 2, spread = 70, seed = 60) => { const r = H.rng(seed); for (let i = 0; i < n; i++) K3.dot(s.g, 120 + ci * 210 + (r() - .5) * spread * 2, s.cy - 40 - r() * 200, 11 + r() * 4, i + seed, MEL); };
const wheat = (g, x, y, s = 1) => { const w = H.grp(g, x, y, { j: .3 }), q = H.grp(w, 0, 0, { j: 0 }); H.set(q, { s }); H.rrect(q, -5, -10, 10, 150, "#A98A2E", { r: 4, jit: 0, sh: false, th: 0 }); for (let i = 0; i < 6; i++) [-1, 1].forEach(sg => { const e = H.grp(q, sg * 22, -90 + i * 24, { j: 0 }); e._b.r = sg * 28; H.blob(e, 0, 0, 14, 26, "#E2B13C", { n: 10, jit: .05, th: 3 }); }); return w; };
const berry = (g, x, y, s = 1) => { const b = H.grp(g, x, y, { j: .3 }), q = H.grp(b, 0, 0, { j: 0 }); H.set(q, { s }); [[-50, -20, -50], [50, -20, 50], [0, -60, 0]].forEach(([a, c, r], i) => { const l = H.grp(q, a, c, { j: 0 }); l._b.r = r; H.blob(l, 0, -30, 26, 56, i % 2 ? Q.green : Q.greenD, { n: 14, jit: .05, th: 4 }); }); [[-16, 30], [18, 28], [0, 60]].forEach(([a, c]) => H.circ(q, a, c, 24, "#C8392B", { th: 5 })); return b; };
const sign = (g, t, y = 300, size = 96) => K3.sign(g, t, 540, y, { size, maxw: 860 });
const bottleM = (g, x, y, s = 1.2) => { const b = K.bottle(g, s); H.set(b, { x, y }); return b; };

/* 11 · agression */
P("11a", "Quand elle est agressée…", (g, e) => { const s = sec(g, 560, { grains: 1 }); S.bolt(g, 540, e ? surfY(s) - 150 : 180, 1.3); if (e) H.circ(g, 540, surfY(s), 90, "#E2B13C", { sh: false, th: 0, attr: { opacity: .5 } }); });
P("11b", "…par un bouton…", (g, e) => { const f = S.woman(g, 540, 860, 2.0, { spots: 0, hair: "bob", turn: .3 }); if (e) { const pm = K.pimple(f.hd, 30); H.set(pm, { x: 80, y: 50 }); } });
P("11c", "…un rasage…", (g, e) => { H.rrect(g, -60, -60, 1200, 2040, "#D8C29C", { r: 0, sh: false, jit: 0 }); const l = H.grp(g, 540, 960, { j: 0 }); l._b.r = -12; H.rrect(l, -170, -760, 340, 1520, S.SK, { r: 160, jit: 0, th: 10 }); for (let i = 0; i < (e ? 10 : 0); i++) K3.dot(l, -60 + (i % 3) * 50, -300 + Math.floor(i / 3) * 90, 9, i + 7); const rz = K.razor(g, 1.3); H.set(rz, { x: e ? 600 : 500, y: e ? 1150 : 500, r: 80 }); });
P("11d", "…le soleil…", (g, e) => { S.street(g); const su = K3.sunBig(g, 110); H.set(su, { x: 820, y: 260 }); const f = S.woman(g, 470, 1000, 1.6, { spots: e ? 2 : 0, hair: "braids", turn: .5 }); if (e) f.sp.forEach(d => H.set(d, { s: 1.3 })); });
P("11e", "…ou les hormones…", (g, e) => { const f = S.woman(g, 540, 860, 1.7, { spots: 0, hair: "bun", turn: -.3 }); const b = S.blister(g, 540, 1300, 1.2); if (e) { [[-60, 120, 26], [60, 120, 22], [0, 100, 18]].forEach(([x, y, r], i) => K3.dot(f.hd, x, y, r, i + 9)); } });
P("11f", "…elle en fabrique trop…", (g, e) => { const s = sec(g, 560, { grains: 1 }); if (e) extra(s, 22); const dl = K4.dial(g, 880, 300, 110); H.set(dl.nd, { r: e ? 75 : -60 }); });
P("11g", "…à cet endroit précis.", (g, e) => { const f = S.woman(g, 540, 860, 2.0, { spots: 0, hair: "bob", turn: .3 }); const d = K3.dot(f.hd, 80, 50, 26, 3); if (e) { const c = f.pt(80, 50); K.ring(g, c[0], c[1], 110, Q.cream, 12); } else H.set(d, { s: .6 }); });

/* 12 · coincée */
P("12a", "Cette mélanine reste coincée sous la peau.", (g, e) => { const s = sec(g, 560, { grains: 4, top: 700 }); if (e) { for (let i = 0; i < 9; i++) H.rrect(g, 60 + i * 120, surfY(s) - 20, 20, 120, "#2A211D", { r: 6, jit: 0, th: 4 }); H.rrect(g, 0, surfY(s) + 60, 1080, 20, "#2A211D", { r: 6, jit: 0, th: 4 }); S.lock(g, 540, surfY(s) - 80, 1.3); } });

/* 13 · peau foncée réagit plus fort */
P("13a", "Et sur une peau mate ou noire, elle réagit souvent plus fort.", (g, e) => { const A = K4.patch(g, 290, 1000, 220, 0, { skin: "#D9A67E" }), B = K4.patch(g, 790, 1000, 220, 0); [290, 790].forEach(x => S.bolt(g, x, e ? 650 : 350, .8)); if (e) { K3.dot(A, 0, 0, 22, 3); for (let i = 0; i < 7; i++) K3.dot(B, (i % 3 - 1) * 60 + (i > 5 ? 0 : 0), (Math.floor(i / 3) - 1) * 60, 30, i + 3); } });

/* 14 · des mois / surface */
P("14a", "C'est pour ça que la tache reste des mois…", (g, e) => { S.bathWall(g); S.cal(g, 870, 330, .7, e ? 6 : 0); const m = S.mirror(g, 470, 640, 560, 720); S.woman(m.inner, 0, 40, 1.15, { spots: 3, hair: "afro", turn: .5 }); m.shine(); S.counter(g); });
P("14b", "…et qu'un produit de surface n'y change rien.", (g, e) => { const s = sec(g, 560, { grains: 3, top: 820 }); if (e) cream(s, 520); else { const h = S.hand(g, 540, surfY(s) - 260, 1.2, 180, { point: true }); } });

/* 15 · pas éclaircir */
P("15a", "Le but n'est donc pas d'éclaircir ta peau.", (g, e) => { S.bathWall(g); S.counter(g, 1150); const j = K.jar(g, "#FBF6EA", 1.8); H.set(j, { x: 540, y: 1000 }); S.txt(j, "ÉCLAIRCISSANT", 0, 12, 26, Q.blk); if (e) S.cross(g, 540, 960, 260); });

/* 16 · réguler */
P("16a", "C'est de réguler ta production de mélanine…", (g, e) => { const s = sec(g, 560, { grains: 1 }); if (!e) extra(s, 18); const dl = K4.dial(g, 540, 300, 150); H.set(dl.nd, { r: e ? -65 : 70 }); });
P("16b", "…pour qu'à chaque agression, ta peau n'en fabrique plus trop…", (g, e) => { const s = sec(g, 560, { grains: 1 }); S.bolt(g, 540, e ? surfY(s) - 150 : 200, 1.2); if (e) extra(s, 3); const dl = K4.dial(g, 880, 300, 100); H.set(dl.nd, { r: e ? -50 : -65 }); });
P("16c", "…et ne te gâche plus le teint tous les jours.", (g, e) => { S.bathWall(g); const m = S.mirror(g, 540, 620, 620, 760); const f = S.woman(m.inner, 0, 40, 1.25, { spots: 4, hair: "braids", turn: .3 }); f.sp.forEach(d => H.set(d, { o: e ? 0 : .5 })); m.shine(); S.counter(g, 1150); if (e) for (let i = 0; i < 7; i++) { H.rrect(g, 110 + i * 125, 1230, 100, 100, "#F7EFD6", { r: 10, jit: 0, th: 6 }); S.check(g, 160 + i * 125, 1290, 34); } });

/* 17 · imagine */
P("17a", "Imagine que tu puisses enfin faire partir ces taches.", (g, e) => { S.bathWall(g); const m = S.mirror(g, 540, 620, 620, 760); const f = S.woman(m.inner, 0, 40, 1.25, { spots: 6, hair: "afro", turn: -.4, tilt: e ? 4 : 0 }); f.sp.forEach(d => H.set(d, { o: e ? 0 : 1 })); m.shine(); S.counter(g, 1150); });

/* 18 · pas brûler, pas gommer, freiner */
P("18a", "Pas avec un produit qui brûle…", (g, e) => { const f = S.woman(g, 540, 860, 1.9, { spots: 5, hair: "bob", turn: .3 }); const b = K3.bottle2(g, "#C8392B", "PEEL", .9); H.set(b, { x: 860, y: 1250 }); if (e) { S.redness(f, 70, 50, 120, .55); S.redness(f, -70, 50, 100, .45); for (let i = 0; i < 8; i++) H.poly(f.hd, [[0, 0], [22, 6], [8, 20]].map(([x, y]) => [x - 120 + (i * 37) % 240, y - 10 + (i * 53) % 120]), "#E8C9A0", { jit: 0, th: 2 }); S.cross(g, 860, 420, 120); } });
P("18b", "…pas avec un gommage magique…", (g, e) => { const j = S.scrub(g, 540, 1000, 0, 1.8); S.txt(j, "MIRACLE", 0, 30, 34, Q.blk); for (let i = 0; i < 6; i++) { const st = H.grp(g, 540 + Math.cos(i) * 320, 760 + Math.sin(i * 1.7) * 160, { j: .5 }); H.poly(st, H.star(0, 0, 14, 38, 4), Q.yellow, { jit: 0, th: 4 }); } if (e) S.cross(g, 540, 900, 300); });
P("18c", "…mais avec une solution qui freine la fabrication de pigment, à la source.", (g, e) => { const s = sec(g, 560, { grains: 1 }); if (!e) extra(s, 14); S.serumDrop(g, 540, e ? s.cy - 60 : 220, 1.6); });

/* 19 · 4 actifs */
P("19a", "Pour ça, il y a quatre actifs dont tu as besoin.", (g, e) => { const cols = ["#E2B13C", "#C8392B", "#F3E6C8", "#CF9A72"]; cols.forEach((c, i) => { const b = K3.bottle2(g, c, ["AZÉL.", "ARBUT.", "TRANÉX.", "NIACIN."][i], 1.0); H.set(b, { x: 180 + i * 240, y: e ? 700 : 1000 }); if (e) S.serumDrop(g, 180 + i * 240, 1000, 1.0); }); if (e) sign(g, "4 ACTIFS", 260, 110); });

/* 20–23 · actifs */
P("20a", "L'acide azélaïque, à dix pour cent…", (g, e) => { wheat(g, 400, 1000, 2.2); wheat(g, 680, 1050, 1.8); if (e) sign(g, "ACIDE AZÉLAÏQUE\n10 %"); });
P("20b", "…freine la production de mélanine.", (g, e) => { const s = sec(g, 560, { grains: 1 }); if (!e) extra(s, 16); else for (let i = 0; i < 5; i++) S.serumDrop(g, cellX(s, i), s.cy - 120, .9); });
P("21a", "L'alpha-arbutine…", (g, e) => { berry(g, 380, 1000, 2.0); berry(g, 700, 1080, 1.6); if (e) sign(g, "ALPHA-ARBUTINE"); });
P("21b", "…bloque la tirozinase, l'enzyme qui lance cette fabrication.", (g, e) => { const en = H.grp(g, 420, 900, { j: 0 }), pts = []; for (let i = 0; i <= 26; i++) { const a = .5 + i / 26 * (Math.PI * 2 - 1); pts.push([Math.cos(a) * 170, Math.sin(a) * 170]); } pts.push([0, 0]); H.poly(en, pts, "#F5D6A1", { jit: 1, th: 10 }); S.txt(en, "TIROZINASE", 0, 230, 46, Q.blk); for (let i = 0; i < (e ? 2 : 6); i++) K3.dot(g, 620 + i * 80, 900, 26, i + 3, MEL); if (e) { const h = H.grp(g, 560, 900, { j: 0 }); H.poly(h, H.star(0, 0, 50, 50, 3).map(([x, y]) => [x, y]), Q.green, { jit: 0, th: 6 }); const pts2 = []; for (let i = 0; i < 6; i++) { const a = i / 6 * 6.283; pts2.push([Math.cos(a) * 60, Math.sin(a) * 60]); } H.poly(h, pts2, "#4E7F55", { jit: 0, th: 6 }); S.txt(h, "ARBUTINE", 0, 120, 34, Q.greenD); } });
P("22a", "L'acide tranéxamique…", (g, e) => { if (e) sign(g, "ACIDE TRANÉXAMIQUE", 300, 84); const b = K3.bottle2(g, "#F3E6C8", "TRANÉX.", 1.6); H.set(b, { x: 540, y: 1000 }); });
P("22b", "…agit sur les taches tenaces, celles qui ne partent jamais vraiment.", (g, e) => { const s = sec(g, 360, { grains: 1, top: 900 }); const r = H.rng(5); for (let i = 0; i < (e ? 6 : 24); i++) K3.dot(s.g, 540 + (r() - .5) * 260, s.y0 + 480 + r() * 200, 13, i + 70, MEL); if (e) for (let i = 0; i < 3; i++) S.serumDrop(g, 420 + i * 120, 980, 1.0); });
P("23a", "Et la niacinamide, à cinq pour cent…", (g, e) => { if (e) sign(g, "NIACINAMIDE\n5 %"); const b = K3.bottle2(g, "#CF9A72", "NIACIN.", 1.6); H.set(b, { x: 540, y: 1000 }); });
const bricks = (g, s) => { for (let r = 0; r < 2; r++) for (let i = 0; i < 8; i++) H.rrect(g, -60 + i * 150 + (r % 2) * 75, surfY(s) - 70 - r * 60, 140, 54, "#D9A482", { r: 6, jit: 0, th: 6 }); };
P("23b", "…renforce ta barrière cutanée…", (g, e) => { const s = sec(g, 600, { grains: 1 }); if (e) bricks(g, s); });
P("23c", "…pour que ta peau réagisse moins…", (g, e) => { const s = sec(g, 600, { grains: 1 }); bricks(g, s); S.bolt(g, e ? 760 : 540, e ? 280 : surfY(s) - 260, 1.1, e ? 40 : 0); if (e) for (let i = 0; i < 3; i++) H.el("path", { d: `M${600 + i * 30},${surfY(s) - 160 - i * 30} l60,-60`, stroke: "#6b543a", "stroke-width": 8, "stroke-linecap": "round" }, g); });
P("23d", "…et que les taches reviennent moins.", (g, e) => { S.street(g); const su = K3.sunBig(g, 110); H.set(su, { x: 820, y: 260 }); S.woman(g, 470, 1000, 1.6, { spots: 0, hair: "afro", turn: .5 }); if (e) S.check(g, 200, 520, 100); });

/* 24 · trop de produits */
P("24a", "Il existe plusieurs produits capables de faire partir tes taches.", (g, e) => { H.rrect(g, -60, -60, 1200, 2040, "#E4D3B0", { r: 0, sh: false, jit: 0 }); const rows = K3.shelfRows(g, e ? 4 : 2, { y0: 420 }); });
P("24b", "Mais tu n'as pas besoin de dix flacons différents…", (g, e) => { S.bathWall(g); const sh = H.grp(g, 540, 800, { j: 0 }); sh._b.r = e ? 4 : 0; H.rrect(sh, -480, 0, 960, 26, "#8A5A3C", { r: 4, jit: 0, th: 7 }); const cols = [Q.green, Q.blue, "#D8C79E", Q.pink, "#C8A060"]; for (let i = 0; i < (e ? 10 : 4); i++) { const b = K3.bottle2(sh, cols[i % 5], "", .55); H.set(b, { x: -420 + i * 93, y: -64 }); } });
P("24c", "…ni d'un produit hors de prix.", (g, e) => { const L = e ? 1300 : 420, t = H.grp(g, 540, 280, { j: 0 }); H.rrect(t, -170, 0, 340, L, "#FBF6EA", { r: 4, jit: 0, th: 6 }); for (let i = 0; i < L / 70 - 2; i++) H.rrect(t, -130, 50 + i * 70, 200 + (i % 3) * 20, 14, "#C9BFAE", { r: 4, jit: 0, sh: false, th: 0 }); S.txt(t, e ? "TOTAL 189,90 €" : "TOTAL 39,90 €", 0, L - 40, 44, Q.blk); });

/* 25 · MELA */
P("25a", "Le Sérum Anti-Taches, Méla Skin…", (g, e) => { const lf = K3.leafBurst(g, 12, 330); H.set(lf, { x: 540, y: 900 }); bottleM(g, 540, 900, 1.45); if (!e) for (let i = 0; i < 6; i++) H.poly(g, [[-120, -1000], [120, -1000], [160, 1000], [-160, 1000]].map(([x, y]) => [x + 90 + i * 180, y + 960]), i % 2 ? "#2A211D" : "#EFE6D2", { jit: 4, seed: i, th: 6 }); });
P("25b", "…réunit tous les actifs dont tu as besoin…", (g, e) => { bottleM(g, 540, 960, 1.45); if (e) ["AZÉLAÏQUE", "ARBUTINE", "TRANÉXAMIQUE", "NIACINAMIDE"].forEach((t, i) => K3.sign(g, t, [250, 830, 250, 830][i], [480, 560, 1180, 1240][i], { size: 46, maxw: 330 })); });
P("25c", "…en un seul flacon.", (g, e) => { S.bathWall(g); const sh = H.grp(g, 540, 900, { j: 0 }); H.rrect(sh, -480, 0, 960, 26, "#8A5A3C", { r: 4, jit: 0, th: 7 }); if (!e) { const cols = [Q.green, Q.blue, "#D8C79E", Q.pink, "#C8A060"]; for (let i = 0; i < 10; i++) { const b = K3.bottle2(sh, cols[i % 5], "", .55); H.set(b, { x: -420 + i * 93, y: -64 }); } } else { const b = K.bottle(sh, .8); H.set(b, { x: 0, y: -230 }); } });

/* 26 · 94 % */
P("26a", "Quatre-vingt-quatorze pour cent de celles qui l'ont testé…", (g, e) => { const tones = ["#D9A67E", "#B98258", "#A06A44", "#7C4A30", "#5A3524"]; for (let i = 0; i < 100; i++) { const on = e && i < 94; const f = S.woman(g, 150 + (i % 10) * 87, 430 + Math.floor(i / 10) * 92, .19, { skin: on ? tones[i % 5] : "#B8AE9C", hairc: on ? K3.HAIRC : "#8F877A", cloth: on ? Q.green : "#9A9384", hair: ["afro", "bun", "bob", "braids"][i % 4] }); } if (e) sign(g, "94 %", 200, 140); });
P("26b", "…le recommandent à leur entourage.", (g, e) => { S.woman(g, 300, 980, 1.1, { hair: "afro", turn: .5 }); S.woman(g, 790, 980, 1.1, { hair: "braids", turn: -.5 }); if (e) { bottleM(g, 470, 1150, .6); const bb = H.grp(g, 560, 420, { j: 0 }); H.rrect(bb, -200, -90, 400, 180, "#FBF6EA", { r: 60, jit: 0, th: 6 }); H.poly(bb, [[-60, 80], [-20, 80], [-90, 150]], "#FBF6EA", { jit: 0, th: 0, sh: false }); S.txt(bb, "ESSAIE ÇA !", 0, 20, 56, Q.blk); } });

/* 27 · offre */
P("27a", "Et cette semaine, pour deux flacons achetés, tu en reçois un offert.", (g, e) => { const bx = H.grp(g, 540, 1150, { j: 0 }); H.rrect(bx, -380, -120, 760, 400, "#B98A5C", { r: 8, jit: 0, th: 10, corr: true }); if (!e) H.rrect(bx, -380, -170, 760, 70, "#A9804F", { r: 6, jit: 0, th: 6 }); else { [-230, 0, 230].forEach((x, i) => bottleM(bx, x, -280, .95)); K3.sign(g, "OFFERT", 770, 580, { size: 60, maxw: 280, fill: "#C8392B" }); H.poly(bx, [[-380, -120], [-460, -330], [-300, -120]], "#A9804F", { jit: 0, th: 6 }); H.poly(bx, [[380, -120], [460, -330], [300, -120]], "#A9804F", { jit: 0, th: 6 }); } });

/* 28 · garantie */
P("28a", "Toujours sceptique ?", (g, e) => { const f = S.woman(g, 540, 820, 1.7, { spots: 3, hair: "bun", turn: .4, tilt: e ? 9 : 0 }); [-1, 1].forEach(sg => H.rrect(g, 540 - 330, 1350 + sg * 40, 660, 110, sg > 0 ? S.SK : K3.CLOTH, { r: 55, jit: 0, th: 7 })); if (e) { const q = K.q(g, .55); H.set(q, { x: 860, y: 360 }); } });
P("28b", "Très bien, garantie satisfait ou remboursé de quatre-vingt-dix jours.", (g, e) => { H.rrect(g, 170, 600, 740, 900, "#FBF6EA", { r: 10, jit: 0, th: 8 }); for (let i = 0; i < 6; i++) H.rrect(g, 240, 700 + i * 60, 600 - (i % 2) * 120, 16, "#D9CFBD", { r: 4, jit: 0, sh: false, th: 0 }); const st = H.grp(g, 540, e ? 1080 : 520, { j: 0 }); H.rrect(st, -60, -260, 120, 200, "#6b543a", { r: 30, jit: 0, th: 8 }); H.rrect(st, -180, -60, 360, 70, "#2A211D", { r: 10, jit: 0, th: 6 }); if (e) { const sp = H.grp(g, 540, 1260, { j: 0 }); sp._b.r = -8; H.rrect(sp, -260, -80, 520, 160, "none", { r: 20, jit: 1, sh: false, th: 0, attr: { stroke: "#C8392B", "stroke-width": 12 } }); S.txt(sp, "GARANTIE 90 JOURS", 0, 22, 62, "#C8392B"); } });

/* 29 · remboursement */
P("29a", "Si tu as encore des taches au bout de trois mois…", (g, e) => { [0, 1, 2].forEach(i => S.cal(g, 220 + i * 320, 900, .78, i, e ? [[0, 0], [0, 1], [0, 2], [1, 0], [1, 1], [1, 2], [2, 0], [2, 1]] : null)); if (e) K.arrow(g, 140, 1250, 940, 1250, Q.red, 40); });
P("29b", "…on te rembourse.", (g, e) => { const ph = S.phone(g, 540, 900, 1.2); if (e) { H.rrect(ph.q, -150, -260, 300, 150, "#FFFFFF", { r: 24, jit: 0, th: 5 }); S.txt(ph.q, "REMBOURSEMENT", 0, -200, 34, Q.blk); S.txt(ph.q, "EFFECTUÉ ✓", 0, -150, 34, Q.greenD); const c = K3.coin(g, 70); H.set(c, { x: 860, y: 560 }); } });

/* 30 · CTA */
P("30a", "Clique sur le bouton ci-dessous et commande ton Sérum Anti-Taches.", (g, e) => { const ph = S.phone(g, 540, 1000, 1.3); bottleM(ph.q, 0, -120, .7); H.rrect(ph.q, -140, 200, 280, 90, "#C8392B", { r: 40, jit: 0, th: e ? 2 : 8 }); S.txt(ph.q, "COMMANDER", 0, 262, 44, Q.cream); const h = S.hand(g, 600, e ? 1430 : 1640, 1.3, -10, { point: true }); });

window.SBLIST = SB.map(s => s.id);
window.drawSB = (id, end) => { const root = document.getElementById("scenes"); root.innerHTML = ""; H.cur = []; const reg = H.cur, g = H.grp(root, 0, 0, { j: 0 }); SB.find(s => s.id === id).f(g, end); H.STEP = 0; H.applyAll(reg); H.cur = null; };
window.SBVO = Object.fromEntries(SB.map(s => [s.id, s.vo]));
window._res(true);
