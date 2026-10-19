# DR-1 — HORIZON 237 / TRACE SOLAIRE

- **Release :** `DR-1 Candidate 0`
- **Date :** 19 octobre 2026
- **DRI :** ChatGPT / Codex
- **Statut :** **BLOCKED SOURCE — spécification produite, release non signable**
- **Portée autorisée :** G1 uniquement, sans scaffold, installation ni code applicatif
- **État global :** `G1 PASS = NON` · `READY FOR CODE = NON`

## 1. Objet de cette release

Cette release transforme le concept validé **HORIZON 237 — TRACE SOLAIRE** en contrat de design contrôlable : compositions, grille, typographie, storyboard, états, mouvement, son, accessibilité, besoins d'actifs, règles de parité des six projets et conditions de fidélité.

Elle ne prétend pas être une maquette haute fidélité finale. La matière qui rend le portfolio personnel — portrait final, geste, ciel, pierre/latérite, interfaces produit, preuves, voix et sons — n'a pas encore été livrée et validée dans `docs/collecte/G1_COLLECTE.md`. Produire les images finales avant ces sources contredirait les interdictions suivantes : aucun fait inventé, aucun actif sans droit, aucun visuel génératif pour la direction artistique et aucun décor spatial générique.

## 2. Verdict immédiat

| Domaine | État | Preuve / blocage |
|---|---|---|
| Concept, narration et hiérarchie | **LOCKED** | `DISCUSSION.md`, section 7 |
| Architecture des écrans | **SPECIFIED** | `03_ECRANS_ETATS.md` |
| Storyboard et rythme | **SPECIFIED** | `02_STORYBOARD_VISITE.md` |
| Système visuel structurel | **SPECIFIED** | `01_DIRECTION_ARTISTIQUE.md` |
| Tokens structurels | **CANDIDATE** | `design/contracts/tokens.json` ; palette volontairement absente |
| Palette finale | **BLOCKED SOURCE** | ciel, latérite, pierre et référence blanche manquants |
| Portrait et geste | **BLOCKED SOURCE** | prises finales et autorisations manquantes |
| Six médias projet et preuves | **BLOCKED CONTENT/RIGHTS** | six `CR-0` non signées |
| Son, voix et musique | **BLOCKED SOURCE/RIGHTS** | choix voix, références et licence manquants |
| Faisabilité technique | **PENDING VISA CLAUDE** | visa demandé sur ce dossier complet |
| Identité et fidélité | **PENDING VISA RUSSEL** | validation après apport des sources |

## 3. Fichiers de la release

| Fichier | Rôle |
|---|---|
| `manifest.json` | empreintes SHA-256 et périmètre exact de cette candidate |
| `README.md` | manifeste, statut, signataires et conditions de sortie |
| `01_DIRECTION_ARTISTIQUE.md` | thèse visuelle, compositions, grille, type, matière et règles anti-génériques |
| `02_STORYBOARD_VISITE.md` | découpage 0–107 s, cadrages, immobilités, transitions et fallbacks |
| `03_ECRANS_ETATS.md` | couverture des 15 familles, variantes système et registre des vues |
| `04_MOUVEMENT_SON_ACCESSIBILITE.md` | timings, consentement sonore, reduced motion, clavier et lecteurs d'écran |
| `05_ACTIFS_DROITS.md` | briefs de capture, audit des sources, transformations et visas de droits |
| `06_HANDOFF_G1.md` | actions de Russel et de Claude, preuves attendues et procédure de signature |
| `07_BUDGETS_PREUVES.md` | budgets visuels, performance et protocole de preuve de la DR |
| `design/contracts/tokens.json` | tokens DTCG 2025.10 verrouillables sans inventer la palette |
| `assets/registry.json` | registre G1 public-safe des actifs effectivement reçus |

## 4. Décisions non négociables de DR-1

