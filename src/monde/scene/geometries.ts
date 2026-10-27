import {
  BufferAttribute,
  CatmullRomCurve3,
  Color,
  CurvePath,
  CylinderGeometry,
  LatheGeometry,
  LineCurve3,
  TubeGeometry,
  Vector2,
  Vector3,
} from 'three';

import { graine, octaves } from '@/visite/scene/basalte';

// Géométries procédurales du monde : aucune n'est téléchargée, toutes sont déterministes.

// Fuji : profil concave dont la pente se raidit vers le sommet sans jamais devenir verticale, cratère
// tronqué, ravines creusées dans les flancs.
export function fuji(rayon: number, hauteur: number) {
  const sommet = rayon * 0.075;
  const profil: Vector2[] = [];
  for (let i = 0; i <= 48; i++) {
    const t = i / 48;
    const pente = 0.82 * Math.pow(1 - t, 1.55) + 0.18 * (1 - t);
    profil.push(new Vector2(sommet + (rayon - sommet) * pente, hauteur * t));
  }
  profil.push(new Vector2(sommet * 0.6, hauteur - 6), new Vector2(0, hauteur - 9));
  const geometrie = new LatheGeometry(profil, 192);
  const hasard = graine(3776);
  const ravines = Array.from({ length: 22 }, () => [hasard() * Math.PI * 2, 0.012 + hasard() * 0.03]);
  const sommets = geometrie.getAttribute('position');
  for (let i = 0; i < sommets.count; i++) {
    const x = sommets.getX(i);
    const y = sommets.getY(i);
    const z = sommets.getZ(i);
    const angle = Math.atan2(x, z);
    // Les ravines s'effacent vers le pied, où la pente s'adoucit.
    const creux = ravines.reduce((total, [a, force]) => {
      const ecart = Math.abs(Math.atan2(Math.sin(angle - a!), Math.cos(angle - a!)));
      return total + force! * Math.max(0, 1 - ecart * 14);
    }, 0);
    const relief =
      1 - creux * Math.min(1, (y / hauteur) * 2.2) + octaves(x * 0.01, y * 0.01, z * 0.01, 37, 3) * 0.03;
    sommets.setX(i, x * relief);
    sommets.setZ(i, z * relief);
  }
  geometrie.computeVertexNormals();
  return geometrie;
}

// Île flottante : un plateau d'herbe vivante posé sur un cône de roche irrégulier, plus sombre vers sa
// pointe. Deux géométries, pour deux matériaux mats.
export function ile(rayon: number, depart: number) {
  const hasard = graine(depart);
  const sel = Math.floor(hasard() * 1e6);

  const roche = new CylinderGeometry(rayon, rayon * 0.12, rayon * 1.5, 40, 14);
  const positions = roche.getAttribute('position');
  const couleurs = new Float32Array(positions.count * 3);
  const claire = new Color('#7b6a9c');
  const sombre = new Color('#24183a');
  const teinte = new Color();
  for (let i = 0; i < positions.count; i++) {
    const x = positions.getX(i);
    const y = positions.getY(i);
    const z = positions.getZ(i);
    const t = (y + rayon * 0.75) / (rayon * 1.5);
    const bosse = octaves(x * 0.22, y * 0.22, z * 0.22, sel, 4);
    const echelle = 1 + bosse * 0.38 * (1 - t * 0.6);
    positions.setXYZ(i, x * echelle, y + bosse * rayon * 0.25 * (1 - t), z * echelle);
    teinte.copy(sombre).lerp(claire, Math.min(1, t * 1.1 + bosse * 0.4));
    couleurs.set([teinte.r, teinte.g, teinte.b], i * 3);
  }
  roche.setAttribute('color', new BufferAttribute(couleurs, 3));
  roche.computeVertexNormals();

  // Plateau d'herbe : dôme tourné en anneaux concentriques (ombrage lisse, sans éventail de triangles),
  // bord légèrement retombant, relief et teinte modulés par le même bruit.
  const profil: Vector2[] = [];
  for (let n = 0; n <= 14; n++) {
    const t = n / 14;
    profil.push(new Vector2(rayon * t, rayon * 0.1 * (1 - Math.pow(t, 2.4))));
  }
  profil.push(new Vector2(rayon * 1.04, -rayon * 0.03), new Vector2(rayon * 0.97, -rayon * 0.12));
  const herbe = new LatheGeometry(profil.reverse(), 64);
  const brins = herbe.getAttribute('position');
  const verts = new Float32Array(brins.count * 3);
  const vif = new Color('#36e083');
  const profond = new Color('#0f7a44');
  for (let i = 0; i < brins.count; i++) {
    const x = brins.getX(i);
    const y = brins.getY(i);
    const z = brins.getZ(i);
    const bosse = octaves(x * 0.3, 0, z * 0.3, sel + 7, 3);
    brins.setXYZ(i, x * (1 + bosse * 0.06), y + bosse * rayon * 0.05, z * (1 + bosse * 0.06));
    teinte.copy(profond).lerp(vif, Math.min(1, Math.max(0, 0.55 + bosse * 1.4 + y * 0.05)));
    verts.set([teinte.r, teinte.g, teinte.b], i * 3);
  }
  herbe.setAttribute('color', new BufferAttribute(verts, 3));
  herbe.computeVertexNormals();

  return { roche, herbe, hauteurRoche: rayon * 1.5 };
}

