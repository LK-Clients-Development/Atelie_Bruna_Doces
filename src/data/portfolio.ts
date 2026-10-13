/**
 * PORTFÓLIO EDITORIAL do Ateliê (camada de apresentação de /produtos).
 *
 * É uma camada SEPARADA do snapshot comercial (src/data/products.ts), que continua sendo a fonte
 * de nomes, descrições, preços e opções do Yooga. Aqui ficam só decisões editoriais:
 *   - quais itens do snapshot entram na galeria (e por que alguns não entram);
 *   - a categoria editorial de cada um (a categoria do Yooga continua guardada em `sourceCategoryId`);
 *   - as imagens de cada produto, com origem, autorização e estado;
 *   - como o visitante chega à compra (sempre FORA do site: WhatsApp ou cardápio Yooga).
 *
 * Preço NÃO é elemento do portfólio: continua no snapshot, mas nada daqui o expõe.
 * Nada de imagem foi baixada: as do Yooga são referenciadas no CDN; as do Instagram foram só
 * MAPEADAS (docs/portfolio-raw/instagram-observed.json) e NÃO são exibidas enquanto a autorização
 * da Bruna estiver pendente. Imagens geradas no futuro entram como `APPROVED_GENERATED`, nunca `REAL`.
 *
 * Evidência e totais: docs/product-portfolio-matrix.md (gerada por tools/build-portfolio-docs.mjs).
 */
import { LINKS } from './site';
import { CATEGORIES, type Product } from './products';
import { getProductDescription, getProductDisplayName } from '../lib/catalog';
import { PORTFOLIO_COPY } from './portfolio-copy';

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------
/** Meta de imagens por produto (galeria completa). */
export const TARGET_IMAGES = 4;

export type PortfolioStatus = 'YOOGA_ACTIVE' | 'PORTFOLIO_ONLY' | 'CAKES_MENU_PENDING' | 'LEGACY_OR_UNCONFIRMED';
export type GalleryImageStatus = 'REAL' | 'APPROVED_GENERATED' | 'PROVISIONAL' | 'PENDING';
export type MatchState = 'MATCH_CONFIRMED' | 'MATCH_PROBABLE' | 'UNIDENTIFIED';
export type Orientation = 'portrait' | 'landscape' | 'square';
export type PurchaseType = 'YOOGA' | 'WHATSAPP' | 'BOTH' | 'PENDING';
export type ImageStatus = 'COMPLETE' | 'PARTIAL_3' | 'PARTIAL_2' | 'PARTIAL_1' | 'MISSING';
/**
 * Plano de produção de imagens por produto:
 *   NONE                  já tem 4+ imagens publicáveis.
 *   NEEDS_GENERATION      tem referência real PUBLICÁVEL: dá para gerar variações fiéis.
 *   BLOCKED_AUTHORIZATION a única referência é real mas sem autorização (Instagram): não gerar até liberar.
 *   NEEDS_REAL_PHOTO      sem referência utilizável: pedir foto real (docs/product-photo-request.md).
 */
export type GenerationPlan = 'NONE' | 'NEEDS_GENERATION' | 'BLOCKED_AUTHORIZATION' | 'NEEDS_REAL_PHOTO';

/**
 * Situação de uma imagem em relação ao site (≠ "foi encontrada"):
 *   PUBLICABLE             pode aparecer no site hoje (imagem pública do cardápio Yooga, ou gerada e aprovada).
 *   AUTHORIZATION_PENDING  foto real encontrada (Instagram) SEM autorização da Bruna: só referência interna.
 *   REFERENCE_ONLY         serve só de referência/indício (ex.: capa de reel), nunca como foto do produto.
 *   GENERATED_APPROVED     imagem gerada e aprovada (publicável; continua sendo `APPROVED_GENERATED`, nunca REAL).
 *   MISSING                espaço da galeria sem imagem.
 */
export type SourceStatus = 'PUBLICABLE' | 'AUTHORIZATION_PENDING' | 'REFERENCE_ONLY' | 'GENERATED_APPROVED' | 'MISSING';

export type CopyStatus = 'APPROVED' | 'DRAFT' | 'SOURCE_RAW' | 'NEEDS_BRUNA_APPROVAL';

/** Os 4 espaços de cada galeria, na ordem de exibição (arquivos futuros: `src/assets/portfolio/<slug>/<slot>.<ext>`). */
export const IMAGE_SLOTS = ['01-hero', '02-detail', '03-angle', '04-context'] as const;
export type ImageSlot = (typeof IMAGE_SLOTS)[number];

