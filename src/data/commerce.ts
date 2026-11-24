/**
 * Central comercial (V4): decide PARA ONDE cada intenção do visitante vai. Nenhum componente
 * escreve URL comercial à mão; todos leem daqui (que lê LINKS em site.ts, a fonte das URLs).
 *
 * Intenção → destino:
 *   delivery / pronta-entrega  → Yooga oficial (LINKS.cardapio)
 *   bolo personalizado         → WhatsApp (o menu de bolos exige login Google e ainda não é público)
 *   loja física                → seção #loja da Home + localização (busca no Google Maps)
 *   atendimento personalizado  → WhatsApp
 *   expansão regional          → grupos de WhatsApp (src/data/regional.ts, só com autorização)
 */
import { LINKS, isPending } from './site';

export const GO = {
  delivery: LINKS.cardapio,
  whatsapp: LINKS.whatsapp,
  /** Encomenda de bolo: menu público quando existir; hoje, o WhatsApp. */
  customOrder: isPending(LINKS.menuBolos) ? LINKS.whatsapp : LINKS.menuBolos,
  instagram: LINKS.instagram,
  products: LINKS.criacoes,
  store: '/#loja',
} as const;

/** WhatsApp com mensagem pré-escrita (texto neutro, sem dados pessoais). */
export const whatsappWith = (text: string): string => `${LINKS.whatsapp}?text=${encodeURIComponent(text)}`;

/**
 * Loja física. SÓ o que é verificável: a cidade (Instagram, Google e Yooga concordam).
 * Endereço completo e horário NÃO são exibidos: divergem/estão sem confirmação (ver PENDING_ITEMS em site.ts).
 * "Como chegar" abre uma BUSCA do Google Maps pelo nome e cidade (não afirma endereço);
 * troque `directions` pelo link oficial da ficha do Google quando a Bruna enviar.
 */
export const STORE = {
  city: 'Itapeva',
  state: 'MG',
  address: null as string | null,
  hours: null as string | null,
  directions: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('Ateliê Doces Bruna Itapeva MG')}`,
} as const;

/**
 * Novidades e campanhas. VAZIO de propósito: não há campanha (nem de Natal) confirmada pela Bruna.
 * Para publicar uma, acrescente um item aqui (a seção passa a listá-las e deixa de mostrar a chamada institucional).
 * Nunca inventar produto, preço ou data.
 */
export interface Campaign {
  id: string;
  title: string;
  text: string;
  /** Import de imagem real já existente no projeto, ou null. */
  image?: ImageMetadata | null;
  cta: { label: string; href: string };
}
export const CAMPAIGNS: Campaign[] = [];

/** Produtos em destaque na Home: slugs de src/data/portfolio.ts. Curadoria editorial, NÃO "mais vendidos". */
export const FAVORITES = ['fatia-chocolatuda', 'fatia-matilda', 'copo-ferrero', 'cheesecake-frutas-vermelhas', 'bolo-de-cenoura'] as const;
