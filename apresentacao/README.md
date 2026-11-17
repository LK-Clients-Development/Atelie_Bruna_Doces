# Apresentação comercial — Ateliê Doces Bruna × LK Technologies Brasil

Aplicação React + TypeScript + Vite, **independente** do site institucional deste repositório
(`astro.config.mjs` na raiz). Mesmo repositório Git, dois projetos de build separados.

## Rodar localmente

```bash
cd apresentacao
npm install
npm run dev
```

Abre em `http://localhost:5183`.

## Build de produção

```bash
npm run build   # tsc --noEmit + vite build → apresentacao/dist
npm run preview # serve o build gerado
```

## Variáveis de ambiente

`VITE_SITE_URL` define o destino do botão "Explorar o site" (Cena 04). Sem a variável, usa o site
publicado (`PUBLISHED_SITE_URL` em `content.ts`). Para homologar contra o site local, crie
`.env.local` (não versionado) com `VITE_SITE_URL=http://localhost:4321/` e rode o site com
`npm run dev` na raiz do repositório (Astro, porta 4321). Nunca coloque credenciais no frontend.

## Roteiro comercial (uso interno)

O roteiro comercial interno (apresentador, objeções, agenda de 30 min e referências de preço) fica **fora do
repositório público** (`docs/roteiro-comercial-*.md`, ignorado pelo git). Peça aos sócios a cópia local.

## Navegação

- Setas `←` `→` do teclado ou `Espaço` (avança); toque/arraste no mobile; clique nas pétalas do
  indicador de progresso ou nas setas na barra inferior.
- Botão de tela cheia (API nativa do navegador; alguns navegadores — ex.: iOS Safari — não suportam
  e o botão some automaticamente).
- `Esc` sai da tela cheia.
- Respeita `prefers-reduced-motion`: com a preferência ativada, as animações (flor, cupcake, bolo em
  camadas, textos) aparecem direto no estado final, sem o movimento.

## Estrutura

```
apresentacao/
  src/
    presentation/
      content.ts          # TODO o texto e os links comerciais (edite só aqui)
      PresentationShell.tsx
      hooks.ts
      components/          # SplitText, Reveal, TiltedCard, AnimatedCounter, FlowerMark,
                            # CupcakeMotion, CakeLayers, Particles, SlideNavigation, SlideProgress
      scenes/               # as 8 cenas comerciais
      styles/
    assets/                 # logo, foto da Bruna, fotos de produto e o vetor da flor da marca —
                             # copiados de src/assets do site institucional (ver nota abaixo)
```

### Sobre os assets copiados

Esta app não importa arquivos de `../src` do projeto Astro (isso quebraria o isolamento de build
e o deploy Vercel do site institucional). Em vez disso, os assets reais já aprovados foram
**copiados** para `apresentacao/src/assets/`:

- `brand/atelie-doces-bruna-logo.png` e `-sem-flor.png` — logo oficial
- `brand-flower.ts` — mesmo vetor da flor usado em `src/components/BrandIntro.astro`
- `photos/` — fotos reais do portfólio (bolo de cenoura, fatia chocolatuda), do retrato da Bruna e
  de composições de processo/celebração já usadas no site

Se a identidade visual mudar no site institucional (nova logo, novas fotos aprovadas), replique a
mudança aqui manualmente — não há import automático entre os dois projetos.

## Deploy na Vercel (segundo projeto, mesmo repositório)

1. Criar um **novo** projeto na Vercel apontando para este mesmo repositório GitHub.
2. **Root Directory**: `apresentacao`
3. Framework preset: Vite (detectado automaticamente a partir do `package.json`).
4. Build Command: `npm run build` (padrão do preset).
5. Output Directory: `dist` (padrão do preset).
6. Variável de ambiente opcional: `VITE_SITE_URL`.
7. **Não** alterar o projeto Vercel existente do site institucional nem seu domínio/DNS.

Nenhum deploy foi feito por esta sessão — a publicação é uma ação manual, de responsabilidade de
quem configurar o projeto na Vercel.

## Pendências reais (não inventadas)

- **Contato comercial oficial da LK** não existe no repositório: `LINKS.lkContact` é `null` e o fechamento
  (Cena 08) não tem link. Preencher em `content.ts` quando definido.
- 17 coleções / 54 criações vêm da auditoria do Yooga de 05/10/2026 e estão rotuladas assim na Cena 03.
- As capturas da Cena 04 (`src/assets/site/`) são do site publicado; recapturar se o site mudar.
- Valores e escopo comercial: só no roteiro interno, a validar pelos sócios.
