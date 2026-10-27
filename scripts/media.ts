// Pipeline local des dérivés d'images (contrat, T15 et section 3.1, point 10). Les masters restent hors
// du dépôt public ou sous leur exception déclarée ; seuls les dérivés de public/media/approved/, nommés par
// leur empreinte, et leur manifeste src/lib/media/derives.json sont commités.
// `--check` vérifie les dérivés et le manifeste sans avoir besoin des masters : c'est le mode de la CI.
import { createHash } from 'node:crypto';
import { mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import sharp, { type Sharp } from 'sharp';

const DOSSIER = 'public/media/approved';
const MANIFESTE = 'src/lib/media/derives.json';

type Recadrage = { left: number; top: number; width: number; height: number };
type Variante = { nom: string; recadrage: Recadrage; largeurs: number[] };
type Qualite = { avif: number; webp: number };
type Source = {
  id: string;
  registre: string;
  chemin: string;
  sha256: string;
  credit: string;
  genere: boolean;
  // Texte alternatif d'une image porteuse d'information ; absent pour un décor.
  alt?: string;
  qualite?: Qualite;
  variantes: Variante[];
};

// Captures d'interface : texte fin, donc compression plus douce (la DR-1 a revu des WebP en qualité 84).
const CAPTURE: Qualite = { avif: 64, webp: 84 };
const BUREAU = [768, 1080, 1440];

// Média produit de la DR-1 (12_MEDIAS_PROJETS_C3) : capture réelle, couverture 1440 × 900 ou 390 × 844
// au même cadrage que les références visées par Russel, sans aucune retouche de contenu.
function capture(
  id: string,
  registre: string,
  nom: 'bureau' | 'mobile',
  chemin: string,
  sha256: string,
  recadrage: Recadrage,
  credit: string,
  alt: string,
): Source {
  const largeurs = nom === 'bureau' ? BUREAU : [390];
  return {
    id,
    registre,
    chemin,
    sha256,
    credit,
    genere: false,
    alt,
    qualite: CAPTURE,
    variantes: [{ nom, recadrage, largeurs }],
  };
}

// Carte d'un corps céleste (C3-R5) : projection équirectangulaire 2:1, 512 px de large sur téléphone et
// 1024 px au-delà ; seule la version WebP sert de texture (ADR-004, section 2, point 10).
function carte(id: string, registre: string, fichier: string, sha256: string, hauteur = 1024): Source {
  return {
    id,
    registre,
    chemin: `design/releases/DR-1/assets/planetes/${fichier}`,
    sha256,
    credit:
      'Carte : Solar System Scope (solarsystemscope.com), licence CC BY 4.0 (creativecommons.org/licenses/by/4.0) ; réduite et compressée pour HORIZON 237.',
    genere: false,
    variantes: [
      { nom: 'carte', recadrage: { left: 0, top: 0, width: 2048, height: hauteur }, largeurs: [512, 1024] },
    ],
  };
}

// Transformations permises par la DR-1 (05_ACTIFS_DROITS, section 10) : étalonnage visé par la direction
// artistique, recadrage, réduction et compression. Le master étalonné du portrait garde la géométrie et
// l'alpha du détourage validé ; sa recette reproductible vit dans design/tools/grade-portrait.mjs.
const SOURCES: Source[] = [
  {
    id: 'portrait',
    registre: 'H237-POR-CUT-001',
    chemin: 'design/portrait-mastermind-etalon-c3-3.png',
    sha256: '0cc35156ffee2be0d2b831a7e3df387050ca61157582f0c65181c2aa0d35bf69',
    credit:
      'Photo fournie par Russel ; fond retiré avec Magnific, étalonnage colorimétrique Codex ; visage, main et corps inchangés.',
    genere: false,
    // Cadre du sujet : la boîte englobante de la couche alpha, sans marge transparente.
    variantes: [
      {
        nom: 'buste',
        recadrage: { left: 64, top: 1235, width: 1859, height: 1325 },
        largeurs: [480, 768, 1080, 1280],
      },
    ],
  },
  {
    id: 'aube',
    registre: 'H237-DECOR-DAWN-001-M4X',
    chemin: 'design/releases/DR-1/assets/c3-upscaled/c3-dawn-fuji-upscaled.png',
    sha256: 'be11540eb0206c1b8cca3d5394dedea39ee9bdbe67f17fc73ef45a7d38a29b4e',
    credit: 'Image générée avec Magnific — direction et sélection : Russel / HORIZON 237.',
    genere: true,
    variantes: [
      {
        nom: 'paysage',
        recadrage: { left: 0, top: 0, width: 5760, height: 2880 },
        largeurs: [1280, 1920, 2560],
      },
      // Cadre vertical centré sur le Fuji (x ≈ 2800) pour les écrans de téléphone.
      {
        nom: 'vertical',
        recadrage: { left: 2000, top: 0, width: 1600, height: 2880 },
        largeurs: [480, 768, 1080],
      },
    ],
  },
  capture(
    'fast-shipping-logistics',
    'H237-PROJ-FAST-D',
    'bureau',
    'captures-projets/fastshipping-suivi-desktop.png',
    '38b804c0018f77308baa801a2600bc116a41d9d8b5ce230aaea706b3d788accc',
    { left: 181, top: 0, width: 1542, height: 964 },
    'Capture réelle du site public ; accord déclaré par Russel, sans autorisation nommée de l’agence.',
    'Page de suivi Fast Shipping avec camion en couverture, champ de numéro de colis et explication des mises à jour.',
  ),
  capture(
    'fast-shipping-logistics',
    'H237-PROJ-FAST-M',
    'mobile',
    'captures-projets/fastshipping-suivi-mobile.png',
    '285b29de9d6835d965c7bcac85c8eb46b5d5a102dd130d19bac01d53cd73f8f4',
    { left: 0, top: 0, width: 390, height: 844 },
    'Capture réelle du site public ; accord déclaré par Russel, sans autorisation nommée de l’agence.',
    'Version mobile du suivi Fast Shipping avec champ de numéro de colis et accès aux étapes d’assistance.',
  ),
  capture(
    'batobaye-market',
    'H237-PROJ-BATO-D',
    'bureau',
    'captures-projets/batobaye-admin-desktop.png',
    '2cdd5ea71d183182049a90d7df535a9d589a5198bcc44b5bbaf1d4c870349540',
    { left: 0, top: 0, width: 1496, height: 935 },
    'Capture réelle de l’administration, indicateurs internes masqués ; permission verbale du PDG de BatobayeMarket.',
    'Tableau de bord sombre de l’administration Batobaye Market montrant commandes, alertes de stock et indicateurs masqués.',
  ),
  capture(
    'batobaye-market',
    'H237-PROJ-BATO-M',
    'mobile',
    'captures-projets/batobaye-categorie-mobile.png',
    '64ecaf2e297ac73e6e8f7cd92e63a9e747e3f16d0ab6f8a682af7c19a0171b6d',
    { left: 0, top: 0, width: 390, height: 844 },
    'Capture réelle du catalogue public ; permission verbale du PDG de BatobayeMarket.',
    'Catalogue mobile Batobaye Market ouvert sur la catégorie Électroménager avec produits, prix et disponibilité.',
  ),
  capture(
    'mboamarkets',
    'H237-PROJ-MBOA-D',
    'bureau',
    'captures-projets/mboamarkets-semaine-desktop.png',
    '207b18bfa82c85bd32245df8477a2678dd5bb0cdace39d73d8686467f1df6197',
    { left: 193, top: 0, width: 1518, height: 949 },
    'Capture réelle du site public ; permission verbale du PDG de la maison mère, BatobayeMarket.',
    'Storefront MBoa Market présentant les produits de la semaine, leurs prix publics et l’action de commande.',
  ),
  capture(
    'mboamarkets',
    'H237-PROJ-MBOA-M',
    'mobile',
    'captures-projets/mboamarkets-accueil-mobile.png',
    'b39c2e17236658adf8576d22c31f0669a8bd22d4ce95a0af4a71ca2c23409e71',
    { left: 0, top: 0, width: 390, height: 844 },
    'Capture réelle du site public ; permission verbale du PDG de la maison mère, BatobayeMarket.',
    'Version mobile MBoa Market avec recherche, navigation par catégories, produit vedette et accès WhatsApp.',
  ),
  // ZIRIS : la capture d'origine reste hors dépôt par conception ; ses dérivés visés en sont la source.
  capture(
    'ziris',
    'H237-PROJ-ZIRIS-VITRINE-001',
    'bureau',
    'design/releases/DR-1/assets/source-derivatives/ziris-enterprise-desktop-1440.webp',
    'a7986eca9c2b67c3a150b0bc0a6d25e7916e3e02c8ba60c87242eb492a2e4b77',
    { left: 0, top: 0, width: 1440, height: 900 },
    'Capture réelle de la vitrine publique ; accord des co-propriétaires, Russel et Amadou Mendouga.',
    'Vitrine publique de ZIRIS Entreprises : recherche, promesse principale, tarif à partir de 40 000 FCFA par mois et essai gratuit.',
  ),
  capture(
    'ziris',
    'H237-PROJ-ZIRIS-VITRINE-001',
    'mobile',
    'design/releases/DR-1/assets/source-derivatives/ziris-enterprise-mobile-390.webp',
    '4f0dcc16fe617a348606cb7df960fdc0725f05fb55f28c2d877107b70647bcc3',
    { left: 0, top: 0, width: 390, height: 844 },
    'Capture réelle de la vitrine publique ; accord des co-propriétaires, Russel et Amadou Mendouga.',
    'Version mobile de la vitrine ZIRIS Entreprises avec recherche, promesse principale, tarif et bouton d’essai gratuit.',
  ),
  capture(
    'shopitech',
    'H237-PROJ-SHOP-D',
    'bureau',
    'captures-projets/shopitech-accueil-desktop.png',
    'e84ccd7ce05d368e44d19eec5c2690528773d2b482cef5b1b56086d3697d8203',
    { left: 0, top: 0, width: 1203, height: 752 },
    'Capture réelle de la beta publique ; autorisation de Shopitech déclarée.',
    'Catalogue desktop Shopitech consacré aux équipements réseau, avec produits populaires, filtres et grille de produits.',
  ),
  capture(
    'shopitech',
    'H237-PROJ-SHOP-M',
    'mobile',
    'captures-projets/shopitech-accueil-mobile.png',
    'c8be53faea5f84bf8be1db85984961a4fb15277e2b3da51f82defff92a26cfa2',
    { left: 0, top: 0, width: 400, height: 866 },
    'Capture réelle de la beta publique ; autorisation de Shopitech déclarée.',
    'Accueil mobile Shopitech avec recherche, produit vedette et grille colorée des familles techniques.',
  ),
  capture(
    'artvibe-cameroun',
    'H237-PROJ-ART-D',
    'bureau',
    'captures-projets/artvibecamer-accueil-desktop.png',
    '707a2ab22c57b8633d1cdbfe3f9f0c41e36a7907375d83b5f44860d90288c673',
    { left: 231, top: 0, width: 1442, height: 901 },
    'Capture réelle de la plateforme publique ; autorisation de SAM BIAI déclarée.',
    'Accueil ArtVibeCamer présentant la scène des talents camerounais, les disciplines et l’action d’inscription.',
  ),
  capture(
    'artvibe-cameroun',
    'H237-PROJ-ART-M',
    'mobile',
    'captures-projets/artvibecamer-accueil-mobile.png',
    'f3020401c7e04d5b45cc6492b5fc0749bc5886e3df56961ccba9d6e612c88580',
    { left: 0, top: 0, width: 390, height: 844 },
    'Capture réelle de la plateforme publique ; autorisation de SAM BIAI déclarée.',
    'Accueil mobile ArtVibeCamer avec la promesse culturelle, les disciplines et le bouton d’inscription d’un talent.',
  ),
  // Corps célestes de la promenade (registre G3 : assets/registry-g3.json).
  carte(
    'soleil',
    'H237-SPACE-SUN-001',
    '2k_sun.jpg',
    'ff0f076ba65e03b5ab518451bc96699325be38e3ccbdd5869ee1c00f3a0c8816',
  ),
  carte(
    'mercure',
    'H237-SPACE-MERCURY-001',
    '2k_mercury.jpg',
    '5a5c80607f643496bac9a631e71957def35ed788895f18b678ac849c2b38e48a',
  ),
  carte(
    'venus',
    'H237-SPACE-VENUS-001',
    '2k_venus_atmosphere.jpg',
    '225012ad4911730605c4e189ca2a3bf674fce50cc48aab4102b936b47d6991ac',
  ),
  carte(
    'lune',
    'H237-SPACE-MOON-001',
    '2k_moon.jpg',
    '2764ba6535ea0481a062846ee033cc7a909dae05b31a8fd13f3e98f3a7fd92bd',
  ),
  carte(
    'mars',
    'H237-SPACE-MARS-001',
    '2k_mars.jpg',
    '2d187f3e77a98eaa8cea5f4cc722f633c122ef170b9e94ace6b5fb6cbc3f8e01',
  ),
  carte(
    'jupiter',
    'H237-SPACE-JUPITER-001',
    '2k_jupiter.jpg',
    'b0f04d005350252636b0e3396fc592548cbd9e9126b269d32d5c6abd4b0e4f2b',
  ),
  carte(
    'saturne',
    'H237-SPACE-SATURN-001',
    '2k_saturn.jpg',
    '54a900ca9bf7ab62e70f862852759abdf342e6d6436a95a2fe9ebdb6bcd3bbac',
  ),
  carte(
    'anneaux',
    'H237-SPACE-SATURN-RING-001',
    '2k_saturn_ring_alpha.png',
    '4b0644b2f3ef259fd0bfaedd9dc52f9e7d9738f65f50363e8c4dd19f650d7334',
    125,
  ),
  carte(
    'uranus',
    'H237-SPACE-URANUS-001',
    '2k_uranus.jpg',
    'd15239d46f82d3ea13d2b260b5b29b2a382f42f2916dae0694d0387b1204a09d',
  ),
  carte(
    'neptune',
    'H237-SPACE-NEPTUNE-001',
    '2k_neptune.jpg',
    'cb42ea82709741d28b0af44d8b283cbc6dbd0c521a7f0e1e1e010ade00977df6',
  ),
];

const PHOTO: Qualite = { avif: 50, webp: 76 };
const FORMATS = {
  avif: (image: Sharp, qualite: Qualite) => image.avif({ quality: qualite.avif, effort: 6 }),
  webp: (image: Sharp, qualite: Qualite) => image.webp({ quality: qualite.webp, effort: 6 }),
} as const;
type Format = keyof typeof FORMATS;

type Fichier = { largeur: number; hauteur: number; chemin: string; octets: number; sha256: string };
type Derive = {
  registre: string;
  credit: string;
  genere: boolean;
  alt: string | null;
  largeur: number;
  hauteur: number;
  fichiers: Record<Format, Fichier[]>;
};

const empreinte = (donnees: Buffer) => createHash('sha256').update(donnees).digest('hex');

async function generer(): Promise<Record<string, Derive>> {
  rmSync(DOSSIER, { recursive: true, force: true });
  mkdirSync(DOSSIER, { recursive: true });
  const manifeste: Record<string, Derive> = {};

  for (const source of SOURCES) {
    const master = readFileSync(source.chemin);
    if (empreinte(master) !== source.sha256)
      throw new Error(`${source.chemin} ne correspond plus au registre.`);

    for (const { nom, recadrage, largeurs } of source.variantes) {
      // Le master n'est décodé qu'une fois par cadre ; chaque largeur repart de ces pixels.
      const cadre = await sharp(master)
        .extract(recadrage)
        .toColorspace('srgb')
        .raw()
        .toBuffer({ resolveWithObject: true });
      const derive: Derive = {
        registre: source.registre,
        credit: source.credit,
        genere: source.genere,
        alt: source.alt ?? null,
        largeur: recadrage.width,
        hauteur: recadrage.height,
        fichiers: { avif: [], webp: [] },
      };
      for (const largeur of largeurs.filter((l) => l <= recadrage.width)) {
        for (const format of Object.keys(FORMATS) as Format[]) {
          const image = sharp(cadre.data, { raw: cadre.info }).resize({ width: largeur, kernel: 'lanczos3' });
          const { data, info } = await FORMATS[format](image, source.qualite ?? PHOTO).toBuffer({
            resolveWithObject: true,
          });
          const hash = empreinte(data);
          const fichier = `${source.id}-${nom}-${largeur}-${hash.slice(0, 8)}.${format}`;
          writeFileSync(join(DOSSIER, fichier), data);
          derive.fichiers[format].push({
            largeur: info.width,
            hauteur: info.height,
            chemin: `/media/approved/${fichier}`,
            octets: data.length,
            sha256: hash,
          });
        }
      }
      manifeste[`${source.id}-${nom}`] = derive;
    }
  }
  return manifeste;
}

function verifier(manifeste: Record<string, Derive>) {
  const attendus = new Set<string>();
  for (const [id, derive] of Object.entries(manifeste)) {
    for (const fichier of [...derive.fichiers.avif, ...derive.fichiers.webp]) {
      const nom = fichier.chemin.replace('/media/approved/', '');
      attendus.add(nom);
      const donnees = readFileSync(join(DOSSIER, nom));
      if (empreinte(donnees) !== fichier.sha256 || donnees.length !== fichier.octets) {
        throw new Error(`${id} : ${nom} ne correspond plus au manifeste.`);
      }
    }
  }
  const orphelins = readdirSync(DOSSIER).filter((nom) => !attendus.has(nom));
  if (orphelins.length > 0) throw new Error(`Dérivés absents du manifeste : ${orphelins.join(', ')}.`);
  return attendus.size;
}

if (process.argv.includes('--check')) {
  const total = verifier(JSON.parse(readFileSync(MANIFESTE, 'utf8')) as Record<string, Derive>);
  console.log(`${MANIFESTE} : ${total} dérivés vérifiés.`);
} else {
  const manifeste = await generer();
  writeFileSync(MANIFESTE, `${JSON.stringify(manifeste, null, 2)}\n`);
  console.log(`${MANIFESTE} : ${verifier(manifeste)} dérivés écrits.`);
}
