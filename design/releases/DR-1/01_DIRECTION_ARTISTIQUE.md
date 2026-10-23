# 01 — Direction artistique C3 : le Japon comme horizon, la preuve comme centre

## 1. Thèse visuelle

TRACE SOLAIRE n'est pas un « portfolio spatial » ni un portfolio japonais. C'est le portrait éditorial d'un ingénieur camerounais basé à Douala, dont le travail laisse des traces vérifiables. Le Japon exprime son horizon artistique ; il ne remplace ni son origine ni ses faits. Le monde solaire donne une échelle, conduit le regard et transforme le monogramme TRACE 237 en parcours.

La sensation recherchée est : **sombre violet vivant + nature japonaise profonde + chaleur du matin + précision d'ingénierie + ampleur calme**. Le spectaculaire vient de la révélation, de la vraie profondeur 3D et de la rencontre entre une personne, ses produits et un horizon choisi — jamais d'une accumulation d'effets.

## 2. Signature de composition

Chaque composition majeure associe trois plans, jamais davantage :

1. **preuve humaine ou produit réel**, net et prioritaire ;
2. **architecture minérale**, qui organise la profondeur ;
3. **repère solaire**, qui situe le chapitre sans l'incarner.

Le texte important vit sur un panneau blanc ou violet opaque, immobile, hors des zones vidéo et du firmament en mouvement. Le blanc reste minoritaire ; il tranche avec le monde sombre sans l'effacer.

### Test anti-générique

Une vue est rejetée si deux réponses sur quatre sont « non » :

- voit-on une matière, un décor ou une preuve dont la provenance est déclarée dans le Source Kit ?
- comprend-on ce qui est prouvé, et par quel projet ?
- le violet, le vert et la lumière construisent-ils une hiérarchie lisible sans halo ni gradient générique ?
- le même écran serait-il impossible à revendre tel quel à un autre développeur ?

## 3. Viewports de référence

Ces dimensions CSS deviennent les références communes de la future IR ; le DPR est documenté séparément et ne change pas la géométrie de la maquette.

| ID | Dimensions CSS | Usage | Grille |
|---|---:|---|---|
| `D-1440` | 1440 × 900 | desktop principal | 12 colonnes, marge 64, gouttière 24 |
| `D-1366` | 1366 × 768 | laptop / stress vertical | 12 colonnes, marge 48, gouttière 20 |
| `D-1280` | 1280 × 800 | desktop compact | 12 colonnes, marge 48, gouttière 20 |
| `T-768` | 768 × 1024 | tablette portrait | 8 colonnes, marge 32, gouttière 16 |
| `M-390` | 390 × 844 | mobile principal | 4 colonnes, marge 20, gouttière 12 |
| `M-360` | 360 × 800 | Galaxy A14 / contrôle perf | 4 colonnes, marge 16, gouttière 12 |
| `M-320` | 320 × 568 | reflow minimum | 4 colonnes, marge 16, gouttière 8 |
| `P-A4` | 210 × 297 mm | résumé recruteur imprimé | marge 15 mm, une colonne |

Le contenu desktop est plafonné à 1312 px sur `D-1440` et à 1600 px sur les écrans plus larges. Le texte courant reste entre 45 et 66 caractères par ligne.

## 4. Grille et rythme

- unité de base : **4 px** ;
- espacements éditoriaux usuels : 12, 20, 32, 48, 64, 96 et 128 px ;
- aucun rayon standard répété : quatre silhouettes asymétriques alternent entre galet, feuille, coupe douce et arche ; les contrôles seuls gardent une capsule de 26 px ;
- aucune série de cartes flottantes identiques ; les séparations viennent des plans, marges, respirations et changements de matière, jamais d'une borne verticale ou d'un filet horizontal répété ;
- la fleur-goutte dessinée en SVG remplace les points décoratifs de repérage avec la couleur correspondante ; seuls les points fonctionnels de pagination restent ronds, et aucune fleur n'est accolée au libellé récurrent « HORIZON 237 » ;
- cible tactile minimale : **44 × 44 px** ;
- panneaux desktop : composition **7/5** ou **5/7**, jamais une grille de cartes égales sans narration ;
- mobile : empilement en tableaux, sans miniature illisible ni texte superposé à une scène mobile.

## 5. Typographie

### Familles

- **DM Sans** : famille unique de marque pour les titres, la voix personnelle, les faits, la navigation, les preuves, les boutons et le corps de texte ;
- **monospace système** : code, SHA, horodatage, coordonnées et commandes seulement ; il n'est jamais utilisé comme police identitaire.

