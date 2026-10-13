# Cone Trufado de Brigadeiro

> BATCH 01 · Cones trufados · prioridade editorial `C` · gerado por `tools/build-portfolio-docs.mjs`. Copie cada bloco para o chat de geração **com a foto de referência anexada**.

| | |
|---|---|
| Produto | Cone Trufado de Brigadeiro (`cone-trufado-de-brigadeiro`) |
| Categoria | Cones trufados |
| Foto-base (fonte de verdade) | https://cdn-production.yooga.com.br/c6ab9be564ca018df3270e58253f85ce.jpeg (375x500) |
| Origem | imagem pública do cardápio Yooga (`PUBLICABLE`, `REAL`) |
| Imagens publicáveis hoje | 1 |
| Faltam | 3 (DETAIL, ANGLE, CONTEXT) |
| Por que está no lote | Representa Cones trufados; formato diferente dos demais itens; cenário limpo. |
| Qualidade da base | baixa resolução (≤ 500 px de altura): a saída deve ser **coerente com a foto**, não "mais bonita" que ela |

## O que a foto-base MOSTRA (não pode mudar)

Casquinha de cone (waffle) deitada sobre prato de cerâmica bege liso, com brigadeiro escuro preenchendo a abertura; mesa branca; ao fundo, dois cones embalados em plástico transparente com laço dourado e rótulo redondo da marca, num copo de vidro, e flores desfocadas.

## REGRAS DE FIDELIDADE (valem para as 3 imagens)

- A foto real anexada é a ÚNICA fonte de verdade sobre o produto. Gere VARIAÇÕES FOTOGRÁFICAS DO MESMO PRODUTO, não uma nova receita.
- NÃO mude: o produto, a forma, o tamanho e as proporções, a cobertura, o recheio visível, as camadas, os toppings, a decoração, a embalagem, as cores do produto.
- NÃO invente recheio, camada, ingrediente, sabor, decoração ou embalagem que não apareçam na foto.
- NÃO escreva texto, logotipo ou marca d'água novos. Se o rótulo/estampa/selo da marca aparecer, deve ser IDÊNTICO ao da foto ou ficar fora de quadro.
- PODE mudar apenas: ângulo da câmera, luz, composição, cenário (simples, claro, coerente com um ateliê de confeitaria) e enquadramento.
- Se não for possível mostrar algo sem inventá-lo, escolha outro enquadramento (ex.: não mostre o interior se a foto não o mostra).
- Aspecto 4:5 (retrato), mínimo 1080×1350 px, foto realista de confeitaria, luz natural suave, sem filtros exagerados, sem aparência de ilustração/3D.

## Imagem 02-detail: DETAIL — close de textura / recheio / cobertura

```text
Use a foto real anexada como fonte de verdade do produto "Cone Trufado de Brigadeiro".
Gere UMA nova foto do MESMO produto: close no brigadeiro cremoso e na borda crocante da casquinha.
O que a foto-base mostra e deve permanecer idêntico: Casquinha de cone (waffle) deitada sobre prato de cerâmica bege liso, com brigadeiro escuro preenchendo a abertura; mesa branca; ao fundo, dois cones embalados em plástico transparente com laço dourado e rótulo redondo da marca, num copo de vidro, e flores desfocadas.
Não mude o produto, a forma, a cobertura, o recheio visível, os toppings, as proporções nem a embalagem. Não invente nada que não apareça na foto-base. Não escreva texto novo nem altere o rótulo/selo da marca.
Pode mudar somente ângulo, luz, composição, cenário e enquadramento. Formato 4:5 retrato, mínimo 1080×1350 px, fotografia realista de confeitaria com luz natural suave.
```

## Imagem 03-angle: ANGLE — outro ângulo

```text
Use a foto real anexada como fonte de verdade do produto "Cone Trufado de Brigadeiro".
Gere UMA nova foto do MESMO produto: o MESMO cone de lado, mostrando o comprimento da casquinha e o recheio de brigadeiro.
O que a foto-base mostra e deve permanecer idêntico: Casquinha de cone (waffle) deitada sobre prato de cerâmica bege liso, com brigadeiro escuro preenchendo a abertura; mesa branca; ao fundo, dois cones embalados em plástico transparente com laço dourado e rótulo redondo da marca, num copo de vidro, e flores desfocadas.
Não mude o produto, a forma, a cobertura, o recheio visível, os toppings, as proporções nem a embalagem. Não invente nada que não apareça na foto-base. Não escreva texto novo nem altere o rótulo/selo da marca.
Pode mudar somente ângulo, luz, composição, cenário e enquadramento. Formato 4:5 retrato, mínimo 1080×1350 px, fotografia realista de confeitaria com luz natural suave.
```

## Imagem 04-context: CONTEXT — servido / mão / embalagem / mesa

```text
Use a foto real anexada como fonte de verdade do produto "Cone Trufado de Brigadeiro".
Gere UMA nova foto do MESMO produto: o MESMO cone embalado no plástico transparente com laço, em pé num copo de vidro, flores desfocadas ao fundo; o rótulo redondo deve ser o da foto-base (não invente texto).
O que a foto-base mostra e deve permanecer idêntico: Casquinha de cone (waffle) deitada sobre prato de cerâmica bege liso, com brigadeiro escuro preenchendo a abertura; mesa branca; ao fundo, dois cones embalados em plástico transparente com laço dourado e rótulo redondo da marca, num copo de vidro, e flores desfocadas.
Não mude o produto, a forma, a cobertura, o recheio visível, os toppings, as proporções nem a embalagem. Não invente nada que não apareça na foto-base. Não escreva texto novo nem altere o rótulo/selo da marca.
Pode mudar somente ângulo, luz, composição, cenário e enquadramento. Formato 4:5 retrato, mínimo 1080×1350 px, fotografia realista de confeitaria com luz natural suave.
```

## Ao receber as imagens (checklist de aprovação)

- [ ] O produto é reconhecivelmente o da foto-base (forma, cobertura, camadas, toppings, proporções).
- [ ] Nada foi inventado (recheio, decoração, embalagem, texto/logotipo).
- [ ] Sem artefatos (dedos extras, bordas derretidas, texto ilegível, objetos duplicados).
- [ ] Mesma paleta/identidade visual da foto-base.

## Arquivos e proveniência (quando aprovadas)

Salvar como `src/assets/portfolio/cone-trufado-de-brigadeiro/02-detail.webp`, `03-angle.webp`, `04-context.webp` (e a foto-base como `01-source` só quando existir cópia local autorizada). Cada uma entra em `portfolio.ts` com `status: 'APPROVED_GENERATED'`, `sourceStatus: 'GENERATED_APPROVED'` (**nunca `REAL`**) e `provenance.generation`:

```ts
{ baseProductId: 'yooga-3415255', referenceImageId: 'yooga-3415255-yooga', generatedAt: 'AAAA-MM-DD', kind: 'DETAIL' | 'ANGLE' | 'CONTEXT', approvedBy: '…', approvedAt: 'AAAA-MM-DD' }
```
