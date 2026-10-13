/**
 * Gera a documentação do portfólio a partir de src/data/portfolio.ts (fonte única):
 *   docs/product-portfolio-matrix.{md,json}   matriz (imagem MAPEADA ≠ imagem PUBLICÁVEL)
 *   docs/product-image-gaps.md                lacunas por produto
 *   docs/image-generation-queue.md            fila em lotes (BATCH 01…)
 *   docs/image-generation-prompts/*.md        prompts do BATCH 01 (um por produto)
 *   docs/product-photo-request.md             fotos reais a pedir à Bruna
 *   docs/portfolio-copy-review.md             SOURCE → EDITORIAL (copy) para revisão da Bruna
 *
 *   node tools/build-portfolio-docs.mjs
 *
 * Roda o TypeScript do projeto direto no Node (>= 22.6): o loader abaixo só completa as extensões
 * dos imports relativos do código Astro/Vite ('./search' → './search.ts'). Não baixa nada e não gera imagens.
 */
import { register } from 'node:module';
import { mkdirSync, writeFileSync } from 'node:fs';

register(
  'data:text/javascript,' +
    encodeURIComponent(`
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
function webpSize(buf) {
  const t = buf.toString('ascii', 12, 16);
  if (t === 'VP8X') return [1 + buf.readUIntLE(24, 3), 1 + buf.readUIntLE(27, 3)];
  if (t === 'VP8 ') return [buf.readUInt16LE(26) & 0x3fff, buf.readUInt16LE(28) & 0x3fff];
  if (t === 'VP8L') { const b = buf.readUInt32LE(21); return [1 + (b & 0x3fff), 1 + ((b >> 14) & 0x3fff)]; }
  return [0, 0];
}
export async function load(url, context, next) {
  if (/[.](webp|png|jpe?g)$/.test(url)) {
    const [width, height] = webpSize(readFileSync(fileURLToPath(url)));
    return { format: 'module', shortCircuit: true, source: 'export default ' + JSON.stringify({ src: url.split('/src/').pop(), width, height }) };
  }
  return next(url, context);
}
export async function resolve(specifier, context, next) {
  if (specifier.startsWith('.') && !/\\.[a-z]+$/.test(specifier) && context.parentURL) {
    const url = new URL(specifier + '.ts', context.parentURL);
    if (existsSync(fileURLToPath(url))) return next(url.href, context);
  }
  return next(specifier, context);
}`),
);

const { PORTFOLIO_ALL, PORTFOLIO, EDITORIAL_CATEGORIES, EXCLUDED, TARGET_IMAGES, IMAGE_SLOTS, isPublishable } = await import('../src/data/portfolio.ts');
const { CATEGORIES } = await import('../src/data/products.ts');

const catName = Object.fromEntries(EDITORIAL_CATEGORIES.map((c) => [c.slug, c.name]));
const catOrder = Object.fromEntries(EDITORIAL_CATEGORIES.map((c, i) => [c.slug, i]));
const generatedAt = new Date().toISOString().slice(0, 10);

// ---------------------------------------------------------------------------
// Prioridade EDITORIAL (não há dado de venda: nada aqui é prioridade comercial)
// ---------------------------------------------------------------------------
// Produtos do Hero de /produtos (src/pages/produtos.astro: HERO_SLUGS)
const HERO_SLUGS = ['copo-ninho-com-morango', 'fatia-chocolatuda', 'cheesecake-frutas-vermelhas', 'coxinha-belga'];
// Categorias de maior apelo visual (julgamento editorial)
const VISUAL_CATEGORIES = new Set(['fatias', 'sobremesas-no-copo', 'cheesecakes-e-tortas', 'caseirinhos', 'coxinhas-doces', 'bolos']);
const tierOf = (p) => (HERO_SLUGS.includes(p.slug) ? 'A' : VISUAL_CATEGORIES.has(p.category) ? 'B' : 'C');
const TIER_LABEL = { A: 'A — usado no Hero', B: 'B — categoria de forte apelo visual', C: 'C — demais categorias' };

