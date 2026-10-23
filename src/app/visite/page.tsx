import type { Metadata } from 'next';
import Link from 'next/link';

import { Copie } from '@/components/Copie';
import { MediaProjet } from '@/components/MediaProjet';
import { Visuel } from '@/components/Visuel';
import { lireCopieProjet } from '@/lib/copie/projets';
import { lireCopieSite } from '@/lib/copie/site';
import { lireProjets } from '@/lib/faits/projets';
import { PLATEFORMES, rangSurSix } from '@/lib/libelles';
import { lireDerive } from '@/lib/media';
import page from '@/styles/page.module.css';
import { IlotVisite } from '@/visite/IlotVisite';

import styles from './visite.module.css';

export const metadata: Metadata = {
  title: 'Visite',
  description: 'La visite des six projets de MASTERMIND, station par station.',
  alternates: { canonical: '/visite' },
};

// Version légère de la visite (DR-1, vues A04 et A05 sans WebGL) : l'index DOM des six stations,
// chacune avec son unique média ; le texte précède le média dans le DOM, le média passe devant à l'écran.
// L'îlot immersif (G3) s'ajoutera devant cet index, qui reste la navigation sans Canvas.
export default function Visite() {
  const copieSite = lireCopieSite();
  const projets = lireProjets();
  // Texture du ciel cylindrique (C3-R1, C3-R3) : dérivé WebP du décor d'aube, 1280 px sur téléphone
  // pour tenir le budget des premiers actifs 3D, 2560 px au-delà pour limiter l'agrandissement.
  const aube = lireDerive('aube-paysage').fichiers.webp;
  const ciel = {
    mobile: aube.find((f) => f.largeur === 1280)!.chemin,
    bureau: aube.find((f) => f.largeur === 2560)!.chemin,
  };

  return (
    <div className={page.cadre}>
      <p className={page.etiquette}>Visite · version légère</p>
      <h1 className={page.titrePage}>Six stations</h1>
      <IlotVisite ciel={ciel}>
        <Visuel
          cadres={[{ derive: 'aube-vertical', media: '(max-width: 767px)' }, { derive: 'aube-paysage' }]}
          alt=""
          sizes="(min-width: 1280px) 82rem, 100vw"
        />
      </IlotVisite>
      {copieSite['visite-legere'] && <Copie arbre={copieSite['visite-legere']} className={page.lead} />}
      <ol role="list" className={styles.stations}>
        {projets.map((projet) => {
          const copie = lireCopieProjet(projet.slug);
          return (
            <li key={projet.slug} className={styles.station}>
              <div className={styles.texte}>
                <p className={page.etiquette}>
                  {rangSurSix(projet.rang)} · {projet.plateformes.map((p) => PLATEFORMES[p]).join(' · ')}
                </p>
                <h2 className={styles.nom}>{projet.nom}</h2>
                <p className={page.fort}>{projet.role}</p>
                <p className={page.attenue}>{projet.perimetre.join(' · ')}</p>
                {copie.decision && <Copie arbre={copie.decision} className={page.attenue} />}
                <p>
                  <Link className={page.boutonClair} href={`/projets/${projet.slug}`}>
                    Voir l’étude de cas<span className="visuellement-cache"> : {projet.nom}</span>
                  </Link>
                </p>
              </div>
              <MediaProjet
                slug={projet.slug}
                tailles="(min-width: 1280px) 44rem, 55vw"
                legende={copie['product-caption'] && <Copie arbre={copie['product-caption']} />}
              />
            </li>
          );
        })}
      </ol>
      <p className={page.actions}>
        <Link href="/" prefetch={false}>
          Retour à l’accueil
        </Link>
      </p>
    </div>
  );
}