1. **L'humain avant le monde.** MASTERMIND, son portrait réel, son rôle validé, son origine camerounaise, son CV, son contact et les accès aux preuves sont lisibles en HTML dès la première image.
2. **Lumière dominante.** L'ivoire minéral et les surfaces réellement éclairées dominent ; aucun écran n'est dominé par le noir.
3. **Cobalt photographique.** Le firmament vient d'un panorama réel de Russel, jamais d'un gradient bleu-violet, d'une nébuleuse de stock ou d'un remplissage génératif.
4. **Trace matérielle.** La promenade possède largeur, épaisseur, tranche, joints, agrégat, rugosité, ombre et structure crédibles. Elle ne ressemble jamais à une courbe Spline extrudée.
5. **Produits réels au premier plan.** Aux belvédères, l'interface et la preuve dominent ; la planète reste un repère de voyage.
6. **Parité stricte.** Les six projets utilisent le même espace utile, le même temps de base, la même profondeur de contenu et le même CTA. Aucun `featured`.
7. **Texte à l'arrêt.** Une information importante n'apparaît jamais pendant un mouvement de caméra.
8. **Contrôle humain.** La visite ne démarre qu'après action ; le son ne démarre qu'après le choix explicite ; pause, sortie, transcript et résumé restent disponibles.
9. **Équivalence réelle.** Mobile, mouvement réduit et absence de WebGL racontent la même histoire et conservent les mêmes preuves.
10. **Pas de faux spectaculaire.** Aucun fait, chiffre, témoignage, système, rôle, actif, son ou licence n'est simulé pour remplir une maquette.

## 5. Ce qui peut encore évoluer sans rompre la DA

- le mapping des six projets vers les six corps célestes, après connaissance des ratios et médias ;
- les valeurs chromatiques finales, uniquement après étalonnage des sources réelles ;
- le recadrage précis des médias, sans perte de sens ni hiérarchie implicite ;
- une variation de 7 à 9 secondes par projet si elle est justifiée par la lisibilité, avec moyenne et exposition équitables ;
- la présence d'une musique, selon le goût explicite de Russel, la licence et le budget ;
- le français seul ou le bilingue, après réponse à la collecte ;
- la ville de Base 237 et les repères du Ground Track, après validation factuelle.

## 6. Critères de signature

### Visa ChatGPT / Codex — fidélité visuelle

- huit moodframes sourcés prouvent le « wow » avant signature : accueil 0 s desktop/mobile, match-cut 3 s, révélation 10 s desktop/mobile, un belvédère réel desktop/mobile et final geste + portrait ;
- toutes les vues du registre sont produites aux viewports demandés ;
- les tokens chromatiques proviennent des sources étalonnées et passent les contrastes ;
- chaque image-clé contient au moins un artefact réel : visage, geste ou produit ;
- les six projets passent le contact sheet de parité ;
- aucune esthétique interdite de `DISCUSSION.md` 7.9 n'apparaît.

### Visa Claude Code — faisabilité

- les vues, transitions et fallbacks sont réalisables dans les budgets contractuels ;
- les états DOM et focus sont compatibles avec les primitives natives convenues ;
- les cadrages mobile et le premier segment respectent les plafonds de poids et de frame time ;
- aucun élément de la DR n'exige une dépendance ou une exception CSP non prévue.

### Visa Russel — identité, faits et droits

- portrait, geste, ciel, matières et sons choisis représentent réellement Russel ;
- les six fiches projet, les preuves et les droits sont approuvés ;
- les coordonnées, le CV, la ville, les langues et la voix publique sont confirmés ;
- les références sonores et les autorisations sont documentées.

## 7. Règle de passage

Le libellé **`DR-1 SIGNED`** ne peut être écrit qu'après les trois visas ci-dessus. La présence de ce dossier ne vaut ni `G1 PASS`, ni autorisation de scaffold. Tant que `BLOCKED SOURCE` subsiste, Claude peut seulement revoir la faisabilité et préparer les schémas G1 qui lui appartiennent.

## 8. Références normatives

- `DISCUSSION.md`, section 7 — concept et expérience validés ;
- `PRODUCTION_CONTRACT.md`, sections 1, 3.1, 8, 11 et 12 — invariants, ownership, gates et DoR ;
- [DTCG Format Module 2025.10](https://www.designtokens.org/TR/2025.10/format/) — format stable retenu pour les tokens ;
- [Literata](https://github.com/googlefonts/literata) et [Hanken Grotesk](https://github.com/marcologous/hanken-grotesk) — familles sous SIL Open Font License 1.1, à auto-héberger et sous-ensembler avant intégration.

