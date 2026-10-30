// Assemble une annonce : hook choisi + corps commun → voix, script.json et dossier de projet.
// Usage : node tools/make-ad.mjs <projet> <H1|H2|H3> [--voice=fichier.mp3]
//   sans --voice : voix témoin locale (espeak-ng) pour valider montage et timings.
//   avec --voice : vraie voix (ex. ElevenLabs) ; les segments viennent de silencedetect (tools/align.mjs).
import { execFileSync, spawnSync } from "node:child_process";
import { readFileSync, writeFileSync, mkdirSync, existsSync, copyFileSync } from "node:fs";
import path from "node:path";

const proj = path.resolve(process.argv[2]);
const key = process.argv[3];
const voiceArg = (process.argv.find((a) => a.startsWith("--voice=")) || "").split("=")[1];
const copy = JSON.parse(readFileSync(path.join(proj, "copy.json"), "utf8"));
const hook = copy.hooks[key];
if (!hook) throw new Error(`hook inconnu : ${key}`);
const dir = path.join(proj, key);
mkdirSync(dir, { recursive: true });
writeFileSync(path.join(dir, "scenes.mjs"), `export { scenes } from "../scenes-h23.mjs";\n`);

const blocks = [{ scene: hook.scene, at: hook.at, lines: hook.lines }, ...copy.body];
const lines = blocks.flatMap((b) => b.lines);
const dur = (f) => Number(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f]).toString());
let segments = [], T = 0, voiceName = "voice.mp3";

if (!voiceArg) {
  // voix témoin : une phrase = un fichier, silences contrôlés entre les phrases
  const tmp = path.join(dir, "tts"); mkdirSync(tmp, { recursive: true });
  const parts = []; let t = 0;
  lines.forEach((l, i) => {
    const w = path.join(tmp, `s${i}.wav`);
    execFileSync("espeak-ng", ["-v", "fr+f3", "-s", "135", "-p", "58", "-w", w, l.tts || l.text]);
    const d = dur(w);
    segments.push({ text: l.text, t0: +t.toFixed(3), t1: +(t + d).toFixed(3) });
    parts.push(w); t += d;
    const gap = /\?$/.test(l.text) && i < hook.lines.length ? 0.35 : 0.32;
    const sil = path.join(tmp, `g${i}.wav`);
    execFileSync("ffmpeg", ["-y", "-v", "error", "-f", "lavfi", "-i", "anullsrc=r=22050:cl=mono", "-t", String(gap), sil]);
    parts.push(sil); t += gap;
  });
  const list = path.join(tmp, "list.txt");
  writeFileSync(list, parts.map((p) => `file '${p}'`).join("\n"));
  execFileSync("ffmpeg", ["-y", "-v", "error", "-f", "concat", "-safe", "0", "-i", list, "-ar", "44100", "-ac", "1", "-c:a", "libmp3lame", "-b:a", "128k", path.join(dir, voiceName)]);
  T = +(t + 0.4).toFixed(2);
} else {
  copyFileSync(path.resolve(voiceArg), path.join(dir, voiceName));
  writeFileSync(path.join(dir, "script.txt"), lines.map((l) => l.text).join(" "));
  execFileSync("node", [path.resolve(path.dirname(new URL(import.meta.url).pathname), "align.mjs"), path.join(dir, voiceName), path.join(dir, "script.txt"), path.join(dir, "alignment.json")], { stdio: "inherit" });
  const al = JSON.parse(readFileSync(path.join(dir, "alignment.json"), "utf8"));
  segments = al.segments.map((s) => ({ text: s.text, t0: s.t0, t1: s.t1 }));
  T = +(dur(path.join(dir, voiceName)) + 0.3).toFixed(2);
}
const beats = blocks.map((b) => ({ scene: b.scene, at: b.at }));
const script = {
  title: `MELA SKIN — anti-tache post-acné — ${key}`, brand: "../../../brands/mela-skin/brand.json", voice: voiceName, duration: T, fps: 15,
  emphasis: "taches|boutons|mélanine|offert|quatre-vingt|90|Mela|STOP", segments, beats, anticipation: 0.45,
};
writeFileSync(path.join(dir, "script.json"), JSON.stringify(script, null, 1));
console.log(`${key} : ${lines.length} phrases, ${T} s → ${dir}`);
