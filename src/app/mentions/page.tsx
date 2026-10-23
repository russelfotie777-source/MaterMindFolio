import type { Metadata } from 'next';
import Link from 'next/link';

import { lireReferencesMusicales } from '@/lib/faits/musique';
import { lireProfil } from '@/lib/faits/profil';
import page from '@/styles/page.module.css';

export const metadata: Metadata = {
  title: 'Mentions légales',
  description: 'Mentions légales, confidentialité et crédits du portfolio de MASTERMIND.',
  alternates: { canonical: '/mentions' },
};

// Faits techniques du site (contrat, T18 à T20) : hébergement Vercel, aucun formulaire, aucune mesure.
export default function Mentions() {
  const profil = lireProfil();
  const lecteurTiers = lireReferencesMusicales().some((morceau) => morceau.publication.genre === 'youtube');

  return (
    <div className={page.cadre}>
      <article className={page.plaque}>
        <p className={page.etiquette}>Mentions</p>
        <h1 className={page.titrePage}>Mentions légales</h1>

        <div className={page.grille}>
          <section className={page.rubrique}>
            <h2>Édition</h2>
            <p>
              {profil.nomPublic}, {profil.base.ville}, {profil.base.pays}.
            </p>
            <p>
              Contact : <a href={`mailto:${profil.email}`}>{profil.email}</a>
            </p>
          </section>

          <section className={page.rubrique}>
            <h2>Hébergement</h2>
            <p>Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis.</p>
          </section>

          <section className={page.rubrique}>
            <h2>Confidentialité</h2>
            <p>
              Ce site ne dépose aucun cookie, n’utilise aucun outil de mesure d’audience et ne propose aucun
              formulaire. L’hébergeur peut conserver des journaux techniques de connexion.
            </p>
            {lecteurTiers && (
              <p>
                Dans Sources &amp; fabrication, le lecteur YouTube d’un morceau de référence n’est chargé
                qu’après un clic ; YouTube applique alors ses propres règles de confidentialité.
              </p>
            )}
          </section>

          <section className={page.rubrique}>
            <h2>Crédits</h2>
            <p>
              Les sources des faits et des actifs sont détaillées dans{' '}
              <Link href="/fabrication">Sources &amp; fabrication</Link>.
            </p>
          </section>
        </div>
      </article>
    </div>
  );
}
