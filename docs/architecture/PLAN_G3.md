# Plan G3 — lot immersif : 0–10 s, player, promenade, belvédère neutre, mobile, mouvement réduit, sans WebGL

DRI : Claude Code. Visas : ChatGPT / Codex sur la fidélité et le mouvement. Architecture : `docs/adr/ADR-004-architecture-ilot-immersif-g3.md`. Ouverture avant `G2 PASS` décidée par Russel le 23 octobre 2026 (`DISCUSSION.md`, section 6). Branche : `feat/g3-ilot`.

## Suivi

| Élément | État au 23 octobre 2026 | Preuve |
|---|---|---|
| Chapitres et contrôleur fini | fait | 12 chapitres contigus, 107 s, six fenêtres projet de 8 s ; états et événements du contrat (section 4) ; 31 tests unitaires |
| Horloge unique | fait | ticker GSAP seul, `frameloop: 'never'`, `advance()` ; pause, saut et reprise sans dérive testés |
| Scène | première version | ciel d'aube cylindrique (horizon à hauteur d'yeux, Fuji droit devant), 1 600 étoiles en points 3D, sept pierres de basalte `#323131` à relief procédural (masse, grain d'agrégat, pores, fissures, albédo mat modulé ; 0 octet téléchargé, maillage plus fin pour la pierre de la Base vue en gros plan), chemin ; aucun post-traitement. Poses caméra produites par Claude, à valider par Codex |
| Îlot | fait | chargé au geste « Démarrer la visite » seulement ; choix sonore en `<dialog>` natif ; player opaque (Pause/Reprendre, progression, Précédent, Suivant, Menu) ; menu en disclosure APG, jamais `role="menu"` : index des 12 chapitres, Approfondir, Résumé recruteur, Quitter la visite ; Échap referme d'abord le menu ; fragment de chapitre ; Échap ; onglet masqué ; perte de contexte WebGL |
| Corps célestes | première version | Soleil sur l'horizon, Mercure et Vénus avec le firmament, puis un repère par station dans l'ordre du storyboard (Lune, Mars, Jupiter, Saturne et ses anneaux, Uranus, Neptune), même rayon et même éloignement pour les six ; vraies sphères, cartes Solar System Scope sous licence CC BY 4.0 (registre `assets/registry-g3.json`, crédit au colophon), 512 px sur téléphone et 1024 px au-delà ; un seul repère visible par station, sa carte téléchargée dès la station précédente ; au plus quatre corps actifs (test). À valider par Codex : placements, éclairage, parité |
| Ouverture 0–10 s | première version | image 0 (décor d'aube, identité validée, portrait réel) ; coupe vers le monogramme master de Codex sur surface ivoire à 0,90 s, tracé révélé de 1,00 à 2,65 s puis immobile ; match-cut sur la pierre de la Base à 3 s, translation latérale, élargissement ; six balises allumées ensemble à 6 s en 400 ms et index égal des six projets jusqu'à 7,80 s ; ouverture d'exposition du ciel et du firmament de 8,00 à 8,30 s. Coupes franches, pilotées par la timeline unique ; jamais rejouée par un saut. Test image par image sous horloge simulée (projet `chromium-webgl`). À valider par Codex : ordre de révélation des primitives, raccord du match-cut, poses. |
| Belvédère neutre | fait | panneau blanc opaque 7/5 (média puis panneau sur mobile, 4:3 sur tablette) : rang, nom, rôle exact, besoin si visé, une preuve, `Approfondir` seul lien ; monté dès l'approche, inerte et invisible, lisible seulement caméra arrêtée (étapes `approche`, `lecture`, `sortie` du contrôleur) ; à valider par Codex |
| Version légère | fait | WebGL2 absent ou perdu : « Version légère active », canvas retiré, stations DOM intactes |
| Mouvement réduit | partiel | visite ouverte en pause, chapitres au clavier, coupes sans caméra automatique ; les 15 tableaux du storyboard restent à composer |
| Budget | fait | 204 Ko en Brotli q5 pour 290 Ko, contrôle bloquant dans `scripts/build.ts` |
| Tests | fait | tests de bout en bout sur Chromium et Firefox sans GPU requis, plus la chorégraphie de l'ouverture sous WebGL logiciel ; zéro violation CSP ; 40 tests unitaires, dont la fidélité du monogramme au master |

## Reste à faire

- Annotation de Codex sur l'ordre et le sens de révélation des primitives du monogramme (amendement 2) ; d'ici là, l'ordre du master.
- Comète (chapitre Compétences), Terre et Ground Track.
- Teaser silencieux de l'accueil, aux conditions de l'ADR-004.
- Moteur audio (G6), volume, sourdine, sons décrits et relevé audio dans le menu du player, mesures sur Galaxy A14 et iPhone.
