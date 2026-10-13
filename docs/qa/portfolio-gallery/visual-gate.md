# Gate visual final: Concept 09 V2

Capturas do estado final em `docs/qa/portfolio-gallery/`: `page-1440.webp`, `page-1024.webp`, `page-768-1..3.webp`, `page-390-1..2.webp` (páginas muito altas saem em partes), `top-*.webp` (primeira dobra nas 7 larguras), `sec-*.webp` (capítulos) e `compare-1440.webp` (Concept aprovado × implementação).

Critério: só diferença que um visitante perceberia. **A** = alta (corrigida), **B** = média (corrigida só se trivial e sem risco), **C** = baixa (documentada). Nada que volte a cards, caixas, preço, botões repetidos ou grade uniforme.

## Achados A (corrigidos)

| # | Achado | Correção |
|---|---|---|
| A1 | Cookie tradicional e Geladinho Sensação (sem foto no Yooga) viravam tiles grandes **vazios**, pálidos, com cara de erro | Sem foto não há tile: a criação vira uma linha de texto "Também: nome · Ver criação →" no fim do capítulo; continua abrindo o modal. O mosaico é planejado só com as criações que têm foto |
| A2 | O trilho de categorias (sticky) ficava por cima do CTA final e do Footer, em desktop e mobile | O trilho passou para dentro do álbum: o sticky termina com ele |
| A3 | Pares de fontes muito estreitas (Copo Ninho com Nutella/Morango, Bolos de pote: 231–299 px) eram ampliados até **2,06×** em tiles grandes (visivelmente borrados) | Bloco `pair`: duas fotos em tamanho natural (máx. 320 px). Ampliação máxima da página em 1440 caiu de 2,06× para 1,54× |
| A4 | Imagem provisória de 313 px da faixa de chocolate ampliada ~1,5× em tablet/mobile | A foto nunca passa do tamanho nativo (`min(52%, 313px)`); a faixa fica mais limpa e a frase continua legível |

## Achados B

| # | Achado | Decisão |
|---|---|---|
| B1 | Em 1440 o trilho de categorias corta a última categoria à direita (rolagem horizontal) | **Não corrigido**: um degradê fixo apagaria os últimos itens quando o trilho chega ao fim; o certo exige JS. Rolagem horizontal controlada foi pedida |
| B2 | Bolos tem 1 produto: uma foto protagonista e ~40% da linha em branco | Não corrigido: o Concept mostra 3 fotos, mas duas são de outras categorias; não vamos inventar bolos. Respiro editorial |
| B3 | Mobile: foto do Hero acima do texto (o Concept desktop tem texto à esquerda) | Mantido de propósito: no celular a foto abre a galeria; texto e busca vêm logo depois |
| B4 | Numeral do capítulo parcialmente coberto pelo título | Mantido: é o recurso do Concept (numeral decorativo atrás do título) |

## Achados C

- Páginas com poucas fotos em "pair"/"solo" deixam espaço em branco à direita (editorial, intencional).
- Footer e Header são globais e não foram tocados (o rodapé ainda lista A Marca/Bruna/Criações/Encomendas/Contato).
- "Explorar <categoria>" só aparece em capítulos com 3+ criações.
- As frases manuscritas usam o itálico do sistema (sem fonte nova).

## ASSET-LIMITED DEVIATION

O que ainda desvia do Concept **só por resolução da fonte** (Yooga ≤ 500 px; ampliação medida por `asset-scale.mjs` → `asset-scale.json`):

- **1440:** Brigadeirão belga ×1,54, Cone Trufado de Brigadeiro ×1,54, Açaí 350 ml ×1,54 (tiles grandes de fotos de 375 px). Máximo da página: ×1,54.
- **1024:** nenhum tile ≥ ×1,4 depois da correção A3.
- **390:** Copo Ninho com Morango ×1,43 e Bolo de Pote de Prestígio ×1,5 (primeira foto do capítulo ocupa a linha inteira).
- Os tiles com foto gerada e aprovada (Chocolatuda e Bolo de cenoura, protagonistas de Fatias e Bolos) não têm esse limite: usam a `03-angle` de ~1100 px.
- Nenhum sharpen artificial foi aplicado e nenhuma imagem foi reconstruída. A solução real é ter fotos maiores (ver `docs/product-photo-request.md`).

## Faixa editorial de chocolate

Imagem **provisória** (recorte de 313 px da Master Reference, `provisional-media-manifesto-chocolate.webp`). Em 1440 aparece ~1:1 (sem degradação perceptível); em tablet/mobile era ampliada e foi **limitada ao tamanho nativo** (A4). Não houve substituta gerada e a imagem **não** foi promovida a asset real: continua `provisional`.

## Copy

Sem mudança de status: `NEEDS_BRUNA_APPROVAL` para as duas frases manuscritas e para os textos de Bolos ("ingredientes selecionados", "nossa história") e Fatias ("generosas", "equilíbrio perfeito"); `DRAFT` para os demais capítulos. Nenhum claim virou texto aprovado (lista em `docs/portfolio-copy-review.md`).
