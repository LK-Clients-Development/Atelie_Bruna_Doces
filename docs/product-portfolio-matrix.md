# Matriz mestre do portfólio e das imagens

> Gerada por `node tools/build-portfolio-docs.mjs` a partir de `src/data/portfolio.ts` (2026-10-13). **Não editar à mão**: mude os dados e gere de novo. Versão estruturada: [`product-portfolio-matrix.json`](product-portfolio-matrix.json).

## Fontes e limites

| Fonte | Estado | O que entrou |
|---|---|---|
| Yooga (snapshot `src/data/products.ts`, auditado em 2026-10-05) | auditado | 17 categorias, 54 produtos; **46** entram no portfólio (ver exclusões) |
| Instagram `@ateliedocesbruna` | **parcial**: só o público, sem login | 12 publicações mais recentes da grade; 3 casam com itens do Yooga, 2 revelam itens que não estão no Yooga. Detalhe e limites: [`portfolio-raw/instagram-observed.json`](portfolio-raw/instagram-observed.json) |
| Menu de Bolos (Google Drive via Linktree) | **bloqueado** (login Google) | nada: nenhum bolo por encomenda foi inventado (`CAKES_MENU_PENDING`) |
| Arquivos reais no repositório | só provisórios | nenhum arquivo de produto real além das imagens do Yooga; `src/assets/provisional/*` são recortes da Master Reference, **não** são fotos de produto |
| Projeto irmão (`_public-cache`) | **não encontrado** nesta máquina | citado em `docs/content-audit.md`; autorização das fotos lá também é "pendente" |

**Instagram e autorização.** As imagens do Instagram estão **mapeadas** (publicação, data, formato, tamanho da miniatura pública) mas **não baixadas nem exibidas**: a autorização da Bruna continua pendente e as URLs do CDN deles expiram. Elas contam como "reais mapeadas", não como "publicáveis" hoje.

**Qualidade.** Todas as imagens do Yooga têm no máximo 500 px de altura (231–500 px de largura): servem para cards e para o modal, não para destaque grande. Nenhuma imagem foi avaliada como "alta resolução".

## Itens do Yooga que NÃO entram na galeria

Continuam no snapshot comercial; só não são criações para mostrar num portfólio.

- **ATENÇÂO🔴** (Adicionar garfinho no pedido): Serviço do pedido ("Adicionar garfinho"), não é criação.
- **🥰PRESENTEAR PODE & DEVE!** (CARTÃO PRESENTE): Cartão presente: serviço/vale, não é criação para mostrar em galeria.
- **BEBIDAS** (Coca cola 200ml; Água; Água com gás; Coca LATA; Coca Zero 350ml): Bebidas industrializadas revendidas (água e Coca-Cola): não são criações do Ateliê.
- **COMBO DO DIA 😍😋** (COXINHA DE FRANGO+ COCA LATA zero + COXINHA BELGA): Combo do dia: combinação temporária de itens que já aparecem separados (inclui refrigerante).

## Resumo numérico

| Indicador | Valor |
|---|---|
| Produtos no portfólio (Yooga + extras) | **48** |
| …vindos do Yooga (`YOOGA_ACTIVE`) | 46 |
| …extras só do Instagram (`PORTFOLIO_ONLY`) | 2 |
| Publicados na galeria hoje | 46 (extras ficam fora até terem foto publicável) |
| Categorias editoriais | 13 |
| Completos (4+ imagens) | 0 |
| Com 3 imagens | 0 |
| Com 2 imagens | 3 |
| Com 1 imagem | 42 |
| Com 0 imagens | 3 |
| Imagens reais mapeadas | 48 (publicáveis hoje: 44) |
| Imagens faltantes até a meta de 4/produto | 144 |
| Estimativa de imagens a gerar (produtos com referência real) | 132, em 45 produtos (`NEEDS_GENERATION`) |
| Produtos que precisam de foto real antes de gerar | 3 (12 imagens) (`NEEDS_REAL_PHOTO`) |

Status: `COMPLETE` (4+), `PARTIAL_3`, `PARTIAL_2`, `PARTIAL_1`, `MISSING` (0). Plano: `NEEDS_GENERATION` (tem 1+ referência real) ou `NEEDS_REAL_PHOTO` (nenhuma).

## Matriz por produto

