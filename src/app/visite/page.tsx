import type { Metadata } from 'next';
import Link from 'next/link';

import { lireProjets } from '@/lib/faits/projets';
import { PLATEFORMES, rangSurSix } from '@/lib/libelles';
import page from '@/styles/page.module.css';

import styles from './visite.module.css';

export const metadata: Metadata = {
  title: 'Visite',
  description: 'La visite des six projets de MASTERMIND, station par station.',
  alternates: { canonical: '/visite' },
};

// Version légère de la visite (DR-1, vues A04 et A05 sans WebGL) : l'index DOM des six stations.
// L'îlot immersif (G3) s'ajoutera devant cet index, qui reste la navigation sans Canvas.
export default function Visite() {
  const projets = lireProjets();

  return (
    <div className={page.cadre}>
      <p className={page.etiquette}>Visite · version légère</p>
      <h1 className={page.titrePage}>Six stations</h1>
      <ol className={styles.stations}>
        {projets.map((projet) => (
          <li key={projet.slug} className={styles.station}>
            <p className={page.etiquette}>
              {rangSurSix(projet.rang)} · {projet.plateformes.map((p) => PLATEFORMES[p]).join(' · ')}
            </p>
            <h2 className={styles.nom}>{projet.nom}</h2>
            <p className={page.fort}>{projet.role}</p>
            <p className={page.attenue}>{projet.perimetre.join(' · ')}</p>
            <p>
              <Link className={page.boutonClair} href={`/projets/${projet.slug}`}>
                Voir l’étude de cas<span className="visuellement-cache"> : {projet.nom}</span>
              </Link>
            </p>
          </li>
        ))}
      </ol>
      <p className={page.actions}>
        <Link href="/">Retour à l’accueil</Link>
      </p>
    </div>
  );
}
