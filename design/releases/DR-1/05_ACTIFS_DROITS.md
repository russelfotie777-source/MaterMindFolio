# 05 — Actifs, prises de vue, provenance et droits

## 1. Règle de vérité

Un actif ne passe dans une maquette signable que si son auteur ou sa source, son droit d'usage, son état public/privé et ses transformations sont connus. `Reçu` ne signifie ni `autorisé`, ni `retenu`. Une source absente n'est jamais remplacée par un visuel ou une voix générative.

## 2. États du registre

| État | Signification |
|---|---|
| `EXPECTED` | demandé, non reçu |
| `RECEIVED_PRIVATE` | master reçu, interdit de publication |
| `RIGHTS_PENDING` | contenu reçu, droit ou accord incomplet |
| `REJECTED_DESIGN` | authentique mais impropre à l'usage prévu |
| `APPROVED_SOURCE` | source et droit validés, transformation permise |
| `APPROVED_DERIVATIVE` | dérivé optimisé contrôlé et publiable |

Chaque ligne finale possède : identifiant opaque, type, auteur/source, date, droit, statut, SHA-256 d'intégrité, transformations, dérivés, date de contrôle et visas Russel/ChatGPT/Claude selon leur domaine. Aucun chemin de master privé, GPS, EXIF sensible, personne tierce non autorisée ou nom de sauvegarde ne figure dans le registre public.

## 3. Audit de l'actif déjà présent

### `H237-POR-REF-001`

- type : photographie verticale, 1923 × 2560 ;
- usage autorisé dans DR-1 : **référence documentaire interne seulement** ;
- statut : `RIGHTS_PENDING` + `REJECTED_DESIGN` comme portrait final ;
- raisons de rejet pour le hero : angle grand-angle et bas, visage partiellement masqué par la main, dominante rose/rouge, arrière-plan domestique chargé et éléments potentiellement identifiants ;
- action : ne pas publier, ne pas détourer, ne pas utiliser pour extraire la palette, ne pas « réparer » avec une IA ; refaire le portrait selon le brief ci-dessous ;
- droit : Russel doit confirmer auteur, consentement et possibilité de conservation ou suppression.

**Risque dépôt :** ce fichier est déjà suivi par Git et apparaît dans l'historique au commit `5b4c08f`. Un remote GitHub est configuré, mais sa visibilité et l'exposition effective du blob n'ont pas été confirmées ici. Avant toute publication, Russel doit choisir entre : (a) approuver explicitement cet original dans le dépôt, ce que la politique des masters déconseille ; ou (b) autoriser son retrait du suivi puis, si le blob a déjà été poussé publiquement, une procédure séparée et prudente de purge d'historique. Aucune suppression ni réécriture n'est exécutée dans G1 sans cette autorisation explicite.

Ce rejet ne juge pas la personne ni la photographie privée ; il protège la qualité éditoriale et la vie privée demandées par le plan.

## 4. Inventaire bloquant DR-1

| ID logique | Actif | Minimum attendu | État |
|---|---|---|---|
| `H237-POR-MASTER` | portrait principal | vertical 4:5 + horizontal avec espace négatif | `EXPECTED` |
| `H237-GESTURE-SHEETS` | dix essais du monogramme | feutre noir, papier blanc, aucun document réel | `EXPECTED` |
| `H237-GESTURE-VIDEO` | main traçant le geste | master 4K/60, vue du dessus, plan fixe | `EXPECTED` |
| `H237-SKY-PANO` | firmament cobalt | panorama natif ou série chevauchée à l'aube | `EXPECTED` |
| `H237-MAT-PAPER` | papier/encre | macro et plan neutre avec référence blanche | `EXPECTED` |
| `H237-MAT-STONE` | pierre claire | face, tranche, joint et ombre | `EXPECTED` |
| `H237-MAT-LATERITE` | latérite | sol/agrégat sec, couleur naturelle | `EXPECTED` |
| `H237-PLACE-*` | lieux choisis | route, mur/roche, bureau, lieu aimé | `EXPECTED` |
| `H237-PROJ-01..06` | médias projet | au moins un média + une preuve par projet | `EXPECTED` |
| `H237-BRAND-01..06` | logos/couleurs | source et droit pour chaque projet | `EXPECTED` |
| `H237-CV-PUBLIC` | CV public | PDF nettoyé, accessible, approuvé | `EXPECTED` |
| `H237-SOURCE-CODE` | extrait code | dépôt, chemin, lignes, SHA, licence, visa secret | `EXPECTED` |
| `H237-GITHUB-SNAPSHOT` | trace publique | dépôt/compte, allowlist, date, accord Q24 | `EXPECTED` |
| `H237-AUD-VOICE` | narration | choix oui/non puis prise propre | `EXPECTED` |
| `H237-AUD-MORNING` | ambiance du matin | 1–2 min, aucune conversation/notification | `EXPECTED` |
| `H237-AUD-MARKER` | feutre | prises isolées propres | `EXPECTED` |
| `H237-AUD-KEYS` | clavier | frappe créée pour la prise, aucune saisie réelle | `EXPECTED` |
| `H237-AUD-MUSIC` | musique | auteur, licence/autorisation, crédit, master | `EXPECTED` |

## 5. Brief portrait

- appareil à hauteur des yeux ; focale équivalente 50–85 mm ; distance 1,5–2 m ;
- fenêtre latérale ou extérieur tôt le matin ; pas d'éclairage rouge/rose ;
- fond réel clair, minéral ou neutre, sans affiche, écran, document ou personne tierce ;
- t-shirt noir uni ou vêtement sobre choisi par Russel ;
- visage entièrement dégagé, regard caméra, expression directe, sourire discret ;
- aucun filtre beauté, LUT, détourage, fond synthétique ou remplacement génératif ;
- cadrages : vertical 4:5 et horizontal avec espace négatif ;
- cinq variantes minimum : face, trois-quarts, assis, debout, détail main sans signature ;
- inclure une carte blanche/grise au début de la série, hors image finale.

