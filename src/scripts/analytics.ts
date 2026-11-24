/**
 * Eventos de conversão (V4). Sem ID de rastreamento: o site NÃO carrega GA/Pixel hoje. Este módulo só
 * publica os eventos em `window.dataLayer` (e chama `window.gtag`, se alguém instalar o GA/GTM depois).
 * Não coleta dado pessoal: só o nome do evento, o destino (host) e o slug do produto.
 *
 * Uso em HTML: <a data-track="delivery_click" data-track-place="hero">. Em código: window.atelieTrack(name, params).
 * Eventos: delivery_click, whatsapp_click, custom_order_click, store_directions_click, instagram_click,
 * regional_group_click, product_view, product_share, product_search.
 */
type Params = Record<string, string | number | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    atelieTrack?: (name: string, params?: Params) => void;
  }
}

if (!window.atelieTrack) {
  const track = (name: string, params: Params = {}) => {
    const payload = { event: name, ...params };
    (window.dataLayer = window.dataLayer || []).push(payload);
    if (typeof window.gtag === 'function') window.gtag('event', name, params);
  };
  window.atelieTrack = track;

  document.addEventListener(
    'click',
    (event) => {
      const el = (event.target as Element | null)?.closest<HTMLElement>('[data-track]');
      if (!el) return;
      track(el.dataset.track!, { place: el.dataset.trackPlace, product: el.dataset.trackProduct });
    },
    { capture: true },
  );
}

export {};
