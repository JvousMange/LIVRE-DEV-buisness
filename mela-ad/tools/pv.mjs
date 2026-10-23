// aperçu : une image par plan (à une fraction du plan). usage: node tools/pv.mjs k4.html out_dir [frac=.55] [ids,comma]
import { chromium } from "playwright-core"; import http from "node:http"; import fs from "node:fs"; import path from "node:path"; import { fileURLToPath } from "node:url";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "web");
const srv = http.createServer((q, r) => { const f = path.join(root, decodeURIComponent(q.url.split("?")[0])); fs.readFile(f, (e, d) => { if (e) { r.writeHead(404); r.end(); } else { r.writeHead(200, { "content-type": { ".html": "text/html", ".woff2": "font/woff2", ".js": "text/javascript" }[path.extname(f)] || "application/octet-stream" }); r.end(d); } }); });
await new Promise(r => srv.listen(0, r)); const port = srv.address().port;
const exe = fs.readdirSync("/opt/pw-browsers").filter(d => d.startsWith("chromium-")).map(d => `/opt/pw-browsers/${d}/chrome-linux/chrome`).find(fs.existsSync);
const b = await chromium.launch({ executablePath: exe, args: ["--no-sandbox", "--disable-gpu"] });
const [page, out, frac = ".55", ids = ""] = process.argv.slice(2); fs.mkdirSync(out, { recursive: true });
const pg = await b.newPage({ viewport: { width: 1080, height: 1920 } });
pg.on("pageerror", e => console.log("ERR", e.message));
await pg.goto(`http://localhost:${port}/${page}`); await pg.evaluate(() => window.READY);
const info = await pg.evaluate(() => plan.map(s => [s.id, s.start, s.end]));
const want = ids ? ids.split(",") : null;
for (let i = 0; i < info.length; i++) { const [id, s, e] = info[i]; if (want && !want.includes(id)) continue; const t = s + (e - s) * parseFloat(frac); await pg.evaluate(t => window.renderAt(t), t); await pg.screenshot({ path: `${out}/${String(i).padStart(2, "0")}_${id}.jpg`, type: "jpeg", quality: 85 }); }
console.log(info.map(([id, s, e]) => `${id}:${(e - s).toFixed(1)}`).join(" "));
await b.close(); srv.close();
