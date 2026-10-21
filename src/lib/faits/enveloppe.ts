import 'server-only';

import { z } from 'zod';

// Types communs du schéma G1 (docs/architecture/schemas/fact.schema.json), repris en Zod.
export const texte = z.string().trim().min(1);
export const moisAnnee = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/);
export const urlHttps = z.url({ protocol: /^https$/ });

export const releaseApprouvee = z.object({
  id: z.literal('CR-0'),
  status: z.literal('approved'),
  russelVisa: z.iso.date(),
});

export const source = z.object({
  id: texte,
  kind: z.enum([
    'owner-declaration',
    'public-check',
    'repository-history',
    'production-log',
    'store-listing',
    'document',
  ]),
  label: texte,
  url: urlHttps.optional(),
  checkedAt: z.iso.date(),
});

// Un fait consommé par une page doit être public et visé par Russel : sinon le build échoue.
export function faitPublic<T extends z.ZodType>(valeur: T) {
  return z.object({
    value: valeur,
    sources: z.array(texte).min(1),
    validatedAt: z.iso.date(),
    visibility: z.literal('public'),
    rightsOwner: texte,
  });
}

// Fait facultatif : absent ou privé, il est omis (null) ; public, il suit la même règle.
export function faitFacultatif<T extends z.ZodType>(valeur: T) {
  return z
    .union([faitPublic(valeur), z.object({ visibility: z.literal('private') })])
    .optional()
    .transform((fait): z.output<T> | null => (fait && 'value' in fait ? (fait.value as z.output<T>) : null));
}