// ---------------------------------------------------------------------------
// BATCH 01: 8 produtos, 8 categorias diferentes, bases reais publicáveis, 4 do Hero.
// `visible` = o que a foto-base MOSTRA (conferido a olho; é o que não pode mudar).
// ---------------------------------------------------------------------------
const BATCH_01 = [
  {
    slug: 'fatia-chocolatuda',
    why: 'Hero; Fatias é a maior categoria; foto-base nítida, peça inteira bem visível.',
    visible: 'Fatia triangular de bolo de chocolate em 3 camadas de massa escura separadas por 2 camadas de brigadeiro cremoso; topo com cobertura/brigadeiro brilhante e granulado; a fatia está embalada em celofane transparente e segurada por uma mão; ao fundo, outras fatias desfocadas sobre uma superfície de aço.',
    detail: 'close na lateral da fatia: textura molhadinha da massa e a espessura das camadas de brigadeiro',
    angle: 'a MESMA fatia vista de cima/em 3⁄4, mostrando a cobertura de brigadeiro e o granulado no topo',
    context: 'a MESMA fatia servida num prato de cerâmica bege liso sobre mesa clara, com flores desfocadas ao fundo (cenário do ateliê); sem celofane se o prato for usado',
  },
  {
    slug: 'copo-ninho-com-morango',
    why: 'Hero; sobremesa no copo é a categoria de produto de assinatura; contraste forte de cores.',
    visible: 'Copo plástico transparente com tampa em domo; camadas visíveis: creme de ninho amarelo-claro no fundo, pedaços de brownie escuro e fatias de morango na lateral, creme branco, e farelo/pedaços de brownie no topo sob a tampa; rótulo redondo "Ateliê Doces" colado no copo; segurado por uma mão. ATENÇÃO: a foto-base é estreita (242×500).',
    detail: 'close nas camadas através do copo: morango fatiado, brownie e creme de ninho (sem alterar a ordem nem as proporções das camadas)',
    angle: 'o MESMO copo em 3⁄4 e levemente de cima, tampa em domo, mostrando o topo com o brownie',
    context: 'o MESMO copo sobre uma mesa clara ou bandeja, sem mão, com flores desfocadas ao fundo; o rótulo redondo deve ser o da foto (ou ficar de fora de quadro)',
  },
  {
    slug: 'cheesecake-frutas-vermelhas',
    why: 'Hero; única categoria de cheesecake; foto-base nítida e com excelente composição.',
    visible: 'Fatia triangular de cheesecake sobre prato de cerâmica bege com borda rústica, segurado por uma mão; base fina e escura de biscoito, recheio branco cremoso de cream cheese, cobertura de geleia vermelha de frutas vermelhas escorrendo pelas laterais e meia fatia de morango fresco com folhas verdes no topo; flores rosadas e brancas desfocadas ao fundo.',
    detail: 'close na geleia escorrendo sobre o creme e na base de biscoito, textura do recheio',
    angle: 'a MESMA fatia de lado, ligeiramente abaixo da linha do prato, mostrando a altura e as camadas',
    context: 'a MESMA fatia em prato bege sobre mesa clara com garfo ao lado, flores desfocadas ao fundo (sem mão)',
  },
  {
    slug: 'coxinha-belga',
    why: 'Hero; representa Coxinhas doces; formato inconfundível; foto-base boa.',
    visible: 'Doce em formato de coxinha (gota/oval) coberto inteiramente por granulado belga de chocolate, dentro de forminha de papel branca pregueada, segurado por uma mão; várias outras coxinhas semelhantes em forminhas, desfocadas ao fundo, sobre superfície cinza.',
    detail: 'close na textura do granulado belga e no formato da coxinha dentro da forminha',
    angle: 'a MESMA coxinha de lado, destacando o formato de gota; (opcional: uma coxinha partida só se a foto-base mostrar o interior; se não mostrar, NÃO invente o recheio)',
    context: 'a MESMA coxinha na forminha sobre um prato bege, com outras ao fundo em fileira (sem mão), mesa clara',
  },
  {
    slug: 'caseirinho-ninho-nutella-e-morango',
    why: 'Representa Caseirinhos; foto-base mostra bem o topo; contraste vermelho/amarelo/marrom.',
    visible: 'Embalagem de isopor branca (marmita pequena) aberta, segurada por uma mão; dentro, creme de ninho amarelo-claro, morangos picados e fios de Nutella por cima; um pedaço de morango no interior da tampa. O interior em camadas não aparece na foto.',
    detail: 'close no topo: fios de Nutella sobre os morangos picados e o creme de ninho',
    angle: 'a MESMA embalagem vista de cima/em 3⁄4, tampa aberta',
    context: 'a MESMA embalagem aberta sobre uma mesa clara com garfinho ao lado (sem mão). NÃO mostrar o corte interno nem inventar a massa de chocolate: ela não aparece na foto-base',
  },
  {
    slug: 'bolo-de-cenoura',
    why: 'Representa a categoria Bolos (único bolo do cardápio atual); forte apelo visual.',
    visible: 'Bolo de cenoura em formato de rosca (forma com furo central, laterais com sulcos) sobre prato plástico branco com bordas onduladas, segurado por uma mão; cobertura espessa de brigadeiro de chocolate escorrendo pelas laterais, com confeitos/granulado de chocolate no topo; ambiente do ateliê desfocado ao fundo.',
    detail: 'close no brigadeiro escorrendo pelas laterais e na massa alaranjada de cenoura',
    angle: 'o MESMO bolo em 3⁄4 e levemente de cima, mostrando o furo central e a cobertura',
    context: 'o MESMO bolo inteiro sobre uma mesa clara com flores desfocadas ao fundo (cenário do ateliê); se mostrar corte de fatia, a massa deve ser a mesma alaranjada de cenoura vista na foto',
  },
  {
    slug: 'coxinha-de-frango-c-catupiry',
    why: 'Representa Salgados; a foto-base já mostra o recheio cortado; cenário com a forminha da marca.',
    visible: 'Coxinha empanada (empanamento claro/dourado e crocante) partida ao meio, mostrando o recheio de frango alaranjado e catupiry branco, segurada por uma mão sobre papel/forminha branco com estampa da marca (flor e "Ateliê Doces"); salão do ateliê desfocado ao fundo (mesa redonda, cadeira branca).',
    detail: 'close no corte: crocância do empanamento e o recheio de frango com catupiry',
    angle: 'a MESMA coxinha inteira, de lado, mostrando o formato de gota e o empanamento',
    context: 'a MESMA coxinha sobre o papel estampado da marca, em prato ou bandeja, sem mão; o papel estampado deve ser o da foto (não invente outro desenho nem texto)',
  },
  {
    slug: 'cone-trufado-de-brigadeiro',
    why: 'Representa Cones trufados; formato diferente dos demais itens; cenário limpo.',
    visible: 'Casquinha de cone (waffle) deitada sobre prato de cerâmica bege liso, com brigadeiro escuro preenchendo a abertura; mesa branca; ao fundo, dois cones embalados em plástico transparente com laço dourado e rótulo redondo da marca, num copo de vidro, e flores desfocadas.',
    detail: 'close no brigadeiro cremoso e na borda crocante da casquinha',
    angle: 'o MESMO cone de lado, mostrando o comprimento da casquinha e o recheio de brigadeiro',
    context: 'o MESMO cone embalado no plástico transparente com laço, em pé num copo de vidro, flores desfocadas ao fundo; o rótulo redondo deve ser o da foto-base (não invente texto)',
  },
];