| Produto | Categoria editorial | Origem / status | Reais (publ.) | Falta | Imagem | Qualidade | Plano |
|---|---|---|---|---|---|---|---|
| Bolo de cenoura tamanho família | Bolos | Yooga · `YOOGA_ACTIVE` | 1 (1) | 3 | `PARTIAL_1` | BAIXA (até 500 px, CDN Yooga) | `NEEDS_GENERATION` |
| Fatia brownie Ninho com Nutella | Fatias | Yooga · `YOOGA_ACTIVE` | 1 (1) | 3 | `PARTIAL_1` | BAIXA (até 500 px, CDN Yooga) | `NEEDS_GENERATION` |
| Fatia Brownie brigadeiro | Fatias | Yooga · `YOOGA_ACTIVE` | 1 (1) | 3 | `PARTIAL_1` | BAIXA (até 500 px, CDN Yooga) | `NEEDS_GENERATION` |
| Fatia Chocolatuda | Fatias | Yooga · `YOOGA_ACTIVE` | 1 (1) | 3 | `PARTIAL_1` | BAIXA (até 500 px, CDN Yooga) | `NEEDS_GENERATION` |
| Fatia Maracolate | Fatias | Yooga · `YOOGA_ACTIVE` | 1 (1) | 3 | `PARTIAL_1` | BAIXA (até 500 px, CDN Yooga) | `NEEDS_GENERATION` |
| Fatia DUO com morango | Fatias | Yooga · `YOOGA_ACTIVE` | 1 (1) | 3 | `PARTIAL_1` | BAIXA (até 500 px, CDN Yooga) | `NEEDS_GENERATION` |
| Fatia nutelluda | Fatias | Yooga · `YOOGA_ACTIVE` | 1 (1) | 3 | `PARTIAL_1` | BAIXA (até 500 px, CDN Yooga) | `NEEDS_GENERATION` |
| Fatia Limão siciliano c/ frutas vermelhas | Fatias | Yooga · `YOOGA_ACTIVE` | 1 (1) | 3 | `PARTIAL_1` | BAIXA (até 500 px, CDN Yooga) | `NEEDS_GENERATION` |
| Fatia Matilda | Fatias | Yooga · `YOOGA_ACTIVE` | 1 (1) | 3 | `PARTIAL_1` | BAIXA (até 500 px, CDN Yooga) | `NEEDS_GENERATION` |
| Copo Ninho com Morango | Sobremesas no copo | Yooga · `YOOGA_ACTIVE` | 1 (1) | 3 | `PARTIAL_1` | BAIXA (até 500 px, CDN Yooga) | `NEEDS_GENERATION` |
| Copo Ninho com Nutella | Sobremesas no copo | Yooga · `YOOGA_ACTIVE` | 1 (1) | 3 | `PARTIAL_1` | BAIXA (até 500 px, CDN Yooga) | `NEEDS_GENERATION` |
| Supremo maracujá | Sobremesas no copo | Yooga · `YOOGA_ACTIVE` | 1 (1) | 3 | `PARTIAL_1` | BAIXA (até 500 px, CDN Yooga) | `NEEDS_GENERATION` |
| Copo Ferrero | Sobremesas no copo | Yooga · `YOOGA_ACTIVE` | 1 (1) | 3 | `PARTIAL_1` | BAIXA (até 500 px, CDN Yooga) | `NEEDS_GENERATION` |
| Copo DUO com morangos | Sobremesas no copo | Yooga · `YOOGA_ACTIVE` | 1 (1) | 3 | `PARTIAL_1` | BAIXA (até 500 px, CDN Yooga) | `NEEDS_GENERATION` |
| Copo Danette com morango | Sobremesas no copo | Yooga · `YOOGA_ACTIVE` | 2 (1) | 2 | `PARTIAL_2` | MEDIA (640 px) | `NEEDS_GENERATION` |
| Coxinha de Ferrero | Coxinhas doces | Yooga · `YOOGA_ACTIVE` | 1 (1) | 3 | `PARTIAL_1` | BAIXA (até 500 px, CDN Yooga) | `NEEDS_GENERATION` |
| Coxinha de Ninho com Nutella | Coxinhas doces | Yooga · `YOOGA_ACTIVE` | 1 (1) | 3 | `PARTIAL_1` | BAIXA (até 500 px, CDN Yooga) | `NEEDS_GENERATION` |
| Coxinha Belga | Coxinhas doces | Yooga · `YOOGA_ACTIVE` | 1 (1) | 3 | `PARTIAL_1` | BAIXA (até 500 px, CDN Yooga) | `NEEDS_GENERATION` |
| Brigadeirão belga | Doces e bombons | Yooga · `YOOGA_ACTIVE` | 1 (1) | 3 | `PARTIAL_1` | BAIXA (até 500 px, CDN Yooga) | `NEEDS_GENERATION` |
| Alfajor doce de leite | Doces e bombons | Yooga · `YOOGA_ACTIVE` | 1 (1) | 3 | `PARTIAL_1` | BAIXA (até 500 px, CDN Yooga) | `NEEDS_GENERATION` |
| Bombom cravejado | Doces e bombons | Yooga · `YOOGA_ACTIVE` | 1 (1) | 3 | `PARTIAL_1` | BAIXA (até 500 px, CDN Yooga) | `NEEDS_GENERATION` |
| Morango do amor | Doces e bombons | Instagram · `PORTFOLIO_ONLY` · fora da galeria | 1 (0) | 3 | `PARTIAL_1` | MEDIA (640 px) | `NEEDS_GENERATION` |
| Caseirinho Ninho com nutella | Caseirinhos | Yooga · `YOOGA_ACTIVE` | 1 (1) | 3 | `PARTIAL_1` | BAIXA (até 500 px, CDN Yooga) | `NEEDS_GENERATION` |
| Caseirinho ninho nutella e morango | Caseirinhos | Yooga · `YOOGA_ACTIVE` | 1 (1) | 3 | `PARTIAL_1` | BAIXA (até 500 px, CDN Yooga) | `NEEDS_GENERATION` |
| Caseirinho de cenoura com cobertura de chocolate | Caseirinhos | Yooga · `YOOGA_ACTIVE` | 1 (1) | 3 | `PARTIAL_1` | BAIXA (até 500 px, CDN Yooga) | `NEEDS_GENERATION` |
| Caseirinho de brigadeiro | Caseirinhos | Yooga · `YOOGA_ACTIVE` | 1 (1) | 3 | `PARTIAL_1` | BAIXA (até 500 px, CDN Yooga) | `NEEDS_GENERATION` |
| Cheesecake frutas vermelhas | Cheesecakes e tortas | Yooga · `YOOGA_ACTIVE` | 1 (1) | 3 | `PARTIAL_1` | BAIXA (até 500 px, CDN Yooga) | `NEEDS_GENERATION` |
| Cheesecake maracujá | Cheesecakes e tortas | Yooga · `YOOGA_ACTIVE` | 1 (1) | 3 | `PARTIAL_1` | BAIXA (até 500 px, CDN Yooga) | `NEEDS_GENERATION` |
| Torta de limão | Cheesecakes e tortas | Yooga · `YOOGA_ACTIVE` | 1 (1) | 3 | `PARTIAL_1` | BAIXA (até 500 px, CDN Yooga) | `NEEDS_GENERATION` |
| Cookie Nutella | Cookies | Yooga · `YOOGA_ACTIVE` | 1 (1) | 3 | `PARTIAL_1` | BAIXA (até 500 px, CDN Yooga) | `NEEDS_GENERATION` |
| Cookie tradicional | Cookies | Yooga · `YOOGA_ACTIVE` | 0 (0) | 4 | `MISSING` | SEM_IMAGEM | `NEEDS_REAL_PHOTO` |
| Combo Família 10 geladinhos | Geladinhos | Yooga · `YOOGA_ACTIVE` | 1 (1) | 3 | `PARTIAL_1` | BAIXA (até 500 px, CDN Yooga) | `NEEDS_GENERATION` |
| Geladinho Ninho com nutella | Geladinhos | Yooga · `YOOGA_ACTIVE` | 1 (1) | 3 | `PARTIAL_1` | BAIXA (até 500 px, CDN Yooga) | `NEEDS_GENERATION` |
| Geladinho Pudim | Geladinhos | Yooga · `YOOGA_ACTIVE` | 1 (1) | 3 | `PARTIAL_1` | BAIXA (até 500 px, CDN Yooga) | `NEEDS_GENERATION` |
| Geladinho Cappuccino | Geladinhos | Yooga · `YOOGA_ACTIVE` | 1 (1) | 3 | `PARTIAL_1` | BAIXA (até 500 px, CDN Yooga) | `NEEDS_GENERATION` |
| Geladinho Sensação | Geladinhos | Yooga · `YOOGA_ACTIVE` | 0 (0) | 4 | `MISSING` | SEM_IMAGEM | `NEEDS_REAL_PHOTO` |
| Bolo de Pote de Prestígio | Bolos de pote | Yooga · `YOOGA_ACTIVE` | 1 (1) | 3 | `PARTIAL_1` | BAIXA (até 500 px, CDN Yooga) | `NEEDS_GENERATION` |
| Bolo de Pote de Danette | Bolos de pote | Yooga · `YOOGA_ACTIVE` | 1 (1) | 3 | `PARTIAL_1` | BAIXA (até 500 px, CDN Yooga) | `NEEDS_GENERATION` |
| Cone Trufado de Brigadeiro | Cones trufados | Yooga · `YOOGA_ACTIVE` | 1 (1) | 3 | `PARTIAL_1` | BAIXA (até 500 px, CDN Yooga) | `NEEDS_GENERATION` |
| Cone Trufado de Maracujá | Cones trufados | Yooga · `YOOGA_ACTIVE` | 1 (1) | 3 | `PARTIAL_1` | BAIXA (até 500 px, CDN Yooga) | `NEEDS_GENERATION` |
| Empada de frango | Salgados | Yooga · `YOOGA_ACTIVE` | 1 (1) | 3 | `PARTIAL_1` | BAIXA (até 500 px, CDN Yooga) | `NEEDS_GENERATION` |
| Coxinha de Costela c/ cream cheese | Salgados | Yooga · `YOOGA_ACTIVE` | 2 (1) | 2 | `PARTIAL_2` | MEDIA (640 px) | `NEEDS_GENERATION` |
| Coxinha de frango c/ catupiry | Salgados | Yooga · `YOOGA_ACTIVE` | 1 (1) | 3 | `PARTIAL_1` | BAIXA (até 500 px, CDN Yooga) | `NEEDS_GENERATION` |
| Enroladinho de salsicha | Salgados | Yooga · `YOOGA_ACTIVE` | 1 (1) | 3 | `PARTIAL_1` | BAIXA (até 500 px, CDN Yooga) | `NEEDS_GENERATION` |
| Esfiha de carne | Salgados | Yooga · `YOOGA_ACTIVE` | 1 (1) | 3 | `PARTIAL_1` | BAIXA (até 500 px, CDN Yooga) | `NEEDS_GENERATION` |
| Esfiha de Frango com Catupiry | Salgados | Yooga · `YOOGA_ACTIVE` | 1 (1) | 3 | `PARTIAL_1` | BAIXA (até 500 px, CDN Yooga) | `NEEDS_GENERATION` |
| Coxinha de salmão | Salgados | Instagram · `PORTFOLIO_ONLY` · fora da galeria | 0 (0) | 4 | `MISSING` | SEM_IMAGEM | `NEEDS_REAL_PHOTO` |
| Açaí 350 ml | Açaí | Yooga · `YOOGA_ACTIVE` | 2 (1) | 2 | `PARTIAL_2` | MEDIA (640 px) | `NEEDS_GENERATION` |

