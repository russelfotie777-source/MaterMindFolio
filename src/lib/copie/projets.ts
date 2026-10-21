import 'server-only';

import { existsSync, readFileSync } from 'node:fs';

import type { Root } from 'mdast';
import { z } from 'zod';

import { SLUGS, type Slug } from '@/lib/faits/projets';

import { analyserCopie } from './markdown';

// Manifeste de copy d'un projet (docs/architecture/schemas/project-copy.schema.json), repris en Zod.
// Fichier : content/copy/fr/projects/<slug>.copy.json ; sections : content/copy/fr/projects/<slug>/*.md.
const FAITS = [
  'name',
  'links',
  'status',
  'period',
  'organization',
  'role',
  'personalScope',
  'team',
  'platforms',
  'stack',
  'proofs',
  'rights',
  'media',
  'decisions',
] as const;

const section = z.strictObject({
  file: z.string().regex(/^content\/copy\/fr\/projects\/[a-z0-9-]+\/[a-z0-9-]+\.md$/),
  author: z.enum(['russel', 'chatgpt']),
  factRefs: z.array(z.enum(FAITS)),
  russelValidatedAt: z.iso.date().nullable(),
});

const manifeste = z.strictObject({
  schemaVersion: z.literal('project-copy/1'),
  slug: z.enum(SLUGS),
  lang: z.literal('fr'),
  sections: z.strictObject({
    // BESOIN n'existe que si Russel l'a écrit avec ses mots.
    need: section.extend({ author: z.literal('russel') }).optional(),
    'product-caption': section,
    decision: section.optional(),
    'case-study': section.optional(),
  }),
  mediaAlt: z
    .array(z.strictObject({ assetId: z.string().regex(/^H237-[A-Z0-9]+(-[A-Z0-9]+)*$/), section }))
    .optional(),
});

export type SectionCopie = 'need' | 'product-caption' | 'decision' | 'case-study';
export type CopieProjet = Partial<Record<SectionCopie, Root>>;

// Une section non visée par Russel reste absente ; une section visée mais invalide arrête le build :
// fichier hors du dossier du projet, fait supposé absent ou privé, nœud ou lien hors allowlist.
function lire(slug: Slug): CopieProjet {
  const chemin = `content/copy/fr/projects/${slug}.copy.json`;
  if (!existsSync(chemin)) return {};
  const copie = manifeste.parse(JSON.parse(readFileSync(chemin, 'utf8')));
  if (copie.slug !== slug) throw new Error(`${chemin} déclare le projet ${copie.slug}.`);
  const { facts } = JSON.parse(readFileSync(`content/facts/${slug}.facts.json`, 'utf8')) as {
    facts: Record<string, { visibility: string } | undefined>;
  };

  const sections: CopieProjet = {};
  for (const [nom, contenu] of Object.entries(copie.sections) as [SectionCopie, z.infer<typeof section>][]) {
    if (!contenu.file.startsWith(`content/copy/fr/projects/${slug}/`)) {
      throw new Error(`${chemin} : la section ${nom} pointe hors du dossier du projet.`);
    }
    for (const fait of contenu.factRefs) {
      if (facts[fait]?.visibility !== 'public') {
        throw new Error(`${contenu.file} suppose le fait « ${fait} », absent ou privé.`);
      }
    }
    if (contenu.russelValidatedAt === null) continue;
    sections[nom] = analyserCopie(readFileSync(contenu.file, 'utf8'), contenu.file);
  }
  return sections;
}

// Lue une fois par processus de build, comme les faits.
const copies = new Map(SLUGS.map((slug) => [slug, lire(slug)]));

export function lireCopieProjet(slug: Slug): CopieProjet {
  return copies.get(slug) ?? {};
}
