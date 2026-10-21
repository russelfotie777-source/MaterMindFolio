import type { Nodes, Root } from 'mdast';
import Link from 'next/link';
import type { ReactNode } from 'react';

import { LienExterne } from '@/components/LienExterne';

// Rendu serveur de la copy validée (contrat, section 3.1, point 12) : chaque nœud admis devient un
// élément React ; aucune chaîne HTML n'est injectée. Les nœuds ont été filtrés par analyserCopie.
function rendre(noeud: Nodes, cle: number): ReactNode {
  switch (noeud.type) {
    case 'text':
      return noeud.value;
    case 'paragraph':
      return <p key={cle}>{noeud.children.map(rendre)}</p>;
    case 'emphasis':
      return <em key={cle}>{noeud.children.map(rendre)}</em>;
    case 'strong':
      return <strong key={cle}>{noeud.children.map(rendre)}</strong>;
    case 'inlineCode':
      return <code key={cle}>{noeud.value}</code>;
    case 'list':
      return noeud.ordered ? (
        <ol key={cle} start={noeud.start ?? undefined}>
          {noeud.children.map(rendre)}
        </ol>
      ) : (
        <ul key={cle}>{noeud.children.map(rendre)}</ul>
      );
    case 'listItem':
      return <li key={cle}>{noeud.children.map(rendre)}</li>;
    case 'link': {
      const enfants = noeud.children.map(rendre);
      return /^https:/i.test(noeud.url) ? (
        <LienExterne key={cle} href={noeud.url}>
          {enfants}
        </LienExterne>
      ) : (
        <Link key={cle} href={noeud.url}>
          {enfants}
        </Link>
      );
    }
    default:
      throw new Error(`Nœud de copy non rendu : ${noeud.type}.`);
  }
}

export function Copie({ arbre, className }: { arbre: Root; className?: string | undefined }) {
  return <div className={className}>{arbre.children.map(rendre)}</div>;
}
