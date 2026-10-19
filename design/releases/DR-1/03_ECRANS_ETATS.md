# 03 — Écrans, états et matrice de couverture

## 1. Interprétation canonique des « quinze états »

La section 7.7 de `DISCUSSION.md` ne décrit pas quinze artboards isolés. Elle décrit **treize familles d'écrans**, une famille contenant plusieurs états système, puis un axe transversal mobile/reduced motion. DR-1 couvre donc chaque famille et chaque variante pertinente ; une unique image par ligne serait insuffisante.

Statuts de planche :

- `LOCKED` : composition et comportement non négociables ;
- `FLEXIBLE` : adaptation permise dans les limites écrites ;
- `PENDING SOURCE` : structure prête, contenu réel manquant ;
- `BLOCKED` : aucune maquette finale honnête n'est possible.

## 2. Matrice des quinze familles

| # | Famille | Desktop | Mobile | Reduced | Sans WebGL / JS incomplet | État actuel |
|---:|---|---|---|---|---|---|
| 1 | Accueil / Base 237 | identité + portrait + monde | tableau vertical | image fixe | HTML complet + poster | `PENDING SOURCE` |
| 2 | Choix d'entrée sonore | panneau modal | feuille basse / dialogue | identique | DOM natif | `LOCKED` structure |
| 3 | SOURCE | code → germe → monde | 3 plans lisibles | 3 images fixes | figure + code + 3 images | `BLOCKED` extrait |
| 4 | Promenade | scène + index + player | tableaux 2.5D | index manuel | posters + index DOM | `PENDING SOURCE` |
| 5 | Belvédère projet | média 7/12 + preuve 5/12 | média puis preuve | vue fixe | média HTML + contenu | `BLOCKED` six CR-0 |
| 6 | Étude de cas | grille éditoriale | lecture linéaire | N/A | route SSR complète | `BLOCKED` six CR-0 |
| 7 | Compétences / comète | 4 domaines + trace | plaque verticale | carte datée | carte statique | `BLOCKED` preuves/snapshot |
| 8 | Console de fabrication | dialogue minéral | dialogue plein écran | identique | catalogue de liens | `LOCKED` structure |
| 9 | Parcours | chronologie + responsabilités | liste chronologique | fixe | HTML complet | `BLOCKED` faits |
| 10 | Ground Track | Terre + liste | carte légère + liste | fixe | raster + liste | `BLOCKED` lieux |
| 11 | Résumé recruteur | lecture écran | lecture mobile | N/A | HTML + impression A4 | `BLOCKED` faits/CV |
| 12 | Final / Open Channel | geste + portrait + actions | tableau final | fixe | image + actions | `BLOCKED` geste/portrait |
| 13 | Sources & fabrication | registre éditorial | tables reflow | N/A | HTML complet | `PENDING RIGHTS` |
| 14 | États système | voir section 4 | voir section 4 | selon état | selon état | `SPECIFIED` |
| 15 | Mobile / reduced motion | axe de validation | séquence complète | séquence complète | combinaisons testées | `SPECIFIED` |

`N/A` ne signifie jamais « oublié » : la justification est que l'écran est déjà statique et n'utilise aucune animation essentielle.

## 3. Registre minimum des vues de DR-1

La future release signable comprend au minimum **65 vues de contrôle** :

| ID | Famille | Vues |
|---|---|---:|
| `A01` | Accueil | desktop, mobile | 2 |
| `A02` | Choix sonore | desktop, mobile | 2 |
| `A03` | SOURCE | desktop, mobile, reduced, no-WebGL | 4 |
| `A04` | Promenade | desktop, mobile, reduced, no-WebGL | 4 |
| `A05` | Belvédère neutre | desktop, mobile, reduced, no-WebGL | 4 |
| `A06` | Étude de cas | desktop, mobile, print | 3 |
| `A07` | Compétences/comète | desktop, mobile, reduced, no-WebGL | 4 |
| `A08` | Console | desktop, mobile, no-JS | 3 |
| `A09` | Parcours | desktop, mobile | 2 |
| `A10` | Ground Track | desktop, mobile, reduced, no-WebGL | 4 |
| `A11` | Résumé recruteur | desktop, mobile, print | 3 |
| `A12` | Final | desktop, mobile, reduced, no-WebGL | 4 |
| `A13` | Sources/fabrication | desktop, mobile | 2 |
| `A14` | Onze états système | desktop + mobile pour chacun | 22 |
| `A15` | Séquences contact sheet | mobile + reduced | 2 |

À ces 65 vues s'ajoutent deux contact sheets de parité : les six belvédères et les six ouvertures d'études de cas. Elles ne deviennent produisibles qu'après les six `CR-0`.

## 4. États système obligatoires

