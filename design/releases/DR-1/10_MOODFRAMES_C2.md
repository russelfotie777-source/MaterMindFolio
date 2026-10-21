# 10 — Moodframes Candidate 2

> **Historique — supersédé.** Russel a rejeté cette direction le 20 octobre 2026. Candidate 2 n'est plus soumise au visa et ne doit pas guider l'intégration. La direction courante est `11_MOODFRAMES_C3.md` et `moodframes-c3/`.

## 1. Verdict de production

Les **huit preuves visuelles exigées** existent désormais en SVG source et PNG de revue. Elles utilisent uniquement :

- le portrait choisi par Russel ;
- les photographies réelles du Source Kit ;
- la vraie vitrine publique ZIRIS Entreprises ;
- le monogramme vectoriel original TRACE 237 ;
- des formes, masques et disques solaires déterministes.

Aucune image n'a été générée, reconstruite ou complétée par IA. Les recadrages, changements de format, suppressions de métadonnées et compressions sont mécaniques. Le statut reste **CANDIDATE — VISA VISUEL RUSSEL REQUIS**.

![Contact sheet des huit moodframes](moodframes/CONTACT-SHEET-C2.webp)

## 2. Registre des huit vues

| ID | Fichier | Viewport | Ce que la vue prouve | Sources visibles |
|---|---|---:|---|---|
| MF-01 | MF-01-ACCUEIL-DESKTOP | 1440 × 900 | personne avant décor, actions immédiates, surface majoritairement claire | portrait, papier, Qwantani, monogramme |
| MF-02 | MF-02-ACCUEIL-MOBILE | 390 × 844 | même identité et mêmes deux entrées sans texte superposé au visage | portrait, papier, Qwantani |
| MF-03 | MF-03-RACCORD-3S | 1440 × 900 | le monogramme devient une trace matérielle sans vidéo de main | Qwantani, latérite, monogramme |
| MF-04 | MF-04-REVELATION-DESKTOP | 1440 × 900 | révélation solaire, six stations, équilibre ciel/minéral | Qwantani, pierre, latérite |
| MF-05 | MF-05-REVELATION-MOBILE | 390 × 844 | même révélation en tableau vertical et accès au mode léger | Qwantani, papier, latérite |
| MF-06 | MF-06-BELVEDERE-ZIRIS-DESKTOP | 1440 × 900 | produit réel dominant, rôle et preuve courts, violet localisé | capture ZIRIS, pierre |
| MF-07 | MF-07-BELVEDERE-ZIRIS-MOBILE | 390 × 844 | média puis rôle puis preuve, sans miniature ou mur de texte | capture ZIRIS |
| MF-08 | MF-08-FINAL-MONOGRAMME-PORTRAIT | 1440 × 900 | final humain, contact direct et ancrage à Douala | portrait, papier, panorama Douala, monogramme |

Chaque base de nom possède un fichier .svg éditable et un fichier .png de revue dans moodframes/.

## 3. Décisions visuelles démontrées

- le monde n'est ni un écran noir, ni un ciel bleu artificiel : l'aube reste photographique, douce et lisible ;
- le violet profond appartient au média ZIRIS ; il n'est jamais appliqué comme fond générique à tout le portfolio ;
- la peau, l'interface produit et les matières ne subissent aucun filtre génératif ;
- l'ivoire domine l'accueil, les belvédères et le final ; le sombre sert le texte, les commandes et une seule séquence de raccord ;
- les panneaux n'utilisent ni verre flou, ni glow, ni série de cartes flottantes ;
- le texte est court et immobile : un rôle, une phrase, une preuve et une action sur le belvédère ;
- le mobile est recomposé, pas réduit mécaniquement depuis le desktop.

## 4. Palette Candidate 2

| Rôle | Valeur | Origine |
|---|---|---|
| surface minérale | #f3efe7 | pierre et papier éclaircis ensemble |
| encre | #19141b | noirs chauds du portrait |
| cobalt | #6a7994 | ciel Qwantani |
| profondeur | #253047 | cobalt assombri pour petits panneaux |
| latérite | #97714f | photographie de latérite |
| solaire | #f0c98b | zones chaudes des aubes |
| ZIRIS | #4b2b9e | interface produit réelle |

Contrastes sRGB vérifiés :

- encre / surface minérale : **15,82:1** ;
- texte secondaire #4e474b / surface minérale : **7,87:1** ;
- surface minérale / profondeur : **11,50:1** ;
- surface minérale / violet ZIRIS : **8,56:1** ;
- focus terre #6b4e34 / surface minérale : **6,62:1** ;
- solaire / profondeur : **8,44:1**.

Les valeurs et alias correspondants sont dans design/contracts/tokens.json.

## 5. Provenance des dérivés

Les dérivés de revue vivent dans assets/source-derivatives/. Ils ne sont pas encore les médias de production :

- Qwantani Dawn : Greg Zaal / Jarod Guest, CC0 ;
- Sunrise in Bwiteva : Nkwi Cyril, CC BY-SA 4.0 ;
- panorama Douala : Guaka, CC BY-SA 4.0 ;
- latérite : Steve Kally, CC BY-SA 4.0 ;
- pierre : M0tty, CC BY-SA 3.0 ;
- papier : D. Sharon Pruitt / Pink Sherbet Photography, CC BY 2.0 ;
- ZIRIS Entreprises : capture de la vitrine publique du 20 octobre 2026 ; droit déclaré par les co-propriétaires, attribution du co-développement maintenue ;
- portrait : exception propriétaire déjà enregistrée.

Les fichiers de police dans assets/type-previews/ viennent du dépôt officiel Google Fonts sous SIL OFL 1.1. Ils servent uniquement à rendre les preuves G1 ; l'intégration future doit encore produire ses sous-ensembles WOFF2 et ses empreintes propres.

## 6. Ce que ces planches ne ferment pas

- le visa esthétique et identitaire de Russel ;
- le visa de faisabilité Claude sur Candidate 2 ;
- les médias et droits finaux des cinq autres projets ;
- les 65 vues d'états et les deux contact sheets de parité ;
- les mesures de luminance automatisées au pixel, qui accompagneront ces vues ;
- les sons, leur licence et l'ADR du lecteur officiel de références.

Ces moodframes peuvent donc fermer la réserve « non produits », jamais la réserve « non validés ».
