import { advance, createRoot, extend } from '@react-three/fiber';
import { gsap } from 'gsap';
import {
  BufferAttribute,
  BufferGeometry,
  Color,
  CylinderGeometry,
  DirectionalLight,
  Fog,
  Group,
  HemisphereLight,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Points,
  PointsMaterial,
} from 'three';

import { approche, CHAPITRES, DUREE_TOTALE, chapitreA, etapeA } from '../chapitres';
import { DEPLACEMENT } from '../courbes';
import { POSES_CHAPITRES } from '../poses';
import type { StoreVisite } from '../store';
import { creerLecteurTemps } from '../temps';
import { Monde } from './Monde';

// Catalogue explicite : jamais <Canvas>, qui embarquerait tout Three.js (ADR-004, section 2, point 1).
extend({
  BufferAttribute,
  BufferGeometry,
  Color,
  CylinderGeometry,
  DirectionalLight,
  Fog,
  Group,
  HemisphereLight,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PlaneGeometry,
  Points,
  PointsMaterial,
});

export type Scene = { detruire: () => void };

// Monte la scène sur le canvas de l'îlot et la pilote par l'unique boucle applicative : le ticker GSAP
// lit l'horloge, place la timeline, signale les chapitres au contrôleur, puis appelle advance() de R3F.
export async function demarrerScene(
  canvas: HTMLCanvasElement,
  store: StoreVisite,
  ciel: string,
): Promise<Scene> {
  const mobile = matchMedia('(max-width: 767px)').matches;
  const camera = new PerspectiveCamera(50, 1, 0.1, 1000);
  const root = createRoot(canvas);
  const taille = () => ({ width: canvas.clientWidth, height: canvas.clientHeight, top: 0, left: 0 });
  // Chaque appel à configure() reprend toute la configuration : un appel sans `camera` ferait créer à
  // R3F une caméra par défaut, à la place de celle que pilote la timeline.
  const configuration = {
    camera,
    frameloop: 'never',
    dpr: Math.min(devicePixelRatio, mobile ? 1.5 : 2),
    gl: { antialias: true, powerPreference: 'high-performance', failIfMajorPerformanceCaveat: true },
  } as const;
  await root.configure({ ...configuration, size: taille() });

  // Une seule timeline, dont les labels sont les identifiants de chapitre (ADR-004, section 2, point 4).
  const pose = { px: 0, py: 0, pz: 0, cx: 0, cy: 0, cz: 0, fov: 50 };
  const aplatir = (i: number) => {
    const { position, cible, fov } = POSES_CHAPITRES[i]!;
    return {
      px: position[0],
      py: position[1],
      pz: position[2],
      cx: cible[0],
      cy: cible[1],
      cz: cible[2],
      fov,
    };
  };
  Object.assign(pose, aplatir(0));
  const timeline = gsap.timeline({ paused: true });
  CHAPITRES.forEach((chapitre, i) => {
    timeline.addLabel(chapitre.id, chapitre.debut);
    if (i > 0) timeline.to(pose, { ...aplatir(i), duration: approche(i), ease: DEPLACEMENT }, chapitre.debut);
  });
  timeline.set({}, {}, DUREE_TOTALE);

  const rendre = () => {
    camera.position.set(pose.px, pose.py, pose.pz);
    camera.fov = pose.fov;
    camera.updateProjectionMatrix();
    camera.lookAt(pose.cx, pose.cy, pose.cz);
    advance(performance.now());
  };

  root.render(<Monde ciel={ciel} surCharge={() => rendre()} />);

  const temps = creerLecteurTemps(() => performance.now() / 1000);
  // Une coupe, pas un mouvement : la scène se pose directement sur la pose stable du chapitre.
  const poser = (chapitre: number) => {
    temps.aller(CHAPITRES[chapitre]!.debut + approche(chapitre));
    timeline.time(temps.position());
    rendre();
  };

  const tick = () => {
    const position = Math.min(temps.position(), DUREE_TOTALE);
    timeline.time(position);
    const etat = store.getState();
    const chapitre = chapitreA(position);
    if (chapitre !== etat.chapitre) store.envoyer({ type: 'CHAPTER_REACHED', chapitre });
    const etape = etapeA(position);
    if (etape !== store.getState().etape) store.envoyer({ type: 'STAGE_REACHED', etape });
    if (position >= DUREE_TOTALE) store.envoyer({ type: 'COMPLETE' });
    rendre();
  };
  gsap.ticker.lagSmoothing(0);

  let chapitreAffiche = store.getState().chapitre;
  const synchroniser = () => {
    const etat = store.getState();
    const enMouvement = etat.phase === 'playing' && etat.mouvement === 'immersif';
    if (etat.chapitre !== chapitreAffiche && etat.phase !== 'playing') poser(etat.chapitre);
    chapitreAffiche = etat.chapitre;
    if (enMouvement && !temps.enLecture()) {
      temps.jouer();
      gsap.ticker.add(tick);
    } else if (!enMouvement && temps.enLecture()) {
      temps.pause();
      gsap.ticker.remove(tick);
    }
  };
  const desabonner = store.subscribe(synchroniser);

  const redimensionner = new ResizeObserver(() => {
    void root.configure({ ...configuration, size: taille() }).then(rendre);
  });
  redimensionner.observe(canvas);

  poser(store.getState().chapitre);
  synchroniser();

  return {
    detruire() {
      desabonner();
      redimensionner.disconnect();
      gsap.ticker.remove(tick);
      timeline.kill();
      root.unmount();
    },
  };
}