// ---------------------------------------------------------------------------
// Linhas da matriz
// ---------------------------------------------------------------------------
const imgInfo = (i) => ({
  id: i.id,
  source: i.source,
  sourceStatus: i.sourceStatus,
  status: i.status,
  url: i.src ?? i.sourceUrl,
  size: i.width && i.height ? `${i.width}x${i.height}` : null,
  orientation: i.orientation,
  match: i.provenance.match,
  note: i.provenance.note ?? null,
});

/** Melhor referência para gerar: maior foto REAL PUBLICÁVEL que não seja de combo. */
function referenceOf(p) {
  const c = p.gallery.filter((i) => i.status === 'REAL' && isPublishable(i) && !/COMBO/.test(i.provenance.note ?? ''));
  c.sort((a, b) => (b.height ?? 0) * (b.width ?? 0) - (a.height ?? 0) * (a.width ?? 0));
  return c[0] ? { id: c[0].id, url: c[0].src, size: `${c[0].width}x${c[0].height}`, narrow: (c[0].width ?? 0) < 250 } : null;
}
const quality = (p) => {
  const pub = p.gallery.filter(isPublishable);
  if (!pub.length) return p.gallery.length ? 'SEM_IMAGEM_PUBLICÁVEL' : 'SEM_IMAGEM';
  return 'BAIXA (até 500 px, CDN Yooga)';
};
const action = (r) => (r.generationPlan === 'NONE' ? 'NONE' : r.generationPlan === 'NEEDS_GENERATION' ? `GENERATE_${r.missing}` : r.generationPlan === 'BLOCKED_AUTHORIZATION' ? 'HOLD_UNTIL_AUTHORIZED' : 'REQUEST_REAL_REFERENCE');

const batch01Slugs = BATCH_01.map((b) => b.slug);
const rows = PORTFOLIO_ALL.map((p) => {
  const publishable = p.gallery.filter(isPublishable);
  const missing = Math.max(0, TARGET_IMAGES - publishable.length);
  const yoogaCat = p.sourceCategoryId ? CATEGORIES.find((c) => c.id === p.sourceCategoryId) : null;
  const generatedKinds = p.gallery.filter((i) => i.status === 'APPROVED_GENERATED').map((i) => i.provenance.generation?.kind);
  const hasSource = p.gallery.some((i) => i.status === 'REAL' && isPublishable(i));
  const missingKinds = hasSource ? ['DETAIL', 'ANGLE', 'CONTEXT'].filter((k) => !generatedKinds.includes(k)).slice(0, missing) : [];
  const slots = {
    '01-source': hasSource ? 'PUBLICABLE' : 'MISSING',
    '02-detail': generatedKinds.includes('DETAIL') ? 'GENERATED_APPROVED' : 'MISSING',
    '03-angle': generatedKinds.includes('ANGLE') ? 'GENERATED_APPROVED' : 'MISSING',
    '04-context': generatedKinds.includes('CONTEXT') ? 'GENERATED_APPROVED' : 'MISSING',
  };
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    editorialCategory: catName[p.category],
    sourceCategory: yoogaCat ? yoogaCat.sourceName.trim() : null,
    origin: p.portfolioSource === 'yooga' ? 'Yooga' : 'Instagram',
    status: p.status,
    publishedInGallery: p.published,
    mappedImageCount: p.mappedImageCount,
    publishableImageCount: p.publishableImageCount,
    target: TARGET_IMAGES,
    missing, // frente às imagens PUBLICÁVEIS
    missingIfMappedAuthorized: Math.max(0, TARGET_IMAGES - p.mappedImageCount),
    imageStatus: p.imageStatus, // cobertura publicável
    quality: quality(p),
    slots,
    approvedGeneratedImages: generatedKinds.length,
    missingKinds,
    images: p.gallery.map(imgInfo),
    primarySourceStatus: p.gallery.find((i) => i.isPrimary)?.sourceStatus ?? (p.gallery[0]?.sourceStatus ?? 'MISSING'),
    generationPlan: p.generationPlan,
    action: action({ generationPlan: p.generationPlan, missing }),
    generationNeeded: p.generationPlan === 'NEEDS_GENERATION' ? missingKinds.length : 0,
    realPhotosNeeded: p.generationPlan === 'NEEDS_REAL_PHOTO' ? TARGET_IMAGES : 0,
    referenceImage: referenceOf(p),
    copyStatus: p.copyStatus,
    editorialPriority: tierOf(p),
    batch: batch01Slugs.includes(p.slug) ? 'BATCH 01' : null,
  };
});

