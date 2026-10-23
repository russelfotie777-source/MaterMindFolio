import type { Metadata } from 'next';
import Link from 'next/link';

import { formaterPeriode } from '@/lib/dates';
import { lireProjets } from '@/lib/faits/projets';
import { PLATEFORMES, rangSurSix } from '@/lib/libelles';
import page from '@/styles/page.module.css';

import styles from './projets.module.css';

export const metadata: Metadata = {
  title: 'Projets',
  description: 'Les six projets de MASTERMIND : rôle, périmètre, période et preuves publiques.',
  alternates: { canonical: '/projets' },
};

// Registre de poids égal (DR-1, 03_ECRANS_ETATS, section 5) : même carte, même contenu, aucun badge.
export default function Projets() {
  const projets = lireProjets();

  return (
    <div className={page.cadre}>
      <p className={page.etiquette}>Projets</p>
      <h1 className={page.titrePage}>Registre des six projets</h1>
      <ol className={styles.registre}>
        {projets.map((projet) => (
          <li key={projet.slug} className={styles.carte}>
            <p className={page.etiquette}>{rangSurSix(projet.rang)}</p>
            <h2 className={styles.nom}>
              <Link href={`/projets/${projet.slug}`}>{projet.nom}</Link>
            </h2>
            <p>{projet.role}</p>
            <p className={page.attenue}>{projet.statut}</p>
            <p className={page.attenue}>
              {formaterPeriode(projet.periode)} · {projet.plateformes.map((p) => PLATEFORMES[p]).join(' · ')}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}