/** Registro obrigatório quando uma imagem GERADA for integrada (status `APPROVED_GENERATED`, nunca `REAL`). */
export interface GeneratedProvenance {
  baseProductId: string;
  /** `GalleryImage.id` da foto real usada como fonte de verdade. */
  referenceImageId: string;
  generatedAt: string;
  kind: 'DETAIL' | 'ANGLE' | 'CONTEXT';
  approvedBy: string;
  approvedAt: string;
}

export interface GalleryImage {
  id: string;
  /** URL pública exibível. null = mapeada mas NÃO publicada (ex.: Instagram sem autorização). */
  src: string | null;
  source: 'yooga' | 'instagram' | 'generated';
  /** Página de origem (publicação do Instagram) ou cardápio. */
  sourceUrl: string;
  status: GalleryImageStatus;
  /** Pode aparecer no site hoje? (ver SourceStatus) */
  sourceStatus: SourceStatus;
  alt: string;
  orientation: Orientation;
  width: number | null;
  height: number | null;
  isPrimary: boolean;
  provenance: {
    origin: string;
    observedAt: string;
    /** PUBLIC_CDN: imagem pública do cardápio Yooga, usada sem cópia local · PENDING: sem autorização, não exibir. */
    authorization: 'PUBLIC_CDN' | 'PENDING';
    match: MatchState;
    note?: string;
    /** Só para `APPROVED_GENERATED`. */
    generation?: GeneratedProvenance;
  };
}

export interface PortfolioPurchase {
  type: PurchaseType;
  /** Mensagem pré-preenchida do WhatsApp (só quando o tipo inclui WhatsApp). */
  whatsappHref: string | null;
  /** Sem deep-link por produto no Yooga: sempre o cardápio geral. */
  yoogaHref: string | null;
}

export interface PortfolioProduct {
  id: string;
  slug: string;
  name: string;
  category: EditorialCategorySlug;
  sourceProductId: number | null;
  sourceCategoryId: string | null;
  status: PortfolioStatus;
  portfolioSource: 'yooga' | 'instagram';
  /** Texto exibido no card e no modal (EDITORIAL; a fonte bruta fica em `source`). */
  shortDescription: string | null;
  editorialDescription: string | null;
  copyStatus: CopyStatus;
  /** Nome e descrição exatamente como o Yooga publica (preservados; não exibir). */
  source: { name: string; description: string | null } | null;
  gallery: GalleryImage[];
  /** Imagem principal EXIBÍVEL (a única que o card carrega). null → card tipográfico. */
  heroImage: GalleryImage | null;
  purchase: PortfolioPurchase;
  /** Imagens encontradas (reais + referências), publicáveis ou não. */
  mappedImageCount: number;
  /** Imagens que podem aparecer no site hoje. */
  publishableImageCount: number;
  /** Cobertura PUBLICÁVEL (o que o site mostra hoje) frente à meta de 4. */
  imageStatus: ImageStatus;
  /** Só documentação/admin: nunca mostrar ao cliente. */
  plannedImages: number;
  generationPlan: GenerationPlan;
  /** Entra na galeria pública? Itens sem imagem exibível e sem compra ativa ficam de fora até terem foto. */
  published: boolean;
}

// ---------------------------------------------------------------------------
// Taxonomia editorial (camada 2; a categoria do Yooga é a camada 1)
// ---------------------------------------------------------------------------
export const EDITORIAL_CATEGORIES = [
  { slug: 'bolos', name: 'Bolos' },
  { slug: 'fatias', name: 'Fatias' },
  { slug: 'sobremesas-no-copo', name: 'Sobremesas no copo' },
  { slug: 'coxinhas-doces', name: 'Coxinhas doces' },
  { slug: 'doces-e-bombons', name: 'Doces e bombons' },
  { slug: 'caseirinhos', name: 'Caseirinhos' },
  { slug: 'cheesecakes-e-tortas', name: 'Cheesecakes e tortas' },
  { slug: 'cookies', name: 'Cookies' },
  { slug: 'geladinhos', name: 'Geladinhos' },
  { slug: 'bolos-de-pote', name: 'Bolos de pote' },
  { slug: 'cones-trufados', name: 'Cones trufados' },
  { slug: 'salgados', name: 'Salgados' },
  { slug: 'acai', name: 'Açaí' },
] as const;

export type EditorialCategorySlug = (typeof EDITORIAL_CATEGORIES)[number]['slug'];