| État | Composition et comportement | Critère d'acceptation |
|---|---|---|
| Chargement immersif | identité et liens déjà visibles ; seule la zone immersive porte l'attente ; action `Continuer en version légère` | aucun écran bloquant, faux pourcentage ou focus volé |
| Contenu optionnel absent | le module est omis et la grille se referme | aucun `À venir`, squelette permanent ou tiret ambigu |
| Erreur immersive | DOM utile intact ; `Réessayer` + `Continuer en version légère` | aucun cul-de-sac plein écran |
| WebGL indisponible | libellé discret `Version légère active` | mêmes faits, preuves, routes et actions |
| Média projet absent | preuve, rôle et lien restent ; aucune boîte vide | l'absence ne réduit pas artificiellement la dignité du projet ; sans CR-0, G1 bloque |
| Snapshot périmé | `Dernière trace publique vérifiée le [date]` | jamais `live`, aucun `aria-live`, aucune disparition silencieuse |
| Audio bloqué | visite continue en silence ; bouton `Activer le son` dans le player | aucune modale bloquante ni redémarrage |
| Lien externe | visite pause et état mémorisé ; nouvel onglet annoncé dans le nom accessible | aucune confirmation modale inutile |
| Échec de contact | adresse sélectionnable + instruction de copie manuelle | aucun formulaire V1 ; l'échec vise seulement copie ou ouverture de `mailto:` |
| Connexion perdue | contenu chargé reste lisible ; ressource différée attend la reconnexion | promesse limitée à une session déjà chargée ; cold start offline non garanti sans ADR |
| Reprise | même chapitre, état pause, focus restauré ; retour d'onglet silencieux | aucune reprise automatique de caméra ou audio |

Les pages 404 et erreur globale personnalisées sont traitées dans la section suivante : ce sont des routes, pas des variantes de la scène.

## 5. Routes et vues additionnelles

Les quinze familles ne couvrent pas explicitement toutes les routes. DR-1 spécifie aussi :

| Route / cas | Vue requise |
|---|---|
| `/visite` direct | première image fixe, contexte court, `Démarrer` et retour accueil |
| `/projets` | registre des six projets de poids égal, sans badge vedette |
| `/contact` | disponibilité et canaux directs ; aucun formulaire V1 |
| `/mentions` | mentions, confidentialité, crédits et navigation simple |
| `/cv.pdf` | document public audité et lien de retour depuis le site |
| `not-found` / 404 | message clair + projets, résumé, contact ; sans Canvas requis |
| `error` | erreur locale, reprise ou route alternative, identifiant non sensible |
| `global-error` | coque minimale compatible CSP, sans dépendre des styles de page défaillants |
| sélecteur FR/EN éventuel | conserve route et chapitre ; apparaît seulement si Q6 confirme deux langues |

## 6. Wireframes fonctionnels

### Accueil desktop

```text
┌────────────────────────────────────────────────────────────────────┐
│ Aller au contenu                         Résumé · CV · Contact      │
│                                                                    │
│ [ PORTRAIT RÉEL 4:5 ]   MASTERMIND                                │
│ [ 35–45 % utile     ]   [Rôle validé] · Cameroun                  │
│ [ aucun texte dessus]   Le code est la base. L'humain…            │
│                         [Commencer] [Explorer librement]           │
│                                                                    │
│ ═ tranche minérale / limbe réel — aperçu non bloquant ═           │
└────────────────────────────────────────────────────────────────────┘
```

### Belvédère desktop

```text
┌────────────────────────────────────────────────────────────────────┐
│ Chapitre 03/12                                      Pause · Menu    │
│                                                                    │
│ [ MÉDIA PRODUIT — 7 colonnes ] [PROJET — 5 colonnes, opaque]       │
│ [ ratio natif, droit validé  ] [besoin si fourni]                  │
│ [ image ou vidéo dominante   ] [TRACE / RÔLE EXACT]                │
│                                 [preuve obligatoire] [Approfondir] │
│                                                                    │
│ repère solaire en profondeur, hors texte et hors interaction       │
└────────────────────────────────────────────────────────────────────┘
```

### Mobile

```text
┌──────────────────────┐
│ Chapitre      Pause  │
│                      │
│ [média ratio natif]  │
│                      │
├──────────────────────┤
│ PROJET               │
│ TRACE / RÔLE EXACT   │
│ phrase + preuve      │
│ [Approfondir]        │
├──────────────────────┤
│ Préc.  03/12  Suiv.  │
└──────────────────────┘
```

## 7. Règles par écran

### Choix sonore

Titre : `Comment souhaitez-vous entrer ?`

Actions de même poids : `Entrer avec le son — recommandé` et `Continuer en silence`. Le mot « recommandé » donne le contexte sans diminuer le contraste, la taille ou l'ordre clavier du choix silencieux. Une fermeture visible revient à l'image fixe.

### Console

Plaque minérale claire, jamais terminal noir. Titre accessible, explication, champ/zone de commande, suggestions visibles et résultat en langage courant avec vrais liens. Sur mobile, l'ouverture plein écran ne masque pas le bouton de fermeture quand le clavier logiciel est présent.

### Résumé recruteur

Ordre : identité → cible/disponibilité → six projets → quatre domaines prouvés → parcours → CV/GitHub/contact. Aucune décoration cosmique essentielle. La version A4 utilise des URL lisibles et ne dépend pas du fond imprimé.

### Sources & fabrication

Chaque actif affiche ce qui peut être public : identifiant, auteur/source, transformation, licence, date, dérivé et poids. Aucun chemin privé, GPS, nom de sauvegarde, secret ou donnée de client non autorisée.

## 8. États combinés à tester

Les combinaisons ne sont pas facultatives : mobile + reduced motion, mobile + no-WebGL, mobile + clavier logiciel, zoom 200 % + largeur 320 px, audio bloqué + reprise, perte réseau + média différé, snapshot périmé + no-WebGL, et retour d'étude de cas + reduced motion.

