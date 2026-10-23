# Schémas de contenu G1 — `DR1-R08`

Auteur : Claude Code, propriétaire des schémas de contenu (contrat, section 9). Date : 20 octobre 2026.
Statut : **livré**. Revue éditoriale de ChatGPT/Codex : acceptée le 20 octobre 2026 avec une réserve technique, corrigée le même jour (section 4). Les valeurs attendent le visa de Russel.

Ce sont des documents G1 : aucun package, aucune configuration et aucun code applicatif. Au lot G2, ces contrats seront repris tels quels en schémas Zod `server-only` (contrat, T10 et section 3.1, point 12).

## 1. Fichiers

| Fichier | Rôle |
|---|---|
| `schemas/fact.schema.json` | Types communs : dates, liens `https:`, identifiants d'actifs, sources et **enveloppe de fait** |
| `schemas/project-facts.schema.json` | Faits d'un projet ; un fichier par projet, même schéma pour les six |
| `schemas/profile-facts.schema.json` | Faits d'identité : nom public, intitulé, poste actuel, base, contact, disponibilité, langue |
| `schemas/project-copy.schema.json` | Manifeste des textes éditoriaux d'un projet : sections stables et faits qu'elles supposent |
| `../content-release/CR-0/*.facts.json` | Brouillons CR-0 des six projets et du profil, transcrits de la fiche G1 |
| `../content-release/CR-0/APERCU.md` | Aperçu lisible que Russel valide sans lire de JSON |

## 2. Règles des faits

- **Enveloppe obligatoire.** Chaque fait porte `value`, `sources`, `validatedAt`, `visibility` et `rightsOwner` (contrat, section 5). Une `note` facultative signale ce qui reste à confirmer.
- **Sources déclarées.** Chaque fichier liste ses sources : déclaration de Russel, contrôle public, historique de dépôt, journal de production, fiche store ou document. Une source ne contient jamais de chemin local, de nom de service de stockage, d'identifiant ou de secret ; un dépôt privé est désigné par un libellé.
- **Visa explicite.** `validatedAt` reste `null` tant que Russel n'a pas validé l'aperçu. Un fichier ne passe en `approved` qu'avec la date du visa de Russel **et** une date `validatedAt` sur chacun de ses faits ; le schéma refuse les deux cas incomplets.
- **Minimum CR-0.** Sont requis : nom, liens, statut, période, organisation, rôle, ce que Russel a fait lui-même, plateformes, stack, au moins une preuve, droits et éléments confidentiels. Équipe, médias et décisions sont facultatifs.
- **Absent reste absent.** Une valeur inconnue n'est pas remplacée par une valeur plausible. Une ville inconnue n'apparaît pas ; une date approximative est marquée `approximate: true`.
- **Confidentiel toujours privé.** Le champ `confidential` est forcé à `visibility: "private"`. Un fait `private` n'entre ni dans le HTML, ni dans les métadonnées, ni dans le JSON client.
- **Médias par identifiant.** Un média est désigné par son identifiant opaque du registre (`H237-…`), jamais par un chemin.
- **Slugs stables.** Le `slug` est identique au fragment `project-<slug>` du storyboard DR-1 et au nom du fichier.

## 3. Règles de la copy

- Les textes sont des fichiers CommonMark restreints, un fichier par section : `content/copy/fr/projects/<slug>/<section>.md`. Pas de frontmatter, donc l'identité de la section vient du manifeste.
- Sections stables d'un projet : `need` (BESOIN, seulement si Russel l'a écrit, `author: "russel"` imposé), `product-caption` (obligatoire), `decision`, `case-study` (exigée à G4, pas à CR-0) et un texte alternatif par média.
- La copy **ne recopie jamais un fait** : dates, chiffres, rôles, liens et contacts sont rendus depuis les faits. Le manifeste déclare dans `factRefs` les faits que chaque section suppose ; la CI vérifie qu'ils existent et sont publics.
- Nœuds autorisés, liens `https:`/relatifs/fragments et plafond de 32 Kio : contrat, section 3.2. Les longueurs visibles sont fixées par la DR-1.

