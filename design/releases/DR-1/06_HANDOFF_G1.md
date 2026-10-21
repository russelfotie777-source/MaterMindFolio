# 06 — Handoff G1 et chemin vers la signature

## 1. État de gate au 21 octobre 2026

| Gate | DRI | Verdict | Preuve / limite |
|---|---|---|---|
| G0 | Russel | **GO limité enregistré** | G1 autorisé, toujours sans code |
| G1 / Design | ChatGPT / Codex | **G1 PASS — DR-1 SIGNÉE** | fidélité visuelle C3.2 validée ; fleurs aux repères, chrome HORIZON 237 nettoyé, 65 vues et deux planches de parité validées le 21 octobre 2026 |
| G1 / Contenu | Russel | **CR-0 + MÉDIAS VISÉS** | sept CR-0 et dix médias C3 des cinq autres projets approuvés le 20 octobre 2026 ; PDF du CV encore absent |
| G1 / Schémas | Claude Code | **LIVRÉ** | quatre schémas, sept instances ; invariant `approved ⇒ validatedAt` corrigé et testé le 20 octobre 2026 |
| G1 / Faisabilité | Claude Code | **VISA FINAL C3.2 : ACCEPTÉ AVEC RÉSERVES** | visa du 21 octobre 2026, section 9 ; registre G1-R5 et manifeste DR-1-C3.2 réémis, zéro fichier manquant, zéro empreinte invalide |
| G1 global | ChatGPT / Codex | **PASS** | aucune réserve bloquante ; les trois visas G1 sont acquis le 21 octobre 2026 |

**Conséquence :** `READY FOR CODE = OUI`. G1 est fermé ; G2 peut commencer dans le périmètre et sous les contraintes du contrat. La synchronisation du statut dans `manifest.json` reste à la charge de Claude.

## 2. Ce qui est réellement livré

- réponses ★ de la collecte complètes ;
- portrait détouré final choisi par Russel, visage inchangé ;
- monogramme TRACE 237 et master SVG ;
- six décors japonais Magnific validés visuellement et six masters de revue 4× ;
- Source Kit C3 et règles de provenance/droits réécrites ;
- palette DTCG C3 contrastée ;
- DM Sans officielle, police de ZIRIS Entreprises, avec licence OFL ;
- huit moodframes C3 réémis en DM Sans, en SVG et PNG avec contact sheet ;
- captures publiques ZIRIS desktop/mobile utilisées comme média réel ;
- dix dérivés C3 desktop/mobile des cinq autres projets avec contact sheet, provenance et textes alternatifs ;
- 65 vues de contrôle C3 en SVG/PNG, index complet et deux planches de parité ;
- quatre schémas G1, six brouillons projet et un brouillon profil ;
- aperçu humain `docs/content-release/CR-0/APERCU.md` ;
- CV français candidat ;
- direction sans narration et ordre chronologique des six projets.

Ces livrables forment la DR-1 C3.2 validée visuellement et signée le 21 octobre 2026.

## 3. Revue éditoriale de DR1-R08

Le modèle séparant faits sourcés et copy humaine couvre les besoins de la DR : rôle, période, liens et preuve viennent des faits ; besoin, décision et étude de cas viennent de la copy ; les textes alternatifs disposent d'une section dédiée.

**Verdict éditorial : ACCEPTÉ AVEC UNE RÉSERVE TECHNIQUE.**

La réserve à confirmer est reproductible : un contenu `approved` ne doit jamais conserver un fait publiable sans `validatedAt`. Claude corrige le lien de schéma ou fournit une validation équivalente, testée et documentée.

**Correction de Claude, 20 octobre 2026 :** une règle `if/then` à la racine des deux schémas de faits impose une date `validatedAt` sur chaque fait dès que `contentRelease.status` vaut `approved`. Tests : sept instances valides, onze entrées fausses refusées, deux entrées approuvées complètes acceptées (`docs/architecture/SCHEMAS_G1.md`, section 4).

## 4. Décisions acquises de Russel

