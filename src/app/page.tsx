import type { Metadata } from 'next';
import Link from 'next/link';
import { Fragment } from 'react';
import { preload } from 'react-dom';

import { Copie } from '@/components/Copie';
import { MediaProjet } from '@/components/MediaProjet';
import { Visuel } from '@/components/Visuel';
import { lireCopieSite } from '@/lib/copie/site';
import { lireProfil } from '@/lib/faits/profil';
import { lireProjets } from '@/lib/faits/projets';
import { PLATEFORMES, rangSurSix } from '@/lib/libelles';
import { lireDerive } from '@/lib/media';
import page from '@/styles/page.module.css';

import styles from './accueil.module.css';

export const metadata: Metadata = { alternates: { canonical: '/' } };

const TAILLES_PORTRAIT = '(min-width: 768px) min(52vw, 46rem), 92vw';

// Accueil : un univers 3D dès l'entrée (décision de Russel du 24 octobre 2026). Le monde, monté par la
// mise en page, est un canvas fixe derrière le site ; chaque section de cette page est une étape de son chemin : l'ouverture au-dessus
// de la mer de nuages, puis les six îles des projets, puis le final face au Fuji. Le HTML porte tout le
// contenu et reste complet sans WebGL : décor d'aube, portrait et captures réelles prennent alors le relais.
// Flèche des appels : un cercle tracé du rose de la trace, qui se remplit au survol.
function Fleche({ vers = 'droite' }: { vers?: 'droite' | 'bas' }) {
  return (
    <span className={styles.rond} aria-hidden="true">
      <svg viewBox="0 0 24 24" focusable="false">
        <path d={vers === 'bas' ? 'M12 4v15M6 13l6 6 6-6' : 'M4 12h15M13 6l6 6-6 6'} />
      </svg>
    </span>
  );
}

export default function Accueil() {
  const profil = lireProfil();
  const { accueil } = lireCopieSite();
  const projets = lireProjets();
  const portrait = lireDerive('portrait-buste').fichiers.avif;
  // Unique image préchargée : le portrait, première image utile (contrat, section 6).
  preload(portrait[portrait.length - 1]!.chemin, {
    as: 'image',
    type: 'image/avif',
    imageSrcSet: portrait.map((f) => `${f.chemin} ${f.largeur}w`).join(', '),
    imageSizes: TAILLES_PORTRAIT,
    fetchPriority: 'high',
  });

  return (
    <>
      <section className={styles.ouverture} data-ouverture data-monde-section>
        <div className={styles.fond}>
          <Visuel
            className={styles.decor}
            cadres={[{ derive: 'aube-vertical', media: '(max-width: 767px)' }, { derive: 'aube-paysage' }]}
            alt=""
            sizes="100vw"
            prioritaire
          />
        </div>
        <p className={styles.surtitre}>
          {profil.intitule} · {profil.base.ville}, {profil.base.pays}
        </p>
        <h1 className={styles.nom}>{profil.nomPublic}</h1>
        <div className={styles.silhouette}>
          <Visuel
            className={styles.portrait}
            cadres={[{ derive: 'portrait-buste' }]}
            alt={`Portrait de ${profil.nomPublic}`}
            sizes={TAILLES_PORTRAIT}
            prioritaire
          />
        </div>
        <div className={styles.seuil}>
          {accueil && <Copie arbre={accueil} className={styles.accroche} />}
          <p className={styles.disponibilite}>
            <span className={styles.pastille} aria-hidden="true" />
            {profil.disponibilite}
          </p>
          <p className={styles.actions}>
            <a className={styles.cta} href="#projet-1">
              <span>Entrer dans le monde</span>
              <Fleche vers="bas" />
            </a>
            <Link className={styles.lien} href="/resume-recruteur">
              Résumé recruteur
            </Link>
          </p>
        </div>
        <p className={styles.indice} aria-hidden="true">
          Défiler
        </p>
      </section>

      {projets.map((projet) => {
        const [preuve] = projet.preuves;
        return (
          <section
            key={projet.slug}
            id={`projet-${projet.rang}`}
            className={styles.station}
            data-panneau={projet.rang % 2 === 1 ? 'droite' : 'gauche'}
            data-monde-section
            aria-labelledby={`titre-${projet.slug}`}
          >
            {/* Cartouche : aucun fond, le texte vit dans le monde. Avec le monde actif, il se lève à
                l'arrivée de la caméra et un trait de lumière le relie à l'écran 3D de l'île. */}
            <div className={styles.panneau} data-cartouche>
              <p className={styles.repere} data-apparait data-repere>
                <span>{rangSurSix(projet.rang)}</span>
                <span className={styles.jauge} aria-hidden="true">
                  {projets.map(({ rang }) => (
                    <span key={rang} data-allume={rang === projet.rang ? '' : undefined} />
                  ))}
                </span>
              </p>
              <p className={styles.meta} data-apparait>
                {projet.periode.debut.slice(0, 4)} ·{' '}
                {projet.plateformes.map((p) => PLATEFORMES[p]).join(' · ')}
              </p>
              <h2 id={`titre-${projet.slug}`} className={styles.projet}>
                <span className="visuellement-cache">{projet.nom}</span>
                <span aria-hidden="true">
                  {projet.nom.split(' ').map((mot, m) => (
                    <Fragment key={m}>
                      {m > 0 && ' '}
                      <span className={styles.mot}>
                        {Array.from(mot, (lettre, l) => (
                          <span key={l} className={styles.lettre} data-lettre>
                            {lettre}
                          </span>
                        ))}
                      </span>
                    </Fragment>
                  ))}
                </span>
              </h2>
              <p className={styles.role} data-apparait>
                {projet.role}
              </p>
              {preuve && (
                <p className={styles.preuve} data-apparait>
                  <span className={styles.preuveLibelle}>Preuve :</span> {preuve.libelle}
                </p>
              )}
              <p data-apparait>
                <Link className={styles.cta} href={`/projets/${projet.slug}`}>
                  <span>
                    Étude de cas<span className="visuellement-cache"> : {projet.nom}</span>
                  </span>
                  <Fleche />
                </Link>
              </p>
            </div>
            {/* Sans monde 3D, la capture réelle tient la place de l'écran flottant. */}
            <div className={styles.secours}>
              <MediaProjet slug={projet.slug} tailles="(min-width: 1280px) 44rem, 90vw" />
            </div>
          </section>
        );
      })}

      <section className={styles.final} data-monde-section aria-labelledby="titre-final">
        <p className={page.etiquette}>Base 237 · Douala</p>
        <h2 id="titre-final" className={styles.projet}>
          Contact
        </h2>
        <p className={styles.disponibilite}>
          <span className={styles.pastille} aria-hidden="true" />
          {profil.disponibilite}
        </p>
        <p className={styles.actions}>
          <Link className={styles.cta} href="/contact">
            <span>Écrire à {profil.nomPublic}</span>
            <Fleche />
          </Link>
          <Link className={styles.lien} href="/projets">
            Les six projets
          </Link>
          <Link className={styles.lien} href="/parcours">
            Parcours
          </Link>
        </p>
      </section>
    </>
  );
}
