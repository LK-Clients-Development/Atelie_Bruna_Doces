# Portfólio + galeria com modal (`/produtos`)

> **Decisão de produto (2026-10-13):** `/produtos` deixa de ser um cardápio de compra e passa a ser a **vitrine de portfólio** da Bruna. Substitui, na experiência, o plano de `docs/products-page-plan.md` (cards com preço); os dados e a auditoria daquele plano continuam valendo.

## Fluxo

```
GALERIA → abrir criação → MODAL com fotos → "Quero este produto" → WhatsApp
                                          → "Ver cardápio no Yooga" → cardápio geral
```

Sem carrinho, sem checkout, sem venda no site. O visitante pensa primeiro "quero ver tudo o que ela faz" e só depois "quero esse".

## Duas camadas de dados

| Camada | Arquivo | Papel |
|---|---|---|
| Comercial | `src/data/products.ts` (snapshot do Yooga) | nome, descrição, **preço, promoção, opções**. Continua intacta e é a fonte de verdade comercial |
| Editorial | `src/data/portfolio.ts` | o que entra na galeria, categoria editorial, galeria de imagens com proveniência, forma de compra |

**O preço não é elemento do portfólio.** Existe só no snapshot; nenhum componente da galeria o lê e o HTML da página não contém "R$".

### `portfolio.ts`

- `PortfolioProduct`: `id`, `slug`, `name`, `category` (editorial), `sourceProductId`/`sourceCategoryId` (voltam ao Yooga), `status` (`YOOGA_ACTIVE` · `PORTFOLIO_ONLY` · `CAKES_MENU_PENDING` · `LEGACY_OR_UNCONFIRMED`), `portfolioSource`, `shortDescription`, `gallery`, `heroImage`, `purchase`, `imageStatus`, `plannedImages`, `generationPlan`, `published`.
- `GalleryImage`: `id`, `src` (nulo = mapeada mas **não publicada**), `source`, `sourceUrl`, `status` (`REAL` · `APPROVED_GENERATED` · `PROVISIONAL` · `PENDING`), `alt`, `orientation`, `isPrimary`, `provenance` (origem, data, `authorization: PUBLIC_CDN | PENDING`, estado de correspondência).
- `purchase.type`: `YOOGA` · `WHATSAPP` · `BOTH` · `PENDING`. Itens ativos são `BOTH`: WhatsApp com mensagem pré-preenchida (`Olá! Tenho interesse no produto <nome>.`, número centralizado em `LINKS.whatsapp`) + cardápio geral do Yooga (**não existe deep-link por produto**). `PORTFOLIO_ONLY` fica `PENDING`: sem CTA de compra.
- Taxonomia editorial (13): Bolos · Fatias · Sobremesas no copo · Coxinhas doces · Doces e bombons · Caseirinhos · Cheesecakes e tortas · Cookies · Geladinhos · Bolos de pote · Cones trufados · Salgados · Açaí. "Presentes" e "Bebidas" não se aplicam aos dados reais.
- Fora da galeria (continuam no snapshot): garfinho, cartão presente, 5 bebidas industrializadas, "Combo do dia". Motivos em `EXCLUDED`.
- Imagem **gerada** no futuro entra como `APPROVED_GENERATED` com proveniência; **nunca** como `REAL`.

Mapeamento completo, lacunas e fila de geração: `docs/product-portfolio-matrix.md`, `docs/product-image-gaps.md`, `docs/image-generation-queue.md` (gerados por `node tools/build-portfolio-docs.mjs`).

## A página

- **Hero, busca e trilho de categorias** mantidos.
- **Trilho = filtro** (não âncora): "Todos" + 13 categorias; combina com a busca (nome, descrição, categoria). Sem JS vira âncora comum.
- **Card:** foto 4:5 · categoria · nome · descrição curta (2 linhas) · "Ver criação →". Sem preço, oferta, "a partir de", opções ou selo comercial. O card inteiro é um único link.
- **Sem foto:** painel da marca com o nome (sem imagem genérica).
- Blocos de **Bolos por encomenda** e **CTA final** mantidos (Menu de Bolos continua pendente; nenhum bolo inventado).

## Modal

Desktop: galeria à esquerda, informações à direita. Mobile (≤ 767px): folha de tela cheia, foto grande, miniaturas em trilho, CTAs fixos no rodapé.

- Galeria sem biblioteca: miniaturas, setas, ← → no teclado, swipe, contador "n / total". Produto com 1 foto mostra 1 foto (sem setas, miniaturas ou duplicação); sem foto, o painel da marca. **O "1 de 4 planejadas" existe só na documentação.**
- Acessibilidade: `role="dialog"`, `aria-modal="true"`, título associado, focus trap, ESC, botão fechar, clique fora, retorno do foco ao card, fundo `inert`, rolagem travada.
- Movimento: opacidade + escala de 0,98→1; `prefers-reduced-motion` desliga animação e transição de foto.
- **URL `?produto=slug`: implementado** (simples e robusto). Abrir faz `pushState` (Voltar fecha o modal), o link abre direto, slug inexistente é ignorado, fechar limpa o parâmetro.