Cette décision vient directement de Russel le 20 octobre 2026 : utiliser la police de ZIRIS Entreprises, sans inventer ni créer une police. La vitrine ZIRIS charge `DM Sans` depuis Google Fonts et l'applique à `.vitrine-experience`, titres compris. Le master de revue provient du dépôt officiel Google Fonts, SHA-256 `8cd08d97e89c24d0aa92edd2f0f4c8ee6195eee9b7c9f154865a58b02f0c1c0d`, sous SIL OFL 1.1.

L'intégration future auto-héberge des WOFF2 officiels ou des sous-ensembles mécaniques latin/latin-ext, sans appel à Google Fonts au runtime. Il est interdit de redessiner, modifier, renommer ou « personnaliser » les glyphes. La personnalité vient de la composition, de l'échelle, du rythme et de la couleur.

### Échelle verrouillée

| Rôle | Desktop | Mobile | Famille / graisse | Interligne |
|---|---:|---:|---|---:|
| Display manifeste | 88 px | 48 px | DM Sans 500 | 0,96 |
| Titre page | 64 px | 40 px | DM Sans 400 | 1,00 |
| Titre section | 44 px | 32 px | DM Sans 400 | 1,08 |
| Titre carte/projet | 28 px | 24 px | DM Sans 500 | 1,15 |
| Lead | 22 px | 20 px | DM Sans 400 | 1,45 |
| Corps principal | 18 px | 17 px | DM Sans 400 | 1,55 |
| UI / bouton | 16 px | 16 px | DM Sans 600 | 1,25 |
| Preuve / légende | 14 px | 14 px | DM Sans 500 | 1,40 |
| Label technique | 12 px | 12 px | DM Sans 600 | 1,25 |

Le display n'est jamais une ligne d'accroche générique. Les textes techniques utilisent des capitales avec parcimonie ; un label peut recevoir `0,06em` d'approche, jamais le corps de texte.

### Contrat éditorial humain

- un arrêt de projet montre au plus : un titre, le rôle exact, une phrase humaine, une preuve et une action ; les autres chapitres portent une idée utile et peuvent employer une liste ou un artefact compact ;
- les onze champs possibles d'une étude de cas sont un inventaire, pas onze blocs à afficher ;
- deux paragraphes courts maximum précèdent une respiration par média, schéma ou preuve ;
- chaque phrase apporte un fait, une décision, une limite, une conséquence ou une pensée personnelle de Russel ; elle ne paraphrase ni le titre ni la phrase précédente ;
- les formulations personnelles partent des mots de Russel ; une assistance IA peut corriger et condenser, jamais publier une prose brute ou lui inventer une voix ;
- toute phrase qui sonne comme un slogan interchangeable ou qu'aucun humain ne dirait à voix haute est retirée.

## 6. Couleur : palette Candidate 3.2 vivante

Candidate 2 est rejetée. Candidate 3 part des références de Russel, de ZIRIS Entreprises et des décors japonais retenus. Les valeurs exactes sont écrites dans `design/contracts/tokens.json` au format DTCG 2025.10. Russel a validé la base chromatique avec les moodframes C3 le 20 octobre 2026, puis demandé la révision organique C3.1 et le remplacement de l'accent brun par le rose le 21 octobre 2026. Sa correction C3.2 remplace les points décoratifs par la fleur-goutte correspondante, mais retire cette forme du chrome récurrent « HORIZON 237 ». Ces valeurs restent non consommables par le code tant que `DR-1 SIGNED` et `READY FOR CODE` ne sont pas acquis.

| Rôle | Valeur C3 | Plage ou limite | Usage |
|---|---|---:|---|
| `surface/canvas` | `#0e0b17` | dans les 52–72 % sombres | noir violet vivant, toujours texturé |
| `surface/depth` | `#1a103e` | grand plan sombre | profondeur issue de ZIRIS, alternative au noir plat |
| `surface/elevated` | `#251957` | plan local | panneaux sombres sans verre ni glow |
| `surface/basalt` | `#323131` | matière seulement | pierres et architecture minérale |
| `surface/paper` | `#ffffff` | 12–28 % | panneaux nets et respirations minoritaires |
| `surface/paper-tint` | `#f7f2ff` | second niveau clair | variante violette, jamais beige grisé |
| `text/on-dark` | `#ffffff` | texte principal | contraste maximum sans halo |
| `text/on-dark-muted` | `#dbb4d1` | texte secondaire | mauve vivant issu de l'aube |
| `text/on-light` | `#271859` | texte principal | encre violette profonde |
| `text/on-light-muted` | `#59358b` | texte secondaire | violet lisible, jamais gris neutre |
| `violet/primary` | `#5d17c7` | 12–30 % avec les autres violets | actions, liens et repères structurants |
| `violet/bright` | `#7e13e0` | accent court | ponctuation franche, jamais nappe lumineuse |
| `nature/bamboo` | `#154a25` | masse organique locale | ombres végétales |
| `nature/living` | `#1bda76` | ≤ 14 % | progression, focus sombre et détail végétal |
| `solar/trace` | `#f06aa6` | accent fonctionnel | rose sakura, trace douce et focus alternatif ; remplace l'ancien or brun |
| `accent/magenta` | `#d728bf` | avec tous les accents ≤ 8 % | point de tension graphique |
| `accent/blue` | `#267cf3` | avec tous les accents ≤ 8 % | signal rare et fonctionnel |
| `accent/coral` | `#ed4459` | avec tous les accents ≤ 8 % | alerte ou repère exceptionnel |

