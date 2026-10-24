// Usage : node build.mjs <dossier-projet> [--frames=N] (N = limite de frames, pour les tests)
import { readFileSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";
import path from "node:path";
import { defs, kraftBackground, finish } from "./paper.mjs";

const { chromium } = createRequire(import.meta.url)("playwright");
const dir = path.resolve(process.argv[2]);
const at = ((process.argv.find((a) => a.startsWith("--at=")) || "").split("=")[1] || "").split(",").filter(Boolean).map(Number);
const limit = Number((process.argv.find((a) => a.startsWith("--frames=")) || "").split("=")[1]) || Infinity;
const script = JSON.parse(readFileSync(path.join(dir, "script.json")));
const brand = JSON.parse(readFileSync(path.resolve(dir, script.brand)));
const C = brand.palette, W = 1080, H = 1920, FPS = script.fps || 15, T = script.duration;
const out = path.join(dir, "out"), framesDir = path.join(dir, "frames");
rmSync(framesDir, { recursive: true, force: true }); mkdirSync(framesDir, { recursive: true }); mkdirSync(out, { recursive: true });

// 1. Alignement : mots répartis au prorata de leur longueur dans chaque segment de parole.
const words = [], segWords = [];
script.segments.forEach((seg, si) => {
  segWords[si] = [];
  const ws = seg.text.split(/\s+/).filter(Boolean);
  const wt = ws.map((w) => w.replace(/[^\p{L}\p{N}]/gu, "").length + 1.5), tot = wt.reduce((a, b) => a + b, 0);
  let t = seg.t0;
  ws.forEach((w, i) => { const d = ((seg.t1 - seg.t0) * wt[i]) / tot; const o = { w, t0: t, t1: t + d, seg: si, last: i === ws.length - 1 }; words.push(o); segWords[si].push(o); t += d; });
});

// 2. Plans : les coupes tombent au milieu des silences entre segments.
const mid = (i) => (script.segments[i].t1 + script.segments[i + 1].t0) / 2;
const { scenes } = await import(pathToFileURL(path.join(dir, "scenes.mjs")).href);
const lib = scenes(C);
const beats = script.beats.map((b, i) => {
  const startOf = (bb) => { const [sg, wd] = bb.from; return sg === 0 && wd === 0 ? 0 : wd === 0 ? mid(sg - 1) : segWords[sg][wd].t0 - 0.04; };
  const t0 = startOf(b), t1 = i === script.beats.length - 1 ? T : startOf(script.beats[i + 1]);
  const sc = lib[b.scene], pre = `b${i}-`;
  return {
    name: b.scene, t0, t1,
    svg: sc.svg.replace(/ id="([^"]+)"/g, (m, id) => ` id="${pre}${id}"`).replace(/url\(#(?!paper|kraft|vignette|light)([^)]+)\)/g, (m, id) => `url(#${pre}${id})`),
    anims: sc.anims.map((a) => ({ ...a, id: pre + a.id })),
    loops: (sc.loops || []).map((l) => ({ ...l, id: pre + l.id })),
    cam: sc.cam,
  };
});

// 3. Sous-titres : 2 mots maximum, coupés à la ponctuation.
const subs = [];
let cur = [];
const flush = () => { if (cur.length) { subs.push({ t0: cur[0].t0, text: cur.map((x) => x.w.replace(/[,.]$/g, "")).join(" "), last: cur[cur.length - 1].t1 }); cur = []; } };
for (const w of words) { cur.push(w); if (cur.length === 2 || /[,.?!:]$/.test(w.w)) flush(); }
flush();
subs.forEach((s, i) => { s.t1 = i < subs.length - 1 ? Math.min(subs[i + 1].t0, s.last + 0.3) : s.last + 0.3; s.em = /\d|Cinq|Deux|^Un$|fond|teint|maquillage|caches/i.test(s.text); });

// 4. Page de rendu.
const scenesSvg = beats.map((b, i) => `<g id="scene-${i}" style="display:none"><g id="cam-${i}">${kraftBackground(W, H, C, 5 + i)}${b.svg}</g></g>`).join("");
const html = `<!doctype html><meta charset="utf-8"><body style="margin:0;background:#000">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">${defs()}${scenesSvg}${finish(W, H)}
<g id="subs" style="display:none"><text id="subtxt" x="540" y="1480" text-anchor="middle" font-family="Inter, 'DejaVu Sans', sans-serif" font-weight="900" font-size="104" fill="#fff" stroke="${C.dark}" stroke-width="16" stroke-linejoin="round" paint-order="stroke"></text></g></svg>
<script>window.DATA=${JSON.stringify({ beats, subs, accent: C.accent })}</script><script>${readFileSync(new URL("./player.js", import.meta.url), "utf8")}</script>`;
writeFileSync(path.join(out, "render.html"), html);

