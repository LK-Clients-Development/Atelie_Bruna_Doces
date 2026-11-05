import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Aplicação independente da apresentação comercial: build e dev isolados do site institucional
// (astro.config.mjs na raiz do repositório). Root directory na Vercel: "apresentacao".
// base: serve publicamente em /apresentacao/ (ver vercel.json na raiz), não em /.
export default defineConfig({
  base: '/apresentacao/',
  plugins: [react()],
  server: {
    port: 5183,
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
});
