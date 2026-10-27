import type { Metadata } from 'next';
import Link from 'next/link';

import { Fleche } from '@/components/Cartouche';
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

// Registre de poids égal (DR-1, 03_ECRANS_ETATS, section 5) : même ligne, même contenu, aucun badge. Pas de
// cartes (décision de Russel du 25 octobre 2026) : un index des six îles, dont chaque ligne entière mène
// à l'étude de cas ; au survol, un trait de lumière la souligne.
export default function Projets() {
  const projets = lireProjets();

  return (
    <div className={page.cadre}>
      <p className={page.etiquette}>Projets</p>
      <h1 className={page.titrePage}>Registre des six projets</h1>
      <ol role="list" className={styles.registre}>
        {projets.map((projet) => (
          <li key={projet.slug} className={styles.ligne} data-appel>
            <p className={styles.rang}>{rangSurSix(projet.rang)}</p>
            <h2 className={styles.nom}>
              <Link href={`/projets/${projet.slug}`}>{projet.nom}</Link>
            </h2>
            <p className={styles.role}>{projet.role}</p>
            <p className={styles.details}>
              {projet.statut} · {formaterPeriode(projet.periode)} ·{' '}
              {projet.plateformes.map((p) => PLATEFORMES[p]).join(' · ')}
            </p>
            <span className={styles.fleche}>
              <Fleche />
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
