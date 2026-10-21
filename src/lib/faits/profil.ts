import 'server-only';

import { z } from 'zod';

import brut from '../../../content/facts/profile.facts.json';

// Sous-ensemble du schéma G1 (docs/architecture/schemas/profile-facts.schema.json)
// réellement consommé par le socle. Un fait non approuvé ou privé ne sort jamais du serveur.
const faitTexte = z.object({
  value: z.string().min(1),
  validatedAt: z.iso.date(),
  visibility: z.literal('public'),
});

const profilSchema = z.object({
  schemaVersion: z.literal('profile-facts/1'),
  contentRelease: z.object({ status: z.literal('approved'), russelVisa: z.iso.date() }),
  facts: z.object({
    publicName: faitTexte,
    title: faitTexte,
    email: faitTexte.extend({ value: z.email() }),
    availability: faitTexte,
  }),
});

export type Profil = {
  nomPublic: string;
  intitule: string;
  email: string;
  disponibilite: string;
};

export function lireProfil(): Profil {
  const { facts } = profilSchema.parse(brut);
  return {
    nomPublic: facts.publicName.value,
    intitule: facts.title.value,
    email: facts.email.value,
    disponibilite: facts.availability.value,
  };
}
