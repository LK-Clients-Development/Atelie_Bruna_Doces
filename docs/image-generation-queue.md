# Fila de produção de imagens (em lotes)

> **IMAGE PRODUCTION PAUSED — GALLERY ART DIRECTION GATE.** A produção das imagens restantes está congelada até a direção de arte da galeria (Concept 09 V2) ser fechada. A fila abaixo foi mantida intacta: nada foi apagado nem gerado.

> Gerada por `tools/build-portfolio-docs.mjs` (2026-10-13). **Prioridade EDITORIAL (`EDITORIAL_PRIORITY`), não comercial: não existe dado de venda.** Nada de produzir 126 imagens de uma vez: um lote por vez, aprovado antes do próximo.

## Critérios

1. **A** — produtos usados no Hero de `/produtos` (ajudam a preencher o topo);
2. **B** — categorias de forte apelo visual (fatias, copos, cheesecakes, caseirinhos, coxinhas doces, bolos);
3. **C** — demais.

Cada lote tem 8 produtos (o BATCH 01 foi montado à mão; os seguintes alternam categorias dentro de cada nível, para não juntar produtos parecidos). Só entram produtos com referência real **publicável** (`NEEDS_GENERATION`).

Regras: imagem gerada entra como `APPROVED_GENERATED` (nunca `REAL`) com proveniência (ver `GeneratedProvenance` em `src/data/portfolio.ts`); a foto real anexada é a fonte de verdade; só mudam ângulo, luz, composição, cenário e enquadramento. Arquivos futuros: `src/assets/portfolio/<slug>/01-source · 02-detail · 03-angle · 04-context`.

# BATCH 01

8 produtos · 18 imagens (DETAIL, ANGLE, CONTEXT por produto)

Prompts prontos em [`image-generation-prompts/`](image-generation-prompts/). Motivo de cada escolha:

- `fatia-chocolatuda`: Hero; Fatias é a maior categoria; foto-base nítida, peça inteira bem visível.
- `copo-ninho-com-morango`: Hero; sobremesa no copo é a categoria de produto de assinatura; contraste forte de cores.
- `cheesecake-frutas-vermelhas`: Hero; única categoria de cheesecake; foto-base nítida e com excelente composição.
- `coxinha-belga`: Hero; representa Coxinhas doces; formato inconfundível; foto-base boa.
- `caseirinho-ninho-nutella-e-morango`: Representa Caseirinhos; foto-base mostra bem o topo; contraste vermelho/amarelo/marrom.
- `bolo-de-cenoura`: Representa a categoria Bolos (único bolo do cardápio atual); forte apelo visual.
- `coxinha-de-frango-c-catupiry`: Representa Salgados; a foto-base já mostra o recheio cortado; cenário com a forminha da marca.
- `cone-trufado-de-brigadeiro`: Representa Cones trufados; formato diferente dos demais itens; cenário limpo.

- **Fatia Chocolatuda** (Fatias) — 4 publicável, faltam 0 · `NONE` · prioridade `A` · referência: https://cdn-production.yooga.com.br/fc2ce19f307250909edaed3f2a9e91a7.jpeg (375x500)
- **Copo Ninho com Morango** (Sobremesas no copo) — 1 publicável, faltam 3 · `GENERATE_3` · prioridade `A` · referência: https://cdn-production.yooga.com.br/034f557ecdb934a9ad8bc383a0c331c0.jpeg (242x500) — estreita, referência fraca
- **Cheesecake frutas vermelhas** (Cheesecakes e tortas) — 1 publicável, faltam 3 · `GENERATE_3` · prioridade `A` · referência: https://cdn-production.yooga.com.br/d426aa30b60bd3516dc94a3e636ddd11.jpeg (375x500)
- **Coxinha Belga** (Coxinhas doces) — 1 publicável, faltam 3 · `GENERATE_3` · prioridade `A` · referência: https://cdn-production.yooga.com.br/95b56a584346968f8c80c1d212a64797.jpeg (375x500)
- **Caseirinho ninho nutella e morango** (Caseirinhos) — 1 publicável, faltam 3 · `GENERATE_3` · prioridade `B` · referência: https://cdn-production.yooga.com.br/aec435115a9c8397029ce71069d3cbe0.jpeg (375x500)
- **Bolo de cenoura tamanho família** (Bolos) — 4 publicável, faltam 0 · `NONE` · prioridade `B` · referência: https://cdn-production.yooga.com.br/ed6ba0b566fc694bfc585d4a12c7f94e.jpeg (375x500)
- **Coxinha de frango com catupiry** (Salgados) — 1 publicável, faltam 3 · `GENERATE_3` · prioridade `C` · referência: https://cdn-production.yooga.com.br/b5352c095d6f4f1aa082ff8a47ad0966.jpeg (375x500)
- **Cone Trufado de Brigadeiro** (Cones trufados) — 1 publicável, faltam 3 · `GENERATE_3` · prioridade `C` · referência: https://cdn-production.yooga.com.br/c6ab9be564ca018df3270e58253f85ce.jpeg (375x500)

