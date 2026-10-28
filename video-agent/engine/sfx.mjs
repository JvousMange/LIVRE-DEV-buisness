// Sound design « papier / carton » synthétisé par code (déterministe).
// Principes : 1) hiérarchie — peu de sons, chacun a une raison (moments clés > mouvements > décoration) ;
// 2) tous les sons tonals sont dans la même gamme (do pentatonique) : les enchaînements sonnent juste ;
// 3) matières crédibles (papier qui glisse, carton qui claque, bois, cloche, métal) plutôt que des bips ;
// 4) une petite réverb commune pour coller les sons dans un même espace ; 5) le mixage final (build.mjs) les efface sous la voix.
import { writeFileSync } from "node:fs";

const SR = 44100;
const TAU = Math.PI * 2;
const lcg = (seed) => { let s = (seed >>> 0) || 1; return () => ((s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296) * 2 - 1; };
const SCALE = [523.25, 587.33, 659.25, 783.99, 880.0, 1046.5];             // do ré mi sol la do
const DEG = [0, 2, 4, 1, 3, 5, 2, 4];                                       // ordre mélodique des pops isolés

// filtre à variable d'état (passe-bande), f en Hz
const bandpass = (q = 1.2) => { let low = 0, band = 0; return (x, f) => { const F = 2 * Math.sin((Math.PI * Math.min(f, 9000)) / SR); low += F * band; const high = x - low - band / q; band += F * high; return band; }; };
const lowpass1 = (k) => { let y = 0; return (x) => (y += k * (x - y)); };
const exp = (t, r) => Math.exp(-t * r);
const hann = (u) => (u <= 0 || u >= 1 ? 0 : Math.sin(Math.PI * u) ** 2);

// Chaque son : { d: durée (s), g: gain, make(ev, seed) → (t, i) → échantillon }
const SOUNDS = {
  // Palette « impacts » (mesurée sur Cloudless : ~77 % de l'énergie des silences entre 30 et 150 Hz, très peu de notes) :
  // un corps grave qui chute en hauteur + une claque brillante très courte. Trois tailles : pop (petit), thud (moyen), stamp (gros).
  // famille « pop » : quatre timbres (impact léger, bois, goutte, tap de papier) pour ne jamais entendre deux fois de suite le même
  pop: { d: 0.3, g: 0.8, make: (ev, seed) => { const P = ev.p ?? 1, v = (ev.v ?? 0) % 4, n = lcg(seed + 3), bp = bandpass(2), bp3 = bandpass(1.5), lp = lowpass1(0.05); let ph = 0, ph2 = 0;
    if (v === 1) return (t) => { ph += (TAU * 340 * P * (1 + 0.5 * exp(t, 70))) / SR; ph2 += (TAU * 340 * P * 2.76) / SR; return (Math.sin(ph) * exp(t, 26) + 0.3 * Math.sin(ph2) * exp(t, 60)) * Math.min(1, t / 0.0015) * 1.1 + bp(n(), 2600) * exp(t, 160) * 0.3; };
    if (v === 2) return (t) => { ph += (TAU * 260 * P * (1 + 1.6 * (1 - exp(t, 45)))) / SR; return Math.sin(ph) * exp(t, 20) * Math.min(1, t / 0.004) * 1.0; };
    if (v === 3) return (t) => { ph += (TAU * 120 * P) / SR; return bp(n(), 2300 * P) * exp(t, 75) * 1.3 + Math.sin(ph) * exp(t, 30) * 0.7 + bp3(n(), 400) * exp(t, 50) * 0.5; };
    return (t) => { ph += (TAU * (72 + 80 * exp(t, 38)) * P) / SR; return Math.sin(ph) * exp(t, 12) * Math.min(1, t / 0.003) * 0.9 + lp(n()) * exp(t, 45) * 0.8 + bp3(n(), 300) * exp(t, 40) * 1.2 + bp(n(), 3800) * exp(t, 110) * 0.55; }; } },
  // chiffre / numéro : petite note de marimba, qui MONTE avec le numéro (1 → 5)
  num: { d: 0.6, g: 0.55, make: (ev) => { const f0 = SCALE[(ev.n ?? 0) % 6] * (ev.p ?? 1); let a = 0, b = 0;
    return (t) => { a += (TAU * f0) / SR; b += (TAU * f0 * 4) / SR; return (Math.sin(a) * exp(t, 7.5) + 0.35 * Math.sin(b) * exp(t, 28)) * Math.min(1, t / 0.002) + (t < 0.01 ? Math.sin(TAU * 2200 * t) * 0.3 * exp(t, 400) : 0); }; } },
  // point d'interrogation : « pim » — pincement aigu et rond
  pim: { d: 0.5, g: 0.6, make: (ev) => { const f0 = 1174.7 * (ev.p ?? 1); let a = 0, b = 0;
    return (t) => { a += (TAU * f0 * (1 + 0.06 * exp(t, 40))) / SR; b += (TAU * f0 * 2.0) / SR; return (Math.sin(a) * exp(t, 13) + 0.25 * Math.sin(b) * exp(t, 30)) * Math.min(1, t / 0.0015); }; } },
  // « tum » : pulsation sourde et légère (arrivée des produits) — un grain de basse, très court
  tum: { d: 0.3, g: 0.5, make: (ev, seed) => { const P = ev.p ?? 1, n = lcg(seed + 2), lp = lowpass1(0.05); let ph = 0;
    return (t) => { ph += (TAU * (62 + 38 * exp(t, 30)) * P) / SR; return Math.sin(ph) * exp(t, 15) * Math.min(1, t / 0.004) + lp(n()) * exp(t, 60) * 0.35; }; } },
  blop: { d: 0.3, g: 0.55, make: (ev, seed) => { const n = lcg(seed + 5), lp = lowpass1(0.04); let ph = 0;
    return (t) => { ph += (TAU * (66 + 50 * exp(t, 22))) / SR; return Math.sin(ph) * exp(t, 10) * Math.min(1, t / 0.005) + lp(n()) * exp(t, 30) * 0.4; }; } },
  // petite pluie de claquements secs (rafale de taches / granules) : un seul son pour tout le groupe
  scatter: { d: 0.5, g: 0.8, make: (ev, seed) => { const n = lcg(seed + 8), bp = bandpass(3), lp = lowpass1(0.05); let ph = 0; const T = [0, 0.07, 0.15, 0.22, 0.3];
    return (t) => { ph += (TAU * (70 + 70 * exp(t, 36))) / SR; let y = Math.sin(ph) * exp(t, 11) * 0.8 + lp(n()) * exp(t, 40) * 0.6;
      for (const t0 of T) if (t > t0) y += bp(n(), 2600 + 1400 * ((t0 * 37) % 1)) * exp(t - t0, 130) * 0.45; return y; }; } },
  tick: { d: 0.1, g: 0.4, make: (ev, seed) => { const n = lcg(seed + 11), bp = bandpass(5); return (t) => bp(n(), 2400) * exp(t, 110) * 1.5; } },
  // choc de carton : coup de sub profond + corps bruité 100–600 Hz + claque
  thud: { d: 0.7, g: 1.0, make: (ev, seed) => { const n = lcg(seed + 5), lp = lowpass1(0.05), bp = bandpass(1.2), bp2 = bandpass(2); let ph = 0;
    return (t) => { ph += (TAU * (64 + 100 * exp(t, 24))) / SR; return Math.sin(ph) * exp(t, 6.5) * 1.0 + lp(n()) * exp(t, 14) * 1.3 + bp(n(), 330) * exp(t, 20) * 1.8 + bp2(n(), 4200) * exp(t, 90) * 0.5; }; } },
  // tampon / croix : plus gros — boom, claque brillante, queue grave
  // tampon / croix : trois caractères (boom de carton, coup de bois, gomme sourde) — jamais deux fois le même d'affilée
  stamp: { d: 0.8, g: 1.1, make: (ev, seed) => { const P = ev.p ?? 1, v = (ev.v ?? 0) % 3, n = lcg(seed + 6), lp = lowpass1(0.04), bp = bandpass(1), bp2 = bandpass(1.5); let ph = 0, ph2 = 0;
    if (v === 1) return (t) => { ph += (TAU * (70 + 90 * exp(t, 26)) * P) / SR; ph2 += (TAU * 210 * P) / SR; return Math.sin(ph) * exp(t, 8) * 0.9 + Math.sin(ph2) * exp(t, 26) * 0.8 + bp(n(), 1500 * P) * exp(t, 70) * 0.8 + lp(n()) * exp(t, 20) * 0.9; };
    if (v === 2) return (t) => { ph += (TAU * (50 + 70 * exp(t, 16)) * P) / SR; return Math.sin(ph) * exp(t, 5) * 1.2 + lp(n()) * exp(t, 9) * 1.5 + bp2(n(), 2600) * exp(t, 100) * 0.45; };
    return (t) => { ph += (TAU * (58 + 110 * exp(t, 20)) * P) / SR; return Math.sin(ph) * exp(t, 5.5) * 1.1 + lp(n()) * exp(t, 11) * 1.4 + bp(n(), 360) * exp(t, 24) * 1.6 + bp2(n(), 5200) * exp(t, 70) * 0.7; }; } },
  // cloche douce, discrète (validation)
  // « shling » de coche : deux cloches qui montent + un voile d'aigus qui scintille
  ding: { d: 1.1, g: 0.4, make: (ev, seed) => { const P = ev.p ?? 1, n = lcg(seed + 31), bp = bandpass(1.5); let a = 0, b = 0, c = 0, d = 0;
    return (t) => { const t2 = t - 0.055; a += (TAU * 1568 * P) / SR; b += (TAU * 1568 * P * 2.76) / SR; c += (TAU * 2093 * P) / SR; d += (TAU * 2093 * P * 2.76) / SR;
      let y = (Math.sin(a) + 0.25 * Math.sin(b)) * exp(t, 12) * Math.min(1, t / 0.002);
      if (t2 > 0) y += (Math.sin(c) + 0.3 * Math.sin(d)) * 1.15 * exp(t2, 5.5) * Math.min(1, t2 / 0.002);
      return y + bp(n(), 5500 + 3500 * Math.min(1, t / 0.25)) * (t < 0.4 ? exp(t, 8) : 0) * 0.5; }; } },
  // « shling » de pièce : frappe métallique double + glissé brillant
  coin: { d: 0.8, g: 0.4, make: (ev, seed) => { const P = (ev.p ?? 1), n = lcg(seed + 33), bp = bandpass(2); let a = 0, b = 0, c = 0;
    return (t) => { a += (TAU * 2349 * P) / SR; b += (TAU * 3136 * P) / SR; c += (TAU * 6272 * P) / SR; const t2 = t - 0.06;
      let y = (Math.sin(a) + 0.3 * Math.sin(a * 2.3)) * exp(t, 16) * Math.min(1, t / 0.001);
      if (t2 > 0) y += (Math.sin(b) * 1.1 + 0.3 * Math.sin(c)) * exp(t2, 7) * Math.min(1, t2 / 0.001);
      return y + bp(n(), 4800 + 4200 * Math.min(1, t / 0.3)) * exp(t, 10) * 0.35; }; } },
  beep: { d: 0.4, g: 0.22, make: () => { let ph = 0; return (t) => { ph += (TAU * (t < 0.2 ? 660 : 880)) / SR; return (Math.sin(ph) * 0.8 + Math.sin(ph * 2) * 0.1) * (t < 0.38 ? 1 : 0) * Math.min(1, t * 150); }; } },
  // « swipe » de papier : rafale brillante très courte et nette, attaque rapide, queue qui meurt (les traînées verticales vues dans leur spectre)
  // glissement de papier : trois caractères (swipe brillant, souffle grave, petit coup de poignet)
  whoosh: { d: 0.5, g: 0.75, make: (ev, seed) => { const P = ev.p ?? 1, v = (ev.v ?? 0) % 3, n = lcg(seed + 7), bp = bandpass(0.8);
    const D = v === 1 ? 0.45 : v === 2 ? 0.2 : 0.3;
    return (t) => { const u = t / D; const env = v === 1 ? hann(u) : (u < 0.18 ? u / 0.18 : exp(t - 0.18 * D, 11)); const f = v === 1 ? 500 + 1700 * Math.sin(Math.PI * Math.min(1, u)) : 1800 + 5200 * Math.min(1, u * 1.6);
      return bp(n(), f * P) * env * 1.8 * (t < D ? 1 : 0); }; } },
  swish: { d: 0.3, g: 0.5, make: (ev, seed) => { const P = ev.p ?? 1, v = (ev.v ?? 0) % 3, n = lcg(seed + 9), bp = bandpass(0.9); const D = v === 1 ? 0.28 : 0.2;
    return (t) => { const u = t / D; let env = u < 0.25 ? u / 0.25 : exp(t - 0.25 * D, 14); if (v === 2) env *= 0.6 + 0.4 * Math.abs(Math.sin(TAU * 11 * t)); const f = v === 1 ? 900 + 2600 * Math.min(1, u) : 2400 + 4000 * Math.min(1, u * 1.4);
      return bp(n(), f * P) * env * 1.6 * (t < D ? 1 : 0); }; } },
  flip: { d: 0.16, g: 0.55, make: (ev, seed) => { const n = lcg(seed + 17), bp = bandpass(0.8);
    return (t) => bp(n(), 3600) * (exp(t, 45) * 1.6 + (t > 0.045 ? exp(t - 0.045, 60) : 0) * 0.8) * Math.min(1, t / 0.001); } },
  rise: { d: 1.2, g: 0.5, make: (ev, seed) => { const n = lcg(seed + 13), bp = bandpass(1.4); let ph = 0; const D = 1.2;
    return (t) => { const u = Math.min(1, t / D); ph += (TAU * (90 + 700 * u * u)) / SR; return (bp(n(), 300 + 5200 * u * u) * 1.6 + Math.sin(ph) * 0.3) * (u * u) * (u < 0.96 ? 1 : (1 - u) / 0.04); }; } },
  zap: { d: 1.2, g: 0.8, make: (ev, seed) => { const n = lcg(seed + 21), bp = bandpass(1.2), lp = lowpass1(0.012); let ph = 0, ph2 = 0; const r = lcg(seed + 4);
    const bursts = [0, 0.03, 0.075, 0.11, 0.17, 0.24].map((b) => b + Math.abs(r()) * 0.01);
    return (t) => { let g = 0; for (const b of bursts) if (t >= b && t < b + 0.035) g = Math.max(g, 1 - (t - b) / 0.035);
      ph += (TAU * (140 + 1500 * exp(t, 14))) / SR; ph2 += (TAU * (58 + 40 * exp(t, 6))) / SR;
      return bp(n(), 3600) * g * 1.8 + Math.sin(ph) * exp(t, 12) * 0.4 + Math.sin(ph2) * exp(t, 3) * 0.9 + lp(n()) * exp(t, 3.2) * 6 * Math.min(1, t / 0.02); }; } },
};

// Petite réverb (Schroeder) : colle les sons dans un même espace.
function reverb(buf, wet = 0.14) {
  const mk = (ms, fb) => ({ d: Math.round((ms / 1000) * SR), fb, b: new Float32Array(Math.round((ms / 1000) * SR)), i: 0, lp: 0 });
  const combs = [mk(29.7, 0.74), mk(37.1, 0.72), mk(41.1, 0.7), mk(43.7, 0.68)], aps = [mk(5, 0.5), mk(1.7, 0.5)];
  const out = new Float32Array(buf.length);
  for (let i = 0; i < buf.length; i++) {
    const x = buf[i]; let y = 0;
    for (const c of combs) { const v = c.b[c.i]; c.lp += 0.45 * (v - c.lp); c.b[c.i] = x + c.lp * c.fb; c.i = (c.i + 1) % c.d; y += v; }
    y *= 0.25;
    for (const a of aps) { const v = a.b[a.i]; const w = y + v * a.fb; a.b[a.i] = w; a.i = (a.i + 1) % a.d; y = v - w * a.fb; }
    out[i] = x + y * wet * 4;
  }
  return out;
}

// events : [{ t, type, gain?, n? }] → WAV mono 16 bits.
export function renderSfx(events, duration, outFile) {
  let buf = new Float32Array(Math.ceil((duration + 1.5) * SR));
  events.forEach((ev, idx) => {
    const S = SOUNDS[ev.type];
    if (!S) return;
    const fn = S.make(ev, 1000 + idx * 31), start = Math.round(ev.t * SR), g = S.g * (ev.gain ?? 1);
    for (let i = 0, n = Math.round(S.d * SR); i < n && start + i < buf.length; i++) {
      if (start + i < 0) continue;
      buf[start + i] += fn(i / SR, i) * g;
    }
  });
  buf = reverb(buf, 0.07);
  const pcm = Buffer.alloc(buf.length * 2);
  let peak = 0; for (const v of buf) peak = Math.max(peak, Math.abs(v));
  const k = peak > 0.9 ? 0.9 / peak : 1;
  for (let i = 0; i < buf.length; i++) pcm.writeInt16LE(Math.max(-32767, Math.min(32767, Math.round(buf[i] * k * 32767))), i * 2);
  const hdr = Buffer.alloc(44);
  hdr.write("RIFF", 0); hdr.writeUInt32LE(36 + pcm.length, 4); hdr.write("WAVEfmt ", 8); hdr.writeUInt32LE(16, 16); hdr.writeUInt16LE(1, 20); hdr.writeUInt16LE(1, 22);
  hdr.writeUInt32LE(SR, 24); hdr.writeUInt32LE(SR * 2, 28); hdr.writeUInt16LE(2, 32); hdr.writeUInt16LE(16, 34); hdr.write("data", 36); hdr.writeUInt32LE(pcm.length, 40);
  writeFileSync(outFile, Buffer.concat([hdr, pcm]));
}

// ───────────────────────── ENTONNOIR DE SONORISATION ─────────────────────────
// On part de TOUTES les animations (≈400 sons possibles) et on ne garde que ce qui mérite un son.
//  Q1  L'élément porte-t-il du SENS (idée nouvelle, verdict, preuve, impact) ? sinon → pas de son (décor : taches, granules, briques, points, texte sur pancarte…).
//  Q2  Est-il l'un d'une SÉRIE (10 produits, 8 cartes, 11 pages…) ? alors un son pour la série (le premier, et le dernier si elle dure), pas un par élément.
//  Q3  Un son plus important est-il déjà là (±0,35 s) ? alors on ne double pas (priorité : impact clé > entrée d'objet > coupe de plan).
//  Q4  Budget : 4 sons maximum par plan, pour que chacun soit entendu.
// priorités : 3 = moment clé (croix, éclair, STOP, ticket, validation), 2 = entrée d'objet principal, 1 = appoint
const KEYS = { ck: 3, x: 3, x_it: 3, xx: 3, cross: 3, bigx: 3, bl: 3, okc: 3, stop: 3, rc: 3, rcring: 3, off: 3, lock: 3, shield: 3, "gA-needle": 3, fire: 3, siren: 2, btn: 3, pg: 3, co: 2, q1: 1, "dots-r": 2 };
const MOVES = { hand: 2, arm: 2, armS: 2, armE: 2, rz: 2, bkw: 2, cal: 2, sun: 2, beam: 1, wallet: 2, faucet: 2, "enz-plug": 3, sc: 2, bottle: 2, b: 2, b3: 3, badge: 2, dose: 1, ring: 1, enz: 1, tb: 2, w: 2, cd: 2, it: 2, p: 2, ck: 2, nb: 1, pg: 1, rt: 2, "faucet-h": 3, stream: 1, mel: 1, scs: 1, rz2: 1 };
const SKIP = new Set(["pm", "ls", "knob", "sld", "gr", "sp", "pt", "ir", "as", "gp", "sf", "dr", "ps", "pb", "po", "fl", "sbb", "at", "foam", "spk", "sw", "d", "br", "arr", "ar", "lp", "fac", "stainW", "gA", "fire2", "signX", "liq", "beaker", "ok", "b1", "b2", "plus", "eq", "plus", "rcr", "rc2", "w0x"]);
const SERIES = new Set(["x_it", "cd", "w", "pg", "rt", "br", "dots-r", "d", "cal", "siren"]);
const BADGE_N = { skinRub: 1, mirror: 2, soinPeau: 3, products: 4, fiveSun: 5 };
export function eventsFromBeats(beats) {
  const raw = [];
  const cutRaw = [];
  for (const b of beats) {
    const add = (id, e) => raw.push({ ...e, beat: b.name, id, base: id.replace(/\d+$/, "") });
    for (const a of b.anims) {
      if (a.sfx === false) continue;
      const id = a.id.replace(/^b\d+-/, "");
      const t = b.t0 + a.t0;
      if (a.sfx) { (Array.isArray(a.sfx) ? a.sfx : [a.sfx]).forEach((x) => add(id, { t: t + (x.dt || 0), type: x.type || x, gain: x.gain })); continue; }
      const popLike = a.from && a.from.s === 0 && a.to && a.to.s === 1;
      const dropLike = a.from && a.from.y !== undefined && a.from.y <= -1000;
      if (dropLike) { add(id, { t: t + 0.02, type: "whoosh", gain: 0.55 }); add(id, { t: t + 0.42, type: "thud", gain: 0.7 }); }
      else if (popLike) {
        const type = /^(x|x_|x\d|xB|xL|xR|bigx|cross)/.test(id) ? "stamp" : /^(chk|ok|okc|ck)/.test(id) ? "ding" : /^fd\d+/.test(id) ? "blop" : "pop";
        add(id, { t: t + (type === "stamp" ? 0.12 : 0.03), type, gain: 1 });
      }
    }
    for (const x of b.sfx || []) add("(plan)", { t: b.t0 + x.t, type: x.type, gain: x.gain });
    if (b.t0 > 0.01) cutRaw.push({ t: b.t0 - 0.04, type: "swish", gain: 1, beat: b.name, id: "(plan)", base: "(plan)", pri: 1 });
  }
  const funnel = { brut: raw.length + cutRaw.length };

  // Q1 : sens ? — on retire le décor ; le rideau de taches devient UN grand geste, les rétractions UN souffle
  let kept = [];
  const bed = [];   // « tum tum » de fond : pulsation légère pendant que les produits s'empilent, exempte du tri
  const hasThud = new Set(raw.filter((e) => (e.base === "it" || e.base === "p") && e.type === "thud").map((e) => e.beat + e.id));
  const fd = raw.filter((e) => e.base === "fd");
  for (const e of raw) {
    if (e.base === "fd") continue;
    const k = e.id.replace(/^[a-z]*\d*-/, "") && e.base;
    if (e.base === "sign") { if (e.beat === "ninetyFour" && e.type === "thud") kept.push({ ...e, pri: 2 }); continue; }   // le texte sur pancarte n'a pas besoin de son (sauf le grand chiffre)
    if (SKIP.has(e.base)) continue;
    if (e.base === "badge") { kept.push({ ...e, type: "num", n: (BADGE_N[e.beat] ?? 1) - 1, pri: 2 }); continue; }
    if (e.base === "nb") { kept.push({ ...e, type: "num", n: Number(e.id.replace(/\D/g, "")) - 1, pri: 2 }); continue; }
    if (e.id === "q1") { kept.push({ ...e, type: "pim", pri: 3 }); continue; }
    if (e.base === "co") { kept.push({ ...e, type: "coin", t: e.t + 0.78, pri: 3, bed: false }); continue; }
    if (e.base === "ck" || e.base === "okc") { kept.push({ ...e, type: "ding", pri: 3 }); continue; }
    if (e.base === "it" || e.base === "p") {   // produits : une pulsation « tum » par arrivée (au moment où ils se posent), rien d'autre
      if (e.type === "thud") bed.push({ ...e, type: "tum", gain: 0.6 });
      else if (e.type !== "whoosh" || !hasThud.has(e.beat + e.id)) { if (!hasThud.has(e.beat + e.id) && !bed.some((b) => b.id === e.id && b.beat === e.beat)) bed.push({ ...e, type: "tum", t: e.t + 0.25, gain: 0.6 }); }
      continue;
    }
    const pri = KEYS[e.base] ?? KEYS[e.id] ?? MOVES[e.base] ?? MOVES[e.id] ?? (e.type === "rise" || e.type === "zap" || e.type === "stamp" || e.type === "ding" ? 3 : 1);
    kept.push({ ...e, pri });
  }
  if (fd.length) {
    const t0 = fd[0].t, t1 = fd[fd.length - 1].t, beat = fd[0].beat;
    if (beat === "triggers5") { kept.push({ t: Math.max(0, t1 - 1.0), type: "rise", gain: 0.9, beat, id: "fd", base: "fd", pri: 3 }, { t: t1 + 0.1, type: "stamp", gain: 1.1, beat, id: "fd", base: "fd", pri: 3 }); }
    else kept.push({ t: t0, type: "whoosh", gain: 0.9, beat, id: "fd", base: "fd", pri: 2 });
  }
  funnel.apresQ1_sens = kept.length + cutRaw.length;

  // Q2 : séries — un son pour la série (premier, + dernier si elle s'étale sur plus d'1 s)
  const bySeries = new Map(), single = [];
  for (const e of kept) {
    if (SERIES.has(e.base)) { const k = `${e.beat}|${e.base}|${e.type}`; (bySeries.get(k) || bySeries.set(k, []).get(k)).push(e); } else single.push(e);
  }
  for (const list of bySeries.values()) {
    list.sort((a, b) => a.t - b.t);
    const f = list[0], l = list[list.length - 1];
    if (f.base === "co") { single.push({ ...l, type: "coin", gain: 1 }); continue; }   // les pièces : un seul « ka-ching » quand la dernière tombe
    single.push(f);
    if (list.length >= 4 && l.t - f.t > 1.0 && f.base !== "pg") single.push(l);
    if (f.base === "pg") list.forEach((x, i) => { if (i > 0) single.push({ ...x, gain: 0.7 }); });   // le défilement des mois EST le rythme : on garde chaque page
  }
  // dans une série d'objets qui tombent, on ne garde que le choc (pas le souffle)
  const afterQ2 = single.filter((e) => !(["it", "p", "cd"].includes(e.base) && e.type === "whoosh" && false));
  funnel.apresQ2_series = afterQ2.length + cutRaw.length;

  // Q3 : un son plus important est déjà là → on ne double pas. Les coupes de plan ne sonnent que si rien d'autre n'accompagne ±0,35 s.
  const all = [...afterQ2, ...cutRaw].sort((a, b) => b.pri - a.pri || a.t - b.t);
  const out = [], drops = [];
  for (const e of all) {
    const gap = e.type === "swish" ? 0.35 : e.type === "ding" || e.type === "coin" ? 0.07 : 0.22;
    const clash = e.type === "rise" ? null : out.find((k) => k.type !== "rise" && Math.abs(k.t - e.t) < ((k.type === "ding" || k.type === "coin") && k.type !== e.type ? 0.22 : gap) && (k.pri >= e.pri));
    if (clash) { drops.push({ t: +e.t.toFixed(2), type: e.type, id: e.id, beat: e.beat, why: `doublon avec ${clash.type}(${clash.id}) à ${clash.t.toFixed(2)}` }); continue; }
    out.push(e);
  }
  funnel.apresQ3_doublons = out.length;

  // Q4 : budget — 4 sons maximum par plan (les plus importants d'abord)
  const perBeat = new Map(), final = [];
  for (const e of out.sort((a, b) => b.pri - a.pri || a.t - b.t)) {
    const c = perBeat.get(e.beat) || 0;
    if (c >= 4 && e.pri < 3) { drops.push({ t: +e.t.toFixed(2), type: e.type, id: e.id, beat: e.beat, why: "budget du plan" }); continue; }
    perBeat.set(e.beat, c + 1); final.push(e);
  }
  bed.forEach((e) => final.push({ ...e, pri: 1 }));
  final.sort((a, b) => a.t - b.t);
  // variation naturelle : timbre (jamais deux fois de suite le même), hauteur et force légèrement différentes à chaque occurrence
  const rnd = (() => { let x = 12345; return () => ((x = (Math.imul(x, 1664525) + 1013904223) >>> 0) / 4294967296); })();
  const lastV = {}, NV = { pop: 4, stamp: 3, whoosh: 3, swish: 3 };
  final.forEach((e) => {
    if (NV[e.type]) { let v = Math.floor(rnd() * NV[e.type]); if (v === lastV[e.type]) v = (v + 1) % NV[e.type]; lastV[e.type] = v; e.v = v; }
    e.p = (e.p ?? 1) * (e.type === "num" ? 1 : 0.9 + 0.22 * rnd());
    e.gain = (e.gain ?? 1) * (0.88 + 0.2 * rnd());
    if (e.type === "ding" || e.type === "coin") { const k = final.filter((x) => x.type === e.type && x.beat === e.beat && x.t < e.t && e.t - x.t < 1.2).length; e.p *= Math.pow(1.09, Math.min(k, 5)); if (e.type === "coin") e.gain *= 0.7; }
    if (e.type === "tum") e.p *= 1 + 0.03 * final.filter((x) => x.type === "tum" && x.beat === e.beat && x.t < e.t).length;   // la pulsation monte très légèrement
  });
  funnel.final = final.length;
  if (process.env.DEBUG_SFX) writeFileSync(process.env.DEBUG_SFX, JSON.stringify({ funnel, drops, final: final.map(({ t, type, beat, id, pri }) => ({ t: +t.toFixed(2), type, beat, id, pri })) }));
  console.log("entonnoir sons :", JSON.stringify(funnel));
  return final;
}
