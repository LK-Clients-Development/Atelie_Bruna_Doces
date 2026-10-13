// QA da intro de marca (flor) em Chrome headless (CDP, sem dependências).
//
// Cenários: nova sessão → Home; Home → Produtos; Produtos → Home; reload; nova sessão → /produtos;
// reduced-motion; JS lento/animação travada (failsafe); sem JS; CLS; primeiro frame; tempos reais.
// Capturas determinísticas (animações pausadas em instantes fixos) em 1440×900 e 390×844 + folha de contato.
//
// Uso (com `npm run build && npx astro preview --port 4399`):
//   node docs/qa/brand-intro/qa-intro.mjs [url-base] [pasta-de-saida]
import { spawn } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const BASE = process.argv[2] ?? 'http://localhost:4399';
const OUT = process.argv[3] ?? 'docs/qa/brand-intro';
mkdirSync(OUT, { recursive: true });
const CHROME = process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const PORT = 9399;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${PORT}`, `--user-data-dir=${mkdtempSync(join(tmpdir(), 'qa-bi-'))}`, '--hide-scrollbars', '--force-device-scale-factor=1', '--no-first-run', 'about:blank'], { stdio: 'ignore' });
const results = [];
const check = (name, ok, detail = '') => { results.push({ name, ok: Boolean(ok), detail }); console.log((ok ? 'PASS ' : 'FAIL ') + name + (detail ? '  ' + detail : '')); };

// instrumentação injetada antes de qualquer script da página
const HOOK = `(() => {
  window.__t = {}; window.__cls = 0; window.__first = null; window.__anims = [];
  const note = (k) => { if (!(k in window.__t)) window.__t[k] = Math.round(performance.now()); };
  new MutationObserver(() => {
    const r = document.documentElement;
    if (r.classList.contains('intro-pending')) note('pending');
    if (r.classList.contains('intro-leaving')) note('leaving');
    if ('pending' in window.__t && !r.classList.contains('intro-pending') && !r.classList.contains('intro-leaving')) note('done');
  }).observe(document, { attributes: true, subtree: true, attributeFilter: ['class'] });
  document.addEventListener('DOMContentLoaded', () => {
    const h = document.querySelector('.site-header'); const o = document.querySelector('[data-brand-intro]');
    const r = document.documentElement;
    window.__first = { pending: r.classList.contains('intro-pending'), headerVisibility: h && getComputedStyle(h).visibility, overlayDisplay: o && getComputedStyle(o).display, htmlBg: getComputedStyle(r).backgroundColor };
  });
  new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cls += e.value; }).observe({ type: 'layout-shift', buffered: true });
  const orig = Element.prototype.animate;
  Element.prototype.animate = function (k, o) {
    if (window.__qaDeadAnimate) return { onfinish: null, cancel() {}, finished: new Promise(() => {}) };
    const a = orig.call(this, k, o); window.__anims.push(a); if (window.__qaPause) a.pause(); return a;
  };
})();`;

async function tab(opts = {}) {
  const t = await (await fetch(`http://127.0.0.1:${PORT}/json/new?about:blank`, { method: 'PUT' })).json();
  const ws = new WebSocket(t.webSocketDebuggerUrl);
  await new Promise((r) => (ws.onopen = r));
  let id = 0; const pending = new Map(); const errors = [];
  ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); } if (d.method === 'Runtime.exceptionThrown') errors.push(d.params.exceptionDetails.exception?.description ?? d.params.exceptionDetails.text); };
  const send = (method, params = {}) => new Promise((res, rej) => { const n = ++id; pending.set(n, (d) => (d.error ? rej(new Error(JSON.stringify(d.error))) : res(d.result))); ws.send(JSON.stringify({ id: n, method, params })); });
  const ev = async (e) => { const r = await send('Runtime.evaluate', { expression: e, awaitPromise: true, returnByValue: true }); if (r.exceptionDetails) throw new Error(r.exceptionDetails.text); return r.result.value; };
  await send('Page.enable'); await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: opts.width ?? 1440, height: opts.height ?? 900, deviceScaleFactor: 1, mobile: (opts.width ?? 1440) < 700 });
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: opts.reduced ? 'reduce' : 'no-preference' }] });
  if (opts.noJs) await send('Emulation.setScriptExecutionDisabled', { value: true });
  const hook = HOOK + (opts.deadAnimate ? ';window.__qaDeadAnimate = true;' : '') + (opts.pause ? ';window.__qaPause = true;' : '');
  await send('Page.addScriptToEvaluateOnNewDocument', { source: hook });
  const nav = async (path) => { await send('Page.navigate', { url: BASE + path }); await sleep(60); };
  const state = () => ev(`(() => { const r = document.documentElement; const o = document.querySelector('[data-brand-intro]'); const h = document.querySelector('.site-header'); return { path: location.pathname, pending: r.classList.contains('intro-pending'), leaving: r.classList.contains('intro-leaving'), overlay: o ? getComputedStyle(o).display : 'ausente', overlayInDom: !!o, headerVis: h ? getComputedStyle(h).visibility : null, overflow: getComputedStyle(r).overflow, flag: sessionStorage.getItem('brunaBrandIntroSeen'), t: window.__t }; })()`);
  const waitDone = async (max = 4000) => { const t0 = Date.now(); while (Date.now() - t0 < max) { const s = await state().catch(() => null); if (s && !s.pending && !s.leaving && s.t && s.t.done) return Date.now() - t0; await sleep(40); } return -1; };
  return { send, ev, nav, state, waitDone, errors, close: async () => { ws.close(); await fetch(`http://127.0.0.1:${PORT}/json/close/${t.id}`).catch(() => {}); } };
}