/** Categoria do Yooga → categoria editorial. Categorias ausentes aqui não entram na galeria (ver EXCLUDED). */
const CATEGORY_MAP: Record<string, EditorialCategorySlug> = {
  'cat-441882': 'salgados',
  'cat-438417': 'fatias', // Fatias (brownie)
  'cat-578913': 'fatias', // Fatias de bolo
  'cat-438420': 'coxinhas-doces',
  'cat-746352': 'caseirinhos',
  'cat-441886': 'cheesecakes-e-tortas', // "Exclusivos"
  'cat-438418': 'sobremesas-no-copo', // "Doses da felicidade"
  'cat-746329': 'cookies', // "Quentinhos, combinam!"
  'cat-900001': 'acai',
  'cat-865789': 'geladinhos',
  'cat-438419': 'bolos-de-pote',
  'cat-438421': 'cones-trufados',
  'cat-923026': 'bolos', // "Tamanho família" (bolo de cenoura)
};

/** Exceções por produto (`sourceProductId`) quando a categoria do Yooga não descreve o item. */
const CATEGORY_OVERRIDES: Record<number, EditorialCategorySlug> = {
  5777324: 'doces-e-bombons', // Brigadeirão belga (no Yooga: Coxinhas doces)
  8271723: 'doces-e-bombons', // Alfajor doce de leite
  8801925: 'doces-e-bombons', // Bombom cravejado
  4579548: 'cheesecakes-e-tortas', // Torta de limão (no Yooga: Doses da felicidade)
};

/** Itens do snapshot que continuam no catálogo comercial mas NÃO entram na galeria editorial. */
export const EXCLUDED: Record<string, string> = {
  'cat-442641': 'Serviço do pedido ("Adicionar garfinho"), não é criação.',
  'cat-773392': 'Cartão presente: serviço/vale, não é criação para mostrar em galeria.',
  'cat-441887': 'Bebidas industrializadas revendidas (água e Coca-Cola): não são criações do Ateliê.',
  'cat-453111': 'Combo do dia: combinação temporária de itens que já aparecem separados (inclui refrigerante).',
};

// ---------------------------------------------------------------------------
// Instagram oficial (@ateliedocesbruna): observação PÚBLICA, sem login, 2026-10-13
// ---------------------------------------------------------------------------
const IG = 'https://www.instagram.com';
const IG_OBSERVED_AT = '2026-10-13';

interface InstagramPost {
  shortcode: string;
  kind: 'post' | 'reel';
  publishedAt: string;
  match: MatchState;
  /** `sourceProductId` do Yooga quando há correspondência. */
  sourceProductId?: number;
  width: number;
  height: number;
  alt: string;
  /** Ressalva sobre a foto (ex.: combo), repetida na proveniência. */
  note?: string;
}

/** Só as publicações que mostram um produto. As demais (marca, bastidores, imprensa) estão no JSON bruto. */
const INSTAGRAM_PRODUCT_POSTS: InstagramPost[] = [
  { shortcode: 'DeFMvlxxTqZ', kind: 'post', publishedAt: '2026-10-04', match: 'MATCH_CONFIRMED', sourceProductId: 8977203, width: 640, height: 640, alt: 'Copo Danette com morangos' },
  { shortcode: 'DdwhlyGxN6T', kind: 'post', publishedAt: '2026-09-26', match: 'MATCH_CONFIRMED', sourceProductId: 7734662, width: 640, height: 640, alt: 'Açaí na bandeja' },
  { shortcode: 'Ddeb7QFx7yR', kind: 'post', publishedAt: '2026-09-19', match: 'MATCH_CONFIRMED', sourceProductId: 4397996, width: 640, height: 640, alt: 'Coxinha de costela com cream cheese, em foto de combo', note: 'Foto de COMBO (coxinha salgada, coxinha doce e refrigerante): não serve de referência do produto isolado.' },
];

