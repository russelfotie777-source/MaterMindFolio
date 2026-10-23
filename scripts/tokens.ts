// Génère src/styles/tokens.css depuis design/contracts/tokens.json (DTCG 2025.10), sans dépendance
// (contrat, section 3.1, point 4). `--check` échoue si le fichier commité diffère de la génération.
import { readFileSync, writeFileSync } from 'node:fs';

const SOURCE = 'design/contracts/tokens.json';
const TARGET = 'src/styles/tokens.css';

type Json = null | boolean | number | string | Json[] | { [key: string]: Json };
type Token = { path: string[]; type: string; value: Json };

function collect(node: Json, path: string[], inheritedType: string | undefined, out: Token[]) {
  if (node === null || typeof node !== 'object' || Array.isArray(node)) return;
  const type = typeof node.$type === 'string' ? node.$type : inheritedType;
  if ('$value' in node) {
    if (!type) throw new Error(`Jeton sans type : ${path.join('.')}`);
    out.push({ path, type, value: node.$value ?? null });
    return;
  }
  for (const [key, child] of Object.entries(node)) {
    if (!key.startsWith('$')) collect(child, [...path, key], type, out);
  }
}

const variable = (path: string[]) => `--${path.join('-')}`;

function cssValue({ path, type, value }: Token): string {
  const where = path.join('.');
  if (typeof value === 'string') {
    const alias = /^\{([^}]+)\}$/.exec(value);
    if (alias?.[1]) return `var(${variable(alias[1].split('.'))})`;
  }
  switch (type) {
    case 'color': {
      const color = value as { hex?: string; components?: number[]; alpha?: number };
      if (color.alpha === undefined || color.alpha === 1) {
        if (!color.hex) throw new Error(`Couleur sans hex : ${where}`);
        return color.hex;
      }
      const [r, g, b] = (color.components ?? []).map((c) => Math.round(c * 255));
      return `rgb(${r} ${g} ${b} / ${color.alpha})`;
    }
    case 'dimension':
    case 'duration': {
      const { value: amount, unit } = value as { value: number; unit: string };
      return `${amount}${unit}`;
    }
    case 'cubicBezier':
      return `cubic-bezier(${(value as number[]).join(', ')})`;
    case 'fontFamily':
      return (Array.isArray(value) ? value : [value])
        .map((name) => (/^[a-z-]+$/.test(String(name)) ? String(name) : `"${String(name)}"`))
        .join(', ');
    case 'fontWeight':
    case 'number':
      return String(value);
    default:
      throw new Error(`Type de jeton non pris en charge : ${type} (${where})`);
  }
}

const tokens: Token[] = [];
collect(JSON.parse(readFileSync(SOURCE, 'utf8')) as Json, [], undefined, tokens);

const css = [
  `/* Généré par scripts/tokens.ts depuis ${SOURCE}. Ne pas modifier à la main : relancer \`pnpm tokens\`. */`,
  ':root {',
  ...tokens.map((token) => `  ${variable(token.path)}: ${cssValue(token)};`),
  '}',
  '',
].join('\n');

if (process.argv.includes('--check')) {
  if (readFileSync(TARGET, 'utf8') !== css) {
    console.error(`${TARGET} ne correspond plus à ${SOURCE} : lancez \`pnpm tokens\`.`);
    process.exit(1);
  }
  console.log(`${TARGET} à jour (${tokens.length} jetons).`);
} else {
  writeFileSync(TARGET, css);
  console.log(`${TARGET} généré (${tokens.length} jetons).`);
}