## 4. Contrôles exécutés le 20 octobre 2026

Réserve de Codex (`06_HANDOFF_G1.md`, section 3) : les schémas acceptaient `approved` avec un `russelVisa` daté alors que des faits restaient sans `validatedAt`. Correction : une règle `if/then` à la racine de `project-facts` et de `profile-facts` impose une date `validatedAt` sur chaque fait dès que `contentRelease.status` vaut `approved`.

Validation JSON Schema 2020-12 avec la bibliothèque `jsonschema` déjà présente sur la machine, sans installation :

- les quatre schémas sont valides ;
- les sept brouillons CR-0 passent ;
- chaque source citée par un fait est déclarée dans son fichier, et chaque nom de fichier correspond à son slug ;
- onze entrées volontairement fausses sont refusées : périmètre personnel absent, preuve absente, lien non `https:`, confidentiel rendu public, `approved` sans visa, `approved` avec visa mais faits non validés, `approved` avec un seul fait non validé, champ inconnu, mois invalide, et les deux cas `approved` incomplets sur le profil ;
- un projet et un profil `approved` complets sont acceptés.

## 5. Contrôles prévus pour la CI à G2

- validation Zod de tous les faits au build, échec bloquant ;
- parité : six fichiers projet, mêmes champs requis, mêmes sections de copy obligatoires ;
- refus de publier un fichier `draft` en production ;
- filtrage des faits `private` avant toute sérialisation, avec test sur le HTML et les chunks clients ;
- vérification des `factRefs`, des identifiants d'actifs et des liens ;
- copy contrôlée nœud par nœud sur l'allowlist mdast.

## 6. Points ouverts

- Codex : confirmer que les sections de copy couvrent les besoins du panneau BESOIN / PRODUIT / DÉCISION / PREUVE et des études de cas.
- Russel : valider `../content-release/CR-0/APERCU.md` ou le corriger.
- Parcours, compétences, Ground Track et comète auront leurs schémas avec leurs données ; le parcours de l'ancien portfolio n'est pas encore corrigé par Russel.

## 7. Intégration G2 de la copy — mode d'emploi pour Codex

Le chargeur est en place (`src/lib/copie/`). Aucune copy n'existe encore : les pages n'affichent rien à la place, sans boîte vide.

- **Manifeste** : `content/copy/fr/projects/<slug>.copy.json`, conforme à `schemas/project-copy.schema.json`, à côté du dossier `content/copy/fr/projects/<slug>/` qui contient un fichier `.md` par section.
- **Visa** : une section dont `russelValidatedAt` vaut `null` n'est pas publiée. Elle le devient dès que la date du visa de Russel y est inscrite.
- **Le build échoue** si le manifeste ne suit pas le schéma, si une section pointe hors du dossier de son projet, si un fait de `factRefs` est absent ou privé, si `need` n'est pas signée `russel`, ou si un texte visé contient un nœud hors allowlist (HTML, titre, image, code, citation, séparateur, saut de ligne forcé, lien par référence), un lien autre que `https:`, relatif ou fragment, ou dépasse 32 Kio. Ces refus sont testés par `pnpm test:unit`.
- **Emplacements** : `product-caption` devient la légende du média du projet (étude de cas et visite légère) ; `need` s'affiche sous le rôle dans l'étude de cas, sous le titre « Besoin » ; `decision` s'affiche dans la station de la visite ; `case-study` devient le corps de l'étude de cas, sous le titre « Étude ».
- **Restent à définir** avec leurs propres manifestes : la phrase d'accroche de l'accueil, la phrase du parcours, celles de Sources & fabrication et de la visite sans WebGL, la phrase finale. Elles ne sont pas des sections de projet.
