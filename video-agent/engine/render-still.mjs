// Usage : node render-still.mjs <scene.mjs> <out.svg> <out.png>
import { writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");

const [sceneFile, outSvg, outPng] = process.argv.slice(2);
const { scene } = await import(pathToFileURL(resolve(sceneFile)).href);
const svg = scene();
writeFileSync(outSvg, svg);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
const t0 = Date.now();
await page.setContent(`<html><body style="margin:0;background:#000">${svg}</body></html>`);
await page.screenshot({ path: outPng });
console.log(`rendu en ${Date.now() - t0} ms`);
await browser.close();
