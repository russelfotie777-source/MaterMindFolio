# Direction des images de décor — génération et sélection

Rédigé par Claude Code le 20 octobre 2026, à la demande de Russel : des images « encore plus belles, incroyablement belles », avec ses caractéristiques. Russel autorise les images générées pour le décor (`DISCUSSION.md`, section 6). Ce document sert à les produire dans Magnific, que Russel utilise, ou dans le générateur de ChatGPT/Codex. Codex reste DRI de la direction visuelle et peut l'ajuster.

## 1. Caractéristiques imposées par Russel

- **Japon**, jamais Douala ni paysage sec ;
- **verdure et violet**, couleurs vivantes et pleines de vie ;
- **sombre bienvenu s'il est vivant** ; l'excès de clair est refusé ;
- **à couper le souffle**, paysages surtout ;
- aucune couleur morte, aucune brillance « IA » : pas de halo, de bloom, de flare ni d'effet verre.

Repères de couleur mesurés dans ses références (`COULEURS_REFERENCES_RUSSEL.md`) : violet profond `#402a87` à `#7e13e0`, magenta `#d728bf`, vert `#1bda76`, noir texturé `#01040b`–`#272727`.

## 2. Contraintes techniques de la scène 3D

- Le **Soleil, les planètes, la comète et les pierres sont des objets 3D** : aucune image ne contient de disque solaire, de planète ou de comète dessinés.
- Le **ciel principal** est un panorama **équirectangulaire 2:1** (4096 × 2048 au minimum), horizon parfaitement horizontal au milieu, sans couture visible entre les bords gauche et droit. La lueur de l'aube est centrée sur l'horizon : le Soleil 3D sera placé juste derrière.
- Les **matières** sont des textures **raccordables sans couture**, carrées, de 2048 × 2048, vues de face, sans ombre portée ni perspective.
- Format dans le générateur : **2:1** pour les images 1 à 5, puis recadrage en 16:9 pour le desktop ; **1:1** pour la texture 6. Si l'outil propose 16:9, on peut le choisir pour les images 2 à 5.
- Chaque image garde une **zone calme** où un texte reste lisible.
- Aucun texte, kanji d'enseigne, logo, filigrane, personne ni bâtiment moderne.

## 3. Les six images à produire

Prompts en anglais, la langue que ces modèles suivent le mieux. Générer au moins huit variantes par image.

### 1. Ciel d'ouverture : l'aube au-dessus d'une mer de nuages

