import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

import sharp from 'sharp';

const SOURCE = 'design/magnific__background__71841.png';
const SORTIE = 'design/portrait-mastermind-etalon-c3-3.png';

const image = sharp(SOURCE).ensureAlpha().toColorspace('srgb');
const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });
const pixels = info.width * info.height;

// La géométrie et l'alpha du sujet principal sont conservés pixel pour pixel. Seuls d'éventuels îlots
// alpha détachés du détourage sont retirés ; les cheveux et le bord anti-aliasé restent rattachés.
const visites = new Uint8Array(pixels);
const file = new Int32Array(pixels);
let meilleurDepart = -1;
let meilleureTaille = 0;

for (let depart = 0; depart < pixels; depart += 1) {
  if (visites[depart] || data[depart * 4 + 3] < 32) continue;
  let debut = 0;
  let fin = 1;
  let taille = 0;
  file[0] = depart;
  visites[depart] = 1;

  while (debut < fin) {
    const pixel = file[debut++];
    taille += 1;
    const x = pixel % info.width;
    const voisins = [
      x > 0 ? pixel - 1 : -1,
      x + 1 < info.width ? pixel + 1 : -1,
      pixel >= info.width ? pixel - info.width : -1,
      pixel + info.width < pixels ? pixel + info.width : -1,
    ];
    for (const voisin of voisins) {
      if (voisin < 0 || visites[voisin] || data[voisin * 4 + 3] < 32) continue;
      visites[voisin] = 1;
      file[fin++] = voisin;
    }
  }

  if (taille > meilleureTaille) {
    meilleurDepart = depart;
    meilleureTaille = taille;
  }
}

if (meilleurDepart < 0) throw new Error('Aucun sujet opaque trouve dans le portrait.');

const sujet = new Uint8Array(pixels);
let debut = 0;
let fin = 1;
file[0] = meilleurDepart;
sujet[meilleurDepart] = 1;
while (debut < fin) {
  const pixel = file[debut++];
  const x = pixel % info.width;
  const voisins = [
    x > 0 ? pixel - 1 : -1,
    x + 1 < info.width ? pixel + 1 : -1,
    pixel >= info.width ? pixel - info.width : -1,
    pixel + info.width < pixels ? pixel + info.width : -1,
  ];
  for (const voisin of voisins) {
    if (voisin < 0 || sujet[voisin] || data[voisin * 4 + 3] === 0) continue;
    sujet[voisin] = 1;
    file[fin++] = voisin;
  }
}

const alpha = new Uint8Array(pixels);
for (let pixel = 0; pixel < pixels; pixel += 1) {
  const i = pixel * 4;
  if (!sujet[pixel]) {
    data[i] = 0;
    data[i + 1] = 0;
    data[i + 2] = 0;
    data[i + 3] = 0;
  }
  alpha[pixel] = data[i + 3];
}

const borne = (valeur) => Math.max(0, Math.min(255, Math.round(valeur)));
const alphaA = (x, y) => {
  if (x < 0 || y < 0 || x >= info.width || y >= info.height) return 0;
  return alpha[y * info.width + x];
};
const melange = (valeur, cible, poids) => valeur * (1 - poids) + cible * poids;