// Glycine : tronc tortueux, ombrelle de fleurs et de feuilles, grappes pendantes qui pâlissent vers
// leur pointe. Renvoie la géométrie du tronc et la liste des fleurs à instancier (position relative au
// pied de l'arbre, taille, couleur).
export type Fleur = { position: Vector3; taille: number; couleur: Color };

const GRAPPE = ['#6a12c9', '#7e13e0', '#a461cb', '#c9a0ff', '#e9d8ff', '#fbf3ff'].map((c) => new Color(c));
const OMBRELLE = ['#7e13e0', '#a461cb', '#c9a0ff', '#d728bf', '#f06aa6'].map((c) => new Color(c));
const FEUILLES = ['#1f9d55', '#2fd27a', '#14703e'].map((c) => new Color(c));

export function glycine(depart: number, hauteur = 10, envergure = 7.5) {
  const hasard = graine(depart);
  const courbe = new CatmullRomCurve3([
    new Vector3(0, -0.5, 0),
    new Vector3((hasard() - 0.5) * 1.2, hauteur * 0.35, (hasard() - 0.5) * 1.2),
    new Vector3((hasard() - 0.5) * 2, hauteur * 0.7, (hasard() - 0.5) * 2),
    new Vector3((hasard() - 0.5) * 1.5, hauteur, (hasard() - 0.5) * 1.5),
  ]);
  const tronc = new TubeGeometry(courbe, 24, 0.55, 8, false);

  const fleurs: Fleur[] = [];
  const sommet = courbe.getPoint(1);
  const dome = (r: number) => sommet.y + 1.6 * (1 - (r / envergure) ** 2);
  for (let i = 0; i < 300; i++) {
    const angle = hasard() * Math.PI * 2;
    const r = Math.sqrt(hasard()) * envergure;
    const feuille = hasard() < 0.32;
    fleurs.push({
      position: new Vector3(
        sommet.x + Math.cos(angle) * r,
        dome(r) + (hasard() - 0.5) * 1.1,
        sommet.z + Math.sin(angle) * r,
      ),
      taille: 0.45 + hasard() * 0.45,
      couleur: (feuille ? FEUILLES : OMBRELLE)[Math.floor(hasard() * (feuille ? 3 : 5))]!.clone(),
    });
  }
  for (let g = 0; g < 44; g++) {
    const angle = hasard() * Math.PI * 2;
    const r = (0.25 + Math.sqrt(hasard()) * 0.75) * envergure;
    const longueur = 7 + Math.floor(hasard() * 7);
    const attache = new Vector3(
      sommet.x + Math.cos(angle) * r,
      dome(r) - 0.6,
      sommet.z + Math.sin(angle) * r,
    );
    for (let n = 0; n < longueur; n++) {
      const t = n / (longueur - 1);
      fleurs.push({
        position: new Vector3(
          attache.x + Math.sin(n * 0.7 + g) * 0.12,
          attache.y - n * 0.42,
          attache.z + Math.cos(n * 0.6 + g) * 0.12,
        ),
        taille: 0.5 - t * 0.32,
        couleur: GRAPPE[Math.min(GRAPPE.length - 1, Math.floor(t * GRAPPE.length))]!.clone(),
      });
    }
  }
  return { tronc, fleurs };
}

// Cadre de lumière d'un écran : un tube fin qui fait le tour de l'écran en partant du coin haut tourné
// vers le texte et y revient, pour que le trait du cartouche en sorte. Couleur du rose de la trace à la
// glycine le long du tour ; le tracé se révèle avec setDrawRange, comme le monogramme du final.
export function cadreEcran(largeur: number, hauteur: number, versTexte: 1 | -1) {
  const x = (largeur / 2) * versTexte;
  const y = hauteur / 2;
  const coins = [
    new Vector3(x, y, 0),
    new Vector3(-x, y, 0),
    new Vector3(-x, -y, 0),
    new Vector3(x, -y, 0),
    new Vector3(x, y, 0),
  ];
  const tour = new CurvePath<Vector3>();
  for (let i = 0; i < 4; i++) tour.add(new LineCurve3(coins[i], coins[i + 1]));
  const tube = new TubeGeometry(tour, 320, 0.075, 6, false);
  const positions = tube.getAttribute('position');
  const couleurs = new Float32Array(positions.count * 3);
  const rose = new Color('#ffb8de');
  const glycine = new Color('#c9a0ff');
  const teinte = new Color();
  // Les sommets du tube sont rangés anneau par anneau, du début à la fin du tour.
  const parAnneau = 7;
  for (let i = 0; i < positions.count; i++) {
    const t = Math.floor(i / parAnneau) / 320;
    teinte.copy(rose).lerp(glycine, Math.sin(t * Math.PI));
    couleurs.set([teinte.r, teinte.g, teinte.b], i * 3);
  }
  tube.setAttribute('color', new BufferAttribute(couleurs, 3));
  return tube;
}
