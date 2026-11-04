/**
 * Conteúdo e configuração da apresentação comercial — módulo único, para que qualquer revisão de
 * texto ou link aconteça neste arquivo (nenhuma cena guarda cópia própria).
 *
 * Dados reais (links, contagens) espelham o que já está documentado no site institucional
 * (../../../src/data/site.ts, ../../../src/data/portfolio.ts). Onde o número é hipotético ou um
 * levantamento anterior não garantido, isso é dito explicitamente no texto da cena — nunca
 * apresentado como dado atual da Bruna.
 */

/** URL do site institucional em demonstração. Fica vazio até existir um deploy configurado (env VITE_SITE_URL). */
export const SITE_URL = (import.meta.env.VITE_SITE_URL ?? '').trim() || null;

export const LINKS = {
  whatsapp: 'https://wa.me/5535984235184',
  whatsappProposta: 'https://wa.me/5535984235184?text=' + encodeURIComponent('Olá! Vi a apresentação da LK Technologies Brasil e quero conversar sobre o projeto do Ateliê.'),
  instagram: 'https://www.instagram.com/ateliedocesbruna/',
  cardapio: 'https://delivery.yooga.app/ateliedocesbruna',
} as const;

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
    subtitle: 'Uma nova experiência digital para o Ateliê Doces Bruna.',
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
    subtitle: 'Uma maneira mais organizada, inspiradora e envolvente de conhecer tudo o que o Ateliê oferece.',
  },
  reveal: {
    id: 'reveal',
    kicker: 'Revelação do site',
    title: ['Imagine o Ateliê', 'sendo apresentado assim.'],
  },
  journey: {
    id: 'journey',
    kicker: 'A jornada do cliente',
    title: ['Conhecer. Explorar.', 'Desejar. Encomendar.'],
  },
  analytics: {
    id: 'analytics',
    kicker: 'Conhecer melhor os clientes',
    title: ['E se cada visita ajudasse', 'a entender melhor seu negócio?'],
  },
  roadmap: {
    id: 'roadmap',
    kicker: 'Uma evolução possível',
    title: ['Tecnologia que acompanha', 'o crescimento do Ateliê.'],
  },
  closing: {
    id: 'closing',
    kicker: 'Convite final',
    title: ['Vamos construir o próximo', 'capítulo do Ateliê?'],
    subtitle: 'Uma experiência digital à altura de tudo o que você já construiu.',
  },
} as const satisfies Record<string, Scene>;

/** Cena 02: canais já confirmados no Linktree público observado (não inclui catálogo, removido pela Bruna). */
export const CHANNELS = [
  { id: 'instagram', label: 'Instagram', detail: '@ateliedocesbruna', note: 'Vitrine de criações e bastidores' },
  { id: 'linktree', label: 'Linktree', detail: 'Todos os canais reunidos', note: 'Localização, delivery e atendimento' },
  { id: 'yooga', label: 'Yooga', detail: 'Cardápio de delivery', note: 'Pedidos online já em funcionamento' },
  { id: 'whatsapp', label: 'WhatsApp', detail: '(35) 98423-5184', note: 'Atendimento direto e pessoal' },
  { id: 'loja', label: 'Loja física', detail: 'Itapeva, MG', note: 'Onde tudo começa, de verdade' },
  { id: 'maps', label: 'Google Maps', detail: 'Ficha do negócio', note: 'Encontrada por quem está por perto' },
] as const;

/** Cena 03: levantamento anterior do cardápio Yooga — não é garantia de volume atual. */
export const CATALOG_SURVEY = {
  categories: 17,
  products: 54,
  note: 'Levantamento anterior do cardápio Yooga — não é um número atual garantido.',
  sample: ['Bolos', 'Fatias', 'Doces no copo', 'Coxinhas doces', 'Caseirinhos', 'Cheesecakes', 'Cookies', 'Geladinhos', 'Bolos de pote', 'Cones trufados', 'Salgados', 'Açaí'],
} as const;

/** Cena 05: a jornada não inclui carrinho/checkout — a compra continua na Yooga ou no WhatsApp. */
export const JOURNEY_STEPS = [
  { step: 1, label: 'Encontra', detail: 'O cliente encontra o Ateliê (Instagram, indicação, busca).' },
  { step: 2, label: 'Conhece', detail: 'Conhece a história e o cuidado por trás de cada criação.' },
  { step: 3, label: 'Explora', detail: 'Explora as coleções: bolos, doces, salgados, sobremesas.' },
  { step: 4, label: 'Escolhe', detail: 'Decide como falar com o Ateliê: WhatsApp ou cardápio.' },
  { step: 5, label: 'Encomenda', detail: 'Segue para a Yooga ou o WhatsApp para fechar o pedido.' },
] as const;

/** Cena 06: exemplo ILUSTRATIVO e hipotético — nunca dado real da Bruna. */
export const ANALYTICS_DEMO = {
  disclaimer: 'Demonstração conceitual com números fictícios, só para ilustrar a ideia.',
  product: 'Chocolatuda',
  views: 20,
  purchases: 2,
  viewsWithoutPurchase: 18,
  question: 'Você sabe o que seus clientes mais procuram antes de comprar?',
  note: 'A Yooga já documenta relatórios de vendas, produtos, clientes e funil de conversão — o objetivo aqui é entender quais a Bruna já usa e onde ainda falta visibilidade. O site pode medir o que acontece nele (visualizações de coleções, cliques para encomendar); medir a compra em si na Yooga depende dos mecanismos de integração disponíveis lá.',
} as const;

/** Cena 07: fases não são serviços já contratados — é uma visão de evolução possível. */
export const ROADMAP_PHASES = [
  {
    phase: '01',
    label: 'Presença digital',
    items: ['Site institucional', 'História da marca', 'Galeria de coleções', 'Domínio próprio', 'Experiência mobile', 'Integração com os canais atuais'],
  },
  {
    phase: '02',
    label: 'Inteligência comercial',
    items: ['Análise de visitas', 'Interesse por coleção', 'Origem dos acessos', 'Cliques para encomendar', 'Aproveitamento dos relatórios da Yooga', 'Identificação de oportunidades'],
  },
  {
    phase: '03',
    label: 'Autonomia tecnológica',
    items: ['Painel de gestão personalizado', 'Integrações', 'Automações', 'Relacionamento com clientes', 'Eventual solução própria de pedidos'],
    caveat: 'Visão futura, sujeita a diagnóstico e viabilidade — não um serviço já contratado.',
  },
] as const;

export const SCENE_ORDER = ['opening', 'foundation', 'opportunity', 'reveal', 'journey', 'analytics', 'roadmap', 'closing'] as const;
export type SceneId = (typeof SCENE_ORDER)[number];
