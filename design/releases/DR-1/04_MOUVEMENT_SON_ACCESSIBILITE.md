# 04 — Mouvement, son et accessibilité

## 1. Principe commun

Le mouvement et le son servent la compréhension du même récit ; ils ne transportent jamais seuls une information. Le visiteur doit pouvoir s'arrêter, lire, revenir, refuser le son, réduire le mouvement ou perdre WebGL sans perdre un fait, une preuve ou une action.

Exception d'entrée clairement bornée : sur l'accueil, le teaser visuel peut jouer silencieusement sans bloquer les CTAs. Il ne met pas la visite guidée en état `playing`. Sur `/visite` direct, l'image 0 reste fixe. Dans tous les cas, aucun son ni chapitre guidé ne commence avant le geste d'entrée.

## 2. Vocabulaire de mouvement

### Courbes et durées

| Token | Durée | Courbe | Usage |
|---|---:|---|---|
| `motion.instant` | 0 ms | linéaire | changement requis en reduced motion |
| `motion.focus` | 120 ms | `cubic-bezier(0.2, 0, 0, 1)` | focus, hover, icône |
| `motion.interface` | 240 ms | `cubic-bezier(0.2, 0, 0, 1)` | panneau, disclosure, feuille basse |
| `motion.luminance` | 600 ms | `cubic-bezier(0.16, 1, 0.3, 1)` | montée solaire, jamais sous 400 ms |
| `motion.approach` | 1500 ms | `cubic-bezier(0.65, 0, 0.35, 1)` | approche d'un projet |
| `motion.chapter` | 2000–2500 ms | même courbe | liaisons longues, durée annotée par plan |
| `motion.reveal` | 3000 ms | `cubic-bezier(0.45, 0, 0.2, 1)` | élévation finale vers la vue haute |

Aucun spring, bounce, overshoot ou elastic n'entre dans la grammaire. Les transitions de panneaux ne compensent jamais un retard de chargement.

### Règles d'orchestration

- le panneau sort avant le mouvement ;
- la caméra atteint `settled` avant l'entrée du nouveau panneau ;
- le texte apparaît en un bloc ou deux niveaux maximum, sans cascade lettre par lettre ;
- les médias non essentiels s'arrêtent hors écran et quand l'onglet est masqué ;
- la timeline et le son se mettent en pause ensemble ;
- un seek place immédiatement la scène sur une pose stable, puis reprend seulement sur action ;
- la sortie d'une étude de cas ne relance jamais automatiquement la visite.

## 3. Reduced motion

Si `prefers-reduced-motion: reduce` est actif au chargement, la visite démarre en storyboard manuel. Si le réglage change pendant la visite, l'état courant est figé, la position de chapitre est conservée et le prochain mouvement devient une coupe vers le tableau correspondant.

Autorisé :

- changement instantané ;
- fondu d'opacité de 120 ms maximum, non essentiel ;
- lecture vidéo seulement sur action distincte, avec pause visible.

Interdit :

- caméra automatique, parallaxe, traînée, convergence de jetons, scroll pilotant une timeline ;
- animation nécessaire pour comprendre SOURCE, la comète ou la révélation ;
- suppression d'un chapitre pour respecter le mode réduit.

## 4. Choix sonore et comportement

Le panneau s'intitule **« Comment souhaitez-vous entrer ? »**. Il contient :

- `Entrer avec le son — recommandé` ;
- `Continuer en silence` ;
- `Fermer et rester ici`.

Les deux choix principaux ont même taille, contraste et importance. Le qualificatif « recommandé » explique l'intention artistique ; il ne constitue pas un dark pattern. Le choix silencieux est mémorisé pour la session et n'est pas redemandé.

Après le premier choix sonore, l'initialisation audio, la lecture et la caméra peuvent démarrer dans la même chaîne de geste. Si le navigateur bloque l'audio, la caméra et le récit continuent ; le player affiche `Activer le son` sans modale.

## 5. Architecture créative du mix

Les cinq couches créatives maximales utilisent seulement deux bus de contrôle runtime :

| Bus | Sources possibles | Règle |
|---|---|---|
| `voice` | voix réelle de Russel | jamais de chevauchement de phrases ; priorité du récit |
| `bed` | musique, ambiance Base 237, feutre/clavier, impulsion solaire | sources prémixées par chapitre ou sommées vers le même bus ; aucun contrôle visiteur par stem |

La musique et l'ambiance ne nécessitent donc pas cinq bus. Si un chapitre exige un mix indépendant supplémentaire, il est prémixé avant publication ou fait l'objet d'un ADR, sans élargir silencieusement le runtime.

### Cibles

- voix : environ **−16 LUFS** intégrés ;
- true peak global : **≤ −1 dBTP** ;
- sous la voix, le bus `bed` baisse suffisamment pour garder chaque mot intelligible ;
- pendant la lecture d'une preuve dense, la musique disparaît ;
- fondu de fond : **180 ms** nominal, dans la plage contractuelle 150–250 ms ;
- voix : aucune crossfade ; rampe anti-clic **12 ms** au bord d'un segment ;
- aucun son à chaque pas ; ponctuations rares et reliées à un geste réel ;
- onglet masqué : son arrêté, reprise manuelle.

### Budgets

- premier segment audible : ≤ 450 Ko transférés ;
- visite complète, langue active : ≤ 2,5 Mo ;
- audio PCM actif : cible ≤ 28 Mio ;
- chapitres décodés juste à temps ;
- sous-titres WebVTT et transcript HTML disponibles indépendamment de la lecture.

