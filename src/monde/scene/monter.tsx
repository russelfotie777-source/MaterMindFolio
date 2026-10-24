import { advance, createRoot, extend } from '@react-three/fiber';
import { gsap } from 'gsap';
import {
  AdditiveBlending,
  BackSide,
  BoxGeometry,
  BufferAttribute,
  BufferGeometry,
  CatmullRomCurve3,
  Color,
  CylinderGeometry,
  DirectionalLight,
  DoubleSide,
  Group,
  HemisphereLight,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  Raycaster,
  PlaneGeometry,
  Points,
  RingGeometry,
  ShaderMaterial,
  SphereGeometry,
  SRGBColorSpace,
  type Texture,
  TextureLoader,
  Vector2,
  Vector3,
} from 'three';

import type { IdCarte } from '@/visite/corps';

import { FUJI as MONT, poses, progression, SOLEIL, type Vecteur } from '../parcours';
import { CIEL, COMETE, ETOILES, FUJI, LUCIOLES, NUAGES, PETALES, SOLEIL as SHADER_SOLEIL } from './shaders';
import { tubesMonogramme } from './trace';
import { type MateriauxMonde, Univers } from './Univers';

// Catalogue explicite : jamais <Canvas>, qui embarquerait tout Three.js (ADR-004, section 2, point 1).
extend({
  BoxGeometry,
  BufferAttribute,
  BufferGeometry,
  Color,
  CylinderGeometry,
  DirectionalLight,
  Group,
  HemisphereLight,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PlaneGeometry,
  Points,
  RingGeometry,
  SphereGeometry,
});

export type TexturesMonde = { cartes: Record<IdCarte, string>; ecrans: string[]; liens: string[] };
export type Monde = { detruire: () => void };

// Corps célestes du ciel d'accueil : grands, lointains, dispersés autour du Fuji. Aucun n'est un bouton.
const CORPS: { id: IdCarte; rayon: number; position: Vecteur; anneau?: boolean; emissif?: boolean }[] = [
  { id: 'saturne', rayon: 46, position: [-330, 230, -1200], anneau: true },
  { id: 'jupiter', rayon: 70, position: [520, 340, -1700] },
  { id: 'lune', rayon: 12, position: [120, 95, -420] },
  { id: 'mars', rayon: 9, position: [-150, 120, -520] },
  { id: 'neptune', rayon: 34, position: [-760, 420, -1650] },
  { id: 'uranus', rayon: 30, position: [820, 520, -1350] },
  { id: 'venus', rayon: 7, position: [300, 60, -900] },
];