// 5. Rendu image par image (4 workers).
const N = Math.min(Math.ceil(T * FPS), limit);
const browser = await chromium.launch();
const t0 = Date.now();
const qa = { checks: [] };
const check = (name, ok, detail = "") => qa.checks.push({ name, ok, detail });
{
  const page = await browser.newPage({ viewport: { width: W, height: H } });
  await page.setContent(html);
  const missing = await page.evaluate(() => window.missingIds());
  check("ids animés présents", missing.length === 0, missing.join(","));
  const m = await page.evaluate(() => window.measureSubs());
  check("sous-titres dans la largeur sûre (≤ 900 px)", m.every((x) => x.w <= 900), m.filter((x) => x.w > 900).map((x) => x.text).join(" | "));
  check("sous-titres dans la zone sûre verticale (1300–1580)", m.every((x) => x.y0 >= 1300 && x.y1 <= 1580), JSON.stringify(m[0]));
  await page.close();
}
if (at.length) {
  const page = await browser.newPage({ viewport: { width: W, height: H } });
  await page.setContent(html);
  for (const t of at) { await page.evaluate((x) => window.setFrame(x), t); await page.screenshot({ path: path.join(out, `preview_${t}.png`) }); }
  await browser.close();
  console.log("aperçus :", at.join(", "));
  process.exit(0);
}
const WORKERS = 4;
await Promise.all(Array.from({ length: WORKERS }, async (_, w) => {
  const page = await browser.newPage({ viewport: { width: W, height: H } });
  await page.setContent(html);
  for (let k = w; k < N; k += WORKERS) {
    await page.evaluate((t) => window.setFrame(t), k / FPS);
    await page.screenshot({ path: path.join(framesDir, `f_${String(k).padStart(5, "0")}.jpg`), type: "jpeg", quality: 93 });
  }
  await page.close();
}));
await browser.close();
const renderS = (Date.now() - t0) / 1000;
console.log(`${N} images en ${renderS.toFixed(1)} s (${(renderS / N).toFixed(2)} s/image, 4 workers)`);

// 6. Audio : voix + bruit de papier à chaque coupe, puis assemblage.
const cuts = beats.slice(1).map((b) => b.t0);
const args = ["-y", "-v", "error", "-framerate", String(FPS), "-i", path.join(framesDir, "f_%05d.jpg"), "-i", path.join(dir, script.voice)];
// anoisesrc = source : un bruit de papier (bruit rose filtré) par coupe.
const fcLavfi = [
  `[1:a]atrim=0:${T},asetpts=PTS-STARTPTS,afade=t=out:st=${T - 0.4}:d=0.4[v]`,
  ...cuts.map((c, i) => `anoisesrc=d=0.28:c=pink:r=44100:a=0.7,highpass=f=900,lowpass=f=7000,afade=t=in:d=0.02,afade=t=out:st=0.06:d=0.22,volume=0.45,adelay=${Math.round(c * 1000 - 40)}|${Math.round(c * 1000 - 40)}[s${i}]`),
  `[v]${cuts.map((_, i) => `[s${i}]`).join("")}amix=inputs=${cuts.length + 1}:normalize=0:duration=first,loudnorm=I=-14:TP=-1.5:LRA=11[a]`,
].join(";");
const mp4 = path.join(out, "final_9x16.mp4");
execFileSync("ffmpeg", [...args, "-filter_complex", fcLavfi, "-map", "0:v", "-map", "[a]", "-vf", "fps=30,format=yuv420p", "-c:v", "libx264", "-crf", "23", "-preset", "medium", "-c:a", "aac", "-b:a", "192k", "-t", String(T), mp4], { stdio: "inherit" });

// 7. QA déterministe.
const dur = Number(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", mp4]).toString());
check("durée vidéo = durée cible ± 0,2 s", limit !== Infinity || Math.abs(dur - T) < 0.2, `${dur.toFixed(2)} s`);
beats.forEach((b) => check(`plan « ${b.name} » entre 0,9 et 4,5 s`, b.t1 - b.t0 >= 0.9 && b.t1 - b.t0 <= 4.5, `${(b.t1 - b.t0).toFixed(2)} s`));
const allowed = new Set([...Object.values(C), ...(brand.derived || [])].map((x) => x.toLowerCase()));
const used = new Set(beats.flatMap((b) => b.svg.match(/#[0-9a-fA-F]{6}\b/g) || []).map((x) => x.toLowerCase()));
const rogue = [...used].filter((x) => !allowed.has(x));
check("couleurs dans la palette (palette + dérivées)", rogue.length === 0, rogue.join(","));
const qaFile = path.join(out, "qa_report.json");
writeFileSync(qaFile, JSON.stringify({ ...qa, renderSeconds: renderS, frames: N }, null, 2));
writeFileSync(path.join(out, "storyboard.json"), JSON.stringify({ beats: beats.map(({ name, t0, t1 }) => ({ name, t0, t1 })), subs }, null, 2));
for (const c of qa.checks) console.log(`${c.ok ? "OK  " : "FAIL"} ${c.name}${c.detail ? " — " + c.detail : ""}`);
