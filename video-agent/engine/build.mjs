// Usage : node build.mjs <dossier-projet> [--peek=plan[,plan]] [--at=t1,t2] [--frames=N]
//   (sans option : rendu complet, avec cache par plan)
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";
import path from "node:path";
import { defs, kraftBackground, finish } from "./paper.mjs";
import { renderSfx, eventsFromBeats } from "./sfx.mjs";

const { chromium } = createRequire(import.meta.url)("playwright");
const arg = (k) => (process.argv.find((a) => a.startsWith(`--${k}=`)) || "").split("=")[1];
const at = (arg("at") || "").split(",").filter(Boolean).map(Number);
const peek = (arg("peek") || "").split(",").filter(Boolean);
const limit = Number(arg("frames")) || Infinity;
const dir = path.resolve(process.argv[2]);
const script = JSON.parse(readFileSync(path.join(dir, "script.json")));
const brand = JSON.parse(readFileSync(path.resolve(dir, script.brand)));
const C = brand.palette, W = 1080, H = 1920, FPS = script.fps || 15, T = script.duration;
const out = path.join(dir, "out"), framesDir = path.join(dir, "frames");
mkdirSync(framesDir, { recursive: true }); mkdirSync(out, { recursive: true });

// 1. Alignement : mots répartis au prorata de leur longueur dans chaque segment de parole.
const words = [], segFirst = [];
script.segments.forEach((seg, si) => {
  const ws = seg.text.split(/\s+/).filter(Boolean);
  const wt = ws.map((w) => w.replace(/[^\p{L}\p{N}]/gu, "").length + 1.5), tot = wt.reduce((a, b) => a + b, 0);
  let t = seg.t0;
  segFirst[si] = words.length;
  ws.forEach((w, i) => { const d = ((seg.t1 - seg.t0) * wt[i]) / tot; words.push({ w, t0: t, t1: t + d, seg: si, last: i === ws.length - 1 }); t += d; });
});
const norm = (w) => w.toLowerCase().replace(/[^\p{L}\p{N}]/gu, "");
words.forEach((w) => (w.n = norm(w.w)));
const mid = (i) => (script.segments[i].t1 + script.segments[i + 1].t0) / 2;

