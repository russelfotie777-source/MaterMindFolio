# 01 — Direction artistique : une personne réelle à l'aube

## 1. Thèse visuelle

TRACE SOLAIRE n'est pas un « portfolio spatial ». C'est le portrait éditorial d'un ingénieur camerounais dont le travail laisse des traces vérifiables. Le monde solaire sert trois fonctions seulement : donner une échelle, conduire le regard et transformer un geste personnel en parcours. Si le décor reste crédible après retrait du visage, du geste et des produits, le design a échoué parce qu'il est devenu générique.

La sensation recherchée est : **chaleur du matin + précision d'ingénierie + ampleur calme**. Le spectaculaire vient de la révélation et de la matérialité, pas d'une accumulation d'effets.

## 2. Signature de composition

Chaque composition majeure associe trois plans, jamais davantage :

1. **preuve humaine ou produit réel**, net et prioritaire ;
2. **architecture minérale**, qui organise la profondeur ;
3. **repère solaire**, qui situe le chapitre sans l'incarner.

Le texte important vit sur un panneau opaque ivoire ou encre, immobile, hors des zones vidéo et du firmament en mouvement.

### Test anti-générique

Une vue est rejetée si deux réponses sur quatre sont « non » :

- voit-on une matière réellement fournie par Russel ?
- comprend-on ce qui est prouvé, et par quel projet ?
- la composition reste-t-elle lumineuse sans halo ou gradient décoratif ?
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
- rayon standard : **0 px** ; rayon de confort maximal : **4 px** ;
- aucune série de cartes flottantes ; les séparations viennent des plans, filets, marges et changements de matière ;
- cible tactile minimale : **44 × 44 px** ;
- panneaux desktop : composition **7/5** ou **5/7**, jamais une grille de cartes égales sans narration ;
- mobile : empilement en tableaux, sans miniature illisible ni texte superposé à une scène mobile.

## 5. Typographie

### Familles

- **Literata Variable** : voix personnelle, titres éditoriaux, phrases de seuil et révélation finale ;
- **Hanken Grotesk Variable** : faits, navigation, preuves, boutons et corps de texte ;
- **monospace système** : code, SHA, horodatage, coordonnées et commandes seulement.

Les deux familles sont sous SIL OFL 1.1. L'intégration future auto-héberge des WOFF2 sous-ensembles latin/latin-ext, sans chargement tiers. L'italique Literata n'est chargé que si les copies validées en ont réellement besoin.

### Échelle verrouillée

| Rôle | Desktop | Mobile | Famille / graisse | Interligne |
|---|---:|---:|---|---:|
| Display manifeste | 88 px | 48 px | Literata 520 | 0,96 |
| Titre page | 64 px | 40 px | Literata 500 | 1,00 |
| Titre section | 44 px | 32 px | Literata 500 | 1,08 |
| Titre carte/projet | 28 px | 24 px | Literata 520 | 1,15 |
| Lead | 22 px | 20 px | Hanken 400 | 1,45 |
| Corps principal | 18 px | 17 px | Hanken 400 | 1,55 |
| UI / bouton | 16 px | 16 px | Hanken 600 | 1,25 |
| Preuve / légende | 14 px | 14 px | Hanken 500 | 1,40 |
| Label technique | 12 px | 12 px | Hanken 650 | 1,25 |

Le display n'est jamais une ligne d'accroche générique. Les textes techniques utilisent des capitales avec parcimonie ; un label peut recevoir `0,06em` d'approche, jamais le corps de texte.

## 6. Couleur : rôles fermes, valeurs encore bloquées

La palette finale ne peut pas être créée sans les photographies étalonnées. Aucune couleur provisoire n'est enregistrée comme token, afin qu'elle ne devienne pas accidentellement la marque.

| Bucket mesuré | Part cible | Source obligatoire | Usage |
|---|---:|---|---|
| `surface/mineral` | 72 % | pierre/papier avec référence blanche | surfaces principales, panneaux, chemin |
| `text/ink` + `sky/cobalt` | 18 % combinés | pierre sombre + panorama d'aube réel | texte, profondeur, firmament ; valeurs distinctes |
| `earth/laterite` | 8 % | sol ou agrégat réel | tranche, joints, repères terrestres |
| `project/accent` | ≤ 2 % | média ou marque du projet actif | focus local uniquement |

Les rôles sémantiques finaux sont séparés même lorsqu'ils partagent un bucket de surface : `surface/mineral`, `text/ink`, `sky/cobalt`, `earth/laterite`, `solar/warm`, `project/accent` et `state/focus`. `solar/warm` et `state/focus` sont des usages fonctionnels très localisés, pas deux pourcentages ajoutés au total. Les proportions 72/18/8/2 excluent portraits et médias produit.

### Protocole de verrouillage chromatique

