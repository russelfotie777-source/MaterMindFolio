# ADR-004 — Architecture de l'îlot immersif (G3)

- Statut : **accepté avec amendements** le 23 octobre 2026 par ChatGPT / Codex (`design/reviews/2026-10-23-ADR-004-CODEX.md`). Les amendements sont intégrés à la section 7. Il s'applique au lot G3, qui ne s'ouvre qu'après `G2 PASS` (contrat, section 11).
- Auteur : Claude Code, DRI de G3 (contrat, sections 8 et 11).
- Revue : Codex, pour le mouvement et l'image (section 2, points 3, 4, 7, 9 et 10 ; sections 4 et 5). Aucune décision visuelle n'est prise ici.
- Cadre : contrat T03, T06, T08, T09, T12, T14, section 3.1 (points 1, 2, 3 et 5), section 4 et section 7 ; DR-1 `02_STORYBOARD_VISITE.md`, `04_MOUVEMENT_SON_ACCESSIBILITE.md`, `07_BUDGETS_PREUVES.md` ; réserves `C3-R1` à `C3-R5`.

## 1. Mesure qui motive cet ADR

Les bibliothèques verrouillées par l'ADR-002 ont été installées hors du dépôt, puis regroupées et minifiées par esbuild comme le ferait un îlot client. React et React DOM sont exclus : le socle les charge déjà. L'entrée importe ce qu'une scène G3 utilise réellement : rendu WebGL, caméras, maillages, points, matériaux standard, lumières, chargeur glTF et décodeur Meshopt.

| Assemblage | Minifié | Brotli q11 | Brotli q5 |
|---|---:|---:|---:|
| R3F avec `<Canvas>` + Three.js + GSAP + Zustand | 1 074 Ko | **249 Ko** | **278 Ko** |
| R3F avec `createRoot` et catalogue `extend` explicite + Three.js + GSAP + Zustand | 890 Ko | **208 Ko** | **233 Ko** |
| Three.js + GSAP + Zustand, sans R3F | 715 Ko | 160 Ko | 180 Ko |

Le plafond de l'îlot mobile est de **290 Ko Brotli, JS compris** (contrat, section 7). Le composant `<Canvas>` de R3F 9 appelle `extend(THREE)` sur tout l'espace de noms de Three.js, ce qui empêche l'élagage : il ne laisserait que 12 à 41 Ko pour le contrôleur, la scène, le player et le moteur audio. Le niveau de compression du CDN en production n'est pas garanti au niveau q11 : la colonne q5 est la plus réaliste.

## 2. Décision

1. **R3F 9 est conservé (T06), mais `<Canvas>` est interdit.** La scène est montée par `createRoot` sur un `<canvas>` que le composant React de l'îlot possède, avec un catalogue `extend({ … })` limité aux classes réellement employées. Une règle ESLint `no-restricted-imports` bloque l'import de `Canvas`. Marge mesurée pour notre code : 57 à 82 Ko.
2. **Repli documenté, non retenu.** Si la mesure du lot G3 complet dépasse 290 Ko en Brotli q5, la scène passe en Three.js impératif (marge 110 à 130 Ko). Ce changement modifierait T06 : il exigerait un nouvel ADR et le visa de Codex.
3. **Une seule horloge, une seule boucle** (section 3.1, point 2). Le ticker GSAP est l'unique boucle applicative, avec `lagSmoothing(0)`. À chaque tick, il lit l'horloge (`AudioContext.currentTime` avec son, `performance.now()` sans son), positionne la timeline par `timeline.time(t)` à partir de cette horloge, puis appelle `advance(timestamp)` de R3F, configuré en `frameloop: 'never'`. Hors lecture et onglet masqué, le ticker est retiré : la scène ne rend qu'à la demande (un `advance` après un saut, un redimensionnement ou un changement de DPR).
4. **Une seule timeline GSAP**, dont les labels sont exactement les 12 identifiants de chapitre du storyboard (`opening` … `open-channel`). Durées, fragments et poses viennent d'un seul fichier de données, `src/visite/chapitres.ts`, relu par la timeline, le player, l'index DOM et les tests. GSAP n'interpole que poses caméra, valeurs de matériaux et transitions DOM ; il ne possède jamais l'état métier.
5. **Contrôleur fini en TypeScript pur** (`src/visite/controleur.ts`) : les états et événements de la section 4 du contrat, sans dépendance, testés par `node:test` comme l'allowlist de la copy. Le store `zustand/vanilla` contient mode, chapitre, progression stable, préférences et point de reprise. React ne s'abonne qu'à des sélecteurs grossiers (chapitre, mode, pause), jamais à la progression par image.
6. **Frontière client au plus bas** (T03). Le HTML actuel de `/` et `/visite` reste le contenu et le fallback. L'îlot ajoute seulement un `<canvas aria-hidden="true">` sans élément focalisable, le player DOM et le choix sonore (`<dialog>` natif). Il est importé dynamiquement, dans un chunk séparé, et jamais par une page sans visite.
7. **Chargement de l'îlot.**
   - Sur `/visite`, il se charge au geste « Démarrer ».
   - Sur l'accueil, le teaser silencieux de 0 à 10 s ne se charge qu'après le `load`, pendant un temps libre, et seulement si ces quatre conditions sont réunies : WebGL2 disponible ; pas de `prefers-reduced-motion` ; pas de `Save-Data` ; connexion autre que `2g` ou `slow-2g` quand l'information existe. Sinon, l'image d'aube et le portrait actuels restent l'expérience complète.
