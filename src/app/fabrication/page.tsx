import type { Metadata } from 'next';
import Link from 'next/link';

import { LecteurReference } from '@/components/LecteurReference';
import { LienExterne } from '@/components/LienExterne';
import { formaterJour } from '@/lib/dates';
import { lireReferencesMusicales } from '@/lib/faits/musique';
import { lireProjets } from '@/lib/faits/projets';
import { lireDerives } from '@/lib/media';
import page from '@/styles/page.module.css';

import styles from './fabrication.module.css';

export const metadata: Metadata = {
  title: 'Sources & fabrication',
  description: 'Les sources des faits et des actifs publiés sur le portfolio de MASTERMIND.',
  alternates: { canonical: '/fabrication' },
};

const ko = (octets: number) => `${Math.round(octets / 1000)} Ko`;

// Sources & fabrication (DR-1, vue A13 et 05_ACTIFS_DROITS) : chaque dérivé publié avec son identifiant,
// son origine, ses formats et son poids ; une image générée est toujours déclarée comme telle.
export default function Fabrication() {
  const projets = lireProjets();
  const morceaux = lireReferencesMusicales();
  const images = lireDerives().map(([id, derive]) => {
    const fichiers = [...derive.fichiers.avif, ...derive.fichiers.webp];
    const poids = fichiers.map((f) => f.octets);
    return { id, ...derive, total: fichiers.length, min: Math.min(...poids), max: Math.max(...poids) };
  });

  return (
    <div className={page.cadre}>
      <p className={page.etiquette}>Colophon</p>
      <h1 className={page.titrePage}>Sources &amp; fabrication</h1>

      <section className={`${page.rubrique} ${styles.bloc}`}>
        <h2>Images</h2>
        <ul className={`${page.liste} ${styles.images}`}>
          {images.map((image) => (
            <li key={image.id}>
              <p className={page.fort}>
                {image.registre}
                {image.genere && <span className={styles.genere}>Image générée</span>}
              </p>
              <p>{image.credit}</p>
              <p className={page.attenue}>
                Cadre de {image.largeur} × {image.hauteur} px · {image.total} fichiers AVIF et WebP de{' '}
                {ko(image.min)} à {ko(image.max)}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {morceaux.length > 0 && (
        <section className={`${page.rubrique} ${styles.bloc}`}>
          <h2>Morceaux de référence</h2>
          <p className={page.attenue}>
            Ils ont inspiré la direction sonore ; ils ne sont ni utilisés ni imités sur le site.
          </p>
          <ul className={`${page.liste} ${styles.morceaux}`}>
            {morceaux.map((morceau) => (
              <li key={morceau.id}>
                <p className={page.fort}>{morceau.titre}</p>
                <p className={page.attenue}>
                  {morceau.compositeur} · {morceau.oeuvre} ({morceau.annee})
                </p>
                {morceau.publication.genre === 'youtube' ? (
                  <LecteurReference titre={morceau.titre} videoId={morceau.publication.videoId} />
                ) : (
                  <p>
                    <LienExterne href={morceau.publication.url}>{morceau.publication.libelle}</LienExterne>
                  </p>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

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
