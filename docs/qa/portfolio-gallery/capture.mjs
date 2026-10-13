// Capturas de /produtos (topo da viewport + página inteira) em Chrome headless (CDP), sem dependências.
//
// Uso: node docs/qa/portfolio-gallery/capture.mjs [url] [pasta] [larguras separadas por vírgula]
//   ex.: node docs/qa/portfolio-gallery/capture.mjs http://localhost:4399/produtos docs/qa/portfolio-gallery 1440,1024,768,390
// Saída: <pasta>/page-<largura>.webp (página inteira) e top-<largura>.webp (primeira dobra).
import { spawn } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const URL_ = process.argv[2] ?? 'http://localhost:4399/produtos';
const OUT = process.argv[3] ?? 'docs/qa/portfolio-gallery';
const WIDTHS = (process.argv[4] ?? '1440,1280,1024,768,430,390,360').split(',').map(Number);
mkdirSync(OUT, { recursive: true });
const CHROME = process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const PORT = 9381;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${PORT}`, `--user-data-dir=${mkdtempSync(join(tmpdir(), 'qa-cap-'))}`, '--hide-scrollbars', '--force-device-scale-factor=1', '--no-first-run', 'about:blank'], { stdio: 'ignore' });

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
  for (const w of WIDTHS) {
    await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
    await send('Emulation.setDeviceMetricsOverride', { width: w, height: 900, deviceScaleFactor: 1, mobile: w < 700 });
    await send('Page.navigate', { url: URL_ }); await sleep(2500);
    await ev(`document.documentElement.style.scrollBehavior = 'auto'; document.querySelectorAll('img[loading=lazy]').forEach((i) => (i.loading = 'eager')); 1`);
    await sleep(1200);
    const top = await send('Page.captureScreenshot', { format: 'webp', quality: 84 });
    writeFileSync(join(OUT, `top-${w}.webp`), Buffer.from(top.data, 'base64'));
    for (const sec of (process.env.SECTIONS ?? '').split(',').filter(Boolean)) {
      await ev(`window.scrollTo(0, document.getElementById('${sec}').getBoundingClientRect().top + scrollY - 140); 1`); await sleep(500);
      const part = await send('Page.captureScreenshot', { format: 'webp', quality: 82 });
      writeFileSync(join(OUT, `sec-${sec}-${w}.webp`), Buffer.from(part.data, 'base64'));
    }
    await ev('window.scrollTo(0, 0); 1');
    if (process.env.FULL && !process.env.FULL.split(',').map(Number).includes(w)) { console.log(`${w}px: topo + seções`); continue; }
    const h = await ev('Math.ceil(document.documentElement.scrollHeight)');
    await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: w < 700 });
    await sleep(800);
    // páginas muito altas (> 12000 px) estouram o limite do Chrome: saem em partes (page-<w>-1, -2, ...)
    const CHUNK = 9000;
    if (h <= 12000) {
      const full = await send('Page.captureScreenshot', { format: 'webp', quality: 74, captureBeyondViewport: true });
      writeFileSync(join(OUT, `page-${w}.webp`), Buffer.from(full.data, 'base64'));
    } else {
      for (let y = 0, n = 1; y < h; y += CHUNK, n += 1) {
        const part = await send('Page.captureScreenshot', { format: 'webp', quality: 74, captureBeyondViewport: true, clip: { x: 0, y, width: w, height: Math.min(CHUNK, h - y), scale: 1 } });
        writeFileSync(join(OUT, `page-${w}-${n}.webp`), Buffer.from(part.data, 'base64'));
      }
    }
    console.log(`${w}px: página ${h}px`);
  }
} finally { chrome.kill(); }
