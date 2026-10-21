import derives from './derives.json';

// Manifeste généré par scripts/media.ts : seuls ces fichiers existent sous public/media/approved/.
export type IdDerive = keyof typeof derives;
export type Derive = (typeof derives)[IdDerive];
export type Fichier = Derive['fichiers']['avif'][number];

export function lireDerive(id: IdDerive): Derive {
  return derives[id];
}

export function lireDerives(): [IdDerive, Derive][] {
  return Object.entries(derives) as [IdDerive, Derive][];
}