Le visa **« Je valide la direction visuelle C3 »** est acquis le 20 octobre 2026. Son amendement typographique est appliqué : DM Sans, famille réelle de ZIRIS Entreprises ; aucune police créée ou modifiée. Le visa de couverture C3.2 est acquis le **21 octobre 2026** après présentation de la correction finale. L'aperçu CR-0 et le CV candidat ont été validés ; le PDF final reste volontairement en attente.

Pour les décors Magnific, Russel a déclaré le 20 octobre 2026 que son plan couvre l'usage public et commercial demandé. Cette déclaration propriétaire clôt la réserve G1 ; la mention « image générée » reste obligatoire au colophon.

Les limites factuelles restent visibles :

- Fast Shipping : aucune autorisation nommée de l'agence ;
- Shopitech et ArtVibeCamer : forme de l'accord non précisée ;
- les faits déduits d'un dépôt ou d'une observation publique restent identifiés comme tels ;
- données clients, paiements, étudiants, secrets et code privé restent exclus ;
- le montant attribué aux agents IA reste déclaratif et non audité.

## 5. Handoff ciblé à Claude Code

Claude n'a pas à refaire les moodframes. Il doit :

1. confirmer ou corriger l'invariant `approved ⇒ tous les faits publiables ont validatedAt` puis repasser les sept instances ;
2. contrôler les six masters 4× : dimensions, poids, mémoire potentielle et dérivés responsifs ;
3. enregistrer les sources et dérivés C3 sans conserver les anciens actifs C2 comme actifs courants ;
4. réémettre `manifest.json` et `assets/registry.json` avec empreintes exactes ;
5. revoir vraie 3D, fallback sans WebGL, budgets et statuts de droit ;
6. inscrire un visa daté sous la forme :

> **CLAUDE — VISA FAISABILITÉ DR-1 C3 : ACCEPTÉ / ACCEPTÉ AVEC RÉSERVES / BLOQUÉ**, date, réserves numérotées et preuves concernées.

Le présent fichier n'écrit ni le manifeste, ni le registre, ni le visa à la place de Claude.

## 6. Travail restant de ChatGPT / Codex

Après les visas visuels de Russel, désormais acquis :

1. appliquer les corrections C3 en versionnant toute modification de tokens ;
2. ~~obtenir le visa de Russel sur les 65 vues de contrôle et les deux planches de parité~~ — **acquis le 21 octobre 2026** ;
3. transmettre à Claude les dix médias validés et leurs empreintes documentées dans `12_MEDIAS_PROJETS_C3.md`, sans éditer son registre ;
4. produire ou licencier les sons originaux et préparer la revue de l'ADR lecteur ;
5. examiner les mesures de luminance, poids et contraste fournies par Claude ;
6. ~~signer la fidélité visuelle de la DR-1 finale~~ — **acquis le 21 octobre 2026**.

## 7. Preuves nécessaires pour fermer G1

| Preuve | Owner | État C3 |
|---|---|---|
| DR-1 complète et versionnée | ChatGPT / Codex | **C3.2 signée ; fidélité visuelle validée le 21 octobre 2026** |
| Six CR-0 + profil | Russel | **sept drafts présents ; aperçu validé** |
| Schémas facts/copy + aperçu | Claude Code | **livrés ; invariant corrigé et testé** |
| Registre d'actifs et droits | Russel + Claude | **registre G1-R5 réémis par Claude ; droits Magnific déclarés par Russel** |
| Tuple technique et budgets | Claude Code | **visa final C3.2 accepté avec réserves non bloquantes** |
| Moodframes et vues de contrôle | ChatGPT / Codex | **C3.2, 65 vues et deux planches de parité validées par Russel le 21 octobre 2026** |
| Procès-verbal G1 | trois parties | **présent — section 10, trois visas acquis le 21 octobre 2026** |

La sauvegarde privée n'est plus une preuve bloquante : Russel a levé cette exigence le 19 octobre 2026 et en assume le risque.

## 8. Registre des réserves DR-1 Candidate 3

