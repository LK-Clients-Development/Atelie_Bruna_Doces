/**
 * Novidades regionais (Extrema e Camanducaia): ÚNICA fonte dos textos, status e links desta seção.
 * A homepage (src/components/RegionalNews.astro) só lê este arquivo. A apresentação comercial
 * (apresentacao/src/presentation/content.ts, REGIONAL_NEWS) espelha os textos e o status: ao mudar
 * um status aqui, replique lá. Guia de atualização: docs/regional-news.md.
 *
 * REGRAS (não relaxar sem confirmação do Owner/da Bruna):
 *  - Nunca inventar link de convite, data ou disponibilidade.
 *  - O CTA do grupo só aparece com `group.url` válido E `group.authorizedToPublish === true`.
 *  - Existir um grupo de WhatsApp NÃO significa entregas ativas: `status` é decidido por confirmação.
 *  - Não confundir: telefone da Bruna (LINKS.whatsapp), cardápio Yooga (LINKS.cardapio) e convite de grupo
 *    (https://chat.whatsapp.com/...) são destinos diferentes.
 */

/** EM ORGANIZAÇÃO: data/operação sendo definidas · EM BREVE: chegada anunciada, sem data · ATIVO: entregas confirmadas
 *  · PAUSADO: suspensa temporariamente · NÃO CONFIRMADO: sem confirmação suficiente (linguagem neutra). */
export type DeliveryStatus = 'organizing' | 'soon' | 'active' | 'paused' | 'unconfirmed';

export const DELIVERY_STATUS_LABEL: Record<DeliveryStatus, string> = {
  organizing: 'Em organização',
  soon: 'Em breve',
  active: 'Entregas ativas',
  paused: 'Pausado',
  unconfirmed: 'Novidades futuras',
};

export interface RegionalGroup {
  /** Convite do grupo de WhatsApp (https://chat.whatsapp.com/...). `null` enquanto não houver link REAL confirmado. */
  url: string | null;
  /** A Bruna autorizou divulgar o convite publicamente? Só `true` com confirmação dela. */
  authorizedToPublish: boolean;
  ctaLabel: string;
  /** Aviso exibido sob o botão quando o grupo é compartilhado/provisório (transparência para o visitante). */
  sharedNote?: string;
}

export interface RegionalCity {
  id: string;
  name: string;
  state: string;
  headline: string;
  detail: string;
  status: DeliveryStatus;
  /** Linha curta opcional sob o status (ex.: data). Não inventar calendário. */
  statusNote?: string;
  group: RegionalGroup;
  /** Origem da informação (documentação interna; não é exibida). */
  evidence: string;
}

/**
 * Convite do grupo de WhatsApp de Extrema, informado pelo Owner.
 * O REPOSITÓRIO É PÚBLICO: o convite NÃO fica no código. Ele vem da variável de ambiente
 * REGIONAL_GROUP_URL_EXTREMA (.env.local, não versionado; ou variável da Vercel, quando autorizado).
 * DECISÃO DO OWNER: enquanto Camanducaia não tem grupo próprio, o CTA dela aponta para este mesmo grupo.
 * PUBLICAÇÃO: `authorizedToPublish` está FALSE até a Bruna autorizar a divulgação pública do convite. Enquanto for false,
 * o botão não é renderizado e o convite NÃO sai no HTML/JS da produção. Para ativar: confirme com a Bruna, defina a
 * variável de ambiente e troque para true.
 */
const EXTREMA_GROUP_URL: string | null = (import.meta.env.REGIONAL_GROUP_URL_EXTREMA as string | undefined)?.trim() || null;

export const REGIONAL_NEWS = {
  kicker: 'Ateliê Doces Bruna',
  title: ['O Ateliê está chegando', 'mais longe.'],
  subtitle: 'Acompanhe as novidades do Ateliê na sua cidade e fique por dentro das próximas entregas.',
  cities: [
    {
      id: 'extrema',
      name: 'Extrema',
      state: 'MG',
      headline: 'Nosso delivery está chegando à região.',
      detail: 'Acompanhe as novidades e participe da organização das próximas datas.',
      status: 'organizing',
      statusNote: 'Data ainda a definir.',
      group: { url: EXTREMA_GROUP_URL, authorizedToPublish: false, ctaLabel: 'Participar do grupo de Extrema' },
      evidence:
        'Print da descrição do grupo de WhatsApp "Extrema ✨📍" fornecido pelo Owner: anuncia a chegada do delivery e diz que a data será definida pela votação. Comprova organização, não entregas ativas.',
    },
    {
      id: 'camanducaia',
      name: 'Camanducaia',
      state: 'MG',
      headline: 'Novidades do Ateliê para a região.',
      detail: 'Acompanhe os anúncios e informações sobre as próximas entregas.',
      status: 'unconfirmed',
      // Provisório: sem grupo próprio ainda, usa o grupo de Extrema. Rótulo honesto (não diz que o grupo é de Camanducaia).
      group: {
        url: EXTREMA_GROUP_URL,
        authorizedToPublish: false,
        ctaLabel: 'Entrar no grupo de novidades',
        sharedNote: 'Grupo regional de novidades, atualmente o mesmo de Extrema.',
      },
      evidence:
        'Informado verbalmente pelo Owner (expansão para Camanducaia). Sem print, sem link de convite e sem status operacional confirmado.',
    },
  ] satisfies RegionalCity[],
} as const;

/** Formato esperado de convite de grupo. Valida a ESTRUTURA, não que o convite exista. */
const GROUP_INVITE = /^https:\/\/chat\.whatsapp\.com\/[A-Za-z0-9_-]{10,}$/;

/** CTA do grupo: só existe com URL válida e divulgação autorizada. Caso contrário, `null` (nada é renderizado). */
export const groupCta = (city: RegionalCity): { href: string; label: string; note?: string } | null => {
  const { url, authorizedToPublish, ctaLabel, sharedNote } = city.group;
  if (!url || !authorizedToPublish || !GROUP_INVITE.test(url)) return null;
  return { href: url, label: ctaLabel, note: sharedNote };
};
