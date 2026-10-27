import { createStore } from 'zustand/vanilla';

import { CHAPITRES } from './chapitres';
import { type EtatVisite, type Evenement, etatInitial, transition } from './controleur';

// État métier partagé par le DOM et la scène (contrat, T09) : React ne s'y abonne que par sélecteurs
// grossiers (phase, chapitre, modes), jamais à la position image par image.
export function creerStoreVisite(options: Partial<EtatVisite> = {}) {
  const store = createStore<EtatVisite>(() => etatInitial(CHAPITRES.length, options));
  const envoyer = (evenement: Evenement) => store.setState(transition(store.getState(), evenement), true);
  return { ...store, envoyer };
}

export type StoreVisite = ReturnType<typeof creerStoreVisite>;