Critère : le portrait doit supporter un cadrage de 35–45 % de la composition sans cacher yeux, bouche, mains utiles ou contexte choisi.

## 6. Brief geste et clip

- inventer un monogramme uniquement pour le portfolio, distinct de toute signature officielle ;
- produire dix essais au feutre noir sur papier blanc non ligné ;
- sélectionner avec Russel la trace la plus naturelle, pas la plus « logo » ;
- filmer vertical et horizontal, appareil rigoureusement au-dessus, lumière du jour diffuse ;
- master 4K/60 i/s, plan fixe, papier occupant tout le champ utile ;
- main propre, sans bijou ; aucun écran, courrier, visage, marque ou élément identifiant ;
- geste utile de 2,0 s maximum ; dérivé public de 2,5 s avec 250 ms de poignée avant et après, dont la timeline affiche 1–3 s ;
- enregistrer séparément le son du feutre ;
- conserver l'original hors dépôt ; publier seulement le dérivé vidéo et une simplification graphique validée.

Le poids du clip publié et de son poster appartient au premier segment immersif : ils partagent le sous-budget de 140 Ko mobile et 210 Ko desktop avec les ressources prévues par le contrat.

## 7. Brief ciel et matières

### Ciel

- aube, exposition et balance des blancs verrouillées ;
- mode panorama natif ou série de vues se chevauchant de 30 à 40 % ;
- horizon présent dans quelques prises de référence, mais dérivé final sans raccord visible ;
- aucune interpolation générative, nébuleuse, étoile artificielle ou gradient recréé ;
- conserver variations de luminance et grain après réduction du bruit raisonnable.

### Pierre, latérite, papier

- lumière rasante puis diffuse, même référence blanche ;
- plans orthogonaux + macro ;
- inclure tranche, joint, fissure légère et ombre de contact ;
- ne pas mouiller ou saturer la latérite pour la rendre plus spectaculaire ;
- aucune texture de stock ajoutée pour « compléter » une zone.

## 8. Médias des six projets

Pour chacun :

- capture ou vidéo au ratio natif, sans mockup de téléphone obligatoire ;
- écran ne montrant aucune donnée personnelle, commande, email, adresse, token ou environnement interne ;
- logo et couleurs seulement avec droit explicite ;
- au moins une preuve : URL, store, document autorisé, capture datée ou résultat sourcé ;
- rôle et périmètre exacts de Russel ;
- texte alternatif décrivant ce que le média prouve ;
- accord écrit avec nom et fonction de la personne qui autorise ;
- date de dernière vérification du lien.

Un média absent ne reçoit pas de faux screenshot. Le projet ne peut cependant pas obtenir sa `CR-0` sans au moins une preuve et le statut de ses droits.

## 9. Audio

- mode avion, notifications désactivées, pièce ou extérieur contrôlé ;
- aucune conversation tierce, nom de client, mot de passe, notification ou travail réel ;
- voix en prises courtes par chapitre, jamais un fichier continu de deux minutes imposant un redécodage massif ;
- ambiance : 60–120 s de matière, puis sélection et boucle propres ;
- clavier : texte factice préparé pour l'enregistrement ;
- musique : aucun thème d'anime repris ou imité ; référence émotionnelle seulement ;
- avant publication : auteur, interprète, type de licence/autorisation, territoires/durée si pertinents, crédit exact et preuve conservée.

Sans musique autorisée, le design sonore utilise voix, matin, feutre, clavier et impulsion. Sans voix, le texte et le transcript portent le récit ; aucune voix IA ne remplace Russel.

## 10. Transformations autorisées

| Actif | Transformations permises | Interdit |
|---|---|---|
| Portrait | recadrage, exposition, balance, contraste doux, réduction de bruit | modification du visage, détourage IA, faux décor |
| Geste | nettoyage poussières, niveau, vectorisation manuelle simplifiée | lisser jusqu'à perdre la main, utiliser une signature réelle |
| Ciel | assemblage, raccord manuel/procédural, étalonnage, compression | remplissage génératif, fausses étoiles/nébuleuses |
| Matières | correction colorimétrique, tuile manuelle documentée | texture synthétique non déclarée |
| Produit | recadrage non trompeur, floutage de données, compression | inventer un écran, modifier un résultat |
| Son | coupe, nettoyage, égalisation, compression, normalisation | clonage de voix et toute musique générative pour la DA/V1, déclarée ou non |

## 11. Masters et sauvegarde

Avant toute suppression de carte ou de téléphone :

1. copie principale sur le stockage de travail de Russel ;
2. copie indépendante chiffrée hors de l'appareil principal ;
3. test de restauration d'au moins un fichier image, un fichier vidéo et un fichier audio ;
4. propriétaire de la sauvegarde et date consignés dans la collecte, sans mot de passe ni chemin sensible.

Tant que Q25 n'est pas répondue et la restauration testée, aucun master n'est considéré sécurisé.

## 12. Sources déjà validables séparément

- Literata : SIL Open Font License 1.1 ; source officielle archivée, version exacte et checksum à figer avant intégration ;
- Hanken Grotesk : SIL Open Font License 1.1 ; version exacte et checksum à figer ;
- DTCG 2025.10 : format de tokens stable retenu ;
- Natural Earth et tout actif NASA/ESA : vérification et attribution **actif par actif**, sous responsabilité d'intégration de Claude ; aucune réputation institutionnelle ne vaut licence automatique.

