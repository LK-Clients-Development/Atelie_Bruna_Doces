# QA: intro de marca (flor)

`node docs/qa/brand-intro/qa-intro.mjs` (com `npm run build && npx astro preview --port 4399`): 18 verificações (nova sessão → Home, Home → Produtos, Produtos → Home, reload, nova sessão → /produtos, reduced-motion, animação travada/failsafe, sem JS, CLS, primeiro frame, tempos reais).

Capturas determinísticas (animações pausadas em instantes fixos): `intro-1440-*` (1440×900) e `intro-390-*` (390×844): A início (0 ms) · B pétalas (470 ms) · C flor completa (990 ms) · D marca (1400 ms) · E Hero revelado. `timeline-1440.webp` = folha de contato com 10 instantes (substitui GIF/vídeo, só para QA; nada disso vai para o site).

Arquitetura e timeline: comentário de `src/components/BrandIntro.astro`. Decisão da sessão, failsafe e CSS crítico: `BrandIntroHead.astro`. Dados vetoriais da flor: `src/data/brand-flower.ts` (gerado por `tools/build-brand-flower.mjs`, que traça a logo oficial com potrace via `npm i --no-save potrace`; não é dependência do site).
