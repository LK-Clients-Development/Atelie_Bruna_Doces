/**
 * Expansão comercial da V3 (quatro etapas visuais, fora da sequência principal de seis slides).
 * Tudo aqui é CONCEITO ILUSTRATIVO: nenhum dado é real, nenhum sistema existe ainda e nenhuma integração
 * (Yooga, pagamento, PDV, fiscal) é prometida. Não há backend, banco de dados nem APIs.
 */

export const XP_NOTE_CONCEPT =
  'Conceito ilustrativo. Desenvolvimento, funcionalidades, integrações e migração dependem de diagnóstico e proposta independente.';

/* ------------------------------------------------------------------ 07A */
export const ESSENTIAL_A = {
  eyebrow: 'Expansão comercial',
  option: 'Opção 01',
  title: ['Mais controle para o Ateliê,', 'sem mudar como você vende.'],
  lead: 'O Yooga continua. A LK pode desenvolver ferramentas complementares para organizar sua operação.',
  yooga: { label: 'Yooga', line: 'Continua recebendo pedidos' },
  lk: { label: 'Gestão Essencial LK', line: 'Estoque · Registros · Relatórios' },
  independent: 'Dois ambientes independentes, sem sincronização automática.',
  concepts: [
    { id: 'estoque', n: '01', title: 'Estoque', text: 'Acompanhar quantidades e movimentações.' },
    { id: 'vendas', n: '02', title: 'Vendas', text: 'Registrar vendas e encomendas manualmente.' },
    { id: 'visao', n: '03', title: 'Visão do negócio', text: 'Consultar resumos e informações cadastradas.' },
  ],
  cta: 'Ver como funcionaria',
} as const;

/* ------------------------------------------------------------------ 07B */
export const ESSENTIAL_B = {
  eyebrow: 'Expansão comercial · Opção 01',
  title: ['Uma gestão mais organizada,', 'passo a passo.'],
  sample: 'Exemplo ilustrativo · dados fictícios',
  modules: [
    {
      id: 'estoque',
      label: 'Estoque',
      text: 'O histórico registra quando uma quantidade entra, sai ou é corrigida, permitindo acompanhar as movimentações.',
    },
    {
      id: 'vendas',
      label: 'Vendas',
      text: 'A Bruna continuaria vendendo no Yooga. A venda seria cadastrada na gestão complementar para gerar acompanhamento.',
    },
    {
      id: 'relatorios',
      label: 'Relatórios',
      text: 'Resumos visuais construídos a partir do que foi registrado. Os gráficos abaixo são apenas exemplos.',
    },
    {
      id: 'site',
      label: 'Interesse no site',
      text: 'Esses indicadores dependem da configuração de eventos no site e não representam automaticamente vendas concluídas.',
    },
  ],
  stock: {
    modes: [
      { id: 'ready', label: 'Produto pronto', item: 'Brigadeiro', unit: 'unidades', start: 24 },
      { id: 'ingredient', label: 'Ingredientes', item: 'Leite condensado', unit: 'latas', start: 18 },
    ],
    modeNote: 'Estoque de produto pronto e de ingredientes são possibilidades de modelagem a validar.',
    actions: [
      { id: 'in', label: 'Entrada +10', delta: 10, kind: 'Entrada' },
      { id: 'out', label: 'Saída −3', delta: -3, kind: 'Saída' },
      { id: 'adj', label: 'Ajuste −2', delta: -2, kind: 'Ajuste' },
    ],
    reset: 'Reiniciar exemplo',
  },
  sales: {
    product: 'Brigadeiro',
    channel: 'Yooga',
    record: 'Manual',
    initialQty: 3,
    cta: 'Registrar venda (exemplo)',
    disclaimer: 'O lançamento é manual: não importa pedidos nem baixa estoque sem uma configuração específica.',
  },
  reports: {
    sales: { title: 'Vendas registradas', bars: [4, 7, 5, 9, 6, 11, 8] },
    top: {
      title: 'Produtos mais registrados nas vendas',
      rows: [
        { label: 'Brigadeiro', value: 86 },
        { label: 'Bolo no pote', value: 62 },
        { label: 'Torta', value: 41 },
      ],
    },
    history: { title: 'Histórico de movimentações', rows: ['Entrada · +10', 'Saída · −3', 'Ajuste · −2'] },
    stock: {
      title: 'Resumo do estoque',
      rows: [
        { label: 'Itens cadastrados', value: '12' },
        { label: 'Movimentações no mês', value: '34' },
      ],
    },
  },
  site: {
    metrics: [
      { label: 'Visitas', value: '1.240' },
      { label: 'Produtos visualizados', value: '860' },
      { label: 'Cliques para WhatsApp', value: '96' },
      { label: 'Cliques para Yooga', value: '134' },
    ],
  },
  cta: 'Conhecer a gestão integrada',
} as const;

