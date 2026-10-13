# Matriz mestre do portfólio e das imagens

> Gerada por `node tools/build-portfolio-docs.mjs` a partir de `src/data/portfolio.ts` (2026-10-13). **Não editar à mão.** Versão estruturada: [`product-portfolio-matrix.json`](product-portfolio-matrix.json).

## Imagem MAPEADA ≠ imagem PUBLICÁVEL

Cada imagem tem um `sourceStatus`:

| sourceStatus | Significa | Pode aparecer no site? |
|---|---|---|
| `PUBLICABLE` | imagem pública do cardápio Yooga (ou, no futuro, gerada e aprovada) | **sim** |
| `AUTHORIZATION_PENDING` | foto real do Instagram encontrada **sem autorização** da Bruna | não: só referência interna |
| `REFERENCE_ONLY` | indício/referência (ex.: capa de reel), nunca foto do produto | não |
| `GENERATED_APPROVED` | imagem gerada **e aprovada** (continua `APPROVED_GENERATED`, nunca `REAL`) | sim (nenhuma ainda) |
| `MISSING` | espaço sem imagem | n/a |

| Indicador | Valor |
|---|---|
| **MAPPED_IMAGE_COUNT** (reais + referências encontradas) | **52** |
| **PUBLICABLE_IMAGE_COUNT** (podem aparecer no site hoje) | **47** (inclui 3 gerada(s) e aprovada(s), `APPROVED_GENERATED`) |
| Diferença (mapeadas e não publicáveis) | 5: 4 `AUTHORIZATION_PENDING` + 1 `REFERENCE_ONLY` |

Toda cobertura e toda lacuna abaixo usam **PUBLICABLE_IMAGE_COUNT**. Se a Bruna autorizar as fotos do Instagram, a lacuna cai (coluna "Falta se autorizadas" do JSON), mas isso não altera o plano de hoje.

## Fontes e limites

| Fonte | Estado | O que entrou |
|---|---|---|
| Yooga (snapshot `src/data/products.ts`, auditado em 2026-10-05) | auditado | 17 categorias, 54 produtos; **46** entram no portfólio |
| Instagram `@ateliedocesbruna` | **parcial**: só o público, sem login | 12 publicações da grade; 3 casam com itens do Yooga, 2 itens extras. Detalhe e limites: [`portfolio-raw/instagram-observed.json`](portfolio-raw/instagram-observed.json) |
| Menu de Bolos (Google Drive via Linktree) | **bloqueado** (login Google) | nada: nenhum bolo por encomenda foi inventado |
| Arquivos reais no repositório | só provisórios | nenhum arquivo de produto real além das imagens do Yooga |

Todas as imagens do Yooga têm no máximo 500 px de altura (231–500 px de largura): servem para cards e modal, não para destaque grande.

## Itens do Yooga fora da galeria

- **ATENÇÂO🔴** (Adicionar garfinho no pedido): Serviço do pedido ("Adicionar garfinho"), não é criação.
- **🥰PRESENTEAR PODE & DEVE!** (CARTÃO PRESENTE): Cartão presente: serviço/vale, não é criação para mostrar em galeria.
- **BEBIDAS** (Coca cola 200ml; Água; Água com gás; Coca LATA; Coca Zero 350ml): Bebidas industrializadas revendidas (água e Coca-Cola): não são criações do Ateliê.
- **COMBO DO DIA 😍😋** (COXINHA DE FRANGO+ COCA LATA zero + COXINHA BELGA): Combo do dia: combinação temporária de itens que já aparecem separados (inclui refrigerante).

## Resumo numérico (cobertura PUBLICÁVEL)

| Indicador | Valor |
|---|---|
| Produtos no portfólio | **48** (46 Yooga + 2 extras do Instagram; 46 publicados na galeria) |
| Categorias editoriais | 13 |
| Completos (4+ publicáveis) | 1 |
| Com 3 / 2 / 1 / 0 publicáveis | 0 / 0 / 43 / 4 |
| Sem imagem publicável | Cookie tradicional; Geladinho Sensação; Coxinha de salmão; Morango do amor |
| Imagens faltantes até a meta de 4/produto | 145 |
| A gerar (produtos com referência real publicável) | 129, em 43 produtos (`NEEDS_GENERATION`) |
| Retidos até autorização | Morango do amor (`BLOCKED_AUTHORIZATION`) |
| Precisam de foto real | Cookie tradicional; Geladinho Sensação; Coxinha de salmão (`NEEDS_REAL_PHOTO`) |

Estrutura-alvo de cada galeria (4): `01-source` foto principal · `02-detail` close de textura/recheio/cobertura · `03-angle` outro ângulo · `04-context` servido/mão/embalagem/mesa.

## Matriz por produto