// ---------------------------------------------------------------------------
// Lotes: BATCH 01 fixo; demais por prioridade editorial, alternando categorias (diversidade)
// ---------------------------------------------------------------------------
const BATCH_SIZE = 8;
const pool = rows.filter((r) => r.generationPlan === 'NEEDS_GENERATION' && !batch01Slugs.includes(r.slug));
const ordered = [];
for (const tier of ['A', 'B', 'C']) {
  const byCat = new Map();
  pool.filter((r) => r.editorialPriority === tier).sort((a, b) => a.name.localeCompare(b.name, 'pt-BR')).forEach((r) => {
    if (!byCat.has(r.editorialCategory)) byCat.set(r.editorialCategory, []);
    byCat.get(r.editorialCategory).push(r);
  });
  const cats = [...byCat.keys()].sort((a, b) => Object.values(catName).indexOf(a) - Object.values(catName).indexOf(b));
  while ([...byCat.values()].some((l) => l.length)) for (const c of cats) { const n = byCat.get(c).shift(); if (n) ordered.push(n); }
}
const batches = [{ n: 1, items: batch01Slugs.map((s) => rows.find((r) => r.slug === s)) }];
for (let i = 0; i < ordered.length; i += BATCH_SIZE) batches.push({ n: batches.length + 1, items: ordered.slice(i, i + BATCH_SIZE) });
batches.forEach((b) => b.items.forEach((r) => (r.batch = `BATCH ${String(b.n).padStart(2, '0')}`)));

// ---------------------------------------------------------------------------
// Totais
// ---------------------------------------------------------------------------
const count = (fn) => rows.filter(fn).length;
const sum = (fn) => rows.reduce((n, r) => n + fn(r), 0);
const yoogaRows = rows.filter((r) => r.origin === 'Yooga');
const copyCount = (s) => rows.filter((r) => r.copyStatus === s && r.origin === 'Yooga').length;
const totals = {
  yoogaSnapshot: { categories: CATEGORIES.length, products: CATEGORIES.reduce((n, c) => n + c.products.length, 0) },
  excludedFromGallery: Object.entries(EXCLUDED).map(([categoryId, reason]) => {
    const c = CATEGORIES.find((x) => x.id === categoryId);
    return { categoryId, sourceName: c.sourceName.trim(), products: c.products.map((p) => p.name.trim()), reason };
  }),
  portfolioProducts: rows.length,
  fromYooga: yoogaRows.length,
  extrasFromInstagram: rows.length - yoogaRows.length,
  publishedInGallery: PORTFOLIO.length,
  editorialCategories: EDITORIAL_CATEGORIES.length,
  MAPPED_IMAGE_COUNT: sum((r) => r.mappedImageCount),
  PUBLISHABLE_IMAGE_COUNT: sum((r) => r.publishableImageCount),
  approvedGeneratedImages: sum((r) => r.approvedGeneratedImages),
  mappedButNotPublishable: sum((r) => r.mappedImageCount - r.publishableImageCount),
  notPublishableBreakdown: Object.fromEntries(
    ['AUTHORIZATION_PENDING', 'REFERENCE_ONLY'].map((s) => [s, rows.reduce((n, r) => n + r.images.filter((i) => i.sourceStatus === s).length, 0)]),
  ),
  // cobertura PUBLICÁVEL (o que o site mostra hoje)
  complete4plus: count((r) => r.imageStatus === 'COMPLETE'),
  with3: count((r) => r.imageStatus === 'PARTIAL_3'),
  with2: count((r) => r.imageStatus === 'PARTIAL_2'),
  with1: count((r) => r.imageStatus === 'PARTIAL_1'),
  with0: count((r) => r.imageStatus === 'MISSING'),
  withoutPublishableImage: rows.filter((r) => r.imageStatus === 'MISSING').map((r) => r.name),
  imagesMissingToTarget: sum((r) => r.missing),
  generationEstimate: sum((r) => r.generationNeeded),
  productsThatCanReceiveGeneration: count((r) => r.generationPlan === 'NEEDS_GENERATION'),
  productsBlockedByAuthorization: rows.filter((r) => r.generationPlan === 'BLOCKED_AUTHORIZATION').map((r) => r.name),
  productsNeedingRealReference: rows.filter((r) => r.generationPlan === 'NEEDS_REAL_PHOTO').map((r) => r.name),
  batches: batches.map((b) => ({ batch: `BATCH ${String(b.n).padStart(2, '0')}`, products: b.items.length, imagesToGenerate: b.items.reduce((n, r) => n + r.generationNeeded, 0) })),
  copy: {
    SOURCE_RAW: copyCount('SOURCE_RAW'),
    DRAFT: copyCount('DRAFT'),
    NEEDS_BRUNA_APPROVAL: copyCount('NEEDS_BRUNA_APPROVAL'),
    APPROVED: copyCount('APPROVED'),
  },
};

writeFileSync(
  'docs/product-portfolio-matrix.json',
  JSON.stringify({ generatedAt, generatedBy: 'tools/build-portfolio-docs.mjs (fonte: src/data/portfolio.ts)', targetImagesPerProduct: TARGET_IMAGES, slots: IMAGE_SLOTS, totals, products: rows }, null, 2) + '\n',
);

// ---------------------------------------------------------------------------
// Matriz (md)
// ---------------------------------------------------------------------------
const esc = (s) => String(s ?? '').replace(/\|/g, '\\|');
const sorted = [...rows].sort((a, b) => Object.values(catName).indexOf(a.editorialCategory) - Object.values(catName).indexOf(b.editorialCategory));
const T = totals;

