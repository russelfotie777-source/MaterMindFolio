// Build de production en deux passes pour une CSP stricte sans 'unsafe-inline' (ADR-003).
// Passe 1 : build normal. Les scripts en ligne de Next.js (amorce et données RSC) sont relevés
// dans chaque page HTML prérendue et leurs empreintes SHA-256 sont écrites dans .next-csp/.
// Passe 2 : build identique, next.config.ts ajoute ces empreintes à script-src.
// Contrôle : les empreintes de la passe 2 doivent être exactement celles de la passe 1.
// Gardes : aucun module réservé au serveur (Zod, parseur Markdown) dans les chunks clients, et aucun
// fait privé dans le HTML, les données RSC ou les chunks clients (docs/architecture/SCHEMAS_G1.md, section 5).
import { execFileSync } from 'node:child_process';
import { createHash, randomUUID } from 'node:crypto';
import { mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { brotliCompressSync, constants } from 'node:zlib';

const HASH_FILE = '.next-csp/script-hashes.json';
const INLINE_SCRIPT = /<script\b(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g;
// Noms de classes conservés par la minification ; contrat, section 3.1, point 12.
const SERVER_ONLY_MARKERS = ['ZodError', '$ZodType', 'micromark'];

function files(dir: string, extension: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return files(path, extension);
    return entry.name.endsWith(extension) ? [path] : [];
  });
}

type Json = null | boolean | number | string | Json[] | { [key: string]: Json };

function strings(value: Json): string[] {
  if (typeof value === 'string') return [value];
  if (value === null || typeof value !== 'object') return [];
  return (Array.isArray(value) ? value : Object.values(value)).flatMap(strings);
}

// Textes des faits privés, sous leurs formes brute, échappée JSON (données RSC) et échappée HTML,
// cherchés comme mots entiers : un prénom court comme « Iris » est contrôlé sans faux positif dans « Paris ».
function privateTexts(): { text: string; pattern: RegExp }[] {
  const texts = files('content/facts', '.json').flatMap((file) => {
    const { facts } = JSON.parse(readFileSync(file, 'utf8')) as {
      facts: Record<string, { visibility: string; value: Json }>;
    };
    return Object.values(facts).flatMap((fact) => (fact.visibility === 'private' ? strings(fact.value) : []));
  });
  const html = (text: string) =>
    text
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll("'", '&#x27;')
      .replaceAll('"', '&quot;');
  const escape = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return [...new Set(texts.map((text) => text.trim()).filter((text) => text.length >= 2))].map((text) => {
    const forms = [...new Set([text, JSON.stringify(text).slice(1, -1), html(text)])].map(escape);
    return { text, pattern: new RegExp(`(?<![\\p{L}\\p{N}])(?:${forms.join('|')})(?![\\p{L}\\p{N}])`, 'u') };
  });
}

function inlineScriptHashes(): string[] {
  const hashes = new Set<string>();
  for (const file of files('.next/server/app', '.html')) {
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

const leaks = files('.next/static', '.js').filter((file) => {
  const code = readFileSync(file, 'utf8');
  return SERVER_ONLY_MARKERS.some((marker) => code.includes(marker));
});
if (leaks.length > 0) {
  console.error(`Module réservé au serveur dans les chunks clients : ${leaks.join(', ')} ; build refusé.`);
  process.exit(1);
}
console.log('Chunks clients : aucun module réservé au serveur.');

const secrets = privateTexts();
const published = [
  ...files('.next/server/app', '.html'),
  ...files('.next/server/app', '.rsc'),
  ...files('.next/static', '.js'),
];
const exposed = published.flatMap((file) => {
  const content = readFileSync(file, 'utf8');
  return secrets.filter(({ pattern }) => pattern.test(content)).map(({ text }) => `${file} : « ${text} »`);
});
if (exposed.length > 0) {
  console.error(`Fait privé publié :\n${exposed.join('\n')}\nBuild refusé.`);
  process.exit(1);
}
console.log(`Faits privés : aucun des ${secrets.length} textes contrôlés n'est publié.`);

// Budget de l'îlot immersif (contrat, section 7 ; ADR-004, section 4) : 290 Ko en Brotli q5, la
// compression réaliste d'un CDN, pour les chunks de la scène (Three.js, R3F, GSAP et code du monde).
const BUDGET_ILOT = 290_000;
const ilot = files('.next/static', '.js').filter((file) =>
  readFileSync(file, 'utf8').includes('WebGLRenderer'),
);
const poidsIlot = ilot.reduce(
  (total, file) =>
    total +
    brotliCompressSync(readFileSync(file), { params: { [constants.BROTLI_PARAM_QUALITY]: 5 } }).length,
  0,
);
if (poidsIlot > BUDGET_ILOT) {
  console.error(
    `Îlot immersif : ${Math.round(poidsIlot / 1000)} Ko en Brotli q5, au-delà de 290 Ko ; build refusé.`,
  );
  process.exit(1);
}
console.log(
  `Îlot immersif : ${Math.round(poidsIlot / 1000)} Ko en Brotli q5 sur 290 Ko (${ilot.length} chunk).`,
);
