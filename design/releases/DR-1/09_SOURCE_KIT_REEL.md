# 09 — Source Kit C3 : Japon vivant, preuves honnêtes

## 1. Décision

Candidate 3 remplace le monde visuel C2. Le Japon devient l'horizon artistique de TRACE SOLAIRE ; il n'est jamais présenté comme l'origine ni le lieu de vie de Russel, qui reste camerounais et basé à Douala.

Le décor associe deux familles clairement distinguées au colophon :

- six images de paysage ou de matière générées avec Magnific, validées par Russel le 20 octobre 2026 et toujours créditées comme **images générées** ;
- une présélection complémentaire de photographies réelles japonaises sous CC BY-SA 4.0, utilisable avec attribution et partage dans les mêmes conditions.

Les interfaces produit et les preuves ne sont jamais générées. Le Soleil, les planètes, la comète et les pierres suspendues sont de vrais objets 3D ; les images ne les simulent pas.

## 2. Masters de décor C3

Les six sources vivent dans `decor-candidats/`. Les fichiers 4× de revue, produits mécaniquement le 20 octobre 2026, vivent dans `assets/c3-upscaled/`. Ils ne sont pas encore les dérivés web de production.

| ID de design | Rôle | Source Magnific | Source → master 4× | SHA-256 du master 4× | Règle d'usage |
|---|---|---|---:|---|---|
| `C3-DECOR-DAWN-001` | ouverture et lumière de l'aube | `magnific__equirectangular-360-panorama-21-japanese-dawn-seen__82050.png` | 1440 × 720 → 5760 × 2880 | `be11540eb0206c1b8cca3d5394dedea39ee9bdbe67f17fc73ef45a7d38a29b4e` | décor cylindrique, horizon recalé à hauteur d'yeux ; jamais qualifié de panorama photographique réel |
| `C3-DECOR-WISTERIA-001` | chapitre nocturne et profondeur violette | `magnific__night-photograph-of-ancient-japanese-wisteria-trel__82051.png` | 1440 × 720 → 5760 × 2880 | `3ef2658644a0ac60f4aa01bb9b807f9d367dec6f4625f191433225c0cb74b2c6` | zone gauche calme ; grappes contrôlées à 100 % avant publication |
| `C3-DECOR-BAMBOO-001` | transition végétale et chemin | `magnific__arashiyama-bamboo-forest-at-deep-blueviolet-dusk-s__8238.png` | 1440 × 720 → 5760 × 2880 | `4e01535a334f7dcbfd99a0895a77a8cdd78c5dece56c53c6ce474d12d37d6878` | texte seulement sur panneau opaque ; aucun panneau ou lieu précis revendiqué |
| `C3-DECOR-LAKE-001` | révélation solaire | `magnific__mirrorcalm-japanese-mountain-lake-one-minute-after__8239.png` | 1440 × 720 → 5760 × 2880 | `0b009e33b92055c5f6c5ba1f91be53f990b5de3119344af8d6248f5d49f9db3b` | le reflet reste une ambiance ; la trace et le Soleil fonctionnels sont rendus en 3D |
| `C3-DECOR-STARS-001` | final et fond du portrait | `magnific__astrophotography-of-a-clear-night-above-mount-fuji__71838.png` | 1280 × 720 → 5120 × 2880 | `e4e62fd2193c6867fe94774fab316470341be040b6429659548d39d2d51118c7` | paysage imaginaire déclaré ; aucun astre dessiné n'est transformé en navigation |
| `C3-MAT-BASALT-001` | couleur et détail du basalte | `magnific__one-single-continuous-photograph-of-a-natural-dark__71840.png` | 1280 × 720 → 5120 × 2880 | `fa180e4c0db47861b2919e2b51747b62394d3cb52da05849321d75e03606c5c0` | référence de couleur seulement ; relief et rugosité viennent d'un jeu PBR CC0 ou du matériau procédural validé par Claude |

### Transformation 4×

L'agrandissement retenu est déterministe : filtre Lanczos, léger renforcement de netteté, suppression des métadonnées et export PNG sRGB. Aucun objet, pixel narratif ou détail de composition n'a été généré. Un essai d'agrandissement génératif a été rejeté parce qu'il réinterprétait la scène ; il n'est ni intégré ni enregistré comme actif du projet.

Les fichiers 4× pèsent environ 10 à 14 Mo chacun. Ils servent aux moodframes et à la préparation. Claude produira plus tard les AVIF/WebP responsifs, mesurera le coût GPU et consignera les dérivés dans le registre.

## 3. Provenance et licence des images générées

L'autorisation de Russel ne remplace pas un droit d'exploitation. Avant `APPROVED_DERIVATIVE`, chaque image doit posséder :

1. l'outil et le modèle exacts, le compte détenteur et la date de génération ;
2. le prompt correspondant dans `docs/collecte/DIRECTION_IMAGES_DECOR.md` et l'identifiant de variante du nom de fichier ;
3. une copie ou un lien daté des conditions Magnific applicables au compte utilisé, confirmant l'usage public et commercial ;
4. les empreintes de la source et du dérivé ;
5. la mention publique **« Image générée avec Magnific, direction et sélection : Russel / équipe HORIZON 237 »**, adaptée aux informations réellement disponibles ;
6. la liste des transformations mécaniques.

Jusqu'à réunion de ces éléments, les décors sont visuellement retenus mais restent `RIGHTS_PENDING`. Ils ne doivent jamais être décrits comme des photographies prises au Japon.

## 4. Portrait retenu

