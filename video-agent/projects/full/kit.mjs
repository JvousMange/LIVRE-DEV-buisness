// Petits utilitaires d'animation partagés par les scènes.
export const A = (id, t0, dur, from, to, o = {}) => ({ id, t0, dur, from, to, ...o });
export const POP = (id, t0, origin, o = {}) => A(id, t0, 0.5, { s: 0 }, { s: 1 }, { origin, ease: "outBack", ...o });
export const FADEIN = (id, t0, dur = 0.4, o = {}) => A(id, t0, dur, { o: 0 }, { o: 1 }, { ease: "lin", ...o });
export const FADEOUT = (id, t0, dur = 0.4, o = {}) => A(id, t0, dur, { o: 1 }, { o: 0 }, { ease: "lin", late: true, ...o });
export const DROP = (id, t0, origin, dy = -1800) => A(id, t0, 0.6, { y: Math.min(dy, -1800), r: -8 }, { y: 0, r: 0 }, { ease: "outBack", origin });
export const SLOW = (s0, s1, y0 = 0, y1 = 0) => ({ from: { s: s0, y: y0 }, to: { s: s1, y: y1 }, ease: "lin" });