| Produto | Categoria editorial | Origem / status | Mapeadas | Publicáveis | Falta | Slots (S·D·A·C) | Cobertura | Plano | Lote | Copy |
|---|---|---|---|---|---|---|---|---|---|---|
| Bolo de cenoura tamanho família | Bolos | Yooga · `YOOGA_ACTIVE` | 1 | 1 | 3 | ✓·–·–·– | `PARTIAL_1` | `GENERATE_3` | BATCH 01 | `DRAFT` |
| Fatia brownie Ninho com Nutella | Fatias | Yooga · `YOOGA_ACTIVE` | 1 | 1 | 3 | ✓·–·–·– | `PARTIAL_1` | `GENERATE_3` | BATCH 02 | `DRAFT` |
| Fatia brownie brigadeiro | Fatias | Yooga · `YOOGA_ACTIVE` | 1 | 1 | 3 | ✓·–·–·– | `PARTIAL_1` | `GENERATE_3` | BATCH 02 | `DRAFT` |
| Fatia Chocolatuda | Fatias | Yooga · `YOOGA_ACTIVE` | 4 | 4 | 0 | ✓·✓·✓·✓ | `COMPLETE` | `NONE` | BATCH 01 | `DRAFT` |
| Fatia Maracolate | Fatias | Yooga · `YOOGA_ACTIVE` | 1 | 1 | 3 | ✓·–·–·– | `PARTIAL_1` | `GENERATE_3` | BATCH 03 | `DRAFT` |
| Fatia duo com morango | Fatias | Yooga · `YOOGA_ACTIVE` | 1 | 1 | 3 | ✓·–·–·– | `PARTIAL_1` | `GENERATE_3` | BATCH 03 | `NEEDS_BRUNA_APPROVAL` |
| Fatia nutelluda | Fatias | Yooga · `YOOGA_ACTIVE` | 1 | 1 | 3 | ✓·–·–·– | `PARTIAL_1` | `GENERATE_3` | BATCH 04 | `DRAFT` |
| Fatia limão siciliano com frutas vermelhas | Fatias | Yooga · `YOOGA_ACTIVE` | 1 | 1 | 3 | ✓·–·–·– | `PARTIAL_1` | `GENERATE_3` | BATCH 03 | `DRAFT` |
| Fatia Matilda | Fatias | Yooga · `YOOGA_ACTIVE` | 1 | 1 | 3 | ✓·–·–·– | `PARTIAL_1` | `GENERATE_3` | BATCH 04 | `DRAFT` |
| Copo Ninho com Morango | Sobremesas no copo | Yooga · `YOOGA_ACTIVE` | 1 | 1 | 3 | ✓·–·–·– | `PARTIAL_1` | `GENERATE_3` | BATCH 01 | `NEEDS_BRUNA_APPROVAL` |
| Copo Ninho com Nutella | Sobremesas no copo | Yooga · `YOOGA_ACTIVE` | 1 | 1 | 3 | ✓·–·–·– | `PARTIAL_1` | `GENERATE_3` | BATCH 03 | `DRAFT` |
| Supremo maracujá | Sobremesas no copo | Yooga · `YOOGA_ACTIVE` | 1 | 1 | 3 | ✓·–·–·– | `PARTIAL_1` | `GENERATE_3` | BATCH 04 | `DRAFT` |
| Copo Ferrero | Sobremesas no copo | Yooga · `YOOGA_ACTIVE` | 1 | 1 | 3 | ✓·–·–·– | `PARTIAL_1` | `GENERATE_3` | BATCH 03 | `NEEDS_BRUNA_APPROVAL` |
| Copo DUO com morangos | Sobremesas no copo | Yooga · `YOOGA_ACTIVE` | 1 | 1 | 3 | ✓·–·–·– | `PARTIAL_1` | `GENERATE_3` | BATCH 02 | `NEEDS_BRUNA_APPROVAL` |
| Copo Danette com morango | Sobremesas no copo | Yooga · `YOOGA_ACTIVE` | 2 | 1 | 3 | ✓·–·–·– | `PARTIAL_1` | `GENERATE_3` | BATCH 02 | `NEEDS_BRUNA_APPROVAL` |
| Coxinha de Ferrero | Coxinhas doces | Yooga · `YOOGA_ACTIVE` | 1 | 1 | 3 | ✓·–·–·– | `PARTIAL_1` | `GENERATE_3` | BATCH 02 | `DRAFT` |
| Coxinha de Ninho com Nutella | Coxinhas doces | Yooga · `YOOGA_ACTIVE` | 1 | 1 | 3 | ✓·–·–·– | `PARTIAL_1` | `GENERATE_3` | BATCH 02 | `DRAFT` |
| Coxinha Belga | Coxinhas doces | Yooga · `YOOGA_ACTIVE` | 1 | 1 | 3 | ✓·–·–·– | `PARTIAL_1` | `GENERATE_3` | BATCH 01 | `DRAFT` |
| Brigadeirão belga | Doces e bombons | Yooga · `YOOGA_ACTIVE` | 1 | 1 | 3 | ✓·–·–·– | `PARTIAL_1` | `GENERATE_3` | BATCH 05 | `DRAFT` |
| Alfajor doce de leite | Doces e bombons | Yooga · `YOOGA_ACTIVE` | 1 | 1 | 3 | ✓·–·–·– | `PARTIAL_1` | `GENERATE_3` | BATCH 04 | `DRAFT` |
| Bombom cravejado | Doces e bombons | Yooga · `YOOGA_ACTIVE` | 1 | 1 | 3 | ✓·–·–·– | `PARTIAL_1` | `GENERATE_3` | BATCH 05 | `DRAFT` |
| Morango do amor | Doces e bombons | Instagram · `PORTFOLIO_ONLY` · fora da galeria | 1 | 0 | 4 | –·–·–·– | `MISSING` | `HOLD_UNTIL_AUTHORIZED` | — | `SOURCE_RAW` |
| Caseirinho Ninho com nutella | Caseirinhos | Yooga · `YOOGA_ACTIVE` | 1 | 1 | 3 | ✓·–·–·– | `PARTIAL_1` | `GENERATE_3` | BATCH 03 | `DRAFT` |
| Caseirinho ninho nutella e morango | Caseirinhos | Yooga · `YOOGA_ACTIVE` | 1 | 1 | 3 | ✓·–·–·– | `PARTIAL_1` | `GENERATE_3` | BATCH 01 | `DRAFT` |
| Caseirinho de cenoura com cobertura de chocolate | Caseirinhos | Yooga · `YOOGA_ACTIVE` | 1 | 1 | 3 | ✓·–·–·– | `PARTIAL_1` | `GENERATE_3` | BATCH 03 | `DRAFT` |
| Caseirinho de brigadeiro | Caseirinhos | Yooga · `YOOGA_ACTIVE` | 1 | 1 | 3 | ✓·–·–·– | `PARTIAL_1` | `GENERATE_3` | BATCH 02 | `DRAFT` |
| Cheesecake frutas vermelhas | Cheesecakes e tortas | Yooga · `YOOGA_ACTIVE` | 1 | 1 | 3 | ✓·–·–·– | `PARTIAL_1` | `GENERATE_3` | BATCH 01 | `DRAFT` |
| Cheesecake maracujá | Cheesecakes e tortas | Yooga · `YOOGA_ACTIVE` | 1 | 1 | 3 | ✓·–·–·– | `PARTIAL_1` | `GENERATE_3` | BATCH 02 | `DRAFT` |
| Torta de limão | Cheesecakes e tortas | Yooga · `YOOGA_ACTIVE` | 1 | 1 | 3 | ✓·–·–·– | `PARTIAL_1` | `GENERATE_3` | BATCH 03 | `DRAFT` |
| Cookie Nutella | Cookies | Yooga · `YOOGA_ACTIVE` | 1 | 1 | 3 | ✓·–·–·– | `PARTIAL_1` | `GENERATE_3` | BATCH 04 | `DRAFT` |
| Cookie tradicional | Cookies | Yooga · `YOOGA_ACTIVE` | 0 | 0 | 4 | –·–·–·– | `MISSING` | `REQUEST_REAL_REFERENCE` | — | `DRAFT` |
| Combo Família 10 geladinhos | Geladinhos | Yooga · `YOOGA_ACTIVE` | 1 | 1 | 3 | ✓·–·–·– | `PARTIAL_1` | `GENERATE_3` | BATCH 04 | `DRAFT` |
| Geladinho Ninho com nutella | Geladinhos | Yooga · `YOOGA_ACTIVE` | 1 | 1 | 3 | ✓·–·–·– | `PARTIAL_1` | `GENERATE_3` | BATCH 05 | `NEEDS_BRUNA_APPROVAL` |
| Geladinho Pudim | Geladinhos | Yooga · `YOOGA_ACTIVE` | 1 | 1 | 3 | ✓·–·–·– | `PARTIAL_1` | `GENERATE_3` | BATCH 06 | `NEEDS_BRUNA_APPROVAL` |
| Geladinho Cappuccino | Geladinhos | Yooga · `YOOGA_ACTIVE` | 1 | 1 | 3 | ✓·–·–·– | `PARTIAL_1` | `GENERATE_3` | BATCH 05 | `NEEDS_BRUNA_APPROVAL` |
| Geladinho Sensação | Geladinhos | Yooga · `YOOGA_ACTIVE` | 0 | 0 | 4 | –·–·–·– | `MISSING` | `REQUEST_REAL_REFERENCE` | — | `NEEDS_BRUNA_APPROVAL` |
| Bolo de Pote de Prestígio | Bolos de pote | Yooga · `YOOGA_ACTIVE` | 1 | 1 | 3 | ✓·–·–·– | `PARTIAL_1` | `GENERATE_3` | BATCH 05 | `DRAFT` |
| Bolo de Pote de Danette | Bolos de pote | Yooga · `YOOGA_ACTIVE` | 1 | 1 | 3 | ✓·–·–·– | `PARTIAL_1` | `GENERATE_3` | BATCH 04 | `DRAFT` |
| Cone Trufado de Brigadeiro | Cones trufados | Yooga · `YOOGA_ACTIVE` | 1 | 1 | 3 | ✓·–·–·– | `PARTIAL_1` | `GENERATE_3` | BATCH 01 | `DRAFT` |
| Cone Trufado de Maracujá | Cones trufados | Yooga · `YOOGA_ACTIVE` | 1 | 1 | 3 | ✓·–·–·– | `PARTIAL_1` | `GENERATE_3` | BATCH 04 | `NEEDS_BRUNA_APPROVAL` |
| Empada de frango | Salgados | Yooga · `YOOGA_ACTIVE` | 1 | 1 | 3 | ✓·–·–·– | `PARTIAL_1` | `GENERATE_3` | BATCH 05 | `DRAFT` |
| Coxinha de costela com cream cheese | Salgados | Yooga · `YOOGA_ACTIVE` | 2 | 1 | 3 | ✓·–·–·– | `PARTIAL_1` | `GENERATE_3` | BATCH 05 | `DRAFT` |
| Coxinha de frango com catupiry | Salgados | Yooga · `YOOGA_ACTIVE` | 1 | 1 | 3 | ✓·–·–·– | `PARTIAL_1` | `GENERATE_3` | BATCH 01 | `DRAFT` |
| Enroladinho de salsicha | Salgados | Yooga · `YOOGA_ACTIVE` | 1 | 1 | 3 | ✓·–·–·– | `PARTIAL_1` | `GENERATE_3` | BATCH 06 | `DRAFT` |
| Esfiha de carne | Salgados | Yooga · `YOOGA_ACTIVE` | 1 | 1 | 3 | ✓·–·–·– | `PARTIAL_1` | `GENERATE_3` | BATCH 06 | `DRAFT` |
| Esfiha de frango com catupiry | Salgados | Yooga · `YOOGA_ACTIVE` | 1 | 1 | 3 | ✓·–·–·– | `PARTIAL_1` | `GENERATE_3` | BATCH 06 | `DRAFT` |
| Coxinha de salmão | Salgados | Instagram · `PORTFOLIO_ONLY` · fora da galeria | 1 | 0 | 4 | –·–·–·– | `MISSING` | `REQUEST_REAL_REFERENCE` | — | `SOURCE_RAW` |
| Açaí 350 ml | Açaí | Yooga · `YOOGA_ACTIVE` | 2 | 1 | 3 | ✓·–·–·– | `PARTIAL_1` | `GENERATE_3` | BATCH 05 | `DRAFT` |

