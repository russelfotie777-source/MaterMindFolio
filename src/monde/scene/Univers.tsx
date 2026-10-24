import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import {
  BufferAttribute,
  BufferGeometry,
  IcosahedronGeometry,
  InstancedMesh,
  type Mesh,
  type MeshBasicMaterial,
  type MeshStandardMaterial,
  Object3D,
  RingGeometry,
  type ShaderMaterial,
  type TubeGeometry,
  Vector3,
} from 'three';

import { BASALTE, graine, pierre } from '@/visite/scene/basalte';

import { centreEcran, ECRAN, FUJI, ILES, placeTrace, poses, SOLEIL, type Vecteur } from '../parcours';
import { fuji, glycine, ile } from './geometries';

// Roche du monde : un basalte plus clair, teinté de violet, pour que le relief se lise même à contre-jour.
const ROCHE = '#6e6088';
const RAYON_ILE = 9;

// Matériaux et uniformes créés hors de React par monter.tsx : la boucle unique les fait vivre (temps,
// caméra, cartes chargées à la demande) sans jamais provoquer de rendu React.
export type MateriauxMonde = {
  ciel: ShaderMaterial;
  etoiles: ShaderMaterial;
  nuages: ShaderMaterial;
  fuji: ShaderMaterial;
  soleil: ShaderMaterial;
  petales: ShaderMaterial;
  lucioles: ShaderMaterial;
  ecrans: MeshBasicMaterial[];
  comete: ShaderMaterial;
  trace: { tubes: TubeGeometry[]; materiau: MeshBasicMaterial };
  corps: {
    materiau: MeshStandardMaterial | MeshBasicMaterial;
    rayon: number;
    position: Vecteur;
    anneau: MeshStandardMaterial | null;
  }[];
};

const RAYON_CIEL = 2600;
const v = (p: Vecteur): [number, number, number] => [p[0], p[1], p[2]];
const DIRECTION_SOLEIL = new Vector3(...SOLEIL).normalize();

function Ciel({ materiau }: { materiau: ShaderMaterial }) {
  return (
    <mesh material={materiau} renderOrder={-2}>
      <sphereGeometry args={[RAYON_CIEL, 48, 24]} />
    </mesh>
  );
}

function Etoiles({ materiau }: { materiau: ShaderMaterial }) {
  const geometrie = useMemo(() => {
    const hasard = graine(2370);
    const nombre = 3200;
    const positions = new Float32Array(nombre * 3);
    const graines = new Float32Array(nombre);
    for (let i = 0; i < nombre; i++) {
      const azimut = hasard() * Math.PI * 2;
      const hauteur = Math.pow(hasard(), 0.6) * 0.98 + 0.02;
      const plan = Math.sqrt(1 - hauteur * hauteur) * RAYON_CIEL * 0.92;
      positions.set([Math.cos(azimut) * plan, hauteur * RAYON_CIEL * 0.92, Math.sin(azimut) * plan], i * 3);
      graines[i] = hasard();
    }
    const resultat = new BufferGeometry();
    resultat.setAttribute('position', new BufferAttribute(positions, 3));
    resultat.setAttribute('aGraine', new BufferAttribute(graines, 1));
    return resultat;
  }, []);
  return <points geometry={geometrie} material={materiau} renderOrder={-1} />;
}

function Soleil({ materiau }: { materiau: ShaderMaterial }) {
  const position = DIRECTION_SOLEIL.clone().multiplyScalar(RAYON_CIEL * 0.9);
  // Toujours tourné vers le centre du monde, d'où la caméra le regarde.
  return (
    <mesh
      position={position}
      material={materiau}
      renderOrder={-1}
      onUpdate={(maillage: Mesh) => maillage.lookAt(0, 0, 0)}
    >
      <planeGeometry args={[900, 900]} />
    </mesh>
  );
}

function MerDeNuages({ materiau }: { materiau: ShaderMaterial }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -600]} material={materiau}>
      <planeGeometry args={[6000, 6000, 260, 260]} />
    </mesh>
  );
}