| ID | Fichier | Propriétés | Usage |
|---|---|---|---|
| `H237-POR-CUTOUT-001` | `design/magnific__background__71841.png` | 1923 × 2560, PNG transparent, SHA-256 `a0345f9bfc43bf3eba2efc360da1cb23926faa2b91b5908cf58753973a9a92d4` | portrait final détouré, éclairé par la scène étoilée ; visage, expression, main, montre et morphologie inchangés |
| `H237-POR-LIGHTREF-001` | `design/magnific__keep-the-person-exactly-as-in-the-original-photo-s__71842.png` | 960 × 1280, SHA-256 `1de3a9a183b737aaf2fb144c3fd71269be8bfb02e50a784026f623de94e3a4b7` | référence d'éclairage uniquement ; non publiée comme portrait principal |

Le détourage est une composition artistique évidente et déclarée. La scène peut corriger la dominante colorée et poser un liseré violet ou une lumière d'aube, sans lisser la peau, remodeler le visage, modifier la main ou inventer une partie du corps.

## 5. Photographies japonaises complémentaires

Les six sources réelles validées dans `docs/collecte/SOURCES_JAPON_CANDIDATS.md` restent disponibles en complément : aube depuis le mont Hijiri, Fuji et brume, glycines d'Ashikaga, bambous d'Arashiyama, lever sur le lac Motosu et allée de torii de Fushimi Inari.

Elles ne sont intégrées qu'après récupération de l'original, contrôle du fichier, retrait EXIF/GPS sur le dérivé, attribution de l'auteur, lien source, lien CC BY-SA 4.0, mention des modifications et licence compatible du dérivé. Aucun auteur n'est présenté comme soutenant le portfolio.

## 6. Interfaces et preuves réelles

- ZIRIS utilise les captures publiques réelles déjà préparées dans `assets/source-derivatives/` ; elles dominent le belvédère et ne sont ni reconstruites ni embellies.
- Les cinq autres projets suivent le même contrat : média autorisé, rôle exact, preuve sourcée, données personnelles masquées et aucun faux écran.
- L'image de décor s'efface derrière une preuve produit. Elle ne remplit jamais un espace parce qu'un contenu manque.
- Les statistiques déclaratives, notamment les ventes générées par les agents IA, restent identifiées comme non auditées ; aucune visualisation ne fabrique une preuve.

## 7. Contrat de vraie 3D

| Élément | Représentation requise | Interdit |
|---|---|---|
| pierres suspendues | géométrie 3D, éclairage et ombres cohérents, matériau basaltique PBR/procédural | photo détourée simulant un volume |
| Soleil | corps 3D simple et lumière liée à la scène | disque peint dans un décor interactif |
| planètes | géométries 3D en profondeur, secondaires aux preuves | boutons-images ou planètes plastiques dominantes |
| comète | objet/trajectoire 3D piloté par le snapshot autorisé | vidéo, GIF ou activité GitHub live |

Les moodframes sont des vues fixes de direction : leurs formes vectorielles annoncent le volume futur sans prétendre être le rendu Three.js final.

## 8. Règle chromatique C3

Le Source Kit se lit avec `design/contracts/tokens.json` : sombre violet vivant majoritaire, blanc franc minoritaire, violet profond structurant, vert organique local et trace solaire pêche. Aucune surcouche ne doit griser les décors, noyer les noirs ou produire une brillance d'IA.

Une composition C3 vise :

- 52–72 % de sombre vivant ;
- 12–28 % de clair ;
- 12–30 % de violet structurant ;
- au plus 14 % de vert et 8 % d'accent vif ;
- au plus 12 % d'aplat quasi noir sans texture.

Ces intervalles orientent la composition ; leur somme n'est pas un quota automatique. Le contraste utile, la peau et l'interface produit restent prioritaires.

## 9. Typographie de référence

La famille visible de la Candidate 3 est **DM Sans**, conformément à la vitrine publique ZIRIS Entreprises. Le fichier variable officiel et sa licence SIL Open Font License sont archivés dans `assets/type-previews/` :

| Élément | Fichier | SHA-256 |
|---|---|---|
| fonte variable officielle | `DM-Sans-opsz-wght.ttf` | `8cd08d97e89c24d0aa92edd2f0f4c8ee6195eee9b7c9f154865a58b02f0c1c0d` |
| licence | `OFL-DM-Sans.txt` | `9af36190332437f5ecd09974de43c1f7c77a310a996cdd8ceb25628b458840e1` |

La fonte n'est ni dessinée, ni renommée, ni modifiée. DM Sans sert aux titres, textes et commandes ; la pile monospace du système est réservée aux fragments de code. La personnalité de TRACE SOLAIRE vient de la composition, des contrastes, du rythme et du monogramme, jamais d'une pseudo-police créée pour le projet.

Sources : [vitrine ZIRIS Entreprises](https://ziris-app.alwaysdata.net/vitrine/index) ; [dépôt officiel DM Sans dans Google Fonts](https://github.com/google/fonts/tree/main/ofl/dmsans).

## 10. Exclusions C3

- panorama de Douala, Bwiteva, latérite et ancienne pierre claire dans le monde visuel ; ils restent seulement dans l'historique C2 ;
- décor généré présenté comme photographie réelle ;
- interface, terminal, capture produit ou preuve générés ;
- faux monogramme manuscrit, main inventée, retouche d'identité ou embellissement du visage ;
- ciel noir plat, bleu artificiel dominant, glow, bloom, verre généralisé, néon, texture plastique ou accumulation de particules ;
- Japon folklorique décoratif : kanji gratuits, temple ou torii utilisés sans fonction narrative.

## 11. État de la Candidate 3

La direction visuelle C3 et sa typographie DM Sans ont reçu le visa esthétique de Russel le 20 octobre 2026. Le Source Kit n'est pas encore prêt pour la publication : restent la preuve des conditions Magnific applicables, le visa de droits de Russel, la dérivation web par Claude et les mesures de poids, mémoire, contraste et appareils prévues par le contrat.
