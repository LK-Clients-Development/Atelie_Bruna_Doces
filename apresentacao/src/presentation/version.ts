/**
 * Seleção de versão da apresentação.
 *
 * Ordem de decisão:
 *   1. ?v=2 ou ?v=3 na URL (alternância rápida na prévia local);
 *   2. VITE_PRESENTATION_VERSION=2|3 (.env.local);
 *   3. padrão: V3 (desenvolvimento e produção). A V2 continua disponível com ?v=2.
 */
export type PresentationVersion = 2 | 3;

function parse(value: string | null | undefined): PresentationVersion | null {
  const v = (value ?? '').trim();
  return v === '2' ? 2 : v === '3' ? 3 : null;
}

export function resolvePresentationVersion(): PresentationVersion {
  const fromQuery = typeof window !== 'undefined' ? parse(new URLSearchParams(window.location.search).get('v')) : null;
  return fromQuery ?? parse(import.meta.env.VITE_PRESENTATION_VERSION) ?? 3;
}
