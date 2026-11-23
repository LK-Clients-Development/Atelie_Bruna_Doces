/**
 * Assets oficiais da LK (logomarca e foto de Lukas e Leonardo), resolvidos pelo nome do arquivo em
 * src/assets/lk/. Se não existirem, retornam null e a cena renderiza placeholders identificados.
 */
const files = import.meta.glob('./lk/*.{png,jpg,jpeg,webp,svg}', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;

function find(base: string): string | null {
  const key = Object.keys(files).find((k) => new RegExp(`/${base}\\.[a-z]+$`, 'i').test(k));
  return key ? files[key] : null;
}

export const LK_LOGO_SRC = find('lk-logo');
export const LK_TEAM_PHOTO_SRC = find('lukas-leonardo');

/** Retratos individuais (retrato-lukas.*, retrato-leonardo.*), usados enquanto não houver foto conjunta (lukas-leonardo.*). */
export const LK_PORTRAITS = [
  { name: 'Lukas', src: find('retrato-lukas') },
  { name: 'Leonardo', src: find('retrato-leonardo') },
].filter((p): p is { name: string; src: string } => Boolean(p.src));
