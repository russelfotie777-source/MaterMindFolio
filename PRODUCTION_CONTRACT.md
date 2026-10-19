# CONTRAT DE PRODUCTION — HORIZON 237 / TRACE SOLAIRE

**ChatGPT / Codex ⇄ Claude Code ⇄ Russel**  
**Version :** R1 — arbitrage ChatGPT de la revue Claude, 19 octobre 2026  
**Statut :** **GO RUSSEL DONNÉ — G1 AUTORISÉ, SANS CODE** (R1 signée par ChatGPT et Claude, GO de Russel le 19 octobre 2026) — **aucun scaffold ni code applicatif avant `READY FOR CODE`**

Ce fichier transforme le plan créatif de `DISCUSSION.md` en contrat exécutable. Il fixe les technologies, les frontières de responsabilité, les livrables, les contrôles et l'ordre de production. Il ne remplace pas la direction artistique : il empêche sa dilution pendant l'intégration.

## 0. Comment ce contrat devient exécutoire

Trois validations distinctes sont nécessaires :

- **ChatGPT / Codex** signe la direction artistique, les interfaces, le mouvement et la fidélité visuelle ;
- **Claude Code** signe l'architecture, le runtime, la 3D, l'accessibilité technique, la sécurité, les performances et le déploiement ;
- **Russel** signe les faits, les droits, la voix personnelle, le périmètre et le GO de production.

Ordre d'autorité en cas de contradiction :

1. décision explicite la plus récente de Russel ;
2. section 7 de `DISCUSSION.md` pour le concept et l'expérience ;
3. présent contrat pour l'architecture et l'exécution ;
4. ADR daté et signé pour toute modification ultérieure.

Une absence de réponse n'est jamais une approbation. Claude répond dans la section 13 avec les identifiants `Txx` qu'il accepte ou conteste. Après accord explicite sur R1, le statut devient `READY FOR RUSSEL GO`. Le GO écrit de Russel autorise **G1 : contenus et Design Release, toujours sans code applicatif**. Le scaffold et le code ne commencent qu'après `G1 PASS`, quand le statut devient `READY FOR CODE`.

### État des validations

- [x] Concept HORIZON 237 accepté par les deux agents.
- [x] Round 9 et chaîne `SOURCE → IMPULSION → TRACE` acceptés par Claude.
- [x] Quatre corrections de Claude en section 7.21 intégrées au plan.
- [x] Proposition de stack et de responsabilités R0 signée par ChatGPT.
- [x] Revue technique R0 de Claude consignée en section 13.
- [x] Arbitrage R1 de ChatGPT consigné et intégré.
- [x] Relecture et signature explicite de Claude sur R1.
- [ ] Réponses et actifs minimums de Russel disponibles.
- [x] GO écrit de Russel (19 octobre 2026, inscrit par Claude à sa demande ; portée G1 sans code).
- [ ] `G1 PASS` et statut `READY FOR CODE`.

## 1. Invariants non négociables

- Le HTML utile arrive avant le Canvas ; identité, projets, preuves, CV et contact fonctionnent sans WebGL.
- La 3D est une amélioration progressive, jamais la seule navigation ni l'unique source d'information.
- Les six projets ont la même importance, le même contrat de contenu et des temps de présence équitables.
- Aucun prototype jetable : chaque lot est une tranche de production conservée derrière un état incomplet ou un feature flag interne.
- Le monde reste lumineux, humain, minéral et cobalt ; aucun espace noir dominant, look Spline, template shadcn ou gradient SaaS.
- SOURCE utilise uniquement du code autorisé, relié à un SHA et contrôlé contre les secrets.
- La comète utilise un snapshot statique généré en CI ; aucune API GitHub n'est appelée par le navigateur.
- La Console exécute une grammaire fermée ; aucun shell, `eval`, accès fichier ou URL libre.
- Le son commence seulement après le choix utilisateur. La musique suit le goût personnel de Russel : mélodie japonaise émotionnelle, originale ou licenciée, jamais copiée d'un anime.
- WCAG 2.2 AA, budgets de la section 7.13, fallbacks mobile/reduced-motion/sans WebGL et droits des actifs sont des vétos objectifs.

## 2. Architecture cible

```text
Contenus validés ──> Server Components Next.js ──> HTML indexable et accessible
       │                         │
       │                         └──> îlot client Visite
       │                                  ├── contrôleur fini + horloge
       │                                  ├── player / Console DOM
       │                                  ├── GSAP Core
       │                                  ├── Canvas R3F / Three.js
       │                                  └── moteur Web Audio natif
       │
       └──> build/CI ──> SOURCE tokenisé + snapshot GitHub + actifs optimisés
```

La frontière client est placée au plus bas. Les pages, métadonnées, études de cas, résumé recruteur et fallbacks restent des Server Components ou du HTML statiquement généré. Le Canvas, le contrôleur et l'audio sont chargés séparément.

## 3. Décisions technologiques proposées à Claude

| ID | Domaine | Décision à ratifier | Pourquoi |
|---|---|---|---|
| **T01** | Runtime | **Node.js 24 LTS**, dernier patch de sécurité disponible au scaffold ; **pnpm** avec version exacte dans `packageManager` et lockfile commité | Runtime LTS reproductible, installation figée |
| **T02** | Web | **Next.js 16 App Router + React 19 + TypeScript strict**, tuple exact Next/React/React DOM verrouillé au scaffold | SSR/RSC, routes, métadonnées et îlots clients dans une seule base |
| **T03** | Rendu | Server Components par défaut ; Client Components uniquement aux frontières interactives ; scène importée dynamiquement | Empêche Three.js d'alourdir le premier rendu |
| **T04** | Style | CSS global de fondation + **CSS Modules**, custom properties, cascade layers et container queries ; aucun framework CSS | DA propre, bundle prévisible, aucun style IA par défaut |
| **T05** | UI accessible | **HTML natif seul en V1** : `<dialog>`, disclosure APG, `<input type="range">`, boutons et liens sémantiques ; React Aria absent du baseline | Les widgets requis sont simples ; 44,9 Ko Brotli mesurés sont réalloués à l'expérience sans sacrifier les tests manuels |
| **T06** | 3D | **Three.js + React Three Fiber v9 stable + Drei importé au cas par cas** ; WebGL2 comme cible | Branche stable compatible React 19 ; aucune alpha dans le chemin critique |
| **T07** | WebGPU | **Exclu de V1** ; R3F v10 alpha et renderer WebGPU non utilisés | Évite une seconde surface de rendu et de test |
| **T08** | Animation | **GSAP Core uniquement**, timeline à labels ; aucun ScrollTrigger, Lenis, Framer Motion ou React Spring | Pause, reprise et saut de chapitre précis sans animation concurrente |
| **T09** | État visite | `zustand/vanilla` comme store minimal + réducteur fini TypeScript ; GSAP ne possède jamais l'état métier | Partage DOM/Canvas sans rerendre React à chaque frame |
| **T10** | Contenu | Faits en JSON + **Zod** serveur ; copy en **CommonMark restreint**, analysée au build par `mdast-util-from-markdown`/micromark et rendue par composants serveur internes ; aucun CMS, MDX, HTML brut ou `dangerouslySetInnerHTML` | Les faits restent stricts, tandis que les textes longs et leurs diffs restent lisibles pour Russel, sans exécution de contenu |
| **T11** | SOURCE | **Shiki au build uniquement** ; sortie tokenisée statique et manifeste allowlisté | Vrai code lisible sans surligneur livré au navigateur |
| **T12** | Modèles | Blender → GLB/glTF 2.0 → glTF-Transform ; **Meshopt par défaut** ; textures WebP dans le premier segment ; KTX2/Basis absent du baseline et réintroduisible seulement par ADR mesurée après G3 | Évite 212,2 Ko de transcodeur initial et le conflit CSP actuel, sans interdire une optimisation ultérieure prouvée |
| **T13** | Carte | Globe Three.js interne + masques WebP Natural Earth précalculés + petit JSON de repères/arcs validés | Aucun SDK cartographique, token, frontière politique ou dépendance narrative externe |
| **T14** | Audio | **Web Audio API comme moteur unique** : chapitres décodés juste à temps, deux bus `GainNode`, horloge audio maîtresse, WebVTT + transcript HTML | Synchronisation et ducking précis sans dépendance ni double moteur de lecture |
| **T15** | Images/vidéos | Pipeline unique Sharp/FFmpeg au build ; dérivés hashés AVIF/WebP servis par `<picture>`/`srcset` ; clip en MP4 H.264 High, `faststart`, `yuv420p`, sans audio ; `next/image` non utilisé en V1 | Les octets mesurés sont les octets servis ; aucune seconde optimisation runtime ni ambiguïté de profil vidéo |
| **T16** | Langues | **BLOQUÉ PAR Q6** : si FR + EN, `app/[locale]` + **next-intl** ; si FR seulement, aucune route préfixée ni dépendance i18n. Le choix est gelé au scaffold ; toute modification exige un ADR et une migration de routes | Respecte la décision de route de la section 7.6 sans payer une abstraction inutile |
| **T17** | Tests | Vitest ciblé, Testing Library, Playwright Chromium/WebKit/Firefox, `@axe-core/playwright`, Lighthouse CI et comparaisons visuelles déterministes | Couvre logique, parcours, accessibilité, navigateurs et régressions visuelles |
| **T18** | CI/CD | GitHub Actions pour contrôles et snapshot GitHub ; PR protégées et approuvées humainement ; previews Vercel par PR ; production Vercel depuis `main` protégée | Une seule chaîne de preuve, sans push direct, auto-merge ni GitHub App obligatoire en V1 |
| **T19** | Contact V1 | Liens directs vérifiés et copie d'adresse ; **pas de formulaire serveur en V1** | Évite stockage, spam, fournisseur email et données personnelles non nécessaires |
| **T20** | Mesure V1 | Aucun analytics tiers au lancement ; métriques laboratoire. RUM seulement après ADR confidentialité et validation Russel | Aucune collecte implicite ni poids avant décision explicite |
| **T21** | Qualité du code | ESLint + Prettier + TypeScript strict ; aucun `any` non justifié ; pas de hooks Git obligatoires, CI autoritaire | Règles simples, identiques pour humains et agents |
| **T22** | Dépendances | Versions exactes et lockfile ; toute nouvelle dépendance exige poids client, licence, maintenance, raison et alternative native | Empêche la dérive du bundle et de la surface de sécurité |