Une composition ne cherche pas simultanément chaque maximum. Les médias produit et la peau ne sont jamais recolorés pour satisfaire un quota. Le violet est un langage global assumé, pas un gradient SaaS automatique ; les variations viennent des matières, des décors et de la lumière réelle de la scène.

### Règle des couleurs vivantes

- un sombre réussi garde une information colorée et une texture perceptible ;
- un blanc réussi découpe une preuve ou une action, sans laver tout l'écran ;
- aucun voile gris ne « calme » une image forte ; la hiérarchie vient de la composition ;
- aucune couleur vive n'est transformée en glow, bloom, reflet verre ou contour néon ;
- aucun bandeau de couleur collé au bord d'une carte et aucun séparateur horizontal décoratif récurrent ;
- les textes secondaires restent mauves ou violets, jamais gris mort ;
- le vert signale la vie et le mouvement, il ne devient pas une aurore artificielle.

### Protocole de verrouillage chromatique

1. contrôler la source, son statut et son usage honnête ;
2. retirer EXIF/GPS des dérivés publics ;
3. mesurer plusieurs zones médianes et préserver les irrégularités naturelles ;
4. harmoniser en OKLCH sans grisage ni saturation forcée ;
5. convertir en sRGB et tester corps ≥ 7:1, grand texte ≥ 4,5:1, UI ≥ 3:1 ;
6. mesurer les captures clés puis demander le visa perceptuel de Russel.

### Protocole de lumière C3

Pour chaque capture, la QA classe les pixels sRGB convertis en luminance relative :

- `clair` : luminance ≥ 0,35 ;
- `quasi-noir` : luminance ≤ 0,05 ;
- clair global : 12–28 %, avec plafond de 24 % à l'ouverture et 30 % dans un chapitre éditorial ;
- aplat quasi noir sans matière : moins de 12 % ;
- le reste appartient aux violets, végétaux, matières, peau et médias.

Le calcul n'exclut ni Canvas ni UI. Une capture conforme par hasard ne remplace pas la revue perceptuelle : le sombre doit paraître vivant et le clair volontaire.

## 7. Matières

### Signature — promenade minérale

Basalte sombre à pores fins : surface mate, tranche plus dense, fissures irrégulières, mousse verte rare, arêtes légèrement usées et incrustation solaire très fine. Les pierres suspendues sont des géométries 3D avec volume, ombres de contact et matériau physique ; l'image basaltique C3 n'est qu'une référence de couleur.

### Secondaire 1 — blanc et encre violette

Blanc franc ou blanc très légèrement violet, sans fibre décorative obligatoire. L'encre `#271859` et les filets violets lui donnent sa présence. Cette matière sert les preuves et les choix ; elle reste minoritaire dans le monde immersif.

### Secondaire 2 — trace rose et fleur-goutte de repérage

Le rose `#f06aa6` remplace l'ancien or brun dans les courbes, repères et accents. La fleur-goutte, rose, violette ou verte selon la scène, est une forme vectorielle dessinée à la main : elle remplace les points décoratifs des compétences, du parcours, des sources et des séquences. Les points ronds restent réservés à la pagination et aux données qui exigent un point ; aucune fleur n'accompagne le libellé récurrent « HORIZON 237 ». L'ensemble reste mat à semi-mat, sans chrome, néon, bloom, rail latéral ni ligne décorative récurrente.

Une scène contenant verre généralisé, plastique brillant, poussière décorative ou plus de ces trois matières est rejetée. Glycines et bambous sont des environnements, jamais des textures plaquées sur les panneaux.

## 8. Compositions majeures

### Preuve du « wow » avant release

Les 65 vues contrôlent la couverture, mais ne prouvent pas à elles seules la beauté. `DR-1 SIGNED` exige huit moodframes C3 : accueil 0 s desktop et mobile ; raccord monogramme/basalte à 3 s ; révélation solaire à 10 s desktop et mobile ; un belvédère avec vrai média desktop et mobile ; final monogramme + portrait détouré. Chacun passe le test anti-générique, le masque de luminance et une revue de Russel. Les moodframes sont fixes ; les annotations « vraie 3D » définissent le comportement de l'intégration R3F future.

### Accueil / Horizon choisi — desktop

