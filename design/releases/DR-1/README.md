# DR-1 — HORIZON 237 / TRACE SOLAIRE

- **Release :** `DR-1 Candidate 3.2`
- **Date :** 20 octobre 2026
- **DRI :** ChatGPT / Codex
- **Statut :** **CANDIDATE C3.2 — VALIDÉE VISUELLEMENT PAR RUSSEL LE 21 OCTOBRE 2026**
- **Portée autorisée :** G1 uniquement, sans scaffold, installation ni code applicatif
- **État global :** `G1 PASS = NON` · `READY FOR CODE = NON`

## 1. Objet de Candidate 3

Candidate 3.2 applique les dernières décisions de Russel :

- Japon comme horizon artistique, sans falsifier son origine camerounaise ni sa base à Douala ;
- couleurs vivantes, sombre violet majoritaire et clair minoritaire ;
- six décors Magnific autorisés et explicitement déclarés comme images générées ;
- portrait détouré intégré dans l'univers, visage inchangé ;
- pierres, Soleil, planètes et comète en vraie 3D future ;
- produit et preuve réels, jamais générés ;
- texte court, utile et humain.

Les six décors possèdent désormais des masters de revue 4×. La palette DTCG C3, le Source Kit réécrit, les règles de droits mises à jour et huit nouveaux moodframes desktop/mobile sont livrés. Candidate 2 reste uniquement comme historique rejeté.

## 2. Verdict immédiat

| Domaine | État | Preuve / suite |
|---|---|---|
| Concept, récit et hiérarchie | **LOCKED** | `DISCUSSION.md`, sections 6 et 7 |
| Architecture des quinze familles | **SPECIFIED** | `03_ECRANS_ETATS.md` |
| Storyboard et rythme | **SPECIFIED** | `02_STORYBOARD_VISITE.md` |
| Portrait final | **VISUAL SELECTED** | PNG détouré, exception propriétaire maintenue |
| Monogramme TRACE 237 | **SOURCE APPROVED** | `08_MONOGRAMME_TRACE_237.md` + SVG |
| Décors Japon C3 | **VISUAL SELECTED / OWNER DECLARATION RECORDED** | six masters 4× ; déclaration de droits de Russel consignée dans `DR1-R14` |
| Tokens et palette | **C3.2 CORRECTION APPLIED** | DTCG 2025.10 ; rose sakura vivant, fleurs aux repères, formes organiques et suppression des bornes |
| Typographie | **DM SANS LOCKED** | famille réelle de ZIRIS Entreprises, OFL 1.1, aucune police créée |
| Moodframes | **C3.2 APPROVED BY RUSSEL** | huit SVG + huit PNG + contact sheet réémis en DM Sans et en grammaire organique |
| Schémas et CR-0 | **DELIVERED / VALIDATED** | invariant `approved ⇒ validatedAt` corrigé ; sept instances valides |
| Faits, copy et CV | **CONTENT VISA ACQUIRED / PDF PENDING** | aperçu CR-0 et CV candidat validés ; production du PDF laissée en attente |
| Médias projet et droits | **MEDIA DESIGN APPROVED** | six projets couverts en desktop/mobile et validés par Russel ; limites d'accord conservées |
| Direction sonore | **SPECIFIED / ASSETS PENDING** | aucune narration ; masters, droits et ADR à produire |
| Faisabilité Claude | **ACCEPTED WITH RESERVES** | visa `DR1-R09` daté du 20 octobre 2026 |
| Fidélité visuelle Codex | **C3.2 COVERAGE APPROVED BY RUSSEL** | 65 vues organiques et deux planches de parité validées le 21 octobre 2026 |

## 3. Périmètre de design

| Fichier ou dossier | Rôle |
|---|---|
| `01_DIRECTION_ARTISTIQUE.md` | direction C3, grille, typographie, couleur et matière |
| `02_STORYBOARD_VISITE.md` | découpage, rythme, ordre des projets et fallbacks |
| `03_ECRANS_ETATS.md` | quinze familles, états système et registre des vues |
| `04_MOUVEMENT_SON_ACCESSIBILITE.md` | mouvement, consentement, son et équivalences |
| `05_ACTIFS_DROITS.md` | provenance, transformations et droits C3 |
| `06_HANDOFF_G1.md` | état des gates, réserves et chemin de signature |
| `07_BUDGETS_PREUVES.md` | budgets, appareils et protocole de preuve |
| `08_MONOGRAMME_TRACE_237.md` | construction et règles du signe original |
| `09_SOURCE_KIT_REEL.md` | Source Kit C3, décors générés déclarés et photos complémentaires |
| `10_MOODFRAMES_C2.md` + `moodframes/**` | historique Candidate 2 rejeté, conservé pour traçabilité |
| `11_MOODFRAMES_C3.md` + `moodframes-c3/**` | huit preuves visuelles C3 et contact sheet |
| `12_MEDIAS_PROJETS_C3.md` + `assets/project-media/**` | dix médias réels desktop/mobile des cinq autres projets et planche de visa |
| `13_CONTROLE_65_VUES_C3.md` + `control-views-c3/**` | 65 vues desktop/mobile/reduced/fallback, index et deux planches de parité |
| `assets/c3-upscaled/**` | six masters 4× de revue, non optimisés pour le web |
| `assets/source-derivatives/**` | captures ZIRIS réelles de revue |
| `assets/type-previews/**` | DM Sans officielle + OFL pour les preuves C3 ; anciennes polices conservées seulement avec l'historique C2 |
| `assets/trace-237-monogram.svg` | master vectoriel du monogramme |
| `design/contracts/tokens.json` | tokens DTCG C3 |

