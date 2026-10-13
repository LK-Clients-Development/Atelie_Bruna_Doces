/**
 * DIREÇÃO DE ARTE da galeria de /produtos (Concept 09 V2): como cada categoria é composta.
 * Só decisão visual: nada comercial (isso é products.ts) nem editorial de imagem (portfolio.ts).
 *
 * Cada categoria (capítulo) recebe uma VARIANTE; `planBlocks` transforma a variante e o número de
 * produtos em uma sequência de BLOCOS (templates de CSS Grid em src/styles/portfolio-gallery.css).
 * Determinístico, sem CSS por produto: mudar de categoria = mudar de variante aqui.
 *
 * Blocos (3 colunas lógicas por tipo):
 *   solo      1 fotografia protagonista
 *   duo       1 grande + 1 menor
 *   feature3  1 grande (2 linhas) + 2 menores empilhadas
 *   mosaic5   1 grande (2×2) + 4 menores
 *   wide4     1 larga + 3 verticais, mesma altura
 *   trio      3 verticais
 *   stagger   3 verticais com a do meio deslocada (ritmo de revista)
 *
 * Os textos de capítulo (`blurb`/`detail`) são COPY NOVA da página: `DRAFT` quando só reordenam o que
 * as descrições do Yooga já dizem; `NEEDS_BRUNA_APPROVAL` quando vêm do Concept e afirmam algo
 * (ex.: "ingredientes selecionados") que a Bruna precisa confirmar.
 */
import type { CopyStatus, EditorialCategorySlug } from './portfolio';

export type ChapterVariant = 'feature' | 'mosaic' | 'strip' | 'editorial';
export type BlockKind = 'solo' | 'duo' | 'feature3' | 'mosaic5' | 'wide4' | 'trio' | 'stagger';

export interface ChapterLayout {
  variant: ChapterVariant;
  /** Linha curta sob o título do capítulo. */
  blurb: string;
  /** Parágrafo opcional (só onde o Concept tem um). */
  detail?: string;
  status: CopyStatus;
  /** Por que o texto está nesse status. */
  note?: string;
}

export const CHAPTER_LAYOUT: Record<EditorialCategorySlug, ChapterLayout> = {
  bolos: {
    variant: 'feature',
    blurb: 'Nossos clássicos, sempre especiais.',
    detail: 'Bolos que fazem parte da nossa história, preparados com ingredientes selecionados e muito carinho.',
    status: 'NEEDS_BRUNA_APPROVAL',
    note: 'Texto do Concept: "nossa história" e "ingredientes selecionados" são afirmações da marca a confirmar.',
  },
  fatias: {
    variant: 'mosaic',
    blurb: 'Fatias generosas para adoçar o seu dia.',
    detail: 'Camadas que se encontram em sabores incríveis, com o equilíbrio perfeito entre massa, recheio e cobertura.',
    status: 'NEEDS_BRUNA_APPROVAL',
    note: 'Texto do Concept: "generosas" e "equilíbrio perfeito" são juízos de valor a confirmar.',
  },
  'sobremesas-no-copo': { variant: 'strip', blurb: 'Camadas de cremes, brownie e frutas, servidas no copo.', status: 'DRAFT', note: 'Resume as descrições do Yooga.' },
  'coxinhas-doces': { variant: 'editorial', blurb: 'Brigadeiro, morango e coberturas em formato de coxinha.', status: 'DRAFT', note: 'Resume as descrições do Yooga.' },
  'doces-e-bombons': { variant: 'feature', blurb: 'Brigadeiro, doce de leite e chocolate em pequenos doces.', status: 'DRAFT', note: 'Resume as descrições do Yooga.' },
  caseirinhos: { variant: 'strip', blurb: 'Massas molhadinhas com recheios e coberturas cremosas.', status: 'DRAFT', note: 'Resume as descrições do Yooga.' },
  'cheesecakes-e-tortas': { variant: 'editorial', blurb: 'Bases crocantes, cremes e geleias de frutas.', status: 'DRAFT', note: 'Resume as descrições do Yooga.' },
  cookies: { variant: 'feature', blurb: 'Cookies americanos com chocolate.', status: 'DRAFT', note: 'Resume as descrições do Yooga.' },
  geladinhos: { variant: 'mosaic', blurb: 'Geladinhos de sabores variados.', status: 'DRAFT', note: 'Resume os nomes do Yooga.' },
  'bolos-de-pote': { variant: 'feature', blurb: 'Massa de chocolate e recheios cremosos no pote.', status: 'DRAFT', note: 'Resume as descrições do Yooga.' },
  'cones-trufados': { variant: 'editorial', blurb: 'Casquinha crocante banhada no chocolate, com brigadeiro.', status: 'DRAFT', note: 'Resume as descrições do Yooga.' },
  salgados: { variant: 'editorial', blurb: 'Coxinhas, empada, esfihas e enroladinho.', status: 'DRAFT', note: 'Lista o que o cardápio do Yooga tem.' },
  acai: { variant: 'feature', blurb: 'Açaí puro, servido na bandeja.', status: 'DRAFT', note: 'Resume a descrição do Yooga.' },
};