1. photographier en lumière naturelle avec carte blanche ou grise ;
2. retirer EXIF/GPS sur les dérivés, jamais sur les masters privés ;
3. neutraliser balance des blancs et exposition ;
4. prélever plusieurs zones médianes, jamais un pixel isolé ;
5. harmoniser en OKLCH sans effacer les irrégularités ;
6. convertir en sRGB et tester corps ≥ 7:1, grand texte ≥ 4,5:1, UI ≥ 3:1 ;
7. mesurer les captures clés avec le protocole de luminance ci-dessous ;
8. seulement alors écrire les tokens couleur et demander le visa de Russel.

### Protocole de lumière

Pour chaque capture de référence, un script de QA futur classe les pixels sRGB convertis en luminance relative :

- `clair` : luminance ≥ 0,35 ;
- `quasi-noir` : luminance ≤ 0,05 ;
- ouverture et final : clair ≥ 60 %, quasi-noir < 25 % ;
- autres chapitres : quasi-noir < 35 %.

Le calcul exclut uniquement les barres du navigateur et les marges de capture ; il n'exclut ni le Canvas, ni l'UI. Une capture conforme par hasard ne remplace pas la revue perceptuelle.

## 7. Matières

### Signature — promenade minérale

Pierre claire et agrégat de latérite poli : surface mate, tranche visible plus dense, joints vrais, micro-irrégularités directionnelles, arêtes légèrement usées, incrustation solaire très fine. La géométrie doit montrer comment le chemin tient, se raccorde et reçoit son ombre.

### Secondaire 1 — papier et encre

Papier blanc cassé réel, fibres visibles seulement en gros plan, encre noire légèrement absorbée. Réservé au geste, aux transitions de trace et à quelques détails éditoriaux.

### Secondaire 2 — métal solaire

Incrustation chaude, mate à semi-mate, sans chrome, néon ni bloom. Elle conduit la lumière par réflexion et ne devient jamais un tube lumineux courant le long du chemin.

Une scène contenant verre généralisé, plastique brillant, poussière décorative ou plus de ces trois matières est rejetée.

## 8. Compositions majeures

### Preuve du « wow » avant release

Les 65 vues contrôlent la couverture, mais ne prouvent pas à elles seules la beauté. `DR-1 SIGNED` exige huit moodframes fabriqués exclusivement avec les sources validées : accueil 0 s desktop et mobile ; match-cut matière à 3 s ; révélation solaire à 10 s desktop et mobile ; un belvédère avec vrai média desktop et mobile ; final geste + portrait. Chacun passe le test anti-générique, le masque de luminance et une revue de Russel.

### Accueil / Base 237 — desktop

- colonnes 1–5 : portrait 4:5 réel, occupant 35 à 45 % de la composition utile ;
- colonnes 7–12 : identité, manifeste court, rôle validé, origine, actions ;
- limbe terrestre et première tranche minérale : profondeur basse, jamais derrière le texte ;
- actions principales : `Commencer la visite`, `Explorer librement` ;
- actions permanentes : `Résumé recruteur`, `CV`, `Contact` ;
- à 0 s, aucune information n'attend le Canvas.

### Accueil — mobile

- portrait 4:5 pleine largeur utile dans le premier tableau ;
- nom, rôle et origine sur surface ivoire séparée, immédiatement après ;
- deux actions principales pleine largeur mais sans pilules ;
- aperçu solaire court sous les actions ;
- aucun texte sur le portrait ni commande flottante sur le visage.

La signature mobile reste une continuité, pas un feed : un filet de tranche minérale traverse les tableaux portrait → geste → pierre → révélation, change d'échelle aux raccords et disparaît seulement quand le produit réel doit dominer. Les moodframes `M-390` et `M-360` couvrent obligatoirement ces quatre moments, un belvédère et le final.

### Promenade

- horizon placé au tiers supérieur ;
- chemin entrant depuis un bord inférieur, jamais depuis le centre exact ;
- panneau de chapitre ancré à la grille DOM ;
- 60 % minimum de surfaces lumineuses à l'ouverture et au final ;
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
- navigation projet précédente/suivante alphabétique ou chronologique validée, sans recommandation de valeur.

### Résumé recruteur

- noir/encre sur ivoire, presque aucune 3D ;
- six entrées de projet de dimensions égales ;
- lecture écran et impression A4 sans couleur nécessaire ;
- identité, rôle, disponibilité, CV, GitHub et contact visibles en moins de 60 secondes.

### Final / Open Channel

- vue orthographique du geste complet ;
- retour au portrait réel dans la même composition ;
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

Une planche est refusée si elle contient un gradient violet/indigo/cyan décoratif, glassmorphism systématique, cartes `rounded-2xl`, bento générique, terminal de hero, texte à la machine, grille de points, logo de technologie comme décor, planète plastique, monolithe beige flottant, arche gratuite, bevel parfait, nuage de particules, nébuleuse, CTA en pilule sans raison, noir spatial dominant ou copy de type « passionné / build amazing things ».

