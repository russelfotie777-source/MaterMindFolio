# Plan G3 — lot immersif : 0–10 s, player, promenade, belvédère neutre, mobile, mouvement réduit, sans WebGL

DRI : Claude Code. Visas : ChatGPT / Codex sur la fidélité et le mouvement. Architecture : `docs/adr/ADR-004-architecture-ilot-immersif-g3.md`. Ouverture avant `G2 PASS` décidée par Russel le 23 octobre 2026 (`DISCUSSION.md`, section 6). Branche : `feat/g3-ilot`.

## Suivi

| Élément | État au 23 octobre 2026 | Preuve |
|---|---|---|
| Chapitres et contrôleur fini | fait | 12 chapitres contigus, 107 s, six fenêtres projet de 8 s ; états et événements du contrat (section 4) ; 31 tests unitaires |
| Horloge unique | fait | ticker GSAP seul, `frameloop: 'never'`, `advance()` ; pause, saut et reprise sans dérive testés |
| Scène | première version | ciel d'aube cylindrique (horizon à hauteur d'yeux, Fuji droit devant), 1 600 étoiles en points 3D, sept pierres de basalte `#323131` à relief procédural, chemin ; aucun post-traitement. Poses caméra produites par Claude, à valider par Codex |
| Îlot | fait | chargé au geste « Démarrer la visite » seulement ; choix sonore en `<dialog>` natif ; player opaque (Pause/Reprendre, Précédent, Suivant, Approfondir, Quitter) ; fragment de chapitre ; Échap ; onglet masqué ; perte de contexte WebGL |
| Version légère | fait | WebGL2 absent ou perdu : « Version légère active », canvas retiré, stations DOM intactes |
| Mouvement réduit | partiel | visite ouverte en pause, chapitres au clavier, coupes sans caméra automatique ; les 15 tableaux du storyboard restent à composer |
| Budget | fait | 204 Ko en Brotli q5 pour 290 Ko, contrôle bloquant dans `scripts/build.ts` |
| Tests | fait | 10 tests de bout en bout sur Chromium et Firefox, sans GPU requis, zéro violation CSP |

## Reste à faire

- Ouverture 0–10 s : portrait, révélation du monogramme de 1,00 à 2,65 s, match-cut à 3 s, allumage des six stations à 6 s, ouverture solaire de 8,00 à 8,30 s (amendements de Codex).
- Belvédère neutre : panneau projet et média réel posés après l'arrêt de la caméra.
- Planètes à cartes du domaine public (C3-R5), pierres à relief CC0 (C3-R4), si leur poids tient dans la réserve.
- Teaser silencieux de l'accueil, aux conditions de l'ADR-004.
- Moteur audio (G6), menu disclosure du player, mesures sur Galaxy A14 et iPhone.
