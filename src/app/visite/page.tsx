import type { Metadata } from 'next';
import Link from 'next/link';

import { Copie } from '@/components/Copie';
import { MediaProjet } from '@/components/MediaProjet';
import { Visuel } from '@/components/Visuel';
import { lireCopieProjet } from '@/lib/copie/projets';
import { lireCopieSite } from '@/lib/copie/site';
import { lireProfil } from '@/lib/faits/profil';
import { lireProjets } from '@/lib/faits/projets';
import { PLATEFORMES, rangSurSix } from '@/lib/libelles';
import { type IdDerive, lireDerive } from '@/lib/media';
import page from '@/styles/page.module.css';
import { IDS_CARTES } from '@/visite/corps';
import { type Belvedere, IlotVisite, type TexturesVisite } from '@/visite/IlotVisite';

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
  const profil = lireProfil();
  const projets = lireProjets();
  // Texture du ciel cylindrique (C3-R1, C3-R3) : dérivé WebP du décor d'aube, 1280 px sur téléphone
  // pour tenir le budget des premiers actifs 3D, 2560 px au-delà pour limiter l'agrandissement.
  // Cartes des corps célestes (C3-R5) : 512 px sur téléphone, 1024 px au-delà.
  const paire = (id: IdDerive, mobile: number, bureau: number) => {
    const fichiers = lireDerive(id).fichiers.webp;
    return {
      mobile: fichiers.find((f) => f.largeur === mobile)!.chemin,
      bureau: fichiers.find((f) => f.largeur === bureau)!.chemin,
    };
  };
  const textures: TexturesVisite = {
    ciel: paire('aube-paysage', 1280, 2560),
    cartes: Object.fromEntries(
      IDS_CARTES.map((id) => [id, paire(`${id}-carte`, 512, 1024)]),
    ) as TexturesVisite['cartes'],
  };

  // Image 0 de l'ouverture : décor d'aube, identité validée et portrait réel détouré, composés comme
  // l'accueil. Couche décorative de l'îlot (texte déjà présent dans la page), chargée au geste d'entrée.
  const identite = (
    <>
      <Visuel
        className={styles.identiteDecor}
        cadres={[{ derive: 'aube-vertical', media: '(max-width: 767px)' }, { derive: 'aube-paysage' }]}
        alt=""
        sizes="(min-width: 1280px) 82rem, 100vw"
        prioritaire
      />
      <div className={styles.identiteTexte}>
        <p className={page.etiquette}>
          {profil.intitule} · {profil.base.ville}, {profil.base.pays}
        </p>
        <p className={styles.identiteNom}>{profil.nomPublic}</p>
      </div>
      <Visuel
        className={styles.identitePortrait}
        cadres={[{ derive: 'portrait-buste' }]}
        alt=""
        sizes="(min-width: 768px) 40vw, 70vw"
        prioritaire
      />
    </>
  );

  // Belvédère de chaque station (storyboard, section 1) : rang, nom, rôle exact, la phrase de besoin si
  // Russel l'a visée, une preuve. Le périmètre complet reste derrière « Approfondir », seul lien du panneau.
  const belvederes: Record<string, Belvedere> = Object.fromEntries(
    projets.map((projet) => {
      const copie = lireCopieProjet(projet.slug);
      const [preuve] = projet.preuves;
      return [
        projet.slug,
        {
          nom: projet.nom,
          media: <MediaProjet slug={projet.slug} tailles="(min-width: 1280px) 46rem, 55vw" />,
          texte: (
            <>
              <p className={page.etiquette}>
                {rangSurSix(projet.rang)} · {projet.plateformes.map((p) => PLATEFORMES[p]).join(' · ')}
              </p>
              <h2>{projet.nom}</h2>
              <p className={page.fort}>{projet.role}</p>
              {copie.need && <Copie arbre={copie.need} className={page.attenue} />}
              {preuve && <p className={page.etiquette}>Preuve : {preuve.libelle}</p>}
            </>
          ),
        },
      ];
    }),
  );

  return (
    <div className={page.cadre}>
      <p className={page.etiquette}>Visite · version légère</p>
      <h1 className={page.titrePage}>Six stations</h1>
      <IlotVisite textures={textures} identite={identite} belvederes={belvederes}>
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
