/**
 * Conteúdo e configuração da apresentação comercial V3 (protótipo local, em homologação visual e comercial).
 *
 * A V2 (oito cenas) continua em content.ts e permanece recuperável (ver version.ts).
 * Nada aqui inventa informação sobre a LK ou o Ateliê: cargos e biografias NÃO existem nesta versão,
 * e nenhum valor comercial é publicado (o campo de investimento é configurável e começa como "a definir").
 */

import { BRAND } from './content';

/** Ordem da apresentação V3. Os dois últimos são a expansão comercial opcional (fora da sequência padrão). */
export const V3_SLIDES = [
  { id: 'lk', kicker: 'Conheça a LK Technologies Brasil', group: 'main' },
  { id: 'demo', kicker: 'O site que preparamos para você', group: 'main' },
  { id: 'atelie', kicker: 'O que enxergamos no Ateliê', group: 'main' },
  { id: 'brand', kicker: 'Uma presença digital à altura da marca', group: 'main' },
  { id: 'proposal', kicker: 'Nossa proposta para o Ateliê', group: 'main' },
  { id: 'closing', kicker: 'Encerramento', group: 'main' },
  { id: 'essential-a', kicker: 'Gestão essencial: visão geral', group: 'expansion' },
  { id: 'essential-b', kicker: 'Gestão essencial: como funcionaria', group: 'expansion' },
  { id: 'integrated-a', kicker: 'Gestão integrada: visão geral', group: 'expansion' },
  { id: 'integrated-b', kicker: 'Gestão integrada: explorar a plataforma', group: 'expansion' },
] as const;

export const V3_MAIN_COUNT = V3_SLIDES.filter((s) => s.group === 'main').length; // 6
export const V3_EXPANSION_START = V3_MAIN_COUNT; // índice do slide 07
export const V3_CLOSING_INDEX = V3_MAIN_COUNT - 1;

/* ---------------------------------------------------------------- 01 */
export const LK_INTRO = {
  kicker: 'Prazer, estamos aqui por você',
  title: ['Prazer, somos a', 'LK Technologies Brasil.'],
  description:
    'Uma empresa de pesquisa, desenvolvimento e soluções de software, dedicada a criar experiências digitais e soluções tecnológicas para negócios.',
  forLabel: 'Uma proposta preparada para',
  boxTitle: 'Quem está por trás da LK?',
  people: ['Lukas', 'Leonardo'],
  photoAlt: 'Lukas e Leonardo, representantes da LK Technologies Brasil',
} as const;

/* ---------------------------------------------------------------- 03 */
export const ATELIE_VIEW = {
  kicker: 'O que enxergamos no Ateliê',
  title: ['O Ateliê já construiu sua identidade.', 'Queremos ajudar mais pessoas a conhecê-la.'],
  lead: 'Estudamos o seu trabalho com carinho. Esta conversa parte do que você já construiu, sem trocar nada do que funciona.',
  items: [
    { id: 'marca', label: 'Uma marca construída', note: 'Identidade própria e reconhecível' },
    { id: 'criacoes', label: 'Produtos e criações', note: 'Bolos, doces e sobremesas feitos com cuidado' },
    { id: 'loja', label: 'Loja física', note: BRAND.location },
    { id: 'instagram', label: 'Instagram', note: '@ateliedocesbruna' },
    { id: 'whatsapp', label: 'WhatsApp', note: 'Conversa direta com quem encomenda' },
    { id: 'yooga', label: 'Yooga', note: 'Cardápio de delivery em funcionamento' },
    { id: 'clientes', label: 'Relação com os clientes', note: 'O que sustenta tudo isso' },
  ],
  caption: 'Nenhum canal precisa ser substituído.',
} as const;

/* ---------------------------------------------------------------- 04 */
export const BRAND_PRESENCE = {
  kicker: 'Branding e presença digital',
  title: ['Uma presença digital', 'à altura da sua marca.'],
  quote: ['Sua marca já tem personalidade.', 'Agora ela também pode ter um espaço digital próprio.'],
  approach: 'Valorizar, organizar e fortalecer a marca que já existe, sem mudar a logomarca.',
  points: [
    { id: 'presenca', label: 'Presença digital mais forte' },
    { id: 'identidade', label: 'Identidade visual valorizada, como já é' },
    { id: 'historia', label: 'A história da Bruna contada com calma' },
    { id: 'criacoes', label: 'As criações apresentadas com destaque' },
    { id: 'mobile', label: 'Experiência pensada para o celular' },
    { id: 'central', label: 'Informações reunidas em um só lugar' },
    { id: 'caminhos', label: 'Caminhos diretos para o WhatsApp e o Yooga' },
  ],
} as const;

/* ---------------------------------------------------------------- 02 */
export const SITE_DEMO = {
  kicker: 'Demonstração real',
  title: ['O site que preparamos', 'para você.'],
  highlights: ['Identidade do Ateliê', 'História da Bruna', 'Produtos', 'Navegação', 'Caminhos para encomendar'],
  buttonLabel: 'Explorar o site',
  localNote: 'Demonstração aberta no ambiente local. Não é a publicação final.',
  remoteNote: 'Versão de demonstração do site, em homologação. Não é o lançamento definitivo.',
} as const;

