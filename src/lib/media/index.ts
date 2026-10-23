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

// Média d'un projet (DR-1, 12_MEDIAS_PROJETS_C3) : une capture bureau et une capture mobile, ou rien.
export function lireMediaProjet(slug: string): { bureau: IdDerive; mobile: IdDerive } | null {
  const bureau = `${slug}-bureau`;
  const mobile = `${slug}-mobile`;
  return bureau in derives && mobile in derives
    ? { bureau: bureau as IdDerive, mobile: mobile as IdDerive }
    : null;
}
