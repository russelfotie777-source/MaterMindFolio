import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { preload } from 'react-dom';

import '@/styles/tokens.css';
import '@/styles/global.css';

import { Entete } from '@/components/Entete';
import { PiedDePage } from '@/components/PiedDePage';
import { lireProjets } from '@/lib/faits/projets';
import { type IdDerive, lireDerive, lireMediaProjet } from '@/lib/media';
import { POLICE_DM_SANS } from '@/lib/police';
import { SITE_URL } from '@/lib/site';
import { type TexturesUnivers, UniversSite } from '@/monde/UniversSite';
import { IDS_CARTES } from '@/visite/corps';

// Chaque page déclare sa propre URL canonique : la racine n'en impose aucune par héritage.
export const metadata: Metadata = {
  metadataBase: SITE_URL,
  title: { default: 'MASTERMIND — Software Engineer', template: '%s — MASTERMIND' },
  description: 'HORIZON 237 — TRACE SOLAIRE, le portfolio de MASTERMIND, Software Engineer basé à Douala.',
  // Partage social sans image : la carte de partage relève de la direction artistique (Codex).
  openGraph: { type: 'website', locale: 'fr_FR', siteName: 'HORIZON 237 — TRACE SOLAIRE' },
  twitter: { card: 'summary' },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  // Un seul fichier variable couvre toutes les graisses : c'est l'unique police préchargée (contrat, section 7).
  preload(POLICE_DM_SANS, { as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' });

  return (
    <html lang="fr">
      <body>
        <UniversSite textures={texturesUnivers()} />
        <Entete />
        <main id="contenu" tabIndex={-1}>
          {children}
        </main>
        <PiedDePage />
      </body>
    </html>
  );
}

// Textures de l'univers : cartes célestes (512 px sur téléphone, 1024 px au-delà) et captures réelles des
// projets pour leurs écrans flottants, chargées à la demande par la scène.
function texturesUnivers(): TexturesUnivers {
  const projets = lireProjets();
  const paire = (id: IdDerive) => {
    const fichiers = lireDerive(id).fichiers.webp;
    return {
      mobile: fichiers.find((f) => f.largeur === 512)!.chemin,
      bureau: fichiers.find((f) => f.largeur === 1024)!.chemin,
    };
  };
  return {
    cartes: Object.fromEntries(
      IDS_CARTES.map((id) => [id, paire(`${id}-carte`)]),
    ) as TexturesUnivers['cartes'],
    ecrans: projets.map((projet) => {
      const media = lireMediaProjet(projet.slug);
      const fichiers = media ? lireDerive(media.bureau).fichiers.webp : [];
      return (fichiers.find((f) => f.largeur === 1080) ?? fichiers[0])?.chemin ?? '';
    }),
    liens: projets.map((projet) => `/projets/${projet.slug}`),
    slugs: projets.map((projet) => projet.slug),
  };
}
