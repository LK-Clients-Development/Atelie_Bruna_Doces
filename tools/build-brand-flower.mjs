/**
 * Gera, a partir da logo oficial aprovada (alta resolução), os dados vetoriais da FLOR usados na intro de marca:
 *
 *   node tools/build-brand-flower.mjs <logo-original.webp|png>
 *
 * Saídas:
 *   src/data/brand-flower.ts                               pétalas (path vetorial traçado), miolo, 6 máscaras de "desenho" e
 *                                                          a posição da flor dentro da logo recortada
 *   src/assets/brand/atelie-doces-bruna-logo-sem-flor.png  a logo SEM a flor (a flor vetorial ocupa o lugar do "o")
 *
 * Requer `npm i --no-save potrace` (ferramenta de build; NÃO entra no site nem no package.json).
 *
 * Fidelidade: a flor da logo é ligeiramente assimétrica (arte), então ela NÃO é redesenhada com elipses: a silhueta
 * é TRAÇADA do próprio arquivo oficial (potrace, 6× de supersampling). As máscaras de animação (uma por pétala) seguem
 * o contorno real de cada pétala e só servem para revelar a silhueta como se fosse desenhada; o resultado final é a
 * silhueta traçada, não as máscaras. O script verifica que as máscaras cobrem 100% da tinta.
 */
import { writeFileSync } from 'node:fs';
import sharp from 'sharp';
import potrace from 'potrace';

const SRC = process.argv[2];
if (!SRC) throw new Error('uso: node tools/build-brand-flower.mjs <logo-original>');

// Caixa da flor na logo original (2000×667) e recorte aplicado ao asset de produção (ver docs/qa/brand-logo)
const FLOWER = { x0: 270, y0: 278, x1: 523, y1: 555 }; // tinta laranja
const MARGIN = 6;
const CROP = { left: 79, top: 134, pad: 43 }; // o asset = extract(left, top, 1858×424) + 43 px de respiro
const LOGO_W = 1944, LOGO_H = 510;

const VB = { x: FLOWER.x0 - MARGIN, y: FLOWER.y0 - MARGIN, w: FLOWER.x1 - FLOWER.x0 + 1 + 2 * MARGIN, h: FLOWER.y1 - FLOWER.y0 + 1 + 2 * MARGIN };
const { data, info } = await sharp(SRC).extract({ left: VB.x, top: VB.y, width: VB.w, height: VB.h }).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const W = info.width, H = info.height;

// 1) cobertura da tinta laranja (alfa × "é laranja"), só o componente conectado da flor
const ink = new Float32Array(W * H);
for (let i = 0; i < W * H; i++) {
  const r = data[i * 4], b = data[i * 4 + 2], a = data[i * 4 + 3] / 255;
  ink[i] = r - b > 50 && r > 100 ? a : 0;
}
// centro do miolo: centroide da tinta num raio de 21 px do centro aproximado
let cx = 396.9 - VB.x, cy = 423.2 - VB.y;
for (let it = 0; it < 6; it++) { let sx = 0, sy = 0, sw = 0; for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (Math.hypot(x - cx, y - cy) < 21 && ink[y * W + x] > 0.5) { sx += x; sy += y; sw++; } cx = sx / sw; cy = sy / sw; }
let dotArea = 0;
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (Math.hypot(x - cx, y - cy) < 21.5 && ink[y * W + x] > 0.5) dotArea++;
const dotR = Math.sqrt(dotArea / Math.PI);

// 2) pétalas = tinta fora do miolo (o miolo é um círculo exato)
const petalsInk = new Float32Array(ink);
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (Math.hypot(x - cx, y - cy) < 21.5) petalsInk[y * W + x] = 0;

// 3) traçado vetorial: supersampling 6× + potrace
const SS = 6;
const gray = Buffer.alloc(W * H);
for (let i = 0; i < W * H; i++) gray[i] = Math.round(255 - petalsInk[i] * 255);
const up = await sharp(gray, { raw: { width: W, height: H, channels: 1 } }).resize(W * SS, H * SS, { kernel: 'lanczos3' }).blur(5).png().toBuffer();
const svg = await new Promise((res, rej) => potrace.trace(up, { threshold: 128, turdSize: 200, optTolerance: 1.2, alphaMax: 1, turnPolicy: 'minority' }, (e, s) => (e ? rej(e) : res(s))));
const pathD = svg.match(/<path d="([^"]+)"/)[1];
// potrace devolve coordenadas em pixels da imagem ampliada: volta para a escala do viewBox (÷6) com 2 casas
const scaled = pathD.replace(/-?\d+(\.\d+)?/g, (n) => (+n / SS).toFixed(1).replace(/\.?0+$/, ''));

