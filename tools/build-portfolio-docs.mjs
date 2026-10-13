/**
 * Gera a documentação do portfólio a partir de src/data/portfolio.ts (fonte única):
 *   docs/product-portfolio-matrix.{md,json}, docs/product-image-gaps.md, docs/image-generation-queue.md
 *
 *   node tools/build-portfolio-docs.mjs
 *
 * Roda o TypeScript do projeto direto no Node (>= 22.6): o loader abaixo só completa as extensões
 * dos imports relativos do código Astro/Vite ('./search' → './search.ts'). Não baixa nada.
 */
import { register } from 'node:module';
import { writeFileSync } from 'node:fs';

register(
  'data:text/javascript,' +
    encodeURIComponent(`
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
export async function resolve(specifier, context, next) {
  if (specifier.startsWith('.') && !/\\.[a-z]+$/.test(specifier) && context.parentURL) {
    const url = new URL(specifier + '.ts', context.parentURL);
    if (existsSync(fileURLToPath(url))) return next(url.href, context);
  }
  return next(specifier, context);
}`),
);

const { PORTFOLIO_ALL, PORTFOLIO, EDITORIAL_CATEGORIES, EXCLUDED, TARGET_IMAGES } = await import('../src/data/portfolio.ts');
const { CATEGORIES } = await import('../src/data/products.ts');

const catName = Object.fromEntries(EDITORIAL_CATEGORIES.map((c) => [c.slug, c.name]));
const catOrder = Object.fromEntries(EDITORIAL_CATEGORIES.map((c, i) => [c.slug, i]));

// Produtos do Hero de /produtos (src/pages/produtos.astro: HERO_IDS)
const HERO_IDS = [3415240, 4672088, 7103479, 3415251];
// Categorias de maior apelo visual (julgamento editorial; NÃO há dado de venda)
const VISUAL_CATEGORIES = new Set(['fatias', 'sobremesas-no-copo', 'cheesecakes-e-tortas', 'caseirinhos', 'coxinhas-doces']);

const realOf = (p) => p.gallery.filter((i) => i.status === 'REAL');
const publishableOf = (p) => p.gallery.filter((i) => i.src && i.provenance.authorization !== 'PENDING');

/** Melhor referência para gerar variações: maior imagem real que não seja foto de combo. */
function referenceOf(p) {
  const candidates = realOf(p).filter((i) => !/COMBO/.test(i.provenance.note ?? ''));
  candidates.sort((a, b) => (b.height ?? 0) * (b.width ?? 0) - (a.height ?? 0) * (a.width ?? 0));
  const best = candidates[0];
  if (!best) return null;
  return {
    id: best.id,
    source: best.source,
    ref: best.src ?? best.sourceUrl,
    publishable: Boolean(best.src && best.provenance.authorization !== 'PENDING'),
    size: best.width && best.height ? `${best.width}x${best.height}` : null,
  };
}

const quality = (p) => {
  const real = realOf(p);
  if (!real.length) return 'SEM_IMAGEM';
  const h = Math.max(...real.map((i) => i.height ?? 0));
  return h >= 640 ? 'MEDIA (640 px)' : 'BAIXA (até 500 px, CDN Yooga)';
};

const priority = (p) => {
  if (p.sourceProductId && HERO_IDS.includes(p.sourceProductId)) return 'P0';
  if (VISUAL_CATEGORIES.has(p.category) || p.gallery.some((i) => i.source === 'instagram')) return 'P1';
  return 'P2';
};

const rows = PORTFOLIO_ALL.map((p) => {
  const real = realOf(p);
  const missing = Math.max(0, TARGET_IMAGES - real.length);
  const ref = referenceOf(p);
  const yoogaCat = p.sourceCategoryId ? CATEGORIES.find((c) => c.id === p.sourceCategoryId) : null;
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    editorialCategory: catName[p.category],
    sourceCategory: yoogaCat ? yoogaCat.sourceName.trim() : null,
    origin: p.portfolioSource === 'yooga' ? 'Yooga' : 'Instagram',
    status: p.status,
    publishedInGallery: p.published,
    yoogaImage: p.gallery.find((i) => i.source === 'yooga')?.src ?? null,
    instagramImages: p.gallery.filter((i) => i.source === 'instagram').map((i) => ({ postUrl: i.sourceUrl, match: i.provenance.match, size: `${i.width}x${i.height}`, orientation: i.orientation, note: i.provenance.note ?? null })),
    otherRealImages: [],
    realImages: real.length,
    publishableImages: publishableOf(p).length,
    target: TARGET_IMAGES,
    missing,
    imageStatus: p.imageStatus,
    quality: quality(p),
    authorization: real.length === 0 ? 'n/a' : publishableOf(p).length === real.length ? 'PUBLIC_CDN (Yooga)' : 'Instagram: PENDENTE (não exibir)',
    generationPlan: p.generationPlan,
    generationNeeded: p.generationPlan === 'NEEDS_GENERATION' ? missing : 0,
    realPhotosNeeded: p.generationPlan === 'NEEDS_REAL_PHOTO' ? missing : 0,
    referenceImage: ref,
    priority: priority(p),
  };
});

