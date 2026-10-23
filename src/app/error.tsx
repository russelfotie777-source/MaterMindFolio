'use client';

import Link from 'next/link';

import page from '@/styles/page.module.css';

// Erreur locale (DR-1, 03_ECRANS_ETATS, section 5) : reprise, route alternative et identifiant
// non sensible. En production, Next.js ne transmet que l'empreinte de l'erreur, jamais son message.
export default function Erreur({ error, retry }: { error: unknown; retry: () => void }) {
  const empreinte = error instanceof Error && 'digest' in error ? String(error.digest) : null;

  return (
    <div className={page.cadre}>
      <p className={page.etiquette}>Erreur</p>
      <h1 className={page.titrePage}>Cette page n’a pas pu s’afficher</h1>
      <p className={page.lead}>Les projets, le résumé et le contact restent disponibles.</p>
      {empreinte && <p className={page.attenue}>Identifiant : {empreinte}</p>}
      <p className={page.actions}>
        <button type="button" className={page.boutonClair} onClick={retry}>
          Réessayer
        </button>
        <Link className={page.bouton} href="/projets">
          Les six projets
        </Link>
        <Link className={page.bouton} href="/resume-recruteur">
          Résumé recruteur
        </Link>
      </p>
    </div>
  );
}