8. **WebGL indisponible.** La détection crée un contexte WebGL2 avec `failIfMajorPerformanceCaveat: true`. En cas d'échec ou de perte de contexte, le contrôleur passe en `webgl-unavailable`, le canvas est retiré et le libellé « Version légère active » de la DR-1 apparaît. La page garde les mêmes faits, médias et routes.
9. **Mouvement réduit.** Il emploie le même contrôleur et les mêmes chapitres, mais une vue fixe : les 15 tableaux du storyboard, sans caméra automatique. Ce n'est pas une seconde application.
10. **Actifs 3D** (T12, réserves C3).
    - Format : glTF 2.0 compressé en Meshopt. Le décodeur de Three.js (`three/examples/jsm/libs/meshopt_decoder.module.js`) instancie du WebAssembly, déjà permis par `'wasm-unsafe-eval'`, et ses workers optionnels naissent d'un `blob:`, déjà permis par `worker-src`. La CSP ne change pas.
    - Textures : WebP, pas de KTX2 au segment 1.
    - Ciel (`C3-R3`) : décor cylindrique, horizon à hauteur d'yeux, étoiles du zénith en points 3D, tangage limité à ±15°.
    - Pierres (`C3-R4`) : couleur du basalte C3, relief CC0 ou procédural, 60 Ko au plus sur mobile.
    - Planètes (`C3-R5`) : cartes du domaine public, 512² au plus sur mobile.
    - Chaque actif passe par `scripts/media.ts` ou un script frère : dérivé déterministe, nom à empreinte, manifeste vérifié en CI.
11. **DPR et adaptation** (section 3.1, point 5). DPR initial de 1,5 au plus sur mobile et de 2 sur desktop. Le moniteur à hystérésis ne baisse le DPR, puis les effets non essentiels, qu'à une frontière de chapitre, et ne remonte jamais pendant la visite.

## 3. Organisation du code

```text
src/visite/
  chapitres.ts        12 chapitres : id, fragment, début, durée, poses (données, sans logique)
  controleur.ts       réducteur fini : états et événements du contrat, section 4
  store.ts            zustand/vanilla : état métier, abonnements grossiers
  horloge.ts          source audio ou performance.now, projection de la timeline, mesure de dérive
  boucle.ts           ticker GSAP unique → timeline.time() → advance()
  scene/              racine R3F (createRoot + extend), un module par segment, chargés à la demande
  player/             barre opaque, disclosure APG, progression vocale ; aucun role="menu"
  IlotVisite.tsx      seul composant client exporté, importé dynamiquement par /visite et l'accueil
```

## 4. Preuves exigées à G3

- poids de l'îlot mesuré en Brotli q5 à chaque PR, bloquant au-delà de 290 Ko ; segment mobile complet au-delà de 650 Ko ;
- Playwright :
  - zéro violation CSP avec le canvas actif ;
  - pause, saut et reprise, puis dérive entre l'horloge et la timeline ;
  - Chromium lancé avec `--disable-3d-apis` pour le chemin `webgl-unavailable` ;
  - `reducedMotion: 'reduce'` pour la vue fixe ;
