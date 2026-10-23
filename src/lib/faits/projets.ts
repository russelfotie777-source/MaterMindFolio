import 'server-only';

import { z } from 'zod';

import artvibeCameroun from '../../../content/facts/artvibe-cameroun.facts.json';
import batobayeMarket from '../../../content/facts/batobaye-market.facts.json';
import fastShippingLogistics from '../../../content/facts/fast-shipping-logistics.facts.json';
import mboamarkets from '../../../content/facts/mboamarkets.facts.json';
import shopitech from '../../../content/facts/shopitech.facts.json';
import ziris from '../../../content/facts/ziris.facts.json';
import {
  faitFacultatif,
  faitPublic,
  moisAnnee,
  releaseApprouvee,
  source,
  texte,
  urlHttps,
} from './enveloppe';

// Ordre du storyboard DR-1. Les six projets ont le même poids : aucun n'est mis en avant.
export const SLUGS = [
  'fast-shipping-logistics',
  'batobaye-market',
  'mboamarkets',
  'ziris',
  'shopitech',
  'artvibe-cameroun',
] as const;
export type Slug = (typeof SLUGS)[number];

const fichiers: Record<Slug, unknown> = {
  'fast-shipping-logistics': fastShippingLogistics,
  'batobaye-market': batobayeMarket,
  mboamarkets,
  ziris,
  shopitech,
  'artvibe-cameroun': artvibeCameroun,
};

const plateforme = z.enum(['web', 'web-admin', 'pwa', 'android', 'ios']);
export type Plateforme = z.infer<typeof plateforme>;

// Sous-ensemble du schéma G1 (docs/architecture/schemas/project-facts.schema.json) consommé
// par les pages. Les droits, médias et faits confidentiels ne sont pas lus : ils restent au serveur.
const projetSchema = z.object({
  schemaVersion: z.literal('project-facts/1'),
  slug: z.enum(SLUGS),
  contentRelease: releaseApprouvee,
  sources: z.array(source).min(1),
  facts: z.object({
    name: faitPublic(texte),
    links: faitPublic(
      z
        .array(
          z.object({
            kind: z.enum(['site', 'beta', 'play-store', 'app-store']),
            label: texte,
            url: urlHttps,
          }),
        )
        .min(1),
    ),
    status: faitPublic(
      z.object({
        code: z.enum(['live', 'beta', 'in-development', 'archived']),
        maintained: z.boolean().optional(),
        label: texte,
      }),
    ),
    period: faitPublic(
      z.object({
        start: moisAnnee,
        end: moisAnnee.nullable(),
        ongoing: z.boolean(),
        approximate: z.boolean(),
        phases: z.array(z.object({ label: texte, start: moisAnnee, end: moisAnnee.nullable() })).optional(),
      }),
    ),
    organization: faitPublic(
      z.object({
        name: texte,
        relation: z.enum(['employer', 'employer-subsidiary', 'client', 'own-product', 'co-owned-product']),
        city: texte.optional(),
        country: texte,
      }),
    ),
    role: faitPublic(texte),
    personalScope: faitPublic(z.array(texte).min(1)),
    team: faitFacultatif(
      z.object({
        size: z.int().min(1).optional(),
        members: z.array(z.object({ name: texte, contribution: texte })).optional(),
        note: texte.optional(),
      }),
    ),
    platforms: faitPublic(z.array(plateforme).min(1)),
    stack: faitPublic(z.array(texte).min(1)),
    proofs: faitPublic(
      z
        .array(
          z.object({
            kind: z.enum(['live-url', 'store-listing', 'repository-history', 'production-log', 'metric']),
            label: texte,
            url: urlHttps.optional(),
            checkedAt: z.iso.date(),
          }),
        )
        .min(1),
    ),
    decisions: faitFacultatif(
      z
        .array(z.object({ title: texte, rationale: texte }))
        .min(1)
        .max(3),
    ),
  }),
});

export type Periode = { debut: string; fin: string | null; enCours: boolean; approximative: boolean };

export type Projet = {
  slug: Slug;
  rang: number;
  nom: string;
  liens: { genre: 'site' | 'beta' | 'play-store' | 'app-store'; libelle: string; url: string }[];
  statut: string;
  periode: Periode & { phases: { libelle: string; debut: string; fin: string | null }[] };
  organisation: { nom: string; ville: string | null; pays: string };
  role: string;
  perimetre: string[];
  equipe: {
    taille: number | null;
    membres: { nom: string; contribution: string }[];
    note: string | null;
  } | null;
  plateformes: Plateforme[];
  technologies: string[];
  preuves: { libelle: string; url: string | null; verifieeLe: string }[];
  decisions: { titre: string; raison: string }[];
  sources: { libelle: string; url: string | null; verifieeLe: string }[];
};

function lire(slug: Slug, rang: number): Projet {
  const projet = projetSchema.parse(fichiers[slug]);
  if (projet.slug !== slug) throw new Error(`Faits de ${slug} : le fichier déclare ${projet.slug}.`);
  const { facts } = projet;
  const periode = facts.period.value;
  const organisation = facts.organization.value;
  const equipe = facts.team;
  return {
    slug,
    rang,
    nom: facts.name.value,
    liens: facts.links.value.map(({ kind, label, url }) => ({ genre: kind, libelle: label, url })),
    statut: facts.status.value.label,
    periode: {
      debut: periode.start,
      fin: periode.end,
      enCours: periode.ongoing,
      approximative: periode.approximate,
      phases: (periode.phases ?? []).map(({ label, start, end }) => ({
        libelle: label,
        debut: start,
        fin: end,
      })),
    },
    organisation: { nom: organisation.name, ville: organisation.city ?? null, pays: organisation.country },
    role: facts.role.value,
    perimetre: facts.personalScope.value,
    equipe: equipe && {
      taille: equipe.size ?? null,
      membres: (equipe.members ?? []).map(({ name, contribution }) => ({ nom: name, contribution })),
      note: equipe.note ?? null,
    },
    plateformes: facts.platforms.value,
    technologies: facts.stack.value,
    preuves: facts.proofs.value.map(({ label, url, checkedAt }) => ({
      libelle: label,
      url: url ?? null,
      verifieeLe: checkedAt,
    })),
    decisions: (facts.decisions ?? []).map(({ title, rationale }) => ({ titre: title, raison: rationale })),
    sources: projet.sources.map(({ label, url, checkedAt }) => ({
      libelle: label,
      url: url ?? null,
      verifieeLe: checkedAt,
    })),
  };
}

// Lu une fois par processus de build : toute erreur de faits arrête la génération statique.
const projets: readonly Projet[] = SLUGS.map((slug, index) => lire(slug, index + 1));

export function lireProjets(): readonly Projet[] {
  return projets;
}

export function lireProjet(slug: string): Projet | undefined {
  return projets.find((projet) => projet.slug === slug);
}