// 2. Débuts de plans : ancre textuelle (« at ») → coupe au milieu du silence précédent, ou juste avant le mot.
let cursor = 0;
const findAnchor = (text, from) => {
  const toks = text.split(/\s+/).map(norm).filter(Boolean);
  for (let i = from; i + toks.length <= words.length; i++) if (toks.every((tk, k) => words[i + k].n === tk)) return i;
  throw new Error(`ancre introuvable dans la voix : « ${text} »`);
};
const timeOfWord = (i) => { const w = words[i]; return i === 0 ? 0 : segFirst[w.seg] === i && w.seg > 0 ? mid(w.seg - 1) : w.t0 - 0.04; };
const startOfBeat = (b) => {
  if (b.from) { const [sg, wd] = b.from; const wi = segFirst[sg] + wd; return { wi, t: sg === 0 && wd === 0 ? 0 : wd === 0 ? mid(sg - 1) : words[wi].t0 - 0.04 }; }
  if (b.reset) cursor = 0;
  const i = findAnchor(b.at, cursor);
  cursor = i + 1;
  return { wi: i, t: Math.max(0, timeOfWord(i) + (b.offset || 0)) };
};
const starts = script.beats.map(startOfBeat);
const info = script.beats.map((b, i) => ({ name: b.scene, t0: starts[i].t, t1: b.until ? timeOfWord(findAnchor(b.until, starts[i].wi + 1)) : i < starts.length - 1 ? starts[i + 1].t : T }));
// ctx.rel(plan, « mots », décalage) : instant (relatif au début du plan) où la voix dit ces mots.
const ANT = script.anticipation ?? 0.45;   // les éléments arrivent AVANT le mot : le temps que l'œil les lise
const ctx = {
  rel(name, phrase, offset = 0) {
    const bi = info.find((x) => x.name === name);
    if (!bi) throw new Error(`plan inconnu : ${name}`);
    const toks = phrase.split(/\s+/).map(norm).filter(Boolean);
    for (let i = 0; i + toks.length <= words.length; i++) {
      if (words[i].t0 >= bi.t0 - 0.06 && words[i].t0 < bi.t1 && toks.every((tk, k) => words[i + k].n === tk)) return Math.max(0, words[i].t0 - bi.t0 - ANT + offset);
    }
    throw new Error(`mots introuvables dans le plan « ${name} » : « ${phrase} »`);
  },
  dur: (name) => { const b = info.find((x) => x.name === name); return b.t1 - b.t0; },
};
const { scenes } = await import(pathToFileURL(path.join(dir, "scenes.mjs")).href);
const lib = scenes(C, ctx);
const beats = script.beats.map((b, i) => {
  const sc = lib[b.scene], pre = `b${i}-`;
  if (!sc) throw new Error(`scène manquante : ${b.scene}`);
  return {
    name: b.scene, t0: info[i].t0, t1: info[i].t1,
    svg: sc.svg.replace(/ id="([^"]+)"/g, (m, id) => ` id="${pre}${id}"`).replace(/url\(#(?!paper|kraft|vignette|light)([^)]+)\)/g, (m, id) => `url(#${pre}${id})`),
    anims: sc.anims.map((a) => ({ ...a, id: pre + a.id })),
    loops: (sc.loops || []).map((l) => ({ ...l, id: pre + l.id })),
    cam: sc.cam, bgY: sc.bgY ?? -300, bgH: sc.bgH ?? 2520, punches: sc.punches || [], sfx: sc.sfx || [],
    overlay: (sc.overlay || "").replace(/ id="([^"]+)"/g, (m, id) => ` id="${pre}${id}"`),
  };
});

// 3. Sous-titres : 2 mots maximum, coupés à la ponctuation.
const subs = [];
let cur = [];
const flush = () => { if (cur.length) { subs.push({ t0: cur[0].t0, text: cur.map((x) => x.w.replace(/[,.;]$/g, "")).join(" "), last: cur[cur.length - 1].t1 }); cur = []; } };
for (const w of words) { cur.push(w); if (cur.length === 2 || /[,.?!:;]$/.test(w.w)) flush(); }
flush();
const emRe = new RegExp(script.emphasis || "$^", "i");
subs.forEach((s, i) => { s.t1 = i < subs.length - 1 ? Math.min(subs[i + 1].t0, s.last + 0.2) : s.last + 0.3; s.em = emRe.test(s.text); });

// 4. Page de rendu.
const scenesSvg = beats.map((b, i) => `<g id="scene-${i}" style="display:none"><g id="cam-${i}"><g transform="translate(0 ${b.bgY})">${kraftBackground(W, b.bgH, C, 5 + (i % 7))}</g>${b.svg}</g>${b.overlay}</g>`).join("");
const html = `<!doctype html><meta charset="utf-8"><body style="margin:0;background:#000">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">${defs()}${scenesSvg}${finish(W, H)}
<g id="subs" style="display:none"><text id="subtxt" x="540" y="1480" text-anchor="middle" font-family="Inter, 'DejaVu Sans', sans-serif" font-weight="900" font-size="104" fill="#fff" stroke="${C.dark}" stroke-width="16" stroke-linejoin="round" paint-order="stroke"></text></g></svg>
<script>window.DATA=${JSON.stringify({ beats, subs, accent: C.accent })}</script><script>${readFileSync(new URL("./player.js", import.meta.url), "utf8")}</script>`;
writeFileSync(path.join(out, "render.html"), html);
writeFileSync(path.join(out, "storyboard.json"), JSON.stringify({ beats: info, subs }, null, 1));