- une seule boucle applicative vérifiée : le compteur d'appels du ticker égale celui des `advance` ;
- mémoire des textures du premier segment mobile au plus 32 Mio, calculée et consignée ;
- frame time sur Galaxy A14 4 Go et sur iPhone, relevés manuels consignés dans `docs/quality/**` (section 3.1, point 6).

## 5. Questions ouvertes

Tranchées par la revue de Codex : voir la section 7. Reste ouvert pour Russel : l'accès à un Galaxy A14 et à un iPhone. Leur absence ne bloque pas cet ADR, mais bloque `G3 PASS`.

## 6. Conséquences

- Le socle G2 ne change pas : aucune page ne charge de code 3D avant l'îlot.
- Le tuple React reste lié à R3F 9 (`react` < 19.4) tant que R3F est conservé.
- Les bibliothèques de G3 sont installées dans la même PR que le premier code qui les utilise, avec leurs versions exactes de l'ADR-002.

## 7. Amendements de Codex, 23 octobre 2026

1. **Poses caméra.** Claude produit les valeurs de runtime à partir des contraintes de la DR, et Codex valide les cadrages obtenus à chaque viewport. Chaque pose de `chapitres.ts` est versionnée : variante desktop, tablette ou mobile, position, cible, FOV ou zoom, plans near et far, safe zone de lecture. Chacune des quatre poses (`entry`, `settled`, `reading`, `exit`) reçoit une capture de calibration.
2. **Monogramme.** Le master `design/releases/DR-1/assets/trace-237-monogram.svg` suffit : aucun nouveau tracé. Codex annote l'ordre et la direction de révélation de ses primitives. Le runtime révèle de 1,00 à 2,65 s, puis immobilise 350 ms, sans morph.
3. **Budget du clip supprimé.** Ses octets retournent à la réserve (au moins 140 Ko sur mobile et 240 Ko sur desktop, `07_BUDGETS_PREUVES.md`). Toute réallocation exige un amendement de la DR visé par Codex et Russel. Les plafonds de 650 Ko sur mobile et de 1,2 Mo sur desktop restent des vétos. La question posée à la section 5 de la version proposée est donc close.
4. **Preuves ajoutées à G3** :
   - **Matrice de fidélité.** Elle couvre ces états : 0, 3, 6 et 10 s, la promenade, le belvédère neutre sur desktop et mobile, le player fermé et ouvert, le mouvement réduit et le mode sans WebGL. Chaque état est capturé avec son masque de luminance, son contraste, son focus et ses surfaces, puis comparé à la DR.
   - **Chorégraphie image par image** : portrait sans fondu, tracé, match-cut à 3 s, allumage simultané à 6 s en au moins 400 ms, ouverture solaire de 8,00 à 8,30 s sans flash.
   - **Entrées et résilience** : teaser jamais en `playing`, `/visite` direct sur l'image 0 sans son, quinze tableaux du mouvement réduit dont trois pour SOURCE, perte de contexte WebGL simulée après démarrage.
   - **Performance** :
     - p95 du temps d'image : au plus 16,7 ms sur desktop et 33,3 ms sur Galaxy A14 ;
     - moins de 1 % d'images au-delà de 50 ms ;
     - mesures sur cinq chargements à froid et trois visites ;
     - chargement desktop bloquant au-delà de 1,2 Mo.
5. **Critères des actifs.** Codex les valide sur les dérivés réellement intégrés et sur les captures, jamais sur des références seules.
   - **Pierre** : basalte mat `#323131`, pores, fissures, arêtes usées ; ni plastique ni bloom ; 60 Ko au plus sur mobile.
   - **Ciel** : cylindre sans couture, horizon à hauteur d'yeux, tangage limité à ±15°, zénith en points 3D ; mention « image générée » conservée.
   - **Planètes** : vraies sphères, cartes du domaine public ou sous licence, 512² au plus sur mobile, quatre corps actifs au plus ; aucun glow ; toujours secondaires au média et au texte.
