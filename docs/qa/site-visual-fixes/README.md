# QA visual do site: correções de Afeto, Criações, Encomendas, Histórias e splash

Local, sem commit/push/deploy. Aprovação visual final: Owner.

## Pastas

| Pasta | O que é | Observação |
|---|---|---|
| `before/` | Capturas de 1440 e 390, tiradas **antes das correções de CSS/assets** das quatro seções. | Foram tiradas **depois** de o splash já ter sido restrito à homepage, então `before/*-produtos-*.png` **não mostra o splash**. Não existe captura "antes" do splash em `/produtos`; a causa está documentada no código (`BaseLayout.astro` renderizava a abertura em todas as páginas). |
| `after/` | **Parcial e superada.** 22 capturas de 1440 de uma rodada interrompida por falta de memória. | Mantida só por preservação. Usar `final/`. |
| `final/` | Rodada final, **um viewport por vez**, uma instância de Chrome fechada a cada viewport. 1440, 1280, 820, 390 e 360. | `<largura>-<secao>-desce-N` (rolando para baixo: entrando → saindo) e `-sobe-N` (voltando). `-rm-` = reduced-motion. |
| `final/recheck-tags/` | Reverificação de Encomendas em 1280 após corrigir a colisão das tags. | A captura de 1280 em `final/` que mostrou o defeito foi preservada. |

Não existem comparações "antes/depois" lado a lado nesta pasta: o "antes" só existe em 1440 e 390, e a rodada final inclui viewports sem "antes".

## Relatórios (JSON)

- `final/relatorio-<largura>.json`: problemas automáticos, imagens quebradas, rolagem horizontal real, console, `/produtos`.
- `final/relatorio-<largura>-reduced.json`: reduced-motion (1440 e 390).
- `final/splash-por-rota.json`: splash por rota.
- `final/recortes-novos-contact-sheet.png`: os 10 recortes modificados, para revisão de enquadramento.

## O que o QA automático verifica em cada viewport

- Em cada posição de scroll (descendo e subindo): moldura clara/vazia visível (borda ou fundo opaco enquanto a foto ainda está recortada).
- Rolagem horizontal **real** (`scrollTo(600, y)` → `scrollX > 0`), e não só `scrollWidth`: o `body` usa `overflow-x: clip`.
- Imagens quebradas, erros/avisos de console.
- `/produtos`: sem splash, sem rolagem horizontal, sem imagens quebradas.
- Reduced-motion: nenhuma foto com `clip-path`, nenhum texto/foto com opacidade < 1, nenhuma moldura sem borda.

Colisão de texto e qualidade de enquadramento foram avaliadas **visualmente** nas capturas (não há detector automático).

## Notas conhecidas

- Voltar do histórico de `/produtos` para `/` restaura a home do cache do navegador (bfcache) já depois da abertura, sem reexibir o splash. É comportamento do navegador, não defeito. Em recarga ou navegação nova, a home exibe o splash.
- Mobile (≤ 640 px) em Histórias: a fatia que aparece no canto da foto é a gravada na própria foto de fundo (a moldura real fica oculta no mobile). Comportamento anterior, mantido.
- `flor-linha` (passo 03 de Encomendas): o asset provisório tem pétalas cortadas na borda direita. É o próprio recorte, não CSS; precisa do asset oficial.
