# Revue des images de décor — première série Magnific

Revue technique de Claude Code, 20 octobre 2026, sur les six fichiers de `decor-candidats/`. Le goût reste à Russel ; l'intégration visuelle à ChatGPT/Codex.

## Constats communs

- Les six fichiers font **1440 × 720** (2:1). C'est trop petit pour un fond plein écran : à agrandir ×4 avec l'upscaler de Magnific (5760 × 2880) avant toute intégration, puis dériver les tailles mobile et desktop.
- Aucune métadonnée de provenance dans les PNG : la provenance sera consignée au registre (outil, prompt, identifiant présent dans le nom de fichier, date, conditions de licence du compte Magnific).
- Mesures : part de pixels sombres (luminosité < 15 %), clairs (> 75 %) et vifs (saturation > 45 %), sur une réduction 360 × 180.

## Image par image

| N° | Fichier | Verdict | Mesures | Remarques |
|---:|---|---|---|---|
| 01 | ciel d'ouverture | **Retenue** | sombre 41 %, clair 2 %, vif 49 % ; violet `#533585` | Raccord gauche/droite propre (écart 3,2 contre 3,6 à l'intérieur de l'image). Ce n'est pas un vrai panorama équirectangulaire : l'horizon est à 65 % de la hauteur au lieu de 50 %, et le haut n'est pas déformé comme un zénith. Il sera posé sur un **décor cylindrique**, l'horizon recalé à hauteur d'yeux, et les étoiles du zénith viendront de la 3D. La lueur derrière le Fuji fixe la position du Soleil 3D. |
| 02 | glycines de nuit | **Retenue** | sombre 78 %, vif 2 % ; violets `#4b297c` à `#673d9d` | Sombre vivant, zone calme à gauche pour le texte. Vérifier les grappes et les branches après agrandissement. |
| 03 | bambous au crépuscule | Retenue sous réserve | sombre 74 % ; verts `#124b1e` à `#205528` | Très beau vert. L'image est chargée partout : texte seulement sur panneau opaque. Vérifier en pleine taille que les tiges ne fusionnent pas. |
| 04 | lac miroir | Retenue sous réserve | sombre 24 %, vif 0 % ; indigo `#1a2447` | Magnifique mais plus doux et moins saturé que la règle des couleurs vivantes. La traînée d'or sur l'eau demandée n'apparaît pas. Un étalonnage vers le violet peut suffire ; sinon, nouvelle série. |
| 05 | univers étoilé | Retenue sous réserve | sombre 85 % ; bleu nuit `#111e2f` | Voie lactée et lueur verte crédibles, tiers bas sombre pour le portrait. Le ciel tire vers le bleu-gris : étalonnage vers le noir violacé demandé. Vérifier les amas d'étoiles en pleine taille. |
| 06 | texture de pierre | **À refaire** | sombre 89 % | Format 2:1 au lieu de 1:1, 1440 × 720 au lieu de 2048 × 2048. Raccord haut/bas visible (18,0 contre 11,9). Les veines blanches sont peu crédibles sur une pierre volcanique, et le motif de dalles se répéterait sur les pierres 3D. Relancer en 1:1 avec « no white veins, no flagstone pattern, uniform volcanic rock ». La pierre peut aussi être générée par le code de la scène. |

## Deuxième série (prompts v2, 20 octobre 2026)

| N° | Verdict | Mesures | Remarques |
|---:|---|---|---|
| 03 v2 bambous | **Retenue** | 1440 × 720 ; sombre 84 %, vif 10 % | Composition corrigée : tiers gauche calme, chemin depuis le bas à droite, tiges séparées. Seule réserve : une tache vert fluo en haut à droite, à adoucir à l'étalonnage. |
| 04 v2 lac miroir | **Retenue** | 1440 × 720 ; sombre 30 %, vif 61 % | Violet et magenta vivants, reflet du Fuji juste, branches au premier plan. La traînée d'or reste diffuse, mais l'image tient sans elle. |
| 05 v2 univers étoilé | **Retenue** | **1280 × 720 (16:9)** ; sombre 82 % | Plus violacé, lueur verte et tiers bas sombre pour le portrait. Format 16:9 au lieu de 2:1, sans conséquence pour son usage en fond du final. |
| 06 v2 texture | **Écartée** | **1280 × 720 (16:9)** au lieu de 1:1 | Plus de veines blanches, mais le motif se répète tous les 316 px environ : l'image est déjà un pavage visible (écart de 13,3 à ce décalage contre 22,2 à un décalage quelconque). Sur des pierres 3D, la répétition sauterait aux yeux. |

Pour la matière des pierres, une image générée ne suffit pas : un rendu 3D crédible demande un jeu PBR complet (couleur, relief, rugosité). Solution retenue par Claude : une texture de roche photographiée sous licence CC0 (Poly Haven ou ambientCG), livrée avec ses cartes, ou une pierre générée par le code de la scène. Aucune nouvelle série 06 n'est donc demandée à Russel.

### Texture 06 v3

**Retenue comme couleur de la pierre.** 1280 × 720 (encore 16:9), valeur moyenne 20 %. Plus aucune répétition interne : aucun décalage ne ressemble plus à l'image que les autres (meilleur écart 14,1, médiane 16,6), contrairement à la v2. Basalte crédible, mousse dans la fissure, nuance violette dans les pores. Traitements prévus : recadrage carré 720 × 720 hors de la grande fissure diagonale, rendu raccordable par décalage et fondu des bords (le raccord haut/bas actuel se voit : 16,6 contre 11,3), éclaircissement vers 30 %, agrandissement ×4. Le relief et la rugosité restent fournis par une texture CC0 ou par le code de la scène.

## Portrait de Russel (20 octobre 2026)

Deux versions déposées par Russel dans `design/`, qui demande à Claude de choisir.

| Version | Fichier | Verdict | Constats |
|---|---|---|---|
| A, détourage | `design/magnific__background__71841.png` | **Choisie pour le site** | 1923 × 2560, pleine résolution de l'original, fond transparent (alpha à 254 sur le sujet, sans trou). Contours propres sur les cheveux et la main, aucun halo. Visage strictement d'origine. Reste à faire : retirer la dominante rose et le reflet rouge sur le doigt, puis éclairer le portrait dans la scène 3D (liseré violet, lueur de l'aube). |
| B, composition éclairée | `design/magnific__keep-the-person-exactly-as-in-the-original-photo-s__71842.png` | Gardée comme **référence de rendu**, pas pour le site | Identité préservée : yeux, nez, sourcils, main et montre conformes à l'original. Mais 960 × 1280 seulement, peau très orangée, et une bande verte beaucoup trop forte, qui ressemble à une aurore et non à une lueur discrète. Elle montre l'éclairage que la 3D doit reproduire ; utilisable plus tard pour l'image de partage, après agrandissement et atténuation du vert. |

## Suite

1. Russel confirme les images qu'il aime.
2. Agrandissement ×4 des images retenues, dans Magnific.
3. Nouvelle série pour la texture 06, et éventuellement pour 04 si l'étalonnage ne suffit pas.
4. Codex étalonne et intègre en C3 ; Claude mesure poids, mémoire et rendu dans la scène.
