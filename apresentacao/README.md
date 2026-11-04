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

Copie `.env.example` para `.env` se quiser habilitar o botão "Explorar o site" da Cena 04:

```
VITE_SITE_URL=https://seu-dominio-publicado.com
```

Sem essa variável, a cena mostra um aviso neutro em vez de um botão que não funciona — nunca uma
URL inventada.

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

- `VITE_SITE_URL` não está definida: o botão "Explorar o site" (Cena 04) fica oculto até existir um
  domínio publicado.
- Os mockups de desktop/mobile da Cena 04 são uma composição estilizada (logo + foto real + texto do
  Hero), não capturas de tela literais — ainda não há screenshots do site aprovados para uso aqui.
- Os números da Cena 03 (17 categorias, 54 produtos) são um levantamento anterior do cardápio Yooga,
  marcado como tal na própria cena — não uma garantia de volume atual.
- Os números da Cena 06 são fictícios e identificados como demonstração conceitual.
