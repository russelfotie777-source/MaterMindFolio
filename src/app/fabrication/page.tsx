import type { Metadata } from 'next';
import Link from 'next/link';

import { LienExterne } from '@/components/LienExterne';
import { formaterJour } from '@/lib/dates';
import { lireProjets } from '@/lib/faits/projets';
import page from '@/styles/page.module.css';

import styles from './fabrication.module.css';

export const metadata: Metadata = {
  title: 'Sources & fabrication',
  description: 'Les sources des faits et des actifs publiés sur le portfolio de MASTERMIND.',
  alternates: { canonical: '/fabrication' },
};

// Sources & fabrication (DR-1, vue A13). Les autres actifs (décor, portrait, 3D) s'ajouteront avec
// leur identifiant, leur licence et leur poids quand leurs dérivés seront publiés.
export default function Fabrication() {
  const projets = lireProjets();

  return (
    <div className={page.cadre}>
      <p className={page.etiquette}>Colophon</p>
      <h1 className={page.titrePage}>Sources &amp; fabrication</h1>

      <section className={`${page.rubrique} ${styles.bloc}`}>
        <h2>Typographie</h2>
        <p>
          DM Sans, par The DM Sans Project Authors, sous{' '}
          <a href="/fonts/OFL-DM-Sans.txt">licence SIL Open Font License 1.1</a>.
        </p>
        <p className={page.attenue}>
          Fichier officiel de Google Fonts réduit au jeu latin du français et aux graisses 400 à 600, sans
          modification des glyphes : 33 Ko en WOFF2.
        </p>
      </section>

      <section className={`${page.rubrique} ${styles.bloc}`}>
        <h2>Sources des faits</h2>
        <div className={styles.registre}>
          {projets.map((projet) => (
            <section key={projet.slug} className={page.rubrique}>
              <h3 className={page.fort}>
                <Link href={`/projets/${projet.slug}`}>{projet.nom}</Link>
              </h3>
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
      </section>
    </div>
  );
}
