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
