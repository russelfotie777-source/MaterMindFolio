# 02 — Storyboard de la visite

## 1. Contrat temporel

- durée cible : **107 secondes**, puis état final ouvert ;
- trois gestes caméra : **avancer, s'immobiliser, révéler en vue haute** ;
- règle absolue : **mouvement → immobilité → information** ;
- sur l'accueil, le teaser visuel 0–10 s peut jouer silencieusement et sans bloquer les actions ; aucune **visite guidée**, narration ou piste sonore ne démarre avant une action volontaire ;
- sur `/visite` direct, même le teaser reste sur son image 0 jusqu'à l'action ;
- aucun roulis, vol FPS, rotation gratuite, tunnel, warp, flash ou fondu au noir ;
- pause possible à tout instant ; reprise à la même position ;
- l'ouverture 0–10 s n'est jamais jouée deux fois dans une même visite.

## 2. Ouverture — 0 à 10 secondes

Le master vidéo du geste est capturé en 4K/60 i/s pour conserver une source propre. Le dérivé public vise **2,5 secondes** : 250 ms de poignée avant et après, plus les 2,0 secondes effectivement affichées de 1 à 3 s. Il possède un poster et ne promet jamais une livraison 4K au navigateur.

| Temps | Image et cadrage | Mouvement / UI | Son | Équivalent fixe |
|---:|---|---|---|---|
| 0,00–0,90 | Portrait réel 35–45 %, nom, rôle validé, Cameroun, CV, contact, résumé | Image déjà présente, aucun fondu. Tous les liens sont actifs en HTML. | Silence | Identique |
| 0,90–1,00 | Coupe vers papier et main vus de dessus | Coupe franche ; la navigation DOM reste disponible | Silence | Plan du geste non commencé |
| 1,00–2,65 | La main trace le monogramme au feutre | Caméra physique fixe ; fibre, pression et irrégularité restent visibles | Feutre seulement si mode son déjà autorisé lors d'un replay | Image du geste en cours |
| 2,65–3,00 | Geste achevé | Immobilité de 350 ms | Fin naturelle du feutre | Geste achevé |
| 3,00 | Même tangente gravée dans la pierre | Match-cut sec, même angle et même échelle ; aucun morph | Impact minéral bref, sans sub-bass agressive | Diptyque papier/pierre |
| 3,00–4,40 | Tranche, agrégat et premier joint | Translation latérale lente | Ambiance très basse si autorisée | Gros plan minéral |
| 4,40–5,85 | Limbe terrestre, structure et ombre | Élargissement contrôlé | Ambiance matinale | Vue large fixe |
| 6,00 | Six stations | Allumage exactement simultané, montée ≥ 400 ms | Impulsion solaire courte | Six repères allumés |
| 6,00–7,80 | Index égal des six projets | Caméra immobile ; mêmes corps, tailles et graisses | Aucun cue hiérarchisant | Index HTML |
| 8,00–8,30 | Soleil, planètes et firmament apparaissent | Ouverture d'exposition, sans flash ni particules décoratives | Ouverture harmonique facultative | Tableau solaire |
| 8,30–10,00 | Monde complet, lumineux | Image fixe ; `Commencer la visite`, `Explorer librement`, CV et résumé dominent | Silence tant que le son n'est pas choisi | Identique |

### Interruption de l'ouverture

- `Commencer la visite` fige proprement l'image courante et ouvre le choix sonore ;
- après le choix, une ouverture incomplète reprend au même temps, sans redémarrer ;
- si l'ouverture a fini, la visite part directement vers SOURCE ;
- `Explorer librement` mène à une vue large stable sans caméra automatique ;
- l'accès direct à `/visite` montre l'image de 0 s et attend l'action ;
- `Revoir l'ouverture` est une action distincte et ne réinitialise pas la visite entière.

## 3. Timeline complète — 0 à 107 secondes