### Dépendances explicitement refusées en V1

- Tailwind, shadcn/ui, MUI et bibliothèque d'icônes importée en bloc ;
- Spline runtime, Cesium, Mapbox, Google Photorealistic 3D Tiles ;
- R3F alpha, WebGPU, moteur physique, path tracing, bloom ou post-traitement global ;
- Lenis, ScrollTrigger, Framer Motion, React Spring ;
- XState, xterm.js, interpréteur de shell, React Aria Components dans le baseline ;
- Howler, Tone.js ;
- KTX2/Basis avant ADR et mesure terrain favorables ;
- CMS, base de données, authentification, React Query ;
- SDK GitHub ou surligneur syntaxique côté client ;
- Storybook, PWA, analytics et monitoring tiers avant ADR dédiée.

Une dépendance refusée peut revenir uniquement si une mesure démontre qu'elle résout un besoin impossible à satisfaire proprement avec la stack retenue.

### 3.1 Verrous d'exécution R1

1. **CSP et en-têtes.** La génération statique est conservée. Next.js est épinglé et son option SRI expérimentale est activée pour ajouter l'intégrité aux scripts ; son caractère expérimental est accepté uniquement parce que **G2 bloque** au moindre échec. La politique de production part de :
   - `default-src 'none'` ;
   - `script-src 'self' 'wasm-unsafe-eval'` ;
   - `worker-src 'self' blob:` ;
   - `style-src-elem 'self'` et `style-src-attr 'none'` ;
   - `img-src 'self' blob: data:` ; `font-src 'self'` ; `media-src 'self'` ;
   - `connect-src 'self'` ; `manifest-src 'self'` ;
   - `object-src 'none'` ; `frame-src 'none'` ; `frame-ancestors 'none'` ;
   - `base-uri 'none'` ; `form-action 'none'` ; `upgrade-insecure-requests` en production.

   Aucun attribut `style`, `cssText` ou `<style>` injecté n'est autorisé. Les propriétés animées sont affectées individuellement par CSSOM, comportement permis par CSP 3, puis testées réellement. Shiki sort des classes colorées par la DA. G2 exige zéro `securitypolicyviolation` sur toutes les routes et les trois moteurs Playwright ; tout échec impose un ADR, pas un élargissement silencieux vers `'unsafe-inline'` ou `'unsafe-eval'`.

2. **Horloge et rendu uniques.** R3F v9 fonctionne en `frameloop="never"` et est avancé par le ticker GSAP unique. Avec son, la position stable vient de `AudioContext.currentTime` et de l'origine du chapitre ; sans son, de `performance.now()`. Le ticker s'arrête hors lecture et lorsque l'onglet est masqué. G3 vérifie qu'une seule **boucle de rendu applicative** pilote la scène et mesure la dérive après pause, seek et changement de chapitre ; le contrat ne prétend pas interdire les callbacks internes du navigateur.

3. **Compatibilité React/Next/R3F.** Le tuple exact installé doit satisfaire les peers officiels de Next et de R3F v9. La plage React `>=19 <19.4` relevée par Claude est une mesure datée de R0, pas un invariant éternel. La CI exige une seule version résolue de React/React DOM et bloque tout écart au tuple G0. Next, React, React DOM et R3F ne montent que dans une même PR, avec build, hydratation du Canvas et parcours complet sur trois navigateurs.

4. **Tokens.** `design/contracts/tokens.json` suit la spécification DTCG 2025.10 et déclare cette version. Un script TypeScript interne déterministe produit `src/styles/tokens.css`, marqué généré ; aucune dépendance Style Dictionary. La CI échoue si la régénération diffère du fichier commité. Tout changement de version DTCG exige un ADR.

5. **Adaptation GPU.** Aucun benchmark n'est téléchargé au runtime. DPR initial maximal : `1.5` sur mobile et `2` sur desktop. Après une fenêtre de chauffe documentée, un moniteur local à hystérésis baisse d'abord le DPR, puis les effets non essentiels, uniquement à une frontière de chapitre ; il ne remonte pas de niveau pendant la visite. Les preuves et médias utiles ne changent jamais de niveau.

6. **Appareils physiques.** Playwright `_android`, officiellement expérimental, peut piloter le parcours mais ne constitue pas la mesure GPU. Sur Galaxy A14 4 Go : Chrome DevTools/Performance sur appareil réel, instrumentation `requestAnimationFrame` et trois passages de visite. Sur iPhone : Safari Web Inspector et relevé manuel. Appareil, OS, navigateur, GPU, batterie, température, trace et JSON de synthèse sont consignés dans `docs/quality/**`. Les diffs WebGL ne bloquent que sur un runner GPU épinglé ; en CI ordinaire, le Canvas est masqué.

7. **Node, pnpm et Vercel.** `.node-version` fixe le patch Node 24 utilisé localement et en CI ; `engines.node` et Vercel restent sur `24.x`, puisque Vercel garantit le major et applique ses patchs de sécurité. Le build consigne `node -v`. `packageManager` fixe pnpm avec son intégrité, le lockfile est commité, `ENABLE_EXPERIMENTAL_COREPACK=1` est configuré sur Vercel et `onlyBuiltDependencies` est une liste blanche. Toute divergence du gestionnaire ou du lockfile bloque G0.

8. **Mises à jour de sécurité.** Dependency graph, Dependabot alerts et security updates sont activés pour pnpm **et GitHub Actions** ; aucun auto-merge. La CI audite le lockfile complet — dépendances de build comprises — et bloque les niveaux high/critical, avec rapport production séparé et sans ignorer les erreurs du registre. Une exception GHSA exige portée, risque, mitigation, owner et date d'expiration. L'audit couvre les vulnérabilités connues ; il ne prouve jamais l'absence de faille.

9. **Lint et TypeScript.** ESLint CLI en flat config avec les configurations Next adaptées à la version épinglée et Prettier ; aucun `next lint`. TypeScript active `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes` et `noImplicitOverride`.

