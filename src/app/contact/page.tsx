import type { Metadata } from 'next';

import { CopierAdresse } from '@/components/CopierAdresse';
import { LienExterne } from '@/components/LienExterne';
import { lireProfil } from '@/lib/faits/profil';
import page from '@/styles/page.module.css';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Contacter MASTERMIND, Software Engineer basé à Douala : adresse directe et GitHub.',
  alternates: { canonical: '/contact' },
};

// Contact V1 (contrat, T19 ; DR-1, 03_ECRANS_ETATS, section 5) : canaux directs, aucun formulaire.
export default function Contact() {
  const profil = lireProfil();

  return (
    <div className={page.cadre}>
      <article className={`${page.plaque} ${page.colonne}`}>
        <p className={page.etiquette}>Contact</p>
        <h1 className={page.titrePage}>Me contacter</h1>
        <p className={page.lead}>{profil.disponibilite}</p>

        <div className={page.grille}>
          <section className={page.rubrique}>
            <h2>Adresse</h2>
            <CopierAdresse adresse={profil.email} />
          </section>
          <section className={page.rubrique}>
            <h2>Code</h2>
            <p>
              <LienExterne className={page.fort} href={profil.github}>
                {profil.github.replace(/^https:\/\//, '')}
              </LienExterne>
            </p>
          </section>
        </div>
      </article>
    </div>
  );
}
