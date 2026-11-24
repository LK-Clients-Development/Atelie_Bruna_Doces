import type { APIRoute } from 'astro';

/** Sitemap das páginas públicas. Só é útil quando a indexação for ligada (SEO.allowIndexing + public/robots.txt). */
export const GET: APIRoute = ({ site }) => {
  const base = site?.toString().replace(/\/$/, '') ?? '';
  const urls = ['/', '/produtos'].map((path) => `  <url><loc>${base}${path}</loc></url>`).join('\n');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
