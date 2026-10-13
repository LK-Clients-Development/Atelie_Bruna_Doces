// Captura só o Header (DPR 2, para enxergar nitidez) da Home (topo/claro e rolada/sólido) e de /produtos.
// Uso: node docs/qa/brand-logo/capture-header.mjs <rotulo: before|after> [base-url] [larguras] [pasta]
// Saída: <pasta>/<rotulo>-<pagina>-<largura>.webp  +  <pasta>/<rotulo>-metrics.json (tamanho renderizado da logo, overflow)
import { spawn } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const LABEL = process.argv[2] ?? 'after';
const BASE = process.argv[3] ?? 'http://localhost:4399';
const WIDTHS = (process.argv[4] ?? '1440,1280,1024,768,430,390,360').split(',').map(Number);
const OUT = process.argv[5] ?? 'docs/qa/brand-logo';
mkdirSync(OUT, { recursive: true });
const CHROME = process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const PORT = 9397;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${PORT}`, `--user-data-dir=${mkdtempSync(join(tmpdir(), 'qa-hd-'))}`, '--hide-scrollbars', '--no-first-run', 'about:blank'], { stdio: 'ignore' });
const metrics = {};
try {
  let targets;
  for (let i = 0; i < 50; i++) { try { targets = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json(); if (targets.length) break; } catch {} await sleep(200); }
  const ws = new WebSocket(targets.find((t) => t.type === 'page').webSocketDebuggerUrl);
  await new Promise((r) => (ws.onopen = r));
  let id = 0; const pending = new Map(); const errors = [];
  ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); } if (d.method === 'Runtime.exceptionThrown') errors.push(d.params.exceptionDetails.text); };
  const send = (method, params = {}) => new Promise((res, rej) => { const n = ++id; pending.set(n, (d) => (d.error ? rej(new Error(JSON.stringify(d.error))) : res(d.result))); ws.send(JSON.stringify({ id: n, method, params })); });
  const ev = async (e) => (await send('Runtime.evaluate', { expression: e, awaitPromise: true, returnByValue: true })).result.value;
  await send('Page.enable'); await send('Runtime.enable');
  const pages = [['home-topo', '/', 0], ['home-rolada', '/', 1500], ['produtos', '/produtos', 0]];
  for (const w of WIDTHS) {
    for (const [name, path, scroll] of pages) {
      await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
      await send('Emulation.setDeviceMetricsOverride', { width: w, height: 800, deviceScaleFactor: 2, mobile: w < 700 });
      await send('Page.navigate', { url: BASE + path }); await sleep(3000);
      if (scroll) { await ev(`window.scrollTo(0, ${scroll}); 1`); await sleep(900); }
      const m = await ev(`(() => { const h = document.querySelector('.site-header'); const vis = [...h.querySelectorAll('.site-header__logo .logo')].find((i) => getComputedStyle(i).display !== 'none'); const r = vis.getBoundingClientRect(); const hr = h.getBoundingClientRect(); const FR = vis.classList.contains('logo--light') ? { w: 264 / 276, h: 67 / 86, l: 5 / 276, t: 13 / 86 } : { w: 1858 / 1944, h: 424 / 510, l: 43 / 1944, t: 43 / 510 }; const ink = { w: +(r.width * FR.w).toFixed(1), h: +(r.height * FR.h).toFixed(1), left: +(r.left + r.width * FR.l).toFixed(1), top: +(r.top + r.height * FR.t).toFixed(1) }; const nav = document.querySelector('.site-nav a'); const navLeft = nav ? Math.round(nav.getBoundingClientRect().left) : null; return { ink, navLeft, gapToNav: navLeft ? Math.round(navLeft - (r.left + r.width * (FR.l + FR.w))) : null, surface: h.dataset.surface, variant: vis.className, src: vis.currentSrc.split('/').pop(), natural: vis.naturalWidth + 'x' + vis.naturalHeight, rendered: Math.round(r.width) + 'x' + Math.round(r.height), logoLeft: Math.round(r.left), logoTop: Math.round(r.top - hr.top), headerH: Math.round(hr.height), overflow: document.documentElement.scrollWidth > innerWidth, complete: vis.complete && vis.naturalWidth > 0 }; })()`);
      metrics[`${name}-${w}`] = m;
      const shot = await send('Page.captureScreenshot', { format: 'webp', quality: 92, clip: { x: 0, y: 0, width: w, height: Math.min(150, m.headerH + 10), scale: 1 } });
      writeFileSync(join(OUT, `${LABEL}-${name}-${w}.webp`), Buffer.from(shot.data, 'base64'));
    }
  }
  writeFileSync(join(OUT, `${LABEL}-metrics.json`), JSON.stringify({ errors, metrics }, null, 2));
  console.log(Object.entries(metrics).map(([k, v]) => `${k}: ${v.surface} ${v.variant.split(' ').pop()} ${v.natural}→${v.rendered} ink ${v.ink.w}x${v.ink.h} gapNav=${v.gapToNav} overflow=${v.overflow}`).join('\n'));
} finally { chrome.kill(); }
