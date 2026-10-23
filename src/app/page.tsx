import type { Metadata } from 'next';
import Link from 'next/link';
import { preload } from 'react-dom';

import { Copie } from '@/components/Copie';
import { Visuel } from '@/components/Visuel';
import { lireCopieSite } from '@/lib/copie/site';
import { lireProfil } from '@/lib/faits/profil';
import { lireDerive } from '@/lib/media';
import page from '@/styles/page.module.css';

import styles from './accueil.module.css';

export const metadata: Metadata = { alternates: { canonical: '/' } };

const TAILLES_PORTRAIT = '(min-width: 768px) min(45vw, 36rem), 70vw';

// Accueil (DR-1, vues A01 et 01_DIRECTION_ARTISTIQUE, section 8) : décor d'aube plein cadre, identité sur
// plan sombre, portrait détouré à droite. C'est aussi la version sans Canvas : tout est déjà dans le HTML.
// L'accroche vient de content/copy/fr/site.copy.json, une fois visée par Russel.
export default function Accueil() {
  const profil = lireProfil();
  const { accueil } = lireCopieSite();
  const portrait = lireDerive('portrait-buste').fichiers.avif;
  // Unique image préchargée : le portrait, première image utile (contrat, section 6). Le décor, élément
  // LCP mesuré, est chargé sans délai et en priorité haute, sans second préchargement.
  preload(portrait[portrait.length - 1]!.chemin, {
    as: 'image',
    type: 'image/avif',
    imageSrcSet: portrait.map((f) => `${f.chemin} ${f.largeur}w`).join(', '),
    imageSizes: TAILLES_PORTRAIT,
    fetchPriority: 'high',
  });

  return (
    <section className={styles.ouverture} data-ouverture>
      <Visuel
        className={styles.decor}
        cadres={[{ derive: 'aube-vertical', media: '(max-width: 767px)' }, { derive: 'aube-paysage' }]}
        alt=""
        sizes="100vw"
        prioritaire
      />
      <div className={styles.composition}>
        <div className={styles.identite}>
          <p className={page.etiquette}>
            {profil.intitule} · {profil.base.ville}
          </p>
          <h1 className={page.titreDisplay}>{profil.nomPublic}</h1>
          {accueil && <Copie arbre={accueil} className={`${page.lead} ${styles.accroche}`} />}
          <p className={page.lead}>{profil.disponibilite}</p>
          <p className={`${page.actions} ${styles.actions}`}>
            <Link className={page.boutonClair} href="/visite">
              Commencer la visite
            </Link>
            <Link className={page.bouton} href="/projets">
              Explorer librement
            </Link>
          </p>
        </div>
        <Visuel
          className={styles.portrait}
          cadres={[{ derive: 'portrait-buste' }]}
          alt={`Portrait de ${profil.nomPublic}`}
          sizes={TAILLES_PORTRAIT}
          prioritaire
        />
      </div>
    </section>
  );
}
