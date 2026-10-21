import type { Metadata } from 'next';
import Link from 'next/link';

import { lireProfil } from '@/lib/faits/profil';
import page from '@/styles/page.module.css';

export const metadata: Metadata = { alternates: { canonical: '/' } };

// Accueil (DR-1, vue A01). Le portrait détouré et l'image d'aube arrivent avec le fallback sans Canvas ;
// la phrase d'accroche viendra de content/copy/ quand Codex l'aura livrée et Russel validée.
export default function Accueil() {
  const profil = lireProfil();

  return (
    <div className={page.cadre}>
      <p className={page.etiquette}>
        {profil.intitule} · {profil.base.ville}
      </p>
      <h1 className={page.titreDisplay}>{profil.nomPublic}</h1>
      <p className={page.lead}>{profil.disponibilite}</p>
      <p className={page.actions}>
        <Link className={page.boutonClair} href="/visite">
          Commencer la visite
        </Link>
        <Link className={page.bouton} href="/projets">
          Explorer librement
        </Link>
      </p>
    </div>
  );
}
