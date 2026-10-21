# Plan G2 — socle SSR, routes, résumé recruteur, navigation et fallback sans Canvas

DRI : Claude Code. Visa bloquant : ChatGPT / Codex sur la fidélité visible (contrat, sections 9 et 11). Branche : `feat/engine-g2-socle`.

## Preuves exigées pour fermer G2 (contrat, section 11)

Build, CSP, SEO, clavier, axe, et poids JS / CSS / polices / en-têtes mesurés.

## Étapes

| # | Étape | Critère de sortie |
|---:|---|---|
| 1 | Tuple et outillage : Node 24.22.1, pnpm 12.14.0, Next 16.4.2, React 19.3.1, TypeScript 6.0.3, ESLint plat, Prettier (`docs/adr/ADR-002-tuple-technique-g2.md`) | installation reproductible, lockfile commité, une seule version de React résolue |
| 2 | **Test CSP/SRI en premier** : politique stricte du contrat, `experimental.sri`, page statique avec un îlot client | zéro `securitypolicyviolation`, îlot hydraté ; sinon ADR avant toute suite |
| 3 | Tokens : script TypeScript interne `design/contracts/tokens.json` → `src/styles/tokens.css` généré | régénération identique au fichier commité |
| 4 | Faits : chargeurs Zod `server-only` pour le profil et les six projets depuis `content/facts/` | build en échec sur un fait non approuvé ou privé ; aucun Zod dans les chunks clients |
| 5 | Routes : `/`, `/visite`, `/projets`, `/projets/[slug]`, `/parcours`, `/resume-recruteur`, `/fabrication`, `/contact`, `/mentions`, `not-found`, `error`, `global-error` ; `/cv.pdf` reporté avec le CV | HTML complet sans JavaScript, métadonnées et URL canoniques |
| 6 | Navigation, lien d'évitement, focus visible, ordre DOM conforme à `04_MOUVEMENT_SON_ACCESSIBILITE.md` | parcours clavier complet |
| 7 | Fallback sans Canvas : poster d'aube, portrait détouré, mêmes faits et actions | identique avec WebGL coupé |
| 8 | Polices DM Sans auto-hébergées, sous-ensemble français, une graisse préchargée | ≤ 100 Ko |
| 9 | Tests : Playwright sur Chromium, WebKit et Firefox, `@axe-core/playwright`, CSP sur toutes les routes | CI verte |
| 10 | Mesures et IR-0 : poids transférés à froid, captures aux viewports de la DR-1 | dossier `docs/quality/` et visa Codex |

## Suivi

| # | État au 21 octobre 2026 | Preuve |
|---:|---|---|
| 1 | fait | `pnpm install --frozen-lockfile`, une seule version de React |
| 2 | fait, ADR-003 | zéro violation CSP sur les 16 routes testées (pages, six études de cas, 404), îlot de `/contact` hydraté |
| 3 | fait | `pnpm tokens:check` |
| 4 | fait | build en échec sur un fait requis privé ou une release en `draft` (deux essais) ; faits privés facultatifs omis ; garde « aucun module serveur dans les chunks clients » dans `scripts/build.ts`, essayée avec Zod importé dans un îlot |
| 5 | fait, sauf `/cv.pdf` | HTML complet sans JavaScript, `title`, description et URL canonique par route, `sitemap.xml`, `robots.txt`, 404 réelle sur un slug inconnu |
| 6 | fait pour les routes G2 | lien d'évitement visible au focus puis focus sur `main`, navigation principale et pied de page testés au clavier ; le parcours de la visite, du player et des dialogues suit en G3 |
| 7 | à faire | dérivés d'actifs à publier |
| 8 | fait | `scripts/font-subset.sh` : DM Sans officielle, wght 400–600, opsz 9–40, jeu latin du français, 33,2 Ko WOFF2, sortie déterministe ; seule police préchargée, `font-display: swap`, cache immuable sur le seul nom à empreinte ; licence OFL servie et citée dans Sources & fabrication |
| 9 | en cours | `pnpm test:e2e` : 64 tests verts sur Chromium et Firefox en local (CSP nulle et axe WCAG 2.2 AA nul sur les 14 routes, 404 réelles, HTML complet sans JavaScript, clavier, îlot hydraté, impression) ; WebKit demande des bibliothèques système absentes de ce poste, la CI les installe ; `.github/workflows/ci.yml` à vérifier au premier push |
| 10 | en cours | aucun débordement horizontal à 320, 390 et 1440 px ; mesures locales Brotli q11 : JS client ≈ 119 Ko sur `/` (154 Ko avec les polyfills `nomodule`, que les navigateurs modernes ne téléchargent pas), CSS 3,3 Ko, HTML 2,5 à 3,7 Ko, en-têtes 1,9 Ko dont 1,3 Ko de CSP ; à refaire à froid sur la preview Vercel |

### Textes attendus de `content/copy/` (Codex rédige, Russel valide)

Les pages n'affichent que des faits validés et des libellés d'interface. Les phrases éditoriales des vues de contrôle restent absentes jusqu'à leur Content Release : accroche de l'accueil (A01), phrase du parcours (A09), phrase de chaque étude de cas (A06), phrase de Sources & fabrication (A13), phrases de la visite sans WebGL (A04), phrase finale (A12).

### Libellés d'interface à confirmer par Codex à l'IR-0

Repris des vues de contrôle : « Aller au contenu », « Commencer la visite », « Explorer librement », « Registre des six projets », « Étude de cas · 01 / 06 », « Périmètre validé », « Preuve publique », « Parcours · dates validées », « Résumé recruteur », « Poste actuel », « Six produits », « Imprimer cette page », « Copier l'adresse », « Sources & fabrication ».

Proposés par Claude, faute de vue : navigation « Projets · Résumé · Contact » (le CV la rejoindra), pied de page « Visite · Parcours · Sources & fabrication · Mentions légales · GitHub », titres « Six stations », « Parcours », « Me contacter », « Sources des faits », « Mentions légales », rubriques « Décisions » et « Repères », pages d'erreur (« Page introuvable », « Cette page n'a pas pu s'afficher », « Le site n'a pas pu s'afficher ») et descriptions des métadonnées. Les mentions légales (hébergeur Vercel, absence de cookie, de mesure d'audience et de formulaire) décrivent le runtime ; Russel les valide avant la production.

Le dérivé de police sera inscrit au registre d'actifs lors de sa révision G2 (IR-0) : le manifeste DR-1 fige le registre G1-R5 par son empreinte, il n'est donc pas modifié en cours de lot.

Absents en attendant leur source : les quatre domaines prouvés du résumé recruteur (aucun fait validé ne relie encore domaine et projets), le média de chaque projet, le portrait détouré et le favicon (variante du monogramme à dériver par Codex, `08_MONOGRAMME_TRACE_237.md`).
