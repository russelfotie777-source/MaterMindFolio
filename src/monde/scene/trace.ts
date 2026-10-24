import { CatmullRomCurve3, CubicBezierCurve3, CurvePath, LineCurve3, TubeGeometry, Vector3 } from 'three';

import { PRIMITIVES } from '@/visite/monogramme';

// Monogramme TRACE 237 en trois dimensions : chaque primitive du master de Codex devient un tube, sans
// modifier le tracé (amendement 2 de l'ADR-004). Le lecteur de chemin ne connaît que les commandes du
// master : M, V, v, h, L, l et c. L'axe y du SVG descend : il est retourné pour le monde.
type Point = { x: number; y: number };

function sousChemins(d: string): CurvePath<Vector3>[] {
  const jetons = d.match(/[MVvhLlc]|-?\d*\.?\d+/g) ?? [];
  const chemins: CurvePath<Vector3>[] = [];
  let courant: Point = { x: 0, y: 0 };
  let chemin: CurvePath<Vector3> | null = null;
  const v3 = ({ x, y }: Point) => new Vector3(x, -y, 0);
  const ligne = (vers: Point) => {
    chemin!.add(new LineCurve3(v3(courant), v3(vers)));
    courant = vers;
  };
  let i = 0;
  let commande = '';
  const nombre = () => Number(jetons[i++]);
  while (i < jetons.length) {
    if (/[A-Za-z]/.test(jetons[i]!)) commande = jetons[i++]!;
    switch (commande) {
      case 'M':
        courant = { x: nombre(), y: nombre() };
        chemin = new CurvePath<Vector3>();
        chemins.push(chemin);
        break;
      case 'V':
        ligne({ x: courant.x, y: nombre() });
        break;
      case 'v':
        ligne({ x: courant.x, y: courant.y + nombre() });
        break;
      case 'h':
        ligne({ x: courant.x + nombre(), y: courant.y });
        break;
      case 'L':
        ligne({ x: nombre(), y: nombre() });
        break;
      case 'l': {
        const dx = nombre();
        ligne({ x: courant.x + dx, y: courant.y + nombre() });
        break;
      }
      case 'c': {
        const [x1, y1, x2, y2, x, y] = Array.from({ length: 6 }, nombre) as [
          number,
          number,
          number,
          number,
          number,
          number,
        ];
        const fin = { x: courant.x + x, y: courant.y + y };
        chemin!.add(
          new CubicBezierCurve3(
            v3(courant),
            v3({ x: courant.x + x1, y: courant.y + y1 }),
            v3({ x: courant.x + x2, y: courant.y + y2 }),
            v3(fin),
          ),
        );
        courant = fin;
        break;
      }
      default:
        throw new Error(`Commande SVG inattendue dans le monogramme : ${commande}`);
    }
  }
  return chemins;
}

// Tubes du monogramme, centrés sur l'origine, dans l'unité du master (960 × 360).
export function tubesMonogramme() {
  const tubes: TubeGeometry[] = [];
  for (const primitive of PRIMITIVES) {
    const rayon = primitive.epaisseur / 2;
    if (primitive.forme === 'circle') {
      const points = Array.from({ length: 48 }, (_, n) => {
        const angle = (n / 48) * Math.PI * 2;
        return new Vector3(
          primitive.cx + Math.cos(angle) * primitive.r,
          -(primitive.cy + Math.sin(angle) * primitive.r),
          0,
        );
      });
      tubes.push(new TubeGeometry(new CatmullRomCurve3(points, true), 96, rayon, 10, true));
      continue;
    }
    for (const chemin of sousChemins(primitive.d)) {
      tubes.push(new TubeGeometry(chemin, Math.max(32, chemin.curves.length * 40), rayon, 10, false));
    }
  }
  for (const tube of tubes) tube.translate(-480, 180, 0);
  return tubes;
}
