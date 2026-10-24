// Géographie du monde HORIZON 237 et chemin de la caméra (décision de Russel du 24 octobre 2026 :
// l'accueil est un univers 3D dès l'entrée). Données pures, relues par la scène et par les tests.
//
// Repère : y vers le haut, la caméra avance vers -z. Une mer de nuages s'étend à y = 0 ; le Fuji se dresse
// au loin, le soleil se lève à sa droite ; six îles flottantes portent chacune l'écran réel d'un projet.
export type Vecteur = readonly [number, number, number];
export type Pose = { position: Vecteur; cible: Vecteur };

// Direction du soleil levant, vue depuis l'origine : bas sur l'horizon, à droite du Fuji.
export const SOLEIL: Vecteur = [0.42, 0.06, -1];
export const FUJI = { position: [-260, -40, -1250] as Vecteur, rayon: 560, hauteur: 380 };

// Six îles de même taille, alternées de part et d'autre du chemin, dans l'ordre chronologique des projets.
export const ILES = Array.from({ length: 6 }, (_, k) => {
  const cote = k % 2 === 0 ? -1 : 1;
  const centre: Vecteur = [cote * 26, 10 + (k % 3) * 2.5, -120 - k * 115];
  return { cote, centre };
});

// L'écran d'un projet flotte au-dessus de son île, du côté du chemin, légèrement tourné vers lui.
export const ECRAN = { largeur: 19.2, hauteur: 12, elevation: 12, rotation: 0.38 };
export const centreEcran = (k: number): Vecteur => {
  const { cote, centre } = ILES[k]!;
  return [centre[0] - cote * 7, centre[1] + ECRAN.elevation, centre[2] + 4];
};

// Poses de la caméra, une par section de la page d'accueil : ouverture, six projets, final.
// En portrait, l'écran passe dans la moitié haute du cadre et le panneau de texte dessous.
export function poses(portrait: boolean): Pose[] {
  const accueil: Pose = { position: [0, 16, 70], cible: [0, 30, -400] };
  const projets = ILES.map(({ cote }, k): Pose => {
    const [x, y, z] = centreEcran(k);
    return portrait
      ? { position: [x * 0.55, y + 1, z + 42], cible: [x, y - 5, z] }
      : { position: [cote * 3, y + 2, z + 36], cible: [x * 0.42, y, z] };
  });
  const [fx, fy, fz] = FUJI.position;
  const final: Pose = { position: [fx * 0.4, 60, fz + 520], cible: [fx, fy + FUJI.hauteur * 0.55, fz] };
  return [accueil, ...projets, final];
}

// Progression de la caméra d'après le défilement : chaque section a un palier où la caméra reste immobile
// pendant la lecture (du haut de la section jusqu'à ce que son bas atteigne le bas de l'écran), puis le
// trajet vers la section suivante occupe la hauteur d'un écran. Résultat : un nombre de 0 à n - 1.
export function progression(
  defilement: number,
  sections: readonly { haut: number; hauteur: number }[],
  ecran: number,
) {
  for (let i = 0; i < sections.length - 1; i++) {
    const { haut, hauteur } = sections[i]!;
    const finPalier = haut + Math.max(hauteur - ecran, 0);
    const suivant = sections[i + 1]!.haut;
    if (defilement <= finPalier) return i;
    if (defilement < suivant) {
      const t = (defilement - finPalier) / Math.max(suivant - finPalier, 1);
      return i + t * t * (3 - 2 * t);
    }
  }
  return sections.length - 1;
}

// TRACE 237 : le monogramme flotte dans le tiers haut du cadre final, entre la caméra et le Fuji, au-dessus
// du titre « Contact ». Sa place se déduit de la pose finale ; l'échelle suit l'unité du master (960 px).
export function placeTrace(): { position: Vecteur; echelle: number } {
  const final = poses(false).at(-1)!;
  const [px, py, pz] = final.position;
  const [cx, cy, cz] = final.cible;
  const longueur = Math.hypot(cx - px, cy - py, cz - pz);
  const distance = 380;
  return {
    position: [
      px + ((cx - px) / longueur) * distance,
      py + ((cy - py) / longueur) * distance + 110,
      pz + ((cz - pz) / longueur) * distance,
    ],
    echelle: 0.36,
  };
}