`manifest.json` et `assets/registry.json` restent sous la responsabilité de Claude pour la réémission, les empreintes et les statuts techniques. Les schémas, CR-0 et le CV candidat restent des dépendances G1 distinctes.

## 4. Décisions verrouillées

1. **L'humain et le produit avant le décor.** Identité, projets, preuves, CV et contact existent en HTML avant le Canvas.
2. **Japon, horizon choisi.** Le site ne présente jamais Russel comme japonais ni installé au Japon.
3. **Sombre vivant.** Violet, végétation et matière portent la profondeur ; le blanc reste une découpe minoritaire.
4. **Transparence générative.** Chaque décor Magnific est crédité comme image générée ; aucune interface ni preuve ne l'est.
5. **Vraie 3D.** Pierres, Soleil, planètes et comète sont des objets Three.js/R3F, avec fallback utile.
6. **Produit réel au premier plan.** L'interface et la preuve dominent chaque belvédère.
7. **Parité stricte.** Les six projets ont le même contrat, la même aire utile et un temps comparable.
8. **Ordre chronologique.** Fast Shipping → Batobaye Market → MBoa Market → ZIRIS → Shopitech → ArtVibeCamer.
9. **Texte humain, à l'arrêt.** Aucun amas de texte ni prose de remplissage.
10. **Contrôle humain.** Visite, caméra et son commencent après une action ; pause, sortie, navigation libre et silence restent disponibles.
11. **Aucune narration.** La musique de visite reste originale ou licenciée ; les références protégées passent seulement par lecteur officiel au clic.
12. **Aucun faux spectaculaire.** Aucun chiffre, média, rôle, droit, son ou témoignage n'est inventé.
13. **Aucune police inventée.** DM Sans, telle qu'utilisée par ZIRIS Entreprises, est l'unique famille visible ; la monospace système est réservée au code.

## 5. Éléments encore flexibles

- ajustements chromatiques demandés par Russel après revue C3, versionnés dans les tokens ;
- recadrages et dérivés sans changer le sens ni cacher l'origine générée ;
- variation de 7 à 9 secondes par projet si lisibilité et parité restent mesurées ;
- matériau basaltique final, PBR CC0 ou procédural, après visa de Claude ;
- fournisseur du lecteur officiel musical après ADR CSP/vie privée ;
- microcopies finales après visa de Russel.

## 6. Critères de signature

### ChatGPT / Codex

- visa de Russel sur les huit moodframes C3, la palette et DM Sans : **acquis le 20 octobre 2026** ;
- 65 vues de contrôle et deux contact sheets de parité ;
- aucun décor générique, aucune interface synthétique et aucune preuve fictive ;
- corrections visuelles versionnées sans écraser l'historique C2.

### Claude Code

- invariant des schémas `approved ⇒ validatedAt` corrigé ou couvert par un validateur testé ;
- Source Kit, vraie 3D, budgets, fallbacks, CSP et coût des médias C3 acceptés ;
- registre et manifeste C3 réémis avec empreintes exactes ;
- visa formel `DR1-R09` daté.

### Russel

- validation explicite de l'aperçu CR-0 et du CV candidat : **acquise** ; PDF final laissé en attente ;
- validation des moodframes C3, de l'identité et des médias des six projets : **acquise** ; limites d'accord conservées dans les fiches ;
- déclaration d'acceptation des conditions Magnific : **consignée dans `DR1-R14`** ;
- ligne `Russel — G1 PASS` seulement après résolution des réserves bloquantes.

## 7. Règle de passage

Le dossier reste `DR-1 Candidate 3.2` jusqu'à la réémission du manifeste et du registre par Claude et aux visas G1 finaux. Les libellés **`DR-1 SIGNED`**, **`G1 PASS`** et **`READY FOR CODE`** ne peuvent apparaître qu'après les visas et preuves ci-dessus.

Jusque-là : **aucun scaffold, aucune installation, aucun package, aucune route et aucun code applicatif**.

## 8. Références normatives

- `DISCUSSION.md`, sections 6 et 7 ;
- `PRODUCTION_CONTRACT.md`, sections 0, 1, 3.1, 8, 11 et 12 ;
- `docs/collecte/BRIEF_CODEX_C3.md` ;
- `docs/architecture/SCHEMAS_G1.md` ;
- `docs/content-release/CR-0/APERCU.md` ;
- [DTCG Format Module 2025.10](https://www.designtokens.org/TR/2025.10/format/) ;
- [DM Sans](https://github.com/google/fonts/tree/main/ofl/dmsans), famille utilisée par ZIRIS Entreprises, sous SIL Open Font License 1.1.
