'use client';

// Coque minimale quand la mise en page racine elle-même échoue (DR-1, 03_ECRANS_ETATS, section 5) :
// aucune feuille de style ni attribut style, donc rien que la CSP doive autoriser en plus.
export default function ErreurGlobale({ error, retry }: { error: unknown; retry: () => void }) {
  const empreinte = error instanceof Error && 'digest' in error ? String(error.digest) : null;

  return (
    <html lang="fr">
      <body>
        <title>Erreur — MASTERMIND</title>
        <main>
          <h1>Le site n’a pas pu s’afficher</h1>
          {empreinte && <p>Identifiant : {empreinte}</p>}
          <p>
            <button type="button" onClick={retry}>
              Réessayer
            </button>{' '}
            {/* Rechargement complet voulu : la mise en page racine a échoué, le routeur client aussi. */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a href="/">Retour à l’accueil</a>
          </p>
        </main>
      </body>
    </html>
  );
}
