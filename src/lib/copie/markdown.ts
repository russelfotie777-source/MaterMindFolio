import 'server-only';

import type { Nodes, Root } from 'mdast';
import { fromMarkdown } from 'mdast-util-from-markdown';

// Copy en CommonMark restreint (contrat, section 3.2), analysée au build et jamais rendue en chaîne HTML.
// Seuls ces nœuds passent : HTML brut, titre, image, code, citation, séparateur, saut de ligne forcé et
// lien par référence font échouer le build. Aucune extension GFM ni frontmatter n'est activée.
const NOEUDS_AUTORISES = new Set<Nodes['type']>([
  'root',
  'paragraph',
  'text',
  'emphasis',
  'strong',
  'list',
  'listItem',
  'inlineCode',
  'link',
]);

export const TAILLE_MAXIMALE = 32 * 1024;

export class CopieInvalide extends Error {}

// Liens admis : https, chemin relatif ou depuis la racine, fragment. Jamais mailto (les coordonnées
// viennent des faits), jamais un autre protocole ni une URL sans protocole (« //hote »).
export function lienAutorise(url: string): boolean {
  if (url.startsWith('#')) return true;
  if (url.startsWith('/')) return !url.startsWith('//');
  if (/^[a-z][a-z0-9+.-]*:/i.test(url)) return URL.canParse(url) && new URL(url).protocol === 'https:';
  return true;
}

function verifier(noeud: Nodes, fichier: string) {
  const ligne = noeud.position?.start.line ?? '?';
  if (!NOEUDS_AUTORISES.has(noeud.type)) {
    throw new CopieInvalide(`${fichier}:${ligne} : nœud « ${noeud.type} » interdit dans la copy.`);
  }
  if (noeud.type === 'link' && !lienAutorise(noeud.url)) {
    throw new CopieInvalide(`${fichier}:${ligne} : lien « ${noeud.url} » refusé.`);
  }
  if ('children' in noeud) for (const enfant of noeud.children) verifier(enfant, fichier);
}

export function analyserCopie(source: string, fichier: string): Root {
  if (new TextEncoder().encode(source).length > TAILLE_MAXIMALE) {
    throw new CopieInvalide(`${fichier} dépasse 32 Kio.`);
  }
  const arbre = fromMarkdown(source);
  if (arbre.children.length === 0) throw new CopieInvalide(`${fichier} est vide.`);
  verifier(arbre, fichier);
  return arbre;
}