| Temps | Chapitre | Caméra et composition | Information permise | Audio / cue | Fallback reduced/no-WebGL |
|---:|---|---|---|---|---|
| 0–10 | Ouverture | storyboard ci-dessus | identité, six noms, choix | aucun avant consentement | 4 tableaux fixes |
| 10–12 | Base 237 | avancée courte puis verrouillage | devise seulement après arrêt | ambiance de matin, si fournie | tableau Base 237 |
| 12–15 | SOURCE / code | plaque minérale frontale, caméra fixe | 6–12 lignes et explication humaine | frappe isolée facultative, jamais continue | `<pre><code>` sélectionnable |
| 15–18 | SOURCE / germe | 256–384 jetons desktop, 64–96 mobile | aucun texte nouveau | impulsion solaire courte | image code → germe |
| 18–22 | SOURCE / monde | promenade s'allume, arrivée station A | titre du chapitre après arrêt | ouverture musicale possible | image germe → promenade |
| 22–30 | Projet A | 1,5 s approche, 5,5 s fixe, 1 s sortie | besoin si fourni + preuve | musique baissée, aucune voix sur lecture dense | vue projet fixe |
| 30–38 | Projet B | même enveloppe | idem | idem | idem |
| 38–46 | Projet C | même enveloppe | idem | idem | idem |
| 46–54 | Projet D | même enveloppe | idem | idem | idem |
| 54–62 | Projet E | même enveloppe | idem | idem | idem |
| 62–70 | Projet F | même enveloppe | idem | idem | idem |
| 70–75 | Compétences | arrivée circulaire puis arrêt | quatre domaines, preuve reliée | lit sonore sobre | tableau compétences |
| 75–80 | Comète | caméra fixe ; une seule trace | dépôt + date + travail privé non inclus | un cue court | carte datée sans animation |
| 80–89 | Parcours | 2 s mouvement, 6 s lecture, 1 s sortie | rôles, responsabilités, apprentissage | voix éventuelle, musique sous la voix | chronologie verticale |
| 89–97 | Ground Track | 2,5 s approche, 5,5 s fixe | lieux et entreprises validés | ambiance, sans folklore | carte + liste DOM |
| 97–100 | Élévation | passage à la vue orthographique | aucun texte important | tension douce | coupe directe vue haute |
| 100–104 | Révélation | geste complet immobile | règle d'auteur | résolution musicale | image fixe du geste |
| 104–107 | Open Channel | retour portrait + trace | contact, CV, explorer, revoir | fin ouverte, jamais autoplay suivant | composition finale fixe |

### Identifiants canoniques des chapitres

Le player compte **12 chapitres**. Les fragments nomment un contenu stable, jamais un temps ou une pose caméra. L'ordre projet ci-dessous est alphabétique tant que les dates ne sont pas validées ; un futur ordre chronologique peut déplacer un chapitre sans changer son identifiant ni son fragment.

| # | ID / label | Temps candidate | Fragment |
|---:|---|---:|---|
| 01 | `opening` / Ouverture | 0–10 | `#opening` |
| 02 | `base-237-source` / Base 237 · SOURCE | 10–22 | `#base-237-source` |
| 03 | `project-artvibe-cameroun` / ArtVibe Cameroun | 22–30 | `#project-artvibe-cameroun` |
| 04 | `project-batobaye-market` / Batobaye Market | 30–38 | `#project-batobaye-market` |
| 05 | `project-fast-shipping-logistics` / Fast Shipping Logistics | 38–46 | `#project-fast-shipping-logistics` |
| 06 | `project-mboamarkets` / MboaMarkets | 46–54 | `#project-mboamarkets` |
| 07 | `project-shopitech` / Shopitech | 54–62 | `#project-shopitech` |
| 08 | `project-ziris` / Ziris | 62–70 | `#project-ziris` |
| 09 | `skills-public-trace` / Compétences · trace publique | 70–80 | `#skills-public-trace` |
| 10 | `career` / Parcours | 80–89 | `#career` |
| 11 | `ground-track` / Territoires | 89–97 | `#ground-track` |
| 12 | `open-channel` / Révélation · Open Channel | 97–107 | `#open-channel` |

## 4. Stations et mapping céleste