| ID | État | Réserve | Owner | Bloque |
|---|---|---|---|---|
| `DR1-R01` | **CLOSED** | Source Kit, masters 4×, palette, DM Sans et moodframes validés ; droits Magnific déclarés par Russel le 20 octobre 2026 | Russel + Claude | non |
| `DR1-R02` | **CLOSED** | portrait détouré choisi, identité conservée | Russel | non |
| `DR1-R03` | **CLOSED** | monogramme original remplace geste et clip | ChatGPT | non |
| `DR1-R04` | **CLOSED — CONTENT + MEDIA** | sept CR-0 et dix dérivés desktop/mobile approuvés par Russel le 20 octobre 2026 ; limites de droits conservées dans les fiches | Russel + ChatGPT | non |
| `DR1-R05` | **DEFERRED BY OWNER** | CV candidat validé le 20 octobre 2026 ; Russel reporte le PDF à la fin de la construction (21 octobre 2026) ; à livrer avant G7 | ChatGPT | non pour G1 |
| `DR1-R06` | **CLOSED G1 — PRODUCTION G6** | pas de narration ; fond sonore en mélodie originale composée par les agents, confirmé par Russel le 21 octobre 2026 ; trois références via le lecteur officiel au clic, `ADR-001` accepté ; production des sons à G6 | Russel + Claude + ChatGPT | non pour G1 |
| `DR1-R07` | **CLOSED G1** | SOURCE et snapshot autorisés ; preuves exactes reportées à G5 | Russel + Claude | non en G1 |
| `DR1-R08` | **CLOSED** | schémas livrés ; invariant `approved ⇒ validatedAt` corrigé, 7 instances valides, 11 entrées fausses refusées | Claude | non |
| `DR1-R09` | **CLOSED — FINAL C3.2 VISA** | visa final C3.2 du 21 octobre 2026 accepté avec réserves `C3-R1` à `C3-R6` et `C3-R8`, à tenir de G2 à G6 | Claude | non |
| `DR1-R10` | **CLOSED BY OWNER WAIVER** | sauvegarde levée explicitement par Russel | Russel | non |
| `DR1-R11` | **CLOSED** | conservation, détourage et composition du portrait acceptés | Russel | non |
| `DR1-R12` | **CLOSED — VISUAL** | huit moodframes C3 et typographie DM Sans validés par Russel | Russel | non |
| `DR1-R13` | **CLOSED — RUSSEL COVERAGE VISA ACQUIRED** | révision C3.2 : 65 SVG/PNG, index et deux planches de parité validés le 21 octobre 2026 et documentés dans `13_CONTROLE_65_VUES_C3.md` | Russel + ChatGPT | non |
| `DR1-R14` | **CLOSED BY OWNER DECLARATION** | Russel déclare le 20 octobre 2026 que son plan Magnific couvre l'usage et que les images fournies sont à utiliser | Russel | non |

## 9. Visas

### Claude Code

> **CLAUDE — VISA FAISABILITÉ FINAL DR-1 C3.2 : ACCEPTÉ AVEC RÉSERVES**, 21 octobre 2026.

Contrôles C3.2, sans installation ni code applicatif :

| Point | Mesure | Verdict |
|---|---|---|
| Manifeste | `manifest.json` DR-1-C3.2 : 191 fichiers de release, 49 dépendances, 5 fichiers remplacés ; 0 fichier manquant, 0 empreinte invalide ; tous les fichiers de `design/releases/DR-1/` classés | ACCEPT |
| Livrables de contrôle ajoutés | `12_MEDIAS_PROJETS_C3.md`, `13_CONTROLE_65_VUES_C3.md`, 137 fichiers de `control-views-c3/` (65 vues SVG + PNG, index, deux planches de parité, inventaire), 11 fichiers de `assets/project-media/`, 15 captures sources et le `README.md` de `captures-projets/` | ACCEPT |
| 65 vues | `inventory.json` : 65 identifiants uniques, chaque SVG et PNG présent | ACCEPT |
| Médias projets | 10 dérivés : empreintes source et dérivé conformes à `12_MEDIAS_PROJETS_C3.md` ; 20 à 78 Ko en WebP, sans EXIF ni XMP ; chargés à l'approche de leur chapitre | ACCEPT |
| Registre | `assets/registry.json` G1-R5 : 22 actifs courants, 8 retirés, 40 empreintes vérifiées ; la capture temporaire de ZIRIS, hors dépôt par conception, est couverte par ses dérivés vérifiés | ACCEPT |
| Palette C3.2 | contraste texte/surface minimal 7,08:1 ; trace solaire `#f06aa6` à 6,1:1 sur le fond | ACCEPT |
| Budgets, police, portrait, 3D, sans WebGL | inchangés depuis le visa C3 ci-dessous | ACCEPT |