## Performance

- Cards carregam só a **imagem principal** (lazy, com `width`/`height`). Hero continua sendo o LCP.
- As demais fotos **só são criadas quando o modal abre** (e removidas ao fechar). O JSON do modal (46 produtos, só URLs) vai embutido na página; não há fetch.
- Nenhuma imagem foi baixada para o repositório: as do Yooga são referenciadas no CDN (≤ 500 px de altura); as do Instagram foram só mapeadas.

## Estado das imagens e o que depende da Bruna

- Hoje **todo produto tem no máximo 1 foto publicável**: o modal com várias fotos existe e foi testado, mas só será visível quando houver mais fotos (autorização das do Instagram ou imagens aprovadas).
- Descrições vêm **literais** do Yooga (inclusive erros como "garantr"/"matlda" na Fatia Chocolatuda e a nota comercial de calda): a Bruna deve revisar o texto antes de ele ser tratado como editorial.
- Textos novos da página (`PRODUCTS_PAGE` em `src/data/site.ts`) precisam de aprovação da Bruna.
- O site segue `noindex, nofollow`.

## Direção de arte: Concept 09 V2 (álbum editorial)

> **Fonte de verdade visual** da página: `docs/qa/portfolio-gallery/concept-09-v2.webp`. Comparação com a implementação: `docs/qa/portfolio-gallery/compare-1440.webp`. As fotografias do Concept são só direção visual: não são produtos adicionais.

A camada de apresentação deixou de ser "grade de cards" e passou a ser **fotografia dominante, capítulos e blocos assimétricos**. A engenharia (dados, busca, filtro, modal, `?produto=`, provenance) não mudou.

| Peça | Arquivo | Papel |
|---|---|---|
| Layout por categoria | `src/data/portfolio-layout.ts` | variante visual de cada capítulo + textos de capítulo + `planBlocks` (variante × nº de produtos → blocos) |
| Capítulo | `src/components/PortfolioChapter.astro` | coluna editorial (número, título, texto, "Explorar") + blocos de fotos |
| Tile | `src/components/PortfolioTile.astro` | uma fotografia com legenda sobreposta (nome + "Ver criação →"); sem caixa, borda, preço ou descrição |
| CSS | `src/styles/products.css` | Hero, busca, trilho, intro, capítulos, blocos, tiles (CSS Grid; absoluto só em legenda/decoração) |

**Blocos** (templates de grid reutilizáveis): `solo`, `duo`, `pair` (duo de fontes estreitas, em tamanho natural), `feature3`, `mosaic5`, `wide4`, `trio`, `stagger`. Criação **sem foto** não vira tile: aparece como linha de texto ("Também") no fim do capítulo e ainda abre o modal. O trilho de categorias é sticky só dentro do álbum. **Variantes por categoria:** `feature` (Bolos, Doces e bombons, Cookies, Bolos de pote, Açaí), `mosaic` (Fatias, Geladinhos), `strip` (Sobremesas no copo, Caseirinhos), `editorial` (Coxinhas doces, Cheesecakes e tortas, Cones trufados, Salgados). Mudar a composição de uma categoria = mudar uma linha em `CHAPTER_LAYOUT`; não há CSS por produto. A foto grande troca de lado alternadamente (`pblock--flip`).

Regras:

- **Tile = 01-source.** Exceção documentada: o tile **protagonista** de um capítulo (o primeiro) pode usar a `03-angle` gerada e aprovada quando existir (Chocolatuda em Fatias, Bolo de cenoura em Bolos), porque as fotos do Yooga têm no máximo 500 px e ficariam muito ampliadas num tile grande. As outras fotos só existem no modal.
- **Ordem no capítulo:** produtos mais completos primeiro; em empate, a foto mais larga lidera.
- **Busca:** blocos fixos não valem com itens ocultos; durante a busca (`data-searching`) eles viram uma grade simples. O filtro por categoria mostra o capítulo inteiro.
- **Mobile/tablet (≤ 1023 px):** composição própria, não o mosaico miniaturizado: protagonista em linha inteira + pares; foto sozinha na última linha também ocupa a linha. Hero: foto e papéis acima do texto.
- **Hover:** zoom de 1,04 na foto e seta deslocada; `prefers-reduced-motion` desliga. Legenda sobre degradê (contraste do nome ≥ 4,5:1 no pior caso).
- **Sem JS:** tudo é HTML/CSS; cada tile leva ao WhatsApp com o nome do produto.

**Copy nova da página** (frases manuscritas do Hero e do álbum e o texto dos capítulos): `NEEDS_BRUNA_APPROVAL` quando vem do Concept e afirma algo, `DRAFT` quando só resume o Yooga. Tudo listado em `docs/portfolio-copy-review.md`.

**Limite conhecido:** as fotos do Yooga são ≤ 500 px; os tiles grandes ampliam até ~1,6×. A correção real é ter fotos de maior resolução (fila de produção, hoje pausada: `IMAGE PRODUCTION PAUSED — GALLERY ART DIRECTION GATE`).