Le mapping géométrique est verrouillé sans attribuer de personnalité aux projets. Avec l'ordre candidate alphabétique, A–F correspondent aux chapitres 03–08 ; si les dates imposent un ordre chronologique, seule cette correspondance change :

| Station | Repère | Règle de cadrage |
|---|---|---|
| A | Lune | limbe lisible, plateforme identique |
| B | Mars | disque hors panneau, accent projet inchangé |
| C | Jupiter | diamètre apparent contenu, média toujours dominant |
| D | Saturne | anneaux hors zone texte, aucune plateforme plus grande |
| E | Uranus | orientation reconnaissable, lumière identique |
| F | Neptune | cobalt distinct du firmament par valeur, pas par glow |

Mercure, Vénus et le Soleil restent visibles comme repères de monde mais ne deviennent pas des belvédères. L'affectation des six noms de projets à A–F suit l'ordre chronologique une fois les dates validées ; sinon l'ordre alphabétique. Elle ne suit jamais la taille ou le prestige supposé du projet.

## 5. Parité temporelle des projets

La base de chaque fenêtre est exactement **8 secondes** :

- 0–1,5 s : approche, aucun texte important ;
- 1,5–7,0 s : caméra immobile, média et panneau visibles ;
- 2,0–6,5 s : preuve stable au moins 4,5 s ;
- 7,0–8,0 s : retrait du panneau puis départ.

Les micro-chorégraphies autorisées concernent seulement le média : progression vidéo verticale, balayage d'une page desktop ou apparition d'un schéma. Elles ne modifient ni aire utile, ni durée, ni contraste, ni CTA.

## 6. Poses et raccords

Chaque chapitre livre quatre poses :

1. `entry` — dernière image du déplacement précédent ;
2. `settled` — cadrage immobile avant le texte ;
3. `reading` — contenu complet et focus DOM disponible ;
4. `exit` — contenu retiré, départ possible.

Familles de raccord autorisées :

- **ligne** : un bord, joint ou horizon conserve sa tangente ;
- **cercle** : corps céleste ou germe conserve centre et diamètre apparent ;
- **panneau** : une surface opaque remplace une autre sans déplacer le regard.

Tout autre raccord exige une annotation et un visa ChatGPT. Un raccord ne peut jamais masquer un chargement par un écran noir.

## 7. Pause, approfondissement et reprise

- `Pause` fige caméra, média décoratif et horloge audio ; le texte reste sélectionnable ;
- `Approfondir` pause d'abord, mémorise chapitre et focus, puis ouvre la route d'étude de cas ;
- au retour : même station, état `reading`, toujours en pause, focus restitué au bouton `Approfondir` ;
- changement d'onglet : pause immédiate ; aucun son ni mouvement ne reprend automatiquement ;
- fragment partagé : image `settled`, contenu visible, bouton `Démarrer/Reprendre` ;
- `Suivant/Précédent` retire le texte, effectue le raccord, puis affiche le nouveau contenu après arrêt ;
- `Échap` quitte la visite vers la vue libre stable, jamais vers une page vide.

## 8. Storyboard reduced motion

Le mode réduit est une séquence manuelle de **15 tableaux** : Accueil, Base 237, SOURCE-code, SOURCE-germe, SOURCE-promenade, six projets dans le même ordre, Compétences/Comète, Parcours, Territoires et Final. Les trois tableaux SOURCE restent distincts ; la comète devient une carte datée ; aucune caméra automatique n'existe.

Navigation : `Précédent`, `Suivant`, index de chapitres, `Approfondir` et `Quitter`. Les éventuels fondus d'opacité durent 120 ms maximum et peuvent être supprimés sans perte.

## 9. Critères image par image

Les captures obligatoires sont : 0, 3, 6 et 10 s ; chaque arrivée de chapitre ; les six états `reading` ; la comète ; Ground Track ; révélation ; final. Pour chacune : viewport, timestamp, état de mouvement, masque de luminance, actif réel visible, texte rendu, contraste, surface média, surface quasi-noire et présence des contrôles sont consignés.