# BATCH 02

8 produtos · 24 imagens (DETAIL, ANGLE, CONTEXT por produto)
- **Fatia brownie brigadeiro** (Fatias) — 1 publicável, faltam 3 · `GENERATE_3` · prioridade `B` · referência: https://cdn-production.yooga.com.br/9c2f0932b6617fe6b4aba95dabe7ab5d.jpeg (281x500)
- **Copo Danette com morango** (Sobremesas no copo) — 1 publicável, faltam 3 · `GENERATE_3` · prioridade `B` · referência: https://cdn-production.yooga.com.br/5481936d65656e67afe81d9b31ffa454.jpeg (375x500)
- **Coxinha de Ferrero** (Coxinhas doces) — 1 publicável, faltam 3 · `GENERATE_3` · prioridade `B` · referência: https://cdn-production.yooga.com.br/dd4ce04ca3ea7df0b6057ccd9f9f4db8.jpeg (300x500)
- **Caseirinho de brigadeiro** (Caseirinhos) — 1 publicável, faltam 3 · `GENERATE_3` · prioridade `B` · referência: https://cdn-production.yooga.com.br/9fdaacb7877bbc6f05ff30f78ddf2983.jpeg (375x500)
- **Cheesecake maracujá** (Cheesecakes e tortas) — 1 publicável, faltam 3 · `GENERATE_3` · prioridade `B` · referência: https://cdn-production.yooga.com.br/efc2190e71af338f16f3f597c12caf5f.jpeg (375x500)
- **Fatia brownie Ninho com Nutella** (Fatias) — 1 publicável, faltam 3 · `GENERATE_3` · prioridade `B` · referência: https://cdn-production.yooga.com.br/7cfe9730e2dc460884db4d9a70e23d99.jpeg (375x500)
- **Copo DUO com morangos** (Sobremesas no copo) — 1 publicável, faltam 3 · `GENERATE_3` · prioridade `B` · referência: https://cdn-production.yooga.com.br/0c706e49160695f7e4125f8182adf4f1.jpeg (375x500)
- **Coxinha de Ninho com Nutella** (Coxinhas doces) — 1 publicável, faltam 3 · `GENERATE_3` · prioridade `B` · referência: https://cdn-production.yooga.com.br/d604bf159c3a9a9ec9025b5c4bdfe62a.jpeg (375x500)

# BATCH 03