// Fuji : profil concave tourné autour de l'axe, crêtes irrégulières, cratère légèrement aplati.
function Fuji({ materiau }: { materiau: ShaderMaterial }) {
  const geometrie = useMemo(() => fuji(FUJI.rayon, FUJI.hauteur), []);
  return <mesh geometry={geometrie} material={materiau} position={v(FUJI.position)} />;
}

// Corps célestes du ciel d'accueil : vraies sphères aux cartes sous licence, anneaux de Saturne.
function Corps({ corps }: { corps: MateriauxMonde['corps'] }) {
  // Chaque planète tourne lentement sur son axe, chacune à sa vitesse.
  const spheres = useRef<(Mesh | null)[]>([]);
  useFrame((_, dt) => {
    spheres.current.forEach((sphere, i) => {
      if (sphere) sphere.rotation.y += dt * (0.03 + i * 0.008);
    });
  });
  return (
    <group>
      {corps.map(({ materiau, rayon, position, anneau }, i) => (
        <group key={i} position={v(position)} rotation={[0.2, 0, i % 2 ? 0.45 : -0.3]}>
          <mesh
            material={materiau}
            ref={(sphere) => {
              spheres.current[i] = sphere;
            }}
          >
            <sphereGeometry args={[rayon, 64, 32]} />
          </mesh>
          {anneau && <Anneau rayon={rayon} materiau={anneau} />}
        </group>
      ))}
    </group>
  );
}

function Anneau({ rayon, materiau }: { rayon: number; materiau: MeshStandardMaterial }) {
  const geometrie = useMemo(() => {
    const interieur = rayon * 1.24;
    const exterieur = rayon * 2.27;
    const resultat = new RingGeometry(interieur, exterieur, 128, 1);
    // La carte de l'anneau est radiale : u suit la distance au centre, v reste au milieu.
    const positions = resultat.getAttribute('position');
    const uv = resultat.getAttribute('uv');
    for (let i = 0; i < positions.count; i++) {
      const distance = Math.hypot(positions.getX(i), positions.getY(i));
      uv.setXY(i, (distance - interieur) / (exterieur - interieur), 0.5);
    }
    return resultat;
  }, [rayon]);
  return <mesh geometry={geometrie} material={materiau} rotation={[-Math.PI / 2, 0, 0]} />;
}

// Pierres flottantes de l'ouverture : basalte procédural, en suspension autour du titre.
const PIERRES_OUVERTURE: { position: Vecteur; rayon: number }[] = [
  { position: [-26, 22, 18], rayon: 3.2 },
  { position: [24, 30, 8], rayon: 2.4 },
  { position: [-14, 38, -20], rayon: 1.6 },
  { position: [34, 14, -10], rayon: 4.2 },
  { position: [-40, 8, -40], rayon: 5 },
  { position: [12, 44, -60], rayon: 2 },
  { position: [-6, 6, 30], rayon: 1.2 },
  { position: [46, 40, -80], rayon: 3 },
];

export function PierresFlottantes() {
  const formes = useMemo(
    () =>
      PIERRES_OUVERTURE.map(({ position, rayon }, i) => ({
        position,
        geometrie: pierre(rayon, 501 + i, 18, ROCHE),
      })),
    [],
  );
  // Les pierres flottent : une lente respiration verticale et une rotation à peine perceptible.
  const pierres = useRef<(Mesh | null)[]>([]);
  useFrame(({ clock }, dt) => {
    pierres.current.forEach((maillage, i) => {
      if (!maillage) return;
      maillage.position.y =
        PIERRES_OUVERTURE[i]!.position[1] + Math.sin(clock.elapsedTime * 0.5 + i * 1.7) * 0.9;
      maillage.rotation.y += dt * 0.05 * (i % 2 ? 1 : -1);
    });
  });
  return (
    <group>
      {formes.map(({ position, geometrie }, i) => (
        <mesh
          key={i}
          geometry={geometrie}
          position={v(position)}
          rotation={[i * 0.7, i * 1.3, i * 0.4]}
          ref={(maillage) => {
            pierres.current[i] = maillage;
          }}
        >
          <meshStandardMaterial vertexColors roughness={0.95} metalness={0} />
        </mesh>
      ))}
    </group>
  );
}

