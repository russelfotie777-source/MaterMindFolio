import { useMemo } from 'react';
import { BackSide, IcosahedronGeometry, RepeatWrapping, SRGBColorSpace, TextureLoader } from 'three';

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

// La texture est chargée hors du rendu React ; sa fin de chargement redemande une image, puisque la
// scène ne rend qu'à la demande hors lecture (frameloop « never »).
function Ciel({ image, surCharge }: { image: string; surCharge: () => void }) {
  const texture = useMemo(() => {
    const chargee = new TextureLoader().load(image, surCharge);
    chargee.colorSpace = SRGBColorSpace;
    chargee.wrapS = RepeatWrapping;
    // Vue de l'intérieur : l'image est retournée pour ne pas apparaître en miroir, et décalée pour que
    // le Fuji (x ≈ 0,486 du panorama) soit droit devant, sur l'axe -z de la promenade.
    chargee.repeat.x = -1;
    chargee.offset.x = -0.014;
    return chargee;
  }, [image, surCharge]);
  const centre = 1.6 + (0.5 - HORIZON_IMAGE) * HAUTEUR_CIEL;
  return (
    <mesh position={[0, centre, 0]}>
      <cylinderGeometry args={[RAYON_CIEL, RAYON_CIEL, HAUTEUR_CIEL, 96, 1, true]} />
      <meshBasicMaterial map={texture} side={BackSide} fog={false} toneMapped={false} />
    </mesh>
  );
}

function Etoiles() {
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
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#ffffff" size={1.6} sizeAttenuation={false} fog={false} toneMapped={false} />
    </points>
  );
}

function pierre(rayon: number, depart: number) {
  const geometrie = new IcosahedronGeometry(rayon, 4);
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

export function Monde({ ciel, surCharge }: { ciel: string; surCharge: () => void }) {
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
      <Etoiles />
      <Ciel image={ciel} surCharge={surCharge} />
    </>
  );
}
