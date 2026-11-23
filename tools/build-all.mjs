/**
 * Build único: site Astro (raiz) + apresentação comercial (apresentacao/) num só `dist/`.
 *
 *   1. compila a apresentação  → apresentacao/dist   (Vite, base '/apresentacao/')
 *   2. compila o site          → dist                (Astro; limpa o dist a cada build)
 *   3. copia a apresentação    → dist/apresentacao   (servida em /apresentacao/)
 *
 * Um projeto Vercel só, um domínio só. Sem Vercel Services, sem segundo projeto.
 * Rodar: `npm run build` (usado também pela Vercel, ver vercel.json).
 */
import { spawnSync } from 'node:child_process';
import { cpSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(import.meta.url), '..', '..');
const presentationDir = resolve(root, 'apresentacao');

function run(label, args, cwd) {
  console.log(`\n▸ ${label}`);
  // shell: true — `npm` é um .cmd no Windows e não executa direto via spawn. Comando em uma
  // única string (args fixos, definidos neste arquivo) para evitar o aviso DEP0190 do Node.
  const result = spawnSync(`npm ${args.join(' ')}`, { cwd, stdio: 'inherit', shell: true });
  if (result.status !== 0) {
    console.error(`\n✖ Falhou: ${label}`);
    process.exit(result.status ?? 1);
  }
}

run('apresentação (Vite)', ['run', 'build'], presentationDir);
run('site (Astro)', ['run', 'build:site'], root);

const from = resolve(presentationDir, 'dist');
const to = resolve(root, 'dist', 'apresentacao');
if (!existsSync(resolve(from, 'index.html'))) {
  console.error(`\n✖ ${from} não tem index.html. A apresentação não foi gerada.`);
  process.exit(1);
}
cpSync(from, to, { recursive: true });
console.log(`\n✔ apresentação copiada para ${to}`);
