// Moteur d'animation : évalue l'état (position, échelle, rotation, opacité) d'un groupe de feuilles à l'instant t.
import {random, spring} from 'remotion';

export type Act = {g: string; k: string; t: number; [key: string]: any};
export type St = {x: number; y: number; sx: number; sy: number; r: number; o: number; clip?: number; clipDir?: string};
export const ident = (): St => ({x: 0, y: 0, sx: 1, sy: 1, r: 0, o: 1});

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const easeOut = (p: number) => 1 - Math.pow(1 - p, 3);
export const easeInOut = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);
const easeOutBack = (p: number, s = 1.9) => 1 + (s + 1) * Math.pow(p - 1, 3) + s * Math.pow(p - 1, 2);
const PI2 = Math.PI * 2;

// how : côté d'où l'élément arrive (in) ou vers où il part (out)
const DIR: Record<string, [number, number]> = {left: [-1, 0], right: [1, 0], top: [0, -1], bottom: [0, 1], scale: [0, 0]};

// pop : ressort avec dépassement ; squash/stretch pendant le dépassement
const pop = (tau: number, fps: number, soft = false) => {
  const sp = spring({frame: tau * fps, fps, config: soft ? {damping: 16, stiffness: 140, mass: 0.8} : {damping: 10, stiffness: 190, mass: 0.7}});
  return sp;
};

