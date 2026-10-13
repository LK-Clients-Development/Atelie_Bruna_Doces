// QA de /produtos como portfólio (galeria + modal) em Chrome headless (CDP, sem dependências extras).
//
// Cobre: dados renderizados, ausência de preço, busca, filtro por categoria, modal (abrir, fechar, ESC,
// clique fora, focus trap, retorno de foco, inert, URL/histórico), galeria (1 foto, várias, sem foto),
// WhatsApp/Yooga, lazy das fotos extras, reduced-motion, sem JS, overflow em 7 larguras e console.
//
// O snapshot ainda não tem produto com 2+ fotos PUBLICÁVEIS (as do Instagram aguardam autorização), então
// os testes de galeria com várias fotos injetam, SÓ no navegador de QA, 3 fotos extras (URLs reais de outros
// produtos do Yooga) no JSON do modal de um produto, via hook em JSON.parse. Nada disso existe no produto.
//
// Uso (com `npm run build && npx astro preview --port 4399`):
//   node docs/qa/portfolio-gallery/qa-portfolio.mjs [url] [pasta-de-saida]
import { spawn } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const URL_ = process.argv[2] ?? 'http://localhost:4399/produtos';
const OUT = process.argv[3] ?? 'docs/qa/portfolio-gallery';
mkdirSync(OUT, { recursive: true });
const CHROME = process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const PORT = 9371;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${PORT}`, `--user-data-dir=${mkdtempSync(join(tmpdir(), 'qa-pg-'))}`, '--hide-scrollbars', '--force-device-scale-factor=1', '--no-first-run', 'about:blank'], { stdio: 'ignore' });

const results = [];
const check = (name, ok, detail = '') => { results.push({ name, ok: Boolean(ok), detail }); console.log((ok ? 'PASS ' : 'FAIL ') + name + (detail ? '  ' + detail : '')); };

try {
  let targets;
  for (let i = 0; i < 50; i++) { try { targets = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json(); if (targets.length) break; } catch {} await sleep(200); }
  const ws = new WebSocket(targets.find((t) => t.type === 'page').webSocketDebuggerUrl);
  await new Promise((r) => (ws.onopen = r));
  let id = 0; const pending = new Map(); const consoleErrors = [];
  ws.onmessage = (m) => {
    const d = JSON.parse(m.data);
    if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); }
    if (d.method === 'Runtime.exceptionThrown') consoleErrors.push('EXC ' + (d.params.exceptionDetails.exception?.description ?? d.params.exceptionDetails.text));
    if (d.method === 'Runtime.consoleAPICalled' && d.params.type === 'error') consoleErrors.push('console.error ' + d.params.args.map((a) => a.value ?? a.description).join(' '));
    if (d.method === 'Log.entryAdded' && d.params.entry.level === 'error') consoleErrors.push('LOG ' + d.params.entry.text + ' ' + (d.params.entry.url ?? ''));
  };
  const send = (method, params = {}, ms = 20000) => Promise.race([
    new Promise((res, rej) => { const n = ++id; pending.set(n, (d) => (d.error ? rej(new Error(JSON.stringify(d.error))) : res(d.result))); ws.send(JSON.stringify({ id: n, method, params })); }),
    new Promise((_, rej) => setTimeout(() => rej(new Error('TIMEOUT ' + method)), ms)),
  ]);
  const ev = async (e) => { const r = await send('Runtime.evaluate', { expression: e, awaitPromise: true, returnByValue: true }); if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description ?? r.exceptionDetails.text); return r.result.value; };
  const key = async (k, code, vk, modifiers = 0) => { await send('Input.dispatchKeyEvent', { type: 'keyDown', key: k, code, windowsVirtualKeyCode: vk, modifiers }); await send('Input.dispatchKeyEvent', { type: 'keyUp', key: k, code, windowsVirtualKeyCode: vk, modifiers }); };
  const shot = async (name) => { const r = await send('Page.captureScreenshot', { format: 'webp', quality: 82 }); writeFileSync(join(OUT, name), Buffer.from(r.data, 'base64')); };
  await send('Page.enable'); await send('Runtime.enable'); await send('Log.enable');

  // QA: injeta 3 fotos extras no produto "fatia-nutelluda" ao ler o JSON do modal (ver cabeçalho)
  const multiHook = `(() => { const orig = JSON.parse; JSON.parse = function (text, r) { const v = orig.call(this, text, r); if (Array.isArray(v) && v[0] && v[0].slug && v[0].images) { const p = v.find((x) => x.slug === 'fatia-nutelluda'); const others = v.filter((x) => x !== p && x.images[0]).slice(0, 3); if (p && window.__qaMulti !== false) p.images.push(...others.map((o) => o.images[0])); } return v; }; })();`;
  await (send('Page.addScriptToEvaluateOnNewDocument', { source: multiHook }));

  const open = async ({ width = 1440, height = 900, motion = false, js = true, url = URL_ } = {}) => {
    consoleErrors.length = 0;
    await send('Emulation.setScriptExecutionDisabled', { value: !js });
    await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: motion ? 'no-preference' : 'reduce' }] });
    await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: width < 700, hasTouch: width < 700 });
    await send('Page.navigate', { url }); await sleep(2500);
    if (js) await ev(`document.documentElement.style.scrollBehavior = 'auto'; 1`);
  };
  const modalState = () => ev(`(() => { const m = document.querySelector('[data-modal]'); const d = m.querySelector('[data-dialog]'); return {
    open: !m.hidden, role: d.getAttribute('role'), modal: d.getAttribute('aria-modal'), labelledby: d.getAttribute('aria-labelledby'),
    title: document.getElementById('pmodal-title').textContent, labelOk: document.getElementById(d.getAttribute('aria-labelledby'))?.textContent.length > 0,
    imgs: m.querySelectorAll('.pmodal__stage img').length, thumbs: m.querySelectorAll('.pmodal__thumb').length,
    navHidden: m.querySelector('[data-prev]').hidden && m.querySelector('[data-next]').hidden, count: m.querySelector('[data-count]').hidden ? null : m.querySelector('[data-count]').textContent,
    current: [...m.querySelectorAll('.pmodal__thumb')].findIndex((t) => t.getAttribute('aria-current') === 'true'),
    alt: m.querySelector('.pmodal__stage img')?.alt ?? null, src: m.querySelector('.pmodal__stage img')?.src ?? null,
    inert: [...document.body.children].filter((e) => e.hasAttribute('inert')).map((e) => e.tagName.toLowerCase()), bodyLocked: document.documentElement.classList.contains('is-modal-open'),
    active: document.activeElement === d ? 'dialog' : (m.contains(document.activeElement) ? 'in-modal' : (document.activeElement.dataset.open ? 'card:' + document.activeElement.dataset.open : document.activeElement.tagName)),
    url: location.search }; })()`);
  const openCard = (slug) => ev(`(() => { const a = document.querySelector('[data-open="${slug}"]'); a.focus(); a.click(); return 1; })()`);
  const fetchesOfYooga = () => ev(`performance.getEntriesByType('resource').filter((r) => /cdn-production\\.yooga/.test(r.name)).length`);

  // =============== dados renderizados ===============
  await open({});
  const d = await ev(`(() => { const q = (s) => [...document.querySelectorAll(s)]; return {
    cards: q('.pcard').length, items: q('li[data-search]').length, groups: q('[data-group]').length, rail: q('[data-rail-link]').length,
    fallbacks: q('.pcard__fallback').length, cardImgs: q('.pcard__media > img').length, stats: document.querySelector('.pintro__stats').textContent.replace(/\\s+/g, ' ').trim(),
    price: /R\\$|\\d+,\\d{2}/.test(document.querySelector('.pcatalog').textContent) || q('.pcard__price, .pcard__badge, .pcard__opts, .putility, .pgift').length > 0,
    pricesInMarkup: (document.documentElement.innerHTML.match(/R\\$\\s?\\d/g) || []).length,
    forbidden: /a partir de|oferta|adicionais|promo/i.test(document.querySelector('.pcatalog').textContent),
    cta: [...new Set(q('.pcard__cta').map((a) => a.textContent.replace(/\\s+/g, ' ').trim().replace(/:.*/, '')))], ctaN: q('.pcard__cta[data-open]').length,
    haspopup: q('.pcard__cta[aria-haspopup=dialog]').length, modalHidden: document.querySelector('[data-modal]').hidden, modalImgs: document.querySelectorAll('.pmodal img').length,
    primaryOnly: q('.pcard__media > img').length === 44 && q('.pcard img').length === 46, robots: document.querySelector('meta[name=robots]')?.content, h1: q('h1').length,
    noSize: q('.pcard__media > img').filter((i) => !i.getAttribute('width') || !i.getAttribute('height')).length, lazy: q('.pcard__media > img').filter((i) => i.loading === 'lazy').length, eager: q('.pcard__media > img').filter((i) => i.loading === 'eager').length,
    broken: q('img').filter((i) => i.complete && i.naturalWidth === 0 && i.loading !== 'lazy').length,
    cakes: { mode: document.querySelector('[data-cakes-cta]')?.dataset.cakesCta, prices: /R\\$/.test(document.querySelector('.pcakes')?.textContent ?? '') },
    json: JSON.parse(document.getElementById('portfolio-data').textContent).length }; })()`);
  check('46 cards, 46 itens com texto de busca, 13 grupos, trilho com Todos + 13', d.cards === 46 && d.items === 46 && d.groups === 13 && d.rail === 14, JSON.stringify({ cards: d.cards, groups: d.groups, rail: d.rail }));
  check('stats: "46 criações em 13 categorias"', /46 criações/.test(d.stats) && /13 categorias/.test(d.stats), d.stats);
  check('preço NÃO aparece na galeria (sem R$, "a partir de", oferta, opções, adicionais)', !d.price && !d.forbidden, `price=${d.price} forbidden=${d.forbidden}`);
  check('nenhum "R$ n" em todo o HTML da página (nem no JSON do modal)', d.pricesInMarkup === 0, `ocorrências=${d.pricesInMarkup}`);
  check('2 cards sem foto usam o painel da marca', d.fallbacks === 2 && d.cardImgs === 44, `fallbacks=${d.fallbacks} imgs=${d.cardImgs}`);
  check('CTA do card: "Ver criação" em todos, com data-open e aria-haspopup=dialog', d.cta.length === 1 && d.cta[0] === 'Ver criação' && d.ctaN === 46 && d.haspopup === 46, `${d.cta.join('|')} n=${d.ctaN}`);
  check('modal começa fechado e SEM nenhuma imagem no DOM (fotos extras só ao abrir)', d.modalHidden && d.modalImgs === 0, `imgsNoModal=${d.modalImgs}`);
  check('cards carregam só a imagem principal (1 por card, com width/height)', d.primaryOnly && d.noSize === 0 && d.cardImgs === 44, `semTamanho=${d.noSize}`);
  check('todas as 44 fotos dos cards são lazy (o Hero é o LCP), nenhuma imagem quebrada', d.lazy === 44 && d.eager === 0 && d.broken === 0, `lazy=${d.lazy} eager=${d.eager} quebradas=${d.broken}`);
  check('Menu de Bolos pendente: sem preço/bolo listado, CTA WhatsApp', d.cakes.mode === 'whatsapp-fallback' && !d.cakes.prices);
  check('noindex mantido, 1 h1', /noindex/.test(d.robots) && d.h1 === 1, d.robots);
  check('JSON do modal com 46 produtos', d.json === 46);

  // =============== busca ===============
  const visible = `[...document.querySelectorAll('li[data-search]')].filter((l) => !l.hidden).map((l) => l.querySelector('.pcard__name').textContent.trim())`;
  const type = (t) => ev(`(() => { const i = document.querySelector('[data-search-input]'); i.value = ${JSON.stringify(t)}; i.dispatchEvent(new Event('input', { bubbles: true })); })()`);
  check('busca visível com JS', await ev(`!document.querySelector('[data-search-wrap]').hidden`));
  await type('acai'); let v = await ev(visible);
  check('busca "acai" (sem acento) acha o Açaí', v.length === 1 && /Açaí/.test(v[0]), v.join(' | '));
  await type('CAMPOS'); v = await ev(visible);
  check('busca "CAMPOS" sem resultado → mensagem vazia', v.length === 0 && (await ev(`!document.querySelector('[data-empty]').hidden`)));
  await type('nutella'); v = await ev(visible);
  check('busca por descrição ("nutella")', v.length >= 8, `${v.length} resultados`);
  await type('sobremesas no copo'); v = await ev(visible);
  check('busca por categoria editorial ("sobremesas no copo")', v.length >= 6, `${v.length}`);
  await type('geladinho'); v = await ev(visible);
  check('busca por nome ("geladinho")', v.length === 5, `${v.length}`);
  check('busca: mensagem de resultados anunciada (role=status, aria-live)', await ev(`(() => { const s = document.querySelector('[data-results]'); return !s.hidden && /Resultados para/.test(s.textContent) && s.getAttribute('role') === 'status' && s.getAttribute('aria-live') === 'polite'; })()`));
  await ev(`document.querySelector('[data-search-input]').dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))`);
  check('Esc limpa a busca', await ev(`document.querySelectorAll('li[data-search]:not([hidden])').length === 46`));
  await type('zzzxyz'); await ev(`document.querySelector('[data-reset]').click()`);
  check('"Ver todas as criações" restaura tudo', await ev(`document.querySelectorAll('li[data-search]:not([hidden])').length === 46 && document.querySelector('[data-search-input]').value === ''`));

  // =============== filtro por categoria ===============
  await ev(`document.querySelector('[data-rail-link="fatias"]').click()`); await sleep(300);
  const f1 = await ev(`({ vis: document.querySelectorAll('li[data-search]:not([hidden])').length, groups: [...document.querySelectorAll('[data-group]:not([hidden])')].map((g) => g.id), cur: document.querySelector('[data-rail-link][aria-current]')?.dataset.railLink, msg: document.querySelector('[data-results]').textContent })`);
  check('filtro "Fatias": só as 8 fatias, só o grupo Fatias, item atual marcado, anunciado', f1.vis === 8 && f1.groups.join() === 'fatias' && f1.cur === 'fatias' && /Fatias/.test(f1.msg), JSON.stringify(f1));
  await type('chocolatuda');
  const f2 = await ev(`document.querySelectorAll('li[data-search]:not([hidden])').length`);
  check('filtro + busca combinam ("chocolatuda" em Fatias = 1)', f2 === 1, `n=${f2}`);
  await type('cenoura');
  check('filtro + busca sem interseção → vazio (cenoura não está em Fatias)', await ev(`!document.querySelector('[data-empty]').hidden`));
  await type('');
  await ev(`document.querySelector('[data-rail-link="all"]').click()`); await sleep(300);
  check('"Todos" remove o filtro (46 visíveis, 13 grupos)', await ev(`document.querySelectorAll('li[data-search]:not([hidden])').length === 46 && document.querySelectorAll('[data-group]:not([hidden])').length === 13 && document.querySelector('[data-rail-link][aria-current]').dataset.railLink === 'all'`));

  // =============== modal: produto com 1 imagem ===============
  await open({});
  await openCard('copo-ninho-com-morango'); await sleep(350);
  let m = await modalState();
  check('modal abre com role=dialog, aria-modal=true e título associado', m.open && m.role === 'dialog' && m.modal === 'true' && m.labelledby === 'pmodal-title' && m.labelOk && m.title === 'Copo Ninho com Morango', JSON.stringify({ role: m.role, modal: m.modal, title: m.title }));
  check('fundo inerte (header, main, footer) e rolagem travada', m.inert.includes('header') && m.inert.includes('main') && m.inert.includes('footer') && m.bodyLocked, m.inert.join());
  check('foco vai para o diálogo', m.active === 'dialog', m.active);
  check('produto com 1 foto: 1 imagem, sem miniaturas, sem setas, sem contador, sem duplicar', m.imgs === 1 && m.thumbs === 0 && m.navHidden && m.count === null, JSON.stringify({ imgs: m.imgs, thumbs: m.thumbs, nav: m.navHidden, count: m.count }));
  check('nenhuma mensagem interna ("1 de 4", "planejadas", "faltam") para o cliente', await ev(`!/planejad|faltam|de 4|pendente|gera/i.test(document.querySelector('[data-modal]').textContent)`));
  check('URL ganha ?produto=slug', m.url === '?produto=copo-ninho-com-morango', m.url);
  const links = await ev(`({ wa: document.querySelector('[data-m-wa]').href, wat: document.querySelector('[data-m-wa]').target, war: document.querySelector('[data-m-wa]').rel, wal: document.querySelector('[data-m-wa]').textContent.replace(/\\s+/g, ' ').trim(), y: document.querySelector('[data-m-yooga]').href, yl: document.querySelector('[data-m-yooga]').textContent.replace(/\\s+/g, ' ').trim() })`);
  check('WhatsApp: número do site + mensagem com o nome do produto', links.wa === 'https://wa.me/5535984235184?text=' + encodeURIComponent('Olá! Tenho interesse no produto Copo Ninho com Morango.') && links.wat === '_blank' && /noopener/.test(links.war), links.wa);
  check('CTA principal "Quero este produto"; secundário → cardápio Yooga geral', /^Quero este produto/.test(links.wal) && links.y === 'https://delivery.yooga.app/ateliedocesbruna' && /Ver cardápio no Yooga/.test(links.yl), `${links.wal} | ${links.yl}`);
  // focus trap
  const trap = [];
  for (let i = 0; i < 8; i++) { await key('Tab', 'Tab', 9); trap.push((await modalState()).active); }
  check('focus trap: 8 × Tab nunca sai do modal', trap.every((a) => a === 'in-modal'), trap.join());
  const trapBack = [];
  for (let i = 0; i < 6; i++) { await key('Tab', 'Tab', 9, 8); trapBack.push((await modalState()).active); }
  check('focus trap: 6 × Shift+Tab nunca sai do modal', trapBack.every((a) => a === 'in-modal'), trapBack.join());
  // ESC
  await key('Escape', 'Escape', 27); await sleep(300);
  m = await modalState();
  check('ESC fecha, devolve o foco ao card, remove inert e destrava a rolagem', !m.open && m.active === 'card:copo-ninho-com-morango' && m.inert.length === 0 && !m.bodyLocked, JSON.stringify({ open: m.open, active: m.active, inert: m.inert }));
  check('fechar limpa a URL (history.back)', m.url === '', m.url);
  // fotos liberadas
  check('ao fechar, as fotos do modal saem do DOM', await ev(`document.querySelectorAll('.pmodal img').length === 0`));
  // clique fora
  await openCard('fatia-matilda'); await sleep(300);
  await ev(`document.querySelector('.pmodal__backdrop').click()`); await sleep(300);
  m = await modalState();
  check('clique no fundo fecha e devolve o foco', !m.open && m.active === 'card:fatia-matilda', m.active);
  // botão fechar
  await openCard('torta-de-limao'); await sleep(300);
  await ev(`document.querySelector('.pmodal__close').click()`); await sleep(300);
  m = await modalState();
  check('botão fechar (aria-label) fecha e devolve o foco', !m.open && m.active === 'card:torta-de-limao' && (await ev(`document.querySelector('.pmodal__close').getAttribute('aria-label')`)) === 'Fechar', m.active);
  // botão Voltar do navegador
  await openCard('cookie-nutella'); await sleep(300);
  await ev(`history.back()`); await sleep(400);
  m = await modalState();
  check('botão Voltar do navegador fecha o modal (sem sair da página)', !m.open && m.url === '' && (await ev(`location.pathname`)) === '/produtos', JSON.stringify({ open: m.open, url: m.url }));
  // produto sem foto
  await openCard('cookie-tradicional'); await sleep(300);
  m = await modalState();
  check('produto sem foto: modal funciona com o painel da marca (sem <img>), CTAs ativos', m.open && m.imgs === 0 && (await ev(`!!document.querySelector('.pmodal__empty') && !document.querySelector('[data-m-wa]').hidden`)), JSON.stringify({ imgs: m.imgs }));
  await key('Escape', 'Escape', 27); await sleep(250);
  // deep link
  await open({ url: URL_ + '?produto=fatia-nutelluda' });
  m = await modalState();
  check('?produto=slug abre o produto direto', m.open && m.title === 'Fatia nutelluda', m.title);
  await key('Escape', 'Escape', 27); await sleep(300);
  m = await modalState();
  check('deep link: ESC fecha e limpa o parâmetro', !m.open && m.url === '', m.url);
  await open({ url: URL_ + '?produto=nao-existe' });
  m = await modalState();
  check('?produto inválido é ignorado (modal fechado)', !m.open);

  // =============== modal: várias fotos (hook de QA) ===============
  await open({});
  const yoogaBefore = await fetchesOfYooga();
  await openCard('fatia-nutelluda'); await sleep(900);
  const yoogaAfter = await fetchesOfYooga();
  m = await modalState();
  check('4 fotos: 1 imagem principal + 4 miniaturas + contador "1 / 4" + setas visíveis', m.imgs === 1 && m.thumbs === 4 && m.count === '1 / 4' && !m.navHidden && m.current === 0, JSON.stringify({ imgs: m.imgs, thumbs: m.thumbs, count: m.count }));
  check('fotos extras só carregam ao abrir (≤ 3 requisições novas ao CDN do Yooga)', yoogaAfter - yoogaBefore <= 3, `antes=${yoogaBefore} depois=${yoogaAfter}`);
  const s0 = m.src;
  await ev(`document.querySelector('[data-next]').click()`); await sleep(500);
  m = await modalState();
  check('próxima: foto 2 / 4, miniatura atual, alt descreve a foto', m.count === '2 / 4' && m.current === 1 && m.src !== s0 && /foto 2 de 4/.test(m.alt), `${m.count} ${m.alt}`);
  await ev(`document.querySelector('[data-prev]').click()`); await sleep(500);
  m = await modalState();
  check('anterior: volta à foto 1 / 4', m.count === '1 / 4' && m.src === s0);
  await ev(`document.querySelector('[data-prev]').click()`); await sleep(500);
  m = await modalState();
  check('anterior na primeira dá a volta (4 / 4)', m.count === '4 / 4' && m.current === 3, m.count);
  await key('ArrowRight', 'ArrowRight', 39); await sleep(500);
  m = await modalState();
  check('teclado: → avança (volta à 1 / 4)', m.count === '1 / 4', m.count);
  await key('ArrowLeft', 'ArrowLeft', 37); await sleep(500);
  m = await modalState();
  check('teclado: ← volta (4 / 4)', m.count === '4 / 4', m.count);
  await ev(`document.querySelectorAll('.pmodal__thumb')[2].click()`); await sleep(500);
  m = await modalState();
  check('miniatura seleciona a foto (3 / 4)', m.count === '3 / 4' && m.current === 2, m.count);
  check('miniaturas e setas são botões com nome acessível', await ev(`[...document.querySelectorAll('.pmodal__thumb, [data-prev], [data-next]')].every((b) => b.tagName === 'BUTTON' && b.getAttribute('aria-label'))`));
  // swipe (toque)
  await ev(`(() => { const s = document.querySelector('[data-stage]'); const mk = (t, x) => s.dispatchEvent(new PointerEvent(t, { clientX: x, clientY: 300, pointerType: 'touch', bubbles: true })); mk('pointerdown', 300); mk('pointerup', 200); })()`); await sleep(500);
  m = await modalState();
  check('swipe para a esquerda avança (4 / 4)', m.count === '4 / 4', m.count);
  await ev(`(() => { const s = document.querySelector('[data-stage]'); const mk = (t, x) => s.dispatchEvent(new PointerEvent(t, { clientX: x, clientY: 300, pointerType: 'touch', bubbles: true })); mk('pointerdown', 200); mk('pointerup', 300); })()`); await sleep(500);
  m = await modalState();
  check('swipe para a direita volta (3 / 4)', m.count === '3 / 4', m.count);
  await key('Escape', 'Escape', 27); await sleep(300);

  // =============== Fatia Chocolatuda: 4 fotos do projeto (1 Yooga + 3 geradas aprovadas) ===============
  await open({});
  await openCard('fatia-chocolatuda'); await sleep(900);
  m = await modalState();
  const choc = await ev(`[...document.querySelectorAll('.pmodal__thumb img')].map((i) => i.src.replace(location.origin, ''))`);
  check('Chocolatuda: modal com 4 fotos nativas (Yooga + 02-detail + 03-angle + 04-context), contador "1 / 4"', m.thumbs === 4 && m.count === '1 / 4' && /yooga/.test(choc[0]) && choc.slice(1).every((u) => /_astro/.test(u)), JSON.stringify(choc));
  check('Chocolatuda: as fotos geradas são servidas localmente (/_astro) e carregam', await ev(`(async () => { const r = await Promise.all([...document.querySelectorAll('.pmodal__thumb img')].slice(1).map((i) => fetch(i.src).then((x) => x.ok))); return r.every(Boolean); })()`));
  check('Chocolatuda: o card continua mostrando só a foto principal (Yooga)', await ev(`(() => { const img = document.querySelector('[data-slug="fatia-chocolatuda"] .pcard__media > img'); return /yooga/.test(img.src) && document.querySelectorAll('[data-slug="fatia-chocolatuda"] img').length === 1; })()`));
  const seq = [m.count];
  for (let i = 0; i < 3; i++) { await ev(`document.querySelector('[data-next]').click()`); await sleep(500); seq.push((await modalState()).count); }
  check('Chocolatuda: navegação 1/4 → 2/4 → 3/4 → 4/4', seq.join(',') === '1 / 4,2 / 4,3 / 4,4 / 4', seq.join(','));
  await key('Escape', 'Escape', 27); await sleep(250);

  // =============== reduced-motion no modal ===============
  await open({ motion: false });
  await openCard('fatia-nutelluda'); await sleep(300);
  const rm = await ev(`(() => { const d = document.querySelector('.pmodal__dialog'); const b = document.querySelector('.pmodal__backdrop'); return { dialog: getComputedStyle(d).animationName, backdrop: getComputedStyle(b).animationName, img: getComputedStyle(document.querySelector('.pmodal__stage img')).transitionDuration }; })()`);
  check('reduced-motion: modal sem animação e troca de foto sem transição', rm.dialog === 'none' && rm.backdrop === 'none' && /^(0|1e-05)s/.test(rm.img), JSON.stringify(rm));
  await ev(`document.querySelector('[data-next]').click()`);
  check('reduced-motion: troca de foto é imediata', (await modalState()).count === '2 / 4');
  await key('Escape', 'Escape', 27); await sleep(250);
  await open({ motion: true });
  await openCard('fatia-nutelluda'); await sleep(200);
  const mo = await ev(`getComputedStyle(document.querySelector('.pmodal__dialog')).animationName`);
  check('com movimento: o modal anima (opacity/scale sutil)', mo !== 'none', mo);
  await key('Escape', 'Escape', 27); await sleep(250);

  // =============== sem JS ===============
  await open({ js: false });
  const nojs = await ev(`(() => ({ cards: document.querySelectorAll('.pcard').length, vis: [...document.querySelectorAll('.pcard')].filter((c) => getComputedStyle(c).opacity === '1' && c.getBoundingClientRect().height > 0).length, modalDisplay: getComputedStyle(document.querySelector('[data-modal]')).display, searchHidden: document.querySelector('[data-search-wrap]').hidden, anchors: document.querySelectorAll('[data-rail-link]').length, hrefs: [...new Set([...document.querySelectorAll('.pcard__cta')].map((a) => a.href.split('?')[0]))], dead: [...document.querySelectorAll('.pcard__cta')].filter((a) => !a.href || a.getAttribute('href') === '#').length, msg: document.querySelector('.pcard__cta').href }))()`).catch(() => null);
  check('sem JS: galeria completa visível, modal oculto, categorias por âncora, busca oculta', nojs && nojs.cards === 46 && nojs.vis === 46 && nojs.modalDisplay === 'none' && nojs.searchHidden && nojs.anchors === 14, JSON.stringify(nojs));
  check('sem JS: nenhum card morto (todos levam ao WhatsApp com o nome do produto)', nojs && nojs.dead === 0 && nojs.hrefs.length === 1 && nojs.hrefs[0] === 'https://wa.me/5535984235184' && /text=/.test(nojs.msg), `${nojs?.hrefs} | ${nojs?.msg}`);

  // =============== overflow, alvos de toque e screenshots ===============
  for (const w of [1440, 1280, 1024, 768, 430, 390, 360]) {
    await open({ width: w });
    const o = await ev(`(() => ({ sw: document.documentElement.scrollWidth, iw: innerWidth,
      small: [...document.querySelectorAll('.pcard, .prail__item, .psearch__go, .pempty__btn, .pbtn')].filter((e) => { const r = e.getBoundingClientRect(); return r.height > 0 && (r.height < 43.5 || r.width < 43.5); }).map((e) => e.className + ':' + Math.round(e.getBoundingClientRect().height) + 'x' + Math.round(e.getBoundingClientRect().width)).slice(0, 4),
      tiny: [...document.querySelectorAll('main *')].filter((e) => !(e instanceof SVGElement) && e.children.length === 0 && e.textContent.trim() && parseFloat(getComputedStyle(e).fontSize) < 11.99 && getComputedStyle(e).visibility !== 'hidden' && e.getBoundingClientRect().width > 2).map((e) => e.className + ':' + getComputedStyle(e).fontSize).slice(0, 4),
      cols: getComputedStyle(document.querySelector('.pgroup__grid')).gridTemplateColumns.split(' ').length }))()`);
    check(`${w}px: sem overflow horizontal (colunas do grid: ${o.cols})`, o.sw <= o.iw, `scrollWidth=${o.sw} innerWidth=${o.iw}`);
    check(`${w}px: alvos interativos ≥ 44px (card inteiro é o alvo do link)`, o.small.length === 0, o.small.join(' '));
    check(`${w}px: texto ≥ 12px`, o.tiny.length === 0, o.tiny.join(' '));
    // galeria
    await ev(`document.querySelector('#fatias').scrollIntoView(); document.querySelectorAll('.pcard').forEach((c) => c.classList.add('is-in')); window.scrollBy(0, -90); 1`); await sleep(500);
    if ([1440, 768, 390].includes(w)) await shot(`gallery-${w}.webp`);
    // modal (4 fotos)
    await openCard('fatia-nutelluda'); await sleep(900);
    const mo2 = await ev(`(() => { const d = document.querySelector('.pmodal__dialog').getBoundingClientRect(); const a = document.querySelector('.pmodal__actions').getBoundingClientRect(); const st = document.querySelector('[data-stage]').getBoundingClientRect(); return { sw: document.documentElement.scrollWidth, iw: innerWidth, dw: Math.round(d.width), dh: Math.round(d.height), vh: innerHeight, actionsBottomOk: a.bottom <= innerHeight + 1 && a.top >= 0, actionsVisible: a.height > 0, stageW: Math.round(st.width), stageH: Math.round(st.height), cta: [...document.querySelectorAll('.pmodal__actions .pbtn')].map((e) => Math.round(e.getBoundingClientRect().height)) }; })()`);
    check(`${w}px: modal cabe na viewport, CTAs visíveis (≥ 44px) e sem overflow`, mo2.sw <= mo2.iw && mo2.dh <= mo2.vh + 1 && mo2.actionsBottomOk && mo2.cta.every((h) => h >= 44), JSON.stringify(mo2));
    if ([1440, 768, 390].includes(w)) await shot(`modal-${w}.webp`);
    if (w === 390 || w === 360) {
      const sticky = await ev(`(() => { const a = document.querySelector('.pmodal__actions').getBoundingClientRect(); return Math.round(innerHeight - a.bottom); })()`);
      check(`${w}px: CTAs fixos no rodapé do modal (sheet em tela cheia)`, sticky <= 1, `distância ao rodapé=${sticky}`);
    }
    await key('Escape', 'Escape', 27); await sleep(250);
    if (w === 390) {
      await openCard('copo-ninho-com-morango'); await sleep(700);
      await shot('modal-390-1foto.webp');
      await key('Escape', 'Escape', 27); await sleep(250);
    }
    if (w === 1440) {
      await openCard('copo-ninho-com-morango'); await sleep(700);
      await shot('modal-1440-1foto.webp');
      await key('Escape', 'Escape', 27); await sleep(250);
    }
  }
  check('console sem erros em todo o QA', consoleErrors.length === 0, consoleErrors.slice(0, 3).join(' | '));

  writeFileSync(join(OUT, 'qa-portfolio.json'), JSON.stringify({ url: URL_, passed: results.filter((r) => r.ok).length, failed: results.filter((r) => !r.ok).length, results }, null, 2));
  console.log(`\n${results.filter((r) => r.ok).length} ok, ${results.filter((r) => !r.ok).length} falhas`);
} finally { chrome.kill(); }
