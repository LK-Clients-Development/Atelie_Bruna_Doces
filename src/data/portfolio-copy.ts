/**
 * COPY EDITORIAL do portfólio: SOURCE → EDITORIAL DISPLAY.
 *
 *   SOURCE     nome/descrição exatamente como o Yooga publica (src/data/products.ts, intacto, com erros
 *              de digitação e observações operacionais). Continua sendo a fonte comercial.
 *   EDITORIAL  o texto que a galeria exibe (este arquivo): ortografia corrigida, ruído operacional
 *              removido (notas de calda, gramatura, "serve N", "ver observações"), resumo objetivo do que
 *              a fonte já diz. NADA é inventado: nenhum ingrediente, sabor, história ou claim novo.
 *
 * Chave = `sourceProductId`. Produto sem entrada aqui usa o texto de origem (`SOURCE_RAW`).
 *
 * Status da copy:
 *   APPROVED              a Bruna aprovou (nenhum ainda).
 *   DRAFT                 só correção/limpeza/resumo do que a fonte já afirma; aguarda revisão da Bruna.
 *   SOURCE_RAW            texto de origem sem tratamento.
 *   NEEDS_BRUNA_APPROVAL  a fonte é ambígua (pontuação faltando) ou não existe: o texto abaixo é uma leitura
 *                         PROVÁVEL e só a Bruna confirma. Sem texto = nada é exibido até ela responder.
 *
 * `displayName` (opcional) só normaliza grafia/abreviação ("c/" → "com"); não renomeia o produto.
 * `editorialDescription` (opcional) é um texto mais longo para o modal; hoje todos usam o curto.
 */
import type { CopyStatus } from './portfolio';

export interface ProductCopy {
  status: CopyStatus;
  displayName?: string;
  shortDescription: string | null;
  editorialDescription?: string | null;
  /** Por que ficou em revisão / o que mudou em relação à fonte. */
  note?: string;
}

