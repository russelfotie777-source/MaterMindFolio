import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'MASTERMIND — Software Engineer',
  description: 'HORIZON 237 — TRACE SOLAIRE, le portfolio de MASTERMIND, Software Engineer basé à Douala.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
