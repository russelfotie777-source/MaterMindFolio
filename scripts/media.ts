// Pipeline local des dérivés d'images (contrat, T15 et section 3.1, point 10). Les masters restent hors
// du dépôt public ou sous leur exception déclarée ; seuls les dérivés de public/media/approved/, nommés par
// leur empreinte, et leur manifeste src/lib/media/derives.json sont commités.
// `--check` vérifie les dérivés et le manifeste sans avoir besoin des masters : c'est le mode de la CI.
import { createHash } from 'node:crypto';
import { mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import sharp from 'sharp';

const DOSSIER = 'public/media/approved';
const MANIFESTE = 'src/lib/media/derives.json';

type Recadrage = { left: number; top: number; width: number; height: number };
type Variante = { nom: string; recadrage: Recadrage; largeurs: number[] };
type Source = {
  id: string;
  registre: string;
  chemin: string;
  sha256: string;
  credit: string;
  genere: boolean;
  variantes: Variante[];
};

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
];

const FORMATS = {
  avif: (image: sharp.Sharp) => image.avif({ quality: 50, effort: 6 }),
  webp: (image: sharp.Sharp) => image.webp({ quality: 76, effort: 6 }),
} as const;
type Format = keyof typeof FORMATS;

type Fichier = { largeur: number; hauteur: number; chemin: string; octets: number; sha256: string };
type Derive = {
  registre: string;
  credit: string;
  genere: boolean;
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
        largeur: recadrage.width,
        hauteur: recadrage.height,
        fichiers: { avif: [], webp: [] },
      };
      for (const largeur of largeurs.filter((l) => l <= recadrage.width)) {
        for (const format of Object.keys(FORMATS) as Format[]) {
          const image = sharp(cadre.data, { raw: cadre.info }).resize({ width: largeur, kernel: 'lanczos3' });
          const { data, info } = await FORMATS[format](image).toBuffer({ resolveWithObject: true });
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
