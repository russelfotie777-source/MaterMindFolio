# 05 — Actifs, provenance et droits

## 1. Règle de vérité C3

Un actif ne passe dans une maquette signable que si sa source, son droit d'usage, son état public ou privé et ses transformations sont connus. `Reçu` ne signifie ni `autorisé`, ni `retenu`.

Russel autorise les images générées uniquement pour le **décor**. Elles restent identifiées comme telles dans le registre et le colophon. Cette autorisation ne couvre jamais une interface, une preuve, un résultat, un extrait de code, une personne ou une voix. Aucun manque de contenu ne reçoit un faux screenshot, un faux document ou une statistique inventée.

## 2. États du registre

| État | Signification |
|---|---|
| `EXPECTED` | demandé, non reçu |
| `RECEIVED_PRIVATE` | master reçu, interdit de publication |
| `RIGHTS_PENDING` | contenu reçu, droit ou accord incomplet |
| `REJECTED_DESIGN` | authentique mais impropre à l'usage prévu |
| `APPROVED_SOURCE` | source et droit validés, transformation permise |
| `APPROVED_DERIVATIVE` | dérivé optimisé contrôlé et publiable |
| `OWNER_APPROVED_EXCEPTION` | publication imposée et assumée par Russel malgré une provenance ou une qualité incomplètement documentée |

Chaque ligne finale possède : identifiant opaque, type, outil/auteur/source, date, droit, statut, SHA-256 d'intégrité, transformations, dérivés, date de contrôle et visas Russel/ChatGPT/Claude selon leur domaine. Aucun chemin de master privé, GPS, EXIF sensible, personne tierce non autorisée ou secret ne figure dans le registre public.

Les mentions `C3_VISUAL_SELECTED`, `C3_REVIEW_MASTER_READY`, `CANDIDATE`, `EXPECTED — CODEX` et `PENDING ADR` sont des qualificatifs de préparation, pas des statuts de droit supplémentaires.

## 3. Portrait final

### `H237-POR-CUTOUT-001`

- fichier retenu : `design/magnific__background__71841.png` ;
- dimensions : 1923 × 2560, fond transparent ;
- SHA-256 : `a0345f9bfc43bf3eba2efc360da1cb23926faa2b91b5908cf58753973a9a92d4` ;
- usage : portrait final intégré dans l'univers étoilé, sur décision de Russel du 20 octobre 2026 ;
- statut de droit hérité du portrait fourni par Russel : `OWNER_APPROVED_EXCEPTION` ; auteur et date de prise de vue restent non documentés ;
- transformation déclarée : retrait du décor par Magnific ; aucune reconstruction du visage, de l'expression, de la main, de la montre ou du corps ;
- contrôles visuels consignés : contours propres, absence de halo et identité conservée.

Le fichier composé `design/magnific__keep-the-person-exactly-as-in-the-original-photo-s__71842.png` sert seulement de référence d'éclairage. Il ne remplace pas le portrait final.

### Transformations permises

- recadrage non trompeur ;
- correction de dominante, exposition, balance des blancs, contraste doux et réduction de bruit ;
- éclairage de scène violet et solaire cohérent, appliqué sans remodelage ;
- compression et dérivés AVIF/WebP/JPEG contrôlés à 390 px et 1440 px.

Sont interdits : lissage de peau, beautification, changement d'âge, visage ou main générés, déformation des traits, ajout ou retrait de doigts, faux halo de détourage et composition présentée comme une photographie prise dans l'espace.

## 4. Inventaire bloquant DR-1 C3