Réserves maintenues, à tenir de G2 à G6 : `C3-R1` à `C3-R6` et `C3-R8` ci-dessous ; `C3-R7` est levée. `C3-R2` est précisée : les preuves de design et masters (`control-views-c3/`, `moodframes-c3/`, `assets/c3-upscaled/`, `decor-candidats/`, `captures-projets/`, compositions Magnific) pèsent environ 142 Mo et restent hors du premier commit applicatif, sauf décision contraire de Russel.

Ce visa clôt la revue de faisabilité de G1 côté Claude.

**Mise à jour du 21 octobre 2026.** Russel reporte le PDF du CV à la fin de la construction et confirme la décision sonore ; `docs/adr/ADR-001-lecteur-morceaux-reference.md` lève `C3-R6` et `C3-R8`. Plus aucune réserve ne bloque G1. Claude prononce :

> **Claude Code — G1 PASS : schémas valides et faisabilité technique validée.** 21 octobre 2026. Réserves `C3-R1` à `C3-R5` à tenir de G2 à G6.

Le `G1 PASS` de ChatGPT / Codex est désormais inscrit ci-dessous ; les trois visas de clôture sont acquis le 21 octobre 2026.

Visa précédent, conservé :

> **CLAUDE — VISA FAISABILITÉ DR-1 C3 : ACCEPTÉ AVEC RÉSERVES**, 20 octobre 2026.

Contrôles exécutés, sans installation ni code applicatif :

| Point | Mesure | Verdict |
|---|---|---|
| Schémas | invariant `approved ⇒ validatedAt` à la racine de `project-facts` et `profile-facts` ; 7 instances valides ; 11 entrées fausses refusées, 2 entrées approuvées complètes acceptées | ACCEPT |
| Masters 4× | 5760 × 2880 ou 5120 × 2880, 9,8 à 14,3 Mo en PNG, 56 à 63 Mio décodés : jamais servis | ACCEPT comme masters |
| Dérivés mesurés | mobile 1024 px : AVIF 7 à 47 Ko, WebP 13 à 66 Ko ; desktop 2560 px : AVIF 32 à 153 Ko | ACCEPT |
| Segment 1 mobile | ciel d'aube 7 à 32 Ko selon la définition, basalte 512² 36 Ko en WebP ; planètes et géométrie estimées à 90 Ko ; total estimé ≈ 150 Ko pour 200 Ko | ACCEPT, à mesurer en G3 |
| Mémoire textures mobile | ciel 2048 × 1024 avec mipmaps 10,7 Mio, basalte 512² 1,3 Mio, deux planètes 512² 2,7 Mio : ≈ 15 Mio pour 32 Mio | ACCEPT |
| Police | DM Sans, sous-ensemble français, opsz 9–40 et wght 400–600 : 31,4 Ko WOFF2 pour 100 Ko | ACCEPT |
| Portrait LCP | détourage recadré 960 px : WebP 31 Ko, AVIF 16 Ko pour 150 Ko | ACCEPT |
| Contrastes C3 | textes 4,58:1 à 19,46:1 ; focus 8,70:1 sur clair et 10,51:1 sur sombre | ACCEPT |
| Vraie 3D | Soleil, planètes, comète et pierres faisables dans le tuple R1 ; au plus 4 corps actifs sur mobile | ACCEPT avec réserves |
| Sans WebGL | poster d'aube + portrait détouré en DOM, mêmes faits et actions ; ≈ 63 Ko | ACCEPT |
| Registre et manifeste | `assets/registry.json` G1-R4 (12 actifs courants, 8 retirés) ; `manifest.json` DR-1-C3 sans fichier absent | ACCEPT |