// ---------------------------------------------------------------------------
// Totais
// ---------------------------------------------------------------------------
const count = (fn) => rows.filter(fn).length;
const yoogaRows = rows.filter((r) => r.origin === 'Yooga');
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
  complete4plus: count((r) => r.imageStatus === 'COMPLETE'),
  with3: count((r) => r.imageStatus === 'PARTIAL_3'),
  with2: count((r) => r.imageStatus === 'PARTIAL_2'),
  with1: count((r) => r.imageStatus === 'PARTIAL_1'),
  with0: count((r) => r.imageStatus === 'MISSING'),
  realImagesMapped: rows.reduce((n, r) => n + r.realImages, 0),
  realImagesPublishable: rows.reduce((n, r) => n + r.publishableImages, 0),
  imagesMissingToTarget: rows.reduce((n, r) => n + r.missing, 0),
  generationEstimate: rows.reduce((n, r) => n + r.generationNeeded, 0),
  productsThatCanReceiveGeneration: count((r) => r.generationPlan === 'NEEDS_GENERATION'),
  productsNeedingRealReference: count((r) => r.generationPlan === 'NEEDS_REAL_PHOTO'),
  realPhotosNeededForThose: rows.reduce((n, r) => n + r.realPhotosNeeded, 0),
};

const generatedAt = new Date().toISOString().slice(0, 10);
writeFileSync(
  'docs/product-portfolio-matrix.json',
  JSON.stringify({ generatedAt, generatedBy: 'tools/build-portfolio-docs.mjs (fonte: src/data/portfolio.ts)', targetImagesPerProduct: TARGET_IMAGES, totals, products: rows }, null, 2) + '\n',
);

// ---------------------------------------------------------------------------
// Matriz (md)
// ---------------------------------------------------------------------------
const esc = (s) => String(s ?? '').replace(/\|/g, '\\|');
const sorted = [...rows].sort((a, b) => catOrder[Object.keys(catName).find((k) => catName[k] === a.editorialCategory)] - catOrder[Object.keys(catName).find((k) => catName[k] === b.editorialCategory)]);

