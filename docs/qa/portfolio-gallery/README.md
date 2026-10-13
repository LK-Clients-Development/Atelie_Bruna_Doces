# QA: portfólio + galeria com modal

`node docs/qa/portfolio-gallery/qa-portfolio.mjs` (com `npm run build && npx astro preview --port 4399`). Resultado: `qa-portfolio.json` (107 verificações) e capturas `gallery-*.webp` / `modal-*.webp` em 1440, 768 e 390.

Capturas da direção de arte (Concept 09 V2): `FULL=1440,1024,768,390 SECTIONS=bolos,fatias,sobremesas-no-copo node docs/qa/portfolio-gallery/capture.mjs` gera `top-<largura>.webp` (primeira dobra, 7 larguras), `sec-<capítulo>-<largura>.webp` e `page-<largura>.webp` (página inteira). `compare-1440.webp` põe o Concept aprovado (`concept-09-v2.webp`) ao lado da implementação.

Larguras testadas para overflow, alvos de toque e modal: 1440, 1280, 1024, 768, 430, 390, 360.

**Nota sobre o teste de várias fotos:** o snapshot ainda não tem produto com 2+ fotos publicáveis. O script injeta, só no navegador de QA, 3 fotos extras (URLs reais de outros produtos do Yooga) no JSON do modal da "Fatia Chocolatuda" via hook em `JSON.parse`. Isso não existe no código do site; as capturas `modal-*.webp` (exceto `*-1foto`) mostram essa simulação, não fotos reais do produto.

O QA anterior (`docs/qa/products-page/`) descreve a versão cardápio e está superado por este.
