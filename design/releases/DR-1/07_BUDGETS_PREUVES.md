# 07 — Budgets et preuves d'acceptation

## 1. Règle

Une intention visuelle n'est pas validée si elle ne peut pas tenir dans le budget de transfert, de mémoire, de frame time ou d'accessibilité. Les sous-budgets guident les arbitrages ; les plafonds complets de **650 Ko mobile** et **1,2 Mo desktop** restent les vétos absolus. En cas d'échec, on réduit l'effet avant le contenu, la preuve, le clavier ou le fallback.

## 2. Socle avant immersion

| Ressource | Cible | Décision DR-1 |
|---|---:|---|
| HTML/CSS/JS/polices/portrait initial | ≤ 500 Ko transférés | identité et actions avant Canvas |
| JavaScript client du socle | ≤ 180 Ko Brotli | aucune bibliothèque UI pour reproduire du HTML natif |
| CSS initial total | ≤ 30 Ko Brotli | système sur mesure, pas de framework visuel |
| Polices initiales | ≤ 100 Ko | WOFF2 locaux, sous-ensembles, une graisse préchargée |
| Portrait LCP | ≤ 150 Ko | cadrage dédié et dimensions explicites ; qualité revue au viewport |

Le portrait n'est pas sacrifié par une compression aveugle : si 150 Ko ne permet pas une peau et des contours propres au cadrage retenu, on réduit d'abord sa résolution source au besoin réel et on revoit la composition.

## 3. Premier segment immersif

### Mobile

| Ressource | Cible interne |
|---|---:|
| Îlot immersif, JavaScript inclus | ≤ 290 Ko Brotli |
| Premiers actifs 3D, panorama inclus | ≤ 200 Ko |
| Clip main + poster | ≤ 140 Ko |
| Réserve maintenue | ≥ 20 Ko |
| **Total absolu** | **≤ 650 Ko** |

### Desktop

| Ressource | Cible interne |
|---|---:|
| JavaScript immersif | partage la cible d'architecture de 290 Ko |
| Premiers actifs 3D | ≤ 650 Ko |
| Clip main + poster | ≤ 210 Ko |
| Réserve maintenue | ≥ 50 Ko |
| **Total absolu** | **≤ 1,2 Mo** |

Le transfert entre sous-budgets est permis seulement si la réserve et le total restent intacts. La DR ne prescrit donc pas un nombre de polygones arbitraire ; elle prescrit ce qui doit rester visible après optimisation : tranche, joint, rugosité, ombre et incrustation.

## 4. Mémoire et média

- textures actives du premier segment mobile : **≤ 32 Mio**, mipmaps comprises ;
- corps célestes actifs sur mobile : **≤ 4** ;
- vidéos simultanées : **1** ;
- médias hors écran : arrêtés ; poster avant vidéo ;
- premier segment audible : **≤ 450 Ko** ;
- visite audio complète : **≤ 2,5 Mo** pour la langue active ;
- PCM actif : **≤ 28 Mio** pour chapitre courant + suivant ;
- tout média projet se charge à l'approche du chapitre, jamais avec l'accueil par défaut.

## 5. Performance perceptuelle

| Mesure | Veto |
|---|---:|
| LCP labo, médiane de 5 cold loads | ≤ 2,5 s |
| interaction critique scriptée | ≤ 200 ms |
| CLS labo | ≤ 0,1 |
| frame time p95 desktop | ≤ 16,7 ms |
| frame time p95 Android 4 Go | ≤ 33,3 ms |
| frames longues > 50 ms | < 1 % |

Le design aide ces objectifs : aucun texte n'attend l'immersion ; l'ouverture possède un poster ; les panneaux DOM sont opaques et simples ; le DPR baisse avant de retirer une preuve ; les effets non essentiels disparaissent à une frontière de chapitre.

## 6. Réserves SOURCE

| Élément | Maximum |
|---|---:|
| snapshot GitHub + métadonnées | 4 Ko Brotli |
| extraits de code + index | 20 Ko Brotli |
| logique SOURCE + comète | 35 Ko Brotli |
| Console | 15 Ko Brotli |
| réserve cumulée mobile / desktop | 75 / 120 Ko Brotli |

La plaque de code reste lisible même si le nombre de jetons ou la traînée diminue. Aucun allègement ne supprime l'explication humaine, le SHA, la date ou les contrôles DOM.

## 7. Protocole de preuve visuelle

Pour chaque vue obligatoire, la future IR reproduit exactement le viewport de DR-1 et joint :

1. capture PNG ou vidéo courte avec ID de vue ;
2. état de contenu et actifs utilisés ;
3. taille transférée cache froid ;
4. mémoire texture estimée et mesurée lorsque possible ;
5. frame time du passage ;
6. masque de luminance pour les images-clés ;
7. résultat contraste/focus ;
8. diff avec la référence DR ;
9. justification de tout écart ;
10. signature visuelle ou retour précis.

Avant même cette IR, huit moodframes sourcés sont des preuves bloquantes de `DR-1 SIGNED` : accueil desktop/mobile, match-cut 3 s, révélation 10 s desktop/mobile, belvédère réel desktop/mobile et final geste + portrait. Une structure bien documentée sans ces images reste `DR-1 Candidate`.

## 8. Images-clés auditées

Minimum : 0, 3, 6 et 10 secondes ; SOURCE code/germe/allumage ; six poses `reading` ; Compétences ; comète ; Parcours ; Ground Track ; révélation ; final. Chaque image consigne : actif réel présent, surface éclairée, quasi-noir, surface média, taille du portrait ou panneau, zone texte immobile et contrôle de parité.

## 9. Appareils et conditions

- mobile physique : Samsung Galaxy A14 4 Go ou appareil documenté au plus équivalent ;
- desktop : i5-8250U / Intel UHD 620 / 8 Go ou moins puissant ;
- réseau mobile simulé : 9 Mbit/s descendant, 1,5 Mbit/s montant, RTT 150 ms ;
- cinq cold loads et trois visites ;
- température, batterie, OS, navigateur et GPU consignés ;
- Playwright peut piloter Android mais ne prouve pas la performance GPU ; les traces viennent de l'appareil réel.

## 10. Arbitrage en cas de dépassement

Ordre de réduction : DPR → nombre d'effets secondaires → densité de jetons SOURCE → longueur de traînée → parallaxe → résolution de texture hors sujet → nombre de stems. Ne jamais réduire d'abord : portrait utile, vraie interface, preuve, contraste, focus, texte, sous-titres, transcript, mode léger ou temps de lecture immobile.

