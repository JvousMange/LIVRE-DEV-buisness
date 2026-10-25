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
  pop: { d: 0.3, g: 0.8, make: (ev, seed) => { const n = lcg(seed + 3), bp = bandpass(2), bp3 = bandpass(1.5), lp = lowpass1(0.05); let ph = 0;
    return (t) => { ph += (TAU * (72 + 80 * exp(t, 38))) / SR; return Math.sin(ph) * exp(t, 12) * Math.min(1, t / 0.003) * 0.9 + lp(n()) * exp(t, 45) * 0.8 + bp3(n(), 300) * exp(t, 40) * 1.2 + bp(n(), 3800) * exp(t, 110) * 0.55; }; } },
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
  stamp: { d: 0.8, g: 1.1, make: (ev, seed) => { const n = lcg(seed + 6), lp = lowpass1(0.04), bp = bandpass(1), bp2 = bandpass(1.5); let ph = 0;
    return (t) => { ph += (TAU * (58 + 110 * exp(t, 20))) / SR; return Math.sin(ph) * exp(t, 5.5) * 1.1 + lp(n()) * exp(t, 11) * 1.4 + bp(n(), 360) * exp(t, 24) * 1.6 + bp2(n(), 5200) * exp(t, 70) * 0.7; }; } },
  // cloche douce, discrète (validation)
  ding: { d: 1.0, g: 0.3, make: () => { const P = [[1, 1, 4.5], [2.76, 0.3, 8], [5.4, 0.12, 13]], f0 = 1318.5; const ph = [0, 0, 0];
    return (t) => { let y = 0; for (let k = 0; k < 3; k++) { ph[k] += (TAU * f0 * P[k][0]) / SR; y += Math.sin(ph[k]) * P[k][1] * exp(t, P[k][2]); } return y * Math.min(1, t / 0.002); }; } },
  coin: { d: 0.5, g: 0.3, make: () => { let a = 0, b = 0, c = 0;
    return (t) => { a += (TAU * 1975.5) / SR; b += (TAU * 2637) / SR; c += (TAU * 5274) / SR; const t2 = t - 0.07;
      return Math.sin(a) * exp(t, 20) * Math.min(1, t / 0.001) + (t2 > 0 ? (Math.sin(b) * 1.1 + 0.25 * Math.sin(c)) * exp(t2, 9) * Math.min(1, t2 / 0.001) : 0); }; } },
  beep: { d: 0.4, g: 0.22, make: () => { let ph = 0; return (t) => { ph += (TAU * (t < 0.2 ? 660 : 880)) / SR; return (Math.sin(ph) * 0.8 + Math.sin(ph * 2) * 0.1) * (t < 0.38 ? 1 : 0) * Math.min(1, t * 150); }; } },
  // « swipe » de papier : rafale brillante très courte et nette, attaque rapide, queue qui meurt (les traînées verticales vues dans leur spectre)
  whoosh: { d: 0.34, g: 0.75, make: (ev, seed) => { const n = lcg(seed + 7), bp = bandpass(0.8); const D = 0.3;
    return (t) => { const u = t / D; const env = u < 0.18 ? u / 0.18 : exp(t - 0.18 * D, 11); return bp(n(), 1800 + 5200 * Math.min(1, u * 1.6)) * env * 1.8 * (t < D ? 1 : 0); }; } },
  swish: { d: 0.26, g: 0.5, make: (ev, seed) => { const n = lcg(seed + 9), bp = bandpass(0.9); const D = 0.2;
    return (t) => { const u = t / D; const env = u < 0.25 ? u / 0.25 : exp(t - 0.25 * D, 14); return bp(n(), 2400 + 4000 * Math.min(1, u * 1.4)) * env * 1.6 * (t < D ? 1 : 0); }; } },
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

// Déduit les bruitages des animations puis les ÉDITE comme un monteur son :
//  - moments clés (croix, éclair, STOP, ticket, validation) : toujours présents, à pleine présence ;
//  - mouvements (entrées, chutes, coupes de plan) : présents mais discrets ;
//  - décoration (taches, granules, pièces qui apparaissent en rafale) : fondue en une courte phrase de 3 notes max.
const KEY = new Set(["stamp", "zap", "ding", "rise", "thud", "beep"]);
const SOFT = new Set(["pop", "blop", "tick", "coin"]);
export function eventsFromBeats(beats) {
  const ev = [];
  const push = (e) => ev.push(e);
  for (const b of beats) {
    for (const a of b.anims) {
      if (a.sfx === false) continue;
      const id = a.id.replace(/^b\d+-/, "");
      const t = b.t0 + a.t0;
      if (a.sfx) { const list = Array.isArray(a.sfx) ? a.sfx : [a.sfx]; list.forEach((x) => push({ t: t + (x.dt || 0), type: x.type || x, gain: x.gain })); continue; }
      const popLike = a.from && a.from.s === 0 && a.to && a.to.s === 1;
      const dropLike = a.from && a.from.y !== undefined && a.from.y <= -1000;
      if (dropLike) { push({ t: t + 0.02, type: "whoosh", gain: 0.55 }); push({ t: t + 0.42, type: "thud", gain: 0.7 }); }
      else if (popLike) {
        const type = /^(x|x_|x\d|xB|xL|xR|bigx|cross)/.test(id) ? "stamp" : /^(chk|ok|okc)/.test(id) ? "ding" : /^fd\d+/.test(id) ? "blop" : "pop";
        push({ t: t + (type === "stamp" ? 0.12 : 0.03), type, gain: 1 });
      }
    }
    for (const x of b.sfx || []) push({ t: b.t0 + x.t, type: x.type, gain: x.gain });
    if (b.t0 > 0.01) push({ t: b.t0 - 0.04, type: "swish", gain: 1 });
  }
  ev.sort((x, y) => x.t - y.t);

  // 1) doublons trop proches (même type)
  const first = [], last = {};
  for (const e of ev) { if (last[e.type] !== undefined && e.t - last[e.type] < 0.06) continue; last[e.type] = e.t; first.push(e); }

  // 2) rafales de petits sons → un seul « scatter » (pluie de claquements) pour tout le groupe
  const out = []; let i = 0;
  while (i < first.length) {
    const e = first[i];
    if (!SOFT.has(e.type)) { out.push(e); i++; continue; }
    let j = i; const grp = [e];
    while (j + 1 < first.length && SOFT.has(first[j + 1].type) && first[j + 1].t - first[j].t < 0.4) grp.push(first[++j]);
    if (grp.length <= 2) grp.forEach((g) => out.push({ ...g }));
    else out.push({ ...grp[0], type: grp[0].type === "blop" ? "blop" : "scatter", gain: 0.9 });
    i = j + 1;
  }

  // 3) densité : jamais plus de 3 sons en 0,5 s ; les moments clés ne sont jamais supprimés
  out.sort((x, y) => x.t - y.t);
  const kept = [];
  for (const e of out) {
    const near = kept.filter((k) => e.t - k.t < 0.5 && !KEY.has(k.type));
    if (!KEY.has(e.type) && near.length >= 3) continue;
    kept.push(e);
  }
  return kept;
}