8 produtos · 24 imagens (DETAIL, ANGLE, CONTEXT por produto)
- **Caseirinho de cenoura com cobertura de chocolate** (Caseirinhos) — 1 publicável, faltam 3 · `GENERATE_3` · prioridade `B` · referência: https://cdn-production.yooga.com.br/00ffa4eed400a7631278a9b64df42d09.jpeg (375x500)
- **Torta de limão** (Cheesecakes e tortas) — 1 publicável, faltam 3 · `GENERATE_3` · prioridade `B` · referência: https://cdn-production.yooga.com.br/6743d634f57efb54fd2ee58b47d588c8.jpeg (375x500)
- **Fatia duo com morango** (Fatias) — 1 publicável, faltam 3 · `GENERATE_3` · prioridade `B` · referência: https://cdn-production.yooga.com.br/efa2efedb4347578afd4b8b980d242b1.jpeg (375x500)
- **Copo Ferrero** (Sobremesas no copo) — 1 publicável, faltam 3 · `GENERATE_3` · prioridade `B` · referência: https://cdn-production.yooga.com.br/22b5009017e15397caeda563495c60eb.jpeg (375x500)
- **Caseirinho Ninho com nutella** (Caseirinhos) — 1 publicável, faltam 3 · `GENERATE_3` · prioridade `B` · referência: https://cdn-production.yooga.com.br/778df72cf7b3c8a7e48813d36267eac4.jpeg (375x500)
- **Fatia limão siciliano com frutas vermelhas** (Fatias) — 1 publicável, faltam 3 · `GENERATE_3` · prioridade `B` · referência: https://cdn-production.yooga.com.br/835fa13b2e2b75c672407f808749543d.jpeg (375x500)
- **Copo Ninho com Nutella** (Sobremesas no copo) — 1 publicável, faltam 3 · `GENERATE_3` · prioridade `B` · referência: https://cdn-production.yooga.com.br/35c7d3ce5d2ed825b59fb3030e269976.jpeg (299x500)
- **Fatia Maracolate** (Fatias) — 1 publicável, faltam 3 · `GENERATE_3` · prioridade `B` · referência: https://cdn-production.yooga.com.br/aaff3ea46fda622db5b45fced62cd29a.jpeg (375x500)

# BATCH 04

8 produtos · 24 imagens (DETAIL, ANGLE, CONTEXT por produto)
- **Supremo maracujá** (Sobremesas no copo) — 1 publicável, faltam 3 · `GENERATE_3` · prioridade `B` · referência: https://cdn-production.yooga.com.br/3e148b04514aa477b5d84d0eff8a74bb.jpeg (375x500)
- **Fatia Matilda** (Fatias) — 1 publicável, faltam 3 · `GENERATE_3` · prioridade `B` · referência: https://cdn-production.yooga.com.br/4b004c94601bd7d9a4d5fb53a3e92d4b.jpeg (375x500)
- **Fatia nutelluda** (Fatias) — 1 publicável, faltam 3 · `GENERATE_3` · prioridade `B` · referência: https://cdn-production.yooga.com.br/a3e285b1c01d4a85e6ab66f6874f63ee.jpeg (375x500)
- **Alfajor doce de leite** (Doces e bombons) — 1 publicável, faltam 3 · `GENERATE_3` · prioridade `C` · referência: https://cdn-production.yooga.com.br/ccb4a79a5bd4623c2efbd6b1a8e731d4.jpeg (375x500)
- **Cookie Nutella** (Cookies) — 1 publicável, faltam 3 · `GENERATE_3` · prioridade `C` · referência: https://cdn-production.yooga.com.br/9a2d9239ef7f68bcdbcb413baebd85cb.jpeg (375x500)
- **Combo Família 10 geladinhos** (Geladinhos) — 1 publicável, faltam 3 · `GENERATE_3` · prioridade `C` · referência: https://cdn-production.yooga.com.br/01a4afef39dc3ef7c64dde16bf092a57.jpeg (296x500)
- **Bolo de Pote de Danette** (Bolos de pote) — 1 publicável, faltam 3 · `GENERATE_3` · prioridade `C` · referência: https://cdn-production.yooga.com.br/fe9871fb7bb9456f472c6dd4750be3fd.jpeg (281x500)
- **Cone Trufado de Maracujá** (Cones trufados) — 1 publicável, faltam 3 · `GENERATE_3` · prioridade `C` · referência: https://cdn-production.yooga.com.br/abfc4ee77774ac08206d61c2cf643eee.jpeg (375x500)

# BATCH 05

