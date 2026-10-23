import { CHAPITRES } from './chapitres';

// Poses caméra des chapitres, pose `settled` de chaque arrivée (ADR-004, amendement 1 de Codex) :
// valeurs de runtime produites par Claude depuis les contraintes de la DR, cadrages à valider par Codex
// à chaque viewport. Repère monde : y vers le haut, la promenade descend l'axe -z depuis la première
// pierre en (0, 0, 0) ; l'horizon du ciel cylindrique est à hauteur d'yeux (C3-R3).
export type Vecteur = readonly [number, number, number];
export type Pose = { position: Vecteur; cible: Vecteur; fov: number };

// Six stations de même taille et même lumière, alternées de part et d'autre du chemin.
export const STATIONS: readonly Vecteur[] = Array.from({ length: 6 }, (_, i) => [
  i % 2 ? 2.4 : -2.4,
  0,
  -12 - i * 10,
]);

const station = (i: number): Pose => {
  const [x, y, z] = STATIONS[i]!;
  return { position: [x * 0.35, 1.7, z + 5.5], cible: [x, y + 0.9, z], fov: 45 };
};

// Ouverture (storyboard, section 2) : gros plan sur la pierre de la Base au match-cut de 3 s, translation
// latérale lente jusqu'à 4,40 s, puis élargissement jusqu'à la vue large, horizon à hauteur d'yeux.
export const OUVERTURE_PIERRE: Pose = { position: [-1.5, 0.55, 2.4], cible: [-0.2, 0.35, 0], fov: 35 };
export const OUVERTURE_TRANSLATION: Pose = { position: [1.5, 0.55, 2.4], cible: [0.2, 0.35, 0], fov: 35 };
const OUVERTURE_LARGE: Pose = { position: [0, 2.2, 9], cible: [0, 1.8, -60], fov: 50 };

const POSES: Record<string, Pose> = {
  opening: OUVERTURE_LARGE,
  'base-237-source': { position: [0.9, 1.15, 2.6], cible: [0, 0.45, 0], fov: 42 },
  'project-fast-shipping-logistics': station(0),
  'project-batobaye-market': station(1),
  'project-mboamarkets': station(2),
  'project-ziris': station(3),
  'project-shopitech': station(4),
  'project-artvibe-cameroun': station(5),
  'skills-public-trace': { position: [0, 5, -62], cible: [0, 2, -110], fov: 50 },
  career: { position: [-6, 3, -70], cible: [0, 1, -84], fov: 48 },
  'ground-track': { position: [0, 12, -74], cible: [0, 0, -96], fov: 50 },
  'open-channel': { position: [0, 40, -40], cible: [0, 0, -46], fov: 40 },
};

export const POSES_CHAPITRES: readonly Pose[] = CHAPITRES.map((chapitre) => {
  const pose = POSES[chapitre.id];
  if (!pose) throw new Error(`Pose manquante : ${chapitre.id}`);
  return pose;
});