let md = `# Matriz mestre do portfólio e das imagens

> Gerada por \`node tools/build-portfolio-docs.mjs\` a partir de \`src/data/portfolio.ts\` (${generatedAt}). **Não editar à mão**: mude os dados e gere de novo. Versão estruturada: [\`product-portfolio-matrix.json\`](product-portfolio-matrix.json).

## Fontes e limites

| Fonte | Estado | O que entrou |
|---|---|---|
| Yooga (snapshot \`src/data/products.ts\`, auditado em 2026-10-05) | auditado | ${totals.yoogaSnapshot.categories} categorias, ${totals.yoogaSnapshot.products} produtos; **${totals.fromYooga}** entram no portfólio (ver exclusões) |
| Instagram \`@ateliedocesbruna\` | **parcial**: só o público, sem login | 12 publicações mais recentes da grade; 3 casam com itens do Yooga, 2 revelam itens que não estão no Yooga. Detalhe e limites: [\`portfolio-raw/instagram-observed.json\`](portfolio-raw/instagram-observed.json) |
| Menu de Bolos (Google Drive via Linktree) | **bloqueado** (login Google) | nada: nenhum bolo por encomenda foi inventado (\`CAKES_MENU_PENDING\`) |
| Arquivos reais no repositório | só provisórios | nenhum arquivo de produto real além das imagens do Yooga; \`src/assets/provisional/*\` são recortes da Master Reference, **não** são fotos de produto |
| Projeto irmão (\`_public-cache\`) | **não encontrado** nesta máquina | citado em \`docs/content-audit.md\`; autorização das fotos lá também é "pendente" |

**Instagram e autorização.** As imagens do Instagram estão **mapeadas** (publicação, data, formato, tamanho da miniatura pública) mas **não baixadas nem exibidas**: a autorização da Bruna continua pendente e as URLs do CDN deles expiram. Elas contam como "reais mapeadas", não como "publicáveis" hoje.

**Qualidade.** Todas as imagens do Yooga têm no máximo 500 px de altura (231–500 px de largura): servem para cards e para o modal, não para destaque grande. Nenhuma imagem foi avaliada como "alta resolução".

## Itens do Yooga que NÃO entram na galeria

Continuam no snapshot comercial; só não são criações para mostrar num portfólio.

${totals.excludedFromGallery.map((e) => `- **${e.sourceName}** (${e.products.join('; ')}): ${e.reason}`).join('\n')}

## Resumo numérico

| Indicador | Valor |
|---|---|
| Produtos no portfólio (Yooga + extras) | **${totals.portfolioProducts}** |
| …vindos do Yooga (\`YOOGA_ACTIVE\`) | ${totals.fromYooga} |
| …extras só do Instagram (\`PORTFOLIO_ONLY\`) | ${totals.extrasFromInstagram} |
| Publicados na galeria hoje | ${totals.publishedInGallery} (extras ficam fora até terem foto publicável) |
| Categorias editoriais | ${totals.editorialCategories} |
| Completos (4+ imagens) | ${totals.complete4plus} |
| Com 3 imagens | ${totals.with3} |
| Com 2 imagens | ${totals.with2} |
| Com 1 imagem | ${totals.with1} |
| Com 0 imagens | ${totals.with0} |
| Imagens reais mapeadas | ${totals.realImagesMapped} (publicáveis hoje: ${totals.realImagesPublishable}) |
| Imagens faltantes até a meta de ${TARGET_IMAGES}/produto | ${totals.imagesMissingToTarget} |
| Estimativa de imagens a gerar (produtos com referência real) | ${totals.generationEstimate}, em ${totals.productsThatCanReceiveGeneration} produtos (\`NEEDS_GENERATION\`) |
| Produtos que precisam de foto real antes de gerar | ${totals.productsNeedingRealReference} (${totals.realPhotosNeededForThose} imagens) (\`NEEDS_REAL_PHOTO\`) |

Status: \`COMPLETE\` (4+), \`PARTIAL_3\`, \`PARTIAL_2\`, \`PARTIAL_1\`, \`MISSING\` (0). Plano: \`NEEDS_GENERATION\` (tem 1+ referência real) ou \`NEEDS_REAL_PHOTO\` (nenhuma).

## Matriz por produto

| Produto | Categoria editorial | Origem / status | Reais (publ.) | Falta | Imagem | Qualidade | Plano |
|---|---|---|---|---|---|---|---|
${sorted
  .map(
    (r) =>
      `| ${esc(r.name)} | ${esc(r.editorialCategory)} | ${r.origin} · \`${r.status}\`${r.publishedInGallery ? '' : ' · fora da galeria'} | ${r.realImages} (${r.publishableImages}) | ${r.missing} | \`${r.imageStatus}\` | ${r.quality} | \`${r.generationPlan}\` |`,
  )
  .join('\n')}

## Correspondências do Instagram

| Publicação | Produto | Estado |
|---|---|---|
${rows
  .flatMap((r) => r.instagramImages.map((i) => `| ${i.postUrl} | ${esc(r.name)}${r.origin === 'Instagram' ? ' (extra)' : ''} | \`${i.match}\`${i.note ? ' · ' + esc(i.note) : ''} |`))
  .join('\n')}

As demais 7 publicações observadas (marca, bastidores, embalagem, imprensa de terceiros, docinhos sem produto nomeado) ficaram \`UNIDENTIFIED\` e não foram atribuídas a nenhum produto: ver o JSON bruto.
`;
writeFileSync('docs/product-portfolio-matrix.md', md);