writeFileSync(
  'docs/product-portfolio-matrix.md',
  `# Matriz mestre do portfólio e das imagens

> Gerada por \`node tools/build-portfolio-docs.mjs\` a partir de \`src/data/portfolio.ts\` (${generatedAt}). **Não editar à mão.** Versão estruturada: [\`product-portfolio-matrix.json\`](product-portfolio-matrix.json).

## Imagem MAPEADA ≠ imagem PUBLICÁVEL

Cada imagem tem um \`sourceStatus\`:

| sourceStatus | Significa | Pode aparecer no site? |
|---|---|---|
| \`PUBLICABLE\` | imagem pública do cardápio Yooga (ou, no futuro, gerada e aprovada) | **sim** |
| \`AUTHORIZATION_PENDING\` | foto real do Instagram encontrada **sem autorização** da Bruna | não: só referência interna |
| \`REFERENCE_ONLY\` | indício/referência (ex.: capa de reel), nunca foto do produto | não |
| \`GENERATED_APPROVED\` | imagem gerada **e aprovada** (continua \`APPROVED_GENERATED\`, nunca \`REAL\`) | sim (nenhuma ainda) |
| \`MISSING\` | espaço sem imagem | n/a |

| Indicador | Valor |
|---|---|
| **MAPPED_IMAGE_COUNT** (reais + referências encontradas) | **${T.MAPPED_IMAGE_COUNT}** |
| **PUBLICABLE_IMAGE_COUNT** (podem aparecer no site hoje) | **${T.PUBLISHABLE_IMAGE_COUNT}** (inclui ${T.approvedGeneratedImages} gerada(s) e aprovada(s), \`APPROVED_GENERATED\`) |
| Diferença (mapeadas e não publicáveis) | ${T.mappedButNotPublishable}: ${T.notPublishableBreakdown.AUTHORIZATION_PENDING} \`AUTHORIZATION_PENDING\` + ${T.notPublishableBreakdown.REFERENCE_ONLY} \`REFERENCE_ONLY\` |

Toda cobertura e toda lacuna abaixo usam **PUBLICABLE_IMAGE_COUNT**. Se a Bruna autorizar as fotos do Instagram, a lacuna cai (coluna "Falta se autorizadas" do JSON), mas isso não altera o plano de hoje.

## Fontes e limites

| Fonte | Estado | O que entrou |
|---|---|---|
| Yooga (snapshot \`src/data/products.ts\`, auditado em 2026-10-05) | auditado | ${T.yoogaSnapshot.categories} categorias, ${T.yoogaSnapshot.products} produtos; **${T.fromYooga}** entram no portfólio |
| Instagram \`@ateliedocesbruna\` | **parcial**: só o público, sem login | 12 publicações da grade; 3 casam com itens do Yooga, 2 itens extras. Detalhe e limites: [\`portfolio-raw/instagram-observed.json\`](portfolio-raw/instagram-observed.json) |
| Menu de Bolos (Google Drive via Linktree) | **bloqueado** (login Google) | nada: nenhum bolo por encomenda foi inventado |
| Arquivos reais no repositório | só provisórios | nenhum arquivo de produto real além das imagens do Yooga |

Todas as imagens do Yooga têm no máximo 500 px de altura (231–500 px de largura): servem para cards e modal, não para destaque grande.

## Itens do Yooga fora da galeria

${T.excludedFromGallery.map((e) => `- **${e.sourceName}** (${e.products.join('; ')}): ${e.reason}`).join('\n')}

## Resumo numérico (cobertura PUBLICÁVEL)

| Indicador | Valor |
|---|---|
| Produtos no portfólio | **${T.portfolioProducts}** (${T.fromYooga} Yooga + ${T.extrasFromInstagram} extras do Instagram; ${T.publishedInGallery} publicados na galeria) |
| Categorias editoriais | ${T.editorialCategories} |
| Completos (4+ publicáveis) | ${T.complete4plus} |
| Com 3 / 2 / 1 / 0 publicáveis | ${T.with3} / ${T.with2} / ${T.with1} / ${T.with0} |
| Sem imagem publicável | ${T.withoutPublishableImage.join('; ')} |
| Imagens faltantes até a meta de ${TARGET_IMAGES}/produto | ${T.imagesMissingToTarget} |
| A gerar (produtos com referência real publicável) | ${T.generationEstimate}, em ${T.productsThatCanReceiveGeneration} produtos (\`NEEDS_GENERATION\`) |
| Retidos até autorização | ${T.productsBlockedByAuthorization.join('; ') || '—'} (\`BLOCKED_AUTHORIZATION\`) |
| Precisam de foto real | ${T.productsNeedingRealReference.join('; ') || '—'} (\`NEEDS_REAL_PHOTO\`) |

Estrutura-alvo de cada galeria (${TARGET_IMAGES}): \`01-source\` foto principal · \`02-detail\` close de textura/recheio/cobertura · \`03-angle\` outro ângulo · \`04-context\` servido/mão/embalagem/mesa.

## Matriz por produto

| Produto | Categoria editorial | Origem / status | Mapeadas | Publicáveis | Falta | Slots (S·D·A·C) | Cobertura | Plano | Lote | Copy |
|---|---|---|---|---|---|---|---|---|---|---|
${sorted
  .map(
    (r) =>
      `| ${esc(r.name)} | ${esc(r.editorialCategory)} | ${r.origin} · \`${r.status}\`${r.publishedInGallery ? '' : ' · fora da galeria'} | ${r.mappedImageCount} | ${r.publishableImageCount} | ${r.missing} | ${Object.values(r.slots).map((v) => (v === 'MISSING' ? '–' : '✓')).join('·')} | \`${r.imageStatus}\` | \`${r.action}\` | ${r.batch ?? '—'} | \`${r.copyStatus}\` |`,
  )
  .join('\n')}

