import type { Metadata } from 'next';
import Link from 'next/link';

import { BoutonImprimer } from '@/components/BoutonImprimer';
import { LienExterne } from '@/components/LienExterne';
import { formaterJour, formaterPeriode } from '@/lib/dates';
import { lireProfil } from '@/lib/faits/profil';
import { lireProjets } from '@/lib/faits/projets';
import page from '@/styles/page.module.css';

import styles from './resume.module.css';

export const metadata: Metadata = {
  title: 'Résumé recruteur',
  description: 'MASTERMIND en une page : poste actuel, disponibilité, six projets et contact.',
  alternates: { canonical: '/resume-recruteur' },
};

// Résumé recruteur (DR-1, vue A11) : identité, disponibilité, six projets, parcours, contact.
// Les quatre domaines prouvés attendent leur fait validé ; le lien du CV, son PDF (DR1-R05).
export default function ResumeRecruteur() {
  const profil = lireProfil();
  const { posteActuel } = profil;
  const projets = lireProjets();
  const github = profil.github.replace(/^https:\/\//, '');

  return (
    <div className={page.cadre}>
      <article className={`${page.plaque} ${styles.resume}`}>
        <p className={page.etiquette}>Résumé recruteur</p>
        <h1 className={page.titrePage}>{profil.nomPublic}</h1>
        <p className={`${page.lead} ${page.fort}`}>
          {profil.intitule} · {profil.base.ville}, {profil.base.pays}
        </p>
        <p className={page.attenue}>{profil.disponibilite}</p>

        <div className={page.grille}>
          <section className={page.rubrique}>
            <h2>Poste actuel</h2>
            <p className={page.fort}>
              {posteActuel.intitule} chez {posteActuel.organisation}
            </p>
            <p>
              Depuis le {formaterJour(posteActuel.depuis)} · {posteActuel.dominante}
            </p>
          </section>

          <section className={page.rubrique}>
            <h2>Contact</h2>
            <ul className={page.liste}>
              <li>
                <a className={page.fort} href={`mailto:${profil.email}`}>
                  {profil.email}
                </a>
              </li>
              <li>
                <LienExterne className={page.fort} href={profil.github}>
                  {github}
                </LienExterne>
              </li>
            </ul>
          </section>

          <section className={`${page.rubrique} ${styles.projets}`}>
            <h2>Six produits</h2>
            <ol className={styles.produits}>
              {projets.map((projet) => (
                <li key={projet.slug}>
                  <Link className={page.fort} href={`/projets/${projet.slug}`}>
                    {projet.nom}
                  </Link>
                  <span>{projet.role}</span>
                  <span className={page.attenue}>{formaterPeriode(projet.periode)}</span>
                </li>
              ))}
            </ol>
          </section>
        </div>

        <p className={`${page.actions} ${styles.impression}`}>
          <BoutonImprimer />
        </p>
      </article>
    </div>
  );
}
