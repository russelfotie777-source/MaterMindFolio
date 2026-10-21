'use client';

import pageStyles from '@/styles/page.module.css';

// Îlot minimal : la page reste lisible et imprimable sans lui, par le menu du navigateur.
export function BoutonImprimer() {
  return (
    <button type="button" className={pageStyles.bouton} onClick={() => window.print()}>
      Imprimer cette page
    </button>
  );
}
