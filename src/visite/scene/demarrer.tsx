import { advance, createRoot, extend } from '@react-three/fiber';
import { gsap } from 'gsap';
import {
  BackSide,
  BufferAttribute,
  BufferGeometry,
  Color,
  CylinderGeometry,
  DirectionalLight,
  DoubleSide,
  Fog,
  Group,
  HemisphereLight,
  type Material,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Points,
  PointsMaterial,
  RepeatWrapping,
  RingGeometry,
  SphereGeometry,
  SRGBColorSpace,
  type Texture,
  TextureLoader,
} from 'three';

import { CHAPITRES, DUREE_TOTALE, approche, chapitreA, etapeA, instantStable } from '../chapitres';
import { CORPS, type IdCarte } from '../corps';
import { DEPLACEMENT, LUMINANCE, REVELATION } from '../courbes';
import { OUVERTURE, coucheA, segmenter } from '../ouverture';
import { OUVERTURE_PIERRE, OUVERTURE_TRANSLATION, POSES_CHAPITRES, type Pose } from '../poses';
import type { StoreVisite } from '../store';
import { creerLecteurTemps } from '../temps';
import { type CorpsRendu, type Materiaux, Monde } from './Monde';

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
  RingGeometry,
  SphereGeometry,
});

export type Scene = { detruire: () => void };
export type Textures = { ciel: string; cartes: Record<IdCarte, string> };

// Exposition du ciel avant l'ouverture solaire de 8 s : l'aube reste lisible, jamais noire.
const EXPOSITION_AVANT_AUBE = 0.38;

// Variante portrait des poses : en dessous d'un cadre carré, le champ vertical s'élargit pour garder le
// champ horizontal du cadre carré (plafonné à 75°). Sans cela, un téléphone ne verrait que la pierre.
function fovAdapte(fov: number, aspect: number) {
  if (aspect >= 1) return fov;
  const demi = (fov * Math.PI) / 360;
  return Math.min(75, (Math.atan(Math.tan(demi) / aspect) * 360) / Math.PI);
}

const aplatir = ({ position, cible, fov }: Pose) => ({
  px: position[0],
  py: position[1],
  pz: position[2],
  cx: cible[0],
  cy: cible[1],
  cz: cible[2],
  fov,
});