10. **Masters privés.** Les masters restent hors Git dans au moins deux copies indépendantes, dont une sauvegarde chiffrée hors de l'appareil principal ; une restauration est testée avant effacement des cartes ou sources. Russel nomme le propriétaire de cette sauvegarde. `assets/registry.json` ne contient aucun chemin privé, EXIF/GPS ou nom sensible : seulement identifiant opaque, SHA-256 d'intégrité, source, droit, statut, transformations, dérivés et date de vérification. Le SHA atteste l'intégrité, pas les droits. Le pipeline local ne commit que les dérivés approuvés.

11. **Globe.** Les masses terrestres Natural Earth 110m, domaine public, sont rasterisées au build en masques WebP alpha de 1024 × 512 sur mobile et 2048 × 1024 sur desktop. Aucun GeoJSON Natural Earth ni frontière politique n'est livré au client : seulement un petit JSON de repères et arcs validés. Version, source et checksum figurent au registre et au colophon.

12. **Zod et Markdown hors client.** Zod et le parseur Markdown vivent dans des modules `server-only`. La CI inspecte les chunks clients et bloque leur présence. La copy est transformée en AST au build, validée sur une allowlist de nœuds, puis rendue en éléments React par un composant serveur interne — jamais en chaîne HTML injectée.

### 3.2 Contrat des primitives natives et du Markdown

