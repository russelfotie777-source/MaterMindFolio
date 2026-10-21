import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import '@/styles/tokens.css';
import '@/styles/global.css';

import { Entete } from '@/components/Entete';
import { PiedDePage } from '@/components/PiedDePage';
import { SITE_URL } from '@/lib/site';

// Chaque page déclare sa propre URL canonique : la racine n'en impose aucune par héritage.
export const metadata: Metadata = {
  metadataBase: SITE_URL,
  title: { default: 'MASTERMIND — Software Engineer', template: '%s — MASTERMIND' },
  description: 'HORIZON 237 — TRACE SOLAIRE, le portfolio de MASTERMIND, Software Engineer basé à Douala.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
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
