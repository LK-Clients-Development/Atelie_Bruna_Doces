# Assets PROVISÓRIOS

> Cada arquivo é usado por um **slot** de `src/data/images.ts` (que também lista o asset real necessário em `ASSET_SLOTS`). Para trocar por um asset real, altere só o `import` do slot lá.

> **Nada nesta pasta é conteúdo real ou arte final.** São recortes da Master Reference (imagem gerada, aprovada só como direção visual) usados para construção, posicionamento, proporção, composição e QA de fidelidade.
>
> Todos serão substituídos por material real: fotos da Bruna, produtos, bastidores, embalagem e logo oficial.

- **Origem:** `design-systems/atelie-doces-bruna-v2/reference.webp` (1440 × 8365).
- **Gerados por:** `node tools/crop-provisional-assets.mjs`. É determinístico, sem IA generativa: só recorte e, no Hero, desfoque com borda suave sobre elementos de interface gravados na foto.
- **Prefixo obrigatório:** `provisional-`. Um arquivo real nunca usa esse prefixo.

| Arquivo | Região da reference (x, y, w × h) | Uso | Observação |
|---|---|---|---|
| `provisional-hero-bg.webp` | 640, 110, 800 × 750 | Foto de fundo do `hero` | Selo e fim de "doces," desfocados; resta um vestígio sutil do anel do selo |
| `provisional-manifesto-base.webp` | 0, 1680, 650 × 320 | Base decorativa (tecido + cerâmica) do Manifesto | — |
| `provisional-criacoes-base.webp` | 0, 3870, 555 × 290 | Base decorativa de Criações | — |
| `provisional-historias-mesa.webp` | 0, 5310, 780 × 940 | `media2` de Histórias Reais | Contém o inset (fatia) gravado; o `media` real cobre essa área na Etapa 4 |
| `provisional-bastidores-confeitando.webp` | 680, 6320, 760 × 670 | `media2` de Bastidores | Logo no avental não é arte final |
| `provisional-cta-celebracao.webp` | 660, 7380, 780 × 520 | `media2` do CTA final | Logo na caixa não é arte final |

### Fotos de conteúdo das molduras `media` (Etapa 4)

Recortes com ~4px de folga da borda off-white gravada na reference (a moldura HTML refaz a borda). Todos provisórios: produtos, mãos, embalagens e logos nelas são direção fotográfica, não conteúdo real.

| Arquivo | Região (x, y, w × h) | Uso |
|---|---|---|
| `provisional-media-manifesto-maos` | 764, 1086, 653 × 374 | Manifesto, moldura A |
| `provisional-media-manifesto-brigadeiros` | 658, 1509, 377 × 338 | Manifesto, moldura B |
| `provisional-media-manifesto-chocolate` | 1127, 1470, 313 × 345 | Manifesto, moldura C |
| `provisional-media-criacoes-bolo` | 715, 3195, 559 × 432 | Criações, bolo (abaixo da onda gravada) |
| `provisional-media-criacoes-brigadeiros` | 562, 3701, 463 × 309 | Criações |
| `provisional-media-criacoes-fatia` | 1284, 3260, 156 × 398 | Criações, close |
| `provisional-media-criacoes-cheesecake` | 1095, 3675, 345 × 298 | Criações |
| `provisional-media-jornada-caderno` | 1100, 4281, 340 × 409 | Encomendas, passo 01 |
| `provisional-media-jornada-morango` | 752, 4680, 256 × 322 | Encomendas, passo 02 |
| `provisional-media-jornada-mesa` | 1024, 5014, 416 × 195 | Encomendas, passo 03 (abaixo do texto gravado) |
| `provisional-media-historias-fatia` | 0, 5819, 286 × 355 | Histórias, inset |
| `provisional-media-bastidores-peneira` | 580, 7002, 345 × 341 | Bastidores, trio |
| `provisional-media-bastidores-laco` | 936, 7002, 504 × 352 | Bastidores, trio |

### Adicionados na Etapa 5 (revisão visual)

| Arquivo | Região (x, y, w × h) | Uso |
|---|---|---|
| `provisional-hero-base` | 0, 748, 700 × 192 | Tecido + tigela abaixo do texto do Hero |
| `provisional-manifesto-strip` | 650, 1892, 790 × 108 | Faixa de tecido sob as molduras do Manifesto |
| `provisional-criacoes-strip` | 555, 4022, 885 × 110 | Faixa de tecido sob as molduras de Criações |

Ajustados: `provisional-hero-bg` (agora 800 × 800, até a onda), `provisional-media-manifesto-maos` (714, 1040, 703 × 460, topo recortado por `clip-path`) e `provisional-media-criacoes-bolo` (640, 3195, 751 × 540).

> **Recortes sem pedaços da Master gravados.** Os recortes das molduras `media` acima foram refeitos para NÃO incluir o que a Master grava junto da foto (caixa de texto com fragmentos do título, ondas, bordas de molduras vizinhas). Antes, essas peças só ficavam invisíveis porque outras molduras HTML as cobriam; o parallax as expunha durante o scroll. Continua sendo só recorte (sem IA, sem retoque). A foto de fundo de Histórias (`provisional-historias-mesa`) ainda traz a fatia gravada: ela é recortada pelo `clip-path` de `.section--historias .media2` e a moldura real ocupa esse recorte (ver `content.css`).
