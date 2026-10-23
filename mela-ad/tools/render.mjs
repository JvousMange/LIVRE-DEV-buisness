// Rendu image par image (même principe que Remotion : positionner -> capturer -> ffmpeg)
import { chromium } from "playwright-core";
import http from "node:http"; import fs from "node:fs"; import path from "node:path"; import { fileURLToPath } from "node:url";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const web = path.join(root, "web");
const args = Object.fromEntries(process.argv.slice(2).map(a => a.replace(/^--/, "").split("=")));
const out = args.out || path.join(root, "tmp/frames"); fs.mkdirSync(out, { recursive: true });
const HOOK = args.hook || "A"; const workers = +(args.workers || 4), W = +(args.w || 1080), Hh = +(args.h || 1920);
const mime = { ".html": "text/html", ".js": "text/javascript", ".png": "image/png", ".jpg": "image/jpeg", ".woff2": "font/woff2" };
const srv = http.createServer((q, r) => { const f = path.join(web, decodeURIComponent(q.url.split("?")[0]).replace(/^\/$/, "/index.html")); fs.readFile(f, (e, d) => { if (e) { r.writeHead(404); r.end(); } else { r.writeHead(200, { "content-type": mime[path.extname(f)] || "application/octet-stream" }); r.end(d); } }); });
await new Promise(r => srv.listen(0, r)); const port = srv.address().port;
const exe = fs.readdirSync("/opt/pw-browsers").filter(d => d.startsWith("chromium-")).map(d => `/opt/pw-browsers/${d}/chrome-linux/chrome`).find(fs.existsSync);
const browser = await chromium.launch({ executablePath: exe, args: ["--force-color-profile=srgb", "--no-sandbox", "--disable-gpu"] });
async function mkPage() { const pg = await browser.newPage({ viewport: { width: 1080, height: 1920 } }); pg.on("pageerror", e => console.error("PAGE ERROR", e.message)); pg.on("console", m => m.type() === "error" && console.error("console:", m.text())); await pg.goto(`http://localhost:${port}/?hook=${HOOK}`); await pg.evaluate(() => window.READY); return pg; }
const probe = await mkPage(); const total = await probe.evaluate(() => window.TOTAL);
if (args.sfx) { fs.writeFileSync(args.sfx, JSON.stringify({ total, plan: await probe.evaluate(() => window.PLAN), sfx: await probe.evaluate(() => window.sfxList()) }, null, 1)); }
let frames;
if (args.at) frames = args.at.split(",").map(s => Math.round(parseFloat(s) * 12));
else { const n = Math.ceil(total * 12); const from = +(args.from || 0), to = Math.min(+(args.to || n), n); frames = []; for (let i = from; i < to; i++) frames.push(i); }
if (args.sfx && !args.at && args.sfxonly) { await browser.close(); srv.close(); process.exit(0); }
const pages = [probe]; for (let i = 1; i < workers; i++) pages.push(await mkPage());
let idx = 0, done = 0; const t0 = Date.now();
await Promise.all(pages.map(async pg => { while (true) { const i = idx++; if (i >= frames.length) break; const f = frames[i]; await pg.evaluate(t => window.renderAt(t), f / 12 + 1e-3); const file = path.join(out, args.at ? `at_${String(f).padStart(5, "0")}.jpg` : `${String(f).padStart(5, "0")}.jpg`); await pg.screenshot({ path: file, type: "jpeg", quality: 94, clip: { x: 0, y: 0, width: 1080, height: 1920 } }); if (++done % 60 === 0) console.log(`${done}/${frames.length} ${((Date.now() - t0) / 1000).toFixed(0)}s`); } }));
console.log("total s", total.toFixed(2), "frames", frames.length, "en", ((Date.now() - t0) / 1000).toFixed(0), "s");
await browser.close(); srv.close();
