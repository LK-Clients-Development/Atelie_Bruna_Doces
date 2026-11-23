/**
 * Dev único: sobe o site (Astro, :4321) e a apresentação (Vite, :5183) juntos.
 *
 * O Astro repassa /apresentacao/* para o Vite da apresentação (proxy em astro.config.mjs),
 * então em desenvolvimento valem as mesmas URLs de produção: http://localhost:4321/apresentacao/.
 * Ctrl+C encerra os dois.
 */
import { spawn, spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(import.meta.url), '..', '..');
const isWindows = process.platform === 'win32';
const children = [];
let shuttingDown = false;

function start(name, script, cwd) {
  // shell: true — `npm` é um .cmd no Windows. Comando em uma string só (fixo, definido aqui)
  // para evitar o aviso DEP0190 do Node. `detached` no POSIX para matar o grupo inteiro depois.
  const child = spawn(`npm run ${script}`, { cwd, stdio: 'inherit', shell: true, detached: !isWindows });
  children.push(child);
  child.on('exit', (code) => {
    if (shuttingDown) return;
    console.error(`\n✖ ${name} encerrou (código ${code}). Encerrando o resto.`);
    shutdown(code || 1);
  });
}

function stop(child) {
  if (child.exitCode !== null || child.pid === undefined) return;
  if (isWindows) {
    // /T mata a árvore (npm → node), /F força
    spawnSync('taskkill', ['/pid', String(child.pid), '/t', '/f'], { stdio: 'ignore' });
  } else {
    try {
      process.kill(-child.pid, 'SIGTERM');
    } catch {
      /* já encerrou */
    }
  }
}

function shutdown(code = 0) {
  if (shuttingDown) return;
  shuttingDown = true;
  children.forEach(stop);
  process.exit(code);
}

process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));
process.on('exit', () => children.forEach(stop));

start('apresentação (Vite)', 'dev', resolve(root, 'apresentacao'));
start('site (Astro)', 'dev:site', root);
