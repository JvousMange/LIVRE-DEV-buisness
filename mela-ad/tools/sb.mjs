// rend chaque plan du storyboard (départ/arrivée). usage: node tools/sb.mjs out_dir [ids]
import { chromium } from "playwright-core"; import http from "node:http"; import fs from "node:fs"; import path from "node:path"; import { fileURLToPath } from "node:url";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "web");
const srv = http.createServer((q, r) => { const f = path.join(root, decodeURIComponent(q.url.split("?")[0])); fs.readFile(f, (e, d) => { if (e) { r.writeHead(404); r.end(); } else { r.writeHead(200, { "content-type": { ".html": "text/html", ".woff2": "font/woff2", ".js": "text/javascript" }[path.extname(f)] || "application/octet-stream" }); r.end(d); } }); });
await new Promise(r => srv.listen(0, r)); const port = srv.address().port;
const exe = fs.readdirSync("/opt/pw-browsers").filter(d => d.startsWith("chromium-")).map(d => `/opt/pw-browsers/${d}/chrome-linux/chrome`).find(fs.existsSync);
const b = await chromium.launch({ executablePath: exe, args: ["--no-sandbox", "--disable-gpu"] });
const [out, ids = ""] = process.argv.slice(2); fs.mkdirSync(out, { recursive: true });
const pg = await b.newPage({ viewport: { width: 1080, height: 1920 } });
pg.on("pageerror", e => console.log("ERR", e.message));
await pg.goto(`http://localhost:${port}/sb.html`); await pg.evaluate(() => window.READY);
const list = await pg.evaluate(() => window.SBLIST), vo = await pg.evaluate(() => window.SBVO);
fs.writeFileSync(`${out}/vo.json`, JSON.stringify({ list, vo }));
for (const id of list) { if (ids && !ids.split(",").includes(id)) continue; for (const e of [0, 1]) { try { await pg.evaluate(([id, e]) => window.drawSB(id, !!e), [id, e]); await pg.screenshot({ path: `${out}/${id}_${e}.jpg`, type: "jpeg", quality: 88 }); } catch (err) { console.log("FAIL", id, e, err.message.split("\n")[0]); } } }
await b.close(); srv.close(); console.log("ok", list.length);