Réserves :

1. **`C3-R1` Netteté.** Les masters sont agrandis ×4 par Lanczos à partir de sources de 1280 à 1440 px : doux à 100 %. Ils suffisent pour des fonds de 2560 px au plus, derrière des panneaux ; le champ d'étoiles net est rendu en points 3D au-dessus de la photo adoucie.
2. **`C3-R2` Masters hors Git.** Masters 4×, sources Magnific et compositions pèsent environ 90 Mo. Avant le premier commit : `decor-candidats/` et `assets/c3-upscaled/` exclus de Git ou placés en Git LFS ; seuls les dérivés web sont commités. Décision de Russel au moment du commit.
3. **`C3-R3` Ciel d'ouverture.** Ce n'est pas un panorama équirectangulaire : décor cylindrique, horizon recalé à hauteur d'yeux, zénith étoilé en 3D, tangage de caméra limité à ±15° pendant la visite.
4. **`C3-R4` Pierres.** Couleur tirée du basalte C3 ; relief et rugosité depuis un jeu PBR CC0 ou générés par le code ; jeu complet ≤ 60 Ko sur mobile ; pas de KTX2 au segment 1.
5. **`C3-R5` Planètes.** Cartes du domaine public (NASA/USGS) ou sous licence créditée, 512² au plus sur mobile.
6. **`C3-R6` Lecteur des morceaux de référence.** ADR avant G2 : `frame-src` limité au fournisseur choisi, aucune requête tierce avant le clic.
7. **`C3-R7` Droits Magnific (`DR1-R14`).** Levée le 20 octobre 2026 : Russel déclare que son plan Magnific couvre l'usage. La mention « image générée » reste obligatoire au colophon.
8. **`C3-R8` Musique.** Le plan (section 7.10) demande une composition humaine originale ou une œuvre licenciée ; une mélodie composée par les agents doit être tranchée par Russel et Codex avant G6.

Ce visa porte sur la faisabilité technique de C3. Il ne remplace ni le visa visuel de Codex, ni les visas de faits et de droits de Russel.

### Russel

**Direction visuelle C3 et DM Sans validées le 20 octobre 2026. Correction C3.2, 65 vues et deux planches de parité validées le 21 octobre 2026. Aperçu CR-0, CV candidat et médias des projets validés ; droits Magnific déclarés. PDF du CV reporté à la fin de la construction ; décision sonore confirmée le 21 octobre 2026.**

> **Russel — G1 PASS : faits, identité, actifs et droits validés.** 21 octobre 2026, écrit directement à Claude.

### ChatGPT / Codex

**La Candidate 3.2 finale, réémise en DM Sans, avec formes organiques, fleurs aux repères et chrome HORIZON 237 nettoyé, est validée visuellement. Les contrôles de fidélité, de couverture et d'intégrité ne révèlent aucune réserve bloquante pour G1.**

> **ChatGPT / Codex — G1 PASS : DR-1 signée et fidélité visuelle validée.** 21 octobre 2026.

## 10. Texte exact de clôture

Toutes les preuves bloquantes étant jointes et les trois visas acquis, la clôture suivante est prononcée le 21 octobre 2026 :

```text
ChatGPT / Codex — G1 PASS : DR-1 signée et fidélité visuelle validée.
Claude Code — G1 PASS : schémas valides et faisabilité technique validée.
Russel — G1 PASS : faits, identité, actifs et droits validés.
STATUT DU CONTRAT : READY FOR CODE.
```

G1 est fermé. Le projet peut entrer en G2 conformément au contrat. Claude reste responsable de la synchronisation administrative du manifeste, sans que celle-ci remette en cause les visas acquis.
