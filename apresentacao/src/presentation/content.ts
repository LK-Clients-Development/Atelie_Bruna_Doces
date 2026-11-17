/**
 * Conteúdo e configuração da apresentação comercial (V2) — módulo único, para que qualquer revisão
 * de texto ou link aconteça neste arquivo (nenhuma cena guarda cópia própria).
 *
 * Dados reais (links, contagens) espelham o que já está documentado no site institucional
 * (../../../src/data/site.ts, ../../../src/data/products.ts). Onde o número é um levantamento
 * anterior, isso é dito explicitamente no texto da cena — nunca apresentado como dado atual.
 *
 * Tom: consultivo e respeitoso. Nenhum problema é presumido, nenhum resultado é prometido e nenhum
 * valor é publicado aqui (valores ficam só no roteiro interno: docs/roteiro-comercial-bruna-v2.md).
 */

/** Site institucional publicado e validado (usado quando VITE_SITE_URL não está definida). */
export const PUBLISHED_SITE_URL = 'https://ateliebrunadoces.vercel.app/';

/**
 * URL do site institucional em demonstração (Cena 04, botão "Explorar o site").
 * - Homologação local: defina VITE_SITE_URL em `.env.local` (ex.: http://localhost:4321/).
 * - Produção/padrão: sem variável, usa o site publicado acima.
 */
export const SITE_URL: string = (import.meta.env.VITE_SITE_URL ?? '').trim() || PUBLISHED_SITE_URL;

export const LINKS = {
  instagram: 'https://www.instagram.com/ateliedocesbruna/',
  cardapio: 'https://delivery.yooga.app/ateliedocesbruna',
  /**
   * Contato comercial oficial da LK Technologies Brasil: NÃO existe destino verificado no repositório.
   * Enquanto for null, o fechamento é consultivo e sem link (nunca o WhatsApp da própria Bruna).
   * PENDÊNCIA DO OWNER: informar o WhatsApp/e-mail comercial oficial da LK.
   */
  lkContact: null as string | null,
};

export const BRAND = {
  name: 'Ateliê Doces Bruna',
  location: 'Itapeva, MG',
} as const;

export const AGENCY = {
  name: 'LK Technologies Brasil',
  line: 'Uma proposta desenvolvida por LK Technologies Brasil.',
} as const;

export interface Scene {
  id: string;
  kicker: string;
  title: string[];
  subtitle?: string;
}

export const SCENES = {
  opening: {
    id: 'opening',
    kicker: 'Ateliê Doces Bruna × LK Technologies Brasil',
    title: ['Mais do que doces.', 'Uma história que merece ser conhecida.'],
    subtitle: 'Acompanhamos o seu trabalho e preparamos esta conversa com carinho e respeito pelo que você construiu.',
  },
  foundation: {
    id: 'foundation',
    kicker: 'O que a Bruna já construiu',
    title: ['O Ateliê já conquistou', 'seu espaço.'],
    subtitle: 'Uma marca construída com dedicação, criatividade e conexão com seus clientes.',
  },
  opportunity: {
    id: 'opportunity',
    kicker: 'A oportunidade',
    title: ['E se descobrir suas criações', 'fosse uma experiência?'],
    subtitle: 'Hoje seus clientes já conseguem comprar. Nossa proposta é melhorar também a experiência de conhecer o Ateliê.',
  },
  reveal: {
    id: 'reveal',
    kicker: 'Revelação do site',
    title: ['Imagine o Ateliê', 'sendo apresentado assim.'],
    subtitle: 'Capturas reais do site institucional publicado.',
  },
  journey: {
    id: 'journey',
    kicker: 'A jornada do cliente',
    title: ['Conhecer. Explorar.', 'Desejar. Encomendar.'],
  },
  analytics: {
    id: 'analytics',
    kicker: 'Conhecer melhor as escolhas',
    title: ['E se cada visita mostrasse', 'o que desperta interesse?'],
  },
  roadmap: {
    id: 'roadmap',
    kicker: 'Uma evolução possível',
    title: ['Tecnologia que acompanha', 'o crescimento do Ateliê.'],
    subtitle: 'Podemos começar pelo que faz sentido para você hoje e evoluir conforme o seu negócio precisar.',
  },
  closing: {
    id: 'closing',
    kicker: 'Próximo passo',
    title: ['Vamos construir o próximo', 'capítulo do Ateliê?'],
    subtitle: 'Se essa experiência fizer sentido para o Ateliê, podemos começar pelo primeiro passo.',
  },
} as const satisfies Record<string, Scene>;

