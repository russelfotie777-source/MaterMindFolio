import { Visuel } from '@/components/Visuel';
import { lireDerive, lireMediaProjet } from '@/lib/media';

import styles from './MediaProjet.module.css';

// Un seul média actif par projet, capture à plat et sans mockup d'appareil (DR-1, 12_MEDIAS_PROJETS_C3).
// Les captures bureau et mobile montrent des écrans différents : chacune garde son propre texte
// alternatif, et seule celle du format courant est affichée, donc chargée.
export function MediaProjet({ slug, tailles }: { slug: string; tailles: string }) {
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
        />
      </div>
      <div className={styles.mobile}>
        <Visuel cadres={[{ derive: media.mobile }]} alt={lireDerive(media.mobile).alt ?? ''} sizes="390px" />
      </div>
    </figure>
  );
}