- décor d'aube C3 plein cadre, conservé vivant par un traitement colorimétrique minimal ;
- colonnes 1–5 : identité, rôle, origine réelle et actions sur plan sombre lisible ;
- colonnes 7–12 : portrait détouré intégré à la profondeur étoilée et au paysage, occupant 35 à 45 % de la composition utile ;
- première pierre basaltique 3D : profondeur basse, jamais derrière le texte ;
- actions principales : `Commencer la visite`, `Explorer librement` ;
- actions permanentes : `Résumé recruteur`, `CV`, `Contact` ;
- à 0 s, aucune information n'attend le Canvas.

### Accueil — mobile

- portrait détouré dans le ciel d'aube, sans texte sur le visage ;
- nom, rôle et origine sur un plan sombre séparé immédiatement après ;
- deux actions principales pleine largeur, l'une blanche, l'autre tracée, sans pilules ;
- aperçu solaire court sous les actions ;
- aucun texte sur le portrait ni commande flottante sur le visage.

La signature mobile reste une continuité, pas un feed : une trace solaire traverse les tableaux portrait → monogramme → basalte → révélation, change d'échelle aux raccords et disparaît quand le produit réel doit dominer.

### Promenade

- horizon placé au tiers supérieur ;
- chemin entrant depuis un bord inférieur, jamais depuis le centre exact ;
- panneau de chapitre ancré à la grille DOM ;
- 52 à 72 % de sombre vivant et 12 à 28 % de clair ;
- corps solaire situé hors de la zone de lecture et jamais traité comme un bouton-projet.

### Belvédère

- média produit : 7 colonnes desktop, première priorité ;
- preuve factuelle : 5 colonnes, panneau opaque ;
- une phrase `BESOIN`, seulement si validée ; une ligne **`TRACE / RÔLE EXACT`** et une ligne `PREUVE` obligatoires pour `CR-0` ;
- CTA `Approfondir` identique ;
- planète reconnaissable en profondeur, non confondue avec le média ;
- aucune capture forcée dans un mockup d'appareil identique pour les six projets.

### Étude de cas

- ouverture : produit et rôle, pas une image décorative ;
- corps : grille éditoriale alternant média natif, système expliqué et preuve ;
- faits absents = section absente, jamais `Lorem ipsum`, tiret ambigu ou chiffre fictif ;
- navigation projet précédente/suivante dans l'ordre chronologique verrouillé, sans recommandation de valeur.

### Résumé recruteur

- encre violette sur blanc, presque aucune 3D ;
- six entrées de projet de dimensions égales ;
- lecture écran et impression A4 sans couleur nécessaire ;
- identité, rôle, disponibilité, CV, GitHub et contact visibles en moins de 60 secondes.

### Final / Contact

- vue orthographique du monogramme complet ;
- retour au portrait détouré, clairement composé dans l'univers étoilé ;
- invitation sobre : contact, CV, revoir ou explorer ;
- aucun feu d'artifice, flash, tunnel ou fondu noir.

## 9. Parité des six projets

Le gabarit neutre part de **8 secondes par projet** : 1,5 s d'approche, 5,5 s immobiles et 1 s de dégagement. Une variation 7–9 s n'est autorisée qu'après test de lisibilité, sans changer la moyenne, la preuve immobile minimale de 4 s ni l'impression de valeur.

Le contact sheet de visa aligne les six vues au même viewport et mesure : surface du média, surface du panneau, taille du titre, durée immobile, nombre de lignes, rôle exact, preuve, CTA, contraste et saillance du corps céleste. Saturne ou Jupiter ne doivent jamais voler l'attention. Une seconde lecture vérifie la différenciation mémorable du média natif : mêmes aire/durée/profondeur, comportement produit réellement distinct, sans six clones.

## 10. Iconographie et signes

- icônes dessinées au trait simple et utilisées seulement avec un libellé lorsque l'action n'est pas universelle ;
- aucune planète utilisée comme pictogramme de projet ;
- aucune jauge de compétence, étoile, score ou barre de progression trompeuse ;
- la progression de visite indique un chapitre et une position temporelle réelle ;
- la comète a une seule traînée courte, une taille constante et une plaque datée ;
- le geste publié est un monogramme créé pour le portfolio, jamais une signature administrative.

## 11. Rejets automatiques

Une planche est refusée si elle contient un gradient violet/indigo/cyan générique sans matière, glassmorphism systématique, cartes `rounded-2xl`, bento générique, terminal de hero, texte à la machine, grille de points, logo de technologie comme décor, planète plastique, pierre simulée par une image plate, arche gratuite, bevel parfait, nuage de particules, nébuleuse fantaisie, CTA en pilule sans raison, noir plat dominant, blanc surexposé dominant, voile gris, mur de texte, Japon folklorique gratuit ou copy de type « passionné / build amazing things ».

