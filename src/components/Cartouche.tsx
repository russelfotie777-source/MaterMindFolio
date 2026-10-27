import { Fragment } from 'react';

import { rangSurSix } from '@/lib/libelles';

import styles from './Cartouche.module.css';

// Pièces du cartouche, le texte d'un projet quand il vit dans le monde 3D (décision de Russel du
// 25 octobre 2026). Les attributs data-* sont lus par le monde : data-repere reçoit le trait de l'écran,
// data-lettre se lève à l'arrivée de la caméra, data-apparait suit. Sans monde, tout reste affiché.
export const classesCartouche = { meta: styles.meta, appel: styles.appel, lien: styles.lien };

// Rang du projet et jauge des six îles, la sienne allumée.
export function Repere({ rang, total = 6 }: { rang: number; total?: number }) {
  return (
    <p className={styles.repere} data-apparait data-repere>
      <span>{rangSurSix(rang)}</span>
      <span className={styles.jauge} aria-hidden="true">
        {Array.from({ length: total }, (_, k) => (
          <span key={k} data-allume={k + 1 === rang ? '' : undefined} />
        ))}
      </span>
    </p>
  );
}

// Nom en lettres de lumière. Le nom entier reste lu d'un seul tenant par les technologies d'assistance ;
// les lettres, découpées pour l'animation, leur sont masquées.
export function NomVivant({
  nom,
  id,
  niveau = 2,
  className,
}: {
  nom: string;
  id?: string;
  niveau?: 1 | 2;
  className?: string;
}) {
  const Titre = niveau === 1 ? 'h1' : 'h2';
  return (
    <Titre id={id} className={className ? `${styles.nom} ${className}` : styles.nom}>
      <span className="visuellement-cache">{nom}</span>
      <span aria-hidden="true">
        {nom.split(' ').map((mot, m) => (
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
    </Titre>
  );
}

// Flèche des appels : un cercle tracé du rose de la trace, qui se remplit au survol de son appel.
export function Fleche({ vers = 'droite' }: { vers?: 'droite' | 'bas' | 'dehors' }) {
  const traces = {
    droite: 'M4 12h15M13 6l6 6-6 6',
    bas: 'M12 4v15M6 13l6 6 6-6',
    dehors: 'M7 17 17 7M9 7h8v8',
  };
  return (
    <span className={styles.rond} aria-hidden="true">
      <svg viewBox="0 0 24 24" focusable="false">
        <path d={traces[vers]} />
      </svg>
    </span>
  );
}
