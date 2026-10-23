import 'server-only';

import { z } from 'zod';

import brut from '../../../content/facts/references-musicales.facts.json';
import { faitPublic, source, texte, urlHttps } from './enveloppe';

// Morceaux de référence de Russel (ADR-001) : écoutables par le lecteur officiel, jamais hébergés.
// Module facultatif : tant que la release n'est pas visée par Russel, il reste absent du site.
const publication = z.discriminatedUnion('kind', [
  z.object({ kind: z.literal('youtube'), videoId: z.string().regex(/^[\w-]{11}$/), channel: texte }),
  z.object({ kind: z.literal('official-page'), label: texte, url: urlHttps }),
]);

const releaseSchema = z.object({ contentRelease: z.object({ status: z.enum(['draft', 'approved']) }) });

const referencesSchema = z.object({
  schemaVersion: z.literal('music-references/1'),
  contentRelease: z.object({ id: texte, status: z.literal('approved'), russelVisa: z.iso.date() }),
  sources: z.array(source).min(1),
  facts: z.object({
    references: faitPublic(
      z
        .array(
          z.object({
            id: texte,
            title: texte,
            composer: texte,
            work: texte,
            year: z.int(),
            publication,
          }),
        )
        .min(1),
    ),
  }),
});

export type ReferenceMusicale = {
  id: string;
  titre: string;
  compositeur: string;
  oeuvre: string;
  annee: number;
  publication: { genre: 'youtube'; videoId: string } | { genre: 'page'; libelle: string; url: string };
};

export function lireReferencesMusicales(): ReferenceMusicale[] {
  if (releaseSchema.parse(brut).contentRelease.status !== 'approved') return [];
  return referencesSchema.parse(brut).facts.references.value.map((ref) => ({
    id: ref.id,
    titre: ref.title,
    compositeur: ref.composer,
    oeuvre: ref.work,
    annee: ref.year,
    publication:
      ref.publication.kind === 'youtube'
        ? { genre: 'youtube', videoId: ref.publication.videoId }
        : { genre: 'page', libelle: ref.publication.label, url: ref.publication.url },
  }));
}