/** Produtos que aparecem no Instagram e NÃO existem no snapshot do Yooga. */
const EXTRA_PRODUCTS: Array<{
  id: string;
  slug: string;
  name: string;
  category: EditorialCategorySlug;
  status: PortfolioStatus;
  post: InstagramPost;
  note: string;
}> = [
  {
    id: 'ig-coxinha-de-salmao',
    slug: 'coxinha-de-salmao',
    name: 'Coxinha de salmão',
    category: 'salgados',
    status: 'PORTFOLIO_ONLY',
    note: 'Citada na legenda do reel; não consta no cardápio Yooga auditado.',
    post: { shortcode: 'DdmO-cVxzgp', kind: 'reel', publishedAt: '2026-09-22', match: 'MATCH_PROBABLE', width: 360, height: 640, alt: 'Coxinha de salmão' },
  },
  {
    id: 'ig-morango-do-amor',
    slug: 'morango-do-amor',
    name: 'Morango do amor',
    category: 'doces-e-bombons',
    status: 'PORTFOLIO_ONLY',
    note: 'Legenda cita só "Morango do amor"; não consta no cardápio Yooga auditado.',
    post: { shortcode: 'Ddb5yFqx5AW', kind: 'post', publishedAt: '2026-09-18', match: 'MATCH_PROBABLE', width: 578, height: 640, alt: 'Morango do amor' },
  },
];

// ---------------------------------------------------------------------------
// Construção
// ---------------------------------------------------------------------------
const orientationOf = (width: number | null, height: number | null): Orientation => {
  if (!width || !height) return 'portrait';
  if (height > width * 1.1) return 'portrait';
  if (width > height * 1.1) return 'landscape';
  return 'square';
};

const igImage = (post: InstagramPost, productId: string, name: string, note?: string): GalleryImage => ({
  id: `${productId}-ig-${post.shortcode}`,
  src: null, // mapeada, NÃO publicada: URLs do CDN do Instagram são assinadas/expiram e a autorização está pendente
  source: 'instagram',
  sourceUrl: `${IG}/ateliedocesbruna/${post.kind === 'reel' ? 'reel' : 'p'}/${post.shortcode}/`,
  // capa de reel é quadro de vídeo, não foto do produto: fica PENDING até haver foto estática
  status: post.kind === 'reel' ? 'PENDING' : 'REAL',
  sourceStatus: post.kind === 'reel' ? 'REFERENCE_ONLY' : 'AUTHORIZATION_PENDING',
  alt: `${name}: ${post.alt}`,
  orientation: orientationOf(post.width, post.height),
  width: post.width,
  height: post.height,
  isPrimary: false,
  provenance: {
    origin: `Instagram oficial @ateliedocesbruna, publicação de ${post.publishedAt}`,
    observedAt: IG_OBSERVED_AT,
    authorization: 'PENDING',
    match: post.match,
    note,
  },
});

const yoogaImage = (product: Product, name: string): GalleryImage | null =>
  product.imageUrl && product.imageSize
    ? {
        id: `${product.id}-yooga`,
        src: product.imageUrl,
        source: 'yooga',
        sourceUrl: LINKS.cardapio,
        status: 'REAL',
        sourceStatus: 'PUBLICABLE',
        alt: name,
        orientation: orientationOf(product.imageSize.width, product.imageSize.height),
        width: product.imageSize.width,
        height: product.imageSize.height,
        isPrimary: true,
        provenance: {
          origin: 'Cardápio público do Yooga (snapshot auditado em 2026-10-05)',
          observedAt: '2026-10-05',
          authorization: 'PUBLIC_CDN',
          match: 'MATCH_CONFIRMED',
          note: 'Imagem do CDN do Yooga (até 500 px de altura); não foi copiada para o repositório.',
        },
      }
    : null;

/** Só a primeira letra (o Yooga publica descrições em minúscula); o texto não muda. */
const capitalize = (text: string | null) => (text ? text.charAt(0).toLocaleUpperCase('pt-BR') + text.slice(1) : null);

const imageStatusOf = (count: number): ImageStatus =>
  count >= TARGET_IMAGES ? 'COMPLETE' : count === 3 ? 'PARTIAL_3' : count === 2 ? 'PARTIAL_2' : count === 1 ? 'PARTIAL_1' : 'MISSING';

const whatsappFor = (name: string) =>
  `${LINKS.whatsapp}?text=${encodeURIComponent(`Olá! Tenho interesse no produto ${name}.`)}`;

/** Pode aparecer no site hoje: tem URL e a situação é publicável (nunca `AUTHORIZATION_PENDING`/`REFERENCE_ONLY`). */
export const isPublishable = (image: GalleryImage): boolean =>
  Boolean(image.src) && (image.sourceStatus === 'PUBLICABLE' || image.sourceStatus === 'GENERATED_APPROVED');

