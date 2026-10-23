import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { preload } from 'react-dom';

import '@/styles/tokens.css';
import '@/styles/global.css';

import { Entete } from '@/components/Entete';
import { PiedDePage } from '@/components/PiedDePage';
import { POLICE_DM_SANS } from '@/lib/police';
import { SITE_URL } from '@/lib/site';

// Chaque page déclare sa propre URL canonique : la racine n'en impose aucune par héritage.
export const metadata: Metadata = {
  metadataBase: SITE_URL,
  title: { default: 'MASTERMIND — Software Engineer', template: '%s — MASTERMIND' },
  description: 'HORIZON 237 — TRACE SOLAIRE, le portfolio de MASTERMIND, Software Engineer basé à Douala.',
  // En attendant la variante favicon du monogramme (Codex), une icône vide évite la requête /favicon.ico en 404.
  icons: { icon: 'data:,' },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  // Un seul fichier variable couvre toutes les graisses : c'est l'unique police préchargée (contrat, section 7).
  preload(POLICE_DM_SANS, { as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' });

  return (
    <html lang="fr">
      <body>
        <Entete />
        <main id="contenu" tabIndex={-1}>
          {children}
        </main>
        <PiedDePage />
      </body>
    </html>
  );
}
