# Ateliê Doces Bruna

Site institucional do **Ateliê Doces Bruna** (confeitaria artesanal) e a **apresentação comercial** da proposta,
desenvolvidos pela LK Technologies Brasil. Um repositório, um build e um domínio.

| Parte | O que é | Onde fica |
| --- | --- | --- |
| **Site** | Home e página de produtos (portfólio editorial + catálogo) | `/` e `/produtos` |
| **Apresentação** | App interativo de 8 cenas, independente do site | `/apresentacao/` (link discreto no rodapé do site) |

> **Status: staging.** O site está tecnicamente pronto, mas **ainda não é publicável**: há dados a confirmar com a
> Bruna, assets provisórios e SEO desligado (`noindex` + `robots.txt` bloqueando tudo). O que falta, na ordem, está em
> [`docs/production-checklist.md`](docs/production-checklist.md). A lista viva sai de `npm run check:content`.

## Stack

- **Site:** [Astro](https://astro.build) 7 (estático), TypeScript, CSS próprio com tokens, [GSAP](https://gsap.com) para o motion
  (intro da marca, hero, rolagem), fontes Montserrat Variable e Playfair Display (`@fontsource`).
- **Apresentação (`apresentacao/`):** React 18 + Vite 6 + TypeScript + GSAP + lucide-react.

## Requisitos

Node **22.12 ou superior** e npm **9.6.5 ou superior** (exigência do Astro 7).

## Começando

```bash
npm ci                        # dependências do site
npm ci --prefix apresentacao  # dependências da apresentação
npm run dev
```

- Site: <http://localhost:4321>
- Apresentação: <http://localhost:4321/apresentacao/>

Em desenvolvimento o Astro repassa `/apresentacao/*` para o Vite da apresentação (porta **5183**, fixa), então valem as
mesmas URLs de produção. A porta 5183 precisa estar livre, senão o `npm run dev` falha de propósito.

## Scripts

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Sobe site (4321) e apresentação (5183) juntos. `Ctrl+C` encerra os dois. |
| `npm run dev:site` | Só o site. Sem o Vite da apresentação, `/apresentacao/` responde 502 com um aviso. |
| `npm run build` | Build único: compila a apresentação, compila o site e copia uma dentro da outra (`dist/` + `dist/apresentacao/`). |
| `npm run build:site` | Só o build do Astro. |
| `npm run preview` | Serve o `dist/` já construído (rode `npm run build` antes). Ex.: `npm run preview -- --port 4322`. |
| `npm run check:content` | Relatório do que ainda é placeholder ou provisório. Sempre sai com 0. |
| `npm run check:content:strict` | Gate de lançamento: sai com 1 enquanto houver **qualquer** pendência. |

A apresentação também roda sozinha (`cd apresentacao && npm run dev`); detalhes em [`apresentacao/README.md`](apresentacao/README.md).

## Estrutura

```
src/
  pages/          index.astro (home) · produtos.astro
  components/     Header, Footer, BrandIntro (intro das flores), RegionalNews, cards e tiles do portfólio…
  layouts/        BaseLayout.astro (head, SEO e JSON-LD, header e intro da marca)
  data/           site.ts (contrato de marca/contato/SEO) · products.ts · portfolio*.ts · regional.ts · images.ts
  lib/            catalog, busca, SEO e dados estruturados (JSON-LD)
  scripts/        motion (GSAP), busca e filtro de categorias, modal de produto
  styles/         tokens, global, seções, produtos, responsivo, motion
  assets/         logo, retrato da Bruna, fotos de produto e provisórias (provisional-*)
apresentacao/     app React/Vite da apresentação comercial (projeto independente)
tools/            build/dev, checagem de conteúdo, geração de docs e scripts de QA
docs/             checklist, auditorias, plano do portfólio e evidências de QA
concepts/         conceitos visuais explorados (referência)
design-systems/   referência visual aprovada e wireframe de texto
public/           robots.txt
```

## Dados e conteúdo

- **`src/data/site.ts`** é o contrato central: marca, navegação, contatos, links, SEO e a lista `PENDING_ITEMS`
  (cada item é `placeholder`, `needs-confirmation` ou `missing`). Valores entre colchetes, como `[E-MAIL]`, são
  placeholders que o `check:content` detecta.
- **`src/data/images.ts`** mapeia cada espaço de imagem (`ASSET_SLOTS`) para o asset a entregar. Hoje boa parte usa
  recortes provisórios (arquivos `provisional-*` em `src/assets/provisional/`).
- **Portfólio:** `src/data/portfolio.ts` é a fonte única. `node tools/build-portfolio-docs.mjs` regenera em `docs/` a
  matriz de produtos, as lacunas de imagem, a fila de geração e os pedidos de foto à Bruna.
- **Novidades regionais (Extrema e Camanducaia):** seção `#novidades` da home, com textos, status e links em
  `src/data/regional.ts` e guia de atualização em [`docs/regional-news.md`](docs/regional-news.md). O botão do grupo de
  WhatsApp só aparece com convite válido **e** `authorizedToPublish: true` (hoje `false`, aguardando a Bruna).
  Como o repositório é público, o convite **nunca** vai no código: vem de `REGIONAL_GROUP_URL_EXTREMA`.
- **Apresentação:** todo o texto e os links comerciais ficam em `apresentacao/src/presentation/content.ts`. Os assets
  são **copiados** de `src/assets` (não há import entre os dois projetos): se a identidade mudar, replique lá. O status
  das novidades regionais é espelhado lá (`REGIONAL_NEWS`): ao mudar em `regional.ts`, replique.

## Intro de marca

Ao carregar qualquer página (celular, tablet ou desktop) o site abre com uma animação de **cerca de 8 s**: a flor da
logo é traçada, faz um "bloom", pousa no "o" de "doces" e o site é revelado por trás. Toca em **todo carregamento**
(não há marcador de "já viu"), inclusive ao navegar entre páginas.

- Código: `src/components/BrandIntro.astro` (markup, linha do tempo em milissegundos e controller) e
  `src/components/BrandIntroHead.astro` (estilos críticos e a marcação `intro-pending` no `<head>`).
- Ao mudar a duração, ajuste a tabela no topo do `BrandIntro.astro` **e** mantenha o limite de segurança de 10 s
  (`BrandIntroHead.astro` e o fim do controller) maior que o total, senão a animação é cortada no meio.
- Com `prefers-reduced-motion` (acessibilidade) não há desenho nem movimento: a logo aparece em fade e some em ~0,5 s.
  Alguns celulares têm essa opção ligada (ex.: economia de bateria, "remover animações") e, neles, a intro curta é o
  comportamento esperado.

## Deploy (Vercel)

Um **único projeto** na Vercel, configurado pelo [`vercel.json`](vercel.json): framework Astro, instalação das
dependências dos dois projetos, build `npm run build` e saída em `dist/`. Um rewrite faz `/apresentacao` abrir sem a
barra final.

No painel do projeto:

- **Root Directory:** vazio (a raiz do repositório), **não** `apresentacao`.
- **Framework Preset:** Astro.
- **Node.js:** 22.x ou superior.

Variáveis de ambiente (todas opcionais por enquanto):

| Variável | Onde | Para quê |
| --- | --- | --- |
| `SITE_URL` | build do site | URL final: liga `canonical`, `og:url`, `og:image` absoluta. Só no lançamento. |
| `VITE_SITE_URL` | build da apresentação | Site aberto pelo botão "Explorar o site" da Cena 04. Vazio = usa o site publicado definido em `content.ts`; para homologar localmente, use `.env.local`. |
| `REGIONAL_GROUP_URL_EXTREMA` | build do site | Convite do grupo de WhatsApp de Extrema. Só vale com `authorizedToPublish: true`; nunca versionar (`.env.local`). |

A apresentação sai com `noindex, nofollow` de propósito e fica fora do `check:content`.

## QA

Os scripts `tools/qa-*.mjs` usam Chrome headless pelo DevTools Protocol, sem dependências extras. O caminho do Chrome
vem de `CHROME_PATH` (padrão: instalação do Windows em `C:/Program Files/Google/Chrome/Application/chrome.exe`;
só o `qa-frames.mjs` tem o caminho fixo).

```bash
npm run build && npm run preview -- --port 4332

node tools/qa-check.mjs   http://localhost:4332/   # layout, overflow, menu, teclado
node tools/qa-motion.mjs  http://localhost:4332/   # motion, reduced-motion, resize
node tools/qa-a11y.mjs    http://localhost:4332/   # estrutura, nomes acessíveis, contraste
node tools/qa-perf.mjs    http://localhost:4332/   # FCP, LCP, CLS, TBT (referência local)
node docs/qa/products-page/qa-products.mjs         # catálogo: busca, categorias, teclado
```

Capturas, comparações com a referência e relatórios de cada etapa ficam em `docs/qa/`.

## Documentação

| Arquivo | Conteúdo |
| --- | --- |
| [`docs/production-checklist.md`](docs/production-checklist.md) | O que falta para publicar, na ordem |
| [`docs/content-audit.md`](docs/content-audit.md) | Auditoria dos dados e textos do site |
| [`docs/bruna-content-request.md`](docs/bruna-content-request.md) | Pedido de conteúdo pronto para a Bruna |
| [`docs/products-audit.md`](docs/products-audit.md) · [`docs/products-page-plan.md`](docs/products-page-plan.md) | Auditoria do cardápio e plano da página `/produtos` |
| [`docs/portfolio-gallery-plan.md`](docs/portfolio-gallery-plan.md) | Plano da galeria editorial do portfólio |
| [`docs/regional-news.md`](docs/regional-news.md) | Novidades regionais: evidências, status e como atualizar |
| [`docs/product-portfolio-matrix.md`](docs/product-portfolio-matrix.md) | Matriz produto × imagem (gerada por `tools/build-portfolio-docs.mjs`) |
| [`docs/master-reference/`](docs/master-reference/) | Referência visual mestre e suas fatias por seção |
| [`docs/wireframe/`](docs/wireframe/) | Wireframe de texto do site |
| [`apresentacao/README.md`](apresentacao/README.md) | Como rodar, navegar e editar a apresentação |