const browser = await chromium.launch();
const openPage = async () => { const p = await browser.newPage({ viewport: { width: W, height: H } }); await p.setContent(html); return p; };

// Aperçus rapides : 4 images réparties dans chaque plan demandé.
if (at.length || peek.length) {
  const page = await openPage();
  const miss = await page.evaluate(() => window.missingIds());
  if (miss.length) console.log("IDS MANQUANTS :", miss.join(", "));
  const jobs = [...at.map((t) => [`t${t}`, t])];
  for (const name of peek) {
    const b = info.find((x) => x.name === name);
    if (!b) throw new Error(`plan inconnu : ${name}`);
    [0.12, 0.38, 0.64, 0.92].forEach((f, k) => jobs.push([`${name}_${k}`, b.t0 + f * (b.t1 - b.t0), info.indexOf(b)]));
  }
  for (const [label, t, bi] of jobs) { await page.evaluate(([x, i]) => window.setFrame(x, i), [t, bi]); await page.screenshot({ path: path.join(out, `preview_${label}.png`) }); }
  await browser.close();
  console.log("aperçus :", jobs.map((j) => j[0]).join(", "));
  process.exit(0);
}

// 5. QA statique (page) + rendu image par image avec cache par plan.
const qa = { checks: [], warnings: [] };
const check = (name, ok, detail = "") => qa.checks.push({ name, ok, detail });
{
  const page = await openPage();
  const missing = await page.evaluate(() => window.missingIds());
  check("ids animés présents", missing.length === 0, missing.join(","));
  const m = await page.evaluate(() => window.measureSubs());
  check("sous-titres dans la largeur sûre (≤ 900 px)", m.every((x) => x.w <= 900), m.filter((x) => x.w > 900).map((x) => x.text).join(" | "));
  check("sous-titres dans la zone sûre verticale (1300–1580)", m.every((x) => x.y0 >= 1300 && x.y1 <= 1580), JSON.stringify(m[0]));
  await page.close();
}
const N = Math.min(Math.ceil(T * FPS), limit);
const sha = (x) => createHash("sha1").update(x).digest("hex");
const todo = [];
let cached = 0;
beats.forEach((b, i) => {
  const a = Math.ceil(b.t0 * FPS), z = Math.min(Math.ceil(b.t1 * FPS), N);
  const rel = subs.filter((s) => s.t1 > b.t0 && s.t0 < b.t1);
  const h = sha(JSON.stringify({ b, rel, FPS, bg: i % 7, R: readFileSync(new URL("./paper.mjs", import.meta.url), "utf8").length, P: readFileSync(new URL("./player.js", import.meta.url), "utf8").length }));
  const hf = path.join(framesDir, `hash_${i}.txt`);
  const ok = existsSync(hf) && readFileSync(hf, "utf8") === h && Array.from({ length: z - a }, (_, k) => existsSync(path.join(framesDir, `f_${String(a + k).padStart(5, "0")}.jpg`))).every(Boolean);
  if (ok) cached += z - a;
  else for (let k = a; k < z; k++) todo.push([k, i, h]);
});
console.log(`${N} images : ${cached} en cache, ${todo.length} à rendre`);
const t0 = Date.now();
const WORKERS = 4;
const done = new Set();
await Promise.all(Array.from({ length: WORKERS }, async (_, w) => {
  if (!todo.length) return;
  const page = await openPage();
  for (let n = w; n < todo.length; n += WORKERS) {
    const [k, i] = todo[n];
    await page.evaluate((t) => window.setFrame(t), k / FPS);
    for (let tryN = 0; ; tryN++) {
      try { await page.screenshot({ path: path.join(framesDir, `f_${String(k).padStart(5, "0")}.jpg`), type: "jpeg", quality: 93, timeout: 120000 }); break; }
      catch (e) { if (tryN >= 3) throw e; await page.evaluate((t) => window.setFrame(t), k / FPS); }
    }
    if (w === 0 && n % 80 === 0) console.log(`  … ${n}/${todo.length}`);
  }
  await page.close();
}));
await browser.close();
todo.forEach(([k, i, h]) => writeFileSync(path.join(framesDir, `hash_${i}.txt`), h));
const renderS = (Date.now() - t0) / 1000;
console.log(`rendu : ${todo.length} images en ${renderS.toFixed(1)} s`);