/** Cena 02: canais já existentes — conquistas da Bruna (Linktree público observado; sem catálogo removido). */
export const CHANNELS = [
  { id: 'instagram', label: 'Instagram', detail: '@ateliedocesbruna', note: 'Vitrine de criações e bastidores' },
  { id: 'linktree', label: 'Linktree', detail: 'Todos os canais reunidos', note: 'Localização, delivery e atendimento' },
  { id: 'yooga', label: 'Yooga', detail: 'Cardápio de delivery', note: 'Pedidos online já em funcionamento' },
  { id: 'whatsapp', label: 'WhatsApp', detail: 'Atendimento direto', note: 'Conversa pessoal com quem encomenda' },
  { id: 'loja', label: 'Loja física', detail: 'Itapeva, MG', note: 'Onde tudo começa, de verdade' },
  { id: 'maps', label: 'Google Maps', detail: 'Ficha do negócio', note: 'Encontrada por quem está por perto' },
] as const;

/** Cena 02: transição estratégica + convite ao diálogo (perguntas completas ficam no roteiro do apresentador). */
export const FOUNDATION_BRIDGE = {
  text: 'O Ateliê já possui canais para ser encontrado e receber pedidos. Nossa proposta é explorar como todos eles podem trabalhar ainda melhor em conjunto.',
  invite: 'Antes de qualquer proposta, queremos ouvir você:',
  prompts: ['Como seus clientes encontram o Ateliê hoje?', 'O que você mais gostaria de melhorar na experiência deles?', 'Qual é o próximo objetivo do Ateliê?'],
} as const;

/**
 * Cena 03: levantamento do cardápio Yooga — data da auditoria, não garantia de volume atual.
 * Conferido contra src/data/products.ts do site (CATALOG_SNAPSHOT.auditedAt = 2026-10-05): 17 categorias, 54 produtos. Sem divergência.
 */
export const CATALOG_SURVEY = {
  categories: 17,
  products: 54,
  note: 'Levantamento do cardápio em 05/10/2026 (produtos do site) — não é um número atual garantido.',
} as const;

export type OppIcon = 'search' | 'megaphone' | 'message' | 'store' | 'book' | 'sparkles' | 'image' | 'bag';

/** Cena 03: duas jornadas. A proposta é um caminho ADICIONAL — não substitui nenhum canal, nem é a única possibilidade. */
export const COMPARISON = {
  current: {
    label: 'Hoje',
    caption: 'Um dos caminhos atuais',
    steps: [
      { n: 1, label: 'Encontra o Ateliê', icon: 'search' },
      { n: 2, label: 'Conhece pelos canais atuais', icon: 'megaphone' },
      { n: 3, label: 'WhatsApp ou Yooga', icon: 'message' },
    ],
  },
  proposed: {
    label: ['Experiência', 'proposta'],
    caption: ['Um caminho a mais,', 'mais completo'],
    entry: { n: 1, label: 'Encontra o Ateliê', icon: 'store' },
    hub: {
      title: 'Ambiente digital próprio',
      steps: [
        { n: 2, label: 'Conhece a história da Bruna', icon: 'book' },
        { n: 3, label: 'Explora as criações', icon: 'sparkles' },
        { n: 4, label: 'Descobre produtos com fotos e detalhes', icon: 'image' },
        { n: 5, label: 'Escolhe como encomendar', icon: 'bag' },
      ],
    },
    exit: { n: 6, label: 'Segue para o WhatsApp ou Yooga', icon: 'message' },
  },
  notes: {
    complement: 'O site complementa os canais existentes. Não substitui o delivery ou o atendimento atual.',
    survey: CATALOG_SURVEY.note,
  },
} as const;

/** Cena 05: a jornada não inclui carrinho/checkout — a compra continua no Yooga ou no WhatsApp. */
export const JOURNEY_STEPS = [
  { step: 1, label: 'Encontrar', detail: 'O cliente chega ao Ateliê pelos caminhos que você já tem, agora com um lugar próprio para onde ir.' },
  { step: 2, label: 'Conhecer', detail: 'Descobre quem é a Bruna e o cuidado por trás de cada criação.' },
  { step: 3, label: 'Explorar', detail: 'Percorre as coleções com calma: bolos, doces, salgados e sobremesas.' },
  { step: 4, label: 'Escolher', detail: 'Vê as criações com boas fotografias e desenvolve interesse.' },
  { step: 5, label: 'Encomendar', detail: 'Encontra um caminho simples para o WhatsApp ou o Yooga, onde o pedido continua.' },
] as const;

export const JOURNEY_NOTE =
  'O site não tem carrinho nem checkout: o pedido continua nos canais atuais. A proposta é melhorar a apresentação, a organização e a experiência — sem prometer vendas ou conversões.';