## Correspondências do Instagram

| Publicação | Produto | sourceStatus | Correspondência |
|---|---|---|---|
${rows
  .flatMap((r) => r.images.filter((i) => i.source === 'instagram').map((i) => `| ${i.url} | ${esc(r.name)}${r.origin === 'Instagram' ? ' (extra)' : ''} | \`${i.sourceStatus}\` | \`${i.match}\`${i.note ? ' · ' + esc(i.note) : ''} |`))
  .join('\n')}

As demais publicações observadas (marca, bastidores, embalagem, imprensa de terceiros, docinhos sem produto nomeado) ficaram \`UNIDENTIFIED\`: ver o JSON bruto.
`,
);

// ---------------------------------------------------------------------------
// Gaps
// ---------------------------------------------------------------------------
const gapRows = sorted.filter((r) => r.missing > 0);
const refText = (r) => (r.referenceImage ? `${r.referenceImage.url} (${r.referenceImage.size})${r.referenceImage.narrow ? ' — estreita, referência fraca' : ''}` : '—');
writeFileSync(
  'docs/product-image-gaps.md',
  `# Lacunas de imagem por produto

> Gerado por \`tools/build-portfolio-docs.mjs\` (${generatedAt}). Meta: ${TARGET_IMAGES} imagens **publicáveis** por produto (\`01-source\`, \`02-detail\`, \`03-angle\`, \`04-context\`). Mapeada ≠ publicável: ver [a matriz](product-portfolio-matrix.md). Nenhuma imagem foi gerada.

${T.complete4plus} produtos completos; **${gapRows.length}** com lacuna, somando **${T.imagesMissingToTarget}** imagens publicáveis a produzir: ${T.generationEstimate} por geração a partir de referência real; os demais dependem de foto real ou de autorização.

${gapRows
  .map(
    (r) => `## ${r.name}

Categoria: ${r.editorialCategory} · ${r.origin} · \`${r.imageStatus}\` · lote: ${r.batch ?? '—'}

Imagens mapeadas: ${r.mappedImageCount} · **publicáveis: ${r.publishableImageCount}**

Meta: ${r.target}

Faltam (publicáveis): ${r.missing}

Melhor referência publicável: ${refText(r)}

Ação: \`${r.action}\`
`,
  )
  .join('\n---\n\n')}`,
);

// ---------------------------------------------------------------------------
// Fila em lotes
// ---------------------------------------------------------------------------
const line = (r) => `- **${r.name}** (${r.editorialCategory}) — ${r.publishableImageCount} publicável, faltam ${r.missing} · \`${r.action}\` · prioridade \`${r.editorialPriority}\` · referência: ${refText(r)}`;
writeFileSync(
  'docs/image-generation-queue.md',
  `# Fila de produção de imagens (em lotes)

> Gerada por \`tools/build-portfolio-docs.mjs\` (${generatedAt}). **Prioridade EDITORIAL (\`EDITORIAL_PRIORITY\`), não comercial: não existe dado de venda.** Nada de produzir ${T.generationEstimate} imagens de uma vez: um lote por vez, aprovado antes do próximo.

## Critérios

1. **A** — produtos usados no Hero de \`/produtos\` (ajudam a preencher o topo);
2. **B** — categorias de forte apelo visual (fatias, copos, cheesecakes, caseirinhos, coxinhas doces, bolos);
3. **C** — demais.

Cada lote tem 8 produtos (o BATCH 01 foi montado à mão; os seguintes alternam categorias dentro de cada nível, para não juntar produtos parecidos). Só entram produtos com referência real **publicável** (\`NEEDS_GENERATION\`).

Regras: imagem gerada entra como \`APPROVED_GENERATED\` (nunca \`REAL\`) com proveniência (ver \`GeneratedProvenance\` em \`src/data/portfolio.ts\`); a foto real anexada é a fonte de verdade; só mudam ângulo, luz, composição, cenário e enquadramento. Arquivos futuros: \`src/assets/portfolio/<slug>/01-source · 02-detail · 03-angle · 04-context\`.

${batches
  .map((b) => {
    const label = `BATCH ${String(b.n).padStart(2, '0')}`;
    const imgs = b.items.reduce((n, r) => n + r.generationNeeded, 0);
    const extra = b.n === 1 ? `\n\nPrompts prontos em [\`image-generation-prompts/\`](image-generation-prompts/). Motivo de cada escolha:\n\n${BATCH_01.map((x) => `- \`${x.slug}\`: ${x.why}`).join('\n')}\n` : '';
    return `# ${label}\n\n${b.items.length} produtos · ${imgs} imagens (DETAIL, ANGLE, CONTEXT por produto)${extra}\n${b.items.map(line).join('\n')}\n`;
  })
  .join('\n')}
# Fora dos lotes

- **Retidos até autorização** (\`HOLD_UNTIL_AUTHORIZED\`): ${T.productsBlockedByAuthorization.join('; ') || '—'}. A única foto real é do Instagram, sem autorização: não usar como base de geração.
- **Pedir foto real** (\`REQUEST_REAL_REFERENCE\`): ${T.productsNeedingRealReference.join('; ') || '—'}. Ver [product-photo-request.md](product-photo-request.md).

# Resumo

${T.batches.map((b) => `- ${b.batch}: ${b.products} produtos, ${b.imagesToGenerate} imagens`).join('\n')}
- Total a gerar: ${T.generationEstimate} imagens em ${T.productsThatCanReceiveGeneration} produtos
`,
);

