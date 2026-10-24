// Aligne un script texte sur une voix (sans transcription) : segments de parole (silencedetect) ↔ mots, par programmation dynamique.
// Usage : node align.mjs <voix.mp3> <script.txt> <sortie.json>
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";

const [voice, scriptFile, outFile] = process.argv.slice(2);
const dur = Number(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", voice]).toString());
// ffmpeg écrit sur stderr : on le relit via spawn
import { spawnSync } from "node:child_process";
const r = spawnSync("ffmpeg", ["-v", "info", "-i", voice, "-af", "silencedetect=noise=-38dB:d=0.1", "-f", "null", "-"], { encoding: "utf8" });
const sil = [];
let cur = null;
for (const line of r.stderr.split("\n")) {
  let m = line.match(/silence_start: (-?[\d.]+)/); if (m) cur = Math.max(0, Number(m[1]));
  m = line.match(/silence_end: ([\d.]+)/); if (m && cur !== null) { sil.push([cur, Number(m[1])]); cur = null; }
}
if (cur !== null) sil.push([cur, dur]);
// segments de parole = complément des silences
const speech = [];
let t = 0;
for (const [a, b] of sil) { if (a - t > 0.07) speech.push([t, a]); t = b; }
if (dur - t > 0.07) speech.push([t, dur]);
const gapAfter = speech.map((s, i) => (i < speech.length - 1 ? speech[i + 1][0] - s[1] : 0));

const words = readFileSync(scriptFile, "utf8").split(/\s+/).filter(Boolean);
const wt = words.map((w) => w.replace(/[^\p{L}\p{N}]/gu, "").length + 1.5);
const cum = [0]; wt.forEach((x) => cum.push(cum[cum.length - 1] + x));
const speechTotal = speech.reduce((a, s) => a + (s[1] - s[0]), 0);
const R = cum[words.length] / speechTotal;
const S = speech.length, Wn = words.length;
console.error(`${S} segments de parole, ${Wn} mots, ${speechTotal.toFixed(1)} s de parole`);
const punct = (w) => /[,.;:?!]$/.test(w), strong = (w) => /[.?!:]$/.test(w);

function cost(k, i, j) {
  const d = speech[k][1] - speech[k][0], lw = cum[j] - cum[i];
  let c = Math.pow(lw / d / R - 1, 2) * Math.max(d, 0.3);
  const w = words[j - 1], g = gapAfter[k];
  if (g > 0.3 && !punct(w)) c += 1.2;
  if (g >= 0.1 && punct(w)) c -= 0.5;        // une vraie pause à une ponctuation : coupe très probable
  if (g >= 0.1 && !punct(w)) c += 0.25;
  if (g > 0.4 && !strong(w) && punct(w)) c += 0.15;
  if (strong(w) && g < 0.15 && k < S - 1) c += 0.5;
  return c;
}
const INF = 1e18;
const f = Array.from({ length: S + 1 }, () => new Float64Array(Wn + 1).fill(INF));
const back = Array.from({ length: S + 1 }, () => new Int32Array(Wn + 1).fill(-1));
f[0][0] = 0;
for (let k = 1; k <= S; k++) {
  for (let j = k; j <= Wn - (S - k); j++) {
    for (let i = Math.max(k - 1, j - 45); i < j; i++) {
      if (f[k - 1][i] >= INF) continue;
      const v = f[k - 1][i] + cost(k - 1, i, j);
      if (v < f[k][j]) { f[k][j] = v; back[k][j] = i; }
    }
  }
}
const cuts = [Wn];
for (let k = S, j = Wn; k > 0; k--) { j = back[k][j]; cuts.unshift(j); }
const segments = [];
for (let k = 0; k < S; k++) {
  const text = words.slice(cuts[k], cuts[k + 1]).join(" ");
  segments.push({ text, t0: Number(speech[k][0].toFixed(2)), t1: Number(speech[k][1].toFixed(2)) });
}
writeFileSync(outFile, JSON.stringify({ duration: Number(dur.toFixed(2)), segments }, null, 1));
for (const s of segments) console.log(`${s.t0.toFixed(2).padStart(6)}–${s.t1.toFixed(2).padStart(6)}  ${s.text}`);