// ---------------------------------------------------------------------------
// Gaps
// ---------------------------------------------------------------------------
const act = (r) => (r.generationPlan === 'NEEDS_REAL_PHOTO' ? 'REQUEST_REAL_REFERENCE' : r.generationPlan === 'NEEDS_GENERATION' ? `GENERATE_${r.generationNeeded}` : 'NONE');
const gapRows = sorted.filter((r) => r.missing > 0);
const refText = (r) =>
  r.referenceImage
    ? `${r.referenceImage.ref}${r.referenceImage.size ? ` (${r.referenceImage.size})` : ''}${r.referenceImage.publishable ? '' : ' — Instagram, autorização pendente'}`
    : '—';

writeFileSync(
  'docs/product-image-gaps.md',
  `# Lacunas de imagem por produto

> Gerado por \`tools/build-portfolio-docs.mjs\` (${generatedAt}). Meta: ${TARGET_IMAGES} imagens por produto (principal, detalhe/close, outro ângulo, contexto/embalagem). Nenhuma imagem foi gerada nesta fase.

${totals.complete4plus} produtos já completos; **${gapRows.length}** com lacuna, somando **${totals.imagesMissingToTarget}** imagens a produzir (${totals.generationEstimate} por geração a partir de referência real; ${totals.realPhotosNeededForThose} dependem de foto real).

${gapRows
  .map(
    (r) => `## ${r.name}

Categoria: ${r.editorialCategory} · ${r.origin} · \`${r.imageStatus}\`

Imagens reais: ${r.realImages}${r.publishableImages !== r.realImages ? ` (${r.publishableImages} publicável hoje)` : ''}

Meta: ${r.target}

Faltam: ${r.missing}

Melhor referência: ${refText(r)}

Ação: \`${act(r)}\`
`,
  )
  .join('\n---\n\n')}`,
);

// ---------------------------------------------------------------------------
// Fila
// ---------------------------------------------------------------------------
const queue = (level) =>
  rows
    .filter((r) => r.priority === level && r.missing > 0)
    .sort((a, b) => b.missing - a.missing || catOrder[Object.keys(catName).find((k) => catName[k] === a.editorialCategory)] - catOrder[Object.keys(catName).find((k) => catName[k] === b.editorialCategory)] || a.name.localeCompare(b.name, 'pt-BR'));
const section = (level, title, why) => {
  const list = queue(level);
  return `# ${level} — ${title}\n\n${why}\n\n${list.length ? list.map((r) => `- **${r.name}** — ${r.realImages} real, faltam ${r.missing} · \`${act(r)}\` · referência: ${refText(r)}`).join('\n') : '_(vazio)_'}\n`;
};
const realReq = rows.filter((r) => r.generationPlan === 'NEEDS_REAL_PHOTO');
writeFileSync(
  'docs/image-generation-queue.md',
  `# Fila de produção de imagens

> Gerada por \`tools/build-portfolio-docs.mjs\` (${generatedAt}). **Prioridade editorial, não comercial: não existe dado de venda**, então nada aqui foi priorizado por vendas. Critérios: (P0) produtos usados no Hero de \`/produtos\`; (P1) categorias de maior apelo visual (fatias, copos, cheesecakes, caseirinhos, coxinhas doces) e itens que a Bruna já destaca no Instagram; (P2) o restante. Dentro de cada nível: mais imagens faltando primeiro.

Regras para quem gerar: imagem gerada entra como \`APPROVED_GENERATED\` (nunca \`REAL\`), com proveniência e a referência usada; não repetir a mesma foto para "completar" a galeria; as referências do Yooga têm no máximo 500 px de altura.

${section('P0', 'Produtos do Hero', 'Aparecem no topo da página: prioridade máxima.')}
${section('P1', 'Visualmente fortes / destacados', 'Categorias de maior apelo e itens com foto recente no Instagram.')}
${section('P2', 'Restantes', 'Salgados, geladinhos, cookies, cones, bolos de pote e demais.')}
# Antes da geração: pedir foto real

Sem nenhuma imagem real, não há referência confiável. \`REQUEST_REAL_REFERENCE\`:

${realReq.length ? realReq.map((r) => `- **${r.name}** (${r.editorialCategory}) — pedir ${r.target} fotos reais (${r.priority})`).join('\n') : '_(nenhum)_'}

# Resumo

- Produtos na fila de geração: ${totals.productsThatCanReceiveGeneration} · imagens a gerar: ${totals.generationEstimate}
- Produtos que pedem foto real: ${totals.productsNeedingRealReference} · fotos reais necessárias: ${totals.realPhotosNeededForThose}
`,
);

console.log(JSON.stringify(totals, null, 2));
