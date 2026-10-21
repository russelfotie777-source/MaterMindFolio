// Build de production en deux passes pour une CSP stricte sans 'unsafe-inline' (ADR-003).
// Passe 1 : build normal. Les scripts en ligne de Next.js (amorce et données RSC) sont relevés
// dans chaque page HTML prérendue et leurs empreintes SHA-256 sont écrites dans .next-csp/.
// Passe 2 : build identique, next.config.ts ajoute ces empreintes à script-src.
// Contrôle : les empreintes de la passe 2 doivent être exactement celles de la passe 1.
import { execFileSync } from 'node:child_process';
import { createHash, randomUUID } from 'node:crypto';
import { mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const HASH_FILE = '.next-csp/script-hashes.json';
const INLINE_SCRIPT = /<script\b(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g;

function htmlFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return htmlFiles(path);
    return entry.name.endsWith('.html') ? [path] : [];
  });
}

function inlineScriptHashes(): string[] {
  const hashes = new Set<string>();
  for (const file of htmlFiles('.next/server/app')) {
    for (const [, body] of readFileSync(file, 'utf8').matchAll(INLINE_SCRIPT)) {
      if (body) hashes.add(`'sha256-${createHash('sha256').update(body).digest('base64')}'`);
    }
  }
  return [...hashes].sort();
}

function nextBuild(env: NodeJS.ProcessEnv) {
  execFileSync('next', ['build'], { stdio: 'inherit', env });
}

// Même identifiant de build pour les deux passes : il figure dans les données RSC en ligne.
const buildId = process.env.VERCEL_GIT_COMMIT_SHA ?? `local-${randomUUID()}`;
const env = { ...process.env, H237_BUILD_ID: buildId };

rmSync('.next-csp', { recursive: true, force: true });
nextBuild(env);
const first = inlineScriptHashes();
mkdirSync('.next-csp', { recursive: true });
writeFileSync(HASH_FILE, `${JSON.stringify(first, null, 2)}\n`);

nextBuild(env);
const second = inlineScriptHashes();
if (JSON.stringify(first) !== JSON.stringify(second)) {
  console.error('CSP : les scripts en ligne ont changé entre les deux passes ; build refusé.');
  process.exit(1);
}
console.log(`CSP : ${second.length} empreintes de scripts en ligne ajoutées à script-src.`);