export const PORTFOLIO_COPY: Record<number, ProductCopy> = {
  // ----- Salgados -----
  3443815: { status: 'DRAFT', shortDescription: 'Massa que derrete na boca, com frango desfiado cremoso e requeijão.', note: 'Só espaço duplo e ordem das palavras.' },
  4397996: { status: 'DRAFT', displayName: 'Coxinha de costela com cream cheese', shortDescription: 'Coxinha recheada com costela desfiada e cream cheese.', note: '"c/" → "com"; removido "original" (marca do cream cheese, não do produto).' },
  4441576: { status: 'DRAFT', displayName: 'Coxinha de frango com catupiry', shortDescription: 'Coxinha crocante de frango com catupiry.', note: '"c/" → "com"; frase reordenada.' },
  5829904: { status: 'DRAFT', shortDescription: 'Massa crocante recheada com salsicha.', note: 'Corrigido "salchicha"; nome já corrigido em products-display.ts.' },
  7252226: { status: 'DRAFT', shortDescription: 'Massa bem fofinha, recheada com carne temperada. Ideal para o lanche da tarde.' },
  8632823: { status: 'DRAFT', displayName: 'Esfiha de frango com catupiry', shortDescription: 'Massa fofinha com recheio de frango desfiado e catupiry.', note: 'Só capitalização do nome.' },

  // ----- Fatias -----
  3415238: { status: 'DRAFT', shortDescription: 'Brownie coberto com creme de ninho e Nutella pura.', note: 'Removidos "delicioso" e "muito".' },
  5830601: { status: 'DRAFT', displayName: 'Fatia brownie brigadeiro', shortDescription: 'Brownie molhadinho com brigadeiro cremoso de cacau 50%, finalizado com granulado belga.' },
  4672088: { status: 'DRAFT', shortDescription: 'Massa de cacau 50% molhadinha, brigadeiro ao leite cremoso e granulado belga.', note: 'Removida a observação operacional sobre calda (com erros "garantr" e "matlda") e corrigido "belga".' },
  4679019: { status: 'DRAFT', shortDescription: 'Massa de cacau 50%, brigadeiro ao leite e brigadeiro de maracujá bem cremoso. A fatia serve até 2 pessoas.', note: 'Corrigido "cremosinhooo".' },
  4679020: { status: 'NEEDS_BRUNA_APPROVAL', displayName: 'Fatia duo com morango', shortDescription: 'Massa de cacau 50% molhadinha, brigadeiro de ninho, brigadeiro ao leite e morangos, finalizada com granulado belga.', note: 'A fonte não tem vírgula/“e” entre "brigadeiro ao leite" e "morangos" e escreve só "belga": leitura provável, confirmar.' },
  4748080: { status: 'DRAFT', shortDescription: 'Massa de cacau molhadinha, brigadeiro cremoso de ninho e Nutella pura.' },
  8181132: { status: 'DRAFT', displayName: 'Fatia limão siciliano com frutas vermelhas', shortDescription: 'Massa de baunilha molhadinha, brigadeiro de limão siciliano e geleia de frutas vermelhas.', note: '"c/" → "com" no nome.' },
  8819556: { status: 'DRAFT', shortDescription: 'Massa de chocolate 50% cacau com 5 camadas de ganache de chocolate blend. Acompanha caldinha.' },

  // ----- Coxinhas doces e bombons -----
  3415249: { status: 'DRAFT', shortDescription: 'Massa de brigadeiro 50% cacau, morango selecionado envolto em castanha e finalizado com Nutella.', note: 'Quebra de linha removida.' },
  3415250: { status: 'DRAFT', shortDescription: 'Massa de brigadeiro de ninho com morango selecionado, finalizada com Nutella.' },
  3415251: { status: 'DRAFT', shortDescription: 'Massa de brigadeiro 50% cacau com morango selecionado, envolta em granulado belga.', note: 'Removidos gramatura e "de pura delícia".' },
  5777324: { status: 'DRAFT', shortDescription: 'Brigadeiro cremoso envolto em granulado belga.', note: 'Removida a gramatura.' },
  8271723: { status: 'DRAFT', shortDescription: 'Doce de leite com a combinação perfeita do chocolate nobre. Derrete na boca.' },
  8801925: { status: 'DRAFT', shortDescription: 'Brigadeiro de ninho com morango selecionado, chocolate nobre branco e lascas de caramelo.' },

  // ----- Caseirinhos -----
  6223177: { status: 'DRAFT', shortDescription: 'Massa de chocolate bem molhadinha, Nutella e creme de ninho. Serve 2 pessoas.' },
  6245599: { status: 'DRAFT', shortDescription: 'Massa de chocolate molhadinha com morango e Nutella no meio, coberta com creme de ninho e finalizada com Nutella e morango. Serve 2 pessoas.' },
  6275769: { status: 'DRAFT', shortDescription: 'Massa de cenoura com cobertura de brigadeiro de chocolate e granulado belga. Perfeito para o café da tarde.' },
  6551804: { status: 'DRAFT', shortDescription: 'Massa de chocolate cacau 50% bem molhadinha, brigadeiro cremoso e granulado belga. Serve 2 pessoas.' },

  // ----- Cheesecakes e tortas -----
  7103479: { status: 'DRAFT', shortDescription: 'Cheesecake artesanal com base de biscoito, recheio cremoso e suave de cream cheese, geleia de frutas vermelhas e morango fresco.', note: 'Removidos adjetivos de venda ("irresistível", "generosa").' },
  7584407: { status: 'DRAFT', shortDescription: 'Base de bolacha amanteigada, creme de queijo com maracujá e geleia de maracujá.', note: 'Corrigidos "amategada" e "maracuja".' },
  4579548: { status: 'DRAFT', shortDescription: 'Biscoito amanteigado e mousse de limão, finalizada com chantininho.' },

  // ----- Sobremesas no copo -----
  3415240: { status: 'NEEDS_BRUNA_APPROVAL', shortDescription: 'Recheio de ninho intercalado com mousse de ninho, brownie molhadinho e morangos selecionados.', note: 'A fonte não separa "brownie molhadinho" de "morangos selecionados" (falta "e"): leitura provável, confirmar.' },
  3415241: { status: 'DRAFT', shortDescription: 'Recheio de ninho intercalado com mousse de ninho, brownie molhadinho e Nutella pura.' },
  5937243: { status: 'DRAFT', shortDescription: 'Trufa de maracujá, brownie denso e molhadinho, creme 4 leites, chantininho e geleia de maracujá.', note: 'Removida vírgula dupla.' },
  7876302: { status: 'NEEDS_BRUNA_APPROVAL', shortDescription: 'Creme de danette, mousse de chocolate, amendoim triturado, brownie denso e molhadinho, Nutella e bombom Ferrero.', note: 'Falta pontuação entre "molhadinho" e "Nutella": leitura provável, confirmar a lista de camadas.' },
  8664774: { status: 'NEEDS_BRUNA_APPROVAL', shortDescription: 'Brigadeiro de ninho cremoso, brigadeiro ao leite, brownie molhadinho e morangos frescos.', note: 'A fonte diz "brownie molhado no morangos frescos" (erro de digitação): leitura provável, confirmar.' },
  8977203: { status: 'NEEDS_BRUNA_APPROVAL', shortDescription: 'Creme de danette, mousse de chocolate, brownie e morangos frescos.', note: 'A fonte diz "mousse de chocolate brownie" sem vírgula: pode ser mousse + brownie ou um mousse de brownie; confirmar.' },

  // ----- Cookies, Açaí, Geladinhos -----
  6902111: { status: 'DRAFT', shortDescription: 'Cookie americano recheado com pedaços de chocolate ao leite e Nutella pura.', note: 'Removida a gramatura.' },
  8835730: { status: 'DRAFT', shortDescription: 'Cookie tradicional americano com gotas de chocolate nobre ao leite.' },
  7734662: { status: 'DRAFT', shortDescription: 'Açaí puro na bandeja, 350 ml.', note: 'Corrigidos "Açai", "bandeija".' },
  7498098: { status: 'DRAFT', shortDescription: 'Dez geladinhos de sabores sortidos.', note: 'A fonte oferece escolher os sabores "nas observações" (operacional): removido.' },
  7383565: { status: 'NEEDS_BRUNA_APPROVAL', shortDescription: null, note: 'Sem descrição na fonte; nada foi inventado. A Bruna precisa dizer o que o geladinho leva.' },
  7383568: { status: 'NEEDS_BRUNA_APPROVAL', shortDescription: null, note: 'Sem descrição na fonte.' },
  7401609: { status: 'NEEDS_BRUNA_APPROVAL', shortDescription: null, note: 'Sem descrição na fonte.' },
  7455768: { status: 'NEEDS_BRUNA_APPROVAL', shortDescription: null, note: 'Sem descrição na fonte (nem foto).' },

  // ----- Bolos de pote, cones, bolo -----
  3415245: { status: 'DRAFT', shortDescription: 'Massa de chocolate 50% cacau e creme de coco, finalizados com brigadeiro cremoso.' },
  3415246: { status: 'DRAFT', shortDescription: 'Massa de chocolate 50% cacau em camadas com brigadeiro cremoso.' },
  3415255: { status: 'DRAFT', shortDescription: 'Casquinha crocante banhada no chocolate, com brigadeiro cremoso 50% cacau.' },
  3415256: { status: 'NEEDS_BRUNA_APPROVAL', shortDescription: 'Casquinha crocante banhada no chocolate, com brigadeiro de maracujá feito da fruta.', note: '"(da fruta)" lido como "feito da fruta": confirmar se for citar.' },
  7986915: { status: 'DRAFT', shortDescription: 'Bolo de cenoura fofinho com cobertura de brigadeiro cremoso. Serve de 8 a 10 pessoas.' },
};