/* ------------------------------------------------------------------ 08A */
export const INTEGRATED_A = {
  eyebrow: 'Expansão comercial',
  option: 'Opção 02',
  title: ['Uma plataforma própria', 'para o Ateliê.'],
  subtitle: 'Imagine pedidos, clientes e operação conectados em um único ambiente.',
  message:
    'Uma possível evolução, para substituir o Yooga somente depois de desenvolver e validar uma solução própria. Ela ainda não existe.',
  conceptTag: 'Conceito visual',
  nav: ['Visão geral', 'Pedidos', 'Clientes', 'Estoque', 'Vendas'],
  kpis: [
    { label: 'Pedidos hoje', value: '18' },
    { label: 'Em preparo', value: '5' },
    { label: 'Clientes', value: '240' },
  ],
  orders: [
    { id: '#201', name: 'Cliente A', status: 'Novo' },
    { id: '#202', name: 'Cliente B', status: 'Em preparo' },
    { id: '#203', name: 'Cliente C', status: 'Pronto' },
  ],
  flow: ['Cliente', 'Cardápio digital', 'Pedido', 'Preparação', 'Entrega ou retirada', 'Registro e relatórios'],
  cta: 'Explorar a plataforma',
} as const;

/* ------------------------------------------------------------------ 08B */
export const INTEGRATED_B = {
  eyebrow: 'Expansão comercial · Opção 02',
  title: ['Uma visão completa', 'da operação.'],
  sample: 'Conceito ilustrativo · dados fictícios',
  modules: [
    { id: 'pedidos', n: '01', label: 'Pedidos', text: 'Receber e acompanhar pedidos.' },
    { id: 'clientes', n: '02', label: 'Clientes', text: 'Histórico de compras e relacionamento.' },
    { id: 'estoque', n: '03', label: 'Estoque', text: 'Controle de quantidades e movimentações.' },
    { id: 'vendas', n: '04', label: 'Vendas', text: 'Indicadores baseados nos pedidos registrados na plataforma.' },
    { id: 'operacao', n: '05', label: 'Operação', text: 'Preparação, entregas e retiradas.' },
    { id: 'relatorios', n: '06', label: 'Relatórios', text: 'Visão gerencial para apoiar decisões.' },
  ],
  orders: [
    { id: '#301', name: 'Cliente A', item: '2 × Brigadeiro', stage: 0 },
    { id: '#302', name: 'Cliente B', item: '1 × Bolo no pote', stage: 1 },
    { id: '#303', name: 'Cliente C', item: '1 × Torta', stage: 2 },
  ],
  orderStages: ['Novo', 'Em preparo', 'Pronto', 'Entregue ou retirado'],
  customer: {
    initials: 'CE',
    name: 'Cliente exemplo',
    since: 'Cliente desde 2025 (fictício)',
    purchases: [
      { id: '#188', item: 'Bolo no pote', when: 'mar' },
      { id: '#241', item: 'Brigadeiro', when: 'jun' },
      { id: '#303', item: 'Torta', when: 'set' },
    ],
    favorite: 'Mais pedido: Brigadeiro',
  },
  stock: {
    item: 'Brownie',
    qty: 18,
    unit: 'disponíveis',
    moves: ['Produção · +12', 'Pedido #301 · −2', 'Ajuste · −1'],
  },
  sales: { title: 'Pedidos registrados na semana', bars: [5, 8, 6, 11, 9, 14, 10], days: ['S', 'T', 'Q', 'Q', 'S', 'S', 'D'] },
  operation: ['Preparo', 'Embalagem', 'Entrega ou retirada'],
  reports: {
    title: 'Vendas por categoria',
    rows: [
      { label: 'Doces', value: 46 },
      { label: 'Bolos', value: 31 },
      { label: 'Tortas', value: 23 },
    ],
  },
  note: XP_NOTE_CONCEPT,
} as const;