8 produtos · 24 imagens (DETAIL, ANGLE, CONTEXT por produto)
- **Coxinha de costela com cream cheese** (Salgados) — 1 publicável, faltam 3 · `GENERATE_3` · prioridade `C` · referência: https://cdn-production.yooga.com.br/e050c256b22dc660a252fcc2c347a259.jpeg (375x500)
- **Açaí 350 ml** (Açaí) — 1 publicável, faltam 3 · `GENERATE_3` · prioridade `C` · referência: https://cdn-production.yooga.com.br/76666f636dadd1f611093d19e28f2c6c.jpeg (375x500)
- **Bombom cravejado** (Doces e bombons) — 1 publicável, faltam 3 · `GENERATE_3` · prioridade `C` · referência: https://cdn-production.yooga.com.br/9e3e0647bdef50168374426bb6519e60.jpeg (375x500)
- **Geladinho Cappuccino** (Geladinhos) — 1 publicável, faltam 3 · `GENERATE_3` · prioridade `C` · referência: https://cdn-production.yooga.com.br/7c878ad4bbc8046c678f2cafaef609e5.jpeg (375x500)
- **Bolo de Pote de Prestígio** (Bolos de pote) — 1 publicável, faltam 3 · `GENERATE_3` · prioridade `C` · referência: https://cdn-production.yooga.com.br/95e66412d883d17112f83f17fbff0c0e.jpeg (231x500) — estreita, referência fraca
- **Empada de frango** (Salgados) — 1 publicável, faltam 3 · `GENERATE_3` · prioridade `C` · referência: https://cdn-production.yooga.com.br/d8cca77bd8665514da0eee6f8636e77e.jpeg (375x500)
- **Brigadeirão belga** (Doces e bombons) — 1 publicável, faltam 3 · `GENERATE_3` · prioridade `C` · referência: https://cdn-production.yooga.com.br/31a40ce902e5437088212b63cacd0813.jpeg (375x500)
- **Geladinho Ninho com nutella** (Geladinhos) — 1 publicável, faltam 3 · `GENERATE_3` · prioridade `C` · referência: https://cdn-production.yooga.com.br/663664731d269890b94fb0a6df8cf2fe.jpeg (375x500)

# BATCH 06

4 produtos · 12 imagens (DETAIL, ANGLE, CONTEXT por produto)
- **Enroladinho de salsicha** (Salgados) — 1 publicável, faltam 3 · `GENERATE_3` · prioridade `C` · referência: https://cdn-production.yooga.com.br/046e14fb4254c7799730336d0115b2d7.jpeg (281x500)
- **Geladinho Pudim** (Geladinhos) — 1 publicável, faltam 3 · `GENERATE_3` · prioridade `C` · referência: https://cdn-production.yooga.com.br/a9b69bb5272d19762cb79847030c4058.jpeg (375x500)
- **Esfiha de carne** (Salgados) — 1 publicável, faltam 3 · `GENERATE_3` · prioridade `C` · referência: https://cdn-production.yooga.com.br/716ee9e66ed58e075c56b21f575a2dca.jpeg (375x500)
- **Esfiha de frango com catupiry** (Salgados) — 1 publicável, faltam 3 · `GENERATE_3` · prioridade `C` · referência: https://cdn-production.yooga.com.br/768320cad0d2ffac42b74fd45cf252b4.jpeg (375x500)

# Fora dos lotes

- **Retidos até autorização** (`HOLD_UNTIL_AUTHORIZED`): Morango do amor. A única foto real é do Instagram, sem autorização: não usar como base de geração.
- **Pedir foto real** (`REQUEST_REAL_REFERENCE`): Cookie tradicional; Geladinho Sensação; Coxinha de salmão. Ver [product-photo-request.md](product-photo-request.md).

# Resumo

- BATCH 01: 8 produtos, 18 imagens
- BATCH 02: 8 produtos, 24 imagens
- BATCH 03: 8 produtos, 24 imagens
- BATCH 04: 8 produtos, 24 imagens
- BATCH 05: 8 produtos, 24 imagens
- BATCH 06: 4 produtos, 12 imagens
- Total a gerar: 126 imagens em 42 produtos