// Îles : roche flottante, plateau d'herbe vivante, glycine en fleurs, écran réel du projet tourné vers le
// chemin. Les glycines des six îles partagent une seule géométrie instanciée.
// La glycine se dresse sur le bord extérieur de l'île : l'écran, côté chemin, ne la cache jamais.
const pieds = ILES.map(({ cote, centre }) => new Vector3(centre[0] + cote * 6, centre[1], centre[2] - 3));
const arbres = () => ILES.map((_, k) => glycine(1717 + k * 31, 12, 8));

function Glycines({ fleurs }: { fleurs: ReturnType<typeof arbres> }) {
  const instances = useMemo(() => {
    const total = fleurs.reduce((somme, arbre) => somme + arbre.fleurs.length, 0);
    const maillage = new InstancedMesh(new IcosahedronGeometry(1, 1), undefined, total);
    const outil = new Object3D();
    let n = 0;
    fleurs.forEach((arbre, k) => {
      for (const { position, taille, couleur } of arbre.fleurs) {
        outil.position.copy(position).add(pieds[k]!);
        outil.scale.setScalar(taille);
        outil.updateMatrix();
        maillage.setMatrixAt(n, outil.matrix);
        maillage.setColorAt(n, couleur);
        n++;
      }
    });
    return maillage;
  }, [fleurs]);
  return (
    <primitive object={instances}>
      <meshStandardMaterial attach="material" roughness={0.7} metalness={0} />
    </primitive>
  );
}

function Iles({ ecrans }: { ecrans: MeshBasicMaterial[] }) {
  const formes = useMemo(
    () => ({
      iles: ILES.map((_, k) => ile(RAYON_ILE, 901 + k)),
      arbres: arbres(),
    }),
    [],
  );
  return (
    <group>
      {ILES.map(({ cote, centre }, k) => {
        const [x, y, z] = centre;
        const { roche, herbe, hauteurRoche } = formes.iles[k]!;
        return (
          <group key={k}>
            <mesh geometry={roche} position={[x, y - hauteurRoche / 2 - RAYON_ILE * 0.05, z]}>
              <meshStandardMaterial vertexColors roughness={0.95} metalness={0} />
            </mesh>
            <mesh geometry={herbe} position={[x, y, z]}>
              <meshStandardMaterial vertexColors roughness={1} metalness={0} />
            </mesh>
            <mesh geometry={formes.arbres[k]!.tronc} position={pieds[k]!}>
              <meshStandardMaterial color="#3a2450" roughness={1} />
            </mesh>
            <group position={v(centreEcran(k))} rotation={[0, -cote * ECRAN.rotation, 0]}>
              <mesh position={[0, 0, -0.42]}>
                <boxGeometry args={[ECRAN.largeur + 1.2, ECRAN.hauteur + 1.2, 0.7]} />
                <meshStandardMaterial color={BASALTE} roughness={0.9} />
              </mesh>
              <mesh material={ecrans[k]!} name={`ecran-${k}`}>
                <planeGeometry args={[ECRAN.largeur, ECRAN.hauteur]} />
              </mesh>
            </group>
          </group>
        );
      })}
      <Glycines fleurs={formes.arbres} />
    </group>
  );
}