> Equirectangular 360 panorama, 2:1, Japanese dawn seen from a high mountain ridge above a vast sea of clouds, Mount Fuji as a distant dark silhouette on the horizon, deep violet zenith (#402a87) fading through magenta (#d728bf) into a thin warm gold band exactly on the horizon line, the last stars still visible high in the sky, dark living tones, natural light, photographic realism, rich but believable colour, no sun disc, no lens flare, no glow, no bloom, no people, no text, no buildings, seamless left and right edges, horizon perfectly level at the vertical centre.

### 2. Glycines de nuit

> Night photograph of ancient Japanese wisteria trellis in full bloom, long violet cascades (#7e13e0 to #402a87) softly lit from below, deep green leaves, dark living background, quiet garden without anyone, photographic realism, crisp petals, natural lantern light only, no glow halos, no neon, no bokeh balls, no people, no text, wide 16:9 composition with a calm dark area on the left for text.

### 3. Forêt de bambous au crépuscule

> Arashiyama-style bamboo forest at blue-violet dusk, tall vivid green bamboo trunks (#1bda76 highlights on deep green), cool violet light filtering from above, a stone path disappearing into darkness, rich living shadows, photographic realism, no fog glow, no light rays effect, no people, no signs, no text, 16:9.

### 4. Révélation : le lac miroir

> Mirror-calm Japanese mountain lake at the first minute of sunrise, Mount Fuji perfectly reflected, a single narrow trail of golden light on the water like a trace, deep violet and indigo sky, dark shores with green pines, photographic realism, no sun disc visible (sun just behind the left ridge), no lens flare, no glow, no people, no boats, no text, 16:9.

### 5. Univers étoilé : fond du portrait et du final

> Clear night sky above Mount Fuji, dense Milky Way in natural colours, faint green airglow near the horizon, deep violet-black sky (#01040b to #402a87), tiny distant village lights absent, dark living landscape, astrophotography realism, no star trails, no glow halos, no planets, no comet, no people, no text, 16:9 with the lower third dark and calm for a portrait cut-out.

### 6. Matière des pierres suspendues

> Seamless tileable texture, 2048 x 2048, dark Japanese volcanic stone with fine grain and small pockets, thin living green moss in the cracks, slight violet cast in the shadows, flat front view, even diffuse lighting, no cast shadow, no perspective, no glossy reflections, physically plausible, photographic realism.

## 3 bis. Prompts v2 après la première série (20 octobre 2026)

La revue (`REVUE_DECOR_CANDIDATS.md`) retient 01 et 02 telles quelles. Les prompts 03 à 06 sont resserrés pour corriger les défauts relevés. Format : 2:1 pour 03 à 05, **1:1** pour 06.

### 3 v2. Bambous : composition lisible et violet cohérent

Défauts corrigés : image chargée partout, taches roses dans le ciel.

> Arashiyama bamboo forest at deep blue-violet dusk, seen from human eye height, an old stone path curving from the lower right into the depth, tall bamboo trunks clearly separated with crisp nodes, vivid living green (#1bda76 natural highlights on deep green), the left third of the frame calm and dark with only a few trunks in shadow, sky barely visible between the leaves as small deep violet openings (#402a87), cool even dusk light, rich living shadows, photographic realism, natural colours, no merging trunks, no pink sky patches, no fog, no light rays, no glow, no people, no signs, no text, 2:1.

### 4 v2. Lac miroir : violet vivant et vraie traînée d'or

Défauts corrigés : couleurs trop douces, traînée d'or absente.

> Mirror-calm Japanese mountain lake one minute after sunrise, Mount Fuji with faint pink alpenglow on its snowcap and a perfect reflection, the sun hidden just behind the dark left ridge, a single narrow crisp golden trail of light on the still water leading toward the viewer, saturated living sky going from deep violet (#4a06f0 to #402a87) at the top to soft magenta (#d728bf) near the left horizon, dark green pine shores, rich contrast without crushed blacks, calm empty upper sky for text, photographic realism, no sun disc, no lens flare, no glow, no haze, no people, no boats, no buildings, no text, 2:1.

### 5 v2. Univers étoilé : noir violacé

Défaut corrigé : ciel bleu-gris.

> Astrophotography of a clear night above Mount Fuji, the Milky Way core rising diagonally with natural warm and violet tones, the sky a deep violet-black (#01040b to #2a1460), a faint natural green airglow band just above the horizon, the snowcap of Fuji softly lit by starlight on the right, the lower third a very dark calm volcanic field for a portrait cut-out, believable natural colours, fine pin-sharp stars, no star clumps, no star trails, no fantasy nebula, no oversaturation, no glow halos, no planets, no comet, no people, no lights, no text, 2:1.

### 6 v2. Texture de pierre raccordable

Défauts corrigés : mauvais format, raccord haut/bas visible, veines blanches, motif de dalles.

> Seamless tileable texture on all four edges, square 1:1, flat orthographic top-down view of uniform dark volcanic basalt rock, mid-dark grey value around 30 percent, fine grain with small natural vesicles and pores, a few thin cracks with sparse living green moss, very subtle violet tint only in the deepest pores, even diffuse overcast lighting, no cast shadows, no perspective, no specular highlights, no white veins, no flagstone, tile or cell pattern, no visible repetition, physically plausible material, photographic realism.

### 6 v3. Texture de pierre sans répétition interne

Défauts corrigés en v2 : format 16:9 au lieu de 1:1, motif répété tous les 316 px environ. Le format **1:1 se règle dans les paramètres de Magnific**, pas seulement dans le texte. Même réussie, cette image ne donne que la couleur : le relief et la rugosité viendront d'une texture CC0 ou du code de la scène.

> One single continuous photograph of a natural dark volcanic basalt rock surface, square 1:1 image, flat orthographic top-down view, mid-dark grey value around 30 percent, fine grain with irregular natural vesicles of varied sizes, two or three thin irregular cracks with sparse living green moss, large-scale natural variation in tone across the whole surface, very subtle violet tint only in the deepest pores, even diffuse overcast lighting, edges that tile seamlessly, no repeated pattern, no tiling inside the image, no grid, no symmetry, no cast shadows, no perspective, no specular highlights, no white veins, no flagstone or cell pattern, photographic realism.

### 7. Portrait de Russel : décor retiré, univers étoilé

Russel veut retirer tout le décor de la photo originale (`IMG-20260609-WA0073.jpg.jpeg`), jugé incompatible avec l'univers. Règle : le visage, l'expression, la pose, la main, la montre et le t-shirt restent ceux de la photo ; seuls le fond, la lumière et la dominante rose changent.

**Étape A, prioritaire : détourage sans génération.** Outil « supprimer l'arrière-plan », export PNG transparent à la résolution maximale. C'est la version que la scène 3D éclaire elle-même.

**Étape B, facultative : composition éclairée** dans l'outil de retouche ou de rééclairage de Magnific, pour les affiches et images fixes.

> Keep the person exactly as in the original photo: same face, same identity, same expression, same eyes, same nose, same mouth hidden by the same hand, same fingers, same pose, same short hair, same silver watch with black strap, same black t-shirt, same framing from the chest up. Remove the entire room background, ceiling, chandelier, walls, poster, printer and curtain. Replace it with a deep violet-black night sky (#01040b to #2a1460) full of fine natural stars and a faint Milky Way, with a thin natural green airglow far below. Relight the person to match this sky: a soft violet rim light (#7e13e0) from behind on the hair, ears, shoulders and forearm, and a gentle warm golden key light from the front left like the first light of dawn. Natural dark brown skin tone, remove the pink colour cast, keep real skin texture and pores. Photographic realism. No beautification, no skin smoothing, no face reshaping, no change of age or features, no extra or missing fingers, no glow halo around the edges, no outline, no bloom, no lens flare, no text.

Contrôle obligatoire : comparer côte à côte avec l'original ; refuser toute version où les yeux, le nez, la main ou la montre ont changé.

## 4. Critères de sélection

Une image est retenue seulement si :

1. elle respecte les caractéristiques de la section 1 au premier regard ;
2. aucun artefact de génération n'est visible à 100 % : branches qui se mélangent, motifs répétés, bambous qui fusionnent, étoiles en grumeaux, reflets incohérents ;
3. le ciel panoramique se raccorde sans couture et son horizon est droit ;
4. un texte blanc ou violet reste lisible sur sa zone calme ;
5. Russel la trouve « incroyablement belle ».

## 5. Enregistrement

Pour chaque image retenue : outil et modèle utilisés, date, prompt exact, numéro de variante, conditions de licence du compte utilisé, SHA-256 du fichier, transformations. Au colophon : mention « image générée » avec l'outil. Les images candidates sont déposées dans un dossier `decor-candidats/` à la racine du projet ; Codex et Claude les trient avec Russel.
