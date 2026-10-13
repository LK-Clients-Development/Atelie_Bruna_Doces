# Imagens do portfólio (convenção futura)

Esta pasta ainda **não tem imagens**: nenhuma foi baixada ou gerada. Quando houver, cada produto ganha uma pasta com o `slug` de `src/data/portfolio.ts` e até 4 arquivos, nesta ordem de exibição:

```
src/assets/portfolio/<slug>/
  01-source.webp      foto principal
  02-detail.webp    close de textura / recheio / cobertura
  03-angle.webp     outro ângulo
  04-context.webp   servido, mão, embalagem ou mesa
```

Regras

- Só entra arquivo com origem e autorização registradas em `portfolio.ts`. Foto real do Instagram só depois de autorizada pela Bruna (`sourceStatus: 'PUBLICABLE'`).
- Imagem **gerada** entra como `status: 'APPROVED_GENERATED'`, `sourceStatus: 'GENERATED_APPROVED'` e `provenance.generation` (produto-base, imagem de referência, data, tipo, aprovação). **Nunca `REAL`.**
- Prompts e lotes: `docs/image-generation-queue.md` e `docs/image-generation-prompts/`.