// Monte le monde sur le canvas plein écran de l'accueil. Une seule boucle : le ticker GSAP lit le
// défilement et le pointeur, place la caméra sur son chemin, fait vivre les shaders, puis appelle
// advance() de R3F. La page HTML reste le contenu ; le monde n'en est que le décor animé.
export async function monterMonde(
  canvas: HTMLCanvasElement,
  sections: readonly HTMLElement[],
  textures: TexturesMonde,
  pret: () => void,
): Promise<Monde> {
  const mobile = matchMedia('(max-width: 767px)').matches;
  const camera = new PerspectiveCamera(50, 1, 0.5, 6000);
  const root = createRoot(canvas);
  // Le canvas couvre la fenêtre : sa taille vient de la fenêtre, car R3F fige ensuite celle du canvas
  // en pixels dans son style.
  const taille = () => ({
    width: document.documentElement.clientWidth,
    height: innerHeight,
    top: 0,
    left: 0,
  });
  const dpr = Math.min(devicePixelRatio, mobile ? 1.5 : 2);
  const configuration = {
    camera,
    frameloop: 'never',
    dpr,
    gl: { antialias: true, powerPreference: 'high-performance', failIfMajorPerformanceCaveat: true },
  } as const;
  await root.configure({ ...configuration, size: taille() });

  // Uniformes partagés : un seul temps, une seule position de caméra, une seule échelle de pixel.
  const temps = { value: 0 };
  const pixel = { value: dpr };
  const cameraMonde = { value: new Vector3() };
  const soleil = { value: new Vector3(...SOLEIL).normalize() };
  const shader = (
    source: { vertex: string; fragment: string },
    uniforms: Record<string, { value: unknown }>,
    options: Partial<ShaderMaterial> = {},
  ) =>
    Object.assign(
      new ShaderMaterial({ vertexShader: source.vertex, fragmentShader: source.fragment, uniforms }),
      options,
    );
  const chargeur = new TextureLoader();
  const cartes: Texture[] = [];
  const charger = (url: string, apres: () => void = () => undefined) => {
    const carte = chargeur.load(url, apres);
    carte.colorSpace = SRGBColorSpace;
    carte.anisotropy = 4;
    cartes.push(carte);
    return carte;
  };

  const materiaux: MateriauxMonde = {
    ciel: shader(CIEL, { uSoleil: soleil }, { side: BackSide, depthWrite: false }),
    etoiles: shader(
      ETOILES,
      { uTemps: temps, uPixel: pixel },
      { transparent: true, depthWrite: false, blending: AdditiveBlending },
    ),
    nuages: shader(NUAGES, { uTemps: temps, uSoleil: soleil, uCamera: cameraMonde }),
    fuji: shader(FUJI, { uSoleil: soleil, uCamera: cameraMonde, uSommet: { value: MONT.hauteur } }),
    soleil: shader(SHADER_SOLEIL, {}, { transparent: true, depthWrite: false, blending: AdditiveBlending }),
    petales: shader(
      PETALES,
      { uTemps: temps, uPixel: pixel, uCamera: cameraMonde, uVolume: { value: new Vector3(140, 80, 180) } },
      { transparent: true, depthWrite: false },
    ),
    lucioles: shader(
      LUCIOLES,
      { uTemps: temps, uPixel: pixel },
      { transparent: true, depthWrite: false, blending: AdditiveBlending },
    ),
    comete: shader(
      COMETE,
      { uTemps: temps },
      { transparent: true, depthWrite: false, blending: AdditiveBlending },
    ),
    trace: {
      tubes: tubesMonogramme(),
      materiau: new MeshBasicMaterial({ color: '#ffb8de', toneMapped: false }),
    },
    // Écrans des projets : couleur de nuit jusqu'à ce que la capture réelle soit chargée.
    ecrans: textures.ecrans.map(() => new MeshBasicMaterial({ color: '#1a103e', toneMapped: false })),
    corps: CORPS.map(({ id, rayon, position, anneau, emissif }) => ({
      rayon,
      position,
      materiau: emissif
        ? new MeshBasicMaterial({ map: charger(textures.cartes[id]), toneMapped: false })
        : new MeshStandardMaterial({ map: charger(textures.cartes[id]), roughness: 1, metalness: 0 }),
      anneau: anneau
        ? new MeshStandardMaterial({
            map: charger(textures.cartes.anneaux),
            transparent: true,
            side: DoubleSide,
            depthWrite: false,
            roughness: 1,
          })
        : null,
    })),
  };

  // Les captures réelles des projets ne sont téléchargées qu'à l'approche de leur île.
  const ecransCharges = new Set<number>();
  const chargerEcrans = (position: number) => {
    textures.ecrans.forEach((url, k) => {
      if (ecransCharges.has(k) || Math.abs(position - (k + 1)) > 1.6) return;
      ecransCharges.add(k);
      const materiau = materiaux.ecrans[k]!;
      materiau.map = charger(url, () => {
        materiau.color.set('#ffffff');
        materiau.needsUpdate = true;
      });
    });
  };

  const store = root.render(<Univers materiaux={materiaux} />);

  // Chemin de la caméra et mesure des sections ; recalculés à chaque redimensionnement.
  let chemin = { positions: new CatmullRomCurve3(), cibles: new CatmullRomCurve3() };
  let mesures: { haut: number; hauteur: number }[] = [];
  const mesurer = () => {
    const portrait = innerWidth < innerHeight;
    const etapes = poses(portrait);
    chemin = {
      positions: new CatmullRomCurve3(
        etapes.map((e) => new Vector3(...e.position)),
        false,
        'centripetal',
      ),
      cibles: new CatmullRomCurve3(
        etapes.map((e) => new Vector3(...e.cible)),
        false,
        'centripetal',
      ),
    };
    mesures = sections.map((section) => ({
      haut: section.getBoundingClientRect().top + scrollY,
      hauteur: section.offsetHeight,
    }));
    pixel.value = dpr * Math.min(innerHeight / 900, 1.4);
  };
  mesurer();

  // Pointeur : légère parallaxe de la caméra, amortie, jamais de rebond.
  const pointeur = { x: 0, y: 0 };
  const parallaxe = { x: 0, y: 0 };
  // Écrans cliquables : survolés, ils appellent le pointeur ; cliqués, ils ouvrent l'étude de cas. Un
  // élément interactif du HTML garde toujours la priorité, et le lien « Étude de cas » reste l'accès
  // au clavier.
  const rayon = new Raycaster();
  const ecranVise = new Vector2();
  let survol = -1;
  let viseeAJour = false;
  const surInteractif = (cible: EventTarget | null) =>
    cible instanceof Element && Boolean(cible.closest('a, button, input, textarea, select, summary'));
  const surPointeur = (evenement: PointerEvent) => {
    pointeur.x = (evenement.clientX / innerWidth) * 2 - 1;
    pointeur.y = (evenement.clientY / innerHeight) * 2 - 1;
    ecranVise.set(pointeur.x, -pointeur.y);
    viseeAJour = !surInteractif(evenement.target);
    if (!viseeAJour && survol !== -1) {
      survol = -1;
      document.documentElement.style.cursor = '';
    }
  };
  const viser = () => {
    if (!viseeAJour) return;
    viseeAJour = false;
    const { scene } = store.getState();
    const ecrans = textures.ecrans.map((_, k) => scene.getObjectByName(`ecran-${k}`)).filter((e) => !!e);
    rayon.setFromCamera(ecranVise, camera);
    const touche = rayon.intersectObjects(ecrans, false)[0];
    survol = touche ? Number(touche.object.name.replace('ecran-', '')) : -1;
    document.documentElement.style.cursor = survol === -1 ? '' : 'pointer';
  };
  const surClic = (evenement: MouseEvent) => {
    if (survol === -1 || surInteractif(evenement.target)) return;
    const lien = textures.liens[survol];
    if (lien) location.assign(lien);
  };
  addEventListener('pointermove', surPointeur, { passive: true });
  addEventListener('click', surClic);

  let position = progression(scrollY, mesures, innerHeight);
  const cible = new Vector3();
  const droite = new Vector3();
  const haut = new Vector3(0, 1, 0);
  let precedent = performance.now();
  let premiere = true;

  // Entrée : à la première visite en haut de page, la caméra descend du ciel vers l'ouverture en 3,2 s,
  // d'un seul mouvement amorti, sans rebond.
  const ENTREE = 3.2;
  let entree = scrollY < innerHeight * 0.2 ? 0 : ENTREE;
  const departCamera = new Vector3(0, 300, 380);
  const departCible = new Vector3(0, 40, -300);
  const versCible = new Vector3();
  const adoucir = (x: number) => 1 - Math.pow(1 - x, 3);

  // Le monogramme se trace à l'approche du final, du premier montant au disque solaire.
  const revelerTrace = () => {
    const fin = sections.length - 1;
    const x = Math.min(Math.max((position - (fin - 0.9)) / 0.75, 0), 1);
    const p = x * x * (3 - 2 * x);
    materiaux.trace.materiau.visible = p > 0;
    for (const tube of materiaux.trace.tubes) {
      const total = tube.index?.count ?? 0;
      tube.setDrawRange(0, Math.floor((total * p) / 3) * 3);
    }
  };

  const tick = () => {
    const maintenant = performance.now();
    const dt = Math.min((maintenant - precedent) / 1000, 0.1);
    precedent = maintenant;
    temps.value += dt;

    // Amortissement exponentiel : la caméra rejoint le défilement sans dépassement.
    const voulue = progression(scrollY, mesures, innerHeight);
    position += (voulue - position) * (1 - Math.exp(-dt * 4.5));
    parallaxe.x += (pointeur.x - parallaxe.x) * (1 - Math.exp(-dt * 3));
    parallaxe.y += (pointeur.y - parallaxe.y) * (1 - Math.exp(-dt * 3));
    chargerEcrans(position);

    const t = Math.min(Math.max(position / (sections.length - 1), 0), 1);
    chemin.positions.getPoint(t, camera.position);
    chemin.cibles.getPoint(t, cible);
    if (entree < ENTREE) {
      entree += dt;
      const e = adoucir(Math.min(entree / ENTREE, 1));
      camera.position.lerpVectors(departCamera, camera.position, e);
      versCible.lerpVectors(departCible, cible, e);
      cible.copy(versCible);
    }
    revelerTrace();
    droite.subVectors(cible, camera.position).cross(haut).normalize();
    camera.position.addScaledVector(droite, parallaxe.x * 2.4);
    camera.position.y -= parallaxe.y * 1.6;
    camera.lookAt(cible);
    cameraMonde.value.copy(camera.position);
    viser();

    advance(maintenant);
    if (premiere) {
      premiere = false;
      pret();
    }
  };
  gsap.ticker.lagSmoothing(0);
  gsap.ticker.add(tick);

  // Fenêtre redimensionnée : nouvelle taille et nouveau chemin. Page redimensionnée (polices, images,
  // passage au monde actif) : nouvelles mesures des sections.
  const surFenetre = () => {
    void root.configure({ ...configuration, size: taille() }).then(mesurer);
  };
  addEventListener('resize', surFenetre);
  const redimensionner = new ResizeObserver(mesurer);
  redimensionner.observe(document.body);

  return {
    detruire() {
      gsap.ticker.remove(tick);
      removeEventListener('pointermove', surPointeur);
      removeEventListener('click', surClic);
      document.documentElement.style.cursor = '';
      redimensionner.disconnect();
      removeEventListener('resize', surFenetre);
      root.unmount();
      cartes.forEach((carte) => carte.dispose());
      const { ecrans, corps, trace, ...shaders } = materiaux;
      Object.values(shaders).forEach((materiau) => materiau.dispose());
      ecrans.forEach((materiau) => materiau.dispose());
      corps.forEach(({ materiau, anneau }) => [materiau, anneau].forEach((m) => m?.dispose()));
      trace.tubes.forEach((tube) => tube.dispose());
      trace.materiau.dispose();
    },
  };
}
