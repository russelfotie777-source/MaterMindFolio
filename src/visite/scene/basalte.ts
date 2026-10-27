import { BufferAttribute, BufferGeometry, Color } from 'three';

// Pierres de basalte procédurales (C3-R4 ; amendement 5 de Codex) : basalte mat #323131, masse irrégulière,
// grain d'agrégat, pores, fissures et arêtes usées, sans aucune texture téléchargée. Tout est déterministe :
// même pierre à chaque visite et à chaque capture.
export const BASALTE = '#323131';

export function graine(depart: number) {
  let s = depart;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function hacher(x: number, y: number, z: number, sel: number) {
  let h = Math.imul(x, 374761393) ^ Math.imul(y, 668265263) ^ Math.imul(z, 1440670441) ^ sel;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
}

const lisser = (t: number) => t * t * (3 - 2 * t);

// Bruit de valeur 3D, interpolé et lissé : de 0 à 1. Écrit sans tableau ni fermeture, car il est
// appelé quelques centaines de milliers de fois au chargement.
function bruit(x: number, y: number, z: number, sel: number) {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const iz = Math.floor(z);
  const fx = lisser(x - ix);
  const fy = lisser(y - iy);
  const fz = lisser(z - iz);
  const a = hacher(ix, iy, iz, sel);
  const b = hacher(ix + 1, iy, iz, sel);
  const c = hacher(ix, iy + 1, iz, sel);
  const d = hacher(ix + 1, iy + 1, iz, sel);
  const e = hacher(ix, iy, iz + 1, sel);
  const f = hacher(ix + 1, iy, iz + 1, sel);
  const g = hacher(ix, iy + 1, iz + 1, sel);
  const h = hacher(ix + 1, iy + 1, iz + 1, sel);
  const bas = a + (b - a) * fx + (c + (d - c) * fx - (a + (b - a) * fx)) * fy;
  const haut = e + (f - e) * fx + (g + (h - g) * fx - (e + (f - e) * fx)) * fy;
  return bas + (haut - bas) * fz;
}

// Somme d'octaves centrée : de -1 à 1 environ.
export function octaves(x: number, y: number, z: number, sel: number, nombre: number) {
  let somme = 0;
  let amplitude = 1;
  let total = 0;
  for (let i = 0; i < nombre; i++) {
    const f = 2 ** i;
    somme += amplitude * (bruit(x * f, y * f, z * f, sel + i) * 2 - 1);
    total += amplitude;
    amplitude /= 2;
  }
  return somme / total;
}

// Icosphère indexée, construite directement : chaque face de l'icosaèdre est découpée en grille, et les
// sommets partagés entre faces sont fusionnés par une clé numérique. Le relief est ainsi calculé une
// seule fois par sommet et les normales sont lisses, sans le coût des UV de IcosahedronGeometry.
const T = (1 + Math.sqrt(5)) / 2;
const ICOSAEDRE = [
  [-1, T, 0],
  [1, T, 0],
  [-1, -T, 0],
  [1, -T, 0],
  [0, -1, T],
  [0, 1, T],
  [0, -1, -T],
  [0, 1, -T],
  [T, 0, -1],
  [T, 0, 1],
  [-T, 0, -1],
  [-T, 0, 1],
] as const;
const FACES = [
  [0, 11, 5],
  [0, 5, 1],
  [0, 1, 7],
  [0, 7, 10],
  [0, 10, 11],
  [1, 5, 9],
  [5, 11, 4],
  [11, 10, 2],
  [10, 7, 6],
  [7, 1, 8],
  [3, 9, 4],
  [3, 4, 2],
  [3, 2, 6],
  [3, 6, 8],
  [3, 8, 9],
  [4, 9, 5],
  [2, 4, 11],
  [6, 2, 10],
  [8, 6, 7],
  [9, 8, 1],
] as const;

function icosphere(segments: number) {
  const vus = new Map<number, number>();
  const positions: number[] = [];
  const index: number[] = [];
  const sommet = (x: number, y: number, z: number) => {
    const longueur = Math.hypot(x, y, z);
    const [nx, ny, nz] = [x / longueur, y / longueur, z / longueur];
    const cle =
      (Math.round(nx * 1e4) + 1e4) * 4e8 + (Math.round(ny * 1e4) + 1e4) * 2e4 + (Math.round(nz * 1e4) + 1e4);
    let numero = vus.get(cle);
    if (numero === undefined) {
      numero = positions.length / 3;
      vus.set(cle, numero);
      positions.push(nx, ny, nz);
    }
    return numero;
  };
  for (const [ia, ib, ic] of FACES) {
    const [a, b, c] = [ICOSAEDRE[ia], ICOSAEDRE[ib], ICOSAEDRE[ic]];
    // grille[i][j] : point a + (b - a)·i/n + (c - a)·j/n, pour i + j ≤ n.
    const grille: number[][] = [];
    for (let i = 0; i <= segments; i++) {
      const ligne: number[] = [];
      for (let j = 0; j <= segments - i; j++) {
        const u = i / segments;
        const v = j / segments;
        ligne.push(
          sommet(
            a[0] + (b[0] - a[0]) * u + (c[0] - a[0]) * v,
            a[1] + (b[1] - a[1]) * u + (c[1] - a[1]) * v,
            a[2] + (b[2] - a[2]) * u + (c[2] - a[2]) * v,
          ),
        );
      }
      grille.push(ligne);
    }
    for (let i = 0; i < segments; i++) {
      for (let j = 0; j < segments - i; j++) {
        index.push(grille[i]![j]!, grille[i + 1]![j]!, grille[i]![j + 1]!);
        if (j < segments - i - 1) index.push(grille[i + 1]![j]!, grille[i + 1]![j + 1]!, grille[i]![j + 1]!);
      }
    }
  }
  const geometrie = new BufferGeometry();
  geometrie.setAttribute('position', new BufferAttribute(new Float32Array(positions), 3));
  geometrie.setIndex(index);
  return geometrie;
}

// `segments` règle la finesse du maillage : plus fin pour la pierre de la Base, vue en gros plan à 3 s.
// `couleur` est l'albédo moyen : le basalte C3 par défaut, plus clair dans le monde de l'accueil.
export function pierre(rayon: number, depart: number, segments: number, couleur: string = BASALTE) {
  const geometrie = icosphere(segments);
  const hasard = graine(depart);
  const sel = Math.floor(hasard() * 1e6);
  // Fissures : quelques plans qui traversent la pierre, creusés en sillons étroits.
  const fissures = Array.from({ length: 3 }, () => {
    const normale = [hasard() - 0.5, hasard() - 0.5, hasard() - 0.5];
    const longueur = Math.hypot(...normale);
    return {
      normale: normale.map((v) => v / longueur),
      decalage: (hasard() - 0.5) * 0.8,
      largeur: 0.025 + hasard() * 0.025,
      profondeur: 0.02 + hasard() * 0.025,
    };
  });
  const sommets = geometrie.getAttribute('position');
  const couleurs = new Float32Array(sommets.count * 3);
  const base = new Color(couleur);
  for (let i = 0; i < sommets.count; i++) {
    const x = sommets.getX(i);
    const y = sommets.getY(i);
    const z = sommets.getZ(i);
    const masse = 0.16 * octaves(x * 1.3, y * 1.3, z * 1.3, sel, 4);
    const grain = 0.03 * octaves(x * 6, y * 6, z * 6, sel + 10, 3);
    const pore = bruit(x * 18, y * 18, z * 18, sel + 20);
    const creux = pore > 0.7 ? (pore - 0.7) * 0.08 : 0;
    const sillon = fissures.reduce((total, { normale, decalage, largeur, profondeur }) => {
      const distance = Math.abs(normale[0]! * x + normale[1]! * y + normale[2]! * z - decalage);
      return distance < largeur ? total + profondeur * (1 - distance / largeur) ** 2 : total;
    }, 0);
    const echelle = rayon * (1 + masse + grain - creux - sillon);
    sommets.setXYZ(i, x * echelle * 1.25, y * echelle * 0.62, z * echelle);
    // Albédo à peine modulé : grain plus clair, pores et fissures plus sombres, toujours mat.
    const teinte = 1 + grain * 3 - creux * 4 - sillon * 6;
    couleurs.set([base.r * teinte, base.g * teinte, base.b * teinte], i * 3);
  }
  geometrie.setAttribute('color', new BufferAttribute(couleurs, 3));
  geometrie.computeVertexNormals();
  return geometrie;
}
