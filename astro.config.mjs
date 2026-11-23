// @ts-check
import { defineConfig } from 'astro/config';

// Porta fixa do Vite da apresentação (apresentacao/vite.config.ts, strictPort).
const PRESENTATION_DEV = 'http://localhost:5183';

// https://docs.astro.build/en/reference/configuration-reference/
// SITE_URL (env) é a URL final: liga canonical, og:url, og:image absoluta e o sitemap.
// Vazio enquanto o site não tem endereço definido (ver docs/production-checklist.md).
export default defineConfig({
  site: process.env.SITE_URL || undefined,
  // Barra flutuante do `astro dev` (Inspect, Audit, Settings). Só existe em desenvolvimento; desligada para não aparecer
  // nas capturas e nos testes de celular. O build de produção nunca a inclui.
  devToolbar: { enabled: false },
  vite: {
    server: {
      // Só em desenvolvimento: /apresentacao/* vai para o Vite da apresentação, como em produção
      // (lá o build da apresentação é copiado para dist/apresentacao, ver tools/build-all.mjs).
      // Suba os dois com `npm run dev`.
      proxy: {
        '/apresentacao': {
          target: PRESENTATION_DEV,
          ws: true,
          // /apresentacao (sem barra) também abre, como em produção (rewrite no vercel.json)
          rewrite: (path) => path.replace(/^\/apresentacao(?=$|\?)/, '/apresentacao/'),
          configure: (proxy) => {
            proxy.on('error', (_err, _req, res) => {
              if (res && 'writeHead' in res && !res.headersSent) {
                res.writeHead(502, { 'Content-Type': 'text/plain; charset=utf-8' });
                res.end('Servidor da apresentação não está rodando. Use `npm run dev` (sobe site + apresentação).');
              }
            });
          },
        },
      },
    },
  },
});
