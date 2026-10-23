# ADR-001 — Lecteur des trois morceaux de référence

- Statut : **accepté**, 21 octobre 2026
- Auteur : Claude Code, propriétaire de l'architecture (contrat, section 8)
- Décision de Russel : `DISCUSSION.md`, section 6, entrées « musique » du 19 octobre 2026 et confirmation du 21 octobre 2026
- Lève : réserve `C3-R6` du visa de faisabilité (`06_HANDOFF_G1.md`, section 9)

## Contexte

Russel veut que ses trois morceaux de référence soient écoutables sur le site : Joe Hisaishi, « One Summer's Day » ; Evan Call, « Journey of a Lifetime ~ Frieren Main Theme » ; RADWIMPS, « Kataware Doki ». Ces enregistrements sont protégés : le site ne peut ni les télécharger, ni les héberger, ni les jouer en fond. Le contrat impose une CSP stricte sans `'unsafe-inline'`, aucune requête tierce non nécessaire et un site utilisable sans JavaScript.

## Décision

1. Les morceaux sont joués par le **lecteur officiel YouTube**, en mode `youtube-nocookie.com`, uniquement depuis une **publication officielle de l'ayant droit**. Un morceau sans publication officielle n'est pas proposé : il reste cité avec un lien texte vers une page officielle.
2. Le lecteur est remplacé jusqu'au clic par une **façade** locale : titre, compositeur, œuvre, vignette produite par nous et bouton « Écouter sur YouTube ». **Aucune requête vers YouTube avant le clic.**
3. Au clic, une `iframe` simple est insérée, sans l'API JavaScript de YouTube. Elle reste **visible, d'au moins 200 × 200 px**, conformément aux règles d'usage du lecteur intégré. Elle n'entre jamais dans le bus sonore `bed` ni dans la timeline guidée.
4. La CSP ajoute uniquement `frame-src https://www.youtube-nocookie.com`. Aucun ajout à `script-src`, `connect-src` ou `img-src` : la vignette de la façade est un actif local.
5. Ouvrir un lecteur met la visite en pause et coupe le fond sonore ; fermer le lecteur ne relance rien automatiquement.
6. Sans JavaScript, la façade devient un lien vers la page officielle.
7. La page `/mentions` signale qu'un lecteur tiers n'est chargé qu'après action du visiteur.

## Fond sonore de la visite

Décision de Russel confirmée le 21 octobre 2026 : le fond sonore est une **mélodie originale composée par les agents** dans l'esprit des trois références, sans narration. Cette décision du propriétaire remplace, pour la musique, la « composition humaine » demandée par le plan (section 7.10) et lève la réserve `C3-R8`. Elle reste encadrée par la DR-1 : aucune imitation reconnaissable d'une œuvre protégée, un seul bus `bed`, budgets de la section 4 de `07_BUDGETS_PREUVES.md`. Sa production relève de G6.

## Alternatives écartées

- **Spotify** : un visiteur sans compte n'entend souvent qu'un extrait.
- **API JavaScript YouTube** : script tiers et `script-src` élargi, sans besoin réel.
- **Fichiers audio hébergés ou reprises** : interdits sans licence, la mélodie restant protégée.
- **Lecture automatique en fond** : bloquée par les navigateurs, et le lecteur doit rester visible.

## Vérifications

- G2 : test CSP sur la page qui porte la façade, zéro `securitypolicyviolation`, zéro requête vers un domaine YouTube avant le clic.
- G6 : identification de la publication officielle de chaque morceau, test clavier et lecteur d'écran de la façade, pause de la visite à l'ouverture.
