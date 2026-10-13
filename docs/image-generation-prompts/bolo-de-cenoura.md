# Bolo de cenoura tamanho família

> BATCH 01 · Bolos · prioridade editorial `B` · gerado por `tools/build-portfolio-docs.mjs`. Copie cada bloco para o chat de geração **com a foto de referência anexada**.

| | |
|---|---|
| Produto | Bolo de cenoura tamanho família (`bolo-de-cenoura`) |
| Categoria | Bolos |
| Foto-base (fonte de verdade) | https://cdn-production.yooga.com.br/ed6ba0b566fc694bfc585d4a12c7f94e.jpeg (375x500) |
| Origem | imagem pública do cardápio Yooga (`PUBLICABLE`, `REAL`) |
| Imagens publicáveis hoje | 1 |
| Faltam | 3 (DETAIL, ANGLE, CONTEXT) |
| Por que está no lote | Representa a categoria Bolos (único bolo do cardápio atual); forte apelo visual. |
| Qualidade da base | baixa resolução (≤ 500 px de altura): a saída deve ser **coerente com a foto**, não "mais bonita" que ela |

## O que a foto-base MOSTRA (não pode mudar)

Bolo de cenoura em formato de rosca (forma com furo central, laterais com sulcos) sobre prato plástico branco com bordas onduladas, segurado por uma mão; cobertura espessa de brigadeiro de chocolate escorrendo pelas laterais, com confeitos/granulado de chocolate no topo; ambiente do ateliê desfocado ao fundo.

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
Use a foto real anexada como fonte de verdade do produto "Bolo de cenoura tamanho família".
Gere UMA nova foto do MESMO produto: close no brigadeiro escorrendo pelas laterais e na massa alaranjada de cenoura.
O que a foto-base mostra e deve permanecer idêntico: Bolo de cenoura em formato de rosca (forma com furo central, laterais com sulcos) sobre prato plástico branco com bordas onduladas, segurado por uma mão; cobertura espessa de brigadeiro de chocolate escorrendo pelas laterais, com confeitos/granulado de chocolate no topo; ambiente do ateliê desfocado ao fundo.
Não mude o produto, a forma, a cobertura, o recheio visível, os toppings, as proporções nem a embalagem. Não invente nada que não apareça na foto-base. Não escreva texto novo nem altere o rótulo/selo da marca.
Pode mudar somente ângulo, luz, composição, cenário e enquadramento. Formato 4:5 retrato, mínimo 1080×1350 px, fotografia realista de confeitaria com luz natural suave.
```

## Imagem 03-angle: ANGLE — outro ângulo

```text
Use a foto real anexada como fonte de verdade do produto "Bolo de cenoura tamanho família".
Gere UMA nova foto do MESMO produto: o MESMO bolo em 3⁄4 e levemente de cima, mostrando o furo central e a cobertura.
O que a foto-base mostra e deve permanecer idêntico: Bolo de cenoura em formato de rosca (forma com furo central, laterais com sulcos) sobre prato plástico branco com bordas onduladas, segurado por uma mão; cobertura espessa de brigadeiro de chocolate escorrendo pelas laterais, com confeitos/granulado de chocolate no topo; ambiente do ateliê desfocado ao fundo.
Não mude o produto, a forma, a cobertura, o recheio visível, os toppings, as proporções nem a embalagem. Não invente nada que não apareça na foto-base. Não escreva texto novo nem altere o rótulo/selo da marca.
Pode mudar somente ângulo, luz, composição, cenário e enquadramento. Formato 4:5 retrato, mínimo 1080×1350 px, fotografia realista de confeitaria com luz natural suave.
```

## Imagem 04-context: CONTEXT — servido / mão / embalagem / mesa

```text
Use a foto real anexada como fonte de verdade do produto "Bolo de cenoura tamanho família".
Gere UMA nova foto do MESMO produto: o MESMO bolo inteiro sobre uma mesa clara com flores desfocadas ao fundo (cenário do ateliê); se mostrar corte de fatia, a massa deve ser a mesma alaranjada de cenoura vista na foto.
O que a foto-base mostra e deve permanecer idêntico: Bolo de cenoura em formato de rosca (forma com furo central, laterais com sulcos) sobre prato plástico branco com bordas onduladas, segurado por uma mão; cobertura espessa de brigadeiro de chocolate escorrendo pelas laterais, com confeitos/granulado de chocolate no topo; ambiente do ateliê desfocado ao fundo.
Não mude o produto, a forma, a cobertura, o recheio visível, os toppings, as proporções nem a embalagem. Não invente nada que não apareça na foto-base. Não escreva texto novo nem altere o rótulo/selo da marca.
Pode mudar somente ângulo, luz, composição, cenário e enquadramento. Formato 4:5 retrato, mínimo 1080×1350 px, fotografia realista de confeitaria com luz natural suave.
```

## Ao receber as imagens (checklist de aprovação)

- [ ] O produto é reconhecivelmente o da foto-base (forma, cobertura, camadas, toppings, proporções).
- [ ] Nada foi inventado (recheio, decoração, embalagem, texto/logotipo).
- [ ] Sem artefatos (dedos extras, bordas derretidas, texto ilegível, objetos duplicados).
- [ ] Mesma paleta/identidade visual da foto-base.

## Arquivos e proveniência (quando aprovadas)

Salvar como `src/assets/portfolio/bolo-de-cenoura/02-detail.webp`, `03-angle.webp`, `04-context.webp` (e a foto-base como `01-hero` só quando existir cópia local autorizada). Cada uma entra em `portfolio.ts` com `status: 'APPROVED_GENERATED'`, `sourceStatus: 'GENERATED_APPROVED'` (**nunca `REAL`**) e `provenance.generation`:

```ts
{ baseProductId: 'yooga-7986915', referenceImageId: 'yooga-7986915-yooga', generatedAt: 'AAAA-MM-DD', kind: 'DETAIL' | 'ANGLE' | 'CONTEXT', approvedBy: '…', approvedAt: 'AAAA-MM-DD' }
```