## 6. Cue sheet candidate

Cette cue sheet fixe les intentions, pas une musique non encore autorisée.

| Chapitre | Voix | Bed | Ponctuation | État sans source |
|---|---|---|---|---|
| Ouverture | aucune par défaut | silence avant consentement | feutre au replay sonore | silence complet |
| Base 237 | phrase personnelle validée | matin réel très bas | aucune | texte silencieux |
| SOURCE | explication courte possible | lit tonal minimal | clavier isolé + impulsion | texte + silence |
| Six projets | une phrase maximum par station ou aucune | musique baissée puis coupée sur preuve | aucune hiérarchie sonore | lecture silencieuse |
| Compétences/comète | aucune nécessaire | lit continu discret | impulsion unique | silence |
| Parcours/Ground Track | narration possible | ambiance sous la voix | aucune | texte silencieux |
| Final | phrase réelle si enregistrée | résolution humaine | feutre très léger possible | portrait + texte |

Toute ligne voix ou musique reste `BLOCKED SOURCE` tant que Russel n'a pas validé voix, texte, auteur, licence et crédit.

## 7. Structure DOM et ordre de lecture

Ordre global :

1. lien `Aller au contenu` ;
2. en-tête et identité ;
3. contenu du chapitre ou de la route ;
4. actions relatives au contenu ;
5. player de visite ;
6. pied de page et sources.

Le Canvas est décoratif, `aria-hidden`, sans élément focusable. Le nom, le chapitre, les faits, le média, les légendes et toutes les actions existent dans le DOM. L'ordre DOM suit le sens de lecture même lorsque la composition visuelle place le portrait ou le média avant le texte.

## 8. Contrats des composants interactifs

### Choix sonore et Console (`dialog` natif)

- nom accessible par titre visible ;
- focus initial explicite sur le premier choix, jamais sur `Fermer` ;
- fermeture visible et touche Échap ;
- focus confiné pendant l'ouverture ;
- arrière-plan inerte ;
- retour du focus au déclencheur ;
- aucun clic extérieur comme seule fermeture ;
- test NVDA + Firefox et VoiceOver + Safari.

### Player

- barre opaque basse, jamais glassmorphism ;
- boutons directs : `Pause/Reprendre`, chapitre et progression ;
- menu disclosure : précédent/suivant, quitter, volume, mute, sous-titres, transcript, Console, Approfondir, Résumé ;
- `button[aria-expanded]`, jamais `role="menu"` ;
- libellé vocal complet de la progression, sans annonces à chaque seconde ;
- commandes 44 × 44 px minimum, focus non masqué par la barre.

### Raccourcis

- accès principal Console : bouton visible ;
- `Ctrl/⌘ + Maj + K` peut être proposé, remappable et désactivable ;
- `~` reste désactivé tant que l'utilisateur ne l'a pas explicitement activé ;
- aucun raccourci à caractère unique global actif par défaut.

### Approfondir et retour

- l'action annonce le titre du projet ;
- la visite est mise en pause avant navigation ;
- le retour retrouve le même chapitre, en pause ;
- focus restitué au bouton `Approfondir` correspondant ;
- le lecteur d'écran ne reçoit aucune annonce de mouvement décoratif.

## 9. Contenu accessible

- un seul `h1` par route ; titres sans saut de niveau ;
- landmarks `header`, `nav`, `main`, `aside` seulement si nommé, `footer` ;
- médias projet : texte alternatif décrivant l'information utile, pas l'apparence entière ;
- décor, planètes et matières : alt vide ou absents de l'arbre ;
- code : sélectionnable, copiable, langue indiquée et explication humaine adjacente ;
- comète : carte factuelle datée, aucune région `aria-live` ;
- erreurs : message lié au contrôle concerné ; aucune annonce répétée ;
- nouvelle fenêtre : annoncée dans le nom accessible ou le texte adjacent ;
- transcript structuré par chapitre avec locuteur et repères utiles, sans timecodes bavards.

## 10. Clavier et focus

Parcours de référence : accueil → choix son → visite → pause → menu chapitres → projet → Approfondir → retour → Console → résumé → contact.

Critères :

- aucune trappe hors dialogue modal ;
- focus visible avec contraste ≥ 3:1 et surface perceptible ;
- ordre stable après chargement de l'immersion ;
- focus jamais envoyé dans le Canvas ;
- pause atteignable avant toute commande secondaire ;
- 200 % de zoom sans masquage par le player ;
- largeur 320 px sans défilement horizontal de page ;
- clavier logiciel mobile ne masque ni champ Console, ni résultat, ni fermeture.

## 11. Matrice de test avant visa

| Axe | Minimum |
|---|---|
| Clavier | Chrome, Firefox, Safari ; parcours entier |
| Lecteur d'écran | NVDA + Firefox ; VoiceOver + Safari ; TalkBack + Chrome fortement attendu sur Galaxy A14 |
| Mouvement | préférence avant chargement puis bascule en visite |
| Zoom/reflow | 200 % desktop ; 320 px ; orientation mobile |
| Contraste | texte, grands textes, UI et focus sur chaque token final |
| Audio | autorisé, refusé, bloqué navigateur, mute, onglet masqué, reprise |
| Résilience | WebGL coupé, JS incomplet, média absent, snapshot périmé, perte réseau après chargement |

Le démarrage à froid hors ligne n'est pas promis en V1 : sans PWA/service worker, seul le contenu déjà chargé peut rester disponible. Toute promesse supplémentaire exige un ADR.

