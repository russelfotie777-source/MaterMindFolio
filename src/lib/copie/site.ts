import 'server-only';

import { existsSync, readFileSync } from 'node:fs';

import type { Root } from 'mdast';
import { z } from 'zod';

import { analyserCopie } from './markdown';

// Manifeste de la copy du site (docs/architecture/schemas/site-copy.schema.json), repris en Zod.
// Fichier : content/copy/fr/site.copy.json ; sections : content/copy/fr/site/<section>.md.
const SECTIONS = ['accueil', 'promenade', 'visite-legere', 'parcours', 'fabrication', 'final'] as const;
export type SectionSite = (typeof SECTIONS)[number];

const section = z.strictObject({
  file: z.string().regex(/^content\/copy\/fr\/site\/[a-z0-9-]+\.md$/),
  author: z.enum(['russel', 'chatgpt']),
  russelValidatedAt: z.iso.date().nullable(),
});

const manifeste = z.strictObject({
  schemaVersion: z.literal('site-copy/1'),
  lang: z.literal('fr'),
  sections: z.partialRecord(z.enum(SECTIONS), section),
});

const CHEMIN = 'content/copy/fr/site.copy.json';

// Comme pour les projets : une section non visée reste absente, une section visée invalide arrête le build.
function lire(): Partial<Record<SectionSite, Root>> {
  if (!existsSync(CHEMIN)) return {};
  const { sections } = manifeste.parse(JSON.parse(readFileSync(CHEMIN, 'utf8')));
  const resultat: Partial<Record<SectionSite, Root>> = {};
  for (const [nom, contenu] of Object.entries(sections) as [SectionSite, z.infer<typeof section>][]) {
    if (contenu.russelValidatedAt === null) continue;
    resultat[nom] = analyserCopie(readFileSync(contenu.file, 'utf8'), contenu.file);
  }
  return resultat;
}

const copie = lire();

export function lireCopieSite(): Partial<Record<SectionSite, Root>> {
  return copie;
}