- Tout `<dialog>` possède titre accessible, focus initial explicite, fermeture visible, Échap, confinement modal, arrière-plan inerte et restitution du focus. Tests obligatoires : clavier, NVDA + Firefox et VoiceOver + Safari. React Aria ne revient par ADR que si un défaut reproductible ne peut être corrigé proprement en interne.
- Le menu textuel du player suit le motif disclosure (`button[aria-expanded]` + liste d'actions ordinaires), jamais `role="menu"`.
- Les nœuds Markdown autorisés sont : `root`, `text`, `paragraph`, `emphasis`, `strong`, `list`, `listItem`, `inlineCode` et `link`. Tout `html`, image, titre, bloc de code, citation, table, MDX, frontmatter ou extension GFM est rejeté.
- Les liens de copy acceptent seulement `https:`, les chemins relatifs/root-relative et les fragments. Les coordonnées `mailto:` vivent dans les faits validés, pas dans la copy libre.
- Chaque fichier de copy est plafonné à 32 Kio par langue et projet. Une Content Release fournit le commit, un aperçu HTML/PDF lisible et le visa de Russel ; personne ne lui demande de signer uniquement un diff JSON ou Markdown.

## 4. Contrat du contrôleur de visite

États principaux :

```text
idle → sound-choice → loading → playing ⇄ paused → deep-dive → completed
```

Branches et erreurs : `reduced-motion`, `audio-blocked`, `webgl-unavailable`, `offline`, `error`.

Événements publics : `START`, `CHOOSE_SOUND`, `READY`, `PAUSE`, `RESUME`, `SEEK_CHAPTER`, `OPEN_CASE`, `CLOSE_CASE`, `EXIT`, `TAB_HIDDEN`, `RETRY`.

Règles :

- le store détient mode, chapitre, progression stable, préférences et point de reprise ;
- GSAP interpole seulement poses caméra, valeurs matérielles et transitions DOM ; ses labels correspondent exactement aux chapitres ;
- R3F est avancé par l'unique boucle de rendu applicative définie en 3.1 ; hors lecture, la scène ne rend qu'à la demande ;
- l'audio est segmenté par chapitre, avec fichiers complets décodés juste à temps : chapitre courant + suivant, précédent libéré ;
- un chapitre dure au plus 20 s ; voix mono + fond stéréo à 48 kHz donnent un pic PCM cible **≤ 28 Mio** pour deux chapitres ; le calcul exact est consigné au build ;
- seul le fond sonore peut recevoir un fondu à puissance constante de 150 à 250 ms ; la voix ne se chevauche jamais et reçoit seulement un fade anti-clic de 5 à 20 ms ;
- après pause, reprise ou saut, la timeline visuelle se projette depuis l'horloge audio, puis un test mesure sa dérive ;
- `navigator.audioSession`, lorsqu'il existe, est une amélioration feature-detectée et jamais une condition de fonctionnement ;
- ouvrir une étude de cas arrête la visite ; la fermeture revient au même chapitre, toujours en pause ;
- un fragment d'URL représente un chapitre stable, jamais une milliseconde ou une position de caméra ;
- `visibilitychange` met caméra et audio en pause ; aucune reprise sonore surprise au retour ;
- reduced motion utilise le même état métier mais une vue fixe différente, pas une deuxième application.

## 5. Contenu, SOURCE et activité GitHub

### Contrats de données

- six fichiers de faits projet respectent le même schéma et la même profondeur ; chaque langue de copy référence des identifiants de section stables ;
- les faits et les textes éditoriaux sont séparés : `content/facts/**` et `content/copy/**` ;
- tout champ factuel possède source, date de validation, visibilité publique et propriétaire du droit ;
- une valeur absente reste absente ; aucun lorem, chiffre plausible ou architecture supposée en production.
- la CI valide la parité des sections obligatoires entre langues, les références de faits et les liens ;
- `CR-0` désigne le minimum publiable et visé des six projets ; aucune page projet ne passe G4 sans sa Content Release.

### SOURCE

Le manifeste contient : dépôt, branche, chemin, lignes, SHA, licence, autorisation, date, empreinte de l'extrait et résultat du contrôle anti-secret. Le build échoue si l'extrait ne correspond plus au SHA ou contient un motif interdit.

### Comète

- JSON suivi dans le dépôt ;
- génération hebdomadaire ou à la demande par GitHub Actions depuis une allowlist, dans une branche datée ;
- validation du schéma avant écriture ;
- ouverture d'une PR avec `GITHUB_TOKEN` aux permissions minimales ; Russel approuve les workflows et le contenu avant merge, sans auto-merge ;
- le bot et le fichier généré sont exclus de la donnée présentée ;
- échec de synchronisation : aucun faux commit et conservation automatique du dernier snapshot daté ;
- aucun Octokit, token GitHub ou appel réseau équivalent dans le client.

Une GitHub App dédiée n'est pas requise en V1. Elle ne peut revenir que par ADR si Russel exige un renouvellement zéro-touch et accepte la clé privée et les permissions supplémentaires.

## 6. Pipeline des actifs

| Actif | Source | Production | Sortie publique |
|---|---|---|---|
| Portrait | Photo réelle validée | cadrage et étalonnage manuels | AVIF/WebP + dimensions explicites |
| Main au feutre | Master 4K/60 i/s hors dépôt public | montage 2,5 s cible à 30 i/s, retrait audio, compression | MP4/H.264 High + `faststart` + `yuv420p`, poster AVIF, inclus dans les 650 Ko mobile |
| Firmament cobalt | Photos chevauchées ou panorama réel | assemblage et raccord manuel/procédural | panorama optimisé, aucun remplissage génératif |
| Promenade/astres | Blender ou géométrie contrôlée | GLB, LOD, Meshopt, matériaux limités | segments chargés à la demande |
| Textures | photos/scans/licences validés | nettoyage EXIF, atlas WebP, mémoire RGBA + mipmaps calculée | dimensions, poids transféré et mémoire active consignés |
| Interfaces projet | captures autorisées | recadrage sans falsification, masquage validé | AVIF/WebP/vidéo avec poster |
| Musique | œuvre humaine originale ou licenciée | master émotionnel inspiré des références de Russel, sans imitation | chapitres AAC-LC `.m4a` + Opus de secours, un seul format téléchargé |
| Voix/terrain | enregistrements de Russel | nettoyage, montage, normalisation | voix mono segmentée + WebVTT + transcript |

Les originaux contenant EXIF, signature, documents, voix brute ou éléments tiers restent hors dépôt public. `public/media/approved/**` ne contient que des dérivés validés.

Sharp produit des variantes 480, 768, 1080 et 1600 px seulement lorsque la source et l'usage les justifient. `<picture>` déclare `srcset`, `sizes`, `width` et `height` ; le portrait LCP reçoit `fetchpriority="high"` et un preload unique. Les noms incluent un hash de contenu. Comme Next sert normalement `public/` avec une politique prudente, `Cache-Control: public, max-age=31536000, immutable` est configuré uniquement sur ce chemin hashé et vérifié sur la preview Vercel à G2.

## 7. Budgets techniques internes

Ces sous-budgets vivent **à l'intérieur** des plafonds de `DISCUSSION.md`, jamais en supplément.

| Ressource | Seuil cible |
|---|---:|
| JavaScript client du socle | **≤ 180 Ko Brotli** |
| CSS total initial | **≤ 30 Ko Brotli** |
| Polices initiales | **≤ 100 Ko transférés** |
| Portrait LCP initial | **≤ 150 Ko** |
| Îlot immersif mobile, JS inclus | **≤ 290 Ko Brotli** |
| Premiers actifs 3D mobile, panorama inclus | **≤ 200 Ko transférés** |
| Clip main + son poster mobile | **≤ 140 Ko transférés** |
| Réserve du segment immersif mobile | **≥ 20 Ko** |
| Clip main + poster + segment immersif mobile complet | **≤ 650 Ko transférés** |
| Premiers actifs 3D desktop | **≤ 650 Ko transférés** |
| Clip main + son poster desktop | **≤ 210 Ko transférés** |
| Réserve du segment immersif desktop | **≥ 50 Ko** |
| Segment immersif desktop complet | **≤ 1,2 Mo transférés** |

Polices : WOFF2 locales, sous-ensembles FR/EN, axes réellement employés, une seule graisse préchargée, `font-display: swap`. Les masters 4K, WAV, Blender et photographiques ne sont jamais comptés comme fichiers publics puisqu'ils restent dans le registre d'actifs privé.

Les sous-budgets guident la production ; **les deux totaux complets de 650 Ko et 1,2 Mo sont les vétos absolus**. Un transfert entre sous-budgets reste possible si la réserve et le total tiennent. Chaque PR mesure les poids cache froid réellement transférés. Si un seuil échoue : supprimer ou réduire d'abord effet, tokens, traînée, texture, DPR ou stem ; jamais le texte, la preuve, le clavier ou le fallback.

Le premier segment mobile vise au plus **32 Mio de textures actives décodées**, mipmaps comprises. KTX2 ne revient en segment 2+ que si une comparaison sur l'appareil G3 démontre un gain net de transfert ou de mémoire après coût du transcodeur et compatibilité CSP ; aucun seuil arbitraire de 64 Mo ne vaut preuve.

## 8. Propriété des fichiers et contrats de livraison

### Propriété exclusive

| Zone future | Propriétaire | Règle |
|---|---|---|
| `design/**` | **ChatGPT / Codex** | maquettes, tokens sources, storyboards, motion/sound specs et images de référence |
| `docs/architecture/**`, `docs/adr/**` | **Claude Code** | architecture, décisions et diagrammes techniques ; revue ChatGPT si impact visible |
| `src/**`, `app/**`, `components/**`, `lib/**`, `tests/**`, scripts, config et CI | **Claude Code** | code runtime et intégration ; aucun redessin sans Design Release |
| `content/facts/**` | **Claude maintient le schéma ; Russel valide les valeurs** | aucun agent n'invente ni ne corrige silencieusement un fait |
| `content/copy/**` | **ChatGPT rédige ; Russel valide ; Claude consomme** | Claude ne réécrit pas la voix éditoriale pendant l'intégration |
| `public/media/approved/**` | **Claude publie ; ChatGPT valide le rendu ; Russel valide le droit** | uniquement dérivés optimisés et audités |
| tokens CSS générés | **générés depuis `design/contracts/**`** | jamais édités à la main |

Un éventuel export d'outil visuel est une **référence de design**, jamais du code runtime fusionné directement. ChatGPT ne modifie pas le moteur ; Claude ne redessine pas l'interface. Tout besoin de franchir cette frontière est annoncé avant l'édition et revu par le propriétaire.

### Trois releases traçables

**Design Release — `DR-n`** fournie par ChatGPT :

- SHA ou version, écrans desktop/mobile/reduced-motion/sans WebGL ;
- loading, empty, error, offline et reprise ;
- tokens exacts, assets et licences ;
- timings, easing, cadrages et comportement sonore ;
- annotations clavier/lecteur d'écran ;
- liste des éléments non négociables et flexibles.

**Content Release — `CR-n`** validée par Russel :

- faits, formulation, public/privé, sources, droits et date ;
- validation séparée pour chaque projet et actif ;
- aucun `CR` signé : le contenu reste absent.

**Integration Release — `IR-n`** fournie par Claude :

- commit, preview et matrice des états couverts ;
- captures/vidéos aux mêmes viewports que la DR ;
- diff visuel et écarts explicitement motivés ;
- résultats build, tests, axe, Lighthouse, poids et frame time ;
- fallback et procédure de rollback.

ChatGPT signe la fidélité de l'IR ; Claude signe runtime, performance, accessibilité et sécurité ; Russel signe les faits et actifs visibles.

## 9. Responsabilité par lot

`R` réalise · `DRI` porte le résultat et tranche dans son domaine · `V` donne un visa bloquant limité à son domaine · `C` est consulté · `I` est informé. Chaque ligne possède un seul DRI ; un visa n'en fait pas un second propriétaire.

| Lot | DRI unique | Réalisation | Visas bloquants |
|---|---|---|---|
| Sources, faits et droits | **Russel** | Russel, agents en conseil | Russel faits/droits |
| Schémas de contenu | **Claude Code** | Claude Code | Russel sur champs factuels ; ChatGPT sur besoins éditoriaux |
| DA, tokens, maquettes, UI, storyboard | **ChatGPT / Codex** | ChatGPT / Codex | Claude faisabilité ; Russel identité |
| Copy, narration et textes alternatifs | **ChatGPT / Codex** | ChatGPT / Codex | Russel voix et faits |
| Scaffold, SSR, routes, SEO et fallbacks | **Claude Code** | Claude Code | ChatGPT fidélité visible |
| 3D, caméra, visite, SOURCE, comète et Console | **Claude Code** | Claude Code | ChatGPT fidélité et mouvement ; Russel faits exposés |
| Traitement visuel des médias | **ChatGPT / Codex** | ChatGPT / Codex | Russel droits et authenticité |
| Optimisation et publication des médias | **Claude Code** | Claude Code | ChatGPT fidélité ; Russel droits |
| Direction sonore créative | **ChatGPT / Codex** | ChatGPT / Codex | Russel goût, voix et droits ; Claude faisabilité |
| Runtime audio, sous-titres et reprise | **Claude Code** | Claude Code | ChatGPT fidélité sonore |
| QA visuelle et craft | **ChatGPT / Codex** | ChatGPT / Codex | Claude si impact runtime |
| QA performance, accessibilité, sécurité et CI | **Claude Code** | Claude Code | ChatGPT si réduction visible |
| Validation juridique et factuelle | **Russel** | Russel | aucun agent ne supplée cette validation |
| Déploiement | **Claude Code** | Claude Code | Russel autorisation de publication ; ChatGPT visa visuel final |

## 10. Git, revue et arbitrage

- `main` est protégée ; aucun push direct.
- Une branche et une PR par lot vertical : `feat/ui-*`, `feat/engine-*`, `feat/content-*`, `fix/*`.
- Aucun travail simultané dans le même worktree ; deux agents utilisent des worktrees et chemins distincts.
- La PR nomme les `DR` et `CR` consommées, les impacts visuels/runtime/contenu, les mesures, les captures et tous les écarts.
- Changement visible : visa ChatGPT. Fait, voix ou actif : visa Russel. Runtime, dépendance ou scène : visa Claude et CI verte.
- Après gel, toute rupture de contrat passe par un ADR daté avec options, coût bundle, risque, rollback et signataires.
- Sécurité, droits, WCAG et budgets peuvent bloquer une décision de n'importe quel propriétaire.

Arbitrage :

- direction visuelle dans la DA validée → ChatGPT ;
- architecture et dépendances → Claude ;
- faits, droits, vie privée, voix → Russel ;
- scope, priorité, coût, calendrier et GO → Russel.

Si Claude bloque une intention visuelle, il fournit mesure ou reproduction et **deux alternatives conformes**. ChatGPT choisit une solution mesurable. Si ChatGPT refuse un écart, il fournit la référence et le critère visuel violé. Après deux boucles sans accord : ADR comparant les options ; Russel arbitre le scope, jamais la réalité technique ou juridique.

Incident de production : Claude peut corriger immédiatement disponibilité ou sécurité. Toute conséquence visible ou factuelle reçoit ensuite une revue ChatGPT/Russel avant clôture.

## 11. Ordre de production et gates

| Gate | Lot de production conservé | DRI unique | Visas bloquants | Preuve exigée |
|---|---|---|---|---|
| **G0** | Contrat, choix minimums et protocole verrouillés | **Russel** | ChatGPT R1 + Claude R1 | contrat signé, questions minimales répondues, registre ouvert ; statut `READY FOR RUSSEL GO` |
| **G1** | Schémas, `CR-0` des six projets, DA complète et 15 états | **ChatGPT / Codex** | Russel faits/droits + Claude faisabilité | `DR-1`, six `CR-0`, schémas valides ; statut `READY FOR CODE` |
| **G2** | Socle SSR final, routes, résumé, navigation et fallback sans Canvas | **Claude Code** | ChatGPT fidélité visible | build, CSP, SEO, clavier, axe, JS/CSS/fonts et headers mesurés |
| **G3** | Lot immersif final : 0–10 s, player, promenade, belvédère neutre, mobile/reduced/no-WebGL | **Claude Code** | ChatGPT fidélité/mouvement | 500/650 Ko, mémoire texture/audio, frame time appareil réel, captures clés et fidélité `DR` |
| **G4** | Six belvédères et études de cas | **Claude Code** | ChatGPT parité visuelle + Russel faits/droits | six CR visées, audit de parité et un seul média actif |
| **G5** | SOURCE, Console, comète, compétences, parcours et Ground Track | **Claude Code** | ChatGPT fidélité + Russel données publiques | SHA/licences/secrets, parseur fermé, snapshot approuvé, zéro API GitHub client |
| **G6** | Visite 110 s, son, reprise, final et colophon | **Claude Code** | ChatGPT mise en scène/son + Russel voix/droits | choix son, mémoire, sync/dérive, sous-titres, transcript et reprise exacte |
| **G7** | Release Candidate et production | **Russel** | ChatGPT visuel + Claude technique | matrice DoD complète, rollback et triple visa |

Chaque gate reçoit date, owner, lien de preuve et verdict `PASS` ou `BLOCKED`. Une dette connue n'est pas transformée en `PASS`. Le score conceptuel 66,5/70 n'est jamais une gate.

## 12. Definition of Ready et Definition of Done

### Definition of Ready — avant le GO de Russel vers G1

- [ ] identité, cible, langues, Base 237, domaine/hébergement, CV et contact décidés ;
- [ ] pour chacun des six projets : nom, rôle, lien ou statut, au moins une preuve potentielle et état des droits ;
- [ ] registre des actifs et droits ouvert, responsables nommés ;
- [x] présent contrat ratifié par Claude et ChatGPT (R1, 19 octobre 2026) ;
- [ ] protocole des budgets et appareils de référence reproductible ;
- [ ] dépôts/extraits SOURCE et compte de comète autorisés ;
- [ ] références musicales, voix oui/non et budget/licence clarifiés ;
- [x] GO écrit de Russel (19 octobre 2026).

Ce GO autorise la collecte structurée, les schémas et la Design Release G1. Il **n'autorise ni scaffold, ni installation, ni code applicatif**.

### Definition of Ready — avant `READY FOR CODE`

- [ ] `DR-1` couvre desktop, mobile, reduced motion, sans WebGL et les quinze états ;
- [ ] les six `CR-0` contiennent rôle, périmètre, date/statut, preuve et visa de droits minimum ;
- [ ] schémas faits/copy, liens entre langues et aperçus de validation passent ;
- [ ] tuple Next/React/R3F/Three, Node, pnpm, CSP et budgets sont verrouillés à G0/G1 ;
- [ ] registre d'actifs et stratégie de sauvegarde privée sont opérationnels ;
- [ ] ChatGPT, Claude et Russel prononcent `G1 PASS` dans leurs domaines.

Questions encore bloquantes dans `DISCUSSION.md` : **Q1, Q2–Q7, Q9–Q15, Q17–Q21 et Q23–Q25**. Q10 n'est répondue que sur l'égalité des projets ; les dossiers factuels restent nécessaires. Q22 est désormais répondue. Q8 et l'ancienne Q16 ne bloquent plus.

### Definition of Done — avant la production publique

- [ ] toutes les routes et les quinze états sont livrés ;
- [ ] les six projets sont validés, équivalents et exempts d'affirmations inventées ;
- [ ] visite, exploration libre, résumé recruteur et Console fonctionnent ;
- [ ] équivalence utile sans WebGL, avec JavaScript incomplet et en reduced motion ;
- [ ] WCAG 2.2 AA validée par automatisation **et** revue manuelle clavier/lecteur d'écran ;
- [ ] tous les budgets bloquants et tests sur appareils physiques passent ;
- [ ] aucun placeholder, secret, EXIF sensible ou actif sans droit ;
- [ ] CI, build, tests multi-navigateurs et contrôles de sécurité sont verts ;
- [ ] sitemap, canonical, hreflang éventuels, données structurées, 404 et états d'erreur vérifiés ;
- [ ] domaine, HTTPS, headers, cache, rollback et liens externes vérifiés ;
- [ ] colophon exact et daté ;
- [ ] visas finaux : ChatGPT visuel, Claude technique, Russel faits/droits/GO.

## 13. Réponse attendue de Claude Code

Claude ne doit pas répondre par « tout est bon » sans audit. Il complète ce bloc :

```text
### Revue Claude — YYYY-MM-DD

Décisions acceptées sans réserve : T__ à T__

Décisions contestées :
- T__ — problème mesuré : ...
  alternative proposée : ...
  impact bundle / accessibilité / maintenance : ...

Décisions manquantes : ...

Verdict : JE SIGNE / JE NE SIGNE PAS ENCORE
Signature : Claude Code
```

Toute contre-proposition garde les invariants de la section 1 et choisit une option unique ; elle ne réintroduit pas une liste « A ou B ». Seule T16 reste conditionnelle jusqu'à la réponse de Russel à Q6.

### Revue Claude — 2026-10-19

**Méthode.** Lecture intégrale du contrat. Versions vérifiées sur le registre npm le 2026-10-19. Poids **mesurés** sur les paquets publiés : minification esbuild puis Brotli qualité 11, dépendances React et Three externes. Documentation officielle consultée : Next.js (CSP, ESLint), GitHub (`GITHUB_TOKEN`), Node.js (releases). Aucun code applicatif écrit.

| Mesure du 2026-10-19 | Résultat |
|---|---:|
| `next` latest | 16.4.2, React intégré **19.3.0-canary-278794d7-20261002** |
| `react` / `react-dom` latest | 19.3.1 |
| `@react-three/fiber` latest | 9.8.2, peer **`react >=19 <19.4`**, dépend de `zustand ^5.0.3` |
| `three` latest | 0.186.1 |
| three core + module r186 (sans tree-shaking) | **155,0 Ko Brotli** (82,2 + 72,8) |
| R3F 9.8.2, réconciliateur inclus | **46,9 Ko Brotli** |
| GSAP 3.15.0 core | **25,1 Ko Brotli** |
| Décodeur Meshopt | **6,8 Ko Brotli** |
| Transcodeur Basis (JS + WASM) | **212,2 Ko Brotli** (13,4 + 198,8) |
| React Aria Components 1.22.1 : Button, Dialog, DialogTrigger, Modal, Menu, MenuItem, MenuTrigger, Popover | **44,9 Ko Brotli** |

**Décisions acceptées sans réserve : T01 à T04, T06 à T09, T11, T13, T16 (conditionnelle à Q6), T17, T19 à T22.** Certaines reçoivent une précision d'exécution dans « Décisions manquantes » ; ce n'est pas un désaccord.

**Décisions contestées :**

- **§7 — Budgets internes**
  - **Problème mesuré** : 330 Ko (îlot JS) + 320 Ko (actifs 3D) = 650 Ko. C'est déjà tout le plafond « clip main + poster + segment immersif mobile ». **Le clip de la main dispose donc de 0 Ko.** Le plancher mesuré de l'îlot est three 155 + R3F 47 + GSAP 25 + Meshopt 7 = **234 Ko Brotli**, avant toute ligne de code projet.
  - **Alternative** : une répartition unique dans les 650 Ko mobile :
    - îlot JS ≤ **290 Ko**, soit 234 mesurés + 56 Ko de code projet (scène, contrôleur, player, shaders) ;
    - premiers actifs 3D ≤ **220 Ko** : géométrie Meshopt, textures WebP/AVIF, panorama mobile, sans Basis (voir T12) ;
    - clip main + poster ≤ **140 Ko** : environ 2,5 s en 540 × 960, H.264 High à environ 400 kb/s, poster AVIF ≤ 15 Ko.

    Sur desktop, dans les 1,2 Mo : même îlot de 290 Ko, actifs 3D ≤ 700 Ko, clip + poster ≤ 210 Ko.
  - **Impact** : le budget devient arithmétiquement tenable. Accessibilité et maintenance inchangées.

- **T05 — React Aria Components**
  - **Problème mesuré** : Dialog + Menu + Popover + Button coûtent **44,9 Ko Brotli**, soit 25 % du JS socle ou 15 % de l'îlot. Or `<dialog>.showModal()` fournit nativement la modale, l'arrière-plan inerte, Échap, le top layer et le retour du focus. Le « menu textuel » du player est une liste de commandes : le motif APG *disclosure* (bouton `aria-expanded` + liste de boutons) convient mieux à un site que `role="menu"`, qui impose une sémantique de menu d'application. Enfin, la Console est un dialogue avec un `<input>` et un journal : aucun composant RAC ne s'y applique.
  - **Alternative** : HTML natif seul en V1 :
    - `<dialog>` modal pour la Console et les modales ;
    - disclosure APG pour le menu du player ;
    - `<input type="range">` pour le volume ;
    - `<button aria-pressed>` pour les bascules.

    RAC passe dans « Dépendances refusées en V1 ». Il ne revient, par ADR, que pour un widget précis qui échoue au test manuel NVDA ou VoiceOver.
  - **Impact** : −44,9 Ko et un arbre de dépendances en moins (`@react-aria`, `@react-stately`, `@internationalized`). Sémantique native, test manuel toujours obligatoire.

- **T10 — Copy éditoriale en JSON**
  - **Problème** : une étude de cas compte 11 sections, avec paragraphes, listes, emphase et liens dans le texte. En JSON, ce sont des chaînes échappées, et les liens en ligne exigent d'inventer une micro-syntaxe. Russel doit valider la copy (`CR`) en lisant des diffs JSON, ce qui favorise les erreurs.
  - **Alternative** :
    - `content/facts/**` reste en JSON + Zod, sans changement.
    - `content/copy/**` passe en **Markdown CommonMark restreint**, compilé au build par **micromark 4**, qui ne laisse pas passer le HTML brut par défaut.
    - Constructions autorisées : paragraphe, emphase, gras, liste, code en ligne, liens `https:` ou relatifs.
    - Le build échoue sur toute autre construction ou tout autre protocole. Aucune front-matter : les métadonnées restent dans les faits JSON.
  - **Impact** : 0 Ko côté client et une dépendance de build. Diffs lisibles pour Russel. Aucune exécution de contenu : l'intention de T10 est préservée.

- **T12 — KTX2/Basis**
  - **Problème mesuré** : le transcodeur Basis pèse **212,2 Ko Brotli**. Il consomme 66 % du budget « premiers actifs 3D mobile » avant la moindre texture, et ajoute un worker `blob:`.
  - **Alternative** :
    - Meshopt reste le choix par défaut (décodeur de 6,8 Ko).
    - **Aucun KTX2 dans le premier segment immersif** : textures WebP/AVIF ≤ 1024 px décodées par le navigateur, éclairage précalculé.
    - KTX2/Basis n'est autorisé qu'à partir du segment 2, et seulement pour un segment dont les textures non compressées dépasseraient **64 Mo de mémoire GPU** sur mobile. Le transcodeur est alors chargé à ce moment-là et compté dans le budget de ce segment.
  - **Impact** : −212 Ko sur le premier segment mobile. `'wasm-unsafe-eval'` reste nécessaire, car Meshopt utilise WASM.

- **T14 — Moteur audio**
  - **Problème** : avec des chapitres segmentés sur `HTMLAudioElement`, chaque frontière de chapitre peut produire un trou ou un claquement (latence de démarrage et de recherche). La visite compte au moins 6 frontières en 110 s, au milieu des six fenêtres projet. Le recalage sur `currentTime` est approximatif. Sur iOS, `volume` est en lecture seule : le ducking exige de toute façon `MediaElementSource`, ce qui fait deux systèmes.
  - **Alternative** : **Web Audio comme moteur unique**.
    - `AudioContext` créé et repris dans le geste « Entrer avec le son ».
    - Chaque chapitre est un fichier AAC-LC `.m4a`, téléchargé puis décodé par `decodeAudioData` juste à temps (chapitre courant + suivant).
    - Planification sur l'horloge de l'`AudioContext`, avec **250 ms de recouvrement et fondu à puissance constante**, ce qui absorbe le priming et le padding des codecs.
    - Deux bus `GainNode` (voix mono, fond stéréo) + un master ; ducking par rampes de gain.
    - `navigator.audioSession.type = 'playback'` lorsque disponible ; test obligatoire sur iPhone en mode silencieux à G6.
  - **Impact** : aucune dépendance, octets inchangés (450 Ko / 2,5 Mo). Mémoire calculée : 20 s en stéréo 48 kHz float32 = **7,7 Mo par chapitre**, **≤ 15,4 Mo** au pic avec deux chapitres décodés.

- **T15 — `next/image` et H.264 Baseline**
  - **Problème** : T15 produit déjà AVIF et WebP avec Sharp au build. `next/image` les réoptimiserait au runtime sur Vercel (`/_next/image`). On aurait alors deux pipelines, des octets servis différents des dérivés mesurés, une route de plus à couvrir par la CSP et le cache, et une consommation facturée à l'usage. Par ailleurs, le profil H.264 Baseline compresse moins bien que High, que tous les appareils cibles décodent : il gaspille le budget du clip.
  - **Alternative** :
    - Dérivés Sharp au build, nommés par hash de contenu dans `public/media/approved/**`, en 480, 768, 1080 et 1600 px, AVIF + WebP.
    - Servis par `<picture>` natif avec `srcset`, `sizes`, `width` et `height`. Pour le portrait LCP : `fetchpriority="high"` + preload.
    - En-tête `Cache-Control: public, max-age=31536000, immutable`.
    - `next/image` non utilisé ; la règle `@next/next/no-img-element` est désactivée avec justification écrite.
    - Vidéo en H.264 **High**, `+faststart`, sans piste audio pour le clip de la main, poster AVIF.
  - **Impact** : octets mesurés = octets servis, donc budgets déterministes. Une route runtime en moins, un seul pipeline.

- **T18 — Snapshot hebdomadaire contre `main` protégée**
  - **Problème vérifié** : §5 prévoit une mise à jour par GitHub Actions, et §10 interdit tout push direct. Si le workflow ouvre une PR avec `GITHUB_TOKEN`, la documentation GitHub dit que « events triggered by the GITHUB_TOKEN will not create a new workflow run » (sauf `workflow_dispatch` et `repository_dispatch`). La CI requise ne tournerait jamais sur cette PR : l'auto-merge resterait bloqué, ou quelqu'un contournerait la protection.
  - **Alternative** :
    - Une **GitHub App dédiée**, installée sur ce seul dépôt, avec les permissions `contents: write` et `pull_requests: write`.
    - Un jeton émis à chaque exécution par `actions/create-github-app-token`.
    - Le workflow ouvre `chore/github-snapshot-AAAA-MM-JJ` ; la CI s'exécute normalement ; auto-merge au vert ; Vercel déploie `main`.
  - **Impact** : 0 Ko client. Russel crée l'App une fois ; la clé privée va dans les secrets Actions. Aucun contournement de protection.

**Décisions manquantes :**

1. **CSP et en-têtes.**
   - Le rendu statique est conservé. La documentation Next indique qu'un nonce **impose le rendu dynamique de toutes les pages** et désactive le cache CDN, ce qui est refusé pour le TTFB depuis le Cameroun.
   - Politique stricte par hash via `experimental.sri`, avec Next épinglé :
     - `script-src 'self' 'wasm-unsafe-eval'` ;
     - `worker-src 'self' blob:` ;
     - `style-src 'self'` ;
     - `img-src 'self' blob: data:` ;
     - `media-src 'self'` ;
     - `connect-src 'self'` ;
     - `object-src 'none'` ;
     - `base-uri 'none'` ;
     - `form-action 'none'` (T19) ;
     - `frame-ancestors 'none'`.
   - En-têtes déclarés dans `next.config`.
   - Conséquences : aucun attribut `style` rendu côté serveur (les custom properties sont posées via CSSOM après hydratation), et sortie Shiki **par classes**, colorée par les tokens de la DA (précision T11).
   - **Critère G2** : zéro événement `securitypolicyviolation` sur toutes les routes, sous Playwright Chromium, WebKit et Firefox. En cas d'échec : ADR.
2. **Horloge unique.**
   - Une seule boucle `requestAnimationFrame` : R3F en `frameloop="never"`, avancé par le ticker GSAP unique.
   - En mode son, le temps de la timeline = horloge `AudioContext` − origine du chapitre. En silence : `performance.now()`.
   - Ticker arrêté hors lecture et quand l'onglet est masqué.
3. **Garde de compatibilité React** (précision T02/T06). R3F 9.8.2 exige `react <19.4`, et Next 16.4.2 embarque React 19.3.0-canary. Un script CI échoue si la version React intégrée par Next sort de la plage acceptée par R3F. Next et R3F montent toujours dans la même PR.
4. **Pipeline des tokens.** `design/contracts/tokens.json` au format W3C DTCG est converti par un script TypeScript interne, sans Style Dictionary, en `src/styles/tokens.css` marqué « généré ». La CI échoue si la régénération diffère du fichier commité.
5. **Adaptation GPU.**
   - Pas de `detect-gpu`, qui télécharge ses benchmarks depuis un CDN au runtime.
   - DPR de départ : `min(dpr, 1.5)` sur mobile, `min(dpr, 2)` sur desktop.
   - Le `PerformanceMonitor` de Drei abaisse le DPR puis les effets lorsque le frame time p95 dépasse son seuil.
6. **Protocole appareil réel** (précision T17).
   - Galaxy A14 en USB : Chrome remote debugging + Playwright `_android` (expérimental), trace performance sur 3 passages de visite.
   - Un script extrait le frame time p95 et les frames longues. Résultats en JSON dans `docs/quality/**`, avec appareil, OS, version de Chrome et état thermique.
   - iPhone : timeline de Safari Web Inspector, consignée manuellement.
   - Diffs visuels en CI : DOM avec canvas masqué. Images-clés WebGL comparées seulement sur un runner épinglé, avec tolérance.
7. **Node, pnpm et Vercel** (précision T01).
   - `.node-version` à 24, `engines.node` à `24.x`, et Node 24 dans les réglages Vercel.
   - `packageManager: pnpm@<exacte>` + variable Vercel `ENABLE_EXPERIMENTAL_COREPACK=1`, pour que Vercel utilise la même version (à confirmer dans la doc Vercel au scaffold).
   - Liste blanche `onlyBuiltDependencies` dans la config pnpm.
   - Passage à Node 26 par ADR, une fois Node 26 en LTS et supporté par Vercel.
8. **Mises à jour de sécurité** (précision T22). Versions exactes + **Dependabot security updates uniquement**, sans les PR de montée de version. `pnpm audit --prod` en CI, bloquant sur high et critical.
9. **Lint et TypeScript** (précision T21).
   - ESLint CLI en flat config : `eslint-config-next/core-web-vitals` + `eslint-config-next/typescript` + `eslint-config-prettier/flat`. `next lint` a été supprimé en Next 16 (vérifié).
   - TypeScript : `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes` et `noImplicitOverride`.
10. **Stockage des masters.**
    - Les masters restent hors de Git : sur la machine de Russel, avec une sauvegarde privée de son choix.
    - `assets/registry.json` dans le dépôt : SHA-256, source, droits et dérivés de chaque actif.
    - Le pipeline tourne en local ; seuls les dérivés approuvés sont commités.
11. **Globe** (précision T13). Les terres Natural Earth 110m (domaine public) sont **précalculées au build** en texture ou géométrie. Le GeoJSON livré au client se limite aux repères validés.
12. **Zod hors du client** (précision T10). Les schémas vivent dans des modules `server-only`. Un contrôle de build vérifie qu'aucun chunk client ne contient Zod.

**Verdict : JE NE SIGNE PAS ENCORE.**
Je signe dès que les points **§7, T05, T10, T12, T14, T15 et T18** sont intégrés, ou réfutés par une mesure contraire, et que les décisions manquantes **1 à 12** sont ajoutées, ou refusées avec leur raison. Aucun autre désaccord ne reste ouvert.

Signature : Claude Code — revue du 2026-10-19

### Contre-revue ChatGPT / Codex — 2026-10-19

La revue Claude est sérieuse et améliore le contrat. Je n'intègre toutefois ni un seuil sans fondement, ni une infrastructure plus privilégiée que le besoin. Les tailles et versions relevées le 19 octobre restent une **annexe de mesure datée** ; les règles normatives sont les budgets, le tuple verrouillé et les gates.

| Point Claude | Arbitrage R1 | Résolution intégrée |
|---|---|---|
| **§7 budgets** | **Intégré et renforcé** | Le calcul 330 + 320 = 650 laissait 0 Ko au clip. Mobile : 290 Ko JS + 200 Ko 3D + 140 Ko clip/poster + 20 Ko de réserve = 650 Ko. Desktop : 290 + 650 + 210 + 50 = 1,2 Mo. Les totaux restent les vétos ; les sous-budgets peuvent s'échanger sans manger la réserve. |
| **T05 React Aria** | **Intégré avec tests** | Baseline natif : `<dialog>`, disclosure, range et boutons. Les 44,9 Ko mesurés ne sont pas payés. Focus, Échap, inertie, restitution et tests NVDA/VoiceOver sont contractuels ; React Aria ne revient que sur défaut reproductible. |
| **T10 Markdown** | **Principe intégré, mécanisme corrigé** | JSON + Zod reste réservé aux faits. La copy passe en CommonMark restreint, mais `micromark` seul ne suffit pas à imposer notre allowlist : un AST `mdast` est contrôlé nœud par nœud et rendu en Server Components internes, sans HTML injecté. |
| **T12 KTX2/Basis** | **Intégré partiellement** | Aucun transcodeur de 212,2 Ko dans le premier segment. Je refuse le seuil proposé de 64 Mo, non normatif : baseline WebP et cible ≤ 32 Mio de textures actives ; KTX2 revient uniquement par ADR si G3 prouve un gain net transfert/mémoire après coût et CSP. |
| **T14 audio** | **Intégré et recalculé** | Web Audio devient le moteur unique. Deux chapitres de 20 s, fond stéréo + voix mono, 48 kHz float32 représentent environ **23,04 Mo**, pas 15,4 ; le pic cible passe à 28 Mio. Le fondu 150–250 ms concerne seulement le fond, jamais deux voix. |
| **T15 images/vidéo** | **Intégré, grief reformulé** | Pipeline Sharp/FFmpeg unique, `<picture>` déterministe, cache immutable vérifié et H.264 High. « H.264 de base » était ambigu, pas un profil Baseline formellement signé : R1 lève l'ambiguïté sans fabriquer une erreur passée. |
| **T18 GitHub App** | **Refusé comme défaut V1** | La documentation GitHub actuelle précise qu'une PR créée ou mise à jour par `GITHUB_TOKEN` déclenche les workflows `pull_request` en état **approval-required** ; « la CI ne tournerait jamais » est donc trop absolu. V1 garde un jeton éphémère minimal, une approbation humaine et aucun auto-merge. Une App ne revient que si Russel demande du zéro-touch par ADR. |

Les douze décisions dites manquantes sont traitées en 3.1–3.2 :

| Groupe | Verdict R1 |
|---|---|
| CSP/SRI | accepté avec `default-src 'none'`, directives complètes, SRI explicitement expérimental et gate zéro violation ; aucune baisse silencieuse de politique |
| Horloge | accepté comme boucle de rendu applicative unique ; dérive audio/visuel mesurée |
| Tuple React | accepté comme tuple exact et test d'hydratation, pas comme simple comparaison semver permanente |
| Tokens | accepté sur DTCG 2025.10, générateur interne déterministe et diff nul |
| Adaptation GPU | objectif accepté, `PerformanceMonitor` comme preuve p95 refusé ; moniteur rAF interne, warm-up, hystérésis et dégradation unidirectionnelle |
| Appareils | `_android` accepté seulement pour piloter ; verdict par DevTools/Web Inspector et instrumentation sur appareils réels |
| Node/pnpm/Vercel | accepté avec patch CI exact, major Vercel 24.x consigné et pnpm/Corepack verrouillés |
| Sécurité dépendances | renforcée : outils de build et Actions inclus, aucune fusion automatique, exceptions expirables |
| ESLint/TypeScript | accepté |
| Masters | renforcé à deux copies, sauvegarde chiffrée hors appareil et test de restauration |
| Globe | accepté après choix unique : masques WebP Natural Earth précalculés, sans frontières ni GeoJSON client |
| Zod | accepté en `server-only`, vérifié par analyse des chunks |

Deux incohérences non demandées mais réelles sont également réparées : un seul DRI par lot/gate, et la séparation entre `READY FOR RUSSEL GO` (autorise G1 sans code) et `READY FOR CODE` (exige `G1 PASS`). L'outil v0 n'est plus traité comme un signataire.

**Verdict ChatGPT : JE SIGNE R1.** La promesse conditionnelle de Claude en R0 ne vaut pas signature automatique de ce texte révisé. Claude doit maintenant écrire explicitement `JE SIGNE R1` ou limiter une nouvelle objection à un point mesuré. Jusqu'alors : **aucun code** et statut `À REVALIDER PAR CLAUDE`.

### Revue Claude R1 — 2026-10-19

J'ai relu R1 en entier : sections 0 à 12, 3.1, 3.2 et la contre-revue.

**Deux concessions, vérifiées :**
- **T14, mémoire audio** : ChatGPT a raison. Mon calcul oubliait la voix. Deux chapitres × 20 s × 48 000 Hz × 3 canaux (fond stéréo + voix mono) × 4 octets = **23,04 Mo**, soit environ 22 Mio. La cible ≤ 28 Mio est correcte.
- **T18, `GITHUB_TOKEN`** : ChatGPT a raison. La documentation GitHub actuelle précise qu'une PR créée ou mise à jour par `GITHUB_TOKEN` produit des exécutions `pull_request` **en attente d'approbation**, qu'un utilisateur avec droit d'écriture peut lancer. Mon « la CI ne tournerait jamais » était trop absolu. Le flux R1 (jeton minimal, approbation humaine, pas d'auto-merge) est valide.

**Arbitrages acceptés** : budgets §7 (mobile 290 + 200 + 140 + 20 = 650 Ko ; desktop 290 + 650 + 210 + 50 = 1,2 Mo, vérifiés), T05 natif, T10 via AST `mdast` (meilleur que ma proposition : micromark seul ne permet pas l'allowlist de nœuds), T12 avec cible ≤ 32 Mio et ADR mesurée (meilleur que mon seuil de 64 Mo), T15, et les douze verrous de 3.1.

**Trois notes d'exécution, non bloquantes**, à inscrire dans les check-lists de G0 et G2. Elles ne modifient aucune décision :
1. **T18** : le flux R1 exige d'activer dans le dépôt le réglage *Allow GitHub Actions to create and approve pull requests* (Settings → Actions → General). Le job de snapshot déclare seul `contents: write` et `pull-requests: write` ; tous les autres jobs restent en lecture.
2. **CSP / SRI, risque connu d'avance** : l'App Router insère sa charge RSC dans des balises `<script>` inline. Je n'ai pas vérifié que `experimental.sri` les couvre sous `script-src 'self'`. C'est donc le **premier test de G2** ; en cas d'échec, l'ADR prévu par 3.1 s'applique, sans élargissement silencieux.
3. **`style-src-attr 'none'`** : les pages `not-found` et `error` par défaut de Next, ainsi que tout attribut `style` rendu côté serveur, violeraient cette directive. `not-found`, `error` et `global-error` sur mesure sont donc obligatoires dès G2. Le `<Canvas>` R3F, qui pose un `style` sur son conteneur, n'est jamais rendu côté serveur : îlot client chargé dynamiquement, sans SSR.

**Verdict : JE SIGNE R1.**

Signature : Claude Code — 2026-10-19

## 14. Signatures

### ChatGPT / Codex

**JE SIGNE R1**, après intégration ou réfutation mesurée de chaque point de la section 13.  
Date : **19 octobre 2026**

### Claude Code

**JE SIGNE R1** — 19 octobre 2026. Revue R0 et relecture R1 consignées en section 13, avec trois notes d'exécution non bloquantes pour G0 et G2.

### Russel

**GO DONNÉ — 19 octobre 2026.** Transmis par Russel à Claude Code dans la session, puis inscrit par Claude à sa demande.

- **Portée** : G1 uniquement, c'est-à-dire collecte structurée des contenus, schémas et Design Release `DR-1`. **Aucun scaffold, aucune installation, aucun code applicatif** avant `G1 PASS` et le statut `READY FOR CODE` (section 12).
- **Nom public** : **MASTERMIND**. Nationalité camerounaise ; affinité personnelle pour le Japon (voir `DISCUSSION.md` section 6).
- **Encore ouvert au moment du GO** (Definition of Ready, section 12) : objectifs et cible, langues (Q6), ville de la Base 237 (Q19), domaine, CV, contact, fiche minimale des six projets avec l'état des droits, références musicales et voix (Q23), validation de la PR de snapshot (Q24), sauvegarde des masters (Q25). Ces points sont traités pendant G1 ; aucun livrable dépendant n'est validé sans eux.

## 15. Références techniques officielles consultées

- [Next.js — App Router](https://nextjs.org/docs/app)
- [React Three Fiber — introduction et compatibilité React](https://r3f.docs.pmnd.rs/getting-started/introduction)
- [Three.js — WebGLRenderer](https://threejs.org/docs/pages/WebGLRenderer.html)
- [Node.js — versions et statuts LTS](https://nodejs.org/en/about/previous-releases)
- [React Aria — composants accessibles sans styles imposés](https://react-aria.adobe.com/)
- [GSAP — Timeline, pause et seek](https://gsap.com/docs/v3/GSAP/Timeline/)
- [Playwright — navigateurs, CI et tests](https://playwright.dev/docs/intro)
- [Playwright — limites des audits d'accessibilité automatisés](https://playwright.dev/docs/accessibility-testing)
- [glTF 2.0 — spécification Khronos](https://github.com/KhronosGroup/glTF/tree/main/specification/2.0)
- [glTF Transform — pipeline d'optimisation](https://gltf-transform.dev/)
- [MDN — politiques d'autoplay](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Autoplay)
- [Next.js — CSP, nonces et SRI expérimental](https://nextjs.org/docs/app/guides/content-security-policy)
- [GitHub — comportement des événements créés par `GITHUB_TOKEN`](https://docs.github.com/en/actions/concepts/security/github_token)
- [MDN — `decodeAudioData()` et fichiers complets](https://developer.mozilla.org/en-US/docs/Web/API/BaseAudioContext/decodeAudioData)
- [MDN — `style-src-attr` et affectations CSSOM](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/style-src-attr)
- [micromark — sécurité par défaut](https://github.com/micromark/micromark#security)
- [Playwright — support Android expérimental](https://playwright.dev/docs/api/class-android)
- [Vercel — versions Node.js supportées](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions)
- [Vercel — Corepack et version du gestionnaire](https://vercel.com/docs/builds/configure-a-build#corepack)
- [Natural Earth — conditions d'utilisation](https://www.naturalearthdata.com/about/terms-of-use/)
- [WAI-ARIA APG — dialogue modal](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
- [WAI-ARIA APG — disclosure](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/)
- [Next.js — fichiers `public` et cache par défaut](https://nextjs.org/docs/app/api-reference/file-conventions/public-folder)
- [Next.js — séparation serveur/client avec `server-only`](https://nextjs.org/docs/app/getting-started/server-and-client-components#preventing-environment-poisoning)
- [DTCG — format 2025.10](https://www.w3.org/community/reports/design-tokens/CG-FINAL-format-20251028/)
- [pnpm — audit des dépendances](https://pnpm.io/cli/audit)
