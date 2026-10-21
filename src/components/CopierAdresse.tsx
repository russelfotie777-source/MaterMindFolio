'use client';

import { useState } from 'react';

type Etat = 'repos' | 'copiee' | 'echec';

const messages: Record<Etat, string> = {
  repos: '',
  copiee: 'Adresse copiée.',
  echec: 'Copie impossible : sélectionnez l’adresse puis copiez-la.',
};

// Contact V1 (contrat, T19) : lien direct et copie d'adresse, sans formulaire.
// L'adresse reste visible et sélectionnable : la copie n'est qu'un raccourci.
export function CopierAdresse({ adresse }: { adresse: string }) {
  const [etat, setEtat] = useState<Etat>('repos');

  async function copier() {
    try {
      await navigator.clipboard.writeText(adresse);
      setEtat('copiee');
    } catch {
      setEtat('echec');
    }
  }

  return (
    <p>
      <a href={`mailto:${adresse}`}>{adresse}</a>{' '}
      <button type="button" onClick={copier}>
        Copier l’adresse
      </button>{' '}
      <span role="status">{messages[etat]}</span>
    </p>
  );
}
