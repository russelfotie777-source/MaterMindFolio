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

// Transformations permises par la DR-1 (05_ACTIFS_DROITS, section 10) : recadrage, réduction, compression.
// Aucun étalonnage n'est appliqué ici : celui du portrait reste à décider par la direction artistique.
const SOURCES: Source[] = [
  {
    id: 'portrait',
    registre: 'H237-POR-CUT-001',
    chemin: 'design/magnific__background__71841.png',
    sha256: 'a0345f9bfc43bf3eba2efc360da1cb23926faa2b91b5908cf58753973a9a92d4',
    credit: 'Photo fournie par Russel ; fond retiré avec Magnific, visage, main et corps inchangés.',
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
