# 06 — Handoff G1 et chemin vers la signature

## 1. État de gate au 19 octobre 2026

| Gate | DRI | Verdict | Motif |
|---|---|---|---|
| G0 | Russel | **GO limité enregistré** | G1 autorisé sans code malgré les choix encore ouverts |
| G1 / Design | ChatGPT / Codex | **IN PROGRESS** | contrat de design produit ; matières réelles manquantes |
| G1 / Contenu | Russel | **BLOCKED** | six `CR-0` et réponses étoilées manquantes |
| G1 / Schémas | Claude Code | **À PRODUIRE / REVOIR** | schémas faits/copy et aperçu de validation requis |
| G1 global | ChatGPT / Codex | **NON PASSÉ** | visas Russel + Claude absents ; aucun `READY FOR CODE` |

## 2. Prochaine action de Russel

Compléter directement `docs/collecte/G1_COLLECTE.md`. L'ordre recommandé évite de tout faire d'un coup.

### Lot R1 — identité et publication

1. vrai nom ou non sur le CV public ;
2. rôle actuel exact ;
3. objectifs classés 1 à 3 et pays/entreprises visés ;
4. français seul ou français + anglais ;
5. ville de Base 237 ;
6. email public confirmé, disponibilité et CV ;
7. domaine et budget éventuel.

Ce lot débloque l'accueil, le résumé recruteur, les routes et la structure éditoriale.

### Lot R2 — minimum des six projets

Pour chacun : nom officiel, URL/statut, dates, rôle exact, périmètre personnel, une preuve, médias disponibles et état des droits. Les informations facultatives peuvent suivre. Les six fiches ont la même priorité.

Ce lot débloque les `CR-0`, le mapping réel des stations, la parité et les études de cas.

### Lot R3 — matière visuelle

1. portrait suivant le brief ;
2. dix gestes au feutre ;
3. clip du geste ;
4. panorama d'aube ;
5. pierre, latérite, papier et lieux ;
6. captures/vidéos autorisées des six projets.

Ne placer aucun master sensible dans le dépôt public. La collecte indique seulement qu'il existe et où Russel le conserve de son côté.

### Lot R4 — voix, musique, source et sauvegarde

Répondre voix oui/non, donner 2–3 références émotionnelles, préciser licence/création possible, autoriser ou refuser SOURCE et snapshot, confirmer le flux de validation de la PR et décrire les deux sauvegardes sans mot de passe.

## 3. Handoff à Claude Code — visa de faisabilité G1

Claude peut intervenir maintenant, toujours sans scaffold ni code applicatif :

- relire les sept fichiers de `design/releases/DR-1` ;
- marquer chaque exigence `ACCEPT`, `RISK` ou `BLOCK`, avec mesure ou limite contractuelle ;
- vérifier les budgets du clip, de la typographie, des scènes et de l'audio ;
- valider les deux bus audio et la stratégie de prémix/sommation ;
- confirmer les 65 vues de contrôle et les routes additionnelles ;
- proposer les schémas `facts` et `copy` en documents G1, avec exemples explicitement fictifs ou vides ;
- déployer la fiche commune en six tableaux complets si Russel préfère remplir sans copier/coller, en gardant `Ce que tu as fait toi-même` obligatoire et sans jamais demander de chemin de stockage privé ;
- produire un aperçu lisible permettant à Russel de valider sans lire du JSON ;
- intégrer dans ses checklists G2 les trois notes de sa signature R1 : permissions GitHub Actions, test CSP/SRI en premier et pages d'erreur sur mesure ;
- ne créer aucun package, config, route, composant, test ou dépendance avant `READY FOR CODE`.

Le visa attendu est écrit dans ce fichier sous la forme :

> **CLAUDE — VISA FAISABILITÉ DR-1 : ACCEPTÉ / ACCEPTÉ AVEC RÉSERVES / BLOQUÉ**, date, réserves numérotées, preuve ou budget concerné.

## 4. Travail suivant de ChatGPT / Codex après réception

1. auditer les sources et refuser celles qui exposent une donnée ou n'ont pas de droit ;
2. étalonner ciel, pierre, latérite, papier et portrait ;
3. écrire les tokens chromatiques exacts ;
4. produire les compositions haute fidélité aux viewports normatifs ;
5. produire les contact sheets de parité ;
6. finaliser le storyboard avec les vrais ratios et contenus ;
7. rédiger copy, narration, textes alternatifs et transcript candidate sans inventer de faits ;
8. soumettre l'ensemble à Russel puis à Claude ;
9. émettre `DR-1 SIGNED` seulement après résolution de toutes les réserves.

## 5. Preuves nécessaires pour fermer G1

| Preuve | Owner | Visa |
|---|---|---|
| `DR-1` complète, exportable et versionnée | ChatGPT / Codex | Russel identité + Claude faisabilité |
| six `CR-0` | Russel | Russel faits/droits |
| schémas facts/copy + aperçu | Claude Code | Russel faits + ChatGPT besoin éditorial |
| registre d'actifs/droits | Russel avec agents en conseil | Russel |
| test de sauvegarde | Russel | Russel |
| tuple technique et budgets consignés | Claude Code | Claude |
| procès-verbal G1 | les trois parties | trois mentions `G1 PASS` |

## 6. Texte exact de clôture

Quand — et seulement quand — toutes les preuves sont jointes :

```text
ChatGPT / Codex — G1 PASS : DR-1 signée et fidélité visuelle validée.
Claude Code — G1 PASS : schémas valides et faisabilité technique validée.
Russel — G1 PASS : faits, identité, actifs et droits validés.
STATUT DU CONTRAT : READY FOR CODE.
```

Avant ces quatre lignes, tout document reste de la planification ou de la collecte G1. Le mot `GO` déjà donné ne doit pas être réinterprété comme autorisation de coder.

## 7. Registre des réserves DR-1 Candidate 0

| ID | Réserve | Owner de résolution | Bloque signature |
|---|---|---|---|
| `DR1-R01` | valeurs palette non sourcées | Russel → ChatGPT | oui |
| `DR1-R02` | portrait final absent | Russel | oui |
| `DR1-R03` | geste et clip absents | Russel | oui |
| `DR1-R04` | six CR-0, médias et droits absents | Russel | oui |
| `DR1-R05` | ville, langues, objectifs, CV/contact incomplets | Russel | oui |
| `DR1-R06` | voix, musique et licence indécises | Russel | oui pour version sonore, non pour parcours silencieux |
| `DR1-R07` | extrait SOURCE et snapshot non autorisés | Russel + Claude | oui |
| `DR1-R08` | schémas de contenu non produits | Claude | oui |
| `DR1-R09` | visa de faisabilité DR-1 absent | Claude | oui |
| `DR1-R10` | sauvegarde privée non confirmée/testée | Russel | oui |
| `DR1-R11` | original portrait déjà suivi par Git ; conservation/retrait et exposition du remote à trancher | Russel | oui |
| `DR1-R12` | huit moodframes sourcés de preuve du « wow » non produits | ChatGPT après sources Russel | oui |

## 8. Visa Claude

_En attente._

## 9. Visa Russel

_En attente des sources et validations. Le GO G1 déjà donné n'est pas ce visa._

## 10. Signature ChatGPT / Codex

**DR-1 Candidate 0 émise le 19 octobre 2026 — spécification signée par son DRI, release finale non signable tant que `DR1-R01` à `DR1-R12` ne sont pas résolues.**

