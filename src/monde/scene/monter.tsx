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
  Fog,
  Group,
  HemisphereLight,
  Mesh,
  MeshBasicMaterial,
  type Object3D,
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

import {
  ECRAN as DALLE,
  FUJI as MONT,
  ILES,
  type Pose,
  poses,
  progression,
  SOLEIL,
  type Vecteur,
} from '../parcours';
import { animerCartouches, type Cartouches, type Point } from './cartouches';
import { cadreEcran } from './geometries';
import {
  CIEL,
  COMETE,
  ECRAN,
  ETOILES,
  FUJI,
  LUCIOLES,
  NUAGES,
  PETALES,
  SOLEIL as SHADER_SOLEIL,
} from './shaders';
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
  Fog,
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
// Page affichée par le monde : les sections de l'accueil, un point de vue fixe (avec l'écran de projet à
// charger, le conteneur du cartouche qu'il relie et le monogramme à tracer s'il le faut), ou l'arrêt.
export type PageMonde =
  | { sections: readonly HTMLElement[] }
  | { pose: Pose; ecran?: number; cartouche?: HTMLElement | null; trace?: boolean }
  | { arret: true };
export type Monde = { definirPage: (page: PageMonde) => void; detruire: () => void };

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
  textures: TexturesMonde,
  { pret, naviguer, trait }: { pret: () => void; naviguer: (lien: string) => void; trait: SVGSVGElement },
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

  // Un corps céleste n'apparaît qu'avec sa carte : jamais de disque noir pendant le chargement.
  const habiller = <M extends MeshBasicMaterial | MeshStandardMaterial>(materiau: M, url: string) => {
    materiau.visible = false;
    materiau.map = charger(url, () => {
      materiau.visible = true;
    });
    return materiau;
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
      materiau: new MeshBasicMaterial({ color: '#ffb8de', toneMapped: false, fog: false }),
    },
    // Écrans des projets : trame de nuit jusqu'à ce que la capture réelle soit chargée puis révélée.
    ecrans: textures.ecrans.map(() =>
      shader(ECRAN, { uCarte: { value: null }, uRevele: { value: 0 }, uSurvol: { value: 0 } }),
    ),
    // Cadres de lumière : chacun part du coin tourné vers le texte du cartouche, opposé à l'île.
    cadres: {
      tubes: ILES.map(({ cote }) => {
        const tube = cadreEcran(DALLE.largeur + 0.8, DALLE.hauteur + 0.8, cote === -1 ? 1 : -1);
        tube.setDrawRange(0, 0);
        return tube;
      }),
      materiau: new MeshBasicMaterial({ vertexColors: true, toneMapped: false }),
    },
    corps: CORPS.map(({ id, rayon, position, anneau, emissif }) => ({
      rayon,
      position,
      materiau: habiller(
        emissif
          ? new MeshBasicMaterial({ toneMapped: false })
          : new MeshStandardMaterial({ roughness: 1, metalness: 0, fog: false }),
        textures.cartes[id],
      ),
      anneau: anneau
        ? habiller(
            new MeshStandardMaterial({
              transparent: true,
              side: DoubleSide,
              depthWrite: false,
              roughness: 1,
              fog: false,
            }),
            textures.cartes.anneaux,
          )
        : null,
    })),
  };

  // Les captures réelles des projets ne sont téléchargées qu'à l'approche de leur île. Lues telles
  // quelles (sans conversion d'espace colorimétrique) : le shader de l'écran écrit en sRGB.
  const ecransDemandes = new Set<number>();
  const ecransPrets = new Set<number>();
  const chargerEcrans = (position: number) => {
    textures.ecrans.forEach((url, k) => {
      if (ecransDemandes.has(k) || Math.abs(position - (k + 1)) > 1.6) return;
      ecransDemandes.add(k);
      const carte = chargeur.load(url, () => ecransPrets.add(k));
      carte.anisotropy = 4;
      cartes.push(carte);
      materiaux.ecrans[k]!.uniforms.uCarte!.value = carte;
    });
  };

  // Matérialisation d'un écran, une fois par visite : la capture se lève derrière son front de bruit,
  // puis le cadre de lumière fait le tour de l'écran et revient au coin d'où part le trait du cartouche.
  const ecransReveles = new Set<number>();
  const tours = ILES.map(() => ({ progres: 0 }));
  const reveler = (k: number) => {
    if (ecransReveles.has(k) || !ecransPrets.has(k)) return;
    ecransReveles.add(k);
    gsap.to(materiaux.ecrans[k]!.uniforms.uRevele!, { value: 1, duration: 1.7, ease: 'power2.out' });
    const tube = materiaux.cadres.tubes[k]!;
    const total = tube.index?.count ?? 0;
    const cadre = tours[k]!;
    gsap.to(cadre, {
      progres: 1,
      duration: 1.5,
      delay: 0.25,
      ease: 'power2.inOut',
      onUpdate: () => tube.setDrawRange(0, Math.floor((total * cadre.progres) / 3) * 3),
    });
  };

  // Cartouches de l'accueil et point du cadre d'où part leur trait, projeté dans la fenêtre.
  let cartouches: Cartouches | null = null;
  const groupes: (Object3D | undefined)[] = [];
  const groupe = (k: number) => (groupes[k] ??= store.getState().scene.getObjectByName(`ecran-groupe-${k}`));
  const coin = new Vector3();
  const ancre = (k: number, bas: boolean, versTexte: 1 | -1): Point | null => {
    const dalle = groupe(k);
    if (!dalle) return null;
    if (bas) coin.set(-(DALLE.largeur / 2 + 0.4), -(DALLE.hauteur / 2 + 0.4), 0);
    else coin.set(versTexte * (DALLE.largeur / 2 + 0.4), DALLE.hauteur / 2 + 0.4, 0);
    dalle.localToWorld(coin).project(camera);
    if (coin.z > 1) return null;
    return {
      x: ((coin.x + 1) / 2) * document.documentElement.clientWidth,
      y: ((1 - coin.y) / 2) * innerHeight,
    };
  };
  const survolLisse = textures.ecrans.map(() => 0);

  const store = root.render(<Univers materiaux={materiaux} />);

  // Page affichée : l'accueil suit le défilement le long de ses sections ; une autre route pose la caméra
  // sur un point de vue fixe ; la visite, qui a sa propre scène, arrête ce monde.
  let page: PageMonde = { arret: true };
  const sections = () => ('sections' in page ? page.sections : []);

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
    mesures = sections().map((section) => ({
      haut: section.getBoundingClientRect().top + scrollY,
      hauteur: section.offsetHeight,
    }));
    pixel.value = dpr * Math.min(innerHeight / 900, 1.4);
  };

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
    if (lien) naviguer(lien);
  };
  addEventListener('pointermove', surPointeur, { passive: true });
  addEventListener('click', surClic);

  let position = 0;
  const voulue = { position: new Vector3(), cible: new Vector3() };
  const cible = new Vector3();
  const droite = new Vector3();
  const haut = new Vector3(0, 1, 0);
  let precedent = performance.now();
  let premiere = true;

  // Raccord : à chaque changement de page, la caméra part de là où elle est et rejoint son nouveau point
  // de vue d'un seul mouvement amorti, sans rebond. La toute première entrée part du ciel.
  const RACCORD = 2.6;
  const ENTREE = 3.2;
  let raccord = {
    depart: new Vector3(0, 300, 380),
    departCible: new Vector3(0, 40, -300),
    duree: ENTREE,
    ecoule: 0,
  };
  const adoucir = (x: number) => 1 - Math.pow(1 - x, 3);

  // Le monogramme se trace à l'approche du final, ou sur la page de contact.
  let trace = 0;
  const revelerTrace = (dt: number) => {
    if ('sections' in page) {
      const fin = sections().length - 1;
      const x = Math.min(Math.max((position - (fin - 0.9)) / 0.75, 0), 1);
      trace = x * x * (3 - 2 * x);
    } else if ('pose' in page && page.trace) {
      trace = Math.min(trace + dt / 2.2, 1);
    } else {
      trace = Math.max(trace - dt, 0);
    }
    materiaux.trace.materiau.visible = trace > 0;
    for (const tube of materiaux.trace.tubes) {
      const total = tube.index?.count ?? 0;
      tube.setDrawRange(0, Math.floor((total * trace) / 3) * 3);
    }
  };

  const tick = () => {
    const maintenant = performance.now();
    const dt = Math.min((maintenant - precedent) / 1000, 0.1);
    precedent = maintenant;
    temps.value += dt;
    parallaxe.x += (pointeur.x - parallaxe.x) * (1 - Math.exp(-dt * 3));
    parallaxe.y += (pointeur.y - parallaxe.y) * (1 - Math.exp(-dt * 3));

    if ('sections' in page) {
      // Amortissement exponentiel : la caméra rejoint le défilement sans dépassement.
      position += (progression(scrollY, mesures, innerHeight) - position) * (1 - Math.exp(-dt * 4.5));
      const t = Math.min(Math.max(position / (sections().length - 1), 0), 1);
      chemin.positions.getPoint(t, voulue.position);
      chemin.cibles.getPoint(t, voulue.cible);
      chargerEcrans(position);
    } else if ('pose' in page) {
      voulue.position.set(...page.pose.position);
      voulue.cible.set(...page.pose.cible);
      if (page.ecran !== undefined) chargerEcrans(page.ecran + 1);
    }

    if (raccord.ecoule < raccord.duree) {
      raccord.ecoule += dt;
      const e = adoucir(Math.min(raccord.ecoule / raccord.duree, 1));
      camera.position.lerpVectors(raccord.depart, voulue.position, e);
      cible.lerpVectors(raccord.departCible, voulue.cible, e);
    } else {
      camera.position.copy(voulue.position);
      cible.copy(voulue.cible);
    }
    revelerTrace(dt);
    droite.subVectors(cible, camera.position).cross(haut).normalize();
    camera.position.addScaledVector(droite, parallaxe.x * 2.4);
    camera.position.y -= parallaxe.y * 1.6;
    camera.lookAt(cible);
    camera.updateMatrixWorld();
    cameraMonde.value.copy(camera.position);
    viser();

    // Station posée : la caméra est presque arrivée devant une île. Son écran se matérialise dès
    // l'approche ; son cartouche se lève à l'arrivée et reçoit le trait du cadre.
    if ('sections' in page) {
      const proche = Math.round(position);
      if (Math.abs(position - proche) < 0.5 && proche >= 1 && proche <= textures.ecrans.length) {
        reveler(proche - 1);
      }
      // Le cartouche attend que la caméra se pose : il se lève dans le dernier instant de l'arrivée.
      const posee = Math.abs(position - proche) < 0.15 ? proche : -1;
      cartouches?.activer(posee);
      const focus = cartouches?.focalisee() ?? -1;
      const station = (focus !== -1 ? focus : posee) - 1;
      const bas = innerWidth < 768;
      const section = sections()[station + 1];
      // Le trait ne part du cadre qu'une fois le cadre entièrement tracé.
      cartouches?.relier(
        station >= 0 && station < textures.ecrans.length && tours[station]!.progres >= 1
          ? ancre(station, bas, ILES[station]!.cote === -1 ? 1 : -1)
          : null,
        bas ? 'bas' : section?.dataset.panneau === 'gauche' ? 'gauche' : 'droite',
      );
    } else if ('pose' in page && page.ecran !== undefined) {
      // Étude de cas : l'écran, vu de face, tient la droite du cadre ; le cartouche est à sa gauche.
      reveler(page.ecran);
      const bas = innerWidth < 768;
      cartouches?.relier(
        tours[page.ecran]!.progres >= 1 ? ancre(page.ecran, bas, -1) : null,
        bas ? 'bas' : 'gauche',
      );
    }
    survolLisse.forEach((valeur, k) => {
      const voulu = survol === k ? 1 : 0;
      const suivant = valeur + (voulu - valeur) * (1 - Math.exp(-dt * 8));
      survolLisse[k] = suivant;
      materiaux.ecrans[k]!.uniforms.uSurvol!.value = suivant;
      groupe(k)?.scale.setScalar(1 + suivant * 0.03);
    });

    advance(maintenant);
    if (premiere) {
      premiere = false;
      pret();
    }
  };
  gsap.ticker.lagSmoothing(0);

  // Fenêtre redimensionnée : nouvelle taille et nouveau chemin. Page redimensionnée (polices, images,
  // passage au monde actif) : nouvelles mesures des sections.
  const surFenetre = () => {
    void root.configure({ ...configuration, size: taille() }).then(mesurer);
  };
  addEventListener('resize', surFenetre);
  const redimensionner = new ResizeObserver(mesurer);
  redimensionner.observe(document.body);

  const definirPage = (suivante: PageMonde) => {
    const etaitArrete = 'arret' in page;
    if (!premiere) {
      // La caméra repart de sa pose réelle, parallaxe comprise.
      raccord = {
        depart: camera.position.clone(),
        departCible: cible.clone(),
        duree: RACCORD,
        ecoule: 0,
      };
    } else if ('sections' in suivante && scrollY > innerHeight * 0.2) {
      raccord.ecoule = raccord.duree;
    } else if (!('sections' in suivante)) {
      raccord.duree = RACCORD;
    }
    page = suivante;
    cartouches?.detruire();
    if ('sections' in page) cartouches = animerCartouches(page.sections, trait);
    else if ('pose' in page && page.cartouche) {
      // Hors accueil, le cartouche se lève dès l'arrivée sur la page, pendant le vol de la caméra.
      cartouches = animerCartouches([page.cartouche], trait);
      cartouches.activer(0);
    } else cartouches = null;
    mesurer();
    if ('sections' in page) position = progression(scrollY, mesures, innerHeight);
    if ('arret' in page) gsap.ticker.remove(tick);
    else if (etaitArrete) {
      precedent = performance.now();
      gsap.ticker.add(tick);
    }
  };

  return {
    definirPage,
    detruire() {
      gsap.ticker.remove(tick);
      removeEventListener('pointermove', surPointeur);
      removeEventListener('click', surClic);
      document.documentElement.style.cursor = '';
      redimensionner.disconnect();
      removeEventListener('resize', surFenetre);
      cartouches?.detruire();
      gsap.killTweensOf([...materiaux.ecrans.map((materiau) => materiau.uniforms.uRevele), ...tours]);
      root.unmount();
      cartes.forEach((carte) => carte.dispose());
      const { ecrans, cadres, corps, trace, ...shaders } = materiaux;
      Object.values(shaders).forEach((materiau) => materiau.dispose());
      ecrans.forEach((materiau) => materiau.dispose());
      cadres.tubes.forEach((tube) => tube.dispose());
      cadres.materiau.dispose();
      corps.forEach(({ materiau, anneau }) => [materiau, anneau].forEach((m) => m?.dispose()));
      trace.tubes.forEach((tube) => tube.dispose());
      trace.materiau.dispose();
    },
  };
}