// Monte la scène sur le canvas de l'îlot et la pilote par l'unique boucle applicative : le ticker GSAP
// lit l'horloge, place la timeline, signale chapitres et étapes au contrôleur, puis appelle advance().
// `ouverture` est la couche DOM de l'ouverture (identité, monogramme, index), absente hors de l'image 0.
export async function demarrerScene(
  canvas: HTMLCanvasElement,
  store: StoreVisite,
  textures: Textures,
  ouverture: HTMLElement | null,
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

  // Ciel : décor d'aube vu de l'intérieur du cylindre, retourné pour ne pas apparaître en miroir et
  // décalé pour que le Fuji (x ≈ 0,486 du panorama) soit droit devant, sur l'axe -z de la promenade.
  const chargeur = new TextureLoader();
  const texture = chargeur.load(textures.ciel, () => rendre());
  texture.colorSpace = SRGBColorSpace;
  texture.wrapS = RepeatWrapping;
  texture.repeat.x = -1;
  texture.offset.x = -0.014;
  const materiaux: Materiaux = {
    ciel: new MeshBasicMaterial({ map: texture, side: BackSide, fog: false, toneMapped: false }),
    etoiles: new PointsMaterial({
      color: '#ffffff',
      size: 1.6,
      sizeAttenuation: false,
      transparent: true,
      fog: false,
      toneMapped: false,
    }),
    balises: new MeshBasicMaterial({ color: '#f06aa6', transparent: true, fog: false, toneMapped: false }),
  };

  // Corps célestes (C3-R5) : une carte n'est téléchargée qu'à l'approche de son chapitre, et le corps
  // n'apparaît qu'une fois sa carte prête, jamais en sphère noire. Seuls les corps du chapitre sont rendus.
  const corps: CorpsRendu[] = CORPS.map((donnees) => ({
    donnees,
    materiau: donnees.emissif
      ? new MeshBasicMaterial({ transparent: true, fog: false, toneMapped: false })
      : new MeshStandardMaterial({ roughness: 1, metalness: 0, fog: false, transparent: true }),
    anneau: donnees.anneaux
      ? new MeshStandardMaterial({
          roughness: 1,
          metalness: 0,
          fog: false,
          transparent: true,
          side: DoubleSide,
          depthWrite: false,
        })
      : null,
  }));
  const cartes: Texture[] = [];
  const pretes = new Set<Material>();
  const habiller = (materiau: CorpsRendu['materiau'], id: IdCarte) => {
    const carte = chargeur.load(textures.cartes[id], () => {
      pretes.add(materiau);
      rendre();
    });
    carte.colorSpace = SRGBColorSpace;
    cartes.push(carte);
    materiau.map = carte;
    materiau.needsUpdate = true;
  };
  const peindreCorps = (chapitre: number) => {
    for (const { donnees, materiau, anneau } of corps) {
      const actif = donnees.chapitres.includes(chapitre);
      if (!materiau.map && (actif || donnees.chapitres.includes(chapitre + 1))) {
        habiller(materiau, donnees.id);
        if (anneau) habiller(anneau, 'anneaux');
      }
      const opacite = donnees.avecFirmament ? reglages.etoiles : 1;
      materiau.opacity = opacite;
      materiau.visible = actif && opacite > 0 && pretes.has(materiau);
      if (anneau) {
        anneau.opacity = opacite;
        anneau.visible = materiau.visible && pretes.has(anneau);
      }
    }
  };

  // Une seule timeline, dont les labels sont les identifiants de chapitre (ADR-004, section 2, point 4).
  // Elle n'interpole que la pose caméra et les réglages de l'ouverture ; le rendu les applique.
  const pose = aplatir(OUVERTURE_PIERRE);
  const reglages = { trace: 0, allumage: 0, exposition: EXPOSITION_AVANT_AUBE, etoiles: 0 };
  const timeline = gsap.timeline({ paused: true });
  const { trace, translation, elargissement, allumage, exposition } = OUVERTURE;
  timeline
    .to(reglages, { trace: 1, duration: trace.fin - trace.debut, ease: REVELATION }, trace.debut)
    .to(
      pose,
      { ...aplatir(OUVERTURE_TRANSLATION), duration: translation.fin - translation.debut, ease: DEPLACEMENT },
      translation.debut,
    )
    .to(
      pose,
      {
        ...aplatir(POSES_CHAPITRES[0]!),
        duration: elargissement.fin - elargissement.debut,
        ease: DEPLACEMENT,
      },
      elargissement.debut,
    )
    .to(reglages, { allumage: 1, duration: allumage.duree, ease: LUMINANCE }, allumage.debut)
    .to(
      reglages,
      { exposition: 1, etoiles: 1, duration: exposition.fin - exposition.debut, ease: LUMINANCE },
      exposition.debut,
    );
  CHAPITRES.forEach((chapitre, i) => {
    timeline.addLabel(chapitre.id, chapitre.debut);
    if (i > 0) {
      timeline.to(
        pose,
        { ...aplatir(POSES_CHAPITRES[i]!), duration: approche(i), ease: DEPLACEMENT },
        chapitre.debut,
      );
    }
  });
  timeline.set({}, {}, DUREE_TOTALE);

  // Couches DOM de l'ouverture : coupes franches par l'attribut data-couche, tracé par stroke-dashoffset
  // (CSSOM, compatible avec la CSP stricte). Seule la longueur visible du trait change.
  const traits = ouverture ? [...ouverture.querySelectorAll<SVGGeometryElement>('[data-trait]')] : [];
  const longueurs = traits.map((trait) => trait.getTotalLength());
  traits.forEach((trait, i) => {
    trait.style.strokeDasharray = `${longueurs[i]} ${longueurs[i]}`;
  });
  const peindreOuverture = (position: number) => {
    if (!ouverture) return;
    const couche = coucheA(position);
    if (ouverture.dataset.couche !== couche) ouverture.dataset.couche = couche;
    if (couche !== 'monogramme') return;
    segmenter(reglages.trace, longueurs).forEach((part, i) => {
      traits[i]!.style.strokeDashoffset = String(longueurs[i]! * (1 - part));
      // Opacité et non visibilité : une primitive marquée visible resterait apparente sous une couche masquée.
      traits[i]!.style.opacity = part > 0 ? '1' : '0';
    });
  };

  const rendre = () => {
    peindreOuverture(timeline.time());
    peindreCorps(chapitreA(timeline.time()));
    materiaux.ciel.color.setScalar(reglages.exposition);
    materiaux.etoiles.opacity = reglages.etoiles;
    materiaux.etoiles.visible = reglages.etoiles > 0;
    materiaux.balises.opacity = reglages.allumage;
    materiaux.balises.visible = reglages.allumage > 0;
    camera.position.set(pose.px, pose.py, pose.pz);
    camera.fov = fovAdapte(pose.fov, camera.aspect);
    camera.updateProjectionMatrix();
    camera.lookAt(pose.cx, pose.cy, pose.cz);
    advance(performance.now());
  };

  root.render(<Monde materiaux={materiaux} corps={corps} />);

  const temps = creerLecteurTemps(() => performance.now() / 1000);
  const aller = (position: number) => {
    temps.aller(position);
    timeline.time(position);
    rendre();
  };
  // Une coupe, pas un mouvement : la scène se pose directement sur l'image stable du chapitre.
  const poser = (chapitre: number) => aller(instantStable(chapitre));

  const tick = () => {
    const position = Math.min(temps.position(), DUREE_TOTALE);
    timeline.time(position);
    const chapitre = chapitreA(position);
    if (chapitre !== store.getState().chapitre) store.envoyer({ type: 'CHAPTER_REACHED', chapitre });
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

  // Une visite immersive qui commence par l'ouverture part de l'image 0 ; sinon, image stable.
  const { chapitre, mouvement } = store.getState();
  if (chapitre === 0 && mouvement === 'immersif') aller(0);
  else poser(chapitre);
  synchroniser();

  return {
    detruire() {
      desabonner();
      redimensionner.disconnect();
      gsap.ticker.remove(tick);
      timeline.kill();
      root.unmount();
      texture.dispose();
      cartes.forEach((carte) => carte.dispose());
      Object.values(materiaux).forEach((materiau) => materiau.dispose());
      corps.forEach(({ materiau, anneau }) => [materiau, anneau].forEach((m) => m?.dispose()));
    },
  };
}