/** Porta do site Astro em desenvolvimento (ver astro.config.mjs na raiz). */
const LOCAL_SITE_DEV_PORT = '4321';

/**
 * URL do site para o botão "Explorar o site".
 * 1) VITE_SITE_URL, se definida (decisão explícita do Owner);
 * 2) em desenvolvimento, o site local (mesma origem quando servida pelo Astro, senão localhost:4321);
 * 3) a URL configurada atualmente (fallback), sem alterá-la.
 */
export function resolveDemoSite(fallbackUrl: string, envUrl: string | undefined): { url: string; isLocal: boolean } {
  const explicit = (envUrl ?? '').trim();
  if (explicit) return { url: explicit, isLocal: /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])/i.test(explicit) };
  if (import.meta.env.DEV && typeof window !== 'undefined') {
    const { protocol, hostname, port, origin } = window.location;
    const isLoopback = hostname === 'localhost' || hostname === '127.0.0.1';
    if (isLoopback) {
      return { url: port === LOCAL_SITE_DEV_PORT ? `${origin}/` : `${protocol}//${hostname}:${LOCAL_SITE_DEV_PORT}/`, isLocal: true };
    }
  }
  return { url: fallbackUrl, isLocal: false };
}

/* ---------------------------------------------------------------- 05 */
/**
 * Proposta comercial (presença digital). Domínio e hospedagem são custos de terceiros:
 * a LK não os controla nem os recebe. Sem promessa de posicionamento em buscadores.
 */
export const PROPOSAL = {
  kicker: 'Nossa proposta',
  title: ['Nossa proposta', 'para o Ateliê.'],
  productLabel: 'Produto',
  product: 'Presença Digital do Ateliê',
  scopeLabel: 'Escopo preliminar',
  scope: [
    'Finalização do site institucional existente',
    'Vitrine de produtos',
    'História da marca',
    'Experiência responsiva',
    'Links para WhatsApp e Yooga',
    'Preparação técnica para publicação',
    'Ajustes de conteúdo aprovados pela Bruna',
    'Preparação técnica inicial para indexação',
  ],
  outLabel: 'Fora do escopo inicial',
  out: ['CRM', 'ERP', 'Controle de estoque', 'Checkout próprio', 'Substituição do Yooga', 'Integrações complexas', 'Automações comerciais', 'Manutenção ilimitada'],
  terms: [
    { id: 'prazo', label: 'Prazo', value: 'Finalização após ajustes finais, configuração técnica e publicação' },
    { id: 'pagamento', label: 'Pagamento', value: 'Pagamento na entrega' },
  ],
  costButton: 'Custo do investimento',
  domainButton: 'Domínio',
  cost: {
    tag: 'LK Technologies Brasil',
    title: 'Pesquisa e desenvolvimento',
    items: ['Finalização e entrega do site institucional', 'Ajustes finais e publicação técnica'],
    amount: 'R$ 680,00',
    condition: 'Pagamento na entrega',
  },
  /** Referência consultada no Squarespace Domains (valores informados pelo Owner). Custo de terceiros, independente da mão de obra da LK. */
  domain: {
    label: 'Squarespace Domains',
    name: 'ateliedocesbruna.com',
    description: 'Registro de domínio próprio para o Ateliê.',
    selectorLabel: 'Período de registro',
    plans: [
      { period: '1 ano', price: 'R$ 75,09', full: 'R$ 118,00', caption: '1 ano · primeiro registro' },
      { period: '2 anos', price: 'R$ 171,64', full: 'R$ 236,00', caption: '2 anos' },
      { period: '3 anos', price: 'R$ 289,64', full: 'R$ 354,00', caption: '3 anos' },
      { period: '4 anos', price: 'R$ 407,64', full: 'R$ 472,00', caption: '4 anos' },
      { period: '5 anos', price: 'R$ 525,64', full: 'R$ 590,00', caption: '5 anos' },
      { period: '10 anos', price: 'R$ 1.115,64', full: 'R$ 1.180,00', caption: '10 anos' },
    ],
    note: 'Valores consultados no Squarespace em 23/11/2026. Sujeitos a alterações, disponibilidade, impostos e condições do provedor.',
  },
} as const;

/* ---------------------------------------------------------------- 06 */
export const CLOSING_V3 = {
  kicker: 'Próximo passo',
  title: ['Vamos construir o próximo', 'capítulo do Ateliê?'],
  lead: 'Se essa experiência fizer sentido para o Ateliê, podemos dar o primeiro passo juntos.',
  steps: ['Conversar sobre prioridades', 'Validar o site', 'Alinhar o escopo', 'Receber a proposta'],
  caveat: 'A proposta final depende do alinhamento de escopo e da aprovação comercial.',
  signature: 'Uma proposta desenvolvida pela LK Technologies Brasil.',
  moreLabel: 'Conhecer outras possibilidades',
} as const;

/* ------------------------------------------------------- Expansão comercial */
/** Conteúdo das quatro etapas visuais: ver content-v3-expansion.ts. */
export const EXPANSION_LABEL = 'Expansão comercial';
export const EXPANSION_DISCLAIMER = 'Possibilidade sujeita a diagnóstico e a orçamento independente. Não faz parte da proposta de presença digital.';
