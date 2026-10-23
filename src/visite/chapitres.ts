// Les 12 chapitres de la visite (DR-1, 02_STORYBOARD_VISITE, section 3) : seule source des identifiants,
// fragments, temps et durées, relue par la timeline, le player, l'index DOM et les tests (ADR-004).
// Un fragment désigne un contenu stable, jamais un instant ni une pose de caméra.
export type Chapitre = {
  id: string;
  libelle: string;
  debut: number;
  duree: number;
  projet?: string;
};

export const CHAPITRES: readonly Chapitre[] = [
  { id: 'opening', libelle: 'Ouverture', debut: 0, duree: 10 },
  { id: 'base-237-source', libelle: 'Base 237 · SOURCE', debut: 10, duree: 12 },
  {
    id: 'project-fast-shipping-logistics',
    libelle: 'Fast Shipping Logistics',
    debut: 22,
    duree: 8,
    projet: 'fast-shipping-logistics',
  },
  {
    id: 'project-batobaye-market',
    libelle: 'Batobaye Market',
    debut: 30,
    duree: 8,
    projet: 'batobaye-market',
  },
  { id: 'project-mboamarkets', libelle: 'MBoa Market', debut: 38, duree: 8, projet: 'mboamarkets' },
  { id: 'project-ziris', libelle: 'ZIRIS', debut: 46, duree: 8, projet: 'ziris' },
  { id: 'project-shopitech', libelle: 'Shopitech', debut: 54, duree: 8, projet: 'shopitech' },
  {
    id: 'project-artvibe-cameroun',
    libelle: 'ArtVibeCamer',
    debut: 62,
    duree: 8,
    projet: 'artvibe-cameroun',
  },
  { id: 'skills-public-trace', libelle: 'Compétences · trace publique', debut: 70, duree: 10 },
  { id: 'career', libelle: 'Parcours', debut: 80, duree: 9 },
  { id: 'ground-track', libelle: 'Territoires', debut: 89, duree: 8 },
  { id: 'open-channel', libelle: 'Révélation · Contact', debut: 97, duree: 10 },
];

export const DUREE_TOTALE = CHAPITRES.reduce((total, chapitre) => total + chapitre.duree, 0);

export function chapitreA(temps: number): number {
  const index = CHAPITRES.findLastIndex((chapitre) => temps >= chapitre.debut);
  return Math.max(0, index);
}

export function chapitreDuFragment(fragment: string): number | null {
  const index = CHAPITRES.findIndex((chapitre) => `#${chapitre.id}` === fragment);
  return index === -1 ? null : index;
}

// Durée de l'approche avant la pose stable : 1,5 s pour un projet (storyboard, section 5), 2 s sinon.
export const approche = (index: number) => (index === 0 ? 0 : CHAPITRES[index]!.projet ? 1.5 : 2);

// Image stable d'un chapitre, où se pose un saut, un fragment ou le mouvement réduit : l'arrivée après
// l'approche, sauf pour l'ouverture, dont l'image stable est le monde complet à 8,30 s (ouverture.ts).
// Ainsi l'ouverture n'est jamais rejouée par un saut dans la même visite (storyboard, section 1).
export const instantStable = (index: number) =>
  index === 0 ? 8.3 : CHAPITRES[index]!.debut + approche(index);

// Enveloppe de chaque chapitre (storyboard, sections 5 et 6) : approche sans texte, lecture caméra
// immobile, puis dernière seconde de sortie où le panneau se retire avant le départ.
export type Etape = 'approche' | 'lecture' | 'sortie';
const SORTIE = 1;

export function etapeA(temps: number): Etape {
  const index = chapitreA(temps);
  const { debut, duree } = CHAPITRES[index]!;
  if (temps < debut + approche(index)) return 'approche';
  return temps >= debut + duree - SORTIE ? 'sortie' : 'lecture';
}
