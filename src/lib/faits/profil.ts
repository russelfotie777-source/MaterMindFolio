import 'server-only';

import { z } from 'zod';

import brut from '../../../content/facts/profile.facts.json';
import { faitPublic, releaseApprouvee, texte, urlHttps } from './enveloppe';

// Sous-ensemble du schéma G1 (docs/architecture/schemas/profile-facts.schema.json)
// réellement consommé par les pages. Un fait non approuvé ou privé ne sort jamais du serveur.
const profilSchema = z.object({
  schemaVersion: z.literal('profile-facts/1'),
  contentRelease: releaseApprouvee,
  facts: z.object({
    publicName: faitPublic(texte),
    title: faitPublic(texte),
    currentPosition: faitPublic(
      z.object({ title: texte, organization: texte, city: texte, since: z.iso.date(), focus: texte }),
    ),
    base: faitPublic(z.object({ city: texte, country: texte })),
    email: faitPublic(z.email()),
    github: faitPublic(urlHttps),
    availability: faitPublic(texte),
  }),
});

export type Profil = {
  nomPublic: string;
  intitule: string;
  posteActuel: { intitule: string; organisation: string; ville: string; depuis: string; dominante: string };
  base: { ville: string; pays: string };
  email: string;
  github: string;
  disponibilite: string;
};

export function lireProfil(): Profil {
  const { facts } = profilSchema.parse(brut);
  const poste = facts.currentPosition.value;
  return {
    nomPublic: facts.publicName.value,
    intitule: facts.title.value,
    posteActuel: {
      intitule: poste.title,
      organisation: poste.organization,
      ville: poste.city,
      depuis: poste.since,
      dominante: poste.focus,
    },
    base: { ville: facts.base.value.city, pays: facts.base.value.country },
    email: facts.email.value,
    github: facts.github.value,
    disponibilite: facts.availability.value,
  };
}
