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
| 4 | fait | build en échec sur un fait requis privé ou une release en `draft` (deux essais) ; faits privés facultatifs omis ; gardes de `scripts/build.ts` : aucun module serveur dans les chunks clients (essayée avec Zod importé dans un îlot) et aucun texte de fait privé dans le HTML, le RSC ou les chunks (essayée avec un fait confidentiel ajouté à une page). Copy : chargeur `server-only` et rendu React des sections visées (`SCHEMAS_G1.md`, section 7), allowlist mdast couverte par 13 tests unitaires, essais de bout en bout sur des fichiers temporaires (légende rendue, section non visée absente, fait privé supposé et HTML brut refusés) |
| 5 | fait, sauf `/cv.pdf` | HTML complet sans JavaScript, `title`, description et URL canonique par route, `sitemap.xml`, `robots.txt`, 404 réelle sur un slug inconnu |
| 6 | fait pour les routes G2 | lien d'évitement visible au focus puis focus sur `main`, navigation principale et pied de page testés au clavier ; le parcours de la visite, du player et des dialogues suit en G3 |
| 7 | fait | `scripts/media.ts` (Sharp) : dérivés AVIF et WebP déterministes, nommés par empreinte, vérifiés en CI par `pnpm media:check` sans les masters, servis en cache immuable. Accueil : décor d'aube plein cadre (élément LCP mesuré, 44 à 48 Ko) et portrait détouré (14 à 21 Ko, seule image préchargée) ; aucun étalonnage appliqué, celui du portrait (dominante rose, reflet rouge du doigt) reste à décider par Codex. Six projets : captures réelles bureau et mobile dans les études de cas et la visite légère, au cadrage des références visées par Russel (écart moyen ≤ 1,8/255 avec les WebP de la DR-1), un seul média visible et son propre texte alternatif |
| 8 | fait | `scripts/font-subset.sh` : DM Sans officielle, wght 400–600, opsz 9–40, jeu latin du français, 33,2 Ko WOFF2, sortie déterministe ; seule police préchargée, `font-display: swap`, cache immuable sur le seul nom à empreinte ; licence OFL servie et citée dans Sources & fabrication |
| 9 | fait | CI verte sur la PR #3 le 23 octobre 2026 (run `39954347831`, 2 min 44 s) : audits, types, tests unitaires, lint, format, jetons, dérivés d'images, build en deux passes avec ses gardes, puis parcours Playwright, CSP et axe sur **Chromium, Firefox et WebKit** |
| 10 | en cours | aucun débordement horizontal à 320, 390 et 1440 px. Mesures locales : JS client ≈ 119 Ko en Brotli q11 sur `/` (154 Ko avec les polyfills `nomodule`, que les navigateurs modernes ne téléchargent pas), CSS 3,3 Ko, HTML 2,5 à 3,7 Ko, en-têtes 1,9 Ko dont 1,3 Ko de CSP. Accueil à froid, compression gzip de `next start` : 325 Ko transférés en 1440 × 900 et 328 Ko en 390 × 844 (dont 55 Ko de préchargement RSC des liens visibles), pour 500 Ko au budget ; LCP local ≈ 0,13 s, élément LCP : le portrait. Lighthouse 13.5 local (throttling simulé) sur `/`, une étude de cas et le résumé : accessibilité, bonnes pratiques et SEO à 100 ; performance 99–100 en desktop, 86–95 en mobile, LCP mobile simulé 1,7 à 2,7 s (cible ≤ 2,5 s, à confirmer sur le CDN). Une seule capture téléchargée par format, ni favicon en 404, ni portrait préchargé hors de l'accueil. À refaire à froid sur la preview Vercel (`pnpm ir0`) avant l'IR-0 |

### Textes attendus de `content/copy/` (Codex rédige, Russel valide)

Les pages n'affichent que des faits validés et des libellés d'interface. Les phrases éditoriales des vues de contrôle restent absentes jusqu'à leur Content Release : accroche de l'accueil (A01), phrase du parcours (A09), phrase de chaque étude de cas (A06), phrase de Sources & fabrication (A13), phrases de la visite sans WebGL (A04), phrase finale (A12).

### Libellés d'interface à confirmer par Codex à l'IR-0

Repris des vues de contrôle : « Aller au contenu », « Commencer la visite », « Explorer librement », « Registre des six projets », « Étude de cas · 01 / 06 », « Périmètre validé », « Preuve publique », « Parcours · dates validées », « Résumé recruteur », « Poste actuel », « Six produits », « Imprimer cette page », « Copier l'adresse », « Sources & fabrication ».

Proposés par Claude, faute de vue : navigation « Projets · Résumé · Contact » (le CV la rejoindra), pied de page « Visite · Parcours · Sources & fabrication · Mentions légales · GitHub », titres « Six stations », « Parcours », « Me contacter », « Sources des faits », « Mentions légales », rubriques « Décisions », « Repères », « Besoin » et « Étude », pages d'erreur (« Page introuvable », « Cette page n'a pas pu s'afficher », « Le site n'a pas pu s'afficher ») et descriptions des métadonnées. Les mentions légales (hébergeur Vercel, absence de cookie, de mesure d'audience et de formulaire) décrivent le runtime ; Russel les valide avant la production.

Les dérivés de police et d'images seront inscrits au registre d'actifs lors de sa révision G2 (IR-0) : le manifeste DR-1 fige le registre G1-R5 par son empreinte, il n'est donc pas modifié en cours de lot.

À confirmer par Codex : les textes alternatifs des deux captures de ZIRIS, écrits par Claude faute de référence dans `12_MEDIAS_PROJETS_C3.md`, et la bande blanche du bas des deux captures ZIRIS visées, conservée telle quelle.

Absents en attendant leur source : les quatre domaines prouvés du résumé recruteur (aucun fait validé ne relie encore domaine et projets), le favicon (variante du monogramme à dériver par Codex, `08_MONOGRAMME_TRACE_237.md`).
