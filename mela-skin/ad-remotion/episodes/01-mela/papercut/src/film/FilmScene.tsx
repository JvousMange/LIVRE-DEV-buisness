// Lit le manifest d'une scène (couches de papier + groupes + actions + caméra) et la joue.
import React from 'react';
import {AbsoluteFill, Img, random, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import MAN from '../../public/layers/manifest.json';
import {Act, boil, easeInOut, evalGroup, evalLayerStag, ident, St} from './anim';

type Layer = {f: string; x: number; y: number; w: number; h: number; g: string | null; tag: string | null; area: number};
type Grp = {origin: string | [number, number] | null; bbox?: [number, number, number, number]};
type Scene = {layers: Layer[]; groups: Record<string, Grp>; acts: Act[]; cams: any[]; dur: number};
const SC = MAN as unknown as Record<string, Scene>;

const originOf = (g: Grp): [number, number] => {
  const [x0, y0, x1, y1] = g.bbox ?? [0, 0, 1080, 1920];
  const o = g.origin;
  if (Array.isArray(o)) return [o[0], o[1]];
  if (o === 'bottom') return [(x0 + x1) / 2, y1];
  if (o === 'top') return [(x0 + x1) / 2, y0];
  if (o === 'left') return [x0, (y0 + y1) / 2];
  if (o === 'right') return [x1, (y0 + y1) / 2];
  return [(x0 + x1) / 2, (y0 + y1) / 2];
};

const camera = (cams: any[], time: number, dur: number) => {
  let z = 1, x = 0, y = 0, r = 0, cx = 540, cy = 960;
  const pushes = cams.filter((c) => c.k === 'push');
  const list = pushes.length ? cams : [{k: 'push', t: 0, d: dur, f0: 1, to: 1.06}, ...cams];
  for (const c of list) {
    const tau = time - c.t;
    if (c.k === 'push') {
      const d = c.d ?? 1;
      if (tau < 0) { if (c.hold !== false) z = c.f0 ?? 1; continue; }
      const p = Math.min(1, tau / d);
      z = (c.f0 ?? 1) + ((c.to ?? 1.1) - (c.f0 ?? 1)) * (c.lin ? p : easeInOut(p));
      cx = c.cx ?? cx; cy = c.cy ?? cy;
    } else if (c.k === 'pan') {
      if (tau < 0) continue;
      const p = easeInOut(Math.min(1, tau / (c.d ?? 1)));
      x += (c.dx ?? 0) * p; y += (c.dy ?? 0) * p;
    } else if (c.k === 'shake') {
      const d = c.d ?? 0.4;
      if (tau < 0 || tau > d) continue;
      const env = Math.pow(1 - tau / d, 2);
      x += (c.amp ?? 16) * Math.sin(tau * 2 * Math.PI * 17) * env;
      y += (c.amp ?? 16) * 0.7 * Math.cos(tau * 2 * Math.PI * 13) * env;
    } else if (c.k === 'tilt') {
      if (tau < 0) continue;
      r += (c.deg ?? 2) * easeInOut(Math.min(1, tau / (c.d ?? 1)));
    }
  }
  // pas de bord découvert : la translation est limitée par le zoom
  x = Math.max(-(1080 - cx) * (z - 1), Math.min(cx * (z - 1), x));
  y = Math.max(-(1920 - cy) * (z - 1), Math.min(cy * (z - 1), y));
  return {z, x, y, r, cx, cy};
};

export const FilmScene: React.FC<{id: string}> = ({id}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const time = frame / fps;
  const sc = SC[id];
  const byG = React.useMemo(() => {
    const m: Record<string, Act[]> = {};
    for (const a of sc.acts) (m[a.g] ??= []).push(a);
    for (const k of Object.keys(m)) m[k].sort((p, q) => p.t - q.t);
    return m;
  }, [sc]);
  const idxInG = React.useMemo(() => {
    const c: Record<string, number> = {}; return sc.layers.map((l) => (l.g ? (c[l.g] = (c[l.g] ?? -1) + 1) : 0));
  }, [sc]);
  const cam = camera(sc.cams, time, sc.dur);
  return (
    <AbsoluteFill style={{backgroundColor: '#c49868', overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, transformOrigin: `${cam.cx}px ${cam.cy}px`, transform: `translate(${cam.x}px, ${cam.y}px) rotate(${cam.r}deg) scale(${cam.z})`}}>
        <Img src={staticFile(`layers/${id}/bg.jpg`)} style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920}} />
        {sc.layers.map((L, i) => {
          const acts = L.g ? byG[L.g] ?? [] : [];
          const grp = L.g ? sc.groups[L.g] : undefined;
          const gs: St = acts.length ? evalGroup(acts, time, fps) : ident();
          const ls: St = acts.length ? evalLayerStag(acts, time, fps, idxInG[i]) : ident();
          const op = gs.o * ls.o;
          if (op <= 0.003) return null;
          const [ox, oy] = grp ? originOf(grp) : [L.x + L.w / 2, L.y + L.h / 2];
          let ex = 0, ey = 0, er = 0, es = 1;
          if (L.tag === 'dot') { es = 1 + 0.035 * Math.sin(time * 3.2 + random(`${id}d${i}`) * 6.28); }
          else if (L.tag === 'sparkle') { es = 0.82 + 0.28 * Math.abs(Math.sin(time * 4 + random(`${id}s${i}`) * 6.28)); er = time * 25; }
          else if (L.tag !== 'glow' && L.area < 0.2) { const b = boil(`${id}${i}`, frame); ex = b.x; ey = b.y; er = b.r; }
          const clip = gs.clip != null ? (gs.clipDir === 'right' ? `inset(0 0 0 ${100 - gs.clip * 100}%)` : gs.clipDir === 'down' ? `inset(0 0 ${100 - gs.clip * 100}% 0)` : `inset(0 ${100 - gs.clip * 100}% 0 0)`) : undefined;
          return (
            <div key={i} style={{position: 'absolute', left: L.x, top: L.y, width: L.w, height: L.h, opacity: op, transformOrigin: `${ox - L.x}px ${oy - L.y}px`,
              transform: `translate(${gs.x + ex}px, ${gs.y + ey}px) rotate(${gs.r + er}deg) scale(${gs.sx * es}, ${gs.sy * es})`, clipPath: clip, willChange: 'transform'}}>
              <Img src={staticFile(`layers/${id}/${L.f}`)} style={{width: L.w, height: L.h, display: 'block', transformOrigin: '50% 50%', transform: `translate(${ls.x}px, ${ls.y}px) rotate(${ls.r}deg) scale(${ls.sx}, ${ls.sy})`}} />
            </div>
          );
        })}
      </div>
      {/* profondeur de champ : haut et bas du cadre légèrement flous, comme une maquette photographiée */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 300, backdropFilter: 'blur(5px)', WebkitMaskImage: 'linear-gradient(to bottom, black, transparent)', maskImage: 'linear-gradient(to bottom, black, transparent)'}} />
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 260, backdropFilter: 'blur(5px)', WebkitMaskImage: 'linear-gradient(to top, black, transparent)', maskImage: 'linear-gradient(to top, black, transparent)'}} />
    </AbsoluteFill>
  );
};
