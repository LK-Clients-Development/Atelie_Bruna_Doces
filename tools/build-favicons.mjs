/**
 * Gera os favicons a partir da FLOR da marca (somente o símbolo, sem o texto da logo):
 *
 *   node tools/build-favicons.mjs
 *
 * Fonte: src/data/brand-flower.ts, a silhueta da flor TRAÇADA da logo oficial (tools/build-brand-flower.mjs, potrace).
 * Nada é redesenhado aqui: o mesmo path e a mesma cor (#974412) da intro de marca, só enquadrados num quadrado.
 *
 * Saídas em public/ (servidas na raiz do site):
 *   favicon.svg           vetor, fundo transparente
 *   favicon-32x32.png     32×32, fundo transparente
 *   favicon.ico           16, 32 e 48 px (PNG embutido), fundo transparente
 *   apple-touch-icon.png  180×180 sobre o creme da marca (o iOS não aceita transparência: ficaria preto)
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { BRAND_FLOWER as F } from '../src/data/brand-flower.ts';

const root = resolve(fileURLToPath(import.meta.url), '..', '..');
const out = resolve(root, 'public');
mkdirSync(out, { recursive: true });

const CREAM = '#fbf3eb'; // --color-cream-100

// quadrado centrado na flor (266×290), com ~8 px de respiro
const SIDE = F.height + 16;
const vbX = F.width / 2 - SIDE / 2;
const vbY = -8;

const flower = `<path d="${F.petals}" fill="${F.color}" fill-rule="evenodd"/><circle cx="${F.dot.cx}" cy="${F.dot.cy}" r="${F.dot.r}" fill="${F.color}"/>`;
const svg = (extraBg = '') =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vbX} ${vbY} ${SIDE} ${SIDE}" width="${SIDE}" height="${SIDE}">${extraBg}${flower}</svg>\n`;

writeFileSync(resolve(out, 'favicon.svg'), svg());

const render = (size, markup = svg()) => sharp(Buffer.from(markup), { density: Math.ceil((72 * size * 4) / SIDE) }).resize(size, size).png({ compressionLevel: 9 }).toBuffer();

writeFileSync(resolve(out, 'favicon-32x32.png'), await render(32));

// apple-touch-icon: flor a ~64% da altura, centrada sobre o creme
const apple = 180;
const inner = Math.round(apple * 0.64);
const flowerPng = await render(inner);
writeFileSync(
  resolve(out, 'apple-touch-icon.png'),
  await sharp({ create: { width: apple, height: apple, channels: 4, background: CREAM } })
    .composite([{ input: flowerPng, left: Math.round((apple - inner) / 2), top: Math.round((apple - inner) / 2) }])
    .png({ compressionLevel: 9 })
    .toBuffer(),
);

// favicon.ico: cabeçalho + entradas com PNG embutido
const sizes = [16, 32, 48];
const pngs = await Promise.all(sizes.map((s) => render(s)));
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0); // reservado
header.writeUInt16LE(1, 2); // tipo: ícone
header.writeUInt16LE(sizes.length, 4);
let offset = 6 + 16 * sizes.length;
const entries = sizes.map((s, i) => {
  const e = Buffer.alloc(16);
  e.writeUInt8(s, 0); // largura
  e.writeUInt8(s, 1); // altura
  e.writeUInt8(0, 2); // paleta
  e.writeUInt8(0, 3);
  e.writeUInt16LE(1, 4); // planos
  e.writeUInt16LE(32, 6); // bits por pixel
  e.writeUInt32LE(pngs[i].length, 8);
  e.writeUInt32LE(offset, 12);
  offset += pngs[i].length;
  return e;
});
writeFileSync(resolve(out, 'favicon.ico'), Buffer.concat([header, ...entries, ...pngs]));

console.log('OK: favicon.svg, favicon-32x32.png, apple-touch-icon.png, favicon.ico em public/');