/** Momentos editoriais da página (copy nova do Concept; a Bruna precisa aprovar). */
export const EDITORIAL_MOMENTS = {
  heroNote: { text: 'Mais que doces, momentos inesquecíveis.', status: 'NEEDS_BRUNA_APPROVAL' as CopyStatus, note: 'Frase de marca do Concept; não existe na fonte.' },
  albumNote: { text: 'Cada criação conta um pedaço da nossa história.', status: 'NEEDS_BRUNA_APPROVAL' as CopyStatus, note: 'Frase de marca do Concept; não existe na fonte.' },
};

export interface BlockPlan {
  kind: BlockKind;
  /** Quantos produtos o bloco consome. */
  count: number;
  /** Espelha o bloco (a foto grande troca de lado). */
  flip: boolean;
}

const COUNT: Record<BlockKind, number> = { solo: 1, duo: 2, feature3: 3, mosaic5: 5, wide4: 4, trio: 3, stagger: 3 };

/** Preenche `n` produtos com blocos pequenos, evitando uma foto sozinha no fim. */
function fill(n: number): BlockKind[] {
  if (n <= 0) return [];
  if (n === 1) return ['solo'];
  if (n === 2) return ['duo'];
  if (n === 3) return ['trio'];
  if (n === 4) return ['wide4'];
  if (n === 5) return ['trio', 'duo'];
  if (n === 6) return ['trio', 'trio'];
  if (n === 7) return ['wide4', 'trio'];
  return ['wide4', ...fill(n - 4)];
}

function kinds(variant: ChapterVariant, n: number): BlockKind[] {
  switch (variant) {
    case 'feature':
      if (n === 1) return ['solo'];
      if (n === 2) return ['duo'];
      return ['feature3', ...fill(n - 3)];
    case 'mosaic': {
      if (n < 5) return fill(n);
      if (n % 5 === 1) return [...Array<BlockKind>((n - 6) / 5).fill('mosaic5'), 'trio', 'trio'];
      return [...Array<BlockKind>(Math.floor(n / 5)).fill('mosaic5'), ...fill(n % 5)];
    }
    case 'strip':
      if (n >= 4 && n - 4 !== 1) return ['wide4', ...kinds('strip', n - 4)];
      return fill(n);
    case 'editorial':
      if (n === 1) return ['solo'];
      if (n === 2) return ['duo'];
      if (n === 3) return ['stagger'];
      if (n === 4) return ['wide4'];
      return ['stagger', ...kinds('editorial', n - 3)];
  }
}

/** Sequência de blocos de um capítulo; `flip` alterna a cada bloco, começando por `startFlip`. */
export function planBlocks(variant: ChapterVariant, n: number, startFlip = false): BlockPlan[] {
  return kinds(variant, n).map((kind, i) => ({ kind, count: COUNT[kind], flip: startFlip !== (i % 2 === 1) }));
}