## Correspondências do Instagram

| Publicação | Produto | sourceStatus | Correspondência |
|---|---|---|---|
| https://www.instagram.com/ateliedocesbruna/p/Ddeb7QFx7yR/ | Coxinha de costela com cream cheese | `AUTHORIZATION_PENDING` | `MATCH_CONFIRMED` · Foto de COMBO (coxinha salgada, coxinha doce e refrigerante): não serve de referência do produto isolado. |
| https://www.instagram.com/ateliedocesbruna/p/DeFMvlxxTqZ/ | Copo Danette com morango | `AUTHORIZATION_PENDING` | `MATCH_CONFIRMED` |
| https://www.instagram.com/ateliedocesbruna/p/DdwhlyGxN6T/ | Açaí 350 ml | `AUTHORIZATION_PENDING` | `MATCH_CONFIRMED` |
| https://www.instagram.com/ateliedocesbruna/reel/DdmO-cVxzgp/ | Coxinha de salmão (extra) | `REFERENCE_ONLY` | `MATCH_PROBABLE` · Citada na legenda do reel; não consta no cardápio Yooga auditado. |
| https://www.instagram.com/ateliedocesbruna/p/Ddb5yFqx5AW/ | Morango do amor (extra) | `AUTHORIZATION_PENDING` | `MATCH_PROBABLE` · Legenda cita só "Morango do amor"; não consta no cardápio Yooga auditado. |

As demais publicações observadas (marca, bastidores, embalagem, imprensa de terceiros, docinhos sem produto nomeado) ficaram `UNIDENTIFIED`: ver o JSON bruto.
