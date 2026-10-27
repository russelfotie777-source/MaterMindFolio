import type { ReactNode } from 'react';

import { Visuel } from '@/components/Visuel';
import { lireDerive, lireMediaProjet } from '@/lib/media';

import styles from './MediaProjet.module.css';

// Un seul média actif par projet, capture à plat et sans mockup d'appareil (DR-1, 12_MEDIAS_PROJETS_C3).
// Les captures bureau et mobile montrent des écrans différents : chacune garde son propre texte
// alternatif. Chacune est réservée à son format : seule celle du format courant est téléchargée,
// ce qui permet de la charger en priorité quand elle est la plus grande image de la page.
export function MediaProjet({
  slug,
  tailles,
  legende,
  prioritaire = false,
}: {
  slug: string;
  tailles: string;
  legende?: ReactNode;
  prioritaire?: boolean;
}) {
  const media = lireMediaProjet(slug);
  // Média absent : rôle, périmètre et preuve gardent toute la surface, sans boîte vide.
  if (!media) return null;

  return (
    <figure className={styles.media}>
      <div className={styles.bureau}>
        <Visuel
          cadres={[{ derive: media.bureau }]}
          alt={lireDerive(media.bureau).alt ?? ''}
          sizes={tailles}
          seulementSi="(min-width: 768px)"
          prioritaire={prioritaire}
        />
      </div>
      <div className={styles.mobile}>
        <Visuel
          cadres={[{ derive: media.mobile }]}
          alt={lireDerive(media.mobile).alt ?? ''}
          sizes="390px"
          seulementSi="(max-width: 767px)"
          prioritaire={prioritaire}
        />
      </div>
      {legende && <figcaption className={styles.legende}>{legende}</figcaption>}
    </figure>
  );
}
