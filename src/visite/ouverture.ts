// Ouverture 0–10 s (DR-1, 02_STORYBOARD_VISITE, section 2 ; ADR-004, amendements 2 et 4 de Codex) :
// seuls repères temporels de la chorégraphie, relus par la timeline, le rendu et les tests.
// Toutes les bascules de couche sont des coupes franches : aucun fondu, aucun morph.
export const OUVERTURE = {
  // 0,00–0,90 : portrait réel et identité, déjà présents à l'image 0.
  coupeMonogramme: 0.9,
  // 1,00–2,65 : révélation du tracé, puis 350 ms d'immobilité.
  trace: { debut: 1, fin: 2.65 },
  // 3,00 : match-cut sec vers la pierre ; 3,00–4,40 translation latérale ; 4,40–5,85 élargissement.
  matchCut: 3,
  translation: { debut: 3, fin: 4.4 },
  elargissement: { debut: 4.4, fin: 5.85 },
  // 6,00 : six stations allumées ensemble, montée d'au moins 400 ms ; index égal jusqu'à 7,80.
  allumage: { debut: 6, duree: 0.4 },
  index: { debut: 6, fin: 7.8 },
  // 8,00–8,30 : ouverture d'exposition du firmament, sans flash ; 8,30 est l'image stable du chapitre.
  exposition: { debut: 8, fin: 8.3 },
} as const;

export type Couche = 'identite' | 'monogramme' | 'scene' | 'index';

// Couche DOM visible à l'instant t : identité, monogramme sur surface ivoire, puis la scène 3D seule ou
// sous l'index des six projets. Au-delà de l'ouverture, la scène reste seule.
export function coucheA(temps: number): Couche {
  if (temps < OUVERTURE.coupeMonogramme) return 'identite';
  if (temps < OUVERTURE.matchCut) return 'monogramme';
  if (temps >= OUVERTURE.index.debut && temps < OUVERTURE.index.fin) return 'index';
  return 'scene';
}

// Révélation séquentielle des primitives du monogramme dans l'ordre du master : la progression globale
// (0 à 1) est répartie au prorata de leur longueur, si bien que la vitesse du trait reste constante.
export function segmenter(progression: number, longueurs: readonly number[]): number[] {
  const total = longueurs.reduce((somme, longueur) => somme + longueur, 0);
  let parcouru = Math.min(Math.max(progression, 0), 1) * total;
  return longueurs.map((longueur) => {
    const part = longueur === 0 ? 1 : Math.min(Math.max(parcouru / longueur, 0), 1);
    parcouru -= longueur;
    return part;
  });
}
