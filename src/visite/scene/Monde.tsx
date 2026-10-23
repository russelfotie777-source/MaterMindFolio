import { useMemo } from 'react';
import type { MeshBasicMaterial, PointsMaterial } from 'three';

import { STATIONS } from '../poses';
import { BASALTE, graine, pierre } from './basalte';

// Décor réel du lot G3, sans post-traitement ni glow (contrat, refus V1) :
// - ciel : décor d'aube C3 sur un cylindre vu de l'intérieur, horizon recalé à hauteur d'yeux (C3-R3) ;
// - zénith : étoiles en points 3D ;
// - pierres : basalte mat #323131 à relief procédural, aucune texture téléchargée (C3-R4, basalte.ts).
const RAYON_CIEL = 200;
const HAUTEUR_CIEL = (2 * Math.PI * RAYON_CIEL) / 2; // panorama 2:1 sans déformation
const HORIZON_IMAGE = 0.355; // part de l'image sous l'horizon, mesurée sur le décor d'aube

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

function Pierres() {
  const formes = useMemo(
    () => [
      { geometrie: pierre(0.9, 11, 40), position: [0, 0.35, 0] as const },
      ...STATIONS.map((station, i) => ({
        geometrie: pierre(1.1, 101 + i, 20),
        position: [station[0], 0.4, station[2]] as const,
      })),
    ],
    [],
  );
  return (
    <group>
      {formes.map(({ geometrie, position }, i) => (
        <mesh key={i} geometry={geometrie} position={position}>
          <meshStandardMaterial vertexColors roughness={0.96} metalness={0} />
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
      <directionalLight position={[6, 10, 12]} color="#ffffff" intensity={3.2} />
      {/* Chemin étroit : la mer de nuages du décor reste visible de part et d'autre. */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -45]}>
        <planeGeometry args={[9, 110]} />
        <meshStandardMaterial color={BASALTE} roughness={1} />
      </mesh>
      <Pierres />
      <Balises materiau={materiaux.balises} />
      <Etoiles materiau={materiaux.etoiles} />
      <Ciel materiau={materiaux.ciel} />
    </>
  );
}