// 4) máscaras de "desenho": uma por pétala, seguindo o contorno real (raio médio por ângulo em torno do centro da pétala)
const AXES = [90, 30, -30, -90, -150, 150]; // sentido horário a partir do topo
const D = 80; // distância do centro da pétala ao miolo
const masks = [];
for (const deg of AXES) {
  const t = (deg * Math.PI) / 180;
  const pcx = cx + Math.cos(t) * D, pcy = cy - Math.sin(t) * D;
  const toCenter = Math.atan2(cy - pcy, cx - pcx);
  const BIN = 4, N = 360 / BIN; const sum = new Float32Array(N), cnt = new Float32Array(N);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    if (petalsInk[y * W + x] < 0.5) continue;
    const dx = x - cx, dy = cy - y; const r = Math.hypot(dx, dy); if (r < 22) continue;
    let da = Math.atan2(dy, dx) - t; da = Math.atan2(Math.sin(da), Math.cos(da));
    if (Math.abs(da) > (33 * Math.PI) / 180) continue; // cunha de 66° em torno do eixo da pétala
    let phi = Math.atan2(y - pcy, x - pcx) - toCenter; phi = ((phi % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
    const k = Math.min(N - 1, Math.floor(((phi * 180) / Math.PI) / BIN));
    sum[k] += Math.hypot(x - pcx, y - pcy); cnt[k]++;
  }
  const pts = [];
  for (let k = 0; k < N; k++) if (cnt[k] >= 3) { const phi = ((k + 0.5) * BIN * Math.PI) / 180 + toCenter; const r = sum[k] / cnt[k]; pts.push([pcx + Math.cos(phi) * r, pcy + Math.sin(phi) * r]); }
  const d = 'M' + pts.map(([x, y]) => x.toFixed(1) + ' ' + y.toFixed(1)).join('L');
  masks.push({ deg, d, pts: pts.length });
}

// 5) verificação: as máscaras (traço de 30 px) cobrem toda a tinta das pétalas?
const maskSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><rect width="100%" height="100%" fill="black"/>${masks.map((m) => `<path d="${m.d}" fill="none" stroke="white" stroke-width="30" stroke-linecap="round" stroke-linejoin="round"/>`).join('')}</svg>`;
const mk = await sharp(Buffer.from(maskSvg)).greyscale().raw().toBuffer();
let inkPx = 0, covered = 0;
for (let i = 0; i < W * H; i++) if (petalsInk[i] > 0.5) { inkPx++; if (mk[i] > 128) covered++; }
console.log(`miolo: centro (${(cx).toFixed(1)}, ${(cy).toFixed(1)}) raio ${dotR.toFixed(1)}; tinta das pétalas ${inkPx}px; coberta pelas máscaras ${((covered / inkPx) * 100).toFixed(2)}%`);
if (covered / inkPx < 0.995) throw new Error('máscaras não cobrem a tinta');

// 6) logo SEM a flor: apaga a tinta laranja (e 2 px de franja) dentro da caixa da flor
const logo = sharp(SRC).extract({ left: CROP.left, top: CROP.top, width: 1858, height: 424 }).extend({ top: CROP.pad, bottom: CROP.pad, left: CROP.pad, right: CROP.pad, background: { r: 0, g: 0, b: 0, alpha: 0 } }).ensureAlpha();
const { data: ld, info: li } = await logo.raw().toBuffer({ resolveWithObject: true });
const ox = CROP.pad - CROP.left, oy = CROP.pad - CROP.top; // original → asset
const mask = new Uint8Array(li.width * li.height);
for (let y = FLOWER.y0 - 4; y <= FLOWER.y1 + 4; y++) for (let x = FLOWER.x0 - 4; x <= FLOWER.x1 + 4; x++) {
  const ax = x + ox, ay = y + oy; const i = (ay * li.width + ax) * 4; const r = ld[i], b = ld[i + 2];
  if (ld[i + 3] > 0 && r - b > 40 && r > 90) mask[ay * li.width + ax] = 1;
}
const grown = new Uint8Array(mask);
for (let y = 2; y < li.height - 2; y++) for (let x = 2; x < li.width - 2; x++) if (mask[y * li.width + x]) for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) grown[(y + dy) * li.width + x + dx] = 1;
for (let p = 0; p < li.width * li.height; p++) if (grown[p]) { const i = p * 4; if (!(ld[i] < 90)) ld[i + 3] = 0; }
await sharp(ld, { raw: { width: li.width, height: li.height, channels: 4 } }).png({ compressionLevel: 9 }).toFile('src/assets/brand/atelie-doces-bruna-logo-sem-flor.png');

// 7) cor da tinta (amostrada do logo oficial)
let sr = 0, sg = 0, sb = 0, sn = 0;
for (let i = 0; i < W * H; i++) if (ink[i] > 0.95) { sr += data[i * 4]; sg += data[i * 4 + 1]; sb += data[i * 4 + 2]; sn++; }
const color = '#' + [sr, sg, sb].map((v) => Math.round(v / sn).toString(16).padStart(2, '0')).join('');

// posição da flor (viewBox) dentro da logo recortada (asset 1944×510)
const slot = { x: VB.x + ox, y: VB.y + oy, w: VB.w, h: VB.h };

const ts = `/**
 * GERADO por tools/build-brand-flower.mjs a partir da logo oficial: não editar à mão.
 * Flor da marca em vetor (silhueta traçada do arquivo oficial) + máscaras de desenho + posição dentro da logo.
 */
export const BRAND_FLOWER = {
  /** Sistema de coordenadas do SVG da flor. */
  viewBox: '0 0 ${W} ${H}',
  width: ${W},
  height: ${H},
  /** Cor amostrada da tinta da flor na logo oficial. */
  color: '${color}',
  /** Miolo: círculo exato. */
  dot: { cx: ${cx.toFixed(2)}, cy: ${cy.toFixed(2)}, r: ${dotR.toFixed(2)} },
  /** Pétalas: silhueta vetorial (fill-rule evenodd). */
  petals: '${scaled}',
  /** Uma máscara por pétala, sentido horário a partir do topo: traço de ~30 px que só revela a silhueta. */
  masks: ${JSON.stringify(masks.map((m) => m.d))} as readonly string[],
  /** Posição da flor dentro de atelie-doces-bruna-logo-sem-flor.png (${LOGO_W}×${LOGO_H}). */
  slot: { x: ${slot.x}, y: ${slot.y}, w: ${slot.w}, h: ${slot.h}, logoW: ${LOGO_W}, logoH: ${LOGO_H} },
} as const;
`;
writeFileSync('src/data/brand-flower.ts', ts);
console.log('flor:', color, `viewBox ${W}×${H}`, `path ${scaled.length} chars`, 'slot', slot);