## Correspondências do Instagram

| Publicação | Produto | Estado |
|---|---|---|
| https://www.instagram.com/ateliedocesbruna/p/Ddeb7QFx7yR/ | Coxinha de Costela c/ cream cheese | `MATCH_CONFIRMED` · Foto de COMBO (coxinha salgada, coxinha doce e refrigerante): não serve de referência do produto isolado. |
| https://www.instagram.com/ateliedocesbruna/p/DeFMvlxxTqZ/ | Copo Danette com morango | `MATCH_CONFIRMED` |
| https://www.instagram.com/ateliedocesbruna/p/DdwhlyGxN6T/ | Açaí 350 ml | `MATCH_CONFIRMED` |
| https://www.instagram.com/ateliedocesbruna/reel/DdmO-cVxzgp/ | Coxinha de salmão (extra) | `MATCH_PROBABLE` · Citada na legenda do reel; não consta no cardápio Yooga auditado. |
| https://www.instagram.com/ateliedocesbruna/p/Ddb5yFqx5AW/ | Morango do amor (extra) | `MATCH_PROBABLE` · Legenda cita só "Morango do amor"; não consta no cardápio Yooga auditado. |

As demais 7 publicações observadas (marca, bastidores, embalagem, imprensa de terceiros, docinhos sem produto nomeado) ficaram `UNIDENTIFIED` e não foram atribuídas a nenhum produto: ver o JSON bruto.
