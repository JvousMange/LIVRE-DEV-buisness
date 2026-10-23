import { chromium } from "playwright-core"; import http from "node:http"; import fs from "node:fs"; import path from "node:path"; import { fileURLToPath } from "node:url";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "web");
const srv = http.createServer((q, r) => { const f = path.join(root, decodeURIComponent(q.url.split("?")[0])); fs.readFile(f, (e, d) => { if (e) { r.writeHead(404); r.end(); } else { r.writeHead(200, { "content-type": { ".html": "text/html", ".woff2": "font/woff2" }[path.extname(f)] || "application/octet-stream" }); r.end(d); } }); });
await new Promise(r => srv.listen(0, r)); const port = srv.address().port;
const exe = fs.readdirSync("/opt/pw-browsers").filter(d => d.startsWith("chromium-")).map(d => `/opt/pw-browsers/${d}/chrome-linux/chrome`).find(fs.existsSync);
const b = await chromium.launch({ executablePath: exe, args: ["--no-sandbox", "--disable-gpu"] });
const [page, qs, out] = process.argv.slice(2); const pg = await b.newPage({ viewport: { width: 1080, height: 1920 } });
pg.on("pageerror", e => console.error("ERR", e.message));
await pg.goto(`http://localhost:${port}/${page}?${qs}`); await pg.evaluate(() => window.READY); await pg.screenshot({ path: out, type: "png" }); await b.close(); srv.close();