function Lucioles({ materiau }: { materiau: ShaderMaterial }) {
  const geometrie = useMemo(() => {
    const hasard = graine(4242);
    const parIle = 60;
    const positions = new Float32Array(ILES.length * parIle * 3);
    const graines = new Float32Array(ILES.length * parIle * 3);
    ILES.forEach(({ centre }, k) => {
      for (let i = 0; i < parIle; i++) {
        const n = k * parIle + i;
        positions.set(
          [centre[0] + (hasard() - 0.5) * 34, centre[1] + hasard() * 22, centre[2] + (hasard() - 0.5) * 34],
          n * 3,
        );
        graines.set([hasard(), hasard(), hasard()], n * 3);
      }
    });
    const resultat = new BufferGeometry();
    resultat.setAttribute('position', new BufferAttribute(positions, 3));
    resultat.setAttribute('aGraine', new BufferAttribute(graines, 3));
    return resultat;
  }, []);
  return <points geometry={geometrie} material={materiau} />;
}

function Petales({ materiau }: { materiau: ShaderMaterial }) {
  const geometrie = useMemo(() => {
    const hasard = graine(808);
    const nombre = 1400;
    const positions = new Float32Array(nombre * 3);
    const graines = new Float32Array(nombre * 4);
    for (let i = 0; i < nombre; i++) {
      positions.set([(hasard() - 0.5) * 140, hasard() * 80, (hasard() - 0.5) * 180], i * 3);
      graines.set([hasard(), hasard(), hasard(), hasard()], i * 4);
    }
    const resultat = new BufferGeometry();
    resultat.setAttribute('position', new BufferAttribute(positions, 3));
    resultat.setAttribute('aGraine', new BufferAttribute(graines, 4));
    return resultat;
  }, []);
  // Le volume suit la caméra dans le shader : la boîte englobante ne doit jamais l'exclure du rendu.
  return <points geometry={geometrie} material={materiau} frustumCulled={false} />;
}

// Comète : un long plan dans le ciel, au-dessus de la mer de nuages, que le shader parcourt.
function Comete({ materiau }: { materiau: ShaderMaterial }) {
  return (
    <mesh position={[-120, 560, -1650]} rotation={[0, 0, -0.3]} material={materiau} renderOrder={-1}>
      <planeGeometry args={[1300, 18]} />
    </mesh>
  );
}

// TRACE 237 : le monogramme en tubes de lumière, au-dessus du Fuji, révélé à l'approche du final.
function Trace({ tubes, materiau }: MateriauxMonde['trace']) {
  const { position, echelle } = placeTrace();
  const [px, , pz] = poses(false).at(-1)!.position;
  // Face à la caméra finale : seule une rotation autour de la verticale, le signe ne se déforme jamais.
  const angle = Math.atan2(px - position[0], pz - position[2]);
  return (
    <group position={v(position)} rotation={[0, angle, 0]} scale={echelle}>
      {tubes.map((tube, i) => (
        <mesh key={i} geometry={tube} material={materiau} />
      ))}
    </group>
  );
}

export function Univers({ materiaux }: { materiaux: MateriauxMonde }) {
  return (
    <>
      <color attach="background" args={['#0b0718']} />
      {/* Perspective aérienne : la roche et les îles lointaines se fondent dans le rose de l'horizon. */}
      <fog attach="fog" args={['#b85fae', 260, 1500]} />
      <hemisphereLight args={['#b98cff', '#2a1050', 1.6]} />
      <directionalLight
        position={DIRECTION_SOLEIL.clone().multiplyScalar(100)}
        color="#ffc6a0"
        intensity={3.4}
      />
      {/* Lumière de face, venue du chemin : le basalte garde son relief même à contre-jour. */}
      <directionalLight position={[-40, 60, 140]} color="#e8c8ff" intensity={2.6} />
      <Ciel materiau={materiaux.ciel} />
      <Etoiles materiau={materiaux.etoiles} />
      <Soleil materiau={materiaux.soleil} />
      <Fuji materiau={materiaux.fuji} />
      <MerDeNuages materiau={materiaux.nuages} />
      <Corps corps={materiaux.corps} />
      <PierresFlottantes />
      <Iles ecrans={materiaux.ecrans} />
      <Lucioles materiau={materiaux.lucioles} />
      <Petales materiau={materiaux.petales} />
      <Comete materiau={materiaux.comete} />
      <Trace {...materiaux.trace} />
    </>
  );
}
