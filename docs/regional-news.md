# Novidades regionais — Extrema e Camanducaia

Seção da homepage (`#novidades`, entre Encomendas e Histórias) e bloco da Cena 02 da apresentação comercial.

## 1. Origem da informação e evidências

| Cidade | Evidência | O que comprova | O que NÃO comprova |
|---|---|---|---|
| Extrema, MG | Print fornecido pelo Owner da **descrição do grupo de WhatsApp "Extrema ✨📍"**: anuncia que o delivery do Ateliê "está chegando" e que "vamos definir a data conforme a votação". | A chegada do delivery está **anunciada e em organização**. | Que as entregas já começaram, qualquer data, qualquer calendário. |
| Camanducaia, MG | Informação verbal do Owner (expansão para a cidade). | Intenção/iniciativa informada. | Existência de grupo, link, data ou status operacional. Sem print nem convite. |

## 2. Status atual (decisão registrada)

| Cidade | `status` | Exibido como | Por quê |
|---|---|---|---|
| Extrema | `organizing` | "Em organização · Data ainda a definir." | Evidência do grupo aponta organização, data dependente de votação. |
| Camanducaia | `unconfirmed` | "Novidades futuras" | Sem confirmação suficiente: linguagem neutra. |

Status possíveis: `organizing` (em organização), `soon` (em breve, sem data), `active` (entregas confirmadas), `paused`, `unconfirmed`.
**Nunca** inferir `active` só porque existe um grupo de WhatsApp.

## 3. Links dos grupos

- **STATUS PÚBLICO: DESATIVADO.** Na publicação os botões de grupo estão desligados (`authorizedToPublish: false`) até a Bruna autorizar; o convite não aparece no HTML/JS de produção. Os cards mostram "O link do grupo será divulgado em breve."
- **Extrema:** link informado pelo Owner e configurado em `regional.ts` (o convite NÃO está no repositório público: vem da variável de ambiente `REGIONAL_GROUP_URL_EXTREMA`, guardada em `.env.local` local e não versionada). **Pendente:** confirmar com a Bruna a divulgação pública do convite **antes do deploy**.
- **Camanducaia:** sem grupo próprio. **Decisão do Owner:** o botão aponta provisoriamente para o grupo de Extrema, com o rótulo "Entrar no grupo de novidades" (para não afirmar que é um grupo de Camanducaia). Quando existir o grupo dela, troque `url` e o rótulo em `regional.ts`.
- Não confundir: telefone/WhatsApp da Bruna (`LINKS.whatsapp`), cardápio Yooga (`LINKS.cardapio`) e convite de grupo são destinos diferentes.

## 4. Como atualizar (um único arquivo)

Tudo está em **`src/data/regional.ts`** (`REGIONAL_NEWS`). Os componentes não precisam mudar.

- **Mudar o status:** altere `status` da cidade (`'organizing' | 'soon' | 'active' | 'paused' | 'unconfirmed'`). O rótulo vem de `DELIVERY_STATUS_LABEL`.
- **Informar a data (só quando confirmada):** preencha `statusNote` (ex.: `'Primeira entrega: 12/12.'`). Sem data confirmada, não preencha.
- **Ativar o CTA do grupo:** em `group`, informe `url` com o convite real (`https://chat.whatsapp.com/...`) **e** `authorizedToPublish: true` (somente após a Bruna autorizar). Os dois são obrigatórios; sem um deles o botão não aparece. O formato é validado em `groupCta()`.
- **Desativar o CTA:** `url: null` ou `authorizedToPublish: false`.
- **Textos:** `headline` e `detail` da cidade; título/subtítulo em `REGIONAL_NEWS`.
- Depois de mudar: rode `npm run build` na raiz e replique **status/textos** em `apresentacao/src/presentation/content.ts` (`REGIONAL_NEWS`), para manter site e apresentação consistentes. A apresentação **não** mostra links de grupo.

## 5. Decisões pendentes (Owner / Bruna)

1. **Autorização da Bruna** para divulgar o convite de Extrema publicamente (antes do deploy).
2. Grupo próprio de **Camanducaia** (hoje usa o de Extrema, provisório) e confirmação de que o delivery chegará lá.
3. **Status real** de Camanducaia.
4. **Data** de início em Extrema (hoje definida por votação; só publicar quando confirmada).
5. Se a Bruna aprova o texto público das duas cidades (copy em `regional.ts`).

## 6. Limites desta entrega

Sem sistema de logística, sem calendário de entregas, sem integração automática com o WhatsApp, sem CRM. É apenas comunicação e experiência digital. Não afirma crescimento de vendas nem atribui a expansão à LK: é iniciativa da própria Bruna.

## 7. Visual (concept aprovado) e assets

- Componente: `src/components/RegionalNews.astro` (concept editorial: título "O Ateliê está chegando mais longe.", foto do bolo à direita, dois cards com paisagem e botão cacau, flor da marca em traço, divisor floral). Âncora `#novidades` mantida.
- **Foto do bolo:** `src/assets/portfolio/bolo-de-cenoura/04-context.webp`, asset do portfólio já usado no site (otimizado pelo `astro:assets`: larguras 480/720/960, lazy). Não é o bolo ilustrado no concept; é um produto do próprio portfólio. Procedência detalhada em `src/data/portfolio.ts`.
- **Paisagens dos cards:** composições **decorativas em SVG** (montanhas, colinas e, em Camanducaia, uma araucária estilizada). **Não são fotos** nem identificam um local real. Se houver fotos reais autorizadas de Extrema/Camanducaia, registre procedência/direito de uso e troque o `<svg class="city__land">`.
- **Flor:** vetor da marca (`src/data/brand-flower.ts`), só em traço.
- **Grupo compartilhado:** o card de Camanducaia mostra o aviso `group.sharedNote` ("Grupo regional de novidades, atualmente o mesmo de Extrema."). Ao criar um grupo próprio, troque `url`, `ctaLabel` e remova `sharedNote`.
- **Sem link/autorização:** o botão some e o card mostra "O link do grupo será divulgado em breve." (não clicável).
- **Movimento:** reveal por IntersectionObserver só quando `html.motion-ready` (sem JS ou com movimento reduzido tudo aparece).

## 8. Ilustrações dos cards (atualização)

- Os SVGs decorativos foram **substituídos** por duas ilustrações editoriais aprovadas pelo Owner: `src/assets/regional/regional-extrema.webp` (1674×939, 120 kB) e `src/assets/regional/regional-camanducaia.webp` (1676×939, 241 kB). Servidas pelo `astro:assets` em 640/960/1280 px (WebP de 17 a 141 kB no build).
- São **composições artísticas geradas**, não fotografias documentais: alt text descritivo ("Ilustração editorial…") e a nota discreta "Imagens ilustrativas." sob os cards. Não escrever legendas do tipo "vista real de Extrema".
- Enquadramento por cidade em `ART` (`pos` desktop, `posM` mobile) no `RegionalNews.astro`; máscara e véu creme mantêm a área de texto limpa. Os SVGs antigos foram removidos (não eram usados em outro lugar).
