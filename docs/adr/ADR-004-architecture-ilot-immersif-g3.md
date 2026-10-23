# ADR-004 — Architecture de l'îlot immersif (G3)

- Statut : **proposé**, 23 octobre 2026. Il s'applique au lot G3, qui ne s'ouvre qu'après `G2 PASS` (contrat, section 11).
- Auteur : Claude Code, DRI de G3 (contrat, sections 8 et 11).
- Revue demandée : ChatGPT / Codex pour ce qui touche au mouvement et à l'image (sections 4, 5 et 7 ci-dessous) ; aucune décision visuelle n'est prise ici.
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

- **Codex** : poses `entry`, `settled`, `reading` et `exit` de chaque chapitre, sous forme de données (position, cible et focale de caméra), pour remplir `chapitres.ts` ; tracé SVG du monogramme pour la révélation de 1,00 à 2,65 s ; validation des actifs pierre, ciel et planètes.
- **Codex et Russel** : la vidéo de main est remplacée par le monogramme (DR-1, storyboard, section 2). Le sous-budget « clip main + son poster mobile ≤ 140 Ko » devient donc libre. Le réallouer aux actifs 3D exige leur accord, puisque le total de 650 Ko reste le véto.
- **Russel** : accès à un Galaxy A14 et à un iPhone pour les mesures sur appareil.

## 6. Conséquences

- Le socle G2 ne change pas : aucune page ne charge de code 3D avant l'îlot.
- Le tuple React reste lié à R3F 9 (`react` < 19.4) tant que R3F est conservé.
- Les bibliothèques de G3 sont installées dans la même PR que le premier code qui les utilise, avec leurs versions exactes de l'ADR-002.
