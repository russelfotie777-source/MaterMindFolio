import type { Metadata } from 'next';
import Link from 'next/link';

import page from '@/styles/page.module.css';

export const metadata: Metadata = { title: 'Page introuvable' };

// 404 (DR-1, 03_ECRANS_ETATS, section 5) : message clair et routes utiles, sans Canvas.
export default function PageIntrouvable() {
  return (
    <div className={page.cadre}>
      <p className={page.etiquette}>Erreur 404</p>
      <h1 className={page.titrePage}>Page introuvable</h1>
      <p className={page.lead}>Cette adresse ne correspond à aucune page du site.</p>
      <p className={page.actions}>
        <Link className={page.boutonClair} href="/projets">
          Les six projets
        </Link>
        <Link className={page.bouton} href="/resume-recruteur">
          Résumé recruteur
        </Link>
        <Link className={page.bouton} href="/contact">
          Contact
        </Link>
      </p>
    </div>
  );
}