/** Cena 06: três níveis, do que o site mede ao que depende de diagnóstico. Nada aqui é dado real da Bruna. */
export const ANALYTICS_LEVELS = [
  {
    id: 'a',
    tag: 'Nível A',
    label: 'O que o site pode medir',
    items: ['Páginas visitadas', 'Coleções exploradas', 'Cliques em produtos', 'Cliques para WhatsApp e Yooga', 'Origem do acesso, quando identificável'],
    status: 'Possível na primeira solução',
  },
  {
    id: 'b',
    tag: 'Nível B',
    label: 'O que o Yooga pode oferecer',
    items: ['Vendas e produtos vendidos', 'Histórico de clientes', 'Pedidos', 'Relatórios comerciais'],
    status: 'Depende do plano, das funcionalidades e das permissões',
  },
  {
    id: 'c',
    tag: 'Nível C',
    label: 'Integrações futuras',
    items: ['Correlação entre canais e vendas', 'Relatórios unificados', 'Análises avançadas', 'Automações comerciais'],
    status: 'Possibilidade, sujeita a diagnóstico e viabilidade',
  },
] as const;

export const ANALYTICS_QUESTION = 'Você sabe quais criações despertam mais interesse antes do pedido?';

export const ANALYTICS_NOTE =
  'O site mede o que acontece nele. Uma compra feita no Yooga não é registrada automaticamente pelo site — isso dependeria de uma integração a ser avaliada.';

/** Cena 07: fases não são serviços contratados — é uma visão de evolução possível. Fase 01 é a primeira proposta. */
export const ROADMAP_PHASES = [
  {
    phase: '01',
    label: 'Presença digital',
    badge: 'Primeiro passo possível',
    items: ['Site institucional personalizado', 'História da marca e da Bruna', 'Galeria de criações', 'Domínio próprio', 'Experiência mobile', 'Caminhos para encomendar: WhatsApp e Yooga', 'Preparação para ser encontrado em buscadores'],
  },
  {
    phase: '02',
    label: 'Inteligência comercial',
    badge: 'Possibilidade futura',
    items: ['Análise das visitas e origens de acesso', 'Interesse por categorias e produtos', 'Cliques para encomendar', 'Leitura dos relatórios do Yooga, se disponíveis', 'Relacionamento e fidelização'],
    caveat: 'Depende de diagnóstico e da disponibilidade de dados.',
  },
  {
    phase: '03',
    label: 'Autonomia tecnológica',
    badge: 'Visão de longo prazo',
    items: ['Painéis personalizados', 'Integrações e automações', 'Controle operacional e, se necessário, estoque', 'Relacionamento inteligente', 'Eventual solução própria de pedidos'],
    caveat: 'Visão futura, sujeita a diagnóstico e viabilidade — não um serviço já contratado. Nada disso exige substituir o que a Bruna usa hoje.',
  },
] as const;

/** Cena 07: possibilidades breves. Opcionais, sob consulta; não fazem parte do escopo inicial. */
export const ROADMAP_EXTRAS = {
  seasonal: {
    label: 'Campanhas sazonais',
    items: ['Páscoa', 'Dia das Crianças', 'Black Friday', 'Natal', 'Datas próprias e lançamentos'],
  },
  optional: {
    label: 'Serviços opcionais',
    items: ['Páginas temporárias de campanha', 'Páginas de eventos', 'Cartão de fidelidade virtual'],
  },
  disclaimer: 'Possibilidades opcionais, sob consulta — fora do escopo inicial.',
  expansion: 'Em conversa, caso façam sentido: alcançar outras cidades, atender empresas e eventos, cuidar dos clientes recorrentes.',
} as const;

/** Cena 08: fechamento consultivo. Escopo e valores NÃO são publicados aqui. */
export const CLOSING = {
  deliveryLabel: 'Primeira entrega possível',
  delivery: ['Identidade da marca', 'História da Bruna', 'Galeria das criações', 'Experiência mobile', 'Integração com os canais atuais', 'Preparação para domínio próprio'],
  steps: ['Conversar sobre prioridades', 'Validar a solução', 'Alinhar o escopo', 'Receber uma proposta'],
  caveat: 'A proposta final, com escopo e valores, depende do diagnóstico e da aprovação comercial.',
  contactNote: 'Quem apresentou esta proposta acompanha você nos próximos passos.',
} as const;

export const SCENE_ORDER = ['opening', 'foundation', 'opportunity', 'reveal', 'journey', 'analytics', 'roadmap', 'closing'] as const;
export type SceneId = (typeof SCENE_ORDER)[number];

/**
 * Cena 02: novidades regionais. Iniciativa da PRÓPRIA Bruna (não da LK) — evidência: print da descrição do
 * grupo de WhatsApp "Extrema" (delivery "chegando", data a definir por votação). NÃO prova entregas ativas.
 * Espelha o status de ../../src/data/regional.ts (fonte única no site): ao mudar lá, replique aqui.
 * Camanducaia: sem confirmação de status/link → linguagem neutra. Nenhum link de grupo é exibido na apresentação.
 */
export const REGIONAL_NEWS = {
  label: 'Novidades regionais',
  line: 'A própria Bruna está levando o Ateliê além de Itapeva.',
  cities: [
    { id: 'extrema', name: 'Extrema', text: 'Delivery em organização' },
    { id: 'camanducaia', name: 'Camanducaia', text: 'Novidades para a região' },
  ],
} as const;
