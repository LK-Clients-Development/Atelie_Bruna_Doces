// Mede, em cada largura, quanto cada foto de tile é AMPLIADA em relação ao arquivo original (fator de `object-fit: cover`).
// Serve para registrar "ASSET-LIMITED DEVIATION": o desfoque vem da fonte (Yooga ≤ 500 px), não do layout.
// Uso: node docs/qa/portfolio-gallery/asset-scale.mjs [url] [saida.json] [larguras]
import { spawn } from 'node:child_process';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const URL_ = process.argv[2] ?? 'http://localhost:4399/produtos';
const OUT = process.argv[3] ?? 'docs/qa/portfolio-gallery/asset-scale.json';
const WIDTHS = (process.argv[4] ?? '1440,1024,390').split(',').map(Number);
const CHROME = process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const PORT = 9395;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${PORT}`, `--user-data-dir=${mkdtempSync(join(tmpdir(), 'qa-as-'))}`, '--force-device-scale-factor=1', '--no-first-run', 'about:blank'], { stdio: 'ignore' });
try {
  let targets;
  for (let i = 0; i < 50; i++) { try { targets = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json(); if (targets.length) break; } catch {} await sleep(200); }
  const ws = new WebSocket(targets.find((t) => t.type === 'page').webSocketDebuggerUrl);
  await new Promise((r) => (ws.onopen = r));
  let id = 0; const pending = new Map();
  ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); } };
  const send = (method, params = {}) => new Promise((res, rej) => { const n = ++id; pending.set(n, (d) => (d.error ? rej(new Error(JSON.stringify(d.error))) : res(d.result))); ws.send(JSON.stringify({ id: n, method, params })); });
  const ev = async (e) => (await send('Runtime.evaluate', { expression: e, awaitPromise: true, returnByValue: true })).result.value;
  await send('Page.enable'); await send('Runtime.enable');
  const out = {};
  for (const w of WIDTHS) {
    await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
    await send('Emulation.setDeviceMetricsOverride', { width: w, height: 900, deviceScaleFactor: 1, mobile: w < 700 });
    await send('Page.navigate', { url: URL_ }); await sleep(2500);
    await ev(`document.querySelectorAll('img[loading=lazy]').forEach((i) => (i.loading = 'eager')); 1`); await sleep(2500);
    out[w] = await ev(`[...document.querySelectorAll('.ptile')].map((t) => { const i = t.querySelector('img'); const r = t.getBoundingClientRect(); return { slug: t.dataset.slug, tile: Math.round(r.width) + 'x' + Math.round(r.height), natural: i.naturalWidth + 'x' + i.naturalHeight, scale: +Math.max(r.width / i.naturalWidth, r.height / i.naturalHeight).toFixed(2) }; })`);
  }
  const summary = Object.fromEntries(Object.entries(out).map(([w, list]) => [w, { max: Math.max(...list.map((x) => x.scale)), over140: list.filter((x) => x.scale >= 1.4).map((x) => `${x.slug} ×${x.scale} (${x.natural} → ${x.tile})`) }]));
  writeFileSync(OUT, JSON.stringify({ url: URL_, note: 'scale = fator de ampliação do arquivo no tile (cover). ≥ 1,4 = desfoque perceptível; vem da fonte (ASSET-LIMITED).', summary, tiles: out }, null, 2));
  console.log(JSON.stringify(summary, null, 2));
} finally { chrome.kill(); }
