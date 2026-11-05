// Copia o build estático da apresentação (apresentacao/dist) para dentro do output do Astro
// (dist/apresentacao), para que um único projeto/deploy Vercel sirva os dois.
import { cpSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.dirname(fileURLToPath(new URL('.', import.meta.url)));
const src = path.join(root, 'apresentacao', 'dist');
const dest = path.join(root, 'dist', 'apresentacao');

if (!existsSync(src)) {
  console.error(`[copy-apresentacao-dist] build não encontrado em ${src}`);
  process.exit(1);
}

cpSync(src, dest, { recursive: true });
console.log(`[copy-apresentacao-dist] copiado ${src} -> ${dest}`);