try {
  for (let i = 0; i < 50; i++) { try { await fetch(`http://127.0.0.1:${PORT}/json/version`); break; } catch { await sleep(200); } }

  // ---------- 1–4: sessão (mesma aba) ----------
  const A = await tab();
  await A.nav('/'); await sleep(250);
  let s = await A.state();
  const first = await A.ev('window.__first');
  check('1. nova sessão → Home: a intro aparece (classe + overlay visível + site oculto por trás)', s.pending && s.overlay === 'grid' && s.headerVis === 'hidden' && s.overflow === 'hidden', JSON.stringify({ pending: s.pending, overlay: s.overlay, headerVis: s.headerVis }));
  check('1b. primeiro frame: já no DOMContentLoaded o site está oculto e o overlay creme visível (sem "site → flash → intro")', first && first.pending && first.headerVisibility === 'hidden' && first.overlayDisplay === 'grid' && /251, 243, 235/.test(first.htmlBg), JSON.stringify(first));
  const dur = await A.waitDone();
  s = await A.state();
  const t = s.t;
  check('1c. a intro termina sozinha e tudo é restaurado (classes, overlay removido do DOM, scroll liberado)', dur > 0 && !s.pending && !s.leaving && !s.overlayInDom && s.overflow !== 'hidden' && s.headerVis === 'visible', `fim após ${dur} ms; ${JSON.stringify({ overlayInDom: s.overlayInDom, overflow: s.overflow })}`);
  check('1d. duração real da intro (classe → fim) entre 1,4 e 2,0 s; o site é revelado por trás ~1,4 s', t.done - t.pending >= 1400 && t.done - t.pending <= 2000 && t.leaving - t.pending >= 1300 && t.leaving - t.pending <= 1650, `pending=${t.pending}ms leaving=${t.leaving}ms done=${t.done}ms → total ${t.done - t.pending} ms (revela em ${t.leaving - t.pending} ms)`);
  check('1e. flag da sessão gravada (brunaBrandIntroSeen)', s.flag === '1');
  const clsV = await A.ev('window.__cls');
  check('1f. CLS ≈ 0 (≤ 0,001): a intro não empurra nada (a sobra é o swap de fonte do próprio site, que sem intro dá ~0,002)', clsV <= 0.001, `cls=${clsV}`);
  await A.nav('/produtos'); await sleep(300); s = await A.state();
  check('2. Home → Produtos: sem intro', !s.pending && s.overlay === 'none' && s.headerVis === 'visible' && !s.t.pending, JSON.stringify({ path: s.path, overlay: s.overlay }));
  await A.nav('/'); await sleep(300); s = await A.state();
  check('3. Produtos → Home: sem intro', !s.pending && s.overlay === 'none' && s.headerVis === 'visible' && !s.t.pending, JSON.stringify({ path: s.path, overlay: s.overlay }));
  await A.send('Page.reload'); await sleep(400); s = await A.state();
  check('4. reload na mesma sessão: sem intro', !s.pending && s.overlay === 'none' && s.headerVis === 'visible' && !s.t.pending, JSON.stringify({ overlay: s.overlay }));
  check('4b. sem erros de JS', A.errors.length === 0, A.errors.join(' | '));
  await A.close();

  // ---------- 5: nova sessão direto em /produtos ----------
  const B = await tab();
  await B.nav('/produtos'); await sleep(250); s = await B.state();
  check('5. nova sessão → /produtos direto: a intro aparece', s.pending && s.overlay === 'grid' && s.path === '/produtos', JSON.stringify({ pending: s.pending, path: s.path }));
  const dB = await B.waitDone(); s = await B.state();
  check('5b. e termina; /produtos fica visível e interativa', dB > 0 && s.headerVis === 'visible' && s.overflow !== 'hidden', `fim após ${dB} ms`);
  check('5c. modal, busca e filtros não foram afetados (clique no 1º tile abre o modal)', await B.ev(`(() => { document.querySelector('[data-open]').click(); const ok = !document.querySelector('[data-modal]').hidden; document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' })); return ok; })()`));
  await B.close();

  // ---------- 6: reduced motion ----------
  const R = await tab({ reduced: true });
  await R.nav('/'); const dR = await R.waitDone(); s = await R.state();
  const tr = s.t;
  check('6. prefers-reduced-motion: versão mínima (sem desenho), termina em ≤ 0,8 s', dR > 0 && tr.done - tr.pending <= 800, `total ${tr.done - tr.pending} ms`);
  check('6b. reduced-motion: nenhuma animação de traço/transform das pétalas foi criada', await R.ev(`window.__anims.every((a) => !(a.effect.getKeyframes().some((k) => 'strokeDashoffset' in k || (k.transform && /scale\\(1\\.03/.test(k.transform)))))`));
  await R.close();

  // ---------- 7: animação travada / JS lento → failsafe ----------
  const D = await tab({ deadAnimate: true });
  await D.nav('/'); await sleep(900); s = await D.state();
  check('7. JS lento: com a animação travada o overlay ainda cobre aos 0,9 s (não é loader)', s.pending && s.overlay === 'grid');
  const dD = await D.waitDone(4500); s = await D.state();
  check('7b. failsafe: some sozinho em ≤ 2,6 s e o site fica livre', dD > 0 && s.t.done - s.t.pending <= 2600 && s.headerVis === 'visible' && s.overflow !== 'hidden', `fim após ${dD} ms (classe→fim ${s.t.done - s.t.pending} ms)`);
  await D.close();

  // ---------- 8: sem JS ----------
  const N = await tab({ noJs: true });
  await N.nav('/'); await sleep(900);
  const n = await N.ev(`(() => { const o = document.querySelector('[data-brand-intro]'); const r = document.documentElement; const h = document.querySelector('.site-header'); const b = document.elementFromPoint(innerWidth / 2, 300); return { overlay: getComputedStyle(o).display, pending: r.classList.contains('intro-pending'), headerVis: getComputedStyle(h).visibility, overflow: getComputedStyle(r).overflow, top: b && b.closest('[data-brand-intro]') ? 'overlay' : 'site' }; })()`);
  check('8. SEM JS: o overlay não existe visualmente, o site está livre e nada cobre o clique', n.overlay === 'none' && !n.pending && n.headerVis === 'visible' && n.overflow !== 'hidden' && n.top === 'site', JSON.stringify(n));
  await N.close();

  // ---------- capturas determinísticas (animações pausadas em instantes fixos) ----------
  const stages = [['A-inicio', 0], ['B-petalas', 470], ['C-flor-completa', 990], ['D-marca', 1400]];
  for (const [label, w, h] of [['1440', 1440, 900], ['390', 390, 844]]) {
    const P = await tab({ width: w, height: h, pause: true });
    await P.nav('/'); await sleep(350);
    const frames = [];
    for (const [name, ms] of stages) {
      await P.ev(`window.__anims.forEach((a) => { a.pause(); a.currentTime = ${ms}; }); 1`); await sleep(120);
      const shot = await P.send('Page.captureScreenshot', { format: 'webp', quality: 86 });
      writeFileSync(join(OUT, `intro-${label}-${name}.webp`), Buffer.from(shot.data, 'base64')); frames.push(name);
    }
    const geo = await P.ev(`(() => { const f = document.querySelector('.brand-intro__flower').getBoundingClientRect(); const w = document.querySelector('.brand-intro__word').getBoundingClientRect(); return { flower: Math.round(f.width) + 'x' + Math.round(f.height), word: Math.round(w.width) + 'x' + Math.round(w.height), wordTop: Math.round(w.top) }; })()`);
    console.log('geometria final (' + label + '):', JSON.stringify(geo));
    await P.close();
    // E — Hero revelado (execução natural)
    const E = await tab({ width: w, height: h });
    await E.nav('/'); await E.waitDone(); await sleep(1600);
    const shot = await E.send('Page.captureScreenshot', { format: 'webp', quality: 86 });
    writeFileSync(join(OUT, `intro-${label}-E-hero-revelado.webp`), Buffer.from(shot.data, 'base64'));
    await E.close();
  }

  // folha de contato (10 instantes) para QA interno: substitui GIF/vídeo, nada disso vai para o site
  const SHEET = [0, 120, 300, 480, 700, 880, 1000, 1160, 1320, 1500];
  const S = await tab({ width: 1440, height: 900, pause: true });
  await S.nav('/'); await sleep(350);
  const parts = [];
  for (const ms of SHEET) { await S.ev(`window.__anims.forEach((a) => { a.pause(); a.currentTime = ${ms}; }); 1`); await sleep(100); const shot = await S.send('Page.captureScreenshot', { format: 'webp', quality: 80, clip: { x: 420, y: 250, width: 600, height: 400, scale: 1 } }); parts.push({ ms, data: shot.data }); }
  await S.close();
  writeFileSync(join(OUT, 'sheet.json'), JSON.stringify(parts.map((p) => p.ms)));
  parts.forEach((p, i) => writeFileSync(join(OUT, `_sheet-${i}.webp`), Buffer.from(p.data, 'base64')));

  writeFileSync(join(OUT, 'qa-intro.json'), JSON.stringify({ base: BASE, passed: results.filter((r) => r.ok).length, failed: results.filter((r) => !r.ok).length, results }, null, 2));
  console.log(`\n${results.filter((r) => r.ok).length} ok, ${results.filter((r) => !r.ok).length} falhas`);
} finally { chrome.kill(); }
