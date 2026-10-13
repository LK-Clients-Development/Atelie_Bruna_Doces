# QA: nova logo oficial no Header

- **Antes:** `provisional-logo-wordmark-dark.png`, 276×86 (recorte de baixa resolução), usada no Header sólido (Home rolada e `/produtos`) e no menu mobile.
- **Depois:** `src/assets/brand/atelie-doces-bruna-logo.png`, 1944×510, PNG com transparência real (bordas do canvas 100% transparentes, sem halo), recortado rente à tinta com respiro de 2,3%. O Astro gera 200/400/600 px em WebP (qualidade 95) para o Header; mesma largura CSS de antes.
- **Não alterado:** variante clara (Home no topo, sobre o Hero escuro) continua o recorte provisório 276×86; o Footer usa o lockup empilhado (composição diferente); sem favicon novo.
- `capture-header.mjs` gera as capturas do Header (DPR 2) e as métricas (`before-metrics.json`, `after-metrics.json`: logo renderizada, posição, overflow). `compare-header-before-after.webp` mostra antes × depois em 1440, 1024 e 390.
