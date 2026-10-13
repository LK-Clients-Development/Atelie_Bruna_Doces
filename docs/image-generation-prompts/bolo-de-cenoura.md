# Bolo de cenoura tamanho família

> BATCH 01 · Bolos · prioridade editorial `B` · gerado por `tools/build-portfolio-docs.mjs`. Copie cada bloco para o chat de geração **com a foto de referência anexada**.

| | |
|---|---|
| Produto | Bolo de cenoura tamanho família (`bolo-de-cenoura`) |
| Categoria | Bolos |
| Foto-base (fonte de verdade) | https://cdn-production.yooga.com.br/ed6ba0b566fc694bfc585d4a12c7f94e.jpeg (375x500) |
| Origem | imagem pública do cardápio Yooga (`PUBLICABLE`, `REAL`) |
| Imagens publicáveis hoje | 4 |
| Faltam | 0 () |
| Já aprovadas (não gerar de novo) | 02-detail, 03-angle, 04-context |
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


## Ao receber as imagens (checklist de aprovação)

- [ ] O produto é reconhecivelmente o da foto-base (forma, cobertura, camadas, toppings, proporções).
- [ ] Nada foi inventado (recheio, decoração, embalagem, texto/logotipo).
- [ ] Sem artefatos (dedos extras, bordas derretidas, texto ilegível, objetos duplicados).
- [ ] Mesma paleta/identidade visual da foto-base.

## Arquivos e proveniência (quando aprovadas)

Salvar como `src/assets/portfolio/bolo-de-cenoura/02-detail.webp`, `03-angle.webp`, `04-context.webp` (e a foto-base como `01-source` só quando existir cópia local autorizada). Cada uma entra em `portfolio.ts` com `status: 'APPROVED_GENERATED'`, `sourceStatus: 'GENERATED_APPROVED'` (**nunca `REAL`**) e `provenance.generation`:

```ts
{ baseProductId: 'yooga-7986915', referenceImageId: 'yooga-7986915-yooga', generatedAt: 'AAAA-MM-DD', kind: 'DETAIL' | 'ANGLE' | 'CONTEXT', approvedBy: '…', approvedAt: 'AAAA-MM-DD' }
```
