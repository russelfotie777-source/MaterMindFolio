import { CHAPITRES } from './chapitres';
import { STATIONS, type Vecteur } from './poses';

// Corps célestes réels de la promenade (storyboard, section 4 ; C3-R5 et amendement 5 de Codex) :
// vraies sphères aux cartes sous licence, sans glow, toujours secondaires au média et au texte.
// Chaque station a son repère, dans l'ordre chronologique et sans hiérarchie : même rayon et même
// distance pour les six, si bien qu'aucun corps ne paraît plus grand qu'un autre.
export type IdCorps =
  'soleil' | 'mercure' | 'venus' | 'lune' | 'mars' | 'jupiter' | 'saturne' | 'uranus' | 'neptune';

export type Corps = {
  id: IdCorps;
  rayon: number;
  position: Vecteur;
  // Chapitres où le corps est actif : chargé, visible et rendu.
  chapitres: readonly number[];
  // Soleil, Mercure et Vénus apparaissent avec le firmament, à l'ouverture d'exposition de 8 s.
  avecFirmament?: boolean;
  // Lumière propre (Soleil) plutôt qu'éclairage de la scène.
  emissif?: boolean;
  anneaux?: boolean;
  // Inclinaison de l'axe, en degrés, pour que chaque corps reste reconnaissable.
  inclinaison: number;
};

// Au plus quatre corps actifs à la fois sur mobile (amendement 5) ; un test unitaire le vérifie.
export const CORPS_ACTIFS_MAXIMUM = 4;

const RAYON_STATION = 2.6;
const ELOIGNEMENT = 70;
const ELEVATION = 11;

const PREMIER_PROJET = CHAPITRES.findIndex((chapitre) => chapitre.projet);
const TOUS = CHAPITRES.map((_, i) => i);

// Repère de la station k : de l'autre côté du chemin, loin devant, au-dessus de la mer de nuages. Il n'est
// actif que pendant sa propre station : le repère suivant ne lui dispute jamais l'attention. Sa carte est
// téléchargée dès la station précédente.
const repere = (id: IdCorps, k: number, inclinaison: number, anneaux = false): Corps => {
  const [x, , z] = STATIONS[k]!;
  return {
    id,
    rayon: RAYON_STATION,
    position: [-Math.sign(x) * 12, ELEVATION, z - ELOIGNEMENT],
    chapitres: [PREMIER_PROJET + k],
    inclinaison,
    anneaux,
  };
};

export const CORPS: readonly Corps[] = [
  // Le Soleil se lève à droite du Fuji, le bord bas sur l'horizon de la mer de nuages : un repère.
  {
    id: 'soleil',
    rayon: 6,
    position: [42, 7, -165],
    chapitres: TOUS,
    avecFirmament: true,
    emissif: true,
    inclinaison: 0,
  },
  {
    id: 'mercure',
    rayon: 1,
    position: [22, 9, -150],
    chapitres: [0, 1],
    avecFirmament: true,
    inclinaison: 0,
  },
  {
    id: 'venus',
    rayon: 1.5,
    position: [-48, 15, -140],
    chapitres: [0, 1],
    avecFirmament: true,
    inclinaison: 3,
  },
  repere('lune', 0, 7),
  repere('mars', 1, 25),
  repere('jupiter', 2, 3),
  repere('saturne', 3, 27, true),
  repere('uranus', 4, 98),
  repere('neptune', 5, 28),
];

// Cartes à charger : une par corps, plus l'anneau de Saturne.
export const IDS_CARTES = [...CORPS.map((corps) => corps.id), 'anneaux'] as const;
export type IdCarte = IdCorps | 'anneaux';

export const corpsActifs = (chapitre: number) => CORPS.filter((corps) => corps.chapitres.includes(chapitre));
