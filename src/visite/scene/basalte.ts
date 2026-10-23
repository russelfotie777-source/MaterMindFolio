import { BufferAttribute, Color, IcosahedronGeometry } from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

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

// Bruit de valeur 3D, interpolé et lissé : de 0 à 1.
function bruit(x: number, y: number, z: number, sel: number) {
  const [ix, iy, iz] = [Math.floor(x), Math.floor(y), Math.floor(z)];
  const [fx, fy, fz] = [lisser(x - ix), lisser(y - iy), lisser(z - iz)];
  const coin = (dx: number, dy: number, dz: number) => hacher(ix + dx, iy + dy, iz + dz, sel);
  const melange = (a: number, b: number, t: number) => a + (b - a) * t;
  return melange(
    melange(melange(coin(0, 0, 0), coin(1, 0, 0), fx), melange(coin(0, 1, 0), coin(1, 1, 0), fx), fy),
    melange(melange(coin(0, 0, 1), coin(1, 0, 1), fx), melange(coin(0, 1, 1), coin(1, 1, 1), fx), fy),
    fz,
  );
}

// Somme d'octaves centrée : de -1 à 1 environ.
function octaves(x: number, y: number, z: number, sel: number, nombre: number) {
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

// `detail` règle la finesse du maillage : plus fin pour la pierre de la Base, vue en gros plan à 3 s.
export function pierre(rayon: number, depart: number, detail: number) {
  const geometrie = mergeVertices(
    new IcosahedronGeometry(1, detail).deleteAttribute('normal').deleteAttribute('uv'),
  );
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
  const base = new Color(BASALTE);
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
