// Bruitages synthétisés par code (déterministes) : une famille de sons cohérente « papier / carton ».
import { writeFileSync } from "node:fs";

const SR = 44100;
const lcg = (seed) => { let s = seed >>> 0; return () => ((s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296) * 2 - 1; };
const env = (t, a, d) => (t < a ? t / a : Math.exp(-(t - a) * d));   // attaque courte puis décroissance exponentielle

// Chaque son : durée (s), fonction (t, i) → échantillon. Les bruits filtrés utilisent un filtre passe-bas à un pôle.
const lp = (k) => { let y = 0; return (x) => (y += k * (x - y)); };
const SOUNDS = {
  pop:   { d: 0.14, gain: 0.5, make: () => (t) => Math.sin(2 * Math.PI * (260 + 520 * Math.exp(-t * 38)) * t) * env(t, 0.004, 32) },
  blop:  { d: 0.16, gain: 0.45, make: () => (t) => Math.sin(2 * Math.PI * (120 + 240 * Math.exp(-t * 28)) * t) * env(t, 0.004, 24) },
  thud:  { d: 0.28, gain: 0.7, make: () => { const n = lcg(3), f = lp(0.08); return (t) => (Math.sin(2 * Math.PI * (52 + 60 * Math.exp(-t * 22)) * t) * env(t, 0.002, 14) + f(n()) * env(t, 0.001, 60) * 0.8); } },
  stamp: { d: 0.3, gain: 0.85, make: () => { const n = lcg(5), f = lp(0.5); return (t) => (Math.sin(2 * Math.PI * (70 + 90 * Math.exp(-t * 30)) * t) * env(t, 0.001, 13) + f(n()) * env(t, 0.0008, 90) * 0.7); } },
  ding:  { d: 0.5, gain: 0.34, make: () => (t) => (Math.sin(2 * Math.PI * 988 * t) + 0.55 * Math.sin(2 * Math.PI * 1480 * t)) * env(t, 0.003, 8) },
  coin:  { d: 0.35, gain: 0.3, make: () => (t) => (Math.sin(2 * Math.PI * 1760 * t) + 0.7 * Math.sin(2 * Math.PI * 2637 * t)) * env(t, 0.002, 14) },
  tick:  { d: 0.05, gain: 0.35, make: () => { const n = lcg(11); return (t) => n() * env(t, 0.0005, 110); } },
  beep:  { d: 0.3, gain: 0.3, make: () => (t) => Math.sin(2 * Math.PI * (t < 0.15 ? 740 : 980) * t) * (t < 0.28 ? 1 : 0) * Math.min(1, t * 200) },
  whoosh:{ d: 0.34, gain: 0.5, make: () => { const n = lcg(7); let f = 0; return (t) => { const k = 0.03 + 0.4 * Math.sin(Math.PI * Math.min(1, t / 0.34)); f += k * (n() - f); return f * Math.sin(Math.PI * Math.min(1, t / 0.34)) * 2.2; }; } },
  swish: { d: 0.26, gain: 0.55, make: () => { const n = lcg(9); let f = 0; return (t) => { const k = 0.05 + 0.35 * (t / 0.26); f += k * (n() - f); return f * Math.sin(Math.PI * Math.min(1, t / 0.26)) * 2.4; }; } },
  rise:  { d: 1.1, gain: 0.45, make: () => { const n = lcg(13); let f = 0; return (t) => { const u = Math.min(1, t / 1.1); f += (0.02 + 0.5 * u * u) * (n() - f); return (f * 2.2 + Math.sin(2 * Math.PI * (200 + 1500 * u * u) * t) * 0.35) * Math.sin(Math.PI * Math.min(1, u * 0.95)); }; } },
  flip:  { d: 0.12, gain: 0.45, make: () => { const n = lcg(17); let f = 0; return (t) => { f += 0.25 * (n() - f); return f * env(t, 0.002, 38) * 2.4; }; } },
};

// events : [{ t, type, gain? }] → WAV mono 16 bits.
export function renderSfx(events, duration, outFile) {
  const buf = new Float32Array(Math.ceil((duration + 1) * SR));
  for (const ev of events) {
    const S = SOUNDS[ev.type];
    if (!S) continue;
    const fn = S.make(), start = Math.round(ev.t * SR), g = S.gain * (ev.gain ?? 1);
    for (let i = 0, n = Math.round(S.d * SR); i < n && start + i < buf.length; i++) {
      if (start + i < 0) continue;
      buf[start + i] += fn(i / SR) * g;
    }
  }
  const pcm = Buffer.alloc(buf.length * 2);
  let peak = 0; for (const v of buf) peak = Math.max(peak, Math.abs(v));
  const k = peak > 0.95 ? 0.95 / peak : 1;
  for (let i = 0; i < buf.length; i++) pcm.writeInt16LE(Math.max(-32767, Math.min(32767, Math.round(buf[i] * k * 32767))), i * 2);
  const hdr = Buffer.alloc(44);
  hdr.write("RIFF", 0); hdr.writeUInt32LE(36 + pcm.length, 4); hdr.write("WAVEfmt ", 8); hdr.writeUInt32LE(16, 16); hdr.writeUInt16LE(1, 20); hdr.writeUInt16LE(1, 22);
  hdr.writeUInt32LE(SR, 24); hdr.writeUInt32LE(SR * 2, 28); hdr.writeUInt16LE(2, 32); hdr.writeUInt16LE(16, 34); hdr.write("data", 36); hdr.writeUInt32LE(pcm.length, 40);
  writeFileSync(outFile, Buffer.concat([hdr, pcm]));
}

// Déduit les bruitages des animations : apparition = pop, chute = souffle + choc, croix = tampon, coche = ding, etc.
export function eventsFromBeats(beats) {
  const ev = [];
  for (const b of beats) {
    for (const a of b.anims) {
      if (a.sfx === false) continue;
      const id = a.id.replace(/^b\d+-/, "");
      const t = b.t0 + a.t0;
      if (a.sfx) { const list = Array.isArray(a.sfx) ? a.sfx : [a.sfx]; list.forEach((x) => ev.push({ t: t + (x.dt || 0), type: x.type || x, gain: x.gain })); continue; }
      const popLike = a.from && a.from.s === 0 && a.to && a.to.s === 1;
      const dropLike = a.from && a.from.y !== undefined && a.from.y <= -1000;
      if (dropLike) { ev.push({ t: t + 0.02, type: "whoosh", gain: 0.6 }); ev.push({ t: t + 0.4, type: "thud", gain: 0.8 }); }
      else if (popLike) {
        const type = /^(x|x_|x\d|xB|xL|xR|bigx|cross)/.test(id) ? "stamp" : /^(chk|ok|okc)/.test(id) ? "ding" : /^fd\d+/.test(id) ? "blop" : "pop";
        ev.push({ t: t + (type === "stamp" ? 0.1 : 0.03), type, gain: type === "pop" ? 0.7 : 1 });
      }
    }
    for (const x of b.sfx || []) ev.push({ t: b.t0 + x.t, type: x.type, gain: x.gain });
    if (b.t0 > 0.01) ev.push({ t: b.t0 - 0.05, type: "swish", gain: 0.9 });
  }
  // fusionne les doublons trop proches (même type à moins de 45 ms) et limite la densité
  ev.sort((x, y) => x.t - y.t);
  const out = [], last = {};
  for (const e of ev) {
    const gap = e.type === "blop" ? 0.05 : 0.045;
    if (last[e.type] !== undefined && e.t - last[e.type] < gap) continue;
    last[e.type] = e.t; out.push(e);
  }
  return out;
}