// ---------------------------------------------------------------------------
// Prompts do BATCH 01
// ---------------------------------------------------------------------------
mkdirSync('docs/image-generation-prompts', { recursive: true });
const SHOT = {
  DETAIL: { slot: '02-detail', label: 'DETAIL — close de textura / recheio / cobertura' },
  ANGLE: { slot: '03-angle', label: 'ANGLE — outro ângulo' },
  CONTEXT: { slot: '04-context', label: 'CONTEXT — servido / mão / embalagem / mesa' },
};
const FIDELITY = `REGRAS DE FIDELIDADE (valem para as 3 imagens)
- A foto real anexada é a ÚNICA fonte de verdade sobre o produto. Gere VARIAÇÕES FOTOGRÁFICAS DO MESMO PRODUTO, não uma nova receita.
- NÃO mude: o produto, a forma, o tamanho e as proporções, a cobertura, o recheio visível, as camadas, os toppings, a decoração, a embalagem, as cores do produto.
- NÃO invente recheio, camada, ingrediente, sabor, decoração ou embalagem que não apareçam na foto.
- NÃO escreva texto, logotipo ou marca d'água novos. Se o rótulo/estampa/selo da marca aparecer, deve ser IDÊNTICO ao da foto ou ficar fora de quadro.
- PODE mudar apenas: ângulo da câmera, luz, composição, cenário (simples, claro, coerente com um ateliê de confeitaria) e enquadramento.
- Se não for possível mostrar algo sem inventá-lo, escolha outro enquadramento (ex.: não mostre o interior se a foto não o mostra).
- Aspecto 4:5 (retrato), mínimo 1080×1350 px, foto realista de confeitaria, luz natural suave, sem filtros exagerados, sem aparência de ilustração/3D.`;
for (const b of BATCH_01) {
  const r = rows.find((x) => x.slug === b.slug);
  const ref = r.referenceImage;
  const shots = [
    ['DETAIL', b.detail],
    ['ANGLE', b.angle],
    ['CONTEXT', b.context],
  ].filter(([k]) => r.missingKinds.includes(k));
  const done = ['DETAIL', 'ANGLE', 'CONTEXT'].filter((k) => !r.missingKinds.includes(k) && r.slots[SHOT[k].slot] !== 'MISSING');
  const md = `# ${r.name}

> BATCH 01 · ${r.editorialCategory} · prioridade editorial \`${r.editorialPriority}\` · gerado por \`tools/build-portfolio-docs.mjs\`. Copie cada bloco para o chat de geração **com a foto de referência anexada**.

| | |
|---|---|
| Produto | ${r.name} (\`${r.slug}\`) |
| Categoria | ${r.editorialCategory} |
| Foto-base (fonte de verdade) | ${ref.url} (${ref.size})${ref.narrow ? ' — **estreita**: gere com cuidado e confira o resultado contra a foto' : ''} |
| Origem | imagem pública do cardápio Yooga (\`PUBLICABLE\`, \`REAL\`) |
| Imagens publicáveis hoje | ${r.publishableImageCount} |
| Faltam | ${r.missing} (${shots.map(([k]) => k).join(', ')}) |${done.length ? `
| Já aprovadas (não gerar de novo) | ${done.map((k) => SHOT[k].slot).join(', ')} |` : ''}
| Por que está no lote | ${b.why} |
| Qualidade da base | baixa resolução (≤ 500 px de altura): a saída deve ser **coerente com a foto**, não "mais bonita" que ela |

## O que a foto-base MOSTRA (não pode mudar)

${b.visible}

## ${FIDELITY.split('\n')[0]}

${FIDELITY.split('\n').slice(1).join('\n')}

${shots
  .map(
    ([k, text]) => `## Imagem ${SHOT[k].slot}: ${SHOT[k].label}

\`\`\`text
Use a foto real anexada como fonte de verdade do produto "${r.name}".
Gere UMA nova foto do MESMO produto: ${text}.
O que a foto-base mostra e deve permanecer idêntico: ${b.visible}
Não mude o produto, a forma, a cobertura, o recheio visível, os toppings, as proporções nem a embalagem. Não invente nada que não apareça na foto-base. Não escreva texto novo nem altere o rótulo/selo da marca.
Pode mudar somente ângulo, luz, composição, cenário e enquadramento. Formato 4:5 retrato, mínimo 1080×1350 px, fotografia realista de confeitaria com luz natural suave.
\`\`\`
`,
  )
  .join('\n')}
## Ao receber as imagens (checklist de aprovação)

- [ ] O produto é reconhecivelmente o da foto-base (forma, cobertura, camadas, toppings, proporções).
- [ ] Nada foi inventado (recheio, decoração, embalagem, texto/logotipo).
- [ ] Sem artefatos (dedos extras, bordas derretidas, texto ilegível, objetos duplicados).
- [ ] Mesma paleta/identidade visual da foto-base.

## Arquivos e proveniência (quando aprovadas)

