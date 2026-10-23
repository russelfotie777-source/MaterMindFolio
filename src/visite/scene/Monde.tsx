import { useMemo } from 'react';
import { IcosahedronGeometry, type MeshBasicMaterial, type PointsMaterial } from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

import { STATIONS } from '../poses';

// Décor réel du lot G3, sans post-traitement ni glow (contrat, refus V1) :
// - ciel : décor d'aube C3 sur un cylindre vu de l'intérieur, horizon recalé à hauteur d'yeux (C3-R3) ;
// - zénith : étoiles en points 3D ;
// - pierres : basalte mat #323131 à relief procédural, aucune texture téléchargée (C3-R4).
const RAYON_CIEL = 200;
const HAUTEUR_CIEL = (2 * Math.PI * RAYON_CIEL) / 2; // panorama 2:1 sans déformation
const HORIZON_IMAGE = 0.355; // part de l'image sous l'horizon, mesurée sur le décor d'aube
const BASALTE = '#323131';

// Pseudo-aléatoire déterministe : même monde à chaque visite et à chaque capture.
function graine(depart: number) {
  let s = depart;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

// Matériaux partagés avec la timeline : seule la boucle unique fait varier exposition du ciel, opacité
// du firmament et allumage des balises (ouverture, storyboard section 2). Ils sont créés hors de React.
export type Materiaux = {
  ciel: MeshBasicMaterial;
  etoiles: PointsMaterial;
  balises: MeshBasicMaterial;
};

function Ciel({ materiau }: { materiau: MeshBasicMaterial }) {
  const centre = 1.6 + (0.5 - HORIZON_IMAGE) * HAUTEUR_CIEL;
  return (
    <mesh position={[0, centre, 0]} material={materiau}>
      <cylinderGeometry args={[RAYON_CIEL, RAYON_CIEL, HAUTEUR_CIEL, 96, 1, true]} />
    </mesh>
  );
}

function Etoiles({ materiau }: { materiau: PointsMaterial }) {
  const positions = useMemo(() => {
    const hasard = graine(237);
    const points = new Float32Array(1600 * 3);
    for (let i = 0; i < 1600; i++) {
      const azimut = hasard() * Math.PI * 2;
      const hauteur = 0.25 + hasard() * 0.75; // zénith seulement, jamais sur l'horizon
      const rayon = RAYON_CIEL * 0.9;
      const plan = Math.sqrt(1 - hauteur * hauteur) * rayon;
      points.set([Math.cos(azimut) * plan, hauteur * rayon, Math.sin(azimut) * plan], i * 3);
    }
    return points;
  }, []);
  return (
    <points material={materiau}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
    </points>
  );
}

function pierre(rayon: number, depart: number) {
  // Sommets fusionnés : les normales calculées ensuite sont lissées, sans facettes au gros plan de 3 s.
  const geometrie = mergeVertices(
    new IcosahedronGeometry(rayon, 6).deleteAttribute('normal').deleteAttribute('uv'),
  );
  const hasard = graine(depart);
  const sommets = geometrie.getAttribute('position');
  const bosses = Array.from({ length: 6 }, () => [
    hasard() - 0.5,
    hasard() - 0.5,
    hasard() - 0.5,
    0.06 + hasard() * 0.12,
  ]);
  for (let i = 0; i < sommets.count; i++) {
    const x = sommets.getX(i);
    const y = sommets.getY(i);
    const z = sommets.getZ(i);
    const relief = bosses.reduce((total, [bx, by, bz, force]) => {
      const d = Math.hypot(x / rayon - bx! * 2, y / rayon - by! * 2, z / rayon - bz! * 2);
      return total + force! * Math.max(0, 1 - d);
    }, 0);
    const echelle = 1 + relief - 0.02 * Math.sin(x * 9 + z * 7);
    sommets.setXYZ(i, x * echelle * 1.25, y * echelle * 0.62, z * echelle);
  }
  geometrie.computeVertexNormals();
  return geometrie;
}

function Pierres() {
  const formes = useMemo(
    () => [
      { geometrie: pierre(0.9, 11), position: [0, 0.35, 0] as const },
      ...STATIONS.map((station, i) => ({
        geometrie: pierre(1.1, 101 + i),
        position: [station[0], 0.4, station[2]] as const,
      })),
    ],
    [],
  );
  return (
    <group>
      {formes.map(({ geometrie, position }, i) => (
        <mesh key={i} geometry={geometrie} position={position}>
          <meshStandardMaterial color={BASALTE} roughness={0.96} metalness={0} />
        </mesh>
      ))}
    </group>
  );
}

// Six balises identiques, une trace solaire verticale derrière chaque pierre de station : elles
// s'allument ensemble à 6 s, sans halo ni bloom, et restent lisibles de loin.
function Balises({ materiau }: { materiau: MeshBasicMaterial }) {
  return (
    <group>
      {STATIONS.map(([x, , z], i) => (
        <mesh key={i} position={[x, 1.3, z - 0.9]} material={materiau}>
          <cylinderGeometry args={[0.06, 0.06, 2.6, 12]} />
        </mesh>
      ))}
    </group>
  );
}

export function Monde({ materiaux }: { materiaux: Materiaux }) {
  return (
    <>
      <color attach="background" args={['#0e0b17']} />
      <fog attach="fog" args={['#1a103e', 40, 190]} />
      {/* Lumière d'aube : ciel violet, sol sombre, clé rose venue de l'horizon, contre-jour discret. */}
      <hemisphereLight args={['#a461cb', '#1a103e', 2.2]} />
      <directionalLight position={[0, 8, -120]} color="#f06aa6" intensity={3} />
      <directionalLight position={[10, 14, 16]} color="#ffffff" intensity={1.2} />
      {/* Chemin étroit : la mer de nuages du décor reste visible de part et d'autre. */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -45]}>
        <planeGeometry args={[9, 110]} />
        <meshStandardMaterial color="#323131" roughness={1} />
      </mesh>
      <Pierres />
      <Balises materiau={materiaux.balises} />
      <Etoiles materiau={materiaux.etoiles} />
      <Ciel materiau={materiaux.ciel} />
    </>
  );
}