| ID logique | Actif | Minimum attendu | État G1 : droit puis préparation |
|---|---|---|---|
| `H237-POR-CUTOUT-001` | portrait final | source, exception Russel, contrôle d'identité et dérivés web | `OWNER_APPROVED_EXCEPTION` · `C3_VISUAL_SELECTED` |
| `H237-MONOGRAM-001` | monogramme TRACE 237 | master SVG monochrome + note de construction | `APPROVED_SOURCE` |
| `C3-DECOR-DAWN-001` | aube / ouverture | conditions Magnific, prompt, source et dérivés | `RIGHTS_PENDING` · `C3_REVIEW_MASTER_READY` |
| `C3-DECOR-WISTERIA-001` | glycines de nuit | mêmes preuves | `RIGHTS_PENDING` · `C3_REVIEW_MASTER_READY` |
| `C3-DECOR-BAMBOO-001` | forêt de bambous | mêmes preuves | `RIGHTS_PENDING` · `C3_REVIEW_MASTER_READY` |
| `C3-DECOR-LAKE-001` | lac / révélation | mêmes preuves | `RIGHTS_PENDING` · `C3_REVIEW_MASTER_READY` |
| `C3-DECOR-STARS-001` | univers étoilé | mêmes preuves | `RIGHTS_PENDING` · `C3_REVIEW_MASTER_READY` |
| `C3-MAT-BASALT-001` | couleur basaltique | mêmes preuves ; PBR CC0/procédural distinct | `RIGHTS_PENDING` · `C3_REVIEW_MASTER_READY` |
| `H237-JP-PHOTO-01..06` | photos japonaises complémentaires | originaux Commons, crédits et dérivés BY-SA | `APPROVED_SOURCE` après récupération/contrôle |
| `H237-PROJ-ZIRIS-VITRINE-001` | vitrine produit ZIRIS | capture publique réelle, droit déclaré, co-développement attribué | dérivés de revue C2 réutilisables en C3 |
| `H237-PROJ-01..06` | médias projet | au moins un média autorisé + une preuve par projet | selon chaque `CR-0` |
| `H237-BRAND-01..06` | logos et couleurs | source et forme de l'accord pour chaque projet | selon chaque `CR-0` |
| `H237-CV-PUBLIC` | CV public | Markdown validé puis PDF nettoyé et accessible | `CANDIDATE` |
| `H237-SOURCE-CODE` | extrait de code | dépôt, chemin, lignes, SHA, licence et visa secret | `EXPECTED` |
| `H237-GITHUB-SNAPSHOT` | trace publique | compte/dépôt, allowlist, date et accord Q24 | `EXPECTED` |
| `H237-AUD-MORNING` | ambiance du matin | licence libre ou synthèse originale documentée | `EXPECTED — CODEX` |
| `H237-AUD-TRACE` | ponctuation du tracé | son original bref et non figuratif | `EXPECTED — CODEX` |
| `H237-AUD-KEYS` | clavier | source libre ou création sans travail réel enregistré | `EXPECTED — CODEX` |
| `H237-AUD-MUSIC` | mélodie de visite | composition originale, auteur, master, droit et crédit | `EXPECTED — CODEX` |
| `H237-AUD-REFERENCES` | trois morceaux de référence | lecteurs officiels visibles, chargés au clic uniquement | `PENDING ADR` |

Les anciens actifs Bwiteva, panorama de Douala, latérite, Qwantani, pierre claire et papier restent documentés dans l'historique Candidate 2. Ils sont **retirés du monde visuel C3** et ne doivent pas revenir silencieusement dans les moodframes ou l'intégration.

## 5. Décors générés

Chaque décor Magnific doit consigner :

- outil et modèle exacts, détenteur du compte et date ;
- prompt exact et identifiant de variante ;
- preuve datée des conditions permettant l'usage public et commercial ;
- SHA-256 de la source, du master 4× et des dérivés web ;
- recadrage, étalonnage, agrandissement et compression ;
- crédit public explicite « image générée ».

Les fichiers 4× de `assets/c3-upscaled/` sont des masters de revue, produits sans réinterprétation générative. Ils restent `RIGHTS_PENDING` tant que les conditions applicables au compte Magnific ne sont pas attachées. Une belle image sans droit prouvé ne devient pas publiable par décision esthétique.

## 6. Vraie 3D et matières

Le Soleil, les planètes, la comète et les pierres sont des objets Three.js/R3F réels. Les paysages servent au ciel, à la lumière et à la profondeur, jamais à peindre ces objets.

La texture basaltique générée fournit uniquement une référence de couleur. La topologie visuelle du matériau final repose sur des paramètres procéduraux ou un jeu PBR CC0 enregistré séparément. Il est interdit de présenter la simple image couleur comme un matériau physique complet.

## 7. Monogramme vectoriel

Le master `H237-MONOGRAM-001` remplace les feuilles, la main et le clip :

- dessin géométrique original, monochrome, sans police ni actif tiers ;
- aucune ressemblance recherchée avec la signature administrative de Russel ;
- révélation future par longueur de trait, sans morphing ni déformation ;
- forme finale immédiate en mouvement réduit et fallback statique ;
- contrôle de disponibilité à mener avant tout dépôt comme marque, non bloquant pour l'usage éditorial du portfolio.

