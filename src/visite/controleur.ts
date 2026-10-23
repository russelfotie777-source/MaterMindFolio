// Contrôleur fini de la visite (contrat, section 4 ; ADR-004) : TypeScript pur, sans dépendance.
// Il possède l'état métier ; GSAP, R3F et l'audio ne font que le refléter.
//
//   idle → sound-choice → loading → playing ⇄ paused → deep-dive → completed
//
// Les branches du contrat (reduced-motion, audio-blocked, webgl-unavailable, offline, error) sont des
// axes indépendants de la phase : on peut être en pause, sans son, sans WebGL et hors ligne à la fois.
export type Phase =
  'idle' | 'sound-choice' | 'loading' | 'playing' | 'paused' | 'deep-dive' | 'completed' | 'error';

export type EtatVisite = {
  phase: Phase;
  chapitre: number;
  nombreChapitres: number;
  // Choix sonore de la session : demandé une seule fois, jamais deviné.
  son: 'a-choisir' | 'actif' | 'silence' | 'bloque';
  mouvement: 'immersif' | 'reduit';
  rendu: 'webgl' | 'leger';
  enLigne: boolean;
  // Étude de cas ouverte depuis la visite ; au retour, même chapitre, toujours en pause.
  etude: string | null;
};

export type Evenement =
  | { type: 'START' }
  | { type: 'CHOOSE_SOUND'; avecSon: boolean }
  | { type: 'READY' }
  | { type: 'FAIL' }
  | { type: 'PAUSE' }
  | { type: 'RESUME' }
  | { type: 'SEEK_CHAPTER'; chapitre: number }
  | { type: 'CHAPTER_REACHED'; chapitre: number }
  | { type: 'COMPLETE' }
  | { type: 'OPEN_CASE'; projet: string }
  | { type: 'CLOSE_CASE' }
  | { type: 'EXIT' }
  | { type: 'TAB_HIDDEN' }
  | { type: 'RETRY' }
  | { type: 'AUDIO_BLOCKED' }
  | { type: 'REDUCED_MOTION'; actif: boolean }
  | { type: 'WEBGL_UNAVAILABLE' }
  | { type: 'NETWORK'; enLigne: boolean };

export function etatInitial(nombreChapitres: number, options: Partial<EtatVisite> = {}): EtatVisite {
  return {
    phase: 'idle',
    chapitre: 0,
    nombreChapitres,
    son: 'a-choisir',
    mouvement: 'immersif',
    rendu: 'webgl',
    enLigne: true,
    etude: null,
    ...options,
  };
}

const enVisite = (phase: Phase) => phase === 'playing' || phase === 'paused';

export function transition(etat: EtatVisite, evenement: Evenement): EtatVisite {
  const borne = (chapitre: number) => Math.min(Math.max(0, Math.trunc(chapitre)), etat.nombreChapitres - 1);

  switch (evenement.type) {
    case 'START':
      if (etat.phase !== 'idle' && etat.phase !== 'completed') return etat;
      // Le choix silencieux est mémorisé pour la session et n'est pas redemandé.
      return { ...etat, phase: etat.son === 'a-choisir' ? 'sound-choice' : 'loading', etude: null };
    case 'CHOOSE_SOUND':
      if (etat.phase !== 'sound-choice') return etat;
      return { ...etat, phase: 'loading', son: evenement.avecSon ? 'actif' : 'silence' };
    case 'READY':
      // En mouvement réduit, la visite est un storyboard manuel : elle s'ouvre en pause sur le chapitre.
      if (etat.phase !== 'loading') return etat;
      return { ...etat, phase: etat.mouvement === 'reduit' ? 'paused' : 'playing' };
    case 'FAIL':
      return etat.phase === 'loading' || enVisite(etat.phase) ? { ...etat, phase: 'error' } : etat;
    case 'RETRY':
      return etat.phase === 'error' ? { ...etat, phase: 'loading' } : etat;
    case 'PAUSE':
    case 'TAB_HIDDEN':
      // Onglet masqué : caméra et son s'arrêtent ; rien ne reprend seul au retour.
      return etat.phase === 'playing' ? { ...etat, phase: 'paused' } : etat;
    case 'RESUME':
      return etat.phase === 'paused' ? { ...etat, phase: 'playing' } : etat;
    case 'SEEK_CHAPTER':
      // Un saut pose la scène sur une pose stable, puis ne reprend que sur action (DR-1, 04, section 2).
      return enVisite(etat.phase) ? { ...etat, phase: 'paused', chapitre: borne(evenement.chapitre) } : etat;
    case 'CHAPTER_REACHED':
      return etat.phase === 'playing' ? { ...etat, chapitre: borne(evenement.chapitre) } : etat;
    case 'COMPLETE':
      return etat.phase === 'playing'
        ? { ...etat, phase: 'completed', chapitre: etat.nombreChapitres - 1 }
        : etat;
    case 'OPEN_CASE':
      return enVisite(etat.phase) ? { ...etat, phase: 'deep-dive', etude: evenement.projet } : etat;
    case 'CLOSE_CASE':
      return etat.phase === 'deep-dive' ? { ...etat, phase: 'paused', etude: null } : etat;
    case 'EXIT':
      // Échap mène à la vue libre stable, jamais à une page vide ; le chapitre reste le point de reprise.
      return etat.phase === 'idle' ? etat : { ...etat, phase: 'idle', etude: null };
    case 'AUDIO_BLOCKED':
      // La visite continue en silence ; le player propose « Activer le son » sans modale.
      return etat.son === 'actif' ? { ...etat, son: 'bloque' } : etat;
    case 'REDUCED_MOTION':
      // Bascule en cours de visite : l'état courant est figé, la position conservée.
      return {
        ...etat,
        mouvement: evenement.actif ? 'reduit' : 'immersif',
        phase: evenement.actif && etat.phase === 'playing' ? 'paused' : etat.phase,
      };
    case 'WEBGL_UNAVAILABLE':
      // Version légère : mêmes faits et actions, sans Canvas ; la phase ne change pas.
      return { ...etat, rendu: 'leger' };
    case 'NETWORK':
      return { ...etat, enLigne: evenement.enLigne };
  }
}
