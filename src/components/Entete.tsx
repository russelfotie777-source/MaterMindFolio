import Link from 'next/link';

import { NOM_DU_SITE } from '@/lib/site';

import styles from './Entete.module.css';

// Ordre DOM de la DR-1 (04_MOUVEMENT_SON_ACCESSIBILITE, section 7) : évitement, en-tête, contenu, pied.
// Le lien vers le CV rejoindra « Résumé » et « Contact » avec le PDF (DR1-R05).
export function Entete() {
  return (
    <>
      <a className={styles.evitement} href="#contenu">
        Aller au contenu
      </a>
      <header className={styles.entete}>
        {/* Sans préchargement : le RSC de l'accueil porte le preload du portrait, qui serait sinon
            téléchargé sur chaque page où ce lien est visible. */}
        <Link className={styles.site} href="/" prefetch={false}>
          {NOM_DU_SITE}
        </Link>
        <nav aria-label="Navigation principale">
          <ul className={styles.liens}>
            <li>
              <Link href="/projets">Projets</Link>
            </li>
            <li>
              <Link href="/resume-recruteur">Résumé</Link>
            </li>
            <li>
              <Link href="/contact">Contact</Link>
            </li>
          </ul>
        </nav>
      </header>
    </>
  );
}
