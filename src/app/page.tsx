import type { Metadata } from 'next';
import Link from 'next/link';
import { preload } from 'react-dom';

import { Copie } from '@/components/Copie';
import { MediaProjet } from '@/components/MediaProjet';
import { Visuel } from '@/components/Visuel';
import { lireCopieProjet } from '@/lib/copie/projets';
import { lireCopieSite } from '@/lib/copie/site';
import { lireProfil } from '@/lib/faits/profil';
import { lireProjets } from '@/lib/faits/projets';
import { PLATEFORMES, rangSurSix } from '@/lib/libelles';
import { type IdDerive, lireDerive, lireMediaProjet } from '@/lib/media';
import { MondeAccueil, type TexturesAccueil } from '@/monde/MondeAccueil';
import page from '@/styles/page.module.css';
import { IDS_CARTES } from '@/visite/corps';

import styles from './accueil.module.css';

export const metadata: Metadata = { alternates: { canonical: '/' } };

const TAILLES_PORTRAIT = '(min-width: 768px) min(52vw, 46rem), 92vw';

// Accueil : un univers 3D dès l'entrée (décision de Russel du 24 octobre 2026). Le monde est un canvas
// fixe derrière la page ; chaque section de cette page est une étape de son chemin : l'ouverture au-dessus
// de la mer de nuages, puis les six îles des projets, puis le final face au Fuji. Le HTML porte tout le
// contenu et reste complet sans WebGL : décor d'aube, portrait et captures réelles prennent alors le relais.
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

  // Textures du monde : cartes célestes (512 px sur téléphone, 1024 px au-delà) et captures des projets.
  const paire = (id: IdDerive) => {
    const fichiers = lireDerive(id).fichiers.webp;
    return {
      mobile: fichiers.find((f) => f.largeur === 512)!.chemin,
      bureau: fichiers.find((f) => f.largeur === 1024)!.chemin,
    };
  };
  const textures: TexturesAccueil = {
    cartes: Object.fromEntries(
      IDS_CARTES.map((id) => [id, paire(`${id}-carte`)]),
    ) as TexturesAccueil['cartes'],
    ecrans: projets.map((projet) => {
      const media = lireMediaProjet(projet.slug);
      const fichiers = media ? lireDerive(media.bureau).fichiers.webp : [];
      return (fichiers.find((f) => f.largeur === 1080) ?? fichiers[0])?.chemin ?? '';
    }),
    liens: projets.map((projet) => `/projets/${projet.slug}`),
  };

  return (
    <>
      <MondeAccueil textures={textures} />

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
          <p className={styles.disponibilite}>{profil.disponibilite}</p>
          <p className={styles.actions}>
            <a className={page.bouton} href="#projet-1">
              Entrer dans le monde
            </a>
            <Link className={page.boutonClair} href="/resume-recruteur">
              Résumé recruteur
            </Link>
          </p>
        </div>
        <p className={styles.indice} aria-hidden="true">
          Défiler
        </p>
      </section>

      {projets.map((projet) => {
        const copie = lireCopieProjet(projet.slug);
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
            <div className={styles.panneau}>
              <p className={page.etiquette}>
                {rangSurSix(projet.rang)} · {projet.plateformes.map((p) => PLATEFORMES[p]).join(' · ')}
              </p>
              <h2 id={`titre-${projet.slug}`} className={styles.projet}>
                {projet.nom}
              </h2>
              <p className={page.fort}>{projet.role}</p>
              {copie.need && <Copie arbre={copie.need} className={page.attenue} />}
              {preuve && <p className={styles.preuve}>Preuve : {preuve.libelle}</p>}
              <p>
                <Link className={page.bouton} href={`/projets/${projet.slug}`}>
                  Étude de cas<span className="visuellement-cache"> : {projet.nom}</span>
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
        <p className={styles.disponibilite}>{profil.disponibilite}</p>
        <p className={styles.actions}>
          <Link className={page.bouton} href="/contact">
            Écrire à {profil.nomPublic}
          </Link>
          <Link className={page.boutonClair} href="/projets">
            Les six projets
          </Link>
          <Link className={page.boutonClair} href="/parcours">
            Parcours
          </Link>
        </p>
      </section>
    </>
  );
}