for (let pixel = 0; pixel < pixels; pixel += 1) {
  const i = pixel * 4;
  const a = alpha[pixel];
  if (a === 0) continue;

  const x = pixel % info.width;
  const y = Math.floor(pixel / info.width);
  let r = data[i];
  let g = data[i + 1];
  let b = data[i + 2];
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;

  // Balance honnête : la peau conserve ses détails, mais perd la dominante magenta de la pièce et le
  // rouge local du doigt. Aucun lissage, aucune reconstruction et aucun changement de géométrie.
  const roseDePiece = luminance > 55 && r > g * 1.08 && b > g * 1.02;
  const peau = r > 38 && r > g * 1.08 && (r > b * 1.03 || roseDePiece);
  if (peau) {
    const excesRouge = Math.max(0, r - Math.max(g, b) * 1.18);
    const rougeLocal = Math.max(0, excesRouge - 60);
    r = r * 1.005 - excesRouge * 0.12 - rougeLocal * 0.12;
    g = g * 1.01 + excesRouge * 0.03 + rougeLocal * 0.08;

    // Le reflet de rideau est concentré sur les doigts pendants : correction locale et progressive,
    // sans peindre la main ni changer sa texture.
    const distanceDoigt = ((x - 900) / 300) ** 2 + ((y - 1845) / 260) ** 2;
    if (distanceDoigt < 1) {
      const fonduDoigt = (1 - distanceDoigt) ** 2;
      const rougeNaturel = Math.max(g, b) * 1.42;
      if (r > rougeNaturel) {
        const correction = (r - rougeNaturel) * 0.68 * fonduDoigt;
        r -= correction;
        g += correction * 0.08;
      }
    }
    const bleuNaturel = g * 0.88;
    if (b > bleuNaturel) b = b * 0.2 + bleuNaturel * 0.8;

    // Compression très légère des seules hautes lumières de peau : texture et pores restent présents.
    const maximum = Math.max(r, g, b);
    if (maximum > 205) {
      const retenue = (maximum - 205) * 0.08;
      r -= retenue;
      g -= retenue * 0.65;
      b -= retenue * 0.45;
    }
  }

  // Le tee-shirt garde une base noire, mais ses plis deviennent franchement noir-violet pour que le
  // traitement reste lisible dans l'ouverture sombre sans changer le vêtement.
  if (y > 1840 && luminance < 90 && !peau) {
    const ombre = 1 - luminance / 90;
    r = r * 0.92 + 4 * ombre;
    g *= 0.88;
    b = b * 1.1 + 10 * ombre;
  }

  // Raccord de scène entièrement interne à la silhouette : une lumière violette large côté ombre et un
  // rappel d'aube chaud côté opposé. Le fond reste réellement transparent, sans glow extérieur.
  const bordGauche =
    1 - Math.min(alphaA(x - 8, y), alphaA(x - 18, y), alphaA(x - 34, y), alphaA(x, y - 18)) / 255;
  const bordDroit = 1 - Math.min(alphaA(x + 8, y), alphaA(x + 18, y), alphaA(x + 34, y)) / 255;
  const coteOmbre = Math.max(0, 1 - x / (info.width * 0.82));
  const coteAube = Math.max(0, (x - info.width * 0.46) / (info.width * 0.54));
  const densiteOmbre = 1 - Math.min(1, luminance / 190);
  const poidsViolet = Math.min(0.2, bordGauche * 0.2) * coteOmbre + coteOmbre * densiteOmbre * 0.07;
  const poidsAube = Math.min(0.085, bordDroit * 0.085) * coteAube + coteAube * densiteOmbre * 0.028;

  r = melange(r, 104, poidsViolet);
  g = melange(g, 43, poidsViolet);
  b = melange(b, 177, poidsViolet);
  r = melange(r, 220, poidsAube);
  g = melange(g, 158, poidsAube);
  b = melange(b, 128, poidsAube);

  // Courbe en S maîtrisée : noirs plus profonds et relief du visage clairement lisible, sans effet HDR.
  const lumiereEtalonnee = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  if (lumiereEtalonnee > 0) {
    const niveau = lumiereEtalonnee / 255;
    const courbe = niveau * niveau * (3 - 2 * niveau);
    const niveauFinal = niveau * 0.65 + courbe * 0.35;
    const contraste = (niveauFinal * 255) / lumiereEtalonnee;
    r *= contraste;
    g *= contraste;
    b *= contraste;
  }

  if (peau) {
    r *= 1.025;
    b *= 0.975;
  }

  data[i] = borne(r);
  data[i + 1] = borne(g);
  data[i + 2] = borne(b);
}

const sortie = await sharp(data, { raw: info })
  .png({ compressionLevel: 9, adaptiveFiltering: true })
  .toBuffer();
await sharp(sortie).toFile(SORTIE);

const sha256 = createHash('sha256').update(readFileSync(SORTIE)).digest('hex');
console.log(`${SORTIE}\n${info.width}x${info.height}\nsha256 ${sha256}`);
