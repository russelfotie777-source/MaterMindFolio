import type { Metadata } from 'next';
import Link from 'next/link';

import { LienExterne } from '@/components/LienExterne';
import { formaterJour } from '@/lib/dates';
import { lireProjets } from '@/lib/faits/projets';
import page from '@/styles/page.module.css';

import styles from './fabrication.module.css';

export const metadata: Metadata = {
  title: 'Sources & fabrication',
  description: 'Les sources des faits publiés sur le portfolio de MASTERMIND, projet par projet.',
  alternates: { canonical: '/fabrication' },
};

// Sources & fabrication (DR-1, vue A13). Les actifs (décor, portrait, police, 3D) s'ajouteront avec
// leur identifiant, leur licence et leur poids quand leurs dérivés seront publiés.
export default function Fabrication() {
  const projets = lireProjets();

  return (
    <div className={page.cadre}>
      <p className={page.etiquette}>Sources &amp; fabrication</p>
      <h1 className={page.titrePage}>Sources des faits</h1>
      <div className={styles.registre}>
        {projets.map((projet) => (
          <section key={projet.slug} className={page.rubrique}>
            <h2>
              <Link href={`/projets/${projet.slug}`}>{projet.nom}</Link>
            </h2>
            <ul className={page.liste}>
              {projet.sources.map((source) => (
                <li key={source.libelle}>
                  {source.url ? (
                    <LienExterne href={source.url}>{source.libelle}</LienExterne>
                  ) : (
                    source.libelle
                  )}
                  <span className={page.attenue}> · vérifiée le {formaterJour(source.verifieeLe)}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
