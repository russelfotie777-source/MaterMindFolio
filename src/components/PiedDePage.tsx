import Link from 'next/link';

import { LienExterne } from '@/components/LienExterne';
import { lireProfil } from '@/lib/faits/profil';

import styles from './PiedDePage.module.css';

export function PiedDePage() {
  const profil = lireProfil();

  return (
    <footer className={styles.pied}>
      <nav aria-label="Pied de page">
        <ul className={styles.liens}>
          <li>
            <Link href="/visite">Visite</Link>
          </li>
          <li>
            <Link href="/parcours">Parcours</Link>
          </li>
          <li>
            <Link href="/fabrication">Sources &amp; fabrication</Link>
          </li>
          <li>
            <Link href="/mentions">Mentions légales</Link>
          </li>
          <li>
            <LienExterne href={profil.github}>GitHub</LienExterne>
          </li>
        </ul>
      </nav>
      <p className={styles.signature}>
        {profil.nomPublic} · {profil.intitule} · {profil.base.ville}, {profil.base.pays}
      </p>
    </footer>
  );
}
