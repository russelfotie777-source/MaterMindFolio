import type { Metadata } from 'next';
import Link from 'next/link';

import { Copie } from '@/components/Copie';
import { lireCopieSite } from '@/lib/copie/site';
import { formaterJour, formaterMois, formaterPeriode } from '@/lib/dates';
import { lireProfil } from '@/lib/faits/profil';
import { lireProjets } from '@/lib/faits/projets';
import page from '@/styles/page.module.css';

import styles from './parcours.module.css';

export const metadata: Metadata = {
  title: 'Parcours',
  description: 'Le parcours de MASTERMIND, projet par projet, avec les dates et responsabilités validées.',
  alternates: { canonical: '/parcours' },
};

// Parcours (DR-1, vue A09) : seules les dates et responsabilités validées apparaissent.
export default function Parcours() {
  const copieSite = lireCopieSite();
  const { posteActuel } = lireProfil();
  const projets = [...lireProjets()].sort((a, b) => a.periode.debut.localeCompare(b.periode.debut));

  return (
    <div className={page.cadre}>
      <p className={page.etiquette}>Parcours · dates validées</p>
      <h1 className={page.titrePage}>Parcours</h1>
      {copieSite.parcours && <Copie arbre={copieSite.parcours} className={page.lead} />}
      <p className={page.lead}>
        {posteActuel.intitule} chez {posteActuel.organisation}, à {posteActuel.ville}, depuis le{' '}
        {formaterJour(posteActuel.depuis)}.
      </p>

      <ol className={styles.chronologie}>
        {projets.map((projet) => (
          <li key={projet.slug} className={styles.etape}>
            <p className={page.etiquette}>
              <time dateTime={projet.periode.debut}>{formaterMois(projet.periode.debut)}</time>
              {projet.periode.approximative && ' environ'}
            </p>
            <h2 className={styles.nom}>
              <Link href={`/projets/${projet.slug}`}>{projet.nom}</Link>
            </h2>
            <p>{projet.role}</p>
            <p className={page.attenue}>
              {projet.organisation.nom} · {formaterPeriode(projet.periode)}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}