export const applyAct = (s: St, a: Act, time: number, fps: number, layerDelay = 0): void => {
  const tau = time - a.t - layerDelay;
  const d = a.d ?? 0.5;
  switch (a.k) {
    case 'in': {
      if (tau < 0) { s.o = 0; return; }
      if (a.how === 'none') return;
      const sp = pop(tau, fps, a.soft);
      const dist = a.dist ?? 140;
      const dir = DIR[a.how ?? 'scale'] ?? [0, 0];
      const fade = clamp(tau / (a.fade ?? 0.1));
      s.o *= fade;
      if ((a.how ?? 'scale') === 'scale') {
        const from = a.f0 ?? 0;
        const u = from + (1 - from) * sp;
        s.sx *= u - 0.35 * (u - 1) * (a.squash ?? 1);
        s.sy *= u + 0.35 * (u - 1) * (a.squash ?? 1);
      } else {
        s.x += dir[0] * dist * (1 - sp);
        s.y += dir[1] * dist * (1 - sp);
        s.sx *= 1 - 0.1 * (sp - 1);
        s.sy *= 1 + 0.1 * (sp - 1);
      }
      if (a.rot) s.r += a.rot * (1 - sp);
      return;
    }
    case 'fall': {
      if (tau < 0) { s.o = 0; return; }
      const h = a.h ?? 700, T = d, sq = a.squash ?? 0.2;
      s.o *= clamp(tau / 0.05);
      if (tau < T) { s.y += -h * (1 - (tau / T) * (tau / T)); return; }
      const b = tau - T;
      s.y += -(h * 0.06) * Math.abs(Math.sin((Math.PI * b) / 0.3)) * Math.exp(-b * 7);
      if (b < 0.35) { const q = Math.exp(-b * 9) * Math.cos(b * 28); s.sx *= 1 + sq * q; s.sy *= 1 - sq * q; }
      return;
    }
    case 'out': {
      if (tau < 0) return;
      const p = clamp(tau / d);
      const dir = DIR[a.how ?? 'scale'] ?? [0, 0];
      const dist = a.dist ?? 700;
      if ((a.how ?? 'scale') === 'scale') { const u = 1 - easeInOut(p); s.sx *= u; s.sy *= u; }
      else { const e = p * p; s.x += dir[0] * dist * e; s.y += dir[1] * dist * e; }
      s.o *= p >= 1 ? 0 : 1 - Math.pow(p, 3);
      return;
    }
    case 'move': {
      if (tau < 0) return;
      const p = clamp(tau / d), an = a.antic ?? 0;
      let f: number;
      if (a.ease === 'smooth') f = easeInOut(p);
      else if (an > 0) { f = p < 0.22 ? -an * easeOut(p / 0.22) : -an + (1 + an) * easeOutBack((p - 0.22) / 0.78, a.over ?? 1.2); }
      else f = easeOutBack(p, a.over ?? 1.3);
      s.x += (a.dx ?? 0) * f; s.y += (a.dy ?? 0) * f;
      return;
    }
    case 'rot': {
      if (tau < 0) return;
      s.r += (a.deg ?? 0) * (a.ease === 'smooth' ? easeInOut(clamp(tau / d)) : easeOutBack(clamp(tau / d), 1.5));
      return;
    }
    case 'scale': {
      if (tau < 0) return;
      const f = easeInOut(clamp(tau / d)), v = (a.f0 ?? 1) + ((a.to ?? 1) - (a.f0 ?? 1)) * f;
      s.sx *= v; s.sy *= v;
      return;
    }
    case 'fade': {
      if (tau < 0) return;
      s.o *= 1 + ((a.to ?? 0) - 1) * easeInOut(clamp(tau / d));
      return;
    }
    case 'shake': {
      if (tau < 0 || tau > d) return;
      const env = Math.pow(1 - tau / d, 2);
      const v = (a.amp ?? 14) * Math.sin(PI2 * (a.hz ?? 16) * tau) * env;
      if (a.axis === 'y') s.y += v; else s.x += v;
      s.r += (a.rotAmp ?? 0) * Math.sin(PI2 * (a.hz ?? 16) * tau + 1) * env;
      return;
    }
    case 'wipe': {
      if (tau < 0 || tau > d) return;
      const p = tau / d, env = Math.sin(Math.PI * p);
      const ph = PI2 * (a.cycles ?? 3) * (a.ramp ? Math.pow(p, 1.35) : p);
      const v = (a.amp ?? 120) * env * Math.sin(ph);
      if (a.axis === 'y') s.y += v; else { s.x += v; s.y += (a.dy ?? 0) * env * Math.sin(ph + 1.2); }
      s.r += (a.tilt ?? 0) * env * Math.sin(ph + 0.6);
      return;
    }
    case 'pulse': {
      if (tau < 0 || tau > d) return;
      const n = a.n ?? 3, p = tau / d, beat = (p * n) % 1;
      const k = (a.amp ?? 0.1) * Math.sin(Math.PI * Math.min(1, beat * 1.4)) * (1 - p * (a.decay ?? 0.5));
      s.sx *= 1 - k * 0.5; s.sy *= 1 + k;
      return;
    }
    case 'bob': {
      if (tau < 0 || (a.d != null && tau > a.d)) return;
      s.y += (a.amp ?? 10) * Math.sin(PI2 * (a.hz ?? 0.7) * tau + (a.phase ?? 0));
      return;
    }
    case 'sway': {
      if (tau < 0 || (a.d != null && tau > a.d)) return;
      s.r += (a.amp ?? 3) * Math.sin(PI2 * (a.hz ?? 0.6) * tau + (a.phase ?? 0));
      return;
    }
    case 'spin': {
      if (tau < 0 || (a.d != null && tau > a.d)) return;
      const rate = a.to != null ? (a.rps ?? 0.3) + ((a.to - (a.rps ?? 0.3)) * clamp(tau / (a.d ?? 3))) : a.rps ?? 0.3;
      s.r += 360 * rate * tau;
      return;
    }
    case 'blink': {
      if (tau < 0) return;
      const every = a.every ?? 2.6, n = Math.floor(tau / every), q = tau - n * every;
      if (q < 0.14) s.sy *= 1 - 0.92 * Math.sin((Math.PI * q) / 0.14);
      return;
    }
    case 'wipein': {
      if (tau < 0) { s.o = 0; return; }
      s.clip = easeOut(clamp(tau / d)); s.clipDir = a.dir ?? 'left';
      return;
    }
    case 'tint': return;
  }
};

export const evalGroup = (acts: Act[], time: number, fps: number, skipStag = true): St => {
  const s = ident();
  for (const a of acts) {
    if (skipStag && a.k === 'in' && (a.stag ?? 0) > 0) continue;
    applyAct(s, a, time, fps);
  }
  return s;
};

// Pop par feuille (stag > 0) : chaque feuille du groupe arrive avec un retard croissant
export const evalLayerStag = (acts: Act[], time: number, fps: number, idx: number): St => {
  const s = ident();
  for (const a of acts) if (a.k === 'in' && (a.stag ?? 0) > 0) applyAct(s, a, time, fps, idx * a.stag);
  return s;
};

export const boil = (seed: string, frame: number, amp = 1.4) => {
  const f = Math.floor(frame / 3);
  return {x: (random(`${seed}x${f}`) - 0.5) * amp * 2, y: (random(`${seed}y${f}`) - 0.5) * amp * 2, r: (random(`${seed}r${f}`) - 0.5) * 0.7};
};