function generationPlanOf(gallery: GalleryImage[], publishable: number): GenerationPlan {
  if (publishable >= TARGET_IMAGES) return 'NONE';
  // referência real utilizável = foto REAL publicável (a de combo não serve de base do produto isolado)
  if (gallery.some((image) => image.status === 'REAL' && isPublishable(image))) return 'NEEDS_GENERATION';
  if (gallery.some((image) => image.sourceStatus === 'AUTHORIZATION_PENDING' && !/COMBO/.test(image.provenance.note ?? ''))) return 'BLOCKED_AUTHORIZATION';
  return 'NEEDS_REAL_PHOTO';
}

function build(
  base: Pick<PortfolioProduct, 'id' | 'slug' | 'name' | 'category' | 'sourceProductId' | 'sourceCategoryId' | 'status' | 'portfolioSource' | 'shortDescription' | 'editorialDescription' | 'copyStatus' | 'source'>,
  gallery: GalleryImage[],
): PortfolioProduct {
  const publishable = gallery.filter(isPublishable);
  const active = base.status === 'YOOGA_ACTIVE';
  return {
    ...base,
    gallery,
    heroImage: publishable.find((image) => image.isPrimary) ?? publishable[0] ?? null,
    purchase: {
      type: active ? 'BOTH' : 'PENDING',
      whatsappHref: active ? whatsappFor(base.name) : null,
      yoogaHref: active ? LINKS.cardapio : null,
    },
    mappedImageCount: gallery.length,
    publishableImageCount: publishable.length,
    imageStatus: imageStatusOf(publishable.length),
    plannedImages: TARGET_IMAGES,
    generationPlan: generationPlanOf(gallery, publishable.length),
    // Yooga ativo sempre entra (card tipográfico quando não há foto); extras só com imagem publicável.
    published: active || publishable.length > 0,
  };
}

const yoogaProducts: PortfolioProduct[] = CATEGORIES.filter((category) => !(category.id in EXCLUDED)).flatMap((category) =>
  category.products.map((product) => {
    const copy = PORTFOLIO_COPY[product.sourceProductId];
    const name = copy?.displayName ?? getProductDisplayName(product);
    const gallery: GalleryImage[] = [];
    const hero = yoogaImage(product, name);
    if (hero) gallery.push(hero);
    INSTAGRAM_PRODUCT_POSTS.filter((post) => post.sourceProductId === product.sourceProductId).forEach((post) =>
      gallery.push(igImage(post, product.id, name, post.note)),
    );
    return build(
      {
        id: product.id,
        slug: product.slug,
        name,
        category: CATEGORY_OVERRIDES[product.sourceProductId] ?? CATEGORY_MAP[category.id],
        sourceProductId: product.sourceProductId,
        sourceCategoryId: category.id,
        status: 'YOOGA_ACTIVE',
        portfolioSource: 'yooga',
        // EDITORIAL (copy) quando existe; senão o texto de origem (SOURCE_RAW). A fonte bruta fica em `source`.
        shortDescription: copy ? copy.shortDescription : capitalize(getProductDescription(product)),
        editorialDescription: copy?.editorialDescription ?? null,
        copyStatus: copy?.status ?? 'SOURCE_RAW',
        source: { name: product.name, description: product.description },
      },
      gallery,
    );
  }),
);

const extraProducts: PortfolioProduct[] = EXTRA_PRODUCTS.map((extra) =>
  build(
    {
      id: extra.id,
      slug: extra.slug,
      name: extra.name,
      category: extra.category,
      sourceProductId: null,
      sourceCategoryId: null,
      status: extra.status,
      portfolioSource: 'instagram',
      shortDescription: null,
      editorialDescription: null,
      copyStatus: 'SOURCE_RAW',
      source: null,
    },
    [igImage(extra.post, extra.id, extra.name, extra.note)],
  ),
);

/** Todos os itens do portfólio (inclui os ainda não publicados). */
export const PORTFOLIO_ALL: PortfolioProduct[] = [...yoogaProducts, ...extraProducts];

/** Itens da galeria pública, agrupados na ordem das categorias editoriais. */
export const PORTFOLIO: PortfolioProduct[] = EDITORIAL_CATEGORIES.flatMap((category) =>
  PORTFOLIO_ALL.filter((product) => product.published && product.category === category.slug),
);

export function getPortfolioBySlug(slug: string): PortfolioProduct | undefined {
  return PORTFOLIO.find((product) => product.slug === slug);
}

/** Imagens que o visitante pode ver: só as PUBLICÁVEIS (ver `isPublishable`). */
export function getDisplayableImages(product: PortfolioProduct): GalleryImage[] {
  return product.gallery
    .filter(isPublishable)
    .sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary));
}