## 8. Médias des six projets

Pour chacun :

- capture ou vidéo au ratio natif, sans mockup obligatoire ;
- aucune donnée personnelle, commande, email, adresse, token ou interface interne ;
- logo et couleurs seulement avec droit explicite ;
- au moins une preuve : URL, store, document autorisé, capture datée ou résultat sourcé ;
- rôle et périmètre exacts de Russel ;
- texte alternatif décrivant ce que le média prouve ;
- forme de l'accord, personne et fonction documentées ; un accord verbal ou vague reste un risque explicite dans la `CR-0` ;
- date de dernière vérification du lien.

Un lien public prouve l'existence d'un produit, pas à lui seul la contribution exacte de Russel. Une donnée déclarative n'est jamais maquillée en mesure auditée.

Les cinq paires C3 manquantes, leurs sources, empreintes, recadrages, textes alternatifs et limites de droits sont consignés dans `12_MEDIAS_PROJETS_C3.md`. Russel les valide visuellement le 20 octobre 2026. Leur statut est `APPROVED BY RUSSEL — DESIGN` ; le passage en média public d'intégration attend encore l'enregistrement et les dérivés de production de Claude. Les limites d'accord consignées dans les `CR-0` restent applicables.

## 9. Audio

- aucune narration, aucun clone et aucune voix de remplacement ;
- ambiance, clavier et ponctuations : sons libres à provenance vérifiée ou synthèses originales documentées ;
- mélodie : composition originale douce et émotionnelle, sans reprendre mélodie, harmonie distinctive, arrangement ou enregistrement des références protégées ;
- Joe Hisaishi, Evan Call et RADWIMPS restent des références d'écoute accessibles seulement par un lecteur officiel visible et déclenché au clic ; aucun fichier n'est téléchargé ou hébergé ;
- avant G2, un ADR choisit un fournisseur et documente façade sans requête avant clic, consentement, confidentialité, `frame-src` et fallback lien simple ;
- avant publication : auteur, source, licence, crédit, SHA et transformations au registre.

## 10. Matrice des transformations

| Actif | Transformations permises | Interdit |
|---|---|---|
| portrait détouré | recadrage, étalonnage, éclairage de scène, compression | modifier visage/main/corps, embellir, reconstruire |
| monogramme | optimisation SVG, recoloration sémantique, petit format testé | déformer, simuler une signature, ajouter un actif tiers |
| décor généré | recadrage, agrandissement déterministe, étalonnage mesuré, compression | cacher son origine, ajouter un objet narratif, nouvelle génération non consignée |
| photo japonaise réelle | recadrage, étalonnage, compression avec crédit des modifications | retirer attribution/ShareAlike, prétendre à une prise de vue de Russel |
| matière | correction colorimétrique, tuile documentée, génération de cartes procédurales séparées | qualifier une carte couleur de matériau PBR complet |
| produit | recadrage non trompeur, masquage de données, compression | inventer un écran, modifier un résultat, générer une interface |
| son | coupe, nettoyage, égalisation, compression, normalisation, synthèse originale documentée | voix générée/clonée, imitation reconnaissable, source sans droit |

## 11. Dérogation de sauvegarde

Russel a explicitement levé le 19 octobre 2026 l'exigence de deux copies et de test de restauration et assume le risque de perte des originaux. Cette décision ferme la réserve `DR1-R10` sans prétendre que les fichiers sont sauvegardés. Une copie indépendante chiffrée reste recommandée.

## 12. Sources techniques validables séparément

- Source Kit C3 : `09_SOURCE_KIT_REEL.md` ;
- prompts, sélection et contrôle : `docs/collecte/DIRECTION_IMAGES_DECOR.md` et `docs/collecte/REVUE_DECOR_CANDIDATS.md` ;
- DM Sans : famille officielle utilisée par ZIRIS Entreprises, source Google Fonts, SIL Open Font License 1.1 ; master de revue `DM-Sans-opsz-wght.ttf`, SHA-256 `8cd08d97e89c24d0aa92edd2f0f4c8ee6195eee9b7c9f154865a58b02f0c1c0d` ; aucune modification ni création de glyphes ;
- DTCG 2025.10 : format de tokens retenu ;
- Natural Earth et tout actif NASA/ESA : vérification et attribution actif par actif, sous responsabilité d'intégration de Claude ; aucune réputation institutionnelle ne vaut licence automatique.
