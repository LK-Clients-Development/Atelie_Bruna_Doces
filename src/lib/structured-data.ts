import { BRAND, BUSINESS_HOURS, CONTACT, LINKS, SEO, STRUCTURED_DATA, isPending } from '../data/site';

/**
 * JSON-LD do negócio (schema.org). DESLIGADO por contrato: devolve `null` enquanto
 * `STRUCTURED_DATA.enabled` for false OU qualquer dado exigido ainda for placeholder,
 * então nenhum schema com dado inventado é publicado.
 *
 * Dados exigidos: URL final, telefone, endereço, horário estruturado e rede social.
 * Ao ligar, troque `streetAddress` por um PostalAddress completo (rua, cidade, UF, CEP).
 */
export function buildStructuredData(siteUrl: string | null, ogImage: string | null): Record<string, unknown> | null {
  if (!STRUCTURED_DATA.enabled) return null;

  const missing: string[] = [];
  if (!siteUrl) missing.push('SEO.siteUrl / SITE_URL');
  if (isPending(CONTACT.phone)) missing.push('CONTACT.phone');
  if (isPending(CONTACT.location)) missing.push('CONTACT.location');
  if (isPending(LINKS.instagram)) missing.push('LINKS.instagram');
  if (missing.length) {
    console.warn(`[structured-data] ligado, mas faltam dados reais: ${missing.join(', ')}. Nenhum JSON-LD emitido.`);
    return null;
  }

  return {
    '@context': 'https://schema.org',
    '@type': STRUCTURED_DATA.type,
    name: BRAND.name,
    url: siteUrl,
    telephone: CONTACT.phone,
    // só a cidade é verificada (endereço completo pendente): não inventar rua nem CEP
    address: { '@type': 'PostalAddress', addressLocality: 'Itapeva', addressRegion: 'MG', addressCountry: 'BR' },
    // horário só entra quando a Bruna confirmar (BUSINESS_HOURS em site.ts)
    ...(BUSINESS_HOURS
      ? {
          openingHoursSpecification: BUSINESS_HOURS.map((slot) => ({
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: slot.days,
            opens: slot.opens,
            closes: slot.closes,
          })),
        }
      : {}),
    sameAs: [LINKS.instagram],
    ...(SEO.description ? { description: SEO.description } : {}),
    ...(ogImage ? { image: ogImage } : {}),
  };
}