// 6. Audio : voix + bruitages synthétisés (déduits des animations), puis assemblage.
const events = eventsFromBeats(beats);
const sfxFile = path.join(out, "sfx.wav");
renderSfx(events, T, sfxFile);
writeFileSync(path.join(out, "sfx_events.json"), JSON.stringify(events));
console.log(`bruitages : ${events.length} événements`);
const args = ["-y", "-v", "error", "-framerate", String(FPS), "-i", path.join(framesDir, "f_%05d.jpg"), "-i", path.join(dir, script.voice), "-i", sfxFile];
const fc = [
  `[1:a]atrim=0:${T},asetpts=PTS-STARTPTS,afade=t=out:st=${T - 0.4}:d=0.4,asplit=2[v][vs]`,
  `[2:a]atrim=0:${T},asetpts=PTS-STARTPTS,highpass=f=110,lowpass=f=5500,volume=${script.sfxVolume ?? 0.4}[fx0]`,
  // les bruitages s'effacent sous la voix (side-chain) : on entend toujours le texte
  `[fx0][vs]sidechaincompress=threshold=0.012:ratio=14:attack=6:release=260:makeup=1[fx]`,
  `[v][fx]amix=inputs=2:normalize=0:duration=first,loudnorm=I=-14:TP=-1.5:LRA=11[a]`,
].join(";");
const mp4 = path.join(out, "final_9x16.mp4");
execFileSync("ffmpeg", [...args, "-filter_complex", fc, "-map", "0:v", "-map", "[a]", "-vf", "fps=30,format=yuv420p", "-c:v", "libx264", "-crf", "23", "-preset", "medium", "-c:a", "aac", "-b:a", "192k", "-t", String(T), mp4], { stdio: "inherit" });

// 7. QA déterministe + avertissements d'allégations.
const dur = Number(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", mp4]).toString());
check("durée vidéo = durée cible ± 0,2 s", limit !== Infinity || Math.abs(dur - T) < 0.2, `${dur.toFixed(2)} s`);
beats.forEach((b) => check(`plan « ${b.name} » entre 0,6 et 8 s`, b.t1 - b.t0 >= 0.6 && b.t1 - b.t0 <= 8, `${(b.t1 - b.t0).toFixed(2)} s`));
const allowed = new Set([...Object.values(C), ...(brand.derived || [])].map((x) => x.toLowerCase()));
const used = new Set(beats.flatMap((b) => b.svg.match(/#[0-9a-fA-F]{6}\b/g) || []).map((x) => x.toLowerCase()));
const rogue = [...used].filter((x) => !allowed.has(x));
check("couleurs dans la palette (palette + dérivées)", rogue.length === 0, rogue.join(","));
const fullText = script.segments.map((s) => s.text).join(" ");
for (const m of fullText.matchAll(/[^.!?]*(quatre-vingt-quatorze pour cent|\d+ ?%|rembours|garantie|offert|recommandent)[^.!?]*[.!?]/gi)) qa.warnings.push(`Allégation à justifier avant diffusion : « ${m[0].trim()} »`);
writeFileSync(path.join(out, "qa_report.json"), JSON.stringify({ ...qa, renderSeconds: renderS, frames: N }, null, 2));
for (const c of qa.checks) console.log(`${c.ok ? "OK  " : "FAIL"} ${c.name}${c.detail ? " — " + c.detail : ""}`);
for (const w of qa.warnings) console.log(`WARN ${w}`);