Salvar como \`src/assets/portfolio/${r.slug}/${SHOT.DETAIL.slot}.webp\`, \`${SHOT.ANGLE.slot}.webp\`, \`${SHOT.CONTEXT.slot}.webp\` (e a foto-base como \`01-source\` só quando existir cópia local autorizada). Cada uma entra em \`portfolio.ts\` com \`status: 'APPROVED_GENERATED'\`, \`sourceStatus: 'GENERATED_APPROVED'\` (**nunca \`REAL\`**) e \`provenance.generation\`:

\`\`\`ts
{ baseProductId: '${r.id}', referenceImageId: '${ref.id}', generatedAt: 'AAAA-MM-DD', kind: 'DETAIL' | 'ANGLE' | 'CONTEXT', approvedBy: '…', approvedAt: 'AAAA-MM-DD' }
\`\`\`
`;
  writeFileSync(`docs/image-generation-prompts/${r.slug}.md`, md);
}
writeFileSync(
  'docs/image-generation-prompts/README.md',
  `# Prompts de geração: BATCH 01

Um arquivo por produto, com 3 prompts (DETAIL, ANGLE, CONTEXT) prontos para colar em **outro chat de geração de imagens**, **com a foto-base anexada**. Gerados por \`tools/build-portfolio-docs.mjs\`; a lista e o motivo de cada escolha estão em [\`../image-generation-queue.md\`](../image-generation-queue.md).

${BATCH_01.map((b) => `- [\`${b.slug}.md\`](${b.slug}.md)`).join('\n')}

Regra de ouro: **variações fotográficas do mesmo produto, não receitas novas.** Imagem gerada nunca é \`REAL\`.
`,
);

// ---------------------------------------------------------------------------
// Pedido de fotos reais
// ---------------------------------------------------------------------------
const need = rows.filter((r) => r.generationPlan === 'NEEDS_REAL_PHOTO' || r.generationPlan === 'BLOCKED_AUTHORIZATION');
const weak = rows.filter((r) => r.referenceImage?.narrow);
writeFileSync(
  'docs/product-photo-request.md',
  `# Fotos que precisamos pedir à Bruna

> Gerado por \`tools/build-portfolio-docs.mjs\` (${generatedAt}). Sem foto real não há como mostrar o produto nem gerar variações fiéis.

## Obrigatórias

${need
  .map((r) => {
    const why = r.generationPlan === 'BLOCKED_AUTHORIZATION' ? 'só existe uma foto no Instagram, sem autorização: **a Bruna autoriza o uso** daquela foto **ou** manda uma foto nova' : r.slug === 'coxinha-de-salmao' ? 'só existe em vídeo (reel); falta uma foto estática do produto' : 'o cardápio do Yooga publica o produto sem foto';
    return `### ${r.name}

- Categoria: ${r.editorialCategory}${r.origin === 'Instagram' ? ' (item que aparece no Instagram e não está no cardápio Yooga)' : ''}
- Situação: ${why}.
- Foto necessária: **1 foto principal** do produto inteiro (e, se possível, mais 1 de perto mostrando o recheio/textura).
- Como fotografar: luz de janela (sem flash), produto sozinho sobre prato ou mesa clara e lisa, câmera na altura do produto ou levemente de cima, foto na vertical (4:5), celular em tela cheia e sem zoom digital; limpar a embalagem/prato antes; se for salgado ou quente, mostrar também o corte.`;
  })
  .join('\n\n')}

## Recomendada (foto-base fraca)

Estas fotos do Yooga são muito estreitas (menos de 250 px de largura) e servem mal de base para geração. Uma foto nova melhora o resultado:

${weak.map((r) => `- **${r.name}** (${r.editorialCategory}): ${r.referenceImage.size}${r.batch === 'BATCH 01' ? ' — está no BATCH 01; dá para gerar assim mesmo, mas uma foto nova é melhor' : ''}`).join('\n') || '- (nenhuma)'}

## Para todas as fotos novas

Pedir também a **autorização de uso no site** (com o que for fotografado), para registrar em \`provenance.authorization\`.
`,
);

// ---------------------------------------------------------------------------
// Revisão da copy (SOURCE → EDITORIAL)
// ---------------------------------------------------------------------------
const { PORTFOLIO_COPY } = await import('../src/data/portfolio-copy.ts');
writeFileSync(
  'docs/portfolio-copy-review.md',
  `# Copy editorial: SOURCE → EDITORIAL DISPLAY

> Gerada por \`tools/build-portfolio-docs.mjs\` (${generatedAt}). **Fonte comercial intacta** (\`src/data/products.ts\`, com os erros do delivery). O texto exibido na galeria vem de \`src/data/portfolio-copy.ts\`: ortografia corrigida, ruído operacional removido, resumo objetivo do que a fonte já diz. Nada foi inventado.

| Status | Produtos |
|---|---|
| \`APPROVED\` | ${T.copy.APPROVED} |
| \`DRAFT\` (só correção/limpeza; aguarda revisão da Bruna) | ${T.copy.DRAFT} |
| \`NEEDS_BRUNA_APPROVAL\` (fonte ambígua ou sem texto) | ${T.copy.NEEDS_BRUNA_APPROVAL} |
| \`SOURCE_RAW\` (texto de origem sem tratamento) | ${T.copy.SOURCE_RAW} |

${PORTFOLIO.map((p) => p)
  .filter((p) => p.source)
  .map((p) => {
    const c = PORTFOLIO_COPY[p.sourceProductId];
    return `### ${p.name} — \`${p.copyStatus}\`

- **SOURCE** (nome): ${p.source.name.trim()}
- **SOURCE** (descrição): ${p.source.description ? JSON.stringify(p.source.description.trim()) : '_(sem descrição)_'}
- **EDITORIAL**: ${p.shortDescription ?? '_(nada é exibido até a Bruna responder)_'}${c?.note ? `\n- Nota: ${c.note}` : ''}`;
  })
  .join('\n\n')}
`,
);

console.log(JSON.stringify(totals, null, 2));
