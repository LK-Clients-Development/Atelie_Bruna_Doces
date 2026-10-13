# Normalização da logo entre Header escuro e claro

**Causa:** o estado sólido (claro) encolhia a logo de propósito (`width: clamp(150px, 14vw, 200px)` contra `19,2vw` do estado escuro) e a logo oficial é mais larga que o recorte provisório do Hero (proporção real 4,38:1 contra 3,94:1, que era achatado). Padding transparente do asset NÃO era o problema (2,2% do lado, igual ao do recorte antigo).

**Correção (só CSS do Header + `sizes`):** largura do estado claro = largura do estado escuro × 1,113, o que iguala a ALTURA das letras (a logo oficial fica ~11% mais larga). O estado escuro não foi tocado.

Altura visível da tinta (px) escuro / claro antes → depois: 1440 67 / 43,6 → 67 · 1280 59,6 / 39,1 → 59,7 · 1024 47,7 / 32,7 → 47,8 · 768 36,4 / 32,7 → 36,4 · 390 32,2 / 28,9 → 32,2 · 360 29,7 / 26,7 → 29,7. Métricas completas: `norm-before-metrics.json` e `norm-after-metrics.json`; comparação: `compare-dark-vs-light.webp`.
